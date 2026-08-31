#!/usr/bin/env node
/* about.html의 유닛·유형·레벨 통계가 실데이터와 일치하는지 검사.
   리디자인 §6-5의 교훈: 하드코딩 숫자는 콘텐츠가 자라면 조용히 썩는다 —
   실제로 159/424로 적힌 채 배포돼 있었다(실데이터 180/492). 재발 방지용. */
'use strict';
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
global.window={};
for(const f of fs.readdirSync(path.join(ROOT,'data/units')).filter(f=>f.endsWith('.js'))){
  try{ new Function('window',fs.readFileSync(path.join(ROOT,'data/units',f),'utf8'))(window); }catch(e){}
}
new Function('window',fs.readFileSync(path.join(ROOT,'data/threads.js'),'utf8'))(window);
const units=Object.keys(window.NM_UNITS||{}).length;
const threads=Object.keys(window.NM_THREADS||{}).length;
let levels=0; for(const t of Object.values(window.NM_THREADS||{})) levels+=(t.levels||[]).length;

const about=fs.readFileSync(path.join(ROOT,'about.html'),'utf8');
const nums=[...about.matchAll(/<span class="stat-num">(\d+)<\/span><span class="stat-cap" data-i18n="stat(Units|Threads|Levels)"/g)]
  .reduce((o,m)=>(o[m[2]]=+m[1],o),{});
const want={Units:units,Threads:threads,Levels:levels};
let fail=0;
for(const k of ['Units','Threads','Levels']){
  const ok=nums[k]===want[k];
  if(!ok)fail++;
  console.log((ok?'✓':'✗')+' '+k+': about='+nums[k]+' 실데이터='+want[k]);
}
process.exit(fail?1:0);
