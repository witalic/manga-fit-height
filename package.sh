#!/usr/bin/env bash
# Build a Chrome Web Store-ready zip containing only the runtime files.
set -euo pipefail
cd "$(dirname "$0")"

OUT="manga-fit-height.zip"
rm -f "$OUT"

zip -r "$OUT" \
  manifest.json \
  i18n.js \
  content.js \
  content.css \
  popup.html \
  popup.css \
  popup.js \
  _locales \
  icons/icon16.png \
  icons/icon48.png \
  icons/icon128.png \
  -x '*.DS_Store'

echo "Created $OUT"
