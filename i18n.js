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
    }
  };

  let current = "en";

  function resolve(pref) {
    if (pref === "en" || pref === "uk") return pref;
    // auto: follow the browser UI language
    let ui = "en";
    try {
      ui = (chrome.i18n.getUILanguage() || navigator.language || "en").toLowerCase();
    } catch {
      ui = (navigator.language || "en").toLowerCase();
    }
    return ui.startsWith("uk") ? "uk" : "en";
  }

  const MFHi18n = {
    setLang(pref) {
      current = resolve(pref);
      return current;
    },
    get lang() {
      return current;
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
