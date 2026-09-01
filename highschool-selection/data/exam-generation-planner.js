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
      "difficultyBand", "inputType", "score", "domainGroup"
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
      domainGroup: clean(input.domainGroup) || null,
      difficultyBand,
      inputType: clean(input.inputType),
      responseGroup: responseGroup(input.inputType),
      score: input.score == null ? 1 : Number(input.score)
    });
  }

  function normalizeOptions(input) {
    exactKeys(input, new Set(["questionCount", "seed", "difficultyWeights", "responseWeights", "maxPerFamily", "domainQuotas"]), "options");
    const questionCount = positiveInteger(input.questionCount, "options.questionCount", 100);
    let domainQuotas = null;
    if (input.domainQuotas != null) {
      invariant(input.domainQuotas && typeof input.domainQuotas === "object" && !Array.isArray(input.domainQuotas), "options.domainQuotas must be an object");
      const entries = Object.entries(input.domainQuotas);
      invariant(entries.length === 2, "options.domainQuotas must contain exactly two domains");
      const seen = new Set();
      domainQuotas = Object.freeze(Object.fromEntries(entries.map(function ([label, count]) {
        const normalized = clean(label);
        invariant(normalized && normalized.length <= 80 && !seen.has(normalized), "options.domainQuotas label is invalid");
        seen.add(normalized);
        return [normalized, positiveInteger(count, `options.domainQuotas.${normalized}`, 100)];
      })));
      invariant(Object.values(domainQuotas).reduce(function (sum, count) { return sum + count; }, 0) === questionCount, "options.domainQuotas must sum to questionCount");
    }
    return Object.freeze({
      questionCount,
      seed: uint32(input.seed, "options.seed"),
      difficultyWeights: normalizeWeights(input.difficultyWeights, DIFFICULTIES, "options.difficultyWeights"),
      responseWeights: normalizeWeights(input.responseWeights, RESPONSE_GROUPS, "options.responseWeights"),
      maxPerFamily: input.maxPerFamily == null ? 1 : positiveInteger(input.maxPerFamily, "options.maxPerFamily", 10),
      domainQuotas
    });
  }

  function cellPlans(difficultyQuota, responseQuota, availability) {
    const results = [];
    function visit(index, objectiveRemaining, rows) {
      if (index === DIFFICULTIES.length) {
        if (objectiveRemaining === 0) results.push(rows.slice());
        return;
      }
      const difficulty = DIFFICULTIES[index];
      const rowTotal = difficultyQuota[difficulty];
      const minObjective = Math.max(0, rowTotal - availability[`${difficulty}:subjective`]);
      const maxObjective = Math.min(rowTotal, availability[`${difficulty}:objective`], objectiveRemaining);
      for (let objective = maxObjective; objective >= minObjective; objective -= 1) {
        const subjective = rowTotal - objective;
        if (subjective > availability[`${difficulty}:subjective`]) continue;
        rows.push({ difficulty, objective, subjective });
        visit(index + 1, objectiveRemaining - objective, rows);
        rows.pop();
      }
    }
    visit(0, responseQuota.objective, []);
    return results;
  }

  function selectWithFamilyCapacity(cells, matrix, maxPerFamily) {
    const cellKeys = [];
    const quotas = new Map();
    matrix.forEach(function (row) {
      RESPONSE_GROUPS.forEach(function (group) {
        const key = `${row.difficulty}:${group}`;
        cellKeys.push(key);
        quotas.set(key, row[group]);
      });
    });
    const familyIds = Array.from(new Set(cellKeys.flatMap(function (key) {
      return cells[key].map(function (candidate) { return candidate.familyId; });
    }))).sort();
    const source = 0;
    const familyOffset = 1;
    const cellOffset = familyOffset + familyIds.length;
    const sink = cellOffset + cellKeys.length;
    const graph = Array.from({ length: sink + 1 }, function () { return []; });
    function addEdge(from, to, capacity) {
      const forward = { to, capacity, reverse: graph[to].length, original: capacity };
      const reverse = { to: from, capacity: 0, reverse: graph[from].length, original: 0 };
      graph[from].push(forward);
      graph[to].push(reverse);
      return forward;
    }
    const familyIndex = new Map(familyIds.map(function (familyId, index) { return [familyId, familyOffset + index]; }));
    familyIds.forEach(function (familyId) { addEdge(source, familyIndex.get(familyId), maxPerFamily); });
    const allocations = [];
    cellKeys.forEach(function (cellKey, cellIndex) {
      const cellNode = cellOffset + cellIndex;
      addEdge(cellNode, sink, quotas.get(cellKey));
      familyIds.forEach(function (familyId) {
        const candidates = cells[cellKey].filter(function (candidate) { return candidate.familyId === familyId; });
        if (!candidates.length) return;
        const edge = addEdge(familyIndex.get(familyId), cellNode, candidates.length);
        allocations.push({ edge, candidates });
      });
    });
    const needed = Array.from(quotas.values()).reduce(function (sum, value) { return sum + value; }, 0);
    let flow = 0;
    while (flow < needed) {
      const previousNode = Array(graph.length).fill(-1);
      const previousEdge = Array(graph.length).fill(-1);
      const queue = [source];
      previousNode[source] = source;
      for (let position = 0; position < queue.length && previousNode[sink] === -1; position += 1) {
        const node = queue[position];
        graph[node].forEach(function (edge, edgeIndex) {
          if (edge.capacity <= 0 || previousNode[edge.to] !== -1) return;
          previousNode[edge.to] = node;
          previousEdge[edge.to] = edgeIndex;
          queue.push(edge.to);
        });
      }
      if (previousNode[sink] === -1) return null;
      let amount = needed - flow;
      for (let node = sink; node !== source; node = previousNode[node]) {
        amount = Math.min(amount, graph[previousNode[node]][previousEdge[node]].capacity);
      }
      for (let node = sink; node !== source; node = previousNode[node]) {
        const edge = graph[previousNode[node]][previousEdge[node]];
        edge.capacity -= amount;
        graph[node][edge.reverse].capacity += amount;
      }
      flow += amount;
    }
    const selected = [];
    allocations.forEach(function (allocation) {
      const used = allocation.edge.original - allocation.edge.capacity;
      selected.push(...allocation.candidates.slice(0, used));
    });
    return selected;
  }

  function selectWithFamilyCapacityForQuotas(cells, quotaObject, maxPerFamily) {
    const cellKeys = Object.keys(quotaObject);
    const familyIds = Array.from(new Set(cellKeys.flatMap(function (key) {
      return (cells[key] || []).map(function (candidate) { return candidate.familyId; });
    }))).sort();
    const source = 0;
    const familyOffset = 1;
    const cellOffset = familyOffset + familyIds.length;
    const sink = cellOffset + cellKeys.length;
    const graph = Array.from({ length: sink + 1 }, function () { return []; });
    function addEdge(from, to, capacity) {
      const forward = { to, capacity, reverse: graph[to].length, original: capacity };
      const reverse = { to: from, capacity: 0, reverse: graph[from].length, original: 0 };
      graph[from].push(forward);
      graph[to].push(reverse);
      return forward;
    }
    const familyIndex = new Map(familyIds.map(function (familyId, index) { return [familyId, familyOffset + index]; }));
    familyIds.forEach(function (familyId) { addEdge(source, familyIndex.get(familyId), maxPerFamily); });
    const allocations = [];
    cellKeys.forEach(function (cellKey, cellIndex) {
      const cellNode = cellOffset + cellIndex;
      addEdge(cellNode, sink, quotaObject[cellKey]);
      familyIds.forEach(function (familyId) {
        const candidates = (cells[cellKey] || []).filter(function (candidate) { return candidate.familyId === familyId; });
        if (!candidates.length) return;
        const edge = addEdge(familyIndex.get(familyId), cellNode, candidates.length);
        allocations.push({ edge, candidates });
      });
    });
    const needed = Object.values(quotaObject).reduce(function (sum, value) { return sum + value; }, 0);
    let flow = 0;
    while (flow < needed) {
      const previousNode = Array(graph.length).fill(-1);
      const previousEdge = Array(graph.length).fill(-1);
      const queue = [source];
      previousNode[source] = source;
      for (let position = 0; position < queue.length && previousNode[sink] === -1; position += 1) {
        const node = queue[position];
        graph[node].forEach(function (edge, edgeIndex) {
          if (edge.capacity <= 0 || previousNode[edge.to] !== -1) return;
          previousNode[edge.to] = node;
          previousEdge[edge.to] = edgeIndex;
          queue.push(edge.to);
        });
      }
      if (previousNode[sink] === -1) return null;
      let amount = needed - flow;
      for (let node = sink; node !== source; node = previousNode[node]) amount = Math.min(amount, graph[previousNode[node]][previousEdge[node]].capacity);
      for (let node = sink; node !== source; node = previousNode[node]) {
        const edge = graph[previousNode[node]][previousEdge[node]];
        edge.capacity -= amount;
        graph[node][edge.reverse].capacity += amount;
      }
      flow += amount;
    }
    const selected = [];
    allocations.forEach(function (allocation) {
      const used = allocation.edge.original - allocation.edge.capacity;
      selected.push(...allocation.candidates.slice(0, used));
    });
    return selected;
  }

  function boundedTriples(total, maximums) {
    const values = [];
    for (let first = 0; first <= Math.min(total, maximums[0]); first += 1) {
      for (let second = 0; second <= Math.min(total - first, maximums[1]); second += 1) {
        const third = total - first - second;
        if (third >= 0 && third <= maximums[2]) values.push([first, second, third]);
      }
    }
    return values;
  }

  function selectWithDomainQuotas(candidates, options, difficultyQuota, responseQuota) {
    const domains = Object.keys(options.domainQuotas);
    const cells = {};
    domains.forEach(function (domain) {
      DIFFICULTIES.forEach(function (difficulty) {
        RESPONSE_GROUPS.forEach(function (group) { cells[`${domain}:${difficulty}:${group}`] = []; });
      });
    });
    candidates.forEach(function (candidate) {
      const key = `${candidate.domainGroup}:${candidate.difficultyBand}:${candidate.responseGroup}`;
      if (cells[key]) cells[key].push(candidate);
    });
    Object.values(cells).forEach(function (items) {
      items.sort(function (left, right) {
        return fnv1a32(`${options.seed}:${left.itemId}:${left.itemVersionId}`) - fnv1a32(`${options.seed}:${right.itemId}:${right.itemVersionId}`)
          || left.itemId.localeCompare(right.itemId);
      });
    });
    const difficultyMaximums = DIFFICULTIES.map(function (difficulty) { return difficultyQuota[difficulty]; });
    const firstDifficultyPlans = boundedTriples(options.domainQuotas[domains[0]], difficultyMaximums);
    for (const firstDifficulty of firstDifficultyPlans) {
      const secondDifficulty = difficultyMaximums.map(function (total, index) { return total - firstDifficulty[index]; });
      if (secondDifficulty.some(function (count) { return count < 0; }) || secondDifficulty.reduce(function (sum, count) { return sum + count; }, 0) !== options.domainQuotas[domains[1]]) continue;
      const firstObjectiveMinimums = firstDifficulty.map(function (count, index) {
        const subjectiveAvailable = cells[`${domains[0]}:${DIFFICULTIES[index]}:subjective`].length;
        return Math.max(0, count - subjectiveAvailable);
      });
      const firstObjectiveMaximums = firstDifficulty.map(function (count, index) {
        return Math.min(count, cells[`${domains[0]}:${DIFFICULTIES[index]}:objective`].length);
      });
      const secondObjectiveMinimums = secondDifficulty.map(function (count, index) {
        const subjectiveAvailable = cells[`${domains[1]}:${DIFFICULTIES[index]}:subjective`].length;
        return Math.max(0, count - subjectiveAvailable);
      });
      const secondObjectiveMaximums = secondDifficulty.map(function (count, index) {
        return Math.min(count, cells[`${domains[1]}:${DIFFICULTIES[index]}:objective`].length);
      });
      for (let firstObjectiveTotal = firstObjectiveMinimums.reduce(function (sum, value) { return sum + value; }, 0); firstObjectiveTotal <= firstObjectiveMaximums.reduce(function (sum, value) { return sum + value; }, 0); firstObjectiveTotal += 1) {
        const secondObjectiveTotal = responseQuota.objective - firstObjectiveTotal;
        if (secondObjectiveTotal < secondObjectiveMinimums.reduce(function (sum, value) { return sum + value; }, 0) || secondObjectiveTotal > secondObjectiveMaximums.reduce(function (sum, value) { return sum + value; }, 0)) continue;
        const firstShifted = boundedTriples(firstObjectiveTotal - firstObjectiveMinimums.reduce(function (sum, value) { return sum + value; }, 0), firstObjectiveMaximums.map(function (max, index) { return max - firstObjectiveMinimums[index]; }));
        const secondShifted = boundedTriples(secondObjectiveTotal - secondObjectiveMinimums.reduce(function (sum, value) { return sum + value; }, 0), secondObjectiveMaximums.map(function (max, index) { return max - secondObjectiveMinimums[index]; }));
        for (const firstExtra of firstShifted) {
          const firstObjective = firstExtra.map(function (value, index) { return value + firstObjectiveMinimums[index]; });
          for (const secondExtra of secondShifted) {
            const secondObjective = secondExtra.map(function (value, index) { return value + secondObjectiveMinimums[index]; });
            const quotaObject = {};
            domains.forEach(function (domain, domainIndex) {
              const domainDifficulty = domainIndex === 0 ? firstDifficulty : secondDifficulty;
              const domainObjective = domainIndex === 0 ? firstObjective : secondObjective;
              DIFFICULTIES.forEach(function (difficulty, index) {
                quotaObject[`${domain}:${difficulty}:objective`] = domainObjective[index];
                quotaObject[`${domain}:${difficulty}:subjective`] = domainDifficulty[index] - domainObjective[index];
              });
            });
            if (Object.entries(quotaObject).some(function ([key, count]) { return count > cells[key].length; })) continue;
            const selected = selectWithFamilyCapacityForQuotas(cells, quotaObject, options.maxPerFamily);
            if (selected) return selected;
          }
        }
      }
    }
    return null;
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
    if (options.domainQuotas) {
      const selectedByDomain = selectWithDomainQuotas(candidates, options, difficultyQuota, responseQuota);
      invariant(selectedByDomain, "eligible candidates cannot satisfy the requested domain, difficulty, response, and family quotas");
      return finalizePlan(selectedByDomain, options, difficultyQuota, responseQuota);
    }
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
    const matrices = cellPlans(difficultyQuota, responseQuota, availability);
    invariant(matrices.length > 0, "eligible candidates cannot satisfy the requested difficulty and response ratios");
    let selected = null;
    for (const matrix of matrices) {
      selected = selectWithFamilyCapacity(cells, matrix, options.maxPerFamily);
      if (selected) break;
    }
    invariant(selected, "family diversity limit leaves too few eligible candidates");
    return finalizePlan(selected, options, difficultyQuota, responseQuota);
  }

  function finalizePlan(selected, options, difficultyQuota, responseQuota) {
    const familyCounts = new Map();
    selected.forEach(function (candidate) {
      familyCounts.set(candidate.familyId, (familyCounts.get(candidate.familyId) || 0) + 1);
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
        domain: options.domainQuotas,
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
    boundedTriples,
    planExam
  });
});
