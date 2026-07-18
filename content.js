/* Manga Fit Height — content script */
(() => {
  const STYLE_ID = "mfh-style";
  const ATTR = "data-mfh-fit";
  const ACTIVE = "data-mfh-active";
  const SCROLLER = "data-mfh-scroller";
  const host = location.hostname;
  const OBS_OPTS = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class", "width", "height", "src"],
  };

  let observer = null;
  let lastCfg = null;
  let keysBound = false;
  let lastUrl = location.href;
  let lastSig = "";

  // ---------- i18n ----------
  const T = (k, ...a) => (self.MFHi18n ? self.MFHi18n.t(k, ...a) : k);
  function initLang() {
    if (!self.MFHi18n) return;
    chrome.storage.sync.get("lang", (d) => self.MFHi18n.setLang(d.lang || "auto"));
  }
  chrome.storage.onChanged.addListener((ch, area) => {
    if (area === "sync" && ch.lang && self.MFHi18n) {
      self.MFHi18n.setLang(ch.lang.newValue || "auto");
    }
  });

  // ---------- Config ----------
  const key = (h) => `site:${h}`;
  const getConfig = () =>
    new Promise((r) => chrome.storage.sync.get(key(host), (d) => r(d[key(host)] || null)));
  const setConfig = (cfg) =>
    new Promise((r) => chrome.storage.sync.set({ [key(host)]: cfg }, r));

  const minW = (cfg) => cfg?.minWidth ?? 300;
  const off = (cfg) => cfg?.offset || 0;

  // ---------- Selector ----------
  function normalize(sel) {
    if (!sel) return "";
    try {
      const els = Array.from(document.querySelectorAll(sel));
      if (els.length && els.every((e) => e.tagName !== "IMG")) {
        if (document.querySelector(sel + " img")) return sel + " img";
      }
    } catch {
      /* invalid selector */
    }
    return sel;
  }

  function matched(cfg) {
    try {
      return Array.from(document.querySelectorAll(normalize(cfg.selector))).filter(
        (e) => e.tagName === "IMG"
      );
    } catch {
      return [];
    }
  }

  function targets(cfg) {
    const min = minW(cfg);
    return matched(cfg).filter((img) => {
      const w = img.naturalWidth || Math.round(img.getBoundingClientRect().width);
      return !w || w >= min;
    });
  }

  const fitted = () => Array.from(document.querySelectorAll(`img[${ATTR}="1"]`));

  // ---------- Scroll container ----------
  // Readers often scroll an inner div rather than the page itself.
  function scrollerOf(el) {
    let p = el?.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      const cs = getComputedStyle(p);
      const oy = cs.overflowY;
      if ((oy === "auto" || oy === "scroll") && p.scrollHeight > p.clientHeight + 4) return p;
      p = p.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function markScroller(img) {
    document.querySelectorAll(`[${SCROLLER}]`).forEach((e) => e.removeAttribute(SCROLLER));
    const s = scrollerOf(img);
    if (s && s !== document.scrollingElement && s !== document.documentElement) {
      s.setAttribute(SCROLLER, "1");
      return s;
    }
    return null;
  }

  // ---------- Styles ----------
  function buildCss(cfg) {
    const o = off(cfg);
    const h = `calc(100vh - ${o}px)`;
    const hd = `calc(100dvh - ${o}px)`;
    const focus = cfg.focus !== false;
    const snap = focus
      ? `scroll-snap-type: y proximity !important; scroll-padding-top: ${o}px !important;`
      : "";

    // Dimming: a huge solid shadow around the image covers the rest of the page.
    // More reliable than a separate overlay — it does not break on stacking contexts.
    const dim = !!cfg.dim;
    const a = Math.min(100, Math.max(0, cfg.dimLevel ?? 85)) / 100;
    const dimCss = dim
      ? `
  position: relative !important;
  z-index: 999999 !important;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, ${a}) !important;
  clip-path: none !important;`
      : "";

    const dimInactive =
      dim && cfg.dimInactive
        ? `
img[${ATTR}="1"]:not([${ACTIVE}="1"]) {
  opacity: 0.2 !important;
  transition: opacity .15s linear !important;
}`
        : "";

    return `
${focus ? `html { ${snap} }` : ""}
${focus ? `[${SCROLLER}="1"] { ${snap} }` : ""}

img[${ATTR}="1"] {
  box-sizing: border-box !important;
  padding: 0 !important;
  border: 0 !important;
  height: ${h} !important;
  height: ${hd} !important;
  max-height: ${h} !important;
  max-height: ${hd} !important;
  min-height: 0 !important;
  width: auto !important;
  max-width: none !important;
  min-width: 0 !important;
  object-fit: contain !important;
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  zoom: 1 !important;
  transform: none !important;
  ${focus ? `scroll-snap-align: center !important; scroll-snap-stop: always !important; scroll-margin-top: ${o}px !important;` : ""}${dimCss}
}
${dimInactive}
`;
  }

  function ensureStyle(cfg) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    const css = buildCss(cfg);
    if (style.textContent !== css) style.textContent = css;
    return style;
  }

  function apply(cfg) {
    lastCfg = cfg;
    if (!cfg || !cfg.enabled || !cfg.selector) {
      document.getElementById(STYLE_ID)?.remove();
      stopObserver();
      cleanupAll();
      return;
    }
    ensureStyle(cfg);
    fixup(cfg);
    startObserver();
    bindKeys();
    bindActiveTracker();
    markActive();
  }

  // ---------- Active page (for dimming inactive ones) ----------
  let activeBound = false;
  let activeQueued = false;

  function markActive() {
    const list = fitted();
    if (!list.length) return;
    const cur = list[currentIndex(list)];
    list.forEach((img) => {
      if (img === cur) img.setAttribute(ACTIVE, "1");
      else if (img.hasAttribute(ACTIVE)) img.removeAttribute(ACTIVE);
    });
  }

  function bindActiveTracker() {
    if (activeBound) return;
    activeBound = true;
    const onScroll = () => {
      if (activeQueued) return;
      activeQueued = true;
      requestAnimationFrame(() => {
        activeQueued = false;
        if (lastCfg?.enabled && lastCfg.dim && lastCfg.dimInactive) markActive();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
  }

  function cleanupAll() {
    document.querySelectorAll(`img[${ATTR}]`).forEach((i) => {
      i.removeAttribute(ATTR);
      i.removeAttribute(ACTIVE);
    });
    document.querySelectorAll(`[${SCROLLER}]`).forEach((e) => e.removeAttribute(SCROLLER));
    document.querySelectorAll("[data-mfh-touched]").forEach((el) => {
      ["overflow", "max-width", "max-height", "height"].forEach((p) =>
        el.style.removeProperty(p)
      );
      el.removeAttribute("data-mfh-touched");
    });
  }

  function fixup(cfg) {
    if (!cfg?.enabled || !cfg.selector) return;
    const observing = !!observer;
    if (observing) observer.disconnect();

    const set = new Set(targets(cfg));

    document.querySelectorAll(`img[${ATTR}]`).forEach((img) => {
      if (!set.has(img)) img.removeAttribute(ATTR);
    });

    set.forEach((img) => {
      img.setAttribute(ATTR, "1");
      ["height", "width", "max-width", "max-height"].forEach((p) =>
        img.style.removeProperty(p)
      );
      img.removeAttribute("width");
      img.removeAttribute("height");

      if (!img.complete && !img.dataset.mfhWaiting) {
        img.dataset.mfhWaiting = "1";
        img.addEventListener(
          "load",
          () => {
            delete img.dataset.mfhWaiting;
            if (lastCfg) fixup(lastCfg);
          },
          { once: true }
        );
      }

      if (cfg.unclamp === false) return;

      let p = img.parentElement;
      let depth = 0;
      while (p && depth < 8 && p !== document.body && p !== document.documentElement) {
        const cs = getComputedStyle(p);
        const scrolls =
          (cs.overflowY === "auto" || cs.overflowY === "scroll") &&
          p.scrollHeight > p.clientHeight + 4;
        // Leave the scroll container alone — otherwise we break the reader's scrolling.
        if (!scrolls) {
          if (cs.overflow !== "visible" || cs.overflowX !== "visible") {
            p.style.setProperty("overflow", "visible", "important");
          }
          if (cs.height !== "auto" && !/^(TD|TH|TR|TABLE)$/.test(p.tagName)) {
            p.style.setProperty("height", "auto", "important");
          }
          if (cs.maxHeight !== "none") p.style.setProperty("max-height", "none", "important");
        }
        if (cs.maxWidth !== "none") p.style.setProperty("max-width", "none", "important");
        p.dataset.mfhTouched = "1";
        p = p.parentElement;
        depth++;
      }
    });

    // Mark the scroll container (for scroll-snap) based on the first image.
    const first = [...set][0];
    if (first && cfg.focus !== false) markScroller(first);
    if (cfg.dim && cfg.dimInactive) markActive();

    if (observing) observer.observe(document.documentElement, OBS_OPTS);
  }

  // ---------- Focus / navigation ----------
  function scrollCtx(img) {
    const s = scrollerOf(img);
    const isWin = s === document.scrollingElement || s === document.documentElement;
    return {
      el: s,
      isWin,
      top: () => (isWin ? window.scrollY : s.scrollTop),
      height: () => (isWin ? window.innerHeight : s.clientHeight),
      // Image top relative to the start of the scroller's content.
      offsetOf: (el) => {
        const r = el.getBoundingClientRect();
        if (isWin) return window.scrollY + r.top;
        return s.scrollTop + r.top - s.getBoundingClientRect().top;
      },
      to: (y, smooth) =>
        (isWin ? window : s).scrollTo({
          top: Math.max(0, Math.round(y)),
          behavior: smooth ? "smooth" : "auto",
        }),
    };
  }

  function focusImage(img, smooth = true) {
    if (!img) return;
    const o = off(lastCfg);
    const c = scrollCtx(img);
    const free = c.height() - o;
    const ih = img.getBoundingClientRect().height;
    const extra = Math.max(0, (free - ih) / 2);
    c.to(c.offsetOf(img) - o - extra, smooth);
  }

  function currentIndex(list) {
    const o = off(lastCfg);
    const mid = (window.innerHeight + o) / 2;
    let best = 0;
    let bestDist = Infinity;
    list.forEach((img, i) => {
      const r = img.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  function step(dir) {
    const list = fitted();
    if (!list.length) return false;
    const i = currentIndex(list);
    const cur = list[i];
    const r = cur.getBoundingClientRect();
    const o = off(lastCfg);
    const aligned =
      Math.abs(r.top - o) < 6 || (r.top >= o - 6 && r.bottom <= window.innerHeight + 6);
    const next = aligned ? list[i + dir] : cur;
    if (!next) return false;
    focusImage(next);
    return true;
  }

  function bindKeys() {
    if (keysBound) return;
    keysBound = true;
    // capture + window: survives DOM re-renders in SPA readers.
    window.addEventListener(
      "keydown",
      (e) => {
        if (!lastCfg?.enabled || lastCfg.keys === false || lastCfg.focus === false) return;
        const t = e.target;
        if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
        if (t && t.isContentEditable) return;
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        let handled = false;
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") handled = step(1);
        else if (e.key === "ArrowUp" || e.key === "PageUp") handled = step(-1);

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  // ---------- Resilience to SPA navigation ----------
  // Signature of the current image set: if it changes, a page/chapter was turned.
  function signature() {
    const f = fitted();
    return f.length + "|" + (f[0]?.currentSrc || f[0]?.src || "");
  }

  function reconcile({ navigated = false } = {}) {
    if (!lastCfg?.enabled || !lastCfg.selector) return;

    // The site may have removed our <style> while re-rendering <head>.
    ensureStyle(lastCfg);
    fixup(lastCfg);

    const sig = signature();
    const changed = sig !== lastSig;
    lastSig = sig;

    if ((navigated || changed) && lastCfg.autoFocus !== false) {
      const first = fitted()[0];
      if (first) {
        // Wait a bit until the image has real dimensions.
        if (first.complete) focusImage(first, false);
        else first.addEventListener("load", () => focusImage(first, false), { once: true });
      }
    }
  }

  function onNavigate() {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    lastSig = "";
    getConfig().then((cfg) => {
      apply(cfg);
      // Content does not load instantly — check a few times.
      [100, 400, 900, 1600].forEach((t) =>
        setTimeout(() => reconcile({ navigated: true }), t)
      );
    });
  }

  function hookHistory() {
    ["pushState", "replaceState"].forEach((m) => {
      const orig = history[m];
      history[m] = function (...args) {
        const res = orig.apply(this, args);
        setTimeout(onNavigate, 0);
        return res;
      };
    });
    window.addEventListener("popstate", () => setTimeout(onNavigate, 0));
    window.addEventListener("hashchange", () => setTimeout(onNavigate, 0));
    // Fallback: some readers swap content without changing the URL at all.
    setInterval(() => {
      if (location.href !== lastUrl) onNavigate();
      else reconcile();
    }, 1200);
  }

  function startObserver() {
    if (observer) return;
    let queued = false;
    observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (lastCfg) fixup(lastCfg);
      });
    });
    observer.observe(document.documentElement, OBS_OPTS);
  }

  function stopObserver() {
    observer?.disconnect();
    observer = null;
  }

  // ---------- CSS selector generation ----------
  const BAD_CLASS = /^(?:[a-z]{1,2}|.*\d{3,}.*|[0-9a-f]{8,}|active|selected|current|hover|loaded|loading|visible|hidden|open|show)$/i;

  const goodClasses = (el) =>
    Array.from(el.classList)
      .filter((c) => c && !BAD_CLASS.test(c) && !/[^\w-]/.test(c))
      .slice(0, 2);

  const goodId = (el) => el.id && !/\d{3,}/.test(el.id) && !/[^\w-]/.test(el.id);

  function partFor(el, allowNth) {
    if (goodId(el)) return `#${CSS.escape(el.id)}`;
    const cls = goodClasses(el);
    let part = el.tagName.toLowerCase() + cls.map((c) => `.${CSS.escape(c)}`).join("");
    if (!cls.length && allowNth && el.parentElement) {
      const same = Array.from(el.parentElement.children).filter(
        (s) => s.tagName === el.tagName
      );
      if (same.length > 1) part += `:nth-of-type(${same.indexOf(el) + 1})`;
    }
    return part;
  }

  const isMatch = (sel, el) => {
    try {
      return Array.from(document.querySelectorAll(sel)).includes(el);
    } catch {
      return false;
    }
  };

  const hasAnchor = (parts) => parts.some((p) => p.includes("#") || p.includes("."));

  function cssPath(el) {
    const isImg = el.tagName === "IMG";
    const parts = [];
    let node = el;
    let depth = 0;
    while (node && node.nodeType === 1 && node !== document.documentElement && depth < 8) {
      parts.unshift(partFor(node, !(node === el && isImg)));
      if (parts[0].startsWith("#")) break;
      if (hasAnchor(parts) && isMatch(parts.join(" "), el)) break;
      node = node.parentElement;
      depth++;
    }
    return parts.join(" ");
  }

  function selectorFor(el) {
    if (el.tagName !== "IMG") {
      const inner = Array.from(el.querySelectorAll("img"));
      if (inner.length) {
        const biggest = inner.reduce((a, b) => {
          const ar = a.getBoundingClientRect();
          const br = b.getBoundingClientRect();
          return br.width * br.height > ar.width * ar.height ? b : a;
        });
        const s = cssPath(biggest);
        if (s && s !== "img") return s;
        const cs = cssPath(el);
        return cs ? cs + " img" : "img";
      }
    }
    return cssPath(el);
  }

  // ---------- Picker ----------
  let picker = null;

  function startPicker() {
    if (picker) return;
    const overlay = document.createElement("div");
    overlay.id = "mfh-picker-overlay";
    const hl = document.createElement("div");
    hl.id = "mfh-picker-highlight";
    const hint = document.createElement("div");
    hint.id = "mfh-picker-hint";
    hint.textContent = T("picker_overlay");
    document.body.append(overlay, hl, hint);

    const targetAt = (x, y) => {
      overlay.style.pointerEvents = "none";
      const el = document.elementFromPoint(x, y);
      overlay.style.pointerEvents = "";
      return el && String(el.id || "").startsWith("mfh-") ? null : el;
    };

    const onMove = (e) => {
      const el = targetAt(e.clientX, e.clientY);
      if (!el) return;
      const r = el.getBoundingClientRect();
      Object.assign(hl.style, {
        top: r.top + "px",
        left: r.left + "px",
        width: r.width + "px",
        height: r.height + "px",
      });
      picker.current = el;
    };

    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const el = picker.current || targetAt(e.clientX, e.clientY);
      stopPicker();
      if (!el) return;

      const selector = selectorFor(el);
      getConfig().then((cfg) => {
        const base = {
          enabled: true,
          offset: 0,
          unclamp: true,
          minWidth: 300,
          focus: true,
          keys: true,
          autoFocus: true,
          dim: true,
          dimLevel: 85,
          dimInactive: false,
          ...(cfg || {}),
        };
        const picked = el.tagName === "IMG" ? el : el.querySelector("img");
        const w = picked?.naturalWidth || 0;
        if (w && w < base.minWidth) base.minWidth = Math.max(100, Math.floor(w * 0.8));

        const next = { ...base, selector };
        setConfig(next).then(() => {
          apply(next);
          const n = fitted().length;
          toast(
            n
              ? T("toast_ok_fmt", selector, n)
              : T("toast_none_fmt", selector, next.minWidth)
          );
          if (n) focusImage(picked?.hasAttribute(ATTR) ? picked : fitted()[0]);
        });
      });
    };

    const onKey = (e) => e.key === "Escape" && stopPicker();

    overlay.addEventListener("mousemove", onMove, true);
    overlay.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    picker = { overlay, hl, hint, onKey, current: null };
  }

  function stopPicker() {
    if (!picker) return;
    document.removeEventListener("keydown", picker.onKey, true);
    picker.overlay.remove();
    picker.hl.remove();
    picker.hint.remove();
    picker = null;
  }

  function toast(text) {
    document.getElementById("mfh-toast")?.remove();
    const t = document.createElement("div");
    t.id = "mfh-toast";
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  // ---------- Header auto-detection ----------
  function detectHeader() {
    let h = 0;
    document.querySelectorAll("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") return;
      if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") return;
      const r = el.getBoundingClientRect();
      if (
        r.top <= 2 &&
        r.height > 8 &&
        r.height < window.innerHeight / 2 &&
        r.width > window.innerWidth * 0.5
      ) {
        h = Math.max(h, Math.round(r.height));
      }
    });
    return h;
  }

  // ---------- Diagnostics ----------
  function diagnose(cfg) {
    const out = { selector: cfg.selector, normalized: normalize(cfg.selector), minWidth: minW(cfg) };
    try {
      const raw = Array.from(document.querySelectorAll(cfg.selector));
      out.rawCount = raw.length;
      out.rawTags = [...new Set(raw.map((e) => e.tagName))].join(", ");
    } catch {
      out.error = true;
      return out;
    }
    const m = matched(cfg);
    const f = fitted();
    out.imgCount = m.length;
    out.fitted = f.length;
    out.sizes = m
      .slice(0, 8)
      .map((i) => `${i.naturalWidth}×${i.naturalHeight}${i.hasAttribute(ATTR) ? " ✓" : " ✗"}`);
    if (f[0]) {
      const r = f[0].getBoundingClientRect();
      out.rendered = `${Math.round(r.width)}×${Math.round(r.height)} (win ${innerWidth}×${innerHeight})`;
      const s = scrollerOf(f[0]);
      out.scroller =
        s === document.scrollingElement || s === document.documentElement
          ? T("scroller_page")
          : `${s.tagName.toLowerCase()}${s.id ? "#" + s.id : ""}`;
    }
    out.detectedHeader = detectHeader();
    out.styleInjected = !!document.getElementById(STYLE_ID);
    return out;
  }

  // ---------- Messaging ----------
  chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
    if (msg.type === "MFH_PICK") {
      startPicker();
      sendResponse({ ok: true });
    } else if (msg.type === "MFH_APPLY") {
      apply(msg.config);
      lastSig = signature();
      sendResponse({
        ok: true,
        imgCount: msg.config?.selector ? matched(msg.config).length : 0,
        fitted: fitted().length,
      });
    } else if (msg.type === "MFH_DIAG") {
      sendResponse({ ok: true, diag: diagnose(msg.config) });
    } else if (msg.type === "MFH_DETECT_HEADER") {
      sendResponse({ ok: true, height: detectHeader() });
    } else if (msg.type === "MFH_FOCUS") {
      focusImage(fitted()[0]);
      sendResponse({ ok: true });
    }
    return true;
  });

  // ---------- Startup ----------
  initLang();
  getConfig().then((cfg) => {
    apply(cfg);
    lastSig = signature();
    if (cfg?.enabled && cfg.autoFocus) {
      [200, 700].forEach((t) => setTimeout(() => focusImage(fitted()[0], false), t));
    }
    hookHistory();
  });

  window.addEventListener("load", () => lastCfg && reconcile());
  window.addEventListener("resize", () => lastCfg && fixup(lastCfg));
})();
