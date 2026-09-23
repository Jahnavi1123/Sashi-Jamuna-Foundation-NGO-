const DATA = window.SJFData;
const PUBLIC_VIEWS = {home:viewHome,about:viewAbout,initiatives:viewInitiatives,gallery:viewGallery,videos:viewVideos,news:viewUpdates,donate:viewDonate,volunteer:viewVolunteer,contact:viewContact};
const SAMPLE_PHOTOS = [
  ['sjf-a',800,620],['sjf-b',620,820],['sjf-c',800,600],['sjf-d',800,1000],
  ['sjf-e',800,600],['sjf-f',900,700],['sjf-g',800,1100],['sjf-h',800,600],
  ['sjf-i',800,900],['sjf-j',900,650],['sjf-k',800,600],['sjf-l',800,760]
];
function socialURL(value, network) {
  let v = String(value || '').trim();
  if (!v || v.includes('[')) return '';
  if (!/^https?:\/\//i.test(v)) v = 'https://www.' + network + '.com/' + v.replace(/^[@/]+/, network === 'youtube' ? '@' : '');
  try { const url = new URL(v); return url.protocol === 'https:' ? url.href : ''; } catch (_) { return ''; }
}
function mediaURL(value) {
  if (/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value || '')) return value;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch (_) { return ''; }
}
const DB = {data:null,load() {
  const s = DATA.read('settings');
  this.data = {
    settings:{...s,razorpayKey:'',email:s.email || 'info@sashijamunafoundation.org',
      instaUrl:socialURL(s.instagram,'instagram'),fbUrl:socialURL(s.facebook,'facebook'),ytUrl:socialURL(s.youtube,'youtube')},
    stats:['Villages Reached','Lives Impacted','Programmes Running','Active Volunteers'].map((label,i) => ({id:'s'+i,label,value:(s.impact || [])[i] || '',suffix:''})),
    initiatives:DATA.read('initiatives').map((item,i) => ({...item,desc:item.desc || '',icon:({heart:'pulse',brief:'meal'})[item.icon] || item.icon,color:['navy','ver','teal','gold','teal','ver'][i % 6]})),
    gallery:DATA.read('photos').map((p,i) => {
      const sample = SAMPLE_PHOTOS[i % SAMPLE_PHOTOS.length];
      return {id:p.id,src:mediaURL(p.src) || 'https://picsum.photos/seed/'+sample[0]+'/'+sample[1]+'/'+sample[2]+'.jpg',
        title:p.src ? p.caption : 'Sample photo — replace via Admin',cat:p.cat || 'Community',up:!!p.src};
    }),
    videos:DATA.read('videos').filter(v => /^[A-Za-z0-9_-]{11}$/.test(v.youtube || '')).map(v => ({...v,yt:v.youtube,date:v.date || ''})),
    updates:DATA.read('updates').map(u => ({...u,tag:u.cat,sample:!u.date}))
  };
}};

const ANNOUNCEMENTS = ['◆ Together we nurture roots and reach skies.','◆ Empowering Bihar, preserving heritage.','◆ Madhubani art — our living tradition.','◆ Volunteer with Sashi Jamuna Foundation today.'];
let paused = false;
function announcement() {
  const group = '<div class="announcement-group">' + ANNOUNCEMENTS.map(t => '<span>' + t + '</span>').join('') + '</div>';
  return '<div class="section-announcement"><div class="announcement-window" aria-hidden="true"><div class="announcement-track">' + group + group + '</div></div><button type="button" class="announcement-toggle" aria-label="' + (paused ? 'Play' : 'Pause') + ' announcements" aria-pressed="' + paused + '">' + (paused ? '▶' : 'Ⅱ') + '</button></div>';
}

