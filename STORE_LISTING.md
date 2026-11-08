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
• Interface in English, Ukrainian, Japanese, Korean and Simplified Chinese

No accounts, no tracking, no data collection. Settings never leave your browser.

## Localized detailed descriptions
The short description comes from `_locales/*/messages.json` automatically.
Paste these into the dashboard under Store listing → language selector.

### 日本語 (ja)
Manga Fit Height は、漫画・マンガのページ画像をブラウザウィンドウの高さいっぱいに表示し、
横が切れることなく 1 ページ全体を一度に読めるようにします。

使うサイトは自分で決められます。リーダーでポップアップを開き、要素ピッカーでページ画像を
クリックすると、拡張機能が CSS セレクターを作成し、そのサイト用に保存します。
設定はすべてサイトごとに、ブラウザ内に保存されます。

機能:
• 縦横比を保ったまま画面の高さに合わせて表示
• ワンクリックの要素ピッカー（セレクターの手動編集も可能）
• ロゴやバナーを除外する最小幅フィルター
• フォーカスモード: スクロールが各ページに吸着し、ページ全体がウィンドウに収まる
• キーボード操作: ↑ / ↓ / Space
• 表示中のページの周囲を暗くする減光
• ページを再読み込みせずにめくるシングルページアプリ型のリーダーにも対応
• 英語・ウクライナ語・日本語・韓国語・簡体字中国語のインターフェース

アカウント不要、トラッキングなし、データ収集なし。設定がブラウザの外に出ることはありません。

### 한국어 (ko)
Manga Fit Height는 만화 페이지 이미지를 브라우저 창 높이에 꽉 차게 맞춰 주어,
가로가 잘리지 않고 한 페이지 전체를 한 번에 읽을 수 있게 합니다.

어디에서 작동할지는 직접 정합니다. 뷰어 사이트에서 팝업을 열고 요소 선택 도구로 페이지 이미지를
클릭하면, 확장 프로그램이 CSS 선택자를 만들어 해당 사이트용으로 저장합니다.
모든 설정은 사이트별로 브라우저 안에 저장됩니다.

기능:
• 비율을 유지하며 화면 높이에 맞춤
• 원클릭 요소 선택 도구 (선택자 직접 편집 가능)
• 로고와 배너를 제외하는 최소 너비 필터
• 포커스 모드: 스크롤이 각 페이지에 맞춰져 페이지 전체가 창에 들어옴
• 키보드 탐색: ↑ / ↓ / Space
• 현재 페이지 주변을 어둡게 하기
• 새로고침 없이 페이지를 넘기는 싱글 페이지 앱 뷰어 지원
• 영어, 우크라이나어, 일본어, 한국어, 중국어(간체) 인터페이스

계정 불필요, 추적 없음, 데이터 수집 없음. 설정은 브라우저 밖으로 나가지 않습니다.

### 简体中文 (zh_CN)
Manga Fit Height 会将漫画页面图片缩放至浏览器窗口的完整高度，
让你一次看完整页，不会出现左右被裁切的情况。

由你决定在哪些网站上使用。在阅读网站上打开弹出窗口，用元素选择器点击一张页面图片，
扩展程序就会生成 CSS 选择器并为该网站保存。所有设置均按网站保存在浏览器本地。

功能：
• 按屏幕高度缩放，保持原始宽高比
• 一键元素选择器（也可手动编辑选择器）
• 最小宽度过滤，跳过 Logo 和横幅
• 聚焦模式：滚动时自动对齐每一页，使整页完整显示在窗口中
• 键盘导航：↑ / ↓ / 空格键
• 调暗当前页面周围的区域
• 支持无需刷新即可翻页的单页应用阅读器
• 界面支持英语、乌克兰语、日语、韩语和简体中文

无需账号，无跟踪，不收集任何数据。设置永远不会离开你的浏览器。

## Category
Suggested: Accessibility (or Productivity)

## Permission justifications (paste into the review form)
- storage — Saves per-site settings (selector, thresholds, toggles, language) locally.
- activeTab — When you open the popup, identifies the site in the active tab so its saved settings can be loaded and sent to the page.
- Host access (all sites) — Manga readers are hosted on many domains and the user enables the extension per site. The extension only restyles images; it does not read page content, cookies or credentials, and makes no network requests.

## Privacy
Single purpose: resize manga page images to fit screen height.
Data usage: no user data is collected or transmitted. Link to PRIVACY.md (host it publicly, e.g. GitHub).

## Assets you still need to add in the dashboard
- At least one screenshot 1280×800 or 640×400 (take one on a reader page).
- Store icon 128×128 (icons/icon128.png).
- Optional promo tile 440×280.
