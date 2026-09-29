# "Now Playing" — Wayne Club visual direction (2026-09-29)

Concept: most of Wayne's public work is about making content cross languages
(Subtitle-Downloader, Subtitle-Tool, Apple-Dictionary, Plex-Metadata). The site
is framed as a liquid-glass media player: "Every system has a story. I write the
subtitles." Chapters replace plain sections.

- **Hero stage** — drifting multilingual subtitle tracks (SRT timecodes) under a
  draggable glass lens. The lens, navigation and dock use real refraction:
  `app.js` generates a displacement map per element (rounded-rect SDF, bezel
  pushed along the surface normal) and applies it through an SVG filter in
  `backdrop-filter`. Only Chromium renders SVG filters there; other browsers
  get blur + saturate. The lens drifts when idle, and moves with arrow keys.
- **Dock** — a fixed glass chapter scrubber (Intro, Work, Episodes, About,
  Credits) with a timecode; its play/pause button pauses every animation
  (WCAG 2.2.2). Reduced-motion users start paused.
- **Chapter 01 · Library** — bento grid of working miniatures: subtitle track
  switcher, dictionary lookup with speech synthesis, Simplified→Traditional
  (Taiwan phrasing) converter, a PassBar evidence question, a SpellHop word
  game, Mieru aspect highlighting, Plex poster fetch and a route map.
- **Chapter 02 · Episodes** — career as episodes with a runtime bar.
- **Chapter 03 · Glossary** — "Wayne Wei" as a dictionary entry.
- **Chapter 04 · Credits** — contact card with a rolling credits panel.
- Palette: bright cool white with static blue/violet/mint/pink light fields;
  no yellow. Dark mode is near-black with the same hues dimmed.
- Performance: the background does not animate (animated backdrops force every
  glass pane to re-blur each frame). Demo loops run only while on screen.
- Language: the CC button opens "Subtitles & language". Text marked
  `translate="no"` (native language names, demo subtitles, stage words) is
  skipped by both `i18n.js` and `scripts/build-pages.py`.

Files: `src/index.html`, `assets/theme.css`, `assets/app.js`, `assets/i18n.js`.
Older stylesheets (`portfolio.css`, `native.css`, `monochrome.css`, `clear.css`,
`type.css`, `warm.css`) and scripts (`portfolio.js`, `language-menu.js`,
`glass.js`) are no longer loaded.

References: Apple HIG Materials, WWDC25 "Meet Liquid Glass".
