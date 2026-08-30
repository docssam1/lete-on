/* 3개국어 혼입 검사 — 신규 스레드·레벨의 name/label/concept/prompt.
   ko에 한자(중국어 전용) · en에 한글/한자 · zh에 한글이 섞이면 잡는다. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'); global.window = global;
for (const f of ['engine/rng.js', 'engine/generators.js']) { try { eval(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) {} }
for (const f of fs.readdirSync(path.join(ROOT, 'engine/threads'))) eval(fs.readFileSync(path.join(ROOT, 'engine/threads', f), 'utf8'));
eval(fs.readFileSync(path.join(ROOT, 'data/threads.js'), 'utf8'));

const HANGUL = /[가-힣㄰-㆏]/;
const HANJA  = /[一-鿿]/;
const TARGETS = [['FR5',[1,2]], ['MX3',[1,2,3,4,5]], ['DC3',[1,2]], ['EL5',[1,2,3]], ['AD10',[1,2,3]]];
const bad = [];
let n = 0;

/* MX3L2(할푼리)는 이번 작업 이전부터 있던 레벨이고, 영어 프롬프트가
   "Korean decimal ratios (할·푼·리)"처럼 한국어 고유 용어를 일부러 병기한다.
   혼입이 아니라 의도된 용어 병기라 검사에서 뺀다. */
const ALLOW = ['MX3L2.prompt'];

function check(where, tri) {
  if (!tri) return;
  if (ALLOW.some(a => where.startsWith(a))) return;
  n++;
  if (HANJA.test(tri.ko || ''))                                 bad.push(`${where}.ko 에 한자: ${tri.ko}`);
  if (HANGUL.test(tri.en || '') || HANJA.test(tri.en || ''))    bad.push(`${where}.en 에 한글/한자: ${tri.en}`);
  if (HANGUL.test(tri.zh || ''))                                bad.push(`${where}.zh 에 한글: ${tri.zh}`);
  for (const k of ['ko', 'en', 'zh']) if (!tri[k]) bad.push(`${where}.${k} 비어 있음`);
}

for (const [id, lvs] of TARGETS) {
  const th = NM_THREADS[id];
  check(`${id}.name`, th.name);
  check(`${id}.concept`, th.concept);
  for (const lv of lvs) {
    const L = th.levels.find(x => x.id === lv);
    if (!L) { bad.push(`${id}L${lv} 없음`); continue; }
    check(`${id}L${lv}.label`, L.label);
    const rng = NM_RNG.mulberry32(4242 + lv);
    for (let i = 0; i < 400; i++) check(`${id}L${lv}.prompt`, NM_TGEN[th.gen](L.params || {}, rng).prompt);
  }
}

console.log(`검사한 3개국어 묶음: ${n}`);
if (bad.length) { console.log(`[FAIL] ${bad.length}건`); [...new Set(bad)].slice(0, 20).forEach(b => console.log('  ' + b)); process.exit(1); }
console.log('통과 — 언어 혼입 0건.');
