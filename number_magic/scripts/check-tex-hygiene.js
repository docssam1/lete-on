#!/usr/bin/env node
/* 수식 표기 위생 검사 — 인쇄물에 나가는 식이 사람이 쓰는 꼴인가 · 2026-09-20
 *
 * check-print.js 는 문항식(p.tex)의 이중부호·괄호 없는 음수를 본다. 이 검사기는 그 옆의
 * 두 축을 본다. 둘 다 학습지에 실제로 찍히고 있었다(점검 에이전트 발견):
 *   ① 계수 1·0 이 그대로 — `f(x)=x^3 + 0x^2 - 3x - 5`, `(2x + 1) - (-1x + 2)`, `2^{x + 0}`
 *   ② 풀이 단계(p.solution·p.steps)의 이중부호 — `(x--59)`, `x+-59`, `-3887 - -3888`
 *      문항식은 깨끗한데 풀이만 오염된 경우가 많다(예시 줄·해설 카드로 인쇄된다).
 *
 * 자릿값·자리합처럼 0 을 일부러 보여 주는 유형은 SKIP 에 적어 둔다(지어낸 예외가 아니라
 * 그 단원의 내용이라서다 — NS1 `100+30+0`, DV6 `(1+5)-(1+0)`).
 *
 *   node scripts/check-tex-hygiene.js            # 실패하면 exit 1
 *   node scripts/check-tex-hygiene.js MD60       # 한 스레드만
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

const ctx = { console, Math, Date };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/rng.js'), 'utf8'), ctx);
ctx.NM_RNG = ctx.window.NM_RNG; ctx.NM_TGEN = ctx.window.NM_TGEN = {};
fs.readdirSync(path.join(ROOT, 'engine/threads')).filter(f => f.endsWith('.js'))
  .forEach(f => { try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/threads', f), 'utf8'), ctx); } catch (e) { console.error('load', f, e.message); } });
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/threads.js'), 'utf8'), ctx);
/* 다듬기(engine/tex-tidy.js)를 거친 뒤의 식을 본다 — 인쇄·화면이 그리는 것과 같은 문자열이다. */
vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/tex-tidy.js'), 'utf8'), ctx);
const tidy = ctx.window.NM_TEX.tidy;
const TH = ctx.window.NM_THREADS, GEN = ctx.NM_TGEN;

/* 0 을 일부러 보여 주는 유형 — 자릿값 분해·자리합 판정 */
const SKIP = { NS1: 1, DV6: 1 };

const only = process.argv.slice(2);
const N = 60;                      /* 유형·레벨마다 */
const bad = { coef: [], sign: [] };
let checked = 0;

const texesOf = p => []
  .concat([p && p.tex])
  .concat((p && p.steps || []).map(s => s && s.tex))
  .concat((p && p.solution || []).map(s => s && s.tex))
  .filter(t => typeof t === 'string');

/* 검사 전에 \text{...} 와 진법 밑첨자를 걷어낸다 — 그 안의 숫자·글자는 식이 아니다
   (`\text{일: } (10 + 0) - 5` 의 0 은 받아내림 설명이고, `(1F)_{16}` 의 1 은 16진법 숫자다). */
const clean = t => String(t)
  .replace(/\\text\{[^}]*\}/g, ' ')
  .replace(/_\{[^}]*\}/g, ' ');
/* 변수 항이 있는 식에서만 본다 — 자릿값 분해(`100 + 30 + 0`)는 0 을 일부러 보여 준다. */
const hasVar   = t => /[xy]/.test(t);
const COEF_ONE  = /(^|[\s({+\-=])1(?=[xy])/;      /* `1x`, `-1x^2` */
const EXP_ONE   = /\^\{?1\}?(?![\d}])/;           /* `x^1`, `x^{1}` — 지수 1 은 안 쓴다 */
const COEF_ZERO = /[+\-]\s*0(?=[xy])/;            /* `+ 0x^2` */
const ZERO_TERM = /[+\-]\s*0(?![.\dxy])/;         /* `x^2 - 8x + 0`, `2^{x + 0}` */
/* 이중부호 — \color 안(정답 대입)은 fixNegSigns 가 따로 처리하므로 원문만 */
const DBL_SIGN  = /[-+]\s*-\s*\d|\d\s*\+\s*-/;

for (const id of Object.keys(TH)) {
  if (only.length && !only.includes(id)) continue;
  if (SKIP[id]) continue;
  const d = TH[id];
  const g = GEN[d.gen];
  if (!g) continue;
  for (const lv of (d.levels || [])) {
    const rng = ctx.NM_RNG.mulberry32(ctx.NM_RNG.hashSeed('hyg' + id + lv.id));
    const hit = { coef: 0, sign: 0, exCoef: '', exSign: '' };
    for (let i = 0; i < N; i++) {
      let p; try { p = g(Object.assign({}, lv.params || {}), rng); } catch (e) { break; }
      for (const t0 of texesOf(p)) {
        const t = tidy(t0);
        const c = clean(t);
        const coefBad = COEF_ONE.test(c) || COEF_ZERO.test(c) || EXP_ONE.test(c) || (hasVar(c) && ZERO_TERM.test(c));
        if (coefBad)          { hit.coef++; if (!hit.exCoef) hit.exCoef = t.slice(0, 54); }
        if (DBL_SIGN.test(c)) { hit.sign++; if (!hit.exSign) hit.exSign = t.slice(0, 54); }
      }
    }
    checked++;
    const tag = `${id}L${lv.id} ${d.name.ko}/${lv.label.ko}`;
    if (hit.coef) bad.coef.push(`${tag} — ${hit.coef}건 · 예: ${hit.exCoef}`);
    if (hit.sign) bad.sign.push(`${tag} — ${hit.sign}건 · 예: ${hit.exSign}`);
  }
}

console.log(`검사한 유형·레벨: ${checked} (각 ${N}문항 · 문항식 + 단계 + 풀이)`);
const fails = bad.coef.length + bad.sign.length;
if (fails) {
  if (bad.coef.length) { console.error(`\n[계수 1·0 · 지수 1 이 그대로] ${bad.coef.length}건`); bad.coef.forEach(x => console.error('  ✗ ' + x)); }
  if (bad.sign.length) { console.error(`\n[이중부호] ${bad.sign.length}건`);          bad.sign.forEach(x => console.error('  ✗ ' + x)); }
  process.exit(1);
}
console.log('\n통과 — 계수 1·0 · 지수 1 이 드러난 곳도, 이중부호도 없다.');
