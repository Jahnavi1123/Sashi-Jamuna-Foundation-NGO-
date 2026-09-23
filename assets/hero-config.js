/* Public hero settings have their own key; saving them never writes site settings. */
(function () {
  const fields = ['heroLead1','heroAccent1','heroLead2','heroAccent2','heroDescription'];
  const defaults = {
    madhubani:{heroLead1:'Rooted in',heroAccent1:'Culture',heroLead2:'Growing',heroAccent2:'Hope',heroDescription:'Carrying the colours of Mithila into modern service — we work hand-in-hand with communities so every life we touch can bloom with dignity, learning and opportunity.'},
    blue:{heroLead1:'Empowering',heroAccent1:'Communities.',heroLead2:'Preserving',heroAccent2:'Culture.',heroDescription:"The Sashi Jamuna Foundation works alongside rural and semi-urban communities across Bihar — advancing education, healthcare, women's livelihoods, skills, environment and the living heritage of Madhubani art."}
  };
  window.SJFHero = {
    fields,defaults,
    read() {
      const saved = window.SJFData.read('hero');
      if (saved && saved.layout) return {...saved,layout:saved.layout === 'blue' ? 'blue' : 'madhubani'};
      const legacy = window.SJFData.read('settings'), result = {layout:'madhubani'};
      fields.forEach(key => { result[key] = legacy[key] || ''; });
      return result;
    },
    resolve(settings) {
      const layout = settings.layout === 'blue' ? 'blue' : 'madhubani';
      const result = {layout};
      fields.forEach(key => { result[key] = settings[key] || defaults[layout][key]; });
      return result;
    }
  };
})();
