from pathlib import Path
import re
import shutil

HELPERS = Path(__file__).resolve().parent
backup = HELPERS.parent
ROOT = backup.parent

h = (backup / '3.html').read_text(encoding='utf-8')
one = (backup / '1.html').read_text(encoding='utf-8')
assets = ROOT / 'assets'
assets.mkdir(exist_ok=True)

def replace(old, new, count=1):
    global h
    assert old in h, old[:100]
    h = h.replace(old, new, count)

if not h.lower().startswith('<!doctype'):
    h = '<!DOCTYPE html>\n' + h

# Preserve the original visual system. Reuse 1.html's fonts only in its footer.
replace('&family=Tiro+Devanagari+Hindi&display=swap', '&family=Tiro+Devanagari+Hindi&family=Yatra+One&family=Mukta:wght@400;600;700;800&family=Kalam&display=swap')
replace('<body class="font-sans text-ink">', '<body class="font-sans text-ink">\n<a href="#home" class="skip-link">Skip to content</a>')
replace('<div class="relative overflow-hidden bg-deep">', '<div class="relative overflow-hidden bg-deep" id="homeHero">')
replace('Empowering <span class="grad-text">Communities.</span><br>\n          Preserving <span class="grad-text">Culture.</span>', '<span data-home-copy="heroLead1">Empowering</span> <span class="grad-text" data-home-copy="heroAccent1">Communities.</span><br>\n          <span data-home-copy="heroLead2">Preserving</span> <span class="grad-text" data-home-copy="heroAccent2">Culture.</span>')
replace('<p class="text-cream/80 mt-6 max-w-xl', '<p data-home-copy="heroDescription" class="text-cream/80 mt-6 max-w-xl')

messages = ['◆ Together we nurture roots and reach skies.', '◆ Empowering Bihar, preserving heritage.', '◆ Madhubani art — our living tradition.', '◆ Volunteer with Sashi Jamuna Foundation today.']
group = '<div class="announcement-group">' + ''.join('<span>' + m + '</span>' for m in messages) + '</div>'
ticker = '<div class="section-announcement"><div class="announcement-window" aria-hidden="true"><div class="announcement-track">' + group + group + '</div></div><button type="button" class="announcement-toggle" aria-label="Pause announcements" aria-pressed="false">Ⅱ</button></div>'

def section(m):
    name = m.group(1)
    admin = name == 'admin'
    return '<section id="' + name + '" class="page' + (' hidden' if admin else '') + '" data-page="' + name + '" tabindex="-1">\n' + ticker
h = re.sub(r'<section class="page(?: hidden)?" data-page="([^"]+)">', section, h)
# A single document has one public h1; section titles form its h2 outline.
start = h.index('<section id="about"')
end = h.index('<section id="admin"')
h = h[:start] + h[start:end].replace('<h1 ', '<h2 ').replace('</h1>', '</h2>') + h[end:]
replace('Content &amp; Donation Dashboard', 'Your Foundation, Your Workspace')
replace('Manage photos, videos, daily updates, initiatives, volunteers and donations. Data is stored locally in this browser.', 'Manage your website from one place. This demo saves changes in this browser only.')
replace('In production this is handled by Supabase Auth with role-based access.', 'Demo access only — this is not a secure server login.')
replace('data-tab="dash">Dashboard', 'data-tab="dash">Home')
replace('data-tab="photos">Photos', 'data-tab="home-editor">Edit Home</button>\n          <button class="admin-tab btn btn-outline !py-2 !px-4 !text-[.8rem]" data-tab="photos">Photos')
replace('data-tab="settings">Settings', 'data-tab="inbox">Inbox</button>\n          <button class="admin-tab btn btn-outline !py-2 !px-4 !text-[.8rem]" data-tab="settings">Settings')
replace('<div id="adminContent"></div>', '<div class="admin-demo-note">Browser demo · Changes stay on this device. <a href="#home">View website ↗</a></div>\n    <div id="adminContent"></div>')
h = re.sub(r'<footer\b[\s\S]*?</footer>', '<div id="footerRoot"></div>', h, count=1)
replace('<div id="toastWrap"', '<div role="status" aria-live="polite" id="toastWrap"')
h = h.replace('<script src="https://checkout.razorpay.com/v1/checkout.js"></script>', '')

