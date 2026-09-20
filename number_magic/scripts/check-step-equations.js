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
  'engine/threads/mid7.js','engine/threads/mid8.js','engine/threads/mid9.js','data/threads.js'];

const w = { document: {}, console, Math, JSON, Object, Array, String, Number, RegExp, Date, parseInt, parseFloat, isNaN, isFinite };
w.window = w; w.global = w;
const sb = vm.createContext(w);
for(const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f });
const T = w.NM_THREADS, G = w.NM_TGEN, R = w.NM_RNG;
/* 레벨당 표본 수 — 드물게만 음수가 나오는 생성기를 훑을 땐 NM_SAMPLES=200 으로 올린다. */
const SAMPLES = Number(process.env.NM_SAMPLES) || 30;

/* ── tex 한 줄을 산술식으로 옮긴다. 옮길 수 없으면 null(=건너뜀) ──
   거듭제곱·분수·근호까지 옮긴다. 처음엔 이것들을 통째로 건너뛰었는데, 정작 거짓 식이
   거기 숨어 있었다(`D = -17^2 - 4(1)(28)` — 쓰인 대로면 -401인데 답은 177).
   TeX 관례 그대로 읽는 것이 핵심이다: `-8^2` 은 −(8²) 이지 (−8)² 가 아니다.
   생성기가 (−8)² 를 뜻했다면 `(-8)^2` 라고 써야 하고, 안 썼다면 그게 결함이다. */
function toExpr(tex, blank){
  let s = String(tex);
  /* `0.\square`(소수 한 자리) · `\square0` 처럼 □ 가 **자릿수 하나**인 관례는 값이 아니다 —
     0.(8) 로 읽히므로 계산할 수 없다. 채우기 전의 tex 로 봐야 암묵 곱 `4(1)` 과 안 헷갈린다. */
  if(/[0-9.]\s*\\square|\\square\s*[0-9]/.test(s)) return null;
  /* `D = …`, `r=…` 처럼 앞에 이름표가 붙은 줄 — 이름표는 값을 알 수 없으니 떼고,
     남은 식끼리만 견준다(`r=\sqrt{…}=□` 는 근호 안과 □ 가 맞는지 볼 수 있다). */
  s = s.replace(/^\s*[A-Za-z](_\{?[0-9]+\}?)?\s*=(?!=)/, '');
  /* □ 채우기 — blank가 배열이면 나온 순서대로 */
  const vals = Array.isArray(blank) ? blank.slice() : (blank === undefined ? [] : [blank]);
  let vi = 0, filled = true;
  s = s.replace(/\\square/g, () => {
    const v = vals[vi++];
    if(v === undefined || typeof v !== 'number' || !isFinite(v)) filled = false;
    return '(' + v + ')';
  });
  if(!filled) return null;
  /* 기호·명령 — 여기 없는 명령이 남아 있으면 아래에서 건너뛴다 */
  s = s.replace(/\\left|\\right|\\!/g, '')
       .replace(/\\,|\\;|\\ /g, ' ')
       .replace(/\\times|\\cdot(?!s)/g, '*').replace(/\\div/g, '/');
  /* \dfrac{a}{b} · \sqrt{a} — 중괄호가 중첩될 수 있어 안쪽부터 되풀이 */
  for(let i = 0; i < 6; i++){
    const before = s;
    s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
         .replace(/\\sqrt\{([^{}]*)\}/g, 'Math.sqrt($1)');
    if(s === before) break;
  }
  /* 거듭제곱 — 밑은 바로 왼쪽의 수 하나 또는 괄호 한 덩이다(앞의 음부호는 밑에 넣지
     않는다: TeX 가 그렇게 읽는다). `-17^2` → `-Math.pow(17,2)` = −289.
     `-Math.pow(...)` 는 JS 로 읽히지만 `-(17)**2` 는 구문 오류라, ** 대신 Math.pow 로 낸다. */
  for(let guard = 0; guard < 40 && s.indexOf('^') >= 0; guard++){
    const at = s.indexOf('^');
    /* 왼쪽 밑 */
    let i = at - 1; while(i >= 0 && s[i] === ' ') i--;
    let bs;
    if(s[i] === ')'){ let depth = 0; for(; i >= 0; i--){ if(s[i] === ')') depth++; else if(s[i] === '('){ depth--; if(!depth) break; } } if(i < 0) return null; bs = i; }
    else if(/[0-9.]/.test(s[i] || '')){ bs = i; while(bs > 0 && /[0-9.]/.test(s[bs-1])) bs--; }
    else return null;
    const base = s.slice(bs, at).trim();
    /* 오른쪽 지수 */
    const m = /^\s*(?:\{(-?[0-9]+)\}|(-?[0-9]+))/.exec(s.slice(at + 1));
    if(!m) return null;
    const exp = m[1] !== undefined ? m[1] : m[2];
    s = s.slice(0, bs) + 'Math.pow(' + base + ',' + exp + ')' + s.slice(at + 1 + m[0].length);
  }
  s = s.replace(/[{}]/g, '');
  /* 이중부호 — `3--1` 은 JS 로 못 읽는다. 수로는 3+1 이다(표기 결함은 여기 말고
     check-print 의 이중부호 검사가 본다). `+-` 도 마찬가지로 편다. */
  s = s.replace(/-\s*-\s*/g, '+').replace(/\+\s*-\s*/g, '-');
  /* 앞자리 0 — `00 + 9` 는 엄격 모드 JS 에서 구문 오류다. 수로는 0 이다. */
  s = s.replace(/(^|[^0-9.])0+([0-9])/g, '$1$2');
  /* 암묵 곱 — `4(1)(28)`, `(3)(5)` */
  s = s.replace(/(\d|\))\s*\(/g, '$1*(');
  if(/\\(?!cdots)/.test(s)) return null;                    /* 못 옮긴 명령이 남았다 */
  if(/[A-Za-z가-힣]/.test(s.replace(/Math\.sqrt/g, '@').replace(/Math\.pow/g, '@'))) return null;
  if(!/[0-9]/.test(s)) return null;
  return s;
}

