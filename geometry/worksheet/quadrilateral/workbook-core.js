export const MAX_COUNT = 20;
export const PROBLEMS_PER_PAGE = 2;
export const DOMAIN_ORDER = Object.freeze(["parallel", "right", "classify", "build"]);
export const LANGUAGES = Object.freeze(["ko", "en", "zh", "ja"]);
export const learner_stage = "초등 도형 · 사각형의 성질과 분류";
export const normalizeLanguage = (value) => LANGUAGES.includes(value) ? value : "ko";
export const orderedDomains = (domains) => DOMAIN_ORDER.map((id) => domains.find((d) => d.id === id)).filter(Boolean);
export function normalizeCount(value, available = MAX_COUNT) {
  if (available < 1) return 0;
  const parsed = Number(value);
  return Math.max(1, Math.min(MAX_COUNT, available, value !== "" && value !== null && Number.isFinite(parsed) ? Math.round(parsed) : MAX_COUNT));
}
export function initialSelection(params, domains) {
  const domain = params.get("domain"), level = params.get("level");
  if (domain !== null) return domain === "all" || domains.some((d) => d.id === domain) ? domain : null;
  if (level !== null && level !== "all") return domains.find((d) => String(d.level) === level)?.id || null;
  return "all";
}
export function validateBank(api) {
  for (const name of ["problemsFor", "properties", "answerFor", "grade", "promptFor", "promptPartsFor", "hintFor", "solutionFor", "className", "optionLabels"]) {
    if (typeof api[name] !== "function") throw new Error(`Missing quadrilateral API: ${name}`);
  }
  if (!Array.isArray(api.domains) || api.domains.length !== 4 || orderedDomains(api.domains).length !== 4) throw new Error("Expected four quadrilateral domains");
  const ids = new Set();
  const point = (v) => Array.isArray(v) && v.length === 2 && v.every((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  for (const [index, d] of orderedDomains(api.domains).entries()) {
    if (d.level !== index + 1 || LANGUAGES.some((lang) => !d.names?.[lang]?.trim())) throw new Error(`Invalid domain: ${d.id}`);
    const bank = api.problemsFor(d.id);
    if (!Array.isArray(bank) || bank.length !== 20) throw new Error(`Expected 20 problems: ${d.id}`);
    for (const p of bank) {
      if (p.id !== `quadrilateral-${d.id}-${String(p.index + 1).padStart(2, "0")}` || ids.has(p.id) || p.domain !== d.id || p.size !== 7 || p.vertices.length !== (d.id === "build" ? 3 : 4) || !p.vertices.every(point)) throw new Error(`Invalid problem: ${p.id}`);
      ids.add(p.id);
      if (LANGUAGES.some((lang) => !api.promptFor(p, lang)?.trim() || !api.hintFor(p, lang)?.trim() || !api.solutionFor(p, lang)?.trim())) throw new Error(`Missing copy: ${p.id}`);
      const answer = api.answerFor(p);
      if (!Array.isArray(answer)) throw new Error(`Invalid answer set: ${p.id}`);
      if (d.id === "build") {
        if (!point(p.example) || !p.target || !answer.length || !answer.every(point) || !answer.some((v) => v.every((n, i) => n === p.example[i]))) throw new Error(`Invalid build: ${p.id}`);
      } else {
        if (!api.properties(p.vertices).valid) throw new Error(`Invalid polygon: ${p.id}`);
        for (const lang of LANGUAGES) {
          const labels = api.optionLabels(d.id, lang);
          if (!labels.length || labels.some((o) => !o.id || !o.label) || answer.some((id) => !labels.some((o) => o.id === id))) throw new Error(`Invalid labels: ${p.id}`);
        }
      }
    }
  }
  return true;
}
function shuffled(items, seed) {
  const result = [...items];
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
    const shuffledPool = shuffled(pool, seed + domain.level * 104729);
    const offset = (round >>> 0) * (quota === pool.length ? 1 : quota) % pool.length;
    return Array.from({ length: quota }, (_, n) => ({ domain, problem: shuffledPool[(offset + n) % pool.length] }));
  });
}
export function groupPages(entries) {
  const pages = [];
  for (const entry of entries) {
    const last = pages.at(-1);
    if (!last || last.length === 2 || last[0].domain.id !== entry.domain.id) pages.push([entry]);
    else last.push(entry);
  }
  return pages;
}
// Leave selectedPoint absent: static reveal uses the shared renderer's example.
export const staticRenderOptions = (lang, reveal = false) => ({ lang, reveal, interactive: false });
// A cover-only authored illustration; never selected as an exercise.
export const COVER_SAMPLE = Object.freeze({ id: "quadrilateral-cover-sample", domain: "parallel", index: 0, size: 7, vertices: [[0, 1], [6, 2], [5, 5], [1, 6]] });
