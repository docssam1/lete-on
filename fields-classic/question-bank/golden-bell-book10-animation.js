import { book10Markup } from "./book10-renderers.js?v=20260904c";

const HOLD_MS = 4000;
const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const integer = (value) => Number.isSafeInteger(value);
const positive = (value) => integer(value) && value > 0;
const validCounts = (counts) => Array.isArray(counts) && counts.length === 2 && counts.every(positive);
const cloneCounts = (counts) => Array.isArray(counts) ? counts.map(Number) : [];
const sameCounts = (left, right) => left.map((value, index) => Math.min(value, right[index]));
const sum = (values) => values.reduce((total, value) => total + value, 0);
const inRange = (experience, step) => Math.max(0, Math.min(Number(step) || 0, experience.beats.length - 1));

function sourceShape(item, subtype) {
  const visual = item?.visual;
  if (!item || typeof item.id !== "string" || !item.id || typeof item.prompt !== "string") return null;
  if (!visual || visual.kind !== "book10" || visual.subtype !== subtype) return null;
  return visual;
}

function sourceSymbols(visual) {
  if (!Array.isArray(visual.symbols) || visual.symbols.length !== 2) return null;
  const symbols = visual.symbols.map((symbol) => ({
    label: String(symbol?.label ?? "").trim(),
    token: String(symbol?.token ?? "").trim(),
    className: String(symbol?.className ?? "").trim()
  }));
  return symbols.every((symbol) => symbol.label && symbol.token) ? symbols : null;
}

function sourceRows(visual) {
  if (!Array.isArray(visual.equations) || visual.equations.length !== 2) return null;
  const rows = visual.equations.map((row) => ({ terms: cloneCounts(row?.terms || []), total: Number(row?.total) }));
  return rows.every((row) => validCounts(row.terms) && positive(row.total)) ? rows : null;
}

function solvesRows(rows, values) {
  return rows.every((row) => sum(row.terms.map((count, index) => count * values[index])) === row.total);
}

function symmetricModel(item) {
  const visual = sourceShape(item, "quantity-equations");
  const symbols = visual && sourceSymbols(visual);
  const rows = visual && sourceRows(visual);
  if (!visual || !symbols || !rows) return null;
  const [first, second] = rows;
  const [a, b] = first.terms;
  if (a >= b || second.terms[0] !== b || second.terms[1] !== a) return null;
  const pairCoefficient = a + b;
  const combinedTotal = first.total + second.total;
  if (combinedTotal % pairCoefficient) return null;
  const pairValue = combinedTotal / pairCoefficient;
  const numerator = first.total - a * pairValue;
  const denominator = b - a;
  if (numerator % denominator) return null;
  const secondValue = numerator / denominator;
  const firstValue = pairValue - secondValue;
  const values = [firstValue, secondValue];
  if (!values.every(positive) || !solvesRows(rows, values)) return null;
  return { visual, symbols, rows, values, a, b, pairCoefficient, combinedTotal, pairValue };
}

function eliminationModel(item) {
  const visual = sourceShape(item, "quantity-equations");
  const symbols = visual && sourceSymbols(visual);
  const rows = visual && sourceRows(visual);
  if (!visual || !symbols || !rows) return null;
  const orientations = [[0, 1], [1, 0]];
  for (const [largerIndex, smallerIndex] of orientations) {
    const larger = rows[largerIndex];
    const smaller = rows[smallerIndex];
    const delta = larger.terms.map((count, index) => count - smaller.terms[index]);
    const isolatedIndex = delta.findIndex((count) => count > 0);
    if (isolatedIndex < 0 || delta.filter((count) => count > 0).length !== 1 || delta.some((count) => count < 0)) continue;
    const deltaTotal = larger.total - smaller.total;
    if (!positive(deltaTotal) || deltaTotal % delta[isolatedIndex]) continue;
    const isolatedValue = deltaTotal / delta[isolatedIndex];
    const otherIndex = isolatedIndex === 0 ? 1 : 0;
    const solveRow = smaller.terms[otherIndex] ? smaller : larger;
    const remaining = solveRow.total - solveRow.terms[isolatedIndex] * isolatedValue;
    if (remaining % solveRow.terms[otherIndex]) continue;
    const otherValue = remaining / solveRow.terms[otherIndex];
    const values = isolatedIndex === 0 ? [isolatedValue, otherValue] : [otherValue, isolatedValue];
    const cancellation = sameCounts(larger.terms, smaller.terms);
    if (!values.every(positive) || !cancellation.some(positive) || !solvesRows(rows, values)) continue;
    return { visual, symbols, rows, values, largerIndex, smallerIndex, delta, deltaTotal, cancellation, isolatedIndex, otherIndex, solveRow, otherCoefficient: solveRow.terms[otherIndex], otherRemainder: remaining };
  }
  return null;
}