let revealObserver;
function initReveal() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { $$('.rv').forEach(e => e.classList.add('in')); return; }
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
  }), {threshold:.08});
  $$('.rv:not(.in)').forEach(e => revealObserver.observe(e));
}
function initCounters() {
  $$('[data-count]').forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
}
function closeMenu() {
  $('#mnav')?.classList.remove('open');
  $('[data-act="nav-toggle"]')?.setAttribute('aria-expanded','false');
}
function activeNav(name) {
  $$('[data-nav]').forEach(a => {
    const active = a.dataset.nav === name;
    a.classList.toggle('active',active);
    if (active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
  });
}
function sectionName() { const n = location.hash.replace(/^#\/?/,'').split('?')[0] || 'home'; return n === 'updates' ? 'news' : n; }
function navigate(name, initial = false) {
  if (name === 'admin') { location.assign('admin.html'); return; }
  if (!(name in PUBLIC_VIEWS)) name = 'home';
  closeMenu();
  document.documentElement.style.setProperty('--public-header-height', $('#site-head').offsetHeight + 'px');
  activeNav(name);
  if (initial && !location.hash) return;
  const target = document.getElementById(name);
  target.scrollIntoView({behavior:initial || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});
  if (!initial) target.focus({preventScroll:true});
}
function render() {
  DB.load();
  if (!DB.data.gallery.some(g => g.cat === gfilter)) gfilter = 'All';
  $('#app').innerHTML = header() + '<main id="main">' + Object.entries(PUBLIC_VIEWS).map(([name,view]) => '<section class="site-section" id="'+name+'" tabindex="-1">'+announcement()+view()+'</section>').join('') + '</main>' + footer();
  const s = DATA.read('settings');
  $$('#publicHero [data-home-copy]').forEach(el => { if (s[el.dataset.homeCopy]) el.textContent = s[el.dataset.homeCopy]; });
  // Every submission stays local in the requested demo.
  $$('form[data-form]').forEach(form => {
    const note = document.createElement('p'); note.className = 'demo-form-note'; note.textContent = 'Demo: saved in this browser only.'; form.appendChild(note);
  });
  initReveal(); initCounters();
  document.documentElement.style.setProperty('--public-header-height', $('#site-head').offsetHeight + 'px');
  activeNav(sectionName());
}
function saveRecord(key, record) {
  const list = DATA.read(key); list.unshift(record);
  if (!DATA.write(key,list)) { toast('Browser storage is full. Export a backup in Admin before removing data.','warn'); return false; }
  return true;
}

document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
    let name = anchor.getAttribute('href').replace(/^#\/?/,'');
    if (name === 'updates') name = 'news';
    if (name in PUBLIC_VIEWS) { e.preventDefault(); if (location.hash !== '#'+name) history.pushState(null,'','#'+name); navigate(name); }
  }
  const pause = e.target.closest('.announcement-toggle');
  if (pause) {
    paused = !paused; document.body.classList.toggle('announcements-paused',paused);
    $$('.announcement-toggle').forEach(b => { b.setAttribute('aria-pressed',String(paused)); b.setAttribute('aria-label',(paused ? 'Play' : 'Pause')+' announcements'); b.textContent = paused ? '▶' : 'Ⅱ'; });
  }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  switch (act) {
    case 'nav-toggle': { const open = $('#mnav').classList.toggle('open'); el.setAttribute('aria-expanded',String(open)); break; }
    case 'modal-x': closeModal(); break;
    case 'lb': openLB(el.dataset.scope,el.dataset.idx); break;
    case 'lb-prev': LB.i = (LB.i-1+LB.items.length)%LB.items.length; paintLB(); break;
    case 'lb-next': LB.i = (LB.i+1)%LB.items.length; paintLB(); break;
    case 'gfil': {
      gfilter = el.dataset.cat; const grid = $('#g-grid'); if (grid) { grid.parentElement.innerHTML = galleryGrid(); initReveal(); } break;
    }
    case 'play-video': {
      const v = DB.data.videos.find(v => v.id === el.dataset.id), frame = el.closest('.vframe');
      if (v && frame) frame.innerHTML = '<iframe src="https://www.youtube.com/embed/'+esc(v.yt)+'?autoplay=1&rel=0" title="'+esc(v.title)+'" allow="accelerometer;autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>';
      break;
    }
    case 'amt': {
      donAmt = Number(el.dataset.amt); $('#amt-custom').value = '';
      $$('.amt').forEach(b => { b.className = 'amt px-3 py-3.5 rounded-xl font-extrabold border-2 transition ' + (Number(b.dataset.amt) === donAmt ? 'g-fire text-white border-transparent shadow-lg' : 'border-navy/15 text-navy hover:border-navy/40'); }); break;
    }
    case 'freq': {
      donFreq = el.dataset.freq;
      $$('.freq').forEach(b => { b.className = 'freq px-5 py-2 rounded-full font-extrabold text-sm transition ' + (b.dataset.freq === donFreq ? 'g-navy text-cream' : 'text-navy'); }); break;
    }
    case 'soc': toast('Add the official social link in Admin → Settings.','warn'); break;
    case 'copy': {
      if ((el.dataset.copy || '').includes('[')) { toast('Payment details have not been added.','warn'); break; }
      if (!navigator.clipboard) { toast('Clipboard is unavailable.','warn'); break; }
      navigator.clipboard.writeText(el.dataset.copy).then(() => toast('Copied.')).catch(() => toast('Could not copy.','warn')); break;
    }
  }
});

document.addEventListener('submit', e => {
  const form = e.target.closest('form[data-form]'); if (!form) return;
  e.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; }
  const fd = new FormData(form), v = key => String(fd.get(key) || '').trim();
  switch (form.dataset.form) {
    case 'f-news': {
      const email = v('email').toLowerCase();
      if (DATA.read('subscribers').some(s => s.email === email)) { toast('This email is already saved in this browser.'); break; }
      if (saveRecord('subscribers',{id:uid(),email,date:new Date().toISOString()})) { form.reset(); toast('Newsletter interest saved in this browser.'); } break;
    }
    case 'f-contact': {
      if (saveRecord('messages',{id:uid(),date:new Date().toISOString(),name:v('name'),email:v('email'),phone:'',subject:v('subject') || 'General Enquiry',message:v('msg')})) { form.reset(); toast('Message saved in the demo inbox on this browser.'); } break;
    }
    case 'f-vol': {
      if (saveRecord('volunteers',{id:uid(),createdAt:new Date().toISOString(),name:v('name'),email:v('email'),phone:v('phone'),city:v('city'),area:fd.getAll('interest').join(', '),commit:v('avail'),mode:v('avail') === 'Remote / Online' ? 'Remote' : '',skills:v('msg'),ref:v('ref'),age:''})) { form.reset(); toast('Volunteer registration saved in this browser demo.'); } break;
    }
    case 'f-donate': {
      const amount = Number($('#amt-custom').value) || donAmt;
      if (!Number.isFinite(amount) || amount < 10) { toast('Choose an amount of ₹10 or more.','warn'); return; }
      if (saveRecord('donations',{id:uid(),date:new Date().toISOString(),name:v('name'),email:v('email'),phone:v('phone'),amount,purpose:v('purpose'),message:v('msg'),frequency:donFreq,anonymous:fd.has('anon'),status:'pending',ref:'DEMO-'+Date.now().toString(36).toUpperCase()})) { form.reset(); toast('Donation interest saved locally. No payment was processed.'); } break;
    }
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeMenu(); }
  if ($('#modal-root .lb-bg') && LB.items.length) {
    if (e.key === 'ArrowLeft') { LB.i = (LB.i-1+LB.items.length)%LB.items.length; paintLB(); }
    if (e.key === 'ArrowRight') { LB.i = (LB.i+1)%LB.items.length; paintLB(); }
  }
});
window.addEventListener('hashchange',() => navigate(sectionName()));
window.addEventListener('popstate',() => navigate(sectionName()));
window.addEventListener('storage',e => { if (!e.key || e.key.startsWith('sjf_')) render(); });
window.addEventListener('pageshow',e => { if (e.persisted) render(); });
let scrollFrame = false;
window.addEventListener('scroll',() => {
  if (scrollFrame) return; scrollFrame = true;
  requestAnimationFrame(() => {
    scrollFrame = false; $('#site-head').classList.toggle('scrolled',scrollY > 30);
    let active = 'home'; const offset = $('#site-head').offsetHeight+80;
    $$('.site-section').forEach(s => { if (s.getBoundingClientRect().top <= offset) active = s.id; }); activeNav(active);
  });
},{passive:true});
window.addEventListener('resize',() => document.documentElement.style.setProperty('--public-header-height',$('#site-head').offsetHeight+'px'));
render();
requestAnimationFrame(() => navigate(sectionName(),true));
