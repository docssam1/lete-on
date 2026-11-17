(function () {
  "use strict";
  const query = new URLSearchParams(location.search);
  const requestedCluster = query.get("cluster") || "6.SP.A";
  const sources = {
    "6.RP.A": window.GFIELDGrade6RPAUnitWorkbook,
    "6.NS.A": window.GFIELDGrade6NSAUnitWorkbook,
    "6.NS.B": window.GFIELDGrade6NSBUnitWorkbook,
    "6.NS.C": window.GFIELDGrade6NSCUnitWorkbook,
    "6.EE.A": window.GFIELDGrade6EEAUnitWorkbook,
    "6.EE.B": window.GFIELDGrade6EEBUnitWorkbook,
    "6.EE.C": window.GFIELDGrade6EECUnitWorkbook,
    "6.G.A": window.GFIELDGrade6GAUnitWorkbook,
    "6.SP.A": window.GFIELDGrade6SPAUnitWorkbook,
    "6.SP.B": window.GFIELDGrade6SPBUnitWorkbook,
    "7.RP.A": window.GFIELDGrade7RPAUnitWorkbook,
    "7.NS.A": window.GFIELDGrade7NSAUnitWorkbook
  };
  const source = sources[requestedCluster];
  if (!source) throw new Error("UNIT_WORKBOOK_SOURCE_MISSING");
  source.validatePack();
  const exactStandards = Array.from(new Set(source.pack.workbookItems.flatMap(function (item) { return item.standardIds || []; }))).sort();
  const standardOptions = Array.from(new Set(exactStandards.concat(exactStandards.map(function (standard) { return standard.replace(/(\d)[a-z]$/, "$1"); })))).sort();
  const requestedStandard = standardOptions.includes(query.get("standard")) ? query.get("standard") : "";
  function matchesStandard(item, standard) {
    return !standard || (item.standardIds || []).some(function (candidate) {
      return candidate === standard || (candidate.startsWith(standard) && /^[a-z]$/.test(candidate.slice(standard.length)));
    });
  }
  const completionKey = source.pack.completionKey || (["6.RP.A","6.NS.A","6.NS.B","6.NS.C","6.EE.A","6.EE.B","6.EE.C","6.G.A"].includes(source.pack.clusterId)?"gfield-unit-workbook:":"gfield-clinic-workbook:")+source.pack.clusterId+":v1";
  const progressKey = source.pack.clusterId === "7.NS.A" ? "gfield-unit-workbook-progress:7.NS.A:v1" : null;
  const workbookItemIds = new Set(source.pack.workbookItems.map(function (item) { return item.id; }));
  function savedCorrectIds() {
    if (!progressKey) return [];
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || "null");
      if (!saved || saved.schemaVersion !== 1 || saved.packId !== source.pack.id || !Array.isArray(saved.correctItemIds)) return [];
      return Array.from(new Set(saved.correctItemIds.filter(function (id) { return typeof id === "string" && workbookItemIds.has(id); })));
    } catch (_error) { return []; }
  }
  function savePracticeProgress() {
    if (!progressKey || state.audience !== "student") return;
    const correctItemIds = source.pack.workbookItems.filter(function (item) { return state.correct.has(item.id); }).map(function (item) { return item.id; });
    try {
      if (!correctItemIds.length) { localStorage.removeItem(progressKey); return; }
      const correctByStandard = {}, totalByStandard = {};
      standardOptions.forEach(function (standard) {
        const standardItems = source.pack.workbookItems.filter(function (item) { return matchesStandard(item, standard); });
        correctByStandard[standard] = standardItems.filter(function (item) { return state.correct.has(item.id); }).length;
        totalByStandard[standard] = standardItems.length;
      });
      localStorage.setItem(progressKey, JSON.stringify({ schemaVersion: 1, packId: source.pack.id, correctItemIds: correctItemIds, correctByStandard: correctByStandard, totalByStandard: totalByStandard }));
    } catch (_error) { /* The current page still shows session progress. */ }
  }
  function workbookCompleted() {
    try { return localStorage.getItem(completionKey) === "complete-v1" || (progressKey && savedCorrectIds().length === source.pack.workbookItems.length); }
    catch (_error) { return false; }
  }
  const requestedAudience = ["student","teacher"].includes(query.get("audience")) ? query.get("audience") : "student";
  const requestedMode = ["workbook","recheck"].includes(query.get("mode")) ? query.get("mode") : "workbook";
  const state = {
    cluster: requestedCluster,
    audience: requestedAudience,
    mode: requestedAudience === "student" && requestedMode === "recheck" && !workbookCompleted() ? "workbook" : requestedMode,
    locale: ["ko","en","zh-Hans"].includes(query.get("locale")) ? query.get("locale") : "ko",
    paper: ["A4","Letter"].includes(query.get("paper")) ? query.get("paper") : "A4",
    standard: requestedStandard,
    selected: new Map(),
    correct: new Set(requestedAudience === "student" ? savedCorrectIds() : [])
  };
  if (state.cluster !== source.pack.clusterId) throw new Error("UNIT_WORKBOOK_CLUSTER_UNSUPPORTED");

  const COPY = {
    ko:{ student:"학생용 · 단원 워크북",teacher:"교사용 · 지도서",studentEdition:"학생용",teacherEdition:"교사용",unit:"단원",recheck:"재확인",recheckLocked:"재확인은 단원 문항을 모두 맞힌 뒤 열립니다.",recheckEmpty:"이 기준에는 새 재확인 문항이 없어요. 전체 기준이나 다른 기준을 골라 주세요.",filteredUnit:"기준별 연습",filteredUnitNote:"해당 기준 문항 · 전체 단원 아님",filteredConceptNote:"개념은 전체 단원 · 문항만 기준별 필터",filteredRecheck:"기준별 재확인",filteredRecheckNote:"기준별 일부 재확인 · 전체 재확인 아님",partialHeadingSuffix:"· 선택 기준 일부",language:"언어",paper:"용지",standard:"기준",allStandards:"전체 기준",progress:"맞힌 문제",name:"이름",date:"날짜",class:"반",concept:"개념 학습",practice:"유형 연습",items:"문제",answer:"정답과 검산",teaching:"오답 지도",correct:"맞았습니다.",correctSaved:"이 기기에서 이전에 맞힌 문항이에요.",wrong:"다시 생각해 보세요.",check:"정답 확인",answerPlaceholder:"답 쓰기",record:"학습 기록 · 답안표",reflection:"내가 만든 조사 질문",reflectionPrompt:"우리 반에서 조사할 수 있고 학생마다 답이 달라질 수 있는 질문을 하나 만든 뒤, 어떤 자료를 모아야 하는지 쓰세요.",print:"워크북 인쇄 · PDF 저장",localProgress:"맞힌 문항 번호만 이 기기에 저장해요. 진단·등급·배정에는 쓰지 않아요.",clearProgress:"연습 기록 지우기",clearProgressConfirm:"이 기기의 7.NS.A 연습 기록을 지울까요? 재확인 잠금도 다시 적용돼요.",progressCleared:"이 기기의 7.NS.A 연습 표시를 지웠어요."},
    en:{ student:"Student · Unit Workbook",teacher:"Teacher · Guide",studentEdition:"Student",teacherEdition:"Teacher",unit:"Unit",recheck:"Recheck",recheckLocked:"Recheck opens after all unit items are correct.",recheckEmpty:"There are no new recheck items for this standard. Choose all standards or another standard.",filteredUnit:"Standard practice",filteredUnitNote:"Selected standard items · Not the full unit",filteredConceptNote:"Concepts cover the full unit · Only practice items are filtered",filteredRecheck:"Standard recheck",filteredRecheckNote:"Partial recheck · Not the full recheck",partialHeadingSuffix:"· selected standard only",language:"Language",paper:"Paper",standard:"Standard",allStandards:"All standards",progress:"Items correct",name:"Name",date:"Date",class:"Class",concept:"Concept Lesson",practice:"Practice",items:"items",answer:"Answer and check",teaching:"Teaching move",correct:"Correct.",correctSaved:"This item was previously marked correct on this device.",wrong:"Think again.",check:"Check answer",answerPlaceholder:"Write answer",record:"Learning Record · Answer Sheet",reflection:"My Statistical Question",reflectionPrompt:"Write one statistical question about your class. Then state which answer could vary from student to student.",print:"Print Workbook · Save PDF",localProgress:"Correct item numbers are saved on this device only. They are not diagnostic, a grade, or placement.",clearProgress:"Clear practice record",clearProgressConfirm:"Clear the Grade 7 NS.A practice record on this device? This will lock recheck again.",progressCleared:"Grade 7 NS.A practice marks cleared on this device."},
    "zh-Hans":{ student:"学生版 · 单元练习册",teacher:"教师版 · 教学指南",studentEdition:"学生版",teacherEdition:"教师版",unit:"单元",recheck:"复测",recheckLocked:"完成单元全部题目并答对后，才能开始复测。",recheckEmpty:"此标准没有新的复测题。请选择全部标准或其他标准。",filteredUnit:"标准练习",filteredUnitNote:"所选标准的题目 · 并非完整单元",filteredConceptNote:"概念覆盖整个单元 · 仅筛选练习题",filteredRecheck:"按标准复测",filteredRecheckNote:"按标准部分复测 · 并非完整复测",partialHeadingSuffix:"· 所选标准的部分题目",language:"语言",paper:"纸张",standard:"标准",allStandards:"全部标准",progress:"答对题数",name:"姓名",date:"日期",class:"班级",concept:"概念学习",practice:"分类练习",items:"题",answer:"答案与核验",teaching:"教学提示",correct:"正确。",correctSaved:"此设备之前记录为答对的题目。",wrong:"请再想一想。",check:"核验答案",answerPlaceholder:"填写答案",record:"学习记录 · 答题表",reflection:"我提出的调查问题",reflectionPrompt:"提出一个适合在班里调查、而且答案可能因学生而不同的问题，并写出需要收集的数据。",print:"打印练习册 · 保存PDF",localProgress:"只在此设备保存答对题号，不用于诊断、评级或课程分班。",clearProgress:"清除练习记录",clearProgressConfirm:"清除此设备保存的七年级 NS.A 练习记录吗？清除后将重新锁定复测。",progressCleared:"已清除此设备上的七年级 NS.A 练习标记。"}
  };
  function c() { return COPY[state.locale]; }
  function activeItems() {
    const items = state.mode === "workbook" ? source.pack.workbookItems : source.pack.recheckItems;
    return items.filter(function (item) { return matchesStandard(item, state.standard); });
  }
  function filteredScopeText() {
    if (!state.standard) return "";
    return (state.mode === "recheck" ? c().filteredRecheckNote : c().filteredUnitNote) + " · " + state.standard;
  }
  function recheckLockedMessage() {
    if(state.locale==="en") return "Recheck opens after all "+source.pack.workbookItems.length+" unit items are correct.";
    if(state.locale==="zh-Hans") return "完成单元"+source.pack.workbookItems.length+"题并全部答对后，才能开始复测。";
    return "재확인은 단원 "+source.pack.workbookItems.length+"문항을 모두 맞힌 뒤 열립니다.";
  }
  function text(value) { return value && (value[state.locale] || value.en || value.ko) || ""; }
  function el(tag, className, value) { const node=document.createElement(tag); if(className) node.className=className; if(value!=null) node.textContent=value; return node; }
  function fractionLabel(numerator,denominator) {
    if(state.locale==="ko") return denominator+"분의 "+numerator;
    if(state.locale==="zh-Hans") return denominator+"分之"+numerator;
    return numerator+" over "+denominator;
  }
  function mathFraction(numerator,denominator,factor) {
    const ns="http://www.w3.org/1998/Math/MathML";
    const math=document.createElementNS(ns,"math"),row=document.createElementNS(ns,"mrow"),negative=/^[-−]/.test(numerator),signLabel=negative?(state.locale==="ko"?"음의 ":state.locale==="zh-Hans"?"负":"negative "):""; math.classList.add("math-inline-fraction"); math.setAttribute("display","inline"); math.setAttribute("aria-label",signLabel+fractionLabel(numerator.replace(/^[-−]/,""),denominator)+(factor?" × "+factor:""));row.classList.add("math-fraction-row");
    const fraction=document.createElementNS(ns,"mfrac");
    function number(value){const row=document.createElementNS(ns,"mrow"),numberNode=document.createElementNS(ns,"mn");numberNode.textContent=value.replace(/^[-−]/,"");row.append(numberNode);return row;}
    if(negative){const minus=document.createElementNS(ns,"mo"),space=document.createElementNS(ns,"mspace");minus.textContent="−";minus.classList.add("math-fraction-sign");minus.setAttribute("form","prefix");minus.setAttribute("lspace","0em");minus.setAttribute("rspace","0em");space.classList.add("math-fraction-sign-gap");space.setAttribute("width","0.2em");row.append(minus,space);}
    fraction.append(number(numerator),number(denominator)); row.append(fraction); if(factor){const identifier=document.createElementNS(ns,"mi");identifier.textContent=factor;row.append(identifier);} math.append(row);return math;
  }
  function repeatingBlock(value) {
    const digits=String(value).replace(/\u0305/g,""),span=el("span","math-repeating-block",digits);span.dataset.repeatBlock=digits;
    span.setAttribute("aria-label",state.locale==="ko"?"반복되는 숫자 묶음 "+digits:state.locale==="zh-Hans"?"循环节"+digits:"repeating block "+digits);return span;
  }
  function formalMathText(value) {
    return String(value).replace(/(^|[\s(=:+×÷,])-(?=\d)/g,"$1−");
  }
  function appendMathText(node,value) {
    const content=String(value==null?"":value),pattern=/([−-]?\d+)\s*([xX])\s*\/\s*([1-9]\d*)|([−-]?\d+)\s*\/\s*([1-9]\d*)|((?:\d\u0305)+)/g; let cursor=0,match;
    while((match=pattern.exec(content))){if(match.index>cursor)node.append(document.createTextNode(formalMathText(content.slice(cursor,match.index))));node.append(match[1]?mathFraction(match[1],match[3],match[2]):match[4]?mathFraction(match[4],match[5]):repeatingBlock(match[6]));cursor=pattern.lastIndex;}
    if(cursor<content.length)node.append(document.createTextNode(formalMathText(content.slice(cursor)))); return node;
  }
  function mathEl(tag,className,value){return appendMathText(el(tag,className),value);}
  function upgradeMathFractions(root) {
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); const candidates=[]; let current;
    while((current=walker.nextNode()))if(/([−-]?\d+)\s*\/\s*([1-9]\d*)/.test(current.nodeValue||"")&&!current.parentElement.closest("svg"))candidates.push(current);
    candidates.forEach(function(textNode){const fragment=document.createDocumentFragment();appendMathText(fragment,textNode.nodeValue);textNode.replaceWith(fragment);});
  }
  function setUrl() {
    const url=new URL(location.href);
    const study=url.searchParams.get("study");
    const studyGrade=url.searchParams.get("studyGrade");
    url.search="";
    if(study==="1"){
      url.searchParams.set("study","1");
      if(studyGrade) url.searchParams.set("studyGrade",studyGrade);
    }
    Object.entries(state).forEach(function(entry){ if(["selected","correct","cluster","standard"].includes(entry[0])) return; url.searchParams.set(entry[0],entry[1]); });
    url.searchParams.set("cluster",state.cluster);
    if(state.standard) url.searchParams.set("standard",state.standard); else url.searchParams.delete("standard");
    history.replaceState({},"",url);
  }
  function page(number, className) { const node=el("section","book-page "+(className||"")); node.dataset.pageNumber=String(number); return node; }
  function syncModeControls() {
    const locked = state.audience === "student" && !workbookCompleted();
    const workbookCount = source.pack.workbookItems.filter(function (item) { return matchesStandard(item, state.standard); }).length;
    const recheckCount = source.pack.recheckItems.filter(function (item) { return matchesStandard(item, state.standard); }).length;
    document.querySelectorAll("[data-mode]").forEach(function(button){
      const isRecheck = button.dataset.mode === "recheck";
      button.textContent = (isRecheck ? (state.standard ? c().filteredRecheck : c().recheck) : (state.standard ? c().filteredUnit : c().unit)) + " " + (isRecheck ? recheckCount : workbookCount);
      button.disabled = isRecheck && (locked || recheckCount === 0);
      button.setAttribute("aria-pressed",String(button.dataset.mode===state.mode));
      if (isRecheck && locked) button.title = recheckLockedMessage();
      else if (isRecheck && recheckCount === 0) button.title = c().recheckEmpty;
      else button.removeAttribute("title");
    });
  }
  function syncStandardFilter() {
    const wrapper = document.getElementById("standard-filter-wrap");
    const select = document.getElementById("standard-filter");
    wrapper.hidden = standardOptions.length <= 1;
    document.getElementById("standard-filter-label").textContent = c().standard;
    select.replaceChildren();
    const all = document.createElement("option"); all.value = ""; all.textContent = c().allStandards; select.append(all);
    standardOptions.forEach(function (standard) { const option = document.createElement("option"); option.value = standard; option.textContent = standard; select.append(option); });
    select.value = state.standard;
  }
  function updateProgress() {
    const active=activeItems();
    const progress=document.getElementById("progress-chip");
    progress.hidden=active.length===0;
    progress.textContent=active.filter(function (item) { return state.correct.has(item.id); }).length+" / "+active.length;
    progress.setAttribute("aria-label",c().progress+" "+progress.textContent);
  }
  function renderCover(pageNumber) {
    const node=page(pageNumber,"book-cover");
    const gradeMatch=/^(\d+)\./.exec(String(source.pack.clusterId||source.pack.standardRange||""));
    const gradeLabel=gradeMatch?"US GRADE "+gradeMatch[1]:"US CORE MATH";
    node.append(el("p","page-kicker","GFIELD MATH · "+gradeLabel+" · "+source.pack.standardRange),el("h1","",text(source.pack.title)),mathEl("p","book-subtitle",text(source.pack.subtitle)),el("div","cover-rule"));
    if(state.standard) node.append(el("p","scope-notice filtered-scope-notice",filteredScopeText()));
    const grid=el("div","cover-grid");
    [[c().name,""],[c().class,""],[c().date,""]].forEach(function(entry){ const box=el("div"); box.append(el("span","",entry[0]),el("strong","","")); grid.append(box); });
    node.append(grid);
    const notice=mathEl("p","scope-notice",text(source.pack.scopeNotice)); node.append(notice); return node;
  }
  function renderConcepts(pageNumber) {
    const node=page(pageNumber,"concept-page");
    node.id="unit-concepts";
    node.append(el("p","page-kicker",c().concept+" · "+source.pack.clusterId),mathEl("h2","",text(source.pack.subtitle)));
    const grid=el("div","concept-grid");
    source.pack.conceptPages.forEach(function(concept,index){ const card=el("article","concept-card"); card.append(el("span","concept-number",String(index+1)),mathEl("h3","",text(concept.title)),mathEl("p","",text(concept.body)),mathEl("p","concept-example",text(concept.example))); grid.append(card); });
    node.append(grid);
    if(state.audience==="teacher") node.append(mathEl("div","teacher-observation",text(source.pack.teacherObservation)));
    return node;
  }
  function renderProblem(problem,index) {
    const card=el("article","book-problem"); card.dataset.itemId=problem.id;
    const meta=el("div","problem-meta"); meta.append(el("span","",String(index+1).padStart(2,"0")),el("span","",text(source.pack.strands[problem.strand])));
    card.append(meta,mathEl("p","problem-prompt",text(problem.prompt)));
    const visualMarkup=typeof source.renderVisual==="function"?source.renderVisual(problem,state.locale,state.audience):"";
    if(visualMarkup){const visual=el("div","problem-visual");visual.innerHTML=visualMarkup;upgradeMathFractions(visual);card.append(visual);}
    const restored=state.selected.get(problem.id);
    function recordResult(response,control){
      state.selected.set(problem.id,response);
      const feedback=card.querySelector(".choice-feedback");
      if(source.evaluateResponse(problem,response)){
        state.correct.add(problem.id); savePracticeProgress(); if(control) control.classList.add("is-correct"); feedback.className="choice-feedback correct"; feedback.textContent=c().correct;
        if(state.mode==="workbook"&&source.pack.workbookItems.every(function (item) { return state.correct.has(item.id); })){try{localStorage.setItem(completionKey,"complete-v1");}catch(_error){/* session progress remains visible */}syncModeControls();}
      }else{state.correct.delete(problem.id);savePracticeProgress();if(control)control.classList.remove("is-correct");feedback.className="choice-feedback wrong";feedback.replaceChildren();appendMathText(feedback,c().wrong+" "+source.hintFor(problem,state.locale));}
      updateProgress();
    }
    if(state.audience==="student"&&Array.isArray(problem.choices)){
      const choices=el("div","choice-list");
      problem.choices.forEach(function(choice,choiceIndex){const button=el("button","choice-button");const label=mathEl("span","choice-label",text(choice.label));button.append(label);button.type="button";button.dataset.choice=String.fromCharCode(65+choiceIndex);button.dataset.answerId=choice.id;const selected=restored===choice.id;button.classList.toggle("is-selected",selected);button.classList.toggle("is-correct",selected&&source.evaluateResponse(problem,choice.id));button.addEventListener("click",function(){card.querySelectorAll(".choice-button").forEach(function(node){node.classList.toggle("is-selected",node===button);node.classList.remove("is-correct");});recordResult(choice.id,button);});choices.append(button);});
      card.append(choices);
    }else if(state.audience==="student"){
      const responseRow=el("div","answer-row screen-answer");const input=el("input","answer-input");input.type="text";input.inputMode=["ratio-pair","decimal-or-fraction"].includes(problem.responseFormat)?"text":"decimal";input.placeholder=c().answerPlaceholder;input.setAttribute("aria-label",String(index+1)+" "+c().answerPlaceholder);input.autocomplete="off";input.spellcheck=false;input.value=restored||"";const button=el("button","check-button",c().check);button.type="button";button.addEventListener("click",function(){if(!input.value.trim()){const feedback=card.querySelector(".choice-feedback");feedback.className="choice-feedback wrong";feedback.textContent=c().answerPlaceholder;input.focus();return;}recordResult(input.value.trim(),input);if(source.evaluateResponse(problem,input.value.trim())){input.disabled=true;button.disabled=true;}});input.addEventListener("keydown",function(event){if(event.key==="Enter")button.click();});responseRow.append(input,button);card.append(responseRow,el("div","print-answer-line",c().answerPlaceholder));
    }
    if(state.audience==="student"){
      const feedback=el("p","choice-feedback","");if(restored&&source.evaluateResponse(problem,restored)){feedback.className="choice-feedback correct";feedback.textContent=c().correct;}else if(restored){feedback.className="choice-feedback wrong";appendMathText(feedback,c().wrong+" "+source.hintFor(problem,state.locale));}else if(state.correct.has(problem.id)){feedback.className="choice-feedback correct";feedback.textContent=c().correctSaved;}card.append(feedback);
    }else{
      const answerValue=Array.isArray(problem.choices)&&typeof source.choiceLabel==="function"?source.choiceLabel(problem,source.solveItem(problem),state.locale):source.formatResult(problem)+(text(problem.unit)?" "+text(problem.unit):"");
      const answer=el("div","teacher-key"),answerHeading=mathEl("strong","",c().answer+" · "+answerValue);answer.append(answerHeading);appendMathText(answer,source.solutionFor(problem,state.locale));
      const move=el("div","teacher-move");move.append(el("strong","",c().teaching+" · "));appendMathText(move,source.hintFor(problem,state.locale));card.append(answer,move);
    }
    return card;
  }
  function renderPracticePages(startPage,items) {
    let perPage=state.audience==="teacher"?2:source.pack.printPlan.itemsPerPracticePage;if(state.paper==="Letter"&&state.mode==="recheck"&&state.cluster==="7.NS.A")perPage=2; const pages=[];
    for(let offset=0;offset<items.length;offset+=perPage){
      const slice=items.slice(offset,offset+perPage); const node=page(startPage+pages.length,"practice-page"); const section=slice[0].section;
      const head=el("header","practice-heading"); head.append(el("div","",null),el("span","",(offset+1)+"-"+(offset+slice.length)+" / "+items.length+" "+c().items));
      const heading=el("h2","",text(source.pack.ui.sectionLabels[section]));if(state.mode==="recheck"&&state.standard)heading.append(document.createTextNode(" "+c().partialHeadingSuffix));
      head.firstChild.append(el("p","page-kicker",c().practice+" · "+source.pack.clusterId),heading); node.append(head);
      const list=el("div","problem-list"); slice.forEach(function(problem,index){list.append(renderProblem(problem,offset+index));}); node.append(list); pages.push(node);
    }
    return pages;
  }
  function renderRecord(pageNumber,items) {
    const node=page(pageNumber,"record-page"); node.append(el("p","page-kicker",source.pack.clusterId+" · "+c().record),el("h2","",c().record));
    const grid=el("div","record-grid");
    for(let col=0;col<4;col+=1){const column=el("div","record-column"); items.slice(col*9,col*9+9).forEach(function(problem,index){const row=el("div","record-row"); row.append(el("span","",String(col*9+index+1).padStart(2,"0")),el("span","","○ △ ×")); column.append(row);}); grid.append(column);} node.append(grid);
    const reflection=el("section","reflection-box"); reflection.append(el("h3","",source.pack.reflection?text(source.pack.reflection):c().reflection),el("p","",source.pack.reflectionPrompt?text(source.pack.reflectionPrompt):c().reflectionPrompt),el("div","reflection-lines")); node.append(reflection); return node;
  }
  let renderRevision=0;
  function render() {
    const currentRender=++renderRevision;
    setUrl(); document.documentElement.lang=state.locale; document.body.classList.toggle("paper-letter",state.paper==="Letter"); document.body.dataset.audience=state.audience;
    const tracksLocalProgress=Boolean(progressKey)&&state.audience==="student";
    const progressNote=document.getElementById("local-progress-note"),clearProgressButton=document.getElementById("clear-local-progress");
    progressNote.hidden=!tracksLocalProgress; progressNote.textContent=tracksLocalProgress?c().localProgress:"";
    clearProgressButton.hidden=!tracksLocalProgress; clearProgressButton.textContent=tracksLocalProgress?c().clearProgress:"";
    let pageStyle=document.getElementById("dynamic-page-size"); if(!pageStyle){pageStyle=document.createElement("style"); pageStyle.id="dynamic-page-size"; document.head.append(pageStyle);} pageStyle.textContent="@page { size: "+state.paper+"; margin: 0; }";
    const printButton=document.getElementById("print-book"); printButton.disabled=true; printButton.dataset.ready="false"; printButton.dataset.readyPaper=""; printButton.dataset.empty="false";
    document.title=text(source.pack.title)+" · GFIELD Math"; const conceptLink=document.getElementById("concept-link");conceptLink.href=source.pack.conceptDelivery==="embedded"?(state.mode==="workbook"?"#unit-concepts":"./unit-workbook.html?audience="+encodeURIComponent(state.audience)+"&mode=workbook&locale="+encodeURIComponent(state.locale)+"&paper="+encodeURIComponent(state.paper)+"&cluster="+encodeURIComponent(state.cluster)+(state.standard?"&standard="+encodeURIComponent(state.standard):"")+"#unit-concepts"):"./concept-learning.html?cluster="+encodeURIComponent(state.cluster)+"&from=diagnostic"; document.getElementById("role-chip").textContent=state.audience==="teacher"?c().teacher:c().student; document.getElementById("edition-label").textContent=state.audience==="teacher"?c().teacherEdition:c().studentEdition; printButton.textContent=c().print;
    syncModeControls(); syncStandardFilter();
    document.getElementById("locale-label").textContent=c().language; document.getElementById("paper-label").textContent=c().paper;
    document.getElementById("locale-select").value=state.locale; document.getElementById("paper-select").value=state.paper; updateProgress();
    const host=document.getElementById("book-content"); host.replaceChildren(); const items=activeItems();
    const emptyStatus=document.getElementById("workbook-status");if(items.length&&emptyStatus.textContent)emptyStatus.textContent="";printButton.removeAttribute("aria-describedby");
    if(!items.length){printButton.dataset.empty="true";const empty=el("p","standard-empty",c().recheckEmpty);empty.id="recheck-empty-message";if(emptyStatus.textContent!==c().recheckEmpty)emptyStatus.textContent=c().recheckEmpty;printButton.setAttribute("aria-describedby",empty.id);host.append(empty);return;}
    let number=1; host.append(renderCover(number++));
    if(state.mode==="workbook") host.append(renderConcepts(number++));
    const practice=renderPracticePages(number,items); practice.forEach(function(node){host.append(node);}); number+=practice.length;
    if(state.mode==="workbook"&&state.audience==="student") host.append(renderRecord(number++,items));
    if(state.standard)host.querySelectorAll(".book-page:not(.book-cover)").forEach(function(pageNode){const scope=pageNode.classList.contains("concept-page")?c().filteredConceptNote+" · "+state.standard:filteredScopeText();pageNode.prepend(el("p","standard-page-label",scope));});
    void host.offsetHeight;const printHeading=host.querySelector(".book-page h2"),printFont=printHeading?getComputedStyle(printHeading).font:"",fontLoad=document.fonts&&document.fonts.load?document.fonts.load(printFont):Promise.resolve();Promise.resolve(fontLoad).then(function(){return document.fonts&&document.fonts.ready?document.fonts.ready:undefined;}).then(function(){if(currentRender!==renderRevision||printButton.dataset.empty==="true")return;printButton.dataset.readyPaper=state.paper;printButton.disabled=false;printButton.dataset.ready="true";});
  }
  function update(key,value){if(key==="mode"){state.selected.clear();if(!progressKey||state.audience!=="student")state.correct.clear();}state[key]=value; render(); if(document.getElementById("print-book").dataset.empty!=="true")document.getElementById("book-content").focus({preventScroll:true});}
  document.querySelectorAll("[data-mode]").forEach(function(button){button.addEventListener("click",function(){update("mode",button.dataset.mode);});});
  document.getElementById("locale-select").addEventListener("change",function(event){update("locale",event.target.value);});
  document.getElementById("paper-select").addEventListener("change",function(event){update("paper",event.target.value);});
  document.getElementById("standard-filter").addEventListener("change",function(event){update("standard",event.target.value);});
  document.getElementById("clear-local-progress").addEventListener("click",function(){if(!progressKey||!window.confirm(c().clearProgressConfirm))return;state.correct.clear();state.selected.clear();try{localStorage.removeItem(progressKey);localStorage.removeItem(completionKey);}catch(_error){}if(state.mode==="recheck")state.mode="workbook";render();document.getElementById("workbook-status").textContent=c().progressCleared;});
  document.getElementById("print-book").addEventListener("click",function(){window.print();});
  render();
})();
