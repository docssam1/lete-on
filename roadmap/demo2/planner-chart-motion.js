/* 그래프가 화면에 들어올 때 한 번, 왼쪽에서 오른쪽으로 그려지듯 나타난다. 큰 그림은 멀리서 다가와 멈춘다.
   레벨 비교(planner-level-pace)와 같은 움직임을 다른 그래프에도 쓴다. 자료나 계산은 건드리지 않는다.
   움직임 줄이기를 켠 기기와 인쇄에서는 아무것도 하지 않는다. */
(function(global){
'use strict';
const CHARTS='svg[role="img"],svg[viewBox="0 0 100 100"][focusable="false"],svg.ce-graph,svg.case-map-path,svg.course-route,svg.career-bridges,.standard-lane-track';
const SKIP='.level-pace,[data-no-motion],button,a,summary';
const MIN_CHART=260,MIN_ART=[420,200];
const played=new Set(),names=new WeakMap();
// 탭이 바뀌거나 접힌 설명이 열려 그래프가 새로 보이게 되는 변화. 이때 다시 살펴본다.
const WATCH=['hidden','open','class','style','aria-hidden'];
// 접힌 설명 안이나 숨은 탭에 있어 실제로는 그려지지 않는 그래프인지.
function shown(el){const r=el.getBoundingClientRect();if(!r.width||!r.height)return false;return typeof el.checkVisibility==='function'?el.checkVisibility():true;}
// 같은 그래프가 다시 그려져도 한 번만 움직이도록, 그래프를 구분하는 이름을 만든다.
function key(el,index){
 const host=el.closest?.('[id]'),label=el.getAttribute?.('aria-label')||el.getAttribute?.('alt')||el.getAttribute?.('src')||'';
 return[(host&&host.id)||'',el.tagName,String(el.getAttribute?.('class')||'').split(' ')[0],label.slice(0,60),index].join('|');
}
// 화면보다 넓거나 긴 그래프(휴대폰의 가로로 미는 일정표)는 전체의 일부만 보여도 시작한다.
// 보이는 부분이, 그래프와 화면 중 작은 쪽의 3할을 가로·세로 모두 넘으면 충분하다.
const STEPS=Array.from({length:51},(_,i)=>i/50);
function enough(e,view){const box=e.boundingClientRect,seen=e.intersectionRect;
 return seen.width>=Math.min(box.width,view.innerWidth)*.3&&seen.height>=Math.min(box.height,view.innerHeight)*.3;}
function start(doc){
 const view=doc.defaultView;
 if(!view||!view.IntersectionObserver||!view.MutationObserver)return false;
 if(view.matchMedia&&view.matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
 const io=new view.IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting||!enough(e,view))continue;const el=e.target;io.unobserve(el);played.add(names.get(el));
   el.classList.remove('chart-motion-wait','art-motion-wait');const cls=el.dataset.motion==='art'?'art-motion-in':'chart-motion-in';el.classList.add(cls);
   // 끝나면 표시를 지운다. 남겨 두면 다른 탭에 갔다 돌아올 때마다 처음부터 다시 움직인다.
   const done=()=>el.classList.remove(cls);el.addEventListener('animationend',done,{once:true});view.setTimeout(done,3200);}},{threshold:STEPS});
 function take(el,kind,index){
  if(el.dataset.motionLive||el.closest(SKIP))return;
  const k=kind+':'+key(el,index);el.dataset.motion=kind;el.dataset.motionLive='1';el.classList.remove('chart-motion-wait','art-motion-wait');
  // 실제로 움직인 뒤에만 '한 번 했다'고 적는다. 보이기 전에 다시 그려진 그래프가 움직임 없이 지나가지 않게.
  if(played.has(k))return;names.set(el,k);
  el.classList.add(kind==='art'?'art-motion-wait':'chart-motion-wait');io.observe(el);
  // 안전장치: 어떤 이유로든 신호가 오지 않으면 4초 뒤에는 그냥 보여 준다. 그래프가 숨은 채 남으면 안 된다.
  view.setTimeout(()=>{const r=el.getBoundingClientRect();if(el.classList.contains('chart-motion-wait')&&shown(el)&&r.top<view.innerHeight&&r.bottom>0){io.unobserve(el);el.classList.remove('chart-motion-wait');}},4000);
 }
 function scan(){
  doc.querySelectorAll(CHARTS).forEach((el,i)=>{if(el.dataset.motionLive||!shown(el))return;const r=el.getBoundingClientRect();if(r.width>=MIN_CHART)take(el,'chart',i);});
  doc.querySelectorAll('img').forEach((el,i)=>{if(el.dataset.motionLive||!shown(el))return;const r=el.getBoundingClientRect(),p=el.parentElement;if(r.width<MIN_ART[0]||r.height<MIN_ART[1]||!p)return;
   // 그림이 부모 상자를 꽉 채울 때만 움직인다. 그래야 커진 그림이 옆 글자를 덮지 않는다.
   const q=p.getBoundingClientRect();if(Math.abs(q.width-r.width)>2||Math.abs(q.height-r.height)>2)return;
   p.classList.add('art-motion-box');take(el,'art',i);});
 }
 let queued=false;const later=()=>{if(queued)return;queued=true;view.requestAnimationFrame(()=>{queued=false;scan();});};
 new view.MutationObserver(later).observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:WATCH});
 view.addEventListener('resize',later,{passive:true});
 scan();return true;
}
global.PlannerChartMotion={CHARTS,WATCH,key,enough,start};
if(global.document){if(global.document.readyState==='loading')global.document.addEventListener('DOMContentLoaded',()=>start(global.document));else start(global.document);}
})(typeof window!=='undefined'?window:globalThis);
