#!/usr/bin/env node
/* ============================================================
   문장제(WP) 검산기 — 2026-08-29
   ============================================================
   WP1(문제 이해) · WP3(연산 찾기)는 다른 스레드와 결정적으로 다르다.
   **정답이 수식에서 나오지 않고 문장에서 나온다.** 그래서 인쇄 검사기
   (check-print)나 화면 검사기(check-answerable)로는 아무것도 확인되지
   않는다 — 둘 다 "문항이 성립하는가"만 보고, 문장이 상황과 맞는지는 못 본다.
   `2 + 3 = □`이면 답이 5라는 걸 기계가 알지만, "몇 개 더 많은가"가 뺄셈이라는
   건 상황 데이터(kind)를 봐야 안다.

   그래서 여기서는 레벨마다 수천 개를 생성해 **상황(situation)과 문장과 정답이
   서로 맞는지**를 직접 확인한다.

     1. 의미 유형 ↔ 연산   합병·첨가=+ / 구잔·구차=− / 배수=× / 등분·포함=÷
                           (구차가 −라는 것이 이 스레드의 존재 이유다)
     2. 레벨 연산 범위      A=+−× · B=+−×÷ · C=+−(분수·소수)
     3. 정답이 상황에서 나오는가
        WP3 op   — 고른 보기가 상황의 연산 이름인가
        WP3 expr — 고른 식이 n1 (연산) n2 인가, 나머지 보기는 전부 다른 식인가
        WP3 same — 고른 보기만 문두와 같은 연산인가(오답이 같은 연산이면 복수정답)
        WP1 target — 고른 보기가 '구하는 것'이고 오답은 전부 '주어진 것'인가
        WP1 given  — 답이 n1이나 n2 중 물은 쪽인가
        WP1 need   — 답이 잡음 수이고, 문제에 실제로 쓰이는 수와 다른가
     4. 수량사 일치        "사자가 3송이"를 기계가 잡는다. 한국어 문장에 나온
                           수량사가 그 대상에 못 박아 둔 수량사(개·장·자루·송이·
                           마리·권)와 같은지, 중국어 양사도 같은지 본다.
     5. 3개 언어 채움       ko/en/zh가 전부 있고 서로 다르며 언어 혼입이 없는가
                           (한국어 문장의 m·L·kg는 단위 기호이므로 예외)
     6. 정답 쏠림          한 값이 45%를 넘으면 안 읽고 찍어도 통과한다
     7. 유일해             보기에 같은 문장이 두 번 나오면 안 된다

   쓰는 법: node scripts/check-wp-word-problems.js [레벨당 생성 수]
   실패가 하나라도 있으면 exit 1.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = global;

for (const f of ['engine/rng.js', 'engine/generators.js']) {
  try { eval(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) {}
}
for (const f of fs.readdirSync(path.join(ROOT, 'engine/threads'))) {
  eval(fs.readFileSync(path.join(ROOT, 'engine/threads', f), 'utf8'));
}
eval(fs.readFileSync(path.join(ROOT, 'data/threads.js'), 'utf8'));

const N = parseInt(process.argv[2], 10) || 4000;

/* 의미 유형 → 연산. 생성기와 따로 적어 둔다 — 생성기의 표를 그대로 읽어 오면
   그 표가 틀렸을 때 검사기도 같이 틀린다. */
const KIND_OP = { 합병:'+', 첨가:'+', 구잔:'−', 구차:'−', 배수:'×', 등분:'÷', 포함:'÷' };
const RANGE_OPS = { A:['+','−','×'], B:['+','−','×','÷'], C:['+','−'] };
const OPNAME_KO = { '+':'더하기', '−':'빼기', '×':'곱하기', '÷':'나누기' };

/* 대상 → 한국어 수량사 / 중국어 양사. 생성기 표와 별개로 다시 적었다.
   여기가 생성기와 어긋나면 그건 둘 중 하나가 틀렸다는 뜻이고, 그게 이 검사의 요점이다. */
