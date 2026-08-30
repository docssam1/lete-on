#!/usr/bin/env node
/* ============================================================
   신규 레벨 수학 검산기 — 2026-08-29
   ============================================================
   기적의 계산법·소마 진도와 대조해 찾은 빈 곳 6개를 메우며 만든 레벨들이
   대상이다. 인쇄 검사기(check-print)와 화면 검사기(check-answerable)는
   "문항이 성립하는가 / 화면으로 맞힐 수 있는가"를 보지, **정답이 수학적으로
   맞는가**는 안 본다. DV6 배수판별법이 유일해 없는 문항을 내보냈던 것도
   그 사각지대였다.

   그래서 여기서는 레벨마다 수천 개를 생성해 tex에 적힌 관계가 실제로
   성립하는지 직접 계산해 확인한다. 눈으로 몇 개 보는 것으로는 안 된다.

     FR5L2 통분    — 통분한 두 분수가 원래 분수와 같고 분모가 공통인가,
                     공통분모가 정말 최소공배수인가
     MX3L3 간단한 비 — 답이 원래 비와 같은 비인가, 기약(서로소)인가,
                     그리고 **답이 유일한가**(보여 준 항이 다른 답을 막는가)
     MX3L4 비교하는 양 / MX3L5 기준량 — 비교하는 양 = 기준량 × 비율
     EL5L3 비례배분 — 두 몫의 합이 전체와 같고 주어진 비를 이루는가
     DC3L2 자연수÷자연수 — 몫 × 나누는 수 = 나누어지는 수
     AD10  연이은 덧뺄 — 앞에서부터 계산한 값이 답과 같고,
                     중간 결과가 음수가 되지 않으며 범위를 지키는가

   쓰는 법: node scripts/check-new-levels-math.js [반복수]
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
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; };
const lcm = (a, b) => (a / gcd(a, b)) * b;

const fails = [];
let checks = 0;

/* 레벨 하나를 N번 생성해 verify를 돌린다. verify는 문제가 있으면 문자열을 돌려준다. */
function sweep(id, lv, verify) {
  const th = NM_THREADS[id];
  const level = th.levels.find(x => x.id === lv);
  const rng = NM_RNG.mulberry32(20260829 + lv * 7919 + id.length * 31);
  const seen = new Map();
  let bad = 0, firstBad = '';
  for (let i = 0; i < N; i++) {
    const p = NM_TGEN[th.gen](level.params || {}, rng);
    checks++;
    const key = JSON.stringify(p.answer);
    seen.set(key, (seen.get(key) || 0) + 1);
    const msg = verify(p);
    if (msg) { bad++; if (!firstBad) firstBad = `${msg}  |  tex: ${p.tex}  ans: ${key}`; }
  }
  /* 정답 쏠림 — 한 값이 절반을 넘으면 지문을 안 보고 찍어도 통과한다 */
  let top = '', topN = 0;
  for (const [k, c] of seen) if (c > topN) { topN = c; top = k; }
  const ratio = topN / N;
  const tag = `${id}L${lv} ${th.name.ko}/${level.label.ko}`;
  if (bad) fails.push(`${tag} — 수학 불일치 ${bad}/${N}\n      ${firstBad}`);
  if (ratio > 0.5) fails.push(`${tag} — 정답 쏠림: ${(ratio * 100) | 0}%가 ${top}`);
  console.log(`  ${bad ? '✗' : '✓'} ${tag.padEnd(46)} ${N}건 · 서로 다른 답 ${seen.size} · 최빈 ${(ratio * 100).toFixed(1)}%`);
}

console.log(`신규 레벨 수학 검산 — 레벨당 ${N}건\n`);

/* ── FR5L2 통분 ─────────────────────────────────────────────
   tex: a1/d1 = □/L , a2/d2 = □/L  →  답 [c1, c2] */
sweep('FR5', 2, p => {
  const m = p.tex.match(/\\dfrac\{(\d+)\}\{(\d+)\} = \\dfrac\{\\square\}\{(\d+)\} \\;,\\;\\; \\dfrac\{(\d+)\}\{(\d+)\} = \\dfrac\{\\square\}\{(\d+)\}/);
  if (!m) return 'tex 형식이 다름';
  const [a1, d1, L1, a2, d2, L2] = m.slice(1).map(Number);
  const [c1, c2] = p.answer;
  if (L1 !== L2) return '두 분수의 분모가 서로 다름';
  if (c1 * d1 !== a1 * L1) return `첫 분수가 값이 달라짐: ${c1}/${L1} ≠ ${a1}/${d1}`;
  if (c2 * d2 !== a2 * L2) return `둘째 분수가 값이 달라짐: ${c2}/${L2} ≠ ${a2}/${d2}`;
  if (L1 !== lcm(d1, d2)) return `공통분모가 최소공배수가 아님: ${L1} ≠ ${lcm(d1, d2)}`;
  if (d1 === d2) return '분모가 처음부터 같아 통분할 것이 없음';
  if (d1 === L1 || d2 === L1) return '한쪽 분수가 그대로라 통분을 묻지 않음';
  if (gcd(a1, d1) !== 1 || gcd(a2, d2) !== 1) return '주어진 분수가 기약분수가 아님';
  if (!Number.isInteger(c1) || !Number.isInteger(c2)) return '분자가 정수가 아님';
  return null;
});

