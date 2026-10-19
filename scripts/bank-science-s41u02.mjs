// 4-1 Ⅱ 물의 상태 변화 — 검수한 창작 80문항을 보존하고 원문 80문항만 연결한다.
// node scripts/bank-science-s41u02.mjs science-lab/bank/work/s41u02
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { importSourceOnly } from './bank-science-lib.mjs';
import { judge as authoredJudge } from '../science-lab/data/units/s41-u02.judge.js';
import { judgeText } from '../science-lab/v2/judge.js';

const dir = process.argv[2];
if (!dir) throw new Error('전사 작업 폴더를 지정하세요.');
const unit = 's41-u02';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const units = join(root, 'science-lab/data/units');
const marker = '// ── 단원평가 원문(source.js) ──';
const preserved = Object.fromEntries(['similar', 'taxonomy', 'misc', 'judge'].map((kind) => {
  const text = readFileSync(join(units, `${unit}.${kind}.js`), 'utf8');
  return [kind, kind === 'misc' || kind === 'judge' ? text.split(marker)[0].trimEnd() : text];
}));
const originals = [1, 2, 3, 4].flatMap((set) => JSON.parse(readFileSync(join(dir, `set${set}.json`), 'utf8')).map((q) => ({ ...q, key: `${set}-${q.no}` })));
assert.equal(originals.length, 80);
const figmap = JSON.parse(readFileSync(join(dir, 'figmap.json'), 'utf8'));
for (const name of new Set(Object.values(figmap))) assert(existsSync(join(dir, 'figs', `${name}.webp`)), name);
const copyJudge = (id) => structuredClone(authoredJudge[`${unit}-v${id}`]);

