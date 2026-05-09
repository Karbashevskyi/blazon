#!/usr/bin/env python3
"""
Re-download SVG files that are missing a viewBox attribute.
Uses the source URL stored in each *.meta.json sidecar file.
"""

import asyncio
import json
import re
import subprocess
import sys
import tempfile
import os
from pathlib import Path

import aiohttp

ASSETS_DIR = Path("assets/pl/city")
SVGO_CMD = ["npx", "--yes", "svgo", "--multipass"]
CONCURRENCY = 12


def _parse_length(value: str) -> float | None:
    value = value.strip()
    UNITS = {"px": 1, "pt": 1.25, "mm": 3.7795276, "cm": 37.795276, "in": 96, "em": 16}
    for unit, factor in UNITS.items():
        if value.endswith(unit):
            try:
                return float(value[: -len(unit)]) * factor
            except ValueError:
                return None
    try:
        return float(value)
    except ValueError:
        return None


def optimize_svg(svg_bytes: bytes, title: str) -> bytes:
    svg = svg_bytes.decode("utf-8", errors="replace")

    svg = re.sub(r"<\?xml[^>]*\?>", "", svg)
    svg = re.sub(r"<!DOCTYPE[^>]*>", "", svg)
    svg = svg.strip()

    # Synthesize viewBox from width/height BEFORE stripping them
    if not re.search(r'\bviewBox\s*=', svg):
        w_match = re.search(r'<svg\b[^>]*\s+width="([^"]*)"', svg)
        h_match = re.search(r'<svg\b[^>]*\s+height="([^"]*)"', svg)
        if w_match and h_match:
            w = _parse_length(w_match.group(1))
            h = _parse_length(h_match.group(1))
            if w and h and w > 0 and h > 0:
                svg = re.sub(r'(<svg\b)', rf'\1 viewBox="0 0 {w:.4g} {h:.4g}"', svg, count=1)

    # Remove absolute width/height so SVG scales freely
    svg = re.sub(r"(<svg\b[^>]*?)\s+width=\"[^\"]*\"", r"\1", svg)
    svg = re.sub(r"(<svg\b[^>]*?)\s+height=\"[^\"]*\"", r"\1", svg)

    svg = re.sub(r'\s+xmlns:(?:dc|cc|rdf|svg|sodipodi|inkscape)="[^"]*"', "", svg)
    svg = re.sub(r'\s+(?:sodipodi|inkscape):[a-zA-Z_-]+="[^"]*"', "", svg)
    svg = re.sub(r'\s+xml:space="[^"]*"', "", svg)

    if 'role="img"' not in svg:
        svg = svg.replace("<svg ", '<svg role="img" ', 1)

    title_tag = f"<title>{title}</title>"
    if "<title>" not in svg:
        svg = re.sub(r"(<svg\b[^>]*>)", rf"\1{title_tag}", svg)

    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False, mode="w", encoding="utf-8") as tmp:
        tmp.write(svg)
        tmp_path = tmp.name

    try:
        out_path = tmp_path.replace(".svg", "_opt.svg")
        result = subprocess.run(
            [*SVGO_CMD, "-i", tmp_path, "-o", out_path, "--quiet"],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode == 0 and Path(out_path).exists():
            optimized = Path(out_path).read_bytes()
            os.unlink(out_path)
        else:
            optimized = svg.encode("utf-8")
    except Exception:
        optimized = svg.encode("utf-8")
    finally:
        os.unlink(tmp_path)

    return optimized


def has_viewbox(svg_path: Path) -> bool:
    content = svg_path.read_text(errors="replace")
    return 'viewBox' in content[:3000]


def find_broken_svgs() -> list[tuple[Path, str, str]]:
    """Return list of (svg_path, source_url, city_name) for SVGs without viewBox."""
    broken = []
    for meta_file in sorted(ASSETS_DIR.glob("*/*.meta.json")):
        svg_file = meta_file.with_suffix("").with_suffix(".svg")
        if not svg_file.exists():
            continue
        if has_viewbox(svg_file):
            continue
        meta = json.loads(meta_file.read_text())
        source_url = meta.get("license", {}).get("source", "")
        city_name = meta.get("name", svg_file.stem)
        if source_url:
            broken.append((svg_file, source_url, city_name))
    return broken


def wikimedia_file_url(source_url: str) -> str:
    """Convert a Wikimedia Commons page URL to direct file URL."""
    m = re.search(r'File:(.+)$', source_url)
    if not m:
        return source_url
    filename = m.group(1)
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{filename}"


async def fetch_svg(session: aiohttp.ClientSession, url: str) -> bytes | None:
    try:
        async with session.get(url, allow_redirects=True, timeout=aiohttp.ClientTimeout(total=30)) as resp:
            if resp.status != 200:
                return None
            content = await resp.read()
            if b"<svg" not in content[:4096]:
                return None
            return content
    except Exception as e:
        print(f"  [WARN] fetch error: {e}", file=sys.stderr)
        return None


async def process_one(
    sem: asyncio.Semaphore,
    session: aiohttp.ClientSession,
    svg_path: Path,
    source_url: str,
    city_name: str,
    idx: int,
    total: int,
) -> bool:
    async with sem:
        file_url = wikimedia_file_url(source_url)
        raw = await fetch_svg(session, file_url)
        if raw is None:
            print(f"  [FAIL] {city_name}: could not download", file=sys.stderr)
            return False

        try:
            optimized = await asyncio.get_event_loop().run_in_executor(
                None, optimize_svg, raw, city_name
            )
        except Exception as e:
            print(f"  [FAIL] {city_name}: optimize error: {e}", file=sys.stderr)
            return False

        # Verify we now have a viewBox
        content = optimized.decode("utf-8", errors="replace")
        vb = bool('viewBox' in content[:3000])

        svg_path.write_bytes(optimized)
        status = "✔" if vb else "⚠ no-viewBox"
        print(f"  [{idx:3d}/{total}] {status}  {city_name}  ({len(optimized)}b)", flush=True)
        return vb


async def main() -> None:
    broken = find_broken_svgs()
    print(f"Found {len(broken)} SVG files without viewBox to fix.", flush=True)
    if not broken:
        print("Nothing to do.")
        return

    sem = asyncio.Semaphore(CONCURRENCY)
    connector = aiohttp.TCPConnector(limit=CONCURRENCY)
    headers = {"User-Agent": "blazon-bot/1.0 (https://github.com/blazon-registry/blazon)"}

    async with aiohttp.ClientSession(connector=connector, headers=headers) as session:
        tasks = [
            process_one(sem, session, svg_path, source_url, city_name, i + 1, len(broken))
            for i, (svg_path, source_url, city_name) in enumerate(broken)
        ]
        results = await asyncio.gather(*tasks)

    ok = sum(1 for r in results if r)
    print(f"\nDone: {ok}/{len(broken)} files fixed with viewBox.")
    if ok < len(broken):
        print("Re-run to retry failures, or check WARN messages above.")


if __name__ == "__main__":
    asyncio.run(main())
