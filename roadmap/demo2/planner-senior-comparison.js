/* Comparison dates are planning calculations; historical case milestones stay unchanged. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function crossing(points,y){for(let i=0;i<points.length;i++){const p=points[i];if(Math.abs(p.y-y)<1e-7)return p.x;if(i&&points[i-1].y<y&&p.y>y){const a=points[i-1];return a.x+(p.x-a.x)*(y-a.y)/(p.y-a.y);}}return null;}
function extendPast(future,source){if(!future.length)return[];const origin=crossing(source,future[0].y);return origin===null?future.map(p=>({...p})):[...source.filter(p=>p.x<origin).map(p=>({x:p.x-origin,y:p.y})),...future.map(p=>({...p}))];}
function model(c,context){const anchor=c.compareAnchor,base={ready:false,anchor,caseTitle:c.title,current:context.current||{},mode:context.mode||'keep',allowSelected:!!context.allowSelected};if(!context.ready)return {...base,reason:'현재 교과 진도를 선택하면 같은 범위에 맞춰 비교할 수 있습니다.'};if(context.foreign)return {...base,reason:'국내 교과와 다른 학년 체계는 교재의 같은 범위를 확인한 뒤 비교합니다.'};if(!anchor)return {...base,reason:'이 사례는 사고력·선발 과정을 중심으로 살펴보세요. 같은 교과 범위가 연결되면 진도 시점도 비교할 수 있습니다.'};
 const rank=context.ordinal(anchor.course),y=rank+(anchor.position==='end'?1:0);if(!Number.isFinite(rank)||rank<0)return {...base,reason:'같은 교과 범위를 선택하면 시점을 비교할 수 있습니다.'};
 const points=extendPast(context.points||[],context.source||[]),offset=crossing(points,y);if(offset===null)return {...base,reason:'현재 계획에서 '+anchor.label+' 범위까지 연결하면 앞뒤 시점을 비교할 수 있습니다.'};
 const equivalent=anchor.at-offset;
 return {...base,ready:true,offset,equivalent,ownNow:context.date(0),ownAnchor:context.date(offset),caseAnchor:anchor.assumedMonth?anchor.planningLabel:context.caseDate(anchor.at),caseEquivalent:context.caseDate(equivalent),caseStudy:c.stages[anchor.stage],beforeRecords:equivalent<c.stages[0].at};}

function entryTime(points,y){const exact=points.filter(p=>Math.abs(p.y-y)<1e-7);return exact.length?exact.at(-1).x:crossing(points,y);}
function backcast(c,context){
 if(!context.ready||context.foreign)return [];
 return (c.reverseAnchors||[]).map(anchor=>{
  const input=context.axes?.[anchor.axis];if(!input?.points?.length||!input.blocks?.length)return null;
  const rank=input.ordinal(anchor.course);if(!Number.isFinite(rank)||rank<0)return null;
  let points=extendPast(input.points,input.source||[]),standardOnly=false;
  const anchorY=rank+(anchor.position==='end'?1:0);let anchorX=crossing(points,anchorY);
  if(anchorX===null&&c.standardBackcast&&input.source?.length){const origin=crossing(input.source,input.points[0].y);if(origin!==null){points=input.source.map(p=>({x:p.x-origin,y:p.y}));anchorX=crossing(points,anchorY);standardOnly=true;}}
  if(anchorX===null)return null;
  const rows=input.blocks.map(block=>{const n=input.ordinal(block.title);if(n<0||n>rank||(n===rank&&!(c.standardBackcast&&anchor.position==='end')))return null;
   const start=entryTime(points,n),end=crossing(points,n+1);if(start===null||end===null||end<=start)return null;
   const caseStart=anchor.at+start-anchorX,caseEnd=anchor.at+end-anchorX;
   if(caseStart>=c.stages[0].at)return null;
   return {title:block.title,start,end,caseStart,caseEnd,duration:end-start,ownStart:context.date(start),ownEnd:context.date(end),caseStartLabel:context.caseDate(caseStart),caseEndLabel:context.caseDate(caseEnd)};
  }).filter(Boolean);
  return rows.length?{axis:anchor.axis,label:anchor.axis==='school'?'초등 교과·심화 연결':'기초·초등 사고력 연결',anchor,rows,standardOnly}:null;
 }).filter(Boolean);
}
function renderBackcast(c,context){const lanes=backcast(c,context);if(!lanes.length)return '';
 return '<details class="senior-backcast" open><summary>이전 초등 과정까지 역산해 보기</summary><p>표준 교재와 과정별 기간을 기준으로 이전 공부를 연결한 예시입니다. 사례 학생이 실제로 그 책을 그 달에 공부했다고 확정하는 표가 아닙니다. 교과와 사고력은 각각의 기준점에서 따로 계산합니다. 기준 월이 없는 공개 사례는 표시한 설계 기준에서 계산합니다. 표준 과정 사이의 심화·복습 기간을 한 교재의 학습 기간에 합치지 않습니다.</p>'+lanes.map(l=>'<section>'+(l.standardOnly?'<p class="senior-standard-assumption">현재 비교 기간을 넘는 구간은 기본 표준 과정의 기간으로 연결했습니다. 우리 아이가 이후에도 같은 속도로 진행한다는 예측은 아닙니다. 추가 회차는 이 표준 역산에 적용하지 않습니다.</p>':'')+'<h4>'+esc(l.label)+'</h4><small>이어지는 시점 · '+esc(l.anchor.label)+'</small><ol class="senior-backcast-route" aria-label="'+esc(l.label)+' 역산 로드맵">'+l.rows.map(r=>'<li><small>역산 예시 · '+r.duration.toFixed(1)+'개월</small><strong>'+esc(r.title)+'</strong><span>'+esc(r.caseStartLabel)+' → '+esc(r.caseEndLabel)+'</span></li>').join('')+'<li class="observed"><small>이어지는 실제 과정</small><strong>'+esc(l.anchor.label)+'</strong></li></ol><details class="senior-backcast-data"><summary>교재·월별 세부 표</summary><div class="senior-backcast-scroll" tabindex="0" role="region" aria-label="'+esc(l.label)+' 역산 표"><table><thead><tr><th>표준 과정·교재 예시</th><th>과정 기간</th><th>사례에 맞춰 역산한 구간</th><th>우리 아이 기준 설계 구간</th></tr></thead><tbody>'+l.rows.map(r=>'<tr><th>'+esc(r.title)+'</th><td>'+r.duration.toFixed(1)+'개월</td><td>'+esc(r.caseStartLabel)+' → '+esc(r.caseEndLabel)+'</td><td>'+esc(r.ownStart)+' → '+esc(r.ownEnd)+'</td></tr>').join('')+'</tbody></table></div></details></section>').join('')+'<aside>'+(c.group==='public'?'이후 공개 학습 흐름':'이어지는 실제 사고력 과정')+' · '+esc(c.thinkingRoute)+'</aside></details>';
}

function render(c,context){const m=model(c,context);const header='<header><div><small>같은 교과 진도에 맞춰</small><h3>우리 아이 로드맵과 비교하기</h3></div><button type="button" data-history-compare-close>사례로 돌아가기</button></header>';
 if(!m.ready){const back=renderBackcast(c,context);return '<section class="senior-comparison">'+header+'<p>'+esc(c.standardBackcast&&back?'현재 비교 기간 밖의 기준점까지는 표준 과정의 기간으로 연결해 볼 수 있습니다.':m.reason)+'</p>'+back+'<button type="button" data-history-close>우리 아이 현재 계획 보기</button></section>';}
 const dir=m.offset>0?'앞으로 약 '+m.offset.toFixed(1)+'개월 뒤':m.offset<0?'현재 속도로 되짚으면 약 '+Math.abs(m.offset).toFixed(1)+'개월 전':'현재와 같은 범위';
 return '<section class="senior-comparison">'+header+'<div class="senior-compare-modes" role="group" aria-label="비교할 우리 아이의 학습량"><button type="button" data-history-compare-mode="keep" aria-pressed="'+(m.mode==='keep')+'">현재 학습량 유지</button><button type="button" data-history-compare-mode="selected" aria-pressed="'+(m.mode==='selected')+'"'+(m.allowSelected?'':' disabled')+'>선택한 학습량 조정</button></div><div class="senior-match"><small>'+esc(m.anchor.label)+'에 맞추면</small><strong>'+esc(dir)+'</strong><span>우리 아이 · '+esc(m.ownAnchor)+'</span><span>선배 · '+esc(m.caseAnchor)+'</span></div><div class="senior-alignment"><article><small>우리 아이의 현재</small><strong>'+esc(m.current.school)+'</strong><span>'+esc(m.ownNow)+'</span></article><span aria-hidden="true">↔</span><article><small>우리 아이 속도로 맞춘 사례의 비교 시점</small><strong>'+esc(m.caseEquivalent)+'</strong><span>'+esc(m.beforeRecords?'사례 시작 이전으로 역산':'같은 진도를 기준으로 환산')+'</span></article></div><p class="senior-compare-note">역산·예상 시점은 우리 아이의 계획으로 계산한 비교 예시입니다. 선배의 실제 이력을 새로 채우거나 합격 시기를 예측하지 않습니다.</p><div class="senior-compare-table" tabindex="0" role="region" aria-label="현재 공부와 선배의 기준 구간 비교"><table><thead><tr><th>공부 영역</th><th>우리 아이의 현재 공부</th><th>선배의 '+esc(m.caseAnchor)+' 공부</th></tr></thead><tbody>'+[['school','교과·심화'],['thinking','사고력'],['calc','연산'],['gifted','영재원'],['inquiry','탐구']].map(([id,t])=>'<tr><th>'+t+'</th><td>'+esc(id==='school'?[m.current.school,m.current.deep].filter(Boolean).join(' · '):m.current[id]||'—')+'</td><td>'+esc(m.caseStudy[id]||'—')+'</td></tr>').join('')+'</tbody></table></div><p class="senior-compare-note">교과 진도가 같아도 사고력·심화·연산의 수준과 공부량은 다릅니다. 이전 시점은 현재 기준의 과정별 기간을 거꾸로 적용하고, 앞으로의 시점은 선택한 계획의 복습·심화·학습량 조건을 유지해 계산합니다.</p>'+renderBackcast(c,context)+'</section>';}
g.PlannerSeniorComparison=Object.freeze({crossing,extendPast,model,render,backcast,renderBackcast,entryTime});
})(window);
