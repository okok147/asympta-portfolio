# Portfolio font subsets

These are local WOFF2 subsets chosen for the portfolio's literary typography.
They are not identified as the exact fonts in the user's reference image.

| CSS / internal family | Original source | File |
| --- | --- | --- |
| Folio Old Standard | Old Standard TT Regular | old-standard-regular.woff2 |
| Folio Fell | IM FELL English SC | fell-english-sc.woff2 |
| Folio Song | Noto Serif TC, instantiated at weight 400 | noto-serif-tc-regular.woff2 |

All three are licensed under the SIL Open Font License 1.1. The corresponding
`OFL-*.txt` files retain the original license notices. Original copyright,
designer, and license metadata remain embedded. Internal family, full, unique,
and PostScript names have been changed for these modified subsets, including
the IM FELL source's reserved font name.

`provenance.json` records pinned official Google Fonts source URLs, source and
license SHA-256 hashes, output hashes, exact Unicode coverage, byte sizes, and
the content inputs used for the Chinese subset. No remote font service is
required at runtime.

## Rebuild

Use Python 3 with `fonttools[woff]==4.61.1` and `Brotli==1.2.0` installed:

```sh
python tools/subset-fonts.py --source-dir /tmp/asympta-type-sources --download
```

The `--download` flag fetches missing originals from the pinned Google Fonts
revision; every source and license is checked against its recorded SHA-256
before use. With cached sources the same command works offline. The original
large TTF files are intentionally not shipped with the website.

Latin subsets retain supported characters in U+0020–024F, U+2000–206F and
U+2190–21FF. The Traditional Chinese subset derives its characters from
`index.html` and `folio.js`, plus anticipated short section labels. **Rerun the
script after adding Chinese copy.** The manifest lists codepoints absent from
the upstream fonts; CSS should keep an appropriate system serif fallback.

Use CSS `font-weight: 400` for these static files and `font-display: swap`.
Preload only the files needed for the first screen. Font family stacks should
put the chosen Latin face before `Folio Song` so Chinese text uses its intended
companion without replacing Latin lettering.
