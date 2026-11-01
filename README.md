# Asympta — Ka Ho Lau

https://okok147.github.io/asympta-portfolio/

A static portfolio, published from the root of `main` by GitHub Pages.

## Live files

- `index.html`: title leaf, contents, actual work plates, correspondence, native image/video reader.
- `folio.css`: one consolidated print design system, responsive layouts and accessibility fallbacks.
- `folio.js`: Chinese/English interface, image reader, keyboard navigation and optional ink-pass animation.
- `assets/fonts/`: self-hosted, renamed OFL font subsets; original licenses and pinned source provenance.
- `assets/folio/paper.svg`, `letterpress-ink.svg`: original, deterministic neutral paper and pigment materials.

The 1 November edition interprets the typography and material relationships in the user's reference title page. It does not reproduce its text, illustration, page composition or exact font. The title leaf remains free of decorative illustrations and promotional copy.

No framework, external font service, analytics, autoplay, continuous animation or scroll handler is used. The page and image links remain usable without JavaScript. The chosen language is optionally stored in local storage. The reader uses a native dialog with Escape, focus containment and focus restoration. Product media stays in its original files, with restrained color print treatment in CSS.

## Typography and materials

The display face is a subset of Old Standard TT (`Folio Old Standard`), small capitals use IM FELL English SC (`Folio Fell`), and Chinese uses a static weight-400 subset of Noto Serif TC (`Folio Song`). All three are served locally as WOFF2 and preloaded. Modified font families are renamed, with complete original OFL notices retained. See `assets/fonts/README.md` and `provenance.json` for exact source versions, hashes and rebuilding.

Regenerate materials with `python3 tools/make-print-materials.py`. Glyph pigment is clipped inside real selectable text; small controls remain solid ink. Paper texture is static. Forced colors, increased contrast and print restore solid text. Earlier `make-art.py`, `make-letterpress.py` and `render-plates.swift` generators belong to the archived visual editions; do not use them to regenerate the current materials.

## Adding work

Add a semantic article and contents link to `index.html`, then add its media to `projects` in `folio.js`. Keep explicit `lang="en"` on Latin work names. Add all interface text to both language dictionaries. Regenerate the font subsets after adding Chinese characters. New images need source provenance; never replace actual app screenshots with simulated UI.

The separate `muzhu/` site, original app media and earlier presentation assets are not changed by this edition. Earlier root CSS/JS remain archived and are not loaded by the home page.

## Verification

`CHROME_PATH=/path/to/chrome node tests/folio-check.mjs .` starts a local server and isolated headless browser. It checks both languages, 320–1440px layouts, loaded fonts, focus and keyboard navigation, actual video playback, reduced motion, no-JavaScript fallbacks, print/forced-color text and missing assets. Screenshots and the report are written outside the published site. No user's browser profile is used.

`tests/acceptance.json` records the exact inputs and checks actually run for the current edition. Older Swift WebKit checks are retained as historical tooling, not evidence for the new edition. Browser emulation is not physical-device testing.
