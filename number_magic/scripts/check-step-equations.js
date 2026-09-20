#!/usr/bin/env node
/* ============================================================
   단계 등식 검사기 — steps·solution의 산술이 참인지 (2026-09-20)
   ------------------------------------------------------------
   왜 필요한가: 풀이 단계는 "쓰다 보니 맞는 순서"로 적히기 쉬워서, 식으로
   읽으면 거짓인 줄이 섞여 든다. 실제로 세로 나눗셈(DV19)이 자리마다
   `19 ÷ 6 = 3`처럼 나머지를 뺀 채 적혀 있었고, 나머지 있는 나눗셈(DV3·DV4)은
   `57 ÷ 7 = 8`로 ⋯2가 통째로 빠져 있었다. 모양 검사(check-solution-steps)는
   □ 개수와 마지막 blank만 보므로 이 종류를 전혀 못 잡는다.

   무엇을 보나: 각 단계의 tex에서 □를 blank 값으로 채운 뒤 수식을 계산해
   양변이 같은지 본다. 나눗셈 나머지 꼴(`a ÷ b = q ⋯ r`)은 a = b×q + r로 본다.
   문자·분수·근호·\text 등 순수 산술이 아닌 줄은 건너뛴다(여기서 볼 수 없다).

   쓰는 법:
     node scripts/check-step-equations.js          # 전 스레드
     node scripts/check-step-equations.js DV3 DV19 # 지정 스레드만
   실패가 하나라도 있으면 exit 1.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const ONLY = process.argv.slice(2).map(s => s.toUpperCase());
const FILES = ['engine/generators.js','engine/rng.js','engine/scene-model.js',
  'engine/threads/ns_ad.js','engine/threads/sb.js','engine/threads/ml.js','engine/threads/dv.js',
  'engine/threads/fr.js','engine/threads/dc_mx.js','engine/threads/el.js','engine/threads/nl.js',
  'engine/threads/wp.js','engine/threads/adv.js','engine/threads/mid.js','engine/threads/mid2.js',
  'engine/threads/mid3.js','engine/threads/mid4.js','engine/threads/mid5.js','engine/threads/mid6.js',
  'engine/threads/mid7.js','engine/threads/mid8.js','data/threads.js'];

const w = { document: {}, console, Math, JSON, Object, Array, String, Number, RegExp, Date, parseInt, parseFloat, isNaN, isFinite };
w.window = w; w.global = w;
const sb = vm.createContext(w);
for(const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f });
const T = w.NM_THREADS, G = w.NM_TGEN, R = w.NM_RNG;

/* ── tex 한 줄을 산술식으로 옮긴다. 옮길 수 없으면 null(=건너뜀) ── */
function toExpr(tex, blank){
  let s = String(tex);
  /* □ 채우기 — blank가 배열이면 나온 순서대로 */
  const vals = Array.isArray(blank) ? blank.slice() : (blank === undefined ? [] : [blank]);
  let vi = 0, filled = true;
  s = s.replace(/\\square/g, () => {
    const v = vals[vi++];
    if(v === undefined || typeof v !== 'number' || !isFinite(v)) filled = false;
    return '(' + v + ')';
  });
  if(!filled) return null;
  /* 연산 기호 */
  s = s.replace(/\\times/g, '*').replace(/\\div/g, '/')
       .replace(/\\cdot(?!s)/g, '*').replace(/\\left|\\right/g, '')
       .replace(/\\,|\\;|\\!|\\ /g, ' ').replace(/[{}]/g, '');
  /* 순수 산술만 — 문자·분수·근호·색·텍스트가 섞이면 여기서 볼 수 없다 */
  if(/[A-Za-z\\가-힣]/.test(s.replace(/\\cdots/g, ''))) return null;
  if(!/[0-9]/.test(s)) return null;
  if(/[^0-9+\-*/=(). \\cdots]/.test(s.replace(/\\cdots/g, '@'))) return null;
  return s;
}

function evalArith(part){
  const t = part.trim();
  if(!t || !/^[0-9+\-*/(). ]+$/.test(t)) return NaN;
  try { return Function('"use strict";return (' + t + ')')(); } catch(e){ return NaN; }
}

/* 참이면 true, 거짓이면 false, 볼 수 없으면 null */
function stepTruth(tex, blank){
  const s = toExpr(tex, blank);
  if(s === null) return null;
  const sides = s.split('=');
  if(sides.length < 2) return null;
  const vals = [];
  for(const side of sides){
    if(side.includes('\\cdots')){
      /* `q ⋯ r` — 짝이 되는 반대편이 `a / b` 꼴이어야 한다 */
      const [qs, rs] = side.split('\\cdots');
      const q = evalArith(qs), r = evalArith(rs);
      if(!isFinite(q) || !isFinite(r)) return null;
      vals.push({ q, r });
    } else {
      const v = evalArith(side);
      if(!isFinite(v)) return null;
      vals.push(v);
    }
  }
  const remIdx = vals.findIndex(v => typeof v === 'object');
  if(remIdx >= 0){
    if(vals.length !== 2) return null;
    const other = vals[1 - remIdx];
    if(typeof other === 'object') return null;
    /* 나머지 꼴은 반대편 원식 a / b 를 다시 읽어야 정확하다 */
    const src = sides[1 - remIdx];
    const m = src.match(/^\s*\(?\s*(-?[0-9]+)\s*\)?\s*\/\s*\(?\s*(-?[0-9]+)\s*\)?\s*$/);
    if(!m) return null;
    const a = Number(m[1]), b = Number(m[2]);
    const { q, r } = vals[remIdx];
    return a === b * q + r && r >= 0 && r < Math.abs(b);
  }
  const first = vals[0];
  return vals.every(v => Math.abs(v - first) < 1e-9);
}

const targets = Object.keys(T).filter(k => ONLY.length ? ONLY.includes(k) : true);
let fails = 0, checked = 0, seen = 0;
const shown = new Set();
for(const k of targets){
  const t = T[k], gen = G[t.gen]; if(!gen) continue;
  for(const lv of (t.levels || [])){
    for(let i = 0; i < 30; i++){
      let p; try { p = gen(lv.params || {}, R.mulberry32(R.hashSeed(`eq-${k}-${lv.id}-${i}`))); } catch(e){ continue; }
      const lists = [p.steps, p.solution].filter(x => Array.isArray(x));
      for(const list of lists) for(const s of list){
        if(!s || typeof s.tex !== 'string') continue;
        seen++;
        const ok = stepTruth(s.tex, s.blank);
        if(ok === null) continue;
        checked++;
        if(ok === false){
          const key = `${k}L${lv.id}`;
          if(!shown.has(key)){ shown.add(key); console.log(`FAIL ${key}: ${s.tex}  (□=${JSON.stringify(s.blank)})`); }
          fails++;
        }
      }
    }
  }
}
console.log(`\n단계 줄 ${seen} · 산술로 읽힌 줄 ${checked} · 거짓 ${fails}`);
if(!fails) console.log('통과 — 읽을 수 있는 단계는 전부 참인 식이다.');
process.exit(fails ? 1 : 0);
