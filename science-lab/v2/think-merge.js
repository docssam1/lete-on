import{earthSeaSafetyMisconceptions}from'../data/book/earth-sea-choice-review.js?v=20261115-earth-sea-linked-choice-review&safety=20261115-earth-sea-safety-feedback';
// 사고력 수업 문항(data/units/<u>.think.js)을 문제은행 모듈에 더한다. 문제은행 파일(<u>.js·misc·judge)은 그대로 두고
// 수업 문항(items)·판정표(judge)·오개념 보충(misc)만 합친다 — scripts/gen-science-think-lib.mjs가 만든 파일.
const plain = (v) => v && typeof v === 'object' && !Array.isArray(v);
const currentThink = {
  'c22-s32-u04': () => import('../data/units/c22-s32-u04.think.js?v=20261115-curriculum-area'),
  'c22-s42-u04': () => import('../data/units/c22-s42-u04.think.js?v=20261115-curriculum-area'),
};
const thinkModule = (u) => (currentThink[u] ? currentThink[u]() : import(`../data/units/${u}.think.js`)).catch(() => null);
export async function withThink(u, mod) {
  const t = await thinkModule(u);
  if (!t) return mod;
  const base = mod.misc || {}, add = t.misc || {}, misc = {};
  for (const k of new Set([...Object.keys(base), ...Object.keys(add)])) misc[k] = plain(base[k]) || plain(add[k]) ? { ...(base[k] || {}), ...(add[k] || {}) } : base[k];
  // 현재 보충 설명만 고친다. 생성 원고와 과거 문항 사본은 보존한다.
  const tide=misc.misconceptions?.N05;
  if(u==='c22-s32-u02'&&tide?.element==='E5'&&tide.label==='밀물·썰물을 한 순간의 파도로 생각해요'&&tide.fix==='밀물·썰물은 <b>같은 곳의 물 높이가 시간에 따라</b> 높아졌다 낮아지는 것으로, 하루에 두 번쯤 되풀이돼요. 바람이 만드는 파도와 달라요.'){
    misc.misconceptions={...misc.misconceptions,N05:{...tide,fix:'같은 바닷가에서 시간이 지나면 <b>밀물 때는 물 높이가 높아지고 썰물 때는 낮아져요.</b> 한순간 치는 파도와 구별해요.'}};
  }
  if(u==='c22-s32-u02')misc.misconceptions={...misc.misconceptions,...earthSeaSafetyMisconceptions};
  // 편집 교재(문제집형 A4)가 있으면 #/<u>/workbook 으로 연다 — data/book/<u>.workbook.js
  const [wb, book] = await Promise.all([import(`../data/book/${u}.workbook.js`).catch(() => null), import(`../data/book/${u}.book.js`).catch(() => null)]);
  const paper = wb ? (await import('./think-workbook-paper.js')).makeWorkbookPaper(wb.workbook, book?.art) : {};
  return { ...mod, items: [...(mod.items || []), ...(t.items || [])], misc, ...paper };
}
// 판정표 = 문제은행 판정표 + 사고력 수업 판정표(같은 키면 수업 쪽)
export const loadJudge = (u) => Promise.all([
  import(`../data/units/${u}.judge.js`).then((m) => m.judge).catch(() => null),
  thinkModule(u).then((m) => m?.judge),
]).then(([a, b]) => (a || b ? { ...(a || {}), ...(b || {}) } : null));
