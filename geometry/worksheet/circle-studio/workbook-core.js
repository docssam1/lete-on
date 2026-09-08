export const MAX_COUNT = 20;
export const PROBLEMS_PER_PAGE = 2;
export const DOMAIN_ORDER = Object.freeze(["center", "parts", "measure", "draw"]);
export const LANGUAGES = Object.freeze(["ko", "en", "zh", "ja"]);
export const learner_stage = "초등 도형 · 원의 중심, 반지름, 지름과 원 그리기";
export const SVG_WIDTH_MM = 400 / 56 * 10;
export const COVER_ID = "circle-cover-authored";
export const normalizeLanguage = (value) => LANGUAGES.includes(value) ? value : "ko";
export const orderedDomains = (domains) => DOMAIN_ORDER.map((id) => domains.find((d) => d.id === id)).filter(Boolean);
export function normalizeCount(value, available = MAX_COUNT) {
  if (available < 1) return 0;
  const n = Number(value);
  return Math.max(1, Math.min(MAX_COUNT, available, value !== "" && value !== null && Number.isFinite(n) ? Math.round(n) : MAX_COUNT));
}
export function initialSelection(params, domains) {
  const domain = params.get("domain"), level = params.get("level");
  if (domain !== null) return domain === "all" || domains.some((d) => d.id === domain) ? domain : null;
  if (level !== null && level !== "all") return domains.find((d) => String(d.level) === level)?.id || null;
  return "all";
}
export function validateBank(api) {
  for (const name of ["problemsFor", "answerFor", "grade", "promptPartsFor", "promptFor", "hintFor", "solutionFor", "optionLabels", "segmentKind"]) {
    if (typeof api[name] !== "function") throw new Error("Missing circle API: " + name);
  }
  if (api.learner_stage !== learner_stage) throw new Error("Learner stage mismatch");
  if (!Array.isArray(api.domains) || api.domains.length !== 4 || orderedDomains(api.domains).length !== 4) throw new Error("Expected four circle domains");
  const ids = new Set();
  const point = (v) => Array.isArray(v) && v.length === 2 && v.every(Number.isInteger);
  for (const [index, d] of orderedDomains(api.domains).entries()) {
    if (d.level !== index + 1 || LANGUAGES.some((lang) => !d.names?.[lang]?.trim())) throw new Error("Invalid domain: " + d.id);
    const bank = api.problemsFor(d.id), indices = new Set();
    if (!Array.isArray(bank) || bank.length !== 20) throw new Error("Expected 20 problems: " + d.id);
    for (const p of bank) {
      if (!Number.isInteger(p.index) || p.index < 0 || p.index > 19 || indices.has(p.index) || p.id !== "circle-" + d.id + "-" + String(p.index + 1).padStart(2, "0") || ids.has(p.id) || p.domain !== d.id || p.size !== 7 || !point(p.center) || !Number.isInteger(p.radius)) throw new Error("Invalid problem: " + p.id);
      ids.add(p.id); indices.add(p.index);
      for (const lang of LANGUAGES) {
        const parts = api.promptPartsFor(p, lang);
        if (!parts?.question?.trim() || !Array.isArray(parts.conditions) || parts.conditions.some((s) => typeof s !== "string" || !s.trim()) || !api.promptFor(p, lang)?.trim() || !api.hintFor(p, lang)?.trim() || !api.solutionFor(p, lang)?.trim()) throw new Error("Missing copy: " + p.id + " " + lang);
      }
      if (d.id === "center" || d.id === "draw") {
        if (p.radius < 1 || p.radius > 3 || p.center.some((n) => n - p.radius < 0 || n + p.radius > 6)) throw new Error("Circle outside grid: " + p.id);
      } else if (d.id === "parts") {
        if (p.radius !== 5 || p.center.some((n) => n !== 0) || !["radius","diameter"].includes(p.target) || p.segments?.length !== 4 || p.segments.some((s, i) => s.id !== "ABCD"[i] || !point(s.start) || !point(s.end))) throw new Error("Invalid parts: " + p.id);
      } else if (p.radius < 1 || p.radius > 10 || !["radius","diameter"].includes(p.given)) throw new Error("Invalid measure: " + p.id);
    }
  }
  return true;
}
function shuffled(items, seed) {
  const result = [...items].sort((a,b) => a.id.localeCompare(b.id));
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = Math.floor(state / 4294967296 * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function chooseEntries(api, selection, value, { seed = 1, round = 0 } = {}) {
  const included = orderedDomains(api.domains).filter((d) => selection === "all" || selection === d.id);
  if (!included.length) throw new Error("Unavailable worksheet activity");
  const count = normalizeCount(value), quotas = included.map(() => 0);
  for (let i = 0; i < count; i++) quotas[i % included.length]++;
  return included.flatMap((domain, index) => {
    const pool = api.problemsFor(domain.id), quota = quotas[index];
    if (pool.length !== 20) throw new Error("Incomplete problem bank");
    const ordered = shuffled(pool, (seed >>> 0) + domain.level * 104729);
    const offset = (round >>> 0) * (quota === pool.length ? 1 : quota) % pool.length;
    return Array.from({length:quota}, (_,n) => ({domain, problem:ordered[(offset+n)%pool.length]}));
  });
}
export function groupPages(entries) {
  const pages = [];
  for (const entry of entries) {
    const last = pages.at(-1);
    if (!last || last.length === PROBLEMS_PER_PAGE || last[0].domain.id !== entry.domain.id) pages.push([entry]);
    else last.push(entry);
  }
  return pages;
}
export const staticRenderOptions = (lang, reveal = false) => ({lang, reveal, interactive:false, construction:null, traceProgress:0});
