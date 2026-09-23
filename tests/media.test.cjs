const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const {createServer} = require('../tools/preview.cjs');
const root = path.resolve(__dirname, '..');
let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };

async function page(file, saved = {}) {
  const errors = [], console = new VirtualConsole();
  console.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root,file),'utf8'), {url:'http://localhost/'+file,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:console});
  const w = dom.window, d = w.document;
  w.matchMedia = () => ({matches:false});
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLMediaElement.prototype.play = function () { this.dataset.playRequested = 'true'; return Promise.resolve(); };
  w.requestAnimationFrame = fn => { fn(0); return 1; };
  Object.entries(saved).forEach(([key,value]) => w.localStorage.setItem(key,JSON.stringify(value)));
  if (file === 'admin.html') w.sessionStorage.setItem('sjf_admin','1');
  await new Promise(resolve => w.addEventListener('load',resolve,{once:true}));
  for (const script of d.querySelectorAll('script[src^="assets/"]')) w.eval(fs.readFileSync(path.join(root,script.getAttribute('src')),'utf8'));
  return {dom,w,d,errors};
}

(async () => {
  const p = await page('3.html'), {w,d} = p, library = w.SJFData.read('videos');
  check(library.length === 25,'All 25 supplied videos appear');
  check(d.querySelectorAll('#videos .vframe').length === 25,'Main media section lists every video');
  check(d.querySelectorAll('video,iframe[src*="youtube.com/embed"]').length === 0,'No video downloads or playback before a click');
  for (const video of library) {
    check(fs.existsSync(path.join(root,video.src)) && fs.existsSync(path.join(root,video.poster)),'Video and extracted poster exist: '+video.id);
    check(video.duration > 0,'Actual duration recorded: '+video.id);
    // Read top-level MP4 boxes: moov must precede mdat for progressive playback.
    const data = fs.readFileSync(path.join(root,video.src));
    const boxes = []; let offset = 0;
    while (offset + 8 <= data.length) {
      let size = data.readUInt32BE(offset);
      boxes.push(data.toString('ascii',offset+4,offset+8));
      if (size === 1) size = Number(data.readBigUInt64BE(offset+8));
      if (size === 0) break;
      assert(size >= 8); offset += size;
    }
    check(boxes.includes('moov') && boxes.indexOf('moov') < boxes.indexOf('mdat'),'Fast-start metadata: '+video.id);
  }
  d.querySelector('#videos [data-act="play-video"]').click();
  const player = d.querySelector('#videos video');
  check(player && player.controls && player.playsInline && player.preload === 'none','Native mobile-friendly player appears on click');
  check(player.querySelector('source').getAttribute('src') === library[0].src,'Selected file plays');
  player.dispatchEvent(new w.Event('error'));
  check(!d.querySelector('#videos .sjf-video-error').hidden,'Media errors show an open-video fallback');
  d.querySelector('.home-video-row').click();
  check(d.querySelector('#homeFeaturedVideo video source').getAttribute('src') === library[1].src,'Homepage rows play the selected video');
  check(d.querySelector('#homeVideoTitle').textContent === library[1].title,'Featured title follows selection');
  check(w.SJFMedia.normalize({src:'javascript:alert(1)'}) === null,'Unsafe video sources rejected');
  check(w.SJFMedia.normalize({src:'assets/videos/../../secret.mp4'}) === null,'Path traversal rejected');
  const legacy = await page('3.html',{sjf_videos:[{id:'v1',title:'A Day in the Life of a Learning Centre',youtube:''},{id:'custom',title:'Existing YouTube video',youtube:'abcdefghijk'}]});
  check(legacy.w.SJFData.read('videos').length === 26,'Existing browser content gets new library without empty demo entries');
  check(legacy.w.SJFData.read('videos').some(v=>v.id==='custom'),'Existing YouTube entries retained');
  legacy.d.querySelector('[data-act="play-video"][data-id="custom"]').click();
  check(legacy.d.querySelector('iframe').src.includes('abcdefghijk'),'YouTube playback still works');
  legacy.w.SJFData.write('videos',[]);
  check(legacy.w.SJFData.read('videos').length === 0,'Admin removals stay removed after first import');
  const admin = await page('admin.html');
  admin.d.querySelector('[data-tab="videos"]').click();
  check(admin.d.querySelectorAll('#adminContent [data-del-video]').length === 25,'Admin manages all imported videos');
  admin.d.querySelector('#adminContent .video-card').click();
  check(admin.d.querySelector('#adminVideoPlayer video'),'Admin previews local files');
  check(![...admin.d.querySelectorAll('#adminContent img')].some(img=>img.src.includes('youtube.com')),'Local entries use actual posters');
  check(p.errors.length+legacy.errors.length+admin.errors.length === 0,'No page initialization or player errors');
  [p,legacy,admin].forEach(p=>p.dom.window.close());
  const server = createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const base='http://127.0.0.1:'+server.address().port;
    const response=await fetch(base+'/'+library[0].src,{headers:{Range:'bytes=0-31'}});
    check(response.status===206 && (await response.arrayBuffer()).byteLength===32,'Preview server supports byte-range streaming');
    const tail=await fetch(base+'/'+library[0].src,{headers:{Range:'bytes=-16'}});
    check(tail.status===206 && (await tail.arrayBuffer()).byteLength===16,'Suffix ranges work');
    const invalid=await fetch(base+'/'+library[0].src,{headers:{Range:'bytes=999999999999-'}});
    check(invalid.status===416,'Invalid ranges rejected');
    const home=await fetch(base+'/');
    check(home.status===200 && (await home.text()).includes('assets/public.js'),'Preview root opens actual homepage');
  } finally { await new Promise(resolve=>server.close(resolve)); }
  console.log('PASS: '+checks+' checks for video files, lazy players, existing browser migration, admin previews and streaming.');
})().catch(error=>{console.error(error);process.exit(1)});
