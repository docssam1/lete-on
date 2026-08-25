/* Geometry World PWA install helper. */
(function () {
  "use strict";

  var TEXT = {
    ko: {
      title: "앱처럼 설치하기",
      body: "홈 화면에 추가하면 주소창 없이 앱처럼 전체 화면으로 실행할 수 있어요.",
      iosBody: "하단의 공유 버튼을 누른 뒤 '홈 화면에 추가'를 선택해 주세요.",
      inAppTitle: "Chrome으로 열어 주세요",
      inAppBody: "카카오톡 안에서는 앱 설치가 되지 않습니다. 오른쪽 위 메뉴에서 Chrome으로 열어 주세요.",
      androidGuide: "Chrome 오른쪽 위 메뉴에서 '앱 설치'를 눌러 주세요.",
      install: "설치하기",
      later: "다음에",
      close: "확인",
      fullscreen: "전체 화면"
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
  var pendingBannerKind = null;
  var waitingForTutorial = false;

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

  function tutorialIsOpen() {
    var tutorial = document.getElementById("tutorial");
    return document.documentElement.getAttribute("data-pwa-defer") === "tutorial" || !!(tutorial && !tutorial.hidden);
  }

  function showBanner(kind) {
    if (standalone || isDismissed()) return;
    if (tutorialIsOpen()) {
      pendingBannerKind = kind;
      if (!waitingForTutorial) {
        waitingForTutorial = true;
        window.addEventListener("gfield:tutorial-finished", function () {
          waitingForTutorial = false;
          var nextKind = pendingBannerKind;
          pendingBannerKind = null;
          if (nextKind) window.setTimeout(function () { showBanner(nextKind); }, 700);
        }, { once: true });
      }
      return;
    }
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
