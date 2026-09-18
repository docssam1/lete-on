(function () {
  "use strict";
  const bank=window.GFIELDGrade6CompetitionTypeBank;
  const analysis=window.GFIELDCompetitionPracticeAnalysis;
  if(!bank||!analysis)return;
  const params=new URLSearchParams(location.search);
  const aliases={sasmo:"sasmo-g6",kangaroo:"math-kangaroo-g5-6",amc8:"amc-8-bridge","amc-8":"amc-8-bridge"};
  const supportedLocales=["ko","en","en-SG","zh-Hans"];
  const state={programId:aliases[params.get("program")]||params.get("program")||"sasmo-g6",audience:params.get("audience")==="teacher"?"teacher":"student",locale:supportedLocales.includes(params.get("locale"))?params.get("locale"):"ko",correct:new Set(),attempts:new Map()};
  if(!bank.programs.some(function(row){return row.id===state.programId;}))state.programId="sasmo-g6";
  function contentLocale(){return state.locale==="en-SG"?"en":state.locale;}
  function localized(row){return row?(row[state.locale]||row[contentLocale()]||row.ko):"";}
  function text(value){return bank.text(value,contentLocale());}
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
  const axisCopy={
    "number-operations":{ko:"수와 연산",en:"Number and operations","zh-Hans":"数与运算"},
    "patterns-algebra":{ko:"규칙과 대수",en:"Patterns and algebra","zh-Hans":"规律与代数"},
    "geometry-spatial":{ko:"도형과 공간 감각",en:"Geometry and spatial reasoning","zh-Hans":"几何与空间思维"},
    "combinatorics-logic":{ko:"조합과 논리",en:"Combinatorics and logic","zh-Hans":"组合与逻辑"},
    "data-probability":{ko:"자료와 가능성",en:"Data and probability","zh-Hans":"数据与可能性"},
    "problem-solving-strategies":{ko:"문제 해결 전략",en:"Problem-solving strategies","zh-Hans":"问题解决策略"}
  };
  const coachHintCopy={
    "sasmo-g6-model-01":{ko:"두 상자의 차이만큼을 먼저 떼어 낸 뒤, 남은 수를 똑같이 나누어 보세요.",en:"Remove the difference first, then split the remaining amount equally.","zh-Hans":"先去掉两个盒子相差的数量，再把剩余数量平均分。"},
    "sasmo-g6-pattern-01":{ko:"이웃한 두 수 사이의 변화를 차례로 비교하고, 두 단계가 반복되는지 확인해 보세요.",en:"Compare each pair of neighboring terms and check whether a two-step pattern repeats.","zh-Hans":"依次比较相邻两项的变化，看看是否每两步重复一次。"},
    "sasmo-g6-divisibility-01":{ko:"9의 배수는 각 자리 숫자의 합도 9의 배수입니다.",en:"For a multiple of 9, the sum of its digits is also a multiple of 9.","zh-Hans":"9的倍数，各位数字之和也是9的倍数。"},
    "sasmo-g6-geometry-01":{ko:"큰 직사각형의 넓이에서 잘라 낸 직사각형의 넓이를 빼세요.",en:"Subtract the area of the cutout from the area of the whole rectangle.","zh-Hans":"用大长方形的面积减去被切掉的小长方形面积。"},
    "sasmo-g6-logic-01":{ko:"모든 조건을 ‘누가 누구보다 앞인가’ 화살표로 바꾼 뒤, 누구보다도 뒤에 있지 않은 사람을 찾으세요.",en:"Turn every clue into an ‘is ahead of’ arrow, then find the person who is never behind anyone.","zh-Hans":"把每个条件画成“谁在谁前面”的箭头，再找出没有排在任何人后面的人。"},
    "sasmo-g6-sets-01":{ko:"두 모임의 수를 더하면 두 모임에 모두 속한 학생이 두 번 세어집니다.",en:"When the two group counts are added, students in both groups are counted twice.","zh-Hans":"把两组人数相加时，同时参加两组的学生会被重复计算。"},
    "sasmo-g6-cryptarithm-01":{ko:"두 자리 수 AB를 10A+B, BA를 10B+A로 나타내어 관계를 정리하세요.",en:"Write the two-digit numbers as AB = 10A+B and BA = 10B+A.","zh-Hans":"把两位数AB写成10A+B，把BA写成10B+A。"},
    "sasmo-g6-ratio-01":{ko:"비의 전체 몫 수를 먼저 구하고, 전체 수를 그 몫 수로 나누어 한 몫의 크기를 찾으세요.",en:"Add the ratio parts, then divide the total by that sum to find one part.","zh-Hans":"先求比的总份数，再用总数除以总份数求出一份。"},
    "sasmo-g6-grid-01":{ko:"직사각형 하나는 서로 다른 세로선 두 개와 가로선 두 개를 고르면 정해집니다.",en:"A rectangle is determined by choosing two vertical grid lines and two horizontal grid lines.","zh-Hans":"选择两条不同的竖线和两条不同的横线，就能确定一个长方形。"},
    "sasmo-g6-cube-01":{ko:"정확히 두 면이 칠해진 작은 정육면체는 큰 정육면체의 모서리에 있지만 꼭짓점에는 없습니다.",en:"A unit cube with exactly two painted faces lies on an edge of the large cube, but not at a corner.","zh-Hans":"恰有两个面涂色的小正方体在大正方体的棱上，但不在顶点处。"}
  };
  function misconceptionText(id){const row=misconceptionCopy[id];return row?localized(row):id;}
  function axisText(id){const row=axisCopy[id];return row?localized(row):id;}
  function coachHint(candidate){const row=coachHintCopy[candidate.id];if(row)return localized(row);return state.locale.startsWith("en")?"Mark the given information and the target, then connect them with one verified relationship.":state.locale==="zh-Hans"?"先标出已知条件和所求量，再写出连接它们的一条关系。":"주어진 조건과 구하려는 것을 표시하고, 둘을 잇는 관계를 한 줄로 적어 보세요.";}
  function updateUrl(){const next=new URL(location.href);next.searchParams.set("program",state.programId);next.searchParams.set("audience",state.audience);next.searchParams.set("locale",state.locale);history.replaceState(null,"",next);}
  function copy(){
    if(state.locale==="en-SG")return{kicker:"SASMO SINGAPORE · PRIMARY 6 (GRADE 6)",title:"Prepare for SASMO by problem type.",lede:"Work through reviewed GFIELD items for Primary 6 (Grade 6), see first-attempt evidence by domain, and use the local question coach for your next step.",student:"Student",teacher:"Teacher",print:"Print workbook",solved:"Completed",correct:"Correct. Explain why the other choices do not work.",wrong:"Not yet. Recheck the conditions and try again.",answer:"Answer",misconception:"Common error",slogan:"From school mathematics to competitions",home:"Home",curriculum:"US curriculum",pastPapers:"Past papers",language:"Language / region",releaseTitle:"GFIELD-original practice",releaseCopy:"The official SASMO syllabus and paper structure are used only as references. These are not copied contest questions or official score predictions.",choose:"Choose a competition",chooseCopy:"Primary 6 mathematics is presented differently across competitions.",sourceTitle:"Official scope reference",sourceLink:"Open official source ↗",workspace:"Problem types",returnHome:"Return to the full learning pathway",typeCount:"10 types"};
    if(state.locale==="en")return{kicker:"COMPETITION TYPE BANK · GRADE 6 BRIDGE",title:"Prepare by real problem type.",lede:"Solve reviewed GFIELD items, get first-attempt evidence by domain, and use the local question coach for the next step.",student:"Student",teacher:"Teacher",print:"Print",solved:"Solved",correct:"Correct. Explain why the other choices fail.",wrong:"Not yet. Check the conditions and try again.",answer:"Answer",misconception:"Watch for",slogan:"From concepts to competitions",home:"Home",curriculum:"US curriculum",pastPapers:"Past papers",language:"Language",releaseTitle:"GFIELD-original problems",releaseCopy:"We use only the official scope and format as references. These are not copied contest questions or official score predictions.",choose:"Choose a contest",chooseCopy:"Grade 6 mathematics is presented differently in each contest.",sourceTitle:"Official scope reference",sourceLink:"Open official source ↗",workspace:"Problem types",returnHome:"Return to the full learning path",typeCount:"10 types"};
    if(state.locale==="zh-Hans")return{kicker:"竞赛题型题库 · 六年级衔接",title:"按真实题型备赛。",lede:"完成已审核的GFIELD题目，查看各领域首次作答证据，并使用本地题目辅导获得下一步提示。",student:"学生版",teacher:"教师版",print:"打印",solved:"已完成",correct:"正确。再说明其他选项为什么不成立。",wrong:"还不对。重新检查条件后再试。",answer:"答案",misconception:"常见错误",slogan:"从概念到竞赛",home:"首页",curriculum:"美国课程",pastPapers:"历年试题",language:"语言",releaseTitle:"GFIELD原创题目",releaseCopy:"仅参考官方考查范围与试卷形式。这些题目并非复制的竞赛真题，也不提供官方成绩预测。",choose:"选择竞赛",chooseCopy:"同为六年级数学，不同竞赛的设问方式各有侧重。",sourceTitle:"官方范围依据",sourceLink:"打开官方来源 ↗",workspace:"真实题型",returnHome:"返回完整学习路径",typeCount:"10种题型"};
    return{kicker:"COMPETITION TYPE BANK · GRADE 6 BRIDGE",title:"실제 문제 유형으로 준비합니다.",lede:"검수된 GFIELD 문항을 풀고 첫 응답 기준 영역 분석을 확인한 뒤, 로컬 질문 도우미로 다음 풀이 단계를 찾습니다.",student:"학생용",teacher:"교사용",print:"인쇄",solved:"푼 문제",correct:"맞았습니다. 다른 보기가 왜 틀렸는지도 설명해 보세요.",wrong:"아직 아닙니다. 조건을 다시 확인해 보세요.",answer:"정답",misconception:"관찰할 오류",slogan:"개념부터 경시까지",home:"홈",curriculum:"미국 교육과정",pastPapers:"연도별 기출",language:"언어",releaseTitle:"GFIELD 자체 제작 문제",releaseCopy:"공식 출제 범위와 형식만 참고했습니다. 기출 문항을 복제하거나 공식 예상 점수로 표시하지 않습니다.",choose:"대회 선택",chooseCopy:"같은 Grade 6 수학도 대회마다 문제를 묻는 방식이 다릅니다.",sourceTitle:"공식 범위 근거",sourceLink:"공식 출처 열기 ↗",workspace:"문제 유형",returnHome:"전체 학습 경로로 돌아가기",typeCount:"10개 유형"};
  }
  function programCopy(program){
    const rows={
      "sasmo-g6":{stage:{ko:"Grade 6",en:"Grade 6","en-SG":"Primary 6 (Grade 6)","zh-Hans":"六年级"},format:{ko:"GFIELD 연습 · 5지선다",en:"GFIELD practice · five choices","en-SG":"GFIELD practice · five-choice format","zh-Hans":"GFIELD练习 · 五选一"},source:{ko:"SASMO 공식 영역과 현재 시험 구조",en:"SASMO syllabus categories and current paper structure","en-SG":"Official SASMO syllabus categories and current paper structure","zh-Hans":"SASMO官方考查领域与当前试卷结构"}},
      "math-kangaroo-g5-6":{stage:{ko:"Grades 5–6",en:"Grades 5–6","zh-Hans":"五至六年级"},format:{ko:"GFIELD 연습 · 3·4·5점 유형",en:"GFIELD practice · 3-, 4-, and 5-point type bands","zh-Hans":"GFIELD练习 · 3分、4分、5分题型"},source:{ko:"Math Kangaroo 공식 G5–6 영역과 3·4·5점 구성",en:"Math Kangaroo Grades 5–6 curriculum and 3-, 4-, and 5-point progression","zh-Hans":"Math Kangaroo五至六年级官方范围及3分、4分、5分结构"}},
      "amc-8-bridge":{stage:{ko:"Grade 6 기초 연결",en:"Grade 6 foundation","zh-Hans":"六年级基础衔接"},format:{ko:"GFIELD 연습 · 5지선다",en:"GFIELD practice · five choices","zh-Hans":"GFIELD练习 · 五选一"},source:{ko:"MAA AMC 8 공식 주제와 형식 범위",en:"MAA AMC 8 topic and format boundary","zh-Hans":"MAA AMC 8官方主题与试卷形式范围"}}
    };
    return rows[program.id];
  }
  function tierText(tier){
    const rows={"section-a":{ko:"A영역",en:"Section A","zh-Hans":"A部分"},"section-b":{ko:"B영역",en:"Section B","zh-Hans":"B部分"},"3-point":{ko:"3점 유형",en:"3-point","zh-Hans":"3分题"},"4-point":{ko:"4점 유형",en:"4-point","zh-Hans":"4分题"},"5-point":{ko:"5점 유형",en:"5-point","zh-Hans":"5分题"},early:{ko:"초반 유형",en:"Early","zh-Hans":"前段题型"},middle:{ko:"중반 유형",en:"Middle","zh-Hans":"中段题型"},"late-bridge":{ko:"후반 연결",en:"Late bridge","zh-Hans":"后段衔接"}};
    return rows[tier]?localized(rows[tier]):tier;
  }
  function typeCountLabel(count){if(state.locale.startsWith("en"))return count+" types";if(state.locale==="zh-Hans")return count+"种题型";return count+"개 유형";}
  function experienceCopy(){
    const rows={
      ko:{studentDisclosure:"학생 연습 화면 · 공식 성적이나 학생 기록으로 저장하지 않습니다.",teacherDisclosure:"교사용 공개 미리보기 · 계정, 학생 기록, 실제 배정 기능은 없습니다.",studentKicker:"STUDENT PRACTICE",teacherKicker:"PUBLIC TEACHER PREVIEW",studentStart:"첫 유형부터 차례로 풀어 보세요.",studentStartCopy:"정답을 확인하면 다음에 풀 유형을 안내합니다.",teacherTitle:"정답·풀이·예상 오류를 함께 봅니다.",teacherCopy:"수업 설계 예시이며 인증된 교사 대시보드가 아닙니다.",first:"첫 유형으로 이동",next:"다음 유형으로 이동",teacherLink:"첫 풀이로 이동",complete:"이 대회의 10개 유형을 모두 확인했습니다.",completeCopy:"공식 점수나 수상 예측이 아닌 자체 연습 완료입니다.",review:"처음부터 다시 보기",nextPrefix:"다음 유형"},
      en:{studentDisclosure:"Student practice preview · no official score or learner record is saved.",teacherDisclosure:"Public teacher preview · no account, learner record, or assignment tools.",studentKicker:"STUDENT PRACTICE",teacherKicker:"PUBLIC TEACHER PREVIEW",studentStart:"Start with the first problem type.",studentStartCopy:"After a correct response, the next type is shown here.",teacherTitle:"Review answers, solutions, and likely errors together.",teacherCopy:"This is a lesson-design preview, not an authenticated teacher dashboard.",first:"Go to the first type",next:"Go to the next type",teacherLink:"Go to the first solution",complete:"You reviewed all 10 problem types.",completeCopy:"This is GFIELD practice completion, not an official score or award prediction.",review:"Review from the first type",nextPrefix:"Next type"},
      "zh-Hans":{studentDisclosure:"学生练习预览 · 不保存官方成绩或学生记录。",teacherDisclosure:"教师公开预览 · 不含账号、学生记录或实际布置功能。",studentKicker:"STUDENT PRACTICE",teacherKicker:"PUBLIC TEACHER PREVIEW",studentStart:"从第一种题型开始练习。",studentStartCopy:"答对后，这里会提示下一种题型。",teacherTitle:"同时查看答案、解法和常见错误。",teacherCopy:"这是教学设计预览，并非已认证的教师后台。",first:"前往第一种题型",next:"前往下一种题型",teacherLink:"前往第一个解答",complete:"已完成本竞赛的10种题型。",completeCopy:"这是GFIELD练习完成状态，并非官方成绩或获奖预测。",review:"从第一种题型重新查看",nextPrefix:"下一种题型"}
    };
    if(state.locale==="en-SG")return Object.assign({},rows.en,{studentDisclosure:"Primary 6 practice preview · no official result or learner record is saved.",teacherDisclosure:"Public teacher preview · no account, learner record, or assignment tools.",teacherKicker:"PUBLIC TEACHER PREVIEW",studentStart:"Start with the first Primary 6 problem type.",teacherTitle:"Review answers, worked solutions, and likely errors together.",teacherCopy:"This is a lesson-planning preview, not an authenticated teacher dashboard."});
    return localized(rows);
  }
  function diagnosticCopy(){
    const rows={
      ko:{heading:"GFIELD 예비 진단",intro:"첫 응답을 기준으로 강점과 보완 영역을 분석합니다.",boundary:"이 결과는 10개 자체 제작 연습 유형의 예비 분석이며, 공식 SASMO 점수·수상 등급·학교 배치 결과가 아닙니다.",jump:"예비 진단 보기",collecting:"근거 수집 중",complete:"예비 분석 완료",emptyTitle:"한 문제를 풀면 분석이 시작됩니다.",emptyCopy:"첫 응답을 기준으로 영역별 강점과 보완 유형을 기록합니다. 문제마다 질문 도우미에서 정답 없이 한 단계 힌트를 받을 수 있습니다.",start:"첫 문제 풀기",firstAccuracy:"첫 응답 정답률",eventual:"끝까지 해결",readiness:"현재 표본 준비도",strength:"관찰된 강점",priority:"우선 보완",domains:"6개 진단 영역",unmeasured:"미측정",thin:"근거 1문항",provisional:"예비 근거",noStrength:"아직 확인된 강점 근거가 없습니다.",noPriority:"현재 응답에서 확인된 취약 유형이 없습니다.",next:"다음 학습",review:"보완 문항으로 이동",continue:"다음 미응답 문항",reset:"현재 결과 다시 시작",teacherEvidence:"교사용 문항별 근거",question:"문항",type:"유형",firstResult:"첫 응답",attempts:"시도",error:"관찰 오류",correctFirst:"첫 응답 정답",wrongFirst:"첫 응답 오답",notTried:"미응답",none:"없음",attemptUnit:"회",placed:"배치",answered:"응답",noSample:"현재 표본 없음",coach:"문제의 ‘질문 도우미’를 열어 한 단계 힌트와 현재 풀이 분석을 확인하세요.",bands:{collecting:"진단 진행 중",strong:"표본 안정",readyWithReview:"부분 보완",developing:"성장 중",foundation:"기초 보완"}},
      en:{heading:"GFIELD practice diagnosis",intro:"Strengths and priorities use first-attempt evidence.",boundary:"This is a preliminary analysis of ten GFIELD-authored practice types, not an official SASMO score, award band, or school placement result.",jump:"View diagnosis",collecting:"Collecting evidence",complete:"Preliminary analysis ready",emptyTitle:"Analysis starts after one response.",emptyCopy:"First attempts build the domain evidence. Each problem also has a local question coach that gives one step without revealing the answer.",start:"Start the first problem",firstAccuracy:"First-attempt accuracy",eventual:"Solved eventually",readiness:"Current-sample readiness",strength:"Observed strength",priority:"Priority to improve",domains:"Six diagnostic domains",unmeasured:"Not measured",thin:"One-item evidence",provisional:"Preliminary evidence",noStrength:"No strength evidence is confirmed yet.",noPriority:"No weak type is visible in the current responses.",next:"Next learning step",review:"Go to priority item",continue:"Go to next unanswered item",reset:"Restart this result",teacherEvidence:"Instructor item evidence",question:"Item",type:"Type",firstResult:"First response",attempts:"Attempts",error:"Observed error",correctFirst:"Correct first try",wrongFirst:"Wrong first try",notTried:"Not attempted",none:"None",attemptUnit:"",placed:"placed",answered:"answered",noSample:"No current sample",coach:"Open the problem’s Question coach for one-step guidance and attempt analysis.",bands:{collecting:"Diagnosis in progress",strong:"Sample strong",readyWithReview:"Review needed",developing:"Developing",foundation:"Foundation review"}},
      "zh-Hans":{heading:"GFIELD初步诊断",intro:"根据首次作答分析优势领域和优先补强领域。",boundary:"本结果仅基于10种GFIELD原创练习题型进行初步分析，并非SASMO官方分数、获奖等级或学校分班结果。",jump:"查看初步诊断",collecting:"正在收集证据",complete:"初步分析完成",emptyTitle:"完成一道题后开始分析。",emptyCopy:"系统根据首次作答记录各领域的优势与补强题型。每道题都可使用本地题目辅导，在不直接显示答案的情况下获得一步提示。",start:"开始第一题",firstAccuracy:"首次作答正确率",eventual:"最终完成",readiness:"当前样本准备度",strength:"已观察到的优势",priority:"优先补强",domains:"六个诊断领域",unmeasured:"未测量",thin:"仅1题证据",provisional:"初步证据",noStrength:"目前尚无已确认的优势证据。",noPriority:"当前作答中尚未发现明显薄弱题型。",next:"下一步学习",review:"前往补强题目",continue:"前往下一道未答题",reset:"重新开始当前结果",teacherEvidence:"教师版逐题证据",question:"题目",type:"题型",firstResult:"首次作答",attempts:"尝试",error:"观察到的错误",correctFirst:"首次答对",wrongFirst:"首次答错",notTried:"未作答",none:"无",attemptUnit:"次",placed:"已安排",answered:"已作答",noSample:"当前无样本",coach:"打开题目中的“题目辅导”，查看一步提示和当前作答分析。",bands:{collecting:"诊断进行中",strong:"样本稳定",readyWithReview:"需要复习",developing:"正在发展",foundation:"需要补强基础"}}
    };
    if(state.locale==="en-SG")return Object.assign({},rows.en,{heading:"GFIELD practice analysis",boundary:"This preliminary analysis uses ten GFIELD-authored Primary 6 practice types. It is not an official SASMO score, award, DSA outcome, or school placement result.",teacherEvidence:"Teacher item evidence"});
    return localized(rows);
  }
  function currentRows(){return bank.items.filter(function(row){return row.programId===state.programId;});}
  function attemptRecord(itemId){
    if(!state.attempts.has(itemId))state.attempts.set(itemId,{responses:[],solved:false});
    return state.attempts.get(itemId);
  }
  function readinessLabel(summary,c){
    const key=summary.readinessBand==="ready-with-review"?"readyWithReview":summary.readinessBand;
    return c.bands[key]||c.bands.collecting;
  }
  function evidenceLabel(domain,c){
    if(domain.evidenceState==="unmeasured")return c.unmeasured;
    if(domain.evidenceState==="thin")return c.thin;
    return c.provisional;
  }
  function resultText(evidence,c){
    if(!evidence.attempted)return c.notTried;
    return evidence.firstCorrect?c.correctFirst:c.wrongFirst;
  }
  function renderDiagnostic(){
    const rows=currentRows();
    const summary=analysis.summarize(rows,state.attempts);
    const c=diagnosticCopy();
    const heading=document.getElementById("diagnostic-heading");
    const intro=document.getElementById("diagnostic-intro");
    const boundary=document.getElementById("diagnostic-boundary");
    const status=document.getElementById("diagnostic-state");
    const target=document.getElementById("diagnostic-content");
    heading.textContent=c.heading;
    intro.textContent=c.intro;
    boundary.textContent=c.boundary;
    status.textContent=summary.complete?c.complete:c.collecting;
    status.dataset.state=summary.complete?"complete":"collecting";
    document.getElementById("results-jump-label").textContent=c.jump;
    document.getElementById("results-jump-count").textContent=summary.attempted+" / "+summary.itemCount;

    if(summary.attempted===0){
      target.innerHTML='<div class="diagnostic-empty"><strong>'+escapeHtml(c.emptyTitle)+'</strong><p>'+escapeHtml(c.emptyCopy)+'</p><a href="#problem-'+escapeHtml(rows[0].id)+'">'+escapeHtml(c.start)+' <span aria-hidden="true">↓</span></a></div>';
      return;
    }

    const byId=new Map(rows.map(function(item){return[item.id,item];}));
    const strength=summary.domains.find(function(domain){return domain.axis===summary.strengthAxis;});
    const priority=summary.domains.find(function(domain){return domain.axis===summary.priorityAxis;});
    const priorityItem=summary.itemEvidence.find(function(item){return item.axis===summary.priorityAxis&&item.firstCorrect===false;});
    const nextItem=summary.itemEvidence.find(function(item){return !item.attempted;});
    const actionEvidence=priorityItem||nextItem||summary.itemEvidence[0];
    const strengthCopy=strength?axisText(strength.axis)+" · "+strength.firstCorrect+" / "+strength.attempted:c.noStrength;
    const priorityCopy=priority?axisText(priority.axis)+" · "+priority.firstCorrect+" / "+priority.attempted:c.noPriority;
    const accuracy=summary.accuracy===null?"—":summary.accuracy+"%";
    const actionItem=byId.get(actionEvidence.itemId);
    const actionLabel=priorityItem?c.review:nextItem?c.continue:c.review;
    const sectionHtml=summary.sections.map(function(section){
      const value=section.percentage===null?c.unmeasured:section.percentage+"%";
      return '<span><b>'+escapeHtml(tierText(section.tier))+'</b> '+escapeHtml(value)+' <small>'+section.firstCorrect+' / '+section.attempted+'</small></span>';
    }).join("");
    const domainHtml=summary.domains.map(function(domain){
      const value=domain.percentage===null?c.unmeasured:domain.percentage+"%";
      const width=domain.percentage===null?0:domain.percentage;
      const count=domain.itemCount+" "+c.placed+" · "+domain.attempted+" "+c.answered;
      return '<div class="domain-row" data-axis="'+escapeHtml(domain.axis)+'"><div class="domain-label"><strong>'+escapeHtml(axisText(domain.axis))+'</strong><span>'+escapeHtml(evidenceLabel(domain,c))+'</span></div><div class="domain-meter" role="meter" aria-label="'+escapeHtml(axisText(domain.axis))+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+width+'"><i style="width:'+width+'%"></i></div><div class="domain-value"><b>'+escapeHtml(value)+'</b><small>'+escapeHtml(count)+'</small></div></div>';
    }).join("");
    const errorEvidence=summary.itemEvidence.filter(function(item){return item.firstCorrect===false;});
    const errorHtml=errorEvidence.length?'<ul class="diagnostic-error-list">'+errorEvidence.slice(0,4).map(function(evidence){const item=byId.get(evidence.itemId);return '<li><a href="#problem-'+escapeHtml(item.id)+'">'+String(evidence.questionNumber).padStart(2,"0")+' · '+escapeHtml(text(item.typeTitle))+'</a><span>'+escapeHtml(misconceptionText(evidence.misconception))+'</span></li>';}).join("")+'</ul>':'';
    let teacherHtml="";
    if(state.audience==="teacher"){
      teacherHtml='<section class="teacher-evidence"><h3>'+escapeHtml(c.teacherEvidence)+'</h3><div class="teacher-table-wrap"><table><thead><tr><th>'+escapeHtml(c.question)+'</th><th>'+escapeHtml(c.type)+'</th><th>'+escapeHtml(c.firstResult)+'</th><th>'+escapeHtml(c.attempts)+'</th><th>'+escapeHtml(c.error)+'</th></tr></thead><tbody>'+summary.itemEvidence.map(function(evidence){const item=byId.get(evidence.itemId);return '<tr><td>'+String(evidence.questionNumber).padStart(2,"0")+'</td><td><a href="#problem-'+escapeHtml(item.id)+'">'+escapeHtml(text(item.typeTitle))+'</a></td><td>'+escapeHtml(resultText(evidence,c))+'</td><td>'+evidence.attemptCount+escapeHtml(c.attemptUnit)+'</td><td>'+escapeHtml(evidence.misconception?misconceptionText(evidence.misconception):c.none)+'</td></tr>';}).join("")+'</tbody></table></div></section>';
    }
    target.innerHTML='<div class="diagnostic-overview"><article><span>'+escapeHtml(c.firstAccuracy)+'</span><strong>'+escapeHtml(accuracy)+'</strong><small>'+summary.firstCorrect+' / '+summary.attempted+'</small></article><article><span>'+escapeHtml(c.eventual)+'</span><strong>'+summary.solved+' / '+summary.itemCount+'</strong><small>'+escapeHtml(sectionHtml?"":c.noSample)+'</small></article><article><span>'+escapeHtml(c.readiness)+'</span><strong>'+escapeHtml(readinessLabel(summary,c))+'</strong><small>'+escapeHtml(summary.complete?c.complete:c.collecting)+'</small></article><article><span>'+escapeHtml(c.strength)+'</span><strong>'+escapeHtml(strengthCopy)+'</strong></article><article><span>'+escapeHtml(c.priority)+'</span><strong>'+escapeHtml(priorityCopy)+'</strong></article></div><div class="diagnostic-section-scores">'+sectionHtml+'</div><div class="diagnostic-detail-grid"><section class="domain-analysis"><h3>'+escapeHtml(c.domains)+'</h3>'+domainHtml+'</section><aside class="diagnostic-prescription"><h3>'+escapeHtml(c.next)+'</h3><strong>'+escapeHtml(text(actionItem.typeTitle))+'</strong><p>'+escapeHtml(priorityItem?misconceptionText(priorityItem.misconception):c.coach)+'</p><p class="coach-direction">'+escapeHtml(c.coach)+'</p><a href="#problem-'+escapeHtml(actionItem.id)+'">'+escapeHtml(actionLabel)+' <span aria-hidden="true">↑</span></a>'+errorHtml+'<button type="button" id="diagnostic-reset">'+escapeHtml(c.reset)+'</button></aside></div>'+teacherHtml;
    document.getElementById("diagnostic-reset").addEventListener("click",function(){
      rows.forEach(function(item){state.attempts.delete(item.id);state.correct.delete(item.id);});
      render();
      document.getElementById("diagnostic-results").scrollIntoView({behavior:"smooth",block:"start"});
    });
  }
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
      button.innerHTML="<strong>"+escapeHtml(program.title)+"</strong><span>"+escapeHtml(localized(local.stage))+" · "+escapeHtml(typeCountLabel(count))+"</span>";
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
    document.getElementById("program-format").textContent=localized(local.format);
    document.getElementById("source-use").textContent=localized(local.source);
    document.getElementById("source-link").href=source.url;
    target.innerHTML="";
    let pageGroup=null;
    rows.forEach(function(candidate,index){
      if(index%2===0){pageGroup=document.createElement("div");pageGroup.className="problem-page";target.append(pageGroup);}
      const card=document.createElement("article");
      card.id="problem-"+candidate.id;
      card.className="problem-card";
      card.dataset.itemId=candidate.id;
      card.dataset.coachGroup=candidate.axis;
      card.dataset.coachHint=coachHint(candidate);
      card.dataset.coachMisconception=misconceptionText(candidate.misconception);
      const visual=bank.renderVisual(candidate,contentLocale());
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
          const record=attemptRecord(candidate.id);
          record.responses.push({answerId:row.id,correct:correct});
          if(correct)record.solved=true;
          button.classList.add(correct?"correct":"wrong");
          feedback.className="feedback "+(correct?"correct":"wrong");
          feedback.textContent=correct?c.correct:c.wrong;
          if(correct){
            state.correct.add(candidate.id);
            card.classList.add("solved");
            card.querySelectorAll(".choice").forEach(function(node){node.disabled=true;});
          }
          updateProgress();
        });
        choices.append(button);
      });
      if(state.audience==="student"){
        const record=state.attempts.get(candidate.id);
        const last=record&&record.responses.length?record.responses[record.responses.length-1]:null;
        if(last){
          const selected=choices.querySelector('[data-answer-id="'+last.answerId+'"]');
          if(selected){selected.classList.add(last.correct?"correct":"wrong");selected.setAttribute("aria-pressed","true");}
          feedback.className="feedback "+(last.correct?"correct":"wrong");
          feedback.textContent=last.correct?c.correct:c.wrong;
        }
        if(state.correct.has(candidate.id)){
          card.classList.add("solved");
          choices.querySelectorAll("button").forEach(function(button){button.disabled=true;});
        }
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
    renderDiagnostic();
  }
  function render(){
    const c=copy();
    document.documentElement.lang=state.locale==="zh-Hans"?"zh-Hans":state.locale;
    document.title=(state.locale==="ko"?"경시 문제 유형":state.locale==="en-SG"?"SASMO Primary 6 practice":"Competition problem types")+" · G·MAP";
    document.getElementById("locale-select").value=state.locale;
    document.querySelectorAll(".role-tabs [data-audience]").forEach(function(button){
      const selected=button.dataset.audience===state.audience;
      button.setAttribute("aria-selected",String(selected));
      button.setAttribute("aria-controls","problem-list");
      button.tabIndex=selected?0:-1;
      button.textContent=button.dataset.audience==="student"?c.student:c.teacher;
    });
    document.getElementById("page-title").innerHTML=state.locale==="ko"?'대회 이름이 아니라,<br><span>'+c.title+'</span>':'<span>'+c.title+'</span>';
    document.getElementById("page-lede").textContent=c.lede;
    document.getElementById("page-kicker").textContent=c.kicker;
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
    const buttons=Array.from(document.querySelectorAll(".role-tabs [data-audience]"));
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
    document.querySelector('.role-tabs [data-audience="'+state.audience+'"]').focus();
  }
  document.querySelectorAll(".role-tabs [data-audience]").forEach(function(button){button.addEventListener("click",function(){state.audience=button.dataset.audience;render();});});
  document.querySelector(".role-tabs").addEventListener("keydown",moveAudienceTab);
  document.getElementById("program-list").addEventListener("keydown",moveProgramTab);
  document.getElementById("locale-select").addEventListener("change",function(event){state.locale=event.target.value;render();});
  document.getElementById("print-button").addEventListener("click",function(){window.print();});
  render();
})();