main_script = re.search(r'<script>\s*/\* =+[\s\S]*?</script>', h)
assert main_script
js = main_script.group()[8:-9]
h = h[:main_script.start()] + '<script src="assets/site.js" defer></script>' + h[main_script.end():]
js = re.sub(r'   Architecture note:[\s\S]*?demonstration\.', '   Single-page website with an explicitly browser-local demo admin.', js, count=1)
js = js.replace('return raw ? JSON.parse(raw) : fallback;', 'return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback == null ? null : fallback));')
js = js.replace('} catch (e) { return fallback; }', '} catch (e) { return JSON.parse(JSON.stringify(fallback == null ? null : fallback)); }', 1)
js = js.replace('    volunteers: [],', '    messages: [],\n    subscribers: [],\n    volunteers: [],')
js = js.replace("    return (location.hash || '#home').replace('#', '') || 'home';", "    return (location.hash || '#home').replace(/^#\\/?/, '') || 'home';")

router = '''  function updateActiveNav(name) {
    $$('[data-nav]').forEach(function (a) {
      var active = a.getAttribute('data-nav') === name;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  function showPage(name, skipScroll) {
    if (PAGES.indexOf(name) === -1) name = 'home';
    currentPage = name;
    var admin = name === 'admin';
    document.body.classList.toggle('admin-mode', admin);
    $$('.page').forEach(function (p) {
      p.classList.toggle('hidden', (p.dataset.page === 'admin') !== admin);
    });
    updateActiveNav(name);
    closeMobileMenu();
    document.documentElement.style.setProperty('--header-height', $('#siteHeader').offsetHeight + 'px');
    if (admin) renderAdmin();
    var target = document.getElementById(name);
    if (target && (!skipScroll || location.hash)) {
      requestAnimationFrame(function () {
        target.scrollIntoView({ behavior: skipScroll || admin || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        if (!skipScroll) target.focus({ preventScroll: true });
      });
    }
    observeReveals();
  }
'''
js = re.sub(r'  function showPage\([\s\S]*?(?=  function currentHash)', lambda _: router + '\n', js, count=1)
js = js.replace("return adminAuthed || sessionStorage.getItem('sjf_admin') === '1';", "try { return adminAuthed || sessionStorage.getItem('sjf_admin') === '1'; } catch (e) { return adminAuthed; }")
js = js.replace("sessionStorage.setItem('sjf_admin', '1');", "try { sessionStorage.setItem('sjf_admin', '1'); } catch (e) {}")
js = js.replace("sessionStorage.removeItem('sjf_admin');", "try { sessionStorage.removeItem('sjf_admin'); } catch (e) {}")
js = js.replace("    document.getElementById('year').textContent = new Date().getFullYear();", "    renderReferenceFooter();\n    applyHomeSettings();\n    initSinglePage();")

# Reuse the actual footer renderer and SVG assets from 1.html.
icons = one[one.index('const ICONS='):one.index('/* ---------------- Madhubani artwork')]
icons = icons.replace('ICONS', 'FOOTER_ICONS')
lotus = one[one.index('function lotusMini('):one.index('function medallion(')]
footer = one[one.index('function footer()'):one.index('/* ---------------- shared components')]
footer = footer.replace('function footer(){const s=DB.data.settings;', '''function footer(){
 const raw=get('settings');
 const s={address:raw.address||'',email:raw.email||'info@sashijamunafoundation.org',phone:raw.phone||'',
   instaUrl:socialURL(raw.instagram,'instagram'),fbUrl:socialURL(raw.facebook,'facebook'),ytUrl:socialURL(raw.youtube,'youtube')};
 const NAV=[['home','Home'],['about','About Us'],['initiatives','Initiatives'],['gallery','Gallery'],['videos','Videos'],['news','Updates'],['contact','Contact']];
 const esc=escapeHtml;''')
footer = footer.replace('DB.data.initiatives', "get('initiatives')").replace('#/', '#')
footer = footer.replace('class="relative g-navy', 'class="reference-footer relative g-navy')
footer = footer.replace('data-form="f-news"', 'id="footerNewsletterForm"')
footer = footer.replace('<input type="email"', '<input class="footer-email" type="email"', 1)
footer = footer.replace(' class="!bg-night/40 !border-cream/20 !text-cream placeholder:text-cream/40"', '')
footer = footer.replace('data-act="soc"', 'data-footer-social="true"')
extra = (HELPERS / 'site_extras.js').read_text(encoding='utf-8')
js = js.replace('  /* ------------------------------------------------------------------\n     15. GO', icons + '\n' + lotus + '\n' + footer + '\n' + extra + '\n  /* ------------------------------------------------------------------\n     15. GO')

