// 사고력 수업 문항(data/units/<u>.think.js)을 문제은행 모듈에 더한다. 문제은행 파일(<u>.js·misc·judge)은 그대로 두고
// 수업 문항(items)·판정표(judge)·오개념 보충(misc)만 합친다 — scripts/gen-science-think-lib.mjs가 만든 파일.
const plain = (v) => v && typeof v === 'object' && !Array.isArray(v);
export async function withThink(u, mod) {
  const t = await import(`../data/units/${u}.think.js`).catch(() => null);
  if (!t) return mod;
  const base = mod.misc || {}, add = t.misc || {}, misc = {};
  for (const k of new Set([...Object.keys(base), ...Object.keys(add)])) misc[k] = plain(base[k]) || plain(add[k]) ? { ...(base[k] || {}), ...(add[k] || {}) } : base[k];
  return { ...mod, items: [...(mod.items || []), ...(t.items || [])], misc };
}
// 판정표 = 문제은행 판정표 + 사고력 수업 판정표(같은 키면 수업 쪽)
export const loadJudge = (u) => Promise.all([
  import(`../data/units/${u}.judge.js`).then((m) => m.judge).catch(() => null),
  import(`../data/units/${u}.think.js`).then((m) => m.judge).catch(() => null),
]).then(([a, b]) => (a || b ? { ...(a || {}), ...(b || {}) } : null));
