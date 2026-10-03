(function () {
"use strict";
const $=(s,el=document)=>el.querySelector(s), $$=(s,el=document)=>[...el.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3);
const fmtDate=d=>!d?'Date to be added':new Date(d).toLocaleDateString(window.SJFLocale?.locale || 'en-IN',{day:'numeric',month:'short',year:'numeric'});
const inr=n=>(+n).toLocaleString('en-IN');

/* ---------------- icons ---------------- */
const ICONS={
heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
pulse:'<path d="M3 12h4l3 8 4-16 3 8h4"/>',
palette:'<circle cx="13.5" cy="6.5" r="1.2"/><circle cx="17.5" cy="10.5" r="1.2"/><circle cx="8.5" cy="7.5" r="1.2"/><circle cx="6.5" cy="12.5" r="1.2"/><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 1.8 1.8 0 0 0 1.3-3L12.5 18a2 2 0 0 1 1.4-3.4h2.6A5.5 5.5 0 0 0 22 9.2C22 5.2 17.5 2 12 2Z"/>',
leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
meal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
play:'<circle cx="12" cy="12" r="10"/><path d="M10 8.5l6 3.5-6 3.5v-7Z"/>',
camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/>',
video:'<path d="M23 7l-7 5 7 5V7Z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.8.6a2 2 0 0 1 1.7 2Z"/>',
pin:'<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>',
clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
arrowR:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',
upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 9 5-5 5 5"/><path d="M12 4v12"/>',
download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
trash:'<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
edit:'<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>',
calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
megaphone:'<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
trending:'<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
sparkle:'<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2Z"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="m21 2-2 2m-5.6 5.6a5.5 5.5 0 1 0-7.8 7.8 5.5 5.5 0 0 0 7.8-7.8Zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
chevL:'<path d="m15 18-6-6 6-6"/>',chevR:'<path d="m9 18 6-6-6-6"/>',
alert:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".6" fill="currentColor"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
external:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>'
};
const ic=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||ICONS.sparkle}</svg>`;
const BRAND={
fb:'<svg viewBox="0 0 24 24" fill="currentColor" style="width:1.2em;height:1.2em"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9A21 21 0 0 0 14.7 4C12.2 4 10.5 5.5 10.5 8.3V11H8v3h2.5v7h3Z"/></svg>',
ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1.2em;height:1.2em"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" stroke="none"/></svg>',
yt:'<svg viewBox="0 0 24 24" fill="currentColor" style="width:1.2em;height:1.2em"><path d="M23 12s0-3.9-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.1 1 12 1 12s0 3.9.5 5.6a2.9 2.9 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2c.5-1.7.5-5.6.5-5.6ZM9.8 15.5v-7l6 3.5-6 3.5Z"/></svg>'};

/* ---------------- Foundation decorative artwork (hand-drawn SVG generators) ---------------- */
const fish=(fill='#168A45',stroke='#164B8C')=>`<svg viewBox="0 0 116 64" fill="none" aria-hidden="true">
<path d="M6 32 Q30 8 66 20 Q78 24 80 32 Q78 40 66 44 Q30 56 6 32 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M78 28 L108 12 L99 32 L108 52 L78 36 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M34 18 Q42 7 54 9 Q47 16 44 24 Z" fill="#F15A24" stroke="${stroke}" stroke-width="1.8"/>
<path d="M40 46 Q47 55 57 52 Q51 46 49 39 Z" fill="#168642" stroke="${stroke}" stroke-width="1.8"/>
<circle cx="23" cy="28" r="3.6" fill="${stroke}"/><circle cx="24.3" cy="26.8" r="1.2" fill="#FFF8E7"/>
<path d="M36 23 Q31 32 36 41" stroke="${stroke}" stroke-width="1.8"/>
<path d="M48 24 Q45 32 48 40 M58 25 Q56 32 58 39 M68 27 Q67 32 68 37" stroke="${stroke}" stroke-width="1.5"/>
<path d="M7 30 L14 27 M7 34 L14 37" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round"/></svg>`;

function lotusFan(){ /* divider centrepiece — lotus with side leaves */
  const petals=[-72,-48,-24,0,24,48,72].map((a,i)=>`<g transform="rotate(${a})"><path d="M0 -8 C -12 -24 -12 -46 0 -56 C 12 -46 12 -24 0 -8 Z" fill="${i%2?'#168A45':'#F15A24'}" stroke="#164B8C" stroke-width="2.2" stroke-linejoin="round"/><path d="M0 -14 L0 -50" stroke="#164B8C" stroke-width="1" opacity=".5"/></g>`).join('');
  return `<svg viewBox="-56 -58 112 82" width="92" aria-hidden="true">
  <ellipse cx="-30" cy="8" rx="20" ry="9" transform="rotate(-24 -30 8)" fill="#168642" stroke="#164B8C" stroke-width="2"/>
  <ellipse cx="30" cy="8" rx="20" ry="9" transform="rotate(24 30 8)" fill="#168642" stroke="#164B8C" stroke-width="2"/>
  <g transform="translate(0 12)">${petals}</g></svg>`;
}
function foundationLogo(size=40,cls=''){
  return `<img src="assets/images/sjf-logo.png" width="${size}" height="${size}" class="sjf-logo ${cls}" style="--sjf-logo-size:${size}px" alt="Sashi Jamuna Foundation logo">`;
}
function medallion({spin=true}={}){ /* hero sun medallion with rays, dots & petal rings */
  const S='#164B8C',V='#F15A24',G='#168A45',T='#168642',C='#FFF8E7';
  let rays='',dots='',petals='';
  for(let i=0;i<24;i++)rays+=`<path d="M0 -126 L9 -152 L-9 -152 Z" fill="${i%2?G:V}" stroke="${S}" stroke-width="1.4" transform="rotate(${i*15})"/>`;
  for(let i=0;i<28;i++){const a=i*(360/28)*Math.PI/180;dots+=`<circle cx="${(112*Math.cos(a)).toFixed(1)}" cy="${(112*Math.sin(a)).toFixed(1)}" r="2.5" fill="${i%2?T:S}"/>`;}
  for(let i=0;i<16;i++)petals+=`<g transform="rotate(${i*22.5})"><path d="M0 -60 C -11 -72 -11 -92 0 -102 C 11 -92 11 -72 0 -60 Z" fill="${i%2?C:'#FBEBCB'}" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/><path d="M0 -66 L0 -96" stroke="${S}" stroke-width="1.1" opacity=".45"/></g>`;
  return `<svg viewBox="-160 -160 320 320" class="w-full h-auto drop-shadow-xl" role="img" aria-label="Decorative sun emblem">
  <g class="${spin?'rot':''}">${rays}</g>
  <circle r="124" fill="${C}" stroke="${S}" stroke-width="3"/>
  ${dots}
  <g class="${spin?'rot-rev':''}">${petals}</g>
  <circle r="58" fill="${G}" stroke="${S}" stroke-width="2.5"/>
  <circle r="50" fill="none" stroke="${C}" stroke-width="1.6" stroke-dasharray="1 5" stroke-linecap="round"/>
  <circle r="46" fill="#FFF3DA" stroke="${S}" stroke-width="1.6"/>
  <g fill="#fff" stroke="${S}" stroke-width="1.8"><path d="M-27 -6 Q-19 -17 -11 -6 Q-19 -2 -27 -6 Z"/><path d="M27 -6 Q19 -17 11 -6 Q19 -2 27 -6 Z"/></g>
  <circle cx="-19" cy="-8" r="2.3" fill="${S}"/><circle cx="19" cy="-8" r="2.3" fill="${S}"/>
  <path d="M-28 -15 Q-19 -20 -10 -14 M10 -14 Q19 -20 28 -15" stroke="${S}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M0 -3 Q4 7 -2 10" stroke="${S}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M-12 22 Q0 16 12 22 Q0 32 -12 22 Z" fill="${V}" stroke="${S}" stroke-width="1.8"/>
  <path d="M0 -34 Q4 -26 0 -20 Q-4 -26 0 -34 Z" fill="${V}"/>
  <circle cx="-31" cy="10" r="1.8" fill="${V}"/><circle cx="31" cy="10" r="1.8" fill="${V}"/></svg>`;
}
const divider=()=>`<div class="mhb-rule py-2 rv" aria-hidden="true"><span class="arm"></span><span class="d-fish">${fish('#168A45')}</span>${lotusFan()}<span class="d-fish flip">${fish('#168642')}</span><span class="arm"></span></div>`;
const crn=()=>`<i class="crn crn-tl"></i><i class="crn crn-tr"></i><i class="crn crn-bl"></i><i class="crn crn-br"></i>`;
const miniRule=(dark=false)=>`<span class="m-mini ${dark?'dg':''}" aria-hidden="true"><span></span><i class="dia ${dark?'':'v'}"></i><span></span></span>`;


const ICOL={navy:['#164B8C','#E9EFF9'],ver:['#F15A24','#FFF0E6'],teal:['#168642','#E2F3F0'],gold:['#0F6835','#FCF0DA']};

/* ---------------- tiny UI helpers ---------------- */
function toast(msg,type='ok'){const t=document.createElement('div');t.className='toast '+type;
  t.innerHTML=`${ic(type==='ok'?'check':'alert','mt-0.5')}<span>${msg}</span>`;
  $('#toast-root').appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),380)},3600);}
function openModal(html,cls=''){ $('#modal-root').innerHTML=`<div class="modal-bg ${cls}" data-act="modal-x"><div class="modal-card ${cls==='lb-bg'?'!max-w-[96vw] !bg-transparent !border-0 !shadow-none':''}" onclick="event.stopPropagation()">${html}</div></div>`;document.body.style.overflow='hidden';}
function closeModal(){if ($('#sjf-video-viewer')) { closeVideoViewer(); return; } $('#modal-root').innerHTML='';document.body.style.overflow='';}
/* ---------------- shell: header & footer ---------------- */
const NAV=[['home','Home'],['about','About Us'],['initiatives','Initiatives'],['gallery','Gallery'],['videos','Videos'],['news','Updates'],['contact','Contact']];
const ROUTES={home:'3.html',about:'about.html',initiatives:'initiatives.html',gallery:'gallery.html',videos:'videos.html',news:'updates.html',donate:'donate.html',volunteer:'volunteer.html',contact:'contact.html'};
const routeHref=name=>ROUTES[name]||'#'+name;
const currentPage=()=>document.body.dataset.page||'home';
function header(){const links=NAV.map(([r,l])=>`<a class="nlink" data-nav="${r}" href="${routeHref(r)}">${l}</a>`).join('');
 return `<header id="site-head" class="relative z-50">
  <div class="bar"><div class="wrap flex items-center justify-between h-16 md:h-20">
    <a href="${routeHref('home')}" class="flex items-center gap-2.5 group" aria-label="Sashi Jamuna Foundation home">
      ${foundationLogo(40)}
      <span class="brand-lockup font-disp text-xl md:text-[1.35rem]"><span class="brand-line"><span class="brand-sashi">SASHI</span> <span class="brand-jamuna">Jamuna</span></span><span class="brand-foundation">Foundation</span></span></a>
    <nav class="hidden lg:flex items-center gap-7" aria-label="Primary">${links}</nav>
    <div class="flex items-center gap-3">
      <button type="button" class="sjf-language-switch" data-act="language" data-no-i18n aria-label="Change language / भाषा बदलें"><span lang="hi">हिंदी</span><span aria-hidden="true"> / </span><span lang="en">EN</span></button>
      <a href="${routeHref('volunteer')}" class="btn btn-ghost btn-sm hidden md:inline-flex">${ic('sparkle')} Volunteer</a>
      <a href="${routeHref('donate')}" class="btn btn-fire btn-sm">${ic('heart')} Donate</a>
      <button class="lg:hidden w-11 h-11 grid place-items-center rounded-xl border-2 border-navy/20 text-navy" data-act="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mnav">${ic('menu','w-6 h-6')}</button>
    </div></div></div>
  <div id="mnav" class="lg:hidden absolute top-full inset-x-0 border-b-2 border-navy/10 shadow-xl">
    <nav class="wrap py-4 flex flex-col gap-1" aria-label="Mobile">${NAV.map(([r,l])=>`<a class="px-3 py-3 rounded-xl font-bold text-navy hover:bg-navy/5 flex items-center justify-between" data-nav="${r}" href="${routeHref(r)}">${l}${ic('chevR','w-4 h-4 opacity-40')}</a>`).join('')}
    <div class="flex gap-3 px-3 py-3"><a href="${routeHref('donate')}" class="btn btn-fire btn-sm flex-1">${ic('heart')} Donate</a><a href="${routeHref('volunteer')}" class="btn btn-ghost btn-sm flex-1">${ic('sparkle')} Volunteer</a></div></nav></div>
 </header>`;}