function evalArith(part){
  const t = part.trim();
  if(!t) return NaN;
  if(!/^[0-9+\-*/(),. @]+$/.test(t.replace(/Math\.sqrt/g, '@').replace(/Math\.pow/g, '@'))) return NaN;
  try { const v = Function('"use strict";return (' + t + ')')(); return typeof v === 'number' ? v : NaN; }
  catch(e){ return NaN; }
}

/* 참이면 true, 거짓이면 false, 볼 수 없으면 null */
function stepTruth(tex, blank){
  const s = toExpr(tex, blank);
  if(s === null) return null;
  /* 한 줄에 식이 둘 이상 실린 관례(`9 + 10 = 19, 9 × 10 = 90`)가 흔하다.
     쉼표로 끊어 각각을 따로 본다 — 안 끊으면 세 변을 한 식으로 보고 전부 거짓이 된다. */
  if(s.includes(',') && !/Math\.(pow|sqrt)\([^()]*,/.test(s)){
    const parts = s.split(',').map(x => x.trim()).filter(x => x && /=/.test(x));
    if(parts.length > 1){
      let any = false;
      for(const part of parts){ const v = eqTruth(part); if(v === false) return false; if(v === true) any = true; }
      return any ? true : null;
    }
  }
  return eqTruth(s);
}

function eqTruth(s){
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
      /* 옮기는 데 성공했는데 값이 NaN 이면(음수의 제곱근 등) 그 줄 자체가 결함이다 —
         "볼 수 없다"가 아니라 "쓰인 대로 읽으면 수가 아니다". */
      if(Number.isNaN(v) && /^[0-9+\-*/(),. ]+$/.test(side.replace(/Math\.(sqrt|pow)/g, '@'))) return false;
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
    for(let i = 0; i < SAMPLES; i++){
      let p; try { p = gen(lv.params || {}, R.mulberry32(R.hashSeed(`eq-${k}-${lv.id}-${i}`))); } catch(e){ continue; }
      const lists = [p.steps, p.solution].filter(x => Array.isArray(x));
      for(const list of lists){
      let prevTail = null;   /* 앞 줄의 마지막 변 — `= \\square` 로 이어지는 줄을 위해 */
      for(const s of list){
        if(!s || typeof s.tex !== 'string') continue;
        seen++;
        /* `= □` 처럼 등호로 시작하는 줄은 앞 줄의 마지막 변에 이어 붙는다.
           안 이으면 `D = -17^2 - 4(1)(28)` 다음의 `= □` 가 서로 따로 놀아
           둘 다 "볼 수 없는 줄"로 빠져나간다 — 실제로 그렇게 빠져나갔다. */
        let tex = s.tex;
        if(/^\s*=/.test(tex) && prevTail) tex = prevTail + ' ' + tex;
        prevTail = String(s.tex).split('=').pop();
        const ok = stepTruth(tex, s.blank);
        if(ok === null) continue;
        checked++;
        if(ok === false){
          const key = `${k}L${lv.id}`;
          if(!shown.has(key)){ shown.add(key); console.log(`FAIL ${key}: ${tex}  (□=${JSON.stringify(s.blank)})`); }
          fails++;
        }
      }
      }
    }
  }
}
console.log(`\n단계 줄 ${seen} · 산술로 읽힌 줄 ${checked} · 거짓 ${fails}`);
if(!fails) console.log('통과 — 읽을 수 있는 단계는 전부 참인 식이다.');
process.exit(fails ? 1 : 0);
