#!/usr/bin/env node
/* ============================================================
   회차 세 층 검사 (2026-09-25 강화) — 원장 "교과 연산과 창의 연산 문장제가 적절히 연결" ·
   "문항수는 하루 30분 풀 분량, 난이도별로 연습도 되어야지"
   전에는 "과정 안에 그 역할이 하나라도 있으면 통과"였다(GPT 검수: 형식만 있고 편성이 아님).
   이제 **과정 0~37 의 모든 회차**를 한 회차씩 본다. 실패하면 exit 1.

     A. 교과(school)에 그 주 드릴이 있다 — 복습만 있는 회차는 실패
     B. 창의 연산 드릴(strategy.practice)이 매 회차 있다
     C. 적용(application)이 매 회차 있다. 초등 문장제(kind 'word', from 'school')는 **그 회차 교과 드릴과
        같은 유형·레벨**이어야 한다 — 같은 계산을 문장으로 다시 푸는 것이 "연결"이다
     D. 복습은 같은 학교 구간(유아·초등·중등)에서 처음 배운 유형만 — 중등에 초등 복습 금지
     E. 한 회차 안에서 같은 유형·레벨이 두 층에 실리지 않는다(C 의 문장제만 예외)
     F. 모든 칸에 count 가 있고, 회차 예상 시간이 30분 안팎(유아 20분)이다 — 쉬운 유형 12 이상,
        어려운 유형은 쉬운 유형보다 적지 않다
     G. 중등 진도 보기(NM_MIDDLE_PACING)가 정규 과정 C29~C37 과 **회차·블록이 똑같다**(두 번째 편성 금지),
        옛 번호 M1-S01~M3-S14 가 모두 정규 회차로 이어진다
   --browser: 초등 문장제 칸의 유형·레벨이 실제로 문장제로 바뀌는지 앱 함수로 확인한다(브라우저 필요).
     node scripts/check-session-roles.js [--browser]
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const w = { document:{}, console:{log(){},warn(){},error(){}}, Math, JSON, Object, Array, String, Number, RegExp, Date, parseInt, parseFloat, isNaN, isFinite };
w.window = w; w.global = w;
const sb = vm.createContext(w);
for(const f of ['data/middle-pacing.js','data/threads.js','data/wordable.js','data/courses.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename:f });
const C = w.NM_COURSES, SPEC = w.NM_COURSE_SPEC, T = w.NM_THREADS;
const BAND = { level0:'pre', level1:'elem', level2:'elem', level3:'elem', challenge:'elem', middle1:'middle', middle2:'middle', middle3:'middle' };
const ELEM = { level1:1, level2:1, level3:1, challenge:1 };
const firstBand = {};
SPEC.forEach(s => (s.drills || []).forEach(r => { const t = String(r).split('@')[0]; if(!(t in firstBand)) firstBand[t] = BAND[s.tier] || 'high'; }));
const fail = [], rows = [];
const key = d => d.t + '@' + d.lv;
let sessions = 0, full = 0, wordItems = new Map();
for(let n = 0; n <= 37; n++){
  const c = C['C' + n];
  if(!c || c.comingSoon) continue;
  const band = BAND[c.tier];
  let s3 = 0, words = 0, draws = 0; const mins = [];
  c.sessions.forEach((s, i) => {
    if(s.test) return;
    sessions++;
    const at = `C${n} 회차 ${i + 1}`;
    if(!s.school){ fail.push(`${at}: 세 층 정보 없음`); return; }
    const own = s.school.filter(d => !d.review);
    const okA = own.length > 0, okB = !!(s.strategy && s.strategy.practice.length), okC = s.application.length > 0;
    if(!okA) fail.push(`A · ${at}: 교과 칸이 복습뿐이다`);
    if(!okB) fail.push(`B · ${at}: 창의 연산 드릴이 없다`);
    if(!okC) fail.push(`C · ${at}: 적용 칸이 없다`);
    if(okA && okB && okC) s3++;
    s.application.forEach(a => {
      if(a.kind === 'word' && a.from === 'school'){
        words++;
        if(!own.some(d => key(d) === key(a))) fail.push(`C · ${at}: 문장제 ${key(a)} 가 이 회차 교과 드릴과 연결되지 않는다`);
        if(!wordItems.has(key(a))) wordItems.set(key(a), at);
      }
      if(a.kind === 'drawing') draws++;
    });
    s.school.filter(d => d.review).forEach(d => {
      if(firstBand[d.t] !== band) fail.push(`D · ${at}: 복습 ${key(d)} 는 다른 학교 구간(${firstBand[d.t]}) 유형이다`);
    });
    const seen = {};
    const mark = (d, layer) => { const k = key(d); if(seen[k] && seen[k] !== layer) fail.push(`E · ${at}: ${k} 가 ${seen[k]}·${layer} 두 층에`); seen[k] = seen[k] || layer; };
    s.school.forEach(d => mark(d, 'school'));
    s.strategy.practice.forEach(d => mark(d, 'strategy'));
    s.application.filter(a => !(a.kind === 'word' && a.from === 'school') && a.kind !== 'drawing').forEach(d => mark(d, 'application'));
    [...s.school, ...s.strategy.practice, ...s.application].forEach(d => { if(!(d.count > 0)) fail.push(`F · ${at}: ${key(d)} 에 문항 수(count)가 없다`); });
    own.forEach(d => { if(d.count < 12) fail.push(`F · ${at}: ${key(d)} ${d.count}문항 — 교과는 12문항 이상`); });
    const hard = own.filter(d => d.difficulty === 'hard'), easy = own.filter(d => d.difficulty === 'easy');
    if(hard.length && easy.length && Math.min(...hard.map(d => d.count)) < Math.max(...easy.map(d => d.count)))
      fail.push(`F · ${at}: 어려운 유형이 쉬운 유형보다 적게 배정됐다`);
    const lo = c.tier === 'level0' ? 15 : 20, hi = c.tier === 'level0' ? 25 : 38;
    if(!(s.minutes >= lo && s.minutes <= hi)) fail.push(`F · ${at}: 예상 ${s.minutes}분 — ${lo}~${hi}분 밖`);
    mins.push(s.minutes);
  });
  const ns = c.sessions.filter(s => !s.test).length;
  if(s3 === ns) full++;
  rows.push(`C${String(n).padEnd(3)}${c.tier.padEnd(10)}회차 ${String(ns).padStart(2)} · 세 층 ${String(s3).padStart(2)} · 교과→문장제 ${String(words).padStart(2)} · 그리기 ${draws} · ${Math.min(...mins)}~${Math.max(...mins)}분`);
}
/* G. 중등 진도 보기 = 정규 과정 */
const P = w.NM_MIDDLE_PACING;
let mpSessions = 0;
if(!P || P.derivedFrom !== 'NM_COURSES') fail.push('G · NM_MIDDLE_PACING 이 정규 과정에서 파생된 보기가 아니다');
else {
  [1, 2, 3].forEach(g => {
    const G = P.grades[g];
    const reg = G.courseKeys.flatMap(k => C[k].sessions.filter(s => !s.test).map(s => ({ k, s })));
    if(G.sessions.length !== reg.length) fail.push(`G · 중${g}: 보기 ${G.sessions.length}회 ≠ 정규 ${reg.length}회`);
    G.sessions.forEach((v, i) => {
      mpSessions++;
      const r = reg[i]; if(!r) return;
      const want = [...r.s.school, ...r.s.strategy.practice, ...r.s.application.filter(a => a.from !== 'school')]
        .map(d => d.kind === 'drawing' ? 'draw:' + d.mode + '×' + d.count : key(d) + '×' + d.count).join(' ');
      const got = v.blocks.map(b => b.kind === 'drawing' ? 'draw:' + b.mode + '×' + b.n : b.t + '@' + b.lv + '×' + b.n).join(' ');
      if(want !== got) fail.push(`G · ${v.id}: 보기 블록이 정규 회차와 다르다\n      보기 ${got}\n      정규 ${want}`);
    });
  });
  (P.legacyIds || []).forEach(id => { if(!P.getSession(+id[1], id)) fail.push(`G · 옛 번호 ${id} 가 정규 회차로 이어지지 않는다`); });
}
console.log(rows.join('\n'));
console.log(`\n과정 0~37 회차 ${sessions} · 세 층이 모두 있는 과정 ${full}/38 · 중등 보기 ${mpSessions}회(정규에서 계산)`);

