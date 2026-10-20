/* ============================================================
   학부모가 조정하는 로드맵 (원장님 2026-10-20)
   - 데이터 한 벌(build)로 상세 표 · 간단 보기 · 3D(보여주기용)를 함께 그린다.
   - 조정 항목: 지금 진도(교과·사고력·연산 + 남은 개월), 교과 속도, 황소 선택, 영재원 선택.
   - 규칙은 예시 로드맵(원장님 손그림)과 같다:
     교과 디딤돌 응용 학기당 S개월 → 6-2 다음 계통(5·6학년·중1) 대수 정리 4개월 → 중등 원리해설 3개월씩.
     교과 심화는 한 학년 아래 최상위 S를 1개월 늦게 같은 속도로, 중등 시작 2개월 뒤부터 중등 심화(A급) 4개월씩,
     그 사이는 '황소 대비 고려에 따라 고민 + 중등 쎈'.
     연산은 지금 권부터 S개월씩, 기적 12권 다음 기적의 중학연산 1AB → 도형 1권 → 2AB → 도형 2권 → 3AB → 도형 3권(S1 표 기간).
     과학은 중2-1 중등 심화가 끝난 다음 달 중등과학, 그 앞 6개월 초5·6 과학, 그 앞 12개월 실험과학.
   - 월 값 m: 5세 1월=0 … 초1(8세) 1월=36. 학년은 3월에 바뀐다(1·2월은 앞 학년).
   ============================================================ */
