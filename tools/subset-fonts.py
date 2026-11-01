#!/usr/bin/env python3
"""Rebuild the portfolio's renamed, self-hosted OFL font subsets.

Dependencies: fonttools[woff]==4.61.1 and Brotli==1.2.0.
Run from any directory; pass --download to retrieve pinned upstream sources.
"""

import argparse
import hashlib
import json
import shutil
import urllib.parse
import urllib.request
from pathlib import Path

import fontTools
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "fonts"
REVISION = "6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec"
BASE = f"https://raw.githubusercontent.com/google/fonts/{REVISION}/ofl"
FONTS = [
    {
        "directory": "oldstandardtt",
        "source": "OldStandard-Regular.ttf",
        "sha256": "42717a1280b523a506ca2b0285cca380e77fe214b1f6e3d75a8b925005f19eac",
        "license_sha256": "4faa2d9e2ce0a4b5b37e62ee6fafe474a539b31578f7214ed97cc3503aeb8ebd",
        "upstream_family": "Old Standard TT",
        "family": "Folio Old Standard",
        "output": "old-standard-regular.woff2",
        "license": "OFL-Old-Standard.txt",
    },
    {
        "directory": "imfellenglishsc",
        "source": "IMFeENsc28P.ttf",
        "sha256": "102324fb5434bb5da7963533426b0ad44c85bbc9e7755067535c9d11464a176b",
        "license_sha256": "2a3ca501fc4d5efcad9798531e3e06962b1e20c60e464f6cbd6c17630112c773",
        "upstream_family": "IM FELL English SC",
        "family": "Folio Fell",
        "output": "fell-english-sc.woff2",
        "license": "OFL-IM-Fell-English-SC.txt",
    },
    {
        "directory": "notoseriftc",
        "source": "NotoSerifTC[wght].ttf",
        "sha256": "0077e18f57c6908f4a000969880940bdb0dad057c0e8d98b49dc364c3d1b09c6",
        "license_sha256": "5e0da210fb04058a8c0087985d2d456b931c2579811a49655721d3cf0c36b6d6",
        "upstream_family": "Noto Serif TC",
        "family": "Folio Song",
        "output": "noto-serif-tc-regular.woff2",
        "license": "OFL-Noto-Serif-TC.txt",
        "weight": 400,
    },
]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_file(directory, filename, expected, source_dir, download):
    path = source_dir / directory / filename
    url = f"{BASE}/{directory}/{urllib.parse.quote(filename)}"
    if not path.exists():
        if not download:
            raise SystemExit(f"Missing source {path}; rerun with --download.")
        path.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(url, timeout=60) as response:
            path.write_bytes(response.read())
    if digest(path) != expected:
        raise SystemExit(f"Source hash mismatch: {path}; expected {expected}.")
    return path, url


def rename(font, family):
    # Subsets are modified fonts. Avoid upstream Reserved Font Names while
    # retaining copyright, designer, license text, and license URLs verbatim.
    names = font["name"]
    postscript = family.replace(" ", "") + "-Regular"
    replacements = {
        1: family,
        2: "Regular",
        3: f"AsymptaFolio:1.000:{postscript}",
        4: family + " Regular",
        6: postscript,
        16: family,
        17: "Regular",
        18: family + " Regular",
        20: postscript,
        21: family,
        22: "Regular",
        25: family.replace(" ", ""),
    }
    for record in list(names.names):
        if record.nameID in replacements:
            names.setName(replacements[record.nameID], record.nameID,
                          record.platformID, record.platEncID, record.langID)
    for name_id in (1, 2, 3, 4, 6, 16, 17):
        names.setName(replacements[name_id], name_id, 3, 1, 0x409)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path,
                        default=Path("/tmp/asympta-type-sources"))
    parser.add_argument("--download", action="store_true")
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    content_paths = [ROOT / "index.html", ROOT / "folio.js"]
    content = "".join(path.read_text(encoding="utf-8") for path in content_paths)
    content += "作品集 Selected works 作品 書寫 手帳 頁"
    # Latin Extended, punctuation, and arrows are inexpensive when present.
    latin = (set(range(0x20, 0x0250)) | set(range(0x2000, 0x2070))
             | set(range(0x2190, 0x2200)))
    # Include all non-Latin text actually used in either language, including
    # full-width punctuation. System fallbacks cover symbols absent upstream.
    cjk = {ord(c) for c in content if ord(c) >= 0x2E80}
    cjk |= set(range(0x3000, 0x3040)) | {0x20, 0xA0}

    manifest = {
        "google_fonts_revision": REVISION,
        "fonttools_version": fontTools.__version__,
        "input_files": {str(p.relative_to(ROOT)): digest(p) for p in content_paths},
        "fonts": [],
    }
    for spec in FONTS:
        path, url = source_file(spec["directory"], spec["source"],
                                spec["sha256"], args.source_dir, args.download)
        license_path, license_url = source_file(
            spec["directory"], "OFL.txt", spec["license_sha256"],
            args.source_dir, args.download)
        font = TTFont(path, recalcTimestamp=False)
        if "weight" in spec:
            # Subset first: instancing the full CJK source is unnecessary.
            wanted = cjk
        else:
            wanted = latin
        available = set(font.getBestCmap())
        missing = sorted(wanted - available)
        options = subset.Options()
        options.name_IDs = ["*"]
        options.name_languages = ["*"]
        options.name_legacy = True
        options.recalc_timestamp = False
        options.layout_features = ["*"]
        worker = subset.Subsetter(options=options)
        worker.populate(unicodes=wanted & available)
        worker.subset(font)
        if "weight" in spec:
            font = instantiateVariableFont(font, {"wght": spec["weight"]},
                                           inplace=True, optimize=True)
            font["OS/2"].usWeightClass = spec["weight"]
        rename(font, spec["family"])
        font.flavor = "woff2"
        destination = OUT / spec["output"]
        font.save(destination)
        shutil.copyfile(license_path, OUT / spec["license"])
        check = TTFont(destination)
        actual = sorted(check.getBestCmap())
        manifest["fonts"].append({
            "upstream_family": spec["upstream_family"],
            "family": spec["family"],
            "source_url": url,
            "source_sha256": spec["sha256"],
            "license_url": license_url,
            "license_sha256": spec["license_sha256"],
            "license_file": spec["license"],
            "output": spec["output"],
            "output_sha256": digest(destination),
            "bytes": destination.stat().st_size,
            "weight": spec.get("weight", 400),
            "unicode_codepoints": [f"U+{point:04X}" for point in actual],
            "requested_but_absent_upstream": [f"U+{point:04X}" for point in missing],
        })
        print(f"{spec['output']}: {destination.stat().st_size:,} bytes; "
              f"{len(actual)} mapped codepoints; family {spec['family']}")
    (OUT / "provenance.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
