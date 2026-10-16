#!/usr/bin/env python3
"""Build the Journals page data from scanned journal PDFs and their transcriptions.

Usage:
    python3 scripts/build_journals.py <folder with the PDFs>

Reads scripts/journals.config.json, then for each journal:
  - writes every scanned page to public/journals/<id>/NN.jpg (black scanner border trimmed)
  - writes public/journals/<id>/cover.jpg from the first scan (the notebook cover)
  - pairs each scanned page with the transcription pages listed in the config
Writes everything to src/data/journals.json.

Transcriptions are kept exactly as typed. "***BLANK***" pages are dropped and
"***SKETCH***" becomes "[sketch]".

Needs PyMuPDF and Pillow (pip install pymupdf pillow).
"""

import io
import json
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "scripts" / "journals.config.json"
OUT_IMAGES = ROOT / "public" / "journals"
OUT_DATA = ROOT / "src" / "data" / "journals.json"

PAGE_LONG_EDGE = 1600   # px, scans are ~1650 on the long side already
COVER_LONG_EDGE = 480
JPEG_QUALITY = 82


def render_page(doc, index):
    """Render one PDF page at its native scan resolution and trim the black scanner bed."""
    page = doc[index]
    images = page.get_images()
    dpi = 150
    if images:
        # Match the embedded scan's resolution so nothing is up- or down-sampled twice.
        dpi = round(images[0][2] / (page.rect.width / 72))
    im = Image.open(io.BytesIO(page.get_pixmap(dpi=dpi).tobytes("png"))).convert("RGB")
    mask = im.convert("L").point(lambda v: 255 if v > 40 else 0)
    box = mask.getbbox()
    if box:
        im = im.crop(box)
    return trim_dark_edges(im)


def trim_dark_edges(im, dark=60, share=0.4):
    """Shave off edge rows/columns that are mostly scanner bed (dark), keeping the page."""
    g = im.convert("L")
    w, h = g.size
    px = g.load()

    def dark_share_row(y):
        xs = range(left, right + 1, 2)
        return sum(1 for x in xs if px[x, y] < dark) / len(xs)

    def dark_share_col(x):
        ys = range(top, bottom + 1, 2)
        return sum(1 for y in ys if px[x, y] < dark) / len(ys)

    # Peel one line at a time from whichever edge is darkest, so a scan that is
    # half scanner bed loses that half before its rows are judged.
    top, bottom, left, right = 0, h - 1, 0, w - 1
    while top < bottom and left < right:
        edges = {
            "top": dark_share_row(top),
            "bottom": dark_share_row(bottom),
            "left": dark_share_col(left),
            "right": dark_share_col(right),
        }
        side = max(edges, key=edges.get)
        if edges[side] <= share:
            break
        if side == "top":
            top += 1
        elif side == "bottom":
            bottom -= 1
        elif side == "left":
            left += 1
        else:
            right -= 1
    if (right - left) < w * 0.3 or (bottom - top) < h * 0.3:
        return im  # trimming went wrong; keep the plain crop rather than lose the page
    return im.crop((left, top, right + 1, bottom + 1))


def save_jpeg(im, path, long_edge):
    im = im.copy()
    im.thumbnail((long_edge, long_edge))
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return im.size


def parse_transcription(pdf_path):
    """Return {label: text} keyed by the transcriber's 'Page N' headings ('9b' for a repeat)."""
    doc = fitz.open(pdf_path)
    raw = "\n".join(p.get_text() for p in doc)
    blocks = {}
    current = None
    lines = []
    seen = {}

    def flush():
        if current is None:
            return
        text = "\n".join(l.rstrip() for l in lines).strip()
        text = re.sub(r"\*+\s*BLANK\s*\*+", "", text).strip()
        text = re.sub(r"\*+\s*([A-Z ]*SKETCH)\s*\*+", lambda m: f"[{m.group(1).strip().lower()}]", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        blocks[current] = text

    for line in raw.splitlines():
        m = re.match(r"^\s*Page\s+(\d+)\s*$", line)
        if m:
            flush()
            n = m.group(1)
            seen[n] = seen.get(n, 0) + 1
            current = n if seen[n] == 1 else n + "b" * (seen[n] - 1)
            lines = []
        elif current is not None:
            lines.append(line)
    flush()
    return blocks


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    config = json.loads(CONFIG.read_text())
    out = []
    for j in config["journals"]:
        doc = fitz.open(src / j["scan"])
        text = parse_transcription(src / j["transcription"])
        if len(j["pages"]) != doc.page_count:
            sys.exit(f"{j['id']}: config lists {len(j['pages'])} pages but the scan has {doc.page_count}")
        missing = [l for p in j["pages"] for l in p if l not in text]
        if missing:
            sys.exit(f"{j['id']}: transcription has no page(s) {missing}")
        unused = [l for l, t in text.items() if t and l not in {x for p in j["pages"] for x in p}]
        if unused:
            print(f"  warning: {j['id']} transcription pages not placed on any scan: {unused}")

        folder = OUT_IMAGES / j["id"]
        pages = []
        for i, labels in enumerate(j["pages"]):
            im = render_page(doc, i)
            if i == 0:
                cw, ch = save_jpeg(im, folder / "cover.jpg", COVER_LONG_EDGE)
            w, h = save_jpeg(im, folder / f"{i + 1:02d}.jpg", PAGE_LONG_EDGE)
            entries = [{"page": l.rstrip("b"), "text": text[l]} for l in labels if text[l]]
            pages.append({"image": f"/journals/{j['id']}/{i + 1:02d}.jpg", "width": w, "height": h, "transcription": entries})
        out.append({
            "id": j["id"],
            "title": j["title"],
            "date": j["date"],
            "cover": {"image": f"/journals/{j['id']}/cover.jpg", "width": cw, "height": ch},
            "pages": pages,
        })
        print(f"  {j['id']}: {len(pages)} pages")
    OUT_DATA.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {OUT_DATA.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
