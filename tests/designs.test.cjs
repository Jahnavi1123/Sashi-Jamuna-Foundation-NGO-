const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const root = path.resolve(__dirname, '..');
let checks = 0;
const pages = [];
const check = (condition, message) => { assert.ok(condition, message); checks++; };
const tick = () => new Promise(resolve => setTimeout(resolve, 30));

async function page(file, saved = {}, hash = '') {
  const errors = [], virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root,file),'utf8'), {
    url:'http://127.0.0.1:8000/'+file+hash,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole
  });
  pages.push(dom);
  const w = dom.window, d = w.document;
  Object.defineProperty(w,'crypto',{value:webcrypto});
  w.TextEncoder = TextEncoder;
  w.matchMedia = () => ({matches:false});
  w.HTMLElement.prototype.scrollIntoView = function () { w.lastScroll = this.id; };
  w.scrollTo = () => {};
  w.requestAnimationFrame = callback => { callback(w.performance.now()); return 1; };
  w.cancelAnimationFrame = () => {};
  w.confirm = () => false;
  w.addEventListener('error', e => errors.push(e.error?.stack || e.message));
  Object.entries(saved).forEach(([key,value]) => w.localStorage.setItem(key,value));
  await new Promise(resolve => d.addEventListener('DOMContentLoaded',resolve,{once:true}));
  for (const script of d.querySelectorAll('script[src^="assets/"]')) {
    w.eval(fs.readFileSync(path.join(root,script.getAttribute('src')),'utf8'));
  }
  await tick();
  check(errors.length === 0, file+' initializes without errors: '+errors.join('\n'));
  return {w,d,errors};
}
const storage = w => Object.fromEntries(Object.keys(w.localStorage).map(k => [k,w.localStorage.getItem(k)]));
function val(d, selector, value) { assert.ok(d.querySelector(selector), selector); d.querySelector(selector).value=value; }
function click(d, selector) { assert.ok(d.querySelector(selector),selector); d.querySelector(selector).click(); }
async function submit(w, selector) {
  const form=w.document.querySelector(selector); assert.ok(form,selector);
  const button=form.querySelector('button[type="submit"]');
  form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  await Promise.resolve();
  const deadline=Date.now()+5000;
  while (button?.disabled && Date.now()<deadline) await tick();
  assert.ok(!button?.disabled,'Form operation completes: '+selector);
}
function uniqueIDs(d) { const ids=[...d.querySelectorAll('[id]')].map(e=>e.id); check(new Set(ids).size===ids.length,'Unique IDs: '+ids.filter((id,i)=>ids.indexOf(id)!==i).join(',')); }
function sync(source, target) {
  Object.entries(storage(source)).forEach(([key,value]) => target.localStorage.setItem(key,value));
  target.dispatchEvent(new target.StorageEvent('storage',{key:'sjf_settings'}));
}