function footer(){const s=DB.data.settings;
 const soc=(key,brand,label)=>s[key]?`<a href="${esc(s[key])}" target="_blank" rel="noopener" aria-label="${label}" class="w-11 h-11 rounded-full grid place-items-center bg-cream/10 text-cream hover:bg-gold hover:text-night transition">${brand}</a>`
  :`<button aria-label="${label}" data-act="soc" class="w-11 h-11 rounded-full grid place-items-center bg-cream/10 text-cream hover:bg-gold hover:text-night transition">${brand}</button>`;
 const defaultAddress='Rosera, Bihar, India';
 const finalAddress = (s.address && s.address.trim()) ? s.address.trim() : defaultAddress;
 return `<footer class="relative g-navy text-cream overflow-hidden">
  <div style="height:22px;background:var(--arm-dark) repeat-x center/48px 22px" aria-hidden="true"></div>
  <div class="pat-dark" aria-hidden="true"></div>
  <div class="wrap relative py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
    <div><div class="flex items-center gap-3">${foundationLogo(64)}<span class="brand-lockup font-disp text-2xl"><span class="brand-line"><span class="brand-sashi">SASHI</span> <span class="brand-jamuna">Jamuna</span></span><span class="brand-foundation">Foundation</span></span></div>
      <p class="mt-4 text-cream/70 text-[15px] max-w-sm">A community-led foundation in Rosera, Bihar, supporting children through learning, care and shared opportunity.</p>
      <div class="mt-5 flex gap-3">${soc('instaUrl',BRAND.ig,'Instagram')}${soc('fbUrl',BRAND.fb,'Facebook')}${soc('ytUrl',BRAND.yt,'YouTube')}</div></div>
    <div><h4 class="font-disp text-lg text-gold">Quick Links</h4><ul class="mt-4 space-y-2.5 text-cream/75">${NAV.map(([r,l])=>`<li><a class="hover:text-gold transition flex items-center gap-2" href="${routeHref(r)}"><i class="dia" style="width:6px;height:6px"></i>${l}</a></li>`).join('')}
      <li><a class="hover:text-gold transition flex items-center gap-2" href="${routeHref('donate')}"><i class="dia" style="width:6px;height:6px"></i>Donate</a></li><li><a class="hover:text-gold transition flex items-center gap-2" href="${routeHref('volunteer')}"><i class="dia" style="width:6px;height:6px"></i>Volunteer</a></li></ul></div>
    <div><h4 class="font-disp text-lg text-gold">Our Work</h4><ul class="mt-4 space-y-2.5 text-cream/75">${DB.data.initiatives.slice(0,6).map(i=>`<li><a class="hover:text-gold transition flex items-center gap-2" href="${routeHref('initiatives')}"><i class="dia" style="width:6px;height:6px"></i>${esc(i.title)}</a></li>`).join('')}</ul></div>
    <div><h4 class="font-disp text-lg text-gold">Reach Us</h4>
      <ul class="mt-4 space-y-3 text-cream/75 text-[15px]">
        <li class="flex gap-3">${ic('pin','mt-1 text-gold')}<span class="ph !text-cream/60">${esc(finalAddress)}</span></li>
        <li class="flex gap-3">${ic('mail','mt-1 text-gold')}${s.email?`<a class="hover:text-gold" href="mailto:${esc(s.email)}">${esc(s.email)}</a>`:'<span class="ph !text-cream/60">[email@example.com]</span>'}</li>
        <li class="flex gap-3">${ic('phone','mt-1 text-gold')}${s.phone?`<a class="hover:text-gold" href="tel:${esc(s.phone)}">${esc(s.phone)}</a>`:'<span class="ph !text-cream/60">[+91 — — — —]</span>'}</li></ul>
      <form data-form="f-news" class="mt-5 flex gap-2"><input type="email" name="email" required placeholder="Email for updates" aria-label="Email for updates" class="!bg-night/40 !border-cream/20 !text-cream placeholder:text-cream/40"><button class="btn btn-gold btn-sm px-4" aria-label="Subscribe">${ic('arrowR')}</button></form></div>
  </div>
  <div class="relative border-t border-cream/15"><div class="wrap py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-cream/65">
    <span>&copy; ${new Date().getFullYear()} Sashi Jamuna Foundation. All rights reserved.</span>
    <span class="flex items-center gap-1.5">${ic('heart','text-ver')} Designed &amp; Developed by <b class="text-cream font-bold">Alpha Avics Digital Solutions</b>.</span>
    <a href="admin.html" class="flex items-center gap-1.5 hover:text-gold transition text-xs">${ic('key','w-3.5 h-3.5')} Admin</a>
  </div></div></footer>`;}

/* ---------------- shared components ---------------- */
const secHead=(eyebrow,title,sub='',dark=false)=>`<div class="text-center max-w-2xl mx-auto rv">
  <span class="eyebrow ${dark?'gold':''}">${eyebrow}</span>
  <h2 class="font-disp text-[clamp(1.9rem,4vw,2.9rem)] leading-tight mt-3 ${dark?'text-cream':'text-navy'}">${title}</h2>
  ${sub?`<p class="mt-3 ${dark?'text-cream/75':'text-ink/70'}">${sub}</p>`:''}
  <div class="mt-5">${miniRule(dark)}</div></div>`;
function pageHero(title,sub=''){return `<section class="relative overflow-hidden bg-cream pt-32 pb-14 md:pt-40 md:pb-16">
  <div class="absolute -right-24 -top-24 w-[340px] opacity-[.12] pointer-events-none" aria-hidden="true">${medallion()}</div>
  <div class="wrap relative text-center rv in">
    <nav class="text-xs font-bold tracking-widest uppercase text-ink/45 flex items-center justify-center gap-2" aria-label="Breadcrumb"><a href="#home" class="hover:text-ver">Home</a>${ic('chevR','w-3 h-3')}<span class="text-ver">${title}</span></nav>
    <h2 class="font-disp text-[clamp(2.3rem,5.5vw,3.8rem)] text-navy mt-3">${title}</h2>
    ${sub?`<p class="mt-3 text-ink/65 max-w-2xl mx-auto text-lg">${sub}</p>`:''}
    <div class="mt-5">${miniRule()}</div></div></section>`;}

/* ---------------- HOME ---------------- */
function heroBackground(){
  const allowed = ['assets/images/hero1.jpeg','assets/images/k1.jpeg','assets/images/r3.jpeg','assets/images/c3.jpeg'];
  let image = ''; try { image = localStorage.getItem('sjf_madhubani_hero_background') || ''; } catch (_) {}
  return allowed.includes(image) ? image : '';
}
function heroSection(){const background = heroBackground(); return `<section id="publicHero" data-motion-static class="relative min-h-[94vh] flex items-center overflow-hidden pt-28 pb-16 ${background ? 'sjf-madhubani-photo-hero' : ''}"${background ? ` style="--sjf-hero-photo:url('${background}')"` : ''}>
  <div class="hero-fish-track hero-fish-right" aria-hidden="true">${fish('#F15A24')}</div>
  <div class="hero-fish-track hero-fish-left" aria-hidden="true">${fish()}</div>
  <div class="hero-fish-track hero-fish-mini hero-fish-mini-one" aria-hidden="true">${fish('#F15A24')}</div>
  <div class="hero-fish-track hero-fish-mini hero-fish-mini-two" aria-hidden="true">${fish('#168A45')}</div>
  <div class="hero-fish-track hero-fish-mini hero-fish-mini-three" aria-hidden="true">${fish('#164B8C','#F15A24')}</div>
  <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none" style="background:radial-gradient(circle,#168A4566,transparent 70%)" aria-hidden="true"></div>
  <div class="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25 pointer-events-none" style="background:radial-gradient(circle,#16864277,transparent 70%)" aria-hidden="true"></div>
  <div class="wrap relative sjf-home-hero-grid">
    <div class="sjf-home-hero-copy text-center lg:text-left">
      <span class="eyebrow rv">Sashi Jamuna Foundation</span>
      <h1 class="font-disp leading-[1.06] text-navy mt-4 rv" style="--d:80ms"><span data-home-copy="heroLead1">Rooted in</span> <span class="grad-fire" data-home-copy="heroAccent1">Culture</span>,<br><span data-home-copy="heroLead2">Empowering</span> <span class="grad-teal" data-home-copy="heroAccent2">Communities</span>.</h1>
      <p data-home-copy="heroDescription" class="mt-5 text-lg text-ink/75 max-w-xl mx-auto lg:mx-0 rv" style="--d:160ms">A community-led foundation creating spaces where children learn, grow and belong.</p>
      <div class="sjf-hero-values"><dl class="sjf-hero-slogans" aria-label="Foundation values">
        <div><dt>EDUCATION</dt><dd>Knowledge creates opportunity.</dd></div>
        <div><dt>EMPOWERMENT</dt><dd>Every individual deserves a chance.</dd></div>
        <div><dt>PROGRESS</dt><dd>Together, we build a better tomorrow.</dd></div>
      </dl><figure class="sjf-hero-scrapbook"><img class="sjf-hero-values-photo" src="assets/images/hero1a.jpeg" width="1024" height="1536" alt="Portrait with folded hands" decoding="async"></figure></div>
      <div class="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start rv" style="--d:240ms">
        <a href="#donate" class="btn btn-fire">${ic('heart')} Donate Now</a>
        <a href="#volunteer" class="btn btn-ghost">${ic('sparkle')} Become a Volunteer</a></div>
      <div class="mt-10 flex items-center gap-3 justify-center lg:justify-start rv" style="--d:320ms">
        ${foundationLogo(30)}<span class="text-sm font-bold text-navy/70">Supervised by Gaurav Thakur</span></div>
    </div>
    <div class="sjf-home-hero-media relative rv" style="--d:200ms">
      <div class="sjf-home-hero-circle relative mx-auto">
        <div class="hero-kids-frame">
          <video autoplay muted loop playsinline preload="auto" poster="assets/images/video-posters/1003.jpg" aria-label="1003.mp4 from Sashi Jamuna Foundation"><source src="assets/videos/1003.mp4" type="video/mp4"></video>
        </div>
        <div class="chip -left-2 top-8" style="animation-delay:-1s">${ic('palette')} Culture-Rooted</div>
        <div class="chip right-0 bottom-28" style="animation-delay:-3.5s">${ic('heart')} Community-First</div>
        <div class="chip left-4 -bottom-2" style="animation-delay:-2s">${ic('shield')} Transparent</div>
      </div></div>
  </div>
  <div class="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex" aria-hidden="true"><div class="scroll-cue"><span></span></div></div>
</section><div class="scallop" aria-hidden="true"></div>`;}
function marquee(){const words=['SERVICE','COMPASSION','DIGNITY','COMMUNITY','CULTURE','HOPE'];
 const track=words.map(w=>`<span class="mq-it">${w}</span><i class="dia"></i>`).join('');
 return `<section class="g-navy relative overflow-hidden py-4 border-y-[3px] border-gold/80" aria-hidden="true"><div class="pat-dark"></div>
  <div class="relative flex overflow-hidden"><div class="marquee font-disp text-cream text-lg md:text-xl tracking-[.15em]"><div class="mq">${track}</div><div class="mq">${track}</div></div></div></section>`;}
