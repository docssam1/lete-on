"use strict";
/* ---------- Similar-problem test ---------- */
const testState={topic:"extrema",attempts:0,correct:0,problem:null,graded:false};
const extremaPool=[
  "x^3-12x+1","-x^3+3x+2","x^3-3x^2-9x+5","2x^3-6x^2-18x+4","-2x^3+6x^2+18x-1"
];
const integralPool=[
  [newBlock("(x+1)(x-3)","","x",false)],
  [newBlock("x^3+1","x+1","x",true)],
  [newBlock("x^4-1","x^2-1","x",true)],
  [newBlock("y(y-2)(y+3)","","y",false)],
  [newBlock("y^3","y+1","y",true),newBlock("1","y+1","y",true)]
];
function extremaAnswer(P){
  const a=extremaAnalysis(P),mx=a.extrema.find(e=>e.type==="max"),mn=a.extrema.find(e=>e.type==="min");
  return `극대점 ${mx?`(${nice(mx.x)}, ${nice(mx.y)})`:"없음"}, 극소점 ${mn?`(${nice(mn.x)}, ${nice(mn.y)})`:"없음"}`;
}
function makeExtremaProblem(){
  const raw=extremaPool[Math.floor(Math.random()*extremaPool.length)],p=parsePoly(raw,"x"),a=extremaAnalysis(p),correct=extremaAnswer(p);
  const mx=a.extrema.find(e=>e.type==="max"),mn=a.extrema.find(e=>e.type==="min"),opts=[correct];
  if(mx&&mn){
    opts.push(`극대점 (${nice(mn.x)}, ${nice(mn.y)}), 극소점 (${nice(mx.x)}, ${nice(mx.y)})`);
    opts.push(`극대점 (${nice(mx.x)}, ${nice(-mx.y)}), 극소점 (${nice(mn.x)}, ${nice(-mn.y)})`);
    opts.push(`극대점 (${nice(mx.x)}, 0), 극소점 (${nice(mn.x)}, 0)`);
  }else{opts.push("극대점 없음, 극소점 없음","극대점 (0, 0), 극소점 없음","극대점 없음, 극소점 (0, 0)")}
  return{topic:"extrema",question:`f(x) = ${polyHTML(p,"x")}`,instruction:"함수의 극대점과 극소점을 고르세요.",options:shuffle([...new Set(opts)]).slice(0,4),correct,
    explanation:`f′(x) = ${polyHTML(a.D,"x")}이고, f′(x)=0의 해는 ${a.critical.map(nice).join(", ")}입니다. 부호가 ＋→−인 곳은 극대, −→＋인 곳은 극소이므로 <b>${correct}</b>입니다.`};
}
function cloneResult(r){return{variable:r.variable,poly:[...r.poly],specials:r.specials.map(s=>({...s,poly:s.poly?[...s.poly]:undefined}))}}
function makeWrongResults(correctRes){
  const a=cloneResult(correctRes),b=cloneResult(correctRes),c=cloneResult(correctRes);
  for(let i=1;i<a.poly.length;i++)a.poly[i]*=(i+1);
  const idx=b.poly.findIndex((v,i)=>i>0&&Math.abs(v)>EPS);if(idx>=0)b.poly[idx]*=-1;else b.poly[0]+=1;
  c.poly[0]+=2;
  return[resultHTML(a,true),resultHTML(b,true),resultHTML(c,false)];
}
function makeIntegralProblem(){
  const rawBlocks=integralPool[Math.floor(Math.random()*integralPool.length)].map(b=>({...b,id:String(Math.random())}));
  const blocks=rawBlocks.map(b=>({...b,numer:parsePoly(b.numerRaw,b.variable),denom:b.fraction?parsePoly(b.denomRaw,b.variable):[1]}));
  const items=blocks.map(integrateRationalBlock),combined=combineResults(items),correct=combined.map(r=>resultHTML(r,true)).join(" ＋ ");
  let options=[correct,...makeWrongResults(combined[0])];options=[...new Set(options)].slice(0,4);
  return{topic:"integral",question:blocks.map(integralBlockHTML).join(" ＋ "),instruction:"올바른 부정적분 결과를 고르세요.",options:shuffle(options),correct,
    explanation:`먼저 식을 전개하거나 다항식 나눗셈으로 정리합니다.<br>${items.map(it=>it.steps.slice(1).join("<br>")).join("<br>")}<br><b>따라서 ${correct}</b>`};
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function newTestProblem(){
  testState.problem=testState.topic==="extrema"?makeExtremaProblem():makeIntegralProblem();testState.graded=false;
  const p=testState.problem;$("#testInstruction").textContent=p.instruction;$("#testQuestion").innerHTML=p.question;
  $("#testOptions").innerHTML=p.options.map((o,i)=>`<label class="option"><input type="radio" name="testOption" value="${i}"><span class="math-result">${o}</span></label>`).join("");
  $("#testFeedback").className="feedback";$("#testFeedback").textContent="";$("#testExplanation").classList.add("hidden");$("#testExplanation").innerHTML="";
}
function updateScore(){ $("#attemptCount").textContent=testState.attempts;$("#correctCount").textContent=testState.correct;$("#accuracy").textContent=testState.attempts?Math.round(testState.correct/testState.attempts*100)+"%":"0%" }
$$(".test-tab").forEach(b=>b.addEventListener("click",()=>{testState.topic=b.dataset.test;$$(".test-tab").forEach(x=>x.classList.toggle("active",x===b));newTestProblem()}));
$("#newProblemBtn").addEventListener("click",newTestProblem);
$("#gradeBtn").addEventListener("click",()=>{
  if(testState.graded)return;const checked=$("input[name=\"testOption\"]:checked");if(!checked){$("#testFeedback").className="feedback bad";$("#testFeedback").textContent="먼저 답을 하나 선택하세요.";return}
  const labels=$$(".option"),choice=testState.problem.options[Number(checked.value)],ok=choice===testState.problem.correct;
  labels.forEach((l,i)=>{const val=testState.problem.options[i];if(val===testState.problem.correct)l.classList.add("correct");else if(i===Number(checked.value))l.classList.add("wrong")});
  testState.attempts++;if(ok)testState.correct++;testState.graded=true;updateScore();
  $("#testFeedback").className="feedback "+(ok?"good":"bad");$("#testFeedback").innerHTML=ok?"정답입니다. 식의 변화 과정까지 설명할 수 있는지 확인해 보세요.":`다시 확인해 보세요. 정답은 <span class="math-result">${testState.problem.correct}</span>입니다.`;
});
$("#showExplanationBtn").addEventListener("click",()=>{$("#testExplanation").classList.remove("hidden");$("#testExplanation").innerHTML=`<span class="step-tag">풀이</span><div>${testState.problem.explanation}</div>`});
