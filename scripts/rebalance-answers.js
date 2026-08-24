// Bring a Level D lesson's two practice sets to 3/3/3/3 by moving the correct
// choice within a question — the wording of every choice is untouched, only its
// position. Called as: node rebalance.js cd13
const fs = require('fs');
const id = process.argv[2];
const p = `/home/user/lete-on/reading-world/data/${id}-data.js`;
const src = fs.readFileSync(p, 'utf8');
const open = src.indexOf('CARS_D_REGISTER(') + 'CARS_D_REGISTER'.length;
const close = src.lastIndexOf(')');
const arr = JSON.parse(src.slice(open + 1, close));
const L = 'ABCD';

function fix(part) {
  const qs = arr[0][part].questions;
  const at = l => qs.map((q, i) => (q[3] === l ? i : -1)).filter(i => i >= 0);
  for (let guard = 0; guard < 24; guard++) {
    const count = {}; L.split('').forEach(l => count[l] = at(l).length);
    const over = L.split('').find(l => count[l] > 3);
    const under = L.split('').find(l => count[l] < 3);
    if (!over || !under) break;
    const i = at(over)[0];
    const q = qs[i];
    const f = L.indexOf(over), t = L.indexOf(under);
    const c = q[2], tmp = c[t]; c[t] = c[f]; c[f] = tmp; q[3] = under;
  }
  const c = {}; L.split('').forEach(l => c[l] = at(l).length);
  return `${c.A}/${c.B}/${c.C}/${c.D} ${qs.map(q => q[3]).join('')}`;
}
console.log(id, 'extra', fix('extra'));
console.log(id, 'new  ', fix('new'));
fs.writeFileSync(p, src.slice(0, open + 1) + JSON.stringify(arr, null, 2) + ');\n');
