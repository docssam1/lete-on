export const MAX_COUNT = 20;
export const PAGE_CAPACITY = 234;
export const entryHeight = (entry) => entry.problem.unit === "point" ? 117 : 78;

export function normalizeCount(value, available = MAX_COUNT, fallback = 10) {
  if (available < 1) return 0;
  const parsed = Number(value);
  const count = value !== "" && value !== null && Number.isFinite(parsed) ? Math.round(parsed) : fallback;
  return Math.max(1, Math.min(MAX_COUNT, available, count));
}

export function initialSelection(params, domains) {
  const domain = params.get("domain");
  const level = params.get("level");
  if (domain !== null) return domain === "all" || domains.some((d) => d.id === domain) ? domain : null;
  if (level !== null && level !== "all") return domains.find((d) => String(d.level) === level)?.id || null;
  return "all";
}

function shuffled(items, seed) {
  const result = [...items];
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = Math.floor(state / 4294967296 * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function balancedPool(items, seed) {
  const groups = new Map();
  for (const problem of shuffled(items, seed)) {
    const kind = problem.kind || "default";
    if (!groups.has(kind)) groups.set(kind, []);
    groups.get(kind).push(problem);
  }
  // Spread each available sub-type over the bank without changing any problem.
  return [...groups.values()].flatMap((group) => group.map((problem, index) => ({ problem, position: (index + .5) / group.length })))
    .sort((a, b) => a.position - b.position).map((item) => item.problem);
}

export function validateBank(api) {
  for (const name of ["problemsFor", "promptFor", "hintFor", "solutionFor", "answerFor", "grade"]) {
    if (typeof api[name] !== "function") throw new Error(`Missing Angle Studio API: ${name}`);
  }
  if (!Array.isArray(api.domains) || !api.domains.length) throw new Error("No available activities.");
  const ids = new Set(), domainIds = new Set();
  for (const domain of api.domains) {
    if (!domain.id || !domain.names?.ko || domainIds.has(domain.id)) throw new Error("Invalid activity metadata.");
    domainIds.add(domain.id);
    const problems = api.problemsFor(domain.id);
    if (!Array.isArray(problems) || problems.length !== MAX_COUNT) throw new Error(`Expected 20 problems: ${domain.id}`);
    for (const p of problems) {
      if (!p.id || ids.has(p.id) || p.domain !== domain.id || !["point", "count", "degree"].includes(p.unit)) throw new Error(`Invalid problem: ${p.id}`);
      ids.add(p.id);
      if (!api.promptFor(p, "ko")?.trim() || !api.solutionFor(p, "ko")?.trim()) throw new Error(`Missing copy: ${p.id}`);
      const answer = api.answerFor(p);
      if (p.unit === "point") {
        if (!Array.isArray(answer) || !answer.length || !answer.every((point) => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) && api.grade(p, point).correct === true)) throw new Error(`Invalid drawing answer: ${p.id}`);
      } else if (!Number.isFinite(answer) || (p.unit === "count" && (!Number.isInteger(answer) || answer < 0))) {
        throw new Error(`Invalid numeric answer: ${p.id}`);
      }
    }
  }
  return true;
}

export function chooseEntries(api, selection, value, { seed = 1, round = 0 } = {}) {
  const included = selection === "all" ? api.domains : api.domains.filter((d) => d.id === selection);
  if (!included.length) throw new Error("Unavailable worksheet activity.");
  const pools = included.map((domain) => api.problemsFor(domain.id));
  const count = normalizeCount(value, pools.reduce((sum, pool) => sum + pool.length, 0), selection === "all" ? 20 : 10);
  const quotas = included.map(() => 0);
  for (let n = 0; n < count; n += 1) quotas[n % included.length] += 1;
  return included.flatMap((domain, index) => {
    const pool = balancedPool(pools[index], seed + Number(domain.level || index + 1) * 104729);
    const quota = quotas[index];
    // Cycle through a fixed permutation so consecutive half-bank sets are disjoint.
    const offset = round * (quota === pool.length ? 1 : quota) % pool.length;
    const chosen = Array.from({ length: quota }, (_, n) => ({ domain, problem: pool[(offset + n) % pool.length] }));
    if (domain.id === "polygon") {
      const order = { triangles: 0, sum: 1, missing: 2, regular: 3 };
      chosen.sort((a, b) => (order[a.problem.kind] ?? 4) - (order[b.problem.kind] ?? 4));
    }
    return chosen;
  });
}

export function groupPages(entries) {
  const pages = [];
  for (const entry of entries) {
    const page = pages.at(-1);
    const height = page?.reduce((sum, item) => sum + entryHeight(item), 0) || 0;
    if (!page || page[0].domain.id !== entry.domain.id || height + entryHeight(entry) > PAGE_CAPACITY) pages.push([entry]);
    else page.push(entry);
  }
  return pages;
}

export function answerUnit(p) {
  if (p.unit === "point") return "";
  if (p.unit === "degree") return "°";
  return p.responseKind === "angle-label" ? "번" : "개";
}

export function answerText(p, answer) {
  if (p.unit === "point") return "예시 답안";
  return `${answer}${answerUnit(p)}`;
}
