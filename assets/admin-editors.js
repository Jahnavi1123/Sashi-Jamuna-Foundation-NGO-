(function () {
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields = [['heroLead1','First line'],['heroAccent1','First highlight'],['heroLead2','Second line'],['heroAccent2','Second highlight']];
  window.SJFEditors = {
    hero() {
      const s = window.SJFHero.read(), defaults = window.SJFHero.defaults[s.layout];
      return `<form id="homeEditorForm" class="card p-6 sm:p-8">
        <span class="eyebrow left">Public Website Hero</span><h2 class="font-display text-2xl font-bold text-deep mt-3">Choose your welcome</h2>
        <p class="text-ink/60 text-sm mt-3">Choose a layout and edit the hero text. Saving updates only the opening hero on your website.</p>
        <fieldset class="hero-layout-options"><legend class="label">Hero layout</legend>
          <label class="hero-layout-choice"><input type="radio" name="heroLayout" value="madhubani" ${s.layout === 'madhubani' ? 'checked' : ''}>
            <span class="hero-choice-body"><span class="hero-choice-picture hero-choice-cream" aria-hidden="true"><span class="hero-choice-copy">Rooted in<br><b>Culture.</b></span><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#164b8c" stroke-width="2" stroke-dasharray="3 3"/><circle cx="50" cy="50" r="32" fill="#168a45" stroke="#164b8c" stroke-width="2"/><path d="M50 22Q32 48 50 67Q68 48 50 22ZM25 43Q34 68 50 67Q40 46 25 43ZM75 43Q66 68 50 67Q60 46 75 43Z" fill="#f15a24" stroke="#164b8c" stroke-width="2"/></svg></span><strong>Cream Madhubani</strong><span>Current homepage design</span></span>
          </label>
          <label class="hero-layout-choice"><input type="radio" name="heroLayout" value="blue" ${s.layout === 'blue' ? 'checked' : ''}>
            <span class="hero-choice-body"><span class="hero-choice-picture hero-choice-blue" aria-hidden="true"><span class="hero-choice-copy">Empowering<br><b>Communities.</b></span><span class="hero-choice-tiles"><i>✺</i><i>❀</i><i>✦</i><i>☼</i></span></span><strong>Blue Art Collage</strong><span>Admin portal hero design</span></span>
          </label>
          <label class="hero-layout-choice"><input type="radio" name="heroLayout" value="heritage" ${s.layout === 'heritage' ? 'checked' : ''}>
            <span class="hero-choice-body"><span class="hero-choice-picture hero-choice-heritage" aria-hidden="true"><span class="hero-choice-copy">Heritage in<br><b>Every Heart.</b></span><i>✦</i></span><strong>Heritage Ribbon</strong><span>Traditional navy-and-cream design</span></span>
          </label>
          <label class="hero-layout-choice"><input type="radio" name="heroLayout" value="community" ${s.layout === 'community' ? 'checked' : ''}>
            <span class="hero-choice-body"><span class="hero-choice-picture hero-choice-community" aria-hidden="true"><span class="hero-choice-copy">Every Child.<br><b>Every Chance.</b></span></span><strong>Community Portrait</strong><span>Children activity photo design</span></span>
          </label>
        </fieldset>
        <p class="text-ink/60 text-sm mt-5">Leave a field blank to use the selected layout’s original text.</p>
        <div class="grid sm:grid-cols-2 gap-5 mt-5">${fields.map(([key,label])=>`<div><label class="label" for="edit-${key}">${label}</label><input class="field" id="edit-${key}" name="${key}" maxlength="60" placeholder="${esc(defaults[key])}" value="${esc(s[key] || '')}"></div>`).join('')}
        <div class="sm:col-span-2"><label class="label" for="edit-description">Introduction</label><textarea class="field" rows="4" id="edit-description" name="heroDescription" maxlength="1200" placeholder="${esc(defaults.heroDescription)}">${esc(s.heroDescription || '')}</textarea></div></div>
        <div class="flex flex-wrap gap-3 mt-7"><button class="btn btn-primary" type="submit">Save Hero</button><a class="btn btn-outline" href="3.html#home" target="_blank" rel="noopener">View Website ↗</a></div>
      </form>`;
    },
    updateHeroHints(form) {
      const selected = new FormData(form).get('heroLayout');
      const layout = window.SJFHero.defaults[selected] ? selected : 'madhubani';
      window.SJFHero.fields.forEach(key => { form.elements.namedItem(key).placeholder = window.SJFHero.defaults[layout][key]; });
    },
    impact() {
      const settings = window.SJFData.read('settings');
      return `<form id="impactSettingsForm" class="card p-6 sm:p-8"><h2 class="font-display text-2xl font-bold text-deep">Verified impact figures</h2><p class="text-ink/60 text-sm mt-3">Enter figures verified by the foundation. Blank fields show a dash.</p><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">${['Villages Reached','Lives Impacted','Programmes Running','Active Volunteers'].map((label,i)=>`<div><label class="label" for="impact-${i}">${label}</label><input class="field" id="impact-${i}" name="impact${i}" maxlength="20" placeholder="—" value="${esc((settings.impact || [])[i] || '')}"></div>`).join('')}</div><button type="submit" class="btn btn-primary mt-7">Save Impact Figures</button></form>`;
    },
    account() {
      return `<form id="accountSettingsForm" class="card p-6 sm:p-8 max-w-2xl"><span class="eyebrow left">Account</span><h2 class="font-display text-2xl font-bold text-deep mt-3">Update sign-in details</h2><p class="text-ink/60 text-sm mt-3">These sign-in details apply to this browser. Enter your current password to save a change.</p><div class="space-y-5 mt-6">
        <div><label class="label" for="accountUsername">Username</label><input class="field" id="accountUsername" name="username" required minlength="3" maxlength="64" autocomplete="username" value="${esc(window.SJFAccount.username())}"></div>
        <div><label class="label" for="accountCurrentPassword">Current password</label><input class="field" id="accountCurrentPassword" name="currentPassword" type="password" required autocomplete="current-password"></div>
        <div><label class="label" for="accountNewPassword">New password</label><input class="field" id="accountNewPassword" name="newPassword" type="password" minlength="8" autocomplete="new-password"><p class="text-xs text-ink/50 mt-2">Leave blank to keep your password.</p></div>
        <div><label class="label" for="accountConfirmPassword">Confirm new password</label><input class="field" id="accountConfirmPassword" name="confirmPassword" type="password" autocomplete="new-password"></div>
        </div><button type="submit" class="btn btn-primary mt-7">Save Sign-in Details</button></form>`;
    }
  };
})();
