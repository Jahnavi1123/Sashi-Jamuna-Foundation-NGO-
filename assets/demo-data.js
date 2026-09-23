/* Shared browser-demo data. Both designs use the same sjf_ storage keys. */
(function () {
  const defaults = {
    hero: {},
    settings: {
      address: 'Rosera, Bihar, India',
      instagram: '[ @your-handle ]',
      facebook: '[ /your-page ]',
      youtube: '[ @your-channel ]',
      razorpayKey: ''
    },
    initiatives: [
      { id: 'i1', icon: 'book',   title: 'Education Support',    tag: 'Shiksha',   stat: '[Add verified figure]', desc: 'Learning centres, library kits, tuition support and digital literacy for children in rural and semi-urban schools.' },
      { id: 'i2', icon: 'heart',  title: 'Healthcare & Camps',   tag: 'Swasthya',  stat: '[Add verified figure]', desc: 'Free health check-up camps, maternal care awareness, blood donation drives and referrals to district hospitals.' },
      { id: 'i3', icon: 'users',  title: 'Women Empowerment',    tag: 'Shakti',    stat: '[Add verified figure]', desc: 'Self-help group formation, financial literacy, legal awareness and leadership training for women.' },
      { id: 'i4', icon: 'brief',  title: 'Skill Development',    tag: 'Kaushal',   stat: '[Add verified figure]', desc: 'Vocational courses in tailoring, computers, handicrafts and retail readiness linked to local employment.' },
      { id: 'i5', icon: 'palette',title: 'Madhubani Art & Culture', tag: 'Kala',   stat: '[Add verified figure]', desc: 'Preserving Bihar\u2019s Madhubani painting heritage through artisan training, fair-price markets and school workshops.' },
      { id: 'i6', icon: 'leaf',   title: 'Environment & Relief', tag: 'Prakriti',  stat: '[Add verified figure]', desc: 'Tree plantation, cleanliness drives, water conservation and rapid relief support during floods and disasters.' }
    ],
    photos: [
      { id: 'p1', caption: 'Education programme — classroom session', cat: 'education', art: 0,  src: null },
      { id: 'p2', caption: 'Health camp — village outreach',          cat: 'health',    art: 1,  src: null },
      { id: 'p3', caption: 'Madhubani art workshop with artisans',    cat: 'culture',   art: 2,  src: null },
      { id: 'p4', caption: 'Community meeting — gram sabha',          cat: 'community', art: 3,  src: null },
      { id: 'p5', caption: 'Skill training — tailoring batch',        cat: 'education', art: 4,  src: null },
      { id: 'p6', caption: 'Blood donation drive',                    cat: 'health',    art: 5,  src: null },
      { id: 'p7', caption: 'Traditional painting exhibition',         cat: 'culture',   art: 6,  src: null },
      { id: 'p8', caption: 'Tree plantation drive',                   cat: 'community', art: 7,  src: null },
      { id: 'p9', caption: 'Library kit distribution',                cat: 'education', art: 8,  src: null },
      { id: 'p10', caption: 'Women\u2019s self-help group meeting',     cat: 'community', art: 9,  src: null },
      { id: 'p11', caption: 'Mobile health check-up unit',            cat: 'health',    art: 10, src: null },
      { id: 'p12', caption: 'Folk art demonstration for students',    cat: 'culture',   art: 11, src: null }
    ],
    videos: window.SJFVideoLibrary || [],
    updates: [
      { id: 'u1', date: '', cat: 'Education',  title: 'Learning centre session held',        body: '[Editable placeholder — add the daily update text here from the admin dashboard.]' },
      { id: 'u2', date: '', cat: 'Health',     title: 'Free health camp conducted',           body: '[Editable placeholder — add the daily update text here from the admin dashboard.]' },
      { id: 'u3', date: '', cat: 'Culture',    title: 'Madhubani workshop with artisans',     body: '[Editable placeholder — add the daily update text here from the admin dashboard.]' },
      { id: 'u4', date: '', cat: 'Community',  title: 'Volunteer orientation programme',      body: '[Editable placeholder — add the daily update text here from the admin dashboard.]' },
      { id: 'u5', date: '', cat: 'Environment',title: 'Plantation drive in nearby villages',  body: '[Editable placeholder — add the daily update text here from the admin dashboard.]' },
      { id: 'u6', date: '', cat: 'Skills',     title: 'Vocational batch graduation',          body: '[Editable placeholder — add the daily update text here from the admin dashboard.]' }
    ],
    messages: [],
    subscribers: [],
    volunteers: [],
    donations: []
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const mediaImportKey = 'sjf_video_library_v1';
  const oldVideoTitles = ['A Day in the Life of a Learning Centre','Health Camp Diaries','The Art of Madhubani','Voices of the Community','Monsoon Relief Operations','Annual Impact Review'];
  function importVideos(saved) {
    const existing = Array.isArray(saved) ? saved : [];
    if (!defaults.videos.length) return existing;
    let imported = [];
    try {
      const stored = JSON.parse(localStorage.getItem(mediaImportKey) || '[]');
      if (Array.isArray(stored)) imported = stored;
    } catch (_) {}
    const pending = defaults.videos.filter(v => !imported.includes(v.id));
    if (!pending.length) return existing;
    // Preserve user-added videos, and replace only the old empty demo entries.
    const merged = existing.filter(v => !(/^v[1-6]$/.test(v.id) && !v.youtube && !v.src && oldVideoTitles.includes(v.title)));
    const ids = new Set(merged.map(v => v.id));
    pending.forEach(v => { if (!ids.has(v.id)) merged.push(clone(v)); });
    try {
      localStorage.setItem('sjf_videos', JSON.stringify(merged));
      localStorage.setItem(mediaImportKey, JSON.stringify([...new Set([...imported,...defaults.videos.map(v => v.id)])]));
    } catch (_) { /* Show the bundled media even when browser storage is unavailable. */ }
    return merged;
  }
  window.SJFData = {
    defaults,
    read(key) {
      try {
        const raw = localStorage.getItem('sjf_' + key);
        const value = raw ? JSON.parse(raw) : clone(defaults[key]);
        return key === 'videos' ? importVideos(value) : value;
      }
      catch (_) { return clone(defaults[key]); }
    },
    write(key, value) {
      try { localStorage.setItem('sjf_' + key, JSON.stringify(value)); return true; }
      catch (_) { return false; }
    }
  };
})();
