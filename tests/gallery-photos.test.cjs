const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');
const script=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const expected=['r4','r1','indi3','indi2','t4','t3','t2','c8','r3','indi','t1','c7','c6','c2','c1','p6','p5','p4','p3','p2','p1','hero4','hero3','k2','k1','hero2','hero1','c4','c5','c3','1','2','3','4','5','6','7','8'].map(name=>'assets/images/'+name+'.jpeg');

async function run(){
  const data=new JSDOM('',{url:'http://localhost',runScripts:'outside-only'});
  try {
    const w=data.window;
    w.eval(script('demo-data.js'));
    const legacy={id:'p1',caption:'Education programme — classroom session',cat:'education',art:0,src:null};
    const custom={id:'user-photo',caption:'Keep my upload',cat:'community',src:'https://example.com/photo.jpg'};
    const edited={id:'p2',caption:'My own caption',cat:'health',art:1,src:null};
    w.localStorage.setItem('sjf_photos',JSON.stringify([legacy,custom,edited]));
    const photos=w.SJFData.read('photos');
    assert.equal(photos.length,expected.length+2);
    assert.equal(photos.find(p=>p.id==='p1'),undefined,'Untouched seed replaced');
    assert.equal(photos.find(p=>p.id===custom.id).caption,custom.caption);
    assert.equal(photos.find(p=>p.id===edited.id).caption,edited.caption,'Admin edits preserved');
    assert.deepEqual(Array.from(photos.filter(p=>p.id.startsWith('sjf-photo-')),p=>p.src),expected);
    expected.forEach(src=>assert(fs.existsSync(path.join(root,src)),src+' exists'));
    w.SJFData.write('photos',photos.filter(p=>p.id!=='sjf-photo-r4'));
    assert.equal(w.SJFData.read('photos').length,expected.length+1,'Deleted photo stays deleted after import');
    assert.equal(w.SJFData.read('photos').length,expected.length+1,'No duplicate import');
    const originalIds=Array.from(w.SJFData.defaults.photos.slice(0,30),p=>p.id);
    w.localStorage.setItem('sjf_photo_library_v1',JSON.stringify(originalIds));
    w.SJFData.write('photos',photos.filter(p=>p.id!=='sjf-photo-r4' && !/^sjf-photo-[1-8]$/.test(p.id)));
    const upgraded=w.SJFData.read('photos');
    assert.equal(upgraded.length,expected.length+1,'Existing galleries receive the eight new photos');
    assert(!upgraded.some(p=>p.id==='sjf-photo-r4'),'Previously deleted photo stays deleted on upgrade');
    assert.equal(upgraded.filter(p=>/^sjf-photo-[1-8]$/.test(p.id)).length,8);
  } finally {data.window.close();}
  for(const file of ['3.html','gallery.html','volunteer.html']) {
    const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
    const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'http://localhost/'+file,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
    try {
      const w=dom.window,d=w.document;
      w.matchMedia=()=>({matches:false,addEventListener(){}});w.requestAnimationFrame=()=>1;w.scrollTo=()=>{};
      w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
      const timers = new Map(); let timerId = 0;
      w.setInterval = (callback,delay) => { timers.set(++timerId,{callback,delay}); return timerId; };
      w.clearInterval = id => timers.delete(id);
      w.localStorage.setItem('sjf_language','en');
      await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
      for(const s of d.querySelectorAll('script[src^="assets/"]'))w.eval(fs.readFileSync(path.join(root,s.getAttribute('src')),'utf8'));
      if(file==='volunteer.html') {
        const root=d.querySelector('#volunteer-slideshow');
        assert.deepEqual([...root.querySelectorAll('img')].map(img=>img.getAttribute('src')),expected.slice(-8));
        const current=()=>root.querySelector('img.is-active').getAttribute('src');
        const tick=[...timers.values()].find(t=>t.delay===4500).callback;
        tick(); assert.equal(current(),expected.at(-7),'Autoplay advances');
        root.querySelector('[data-slide="pause"]').click(); tick();
        assert.equal(current(),expected.at(-7),'Pause holds current slide');
        root.querySelector('[data-slide="prev"]').click();
        root.querySelector('[data-slide="prev"]').click();
        assert.equal(current(),expected.at(-1),'Previous wraps to photo 8');
        root.querySelector('[data-slide="next"]').click();
        assert.equal(current(),expected.at(-8),'Next wraps to photo 1');
        w.dispatchEvent(new w.PageTransitionEvent('pagehide'));
        assert(![...timers.values()].some(t=>t.delay===4500),'Slideshow timer cleaned up');
        assert.deepEqual(errors,[]); continue;
      }
      const container=d.querySelector(file==='3.html'?'#home-gallery':'#g-grid');
      const home=file==='3.html', visible=home?container.querySelector('.sjf-gallery-group'):container;
      assert.deepEqual([...visible.querySelectorAll('img')].map(img=>img.getAttribute('src')),home?expected.slice(0,6):expected,'Six home previews; complete gallery retained');
      if(home) {
        assert.equal(d.querySelector('.sjf-hero-values-photo').getAttribute('src'),'assets/images/hero1.jpeg');
        assert.equal(container.querySelectorAll('[aria-hidden="true"] button[tabindex="-1"]').length,6,'Loop copies are excluded from keyboard navigation');
      }
      const buttons=visible.querySelectorAll('[data-act="lb"]');
      buttons[0].click();
      assert.equal(d.querySelector('#modal-root img').getAttribute('src'),expected[0],'Preview opens correct photo');
      d.querySelector('[data-act="lb-prev"]').click();
      assert.equal(d.querySelector('#modal-root img').getAttribute('src'),expected.at(-1),'Viewer retains all photos');
      d.querySelector('[data-act="lb-next"]').click();
      assert.equal(d.querySelector('#modal-root img').getAttribute('src'),expected[0],'Viewer wraps');
      d.querySelector('#modal-root button[data-act="modal-x"]').click();
      assert(!d.querySelector('#modal-root img'));
      assert.deepEqual(errors,[]);
    } finally {dom.window.close();}
  }
  console.log('PASS: 38 matched assets, six home previews, full gallery, volunteer slideshow controls/autoplay, lightbox navigation, legacy migration, preserved uploads and deletions.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