function requestedZoneIndex(item, zones) {
  const partMatches = (item.parts || []).flatMap((part) => {
    const label = String(part?.label ?? "").trim();
    return zones.map((zone, index) => label.includes(zone.label) ? index : -1).filter((index) => index >= 0);
  });
  const structured = [...new Set(partMatches)];
  if (structured.length === 1) return structured[0];
  const prompt = item.prompt;
  const request = /(구하|찾|알아내|계산)/u;
  return zones.reduce((found, zone, index) => {
    const marker = `${zone.label}에`;
    const at = prompt.lastIndexOf(marker);
    return at >= 0 && request.test(prompt.slice(at)) && at > found.at ? { at, index } : found;
  }, { at: -1, index: -1 }).index;
}

function targetModel(item) {
  const visual = sourceShape(item, "target-score");
  if (!visual || !Array.isArray(visual.zones) || visual.zones.length !== 2 || !Array.isArray(visual.attempts) || visual.attempts.length !== 2) return null;
  const zones = visual.zones.map((zone) => ({ label: String(zone?.label ?? "").trim() }));
  const attempts = visual.attempts.map((attempt) => ({ label: String(attempt?.label ?? "").trim(), hits: cloneCounts(attempt?.hits || []), total: Number(attempt?.total) }));
  if (!zones.every((zone) => zone.label) || !attempts.every((attempt) => attempt.label && validCounts(attempt.hits) && positive(attempt.total))) return null;
  const requestedIndex = requestedZoneIndex(item, zones);
  for (const [largerIndex, smallerIndex] of [[0, 1], [1, 0]]) {
    const larger = attempts[largerIndex];
    const smaller = attempts[smallerIndex];
    const delta = larger.hits.map((count, index) => count - smaller.hits[index]);
    const isolatedIndex = delta.findIndex((count) => count > 0);
    if (isolatedIndex < 0 || delta.filter((count) => count > 0).length !== 1 || delta.some((count) => count < 0)) continue;
    const deltaTotal = larger.total - smaller.total;
    if (!positive(deltaTotal) || deltaTotal % delta[isolatedIndex]) continue;
    const isolatedValue = deltaTotal / delta[isolatedIndex];
    const otherIndex = isolatedIndex === 0 ? 1 : 0;
    if (requestedIndex !== otherIndex || !smaller.hits[otherIndex]) continue;
    const remaining = smaller.total - smaller.hits[isolatedIndex] * isolatedValue;
    if (remaining % smaller.hits[otherIndex]) continue;
    const otherValue = remaining / smaller.hits[otherIndex];
    const values = isolatedIndex === 0 ? [isolatedValue, otherValue] : [otherValue, isolatedValue];
    const cancellation = sameCounts(larger.hits, smaller.hits);
    const verifies = attempts.every((attempt) => sum(attempt.hits.map((count, index) => count * values[index])) === attempt.total);
    if (!values.every(positive) || !cancellation.some(positive) || !verifies) continue;
    return { visual, zones, attempts, values, largerIndex, smallerIndex, delta, deltaTotal, cancellation, isolatedIndex, otherIndex, requestedIndex, requestedCoefficient: smaller.hits[requestedIndex], requestedRemainder: remaining };
  }
  return null;
}

function beat(id, phase, caption, data = {}) {
  return { id, phase, caption, durationMs: HOLD_MS, ...data };
}

