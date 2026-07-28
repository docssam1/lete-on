/* =========================================================================
   Shared entry + level-completion flow for the eight Cube Town template games
   (count-heights, hidden-count, fill-box, cube-tunnel, cube-piece-lab,
   cube-memory, three-views, crystal-cubes).

   Two gaps this closes, both reported from real play:

   1. Only 똑같이 쌓기 showed a level list when you walked in. The other games
      hid #openLevels inside a panel header that the focused game shell sets to
      display:none, so a child could never see which level they were on. Here
      the game's own level dialog is opened on entry (after the concept
      tutorial finishes), and ?level=N jumps straight to that level.

   2. Every one of these games advanced problems with a modulo, so finishing
      the last problem of a level silently wrapped back to problem 1 forever —
      there was no way to reach the next level from inside the game. Here the
      last "다음 문제" press raises a celebration with 다음 레벨로 가기 and
      한번 더 연습하기 instead.

   Nothing in the game engines is touched. Everything works by reading the
   #progress label and clicking the buttons the games already render into
   #levelList, so each game keeps its own localized level names and its own
   idea of what selecting a level means.
   ========================================================================= */
(function () {
  "use strict";

  var bar = document.querySelector(".action-bar");
  var openLevels = document.getElementById("openLevels");
  var levelList = document.getElementById("levelList");
  var levelDialog = document.getElementById("levelDialog");
  var progress = document.getElementById("progress");
  if (!bar || !openLevels || !levelList || !progress) return;

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
    ko: "🔁 한번 더 연습하기",
    zh: "🔁 再练习一次",
    ja: "🔁 もういちど練習",
    en: "🔁 Practice One More Time"
  };

  var bypass = false;
  var overlay = null;

  function getLang() {
    try {
      return localStorage.getItem("gfield-language") || "ko";
    } catch (e) {
      return "ko";
    }
  }

  function pick(dict) {
    return dict[getLang()] || dict.ko;
  }

  /* ---------------------------------------------------------------------
     Level control in the rail. #openLevels lives in a header the focused
     shell hides, so the rail gets a twin that simply forwards the click and
     lets the game run its own handler.
     --------------------------------------------------------------------- */
  var railLevel = bar.querySelector(".rail-level");
  if (railLevel) {
    railLevel.addEventListener("click", function () {
      openLevels.click();
    });
  }

  /* ---------------------------------------------------------------------
     Entry: land on the level list, or jump to ?level=N.
     --------------------------------------------------------------------- */
  function levelButtons() {
    return levelList.querySelectorAll("button");
  }

  function requestedLevel() {
    try {
      var raw = new URL(window.location.href).searchParams.get("level");
      var n = parseInt(raw, 10);
      if (!isNaN(n) && n > 0) return n;
    } catch (e) {
      /* ignore */
    }
    return 0;
  }

  function tutorialOpen() {
    var tut = document.getElementById("conceptTutorial");
    return !!(tut && !tut.hidden);
  }

  function afterTutorial(fn) {
    if (!tutorialOpen()) {
      fn();
      return;
    }
    var tut = document.getElementById("conceptTutorial");
    var observer = new MutationObserver(function () {
      if (!tutorialOpen()) {
        observer.disconnect();
        setTimeout(fn, 250);
      }
    });
    observer.observe(tut, { attributes: true, attributeFilter: ["hidden"] });
  }

  function whenLevelsReady(fn, tries) {
    if (levelButtons().length) {
      fn();
      return;
    }
    if ((tries || 0) > 30) return;
    setTimeout(function () {
      whenLevelsReady(fn, (tries || 0) + 1);
    }, 100);
  }

  whenLevelsReady(function () {
    var wanted = requestedLevel();
    var buttons = levelButtons();
    if (wanted && wanted <= buttons.length) {
      buttons[wanted - 1].click();
      if (levelDialog) levelDialog.hidden = true;
      return;
    }
    afterTutorial(function () {
      openLevels.click();
    });
  });

  /* ---------------------------------------------------------------------
     Level completion. #progress reads "레벨 3 · 5/5" in every language, so the
     three numbers in it are level, current problem, problem count.
     --------------------------------------------------------------------- */
  function readProgress() {
    var nums = (progress.textContent || "").match(/\d+/g);
    if (!nums || nums.length < 3) return null;
    return { level: Number(nums[0]), current: Number(nums[1]), total: Number(nums[2]) };
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".gf-overlay-backdrop{position:fixed;inset:0;background:rgba(13,28,32,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:1200;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;}" +
      ".gf-overlay-backdrop[hidden]{display:none;}" +
      ".gf-overlay-card{background:#fffdf5;border:3px solid #172653;border-radius:14px;padding:22px;max-width:420px;width:calc(100vw - 48px);max-height:calc(100vh - 24px);overflow:auto;text-align:center;box-shadow:0 18px 40px rgba(13,28,32,.35);box-sizing:border-box;}" +
      ".gf-overlay-emoji{font-size:40px;line-height:1;margin:0 0 6px;}" +
      ".gf-overlay-title{color:#172653;font-size:24px;font-weight:900;margin:0 0 6px;}" +
      ".gf-overlay-subtitle{color:#69736d;font-size:13px;margin:0 0 16px;}" +
      ".gf-overlay-actions{display:flex;flex-direction:column;gap:10px;}" +
      ".gf-overlay-btn{min-height:48px;border-radius:10px;font-weight:900;font-size:15px;cursor:pointer;width:100%;border:none;box-sizing:border-box;font-family:inherit;}" +
      ".gf-overlay-btn-primary{background:#2c9a50;color:#fff;box-shadow:0 4px 0 #14683a;}" +
      ".gf-overlay-btn-secondary{background:#fff;color:#172653;border:2px solid #172653;}";
    document.head.appendChild(style);
  }

  function buildOverlay() {
    if (overlay) return overlay;
    injectStyles();

    var backdrop = document.createElement("div");
    backdrop.className = "gf-overlay-backdrop";
    backdrop.hidden = true;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");

    var card = document.createElement("div");
    card.className = "gf-overlay-card";

    var emojiEl = document.createElement("div");
    emojiEl.className = "gf-overlay-emoji";
    emojiEl.textContent = "🎉";

    var titleEl = document.createElement("div");
    titleEl.className = "gf-overlay-title";

    var subtitleEl = document.createElement("div");
    subtitleEl.className = "gf-overlay-subtitle";

    var actions = document.createElement("div");
    actions.className = "gf-overlay-actions";

    var primaryBtn = document.createElement("button");
    primaryBtn.type = "button";
    primaryBtn.className = "gf-overlay-btn gf-overlay-btn-primary";

    var secondaryBtn = document.createElement("button");
    secondaryBtn.type = "button";
    secondaryBtn.className = "gf-overlay-btn gf-overlay-btn-secondary";

    actions.appendChild(primaryBtn);
    actions.appendChild(secondaryBtn);
    card.appendChild(emojiEl);
    card.appendChild(titleEl);
    card.appendChild(subtitleEl);
    card.appendChild(actions);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) backdrop.hidden = true;
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

  function selectLevel(oneBased) {
    var buttons = levelButtons();
    if (oneBased < 1 || oneBased > buttons.length) return false;
    buttons[oneBased - 1].click();
    if (levelDialog) levelDialog.hidden = true;
    return true;
  }

  function showOverlay(level) {
    var ov = buildOverlay();
    var total = levelButtons().length;
    var hasNext = level < total;

    ov.title.textContent = pick(TITLES).replace("{n}", String(level));
    ov.subtitle.textContent = pick(SUBTITLES);
    ov.primaryBtn.textContent = hasNext ? pick(PRIMARY_NEXT_LEVEL) : pick(PRIMARY_FINISH);
    ov.secondaryBtn.textContent = pick(SECONDARY);

    ov.primaryBtn.onclick = function () {
      ov.backdrop.hidden = true;
      if (hasNext) selectLevel(level + 1);
      else window.location.href = "../../cube-town/";
    };
    ov.secondaryBtn.onclick = function () {
      ov.backdrop.hidden = true;
      if (!selectLevel(level)) {
        bypass = true;
        document.getElementById("next").click();
      }
    };

    ov.backdrop.hidden = false;
  }

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;
      if (!target.closest("#next")) return;
      if (bypass) {
        bypass = false;
        return;
      }
      var state = readProgress();
      if (!state || state.current < state.total) return;

      event.preventDefault();
      event.stopPropagation();
      showOverlay(state.level);
    },
    true
  );

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Escape" && overlay && !overlay.backdrop.hidden) overlay.backdrop.hidden = true;
    },
    true
  );
})();
