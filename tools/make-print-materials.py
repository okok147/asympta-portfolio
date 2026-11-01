#!/usr/bin/env python3
"""Rebuild the original glyph pigment and fine engraved security weave.

The physical cotton stock is an image_gen asset with separate provenance.
These two vector materials are deterministic and static. The earlier paper()
generator is retained for archival reproduction, but is no longer invoked.
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
    size = 160
    p = begin(size, '#30312c')
    p.append('<defs><radialGradient id="pigment"><stop stop-color="#a2a08c"/><stop offset="1" stop-color="#a2a08c" stop-opacity="0"/></radialGradient><radialGradient id="dense"><stop stop-color="#0d100c"/><stop offset="1" stop-color="#0d100c" stop-opacity="0"/></radialGradient></defs>')
    # Visible ink-density variation at a 2–6px scale, rather than a nearly
    # solid vector fill with microscopic holes detectable only when enlarged.
    for _ in range(130):
        x, y = r.uniform(0, size), r.uniform(0, size)
        rx, ry = r.uniform(2.2, 8.3), r.uniform(1.1, 5.7)
        opacity = r.uniform(.24, .53)
        for u, v in wrapped(x, y, rx, ry, size):
            p.append(f'<ellipse cx="{u:.1f}" cy="{v:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#pigment)" opacity="{opacity:.3f}"/>')
    for _ in range(58):
        x, y = r.uniform(0, size), r.uniform(0, size)
        rx, ry = r.uniform(1.4, 5.5), r.uniform(.7, 3.6)
        for u, v in wrapped(x, y, rx, ry, size):
            p.append(f'<ellipse cx="{u:.1f}" cy="{v:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#dense)" opacity=".35"/>')
    for group in range(6):
        paths = []
        for _ in range(38):
            x, y, a = r.uniform(0, size), r.uniform(0, size), r.uniform(0, 2 * pi)
            length = r.uniform(.7, 3.5)
            dx, dy = cos(a) * length, sin(a) * length
            for u, v in wrapped(x, y, length, length, size):
                paths.append(f'M{u:.2f} {v:.2f}l{dx:.2f} {dy:.2f}')
        p.append(f'<path d="{" ".join(paths)}" fill="none" stroke="#e6e4d9" stroke-width="{.23 + group * .03:.3f}" stroke-linecap="round" opacity="{.20 + group * .047:.3f}"/>')
    for group in range(5):
        p.append(f'<g fill="#eeede7" opacity="{.22 + group * .055:.3f}">')
        for _ in range(78):
            x, y, radius = r.uniform(0, size), r.uniform(0, size), r.uniform(.18, .64)
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


def security_weave():
    # Original, seamless fine engraving. No note layout, currency symbol,
    # denomination or copied banknote design. Low opacity supports the stock.
    size = 512
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">']
    for direction in (1, -1):
        paths = []
        for y in range(-16, 532, 5):
            commands = [f'M0 {y}']
            for _ in range(8):
                commands.append(f'c10.67 {-3.4*direction:.1f} 21.33 {-3.4*direction:.1f} 32 0s21.33 {3.4*direction:.1f} 32 0')
            paths.append(' '.join(commands))
        transform = '' if direction == 1 else ' transform="rotate(90 256 256)"'
        p.append(f'<path d="{" ".join(paths)}" fill="none" stroke="#555b50" stroke-width=".35" opacity=".105"{transform}/>')
    finish(p, 'security-weave.svg')


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    ink()
    security_weave()
