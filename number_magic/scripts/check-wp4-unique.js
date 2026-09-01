#!/usr/bin/env node
/* ============================================================
   WP4 유일해 전수 증명기 — 2026-08-30
   ============================================================
   "그렇게 설계했다"는 증명이 아니다. `DV6`는 설계 의도가 멀쩡했는데도
   `66□`가 2의 배수면 0·2·4·6·8이 다 정답인 채로 나갔고, **맞게 쓴 학생이
   오답 처리**됐다. 그래서 여기서는 문항마다 **학생이 낼 수 있는 답 후보를
   전부 훑어** 정답이 정확히 하나인지 센다. 하나가 아니면 실패다.

   ⚠️ 이 파일은 생성기의 함수를 하나도 부르지 않는다(`uniqueFill`도 안 쓴다).
   상황 메타(`p.wp`의 kind·n1·n2·t1·t2)만 받아 **판정을 처음부터 다시 짠다** —
   생성기의 판단을 빌려 오면 생성기가 틀렸을 때 검사기도 같이 틀린다.

   후보 공간
     fill — 학생이 채우는 것은 (앞 수, 뒤 수, 기호)다. 본문에 나온 수가 후보의
            전부이므로 4×4가지를 전부 계산해, 결과가 답과 같아지는 조합을 센다.
            본문에서 뽑은 수의 집합이 {n1, n2}와 같은지도 확인한다 — 그래야
            "후보를 전부 훑었다"가 참이 된다.
     info · box — 후보는 보기 목록이다. 보기마다 **상황을 옳게 옮긴 식인지**를
            산술로 판정한다. box는 □에 이야기의 답을 넣어 등식이 참인지 본다.

   쓰는 법: node scripts/check-wp4-unique.js [레벨당 생성 수]
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

const N = parseInt(process.argv[2], 10) || 5000;

/* 의미 유형 → 연산. 생성기 표를 읽지 않고 다시 적는다. */
const KIND_OP = { 합병:'+', 첨가:'+', 구잔:'−', 구차:'−', 배수:'×', 등분:'÷', 포함:'÷' };
const ev = (x, o, y) => o === '+' ? x + y : o === '−' ? x - y : o === '×' ? x * y : x / y;
const OPS = ['+', '−', '×', '÷'];
/* 소수 비교 — 0.1+0.2 같은 부동소수 오차를 흡수한다(레벨 C) */
const eq = (a, b) => Math.abs(a - b) < 1e-9;

/* 본문에 나온 수를 전부 뽑는다(분수 3/5·소수 1.4 포함) */
function numsIn(text) {
  const out = [];
  const re = /(\d+)\/(\d+)|(\d+(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(text))) out.push(m[1] ? +m[1] / +m[2] : +m[3]);
  return out;
}
/* 표기(3/5·1.4)를 값으로 */
function val(t) {
  const f = /^(\d+)\/(\d+)$/.exec(String(t));
  return f ? +f[1] / +f[2] : parseFloat(t);
}

const fails = [];
let checked = 0, cand = 0;

/* ── fill ── 후보 = (앞 수, 뒤 수, 기호). 본문의 수가 후보의 전부다. */
function proveFill(p) {
  const w = p.wp;
  const op = KIND_OP[w.kind];
  const r = ev(w.n1, op, w.n2);
  /* ★ 후보 공간은 **인쇄물에 실제로 찍힌 틀**이 정한다 — 생성기가 무엇을 의도했는지가
     아니라. 첫 자리가 수로 찍혀 있으면(`6 ○ □ = □`) 학생의 자유도는 뒤 두 칸뿐이고,
     □면(`□ ○ □ = □`) 앞 수까지 자유다. 이걸 op로 짐작하면, 틀과 키가 어긋난 채
     나가는 사고를 이 검사기가 못 잡는다(음성 대조에서 실제로 그랬다). */
  const eqn = String(p.wordEqn || '');
  const head = eqn.split(' ')[0];
  const pinned = head !== '□';
  if (pinned && !eq(val(head), w.n1)) return `식 틀에 찍힌 첫 수 ${head}가 상황의 ${w.n1}과 다름`;
  /* 후보 공간이 정말 닫혀 있는가 — 본문의 수가 {n1, n2}뿐이어야 한다 */
  const body = [...new Set(numsIn(p.word.ko))].sort((a, b) => a - b);
  const want = [...new Set([w.n1, w.n2])].sort((a, b) => a - b);
  if (body.length !== want.length || body.some((v, i) => !eq(v, want[i])))
    return `본문의 수 {${body}}가 상황의 {${want}}와 달라 후보를 다 훑었다고 할 수 없음`;
  const hits = [];
  for (const x of body) {
    if (pinned && !eq(x, w.n1)) continue;      /* 첫 수는 인쇄물에 찍혀 있다 */
    for (const y of body) for (const o of OPS) if (eq(ev(x, o, y), r)) hits.push(`${x} ${o} ${y} = ${r}`);
  }
  cand += (pinned ? 1 : body.length) * body.length * OPS.length;
  if (hits.length !== 1) return `정답 후보가 ${hits.length}가지 — ${hits.join(' / ')}`;
  /* 정답 키가 그 하나와 같은가 */
  const key = pinned ? [w.n2, r] : [w.n1, w.n2, r];
  if (!Array.isArray(p.answer) || p.answer.length !== key.length || p.answer.some((v, i) => !eq(v, key[i])))
    return `유일한 후보는 ${hits[0]}인데 정답 키는 [${p.answer}]`;
  return null;
}

