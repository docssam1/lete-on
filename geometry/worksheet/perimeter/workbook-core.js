export const MAX_COUNT = 20;
export const PROBLEMS_PER_PAGE = 2;
export const problemsPerPage = () => PROBLEMS_PER_PAGE;
export const DOMAIN_ORDER = Object.freeze(["boundary", "joined", "compare", "build"]);
export const LANGUAGES = Object.freeze(["ko", "en", "zh", "ja"]);
export const normalizeLanguage = (value) => LANGUAGES.includes(value) ? value : "ko";
export const orderedDomains = (domains) => DOMAIN_ORDER.map((id) => domains.find((d) => d.id === id)).filter(Boolean);

export function normalizeCount(value, available = MAX_COUNT, fallback = MAX_COUNT) {
  if (available < 1) return 0;
  const parsed = Number(value);
  const count = value !== "" && value !== null && Number.isFinite(parsed) ? Math.round(parsed) : fallback;
  return Math.max(1, Math.min(MAX_COUNT, available, count));
}

export function initialSelection(params, domains) {
  const domain = params.get("domain"), level = params.get("level");
  if (domain !== null) return domain === "all" || domains.some((d) => d.id === domain) ? domain : null;
  if (level !== null && level !== "all") return domains.find((d) => String(d.level) === level)?.id || null;
  return "all";
}

export function validateBank(api) {
  for (const name of ["problemsFor", "promptFor", "solutionFor", "answerFor"]) {
    if (typeof api[name] !== "function") throw new Error(`Missing Perimeter API: ${name}`);
  }
  if (!Array.isArray(api.domains) || api.domains.length !== 4 || orderedDomains(api.domains).length !== 4) throw new Error("Expected four perimeter domains.");
  const ids = new Set();
  const validCells = (cells) => Array.isArray(cells) && cells.length > 0 && new Set(cells.map((c) => `${c.x},${c.y}`)).size === cells.length && cells.every((c) => Number.isInteger(c.x) && Number.isInteger(c.y) && c.x >= 0 && c.y >= 0 && c.x < 6 && c.y < 6);
  for (const [index, domain] of orderedDomains(api.domains).entries()) {
    if (domain.level !== index + 1 || LANGUAGES.some((lang) => !domain.names?.[lang]?.trim())) throw new Error(`Invalid domain: ${domain.id}`);
    const problems = api.problemsFor(domain.id);
    if (!Array.isArray(problems) || problems.length !== MAX_COUNT) throw new Error(`Expected 20 problems: ${domain.id}`);
    for (const p of problems) {
      if (typeof p.id !== "string" || !p.id || ids.has(p.id) || p.domain !== domain.id || p.size !== 6 || !validCells(p.cells)) throw new Error(`Invalid problem: ${p.id}`);
      ids.add(p.id);
      if (LANGUAGES.some((lang) => !api.promptFor(p, lang)?.trim() || !api.solutionFor(p, lang)?.trim())) throw new Error(`Missing learning copy: ${p.id}`);
      const answer = api.answerFor(p);
      if (p.domain === "build") {
        if (!Number.isInteger(p.target) || p.target < 8 || p.target > 26 || !validCells(p.example)) throw new Error(`Invalid construction: ${p.id}`);
      } else if (p.domain === "compare") {
        if (!["less", "equal", "greater"].includes(answer) || !validCells(p.other)) throw new Error(`Invalid comparison: ${p.id}`);
      } else if (!Number.isInteger(answer) || answer <= 0) throw new Error(`Invalid perimeter: ${p.id}`);
      if (p.domain === "joined" && (!Array.isArray(p.groups) || p.groups.length !== 2 || !p.groups.every(validCells))) throw new Error(`Invalid joined groups: ${p.id}`);
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
  if (pools.some((p) => !Array.isArray(p) || p.length !== MAX_COUNT)) throw new Error("Incomplete problem bank.");
  const count = normalizeCount(value, MAX_COUNT, selection === "all" ? 20 : 10);
  const quotas = included.map(() => 0);
  for (let n = 0; n < count; n += 1) quotas[n % included.length] += 1;
  return included.flatMap((domain, index) => {
    const pool = shuffled(pools[index], seed + domain.level * 104729), quota = quotas[index];
    // Display-only toggles keep these entries; a new round advances a stable permutation.
    const offset = (round >>> 0) * (quota === pool.length ? 1 : quota) % pool.length;
    return Array.from({ length: quota }, (_, n) => ({ domain, problem: pool[(offset + n) % pool.length] }));
  });
}

export function groupPages(entries) {
  const pages = [];
  for (const entry of entries) {
    const page = pages.at(-1);
    if (!page || page.length === problemsPerPage(entry.domain.id) || page[0].domain.id !== entry.domain.id) pages.push([entry]);
    else page.push(entry);
  }
  return pages;
}

export function comparisonSymbol(value) {
  const symbol = { less: "<", equal: "=", greater: ">" }[value];
  if (!symbol) throw new Error("Invalid comparison answer.");
  return symbol;
}

// Omitting selectedCells is essential: reveal mode must use the core's build example.
export const staticRenderOptions = (lang, reveal = false, layout = "horizontal") => ({ lang, reveal, interactive: false, layout });

// Authored cover-only comb: not a numbered exercise and never part of selection.
export const COVER_SAMPLE = Object.freeze({
  id: "perimeter-cover-sample", domain: "boundary", index: 0, size: 6,
  cells: Object.freeze(Array.from({ length: 6 }, (_, x) => [{ x, y: 0 }, { x, y: 1 }]).flat().concat([0, 2, 4].flatMap((x) => [{ x, y: 2 }, { x, y: 3 }])).map(Object.freeze)),
});
