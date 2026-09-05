#!/usr/bin/env node
/* ============================================================
   풀이 단계(solution) 검사기 — 학습지 v2 ★예시 문항용 (2026-09-04)
   ------------------------------------------------------------
   중·고등(MD*)·경시(CH*) 생성기가 붙인 `solution: [{tex, blank?}, …]`이
   ① 있는지 ② 모양이 맞는지 ③ 마지막 단계의 blank가 answer와 같은지
   ④ solution을 붙이면서 기존 출력(tex·answer·prompt·steps)이 한 글자도
   안 바뀌었는지(HEAD 버전과 같은 시드로 비교)를 검사한다.

   쓰는 법:
     node scripts/check-solution-steps.js            # MD*·CH* 전체
     node scripts/check-solution-steps.js MD4 CH2    # 지정 스레드만
   실패가 하나라도 있으면 exit 1.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const ONLY = process.argv.slice(2).map(s => s.toUpperCase());
const FILES = ['engine/generators.js','engine/rng.js','engine/scene-model.js',
  'engine/threads/ns_ad.js','engine/threads/sb.js','engine/threads/ml.js','engine/threads/dv.js',
  'engine/threads/fr.js','engine/threads/dc_mx.js','engine/threads/el.js','engine/threads/nl.js',
  'engine/threads/wp.js','engine/threads/adv.js','engine/threads/mid.js','engine/threads/mid2.js',
  'engine/threads/mid3.js','engine/threads/mid4.js','engine/threads/mid5.js','engine/threads/mid6.js',
  'engine/threads/mid7.js','engine/threads/mid8.js','data/threads.js'];

function loadEngine(readFile){
  const vm = require('vm'); const w = { document: {}, console, Math, JSON, Object, Array, String, Number, RegExp, Date, parseInt, parseFloat, isNaN, isFinite };
  w.window = w; w.global = w;
  const sb = vm.createContext(w);
  for(const f of FILES){ vm.runInContext(readFile(f), sb, { filename: f }); }
  return w;
}
const cur = loadEngine(f => fs.readFileSync(path.join(ROOT, f), 'utf8'));
let head = null;
try {
  head = loadEngine(f => execSync(`git show HEAD:number_magic/${f}`, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }));
} catch(e){ console.log('(HEAD 비교 생략: ' + e.message.split('\n')[0] + ')'); }

const T = cur.NM_THREADS, G = cur.NM_TGEN, R = cur.NM_RNG;
const targets = Object.keys(T).filter(k => /^(MD|CH)\d+$/.test(k)).filter(k => !ONLY.length || ONLY.includes(k));
const norm = v => Array.isArray(v) ? v.map(x => String(x).trim()).join(',') : String(v).trim();
const strip = p => { const o = Object.assign({}, p); delete o.solution; return JSON.stringify(o); };
let fails = 0, checked = 0, withSol = 0;
for(const k of targets){
  const t = T[k], gen = G[t.gen]; if(!gen){ console.log(`FAIL ${k}: 생성기 없음`); fails++; continue; }
  const hgen = head && head.NM_TGEN[head.NM_THREADS[k] && head.NM_THREADS[k].gen];
  for(const lv of (t.levels || [])){
    const params = lv.params || {};
    for(let i = 0; i < 20; i++){
      const seed = R.hashSeed(`sol-${k}-${lv.id}-${i}`);
      let p; try { p = gen(params, R.mulberry32(seed)); } catch(e){ console.log(`FAIL ${k} L${lv.id} #${i}: 생성기 예외 ${e.message}`); fails++; continue; }
      checked++;
      if(hgen){ let hp = null; try { hp = hgen(params, head.NM_RNG.mulberry32(seed)); } catch(e){}
        if(hp && strip(hp) !== strip(p)){ console.log(`FAIL ${k} L${lv.id} #${i}: solution 외 출력이 HEAD와 다름`); fails++; } }
      const sol = p.solution;
      if(!Array.isArray(sol) || !sol.length){ if(i===0) console.log(`MISS ${k} L${lv.id}: solution 없음`); fails++; continue; }
      withSol++;
      let bad = null;
      sol.forEach((s, j) => {
        if(!s || typeof s.tex !== 'string' || !s.tex.trim()) bad = bad || `step ${j+1} tex 없음`;
        else { const n = (s.tex.match(/\\square/g) || []).length;
          const need = ('blank' in s) ? (Array.isArray(s.blank) ? s.blank.length : 1) : 0;
          if('blank' in s && n !== need) bad = bad || `step ${j+1}: \\square ${need}개여야 함(지금 ${n})`;
          if(!('blank' in s) && n) bad = bad || `step ${j+1}: blank 없는 줄에 \\square`; }
      });
      const last = sol[sol.length - 1];
      if(!bad && !('blank' in last)) bad = '마지막 단계에 blank 없음';
      if(!bad && norm(last.blank) !== norm(p.answer)) bad = `마지막 blank(${norm(last.blank)}) ≠ answer(${norm(p.answer)})`;
      if(bad){ console.log(`FAIL ${k} L${lv.id} #${i}: ${bad}`); fails++; }
    }
  }
}
console.log(`\n검사 ${checked}문항 · solution 있음 ${withSol} · 실패 ${fails}`);
process.exit(fails ? 1 : 0);
