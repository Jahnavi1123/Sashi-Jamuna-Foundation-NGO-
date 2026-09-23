const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, '3.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
const tick = () => new Promise(resolve => setTimeout(resolve, 35));

async function createPage(hash = '', saved = {}) {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'http://127.0.0.1:8000/3.html' + hash,
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: console
  });
  const w = dom.window;
  w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}});
  w.HTMLElement.prototype.scrollIntoView = function () { w.lastScroll = this.id; };
  w.scrollTo = () => {};
  w.requestAnimationFrame = callback => { callback(w.performance.now()); return 1; };
  w.cancelAnimationFrame = () => {};
  w.confirm = () => false;
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  Object.entries(saved).forEach(([key, value]) => w.localStorage.setItem(key, value));
  w.addEventListener('error', e => errors.push(e.error?.stack || e.message));
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve, {once:true}));
  w.eval(script);
  await tick();
  return {dom, w, d:w.document, errors};
}

function submit(w, selector) {
  const form = w.document.querySelector(selector);
  assert.ok(form, 'Form exists: ' + selector);
  form.dispatchEvent(new w.Event('submit', {bubbles:true, cancelable:true}));
}
function value(d, selector, text) { d.querySelector(selector).value = text; }
function click(d, selector) { assert.ok(d.querySelector(selector), 'Clickable exists: ' + selector); d.querySelector(selector).click(); }
function uniqueIDs(d) {
  const ids = [...d.querySelectorAll('[id]')].map(e => e.id);
  check(new Set(ids).size === ids.length, 'No duplicate document/SVG IDs');
}

