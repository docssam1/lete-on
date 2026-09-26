#!/usr/bin/env node
/* ============================================================
   속도 비교 진단 검사 (app/pace-compare.js + 연산 로드맵 화면) — 2026-09-26
   ------------------------------------------------------------
   1) 기준표가 원본(roadmap/index.html 의 ROAD_L0.calc · LEVELS.shift)과 같은가 — 원본을 직접 읽어 대조
   2) KMO 세 점의 근거 문장이 과정-로드맵.md 에 그대로 있는가
   3) 마일스톤 ↔ 과정 대응이 courses.js 와 맞는가(중등 29=middle1 첫 과정, 고등 38=highmath1 첫 과정 …)
   4) 문구가 ko/en/zh 세 언어 모두 있고, 자리표시가 같고, 실제 학원 이름이 없는가
   5) 실제 앱(브라우저)에서 고정 시나리오가 말이 되는가 — 빠르게 하면 위로, 제안대로 하면 목표에 닿는가
   node scripts/check-pace-compare.js         # 실패 exit 1 · 브라우저가 없으면 1~4만 하고 exit 2
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path'), http=require('http'), assert=require('assert/strict');
const APP=path.resolve(__dirname,'..'), ROOT=path.resolve(APP,'..');
const fails=[]; const ok=[];
const check=(name,fn)=>{ try{ fn(); ok.push(name); }catch(e){ fails.push(name+': '+e.message); } };

global.window={};
const PC=require(path.join(APP,'app/pace-compare.js'));
require(path.join(APP,'data/courses.js'));
const C=global.window.NM_COURSES;
const BANNED=/소마|황소|S학원|Academy S|S学院/;

check('기준표 = roadmap/index.html 원본', ()=>{
  const src=fs.readFileSync(path.join(ROOT,'roadmap/index.html'),'utf8');
  const calc=src.slice(src.indexOf('calc:['), src.indexOf(']', src.indexOf('calc:['))+1);
  const blocks=[...calc.matchAll(/B\('([^']*)','calc',(\d+),(\d+),(\d+),(\d+)\)/g)].map(m=>({t:m[1],end:[+m[4],+m[5]]}));
  assert(blocks.length>=6, 'ROAD_L0.calc 블록을 못 읽음');
  const want={K:/K/, G2:/2권/, G3:/3권/, G4:/4권/, G5:/5권/, G6:/6권/};
  Object.keys(want).forEach(id=>{
    const b=blocks.find(x=>want[id].test(x.t)); assert(b, id+' 블록 없음');
    assert.deepEqual(PC.ROADMAP_L0_CALC_END[id], b.end, id+' 끝나는 달이 원본과 다름');
  });
  const shift=id=>{ const m=src.match(new RegExp("\\{id:'"+id+"'[^}]*shift:(\\d+)")); assert(m,id+' shift 못 읽음'); return +m[1]; };
  assert.equal(PC.bench('a').shift, shift('L4'), 'A반 = L4 shift');
  assert.equal(PC.bench('p').shift, shift('L1'), '프리미어 = L1 shift');
  assert.match(src, /id:'L4'[^}]*A반/, 'L4 가 A반 기준이어야 함');
  assert.match(src, /id:'L1'[^}]*프리미어/, 'L1 이 프리미어 기준이어야 함');
  // 5세 5월(격자 첫 칸) = 학령 -34, 7세 7월(마지막) = -8
  assert.equal(PC.smOfKAge(5,5), -34); assert.equal(PC.ROADMAP_GRID_END_SM, -8);
  // L0 6권은 6세 11월에 끝남 → 6세 12월(-15) 도달, L1 = -12, L4 = -3(격자 밖)
  assert.equal(PC.bench('p').fast.find(a=>a.id==='G6').sm, -15);
  assert.equal(PC.bench('p').anchors.find(a=>a.id==='G6').sm, -12);
  const a6=PC.bench('a').anchors.find(a=>a.id==='G6'); assert.equal(a6.sm,-3); assert(a6.beyondGrid,'A반 6권은 격자 밖 표시');
});
check('KMO 근거 문장', ()=>{
  const md=fs.readFileSync(path.join(APP,'과정-로드맵.md'),'utf8');
  assert(md.includes('5살 14+9 → 초1 11월 중등 연산 → 초3 6월'), '원장 실측 문장이 과정-로드맵.md 에 없음');
  assert(md.includes('4.6년'));
  const k=PC.bench('k');
  assert.equal(k.anchors.find(a=>a.id==='MID').sm, 8, '초1 11월 = 8');
  assert.equal(k.anchors.find(a=>a.id==='HIGH').sm, 27, '초3 6월 = 27');
  const c2=k.anchors.find(a=>a.id==='C2');
  assert(Math.abs((27-c2.sm)/12-4.6)<0.1, '14+9 시점은 4.6년 역산');
});
check('기준선은 나이·과정 모두 앞으로만 간다', ()=>{
  PC.BENCH.forEach(b=>{ [b.anchors,b.fast].filter(Boolean).forEach(list=>{
    for(let i=1;i<list.length;i++){ assert(list[i].sm>list[i-1].sm && list[i].course>list[i-1].course, b.key+' '+list[i].id); }
  }); });
  // 빠를수록 먼저: 프리미어 빠른 쪽 < 프리미어 < A반
  PC.bench('a').anchors.forEach(a=>{
    const p=PC.bench('p').anchors.find(x=>x.id===a.id), f=PC.bench('p').fast.find(x=>x.id===a.id);
    assert(f.sm<p.sm && p.sm<a.sm, a.id);
  });
});
check('마일스톤 ↔ courses.js', ()=>{
  const tier=n=>C['C'+n]&&C['C'+n].tier;
  PC.MILESTONES.forEach((m,i)=>{
    assert(C['C'+m.course], m.id+' 과정 C'+m.course+' 없음');
    if(i) assert(m.course>PC.MILESTONES[i-1].course, '과정 번호 오름차순');
  });
  assert.equal(tier(PC.milestone('MID').course),'middle1'); assert.notEqual(tier(PC.milestone('MID').course-1),'middle1');
  assert.equal(tier(PC.milestone('HIGH').course),'highmath1'); assert.equal(tier(PC.milestone('HIGH').course-1),'middle3');
  assert.equal(tier(PC.milestone('K').course-1),'level0', 'K = 수의 나라 끝');
  // 주제 대조: 앞 과정 제목에 그 단계의 주제가 있어야 한다
  const title=n=>C['C'+n].title.ko;
  assert.match(title(2),/받아올림/); assert.match(title(4),/두 자리/); assert.match(title(7),/구구단/);
  assert.match(title(9),/곱셈|나머지/); assert.match(title(12),/나눗셈/);
  // 기준표의 모든 점이 마일스톤(또는 KMO 14+9 = 과정 2)에 걸려 있다
  PC.BENCH.forEach(b=>b.anchors.forEach(a=>{ assert(PC.milestone(a.id)||(b.key==='k'&&a.id==='C2'&&a.course===2), b.key+' '+a.id); }));
});
check('문구 3개 언어 · 이름', ()=>{
  const all=[];
  Object.keys(PC.STR).forEach(k=>{
    const s=PC.STR[k];
    ['ko','en','zh'].forEach(l=>{ assert(typeof s[l]==='string'&&s[l].trim(), k+'.'+l+' 없음'); all.push(s[l]); });
    const ph=l=>(s[l].match(/\{\w+\}/g)||[]).sort().join();
    assert.equal(ph('en'),ph('ko'),k+' 자리표시(en)'); assert.equal(ph('zh'),ph('ko'),k+' 자리표시(zh)');
    assert(!/(합니다|습니다)[.!]?$/.test(s.ko), k+' 한국어는 해요체');
  });
  PC.BENCH.forEach(b=>['ko','en','zh'].forEach(l=>{ assert(b.name[l]); all.push(b.name[l]); }));
  PC.MILESTONES.forEach(m=>['ko','en','zh'].forEach(l=>{ assert(m.name[l]); all.push(m.name[l]); }));
  assert.equal(PC.bench('a').name.ko,'이과 최상위권'); assert.equal(PC.bench('p').name.ko,'초등 KMO 경험'); assert.equal(PC.bench('k').name.ko,'초4 고등수학 진도');
  all.forEach(s=>assert(!BANNED.test(s), '실제 학원 이름: '+s));
});
check('순수 판정 — 빠를수록 위로', ()=>{
  // 과정 N 까지 주 = 세션 수 × 배수(주 1회 기준)라는 단순 모형으로 판정 함수만 본다
  const sess=Object.keys(C).map(k=>({n:+k.slice(1),s:C[k].sessions.length})).sort((a,b)=>a.n-b.n);
  const wt=(cur,f)=>t=>sess.filter(x=>x.n>=cur&&x.n<t).reduce((a,x)=>a+x.s,0)*f;
  const rank=ev=>ev.verdict?PC.bench(ev.verdict.key).rank:0;
  const slow=PC.evaluate({curNum:10,curFrac:0,smNow:-18,weeksTo:wt(10,1.3)});
  const fast=PC.evaluate({curNum:10,curFrac:0,smNow:-18,weeksTo:wt(10,0.5)});
  assert(rank(fast)>=rank(slow) && rank(fast)>0, 'fast '+rank(fast)+' slow '+rank(slow));
  const out=PC.evaluate({curNum:20,curFrac:0,smNow:30,weeksTo:wt(20,1)});
  assert(out.out && !out.target, '초3 9월은 비교 범위 밖');
});

function report(extra){
  console.log(`속도 비교 진단 검사 — 통과 ${ok.length}${extra?' · '+extra:''}`);
  ok.forEach(n=>console.log('  ✓ '+n));
  if(fails.length){ console.log('✗'); fails.forEach(f=>console.log('  '+f)); process.exitCode=1; }
}

/* ── 브라우저: 실제 앱의 주차 계산으로 ── */
let pw=null; try{ pw=require('./lib/playwright'); }catch(e){}
(async()=>{
  if(!pw||!pw.chromium){ report('브라우저 미실행'); if(!process.exitCode) process.exitCode=2; return; }
  const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json'};
  const server=http.createServer((req,res)=>{
    const f=path.join(ROOT,decodeURIComponent(req.url.split('?')[0]));
    if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
    res.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser;
  try{
    browser=await pw.chromium.launch({args:['--disable-gpu','--disable-webgl']});
    const page=await browser.newPage({viewport:{width:390,height:844}}); const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>/supabase|google-analytics|googletagmanager/.test(r.request().url())?r.abort():r.continue());
    await page.addInitScript(()=>{ if(sessionStorage.getItem('pcSeeded')) return; sessionStorage.setItem('pcSeeded','1'); localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'속도 검수',view:'courseroad',
      avatar:{kind:'boy'},account:{status:'active'},placement:{course:'C10',self:true},roadCadence:'w2',roadPace:'p2',roadSpeed:1})); });
    await page.goto(`http://127.0.0.1:${server.address().port}/number_magic/index.html?enter=1`,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof window.NM_PACE_DIAG==='function',null,{timeout:60000});
    const r=await page.evaluate(()=>{
      const D=window.NM_PACE_DIAG, PC=window.NM_PACE_COMPARE;
      const rank=x=>x&&x.ev.verdict?PC.bench(x.ev.verdict.key).rank:0;
      const base={curKey:'C10',curFrac:0,smNow:-18};
      const run=o=>D(Object.assign({},base,o));
      const out={};
      out.noAge=D()===null;                                          // 나이 없으면 판정하지 않는다
      out.w2=run({cad:'w2',pace:'p2',speed:1});
      out.w1=run({cad:'w1',pace:'p2',speed:1});
      out.slow=run({cad:'w1',pace:'p4',speed:0.7});
      out.fast=run({cad:'w2',pace:'p0',speed:1.5});
      out.rank={w2:rank(out.w2),w1:rank(out.w1),slow:rank(out.slow),fast:rank(out.fast)};
      // 제안을 그대로 적용하면 목표 기준에 닿는가
      out.applied=[];
      [out.w1,out.slow].forEach(x=>{ if(!x.ev.target) return; x.sugg.forEach(s=>{
        const y=run({cad:s.cad,pace:s.pace,speed:s.speed});
        out.applied.push({target:PC.bench(x.ev.target.key).rank, got:rank(y), saved:s.saved});
      }); });
      out.young=run({curKey:'C3',smNow:-27,cad:'w1',pace:'p2',speed:1});
      out.g3=run({curKey:'C20',smNow:30,cad:'w2',pace:'p2',speed:1});
      out.m1=run({curKey:'C29',smNow:78,cad:'w2',pace:'p2',speed:1});
      // 빠를수록 고등 연산 도달이 이르다(같은 아이)
      const hi=x=>x.ev.rows.find(q=>q.key==='k').childSm;
      out.hiOrder=[hi(out.slow),hi(out.w1),hi(out.w2),hi(out.fast)];
      const strip=x=>x&&{v:x.ev.verdict&&x.ev.verdict.key,t:x.ev.target&&x.ev.target.key,out:x.ev.out,n:x.sugg.length};
      ['w2','w1','slow','fast','young','g3','m1'].forEach(k=>out[k]=strip(out[k]));
      return out;
    });
    check('앱: 나이 모르면 판정 안 함', ()=>assert(r.noAge));
    check('앱: 6세 과정10 주2회 표준 → 어떤 기준에 닿음', ()=>assert(r.rank.w2>0, JSON.stringify(r.w2)));
    check('앱: 빠르게 할수록 위로(단조)', ()=>{
      assert(r.rank.slow<=r.rank.w1 && r.rank.w1<=r.rank.w2 && r.rank.w2<=r.rank.fast, JSON.stringify(r.rank));
      assert(r.rank.slow<r.rank.fast, '가장 느림과 가장 빠름이 같은 판정');
      for(let i=1;i<r.hiOrder.length;i++) assert(r.hiOrder[i]<r.hiOrder[i-1], '고등 도달 시점 '+JSON.stringify(r.hiOrder));
    });
    check('앱: 제안대로 바꾸면 목표에 닿고 기간이 준다', ()=>{
      assert(r.applied.length>0, '제안이 하나도 없음');
      r.applied.forEach(a=>{ assert(a.got>=a.target, JSON.stringify(a)); assert(a.saved>0, JSON.stringify(a)); });
    });
    check('앱: 5세 과정3 → 판정 있음', ()=>assert(r.young&&!r.young.out, JSON.stringify(r.young)));
    check('앱: 초3 9월 · 중1 → 비교 범위 밖, 제안 없음', ()=>{ assert(r.g3.out&&r.g3.n===0); assert(r.m1.out&&r.m1.n===0); });

    // 화면: 로드맵에 카드가 그려지고, 실제 학원 이름이 안 나온다(세 언어)
    for(const lang of ['ko','en','zh']){
      await page.evaluate(l=>{ const s=JSON.parse(localStorage.getItem('nm_state_v1')); s.lang=l; s.schoolAge={entryYear:new Date().getFullYear()+((new Date().getMonth()+1)>=3?2:1)}; s.view='courseroad'; localStorage.setItem('nm_state_v1',JSON.stringify(s)); },lang);
      await page.reload({waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>typeof window.NM_PACE_DIAG==='function',null,{timeout:60000});
      /* 타이틀(모드 선택)이 뜨는 시점이 들쭉날쭉하다 — 카드가 보일 때까지 로드맵 버튼을 눌러 본다 */
      let txt=null;
      for(let i=0;i<60&&!txt;i++){
        await page.evaluate(()=>{ const vis=e=>e&&e.offsetParent!==null;
          const t3=[...document.querySelectorAll('.nm-title3d button')].find(b=>/연산 로드맵|Course Road|运算路线图/.test(b.textContent));
          const b=document.querySelector('#ttRoad'), t=document.querySelector('#townCourseRoad');
          if(t3) t3.click(); else if(vis(b)) b.click(); else if(vis(t)) t.click(); });
        await page.waitForTimeout(500);
        if(await page.locator('#crPaceCmp').count()) txt=await page.locator('#crPaceCmp').innerText();
      }
      check(`화면(${lang}): 카드·판정·이름`, ()=>{
        assert(txt, '#crPaceCmp 없음');
        assert(!BANNED.test(txt), '실제 학원 이름이 보임');
        assert(/KMO/.test(txt));
        assert(lang==='ko'?/이과 최상위권/.test(txt):lang==='en'?/Top science track/.test(txt):/理科顶尖/.test(txt));
      });
    }
    check('앱: 페이지 오류 없음', ()=>assert.deepEqual(errors,[]));
    report('브라우저 포함');
  }catch(e){ fails.push('브라우저: '+e.message); report(); }
  finally{ if(browser) await browser.close(); server.close(); }
})();
