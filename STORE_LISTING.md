# Chrome Web Store listing — copy/paste helper

## Name
Manga Fit Height

## Short description (≤132 chars)
Stretch manga pages to your screen height. Per-site, with an element picker, focus mode, keyboard navigation and dimming.

## Detailed description
Manga Fit Height scales manga page images to the full height of your browser
window, so you read a whole page at once without horizontal cropping.

You decide where it works. Open the popup on any reader, use the element picker
to click a page image, and the extension builds a CSS selector and saves it for
that site. Everything is per-site and stored locally.

Features:
• Fit-to-height scaling with correct aspect ratio
• One-click element picker (with manual selector editing)
• Minimum-width filter to skip logos and banners
• Focus mode: scroll snaps each page fully into the window
• Keyboard navigation: Up / Down / Space
• Dimming of the area around the current page
• Works with single-page-app readers that turn pages without reloading
• English and Ukrainian interface

No accounts, no tracking, no data collection. Settings never leave your browser.

## Category
Suggested: Accessibility (or Productivity)

## Permission justifications (paste into the review form)
- storage — Saves per-site settings (selector, thresholds, toggles, language) locally.
- activeTab + scripting — Reads how many images the selector matches in the active tab and applies the fit styling when you use the popup.
- Host access (all sites) — Manga readers are hosted on many domains and the user enables the extension per site. The extension only restyles images; it does not read page content, cookies or credentials, and makes no network requests.

## Privacy
Single purpose: resize manga page images to fit screen height.
Data usage: no user data is collected or transmitted. Link to PRIVACY.md (host it publicly, e.g. GitHub).

## Assets you still need to add in the dashboard
- At least one screenshot 1280×800 or 640×400 (take one on a reader page).
- Store icon 128×128 (icons/icon128.png).
- Optional promo tile 440×280.
