'use strict';
/* 아이가 실제로 가는 길로 A-05 마법 노트까지 — localStorage를 심지 않고
   온보딩부터 클릭만으로 간다. 마을 → PRIME초급 → 유닛 보러가기 → 100의 보수 찾기 → 마법 노트 */
const { chromium } = require('playwright');
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.mp3':'audio/mpeg','.json':'application/json' };
const srv = http.createServer((req,rep)=>{ const u=decodeURIComponent(req.url.split('?')[0]); const f=path.join(ROOT,u);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rep.writeHead(404);rep.end();return;}
  rep.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(rep); });

srv.listen(0,'127.0.0.1', async () => {
  const base='http://127.0.0.1:'+srv.address().port+'/number_magic/index.html?enter=1';
  const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1280,height:900}});
  const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push('pageerror: '+e.message));
  p.on('console',m=>{ if(m.type()==='error' && !/TUNNEL|jsdelivr/.test(m.text())) errs.push('console: '+m.text()); });
  const trail=[];
  const step = async (label, fn) => { await fn(); await p.waitForTimeout(1100); trail.push(label); };

  await p.goto(base,{waitUntil:'networkidle'}); await p.waitForTimeout(1000);

  await step('온보딩(이름 입력 → 시작)', async () => {
    const name = p.locator('input').first();
    if (await name.count()) await name.fill('아이');
    await p.getByText('짜잔! 시작하기 ✨').first().click({force:true});
    await p.waitForTimeout(4000);
  });
  await step('마을에서 PRIME초급 건물 탭', () => p.locator('[data-spot="beginner"]').first().click({force:true}));
  await step('"유닛 보러가기 →"', () => p.getByText('유닛 보러가기').first().click({force:true}));
  await step('유닛 "100의 보수 찾기" 선택', () => p.getByText('100의 보수 찾기').first().click({force:true}));
  await step('단계 "마법 노트"', async () => {
    const t = p.getByText('마법 노트').first();
    if (await t.count()) await t.click({force:true});
  });

  const n = await p.locator('.cs-wrap').count();
  const stages = await p.locator('.nm-cstage').count();
  const mathSteps = await p.locator('.nm-mstep-box').count();
  console.log(trail.map((t,i)=>(i+1)+'. '+t).join('\n'));
  console.log('\n개념 단계 카드 ' + stages + '개 · 기존 mathSteps 블록 ' + mathSteps + '개 · 개념 애니메이션 ' + n + '개');
  await p.screenshot({path:'/tmp/nm-nav-final.png', fullPage:true});
  console.log('errors:', errs.length ? errs : 'none');
  if (!n) { console.log('실패: 클릭만으로 개념 애니메이션에 도달하지 못했다'); process.exitCode = 1; }
  await b.close(); srv.close();
});