# Replace the generic dashboard with the exact home hero and useful controls.
a = js.index("    if (activeTab === 'dash') {")
b = js.index("    if (activeTab === 'photos') {", a)
js = js[:a] + '''    if (activeTab === 'dash') {
      renderAdminHome(c);
      return;
    }
    if (activeTab === 'home-editor') {
      renderHomeEditor(c);
      return;
    }
    if (activeTab === 'inbox') {
      renderInbox(c);
      return;
    }

''' + js[b:]
js = js.replace("        var v = r[h] == null ? '' : String(r[h]);", "        var v = r[h] == null ? '' : String(r[h]);\n        if (/^[=+@\\-\\t\\r]/.test(v)) v = \"'\" + v;")
js = js.replace("(label || 'Madhubani inspired artwork')", "escapeAttr(label || 'Madhubani inspired artwork')")
js = js.replace("'<img src=\"' + item.src + '\"", "'<img src=\"' + escapeAttr(safeImageURL(item.src)) + '\"")
js = js.replace("'<img src=\"' + p.src + '\"", "'<img src=\"' + escapeAttr(safeImageURL(p.src)) + '\"")
js = js.replace('Uploaded images are resized to 900px and stored locally. In production they are uploaded to Supabase Storage.', 'Images are resized to 900px and saved in this browser. Use smaller files if browser storage is full.')
js = js.replace('Invalid credentials. Try admin / sjf@admin.', 'Invalid demo username or password.')
js = js.replace("var totalDonations = donations.reduce(function (a, d) { return a + (Number(d.amount) || 0); }, 0);", "var totalDonations = donations.filter(function (d) { return d.status === 'paid'; }).reduce(function (a, d) { return a + (Number(d.amount) || 0); }, 0);")
js = js.replace("statCard('Total Value',", "statCard('Recorded as received',")
js = js.replace("statCard('Razorpay', s.razorpayKey ? 'Configured' : 'Not Configured', s.razorpayKey ? 'text-leaf' : 'text-magenta')", "statCard('Payment mode', 'Demo only', 'text-royal')")

