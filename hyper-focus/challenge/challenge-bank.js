(function (global) {
  "use strict";

  const VERSION = "2026-09-08-revision-2";
  const LEARNER_STAGE = "6세 챌린지 시험 준비 아동";
  const DIFFICULTIES = ["easy", "same", "hard"];
  const DIFFICULTY_LABELS = { easy: "쉽게", same: "같게", hard: "어렵게" };

  function makeRng(seed) {
    let state = (Number(seed) >>> 0) || 1;
    return {
      next() {
        state += 0x6D2B79F5;
        let value = state;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
      },
      int(min, max) {
        return min + Math.floor(this.next() * (max - min + 1));
      }
    };
  }

  function shuffle(values, rng) {
    const out = values.slice();
    for (let index = out.length - 1; index > 0; index -= 1) {
      const picked = rng.int(0, index);
      [out[index], out[picked]] = [out[picked], out[index]];
    }
    return out;
  }

  function permutations(values) {
    const out = [];
    function visit(rest, row) {
      if (!rest.length) {
        out.push(row);
        return;
      }
      rest.forEach((value, index) => visit(
        rest.slice(0, index).concat(rest.slice(index + 1)),
        row.concat(value)
      ));
    }
    visit(values, []);
    return out;
  }

  function koreanTopic(word) {
    const text = String(word);
    const code = text.charCodeAt(text.length - 1);
    const hasFinal = code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 !== 0;
    return `${text}${hasFinal ? "은" : "는"}`;
  }

  function escapeText(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function numberNodes(kind, parts) {
    if (kind === "pair") {
      return { a: parts[0], b: parts[1], total: parts[0] + parts[1] };
    }
    if (kind === "split4") {
      return {
        a: parts[0], b: parts[1], c: parts[2], d: parts[3],
        left: parts[0] + parts[1], right: parts[2] + parts[3],
        total: parts.reduce((sum, value) => sum + value, 0)
      };
    }
    return {
      a: parts[0], b: parts[1], c: parts[2],
      p0: parts[0] + parts[1], p1: parts[1] + parts[2],
      total: parts[0] + parts[1] * 2 + parts[2]
    };
  }

  const NUMBER_TEMPLATES = {
    easy: [
      { kind: "pair", given: ["total", "a"] },
      { kind: "down3", given: ["total", "p0", "p1", "a", "b"] },
      { kind: "up3", given: ["a", "b", "c", "p0", "total"] }
    ],
    same: [
      { kind: "down3", given: ["total", "p0", "b"] },
      { kind: "down3", given: ["total", "p1", "a"] },
      { kind: "up3", given: ["a", "c", "p0", "total"] },
      { kind: "split4", given: ["a", "d", "left", "right"] }
    ],
    hard: [
      { kind: "down3", given: ["total", "p0", "c"] },
      { kind: "down3", given: ["total", "p1", "a"] },
      { kind: "up3", given: ["c", "p0", "total"] },
      { kind: "split4", given: ["a", "d", "left", "right"] }
    ]
  };

  const NUMBER_KEYS = {
    pair: ["total", "a", "b"],
    down3: ["total", "p0", "p1", "a", "b", "c"],
    up3: ["a", "b", "c", "p0", "p1", "total"],
    split4: ["a", "b", "c", "d", "left", "right", "total"]
  };

  function makeNumberPanel(template, rng, difficulty, index) {
    const spec = difficulty === "easy"
      ? { partMin: 1, partMax: 5, nodeMax: 10 }
      : difficulty === "hard"
        ? { partMin: 1, partMax: 8, nodeMax: 20 }
        : { partMin: 1, partMax: 7, nodeMax: 14 };
    const count = template.kind === "pair" ? 2 : template.kind === "split4" ? 4 : 3;
    for (let attempt = 0; attempt < 400; attempt += 1) {
      const parts = Array.from({ length: count }, () => rng.int(spec.partMin, spec.partMax));
      const nodes = numberNodes(template.kind, parts);
      if (Math.max(...Object.values(nodes)) > spec.nodeMax) continue;
      const blankKeys = NUMBER_KEYS[template.kind].filter((key) => !template.given.includes(key));
      const panel = {
        id: `panel-${index + 1}`,
        kind: template.kind,
        parts,
        nodes,
        givenKeys: template.given.slice(),
        blankKeys,
        difficulty
      };
      if (enumerateNumberPanelAnswers(panel).length === 1) return panel;
    }
    throw new Error(`가르기·모으기 ${difficulty} ${index + 1}번 패널 생성 실패`);
  }

  function candidateParts(kind, maxValue) {
    const count = kind === "pair" ? 2 : kind === "split4" ? 4 : 3;
    const out = [];
    function visit(parts) {
      if (parts.length === count) {
        out.push(parts);
        return;
      }
      for (let value = 0; value <= maxValue; value += 1) visit(parts.concat(value));
    }
    visit([]);
    return out;
  }

  function enumerateNumberPanelAnswers(panel) {
    if (!panel || !panel.nodes || !Array.isArray(panel.givenKeys)) return [];
    const maxGiven = Math.max(1, ...panel.givenKeys.map((key) => Number(panel.nodes[key]) || 0));
    const answers = new Map();
    candidateParts(panel.kind, maxGiven).forEach((parts) => {
      const nodes = numberNodes(panel.kind, parts);
      const matches = panel.givenKeys.every((key) => nodes[key] === panel.nodes[key]);
      if (!matches) return;
      const answer = panel.blankKeys.map((key) => nodes[key]);
      answers.set(JSON.stringify(answer), answer);
    });
    return [...answers.values()];
  }

  function enumerateNumberAnswers(payload) {
    if (!payload || !Array.isArray(payload.panels)) return [];
    const panelAnswers = payload.panels.map(enumerateNumberPanelAnswers);
    if (panelAnswers.some((answers) => answers.length !== 1)) return [];
    return [panelAnswers.map((answers) => answers[0])];
  }

  function generateNumberBonds(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const panels = shuffle(NUMBER_TEMPLATES[normalized],rng).slice(0,2).map((template, index) => makeNumberPanel(template, rng, normalized, index));
    const payload = {
      typeId: "split-merge-chain",
      difficulty: normalized,
      seed: Number(seed) || 1,
      panels,
      answer: panels.map((panel) => panel.blankKeys.map((key) => panel.nodes[key]))
    };
    if (!validateNumberBonds(payload)) throw new Error(`가르기·모으기 ${normalized} 단일정답 검증 실패`);
    return payload;
  }

  function validateNumberBonds(payload) {
    const candidates = enumerateNumberAnswers(payload);
    return Boolean(
      payload && DIFFICULTIES.includes(payload.difficulty) &&
      candidates.length === 1 &&
      JSON.stringify(candidates[0]) === JSON.stringify(payload.answer)
    );
  }

  function renderNode(panel, key, x, y) {
    const shown = panel.givenKeys.includes(key);
    const klass = shown ? "given" : "blank";
    const label = shown ? escapeText(panel.nodes[key]) : "";
    return `<rect class="bond-node ${klass}" x="${x - 19}" y="${y - 17}" width="38" height="34" rx="5"/>` +
      `<text class="bond-value" x="${x}" y="${y + 6}">${label}</text>`;
  }

  function renderNumberPanel(panel, label) {
    let lines = "";
    let nodes = "";
    if (panel.kind === "pair") {
      lines = '<path d="M150 48 L108 91 M150 48 L192 91"/>';
      nodes = renderNode(panel, "total", 150, 31) + renderNode(panel, "a", 108, 108) + renderNode(panel, "b", 192, 108);
    } else if (panel.kind === "down3") {
      lines = '<path d="M150 38 L108 68 M150 38 L192 68 M108 85 L70 116 M108 85 L150 116 M192 85 L150 116 M192 85 L230 116"/>';
      nodes = renderNode(panel, "total", 150, 25) + renderNode(panel, "p0", 108, 75) + renderNode(panel, "p1", 192, 75) +
        renderNode(panel, "a", 70, 126) + renderNode(panel, "b", 150, 126) + renderNode(panel, "c", 230, 126);
    } else if (panel.kind === "up3") {
      lines = '<path d="M70 42 L108 67 M150 42 L108 67 M150 42 L192 67 M230 42 L192 67 M108 92 L150 116 M192 92 L150 116"/>';
      nodes = renderNode(panel, "a", 70, 27) + renderNode(panel, "b", 150, 27) + renderNode(panel, "c", 230, 27) +
        renderNode(panel, "p0", 108, 78) + renderNode(panel, "p1", 192, 78) + renderNode(panel, "total", 150, 128);
    } else {
      lines = '<path d="M70 42 L105 70 M120 42 L105 70 M180 42 L215 70 M230 42 L215 70 M105 94 L160 119 M215 94 L160 119"/>';
      nodes = renderNode(panel, "a", 70, 27) + renderNode(panel, "b", 120, 27) + renderNode(panel, "c", 180, 27) + renderNode(panel, "d", 230, 27) +
        renderNode(panel, "left", 105, 79) + renderNode(panel, "right", 215, 79) + renderNode(panel, "total", 160, 130);
    }
    return `<g class="bond-panel"><text class="panel-label" x="8" y="20">(${label})</text>${lines}${nodes}</g>`;
  }

  function renderNumberProblem(payload) {
    const columns = 2;
    const panelWidth = 330;
    const panelHeight = 165;
    const rows = Math.ceil(payload.panels.length / columns);
    const panels = payload.panels.map((panel, index) => {
      const x = (index % columns) * panelWidth;
      const y = Math.floor(index / columns) * panelHeight;
      return `<g transform="translate(${x} ${y})">${renderNumberPanel(panel, index + 1)}</g>`;
    }).join("");
    return `<svg class="challenge-visual bond-visual" viewBox="0 0 ${panelWidth * columns} ${panelHeight * rows}" role="img" aria-label="가르기 모으기 빈칸 문제">${panels}</svg>`;
  }

  function renderNumberAnswer(payload) {
    return payload.answer.map((values, index) => `(${index + 1}) ${values.join(", ")}`).join(" · ");
  }

  const ANIMAL_POOLS = [
    ["사자", "양", "돼지", "여우", "토끼"],
    ["호랑이", "곰", "기린", "원숭이", "코끼리"],
    ["강아지", "고양이", "다람쥐", "병아리", "거북이"]
  ];

  function relationPass(order, relation) {
    const position = (name) => order.indexOf(name);
    if (relation.type === "rank") return position(relation.person) === relation.rank - 1;
    if (relation.type === "before") return position(relation.first) < position(relation.second);
    if (relation.type === "immediatelyBehind") return position(relation.behind) === position(relation.ahead) + 1;
    if (relation.type === "between") {
      return position(relation.first) < position(relation.middle) && position(relation.middle) < position(relation.last);
    }
    return false;
  }

  function enumerateRaceOrders(payload) {
    if (!payload || !Array.isArray(payload.participants) || !Array.isArray(payload.relations)) return [];
    return permutations(payload.participants).filter((order) => payload.relations.every((relation) => relationPass(order, relation)));
  }

  function generateRace(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const count = normalized === "hard" ? 5 : 4;
    const participants = shuffle(ANIMAL_POOLS[rng.int(0, ANIMAL_POOLS.length - 1)], rng).slice(0, count);
    const order = shuffle(participants, rng);
    let relations;
    if (normalized === "easy") {
      relations = [
        { type: "rank", person: order[0], rank: 1 },
        { type: "immediatelyBehind", ahead: order[0], behind: order[1] },
        { type: "immediatelyBehind", ahead: order[1], behind: order[2] },
        { type: "immediatelyBehind", ahead: order[2], behind: order[3] }
      ];
    } else if (normalized === "same") {
      relations = [
        { type: "rank", person: order[1], rank: 2 },
        { type: "before", first: order[0], second: order[1] },
        { type: "before", first: order[2], second: order[3] }
      ];
    } else {
      relations = [
        { type: "rank", person: order[2], rank: 3 },
        { type: "between", first: order[0], middle: order[1], last: order[2] },
        { type: "immediatelyBehind", ahead: order[2], behind: order[3] },
        { type: "before", first: order[3], second: order[4] }
      ];
    }
    const payload = {
      typeId: "animal-race-order",
      difficulty: normalized,
      seed: Number(seed) || 1,
      participants,
      relations,
      answer: order
    };
    if (!validateRace(payload)) throw new Error(`동물 달리기 ${normalized} 단일정답 검증 실패`);
    return payload;
  }

  function validateRace(payload) {
    const orders = enumerateRaceOrders(payload);
    return Boolean(
      payload && DIFFICULTIES.includes(payload.difficulty) && orders.length === 1 &&
      JSON.stringify(orders[0]) === JSON.stringify(payload.answer)
    );
  }

  function relationText(relation) {
    if (relation.type === "rank") return `${koreanTopic(relation.person)} ${relation.rank}등으로 달리고 있습니다.`;
    if (relation.type === "before") return `${koreanTopic(relation.first)} ${relation.second}보다 앞에서 달리고 있습니다.`;
    if (relation.type === "between") return `${koreanTopic(relation.middle)} ${relation.first}보다 뒤, ${relation.last}보다 앞에서 달리고 있습니다.`;
    return `${koreanTopic(relation.behind)} ${relation.ahead} 바로 뒤에서 달리고 있습니다.`;
  }

  function renderRaceProblem(payload) {
    const conditions = payload.relations.map((relation, index) => (
      `<text x="58" y="${46 + index * 29}" class="condition">• ${escapeText(relationText(relation))}</text>`
    )).join("");
    const startX = payload.participants.length === 4 ? 88 : 52;
    const gap = payload.participants.length === 4 ? 145 : 122;
    const slotY = 188;
    const slots = payload.participants.map((_, index) => {
      const x = startX + index * gap;
      return `<rect class="race-slot" x="${x}" y="${slotY}" width="94" height="48" rx="4"/>` +
        `<text class="race-rank" x="${x + 47}" y="${slotY + 72}">${index + 1}등</text>`;
    }).join("");
    const bank = payload.participants.map(escapeText).join(" · ");
    return `<svg class="challenge-visual race-visual" viewBox="0 0 680 292" role="img" aria-label="동물 달리기 순서 문제">` +
      `<rect class="condition-box" x="35" y="18" width="610" height="${48 + payload.relations.length * 29}" rx="12"/>${conditions}` +
      `${slots}<text class="animal-bank" x="340" y="282">동물: ${bank}</text></svg>`;
  }

  function renderRaceAnswer(payload) {
    return payload.answer.map((name, index) => `${index + 1}등 ${name}`).join(" · ");
  }

  function chooseIndexes(length, picked) {
    const out = [];
    function visit(start, row) {
      if (row.length === picked) {
        out.push(row);
        return;
      }
      for (let index = start; index < length; index += 1) visit(index + 1, row.concat(index));
    }
    visit(0, []);
    return out;
  }

  function enumerateCardSums(payload) {
    if (!payload || !Array.isArray(payload.cards)) return [];
    const answers = new Map();
    for (let size = 1; size <= payload.cards.length; size += 1) {
      chooseIndexes(payload.cards.length, size).forEach((indexes) => {
        const values = indexes.map((index) => payload.cards[index]).sort((a, b) => a - b);
        if (values.reduce((sum, value) => sum + value, 0) === payload.target) {
          answers.set(values.join(","), values);
        }
      });
    }
    return [...answers.values()].sort((a, b) => a.length - b.length || a.join("").localeCompare(b.join("")));
  }

  function generateCardSums(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const target = rng.int(normalized === "hard" ? 8 : 6, normalized === "hard" ? 12 : 9);
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const cards = Array.from({ length: 7 }, () => rng.int(1, Math.min(7, target - 1))).sort((a, b) => a - b);
      const payload = { typeId: "card-sum-count", difficulty: normalized, seed: Number(seed) || 1, cards, target };
      const ways = enumerateCardSums(payload);
      const range = normalized === "easy" ? [2, 4] : normalized === "hard" ? [6, 10] : [4, 7];
      if (ways.length >= range[0] && ways.length <= range[1]) {
        payload.answer = ways.length;
        payload.ways = ways;
        return payload;
      }
    }
    throw new Error(`숫자 카드 합 ${normalized} 생성 실패`);
  }

  function renderCardSums(payload) {
    const cards = payload.cards.map((value, index) => `<g transform="translate(${30 + index * 72} 62)"><rect class="logic-card" width="52" height="58" rx="4"/><text class="logic-label" x="26" y="37">${value}</text></g>`).join("");
    return `<svg class="challenge-visual" viewBox="0 0 560 145" role="img" aria-label="숫자 카드로 목표 수 만들기"><text class="logic-label logic-small" x="280" y="30">합이 ${payload.target}이 되게 카드를 골라 보세요.</text>${cards}</svg>`;
  }

  function enumerateTotalDifference(payload) {
    if (!payload) return [];
    const out = [];
    for (let small = 1; small < payload.total; small += 1) {
      const large = payload.total - small;
      if (large >= small && large - small === payload.difference) out.push([large, small]);
    }
    return out;
  }

  function generateTotalDifference(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const small = rng.int(3, normalized === "hard" ? 15 : 10);
    const difference = rng.int(normalized === "easy" ? 2 : 3, normalized === "hard" ? 10 : 7);
    const payload = { typeId: "total-difference", difficulty: normalized, seed: Number(seed) || 1, total: small * 2 + difference, difference, answer: [small + difference, small] };
    if (enumerateTotalDifference(payload).length !== 1) throw new Error("전체와 차 생성 실패");
    return payload;
  }

  function renderTotalDifference(payload) {
    return `<svg class="challenge-visual" viewBox="0 0 620 222" role="img" aria-label="두 접시의 전체와 차"><text class="logic-label logic-small" x="310" y="30">사탕 ${payload.total}개를 두 접시에 ${payload.difference}개 차이가 나게 담습니다.</text><g transform="translate(80 65)"><ellipse class="plate" cx="105" cy="55" rx="92" ry="29"/><rect class="answer-blank" x="60" y="105" width="90" height="42" rx="4"/></g><g transform="translate(335 65)"><ellipse class="plate" cx="105" cy="55" rx="92" ry="29"/><rect class="answer-blank" x="60" y="105" width="90" height="42" rx="4"/></g></svg>`;
  }

  function generateFamilyDifference(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const momMore = rng.int(3, 7);
    const siblingLess = rng.int(2, 6);
    const dadAboveSibling = siblingLess + rng.int(1, normalized === "hard" ? 6 : 4);
    return { typeId: "family-comparison", difficulty: normalized, seed: Number(seed) || 1, momMore, siblingLess, dadAboveSibling, answer: dadAboveSibling - siblingLess };
  }

  function enumerateFamilyDifference(payload) {
    if (!payload) return [];
    const differences = new Set();
    for (let me = payload.siblingLess + 1; me <= 30; me += 1) differences.add((me - payload.siblingLess + payload.dadAboveSibling) - me);
    return [...differences];
  }

  function renderFamilyDifference(payload) {
    const lines = [`엄마는 나보다 ${payload.momMore}개 더 많습니다.`, `동생은 나보다 ${payload.siblingLess}개 더 적습니다.`, `아빠는 동생보다 ${payload.dadAboveSibling}개 더 많습니다.`];
    return `<svg class="challenge-visual" viewBox="0 0 640 220" role="img" aria-label="가족의 사탕 개수 비교"><rect class="condition-box" x="45" y="18" width="550" height="150" rx="10"/>${lines.map((line, i) => `<text class="condition" x="78" y="62" dy="${i * 39}">• ${line}</text>`).join("")}<text class="logic-label logic-small" x="320" y="205">아빠는 나보다 몇 개 더 많을까요?</text></svg>`;
  }

  function generateLineTotal(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const before = rng.int(2, normalized === "hard" ? 9 : 6);
    const after = rng.int(2, normalized === "hard" ? 9 : 6);
    let otherBackRank = rng.int(2, before + after);
    if (otherBackRank === after + 1) otherBackRank = otherBackRank === before + after ? 2 : otherBackRank + 1;
    const answer = normalized === "easy" ? before + after + 1 : before + after + 1 - otherBackRank;
    return { typeId: "line-position-total", difficulty: normalized, seed: Number(seed) || 1, before, after, otherBackRank, answer };
  }

  function renderLineTotal(payload) {
    return "";
  }

  function mountainDigitCount(figure, digit) {
    if (figure < digit) return 0;
    return figure === digit ? 1 : 1 + (figure - digit) * 2;
  }

  function generateMountainCount(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const figure = rng.int(normalized === "easy" ? 5 : 6, 8);
    const digit = rng.int(2, Math.min(7, figure - 1));
    return { typeId: "mountain-digit-count", difficulty: normalized, seed: Number(seed) || 1, figure, digit, answer: mountainDigitCount(figure, digit) };
  }

  function renderMountainCount(payload) {
    const rows = [1, 2, 3].map((peak, rowIndex) => {
      const values = Array.from({ length: peak * 2 - 1 }, (_, index) => index < peak ? index + 1 : peak * 2 - index - 1);
      return values.map((value, index) => `<g transform="translate(${112 + index * 42 - (peak - 1) * 42} ${18 + rowIndex * 45})"><rect class="logic-cell" width="38" height="36"/><text class="logic-label logic-small" x="19" y="24">${value}</text></g>`).join("");
    }).join("");
    return `<svg class="challenge-visual" viewBox="0 0 620 170" role="img" aria-label="산 모양 수 배열"><g>${rows}</g><text class="logic-label logic-small" x="430" y="72">${payload.figure}번째 모양에서</text><text class="logic-label logic-small" x="430" y="106">‘${payload.digit}’은 몇 개일까요?</text></svg>`;
  }

  function enumerateTriangleRule(payload) {
    if (!payload) return [];
    const out = [];
    for (let value = 0; value <= 20; value += 1) if (payload.top + payload.left - value === payload.center) out.push(value);
    return out;
  }

  function generateTriangleRule(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const answer = rng.int(1, 9);
    const top = rng.int(2, 9);
    const left = rng.int(Math.max(1, answer + 1 - top), 9);
    const center = top + left - answer;
    return { typeId: "triangle-number-rule", difficulty: normalized, seed: Number(seed) || 1, top, left, center, answer };
  }

  function renderTriangleRule(payload) {
    const triangle = (x, top, left, right, center, blank) => `<g transform="translate(${x} 10)"><path d="M100 20 L30 145 H170 Z" fill="#e7eaee" stroke="#8d99a7"/><circle class="logic-card" cx="100" cy="20" r="22"/><circle class="logic-card" cx="30" cy="145" r="22"/><circle class="logic-card" cx="170" cy="145" r="22"/><text class="logic-label logic-small" x="100" y="26">${top}</text><text class="logic-label logic-small" x="30" y="151">${left}</text>${blank ? `<rect class="answer-blank" x="148" y="123" width="44" height="44" rx="22"/>` : `<text class="logic-label logic-small" x="170" y="151">${right}</text>`}<text class="logic-label" x="100" y="103">${center}</text></g>`;
    return `<svg class="challenge-visual" viewBox="0 0 820 185" role="img" aria-label="세 예시와 빈칸이 있는 삼각형 수 규칙">${triangle(0,5,6,4,7,false)}${triangle(205,8,3,5,6,false)}${triangle(410,4,7,8,3,false)}${triangle(615,payload.top,payload.left,payload.answer,payload.center,true)}</svg>`;
  }

  function rotateCells(cells) {
    return cells.map(([row, column]) => [column, 2 - row]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }

  function cellKey(cells) {
    return cells.map((cell) => cell.join(":" )).sort().join("|");
  }

  function rotationKey(cells) {
    const keys = [];
    let current = cells;
    for (let turn = 0; turn < 4; turn += 1) {
      keys.push(cellKey(current));
      current = rotateCells(current);
    }
    return keys.sort()[0];
  }

  function enumerateRotationPairs(payload) {
    const groups = new Map();
    payload.options.forEach((cells, index) => {
      const key = rotationKey(cells);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(index + 1);
    });
    return [...groups.values()].filter((group) => group.length === 2);
  }

  function generateRotationPair(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    for (let attempt = 0; attempt < 600; attempt += 1) {
      const all = chooseIndexes(9, normalized === "hard" ? 4 : 3).map((indexes) => indexes.map((value) => [Math.floor(value / 3), value % 3]));
      const base = all[rng.int(0, all.length - 1)];
      let paired = base;
      const turns = rng.int(1, 3);
      for (let turn = 0; turn < turns; turn += 1) paired = rotateCells(paired);
      if (cellKey(base) === cellKey(paired)) continue;
      const distractors = shuffle(all.filter((cells) => rotationKey(cells) !== rotationKey(base)), rng);
      const picked = [];
      for (const cells of distractors) {
        if (!picked.some((other) => rotationKey(other) === rotationKey(cells))) picked.push(cells);
        if (picked.length === 4) break;
      }
      if (picked.length !== 4) continue;
      const options = shuffle([base, paired, ...picked], rng);
      const payload = { typeId: "rotated-grid-pair", difficulty: normalized, seed: Number(seed) || 1, options };
      const pairs = enumerateRotationPairs(payload);
      if (pairs.length === 1) {
        payload.answer = pairs[0];
        return payload;
      }
    }
    throw new Error("회전 모양 짝 생성 실패");
  }

  function renderRotationPair(payload) {
    const optionSvg = payload.options.map((cells, index) => {
      const x = 10 + index * 108;
      const y = 25;
      const shaded = new Set(cells.map((cell) => cell.join(":")));
      const grid = Array.from({ length: 9 }, (_, cellIndex) => {
        const row = Math.floor(cellIndex / 3);
        const column = cellIndex % 3;
        return `<rect x="${x + column * 28}" y="${y + row * 28}" width="28" height="28" class="grid-cell${shaded.has(`${row}:${column}`) ? " shade-cell" : ""}"/>`;
      }).join("");
      return `<text class="logic-label" x="${x + 42}" y="21">${index + 1}</text>${grid}`;
    }).join("");
    return `<svg class="challenge-visual rotation-visual" viewBox="0 0 660 115" role="img" aria-label="돌렸을 때 같은 격자 모양 찾기">${optionSvg}</svg>`;
  }

  const NAME_POOLS = [
    ["민준", "수아", "하준", "서윤", "지호"],
    ["도윤", "지우", "시우", "하은", "유준"],
    ["서준", "유나", "예준", "채원", "현우"]
  ];

  function apartmentPass(order, relation) {
    const floor = (name) => order.indexOf(name) + 1;
    if (relation.type === "floorSet") return relation.floors.includes(floor(relation.person));
    if (relation.type === "top") return floor(relation.person) === order.length;
    if (relation.type === "immediatelyBelow") return floor(relation.lower) + 1 === floor(relation.upper);
    return false;
  }

  function enumerateApartment(payload) {
    if (!payload || !Array.isArray(payload.people)) return [];
    return permutations(payload.people).filter((order) => payload.relations.every((relation) => apartmentPass(order, relation)));
  }

  function generateApartment(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const people = shuffle(NAME_POOLS[rng.int(0, NAME_POOLS.length - 1)], rng);
    const lower = people.slice(0, 2);
    const upper = people.slice(2);
    const top = upper[0];
    const bridgeLower = lower[1];
    const bridgeUpper = upper[1];
    const relations = [
      ...lower.map((person) => ({ type: "floorSet", person, floors: [1, 2] })),
      ...upper.map((person) => ({ type: "floorSet", person, floors: [3, 4, 5] })),
      { type: "top", person: top },
      { type: "immediatelyBelow", lower: bridgeLower, upper: bridgeUpper }
    ];
    const candidates = enumerateApartment({ people, relations });
    if (candidates.length !== 1) throw new Error("아파트 배치 단일정답 생성 실패");
    return { typeId: "apartment-floor-order", difficulty: normalized, seed: Number(seed) || 1, people, lower, upper, top, bridgeLower, bridgeUpper, relations, answer: candidates[0] };
  }

  function renderApartment(payload) {
    const rows = [5, 4, 3, 2, 1].map((floor, index) => `<g transform="translate(390 ${22 + index * 39})"><rect class="logic-cell" width="165" height="39"/><text class="logic-label logic-small" x="25" y="25">${floor}층</text></g>`).join("");
    const lower = payload.lower.map(escapeText).join(", ");
    const upper = payload.upper.map(escapeText).join(", ");
    const conditions = [`${lower}: 1층 또는 2층`, `${upper}: 3층, 4층 또는 5층`, `${payload.top}: 가장 위층`, `${payload.bridgeLower}: ${payload.bridgeUpper} 바로 아래층`];
    return `<svg class="challenge-visual" viewBox="0 0 640 225" role="img" aria-label="아파트 층 배치"><rect class="condition-box" x="20" y="18" width="345" height="185" rx="10"/>${conditions.map((line, i) => `<text class="condition logic-small" x="42" y="53" dy="${i * 38}">• ${escapeText(line)}</text>`).join("")}${rows}</svg>`;
  }

  const PATTERN_ICONS = ["별", "마름모", "동그라미", "세모", "네모"];
  const PATTERN_COLORS = ["#e98b36", "#f0ca2c", "#70b9dc", "#77b957", "#b383c8"];

  function patternAt(pattern, position) {
    return pattern[(position - 1) % pattern.length];
  }

  function countPattern(pattern, target, through) {
    let count = 0;
    for (let position = 1; position <= through; position += 1) if (patternAt(pattern, position) === target) count += 1;
    return count;
  }

  function generateCyclicPattern(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const length = normalized === "hard" ? 4 : 3;
    const pattern = shuffle(PATTERN_ICONS, rng).slice(0, length);
    const colors = shuffle(["주황색", "파란색", "초록색"], rng).slice(0, normalized === "hard" ? 3 : 2);
    const position = rng.int(13, normalized === "hard" ? 28 : 22);
    const target = pattern[rng.int(0, pattern.length - 1)];
    const through = position + rng.int(2, 6);
    const answer = [`${patternAt(colors, position)} ${patternAt(pattern, position)}`, countPattern(pattern, target, through)];
    return { typeId: "cyclic-picture-pattern", difficulty: normalized, seed: Number(seed) || 1, pattern, colors, position, through, target, answer };
  }

  function iconSvg(name, x, y, color) {
    if (name === "동그라미") return `<circle cx="${x}" cy="${y}" r="18" fill="${color}"/>`;
    if (name === "세모") return `<path d="M${x} ${y - 21} L${x - 21} ${y + 18} H${x + 21} Z" fill="${color}"/>`;
    if (name === "네모") return `<rect x="${x - 18}" y="${y - 18}" width="36" height="36" fill="${color}"/>`;
    if (name === "마름모") return `<path d="M${x} ${y - 22} L${x + 22} ${y} L${x} ${y + 22} L${x - 22} ${y} Z" fill="${color}"/>`;
    return `<path d="M${x} ${y - 23} L${x + 7} ${y - 8} L${x + 23} ${y - 7} L${x + 11} ${y + 4} L${x + 15} ${y + 21} L${x} ${y + 12} L${x - 15} ${y + 21} L${x - 11} ${y + 4} L${x - 23} ${y - 7} L${x - 7} ${y - 8} Z" fill="${color}"/>`;
  }

  function renderCyclicPattern(payload) {
    const palette = { "주황색": "#e88c37", "파란색": "#438dc1", "초록색": "#659747" };
    const preview = Array.from({ length: 12 }, (_, index) => {
      const name = patternAt(payload.pattern, index + 1);
      return iconSvg(name, 27 + index * 51, 44, palette[patternAt(payload.colors, index + 1)]);
    }).join("");
    return `<svg class="challenge-visual" viewBox="0 0 670 170" role="img" aria-label="색과 모양의 규칙 문제">${preview}<text class="logic-label" x="650" y="50">…</text><text class="condition" x="15" y="104">(1) ${payload.position}번째에 올 그림의 색과 모양을 쓰세요.</text><text class="condition" x="15" y="147">(2) ${payload.through}번째까지 ${koreanTopic(payload.target)} 모두 몇 개일까요?</text></svg>`;
  }

  function propertyPass(value, rule) {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    if (rule === "even-ones-larger") return value >= 10 && value % 2 === 0 && ones > tens;
    if (rule === "odd-digit-sum") return value >= 10 && value % 2 === 1 && tens + ones >= 10;
    return value >= 10 && value < 70 && tens === ones;
  }

  function propertyLines(rule) {
    if (rule === "even-ones-larger") return ["두 자리 수입니다.", "짝수입니다.", "일의 자리 숫자가 십의 자리 숫자보다 큽니다."];
    if (rule === "odd-digit-sum") return ["두 자리 수입니다.", "홀수입니다.", "각 자리 숫자의 합이 10 이상입니다."];
    return ["70보다 작은 두 자리 수입니다.", "십의 자리 숫자와 일의 자리 숫자가 같습니다."];
  }

  function generateNumberProperty(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const rule = normalized === "easy" ? "double-digit" : normalized === "hard" ? "odd-digit-sum" : "even-ones-larger";
    for (let attempt = 0; attempt < 300; attempt += 1) {
      const options = shuffle(Array.from({ length: 90 }, (_, i) => i + 10), rng).slice(0, 8).sort((a, b) => a - b);
      const answer = options.filter((value) => propertyPass(value, rule));
      if (answer.length >= 1 && answer.length <= 3) return { typeId: "number-property-filter", difficulty: normalized, seed: Number(seed) || 1, rule, options, answer };
    }
    throw new Error("수의 공통점 생성 실패");
  }

  function renderNumberProperty(payload) {
    const lines = propertyLines(payload.rule).map((line, index) => `<text class="condition" x="60" y="48" dy="${index * 32}">• ${escapeText(line)}</text>`).join("");
    const options = payload.options.map((value, index) => `<g transform="translate(${58 + index * 68} 150)"><rect class="logic-card" width="48" height="42" rx="5"/><text class="logic-label logic-small" x="24" y="27">${value}</text></g>`).join("");
    return `<svg class="challenge-visual" viewBox="0 0 640 220" role="img" aria-label="조건에 맞는 수 찾기"><rect class="condition-box" x="35" y="15" width="570" height="112" rx="10"/>${lines}${options}</svg>`;
  }

  function enumerateBalanceOrders(payload) {
    if (payload.exchange) {
      const answers = new Map();
      for (let apple = 1; apple <= 30; apple += 1) for (let pear = 1; pear <= 10; pear += 1) {
        if (apple === payload.pearsPerApple * pear && pear === payload.berriesPerPear) {
          const pair = [apple, payload.appleCount * apple + payload.pearCount * pear];
          answers.set(JSON.stringify(pair), pair);
        }
      }
      return [...answers.values()];
    }
    return permutations(payload.items).filter((order) => payload.comparisons.every(([heavy, light]) => order.indexOf(heavy) < order.indexOf(light)));
  }

  function generateBalanceOrder(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const pearsPerApple = rng.int(2, 3), berriesPerPear = rng.int(2, 4);
    const appleCount = normalized === "hard" ? 2 : 1, pearCount = rng.int(1, 2);
    const answer = [pearsPerApple * berriesPerPear, (appleCount * pearsPerApple + pearCount) * berriesPerPear];
    return { typeId: "balance-weight-order", difficulty: normalized, seed: Number(seed) || 1, exchange: true, pearsPerApple, berriesPerPear, appleCount, pearCount, answer };
  }

  function fruitSvg(kind, x, y, scale = 1) {
    const leaf = '<path d="M1 -18 Q8 -31 18 -24 Q12 -14 1 -18" fill="#5b813d"/><path d="M0 -15 Q-2 -23 2 -29" fill="none" stroke="#77553b" stroke-width="3" stroke-linecap="round"/>';
    const shapes = {
      apple: '<path d="M0 -15 C-26 -31 -33 -1 -21 17 C-12 31 -6 22 0 24 C8 22 16 30 24 13 C37 -10 18 -28 0 -15Z" fill="#cb4b3e" stroke="#a43a31" stroke-width="1.2"/><path d="M-16 -11 Q-23 -1 -17 8" fill="none" stroke="#efb3a1" stroke-width="3" stroke-linecap="round"/>',
      pear: '<path d="M-8 -17 C-12 -8 -8 -5 -20 7 C-39 35 36 37 22 8 C10 -9 13 -25 0 -24 C-5 -25 -7 -21 -8 -17Z" fill="#d9b74e" stroke="#aa8a30" stroke-width="1.2"/><path d="M-14 7 Q-23 18 -14 23" fill="none" stroke="#f5e3a1" stroke-width="3" stroke-linecap="round"/>',
      berry: '<path d="M-23 -12 C-30 0 -12 23 0 29 C13 23 30 0 23 -12 Q13 -26 0 -18 Q-13 -26 -23 -12Z" fill="#d25b53" stroke="#a73737" stroke-width="1.2"/><path d="M-21 -20 L-10 -22 L-9 -30 L0 -22 L10 -30 L12 -22 L23 -20 L9 -12 L0 -17 L-9 -12Z" fill="#5a8041"/>' + [[-13,-6],[6,-6],[16,2],[-4,4],[-9,12],[5,17]].map(([cx,cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="1.2" ry="2" fill="#ffe3aa"/>`).join('')
    };
    return `<g transform="translate(${x} ${y}) scale(${scale})">${shapes[kind]}${kind === "berry" ? "" : leaf}</g>`;
  }

  function renderBalanceOrder(payload) {
    const pan = (kind, count, center) => `<ellipse cx="${center}" cy="79" rx="69" ry="9" fill="#f3f2ed" stroke="#767e84"/>` + Array.from({length:count},(_,i)=>fruitSvg(kind, center + (i-(count-1)/2)*32,60,.57)).join('');
    const balance = (x, left, right, count) => `<g transform="translate(${x} 6)"><path d="M65 93 H255 M160 93 L143 127 H177Z" fill="#ced2d2" stroke="#71797e"/><path d="M65 83 V93 M255 83 V93" stroke="#71797e"/>${pan(left,1,65)}${pan(right,count,255)}</g>`;
    return `<svg class="challenge-visual" viewBox="0 0 680 240" role="img" aria-label="사과 배 딸기를 올린 수평 저울">${balance(5,"apple","pear",payload.pearsPerApple)}${balance(350,"pear","berry",payload.berriesPerPear)}<text class="condition" x="15" y="174">(1) 사과 1개는 딸기 몇 개와 무게가 같습니까?</text><text class="condition" x="15" y="215">(2) 사과 ${payload.appleCount}개와 배 ${payload.pearCount}개는 딸기 몇 개와 무게가 같습니까?</text></svg>`;
  }

  function generateInverseStory(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const schema = normalized === "easy" ? "relation" : normalized === "hard" ? (rng.next() < .5 ? "bus" : "birds") : "oranges";
    if (schema === "relation") {
      const gap = rng.int(6, 19);
      const smaller = rng.int(15, 35);
      const base = smaller + gap;
      return { typeId: "inverse-story-problem", difficulty: normalized, seed: Number(seed) || 1, schema, values: { gap, smaller }, storyLines: [`어떤 수보다 ${gap} 작은 수는 ${smaller}입니다.`, `어떤 수보다 ${gap} 큰 수는 얼마일까요?`], answer: base + gap };
    }
    if (schema === "birds") {
      const initial = rng.int(24, 45);
      const arrive = rng.int(3, 9);
      const final = rng.int(10, initial - 3);
      const flew = initial + arrive - final;
      return { typeId: "inverse-story-problem", difficulty: normalized, seed: Number(seed) || 1, schema, values: { initial, arrive, final, flew }, storyLines: [`전깃줄에 참새 ${initial}마리가 있었습니다.`, `몇 마리가 날아가고 ${arrive}마리가 날아와 지금은 ${final}마리입니다.`, "날아간 참새는 몇 마리일까요?"], answer: flew };
    }
    if (schema === "bus") {
      const off1 = rng.int(2, 6);
      const on1 = rng.int(3, 8);
      const off2 = rng.int(2, 6);
      const final = rng.int(20, 32);
      const initial = final + off1 - on1 + off2;
      return { typeId: "inverse-story-problem", difficulty: normalized, seed: Number(seed) || 1, schema, values: { off1, on1, off2, final }, storyLines: [`첫 정류장에서 ${off1}명이 내리고 ${on1}명이 탔습니다.`, `둘째 정류장에서 ${off2}명이 내린 뒤 ${final}명이 되었습니다.`, "처음 승객은 몇 명이었을까요?"], answer: initial };
    }
    const ate = rng.int(3, 8);
    const added = rng.int(10, 20);
    const final = rng.int(20, 35);
    const initial = final + ate - added;
    return { typeId: "inverse-story-problem", difficulty: normalized, seed: Number(seed) || 1, schema, values: { ate, added, final }, storyLines: [`귤을 ${ate}개 먹었습니다.`, `그 뒤 ${added}개를 더 가져오니 ${final}개가 되었습니다.`, "처음에 있던 귤은 몇 개일까요?"], answer: initial };
  }

  function validateInverseStory(payload) {
    const v = payload.values || {};
    if (payload.schema === "relation") return payload.answer === v.smaller + v.gap * 2;
    if (payload.schema === "birds") return v.initial - v.flew + v.arrive === v.final && payload.answer === v.flew;
    if (payload.schema === "bus") return payload.answer - v.off1 + v.on1 - v.off2 === v.final;
    return payload.answer - v.ate + v.added === v.final;
  }

  function storyAnswer(p) {
    const v=p.values;
    if(p.schema==='relation')return v.smaller+2*v.gap;
    if(p.schema==='birds')return v.initial+v.arrive-v.final;
    if(p.schema==='bus')return v.final+v.off1-v.on1+v.off2;
    return v.final+v.ate-v.added;
  }

  function renderStory(payload) {
    return `<svg class="challenge-visual" viewBox="0 0 640 190" role="img" aria-label="거꾸로 푸는 문장제"><rect class="condition-box" x="35" y="20" width="570" height="145" rx="10"/>${payload.storyLines.map((line, index) => `<text class="condition" x="63" y="58" dy="${index * 39}">${escapeText(line)}</text>`).join("")}</svg>`;
  }

  function arrowDelta(direction) {
    return direction === "R" ? 1 : direction === "L" ? -1 : direction === "D" ? 10 : -10;
  }

  function generateArrowMove(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const count = normalized === "easy" ? 4 : normalized === "hard" ? 7 : 5;
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const moves = Array.from({ length: count }, () => ["R", "L", "D", "U"][rng.int(0, 3)]);
      const start = rng.int(25, 75);
      const end = moves.reduce((value, direction) => value + arrowDelta(direction), start);
      if (end >= 1 && end <= 99 && end !== start) {
        const missing = rng.next() < .5 ? "start" : "end";
        return { typeId: "arrow-number-move", difficulty: normalized, seed: Number(seed) || 1, moves, start, end, missing, answer: missing === "start" ? start : end };
      }
    }
    throw new Error("화살표 수 이동 생성 실패");
  }

  function arrowAnswer(payload) {
    const delta = payload.moves.reduce((sum, direction) => sum + arrowDelta(direction), 0);
    return payload.missing === "start" ? payload.end - delta : payload.start + delta;
  }

  function renderArrowMove(payload) {
    const symbol = { R: "→", L: "←", D: "↓", U: "↑" };
    const moves = payload.moves.map((direction, index) => `<text class="logic-label" x="${165 + index * 53}" y="100">${symbol[direction]}</text>`).join("");
    const start = payload.missing === "start" ? "" : payload.start;
    const end = payload.missing === "end" ? "" : payload.end;
    return `<svg class="challenge-visual" viewBox="0 0 640 170" role="img" aria-label="화살표 수 이동"><rect class="${start === "" ? "answer-blank" : "logic-card"}" x="55" y="67" width="62" height="52" rx="5"/><text class="logic-label" x="86" y="101">${start}</text>${moves}<rect class="${end === "" ? "answer-blank" : "logic-card"}" x="545" y="67" width="62" height="52" rx="5"/><text class="logic-label" x="576" y="101">${end}</text></svg>`;
  }

  function enumerateSymbolEquation(payload) {
    const answers = new Set();
    for (let circle = 0; circle <= 9; circle += 1) for (let diamond = 0; diamond <= 9; diamond += 1) for (let triangle = 0; triangle <= 9; triangle += 1) {
      if (payload.constant + circle === payload.sum1 && circle + diamond === payload.sum2 && diamond - triangle === payload.diff) answers.add(circle + triangle);
    }
    return [...answers];
  }

  function generateSymbolEquation(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    const circle = rng.int(2, 8);
    const diamond = rng.int(3, 9);
    const triangle = rng.int(1, diamond);
    const constant = rng.int(1, 7);
    const payload = { typeId: "symbol-equation", difficulty: normalized, seed: Number(seed) || 1, constant, sum1: constant + circle, sum2: circle + diamond, diff: diamond - triangle, answer: circle + triangle };
    if (enumerateSymbolEquation(payload).length !== 1) throw new Error("기호식 단일정답 생성 실패");
    return payload;
  }

  function renderSymbolEquation(payload) {
    return `<svg class="challenge-visual" viewBox="0 0 640 205" role="img" aria-label="기호가 나타내는 수"><rect class="condition-box" x="165" y="18" width="310" height="168" rx="7"/><text class="logic-label" x="320" y="60">${payload.constant} + ○ = ${payload.sum1}</text><text class="logic-label" x="320" y="98">○ + ◇ = ${payload.sum2}</text><text class="logic-label" x="320" y="136">◇ - △ = ${payload.diff}</text><text class="logic-label" x="320" y="174">○ + △ = □</text></svg>`;
  }

  function pyramidTop(cards) {
    return cards[0] + cards[1] * 3 + cards[2] * 3 + cards[3];
  }

  function enumeratePyramidMinimum(payload) {
    const values = new Map();
    permutations(payload.cards).forEach((row) => values.set(row.join(","), pyramidTop(row)));
    const min = Math.min(...values.values());
    const max = Math.max(...values.values());
    return [payload.operation === "sum" ? max + min : max - min];
  }

  function generatePyramidMinimum(difficulty, seed) {
    const normalized = DIFFICULTIES.includes(difficulty) ? difficulty : "same";
    const rng = makeRng(seed);
    let cards = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng).slice(0, 4);
    if (cards.every((value, i) => !i || value > cards[i - 1]) || cards.every((value, i) => !i || value < cards[i - 1])) [cards[0], cards[1]] = [cards[1], cards[0]];
    const operation = (Number(seed) || 1) % 2 === 0 ? "sum" : "difference";
    const payload = { typeId: "minimum-sum-pyramid", difficulty: normalized, seed: Number(seed) || 1, cards, operation };
    payload.answer = enumeratePyramidMinimum(payload)[0];
    return payload;
  }

  function renderPyramidMinimum(payload) {
    const cells = [];
    for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4 - row; column += 1) {
      const x = 218 + row * 31 + column * 62;
      const y = 210 - row * 42;
      cells.push(`<rect class="logic-cell" x="${x}" y="${y}" width="62" height="42"/>`);
    }
    const cards = payload.cards.map((value, index) => `<g transform="translate(${210 + index * 72} 8)"><rect class="logic-card" width="50" height="40" rx="3"/><text class="logic-label" x="25" y="28">${value}</text></g>`).join("");
    return `<svg class="challenge-visual pyramid-visual" viewBox="0 0 640 260" role="img" aria-label="위쪽 숫자 카드와 빈 수 피라미드">${cards}${cells.join("")}</svg>`;
  }

  function cubeAnswers(p) {
    const total = p.heights.reduce((sum, row) => sum + row.reduce((a,b) => a+b,0),0);
    return [total, Math.max(...p.heights.flat()) * 4 - total];
  }

  function generateCube(difficulty, seed) {
    const rng = makeRng(seed);
    const highest = rng.int(3, difficulty === "hard" ? 4 : 3);
    const front = rng.int(1,2);
    const heights = [[highest,rng.int(front,highest-1)],[rng.int(front,highest-1),front]];
    const p = {typeId:"cube-count-fill",difficulty,seed,heights};
    p.answer = cubeAnswers(p);
    return p;
  }

  function renderCube(p) {
    const project = (x,y,z) => [330 + (x-y)*43, 152 + (x+y)*23 - z*43];
    const face = (vertices, fill) => `<polygon points="${vertices.map(v=>project(...v).join(',')).join(' ')}" fill="${fill}" stroke="#4e6374" stroke-width="1.5" stroke-linejoin="round"/>`;
    const cubes = [];
    for(let x=0;x<2;x++) for(let y=0;y<2;y++) for(let z=0;z<p.heights[x][y];z++) cubes.push({x,y,z});
    cubes.sort((a,b)=>(a.x+a.y)-(b.x+b.y)||a.z-b.z);
    const drawing = cubes.map(({x,y,z}) => face([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],"#b5cfdd") + face([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],"#d2e1e9") + face([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],"#f5fafc")).join('');
    return `<div class="spatial-pair"><svg class="challenge-visual" viewBox="225 -35 210 285" role="img" aria-label="네 기둥으로 쌓은 쌓기나무">${drawing}</svg><div class="spatial-asks"><p>(1) 쌓기나무는 모두 몇 개입니까?</p><p>(2) 네 기둥을 가장 높은 기둥과 같게 하려면, 모두 몇 개를 더 쌓아야 합니까?</p></div></div>`;
  }

  function rectangleAnswers(p) {
    let rectangles=0,squares=0;
    const edges=new Set(p.edges);
    for(let left=0;left<p.cols;left++) for(let right=left+1;right<=p.cols;right++)
      for(let top=0;top<p.rows;top++) for(let bottom=top+1;bottom<=p.rows;bottom++) {
        let closed=true;
        for(let x=left;x<right;x++) if(!edges.has(`h:${x}:${top}`)||!edges.has(`h:${x}:${bottom}`)) closed=false;
        for(let y=top;y<bottom;y++) if(!edges.has(`v:${left}:${y}`)||!edges.has(`v:${right}:${y}`)) closed=false;
        if(closed) {rectangles++;if(right-left===bottom-top)squares++;}
      }
    return [squares,rectangles];
  }

  function generateRectangleCount(difficulty,seed) {
    const rng=makeRng(seed), cols=3,rows=difficulty==="hard"?3:2,edges=[];
    for(let x=0;x<cols;x++) for(let y=0;y<=rows;y++) edges.push(`h:${x}:${y}`);
    for(let x=0;x<=cols;x++) for(let y=0;y<rows;y++) edges.push(`v:${x}:${y}`);
    const remove=new Set([`v:${rng.int(1,cols-1)}:${rng.int(0,rows-1)}`]);
    if(difficulty!=="easy")remove.add(`h:${rng.int(0,cols-1)}:${rng.int(1,rows-1)}`);
    const p={typeId:"rectangle-count",difficulty,seed,cols,rows,edges:edges.filter(e=>!remove.has(e))};
    p.answer=rectangleAnswers(p);return p;
  }

  function renderRectangleCount(p) {
    const lines=p.edges.map(e=>{const [kind,a,b]=e.split(':'),x=225+Number(a)*60,y=12+Number(b)*60;return `<path d="M${x} ${y} ${kind==='h'?'h60':'v60'}" fill="none" stroke="#44566a" stroke-width="2"/>`;}).join('');
    return `<div class="spatial-pair"><svg class="challenge-visual" viewBox="215 0 210 205" role="img" aria-label="일부 선분이 없는 사각형 그림">${lines}</svg><div class="spatial-asks"><p>(1) 크고 작은 정사각형은 모두 몇 개입니까?</p><p>(2) 정사각형을 포함하여 크고 작은 직사각형은 모두 몇 개입니까?</p></div></div>`;
  }

  function codeCells(value) {return [1,2,4,8].map(unit=>Boolean(value&unit));}
  function generateNumberCode(difficulty,seed) {
    const rng=makeRng(seed),encode=rng.int(9,15);
    let decode=rng.int(9,15);if(decode===encode)decode=decode===15?9:decode+1;
    return {typeId:"four-cell-code",difficulty,seed,encode,decode,shown:codeCells(decode),answer:[codeCells(encode).map((filled,i)=>filled?i+1:0).filter(Boolean),decode]};
  }
  function numberCodeAnswers(p) {
    return [codeCells(p.encode).map((filled,i)=>filled?i+1:0).filter(Boolean),p.shown.reduce((sum,filled,i)=>sum+(filled?2**i:0),0)];
  }
  function renderNumberCode(p) {
    const strip=(x,y,value,blank=false)=>[0,1,2,3].map(i=>`<rect x="${x+i*26}" y="${y}" width="26" height="30" fill="${!blank&&codeCells(value)[i]?'#798fa3':'#fff'}" stroke="#4e6071"/>`).join('');
    const examples=[1,2,3,4,5,6,7,8].map((v,i)=>{const x=15+(i%4)*160,y=12+Math.floor(i/4)*68;return strip(x,y,v)+`<text class="logic-label" x="${x+52}" y="${y+52}">${v}</text>`;}).join('');
    return `<svg class="challenge-visual" viewBox="0 0 660 260" role="img" aria-label="네 칸의 색칠로 나타낸 수 규칙">${examples}<text class="condition" x="15" y="180">(1) ${p.encode}을 나타내도록 색칠하세요.</text>${strip(70,205,0,true)}<text class="condition" x="340" y="180">(2) 다음 그림은 어떤 수입니까?</text>${strip(400,205,p.decode)}</svg>`;
  }

  function spatialType(id,label,generate,solve,render,prerequisites) {
    return Object.freeze({id,label,area:"도형과 공간",conceptSession:2,subtype:label,prompt:"그림을 보고 두 물음에 각각 답하세요.",answerContract:"ordered-list",sourceState:"review",
      learnerFit:{learner_stage:LEARNER_STAGE,language:"그림의 규칙과 두 물음",representations:label,prerequisites,reasoningLoad:"그림을 해석하고 서로 다른 두 값을 구하기",responseMode:"(1), (2)에 각각 답하기"},
      generate,validate:p=>JSON.stringify(solve(p))===JSON.stringify(p.answer),enumerate:p=>[solve(p)],renderProblem:render,
      renderAnswer:p=>id==="four-cell-code"?`(1) 왼쪽부터 ${p.answer[0].join('·')}번째 칸 색칠 (2) ${p.answer[1]}`:`(1) ${p.answer[0]}개 (2) ${p.answer[1]}개`,
      concept:{warmup:"작은 그림에서 구성 요소를 살펴요.",rule:"그림의 규칙을 확인하며 빠짐없이 조사해요.",review:"두 물음에서 구해야 하는 것이 어떻게 다른지 확인해요."}});
  }

  const TYPES = Object.freeze({
    "cube-count-fill": spatialType("cube-count-fill","쌓기나무의 개수와 채우기",generateCube,cubeAnswers,renderCube,"보이지 않는 아래쪽 쌓기나무까지 세기"),
    "rectangle-count": spatialType("rectangle-count","선분으로 만든 사각형 세기",generateRectangleCount,rectangleAnswers,renderRectangleCount,"크고 작은 도형 구별과 네 변 확인"),
    "four-cell-code": spatialType("four-cell-code","네 칸으로 나타내는 수",generateNumberCode,numberCodeAnswers,renderNumberCode,"색칠 조합과 수의 대응 찾기"),
    "split-merge-chain": Object.freeze({
      id: "split-merge-chain",
      label: "수 가르기·모으기",
      area: "수와 연산",
      conceptSession: 1,
      subtype: "연결된 두 수의 합으로 빈칸 찾기",
      prompt: "빈칸에 알맞은 수를 써넣어 수 가르기·모으기를 완성하세요.",
      answerContract: "ordered-tuples",
      sourceState: "review",
      reuse: ["fields-classic/question-bank: overlappingNumberBonds SVG topology"],
      learnerFit: {
        learner_stage: LEARNER_STAGE,
        language: "한 자리 수와 20 이하 수, 가르기·모으기 표현",
        representations: "연결선과 수 상자",
        prerequisites: "두 수를 더하고 전체에서 한 부분을 빼기",
        reasoningLoad: "쉽게 1단계, 같게 2~3단계, 어렵게 3단계 연결",
        responseMode: "빈칸에 수 쓰기"
      },
      generate: generateNumberBonds,
      validate: validateNumberBonds,
      enumerate: enumerateNumberAnswers,
      renderProblem: renderNumberProblem,
      renderAnswer: renderNumberAnswer,
      concept: {
        warmup: "두 수를 모아 전체 수를 만들어요.",
        rule: "위의 수는 연결된 아래 두 수를 더한 수예요.",
        review: "빈칸을 찾은 뒤 두 수를 다시 더해 확인해요."
      }
    }),
    "animal-race-order": Object.freeze({
      id: "animal-race-order",
      label: "동물 달리기 순서",
      area: "논리와 관계",
      conceptSession: 1,
      subtype: "정해진 등수와 앞뒤 조건으로 순서 완성하기",
      prompt: "조건을 보고 등수에 맞는 동물의 이름을 빈칸에 써 보세요.",
      answerContract: "ordered-list",
      sourceState: "review",
      reuse: ["hyper-focus/generator/logic.js: q35 permutation validator and line-order renderer"],
      learnerFit: {
        learner_stage: LEARNER_STAGE,
        language: "앞, 뒤, 바로 뒤, 등수",
        representations: "조건 목록과 순서 칸",
        prerequisites: "1등부터 차례대로 놓기",
        reasoningLoad: "쉽게 바로 뒤 연결, 같게 앞뒤 비교, 어렵게 사이 조건 추가",
        responseMode: "모든 순위 칸에 동물 이름 쓰기"
      },
      generate: generateRace,
      validate: validateRace,
      enumerate: enumerateRaceOrders,
      renderProblem: renderRaceProblem,
      renderAnswer: renderRaceAnswer,
      concept: {
        warmup: "1등부터 자리를 먼저 그려요.",
        rule: "등수가 정해진 동물을 먼저 놓고, 앞과 뒤 조건을 하나씩 표시해요.",
        review: "마지막에 모든 조건을 다시 읽으며 순서를 확인해요."
      }
    }),
    "card-sum-count": Object.freeze({
      id: "card-sum-count", label: "숫자 카드로 수 만들기", area: "수와 연산", conceptSession: 1,
      subtype: "중복 카드를 구별하지 않고 목표 합을 만드는 방법 세기",
      prompt: "숫자 카드 중 몇 장을 골라 목표 수를 만드는 방법은 모두 몇 가지일까요?",
      answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "한 자리 수와 합", representations: "숫자 카드", prerequisites: "여러 수 더하기", reasoningLoad: "빠뜨리지 않고 묶어 세기", responseMode: "방법의 수 쓰기" },
      generate: generateCardSums,
      validate: (payload) => enumerateCardSums(payload).length === payload.answer,
      enumerate: (payload) => [enumerateCardSums(payload).length],
      renderProblem: renderCardSums,
      renderAnswer: (payload) => `${payload.answer}가지`,
      concept: { warmup: "목표 수보다 큰 카드는 먼저 빼요.", rule: "카드 수가 적은 방법부터 차례로 찾아요.", review: "순서만 바뀐 방법과 같은 숫자 카드는 한 번만 세어요." }
    }),
    "total-difference": Object.freeze({
      id: "total-difference", label: "전체와 차로 나누기", area: "수와 연산", conceptSession: 1,
      subtype: "전체 수와 두 묶음의 차로 각 묶음 구하기",
      prompt: "전체와 차를 보고 두 곳에 담아야 할 수를 각각 구하세요.",
      answerContract: "ordered-pair-large-first", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "전체, 몇 개 차이", representations: "두 접시", prerequisites: "가르기와 덜어 놓기", reasoningLoad: "차이를 덜고 똑같이 나누기", responseMode: "두 수 쓰기" },
      generate: generateTotalDifference,
      validate: (payload) => JSON.stringify(enumerateTotalDifference(payload)) === JSON.stringify([payload.answer]),
      enumerate: enumerateTotalDifference,
      renderProblem: renderTotalDifference,
      renderAnswer: (payload) => `${payload.answer[0]}개, ${payload.answer[1]}개`,
      concept: { warmup: "먼저 차이만큼 한쪽에 따로 놓아요.", rule: "남은 것을 똑같이 둘로 나누어요.", review: "두 수의 합과 차를 모두 다시 확인해요." }
    }),
    "family-comparison": Object.freeze({
      id: "family-comparison", label: "사탕 수 비교", area: "논리와 관계", conceptSession: 1,
      subtype: "기준 인물을 거쳐 두 사람의 차 구하기",
      prompt: "설명을 읽고 아빠는 나보다 사탕을 몇 개 더 가지고 있는지 구하세요.",
      answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "더 많다, 더 적다", representations: "문장 조건", prerequisites: "같은 기준으로 수 비교하기", reasoningLoad: "두 관계 이어 보기", responseMode: "차이 쓰기" },
      generate: generateFamilyDifference,
      validate: (payload) => enumerateFamilyDifference(payload).length === 1 && enumerateFamilyDifference(payload)[0] === payload.answer,
      enumerate: enumerateFamilyDifference,
      renderProblem: renderFamilyDifference,
      renderAnswer: (payload) => `${payload.answer}개`,
      concept: { warmup: "‘나’를 같은 출발점으로 놓아요.", rule: "동생에서 아빠로 간 만큼과 나에서 동생으로 간 만큼을 비교해요.", review: "가상의 사탕 수를 넣어도 같은 차이가 나는지 확인해요." }
    }),
    "line-position-total": Object.freeze({
      id: "line-position-total", label: "줄에 선 사람 수", area: "수와 연산", conceptSession: 1,
      subtype: "앞과 뒤 인원으로 전체 인원 구하기",
      prompt: "앞과 뒤에 있는 학생 수를 보고 학생은 모두 몇 명인지 구하세요.",
      answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "앞, 뒤, 몇 번째", representations: "문장 조건과 빈 풀이 공간", prerequisites: "위치와 앞사람 수를 구별하기", reasoningLoad: "전체를 구한 뒤 다른 학생 앞의 인원 구하기", responseMode: "학생 수 쓰기" },
      generate: generateLineTotal,
      validate: (p) => p.answer === p.before + p.after + 1 - (p.difficulty === "easy" ? 0 : p.otherBackRank),
      enumerate: (p) => [p.before + p.after + 1 - (p.difficulty === "easy" ? 0 : p.otherBackRank)],
      renderProblem: renderLineTotal,
      renderAnswer: (payload) => `${payload.answer}명`,
      concept: { warmup: "앞사람과 뒷사람을 따로 세어요.", rule: "앞 + 나 1명 + 뒤로 계산해요.", review: "나를 빠뜨리지 않았는지 확인해요." }
    }),
    "mountain-digit-count": Object.freeze({
      id: "mountain-digit-count", label: "산 모양 수 규칙", area: "규칙", conceptSession: 1, maxMockPosition: 8,
      subtype: "커지는 산 모양 배열에서 특정 숫자의 개수 구하기",
      prompt: "규칙에 따라 수를 쓸 때, 물어본 숫자가 몇 번 나오는지 구하세요.",
      answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "몇 번째, 몇 번", representations: "계단식 수 배열", prerequisites: "1부터 차례로 세기", reasoningLoad: "처음 한 번과 이후 두 번씩 세기", responseMode: "개수 쓰기" },
      generate: generateMountainCount,
      validate: (payload) => payload.answer === mountainDigitCount(payload.figure, payload.digit),
      enumerate: (payload) => [mountainDigitCount(payload.figure, payload.digit)],
      renderProblem: renderMountainCount,
      renderAnswer: (payload) => `${payload.answer}번`,
      concept: { warmup: "각 줄의 수가 어디까지 커지는지 봐요.", rule: "가운데에서 처음 한 번, 다음 줄부터 양쪽에 두 번 나와요.", review: "작은 모양을 직접 써서 규칙을 확인해요." }
    }),
    "triangle-number-rule": Object.freeze({
      id: "triangle-number-rule", label: "삼각형 수 규칙", area: "규칙", conceptSession: 1,
      subtype: "위 수와 왼쪽 수를 더한 뒤 오른쪽 수를 빼기",
      prompt: "앞의 삼각형과 같은 규칙이 되도록 빈칸의 수를 구하세요.",
      answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "같은 규칙, 빈칸", representations: "삼각형과 네 수", prerequisites: "덧셈과 뺄셈", reasoningLoad: "보기 규칙을 찾아 적용", responseMode: "한 수 쓰기" },
      generate: generateTriangleRule,
      validate: (payload) => JSON.stringify(enumerateTriangleRule(payload)) === JSON.stringify([payload.answer]),
      enumerate: enumerateTriangleRule,
      renderProblem: renderTriangleRule,
      renderAnswer: (payload) => `${payload.answer}`,
      concept: { warmup: "보기의 세 꼭짓점 수를 차례로 살펴요.", rule: "위 수와 왼쪽 수를 더한 뒤 오른쪽 수를 빼면 가운데 수예요.", review: "구한 수를 넣어 보기와 같은 계산이 되는지 확인해요." }
    }),
    "rotated-grid-pair": Object.freeze({
      id: "rotated-grid-pair", label: "돌려서 같은 모양", area: "도형과 공간", conceptSession: 2,
      subtype: "3×3 색칠 모양의 회전 동치 판정",
      prompt: "종이를 돌렸을 때 같은 모양이 되는 두 번호를 찾으세요.",
      answerContract: "ordered-pair", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "돌리다, 같은 모양", representations: "3×3 색칠 격자", prerequisites: "위치와 방향 보기", reasoningLoad: "90도씩 돌려 비교", responseMode: "두 번호 쓰기" },
      generate: generateRotationPair,
      validate: (payload) => JSON.stringify(enumerateRotationPairs(payload)) === JSON.stringify([payload.answer]),
      enumerate: enumerateRotationPairs,
      renderProblem: renderRotationPair,
      renderAnswer: (payload) => `${payload.answer[0]}번과 ${payload.answer[1]}번`,
      concept: { warmup: "색칠한 칸의 수부터 비교해요.", rule: "종이를 90도씩 돌리며 같은 자리에 오는지 봐요.", review: "뒤집은 모양을 회전한 모양으로 잘못 고르지 않아요." }
    }),
    "apartment-floor-order": Object.freeze({
      id: "apartment-floor-order", label: "아파트 층 찾기", area: "논리와 관계", conceptSession: 1,
      subtype: "층 범위와 바로 위아래 조건으로 전체 배치 완성",
      prompt: "조건을 읽고 다섯 사람이 사는 층을 모두 찾아 쓰세요.",
      answerContract: "ordered-list-floor-ascending", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "위층, 아래층, 바로", representations: "5층 아파트 표", prerequisites: "1층부터 5층 순서", reasoningLoad: "범위 조건 뒤 바로 위아래 연결", responseMode: "층마다 이름 쓰기" },
      generate: generateApartment,
      validate: (payload) => JSON.stringify(enumerateApartment(payload)) === JSON.stringify([payload.answer]),
      enumerate: enumerateApartment,
      renderProblem: renderApartment,
      renderAnswer: (payload) => payload.answer.map((name, index) => `${index + 1}층 ${name}`).join(" · "),
      concept: { warmup: "들어갈 수 있는 층의 범위를 먼저 표시해요.", rule: "가장 위층과 바로 위아래 조건부터 놓아요.", review: "모든 사람이 한 층씩만 썼는지 확인해요." }
    }),
    "cyclic-picture-pattern": Object.freeze({
      id: "cyclic-picture-pattern", label: "반복되는 그림 규칙", area: "규칙", conceptSession: 2,
      subtype: "반복 단위로 n번째 모양 또는 특정 모양 개수 구하기",
      prompt: "그림의 반복 규칙을 찾아 물음에 답하세요.",
      answerContract: "ordered-list", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "몇 번째, 몇 개", representations: "색과 도형의 반복", prerequisites: "반복되는 묶음 찾기", reasoningLoad: "반복 단위로 위치 또는 개수 계산", responseMode: "모양 이름 또는 개수 쓰기" },
      generate: generateCyclicPattern,
      validate: (payload) => JSON.stringify(payload.answer) === JSON.stringify([`${patternAt(payload.colors, payload.position)} ${patternAt(payload.pattern, payload.position)}`, countPattern(payload.pattern, payload.target, payload.through)]),
      enumerate: (payload) => [[`${patternAt(payload.colors, payload.position)} ${patternAt(payload.pattern, payload.position)}`, countPattern(payload.pattern, payload.target, payload.through)]],
      renderProblem: renderCyclicPattern,
      renderAnswer: (payload) => `(1) ${payload.answer[0]} (2) ${payload.answer[1]}개`,
      concept: { warmup: "처음부터 되풀이되는 가장 짧은 묶음을 찾아요.", rule: "반복 묶음마다 같은 자리에 같은 그림이 와요.", review: "묶음의 첫 자리부터 다시 세어 확인해요." }
    }),
    "number-property-filter": Object.freeze({
      id: "number-property-filter", label: "조건에 맞는 수", area: "수와 연산", conceptSession: 1,
      subtype: "여러 수에서 공통 조건을 모두 만족하는 수 고르기",
      prompt: "주어진 조건을 모두 만족하는 수를 찾아 표시하세요.",
      answerContract: "sorted-list", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "두 자리, 짝수, 홀수, 자리 숫자", representations: "조건 상자와 수 카드", prerequisites: "십의 자리와 일의 자리 구분", reasoningLoad: "조건을 하나씩 거르는 교집합", responseMode: "맞는 수 모두 고르기" },
      generate: generateNumberProperty,
      validate: (payload) => JSON.stringify(payload.options.filter((value) => propertyPass(value, payload.rule))) === JSON.stringify(payload.answer),
      enumerate: (payload) => [payload.options.filter(value=>propertyPass(value,payload.rule))],
      renderProblem: renderNumberProperty,
      renderAnswer: (payload) => payload.answer.join(", "),
      concept: { warmup: "첫 번째 조건에 맞지 않는 수를 지워요.", rule: "남은 수에 다음 조건을 차례로 확인해요.", review: "고른 수가 모든 조건에 맞는지 한 번 더 읽어요." }
    }),
    "balance-weight-order": Object.freeze({
      id: "balance-weight-order", label: "과일 저울의 무게 관계", area: "논리와 관계", conceptSession: 1,
      subtype: "두 수평 관계를 이어 기준 과일의 개수로 바꾸기",
      prompt: "다음 양팔저울은 모두 수평입니다. 같은 종류의 과일은 무게가 서로 같을 때, 물음에 답하세요.",
      answerContract: "ordered-list", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "같은 무게, 모두", representations: "과일과 수평 양팔저울", prerequisites: "같은 무게를 가진 과일 묶음으로 바꾸기", reasoningLoad: "두 교환 관계를 이어 혼합 과일의 무게 구하기", responseMode: "딸기 개수 두 가지 쓰기" },
      generate: generateBalanceOrder,
      validate: (payload) => JSON.stringify(enumerateBalanceOrders(payload)) === JSON.stringify([payload.answer]),
      enumerate: enumerateBalanceOrders,
      renderProblem: renderBalanceOrder,
      renderAnswer: (payload) => `(1) ${payload.answer[0]}개 (2) ${payload.answer[1]}개`,
      concept: { warmup: "수평인 두 접시의 무게는 서로 같아요.", rule: "사과를 배로, 배를 딸기로 바꾸어 생각해요.", review: "사과와 배를 모두 포함해서 계산했는지 확인해요." }
    }),
    "inverse-story-problem": Object.freeze({
      id: "inverse-story-problem", label: "거꾸로 푸는 문장제", area: "수와 연산", conceptSession: 1,
      subtype: "변화한 뒤의 수에서 처음 수 또는 빠진 변화량 구하기",
      prompt: "이야기를 읽고 물음에 알맞은 수를 구하세요.", answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "날아가다, 타다, 내리다, 더 가져오다", representations: "짧은 생활 문장", prerequisites: "덧셈과 뺄셈", reasoningLoad: "마지막 상태에서 거꾸로 계산", responseMode: "수 쓰기" },
      generate: generateInverseStory, validate: validateInverseStory, enumerate: (payload) => [storyAnswer(payload)], renderProblem: renderStory, renderAnswer: (payload) => `${payload.answer}`,
      concept: { warmup: "일어난 일을 순서대로 표시해요.", rule: "처음 수를 물으면 마지막 일부터 반대로 계산해요.", review: "찾은 처음 수로 이야기를 다시 계산해요." }
    }),
    "arrow-number-move": Object.freeze({
      id: "arrow-number-move", label: "화살표 수 이동", area: "규칙", conceptSession: 1,
      subtype: "가로 1, 세로 10 변화 규칙으로 시작 또는 끝 수 찾기",
      prompt: "화살표 방향으로 수를 움직일 때 빈칸에 들어갈 수를 구하세요.", answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "오른쪽, 왼쪽, 위, 아래", representations: "수 상자와 화살표", prerequisites: "1과 10만큼 더하고 빼기", reasoningLoad: "여러 이동을 차례대로 적용", responseMode: "빈칸 수 쓰기" },
      generate: generateArrowMove, validate: (payload) => arrowAnswer(payload) === payload.answer, enumerate: (payload) => [arrowAnswer(payload)], renderProblem: renderArrowMove, renderAnswer: (payload) => `${payload.answer}`,
      concept: { warmup: "가로는 1, 세로는 10만큼 움직여요.", rule: "화살표를 한 개씩 따라가며 수를 바꿔요.", review: "반대 방향으로 되돌아가 같은 수가 나오는지 확인해요." }
    }),
    "symbol-equation": Object.freeze({
      id: "symbol-equation", label: "기호가 나타내는 수", area: "수와 연산", conceptSession: 1,
      subtype: "연결된 세 식으로 기호값을 찾아 최종 식 계산",
      prompt: "같은 모양은 같은 수를 나타냅니다. 네모가 나타내는 수를 구하세요.", answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "같은 모양, 같은 수", representations: "기호가 든 덧셈·뺄셈식", prerequisites: "10 안팎의 덧셈과 뺄셈", reasoningLoad: "식을 위에서부터 차례로 해결", responseMode: "한 수 쓰기" },
      generate: generateSymbolEquation, validate: (payload) => JSON.stringify(enumerateSymbolEquation(payload)) === JSON.stringify([payload.answer]), enumerate: enumerateSymbolEquation, renderProblem: renderSymbolEquation, renderAnswer: (payload) => `${payload.answer}`,
      concept: { warmup: "한 가지 모양만 든 식부터 봐요.", rule: "알게 된 모양의 수를 다음 식에 넣어요.", review: "모든 식에 다시 넣어 맞는지 확인해요." }
    }),
    "minimum-sum-pyramid": Object.freeze({
      id: "minimum-sum-pyramid", label: "수 피라미드의 최댓값·최솟값", area: "수와 연산", conceptSession: 1,
      subtype: "카드 배열의 최댓값과 최솟값을 찾은 뒤 합 또는 차 구하기",
      prompt: "카드를 아래 칸에 한 장씩 놓아 꼭대기 수를 가장 작게 만들 때, 꼭대기 수를 구하세요.", answerContract: "single-number", sourceState: "review",
      learnerFit: { learner_stage: LEARNER_STAGE, language: "가장 큰 수, 가장 작은 수, 합, 차", representations: "위쪽 카드와 빈 4층 합 피라미드", prerequisites: "이웃한 두 수 더하기", reasoningLoad: "카드 배열을 비교해 양 극값을 찾고 합 또는 차 계산", responseMode: "최종 계산값 쓰기" },
      generate: generatePyramidMinimum, validate: (payload) => enumeratePyramidMinimum(payload)[0] === payload.answer, enumerate: enumeratePyramidMinimum, renderProblem: renderPyramidMinimum, renderAnswer: (payload) => `${payload.answer}`,
      concept: { warmup: "이웃한 두 수를 더해 위 칸을 만들어요.", rule: "같은 카드라도 놓는 자리에 따라 꼭대기 수가 달라져요.", review: "가능한 배열의 꼭대기 수를 비교해 가장 작은 수를 골라요." }
    })
  });

  const CONCEPT_SESSIONS = Object.freeze([
    Object.freeze({
      id: "concept-1",
      number: 1,
      title: "수 · 규칙 · 순서와 논리",
      typeIds: Object.freeze(["split-merge-chain", "card-sum-count", "animal-race-order", "triangle-number-rule", "total-difference", "family-comparison", "line-position-total", "mountain-digit-count", "apartment-floor-order", "number-property-filter", "balance-weight-order", "inverse-story-problem", "arrow-number-move", "symbol-equation", "minimum-sum-pyramid"])
    }),
    Object.freeze({
      id: "concept-2",
      number: 2,
      title: "도형과 공간",
      typeIds: Object.freeze(["rotated-grid-pair", "cyclic-picture-pattern", "cube-count-fill", "rectangle-count", "four-cell-code"])
    })
  ]);

  const MOCK_BLUEPRINT = Object.freeze([
    "line-position-total", "split-merge-chain", "number-property-filter", "triangle-number-rule", "cyclic-picture-pattern",
    "total-difference", "rotated-grid-pair", "mountain-digit-count", "apartment-floor-order", "balance-weight-order",
    "card-sum-count", "animal-race-order", "arrow-number-move", "symbol-equation", "minimum-sum-pyramid",
    "inverse-story-problem", "family-comparison", "cube-count-fill", "rectangle-count", "four-cell-code"
  ]);

  function questionPrompt(typeId, p) {
    const prompts = {
      "cube-count-fill": "같은 크기의 쌓기나무를 바닥에 빈틈없이 네 기둥으로 쌓았습니다. 각 기둥에는 위아래로 빈 곳이 없고, 뒤에 가려진 쌓기나무도 있습니다. 그림을 보고 다음 두 물음에 각각 답하세요.",
      "rectangle-count": "같은 크기의 정사각형 칸으로 나눈 종이에서 일부 선을 지웠습니다. 그림에 남아 있는 선만 따라 만들 수 있는 도형을 찾으려고 합니다. 다음 두 물음에 각각 답하세요.",
      "four-cell-code": "네 칸에 색을 칠하는 방법을 달리하여 수를 나타냈습니다. 아래 1부터 8까지의 그림에서 같은 수를 나타내는 규칙을 찾아, 다음 두 물음에 각각 답하세요.",
      "line-position-total": p.difficulty === "easy" ? `학생들이 놀이기구를 타려고 한 줄로 서 있습니다. 윤지보다 앞에 있는 학생은 ${p.before}명이고, 윤지보다 뒤에 있는 학생은 ${p.after}명입니다. 이 줄에 서 있는 학생은 모두 몇 명입니까?` : `학생들이 놀이기구를 타려고 한 줄로 서 있습니다. 윤지는 앞에서 ${p.before + 1}번째이고 뒤에서 ${p.after + 1}번째입니다. 같은 줄에서 민수는 뒤에서 ${p.otherBackRank}번째에 서 있습니다. 민수보다 앞에 서 있는 학생은 모두 몇 명입니까?`,
      "split-merge-chain": "다음은 두 수를 가르거나 모으는 방법을 나타낸 그림입니다. 연결된 두 수를 모으면 한 수가 됩니다. 각 그림의 빈칸에 알맞은 수를 모두 써넣으세요.",
      "card-sum-count": `다음 숫자 카드 중 몇 장을 골라 카드에 적힌 수를 더하려고 합니다. 합이 ${p.target}이 되는 방법은 모두 몇 가지입니까? 단, 각 카드는 한 번만 쓰며, 고른 수들이 같고 순서만 바뀐 경우는 같은 방법으로 셉니다.`,
      "total-difference": `사탕 ${p.total}개를 두 접시에 나누어 담으려고 합니다. 한 접시에 담은 사탕이 다른 접시보다 ${p.difference}개 더 많도록 남김없이 담을 때, 각 접시에는 사탕을 몇 개씩 담아야 합니까?`,
      "family-comparison": "엄마, 아빠, 나, 동생이 가진 사탕의 수를 비교하였더니 다음과 같았습니다. 아래 설명을 모두 읽고, 아빠가 나보다 사탕을 몇 개 더 많이 가지고 있는지 구하세요.",
      "animal-race-order": "동물들이 달리기 경주를 하고 있습니다. 같은 등수인 동물은 없으며, 달리는 순서는 아래 설명을 모두 만족합니다. 1등부터 마지막 등수까지 동물의 이름을 차례대로 써넣으세요.",
      "triangle-number-rule": "다음 삼각형의 꼭짓점에 있는 수와 가운데 수 사이에는 모두 같은 규칙이 있습니다. 빈칸이 없는 그림에서 규칙을 찾아, 마지막 삼각형의 빈칸에 들어갈 수를 구하세요.",
      "rotated-grid-pair": "정사각형 종이를 같은 크기의 아홉 칸으로 나눈 뒤 일부 칸에 색을 칠하였습니다. 종이를 돌리기만 하였을 때 색칠한 칸의 위치가 완전히 같아지는 두 그림의 번호를 쓰세요. 단, 종이를 뒤집을 수는 없습니다.",
      "mountain-digit-count": `그림과 같은 규칙으로 아래에 한 줄씩 늘려 가며 수를 씁니다. ${p.figure}번째 모양 전체에서 숫자 ${p.digit}은 모두 몇 번 나타나는지 구하세요.`,
      "apartment-floor-order": "다섯 친구가 1층부터 5층까지 한 층에 한 명씩 살고 있습니다. 아래 설명을 모두 만족하도록 각 친구가 사는 층을 찾아, 빈칸에 이름을 써넣으세요.",
      "cyclic-picture-pattern": "다음 그림은 모양과 색에 일정한 규칙이 있도록 늘어놓은 것입니다. 같은 규칙으로 계속 늘어놓을 때, 다음 두 물음에 각각 답하세요.",
      "number-property-filter": "아래 수 카드 중에서 상자에 적힌 조건을 모두 만족하는 수를 찾으려고 합니다. 조건을 하나라도 만족하지 않으면 고를 수 없습니다. 알맞은 수를 모두 찾아 표시하세요.",
      "arrow-number-move": "상자에서 출발하여 화살표를 왼쪽부터 차례로 따라갑니다. →는 1을 더하고, ←는 1을 빼며, ↓는 10을 더하고, ↑는 10을 뺍니다. 출발하거나 도착하는 상자의 빈칸에 알맞은 수를 쓰세요.",
      "symbol-equation": "다음 식에서 같은 모양은 항상 같은 수를 나타냅니다. 주어진 식을 모두 만족하도록 각 모양의 수를 생각해 보고, 마지막 식의 네모가 나타내는 수를 구하세요.",
      "inverse-story-problem": "다음은 시간이 지나면서 수가 달라진 이야기입니다. 일어난 일과 마지막에 남은 수를 살펴보고, 물음에 알맞은 수를 구하세요.",
      "minimum-sum-pyramid": `위의 숫자 카드 네 장을 아래층에 한 장씩 놓고, 이웃한 아래 두 수를 더하여 바로 위 칸을 채웁니다. 카드의 자리를 바꾸어 만들 수 있는 꼭대기 수 중 가장 큰 수와 가장 작은 수의 ${p.operation === "sum" ? "합을" : "차를"} 구하세요.`
    };
    return prompts[typeId] || TYPES[typeId].prompt;
  }

  function createQuestion(typeId, difficulty, seed) {
    const type = TYPES[typeId];
    if (!type) throw new Error(`등록되지 않은 6세 챌린지 유형: ${typeId}`);
    const payload = type.generate(difficulty, seed);
    const candidates = type.enumerate(payload);
    if (!type.validate(payload) || candidates.length !== 1) throw new Error(`${typeId}: 단일정답 검증 실패`);
    return {
      id: `${typeId}:${difficulty}:${Number(seed) || 1}`,
      typeId,
      typeLabel: type.label,
      area: type.area,
      subtype: type.subtype,
      difficulty,
      difficultyLabel: DIFFICULTY_LABELS[difficulty] || DIFFICULTY_LABELS.same,
      seed: Number(seed) || 1,
      prompt: questionPrompt(typeId, payload),
      payload,
      answer: payload.answer,
      answerHtml: type.renderAnswer(payload),
      problemHtml: type.renderProblem(payload),
      answerCandidates: candidates,
      learnerFit: type.learnerFit
    };
  }

  function createConceptLesson(typeId, seed) {
    const type = TYPES[typeId];
    if (!type) throw new Error(`등록되지 않은 6세 챌린지 유형: ${typeId}`);
    const base = Number(seed) || 1;
    return {
      typeId,
      label: type.label,
      area: type.area,
      warmup: createQuestion(typeId, "easy", base),
      example: createQuestion(typeId, "same", base + 101),
      practice: createQuestion(typeId, "same", base + 202),
      review: createQuestion(typeId, "hard", base + 303),
      copy: type.concept
    };
  }

  function createConceptSession(sessionNumber, seed) {
    const session = CONCEPT_SESSIONS.find((item) => item.number === Number(sessionNumber));
    if (!session) throw new Error(`등록되지 않은 개념 회차: ${sessionNumber}`);
    const base = Number(seed) || 1;
    const available = session.typeIds.filter((typeId) => TYPES[typeId]);
    if (!available.length) throw new Error(`${session.id}: 등록된 유형이 없습니다.`);
    const slots = [
      { key: "warmup", difficulty: "easy", offset: 11 },
      { key: "example", difficulty: "same", offset: 101 },
      { key: "practice", difficulty: "same", offset: 211 },
      { key: "review", difficulty: "hard", offset: 307 }
    ];
    const questions = {};
    slots.forEach((slot, index) => {
      const typeId = available[index % available.length];
      questions[slot.key] = createQuestion(typeId, slot.difficulty, base + slot.offset + index * 977);
    });
    return { ...session, questions };
  }

  function createMockExamBase(round, seed) {
    const normalizedRound = Number(round);
    if (![1, 2].includes(normalizedRound)) throw new Error(`모의고사는 1회 또는 2회만 만들 수 있습니다: ${round}`);
    const base = (Number(seed) || 1) + normalizedRound * 100003;
    const questions = MOCK_BLUEPRINT.map((typeId, index) => {
      const type = TYPES[typeId];
      const position = index + 1;
      if (type.maxMockPosition && position > type.maxMockPosition) throw new Error(`${typeId}: ${position}번 배치 제한 위반`);
      const difficulty = position <= 15 ? "same" : "hard";
      const first = createQuestion(typeId,difficulty,base+position*7919);
      if (["triangle-number-rule","rotated-grid-pair","arrow-number-move"].includes(typeId)) {
        let second=createQuestion(typeId,difficulty,base+position*7919+3511);
        for(let retry=1;retry<=20&&JSON.stringify(first.answer)===JSON.stringify(second.answer);retry++)second=createQuestion(typeId,difficulty,base+position*7919+3511+retry*97);
        const answers=[first.answer,second.answer];
        return {...first,number:position,subquestions:[first,second],answer:answers,answerCandidates:[answers],answerHtml:`(1) ${first.answerHtml}  (2) ${second.answerHtml}`,problemHtml:`<div class="paired-problems">${[first,second].map((q,i)=>`<div class="paired-part"><span>(${i+1})</span>${q.problemHtml}</div>`).join('')}</div>`};
      }
      return { ...first, number: position };
    });
    return {
      id: `challenge-mock-${normalizedRound}`,
      round: normalizedRound,
      title: "6세 챌린지 시험",
      status: "review",
      questionCount: questions.length,
      layout: { paper: "A4 portrait", side: "single", questionsPerPage: 3, coverPage: 1, blankPage: 2, watermarkLines: 3 },
      questions
    };
  }

  function createMockExam(round, seed) {
    if([3,4].includes(Number(round))){
      const more=global.HFChallengeMore||(typeof require==='function'?require('./exam-more.js'):null);
      if(!more)throw new Error('3·4회 별도 구성을 불러오지 못했습니다.');
      return more.get(Number(round));
    }
    if(![1,2].includes(Number(round)))throw new Error('지원하지 않는 회차');
    const editions = global.HFChallengeEditions || (typeof require === 'function' ? require('./exam-editions.js') : null);
    if (!editions) throw new Error('회차별 출제 구성이 로드되지 않았습니다. 시험지를 생성하지 않습니다.');
    const priority = global.HFChallengePriority || (typeof require === 'function' ? require('./exam-priority.js') : null);
    if (!priority) throw new Error('우선 보완 문항을 불러오지 못했습니다.');
    const exam = Number(round) === 2 ? editions.makeRound2() : editions.reviseRound1(createMockExamBase(round, seed));
    return priority.apply(exam);
  }

  global.HFChallengeBank = Object.freeze({
    version: VERSION,
    learnerStage: LEARNER_STAGE,
    difficulties: DIFFICULTIES.slice(),
    difficultyLabels: { ...DIFFICULTY_LABELS },
    types: TYPES,
    conceptSessions: CONCEPT_SESSIONS,
    listTypes: () => Object.values(TYPES),
    createQuestion,
    createConceptLesson,
    createConceptSession,
    createMockExam,
    enumerateNumberPanelAnswers,
    enumerateRaceOrders,
    enumerateCardSums,
    enumerateTotalDifference,
    enumerateRotationPairs,
    mountainDigitCount
  });
})(typeof window !== "undefined" ? window : globalThis);
