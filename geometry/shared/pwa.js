/* Geometry World PWA install helper. */
(function () {
  "use strict";

  var TEXT = {
    ko: {
      title: "&#92;uC571&#92;uCC98&#92;uB7FC &#92;uC124&#92;uCE58&#92;uD558&#92;uAE30",
      body: "&#92;uD648 &#92;uD654&#92;uBA74&#92;uC5D0 &#92;uCD94&#92;uAC00&#92;uD558&#92;uBA74 &#92;uC8FC&#92;uC18C&#92;uCC3D &#92;uC5C6&#92;uC774 &#92;uC571&#92;uCC98&#92;uB7FC &#92;uC804&#92;uCCB4 &#92;uD654&#92;uBA74&#92;uC73C&#92;uB85C &#92;uC2E4&#92;uD589&#92;uD560 &#92;uC218 &#92;uC788&#92;uC5B4&#92;uC694.",
      iosBody: "&#92;uD558&#92;uB2E8&#92;uC758 &#92;uACF5&#92;uC720 &#92;uBC84&#92;uD2BC&#92;uC744 &#92;uB204&#92;uB978 &#92;uB4A4 '&#92;uD648 &#92;uD654&#92;uBA74&#92;uC5D0 &#92;uCD94&#92;uAC00'&#92;uB97C &#92;uC120&#92;uD0DD&#92;uD574 &#92;uC8FC&#92;uC138&#92;uC694.",
      inAppTitle: "Chrome&#92;uC73C&#92;uB85C &#92;uC5F4&#92;uC5B4 &#92;uC8FC&#92;uC138&#92;uC694",
      inAppBody: "&#92;uCE74&#92;uCE74&#92;uC624&#92;uD1A1 &#92;uC548&#92;uC5D0&#92;uC11C&#92;uB294 &#92;uC571 &#92;uC124&#92;uCE58&#92;uAC00 &#92;uB418&#92;uC9C0 &#92;uC54A&#92;uC2B5&#92;uB2C8&#92;uB2E4. &#92;uC624&#92;uB978&#92;uCABD &#92;uC704 &#92;uBA54&#92;uB274&#92;uC5D0&#92;uC11C Chrome&#92;uC73C&#92;uB85C &#92;uC5F4&#92;uC5B4 &#92;uC8FC&#92;uC138&#92;uC694.",
      androidGuide: "Chrome &#92;uC624&#92;uB978&#92;uCABD &#92;uC704 &#92;uBA54&#92;uB274&#92;uC5D0&#92;uC11C '&#92;uC571 &#92;uC124&#92;uCE58'&#92;uB97C &#92;uB20C&#92;uB7EC &#92;uC8FC&#92;uC138&#92;uC694.",
      install: "&#92;uC124&#92;uCE58&#92;uD558&#92;uAE30",
      later: "&#92;uB2E4&#92;uC74C&#92;uC5D0",
      close: "&#92;uD655&#92;uC778",
      fullscreen: "&#92;uC804&#92;uCCB4 &#92;uD654&#92;uBA74"
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
  // The Android APK WebView appends this token to its UA and is already
  // permanently fullscreen, so the toggle button would be useless there.
  var isWrapperApp = ua.indexOf("GFIELDGeometryWorld") !== -1;
  if (canFullscreen && !standalone && !isWrapperApp) {
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