const UNIT_KO = {
  사과:'개', 귤:'개', 쿠키:'개', 사탕:'개', 젤리:'개', 인형:'개', 블록:'개',
  색종이:'장', 스티커:'장', '캐릭터 카드':'장', 연필:'자루', 공책:'권', 동화책:'권',
  장미:'송이', 병아리:'마리', 금붕어:'마리', 토끼:'마리'
};
const UNIT_ZH = {
  苹果:'个', 橘子:'个', 饼干:'块', 糖果:'颗', 软糖:'颗', 玩偶:'个', 积木:'块',
  彩纸:'张', 贴纸:'张', 角色卡片:'张', 铅笔:'支', 笔记本:'本', 故事书:'本',
  玫瑰:'朵', 小鸡:'只', 金鱼:'条', 兔子:'只'
};
/* 한국어 문장에 나올 수 있는 모든 수량사 — 그릇(상자·봉지·줄·묶음)과 사람(명)은
   대상의 수량사가 아니라 세는 대상이 따로 있는 것이므로 일치 검사에서 뺀다. */
const CONTAINER_KO = ['상자', '봉지', '줄', '묶음', '명', '층', '번', '살'];
const ALL_UNIT_RE = /(\d+)(개|장|자루|권|송이|마리|상자|봉지|줄|묶음|명|층|번|살)/g;

const fails = [];
let checks = 0;

function verifyProblem(p, range) {
  const w = p.wp;
  if (!w) return '상황 메타(wp)가 없음';

  /* 1 · 2 — 의미 유형 ↔ 연산, 그리고 레벨의 연산 범위 */
  if (KIND_OP[w.kind] !== w.op) return `의미 유형 ${w.kind}의 연산은 ${KIND_OP[w.kind]}인데 ${w.op}로 적힘`;
  if (RANGE_OPS[range].indexOf(w.op) < 0) return `레벨 ${range}의 연산 범위에 없는 ${w.op} (${w.kind})`;
  if (w.range !== range) return `range가 ${w.range}로 어긋남`;

  /* 답 환원 원칙 — 정수 또는 보기 번호 */
  if (!Number.isInteger(p.answer)) return `답이 정수가 아님: ${p.answer}`;
  if (Array.isArray(p.choices)) {
    if (p.answer < 1 || p.answer > p.choices.length) return `보기 번호 범위를 벗어남: ${p.answer}/${p.choices.length}`;
    /* 7 — 같은 보기가 두 번 나오면 정답이 둘이 된다 */
    if (new Set(p.choices).size !== p.choices.length) return `보기가 중복됨: ${p.choices.join(' / ')}`;
  }

  /* 3 — 정답이 상황에서 나오는가 */
  const msg = verifyAnswer(p, w, range);
  if (msg) return msg;

  /* 4 — 수량사 일치 */
  const uMsg = verifyCounters(p, w);
  if (uMsg) return uMsg;

  /* 5 — 3개 언어 */
  const lMsg = verifyLangs(p);
  if (lMsg) return lMsg;

  /* 인쇄 계약: word(본문)와 wordAsk(물음)가 둘 다 있어야 인쇄물만 보고 풀 수 있다 */
  if (!p.word || !p.wordAsk) return 'word 또는 wordAsk가 비어 있음';
  if (p.prompt.ko.indexOf(p.word) !== 0) return 'prompt.ko가 본문으로 시작하지 않음';
  return null;
}

