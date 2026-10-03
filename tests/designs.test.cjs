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
  w.matchMedia = () => ({matches:false,addEventListener(){}});
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.pause = () => {}; w.HTMLMediaElement.prototype.load = () => {};
  w.localStorage.setItem('sjf_language','en');
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
  check(d.querySelector('#publicHero .grad-teal').textContent === 'Communities','Public site preserves original accent text');
  check(d.querySelector('#publicHero svg'),'Public hero has original Madhubani illustration');
  check(d.querySelector('link[href="assets/public.css"]'),'Public site loads original visual design styles');
  const homeHero=d.querySelector('#publicHero'), stories=d.querySelector('#homeFeaturedVideo')?.closest('section'), whoWeAre=[...d.querySelectorAll('#home h2')].find(h=>h.textContent.includes('A promise painted'))?.closest('section');
  check(homeHero && stories && whoWeAre && (homeHero.compareDocumentPosition(stories)&w.Node.DOCUMENT_POSITION_FOLLOWING) && (stories.compareDocumentPosition(whoWeAre)&w.Node.DOCUMENT_POSITION_FOLLOWING),'Stories that move us appears after the hero and before Who We Are');
  check(!d.querySelector('#home .rot-badge, #home .cph'),'Who We Are has no spinning badge or framed collage');
  check(!d.querySelector('#home').textContent.includes('Initiative cards are editable'),'Home page hides the initiative editor note');
  const homeInitiatives=[...d.querySelectorAll('#home h2')].find(h=>h.textContent.trim()==='Our Initiatives')?.closest('section');
  check(homeInitiatives && ![...homeInitiatives.querySelectorAll('h3')].some(h=>h.textContent.trim()==='Madhubani Art & Culture'),'Home initiatives omit the Madhubani Art & Culture card');
  const impactSection=[...d.querySelectorAll('#home h2')].find(h=>h.textContent.trim()==='Impact You Can Verify')?.closest('section');
  check(impactSection && !impactSection.textContent.includes('Add verified figure in Admin') && !impactSection.textContent.includes('Villages Reached'),'Impact section omits the admin prompt and Villages Reached metric');
  check(d.querySelectorAll('.site-section').length === 1,'Public page renders its own route');
  check([...d.querySelectorAll('.site-section')].every(e=>!e.classList.contains('hidden')),'All public sections visible together');
  check(d.querySelectorAll('.section-announcement').length === 1,'Blue announcement strip on the public page');
  check(d.querySelectorAll('h1').length===1,'Single public h1');
  check(d.querySelectorAll('footer').length===1,'Single original footer');
  check(d.querySelector('footer').textContent.includes('Alpha Avics Digital Solutions'),'Original footer credit preserved');
  check(d.querySelector('footer a[href="admin.html"]'),'Footer opens the separate admin portal');
  uniqueIDs(d);
  click(d,'.announcement-toggle');
  check(d.body.classList.contains('announcements-paused'),'Announcement pause works');
  click(d,'[data-act="nav-toggle"]');
  check(d.querySelector('#mnav').classList.contains('open'),'Mobile menu opens');
  click(d,'[data-act="nav-toggle"]');
  check(!d.querySelector('#mnav').classList.contains('open'),'Mobile menu closes');
  check(d.querySelector('a[data-nav="about"]').getAttribute('href')==='about.html','Menu routes to separate pages');
  const gallery=await page('gallery.html');
  click(gallery.d,'[data-act="gfil"][data-cat="education"]');
  check([...gallery.d.querySelectorAll('#g-grid .g-item')].every(e=>e.textContent.includes('education')),'Gallery filter works');
  click(gallery.d,'#g-grid .g-item');
  check(gallery.d.querySelector('#modal-root .lb-bg'),'Gallery lightbox opens');
  click(gallery.d,'#modal-root button[data-act="modal-x"]');
  check(!gallery.d.querySelector('#modal-root').innerHTML,'Gallery lightbox closes');
  const contact=await page('contact.html',storage(w)),cd=contact.d;
  val(cd,'#c-name','Test Person'); val(cd,'#c-email','visitor@example.com'); val(cd,'#c-msg','A test message <script>alert(1)</script>');
  await submit(contact.w,'[data-form="f-contact"]');
  check(JSON.parse(contact.w.localStorage.getItem('sjf_messages')).length===1,'Contact submission saves shared inbox');
  val(cd,'footer input[type=email]','reader@example.com'); await submit(contact.w,'footer [data-form="f-news"]');
  check(JSON.parse(contact.w.localStorage.getItem('sjf_subscribers'))[0].email==='reader@example.com','Newsletter stores email');
  const volunteer=await page('volunteer.html',storage(contact.w));
  val(volunteer.d,'#v-name','Test Volunteer');val(volunteer.d,'#v-email','volunteer@example.com');val(volunteer.d,'#v-phone','0000000000');await submit(volunteer.w,'[data-form="f-vol"]');
  check(JSON.parse(volunteer.w.localStorage.getItem('sjf_volunteers')).length===1,'Volunteer submission saves');
  const donate=await page('donate.html',storage(volunteer.w));
  val(donate.d,'#d-name','Test Donor');val(donate.d,'#d-email','donor@example.com');val(donate.d,'#d-phone','0000000000');await submit(donate.w,'[data-form="f-donate"]');
  const donations=JSON.parse(donate.w.localStorage.getItem('sjf_donations'));
  check(donations.length===1 && donations[0].status==='pending','Donation saves interest only');
  sync(donate.w,w);

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
  check(ad.querySelector('#adminContent').textContent.includes('Welcome to your foundation'),'Admin dashboard renders');
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
  click(ad,'[data-tab="impact"]'); val(ad,'#impact-1','12'); await submit(aw,'#impactSettingsForm');
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
  check((await page('updates.html',storage(aw))).d.querySelector('#main').textContent.includes('A new field report'),'Admin update appears in public news');
  check(aw.SJFData.read('videos').some(v=>v.title==='A demo video'),'Admin video remains saved in library');
  check((await page('initiatives.html',storage(aw))).d.querySelector('#main').textContent.includes('Test initiative'),'Admin initiative appears on public page');
  check(d.querySelector('footer').textContent.includes('Test initiative'),'Public footer work list follows admin content');
  check(d.querySelector('#publicHero .grad-fire'),'Public keeps original typography/accent hooks after edit');
  uniqueIDs(d);
  const fresh=await page('3.html',storage(aw));
  check(fresh.d.querySelector('#publicHero h1').textContent.includes('Together We Grow'),'Content persists after reload');

  const outsideHero = document => { const app=document.querySelector('#app').cloneNode(true); app.querySelector('#publicHeroSlot').replaceChildren(); return app.innerHTML; };
  const publicBefore=outsideHero(d), footerBefore=d.querySelector('footer');
  val(d,'footer input[type=email]','unsent@example.com');
  const otherData=Object.fromEntries(Object.entries(storage(aw)).filter(([key])=>key!=='sjf_hero'));
  click(ad,'[data-tab="home-editor"]');
  check(!ad.querySelector('[name="heroLayout"]'),'Only one public hero layout');
  val(ad,'#edit-heroLead1','A new welcome');await submit(aw,'#homeEditorForm');
  w.localStorage.setItem('sjf_hero',aw.localStorage.getItem('sjf_hero'));
  w.dispatchEvent(new w.StorageEvent('storage',{key:'sjf_hero'}));
  check(d.querySelector('#publicHero h1').textContent.includes('A new welcome'),'Saved hero copy refreshes');
  check(outsideHero(d)===publicBefore && d.querySelector('footer')===footerBefore,'Hero edit preserves other DOM');
  check(d.querySelector('footer input[type=email]').value==='unsent@example.com','Hero update preserves form draft');
  check(Object.entries(otherData).every(([key,value])=>aw.localStorage.getItem(key)===value),'Hero save changes no other data');
  for(const layout of ['blue','heritage','community']){
    const old=await page('3.html',{...storage(aw),sjf_hero:JSON.stringify({layout,heroLead1:'Saved text'})});
    check(old.d.querySelector('.hero-kids-frame') && old.d.querySelector('h1').textContent.includes('Saved text'),'Old layout normalizes without losing text');
  }

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
  const runtime=['3.html','admin.html','assets/public.js','assets/public.css','assets/site.js','assets/site.css','assets/demo-data.js','assets/hero-config.js','assets/admin-account.js','assets/admin-editors.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
  check(!/(?:src|href)=["'][^"']*originals\//.test(runtime),'No runtime dependency on optional archive');
  pages.forEach(p=>p.window.close());
  console.log(`PASS: ${checks} checks for public pages, admin edits, credentials and shared demo content.`);
})().catch(e=>{pages.forEach(p=>p.window.close());console.error(e);process.exit(1);});