/* ── MX3L3 가장 간단한 자연수의 비 ───────────────────────────
   tex: A : B = □ : s  또는  A : B = s : □ */
sweep('MX3', 3, p => {
  const num = t => {
    const f = t.match(/^\\dfrac\{(\d+)\}\{(\d+)\}$/);
    if (f) return [Number(f[1]), Number(f[2])];   /* 분수 → [분자, 분모] */
    return [Number(t), 1];                        /* 자연수·소수 → 값 그대로 */
  };
  const m = p.tex.match(/^(\S+|\\dfrac\{\d+\}\{\d+\}) : (\S+|\\dfrac\{\d+\}\{\d+\}) = (\\square|\d+) : (\\square|\d+)$/);
  if (!m) return 'tex 형식이 다름';
  const [ln, ld] = num(m[1]);
  const [rn, rd] = num(m[2]);
  const blankFirst = m[3] === '\\square';
  const shown = Number(blankFirst ? m[4] : m[3]);
  const ans = p.answer;
  if (!Number.isInteger(ans) || ans < 1) return '답이 자연수가 아님';
  const sa = blankFirst ? ans : shown;
  const sb = blankFirst ? shown : ans;
  /* 같은 비인가 — A/B = sa/sb  ⟺  (ln/ld)·sb = (rn/rd)·sa */
  if (Math.abs((ln / ld) * sb - (rn / rd) * sa) > 1e-9)
    return `비가 달라짐: ${m[1]}:${m[2]} ≠ ${sa}:${sb}`;
  /* 가장 간단한 자연수의 비인가 */
  if (gcd(sa, sb) !== 1) return `기약이 아님: ${sa}:${sb} (공약수 ${gcd(sa, sb)})`;
  /* 유일해인가 — 보여 준 항을 고정했을 때 다른 자연수 답이 없어야 한다 */
  let other = 0;
  for (let k = 1; k <= 200; k++) {
    const ta = blankFirst ? k : shown, tb = blankFirst ? shown : k;
    if (k !== ans && Math.abs((ln / ld) * tb - (rn / rd) * ta) < 1e-9) other++;
  }
  if (other) return `답이 유일하지 않음 (다른 답 ${other}개)`;
  return null;
});

/* ── MX3L4 비교하는 양 · MX3L5 기준량 ────────────────────────
   비교하는 양 = 기준량 × 비율 */
sweep('MX3', 4, p => {
  const m = p.tex.match(/^\\square \\div (\d+) = (\d+)\\,\\%$/);
  if (!m) return 'tex 형식이 다름';
  const base = Number(m[1]), pct = Number(m[2]);
  if (p.answer * 100 !== base * pct) return `${p.answer} ÷ ${base} ≠ ${pct}%`;
  if (!Number.isInteger(p.answer) || p.answer < 1) return '비교하는 양이 자연수가 아님';
  if (p.answer === base) return '비율이 100%라 묻는 뜻이 없음';
  if (p.steps[0].blank !== p.answer) return '단계 답이 문항 답과 다름';
  return null;
});
sweep('MX3', 5, p => {
  const m = p.tex.match(/^(\d+) \\div \\square = (\d+)\\,\\%$/);
  if (!m) return 'tex 형식이 다름';
  const cmp = Number(m[1]), pct = Number(m[2]);
  if (cmp * 100 !== p.answer * pct) return `${cmp} ÷ ${p.answer} ≠ ${pct}%`;
  if (!Number.isInteger(p.answer) || p.answer < 1) return '기준량이 자연수가 아님';
  if (p.answer === cmp) return '비율이 100%라 묻는 뜻이 없음';
  if (p.steps[0].blank !== p.answer) return '단계 답이 문항 답과 다름';
  return null;
});

/* ── EL5L3 비례배분 ─────────────────────────────────────────
   tex: □ + ○ = T , □ : ○ = a : b */
