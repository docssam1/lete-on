"use strict";
/* ---------- Integral editor ---------- */
let integralBlocks=[],activeInput=null,integralSolution=null,iRange={xmin:-5,xmax:5,ymin:-8,ymax:8},iPan=null;
function newBlock(numer="",denom="",variable="x",fraction=false){return{id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),numerRaw:numer,denomRaw:denom,variable,fraction}}
function renderIntegralEditor(){
  const ed=$("#integralEditor");
  if(!integralBlocks.length){ed.innerHTML='<div class="empty-editor"><div><b>∫ 버튼</b>을 눌러 적분 블록을 추가하세요.<br>가운데 칸에는 x(x−1)(x−2)처럼 식만 입력합니다.</div></div>';$("#integralPreview").innerHTML="∫ 버튼을 눌러 식을 시작하세요.";return}
  ed.innerHTML=`<div class="integral-chain">${integralBlocks.map((b,i)=>`${i?'<span class="join-plus">＋</span>':''}<div class="integral-block ${b.fraction?"fraction":""}" data-id="${b.id}">
    <span class="integral-sign">∫</span>
    <div class="middle-expression">
      <input class="math-entry numerator" value="${escapeAttr(b.numerRaw)}" placeholder="${b.variable}에 대한 식" aria-label="분자 또는 피적분함수">
      <div class="den-wrap"><input class="math-entry denominator" value="${escapeAttr(b.denomRaw)}" placeholder="분모" aria-label="분모"></div>
    </div>
    <span class="diff">d${b.variable}</span>
    <div style="display:grid;gap:5px">
      <select class="variable-select" aria-label="적분 변수"><option value="x" ${b.variable==="x"?"selected":""}>x</option><option value="y" ${b.variable==="y"?"selected":""}>y</option></select>
      <button class="danger remove-integral">삭제</button>
    </div>
  </div>`).join("")}</div>`;
  $$(".integral-block").forEach(el=>{
    const id=el.dataset.id,b=integralBlocks.find(v=>v.id===id);
    const num=el.querySelector(".numerator"),den=el.querySelector(".denominator"),sel=el.querySelector(".variable-select");
    [num,den].forEach(inp=>{
      inp.addEventListener("focus",()=>activeInput=inp);
      inp.addEventListener("input",()=>{if(inp.classList.contains("numerator"))b.numerRaw=inp.value;else b.denomRaw=inp.value;updateIntegralPreview()});
    });
    sel.addEventListener("change",()=>{b.variable=sel.value;renderIntegralEditor();updateIntegralPreview()});
    el.querySelector(".remove-integral").addEventListener("click",()=>{integralBlocks=integralBlocks.filter(v=>v.id!==id);activeInput=null;renderIntegralEditor();updateIntegralPreview()});
  });
  updateIntegralPreview();
}
const escapeAttr=s=>String(s).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;");
function rawPretty(raw,v){
  return String(raw||"□").replace(/−/g,"-").replace(/\^(\d+)/g,(_,n)=>`<span class="sup">${n}</span>`).replaceAll("*","·");
}
function updateIntegralPreview(){
  if(!integralBlocks.length)return;
  $("#integralPreview").innerHTML=integralBlocks.map(b=>`∫ ${b.fraction?`<span class="frac"><span>${rawPretty(b.numerRaw,b.variable)}</span><span>${rawPretty(b.denomRaw||"□",b.variable)}</span></span>`:rawPretty(b.numerRaw,b.variable)} d${b.variable}`).join(" ＋ ");
}
function addIntegral(fraction=false){
  integralBlocks.push(newBlock("","",integralBlocks.at(-1)?.variable||"x",fraction));renderIntegralEditor();
  setTimeout(()=>{const blocks=$$(".integral-block");const inp=blocks.at(-1)?.querySelector(".numerator");inp?.focus()},0);
}
function insertAtCursor(text){
  if(!activeInput){if(!integralBlocks.length)addIntegral();setTimeout(()=>{activeInput=$$(".numerator").at(-1);insertAtCursor(text)},0);return}
  const s=activeInput.selectionStart??activeInput.value.length,e=activeInput.selectionEnd??s;
  activeInput.value=activeInput.value.slice(0,s)+text+activeInput.value.slice(e);activeInput.selectionStart=activeInput.selectionEnd=s+text.length;
  activeInput.dispatchEvent(new Event("input",{bubbles:true}));activeInput.focus();
}
$("#addIntegralBtn").addEventListener("click",()=>addIntegral(false));$("#plusIntegralBtn").addEventListener("click",()=>addIntegral(false));
$("#fractionBtn").addEventListener("click",()=>{if(!integralBlocks.length){addIntegral(true);return}const el=activeInput?.closest(".integral-block")||$$(".integral-block").at(-1),b=integralBlocks.find(v=>v.id===el.dataset.id);b.fraction=true;renderIntegralEditor();setTimeout(()=>{const den=$(`.integral-block[data-id="${b.id}"] .denominator`);den.focus();activeInput=den},0)});
$("#power2Btn").addEventListener("click",()=>insertAtCursor("^2"));$("#powerBtn").addEventListener("click",()=>insertAtCursor("^"));$("#parenBtn").addEventListener("click",()=>insertAtCursor("()"));
$("#clearIntegralBtn").addEventListener("click",()=>{integralBlocks=[];integralSolution=null;activeInput=null;renderIntegralEditor();$("#integrationResult").classList.add("hidden")});
$("#loadFirstBtn").addEventListener("click",()=>loadIntegralExample(1));
$$(".integral-example").forEach(b=>b.addEventListener("click",()=>loadIntegralExample(Number(b.dataset.example))));
function loadIntegralExample(n){
  if(n===1)integralBlocks=[newBlock("x(x-1)(x-2)","","x",false)];
  if(n===2)integralBlocks=[newBlock("x^4+x^2+1","x^2-x+1","x",true)];
  if(n===3)integralBlocks=[newBlock("y^3","y+1","y",true),newBlock("1","y+1","y",true)];
  activeInput=null;renderIntegralEditor();solveIntegral();
}
function parseEditorBlocks(){
  if(!integralBlocks.length)throw Error("먼저 ∫ 버튼을 눌러 적분식을 만드세요.");
  return integralBlocks.map((b,i)=>{
    const numer=parsePoly(b.numerRaw,b.variable),denom=b.fraction?parsePoly(b.denomRaw,b.variable):[1];
    if(isZeroPoly(denom))throw Error(`${i+1}번째 적분의 분모가 0입니다.`);
    return{...b,numer,denom};
  });
}