function symmetricExperience(item, model) {
  const beats = [
    beat("source", "source", "두 원래 저울식을 그대로 봅니다."),
    beat("combine", "combine", "두 식을 한 줄씩 더합니다.", { combinedTotal: model.combinedTotal }),
    beat("arrange", "arrange", "두 모양을 하나씩 짝지어요.", { pairCoefficient: model.pairCoefficient }),
    beat("divide", "divide", "같은 묶음 수로 나누어 두 모양의 합을 찾습니다.", { pairValue: model.pairValue }),
    beat("derive-second-relation", "derive-second-relation", "첫 식에 두 모양의 합을 넣어 남은 식을 만듭니다.", { valueIndex: 1 }),
    ...(Math.abs(model.b - model.a) > 1 ? [beat("derive-second-divide", "derive-second-divide", "남은 같은 모양의 개수로 나눕니다.", { valueIndex: 1, value: model.values[1] })] : []),
    beat("derive-first", "derive-first", "두 모양의 합에서 남은 모양을 찾습니다.", { valueIndex: 0, value: model.values[0] }),
    beat("verify-first", "verify-first", "첫 번째 원래 식에 다시 넣어 확인합니다."),
    beat("verify-second", "verify-second", "두 번째 원래 식에 다시 넣어 확인합니다.")
  ];
  return experience(item, "book10-sum-difference-combine-divide", model, beats);
}

function eliminationExperience(item, model) {
  const beats = [
    beat("source", "source", "두 원래 저울식을 그대로 봅니다."),
    beat("identify-common", "identify-common", "양쪽 식에 함께 있는 같은 모양을 찾습니다.", { cancellation: model.cancellation }),
    beat("cancel", "cancel", "같은 개수만큼 두 식에서 지웁니다.", { cancellation: model.cancellation }),
    beat("relation", "relation", "남은 모양과 무게의 차를 한 식으로 씁니다.", { delta: model.delta, deltaTotal: model.deltaTotal }),
    beat("divide", "divide", "남은 모양의 개수로 나눕니다.", { valueIndex: model.isolatedIndex, value: model.values[model.isolatedIndex] }),
    beat("substitute-remainder", "substitute-remainder", "찾은 값을 원래 식에 넣어 다른 모양의 남은 무게를 찾습니다.", { valueIndex: model.otherIndex }),
    ...(model.otherCoefficient > 1 ? [beat("substitute-divide", "substitute-divide", "남은 무게를 그 모양의 개수로 나눕니다.", { valueIndex: model.otherIndex, value: model.values[model.otherIndex] })] : []),
    beat("verify-first", "verify-first", "첫 번째 원래 식에 다시 넣어 확인합니다."),
    beat("verify-second", "verify-second", "두 번째 원래 식에 다시 넣어 확인합니다.")
  ];
  return experience(item, "book10-common-term-elimination", model, beats);
}

function targetExperience(item, model) {
  const beats = [
    beat("source", "source", "과녁 구역과 두 번의 기록을 그대로 봅니다."),
    beat("match-common", "match-common", "두 기록에 함께 있는 맞힌 횟수를 맞춥니다.", { cancellation: model.cancellation }),
    beat("remove-common", "remove-common", "같은 맞힌 횟수를 두 기록에서 지웁니다.", { cancellation: model.cancellation }),
    beat("score-difference", "score-difference", "두 기록의 점수 차를 계산합니다.", { deltaTotal: model.deltaTotal }),
    beat("isolate", "isolate", "남은 한 구역의 식을 만듭니다.", { valueIndex: model.isolatedIndex }),
    ...(model.delta[model.isolatedIndex] > 1 ? [beat("isolate-divide", "isolate-divide", "남은 맞힌 횟수로 나눕니다.", { valueIndex: model.isolatedIndex, value: model.values[model.isolatedIndex] })] : []),
    beat("find-requested-remainder", "find-requested-remainder", "원래 기록에 넣어 물어본 구역의 남은 점수를 찾습니다.", { valueIndex: model.requestedIndex }),
    ...(model.requestedCoefficient > 1 ? [beat("find-requested-divide", "find-requested-divide", "그 구역에 맞힌 횟수로 나눕니다.", { valueIndex: model.requestedIndex, value: model.values[model.requestedIndex] })] : []),
    beat("verify-first", "verify-first", "첫 번째 기록에 다시 넣어 확인합니다."),
    beat("verify-second", "verify-second", "두 번째 기록에 다시 넣어 확인합니다.")
  ];
  return experience(item, "book10-target-score-difference", model, beats);
}

function experience(item, family, model, beats) {
  return {
    kind: "source-animation",
    family,
    sourceItemId: item.id,
    title: item.typeLabel || "원래 조건으로 풀이하기",
    problem: item.prompt,
    visual: item.visual,
    beats,
    printSteps: beats.map((_, index) => index),
    model
  };
}

