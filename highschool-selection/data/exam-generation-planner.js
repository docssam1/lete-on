(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_EXAM_GENERATION_PLANNER = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const DIFFICULTIES = Object.freeze(["lowered", "standard", "raised"]);
  const RESPONSE_GROUPS = Object.freeze(["objective", "subjective"]);
  const OBJECTIVE_TYPES = new Set(["single_choice", "multi_choice", "ox", "figure_select"]);
  const SUBJECTIVE_TYPES = new Set(["input", "multi_input", "ordered_list", "unordered_set", "construction", "self_check"]);

  function invariant(condition, message) { if (!condition) throw new TypeError(message); }
  function clean(value) { return String(value == null ? "" : value).trim(); }
  function token(value, field) {
    const result = clean(value);
    invariant(result && result.length <= 180 && /^[A-Za-z0-9._:-]+$/.test(result), `${field} is invalid`);
    return result;
  }
  function curriculumPath(value, field) {
    const result = clean(value).replace(/\/+$/, "");
    invariant(result && result.length <= 320 && /^[A-Za-z0-9._:-]+(?:\/[A-Za-z0-9._:-]+)*$/.test(result), `${field} is invalid`);
    return result;
  }
  function positiveInteger(value, field, maximum) {
    const result = Number(value);
    invariant(Number.isSafeInteger(result) && result > 0 && result <= maximum, `${field} is invalid`);
    return result;
  }
  function uint32(value, field) {
    const result = Number(value);
    invariant(Number.isSafeInteger(result) && result >= 0 && result <= 0xffffffff, `${field} is invalid`);
    return result;
  }
  function exactKeys(value, allowed, field) {
    invariant(value && typeof value === "object" && !Array.isArray(value), `${field} must be an object`);
    Object.keys(value).forEach(function (key) { invariant(allowed.has(key), `${field}.${key} is not allowed`); });
  }
  function fnv1a32(text) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash >>> 0;
  }

  function responseGroup(inputType) {
    const value = clean(inputType);
    if (OBJECTIVE_TYPES.has(value)) return "objective";
    if (SUBJECTIVE_TYPES.has(value)) return "subjective";
    throw new TypeError("candidate.inputType is not supported");
  }

  function normalizeWeights(input, labels, field) {
    exactKeys(input, new Set(labels), field);
    const result = {};
    let total = 0;
    labels.forEach(function (label) {
      const value = Number(input[label]);
      invariant(Number.isFinite(value) && value >= 0 && value <= 1000, `${field}.${label} is invalid`);
      result[label] = value;
      total += value;
    });
    invariant(total > 0, `${field} must contain a positive weight`);
    return Object.freeze(result);
  }

  function allocate(total, weights, labels) {
    const weightTotal = labels.reduce(function (sum, label) { return sum + weights[label]; }, 0);
    const raw = labels.map(function (label, index) {
      const exact = total * weights[label] / weightTotal;
      return { label, index, count: Math.floor(exact), remainder: exact - Math.floor(exact) };
    });
    let remaining = total - raw.reduce(function (sum, item) { return sum + item.count; }, 0);
    raw.slice().sort(function (left, right) {
      return right.remainder - left.remainder || left.index - right.index;
    }).forEach(function (item) {
      if (remaining > 0) { raw[item.index].count += 1; remaining -= 1; }
    });
    return Object.freeze(Object.fromEntries(raw.map(function (item) { return [item.label, item.count]; })));
  }

  function normalizeCandidate(input, index) {
    exactKeys(input, new Set([
      "itemId", "itemVersionId", "curriculumPath", "typeCode", "familyId",
      "difficultyBand", "inputType", "score"
    ]), `candidates[${index}]`);
    const difficultyBand = clean(input.difficultyBand);
    invariant(DIFFICULTIES.includes(difficultyBand), `candidates[${index}].difficultyBand is invalid`);
    const itemId = token(input.itemId, `candidates[${index}].itemId`);
    return Object.freeze({
      itemId,
      itemVersionId: token(input.itemVersionId, `candidates[${index}].itemVersionId`),
      curriculumPath: curriculumPath(input.curriculumPath, `candidates[${index}].curriculumPath`),
      typeCode: token(input.typeCode, `candidates[${index}].typeCode`),
      familyId: input.familyId == null ? itemId : token(input.familyId, `candidates[${index}].familyId`),
      difficultyBand,
      inputType: clean(input.inputType),
      responseGroup: responseGroup(input.inputType),
      score: input.score == null ? 1 : Number(input.score)
    });
  }

  function normalizeOptions(input) {
    exactKeys(input, new Set(["questionCount", "seed", "difficultyWeights", "responseWeights", "maxPerFamily"]), "options");
    return Object.freeze({
      questionCount: positiveInteger(input.questionCount, "options.questionCount", 100),
      seed: uint32(input.seed, "options.seed"),
      difficultyWeights: normalizeWeights(input.difficultyWeights, DIFFICULTIES, "options.difficultyWeights"),
      responseWeights: normalizeWeights(input.responseWeights, RESPONSE_GROUPS, "options.responseWeights"),
      maxPerFamily: input.maxPerFamily == null ? 1 : positiveInteger(input.maxPerFamily, "options.maxPerFamily", 10)
    });
  }

  function cellPlan(difficultyQuota, responseQuota, availability) {
    const memo = new Map();
    function visit(index, objectiveRemaining) {
      const key = `${index}:${objectiveRemaining}`;
      if (memo.has(key)) return memo.get(key);
      if (index === DIFFICULTIES.length) return objectiveRemaining === 0 ? [] : null;
      const difficulty = DIFFICULTIES[index];
      const rowTotal = difficultyQuota[difficulty];
      const minObjective = Math.max(0, rowTotal - availability[`${difficulty}:subjective`]);
      const maxObjective = Math.min(rowTotal, availability[`${difficulty}:objective`], objectiveRemaining);
      for (let objective = maxObjective; objective >= minObjective; objective -= 1) {
        const subjective = rowTotal - objective;
        if (subjective > availability[`${difficulty}:subjective`]) continue;
        const rest = visit(index + 1, objectiveRemaining - objective);
        if (rest) {
          const result = [{ difficulty, objective, subjective }].concat(rest);
          memo.set(key, result);
          return result;
        }
      }
      memo.set(key, null);
      return null;
    }
    return visit(0, responseQuota.objective);
  }

  function planExam(candidateInput, optionsInput) {
    invariant(Array.isArray(candidateInput), "candidates must be an array");
    const options = normalizeOptions(optionsInput);
    const candidates = candidateInput.map(normalizeCandidate);
    const seenItems = new Set();
    candidates.forEach(function (candidate) {
      invariant(!seenItems.has(candidate.itemId), "candidates contain duplicate itemId values");
      seenItems.add(candidate.itemId);
      invariant(Number.isFinite(candidate.score) && candidate.score > 0, "candidate.score must be positive");
    });
    invariant(candidates.length >= options.questionCount, "not enough eligible candidates");

    const difficultyQuota = allocate(options.questionCount, options.difficultyWeights, DIFFICULTIES);
    const responseQuota = allocate(options.questionCount, options.responseWeights, RESPONSE_GROUPS);
    const cells = {};
    DIFFICULTIES.forEach(function (difficulty) {
      RESPONSE_GROUPS.forEach(function (group) { cells[`${difficulty}:${group}`] = []; });
    });
    candidates.forEach(function (candidate) { cells[`${candidate.difficultyBand}:${candidate.responseGroup}`].push(candidate); });
    Object.values(cells).forEach(function (items) {
      items.sort(function (left, right) {
        return fnv1a32(`${options.seed}:${left.itemId}:${left.itemVersionId}`) - fnv1a32(`${options.seed}:${right.itemId}:${right.itemVersionId}`)
          || left.itemId.localeCompare(right.itemId);
      });
    });
    const availability = Object.fromEntries(Object.entries(cells).map(function ([key, items]) { return [key, items.length]; }));
    const matrix = cellPlan(difficultyQuota, responseQuota, availability);
    invariant(matrix, "eligible candidates cannot satisfy the requested difficulty and response ratios");

    const selected = [];
    const familyCounts = new Map();
    matrix.forEach(function (row) {
      RESPONSE_GROUPS.forEach(function (group) {
        const needed = row[group];
        const pool = cells[`${row.difficulty}:${group}`];
        let added = 0;
        if (needed === 0) return;
        for (const candidate of pool) {
          if ((familyCounts.get(candidate.familyId) || 0) >= options.maxPerFamily) continue;
          selected.push(candidate);
          familyCounts.set(candidate.familyId, (familyCounts.get(candidate.familyId) || 0) + 1);
          added += 1;
          if (added === needed) break;
        }
        invariant(added === needed, "family diversity limit leaves too few eligible candidates");
      });
    });

    selected.sort(function (left, right) {
      return fnv1a32(`${options.seed}:order:${left.itemId}`) - fnv1a32(`${options.seed}:order:${right.itemId}`)
        || left.itemId.localeCompare(right.itemId);
    });
    const items = selected.map(function (candidate, index) {
      return Object.freeze({
        itemId: candidate.itemId,
        itemVersionId: candidate.itemVersionId,
        order: index + 1,
        score: candidate.score
      });
    });
    return Object.freeze({
      seed: options.seed,
      items: Object.freeze(items),
      summary: Object.freeze({
        questionCount: items.length,
        difficulty: difficultyQuota,
        response: responseQuota,
        familyCount: familyCounts.size
      })
    });
  }

  return Object.freeze({
    DIFFICULTIES,
    RESPONSE_GROUPS,
    responseGroup,
    allocate,
    normalizeOptions,
    planExam
  });
});
