const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM,VirtualConsole} = require('jsdom');
const root=path.resolve(__dirname,'..');
const pages=[];
async function page(file,language,blocked=false) {
  const errors=[],virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'http://localhost/'+file,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
  pages.push(dom);
  const w=dom.window,d=w.document;
  w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};w.requestAnimationFrame=()=>1;
  w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  if(language)w.localStorage.setItem('sjf_language',language);
  if(blocked){w.Storage.prototype.getItem=()=>{throw new Error('Storage blocked')};w.Storage.prototype.setItem=()=>{throw new Error('Storage blocked')};}
  await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
  for(const s of d.querySelectorAll('script[src^="assets/"]'))w.eval(fs.readFileSync(path.join(root,s.getAttribute('src')),'utf8'));
  const publicCopy = d.querySelector('#app').textContent + [...d.querySelectorAll('[alt],[aria-label],[placeholder],meta[content],script[type="application/ld+json"]')].map(el=>el.getAttribute('alt')||el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.getAttribute('content')||el.textContent).join(' ');
  assert(!/madhubani|mithila|mithala|मधुबनी|मिथिला|painting|paintbrush/i.test(publicCopy),file+' has no retired art copy or metadata');
  return {w,d,errors};
}
const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
(async()=>{
  try{
    const first=await page('3.html');
    assert(first.d.querySelector('#sjf-language-picker[open]'),'First visit asks for language');
    first.d.querySelector('[data-language="hi"]').click();await settle();
    assert.equal(first.w.localStorage.getItem('sjf_language'),'hi');
    assert.equal(first.d.documentElement.lang,'hi');
    assert(first.d.querySelector('#who-we-are').textContent.includes('समुदाय द्वारा संचालित एक गैर-लाभकारी संस्था'));
    assert(first.d.querySelector('.sjf-hero-slogans').textContent.includes('ज्ञान अवसर पैदा करता है।'));
    assert.equal(first.d.querySelector('.hero-kids-frame video source').getAttribute('src'),'assets/videos/1003.mp4');
    assert(!first.d.querySelector('#sjf-language-picker'));
    first.d.querySelector('[data-act="language"]').click();first.d.querySelector('[data-language="en"]').click();await settle();
    assert.equal(first.d.querySelector('[data-nav="home"]').textContent,'Home');
    assert(first.d.querySelector('#who-we-are').textContent.includes('community-led non-profit based in Rosera'));
    const expected={'3.html':'हम कौन हैं','about.html':'हमारा मिशन','initiatives.html':'हमारी पहल','gallery.html':'चित्र दीर्घा','videos.html':'वीडियो','updates.html':'समाचार और दैनिक जानकारी','donate.html':'अपना योगदान दें','volunteer.html':'स्वयंसेवक पंजीकरण','contact.html':'संदेश भेजें'};
    for(const [file,text] of Object.entries(expected)){
      await page(file,'en');
      const p=await page(file,'hi');await settle();
      assert(!p.d.querySelector('#sjf-language-picker'),file+' keeps saved choice');
      assert(p.d.querySelector('#main').textContent.includes(text),file+' translated');
      assert.equal(p.d.querySelector('[data-nav="home"]').textContent,'मुखपृष्ठ');
      assert(p.d.querySelector('footer').textContent.includes('महत्वपूर्ण लिंक'));
      assert.equal(p.d.documentElement.lang,'hi');assert.deepEqual(p.errors,[]);
      if(file==='videos.html'){
        p.d.querySelector('[data-act="play-video"]').click();await settle();
        assert.equal(p.d.querySelector('#sjf-video-viewer-title').textContent,'एसजेएफ — दिन 11');
        assert.equal(p.d.querySelector('[data-act="video-next"]').getAttribute('aria-label'),'अगली वीडियो');
        p.d.querySelector('[data-act="video-next"]').click();await settle();
        assert.equal(p.d.querySelector('#sjf-video-viewer-title').textContent,'एसजेएफ — दिन 12');
        p.d.querySelector('[data-act="video-close"]').click();
      }
      if(file==='contact.html'){
        const input=p.d.querySelector('input[name="name"]');input.value='Jahnavi';
        p.d.querySelector('[data-act="language"]').click();p.d.querySelector('[data-language="en"]').click();await settle();
        assert.equal(p.d.querySelector('input[name="name"]').value,'Jahnavi','Language switch preserves form entry');
        assert.equal(p.d.querySelector('input[name="name"]').placeholder,'Your name');
      }
      if(file==='volunteer.html'){
        const option=[...p.d.querySelectorAll('option')].find(o=>o.value==='Remote / Online');
        assert(option && option.textContent==='दूरस्थ / ऑनलाइन','Translated labels keep English submission values');
      }
    }
    const blocked=await page('3.html',null,true);blocked.d.querySelector('[data-language="hi"]').click();await settle();
    assert.equal(blocked.d.documentElement.lang,'hi','Choice works without browser storage');assert.deepEqual(blocked.errors,[]);
    console.log('PASS: first visit, English/Hindi, all 9 public pages, remembered choice, dynamic player, forms, storage-blocked fallback.');
  }finally{pages.forEach(dom=>dom.window.close());}
})().catch(e=>{console.error(e);process.exitCode=1});
