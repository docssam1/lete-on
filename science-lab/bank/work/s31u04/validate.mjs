// 원문 동결·교재 출처·원문과 짝 문항의 계약 검사. 채점·실제 화면 검증과 구분한다.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { judgeShort } from '../../../v2/judge.js';

const dir = dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(readFileSync(join(dir, name), 'utf8'));
const sha = (name) => createHash('sha256').update(readFileSync(join(dir, name))).digest('hex');
const manifest = read('source-manifest.json'), map = read('map.json');
const books = Object.fromEntries(manifest.books.map((b) => [b.id, b]));
const raw = [1, 2, 3, 4].flatMap((set) => read(`set${set}.json`).map((q) => ({ ...q, set, key: `${set}-${q.no}` })));
const sim = ['a', 'b'].flatMap((name) => read(`sim/${name}.json`));
const byKey = new Map(sim.map((q) => [q.key, q]));
const figures = read('figmap.json'), figureProvenance = read('figure-provenance.json');
const sourceIdentities = new Set();
const counts = { sc: 0, mc: 0, st: 0, wr: 0 }, position = [0, 0, 0, 0, 0], perType = {};
for (const [name, hash] of Object.entries(manifest.rawHashes)) assert.equal(sha(name), hash, `동결 원문 변경: ${name}`);
for (const [name, hash] of Object.entries(manifest.figureHashes)) assert.equal(sha(`figs/${name}`), hash, `그림 변경: ${name}`);
assert.equal(raw.length, manifest.selectedBankQuestionCount);
assert.equal(sim.length, raw.length);
assert.equal(byKey.size, raw.length, '짝 문항 키 중복');
assert.equal(Object.keys(map.map).length, raw.length);
assert.equal(manifest.sourceQuestionCount, raw.length + manifest.excluded.length + read('performance-source.json').length);
assert.equal(read('performance-source.json')[0].format, '그림형');

