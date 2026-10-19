import '../../shared/number-paper-model.js?v=number-paper-1';

export const activities = Object.freeze([
  { id: 'cut', level: 1, names: { ko: '잘린 수의 합', en: 'Sum of cut numbers', zh: '剪掉数字的和', ja: '切った数の和' } },
  { id: 'remain', level: 2, names: { ko: '남은 수의 합', en: 'Sum of remaining numbers', zh: '剩下数字的和', ja: '残った数の和' } }
]);

// Twenty authored geometries per activity. Different fold directions are
// conditions, not difficulty levels. Values 1–6 keep arithmetic secondary.
const specs = [
  ['up','left',[0]], ['down','right',[1]], ['up','right',[0]], ['down','left',[1]],
  ['up','left',[3]], ['down','right',[0]], ['up','right',[2]], ['down','left',[1]],
  ['up','left',[1]], ['down','right',[2]], ['up','right',[0]], ['down','left',[3]],
  ['up','left',[0,1]], ['down','right',[2,3]], ['up','right',[0,2]], ['down','left',[1,3]],
  ['up','left',[2,3]], ['down','right',[0,2]], ['up','right',[1,3]], ['down','left',[0,1]]
];
const grids = [
  [2,5,1,4,6,3,2,1,4,1,5,3,3,6,4,2],
  [4,1,3,6,2,5,1,4,3,2,6,5,1,4,2,3],
  [1,3,5,2,4,2,6,3,5,6,1,4,2,4,3,1],
  [6,2,4,1,3,1,5,2,4,5,2,6,1,3,6,4]
];
export const bank = activities.flatMap((activity, a) => specs.map(([hDir,vDir,cutCells], i) => {
  const base = grids[(i + a) % grids.length], offset = (Math.floor(i / 4) + a * 3) % 16;
  const values = base.map((_, j) => base[(j + offset) % 16]);
  return Object.freeze({ id: `number-${activity.id}-${String(i + 1).padStart(2,'0')}`, activity: activity.id, level: activity.level,
    ...globalThis.GW_NUMBER_PAPER.numberPaperModel({ grid: Array.from({length:4}, (_,r) => values.slice(r*4,r*4+4)), hDir, vDir, cells: cutCells.map(id => ({r:Math.floor(id/2),c:id%2})) }) });
}));
export const problemsFor = activity => bank.filter(p => p.activity === activity);
export const answerFor = p => p.activity === 'cut' ? p.cut : p.remain;
export function gradeCells(p, selected) {
  if (!Array.isArray(selected) || new Set(selected).size !== selected.length) return false;
  return selected.length === p.removed.size && selected.every(id => Number.isInteger(id) && p.removed.has(id));
}
export function gradeSum(p, value) {
  const input = String(value).trim();
  return /^\d{1,4}$/.test(input) && Number(input) === answerFor(p);
}
export function equationFor(p) {
  const terms = [...p.removed].sort((a,b)=>a-b).map(id => p.grid[Math.floor(id/4)][id%4]);
  const cut = `${terms.join(' + ')} = ${p.cut}`;
  return p.activity === 'cut' ? cut : `${cut}; ${p.total} − ${p.cut} = ${p.remain}`;
}
