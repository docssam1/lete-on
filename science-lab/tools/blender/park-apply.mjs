// park-map.py가 낸 좌표(park-coords.json)를 data/park-map.js에 옮겨 적는다 — 지점 표 자리, 아이들이 걷는 길, 처음 확대해 들어갈 곳(광장), 공원 안 사람들.
// 그림은 가로 한 장(wide)뿐이다(2026-10-27 세로 그림을 뺌).
// 사용: node science-lab/tools/blender/park-apply.mjs <park-coords.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MAP = fileURLToPath(new URL('../../data/park-map.js', import.meta.url));
const f = process.argv[2];
if (!f) { console.error('좌표 파일을 주세요: park-coords.json'); process.exit(1); }
const W = JSON.parse(readFileSync(f, 'utf8')).wide;
if (!W) { console.error('wide 좌표가 없어요'); process.exit(1); }

const r = (p) => `[${p.map((v) => Math.round(v * 10) / 10).join(', ')}]`;
const list = (ps) => `[${ps.map(r).join(', ')}]`;
let src = readFileSync(MAP, 'utf8');
const swap = (re, text, what) => { if (!re.test(src)) { console.error(`못 찾음: ${what}`); process.exit(1); } src = src.replace(re, text); };

swap(/walk: \{ entrance: .*\} \},$/m, `walk: { entrance: { wide: ${list(W.entrance)} }, hub: { wide: ${r(W.hub)} } },`, 'walk');
swap(/start: \{ wide: \[.*?\](, tall: \[.*?\])? \},/, `start: { wide: ${r([...W.spots.gate, 2.0])} },`, 'start');
for (const id of Object.keys(W.spots)) {
  const re = new RegExp(`(\\{ id: '${id}',.*?)wide: \\[[^\\]]*\\](, tall: \\[[^\\]]*\\])?, path: \\{ wide: .*? \\} \\}`);
  swap(re, `$1wide: ${r(W.spots[id])}, path: { wide: ${list(W.walk[id] || [])} } }`, id);
}
// 공원 안의 다른 사람들(점 하나 = 서 있는 자리, 둘 이상 = 오가는 길)
if (W.npcs) {
  const line = `  npcs: { ${Object.keys(W.npcs).map((id) => `${id}: { wide: ${list(W.npcs[id])} }`).join(', ')} },`;
  if (/^  npcs: \{.*\},$/m.test(src)) src = src.replace(/^  npcs: \{.*\},$/m, line);
  else src = src.replace(/^  spots: \[/m, `  // 공원 안의 다른 사람들 — 누가 누구인지는 park-chars3d.js NPC_CAST\n${line}\n  spots: [`);
}
// 파도: 물가 선과 바다 쪽 선(화면 밖은 조금만 남기고 자른다 — 두 선의 점 수는 같게)
if (W.shore) {
  const keep = W.shore.edge.map((p, i) => [p, W.shore.out[i]]).filter(([a, b]) => [a, b].some((q) => q[0] > -10 && q[0] < 110 && q[1] > -10 && q[1] < 110));
  const line = `  shore: { wide: { edge: ${list(keep.map((k) => k[0]))}, out: ${list(keep.map((k) => k[1]))} } },`;
  if (/^  shore: \{.*\},$/m.test(src)) src = src.replace(/^  shore: \{.*\},$/m, line);
  else src = src.replace(/^  spots: \[/m, `  // 파도가 밀려오는 물가(edge)와 바다 쪽 선(out) — park.js가 그 사이에 움직이는 파도 줄을 그린다\n${line}\n  spots: [`);
}
writeFileSync(MAP, src);
console.log('옮김:', MAP);
