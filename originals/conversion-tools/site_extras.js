  function safeImageURL(value) {
    if (/^data:image\/(?:png|jpeg|gif|webp);base64,[a-z0-9+/=]+$/i.test(value)) return value;
    try { var u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch (e) { return ''; }
  }

  function socialURL(value, network) {
    var v = String(value || '').trim();
    if (!v || v.indexOf('[') !== -1) return '';
    var domains = {instagram:'instagram.com',facebook:'facebook.com',youtube:'youtube.com'};
    if (!/^https?:\/\//i.test(v)) v = 'https://www.' + domains[network] + '/' + v.replace(/^[@/]+/, network === 'youtube' ? '@' : '');
    try { var u = new URL(v); return u.protocol === 'https:' ? u.href : ''; } catch (e) { return ''; }
  }

  function renderReferenceFooter() {
    $('#footerRoot').innerHTML = footer();
    var s = get('settings');
    $$('[data-social]').forEach(function (a) {
      var url = socialURL(s[a.dataset.social], a.dataset.social);
      a.href = url || '#contact';
      if (url) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      else { a.removeAttribute('target'); a.removeAttribute('rel'); }
    });
  }

  var originalHomeCopy = {};
  function applyHomeSettings() {
    var s = get('settings');
    $$('#homeHero [data-home-copy]').forEach(function (el) {
      var key = el.dataset.homeCopy;
      if (!(key in originalHomeCopy)) originalHomeCopy[key] = el.innerHTML;
      if (s[key]) el.textContent = s[key];
      else el.innerHTML = originalHomeCopy[key];
    });
  }

  function selectAdminTab(name) {
    if (!isAuthed()) return;
    activeTab = name;
    $$('#adminTabs .admin-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === name); });
    renderAdminContent();
  }

  function renderAdminHome(container) {
    container.innerHTML = '<div class="admin-home-heading"><div><span class="eyebrow left">Admin Portal</span><h2 class="font-display text-3xl text-deep font-bold mt-2">Welcome to your foundation</h2></div><button type="button" class="btn btn-blue" data-admin-go="home-editor">Edit Home Page</button></div><div id="adminHomePreview" class="admin-home-preview"></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">' +
      statCard('Photos', get('photos').length) + statCard('Videos', get('videos').length, 'text-magenta') + statCard('Daily Updates', get('updates').length, 'text-teal') + statCard('Volunteers', get('volunteers').length, 'text-leaf') + '</div>' +
      '<div class="admin-quick-actions"><button type="button" data-admin-go="photos">Upload photos <span>↗</span></button><button type="button" data-admin-go="updates">Publish an update <span>↗</span></button><button type="button" data-admin-go="inbox">Open inbox <span>↗</span></button><a href="#home">View website <span>↗</span></a></div>';
    var hero = $('#homeHero').cloneNode(true);
    hero.id = 'adminHero';
    // Repaint generated SVGs to avoid reusing gradient IDs in the same document.
    $$('[data-art]', hero).forEach(function (el) { el.innerHTML = ''; delete el.dataset.painted; });
    $$('[id]', hero).forEach(function (el) { el.id = 'admin-preview-' + el.id; });
    $$('.reveal', hero).forEach(function (el) { el.classList.add('in'); });
    var heading = $('h1', hero);
    if (heading) { var h2 = document.createElement('h2'); h2.className = heading.className; h2.innerHTML = heading.innerHTML; heading.replaceWith(h2); }
    $('#adminHomePreview').appendChild(hero);
    paintArtFrames();
  }

  function renderHomeEditor(container) {
    var s = get('settings');
    var fields = [['heroLead1','First line','Empowering'],['heroAccent1','First highlight','Communities.'],['heroLead2','Second line','Preserving'],['heroAccent2','Second highlight','Culture.']];
    container.innerHTML = '<form id="homeEditorForm" class="card p-6 sm:p-8"><span class="eyebrow left">Home Page</span><h2 class="font-display text-2xl font-bold text-deep mt-3">Make the introduction yours</h2><p class="text-ink/60 text-sm mt-3">Keep a field blank to use the original website copy. The website and admin home share the same design.</p><div class="grid sm:grid-cols-2 gap-5 mt-6">' +
      fields.map(function (f) { return '<div><label class="label" for="edit-' + f[0] + '">' + f[1] + '</label><input class="field" id="edit-' + f[0] + '" name="' + f[0] + '" maxlength="60" placeholder="' + f[2] + '" value="' + escapeAttr(s[f[0]] || '') + '"></div>'; }).join('') +
      '<div class="sm:col-span-2"><label class="label" for="edit-description">Introduction</label><textarea class="field" rows="4" id="edit-description" name="heroDescription" maxlength="1200" placeholder="Use the original introduction">' + escapeHtml(s.heroDescription || '') + '</textarea></div></div><h3 class="font-display text-xl font-bold text-deep mt-8">Verified impact figures</h3><p class="text-ink/60 text-sm mt-2">Enter only figures verified by the foundation. Blank fields show a dash.</p><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">' +
      ['Villages Reached','Lives Impacted','Programmes Running','Active Volunteers'].map(function (label, i) { return '<div><label class="label" for="impact-' + i + '">' + label + '</label><input class="field" id="impact-' + i + '" name="impact' + i + '" maxlength="20" placeholder="—" value="' + escapeAttr((s.impact || [])[i] || '') + '"></div>'; }).join('') +
      '</div><div class="flex flex-wrap gap-3 mt-7"><button class="btn btn-primary" type="submit">Save Home Page</button><button class="btn btn-outline" type="button" data-admin-go="dash">Preview Home</button></div></form>';
  }

  function renderInbox(container) {
    var messages = get('messages'), subscribers = get('subscribers');
    container.innerHTML = '<div class="grid lg:grid-cols-2 gap-6"><div class="card p-6"><h2 class="font-display text-xl font-bold text-deep">Messages (' + messages.length + ')</h2><p class="text-sm text-ink/60 mt-2">Messages submitted in this browser demo.</p><div class="space-y-4 mt-5">' +
      (messages.length ? messages.map(function (m) { return '<article class="inbox-message"><h3 class="font-semibold text-royal">' + escapeHtml(m.subject) + '</h3><p class="text-sm mt-1">' + escapeHtml(m.name) + ' · ' + escapeHtml(m.email) + '</p><p class="text-xs text-ink/60 mt-1">' + escapeHtml(formatDate(m.date)) + '</p><p class="text-sm mt-3 whitespace-pre-wrap">' + escapeHtml(m.message) + '</p></article>'; }).join('') : '<p class="text-ink/50 py-6">No messages yet.</p>') +
      '</div></div><div class="card p-6"><h2 class="font-display text-xl font-bold text-deep">Newsletter interests (' + subscribers.length + ')</h2><p class="text-sm text-ink/60 mt-2">Email addresses are stored locally. No email is sent.</p><ul class="mt-5 space-y-3">' +
      (subscribers.length ? subscribers.map(function (s) { return '<li class="text-sm break-all">' + escapeHtml(s.email) + '</li>'; }).join('') : '<li class="text-ink/50 py-6">No interests yet.</li>') + '</ul></div></div>';
  }

  function saveSubscriber(value) {
    var email = value.trim().toLowerCase();
    var subscribers = get('subscribers');
    if (subscribers.some(function (s) { return s.email === email; })) { toast('This email is already saved in this browser.', 'info'); return true; }
    subscribers.unshift({id:uid('s'),email:email,date:new Date().toISOString()});
    if (!set('subscribers', subscribers)) return false;
    toast('Newsletter interest saved in this browser demo.', 'success');
    return true;
  }

  function initSinglePage() {
    var frame;
    var publicSections = $$('.page:not([data-page="admin"])');
    function onScroll() {
      if (frame || currentPage === 'admin') return;
      frame = requestAnimationFrame(function () {
        frame = null;
        var active = 'home', offset = $('#siteHeader').offsetHeight + 90;
        publicSections.forEach(function (section) { if (section.getBoundingClientRect().top <= offset) active = section.dataset.page; });
        updateActiveNav(active);
      });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    function sizeHeader() { document.documentElement.style.setProperty('--header-height', $('#siteHeader').offsetHeight + 'px'); }
    if ('ResizeObserver' in window) new ResizeObserver(sizeHeader).observe($('#siteHeader'));
    sizeHeader();
    // Repeated anchor clicks still navigate after manual scrolling.
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (link) {
        var name = link.getAttribute('href').replace(/^#\/?/, '');
        if (PAGES.indexOf(name) !== -1 && currentHash() === name) { e.preventDefault(); showPage(name, false); }
      }
      var pause = e.target.closest('.announcement-toggle');
      if (pause) {
        var paused = !document.body.classList.contains('announcements-paused');
        document.body.classList.toggle('announcements-paused', paused);
        $$('.announcement-toggle').forEach(function (b) { b.setAttribute('aria-pressed', String(paused)); b.setAttribute('aria-label', paused ? 'Play announcements' : 'Pause announcements'); b.textContent = paused ? '▶' : 'Ⅱ'; });
      }
      var shortcut = e.target.closest('[data-admin-go]');
      if (shortcut) selectAdminTab(shortcut.dataset.adminGo);
      if (e.target.closest('[data-footer-social]')) toast('Add this social profile in Admin → Settings.', 'info');
      if (e.target.closest('[data-export-backup]') && isAuthed()) {
        var data = {}; Object.keys(SEED).forEach(function (key) { data[key] = get(key); });
        var url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}));
        var a = document.createElement('a'); a.href = url; a.download = 'sjf-demo-backup.json'; a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      }
    });
    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (form.id === 'footerNewsletterForm') { e.preventDefault(); if (saveSubscriber($('input[type=email]', form).value)) form.reset(); }
      if (form.id === 'homeEditorForm') {
        e.preventDefault(); if (!isAuthed()) return;
        var data = new FormData(form), settings = get('settings');
        ['heroLead1','heroAccent1','heroLead2','heroAccent2','heroDescription'].forEach(function (key) { settings[key] = String(data.get(key) || '').trim(); });
        settings.impact = [0,1,2,3].map(function (i) { return String(data.get('impact' + i) || '').trim(); });
        if (set('settings', settings)) { applyHomeSettings(); renderStats(); observeReveals(); toast('Home page saved in this browser.', 'success'); }
      }
    });
    window.addEventListener('storage', function (e) {
      if (e.key && e.key.indexOf(LS) !== 0) return;
      applyHomeSettings(); renderStats(); renderInitiatives(); renderVideos(); renderUpdates(); renderGalleryPage('all'); renderHomeGallery(); renderReferenceFooter(); renderSocialFeeds(); observeReveals();
      if (currentPage === 'admin') renderAdmin();
    });
    $$('#volunteerForm, #quickVolunteerForm, #newsletterForm, #newsSideForm').forEach(function (form) {
      var note = document.createElement('p'); note.className = 'form-demo-note'; note.textContent = 'Demo: saved in this browser only.'; form.appendChild(note);
    });
  }
