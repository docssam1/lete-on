// 원문·짝 서술형의 예시 답, 반대 방향·부정 답, 부분 답을 첫 시도와 재시도에서 확인한다.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { judgeText, judgeShort } from '../../../v2/judge.js';
const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
const judge = read('judge-reviewed.json');
const supplementJudge = read('supplement-judge.json');
const source = [1, 2, 3, 4].flatMap((set) => read(`set${set}.json`).map((q) => ({ ...q, key: `${set}-${q.no}` })));
const similar = ['a', 'b'].flatMap((n) => read(`sim/${n}.json`));
const errors = [], examples = { ok: 0, part: 0, no: 0 }, samples = [];
for (const [role, list] of [['src', source], ['sim', similar]]) for (const q of list) {
  if ((q.format || q.fmt) === '서술형') {
    const k = `${role}:${q.key}`, rule = judge[k];
    assert(rule, `판정표 누락: ${k}`);
    assert(rule.need?.length && rule.need.every((n) => n.t && n.ask), `판정 기준 누락: ${k}`);
    const sample = role === 'src' ? q.answer : q.sample;
    for (const tries of [1, 2]) {
      const r = judgeText(sample, rule, { tries });
      if (r.st !== 'ok') errors.push({ key: k, sample: true, tries, answer: sample, result: r });
    }
    samples.push(k);
  } else if ((q.format || q.fmt) === '단답형') {
    for (const answer of [q.answer, ...(q.accepted || [])]) assert.equal(judgeShort(answer, [q.answer, ...(q.accepted || [])]).st, 'ok');
  }
}
for (const q of read('supplement.json')) {
  if (q.answerContract.type === 'written-explanation') {
    const rule = supplementJudge[q.id];
    assert(rule, `보충 판정표 누락: ${q.id}`);
    for (const tries of [1, 2]) {
      const r = judgeText(q.answerContract.sample, rule, { tries });
      if (r.st !== 'ok') errors.push({ key: q.id, sample: true, tries, answer: q.answerContract.sample, result: r });
    }
    samples.push(q.id);
  }
}
for (const [k, rule] of Object.entries({ ...judge, ...supplementJudge })) {
  for (const kind of ['ok', 'part', 'no']) for (const answer of rule.ex[kind] || []) {
    examples[kind]++;
    for (const tries of [1, 2]) {
      const r = judgeText(answer, rule, { tries });
      const valid = kind === 'ok' ? r.st === 'ok' : kind === 'part' ? (tries === 1 ? r.st === 'part' : r.st !== 'ok') : r.st !== 'ok';
      if (!valid) errors.push({ key: k, kind, tries, answer, result: r });
    }
  }
}
const report = { passed: errors.length === 0, written: samples.length, rules: Object.keys(judge).length + Object.keys(supplementJudge).length, samplesPerTry: samples.length, examples, tries: [1, 2], errors };
if (process.argv.includes('--save')) writeFileSync(new URL('judge-validation-20261017.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = errors.length ? 1 : 0;
