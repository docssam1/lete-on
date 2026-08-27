// GW card.js — 문제 한 장의 화면·인쇄 마크업. 학습지 생성기(worksheet)와
// 지오메트리 랩의 미리보기가 같은 함수를 쓴다.
//
// WHY 별도 파일: 랩의 미리보기는 "학습지에 실제로 실릴 문제 그대로"를 보여
// 주어야 뜻이 있다. 랩 쪽에 카드 마크업을 한 벌 더 두면 두 화면이 서서히
// 갈라지고, 어느 쪽이 진짜 인쇄물인지 알 수 없게 된다. 그래서 generators.js
// (문제 수학) · render.js (그림 SVG) 와 나란히, 카드 마크업도 원본을 하나만
// 둔다. DOM에 손대지 않고 문자열만 돌려주므로 어느 페이지에서든 안전하다.
(function (global) {
  "use strict";

  const REN = global.GW_RENDER;
  const GEN = global.GW_GEN;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function figureBlock(caption, svg, sizeClass) {
    return '<div class="ws-figure' + (sizeClass ? " " + sizeClass : "") + '"><figcaption>' + escapeHtml(caption) + "</figcaption>" + svg + "</div>";
  }

  function renderFigures(p) {
    const f = p.figures;
    if (f.kind === "TC") {
      const numberSvg = REN.renderNumberGrid(f.numberGrid, f.width, f.depth, undefined, { dottedEmpty: f.dottedEmpty });
      const head = '<div class="ws-fig-row">' + figureBlock("위에서 본 모양 (칸 안의 수는 쌓기나무의 개수)", numberSvg) + "</div>";
      // 강도 ●○○은 개수만 물으므로 그릴 칸을 내주지 않는다.
      if (!f.drawViews) return head;
      const emptyFront = REN.renderEmptyDottedGrid(f.height, f.width);
      const emptySide = REN.renderEmptyDottedGrid(f.height, f.depth);
      return head +
        '<div class="ws-fig-row">' + figureBlock("앞에서 본 모양", emptyFront) + figureBlock("오른쪽 옆에서 본 모양", emptySide) + "</div>";
    }
    if (f.kind === "views3") {
      const views = (
        '<div class="ws-fig-row">' +
        figureBlock("위", REN.renderViewGrid(f.top)) +
        figureBlock("앞", REN.renderViewGrid(f.front)) +
        figureBlock("오른쪽 옆", REN.renderViewGrid(f.side)) +
        "</div>"
      );
      if (f.showSolveTable === false) return views;
      const solveSvg = REN.renderSolveTable(f.footprint, f.width, f.depth);
      return views +
        '<div class="ws-fig-row">' +
        figureBlock("위에서 본 모양에 수 쓰기 (아래·오른쪽 칸에는 앞·옆에서 본 가장 높은 층수를 쓰세요)", solveSvg) +
        "</div>";
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
      const current = figureBlock(caption, REN.renderIsoBox(f.map, f.width, f.depth, f.boxH, opts), "ws-figure-lg");
      if (p.type !== "FB") return current;
      const fullMap = Array.from({ length: f.depth }, () => Array(f.width).fill(f.boxH));
      const target = figureBlock("완전히 채운 상자", REN.renderIsoBox(fullMap, f.width, f.depth, f.boxH, { noBox: true }), "ws-figure-lg");
      return '<div class="ws-fig-row ws-fill-box-row">' + current + '<span class="ws-figure-arrow" aria-hidden="true">→</span>' + target + "</div>";
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
      if (p.answer.askTotal === false) return "";
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

  // "전체(단계 혼합)"로 만들 때만 문제마다 실제로 뽑힌 단계 이름을 작은
  // 배지로 보여 준다 — 단일 단계로 만들면 머리말 배지 하나로 충분하니
  // 문제마다 반복해서 보여 줄 필요가 없다.
  function problemLevelBadgeHtml(p) {
    const info = GEN.levelInfo(p.level);
    const name = info ? info.name : p.level;
    return '<span class="ws-prob-level">' + escapeHtml(name) + "</span>";
  }

  // opts (모두 선택):
  //   numberLabel — 카드에 찍을 번호 글자. 문제 빼기로 번호를 다시 매길 때
  //                 화면 순서(idx)와 인쇄 번호가 달라지므로 밖에서 정한다.
  //   omit        — {index, checked} 가 오면 우상단에 "빼기" 체크박스를 단다.
  //                 화면 세션 한정 기능이라 인쇄·정답지에서만 결과가 보인다.
  function renderCard(p, idx, mixed, opts) {
    const o = opts || {};
    const numberLabel = o.numberLabel === undefined || o.numberLabel === null ? String(idx + 1) : String(o.numberLabel);
    const omit = o.omit
      ? '<label class="ws-omit"><input type="checkbox" class="ws-omit-box" data-omit="' + o.omit.index + '"' +
        (o.omit.checked ? " checked" : "") + " /> 빼기</label>"
      : "";
    return (
      '<article class="ws-card' + (o.omit && o.omit.checked ? " is-omitted" : "") + '" data-type="' + p.type + '">' +
      omit +
      '<div class="ws-card-head"><span class="ws-num">' + escapeHtml(numberLabel) + "</span>" +
      (mixed && p.level ? problemLevelBadgeHtml(p) : "") + "</div>" +
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
        if (a.askTotal === false) return "앞·오른쪽 옆 모양 (그림 참고)";
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

  // opts.numberLabel — 정답 번호. 학습지에서 문제를 빼면 남은 문제가 1부터
  // 다시 번호를 받으므로 정답지도 같은 번호를 써야 채점이 맞는다.
  function renderAnswerItem(p, idx, mixed, opts) {
    const numberLabel = opts && opts.numberLabel !== undefined && opts.numberLabel !== null
      ? String(opts.numberLabel)
      : String(idx + 1);
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
    const levelTag = mixed && p.level ? problemLevelBadgeHtml(p) + " " : "";
    return '<li class="ws-answer-item' + wide + '"><b>' + escapeHtml(numberLabel) + ".</b> " + levelTag + escapeHtml(answerLineText(p)) + thumbs + "</li>";
  }

  global.GW_CARD = {
    escapeHtml,
    figureBlock,
    renderFigures,
    answerBlank,
    answerLineText,
    problemLevelBadgeHtml,
    renderCard,
    renderAnswerItem
  };
})(typeof window !== "undefined" ? window : globalThis);
