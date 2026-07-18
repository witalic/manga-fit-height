# Manga Fit Height

A Chrome/Edge extension (Manifest V3) that stretches manga page images to the
**height of the screen** in reader mode. Fully per-site and configurable through
an in-popup UI — you choose which site it applies to and which image block to
stretch (sites use different HTML structures).

![icon](icons/icon128.png)

## Features

- **Fit to height** — pages scale to the viewport height (`100dvh`) with the
  correct aspect ratio, so the whole page is visible without horizontal cropping.
- **Element picker** — click a page image and the extension generates a stable
  CSS selector for you; you can also edit it by hand.
- **Per-site settings** — every site keeps its own selector and options in
  `chrome.storage.sync`.
- **Min-width filter** — ignores logos, avatars and banners by image width.
- **Focus mode** — scroll snaps to each page so it fully fits the window, with
  header-aware alignment.
- **Keyboard navigation** — `Up` / `Down` / `Space` move between pages.
- **Dimming** — darkens everything around the current page; optional fading of
  neighbouring pages.
- **SPA-friendly** — keeps working across in-page (AJAX/pushState) page turns.
- **Localized UI** — English and Ukrainian, auto-detected with a manual switch.

## Install (from source)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. **Load unpacked** → select the `manga-fit-height` folder.

## Usage

1. Open a manga reader page and click the extension icon.
2. **Pick an image on the page**, then click a page image. A selector is saved
   for the current domain and applied immediately.
3. Tune the options: min width, header height (with **Detect**), focus,
   navigation, dimming.
4. Use `Up` / `Down` / `Space` to move between pages.

## Privacy

The extension does not collect, transmit or sell any data. All settings are
stored locally in your browser. See [PRIVACY.md](PRIVACY.md).

## Project layout

```
manifest.json          MV3 manifest
i18n.js                Shared runtime dictionary (EN/UK) for popup + content
content.js             In-page logic: fitting, focus, dimming, picker
content.css            Styles for the picker overlay and toasts
popup.html/.css/.js    Extension popup UI
_locales/              Localized manifest name & description (EN/UK)
icons/                 App icons (+ make_icons.py generator)
package.sh             Builds a store-ready zip of runtime files only
```

## Packaging for the Chrome Web Store

```bash
./package.sh        # produces manga-fit-height.zip with only the runtime files
```

Then upload the zip in the [Developer Dashboard](https://chrome.google.com/webstore/devconsole).
See [STORE_LISTING.md](STORE_LISTING.md) for ready-to-paste listing text and
permission justifications.

## License

[MIT](LICENSE)
