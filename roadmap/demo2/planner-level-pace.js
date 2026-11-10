/* 레벨 기준 비교: 지금 계획과 한 단계 위·아래 기준표가 같은 과정을 언제 마치는지 달력 막대로 보여 준다.
   날짜는 planner-levels.js 레벨표와 표준 계획의 교과 기준점에서만 계산한다. 합격·도달 판정이 아니다. */
(function(global){
'use strict';
const MARKS=[/^6-2/,/^중3-2/,/^공통수학2/];
const NAMES=['초등','중등','공통수학1·2','이후 과목'];
const KEYS=['초등 (6-2까지)','중등 (중3-2까지)','공통수학1·2','이후 과목'];
const OFFSETS=[[-2,'up2','두 단계 위 기준'],[-1,'up1','한 단계 위 기준'],[0,'now','지금 계획'],[1,'down1','한 단계 아래 기준']];
let played=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
// 기준점에서 각 과정이 끝날 때까지 남은 개월 수. 표에 그 과정이 없으면 null.
function ends(rows,origin){return MARKS.map(re=>{const row=(rows||[]).find(b=>re.test(b[0]));return row?row[2]+1-origin:null;});}
function base(fields){
 const y=Number(fields?.year),m=Number(fields?.mon),d=new Date();
 return Number.isInteger(y)&&m>=1&&m<=12?{year:y,month:m}:{year:d.getFullYear(),month:d.getMonth()+1};
}
// 남은 개월 수가 속한 달. 예: 11월 기준 4.2개월 뒤에 끝나면 3월.
function monthAt(b,months){const i=b.month-1+Math.max(0,Math.ceil(months)-1);return{year:b.year+Math.floor(i/12),month:i%12+1};}
function model(standard,levels,fields){
 const list=Array.isArray(levels)?levels:[],index=list.findIndex(l=>l.id===standard?.level);
 const school=standard?.lanes?.find(l=>l.id==='school');
 if(index<0||!school||school.source!=='level-table'||!Number.isFinite(school.anchor)||!Number.isFinite(standard.now))return null;
 const rows=OFFSETS.flatMap(([offset,id,name])=>{
  const level=list[index+offset];
  if(!level)return[];
  // 지금 계획은 실제 공부 중인 위치에서, 다른 기준은 같은 학년·월 위치에서 잰다.
  return[{id,name,level:level.id,ends:ends(level.school,offset?standard.now:school.anchor)}];
 });
 const now=rows.find(r=>r.id==='now');
 if(!now||rows.length<2||now.ends.every(e=>e===null||e<=0))return null;
 // 비교 기준: 지금 계획에서 아직 남아 있는 가장 가까운 과정
 const mark=now.ends.findIndex(e=>e!==null&&e>0);
 for(const row of rows)row.delta=row===now||row.ends[mark]===null?null:Math.round(now.ends[mark]-row.ends[mark]);
 const last=Math.max(...rows.flatMap(r=>r.ends.filter(e=>e!==null)));
 return{rows,mark,total:Math.max(12,Math.ceil(last)+4),base:base(fields)};
}
function bar(row,m){
 const pc=v=>(Math.min(m.total,Math.max(0,v))/m.total*100).toFixed(2)+'%';
 let from=0,html='',missing=false;
 for(let i=0;i<4;i++){
  const end=i<3?row.ends[i]:m.total;
  if(end===null){missing=true;html+=`<div class="seg none" style="left:${pc(from)};width:${pc(m.total-from)}">기준표에 없음</div>`;break;}
  if(end<=from)continue;
  html+=`<div class="seg s${i}" style="left:${pc(from)};width:${pc(end-from)}">${NAMES[i]}</div>`;
  if(i<3&&end<m.total){const at=monthAt(m.base,end);html+=`<span class="end${end/m.total<.12?' first':''}" style="left:${pc(end)}">${at.year}.${at.month}</span>`;}
  from=end;
 }
 return{html,missing};
}
function note(row,m){
 if(row.id==='now')return'현재 교과 진도에서 이어지는 표준 계획';
 const table=esc(row.level)+' 기준표';
 if(row.delta===null)return table;
 const what=NAMES[m.mark];
 return table+' · '+(row.delta>0?`${what} ${row.delta}개월 앞`:row.delta<0?`${what} ${-row.delta}개월 뒤`:`${what} 같은 달`);
}
function render(standard,fields){
 const m=model(standard,global.PLANNER_LEVELS,fields);
 if(!m)return'';
 const ticks=[];
 for(let i=0;i<m.total;i++){const at=monthAt(m.base,i+1);if(i===0||at.month===3)ticks.push(`<span style="left:${(i/m.total*100).toFixed(2)}%"><b>${at.year}</b>.${at.month}</span>`);}
 let missing=false;
 const rows=m.rows.map(row=>{const b=bar(row,m);missing=missing||b.missing;const now=row.id==='now'?' is-now':'';
  return`<div class="who${now}">${esc(row.name)}<small>${note(row,m)}</small></div><div class="bar${now}">${b.html}</div>`;}).join('');
 return`<section class="level-pace${played?'':' is-entering'}" aria-label="한 단계 위·아래 기준과 비교">
<div class="level-pace-art"><img src="assets/roadmap-level-lanes-20261110.webp" width="1344" height="768" loading="lazy" decoding="async" alt="구름 위 돌길이 네 줄로 나뉘어 있고, 두 아이가 보라색 줄 앞에서 길 끝의 탑을 바라보는 그림"></div>
<h3>같은 과정을 언제 마치나</h3>
<div class="level-pace-scroll" tabindex="0" role="region" aria-label="기준별 일정 비교"><div class="level-pace-grid"><div></div><div class="axis">${ticks.join('')}</div>${rows}</div></div>
<ul class="level-pace-key">${KEYS.map((k,i)=>`<li><i class="s${i}"></i>${k}</li>`).join('')}</ul>
<p class="level-pace-note">막대 아래 날짜는 그 과정이 끝나는 달입니다. 위·아래 줄은 같은 학년·월의 다른 기준표이며, 그 반에 들어갈 수 있다는 판정이 아닙니다.${missing?' 회색 칸은 그 기준표에 이후 과정이 아직 없다는 뜻입니다.':''}</p>
</section>`;
}
// 그림의 카메라 이동은 화면에서 한 번 끝까지 재생된 뒤에는 다시 재생하지 않는다.
global.document?.addEventListener?.('animationend',e=>{if(e.animationName==='level-pace-unroll')played=true;},true);
global.PlannerLevelPace={model,render};
})(typeof window!=='undefined'?window:globalThis);
