#!/usr/bin/env python3
"""Extract dominant color palettes from every artwork thumbnail.

Writes src/data/palettes.json: { artwork_id: { dominant: "#RRGGBB", palette: ["#...", ...], hsl: [h,s,l] } }

Uses PIL's adaptive quantization to find the 5 most representative colors per image,
then sorts them by frequency. Palette colors are skin-tone/neutral-friendly and
preserve the actual painting hues (no random noise from the paper background).
"""

import json
import os
import sys
from collections import Counter
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
THUMB_DIR = ROOT / "public" / "artworks" / "thumb"
ARTWORKS_JSON = ROOT / "src" / "data" / "artworks.json"
OUTPUT = ROOT / "src" / "data" / "palettes.json"

PALETTE_SIZE = 5            # how many representative colors per image
QUANTIZE_TO = 16            # PIL quantize buckets — coarser = more grouping
RESIZE_TO = 96              # px on long edge — speed/accuracy tradeoff


def rgb_to_hex(rgb):
    return "#%02X%02X%02X" % (rgb[0], rgb[1], rgb[2])


def rgb_to_hsl(r, g, b):
    r, g, b = r / 255, g / 255, b / 255
    mx, mn = max(r, g, b), min(r, g, b)
    l = (mx + mn) / 2
    if mx == mn:
        return [0, 0, round(l * 100)]
    d = mx - mn
    s = d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)
    if mx == r:
        h = ((g - b) / d) % 6
    elif mx == g:
        h = (b - r) / d + 2
    else:
        h = (r - g) / d + 4
    return [round(h * 60), round(s * 100), round(l * 100)]


def is_neutral_paper(r, g, b):
    """Skip near-white / very-light backgrounds that are just paper."""
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    return luma > 235 and max(r, g, b) - min(r, g, b) < 12


def extract_palette(path):
    try:
        with Image.open(path) as im:
            im = im.convert("RGB")
            im.thumbnail((RESIZE_TO, RESIZE_TO))
            quant = im.quantize(colors=QUANTIZE_TO, method=Image.Quantize.MEDIANCUT)
            palette = quant.getpalette()[: QUANTIZE_TO * 3]
            counts = Counter(quant.getdata())
            ranked = sorted(counts.items(), key=lambda kv: -kv[1])
            colors = []
            for idx, _count in ranked:
                r, g, b = palette[idx * 3], palette[idx * 3 + 1], palette[idx * 3 + 2]
                if is_neutral_paper(r, g, b):
                    continue
                colors.append((r, g, b))
                if len(colors) >= PALETTE_SIZE:
                    break
            if not colors:
                # All pixels were paper — fall back to most-common regardless
                idx = ranked[0][0]
                r, g, b = palette[idx * 3], palette[idx * 3 + 1], palette[idx * 3 + 2]
                colors = [(r, g, b)]
            return colors
    except Exception as e:
        print(f"  ! {path.name}: {e}", file=sys.stderr)
        return []


def main():
    with ARTWORKS_JSON.open() as f:
        artworks = json.load(f)

    out = {}
    n = len(artworks)
    for i, a in enumerate(artworks, 1):
        thumb = a.get("thumbPath") or ""
        if not thumb:
            continue
        path = ROOT / "public" / thumb.lstrip("/")
        if not path.exists():
            continue
        colors = extract_palette(path)
        if not colors:
            continue
        hex_colors = [rgb_to_hex(c) for c in colors]
        r, g, b = colors[0]
        out[a["id"]] = {
            "dominant": hex_colors[0],
            "palette": hex_colors,
            "hsl": rgb_to_hsl(r, g, b),
        }
        if i % 25 == 0:
            print(f"  {i}/{n}")

    OUTPUT.write_text(json.dumps(out, indent=2))
    print(f"\nWrote {len(out)} palettes to {OUTPUT}")


if __name__ == "__main__":
    main()
