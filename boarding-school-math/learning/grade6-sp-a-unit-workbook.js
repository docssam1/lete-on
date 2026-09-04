(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6SPAUnitWorkbook = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function item(definition) { return freeze(definition); }
  function average(values) { return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length; }
  function range(values) { return Math.max.apply(null, values) - Math.min.apply(null, values); }
  function topicParticle(value) {
    const last = String(value || "").trim().slice(-1);
    const code = last.charCodeAt(0);
    return code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 !== 0 ? "은" : "는";
  }

  const QUESTION_CHOICES = freeze([
    { id: "S", label: tr("통계적 질문", "Statistical question", "统计问题") },
    { id: "N", label: tr("통계적 질문이 아님", "Not a statistical question", "不是统计问题") }
  ]);
  const ROLE_CHOICES = freeze([
    { id: "C", label: tr("자료의 중심을 나타내는 값", "A measure of center", "表示数据中心位置的量") },
    { id: "V", label: tr("자료의 퍼짐을 나타내는 값", "A measure of variability (spread)", "表示数据离散程度的量") }
  ]);
  const COMPARE_CHOICES = freeze([
    { id: "A", label: tr("자료 A", "Data set A", "数据集A") },
    { id: "B", label: tr("자료 B", "Data set B", "数据集B") },
    { id: "E", label: tr("같다", "They are equal", "相同") }
  ]);
  const SYNTHESIS_CHOICES = freeze([
    { id: "A_MORE", label: tr("평균은 같고 A가 더 퍼져 있다.", "The means are equal and A is more spread out.", "平均数相同，A更分散。") },
    { id: "B_MORE", label: tr("평균은 같고 B가 더 퍼져 있다.", "The means are equal and B is more spread out.", "平均数相同，B更分散。") },
    { id: "DIFFERENT_CENTER", label: tr("두 자료의 평균이 다르다.", "The two means are different.", "两组数据的平均数不同。") }
  ]);

  function classify(id, section, level, question, expectedMultipleValues) {
    return item({ id: id, section: section, strand: "statistical-question", level: level, kind: "question-classification", responseFormat: "choice-id", prompt: tr("다음 질문이 통계적 질문인지 판단하세요.", "Decide whether the question is statistical.", "判断下面的问题是不是统计问题。"), question: question, choices: QUESTION_CHOICES, data: { expectedMultipleValues: expectedMultipleValues }, errorCode: "single-answer-confusion" });
  }
  function variation(id, section, level, question, options) {
    return item({ id: id, section: section, strand: "anticipated-variability", level: level, kind: "variability-source", responseFormat: "choice-id", prompt: tr("이 질문에 답하려면 어떤 자료를 모아야 하나요?", "What data should you collect to answer this question?", "要回答这个问题，应该收集什么数据？"), question: question, choices: freeze(options), data: {}, errorCode: "wrong-varying-quantity" });
  }
  function variabilityChoice(id, label, varies) { return freeze({ id: id, label: label, variesAcrossGroup: varies === true }); }
  function compare(id, section, level, ask, valuesA, valuesB) {
    const prompt = ask === "spread"
      ? tr("범위를 구해 보세요. 어느 자료가 더 넓게 퍼져 있습니까?", "Compare the ranges. Which data set has the greater spread?", "比较两组数据的极差。哪组数据更分散？")
      : tr("평균을 구해 보세요. 어느 자료의 평균이 더 큽니까?", "Compare the means. Which data set has the greater mean?", "比较两组数据的平均数。哪组数据的平均数更大？");
    return item({ id: id, section: section, strand: "distribution-features", level: level, kind: "distribution-comparison", responseFormat: "choice-id", prompt: prompt, question: tr("같은 눈금에 나타낸 자료 A와 B를 비교하세요.", "Compare data sets A and B shown on the same scale.", "比较画在同一刻度上的A组和B组数据。"), choices: COMPARE_CHOICES, data: { ask: ask, valuesA: freeze(valuesA), valuesB: freeze(valuesB) }, errorCode: ask === "spread" ? "center-only" : "spread-only" });
  }
  function measure(id, section, level, measureName) {
    return item({ id: id, section: section, strand: "center-vs-variation", level: level, kind: "measure-role", responseFormat: "choice-id", prompt: tr(measureName.ko + topicParticle(measureName.ko) + " 자료의 중심과 퍼짐 중 어느 것을 나타냅니까?", "Does " + measureName.en + " describe the center of the data or their variability (spread)?", measureName["zh-Hans"] + "表示数据的中心位置，还是离散程度？"), question: measureName, choices: ROLE_CHOICES, data: { measure: measureName.key }, errorCode: "measure-role-confusion" });
  }
  function synthesis(id, section, level, valuesA, valuesB) {
    return item({ id: id, section: section, strand: "distribution-synthesis", level: level, kind: "same-center-spread", responseFormat: "choice-id", prompt: tr("두 자료의 평균과 범위를 구한 뒤 옳은 설명을 고르세요.", "Find the mean and range of each data set, then choose the correct statement.", "求出两组数据的平均数和极差，再选择正确的描述。"), question: tr("두 자료의 중심과 퍼진 정도를 함께 비교하세요.", "Compare the center and spread of the two data sets.", "比较两组数据的中心位置和离散程度。"), choices: SYNTHESIS_CHOICES, data: { valuesA: freeze(valuesA), valuesB: freeze(valuesB) }, errorCode: "one-measure-only" });
  }

  const q = {
    commute: tr("우리 반 학생들은 집에서 학교까지 오는 데 몇 분이 걸리는가?", "How many minutes does it take students in our class to travel from home to school?", "我们班学生从家到学校需要多少分钟？"),
    busColor: tr("3번 통학버스의 색은 무엇인가?", "What color is school bus number 3?", "3号校车是什么颜色？"),
    books: tr("우리 반 학생들은 지난달에 책을 몇 권 읽었는가?", "How many books did students in our class read last month?", "我们班学生上个月读了多少本书？"),
    prime: tr("12는 소수인가?", "Is 12 a prime number?", "12是质数吗？"),
    plants: tr("같은 날 심은 강낭콩은 4주 뒤 각각 몇 cm까지 자라는가?", "How tall is each bean plant four weeks after the plants were planted on the same day?", "同一天种下的菜豆，四周后每株有多高？"),
    noon: tr("오늘 정오에 학교 운동장의 기온은 몇 도인가?", "What is the temperature on the school field at noon today?", "今天中午学校操场的气温是多少？"),
    goals: tr("우리 팀은 이번 시즌 각 경기에서 몇 골을 넣었는가?", "How many goals did our team score in each game this season?", "我们队本赛季每场比赛进了多少球？"),
    area: tr("가로 6 cm, 세로 4 cm인 직사각형의 넓이는 얼마인가?", "What is the area of a rectangle that is 6 cm by 4 cm?", "长6厘米、宽4厘米的长方形面积是多少？"),
    shoes: tr("6학년 학생들의 신발 크기는 각각 얼마인가?", "What is each Grade 6 student's shoe size?", "六年级每名学生的鞋码是多少？"),
    screen: tr("학생들은 지난 토요일에 화면을 몇 분 사용했는가?", "How many minutes of screen time did students have last Saturday?", "学生上周六使用屏幕多少分钟？"),
    heart: tr("학생마다 1분 동안 운동한 뒤 심박수는 얼마인가?", "What is each student's heart rate after one minute of exercise?", "每名学生运动一分钟后的心率是多少？"),
    rain: tr("지난 14일 동안 하루 강수량은 얼마였는가?", "How much rain fell on each of the last 14 days?", "过去14天每天的降雨量是多少？")
  };

  const WORKBOOK_ITEMS = freeze([
    classify("spa-w01", "questions", "foundation", q.commute, true),
    classify("spa-w02", "questions", "foundation", q.busColor, false),
    classify("spa-w03", "questions", "foundation", q.books, true),
    classify("spa-w04", "questions", "foundation", q.prime, false),
    classify("spa-w05", "questions", "core", q.plants, true),
    classify("spa-w06", "questions", "core", q.noon, false),
    classify("spa-w07", "questions", "core", q.goals, true),
    classify("spa-w08", "questions", "core", q.area, false),

    variation("spa-w09", "variability", "foundation", q.commute, [
      variabilityChoice("A", tr("학생마다 걸린 시간", "Travel time for each student", "每名学生的通学时间"), true),
      variabilityChoice("B", tr("조사 대상인 우리 반", "Our class, the group being surveyed", "作为调查对象的本班"), false),
      variabilityChoice("C", tr("시간의 단위인 분", "The unit, minutes", "时间单位：分钟"), false)
    ]),
    variation("spa-w10", "variability", "foundation", q.books, [
      variabilityChoice("A", tr("조사한 달", "The month surveyed", "调查的月份"), false),
      variabilityChoice("B", tr("학생마다 읽은 책 수", "Books read by each student", "每名学生读书的数量"), true),
      variabilityChoice("C", tr("반 이름", "The class name", "班级名称"), false)
    ]),
    variation("spa-w11", "variability", "foundation", q.plants, [
      variabilityChoice("A", tr("4주라는 기간", "The four-week period", "四周这一时间段"), false),
      variabilityChoice("B", tr("길이 단위 cm", "The unit, centimeters", "长度单位：厘米"), false),
      variabilityChoice("C", tr("각 식물의 높이", "Height of each plant", "每株植物的高度"), true)
    ]),
    variation("spa-w12", "variability", "core", q.goals, [
      variabilityChoice("A", tr("경기마다 넣은 골 수", "Goals scored in each game", "每场比赛的进球数"), true),
      variabilityChoice("B", tr("이번 시즌이라는 기간", "The time period, this season", "本赛季这一时间范围"), false),
      variabilityChoice("C", tr("경기 종목", "The sport being played", "比赛项目"), false)
    ]),
    variation("spa-w13", "variability", "core", q.shoes, [
      variabilityChoice("A", tr("6학년이라는 학년", "Grade 6", "六年级"), false),
      variabilityChoice("B", tr("각 학생의 신발 크기", "Each student's shoe size", "每名学生的鞋码"), true),
      variabilityChoice("C", tr("학교 이름", "The school name", "学校名称"), false)
    ]),
    variation("spa-w14", "variability", "core", q.screen, [
      variabilityChoice("A", tr("지난 토요일이라는 날짜", "The date, last Saturday", "上周六这一日期"), false),
      variabilityChoice("B", tr("시간 단위인 분", "The unit, minutes", "时间单位：分钟"), false),
      variabilityChoice("C", tr("학생마다 사용한 시간", "Screen time for each student", "每名学生的屏幕使用时间"), true)
    ]),
    variation("spa-w15", "variability", "core", q.heart, [
      variabilityChoice("A", tr("각 학생의 운동 뒤 심박수", "Each student's heart rate after exercise", "每名学生运动后的心率"), true),
      variabilityChoice("B", tr("운동 시간 1분", "The one-minute exercise time", "一分钟的运动时间"), false),
      variabilityChoice("C", tr("측정 단위", "The unit of measure", "测量单位"), false)
    ]),
    variation("spa-w16", "variability", "core", q.rain, [
      variabilityChoice("A", tr("관찰 기간 14일", "The 14-day observation period", "14天的观察期"), false),
      variabilityChoice("B", tr("날짜마다 내린 비의 양", "Rainfall on each day", "每天的降雨量"), true),
      variabilityChoice("C", tr("강수량의 단위", "The rainfall unit", "降雨量单位"), false)
    ]),

    compare("spa-w17", "distributions", "foundation", "spread", [6,7,8,9,10], [7,7,8,9,9]),
    compare("spa-w18", "distributions", "foundation", "spread", [12,12,13,13,14], [10,12,13,14,16]),
    compare("spa-w19", "distributions", "foundation", "center", [4,5,6,7,8], [6,7,8,9,10]),
    compare("spa-w20", "distributions", "foundation", "center", [11,12,13,14,15], [9,10,11,12,13]),
    compare("spa-w21", "distributions", "core", "spread", [2,5,5,5,8], [1,5,5,5,9]),
    compare("spa-w22", "distributions", "core", "spread", [20,22,24,26,28], [18,22,24,26,30]),
    compare("spa-w23", "distributions", "core", "center", [3,6,6,6,9], [4,6,7,8,10]),
    compare("spa-w24", "distributions", "core", "spread", [14,16,18,20,22], [13,17,18,19,23]),

    measure("spa-w25", "measures", "foundation", { key:"mean", ko:"평균", en:"the mean", "zh-Hans":"平均数" }),
    measure("spa-w26", "measures", "foundation", { key:"median", ko:"중앙값", en:"the median", "zh-Hans":"中位数" }),
    measure("spa-w27", "measures", "foundation", { key:"range", ko:"범위", en:"the range", "zh-Hans":"极差" }),
    measure("spa-w28", "measures", "foundation", { key:"mad", ko:"평균 절대 편차", en:"the mean absolute deviation (MAD)", "zh-Hans":"平均绝对偏差" }),
    measure("spa-w29", "measures", "core", { key:"mean", ko:"자료의 평균", en:"a data set's mean", "zh-Hans":"一组数据的平均数" }),
    measure("spa-w30", "measures", "core", { key:"range", ko:"자료의 범위", en:"a data set's range", "zh-Hans":"一组数据的极差" }),
    measure("spa-w31", "measures", "core", { key:"median", ko:"자료의 중앙값", en:"a data set's median", "zh-Hans":"一组数据的中位数" }),
    measure("spa-w32", "measures", "core", { key:"mad", ko:"자료의 평균 절대 편차", en:"a data set's mean absolute deviation (MAD)", "zh-Hans":"一组数据的平均绝对偏差" }),

    synthesis("spa-w33", "synthesis", "core", [4,6,8,10,12], [7,7,8,9,9]),
    synthesis("spa-w34", "synthesis", "core", [10,11,12,13,14], [8,10,12,14,16]),
    synthesis("spa-w35", "synthesis", "advanced", [2,4,6,8,10], [4,5,6,7,8]),
    synthesis("spa-w36", "synthesis", "advanced", [6,7,8,9,10], [8,9,10,11,12])
  ]);

  const RECHECK_ITEMS = freeze([
    classify("spa-r01", "recheck", "core", tr("우리 반 학생들의 생일은 몇 월에 있는가?", "In which months are students in our class born?", "我们班学生分别出生在哪个月？"), true),
    classify("spa-r02", "recheck", "core", tr("1시간은 몇 분인가?", "How many minutes are in one hour?", "一小时有多少分钟？"), false),
    variation("spa-r03", "recheck", "core", q.shoes, [
      variabilityChoice("A", tr("학생마다 다른 신발 크기", "Shoe size for each student", "每名学生不同的鞋码"), true),
      variabilityChoice("B", tr("조사 대상 학년", "The grade surveyed", "被调查的年级"), false),
      variabilityChoice("C", tr("사용한 질문", "The survey question", "所用的调查问题"), false)
    ]),
    variation("spa-r04", "recheck", "core", q.rain, [
      variabilityChoice("A", tr("관찰한 장소", "The observation location", "观测地点"), false),
      variabilityChoice("B", tr("매일의 강수량", "Rainfall for each day", "每天的降雨量"), true),
      variabilityChoice("C", tr("관찰한 14일", "The 14 observed days", "观测的14天"), false)
    ]),
    compare("spa-r05", "recheck", "core", "spread", [3,4,5,6,7], [2,4,5,6,8]),
    compare("spa-r06", "recheck", "core", "center", [5,6,7,8,9], [7,8,9,10,11]),
    measure("spa-r07", "recheck", "core", { key:"range", ko:"범위", en:"the range", "zh-Hans":"极差" }),
    synthesis("spa-r08", "recheck", "advanced", [12,14,16,18,20], [15,15,16,17,17])
  ]);

  const STRANDS = freeze({
    "statistical-question": tr("통계적 질문인지 판단하기", "Decide whether a question is statistical", "判断是否为统计问题"),
    "anticipated-variability": tr("질문에 필요한 자료 찾기", "Identify the data to collect", "确定需要收集的数据"),
    "distribution-features": tr("자료의 중심과 퍼짐 비교하기", "Compare center and spread", "比较数据的中心位置和离散程度"),
    "center-vs-variation": tr("중심과 퍼짐을 나타내는 값 구분하기", "Distinguish measures of center and variability", "区分表示中心位置和离散程度的量"),
    "distribution-synthesis": tr("자료의 중심과 퍼짐 함께 설명하기", "Describe center and variability together", "综合说明中心位置和离散程度")
  });
  const ERROR_GUIDES = freeze({
    "single-answer-confusion": { label:tr("답이 하나로 정해지는 질문을 통계적 질문으로 생각함", "Treated a fixed-answer question as statistical", "把答案固定的问题误判为统计问题"), prompt:tr("사람마다 또는 관찰할 때마다 답이 달라질 수 있는지 먼저 확인하게 하세요.", "Ask whether the answer could differ across people or repeated observations.", "先判断答案是否会因人或每次观测而不同。") },
    "wrong-varying-quantity": { label:tr("질문의 조건과 모아야 할 자료를 혼동함", "Confused a condition in the question with the data to collect", "混淆题目条件和需要收集的数据"), prompt:tr("질문에서 사람마다 또는 날짜마다 기록해야 하는 값을 찾아 표시하게 하세요.", "Have the learner underline the value that must be recorded for each person or observation.", "让学生在题目中标出需要为每个人或每次观测记录的数据。") },
    "center-only": { label:tr("자료의 중심만 보고 퍼짐을 판단함", "Judged spread from center alone", "只看中心位置就判断离散程度"), prompt:tr("각 자료의 가장 큰 값에서 가장 작은 값을 빼서 범위를 비교하게 하세요.", "Subtract the least value from the greatest value in each set, then compare the ranges.", "用每组的最大值减去最小值，再比较极差。") },
    "spread-only": { label:tr("퍼진 정도만 보고 평균을 판단함", "Judged center from spread alone", "只看离散程度就判断中心位置"), prompt:tr("각 자료의 합을 자료 수로 나누어 평균을 따로 구하게 하세요.", "Find each mean separately by dividing the sum by the number of values.", "分别用总和除以数据个数求平均数。") },
    "measure-role-confusion": { label:tr("중심을 나타내는 값과 퍼짐을 나타내는 값을 혼동함", "Confused measures of center and variability", "混淆表示中心位置和离散程度的量"), prompt:tr("이 수가 자료의 대표적인 위치를 말하는지, 값들이 퍼진 정도를 말하는지 구분하게 하세요.", "Ask whether the measure describes a typical location or how spread out the data are.", "判断这个量表示数据的典型位置，还是数据的离散程度。") },
    "one-measure-only": { label:tr("평균과 퍼짐 중 하나만 확인함", "Checked only center or only variability", "只检查了中心位置或离散程度中的一个"), prompt:tr("평균과 범위를 모두 구한 뒤 두 결과를 한 문장으로 설명하게 하세요.", "Find both the mean and range, then use both results in one statement.", "先求平均数和极差，再用一句话同时说明两个结果。") }
  });

  const PACK = freeze({
    schemaVersion: 1,
    id: "gfield-grade6-sp-a-unit-workbook-v1",
    clusterId: "6.SP.A",
    standardRange: "6.SP.A.1-3",
    learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-unit-workbook",
    rights: { publication:"public", assetRights:"original", containsThirdPartyAssets:false },
    title: tr("6.SP.A 통계 질문과 자료의 분포", "6.SP.A Statistical Questions and Data Distributions", "6.SP.A 统计问题与数据分布"),
    subtitle: tr("사람마다 달라지는 답을 찾고, 자료가 어디에 모이고 얼마나 퍼졌는지 살펴봅니다.", "Explore how answers vary and describe the center and spread of numerical data.", "找出因人而异的答案，并描述数据的中心位置和离散程度。"),
    scopeNotice: tr("이 책은 미국 6학년 통계 기준 6.SP.A.1-3을 배웁니다. 통계적 질문과 자료의 중심·퍼짐을 연습합니다. 조사 계획이나 분포를 말로 설명하는 활동은 선생님이 따로 확인하며, 이 책의 점수만으로 승급을 결정하지 않습니다.", "This book teaches US Grade 6 standards 6.SP.A.1-3. Students work with statistical questions and the center and variability of data. A teacher separately reviews data-collection plans and spoken explanations. This book alone does not determine promotion.", "本练习册学习美国六年级数学标准6.SP.A.1-3，练习统计问题以及数据的中心位置和离散程度。调查方案和口头解释由教师另行评估，不能只凭本练习册的成绩决定晋级。"),
    conceptPages: freeze([
      { title:tr("개념 1 · 통계적 질문", "Concept 1 · Statistical questions", "概念1 · 统计问题"), body:tr("통계적 질문은 사람마다 또는 관찰할 때마다 답이 달라질 수 있는 질문입니다. 질문을 읽고 누구의 어떤 값이 달라질지 찾아보세요.", "A statistical question expects the answers to vary. Identify who or what is observed and which value may differ.", "统计问题的答案会因人或每次观测而不同。读题时，要找出观测对象和可能不同的数据。"), example:tr("‘우리 반 학생들은 학교까지 오는 데 몇 분이 걸리는가?’는 학생마다 답이 다를 수 있으므로 통계적 질문입니다.", "‘How many minutes does it take students in our class to travel to school?’ is statistical because the answers may differ from student to student.", "“我们班学生上学需要多少分钟？”是统计问题，因为每名学生的答案可能不同。") },
      { title:tr("개념 2 · 자료의 중심과 퍼짐", "Concept 2 · Center and spread of a distribution", "概念2 · 数据的中心位置与离散程度"), body:tr("자료의 분포는 값들의 대표적인 위치인 ‘중심’, 값들이 흩어진 정도인 ‘퍼짐’, 그리고 전체 모양으로 설명합니다. 평균과 중앙값은 중심을, 범위와 평균 절대 편차는 퍼짐을 나타냅니다.", "Describe a numerical data distribution by its center, spread, and overall shape. The mean and median are measures of center. The range and mean absolute deviation (MAD) are measures of variability, or spread.", "描述一组数值数据的分布时，要看中心位置、离散程度和整体形状。平均数和中位数反映中心位置；极差和平均绝对偏差反映离散程度。"), example:tr("평균이 같아도 범위가 다르면 자료가 퍼진 정도는 다릅니다. 평균과 범위를 함께 살펴보세요.", "Two data sets can have the same mean but different spreads. Compare both the mean and the range.", "两组数据的平均数可以相同，但离散程度不同。因此要同时比较平均数和极差。") }
    ]),
    teacherObservation: tr("학생이 직접 통계적 질문을 만들고 조사할 대상과 모아야 할 자료를 말하게 하세요. 사람마다 또는 관찰할 때마다 답이 달라질 수 있다는 점까지 설명하는지 기록합니다.", "Ask the learner to write a statistical question, identify who or what will be observed, and name the data to collect. Record whether the learner also explains why the answers may vary.", "请学生自己提出一个统计问题，说明调查对象和需要收集的数据，并解释为什么答案可能各不相同。"),
    printPlan: freeze({ paperSizes:["A4","Letter"], itemsPerPracticePage:4, studentPages:12, teacherEdition:true, answerSheetSeparate:true }),
    ui: freeze({ sectionOrder:["questions","variability","distributions","measures","synthesis","recheck"], sectionLabels:{
      questions:tr("1 · 통계적 질문인가", "1 · Is it a statistical question?", "1 · 是否为统计问题"),
      variability:tr("2 · 어떤 자료를 모을까", "2 · What data should we collect?", "2 · 要收集什么数据"),
      distributions:tr("3 · 자료의 중심과 퍼짐 비교", "3 · Compare center and spread", "3 · 比较中心位置和离散程度"),
      measures:tr("4 · 중심과 퍼짐을 나타내는 값", "4 · Measures of center and variability", "4 · 表示中心位置和离散程度的量"),
      synthesis:tr("5 · 중심과 퍼짐 함께 설명", "5 · Explain center and variability together", "5 · 综合说明中心位置和离散程度"),
      recheck:tr("재확인 · 새 문항", "Recheck · New items", "复测 · 新题")
    } }),
    workbookItems: WORKBOOK_ITEMS,
    recheckItems: RECHECK_ITEMS,
    strands: STRANDS,
    errorGuides: ERROR_GUIDES
  });

  function solveItem(candidate) {
    if (candidate.kind === "question-classification") return candidate.data.expectedMultipleValues ? "S" : "N";
    if (candidate.kind === "variability-source") {
      const matches = candidate.choices.filter(function (choice) { return choice.variesAcrossGroup === true; });
      if (matches.length !== 1) throw new Error("SPA_VARIABILITY_NOT_UNIQUE");
      return matches[0].id;
    }
    if (candidate.kind === "distribution-comparison") {
      const left = candidate.data.ask === "spread" ? range(candidate.data.valuesA) : average(candidate.data.valuesA);
      const right = candidate.data.ask === "spread" ? range(candidate.data.valuesB) : average(candidate.data.valuesB);
      return left > right ? "A" : (right > left ? "B" : "E");
    }
    if (candidate.kind === "measure-role") return ["mean","median"].includes(candidate.data.measure) ? "C" : "V";
    if (candidate.kind === "same-center-spread") {
      const meanA = average(candidate.data.valuesA); const meanB = average(candidate.data.valuesB);
      if (meanA !== meanB) return "DIFFERENT_CENTER";
      return range(candidate.data.valuesA) > range(candidate.data.valuesB) ? "A_MORE" : "B_MORE";
    }
    throw new Error("SPA_KIND_UNSUPPORTED");
  }
  function evaluateResponse(candidate, response) { return String(response || "").trim().toUpperCase() === solveItem(candidate); }
  function text(value, locale) { return value && (value[locale] || value.en || value.ko) || ""; }
  function choiceLabel(candidate, choiceId, locale) {
    const choice = candidate.choices.find(function (entry) { return entry.id === choiceId; });
    return choice ? text(choice.label, locale) : "";
  }
  function solutionFor(candidate, locale) {
    const answer = solveItem(candidate);
    if (candidate.kind === "question-classification") return candidate.data.expectedMultipleValues
      ? text(tr("사람마다 또는 관찰할 때마다 답이 달라질 수 있으므로 통계적 질문입니다.", "The answer may differ across people or repeated observations, so the question is statistical.", "答案可能因人或每次观测而不同，因此这是统计问题。"), locale)
      : text(tr("조건이 정해지면 답이 하나이므로 통계적 질문이 아닙니다.", "The conditions determine one answer, so the question is not statistical.", "条件确定后只有一个答案，因此不是统计问题。"), locale);
    if (candidate.kind === "variability-source") return text(tr("이 질문에 답하려면 모아야 할 자료는 ‘", "To answer this question, collect ‘", "要回答这个问题，应收集“"), locale) + choiceLabel(candidate, answer, locale) + text(tr("’입니다.", "’.", "”。"), locale);
    if (candidate.kind === "distribution-comparison") {
      const a = candidate.data.ask === "spread" ? range(candidate.data.valuesA) : average(candidate.data.valuesA);
      const b = candidate.data.ask === "spread" ? range(candidate.data.valuesB) : average(candidate.data.valuesB);
      const measureName = candidate.data.ask === "spread" ? text(tr("범위", "range", "极差"), locale) : text(tr("평균", "mean", "平均数"), locale);
      return "A " + measureName + " = " + a + ", B " + measureName + " = " + b + ". " + choiceLabel(candidate, answer, locale);
    }
    if (candidate.kind === "measure-role") return choiceLabel(candidate, answer, locale) + ".";
    const meanA = average(candidate.data.valuesA); const meanB = average(candidate.data.valuesB);
    const meanName = text(tr("평균", "mean", "平均数"), locale);
    const rangeName = text(tr("범위", "range", "极差"), locale);
    return "A: " + meanName + " = " + meanA + ", " + rangeName + " = " + range(candidate.data.valuesA) + "; B: " + meanName + " = " + meanB + ", " + rangeName + " = " + range(candidate.data.valuesB) + ". " + choiceLabel(candidate, answer, locale);
  }
  function hintFor(candidate, locale) {
    return text(ERROR_GUIDES[candidate.errorCode].prompt, locale);
  }
  function esc(value) { return String(value).replace(/[&<>\"]/g, function (char) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" })[char]; }); }
  function dots(values, rowY) {
    const counts = {};
    return values.slice().sort(function (a,b) { return a-b; }).map(function (value) {
      counts[value] = (counts[value] || 0) + 1;
      return '<circle cx="' + (28 + value * 11) + '" cy="' + (rowY - counts[value] * 10) + '" r="4.2" />';
    }).join("");
  }
  function renderVisual(candidate, locale) {
    if (candidate.kind === "distribution-comparison" || candidate.kind === "same-center-spread") {
      const a = candidate.data.valuesA; const b = candidate.data.valuesB; const max = Math.max.apply(null, a.concat(b));
      let ticks = ""; for (let n=0; n<=max; n+=2) ticks += '<text x="' + (28+n*11) + '" y="126">' + n + '</text>';
      return '<svg class="spa-dot-plots" viewBox="0 0 ' + (Math.max(330, 54+max*11)) + ' 140" role="img" aria-label="' + esc(text(tr("자료 A와 B 점그래프", "Dot plots for data sets A and B", "数据集A和B的点图"), locale)) + '"><g class="plot-axis"><line x1="28" y1="54" x2="' + (34+max*11) + '" y2="54"/><line x1="28" y1="116" x2="' + (34+max*11) + '" y2="116"/></g><g class="plot-label"><text x="10" y="48">A</text><text x="10" y="110">B</text>' + ticks + '</g><g class="plot-dots">' + dots(a,54) + dots(b,116) + '</g></svg>';
    }
    if (candidate.kind === "measure-role") return '<div class="measure-card"><strong>' + esc(text(candidate.question, locale)) + '</strong><span>' + esc(text(tr("하나의 수로 무엇을 설명할까?", "What does this one number describe?", "这个数描述什么？"), locale)) + '</span></div>';
    return '<blockquote class="question-card">' + esc(text(candidate.question, locale)) + '</blockquote>';
  }
  function validateItem(candidate) {
    if (!candidate || !/^spa-[wr]\d{2}$/.test(candidate.id)) throw new Error("SPA_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("SPA_ALIGNMENT_INVALID");
    ["ko","en","zh-Hans"].forEach(function (locale) {
      if (!text(candidate.prompt, locale) || !text(candidate.question, locale)) throw new Error("SPA_LOCALE_INVALID");
      candidate.choices.forEach(function (choice) { if (!text(choice.label, locale)) throw new Error("SPA_CHOICE_LOCALE_INVALID"); });
    });
    const ids = candidate.choices.map(function (choice) { return choice.id; });
    if (new Set(ids).size !== ids.length || !ids.includes(solveItem(candidate))) throw new Error("SPA_SINGLE_ANSWER_INVALID");
    if (candidate.kind === "same-center-spread" && range(candidate.data.valuesA) === range(candidate.data.valuesB) && average(candidate.data.valuesA) === average(candidate.data.valuesB)) throw new Error("SPA_SYNTHESIS_AMBIGUOUS");
    return true;
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 36 || PACK.recheckItems.length !== 8 || new Set(all.map(function (entry) { return entry.id; })).size !== 44) throw new Error("SPA_COUNT_INVALID");
    all.forEach(validateItem);
    const sectionCounts = Object.fromEntries(PACK.ui.sectionOrder.map(function (section) { return [section, PACK.workbookItems.filter(function (entry) { return entry.section === section; }).length]; }));
    if (sectionCounts.questions !== 8 || sectionCounts.variability !== 8 || sectionCounts.distributions !== 8 || sectionCounts.measures !== 8 || sectionCounts.synthesis !== 4) throw new Error("SPA_SECTION_COUNT_INVALID");
    if (new Set(PACK.recheckItems.map(function (entry) { return entry.strand; })).size !== 5) throw new Error("SPA_RECHECK_COVERAGE_INVALID");
    return true;
  }
  validatePack();
  return freeze({ schemaVersion:1, pack:PACK, average:average, range:range, solveItem:solveItem, evaluateResponse:evaluateResponse, choiceLabel:choiceLabel, solutionFor:solutionFor, hintFor:hintFor, renderVisual:renderVisual, validateItem:validateItem, validatePack:validatePack });
});