export function book10SourceAnimation(item) {
  if (item?.structureKey === "sum-difference-combine-divide") {
    const model = symmetricModel(item);
    return model ? symmetricExperience(item, model) : null;
  }
  if (item?.structureKey === "common-term-elimination") {
    const model = eliminationModel(item);
    return model ? eliminationExperience(item, model) : null;
  }
  if (item?.structureKey === "target-score-difference") {
    const model = targetModel(item);
    return model ? targetExperience(item, model) : null;
  }
  return null;
}

function symbol(model, index, extra = "") {
  const item = model.symbols[index];
  return `<span class="source-animation-b10__symbol ${esc(item.className)} ${extra}" aria-label="${esc(item.label)}"><b>${esc(item.token)}</b><small>${esc(item.label)}</small></span>`;
}

function quantityTerms(model, counts, { highlighted = [], cancelled = [], animate = false, known = [] } = {}) {
  return counts.map((count, index) => `<span class="source-animation-b10__term">${Array.from({ length: count }, (_, tokenIndex) => {
    const state = tokenIndex < (cancelled[index] || 0) ? "is-cancelled" : tokenIndex < (highlighted[index] || 0) ? "is-matched" : "";
    return symbol(model, index, `${state} ${known.includes(index) ? "is-known" : ""} ${animate ? "is-moving" : ""}`);
  }).join("")}</span>`).join('<i class="source-animation-b10__plus" aria-hidden="true">+</i>');
}

function quantityRow(model, row, options = {}) {
  return `<div class="source-animation-b10__equation">${quantityTerms(model, row.terms, options)}<i class="source-animation-b10__equals" aria-hidden="true">=</i><strong>${row.total}${model.visual.unit ? ` ${esc(model.visual.unit)}` : ""}</strong></div>`;
}

function quantityVerify(model, rowIndex) {
  const row = model.rows[rowIndex];
  const calculation = row.terms.map((count, index) => `${count} × ${model.values[index]}`).join(" + ");
  return `<div class="source-animation-b10__calculation"><strong>${calculation} = ${row.total}${model.visual.unit ? ` ${esc(model.visual.unit)}` : ""}</strong></div>`;
}

function symmetricCalculation(model, phase, animate) {
  const [first, second] = model.rows;
  if (phase === "source") return `<div class="source-animation-b10__work">${quantityRow(model, first)}${quantityRow(model, second)}</div>`;
  if (phase === "combine") return `<div class="source-animation-b10__work is-combine">${quantityRow(model, first, { animate })}<i class="source-animation-b10__combine-sign">+</i>${quantityRow(model, second, { animate })}<div class="source-animation-b10__calculation"><strong>${first.total} + ${second.total} = ${model.combinedTotal}${model.visual.unit ? ` ${esc(model.visual.unit)}` : ""}</strong></div></div>`;
  if (phase === "arrange") return `<div class="source-animation-b10__groups">${Array.from({ length: model.pairCoefficient }, () => `<div>${symbol(model, 0, animate ? "is-moving" : "")}${symbol(model, 1, animate ? "is-moving" : "")}</div>`).join("")}</div>`;
  if (phase === "divide") return `<div class="source-animation-b10__calculation"><strong>${model.combinedTotal} ÷ ${model.pairCoefficient} = ${model.pairValue}</strong><span>${esc(model.symbols[0].label)} + ${esc(model.symbols[1].label)}</span></div>`;
  if (phase === "derive-second-relation") return `<div class="source-animation-b10__calculation"><strong>${first.total} - ${model.a} × ${model.pairValue} = ${(model.b - model.a) * model.values[1]}</strong><span>${model.b - model.a} × ${esc(model.symbols[1].token)} = ${(model.b - model.a) * model.values[1]}${Math.abs(model.b - model.a) === 1 ? ` , ${esc(model.symbols[1].token)} = ${model.values[1]}` : ""}</span></div>`;
  if (phase === "derive-second-divide") return `<div class="source-animation-b10__calculation"><strong>${(model.b - model.a) * model.values[1]} ÷ ${model.b - model.a} = ${model.values[1]}</strong><span>${esc(model.symbols[1].token)} = ${model.values[1]}</span></div>`;
  if (phase === "derive-first") return `<div class="source-animation-b10__calculation"><strong>${model.pairValue} - ${model.values[1]} = ${model.values[0]}</strong><span>${esc(model.symbols[0].token)} = ${model.values[0]}</span></div>`;
  return quantityVerify(model, phase === "verify-first" ? 0 : 1);
}

