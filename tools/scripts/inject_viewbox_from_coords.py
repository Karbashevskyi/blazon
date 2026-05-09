#!/usr/bin/env python3
"""
Inject a viewBox into SVG files that have none, by scanning path/shape coordinates
to compute an approximate bounding box.
"""
import re
import pathlib

ASSETS_DIR = pathlib.Path("assets/pl/city")
PADDING = 0.02  # 2% padding on each side


def has_viewbox(svg_path: pathlib.Path) -> bool:
    return 'viewBox' in svg_path.read_text(errors='replace')[:3000]


def extract_bbox(content: str) -> tuple[float, float, float, float] | None:
    """Return (x, y, width, height) rough bounding box from SVG coordinates."""
    xs: list[float] = []
    ys: list[float] = []

    # Path d attributes
    for d in re.findall(r'\bd="([^"]{1,200000})"', content):
        nums = [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?', d)]
        for i in range(0, len(nums) - 1, 2):
            xs.append(nums[i])
            ys.append(nums[i + 1])

    # Polygon/polyline points
    for pts in re.findall(r'\bpoints="([^"]+)"', content):
        nums = [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?', pts)]
        for i in range(0, len(nums) - 1, 2):
            xs.append(nums[i])
            ys.append(nums[i + 1])

    # Rect/circle/ellipse/line coordinate attributes
    for attr in ('x', 'x1', 'x2', 'cx'):
        for v in re.findall(rf'\b{attr}="(-?\d+(?:\.\d+)?)"', content):
            xs.append(float(v))
    for attr in ('y', 'y1', 'y2', 'cy'):
        for v in re.findall(rf'\b{attr}="(-?\d+(?:\.\d+)?)"', content):
            ys.append(float(v))

    if not xs or not ys:
        return None

    x0, y0 = min(xs), min(ys)
    w = max(xs) - x0
    h = max(ys) - y0

    if w < 1 or h < 1:
        return None

    # Add padding
    pad_x = w * PADDING
    pad_y = h * PADDING
    return x0 - pad_x, y0 - pad_y, w + 2 * pad_x, h + 2 * pad_y


def inject_viewbox(svg_path: pathlib.Path) -> bool:
    content = svg_path.read_text(errors='replace')
    bbox = extract_bbox(content)
    if bbox is None:
        return False

    x, y, w, h = bbox
    vb = f"{x:.4g} {y:.4g} {w:.4g} {h:.4g}"
    # Insert viewBox into the <svg> opening tag
    new_content = re.sub(r'(<svg\b)', rf'\1 viewBox="{vb}"', content, count=1)
    if new_content == content:
        return False

    svg_path.write_text(new_content, encoding='utf-8')
    return True


def main() -> None:
    targets = [
        svg
        for svg in ASSETS_DIR.glob('*/*.svg')
        if not has_viewbox(svg)
    ]
    print(f"Found {len(targets)} SVGs without viewBox to fix via coord scan.")

    fixed = 0
    skipped = 0
    for svg_path in sorted(targets):
        if inject_viewbox(svg_path):
            fixed += 1
            print(f"  ✔  {svg_path.parent.name}/{svg_path.name}")
        else:
            skipped += 1
            print(f"  ✗  {svg_path.parent.name}/{svg_path.name}  (no coords found)")

    print(f"\nFixed: {fixed}, Skipped: {skipped}")


if __name__ == "__main__":
    main()
