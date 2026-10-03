# Sashi Jamuna Foundation

`3.html` is the public homepage, using the cream background, Madhubani illustration, typography, buttons and footer from the original `1.html`. `index.html` forwards to it while preserving section links. Apache also uses `3.html` first through `.htaccess`.

`admin.html` is the separate demo portal. It keeps the previous website's dark-blue design and artwork. Public pages retain the blue running announcement strip.

All entry pages share `assets/page-loader.js`. Its cream-and-blue loading screen appears only after a 300 ms delay, including navigation between the website and admin, and disappears when the page finishes loading. Instant section links do not trigger it. A 10-second fallback prevents stalled external assets or cancelled navigation from leaving the site blocked. It uses the same looping local `1003.mp4` clip as the hero and respects reduced-motion preferences.

`assets/images/sjf-logo.png` is an unchanged copy of the supplied foundation logo. The public header, footer, contact placeholder, admin header, sign-in and browser icons use this local asset. `assets/branding.css` controls its display sizes without stretching it. The source screenshot and the optional archive folder are not runtime dependencies.

Open `3.html` directly, or run a local preview from this folder:

```powershell
npm run preview
```

Then open `http://127.0.0.1:8000/`.

The preview server supports MP4 byte ranges for playback and seeking. Normal static hosting can serve the same site without Node.js; enable byte-range responses there too.

## Foundation videos

The hero continuously plays `1003.mp4` inside its circular frame. Homepage stories feature Day 13, Day 15 and Day 16. The Videos page shows Day 11, 12, 13, 14, 15, 16, 17 and 19; selecting a card opens the fullscreen viewer with previous/next arrows, keyboard navigation and a close button. `assets/videos/` contains web-sized H.264/AAC copies with fast-start metadata. `assets/images/video-posters/` contains actual video frames, and `assets/video-library.js` lists the titles, durations and paths. Gallery clips load on selection; portrait footage keeps its proportions.

The originals stay untouched and are not required to serve the site. Upload the full `assets/` directory with the HTML files. Media files are never copied into localStorage. Existing browser data receives the library once, keeps custom YouTube entries, and respects subsequent admin removals. Admin → Videos previews the imported clips and controls which ones appear.

To regenerate the web copies and posters, run `npm ci` followed by `npm run prepare:videos`. This preparation command needs the original `sjf videos/` folder, Python and the ffmpeg development dependency; viewing the prepared site does not. Titles use the supplied day labels or numbered SJF video labels rather than assuming an event or date.

## Demo admin

Open `admin.html`, or use the Admin link in the website.

- Username: `admin`
- Password: `sjf@admin`
- Admin Home provides dashboard totals and shortcuts to editing tools.
- Edit Hero edits the headline and introduction of the single Madhubani hero. It changes only the public hero; other sections, the footer, admin design and in-progress forms stay unchanged.
- Impact Figures edits the separate impact section.
- Account changes the username and/or password after verifying the current password. Default credentials above apply until changed. Password fields start empty; no credentials hint is shown on the login page. Changed passwords are stored as salted PBKDF2 hashes in this browser.
- Photos, videos, initiatives and daily updates feed the public sections.
- Inbox lists locally submitted messages and newsletter interests.
- Settings controls footer contact details and social links, and exports a JSON backup.

As requested, this is a browser-only demo. Login is not server authentication. Data belongs to this browser and origin, does not sync to other devices, and can be lost when browser data is cleared. Forms do not send emails. Donation forms record interest only and process no payment. For consistent storage, use the same local URL each time.

The four old HTML documents are kept in `originals/` under their unchanged names: `1.html`, `3.html`, `index.html`, and `index1.html`. You can delete the entire `originals/` folder without affecting the current website or admin portal. Historical conversion helpers are also archived inside that folder and are not part of the active website workflow.

The active website consists of the root HTML pages, `assets/`, and `.htaccess`. The homepage links to dedicated About, Initiatives, Gallery, Videos, Updates, Donate, Volunteer and Contact pages. Edit these files directly; no build step is needed. `assets/public.js` and `assets/public.css` provide the public design; `assets/site.js` and `assets/site.css` provide the admin design. `assets/demo-data.js` shares browser data between the two. Hero copy uses the separate `sjf_hero` key and `hero-config.js`. Retired hero implementations and hidden public pages inside the admin have been removed; older saved hero settings still migrate to the current design. The `admin-account.js` and `admin-editors.js` modules support account and editing controls. Existing `sjf_` saved content is retained. The website uses the original Tailwind CDN and Google Fonts, which need an internet connection.

Visitors choose Hindi or English on their first visit; `assets/i18n.js` remembers their choice. The homepage previews six photos in a slow left-to-right loop; the full gallery retains all 30 supplied photos and custom admin uploads. The hero displays `hero1.jpeg` beside the foundation values. The menu appears on downward scrolling and hides on upward scrolling. Scroll effects and the animated fish respect reduced-motion preferences.

Run `npm ci` then `npm test` for navigation, login, admin edits, saved-content migration, forms, gallery photos, languages, scroll effects, video viewer and media-streaming checks. These automated tests do not verify browser layout.