function statsBand(){const st=DB.data.stats.filter(x=>x.label!=='Villages Reached');
 return `<section class="relative g-navy py-16 md:py-20 text-cream overflow-hidden"><div class="pat-dark" aria-hidden="true"></div>
  <div class="absolute -left-24 -bottom-24 w-80 opacity-[.09] pointer-events-none" aria-hidden="true">${medallion({spin:false})}</div>
  <div class="wrap relative">${secHead('Measurable Good','Impact You Can Verify','We publish nothing until it is verified — real numbers, real lives, real change.',true)}
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12">
    ${st.map((x,i)=>`<div class="text-center rv" style="--d:${i*90}ms">
      <div class="font-disp text-5xl md:text-6xl">${x.value?`<span data-count="${esc(x.value)}" data-suffix="${esc(x.suffix||'')}">0</span>`:'<span class="stat-x">—</span>'}</div>
      <div class="mt-3 font-extrabold tracking-wide">${esc(x.label)}</div>
      ${x.value?'<div class="text-cream/55 text-xs mt-1">Verified figure</div>':''}</div>`).join('')}
    </div>
    <p class="text-center text-cream/55 text-xs mt-10 rv">Placeholder dashes are intentional — replace with audited impact data from the Admin Dashboard.</p></div></section>`;}
function videoFrame(v){return `<div class="vframe ${v.src?'local-video':''}" data-id="${esc(v.id)}"><img src="${esc(window.SJFMedia.poster(v))}" alt="${esc(v.title)}" loading="lazy" decoding="async"><button class="playbtn" data-act="play-video" data-id="${esc(v.id)}" aria-label="Play ${esc(v.title)}">${ic('play','w-7 h-7')}</button>${v.duration?`<span class="video-duration">${window.SJFMedia.duration(v.duration)}</span>`:''}</div>`;}
function videoSection(){const stories=['sjf-day-13','sjf-day-15','sjf-day-16'].map(id=>DB.data.videos.find(video=>video.id===id)).filter(Boolean),v=stories[0];
 const main=v?videoFrame(v)
 :`<div class="vframe grid place-items-center"><div class="pat-dark" aria-hidden="true"></div>
    <div class="relative text-center px-6"><div class="mx-auto w-20 h-20 rounded-full border-2 border-dashed border-cream/40 grid place-items-center text-cream/50">${ic('video','w-8 h-8')}</div>
    <h3 class="font-disp text-2xl text-cream mt-4">Video stories coming soon</h3>
    <p class="ph !text-cream/60 mt-2 max-w-sm mx-auto">New video stories from the foundation will appear here.</p></div></div>`;
 const rows=stories.slice(1).map(x=>`<button type="button" class="home-video-row flex gap-4 items-center card p-3" data-act="play-video" data-id="${esc(x.id)}" aria-label="Play ${esc(x.title)}"><span class="w-24 h-16 rounded-lg overflow-hidden flex-none bg-night"><img src="${esc(window.SJFMedia.poster(x))}" alt="" class="w-full h-full object-contain" loading="lazy" decoding="async"></span><span class="font-bold text-navy text-sm leading-snug">${esc(x.title)}${x.duration?`<span class="block text-xs font-normal text-ink/60 mt-1">${window.SJFMedia.duration(x.duration)}</span>`:''}</span>${ic('play','w-5 h-5 ml-auto')}</button>`).join('');
 return `<section class="py-16 md:py-20">
  <div class="wrap mb-9 text-center rv"><span class="eyebrow sjf-stories-label">Stories that moved us</span><h2 class="font-disp text-[clamp(1.9rem,4vw,2.9rem)] leading-tight text-navy mt-3">Stories that move us.</h2></div>
  <div class="sjf-story-showcase rv">
    <div class="sjf-story-panel sjf-story-panel-orange">
      <div class="sjf-story-badge">${foundationLogo(54,'sjf-story-logo')}</div>
      <p class="sjf-story-kicker">We Give Child A Gift Of Education</p>
      <h3>Become A Volunteer?</h3>
      <a href="#volunteer" class="btn btn-fire sjf-story-button">Contact Now</a>
    </div>
    <div class="sjf-story-centerpiece" id="homeFeaturedVideo">${main}${v?`<h3 class="font-bold text-navy px-3 pt-4 pb-2" id="homeVideoTitle">${esc(v.title)}</h3>`:''}</div>
    <div class="sjf-story-panel sjf-story-panel-green">
      <div class="sjf-story-badge">${foundationLogo(54,'sjf-story-logo')}</div>
      <p class="sjf-story-kicker">We Give Child A Gift Of Education</p>
      <h3>Make Donation To Us?</h3>
      <a href="#donate" class="btn btn-gold sjf-story-button">Donate Now</a>
    </div>
  </div>
  <div class="wrap"><div class="sjf-story-footer-card rv" style="--d:180ms">
    <div class="sjf-story-rows">${rows}</div>
    <a href="#videos" class="btn btn-navy">${ic('play')} Watch All Videos</a>
  </div></div></section>`;}
function socialVideos(){return DB.data.videos.filter(video=>/^sjf-video-0[1-6]$/.test(video.id)).sort((a,b)=>a.id.localeCompare(b.id));}
function socialWall(){const s=DB.data.settings, videos=socialVideos().map(videoFrame).join('');
 const tile=(cls,icon,label)=>`<div class="rounded-xl border-2 border-dashed border-navy/20 ${cls} grid place-items-center py-7 text-navy/40">${icon}<span class="text-[10px] font-bold tracking-widest mt-1">${label}</span></div>`;
 const card=(brand,name,handle,url,cls,tiles)=>`<div class="card overflow-hidden rv">
   <div class="flex items-center gap-3 p-4 border-b-2 border-navy/10"><span class="w-11 h-11 rounded-xl grid place-items-center text-white ${cls}">${brand}</span>
   <div class="flex-1 min-w-0"><b class="text-navy">${name}</b><span class="block text-xs text-ink/50 truncate">${handle}</span></div>
   ${url?`<a href="${esc(url)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">${ic('external','w-3.5 h-3.5')} Follow</a>`:`<button class="btn btn-ghost btn-sm" data-act="soc">${ic('plus','w-3.5 h-3.5')} Connect</button>`}</div>
   <div class="grid grid-cols-3 gap-1.5 p-3" ${name==='YouTube'?'':'data-social-feed="'+name+'"'}>${tiles}</div>
   ${url?'':'<p class="text-center text-[11px] text-ink/45 pb-3 px-3">Paste your official links in Admin &rarr; Settings to activate feeds &amp; embeds.</p>'}</div>`;
 return `<section class="py-20 md:py-24"><div class="wrap">${secHead('Stay Connected','Follow the Journey','Daily moments from the field — pick your favourite window into our world.')}
  <div class="grid md:grid-cols-3 gap-6 mt-12">
  ${card(BRAND.ig,'Instagram',s.instaUrl?'@'+new URL(s.instaUrl).pathname.split('/').filter(Boolean).pop():'@yourfoundation',s.instaUrl,'g-fire',videos)}
  ${card(BRAND.fb,'Facebook',s.fbUrl?'Facebook Page':'/yourfoundation',s.fbUrl,'bg-[#1877F2]',videos)}
  ${card(BRAND.yt,'YouTube',DB.data.videos.filter(v=>v.youtube).length?DB.data.videos.filter(v=>v.youtube).length+' YouTube videos':'YouTube Channel',s.ytUrl,'bg-[#CD201F]',Array(6).fill(tile('bg-[#CD201F]/5',BRAND.yt,'VIDEO')).join(''))}
  </div></div></section>`;}