function eliminationCalculation(model, phase, animate) {
  if (phase === "source") return `<div class="source-animation-b10__work">${model.rows.map((row) => quantityRow(model, row)).join("")}</div>`;
  if (phase === "identify-common" || phase === "cancel") {
    const state = phase === "cancel" ? (animate ? "has-cancellation is-animated" : "has-cancellation") : "is-matching";
    const options = phase === "cancel" ? { cancelled: model.cancellation, animate } : { highlighted: model.cancellation };
    return `<div class="source-animation-b10__work ${state}">${model.rows.map((row) => quantityRow(model, row, options)).join("")}</div>`;
  }
  if (phase === "relation") return `<div class="source-animation-b10__calculation"><strong>${model.delta[model.isolatedIndex]} × ${esc(model.symbols[model.isolatedIndex].token)} = ${model.deltaTotal}${model.visual.unit ? ` ${esc(model.visual.unit)}` : ""}</strong></div>`;
  if (phase === "divide") return `<div class="source-animation-b10__calculation"><strong>${model.deltaTotal} ÷ ${model.delta[model.isolatedIndex]} = ${model.values[model.isolatedIndex]}</strong><span>${esc(model.symbols[model.isolatedIndex].label)} = ${model.values[model.isolatedIndex]}</span></div>`;
  if (phase === "substitute-remainder") {
    const row = model.rows[model.smallerIndex];
    return `<div class="source-animation-b10__calculation"><strong>${row.total} - ${row.terms[model.isolatedIndex]} × ${model.values[model.isolatedIndex]} = ${model.otherRemainder}</strong><span>${model.otherCoefficient} × ${esc(model.symbols[model.otherIndex].label)} = ${model.otherRemainder}${model.otherCoefficient === 1 ? ` , ${esc(model.symbols[model.otherIndex].label)} = ${model.values[model.otherIndex]}` : ""}</span></div>`;
  }
  if (phase === "substitute-divide") return `<div class="source-animation-b10__calculation"><strong>${model.otherRemainder} ÷ ${model.otherCoefficient} = ${model.values[model.otherIndex]}</strong><span>${esc(model.symbols[model.otherIndex].label)} = ${model.values[model.otherIndex]}</span></div>`;
  return quantityVerify(model, phase === "verify-first" ? 0 : 1);
}

function targetHits(model, attempt, { highlighted = [], cancelled = [], animate = false } = {}) {
  return `<div class="source-animation-b10__record"><b>${esc(attempt.label)}</b><span>${attempt.hits.map((count, index) => Array.from({ length: count }, (_, hitIndex) => {
    const state = hitIndex < (cancelled[index] || 0) ? "is-cancelled" : hitIndex < (highlighted[index] || 0) ? "is-matched" : "";
    return `<i class="source-animation-b10__hit ${state} ${animate ? "is-moving" : ""}">${esc(model.zones[index].label)}</i>`;
  }).join("")).join("")}</span><strong>= ${attempt.total}</strong></div>`;
}

function targetVerify(model, attemptIndex) {
  const attempt = model.attempts[attemptIndex];
  return `<div class="source-animation-b10__calculation"><strong>${attempt.hits.map((count, index) => `${count} × ${model.values[index]}`).join(" + ")} = ${attempt.total}</strong></div>`;
}

