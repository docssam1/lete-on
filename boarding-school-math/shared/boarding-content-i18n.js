(function () {
  "use strict";
  const supported = ["ko", "en", "en-SG", "zh-Hans"];
  const storageKey = "gfield-boarding-locale:v1";
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch (_error) {}
  const queryLocale = new URLSearchParams(location.search).get("locale");
  let locale = supported.includes(queryLocale) ? queryLocale : supported.includes(saved) ? saved : "ko";
  const entries = window.GFIELDContentTranslations || {};
  const originals = new WeakMap();
  const translatedNodes = new Set();
  const attributes = new Map();
  const mathRanges = new Set();
  const missing = new Set();
  let refreshingMath = false;
  let pending = false;
  let observer;
  const escape = function (value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
  const templates = Object.keys(entries).filter(function (key) { return /__GFIELD_\d+__/.test(key); }).map(function (key) {
    const slots = [];
    let cursor = 0;
    let pattern = "";
    key.replace(/__GFIELD_(\d+)__/g, function (token, id, offset) {
      pattern += escape(key.slice(cursor, offset)) + "([\\s\\S]*)";
      slots.push(Number(id));
      cursor = offset + token.length;
      return token;
    });
    pattern += escape(key.slice(cursor));
    return { key: key, slots: slots, expression: new RegExp("^" + pattern + "$"), specificity: key.replace(/__GFIELD_\d+__/g, "").length };
  }).sort(function (a, b) { return b.specificity - a.specificity; });

  function text(value, depth) {
    const source = String(value == null ? "" : value);
    if (locale === "ko" || !/[가-힣]/.test(source)) return source;
    const trimmed = source.trim();
    const pair = entries[trimmed];
    const index = locale === "zh-Hans" ? 1 : 0;
    if (pair) return source.replace(trimmed, pair[index]);
    if ((depth || 0) < 5) {
      for (const template of templates) {
        const match = trimmed.match(template.expression);
        if (!match) continue;
        const values = {};
        template.slots.forEach(function (id, slot) { values[id] = text(match[slot + 1], (depth || 0) + 1); });
        const translated = entries[template.key][index].replace(/__GFIELD_(\d+)__/g, function (_token, id) { return values[Number(id)] || ""; });
        if (!/[가-힣]/.test(translated)) return source.replace(trimmed, translated);
      }
    }
    if ((depth || 0) < 5) {
      const sentences = trimmed.split(/(?<=[.!?])\s+(?=\S)/);
      if (sentences.length > 1) {
        const translated = sentences.map(function (sentence) { return text(sentence, (depth || 0) + 1); }).join(" ");
        if (!/[가-힣]/.test(translated)) return source.replace(trimmed, translated);
      }
      const numbered = trimmed.match(/^(\d+\s*[·.)]\s*)(.+)$/);
      if (numbered) {
        const tail = text(numbered[2], (depth || 0) + 1);
        if (!/[가-힣]/.test(tail)) return source.replace(trimmed, numbered[1] + tail);
      }
      const counted = trimmed.match(/^(.+?) ([0-9]+(?:\.[0-9]+)?%?)$/);
      if (counted) {
        const label = text(counted[1], (depth || 0) + 1);
        if (!/[가-힣]/.test(label)) return source.replace(trimmed, label + " " + counted[2]);
      }
      const arrow = trimmed.match(/^(.+?)(\s*[↗→])$/);
      if (arrow) {
        const body = text(arrow[1], (depth || 0) + 1);
        if (!/[가-힣]/.test(body)) return source.replace(trimmed, body + arrow[2]);
      }
      const parts = trimmed.split(/( · |: | → | ↗|\. )/);
      if (parts.length > 1) {
        const result = parts.map(function (part) { return /[가-힣]/.test(part) ? text(part, (depth || 0) + 1) : part; }).join("");
        if (!/[가-힣]/.test(result)) return source.replace(trimmed, result);
      }
    }
    missing.add(trimmed);
    return source;
  }

  function sourceText(node) {
    if (!node) return "";
    if (node.nodeType === Node.TEXT_NODE) {
      const previous = originals.get(node);
      return previous && node.data === previous.translated ? previous.source : node.data;
    }
    return Array.from(node.childNodes).map(sourceText).join("");
  }

  function translateNode(node) {
    if (!node.parentElement || node.parentElement.closest("script, style, textarea, [data-content-original]")) return;
    const previous = originals.get(node);
    const source = previous && node.data === previous.translated ? previous.source : node.data;
    if (!/[가-힣]/.test(source)) return;
    const translated = text(source);
    originals.set(node, { source: source, translated: translated });
    translatedNodes.add(node);
    if (node.data !== translated) node.data = translated;
  }

  function translateAttribute(node, name) {
    const id = node.getAttribute(name);
    if (id == null) return;
    const stored = attributes.get(node) || {};
    const previous = stored[name];
    const source = previous && id === previous.translated ? previous.source : id;
    if (!/[가-힣]/.test(source)) return;
    const translated = text(source);
    stored[name] = { source: source, translated: translated };
    attributes.set(node, stored);
    if (id !== translated) node.setAttribute(name, translated);
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) { translateNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateNode(walker.currentNode);
    const nodes = root.querySelectorAll("[aria-label], [title], [placeholder], [alt]");
    nodes.forEach(function (node) {
      ["aria-label", "title", "placeholder", "alt"].forEach(function (name) { translateAttribute(node, name); });
    });
    if (root.nodeType === Node.ELEMENT_NODE) {
      ["aria-label", "title", "placeholder", "alt"].forEach(function (name) { translateAttribute(root, name); });
    }
  }

  function trackMath(target, source, nodes) {
    if (refreshingMath || !/[가-힣]/.test(source) || !nodes.length) return;
    const start = document.createComment("math-text-start");
    const end = document.createComment("math-text-end");
    target.insertBefore(start, nodes[0]);
    target.insertBefore(end, nodes[nodes.length - 1].nextSibling);
    mathRanges.add({ source: source, start: start, end: end });
  }

  function refreshMath() {
    refreshingMath = true;
    try {
      for (const range of mathRanges) {
        if (!range.start.isConnected || !range.end.isConnected) { mathRanges.delete(range); continue; }
        let node = range.start.nextSibling;
        while (node && node !== range.end) {
          const next = node.nextSibling;
          node.remove();
          node = next;
        }
        const fragment = document.createDocumentFragment();
        window.GFIELDMathText.append(fragment, range.source);
        range.end.parentNode.insertBefore(fragment, range.end);
      }
    } finally { refreshingMath = false; }
  }

  function refresh() {
    if (!document.body) return;
    if (observer) observer.disconnect();
    document.documentElement.lang = locale;
    translateTree(document);
    document.querySelectorAll("[data-boarding-content-locale]").forEach(function (select) {
      select.value = locale === "en-SG" ? "en" : locale;
      select.setAttribute("aria-label", locale === "zh-Hans" ? "学习语言" : locale === "ko" ? "언어" : "Study language");
    });
    if (observer) observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["aria-label", "title", "placeholder", "alt"] });
  }

  function setLocale(value) {
    if (!supported.includes(value)) return;
    const changed = value !== locale;
    locale = value;
    const url = new URL(location.href);
    url.searchParams.set("locale", locale);
    history.replaceState(null, "", url);
    try { localStorage.setItem(storageKey, locale); } catch (_error) {}
    missing.clear();
    const returnLink = document.getElementById("study-return-link");
    if (returnLink) {
      returnLink.textContent = locale === "zh-Hans" ? "← 返回我的学习" : locale === "ko" ? "← 내 공부로 돌아가기" : "← Back to my study";
      const returnUrl = new URL(returnLink.href, location.href);
      returnUrl.searchParams.set("locale", locale === "en-SG" ? "en" : locale);
      returnLink.href = returnUrl.href;
    }
    if (changed) {
      refreshMath();
      translatedNodes.forEach(function (node) {
        if (!node.isConnected) { translatedNodes.delete(node); return; }
        translateNode(node);
      });
      attributes.forEach(function (_value, node) {
        if (!node.isConnected) { attributes.delete(node); return; }
        ["aria-label", "title", "placeholder", "alt"].forEach(function (name) { translateAttribute(node, name); });
      });
    }
    refresh();
  }

  function setup() {
    if (!document.getElementById("study-locale") && !document.getElementById("locale-select") && !document.querySelector("[data-locale]")) {
      const label = document.createElement("label");
      label.className = "boarding-content-language";
      const select = document.createElement("select");
      select.dataset.boardingContentLocale = "";
      select.dataset.contentOriginal = "";
      select.setAttribute("aria-label", "Study language");
      [["ko", "한국어"], ["en", "English"], ["zh-Hans", "中文（新加坡）"]].forEach(function (entry) { select.append(new Option(entry[1], entry[0])); });
      select.value = locale === "en-SG" ? "en" : locale;
      select.addEventListener("change", function () { setLocale(select.value); });
      label.append(select);
      const header = document.querySelector("header");
      if (header) header.append(label);
    }
    const existingSelect = document.getElementById("locale-select");
    if (existingSelect) existingSelect.addEventListener("change", function () { setLocale(existingSelect.value); });
    observer = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      queueMicrotask(function () { pending = false; refresh(); });
    });
    refresh();
    document.addEventListener("click", function (event) {
      if (locale === "ko" && !new URLSearchParams(location.search).has("locale")) return;
      const link = event.target.closest("a[href]");
      if (!link || link.getAttribute("href").startsWith("#") || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !url.pathname.endsWith(".html")) return;
      url.searchParams.set("locale", locale);
      const current = new URLSearchParams(location.search);
      if (current.get("study") === "1") {
        url.searchParams.set("study", "1");
        url.searchParams.set("studyGrade", current.get("studyGrade") || "7");
      }
      link.href = url.href;
    }, true);
  }

  window.GFIELDContentI18n = Object.freeze({
    text: text, sourceText: sourceText, trackMath: trackMath, setLocale: setLocale, refresh: refresh,
    current: function () { return locale; },
    missing: function () { return Array.from(missing); }
  });
  window.addEventListener("gfield-study-locale", function () { setLocale(window.GFIELDStudyLocale.current()); });
  window.addEventListener("hashchange", function () { queueMicrotask(refresh); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
