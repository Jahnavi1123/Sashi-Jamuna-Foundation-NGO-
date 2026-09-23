/* Shared, click-to-load players for the foundation's videos and YouTube links. */
(function () {
  'use strict';
  function normalize(item) {
    if (!item || typeof item !== 'object') return null;
    const youtube = /^[A-Za-z0-9_-]{11}$/.test(item.youtube || '') ? item.youtube : '';
    const src = /^assets\/videos\/[a-z0-9-]+\.mp4$/.test(item.src || '') ? item.src : '';
    if (!youtube && !src) return null;
    const poster = /^assets\/images\/video-posters\/[a-z0-9-]+\.jpg$/.test(item.poster || '') ? item.poster : 'assets/images/sjf-logo.png';
    return {...item, youtube, yt: youtube, src: youtube ? '' : src, poster, duration: Number(item.duration) || 0};
  }
  function poster(item) {
    const video = normalize(item);
    return video && video.youtube ? 'https://i.ytimg.com/vi/' + video.youtube + '/hqdefault.jpg' : (video ? video.poster : 'assets/images/sjf-logo.png');
  }
  function duration(seconds) {
    const total = Math.round(Number(seconds) || 0);
    return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
  }
  function mount(container, item) {
    const video = normalize(item);
    if (!container || !video) return;
    document.querySelectorAll('video').forEach(function (player) { if (!player.paused) player.pause(); });
    container.replaceChildren();
    if (video.youtube) {
      const frame = document.createElement('iframe');
      frame.src = 'https://www.youtube.com/embed/' + video.youtube + '?autoplay=1&rel=0';
      frame.title = video.title;
      frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.style.cssText = 'width:100%;height:100%;border:0;display:block';
      container.appendChild(frame);
      return;
    }
    const player = document.createElement('video');
    player.controls = true;
    player.playsInline = true;
    player.tabIndex = 0;
    player.preload = 'none';
    player.poster = poster(video);
    player.setAttribute('aria-label', video.title);
    player.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain;background:#0a2547';
    const source = document.createElement('source');
    source.src = video.src;
    source.type = 'video/mp4';
    player.appendChild(source);
    const fallback = document.createElement('a');
    fallback.href = video.src;
    fallback.textContent = 'Open video';
    player.appendChild(fallback);
    const error = document.createElement('p');
    error.className = 'sjf-video-error';
    error.hidden = true;
    error.setAttribute('role', 'status');
    error.textContent = 'This video could not load. ';
    error.appendChild(fallback.cloneNode(true));
    const showError = function () { error.hidden = false; };
    player.addEventListener('error', showError);
    source.addEventListener('error', showError);
    container.append(player, error);
    player.focus({preventScroll: true});
    const playing = player.play();
    if (playing && playing.catch) playing.catch(function () { /* Native controls remain available if autoplay is blocked. */ });
  }
  window.SJFMedia = {normalize, poster, duration, mount};
})();