# Demo donation flow records an interest, never attempts a real charge.
a = js.index('  function updateRazorpayStatus()')
b = js.index('  /* ------------------------------------------------------------------\n     14. EVENT WIRING', a)
js = js[:a] + '''  function updateRazorpayStatus() {
    var el = $('#razorpayStatusText');
    if (el) el.textContent = 'Demo mode — no payments are processed.';
  }

''' + js[b:]
js = js.replace("        set('donations', donations);\n\n        var opened = initRazorpay(amount, donor);\n        if (opened) toast('Opening secure payment window…', 'info');\n        else toast('Donation intent recorded (pending). Configure Razorpay to complete payments.', 'info');", "        if (!set('donations', donations)) return;\n        toast('Donation interest saved in this browser. No payment was processed.', 'info');")
js = js.replace("        $$('.amount-chip').forEach(function (c) { c.classList.remove('selected'); });\n        $('#customAmountWrap')", "        selectedAmount = 1000;\n        $$('.amount-chip').forEach(function (c) { c.classList.toggle('selected', c.dataset.amount === '1000'); });\n        $('#customAmountWrap')")
js = js.replace("toast('Thank you! Your volunteer registration has been received.', 'success');", "toast('Volunteer registration saved in this browser demo.', 'success');\n        return true;")
js = js.replace('        handleVolunteer({', '        if (!handleVolunteer({')
js = js.replace('        });\n        vForm.reset();', '        })) return;\n        vForm.reset();')
js = js.replace('        });\n        qvForm.reset();', '        })) return;\n        qvForm.reset();')
js = js.replace("['#newsletterForm', '#newsSideForm']", "['#newsletterForm', '#newsSideForm']")
js = js.replace("          toast('Subscribed! You will receive our next update.', 'success');\n          f.reset();", "          if (saveSubscriber($('input[type=email]', f).value)) f.reset();")
js = js.replace("        toast('Message sent. Our team will respond within 1–2 working days.', 'success');\n        cForm.reset();", "        var messages = get('messages');\n        messages.unshift({id:uid('m'),date:new Date().toISOString(),name:$('#cName').value.trim(),phone:$('#cPhone').value.trim(),email:$('#cEmail').value.trim(),subject:$('#cSubject').value,message:$('#cMessage').value.trim()});\n        if (set('messages', messages)) { toast('Message saved in the demo inbox on this browser.', 'success'); cForm.reset(); }")
js = js.replace("        var form = e.target;\n\n        // ---- Photos", "        var form = e.target;\n        if (!isAuthed()) { e.preventDefault(); renderAdmin(); return; }\n\n        // ---- Photos")
js = js.replace("      adminContent.addEventListener('click', function (e) {", "      adminContent.addEventListener('click', function (e) {\n        if (!isAuthed()) return;")
js = js.replace("          var urlVal = $('#photoUrl').value.trim();", "          var urlVal = $('#photoUrl').value.trim();\n          if (urlVal && !safeImageURL(urlVal)) { toast('Use an https image URL.', 'warn'); return; }")
js = js.replace("          if (set('photos', photos)) {", "          if (!added) { toast('No image could be read. Choose a supported image file.', 'error'); return; }\n          if (set('photos', photos)) {")
js = js.replace("            id = m ? m[1] : yt.replace(/[^A-Za-z0-9_-]/g, '');", "            id = m ? m[1] : yt;\n            if (!/^[A-Za-z0-9_-]{11}$/.test(id)) { toast('Enter a valid YouTube URL or 11-character video ID.', 'warn'); return; }")
js = js.replace("          s.razorpayKey = $('#setRzp').value.trim();", "          s.address = $('#setAddress').value.trim();\n          s.email = $('#setEmail').value.trim();\n          s.phone = $('#setPhone').value.trim();")
js = js.replace("            renderSocialFeeds();\n            renderAdminContent();", "            renderSocialFeeds();\n            renderReferenceFooter();\n            renderAdminContent();")
js = js.replace('Payment Gateway (Razorpay)', 'Contact &amp; Social Settings')
js = js.replace('Payments stay disabled until a valid Key ID is saved. Never store your Key Secret in the browser — keep it in Supabase Edge Function environment variables.', 'Update the contact details and social links used in the footer. Changes are saved in this browser.')
js = js.replace("              '<div><label class=\"label\">Razorpay Key ID</label>' +\n                '<input class=\"field\" id=\"setRzp\" placeholder=\"rzp_live_xxxxxxxxxxxx\" value=\"' + escapeAttr(s.razorpayKey || '') + '\"></div>' +", "              '<div><label class=\"label\" for=\"setAddress\">Address</label><input class=\"field\" id=\"setAddress\" value=\"' + escapeAttr(s.address || '') + '\"></div>' +\n              '<div><label class=\"label\" for=\"setEmail\">Email</label><input class=\"field\" type=\"email\" id=\"setEmail\" value=\"' + escapeAttr(s.email || 'info@sashijamunafoundation.org') + '\"></div>' +\n              '<div><label class=\"label\" for=\"setPhone\">Phone</label><input class=\"field\" id=\"setPhone\" value=\"' + escapeAttr(s.phone || '') + '\"></div>' +")
social_start = js.index("          '<div class=\"card p-6\"><span class=\"card-topline\"></span>' +\n            '<h3 class=\"font-display text-lg font-bold text-deep\">Social Feed Integration")
social_end = js.index("          '<div class=\"card p-6 lg:col-span-2\">", social_start)
js = js[:social_start] + "          '<div class=\"card p-6\"><h3 class=\"font-display text-lg font-bold text-deep\">Your demo workspace</h3><p class=\"text-ink/60 text-sm mt-3\">Photos, updates, enquiries and settings are saved on this device. Export a backup before clearing your browser data.</p><button type=\"button\" class=\"btn btn-blue mt-5\" data-export-backup>Export backup</button><p class=\"text-ink/60 text-sm mt-4\">Donations record interest only. No payment or email is sent from this demo.</p></div>' +\n" + js[social_end:]
js = js.replace("        if (e.target.closest('#resetData')) {\n          Object.keys(SEED).forEach", "        if (e.target.closest('#resetData')) {\n          if (!window.confirm('Reset the browser demo? Export a backup first if you need to keep your changes.')) return;\n          Object.keys(SEED).forEach")
js = js.replace("          toast('All local data reset.', 'success');", "          toast('All local data reset.', 'success');\n          applyHomeSettings(); renderStats(); renderReferenceFooter();")
js = js.replace('renderAdminContent(); renderInitiatives();', 'renderAdminContent(); renderInitiatives(); renderReferenceFooter();')
js = js.replace("value: null },", "value: null },")
js = js.replace("    var wrap = $('#homeStats');", "    var savedStats = get('settings').impact || [];\n    stats.forEach(function (s, i) { s.value = savedStats[i] == null ? '' : String(savedStats[i]); });\n    var wrap = $('#homeStats');")
js = js.replace("text-gold leading-none\">—</p>' +", "text-gold leading-none\">' + escapeHtml(s.value || '—') + '</p>' +")
js = js.replace("mt-1.5\">Awaiting verified data</p>' +", "mt-1.5\">' + (s.value ? 'Foundation impact' : 'Awaiting verified data') + '</p>' +")
js = js.replace("            '<p class=\"text-ink/50 text-[.78rem] mt-2\">Placeholder media — replace with a real photograph from the admin dashboard.</p></div>');", "            (p.src ? '' : '<p class=\"text-ink/50 text-[.78rem] mt-2\">Illustrative artwork</p>') + '</div>');")

