// GW app.js — UI wiring + worksheet assembly for the printable 쌓기나무
// worksheet generator. All problem math lives in generators.js, all SVG
// markup lives in render.js, every problem-card markup lives in card.js;
// this file only reads controls, calls those modules, and writes the
// resulting HTML into #sheetRoot.
(function () {
  "use strict";

  const GEN = window.GW_GEN;
  const CARD = window.GW_CARD;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Picking the very first seed for a brand-new sheet is not "generator"
  // logic (it happens once, outside any GW_GEN.make call), so using the
  // clock here does not violate the "generators use only rng" rule — every
  // problem drawn afterwards still comes from the seeded rng alone.
  function freshSeed() {
    const t = Date.now() % 2147483647;
    const j = Math.floor((typeof performance !== "undefined" ? performance.now() : 0) * 1000) % 97;
    return (t + j) >>> 0 || 1;
  }

  // 나이로 고르기 — 학년/나이 하나하나가 단계 하나를 가리킨다. 아직 학습지가
  // 없는 단계(킨더·키즈·2과정 이상)도 그대로 두고, 고르면 가장 가까운 제공
  // 단계로 옮기면서 왜 옮겼는지 안내한다.
  const AGE_OPTIONS = [
    { key: "age5", label: "5-6세", level: "L0" },
    { key: "age6", label: "6-7세", level: "L1" },
    { key: "e1", label: "초1", level: "L2" },
    { key: "e2", label: "초2", level: "L2" },
    { key: "e3", label: "초3", level: "L3" },
    { key: "e4", label: "초4", level: "L4" },
    { key: "e5", label: "초5", level: "L5" },
    { key: "m1", label: "중1 이상", level: "L6" }
  ];

  const state = {
    seed: freshSeed(),
    level: GEN.DEFAULT_LEVEL,
    intensity: GEN.DEFAULT_INTENSITY,
    types: [],
    count: 9,
    // 문제 배열: "" 골고루 섞기 · "type" 유형별 · "diff" 난이도별.
    arrange: GEN.ARRANGE_MIX,
    studentName: "",
    includeCover: false,
    includeAnswers: true,
    levelNote: "",
    worksheet: null,
    // 인쇄에서 뺀 문제의 원래 자리 번호(0-based). 화면 세션 한정 — 학습지를
    // 다시 만드는 모든 경로에서 비운다 (isOmitted 위의 설명 참고).
    omitted: [],
    // Preview state is independent of the worksheet's own seed on purpose —
    // see renderPreview().
    previewType: null,
    previewSeed: freshSeed()
  };

  function supportsLevel(code) {
    return GEN.typeSupportsLevel(code, state.level);
  }

  // Drop any type the current 단계 does not offer. If none remain, keep empty.
  function pruneTypesForLevel() {
    state.types = state.types.filter(supportsLevel);
  }

  // ---------------------------------------------------------------------
  // Control panel scaffolding (type chips are built from GEN.TYPES so the UI
  // and the generator dispatch table can never drift apart).
  // ---------------------------------------------------------------------
  const UNSUPPORTED_TITLE = "이 단계에서는 제공되지 않아요";

  function buildTypeCheckboxes() {
    const grid = document.getElementById("typeGrid");
    grid.innerHTML = GEN.TYPES.map((t) => {
      const ok = supportsLevel(t.code);
      return '<label class="type-chip' + (ok ? "" : " is-unavailable") + '"' +
        (ok ? "" : ' title="' + UNSUPPORTED_TITLE + '"') + '>' +
        '<input type="checkbox" value="' + t.code + '"' +
        (ok && state.types.indexOf(t.code) !== -1 ? " checked" : "") +
        (ok ? "" : " disabled") + "/> " + escapeHtml(t.label) + "</label>";
    }).join("");
    grid.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", onTypesChanged);
    });
  }

  function onTypesChanged(event) {
    const grid = document.getElementById("typeGrid");
    const picked = Array.from(grid.querySelectorAll('input[type="checkbox"]:checked')).map((cb) => cb.value);
    state.types = picked;
    if (event && event.target.checked) {
      state.previewType = event.target.value;
      state.previewSeed = freshSeed();
    }
    regenerate();
  }

  function syncTypeCheckboxes() {
    document.querySelectorAll('#typeGrid input[type="checkbox"]').forEach((cb) => {
      cb.checked = state.types.indexOf(cb.value) !== -1;
    });
  }

  function buildLevelSelect() {
    const sel = document.getElementById("levelSelect");
    if (!sel) return;
    // "전체"는 커리큘럼 단계가 아니라 그 아홉 단계를 섞으라는 지시라 목록
    // 맨 앞에 별도 옵션으로 붙인다 (GEN.LEVELS 안에는 넣지 않는다 — 이유는
    // generators.js의 ALL_LEVEL 주석 참고).
    sel.innerHTML = '<option value="' + GEN.ALL_LEVEL + '">전체 (단계 혼합)</option>' + GEN.LEVELS.map((l) => (
      '<option value="' + l.code + '"' + (l.available ? "" : " disabled") + '>' +
      escapeHtml(l.name + " · " + l.age + (l.available ? "" : " (준비 중)")) + "</option>"
    )).join("");
  }

  function buildAgeSelect() {
    const sel = document.getElementById("ageSelect");
    if (!sel) return;
    sel.innerHTML = '<option value="">나이·학년으로 고르기</option>' + AGE_OPTIONS.map((a) => (
      '<option value="' + a.key + '">' + escapeHtml(a.label) + "</option>"
    )).join("");
  }

  // 버튼 표기는 "하/중/상"이 주고 점(●○○ 등)은 보조 — 화면에 보이는 이름만
  // 바뀐다, 내부 강도(intensity) 값 1/2/3과 코드 형식은 그대로다.
  function buildIntensityRow() {
    const row = document.getElementById("intensityRow");
    if (!row) return;
    row.innerHTML = GEN.INTENSITY_WORDS.map((word, index) => (
      '<button type="button" class="intensity-btn" data-intensity="' + (index + 1) + '" ' +
      'aria-label="난이도 ' + escapeHtml(word) + '">' + escapeHtml(word) +
      ' <span class="intensity-mark">' + GEN.INTENSITY_MARKS[index] + "</span></button>"
    )).join("");
    row.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        state.intensity = parseInt(b.dataset.intensity, 10);
        syncControlsFromState();
        regenerate();
      });
    });
  }

  // Move to `level`, snapping to the nearest available 단계 when the chosen
  // one is still 준비 중, and record why so the panel can say so.
  function applyLevel(level, sourceLabel) {
    const wanted = GEN.normalizeLevel(level);
    const info = GEN.levelInfo(wanted);
    if (info && info.available) {
      state.level = wanted;
      state.levelNote = "";
    } else {
      state.level = GEN.nearestAvailableLevel(wanted);
      const target = GEN.levelInfo(state.level);
      state.levelNote = (sourceLabel ? sourceLabel + " 단계(" + (info ? info.name : wanted) + ")는" : "이 단계는") +
        " 아직 학습지를 준비 중이라 가장 가까운 " + (target ? target.name + " · " + target.age : state.level) +
        " 단계로 맞췄어요.";
    }
    pruneTypesForLevel();
    buildTypeCheckboxes();
  }

  function syncControlsFromState() {
    syncTypeCheckboxes();
    const levelSel = document.getElementById("levelSelect");
    if (levelSel) levelSel.value = state.level;
    document.querySelectorAll("#intensityRow .intensity-btn").forEach((b) => {
      b.classList.toggle("active", parseInt(b.dataset.intensity, 10) === state.intensity);
    });
    const note = document.getElementById("levelNote");
    if (note) {
      note.textContent = state.levelNote;
      note.hidden = !state.levelNote;
    }
    document.getElementById("countSelect").value = String(state.count);
    const arrangeSel = document.getElementById("arrangeSelect");
    if (arrangeSel) arrangeSel.value = state.arrange;
    syncArrangeState();
    const cover = document.getElementById("includeCover");
    if (cover) cover.checked = state.includeCover;
    document.getElementById("includeAnswers").checked = state.includeAnswers;
  }

  // 난이도별 묶기는 한 장 안에서 강도를 하 → 중 → 상으로 올리는 모드라, 화면의
  // 난이도 버튼이 가리킬 값이 없다. 줄을 감추지 않고 흐리게만 두어, 모드를
  // 되돌리면 고르던 난이도가 그대로 남아 있음을 보여 준다.
  function syncArrangeState() {
    const diff = state.arrange === GEN.ARRANGE_DIFF;
    const row = document.getElementById("intensityRow");
    if (row) {
      row.classList.toggle("is-muted", diff);
      row.querySelectorAll(".intensity-btn").forEach((b) => { b.disabled = diff; });
    }
  }

  // ---------------------------------------------------------------------
  // Setup entry points — a pasted 학습지 코드 and a ?query deep link from the
  // 지오메트리 랩 landing page both arrive as the same {types, level,
  // intensity, count, seed} shape, so they share one applier. Keeping it in
  // one place matters because the ORDER is load-bearing: the requested type
  // list has to be written first, then applyLevel() prunes it against the
  // 단계, and only the survivors (in the requested order) are kept.
  // ---------------------------------------------------------------------
  function applySetup(setup) {
    const wanted = (setup.types || []).slice();
    const hasTypes = Object.prototype.hasOwnProperty.call(setup, "types") && setup.types !== null;
    if (hasTypes) state.types = wanted;
    if (setup.intensity) state.intensity = GEN.normalizeIntensity(setup.intensity);
    if (setup.level) applyLevel(setup.level, "");
    if (hasTypes) {
      const kept = wanted.filter(supportsLevel);
      state.types = kept;
      buildTypeCheckboxes();
    }
    if (setup.count) state.count = setup.count;
    if (setup.arrange !== undefined && setup.arrange !== null) state.arrange = GEN.normalizeArrange(setup.arrange);
    if (setup.seed) state.seed = setup.seed;
  }

  // ---------------------------------------------------------------------
  // Deep links (?level=&intensity=&types=&count= or ?code=)
  //
  // WHY: the 지오메트리 랩 landing page lets a teacher pick 단계·강도·유형·문항
  // 수 there and then hands the choice over in the URL, so the resulting setup
  // is bookmarkable and shareable instead of living in this tab's memory.
  // Every value is validated against generators.js's own tables — a bad or
  // half-typed link must silently fall back to the defaults and still open a
  // usable worksheet, never an error.
  // ---------------------------------------------------------------------
  function paramLevel(value) {
    const v = String(value == null ? "" : value).trim();
    // "ALL" (전체, 단계 혼합) or "L0".."L8" / "0".."8"; anything else is
    // ignored so a typo cannot be silently rounded into a valid-looking 단계.
    if (/^all$/i.test(v)) return GEN.ALL_LEVEL;
    if (!/^L?[0-8]$/i.test(v)) return null;
    return GEN.normalizeLevel(v);
  }

  function paramIntensity(value) {
    return /^[123]$/.test(String(value == null ? "" : value).trim()) ? parseInt(value, 10) : null;
  }

  function paramTypes(value) {
    if (!value) return null;
    const seen = {};
    const list = String(value).toUpperCase().split(/[.,+\s]+/).map(GEN.canonicalType).filter((c) => {
      if (!GEN.typeInfo(c) || seen[c]) return false;
      seen[c] = true;
      return true;
    });
    return list.length ? list : null;
  }

  function paramCount(value) {
    // Accept only the counts the 문항 수 select actually offers — a count the
    // select cannot show would leave the control blank and out of sync with
    // the printed sheet.
    const n = parseInt(value, 10);
    if (!n) return null;
    const sel = document.getElementById("countSelect");
    const allowed = sel ? Array.prototype.map.call(sel.options, (o) => parseInt(o.value, 10)) : [];
    return allowed.indexOf(n) === -1 ? null : n;
  }

  // ?arrange=type|diff (또는 코드와 같은 t|d). 알 수 없는 값은 기본(섞기).
  function paramArrange(value) {
    if (value === null || value === undefined || value === "") return null;
    const mode = GEN.normalizeArrange(value);
    return mode === GEN.ARRANGE_MIX ? null : mode;
  }

  function readCodeParam(params) {
    let text = params.get("code") || "";
    // "?code=#GW-..." — an unescaped '#' terminates the query string, so the
    // browser files the rest of it under location.hash. Stitch it back on so
    // the human-friendly form of the link works as typed.
    if (/^#GW-/i.test(window.location.hash)) text += window.location.hash;
    return text.trim();
  }

  function applyUrlParams() {
    let params;
    try { params = new URLSearchParams(window.location.search); } catch (error) { return; }

    const codeText = readCodeParam(params);
    if (codeText) {
      const parsed = GEN.parseCode(codeText);
      // A code carries every setting including the seed, so it wins outright:
      // mixing it with loose params could reproduce a DIFFERENT worksheet than
      // the code names, which defeats the point of codes.
      if (parsed) { applySetup(parsed); return; }
    }

    const setup = {
      level: paramLevel(params.get("level")),
      intensity: paramIntensity(params.get("intensity")),
      types: paramTypes(params.get("types")),
      count: paramCount(params.get("count")),
      arrange: paramArrange(params.get("arrange"))
    };
    if (setup.level || setup.intensity || setup.types || setup.count || setup.arrange) applySetup(setup);
  }

  // ---------------------------------------------------------------------
  // Figure rendering per problem kind
  // ---------------------------------------------------------------------
  // 문제 카드 · 정답 항목 마크업은 card.js(GW_CARD)가 원본이다 — 지오메트리
  // 랩의 미리보기가 같은 함수를 불러 쓰므로, 여기서 한 벌 더 만들면 두 화면이
  // 서서히 갈라진다.
  const renderCard = CARD.renderCard;
  const renderAnswerItem = CARD.renderAnswerItem;

  // ---------------------------------------------------------------------
  // Full page assembly
  // ---------------------------------------------------------------------
  // 표지 제목은 "무엇을 연습하는 책인지"를 한 줄로 말해야 하므로 선택한 유형을
  // 이어 붙인다. 유형을 많이 고르면 제목이 표지를 넘치므로 셋까지만 적고 나머지
  // 는 개수로 줄인다.
  function coverTypeSummary(ws) {
    const labels = ws.types.map((code) => {
      const info = GEN.typeInfo(code);
      return info ? info.label : code;
    });
    if (!labels.length) return "쌓기나무 종합";
    if (labels.length <= 3) return labels.join(" · ");
    return labels.slice(0, 3).join(" · ") + " 외 " + (labels.length - 3) + "가지";
  }

  // 표지 테마별 캐릭터 — world-map/assets/geometry-characters.png 한 장을
  // 3x3으로 자른 스프라이트의 칸 이름이다(칸 좌표는 styles.css의 .gw-char-*).
  // 영역마다 다른 캐릭터가 서 있어야, 여러 권을 뽑아 쌓아 두었을 때 표지만
  // 보고 무슨 책인지 집어낼 수 있다.
  //
  // 혼합만 다섯을 세우는 이유: 혼합은 "여러 영역을 한 권에"라는 뜻이라
  // 캐릭터 줄 자체가 그 사실을 말해 준다.
  const COVER_CHARS = {
    stack: ["gw-char-cubie", "gw-char-box"],
    view: ["gw-char-protractor", "gw-char-sphere"],
    paint: ["gw-char-pyramid", "gw-char-cone"],
    rule: ["gw-char-prism", "gw-char-compass"],
    mix: ["gw-char-cubie", "gw-char-sphere", "gw-char-pyramid", "gw-char-protractor", "gw-char-compass"]
  };

  const COVER_THEME_NAMES = {
    stack: "쌓기나무",
    view: "관찰",
    paint: "색칠·무늬",
    rule: "규칙",
    mix: "종합"
  };

  function coverCharsHtml(theme) {
    const list = COVER_CHARS[theme] || COVER_CHARS.mix;
    return '<div class="ws-cover-chars" aria-hidden="true">' +
      list.map((cls) => '<i class="gw-char ' + cls + '"></i>').join("") +
      "</div>";
  }

  // A4 cover page, laid out like the cube-town 연습책 표지 (브랜드 / 제목 /
  // 구분선 / 이름·시작한 날·나의 단계 / DOCSSAM'S MATH LAB) but drawn in the
  // 지오메트리 랩 tone — white paper and no storybook texture, because this
  // book is a problem bank, not a game.
  //
  // 포인트 색과 캐릭터는 고른 유형의 영역(theme)이 정한다. 색은 머리말·구분선·
  // 문항 수에만 쓰는 포인트라서, 흑백 프린터로 뽑아도 표지의 짜임과 캐릭터는
  // 그대로 남는다.
  function buildCoverHtml(ws) {
    const nameLine = state.studentName ? escapeHtml(state.studentName) : "";
    const theme = GEN.themeForTypes(ws.types);
    return (
      '<section class="ws-page ws-cover" id="coverPage" data-theme="' + theme + '">' +
      '<div class="ws-cover-brand"><span>GFIELD</span><strong>GEOMETRY LAB</strong></div>' +
      '<div class="ws-cover-copy">' +
      '<p class="ws-cover-kicker">지오메트리 랩 학습지 · ' + escapeHtml(COVER_THEME_NAMES[theme] || "종합") + "</p>" +
      '<h1 class="ws-cover-title">' + escapeHtml(coverTypeSummary(ws)) + "</h1>" +
      '<div class="ws-cover-rule"></div>' +
      '<p class="ws-cover-sub">한 장씩 풀고 날짜를 적어 두면<br />어떤 유형이 아직 어려운지 한눈에 보여요.</p>' +
      "</div>" +
      coverCharsHtml(theme) +
      '<div class="ws-cover-meta">' +
      "<div><span>이름</span><i>" + nameLine + "</i></div>" +
      "<div><span>시작한 날</span><i></i></div>" +
      '<div><span>나의 단계</span><strong class="ws-level-badge">' + escapeHtml(ws.badge) + "</strong></div>" +
      "</div>" +
      // 표지의 문항 수는 실제로 인쇄될 개수 — 두 문제를 뺐는데 표지만 원래
      // 개수를 말하면, 표지를 믿고 채점표를 만든 사람이 두 칸을 헛 그린다.
      '<div class="ws-cover-footer"><span>DOCSSAM\'S MATH LAB</span>' +
      '<b>' + (ws.problems.length - state.omitted.length) + " QUESTIONS</b></div>" +
      '<div class="ws-cover-code">' + escapeHtml(ws.code) + "</div>" +
      "</section>"
    );
  }

  // ---------------------------------------------------------------------
  // 문제 빼기 — 만들어 놓고 보니 한두 문제가 마음에 들지 않을 때, 학습지 전체를
  // 다시 뽑지 않고 그 문제만 인쇄에서 빼는 화면 기능.
  //
  // WHY 코드에 담지 않는가: 학습지 코드는 "같은 코드 = 같은 학습지"라는 약속
  // 하나로 서 있다. 뺀 문제까지 코드에 실으면 같은 문제 묶음을 가리키는 코드가
  // 여러 벌 생기고, 코드를 받아 적은 사람은 자기 코드가 원본인지 누가 솎아낸
  // 판본인지 알 수 없다. 그래서 빼기는 이 탭이 살아 있는 동안만 유지되고,
  // 새로 만들기·단계 변경 등 학습지를 다시 만드는 모든 길에서 초기화된다.
  // ---------------------------------------------------------------------
  function isOmitted(index) {
    return state.omitted.indexOf(index) !== -1;
  }

  function keptProblems(ws) {
    return ws.problems
      .map((p, index) => ({ p, index }))
      .filter((entry) => !isOmitted(entry.index));
  }

  // 소제목 줄 — 배열 모드에서 group.key가 바뀌는 자리에만 찍는다. 한 묶음의
  // 문제를 전부 빼면 소제목만 남아 아래가 빈 채로 인쇄되므로, 남은 문제가
  // 하나도 없는 묶음의 소제목은 아예 그리지 않는다.
  function liveGroupKeys(ws) {
    const keys = {};
    ws.problems.forEach((p, index) => {
      if (p.group && !isOmitted(index)) keys[p.group.key] = true;
    });
    return keys;
  }

  function groupHeadHtml(p, previousKey, live) {
    if (!p.group || p.group.key === previousKey || !live[p.group.key]) return "";
    return '<h3 class="ws-group" data-group="' + escapeHtml(p.group.key) + '">' +
      escapeHtml(p.group.label) + "</h3>";
  }

  function buildSheetHtml(ws) {
    const nameLine = state.studentName ? escapeHtml(state.studentName) : "";
    const mixed = ws.level === GEN.ALL_LEVEL;
    // 번호는 "빼지 않은 문제" 기준으로 1부터 다시 매긴다 — 뺀 카드는 화면에만
    // 흐리게 남고 번호 대신 —를 달아, 빠진 자리 때문에 번호가 건너뛰지 않는다.
    let printedNo = 0;
    let previousKey = null;
    const live = liveGroupKeys(ws);
    const cards = ws.problems.length
      ? ws.problems.map((p, i) => {
        const omitted = isOmitted(i);
        if (!omitted) printedNo += 1;
        const head = groupHeadHtml(p, previousKey, live);
        previousKey = p.group && live[p.group.key] ? p.group.key : previousKey;
        return head + renderCard(p, i, mixed, {
          numberLabel: omitted ? "—" : String(printedNo),
          omit: { index: i, checked: omitted }
        });
      }).join("")
      : ws.types.length
        ? ""
        : '<p class="ws-preview-empty">유형을 하나 이상 선택해 주세요.</p>';
    const worksheetPage =
      '<section class="ws-page" id="worksheetPage">' +
      '<header class="ws-head"><div class="ws-head-top">' +
      '<div class="ws-brand">GFIELD <b>쌓기나무 학습지</b></div>' +
      '<div class="ws-head-meta">' +
      '<span class="ws-level-badge">' + escapeHtml(ws.badge) + "</span>" +
      '<span class="ws-code">' + escapeHtml(ws.code) + "</span>" +
      "</div>" +
      "</div>" +
      '<div class="ws-student-line">' +
      "<span>이름<i>" + nameLine + "</i></span>" +
      "<span>날짜<i></i></span>" +
      "<span>점수<i></i></span>" +
      "</div></header>" +
      cards +
      "</section>";

    let answerPage = "";
    if (state.includeAnswers) {
      // 뺀 문제는 정답지에서도 사라지고, 남은 정답은 학습지와 같은 번호를 쓴다.
      let answerKey = null;
      const answerLive = live;
      const items = keptProblems(ws).map((entry, order) => {
        const head = entry.p.group && answerLive[entry.p.group.key] && entry.p.group.key !== answerKey
          ? '<li class="ws-answer-group">' + escapeHtml(entry.p.group.label) + "</li>"
          : "";
        if (entry.p.group) answerKey = entry.p.group.key;
        return head + renderAnswerItem(entry.p, order, mixed, { numberLabel: String(order + 1) });
      }).join("");
      answerPage =
        '<section class="ws-page ws-answer-page" id="answerPage">' +
        '<h2 class="ws-answer-title">정답 <span class="ws-head-meta">' +
        '<span class="ws-level-badge">' + escapeHtml(ws.badge) + "</span>" +
        '<span class="ws-code">' + escapeHtml(ws.code) + "</span></span></h2>" +
        '<ol class="ws-answer-list">' + items + "</ol>" +
        "</section>";
    }
    return (state.includeCover ? buildCoverHtml(ws) : "") + worksheetPage + answerPage;
  }

  // ---------------------------------------------------------------------
  // Type preview — one sample problem of one type, at the current 단계·강도.
  // It deliberately uses its OWN seed (previewSeed), so rerolling the sample
  // never disturbs the worksheet below it, and changing the worksheet never
  // reshuffles the sample the teacher is studying.
  // ---------------------------------------------------------------------
  function previewTypeList() {
    const selected = GEN.TYPES.filter((t) => state.types.indexOf(t.code) !== -1 && supportsLevel(t.code));
    return selected.sort((a, b) => {
      if (a.code === state.previewType) return -1;
      if (b.code === state.previewType) return 1;
      return state.types.indexOf(a.code) - state.types.indexOf(b.code);
    });
  }

  function ensurePreviewType() {
    const list = previewTypeList();
    if (!list.length) { state.previewType = null; return; }
    if (!state.previewType || !list.some((t) => t.code === state.previewType)) {
      state.previewType = list[0].code;
    }
  }

  function renderPreview() {
    ensurePreviewType();
    const tabs = document.getElementById("previewTabs");
    const body = document.getElementById("previewBody");
    if (!tabs || !body) return;
    const list = previewTypeList();
    tabs.innerHTML = list.map((t) => (
      '<button type="button" class="ws-preview-chip' + (t.code === state.previewType ? " active" : "") +
      '" data-type="' + t.code + '">' + escapeHtml(t.label) + "</button>"
    )).join("");
    tabs.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        state.previewType = b.dataset.type;
        state.previewSeed = freshSeed();
        renderPreview();
      });
    });

    if (!state.previewType) {
      body.innerHTML = '<p class="ws-preview-empty">유형을 하나 이상 선택하세요.</p>';
      return;
    }
    // Same rng recipe as generateWorksheet so a preview problem is a genuine
    // sample of what the sheet produces, not a differently-distributed one.
    const rng = GEN.createRng("GWP:" + state.previewSeed + ":" + state.level + ":" + state.intensity + ":" + state.previewType);
    let problem = null;
    try {
      problem = GEN.make(state.previewType, rng, state.level, state.intensity);
    } catch (error) {
      body.innerHTML = '<p class="ws-preview-empty">이 유형은 지금 단계에서 만들 수 없습니다.</p>';
      return;
    }
    const answer = document.getElementById("previewShowAnswer");
    const showAnswer = !answer || answer.checked;
    const mixed = state.level === GEN.ALL_LEVEL;
    body.innerHTML =
      '<div class="ws-page ws-preview-page">' + renderCard(problem, 0, mixed) + "</div>" +
      (showAnswer
        ? '<div class="ws-preview-answer"><b>정답</b> <ol class="ws-answer-list ws-preview-answer-list">' +
          renderAnswerItem(problem, 0, mixed) + "</ol></div>"
        : "");
    window.__WSPREVIEW = { type: state.previewType, seed: state.previewSeed, problem };
  }

  function regenerate() {
    // 새 문제 묶음이 나오면 예전 자리 번호로 저장해 둔 빼기는 뜻을 잃는다.
    state.omitted = [];
    if (!state.types.length) {
      state.worksheet = {
        code: "",
        seed: state.seed,
        level: state.level,
        intensity: state.intensity,
        arrange: state.arrange,
        badge: GEN.arrangeBadge(state.level, state.intensity, state.arrange),
        types: [],
        count: state.count,
        problems: []
      };
      document.getElementById("printBtn").disabled = true;
      document.getElementById("codeInput").value = "";
      paintSheet();
      renderPreview();
      return;
    }
    document.getElementById("printBtn").disabled = false;
    state.worksheet = GEN.generateWorksheet({
      types: state.types,
      level: state.level,
      intensity: state.intensity,
      count: state.count,
      arrange: state.arrange,
      seed: state.seed
    });
    document.getElementById("codeInput").value = state.worksheet.code;
    paintSheet();
    renderPreview();
  }

  function rerenderOnly() {
    // Name / answer-toggle changes don't need a new worksheet, just a repaint.
    if (!state.worksheet) return regenerate();
    paintSheet();
  }

  // 시트를 다시 그리고 빼기 체크박스를 붙인다. innerHTML로 통째로 갈아 끼우므로
  // 이벤트는 매번 새로 매단다 (카드가 최대 50장이라 위임보다 단순한 쪽을 택함).
  function paintSheet() {
    const root = document.getElementById("sheetRoot");
    root.innerHTML = buildSheetHtml(state.worksheet);
    root.querySelectorAll(".ws-omit-box").forEach((box) => {
      box.addEventListener("change", () => {
        const index = parseInt(box.dataset.omit, 10);
        const at = state.omitted.indexOf(index);
        if (box.checked && at === -1) state.omitted.push(index);
        else if (!box.checked && at !== -1) state.omitted.splice(at, 1);
        paintSheet();
      });
    });
    const reset = document.getElementById("resetOmitBtn");
    if (reset) reset.hidden = !state.omitted.length;
    // Verification hook for the self-test (and for anyone auditing the page
    // in a live browser): the exact same shape of {code, seed, problems}
    // generators.js produced, plus what this screen is actually printing.
    const ws = state.worksheet;
    window.__WS = {
      code: ws.code,
      seed: ws.seed,
      arrange: ws.arrange,
      problems: ws.problems,
      omitted: state.omitted.slice().sort((a, b) => a - b),
      printedCount: ws.problems.length - state.omitted.length
    };
  }

  // ---------------------------------------------------------------------
  // Event wiring
  // ---------------------------------------------------------------------
  function wireEvents() {
    document.getElementById("levelSelect").addEventListener("change", (e) => {
      applyLevel(e.target.value, "");
      const ageSel = document.getElementById("ageSelect");
      if (ageSel) ageSel.value = "";
      syncControlsFromState();
      regenerate();
    });
    document.getElementById("ageSelect").addEventListener("change", (e) => {
      const picked = AGE_OPTIONS.filter((a) => a.key === e.target.value)[0];
      if (!picked) return;
      applyLevel(picked.level, picked.label);
      syncControlsFromState();
      regenerate();
    });
    document.getElementById("countSelect").addEventListener("change", (e) => {
      state.count = parseInt(e.target.value, 10);
      regenerate();
    });
    const arrangeSel = document.getElementById("arrangeSelect");
    if (arrangeSel) arrangeSel.addEventListener("change", (e) => {
      state.arrange = GEN.normalizeArrange(e.target.value);
      syncArrangeState();
      regenerate();
    });
    const resetOmit = document.getElementById("resetOmitBtn");
    if (resetOmit) resetOmit.addEventListener("click", () => {
      state.omitted = [];
      paintSheet();
    });
    document.getElementById("studentName").addEventListener("input", (e) => {
      state.studentName = e.target.value;
      rerenderOnly();
    });
    const coverToggle = document.getElementById("includeCover");
    if (coverToggle) coverToggle.addEventListener("change", (e) => {
      state.includeCover = e.target.checked;
      rerenderOnly();
    });
    document.getElementById("includeAnswers").addEventListener("change", (e) => {
      state.includeAnswers = e.target.checked;
      rerenderOnly();
    });
    document.getElementById("newSeedBtn").addEventListener("click", () => {
      state.seed = freshSeed();
      regenerate();
    });
    document.getElementById("printBtn").addEventListener("click", () => {
      window.print();
    });
    document.getElementById("previewRerollBtn").addEventListener("click", () => {
      state.previewSeed = freshSeed();
      renderPreview();
    });
    document.getElementById("previewShowAnswer").addEventListener("change", renderPreview);
    document.getElementById("loadCodeBtn").addEventListener("click", () => {
      const parsed = GEN.parseCode(document.getElementById("codeInput").value);
      if (!parsed) {
        window.alert("코드 형식이 올바르지 않습니다. 예) #GW-TC.VC.IC-9x1a2b3c");
        return;
      }
      // 코드에 적힌 유형 중 그 단계가 지원하는 것만 남는다 — applySetup이
      // 그 순서까지 지켜 준다.
      applySetup(parsed);
      syncControlsFromState();
      regenerate();
    });
  }

  function init() {
    buildLevelSelect();
    buildAgeSelect();
    buildIntensityRow();
    applyLevel(state.level, "");
    buildTypeCheckboxes();
    // AFTER the defaults are in place: a deep link only overrides what it
    // actually names, so the untouched controls keep their normal defaults.
    applyUrlParams();
    syncControlsFromState();
    wireEvents();
    regenerate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
