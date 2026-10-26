// park-map.py가 낸 좌표(park-coords*.json)를 data/park-map.js에 옮겨 적는다 — 지점 표 자리, 아이들이 걷는 길, 처음 확대해 들어갈 곳(광장).
// 사용: node science-lab/tools/blender/park-apply.mjs <park-coords.json> [<park-coords-tall.json> …]  (뒤에 준 파일이 앞의 것을 덮는다: wide·tall을 따로 렌더했을 때)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MAP = fileURLToPath(new URL('../../data/park-map.js', import.meta.url));
const files = process.argv.slice(2);
if (!files.length) { console.error('좌표 파일을 주세요: park-coords.json'); process.exit(1); }
const C = {};
for (const f of files) Object.assign(C, JSON.parse(readFileSync(f, 'utf8')));
for (const k of ['wide', 'tall']) if (!C[k]) { console.error(`${k} 좌표가 없어요`); process.exit(1); }

const r = (p) => `[${p.map((v) => Math.round(v * 10) / 10).join(', ')}]`;
const list = (ps) => `[${ps.map(r).join(', ')}]`;
let src = readFileSync(MAP, 'utf8');
const swap = (re, text, what) => { if (!re.test(src)) { console.error(`못 찾음: ${what}`); process.exit(1); } src = src.replace(re, text); };

swap(/walk: \{ entrance: .*\} \},$/m, `walk: { entrance: { wide: ${list(C.wide.entrance)}, tall: ${list(C.tall.entrance)} }, hub: { wide: ${r(C.wide.hub)}, tall: ${r(C.tall.hub)} } },`, 'walk');
const zoom = { wide: 2.0, tall: 1.8 };
swap(/start: \{ wide: \[.*?\], tall: \[.*?\] \},/, `start: { wide: ${r([...C.wide.spots.gate, zoom.wide])}, tall: ${r([...C.tall.spots.gate, zoom.tall])} },`, 'start');
for (const id of Object.keys(C.wide.spots)) {
  const re = new RegExp(`(\\{ id: '${id}',.*?)wide: \\[[^\\]]*\\], tall: \\[[^\\]]*\\], path: \\{ wide: .*?, tall: .*? \\} \\}`);
  const path = `path: { wide: ${list(C.wide.walk[id] || [])}, tall: ${list(C.tall.walk[id] || [])} } }`;
  swap(re, `$1wide: ${r(C.wide.spots[id])}, tall: ${r(C.tall.spots[id])}, ${path}`, id);
}
writeFileSync(MAP, src);
console.log('옮김:', MAP);