const melt = copyJudge('009');
melt.need[0].ask = '얼음이 녹으면 차지하는 자리(부피)는 어떻게 달라지나요?';
for (const wrong of melt.wrong || []) {
  if (wrong.m === 'M05') wrong.say = '얼음이 녹아도 물의 양은 그대로예요. 무게와 부피를 구별해 봐요.';
  if (wrong.m === 'M11') wrong.say = '얼음과자가 녹은 것과 물이 밖으로 나간 것을 구별해 봐요.';
}
const dew = copyJudge('018');
dew.need[0].ask = '풀잎의 물방울은 공기 중에 있던 무엇이 변한 것일까요?';
for (const wrong of dew.wrong || []) {
  if (wrong.m === 'M12') wrong.say = '맑은 날 풀잎의 물방울은 공기 중 수증기가 바뀐 거예요. 그 변화의 이름을 떠올려 봐요.';
}
const evaporate = copyJudge('023');
evaporate.need[0].ask = '페트리 접시의 물이 무엇으로 변해 어디로 갔을까요?';
for (const wrong of evaporate.wrong || []) wrong.say = '접시에 있던 물이 기체가 되어 어디로 갔을지 생각해 봐요.';
const condensationExamples = copyJudge('037');
const positive = '(?![가-힣]{0,5}(아니|아닌|아님|아닙|않|못))';
const repair = {
  need: [{
    t: '다래의 설명을 증발의 예로 바르게 고친다',
    ask: '누가 잘못 설명했나요? 빨래가 마르는 현상의 이름도 함께 고쳐 써 볼까요?',
    all: ['다래', `(?:증발|물(?:이|은|가)?[가-힣]{0,12}수증기로(?:변|바뀌|되))${positive}`],
  }],
  wrong: [{
    any: [`(?:단비|하늘)(?:가|이|는)?(?:잘못|틀렸)${positive}`, `빨래[가-힣]{0,15}끓(?:음|는|어)${positive}`],
    m: 'M08', say: '물을 끓이지 않고 젖은 빨래가 마를 때 어떤 상태 변화가 일어날까요?',
  }],
  ex: {
    ok: ['다래, 젖은 빨래를 건조대에 널어 말리는 것은 증발과 관련된 예이다.', '다래, 빨래가 마르는 것은 증발입니다.', '다래의 말은 끓음이 아니라 증발로 고쳐야 해요.'],
    part: [],
    no: ['다래', '빨래가 마르는 것은 증발입니다.', '하늘이 잘못 말했어요.', '다래, 빨래가 마르는 것은 끓음입니다.', '다래, 증발한 것이 아닙니다.'],
  },
};
const twoChanges = {
  need: [{
    t: '고드름이 물로, 물이 수증기로 변하는 두 과정',
    ask: '고드름이 무엇으로 바뀌고 그 물은 다시 무엇으로 바뀌나요?',
    all: [
      `(?:녹|(?:고드름|얼음|고체)[가-힣]{0,12}(?:물|액체)(?:로|이|가)(?:변|바뀌|되))${positive}`,
      `(?:증발|(?:물방울|물|액체)(?:(?!얼음|고체|응결|아니|않).){0,28}(?:수증기|기체)(?:인수증기)?(?:로|가)(?:변|바뀌|되))${positive}`,
    ],
  }],
  wrong: [{
    any: [`(?:스며|흡수|응결|끓(?:어|는|고|었))${positive}`],
    m: 'M03', say: '고드름이 녹는 과정과 물이 수증기가 되는 과정을 차례로 생각해 봐요.',
  }],
  ex: {
    ok: ['고드름이 녹아 물이 되고 그 물이 증발합니다.', '고체인 고드름이 액체인 물로 변하고 물이 기체인 수증기로 변합니다.', '녹는다, 증발한다.'],
    part: [],
    no: ['고드름이 녹는다.', '물이 증발한다.', '얼음이 녹아 수증기가 된다.', '고드름이 녹고 물이 접시에 스며든다.'],
  },
};
const judges = {
  'src:1-9': melt,
  'src:1-18': dew,
  'src:2-3': evaporate,
  'src:2-17': condensationExamples,
  'src:3-9': structuredClone(melt),
  'src:3-14': repair,
  'src:4-5': twoChanges,
  'src:4-16': structuredClone(condensationExamples),
};
const required = {
  'src:1-9': ['얼음이 녹을 때 부피가 줄어든다는 내용'],
  'src:1-18': ['수증기가 응결해 이슬이 맺힌다는 내용'],
  'src:2-3': ['물이 수증기로 변해 사라진다는 내용'],
  'src:2-17': ['서로 다른 응결의 예 두 가지'],
  'src:3-9': ['얼음이 녹을 때 부피가 줄어든다는 내용'],
  'src:3-14': ['다래의 설명을 빨래 말리기는 증발이라는 내용으로 고침'],
  'src:4-5': ['고드름이 물로, 물이 수증기로 변하는 두 과정을 설명'],
  'src:4-16': ['서로 다른 응결의 예 두 가지 이상'],
};

// 실제 파일을 쓰기 전에 공식 예시와 판정 회귀 예시를 확인한다.
for (const q of originals.filter((q) => q.format === '서술형')) {
  const key = judges[`src:${q.key}`];
  assert.equal(key.need.length, 1, q.key);
  assert.equal(judgeText(q.answer, key).st, 'ok', `${q.key} 공식 답`);
  for (const a of key.ex.ok) assert.equal(judgeText(a, key).st, 'ok', `${q.key}: ${a}`);
  for (const a of key.ex.no) for (const tries of [1, 2]) assert.notEqual(judgeText(a, key, { tries }).st, 'ok', `${q.key}: ${a}`);
}

