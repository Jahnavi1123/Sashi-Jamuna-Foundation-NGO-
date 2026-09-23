"""Create browser-ready copies and posters, leaving supplied videos untouched."""
import concurrent.futures
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = subprocess.check_output(
    ["node", "-p", "require('ffmpeg-static')"], cwd=ROOT, text=True
).strip()
SOURCE = ROOT / "sjf videos"
OUTPUT = ROOT / "assets/videos"
POSTERS = ROOT / "assets/images/video-posters"
OUTPUT.mkdir(parents=True, exist_ok=True)
POSTERS.mkdir(parents=True, exist_ok=True)


def run(args):
    result = subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", *args],
                            capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr)


def media_info(path):
    result = subprocess.run([FFMPEG, "-hide_banner", "-i", str(path)],
                            capture_output=True, text=True)
    return result.stderr


def duration(path):
    info = media_info(path)
    match = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", info)
    if not match:
        raise RuntimeError(f"Cannot read video duration: {path.name}\n{info}")
    h, m, s = map(float, match.groups())
    return h * 3600 + m * 60 + s


def prepare(source):
    day = re.match(r"day\D*(\d+)", source.stem, re.I)
    number = re.search(r"WA(\d+)$", source.stem, re.I)
    if day:
        slug = "sjf-day-" + day.group(1)
        title = "SJF — Day " + day.group(1)
        order = (0, int(day.group(1)))
    elif number:
        sequence = int(number.group(1)) + 1
        slug = f"sjf-video-{sequence:02}"
        title = f"SJF Video {sequence:02}"
        order = (1, sequence)
    else:
        raise RuntimeError(f"Add a title and stable filename for {source.name}")
    target = OUTPUT / (slug + ".mp4")
    poster = POSTERS / (slug + ".jpg")
    if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
        # Cap landscape at 1280x720 and portrait at 720x1280; never upscale.
        scale = ("scale=w='if(gte(iw,ih),min(1280,iw),min(720,iw))':"
                 "h='if(gte(iw,ih),min(720,ih),min(1280,ih))':"
                 "force_original_aspect_ratio=decrease:force_divisible_by=2")
        temporary = target.with_suffix(".working.mp4")
        run(["-i", str(source), "-map", "0:v:0", "-map", "0:a:0?", "-sn", "-dn",
             "-vf", scale, "-fpsmax", "30", "-c:v", "libx264", "-preset", "fast",
             "-crf", "25", "-pix_fmt", "yuv420p", "-threads", "2",
             "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
             "-map_metadata", "-1", str(temporary)])
        temporary.replace(target)
    if target.stat().st_size > source.stat().st_size:
        info = media_info(source)
        video_line = next((line for line in info.splitlines() if "Video:" in line), "")
        dimensions = re.search(r", (\d{2,5})x(\d{2,5})", video_line)
        fps = re.search(r"([\d.]+) fps", video_line)
        audio_lines = [line for line in info.splitlines() if "Audio:" in line]
        # Some WhatsApp clips are already smaller and browser-compatible. Keep
        # their original picture/audio quality and only move metadata up front.
        compatible = ("Video: h264" in video_line and "yuv420p" in video_line
                      and dimensions and max(map(int, dimensions.groups())) <= 1280
                      and fps and float(fps.group(1)) <= 30
                      and all("Audio: aac" in line for line in audio_lines)
                      and "rotation of" not in info)
        if compatible:
            temporary = target.with_suffix(".working.mp4")
            run(["-i", str(source), "-map", "0:v:0", "-map", "0:a:0?", "-sn", "-dn",
                 "-c", "copy", "-movflags", "+faststart", "-map_metadata", "-1", str(temporary)])
            temporary.replace(target)
    seconds = duration(target)
    if not poster.exists() or poster.stat().st_mtime < target.stat().st_mtime:
        run(["-ss", str(min(1, seconds / 2)), "-i", str(target), "-frames:v", "1",
             "-vf", "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x0a2547",
             "-q:v", "3", str(poster)])
    print(f"Ready: {title} | {seconds:.1f}s | {target.stat().st_size / 1024**2:.1f} MB", flush=True)
    return order, {
        "id": slug, "title": title, "desc": "A video from Sashi Jamuna Foundation.",
        "src": target.relative_to(ROOT).as_posix(),
        "poster": poster.relative_to(ROOT).as_posix(),
        "duration": round(seconds, 2), "youtube": ""
    }


if __name__ == "__main__":
    sources = sorted(SOURCE.glob("*.mp4"))
    if not sources:
        raise SystemExit("No MP4 files found in sjf videos.")
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        rows = list(pool.map(prepare, sources))
    library = [entry for _, entry in sorted(rows)]
    (ROOT / "assets/video-library.js").write_text(
        "/* Generated from supplied SJF videos; no video bytes go into browser storage. */\n"
        "window.SJFVideoLibrary = " + json.dumps(library, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")
    total_before = sum(p.stat().st_size for p in sources)
    total_after = sum((ROOT / v["src"]).stat().st_size for v in library)
    print(f"Complete: {len(library)} videos, {total_before / 1024**2:.1f} MB -> {total_after / 1024**2:.1f} MB", flush=True)
