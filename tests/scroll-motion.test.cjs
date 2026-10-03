const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '..');

async function check(file, reduced = false, observerAvailable = true) {
  const errors = [], observers = [], changes = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root,file),'utf8'), {
    url:'http://localhost/'+file, runScripts:'outside-only', pretendToBeVisual:true, virtualConsole:vc
  });
  try {
    const w = dom.window, d = w.document;
    w.matchMedia = query => ({matches:query.includes('reduce)') && reduced, addEventListener:(_,fn)=>changes.push(fn)});
    w.scrollTo = () => {}; w.requestAnimationFrame = () => 1;
    w.HTMLMediaElement.prototype.play = () => Promise.resolve();
    w.HTMLMediaElement.prototype.pause = () => {}; w.HTMLMediaElement.prototype.load = () => {};
    w.HTMLDialogElement.prototype.showModal = function(){this.open=true;};
    w.HTMLDialogElement.prototype.close = function(){this.open=false;};
    if (observerAvailable) w.IntersectionObserver = class {
      constructor(callback){this.callback=callback;this.targets=[];observers.push(this);}
      observe(el){this.targets.push(el);}
      disconnect(){this.targets=[];}
    };
    w.localStorage.setItem('sjf_language','en');
    await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
    for(const script of d.querySelectorAll('script[src^="assets/"]')) {
      w.eval(fs.readFileSync(path.join(root,script.getAttribute('src')),'utf8'));
    }
    const scrollToY = y => {
      w.requestAnimationFrame = callback => { callback(); return 1; };
      w.scrollY = y; w.dispatchEvent(new w.Event('scroll'));
    };
    scrollToY(160);
    assert(!d.querySelector('#site-head').classList.contains('sjf-header-hidden'),'Down scroll shows menu');
    scrollToY(80);
    assert(d.querySelector('#site-head').classList.contains('sjf-header-hidden'),'Up scroll hides menu');
    scrollToY(100);
    assert(!d.querySelector('#site-head').classList.contains('sjf-header-hidden'),'Direction reversal shows menu again');
    w.requestAnimationFrame = () => 1;
    if(reduced || !observerAvailable) {
      assert(!d.body.classList.contains('sjf-scroll-motion'),'Fallback never hides content');
      assert(d.querySelector('#main h1'),'Page content rendered');
      assert.deepEqual(errors,[]); return;
    }
    const observer = observers.findLast(o=>o.targets.some(el=>el.matches('.sjf-reveal')));
    assert(observer && observer.targets.length > 10,'Content observed across page');
    assert(!observer.targets.some(el=>el.matches('section,form,video')),'Tall sections, forms and videos never hidden as a unit');
    for(const el of observer.targets) {
      observer.callback([{target:el,isIntersecting:true,intersectionRatio:.001,boundingClientRect:{top:100}}]);
      assert(el.classList.contains('sjf-revealed'),'Even a tiny visible portion reveals tall content');
      observer.callback([{target:el,isIntersecting:false,intersectionRatio:0,boundingClientRect:{top:-500}}]);
      assert(!el.classList.contains('sjf-revealed'));
      assert(el.classList.contains('sjf-exit-top'));
      observer.callback([{target:el,isIntersecting:true,intersectionRatio:.2,boundingClientRect:{top:20}}]);
      assert(el.classList.contains('sjf-revealed'),'Re-entry works');
      assert(!el.classList.contains('sjf-exit-top'));
    }
    if(file==='3.html') {
      const effects = new Set(observer.targets.map(el=>el.dataset.scrollEffect));
      for(const effect of ['ripple','ink','brush','sketch','rise','breathe']) assert(effects.has(effect),effect+' available');
      assert(d.querySelector('#who-we-are h2.sjf-revealed'),'Who We Are is visible on entry');
      assert(d.querySelector('footer .sjf-reveal'),'Footer included');
      d.querySelector('[data-act="language"]').click();
      d.querySelector('[data-language="hi"]').click();
      assert(d.querySelector('#main').textContent.includes('ज्ञान अवसर पैदा करता है।'),'Hindi survives animated word markup');
    }
    const input = d.querySelector('form input.sjf-reveal[name="name"],form input.sjf-reveal[type="email"]');
    if(input) {
      input.focus(); input.value='Jahnavi';
      observer.callback([{target:input,isIntersecting:false,boundingClientRect:{top:-20}}]);
      assert(input.classList.contains('sjf-revealed'),'Focused control stays visible');
      assert.equal(input.value,'Jahnavi');
    }
    assert.deepEqual(errors,[]);
  } finally { dom.window.close(); }
}
(async()=>{
  for(const file of ['3.html','about.html','initiatives.html','gallery.html','videos.html','updates.html','donate.html','volunteer.html','contact.html']) await check(file);
  await check('3.html',true); await check('3.html',false,false);
  console.log('PASS: scroll entry/exit/re-entry on 9 pages, focused forms, Hindi, reduced motion and missing-observer fallback.');
})().catch(e=>{console.error(e);process.exitCode=1;});
