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
// 1031 중급은 예시 로드맵에서 지웠다(원장님 2026-10-20). 지금 중급을 하고 있는 레벨만 거친다(skip).
const COMP=[['초등팩토 1 (PRE 1031 기본)',5],['필즈 베이직 (PRE 1031 심화)',5],['1031 입문 + workbook',4],['TOT 2단계',3],['1031 초급',7],['1031 중급',7,'skip'],['3% 1과정',4],['왕수학 응용 4',3,'skip']];
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
  for(let i=ci+1;i<COMP.length;i++){ if(COMP[i][2]==='skip') continue; comp.push([COMP[i][0],t,t+COMP[i][1]-1]); t+=COMP[i][1]; }
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
  if(o.gifted){ // 영재원은 고려 / 안 고려 하나로(원장님 2026-10-20)
    giftA.push([`가천대 브릿지 접수 · 온라인 과제 (초${gy} 대상)`,61+d,63+d],['가천대 브릿지 관찰수업 (5월 면접 · 5~9월 토)',64+d,68+d],
      [gy===3?'강남서초 영재원 수·과융합 (11월 지원 · 12/5 평가)':'강남서초 영재원 수학·과학 (11월 지원 · 12월 평가)',70+d,71+d],['최종 발표',73+d,73+d],
      [`초${gy+1} 영재원 수업 (합격 시)`,74+d,83+d]);
    flags.push([73+d,'영재원 발표']);
  }
  if(o.gifted){
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


/* ---------- 3D 맵(시안 UX): 큰 이정표를 섬으로, 보라 점선 길로 잇는다. 보여주기용 ---------- */
function milestones(P){
  const R=k=>(P.rows.find(r=>r.key===k)||{blocks:[]}).blocks;
  const at=(k,m)=>{ const b=R(k).find(x=>x[1]<=m&&x[2]>=m); return b?b[0]:''; };
  const short=t=>t.replace(/ 디딤돌.*| 원리해설| \(.*\)/g,'');
  const sch=R('school'), elem=sch.filter(b=>/디딤돌/.test(b[0])), sys=sch.find(b=>/계통/.test(b[0])), mids=sch.filter(b=>/원리해설/.test(b[0]));
  const out=[{m:P.now,kind:'now',title:'현재 · '+label(P.now),sub:[short(at('school',P.now)),at('comp',P.now).replace(/\s*\(.*\)/,'')].filter(Boolean).join(' · '),icon:'📍'}];
  if(elem.length&&elem[elem.length-1][2]>P.now) out.push({m:elem[elem.length-1][2],kind:'step',title:'초등 교과 완료',sub:'디딤돌 6-2 · '+label(elem[elem.length-1][2]),icon:'📘'});
  if(sys&&sys[1]>P.now){ const c=at('comp',sys[1]); out.push({m:sys[1],kind:'step',title:'계통 · 대수 정리',sub:(/3%/.test(c)?'3% 1과정 함께 · ':'')+label(sys[1]),icon:'🧮'}); }
  if(mids.length&&mids[0][1]>P.now) out.push({m:mids[0][1],kind:'step',title:'중등 시작',sub:'중1-1 원리해설 · '+label(mids[0][1]),icon:'🏫'});
  const g=R('giftA').find(b=>/영재원 수업/.test(b[0])); if(g) out.push({m:g[1],kind:'gift',title:'영재원 (합격 시)',sub:label(g[1])+' 수업 시작',icon:'🔭'});
  P.bubbles.forEach(([m,t])=>out.push({m,kind:'step',title:'중등 학원 응시 고려',sub:t.replace(/ 응시 고려$/,'').replace(/^\S+ \S+ /,'')+' · '+label(m),icon:'🎯'}));
  const s=R('sci').find(b=>/중등 과학/.test(b[0])); if(s&&s[1]<=P.A1) out.push({m:s[1],kind:'sci',title:'중등 과학',sub:label(s[1]),icon:'🧪'});
  out.sort((a,b)=>a.m-b.m);
  const hw=R('hw').filter(b=>/시험/.test(b[0])&&!/대비/.test(b[0])).map(b=>({m:b[1],kind:'branch',title:b[0].replace(/\s*\(.*\)/,''),sub:label(b[1])+' · 선택',icon:'🐂'}));
  return {main:out,branch:hw};
}
function render3DMap(P){
  const {main,branch}=milestones(P), W=1500, H=820;
  // 섬 자리: 왼쪽 아래(현재)에서 오른쪽 위(중등 이후)로 굽이치는 길
  const pts=main.map((x,i)=>{ const t=main.length>1?i/(main.length-1):0; return {x:160+t*(W-360),y:H-170-t*(H-400)+Math.sin(t*Math.PI*2.2)*80}; });
  // 갈래 섬: 해당 구간 가운데에서 길과 직각으로 오른쪽 아래로 비켜 둔다
  const bpts=branch.map((x,i)=>{ const k=main.findIndex(mm=>mm.m>=x.m), j=Math.max(1,k<0?main.length-1:k), a=pts[j-1], b=pts[j]||a;
    let dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1; const px=-dy/L, py=dx/L, sgn=(px+py)>0?1:-1;
    return {x:(a.x+b.x)/2+sgn*px*210,y:(a.y+b.y)/2+sgn*py*210}; });
  let path=''; pts.forEach((p,i)=>{ if(i){ const q=pts[i-1], cx=(q.x+p.x)/2; path+=` C ${cx} ${q.y}, ${cx} ${p.y}, ${p.x} ${p.y}`; } else path='M '+p.x+' '+p.y; });
  let bpath=bpts.map((b,i)=>{ const k=main.findIndex(mm=>mm.m>=branch[i].m), j=Math.max(1,k<0?main.length-1:k), a=pts[j-1], c=pts[j]||a, mx=(a.x+c.x)/2, my=(a.y+c.y)/2; return `<path d="M ${mx} ${my} Q ${(mx+b.x)/2+30} ${(my+b.y)/2-30}, ${b.x} ${b.y}" class="m3-bpath"/>`; }).join('');
  let h=`<div class="m3-stage"><div class="m3-plane" style="width:${W}px;height:${H}px">`;
  h+=`<svg class="m3-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path d="${path}" class="m3-path-glow"/><path d="${path}" class="m3-path"/>${bpath}</svg>`;
  // 나무
  for(let i=0;i<46;i++){ const x=(i*317)%W, y=(i*191)%H; if(pts.concat(bpts).some(p=>Math.hypot(p.x-x,p.y-y)<120)) continue; h+=`<div class="m3-tree" style="left:${x}px;top:${y}px;--s:${0.7+((i*7)%5)/10}"><i></i></div>`; }
  const island=(p,m,cls)=>`<div class="m3-island ${cls}" style="left:${p.x}px;top:${p.y}px"><div class="m3-rock"></div><div class="m3-top"></div><div class="m3-card"><span class="m3-ico">${m.icon}</span><b>${m.title}</b><small>${m.sub}</small></div>${m.kind==='now'?'<div class="m3-pin"></div>':''}</div>`;
  main.forEach((m,i)=>{ h+=island(pts[i],m,'k-'+m.kind); });
  branch.forEach((m,i)=>{ h+=island(bpts[i],m,'k-branch'); });
  return h+'</div></div>';
}
function bindMap(box){
  const st=box.querySelector('.m3-stage'), pl=box.querySelector('.m3-plane'); if(!pl) return;
  let rx=50, rz=-24, drag=null;
  const fit=()=>{ const s=Math.min(0.95,st.clientWidth/1500*0.92); pl.style.transform=`translate(-50%,-50%) scale(${s}) rotateX(${rx}deg) rotateZ(${rz}deg)`; pl.style.setProperty('--bx',`rotateZ(${-rz}deg) rotateX(${-rx}deg)`); };
  st.onpointerdown=e=>{ drag=[e.clientX,e.clientY,rx,rz]; st.setPointerCapture(e.pointerId); };
  st.onpointermove=e=>{ if(!drag) return; rz=Math.max(-50,Math.min(10,drag[3]+(e.clientX-drag[0])*0.2)); rx=Math.max(25,Math.min(65,drag[2]-(e.clientY-drag[1])*0.2)); fit(); };
  st.onpointerup=()=>{ drag=null; };
  window.addEventListener('resize',fit); fit();
}


/* ---------- 분석지: 학년마다 서술(몇 개월 주기로, 언제 무엇을 시작·완료) ---------- */
function narrative(P){
  const R=k=>(P.rows.find(r=>r.key===k)||{blocks:[]}).blocks;
  const mon=m=>(m%12+1)+'월', nm=t=>t.replace(/\s*\(.*\)/,'').trim();
  const jo=(w,a,b)=>{ const c=w.replace(/[^가-힣0-9A-Za-z]+$/,'').slice(-1), code=c.charCodeAt(0); let has; if(/[가-힣]/.test(c)) has=(code-0xAC00)%28>0; else if(/[0-9]/.test(c)) has=/[013678]/.test(c); else has=/[lmnr]/i.test(c); return w+(has?a:b); };
  const range=(x,y)=>x===y?x:`${x} → ${y}`;
  const len=b=>b[2]-b[1]+1;
  const pace=bs=>{ const c={}; bs.forEach(b=>{ c[len(b)]=(c[len(b)]||0)+1; }); return +Object.keys(c).sort((a,b)=>c[b]-c[a])[0]; };
  const years=[]; for(let a=P.A0;a<=P.A1;a+=12) years.push([a,Math.min(a+11,P.A1)]);
  return years.map(([a,b])=>{
    const g=label(a).split(' ')[0], inY=bs=>bs.filter(x=>x[2]>=Math.max(a,P.now,a)&&x[1]<=b), out=[], done=[];
    // 교과
    const sch=inY(R('school')), dd=sch.filter(x=>/디딤돌/.test(x[0])), sys=sch.find(x=>/계통/.test(x[0])), md=sch.filter(x=>/원리해설/.test(x[0]));
    if(dd.length) out.push(dd.length>1?`교과는 ${mon(Math.max(dd[0][1],P.now,a))}부터 디딤돌 응용을 한 학기 ${pace(dd)}개월 주기로 ${dd[0][0].split(' ')[0]} → ${dd[dd.length-1][0].split(' ')[0]}까지 나갑니다.`:`교과는 ${mon(Math.max(dd[0][1],P.now,a))}부터 ${len(dd[0])}개월 동안 ${jo(dd[0][0].split(' ')[0]+' 디딤돌 응용','을','를')} 마칩니다.`);
    if(sys) out.push(`${mon(sys[1])}부터 ${len(sys)}개월은 계통(5·6학년·중1)으로 대수를 정리합니다.`);
    if(md.length) out.push(`${mon(Math.max(md[0][1],P.now,a))}부터 중등 원리해설을 ${pace(md)}개월 주기로 ${range(md[0][0].split(' ')[0],md[md.length-1][0].split(' ')[0])}까지 갑니다.`);
    // 교과 심화
    const s2=inY(R('school2')), sS=s2.filter(x=>/최상위/.test(x[0])), gap=s2.find(x=>/고민/.test(x[0])), sA=s2.filter(x=>/A급/.test(x[0]));
    if(sS.length) out.push(`심화는 한 학년 아래 최상위 S를 ${pace(sS)}개월 주기로 ${range(sS[0][0].split(' ')[0],sS[sS.length-1][0].split(' ')[0])}까지, 교과보다 1개월 늦게 함께 합니다.`);
    if(gap) out.push(`${mon(Math.max(gap[1],P.now,a))}~${mon(gap[2])}에는 황소 대비 여부에 따라 고민하면서 중등 쎈을 풉니다.`);
    if(sA.length) out.push(`${mon(Math.max(sA[0][1],P.now,a))}부터 중등 심화(A급)를 ${pace(sA)}개월 주기로 ${range(sA[0][0].split(' ')[0],sA[sA.length-1][0].split(' ')[0])}까지 합니다.`);
    // 사고력
    inY(R('comp')).forEach(x=>{ const st=x[1]>=a&&x[1]>=P.now, en=x[2]<=b;
      const w=nm(x[0]); out.push(st?`${jo(w,'을','를')} ${mon(x[1])}에 시작해 ${en?`${mon(x[2])}까지 완료합니다.`:`${label(x[2])}까지 이어 갑니다.`}`:`${jo(w,'은','는')} ${en?`${mon(x[2])}까지 완료합니다.`:`${label(x[2])}까지 이어 갑니다.`}`); if(en) done.push(w); });
    // 연산
    const ca=inY(R('calc'));
    if(ca.length){ const gj=ca.filter(x=>/계산법/.test(x[0])), mj=ca.filter(x=>/중학/.test(x[0]));
      if(gj.length) out.push(`연산은 기적의 계산법 ${gj[0][0].match(/\d+/)[0]} → ${gj[gj.length-1][0].match(/\d+/)[0]}권을 ${pace(gj)}개월씩 합니다.`);
      if(mj.length) out.push(`${mon(Math.max(mj[0][1],P.now,a))}부터 ${mj.map(x=>x[0].replace('기적의 ','')).join(' → ')} 순서로 중학 연산을 합니다.`);
      const last=ca.filter(x=>x[2]<=b).pop(); if(last) done.push(last[0].replace('기적의 ','')); }
    if(dd.length&&dd[dd.length-1][2]<=b) done.unshift('교과 '+dd[dd.length-1][0].split(' ')[0]);
    if(md.length&&md[md.length-1][2]<=b) done.unshift('중등 '+md[md.length-1][0].split(' ')[0]+' 원리해설');
    // 과학
    const sc=inY(R('sci')).filter(x=>x[1]>=a); if(sc.length) out.push('과학은 '+sc.map(x=>`${mon(x[1])}부터 ${nm(x[0])}`).join(', ')+'을 시작합니다.');
    // 황소 · 영재원
    const ev=inY(R('hw')).map(x=>`${mon(x[1])}${x[2]>x[1]?'~'+mon(x[2]):''} ${nm(x[0])}`);
    if(ev.length) out.push('황소(선택): '+ev.join(', ')+'.');
    const gv=inY(R('giftA').concat(R('giftB'))).sort((p,q)=>p[1]-q[1]).map(x=>`${mon(x[1])}${x[2]>x[1]&&x[2]<=b?'~'+mon(x[2]):''} ${nm(x[0]).replace(/ · .*/,'')}`);
    if(gv.length) out.push('영재원(고려 시): '+gv.join(', ')+'.');
    return {title:g, paras:out, done};
  }).filter(y=>y.paras.length);
}

window.Planner={narrative,build,renderTable,renderSimple,render3D,bind3D,render3DMap,bindMap,milestones,mOf,label,SEM,CALC,COMP,MID};
})();
