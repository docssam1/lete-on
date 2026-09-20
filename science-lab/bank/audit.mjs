// 과학 문제은행 감사: node science-lab/bank/audit.mjs
// 검사: id 중복 · 필수 태그(grade·level·track·element·type·format) · 분류 체계 존재 여부
//      · 유사문항 1:1 대응과 유형별 개수 · 객관식 정답 위치 분포 · 정답이 유일한 최장 보기 · 학년에 이른 용어
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const unitsDir = join(here, '..', 'data', 'units');
// 학년별로 아직 배우지 않은 용어(본문 금지, answerContract.rubric.preview 안에서만 허용)
const EARLY_TERMS = {
  3: ['자기장', '자기력선', '전자석', '전류', '코일', '자화', '원자', '분자', '에너지 전환'],
  4: ['자기장', '자기력선', '전자석', '전류', '코일', '자화', '원자', '분자', '에너지 전환'],
  5: ['자기장', '자기력선', '전자석', '코일', '원자', '분자'],
  6: ['자기력선', '원자', '분자'],
};
const LEVELS = new Set(['기본', '심화', '영재']);
const TRACKS = new Set(['교과', '영재성']);

// 단원별 분류 체계(git, 원문 없음). 파일이 있으면 element·type·format을 대조한다.
const taxDir = join(here, 'taxonomy');
const taxOf = (unitId) => {
  const f = join(taxDir, `${unitId}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
};

let fail = 0;
const err = (m) => { fail++; console.log('  ✗ ' + m); };
for (const f of readdirSync(unitsDir).filter((x) => x.endsWith('.js') && !x.endsWith('.lesson.js'))) {
  const { unit, items } = await import(pathToFileURL(join(unitsDir, f)).href);
  console.log(`${unit.id} ${unit.title}: ${items.length}문항`);
  const tax = taxOf(unit.id);
  if (!tax) console.log('  · 분류 체계 파일 없음 — element·type 검사 건너뜀');
  const elIds = tax ? new Set(tax.elements.map((e) => e.id)) : null;
  const tyIds = tax ? new Set(tax.types.map((t) => t.id)) : null;
  const tyEl = tax ? Object.fromEntries(tax.types.map((t) => [t.id, t.element])) : {};
  const tyName = tax ? Object.fromEntries(tax.types.map((t) => [t.id, t.name])) : {};
  const fmts = tax ? new Set(tax.formats) : null;
  const simByType = {}, simOf = new Set();
  const ids = new Set();
  const pos = [0, 0, 0, 0, 0];
  for (const it of items) {
    const t = it.taxonomy || {};
    if (ids.has(it.id)) err(`${it.id} id 중복`); ids.add(it.id);
    if (it.status !== 'authored') err(`${it.id} git에는 authored만 (status=${it.status})`);
    if (!t.grade) err(`${it.id} grade 없음`);
    if (!LEVELS.has(t.level)) err(`${it.id} level=${t.level}`);
    if (!TRACKS.has(t.track)) err(`${it.id} track=${t.track}`);
    if (tax) {
      if (!elIds.has(t.element)) err(`${it.id} element=${t.element} — 분류 체계에 없음`);
      if (!tyIds.has(t.type)) err(`${it.id} type=${t.type} — 분류 체계에 없음`);
      else if (tyEl[t.type] !== t.element) err(`${it.id} type ${t.type}은 ${tyEl[t.type]} 소속인데 element=${t.element}`);
      if (!fmts.has(t.format)) err(`${it.id} format=${t.format} — 분류 체계에 없음`);
    }
    if (it.sourceRef?.type === 'similar') {
      if (!it.sourceRef.of) err(`${it.id} 유사문항인데 sourceRef.of 없음`);
      else if (simOf.has(it.sourceRef.of)) err(`${it.id} sourceRef.of 중복 — ${it.sourceRef.of}`);
      else simOf.add(it.sourceRef.of);
      simByType[t.type] = (simByType[t.type] || 0) + 1;
      const body2 = [it.prompt, JSON.stringify(it.choices ?? ''), it.explanation].join(' ');
      if (/\b\d+\s*번\s*문항|앞의\s*\d+번|위\s*\d+번/.test(body2)) err(`${it.id} 원래 문항 번호가 드러남`);
    }
    const body = [it.prompt, JSON.stringify(it.givens ?? ''), JSON.stringify(it.choices ?? ''), it.explanation,
      it.answerContract?.sample ?? '', JSON.stringify(it.answerContract?.blanks ?? '')].join(' ');
    for (const w of EARLY_TERMS[t.grade] ?? []) if (body.includes(w)) err(`${it.id} ${t.grade}학년에 이른 용어 "${w}"`);
    if (it.answerContract?.type === 'single-choice') {
      const a = it.answerContract.answer, L = it.choices.map((c) => c.length);
      pos[a]++;
      if (L[a] === Math.max(...L) && L.filter((x) => x === L[a]).length === 1 && Math.max(...L) - [...L].sort((x, y) => y - x)[1] >= 3)
        err(`${it.id} 정답이 눈에 띄게 가장 긴 보기`);
    }
  }
  const sc = pos.reduce((a, b) => a + b, 0);
  console.log(`  객관식 ${sc}개 정답 위치 ①~⑤ = ${pos.join('·')}`);
  if (sc >= 5 && Math.max(...pos) - Math.min(...pos) > 2) err('정답 위치 쏠림');
  const cnt = (k) => items.reduce((m, i) => ((m[i.taxonomy[k]] = (m[i.taxonomy[k]] || 0) + 1), m), {});
  console.log('  수준', JSON.stringify(cnt('level')), '갈래', JSON.stringify(cnt('track')));
  if (tax) {
    const total = Object.values(simByType).reduce((a, b) => a + b, 0);
    console.log(`  유사문항 ${total}개 — 유형별(원문 수 → 유사문항 수)`);
    for (const t of tax.types) {
      const got = simByType[t.id] || 0;
      const mark = got === t.sourceCount ? ' ' : '!';
      console.log(`   ${mark} ${t.id} ${tyName[t.id]}: ${t.sourceCount} → ${got}`);
      if (got !== t.sourceCount) err(`${t.id} 유사문항 수가 원문 수와 다름 (${t.sourceCount} → ${got})`);
    }
  }
}
console.log(fail ? `실패 ${fail}건` : '통과');
process.exit(fail ? 1 : 0);
