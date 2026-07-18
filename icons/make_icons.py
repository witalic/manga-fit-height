#!/usr/bin/env python3
"""Manga Fit Height icon generator. Draws at 512px and downscales for crisp edges."""
from PIL import Image, ImageDraw
import os

ACCENT_TOP = (240, 60, 110)     # #f03c6e
ACCENT_BOT = (194, 24, 74)      # #c2184a
PAGE = (250, 250, 252)
PAGE_LINE = (200, 205, 215)
ARROW = (255, 255, 255)

S = 512
here = os.path.dirname(os.path.abspath(__file__))


def rounded_mask(size, radius):
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m


def vgradient(size, top, bot):
    grad = Image.new("RGB", (1, size))
    for y in range(size):
        t = y / (size - 1)
        grad.putpixel((0, y), tuple(round(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    return grad.resize((size, size))


def build():
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bg = vgradient(S, ACCENT_TOP, ACCENT_BOT).convert("RGBA")
    img.paste(bg, (0, 0), rounded_mask(S, int(S * 0.22)))

    d = ImageDraw.Draw(img)

    # Manga page — a tall panel in the center
    pw, ph = int(S * 0.34), int(S * 0.60)
    px = (S - pw) // 2
    py = (S - ph) // 2
    d.rounded_rectangle([px, py, px + pw, py + ph], radius=int(S * 0.03),
                        fill=PAGE, outline=(180, 185, 195), width=max(2, S // 170))

    # A few comic panels on the page
    inset = int(pw * 0.16)
    gx0, gx1 = px + inset, px + pw - inset
    ys = [py + int(ph * f) for f in (0.16, 0.42, 0.62, 0.86)]
    for i in range(len(ys) - 1):
        d.rounded_rectangle([gx0, ys[i], gx1, ys[i + 1] - int(ph * 0.05)],
                            radius=int(S * 0.012), outline=PAGE_LINE, width=max(2, S // 200))

    # "Fit to height" arrows — up above the page and down below it
    aw = int(S * 0.14)
    ah = int(S * 0.075)
    cx = S // 2
    gap = int(S * 0.045)

    def arrow(cy, up):
        tip = cy - ah if up else cy + ah
        base = cy + ah if up else cy - ah
        d.polygon([(cx, tip), (cx - aw // 2, base), (cx + aw // 2, base)], fill=ARROW)
        # arrow tail
        tw = int(aw * 0.28)
        if up:
            d.rectangle([cx - tw // 2, base, cx + tw // 2, base + int(ah * 0.7)], fill=ARROW)
        else:
            d.rectangle([cx - tw // 2, base - int(ah * 0.7), cx + tw // 2, base], fill=ARROW)

    arrow(py - gap - ah, up=True)
    arrow(py + ph + gap + ah, up=False)

    return img


def main():
    master = build()
    for size in (16, 48, 128):
        out = master.resize((size, size), Image.LANCZOS)
        out.save(os.path.join(here, f"icon{size}.png"))
        print("wrote", f"icon{size}.png")
    # extra large size for the store listing
    master.resize((256, 256), Image.LANCZOS).save(os.path.join(here, "icon256.png"))
    print("wrote icon256.png")


if __name__ == "__main__":
    main()
