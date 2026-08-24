"use strict";
/* ---------- Integral conditions -> function value ---------- */
const conditionProblems=[
  {level:"basic",k:2,p:1,q:6,r:0,s:4,t:-1},
  {level:"basic",k:4,p:0,q:-3,r:0,s:2,t:2},
  {level:"standard",k:5,p:-1,q:8,r:1,s:3,t:2},
  {level:"standard",k:-1,p:2,q:10,r:-2,s:-5,t:-1},
  {level:"challenge",k:4,p:-1,q:5,r:2,s:-1,t:2},
  {level:"challenge",k:3,p:2,q:2,r:-1,s:-2,t:-2}
];
const conditionCategoryInfo={
  constant:{label:"적분상수",desc:"C′=0과 양변 미분"},
  isolate:{label:"식 정리",desc:"kx를 이항해 f(x)만 남기기"},
  derivative:{label:"도함수",desc:"f′(x)를 정확히 구하기"},
  substitution:{label:"조건 대입",desc:"f′(r), f(p)를 순서대로 사용"},
  arithmetic:{label:"부호·계산",desc:"음수, 제곱, 분수 계산"}
};
const conditionStats=Object.fromEntries(Object.keys(conditionCategoryInfo).map(k=>[k,{wrong:0,tries:0}]));
const conditionState={initialized:false,mode:"choice",level:"basic",problem:null,derived:null,
  attempts:0,correct:0,choiceGraded:false,processIndex:0,processDone:[],lastProblem:null};

