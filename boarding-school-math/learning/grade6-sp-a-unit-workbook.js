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

  const QUESTION_CHOICES = freeze([
    { id: "S", label: tr("통계적 질문", "Statistical question", "统计问题") },
    { id: "N", label: tr("통계적 질문이 아님", "Not a statistical question", "不是统计问题") }
  ]);
  const ROLE_CHOICES = freeze([
    { id: "C", label: tr("중심을 나타내는 측도", "Measure of center", "表示中心的度量") },
    { id: "V", label: tr("변이를 나타내는 측도", "Measure of variation", "表示变异的度量") }
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
    return item({ id: id, section: section, strand: "statistical-question", level: level, kind: "question-classification", responseFormat: "choice-id", prompt: tr("다음 질문을 분류하세요.", "Classify the question.", "判断下面的问题类型。"), question: question, choices: QUESTION_CHOICES, data: { expectedMultipleValues: expectedMultipleValues }, errorCode: "single-answer-confusion" });
  }
  function variation(id, section, level, question, options) {
    return item({ id: id, section: section, strand: "anticipated-variability", level: level, kind: "variability-source", responseFormat: "choice-id", prompt: tr("이 통계적 질문에서 학생이나 관측마다 달라질 양을 고르세요.", "Choose the quantity expected to vary from one student or observation to another.", "选择在不同学生或观测中预计会变化的量。"), question: question, choices: freeze(options), data: {}, errorCode: "wrong-varying-quantity" });
  }
  function variabilityChoice(id, label, varies) { return freeze({ id: id, label: label, variesAcrossGroup: varies === true }); }
  function compare(id, section, level, ask, valuesA, valuesB) {
    const prompt = ask === "spread"
      ? tr("범위로 비교할 때 어느 자료가 더 퍼져 있습니까?", "Using range, which data set is more spread out?", "用极差比较时，哪组数据更分散？")
      : tr("평균으로 비교할 때 어느 자료의 중심이 더 큽니까?", "Using the mean, which data set has the greater center?", "用平均数比较时，哪组数据的中心更大？");
    return item({ id: id, section: section, strand: "distribution-features", level: level, kind: "distribution-comparison", responseFormat: "choice-id", prompt: prompt, question: tr("자료 A와 B를 같은 눈금에서 비교하세요.", "Compare data sets A and B on the same scale.", "在同一尺度上比较数据集A和B。"), choices: COMPARE_CHOICES, data: { ask: ask, valuesA: freeze(valuesA), valuesB: freeze(valuesB) }, errorCode: ask === "spread" ? "center-only" : "spread-only" });
  }
  function measure(id, section, level, measureName) {
    return item({ id: id, section: section, strand: "center-vs-variation", level: level, kind: "measure-role", responseFormat: "choice-id", prompt: tr(measureName.ko + "은(는) 중심과 변이 중 무엇을 하나의 수로 나타냅니까?", "Does " + measureName.en + " describe center or variation with one number?", measureName["zh-Hans"] + "用一个数表示中心还是变异？"), question: measureName, choices: ROLE_CHOICES, data: { measure: measureName.key }, errorCode: "measure-role-confusion" });
  }
  function synthesis(id, section, level, valuesA, valuesB) {
    return item({ id: id, section: section, strand: "distribution-synthesis", level: level, kind: "same-center-spread", responseFormat: "choice-id", prompt: tr("두 자료의 평균과 범위를 계산해 옳은 설명을 고르세요.", "Compute the mean and range of both sets, then choose the correct statement.", "计算两组数据的平均数和极差，再选择正确的描述。"), question: tr("중심과 변이를 함께 비교하세요.", "Compare center and variation together.", "同时比较中心和变异。"), choices: SYNTHESIS_CHOICES, data: { valuesA: freeze(valuesA), valuesB: freeze(valuesB) }, errorCode: "one-measure-only" });
  }

  const q = {
    commute: tr("우리 반 학생들은 집에서 학교까지 오는 데 몇 분이 걸리는가?", "How many minutes does it take students in our class to travel from home to school?", "我们班学生从家到学校需要多少分钟？"),
    busColor: tr("3번 통학버스의 색은 무엇인가?", "What color is school bus number 3?", "3号校车是什么颜色？"),
    books: tr("우리 반 학생들은 지난달에 책을 몇 권 읽었는가?", "How many books did students in our class read last month?", "我们班学生上个月读了多少本书？"),
    prime: tr("12는 소수인가?", "Is 12 a prime number?", "12是质数吗？"),
    plants: tr("같은 날 심은 강낭콩들은 4주 뒤 높이가 몇 cm인가?", "How tall are bean plants four weeks after they were planted on the same day?", "同一天种下的菜豆四周后有多高？"),
    noon: tr("오늘 정오에 학교 운동장의 기온은 몇 도인가?", "What is the temperature on the school field at noon today?", "今天中午学校操场的气温是多少？"),
    goals: tr("우리 팀은 이번 시즌 각 경기에서 몇 골을 넣었는가?", "How many goals did our team score in each game this season?", "我们队本赛季每场比赛进了多少球？"),
    area: tr("가로 6 cm, 세로 4 cm인 직사각형의 넓이는 얼마인가?", "What is the area of a rectangle that is 6 cm by 4 cm?", "长6厘米、宽4厘米的长方形面积是多少？"),
    shoes: tr("6학년 학생들의 신발 크기는 얼마인가?", "What are the shoe sizes of Grade 6 students?", "六年级学生的鞋码是多少？"),
    screen: tr("학생들은 지난 토요일에 화면을 몇 분 사용했는가?", "How many minutes of screen time did students have last Saturday?", "学生上周六使用屏幕多少分钟？"),
    heart: tr("학생들의 1분 운동 뒤 심박수는 얼마인가?", "What are students' heart rates after one minute of exercise?", "学生运动一分钟后的心率是多少？"),
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
      variabilityChoice("B", tr("질문한 학년", "The grade being surveyed", "被调查的年级"), false),
      variabilityChoice("C", tr("시간의 단위인 분", "The unit, minutes", "时间单位：分钟"), false)
    ]),
    variation("spa-w10", "variability", "foundation", q.books, [
      variabilityChoice("A", tr("조사한 달", "The month surveyed", "调查的月份"), false),
      variabilityChoice("B", tr("학생마다 읽은 책 수", "Books read by each student", "每名学生读书的数量"), true),
      variabilityChoice("C", tr("반 이름", "The class name", "班级名称"), false)
    ]),
    variation("spa-w11", "variability", "foundation", q.plants, [
      variabilityChoice("A", tr("관찰한 4주", "The four-week observation time", "四周的观察时间"), false),
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
    measure("spa-w28", "measures", "foundation", { key:"mad", ko:"평균절대편차", en:"the mean absolute deviation", "zh-Hans":"平均绝对偏差" }),
    measure("spa-w29", "measures", "core", { key:"mean", ko:"자료의 평균", en:"a data set's mean", "zh-Hans":"一组数据的平均数" }),
    measure("spa-w30", "measures", "core", { key:"range", ko:"자료의 범위", en:"a data set's range", "zh-Hans":"一组数据的极差" }),
    measure("spa-w31", "measures", "core", { key:"median", ko:"자료의 중앙값", en:"a data set's median", "zh-Hans":"一组数据的中位数" }),
    measure("spa-w32", "measures", "core", { key:"mad", ko:"자료의 평균절대편차", en:"a data set's mean absolute deviation", "zh-Hans":"一组数据的平均绝对偏差" }),

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
    "statistical-question": tr("통계적 질문 분류", "Classify statistical questions", "判断统计问题"),
    "anticipated-variability": tr("예상되는 변이 찾기", "Identify anticipated variability", "识别预期变异"),
    "distribution-features": tr("분포의 중심과 퍼짐 읽기", "Read center and spread", "读懂分布的中心与离散"),
    "center-vs-variation": tr("중심 측도와 변이 측도 구분", "Distinguish center and variation", "区分中心度量与变异度量"),
    "distribution-synthesis": tr("중심과 변이를 함께 설명", "Describe center and variation together", "综合描述中心与变异")
  });
  const ERROR_GUIDES = freeze({
    "single-answer-confusion": { label:tr("답이 하나인 질문을 통계로 분류", "Treated a single-answer question as statistical", "把单一答案问题误判为统计问题"), prompt:tr("여러 사람이나 여러 관측에서 값이 달라질 수 있는지 먼저 묻게 하세요.", "Ask whether the question anticipates different values from several people or observations.", "先判断对多人或多次观测是否会得到不同的值。") },
    "wrong-varying-quantity": { label:tr("고정 조건과 변하는 양을 혼동", "Confused a fixed condition with the varying quantity", "混淆固定条件与变化量"), prompt:tr("누구마다 또는 언제마다 달라지는 값을 문장에 표시하게 하세요.", "Have the learner underline the value that changes for each person or observation.", "让学生标出随不同人或不同观测而变化的值。") },
    "center-only": { label:tr("중심만 보고 퍼짐을 판단", "Judged spread from center alone", "只看中心判断离散程度"), prompt:tr("두 끝값의 거리를 각각 계산해 범위를 비교하게 하세요.", "Compute the distance between the two endpoints for each set and compare the ranges.", "分别计算两组数据两端的距离并比较极差。") },
    "spread-only": { label:tr("퍼짐만 보고 중심을 판단", "Judged center from spread alone", "只看离散程度判断中心"), prompt:tr("각 자료의 합을 자료 수로 나누어 평균을 따로 확인하게 하세요.", "Find each mean separately by dividing the sum by the number of values.", "分别用总和除以数据个数求平均数。") },
    "measure-role-confusion": { label:tr("중심 측도와 변이 측도를 뒤바꿈", "Reversed measures of center and variation", "混淆中心度量与变异度量"), prompt:tr("대표 위치를 말하는지, 값들이 떨어진 정도를 말하는지 구분하게 하세요.", "Ask whether the number describes a typical location or how far values spread.", "判断这个数表示典型位置，还是表示数据分散程度。") },
    "one-measure-only": { label:tr("중심 또는 변이 하나만 확인", "Checked only center or only variation", "只检查中心或变异中的一个"), prompt:tr("평균과 범위를 각각 계산한 뒤 한 문장에 함께 쓰게 하세요.", "Compute both mean and range before combining them in one statement.", "先分别计算平均数和极差，再合并成一句话。") }
  });

  const PACK = freeze({
    schemaVersion: 1,
    id: "gfield-grade6-sp-a-unit-workbook-v1",
    clusterId: "6.SP.A",
    standardRange: "6.SP.A.1-3",
    learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-unit-workbook",
    rights: { publication:"public", assetRights:"original", containsThirdPartyAssets:false },
    title: tr("6.SP.A 통계 질문과 변이 단원 워크북", "6.SP.A Statistical Questions and Variability", "6.SP.A 统计问题与变异单元练习册"),
    subtitle: tr("질문에서 변이를 예상하고, 분포의 중심과 퍼짐을 함께 읽습니다.", "Anticipate variability in a question and read center and spread together.", "从问题中预期变异，并综合理解分布的中心与离散。"),
    scopeNotice: tr("이 단원 워크북은 6.SP.A.1-3의 개념 이해와 단일 정답 연습을 제공합니다. 자료 수집 계획을 설명하고 분포를 말로 정당화하는 활동은 교사 관찰로 기록하며, 이 워크북만으로 승급을 자동 판정하지 않습니다.", "This unit workbook provides concept learning and single-answer practice for 6.SP.A.1-3. A teacher records explanations of data-collection plans and verbal justifications of distributions; this workbook alone never determines promotion.", "本单元练习册提供6.SP.A.1-3的概念学习和单一答案练习。数据收集计划与分布解释由教师观察记录，本练习册不能单独决定晋级。"),
    conceptPages: freeze([
      { title:tr("개념 1 · 통계적 질문", "Concept 1 · Statistical questions", "概念1 · 统计问题"), body:tr("통계적 질문은 여러 사람이나 여러 번의 관측에서 서로 다른 값이 나올 것을 예상합니다. 질문 속에서 무엇이 달라질지 말할 수 있어야 합니다.", "A statistical question anticipates different values from several people or repeated observations. You should be able to name what is expected to vary.", "统计问题预期从多人或多次观测中得到不同的值。你应该能指出预计会变化的量。"), example:tr("‘우리 반 학생들의 통학 시간은 몇 분인가?’는 학생마다 시간이 다를 수 있으므로 통계적 질문입니다.", "‘How many minutes do students in our class travel to school?’ is statistical because travel times may differ.", "‘我们班学生上学需要多少分钟？’是统计问题，因为每名学生的时间可能不同。") },
      { title:tr("개념 2 · 중심과 변이", "Concept 2 · Center and variation", "概念2 · 中心与变异"), body:tr("분포는 중심, 퍼짐, 전체 모양으로 설명합니다. 평균과 중앙값은 중심을, 범위와 평균절대편차는 변이를 하나의 수로 나타냅니다.", "Describe a distribution by its center, spread, and overall shape. Mean and median measure center; range and mean absolute deviation measure variation.", "分布可用中心、离散程度和整体形状来描述。平均数和中位数表示中心；极差和平均绝对偏差表示变异。"), example:tr("평균이 같아도 범위가 다르면 두 자료의 퍼짐은 다릅니다. 중심과 변이를 모두 확인해야 합니다.", "Equal means do not imply equal spread. If ranges differ, the distributions vary differently, so check both center and variation.", "平均数相同并不表示离散程度相同。若极差不同，两组分布的变异也不同，因此要同时检查中心和变异。") }
    ]),
    teacherObservation: tr("학생이 직접 통계적 질문을 만들고 예상되는 변이를 말로 설명하게 하세요. 답의 문구보다 ‘누구/무엇을 여러 번 관측하며 어떤 값이 달라지는가’를 명확히 말하는지를 기록합니다.", "Ask the learner to write a statistical question and explain the anticipated variability. Record whether the learner identifies whom or what is observed repeatedly and which value changes.", "请学生自己提出一个统计问题并解释预期变异。记录学生是否明确指出重复观测的对象以及变化的量。"),
    printPlan: freeze({ paperSizes:["A4","Letter"], itemsPerPracticePage:4, studentPages:12, teacherEdition:true, answerSheetSeparate:true }),
    ui: freeze({ sectionOrder:["questions","variability","distributions","measures","synthesis","recheck"], sectionLabels:{
      questions:tr("1 · 통계적 질문인가", "1 · Is it a statistical question?", "1 · 是否为统计问题"),
      variability:tr("2 · 무엇이 달라지는가", "2 · What is expected to vary?", "2 · 什么会发生变化"),
      distributions:tr("3 · 중심과 퍼짐 비교", "3 · Compare center and spread", "3 · 比较中心与离散"),
      measures:tr("4 · 측도의 역할", "4 · Roles of measures", "4 · 度量的作用"),
      synthesis:tr("5 · 중심과 변이 함께 설명", "5 · Explain center and variation together", "5 · 综合说明中心与变异"),
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
      ? text(tr("여러 사람이나 관측에서 값이 달라질 수 있으므로 통계적 질문입니다.", "Different values are expected across people or observations, so the question is statistical.", "不同的人或观测可能得到不同的值，因此这是统计问题。"), locale)
      : text(tr("조건이 정해지면 답이 하나이므로 통계적 질문이 아닙니다.", "The conditions determine one answer, so the question is not statistical.", "条件确定后只有一个答案，因此不是统计问题。"), locale);
    if (candidate.kind === "variability-source") return text(tr("여러 대상이나 관측을 바꿀 때 실제로 달라지는 양은 ‘", "The quantity that changes across subjects or observations is ‘", "在不同对象或观测中会变化的量是“"), locale) + choiceLabel(candidate, answer, locale) + text(tr("’입니다.", "’.", "”。"), locale);
    if (candidate.kind === "distribution-comparison") {
      const a = candidate.data.ask === "spread" ? range(candidate.data.valuesA) : average(candidate.data.valuesA);
      const b = candidate.data.ask === "spread" ? range(candidate.data.valuesB) : average(candidate.data.valuesB);
      const measureName = candidate.data.ask === "spread" ? text(tr("범위", "range", "极差"), locale) : text(tr("평균", "mean", "平均数"), locale);
      return "A " + measureName + " = " + a + ", B " + measureName + " = " + b + ". " + choiceLabel(candidate, answer, locale);
    }
    if (candidate.kind === "measure-role") return choiceLabel(candidate, answer, locale) + ".";
    const meanA = average(candidate.data.valuesA); const meanB = average(candidate.data.valuesB);
    return "A: mean " + meanA + ", range " + range(candidate.data.valuesA) + "; B: mean " + meanB + ", range " + range(candidate.data.valuesB) + ". " + choiceLabel(candidate, answer, locale);
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
