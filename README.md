# The Ninth Anomaly · 第九異常

A literary dystopian SF novella (~48,000 words, 16 chapters), together with the
static website built to publish it online.

> In a city severed from the very concept of nature, the only man who can see
> the cat must trade all of his memories to return it to the world.

## Repository layout

```
books/the-ninth-anomaly/   The manuscript (English) — the source of truth
├── chapters/              chapter-01.md … chapter-16.md
├── full.md                Single-file compilation of all chapters
├── yue/                   Cantonese translation (HK written Chinese narration,
│                          Cantonese dialogue), mirroring chapters/ + full.md,
│                          plus TRANSLATION_BRIEF.md
├── ja/                    Japanese translation (Murakami-style), mirroring
│                          chapters/ + full.md, plus TRANSLATION_BRIEF.md
└── story/                 Working notes: outline, style guide, state tracking

site/                      The reading website (Astro 5, fully static)
```

The manuscript is plain Markdown and is never modified by the site build —
`site/` reads the chapter files in place via Astro's Content Layer.

## The website

- English UI at `/`, Cantonese UI at `/yue/`, Japanese UI at `/ja/`
  (browser-language auto-detect with a manual three-way switcher; each UI
  reads its matching manuscript: en / yue / ja)
- mdBook-style chapter sidebar (sticky on desktop, drawer on mobile)
- Light/dark dual theme, serif literary typography, per-chapter reading time

```sh
cd site
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs static files to site/dist/
```

Deployment: push this repo, then point Netlify (**Base directory = `site`**) or
Vercel (**Root Directory = `site`) at it — build settings are auto-detected.
See [site/README.md](site/README.md) for details.
