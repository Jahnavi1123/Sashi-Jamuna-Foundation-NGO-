const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');
const script=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const expected=['r4','r1','indi3','indi2','t4','t3','t2','c8','r3','indi','t1','c7','c6','c2','c1','p6','p5','p4','p3','p2','p1','hero4','hero3','k2','k1','hero2','hero1','c4','c5','c3'].map(name=>'assets/images/'+name+'.jpeg');

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
    assert.equal(photos.length,32);
    assert.equal(photos.find(p=>p.id==='p1'),undefined,'Untouched seed replaced');
    assert.equal(photos.find(p=>p.id===custom.id).caption,custom.caption);
    assert.equal(photos.find(p=>p.id===edited.id).caption,edited.caption,'Admin edits preserved');
    assert.deepEqual(Array.from(photos.filter(p=>p.id.startsWith('sjf-photo-')),p=>p.src),expected);
    expected.forEach(src=>assert(fs.existsSync(path.join(root,src)),src+' exists'));
    w.SJFData.write('photos',photos.filter(p=>p.id!=='sjf-photo-r4'));
    assert.equal(w.SJFData.read('photos').length,31,'Deleted photo stays deleted after import');
    assert.equal(w.SJFData.read('photos').length,31,'No duplicate import');
  } finally {data.window.close();}
  for(const file of ['3.html','gallery.html']) {
    const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
    const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'http://localhost/'+file,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
    try {
      const w=dom.window,d=w.document;
      w.matchMedia=()=>({matches:false,addEventListener(){}});w.requestAnimationFrame=()=>1;w.scrollTo=()=>{};
      w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
      w.localStorage.setItem('sjf_language','en');
      await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
      for(const s of d.querySelectorAll('script[src^="assets/"]'))w.eval(fs.readFileSync(path.join(root,s.getAttribute('src')),'utf8'));
      const container=d.querySelector(file==='3.html'?'#home-gallery':'#g-grid');
      assert.deepEqual([...container.querySelectorAll('img')].map(img=>img.getAttribute('src')),expected,'All requested images render');
      const buttons=container.querySelectorAll('[data-act="lb"]');
      buttons[29].click();
      assert.equal(d.querySelector('#modal-root img').getAttribute('src'),expected[29],'Last photo opens correctly');
      d.querySelector('[data-act="lb-next"]').click();
      assert.equal(d.querySelector('#modal-root img').getAttribute('src'),expected[0],'Viewer wraps all 30 photos');
      d.querySelector('[data-act="lb-prev"]').click();
      assert.equal(d.querySelector('#modal-root img').getAttribute('src'),expected[29]);
      d.querySelector('#modal-root button[data-act="modal-x"]').click();
      assert(!d.querySelector('#modal-root img'));
      assert.deepEqual(errors,[]);
    } finally {dom.window.close();}
  }
  console.log('PASS: 30 matched assets, home/full gallery, lightbox navigation, legacy migration, preserved uploads and deletions.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
