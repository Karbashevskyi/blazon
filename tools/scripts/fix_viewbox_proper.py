#!/usr/bin/env python3
"""
Re-compute viewBox for all SVGs using a proper path command parser.
Fixes viewBoxes that:
  - are significantly larger than content (>30% excess area)
  - clip content (content extends beyond the declared viewBox)
"""
import pathlib, json, re

CITY_DIR = pathlib.Path('assets/pl/city')
PAD = 0.04
THRESHOLD = 0.30


def proper_coords_from_svg(svg):
    xs, ys = [], []
    for d in re.findall(r'\bd="([^"]*)"', svg):
        _parse_path(d, xs, ys)
    for elem in re.finditer(r'<rect\b[^>]*/?>|<rect\b[^>]*>.*?</rect>', svg, re.DOTALL):
        e = elem.group()
        attrs = dict(re.findall(r'\b(x|y|width|height)\s*=\s*"([^"]*)"', e))
        try:
            x=float(attrs.get('x',0)); y=float(attrs.get('y',0))
            w=float(attrs.get('width',0)); h=float(attrs.get('height',0))
            xs+=[x,x+w]; ys+=[y,y+h]
        except ValueError: pass
    for elem in re.finditer(r'<circle\b[^>]*/?>|<circle\b[^>]*>.*?</circle>', svg, re.DOTALL):
        e = elem.group()
        attrs = dict(re.findall(r'\b(cx|cy|r)\s*=\s*"([^"]*)"', e))
        try:
            cx=float(attrs.get('cx',0)); cy=float(attrs.get('cy',0)); r=float(attrs.get('r',0))
            xs+=[cx-r,cx+r]; ys+=[cy-r,cy+r]
        except ValueError: pass
    for elem in re.finditer(r'<ellipse\b[^>]*/?>|<ellipse\b[^>]*>.*?</ellipse>', svg, re.DOTALL):
        e = elem.group()
        attrs = dict(re.findall(r'\b(cx|cy|rx|ry)\s*=\s*"([^"]*)"', e))
        try:
            cx=float(attrs.get('cx',0)); cy=float(attrs.get('cy',0))
            rx=float(attrs.get('rx',0)); ry=float(attrs.get('ry',0))
            xs+=[cx-rx,cx+rx]; ys+=[cy-ry,cy+ry]
        except ValueError: pass
    for pts_match in re.finditer(r'points\s*=\s*"([^"]*)"', svg):
        pts=[float(p) for p in re.findall(r'[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?', pts_match.group(1))]
        for i in range(0,len(pts)-1,2): xs.append(pts[i]); ys.append(pts[i+1])
    return xs, ys


def _parse_path(d, xs, ys):
    tokens = re.findall(r'[MmZzLlHhVvCcSsQqTtAa]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?', d)
    cx, cy = 0.0, 0.0
    sx, sy = 0.0, 0.0
    i, cmd = 0, 'M'
    while i < len(tokens):
        t = tokens[i]
        if t.isalpha():
            cmd = t; i += 1; continue
        try:
            if cmd in ('M','m'):
                x,y=float(tokens[i]),float(tokens[i+1])
                if cmd=='m': x+=cx; y+=cy
                cx,cy=x,y; sx,sy=x,y; xs.append(x); ys.append(y); i+=2
                cmd='L' if cmd=='M' else 'l'
            elif cmd in ('L','l'):
                x,y=float(tokens[i]),float(tokens[i+1])
                if cmd=='l': x+=cx; y+=cy
                cx,cy=x,y; xs.append(x); ys.append(y); i+=2
            elif cmd in ('H','h'):
                x=float(tokens[i])
                if cmd=='h': x+=cx
                cx=x; xs.append(x); ys.append(cy); i+=1
            elif cmd in ('V','v'):
                y=float(tokens[i])
                if cmd=='v': y+=cy
                cy=y; xs.append(cx); ys.append(y); i+=1
            elif cmd in ('C','c'):
                x1,y1,x2,y2,x,y=[float(tokens[i+j]) for j in range(6)]
                if cmd=='c': x1+=cx;y1+=cy;x2+=cx;y2+=cy;x+=cx;y+=cy
                for px,py in [(x1,y1),(x2,y2),(x,y)]: xs.append(px);ys.append(py)
                cx,cy=x,y; i+=6
            elif cmd in ('S','s'):
                x2,y2,x,y=[float(tokens[i+j]) for j in range(4)]
                if cmd=='s': x2+=cx;y2+=cy;x+=cx;y+=cy
                for px,py in [(x2,y2),(x,y)]: xs.append(px);ys.append(py)
                cx,cy=x,y; i+=4
            elif cmd in ('Q','q'):
                x1,y1,x,y=[float(tokens[i+j]) for j in range(4)]
                if cmd=='q': x1+=cx;y1+=cy;x+=cx;y+=cy
                for px,py in [(x1,y1),(x,y)]: xs.append(px);ys.append(py)
                cx,cy=x,y; i+=4
            elif cmd in ('T','t'):
                x,y=float(tokens[i]),float(tokens[i+1])
                if cmd=='t': x+=cx; y+=cy
                cx,cy=x,y; xs.append(x); ys.append(y); i+=2
            elif cmd in ('A','a'):
                rx,ry=abs(float(tokens[i])),abs(float(tokens[i+1]))
                x,y=float(tokens[i+5]),float(tokens[i+6])
                if cmd=='a': x+=cx; y+=cy
                xs.extend([cx-rx,cx+rx,x-rx,x+rx]); ys.extend([cy-ry,cy+ry,y-ry,y+ry])
                xs.append(x); ys.append(y); cx,cy=x,y; i+=7
            elif cmd in ('Z','z'):
                cx,cy=sx,sy
            else:
                i+=1
        except (IndexError, ValueError):
            i+=1


