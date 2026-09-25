#!/usr/bin/env node
/* ============================================================
   교육과정 기호 검사 (2026-09-25) — 브라우저
   원장 "정수 개념에 max라는 표현을 어떻게 써 교육과정 용어에 안맞아".
   모든 유형·레벨에서 문항 4개씩 만들고, 고정 유닛의 한국어 학생 노출 자료까지 훑어
   **초·중·고 교과서가 쓰지 않는 기호**가 있는지 본다: max·min, gcd·lcm(약어 포함),
   바닥·천장 기호, mod, 나누어떨어짐(∣), ≡, 집합 기호(∈ 등), \operatorname.
   이런 것은 교과서 말(두 수 중 더 큰 수, 두 수의 최대공약수, 나머지, 배수, 항등식 …)로 쓴다.
   개념 설명에서 "GCD는 최대공약수의 뜻"처럼 용어를 정의하는 것은 허용하지만,
   문제·힌트·풀이·정답에서 약어로 계산을 지시하거나 gcd(a,b) 꼴로 쓰는 것은 허용하지 않는다.
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
  const baseUrl = `http://localhost:${server.address().port}`;
  await page.goto(`${baseUrl}/ws.html?c=C1&auto=0`);
  await page.waitForFunction(() => window.__nmGen, null, { timeout:20000 });
  /* ws.html은 선택 과정에 필요한 유닛만 지연 로드한다. 검사기는 index.html의 실제
     로드 순서를 우선 따르고, 디스크에만 있는 유닛도 뒤에 보태 모든 고정 자료를 본다. */
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const listed = [...indexHtml.matchAll(/<script\s+src="data\/units\/([^"]+\.js)"/g)].map(m => m[1]);
  const disk = fs.readdirSync(path.join(ROOT, 'data', 'units')).filter(f => f.endsWith('.js')).sort();
  const unitFiles = [...listed, ...disk.filter(f => !listed.includes(f))];
  for(const file of unitFiles) await page.addScriptTag({ url:`${baseUrl}/data/units/${encodeURIComponent(file)}` });
  const r = await page.evaluate(() => {
    const pats = [
      ['max·min', /\\(?:max|min)\b|\b(?:max|min)\s*\(/i],
      ['바닥·천장', /\\[lr](?:floor|ceil)\b/],
      ['mod', /\\[bp]?mod\b|\bmod\b/i],
      ['나누어떨어짐 ∣', /\\mid\b|∣/],
      ['≡', /\\equiv\b|≡/],
      ['집합 기호', /\\(?:in|notin|subset|subseteq|forall|exists)\b|[∈∉⊂⊆∀∃]/],
      ['operatorname', /\\operatorname\b/]
    ];
    const abbreviation = /\\(?:gcd|lcm)\b|\b(?:gcd|lcm|gcf|lcd)\b/i;
    const functionNotation = /\\(?:gcd|lcm)\b|\b(?:gcd|lcm)\s*\(\s*(?:[-+]?\d|[a-z]\\?\b)/i;
    const koreanTerm = /최대공약수|최소공배수/;
    const definitionLanguage = /뜻|약자|말|부르|나타내/;
    const bad = []; let generatedCount = 0, staticCount = 0;

    function inspect(text, where, concept){
      text = String(text || '');
      const visibleText = text.replace(/<[^>]*>/g, ' ');
      pats.forEach(([name, re]) => { if(re.test(visibleText)) bad.push(`${where} [${name}] ${visibleText.slice(0, 100)}`); });
      if(!abbreviation.test(visibleText)) return;
      const allowedDefinition = concept && koreanTerm.test(visibleText) && definitionLanguage.test(visibleText) && !functionNotation.test(visibleText);
      if(!allowedDefinition) bad.push(`${where} [gcd·lcm] ${visibleText.slice(0, 100)}`);
    }

    const skipKeys = new Set(['generator','params','id','tier','level','order','timeLimit','coins','prereq','edu']);
    function collectKorean(value, path, concept, out, includePlain = true){
      if(value == null) return;
      if(typeof value === 'string'){ if(includePlain) out.push({ path, text:value, concept }); return; }
      if(Array.isArray(value)){ value.forEach((v, i) => collectKorean(v, `${path}[${i}]`, concept, out, includePlain)); return; }
      if(typeof value !== 'object') return;
      if(Object.prototype.hasOwnProperty.call(value, 'ko')){
        collectKorean(value.ko, `${path}.ko`, concept, out, true);
        return;
      }
      Object.entries(value).forEach(([key, child]) => {
        if(skipKeys.has(key) || key === 'en' || key === 'zh') return;
        collectKorean(child, `${path}.${key}`, concept || key === 'discover', out, includePlain);
      });
    }

    const fixtures = [
      { text:'GCD는 최대공약수를 뜻합니다.', concept:true, pass:true },
      { text:'gcd(6,4)=2', concept:true, pass:false },
      { text:'GCD를 구합니다.', concept:false, pass:false },
      { text:'7 mod 3의 값을 구합니다.', concept:false, pass:false },
      { text:'두 식이 모든 x에서 같습니다.', concept:false, pass:true }
    ];
    fixtures.forEach((f, i) => {
      const before = bad.length;
      inspect(f.text, `검사기 자체 사례 ${i + 1}`, f.concept);
      const caught = bad.length > before;
      bad.splice(before);
      if(caught === f.pass) bad.push(`검사기 자체 사례 ${i + 1} 판정 오류: ${f.text}`);
    });

    for(const t of Object.keys(NM_THREADS)) for(const l of NM_THREADS[t].levels){
      const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('notation' + t + l.id));
      for(let i = 0; i < 4; i++){
        let p; try { p = __nmGen.generateProblem(t, l.id, rng); } catch(e){ break; }
        generatedCount++;
        const fields = [];
        collectKorean(p, `${t}@${l.id} 문항${i + 1}`, false, fields);
        fields.forEach(f => inspect(f.text, f.path, false));
      }
    }
    const staticFields = [];
    Object.entries(window.NM_UNITS || {}).forEach(([id, unit]) => collectKorean(unit, id, false, staticFields, true));
    collectKorean(window.NM_THREADS || {}, 'NM_THREADS', false, staticFields, false);
    collectKorean(window.NM_ROADMAP || {}, 'NM_ROADMAP', false, staticFields, false);
    collectKorean(window.NM_CURRICULUM || {}, 'NM_CURRICULUM', false, staticFields, false);
    staticFields.forEach(f => inspect(f.text, f.path, f.concept));
    staticCount = staticFields.length;
    return { generatedCount, unitCount:Object.keys(window.NM_UNITS || {}).length, staticCount, bad:[...new Set(bad)] };
  });
  await browser.close(); server.close();
  console.log(`생성 문항 ${r.generatedCount}개(유형·레벨마다 4개)와 고정 유닛 ${r.unitCount}개·한국어 학생 노출 필드 ${r.staticCount}개 검사`);
  if(r.bad.length){ console.log(`\n✗ 교육과정에 없는 기호 ${r.bad.length}건`); r.bad.slice(0, 40).forEach(b => console.log('  ' + b)); process.exit(1); }
  console.log('통과 — 교과서가 쓰지 않는 기호(max·min, 최대공약수(a,b)식 약어, 바닥·mod, ∣, ≡, ∈)가 없다.');
});
