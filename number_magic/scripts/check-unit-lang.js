#!/usr/bin/env node
/* ============================================================
   유닛 언어 검사기 — mathSteps의 3언어 계약 (2026-08-30 신설)
   ============================================================
   mathSteps는 두 가지 항목만 허용한다:
     · 문자열   — 언어 중립 수식(한글 금지)
     · {ko,en,zh} — 한국어 주석이 있던 줄. 세 언어가 다 있어야 하고
                   en/zh에 한글이 남으면 안 된다.
   이 계약이 깨지는 대표 경로는 "새 유닛을 한국어 문자열로만 쓰는 것"이다 —
   화면·인쇄가 문자열을 그대로 통과시키므로 en/zh 화면에 한국어가 섞여도
   아무 데서도 오류가 나지 않는다. 그래서 검사기가 막는다.

   같은 이유로 discover의 title·rule·tag·head·desc·result 도 본다(이쪽은
   원래 {ko,en,zh}가 표준이라 문자열이면 실패).
   KaTeX 경로(비 kid 티어)의 en은 \text{...}가 있어야 낱말 사이 공백이
   살아남는다 — 알파벳 낱말이 2개 이상인데 \text가 없으면 경고한다.
   ============================================================ */
const fs = require('fs'), path = require('path');
global.window = global; global.NM_UNITS = {};
const DIR = path.resolve(__dirname, '..', 'data/units');
for (const f of fs.readdirSync(DIR)) if (f.endsWith('.js')) {
  try { eval(fs.readFileSync(path.join(DIR, f), 'utf8')); }
  catch (e) { console.log('로드 실패 ' + f + ': ' + e.message); process.exit(1); }
}
const fails = [], warns = [];
const hangul = s => /[가-힣]/.test(String(s));
const braces = s => { let d = 0; for (const c of String(s)) { if (c === '{') d++; else if (c === '}') d--; if (d < 0) return false; } return d === 0; };
let units = 0, steps = 0, objs = 0;

Object.keys(global.NM_UNITS).sort().forEach(id => {
  const u = global.NM_UNITS[id];
  units++;
  const kid = u.tier === 'basic';
  const fld = (where, v) => {
    if (v == null) return;
    if (typeof v === 'string') { if (hangul(v)) fails.push(`${id} ${where}: 한국어 단일 문자열`); return; }
    ['ko', 'en', 'zh'].forEach(l => { if (!v[l]) fails.push(`${id} ${where}: ${l} 없음`); });
    if (hangul(v.en)) fails.push(`${id} ${where}: en에 한글`);
    if (hangul(v.zh)) fails.push(`${id} ${where}: zh에 한글`);
  };
  fld('title', u.title);
  (u.discover && u.discover.stages || []).forEach((s, si) => {
    ['tag', 'head', 'desc', 'result'].forEach(k => fld(`stage${si}.${k}`, s[k]));
    (s.mathSteps || []).forEach((x, i) => {
      steps++;
      const at = `${id} stage${si}.mathSteps[${i}]`;
      if (typeof x === 'string') { if (hangul(x)) fails.push(`${at}: 한국어가 든 맨 문자열 — {ko,en,zh}로 쓸 것`); return; }
      objs++;
      ['ko', 'en', 'zh'].forEach(l => {
        if (!x[l]) { fails.push(`${at}: ${l} 없음`); return; }
        if (!braces(x[l])) fails.push(`${at}: ${l}의 중괄호 짝이 안 맞음`);
      });
      if (hangul(x.en)) fails.push(`${at}: en에 한글`);
      if (hangul(x.zh)) fails.push(`${at}: zh에 한글`);
      /* KaTeX는 수식 모드에서 공백을 지운다 — 영문 낱말이 여럿인데 \text가 없으면
         "pairsfirst"처럼 붙어 나온다. kid 티어는 textContent라 무관. */
      if (!kid && x.en && /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(x.en.replace(/\\[a-zA-Z]+/g, '')) && !/\\text/.test(x.en))
        warns.push(`${at}: en에 \\text 없이 여러 낱말 — KaTeX가 공백을 지움`);
    });
  });
  if (u.discover) fld('rule', u.discover.rule);
  /* check.fills[].tex — 화면의 빈칸 문제. 문자열이면 언어 중립이어야 하고,
     한글 \text 주석이 필요하면 {ko,en,zh}로 쓴다(2026-08-30에 31건 전환). */
  (u.check && u.check.fills || []).forEach((fl, i) => {
    const at = `${id} check.fills[${i}].tex`;
    const v = fl.tex;
    if (v == null) return;
    if (typeof v === 'string') { if (hangul(v)) fails.push(`${at}: 한국어가 든 맨 문자열`); return; }
    ['ko', 'en', 'zh'].forEach(l => { if (!v[l]) fails.push(`${at}: ${l} 없음`); else if (!braces(v[l])) fails.push(`${at}: ${l} 중괄호 불일치`); });
    if (hangul(v.en)) fails.push(`${at}: en에 한글`);
    if (hangul(v.zh)) fails.push(`${at}: zh에 한글`);
  });
});

console.log(`유닛 ${units} · mathSteps ${steps}줄(3언어 객체 ${objs}) · 실패 ${fails.length} · 경고 ${warns.length}`);
warns.slice(0, 10).forEach(w => console.log('  [warn] ' + w));
if (fails.length) { fails.slice(0, 20).forEach(f => console.log('  [FAIL] ' + f)); process.exit(1); }
console.log('통과');