/* ── info ── 후보 = 보기. `X o Y`가 상황을 옳게 옮긴 식인가. */
function proveInfo(p) {
  const w = p.wp;
  const op = KIND_OP[w.kind];
  const a = val(w.t1), b = val(w.t2);
  const hits = [];
  p.choices.ko.forEach((c, i) => {
    cand++;
    const m = /^(\S+)\s+([+−×÷])\s+(\S+)$/.exec(c);
    if (!m) { fails.push(`info: 식 꼴이 아닌 보기 "${c}"`); return; }
    const x = val(m[1]), o = m[2], y = val(m[3]);
    if (o !== op) return;                                   /* 연산이 다르면 오답 */
    /* 두 수가 문제의 두 수여야 하고, 교환되지 않는 연산은 차례까지 맞아야 한다 */
    const sameOrder = eq(x, a) && eq(y, b);
    const swapped   = eq(x, b) && eq(y, a);
    if (sameOrder || ((o === '+' || o === '×') && swapped)) hits.push(`${i + 1}) ${c}`);
  });
  if (hits.length !== 1) return `상황을 옳게 옮긴 보기가 ${hits.length}개 — ${hits.join(' / ') || '없음'}`;
  if (hits[0].indexOf(String(p.answer) + ')') !== 0) return `정답 키 ${p.answer}가 옳은 보기 ${hits[0]}와 다름`;
  return null;
}

/* ── box ── 후보 = 보기. □에 이야기의 답을 넣어 등식이 참인가. */
function proveBox(p) {
  const w = p.wp;
  const op = KIND_OP[w.kind];
  const inv = op === '−' ? '+' : op === '÷' ? '×' : null;
  if (!inv) return `되짚을 수 없는 연산 ${op} (${w.kind})`;
  const a = val(w.t1), b = val(w.t2);
  const d = ev(a, op, b);                                   /* 이야기의 답 */
  const hits = [];
  p.choices.ko.forEach((c, i) => {
    cand++;
    const m = /^(\S+)\s+([+−×÷])\s+(\S+)\s+=\s+(\S+)$/.exec(c);
    if (!m) { fails.push(`box: 식 꼴이 아닌 보기 "${c}"`); return; }
    if (m[2] !== inv) return;                               /* 되짚은 연산이 아니면 오답 */
    const parts = [m[1], m[3], m[4]];
    if (parts.filter(t => t === '□').length !== 1) return;   /* □는 하나 */
    /* □에 이야기의 답을 넣어 등식이 참인지 본다 */
    const num = t => t === '□' ? d : val(t);
    const [L1, L2, R] = parts.map(num);
    if (!eq(ev(L1, m[2], L2), R)) return;
    /* 이야기의 두 수를 각각 한 번씩 써야 한다(□ 말고) */
    const used = parts.filter(t => t !== '□').map(val).sort((x, y) => x - y);
    const need = [a, b].sort((x, y) => x - y);
    if (used.length !== 2 || !eq(used[0], need[0]) || !eq(used[1], need[1])) return;
    hits.push(`${i + 1}) ${c}`);
  });
  if (hits.length !== 1) return `상황을 옳게 옮긴 보기가 ${hits.length}개 — ${hits.join(' / ') || '없음'}`;
  if (hits[0].indexOf(String(p.answer) + ')') !== 0) return `정답 키 ${p.answer}가 옳은 보기 ${hits[0]}와 다름`;
  return null;
}

function sweep(lv) {
  const th = NM_THREADS.WP4;
  const level = th.levels.find(x => x.id === lv);
  const rng = NM_RNG.mulberry32(20260830 + lv * 7919);
  const byMode = {};
  let bad = 0, firstBad = '';
  for (let i = 0; i < N; i++) {
    const p = NM_TGEN[th.gen](level.params, rng);
    checked++;
    const mode = p.wp.mode;
    byMode[mode] = (byMode[mode] || 0) + 1;
    const msg = mode === 'fill' ? proveFill(p) : mode === 'info' ? proveInfo(p) : proveBox(p);
    if (msg) { bad++; if (!firstBad) firstBad = `${msg}\n         ${p.prompt.ko}`; }
  }
  const tag = `WP4L${lv} ${level.label.ko}`;
  if (bad) fails.push(`${tag} — 유일해가 아닌 문항 ${bad}/${N}\n      ${firstBad}`);
  console.log(`  ${bad ? '✗' : '✓'} ${tag.padEnd(22)} ${N}건 · ` +
    Object.keys(byMode).sort().map(k => `${k} ${byMode[k]}`).join(' · '));
}

console.log(`WP4 유일해 전수 증명 — 레벨당 ${N}건\n`);
[1, 2, 3].forEach(sweep);
console.log(`\n훑은 문항 ${checked}건 · 훑은 답 후보 ${cand}가지`);
if (fails.length) {
  console.log(`\n[FAIL] ${fails.length}건`);
  fails.slice(0, 20).forEach(f => console.log('   ' + f));
  process.exit(1);
}
console.log('통과 — 모든 문항에서 정답 후보가 정확히 하나다.');