function viewHome(){const ins=DB.data.initiatives,gals=DB.data.gallery.slice(0,6),ups=DB.data.updates.slice(0,3);
 return `<div id="publicHeroSlot">${heroSection()}</div>
 ${marquee()}
 ${videoSection()}
 <section id="who-we-are" class="py-20 md:py-28"><div class="wrap sjf-about-layout">
     <div class="sjf-about-collage">
       <figure class="sjf-about-photo sjf-about-class"><img src="assets/images/c8.jpeg" alt="Children learning together at the foundation" loading="lazy" decoding="async" width="4096" height="2304"></figure>
       <figure class="sjf-about-photo sjf-about-plant"><img src="assets/images/r4.jpeg" alt="Children holding saplings at a foundation gathering" loading="lazy" decoding="async" width="1034" height="1280"></figure>
       <figure class="sjf-about-photo sjf-about-march"><img src="assets/images/indi3.jpeg" alt="Community members carrying the Indian flag in a procession" loading="lazy" decoding="async" width="757" height="1280"></figure>
       <figure class="sjf-about-photo sjf-about-award"><img src="assets/images/k1.jpeg" alt="A performer receiving flowers at a foundation recognition ceremony" loading="lazy" decoding="async" width="1600" height="900"></figure>
       <figure class="sjf-about-photo sjf-about-group"><img src="assets/images/hero2.jpeg" alt="Guests and a performer seated at a foundation recognition ceremony" loading="lazy" decoding="async" width="1280" height="720"></figure>
     </div>
   <div class="sjf-about-copy">
     <div class="rv"><span class="eyebrow">Who We Are</span>
       <h2 class="font-disp text-[clamp(1.9rem,4vw,2.9rem)] leading-tight text-navy mt-3">A shared commitment to<br>every child’s future.</h2></div>
     <p class="mt-5 text-ink/75 text-lg rv text-center" style="--d:100ms">Sashi Jamuna Foundation is a community-led non-profit based in Rosera, Bihar. Supervised by Gaurav Thakur, it brings children, families and volunteers together to support learning, personal growth and a sense of belonging.</p>
    <p class="mt-5 text-ink/75 text-lg rv">The minimum donation to support children at the foundation is just Rs. 11/-, a small amount that makes it easier for everyone to contribute.</p>
     <p class="mt-6 text-ink/70 text-[15px] rv text-center" style="--d:160ms">Rooted in Rosera, Bihar, our work centres on children, youth development and community care.</p>
     <ul class="mt-6 space-y-3.5 rv" style="--d:220ms">
       <li class="flex gap-3 items-start">${ic('users','text-ver mt-0.5')}<span class="font-bold text-navy">Community-first</span><span class="text-ink/65">— programs shaped with the people we serve</span></li>
       <li class="flex gap-3 items-start">${ic('palette','text-ver mt-0.5')}<span class="font-bold text-navy">Child-focused</span><span class="text-ink/65">— children's learning and wellbeing come first</span></li>
       <li class="flex gap-3 items-start">${ic('shield','text-ver mt-0.5')}<span class="font-bold text-navy">Transparent by design</span><span class="text-ink/65">— verified numbers, open books</span></li></ul>
     <div class="text-center"><a href="#about" class="btn btn-navy mt-8 rv" style="--d:280ms">Read Our Story ${ic('arrowR')}</a></div>
   </div></div></section>
 ${divider()}
 <section class="py-20 md:py-24 bg-white/70"><div class="wrap">
   ${secHead('What We Do','Our Initiatives','Five streams of steady, grassroots work.')}
   <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
   ${ins.map((x,i)=>{const c=ICOL[x.color]||ICOL.navy;return `<article class="card p-7 group rv" style="--d:${i*80}ms">${crn()}
     <div class="flex justify-between items-start"><span class="w-14 h-14 rounded-2xl grid place-items-center transition-transform group-hover:rotate-6 group-hover:scale-110" style="background:${c[1]};color:${c[0]}">${ic(x.icon,'w-7 h-7')}</span>
     <span class="font-disp text-4xl text-navy/10 group-hover:text-navy/20 transition">0${i+1}</span></div>
     <h3 class="mt-5 text-xl font-extrabold text-navy">${esc(x.title)}</h3>
     <p class="mt-2 text-[15px] ${x.desc.startsWith('[')?'ph':'text-ink/70'}">${esc(x.desc)}</p>
     <a href="#initiatives" class="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-ver hover:gap-3 transition-all">Explore ${ic('arrowR','w-4 h-4')}</a></article>`;}).join('')}
   </div>
 </div></section>
 ${statsBand()}
 <section class="py-20 md:py-24 bg-white/70"><div class="wrap">
   ${secHead('Moments &amp; Memories','From Our Gallery','Glimpses of the work, the people and the joy in between.')}
   <div class="sjf-gallery-marquee mt-12" id="home-gallery" data-motion-static>
     <div class="sjf-gallery-track">${[false,true].map(copy=>`<div class="sjf-gallery-group"${copy?' aria-hidden="true"':''}>${gals.map((g,i)=>`<button class="g-item" data-act="lb" data-scope="home" data-idx="${i}"${copy?' tabindex="-1"':''} aria-label="Open photo: ${esc(g.title)}"><img src="${esc(g.src)}" alt="${copy?'':esc(g.title)}" ${g.width && g.height ? `width="${g.width}" height="${g.height}"` : ''} loading="lazy" decoding="async"><span class="g-ov text-xs">${ic('image','w-4 h-4 mb-1')} View</span></button>`).join('')}</div>`).join('')}</div>
   </div>
   <div class="text-center mt-8 rv"><a href="#gallery" class="btn btn-ghost">${ic('camera')} View Full Gallery</a>
   </div>
 </div></section>
 ${socialWall()}
 <section class="py-20 md:py-24 bg-white/70"><div class="wrap">
   ${secHead('Fresh From the Field','Daily Updates','News, notes and little victories — published straight from the dashboard.')}
   <div class="grid md:grid-cols-3 gap-6 mt-12">${ups.map((u,i)=>updateCard(u,i)).join('')||'<p class="ph">No updates yet.</p>'}</div>
   <div class="text-center mt-8 rv"><a href="#news" class="btn btn-navy">${ic('megaphone')} Read All Updates</a></div>
 </div></section>`;}function updateCard(u,i=0){const d=new Date(u.date);
 return `<article class="card p-6 rv" style="--d:${i*90}ms">${crn()}
  <div class="flex items-center gap-3">
    <span class="cal" aria-hidden="true"><b>${u.date ? d.toLocaleDateString(window.SJFLocale?.locale || 'en-IN',{month:'short'}).toUpperCase() : 'DATE'}</b><span>${u.date ? d.getDate() : '—'}</span></span>
    <span class="badge ${u.sample?'b-wait':'b-init'}">${u.sample?'SAMPLE':esc(u.tag||'Update')}</span></div>
  <h3 class="mt-4 text-lg font-extrabold text-navy leading-snug">${esc(u.title)}</h3>
  <p class="mt-2 text-ink/70 text-[15px] whitespace-pre-line line-clamp-4">${esc(u.body)}</p>
  <div class="mt-4 text-xs text-ink/45 flex items-center gap-2">${ic('calendar','w-3.5 h-3.5')} ${fmtDate(u.date)}</div></article>`;}

/* ---------------- ABOUT ---------------- */
function viewAbout(){const vals=[['heart','Compassion','Every decision begins with kindness.'],['users','Inclusion','No one left on the margins.'],['shield','Integrity','Honest work, honest books.'],['book','Opportunity','A chance to learn and grow.']];
 return `${pageHero('About Us','The people, purpose and community behind Sashi Jamuna Foundation.')}
 <section class="py-16 md:py-20"><div class="wrap grid lg:grid-cols-2 gap-14 items-center">
  <div class="relative rv"><div class="card !p-3 rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500">${crn()}
    ${photoSlideshow('about-slideshow','Foundation photo slideshow')}</div>
    <div class="absolute -top-6 -left-5 w-16 fl" aria-hidden="true">${fish()}</div></div>
  <div class="rv" style="--d:120ms"><span class="eyebrow">Our Story</span>
    <h2 class="font-disp text-[clamp(1.8rem,3.6vw,2.6rem)] text-navy mt-3 leading-tight">Born from a simple belief:<br>together, we rise.</h2>
    <p class="mt-5 text-ink/75 text-lg">Sashi Jamuna Foundation is a community-led non-profit based in Rosera, Bihar. Supervised by Gaurav Thakur, it brings children, families and volunteers together to support learning, personal growth and a sense of belonging.</p>
    <p class="mt-5 text-ink/75 text-lg rv">The minimum donation to support children at the foundation is just Rs. 11/-, a small amount that makes it easier for everyone to contribute.</p>
    <div class="card p-5 mt-6">${crn()}<p class="ph text-[15px]">The foundation brings people together around education, community care and opportunity. Children can learn, volunteers can share their time, and families can take part in building a supportive community.</p></div>
    <div class="flex flex-wrap gap-3 mt-6">${['Rosera, Bihar','Volunteer-powered','Community-led'].map(t=>`<span class="px-4 py-2 rounded-full bg-navy/5 text-navy font-bold text-sm border-1.5 border-navy/15">${t}</span>`).join('')}</div></div>
 </div></section>
 <section class="py-16 md:py-20 bg-white/70"><div class="wrap">
  ${secHead('Why &amp; How','Mission, Vision &amp; Values')}
  <div class="grid md:grid-cols-3 gap-6 mt-12">
   ${[['sparkle','Our Mission','To work hand-in-hand with communities so every life we touch can bloom — with learning, health and dignity.'],['eye','Our Vision','A world where compassion is culture, and no one is left behind.'],['heart','Our Values','Kindness in intent, honesty in action, joy in service — every single day.']].map((v,i)=>`<div class="card p-8 text-center rv" style="--d:${i*100}ms">${crn()}
     <span class="mx-auto w-16 h-16 rounded-2xl g-fire text-white grid place-items-center">${ic(v[0],'w-7 h-7')}</span>
     <h3 class="font-disp text-xl text-navy mt-4">${v[1]}</h3><p class="text-ink/70 mt-2">${v[2]}</p></div>`).join('')}
  </div>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
   ${vals.map((v,i)=>`<div class="card p-5 flex items-center gap-3 rv" style="--d:${i*70}ms">${ic(v[0],'text-ver w-6 h-6 flex-none')}<div><b class="block text-navy">${v[1]}</b><span class="text-xs text-ink/55">${v[2]}</span></div></div>`).join('')}
  </div></div></section>
 <section class="relative g-navy py-16 md:py-20 text-cream overflow-hidden"><div class="pat-dark" aria-hidden="true"></div>
  <div class="wrap grid lg:grid-cols-[.8fr_1.2fr] gap-12 items-center relative">
   <div class="rv mx-auto">${foundationLogo(220)}</div>
   <div class="rv" style="--d:120ms"><span class="eyebrow gold">Sashi Jamuna Foundation</span>
    <h2 class="font-disp text-3xl md:text-4xl mt-3">Every child deserves a chance.</h2>
    <p class="mt-4 text-cream/80 leading-relaxed">In Rosera, Bihar, Sashi Jamuna Foundation creates spaces where children can learn, grow and feel supported. Families and volunteers are part of this shared effort, with Gaurav Thakur supervising the foundation.</p>
    <p class="mt-3 text-cream/70">Support for children starts with a minimum donation of just Rs. 11/-. This small contribution lets more people take part in the foundation's work.</p>
    <div class="flex flex-wrap gap-3 mt-6">
     ${[['book','Education'],['heart','Care'],['users','Community']].map(([icon,label])=>`<span class="flex items-center gap-2 bg-cream/10 rounded-2xl px-4 py-2 text-sm font-bold">${ic(icon)}${label}</span>`).join('')}</div></div>
  </div></section>
 <section class="py-16 md:py-20"><div class="wrap">
  ${secHead('The People','Our Team','The hands and hearts behind the foundation.')}
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
  ${[1,2,3,4].map((n,i)=>`<div class="card p-7 text-center rv" style="--d:${i*90}ms">${crn()}
    <span class="mx-auto w-20 h-20 rounded-full grid place-items-center font-disp text-2xl text-navy" style="background:conic-gradient(from ${i*90}deg,#F15A24,#168A45,#168642,#164B8C) padding-box;border:5px solid #fff;box-shadow:0 8px 20px -6px rgba(22,75,140,.35)">TN</span>
    <h3 class="mt-4 font-extrabold text-navy ph">[Trustee / Member Name]</h3>
    <p class="text-sm text-ink/50 ph">[Designation &amp; one-line bio]</p></div>`).join('')}
  </div>
  <div class="text-center mt-8 rv"><span class="edi-note">${ic('edit','w-3.5 h-3.5')} Team placeholders — replace with real names &amp; photos</span></div>
  <div class="mt-14 text-center rv"><a href="#volunteer" class="btn btn-fire">${ic('sparkle')} Join the Team as a Volunteer</a></div>
 </div></section>`;}