(function(){
'use strict';
const SEM=k=>`${Math.ceil(k/2)}-${k%2?1:2}`;
const MID=['중1-1','중1-2','중2-1','중2-2','중3-1','중3-2'];
const CALC=[...Array.from({length:12},(_,i)=>[`기적의 계산법 ${i+1}`,0]),
  ['기적의 중학연산 1AB',5],['기적의 중학도형 1권',2],['기적의 중학연산 2AB',4],['기적의 중학도형 2권',2],['기적의 중학연산 3AB',6],['기적의 중학도형 3권',2]];
const COMP=[['초등팩토 1 (PRE 1031 기본)',5],['필즈 베이직 (PRE 1031 심화)',5],['1031 입문 + workbook',4],['TOT 2단계',3],['1031 초급',7],['3% 1과정',4]];
const GRADES=['5세','6세','7세','초1','초2','초3','초4','초5','초6','중1'];

// 학년(1~6)·월 → m, m → 학년·월·연도
function mOf(grade,mon){ return 36+12*(grade-1)+(mon>=3?mon-1:mon-1+12); }
function schoolYear(m){ const y=Math.floor(m/12); return (y>=3&&m%12<2)?y-1:y; }
function label(m){ return GRADES[schoolYear(m)]+' '+(m%12+1)+'월'; }

function seq(start,items){ const out=[]; let t=start; items.forEach(([txt,n])=>{ out.push([txt,t,t+n-1]); t+=n; }); return out; }

/* o = {grade, mon, year, school, schoolLeft, comp, compLeft, calc, calcLeft, speed, hw, hwDeep, hwMid, gifted} */
function build(o){
  const now=mOf(o.grade,o.mon), A0=mOf(o.grade,3), A1=A0+33, S=o.speed, warn=[];
  const yearOf=m=>o.year+(Math.floor(m/12)-Math.floor(now/12));
  // ---- 교과
  const school=[], school2=[];
  let mid;
  if(o.school<=12){
    let t=now-(S-o.schoolLeft);
    for(let k=o.school;k<=12;k++){
      school.push([`${SEM(k)} 디딤돌 ${k<=4?'기본+응용':'응용'}`,t,t+S-1]);
      if(k-2>=1) school2.push([`${SEM(k-2)} 최상위 S`,t+1,t+S]);
      t+=S;
    }
    school.push(['계통 (5·6학년·중1) · 대수 정리',t,t+3]); mid=t+4;
  } else if(o.school===13){ school.push(['계통 (5·6학년·중1) · 대수 정리',now-(4-o.schoolLeft),now+o.schoolLeft-1]); mid=now+o.schoolLeft; }
  else { mid=now-(o.school-14)*3-(3-o.schoolLeft); }
  seq(mid, MID.map(x=>[x+' 원리해설',3])).forEach(b=>school.push(b));
  const s2end=school2.length?school2[school2.length-1][2]:now-1;
  if(mid+1>=s2end+1) school2.push(['황소 대비 고려에 따라 고민 + 중등 쎈',Math.max(s2end+1,now),mid+1]);
  const mid2=seq(mid+2, MID.map(x=>[x+' 중등 심화(A급)',4])); mid2.forEach(b=>school2.push(b));
  // ---- 사고력
  const ci=o.comp, comp=[];
  let t=now; comp.push([COMP[ci][0],t-(COMP[ci][1]-o.compLeft),t+o.compLeft-1]); t+=o.compLeft;
  for(let i=ci+1;i<COMP.length;i++){ comp.push([COMP[i][0],t,t+COMP[i][1]-1]); t+=COMP[i][1]; }
  // ---- 연산
  const calc=[]; t=now;
  for(let i=o.calc;i<CALC.length;i++){ const n=CALC[i][1]||S, left=i===o.calc?Math.min(o.calcLeft,n):n; calc.push([CALC[i][0],t-(i===o.calc?n-left:0),t+left-1]); t+=left; }
  // ---- 과학: 중2-1 중등 심화 끝 다음 달
  const sciStart=mid2[2][2]+1;
  const sci=[['실험과학',sciStart-18,sciStart-7],['초5·6 과학',sciStart-6,sciStart-1],['중등 과학',sciStart,sciStart+11]];
  // ---- 황소
  const hw=[], flags=[];
  const compEnd=(re)=>{ const b=comp.find(x=>re.test(x[0])); return b?b[2]:null; };
  if(o.hw!=='none'){
    const E=+o.hw, feb=(E%12)===1;
    if(feb){ hw.push(['황소 공부 (편입 위주)',E-2,E-1]); }
    else { hw.push(['황소 개념 3개월',E-5,E-3],['황소 모의고사 2개월',E-2,E-1]);
      const ce=compEnd(/1031 초급/); if(ce!=null&&ce>=E-5) warn.push(`1031 초급이 ${label(ce)}에 끝나 황소 대비(${label(E-5)}) 전에 끝나지 않습니다. 원장님 기준: 황소 대비는 1031 초급을 마친 다음 달부터.`); }
    hw.push(['황소 시험',E,E],[feb?'황소 편입 (합격 시)':'황소 입학 (합격 시)',E+1,E+1]);
    flags.push([E,'황소 시험']);
    if(o.hwDeep){ let N=E+1; while(N%12!==10) N++; if(N-5<=E+1) N+=12;
      hw.push(['심화 개념 3개월 (심화 고려 시)',N-5,N-3],['심화 모의고사 2개월',N-2,N-1],['합격 후 고민 (중등 라인은 계속)',N,N]); }
  }
  if(o.hwMid){ const N=mOf(4,11); hw.push(['황소 중등 시험 대비 3개월',N-3,N-1],['황소 중등 시험 (고려)',N,N]); flags.push([N,'황소 중등 시험']); }
  // ---- 영재원 (2026-10-20 모집요강 기준). 초3 11월이 지났으면 초4 기준(수학·과학 초4 지원 → 초5)
  const gy=now<=mOf(3,11)?3:4, d=12*(gy-3);
  const giftA=[], giftB=[];
  if(o.gifted==='A'||o.gifted==='AB'){
    giftA.push([`가천대 브릿지 접수 · 온라인 과제 (초${gy} 대상)`,61+d,63+d],['가천대 브릿지 관찰수업 (5월 면접 · 5~9월 토)',64+d,68+d],
      [gy===3?'강남서초 영재원 수·과융합 (11월 지원 · 12/5 평가)':'강남서초 영재원 수학·과학 (11월 지원 · 12월 평가)',70+d,71+d],['최종 발표',73+d,73+d],
      [`초${gy+1} 영재원 수업 (합격 시)`,74+d,83+d]);
    flags.push([73+d,'영재원 발표']);
  }
  if(o.gifted==='B'||o.gifted==='AB'){
    giftB.push(['서울교대 과학영재교육원 지원·선발 (7~9월)',66+d,68+d],[`교대 영재원 수업 (합격 시, 초${gy+1}) · 합격하면 서울 교육청 영재원 지원 불가`,74+d,83+d]);
  }
  // ---- 말풍선: 중3-1 원리해설 시작 달에 중등 학원 응시 고려
  const bubbles=[]; const m31=mid+12; if(m31>=A0&&m31<=A1) bubbles.push([m31,`${label(m31)} 돌파 · 생크 · 이든 1-1 응시 고려`]);
  const rows=[
    {key:'school',label:'교과',blocks:school,color:'#dbeafe',lane:'수학'},
    {key:'school2',label:'교과 심화',blocks:school2,color:'#e0f2fe',lane:'수학'},
    {key:'comp',label:'사고력·경시',blocks:comp,color:'#ede9fe',lane:'수학'},
    {key:'calc',label:'연산',blocks:calc,color:'#dcfce7',lane:'수학'},
    {key:'sci',label:'과학',blocks:sci,color:'#ecfccb',lane:'과학'},
    {key:'hw',label:'황소 · 선택',blocks:hw,color:'#fde68a',lane:'황소'},
    {key:'giftA',label:'영재원 · 가천대·교육청',blocks:giftA,color:'#fce7f3',lane:'영재원'},
    {key:'giftB',label:'영재원 · 교대',blocks:giftB,color:'#fae8ff',lane:'영재원'}
  ].filter(r=>r.blocks.length||['school','school2','comp','calc','sci'].includes(r.key));
  rows.forEach(r=>{ r.blocks=r.blocks.map(([x,s,e])=>[x,Math.max(s,A0),Math.min(e,A1)]).filter(b=>b[1]<=b[2]); });
  return {now,A0,A1,mid,rows,flags,bubbles,warn,label,yearOf};
}

/* ---------- 상세 표 ---------- */
function renderTable(P){
  const n=P.A1-P.A0+1; let h='<table class="pl-table"><thead><tr><th class="pl-corner">학년</th>';
  for(let m=P.A0;m<=P.A1;){ const y=schoolYear(m); let k=0; while(m+k<=P.A1&&schoolYear(m+k)===y) k++; h+=`<th colspan="${k}" class="pl-year">${GRADES[y]} · ${P.yearOf(m)}년 3월~</th>`; m+=k; }
  h+='</tr><tr><th class="pl-corner">월</th>';
  for(let m=P.A0;m<=P.A1;m++) h+=`<th class="pl-mon${m===P.now?' pl-now':''}" title="${P.yearOf(m)}년 ${m%12+1}월">${m%12+1}</th>`;
  h+='</tr></thead><tbody>';
  if(P.bubbles.length){ h+='<tr class="pl-bubble-row"><th></th>'; let m=P.A0; P.bubbles.forEach(([bm,txt])=>{ const s=Math.max(P.A0,bm-5); for(;m<s;m++) h+='<td></td>'; h+=`<td colspan="${bm-s+1}" class="pl-bubble-cell"><span class="pl-bubble">${txt}</span></td>`; m=bm+1; }); for(;m<=P.A1;m++) h+='<td></td>'; h+='</tr>'; }
  P.rows.forEach(r=>{
    h+=`<tr><th>${r.label}</th>`; let m=P.A0;
    r.blocks.slice().sort((a,b)=>a[1]-b[1]).forEach(([t,s,e])=>{ if(s<m) return; for(;m<s;m++) h+=`<td class="pl-empty${m===P.now?' pl-now':''}"></td>`; h+=`<td colspan="${e-s+1}" style="background:${r.color}" title="${label(s)}${s===e?'':' ~ '+label(e)}: ${t}">${t}</td>`; m=e+1; });
    for(;m<=P.A1;m++) h+=`<td class="pl-empty${m===P.now?' pl-now':''}"></td>`;
    h+='</tr>';
  });
  return h+'</tbody></table>';
}

/* ---------- 간단 보기: 수학 · 과학 · 영재원 세 줄 + 깃발 ---------- */
function simpleRows(P){
  const R=k=>(P.rows.find(r=>r.key===k)||{blocks:[]}).blocks;
  const sch=R('school'), elem=sch.filter(b=>/디딤돌/.test(b[0])), sys=sch.find(b=>/계통/.test(b[0])), mids=sch.filter(b=>/원리해설/.test(b[0]));
  const math=[];
  if(elem.length) math.push([`초등 교과 ${elem[0][0].split(' ')[0]} → ${elem[elem.length-1][0].split(' ')[0]}`,elem[0][1],elem[elem.length-1][2]]);
  if(sys) math.push(['계통 · 대수 정리',sys[1],sys[2]]);
  if(mids.length) math.push([`중등 ${mids[0][0].split(' ')[0]} → ${mids[mids.length-1][0].split(' ')[0]}`,mids[0][1],mids[mids.length-1][2]]);
  const think=R('comp').map(b=>[b[0].replace(/\s*\(.*\)/,''),b[1],b[2]]);
  const short=b=>[b[0].replace(/\s*\(.*\)/,'').replace(/ · .*/,''),b[1],b[2]];
  const giftA=R('giftA').map(short), giftB=R('giftB').map(short);
  return [
    {label:'수학',sub:'교과',blocks:math,color:'#bfdbfe'},
    {label:'수학',sub:'사고력',blocks:think,color:'#ddd6fe'},
    {label:'과학',sub:'',blocks:R('sci'),color:'#d9f99d'}
  ].concat(giftA.length?[{label:'영재원',sub:'가천대·교육청',blocks:giftA,color:'#fbcfe8'}]:[],giftB.length?[{label:'영재원',sub:'교대',blocks:giftB,color:'#f5d0fe'}]:[]);
}
function renderSimple(P){
  const rows=simpleRows(P), n=P.A1-P.A0+1, pct=m=>((m-P.A0)/n*100).toFixed(3)+'%';
  let h='<div class="sp-wrap"><div class="sp-axis">';
  for(let m=P.A0;m<=P.A1;m++) if(m%12===2) h+=`<span style="left:${pct(m)}">${GRADES[schoolYear(m)]} 3월</span>`;
  h+=`<i class="sp-now" style="left:${pct(P.now)}"><b>지금</b></i></div>`;
  h+='<div class="sp-flags">'+P.flags.filter(f=>f[0]>=P.A0&&f[0]<=P.A1).map(([m,t])=>`<span style="left:${pct(m)}">⚑ ${t}<small>${label(m)}</small></span>`).join('')+'</div>';
  rows.forEach(r=>{ h+=`<div class="sp-row"><div class="sp-label">${r.label}${r.sub?`<small>${r.sub}</small>`:''}</div><div class="sp-track">`;
    r.blocks.forEach(([t,s,e])=>{ h+=`<span class="sp-bar" style="left:${pct(s)};width:calc(${pct(e+1)} - ${pct(s)});background:${r.color}" title="${label(s)} ~ ${label(e)}">${t}</span>`; });
    h+='</div></div>'; });
  return h+'</div>';
}

/* ---------- 3D (보여주기용, CSS 3D) ---------- */
function render3D(P){
  const lanes=P.rows, CW=34, LH=58, G=150, W=G+(P.A1-P.A0+1)*CW, H=lanes.length*LH;
  const x=m=>G+(m-P.A0)*CW;
  let h=`<div class="d3-stage"><div class="d3-board" style="width:${W}px;height:${H}px">`;
  lanes.forEach((r,i)=>{
    h+=`<div class="d3-lane" style="top:${i*LH}px;height:${LH}px;width:${W}px"><span class="d3-lname" style="width:${G-12}px">${r.label}</span></div>`;
    r.blocks.forEach(([t,s,e])=>{ const z=r.key==='school'?18:r.key==='hw'?14:9;
      h+=`<div class="d3-box" style="left:${x(s)+2}px;top:${i*LH+8}px;width:${x(e+1)-x(s)-4}px;height:${LH-16}px;--z:${z}px;--c:${r.color}" title="${label(s)} ~ ${label(e)}: ${t}"><div class="d3-top">${t}</div><div class="d3-front"></div><div class="d3-side"></div></div>`; });
  });
  for(let m=P.A0;m<=P.A1;m++) if(m%12===2) h+=`<div class="d3-tick" style="left:${x(m)}px;height:${H}px"><span>${GRADES[schoolYear(m)]}</span></div>`;
  h+=`<div class="d3-nowline" style="left:${x(P.now)}px;width:${CW}px;height:${H}px"></div>`;
  P.flags.concat(P.bubbles).filter(f=>f[0]>=P.A0&&f[0]<=P.A1).forEach(([m,t])=>{ h+=`<div class="d3-flag" style="left:${x(m)+CW/2}px;top:${-6}px"><div class="d3-pole"><span>${t}</span></div></div>`; });
  return h+'</div></div>';
}
function bind3D(box){
  const st=box.querySelector('.d3-stage'), bd=box.querySelector('.d3-board'); if(!bd) return;
  let rx=52, rz=-16, drag=null;
  const fit=()=>{ const s=Math.min(1,(st.clientWidth-20)/bd.offsetWidth*1.15); bd.style.transform=`translate(-50%,-50%) scale(${s}) rotateX(${rx}deg) rotateZ(${rz}deg)`; };
  st.addEventListener('pointerdown',e=>{ drag=[e.clientX,e.clientY,rx,rz]; st.setPointerCapture(e.pointerId); });
  st.addEventListener('pointermove',e=>{ if(!drag) return; rz=Math.max(-60,Math.min(20,drag[3]+(e.clientX-drag[0])*0.25)); rx=Math.max(20,Math.min(75,drag[2]-(e.clientY-drag[1])*0.25)); fit(); });
  st.addEventListener('pointerup',()=>{ drag=null; });
  window.addEventListener('resize',fit); fit();
}

window.Planner={build,renderTable,renderSimple,render3D,bind3D,mOf,label,SEM,CALC,COMP,MID};
})();
