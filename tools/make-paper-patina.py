#!/usr/bin/env python3
"""Generate the portfolio's static, transparent paper ageing layer.

No raster input, runtime filters, external assets, or animation. All marks are
deterministic. Large fields and crossing marks wrap to the opposite tile edge.
"""

import hashlib
import math
import random
from pathlib import Path

WIDTH, HEIGHT = 1100, 1400
SEED = 202611013
OUT = Path(__file__).resolve().parent.parent / "assets/folio/paper-patina.svg"
rng = random.Random(SEED)
defs, shapes = [], []


def n(value):
    return f"{value:.3f}".rstrip("0").rstrip(".")


def wrapped(mark, x, y, reach_x, reach_y):
    """Copy only shapes crossing a tile boundary; SVG clips outside the tile."""
    for dx in (-WIDTH, 0, WIDTH):
        for dy in (-HEIGHT, 0, HEIGHT):
            if x + dx + reach_x < 0 or x + dx - reach_x > WIDTH:
                continue
            if y + dy + reach_y < 0 or y + dy - reach_y > HEIGHT:
                continue
            shapes.append(f'<g transform="translate({dx} {dy})">{mark}</g>')


def field(name, x, y, rx, ry, angle, color, opacity):
    # Elliptical, multi-stop fields remain soft without expensive SVG filters.
    defs.append(
        f'<radialGradient id="{name}">'
        f'<stop offset="0" stop-color="{color}" stop-opacity="{n(opacity)}"/>'
        f'<stop offset=".28" stop-color="{color}" stop-opacity="{n(opacity*.87)}"/>'
        f'<stop offset=".67" stop-color="{color}" stop-opacity="{n(opacity*.3)}"/>'
        f'<stop offset="1" stop-color="{color}" stop-opacity="0"/>'
        '</radialGradient>'
    )
    mark = (f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(rx)}" ry="{n(ry)}" '
            f'transform="rotate({n(angle)} {n(x)} {n(y)})" fill="url(#{name})"/>')
    # Conservative bounds include every rotated edge, ensuring seamless wrap.
    wrapped(mark, x, y, max(rx, ry), max(rx, ry))


# Uneven, restrained oxidation rather than a uniform sepia tint. These broad
# overlapping fields are deliberately much larger than the cotton-stock grain.
for args in [
    ("age-a", 110, 205, 440, 325, -19, "#9c8150", .112),
    ("age-b", 1030, 1100, 535, 405, 23, "#a68b60", .091),
    ("age-c", 620, 610, 380, 585, -31, "#958774", .049),
    ("age-d", 390, 1365, 470, 260, 8, "#b49c73", .071),
    ("age-e", 825, 305, 260, 190, 37, "#ad976c", .036),
]:
    field(*args)

# Pale regions simulate repeatedly handled, flattened paper and differential
# exposure. Because they carry opacity they slightly quiet the underlying grain.
for args in [
    ("worn-a", 435, 340, 285, 190, -24, "#fffff5", .25),
    ("worn-b", 1055, 740, 235, 350, 16, "#faf9ed", .2),
    ("worn-c", 165, 1150, 195, 265, -13, "#fffff7", .18),
    ("worn-d", 675, 1040, 255, 116, -9, "#fffef2", .13),
]:
    field(*args)

# Sparse tiny foxing, with soft translucent halos. No large stains or rings.
for index in range(90):
    if index < 48:
        cx, cy = [(135, 330), (910, 1080), (460, 1305)][index % 3]
        x, y = rng.gauss(cx, 115) % WIDTH, rng.gauss(cy, 145) % HEIGHT
    else:
        x, y = rng.uniform(0, WIDTH), rng.uniform(0, HEIGHT)
    radius = rng.uniform(.28, 1.05) if index % 11 else rng.uniform(1.1, 1.45)
    opacity = rng.uniform(.055, .145)
    mark = (
        f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(radius*2.15)}" ry="{n(radius*1.8)}" '
        f'fill="#b39a72" opacity="{n(opacity*.23)}"/>'
        f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(radius)}" ry="{n(radius*rng.uniform(.56,1))}" '
        f'fill="#94764d" opacity="{n(opacity)}"/>'
    )
    wrapped(mark, x, y, radius * 2.2, radius * 2.2)

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" '
    f'viewBox="0 0 {WIDTH} {HEIGHT}" fill="none">\n'
    '<title>Subtle paper patina</title>\n'
    '<desc>Quiet uneven ivory tone and minute foxing. Transparent, static '
    'vector artwork; no drawn scratches, filter or animation.</desc>\n'
    '<defs>\n' + '\n'.join(defs) + '\n</defs>\n<g opacity=".38">\n' + '\n'.join(shapes) + '\n</g>\n</svg>\n'
)
OUT.write_text(svg, encoding="utf-8")
print(f"{OUT.name}: {OUT.stat().st_size:,} bytes")
print(f"SHA-256: {hashlib.sha256(OUT.read_bytes()).hexdigest()}")
