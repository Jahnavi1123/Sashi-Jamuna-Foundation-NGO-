const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const {createServer} = require('../tools/preview.cjs');
const root = path.resolve(__dirname, '..');
let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function page(file, saved = {}) {
  const errors = [], console = new VirtualConsole();
  console.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root,file),'utf8'), {url:'http://localhost/'+file,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:console});
  const w = dom.window, d = w.document;
  w.matchMedia = () => ({matches:false,addEventListener(){}});
  w.localStorage.setItem('sjf_language','en');
  w.HTMLMediaElement.prototype.pause = () => {}; w.HTMLMediaElement.prototype.load = () => {};
  w.HTMLDialogElement.prototype.showModal = function(){this.open=true;};
  w.HTMLDialogElement.prototype.close = function(){this.open=false;};
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
  const videosPage=await page('videos.html'),vd=videosPage.d;
  const loaderLink=d.createElement('a');
  loaderLink.href='videos.html';
  d.body.appendChild(loaderLink);
  w.addEventListener('click',e=>e.preventDefault(),{once:true});
  loaderLink.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true,button:0}));
  await wait(350);
  check(library.length === 30,'All 30 supplied videos appear');
  check(vd.querySelectorAll('#videos .vframe').length === 8,'Videos page shows the eight day-prefixed source videos');
  check([...vd.querySelectorAll('#videos h3')].map(h=>h.textContent).join('|')==='SJF — Day 11|SJF — Day 12|SJF — Day 13|SJF — Day 14|SJF — Day 15|SJF — Day 16|SJF — Day 17|SJF — Day 19','Videos page shows all day-prefixed clips in day order');
  check([...d.querySelectorAll('#homeFeaturedVideo, .home-video-row')].length===3 && d.querySelector('#homeFeaturedVideo .vframe')?.dataset.id==='sjf-day-13' && [...d.querySelectorAll('.home-video-row')].map(row=>row.dataset.id).join('|')==='sjf-day-15|sjf-day-16','Stories section features Day 13, Day 15 and Day 16');
  check(library.some(video=>video.id==='sjf-video-1003' && video.src==='assets/videos/1003.mp4'),'1003.mp4 appears in the videos library');
  const heroVideo=d.querySelector('#publicHero .hero-kids-frame video');
  check(heroVideo && heroVideo.autoplay && heroVideo.hasAttribute('muted') && heroVideo.loop && heroVideo.playsInline && heroVideo.querySelector('source').getAttribute('src')==='assets/videos/1003.mp4','1003.mp4 autoplays muted in the circular hero frame');
  check(vd.querySelectorAll('#videos video,#videos iframe[src*="youtube.com/embed"]').length === 0,'Videos section still waits for a user to start playback');
  const loaderVideo=d.querySelector('#sjf-page-loader .sjf-loading-video');
  check(loaderVideo && loaderVideo.autoplay && loaderVideo.hasAttribute('muted') && loaderVideo.loop && loaderVideo.playsInline && loaderVideo.querySelector('source').getAttribute('src')==='assets/videos/1003.mp4','Page loader uses the same continuously looping 1003 video');
  check(!d.querySelector('#sjf-page-loader').hidden && loaderVideo.dataset.playRequested==='true','Loading screen starts the 1003 video');
  w.dispatchEvent(new w.PageTransitionEvent('pageshow'));
  loaderLink.remove();
  Object.defineProperty(heroVideo,'paused',{configurable:true,value:false});
  let heroPauseCalls=0;
  heroVideo.pause=()=>{heroPauseCalls++;};
  d.querySelector('.home-video-row').click();
  const selectedStory=library.find(video=>video.id==='sjf-day-15');
  check(d.querySelector('#homeFeaturedVideo video source').getAttribute('src') === selectedStory.src,'Homepage rows play the selected video');
  check(d.querySelector('#homeVideoTitle').textContent === selectedStory.title,'Featured title follows selection');
  check(heroPauseCalls===0,'Playing another video does not stop the continuously looping hero video');
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
  vd.querySelector('#videos [data-act="play-video"]').click();
  const player = vd.querySelector('#sjf-video-viewer video');
  check(player && player.controls && player.playsInline && player.preload === 'none','Native mobile-friendly player appears on click');
  check(player.querySelector('source').getAttribute('src') === library.find(v=>v.id==='sjf-day-11').src,'Selected file plays');
  player.dispatchEvent(new w.Event('error'));
  check(!vd.querySelector('#sjf-video-viewer .sjf-video-error').hidden,'Media errors show an open-video fallback');
  check(w.SJFMedia.normalize({src:'javascript:alert(1)'}) === null,'Unsafe video sources rejected');
  check(w.SJFMedia.normalize({src:'assets/videos/../../secret.mp4'}) === null,'Path traversal rejected');
  const legacy = await page('videos.html',{sjf_videos:[{id:'v1',title:'A Day in the Life of a Learning Centre',youtube:''},{id:'custom',title:'Existing YouTube video',youtube:'abcdefghijk'}]});
  check(legacy.w.SJFData.read('videos').length === 31,'Existing browser content gets new library without empty demo entries');
  check(legacy.w.SJFData.read('videos').some(v=>v.id==='custom'),'Existing YouTube entries retained');
  const youtubeHost=legacy.d.createElement('div');legacy.d.body.appendChild(youtubeHost);
  legacy.w.SJFMedia.mount(youtubeHost,legacy.w.SJFData.read('videos').find(v=>v.id==='custom'));
  check(youtubeHost.querySelector('iframe').src.includes('abcdefghijk'),'YouTube playback still works');
  legacy.w.SJFData.write('videos',[]);
  check(legacy.w.SJFData.read('videos').length === 0,'Admin removals stay removed after first import');
  const admin = await page('admin.html');
  admin.d.querySelector('[data-tab="videos"]').click();
  check(admin.d.querySelectorAll('#adminContent [data-del-video]').length === 30,'Admin manages all imported videos');
  admin.d.querySelector('#adminContent .video-card').click();
  check(admin.d.querySelector('#adminVideoPlayer video'),'Admin previews local files');
  check(![...admin.d.querySelectorAll('#adminContent img')].some(img=>img.src.includes('youtube.com')),'Local entries use actual posters');
  check(p.errors.length+videosPage.errors.length+legacy.errors.length+admin.errors.length === 0,'No page initialization or player errors');
  [p,videosPage,legacy,admin].forEach(p=>p.dom.window.close());
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
