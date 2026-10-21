# Asympta — Ka Ho Lau

A small stationery desk with two product storybooks.

**Website:** https://okok147.github.io/asympta-portfolio/

Writing is an articulated miniature paper sketchpad; Paperie is an articulated miniature cloth journal. Each has separate CSS 3D cover faces, spine, page edges, and paper leaves. Clicking lifts the same object from the desk, hinges its cover open, fans the pages, then expands into its three-page introduction. Closing folds that object and returns it to its original desk position. The transition can be cancelled with Escape, and reduced-motion users go straight to the introduction. The separate app-icon links go directly to the correct App Store listing, without opening the story first.

The storybooks contain real App Store screenshots and the owner's actual 90-second Paperie product recording. The miniature objects use native CSS 3D geometry and ImageGen paper/linen material textures, not app screens or photos of physical products. The earlier illustration cutouts remain as retained assets but are no longer used as the interactive desk objects. The film has been optimized for the web without audio; visitors choose when to play it. It pauses on page changes, book closure, and when the browser tab is hidden. Writing uses honestly labelled screenshots; no Writing demo video is simulated.

Stories support English and Traditional Chinese, keyboard opening and page navigation, Escape/close, native modal focus containment, focus restoration and reduced motion. Reduced-motion visitors get immediate page changes without cover or page-turn animation. There is no automatic video playback, continuous animation, or 3D runtime dependency.

## Hosting

GitHub Pages publishes the root of `main`. This public repository contains only the website and reviewed presentation assets. The applications' source code stays in its separate private repository. No build process, account, API, analytics, cookies or third-party font download is required. A local language preference is saved in browser local storage when available.

For local preview, run `python3 -m http.server 4173` here.

## Typography and assets

The site requests the locally installed `GB18030 Bitmap` / `GB18030Bitmap` family. Songti, Noto Serif TC and Georgia provide fallbacks for missing fonts or glyphs. No Apple font files are redistributed.

Icons and screenshots come from the public App Store listings retrieved 2026-10-20. The product film is owner-supplied actual app footage; it does not claim that a particular App Store version was tested. Miniature stationery illustrations were created for this site with ImageGen. See `ASSET_SOURCES.json` for provenance and hashes. Private source paths, device identifiers and QA metadata are not included.

© 2026 Ka Ho Lau. Product names, copy, images and artwork belong to their respective owners. No open-source software license is granted by this publication.

## Reading and navigation

The home page identifies the two apps by purpose and keeps their icon download links visible. Each story includes a direct App Store link and its app-specific support page. The Paperie player has an explicit play label and starts only on request.

On phone and touch layouts, a short tap on the left or right half of the non-interactive paper area turns to the previous or next page. Taps on links, buttons and native video controls retain their own actions. Scrolling, pointer cancellation, multi-touch, long presses and text selection do not turn pages. The visible previous/next controls and keyboard arrows remain available; phone pagination stays at the bottom of the reading area.
