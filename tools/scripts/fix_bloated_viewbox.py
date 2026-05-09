#!/usr/bin/env python3
"""
Fix SVGs where the coord-scan viewBox is bloated by outlier path coordinates.
Uses the 2nd–98th percentile range of all coordinate points to exclude stray
far-off-canvas elements (clip paths, guide lines, etc.).

Only re-processes SVGs whose current viewBox exceeds THRESHOLD in either dimension.
"""
import re
import pathlib

ASSETS_DIR = pathlib.Path("assets/pl/city")
THRESHOLD = 3000   # viewBox width or height above this → recompute with percentile
PADDING   = 0.03   # 3% padding on each side


def read_viewbox(content: str) -> tuple[float, float, float, float] | None:
    m = re.search(r'viewBox="([^"]+)"', content)
    if not m:
        return None
    parts = m.group(1).split()
    if len(parts) != 4:
        return None
    try:
        return tuple(map(float, parts))  # type: ignore[return-value]
    except ValueError:
        return None


def percentile(data: list[float], p: float) -> float:
    data = sorted(data)
    idx = (len(data) - 1) * p / 100
    lo = int(idx)
    hi = lo + 1
    if hi >= len(data):
        return data[-1]
    frac = idx - lo
    return data[lo] + frac * (data[hi] - data[lo])


def extract_percentile_bbox(
    content: str, lo: float = 2, hi: float = 98
) -> tuple[float, float, float, float] | None:
    xs: list[float] = []
    ys: list[float] = []

    # Path d attributes — handle scientific notation too
    for d in re.findall(r'\bd="([^"]{1,200000})"', content):
        nums = [
            float(n)
            for n in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?', d)
        ]
        for i in range(0, len(nums) - 1, 2):
            xs.append(nums[i])
            ys.append(nums[i + 1])

    # Polygon/polyline points
    for pts in re.findall(r'\bpoints="([^"]+)"', content):
        nums = [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?', pts)]
        for i in range(0, len(nums) - 1, 2):
            xs.append(nums[i])
            ys.append(nums[i + 1])

    if len(xs) < 10:
        return None

    x0 = percentile(xs, lo)
    x1 = percentile(xs, hi)
    y0 = percentile(ys, lo)
    y1 = percentile(ys, hi)

    w = x1 - x0
    h = y1 - y0
    if w < 1 or h < 1:
        return None

    px, py = w * PADDING, h * PADDING
    return x0 - px, y0 - py, w + 2 * px, h + 2 * py


def rewrite_viewbox(svg_path: pathlib.Path) -> bool:
    content = svg_path.read_text(errors='replace')
    old_vb = read_viewbox(content)
    if old_vb is None:
        return False

    # Only fix if current viewBox is bloated
    if old_vb[2] <= THRESHOLD and old_vb[3] <= THRESHOLD:
        return False

    bbox = extract_percentile_bbox(content)
    if bbox is None:
        return False

    x, y, w, h = bbox
    vb = f"{x:.4g} {y:.4g} {w:.4g} {h:.4g}"

    new_content = re.sub(r'viewBox="[^"]+"', f'viewBox="{vb}"', content, count=1)
    if new_content == content:
        return False

    svg_path.write_text(new_content, encoding='utf-8')
    return True


def main() -> None:
    targets = [
        svg for svg in sorted(ASSETS_DIR.glob('*/*.svg'))
        if (vb := read_viewbox(svg.read_text(errors='replace')[:3000])) is not None
        and (vb[2] > THRESHOLD or vb[3] > THRESHOLD)
    ]

    print(f"Found {len(targets)} SVGs with bloated viewBox (> {THRESHOLD} units)")

    fixed = 0
    for svg_path in targets:
        content = svg_path.read_text(errors='replace')
        old_vb = read_viewbox(content[:3000])
        if rewrite_viewbox(svg_path):
            new_vb = read_viewbox(svg_path.read_text(errors='replace')[:3000])
            print(
                f"  ✔  {svg_path.parent.name:35s}  "
                f"{old_vb[2]:.0f}×{old_vb[3]:.0f}  →  "  # type: ignore[index]
                f"{new_vb[2]:.0f}×{new_vb[3]:.0f}"  # type: ignore[index]
            )
            fixed += 1
        else:
            print(f"  ✗  {svg_path.parent.name}  (could not compute percentile bbox)")

    print(f"\nFixed: {fixed} / {len(targets)}")


if __name__ == "__main__":
    main()
