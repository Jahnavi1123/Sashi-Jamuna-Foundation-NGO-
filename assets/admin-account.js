/* Browser-only demo credentials. No password is rendered or stored in plain text. */
(function () {
  const KEY = 'sjf_admin_credentials';
  const DEFAULT_USER = 'admin', DEFAULT_PASS = 'sjf@admin';
  const ITERATIONS = 180000;
  const hex = bytes => Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,'0')).join('');
  function record() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const result = JSON.parse(raw);
    if (!result || typeof result.username !== 'string' || !/^[a-f0-9]{32}$/.test(result.salt) || !/^[a-f0-9]{64}$/.test(result.hash) || result.iterations !== ITERATIONS || !/^[a-f0-9]{24}$/.test(result.version)) throw new Error('Saved login settings could not be read.');
    return result;
  }
  async function digest(password, salt) {
    if (!window.crypto || !window.crypto.subtle) throw new Error('Open the local website URL or use HTTPS to change your password.');
    const key = await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const saltBytes = Uint8Array.from(salt.match(/../g),b=>parseInt(b,16));
    return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:saltBytes,iterations:ITERATIONS,hash:'SHA-256'},key,256));
  }
  async function verify(username,password) {
    const saved = record();
    if (!saved) return username === DEFAULT_USER && password === DEFAULT_PASS;
    if (username !== saved.username) return false;
    return (await digest(password,saved.salt)) === saved.hash;
  }
  window.SJFAccount = {
    username() { return record()?.username || DEFAULT_USER; },
    version() { try { return record()?.version || 'default'; } catch (_) { return 'unavailable'; } },
    verify,
    async change(currentPassword,username,newPassword) {
      if (!/^[A-Za-z0-9._@-]{3,64}$/.test(username)) throw new Error('Use 3–64 letters, numbers, dots, underscores, @ or hyphens for your username.');
      if (newPassword && newPassword.length < 8) throw new Error('Use at least 8 characters for the new password.');
      if (!(await verify(this.username(),currentPassword))) throw new Error('Current password is incorrect.');
      const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
      const hash = await digest(newPassword || currentPassword,salt);
      const saved = {username,salt,hash,iterations:ITERATIONS,version:hex(crypto.getRandomValues(new Uint8Array(12)))};
      try { localStorage.setItem(KEY,JSON.stringify(saved)); } catch (_) { throw new Error('Login details could not be saved in this browser.'); }
      return saved.username;
    }
  };
})();
