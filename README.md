# Asympta — Ka Ho Lau

A small, paper-inspired personal app portfolio.

**Website:** https://okok147.github.io/asympta-portfolio/

The first screen links directly to Asympta Writing and Asympta Paperie on the App Store. Below it is a quiet, switchable preview: a real Paperie product film in a miniature notebook/tablet frame, and a real Writing screenshot. Writing is labelled as a screenshot, not a video.

The Paperie film is the owner's 90-second product recording, optimized for the web without audio. Playback is visitor-initiated, with native controls, inline playback, and a still poster. It pauses when hidden or when switching to Writing. There is no automatic playback or decorative animation. The frame, pencil, paper clip and folded paper bird are lightweight CSS/SVG decorations; the app footage is unaltered apart from size and encoding.

## Hosting

GitHub Pages publishes the root of `main`. This public repository contains only the website and reviewed presentation assets. The applications' source code stays in its separate private repository. No build process, account, API, analytics, cookies or third-party font download is required. A local language preference is saved in browser local storage when available.

For local preview, run `python3 -m http.server 4173` here.

## Typography and assets

The site requests the locally installed `GB18030 Bitmap` / `GB18030Bitmap` family. Songti, Noto Serif TC and Georgia provide fallbacks for missing fonts or glyphs. No Apple font files are redistributed.

Icons and screenshots are from the public App Store listings retrieved 2026-10-20. The product film is owner-supplied actual app footage; it is not a claim that a particular App Store version was tested. See `ASSET_SOURCES.json` for provenance and hashes. Private source paths, device identifiers and QA metadata are not included.

© 2026 Ka Ho Lau. Product names, copy, images and artwork belong to their respective owners. No open-source software license is granted by this publication.
