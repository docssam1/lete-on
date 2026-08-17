// GW app.js — UI 와이어링 + worksheet assembly for the printable 쌓기나무
// worksheet generator. All problem math lives in generators.js, all SVG
// markup lives in render.js; this file only reads controls, calls those two
// modules, and writes the resulting HTML into #sheetRoot.
(function () {
  "use strict";

  const GEN = window.GW_GEN;
  const REN = window.GW_RENDER;

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
    types: GEN.TYPES.filter((t) => t.defaultOn).map((t) => t.code),
    count: 9,
    studentName: "",
    includeAnswers: true,
    levelNote: "",
    worksheet: null,
    // Preview state is independent of the worksheet's own seed on purpose —
    // see renderPreview().
    previewType: null,
    previewSeed: freshSeed()
  };

  function supportsLevel(code) {
    return GEN.typeSupportsLevel(code, state.level);
  }

  // Drop any type the current 단계 does not offer; never end up with none.
  function pruneTypesForLevel() {
    const kept = state.types.filter(supportsLevel);
    if (kept.length) { state.types = kept; return; }
    const fallback = GEN.TYPES.filter((t) => t.defaultOn && supportsLevel(t.code)).map((t) => t.code);
    state.types = fallback.length ? fallback : GEN.typesForLevel(state.level).slice(0, 1);
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
    // Never allow zero types selected — fall back to the previous selection.
    state.types = picked.length ? picked : state.types;
    if (!picked.length) syncTypeCheckboxes();
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
    sel.innerHTML = GEN.LEVELS.map((l) => (
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

  function buildIntensityRow() {
    const row = document.getElementById("intensityRow");
    if (!row) return;
    row.innerHTML = GEN.INTENSITY_MARKS.map((mark, index) => (
      '<button type="button" class="intensity-btn" data-intensity="' + (index + 1) + '" ' +
      'aria-label="강도 ' + (index + 1) + '">' + mark + "</button>"
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
    document.getElementById("includeAnswers").checked = state.includeAnswers;
  }

  // ---------------------------------------------------------------------
  // Figure rendering per problem kind
  // ---------------------------------------------------------------------
  function figureBlock(caption, svg, sizeClass) {
    return '<div class="ws-figure' + (sizeClass ? " " + sizeClass : "") + '"><figcaption>' + escapeHtml(caption) + "</figcaption>" + svg + "</div>";
  }

  function renderFigures(p) {
    const f = p.figures;
    if (f.kind === "TC") {
      const numberSvg = REN.renderNumberGrid(f.numberGrid, f.width, f.depth);
      const head = '<div class="ws-fig-row">' + figureBlock("위에서 본 모양 (칸 안의 수는 쌓기나무의 개수)", numberSvg) + "</div>";
      // 강도 ●○○은 개수만 물으므로 그릴 칸을 내주지 않는다.
      if (!f.drawViews) return head;
      const emptyFront = REN.renderEmptyDottedGrid(f.height, f.width);
      const emptySide = REN.renderEmptyDottedGrid(f.height, f.depth);
      return head +
        '<div class="ws-fig-row">' + figureBlock("앞에서 본 모양", emptyFront) + figureBlock("오른쪽 옆에서 본 모양", emptySide) + "</div>";
    }
    if (f.kind === "views3") {
      // VC/VM only (see generators.js's genView3): after the three view
      // silhouettes, scaffold the textbook's written method with a second
      // row holding the empty 위에서 본 모양 solve table (see render.js's
      // renderSolveTable).
      const solveSvg = REN.renderSolveTable(f.footprint, f.width, f.depth);
      return (
        '<div class="ws-fig-row">' +
        figureBlock("위", REN.renderViewGrid(f.top)) +
        figureBlock("앞", REN.renderViewGrid(f.front)) +
        figureBlock("오른쪽 옆", REN.renderViewGrid(f.side)) +
        "</div>" +
        '<div class="ws-fig-row">' +
        figureBlock("위에서 본 모양에 수 쓰기 (아래·오른쪽 칸에는 앞·옆에서 본 가장 높은 층수를 쓰세요)", solveSvg) +
        "</div>"
      );
    }
    if (f.kind === "VP") {
      const hiddenRows = f.height;
      const hiddenCols = f.hiddenLabel === "앞" ? f.width : f.depth;
      const emptyGrid = REN.renderEmptyDottedGrid(hiddenRows, hiddenCols);
      return (
        figureBlock("위", REN.renderViewGrid(f.top)) +
        figureBlock(f.givenLabel, REN.renderViewGrid(f.given)) +
        figureBlock(f.hiddenLabel + " (그리기)", emptyGrid)
      );
    }
    if (f.kind === "iso") {
      const colorFn = f.paint ? () => "grey" : undefined;
      const caption = f.paint
        ? "쌓기나무 모양 (겉면을 색칠" + (f.includeBottom === false ? ", 바닥면 제외" : ", 밑면 포함") + ")"
        : "쌓기나무 모양";
      return figureBlock(caption, REN.renderIso(f.map, f.width, f.depth, { colorFn }), "ws-figure-lg");
    }
    if (f.kind === "iso-top") {
      // IN pyramid archetype: the textbook's bird's-eye diamond view.
      return figureBlock("쌓기나무 모양", REN.renderIsoTop(f.map, f.width, f.depth), "ws-figure-lg");
    }
    if (f.kind === "iso-walled") {
      // IH only: draws the two walls behind/beneath the cubes (see
      // render.js renderIsoWalled) so the picture matches "뒤와 왼쪽에 벽이
      // 있는" from the prompt.
      return figureBlock("쌓기나무 모양", REN.renderIsoWalled(f.map, f.width, f.depth), "ws-figure-lg");
    }
    if (f.kind === "iso-box") {
      // PN is a full cube; BW may be a full cube or a stepped structure.
      // Both show only the actual cubes without an enclosing wireframe.
      const full = f.paint || f.checker;
      const opts = { checker: f.checker, cornerWhite: f.cornerWhite, noBox: full };
      const caption = f.paint
        ? "쌓기나무 모양 (겉면을 색칠" + (f.includeBottom === false ? ", 바닥면 제외" : ", 밑면 포함") + ")"
        : full ? "쌓기나무 모양" : "쌓기나무 모양 (점선 = 상자 테두리)";
      return figureBlock(caption, REN.renderIsoBox(f.map, f.width, f.depth, f.boxH, opts), "ws-figure-lg");
    }
    if (f.kind === "iso-holes") {
      return figureBlock("구멍이 뚫린 상자 모양 (검은 칸 = 구멍)", REN.renderIsoHoles(f.width, f.depth, f.boxH, f.tunnels), "ws-figure-lg");
    }
    if (f.kind === "sequence") {
      const shapeHtml = f.shapes.map((s) => figureBlock(s.n + "번째", REN.renderIso(s.map, s.width, s.depth), "ws-figure-sm")).join("");
      return shapeHtml + '<div class="ws-seq-dots">…</div>';
    }
    return "";
  }

  function answerLine(inner) {
    return '<div class="ws-answer-line">' + inner + "</div>";
  }

  function answerBlank(p) {
    if (p.type === "VP") return ""; // the dotted grid above IS the answer area
    if (p.type === "TC") {
      // ②(그리기)는 위의 점선 모눈이 답란이고, ①·③만 숫자 답란이 필요하다.
      let line = "① ______ 개";
      if (p.answer.askHeight) line += "　③ ______ 층";
      return answerLine(line);
    }
    if (p.type === "IC") {
      if (!p.answer.askFloor) return answerLine("답: ______ 개");
      let line = "① ______ 개　② ______ 개";
      if (p.answer.askUpper) line += "　③ ______ 개";
      return answerLine(line);
    }
    if (p.type === "IH" || p.type === "IN") {
      // Subtraction-method scaffold (docs/03_COUNT_HIDDEN.md §3): the child
      // fills 전체/보이는/보이지 않는 — or writes per-column hidden counts
      // directly on the printed picture (method ①) and only uses the last
      // blank. Either textbook method lands in the same final blank.
      return answerLine("전체 ______ 개 − 보이는 ______ 개 = 보이지 않는 ______ 개");
    }
    if (p.type === "VC" && p.answer.askFloor) return answerLine("① ______ 개　② ______ 개");
    if (p.type === "VM") return answerLine("답: 최대 ______ 개, 최소 ______ 개");
    if (p.type === "PN") {
      return answerLine(p.answer.variant === "faces" ? "답: 색칠된 면은 모두 ______ 면" : "답: ______ 개");
    }
    if (p.type === "BW") return answerLine("답: 흰색 ______ 개, 검은색 ______ 개");
    if (p.type === "HL") {
      // 층별 모눈 가이드가 곧 풀이 영역이다 — 아이가 층마다 빠진 칸을 칠하고
      // 남은 칸을 세어 더한다. 빈 칸으로만 인쇄한다(정답지 쪽은 채워 나온다).
      return '<div class="ws-solve-area">' + REN.renderHoleLayers(p, { blank: true }) + "</div>" +
        answerLine("답: ______ 개");
    }
    if (p.type === "SQ" && p.answer.mode === "which") return answerLine("답: ______ 번째");
    return answerLine("답: ______ 개");
  }

  function renderCard(p, idx) {
    return (
      '<article class="ws-card" data-type="' + p.type + '">' +
      '<div class="ws-card-head"><span class="ws-num">' + (idx + 1) + "</span></div>" +
      '<p class="ws-prompt">' + escapeHtml(p.prompt) + "</p>" +
      (p.methodHint ? '<p class="ws-method">' + escapeHtml(p.methodHint) + "</p>" : "") +
      '<div class="ws-figures">' + renderFigures(p) + "</div>" +
      answerBlank(p) +
      "</article>"
    );
  }

  // Dedicated (non-string-parsed) formatter for the compact answer list —
  // keeps the answer sheet decoupled from the free-text answerText used on
  // the worksheet header / __WS export.
  function answerLineText(p) {
    const a = p.answer;
    switch (p.type) {
      case "TC": {
        let s = "① 총 " + a.total + "개";
        if (a.drawViews) s += "　② 그림 참고";
        if (a.askHeight) s += "　③ " + a.height + "층";
        return a.drawViews || a.askHeight ? s : "총 " + a.total + "개";
      }
      case "VC": return a.askFloor ? "① " + a.count + "개　② 1층 " + a.floor + "개" : a.count + "개";
      case "VM": return "최대 " + a.max + "개, 최소 " + a.min + "개";
      case "VP": return a.hiddenLabel + " 모양 (그림 참고)";
      case "IC": {
        if (!a.askFloor) return a.total + "개";
        let s = "① " + a.total + "개　② 1층 " + a.floor + "개";
        if (a.askUpper) s += "　③ 2층 이상 " + a.upper + "개";
        return s;
      }
      case "IH": return a.hidden + "개 (전체 " + a.total + "개 − 보이는 " + a.visible + "개)";
      case "IN": return a.hidden + "개 (전체 " + a.total + "개 − 보이는 " + a.visible + "개)";
      case "FB": return a.need + "개";
      case "CU": return a.need + "개";
      case "PN": {
        const bottom = a.includeBottom ? "밑면 포함" : "바닥면 제외";
        if (a.variant === "faces") return a.faces + "면 (" + bottom + ")";
        return a.count + "개 (" + a.askFaces + "면짜리, " + bottom + ", 전체 " + a.cubes + "개)";
      }
      case "BW": return "흰색 " + a.white + "개, 검은색 " + a.black + "개";
      case "HL": return a.remaining + "개 (전체 " + a.total + "개 − 빠진 " + a.removed + "개)";
      case "SQ":
        if (a.mode === "which") return a.n + "번째";
        if (a.mode === "increment") return a.delta + "개 (" + a.count + " → " + a.next + ")";
        return a.count + "개";
      default: return p.answerText;
    }
  }

  function renderAnswerItem(p, idx) {
    let thumbs = "";
    if (p.type === "TC") {
      thumbs = '<span class="ws-ans-thumbs">' +
        '<span class="ws-ans-thumb"><small>앞</small>' + REN.renderMiniFilled(p.answer.front) + "</span>" +
        '<span class="ws-ans-thumb"><small>옆</small>' + REN.renderMiniFilled(p.answer.side) + "</span></span>";
    } else if (p.type === "VP") {
      thumbs = '<span class="ws-ans-thumbs"><span class="ws-ans-thumb"><small>' + escapeHtml(p.answer.hiddenLabel) + "</small>" + REN.renderMiniFilled(p.answer.hidden) + "</span></span>";
    } else if (p.type === "VC") {
      const solveSvg = REN.renderSolveTable(p.figures.footprint, p.figures.width, p.figures.depth, {
        numbers: p.answer.numbers, colMax: p.answer.colMax, rowMax: p.answer.rowMax
      });
      thumbs = '<span class="ws-ans-thumbs"><span class="ws-ans-thumb"><small>풀이</small>' + solveSvg + "</span></span>";
    } else if (p.type === "VM") {
      const solveSvg = REN.renderSolveTable(p.figures.footprint, p.figures.width, p.figures.depth, {
        numbers: p.answer.numbers, colMax: p.answer.colMax, rowMax: p.answer.rowMax
      });
      thumbs = '<span class="ws-ans-thumbs"><span class="ws-ans-thumb"><small>최대</small>' + solveSvg + "</span></span>";
    } else if (p.type === "HL") {
      // 층별 모눈 가이드를 그대로 정답지에 싣는다 — 답만 있는 것보다 "층마다
      // 세어 더한다"는 방법이 보이는 편이 채점·설명에 쓸모가 있다.
      thumbs = '<span class="ws-ans-solve">' + REN.renderHoleLayers(p) + "</span>";
    } else if (p.type === "SQ") {
      const totals = (p.answer.stageTotals || []).map((v, i) => (i + 1) + "번째 " + v + "개").join(", ");
      thumbs = totals ? '<span class="ws-ans-note">' + escapeHtml(totals) + "</span>" : "";
    }
    // HL의 층별 가이드는 3단 정답 목록 한 칸에 가로로 다 들어가지 않으므로
    // 그 항목만 단을 가로질러 전체 폭을 쓴다 (CSS: column-span: all).
    const wide = p.type === "HL" ? " ws-answer-item-wide" : "";
    return '<li class="ws-answer-item' + wide + '"><b>' + (idx + 1) + ".</b> " + escapeHtml(answerLineText(p)) + thumbs + "</li>";
  }

  // ---------------------------------------------------------------------
  // Full page assembly
  // ---------------------------------------------------------------------
  function buildSheetHtml(ws) {
    const nameLine = state.studentName ? escapeHtml(state.studentName) : "";
    const cards = ws.problems.map((p, i) => renderCard(p, i)).join("");
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
      const items = ws.problems.map((p, i) => renderAnswerItem(p, i)).join("");
      answerPage =
        '<section class="ws-page ws-answer-page" id="answerPage">' +
        '<h2 class="ws-answer-title">정답 <span class="ws-head-meta">' +
        '<span class="ws-level-badge">' + escapeHtml(ws.badge) + "</span>" +
        '<span class="ws-code">' + escapeHtml(ws.code) + "</span></span></h2>" +
        '<ol class="ws-answer-list">' + items + "</ol>" +
        "</section>";
    }
    return worksheetPage + answerPage;
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
    body.innerHTML =
      '<div class="ws-page ws-preview-page">' + renderCard(problem, 0) + "</div>" +
      (showAnswer
        ? '<div class="ws-preview-answer"><b>정답</b> <ol class="ws-answer-list ws-preview-answer-list">' +
          renderAnswerItem(problem, 0) + "</ol></div>"
        : "");
    window.__WSPREVIEW = { type: state.previewType, seed: state.previewSeed, problem };
  }

  function regenerate() {
    state.worksheet = GEN.generateWorksheet({
      types: state.types,
      level: state.level,
      intensity: state.intensity,
      count: state.count,
      seed: state.seed
    });
    document.getElementById("sheetRoot").innerHTML = buildSheetHtml(state.worksheet);
    document.getElementById("codeInput").value = state.worksheet.code;
    renderPreview();
    // Verification hook for the self-test (and for anyone auditing the page
    // in a live browser): the exact same shape of {code, seed, problems}
    // generators.js produced.
    window.__WS = { code: state.worksheet.code, seed: state.worksheet.seed, problems: state.worksheet.problems };
  }

  function rerenderOnly() {
    // Name / answer-toggle changes don't need a new worksheet, just a repaint.
    if (!state.worksheet) return regenerate();
    document.getElementById("sheetRoot").innerHTML = buildSheetHtml(state.worksheet);
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
    document.getElementById("studentName").addEventListener("input", (e) => {
      state.studentName = e.target.value;
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
      state.types = parsed.types;
      state.intensity = parsed.intensity;
      applyLevel(parsed.level, "");
      // 코드에 적힌 유형 중 그 단계가 지원하는 것만 남는다 (applyLevel이
      // 이미 걸러 주지만, 코드에서 온 목록을 먼저 넣어야 순서가 유지된다).
      const kept = parsed.types.filter(supportsLevel);
      if (kept.length) state.types = kept;
      buildTypeCheckboxes();
      state.count = parsed.count;
      state.seed = parsed.seed;
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
