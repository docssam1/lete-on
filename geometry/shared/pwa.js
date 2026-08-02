/* Geometry World PWA install helper. */
(function () {
  "use strict";

  var TEXT = {
    ko: {
      title: "\uC571\uCC98\uB7FC \uC124\uCE58\uD558\uAE30",
      body: "\uD648 \uD654\uBA74\uC5D0 \uCD94\uAC00\uD558\uBA74 \uC8FC\uC18C\uCC3D \uC5C6\uC774 \uC571\uCC98\uB7FC \uC804\uCCB4 \uD654\uBA74\uC73C\uB85C \uC2E4\uD589\uD560 \uC218 \uC788\uC5B4\uC694.",
      iosBody: "\uD558\uB2E8\uC758 \uACF5\uC720 \uBC84\uD2BC\uC744 \uB204\uB978 \uB4A4 '\uD648 \uD654\uBA74\uC5D0 \uCD94\uAC00'\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
      inAppTitle: "Chrome\uC73C\uB85C \uC5F4\uC5B4 \uC8FC\uC138\uC694",
      inAppBody: "\uCE74\uCE74\uC624\uD1A1 \uC548\uC5D0\uC11C\uB294 \uC571 \uC124\uCE58\uAC00 \uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC624\uB978\uCABD \uC704 \uBA54\uB274\uC5D0\uC11C Chrome\uC73C\uB85C \uC5F4\uC5B4 \uC8FC\uC138\uC694.",
      androidGuide: "Chrome \uC624\uB978\uCABD \uC704 \uBA54\uB274\uC5D0\uC11C '\uC571 \uC124\uCE58'\uB97C \uB20C\uB7EC \uC8FC\uC138\uC694.",
      install: "\uC124\uCE58\uD558\uAE30",
      later: "\uB2E4\uC74C\uC5D0",
      close: "\uD655\uC778",
      fullscreen: "\uC804\uCCB4 \uD654\uBA74"
    },
    en: {
      title: "Install like an app",
      body: "Add Geometry World to your home screen and play without a browser bar.",
      iosBody: "Use Share, then choose Add to Home Screen.",
      inAppTitle: "Open in Chrome",
      inAppBody: "This in-app browser cannot install Geometry World. Open this page in Chrome or Safari.",
      androidGuide: "Open Chrome's menu and choose Install app.",
      install: "Install",
      later: "Later",
      close: "OK",
      fullscreen: "Fullscreen"
    }
  };

  var language = "ko";
  try { language = localStorage.getItem("gfield-language") || "ko"; } catch (error) {}
  var text = TEXT[language] || TEXT.ko;
  var ua = navigator.userAgent || "";
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua);
  var isAndroid = /android/i.test(ua);
  var isInApp = /kakaotalk|kakaostory|naver|daumapps|instagram|fban|fbav|line\//i.test(ua);
  var standalone = false;
  var deferredPrompt = null;

  try {
    standalone = !!(window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches)) || window.navigator.standalone === true;
  } catch (error) {}

  function whenReady(callback) {
    if (document.body) callback();
    else document.addEventListener("DOMContentLoaded", callback, { once: true });
  }

  function isDismissed() {
    try { return Number(localStorage.getItem("gfield-pwa-hide-until") || 0) > Date.now(); } catch (error) { return false; }
  }

  function dismiss() {
    var banner = document.getElementById("gf-install-banner");
    if (banner) {
      banner.classList.remove("show");
      window.setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
    }
    try { localStorage.setItem("gfield-pwa-hide-until", String(Date.now() + 3 * 24 * 60 * 60 * 1000)); } catch (error) {}
  }

  function showBanner(kind) {
    if (standalone || isDismissed()) return;
    var banner = document.getElementById("gf-install-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "gf-install-banner";
      banner.className = "gf-install-banner";
      banner.setAttribute("role", "dialog");
      document.body.appendChild(banner);
    }

    var title = text.title;
    var body = text.body;
    var action = "install";
    if (kind === "ios") { body = text.iosBody; action = "close"; }
    if (kind === "in-app") { title = text.inAppTitle; body = text.inAppBody; action = "close"; }
    if (kind === "android-guide") { body = text.androidGuide; action = "close"; }

    banner.setAttribute("aria-label", title);
    banner.replaceChildren();
    var icon = document.createElement("span");
    icon.className = "gf-ib-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = "&#x25A0;";

    var copy = document.createElement("div");
    copy.className = "gf-ib-text";
    var heading = document.createElement("strong");
    heading.textContent = title;
    var description = document.createElement("span");
    description.textContent = body;
    copy.append(heading, description);

    var actions = document.createElement("div");
    actions.className = "gf-ib-actions";
    if (action === "install") {
      var install = document.createElement("button");
      install.type = "button";
      install.className = "gf-ib-install";
      install.textContent = text.install;
      install.addEventListener("click", function () {
        if (!deferredPrompt) return showBanner("android-guide");
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () { deferredPrompt = null; dismiss(); }).catch(dismiss);
      });
      actions.appendChild(install);
    }
    var close = document.createElement("button");
    close.type = "button";
    close.className = "gf-ib-later";
    close.textContent = action === "install" ? text.later : text.close;
    close.addEventListener("click", dismiss);
    actions.appendChild(close);
    banner.append(icon, copy, actions);
    requestAnimationFrame(function () { banner.classList.add("show"); });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/geometry/sw.js", { scope: "/geometry/" }).catch(function () {});
    }, { once: true });
  }

  var root = document.documentElement;
  var canFullscreen = !!(root.requestFullscreen || root.webkitRequestFullscreen);
  function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  if (canFullscreen && !standalone) {
    whenReady(function () {
      var toolbar = document.querySelector(".map-toolbar");
      if (!toolbar) return;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "gf-fullscreen-btn";
      button.setAttribute("aria-label", text.fullscreen);
      button.title = text.fullscreen;
      button.innerHTML = "&#x26F6;";
      button.addEventListener("click", function () {
        try {
          if (isFullscreen()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          else (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
        } catch (error) {}
      });
      document.addEventListener("fullscreenchange", function () { button.classList.toggle("on", isFullscreen()); });
      toolbar.appendChild(button);
    });
  }

  if (standalone) return;
  whenReady(function () {
    if (isInApp) return window.setTimeout(function () { showBanner("in-app"); }, 700);
    if (isIOS && isSafari) return window.setTimeout(function () { showBanner("ios"); }, 1000);
    if (isAndroid) window.setTimeout(function () {
      if (!deferredPrompt) showBanner("android-guide");
    }, 2500);
  });

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    whenReady(function () { showBanner("install"); });
  });
  window.addEventListener("appinstalled", dismiss);
})();