(async () => {
  const {dom, w, d, errors} = await createPage();
  const publicPages = () => [...d.querySelectorAll('.page:not([data-page="admin"])')];
  check(publicPages().length === 9, 'Nine public sections on one page');
  check(publicPages().every(e => !e.classList.contains('hidden')), 'All public sections visible together');
  check(d.querySelector('#admin').classList.contains('hidden'), 'Admin hidden on public home');
  check(d.querySelectorAll('.section-announcement').length === 10, 'Announcement above every section including admin');
  check(d.querySelectorAll('footer').length === 1, 'Exactly one shared footer');
  check(d.querySelector('footer').textContent.includes('Alpha Avics Digital Solutions'), 'Footer preserves original credit');
  check(['Quick Links','Our Work','Reach Us'].every(t => d.querySelector('footer').textContent.includes(t)), 'Original footer columns preserved');
  check(!d.querySelector('footer a[href^="#/"]'), 'Footer uses correct section anchors');
  uniqueIDs(d);
  check(errors.length === 0, 'Initial runtime errors: ' + errors.join('\n'));

  click(d, '.announcement-toggle');
  check(d.body.classList.contains('announcements-paused'), 'Announcement animation pause works');
  check([...d.querySelectorAll('.announcement-toggle')].every(e => e.getAttribute('aria-pressed') === 'true'), 'All ticker controls reflect pause');
  click(d, '.announcement-toggle');
  click(d, '#menuBtn');
  check(d.querySelector('#menuBtn').getAttribute('aria-expanded') === 'true', 'Mobile navigation opens');
  w.location.hash = '#news'; await tick();
  check(w.lastScroll === 'news', 'Section navigation scrolls to news; actual=' + w.lastScroll + '; errors=' + errors.join('\n'));
  check(publicPages().every(e => !e.classList.contains('hidden')), 'Section navigation keeps single-page content visible');
  check(d.querySelector('#menuBtn').getAttribute('aria-expanded') === 'false', 'Navigation closes mobile menu');
  w.location.hash = '#/about'; await tick();
  check(w.lastScroll === 'about', 'Legacy section anchor supported');

  w.location.hash = '#admin'; await tick();
  check(publicPages().every(e => e.classList.contains('hidden')), 'Admin opens its dedicated view');
  value(d, '#adminPass', 'wrong'); submit(w, '#adminLoginForm');
  check(d.querySelector('#adminPanel').classList.contains('hidden'), 'Incorrect demo password rejected');
  value(d, '#adminPass', 'sjf@admin'); submit(w, '#adminLoginForm');
  check(!d.querySelector('#adminPanel').classList.contains('hidden'), 'Demo login works');
  check(d.querySelector('#adminHero h2').textContent.trim() === d.querySelector('#homeHero h1').textContent.trim(), 'Admin home exactly reuses public hero copy');
  check(d.querySelectorAll('#adminHero [data-art]').length === d.querySelectorAll('#homeHero [data-art]').length, 'Admin home reuses public artwork layout');
  uniqueIDs(d);

  click(d, '#adminTabs [data-tab="home-editor"]');
  value(d, '#edit-heroLead1', 'Together');
  value(d, '#edit-heroAccent1', 'We Grow.');
  value(d, '#edit-description', 'A community introduction.');
  value(d, '#impact-0', '12');
  submit(w, '#homeEditorForm');
  check(d.querySelector('#homeHero h1').textContent.includes('Together We Grow.'), 'Home edit updates public hero');
  check(d.querySelector('#homeStats').textContent.includes('12'), 'Impact editor updates public stats');
  click(d, '#adminTabs [data-tab="dash"]');
  check(d.querySelector('#adminHero h2').textContent.includes('Together We Grow.'), 'Admin preview follows home edits');

  click(d, '#adminTabs [data-tab="settings"]');
  value(d, '#setAddress', 'Demo office');
  value(d, '#setEmail', 'test@example.com');
  value(d, '#setPhone', '+91 0000000000');
  value(d, '#setIg', '@demo-foundation');
  submit(w, '#settingsForm');
  check(d.querySelector('footer').textContent.includes('Demo office'), 'Footer address updates');
  check(d.querySelector('footer a[href="mailto:test@example.com"]'), 'Footer email updates');
  check(d.querySelector('footer a[aria-label="Instagram"]').href === 'https://www.instagram.com/demo-foundation', 'Footer social handle works');
  value(d, '#footerNewsletterForm input', 'reader@example.com'); submit(w, '#footerNewsletterForm');
  check(JSON.parse(w.localStorage.getItem('sjf_subscribers')).length === 1, 'Re-rendered footer newsletter saves');

  click(d, '#adminTabs [data-tab="photos"]');
  value(d, '#photoUrl', 'javascript:alert(1)'); value(d, '#photoCaption', 'Test'); submit(w, '#photoForm');
  check(w.localStorage.getItem('sjf_photos') === null, 'Invalid image URL rejected');
  value(d, '#photoUrl', 'https://example.com/photo.jpg'); value(d, '#photoCaption', '<img src=x onerror=alert(1)>'); submit(w, '#photoForm');
  check(JSON.parse(w.localStorage.getItem('sjf_photos'))[0].src === 'https://example.com/photo.jpg', 'Photo saves to browser storage');
  check(d.querySelector('img[src="https://example.com/photo.jpg"]'), 'Saved photo renders on website');
  check(!d.querySelector('img[onerror]'), 'Photo captions are escaped');

  click(d, '#adminTabs [data-tab="videos"]');
  value(d, '#vidTitle', 'Demo video'); value(d, '#vidYoutube', 'https://youtu.be/abcdefghijk'); submit(w, '#videoForm');
  check(JSON.parse(w.localStorage.getItem('sjf_videos'))[0].youtube === 'abcdefghijk', 'Video saves valid YouTube ID');
  click(d, '#adminTabs [data-tab="updates"]');
  value(d, '#upTitle', 'A test field update'); value(d, '#upBody', 'Test-only content'); submit(w, '#updateForm');
  check(d.querySelector('#news').textContent.includes('A test field update'), 'New update renders in public news');
  click(d, '#adminTabs [data-tab="initiatives"]');
  value(d, '#iniTitle', 'Test Initiative'); value(d, '#iniDesc', 'Test programme'); submit(w, '#initForm');
  check(d.querySelector('footer').textContent.includes('Test Initiative'), 'Footer Our Work follows initiative content');

  w.location.hash = '#contact'; await tick();
  value(d, '#cName', 'Test Person'); value(d, '#cEmail', 'visitor@example.com'); value(d, '#cMessage', '<script>neverRun()</script>'); submit(w, '#contactForm');
  check(JSON.parse(w.localStorage.getItem('sjf_messages')).length === 1, 'Contact form saves to demo inbox');
  value(d, '#dName', 'Test Donor'); value(d, '#dPhone', '0000000000'); value(d, '#dEmail', 'donor@example.com'); submit(w, '#donateForm');
  check(JSON.parse(w.localStorage.getItem('sjf_donations')).length === 1, 'Donation interest records only once');
  check(JSON.parse(w.localStorage.getItem('sjf_donations'))[0].status === 'pending', 'Donation remains pending with no payment');
  value(d, '#qvName', 'Test Volunteer'); value(d, '#qvEmail', 'volunteer@example.com'); value(d, '#qvPhone', '0000000000'); submit(w, '#quickVolunteerForm');
  check(JSON.parse(w.localStorage.getItem('sjf_volunteers')).length === 1, 'Volunteer form saves locally');
  w.location.hash = '#admin'; await tick();
  click(d, '#adminTabs [data-tab="inbox"]');
  check(d.querySelector('#adminContent').textContent.includes('visitor@example.com'), 'Admin inbox lists submitted message');
  check(d.querySelector('#adminContent').textContent.includes('reader@example.com'), 'Admin inbox lists newsletter interest');
  check(!d.querySelector('#adminContent script'), 'Message content is escaped');
  click(d, '#adminLogout');
  check(d.querySelector('#adminPanel').classList.contains('hidden'), 'Sign out hides admin controls');

  const saved = Object.fromEntries(Object.keys(w.localStorage).map(k => [k, w.localStorage.getItem(k)]));
  const refreshed = await createPage('#about', saved);
  check(refreshed.d.querySelector('#homeHero h1').textContent.includes('Together We Grow.'), 'Home edits persist after reload');
  check(refreshed.d.querySelector('footer').textContent.includes('Demo office'), 'Footer settings persist after reload');
  check(refreshed.w.lastScroll === 'about', 'Deep link navigates after initial load');
  check(refreshed.errors.length === 0, 'No runtime errors on reload: ' + refreshed.errors.join('\n'));
  uniqueIDs(refreshed.d);
  check(errors.length === 0, 'No JavaScript runtime errors: ' + errors.join('\n'));
  dom.window.close(); refreshed.dom.window.close();

  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  check(index.includes("location.replace('3.html' + location.search + location.hash)"), 'Index resolves to canonical 3.html preserving anchors');
  check(fs.readFileSync(path.join(root, '.htaccess'), 'utf8').includes('DirectoryIndex 3.html'), 'Apache defaults to 3.html');
  console.log(`PASS: ${checks} website, navigation, storage and demo-admin checks.`);
})().catch(error => { console.error(error); process.exit(1); });