/* ---------------- INITIATIVES ---------------- */
function viewInitiatives(){const ins=DB.data.initiatives;
 return `${pageHero('Our Initiatives','Streams of steady, grassroots work — each one shaped with the communities it serves.')}
 <section class="py-16 md:py-20"><div class="wrap grid md:grid-cols-2 gap-6">
  ${ins.map((x,i)=>{const c=ICOL[x.color]||ICOL.navy;return `<article class="card p-8 rv" style="--d:${i*80}ms">${crn()}
   <div class="flex items-center gap-4"><span class="w-16 h-16 rounded-2xl grid place-items-center flex-none" style="background:${c[1]};color:${c[0]}">${ic(x.icon,'w-8 h-8')}</span>
   <div><span class="font-disp text-3xl" style="color:${c[0]}22">0${i+1}</span><h3 class="text-xl font-extrabold text-navy">${esc(x.title)}</h3></div></div>
   <p class="mt-4 ${x.desc.startsWith('[')?'ph':'text-ink/70'}">${esc(x.desc)}</p>
   <div class="mt-5 ph text-sm">Focus areas &amp; regions: <span class="text-ink/40">[add regions, frequency &amp; partner communities]</span></div>
   <div class="mt-6 flex gap-3 flex-wrap"><a href="#donate" class="btn btn-fire btn-sm">${ic('heart')} Support This</a><a href="#volunteer" class="btn btn-ghost btn-sm">${ic('sparkle')} Volunteer Here</a></div></article>`;}).join('')}
 </div>
 <div class="text-center mt-6 rv"><span class="edi-note">${ic('edit','w-3.5 h-3.5')} Add, edit or remove initiatives — Admin &rarr; Initiatives</span></div></section>
 <section class="py-16 md:py-20 bg-white/70"><div class="wrap">
  ${secHead('How We Work','From Idea to Impact')}
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
  ${[['eye','Listen First','Understand what a community truly needs — not what we assume.'],['users','Co-create','Design every programme with local voices at the table.'],['sparkle','Act Together','Run drives with volunteers, partners and families.'],['megaphone','Share Openly','Report outcomes and numbers — verified, always.']].map((s,i)=>`
   <div class="relative card p-7 rv" style="--d:${i*90}ms">${crn()}
   <span class="absolute -top-4 left-7 w-9 h-9 rounded-full g-navy text-cream grid place-items-center font-disp text-sm">${i+1}</span>
   ${ic(s[0],'w-8 h-8 text-ver')}<h3 class="font-disp text-xl text-navy mt-3">${s[1]}</h3><p class="text-ink/70 mt-1 text-[15px]">${s[2]}</p></div>`).join('')}
  </div></div></section>
 <section class="pb-24"><div class="wrap">
  <div class="relative g-fire rounded-3xl p-10 md:p-14 text-cream text-center overflow-hidden rv">
   <div class="absolute -left-16 -bottom-20 w-72 opacity-20" aria-hidden="true">${lotusFan()}</div>
   <div class="absolute -right-10 -top-14 w-52 opacity-20 flip-x" aria-hidden="true">${fish('#FFF8E7','#0E3262')}</div>
   <h3 class="font-disp text-3xl md:text-4xl">Pick a cause. Plant a seed.</h3>
   <p class="mt-3 text-cream/85 max-w-xl mx-auto">Choose the initiative closest to your heart — and watch your contribution grow into someone's better day.</p>
   <div class="mt-8 flex flex-wrap gap-4 justify-center"><a href="#donate" class="btn btn-white">${ic('heart')} Donate Now</a><a href="#volunteer" class="btn btn-lite">${ic('sparkle')} Volunteer</a></div></div>
 </div></section>`;}

/* ---------------- GALLERY ---------------- */
let gfilter='All',LB={items:[],i:0};
function galleryGrid(){const cats=['All',...new Set(DB.data.gallery.map(g=>g.cat))];
 const list=gfilter==='All'?DB.data.gallery:DB.data.gallery.filter(g=>g.cat===gfilter);
 return `<div class="flex flex-wrap gap-2.5 justify-center rv">
  ${cats.map(c=>`<button class="gfil ${c===gfilter?'on':''}" data-act="gfil" data-cat="${esc(c)}">${esc(c)} ${c==='All'?`(${DB.data.gallery.length})`:`(${DB.data.gallery.filter(g=>g.cat===c).length})`}</button>`).join('')}</div>
 <div id="g-grid" class="masonry mt-10">${list.map((g,i)=>`<button class="g-item rv in" data-act="lb" data-scope="gallery" data-idx="${i}" aria-label="Open photo: ${esc(g.title)}"><img src="${esc(g.src)}" alt="${esc(g.title)}" ${g.width && g.height ? `width="${g.width}" height="${g.height}"` : ''} loading="lazy" decoding="async"><span class="g-ov"><span class="text-xs">${ic('image','w-4 h-4 inline mb-0.5')} ${esc(g.cat)}</span></span></button>`).join('')}</div>`;}
function viewGallery(){return `${pageHero('Gallery','Moments, memories and milestones — straight from the field.')}
 <section class="pb-24"><div class="wrap">${galleryGrid()}</div></section>`;}

/* ---------------- VIDEOS ---------------- */
function videoCard(v,i){return `<article class="card !p-3 rv" style="--d:${(i%3)*90}ms">
 ${videoFrame(v)}
 <div class="p-4"><h3 class="font-extrabold text-navy">${esc(v.title)}</h3>
 <p class="text-sm text-ink/60 mt-2">${esc(v.desc || '')}</p>${v.date?`<p class="text-xs text-ink/50 mt-1">Added ${fmtDate(v.date)}</p>`:''}</div></article>`;}
function galleryVideos(){return DB.data.videos.filter(video=>/^sjf-day-\d+$/.test(video.id)).sort((a,b)=>Number(a.id.slice(8))-Number(b.id.slice(8)));}
function viewVideos(){const vs=galleryVideos();
 return `${pageHero('Videos','Video stories from the foundation — watch, share, believe.')}
 <section class="pb-24"><div class="wrap">
 ${vs.length?`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${vs.map((v,i)=>videoCard(v,i)).join('')}</div>
 <p class="text-center text-xs text-ink/60 mt-8">${vs.length} video stories from Sashi Jamuna Foundation. Choose a video to watch.</p>`
 :`<div class="card p-8 md:p-12 text-center rv">${crn()}
   <div class="mx-auto w-24 h-24 rounded-full border-3 border-dashed border-navy/25 grid place-items-center text-navy/35">${ic('video','w-10 h-10')}</div>
   <h3 class="font-disp text-2xl md:text-3xl text-navy mt-5">No video stories yet</h3>
   <p class="ph mt-3 max-w-md mx-auto">New video stories from the foundation will appear here.</p>
   <div class="grid md:grid-cols-3 gap-5 mt-10">${[1,2,3].map(()=>`<div class="aspect-video rounded-xl sk"></div>`).join('')}</div></div>`}
 </div></section>`;}

