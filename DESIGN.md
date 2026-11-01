# Printed folio — 1 November 2026

## Reference and interpretation

The user supplied a photograph-like reference of an old title page headed “Del rigor en la ciencia”. Its defining relationships are near-neutral paper, large tracked serif capitals, compact irregular small type, wide unprinted intervals, short rules and a strong hierarchy of text groups. The exact source font cannot be identified reliably from this image. Its resolution and softness are not evidence that all text should be blurred.

This revision interprets those relationships for Asympta. No reference text, emblem or illustration is reproduced. The title leaf is deliberately unillustrated, following the user's previous request to remove the decorative cover image.

## Decisions

- Cool ivory paper replaces the previous yellow-brown stock. Low-frequency pulp variation and fine fibers have different scales; neither moves.
- Actual OFL printing faces replace device-dependent primary fonts. Old Standard TT provides the tall serif title; IM FELL English SC provides naturally irregular small capitals; Noto Serif TC gives Chinese a consistent printed Song-style structure.
- Only display lettering receives pigment interruption. Body copy, controls and captions retain strong readable ink. Letters remain real HTML text.
- A centered title leaf opens into an asymmetric contents page and staggered work plates. The reference's literal line arrangement is not copied.
- All typography, whitespace, plates, correspondence and the viewer use one consolidated stylesheet. Five historical cascaded style generations were removed from the live stylesheet.
- Actual images retain their colors. Flat printed plate boundaries replace ornamental mat frames and brown inset shadows.
- Existing viewer, native video, language switch, store/support/privacy links, X and Threads stay functional.
- No new descriptive paragraphs or slogans are added to the interface. “作品集 / Selected works” is a functional title-page label.

## Acceptance

Inspect desktop and mobile screenshots in both languages; verify genuine font loading, no horizontal clipping at 320px, all viewer interactions, real video decoding, language persistence, semantic no-JavaScript fallbacks, forced colors, printing and reduced motion. Deployment must be checked against the committed source and a successful GitHub Pages deployment. Emulated layouts do not establish physical iPhone/iPad testing.

Original media provenance is retained in `ASSET_SOURCES.json`; font license/source provenance is in `assets/fonts/`. Material generator seeds are fixed. The old visual generators and illustrations are retained only as archive assets.

## Correction: visible ink and banknote-like paper

The user correctly identified that the first edition's large type still read as clean digital outlines. Pigment holes were too small and low in contrast to matter at normal viewing size. The sparse paper fibers likewise did not establish a continuous physical surface. Passing functional checks did not validate that visual requirement.

The correction changes the edge itself with a bounded, static inline SVG filter on large headings. A fixed paper-tooth field creates small irregularities, a very thin ink spread suggests capillary absorption, and a shallow light edge suggests pressure without a conspicuous bevel. Desktop displacement is 1.1; smaller headings and mobile use 0.8. Pigment variation now occurs at visible 2–6px scales, with pores secondary to the letterform. Controls and body copy remain unfiltered.

An original image_gen cotton/linen material supplies dense interlocking short fibers and real-looking local relief. Its first in-page treatment looked too much like unpressed pulp, so the final stock uses a finer 500px tile and a 35% neutral wash. An original low-opacity engraved weave adds the fine-line texture associated with security printing, without any actual banknote, seal, denomination or copied design.

The acceptance standard is direct inspection at normal desktop/mobile scale: ink variation and paper tooth must be visible without enlargement, while small labels remain readable. The final renderer is also checked in WebKit, with filter-on/off pixel evidence and opaque high-contrast/print fallbacks. There is no per-frame canvas, animated turbulence, full-page filter or fixed texture overlay.