sweep('EL5', 3, p => {
  const m = p.tex.match(/^\\square \+ \\bigcirc = (\d+) \\;,\\;\\; \\square : \\bigcirc = (\d+) : (\d+)$/);
  if (!m) return 'tex 형식이 다름';
  const T = Number(m[1]), a = Number(m[2]), b = Number(m[3]);
  const [p1, p2] = p.answer;
  if (p1 + p2 !== T) return `두 몫의 합이 전체와 다름: ${p1}+${p2} ≠ ${T}`;
  if (p1 * b !== p2 * a) return `주어진 비가 아님: ${p1}:${p2} ≠ ${a}:${b}`;
  if (!Number.isInteger(p1) || !Number.isInteger(p2) || p1 < 1 || p2 < 1)
    return '몫이 자연수가 아님';
  if (gcd(a, b) !== 1) return `주어진 비가 간단한 비가 아님: ${a}:${b}`;
  return null;
});

/* ── DC3L2 몫이 소수인 (자연수)÷(자연수) ─────────────────────
   tex: n ÷ d = w.□ , 답은 소수점 아래 숫자 */
sweep('DC3', 2, p => {
  const m = p.tex.match(/^(\d+) \\div (\d+) = (\d+)\.\\square$/);
  if (!m) return 'tex 형식이 다름';
  const n = Number(m[1]), d = Number(m[2]), w = Number(m[3]);
  const digits = String(p.answer);
  if (!/^[1-9]\d*$/.test(digits)) return '소수 첫째 자리가 0이거나 답이 자연수가 아님';
  const q = Number(`${w}.${digits}`);
  /* 몫 × 나누는 수 = 나누어지는 수 (부동소수 오차를 피해 정수로 되돌려 비교) */
  const scale = Math.pow(10, digits.length);
  if (Math.round(q * scale) * d !== n * scale) return `${q} × ${d} ≠ ${n}`;
  if (n % d === 0) return '나누어떨어져 몫이 소수가 아님';
  if (p.steps[0].blank * d !== n * scale) return '단계1이 맞지 않음';
  if (p.steps[1].blank !== p.answer) return '단계2 답이 문항 답과 다름';
  return null;
});

/* ── AD10 연이은 덧셈·뺄셈 (세 레벨) ─────────────────────────
   tex의 식을 앞에서부터 그대로 계산해 답과 맞춰 본다 */
function chainVerify(max, cross, terms) {
  return p => {
    const m = p.tex.match(/^(.+) = \\square$/);
    if (!m) return 'tex 형식이 다름';
    const tok = m[1].split(' ');
    if ((tok.length + 1) / 2 !== terms) return `항이 ${terms}개가 아님`;
    let cur = Number(tok[0]);
    if (!Number.isInteger(cur)) return '첫 항이 정수가 아님';
    const partial = [cur];
    let minus = 0;
    for (let i = 1; i < tok.length; i += 2) {
      const op = tok[i], v = Number(tok[i + 1]);
      if (op !== '+' && op !== '-') return `알 수 없는 연산 ${op}`;
      if (!Number.isInteger(v) || v < 1 || v > 9) return `항 ${v}가 1~9가 아님`;
      if (op === '-') minus++;
      cur = op === '+' ? cur + v : cur - v;
      partial.push(cur);
    }
    if (cur !== p.answer) return `앞에서부터 계산하면 ${cur}인데 답은 ${p.answer}`;
    if (partial.some(x => x < 0)) return `중간 결과가 음수: ${partial.join(',')}`;
    if (partial.some(x => x > max)) return `${max}을 넘음: ${partial.join(',')}`;
    if (!minus) return '뺄셈이 없어 AD8 여러 수 덧셈과 구별되지 않음';
    if (partial.slice(1, -1).some(x => x === 0)) return `중간 결과가 0: ${partial.join(',')}`;
    if (cross && !partial.some(x => x > 10)) return `10을 넘나드는 자리가 없음: ${partial.join(',')}`;
    /* 단계 줄이 실제 중간 결과와 같은가 */
    if (!p.steps || p.steps.length !== terms - 1) return '단계 수가 항 수와 안 맞음';
    for (let i = 0; i < p.steps.length; i++)
      if (p.steps[i].blank !== partial[i + 1]) return `단계 ${i + 1}의 답이 중간 결과와 다름`;
    return null;
  };
}
sweep('AD10', 1, chainVerify(10, false, 3));
sweep('AD10', 2, chainVerify(20, true, 3));
sweep('AD10', 3, chainVerify(20, true, 4));

console.log(`\n검산한 문항: ${checks}건`);
if (fails.length) {
  console.log(`\n[FAIL] ${fails.length}건`);
  fails.forEach(f => console.log('   ' + f));
  process.exit(1);
}
console.log('통과 — 신규 레벨의 수학 관계가 전부 성립한다.');
