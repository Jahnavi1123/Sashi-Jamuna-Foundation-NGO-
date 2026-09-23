(function () {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function escapeAttr(value) { return esc(value); }
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
    var uid = 'sbh-art-' + (++uidCounter);
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


  window.SJFBlueHero = {
    render(settings) {
      const s = window.SJFHero.resolve({...settings,layout:'blue'});
      const words = ['Education','Healthcare','Women Empowerment','Skill Development','Madhubani Heritage','Environment','Disaster Relief'];
      const group = '<div class="sbh-band-group">'+words.map(word=>'<span>'+word+'</span><i>◆</i>').join('')+'</div>';
      return `<section id="publicHero" class="sjf-blue-hero" data-hero-layout="blue">
        <div class="sbh-glow" aria-hidden="true"></div><div class="sbh-pattern" aria-hidden="true"></div>
        <div class="sbh-grid"><div>
          <span class="sbh-eyebrow">Rooted in Bihar · Serving Communities</span>
          <h1 class="sbh-title"><span data-home-copy="heroLead1">${esc(s.heroLead1)}</span> <span class="sbh-accent" data-home-copy="heroAccent1">${esc(s.heroAccent1)}</span><br><span data-home-copy="heroLead2">${esc(s.heroLead2)}</span> <span class="sbh-accent" data-home-copy="heroAccent2">${esc(s.heroAccent2)}</span></h1>
          <p class="sbh-description" data-home-copy="heroDescription">${esc(s.heroDescription)}</p>
          <div class="sbh-actions"><a href="#donate" class="sbh-button sbh-button-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.3-9A5.3 5.3 0 0 1 12 6.4 5.3 5.3 0 0 1 21.3 12c-1.8 4.4-9.3 9-9.3 9Z"/></svg>Donate Now</a><a href="#initiatives" class="sbh-button">Explore Initiatives <span aria-hidden="true">→</span></a></div>
          <div class="sbh-notes"><span><svg viewBox="0 0 24 24" fill="none" stroke="#168642" stroke-width="2.6" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>80G Tax Benefit [Verify]</span><span><svg viewBox="0 0 24 24" fill="none" stroke="#168a45" stroke-width="2.6" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>Transparent Reporting</span><span><svg viewBox="0 0 24 24" fill="none" stroke="#168642" stroke-width="2.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Volunteer-Led</span></div>
        </div><div class="sbh-collage">
          ${[0,1,2,3].map(i=>'<div class="sbh-art">'+artSVG(i,'Madhubani inspired artwork')+'</div>').join('')}
          <div class="sbh-badge"><img class="sjf-hero-logo" src="assets/images/sjf-logo.png" alt="Sashi Jamuna Foundation logo" width="112" height="112"></div>
        </div></div>
        <div class="sbh-band" aria-hidden="true"><div class="sbh-band-track">${group}${group}</div></div>
      </section>`;
    }
  };
})();
