#!/usr/bin/env node
/* ============================================================
   학습량 배수 검사 (2026-09-25) — 원장 "속도 양 조절하기 기능 추가하자 기본값을 두고 1.5배까지"
   과정 0~47 의 **모든 회차**(점검 제외)를 앱의 실제 학습지 조립(sessionRoleItems → renderMixedSheet)으로
   1배·1.25배·1.5배로 만들어 본다. 교과 드릴을 늘려도 같은 문제 없이 끝까지 채워져야 한다.
   모자라는 레벨은 courses.js COUNT_CAP 에 **데이터로** 상한을 적는다(인쇄 때 몰래 줄이지 않는다).
   check-weekly-sheets 는 과정마다 두 장만 보므로, 여기서 나머지 회차를 본다.
     node scripts/check-amount-sheets.js            # 전체
     node scripts/check-amount-sheets.js C29 C36    # 지정 과정만
   실패하면 exit 1, 브라우저가 없으면 exit 2(미실행).
   보고용 로컬 서버가 응답하는 exam.js 에만 읽기 고리를 단다(저장소 파일은 그대로).
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const only = process.argv.slice(2).filter(a => /^C\d+$/.test(a));
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  if(p.endsWith(path.join('app', 'exam.js'))) return res.end(fs.readFileSync(p, 'utf8').replace('window.NM_EXAM = NM_EXAM;',
    'window.NM_EXAM = NM_EXAM; window.__nmSheet = { sessionRoleItems, renderMixedSheet };'));
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/ws.html?w=2026-W39&c=C1&n=check&k=1&auto=0`);
  await page.waitForFunction(() => window.__nmSheet && window.NM_COURSES, null, { timeout:20000 });
  const courses = only.length ? only : Array.from({ length:48 }, (_, i) => 'C' + i);
  const result = await page.evaluate(courses => {
    const out = { sheets:0, bad:[], grew:0 };
    for(const amt of [1, 1.25, 1.5]){
      window.NM_WS_AMOUNT = amt;
      for(const c of courses){
        const course = NM_COURSES[c]; if(!course || course.comingSoon) continue;
        course.sessions.forEach((s, si) => {
          if(s.test) return;
          const seed = (p, i) => ('amt' + c + 's' + si + p + 'i' + i).toLowerCase().replace(/[^a-z0-9]/g, '');
          const R = __nmSheet.sessionRoleItems(course, s, seed);
          const items = [...R.school, ...R.strategy, ...R.application, ...R.stretch];
          if(amt > 1) out.grew += R.school.filter(it => it.count > ((s.school.find(d => d.t === it.thread && d.lv === it.level) || {}).count || 0)).length;
          out.sheets++;
          try { __nmSheet.renderMixedSheet(items, c + '-S' + (si + 1), {}); }
          catch(e){ out.bad.push({ amt, at:c + '-S' + (si + 1), code:e.code || '', thread:e.thread, level:e.level, msg:String(e.message).slice(0, 80) }); }
        });
      }
    }
    window.NM_WS_AMOUNT = null;
    return out;
  }, courses);
  await browser.close(); server.close();
  console.log(`회차 학습지 ${result.sheets}장(1·1.25·1.5배) · 배수로 늘어난 교과 칸 ${result.grew}`);
  if(result.bad.length){
    console.log(`\n✗ 실패 ${result.bad.length}장`);
    const by = {};
    result.bad.forEach(b => { const k = b.thread ? b.thread + '@' + b.level : b.msg; (by[k] = by[k] || []).push(b.amt + '배 ' + b.at); });
    Object.entries(by).forEach(([k, v]) => console.log(`  ${k}: ${v.slice(0, 6).join(', ')}${v.length > 6 ? ` … 외 ${v.length - 6}` : ''}`));
    process.exit(1);
  }
  console.log('통과 — 1.5배까지 모든 회차가 같은 문제 없이 채워진다.');
});
