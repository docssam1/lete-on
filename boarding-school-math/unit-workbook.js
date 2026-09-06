(function () {
  "use strict";
  const source = window.GFIELDGrade6SPAUnitWorkbook;
  if (!source) throw new Error("UNIT_WORKBOOK_SOURCE_MISSING");
  source.validatePack();

  const query = new URLSearchParams(location.search);
  const completionKey = "gfield-clinic-workbook:"+source.pack.clusterId+":v1";
  function workbookCompleted() {
    try { return localStorage.getItem(completionKey) === "complete-v1"; }
    catch (_error) { return false; }
  }
  const requestedAudience = ["student","teacher"].includes(query.get("audience")) ? query.get("audience") : "student";
  const requestedMode = ["workbook","recheck"].includes(query.get("mode")) ? query.get("mode") : "workbook";
  const state = {
    cluster: query.get("cluster") || "6.SP.A",
    audience: requestedAudience,
    mode: requestedAudience === "student" && requestedMode === "recheck" && !workbookCompleted() ? "workbook" : requestedMode,
    locale: ["ko","en","zh-Hans"].includes(query.get("locale")) ? query.get("locale") : "ko",
    paper: ["A4","Letter"].includes(query.get("paper")) ? query.get("paper") : "A4",
    selected: new Map(),
    correct: new Set()
  };
  if (state.cluster !== source.pack.clusterId) throw new Error("UNIT_WORKBOOK_CLUSTER_UNSUPPORTED");

  const COPY = {
    ko:{ student:"학생용 · 단원 워크북",teacher:"교사용 · 지도서",studentEdition:"학생용",teacherEdition:"교사용",unit:"단원 워크북",recheck:"재확인",unitTab:"단원 36",recheckTab:"재확인 8",recheckLocked:"재확인은 단원 36문항을 모두 맞힌 뒤 열립니다.",language:"언어",paper:"용지",progress:"맞힌 문제",name:"이름",date:"날짜",class:"반",concept:"개념 학습",practice:"유형 연습",items:"문제",answer:"정답과 검산",teaching:"오답 지도",correct:"맞았습니다.",wrong:"다시 생각해 보세요.",record:"학습 기록 · 답안표",reflection:"내가 만든 통계적 질문",reflectionPrompt:"우리 반에서 조사할 수 있는 통계적 질문을 하나 만들고, 사람마다 어떤 답이 달라질지 쓰세요.",print:"워크북 인쇄 · PDF 저장"},
    en:{ student:"Student · Unit Workbook",teacher:"Teacher · Guide",studentEdition:"Student",teacherEdition:"Teacher",unit:"Unit Workbook",recheck:"Recheck",unitTab:"Unit 36",recheckTab:"Recheck 8",recheckLocked:"Recheck opens after all 36 unit items are correct.",language:"Language",paper:"Paper",progress:"Items correct",name:"Name",date:"Date",class:"Class",concept:"Concept Lesson",practice:"Practice",items:"items",answer:"Answer and check",teaching:"Teaching move",correct:"Correct.",wrong:"Think again.",record:"Learning Record · Answer Sheet",reflection:"My Statistical Question",reflectionPrompt:"Write one statistical question about your class. Then state which answer could vary from student to student.",print:"Print Workbook · Save PDF"},
    "zh-Hans":{ student:"学生版 · 单元练习册",teacher:"教师版 · 教学指南",studentEdition:"学生版",teacherEdition:"教师版",unit:"单元练习册",recheck:"复测",unitTab:"单元 36",recheckTab:"复测 8",recheckLocked:"完成单元36题并全部答对后，才能开始复测。",language:"语言",paper:"纸张",progress:"答对题数",name:"姓名",date:"日期",class:"班级",concept:"概念学习",practice:"分类练习",items:"题",answer:"答案与核验",teaching:"教学提示",correct:"正确。",wrong:"请再想一想。",record:"学习记录 · 答题表",reflection:"我提出的统计问题",reflectionPrompt:"提出一个可以在班上调查的统计问题，并说明哪些答案会因学生而不同。",print:"打印练习册 · 保存PDF"}
  };
  function c() { return COPY[state.locale]; }
  function text(value) { return value && (value[state.locale] || value.en || value.ko) || ""; }
  function el(tag, className, value) { const node=document.createElement(tag); if(className) node.className=className; if(value!=null) node.textContent=value; return node; }
  function setUrl() {
    const url=new URL(location.href); url.search="";
    Object.entries(state).forEach(function(entry){ if(["selected","correct","cluster"].includes(entry[0])) return; url.searchParams.set(entry[0],entry[1]); });
    url.searchParams.set("cluster",state.cluster); history.replaceState({},"",url);
  }
  function page(number, className) { const node=el("section","book-page "+(className||"")); node.dataset.pageNumber=String(number); return node; }
  function syncModeControls() {
    const locked = state.audience === "student" && !workbookCompleted();
    document.querySelectorAll("[data-mode]").forEach(function(button){
      const isRecheck = button.dataset.mode === "recheck";
      button.textContent = isRecheck ? c().recheckTab : c().unitTab;
      button.disabled = isRecheck && locked;
      button.setAttribute("aria-pressed",String(button.dataset.mode===state.mode));
      if (isRecheck && locked) button.title = c().recheckLocked;
      else button.removeAttribute("title");
    });
  }
  function updateProgress() {
    const active=state.mode==="workbook"?source.pack.workbookItems:source.pack.recheckItems;
    const progress=document.getElementById("progress-chip");
    progress.textContent=state.correct.size+" / "+active.length;
    progress.setAttribute("aria-label",c().progress+" "+progress.textContent);
  }
  function renderCover(pageNumber) {
    const node=page(pageNumber,"book-cover");
    node.append(el("p","page-kicker","GFIELD MATH · US GRADE 6 · "+source.pack.standardRange),el("h1","",text(source.pack.title)),el("p","book-subtitle",text(source.pack.subtitle)),el("div","cover-rule"));
    const grid=el("div","cover-grid");
    [[c().name,""],[c().class,""],[c().date,""]].forEach(function(entry){ const box=el("div"); box.append(el("span","",entry[0]),el("strong","","")); grid.append(box); });
    node.append(grid);
    const notice=el("p","scope-notice",text(source.pack.scopeNotice)); node.append(notice); return node;
  }
  function renderConcepts(pageNumber) {
    const node=page(pageNumber,"concept-page");
    node.append(el("p","page-kicker",c().concept+" · "+source.pack.clusterId),el("h2","",text(source.pack.subtitle)));
    const grid=el("div","concept-grid");
    source.pack.conceptPages.forEach(function(concept,index){ const card=el("article","concept-card"); card.append(el("span","concept-number",String(index+1)),el("h3","",text(concept.title)),el("p","",text(concept.body)),el("p","concept-example",text(concept.example))); grid.append(card); });
    node.append(grid);
    if(state.audience==="teacher") node.append(el("div","teacher-observation",text(source.pack.teacherObservation)));
    return node;
  }
  function renderProblem(problem,index) {
    const card=el("article","book-problem"); card.dataset.itemId=problem.id;
    const meta=el("div","problem-meta"); meta.append(el("span","",String(index+1).padStart(2,"0")),el("span","",text(source.pack.strands[problem.strand])));
    card.append(meta,el("p","problem-prompt",text(problem.prompt)));
    const visual=el("div","problem-visual"); visual.innerHTML=source.renderVisual(problem,state.locale); card.append(visual);
    const choices=el("div","choice-list");
    problem.choices.forEach(function(choice,choiceIndex){ const button=el("button","choice-button",text(choice.label)); button.type="button"; button.dataset.choice=String.fromCharCode(65+choiceIndex); button.dataset.answerId=choice.id; button.disabled=state.audience==="teacher"; const restored=state.selected.get(problem.id)===choice.id; button.classList.toggle("is-selected",restored); button.classList.toggle("is-correct",restored&&source.evaluateResponse(problem,choice.id)); button.addEventListener("click",function(){
      state.selected.set(problem.id,choice.id); card.querySelectorAll(".choice-button").forEach(function(node){ node.classList.toggle("is-selected",node===button); node.classList.remove("is-correct"); });
      const feedback=card.querySelector(".choice-feedback");
      if(source.evaluateResponse(problem,choice.id)){
        state.correct.add(problem.id); button.classList.add("is-correct"); feedback.className="choice-feedback correct"; feedback.textContent=c().correct;
        const active=state.mode==="workbook"?source.pack.workbookItems:source.pack.recheckItems;
        updateProgress();
        if(state.mode==="workbook"&&state.correct.size===active.length){ try{localStorage.setItem(completionKey,"complete-v1");}catch(_error){/* session progress remains visible */} syncModeControls(); }
      }
      else { state.correct.delete(problem.id); feedback.className="choice-feedback wrong"; feedback.textContent=c().wrong+" "+source.hintFor(problem,state.locale); updateProgress(); }
    }); choices.append(button); });
    card.append(choices);
    if(state.audience==="student") {
      const feedback=el("p","choice-feedback",""); const restored=state.selected.get(problem.id);
      if(restored&&source.evaluateResponse(problem,restored)){feedback.className="choice-feedback correct"; feedback.textContent=c().correct;}
      else if(restored){feedback.className="choice-feedback wrong"; feedback.textContent=c().wrong+" "+source.hintFor(problem,state.locale);}
      card.append(feedback);
    }
    else {
      const answer=el("div","teacher-key"); answer.append(el("strong","",c().answer+" · "+source.choiceLabel(problem,source.solveItem(problem),state.locale)),document.createTextNode(source.solutionFor(problem,state.locale)));
      const move=el("div","teacher-move"); move.append(el("strong","",c().teaching+" · "),document.createTextNode(source.hintFor(problem,state.locale))); card.append(answer,move);
    }
    return card;
  }
  function renderPracticePages(startPage,items) {
    const perPage=state.audience==="teacher"?2:source.pack.printPlan.itemsPerPracticePage; const pages=[];
    for(let offset=0;offset<items.length;offset+=perPage){
      const slice=items.slice(offset,offset+perPage); const node=page(startPage+pages.length,"practice-page"); const section=slice[0].section;
      const head=el("header","practice-heading"); head.append(el("div","",null),el("span","",(offset+1)+"-"+(offset+slice.length)+" / "+items.length+" "+c().items));
      head.firstChild.append(el("p","page-kicker",c().practice+" · "+source.pack.clusterId),el("h2","",text(source.pack.ui.sectionLabels[section]))); node.append(head);
      const list=el("div","problem-list"); slice.forEach(function(problem,index){list.append(renderProblem(problem,offset+index));}); node.append(list); pages.push(node);
    }
    return pages;
  }
  function renderRecord(pageNumber,items) {
    const node=page(pageNumber,"record-page"); node.append(el("p","page-kicker",source.pack.clusterId+" · "+c().record),el("h2","",c().record));
    const grid=el("div","record-grid");
    for(let col=0;col<4;col+=1){const column=el("div","record-column"); items.slice(col*9,col*9+9).forEach(function(problem,index){const row=el("div","record-row"); row.append(el("span","",String(col*9+index+1).padStart(2,"0")),el("span","","○ △ ×")); column.append(row);}); grid.append(column);} node.append(grid);
    const reflection=el("section","reflection-box"); reflection.append(el("h3","",c().reflection),el("p","",c().reflectionPrompt),el("div","reflection-lines")); node.append(reflection); return node;
  }
  function render() {
    setUrl(); document.documentElement.lang=state.locale; document.body.classList.toggle("paper-letter",state.paper==="Letter"); document.body.dataset.audience=state.audience;
    let pageStyle=document.getElementById("dynamic-page-size"); if(!pageStyle){pageStyle=document.createElement("style"); pageStyle.id="dynamic-page-size"; document.head.append(pageStyle);} pageStyle.textContent="@page { size: "+state.paper+"; margin: 0; }";
    const printButton=document.getElementById("print-book"); printButton.disabled=true; printButton.dataset.ready="false";
    document.title=text(source.pack.title)+" · GFIELD Math"; document.getElementById("role-chip").textContent=state.audience==="teacher"?c().teacher:c().student; document.getElementById("edition-label").textContent=state.audience==="teacher"?c().teacherEdition:c().studentEdition; printButton.textContent=c().print;
    syncModeControls();
    document.getElementById("locale-label").textContent=c().language; document.getElementById("paper-label").textContent=c().paper;
    document.getElementById("locale-select").value=state.locale; document.getElementById("paper-select").value=state.paper; updateProgress();
    const host=document.getElementById("book-content"); host.replaceChildren(); const items=state.mode==="workbook"?source.pack.workbookItems:source.pack.recheckItems;
    let number=1; host.append(renderCover(number++));
    if(state.mode==="workbook") host.append(renderConcepts(number++));
    const practice=renderPracticePages(number,items); practice.forEach(function(node){host.append(node);}); number+=practice.length;
    if(state.mode==="workbook"&&state.audience==="student") host.append(renderRecord(number++,items));
    const fontsReady=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve(); Promise.resolve(fontsReady).then(function(){printButton.disabled=false; printButton.dataset.ready="true";});
  }
  function update(key,value){state[key]=value; if(key==="mode"){state.selected.clear(); state.correct.clear();} render(); document.getElementById("book-content").focus({preventScroll:true});}
  document.querySelectorAll("[data-mode]").forEach(function(button){button.addEventListener("click",function(){update("mode",button.dataset.mode);});});
  document.getElementById("locale-select").addEventListener("change",function(event){update("locale",event.target.value);});
  document.getElementById("paper-select").addEventListener("change",function(event){update("paper",event.target.value);});
  document.getElementById("print-book").addEventListener("click",function(){window.print();});
  render();
})();