function verifyAnswer(p, w, range) {
  const chosen = Array.isArray(p.choices) ? p.choices[p.answer - 1] : null;

  if (w.mode === 'op') {
    if (chosen !== OPNAME_KO[w.op]) return `op: 고른 보기 "${chosen}"가 상황의 연산 ${OPNAME_KO[w.op]}와 다름`;
    /* 나머지 보기는 전부 다른 연산이어야 한다 */
    const others = p.choices.filter((_, i) => i !== p.answer - 1);
    if (others.some(c => c === OPNAME_KO[w.op])) return 'op: 정답과 같은 보기가 또 있음';
    return null;
  }

  if (w.mode === 'expr') {
    const a = w.t1, b = w.t2;
    const parts = chosen.split(' ');
    if (parts.length !== 3) return `expr: 식 꼴이 아님 "${chosen}"`;
    if (parts[1] !== w.op) return `expr: 고른 식의 연산 ${parts[1]}가 상황의 ${w.op}와 다름`;
    /* 차례까지 본다 — 뺄셈에서 t2 − t1은 오답이어야 한다 */
    if (parts[0] !== a || parts[2] !== b)
      return `expr: 고른 식의 수·차례 ${parts[0]},${parts[2]}가 상황의 ${a},${b}와 다름`;
    /* 오답 중에 같은 연산이 또 있으면 정답이 둘이 된다 */
    const dup = p.choices.filter((c, i) => i !== p.answer - 1 && c.split(' ')[1] === w.op
                                        && c.split(' ')[0] === parts[0] && c.split(' ')[2] === parts[2]);
    if (dup.length) return `expr: 정답과 같은 식이 또 있음 (${dup[0]})`;
    return null;
  }

  if (w.mode === 'same') {
    /* note에 "연산 — 정답 보기의 의미 유형"을 실어 두었다 */
    const m = String(p.answerNote || '').split(' — ');
    if (m.length !== 2) return `same: 정답 메모 꼴이 아님 "${p.answerNote}"`;
    if (m[0] !== OPNAME_KO[w.op]) return `same: 정답 보기의 연산 ${m[0]}가 문두의 ${OPNAME_KO[w.op]}와 다름`;
    if (KIND_OP[m[1]] !== w.op) return `same: 정답 보기 유형 ${m[1]}의 연산이 문두와 다름`;
    if (m[1] === w.kind) return `same: 정답 보기가 문두와 같은 의미 유형(${m[1]})이라 겉모습만 맞춰도 풀림`;
    if (chosen !== w.correct) return 'same: 고른 보기가 정답 보기 문장과 다름';
    return null;
  }

  if (w.mode === 'target') {
    /* 정답은 '구하는 것' — 생성기가 targets[0]에 둔 것이고, 오답 둘은 '주어진 것'이다 */
    if (chosen !== w.correct) return `target: 고른 보기가 '구하는 것'이 아님 ("${chosen}" ≠ "${w.correct}")`;
    if (p.choices.length !== 3) return `target: 보기가 3개가 아님(${p.choices.length})`;
    return null;
  }

  if (w.mode === 'given') {
    if (p.answer !== w.n1 && p.answer !== w.n2) return `given: 답 ${p.answer}이 상황의 ${w.n1}·${w.n2} 어느 쪽도 아님`;
    if (String(p.answer) !== w.correct) return `given: 답과 메모가 다름 (${p.answer} vs ${w.correct})`;
    if (p.word.indexOf(String(p.answer)) < 0) return `given: 답 ${p.answer}이 본문에 없음`;
    return null;
  }

  if (w.mode === 'need') {
    if (w.noise == null) return 'need: 잡음 수가 기록되지 않음';
    if (p.answer !== w.noise) return `need: 답 ${p.answer}이 잡음 수 ${w.noise}와 다름`;
    if (p.answer === w.n1 || p.answer === w.n2)
      return `need: 잡음 수 ${p.answer}이 문제에 실제로 쓰이는 수와 같아 유일해가 아님`;
    if (p.word.indexOf(String(p.answer)) < 0) return `need: 잡음 수 ${p.answer}이 본문에 없음`;
    /* 분수가 섞이면 분모까지 "필요 없는 수" 후보가 된다 */
    if (/\d\/\d/.test(p.word)) return 'need: 본문에 분수가 있어 분모가 또 다른 답 후보가 됨';
    return null;
  }
  return `모르는 모드: ${w.mode}`;
}

/* 수량사 — "박물관에 사자가 3송이"를 기계가 잡는 자리 */
function verifyCounters(p, w) {
  const koUnit = UNIT_KO[w.objKo];
  if (koUnit === undefined) return null;             /* 레벨 C(재는 것)는 수량사가 없다 */
  if (w.unitKo !== koUnit) return `수량사 어긋남: ${w.objKo}는 '${koUnit}'인데 상황엔 '${w.unitKo}'`;
  let m;
  ALL_UNIT_RE.lastIndex = 0;
  while ((m = ALL_UNIT_RE.exec(p.word))) {
    const u = m[2];
    if (CONTAINER_KO.indexOf(u) >= 0) continue;      /* 그릇·사람·층·버스번호·나이 */
    if (u !== koUnit) return `본문 수량사 어긋남: ${w.objKo}(${koUnit})인데 "${m[0]}"`;
  }
  /* 중국어 양사 */
  const zhObj = Object.keys(UNIT_ZH).find(k => p.prompt.zh.indexOf(k) >= 0);
  if (zhObj) {
    const re = new RegExp('(\\d+)(.)' + zhObj, 'g');
    let z;
    while ((z = re.exec(p.prompt.zh))) {
      if (z[2] !== UNIT_ZH[zhObj]) return `중국어 양사 어긋남: ${zhObj}는 '${UNIT_ZH[zhObj]}'인데 "${z[0]}"`;
    }
  }
  return null;
}

