(function () {
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields = [['heroLead1','First line'],['heroAccent1','First highlight'],['heroLead2','Second line'],['heroAccent2','Second highlight']];
  window.SJFEditors = {
    hero() {
      const s = window.SJFHero.read(), defaults = window.SJFHero.defaults[s.layout];
      return `<form id="homeEditorForm" class="card p-6 sm:p-8">
        <span class="eyebrow left">Public Website Hero</span><h2 class="font-display text-2xl font-bold text-deep mt-3">Edit your welcome</h2>
        <p class="text-ink/60 text-sm mt-3">Edit the heading and introduction shown on your website’s opening hero.</p>
        <p class="text-ink/60 text-sm mt-5">Leave a field blank to use the original text.</p>
        <div class="grid sm:grid-cols-2 gap-5 mt-5">${fields.map(([key,label])=>`<div><label class="label" for="edit-${key}">${label}</label><input class="field" id="edit-${key}" name="${key}" maxlength="60" placeholder="${esc(defaults[key])}" value="${esc(s[key] || '')}"></div>`).join('')}
        <div class="sm:col-span-2"><label class="label" for="edit-description">Introduction</label><textarea class="field" rows="4" id="edit-description" name="heroDescription" maxlength="1200" placeholder="${esc(defaults.heroDescription)}">${esc(s.heroDescription || '')}</textarea></div></div>
        <div class="flex flex-wrap gap-3 mt-7"><button class="btn btn-primary" type="submit">Save Hero</button><a class="btn btn-outline" href="3.html#home" target="_blank" rel="noopener">View Website ↗</a></div>
      </form>`;
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
