# Asympta — Ka Ho Lau

https://okok147.github.io/asympta-portfolio/

A static portfolio, published from the root of `main` by GitHub Pages.

## Live files

- `index.html`: semantic cover, contents, work plates, correspondence, reader.
- `folio.css`: the complete design system; no previous stylesheets are loaded.
- `folio.js`: bilingual labels, the reader, print-only color image treatment, restrained animation.
- `assets/folio/`: original print textures, archived monochrome plates plus original owner-supplied screenshots, social preview, asset provenance.

No framework, package installation, API, account, analytics or external font service is required. All meaningful content, image fallbacks and contact links work without JavaScript. The selected language is optionally stored in local storage. Native dialog behavior provides Escape, focus containment, and focus restoration. All motion is optional; `prefers-reduced-motion` is respected. Product videos never autoplay. Original media is unchanged.

## Adding work

Add an article and contents entry to `index.html`, then a corresponding entry to the `projects` map in `folio.js`. Keep names in the works section, not in a cover slogan or fixed-count introduction. Update both language dictionaries for authored labels. New images require provenance and an unmodified original alongside any printed reproduction.

## Reproducing the assets

`python3 tools/make-art.py` regenerates deterministic SVG paper/ink textures and icon, while preserving the separately authored `assets/folio/frontispiece.svg` (canonical). On macOS, `swift tools/render-plates.swift .` regenerates the printed reproductions from the original images in `assets/` and records their hashes. System fonts are referenced, never redistributed. The reference video itself and its third-party illustrations are not published.

## Verification

`node tests/folio-check.mjs .` starts an isolated local server and a separate headless Chrome profile, exercises both languages, layout widths, the reader, original media, keyboard navigation, reduced motion, no-JavaScript fallback, and saves screenshots and an inspectable report outside the published site. It does not activate the user's browser or touch its profile.

The separate `muzhu/` site and earlier presentation assets remain untouched. Earlier root CSS/JS are retained for rollback but are not loaded. Copyright remains with the respective owners; this publication does not grant an open-source license to the product artwork.

Native WebKit smoke verification: `swift tests/webkit-check.swift .`. The checked-in `tests/acceptance.json` records 35 Chrome and 27 WebKit checks for the print-only edition; it is a test record, not a guarantee of future compatibility.

## Color print reproduction

The live site displays only the soft-color printed treatment for both the thumbnail plates and the image viewer, with no original-view toggle. `folio.css` applies low-saturation, reduced-contrast grading and delicate screened-ink/paper overlays; the source files remain unchanged. The actual Paperie video also retains its colors and gains the same restrained print treatment without transcoding, autoplay, or blocking native playback controls. Archived monochrome render assets remain in `assets/folio/` for historical comparison but are no longer displayed. A future regenerated plate should preserve color; the archival `tools/render-plates.swift` generator produces the *old monochrome* plates, not the live presentation.

## Printed folio design correction

`assets/folio/frontispiece.svg` is a deterministic, original in-house contour engraving with three ruled folios and dense analog linework. The running head, index, plate captions, contact folio, typography and margins form a single editorial system. The cover stays product-agnostic, and artwork is always fully visible even when animations are paused. Run the Chrome/WebKit acceptance suite for both languages and mobile sizes before publishing.
