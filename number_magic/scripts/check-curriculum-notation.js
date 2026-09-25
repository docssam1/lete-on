#!/usr/bin/env node
/* ============================================================
   교육과정 기호 검사 (2026-09-25) — 브라우저
   원장 "정수 개념에 max라는 표현을 어떻게 써 교육과정 용어에 안맞아".
   모든 유형·레벨에서 문항 4개씩 만들어 식(tex)과 풀이 줄에 **초·중·고 교과서가 쓰지 않는 기호**가
   있는지 본다: max·min, gcd·lcm(약어 포함), 바닥·천장 기호, mod, 나누어떨어짐(∣), ≡, 집합 기호(∈ 등),
   \operatorname. 이런 것은 교과서 말(두 수 중 더 큰 수, a, b의 최대공약수, 몫, 배수, 항등식 …)로 쓴다.
   (Σ·log 등 고등 교육과정에 있는 기호는 대상이 아니다.)
     node scripts/check-curriculum-notation.js
   실패하면 exit 1, 브라우저가 없으면 exit 2(미실행).
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control':'no-store' });
  if(p.endsWith(path.join('app', 'exam.js'))) return res.end(fs.readFileSync(p, 'utf8').replace('window.NM_EXAM = NM_EXAM;',
    'window.NM_EXAM = NM_EXAM; window.__nmGen = { generateProblem };'));
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/ws.html?c=C1&auto=0`);
  await page.waitForFunction(() => window.__nmGen, null, { timeout:20000 });
  const r = await page.evaluate(() => {
    const pats = [['max·min', /\\(max|min)\b/], ['gcd·lcm', /\\(gcd|lcm)\b|\b(gcd|lcm|GCD|LCM|GCF|LCD)\b/], ['바닥·천장', /\\[lr](floor|ceil)/],
      ['mod', /\\[bp]?mod\b/], ['나누어떨어짐 ∣', /\\mid\b/], ['≡', /\\equiv/], ['집합 기호', /\\(in|notin|subset|subseteq|forall|exists)\b/], ['operatorname', /\\operatorname/]];
    const bad = []; let n = 0;
    for(const t of Object.keys(NM_THREADS)) for(const l of NM_THREADS[t].levels){
      const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('notation' + t + l.id));
      for(let i = 0; i < 4; i++){
        let p; try { p = __nmGen.generateProblem(t, l.id, rng); } catch(e){ break; }
        n++;
        [['식', p.tex], ...(p.solution || []).map(s => ['풀이', s.tex])].forEach(([w, x]) => {
          x = String(x || '');
          pats.forEach(([name, re]) => { if(re.test(x)) bad.push(`${t}@${l.id} ${w} [${name}] ${x.slice(0, 80)}`); });
        });
      }
    }
    return { n, bad:[...new Set(bad)] };
  });
  await browser.close(); server.close();
  console.log(`문항 ${r.n}개(유형·레벨마다 4개)의 식·풀이 검사`);
  if(r.bad.length){ console.log(`\n✗ 교육과정에 없는 기호 ${r.bad.length}건`); r.bad.slice(0, 40).forEach(b => console.log('  ' + b)); process.exit(1); }
  console.log('통과 — 교과서가 쓰지 않는 기호(max·min, 최대공약수(a,b)식 약어, 바닥·mod, ∣, ≡, ∈)가 없다.');
});
