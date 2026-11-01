# Printed folio — 1 November 2026

## Reference and interpretation

The user supplied a photograph-like reference of an old title page headed “Del rigor en la ciencia”. Its defining relationships are near-neutral paper, large tracked serif capitals, compact irregular small type, wide unprinted intervals, short rules and a strong hierarchy of text groups. The exact source font cannot be identified reliably from this image. Its resolution and softness are not evidence that all text should be blurred.

This revision interprets those relationships for Asympta. No reference text, emblem or illustration is reproduced. The title leaf is deliberately unillustrated, following the user's previous request to remove the decorative cover image.

## Decisions

- Muted old-ivory paper replaces the previous yellow-brown stock. Low-frequency pulp variation, fine fibers and restrained age marks have different scales; none moves.
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

An original image_gen cotton/linen material supplies dense interlocking short fibers and real-looking local relief. Its first in-page treatment looked too much like unpressed pulp, so this material pass used a finer 500px tile and a 35% neutral wash. An original low-opacity engraved weave adds the fine-line texture associated with security printing, without any actual banknote, seal, denomination or copied design.

The acceptance standard is direct inspection at normal desktop/mobile scale: ink variation and paper tooth must be visible without enlargement, while small labels remain readable. The final renderer is also checked in WebKit, with filter-on/off pixel evidence and opaque high-contrast/print fallbacks. There is no per-frame canvas, animated turbulence, full-page filter or fixed texture overlay.

## Refinement: faded ink and traces of time

The user's next correction asks for aged fading (掉色感) and evidence of time. The printed material was established, but its contrast still suggested comparatively fresh ink. This refinement moves the large type toward warm charcoal, with broad irregular areas of lost pigment, surviving dense deposits and shallow abrasion inside the same letterform. A 256px tile gives those changes enough scale to be visible at ordinary reading size. It does not uniformly fade the whole text, and it does not increase blur or edge displacement. Small labels and navigation keep solid readable ink.

The paper now uses a 46% old-ivory wash over the cotton stock. An original transparent patina adds slow oxidation changes, sparse fine foxing, pale rubbed areas and faint pressure or handling traces. The 1100 × 1400px repeat is much larger than the fiber tile, with boundary-crossing shapes wrapped consistently. The engraved underprint is reduced to 7.5% opacity so it reads as another aged layer. The treatment avoids dramatic stains, burned borders and artificial coffee rings. It applies continuously to the page and image reader.

The patina is a static vector asset generated by `tools/make-paper-patina.py`; the ink and weave remain reproducible through `tools/make-print-materials.py`. The source bitmap is unchanged. Independent normal-size desktop and mobile screenshot review accepted the aging treatment: visible fading and uneven paper tone, with intact letterforms and clear navigation. Automated acceptance still checks both browser engines, interactions and complete removal of material layers for print and forced colors. Physical-device testing is not claimed.

## Correction: natural wear, intact lettering

The user found the preceding fading too obvious and intentional. Its pale patches and short abrasion bands drew attention to the distressing itself. This correction removes explicit ink scratches, reduces the size and contrast of pores, and restricts local pigment variation to nearby charcoal tones. The title's overall ink density is closer to the smaller printed text. Existing edge absorption and fine paper fibers carry the physical print impression.

The paper keeps its cotton surface and ivory tone. The added patina is reduced to 38% of the preceding treatment, and drawn abrasion and pressure traces are removed. Broad, quiet tone changes remain. The acceptance criterion is whole, readable words at first glance, with gentle material variation on closer viewing.

The user also reported a cropped final “s” in “Contents”. Reproduction in Chromium and WebKit showed that the approximately 196px word exceeded the fixed 185px desktop track and 145px tablet track. The text's clipped background ended at the grid item's paint box; removing the SVG filter alone did not fix it. Both tracks now expand to the heading's intrinsic width, with a small inline-end allowance for the ink edge. Existing Chinese minimum spacing is preserved. A regression check must compare the full rendered word against its paint bounds at desktop and tablet widths, since absence of page overflow did not detect this fault.

Independent visual review accepted the restrained material and complete lettering in both engines at 1440px and 768px. The corrected paint box measures about 202.53px for a 196.09px word, with roughly 6.44px of end clearance. The full “s” is visible in the rendered screenshots, and normal-size cover/mobile inspection no longer shows deliberate pale abrasion bands.
