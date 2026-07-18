/* Manga Fit Height — popup */
const $ = (id) => document.getElementById(id);
const key = (h) => `site:${h}`;
const t = (k, ...a) => self.MFHi18n.t(k, ...a);

let tab = null;
let host = null;

const status = (msg) => ($("status").textContent = msg || "");

const load = (h) =>
  new Promise((r) => chrome.storage.sync.get(key(h), (d) => r(d[key(h)] || null)));
const save = (h, cfg) =>
  new Promise((r) => chrome.storage.sync.set({ [key(h)]: cfg }, r));

// ---------- i18n ----------
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  syncDim();
}

// ---------- Form ----------
const readForm = () => ({
  enabled: $("enabled").checked,
  selector: $("selector").value.trim(),
  offset: Math.max(0, parseInt($("offset").value, 10) || 0),
  minWidth: Math.max(0, parseInt($("minWidth").value, 10) || 0),
  focus: $("focus").checked,
  keys: $("keys").checked,
  autoFocus: $("autoFocus").checked,
  dim: $("dim").checked,
  dimLevel: parseInt($("dimLevel").value, 10),
  dimInactive: $("dimInactive").checked,
  unclamp: $("unclamp").checked,
});

function fillForm(cfg) {
  $("enabled").checked = !!cfg?.enabled;
  $("selector").value = cfg?.selector || "";
  $("offset").value = cfg?.offset ?? 0;
  $("minWidth").value = cfg?.minWidth ?? 300;
  $("focus").checked = cfg?.focus !== false;
  $("keys").checked = cfg?.keys !== false;
  $("autoFocus").checked = !!cfg?.autoFocus;
  $("dim").checked = !!cfg?.dim;
  $("dimLevel").value = cfg?.dimLevel ?? 85;
  $("dimInactive").checked = !!cfg?.dimInactive;
  $("unclamp").checked = cfg?.unclamp !== false;
  syncDim();
  checkBroad();
}

function syncDim() {
  $("dimLevelLabel").textContent = t("dimlevel", $("dimLevel").value);
  $("dimBox").classList.toggle("off", !$("dim").checked);
}

function checkBroad() {
  const s = $("selector").value.trim();
  $("broad").style.display = s && !/[#.]/.test(s) ? "block" : "none";
}

// ---------- Tab communication ----------
async function send(msg) {
  try {
    return await chrome.tabs.sendMessage(tab.id, msg);
  } catch {
    status(t("reload_hint"));
    return null;
  }
}

async function persist() {
  const cfg = readForm();
  await save(host, cfg);
  const res = await send({ type: "MFH_APPLY", config: cfg });
  if (res && cfg.selector) {
    $("count").textContent = t("count_fmt", res.imgCount, res.fitted);
  }
  return cfg;
}

async function refreshCount() {
  const cfg = readForm();
  if (!cfg.selector) return ($("count").textContent = t("count_none"));
  const res = await send({ type: "MFH_DIAG", config: cfg });
  if (!res) return;
  const d = res.diag;
  $("count").textContent = d.error
    ? "⚠️ " + t("count_bad")
    : t("count_diag_fmt", d.rawCount, d.rawTags || "—", d.imgCount, d.fitted);
}

// ---------- Initialization ----------
async function init() {
  const langPref = await self.MFHi18n.getLangSetting();
  self.MFHi18n.setLang(langPref);
  $("lang").value = langPref;
  applyI18n();

  const [tb] = await chrome.tabs.query({ active: true, currentWindow: true });
  tab = tb;
  try {
    host = new URL(tab.url).hostname;
  } catch {
    host = null;
  }

  if (!host || /^(chrome|edge|about|chrome-extension|view-source):/.test(tab.url)) {
    $("host").textContent = t("site_unavailable");
    status(t("site_blocked"));
    return;
  }

  $("host").textContent = host;
  fillForm(await load(host));
  refreshCount();

  // Language
  $("lang").addEventListener("change", async () => {
    const v = $("lang").value;
    await self.MFHi18n.setLangSetting(v);
    self.MFHi18n.setLang(v);
    applyI18n();
    refreshCount();
  });

  // Picker
  $("pick").addEventListener("click", async () => {
    if (await send({ type: "MFH_PICK" })) window.close();
  });

  // Save
  $("save").addEventListener("click", async () => {
    await persist();
    status(t("saved"));
  });

  ["enabled", "focus", "keys", "autoFocus", "dim", "dimInactive", "unclamp"].forEach((id) =>
    $(id).addEventListener("change", () => {
      syncDim();
      persist();
    })
  );
  ["offset", "minWidth"].forEach((id) => $(id).addEventListener("change", persist));

  // Dimming slider — live preview
  $("dimLevel").addEventListener("input", () => {
    syncDim();
    send({ type: "MFH_APPLY", config: readForm() });
  });
  $("dimLevel").addEventListener("change", persist);

  $("selector").addEventListener("input", () => {
    checkBroad();
    refreshCount();
  });

  // Header auto-detection
  $("detect").addEventListener("click", async () => {
    const res = await send({ type: "MFH_DETECT_HEADER" });
    if (!res) return;
    $("offset").value = res.height;
    await persist();
    status(res.height ? t("detected_fmt", res.height) : t("detected_none"));
  });

  // Focus now
  $("focusNow").addEventListener("click", async () => {
    await persist();
    await send({ type: "MFH_FOCUS" });
    window.close();
  });

  // Reset
  $("clear").addEventListener("click", async () => {
    await new Promise((r) => chrome.storage.sync.remove(key(host), r));
    fillForm(null);
    await send({ type: "MFH_APPLY", config: null });
    $("count").textContent = t("count_none");
    $("diag").style.display = "none";
    status(t("reset_done"));
  });

  // Diagnostics
  $("diagBtn").addEventListener("click", async () => {
    const cfg = readForm();
    if (!cfg.selector) return status(t("pick_first"));
    const res = await send({ type: "MFH_DIAG", config: cfg });
    if (!res) return;
    const d = res.diag;
    const yn = (b) => (b ? t("diag_yes") : t("diag_no"));
    const lines = [
      `${t("diag_selector")}: ${d.selector}`,
      `${t("diag_normalized")}: ${d.normalized}`,
      d.error
        ? `${t("diag_error")}: ${t("count_bad")}`
        : `${t("diag_matches")}: ${d.rawCount} (${d.rawTags || "—"})`,
      `${t("diag_images")}: ${d.imgCount ?? 0}`,
      `${t("diag_stretched")}: ${d.fitted ?? 0}`,
      `${t("diag_threshold")}: ${d.minWidth}px`,
      `${t("diag_header")}: ${d.detectedHeader}px`,
      `${t("diag_scroller")}: ${d.scroller || "—"}`,
      `${t("diag_style")}: ${yn(d.styleInjected)}`,
    ];
    if (d.rendered) lines.push(`${t("diag_rendered")}: ${d.rendered}`);
    if (d.sizes?.length) lines.push(`${t("diag_sizes")}:`, ...d.sizes.map((s) => "  " + s));
    $("diag").textContent = lines.join("\n");
    $("diag").style.display = "block";
  });
}

init();
