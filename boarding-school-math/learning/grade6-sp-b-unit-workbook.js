(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6SPBUnitWorkbook = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function tr(ko, en, zh) { return freeze({ ko:ko, en:en, "zh-Hans":zh }); }
  function item(definition) { return freeze(definition); }
  function esc(value) { return String(value).replace(/[&<>\"]/g, function (char) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" })[char]; }); }
  function text(value, locale) { return value && (value[locale] || value.en || value.ko) || ""; }
  function gcd(left, right) {
    let a = Math.abs(left); let b = Math.abs(right);
    while (b) { const rest = a % b; a = b; b = rest; }
    return a || 1;
  }
  function rational(numerator, denominator) {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) throw new Error("SPB_RATIONAL_INVALID");
    const sign = denominator < 0 ? -1 : 1;
    const divisor = gcd(numerator, denominator);
    return freeze({ numerator:sign * numerator / divisor, denominator:Math.abs(denominator) / divisor });
  }
  function add(left, right) { return rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator); }
  function subtract(left, right) { return rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator); }
  function absolute(value) { return rational(Math.abs(value.numerator), value.denominator); }
  function fromInteger(value) { return rational(value, 1); }
  function equal(left, right) { return left.numerator === right.numerator && left.denominator === right.denominator; }
  function formatRational(value) { return value.denominator === 1 ? String(value.numerator) : value.numerator + "/" + value.denominator; }
  function sorted(values) { return values.slice().sort(function (left, right) { return left - right; }); }
  function mean(values) { return rational(values.reduce(function (sum, value) { return sum + value; }, 0), values.length); }
  function median(values) {
    const ordered = sorted(values); const middle = Math.floor(ordered.length / 2);
    return ordered.length % 2 ? fromInteger(ordered[middle]) : rational(ordered[middle - 1] + ordered[middle], 2);
  }
  function quartiles(values) {
    const ordered = sorted(values); const middle = Math.floor(ordered.length / 2);
    const lower = ordered.slice(0, middle); const upper = ordered.slice(ordered.length % 2 ? middle + 1 : middle);
    return freeze({ min:fromInteger(ordered[0]), q1:median(lower), median:median(ordered), q3:median(upper), max:fromInteger(ordered[ordered.length - 1]) });
  }
  function mad(values) {
    const center = mean(values);
    const total = values.reduce(function (sum, value) { return add(sum, absolute(subtract(fromInteger(value), center))); }, fromInteger(0));
    return rational(total.numerator, total.denominator * values.length);
  }
  function statistic(values, metric) {
    if (metric === "observations") return fromInteger(values.length);
    if (metric === "mean") return mean(values);
    if (metric === "median") return median(values);
    if (metric === "mad") return mad(values);
    const five = quartiles(values);
    if (metric === "min" || metric === "q1" || metric === "q3" || metric === "max") return five[metric];
    if (metric === "iqr") return subtract(five.q3, five.q1);
    if (metric === "range") return subtract(five.max, five.min);
    throw new Error("SPB_STATISTIC_UNSUPPORTED");
  }
  function mode(values) {
    const counts = new Map(); let best = null; let bestCount = 0; let tied = false;
    values.forEach(function (value) {
      const count = (counts.get(value) || 0) + 1; counts.set(value, count);
      if (count > bestCount) { best = value; bestCount = count; tied = false; }
      else if (count === bestCount && value !== best) tied = true;
    });
    if (tied) throw new Error("SPB_MODE_NOT_UNIQUE");
    return best;
  }
  function binCounts(values, start, width, count) {
    const bins = Array(count).fill(0);
    values.forEach(function (value) {
      const index = Math.floor((value - start) / width);
      if (index < 0 || index >= count) throw new Error("SPB_VALUE_OUTSIDE_HISTOGRAM");
      bins[index] += 1;
    });
    return bins;
  }
  function binLabel(start, width, index) { return (start + width * index) + "–" + (start + width * (index + 1) - 1); }

  const LEARNER_FIT = freeze({
    grade:"US Grade 6", ages:"11-12", prerequisites:["whole-number operations","mean and median from 6.SP.A"],
    representations:["dot plot","histogram","box plot","interquartile range","mean absolute deviation"], status:"reviewed"
  });
  const PLOT_STANDARD = freeze(["6.SP.B.4"]);
  const SUMMARY_STANDARD = freeze(["6.SP.B.5"]);
  const BOTH_STANDARDS = freeze(["6.SP.B.4","6.SP.B.5"]);

  function base(definition) {
    return item(Object.assign({ responseFormat:"decimal-or-fraction", learnerFit:LEARNER_FIT, evidenceBoundary:"supporting-auto-check" }, definition));
  }
  function dot(id, section, level, operation, values, settings) {
    const option = settings || {}; const target = option.target; const lower = option.lower; const upper = option.upper;
    let prompt;
    if (operation === "frequency") prompt = tr("자료를 점그래프로 나타낸 뒤 " + target + " 위에 놓이는 점의 수를 구하세요.", "Display the data in a dot plot. How many dots are above " + target + "?", "把数据画成点图后，求 " + target + " 上方点的个数。");
    else if (operation === "observations") prompt = tr("점그래프에 나타난 자료는 모두 몇 개인가요?", "How many observations are shown in the dot plot?", "点图中一共表示了多少个数据？");
    else if (operation === "mode") prompt = tr("점이 가장 많이 쌓인 값을 구하세요.", "Which value has the greatest frequency?", "求点堆得最多的数值。");
    else prompt = tr(lower + "부터 " + upper + "까지(양 끝 포함)에 놓이는 점은 모두 몇 개인가요?", "How many dots are from " + lower + " through " + upper + ", inclusive?", "从 " + lower + " 到 " + upper + "（包括两端）共有多少个点？");
    return base({ id:id, section:section, strand:"dot-plots", standardIds:PLOT_STANDARD, level:level, kind:"dot-plot", prompt:prompt,
      question:option.context, data:freeze({ operation:operation, values:freeze(values), target:target, lower:lower, upper:upper, showPlot:option.showPlot === true }), errorCode:"dot-frequency" });
  }
  function histogram(id, section, level, operation, values, start, width, count, settings) {
    const option = settings || {}; const targetBin = option.targetBin; const firstBin = option.firstBin; const lastBin = option.lastBin;
    let prompt; let choices;
    if (operation === "bin-count") prompt = tr(binLabel(start,width,targetBin) + " 구간의 도수를 구하세요.", "Find the frequency in the " + binLabel(start,width,targetBin) + " interval.", "求 " + binLabel(start,width,targetBin) + " 这一组的频数。");
    else if (operation === "total") prompt = tr("히스토그램에 나타난 자료는 모두 몇 개인가요?", "How many observations are represented in the histogram?", "直方图中一共表示了多少个数据？");
    else if (operation === "combined-count") prompt = tr(binLabel(start,width,firstBin) + " 구간부터 " + binLabel(start,width,lastBin) + " 구간까지의 도수를 모두 더하세요.", "Add the frequencies from the " + binLabel(start,width,firstBin) + " interval through the " + binLabel(start,width,lastBin) + " interval.", "把从 " + binLabel(start,width,firstBin) + " 组到 " + binLabel(start,width,lastBin) + " 组的频数相加。");
    else {
      prompt = tr("도수가 가장 큰 구간을 고르세요.", "Choose the interval with the greatest frequency.", "选择频数最大的组。");
      choices = freeze(Array.from({ length:count }, function (_, index) { return freeze({ id:"B"+index, label:tr(binLabel(start,width,index), binLabel(start,width,index), binLabel(start,width,index)) }); }));
    }
    return base({ id:id, section:section, strand:"histograms", standardIds:PLOT_STANDARD, level:level, kind:"histogram", responseFormat:choices?"choice-id":"decimal-or-fraction", prompt:prompt,
      question:option.context, choices:choices, data:freeze({ operation:operation, values:freeze(values), start:start, width:width, count:count, targetBin:targetBin, firstBin:firstBin, lastBin:lastBin, showPlot:option.showPlot === true }), errorCode:"histogram-bins" });
  }
  function box(id, section, level, metric, values, settings) {
    const option = settings || {}; const metricNames = {
      min:tr("최솟값", "minimum", "最小值"), q1:tr("제1사분위수(Q1)", "first quartile (Q1)", "第一四分位数（Q1）"), median:tr("중앙값", "median", "中位数"), q3:tr("제3사분위수(Q3)", "third quartile (Q3)", "第三四分位数（Q3）"), max:tr("최댓값", "maximum", "最大值"), iqr:tr("사분위범위(IQR)", "interquartile range (IQR)", "四分位距（IQR）"), range:tr("범위", "range", "极差")
    };
    const name = metricNames[metric];
    return base({ id:id, section:section, strand:"box-plots", standardIds:BOTH_STANDARDS, level:level, kind:"box-plot", prompt:tr("자료의 " + name.ko + "를 구하세요.", "Find the " + name.en + " of the data.", "求这组数据的" + name["zh-Hans"] + "。"),
      question:option.context, data:freeze({ metric:metric, values:freeze(values), showPlot:option.showPlot === true }), errorCode:"quartile-order" });
  }
  function summary(id, section, level, metric, values, context) {
    const metricNames = {
      observations:tr("자료 수", "number of observations", "数据个数"), mean:tr("평균", "mean", "平均数"), median:tr("중앙값", "median", "中位数"), mad:tr("평균 절대 편차(MAD)", "mean absolute deviation (MAD)", "平均绝对偏差（MAD）"), iqr:tr("사분위범위(IQR)", "interquartile range (IQR)", "四分位距（IQR）")
    };
    const name = metricNames[metric];
    return base({ id:id, section:section, strand:"numerical-summaries", standardIds:SUMMARY_STANDARD, level:level, kind:"summary-statistic", prompt:tr("자료의 " + name.ko + "를 구하세요.", "Find the " + name.en + ".", "求这组数据的" + name["zh-Hans"] + "。"), question:context,
      data:freeze({ metric:metric, values:freeze(values) }), errorCode:metric === "mad" ? "mad-distance" : (metric === "iqr" ? "quartile-order" : "summary-calculation") });
  }
  function semanticChoice(id, label, attributeKey, unitKey) { return freeze({ id:id, label:label, attributeKey:attributeKey, unitKey:unitKey }); }
  function attributeUnit(id, section, level, values, context, attributeKey, unitKey, choices) {
    return base({ id:id, section:section, strand:"context-and-measures", standardIds:SUMMARY_STANDARD, level:level, kind:"attribute-unit", responseFormat:"choice-id",
      prompt:tr("조사한 내용과 측정 단위를 바르게 설명한 것을 고르세요.", "Choose the correct description of the measured attribute and its unit.", "选择对调查内容和测量单位的正确描述。"), question:context, choices:freeze(choices),
      data:freeze({ values:freeze(values), attributeKey:attributeKey, unitKey:unitKey }), errorCode:"attribute-unit" });
  }
  const MEASURE_CHOICES = freeze([
    { id:"MEAN_MAD", label:tr("평균과 평균 절대 편차(MAD)", "Mean and mean absolute deviation (MAD)", "平均数和平均绝对偏差（MAD）") },
    { id:"MEDIAN_IQR", label:tr("중앙값과 사분위범위(IQR)", "Median and interquartile range (IQR)", "中位数和四分位距（IQR）") }
  ]);
  function measureSelection(id, section, level, values, context, shape) {
    return base({ id:id, section:section, strand:"context-and-measures", standardIds:SUMMARY_STANDARD, level:level, kind:"measure-selection", responseFormat:"choice-id",
      prompt:tr("분포의 모양과 맥락을 고려할 때 더 알맞은 중심과 퍼짐의 짝을 고르세요.", "Choose the more appropriate pair of center and variability measures for the distribution and context.", "根据分布形状和情境，选择更合适的一组中心量和离散量。"), question:context, choices:MEASURE_CHOICES,
      data:freeze({ values:freeze(values), shape:shape }), errorCode:"measure-choice" });
  }
  function summaryStatement(id, section, level, values, context, unitKey, choices) {
    return base({ id:id, section:section, strand:"context-and-measures", standardIds:SUMMARY_STANDARD, level:level, kind:"summary-statement", responseFormat:"choice-id",
      prompt:tr("자료의 맥락과 분포를 모두 바르게 요약한 문장을 고르세요.", "Choose the statement that correctly summarizes both the context and the distribution.", "选择同时正确概括情境和数据分布的句子。"), question:context, choices:freeze(choices),
      data:freeze({ values:freeze(values), unitKey:unitKey, centerMetric:"median", spreadMetric:"iqr" }), errorCode:"context-summary" });
  }

  const CTX = freeze({
    cards:tr("한 주 동안 학생들이 완성한 독서 기록 카드 수", "number of reading-log cards students completed in one week", "学生一周内完成的阅读记录卡数量"),
    laps:tr("체육 시간에 학생들이 5분 동안 달린 운동장 바퀴 수", "number of track laps students ran in five minutes", "学生在体育课五分钟内跑的圈数"),
    plants:tr("같은 날 심은 강낭콩의 4주 뒤 키(cm)", "bean-plant heights after four weeks, in centimeters", "同一天种下的菜豆四周后的高度（厘米）"),
    reading:tr("학생들의 하루 독서 시간(분)", "students' daily reading times, in minutes", "学生每天的阅读时间（分钟）"),
    quiz:tr("12점 만점 퀴즈에서 받은 점수", "scores on a 12-point quiz", "满分12分的小测验成绩"),
    steps:tr("학생들이 정해진 시간 동안 걸은 걸음 수", "numbers of steps students took during a fixed time", "学生在规定时间内走的步数"),
    commute:tr("학생들이 집에서 학교까지 오는 데 걸린 시간(분)", "student travel times from home to school, in minutes", "学生从家到学校所用的时间（分钟）"),
    jumps:tr("학생들이 30초 동안 한 줄넘기 횟수", "numbers of jumps students completed in 30 seconds", "学生30秒内完成的跳绳次数")
  });

  const WORKBOOK_ITEMS = freeze([
    dot("spb-w01","dot-plots","foundation","frequency",[2,3,3,4,5,5,5,6],{target:5,showPlot:false,context:CTX.cards}),
    dot("spb-w02","dot-plots","foundation","frequency",[4,4,5,6,6,6,7,8,8],{target:6,showPlot:false,context:CTX.laps}),
    dot("spb-w03","dot-plots","foundation","mode",[1,2,2,3,3,3,4,4,5],{showPlot:false,context:CTX.quiz}),
    dot("spb-w04","dot-plots","core","frequency",[4,5,5,6,8,8,9],{target:7,showPlot:false,context:CTX.cards}),
    dot("spb-w05","dot-plots","core","frequency",[10,11,12,12,12,13,14,14],{target:12,showPlot:true,context:CTX.quiz}),
    dot("spb-w06","dot-plots","core","observations",[6,6,7,8,8,9,9,9,10,10],{showPlot:true,context:CTX.laps}),
    dot("spb-w07","dot-plots","core","mode",[15,16,16,17,18,18,18,19],{showPlot:true,context:CTX.reading}),
    dot("spb-w08","dot-plots","core","interval-count",[19,20,20,21,22,22,22,23,24],{lower:20,upper:22,showPlot:true,context:CTX.jumps}),

    histogram("spb-w09","histograms","foundation","bin-count",[2,3,4,6,7,8,11,12,13,14],0,5,3,{targetBin:1,showPlot:false,context:CTX.cards}),
    histogram("spb-w10","histograms","foundation","bin-count",[12,14,15,18,21,22,24,25,27,29,31,33],10,5,5,{targetBin:2,showPlot:false,context:CTX.reading}),
    histogram("spb-w11","histograms","foundation","bin-count",[31,33,34,35,37,39,41,42,44,48],30,5,4,{targetBin:0,showPlot:false,context:CTX.jumps}),
    histogram("spb-w12","histograms","core","bin-count",[0,2,5,5,7,9,10,12,14,14,15,18],0,5,4,{targetBin:2,showPlot:false,context:CTX.steps}),
    histogram("spb-w13","histograms","core","total",[5,6,7,8,10,11,12,12,14,16,18],5,5,3,{showPlot:true,context:CTX.reading}),
    histogram("spb-w14","histograms","core","largest-bin",[20,21,22,24,25,26,26,27,28,31,34,36],20,5,4,{showPlot:true,context:CTX.jumps}),
    histogram("spb-w15","histograms","core","combined-count",[10,12,14,15,17,19,20,22,24,25,26,28,31],10,5,5,{firstBin:1,lastBin:3,showPlot:true,context:CTX.steps}),
    histogram("spb-w16","histograms","core","largest-bin",[40,42,44,45,46,47,48,49,50,51,52,54,56,58],40,5,4,{showPlot:true,context:CTX.reading}),

    box("spb-w17","box-plots","foundation","q1",[2,4,6,8,10,12,14,16],{showPlot:false,context:CTX.cards}),
    box("spb-w18","box-plots","foundation","median",[1,3,5,7,9,11,13,17],{showPlot:false,context:CTX.quiz}),
    box("spb-w19","box-plots","foundation","q3",[5,6,8,10,12,14,16,18,20,22],{showPlot:false,context:CTX.reading}),
    box("spb-w20","box-plots","core","iqr",[2,4,4,6,8,10,10,12,14,16],{showPlot:false,context:CTX.plants}),
    box("spb-w21","box-plots","core","median",[3,5,7,9,11,13,15,17],{showPlot:true,context:CTX.laps}),
    box("spb-w22","box-plots","core","iqr",[4,6,8,10,12,14,16,18,20,22],{showPlot:true,context:CTX.jumps}),
    box("spb-w23","box-plots","core","max",[1,4,6,8,10,12,14,18],{showPlot:true,context:CTX.cards}),
    box("spb-w24","box-plots","core","range",[10,12,14,16,18,20,22,24,26,30],{showPlot:true,context:CTX.reading}),

    summary("spb-w25","summaries","foundation","observations",[6,8,8,9,10,11,12,12,14],CTX.quiz),
    summary("spb-w26","summaries","foundation","mean",[4,6,8,10,12],CTX.cards),
    summary("spb-w27","summaries","foundation","median",[3,5,7,9,11,13],CTX.laps),
    summary("spb-w28","summaries","core","mad",[4,6,8,10,12],CTX.reading),
    summary("spb-w29","summaries","core","iqr",[2,4,6,8,10,12,14,16],CTX.plants),
    summary("spb-w30","summaries","core","mean",[5,5,7,9,9],CTX.quiz),
    summary("spb-w31","summaries","core","median",[12,14,16,18,20,22],CTX.jumps),
    summary("spb-w32","summaries","core","mad",[5,7,9,11],CTX.steps),

    attributeUnit("spb-w33","context","foundation",[12,14,15,16,18,20],CTX.plants,"plant-height","centimeters",[
      semanticChoice("A",tr("각 강낭콩의 키를 cm로 쟀다.","Each plant's height was measured in centimeters.","测量每株菜豆的高度，单位是厘米。"),"plant-height","centimeters"),
      semanticChoice("B",tr("강낭콩 수를 cm로 쟀다.","The number of plants was measured in centimeters.","测量菜豆的棵数，单位是厘米。"),"plant-count","centimeters"),
      semanticChoice("C",tr("각 강낭콩의 키를 분으로 쟀다.","Each plant's height was measured in minutes.","测量每株菜豆的高度，单位是分钟。"),"plant-height","minutes"),
      semanticChoice("D",tr("관찰한 날짜 수를 cm로 쟀다.","The number of observation days was measured in centimeters.","测量观察天数，单位是厘米。"),"day-count","centimeters")
    ]),
    measureSelection("spb-w34","context","core",[12,13,14,14,15,16,28],CTX.commute,"skewed-outlier"),
    measureSelection("spb-w35","context","core",[18,19,20,20,21,22],CTX.reading,"roughly-symmetric"),
    summaryStatement("spb-w36","context","core",[12,13,14,14,15,16,28],CTX.commute,"minutes",[
      { id:"A", label:tr("자료는 7개이고 단위는 분입니다. 중앙값은 14, 사분위범위는 3이며 28분은 나머지 값에서 두드러지게 큽니다.","There are 7 observations measured in minutes. The median is 14, the IQR is 3, and 28 minutes is strikingly high compared with the other values.","共有7个数据，单位是分钟。中位数是14，四分位距是3，28分钟明显高于其余数据。"), claims:{ observations:7, unitKey:"minutes", centerMetric:"median", centerValue:"14", spreadMetric:"iqr", spreadValue:"3", strikingValue:28 } },
      { id:"B", label:tr("자료는 6개이고 단위는 분입니다. 중앙값은 14, 사분위범위는 3입니다.","There are 6 observations measured in minutes. The median is 14 and the IQR is 3.","共有6个数据，单位是分钟。中位数是14，四分位距是3。"), claims:{ observations:6, unitKey:"minutes", centerMetric:"median", centerValue:"14", spreadMetric:"iqr", spreadValue:"3", strikingValue:28 } },
      { id:"C", label:tr("자료는 7개이고 단위는 점입니다. 중앙값은 14, 사분위범위는 3입니다.","There are 7 observations measured in points. The median is 14 and the IQR is 3.","共有7个数据，单位是分数。中位数是14，四分位距是3。"), claims:{ observations:7, unitKey:"points", centerMetric:"median", centerValue:"14", spreadMetric:"iqr", spreadValue:"3", strikingValue:28 } },
      { id:"D", label:tr("자료는 7개이고 단위는 분입니다. 중앙값은 15, 사분위범위는 16입니다.","There are 7 observations measured in minutes. The median is 15 and the IQR is 16.","共有7个数据，单位是分钟。中位数是15，四分位距是16。"), claims:{ observations:7, unitKey:"minutes", centerMetric:"median", centerValue:"15", spreadMetric:"iqr", spreadValue:"16", strikingValue:28 } }
    ])
  ]);

  const RECHECK_ITEMS = freeze([
    dot("spb-r01","recheck","core","frequency",[1,1,2,3,3,3,4,5],{target:3,showPlot:false,context:CTX.cards}),
    histogram("spb-r02","recheck","core","bin-count",[6,7,9,10,11,14,15,17,18,19,21],5,5,4,{targetBin:2,showPlot:false,context:CTX.jumps}),
    box("spb-r03","recheck","core","q3",[2,4,6,8,10,12,14,16,18,20],{showPlot:false,context:CTX.reading}),
    box("spb-r04","recheck","core","iqr",[1,3,5,7,9,11,13,15],{showPlot:true,context:CTX.quiz}),
    summary("spb-r05","recheck","core","mean",[6,8,10,12,14],CTX.laps),
    summary("spb-r06","recheck","core","mad",[2,4,6,8,10],CTX.steps),
    attributeUnit("spb-r07","recheck","core",[32,35,36,38,40,42],CTX.jumps,"jump-count","jumps",[
      semanticChoice("A",tr("학생마다 30초 동안 한 줄넘기 횟수를 회로 기록했다.","Each student's number of jumps in 30 seconds was recorded in jumps.","记录每名学生30秒内的跳绳次数，单位是次。"),"jump-count","jumps"),
      semanticChoice("B",tr("줄넘기한 시간을 cm로 기록했다.","Jump-rope time was recorded in centimeters.","记录跳绳时间，单位是厘米。"),"jump-time","centimeters"),
      semanticChoice("C",tr("학생 수를 분으로 기록했다.","The number of students was recorded in minutes.","记录学生人数，单位是分钟。"),"student-count","minutes"),
      semanticChoice("D",tr("줄넘기 길이를 회로 기록했다.","Rope length was recorded in jumps.","记录跳绳长度，单位是次。"),"rope-length","jumps")
    ]),
    measureSelection("spb-r08","recheck","core",[9,10,10,11,11,12,26],CTX.commute,"skewed-outlier")
  ]);

  const STRANDS = freeze({
    "dot-plots":tr("점그래프로 나타내고 읽기","Display and read dot plots","画点图并读图"),
    histograms:tr("구간을 정해 히스토그램 읽기","Group and read histograms","分组并读直方图"),
    "box-plots":tr("다섯 수치와 상자그림","Five-number summaries and box plots","五数概括与箱线图"),
    "numerical-summaries":tr("자료 수·중심·퍼짐 구하기","Find count, center, and variability","求数据个数、中心量和离散量"),
    "context-and-measures":tr("맥락에 맞게 분포 설명하기","Describe distributions in context","结合情境描述数据分布")
  });
  const ERROR_GUIDES = freeze({
    "dot-frequency":{ label:tr("점 하나와 자료 하나를 연결하지 못함","Did not connect one dot with one observation","没有把一个点对应一个数据"), prompt:tr("같은 값은 같은 눈금 위에 아래에서부터 점을 하나씩 쌓으세요.","Place one dot for each observation and stack equal values above the same tick.","每个数据画一个点，相同数值的点在同一刻度上由下向上叠放。") },
    "histogram-bins":{ label:tr("구간 경계와 도수를 혼동함","Confused interval boundaries and frequencies","混淆分组边界和频数"), prompt:tr("각 값은 한 구간에만 넣고, 구간마다 들어간 자료 수를 다시 세세요.","Place each value in exactly one interval, then recount each interval.","每个数据只能放入一个组，再重新数每组的数据个数。") },
    "quartile-order":{ label:tr("자료를 정렬하지 않고 사분위수를 구함","Found quartiles before ordering the data","没有先排序就求四分位数"), prompt:tr("자료를 작은 값부터 놓고 중앙값으로 두 부분을 나눈 뒤, 각 부분의 가운데를 찾으세요.","Order the data, split them at the median, and find the middle of each half.","先将数据从小到大排序，再用中位数分成两部分，找出每一半的中间位置。") },
    "summary-calculation":{ label:tr("자료 수 또는 대표값 계산 오류","Error in count or center calculation","数据个数或中心量计算错误"), prompt:tr("자료를 빠짐없이 세고, 정렬 순서와 계산식을 한 줄씩 확인하세요.","Count every observation and check the ordered list and calculation one line at a time.","确认没有漏数，再逐行检查排序结果和计算过程。") },
    "mad-distance":{ label:tr("평균에서 떨어진 거리에 부호를 남김","Kept signs in distances from the mean","计算到平均数的距离时保留了正负号"), prompt:tr("각 값과 평균의 차를 거리로 바꾸어 모두 양수로 더한 뒤 자료 수로 나누세요.","Use absolute distances from the mean, add them, and divide by the number of observations.","求每个数据到平均数的绝对距离，相加后再除以数据个数。") },
    "attribute-unit":{ label:tr("조사한 내용과 단위를 혼동함","Confused the measured attribute and unit","混淆调查内容和测量单位"), prompt:tr("무엇을 쟀는지와 그 값을 어떤 단위로 기록했는지를 따로 확인하세요.","Identify what was measured, then identify the unit used to record it.","先判断测量的内容，再判断记录数值所用的单位。") },
    "measure-choice":{ label:tr("분포 모양을 보지 않고 대표값을 고름","Chose measures without considering distribution shape","没有考虑分布形状就选择统计量"), prompt:tr("한쪽으로 치우치거나 매우 큰 값이 있으면 중앙값과 사분위범위를 먼저 살펴보세요.","For a skewed distribution or a striking value, consider the median and IQR first.","分布偏斜或有明显异常值时，先考虑中位数和四分位距。") },
    "context-summary":{ label:tr("자료 수·단위·중심·퍼짐 중 일부를 빠뜨림","Omitted count, unit, center, or variability","遗漏了数据个数、单位、中心量或离散量"), prompt:tr("자료 수와 단위를 먼저 확인한 뒤 중앙값, 사분위범위, 두드러진 값을 차례로 대조하세요.","Check the count and unit first, then compare the median, IQR, and striking value.","先核对数据个数和单位，再依次核对中位数、四分位距和明显偏离的数据。") }
  });

  const PACK = freeze({
    schemaVersion:1,
    id:"gfield-grade6-sp-b-unit-workbook-v1",
    clusterId:"6.SP.B",
    standardRange:"6.SP.B.4-5",
    completionKey:"gfield-clinic-workbook:6.SP.B:v1",
    standardsAlignment:freeze({ assessed:["6.SP.B.4","6.SP.B.5"], teacherObserved:["independent plot construction","contextual written summary","measure-choice justification"] }),
    sourceReferences:freeze([{ title:"Common Core State Standards for Mathematics", url:"https://corestandards.org/wp-content/uploads/2023/09/ADA-Compliant-Math-Standards.pdf", page:45, standards:["6.SP.B.4","6.SP.B.5"] }]),
    learnerStage:"US Grade 6 ages 11-12", contentOrigin:"gfield-original-authored-public-unit-workbook",
    rights:freeze({ publication:"public", assetRights:"original", containsThirdPartyAssets:false }),
    title:tr("6.SP.B 자료를 그래프로 나타내고 분포 설명하기","6.SP.B Display and Summarize Data Distributions","6.SP.B 用图表示并概括数据分布"),
    subtitle:tr("점그래프·히스토그램·상자그림을 만들고 읽으며, 자료 수·단위·중심·퍼짐·두드러진 값을 맥락에 맞게 설명합니다.","Build and read dot plots, histograms, and box plots, then describe count, units, center, variability, and striking values in context.","画并读点图、直方图和箱线图，再结合情境说明数据个数、单位、中心量、离散量和明显偏离的数据。"),
    scopeNotice:tr("이 책은 미국 6학년 기준 6.SP.B.4-5를 연습합니다. 자동 채점 문항은 그래프의 구성 요소와 수치 요약을 확인합니다. 학생이 직접 점그래프·히스토그램·상자그림을 그리고, 분포 모양과 맥락을 문장으로 설명하는 수행은 교사가 별도로 확인합니다. 자동 점수만으로 완전 숙달·배치·승급을 결정하지 않습니다.","This book practices US Grade 6 standards 6.SP.B.4-5. Auto-checked items verify plot components and numerical summaries. A teacher separately reviews independent construction of dot plots, histograms, and box plots and written explanations connecting distribution shape with context. Auto scores alone do not determine full mastery, placement, or promotion.","本练习册练习美国六年级数学标准6.SP.B.4-5。自动核验题检查图表要素和数值概括；学生独立画点图、直方图、箱线图，并结合情境用文字说明分布形状的表现，由教师另行观察。不能只凭自动得分判断完全掌握、分班或晋级。"),
    conceptPages:freeze([
      { title:tr("개념 1 · 같은 자료, 서로 다른 그래프","Concept 1 · One data set, different plots","概念1 · 同一组数据，不同的图"), body:tr("점그래프는 값 하나하나와 빈도를 보여 줍니다. 히스토그램은 연속된 구간별 도수를 막대 사이의 빈틈 없이 나타냅니다. 상자그림은 최솟값, 제1사분위수, 중앙값, 제3사분위수, 최댓값으로 분포를 압축해 보여 줍니다.","A dot plot shows individual values and frequencies. A histogram groups values into adjacent intervals. A box plot compresses a distribution into its minimum, Q1, median, Q3, and maximum.","点图显示每个数值及其频数；直方图把数据分到相邻的区间；箱线图用最小值、第一四分位数、中位数、第三四分位数和最大值概括分布。"), example:tr("자료를 먼저 작은 값부터 정리하세요. 히스토그램에서는 각 값이 한 구간에만 들어가야 하며, 상자그림에서는 아래쪽 절반과 위쪽 절반의 가운데를 각각 찾아 Q1과 Q3을 구합니다.","Order the data first. In a histogram, every value belongs to exactly one interval. For a box plot, find the medians of the lower and upper halves for Q1 and Q3.","先将数据从小到大排序。直方图中每个数据只能属于一个区间；箱线图中，下半部分和上半部分的中位数分别是Q1和Q3。") },
      { title:tr("개념 2 · 자료를 맥락과 함께 요약하기","Concept 2 · Summarize data in context","概念2 · 结合情境概括数据"), body:tr("좋은 요약에는 자료 수, 조사한 내용과 단위, 중심, 퍼짐, 전체 모양과 두드러진 값이 들어갑니다. 비교적 대칭이고 두드러진 값이 없으면 평균과 평균 절대 편차를, 한쪽으로 치우치거나 두드러진 값이 있으면 중앙값과 사분위범위를 우선 살펴봅니다.","A useful summary reports the number of observations, the attribute and unit, center, variability, overall shape, and striking deviations. Mean and MAD are useful for a roughly symmetric distribution without striking values; median and IQR are more resistant for a skewed distribution or one with striking values.","完整的概括应包括数据个数、调查内容和单位、中心量、离散量、整体形状及明显偏离的数据。分布大致对称且没有明显异常值时，可用平均数和平均绝对偏差；分布偏斜或有明显异常值时，优先用中位数和四分位距。"), example:tr("통학 시간 12, 13, 14, 14, 15, 16, 28분은 중앙값 14분, 사분위범위 3분입니다. 28분이 나머지보다 두드러지게 커서 평균보다 중앙값으로 중심을 설명하는 편이 알맞습니다.","For travel times 12, 13, 14, 14, 15, 16, and 28 minutes, the median is 14 minutes and the IQR is 3 minutes. Because 28 is strikingly high, the median is a more suitable description of center than the mean.","通学时间12、13、14、14、15、16、28分钟的中位数是14分钟，四分位距是3分钟。28分钟明显偏大，因此用中位数描述中心比平均数更合适。") }
    ]),
    teacherObservation:tr("교사 관찰 수행: 새 자료 한 세트를 주고 학생이 (1) 점그래프, (2) 같은 폭의 구간을 사용한 히스토그램, (3) 상자그림을 각각 직접 구성하게 하세요. 이어서 자료 수와 단위, 알맞은 중심과 퍼짐, 분포 모양과 두드러진 값을 맥락에 맞는 문장으로 설명하고 대표값 선택 이유를 말하게 하세요. 그래프 눈금·구간 경계·다섯 수치·설명의 근거를 각각 기록하되 이 기록 하나만으로 승급을 결정하지 않습니다.","Teacher-observed performance: give a new data set and have the learner independently construct (1) a dot plot, (2) a histogram with equal-width intervals, and (3) a box plot. Then ask for a contextual summary naming count and units, suitable measures of center and variability, overall shape, striking values, and the reason for the selected measures. Record scale, bin boundaries, five-number summary, and reasoning separately; do not use this record alone for promotion.","教师观察任务：提供一组新数据，让学生独立画出（1）点图、（2）等组距直方图、（3）箱线图。随后结合情境说明数据个数和单位、合适的中心量和离散量、整体形状、明显偏离的数据及选择统计量的理由。分别记录刻度、分组边界、五数概括和说明依据；不能只凭这一项记录决定晋级。"),
    reflection:tr("교사 확인 · 직접 그래프 만들기","Teacher Check · Construct a Plot","教师检查 · 独立作图"),
    reflectionPrompt:tr("자료 3, 4, 4, 5, 6, 6, 6, 7, 8, 9, 9, 12를 점그래프로 나타내고, 자료 수·단위·중앙값·사분위범위와 두드러진 값을 한 문장으로 설명하세요. 교사는 눈금과 점의 수, 계산, 맥락 설명을 확인합니다.","Display 3, 4, 4, 5, 6, 6, 6, 7, 8, 9, 9, and 12 in a dot plot. In one sentence, report the count, unit, median, IQR, and any striking value. The teacher checks scale, dots, calculations, and context.","把3、4、4、5、6、6、6、7、8、9、9、12画成点图，并用一句话说明数据个数、单位、中位数、四分位距和明显偏离的数据。教师检查刻度、点数、计算和情境说明。"),
    printPlan:freeze({ paperSizes:["A4","Letter"], itemsPerPracticePage:4, studentPages:12, teacherEdition:true, answerSheetSeparate:true }),
    ui:freeze({ sectionOrder:["dot-plots","histograms","box-plots","summaries","context","recheck"], sectionLabels:{
      "dot-plots":tr("1 · 점그래프로 나타내고 읽기","1 · Display and read dot plots","1 · 画点图并读图"),
      histograms:tr("2 · 구간을 정해 히스토그램 읽기","2 · Group and read histograms","2 · 分组并读直方图"),
      "box-plots":tr("3 · 다섯 수치와 상자그림","3 · Five-number summaries and box plots","3 · 五数概括与箱线图"),
      summaries:tr("4 · 자료 수·중심·퍼짐 구하기","4 · Find count, center, and variability","4 · 求数据个数、中心量和离散量"),
      context:tr("5 · 맥락에 맞게 분포 설명하기","5 · Describe distributions in context","5 · 结合情境描述分布"),
      recheck:tr("재확인 · 새 자료","Recheck · New data","复测 · 新数据")
    } }),
    workbookItems:WORKBOOK_ITEMS, recheckItems:RECHECK_ITEMS, strands:STRANDS, errorGuides:ERROR_GUIDES
  });

  function solveNumeric(candidate) {
    const data = candidate.data;
    if (candidate.kind === "dot-plot") {
      if (data.operation === "frequency") return fromInteger(data.values.filter(function (value) { return value === data.target; }).length);
      if (data.operation === "observations") return fromInteger(data.values.length);
      if (data.operation === "mode") return fromInteger(mode(data.values));
      return fromInteger(data.values.filter(function (value) { return value >= data.lower && value <= data.upper; }).length);
    }
    if (candidate.kind === "histogram") {
      const counts = binCounts(data.values,data.start,data.width,data.count);
      if (data.operation === "bin-count") return fromInteger(counts[data.targetBin]);
      if (data.operation === "total") return fromInteger(counts.reduce(function (sum,value) { return sum+value; },0));
      if (data.operation === "combined-count") return fromInteger(counts.slice(data.firstBin,data.lastBin+1).reduce(function (sum,value) { return sum+value; },0));
    }
    if (candidate.kind === "box-plot" || candidate.kind === "summary-statistic") return statistic(data.values,data.metric);
    return null;
  }
  function solveItem(candidate) {
    const numeric = solveNumeric(candidate); if (numeric) return formatRational(numeric);
    if (candidate.kind === "histogram" && candidate.data.operation === "largest-bin") {
      const counts = binCounts(candidate.data.values,candidate.data.start,candidate.data.width,candidate.data.count);
      const highest = Math.max.apply(null,counts); if (counts.filter(function (value) { return value === highest; }).length !== 1) throw new Error("SPB_HISTOGRAM_MAX_NOT_UNIQUE");
      return "B" + counts.indexOf(highest);
    }
    if (candidate.kind === "attribute-unit") {
      const matches = candidate.choices.filter(function (choice) { return choice.attributeKey === candidate.data.attributeKey && choice.unitKey === candidate.data.unitKey; });
      if (matches.length !== 1) throw new Error("SPB_ATTRIBUTE_UNIT_NOT_UNIQUE"); return matches[0].id;
    }
    if (candidate.kind === "measure-selection") return candidate.data.shape === "skewed-outlier" ? "MEDIAN_IQR" : "MEAN_MAD";
    if (candidate.kind === "summary-statement") {
      const five = quartiles(candidate.data.values); const q3 = five.q3.numerator / five.q3.denominator; const iqr = statistic(candidate.data.values,"iqr"); const upperFence = q3 + 1.5 * iqr.numerator / iqr.denominator;
      const striking = candidate.data.values.filter(function (value) { return value > upperFence; });
      if (striking.length !== 1) throw new Error("SPB_STRIKING_VALUE_NOT_UNIQUE");
      const expected = { observations:candidate.data.values.length, unitKey:candidate.data.unitKey, centerMetric:candidate.data.centerMetric,
        centerValue:formatRational(statistic(candidate.data.values,candidate.data.centerMetric)), spreadMetric:candidate.data.spreadMetric,
        spreadValue:formatRational(statistic(candidate.data.values,candidate.data.spreadMetric)), strikingValue:striking[0] };
      const matches = candidate.choices.filter(function (choice) { return Object.keys(expected).every(function (key) { return String(choice.claims[key]) === String(expected[key]); }); });
      if (matches.length !== 1) throw new Error("SPB_SUMMARY_NOT_UNIQUE"); return matches[0].id;
    }
    throw new Error("SPB_KIND_UNSUPPORTED");
  }
  function responseAsRational(response) {
    const normalized = String(response == null ? "" : response).trim().replace(/−/g,"-");
    const fractionMatch = /^(-?\d+)\s*\/\s*([1-9]\d*)$/.exec(normalized);
    if (fractionMatch) return rational(Number(fractionMatch[1]),Number(fractionMatch[2]));
    const decimalMatch = /^(-?)(\d+)(?:\.(\d+))?$/.exec(normalized);
    if (!decimalMatch) return null;
    const decimals = decimalMatch[3] || ""; const denominator = Math.pow(10,decimals.length);
    const numerator = Number((decimalMatch[2] || "0") + decimals) * (decimalMatch[1] === "-" ? -1 : 1);
    return rational(numerator,denominator);
  }
  function evaluateResponse(candidate, response) {
    if (Array.isArray(candidate.choices)) return String(response || "").trim().toUpperCase() === solveItem(candidate);
    const expected = solveNumeric(candidate); const actual = responseAsRational(response); return Boolean(actual && equal(actual,expected));
  }
  function choiceLabel(candidate, choiceId, locale) { const choice = (candidate.choices || []).find(function (entry) { return entry.id === choiceId; }); return choice ? text(choice.label,locale) : ""; }
  function formatResult(candidate) { return solveItem(candidate); }
  function list(values) { return values.join(", "); }
  function solutionFor(candidate, locale) {
    const data = candidate.data; const answer = solveItem(candidate);
    if (candidate.kind === "dot-plot") {
      if (data.operation === "mode") return text(tr("값마다 점의 수를 세면 가장 많이 나타난 값은 ","Counting the dots above each value, the greatest frequency occurs at ","逐个数每个数值上方的点，频数最大的是 "),locale)+answer+".";
      return text(tr("점 하나는 자료 하나를 나타냅니다. 조건에 맞는 점을 세면 ","Each dot represents one observation. Counting the requested dots gives ","一个点表示一个数据。按条件数点可得 "),locale)+answer+".";
    }
    if (candidate.kind === "histogram") {
      const counts=binCounts(data.values,data.start,data.width,data.count); const ledger=counts.map(function (count,index) { return binLabel(data.start,data.width,index)+": "+count; }).join(", ");
      return text(tr("구간별 도수는 ","The interval frequencies are ","各组频数为 "),locale)+ledger+text(tr("이므로 답은 ",", so the answer is ","，所以答案是 "),locale)+(Array.isArray(candidate.choices)?choiceLabel(candidate,answer,locale):answer)+".";
    }
    if (candidate.kind === "box-plot") {
      const five=quartiles(data.values); return text(tr("정렬한 자료의 다섯 수치는 ","The ordered data have five-number summary ","排序后数据的五数概括为 "),locale)+[five.min,five.q1,five.median,five.q3,five.max].map(formatRational).join(", ")+text(tr("이고, 답은 ","; the answer is ","，答案是 "),locale)+answer+".";
    }
    if (candidate.kind === "summary-statistic") {
      if (data.metric === "mad") return text(tr("평균을 구한 뒤 각 값에서 평균까지의 거리를 더하고 자료 수로 나누면 ","Find the mean, add the absolute distances from the mean, and divide by the number of observations to get ","先求平均数，再把每个数据到平均数的绝对距离相加并除以数据个数，得到 "),locale)+answer+".";
      return text(tr("자료 ","For the data ","对于数据 "),locale)+list(data.values)+text(tr("에서 구한 값은 ",", the requested value is ","，所求值为 "),locale)+answer+".";
    }
    if (candidate.kind === "attribute-unit") return choiceLabel(candidate,answer,locale)+" "+text(tr("무엇을 측정했는지와 기록 단위가 모두 맞습니다.","Both the measured attribute and recorded unit are correct.","调查内容和记录单位都正确。"),locale);
    if (candidate.kind === "measure-selection") return choiceLabel(candidate,answer,locale)+". "+(data.shape === "skewed-outlier" ? text(tr("한쪽으로 치우치거나 두드러진 값이 있는 분포에서는 이 두 값이 영향을 덜 받습니다.","These measures are less affected by skew and a striking value.","这两个统计量受偏斜和明显异常值的影响较小。"),locale) : text(tr("비교적 대칭이고 두드러진 값이 없어 평균과 평균 절대 편차로 중심과 퍼짐을 설명할 수 있습니다.","The distribution is roughly symmetric without a striking value, so mean and MAD describe its center and variability.","分布大致对称且没有明显异常值，因此可用平均数和平均绝对偏差描述中心和离散程度。"),locale));
    return choiceLabel(candidate,answer,locale)+" "+text(tr("자료 수, 단위, 중앙값, 사분위범위와 두드러진 값을 모두 바르게 나타냅니다.","It correctly reports the count, unit, median, IQR, and striking value.","它正确说明了数据个数、单位、中位数、四分位距和明显偏离的数据。"),locale);
  }
  function hintFor(candidate, locale) { return text(ERROR_GUIDES[candidate.errorCode].prompt,locale); }

  function dataStrip(values, locale) { return '<div class="spb-data-strip"><span>'+esc(text(tr("자료","Data","数据"),locale))+'</span><strong>'+esc(list(values))+'</strong></div>'; }
  function dotPlotSvg(values, showPlot, locale) {
    const ordered=sorted(values); const min=ordered[0]; const max=ordered[ordered.length-1]; const left=34; const right=326; const y=88; const span=Math.max(1,max-min);
    function x(value){return left+(value-min)*(right-left)/span;}
    let ticks=""; for(let value=min;value<=max;value+=1){ticks+='<line x1="'+x(value)+'" y1="'+(y-4)+'" x2="'+x(value)+'" y2="'+(y+4)+'"/><text x="'+x(value)+'" y="108">'+value+'</text>';}
    let dots=""; if(showPlot){const counts={};ordered.forEach(function(value){counts[value]=(counts[value]||0)+1;dots+='<circle cx="'+x(value)+'" cy="'+(y-10-counts[value]*12)+'" r="5"/>';});}
    return '<svg class="spb-plot spb-dot-plot" viewBox="0 0 360 116" role="img" aria-label="'+esc(text(showPlot?tr("완성된 점그래프","Completed dot plot","完成的点图"):tr("자료를 나타낼 빈 점그래프","Blank dot-plot axis for the data","用于表示数据的空白点图坐标轴"),locale))+'"><g class="spb-axis"><line x1="'+left+'" y1="'+y+'" x2="'+right+'" y2="'+y+'"/>'+ticks+'</g><g class="spb-marks">'+dots+'</g></svg>';
  }
  function histogramSvg(data, locale) {
    const counts=binCounts(data.values,data.start,data.width,data.count); const highest=Math.max.apply(null,counts.concat([1])); const left=30; const base=92; const gap=4; const width=(300-gap*(data.count-1))/data.count;
    let bars=""; counts.forEach(function(count,index){const x=left+index*(width+gap);const height=data.showPlot?Math.max(2,count/highest*62):2;bars+='<rect x="'+x+'" y="'+(base-height)+'" width="'+width+'" height="'+height+'"/><text x="'+(x+width/2)+'" y="108">'+binLabel(data.start,data.width,index)+'</text>';});
    return '<svg class="spb-plot spb-histogram" viewBox="0 0 360 116" role="img" aria-label="'+esc(text(data.showPlot?tr("완성된 히스토그램","Completed histogram","完成的直方图"):tr("자료를 묶어 나타낼 빈 히스토그램","Blank histogram for grouping the data","用于数据分组的空白直方图"),locale))+'"><g class="spb-axis"><line x1="'+left+'" y1="'+base+'" x2="334" y2="'+base+'"/><line x1="'+left+'" y1="20" x2="'+left+'" y2="'+base+'"/></g><g class="spb-bars">'+bars+'</g></svg>';
  }
  function boxPlotSvg(values, locale) {
    const five=quartiles(values); const min=five.min.numerator/five.min.denominator; const max=five.max.numerator/five.max.denominator; const q1=five.q1.numerator/five.q1.denominator; const med=five.median.numerator/five.median.denominator; const q3=five.q3.numerator/five.q3.denominator; const left=36; const right=326; const y=62; const span=Math.max(1,max-min);
    function x(value){return left+(value-min)*(right-left)/span;}
    let ticks=""; const step=span>14?2:1; for(let value=Math.ceil(min);value<=max;value+=step){ticks+='<line x1="'+x(value)+'" y1="'+(y+28)+'" x2="'+x(value)+'" y2="'+(y+34)+'"/><text x="'+x(value)+'" y="112">'+value+'</text>';}
    return '<svg class="spb-plot spb-box-plot" viewBox="0 0 360 118" role="img" aria-label="'+esc(text(tr("수직선 위 상자그림","Box plot on a number line","数轴上的箱线图"),locale))+'"><g class="spb-axis"><line x1="'+left+'" y1="'+(y+31)+'" x2="'+right+'" y2="'+(y+31)+'"/>'+ticks+'</g><g class="spb-box"><line x1="'+x(min)+'" y1="'+y+'" x2="'+x(max)+'" y2="'+y+'"/><line x1="'+x(min)+'" y1="'+(y-12)+'" x2="'+x(min)+'" y2="'+(y+12)+'"/><line x1="'+x(max)+'" y1="'+(y-12)+'" x2="'+x(max)+'" y2="'+(y+12)+'"/><rect x="'+x(q1)+'" y="'+(y-18)+'" width="'+(x(q3)-x(q1))+'" height="36"/><line class="spb-median" x1="'+x(med)+'" y1="'+(y-18)+'" x2="'+x(med)+'" y2="'+(y+18)+'"/></g></svg>';
  }
  function renderVisual(candidate, locale) {
    const context='<p class="spb-context">'+esc(text(candidate.question,locale))+'</p>'; const data=candidate.data;
    if(candidate.kind==="dot-plot") return '<div class="spb-visual">'+context+(data.showPlot?"":dataStrip(data.values,locale))+dotPlotSvg(data.values,data.showPlot,locale)+'</div>';
    if(candidate.kind==="histogram") return '<div class="spb-visual">'+context+(data.showPlot?"":dataStrip(data.values,locale))+histogramSvg(data,locale)+'</div>';
    if(candidate.kind==="box-plot") return '<div class="spb-visual">'+context+(data.showPlot?boxPlotSvg(data.values,locale):dataStrip(data.values,locale))+'</div>';
    return '<div class="spb-visual">'+context+dataStrip(data.values,locale)+'</div>';
  }

  function validateItem(candidate) {
    if(!candidate||!/^spb-[wr]\d{2}$/.test(candidate.id)) throw new Error("SPB_ITEM_INVALID");
    if(!STRANDS[candidate.strand]||!ERROR_GUIDES[candidate.errorCode]) throw new Error("SPB_ALIGNMENT_INVALID");
    if(candidate.learnerFit.status!=="reviewed"||candidate.learnerFit.grade!=="US Grade 6") throw new Error("SPB_LEARNER_FIT_INVALID");
    if(!Array.isArray(candidate.standardIds)||candidate.standardIds.length===0||candidate.standardIds.some(function(id){return !PACK.standardsAlignment.assessed.includes(id);})) throw new Error("SPB_STANDARD_INVALID");
    if(!Array.isArray(candidate.data.values)||candidate.data.values.length<4||candidate.data.values.some(function(value){return !Number.isInteger(value);})) throw new Error("SPB_DATA_INVALID");
    ["ko","en","zh-Hans"].forEach(function(locale){if(!text(candidate.prompt,locale)||!text(candidate.question,locale))throw new Error("SPB_LOCALE_INVALID");});
    if(Array.isArray(candidate.choices)){
      const ids=candidate.choices.map(function(choice){return choice.id;}); if(new Set(ids).size!==ids.length||!ids.includes(solveItem(candidate)))throw new Error("SPB_SINGLE_ANSWER_INVALID");
      candidate.choices.forEach(function(choice){["ko","en","zh-Hans"].forEach(function(locale){if(!text(choice.label,locale))throw new Error("SPB_CHOICE_LOCALE_INVALID");});});
    }else if(!responseAsRational(solveItem(candidate))) throw new Error("SPB_NUMERIC_ANSWER_INVALID");
    if(candidate.kind==="box-plot"&&candidate.data.values.length<6) throw new Error("SPB_BOX_DATA_TOO_SHORT");
    return true;
  }
  function validatePack() {
    const all=PACK.workbookItems.concat(PACK.recheckItems); if(PACK.workbookItems.length!==36||PACK.recheckItems.length!==8||new Set(all.map(function(entry){return entry.id;})).size!==44)throw new Error("SPB_COUNT_INVALID");
    all.forEach(validateItem);
    const counts=Object.fromEntries(PACK.ui.sectionOrder.map(function(section){return[section,PACK.workbookItems.filter(function(entry){return entry.section===section;}).length];}));
    if(counts["dot-plots"]!==8||counts.histograms!==8||counts["box-plots"]!==8||counts.summaries!==8||counts.context!==4)throw new Error("SPB_SECTION_COUNT_INVALID");
    if(new Set(PACK.recheckItems.map(function(entry){return entry.strand;})).size!==5)throw new Error("SPB_RECHECK_COVERAGE_INVALID");
    if(PACK.standardsAlignment.assessed.join(",")!=="6.SP.B.4,6.SP.B.5")throw new Error("SPB_STANDARD_COVERAGE_INVALID");
    return true;
  }
  validatePack();
  return freeze({ schemaVersion:1, pack:PACK, rational:rational, mean:mean, median:median, quartiles:quartiles, mad:mad, binCounts:binCounts, statistic:statistic,
    solveItem:solveItem, evaluateResponse:evaluateResponse, choiceLabel:choiceLabel, formatResult:formatResult, solutionFor:solutionFor, hintFor:hintFor, renderVisual:renderVisual,
    validateItem:validateItem, validatePack:validatePack });
});