/* Full-screen gallery player keeps its navigation around the video. */
let videoViewer = null;
function stopViewerVideo() {
  const player = $('#sjf-video-viewer video');
  if (!player) return;
  player.pause();
  player.removeAttribute('src');
  $$('source',player).forEach(source => source.remove());
  player.load();
}
function paintVideoViewer() {
  if (!videoViewer) return;
  stopViewerVideo();
  const item = videoViewer.items[videoViewer.index];
  $('#sjf-video-viewer-title').textContent = item.title;
  $('#sjf-video-viewer-count').textContent = `${videoViewer.index + 1} / ${videoViewer.items.length}`;
  window.SJFMedia.mount($('#sjf-video-viewer-stage'),item,{background:true});
  const player = $('#sjf-video-viewer video');
  if (player) player.setAttribute('controlsList','nofullscreen');
}
function stepVideoViewer(step) {
  if (!videoViewer) return;
  videoViewer.index = (videoViewer.index + step + videoViewer.items.length) % videoViewer.items.length;
  paintVideoViewer();
}
function closeVideoViewer() {
  const dialog = $('#sjf-video-viewer'), state = videoViewer;
  if (!dialog || !state) return;
  videoViewer = null;
  stopViewerVideo();
  if (dialog.contains(document.fullscreenElement) && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  dialog.close();
  dialog.remove();
  document.body.style.overflow = state.overflow;
  state.trigger?.focus({preventScroll:true});
}
function openVideoViewer(id,trigger,items=galleryVideos()) {
  const index = items.findIndex(item => item.id === id);
  if (index < 0) return;
  closeModal();
  videoViewer = {items,index,trigger,overflow:document.body.style.overflow,wasFullscreen:false};
  $('#modal-root').innerHTML = `<dialog id="sjf-video-viewer" class="sjf-video-viewer" aria-labelledby="sjf-video-viewer-title"><div class="sjf-video-viewer-shell">
    <header class="sjf-video-viewer-bar"><div aria-live="polite"><h2 id="sjf-video-viewer-title"></h2><span id="sjf-video-viewer-count"></span></div>
      <button type="button" class="sjf-video-viewer-control" data-act="video-close" aria-label="Close video">${ic('x')}</button></header>
    <div class="sjf-video-viewer-body"><button type="button" class="sjf-video-viewer-control" data-act="video-prev" aria-label="Previous video">${ic('chevL')}</button>
      <div id="sjf-video-viewer-stage"></div>
      <button type="button" class="sjf-video-viewer-control" data-act="video-next" aria-label="Next video">${ic('chevR')}</button></div>
  </div></dialog>`;
  const dialog = $('#sjf-video-viewer');
  dialog.addEventListener('cancel',event => { event.preventDefault(); closeVideoViewer(); });
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  paintVideoViewer();
  $('[data-act="video-close"]',dialog).focus();
  const shell = $('.sjf-video-viewer-shell',dialog);
  if (shell.requestFullscreen) {
    shell.requestFullscreen().then(() => {
      if (videoViewer && dialog.isConnected) videoViewer.wasFullscreen = true;
      else if (document.fullscreenElement === shell) document.exitFullscreen().catch(() => {});
    }).catch(() => { /* The viewport-filling dialog also works on browsers without fullscreen permission. */ });
  }
}
document.addEventListener('fullscreenchange',() => {
  if (videoViewer && document.fullscreenElement === $('.sjf-video-viewer-shell')) videoViewer.wasFullscreen = true;
  else if (videoViewer?.wasFullscreen) closeVideoViewer();
});

/* ---------------- UPDATES ---------------- */
function viewUpdates(){const ups=DB.data.updates,s=DB.data.settings;
 return `${pageHero('News &amp; Daily Updates','Field notes, announcements and everyday victories — fresh from the foundation.')}
 <section class="pb-24"><div class="wrap grid lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
  <div class="space-y-6">${ups.length?ups.map((u,i)=>`<div class="rv" style="--d:${i*70}ms">${updateCard(u)}</div>`).join(''):`<div class="card p-10 text-center">${crn()}<p class="ph">No updates yet — publish the first one from Admin &rarr; Updates.</p></div>`}</div>
  <div class="space-y-6 lg:sticky lg:top-28">
   <div class="card p-7 rv">${crn()}<h3 class="font-disp text-xl text-navy">${ic('mail','inline text-ver')} Get daily updates</h3>
    <p class="text-ink/65 text-sm mt-2">Save your newsletter interest in this browser demo.</p>
    <form data-form="f-news" class="mt-4 flex flex-col gap-3"><input type="email" name="email" required placeholder="you@email.com" aria-label="Email address"><button class="btn btn-navy btn-sm">${ic('sparkle')} Subscribe</button></form></div>
   <div class="card p-7 rv" style="--d:80ms">${crn()}<h3 class="font-disp text-xl text-navy">${ic('share' in ICONS?'share':'megaphone','inline text-ver')} Follow along</h3>
    <p class="text-ink/65 text-sm mt-2">Daily moments on social media.</p>
    <div class="flex gap-3 mt-4">${[['instaUrl',BRAND.ig,'Instagram'],['fbUrl',BRAND.fb,'Facebook'],['ytUrl',BRAND.yt,'YouTube']].map(b=>s[b[0]]?`<a href="${esc(s[b[0]])}" target="_blank" rel="noopener" class="w-11 h-11 rounded-xl grid place-items-center bg-navy text-cream hover:bg-ver transition" aria-label="${b[2]}">${b[1]}</a>`:`<button data-act="soc" class="w-11 h-11 rounded-xl grid place-items-center bg-navy text-cream hover:bg-ver transition" aria-label="${b[2]}">${b[1]}</button>`).join('')}</div></div>
   <div class="card p-7 g-navy text-cream !border-0 rv" style="--d:160ms"><div class="pat-dark rounded-2xl" aria-hidden="true"></div>
    <h3 class="font-disp text-xl relative">Moved by a story?</h3><p class="text-cream/75 text-sm mt-2 relative">Turn it into support for the next one.</p>
    <a href="#donate" class="btn btn-gold btn-sm mt-4 relative">${ic('heart')} Donate Now</a></div>
  </div></div></section>`;}

/* ---------------- DONATE ---------------- */
let donAmt=1000,donFreq='once';
function viewDonate(){const s=DB.data.settings;const amts=[500,1000,2500,5000];
 return `${pageHero('Donate','Turn your generosity into someone\u2019s better tomorrow.')}
 <section class="pb-24"><div class="wrap grid lg:grid-cols-[1.25fr_.75fr] gap-8 items-start">
  <form class="card p-7 md:p-9 rv" data-form="f-donate" novalidate>${crn()}
   <h2 class="font-disp text-2xl text-navy">${ic('heart','inline text-ver')} Make a Contribution</h2>
   <div class="mt-6 inline-flex bg-navy/5 rounded-full p-1.5 border-1.5 border-navy/10" role="group" aria-label="Frequency">
    <button type="button" class="freq px-5 py-2 rounded-full font-extrabold text-sm transition ${donFreq==='once'?'g-navy text-cream':'text-navy'}" data-act="freq" data-freq="once">Give Once</button>
    <button type="button" class="freq px-5 py-2 rounded-full font-extrabold text-sm transition ${donFreq==='monthly'?'g-navy text-cream':'text-navy'}" data-act="freq" data-freq="monthly">Monthly</button></div>
   <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
    ${amts.map(a=>`<button type="button" class="amt px-3 py-3.5 rounded-xl font-extrabold border-2 transition ${a===donAmt?'g-fire text-white border-transparent shadow-lg':'border-navy/15 text-navy hover:border-navy/40'}" data-act="amt" data-amt="${a}">₹${inr(a)}</button>`).join('')}</div>
   <div class="mt-3"><label class="lb" for="amt-custom">Or enter a custom amount (₹)</label><input id="amt-custom" type="number" min="10" step="1" placeholder="e.g. 750" inputmode="numeric"></div>
   <div class="grid sm:grid-cols-2 gap-4 mt-5">
    <div><label class="lb" for="d-name">Full Name *</label><input id="d-name" name="name" required autocomplete="name" placeholder="Your name"></div>
    <div><label class="lb" for="d-phone">Phone *</label><input id="d-phone" name="phone" required inputmode="tel" autocomplete="tel" placeholder="+91 ..."></div>
    <div><label class="lb" for="d-email">Email *</label><input id="d-email" name="email" type="email" required autocomplete="email" placeholder="you@email.com"></div>
    <div><label class="lb" for="d-purpose">Purpose</label><select id="d-purpose" name="purpose"><option>General Fund</option>${DB.data.initiatives.map(i=>`<option>${esc(i.title)}</option>`).join('')}</select></div></div>
   <div class="mt-4"><label class="lb" for="d-msg">Message (optional)</label><textarea id="d-msg" name="msg" rows="2" placeholder="A few words of encouragement..."></textarea></div>
   <label class="flex gap-3 items-center mt-4 text-sm text-ink/70"><input type="checkbox" name="anon">Make my donation anonymous</label>
   <button class="btn btn-fire w-full mt-6 !py-4 text-base" type="submit">${ic('lock')} Save Donation Interest</button>
   <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs text-ink/55">
    <span class="flex items-center gap-1.5">${ic('shield','w-4 h-4 text-teal')} Browser demo only</span>
    <span class="flex items-center gap-1.5">${ic('check','w-4 h-4 text-teal')} No payment is processed</span></div>
   ${!s.razorpayKey?`<p class="ph text-center text-sm mt-4">This demo records your interest in this browser only. No payment is taken and no email is sent.</p>`:''}
  </form>
  <div class="space-y-6">
   <div class="card p-7 rv" style="--d:100ms">${crn()}<h3 class="font-disp text-xl text-navy">Your gift at work</h3>
    <ul class="mt-4 space-y-3.5 text-[15px]">
     <li class="ph flex gap-3">${ic('book','text-ver w-5 h-5 flex-none mt-0.5')}[₹ — could fund a child's learning kit for a year]</li>
     <li class="ph flex gap-3">${ic('pulse','text-ver w-5 h-5 flex-none mt-0.5')}[₹ — could support a health camp for — families]</li>
     <li class="ph flex gap-3">${ic('leaf','text-ver w-5 h-5 flex-none mt-0.5')}[₹ — could plant and care for — saplings]</li></ul>
    <p class="text-xs text-ink/45 mt-4">Add real impact equivalents after internal costing — editable placeholder.</p></div>
   <div class="card p-7 rv" style="--d:180ms">${crn()}<h3 class="font-disp text-xl text-navy">Other ways to give</h3>
    <div class="mt-4 space-y-3 text-sm">
     <div class="flex items-center justify-between gap-3 bg-navy/5 rounded-xl px-4 py-3"><span class="font-bold text-navy">UPI</span><span class="flex items-center gap-2"><code class="ph">[your-upi@handle]</code><button type="button" class="text-ver font-extrabold" data-act="copy" data-copy="[your-upi@handle]">${ic('edit','w-4 h-4')}</button></span></div>
     <div class="bg-navy/5 rounded-xl px-4 py-3"><span class="font-bold text-navy block">Bank Transfer</span><span class="ph">[A/c name · A/c no. · IFSC]</span></div>
     <p class="ph text-xs">[Tax-exemption note, e.g., 80G eligibility — to be added]</p></div></div>
   <div class="card p-7 g-teal text-cream !border-0 rv" style="--d:260ms"><div class="pat-dark rounded-2xl" aria-hidden="true"></div>
    <div class="relative"><span class="w-12 h-12 inline-block">${fish('#168A45','#FFF8E7')}</span>
    <p class="font-disp text-xl mt-2">"Daan" — the joy of giving.</p>
    <p class="text-cream/80 text-sm mt-1">In our tradition, giving is not charity — it is gratitude in motion.</p></div></div>
  </div></div></section>`;}

/* ---------------- VOLUNTEER ---------------- */
function viewVolunteer(){const ins=DB.data.initiatives;
 return `${pageHero('Volunteer With Us','Give a few hours. Gain a family. Change many lives — including your own.')}
 <section class="pb-24"><div class="wrap grid lg:grid-cols-2 gap-10 items-start">
  <div class="rv"><div class="card !p-3 rotate-1 hover:rotate-0 transition-transform duration-500">${crn()}
    ${photoSlideshow('volunteer-slideshow','Volunteer photo slideshow')}</div>
   <div class="grid grid-cols-2 gap-4 mt-8">
    ${[['clock','Flexible commitments','Weekdays, weekends or remote — every hour counts.'],['users','Choose your cause','Pick the initiative that speaks to you.'],['sparkle','Learn &amp; grow','Grassroots skills no classroom teaches.'],['heart','A community','Of doers who quickly feel like family.']].map((v,i)=>`<div class="card p-5 rv" style="--d:${i*80}ms">${ic(v[0],'w-6 h-6 text-ver')}<b class="block text-navy mt-2">${v[1]}</b><span class="text-sm text-ink/60">${v[2]}</span></div>`).join('')}</div>
   <div class="card p-6 mt-6 bg-white/70">${crn()}<p class="ph">[Editable placeholder] Add volunteer policy details — recognition, certificates, safety guidelines and expectations here.</p></div></div>
  <form class="card p-7 md:p-9 rv" style="--d:120ms" data-form="f-vol" novalidate>${crn()}
   <h2 class="font-disp text-2xl text-navy">${ic('sparkle','inline text-ver')} Volunteer Registration</h2>
   <p class="text-ink/60 text-sm mt-1">Demo: your registration will be saved in this browser.</p>
   <div class="grid sm:grid-cols-2 gap-4 mt-6">
    <div><label class="lb" for="v-name">Full Name *</label><input id="v-name" name="name" required placeholder="Your name"></div>
    <div><label class="lb" for="v-phone">Phone *</label><input id="v-phone" name="phone" required inputmode="tel" placeholder="+91 ..."></div>
    <div><label class="lb" for="v-email">Email *</label><input id="v-email" name="email" type="email" name="email" required placeholder="you@email.com"></div>
    <div><label class="lb" for="v-city">City / District</label><input id="v-city" name="city" placeholder="e.g., Rosera"></div></div>
   <fieldset class="mt-5"><legend class="lb">Areas of interest</legend>
    <div class="grid sm:grid-cols-2 gap-2">${ins.map((x,i)=>`<label class="flex gap-2.5 items-center text-sm bg-navy/[.04] rounded-xl px-4 py-2.5 cursor-pointer hover:bg-navy/10 transition"><input type="checkbox" name="interest" value="${esc(x.title)}" ${i===0?'checked':''}>${esc(x.title)}</label>`).join('')}</div></fieldset>
   <div class="grid sm:grid-cols-2 gap-4 mt-5">
    <div><label class="lb" for="v-avail">Availability</label><select id="v-avail" name="avail"><option>Weekends</option><option>Weekdays</option><option>Evenings</option><option>Remote / Online</option><option>Whenever needed</option></select></div>
    <div><label class="lb" for="v-why">How did you hear about us?</label><select id="v-why" name="ref"><option>Social media</option><option>A friend</option><option>Event / drive</option><option>News</option><option>Other</option></select></div></div>
   <div class="mt-4"><label class="lb" for="v-msg">Why do you want to volunteer? (optional)</label><textarea id="v-msg" name="msg" rows="3" placeholder="Tell us a little about yourself..."></textarea></div>
   <button class="btn btn-fire w-full mt-6 !py-4" type="submit">${ic('sparkle')} Submit Registration</button>
   <p class="text-xs text-ink/45 text-center mt-3">Applications appear instantly in the Admin &rarr; Volunteers dashboard.</p>
  </form></div></section>`;}

function photoSlideshow(id,label) {
  const photos=DATA.defaults.photos.filter(p=>/^sjf-photo-[1-8]$/.test(p.id));
  return `<div id="${id}" data-photo-slideshow data-motion-static role="region" aria-label="${label}">
      <div class="volunteer-slides">${photos.map((p,i)=>`<img src="${p.src}" alt="${esc(p.caption)}" width="${p.width}" height="${p.height}" decoding="async" class="${i===0?'is-active':''}" aria-hidden="${i!==0}">`).join('')}</div>
      <div class="volunteer-slide-controls"><button type="button" data-slide="prev" aria-label="Previous photo">${ic('chevL')}</button><span data-slide-count>1 / 8</span><button type="button" data-slide="next" aria-label="Next photo">${ic('chevR')}</button><button type="button" data-slide="pause" aria-label="Pause slideshow" aria-pressed="false">Ⅱ</button></div>
    </div>`;
}
let photoSlideTimer;
function initPhotoSlideshow() {
  clearInterval(photoSlideTimer);
  const root = $('[data-photo-slideshow]');
  if (!root) return;
  const slides = $$('.volunteer-slides img', root), pause = $('[data-slide="pause"]', root);
  let index = 0, paused = motionPreference.matches;
  const syncPause = () => {
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', window.SJFLocale?.translate(paused ? 'Play slideshow' : 'Pause slideshow') || (paused ? 'Play slideshow' : 'Pause slideshow'));
  };
  const step = direction => {
    index = (index + direction + slides.length) % slides.length;
    slides.forEach((img,i) => { img.classList.toggle('is-active',i===index); img.setAttribute('aria-hidden',String(i!==index)); });
    $('[data-slide-count]',root).textContent = `${index + 1} / ${slides.length}`;
  };
  root.addEventListener('click', event => {
    const action = event.target.closest('[data-slide]')?.dataset.slide;
    if (action === 'pause') { paused = !paused; syncPause(); }
    else if (action) step(action === 'next' ? 1 : -1);
  });
  syncPause();
  photoSlideTimer = setInterval(() => {
    if (!paused && !document.hidden && !root.matches(':hover,:focus-within')) step(1);
  }, 4500);
}
window.addEventListener('pagehide', () => clearInterval(photoSlideTimer));

/* ---------------- CONTACT ---------------- */
function viewContact(){const s=DB.data.settings;
 const address=(s.address&&s.address.trim())?s.address.trim():'Rosera, Bihar, India';
 const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address);
 const info=[['pin','Visit Us',esc(address)],['mail','Write To Us',s.email?`<a class="text-navy hover:text-ver" href="mailto:${esc(s.email)}">${esc(s.email)}</a>`:'<span class="ph">[email@example.com]</span>'],['phone','Call Us',s.phone?`<a class="text-navy hover:text-ver" href="tel:${esc(s.phone)}">${esc(s.phone)}</a>`:'<span class="ph">[+91 — — — —]</span>'],['clock','Office Hours',s.hours?esc(s.hours):'<span class="ph">[Mon–Sat, 10:00 AM – 6:00 PM]</span>']];
 return `${pageHero('Contact Us','Questions, ideas, collaborations — we would love to hear from you.')}
 <section class="pb-24"><div class="wrap grid lg:grid-cols-2 gap-10 items-start">
  <form class="card p-7 md:p-9 rv" data-form="f-contact" novalidate>${crn()}
   <h2 class="font-disp text-2xl text-navy">${ic('mail','inline text-ver')} Send a Message</h2>
   <div class="grid sm:grid-cols-2 gap-4 mt-6">
    <div><label class="lb" for="c-name">Name *</label><input id="c-name" name="name" required placeholder="Your name"></div>
    <div><label class="lb" for="c-email">Email *</label><input id="c-email" name="email" type="email" name="email" required placeholder="you@email.com"></div></div>
   <div class="mt-4"><label class="lb" for="c-sub">Subject</label><input id="c-sub" name="subject" placeholder="What is this about?"></div>
   <div class="mt-4"><label class="lb" for="c-msg">Message *</label><textarea id="c-msg" name="msg" rows="4" required placeholder="Write your message..."></textarea></div>
   <button class="btn btn-navy mt-6" type="submit">${ic('arrowR')} Send Message</button></form>
  <div class="space-y-5">
   <div class="grid sm:grid-cols-2 gap-5">${info.map((x,i)=>`<div class="card p-6 rv" style="--d:${i*70}ms">${ic(x[0],'w-6 h-6 text-ver')}<h3 class="font-extrabold text-navy mt-2">${x[1]}</h3><p class="text-ink/65 text-sm mt-1">${x[2]}</p></div>`).join('')}</div>
   <div class="card p-2 rv" style="--d:200ms">${crn()}
    <div class="rounded-xl overflow-hidden relative h-64 grid place-items-center" style="background:linear-gradient(135deg,#0E3262,#164B8C)">
     <div class="pat-dark" aria-hidden="true"></div>
     <div class="absolute left-6 top-6 w-16 opacity-60" aria-hidden="true">${fish('#168A45','#0E3262')}</div>
     <div class="absolute right-8 bottom-8 w-20 opacity-50" style="transform:scaleX(-1)" aria-hidden="true">${fish()}</div>
     <div class="relative text-center text-cream">${foundationLogo(56)}<p class="font-disp text-xl mt-2">Rosera, Bihar, India</p><a class="btn btn-lite btn-sm mt-3" href="${esc(mapUrl)}" target="_blank" rel="noopener">Open in Google Maps</a></div></div></div>
   <div class="card p-6 rv" style="--d:260ms">${crn()}<h3 class="font-extrabold text-navy">Follow the foundation</h3>
    <div class="flex gap-3 mt-3">${[['instaUrl',BRAND.ig,'Instagram'],['fbUrl',BRAND.fb,'Facebook'],['ytUrl',BRAND.yt,'YouTube']].map(b=>s[b[0]]?`<a href="${esc(s[b[0]])}" target="_blank" rel="noopener" class="w-11 h-11 rounded-xl grid place-items-center bg-navy text-cream hover:bg-ver transition" aria-label="${b[2]}">${b[1]}</a>`:`<button data-act="soc" class="w-11 h-11 rounded-xl grid place-items-center bg-navy text-cream hover:bg-ver transition" aria-label="${b[2]}">${b[1]}</button>`).join('')}</div></div>
  </div></div></section>`;}


