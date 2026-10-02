const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const context = { window: {} };
for (const file of ['data.js', 'grading.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}

const question = context.window.HSMIDDLE_DATA.questions.find(item => item[0] === 20);
const isCorrect = value => context.window.HSMIDDLE_GRADING.isCorrect(question, value);
assert.equal(question[1], '124/123, 235/234, 346/345');
assert(124 * 234 > 235 * 123);
assert(235 * 345 > 346 * 234);
for (const answer of [question[1], '124/123 > 235/234 > 346/345', 'ㄱ, ㄷ, ㄴ']) {
  assert(isCorrect(answer), `20번 정답 인정: ${answer}`);
}
for (const answer of ['346/345, 235/234, 124/123', 'ㄱ, ㄴ, ㄷ', '124/123, 346/345, 235/234']) {
  assert(!isCorrect(answer), `20번 오답 거절: ${answer}`);
}

const viewer = fs.readFileSync(path.join(root, 'viewer.html'), 'utf8');
assert(viewer.includes('20번: 왼쪽 분수부터 ㄱ, ㄴ, ㄷ'));
assert(viewer.includes('분수는 왼쪽부터 ㄱ, ㄴ, ㄷ'));
console.log('사전 점검 20번: 원본 누락 표시, 분수 순서, 기존 문자 답 채점 검사 통과');
