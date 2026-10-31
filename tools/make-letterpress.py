#!/usr/bin/env python3
"""Deterministic ink pigment tile for antique letterpress / intaglio type.

Use as a clipped background inside real HTML text. No rasterized glyphs,
remote font dependency, runtime canvas or animations.
"""
from pathlib import Path
from random import Random
from math import cos, sin, pi
r=Random(311026)
size=288
lines=['<svg xmlns="http://www.w3.org/2000/svg" width="288" height="288" viewBox="0 0 288 288">']
lines.append('<rect width="288" height="288" fill="#251a13"/>')
# Slight irregular variations in pigment thickness. The black ink is always
# substantially darker than the paper, including in a small serif.
for i in range(48):
    x=r.uniform(0,size);y=r.uniform(0,size)
    w=r.uniform(3,18);h=r.uniform(.6,3.4)
    a=r.uniform(-55,55)
    c=('#604732' if i%3 else '#120c09')
    opacity=r.uniform(.025,.09)
    lines.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{w:.1f}" ry="{h:.1f}" fill="{c}" opacity="{opacity:.3f}" transform="rotate({a:.1f} {x:.1f} {y:.1f})"/>')
# Small dry fibers: visible where the metal type gives slightly less pigment.
lines.append('<g fill="none" stroke="#c8ac87" stroke-linecap="round">')
for i in range(860):
    x=r.uniform(0,size);y=r.uniform(0,size)
    a=r.uniform(0,2*pi)
    length=r.uniform(.7,4.2)
    dx=cos(a)*length;dy=sin(a)*length
    width=r.uniform(.20,.62)
    opacity=r.uniform(.13,.38) if i%6 else r.uniform(.40,.61)
    lines.append(f'<path d="M{x:.1f} {y:.1f}l{dx:.2f} {dy:.2f}" stroke-width="{width:.2f}" opacity="{opacity:.2f}"/>')
lines.append('</g>')
# A few slightly larger dry spots; concentrated but never enough to remove
# the essential detail of a CJK glyph at normal text sizes.
lines.append('<g fill="#b99c79">')
for i in range(540):
    x=r.uniform(0,size);y=r.uniform(0,size)
    radius=r.uniform(.23,.68)
    opacity=r.uniform(.13,.42)
    lines.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{radius:.2f}" opacity="{opacity:.2f}"/>')
lines.append('</g>')
# Microscopic ink-rich edges: dark plate pigment migrates into paper pores.
lines.append('<g fill="#0b0806">')
for i in range(220):
    x=r.uniform(0,size);y=r.uniform(0,size)
    radius=r.uniform(.15,.6)
    opacity=r.uniform(.06,.21)
    lines.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{radius:.2f}" opacity="{opacity:.2f}"/>')
lines.append('</g></svg>')
target=Path(__file__).resolve().parents[1]/'assets/folio/letterpress-ink.svg'
target.write_text(''.join(lines), encoding='utf-8')
print(f'{target.name}: {target.stat().st_size} bytes')