def compute_viewbox(xs, ys):
    if not xs or not ys: return None
    x0,x1=min(xs),max(xs); y0,y1=min(ys),max(ys)
    w,h=x1-x0,y1-y0
    if w<0.1 or h<0.1: return None
    px,py=w*PAD,h*PAD
    return x0-px, y0-py, w+2*px, h+2*py


fixed = 0
skipped_no_vb = 0
skipped_ok = 0
errors = []

for json_file in sorted(CITY_DIR.glob('*/index.json')):
    city = json_file.parent.name
    data = json.loads(json_file.read_text())
    svg = data.get('svg', '')

    m = re.search(r'<svg\b[^>]*>', svg, re.DOTALL)
    if not m:
        errors.append(f"{city}: no <svg> tag"); continue

    tag = m.group()
    vb_match = re.search(r'viewBox="([^"]+)"', tag)
    if not vb_match:
        skipped_no_vb += 1; continue

    xs, ys = proper_coords_from_svg(svg)
    if not xs or not ys:
        errors.append(f"{city}: no coords found"); continue

    vb = [float(v) for v in vb_match.group(1).split()]
    vb_x, vb_y, vb_w, vb_h = vb
    vb_x2, vb_y2 = vb_x + vb_w, vb_y + vb_h

    cx0,cx1=min(xs),max(xs); cy0,cy1=min(ys),max(ys)
    cw,ch=cx1-cx0,cy1-cy0

    clips = (cx0 < vb_x - 1 or cy0 < vb_y - 1 or cx1 > vb_x2 + 1 or cy1 > vb_y2 + 1)
    content_area = cw * ch if cw > 0.1 and ch > 0.1 else 1.0
    declared_area = vb_w * vb_h
    too_large = content_area > 0.1 and (declared_area / content_area) > (1.0 + THRESHOLD)

    if not clips and not too_large:
        skipped_ok += 1; continue

    reason = []
    if clips: reason.append("clips")
    if too_large: reason.append(f"ratio={declared_area/content_area:.1f}x")

    result = compute_viewbox(xs, ys)
    if result is None:
        errors.append(f"{city}: degenerate bbox"); continue

    x0,y0,w,h = result
    new_vb = f"{x0:.2f} {y0:.2f} {w:.2f} {h:.2f}"
    old_vb = vb_match.group(1)

    new_tag = tag[:vb_match.start()] + f'viewBox="{new_vb}"' + tag[vb_match.end():]
    new_svg = svg[:m.start()] + new_tag + svg[m.end():]
    data['svg'] = new_svg
    json_file.write_text(json.dumps(data, ensure_ascii=False, indent=2))

    for svg_file in json_file.parent.glob('*.svg'):
        orig = svg_file.read_text()
        m2 = re.search(r'<svg\b[^>]*>', orig, re.DOTALL)
        if m2 and re.search(r'viewBox="[^"]+"', m2.group()):
            new_tag2 = re.sub(r'viewBox="[^"]+"', f'viewBox="{new_vb}"', m2.group())
            svg_file.write_text(orig[:m2.start()] + new_tag2 + orig[m2.end():])

    fixed += 1
    print(f"  ✔ {city} ({', '.join(reason)}): {old_vb!r}  →  {new_vb!r}")

print(f"\n{'='*60}")
print(f"Fixed:        {fixed}")
print(f"Already OK:   {skipped_ok}")
print(f"No viewBox:   {skipped_no_vb}")
if errors:
    print(f"Errors ({len(errors)}):")
    for e in errors: print(f"  {e}")
