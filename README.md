# Sashi Jamuna Foundation

`3.html` is the actual single-page public website, using the cream background, Madhubani illustration, typography, buttons and footer from the original `1.html`. `index.html` forwards to it while preserving section links. Apache also uses `3.html` first through `.htaccess`.

`admin.html` is the separate demo portal. It keeps the previous website's dark-blue design and artwork. Every public section retains the blue running announcement strip.

All entry pages share `assets/page-loader.js`. Its cream-and-blue loading screen appears only after a 300 ms delay, including navigation between the website and admin, and disappears when the page finishes loading. Instant section links do not trigger it. A 10-second fallback prevents stalled external assets or cancelled navigation from leaving the site blocked. It respects reduced-motion preferences and needs no external fonts or images.

`assets/images/sjf-logo.png` is an unchanged copy of the supplied foundation logo. The public header, footer, hero identity, contact placeholder, admin header, sign-in, blue hero badges, loading screen and browser icons use this local asset. `assets/branding.css` controls its display sizes without stretching it. The source screenshot and the optional archive folder are not runtime dependencies.

Open `3.html` directly, or run a local preview from this folder:

```powershell
npm run preview
```

Then open `http://127.0.0.1:8000/`.

The preview server supports MP4 byte ranges for playback and seeking. Normal static hosting can serve the same site without Node.js; enable byte-range responses there too.

## Foundation videos

The 25 supplied MP4s from `sjf videos/` appear in the homepage's featured media and the main Videos section. `assets/videos/` contains web-sized H.264/AAC copies with fast-start metadata. `assets/images/video-posters/` contains actual video frames, and `assets/video-library.js` lists the titles, durations and paths. Video files load only after a visitor presses Play; portrait footage keeps its proportions and supports native fullscreen controls.

The originals stay untouched and are not required to serve the site. Upload the full `assets/` directory with the HTML files. Media files are never copied into localStorage. Existing browser data receives the library once, keeps custom YouTube entries, and respects subsequent admin removals. Admin → Videos previews the imported clips and controls which ones appear.

To regenerate the web copies and posters, run `npm ci` followed by `npm run prepare:videos`. This preparation command needs the original `sjf videos/` folder, Python and the ffmpeg development dependency; viewing the prepared site does not. Titles use the supplied day labels or numbered SJF video labels rather than assuming an event or date.

## Demo admin

Open `admin.html`, or use the Admin link in the website.

- Username: `admin`
- Password: `sjf@admin`
- Admin Home keeps the previous dark-blue hero and four-piece artwork collage.
- Edit Hero selects either the cream Madhubani hero or the blue art-collage hero and edits its headline and introduction. It changes only the public hero; other sections, the footer, admin design and in-progress forms stay unchanged.
- Impact Figures edits the separate impact section.
- Account changes the username and/or password after verifying the current password. Default credentials above apply until changed. Password fields start empty; no credentials hint is shown on the login page. Changed passwords are stored as salted PBKDF2 hashes in this browser.
- Photos, videos, initiatives and daily updates feed the public sections.
- Inbox lists locally submitted messages and newsletter interests.
- Settings controls footer contact details and social links, and exports a JSON backup.

As requested, this is a browser-only demo. Login is not server authentication. Data belongs to this browser and origin, does not sync to other devices, and can be lost when browser data is cleared. Forms do not send emails. Donation forms record interest only and process no payment. For consistent storage, use the same local URL each time.

The four old HTML documents are kept in `originals/` under their unchanged names: `1.html`, `3.html`, `index.html`, and `index1.html`. You can delete the entire `originals/` folder without affecting the current website or admin portal. Historical conversion helpers are also archived inside that folder and are not part of the active website workflow.

The active website consists of `3.html`, `index.html`, `admin.html`, `assets/`, and `.htaccess`. Edit these files directly; no build step is needed. `assets/public.js` and `assets/public.css` provide the public design; `assets/site.js` and `assets/site.css` provide the admin design. `assets/demo-data.js` shares browser data between the two. Hero layout and copy use the separate `sjf_hero` key and the scoped `hero-*` assets. The `admin-account.js` and `admin-editors.js` modules support account and editing controls. Existing `sjf_` saved content is retained. The website uses the original Tailwind CDN and Google Fonts, which need an internet connection.

Run `npm ci` then `npm test` for DOM-based navigation, login, saved-content and form checks. These tests do not verify browser layout.
