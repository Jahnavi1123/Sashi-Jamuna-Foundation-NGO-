"""One-time design migration. Active pages do not depend on this archive."""
from pathlib import Path
import re

archive = Path(__file__).resolve().parents[1]
root = archive.parent
source = (archive / '1.html').read_text(encoding='utf-8')
current = (root / '3.html').read_text(encoding='utf-8')
admin_js = (root / 'assets/site.js').read_text(encoding='utf-8')

# Keep a reversible snapshot of the first integration inside the optional archive.
previous = archive / 'previous-integration'
previous.mkdir(exist_ok=True)
for name in ('3.html', 'admin.html', 'assets/site.js', 'assets/site.css', 'tests/site.test.cjs'):
    dest = previous / name
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        dest.write_bytes((root / name).read_bytes())

seed = re.search(r'  const SEED = (\{[\s\S]*?\n  \});', admin_js).group(1)
shared = '''/* Shared browser-demo data. Both designs use the same sjf_ storage keys. */
(function () {
  const defaults = SEED;
  const clone = value => JSON.parse(JSON.stringify(value));
  window.SJFData = {
    defaults,
    read(key) {
      try { const raw = localStorage.getItem('sjf_' + key); return raw ? JSON.parse(raw) : clone(defaults[key]); }
      catch (_) { return clone(defaults[key]); }
    },
    write(key, value) {
      try { localStorage.setItem('sjf_' + key, JSON.stringify(value)); return true; }
      catch (_) { return false; }
    }
  };
})();
'''.replace('SEED', seed)
(root / 'assets/demo-data.js').write_text(shared, encoding='utf-8')
admin_js = re.sub(r'  const SEED = \{[\s\S]*?\n  \};', '  const SEED = window.SJFData.defaults;', admin_js, count=1)
admin_js = admin_js.replace("(location.hash || '#home')", "(location.hash || '#admin')")
admin_js = admin_js.replace("    currentPage = name;", "    if (name !== 'admin') { location.assign('3.html#' + name); return; }\n    currentPage = name;", 1)
admin_js = admin_js.replace("['heroLead1','First line','Empowering'],['heroAccent1','First highlight','Communities.'],['heroLead2','Second line','Preserving'],['heroAccent2','Second highlight','Culture.']", "['heroLead1','First line','Rooted in'],['heroAccent1','First highlight','Culture'],['heroLead2','Second line','Growing'],['heroAccent2','Second highlight','Hope']")
admin_js = admin_js.replace('The website and admin home share the same design.', 'The public website keeps its cream Madhubani design. This admin portal keeps the blue design.')
admin_js = admin_js.replace('Welcome to your foundation', 'Welcome to your foundation')
admin_js = admin_js.replace("    $('#footerRoot').innerHTML = footer();", "    $('#footerRoot').innerHTML = footer();\n    $$('#footerRoot a[href^=\"#\"]').forEach(function (a) { if (a.hash !== '#admin') a.href = '3.html' + a.hash; });")
admin_js = admin_js.replace('href="#home"', 'href="3.html#home"')
admin_js = admin_js.replace("    $('#footerRoot').innerHTML = footer();", "    $('#footerRoot').innerHTML = footer();", 1)
(root / 'assets/site.js').write_text(admin_js, encoding='utf-8')

admin = current.replace('<title>Sashi Jamuna Foundation | Empowering Communities, Preserving Culture — Bihar, India</title>', '<title>Admin Portal | Sashi Jamuna Foundation</title>')
admin = admin.replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex, nofollow">')
admin = admin.replace('<body class="font-sans text-ink">', '<body class="font-sans text-ink admin-mode">')
admin = re.sub(r'<section id="([^"]+)" class="page"', lambda m: '<section id="' + m.group(1) + '" class="page hidden"', admin)
admin = admin.replace('<section id="admin" class="page hidden"', '<section id="admin" class="page"')
admin = re.sub(r'href="#(home|about|initiatives|gallery|videos|news|donate|volunteer|contact)"', r'href="3.html#\1"', admin)
admin = admin.replace('<script src="assets/site.js" defer></script>', '<script src="assets/demo-data.js" defer></script>\n<script src="assets/site.js" defer></script>')
(root / 'admin.html').write_text(admin, encoding='utf-8')