function finish(){
  if(fail.length){ console.log(`\n✗ 실패 ${fail.length}건`); fail.slice(0, 60).forEach(s => console.log('  ' + s)); if(fail.length > 60) console.log(`  … ${fail.length - 60}건 더`); process.exit(1); }
  console.log('\n통과 — 모든 회차가 교과 → 창의 → 적용을 갖고, 문장제는 그 회차 교과와 이어지며, 30분 안팎이다.');
}
if(!process.argv.includes('--browser')) finish();
else {
  /* 문장제 변환 — 앱의 generateProblem·applyWordProblems 로 6문항을 만들어 모두 문장이 되는지 본다.
     보고용 로컬 서버가 응답하는 exam.js 에만 읽기 고리를 단다(저장소 파일은 그대로). */
  const { chromium } = require('./lib/playwright');
  const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json' };
  const server = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    if(p.endsWith(path.join('app', 'exam.js'))) return res.end(fs.readFileSync(p, 'utf8').replace('window.NM_EXAM = NM_EXAM;',
      'window.NM_EXAM = NM_EXAM; window.__nmWord = { generateProblem, applyWordProblems };'));
    fs.createReadStream(p).pipe(res);
  });
  server.listen(0, async () => {
    const browser = await chromium.launch(); const page = await browser.newPage();
    await page.goto(`http://localhost:${server.address().port}/ws.html?w=2026-W39&c=C4&n=check&k=1&cad=w2&auto=0`);
    await page.waitForFunction(() => window.__nmWord, null, { timeout:20000 });
    const list = [...wordItems.keys()];
    const bad = await page.evaluate(list => {
      const out = [];
      for(const k of list){
        const [t, lv] = k.split('@'); const ps = [];
        const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('word' + k));
        for(let i = 0; i < 6; i++) ps.push(__nmWord.generateProblem(t, +lv, rng));
        try { __nmWord.applyWordProblems(ps, 'all', NM_RNG.hashSeed('w' + k)); } catch(e){ out.push(k + ' 오류 ' + e.message); continue; }
        const n = ps.filter(p => p.word).length;
        if(n < ps.length) out.push(`${k}: 6문항 중 ${n}문항만 문장제가 됨`);
      }
      return out;
    }, list);
    await browser.close(); server.close();
    console.log(`문장제 변환 확인 ${list.length}유형·레벨`);
    bad.forEach(b => fail.push('C · 문장제로 바뀌지 않음 ' + b + ` (첫 회차 ${wordItems.get(b.split(':')[0].split(' ')[0])})`));
    finish();
  });
}
