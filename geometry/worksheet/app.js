// GW app.js — UI wiring + worksheet assembly for the printable 쌓기나무
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

  const state = {
    seed: freshSeed(),
    difficulty: "mid",
    types: GEN.TYPES.filter((t) => t.defaultOn).map((t) => t.code),
    count: 9,
    studentName: "",
    includeAnswers: true,
    worksheet: null,
    // Preview state is independent of the worksheet's own seed on purpose —
    // see renderPreview().
    previewType: null,
    previewSeed: freshSeed()
  };

  // ---------------------------------------------------------------------
  // Control panel scaffolding (type checkboxes are built from GEN.TYPES so
  // the UI and the generator dispatch table can never drift apart).
  // ---------------------------------------------------------------------
  function buildTypeCheckboxes() {
    const grid = document.getElementById("typeGrid");
    grid.innerHTML = GEN.TYPES.map((t) => (
      '<label><input type="checkbox" value="' + t.code + '"' + (state.types.indexOf(t.code) !== -1 ? " checked" : "") + "/> " + escapeHtml(t.label) + "</label>"
    )).join("");
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

  function syncControlsFromState() {
    syncTypeCheckboxes();
    document.querySelectorAll('input[name="difficulty"]').forEach((r) => { r.checked = r.value === state.difficulty; });
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
      const emptyFront = REN.renderEmptyDottedGrid(f.height, f.width);
      const emptySide = REN.renderEmptyDottedGrid(f.height, f.depth);
      return (
        '<div class="ws-fig-row">' + figureBlock("위에서 본 모양 (칸 안의 수는 쌓기나무의 개수)", numberSvg) + "</div>" +
        '<div class="ws-fig-row">' + figureBlock("앞에서 본 모양", emptyFront) + figureBlock("오른쪽 옆에서 본 모양", emptySide) + "</div>"
      );
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
      return figureBlock("쌓기나무 모양", REN.renderIso(f.map, f.width, f.depth, { colorFn }), "ws-figure-lg");
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
      // PN (painted cube) and BW (checker cube) are FULL cubes: no wireframe,
      // and the "(점선 = 상자 테두리)" caption would be wrong there.
      const full = f.paint || f.checker;
      const opts = { checker: f.checker, cornerWhite: f.cornerWhite, noBox: full };
      const caption = full ? "쌓기나무 모양" : "쌓기나무 모양 (점선 = 상자 테두리)";
      return figureBlock(caption, REN.renderIsoBox(f.map, f.width, f.depth, f.boxH, opts), "ws-figure-lg");
    }
    if (f.kind === "iso-holes") {
      return figureBlock("구멍이 뚫린 상자 모양 (흰 칸 = 구멍)", REN.renderIsoHoles(f.width, f.depth, f.boxH, f.tunnels), "ws-figure-lg");
    }
    if (f.kind === "sequence") {
      const shapeHtml = f.shapes.map((s) => figureBlock(s.n + "번째", REN.renderIso(s.map, s.width, s.depth), "ws-figure-sm")).join("");
      return shapeHtml + '<div class="ws-seq-dots">…</div>';
    }
    return "";
  }

  function answerBlank(p) {
    if (p.type === "TC" || p.type === "VP") return ""; // the dotted grids above ARE the answer area
    if (p.type === "IH" || p.type === "IN") {
      // Subtraction-method scaffold (docs/03_COUNT_HIDDEN.md §3): the child
      // fills 전체/보이는/보이지 않는 — or writes per-column hidden counts
      // directly on the printed picture (method ①) and only uses the last
      // blank. Either textbook method lands in the same final blank.
      return '<div class="ws-answer-line">전체 ______ 개 − 보이는 ______ 개 = 보이지 않는 ______ 개</div>';
    }
    if (p.type === "VM") return '<div class="ws-answer-line">답: 최대 ______ 개, 최소 ______ 개</div>';
    if (p.type === "PN") return '<div class="ws-answer-line">답: 색칠된 면은 모두 ______ 면</div>';
    if (p.type === "SQ" && p.answer.mode === "which") return '<div class="ws-answer-line">답: ______ 번째</div>';
    return '<div class="ws-answer-line">답: ______ 개</div>';
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
    switch (p.type) {
      case "TC": return "총 " + p.answer.total + "개";
      case "VC": return p.answer.count + "개";
      case "VM": return "최대 " + p.answer.max + "개, 최소 " + p.answer.min + "개";
      case "VP": return p.answer.hiddenLabel + " 모양 (그림 참고)";
      case "IC": return p.answer.total + "개";
      case "IH": return p.answer.hidden + "개 (전체 " + p.answer.total + "개 − 보이는 " + p.answer.visible + "개)";
      case "IN": return p.answer.hidden + "개 (전체 " + p.answer.total + "개 − 보이는 " + p.answer.visible + "개)";
      case "FB": return p.answer.need + "개";
      case "CU": return p.answer.need + "개";
      case "PN": return p.answer.faces + "면";
      case "PF": return p.answer.faces + "개";
      case "BW": return p.answer.count + "개";
      case "HL": return p.answer.remaining + "개";
      case "SQ": return p.answer.mode === "which" ? p.answer.n + "번째" : p.answer.count + "개";
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
    }
    return '<li class="ws-answer-item"><b>' + (idx + 1) + ".</b> " + escapeHtml(answerLineText(p)) + thumbs + "</li>";
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
      '<div class="ws-code">' + escapeHtml(ws.code) + "</div>" +
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
        '<h2 class="ws-answer-title">정답 <span class="ws-code">' + escapeHtml(ws.code) + "</span></h2>" +
        '<ol class="ws-answer-list">' + items + "</ol>" +
        "</section>";
    }
    return worksheetPage + answerPage;
  }

  // ---------------------------------------------------------------------
  // Type preview — one sample problem of one type, at the current difficulty.
  // It deliberately uses its OWN seed (previewSeed), so rerolling the sample
  // never disturbs the worksheet below it, and changing the worksheet never
  // reshuffles the sample the teacher is studying.
  // ---------------------------------------------------------------------
  function previewTypeList() {
    const selected = GEN.TYPES.filter((t) => state.types.indexOf(t.code) !== -1);
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
    const rng = GEN.createRng("GWP:" + state.previewSeed + ":" + state.difficulty + ":" + state.previewType);
    let problem = null;
    try {
      problem = GEN.make(state.previewType, rng, state.difficulty);
    } catch (error) {
      body.innerHTML = '<p class="ws-preview-empty">이 유형은 지금 난이도에서 만들 수 없습니다.</p>';
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
      difficulty: state.difficulty,
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
    document.querySelectorAll('input[name="difficulty"]').forEach((r) => {
      r.addEventListener("change", () => {
        if (r.checked) { state.difficulty = r.value; regenerate(); }
      });
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
      state.difficulty = parsed.difficulty;
      state.count = parsed.count;
      state.seed = parsed.seed;
      syncControlsFromState();
      regenerate();
    });
  }

  function init() {
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
