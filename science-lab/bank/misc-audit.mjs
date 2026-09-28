// 오개념 진단표 감사: node science-lab/bank/misc-audit.mjs [단원id…]
// 16·17차에 세션마다 따로 짜던 검증 스크립트를 상설화한 것.
// 검사:
//  - 오개념 정의: label·fix·element·terms, element가 단원 taxonomy에 있는지
//  - distractors: 선택형(single-choice·multi-choice) 전부 있는지 · 번호가 보기 범위 안인지 · **정답 번호를 오답으로 적지 않았는지**
//    (부정 발문 「틀린 것 고르기」도 같은 규칙: 정답 = 골라야 하는 보기, 그 번호는 적지 않는다)
//  - typed: 단답형(short-text) 전부 있는지 · any/pats의 코드
//  - cloze: 빈칸 문항 전부 · 빈칸 수 = options 줄 수 · 각 줄에 정답 포함 · wrong 코드
//  - cells: 표 채우기 전부
//  - 모든 오개념에 근거 문항이 1개 이상 · remedy가 모든 오개념을 1~5단계로 덮는지
//  - 진단표가 가리키는 문항 id가 실제로 있는지
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..', 'data', 'units');
const load = (f) => (existsSync(join(dir, f)) ? import(pathToFileURL(join(dir, f)).href) : Promise.resolve(null));
const only = new Set(process.argv.slice(2));

let fail = 0;
for (const f of readdirSync(dir).filter((x) => /^s\d+-u\d+\.misc\.js$/.test(x))) {
  const u = f.replace('.misc.js', '');
  if (only.size && !only.has(u)) continue;
  const errs = [];
  const err = (m) => errs.push(m);
  const [misc, main, sim, tax] = await Promise.all([load(f), load(`${u}.js`), load(`${u}.similar.js`), load(`${u}.taxonomy.js`)]);
  const items = [...(main?.items || []), ...(sim?.similar || [])];
  const byId = new Map(items.map((i) => [i.id, i]));
  const M = misc.misconceptions || {};
  const elements = new Set((tax?.taxonomy?.elements || []).map((e) => e.id));
  const used = new Map(Object.keys(M).map((k) => [k, 0]));
  const use = (m, where) => { if (!M[m]) err(`${where}: 없는 오개념 ${m}`); else used.set(m, used.get(m) + 1); };

  for (const [k, v] of Object.entries(M)) {
    if (!/^M\d{2}$/.test(k)) err(`오개념 코드 형식 ${k}`);
    for (const fld of ['label', 'fix', 'element']) if (!String(v[fld] ?? '').trim()) err(`${k} ${fld} 없음`);
    if (!Array.isArray(v.terms) || !v.terms.length) err(`${k} terms 없음`);
    if (elements.size && !elements.has(v.element)) err(`${k} element ${v.element}가 taxonomy에 없음`);
  }

  const D = misc.distractors || {}, T = misc.typed || {}, C = misc.cloze || {}, CE = misc.cells || {};
  for (const tbl of [['distractors', D], ['typed', T], ['cloze', C], ['cells', CE]])
    for (const id of Object.keys(tbl[1])) if (!byId.has(id)) err(`${tbl[0]}: 없는 문항 ${id}`);

  let nSel = 0, nTyped = 0, nCloze = 0, nCells = 0;
  for (const it of items) {
    const ac = it.answerContract || {}, t = ac.type;
    if (t === 'single-choice' || t === 'multi-choice') {
      nSel++;
      const d = D[it.id];
      if (!d) { err(`${it.id} 선택형인데 distractors 없음`); continue; }
      const right = new Set(t === 'single-choice' ? [ac.answer] : ac.answers);
      const n = (it.choices || []).length;
      if (!Object.keys(d).length) err(`${it.id} distractors가 비어 있음`);
      for (const [i, m] of Object.entries(d)) {
        const k = Number(i);
        if (!Number.isInteger(k) || k < 0 || k >= n) err(`${it.id} 보기 번호 ${i} 범위 밖(보기 ${n}개)`);
        if (right.has(k)) err(`${it.id} 정답 보기 ${k}를 오답으로 적음`);
        use(m, it.id);
      }
    } else if (t === 'short-text') {
      nTyped++;
      const ty = T[it.id];
      if (!ty) { err(`${it.id} 단답형인데 typed 없음`); continue; }
      if (!ty.any && !(ty.pats || []).length) err(`${it.id} typed에 any·pats 둘 다 없음`);
      if (ty.any) use(ty.any, it.id);
      for (const [re, m] of ty.pats || []) { if (!(re instanceof RegExp)) err(`${it.id} pats 정규식 아님`); use(m, it.id); }
    } else if (t === 'cloze') {
      nCloze++;
      const c = C[it.id];
      if (!c) { err(`${it.id} 빈칸인데 cloze 없음`); continue; }
      const blanks = ac.blanks || [];
      if (!Array.isArray(c.options) || c.options.length !== blanks.length) err(`${it.id} cloze options ${c.options?.length}줄 ≠ 빈칸 ${blanks.length}개`);
      else c.options.forEach((row, bi) => {
        const ok = [blanks[bi].answer, ...(blanks[bi].accepted || [])];
        if (!row.some((o) => ok.includes(o))) err(`${it.id} 빈칸 ${bi + 1} 칩에 정답 없음`);
        if (new Set(row).size !== row.length) err(`${it.id} 빈칸 ${bi + 1} 칩 중복`);
        if (row.length < 2) err(`${it.id} 빈칸 ${bi + 1} 칩이 1개`);
      });
      use(c.wrong, it.id);
    } else if (t === 'table-fill') {
      nCells++;
      if (!CE[it.id]) err(`${it.id} 표 채우기인데 cells 없음`); else use(CE[it.id], it.id);
    }
  }
  for (const [chip, v] of Object.entries(misc.bookChips || {})) use(v[1], `bookChips ${chip}`);
  for (const [m, n] of used) if (!n) err(`${m} 근거 문항 없음`);
  const R = misc.remedy || {};
  for (const m of Object.keys(M)) { const s = R[m]?.step; if (!(s >= 1 && s <= 5)) err(`remedy ${m} 단계 없음`); }
  for (const m of Object.keys(R)) if (!M[m]) err(`remedy에 없는 오개념 ${m}`);

  fail += errs.length;
  console.log(`${u}: 오개념 ${Object.keys(M).length} · 선택형 ${nSel} · 단답형 ${nTyped} · 빈칸 ${nCloze} · 표 ${nCells} → ${errs.length ? `오류 ${errs.length}` : '통과'}`);
  for (const e of errs) console.log('  ✗ ' + e);
  const counts = [...used].map(([m, n]) => `${m}:${n}`).join(' ');
  console.log('  근거 수 ' + counts);
}
process.exit(fail ? 1 : 0);
