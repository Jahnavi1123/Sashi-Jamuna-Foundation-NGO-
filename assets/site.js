
/* ==========================================================================
   Sashi Jamuna Foundation — application script
   Single-page website with an explicitly browser-local demo admin.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));

  /* ------------------------------------------------------------------
     1. STORAGE
     ------------------------------------------------------------------ */
  const LS = 'sjf_';
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(LS + key);
        return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback == null ? null : fallback));
      } catch (e) { return JSON.parse(JSON.stringify(fallback == null ? null : fallback)); }
    },
    set(key, value) {
      try { localStorage.setItem(LS + key, JSON.stringify(value)); return true; }
      catch (e) { toast('Storage is full — remove some media items.', 'error'); return false; }
    }
  };

  /* ------------------------------------------------------------------
     2. SEED DATA (all editable placeholders — no invented facts)
     ------------------------------------------------------------------ */
  const SEED = window.SJFData.defaults;

  function get(key) { return window.SJFData.read(key); }
  function set(key, value) { return store.set(key, value); }

  /* ------------------------------------------------------------------
     3. MADHUBANI ART GENERATOR
     ------------------------------------------------------------------ */
  const MOTIF = {
    lotus: (function () {
      var p = '';
      for (var a = 0; a < 360; a += 45) {
        p += '<ellipse cx="50" cy="33" rx="7.5" ry="17" transform="rotate(' + a + ' 50 50)"/>';
      }
      return '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">' + p +
        '<circle cx="50" cy="50" r="11"/><circle cx="50" cy="50" r="4.5" fill="currentColor"/></g>';
    })(),
    fish: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">' +
      '<path d="M24 50 C36 26 70 26 84 50 C70 74 36 74 24 50 Z"/>' +
      '<path d="M24 50 L6 32 L13 50 L6 68 Z"/>' +
      '<path d="M50 34 C55 23 64 21 71 26"/>' +
      '<path d="M50 66 C55 77 64 79 71 74"/>' +
      '<path d="M34 50 q7-7 14 0"/><path d="M47 50 q7-7 14 0"/><path d="M60 50 q7-7 14 0"/>' +
      '<circle cx="72" cy="44" r="2.8" fill="currentColor"/></g>',
    sun: (function () {
      var p = '<circle cx="50" cy="50" r="19"/><circle cx="50" cy="50" r="12"/>';
      for (var i = 0; i < 16; i++) {
        var a = i * 22.5 * Math.PI / 180;
        var x1 = (50 + 22 * Math.cos(a)).toFixed(1), y1 = (50 + 22 * Math.sin(a)).toFixed(1);
        var x2 = (50 + 38 * Math.cos(a)).toFixed(1), y2 = (50 + 38 * Math.sin(a)).toFixed(1);
        var cx = (50 + 43 * Math.cos(a)).toFixed(1), cy = (50 + 43 * Math.sin(a)).toFixed(1);
        p += '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '"/>' +
             '<circle cx="' + cx + '" cy="' + cy + '" r="2.2" fill="currentColor" stroke="none"/>';
      }
      return '<g fill="none" stroke="currentColor" stroke-width="1.7">' + p +
        '<circle cx="50" cy="50" r="5" fill="currentColor" stroke="none"/></g>';
    })(),
    peacock: (function () {
      var p = '<circle cx="50" cy="36" r="30"/><circle cx="50" cy="36" r="23"/><circle cx="50" cy="36" r="16"/>';
      for (var i = 0; i < 12; i++) {
        var a = i * 30 * Math.PI / 180;
        p += '<circle cx="' + (50 + 26.5 * Math.cos(a)).toFixed(1) + '" cy="' + (36 + 26.5 * Math.sin(a)).toFixed(1) +
             '" r="2" fill="currentColor" stroke="none"/>';
      }
      return '<g fill="none" stroke="currentColor" stroke-width="1.6">' + p +
        '<ellipse cx="50" cy="70" rx="8" ry="14"/>' +
        '<path d="M50 58 C50 48 45 44 43 38"/><circle cx="42" cy="34" r="4.5"/>' +
        '<path d="M42 30 L42 24"/><path d="M38 31 L36 25"/><path d="M46 31 L48 25"/>' +
        '<path d="M46 36 L52 38"/>' +
        '<path d="M46 84 L46 94"/><path d="M54 84 L54 94"/><path d="M42 94 H58"/></g>';
    })(),
    tree: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">' +
      '<path d="M50 92 L50 44"/>' +
      '<path d="M50 60 C40 56 34 48 30 38"/><path d="M50 60 C60 56 66 48 70 38"/>' +
      '<path d="M50 44 C44 34 44 24 50 14"/><path d="M50 44 C56 34 56 24 50 14"/>' +
      '<ellipse cx="30" cy="34" rx="6" ry="4" transform="rotate(-25 30 34)"/>' +
      '<ellipse cx="70" cy="34" rx="6" ry="4" transform="rotate(25 70 34)"/>' +
      '<ellipse cx="50" cy="12" rx="6" ry="4"/>' +
      '<ellipse cx="38" cy="26" rx="5" ry="3.4" transform="rotate(-25 38 26)"/>' +
      '<ellipse cx="62" cy="26" rx="5" ry="3.4" transform="rotate(25 62 26)"/>' +
      '<path d="M50 92 C42 92 36 96 30 96"/><path d="M50 92 C58 92 64 96 70 96"/>' +
      '<path d="M22 96 H78"/></g>',
    mandala: (function () {
      var p = '<circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="33"/>' +
              '<circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="9"/>';
      for (var i = 0; i < 16; i++) {
        var a = i * 22.5 * Math.PI / 180;
        p += '<path d="M' + (50 + 22 * Math.cos(a)).toFixed(1) + ' ' + (50 + 22 * Math.sin(a)).toFixed(1) +
             ' L' + (50 + 33 * Math.cos(a)).toFixed(1) + ' ' + (50 + 33 * Math.sin(a)).toFixed(1) + '"/>' +
             '<circle cx="' + (50 + 37.5 * Math.cos(a)).toFixed(1) + '" cy="' + (50 + 37.5 * Math.sin(a)).toFixed(1) +
             '" r="2.4" fill="currentColor" stroke="none"/>';
      }
      return '<g fill="none" stroke="currentColor" stroke-width="1.6">' + p + '</g>';
    })()
  };

  const MOTIF_KEYS = ['lotus', 'fish', 'sun', 'peacock', 'tree', 'mandala'];

  const ART_PALETTES = [
    { a: '#164B8C', b: '#0B2C57', ink: '#FFF8E7', accent: '#168A45' },
    { a: '#F15A24', b: '#A83F1D', ink: '#FFF8E7', accent: '#168A45' },
    { a: '#FF8A00', b: '#C24E00', ink: '#FFF8E7', accent: '#164B8C' },
    { a: '#168642', b: '#0F6835', ink: '#FFF8E7', accent: '#168A45' },
    { a: '#2E6FC7', b: '#164B8C', ink: '#FFF8E7', accent: '#FF8A00' },
    { a: '#168A45', b: '#FF8A00', ink: '#0B2C57', accent: '#F15A24' },
    { a: '#168642', b: '#0F6835', ink: '#FFF8E7', accent: '#168A45' },
    { a: '#12203A', b: '#164B8C', ink: '#FFF8E7', accent: '#F15A24' }
  ];

  var uidCounter = 0;
  function artSVG(i, label) {
    var p = ART_PALETTES[((i % ART_PALETTES.length) + ART_PALETTES.length) % ART_PALETTES.length];
    var key = MOTIF_KEYS[((i % MOTIF_KEYS.length) + MOTIF_KEYS.length) % MOTIF_KEYS.length];
    var uid = 'art' + (++uidCounter);
    var dots = '';
    for (var q = 0; q < 4; q++) {
      var dx = (q % 2 === 0) ? 22 : 178, dy = (q < 2) ? 22 : 178;
      dots += '<circle cx="' + dx + '" cy="' + dy + '" r="3.4" fill="' + (q % 2 ? p.accent : p.ink) + '"/>';
    }
    return '<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' +
      escapeAttr(label || 'Madhubani inspired artwork') + '">' +
      '<defs><linearGradient id="' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + p.a + '"/><stop offset="1" stop-color="' + p.b + '"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#' + uid + ')"/>' +
      '<g opacity="0.14" stroke="' + p.ink + '" stroke-width="0.8" fill="none">' +
      '<path d="M0 50 H200 M0 100 H200 M0 150 H200 M50 0 V200 M100 0 V200 M150 0 V200"/></g>' +
      '<rect x="7" y="7" width="186" height="186" fill="none" stroke="' + p.accent + '" stroke-width="2" opacity="0.9"/>' +
      '<rect x="14" y="14" width="172" height="172" fill="none" stroke="' + p.ink + '" stroke-width="0.8" opacity="0.45"/>' +
      '<g transform="translate(35,35) scale(1.3)" style="color:' + p.ink + '">' + MOTIF[key] + '</g>' +
      dots +
      '</svg>';
  }

  function artThumb(item, cls, extraAttrs) {
    var label = item.caption || item.title || 'Madhubani artwork';
    if (item.src) {
      return '<img src="' + escapeAttr(safeImageURL(item.src)) + '" alt="' + escapeAttr(label) + '" loading="lazy" class="' + cls + '" ' + (extraAttrs || '') + '>';
    }
    return '<div class="' + cls + '" ' + (extraAttrs || '') + '>' + artSVG(item.art == null ? 0 : item.art, label) + '</div>';
  }

  /* ------------------------------------------------------------------
     4. UTILITIES
     ------------------------------------------------------------------ */
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function escapeAttr(s) { return escapeHtml(s); }

  function uid(prefix) {
    return (prefix || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatDate(d) {
    if (!d) return '[Add date]';
    var dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatMoney(n) {
    var v = Number(n) || 0;
    return '₹' + v.toLocaleString('en-IN');
  }

  function toast(message, type) {
    var wrap = $('#toastWrap');
    if (!wrap) return;
    var colors = {
      success: 'linear-gradient(120deg,#168642,#168642)',
      error:   'linear-gradient(120deg,#F15A24,#A83F1D)',
      warn:    'linear-gradient(120deg,#FF8A00,#C24E00)',
      info:    'linear-gradient(120deg,#164B8C,#2E6FC7)'
    };
    var el = document.createElement('div');
    el.className = 'pointer-events-auto text-white text-[.85rem] font-medium rounded-2xl px-5 py-3.5 shadow-card w-full text-center';
    el.style.background = colors[type] || colors.info;
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .35s, transform .35s';
    el.textContent = message;
    wrap.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      setTimeout(function () { el.remove(); }, 380);
    }, 3600);
  }

  function openModal(html) {
    var m = $('#modal');
    $('#modalBody').innerHTML = html;
    m.classList.remove('hidden');
    m.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    var m = $('#modal');
    m.classList.add('hidden');
    m.classList.remove('flex');
    $('#modalBody').innerHTML = '';
    document.body.style.overflow = '';
  }

  /* ------------------------------------------------------------------
     5. ICON SET
     ------------------------------------------------------------------ */
  const ICONS = {
    book:    '<path d="M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2V5Z"/><path d="M20 5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2V5Z"/>',
    heart:   '<path d="M3 12h4l2-5 3 10 2.5-6 1.5 3h5"/>',
    users:   '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
    brief:   '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4 5 5 0 0 0-5-5h-4Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>',
    leaf:    '<path d="M11 20A7 7 0 0 1 4 13c0-6 6-9 16-9 0 10-4 16-9 16Z"/><path d="M4 20c3-4 7-7 12-8"/>',
    check:   '<path d="M20 6 9 17l-5-5"/>',
    play:    '<path d="M8 5v14l11-7-11-7Z"/>',
    'arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  function icon(name, size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' +
      (color || 'currentColor') + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
      (ICONS[name] || ICONS.book) + '</svg>';
  }

  /* ------------------------------------------------------------------
     6. RENDERERS
     ------------------------------------------------------------------ */
  function initiativeCard(item, compact) {
    return '<article class="card p-6 reveal">' +
      '<span class="card-topline"></span>' +
      '<div class="flex items-start justify-between gap-4">' +
        '<span class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0" ' +
          'style="background:linear-gradient(135deg,#164B8C,#F15A24)">' + icon(item.icon, 22, '#FFF8E7') + '</span>' +
        '<span class="chip chip-gold !text-[.66rem]">' + escapeHtml(item.tag) + '</span>' +
      '</div>' +
      '<h3 class="font-display text-xl font-bold text-deep mt-5">' + escapeHtml(item.title) + '</h3>' +
      '<p class="text-ink/65 text-[.87rem] mt-2.5 leading-relaxed">' + escapeHtml(item.desc) + '</p>' +
      (compact ? '' : '<p class="mt-4 text-[.72rem] text-magenta/70 italic">Impact: ' + escapeHtml(item.stat) + '</p>') +
      '<a href="#donate" class="inline-flex items-center gap-2 text-royal font-semibold text-[.82rem] mt-5 hover:gap-3 transition-all">' +
        'Support this initiative ' + icon('arrow', 14) + '</a>' +
      '</article>';
  }

  function renderInitiatives() {
    var list = get('initiatives');
    var grid = $('#homeInitiatives');
    if (grid) grid.innerHTML = list.slice(0, 6).map(function (i) { return initiativeCard(i, false); }).join('');

    var all = $('#allInitiatives');
    if (all) {
      all.innerHTML = list.map(function (item, idx) {
        var reverse = idx % 2 === 1;
        return '<article class="grid lg:grid-cols-2 gap-8 items-center rounded-3xl bg-white border border-royal/10 p-6 sm:p-8 shadow-soft reveal ' +
          (reverse ? 'lg:[&>*:first-child]:order-2' : '') + '">' +
          '<div class="art-frame h-60 sm:h-72">' + artSVG(idx + 3, item.title) + '</div>' +
          '<div>' +
            '<span class="chip chip-magenta">' + escapeHtml(item.tag) + '</span>' +
            '<h3 class="font-display text-2xl sm:text-3xl font-bold text-deep mt-4">' + escapeHtml(item.title) + '</h3>' +
            '<p class="text-ink/70 mt-4 leading-relaxed text-[.92rem]">' + escapeHtml(item.desc) + '</p>' +
            '<div class="flex flex-wrap gap-3 mt-6">' +
              '<span class="chip chip-soft">Impact: ' + escapeHtml(item.stat) + '</span>' +
              '<span class="chip chip-teal">Ongoing programme</span>' +
            '</div>' +
            '<div class="flex flex-wrap gap-3 mt-6">' +
              '<a href="#donate" class="btn btn-primary !py-2.5 !px-5 !text-[.85rem]">Support</a>' +
              '<a href="#volunteer" class="btn btn-outline !py-2.5 !px-5 !text-[.85rem]">Volunteer</a>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join('');
    }
  }

  function renderStats() {
    var stats = [
      { label: 'Villages Reached',     icon: 'leaf',  value: null },
      { label: 'Lives Impacted',       icon: 'users', value: null },
      { label: 'Programmes Running',   icon: 'book',  value: null },
      { label: 'Active Volunteers',    icon: 'heart', value: null }
    ];
    var savedStats = get('settings').impact || [];
    stats.forEach(function (s, i) { s.value = savedStats[i] == null ? '' : String(savedStats[i]); });
    var wrap = $('#homeStats');
    if (!wrap) return;
    wrap.innerHTML = stats.map(function (s) {
      return '<div class="reveal rounded-2xl bg-cream/8 border border-cream/15 backdrop-blur p-6 text-center hover:bg-cream/12 transition">' +
        '<div class="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4" style="background:linear-gradient(135deg,rgba(22,138,69,.28),rgba(241,90,36,.28))">' +
          icon(s.icon, 22, '#168A45') + '</div>' +
        '<p class="font-display text-4xl sm:text-5xl font-bold text-gold leading-none">' + escapeHtml(s.value || '—') + '</p>' +
        '<p class="text-cream/85 text-[.82rem] font-medium mt-3">' + s.label + '</p>' +
        '<p class="text-cream/40 text-[.66rem] mt-1.5">' + (s.value ? 'Foundation impact' : 'Awaiting verified data') + '</p>' +
      '</div>';
    }).join('');
  }

  function renderVideos() {
    var list = get('videos').map(window.SJFMedia.normalize).filter(Boolean);

    function card(v, i) {
      var thumb = '<img src="' + escapeAttr(window.SJFMedia.poster(v)) + '" alt="' + escapeAttr(v.title) + '" loading="lazy" class="w-full h-full object-contain bg-deep">';
      return '<article class="card overflow-hidden reveal cursor-pointer group video-card" data-video="' + escapeAttr(v.id) + '">' +
        '<div class="relative h-48 sm:h-52 overflow-hidden">' + thumb +
          '<div class="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/10 to-transparent"></div>' +
          '<div class="absolute inset-0 flex items-center justify-center">' +
            '<span class="w-14 h-14 rounded-full bg-white/90 group-hover:bg-gradient-to-br group-hover:from-saffron group-hover:to-magenta flex items-center justify-center transition-all duration-300 group-hover:scale-110">' +
              icon('play', 20, '#164B8C') + '</span>' +
          '</div>' +
          '<span class="absolute bottom-3 left-4 chip bg-cream/20 backdrop-blur text-cream !text-[.64rem]">' +
            (v.youtube ? 'YouTube' : 'SJF Video') + '</span>' +
        '</div>' +
        '<div class="p-5">' +
          '<h3 class="font-display text-lg font-bold text-deep leading-snug">' + escapeHtml(v.title) + '</h3>' +
          '<p class="text-ink/60 text-[.83rem] mt-2 line-clamp-2">' + escapeHtml(v.desc) + '</p>' +
        '</div>' +
      '</article>';
    }

    var hv = $('#homeVideos');
    if (hv) hv.innerHTML = list.slice(0, 3).map(function (v, i) { return card(v, i); }).join('');
    var av = $('#videosGrid');
    if (av) av.innerHTML = list.map(function (v, i) { return card(v, i); }).join('');
  }

  function renderGalleryPage(filter) {
    var list = get('photos');
    var grid = $('#galleryGrid');
    if (!grid) return;
    var items = (filter && filter !== 'all')
      ? list.filter(function (p) { return p.cat === filter; })
      : list;

    if (!items.length) {
      grid.innerHTML = '<p class="col-span-full text-center text-ink/50 py-10">No media in this category yet.</p>';
      return;
    }

    grid.innerHTML = items.map(function (p) {
      return '<button type="button" class="art-tile group relative text-left w-full aspect-[4/5] border border-royal/10 shadow-soft hover:shadow-card transition-shadow gallery-item" ' +
        'data-full="' + escapeAttr(p.id) + '">' +
        artThumb(p, 'w-full h-full object-cover') +
        '<span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/90 to-transparent p-3 pt-8">' +
          '<span class="block text-cream text-[.76rem] font-medium leading-snug">' + escapeHtml(p.caption) + '</span>' +
          '<span class="block text-gold/90 text-[.62rem] uppercase tracking-wider mt-1">' + escapeHtml(p.cat) + '</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  function renderHomeGallery() {
    var list = get('photos');
    var grid = $('#homeGallery');
    if (!grid) return;
    grid.innerHTML = list.slice(0, 8).map(function (p, i) {
      var span = (i === 0 || i === 5) ? 'sm:col-span-1' : '';
      return '<button type="button" class="art-tile group relative text-left w-full aspect-square border border-royal/10 shadow-soft hover:shadow-card transition-shadow ' + span + ' gallery-item" ' +
        'data-full="' + escapeAttr(p.id) + '">' +
        artThumb(p, 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700') +
        '<span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/85 to-transparent p-2.5 pt-7 opacity-0 group-hover:opacity-100 transition-opacity">' +
          '<span class="block text-cream text-[.7rem] leading-snug line-clamp-2">' + escapeHtml(p.caption) + '</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  function renderUpdates() {
    var list = get('updates');
    var nl = $('#newsList');
    if (nl) {
      nl.innerHTML = list.map(function (u, i) {
        return '<article class="card p-6 reveal">' +
          '<span class="card-topline"></span>' +
          '<div class="flex flex-wrap items-center gap-3">' +
            '<span class="chip chip-soft">' + escapeHtml(u.cat || 'Update') + '</span>' +
            '<span class="text-[.74rem] text-ink/50">' + escapeHtml(formatDate(u.date)) + '</span>' +
            '<span class="chip chip-gold !text-[.64rem]">Editable</span>' +
          '</div>' +
          '<h3 class="font-display text-xl font-bold text-deep mt-4">' + escapeHtml(u.title) + '</h3>' +
          '<p class="text-ink/65 text-[.88rem] mt-2.5 leading-relaxed">' + escapeHtml(u.body) + '</p>' +
        '</article>';
      }).join('');
    }

    // home preview of 3 updates if a container exists
    var hp = $('#homeUpdates');
    if (hp) {
      hp.innerHTML = list.slice(0, 3).map(function (u) {
        return '<article class="card p-6 reveal"><span class="card-topline"></span>' +
          '<span class="chip chip-soft">' + escapeHtml(u.cat) + '</span>' +
          '<h3 class="font-display text-lg font-bold text-deep mt-3">' + escapeHtml(u.title) + '</h3>' +
          '<p class="text-ink/60 text-[.85rem] mt-2 line-clamp-3">' + escapeHtml(u.body) + '</p></article>';
      }).join('');
    }

    var cats = {};
    list.forEach(function (u) { cats[u.cat] = (cats[u.cat] || 0) + 1; });
    var cc = $('#newsCategories');
    if (cc) {
      cc.innerHTML = Object.keys(cats).map(function (c) {
        return '<span class="chip chip-soft">' + escapeHtml(c) + ' <span class="opacity-60">' + cats[c] + '</span></span>';
      }).join('');
    }
  }

  function renderSocialFeeds() {
    var s = get('settings');
    $$('[data-social-handle]').forEach(function (el) {
      var key = el.getAttribute('data-social-handle');
      if (s[key]) el.textContent = s[key];
    });

    var ig = $('[data-feed="instagram"]');
    if (ig) {
      ig.innerHTML = Array.from({ length: 9 }).map(function (_, i) {
        return '<div class="aspect-square art-tile">' + artSVG(i + 4, 'Instagram placeholder tile') + '</div>';
      }).join('');
    }
    var fb = $('[data-feed="facebook"]');
    if (fb) {
      fb.innerHTML = Array.from({ length: 3 }).map(function (_, i) {
        return '<div class="flex gap-3 items-center rounded-xl border border-royal/10 p-2.5">' +
          '<div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 art-tile">' + artSVG(i + 7, 'Facebook placeholder') + '</div>' +
          '<div class="min-w-0"><div class="h-2.5 w-3/4 bg-royal/12 rounded-full"></div>' +
          '<div class="h-2.5 w-1/2 bg-royal/8 rounded-full mt-2"></div></div></div>';
      }).join('');
    }
    var yt = $('[data-feed="youtube"]');
    if (yt) {
      yt.innerHTML = Array.from({ length: 3 }).map(function (_, i) {
        return '<div class="flex gap-3 items-center rounded-xl border border-royal/10 p-2.5">' +
          '<div class="w-20 h-12 rounded-lg overflow-hidden shrink-0 art-tile">' + artSVG(i + 9, 'YouTube placeholder') + '</div>' +
          '<div class="min-w-0 flex-1"><div class="h-2.5 w-full bg-royal/12 rounded-full"></div>' +
          '<div class="h-2.5 w-2/3 bg-royal/8 rounded-full mt-2"></div></div></div>';
      }).join('');
    }
  }

  function renderAboutExtras() {
    var values = [
      { t: 'Dignity', d: 'Every person we serve is treated with respect, agency and voice.', c: 'from-royal to-royalLight' },
      { t: 'Transparency', d: 'Open books, documented outcomes and honest reporting.', c: 'from-saffron to-magenta' },
      { t: 'Community First', d: 'Programmes designed with the community, never imposed on it.', c: 'from-teal to-leaf' },
      { t: 'Cultural Pride', d: 'Celebrating and preserving Bihar\u2019s Madhubani heritage.', c: 'from-gold to-saffron' }
    ];
    var vg = $('#valuesGrid');
    if (vg) {
      vg.innerHTML = values.map(function (v) {
        return '<div class="rounded-2xl bg-white border border-royal/10 p-5 hover:shadow-soft transition">' +
          '<span class="block w-9 h-9 rounded-xl bg-gradient-to-br ' + v.c + ' mb-3"></span>' +
          '<h4 class="font-semibold text-deep text-[.95rem]">' + v.t + '</h4>' +
          '<p class="text-ink/60 text-[.82rem] mt-1.5">' + v.d + '</p></div>';
      }).join('');
    }

    var milestones = [
      { y: '[YYYY]', t: 'Foundation established', d: '[Editable placeholder — describe the founding milestone.]' },
      { y: '[YYYY]', t: 'First programme launched', d: '[Editable placeholder — describe the first programme.]' },
      { y: '[YYYY]', t: 'Partnerships expanded', d: '[Editable placeholder — describe collaborations.]' },
      { y: '[YYYY]', t: 'Today', d: '[Editable placeholder — describe where the foundation stands today.]' }
    ];
    var tl = $('#timeline');
    if (tl) {
      tl.innerHTML = '<div class="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-saffron via-magenta to-royal rounded-full"></div>' +
        milestones.map(function (m, i) {
          var right = i % 2 === 0;
          return '<div class="relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-10 mb-10 reveal">' +
            (right ? '' : '<div class="hidden sm:block"></div>') +
            '<div class="' + (right ? 'sm:text-right sm:pr-4' : 'sm:order-2 sm:pl-4') + '">' +
              '<span class="chip chip-gold">' + m.y + '</span>' +
              '<h3 class="font-display text-lg font-bold text-deep mt-3">' + m.t + '</h3>' +
              '<p class="text-ink/60 text-[.85rem] mt-1.5">' + m.d + '</p>' +
            '</div>' +
            (right ? '<div class="hidden sm:block"></div>' : '') +
            '<span class="absolute left-[9px] sm:left-1/2 sm:-translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-cream border-[3px] border-magenta"></span>' +
          '</div>';
        }).join('');
    }

    var team = [
      { n: '[Name]', r: 'Founder & Chairperson' },
      { n: '[Name]', r: 'Managing Trustee' },
      { n: '[Name]', r: 'Programme Director' },
      { n: '[Name]', r: 'Field Coordinator' }
    ];
    var tg = $('#teamGrid');
    if (tg) {
      tg.innerHTML = team.map(function (t, i) {
        return '<div class="text-center reveal">' +
          '<div class="art-frame aspect-square mx-auto mb-4">' + artSVG(i + 2, 'Team member placeholder') + '</div>' +
          '<h4 class="font-semibold text-deep text-[.9rem]">' + t.n + '</h4>' +
          '<p class="text-ink/50 text-[.76rem] mt-0.5">' + t.r + '</p></div>';
      }).join('');
    }

    var steps = [
      { n: '01', t: 'Listen', d: 'We begin with community meetings to understand real needs.' },
      { n: '02', t: 'Design', d: 'Programmes are co-designed with local leaders and volunteers.' },
      { n: '03', t: 'Deliver', d: 'Field teams implement with measurable milestones and reporting.' },
      { n: '04', t: 'Review', d: 'Outcomes are reviewed openly and published for accountability.' }
    ];
    var hw = $('#howWeWork');
    if (hw) {
      hw.innerHTML = steps.map(function (s) {
        return '<div class="card p-6 reveal"><span class="card-topline"></span>' +
          '<span class="font-display text-3xl font-bold grad-text-blue">' + s.n + '</span>' +
          '<h3 class="font-display text-lg font-bold text-deep mt-3">' + s.t + '</h3>' +
          '<p class="text-ink/60 text-[.85rem] mt-2">' + s.d + '</p></div>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------------
     7. ART PLACEHOLDERS INTO THE DOM
     ------------------------------------------------------------------ */
  function paintArtFrames() {
    $$('[data-art]').forEach(function (el) {
      if (el.dataset.painted === '1') return;
      var i = parseInt(el.getAttribute('data-art'), 10) || 0;
      el.innerHTML = artSVG(i, el.getAttribute('data-label') || 'Madhubani inspired artwork');
      el.dataset.painted = '1';
    });
  }

  /* ------------------------------------------------------------------
     8. ROUTER
     ------------------------------------------------------------------ */
  var PAGES = ['home', 'about', 'initiatives', 'gallery', 'videos', 'news', 'donate', 'volunteer', 'contact', 'admin'];
  var currentPage = 'home';

  function updateActiveNav(name) {
    $$('[data-nav]').forEach(function (a) {
      var active = a.getAttribute('data-nav') === name;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  function showPage(name, skipScroll) {
    if (PAGES.indexOf(name) === -1) name = 'home';
    if (name !== 'admin') { location.assign('3.html#' + name); return; }
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

  function currentHash() {
    return (location.hash || '#admin').replace(/^#\/?/, '') || 'home';
  }

  function closeMobileMenu() {
    var m = $('#mobileMenu');
    if (m) { m.classList.add('hidden'); }
    var b = $('#menuBtn');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------------
     9. SCROLL REVEAL
     ------------------------------------------------------------------ */
  var revealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    : null;

  function observeReveals() {
    if (!revealObserver) {
      $$('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    $$('.reveal:not(.in)').forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     10. ADMIN DASHBOARD
     ------------------------------------------------------------------ */
  var adminAuthed = false;
  var authenticatedVersion = '';
  var activeTab = 'dash';

  function isAuthed() {
    var version = window.SJFAccount.version();
    if (version === 'unavailable') return false;
    try {
      var session = sessionStorage.getItem('sjf_admin');
      return (adminAuthed && authenticatedVersion === version) || session === 'v:' + version || (version === 'default' && session === '1');
    } catch (e) { return adminAuthed && authenticatedVersion === version; }
  }

  function rememberAdminSession() {
    adminAuthed = true;
    authenticatedVersion = window.SJFAccount.version();
    try { sessionStorage.setItem('sjf_admin', 'v:' + authenticatedVersion); } catch (e) {}
  }

  function renderAdmin() {
    var loggedIn = isAuthed();
    var login = $('#adminLogin');
    var panel = $('#adminPanel');
    if (!login || !panel) return;

    if (loggedIn) {
      login.classList.add('hidden');
      panel.classList.remove('hidden');
      renderAdminContent();
    } else {
      login.classList.remove('hidden');
      panel.classList.add('hidden');
    }
  }

  function statCard(label, value, tone) {
    return '<div class="card p-5"><span class="card-topline"></span>' +
      '<p class="text-[.72rem] uppercase tracking-wider text-ink/50 font-semibold">' + label + '</p>' +
      '<p class="font-display text-3xl font-bold mt-2 ' + (tone || 'text-royal') + '">' + value + '</p></div>';
  }

  function renderAdminContent() {
    var c = $('#adminContent');
    if (!c) return;
    var s = get('settings');
    var photos = get('photos');
    var videos = get('videos');
    var updates = get('updates');
    var initiatives = get('initiatives');
    var volunteers = get('volunteers');
    var donations = get('donations');

    var totalDonations = donations.filter(function (d) { return d.status === 'paid'; }).reduce(function (a, d) { return a + (Number(d.amount) || 0); }, 0);

    if (activeTab === 'dash') {
      renderAdminHome(c);
      return;
    }
    if (activeTab === 'home-editor') {
      renderHomeEditor(c);
      return;
    }
    if (activeTab === 'impact') { renderImpactEditor(c); return; }
    if (activeTab === 'account') { renderAccountEditor(c); return; }
    if (activeTab === 'inbox') {
      renderInbox(c);
      return;
    }

    if (activeTab === 'photos') {
      c.innerHTML =
        '<div class="grid lg:grid-cols-[380px_1fr] gap-6">' +
          '<div class="card p-6 h-fit"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep">Upload Photo</h3>' +
            '<form id="photoForm" class="mt-4 space-y-4">' +
              '<div><label class="label">Image file(s)</label>' +
                '<input class="field !py-2.5" type="file" id="photoFile" accept="image/*" multiple></div>' +
              '<div><label class="label">Or image URL</label>' +
                '<input class="field" id="photoUrl" placeholder="https://..."></div>' +
              '<div><label class="label">Caption</label>' +
                '<input class="field" id="photoCaption" required placeholder="Photo caption"></div>' +
              '<div><label class="label">Category</label>' +
                '<select class="field" id="photoCat">' +
                  '<option value="education">Education</option><option value="health">Health</option>' +
                  '<option value="culture">Culture</option><option value="community">Community</option></select></div>' +
              '<button class="btn btn-primary w-full" type="submit">Add Photo</button>' +
            '</form>' +
            '<p class="text-[.7rem] text-ink/45 mt-3">Images are resized to 900px and saved in this browser. Use smaller files if browser storage is full.</p>' +
          '</div>' +
          '<div class="card p-6"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep mb-4">Photo Library (' + photos.length + ')</h3>' +
            '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">' +
              photos.map(function (p) {
                return '<div class="relative group rounded-xl overflow-hidden border border-royal/10 aspect-square">' +
                  artThumb(p, 'w-full h-full object-cover') +
                  '<button type="button" class="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/95 text-magenta opacity-0 group-hover:opacity-100 transition flex items-center justify-center" data-del-photo="' + p.id + '" aria-label="Delete">' +
                    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
                  '<div class="absolute inset-x-0 bottom-0 bg-deep/85 p-2"><p class="text-cream text-[.62rem] leading-tight line-clamp-2">' + escapeHtml(p.caption) + '</p></div>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    if (activeTab === 'videos') {
      c.innerHTML =
        '<div class="grid lg:grid-cols-[380px_1fr] gap-6">' +
          '<div class="card p-6 h-fit"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep">Add Video</h3>' +
            '<form id="videoForm" class="mt-4 space-y-4">' +
              '<div><label class="label">Title</label><input class="field" id="vidTitle" required placeholder="Video title"></div>' +
              '<div><label class="label">YouTube URL or ID</label><input class="field" id="vidYoutube" required placeholder="https://youtube.com/watch?v=..."></div>' +
              '<div><label class="label">Description</label><textarea class="field" id="vidDesc" rows="3" placeholder="Short description"></textarea></div>' +
              '<button class="btn btn-primary w-full" type="submit">Add Video</button>' +
            '</form>' +
          '</div>' +
          '<div class="card p-6"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep mb-4">Video Library (' + videos.length + ')</h3>' +
            '<div class="space-y-3">' +
              videos.map(function (v) {
                return '<div class="admin-video-item flex items-center gap-4 rounded-xl border border-royal/10 p-3">' +
                  '<div class="w-24 h-16 rounded-lg overflow-hidden shrink-0 art-tile">' +
                    '<img class="w-full h-full object-contain bg-deep" src="' + escapeAttr(window.SJFMedia.poster(v)) + '" alt="" loading="lazy">' +
                  '</div>' +
                  '<div class="min-w-0 flex-1"><p class="font-medium text-deep text-[.88rem] truncate">' + escapeHtml(v.title) + '</p>' +
                    '<p class="text-ink/50 text-[.76rem] truncate">' + (v.youtube ? 'YouTube' : 'SJF video · ' + window.SJFMedia.duration(v.duration)) + '</p></div>' +
                  '<button type="button" class="btn btn-outline !px-3 !py-2 !text-xs video-card" data-video="' + escapeAttr(v.id) + '" aria-label="Preview ' + escapeAttr(v.title) + '">Play</button>' +
                  '<button type="button" class="w-8 h-8 rounded-lg bg-magenta/10 text-magenta flex items-center justify-center shrink-0" data-del-video="' + escapeAttr(v.id) + '" aria-label="Delete">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    if (activeTab === 'updates') {
      c.innerHTML =
        '<div class="grid lg:grid-cols-[380px_1fr] gap-6">' +
          '<div class="card p-6 h-fit"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep">Publish Update</h3>' +
            '<form id="updateForm" class="mt-4 space-y-4">' +
              '<div><label class="label">Title</label><input class="field" id="upTitle" required placeholder="Update headline"></div>' +
              '<div><label class="label">Date</label><input class="field" type="date" id="upDate"></div>' +
              '<div><label class="label">Category</label>' +
                '<select class="field" id="upCat">' +
                  '<option>Education</option><option>Health</option><option>Culture</option>' +
                  '<option>Community</option><option>Environment</option><option>Skills</option></select></div>' +
              '<div><label class="label">Body</label><textarea class="field" id="upBody" rows="5" required placeholder="Write the update..."></textarea></div>' +
              '<button class="btn btn-primary w-full" type="submit">Publish</button>' +
            '</form>' +
          '</div>' +
          '<div class="card p-6"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep mb-4">Published Updates (' + updates.length + ')</h3>' +
            '<div class="space-y-3">' +
              updates.map(function (u) {
                return '<div class="rounded-xl border border-royal/10 p-4 flex items-start gap-4">' +
                  '<div class="min-w-0 flex-1">' +
                    '<div class="flex flex-wrap gap-2 items-center mb-2">' +
                      '<span class="chip chip-soft !text-[.64rem]">' + escapeHtml(u.cat) + '</span>' +
                      '<span class="text-[.72rem] text-ink/45">' + escapeHtml(formatDate(u.date)) + '</span></div>' +
                    '<p class="font-medium text-deep text-[.9rem]">' + escapeHtml(u.title) + '</p>' +
                    '<p class="text-ink/55 text-[.8rem] mt-1">' + escapeHtml(u.body) + '</p>' +
                  '</div>' +
                  '<button type="button" class="w-8 h-8 rounded-lg bg-magenta/10 text-magenta flex items-center justify-center shrink-0" data-del-update="' + u.id + '" aria-label="Delete">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    if (activeTab === 'initiatives') {
      c.innerHTML =
        '<div class="grid lg:grid-cols-[380px_1fr] gap-6">' +
          '<div class="card p-6 h-fit"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep">Add Initiative</h3>' +
            '<form id="initForm" class="mt-4 space-y-4">' +
              '<div><label class="label">Title</label><input class="field" id="iniTitle" required placeholder="Initiative name"></div>' +
              '<div><label class="label">Tag / Hindi label</label><input class="field" id="iniTag" placeholder="e.g. Shiksha"></div>' +
              '<div><label class="label">Icon</label><select class="field" id="iniIcon">' +
                '<option value="book">Book</option><option value="heart">Health</option>' +
                '<option value="users">People</option><option value="brief">Work</option>' +
                '<option value="palette">Art</option><option value="leaf">Environment</option></select></div>' +
              '<div><label class="label">Impact figure (placeholder)</label><input class="field" id="iniStat" placeholder="[Add verified figure]"></div>' +
              '<div><label class="label">Description</label><textarea class="field" id="iniDesc" rows="4" required placeholder="Describe the initiative"></textarea></div>' +
              '<button class="btn btn-primary w-full" type="submit">Add Initiative</button>' +
            '</form>' +
          '</div>' +
          '<div class="card p-6"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep mb-4">Current Initiatives (' + initiatives.length + ')</h3>' +
            '<div class="space-y-3">' +
              initiatives.map(function (it) {
                return '<div class="rounded-xl border border-royal/10 p-4 flex items-start gap-4">' +
                  '<span class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style="background:linear-gradient(135deg,#164B8C,#F15A24)">' + icon(it.icon, 18, '#FFF8E7') + '</span>' +
                  '<div class="min-w-0 flex-1">' +
                    '<p class="font-medium text-deep text-[.9rem]">' + escapeHtml(it.title) +
                      ' <span class="chip chip-gold !text-[.6rem] ml-1">' + escapeHtml(it.tag) + '</span></p>' +
                    '<p class="text-ink/55 text-[.8rem] mt-1">' + escapeHtml(it.desc) + '</p></div>' +
                  '<button type="button" class="w-8 h-8 rounded-lg bg-magenta/10 text-magenta flex items-center justify-center shrink-0" data-del-init="' + it.id + '" aria-label="Delete">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    if (activeTab === 'volunteers') {
      c.innerHTML =
        '<div class="card p-6"><span class="card-topline"></span>' +
          '<div class="flex flex-wrap items-center justify-between gap-3 mb-4">' +
            '<h3 class="font-display text-lg font-bold text-deep">Volunteer Registrations (' + volunteers.length + ')</h3>' +
            '<button type="button" id="exportVolunteers" class="btn btn-outline !py-2 !px-4 !text-[.8rem]">Export CSV</button>' +
          '</div>' +
          (volunteers.length
            ? '<div class="scroll-x"><table class="w-full text-[.82rem] min-w-[720px]">' +
                '<thead><tr class="text-left text-ink/50 uppercase text-[.68rem] tracking-wider border-b border-royal/10">' +
                  '<th class="py-2.5 pr-3">Name</th><th class="py-2.5 pr-3">Phone</th><th class="py-2.5 pr-3">Email</th>' +
                  '<th class="py-2.5 pr-3">City</th><th class="py-2.5 pr-3">Area</th><th class="py-2.5 pr-3">Commitment</th><th class="py-2.5"></th></tr></thead><tbody>' +
                volunteers.map(function (v) {
                  return '<tr class="border-b border-royal/5">' +
                    '<td class="py-3 pr-3 font-medium text-deep">' + escapeHtml(v.name) + '</td>' +
                    '<td class="py-3 pr-3 text-ink/65">' + escapeHtml(v.phone) + '</td>' +
                    '<td class="py-3 pr-3 text-ink/65">' + escapeHtml(v.email) + '</td>' +
                    '<td class="py-3 pr-3 text-ink/65">' + escapeHtml(v.city || '—') + '</td>' +
                    '<td class="py-3 pr-3"><span class="chip chip-soft !text-[.62rem]">' + escapeHtml(v.area) + '</span></td>' +
                    '<td class="py-3 pr-3 text-ink/65">' + escapeHtml(v.commit || '—') + '</td>' +
                    '<td class="py-3"><button type="button" class="text-magenta text-[.72rem] font-semibold" data-del-volunteer="' + v.id + '">Remove</button></td>' +
                  '</tr>';
                }).join('') +
              '</tbody></table></div>'
            : '<p class="text-ink/50 text-[.88rem] py-8 text-center">No volunteer registrations yet.</p>') +
        '</div>';
      return;
    }

    if (activeTab === 'donations') {
      c.innerHTML =
        '<div class="grid sm:grid-cols-3 gap-4 mb-6">' +
          statCard('Total Records', donations.length) +
          statCard('Recorded as received', formatMoney(totalDonations), 'text-leaf') +
          statCard('Payment mode', 'Demo only', 'text-royal') +
        '</div>' +
        '<div class="card p-6"><span class="card-topline"></span>' +
          '<div class="flex flex-wrap items-center justify-between gap-3 mb-4">' +
            '<h3 class="font-display text-lg font-bold text-deep">Donation Records</h3>' +
            '<div class="flex gap-2">' +
              '<button type="button" id="addDonation" class="btn btn-blue !py-2 !px-4 !text-[.8rem]">Add Manual Entry</button>' +
              '<button type="button" id="exportDonations" class="btn btn-outline !py-2 !px-4 !text-[.8rem]">Export CSV</button>' +
            '</div>' +
          '</div>' +
          (donations.length
            ? '<div class="scroll-x"><table class="w-full text-[.82rem] min-w-[760px]">' +
                '<thead><tr class="text-left text-ink/50 uppercase text-[.68rem] tracking-wider border-b border-royal/10">' +
                  '<th class="py-2.5 pr-3">Date</th><th class="py-2.5 pr-3">Donor</th><th class="py-2.5 pr-3">Amount</th>' +
                  '<th class="py-2.5 pr-3">Purpose</th><th class="py-2.5 pr-3">Status</th><th class="py-2.5 pr-3">Ref</th><th class="py-2.5"></th></tr></thead><tbody>' +
                donations.map(function (d) {
                  var statusColor = d.status === 'paid' ? 'chip-teal' : (d.status === 'failed' ? 'chip-magenta' : 'chip-gold');
                  return '<tr class="border-b border-royal/5">' +
                    '<td class="py-3 pr-3 text-ink/60">' + escapeHtml(d.date ? formatDate(d.date) : '—') + '</td>' +
                    '<td class="py-3 pr-3 font-medium text-deep">' + escapeHtml(d.name) + '<br><span class="text-ink/45 text-[.72rem] font-normal">' + escapeHtml(d.email || '') + '</span></td>' +
                    '<td class="py-3 pr-3 font-semibold text-deep">' + formatMoney(d.amount) + '</td>' +
                    '<td class="py-3 pr-3 text-ink/65">' + escapeHtml(d.purpose || '—') + '</td>' +
                    '<td class="py-3 pr-3"><span class="chip ' + statusColor + ' !text-[.62rem]">' + escapeHtml(d.status || 'pending') + '</span></td>' +
                    '<td class="py-3 pr-3 text-ink/45 text-[.72rem]">' + escapeHtml(d.ref || '—') + '</td>' +
                    '<td class="py-3"><button type="button" class="text-magenta text-[.72rem] font-semibold" data-del-donation="' + d.id + '">Remove</button></td>' +
                  '</tr>';
                }).join('') +
              '</tbody></table></div>'
            : '<p class="text-ink/50 text-[.88rem] py-8 text-center">No donations recorded yet.</p>') +
        '</div>';
      return;
    }

    if (activeTab === 'settings') {
      c.innerHTML =
        '<div class="grid lg:grid-cols-2 gap-6">' +
          '<div class="card p-6"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep">Contact &amp; Social Settings</h3>' +
            '<p class="text-ink/60 text-[.85rem] mt-2">Update the contact details and social links used in the footer. Changes are saved in this browser.</p>' +
            '<form id="settingsForm" class="mt-5 space-y-4">' +
              '<div><label class="label" for="setAddress">Address</label><input class="field" id="setAddress" value="' + escapeAttr(s.address || '') + '"></div>' +
              '<div><label class="label" for="setEmail">Email</label><input class="field" type="email" id="setEmail" value="' + escapeAttr(s.email || 'info@sashijamunafoundation.org') + '"></div>' +
              '<div><label class="label" for="setPhone">Phone</label><input class="field" id="setPhone" value="' + escapeAttr(s.phone || '') + '"></div>' +
              '<div><label class="label">Instagram handle</label>' +
                '<input class="field" id="setIg" value="' + escapeAttr(s.instagram || '') + '"></div>' +
              '<div><label class="label">Facebook page</label>' +
                '<input class="field" id="setFb" value="' + escapeAttr(s.facebook || '') + '"></div>' +
              '<div><label class="label">YouTube channel</label>' +
                '<input class="field" id="setYt" value="' + escapeAttr(s.youtube || '') + '"></div>' +
              '<button class="btn btn-primary w-full" type="submit">Save Settings</button>' +
            '</form>' +
          '</div>' +
          '<div class="card p-6"><h3 class="font-display text-lg font-bold text-deep">Your demo workspace</h3><p class="text-ink/60 text-sm mt-3">Photos, updates, enquiries and settings are saved on this device. Export a backup before clearing your browser data.</p><button type="button" class="btn btn-blue mt-5" data-export-backup>Export backup</button><p class="text-ink/60 text-sm mt-4">Donations record interest only. No payment or email is sent from this demo.</p></div>' +
          '<div class="card p-6 lg:col-span-2"><span class="card-topline"></span>' +
            '<h3 class="font-display text-lg font-bold text-deep">Data Management</h3>' +
            '<p class="text-ink/60 text-[.85rem] mt-2">Reset all locally stored demo content back to the seeded placeholders.</p>' +
            '<button type="button" id="resetData" class="btn btn-outline mt-4 !text-[.85rem]">Reset All Local Data</button>' +
          '</div>' +
        '</div>';
      return;
    }
  }

  /* ------------------------------------------------------------------
     11. CSV EXPORT
     ------------------------------------------------------------------ */
  function downloadCSV(filename, rows) {
    if (!rows.length) { toast('Nothing to export yet.', 'warn'); return; }
    var headers = Object.keys(rows[0]);
    var csv = headers.join(',') + '\n' + rows.map(function (r) {
      return headers.map(function (h) {
        var v = r[h] == null ? '' : String(r[h]);
        if (/^[=+@\-\t\r]/.test(v)) v = "'" + v;
        return '"' + v.replace(/"/g, '""') + '"';
      }).join(',');
    }).join('\n');

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('CSV exported.', 'success');
  }

  /* ------------------------------------------------------------------
     12. IMAGE PROCESSING
     ------------------------------------------------------------------ */
  function fileToResizedDataURL(file, maxWidth, quality) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var scale = Math.min(1, maxWidth / img.width);
          var w = Math.round(img.width * scale);
          var h = Math.round(img.height * scale);
          var canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          try { resolve(canvas.toDataURL('image/jpeg', quality || 0.72)); }
          catch (err) { resolve(e.target.result); }
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ------------------------------------------------------------------
     13. RAZORPAY
     ------------------------------------------------------------------ */
  function getRazorpayKey() {
    var s = get('settings');
    return (s.razorpayKey || '').trim();
  }

  function updateRazorpayStatus() {
    var el = $('#razorpayStatusText');
    if (el) el.textContent = 'Demo mode — no payments are processed.';
  }

  /* ------------------------------------------------------------------
     14. EVENT WIRING
     ------------------------------------------------------------------ */
  function init() {
    renderReferenceFooter();
    applyHomeSettings();
    initSinglePage();

    paintArtFrames();
    renderInitiatives();
    renderStats();
    renderVideos();
    renderGalleryPage('all');
    renderHomeGallery();
    renderUpdates();
    renderSocialFeeds();
    renderAboutExtras();
    updateRazorpayStatus();
    observeReveals();

    // Initial route
    showPage(currentHash(), true);

    window.addEventListener('hashchange', function () {
      showPage(currentHash(), false);
      paintArtFrames();
      // re-paint any newly visible page content
      setTimeout(paintArtFrames, 40);
      setTimeout(observeReveals, 60);
    });

    // Header shadow on scroll
    window.addEventListener('scroll', function () {
      var shell = $('#navShell');
      if (!shell) return;
      if (window.scrollY > 12) shell.classList.add('shadow-soft');
      else shell.classList.remove('shadow-soft');
    }, { passive: true });

    // Mobile menu
    var menuBtn = $('#menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        var m = $('#mobileMenu');
        var open = !m.classList.contains('hidden');
        m.classList.toggle('hidden', open);
        menuBtn.setAttribute('aria-expanded', String(!open));
      });
    }
    $$('.mob-link').forEach(function (a) {
      a.addEventListener('click', closeMobileMenu);
    });

    // Modal close
    document.addEventListener('click', function (e) {
      var closer = e.target.closest('[data-close="modal"]');
      if (closer) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Gallery filter
    var filterWrap = $('#galleryFilters');
    if (filterWrap) {
      filterWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('.gallery-filter');
        if (!btn) return;
        $$('.gallery-filter').forEach(function (b) {
          b.classList.remove('btn-blue', 'active');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-blue', 'active');
        renderGalleryPage(btn.getAttribute('data-filter'));
      });
    }

    // Lightbox (delegated)
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (item) {
        var id = item.getAttribute('data-full');
        var list = get('photos');
        var p = list.filter(function (x) { return x.id === id; })[0];
        if (!p) return;
        var media = p.src
          ? '<img src="' + escapeAttr(safeImageURL(p.src)) + '" alt="' + escapeAttr(p.caption) + '" class="w-full max-h-[70vh] object-contain bg-deep">'
          : '<div class="w-full aspect-[4/3]">' + artSVG(p.art == null ? 0 : p.art, p.caption) + '</div>';
        openModal(media +
          '<div class="p-6"><span class="chip chip-soft">' + escapeHtml(p.cat) + '</span>' +
          '<h3 class="font-display text-xl font-bold text-deep mt-3">' + escapeHtml(p.caption) + '</h3>' +
          '<p class="text-ink/50 text-[.78rem] mt-2">Placeholder media — replace with a real photograph from the admin dashboard.</p></div>');
        return;
      }

      var vcard = e.target.closest('.video-card');
      if (vcard) {
        var vid = vcard.getAttribute('data-video');
        var vids = get('videos');
        var v = vids.filter(function (x) { return x.id === vid; })[0];
        if (!v) return;
        openModal('<div id="adminVideoPlayer" class="aspect-video bg-deep relative"></div>' +
          '<div class="p-6"><h3 class="font-display text-xl font-bold text-deep">' + escapeHtml(v.title) + '</h3>' +
          '<p class="text-ink/60 text-[.88rem] mt-2">' + escapeHtml(v.desc) + '</p></div>');
        window.SJFMedia.mount($('#adminVideoPlayer'),v);
        return;
      }
    });

    // Donation amount chips
    var amountChips = $('#amountChips');
    var selectedAmount = 1000;
    if (amountChips) {
      amountChips.addEventListener('click', function (e) {
        var chip = e.target.closest('.amount-chip');
        if (!chip) return;
        $$('.amount-chip').forEach(function (c) { c.classList.remove('selected'); });
        chip.classList.add('selected');
        var val = chip.getAttribute('data-amount');
        if (val === 'custom') {
          $('#customAmountWrap').classList.remove('hidden');
          $('#customAmount').focus();
          selectedAmount = 0;
        } else {
          $('#customAmountWrap').classList.add('hidden');
          selectedAmount = Number(val);
        }
      });
    }

    // Donation submit
    var donateForm = $('#donateForm');
    if (donateForm) {
      donateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var custom = $('#customAmount');
        var amount = selectedAmount;
        if (!amount && custom && custom.value) amount = Number(custom.value);
        if (!amount || amount < 1) { toast('Please choose or enter a donation amount.', 'warn'); return; }

        var donor = {
          name: $('#dName').value.trim(),
          email: $('#dEmail').value.trim(),
          phone: $('#dPhone').value.trim(),
          pan: $('#dPan').value.trim(),
          purpose: $('#dPurpose').value
        };

        var donations = get('donations');
        var ref = 'LOCAL-' + Date.now().toString(36).toUpperCase();
        donations.unshift({
          id: uid('d'), date: new Date().toISOString(), name: donor.name, email: donor.email,
          phone: donor.phone, amount: amount, purpose: donor.purpose, status: 'pending', ref: ref
        });
        if (!set('donations', donations)) return;
        toast('Donation interest saved in this browser. No payment was processed.', 'info');

        donateForm.reset();
        selectedAmount = 1000;
        $$('.amount-chip').forEach(function (c) { c.classList.toggle('selected', c.dataset.amount === '1000'); });
        $('#customAmountWrap').classList.add('hidden');
      });
    }

    // Volunteer form
    function handleVolunteer(fields) {
      var vols = get('volunteers');
      vols.unshift({
        id: uid('v'), createdAt: new Date().toISOString(),
        name: fields.name, email: fields.email, phone: fields.phone,
        city: fields.city, age: fields.age, area: fields.area,
        commit: fields.commit, mode: fields.mode, skills: fields.skills
      });
      if (set('volunteers', vols)) {
        toast('Volunteer registration saved in this browser demo.', 'success');
        return true;
      }
    }

    var vForm = $('#volunteerForm');
    if (vForm) {
      vForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!handleVolunteer({
          name: $('#vName').value.trim(), phone: $('#vPhone').value.trim(),
          email: $('#vEmail').value.trim(), city: $('#vCity').value.trim(),
          age: $('#vAge').value, area: $('#vArea').value,
          commit: $('#vCommit').value, mode: $('#vMode').value,
          skills: $('#vSkills').value.trim()
        })) return;
        vForm.reset();
      });
    }

    var qvForm = $('#quickVolunteerForm');
    if (qvForm) {
      qvForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!handleVolunteer({
          name: $('#qvName').value.trim(), phone: $('#qvPhone').value.trim(),
          email: $('#qvEmail').value.trim(), city: '', age: '',
          area: $('#qvArea').value, commit: '', mode: '', skills: ''
        })) return;
        qvForm.reset();
      });
    }

    // Newsletter forms
    ['#newsletterForm', '#newsSideForm'].forEach(function (sel) {
      var f = $(sel);
      if (f) {
        f.addEventListener('submit', function (e) {
          e.preventDefault();
          if (saveSubscriber($('input[type=email]', f).value)) f.reset();
        });
      }
    });

    // Contact form
    var cForm = $('#contactForm');
    if (cForm) {
      cForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var messages = get('messages');
        messages.unshift({id:uid('m'),date:new Date().toISOString(),name:$('#cName').value.trim(),phone:$('#cPhone').value.trim(),email:$('#cEmail').value.trim(),subject:$('#cSubject').value,message:$('#cMessage').value.trim()});
        if (set('messages', messages)) { toast('Message saved in the demo inbox on this browser.', 'success'); cForm.reset(); }
      });
    }

    // Admin login
    var loginForm = $('#adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var submitButton = $('button[type="submit"]', loginForm);
        if (submitButton.disabled) return;
        submitButton.disabled = true;
        var u = $('#adminUser').value.trim();
        var p = $('#adminPass').value;
        try {
          if (await window.SJFAccount.verify(u, p)) {
            rememberAdminSession();
            $('#adminPass').value = '';
            toast('Welcome back, administrator.', 'success');
            renderAdmin();
          } else { toast('Invalid username or password.', 'error'); }
        } catch (err) { toast(err.message || 'Sign in could not be completed.', 'error'); }
        finally { submitButton.disabled = false; }
      });
    }

    var logoutBtn = $('#adminLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        adminAuthed = false;
        try { sessionStorage.removeItem('sjf_admin'); } catch (e) {}
        toast('Signed out.', 'info');
        renderAdmin();
      });
    }

    // Admin tabs
    var tabs = $('#adminTabs');
    if (tabs) {
      tabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.admin-tab');
        if (!btn) return;
        $$('.admin-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeTab = btn.getAttribute('data-tab');
        renderAdminContent();
      });
    }

    // Admin content delegation
    var adminContent = $('#adminContent');
    if (adminContent) {
      adminContent.addEventListener('submit', async function (e) {
        var form = e.target;
        if (!isAuthed()) { e.preventDefault(); renderAdmin(); return; }

        // ---- Photos
        if (form.id === 'photoForm') {
          e.preventDefault();
          var fileInput = $('#photoFile');
          var urlVal = $('#photoUrl').value.trim();
          if (urlVal && !safeImageURL(urlVal)) { toast('Use an https image URL.', 'warn'); return; }
          var caption = $('#photoCaption').value.trim();
          var cat = $('#photoCat').value;
          var photos = get('photos');
          var added = 0;

          if (fileInput.files && fileInput.files.length) {
            for (var i = 0; i < fileInput.files.length; i++) {
              try {
                var dataUrl = await fileToResizedDataURL(fileInput.files[i], 900, 0.72);
                photos.unshift({
                  id: uid('p'), caption: caption || fileInput.files[i].name.replace(/\.[^.]+$/, ''),
                  cat: cat, art: 0, src: dataUrl
                });
                added++;
              } catch (err) { /* skip broken file */ }
            }
          } else if (urlVal) {
            photos.unshift({ id: uid('p'), caption: caption, cat: cat, art: 0, src: urlVal });
            added++;
          } else {
            toast('Choose a file or paste an image URL.', 'warn');
            return;
          }

          if (!added) { toast('No image could be read. Choose a supported image file.', 'error'); return; }
          if (set('photos', photos)) {
            toast(added + ' photo(s) added.', 'success');
            renderAdminContent();
            renderGalleryPage('all');
            renderHomeGallery();
            observeReveals();
          }
          form.reset();
          return;
        }

        // ---- Videos
        if (form.id === 'videoForm') {
          e.preventDefault();
          var title = $('#vidTitle').value.trim();
          var yt = $('#vidYoutube').value.trim();
          var desc = $('#vidDesc').value.trim();
          var id = '';
          if (yt) {
            var m = yt.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
            id = m ? m[1] : yt;
            if (!/^[A-Za-z0-9_-]{11}$/.test(id)) { toast('Enter a valid YouTube URL or 11-character video ID.', 'warn'); return; }
          }
          var videos = get('videos');
          videos.unshift({ id: uid('v'), title: title, desc: desc, youtube: id });
          if (set('videos', videos)) {
            toast('Video added.', 'success');
            renderAdminContent(); renderVideos(); observeReveals();
          }
          form.reset();
          return;
        }

        // ---- Updates
        if (form.id === 'updateForm') {
          e.preventDefault();
          var updates = get('updates');
          updates.unshift({
            id: uid('u'),
            title: $('#upTitle').value.trim(),
            body: $('#upBody').value.trim(),
            cat: $('#upCat').value,
            date: $('#upDate').value || new Date().toISOString().slice(0, 10)
          });
          if (set('updates', updates)) {
            toast('Update published.', 'success');
            renderAdminContent(); renderUpdates(); observeReveals();
          }
          form.reset();
          return;
        }

        // ---- Initiatives
        if (form.id === 'initForm') {
          e.preventDefault();
          var list = get('initiatives');
          list.unshift({
            id: uid('i'),
            title: $('#iniTitle').value.trim(),
            tag: $('#iniTag').value.trim() || 'Programme',
            icon: $('#iniIcon').value,
            stat: $('#iniStat').value.trim() || '[Add verified figure]',
            desc: $('#iniDesc').value.trim()
          });
          if (set('initiatives', list)) {
            toast('Initiative added.', 'success');
            renderAdminContent(); renderInitiatives(); renderReferenceFooter(); observeReveals();
          }
          form.reset();
          return;
        }

        // ---- Settings
        if (form.id === 'settingsForm') {
          e.preventDefault();
          var s = get('settings');
          s.address = $('#setAddress').value.trim();
          s.email = $('#setEmail').value.trim();
          s.phone = $('#setPhone').value.trim();
          s.instagram = $('#setIg').value.trim();
          s.facebook = $('#setFb').value.trim();
          s.youtube = $('#setYt').value.trim();
          if (set('settings', s)) {
            toast('Settings saved.', 'success');
            updateRazorpayStatus();
            renderSocialFeeds();
            renderReferenceFooter();
            renderAdminContent();
          }
          return;
        }
      });

      adminContent.addEventListener('click', function (e) {
        if (!isAuthed()) return;
        var delPhoto = e.target.closest('[data-del-photo]');
        if (delPhoto) {
          var pid = delPhoto.getAttribute('data-del-photo');
          set('photos', get('photos').filter(function (p) { return p.id !== pid; }));
          toast('Photo removed.', 'info');
          renderAdminContent(); renderGalleryPage('all'); renderHomeGallery();
          return;
        }

        var delVideo = e.target.closest('[data-del-video]');
        if (delVideo) {
          var vid = delVideo.getAttribute('data-del-video');
          set('videos', get('videos').filter(function (v) { return v.id !== vid; }));
          toast('Video removed.', 'info');
          renderAdminContent(); renderVideos();
          return;
        }

        var delUpdate = e.target.closest('[data-del-update]');
        if (delUpdate) {
          var uidv = delUpdate.getAttribute('data-del-update');
          set('updates', get('updates').filter(function (u) { return u.id !== uidv; }));
          toast('Update removed.', 'info');
          renderAdminContent(); renderUpdates();
          return;
        }

        var delInit = e.target.closest('[data-del-init]');
        if (delInit) {
          var iid = delInit.getAttribute('data-del-init');
          set('initiatives', get('initiatives').filter(function (x) { return x.id !== iid; }));
          toast('Initiative removed.', 'info');
          renderAdminContent(); renderInitiatives(); renderReferenceFooter();
          return;
        }

        var delVol = e.target.closest('[data-del-volunteer]');
        if (delVol) {
          var vod = delVol.getAttribute('data-del-volunteer');
          set('volunteers', get('volunteers').filter(function (x) { return x.id !== vod; }));
          toast('Volunteer record removed.', 'info');
          renderAdminContent();
          return;
        }

        var delDon = e.target.closest('[data-del-donation]');
        if (delDon) {
          var dod = delDon.getAttribute('data-del-donation');
          set('donations', get('donations').filter(function (x) { return x.id !== dod; }));
          toast('Donation record removed.', 'info');
          renderAdminContent();
          return;
        }

        if (e.target.closest('#exportVolunteers')) {
          downloadCSV('sjf-volunteers.csv', get('volunteers').map(function (v) {
            return {
              Name: v.name, Email: v.email, Phone: v.phone, City: v.city,
              Age: v.age, Area: v.area, Commitment: v.commit, Mode: v.mode,
              Skills: v.skills, Registered: v.createdAt
            };
          }));
          return;
        }

        if (e.target.closest('#exportDonations')) {
          downloadCSV('sjf-donations.csv', get('donations').map(function (d) {
            return {
              Date: d.date, Donor: d.name, Email: d.email, Phone: d.phone,
              Amount: d.amount, Purpose: d.purpose, Status: d.status, Reference: d.ref
            };
          }));
          return;
        }

        if (e.target.closest('#addDonation')) {
          openModal(
            '<div class="p-7">' +
              '<h3 class="font-display text-xl font-bold text-deep">Add Manual Donation</h3>' +
              '<form id="manualDonationForm" class="mt-5 grid sm:grid-cols-2 gap-4">' +
                '<div><label class="label">Donor Name</label><input class="field" id="mdName" required></div>' +
                '<div><label class="label">Amount (INR)</label><input class="field" id="mdAmount" type="number" min="1" required></div>' +
                '<div class="sm:col-span-2"><label class="label">Email</label><input class="field" id="mdEmail" type="email"></div>' +
                '<div class="sm:col-span-2"><label class="label">Purpose</label><input class="field" id="mdPurpose" placeholder="Where it is needed most"></div>' +
                '<div class="sm:col-span-2"><label class="label">Status</label>' +
                  '<select class="field" id="mdStatus"><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option></select></div>' +
                '<div class="sm:col-span-2"><button class="btn btn-primary w-full" type="submit">Save Record</button></div>' +
              '</form>' +
            '</div>'
          );

          var mdForm = $('#manualDonationForm');
          if (mdForm) {
            mdForm.addEventListener('submit', function (ev) {
              ev.preventDefault();
              var donations = get('donations');
              donations.unshift({
                id: uid('d'), date: new Date().toISOString(),
                name: $('#mdName').value.trim(), email: $('#mdEmail').value.trim(),
                phone: '', amount: Number($('#mdAmount').value) || 0,
                purpose: $('#mdPurpose').value.trim() || 'Where it\'s needed most',
                status: $('#mdStatus').value, ref: 'MANUAL'
              });
              if (set('donations', donations)) {
                toast('Donation record saved.', 'success');
                closeModal();
                renderAdminContent();
              }
            });
          }
          return;
        }

        if (e.target.closest('#resetData')) {
          if (!window.confirm('Reset the browser demo? Export a backup first if you need to keep your changes.')) return;
          Object.keys(SEED).forEach(function (k) {
            localStorage.removeItem(LS + k);
          });
          toast('All local data reset.', 'success');
          applyHomeSettings(); renderStats(); renderReferenceFooter();
          renderAdminContent();
          renderInitiatives(); renderVideos(); renderUpdates();
          renderGalleryPage('all'); renderHomeGallery(); renderSocialFeeds();
          updateRazorpayStatus();
          return;
        }
      });
    }

    // Hero collage parallax (desktop only, subtle)
    var collage = $('#heroCollage');
    if (collage && window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var hero = collage.closest('.bg-deep');
      if (hero) {
        hero.addEventListener('mousemove', function (ev) {
          var r = hero.getBoundingClientRect();
          var x = (ev.clientX - r.left) / r.width - 0.5;
          var y = (ev.clientY - r.top) / r.height - 0.5;
          $$('[data-art]', collage).forEach(function (el, i) {
            var depth = (i + 1) * 6;
            el.style.transform = 'translate3d(' + (-x * depth) + 'px,' + (-y * depth) + 'px,0)';
          });
        });
        hero.addEventListener('mouseleave', function () {
          $$('[data-art]', collage).forEach(function (el) { el.style.transform = ''; });
        });
      }
    }
  }

const FOOTER_ICONS={
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
const ic=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${FOOTER_ICONS[n]||FOOTER_ICONS.sparkle}</svg>`;
const BRAND={
fb:'<svg viewBox="0 0 24 24" fill="currentColor" style="width:1.2em;height:1.2em"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9A21 21 0 0 0 14.7 4C12.2 4 10.5 5.5 10.5 8.3V11H8v3h2.5v7h3Z"/></svg>',
ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1.2em;height:1.2em"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" stroke="none"/></svg>',
yt:'<svg viewBox="0 0 24 24" fill="currentColor" style="width:1.2em;height:1.2em"><path d="M23 12s0-3.9-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.1 1 12 1 12s0 3.9.5 5.6a2.9 2.9 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2c.5-1.7.5-5.6.5-5.6ZM9.8 15.5v-7l6 3.5-6 3.5Z"/></svg>'};


function foundationLogo(size=40,cls=''){
  return `<img src="assets/images/sjf-logo.png" width="${size}" height="${size}" class="sjf-logo ${cls}" style="--sjf-logo-size:${size}px" alt="Sashi Jamuna Foundation logo">`;
}

function footer(){
 const raw=get('settings');
 const s={address:raw.address||'Rosera, Bihar, India',email:raw.email||'info@sashijamunafoundation.org',phone:raw.phone||'',
   instaUrl:socialURL(raw.instagram,'instagram'),fbUrl:socialURL(raw.facebook,'facebook'),ytUrl:socialURL(raw.youtube,'youtube')};
 const NAV=[['home','Home'],['about','About Us'],['initiatives','Initiatives'],['gallery','Gallery'],['videos','Videos'],['news','Updates'],['contact','Contact']];
 const esc=escapeHtml;
 const soc=(key,brand,label)=>s[key]?`<a href="${esc(s[key])}" target="_blank" rel="noopener" aria-label="${label}" class="w-11 h-11 rounded-full grid place-items-center bg-cream/10 text-cream hover:bg-gold hover:text-night transition">${brand}</a>`
  :`<button aria-label="${label}" data-footer-social="true" class="w-11 h-11 rounded-full grid place-items-center bg-cream/10 text-cream hover:bg-gold hover:text-night transition">${brand}</button>`;
 return `<footer class="reference-footer relative g-navy text-cream overflow-hidden">
  <div style="height:22px;background:var(--arm-dark) repeat-x center/48px 22px" aria-hidden="true"></div>
  <div class="pat-dark" aria-hidden="true"></div>
  <div class="wrap relative py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
    <div><div class="flex items-center gap-3">${foundationLogo(64)}<span class="brand-lockup font-disp text-2xl"><span class="brand-line"><span class="brand-sashi">SASHI</span> <span class="brand-jamuna">Jamuna</span></span><span class="brand-foundation">Foundation</span></span></div>
      <p class="mt-4 text-cream/70 text-[15px] max-w-sm">A community-driven foundation carrying the colours of Mithila into modern service — rooted in culture, growing hope.</p>
      <div class="mt-5 flex gap-3">${soc('instaUrl',BRAND.ig,'Instagram')}${soc('fbUrl',BRAND.fb,'Facebook')}${soc('ytUrl',BRAND.yt,'YouTube')}</div></div>
    <div><h4 class="font-disp text-lg text-gold">Quick Links</h4><ul class="mt-4 space-y-2.5 text-cream/75">${NAV.map(([r,l])=>`<li><a class="hover:text-gold transition flex items-center gap-2" href="#${r}"><i class="dia" style="width:6px;height:6px"></i>${l}</a></li>`).join('')}
      <li><a class="hover:text-gold transition flex items-center gap-2" href="#donate"><i class="dia" style="width:6px;height:6px"></i>Donate</a></li><li><a class="hover:text-gold transition flex items-center gap-2" href="#volunteer"><i class="dia" style="width:6px;height:6px"></i>Volunteer</a></li></ul></div>
    <div><h4 class="font-disp text-lg text-gold">Our Work</h4><ul class="mt-4 space-y-2.5 text-cream/75">${get('initiatives').slice(0,6).map(i=>`<li><a class="hover:text-gold transition flex items-center gap-2" href="#initiatives"><i class="dia" style="width:6px;height:6px"></i>${esc(i.title)}</a></li>`).join('')}</ul></div>
    <div><h4 class="font-disp text-lg text-gold">Reach Us</h4>
      <ul class="mt-4 space-y-3 text-cream/75 text-[15px]">
        <li class="flex gap-3">${ic('pin','mt-1 text-gold')}<span class="ph !text-cream/60">${s.address?esc(s.address):'[Foundation address, city, Bihar — add via Admin]'}</span></li>
        <li class="flex gap-3">${ic('mail','mt-1 text-gold')}${s.email?`<a class="hover:text-gold" href="mailto:${esc(s.email)}">${esc(s.email)}</a>`:'<span class="ph !text-cream/60">[email@example.com]</span>'}</li>
        <li class="flex gap-3">${ic('phone','mt-1 text-gold')}${s.phone?`<a class="hover:text-gold" href="tel:${esc(s.phone)}">${esc(s.phone)}</a>`:'<span class="ph !text-cream/60">[+91 — — — —]</span>'}</li></ul>
      <form id="footerNewsletterForm" class="mt-5 flex gap-2"><input class="footer-email" type="email" required placeholder="Email for updates" aria-label="Email for updates"><button class="btn btn-gold btn-sm px-4" aria-label="Subscribe">${ic('arrowR')}</button></form></div>
  </div>
  <div class="relative border-t border-cream/15"><div class="wrap py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-cream/65">
    <span>&copy; ${new Date().getFullYear()} Sashi Jamuna Foundation. All rights reserved.</span>
    <span class="flex items-center gap-1.5">${ic('heart','text-ver')} Designed &amp; Developed by <b class="text-cream font-bold">Alpha Avics Digital Solutions</b>.</span>
    <a href="#admin" class="flex items-center gap-1.5 hover:text-gold transition text-xs">${ic('key','w-3.5 h-3.5')} Admin</a>
  </div></div></footer>`;}


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
    $$('#footerRoot a[href^="#"]').forEach(function (a) { if (a.hash !== '#admin') a.href = '3.html' + a.hash; });
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
    container.innerHTML = '<div class="admin-home-heading"><div><span class="eyebrow left">Admin Portal</span><h2 class="font-display text-3xl text-deep font-bold mt-2">Welcome to your foundation</h2></div><button type="button" class="btn btn-blue" data-admin-go="home-editor">Edit Hero</button></div><div id="adminHomePreview" class="admin-home-preview"></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">' +
      statCard('Photos', get('photos').length) + statCard('Videos', get('videos').length, 'text-magenta') + statCard('Daily Updates', get('updates').length, 'text-teal') + statCard('Volunteers', get('volunteers').length, 'text-leaf') + '</div>' +
      '<div class="admin-quick-actions"><button type="button" data-admin-go="photos">Upload photos <span>↗</span></button><button type="button" data-admin-go="updates">Publish an update <span>↗</span></button><button type="button" data-admin-go="inbox">Open inbox <span>↗</span></button><a href="3.html#home">View website <span>↗</span></a></div>';
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

  function renderHomeEditor(container) { container.innerHTML = window.SJFEditors.hero(); }
  function renderImpactEditor(container) { container.innerHTML = window.SJFEditors.impact(); }
  function renderAccountEditor(container) { container.innerHTML = window.SJFEditors.account(); }

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
    document.addEventListener('change', function (e) {
      if (e.target.name === 'heroLayout' && e.target.form) window.SJFEditors.updateHeroHints(e.target.form);
    });
    document.addEventListener('submit', async function (e) {
      var form = e.target;
      if (form.id === 'footerNewsletterForm') { e.preventDefault(); if (saveSubscriber($('input[type=email]', form).value)) form.reset(); }
      if (form.id === 'homeEditorForm') {
        e.preventDefault(); if (!isAuthed()) return;
        var heroData = new FormData(form), selectedHeroLayout = String(heroData.get('heroLayout') || '');
        var heroSettings = {layout:window.SJFHero.defaults[selectedHeroLayout] ? selectedHeroLayout : 'madhubani'};
        window.SJFHero.fields.forEach(function (key) { heroSettings[key] = String(heroData.get(key) || '').trim(); });
        if (set('hero', heroSettings)) toast('Public website hero saved.', 'success');
      }
      if (form.id === 'impactSettingsForm') {
        e.preventDefault(); if (!isAuthed()) return;
        var data = new FormData(form), settings = get('settings');
        settings.impact = [0,1,2,3].map(function (i) { return String(data.get('impact' + i) || '').trim(); });
        if (set('settings', settings)) { renderStats(); observeReveals(); toast('Impact figures saved.', 'success'); }
      }
      if (form.id === 'accountSettingsForm') {
        e.preventDefault(); if (!isAuthed() || !form.reportValidity()) return;
        var saveButton = $('button[type="submit"]', form);
        if (saveButton.disabled) return;
        var accountData = new FormData(form);
        var nextPassword = String(accountData.get('newPassword') || '');
        if (nextPassword !== String(accountData.get('confirmPassword') || '')) { toast('New passwords do not match.', 'error'); return; }
        saveButton.disabled = true;
        try {
          await window.SJFAccount.change(String(accountData.get('currentPassword') || ''),String(accountData.get('username') || '').trim(),nextPassword);
          rememberAdminSession();
          form.reset();
          renderAccountEditor($('#adminContent'));
          toast('Sign-in details updated for this browser.', 'success');
        } catch (err) { toast(err.message || 'Sign-in details could not be saved.', 'error'); }
        finally { saveButton.disabled = false; }
      }
    });
    window.addEventListener('storage', function (e) {
      if (e.key && e.key.indexOf(LS) !== 0) return;
      if (e.key === 'sjf_hero') return;
      if (e.key === 'sjf_admin_credentials') { renderAdmin(); return; }
      applyHomeSettings(); renderStats(); renderInitiatives(); renderVideos(); renderUpdates(); renderGalleryPage('all'); renderHomeGallery(); renderReferenceFooter(); renderSocialFeeds(); observeReveals();
      if (currentPage === 'admin') renderAdmin();
    });
    $$('#volunteerForm, #quickVolunteerForm, #newsletterForm, #newsSideForm').forEach(function (form) {
      var note = document.createElement('p'); note.className = 'form-demo-note'; note.textContent = 'Demo: saved in this browser only.'; form.appendChild(note);
    });
  }

  /* ------------------------------------------------------------------
     15. GO
     ------------------------------------------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