function openLB(scope,i){LB.items=(scope==='home'?DB.data.gallery:(gfilter==='All'?DB.data.gallery:DB.data.gallery.filter(g=>g.cat===gfilter)));LB.i=+i;paintLB();}
function paintLB(){const g=LB.items[LB.i];if(!g)return closeModal();
 openModal(`<div class="relative max-w-4xl mx-auto">
  <img src="${esc(g.src)}" alt="${esc(g.title)}" class="w-full max-h-[76vh] object-contain rounded-2xl border-4 border-cream/25 shadow-2xl">
  <div class="flex items-center justify-between text-cream mt-4 gap-3">
   <button class="w-11 h-11 rounded-full grid place-items-center bg-cream/10 hover:bg-cream/25 transition" data-act="lb-prev" aria-label="Previous">${ic('chevL','w-5 h-5')}</button>
   <p class="text-sm font-bold">${esc(g.cat)} · <span class="opacity-60">${esc(g.title)}</span> · ${LB.i+1}/${LB.items.length}</p>
   <button class="w-11 h-11 rounded-full grid place-items-center bg-cream/10 hover:bg-cream/25 transition" data-act="lb-next" aria-label="Next">${ic('chevR','w-5 h-5')}</button></div>
  <button class="absolute -top-3 -right-3 w-11 h-11 rounded-full g-fire text-white grid place-items-center shadow-lg" data-act="modal-x" aria-label="Close">${ic('x','w-5 h-5')}</button></div>`,'lb-bg');}


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
  if (/^assets\/images\/[a-z0-9_-]+\.(?:jpe?g|png|webp)$/i.test(value || '')) return value;
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
        title:p.src ? p.caption : 'Sample photo — replace via Admin',cat:p.cat || 'Community',up:!!p.src,width:Number(p.width)||0,height:Number(p.height)||0};
    }),
    videos:DATA.read('videos').map(window.SJFMedia.normalize).filter(Boolean),
    updates:DATA.read('updates').map(u => ({...u,tag:u.cat,sample:!u.date}))
  };
}};

const ANNOUNCEMENTS = ['◆ Empowering Bihar — Preserving Innocence.','◆ Together we nurture roots and reach skies.','◆ Join us with a donation of Rs. 11/- only.'];
let paused = false;
function announcement() {
  const group = '<div class="announcement-group">' + ANNOUNCEMENTS.map(t => '<span>' + t + '</span>').join('') + '</div>';
  return '<div class="section-announcement"><div class="announcement-window" aria-hidden="true"><div class="announcement-track">' + group + group + '</div></div><button type="button" class="announcement-toggle" aria-label="' + (paused ? 'Play' : 'Pause') + ' announcements" aria-pressed="' + paused + '">' + (paused ? '▶' : 'Ⅱ') + '</button></div>';
}

// A single opening sketch, paused while the language picker or loader covers it.
let heroSketchPlayed = false;
function initHeroSketch() {
  const hero = $('#publicHero');
  if (!hero || heroSketchPlayed || motionPreference.matches) return;
  const targets = $$('.hero-kids-frame,.sjf-home-hero-copy > .rv:not(h1):not([data-home-copy]),.sjf-hero-scrapbook,.chip,.hero-fish-track > svg', hero);
  hero.classList.add('sjf-hero-sketch');
  targets.forEach((el,i) => {
    el.classList.add('sjf-sketch-part');
    el.style.setProperty('--sketch-delay', Math.min(i * 70, 630) + 'ms');
  });
  const circle = $('.sjf-home-hero-circle', hero);
  circle.insertAdjacentHTML('beforeend','<svg class="sjf-pencil-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" pathLength="100"/></svg>');
  hero.addEventListener('animationend', event => {
    if (event.animationName !== 'sjf-hero-sketch' || event.target !== targets.at(-1)) return;
    heroSketchPlayed = true;
    hero.classList.remove('sjf-hero-sketch');
    $('.sjf-pencil-ring', hero)?.remove();
  });
}

