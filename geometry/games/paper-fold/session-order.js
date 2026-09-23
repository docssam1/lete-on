export function seededRandom(seed) {
  let value = 2166136261;
  for (const char of String(seed)) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return () => {
    value += 0x6d2b79f5;
    let next = Math.imul(value ^ value >>> 15, 1 | value);
    next ^= next + Math.imul(next ^ next >>> 7, 61 | next);
    return ((next ^ next >>> 14) >>> 0) / 4294967296;
  };
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function visualProblemKey(item) {
  const specimen = (p) => [p.folds, p.cutSegments, p.cutMarks, p.punches];
  return JSON.stringify([item.interaction, specimen(item), item.pairs?.map(specimen)]);
}

export function availableProblems(pool, excluded = new Set()) {
  const excludedViews = new Set(pool.filter((item) => excluded.has(item.id)).map(visualProblemKey));
  const unique = new Map();
  for (const item of pool) {
    const key = visualProblemKey(item);
    if (!excludedViews.has(key) && !unique.has(key)) unique.set(key, item);
  }
  return [...unique.values()];
}

export function sessionQueue(pool, count, excluded = new Set(), random = Math.random) {
  const available = shuffle(availableProblems(pool, excluded), random);
  if (available.length < count) throw new Error("PAPER_FOLD_POOL_EXHAUSTED");
  return Array.from({ length: count }, (_, index) => {
    const matching = index % 3 === 2;
    let slot = available.findIndex((item) => index === 0
      ? item.resultChoices && item.folds.length === 1
      : (item.interaction === "connect-match") === matching);
    if (slot < 0) slot = 0;
    return available.splice(slot, 1)[0];
  });
}