function conditionSignedTerm(n,variable="x"){
  if(n===0)return"";
  const sign=n>0?"+":"−",a=Math.abs(n);
  return `${sign}${a===1?"":a}${variable}`;
}
function conditionLinearCoefficient(k){
  if(k===0)return"2a";
  return `2a${k>0?"−":"+"}${Math.abs(k)}`;
}
function conditionIntegrand(k){
  if(k===0)return"f(x)";
  return `f(x)${k>0?"+":"−"}${Math.abs(k)===1?"":Math.abs(k)}x`;
}
function deriveConditionProblem(p){
  const a=(p.s-6*p.r+p.k)/2;
  const m=2*a-p.k;
  const b=p.q-3*p.p*p.p-m*p.p;
  const answer=3*p.t*p.t+m*p.t+b;
  return{a,m,b,answer};
}
function conditionNum(n){
  if(Math.abs(n-Math.round(n))<1e-9)return String(Math.round(n));
  const two=Math.round(n*2);
  if(Math.abs(n-two/2)<1e-9)return `${two}/2`;
  return String(Number(n.toFixed(4)));
}
function conditionQuestionHTML(p){
  return `∫(${conditionIntegrand(p.k)})dx = x³+ax²+bx+C<br>
    f(${p.p})=${p.q}, &nbsp; f′(${p.r})=${p.s}일 때 f(${p.t})를 구하여라.`;
}
function conditionExplanationHTML(p,d){
  const kPart=conditionLinearCoefficient(p.k);
  return `<span class="step-tag">전체 풀이</span>
    <div class="math-result">① 양변 미분: f(x)${conditionSignedTerm(p.k)} = 3x²+2ax+b</div>
    <div class="math-result" style="margin-top:6px">② f(x)=3x²+(${kPart})x+b</div>
    <div class="math-result" style="margin-top:6px">③ f′(x)=6x+${kPart}</div>
    <div class="math-result" style="margin-top:6px">④ f′(${p.r})=${p.s}를 대입하면 a=${conditionNum(d.a)}</div>
    <div class="math-result" style="margin-top:6px">⑤ f(${p.p})=${p.q}를 대입하면 b=${conditionNum(d.b)}</div>
    <div class="math-result" style="margin-top:6px">⑥ f(x)=3x²${conditionSignedTerm(d.m)}${d.b>=0?"+":"−"}${Math.abs(d.b)}</div>
    <div class="math-result" style="margin-top:6px"><b>따라서 f(${p.t})=${conditionNum(d.answer)}</b></div>`;
}
function conditionNormalizeExpr(s){
  return String(s||"").toLowerCase().replace(/[−–]/g,"-").replace(/\s+/g,"")
    .replace(/\*\*/g,"^").replace(/·|\*/g,"").replace(/x²/g,"x^2").replace(/x³/g,"x^3")
    .replace(/\+\-/g,"-").replace(/\-\-/g,"+");
}
function conditionParseNumber(s){
  const t=String(s||"").trim().replace(/[−–]/g,"-");
  if(/^[-+]?\d+(\.\d+)?$/.test(t))return Number(t);
  const m=t.match(/^([-+]?\d+)\s*\/\s*([-+]?\d+)$/);
  return m&&Number(m[2])!==0?Number(m[1])/Number(m[2]):NaN;
}
function conditionNumericEqual(input,answer){
  const n=conditionParseNumber(input);
  return Number.isFinite(n)&&Math.abs(n-answer)<1e-9;
}
function conditionExpressionEqual(input,accept){
  const n=conditionNormalizeExpr(input);
  return accept.map(conditionNormalizeExpr).includes(n);
}
function conditionBuildSteps(p,d){
  const kCoef=conditionLinearCoefficient(p.k);
  const fGrouped=`3x^2+(${kCoef})x+b`;
  const fExpanded=`3x^2+2ax${p.k>0?`-${p.k===1?"":p.k}x`:p.k<0?`+${Math.abs(p.k)===1?"":Math.abs(p.k)}x`:""}+b`;
  const prime=`6x+${kCoef}`;
  const finalFunction=`3x^2${d.m>=0?"+":"-"}${Math.abs(d.m)===1?"":Math.abs(d.m)}x${d.b>=0?"+":"-"}${Math.abs(d.b)}`;
  return[
    {label:"양변 미분",prompt:`오른쪽을 미분하면`,suffix:"",category:"constant",type:"expr",
      answer:["3x^2+2ax+b","2ax+3x^2+b"],hint:"x³→3x², ax²→2ax, bx→b, C→0입니다."},
    {label:"f(x) 정리",prompt:`f(x)=`,suffix:"",category:"isolate",type:"expr",
      answer:[fGrouped,fExpanded],hint:`왼쪽의 ${conditionIntegrand(p.k)}에서 ${conditionSignedTerm(p.k)}를 오른쪽으로 이항합니다.`},
    {label:"다시 미분",prompt:`f′(x)=`,suffix:"",category:"derivative",type:"expr",
      answer:[prime,`${kCoef}+6x`],hint:"3x²→6x이고 일차항의 계수는 그대로 남습니다."},
    {label:"미분 조건",prompt:`f′(${p.r})=${p.s}에서 a=`,suffix:"",category:"substitution",type:"number",
      answer:d.a,hint:`6×(${p.r})+2a${p.k>0?`−${p.k}`:`+${Math.abs(p.k)}`}=${p.s}를 푸세요.`},
    {label:"함숫값 조건",prompt:`f(${p.p})=${p.q}에서 b=`,suffix:"",category:"substitution",type:"number",
      answer:d.b,hint:`a를 넣어 일차항의 계수를 먼저 ${conditionNum(d.m)}로 정리한 뒤 x=${p.p}를 넣으세요.`},
    {label:"함수 완성",prompt:`f(x)=`,suffix:"",category:"arithmetic",type:"expr",
      answer:[finalFunction],hint:`f(x)=3x²+(${conditionNum(d.m)})x+(${conditionNum(d.b)})입니다.`},
    {label:"최종 계산",prompt:`f(${p.t})=`,suffix:"",category:"arithmetic",type:"number",
      answer:d.answer,hint:`x=${p.t}를 완성된 f(x)에 대입하세요. 음수의 제곱과 일차항의 부호를 확인하세요.`}
  ];
}
function conditionPickProblem(){
  const pool=conditionState.level==="all"?conditionProblems:conditionProblems.filter(p=>p.level===conditionState.level);
  let p=pool[Math.floor(Math.random()*pool.length)];
  if(pool.length>1&&p===conditionState.lastProblem)p=pool[(pool.indexOf(p)+1)%pool.length];
  conditionState.lastProblem=p;return p;
}
function initConditionModule(){
  if(conditionState.initialized)return;
  conditionState.initialized=true;
  $$(".condition-mode").forEach(b=>b.addEventListener("click",()=>{
    conditionState.mode=b.dataset.conditionMode;
    $$(".condition-mode").forEach(x=>x.classList.toggle("active",x===b));
    renderConditionMode();
  }));
  $$(".condition-level").forEach(b=>b.addEventListener("click",()=>{
    conditionState.level=b.dataset.conditionLevel;
    $$(".condition-level").forEach(x=>x.classList.toggle("active",x===b));
    newConditionProblem();
  }));
  $("#conditionNextBtn").addEventListener("click",newConditionProblem);
  $("#conditionGradeBtn").addEventListener("click",gradeConditionChoice);
  $("#conditionChoiceExplainBtn").addEventListener("click",()=>{
    $("#conditionExplanation").classList.remove("hidden");
    $("#conditionExplanation").innerHTML=conditionExplanationHTML(conditionState.problem,conditionState.derived);
  });
  newConditionProblem();
}
function newConditionProblem(){
  conditionState.problem=conditionPickProblem();
  conditionState.derived=deriveConditionProblem(conditionState.problem);
  conditionState.choiceGraded=false;conditionState.processIndex=0;
  conditionState.processDone=Array(7).fill(false);
  $("#conditionPracticeProblem").innerHTML=conditionQuestionHTML(conditionState.problem);
  $("#conditionFeedback").className="condition-feedback";$("#conditionFeedback").textContent="";
  $("#conditionExplanation").classList.add("hidden");$("#conditionExplanation").innerHTML="";
  renderConditionMode();updateConditionScore();renderConditionDiagnosis();
}
function renderConditionMode(){
  const choice=conditionState.mode==="choice";
  $("#conditionChoiceArea").classList.toggle("hidden",!choice);
  $("#conditionProcessArea").classList.toggle("hidden",choice);
  if(choice)renderConditionChoices();else renderConditionProcess();
}
function renderConditionChoices(){
  const d=conditionState.derived;
  let values=[d.answer,-d.answer,d.answer+4,d.answer-6,d.b,d.m];
  values=[...new Set(values)].slice(0,4);
  while(values.length<4)values.push(d.answer+values.length*3+2);
  values=shuffle(values);
  $("#conditionOptions").innerHTML=values.map((v,i)=>`<label class="condition-option">
    <input type="radio" name="conditionOption" value="${v}"><span class="math-result">f(${conditionState.problem.t})=${conditionNum(v)}</span>
  </label>`).join("");
  $("#conditionStepCount").textContent="답 선택";
}
function gradeConditionChoice(){
  if(conditionState.choiceGraded)return;
  const checked=$("input[name=\"conditionOption\"]:checked");
  const fb=$("#conditionFeedback");
  if(!checked){fb.className="condition-feedback bad";fb.textContent="답을 하나 선택하세요.";return}
  const selected=Number(checked.value),correct=conditionState.derived.answer,ok=Math.abs(selected-correct)<1e-9;
  $$(".condition-option").forEach(label=>{
    const value=Number(label.querySelector("input").value);
    if(Math.abs(value-correct)<1e-9)label.classList.add("correct");
    else if(Math.abs(value-selected)<1e-9)label.classList.add("wrong");
  });
  conditionState.attempts++;if(ok)conditionState.correct++;conditionState.choiceGraded=true;
  if(!ok)conditionStats.arithmetic.wrong++;
  conditionStats.arithmetic.tries++;
  fb.className="condition-feedback "+(ok?"good":"bad");
  fb.innerHTML=ok?"정답입니다. 과정 모드로 바꾸면 각 단계의 이해 여부도 확인할 수 있습니다.":
    `정답은 <b>${conditionNum(correct)}</b>입니다. ‘과정 풀기’로 전환하면 틀린 지점을 정확히 찾을 수 있습니다.`;
  updateConditionScore();renderConditionDiagnosis();
}
function renderConditionProcess(){
  const steps=conditionBuildSteps(conditionState.problem,conditionState.derived);
  $("#conditionProcessSteps").innerHTML=steps.map((s,i)=>{
    const active=i===conditionState.processIndex,done=conditionState.processDone[i],locked=i>conditionState.processIndex&&!done;
    return `<div class="condition-blank-step ${active?"active":""} ${done?"done":""}">
      <div><span class="step-tag">${i+1}단계 · ${s.label}</span></div>
      <div class="math-result">${s.prompt}</div>
      <div class="condition-input-row">
        <input class="condition-input" data-condition-input="${i}" ${locked||done?"disabled":""} placeholder="빈칸 입력">
        <span class="math-result">${s.suffix}</span>
        <button class="primary condition-check" data-condition-check="${i}" ${locked||done?"disabled":""}>확인</button>
        <button class="ghost condition-hint" data-condition-hint="${i}" ${locked||done?"disabled":""}>힌트</button>
      </div>
      <div id="conditionStepFeedback${i}" class="condition-feedback"></div>
    </div>`;
  }).join("");
  $$(".condition-check").forEach(b=>b.addEventListener("click",()=>checkConditionStep(Number(b.dataset.conditionCheck))));
  $$(".condition-hint").forEach(b=>b.addEventListener("click",()=>showConditionHint(Number(b.dataset.conditionHint))));
  $$(".condition-input").forEach(inp=>inp.addEventListener("keydown",e=>{if(e.key==="Enter")checkConditionStep(Number(inp.dataset.conditionInput))}));
  updateConditionProcessProgress();
}
function checkConditionStep(i){
  if(i!==conditionState.processIndex||conditionState.processDone[i])return;
  const steps=conditionBuildSteps(conditionState.problem,conditionState.derived),s=steps[i];
  const input=$(`[data-condition-input="${i}"]`),fb=$(`#conditionStepFeedback${i}`);
  conditionStats[s.category].tries++;
  const ok=s.type==="number"?conditionNumericEqual(input.value,s.answer):conditionExpressionEqual(input.value,s.answer);
  if(ok){
    conditionState.processDone[i]=true;conditionState.processIndex++;
    fb.className="condition-feedback good";fb.textContent="정답입니다.";
    if(conditionState.processIndex===steps.length){
      conditionState.attempts++;conditionState.correct++;
      $("#conditionFeedback").className="condition-feedback good";
      $("#conditionFeedback").innerHTML=`전 과정을 정확히 완성했습니다. 정답은 <b>${conditionNum(conditionState.derived.answer)}</b>입니다.`;
      $("#conditionExplanation").classList.remove("hidden");
      $("#conditionExplanation").innerHTML=conditionExplanationHTML(conditionState.problem,conditionState.derived);
    }
    setTimeout(()=>{renderConditionProcess();updateConditionScore();renderConditionDiagnosis();
      $(`[data-condition-input="${conditionState.processIndex}"]`)?.focus()},380);
  }else{
    conditionStats[s.category].wrong++;
    fb.className="condition-feedback bad";
    fb.textContent=`이 단계는 ‘${conditionCategoryInfo[s.category].label}’ 부분을 다시 확인해야 합니다. ${s.hint}`;
    renderConditionDiagnosis();
  }
}
function showConditionHint(i){
  const steps=conditionBuildSteps(conditionState.problem,conditionState.derived),fb=$(`#conditionStepFeedback${i}`);
  fb.className="condition-feedback hint";fb.textContent=steps[i].hint;
}
function updateConditionProcessProgress(){
  const n=conditionState.processDone.filter(Boolean).length,total=conditionState.processDone.length;
  $("#conditionProgressBar").style.width=`${total?n/total*100:0}%`;
  $("#conditionStepCount").textContent=`${n}/${total}`;
}
function updateConditionScore(){
  $("#conditionAttempts").textContent=conditionState.attempts;
  $("#conditionCorrect").textContent=conditionState.correct;
  $("#conditionAccuracy").textContent=conditionState.attempts?Math.round(conditionState.correct/conditionState.attempts*100)+"%":"0%";
}
function renderConditionDiagnosis(){
  $("#conditionDiagnosis").innerHTML=Object.entries(conditionCategoryInfo).map(([key,info])=>{
    const s=conditionStats[key],ok=s.wrong===0;
    const msg=s.tries===0?"아직 확인 전":ok?"현재까지 안정적":`${s.wrong}회 오류`;
    return `<div><b>${info.label}</b><div class="small">${info.desc}</div>
      <span class="condition-status ${ok?"ok":"warn"}">${msg}</span></div>`;
  }).join("");
}
