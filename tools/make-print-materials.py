#!/usr/bin/env python3
"""Rebuild the original, seamless folio paper and glyph-pigment materials.

Deterministic vectors only: no runtime canvas, animation, source photograph,
external resource, or SVG filter. Paper is drawn at 768 CSS px; the ink tile
at 192 CSS px. Tiny marks describe fibres and pores, not damaged lettering.
"""
from math import cos, sin, pi
from pathlib import Path
from random import Random

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "folio"


def begin(size, background):
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">',
        f'<rect width="{size}" height="{size}" fill="{background}"/>',
    ]


def wrapped(x, y, rx, ry, size):
    """Duplicate only shapes crossing a tile boundary, preserving the seam."""
    for dx in (-size, 0, size):
        for dy in (-size, 0, size):
            if x + dx + rx >= 0 and x + dx - rx <= size and y + dy + ry >= 0 and y + dy - ry <= size:
                yield x + dx, y + dy


def finish(parts, name):
    parts.append('</svg>')
    target = OUT / name
    target.write_text(''.join(parts), encoding='utf-8')
    print(f'{name}: {target.stat().st_size:,} bytes')


def paper():
    r = Random(20261101)
    size = 768
    p = begin(size, '#eeede7')
    p.append('<defs><radialGradient id="pulp"><stop stop-color="#8e8d80"/><stop offset="1" stop-color="#8e8d80" stop-opacity="0"/></radialGradient><radialGradient id="light"><stop stop-color="#fffef9"/><stop offset="1" stop-color="#fffef9" stop-opacity="0"/></radialGradient></defs>')
    # Diffuse variations in the density of the paper stock, rather than stains.
    for i in range(36):
        x, y = r.uniform(0, size), r.uniform(0, size)
        rx, ry = r.uniform(70, 190), r.uniform(35, 145)
        opacity = r.uniform(.022, .046) if i % 2 else r.uniform(.11, .23)
        color = 'pulp' if i % 2 else 'light'
        for u, v in wrapped(x, y, rx, ry, size):
            p.append(f'<ellipse cx="{u:.1f}" cy="{v:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#{color})" opacity="{opacity:.3f}"/>')
    # Bent fibre fragments are sparse and differently oriented. Pair dark
    # and light fragments to suggest embedded fibres, not surface scratches.
    for group in range(10):
        paths = []
        color = '#77776b' if group % 2 else '#fffef8'
        opacity = (.10 + group * .009) if group % 2 else (.23 + group * .018)
        width = .24 + (group % 4) * .085
        for _ in range(58):
            x, y, a = r.uniform(0, size), r.uniform(0, size), r.uniform(0, 2 * pi)
            length = r.uniform(.8, 6.2)
            dx, dy = cos(a) * length, sin(a) * length
            bend = r.uniform(-.45, .45)
            for u, v in wrapped(x, y, length, length, size):
                paths.append(f'M{u:.1f} {v:.1f}q{dx * .5 + bend:.2f} {dy * .5 - bend:.2f} {dx:.2f} {dy:.2f}')
        p.append(f'<path d="{" ".join(paths)}" fill="none" stroke="{color}" stroke-width="{width:.3f}" stroke-linecap="round" opacity="{opacity:.3f}"/>')
    p.append('<g fill="#68685c" opacity=".09">')
    for _ in range(280):
        x, y, radius = r.uniform(0, size), r.uniform(0, size), r.uniform(.13, .38)
        for u, v in wrapped(x, y, radius, radius, size):
            p.append(f'<circle cx="{u:.1f}" cy="{v:.1f}" r="{radius:.2f}"/>')
    p.append('</g>')
    finish(p, 'paper.svg')


def ink():
    r = Random(192011126)
    size = 192
    p = begin(size, '#302f2b')
    p.append('<defs><radialGradient id="pigment"><stop stop-color="#79786c"/><stop offset="1" stop-color="#79786c" stop-opacity="0"/></radialGradient></defs>')
    # Slowly varying ink pressure is subordinate to each real font outline.
    for _ in range(24):
        x, y = r.uniform(0, size), r.uniform(0, size)
        rx, ry = r.uniform(4, 17), r.uniform(1, 7)
        opacity = r.uniform(.07, .15)
        for u, v in wrapped(x, y, rx, ry, size):
            p.append(f'<ellipse cx="{u:.1f}" cy="{v:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#pigment)" opacity="{opacity:.3f}"/>')
    for group in range(6):
        paths = []
        for _ in range(38):
            x, y, a = r.uniform(0, size), r.uniform(0, size), r.uniform(0, 2 * pi)
            length = r.uniform(.35, 2.5)
            dx, dy = cos(a) * length, sin(a) * length
            for u, v in wrapped(x, y, length, length, size):
                paths.append(f'M{u:.2f} {v:.2f}l{dx:.2f} {dy:.2f}')
        p.append(f'<path d="{" ".join(paths)}" fill="none" stroke="#e6e4d9" stroke-width="{.16 + group * .025:.3f}" stroke-linecap="round" opacity="{.13 + group * .037:.3f}"/>')
    for group in range(5):
        p.append(f'<g fill="#eeede7" opacity="{.18 + group * .045:.3f}">')
        for _ in range(78):
            x, y, radius = r.uniform(0, size), r.uniform(0, size), r.uniform(.13, .42)
            for u, v in wrapped(x, y, radius, radius, size):
                p.append(f'<circle cx="{u:.2f}" cy="{v:.2f}" r="{radius:.2f}"/>')
        p.append('</g>')
    p.append('<g fill="#12120f" opacity=".22">')
    for _ in range(95):
        x, y, radius = r.uniform(0, size), r.uniform(0, size), r.uniform(.15, .4)
        for u, v in wrapped(x, y, radius, radius, size):
            p.append(f'<circle cx="{u:.2f}" cy="{v:.2f}" r="{radius:.2f}"/>')
    p.append('</g>')
    finish(p, 'letterpress-ink.svg')


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    paper()
    ink()