function verifyLangs(p) {
  const { ko, en, zh } = p.prompt || {};
  if (!ko || !en || !zh) return '3개 언어 중 빠진 것이 있음';
  if (ko === en || en === zh || ko === zh) return '두 언어의 문장이 똑같음';
  /* 언어 혼입. 한국어 문장의 m·L·kg는 단위 기호라 예외로 둔다(교과서 표기). */
  const koLatin = ko.replace(/(?:^|\s)(?:mL|kg|m|L)(?![A-Za-z])/g, ' ');
  if (/[A-Za-z]/.test(koLatin)) return `한국어 문장에 영문이 섞임: ${koLatin.match(/[A-Za-z]+/)[0]}`;
  if (/[가-힣]/.test(en)) return `영어 문장에 한글이 섞임: ${en.match(/[가-힣]+/)[0]}`;
  if (/[가-힣]/.test(zh)) return `중국어 문장에 한글이 섞임: ${zh.match(/[가-힣]+/)[0]}`;
  /* 중국어의 로마자는 단위(L·kg 등)가 아니라 이름이 잘못 들어간 경우다.
     C는 升·千克·米를 쓰므로 로마자가 있으면 안 된다. */
  if (/[A-Za-z]/.test(zh)) return `중국어 문장에 로마자가 섞임: ${zh.match(/[A-Za-z]+/)[0]}`;
  return null;
}

function sweep(id, lv) {
  const th = NM_THREADS[id];
  const level = th.levels.find(x => x.id === lv);
  const range = level.params.range;
  const rng = NM_RNG.mulberry32(20260829 + lv * 7919 + id.charCodeAt(2) * 131);
  const seen = new Map(), kinds = new Map(), modes = new Map();
  let bad = 0, firstBad = '';
  for (let i = 0; i < N; i++) {
    const p = NM_TGEN[th.gen](level.params, rng);
    checks++;
    seen.set(String(p.answer), (seen.get(String(p.answer)) || 0) + 1);
    kinds.set(p.wp.kind, (kinds.get(p.wp.kind) || 0) + 1);
    modes.set(p.wp.mode, (modes.get(p.wp.mode) || 0) + 1);
    const msg = verifyProblem(p, range);
    if (msg) { bad++; if (!firstBad) firstBad = `${msg}\n         ${p.prompt.ko}`; }
  }
  let top = '', topN = 0;
  for (const [k, c] of seen) if (c > topN) { topN = c; top = k; }
  const ratio = topN / N;
  const tag = `${id}L${lv} ${th.name.ko}/${level.label.ko}`;
  if (bad) fails.push(`${tag} — 불일치 ${bad}/${N}\n      ${firstBad}`);
  /* 6 — 정답 쏠림. 보기 3개짜리가 많아 33%가 자연스러운 값이다. */
  if (ratio > 0.45) fails.push(`${tag} — 정답 쏠림: ${(ratio * 100) | 0}%가 ${top} (안 읽고 찍어도 통과)`);
  /* 구차가 충분히 나오는가 — 이 스레드의 존재 이유가 구차다 */
  const gucha = (kinds.get('구차') || 0) / N;
  if (gucha < 0.12) fails.push(`${tag} — 구차가 ${(gucha * 100).toFixed(1)}%뿐 (신호어 함정 훈련이 안 됨)`);
  console.log(`  ${bad ? '✗' : '✓'} ${tag.padEnd(40)} ${N}건 · 답 ${seen.size}종 · 최빈 ${(ratio * 100).toFixed(1)}%` +
              ` · 구차 ${(gucha * 100).toFixed(1)}% · 모드 ${[...modes.keys()].sort().join('/')}`);
}

console.log(`문장제(WP) 검산 — 레벨당 ${N}건\n`);
[1, 2, 3].forEach(lv => sweep('WP1', lv));
[1, 2, 3].forEach(lv => sweep('WP3', lv));

console.log(`\n검산한 문항: ${checks}건`);
if (fails.length) {
  console.log(`\n[FAIL] ${fails.length}건`);
  fails.forEach(f => console.log('   ' + f));
  process.exit(1);
}
console.log('통과 — 상황·문장·정답이 서로 어긋나는 곳이 없다.');
