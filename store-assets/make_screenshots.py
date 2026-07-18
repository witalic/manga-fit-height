#!/usr/bin/env python3
"""Compose Chrome Web Store screenshots (1280x800) from popup captures."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ICONS = os.path.join(HERE, "..", "icons")

W, H = 1280, 800
ACCENT = (224, 36, 94)
ACCENT_L = (240, 90, 140)
TEXT = (245, 246, 250)
SUB = (170, 174, 186)

FB = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def bg():
    """Dark diagonal gradient to match the extension's dark popup."""
    top, bot = (32, 31, 38), (18, 17, 23)
    g = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / (H - 1)
        g.putpixel((0, y), tuple(round(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    img = g.resize((W, H)).convert("RGB")
    # soft accent glow in the corner
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-260, -320, 520, 360], fill=(90, 18, 46))
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    return Image.blend(img, glow, 0.5)


def rounded(im, rad):
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], rad, fill=255)
    out = im.convert("RGBA")
    out.putalpha(m)
    return out


def paste_shot(canvas, shot_path, box_h=680):
    shot = Image.open(shot_path).convert("RGBA")
    scale = box_h / shot.height
    shot = shot.resize((round(shot.width * scale), box_h), Image.LANCZOS)
    shot = rounded(shot, 18)
    x = W - shot.width - 90
    y = (H - shot.height) // 2
    # drop shadow
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([x, y + 10, x + shot.width, y + shot.height + 22], 22,
                                         fill=(0, 0, 0, 150))
    sh = sh.filter(ImageFilter.GaussianBlur(26))
    canvas.alpha_composite(sh)
    # thin accent border
    bd = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(bd).rounded_rectangle([x - 1, y - 1, x + shot.width, y + shot.height], 19,
                                         outline=(224, 36, 94, 120), width=2)
    canvas.alpha_composite(bd)
    canvas.alpha_composite(shot, (x, y))
    return x


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def compose(shot, headline, bullets, out_name):
    canvas = bg().convert("RGBA")
    d = ImageDraw.Draw(canvas)

    shot_x = paste_shot(canvas, shot)
    left_w = shot_x - 90 - 70

    # brand
    try:
        ic = Image.open(os.path.join(ICONS, "icon128.png")).convert("RGBA").resize((44, 44), Image.LANCZOS)
        canvas.alpha_composite(ic, (80, 70))
    except FileNotFoundError:
        pass
    d.text((136, 80), "Manga Fit Height", font=font(FB, 26), fill=TEXT)

    # headline
    y = 200
    hf = font(FB, 52)
    for line in wrap(d, headline, hf, left_w):
        d.text((80, y), line, font=hf, fill=TEXT)
        y += 62
    y += 24

    # bullets
    bf = font(FR, 24)
    for b in bullets:
        d.ellipse([80, y + 9, 92, y + 21], fill=ACCENT)
        for i, line in enumerate(wrap(d, b, bf, left_w - 34)):
            d.text((110, y), line, font=bf, fill=SUB if i else TEXT)
            y += 32
        y += 16

    canvas.convert("RGB").save(os.path.join(HERE, out_name), quality=95)
    print("wrote", out_name)


def main():
    compose(
        os.path.join(HERE, "source", "popup-top.png"),
        "Fit manga pages to your screen height",
        [
            "Pick the page image once — a CSS selector is saved per site",
            "Min-width filter skips logos and banners automatically",
            "Header-aware alignment, adjustable in one click",
        ],
        "screenshot-1-setup.png",
    )
    compose(
        os.path.join(HERE, "source", "popup-bottom.png"),
        "Focus mode, keyboard nav & dimming",
        [
            "Scroll snaps each page fully into the window",
            "Arrow keys and Space move between pages",
            "Dim everything around the page you are reading",
        ],
        "screenshot-2-reading.png",
    )


if __name__ == "__main__":
    main()
