export const MAX_COUNT = 20;
export const PROBLEMS_PER_PAGE = 2;
export const DOMAIN_ORDER = Object.freeze(["whole", "halves", "compare", "build"]);
export const LANGUAGES = Object.freeze(["ko", "en", "zh", "ja"]);

export function normalizeCount(value, available = MAX_COUNT, fallback = MAX_COUNT) {
  if (available < 1) return 0;
  const parsed = Number(value);
  const count = value !== "" && value !== null && Number.isFinite(parsed) ? Math.round(parsed) : fallback;
  return Math.max(1, Math.min(MAX_COUNT, available, count));
}

export const normalizeLanguage = (value) => LANGUAGES.includes(value) ? value : "ko";
export const orderedDomains = (domains) => DOMAIN_ORDER.map((id) => domains.find((domain) => domain.id === id)).filter(Boolean);

export function initialSelection(params, domains) {
  const domain = params.get("domain"), level = params.get("level");
  if (domain !== null) return domain === "all" || domains.some((d) => d.id === domain) ? domain : null;
  if (level !== null && level !== "all") return domains.find((d) => String(d.level) === level)?.id || null;
  return "all";
}

export function validateBank(api) {
  for (const name of ["problemsFor", "promptFor", "hintFor", "solutionFor", "answerFor", "grade"]) {
    if (typeof api[name] !== "function") throw new Error(`Missing Unit Area API: ${name}`);
  }
  if (!Array.isArray(api.domains) || api.domains.length !== 4 || new Set(api.domains.map((d) => d.id)).size !== 4 || orderedDomains(api.domains).length !== 4) throw new Error("Expected four Unit Area domains.");
  const ids = new Set();
  for (const [index, domain] of orderedDomains(api.domains).entries()) {
    if (domain.level !== index + 1 || LANGUAGES.some((lang) => !domain.names?.[lang]?.trim())) throw new Error(`Invalid domain: ${domain.id}`);
    const problems = api.problemsFor(domain.id);
    if (!Array.isArray(problems) || problems.length !== MAX_COUNT) throw new Error(`Expected 20 problems: ${domain.id}`);
    for (const p of problems) {
      const unit = domain.id === "compare" ? "comparison" : domain.id === "build" ? "drawing" : "area";
      if (typeof p.id !== "string" || !p.id || ids.has(p.id) || p.domain !== domain.id || p.unit !== unit || p.size !== 6) throw new Error(`Invalid problem: ${p.id}`);
      ids.add(p.id);
      if (LANGUAGES.some((lang) => !api.promptFor(p, lang)?.trim() || !api.hintFor(p, lang)?.trim() || !api.solutionFor(p, lang)?.trim())) throw new Error(`Missing learning copy: ${p.id}`);
      const answer = api.answerFor(p);
      if (p.domain === "build") {
        if (!Number.isInteger(p.target) || p.target < 4 || p.target > 23 || !Array.isArray(answer) || answer.length !== p.target || !Array.isArray(p.example)) throw new Error(`Invalid drawing: ${p.id}`);
      } else if (p.domain === "compare") {
        if (!["less", "equal", "greater"].includes(answer) || !Array.isArray(p.left) || !Array.isArray(p.right)) throw new Error(`Invalid comparison: ${p.id}`);
      } else if (!Number.isFinite(answer) || answer <= 0 || !Array.isArray(p.cells)) throw new Error(`Invalid area: ${p.id}`);
      if (api.grade(p, answer)?.correct !== true) throw new Error(`Rejected bank answer: ${p.id}`);
    }
  }
  return true;
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

export function chooseEntries(api, selection, value, { seed = 1, round = 0 } = {}) {
  const included = orderedDomains(api.domains).filter((d) => selection === "all" || selection === d.id);
  if (!included.length) throw new Error("Unavailable worksheet activity.");
  const pools = included.map((d) => api.problemsFor(d.id));
  if (pools.some((pool) => !Array.isArray(pool) || pool.length !== MAX_COUNT)) throw new Error("Incomplete problem bank.");
  const count = normalizeCount(value, MAX_COUNT, selection === "all" ? 20 : 10);
  const quotas = included.map(() => 0);
  for (let n = 0; n < count; n += 1) quotas[n % included.length] += 1;
  return included.flatMap((domain, index) => {
    const pool = shuffled(pools[index], seed + domain.level * 104729), quota = quotas[index];
    // Cycle a stable permutation; display-only toggles never call this function.
    const offset = round * (quota === pool.length ? 1 : quota) % pool.length;
    return Array.from({ length: quota }, (_, n) => ({ domain, problem: pool[(offset + n) % pool.length] }));
  });
}

export function groupPages(entries) {
  const pages = [];
  for (const entry of entries) {
    const page = pages.at(-1);
    if (!page || page.length === PROBLEMS_PER_PAGE || page[0].domain.id !== entry.domain.id) pages.push([entry]);
    else page.push(entry);
  }
  return pages;
}

export function comparisonSymbol(value) {
  const symbol = { less: "<", equal: "=", greater: ">" }[value];
  if (!symbol) throw new Error("Invalid comparison answer.");
  return symbol;
}

export const staticRenderOptions = (lang, reveal = false) => ({ lang, reveal, interactive: false, selectedCells: [], markedCells: [], pairs: [], activeHalf: null, aligned: false });