# Copy the exact public design templates and styles from 1.html.
head = source[:source.index('<body>')]
head = '<!DOCTYPE html>\n' + head
head = re.sub(r'<!-- Razorpay checkout[\s\S]*?<script src="https://checkout.razorpay.com/v1/checkout.js"></script>', '', head, count=1)
css = re.search(r'<style>([\s\S]*?)</style>', head).group(1)
head = re.sub(r'<style>[\s\S]*?</style>', '<link rel="stylesheet" href="assets/public.css">', head, count=1)
head = head.replace('"url":"https://example.com",', '')
public_html = head + '''<body>
<a href="#home" class="skip-link">Skip to content</a>
<div id="app"></div>
<div id="toast-root" aria-live="polite" role="status"></div>
<div id="modal-root"></div>
<script src="assets/demo-data.js" defer></script>
<script src="assets/public.js" defer></script>
</body>
</html>
'''
(root / '3.html').write_text(public_html, encoding='utf-8')

helpers = source[source.index('const $='):source.index('/* ---------------- data layer')]
templates = source[source.index('const ICOL='):source.index('/* ---------------- ADMIN DASHBOARD')]
templates = templates.replace('#/updates', '#news').replace("['updates','Updates']", "['news','Updates']").replace('#/', '#')
templates = templates.replace('href="#admin"', 'href="admin.html"')
templates = templates.replace('fixed top-0 inset-x-0 z-50', 'sticky top-0 inset-x-0 z-50')
templates = templates.replace('data-act="nav-toggle" aria-label="Menu"', 'data-act="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mnav"')
templates = templates.replace('<h1 class="font-disp text-[clamp(2.3rem,5.5vw,3.8rem)]', '<h2 class="font-disp text-[clamp(2.3rem,5.5vw,3.8rem)]').replace('${title}</h1>', '${title}</h2>')
templates = templates.replace('function heroSection(){return `<section class="', 'function heroSection(){return `<section id="publicHero" class="')
templates = templates.replace('Rooted in <span class="grad-fire">Culture</span>,<br>Growing <span class="grad-teal">Hope</span>.', '<span data-home-copy="heroLead1">Rooted in</span> <span class="grad-fire" data-home-copy="heroAccent1">Culture</span>,<br><span data-home-copy="heroLead2">Growing</span> <span class="grad-teal" data-home-copy="heroAccent2">Hope</span>.')
templates = templates.replace('<p class="mt-5 text-lg text-ink/75 max-w-xl', '<p data-home-copy="heroDescription" class="mt-5 text-lg text-ink/75 max-w-xl')
templates = templates.replace('type="email" required placeholder=', 'type="email" name="email" required placeholder=')
templates = templates.replace('Donate Securely via Razorpay', 'Save Donation Interest')
templates = templates.replace('256-bit encrypted checkout', 'Browser demo only').replace('Instant receipt on email', 'No payment is processed')
templates = templates.replace('Online payments go live the moment Razorpay keys are added in Admin &rarr; Settings. Until then, your pledge is recorded and our team will contact you.', 'This demo records your interest in this browser only. No payment is taken and no email is sent.')
templates = templates.replace('Fill this in — our team will reach out within a few days.', 'Demo: your registration will be saved in this browser.')
templates = templates.replace('One short email when something important happens. No spam, ever.', 'Save your newsletter interest in this browser demo.')
templates = templates.replace("${d.toLocaleDateString('en-IN',{month:'short'}).toUpperCase()}", "${u.date ? d.toLocaleDateString('en-IN',{month:'short'}).toUpperCase() : 'DATE'}").replace('${d.getDate()}', "${u.date ? d.getDate() : '—'}")
templates = templates.replace('src="${v.yt}', 'src="${esc(v.yt)}')
# Only the public templates are used. No second admin/auth system is included.
lightbox = source[source.index('function openLB('):source.index('/* ---------------- image compression')]
runtime = (Path(__file__).parent / 'public-runtime.js').read_text(encoding='utf-8')
helpers = helpers.replace("const fmtDate=d=>new Date(d).toLocaleDateString", "const fmtDate=d=>!d?'Date to be added':new Date(d).toLocaleDateString")
public_js = '(function () {\n\"use strict\";\n' + helpers + '\n' + templates + '\n' + lightbox + '\n' + runtime + '\n})();\n'
(root / 'assets/public.js').write_text(public_js, encoding='utf-8')
css += (Path(__file__).parent / 'public-adjustments.css').read_text(encoding='utf-8')
(root / 'assets/public.css').write_text(css, encoding='utf-8')
print('Public: 1.html design in 3.html. Admin: preserved blue design in admin.html. Shared local data retained.')
