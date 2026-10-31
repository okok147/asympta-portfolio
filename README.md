# Asympta — Ka Ho Lau

**Website:** https://okok147.github.io/asympta-portfolio/

An independent software portfolio for **Asympta Writing** and **Asympta Paperie**, with a direct invitation for **projects and collaborations**.

## Editorial Atlas (October 2026)

The site uses a plain white, ink-black typographic treatment inspired by the archival/cartographic editorial approach in Julián Leiss’s October 30, 2026 video essay on Borges's *On Exactitude in Science*: https://x.com/julianleiss/status/2116294919488716958. Original SVG line studies, book typography, hairline rules and restrained annotations form the visual system. No imagery from the original video is reproduced.

The live entry point is `index.html`, with `editorial.css` and `editorial.js`. Older `style.css`, `mini-books.css`, `polish.css` and `app.js` are retained in the repository for rollback/reference, but are **not** loaded by the live site.

Writing and Paperie remain individually accessible through real product stories and direct App Store links. The Paperie video is the actual supplied app recording, manually played, without autoplay. The story dialogue includes English / Traditional Chinese, keyboard navigation, Escape, focus return, and reduced-motion support. The contact link uses the verified portfolio contact address, `hello@everformlab.com`; no contact form, telemetry or third-party analytics are used.

## Hosting

GitHub Pages publishes the root of `main`. No build system, cookies or font download is needed. System serif and mono font stacks retain the editorial character without redistributing font files. A local language preference is saved when browser local storage is available.

For local preview, run `python3 -m http.server 4173` from the repository root.

## Assets

The public repository contains only presentation assets and existing public media. See `ASSET_SOURCES.json` for the provenance of retained assets. App source code is separate.

© 2026 Ka Ho Lau. No open-source license granted.

## Edition 02 — tangible print and bilingual content (31 October 2026)

Reference: Julián Leiss's video essay on Borges, https://x.com/julianleiss/status/2116294919488716958. Nine frames from the original were inspected from 1 to 56 seconds. The website draws from near-white archived paper, fine uneven print ink, technical diagrams, generously tracked typography, and restrained compositional movement. It uses original vector drawings and procedural SVG grain tiles, without copying copyrighted artwork or fonts.

Changes: materially specific feature descriptions in place of generic poetic filler; paper and letterpress grain; entrance motion and SVG ink-path reveal with reduced-motion fallback; complete Chinese/English translations for visible controls, labels, captions and metadata; email contact plus public X/Threads profile links for quick direct messages. The original section headers and publication-style indexes are preserved.

The new entry assets are `editorial.css?v=20261031c`, `editorial.js?v=20261031c`, `assets/paper-grain.svg` and `assets/ink-grain.svg`. Older site assets remain for rollback. No third-party font downloads, tracking, or external scripts.

## Edition 03 — engraved cartography and tactile image treatment

Reference frames of Julián Leiss's Borges essay were inspected at 2, 10, 16, 23, 30, 37, 45 and 53 seconds, alongside earlier samples. Observed visual language: densely etched historical map relief, stippling/line engraving, full-bleed black relief blocks, letterpress-inspired tracked serif headings, tiny folio marginalia, and mostly white scanned backgrounds. General historical process references: Library of Congress (wood engraving vs halftone); Oxford History of Science Museum (stipple engraving); Getty Conservation Institute (halftone screens).

`assets/cartographic-engraving.svg` is entirely original, procedurally generated from mathematical contour rings, radial hachures, cartographic registration marks, a sinuous stream and deterministic stipple. No X-video images, licensed map scans, or font files are copied into the portfolio. `assets/print-screen.svg` adds subtle period-like dot texture to decorative figures. The authentic app screenshots receive only a low-strength printed overlay and light color/contrast treatment; they remain accessible as real screenshots. The procedural paper and ink textures are updated.

Motion gates were changed so that all content remains immediately visible even if IntersectionObserver is paused or unavailable; entering a section briefly re-registers ink, and visible diagrams are drawn with actual stroke animations. Reduced-motion mode disables these animations.
