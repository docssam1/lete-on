(function () {
  "use strict";

  var nextStepBtn = document.getElementById("nextStep");
  if (!nextStepBtn) return;

  var NEXT_LEVEL_LABELS = ["다음 단계", "下一阶段", "次のステップ", "Next Level"];
  var FINISH_LABELS = ["마치기", "完成", "おわる", "Finish"];

  var TITLES = {
    ko: "레벨 {n} 완료!",
    zh: "完成第 {n} 级！",
    ja: "レベル {n} クリア！",
    en: "Level {n} Complete!"
  };

  var SUBTITLES = {
    ko: "정말 잘했어! 이제 어떻게 할까?",
    zh: "太棒了！接下来做什么？",
    ja: "よくできたね！次はどうする？",
    en: "Great job! What's next?"
  };

  var PRIMARY_NEXT_LEVEL = {
    ko: "다음 레벨로 가기 →",
    zh: "前往下一级 →",
    ja: "次のレベルへ →",
    en: "Go to Next Level →"
  };

  var PRIMARY_FINISH = {
    ko: "마을로 돌아가기",
    zh: "返回村庄",
    ja: "村にもどる",
    en: "Back to Town"
  };

  var SECONDARY = {
    ko: "🔁 이 레벨 더 연습하기",
    zh: "🔁 再练习本级",
    ja: "🔁 このレベルをもっと練習",
    en: "🔁 Practice This Level Again"
  };

  var EMOJI_CELEBRATE = "🎉";

  var bypass = false;
  var overlay = null;

  function getLang() {
    try {
      return localStorage.getItem("gfield-language") || "ko";
    } catch (e) {
      return "ko";
    }
  }

  function getLevelFromUrl() {
    try {
      var params = new URL(window.location.href).searchParams;
      var raw = params.get("level");
      var n = parseInt(raw, 10);
      if (!isNaN(n) && n > 0) return n;
    } catch (e) {
      /* ignore */
    }
    return 1;
  }

  function pick(dict, lang) {
    return dict[lang] || dict.ko;
  }

  function formatTitle(lang, level) {
    var tpl = pick(TITLES, lang);
    return tpl.replace("{n}", String(level));
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".lc-overlay-backdrop{position:fixed;inset:0;background:rgba(13,28,32,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:90;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;}" +
      ".lc-overlay-backdrop[hidden]{display:none;}" +
      ".lc-overlay-card{background:#fffdf5;border:3px solid #172653;border-radius:14px;padding:28px;max-width:420px;width:calc(100vw - 48px);text-align:center;box-shadow:0 18px 40px rgba(13,28,32,.35);box-sizing:border-box;}" +
      ".lc-overlay-emoji{font-size:48px;line-height:1;margin:0 0 8px;}" +
      ".lc-overlay-title{color:#172653;font-size:26px;font-weight:900;margin:0 0 8px;}" +
      ".lc-overlay-subtitle{color:#69736d;font-size:14px;margin:0 0 20px;}" +
      ".lc-overlay-actions{display:flex;flex-direction:column;gap:12px;}" +
      ".lc-overlay-btn{min-height:52px;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer;width:100%;border:none;box-sizing:border-box;font-family:inherit;}" +
      ".lc-overlay-btn-primary{background:#2c9a50;color:#fff;box-shadow:0 4px 0 #14683a;}" +
      ".lc-overlay-btn-secondary{background:#fff;color:#172653;border:2px solid #172653;}";
    document.head.appendChild(style);
  }

  function buildOverlay() {
    if (overlay) return overlay;
    injectStyles();

    var backdrop = document.createElement("div");
    backdrop.className = "lc-overlay-backdrop";
    backdrop.hidden = true;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");

    var card = document.createElement("div");
    card.className = "lc-overlay-card";

    var emojiEl = document.createElement("div");
    emojiEl.className = "lc-overlay-emoji";
    emojiEl.textContent = EMOJI_CELEBRATE;

    var titleEl = document.createElement("div");
    titleEl.className = "lc-overlay-title";

    var subtitleEl = document.createElement("div");
    subtitleEl.className = "lc-overlay-subtitle";

    var actions = document.createElement("div");
    actions.className = "lc-overlay-actions";

    var primaryBtn = document.createElement("button");
    primaryBtn.type = "button";
    primaryBtn.className = "lc-overlay-btn lc-overlay-btn-primary";

    var secondaryBtn = document.createElement("button");
    secondaryBtn.type = "button";
    secondaryBtn.className = "lc-overlay-btn lc-overlay-btn-secondary";

    actions.appendChild(primaryBtn);
    actions.appendChild(secondaryBtn);

    card.appendChild(emojiEl);
    card.appendChild(titleEl);
    card.appendChild(subtitleEl);
    card.appendChild(actions);

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) hideOverlay();
    });

    secondaryBtn.addEventListener("click", function () {
      practiceAgain();
    });

    overlay = {
      backdrop: backdrop,
      title: titleEl,
      subtitle: subtitleEl,
      primaryBtn: primaryBtn,
      secondaryBtn: secondaryBtn
    };

    return overlay;
  }

  function isOverlayVisible() {
    return !!(overlay && !overlay.backdrop.hidden);
  }

  function hideOverlay() {
    if (overlay) overlay.backdrop.hidden = true;
  }

  function practiceAgain() {
    var level = getLevelFromUrl();
    var url = new URL(window.location.href);
    url.searchParams.set("level", String(level));
    url.searchParams.delete("tutorial");
    window.location.href = url.toString();
  }

  function showOverlay(kind) {
    var lang = getLang();
    var level = getLevelFromUrl();
    var ov = buildOverlay();

    ov.title.textContent = formatTitle(lang, level);
    ov.subtitle.textContent = pick(SUBTITLES, lang);
    ov.primaryBtn.textContent =
      kind === "finish" ? pick(PRIMARY_FINISH, lang) : pick(PRIMARY_NEXT_LEVEL, lang);
    ov.secondaryBtn.textContent = pick(SECONDARY, lang);

    ov.primaryBtn.onclick = function () {
      bypass = true;
      hideOverlay();
      var btn = document.getElementById("nextStep");
      if (btn) btn.click();
    };

    ov.backdrop.hidden = false;
  }

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Escape" && isOverlayVisible()) {
        hideOverlay();
      }
    },
    true
  );

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;
      var btn = target.closest("#nextStep");
      if (!btn) return;

      if (bypass) {
        bypass = false;
        return;
      }

      var labelEl = btn.querySelector(".next-label");
      var rawLabel = labelEl ? labelEl.textContent : btn.textContent;
      var label = (rawLabel || "").trim();

      var isNextLevel = NEXT_LEVEL_LABELS.indexOf(label) !== -1;
      var isFinish = FINISH_LABELS.indexOf(label) !== -1;
      if (!isNextLevel && !isFinish) return;

      event.preventDefault();
      event.stopPropagation();

      showOverlay(isFinish ? "finish" : "nextLevel");
    },
    true
  );
})();
