const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '..');

(async () => {
  const errors = [], virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root,'videos.html'),'utf8'), {
    url:'http://localhost/videos.html',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole
  });
  const w = dom.window, d = w.document;
  try {
    w.matchMedia = () => ({matches:false,addEventListener(){}});
    w.scrollTo = () => {};
    w.requestAnimationFrame = () => 1;
    w.HTMLMediaElement.prototype.play = function () { this.dataset.playRequested='true'; return Promise.resolve(); };
    w.HTMLMediaElement.prototype.pause = function () { this.dataset.pausedByApp='true'; };
    w.HTMLMediaElement.prototype.load = function () { this.dataset.released='true'; };
    w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open',''); };
    w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
    let fullscreen = null, permitFullscreen = false;
    Object.defineProperty(d,'fullscreenElement',{get:()=>fullscreen});
    w.HTMLElement.prototype.requestFullscreen = function () {
      if (!permitFullscreen) return Promise.reject(new Error('Fullscreen blocked'));
      assert.notEqual(this.tagName,'DIALOG','Fullscreen must target a supported container');
      fullscreen=this; d.dispatchEvent(new w.Event('fullscreenchange')); return Promise.resolve();
    };
    d.exitFullscreen = () => { fullscreen=null; d.dispatchEvent(new w.Event('fullscreenchange')); return Promise.resolve(); };
    await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
    for(const script of d.querySelectorAll('script[src^="assets/"]')) w.eval(fs.readFileSync(path.join(root,script.getAttribute('src')),'utf8'));
    const click = selector => { const el=d.querySelector(selector); assert(el,selector); el.click(); };
    const source = () => d.querySelector('#sjf-video-viewer video source').getAttribute('src');
    const trigger = d.querySelector('[data-act="play-video"][data-id="sjf-day-15"]');
    trigger.click(); await Promise.resolve(); await Promise.resolve();
    assert(d.querySelector('#sjf-video-viewer[open]'),'Full-viewport fallback opens when native fullscreen is blocked');
    assert.equal(source(),'assets/videos/sjf-day-15.mp4');
    assert.equal(d.body.style.overflow,'hidden');
    assert.equal(d.querySelector('#sjf-video-viewer video').dataset.playRequested,'true');
    const oldPlayer=d.querySelector('#sjf-video-viewer video');
    click('[data-act="video-next"]'); assert.equal(source(),'assets/videos/sjf-day-16.mp4');
    assert.equal(oldPlayer.dataset.pausedByApp,'true'); assert.equal(oldPlayer.dataset.released,'true');
    click('[data-act="video-prev"]'); assert.equal(source(),'assets/videos/sjf-day-15.mp4');
    d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));
    assert.equal(source(),'assets/videos/sjf-day-16.mp4');
    const closingPlayer=d.querySelector('#sjf-video-viewer video');
    click('[data-act="video-close"]');
    assert(!d.querySelector('#sjf-video-viewer')); assert.equal(d.body.style.overflow,'');
    assert.equal(closingPlayer.dataset.released,'true'); assert.equal(d.activeElement,trigger);
    permitFullscreen=true;
    click('[data-act="play-video"][data-id="sjf-day-11"]'); await Promise.resolve();
    assert(fullscreen && fullscreen.querySelector('[data-act="video-close"]'),'Native fullscreen includes controls');
    click('[data-act="video-prev"]'); assert.equal(source(),'assets/videos/sjf-day-19.mp4');
    click('[data-act="video-next"]'); assert.equal(source(),'assets/videos/sjf-day-11.mp4');
    d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
    assert(!d.querySelector('#sjf-video-viewer')); assert.equal(fullscreen,null);
    trigger.click(); await Promise.resolve(); await d.exitFullscreen();
    assert(!d.querySelector('#sjf-video-viewer'),'Browser fullscreen exit closes player');
    assert.equal(d.querySelectorAll('#videos .vframe').length,8,'Gallery cards remain intact');
    assert.deepEqual(errors,[]);
    console.log('PASS: clicked video, previous/next and wraparound, keyboard, close cleanup/focus, fullscreen and fallback.');
  } finally { dom.window.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
