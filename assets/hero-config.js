/* Public hero settings have their own key; saving them never writes site settings. */
(function () {
  const fields = ['heroLead1','heroAccent1','heroLead2','heroAccent2','heroDescription'];
  const defaults = {
    madhubani:{heroLead1:'Rooted in',heroAccent1:'Culture',heroLead2:'Empowering',heroAccent2:'Communities',heroDescription:'A community-led foundation creating spaces where children learn, grow and belong.'}
  };
  function cleanCopy(settings) {
    fields.forEach(key => {
      if (/madhubani|mithila|mithala|मधुबनी|मिथिला/i.test(settings[key] || '')) settings[key] = '';
    });
    return settings;
  }
  window.SJFHero = {
    fields,defaults,
    read() {
      const saved = window.SJFData.read('hero');
      // Older browsers may still have an alternate layout saved. Keep their
      // edited copy, but always use the single public homepage design.
      if (saved && saved.layout) return cleanCopy({...saved,layout:'madhubani'});
      const legacy = window.SJFData.read('settings'), result = {layout:'madhubani'};
      fields.forEach(key => { result[key] = legacy[key] || ''; });
      return cleanCopy(result);
    },
    resolve(settings) {
      const layout = 'madhubani';
      const result = {layout};
      settings = cleanCopy({...settings});
      fields.forEach(key => { result[key] = settings[key] || defaults[layout][key]; });
      const previous = {heroLead2:'Growing',heroAccent2:'Hope',heroDescription:'Carrying the colours of Mithila into modern service — we work hand-in-hand with communities so every life we touch can bloom with dignity, learning and opportunity.'};
      Object.keys(previous).forEach(key => {
        if (result[key] === previous[key]) result[key] = defaults.madhubani[key];
      });
      return result;
    }
  };
})();
