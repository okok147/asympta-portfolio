# Asympta — Ka Ho Lau

https://okok147.github.io/asympta-portfolio/

A static portfolio, published from the root of `main` by GitHub Pages.

## Live files

- `index.html`: title leaf, contents, actual work plates, correspondence, native image/video reader.
- `folio.css`: one consolidated print design system, responsive layouts and accessibility fallbacks.
- `folio.js`: Chinese/English interface, image reader, keyboard navigation and optional ink-pass animation.
- `assets/fonts/`: self-hosted, renamed OFL font subsets; original licenses and pinned source provenance.
- `assets/folio/cotton-stock.webp`: generated cotton/linen paper material, with prompt and provenance in `cotton-stock-source.json`.
- `assets/folio/security-weave.svg`, `letterpress-ink.svg`: original deterministic engraved underprint and pigment materials.
- `assets/folio/paper-patina.svg`: original deterministic, low-opacity paper-tone variation and minute foxing over the cotton stock.

The 1 November edition interprets the typography and material relationships in the user's reference title page. It does not reproduce its text, illustration, page composition or exact font. The title leaf remains free of decorative illustrations and promotional copy.

No framework, external font service, analytics, autoplay, continuous animation or scroll handler is used. The page and image links remain usable without JavaScript. The chosen language is optionally stored in local storage. The reader uses a native dialog with Escape, focus containment and focus restoration. Product media stays in its original files, with restrained color print treatment in CSS.

## Typography and materials

The display face is a subset of Old Standard TT (`Folio Old Standard`), small capitals use IM FELL English SC (`Folio Fell`), and Chinese uses a static weight-400 subset of Noto Serif TC (`Folio Song`). All three are served locally as WOFF2 and preloaded. Modified font families are renamed, with complete original OFL notices retained. See `assets/fonts/README.md` and `provenance.json` for exact source versions, hashes and rebuilding.

Regenerate the vector ink and weave with `python3 tools/make-print-materials.py`, and the paper-tone variation with `python3 tools/make-paper-patina.py`. Both generators use fixed seeds. The generated cotton bitmap has its own source record and is not overwritten by either script. The current paper combines a 500px repeating cotton tile, a warm ivory 46% tonal wash, a faded static engraved weave and a transparent 1100 × 1400px patina layer. The patina is reduced to 38% of the previous treatment, with drawn abrasion and pressure lines removed. Slow color changes and minute foxing support the fiber surface; wrapped vector marks avoid a hard repeat boundary. These layers cover the page and reader without a full-page filter or animation.

Large headings use an inline SVG impression filter: fixed-seed paper-tooth displacement, a thin capillary ink spread and shallow paper-edge relief. The mobile version is gentler. The 256px pigment tile now uses nearby charcoal tones, diffuse low-contrast variation and fine sparse pores. Explicit abrasion strokes are removed. Letterforms should read whole at first glance, with ink softness and paper tooth becoming apparent on closer viewing. Letters remain real selectable text; small controls remain unfiltered and retain solid ink. Forced colors, increased contrast and print remove all decorative filters and background images. Earlier `paper.svg`, `make-art.py`, `make-letterpress.py` and `render-plates.swift` are archived visual assets/tools, not the current paper treatment.

## Adding work

Add a semantic article and contents link to `index.html`, then add its media to `projects` in `folio.js`. Keep explicit `lang="en"` on Latin work names. Add all interface text to both language dictionaries. Regenerate the font subsets after adding Chinese characters. New images need source provenance; never replace actual app screenshots with simulated UI.

The separate `muzhu/` site, original app media and earlier presentation assets are not changed by this edition. Earlier root CSS/JS remain archived and are not loaded by the home page.

## Verification

`CHROME_PATH=/path/to/chrome node tests/folio-check.mjs .` starts a local server and isolated headless browser. It checks both languages, 320–1440px layouts, loaded fonts, focus and keyboard navigation, actual video playback, reduced motion, no-JavaScript fallbacks, print/forced-color text and missing assets. Screenshots and the report are written outside the published site. No user's browser profile is used.

With Playwright available, `node tests/webkit-print-check.mjs .` checks actual WebKit rendering, both languages and mobile widths, image-reader operation and accessible fallbacks. `WEBKIT_PATH=/path/to/launcher` optionally selects a prepared engine. Paired filter-on/off/restored screenshots prove the glyph filter changes rendered pixels and restores deterministically; computed CSS alone is not treated as rendering evidence.

`tests/acceptance.json` records the exact inputs and checks actually run for the current edition, including a real WebKit-engine render check. Older Swift WebKit checks are retained as historical tooling. Isolated desktop/mobile browser emulation is not physical-device testing.

The Contents regression measures the complete rendered word against its paint bounds, adjacent list and page width at tablet and desktop sizes. This catches glyph clipping inside a correctly sized page, which a page-overflow check alone cannot detect.
