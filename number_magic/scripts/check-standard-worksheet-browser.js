#!/usr/bin/env node
'use strict';
/* 표준 학습지 검사(2026-10-28, 원장 「같은 과정·같은 회차는 같은 시험지 — 몇월 몇주는 표지·문자에만」).
 * ws.html?w=주차&c=과정&r=회차[&amt=1.25] 가
 *  ① 주차가 달라도 같은 과정·회차면 문항이 똑같고  ② 다음 회차는 다르고  ③ 1.25배 판은 문항이 더 많고
 *  ④ 학습 안내 첫 줄에 「N회차」(1.25배는 연습량)가 찍히고 날짜(월·주차)는 어디에도 없고(2026-10-24 「과정만 쓰면 되지」)  ⑤ 없는 회차는 안내를 띄우고
 *  ⑥ 짧은 링크 /w/?YYWW.과정.회차[L] 이 그 주소로 넘어가는지 본다. 외부 요청은 막는다.
 * usage: node scripts/check-standard-worksheet-browser.js */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css','.woff2':'font/woff2','.ttf':'font/ttf','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer((req,res)=>{let f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,report=[];
 const browser=await chromium.launch();
 const open=async q=>{const p=await browser.newPage({viewport:{width:900,height:1200}}),errors=[];
   p.on('pageerror',e=>errors.push(e.message));await p.route(u=>!u.href.startsWith(base),r=>r.abort());
   await p.goto(base+'/number_magic/ws.html?'+q);await p.waitForFunction(()=>window.NM_WS_READY,null,{timeout:120000});
   const r=await p.evaluate(()=>({ready:window.NM_WS_READY,err:(document.querySelector('.ws-err')||{}).textContent||'',
     text:[...document.querySelectorAll('.nm-print-sheet')].map(x=>x.innerText).join('\n'),
     kicker:[...document.querySelectorAll('.nm-cvw .nm-cv-kicker')].map(e=>e.innerText).join('|'),
     covers:[...document.querySelectorAll('.nm-series-front,.nm-cvw')].map(e=>e.innerText).join('|')}));
   await p.close();return {...r,errors};};
 // 문항만 비교: 표지의 날짜 글자와 학습지 번호는 뺀다
 const body=t=>t.replace(/\d{1,2}월 \d(-\d)?주차/g,'').replace(/S-C\d+-[MH]?\d+(-x[\d.]+)?/g,'');
 try{
  for(const [c,r,compact] of [['C1',2,false],['C4',3,false],['C17',5,false],['C31',4,true],['C38',1,true]]){
    const a=await open(`w=2026-W44&c=${c}&r=${r}`),later=await open(`w=2026-W49&c=${c}&r=${r}`);
    const more=await open(`w=2026-W44&c=${c}&r=${r}&amt=1.25`),next=await open(`w=2026-W44&c=${c}&r=${r+1}`);
    for(const x of [a,later,more,next]){assert.equal(x.ready,true,c+' '+x.err);assert.deepEqual(x.errors,[]);}
    assert.ok(body(a.text).length>500,c+' renders problems');
    assert.equal(body(later.text),body(a.text),c+' same course and round in another week must be identical');
    assert.notEqual(body(next.text),body(a.text),c+' the next round must differ');
    assert.ok(more.text.length>a.text.length,c+' 1.25x has more practice');
    assert.doesNotMatch(a.covers+more.covers,/\d+월|주차|월호/,c+' cover and guide never show a month or week');
    if(!compact)assert.match(a.kicker,new RegExp(' '+r+'회차'),c+' cover shows the round');
    assert.match(more.kicker,/1\.25배/,c+' cover shows the amount');
    report.push({course:c,round:r,sameAcrossWeeks:true,nextDiffers:true,kicker:a.kicker});
  }
  const bad=await open('w=2026-W44&c=C4&r=99');assert.equal(bad.ready,'error');assert.match(bad.err,/회차/);
  const old=await open('w=2026-W44&c=C4');assert.equal(old.ready,true,'old course link still opens');
  for(const [short,want] of [['2644.C4.3','c=C4&r=3'],['2644.C38.2L','c=C38&r=2&amt=1.25']]){
    const p=await browser.newPage();await p.route(u=>!u.href.startsWith(base),r=>r.abort());
    await p.goto(base+'/w/?'+short).catch(()=>{});await p.waitForURL(u=>/ws\.html/.test(String(u)),{timeout:20000,waitUntil:'commit'});
    assert.ok(p.url().includes('w=2026-W44&'+want),short+' -> '+p.url());await p.close();
  }
  report.push({missingRound:true,oldLink:true,shortLinks:2});
  console.log('STANDARD_WORKSHEET_OK '+JSON.stringify(report));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