/* ---------- Rational integration ---------- */
function specialKey(s){return s.type+"|"+JSON.stringify(s.poly||[])+"|"+[s.a,s.b,s.disc].map(v=>nice(v||0)).join("|")}
function integrateRationalBlock(block){
  const {numer,denom,variable:v}=block,{q,r}=polyDiv(numer,denom),poly=integratePoly(q),specials=[],steps=[];
  steps.push(`<div class="math-result">${integralBlockHTML(block)}</div>`);
  if(denom.length===1){
    if(!samePoly(numer,q))steps.push(`곱과 괄호를 전개하면 <span class="math-result">${polyHTML(numer,v)}</span>입니다.`);
    steps.push(`항별로 적분할 준비: <span class="math-result">∫ (${polyHTML(q,v)}) d${v}</span>`);
  }else{
    const exact=isZeroPoly(r);
    steps.push(`다항식 나눗셈: <span class="math-result">${expressionHTML(numer,denom,v)} = ${polyHTML(q,v)}${exact?"":` ＋ ${expressionHTML(r,denom,v)}`}</span>`);
    if(exact)steps.push(`<b>나머지가 0</b>이므로 분수식이 다항식 <span class="math-result">${polyHTML(q,v)}</span>로 정확히 정리됩니다.`);
  }
  if(!isZeroPoly(r)){
    const deg=denom.length-1;
    if(deg===1){
      const a=denom[1],c=denom[0],k=r[0]/a;
      specials.push({type:"ln",coeff:k,poly:denom});
      steps.push(`<span class="math-result">∫ ${expressionHTML(r,denom,v)} d${v} = ${numHTML(k)} ln|${polyHTML(denom,v)}|</span>`);
    }else if(deg===2){
      const a=denom[2],b=denom[1]||0,c=denom[0]||0,p=r[1]||0,q0=r[0]||0;
      const alpha=p/(2*a),beta=q0-alpha*b,disc4=4*a*c-b*b,disc=b*b-4*a*c;
      if(Math.abs(alpha)>EPS)specials.push({type:"ln",coeff:alpha,poly:denom});
      if(Math.abs(beta)>EPS){
        if(disc4>EPS)specials.push({type:"atanQ",coeff:beta*2/Math.sqrt(disc4),a,b,disc:disc4,poly:denom});
        else if(disc>EPS)specials.push({type:"logRatioQ",coeff:beta/Math.sqrt(disc),a,b,disc,poly:denom});
        else specials.push({type:"reciprocalQ",coeff:beta,a,b,poly:denom});
      }
      steps.push(`나머지를 분모의 미분과 나누어 생각합니다: <span class="math-result">${polyHTML(r,v)} = ${numHTML(alpha)}·(${polyHTML(deriv(denom),v)}) ${beta>=0?"＋":"−"} ${numHTML(Math.abs(beta))}</span>`);
    }else throw Error("현재는 분모가 1차 또는 2차인 유리함수까지 풀이할 수 있습니다.");
  }
  const result={variable:v,poly,specials};
  steps.push(`항별 적분 결과: <span class="math-result">${resultHTML(result,false)}</span>`);
  return{result,steps,q,r};
}
function combineResults(items){
  const map=new Map();
  for(const item of items){
    const v=item.result.variable;if(!map.has(v))map.set(v,{variable:v,poly:[0],specials:[]});
    const out=map.get(v);out.poly=add(out.poly,item.result.poly);
    for(const s of item.result.specials){
      const key=specialKey(s),old=out.specials.find(z=>specialKey(z)===key);
      if(old)old.coeff+=s.coeff;else out.specials.push({...s});
    }
  }
  for(const out of map.values())out.specials=out.specials.filter(s=>Math.abs(s.coeff)>1e-8);
  return[...map.values()];
}
function signedTerm(coef,body,isFirst){
  if(Math.abs(coef)<EPS)return"";const neg=coef<0,ac=Math.abs(coef),c=Math.abs(ac-1)<EPS?"":numHTML(ac);
  return`${neg?"−":isFirst?"":"＋"}${c}${body}`;
}
function resultHTML(res,withC=true){
  const parts=[];const p=polyHTML(res.poly,res.variable);
  if(!isZeroPoly(res.poly))parts.push(p);
  for(const s of res.specials){
    let body="";
    if(s.type==="ln")body=`ln|${polyHTML(s.poly,res.variable)}|`;
    if(s.type==="atanQ")body=`tan<span class="sup">−1</span><span style="white-space:nowrap">(${expressionHTML([s.b,2*s.a],[Math.sqrt(s.disc)],res.variable)})</span>`;
    if(s.type==="logRatioQ"){
      const u=polyHTML([s.b,2*s.a],res.variable),rt=numHTML(Math.sqrt(s.disc));
      body=`ln|<span class="frac"><span>${u} − ${rt}</span><span>${u} ＋ ${rt}</span></span>|`;
    }
    if(s.type==="reciprocalQ")body=`<span class="frac"><span>−2</span><span>${polyHTML([s.b,2*s.a],res.variable)}</span></span>`;
    const t=signedTerm(s.coeff,body,parts.length===0);if(t)parts.push(t);
  }
  let body=parts.join(" ")||"0";if(withC)body+=" ＋ C";return body;
}
function specialEval(s,x){
  if(s.type==="ln"){const v=evalP(s.poly,x);return Math.abs(v)<1e-12?NaN:s.coeff*Math.log(Math.abs(v))}
  if(s.type==="atanQ")return s.coeff*Math.atan((2*s.a*x+s.b)/Math.sqrt(s.disc));
  if(s.type==="logRatioQ"){const u=2*s.a*x+s.b,rt=Math.sqrt(s.disc),r=(u-rt)/(u+rt);return Math.abs(r)<1e-15?NaN:s.coeff*Math.log(Math.abs(r))}
  if(s.type==="reciprocalQ"){const d=2*s.a*x+s.b;return Math.abs(d)<1e-12?NaN:s.coeff*(-2/d)}
  return 0;
}
function evalResult(res,x){let y=evalP(res.poly,x);for(const s of res.specials)y+=specialEval(s,x);return y}
function solveIntegral(){
  try{
    const blocks=parseEditorBlocks(),items=blocks.map(integrateRationalBlock),combined=combineResults(items);
    integralSolution={blocks,items,combined};
    const allSteps=[];
    items.forEach((it,i)=>allSteps.push(`<div class="solution-step"><span class="step-tag">${i+1}번째 적분</span>${it.steps.map((s,j)=>`<div style="${j?"margin-top:7px":""}">${s}</div>`).join("")}</div>`));
    if(items.length>1)allSteps.push(`<div class="solution-step"><span class="step-tag">같은 항 합치기</span><div class="math-result">${combined.map(r=>resultHTML(r,false)).join(" ＋ ")}</div><div class="small" style="margin-top:6px">서로 반대인 로그 항이나 같은 차수의 항을 합쳐 정리합니다.</div></div>`);
    $("#integrationSteps").innerHTML=allSteps.join("");
    $("#integrationAnswer").innerHTML=combined.map(r=>`∫ 결과 (${r.variable}): ${resultHTML(r,true)}`).join("<br>");
    $("#integrationVerify").innerHTML=`<b>미분 검산:</b> 최종 답을 각 변수로 미분하면 처음 피적분함수로 돌아갑니다. 적분상수 C는 미분하면 0이 됩니다.`;
    $("#integrationResult").classList.remove("hidden");$("#integralError").style.display="none";
    fitIntegralGraph();setTimeout(drawIntegralGraph,0);
  }catch(e){$("#integralError").textContent=e.message;$("#integralError").style.display="block"}
}
$("#solveIntegralBtn").addEventListener("click",solveIntegral);

