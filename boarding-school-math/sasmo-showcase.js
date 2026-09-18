(function (root, factory) {
  "use strict";
  const bank = typeof module === "object" && module.exports
    ? require("./competition/grade6-competition-type-bank.js")
    : root.GFIELDGrade6CompetitionTypeBank;
  const api = factory(bank);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDSASMOShowcase = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (bank) {
  "use strict";

  const SAMPLE_IDS = Object.freeze([
    "sasmo-g6-pattern-01",
    "sasmo-g6-logic-01",
    "sasmo-g6-cube-01"
  ]);

  const AXIS_COPY = Object.freeze({
    "patterns-algebra": { title: "수 규칙", short: "규칙", accent: "#16734b" },
    "combinatorics-logic": { title: "논리·조건", short: "논리", accent: "#7359c8" },
    "geometry-spatial": { title: "공간 감각", short: "공간", accent: "#d77d11" }
  });

  const COACH_COPY = Object.freeze({
    "sasmo-g6-pattern-01": {
      hint: "이웃한 두 수 사이의 변화를 차례로 비교하고, 두 단계가 반복되는지 확인해 보세요.",
      misconception: "한 가지 연산만 계속 반복된다고 가정하면 중간 항과 맞지 않을 수 있습니다."
    },
    "sasmo-g6-logic-01": {
      hint: "각 조건을 ‘누가 누구보다 앞인가’ 관계로 바꾸고, 모든 관계의 시작점에 있는 사람을 찾으세요.",
      misconception: "조건 하나만 보고 판단하지 말고 세 관계를 모두 동시에 만족하는지 확인하세요."
    },
    "sasmo-g6-cube-01": {
      hint: "정확히 두 면이 칠해진 조각은 큰 정육면체의 모서리에 있지만 꼭짓점에는 없습니다.",
      misconception: "꼭짓점의 작은 정육면체는 세 면이 칠해지므로 두 면짜리 개수에 넣지 않습니다."
    }
  });

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>\"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character];
    });
  }

  function items() {
    if (!bank || !Array.isArray(bank.items)) return [];
    return SAMPLE_IDS.map(function (id) {
      return bank.items.find(function (item) { return item.id === id; });
    }).filter(Boolean);
  }

  function applyOperation(value, operation) {
    if (!Array.isArray(operation) || operation.length !== 2) throw new Error("INVALID_SHOWCASE_OPERATION");
    if (operation[0] === "multiply") return value * Number(operation[1]);
    if (operation[0] === "subtract") return value - Number(operation[1]);
    if (operation[0] === "add") return value + Number(operation[1]);
    if (operation[0] === "divide") return value / Number(operation[1]);
    throw new Error("UNSUPPORTED_SHOWCASE_OPERATION");
  }

  function patternTerms(model) {
    const values = [Number(model.start)];
    (model.operations || []).forEach(function (operation) {
      values.push(applyOperation(values[values.length - 1], operation));
    });
    return values;
  }

  function logicRanks(model) {
    const ranks = Object.fromEntries(model.nodes.map(function (node) { return [node, 0]; }));
    for (let pass = 0; pass < model.nodes.length; pass += 1) {
      model.before.forEach(function (edge) {
        ranks[edge[1]] = Math.max(ranks[edge[1]], ranks[edge[0]] + 1);
      });
    }
    return ranks;
  }

  function validate() {
    const errors = [];
    const selected = items();
    if (selected.length !== SAMPLE_IDS.length) errors.push("SHOWCASE_ITEM_MISSING");
    if (new Set(selected.map(function (item) { return item.axis; })).size !== 3) errors.push("SHOWCASE_AXIS_DUPLICATE");
    selected.forEach(function (item) {
      try {
        bank.validateItem(item);
      } catch (error) {
        errors.push("SHOWCASE_ITEM_INVALID:" + item.id);
      }
      if (!bank.answerId(item)) errors.push("SHOWCASE_ANSWER_MISSING:" + item.id);
      if (item.id === "sasmo-g6-cube-01" && (!item.visual || item.visual.kind !== "painted-cube")) errors.push("SHOWCASE_CUBE_VISUAL_MISSING");
    });
    const pattern = selected.find(function (item) { return item.id === "sasmo-g6-pattern-01"; });
    if (pattern && patternTerms(pattern.model).join(",") !== "2,6,5,15,14,42,41") errors.push("SHOWCASE_PATTERN_MODEL_DRIFT");
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
  }

  function renderPattern(item) {
    const terms = patternTerms(item.model).slice(0, -1);
    return '<div class="showcase-sequence" role="img" aria-label="2, 6, 5, 15, 14, 42 다음 수를 찾는 수열">'
      + terms.map(function (term, index) {
        return '<span><b>' + esc(term) + '</b>' + (index < terms.length - 1 ? '<i aria-hidden="true">→</i>' : "") + '</span>';
      }).join("")
      + '<span class="is-question"><b>?</b></span></div>';
  }

  function renderLogic(item) {
    const labels = { Hana: "하나", Min: "민", Jun: "준", Yuri: "유리" };
    const ranks = logicRanks(item.model);
    const maxRank = Math.max.apply(null, Object.values(ranks));
    const groups = {};
    item.model.nodes.forEach(function (node) { (groups[ranks[node]] || (groups[ranks[node]] = [])).push(node); });
    const positions = {};
    Object.keys(groups).forEach(function (rankKey) {
      const rank = Number(rankKey);
      const group = groups[rank];
      group.forEach(function (node, index) {
        positions[node] = {
          x: 62 + (maxRank ? rank * (396 / maxRank) : 0),
          y: group.length === 1 ? 104 : 64 + index * 80
        };
      });
    });
    const edges = item.model.before.map(function (edge) {
      const from = positions[edge[0]];
      const to = positions[edge[1]];
      return '<path d="M ' + (from.x + 32) + ' ' + from.y + ' L ' + (to.x - 36) + ' ' + to.y + '" marker-end="url(#showcase-arrow)" />';
    }).join("");
    const nodes = item.model.nodes.map(function (node) {
      const point = positions[node];
      return '<g transform="translate(' + point.x + ' ' + point.y + ')"><circle r="30"/><text text-anchor="middle" dy="5">' + esc(labels[node] || node) + '</text></g>';
    }).join("");
    return '<svg class="showcase-logic-map" viewBox="0 0 520 208" role="img" aria-label="달리기 순서 조건을 화살표로 나타낸 관계 그림"><defs><marker id="showcase-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>' + edges + nodes + '<text class="showcase-logic-caption" x="260" y="194" text-anchor="middle">화살표 방향: 앞선 사람 → 뒤의 사람</text></svg>';
  }

  function renderVisual(item) {
    if (item.id === "sasmo-g6-pattern-01") return renderPattern(item);
    if (item.id === "sasmo-g6-logic-01") return renderLogic(item);
    return bank.renderVisual(item, "ko");
  }

  function createRuntime() {
    const selected = items();
    const state = { index: 0, firstAttempts: new Map(), latestAnswers: new Map(), solved: new Set() };
    const rootNode = document.getElementById("mini-experience");
    const tabsNode = document.getElementById("showcase-tabs");
    const slotNode = document.getElementById("showcase-question-slot");
    const insightNode = document.getElementById("showcase-insight");
    const progressNode = document.getElementById("showcase-progress-label");

    function currentItem() { return selected[state.index]; }
    function axis(item) { return AXIS_COPY[item.axis] || { title: item.axis, short: item.axis, accent: "#2456c4" }; }

    function renderHero() {
      const target = document.getElementById("hero-demo-visual");
      const cube = selected.find(function (item) { return item.id === "sasmo-g6-cube-01"; });
      if (target && cube) target.innerHTML = bank.renderVisual(cube, "ko");
      const workbookTarget = document.getElementById("workbook-demo-visual");
      const workbookItem = bank.items.find(function (item) { return item.id === "sasmo-g6-cube-01"; });
      if (workbookTarget && workbookItem) workbookTarget.innerHTML = bank.renderVisual(workbookItem, "ko");
    }

    function renderTabs() {
      tabsNode.replaceChildren();
      selected.forEach(function (item, index) {
        const button = document.createElement("button");
        const info = axis(item);
        button.type = "button";
        button.className = "showcase-tab";
        button.dataset.showcaseIndex = String(index);
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(index === state.index));
        button.setAttribute("aria-controls", "showcase-question-slot");
        button.tabIndex = index === state.index ? 0 : -1;
        button.innerHTML = '<span>0' + (index + 1) + '</span><strong>' + esc(info.short) + '</strong><i aria-hidden="true">' + (state.firstAttempts.has(item.id) ? "✓" : "") + '</i>';
        tabsNode.append(button);
      });
    }

    function renderQuestion() {
      const item = currentItem();
      const info = axis(item);
      const lastAnswer = state.latestAnswers.get(item.id);
      const solved = state.solved.has(item.id);
      const card = document.createElement("article");
      card.className = "showcase-question problem-card" + (solved ? " solved" : "");
      card.id = "showcase-question";
      card.dataset.itemId = item.id;
      card.dataset.coachGroup = item.axis;
      card.dataset.coachHint = COACH_COPY[item.id].hint;
      card.dataset.coachMisconception = COACH_COPY[item.id].misconception;
      card.style.setProperty("--showcase-accent", info.accent);
      card.innerHTML = '<header class="showcase-question-head"><div><span>CHALLENGE 0' + (state.index + 1) + '</span><b>' + esc(info.title) + '</b></div><small>GFIELD 검수 유형</small></header>'
        + '<h3>' + esc(bank.text(item.typeTitle, "ko")) + '</h3>'
        + '<p class="problem-prompt">' + esc(bank.text(item.prompt, "ko")) + '</p>'
        + '<div class="showcase-question-visual">' + renderVisual(item) + '</div>'
        + '<div class="showcase-choices" role="group" aria-label="답 선택"></div>'
        + '<p class="feedback' + (lastAnswer ? (lastAnswer.correct ? " correct" : " wrong") : "") + '" aria-live="polite">'
        + (lastAnswer ? (lastAnswer.correct ? "정확합니다. 이 응답을 학습 근거로 확인했습니다." : "아직 아닙니다. 정답은 표시하지 않으니 조건을 다시 확인해 보세요.") : "답을 고르면 첫 응답을 바꾸지 않고 미니 진단 근거로 남깁니다.")
        + '</p>'
        + '<div class="showcase-question-actions"><button type="button" class="showcase-next" id="showcase-next"' + (state.firstAttempts.has(item.id) ? "" : " disabled") + '>' + (state.index === selected.length - 1 ? "결과 보기" : "다음 문제") + ' <span aria-hidden="true">→</span></button></div>';

      const choices = card.querySelector(".showcase-choices");
      item.choices.forEach(function (choice) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "showcase-choice";
        button.dataset.demoAnswer = choice.id;
        button.setAttribute("aria-pressed", String(Boolean(lastAnswer && lastAnswer.answerId === choice.id)));
        if (lastAnswer && lastAnswer.answerId === choice.id) button.classList.add(lastAnswer.correct ? "is-correct" : "is-wrong");
        if (solved) button.disabled = true;
        button.innerHTML = '<span>' + esc(choice.id) + '</span><b>' + esc(bank.text(choice.label, "ko")) + '</b>';
        choices.append(button);
      });
      slotNode.replaceChildren(card);
    }

    function summary() {
      const attempts = selected.filter(function (item) { return state.firstAttempts.has(item.id); }).map(function (item) {
        const attempt = state.firstAttempts.get(item.id);
        return { item: item, correct: attempt.correct };
      });
      const strengths = attempts.filter(function (entry) { return entry.correct; });
      const priorities = attempts.filter(function (entry) { return !entry.correct; });
      return {
        attempted: attempts.length,
        strength: strengths.length ? axis(strengths[0].item).title : "아직 관찰 중",
        priority: priorities.length ? axis(priorities[0].item).title : (attempts.length === selected.length ? "전체 유형에서 전이 확인" : "아직 관찰 중")
      };
    }

    function renderInsight() {
      const result = summary();
      const complete = result.attempted === selected.length;
      const rows = selected.map(function (item) {
        const attempt = state.firstAttempts.get(item.id);
        const info = axis(item);
        const status = !attempt ? "대기" : attempt.correct ? "강점 신호" : "보완 신호";
        return '<li class="' + (!attempt ? "is-pending" : attempt.correct ? "is-strength" : "is-priority") + '"><div><span>' + esc(info.title) + '</span><b>' + status + '</b></div><i><span></span></i><small>' + (!attempt ? "근거 없음" : "첫 응답 1문항") + '</small></li>';
      }).join("");
      insightNode.innerHTML = '<div class="showcase-insight-head"><p class="micro-label">LIVE LEARNING SIGNAL</p><span>' + result.attempted + ' / ' + selected.length + '</span></div>'
        + '<h3>' + (complete ? "미니 진단이 완성됐습니다." : result.attempted ? "첫 응답 근거가 쌓이고 있습니다." : "첫 응답을 기다립니다.") + '</h3>'
        + '<p>' + (complete ? "점수 한 줄 대신 어떤 사고에서 안정적이었고 어디를 먼저 보완할지 보여 줍니다." : "문제를 풀 때마다 해당 영역의 첫 응답을 보존해 강점과 보완 후보를 구분합니다.") + '</p>'
        + '<ul class="showcase-signal-list">' + rows + '</ul>'
        + '<div class="showcase-prescription"><span>관찰된 강점</span><strong>' + esc(result.strength) + '</strong><span>먼저 보완</span><strong>' + esc(result.priority) + '</strong></div>'
        + (complete
          ? '<div class="showcase-result-actions"><a class="showcase-primary" href="./competition-practice.html?program=sasmo&audience=student&locale=ko">전체 10유형 진단 계속하기 <span aria-hidden="true">→</span></a><a class="showcase-workbook-link" href="#workbook-preview">처방 워크북 보기 <span aria-hidden="true">↓</span></a><button type="button" class="showcase-reset" id="showcase-reset">다시 체험</button></div>'
          : '<p class="showcase-insight-note">정답을 바로 공개하지 않습니다. 문제 안의 질문 도우미에서 한 단계 힌트를 받을 수 있습니다.</p>');
      progressNode.textContent = result.attempted + " / " + selected.length + " 응답";
      rootNode.dataset.showcaseComplete = String(complete);
    }

    function render() {
      renderTabs();
      renderQuestion();
      renderInsight();
    }

    function moveTo(index, focus) {
      if (!Number.isInteger(index) || index < 0 || index >= selected.length) return;
      state.index = index;
      render();
      if (focus) {
        const tab = tabsNode.querySelector('[data-showcase-index="' + index + '"]');
        if (tab) tab.focus();
      }
    }

    function answer(answerId) {
      const item = currentItem();
      const correct = bank.answerId(item) === answerId;
      const attempt = Object.freeze({ answerId: answerId, correct: correct });
      if (!state.firstAttempts.has(item.id)) state.firstAttempts.set(item.id, attempt);
      state.latestAnswers.set(item.id, attempt);
      if (correct) state.solved.add(item.id);
      render();
      const chosen = slotNode.querySelector('[data-demo-answer="' + answerId + '"]');
      if (chosen && !chosen.disabled) chosen.focus();
    }

    function reset() {
      state.index = 0;
      state.firstAttempts.clear();
      state.latestAnswers.clear();
      state.solved.clear();
      render();
      rootNode.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    rootNode.addEventListener("click", function (event) {
      const tab = event.target.closest("[data-showcase-index]");
      const choice = event.target.closest("[data-demo-answer]");
      const next = event.target.closest("#showcase-next");
      const resetButton = event.target.closest("#showcase-reset");
      if (tab) moveTo(Number(tab.dataset.showcaseIndex), false);
      if (choice) answer(choice.dataset.demoAnswer);
      if (next && !next.disabled) {
        const unanswered = selected.findIndex(function (item) { return !state.firstAttempts.has(item.id); });
        if (unanswered >= 0) moveTo(unanswered, true);
        else renderInsight();
      }
      if (resetButton) reset();
    });

    tabsNode.addEventListener("keydown", function (event) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = state.index;
      if (event.key === "Home") next = 0;
      else if (event.key === "End") next = selected.length - 1;
      else if (event.key === "ArrowLeft") next = (state.index - 1 + selected.length) % selected.length;
      else next = (state.index + 1) % selected.length;
      moveTo(next, true);
    });

    renderHero();
    render();
    return Object.freeze({
      getState: function () { return { index: state.index, attempted: state.firstAttempts.size, solved: state.solved.size }; },
      reset: reset
    });
  }

  function initialize() {
    const target = document.getElementById("mini-experience");
    if (!target) return null;
    const validation = validate();
    if (!validation.valid) {
      target.dataset.showcaseState = "locked";
      const slot = document.getElementById("showcase-question-slot");
      if (slot) slot.innerHTML = '<p class="showcase-error">체험 문항을 검수하는 중입니다. 전체 유형 화면에서 다시 확인해 주세요.</p>';
      return null;
    }
    return createRuntime();
  }

  const api = Object.freeze({
    sampleIds: SAMPLE_IDS,
    items: items,
    patternTerms: patternTerms,
    logicRanks: logicRanks,
    validate: validate,
    initialize: initialize
  });

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
    else initialize();
  }

  return api;
});
