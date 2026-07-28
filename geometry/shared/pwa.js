/* GFIELD Geometry World — PWA helper.
 *
 * Three jobs, all optional and self-contained:
 *   1. Register the service worker (enables install + offline).
 *   2. Show an install banner with a guide message:
 *        - Android / desktop Chromium: a real "Install" button (beforeinstallprompt).
 *        - iOS Safari: a "Share → Add to Home Screen" instruction (no JS install API).
 *   3. Add a floating fullscreen toggle (hidden where the Fullscreen API is
 *      unavailable, e.g. iPhone Safari, and inside an already-installed app).
 *
 * Text follows the site's saved language (gfield-language). A dismissed banner
 * stays hidden for two weeks (gfield-pwa-hide-until), then may reappear.
 */
(function () {
  "use strict";

  var STRINGS = {
    ko: {
      title: "앱처럼 설치하기",
      body: "홈 화면에 추가하면 주소창 없이 전체화면으로, 앱처럼 즐길 수 있어요.",
      iosBody: "아래 공유 버튼 📤 을 누르고 “홈 화면에 추가”를 선택하면 앱이 돼요.",
      install: "설치하기",
      later: "나중에",
      fullscreen: "전체화면"
    },
    en: {
      title: "Install like an app",
      body: "Add it to your home screen to play fullscreen — no address bar, just like an app.",
      iosBody: "Tap the Share button 📤 below, then choose “Add to Home Screen”.",
      install: "Install",
      later: "Later",
      fullscreen: "Fullscreen"
    },
    zh: {
      title: "像应用一样安装",
      body: "添加到主屏幕，就能全屏、无地址栏，像应用一样玩。",
      iosBody: "点下方的分享按钮 📤，再选择“添加到主屏幕”。",
      install: "安装",
      later: "以后",
      fullscreen: "全屏"
    },
    ja: {
      title: "アプリのように使う",
      body: "ホーム画面に追加すると、アドレスバーなしの全画面でアプリのように遊べます。",
      iosBody: "下の共有ボタン 📤 を押して「ホーム画面に追加」を選んでね。",
      install: "インストール",
      later: "あとで",
      fullscreen: "全画面"
    }
  };
  var lang = "ko";
  try { lang = localStorage.getItem("gfield-language") || "ko"; } catch (e) { lang = "ko"; }
  var t = STRINGS[lang] || STRINGS.ko;

  var standalone = false;
  try {
    standalone = (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches
      || window.matchMedia("(display-mode: fullscreen)").matches))
      || window.navigator.standalone === true;
  } catch (e) { standalone = false; }

  function ready(fn) {
    if (document.body) fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // --- 1. service worker ---------------------------------------------------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/geometry/sw.js", { scope: "/geometry/" }).catch(function () {});
    });
  }

  // --- 3. fullscreen toggle (added first so it exists on the hub) ----------
  var docEl = document.documentElement;
  var canFs = !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen);
  function isFs() { return document.fullscreenElement || document.webkitFullscreenElement; }
  if (canFs && !standalone) {
    ready(function () {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gf-fullscreen-btn";
      btn.setAttribute("aria-label", t.fullscreen);
      btn.title = t.fullscreen;
      btn.innerHTML = "<span aria-hidden=\"true\">⛶</span>";
      btn.addEventListener("click", function () {
        try {
          if (isFs()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
          else { (docEl.requestFullscreen || docEl.webkitRequestFullscreen).call(docEl); }
        } catch (e) {}
      });
      document.addEventListener("fullscreenchange", function () { btn.classList.toggle("on", !!isFs()); });
      document.body.appendChild(btn);
    });

    // Auto-enter fullscreen on the first tap (touch devices, not installed).
    // Browsers forbid going fullscreen on load without a user gesture, so we arm
    // a one-shot listener that fires on the very first interaction and then
    // removes itself — we never re-force it, so a child who deliberately leaves
    // fullscreen is left alone.
    var coarse = false;
    try { coarse = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches); } catch (e) {}
    if (coarse) {
      var armFs = function () {
        document.removeEventListener("pointerdown", armFs, true);
        document.removeEventListener("touchend", armFs, true);
        document.removeEventListener("click", armFs, true);
        try { if (!isFs()) (docEl.requestFullscreen || docEl.webkitRequestFullscreen).call(docEl); } catch (e) {}
      };
      document.addEventListener("pointerdown", armFs, true);
      document.addEventListener("touchend", armFs, true);
      document.addEventListener("click", armFs, true);
    }
  }

  // --- 2. install banner ---------------------------------------------------
  if (standalone) return;              // already installed → nothing to prompt
  try {
    var until = Number(localStorage.getItem("gfield-pwa-hide-until") || 0);
    if (until && Date.now() < until) return;
  } catch (e) {}

  var deferredPrompt = null;

  function dismiss() {
    var el = document.getElementById("gf-install-banner");
    if (el) { el.classList.remove("show"); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300); }
    try { localStorage.setItem("gfield-pwa-hide-until", String(Date.now() + 14 * 24 * 60 * 60 * 1000)); } catch (e) {}
  }

  function showBanner(kind) {          // kind: "android" | "ios"
    if (document.getElementById("gf-install-banner")) return;
    var body = kind === "ios" ? t.iosBody : t.body;
    var wrap = document.createElement("div");
    wrap.id = "gf-install-banner";
    wrap.className = "gf-install-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", t.title);
    var html = "";
    html += "<span class=\"gf-ib-icon\" aria-hidden=\"true\">◆</span>";
    html += "<div class=\"gf-ib-text\"><strong></strong><span></span></div>";
    html += "<div class=\"gf-ib-actions\">";
    if (kind === "android") html += "<button type=\"button\" class=\"gf-ib-install\"></button>";
    html += "<button type=\"button\" class=\"gf-ib-later\"></button>";
    html += "</div>";
    wrap.innerHTML = html;
    // Set text via textContent to avoid any injection.
    wrap.querySelector(".gf-ib-text strong").textContent = t.title;
    wrap.querySelector(".gf-ib-text span").textContent = body;
    var laterBtn = wrap.querySelector(".gf-ib-later");
    laterBtn.textContent = t.later;
    laterBtn.addEventListener("click", dismiss);
    var installBtn = wrap.querySelector(".gf-ib-install");
    if (installBtn) {
      installBtn.textContent = t.install;
      installBtn.addEventListener("click", function () {
        if (!deferredPrompt) { dismiss(); return; }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () { deferredPrompt = null; dismiss(); }).catch(function () { dismiss(); });
      });
    }
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add("show"); });
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    ready(function () { showBanner("android"); });
  });
  window.addEventListener("appinstalled", function () { dismiss(); });

  // iOS Safari has no beforeinstallprompt — show the manual guide there.
  var ua = navigator.userAgent || "";
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua);
  if (isIOS && isSafari) {
    ready(function () { setTimeout(function () { showBanner("ios"); }, 1400); });
  }
})();
