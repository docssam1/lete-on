"use strict";
/* ---------- Extrema mode ---------- */
let P=[-2,-3,0,1],D=[],critical=[],extrema=[];
let xMin=-4,xMax=4,yMin=-6,yMax=3,drawProgress=1,animId=null,pan=null;
function setExtremaRange(){
  const roots=realRoots(P),xs=[...critical,...roots].filter(Number.isFinite);
  if(xs.length){xMin=Math.min(-3,...xs)-1.4;xMax=Math.max(3,...xs)+1.4}else{xMin=-4;xMax=4}
  if(xMax-xMin<6){const m=(xMin+xMax)/2;xMin=m-3;xMax=m+3}
  const ys=[];for(let i=0;i<=700;i++){const x=xMin+(xMax-xMin)*i/700,y=evalP(P,x);if(Number.isFinite(y)&&Math.abs(y)<1e8)ys.push(y)}
  yMin=Math.min(...ys);yMax=Math.max(...ys);if(yMax-yMin<1){yMin-=1;yMax+=1}const padY=(yMax-yMin)*.12;yMin-=padY;yMax+=padY;
}
function analyzeExtrema(){
  try{
    P=parsePoly($("#formula").value.replace(/^.*?=/,""),"x");
    ({D,critical,extrema}=extremaAnalysis(P));setExtremaRange();$("#viewPreset").value="auto";
    $("#originalFormula").innerHTML=polyHTML(P,"x","f(x)");
    const terms=[];for(let d=P.length-1;d>=0;d--)if(Math.abs(P[d])>EPS)terms.push(termDerivativeHTML(P[d],d));
    $("#termProcess").innerHTML=terms.join("");
    $("#derivativeFormula").innerHTML=polyHTML(D,"x","f′(x)");
    $("#criticalFormula").innerHTML=critical.length?`f′(x)=0 &nbsp;⇒&nbsp; x = ${critical.map(nice).join(", ")}`:"f′(x)=0인 실수해가 없습니다.";
    renderSignTable();renderExtremaCards();drawProgress=1;$("#xSlider").value=500;updateExtremaReadout();
    $("#error").style.display="none";
  }catch(e){$("#error").textContent=e.message;$("#error").style.display="block"}
}
function signAt(x){const v=evalP(D,x);return v>1e-7?1:v<-1e-7?-1:0}
function renderSignTable(){
  if(!critical.length){const s=signAt(0);$("#signTable").innerHTML=`<table><tr><th>구간</th><td>전체 실수</td></tr><tr><th>f′(x)</th><td>${s>0?"+":s<0?"−":"0"}</td></tr><tr><th>f(x)</th><td>${s>0?"증가":s<0?"감소":"일정"}</td></tr></table>`;$("#statusPills").innerHTML=`<span class="pill ${s>0?"inc":s<0?"dec":"flat"}">${s>0?"전체 구간 증가":s<0?"전체 구간 감소":"상수함수"}</span>`;return}
  const bounds=[xMin,...critical,xMax],ints=[];
  for(let i=0;i<bounds.length-1;i++){const a=bounds[i],b=bounds[i+1],s=signAt((a+b)/2);ints.push({label:`(${i===0?"−∞":nice(a)}, ${i===bounds.length-2?"+∞":nice(b)})`,s})}
  let h="<table><tr><th>x의 구간</th>"+ints.map(v=>`<td>${v.label}</td>`).join("")+"</tr><tr><th>f′(x)</th>"+ints.map(v=>`<td style='font-size:21px;font-weight:900;color:${v.s>0?"#13825f":"#cb405a"}'>${v.s>0?"+":"−"}</td>`).join("")+"</tr><tr><th>f(x)</th>"+ints.map(v=>`<td>${v.s>0?"↗ 증가":"↘ 감소"}</td>`).join("")+"</tr></table>";
  $("#signTable").innerHTML=h;$("#statusPills").innerHTML=ints.map(v=>`<span class="pill ${v.s>0?"inc":"dec"}">${v.label} ${v.s>0?"증가":"감소"}</span>`).join("");
}
function renderExtremaCards(){
  $("#extrema").innerHTML=extrema.length?extrema.map(e=>`<div class="ext ${e.type}"><b>${e.type==="max"?"극대점":e.type==="min"?"극소점":"정지점"}</b><div class="coord">(${nice(e.x)}, ${nice(e.y)})</div><div class="small">${e.type==="max"?"＋에서 −로 변화":e.type==="min"?"−에서 ＋로 변화":"부호 변화 없음"}</div></div>`).join(""):'<div class="ext">극대·극소 후보가 없습니다.</div>';
}
function canvasSetup(sel){
  const c=$(sel),rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1,w=Math.max(320,rect.width),h=Math.max(300,rect.height);
  if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr)}
  const ctx=c.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);return{c,ctx,w,h};
}
function gridStep(span){const b=Math.pow(10,Math.floor(Math.log10(span/8)));return[1,2,5,10].map(k=>k*b).find(v=>span/v<=10)||b*10}
function drawAxes(ctx,w,h,range){
  const {xmin,xmax,ymin,ymax}=range,pad={l:54,r:23,t:23,b:40},W=w-pad.l-pad.r,H=h-pad.t-pad.b;
  const X=x=>pad.l+(x-xmin)/(xmax-xmin)*W,Y=y=>pad.t+(ymax-y)/(ymax-ymin)*H;
  ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);ctx.strokeStyle="#eeeaf8";ctx.lineWidth=1;ctx.font="12px system-ui";ctx.fillStyle="#81778f";
  const xs=gridStep(xmax-xmin),ys=gridStep(ymax-ymin);
  for(let x=Math.ceil(xmin/xs)*xs;x<=xmax+EPS;x+=xs){ctx.beginPath();ctx.moveTo(X(x),pad.t);ctx.lineTo(X(x),pad.t+H);ctx.stroke();ctx.fillText(nice(x),X(x)+3,Math.min(h-9,Math.max(15,Y(0)+16)))}
  for(let y=Math.ceil(ymin/ys)*ys;y<=ymax+EPS;y+=ys){ctx.beginPath();ctx.moveTo(pad.l,Y(y));ctx.lineTo(pad.l+W,Y(y));ctx.stroke();if(Math.abs(y)>EPS)ctx.fillText(nice(y),Math.max(3,X(0)-40),Y(y)-4)}
  ctx.strokeStyle="#8f87a3";ctx.lineWidth=1.5;if(xmin<=0&&xmax>=0){ctx.beginPath();ctx.moveTo(X(0),pad.t);ctx.lineTo(X(0),pad.t+H);ctx.stroke()}if(ymin<=0&&ymax>=0){ctx.beginPath();ctx.moveTo(pad.l,Y(0));ctx.lineTo(pad.l+W,Y(0));ctx.stroke()}
  return{X,Y,pad,W,H};
}
function drawExtremaGraph(){
  const {ctx,w,h}=canvasSetup("#graph"),map=drawAxes(ctx,w,h,{xmin:xMin,xmax:xMax,ymin:yMin,ymax:yMax}),{X,Y}=map,total=900,upto=Math.floor(total*drawProgress);
  ctx.strokeStyle="#6d42d8";ctx.lineWidth=3;ctx.beginPath();let started=false;
  for(let i=0;i<=upto;i++){const x=xMin+(xMax-xMin)*i/total,y=evalP(P,x);if(!Number.isFinite(y)||Math.abs(y)>1e9){started=false;continue}if(!started){ctx.moveTo(X(x),Y(y));started=true}else ctx.lineTo(X(x),Y(y))}ctx.stroke();
  extrema.forEach(e=>{if(e.x<xMin||e.x>xMax||e.y<yMin||e.y>yMax)return;ctx.fillStyle=e.type==="max"?"#cb405a":e.type==="min"?"#3474d4":"#777";ctx.beginPath();ctx.arc(X(e.x),Y(e.y),6,0,Math.PI*2);ctx.fill();ctx.font="bold 13px system-ui";ctx.fillText(`${e.type==="max"?"극대":e.type==="min"?"극소":"정지"} (${nice(e.x)}, ${nice(e.y)})`,X(e.x)+8,Y(e.y)-8)});
  const t=Number($("#xSlider").value)/1000,tx=xMin+(xMax-xMin)*t,ty=evalP(P,tx),m=evalP(D,tx),span=(xMax-xMin)*.15;
  ctx.strokeStyle="#13825f";ctx.lineWidth=2;ctx.setLineDash([7,5]);ctx.beginPath();ctx.moveTo(X(tx-span),Y(ty-m*span));ctx.lineTo(X(tx+span),Y(ty+m*span));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#13825f";ctx.beginPath();ctx.arc(X(tx),Y(ty),5,0,Math.PI*2);ctx.fill();
  $("#rangeLabel").textContent=`x: ${nice(xMin)} ~ ${nice(xMax)} | y: ${nice(yMin)} ~ ${nice(yMax)}`;
}
function updateExtremaReadout(){
  const t=Number($("#xSlider").value)/1000,x=xMin+(xMax-xMin)*t,y=evalP(P,x),m=evalP(D,x);
  $("#readout").innerHTML=`x ≈ <b>${nice(x)}</b>, f(x) ≈ <b>${nice(y)}</b>, f′(x) ≈ <b>${nice(m)}</b> &nbsp;|&nbsp; ${m>1e-5?"기울기 양수 → 증가 ↗":m<-1e-5?"기울기 음수 → 감소 ↘":"기울기 0 → 앞뒤 부호 확인"}`;drawExtremaGraph();
}
function zoomExtrema(factor,ax=(xMin+xMax)/2,ay=(yMin+yMax)/2){xMin=ax+(xMin-ax)*factor;xMax=ax+(xMax-ax)*factor;yMin=ay+(yMin-ay)*factor;yMax=ay+(yMax-ay)*factor;$("#viewPreset").value="custom";updateExtremaReadout()}
$("#analyzeBtn").addEventListener("click",analyzeExtrema);$("#formula").addEventListener("keydown",e=>{if(e.key==="Enter")analyzeExtrema()});
$$(".extrema-example").forEach(b=>b.addEventListener("click",()=>{$("#formula").value=b.dataset.f;analyzeExtrema()}));
$("#xSlider").addEventListener("input",updateExtremaReadout);$("#zoomInBtn").addEventListener("click",()=>zoomExtrema(.72));$("#zoomOutBtn").addEventListener("click",()=>zoomExtrema(1.38));
$("#fitBtn").addEventListener("click",()=>{setExtremaRange();$("#viewPreset").value="auto";updateExtremaReadout()});
$("#viewPreset").addEventListener("change",e=>{if(e.target.value==="auto")setExtremaRange();else if(e.target.value!=="custom"){const n=Number(e.target.value);xMin=-n;xMax=n;yMin=-n;yMax=n}updateExtremaReadout()});
$("#playBtn").addEventListener("click",()=>{cancelAnimationFrame(animId);drawProgress=0;const st=performance.now();const tick=n=>{drawProgress=Math.min(1,(n-st)/2200);drawExtremaGraph();if(drawProgress<1)animId=requestAnimationFrame(tick)};animId=requestAnimationFrame(tick)});
$("#resetBtn").addEventListener("click",()=>{$("#formula").value="f(x)=x^3-3x-2";analyzeExtrema()});
const g=$("#graph");
g.addEventListener("wheel",e=>{e.preventDefault();const r=g.getBoundingClientRect(),rx=(e.clientX-r.left-54)/Math.max(1,r.width-77),ry=(e.clientY-r.top-23)/Math.max(1,r.height-63),ax=xMin+Math.max(0,Math.min(1,rx))*(xMax-xMin),ay=yMax-Math.max(0,Math.min(1,ry))*(yMax-yMin);zoomExtrema(e.deltaY<0?.82:1.22,ax,ay)},{passive:false});
g.addEventListener("pointerdown",e=>{const r=g.getBoundingClientRect();pan={px:e.clientX,py:e.clientY,xMin,xMax,yMin,yMax,w:r.width-77,h:r.height-63};g.classList.add("dragging");g.setPointerCapture(e.pointerId)});
g.addEventListener("pointermove",e=>{if(!pan)return;const dx=e.clientX-pan.px,dy=e.clientY-pan.py,sx=pan.xMax-pan.xMin,sy=pan.yMax-pan.yMin;xMin=pan.xMin-dx/pan.w*sx;xMax=pan.xMax-dx/pan.w*sx;yMin=pan.yMin+dy/pan.h*sy;yMax=pan.yMax+dy/pan.h*sy;$("#viewPreset").value="custom";updateExtremaReadout()});
["pointerup","pointercancel"].forEach(ev=>g.addEventListener(ev,e=>{pan=null;g.classList.remove("dragging");try{g.releasePointerCapture(e.pointerId)}catch(_){}}));