function totalIntegrandAt(x){
  if(!integralSolution)return NaN;const vars=[...new Set(integralSolution.blocks.map(b=>b.variable))];if(vars.length!==1)return NaN;
  let y=0;for(const b of integralSolution.blocks){const d=evalP(b.denom,x);if(Math.abs(d)<1e-10)return NaN;y+=evalP(b.numer,x)/d}return y;
}
function totalAntiAt(x){
  if(!integralSolution||integralSolution.combined.length!==1)return NaN;return evalResult(integralSolution.combined[0],x);
}
function fitIntegralGraph(){
  iRange={xmin:-5,xmax:5,ymin:-8,ymax:8};if(!integralSolution)return;
  const ys=[];for(let i=0;i<=800;i++){const x=iRange.xmin+(iRange.xmax-iRange.xmin)*i/800;for(const fn of [totalIntegrandAt,totalAntiAt]){const y=fn(x);if(Number.isFinite(y)&&Math.abs(y)<1000)ys.push(y)}}
  if(ys.length){let lo=Math.min(...ys),hi=Math.max(...ys);if(hi-lo<2){lo-=1;hi+=1}const p=(hi-lo)*.12;iRange.ymin=lo-p;iRange.ymax=hi+p}
}
function drawCurve(ctx,X,Y,fn,color,xmin,xmax){
  ctx.strokeStyle=color;ctx.lineWidth=2.7;ctx.beginPath();let started=false,prev=null;
  for(let i=0;i<=1100;i++){const x=xmin+(xmax-xmin)*i/1100,y=fn(x);const bad=!Number.isFinite(y)||Math.abs(y)>1e8;
    if(bad){started=false;prev=null;continue}
    const py=Y(y);if(prev!==null&&Math.abs(py-prev)>700){started=false}
    if(!started){ctx.moveTo(X(x),py);started=true}else ctx.lineTo(X(x),py);prev=py}
  ctx.stroke();
}
function drawIntegralGraph(){
  const {ctx,w,h}=canvasSetup("#integralGraph"),map=drawAxes(ctx,w,h,iRange);
  if(!integralSolution)return;
  const vars=[...new Set(integralSolution.blocks.map(b=>b.variable))];
  if(vars.length!==1){ctx.fillStyle="#716985";ctx.font="15px system-ui";ctx.fillText("서로 다른 변수가 섞인 식은 한 좌표평면에 함께 그리지 않습니다.",70,70);return}
  if($("#showIntegrand").checked)drawCurve(ctx,map.X,map.Y,totalIntegrandAt,"#6d42d8",iRange.xmin,iRange.xmax);
  if($("#showAntiderivative").checked)drawCurve(ctx,map.X,map.Y,totalAntiAt,"#13825f",iRange.xmin,iRange.xmax);
  $("#iRangeLabel").textContent=`${vars[0]}: ${nice(iRange.xmin)} ~ ${nice(iRange.xmax)} | 세로: ${nice(iRange.ymin)} ~ ${nice(iRange.ymax)}`;
}
function iZoom(f,ax=(iRange.xmin+iRange.xmax)/2,ay=(iRange.ymin+iRange.ymax)/2){iRange.xmin=ax+(iRange.xmin-ax)*f;iRange.xmax=ax+(iRange.xmax-ax)*f;iRange.ymin=ay+(iRange.ymin-ay)*f;iRange.ymax=ay+(iRange.ymax-ay)*f;drawIntegralGraph()}
$("#iZoomIn").addEventListener("click",()=>iZoom(.72));$("#iZoomOut").addEventListener("click",()=>iZoom(1.38));$("#iFit").addEventListener("click",()=>{fitIntegralGraph();drawIntegralGraph()});
$("#showIntegrand").addEventListener("change",drawIntegralGraph);$("#showAntiderivative").addEventListener("change",drawIntegralGraph);
const ig=$("#integralGraph");
ig.addEventListener("wheel",e=>{e.preventDefault();const r=ig.getBoundingClientRect(),rx=Math.max(0,Math.min(1,(e.clientX-r.left-54)/(r.width-77))),ry=Math.max(0,Math.min(1,(e.clientY-r.top-23)/(r.height-63))),ax=iRange.xmin+rx*(iRange.xmax-iRange.xmin),ay=iRange.ymax-ry*(iRange.ymax-iRange.ymin);iZoom(e.deltaY<0?.82:1.22,ax,ay)},{passive:false});
ig.addEventListener("pointerdown",e=>{const r=ig.getBoundingClientRect();iPan={px:e.clientX,py:e.clientY,range:{...iRange},w:r.width-77,h:r.height-63};ig.classList.add("dragging");ig.setPointerCapture(e.pointerId)});
ig.addEventListener("pointermove",e=>{if(!iPan)return;const dx=e.clientX-iPan.px,dy=e.clientY-iPan.py,sx=iPan.range.xmax-iPan.range.xmin,sy=iPan.range.ymax-iPan.range.ymin;iRange.xmin=iPan.range.xmin-dx/iPan.w*sx;iRange.xmax=iPan.range.xmax-dx/iPan.w*sx;iRange.ymin=iPan.range.ymin+dy/iPan.h*sy;iRange.ymax=iPan.range.ymax+dy/iPan.h*sy;drawIntegralGraph()});
["pointerup","pointercancel"].forEach(ev=>ig.addEventListener(ev,e=>{iPan=null;ig.classList.remove("dragging");try{ig.releasePointerCapture(e.pointerId)}catch(_){}}));
