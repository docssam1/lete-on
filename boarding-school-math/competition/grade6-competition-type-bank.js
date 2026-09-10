(function (root, factory) {
  const renderer = typeof module === "object" && module.exports
    ? (require("../../geometry/worksheet/render.js"), globalThis.GW_RENDER)
    : root && root.GW_RENDER;
  const api = factory(renderer);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade6CompetitionTypeBank = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (sharedRenderer) {
  "use strict";

  function freeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.keys(value).forEach(function (key) { freeze(value[key]); }); return Object.freeze(value); }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function choice(id, value, label) { return freeze({ id: id, value: String(value), label: label || tr(String(value), String(value), String(value)) }); }
  function numericChoices(values) { return values.map(function (value, index) { return choice("ABCDE"[index], value); }); }
  function item(data) {
    return freeze(Object.assign({
      learnerFit: {
        learnerStage: "US Grade 6 competition bridge, ages 11-12",
        criteria: {
          language: "short grade-appropriate sentences in Korean, English, and Simplified Chinese",
          representations: "whole numbers, fractions, tables, and declared point or segment models only",
          prerequisites: "Grade 6 arithmetic, ratio, area, elementary probability, and informal counting",
          reasoningLoad: "one to three connected steps without high-school notation",
          responseMode: "five-choice multiple choice"
        }
      },
      contentOrigin: "gfield-original",
      sourceUse: "official-scope-and-format-reference-only",
      officialProblem: false,
      releaseState: "published-public-practice"
    }, data));
  }

  const sources = freeze([
    { id: "sasmo-official-syllabus", authority: "SASMO / SIMCC", url: "https://sasmo.simcc.org/", use: "syllabus categories and current paper structure", lastVerified: "2026-09-11" },
    { id: "math-kangaroo-g5-6-curriculum", authority: "Math Kangaroo USA", url: "https://mathkangaroo.org/mks/resources/math-kangaroo-curricula/", use: "Grades 5-6 curriculum band and 3/4/5-point progression", lastVerified: "2026-09-11" },
    { id: "maa-amc-current-scope", authority: "Mathematical Association of America", url: "https://maa.org/student-programs/amc/", use: "AMC 8 topic and format boundary", lastVerified: "2026-09-11" }
  ]);

  const programs = freeze([
    { id: "sasmo-g6", title: "SASMO Grade 6", sourceId: "sasmo-official-syllabus", stage: "Grade 6", format: "GFIELD practice · five choices", accent: "#2456c4" },
    { id: "math-kangaroo-g5-6", title: "Math Kangaroo Grades 5-6", sourceId: "math-kangaroo-g5-6-curriculum", stage: "Grades 5-6", format: "GFIELD practice · 3/4/5-point type bands", accent: "#7b4a36" },
    { id: "amc-8-bridge", title: "AMC 8 Bridge", sourceId: "maa-amc-current-scope", stage: "Grade 6 foundation", format: "GFIELD practice · five choices", accent: "#285345" }
  ]);

  const items = freeze([
    item({ id: "sasmo-g6-model-01", programId: "sasmo-g6", typeId: "model-method-sum-difference", axis: "problem-solving-strategies", tier: "section-a", typeTitle: tr("합과 차를 이용한 모델 방법", "Model method with sum and difference", "用和与差的模型方法"), prompt: tr("두 상자에 구슬이 모두 86개 있습니다. 첫째 상자에는 둘째 상자보다 14개 더 많습니다. 첫째 상자에는 몇 개가 있습니까?", "Two boxes contain 86 marbles altogether. The first has 14 more than the second. How many marbles are in the first box?", "两个盒子共有86颗弹珠。第一个盒子比第二个多14颗。第一个盒子有多少颗？"), choices: numericChoices([36, 43, 50, 57, 72]), model: { kind: "sum-difference-larger", sum: 86, difference: 14 }, solution: tr("차이 14개를 먼저 떼면 두 상자가 똑같아집니다. (86−14)÷2=36이 둘째 상자이고, 36+14=50입니다.", "Remove the difference first: (86−14)÷2=36 in the second box, so the first has 36+14=50.", "先去掉相差的14颗：(86−14)÷2=36，所以第一个盒子有36+14=50颗。"), misconception: "halve-total-without-removing-difference" }),
    item({ id: "sasmo-g6-pattern-01", programId: "sasmo-g6", typeId: "alternating-operation-pattern", axis: "patterns-algebra", tier: "section-a", typeTitle: tr("번갈아 적용되는 규칙", "Alternating-operation pattern", "交替运算规律"), prompt: tr("수열 2, 6, 5, 15, 14, 42, …에서는 ×3과 −1을 번갈아 적용합니다. 다음 수는 무엇입니까?", "The sequence 2, 6, 5, 15, 14, 42, … alternates ×3 and −1. What is the next number?", "数列2、6、5、15、14、42、……交替进行×3和−1。下一个数是多少？"), choices: numericChoices([39, 40, 41, 43, 126]), model: { kind: "alternating-operations", start: 2, operations: [["multiply",3],["subtract",1],["multiply",3],["subtract",1],["multiply",3],["subtract",1]] }, solution: tr("42 다음에는 −1 규칙을 적용하므로 42−1=41입니다.", "The operation after 42 is −1, so 42−1=41.", "42后应进行−1，所以42−1=41。"), misconception: "repeat-last-operation" }),
    item({ id: "sasmo-g6-divisibility-01", programId: "sasmo-g6", typeId: "missing-digit-divisibility", axis: "number-operations", tier: "section-a", typeTitle: tr("배수 조건을 만족하는 빈 자리", "Missing digit under a divisibility condition", "满足整除条件的缺失数字"), prompt: tr("세 자리 수 42□가 9의 배수입니다. □에 들어갈 숫자는 무엇입니까?", "The three-digit number 42□ is divisible by 9. Which digit belongs in the box?", "三位数42□能被9整除。□中应填哪个数字？"), choices: numericChoices([1, 2, 3, 6, 9]), model: { kind: "missing-digit-divisibility", hundredsTens: 42, divisor: 9 }, solution: tr("각 자리 숫자의 합은 4+2+□입니다. 9의 배수가 되려면 합이 9여야 하므로 □=3입니다.", "The digit sum is 4+2+□. It must equal 9, so □=3.", "各位数字之和为4+2+□。它必须等于9，所以□=3。"), misconception: "use-last-digit-rule" }),
    item({ id: "sasmo-g6-geometry-01", programId: "sasmo-g6", typeId: "composite-area-cutout", axis: "geometry-spatial", tier: "section-b", typeTitle: tr("큰 도형에서 잘라 낸 넓이", "Area by subtracting a cutout", "用大图形减去缺口求面积"), prompt: tr("가로 12, 세로 8인 직사각형의 오른쪽 위에서 가로 3, 세로 4인 직사각형을 잘라 냈습니다. 남은 도형의 넓이는 얼마입니까?", "A 3-by-4 rectangle is cut from the upper-right corner of a 12-by-8 rectangle. What is the remaining area?", "从一个长12、宽8的长方形右上角切去一个长3、宽4的长方形。剩余面积是多少？"), choices: numericChoices([72, 80, 84, 87, 96]), model: { kind: "rectangle-minus-cutout", width: 12, height: 8, cutWidth: 3, cutHeight: 4 }, visual: { kind: "corner-cutout", width: 12, height: 8, cutWidth: 3, cutHeight: 4 }, solution: tr("전체 넓이 12×8=96에서 잘라 낸 넓이 3×4=12를 빼면 84입니다.", "Subtract the cutout from the whole rectangle: 12×8−3×4=96−12=84.", "用整体减去缺口：12×8−3×4=96−12=84。"), misconception: "subtract-side-lengths" }),
    item({ id: "sasmo-g6-logic-01", programId: "sasmo-g6", typeId: "partial-order-forced-position", axis: "combinatorics-logic", tier: "section-b", typeTitle: tr("순서 조건에서 반드시 정해지는 위치", "Forced position from ordering clues", "根据顺序条件确定必然位置"), prompt: tr("하나, 민, 준, 유리가 달리기를 했습니다. 하나는 민보다 앞섰고, 민은 준보다 앞섰으며, 유리는 하나보다 뒤였습니다. 반드시 1등인 사람은 누구입니까?", "Hana finished ahead of Min, Min ahead of Jun, and Yuri behind Hana. Who must have finished first?", "Hana在Min前，Min在Jun前，Yuri在Hana后。谁一定是第一名？"), choices: [choice("A","Hana",tr("하나","Hana","Hana")),choice("B","Min",tr("민","Min","Min")),choice("C","Jun",tr("준","Jun","Jun")),choice("D","Yuri",tr("유리","Yuri","Yuri")),choice("E","unknown",tr("정할 수 없음","Cannot be determined","无法确定"))], model: { kind: "unique-zero-indegree", nodes: ["Hana","Min","Jun","Yuri"], before: [["Hana","Min"],["Min","Jun"],["Hana","Yuri"]] }, solution: tr("하나는 민·준보다 앞이고 유리보다도 앞입니다. 따라서 하나만 모든 조건에서 1등입니다.", "Hana is ahead of Min and Jun, and also ahead of Yuri. Only Hana can be first.", "Hana在Min、Jun和Yuri之前，所以只有Hana一定是第一名。"), misconception: "read-only-one-clue" }),

    item({ id: "mk56-weights-01", programId: "math-kangaroo-g5-6", typeId: "minimum-subset-balance", axis: "combinatorics-logic", tier: "3-point", typeTitle: tr("저울을 맞추는 최소 추의 개수", "Minimum number of weights", "平衡天平所需的最少砝码数"), prompt: tr("365g 물건을 한쪽에 놓았습니다. 다른 쪽에는 200g, 100g, 50g, 20g, 10g, 5g 추를 각각 한 번씩 쓸 수 있습니다. 균형을 맞추는 데 필요한 최소 추의 개수는 몇 개입니까?", "An object weighs 365 g. You may use 200 g, 100 g, 50 g, 20 g, 10 g, and 5 g weights at most once each. What is the minimum number of weights needed?", "一个物体重365克。200克、100克、50克、20克、10克和5克的砝码各最多使用一次。最少需要几个砝码？"), choices: numericChoices([2,3,4,5,6]), model: { kind: "minimum-subset-count", target: 365, weights: [200,100,50,20,10,5] }, solution: tr("200+100+50+10+5=365이므로 5개로 만들 수 있습니다. 큰 추 4개를 골라도 가능한 최대 합은 370이고 365가 되는 조합은 없으므로 최소는 5개입니다.", "200+100+50+10+5=365 uses five weights. Exhaustive checking shows no subset of four or fewer totals 365.", "200+100+50+10+5=365，共用5个砝码。逐一检查可知4个或更少的砝码无法组成365。"), misconception: "greedy-stop-before-exact" }),
    item({ id: "mk56-clock-01", programId: "math-kangaroo-g5-6", typeId: "clock-hand-angle", axis: "geometry-spatial", tier: "3-point", typeTitle: tr("시계바늘이 만드는 작은 각", "Smaller angle between clock hands", "钟表指针形成的较小角"), prompt: tr("시각이 3시 30분일 때 시침과 분침이 만드는 작은 각은 몇 도입니까?", "At 3:30, what is the smaller angle between the hour and minute hands?", "3时30分时，时针与分针形成的较小夹角是多少度？"), choices: numericChoices([60,75,90,105,120]), model: { kind: "clock-angle", hour: 3, minute: 30 }, solution: tr("분침은 180°에 있고, 시침은 3시에서 30분 동안 15° 움직여 105°에 있습니다. 차이는 75°입니다.", "The minute hand is at 180°. The hour hand is at 90°+15°=105°, so the smaller angle is 75°.", "分针在180°处，时针在90°+15°=105°处，所以较小夹角是75°。"), misconception: "freeze-hour-hand" }),
    item({ id: "mk56-perimeter-01", programId: "math-kangaroo-g5-6", typeId: "corner-cutout-perimeter", axis: "geometry-spatial", tier: "4-point", typeTitle: tr("모서리 조각을 잘라 낸 둘레", "Perimeter after a corner cutout", "切去角块后的周长"), prompt: tr("가로 11, 세로 7인 직사각형의 한 모서리에서 가로 3, 세로 2인 직사각형을 잘라 냈습니다. 남은 도형의 둘레는 얼마입니까?", "A 3-by-2 rectangle is cut from a corner of an 11-by-7 rectangle. What is the perimeter of the remaining shape?", "从一个长11、宽7的长方形角上切去一个长3、宽2的长方形。剩余图形的周长是多少？"), choices: numericChoices([30,32,34,36,38]), model: { kind: "corner-cutout-perimeter", width: 11, height: 7, cutWidth: 3, cutHeight: 2 }, visual: { kind: "corner-cutout", width: 11, height: 7, cutWidth: 3, cutHeight: 2 }, solution: tr("없어진 바깥 변 3과 2 대신 같은 길이의 안쪽 변 3과 2가 생깁니다. 둘레는 원래와 같은 2×(11+7)=36입니다.", "The removed outer lengths 3 and 2 are replaced by equal inner lengths. The perimeter remains 2×(11+7)=36.", "外侧减少的3和2被同样长的内侧边替代，所以周长仍为2×(11+7)=36。"), misconception: "subtract-cutout-sides-from-perimeter" }),
    item({ id: "mk56-paths-01", programId: "math-kangaroo-g5-6", typeId: "shortest-grid-routes", axis: "combinatorics-logic", tier: "4-point", typeTitle: tr("격자에서 가장 짧은 길의 수", "Number of shortest grid routes", "网格中最短路线的条数"), prompt: tr("격자에서 오른쪽으로 3번, 위로 2번 움직여 도착하려고 합니다. 되돌아가지 않는 가장 짧은 길은 모두 몇 가지입니까?", "A shortest grid route uses three moves right and two moves up. How many different shortest routes are possible?", "一条最短网格路线需要向右3次、向上2次。共有多少条不同的最短路线？"), choices: numericChoices([5,6,8,10,12]), model: { kind: "grid-route-count", right: 3, up: 2 }, solution: tr("다섯 자리 움직임 중 위로 가는 두 자리만 고르면 됩니다. 가능한 경우는 10가지입니다.", "Choose the two positions for the up-moves among five moves. There are 10 routes.", "在5次移动中选择2次向上的位置，共有10条路线。"), misconception: "multiply-move-counts" }),
    item({ id: "mk56-fraction-01", programId: "math-kangaroo-g5-6", typeId: "fraction-of-remainder", axis: "number-operations", tier: "5-point", typeTitle: tr("남은 양에 다시 분수 적용하기", "Applying a fraction to the remainder", "对剩余量再次取分数"), prompt: tr("리본의 1/3을 쓰고, 남은 리본의 1/4을 더 썼습니다. 처음 리본의 몇 분의 몇이 남았습니까?", "One third of a ribbon is used, then one fourth of the remainder is used. What fraction of the original ribbon remains?", "先用去一条丝带的1/3，再用去剩余部分的1/4。原丝带还剩几分之几？"), choices: [choice("A","1/3"),choice("B","5/12"),choice("C","1/2"),choice("D","7/12"),choice("E","2/3")], model: { kind: "fraction-of-remainder", firstUsed: [1,3], secondUsed: [1,4] }, solution: tr("처음 사용 후 2/3가 남고, 그중 3/4가 다시 남습니다. (2/3)×(3/4)=1/2입니다.", "After the first use, 2/3 remains. Keeping 3/4 of that gives (2/3)×(3/4)=1/2.", "第一次后剩2/3，再保留其中的3/4：(2/3)×(3/4)=1/2。"), misconception: "subtract-unlike-reference-fractions" }),

    item({ id: "amc8-ratio-01", programId: "amc-8-bridge", typeId: "successive-percent-change", axis: "proportional-reasoning", tier: "early", typeTitle: tr("연속 백분율 변화", "Successive percent change", "连续百分比变化"), prompt: tr("240달러인 자전거를 25% 할인한 뒤, 할인 가격에서 10%를 추가로 할인합니다. 최종 가격은 얼마입니까?", "A $240 bicycle is discounted by 25%, then by another 10% of the discounted price. What is the final price?", "一辆240美元的自行车先打七五折，再按折后价优惠10%。最终价格是多少？"), choices: numericChoices([156,162,168,180,186]), model: { kind: "successive-percent", start: 240, percentsKept: [75,90] }, solution: tr("첫 할인 뒤 240×0.75=180이고, 다시 180×0.90=162입니다.", "After the first discount the price is 240×0.75=180; then 180×0.90=162.", "第一次折扣后为240×0.75=180，再计算180×0.90=162。"), misconception: "add-percent-discounts-to-original" }),
    item({ id: "amc8-probability-01", programId: "amc-8-bridge", typeId: "single-draw-probability", axis: "counting-probability", tier: "early", typeTitle: tr("한 번 뽑기의 확률", "Probability of one draw", "一次抽取的概率"), prompt: tr("주머니에 빨간 공 3개, 파란 공 5개, 초록 공 2개가 있습니다. 공 하나를 무작위로 뽑을 때 빨간 공일 확률은 얼마입니까?", "A bag contains 3 red, 5 blue, and 2 green balls. What is the probability of drawing a red ball?", "袋中有3个红球、5个蓝球和2个绿球。随机取出一个球，取到红球的概率是多少？"), choices: [choice("A","1/5"),choice("B","1/4"),choice("C","3/10"),choice("D","1/3"),choice("E","1/2")], model: { kind: "part-whole-fraction", part: 3, whole: 10 }, solution: tr("전체 공은 3+5+2=10개이고 빨간 공은 3개이므로 확률은 3/10입니다.", "There are 10 balls in all and 3 are red, so the probability is 3/10.", "共有10个球，其中3个是红球，所以概率为3/10。"), misconception: "divide-by-number-of-colors" }),
    item({ id: "amc8-pythagorean-01", programId: "amc-8-bridge", typeId: "pythagorean-distance", axis: "elementary-geometry", tier: "middle", typeTitle: tr("직각삼각형의 빗변", "Hypotenuse of a right triangle", "直角三角形的斜边"), prompt: tr("두 직각변의 길이가 6과 8인 직각삼각형의 빗변 길이는 얼마입니까?", "A right triangle has legs 6 and 8. What is the length of its hypotenuse?", "一个直角三角形的两条直角边长为6和8。斜边长是多少？"), choices: numericChoices([9,10,11,12,14]), model: { kind: "right-triangle-hypotenuse", legA: 6, legB: 8 }, visual: { kind: "right-triangle", legA: 6, legB: 8 }, solution: tr("피타고라스 정리에 따라 빗변의 제곱은 6²+8²=36+64=100이므로 빗변은 10입니다.", "By the Pythagorean theorem, the hypotenuse squared is 6²+8²=100, so its length is 10.", "由勾股定理，斜边平方为6²+8²=100，所以斜边长为10。"), misconception: "add-leg-lengths" }),
    item({ id: "amc8-counting-01", programId: "amc-8-bridge", typeId: "restricted-digit-arrangements", axis: "counting-probability", tier: "middle", typeTitle: tr("조건이 있는 숫자 배열", "Digit arrangements with a restriction", "带条件的数字排列"), prompt: tr("숫자 1, 2, 3, 4 중 서로 다른 세 숫자로 세 자리 짝수를 만들려고 합니다. 모두 몇 개 만들 수 있습니까?", "How many three-digit even numbers can be formed from distinct digits chosen from 1, 2, 3, and 4?", "从1、2、3、4中选取互不相同的三个数字，可以组成多少个三位偶数？"), choices: numericChoices([6,8,10,12,16]), model: { kind: "distinct-even-arrangements", digits: [1,2,3,4], length: 3 }, solution: tr("일의 자리는 2 또는 4로 2가지입니다. 백의 자리는 남은 3가지, 십의 자리는 남은 2가지이므로 2×3×2=12입니다.", "The units digit has 2 choices, then the hundreds digit has 3 and the tens digit 2. Thus 2×3×2=12.", "个位有2种选择，百位有3种，十位有2种，所以2×3×2=12。"), misconception: "ignore-even-units-condition" }),
    item({ id: "amc8-table-01", programId: "amc-8-bridge", typeId: "linear-rule-from-table", axis: "graphs-tables", tier: "late-bridge", typeTitle: tr("표에서 일차 규칙 찾기", "Linear rule from a table", "从表格中找一次规律"), prompt: tr("표에서 x가 1, 2, 3일 때 y는 각각 5, 8, 11입니다. 같은 규칙에서 x=7일 때 y는 얼마입니까?", "In a table, y is 5, 8, and 11 when x is 1, 2, and 3. Under the same rule, what is y when x=7?", "表中x为1、2、3时，y分别为5、8、11。按同一规律，x=7时y是多少？"), choices: numericChoices([20,21,22,23,24]), model: { kind: "affine-table-value", points: [[1,5],[2,8],[3,11]], input: 7 }, visual: { kind: "xy-table", points: [[1,5],[2,8],[3,11]], input: 7 }, solution: tr("x가 1 늘 때 y는 3씩 늘고, 식은 y=3x+2입니다. x=7이면 3×7+2=23입니다.", "Each increase of 1 in x adds 3 to y, giving y=3x+2. At x=7, y=23.", "x每增加1，y增加3，所以y=3x+2。x=7时，y=23。"), misconception: "continue-only-one-step" })
  ]);

  function gcd(a,b){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
  function fraction(n,d){const g=gcd(n,d),sign=d<0?-1:1;return (sign*n/g)+"/"+(Math.abs(d)/g);}
  function factorial(n){let value=1;for(let i=2;i<=n;i+=1)value*=i;return value;}
  function solve(model) {
    if (model.kind === "sum-difference-larger") return String((model.sum + model.difference) / 2);
    if (model.kind === "alternating-operations") return String(model.operations.reduce(function (value, step) { return step[0] === "multiply" ? value * step[1] : value - step[1]; }, model.start));
    if (model.kind === "missing-digit-divisibility") { const matches=[]; for(let digit=0;digit<=9;digit+=1)if((model.hundredsTens*10+digit)%model.divisor===0)matches.push(digit); if(matches.length!==1)throw new Error("COMPETITION_DIGIT_NOT_UNIQUE"); return String(matches[0]); }
    if (model.kind === "rectangle-minus-cutout") return String(model.width*model.height-model.cutWidth*model.cutHeight);
    if (model.kind === "unique-zero-indegree") { const indegree=Object.fromEntries(model.nodes.map(function(node){return[node,0];})); model.before.forEach(function(edge){indegree[edge[1]]+=1;}); const first=model.nodes.filter(function(node){return indegree[node]===0;}); if(first.length!==1)throw new Error("COMPETITION_ORDER_NOT_UNIQUE"); return first[0]; }
    if (model.kind === "minimum-subset-count") { let best=Infinity; const n=model.weights.length; for(let mask=1;mask<(1<<n);mask+=1){let sum=0,count=0;for(let i=0;i<n;i+=1)if(mask&(1<<i)){sum+=model.weights[i];count+=1;}if(sum===model.target)best=Math.min(best,count);} if(!Number.isFinite(best))throw new Error("COMPETITION_SUBSET_UNREACHABLE"); return String(best); }
    if (model.kind === "clock-angle") { const hour=(model.hour%12)*30+model.minute/2,minute=model.minute*6,diff=Math.abs(hour-minute);return String(Math.min(diff,360-diff)); }
    if (model.kind === "corner-cutout-perimeter") return String(2*(model.width+model.height));
    if (model.kind === "grid-route-count") return String(factorial(model.right+model.up)/(factorial(model.right)*factorial(model.up)));
    if (model.kind === "fraction-of-remainder") return fraction((model.firstUsed[1]-model.firstUsed[0])*(model.secondUsed[1]-model.secondUsed[0]),model.firstUsed[1]*model.secondUsed[1]);
    if (model.kind === "successive-percent") return String(model.percentsKept.reduce(function(value,percent){return value*percent/100;},model.start));
    if (model.kind === "part-whole-fraction") return fraction(model.part,model.whole);
    if (model.kind === "right-triangle-hypotenuse") { const squared=model.legA*model.legA+model.legB*model.legB,root=Math.sqrt(squared);if(!Number.isInteger(root))throw new Error("COMPETITION_HYPOTENUSE_NOT_INTEGER");return String(root); }
    if (model.kind === "distinct-even-arrangements") { const values=[]; function visit(prefix,remaining){if(prefix.length===model.length){const number=Number(prefix.join(""));if(number%2===0)values.push(number);return;}remaining.forEach(function(digit,index){visit(prefix.concat(digit),remaining.slice(0,index).concat(remaining.slice(index+1)));});} visit([],model.digits);return String(values.length); }
    if (model.kind === "affine-table-value") { const a=(model.points[1][1]-model.points[0][1])/(model.points[1][0]-model.points[0][0]),b=model.points[0][1]-a*model.points[0][0]; if(model.points.some(function(p){return a*p[0]+b!==p[1];}))throw new Error("COMPETITION_TABLE_NOT_LINEAR"); return String(a*model.input+b); }
    throw new Error("COMPETITION_MODEL_UNSUPPORTED");
  }

  function answerId(candidate) { const answer=solve(candidate.model),matches=candidate.choices.filter(function(row){return row.value===answer;}); if(matches.length!==1)throw new Error("COMPETITION_ANSWER_NOT_UNIQUE:"+candidate.id); return matches[0].id; }
  function text(value,locale){return value[(locale==="zh"?"zh-Hans":locale)||"ko"]||value.ko;}
  function esc(value){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function renderVisual(candidate,locale) {
    const visual=candidate.visual;if(!visual)return"";const r=sharedRenderer;if(!r)return"";
    if(visual.kind==="corner-cutout"){
      const scale=Math.min(18,180/visual.width,105/visual.height),x=35,y=20,w=visual.width*scale,h=visual.height*scale,cw=visual.cutWidth*scale,ch=visual.cutHeight*scale;
      const points=[{px:x,py:y},{px:x+w-cw,py:y},{px:x+w-cw,py:y+ch},{px:x+w,py:y+ch},{px:x+w,py:y+h},{px:x,py:y+h}];
      const shape=r.polygon(points,"#eaf0ff","#2456c4"); const labels='<text x="'+(x+w/2)+'" y="'+(y+h+22)+'" text-anchor="middle">'+visual.width+'</text><text x="'+(x-14)+'" y="'+(y+h/2)+'" text-anchor="middle">'+visual.height+'</text><text x="'+(x+w-cw/2)+'" y="'+(y+ch-6)+'" text-anchor="middle">'+visual.cutWidth+'</text><text x="'+(x+w-cw-8)+'" y="'+(y+ch/2)+'" text-anchor="end">'+visual.cutHeight+'</text>';
      return r.wrapSvg(shape+labels,{xMin:0,yMin:0,w:260,h:180},"competition-geometry",' role="img" aria-label="'+esc(text(candidate.typeTitle,locale))+'"');
    }
    if(visual.kind==="right-triangle"){
      const a={px:45,py:145},b={px:205,py:145},c={px:45,py:25};const shape=r.polygon([a,b,c],"#eef5f1","#285345");const marks='<path d="M45 133h12v12" fill="none" stroke="#285345"/><text x="125" y="165" text-anchor="middle">'+visual.legB+'</text><text x="27" y="88" text-anchor="middle">'+visual.legA+'</text><text x="132" y="76" text-anchor="middle">?</text>';return r.wrapSvg(shape+marks,{xMin:0,yMin:0,w:250,h:180},"competition-geometry",' role="img" aria-label="'+esc(text(candidate.typeTitle,locale))+'"');
    }
    if(visual.kind==="xy-table"){
      const rows=visual.points.map(function(p){return'<tr><td>'+p[0]+'</td><td>'+p[1]+'</td></tr>';}).join("");return'<table class="competition-data-table" aria-label="x y table"><thead><tr><th>x</th><th>y</th></tr></thead><tbody>'+rows+'<tr><td>'+visual.input+'</td><td>?</td></tr></tbody></table>';
    }
    return"";
  }

  function validateItem(candidate){
    if(!candidate||!/^((sasmo-g6)|(mk56)|(amc8))-[a-z0-9-]+$/.test(candidate.id))throw new Error("COMPETITION_ITEM_ID_INVALID");
    if(!programs.some(function(program){return program.id===candidate.programId;}))throw new Error("COMPETITION_PROGRAM_INVALID");
    ["ko","en","zh-Hans"].forEach(function(locale){if(!candidate.prompt[locale]||!candidate.typeTitle[locale]||!candidate.solution[locale])throw new Error("COMPETITION_LOCALE_INVALID:"+candidate.id);});
    if(candidate.contentOrigin!=="gfield-original"||candidate.officialProblem!==false||candidate.sourceUse!=="official-scope-and-format-reference-only")throw new Error("COMPETITION_RIGHTS_INVALID");
    if(candidate.choices.length!==5||new Set(candidate.choices.map(function(row){return row.value;})).size!==5)throw new Error("COMPETITION_CHOICES_INVALID:"+candidate.id);
    if(!candidate.learnerFit||candidate.learnerFit.learnerStage!=="US Grade 6 competition bridge, ages 11-12")throw new Error("COMPETITION_LEARNER_FIT_INVALID");
    answerId(candidate);return true;
  }
  function validateBank(){if(items.length!==15||new Set(items.map(function(row){return row.id;})).size!==15)throw new Error("COMPETITION_BANK_COUNT_INVALID");programs.forEach(function(program){if(items.filter(function(row){return row.programId===program.id;}).length!==5)throw new Error("COMPETITION_PROGRAM_BALANCE_INVALID");});items.forEach(validateItem);return true;}
  validateBank();
  return freeze({ schemaVersion:"1.0.0", learnerStage:"US Grade 6 competition bridge, ages 11-12", sources:sources, programs:programs, items:items, solve:solve, answerId:answerId, text:text, renderVisual:renderVisual, validateItem:validateItem, validateBank:validateBank });
});
