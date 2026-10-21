# Asympta — Ka Ho Lau

A small stationery desk with two product storybooks.

**Website:** https://okok147.github.io/asympta-portfolio/

Writing is a miniature paper sketchpad; Paperie is a miniature cloth journal. Clicking either object opens its three-page introduction with a slow cover-opening and page-turn animation. The separate app-icon links go directly to the correct App Store listing, without opening the story first.

The storybooks contain real App Store screenshots and the owner's actual 90-second Paperie product recording. The miniature props are AI-generated illustrations, not app screens or photos of physical products. The film has been optimized for the web without audio; visitors choose when to play it. It pauses on page changes, book closure, and when the browser tab is hidden. Writing uses honestly labelled screenshots; no Writing demo video is simulated.

Stories support English and Traditional Chinese, keyboard opening and page navigation, Escape/close, native modal focus containment, focus restoration and reduced motion. Reduced-motion visitors get immediate page changes without cover or page-turn animation. There is no automatic video playback, continuous animation, or 3D runtime dependency.

## Hosting

GitHub Pages publishes the root of `main`. This public repository contains only the website and reviewed presentation assets. The applications' source code stays in its separate private repository. No build process, account, API, analytics, cookies or third-party font download is required. A local language preference is saved in browser local storage when available.

For local preview, run `python3 -m http.server 4173` here.

## Typography and assets

The site requests the locally installed `GB18030 Bitmap` / `GB18030Bitmap` family. Songti, Noto Serif TC and Georgia provide fallbacks for missing fonts or glyphs. No Apple font files are redistributed.

Icons and screenshots come from the public App Store listings retrieved 2026-10-20. The product film is owner-supplied actual app footage; it does not claim that a particular App Store version was tested. Miniature stationery illustrations were created for this site with ImageGen. See `ASSET_SOURCES.json` for provenance and hashes. Private source paths, device identifiers and QA metadata are not included.

© 2026 Ka Ho Lau. Product names, copy, images and artwork belong to their respective owners. No open-source software license is granted by this publication.