await importSourceOnly({
  unit, dir, date: '2026-10-17', title: '4-1 Ⅱ 물의 상태 변화', uKey: 'u02',
  course: '초등 4-1', unitLabel: 'Ⅱ. 물의 상태 변화',
  sourceId: 'sci-41-2-cats', edition: '시매쓰DMC 최다빈출 단원평가',
  required, judge: judges,
  accept: { '4-9': ['늘어나, 줄어듭', '늘어난다, 줄어든다'] },
});
// 유사문항을 재구성했으므로 원문의 보기별 의미도 따로 대조한다.
// 한 문항의 첫 오개념을 모든 원문 오답에 복제하면 무게·부피 등이 섞인다.
const sourceDistractors = {
  '1-4': { 0: 'M03', 1: 'M03', 2: 'M03', 4: 'M03' },
  '1-5': { 0: 'M03', 1: 'M03', 2: 'M03', 4: 'M03' },
  '1-6': { 0: 'M14', 1: 'M14', 3: 'M14', 4: 'M14' },
  '1-7': { 0: 'M06', 2: 'M05', 3: 'M05', 4: 'M03' },
  '1-11': { 0: 'M11', 2: 'M04', 3: 'M08', 4: 'M08' },
  '1-16': { 0: 'M14', 2: 'M04', 4: 'M03' },
  '2-8': { 0: 'M06', 2: 'M06', 3: 'M05', 4: 'M05' },
  '3-7': { 1: 'M06', 2: 'M05', 3: 'M05', 4: 'M06' },
  '3-10': { 0: 'M11', 2: 'M11', 4: 'M08' },
  '3-11': { 0: 'M03', 1: 'M03', 2: 'M08', 4: 'M03' },
  '3-15': { 0: 'M14', 1: 'M07', 3: 'M03', 4: 'M12' },
  '3-16': { 0: 'M14', 1: 'M14', 2: 'M13', 4: 'M13' },
  '4-10': { 1: 'M05', 2: 'M05', 3: 'M05', 4: 'M05' },
  '4-11': { 0: 'M11', 1: 'M04', 2: 'M03', 3: 'M03' },
  '4-12': { 0: 'M08', 1: 'M08', 2: 'M08', 3: 'M08' },
  '4-15': { 0: 'M13', 1: 'M13', 2: 'M13', 3: 'M13' },
  '4-17': { 0: 'M14', 1: 'M03', 3: 'M14', 4: 'M14' },
};
const miscPath = join(units, `${unit}.misc.js`);
let miscText = readFileSync(miscPath, 'utf8');
const generated = miscText.slice(miscText.indexOf(marker));
const assignment = /Object.assign\(distractors, ([\s\S]*?)\);\nObject.assign\(typed,/;
const match = generated.match(assignment);
assert(match, '원문 보기별 오개념 블록');
const sourceMap = JSON.parse(match[1]);
for (const [key, mapping] of Object.entries(sourceDistractors)) {
  const [set, no] = key.split('-');
  const id = `${unit}-o${set}-${no.padStart(2, '0')}`;
  assert.deepEqual(Object.keys(mapping), Object.keys(sourceMap[id]), `${key} 오답 보기 보존`);
  sourceMap[id] = mapping;
}
miscText = miscText.slice(0, miscText.indexOf(marker)) + generated.replace(assignment,
  () => `Object.assign(distractors, ${JSON.stringify(sourceMap, null, 2)});\nObject.assign(typed,`);
miscText = miscText.replace('// 짝 유사문항의 오개념을 그대로 쓴다. scripts/bank-science-lib.mjs importSourceOnly가 쓴 블록 — 손으로 고치지 말 것.',
  '// 짝 유사문항의 오개념을 기본으로 원문 보기별 의미를 대조했다. scripts/bank-science-s41u02.mjs에서 다시 만든다.');
writeFileSync(miscPath, miscText);
// 생성 도구의 옛 검수자 표기만 현재 검수 역할로 바꾼다.
const sourcePath = join(units, `${unit}.source.js`);
writeFileSync(sourcePath, readFileSync(sourcePath, 'utf8').replaceAll('"checkedBy": "Claude"', '"checkedBy": "원문 대조"'));
for (const [kind, before] of Object.entries(preserved)) {
  const text = readFileSync(join(units, `${unit}.${kind}.js`), 'utf8');
  assert.equal(kind === 'misc' || kind === 'judge' ? text.split(marker)[0].trimEnd() : text, before, `${kind} 창작 영역 보존`);
}
await import('./bank-science-s41u02-supplement.mjs');
