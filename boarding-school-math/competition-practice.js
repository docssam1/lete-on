(function () {
  "use strict";
  const bank=window.GFIELDGrade6CompetitionTypeBank;
  if(!bank)return;
  const params=new URLSearchParams(location.search);
  const aliases={sasmo:"sasmo-g6",kangaroo:"math-kangaroo-g5-6",amc8:"amc-8-bridge","amc-8":"amc-8-bridge"};
  const state={programId:aliases[params.get("program")]||params.get("program")||"sasmo-g6",audience:params.get("audience")==="teacher"?"teacher":"student",locale:["ko","en","zh-Hans"].includes(params.get("locale"))?params.get("locale"):"ko",correct:new Set()};
  if(!bank.programs.some(function(row){return row.id===state.programId;}))state.programId="sasmo-g6";
  function text(value){return bank.text(value,state.locale);}
  function escapeHtml(value){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function mathHtml(value){
    return escapeHtml(value).replace(/(\d+)\/(\d+)/g,'<span class="math-fraction" role="math" aria-label="$1/$2"><span aria-hidden="true">$1</span><span aria-hidden="true">$2</span></span>');
  }
  const misconceptionCopy={
    "halve-total-without-removing-difference":{ko:"차이를 먼저 빼지 않고 전체를 바로 반으로 나누는 오류",en:"halving the total before removing the difference","zh-Hans":"未先减去差值就把总数平分"},
    "repeat-last-operation":{ko:"마지막 규칙만 계속 적용하는 오류",en:"repeating only the most recent operation","zh-Hans":"只重复最后一个运算"},
    "use-last-digit-rule":{ko:"일의 자리만 보고 9의 배수를 판단하는 오류",en:"using only the last digit to test divisibility by 9","zh-Hans":"只看个位判断是否能被9整除"},
    "subtract-side-lengths":{ko:"넓이 대신 변의 길이를 빼는 오류",en:"subtracting side lengths instead of areas","zh-Hans":"用边长相减代替面积相减"},
    "read-only-one-clue":{ko:"조건 하나만 읽고 순위를 정하는 오류",en:"deciding the order from only one clue","zh-Hans":"只根据一个条件判断顺序"},
    "greedy-stop-before-exact":{ko:"큰 추부터 고른 뒤 정확한 합을 확인하지 않는 오류",en:"choosing the largest weights without checking an exact sum","zh-Hans":"只选最大砝码而未核对总和"},
    "freeze-hour-hand":{ko:"30분 동안 시침이 움직이지 않는다고 보는 오류",en:"treating the hour hand as fixed during the half hour","zh-Hans":"认为半小时内时针不移动"},
    "subtract-cutout-sides-from-perimeter":{ko:"잘라 낸 두 변만 둘레에서 빼는 오류",en:"subtracting the cut sides without adding the new inner sides","zh-Hans":"减去切掉的边却未加上新内边"},
    "multiply-move-counts":{ko:"오른쪽 이동 수와 위쪽 이동 수를 단순히 곱하는 오류",en:"multiplying the two move counts","zh-Hans":"直接把两种移动次数相乘"},
    "subtract-unlike-reference-fractions":{ko:"전체의 분수와 남은 양의 분수를 같은 기준으로 빼는 오류",en:"subtracting fractions that refer to different wholes","zh-Hans":"把基准不同的两个分数直接相减"},
    "add-percent-discounts-to-original":{ko:"두 할인율을 모두 처음 가격에 적용하는 오류",en:"applying both discounts to the original price","zh-Hans":"把两次折扣都按原价计算"},
    "divide-by-number-of-colors":{ko:"전체 공 수 대신 색의 수로 나누는 오류",en:"dividing by the number of colors instead of the number of balls","zh-Hans":"用颜色种数代替球的总数作分母"},
    "add-leg-lengths":{ko:"두 직각변의 길이를 더해 빗변으로 보는 오류",en:"adding the leg lengths to get the hypotenuse","zh-Hans":"把两条直角边直接相加作为斜边"},
    "ignore-even-units-condition":{ko:"일의 자리가 짝수여야 한다는 조건을 빠뜨리는 오류",en:"ignoring the even-units-digit condition","zh-Hans":"忽略个位必须是偶数的条件"},
    "continue-only-one-step":{ko:"표의 규칙을 한 칸만 이어 가는 오류",en:"extending the table by only one step","zh-Hans":"只把表格规律延续一步"},
    "add-counts-without-overlap":{ko:"두 모임에 함께 속한 학생을 두 번 세는 오류",en:"counting the overlap twice","zh-Hans":"把两个小组的重叠部分计算两次"},
    "treat-digit-symbol-as-number":{ko:"AB를 A×B처럼 읽는 오류",en:"reading AB as a product instead of a two-digit number","zh-Hans":"把AB看成乘积而不是两位数"},
    "use-wrong-ratio-part":{ko:"전체 몫 수 대신 한쪽의 몫 수로 나누는 오류",en:"dividing by one ratio part instead of the total parts","zh-Hans":"用一个比项而不是总份数来分"},
    "count-only-small-cells":{ko:"가장 작은 칸만 세고 큰 직사각형을 빠뜨리는 오류",en:"counting only the smallest cells","zh-Hans":"只数最小方格而漏掉较大的长方形"},
    "include-corners-for-two-faces":{ko:"세 면이 칠해진 꼭짓점 조각까지 포함하는 오류",en:"including corner cubes with three painted faces","zh-Hans":"把三面涂色的顶点小正方体也算进去"},
    "ignore-week-cycle":{ko:"7일의 반복 주기를 사용하지 않는 오류",en:"ignoring the seven-day cycle","zh-Hans":"忽略七天的循环周期"},
    "count-only-unit-squares":{ko:"한 칸짜리 정사각형만 세는 오류",en:"counting only unit squares","zh-Hans":"只数单位正方形"},
    "read-net-by-paper-distance":{ko:"전개도에서 종이 위 거리만 보고 마주 보는 면을 고르는 오류",en:"using flat-paper distance instead of folding the net","zh-Hans":"只看平面距离而没有想象折叠过程"},
    "count-each-pair-twice":{ko:"같은 두 사람의 경기를 순서만 바꾸어 두 번 세는 오류",en:"counting each unordered pair twice","zh-Hans":"把同一对学生按顺序重复计算"},
    "subtract-overlap-twice":{ko:"겹친 부분을 두 번 빼는 오류",en:"subtracting the overlap twice","zh-Hans":"把重叠部分减去两次"},
    "confuse-total-with-missing":{ko:"평균을 빠진 수로 바로 고르는 오류",en:"using the mean itself as the missing value","zh-Hans":"直接把平均数当作缺失值"},
    "distribute-only-first-term":{ko:"괄호 안의 한 항에만 3을 곱하는 오류",en:"distributing the multiplier to only one term","zh-Hans":"只把括号外的数乘到一项"},
    "multiply-without-unit-rate":{ko:"1시간에 가는 거리를 먼저 구하지 않고 시간을 곱하는 오류",en:"multiplying time before finding the unit rate","zh-Hans":"没有先求单位时间的路程就直接相乘"},
    "add-side-lengths-for-area":{ko:"가로와 세로를 곱하지 않고 더하는 오류",en:"adding side lengths instead of multiplying for area","zh-Hans":"求面积时把边长相加而不是相乘"},
    "add-multiple-counts-without-overlap":{ko:"공배수를 두 번 센 채 두 개수를 더하는 오류",en:"adding both counts without removing common multiples","zh-Hans":"相加时没有减去被重复计算的公倍数"}
  };
  function misconceptionText(id){const row=misconceptionCopy[id];return row?(row[state.locale]||row.ko):id;}
  function updateUrl(){const next=new URL(location.href);next.searchParams.set("program",state.programId);next.searchParams.set("audience",state.audience);next.searchParams.set("locale",state.locale);history.replaceState(null,"",next);}
  function copy(){
    if(state.locale==="en")return{title:"Prepare by real problem type.",lede:"Solve original GFIELD items aligned to the official scope of SASMO Grade 6, Math Kangaroo Grades 5-6, and AMC 8 preparation.",student:"Student",teacher:"Teacher",print:"Print",solved:"Solved",correct:"Correct. Explain why the other choices fail.",wrong:"Not yet. Check the conditions and try again.",answer:"Answer",misconception:"Watch for",slogan:"From concepts to competitions",home:"Home",curriculum:"US curriculum",pastPapers:"Past papers",language:"Language",releaseTitle:"GFIELD-original problems",releaseCopy:"We use only the official scope and format as references. These are not copied contest questions or official score predictions.",choose:"Choose a contest",chooseCopy:"Grade 6 mathematics is presented differently in each contest.",sourceTitle:"Official scope reference",sourceLink:"Open official source ↗",workspace:"Problem types",returnHome:"Return to the full learning path",typeCount:"10 types"};
    if(state.locale==="zh-Hans")return{title:"按真实题型备赛。",lede:"练习依据SASMO六年级、Math Kangaroo五至六年级和AMC 8官方范围独立编写的GFIELD题目。",student:"学生版",teacher:"教师版",print:"打印",solved:"已完成",correct:"正确。再说明其他选项为什么不成立。",wrong:"还不对。重新检查条件后再试。",answer:"答案",misconception:"常见错误",slogan:"从概念到竞赛",home:"首页",curriculum:"美国课程",pastPapers:"历年试题",language:"语言",releaseTitle:"GFIELD原创题目",releaseCopy:"仅参考官方考查范围与试卷形式。这些题目并非复制的竞赛真题，也不提供官方成绩预测。",choose:"选择竞赛",chooseCopy:"同为六年级数学，不同竞赛的设问方式各有侧重。",sourceTitle:"官方范围依据",sourceLink:"打开官方来源 ↗",workspace:"真实题型",returnHome:"返回完整学习路径",typeCount:"10种题型"};
    return{title:"실제 문제 유형으로 준비합니다.",lede:"SASMO G6, Math Kangaroo G5–6, AMC 8 공식 범위에 맞춰 자체 제작한 문항을 직접 풉니다.",student:"학생용",teacher:"교사용",print:"인쇄",solved:"푼 문제",correct:"맞았습니다. 다른 보기가 왜 틀렸는지도 설명해 보세요.",wrong:"아직 아닙니다. 조건을 다시 확인해 보세요.",answer:"정답",misconception:"관찰할 오류",slogan:"개념부터 경시까지",home:"홈",curriculum:"미국 교육과정",pastPapers:"연도별 기출",language:"언어",releaseTitle:"GFIELD 자체 제작 문제",releaseCopy:"공식 출제 범위와 형식만 참고했습니다. 기출 문항을 복제하거나 공식 예상 점수로 표시하지 않습니다.",choose:"대회 선택",chooseCopy:"같은 Grade 6 수학도 대회마다 문제를 묻는 방식이 다릅니다.",sourceTitle:"공식 범위 근거",sourceLink:"공식 출처 열기 ↗",workspace:"문제 유형",returnHome:"전체 학습 경로로 돌아가기",typeCount:"10개 유형"};
  }
  function programCopy(program){
    const rows={
      "sasmo-g6":{stage:{ko:"Grade 6",en:"Grade 6","zh-Hans":"六年级"},format:{ko:"GFIELD 연습 · 5지선다",en:"GFIELD practice · five choices","zh-Hans":"GFIELD练习 · 五选一"},source:{ko:"SASMO 공식 영역과 현재 시험 구조",en:"SASMO syllabus categories and current paper structure","zh-Hans":"SASMO官方考查领域与当前试卷结构"}},
      "math-kangaroo-g5-6":{stage:{ko:"Grades 5–6",en:"Grades 5–6","zh-Hans":"五至六年级"},format:{ko:"GFIELD 연습 · 3·4·5점 유형",en:"GFIELD practice · 3-, 4-, and 5-point type bands","zh-Hans":"GFIELD练习 · 3分、4分、5分题型"},source:{ko:"Math Kangaroo 공식 G5–6 영역과 3·4·5점 구성",en:"Math Kangaroo Grades 5–6 curriculum and 3-, 4-, and 5-point progression","zh-Hans":"Math Kangaroo五至六年级官方范围及3分、4分、5分结构"}},
      "amc-8-bridge":{stage:{ko:"Grade 6 기초 연결",en:"Grade 6 foundation","zh-Hans":"六年级基础衔接"},format:{ko:"GFIELD 연습 · 5지선다",en:"GFIELD practice · five choices","zh-Hans":"GFIELD练习 · 五选一"},source:{ko:"MAA AMC 8 공식 주제와 형식 범위",en:"MAA AMC 8 topic and format boundary","zh-Hans":"MAA AMC 8官方主题与试卷形式范围"}}
    };
    return rows[program.id];
  }
  function tierText(tier){
    const rows={"section-a":{ko:"A영역",en:"Section A","zh-Hans":"A部分"},"section-b":{ko:"B영역",en:"Section B","zh-Hans":"B部分"},"3-point":{ko:"3점 유형",en:"3-point","zh-Hans":"3分题"},"4-point":{ko:"4점 유형",en:"4-point","zh-Hans":"4分题"},"5-point":{ko:"5점 유형",en:"5-point","zh-Hans":"5分题"},early:{ko:"초반 유형",en:"Early","zh-Hans":"前段题型"},middle:{ko:"중반 유형",en:"Middle","zh-Hans":"中段题型"},"late-bridge":{ko:"후반 연결",en:"Late bridge","zh-Hans":"后段衔接"}};
    return rows[tier]?(rows[tier][state.locale]||rows[tier].ko):tier;
  }
  function typeCountLabel(count){if(state.locale==="en")return count+" types";if(state.locale==="zh-Hans")return count+"种题型";return count+"개 유형";}
  function experienceCopy(){
    const rows={
      ko:{studentDisclosure:"학생 연습 화면 · 공식 성적이나 학생 기록으로 저장하지 않습니다.",teacherDisclosure:"강사용 공개 미리보기 · 계정, 학생 기록, 실제 배정 기능은 없습니다.",studentKicker:"STUDENT PRACTICE",teacherKicker:"PUBLIC INSTRUCTOR PREVIEW",studentStart:"첫 유형부터 차례로 풀어 보세요.",studentStartCopy:"정답을 확인하면 다음에 풀 유형을 안내합니다.",teacherTitle:"정답·풀이·예상 오류를 함께 봅니다.",teacherCopy:"수업 설계 예시이며 인증된 강사 대시보드가 아닙니다.",first:"첫 유형으로 이동",next:"다음 유형으로 이동",teacherLink:"첫 풀이로 이동",complete:"이 대회의 10개 유형을 모두 확인했습니다.",completeCopy:"공식 점수나 수상 예측이 아닌 자체 연습 완료입니다.",review:"처음부터 다시 보기",nextPrefix:"다음 유형"},
      en:{studentDisclosure:"Student practice preview · no official score or learner record is saved.",teacherDisclosure:"Public instructor preview · no account, learner record, or assignment tools.",studentKicker:"STUDENT PRACTICE",teacherKicker:"PUBLIC INSTRUCTOR PREVIEW",studentStart:"Start with the first problem type.",studentStartCopy:"After a correct response, the next type is shown here.",teacherTitle:"Review answers, solutions, and likely errors together.",teacherCopy:"This is a lesson-design preview, not an authenticated instructor dashboard.",first:"Go to the first type",next:"Go to the next type",teacherLink:"Go to the first solution",complete:"You reviewed all 10 problem types.",completeCopy:"This is GFIELD practice completion, not an official score or award prediction.",review:"Review from the first type",nextPrefix:"Next type"},
      "zh-Hans":{studentDisclosure:"学生练习预览 · 不保存官方成绩或学生记录。",teacherDisclosure:"教师公开预览 · 不含账号、学生记录或实际布置功能。",studentKicker:"STUDENT PRACTICE",teacherKicker:"PUBLIC INSTRUCTOR PREVIEW",studentStart:"从第一种题型开始练习。",studentStartCopy:"答对后，这里会提示下一种题型。",teacherTitle:"同时查看答案、解法和常见错误。",teacherCopy:"这是教学设计预览，并非已认证的教师后台。",first:"前往第一种题型",next:"前往下一种题型",teacherLink:"前往第一个解答",complete:"已完成本竞赛的10种题型。",completeCopy:"这是GFIELD练习完成状态，并非官方成绩或获奖预测。",review:"从第一种题型重新查看",nextPrefix:"下一种题型"}
    };
    return rows[state.locale]||rows.ko;
  }
  function currentRows(){return bank.items.filter(function(row){return row.programId===state.programId;});}
  function selectProgram(programId){
    if(!bank.programs.some(function(row){return row.id===programId;}))return;
    state.programId=programId;
    render();
  }
  function renderPrograms(){
    const target=document.getElementById("program-list");
    target.innerHTML="";
    bank.programs.forEach(function(program){
      const local=programCopy(program);
      const count=bank.items.filter(function(row){return row.programId===program.id;}).length;
      const button=document.createElement("button");
      const selected=program.id===state.programId;
      button.type="button";
      button.id="program-tab-"+program.id;
      button.className="program-tab";
      button.dataset.programId=program.id;
      button.setAttribute("role","tab");
      button.setAttribute("aria-controls","problem-list");
      button.setAttribute("aria-selected",String(selected));
      button.tabIndex=selected?0:-1;
      button.style.setProperty("--program-accent",program.accent);
      button.innerHTML="<strong>"+escapeHtml(program.title)+"</strong><span>"+escapeHtml(local.stage[state.locale]||local.stage.ko)+" · "+escapeHtml(typeCountLabel(count))+"</span>";
      button.addEventListener("click",function(){selectProgram(program.id);});
      target.append(button);
    });
  }
  function renderProblems(){
    const c=copy();
    const program=bank.programs.find(function(row){return row.id===state.programId;});
    const source=bank.sources.find(function(row){return row.id===program.sourceId;});
    const local=programCopy(program);
    const rows=currentRows();
    const target=document.getElementById("problem-list");
    target.setAttribute("role","tabpanel");
    target.setAttribute("aria-labelledby","program-tab-"+program.id);
    document.getElementById("program-title").textContent=program.title;
    document.getElementById("program-format").textContent=local.format[state.locale]||local.format.ko;
    document.getElementById("source-use").textContent=local.source[state.locale]||local.source.ko;
    document.getElementById("source-link").href=source.url;
    target.innerHTML="";
    let pageGroup=null;
    rows.forEach(function(candidate,index){
      if(index%2===0){pageGroup=document.createElement("div");pageGroup.className="problem-page";target.append(pageGroup);}
      const card=document.createElement("article");
      card.id="problem-"+candidate.id;
      card.className="problem-card";
      card.dataset.itemId=candidate.id;
      const visual=bank.renderVisual(candidate,state.locale);
      card.innerHTML='<div class="problem-meta"><b>'+(index+1).toString().padStart(2,"0")+'</b><span>'+escapeHtml(tierText(candidate.tier))+'</span></div><h3>'+escapeHtml(text(candidate.typeTitle))+'</h3><p class="problem-prompt">'+mathHtml(text(candidate.prompt))+'</p><div class="problem-visual">'+visual+'</div><div class="choices"></div><p class="feedback" aria-live="polite"></p>';
      const choices=card.querySelector(".choices");
      const feedback=card.querySelector(".feedback");
      const answerId=bank.answerId(candidate);
      candidate.choices.forEach(function(row){
        const button=document.createElement("button");
        button.type="button";
        button.className="choice";
        button.dataset.answerId=row.id;
        button.setAttribute("aria-pressed","false");
        button.innerHTML='<span class="choice-mark">'+row.id+'</span><span class="choice-value">'+mathHtml(text(row.label))+'</span>';
        button.addEventListener("click",function(){
          if(state.audience!=="student"||state.correct.has(candidate.id))return;
          card.querySelectorAll(".choice").forEach(function(node){node.setAttribute("aria-pressed","false");node.classList.remove("correct","wrong");});
          button.setAttribute("aria-pressed","true");
          const correct=row.id===answerId;
          button.classList.add(correct?"correct":"wrong");
          feedback.className="feedback "+(correct?"correct":"wrong");
          feedback.textContent=correct?c.correct:c.wrong;
          if(correct){
            state.correct.add(candidate.id);
            card.classList.add("solved");
            card.querySelectorAll(".choice").forEach(function(node){node.disabled=true;});
            updateProgress();
          }
        });
        choices.append(button);
      });
      if(state.audience==="student"&&state.correct.has(candidate.id)){
        card.classList.add("solved");
        choices.querySelectorAll("button").forEach(function(button){
          button.disabled=true;
          if(button.dataset.answerId===answerId){button.classList.add("correct");button.setAttribute("aria-pressed","true");}
        });
        feedback.className="feedback correct";
        feedback.textContent=c.correct;
      }
      if(state.audience==="teacher"){
        choices.querySelectorAll("button").forEach(function(button){button.disabled=true;if(button.dataset.answerId===answerId)button.classList.add("correct");});
        const answer=candidate.choices.find(function(row){return row.id===answerId;});
        const solution=document.createElement("div");
        solution.className="teacher-solution";
        solution.innerHTML='<strong>'+c.answer+' · '+answerId+' · '+mathHtml(text(answer.label))+'</strong><p>'+mathHtml(text(candidate.solution))+'</p><small>'+c.misconception+' · '+escapeHtml(misconceptionText(candidate.misconception))+'</small>';
        card.append(solution);
      }
      pageGroup.append(card);
    });
  }
  function renderGuidance(){
    const c=experienceCopy();
    const rows=currentRows();
    const solved=rows.filter(function(row){return state.correct.has(row.id);});
    const first=rows[0];
    const next=rows.find(function(row){return !state.correct.has(row.id);});
    const kicker=document.getElementById("practice-next-kicker");
    const title=document.getElementById("practice-next-title");
    const detail=document.getElementById("practice-next-copy");
    const link=document.getElementById("practice-next-link");
    const disclosure=document.getElementById("audience-disclosure");
    disclosure.textContent=state.audience==="teacher"?c.teacherDisclosure:c.studentDisclosure;
    if(state.audience==="teacher"){
      kicker.textContent=c.teacherKicker;
      title.textContent=c.teacherTitle;
      detail.textContent=c.teacherCopy;
      link.href="#problem-"+first.id;
      link.innerHTML=escapeHtml(c.teacherLink)+' <span aria-hidden="true">↓</span>';
      return;
    }
    kicker.textContent=c.studentKicker;
    if(solved.length===rows.length){
      title.textContent=c.complete;
      detail.textContent=c.completeCopy;
      link.href="#problem-"+first.id;
      link.innerHTML=escapeHtml(c.review)+' <span aria-hidden="true">↑</span>';
      return;
    }
    title.textContent=solved.length?c.nextPrefix+" · "+text(next.typeTitle):c.studentStart;
    detail.textContent=c.studentStartCopy;
    link.href="#problem-"+next.id;
    link.innerHTML=escapeHtml(solved.length?c.next:c.first)+' <span aria-hidden="true">↓</span>';
  }
  function updateProgress(){
    const rows=currentRows();
    const count=rows.filter(function(row){return state.correct.has(row.id);}).length;
    const c=copy();
    document.getElementById("progress-label").textContent=count+" / "+rows.length;
    document.getElementById("progress-copy").textContent=c.solved;
    renderGuidance();
  }
  function render(){
    const c=copy();
    document.documentElement.lang=state.locale==="zh-Hans"?"zh-Hans":state.locale;
    document.title=(state.locale==="ko"?"경시 문제 유형":"Competition problem types")+" · G·MAP";
    document.getElementById("locale-select").value=state.locale;
    document.querySelectorAll("[data-audience]").forEach(function(button){
      const selected=button.dataset.audience===state.audience;
      button.setAttribute("aria-selected",String(selected));
      button.setAttribute("aria-controls","problem-list");
      button.tabIndex=selected?0:-1;
      button.textContent=button.dataset.audience==="student"?c.student:c.teacher;
    });
    document.getElementById("page-title").innerHTML=state.locale==="ko"?'대회 이름이 아니라,<br><span>'+c.title+'</span>':'<span>'+c.title+'</span>';
    document.getElementById("page-lede").textContent=c.lede;
    document.getElementById("brand-slogan").textContent=c.slogan;
    document.getElementById("print-button").textContent=c.print;
    document.getElementById("nav-home").textContent=c.home;
    document.getElementById("nav-curriculum").textContent=c.curriculum;
    document.getElementById("nav-past-papers").textContent=c.pastPapers;
    document.getElementById("locale-label").textContent=c.language;
    document.getElementById("release-title").textContent=c.releaseTitle;
    document.getElementById("release-copy").textContent=c.releaseCopy;
    document.getElementById("program-heading").textContent=c.choose;
    document.getElementById("program-intro").textContent=c.chooseCopy;
    document.getElementById("source-title").textContent=c.sourceTitle;
    document.getElementById("source-link").textContent=c.sourceLink;
    document.getElementById("workspace-title").textContent=c.workspace;
    document.getElementById("footer-return").textContent=c.returnHome;
    renderPrograms();
    renderProblems();
    updateProgress();
    updateUrl();
  }
  function moveProgramTab(event){
    const keys=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"];
    if(!keys.includes(event.key))return;
    const buttons=Array.from(document.querySelectorAll(".program-tab"));
    const current=buttons.indexOf(event.target);
    if(current<0)return;
    event.preventDefault();
    let next=current;
    if(event.key==="Home")next=0;
    else if(event.key==="End")next=buttons.length-1;
    else if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=(current-1+buttons.length)%buttons.length;
    else next=(current+1)%buttons.length;
    selectProgram(buttons[next].dataset.programId);
    document.getElementById("program-tab-"+state.programId).focus();
  }
  function moveAudienceTab(event){
    const keys=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"];
    if(!keys.includes(event.key))return;
    const buttons=Array.from(document.querySelectorAll("[data-audience]"));
    const current=buttons.indexOf(event.target);
    if(current<0)return;
    event.preventDefault();
    let next=current;
    if(event.key==="Home")next=0;
    else if(event.key==="End")next=buttons.length-1;
    else if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=(current-1+buttons.length)%buttons.length;
    else next=(current+1)%buttons.length;
    state.audience=buttons[next].dataset.audience;
    render();
    document.querySelector('[data-audience="'+state.audience+'"]').focus();
  }
  document.querySelectorAll("[data-audience]").forEach(function(button){button.addEventListener("click",function(){state.audience=button.dataset.audience;render();});});
  document.querySelector(".role-tabs").addEventListener("keydown",moveAudienceTab);
  document.getElementById("program-list").addEventListener("keydown",moveProgramTab);
  document.getElementById("locale-select").addEventListener("change",function(event){state.locale=event.target.value;render();});
  document.getElementById("print-button").addEventListener("click",function(){window.print();});
  render();
})();
