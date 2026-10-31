from pathlib import Path
from math import sin,cos,pi
import random
root=Path(__file__).resolve().parents[1];assets=root/'assets/folio';assets.mkdir(parents=True,exist_ok=True);rng=random.Random(2718)
def path(points):return 'M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in points)
# A new, decorative exploded printing plate; no borrowed illustration or fake empirical data.
parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 285" fill="none" stroke="currentColor" stroke-linejoin="round">']
def plane(u,v,k):return (48+247*u+84*v,103+42*v-53*u+61*k)
for i in [0,1,2]:
 a=plane(0,0,0);b=plane(0,0,2)
# registered construction lines
parts.append('<g opacity=".38" stroke-width=".5" stroke-dasharray="2 4">')
for u,v in [(0,0),(1,0),(0,1),(1,1)]:parts.append(f'<path d="{path([plane(u,v,0),plane(u,v,2)])}"/>')
parts.append('</g>')
for k in [2,1,0]:
 parts.append(f'<g class="moving-layer" data-depth="{k}" stroke-width=".7">')
 corners=[plane(0,0,k),plane(1,0,k),plane(1,1,k),plane(0,1,k),plane(0,0,k)]
 parts.append(f'<path d="{path(corners)}" fill="#fafaf8"/>')
 inner=[plane(.027,.06,k),plane(.97,.06,k),plane(.97,.94,k),plane(.027,.94,k),plane(.027,.06,k)]
 parts.append(f'<path d="{path(inner)}" stroke-width=".35"/>')
 if k==0:
  # hachured contour island, deliberately engraved rather than a perfect screen plot
  for n in range(11):
   r=.12+n*.021
   ps=[]
   for s in range(181):
    a=s/180*2*pi;shape=1+.1*sin(a*5+.7)+.046*sin(a*11)+.016*sin(a*29+n*.1)
    u=.48+r*cos(a)*shape;v=.51+r*sin(a)*shape
    ps.append(plane(u,v,k))
   parts.append(f'<path d="{path(ps)}" stroke-width="{.72 if n%3==0 else .34}"/>')
  for n in range(160):
   a=rng.random()*2*pi;r=.15+rng.random()*.19
   u=.48+r*cos(a);v=.51+r*sin(a)
   ps=[plane(u,v,k),plane(u+.023*cos(a),v+.023*sin(a),k)]
   parts.append(f'<path d="{path(ps)}" stroke-width=".35" opacity=".76"/>')
 elif k==1:
  for row in range(9):
   ps=[plane(.09+j*.008,.15+row*.082+sin(j*.19+row)*.024,k) for j in range(102)]
   parts.append(f'<path d="{path(ps)}" stroke-width=".43" opacity=".7"/>')
  ps=[plane(.12+j*.007,.5+.2*sin(j*.045),k) for j in range(110)]
  parts.append(f'<path d="{path(ps)}" stroke-width="1.55"/>')
 else:
  for n in range(15):
   v=.12+n*.054
   ps=[plane(.08,v,k),plane(.92,v,k)]
   parts.append(f'<path d="{path(ps)}" stroke-width=".25" opacity=".5"/>')
  for n in range(8):
   u=.1+n*.113
   parts.append(f'<path d="{path([plane(u,.12,k),plane(u,.88,k)])}" stroke-width=".25" opacity=".5"/>')
  ps=[plane(.13+j*.006,.82-.62/(1+j*.035),k) for j in range(120)]
  parts.append(f'<path d="{path(ps)}" stroke-width="1.05"/>')
 for j in range(12):
  p=plane(.05+j*.08,0,k);q=plane(.05+j*.08,-.025,k)
  parts.append(f'<path d="{path([p,q])}" stroke-width=".4"/>')
 parts.append('</g>')
parts.append('<g fill="currentColor" stroke="none" font-family="Baskerville,Georgia,serif" font-size="9"><text x="29" y="104">I</text><text x="22" y="166">II</text><text x="16" y="226">III</text><text x="214" y="274" font-size="7">a.</text></g></svg>')
svg=''.join(parts)
html=(root/'index.html').read_text()
if '<!--FRONTISPIECE-->' in html:
 html=html.replace('<!--FRONTISPIECE-->',svg)
else:
 start=html.index('<svg',html.index('class="frontispiece"'))
 end=html.index('</svg>',start)+len('</svg>')
 html=html[:start]+svg+html[end:]
(root/'index.html').write_text(html)
# Quiet, neutral rag-paper, with a fixed microstructure. No sepia or animated noise.
paper='''<svg xmlns="http://www.w3.org/2000/svg" width="680" height="680" viewBox="0 0 680 680"><defs><filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="27" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".13" intercept=".87"/><feFuncG type="linear" slope=".13" intercept=".87"/><feFuncB type="linear" slope=".13" intercept=".87"/></feComponentTransfer></filter></defs><rect width="680" height="680" fill="#fafaf8"/><rect width="680" height="680" filter="url(#p)" opacity=".27"/><g fill="none" stroke="#53534c" stroke-width=".25" opacity=".13">'''
for i in range(1100):
 x=rng.random()*680;y=rng.random()*680;paper+=f'<path d="M{x:.1f} {y:.1f}l{rng.uniform(.2,2.4):.1f} {rng.uniform(-1,1):.1f}"/>'
paper+='</g></svg>';(assets/'paper.svg').write_text(paper)
ink='''<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><filter id="i" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".93" numOctaves="2" seed="13" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".12" intercept=".06"/><feFuncG type="linear" slope=".12" intercept=".06"/><feFuncB type="linear" slope=".12" intercept=".06"/></feComponentTransfer></filter></defs><rect width="256" height="256" fill="#252521"/><rect width="256" height="256" filter="url(#i)" opacity=".8"/><g fill="#c9c9be" opacity=".19">'''
for i in range(210):ink+=f'<circle cx="{rng.random()*256:.1f}" cy="{rng.random()*256:.1f}" r="{rng.uniform(.1,.4):.2f}"/>'
ink+='</g></svg>';(assets/'ink.svg').write_text(ink)
(assets/'mark.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#fafaf8"/><path d="M11 52h43M12 51V11M15 44c5-20 9-29 16-30s9 24 21 29" fill="none" stroke="#242420" stroke-width="1.8"/><path d="M15 50c8-16 12-26 37-28" fill="none" stroke="#242420" stroke-width="1.2"/></svg>')
print('svg',len(svg),'paper',len(paper),'ink',len(ink))
