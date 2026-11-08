/* Manga Fit Height — shared i18n (popup + content script) */
(() => {
  const DICT = {
    en: {
      appName: "Manga Fit Height",
      lang_label: "Language",
      lang_auto: "Auto",
      enabled: "Enabled on this site",
      site: "Site",
      site_unavailable: "unavailable",
      site_blocked: "The extension does not work on this page.",

      sec_target: "Target images",
      pick: "Pick an image on the page",
      pick_hint: "Click directly on a manga page image.",
      picker_overlay: "Click a manga page image · Esc to cancel",
      selector_label: "CSS selector",
      selector_ph: "e.g. #gallery img",
      broad_warn: "Selector is too broad — it will catch every image on the site.",
      minwidth_label: "Min image width, px (filters out logos/banners)",
      count_none: "—",
      count_fmt: "Matches: $1 · stretched: $2",
      count_diag_fmt: "Matches: $1 ($2) · images: $3 · stretched: $4",
      count_bad: "Invalid selector",

      sec_fit: "Fit & layout",
      offset_label: "Fixed header height, px",
      detect: "Detect",
      offset_hint: "Subtracted from the window height and used as the alignment offset.",

      sec_focus: "Focus & navigation",
      focus: "Focus mode — scroll snaps to each page so it fully fits the window",
      keys: "Arrow keys ↑ / ↓ / Space navigate between pages",
      autofocus: "Auto-focus the current page after turning",

      sec_dim: "Dimming",
      dim: "Dim the rest of the page around the target image",
      dimlevel: "Intensity: $1%",
      diminactive: "Fade neighbouring pages (only the active one stays bright)",

      sec_advanced: "Advanced",
      unclamp: "Un-clamp parent containers (overflow / fixed height)",

      save: "Save",
      saved: "Saved ✓",
      focus_now: "Focus now",
      reset: "Reset site",
      reset_done: "Site settings cleared.",
      diag: "Diagnostics",
      reload_hint: "Reload the page (F5) and try again.",
      pick_first: "Pick an element or type a selector first.",

      detected_fmt: "Fixed header found: $1px ✓",
      detected_none: "No fixed header found (0px).",

      toast_ok_fmt: "$1 — stretched images: $2",
      toast_none_fmt: "⚠️ $1 found no images (width threshold $2px?)",

      diag_selector: "selector",
      diag_normalized: "normalized",
      diag_error: "error",
      diag_matches: "matches",
      diag_images: "images",
      diag_stretched: "stretched",
      diag_threshold: "width threshold",
      diag_header: "header (auto)",
      diag_scroller: "scroll container",
      diag_style: "styles injected",
      diag_rendered: "actual size",
      diag_sizes: "image sizes",
      diag_yes: "yes",
      diag_no: "no",
      scroller_page: "page (html)"
    },
    uk: {
      appName: "Manga Fit Height",
      lang_label: "Мова",
      lang_auto: "Авто",
      enabled: "Увімкнено на цьому сайті",
      site: "Сайт",
      site_unavailable: "недоступно",
      site_blocked: "Розширення не працює на цій сторінці.",

      sec_target: "Цільові зображення",
      pick: "Обрати зображення на сторінці",
      pick_hint: "Клікай саме по картинці сторінки манги.",
      picker_overlay: "Клікни по зображенню сторінки манги · Esc — скасувати",
      selector_label: "CSS-селектор",
      selector_ph: "напр. #gallery img",
      broad_warn: "Селектор надто широкий — зачепить усі картинки сайту.",
      minwidth_label: "Мін. ширина картинки, px (відсіює логотипи/банери)",
      count_none: "—",
      count_fmt: "Збіги: $1 · розтягнуто: $2",
      count_diag_fmt: "Збіги: $1 ($2) · картинок: $3 · розтягнуто: $4",
      count_bad: "Некоректний селектор",

      sec_fit: "Розтягування та розкладка",
      offset_label: "Висота фіксованої шапки, px",
      detect: "Визначити",
      offset_hint: "Віднімається від висоти вікна й використовується як відступ при вирівнюванні.",

      sec_focus: "Фокус і навігація",
      focus: "Режим фокусу — скрол «прилипає» до сторінки, вона повністю вміщається у вікно",
      keys: "Навігація клавішами ↑ / ↓ / Space між сторінками",
      autofocus: "Автофокус на поточній сторінці після перегортання",

      sec_dim: "Затемнення",
      dim: "Затемнювати решту сторінки навколо знайденого зображення",
      dimlevel: "Інтенсивність: $1%",
      diminactive: "Приглушувати сусідні сторінки (лише активна яскрава)",

      sec_advanced: "Додатково",
      unclamp: "Розчищати батьківські контейнери (overflow / фікс. висота)",

      save: "Зберегти",
      saved: "Збережено ✓",
      focus_now: "Фокус зараз",
      reset: "Скинути сайт",
      reset_done: "Налаштування сайту скинуто.",
      diag: "Діагностика",
      reload_hint: "Онови сторінку (F5) і спробуй ще раз.",
      pick_first: "Спочатку обери елемент або впиши селектор.",

      detected_fmt: "Знайдено фіксовану шапку: $1px ✓",
      detected_none: "Фіксованої шапки не знайдено (0px).",

      toast_ok_fmt: "$1 — розтягнуто картинок: $2",
      toast_none_fmt: "⚠️ $1 не знайшов картинок (поріг ширини $2px?)",

      diag_selector: "селектор",
      diag_normalized: "нормалізовано",
      diag_error: "помилка",
      diag_matches: "збіги",
      diag_images: "картинок",
      diag_stretched: "розтягнуто",
      diag_threshold: "поріг ширини",
      diag_header: "шапка (авто)",
      diag_scroller: "скрол-контейнер",
      diag_style: "стилі вставлені",
      diag_rendered: "факт. розмір",
      diag_sizes: "розміри картинок",
      diag_yes: "так",
      diag_no: "ні",
      scroller_page: "сторінка (html)"
    },
    ja: {
      appName: "Manga Fit Height",
      lang_label: "言語",
      lang_auto: "自動",
      enabled: "このサイトで有効",
      site: "サイト",
      site_unavailable: "利用不可",
      site_blocked: "このページでは拡張機能を使用できません。",

      sec_target: "対象の画像",
      pick: "ページ上の画像を選択",
      pick_hint: "マンガのページ画像を直接クリックしてください。",
      picker_overlay: "マンガのページ画像をクリック · Esc でキャンセル",
      selector_label: "CSS セレクター",
      selector_ph: "例: #gallery img",
      broad_warn: "セレクターの範囲が広すぎます — サイト上のすべての画像が対象になります。",
      minwidth_label: "画像の最小幅（px）— ロゴやバナーを除外",
      count_none: "—",
      count_fmt: "一致: $1 · リサイズ: $2",
      count_diag_fmt: "一致: $1（$2）· 画像: $3 · リサイズ: $4",
      count_bad: "無効なセレクター",

      sec_fit: "フィットとレイアウト",
      offset_label: "固定ヘッダーの高さ（px）",
      detect: "検出",
      offset_hint: "ウィンドウの高さから差し引かれ、位置合わせのオフセットとして使われます。",

      sec_focus: "フォーカスとナビゲーション",
      focus: "フォーカスモード — スクロールが各ページに吸着し、ページ全体がウィンドウに収まります",
      keys: "↑ / ↓ / Space キーでページを移動",
      autofocus: "ページ送りの後、現在のページに自動でフォーカス",

      sec_dim: "減光",
      dim: "対象画像の周囲を暗くする",
      dimlevel: "強さ: $1%",
      diminactive: "隣のページを薄く表示（表示中のページのみ明るく）",

      sec_advanced: "詳細設定",
      unclamp: "親コンテナーの制限を解除（overflow / 固定の高さ）",

      save: "保存",
      saved: "保存しました ✓",
      focus_now: "今すぐフォーカス",
      reset: "設定をリセット",
      reset_done: "このサイトの設定を消去しました。",
      diag: "診断",
      reload_hint: "ページを再読み込み（F5）して、もう一度お試しください。",
      pick_first: "先に要素を選択するか、セレクターを入力してください。",

      detected_fmt: "固定ヘッダーを検出: $1px ✓",
      detected_none: "固定ヘッダーは見つかりませんでした（0px）。",

      toast_ok_fmt: "$1 — リサイズした画像: $2",
      toast_none_fmt: "⚠️ $1 で画像が見つかりません（幅のしきい値 $2px？）",

      diag_selector: "セレクター",
      diag_normalized: "正規化後",
      diag_error: "エラー",
      diag_matches: "一致",
      diag_images: "画像",
      diag_stretched: "リサイズ",
      diag_threshold: "幅のしきい値",
      diag_header: "ヘッダー（自動）",
      diag_scroller: "スクロールコンテナー",
      diag_style: "スタイル挿入",
      diag_rendered: "実際のサイズ",
      diag_sizes: "画像サイズ",
      diag_yes: "はい",
      diag_no: "いいえ",
      scroller_page: "ページ（html）"
    },
    ko: {
      appName: "Manga Fit Height",
      lang_label: "언어",
      lang_auto: "자동",
      enabled: "이 사이트에서 사용",
      site: "사이트",
      site_unavailable: "사용 불가",
      site_blocked: "이 페이지에서는 확장 프로그램이 작동하지 않습니다.",

      sec_target: "대상 이미지",
      pick: "페이지에서 이미지 선택",
      pick_hint: "만화 페이지 이미지를 직접 클릭하세요.",
      picker_overlay: "만화 페이지 이미지를 클릭하세요 · Esc로 취소",
      selector_label: "CSS 선택자",
      selector_ph: "예: #gallery img",
      broad_warn: "선택자 범위가 너무 넓습니다 — 사이트의 모든 이미지가 선택됩니다.",
      minwidth_label: "최소 이미지 너비, px (로고/배너 제외)",
      count_none: "—",
      count_fmt: "일치: $1 · 크기 조정: $2",
      count_diag_fmt: "일치: $1 ($2) · 이미지: $3 · 크기 조정: $4",
      count_bad: "잘못된 선택자",

      sec_fit: "맞춤 및 레이아웃",
      offset_label: "고정 헤더 높이, px",
      detect: "감지",
      offset_hint: "창 높이에서 빼고, 정렬 오프셋으로 사용됩니다.",

      sec_focus: "포커스 및 탐색",
      focus: "포커스 모드 — 스크롤이 각 페이지에 맞춰져 페이지 전체가 창에 들어옵니다",
      keys: "↑ / ↓ / Space 키로 페이지 이동",
      autofocus: "페이지를 넘긴 후 현재 페이지에 자동 포커스",

      sec_dim: "어둡게 하기",
      dim: "대상 이미지 주변을 어둡게 하기",
      dimlevel: "강도: $1%",
      diminactive: "인접 페이지 흐리게 (현재 페이지만 밝게 유지)",

      sec_advanced: "고급",
      unclamp: "상위 컨테이너 제한 해제 (overflow / 고정 높이)",

      save: "저장",
      saved: "저장됨 ✓",
      focus_now: "지금 포커스",
      reset: "사이트 초기화",
      reset_done: "이 사이트의 설정을 삭제했습니다.",
      diag: "진단",
      reload_hint: "페이지를 새로고침(F5)한 후 다시 시도하세요.",
      pick_first: "먼저 요소를 선택하거나 선택자를 입력하세요.",

      detected_fmt: "고정 헤더 감지: $1px ✓",
      detected_none: "고정 헤더를 찾지 못했습니다 (0px).",

      toast_ok_fmt: "$1 — 크기 조정된 이미지: $2",
      toast_none_fmt: "⚠️ $1: 이미지를 찾지 못했습니다 (너비 기준 $2px?)",

      diag_selector: "선택자",
      diag_normalized: "정규화됨",
      diag_error: "오류",
      diag_matches: "일치",
      diag_images: "이미지",
      diag_stretched: "크기 조정",
      diag_threshold: "너비 기준",
      diag_header: "헤더 (자동)",
      diag_scroller: "스크롤 컨테이너",
      diag_style: "스타일 삽입됨",
      diag_rendered: "실제 크기",
      diag_sizes: "이미지 크기",
      diag_yes: "예",
      diag_no: "아니요",
      scroller_page: "페이지 (html)"
    },
    zh_CN: {
      appName: "Manga Fit Height",
      lang_label: "语言",
      lang_auto: "自动",
      enabled: "在此网站上启用",
      site: "网站",
      site_unavailable: "不可用",
      site_blocked: "此扩展程序无法在此页面上运行。",

      sec_target: "目标图片",
      pick: "在页面上选择图片",
      pick_hint: "请直接点击漫画页面的图片。",
      picker_overlay: "点击漫画页面图片 · 按 Esc 取消",
      selector_label: "CSS 选择器",
      selector_ph: "例如 #gallery img",
      broad_warn: "选择器范围过宽——会匹配网站上的所有图片。",
      minwidth_label: "最小图片宽度（px，用于过滤 Logo/横幅）",
      count_none: "—",
      count_fmt: "匹配：$1 · 已缩放：$2",
      count_diag_fmt: "匹配：$1（$2）· 图片：$3 · 已缩放：$4",
      count_bad: "选择器无效",

      sec_fit: "适配与布局",
      offset_label: "固定页眉高度（px）",
      detect: "检测",
      offset_hint: "从窗口高度中减去，并用作对齐偏移量。",

      sec_focus: "聚焦与导航",
      focus: "聚焦模式——滚动时自动对齐每一页，使整页完整显示在窗口中",
      keys: "使用 ↑ / ↓ / 空格键翻页",
      autofocus: "翻页后自动聚焦当前页",

      sec_dim: "调暗",
      dim: "调暗目标图片周围的区域",
      dimlevel: "强度：$1%",
      diminactive: "淡化相邻页面（仅当前页保持明亮）",

      sec_advanced: "高级",
      unclamp: "解除父容器限制（overflow / 固定高度）",

      save: "保存",
      saved: "已保存 ✓",
      focus_now: "立即聚焦",
      reset: "重置此网站",
      reset_done: "已清除此网站的设置。",
      diag: "诊断",
      reload_hint: "请刷新页面（F5）后重试。",
      pick_first: "请先选择元素或输入选择器。",

      detected_fmt: "检测到固定页眉：$1px ✓",
      detected_none: "未检测到固定页眉（0px）。",

      toast_ok_fmt: "$1 — 已缩放图片：$2",
      toast_none_fmt: "⚠️ $1 未找到图片（宽度阈值 $2px？）",

      diag_selector: "选择器",
      diag_normalized: "规范化",
      diag_error: "错误",
      diag_matches: "匹配",
      diag_images: "图片",
      diag_stretched: "已缩放",
      diag_threshold: "宽度阈值",
      diag_header: "页眉（自动）",
      diag_scroller: "滚动容器",
      diag_style: "已注入样式",
      diag_rendered: "实际尺寸",
      diag_sizes: "图片尺寸",
      diag_yes: "是",
      diag_no: "否",
      scroller_page: "页面（html）"
    }
  };

  let current = "en";

  function resolve(pref) {
    if (pref && pref !== "auto" && DICT[pref]) return pref;
    // auto: follow the browser UI language
    let ui = "en";
    try {
      ui = (chrome.i18n.getUILanguage() || navigator.language || "en").toLowerCase();
    } catch {
      ui = (navigator.language || "en").toLowerCase();
    }
    if (ui.startsWith("uk")) return "uk";
    if (ui.startsWith("ja")) return "ja";
    if (ui.startsWith("ko")) return "ko";
    // Only Simplified Chinese for now; Traditional locales fall back to it too.
    if (ui.startsWith("zh")) return "zh_CN";
    return "en";
  }

  const MFHi18n = {
    setLang(pref) {
      current = resolve(pref);
      return current;
    },
    get lang() {
      return current;
    },
    // BCP 47 tag for the lang attribute (picks correct CJK glyphs)
    get htmlLang() {
      return current.replace("_", "-");
    },
    t(key, ...args) {
      let s = (DICT[current] && DICT[current][key]) ?? DICT.en[key] ?? key;
      args.forEach((a, i) => (s = s.replace(new RegExp("\\$" + (i + 1), "g"), a)));
      return s;
    },
    getLangSetting() {
      return new Promise((r) => chrome.storage.sync.get("lang", (d) => r(d.lang || "auto")));
    },
    setLangSetting(v) {
      return new Promise((r) => chrome.storage.sync.set({ lang: v }, r));
    }
  };

  // default initialization
  MFHi18n.setLang("auto");
  self.MFHi18n = MFHi18n;
})();