(async () => {
  const pub = await page('3.html'), {w,d} = pub;
  check(d.querySelector('#publicHero h1').textContent.includes('Rooted in Culture'),'Public site uses the original 1.html headline');
  check(d.querySelector('#publicHero .grad-teal').textContent === 'Hope','Public site preserves original accent text');
  check(d.querySelector('#publicHero svg'),'Public hero has original Madhubani illustration');
  check(d.querySelector('link[href="assets/public.css"]'),'Public site loads original visual design styles');
  check(d.querySelectorAll('.site-section').length === 9,'Nine public sections on one page');
  check([...d.querySelectorAll('.site-section')].every(e=>!e.classList.contains('hidden')),'All public sections visible together');
  check(d.querySelectorAll('.section-announcement').length === 9,'Blue announcement strip above each public section');
  check(d.querySelectorAll('h1').length===1,'Single public h1');
  check(d.querySelectorAll('footer').length===1,'Single original footer');
  check(d.querySelector('footer').textContent.includes('Alpha Avics Digital Solutions'),'Original footer credit preserved');
  check(d.querySelector('footer a[href="admin.html"]'),'Footer opens the separate admin portal');
  uniqueIDs(d);
  click(d,'.announcement-toggle');
  check(d.body.classList.contains('announcements-paused'),'Announcement pause works');
  click(d,'[data-act="nav-toggle"]');
  check(d.querySelector('#mnav').classList.contains('open'),'Mobile menu opens');
  click(d,'a[href="#about"]');
  check(w.lastScroll==='about','Anchor scrolls to About');
  check(!d.querySelector('#mnav').classList.contains('open'),'Section navigation closes mobile menu');
  check(d.querySelectorAll('.site-section').length===9,'Navigation preserves continuous page');
  w.location.hash='#/gallery'; await tick();
  check(w.lastScroll==='gallery','Legacy deep link works');
  click(d,'[data-act="gfil"][data-cat="education"]');
  check([...d.querySelectorAll('#g-grid .g-item')].every(e=>e.textContent.includes('education')),'Gallery filter works');
  click(d,'#g-grid .g-item');
  check(d.querySelector('#modal-root .lb-bg'),'Gallery lightbox opens');
  click(d,'#modal-root [data-act="modal-x"]');
  check(!d.querySelector('#modal-root').innerHTML,'Gallery lightbox closes');

  val(d,'#c-name','Test Person'); val(d,'#c-email','visitor@example.com'); val(d,'#c-msg','A test message <script>alert(1)</script>');
  await submit(w,'[data-form="f-contact"]');
  check(JSON.parse(w.localStorage.getItem('sjf_messages')).length===1,'Public contact submission uses shared inbox');
  val(d,'footer input[type=email]','reader@example.com'); await submit(w,'footer [data-form="f-news"]');
  check(JSON.parse(w.localStorage.getItem('sjf_subscribers'))[0].email==='reader@example.com','Footer newsletter stores real email');
  val(d,'#v-name','Test Volunteer'); val(d,'#v-email','volunteer@example.com'); val(d,'#v-phone','0000000000'); await submit(w,'[data-form="f-vol"]');
  check(JSON.parse(w.localStorage.getItem('sjf_volunteers')).length===1,'Volunteer submission shares admin storage');
  val(d,'#d-name','Test Donor'); val(d,'#d-email','donor@example.com'); val(d,'#d-phone','0000000000'); await submit(w,'[data-form="f-donate"]');
  const donations=JSON.parse(w.localStorage.getItem('sjf_donations'));
  check(donations.length===1 && donations[0].status==='pending','Donation saves interest only');

  const adm=await page('admin.html',storage(w)), ad=adm.d, aw=adm.w;
  check(ad.querySelector('link[href="assets/site.css"]'),'Admin keeps existing blue styles');
  check(!ad.querySelector('#adminLogin').classList.contains('hidden'),'Admin entry opens login directly');
  check(!ad.querySelector('#adminLogin').textContent.includes('sjf@admin'),'Password is not displayed on login page');
  check(!ad.querySelector('#adminLogin').textContent.includes('Demo credentials'),'Credentials helper line removed');
  check(ad.querySelector('#adminUser').value==='','Login username is not prefilled');
  check([...ad.querySelectorAll('.page:not(#admin)')].every(e=>e.classList.contains('hidden')),'Old public layout stays hidden inside admin');
  val(ad,'#adminUser','admin'); val(ad,'#adminPass','wrong'); await submit(aw,'#adminLoginForm');
  check(ad.querySelector('#adminPanel').classList.contains('hidden'),'Wrong demo credentials rejected');
  val(ad,'#adminPass','sjf@admin'); await submit(aw,'#adminLoginForm');
  check(!ad.querySelector('#adminPanel').classList.contains('hidden'),'Demo admin login works');
  check(ad.querySelector('#adminHero').classList.contains('bg-deep'),'Admin home preserves dark blue hero');
  check(ad.querySelector('#adminHero h2').textContent.includes('Empowering'),'Admin preserves previous website hero');
  check(ad.querySelectorAll('#adminHero [data-art]').length===4,'Admin preserves the four-piece art collage');
  uniqueIDs(ad);
  click(ad,'[data-tab="inbox"]');
  check(ad.querySelector('#adminContent').textContent.includes('visitor@example.com'),'Public enquiry appears in admin inbox');
  check(ad.querySelector('#adminContent').textContent.includes('reader@example.com'),'Public newsletter interest appears in admin inbox');
  check(!ad.querySelector('#adminContent script'),'Inbox escapes user content');
  click(ad,'[data-tab="volunteers"]');
  check(ad.querySelector('#adminContent').textContent.includes('Test Volunteer'),'Public volunteer appears in admin');
  click(ad,'[data-tab="donations"]');
  check(ad.querySelector('#adminContent').textContent.includes('Test Donor'),'Public donation interest appears in admin');

  click(ad,'[data-tab="home-editor"]');
  val(ad,'#edit-heroLead1','Together'); val(ad,'#edit-heroAccent1','We Grow');
  await submit(aw,'#homeEditorForm');
  click(ad,'[data-tab="impact"]'); val(ad,'#impact-0','12'); await submit(aw,'#impactSettingsForm');
  click(ad,'[data-tab="settings"]');
  val(ad,'#setAddress','Demo office'); val(ad,'#setEmail','test@example.com'); val(ad,'#setIg','@demo-foundation'); await submit(aw,'#settingsForm');
  click(ad,'[data-tab="photos"]');
  val(ad,'#photoUrl','https://example.com/photo.jpg'); val(ad,'#photoCaption','New photo'); await submit(aw,'#photoForm');
  click(ad,'[data-tab="updates"]');
  val(ad,'#upTitle','A new field report'); val(ad,'#upBody','Test-only update'); await submit(aw,'#updateForm');
  click(ad,'[data-tab="videos"]');
  val(ad,'#vidTitle','A demo video'); val(ad,'#vidYoutube','https://youtu.be/abcdefghijk'); await submit(aw,'#videoForm');
  click(ad,'[data-tab="initiatives"]');
  val(ad,'#iniTitle','Test initiative'); val(ad,'#iniDesc','A test description'); await submit(aw,'#initForm');
  sync(aw,w);
  check(d.querySelector('#publicHero h1').textContent.includes('Together We Grow'),'Admin home edits update new public design');
  check(d.querySelector('[data-count="12"]'),'Admin impact figures update public design');
  check(d.querySelector('footer').textContent.includes('Demo office'),'Admin footer settings update public site');
  check(d.querySelector('footer a[href="mailto:test@example.com"]'),'Admin email updates public footer');
  check(d.querySelector('footer a[aria-label="Instagram"]').href==='https://www.instagram.com/demo-foundation','Admin social setting updates public site');
  check(d.querySelector('img[src="https://example.com/photo.jpg"]'),'Admin photo appears in public gallery');
  check(d.querySelector('#news').textContent.includes('A new field report'),'Admin update appears in public news');
  check(d.querySelector('#videos').textContent.includes('A demo video'),'Admin video appears in public videos');
  check(d.querySelector('#initiatives').textContent.includes('Test initiative'),'Admin initiative appears in public section');
  check(d.querySelector('footer').textContent.includes('Test initiative'),'Public footer work list follows admin content');
  check(d.querySelector('#publicHero .grad-fire'),'Public keeps original typography/accent hooks after edit');
  uniqueIDs(d);
  const fresh=await page('3.html',storage(aw),'#contact');
  check(fresh.d.querySelector('#publicHero h1').textContent.includes('Together We Grow'),'Content persists after reload');
  check(fresh.w.lastScroll==='contact','Deep links work on initial load');

  // A hero-only save must preserve every other rendered node, form draft and storage key.
  const outsideHero = document => { const app=document.querySelector('#app').cloneNode(true); app.querySelector('#publicHeroSlot').replaceChildren(); return app.innerHTML; };
  const publicBefore=outsideHero(d), aboutBefore=d.querySelector('#about'), footerBefore=d.querySelector('footer');
  const adminHeroBefore=ad.querySelector('#homeHero').innerHTML;
  val(d,'#c-msg','Unsent message that must survive a hero change');
  const otherData=Object.fromEntries(Object.entries(storage(aw)).filter(([key])=>key!=='sjf_hero'));
  click(ad,'[data-tab="home-editor"]');
  check(!ad.querySelector('#homeEditorForm [name="impact0"]'),'Hero form cannot edit impact figures');
  click(ad,'input[name="heroLayout"][value="blue"]');
  check(ad.querySelector('#edit-heroLead1').placeholder==='Empowering','Layout selection shows matching default copy');
  check(d.querySelector('#publicHero .grad-fire'),'Unsaved choice does not change public hero');
  await submit(aw,'#homeEditorForm');
  w.localStorage.setItem('sjf_hero',aw.localStorage.getItem('sjf_hero'));
  w.dispatchEvent(new w.StorageEvent('storage',{key:'sjf_hero'}));
  check(d.querySelector('#publicHero.sjf-blue-hero'),'Blue option installs the admin-style public hero');
  check(d.querySelectorAll('#publicHero .sbh-art').length===4,'Blue option contains all four original artwork tiles');
  check(d.querySelector('#publicHero h1').textContent.includes('Together We Grow'),'Custom hero text remains editable in blue layout');
  check(outsideHero(d)===publicBefore,'Hero switch leaves all non-hero HTML identical');
  check(d.querySelector('#about')===aboutBefore && d.querySelector('footer')===footerBefore,'Hero switch preserves other DOM nodes');
  check(d.querySelector('#c-msg').value==='Unsent message that must survive a hero change','Hero switch preserves unsent form draft');
  check(Object.entries(otherData).every(([key,value])=>aw.localStorage.getItem(key)===value),'Hero save changes no other storage keys');
  check(ad.querySelector('#homeHero').innerHTML===adminHeroBefore,'Public hero setting does not modify the admin hero');
  uniqueIDs(d);
  const blueReload=await page('3.html',storage(aw));
  check(blueReload.d.querySelector('#publicHero.sjf-blue-hero'),'Selected blue hero persists after reload');
  click(ad,'input[name="heroLayout"][value="madhubani"]');
  await submit(aw,'#homeEditorForm');
  w.localStorage.setItem('sjf_hero',aw.localStorage.getItem('sjf_hero'));
  w.dispatchEvent(new w.StorageEvent('storage',{key:'sjf_hero'}));
  check(d.querySelector('#publicHero .grad-fire') && !d.querySelector('.sjf-blue-hero'),'Original cream hero can be restored');
  check(outsideHero(d)===publicBefore,'Switching back changes only the hero');

  // Account edits use the current password and never display or persist cleartext passwords.
  click(ad,'[data-tab="account"]');
  check(ad.querySelector('#accountNewPassword').value==='' && ad.querySelector('#accountCurrentPassword').value==='','Account form starts with empty password fields');
  val(ad,'#accountUsername','manager'); val(ad,'#accountCurrentPassword','wrong-current');
  val(ad,'#accountNewPassword','changed-test-pass-99'); val(ad,'#accountConfirmPassword','changed-test-pass-99');
  await submit(aw,'#accountSettingsForm');
  check(!aw.localStorage.getItem('sjf_admin_credentials'),'Wrong current password cannot change credentials');
  val(ad,'#accountCurrentPassword','sjf@admin'); val(ad,'#accountConfirmPassword','different-test-pass');
  await submit(aw,'#accountSettingsForm');
  check(!aw.localStorage.getItem('sjf_admin_credentials'),'Password confirmation mismatch cannot save');
  val(ad,'#accountConfirmPassword','changed-test-pass-99'); await submit(aw,'#accountSettingsForm');
  const account=JSON.parse(aw.localStorage.getItem('sjf_admin_credentials'));
  check(account.username==='manager' && /^[a-f0-9]{64}$/.test(account.hash),'New username and derived password hash save');
  check(!aw.localStorage.getItem('sjf_admin_credentials').includes('changed-test-pass-99'),'Password is not stored as plaintext');
  check(!ad.body.textContent.includes('changed-test-pass-99') && !ad.body.textContent.includes('sjf@admin'),'Credentials are not shown as page text');
  check(ad.querySelector('#accountNewPassword').value==='' && ad.querySelector('#accountCurrentPassword').value==='','Passwords clear after save');
  click(ad,'#adminLogout');
  check(ad.querySelector('#adminPanel').classList.contains('hidden'),'Admin sign out works');
  val(ad,'#adminUser','admin'); val(ad,'#adminPass','sjf@admin'); await submit(aw,'#adminLoginForm');
  check(ad.querySelector('#adminPanel').classList.contains('hidden'),'Old credentials stop working after change');
  val(ad,'#adminUser','manager'); val(ad,'#adminPass','changed-test-pass-99'); await submit(aw,'#adminLoginForm');
  check(!ad.querySelector('#adminPanel').classList.contains('hidden'),'Updated credentials sign in successfully');
  const anotherAdmin=await page('admin.html',storage(aw));
  anotherAdmin.w.sessionStorage.setItem('sjf_admin',aw.sessionStorage.getItem('sjf_admin'));
  click(ad,'[data-tab="account"]');
  val(ad,'#accountUsername','owner'); val(ad,'#accountCurrentPassword','changed-test-pass-99'); await submit(aw,'#accountSettingsForm');
  check(await aw.SJFAccount.verify('owner','changed-test-pass-99'),'Username can change while keeping the current password');
  anotherAdmin.w.localStorage.setItem('sjf_admin_credentials',aw.localStorage.getItem('sjf_admin_credentials'));
  anotherAdmin.w.dispatchEvent(new anotherAdmin.w.StorageEvent('storage',{key:'sjf_admin_credentials'}));
  check(anotherAdmin.d.querySelector('#adminPanel').classList.contains('hidden'),'Credential changes invalidate other tab sessions');
  check(pub.errors.length===0 && adm.errors.length===0,'No interaction runtime errors: '+pub.errors.concat(adm.errors).join('\n'));
  const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
  check(index.includes("location.replace('3.html' + location.search + location.hash)"),'Index still opens 3.html');
  check(fs.readFileSync(path.join(root,'.htaccess'),'utf8').includes('DirectoryIndex 3.html'),'Apache entry remains 3.html');
  const runtime=['3.html','admin.html','assets/public.js','assets/public.css','assets/site.js','assets/site.css','assets/demo-data.js','assets/hero-blue.js','assets/hero-blue.css','assets/hero-config.js','assets/admin-account.js','assets/admin-editors.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
  check(!/(?:src|href)=["'][^"']*originals\//.test(runtime),'No runtime dependency on optional archive');
  pages.forEach(p=>p.window.close());
  console.log(`PASS: ${checks} checks for both designs, single-page navigation and shared demo content.`);
})().catch(e=>{pages.forEach(p=>p.window.close());console.error(e);process.exit(1);});