# Keep original CSS plus footer-scoped styling; no global theme changes.
css = re.search(r'<style>([\s\S]*?)</style>', h).group(1)
h = re.sub(r'<style>[\s\S]*?</style>', '<link rel="stylesheet" href="assets/site.css">', h, count=1)
arm = re.search(r'  --arm-dark:([^\n]+)', one).group(1)
pat = re.search(r'\.pat-dark\{[^\n]+', one).group()
css += '\n:root { --arm-dark: ' + arm + ' }\n#footerRoot ' + pat + '\n'
css += (HELPERS / 'site_extras.css').read_text(encoding='utf-8')

# Donation/contact labels accurately describe the selected browser demo.
h = h.replace('Add your Key ID in <a href="#admin" class="text-magenta underline decoration-dotted">Admin → Settings</a> to activate live payments.', 'This browser demo records donation interest only. No money is charged.')
h = h.replace('Donate Securely', 'Support Our Work')
h = h.replace('Proceed to Pay', 'Save Donation Interest')
h = h.replace('Proceed to Secure Payment', 'Save Donation Interest')
h = h.replace('Secure payments powered by Razorpay — activated once your account keys are configured.', 'Support the work that matters to you. This demo saves your interest without taking a payment.')
h = h.replace("Choose an amount and complete the form. You'll be redirected to a secure payment gateway.", 'Choose an amount and leave your details to record your interest in this demo.')
h = h.replace('Razorpay integration status:', 'Donation mode:')
h = h.replace('Donation details submitted now are securely logged as pending records.', 'Details are stored locally as pending interest records.')
h = h.replace('class="amount-chip" data-amount="1000"', 'class="amount-chip selected" data-amount="1000"')
h = h.replace('id="adminUser" value="admin"', 'id="adminUser" required value="admin"')
h = h.replace('id="adminPass" type="password"', 'id="adminPass" required type="password"')
h = h.replace('We usually respond within 1–2 working days.', 'Demo: messages are saved to the admin inbox in this browser.')
(assets / 'site.js').write_text(js, encoding='utf-8')
(assets / 'site.css').write_text(css, encoding='utf-8')
(ROOT / '3.html').write_text(h, encoding='utf-8')

def redirect(target, title, script):
    return '<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + title + '</title><script>' + script + '</script><noscript><meta http-equiv="refresh" content="0;url=' + target + '"></noscript></head><body><p><a href="' + target + '">Open ' + title + '</a></p></body></html>\n'
(ROOT / 'index.html').write_text(redirect('3.html', 'Sashi Jamuna Foundation', "location.replace('3.html' + location.search + location.hash);"), encoding='utf-8')
(ROOT / 'admin.html').write_text(redirect('3.html#admin', 'SJF Admin Portal', "location.replace('3.html' + location.search + '#admin');"), encoding='utf-8')
(ROOT / '.htaccess').write_text('DirectoryIndex 3.html index.html\n', encoding='utf-8')
print('Built single-page 3.html, shared assets, index entry and admin entry.')
