(function () {
  'use strict';

  // Run before remote fonts and scripts so their delays also get a loading screen.
  var root = document.documentElement;
  var style = document.createElement('style');
  style.textContent = `
    html.sjf-loading-visible { overflow: hidden !important; }
    #sjf-page-loader[hidden] { display: none !important; }
    #sjf-page-loader {
      position: fixed; inset: 0; z-index: 2147483647; box-sizing: border-box;
      display: grid; place-items: center; padding: 24px; text-align: center;
      background: linear-gradient(135deg, rgba(255,153,51,.2), rgba(255,255,255,.95) 38%, rgba(22,134,66,.2));
      color: #164b8c; font: 16px/1.6 system-ui, sans-serif;
    }
    #sjf-page-loader .sjf-loading-mark {
      position: relative; display: grid; place-items: center;
      width: 158px; height: 158px; margin: 0 auto 24px;
      border-radius: 50%;
      background: conic-gradient(#FF9933 0 33.3%, #fff 33.3% 66.6%, #138A45 66.6% 100%);
      box-shadow: 0 0 0 3px #fff, 0 0 0 6px #138A45, 0 0 0 9px #fff, 0 0 0 12px #FF9933, 0 18px 50px -22px rgba(15,104,53,.55);
      overflow: hidden;
    }
    #sjf-page-loader .sjf-loading-video {
      display: block; width: 100%; height: 100%; border: 7px solid #fff;
      border-radius: 50%; object-fit: cover; background: #0a2547;
    }
    #sjf-page-loader .sjf-loading-name {
      margin: 0; color: #164b8c; font-size: clamp(18px, 4vw, 24px);
      font-weight: 700; line-height: 1.4;
    }
    #sjf-page-loader .brand-sashi { color:#F15A24; }
    #sjf-page-loader .brand-jamuna { color:#164B8C; }
    #sjf-page-loader .brand-foundation { color:#168642; }
    #sjf-page-loader .sjf-loading-caption { margin: 10px 0 0; color: #52637b; font-size: 14px; }
  `;
  document.head.appendChild(style);

  var screen = document.createElement('div');
  screen.id = 'sjf-page-loader';
  screen.hidden = true;
  screen.setAttribute('role', 'status');
  screen.setAttribute('aria-live', 'polite');
  screen.setAttribute('aria-atomic', 'true');
  screen.innerHTML = '<div><div class="sjf-loading-mark"><video class="sjf-loading-video" autoplay muted loop playsinline preload="none" poster="assets/images/video-posters/1003.jpg" aria-label="Sashi Jamuna Foundation loading video"><source src="assets/videos/1003.mp4" type="video/mp4"></video></div>' +
    '<p class="sjf-loading-name"><span class="brand-sashi">SASHI</span> <span class="brand-jamuna">Jamuna</span> <span class="brand-foundation">Foundation</span></p>' +
    '<p class="sjf-loading-caption">Loading, please wait…</p></div>';

  // The body may not exist while a blocking CDN request is still in progress.
  (document.body || root).appendChild(screen);
  var showTimer, safetyTimer, active = false;
  var previousBusy = null;
  var lockedElements = [];

  function lockContent() {
    if (!document.body || !active || screen.hidden) return;
    Array.from(document.body.children).forEach(function (element) {
      if (element !== screen && element.id !== 'sjf-language-picker' && !element.hasAttribute('inert')) {
        element.setAttribute('inert', '');
        lockedElements.push(element);
      }
    });
  }

  function finish() {
    clearTimeout(showTimer);
    clearTimeout(safetyTimer);
    active = false;
    if (screen.hidden) return;
    screen.hidden = true;
    root.classList.remove('sjf-loading-visible');
    if (previousBusy === null) root.removeAttribute('aria-busy');
    else root.setAttribute('aria-busy', previousBusy);
    lockedElements.forEach(function (element) { element.removeAttribute('inert'); });
    lockedElements = [];
    var loaderVideo = screen.querySelector('.sjf-loading-video');
    if (loaderVideo && !loaderVideo.paused) loaderVideo.pause();
  }

  function begin() {
    if (active) return;
    active = true;
    showTimer = setTimeout(function () {
      previousBusy = root.getAttribute('aria-busy');
      root.setAttribute('aria-busy', 'true');
      root.classList.add('sjf-loading-visible');
      screen.hidden = false;
      lockContent();
      var loaderVideo = screen.querySelector('.sjf-loading-video');
      if (loaderVideo) {
        loaderVideo.muted = true;
        loaderVideo.defaultMuted = true;
        loaderVideo.loop = true;
        var playback = loaderVideo.play();
        if (playback && playback.catch) playback.catch(function () {});
      }
    }, 300);
    // An unavailable third-party asset must never lock the website indefinitely.
    safetyTimer = setTimeout(finish, 10000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(screen);
    lockContent();
  }, { once: true });
  window.addEventListener('load', finish, { once: true });
  window.addEventListener('pageshow', finish);
  window.addEventListener('pagehide', finish);

  // Cover slow navigation between the website and admin, preserving native links.
  window.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    var destination = new URL(link.href, location.href);
    if (!/^https?:$/.test(destination.protocol) && destination.protocol !== 'file:') return;
    if (destination.origin !== location.origin) return;
    if (destination.pathname === location.pathname && destination.search === location.search) return;
    begin();
  });

  if (document.readyState !== 'complete') begin();
})();
