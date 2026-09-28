// 서술형 채점 기준 감사: node science-lab/bank/written-audit.mjs
// 검사: 모든 서술형(본문+유사문항)이 정규 루브릭으로 풀리는지 · 요소 ID 중복 · 총점 = 요소 배점 합 · 배점 정수 ·
//       부분점수 규칙 id 중복 · cap/deduct 범위 · 규칙의 오개념 코드가 단원 진단표에 있는지 · 규칙이 가리키는 문항이 실제로 있는지
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { rubricOf } from './written-score.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const unitsDir = join(here, '..', 'data', 'units');
const load = async (f) => (existsSync(join(unitsDir, f)) ? import(pathToFileURL(join(unitsDir, f)).href) : null);

let fail = 0, total = 0, withRules = 0, rules = 0;
const err = (m) => { fail++; console.log('  ✗ ' + m); };

for (const f of readdirSync(unitsDir).filter((x) => /^s\d+-u\d+\.js$/.test(x))) {
  const base = f.replace(/\.js$/, '');
  const main = await load(f), sim = await load(`${base}.similar.js`), misc = await load(`${base}.misc.js`);
  const items = [...(main.items || []), ...(sim?.similar || [])];
  const written = items.filter((i) => i.answerContract?.type === 'written-explanation');
  const ids = new Set(items.map((i) => i.id));
  let n = 0, r = 0;
  for (const it of written) {
    let rb;
    try { rb = rubricOf(it, misc); } catch (e) { err(e.message); continue; }
    n++;
    if (!rb.criteria.length) err(`${it.id} 채점 요소 없음`);
    const cid = new Set();
    for (const c of rb.criteria) {
      if (cid.has(c.id)) err(`${it.id} 채점 요소 id 중복 ${c.id}`); cid.add(c.id);
      if (!Number.isInteger(c.points) || c.points < 1) err(`${it.id} ${c.id} 배점은 1 이상의 정수 (${c.points})`);
      if (!String(c.text || '').trim()) err(`${it.id} ${c.id} 요소 문장 없음`);
    }
    if (rb.total !== rb.sum) err(`${it.id} 총점 ${rb.total} ≠ 요소 배점 합 ${rb.sum}`);
    const pid = new Set();
    for (const p of rb.partial) {
      r++;
      if (!p.id || pid.has(p.id)) err(`${it.id} 부분점수 규칙 id 없음/중복 ${p.id}`); pid.add(p.id);
      if (!String(p.when || '').trim()) err(`${it.id} ${p.id} 조건 문장 없음`);
      const hasCap = typeof p.cap === 'number', hasDed = typeof p.deduct === 'number';
      if (hasCap === hasDed) err(`${it.id} ${p.id} cap과 deduct 중 정확히 하나`);
      if (hasCap && (!Number.isInteger(p.cap) || p.cap < 0 || p.cap >= rb.total)) err(`${it.id} ${p.id} cap은 0 이상 총점 미만 정수 (${p.cap})`);
      if (hasDed && (!Number.isInteger(p.deduct) || p.deduct < 1 || p.deduct > rb.total)) err(`${it.id} ${p.id} deduct 범위 (${p.deduct})`);
      if (p.m && !misc?.misconceptions?.[p.m]) err(`${it.id} ${p.id} 오개념 코드 ${p.m}가 ${base}.misc.js에 없음`);
    }
    if (rb.partial.length) withRules++;
  }
  for (const k of Object.keys(misc?.written || {})) {
    if (!ids.has(k)) err(`${base}.misc.js written에 없는 문항 ${k}`);
    else if (!written.some((i) => i.id === k)) err(`${base}.misc.js written의 ${k}는 서술형이 아님`);
  }
  total += n; rules += r;
  console.log(`${base}: 서술형 ${n}문항 · 부분점수 규칙 ${r}개`);
}
console.log(`\n서술형 ${total}문항 · 규칙 있는 문항 ${withRules} · 규칙 ${rules}개 · ${fail ? `실패 ${fail}` : '모두 통과'}`);
process.exit(fail ? 1 : 0);