function targetCalculation(model, phase, animate) {
  if (phase === "source") return `<div class="source-animation-b10__records">${model.attempts.map((attempt) => targetHits(model, attempt)).join("")}</div>`;
  if (phase === "match-common" || phase === "remove-common") {
    const state = phase === "remove-common" ? (animate ? "has-cancellation is-animated" : "has-cancellation") : "is-matching";
    const options = phase === "remove-common" ? { cancelled: model.cancellation, animate } : { highlighted: model.cancellation };
    return `<div class="source-animation-b10__records ${state}">${model.attempts.map((attempt) => targetHits(model, attempt, options)).join("")}</div>`;
  }
  if (phase === "score-difference") return `<div class="source-animation-b10__calculation"><strong>${model.attempts[model.largerIndex].total} - ${model.attempts[model.smallerIndex].total} = ${model.deltaTotal}</strong></div>`;
  if (phase === "isolate") return `<div class="source-animation-b10__calculation"><strong>${model.delta[model.isolatedIndex]} × ${esc(model.zones[model.isolatedIndex].label)} = ${model.deltaTotal}</strong>${model.delta[model.isolatedIndex] === 1 ? `<span>${esc(model.zones[model.isolatedIndex].label)} = ${model.values[model.isolatedIndex]}</span>` : ""}</div>`;
  if (phase === "isolate-divide") return `<div class="source-animation-b10__calculation"><strong>${model.deltaTotal} ÷ ${model.delta[model.isolatedIndex]} = ${model.values[model.isolatedIndex]}</strong><span>${esc(model.zones[model.isolatedIndex].label)} = ${model.values[model.isolatedIndex]}</span></div>`;
  if (phase === "find-requested-remainder") {
    const attempt = model.attempts[model.smallerIndex];
    return `<div class="source-animation-b10__calculation"><strong>${attempt.total} - ${attempt.hits[model.isolatedIndex]} × ${model.values[model.isolatedIndex]} = ${model.requestedRemainder}</strong><span>${model.requestedCoefficient} × ${esc(model.zones[model.requestedIndex].label)} = ${model.requestedRemainder}${model.requestedCoefficient === 1 ? ` , ${esc(model.zones[model.requestedIndex].label)} = ${model.values[model.requestedIndex]}` : ""}</span></div>`;
  }
  if (phase === "find-requested-divide") return `<div class="source-animation-b10__calculation"><strong>${model.requestedRemainder} ÷ ${model.requestedCoefficient} = ${model.values[model.requestedIndex]}</strong><span>${esc(model.zones[model.requestedIndex].label)} = ${model.values[model.requestedIndex]}</span></div>`;
  return targetVerify(model, phase === "verify-first" ? 0 : 1);
}

function conditionMarkup(experience, step) {
  let conditions = book10Markup(experience.visual);
  if (experience.family === "book10-sum-difference-combine-divide") {
    const reached = (phase) => {
      const index = experience.beats.findIndex((frame) => frame.phase === phase);
      return index >= 0 && step >= index;
    };
    const model = experience.model;
    const secondPhase = model.b - model.a > 1 ? "derive-second-divide" : "derive-second-relation";
    const targets = [
      { terms: [1, 1], total: reached("divide") ? model.pairValue : "?" },
      { terms: [1, 0], total: reached("derive-first") ? model.values[0] : "?" },
      { terms: [0, 1], total: reached(secondPhase) ? model.values[1] : "?" }
    ].map((row) => book10Markup({
      ...experience.visual,
      symbols: experience.visual.symbols.filter((_, index) => row.terms[index] > 0),
      equations: [{ terms: row.terms.filter((count) => count > 0), total: row.total }]
    })).join("");
    conditions = `<div class="source-animation-b10__source-pair"><div>${conditions}</div><div class="source-animation-b10__targets" aria-label="구할 저울의 무게">${targets}</div></div>`;
  }
  return `<div class="source-animation-b10__conditions" data-source-item-id="${esc(experience.sourceItemId)}">${conditions}</div>`;
}

export function renderBook10SourceFrame(experience, step, { animate = false } = {}) {
  if (!experience || experience.kind !== "source-animation" || !experience.model || !Array.isArray(experience.beats) || !experience.beats.length) return "";
  const safeStep = inRange(experience, step);
  const current = experience.beats[safeStep];
  const model = experience.model;
  let calculation = "";
  if (experience.family === "book10-sum-difference-combine-divide") calculation = symmetricCalculation(model, current.phase, animate);
  if (experience.family === "book10-common-term-elimination") calculation = eliminationCalculation(model, current.phase, animate);
  if (experience.family === "book10-target-score-difference") calculation = targetCalculation(model, current.phase, animate);
  return `<div class="book10-visual source-animation-b10 source-animation-b10--${esc(experience.family)}" data-source-item-id="${esc(experience.sourceItemId)}" data-source-animation-step="${safeStep}" data-source-animation-phase="${esc(current.phase)}">${conditionMarkup(experience, safeStep)}<div class="source-animation-b10__calculation-area">${calculation}</div></div>`;
}
