#!/usr/bin/env node
/* ============================================================
   로드맵 시기 검사 (app/main.js roadTiming · 학년→과정 표) — 2026-09-28
   ------------------------------------------------------------
   원장 "로드맵은 각 과정이 언제 시작하고 언제 끝나는지 보여 줘야".
   로드맵 목록·구간 머리·이정표·3D 이름표가 전부 roadTiming() 한 곳에서 나오고,
   roadTiming 은 속도 비교 카드와 같은 paceWeeksToFn + NM_PACE_COMPARE.childSmAt 을 쓴다.
   여기서는 여러 나이 × 주기 × 빠르기 × 현재 과정에 대해
     1) 과정마다 시작 < 끝(지금 과정은 지금 < 끝)
     2) 과정 N 의 끝 = 과정 N+1 의 시작(빈틈·겹침 없음), 지난 과정은 시기가 없다
     3) 과정 38(고등 연산 시작)·29(중등) 의 시작 = 속도 비교 카드의 childSm (정확히 같은 값)
     4) 화면: 이정표 줄의 "고등 연산 시작" 시기 = 속도 비교 카드의 같은 행 글자
     5) 학년→과정 표(PLACEMENT_GRADES)가 데이터와 맞다 — 과정이 있고, 번호가 오름차순이고,
        tier 행은 그 tier 의 첫 과정, 초5·초6 행은 근거 제목(약수와 배수 · 분수 나눗셈)
   node scripts/check-road-timing.js      # 실패 exit 1 · 브라우저가 없으면 exit 2
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path'), http=require('http'), assert=require('assert/strict');
const APP=path.resolve(__dirname,'..'), ROOT=path.resolve(APP,'..');
const fails=[], ok=[];
const check=(name,fn)=>{ try{ fn(); ok.push(name); }catch(e){ fails.push(name+': '+e.message); } };
function report(extra){
  console.log(`로드맵 시기 검사 — 통과 ${ok.length}${extra?' · '+extra:''}`);
  ok.forEach(n=>console.log('  ✓ '+n));
  if(fails.length){ console.log('✗'); fails.forEach(f=>console.log('  '+f)); process.exitCode=1; }
}

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
    browser=await pw.chromium.launch({args:['--disable-gpu','--disable-webgl','--disable-webgl2','--disable-3d-apis']});
    const page=await browser.newPage({viewport:{width:390,height:844}}); const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>/supabase|google-analytics|googletagmanager/.test(r.request().url())?r.abort():r.continue());
    /* 7세(내년 입학) 아이 · 과정 5 에서 시작 */
    await page.addInitScript(()=>{ if(sessionStorage.getItem('rtSeeded')) return; sessionStorage.setItem('rtSeeded','1');
      const d=new Date(), ay=(d.getMonth()+1)>=3?d.getFullYear():d.getFullYear()-1;
      localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'시기 검수',view:'courseroad',
        avatar:{kind:'boy'},account:{status:'active'},placement:{course:'C5',self:true},schoolAge:{entryYear:ay+1},
        roadCadence:'w2',roadPace:'p2',roadSpeed:1})); });
    await page.goto(`http://127.0.0.1:${server.address().port}/number_magic/index.html?enter=1`,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof window.NM_ROAD_TIMING==='function'&&typeof window.NM_PACE_DIAG==='function',null,{timeout:60000});

    const r=await page.evaluate(()=>{
      const RT=window.NM_ROAD_TIMING, D=window.NM_PACE_DIAG;
      const keys=Object.keys(window.NM_COURSES).sort((a,b)=>+a.slice(1)-+b.slice(1));
      const out={cases:0, problems:[], mile:[]};
      const ages=[-30,-18,-6,0,8,20,40,80];
      const curs=['C0','C1','C5','C13','C29','C38','C47'];
      for(const smNow of ages) for(const cad of ['w1','w2']) for(const pace of ['p0','p2','p4']) for(const speed of [0.7,1,1.5]) for(const curKey of curs) for(const curFrac of [0,0.5]){
        const o={smNow,cad,pace,speed,curKey,curFrac};
        const t=RT(o); out.cases++;
        const bad=m=>{ if(out.problems.length<20) out.problems.push(JSON.stringify(o)+' '+m); };
        const curNum=+curKey.slice(1);
        keys.forEach((k,i)=>{
          const x=t.rows[k], n=+k.slice(1);
          if(n<curNum){ if(!x.past||x.startSm!=null||x.endSm!=null) bad(k+' 지난 과정인데 시기가 있음'); return; }
          if(n===curNum){ if(!x.cur||x.startSm!=null) bad(k+' 지금 과정 시작은 "지금"'); if(!(x.endSm>smNow)) bad(k+' 지금 과정 끝 ≤ 지금'); }
          else if(!(x.startSm<x.endSm)) bad(k+` 시작 ${x.startSm} ≥ 끝 ${x.endSm}`);
          const nx=keys[i+1]&&t.rows[keys[i+1]];
          if(nx&&!nx.past&&nx.startSm!==x.endSm) bad(`${k} 끝 ${x.endSm} ≠ ${keys[i+1]} 시작 ${nx.startSm}`);
        });
        /* 속도 비교 카드와 같은 값 — 고등(38)·중등(29) */
        const pc=D(o);
        if(pc){
          const kRow=pc.ev.rows.find(q=>q.key==='k');
          if(curNum<38){
            if(!kRow||kRow.horizon.course!==38) bad('카드 k 행 horizon 이 38 이 아님');
            else if(kRow.childSm!==t.rows.C38.startSm) bad(`C38 로드맵 ${t.rows.C38.startSm} ≠ 카드 ${kRow.childSm}`);
            else out.mile.push(kRow.childSm);
          }
          const PC=window.NM_PACE_COMPARE;
          const ctx=pc.ctx;
          if(curNum<29 && PC.childSmAt(ctx,29)!==t.rows.C29.startSm) bad('C29 가 카드 계산과 다름');
        } else bad('카드 결과 없음');
      }
      /* 나이를 모르면 시기 없음 */
      const u=RT({smNow:null,curKey:'C5',cad:'w2',pace:'p2',speed:1});
      out.unknownOk=Object.values(u.rows).every(x=>x.startSm==null&&x.endSm==null);
      /* 설정이 바뀌면 값이 바뀐다(주 2회가 주 1회보다 이르다) */
      const a=RT({smNow:0,curKey:'C5',cad:'w1',pace:'p2',speed:1}).rows.C38.startSm;
      const b=RT({smNow:0,curKey:'C5',cad:'w2',pace:'p2',speed:1}).rows.C38.startSm;
      out.cadMoves=b<a;
      out.grades=window.NM_PLACEMENT_GRADES();
      out.firstOf={}; keys.forEach(k=>{ const t=window.NM_COURSES[k].tier; if(!(t in out.firstOf)) out.firstOf[t]=+k.slice(1); });
      out.titles={}; keys.forEach(k=>{ out.titles[+k.slice(1)]=window.NM_COURSES[k].title.ko; });
      out.tiers={}; keys.forEach(k=>{ out.tiers[+k.slice(1)]=window.NM_COURSES[k].tier; });
      return out;
    });
    check(`시기 ${r.cases}가지(나이 8 × 주기 2 × 빠르기 3 × 속도 3 × 현재 과정 7 × 진행 2): 시작 < 끝 · 빈틈 없음`, ()=>assert.deepEqual(r.problems,[]));
    check(`과정 38 시기 = 속도 비교 카드 childSm (${r.mile.length}건 정확히 같음)`, ()=>assert(r.mile.length>0));
    check('나이를 모르면 시기를 만들지 않는다', ()=>assert(r.unknownOk));
    check('주 2회가 주 1회보다 고등 연산에 먼저 닿는다', ()=>assert(r.cadMoves));
    check('학년→과정 표가 데이터와 맞다', ()=>{
      const g=Object.fromEntries(r.grades.map(x=>[x.key,x.course]));
      r.grades.forEach(x=>{ assert(x.course!=null && r.titles[x.course], x.key+' 과정 없음'); ['ko','en','zh'].forEach(l=>assert(x.label[l], x.key+'.'+l)); });
      for(let i=1;i<r.grades.length;i++) assert(r.grades[i].course>r.grades[i-1].course, '과정 번호 오름차순: '+r.grades[i].key);
      assert.equal(g.pre, r.firstOf.level0); assert.equal(g.m1, r.firstOf.middle1); assert.equal(g.m2, r.firstOf.middle2);
      assert.equal(g.m3, r.firstOf.middle3); assert.equal(g.hi, r.firstOf.highmath1); assert.equal(g.alg, r.firstOf.algebra); assert.equal(g.cal, r.firstOf.calculus1);
      assert.equal(g.e1, r.firstOf.level1, '초1 = 계산의 새싹 첫 과정');
      assert.match(r.titles[g.e5], /약수와 배수/, '초5 근거 제목'); assert.match(r.titles[g.e6], /분수 나눗셈/, '초6 근거 제목');
      assert.match(r.titles[g.e3-1], /구구단/, '초3 = 구구단 끝난 다음'); assert.match(r.titles[g.e4-1], /나눗셈/, '초4 = 초3 곱나눗 끝난 다음');
    });

    /* 화면 — 이정표 줄의 시기가 속도 비교 카드의 같은 행과 같은 글자인가 */
    let dom=null;
    for(let i=0;i<60&&!dom;i++){
      await page.evaluate(()=>{ const vis=e=>e&&e.offsetParent!==null;
        const t3=[...document.querySelectorAll('.nm-title3d button')].find(b=>/연산 로드맵/.test(b.textContent));
        const b=document.querySelector('#ttRoad'), t=document.querySelector('#townCourseRoad');
        if(document.querySelector('#crList .nm-cr-node')) return;
        if(t3) t3.click(); else if(vis(b)) b.click(); else if(vis(t)) t.click(); });
      await page.waitForTimeout(400);
      if(await page.locator('#crList .nm-cr-msrow[data-ms="HIGH"]').count()){
        dom=await page.evaluate(()=>{
          const q=s=>{ const e=document.querySelector(s); return e?e.textContent.trim():null; };
          return { high:q('.nm-cr-msrow[data-ms="HIGH"] em'), mid:q('.nm-cr-msrow[data-ms="MID"] em'),
            cardHigh:q('.nm-pc-row[data-ms="HIGH"] .nm-pc-facts .you b'), cardMid:q('.nm-pc-row[data-ms="MID"] .nm-pc-facts .you b'),
            ms:document.querySelectorAll('.nm-cr-msrow').length, when:document.querySelectorAll('.nm-cr-node .nm-cr-when').length,
            nodes:document.querySelectorAll('.nm-cr-node').length, stwhen:document.querySelectorAll('.nm-cr-stwhen').length,
            stations:document.querySelectorAll('.nm-cr-station').length, placed:document.querySelectorAll('.nm-cr-row.placed').length };
        });
      }
    }
    check('화면: 이정표 4개 · 과정마다 시기 · 구간마다 시기', ()=>{
      assert(dom,'로드맵을 못 열었음'); assert.equal(dom.ms,4); assert.equal(dom.when,dom.nodes); assert.equal(dom.stwhen,dom.stations); assert.equal(dom.placed,1);
    });
    check(`화면: 고등 연산 시작 "${dom&&dom.high}" = 카드 "${dom&&dom.cardHigh}" · 중등 "${dom&&dom.mid}" = "${dom&&dom.cardMid}"`, ()=>{
      assert(dom.high&&dom.high===dom.cardHigh); assert(dom.mid&&dom.mid===dom.cardMid);
    });
    /* 설명 펼치기 · 빠르기 바꾸면 다시 계산 */
    const re=await page.evaluate(async()=>{
      const d=document.querySelector('.nm-cr-explain[data-c="C29"]'); d.querySelector('summary').click();
      await new Promise(r=>setTimeout(r,100));
      const txt=d.querySelector('.nm-cr-ex-body').textContent;
      const before=document.querySelector('.nm-cr-msrow[data-ms="HIGH"] em').textContent;
      document.querySelector('.nm-cr-seg button[data-cad="w1"]').click();
      await new Promise(r=>setTimeout(r,100));
      const after=document.querySelector('.nm-cr-msrow[data-ms="HIGH"] em').textContent;
      const card=document.querySelector('.nm-pc-row[data-ms="HIGH"] .nm-pc-facts .you b').textContent.trim();
      const stillOpen=document.querySelector('.nm-cr-explain[data-c="C29"]').open;
      return {txt, before, after, card, stillOpen};
    });
    check('화면: 과정 설명이 데이터로 채워지고, 다시 그려도 펼친 채', ()=>{ assert(/교과 연산/.test(re.txt)&&/마치면/.test(re.txt), re.txt.slice(0,80)); assert(re.stillOpen); });
    check(`화면: 주 1회로 바꾸면 다시 계산 (${re.before} → ${re.after}) · 카드와 같음`, ()=>{ assert.notEqual(re.before,re.after); assert.equal(re.after,re.card); });
    check('앱: 페이지 오류 없음', ()=>assert.deepEqual(errors,[]));
    report('브라우저 포함');
  }catch(e){ fails.push('실행 오류: '+e.message); report(); }
  finally{ if(browser) await browser.close(); server.close(); }
})();
