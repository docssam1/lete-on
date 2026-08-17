// GFIELD 지오메트리 랩 랜딩 — 단계·강도·유형·문항 수를 고르고 학습지
// 생성기로 넘겨 주는 화면.
//
// 이 파일에는 단계 목록도 유형 목록도 들어 있지 않다. 둘 다 학습지 엔진
// (../worksheet/generators.js)이 유일한 원본이고, 이 페이지는 window.GW_GEN에
// 실린 LEVELS / TYPES를 그대로 읽어 그린다. 여기에 상수로 베껴 두면 엔진이
// 유형을 하나 늘리거나 어떤 단계를 열어 준 날 이 랜딩만 옛 목록을 보여 주고,
// "만들기" 버튼은 그 단계가 지원하지 않는 유형을 넘기게 된다.
(function () {
  "use strict";

  const GEN = window.GW_GEN;
  const WORKSHEET_URL = "../worksheet/index.html";

  // 문항 수 선택지는 학습지 생성기의 문항 수 select와 같은 값만 쓴다 — 거기
  // 없는 값을 넘기면 생성기가 무시하고 기본값으로 되돌아간다.
  const COUNTS = [6, 9, 12, 15];

  const state = {
    level: GEN.DEFAULT_LEVEL,
    intensity: GEN.DEFAULT_INTENSITY,
    types: GEN.TYPES.filter((t) => t.defaultOn).map((t) => t.code),
    count: 9,
    levelNote: ""
  };

  function $(id) { return document.getElementById(id); }

  function supportsLevel(code) {
    return GEN.typeSupportsLevel(code, state.level);
  }

  function levelName(code) {
    const info = GEN.levelInfo(code);
    return info ? info.name : code;
  }

  function typeLabel(code) {
    const info = GEN.typeInfo(code);
    return info ? info.label : code;
  }

  // 선택한 단계가 제공하지 않는 유형은 조용히 떨어뜨린다. 하나도 남지 않으면
  // 그 단계의 기본 유형으로 되돌린다 — 유형이 0개인 상태로 "만들기"를 누르면
  // 생성기가 제멋대로 채우므로, 화면에 보이는 것과 인쇄물이 달라진다.
  function pruneTypes() {
    const kept = state.types.filter(supportsLevel);
    if (kept.length) { state.types = kept; return; }
    const fallback = GEN.TYPES.filter((t) => t.defaultOn && supportsLevel(t.code)).map((t) => t.code);
    state.types = fallback.length ? fallback : GEN.typesForLevel(state.level).slice(0, 1);
  }

  // 준비 중 단계를 고르면 가장 가까운 제공 단계로 옮기고 왜 옮겼는지 남긴다
  // (학습지 생성기의 나이 선택과 같은 규칙).
  function setLevel(level) {
    const wanted = GEN.normalizeLevel(level);
    const info = GEN.levelInfo(wanted);
    if (info && info.available) {
      state.level = wanted;
      state.levelNote = "";
    } else {
      state.level = GEN.nearestAvailableLevel(wanted);
      const target = GEN.levelInfo(state.level);
      state.levelNote = (info ? info.name : wanted) + " 단계는 아직 준비 중이라 가장 가까운 " +
        (target ? target.name + " · " + target.age : state.level) + " 단계로 맞췄어요.";
    }
    pruneTypes();
  }

  // ---------------------------------------------------------------------
  // 렌더
  // ---------------------------------------------------------------------
  function stageBadge(levelInfo, container) {
    const el = document.createElement(levelInfo.available ? "button" : "span");
    if (levelInfo.available) el.type = "button";
    el.className = "stage-badge" +
      (levelInfo.available ? "" : " is-soon") +
      (levelInfo.code === state.level ? " is-active" : "");
    el.dataset.level = levelInfo.code;
    el.innerHTML = "<b></b><small></small>";
    el.querySelector("b").textContent = levelInfo.name;
    el.querySelector("small").textContent = levelInfo.available ? levelInfo.age : "준비 중";
    if (!levelInfo.available) {
      el.title = levelInfo.name + " 단계는 준비 중이에요";
      el.setAttribute("aria-disabled", "true");
    } else {
      el.setAttribute("aria-pressed", String(levelInfo.code === state.level));
    }
    container.appendChild(el);
    return el;
  }

  function renderLevels() {
    const band = $("stageBand");
    const row = $("builderLevels");
    band.replaceChildren();
    row.replaceChildren();
    GEN.LEVELS.forEach((info) => {
      // 띠에서 고르면 아래 "학습지 만들기"로 스크롤해 그 단계를 선택해 준다 —
      // 띠는 커리큘럼 안내이자 곧바로 쓰는 입구이기도 하다.
      const bandEl = stageBadge(info, band);
      if (info.available) {
        bandEl.addEventListener("click", () => {
          setLevel(info.code);
          renderAll();
          $("builder").scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      const rowEl = stageBadge(info, row);
      if (info.available) {
        rowEl.addEventListener("click", () => { setLevel(info.code); renderAll(); });
      }
    });
    const note = $("levelNote");
    note.textContent = state.levelNote;
    note.hidden = !state.levelNote;
    note.classList.toggle("is-warn", Boolean(state.levelNote));
  }

  function renderIntensity() {
    const row = $("intensityRow");
    row.replaceChildren();
    GEN.INTENSITY_MARKS.forEach((mark, index) => {
      const value = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "intensity-btn" + (value === state.intensity ? " is-active" : "");
      button.dataset.intensity = String(value);
      button.textContent = mark;
      button.setAttribute("aria-label", "강도 " + value);
      button.setAttribute("aria-pressed", String(value === state.intensity));
      button.addEventListener("click", () => {
        state.intensity = value;
        renderAll();
      });
      row.appendChild(button);
    });
  }

  function renderTypes() {
    const grid = $("typeGrid");
    grid.replaceChildren();
    GEN.TYPES.forEach((type) => {
      const ok = supportsLevel(type.code);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "type-card" +
        (ok ? "" : " is-unavailable") +
        (ok && state.types.indexOf(type.code) !== -1 ? " is-active" : "");
      card.dataset.type = type.code;
      card.disabled = !ok;
      card.innerHTML = '<span class="type-code"></span><span class="type-label"></span><span class="type-levels"></span>';
      card.querySelector(".type-code").textContent = type.code;
      card.querySelector(".type-label").textContent = type.label;
      card.querySelector(".type-levels").textContent = type.levels.map(levelName).join(" · ");
      if (!ok) card.title = "이 단계에서는 제공되지 않아요";
      card.addEventListener("click", () => {
        const at = state.types.indexOf(type.code);
        // 유형을 0개로 만드는 해제는 무시한다 — 빈 학습지는 만들 수 없다.
        if (at === -1) state.types.push(type.code);
        else if (state.types.length > 1) state.types.splice(at, 1);
        renderAll();
      });
      grid.appendChild(card);
    });
  }

  function renderCounts() {
    const row = $("countRow");
    row.replaceChildren();
    COUNTS.forEach((count) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "count-btn" + (count === state.count ? " is-active" : "");
      button.dataset.count = String(count);
      button.textContent = count + "문항";
      button.setAttribute("aria-pressed", String(count === state.count));
      button.addEventListener("click", () => {
        state.count = count;
        renderAll();
      });
      row.appendChild(button);
    });
  }

  // 만들기 버튼은 진짜 링크다 — 눌러서 가는 주소가 곧 이 화면의 선택이므로
  // 마우스 오른쪽 클릭으로 복사하거나 즐겨찾기에 넣어도 그대로 재현된다.
  function buildUrl() {
    const params = new URLSearchParams();
    params.set("level", state.level);
    params.set("intensity", String(state.intensity));
    params.set("types", state.types.join("."));
    params.set("count", String(state.count));
    // types의 구분점(.)까지 인코딩되면 링크가 읽기 어려워지므로 되돌린다.
    // 물음표 뒤 경로가 아닌 값에서 '.'은 인코딩할 필요가 없는 문자다.
    return WORKSHEET_URL + "?" + params.toString().replace(/%2E/gi, ".");
  }

  function renderSummary() {
    const link = $("buildBtn");
    link.href = buildUrl();
    const labels = state.types.map(typeLabel);
    const shown = labels.length <= 3 ? labels.join(" · ") : labels.slice(0, 3).join(" · ") + " 외 " + (labels.length - 3) + "가지";
    const head = document.createElement("b");
    head.textContent = levelName(state.level) + " " + GEN.intensityMark(state.intensity) + " · " + state.count + "문항";
    $("buildSummary").replaceChildren(head, document.createTextNode(" · " + shown));
  }

  function renderAll() {
    renderLevels();
    renderIntensity();
    renderTypes();
    renderCounts();
    renderSummary();
  }

  // ---------------------------------------------------------------------
  // 학습지 코드로 다시 열기
  // ---------------------------------------------------------------------
  function openCode() {
    const raw = $("codeInput").value.trim();
    const note = $("codeNote");
    const parsed = raw ? GEN.parseCode(raw) : null;
    if (!parsed) {
      note.textContent = "코드 형식이 올바르지 않아요. 인쇄물 머리말의 코드를 그대로 적어 주세요. (예: #GW-TC.VC-9xl42kf3a)";
      note.hidden = false;
      note.classList.add("is-warn");
      $("codeInput").focus();
      return;
    }
    note.hidden = true;
    // '#'은 URL에서 조각 구분자라 반드시 인코딩해서 넘긴다 — 그대로 두면
    // 학습지 쪽 ?code= 가 빈 값으로 도착한다.
    window.location.href = WORKSHEET_URL + "?code=" + encodeURIComponent(raw);
  }

  function init() {
    setLevel(state.level);
    renderAll();
    $("codeBtn").addEventListener("click", openCode);
    $("codeInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") openCode();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
