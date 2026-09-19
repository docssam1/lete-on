// 과학 문제은행 감사: node science-lab/bank/audit.mjs
// 검사: id 중복 · 필수 태그(grade·level·track) · 객관식 정답 위치 분포 · 정답이 유일한 최장 보기 · 학년에 이른 용어
import { readdirSync } from 'node:fs';
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

let fail = 0;
const err = (m) => { fail++; console.log('  ✗ ' + m); };
for (const f of readdirSync(unitsDir).filter((x) => x.endsWith('.js') && !x.endsWith('.lesson.js'))) {
  const { unit, items } = await import(pathToFileURL(join(unitsDir, f)).href);
  console.log(`${unit.id} ${unit.title}: ${items.length}문항`);
  const ids = new Set();
  const pos = [0, 0, 0, 0, 0];
  for (const it of items) {
    const t = it.taxonomy || {};
    if (ids.has(it.id)) err(`${it.id} id 중복`); ids.add(it.id);
    if (it.status !== 'authored') err(`${it.id} git에는 authored만 (status=${it.status})`);
    if (!t.grade) err(`${it.id} grade 없음`);
    if (!LEVELS.has(t.level)) err(`${it.id} level=${t.level}`);
    if (!TRACKS.has(t.track)) err(`${it.id} track=${t.track}`);
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
}
console.log(fail ? `실패 ${fail}건` : '통과');
process.exit(fail ? 1 : 0);