let revealObserver;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  $$('.rv').forEach(el => el.classList.add('in'));
  const enabled = 'IntersectionObserver' in window && !motionPreference.matches;
  document.body.classList.toggle('sjf-scroll-motion', enabled);
  if (!enabled) return;

  // Observe content-sized targets, never entire sections or forms: a tall section
  // must not hide its children while a visitor reads, types or watches a video.
  const content = selector => $$(`:is(#main, #app > footer) :is(${selector})`).filter(el => !el.closest('[data-motion-static], [aria-hidden="true"], .section-announcement'));
  const mark = (el, effect) => {
    el.classList.add('sjf-reveal');
    el.dataset.scrollEffect = effect;
  };
  content('h1,h2,h3,h4').forEach(heading => {
    mark(heading, 'ink');
    // Keep live hero copy and gradient spans intact when admin changes the heading.
    if (heading.dataset.motionWords || heading.querySelector('[data-home-copy]')) return;
    heading.dataset.motionWords = 'true';
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { fragment.appendChild(document.createTextNode(word)); return; }
        const span = document.createElement('span');
        span.className = 'sjf-reveal-word';
        span.style.setProperty('--word-delay', Math.min(index++ * 35, 245) + 'ms');
        span.textContent = word;
        fragment.appendChild(span);
      });
      node.replaceWith(fragment);
    });
  });
  content('p,blockquote').forEach(el => mark(el, 'brush'));
  content('.card:not(form),article:not(.card),.sjf-story-footer-card').forEach(el => {
    if (!el.querySelector('form') && !el.parentElement.closest('.card,article')) mark(el, 'rise');
  });
  content('img:not(.sjf-logo):not(.sjf-hero-logo),.hero-kids-frame').forEach((el,index) => {
    if (el.tagName === 'IMG' && el.closest('.hero-kids-frame')) return;
    // Keep native video controls uncovered; animate their surrounding image frame.
    mark(el, el.classList.contains('hero-kids-frame') || index % 3 === 0 ? 'ripple' : 'sketch');
  });
  content('.eyebrow,.badge,.sjf-story-badge').forEach(el => mark(el, 'breathe'));
  content('a,button,li,dt,dd,label,input,textarea,select,[data-count]').forEach(el => {
    if (el.matches('input[type="hidden"]') || el.closest('h1,h2,h3,h4,p,li') !== (el.matches('li') ? el : null)) return;
    if (!el.classList.contains('sjf-reveal') && !el.querySelector('.sjf-reveal')) mark(el, 'rise');
  });
  content('.rv').forEach(el => {
    if (!el.matches('form') && !el.classList.contains('sjf-reveal') && !el.querySelector('.sjf-reveal,form,video,input')) mark(el, 'rise');
  });
  // Hero text repeats its ink reveal independently of the one-time media sketch.
  const heroText = $$('#publicHero h1,#publicHero [data-home-copy="heroDescription"],#publicHero .sjf-hero-slogans dt,#publicHero .sjf-hero-slogans dd');
  heroText.forEach((el,i) => {
    mark(el, 'hero-ink');
    el.style.setProperty('--ink-delay', Math.min(i * 60, 240) + 'ms');
  });
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const el = entry.target;
    if (el.contains(document.activeElement)) return;
    const visible = entry.isIntersecting;
    el.classList.toggle('sjf-exit-top', !visible && entry.boundingClientRect.top < 0);
    el.classList.toggle('sjf-revealed', visible);
  }), {threshold:0, rootMargin:'0px 0px -24px 0px'});
  [...content('.sjf-reveal'), ...heroText].forEach(el => revealObserver.observe(el));
}
motionPreference.addEventListener?.('change', initReveal);
document.addEventListener('focusin', event => {
  event.target.closest?.('.sjf-reveal')?.classList.add('sjf-revealed');
});
function initCounters() {
  $$('[data-count]').forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
}
function initFishCursor() {
  if (!matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches || $('#sjf-fish-cursor')) return;
  const cursor=document.createElement('div'), trails=[0,1,2].map(()=>document.createElement('i'));
  cursor.id='sjf-fish-cursor'; cursor.className='sjf-fish-cursor'; cursor.innerHTML=fish('#F15A24');
  trails.forEach((t,i)=>{t.className='sjf-fish-trail sjf-fish-trail-'+i;document.body.appendChild(t);}); document.body.appendChild(cursor);
  document.body.classList.add('sjf-fish-cursor-active');
  let pointer={x:innerWidth/2,y:innerHeight/2}, last=null, angle=0, targetAngle=0, active=false;
  const dots=trails.map(()=>({x:pointer.x,y:pointer.y}));
  let frame=0;
  const paint=()=>{
    frame=0;
    if (!active) return;
    // Take the shortest turn across the 0/360 boundary; the artwork faces left.
    const turn=((targetAngle-angle)%360+540)%360-180;
    angle+=Math.abs(turn)<.1?turn:turn*.22;
    cursor.style.transform=`translate(${pointer.x}px,${pointer.y}px) translate(-50%,-50%) rotate(${angle}deg)`;
    let moving=Math.abs(turn)>.1;
    dots.forEach((dot,i)=>{const target=i?dots[i-1]:pointer; dot.x+=(target.x-dot.x)*(.2-i*.035);dot.y+=(target.y-dot.y)*(.2-i*.035);trails[i].style.transform=`translate(${dot.x-6}px,${dot.y-6}px)`;trails[i].style.opacity=String(.75-i*.2);if(Math.hypot(target.x-dot.x,target.y-dot.y)>.2)moving=true;});
    if(moving)frame=requestAnimationFrame(paint);
  };
  addEventListener('pointermove',e=>{
    pointer.x=e.clientX;pointer.y=e.clientY;
    if(last){
      const dx=pointer.x-last.x,dy=pointer.y-last.y;
      if(Math.hypot(dx,dy)>=2){targetAngle=Math.atan2(dy,dx)*180/Math.PI+180;last={...pointer};}
    }else{last={...pointer};dots.forEach(dot=>Object.assign(dot,pointer));}
    active=true;cursor.style.opacity='1';
    if(!frame)frame=requestAnimationFrame(paint);
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{
    active=false;last=null;cancelAnimationFrame(frame);frame=0;
    cursor.style.opacity='0';trails.forEach(t=>t.style.opacity='0');
  });
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
function sectionName() { const n = location.hash.replace(/^#\/?/,'').split('?')[0] || currentPage(); return n === 'updates' ? 'news' : n; }
function navigate(name) {
  if (name === 'admin') { location.assign('admin.html'); return; }
  if (!(name in PUBLIC_VIEWS)) name = 'home';
  if (name !== currentPage()) { location.assign(routeHref(name)); return; }
  closeMenu();
  document.documentElement.style.setProperty('--public-header-height', $('#site-head').offsetHeight + 'px');
  activeNav(name);
}
function applyHeroCopy() {
  const s = window.SJFHero.resolve(window.SJFHero.read());
  $$('#publicHero [data-home-copy]').forEach(el => { el.textContent = s[el.dataset.homeCopy]; });
  playHeroVideo();
}
function playHeroVideo() {
  const video = $('#publicHero .hero-kids-frame video');
  if (!video || document.hidden) return;
  if (!video.dataset.loopReady) {
    video.dataset.loopReady = 'true';
    video.addEventListener('canplay', playHeroVideo);
    video.addEventListener('pause', () => {
      if (video.isConnected && !document.hidden && !video.error) playHeroVideo();
    });
  }
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  const playback = video.play();
  if (playback && playback.catch) playback.catch(() => {});
}
document.addEventListener('visibilitychange', playHeroVideo);
document.addEventListener('pointerdown', playHeroVideo);
document.addEventListener('keydown', playHeroVideo);
function refreshHero() {
  const slot = $('#publicHeroSlot');
  if (!slot) return;
  slot.innerHTML = heroSection();
  applyHeroCopy();
  // Reveal only the replaced hero; every other section keeps its current DOM and form state.
  window.SJFLocale?.apply(slot);
  initReveal();
}
function render() {
  DB.load();
  if (!DB.data.gallery.some(g => g.cat === gfilter)) gfilter = 'All';
  const name = currentPage() in PUBLIC_VIEWS ? currentPage() : 'home';
  $('#app').innerHTML = header() + '<main id="main"><section class="site-section" id="'+name+'" tabindex="-1">'+announcement()+PUBLIC_VIEWS[name]()+'</section></main>' + footer();
  $$('a[href^="#"]').forEach(anchor => {
    let route = anchor.getAttribute('href').replace(/^#\/?/, '');
    if (route === 'updates') route = 'news';
    if (route in PUBLIC_VIEWS) anchor.setAttribute('href', routeHref(route));
  });
  applyHeroCopy();
  // Every submission stays local in the requested demo.
  const storyFrame = $('#homeFeaturedVideo .vframe');
  const story = storyFrame && DB.data.videos.find(video => video.id === storyFrame.dataset.id);
  if (story) window.SJFMedia.mount(storyFrame, story, {muted:true, loop:true, background:true});
  $$('form[data-form]').forEach(form => {
    const note = document.createElement('p'); note.className = 'demo-form-note'; note.textContent = 'Demo: saved in this browser only.'; form.appendChild(note);
  });
  initCounters(); window.SJFLocale?.apply($('#app')); initReveal(); initHeroSketch(); initPhotoSlideshow();
  document.documentElement.style.setProperty('--public-header-height', $('#site-head').offsetHeight + 'px');
  activeNav(name);
}
function saveRecord(key, record) {
  const list = DATA.read(key); list.unshift(record);
  if (!DATA.write(key,list)) { toast('Browser storage is full. Export a backup in Admin before removing data.','warn'); return false; }
  return true;
}

document.addEventListener('click', e => {
  const pause = e.target.closest('.announcement-toggle');
  if (pause) {
    paused = !paused; document.body.classList.toggle('announcements-paused',paused);
    $$('.announcement-toggle').forEach(b => { b.setAttribute('aria-pressed',String(paused)); b.setAttribute('aria-label',(paused ? 'Play' : 'Pause')+' announcements'); b.textContent = paused ? '▶' : 'Ⅱ'; });
  }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  switch (act) {
    case 'language': window.SJFLocale?.openPicker(); break;
    case 'nav-toggle': { const open = $('#mnav').classList.toggle('open'); el.setAttribute('aria-expanded',String(open)); break; }
    case 'modal-x': closeModal(); break;
    case 'lb': openLB(el.dataset.scope,el.dataset.idx); break;
    case 'lb-prev': LB.i = (LB.i-1+LB.items.length)%LB.items.length; paintLB(); break;
    case 'lb-next': LB.i = (LB.i+1)%LB.items.length; paintLB(); break;
    case 'gfil': {
      gfilter = el.dataset.cat; const grid = $('#g-grid'); if (grid) { grid.parentElement.innerHTML = galleryGrid(); initReveal(); } break;
    }
    case 'play-video': {
      if (el.closest('[data-social-feed]')) { openVideoViewer(el.dataset.id,el,socialVideos()); break; }
      if (el.closest('#videos')) { openVideoViewer(el.dataset.id,el); break; }
      const v = DB.data.videos.find(v => v.id === el.dataset.id), frame = el.closest('.vframe') || $('#homeFeaturedVideo .vframe');
      if (v && frame) {
        if (frame.closest('#homeFeaturedVideo')) $('#homeVideoTitle').textContent = v.title;
        window.SJFMedia.mount(frame,v,{loop:Boolean(frame.closest('#homeFeaturedVideo'))});
      }
      break;
    }
    case 'video-prev': stepVideoViewer(-1); break;
    case 'video-next': stepVideoViewer(1); break;
    case 'video-close': closeVideoViewer(); break;
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
  if (videoViewer) {
    if (e.key === 'Escape') { e.preventDefault(); closeVideoViewer(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); stepVideoViewer(e.key === 'ArrowLeft' ? -1 : 1);
    }
    return;
  }
  if (e.key === 'Escape') { closeModal(); closeMenu(); }
  if ($('#modal-root .lb-bg') && LB.items.length) {
    if (e.key === 'ArrowLeft') { LB.i = (LB.i-1+LB.items.length)%LB.items.length; paintLB(); }
    if (e.key === 'ArrowRight') { LB.i = (LB.i+1)%LB.items.length; paintLB(); }
  }
});
window.addEventListener('hashchange',() => {
  const name = sectionName();
  if (name in PUBLIC_VIEWS && name !== currentPage()) location.replace(routeHref(name));
});
window.addEventListener('storage',e => {
  if (e.key === 'sjf_language') return;
  if (e.key === 'sjf_hero') { refreshHero(); return; }
  if (e.key === 'sjf_admin_credentials') return;
  if (!e.key || e.key.startsWith('sjf_')) render();
});
window.addEventListener('pageshow',e => { if (e.persisted) render(); });
let scrollFrame = false;
window.addEventListener('scroll',() => {
  if (scrollFrame) return; scrollFrame = true;
  requestAnimationFrame(() => {
    scrollFrame = false;
    const y = Math.max(0, scrollY), header = $('#site-head');
    header.classList.toggle('scrolled', y > 30);
    activeNav(currentPage());
  });
},{passive:true});
window.addEventListener('resize',() => document.documentElement.style.setProperty('--public-header-height',$('#site-head').offsetHeight+'px'));
window.addEventListener('sjf:languagechange',() => {
  // Preserve in-progress forms while rendering the selected language.
  const fields = $$('form input, form textarea, form select').map(el => ({id:el.id,name:el.name,form:el.closest('form').dataset.form,value:el.value,checked:el.checked}));
  const scrollPosition = scrollY;
  if (videoViewer) closeVideoViewer();
  render();
  $$('form input, form textarea, form select').forEach(el => {
    const saved = fields.find(field => el.id ? field.id === el.id : field.name === el.name && field.form === el.closest('form').dataset.form && (el.type !== 'checkbox' || field.value === el.value));
    if (saved) { el.value=saved.value; if ('checked' in el) el.checked=saved.checked; }
  });
  window.scrollTo(0,scrollPosition);
});
render();
window.SJFLocale?.init();
initFishCursor();
requestAnimationFrame(() => {
  const legacyRoute = sectionName();
  if (location.hash && legacyRoute in PUBLIC_VIEWS && legacyRoute !== currentPage()) location.replace(routeHref(legacyRoute));
  else navigate(currentPage());
});

})();