for (const q of raw) {
  const s = byKey.get(q.key), p = q.provenance, b = books[p.book];
  assert(b && p.section && p.originalNo, `교재 출처 없음: ${q.key}`);
  assert(Number.isInteger(q.page) && q.page >= 1 && q.page <= b.pages, `원문 쪽수: ${q.key}`);
  assert(b.reviewedPages.includes(q.page), `지면 미확인: ${q.key}`);
  const identity = [p.book, q.page, p.section, p.originalNo].join('/');
  assert(!sourceIdentities.has(identity), `같은 원문 중복: ${identity}`);
  sourceIdentities.add(identity);
  const selected = manifest.selected.find((r) => r.key === q.key);
  assert(selected && selected.book === p.book && selected.page === q.page && selected.originalNo === p.originalNo && selected.section === p.section, `출처 목록 불일치: ${q.key}`);
  assert(s && s.T === map.map[q.key], `짝 유형 불일치: ${q.key}`);
  assert.equal(s.fmt, q.format, `답 형식 불일치: ${q.key}`);
  assert(q.prompt.trim() && q.answer.trim() && s.prompt.trim() && s.explanation.trim(), `본문·정답 누락: ${q.key}`);
  assert.notEqual(s.prompt, q.prompt, `발문 복사: ${q.key}`);
  const answerPositions = [...q.answer].filter((c) => '①②③④⑤'.includes(c));
  const expectedKind = q.choices ? (answerPositions.length === 1 ? 'sc' : 'mc') : q.format === '서술형' ? 'wr' : 'st';
  assert.equal(s.kind, expectedKind, `응답 계약 불일치: ${q.key}`);
  assert.equal(q.rubric, null, `존재하지 않는 공식 배점표 생성: ${q.key}`);
  counts[s.kind]++;
  perType[s.T] = (perType[s.T] || 0) + 1;
  assert(map.misconceptions[s.m], `오개념 없음: ${q.key}`);
  if (s.kind === 'sc' || s.kind === 'mc') {
    assert.equal(s.choices.length, 5, `보기 수: ${q.key}`);
    assert.equal(new Set(s.choices).size, 5, `중복 보기: ${q.key}`);
    const answers = [].concat(s.answer);
    assert(answers.every((a) => Number.isInteger(a) && a >= 0 && a < 5), `정답 범위: ${q.key}`);
    if (s.kind === 'mc') {
      assert.equal(answers.length, new Set(answers).size);
      assert.equal(answers.length, answerPositions.length, `복수 정답 수 불일치: ${q.key}`);
      assert(s.prompt.includes(`정답 ${answers.length}개`), `정답 개수 안내: ${q.key}`);
    } else {
      position[s.answer]++;
      for (const trimSpaces of [false, true]) {
        const lengths = s.choices.map((c) => (trimSpaces ? c.replace(/\s/g, '') : c).length);
        const sorted = [...lengths].sort((a, b) => b - a);
        assert(!(lengths[s.answer] === sorted[0] && sorted[0] - sorted[1] >= 3), `정답 보기 길이 단서: ${q.key}`);
      }
    }
  } else if (s.kind === 'st') {
    for (const item of [q, s]) for (const answer of [item.answer, ...(item.accepted || [])]) {
      assert.equal(judgeShort(answer, [item.answer, ...(item.accepted || [])]).st, 'ok');
    }
    assert.notEqual(judgeShort('모르겠어요', s.accepted).st, 'ok');
  } else {
    assert(s.sample && s.required?.length, `서술형 원고 누락: ${q.key}`);
  }
  if (q.figure) assert(figures[q.key], `그림 연결 누락: ${q.key}`);
}
assert(Math.max(...position) - Math.min(...position) <= 2, '단일 선택 정답 위치 쏠림');
for (const t of Object.keys(map.types)) assert(perType[t] >= 2, `원문 두 개 미만 유형: ${t}`);
for (const [key, name] of Object.entries(figures)) {
  assert(raw.some((q) => q.key === key));
  assert(existsSync(join(dir, `figs/${name}.webp`)));
  assert(figureProvenance.some((f) => f.file === `${name}.webp` && (f.key === key || f.keys?.includes(key))), `그림 자르기 출처 누락: ${key}`);
}
const report = {
  phase: '원문 동결·출처·짝 문항 초안 계약',
  passed: true, original: raw.length, similarDraft: sim.length,
  excluded: manifest.excluded.length,
  drawingPerformanceCount: read('performance-source.json').length,
  drawingPerformanceSoftwareReady: read('performance-source.json').every((p) => Boolean(p.implementation?.review)),
  figures: new Set(Object.values(figures)).size, figureReferences: Object.keys(figures).length,
  types: perType, formats: counts, singleChoicePositions: position,
  judgeVerificationIncluded: false, runtimeVerificationIncluded: false, fullUnitComplete: false,
};
// 보충은 원문과 별개로 세고, 모든 유형에 고르게 작성했는지 확인한다.
const supplement = read('supplement.json'), supplementMis = read('supplement-mis.json');
const supplementByType = {}, supplementPositions = [0, 0, 0, 0, 0], supplementFormats = {};
const prompts = new Set([...raw, ...sim].map((q) => q.prompt));
assert.equal(supplement.length, 64);
for (const q of supplement) {
  assert.equal(q.sourceRef.type, 'authored-supplement');
  assert(!prompts.has(q.prompt), `같은 발문 중복: ${q.id}`);
  prompts.add(q.prompt);
  assert(q.taxonomy.concept && q.explanation && supplementMis[q.id]);
  const t = q.taxonomy.type, ac = q.answerContract;
  assert(map.types[t]);
  supplementByType[t] = (supplementByType[t] || 0) + 1;
  supplementFormats[ac.type] = (supplementFormats[ac.type] || 0) + 1;
  assert.equal(q.responseContract, ac.type);
  if (q.choices) {
    assert.equal(q.choices.length, 5);
    assert.equal(new Set(q.choices).size, 5);
    const answers = ac.type === 'single-choice' ? [ac.answer] : ac.answers;
    assert(answers.every((a) => Number.isInteger(a) && a >= 0 && a < 5));
    if (ac.type === 'multi-choice') {
      assert.equal(new Set(answers).size, answers.length);
      assert(q.prompt.includes(`정답 ${answers.length}개`));
    } else {
      supplementPositions[ac.answer]++;
      for (const trimSpaces of [false, true]) {
        const lengths = q.choices.map((c) => (trimSpaces ? c.replace(/\s/g, '') : c).length);
        const sorted = [...lengths].sort((a, b) => b - a);
        assert(!(lengths[ac.answer] === sorted[0] && sorted[0] - sorted[1] >= 3), `보충 정답 보기 길이 단서: ${q.id} ${lengths}`);
      }
    }
  } else if (ac.type === 'short-text') {
    for (const answer of [ac.answer, ...ac.accepted]) assert.equal(judgeShort(answer, ac.accepted).st, 'ok');
    assert.equal(judgeShort('모르겠어요', ac.accepted).st, 'no');
  } else {
    assert(ac.sample && ac.rubric.required.length);
    assert(read('supplement-judge.json')[q.id], `보충 서술형 판정표 누락: ${q.id}`);
  }
}
for (const t of Object.keys(map.types)) assert.equal(supplementByType[t], 8, `유형별 보충 부족: ${t}`);
assert.deepEqual(supplementPositions, [8, 8, 8, 8, 8]);
report.supplement = { count: supplement.length, perType: supplementByType, formats: supplementFormats, singleChoicePositions: supplementPositions };
if (process.argv.includes('--save')) writeFileSync(join(dir, 'validation-20261017.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
