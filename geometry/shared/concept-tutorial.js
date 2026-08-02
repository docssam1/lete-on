/* =========================================================================
   Shared first-visit concept tutorial.

   The eight template games each build their own version of this card inside
   their engine. 직육면체 방향 (shape-build) never got one, so a child opening it
   for the first time was dropped straight into a puzzle with no explanation.

   This file is the standalone version: it needs nothing from the game engine,
   injects its own styles, and reads its copy from window.GF_TUTORIAL, which
   the page sets before loading this script:

     window.GF_TUTORIAL = {
       key: "gfield-shape-build-tutorial-v1",
       steps: { ko: [...], zh: [...], ja: [...], en: [...] }
     };

   It shows once per device, replays on ?tutorial=1, and speaks each step with
   the same voice settings and the same mute switch the games use.
   ========================================================================= */
(function () {
  "use strict";

  var config = window.GF_TUTORIAL;
  if (!config || !config.steps) return;

  var NEXT_LABEL = { ko: "다음", zh: "下一步", ja: "次へ", en: "Next" };
  var START_LABEL = { ko: "시작", zh: "开始", ja: "スタート", en: "Start" };
  var SKIP_LABEL = { ko: "건너뛰기", zh: "跳过", ja: "スキップ", en: "Skip" };
  var VOICE_LOCALE = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" };

  function read(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  var lang = read("gfield-language", "ko") || "ko";
  var steps = config.steps[lang] || config.steps.ko || [];
  if (!steps.length) return;

  var forced = false;
  try {
    forced = new URL(window.location.href).searchParams.get("tutorial") === "1";
  } catch (e) {
    /* ignore */
  }
  if (!forced && read(config.key, "") === "done") return;

  var step = 0;
  var els = null;

  function speak(message) {
    if (read("gfield-audio-muted", "false") === "true") return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = VOICE_LOCALE[lang] || "ko-KR";
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      /* ignore */
    }
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".gft-veil[hidden]{display:none;}" +
      ".gft-veil{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:16px;box-sizing:border-box;background:rgba(40,23,11,.5);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}" +
      ".gft-card{display:grid;grid-template-columns:minmax(240px,440px) 168px;align-items:center;gap:16px;width:min(660px,90vw);}" +
      ".gft-copy{position:relative;padding:22px 24px 18px;border:2px solid #d6b982;border-radius:16px;background:#fffaf0;box-shadow:0 16px 36px rgba(28,14,6,.3),inset 0 2px 0 #fff;box-sizing:border-box;}" +
      ".gft-copy::after{content:\"\";position:absolute;right:-14px;top:50%;width:26px;height:26px;background:#fffaf0;border-top:2px solid #d6b982;border-right:2px solid #d6b982;transform:translateY(-50%) rotate(45deg);}" +
      ".gft-copy p{min-height:56px;margin:0 0 14px;color:#332317;font-size:19px;font-weight:900;line-height:1.5;}" +
      ".gft-dots{display:flex;gap:7px;margin:0 0 14px;}" +
      ".gft-dots span{width:9px;height:9px;border-radius:50%;background:#d9c8aa;}" +
      ".gft-dots span.active{width:24px;border-radius:8px;background:#3b8e80;}" +
      ".gft-dots span.done{background:#7db69a;}" +
      ".gft-row{display:flex;align-items:center;gap:12px;}" +
      ".gft-next{min-width:104px;min-height:42px;padding:8px 18px;border:2px solid #367532;border-radius:12px;background:linear-gradient(#67bc5d,#3d9139);color:#fff;font-size:15px;font-weight:950;font-family:inherit;cursor:pointer;box-shadow:inset 0 2px 0 rgba(255,255,255,.3),0 3px 0 rgba(39,87,36,.3);}" +
      ".gft-skip{min-height:36px;padding:6px 10px;border:none;background:none;color:#8a7358;font-size:13px;font-weight:800;font-family:inherit;cursor:pointer;text-decoration:underline;}" +
      ".gft-cubi{width:168px;aspect-ratio:1;background:url(\"../../world-map/assets/geometry-characters.png\") 0 0 / 300% 300% no-repeat;filter:drop-shadow(0 14px 12px rgba(26,14,7,.35));animation:gft-alive 2.1s ease-in-out infinite;transform-origin:50% 88%;}" +
      "@keyframes gft-alive{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-6px) scale(1.02);}}" +
      "@media (max-width:720px),(max-height:520px){" +
      ".gft-card{grid-template-columns:1fr;gap:8px;width:min(520px,94vw);}" +
      ".gft-cubi{display:none;}" +
      ".gft-copy::after{display:none;}" +
      ".gft-copy{padding:14px 16px 12px;}" +
      ".gft-copy p{min-height:0;font-size:15px;margin:0 0 10px;line-height:1.45;}" +
      ".gft-dots{margin:0 0 10px;}" +
      ".gft-next{min-height:38px;font-size:14px;}" +
      "}";
    document.head.appendChild(style);
  }

  function render() {
    els.message.textContent = steps[step];
    els.next.textContent = step === steps.length - 1 ? (START_LABEL[lang] || START_LABEL.ko) : (NEXT_LABEL[lang] || NEXT_LABEL.ko);
    els.dots.replaceChildren();
    for (var i = 0; i < steps.length; i += 1) {
      var dot = document.createElement("span");
      if (i === step) dot.className = "active";
      else if (i < step) dot.className = "done";
      els.dots.append(dot);
    }
  }

  function finish() {
    try {
      localStorage.setItem(config.key, "done");
    } catch (e) {
      /* ignore */
    }
    els.veil.hidden = true;
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        /* ignore */
      }
    }
  }

  function build() {
    injectStyles();

    var veil = document.createElement("div");
    veil.className = "gft-veil";
    veil.setAttribute("role", "dialog");
    veil.setAttribute("aria-modal", "true");

    var card = document.createElement("div");
    card.className = "gft-card";

    var copy = document.createElement("div");
    copy.className = "gft-copy";

    var message = document.createElement("p");
    var dots = document.createElement("div");
    dots.className = "gft-dots";

    var row = document.createElement("div");
    row.className = "gft-row";

    var next = document.createElement("button");
    next.type = "button";
    next.className = "gft-next";

    var skip = document.createElement("button");
    skip.type = "button";
    skip.className = "gft-skip";
    skip.textContent = SKIP_LABEL[lang] || SKIP_LABEL.ko;

    row.append(next, skip);
    copy.append(message, dots, row);

    var cubi = document.createElement("span");
    cubi.className = "gft-cubi";
    cubi.setAttribute("aria-hidden", "true");

    card.append(copy, cubi);
    veil.append(card);
    document.body.append(veil);

    els = { veil: veil, message: message, dots: dots, next: next };

    next.addEventListener("click", function () {
      if (step < steps.length - 1) {
        step += 1;
        render();
        speak(steps[step]);
        return;
      }
      finish();
    });
    skip.addEventListener("click", finish);

    render();
    window.setTimeout(function () {
      speak(steps[0]);
    }, 260);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
