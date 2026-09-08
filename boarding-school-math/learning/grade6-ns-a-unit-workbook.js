(function (root, factory) {
  const value = typeof module === "object" && module.exports
    ? factory(require("./grade6-ns-a-clinic-pack.js"))
    : factory(root && root.GFIELDGrade6NSAClinicPack);
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6NSAUnitWorkbook = value;
})(typeof window !== "undefined" ? window : globalThis, function (base) {
  "use strict";

  if (!base || typeof base.solveItem !== "function") throw new Error("NSA_UNIT_BASE_MISSING");

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function tr(ko, en, zh) { return freeze({ ko:ko, en:en, "zh-Hans":zh }); }
  function fraction(numerator, denominator) { return freeze({ numerator:numerator, denominator:denominator }); }
  function item(definition) { return freeze(definition); }
  function legacy(id) {
    return base.pack.workbookItems.concat(base.pack.recheckItems).find(function (candidate) { return candidate.id === id; });
  }
  function adapt(candidate, id, section, standardIds) {
    if (!candidate) throw new Error("NSA_UNIT_LEGACY_ITEM_MISSING");
    return item(Object.assign({}, candidate, { id:id, section:section, standardIds:freeze(standardIds.slice()) }));
  }
  function authored(definition) { return item(definition); }

  const WORKBOOK_ITEMS = freeze([
    adapt(legacy("ns-w01"), "nsa-w01", "models", ["6.NS.A.1"]),
    adapt(legacy("ns-w02"), "nsa-w02", "models", ["6.NS.A.1"]),
    adapt(legacy("ns-w03"), "nsa-w03", "models", ["6.NS.A.1"]),
    authored({ id:"nsa-w04", section:"models", strand:"unit-fraction-count", standardIds:["6.NS.A.1"], level:"foundation", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("5/8 안에는 1/16이 몇 개 들어갑니까?", "How many groups of 1/16 are in 5/8?", "5/8里面有多少个1/16？"), data:{ dividend:fraction(5,8), divisor:fraction(1,16) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),
    authored({ id:"nsa-w05", section:"models", strand:"unit-fraction-count", standardIds:["6.NS.A.1"], level:"foundation", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("2 안에는 1/4이 몇 개 들어갑니까?", "How many groups of 1/4 are in 2?", "2里面有多少个1/4？"), data:{ dividend:fraction(2,1), divisor:fraction(1,4) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),
    authored({ id:"nsa-w06", section:"models", strand:"same-unit-groups", standardIds:["6.NS.A.1"], level:"foundation", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("3/5 안에는 3/10이 몇 개 들어갑니까?", "How many groups of 3/10 are in 3/5?", "3/5里面有多少个3/10？"), data:{ dividend:fraction(3,5), divisor:fraction(3,10) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),
    authored({ id:"nsa-w07", section:"models", strand:"same-unit-groups", standardIds:["6.NS.A.1"], level:"core", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("4/7 안에는 2/7이 몇 개 들어갑니까?", "How many groups of 2/7 are in 4/7?", "4/7里面有多少个2/7？"), data:{ dividend:fraction(4,7), divisor:fraction(2,7) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),
    authored({ id:"nsa-w08", section:"models", strand:"same-unit-groups", standardIds:["6.NS.A.1"], level:"core", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("5/12 안에는 5/18이 몇 개 들어갑니까?", "How many groups of 5/18 are in 5/12?", "5/12里面有多少个5/18？"), data:{ dividend:fraction(5,12), divisor:fraction(5,18) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),
    authored({ id:"nsa-w09", section:"models", strand:"mixed-number-division", standardIds:["6.NS.A.1"], level:"core", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("1과 1/2 안에는 1/6이 몇 개 들어갑니까?", "How many groups of 1/6 are in 1 1/2?", "1又1/2里面有多少个1/6？"), data:{ dividend:fraction(3,2), divisor:fraction(1,6), displayDividend:"1 1/2" }, unit:tr("개","groups","个"), errorCode:"mixed-number-not-converted" }),
    authored({ id:"nsa-w10", section:"models", strand:"same-unit-groups", standardIds:["6.NS.A.1"], level:"core", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("7/8 안에는 7/16이 몇 개 들어갑니까?", "How many groups of 7/16 are in 7/8?", "7/8里面有多少个7/16？"), data:{ dividend:fraction(7,8), divisor:fraction(7,16) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),
    authored({ id:"nsa-w11", section:"models", strand:"mixed-number-division", standardIds:["6.NS.A.1"], level:"advanced", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("2와 2/3 안에는 2/9가 몇 개 들어갑니까?", "How many groups of 2/9 are in 2 2/3?", "2又2/3里面有多少个2/9？"), data:{ dividend:fraction(8,3), divisor:fraction(2,9), displayDividend:"2 2/3" }, unit:tr("개","groups","个"), errorCode:"mixed-number-not-converted" }),
    authored({ id:"nsa-w12", section:"models", strand:"same-unit-groups", standardIds:["6.NS.A.1"], level:"advanced", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("7/9 안에는 1/3이 몇 개 들어갑니까?", "How many groups of 1/3 are in 7/9?", "7/9里面有多少个1/3？"), data:{ dividend:fraction(7,9), divisor:fraction(1,3) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),

    adapt(legacy("ns-w04"), "nsa-w13", "compute", ["6.NS.A.1"]),
    adapt(legacy("ns-w05"), "nsa-w14", "compute", ["6.NS.A.1"]),
    adapt(legacy("ns-w06"), "nsa-w15", "compute", ["6.NS.A.1"]),
    adapt(legacy("ns-w07"), "nsa-w16", "compute", ["6.NS.A.1"]),
    adapt(legacy("ns-w08"), "nsa-w17", "compute", ["6.NS.A.1"]),
    authored({ id:"nsa-w18", section:"compute", strand:"fraction-computation", standardIds:["6.NS.A.1"], level:"foundation", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("3/4 ÷ 5/8을 기약분수로 나타내세요.", "Write 3/4 ÷ 5/8 as a fraction in simplest form.", "把3/4 ÷ 5/8写成最简分数。"), data:{ dividend:fraction(3,4), divisor:fraction(5,8) }, unit:tr("","",""), errorCode:"reciprocal-order" }),
    authored({ id:"nsa-w19", section:"compute", strand:"fraction-computation", standardIds:["6.NS.A.1"], level:"core", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("11/12 ÷ 2/9를 기약분수로 나타내세요.", "Write 11/12 ÷ 2/9 as a fraction in simplest form.", "把11/12 ÷ 2/9写成最简分数。"), data:{ dividend:fraction(11,12), divisor:fraction(2,9) }, unit:tr("","",""), errorCode:"multiplication-not-simplified" }),
    authored({ id:"nsa-w20", section:"compute", strand:"whole-by-fraction", standardIds:["6.NS.A.1"], level:"core", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("5 ÷ 2/3을 기약분수로 나타내세요.", "Write 5 ÷ 2/3 as a fraction in simplest form.", "把5 ÷ 2/3写成最简分数。"), data:{ dividend:fraction(5,1), divisor:fraction(2,3) }, unit:tr("","",""), errorCode:"reciprocal-order" }),
    authored({ id:"nsa-w21", section:"compute", strand:"fraction-computation", standardIds:["6.NS.A.1"], level:"core", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("7/10 ÷ 14/15를 기약분수로 나타내세요.", "Write 7/10 ÷ 14/15 as a fraction in simplest form.", "把7/10 ÷ 14/15写成最简分数。"), data:{ dividend:fraction(7,10), divisor:fraction(14,15) }, unit:tr("","",""), errorCode:"multiplication-not-simplified" }),
    authored({ id:"nsa-w22", section:"compute", strand:"mixed-number-division", standardIds:["6.NS.A.1"], level:"core", kind:"divide-fractions", responseFormat:"fraction-or-whole", prompt:tr("1과 2/3 ÷ 5/6을 계산하세요.", "Calculate 1 2/3 ÷ 5/6.", "计算1又2/3 ÷ 5/6。"), data:{ dividend:fraction(5,3), divisor:fraction(5,6), displayDividend:"1 2/3" }, unit:tr("","",""), errorCode:"mixed-number-not-converted" }),
    authored({ id:"nsa-w23", section:"compute", strand:"mixed-number-division", standardIds:["6.NS.A.1"], level:"advanced", kind:"divide-fractions", responseFormat:"fraction-or-whole", prompt:tr("2와 1/2 ÷ 1과 1/4을 계산하세요.", "Calculate 2 1/2 ÷ 1 1/4.", "计算2又1/2 ÷ 1又1/4。"), data:{ dividend:fraction(5,2), divisor:fraction(5,4), displayDividend:"2 1/2", displayDivisor:"1 1/4" }, unit:tr("","",""), errorCode:"mixed-number-not-converted" }),
    authored({ id:"nsa-w24", section:"compute", strand:"mixed-number-division", standardIds:["6.NS.A.1"], level:"advanced", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("3과 3/5 ÷ 6/7을 기약분수로 나타내세요.", "Write 3 3/5 ÷ 6/7 as a fraction in simplest form.", "把3又3/5 ÷ 6/7写成最简分数。"), data:{ dividend:fraction(18,5), divisor:fraction(6,7), displayDividend:"3 3/5" }, unit:tr("","",""), errorCode:"mixed-number-not-converted" }),

    adapt(legacy("ns-w09"), "nsa-w25", "applications", ["6.NS.A.1"]),
    adapt(legacy("ns-w10"), "nsa-w26", "applications", ["6.NS.A.1"]),
    adapt(legacy("ns-w11"), "nsa-w27", "applications", ["6.NS.A.1"]),
    adapt(legacy("ns-w12"), "nsa-w28", "applications", ["6.NS.A.1"]),
    authored({ id:"nsa-w29", section:"applications", strand:"measurement-division", standardIds:["6.NS.A.1"], level:"foundation", kind:"quantity-per-group", responseFormat:"fraction-or-whole", prompt:tr("길이가 2와 1/4 m인 끈을 3/8 m씩 자르면 같은 길이의 조각이 몇 개 나옵니까?", "A 2 1/4 m rope is cut into pieces that are each 3/8 m long. How many pieces are made?", "把2又1/4米长的绳子每3/8米剪成一段，可以剪成多少段？"), data:{ dividend:fraction(9,4), divisor:fraction(3,8), displayDividend:"2 1/4" }, unit:tr("개","pieces","段"), errorCode:"unit-interpretation" }),
    authored({ id:"nsa-w30", section:"applications", strand:"measurement-division", standardIds:["6.NS.A.1"], level:"foundation", kind:"quantity-per-group", responseFormat:"fraction-or-whole", prompt:tr("5/6 kg의 곡물을 한 봉지에 1/12 kg씩 담습니다. 몇 봉지를 채울 수 있습니까?", "Five-sixths of a kilogram of grain is packed into bags of 1/12 kg each. How many bags can be filled?", "把5/6千克谷物按每袋1/12千克分装，可以装满多少袋？"), data:{ dividend:fraction(5,6), divisor:fraction(1,12) }, unit:tr("봉지","bags","袋"), errorCode:"unit-interpretation" }),
    authored({ id:"nsa-w31", section:"applications", strand:"equal-sharing", standardIds:["6.NS.A.1"], level:"foundation", kind:"equal-share", responseFormat:"fraction-or-whole", prompt:tr("주스 3과 1/2 L를 5병에 똑같이 나누어 담습니다. 한 병에는 몇 L씩 담깁니까?", "Three and one-half liters of juice are divided equally among 5 bottles. How many liters go in each bottle?", "把3又1/2升果汁平均装入5个瓶子。每瓶装多少升？"), data:{ dividend:fraction(7,2), divisor:fraction(5,1), displayDividend:"3 1/2" }, unit:tr("L","liters","升"), errorCode:"share-size-confusion" }),
    authored({ id:"nsa-w32", section:"applications", strand:"equal-sharing", standardIds:["6.NS.A.1"], level:"core", kind:"equal-share", responseFormat:"simplest-fraction", prompt:tr("4/5컵의 소스를 3그릇에 똑같이 나눕니다. 한 그릇에는 몇 컵씩 담깁니까?", "Four-fifths of a cup of sauce is shared equally among 3 bowls. How many cups go in each bowl?", "把4/5杯酱汁平均分到3个碗里。每碗分到多少杯？"), data:{ dividend:fraction(4,5), divisor:fraction(3,1) }, unit:tr("컵","cups","杯"), errorCode:"share-size-confusion" }),
    authored({ id:"nsa-w33", section:"applications", strand:"equal-sharing", standardIds:["6.NS.A.1"], level:"core", kind:"equal-share", responseFormat:"simplest-fraction", prompt:tr("2와 2/3야드의 리본을 4명에게 똑같이 나눕니다. 한 명은 몇 야드씩 받습니까?", "A 2 2/3-yard ribbon is shared equally among 4 people. How many yards does each person receive?", "把2又2/3码长的丝带平均分给4个人。每人分到多少码？"), data:{ dividend:fraction(8,3), divisor:fraction(4,1), displayDividend:"2 2/3" }, unit:tr("야드","yards","码"), errorCode:"share-size-confusion" }),
    authored({ id:"nsa-w34", section:"applications", strand:"fraction-rate", standardIds:["6.NS.A.1"], level:"core", kind:"rate-from-fractions", responseFormat:"fraction-or-whole", prompt:tr("1/2시간 동안 1과 3/4마일을 이동했습니다. 같은 속도라면 한 시간에 몇 마일을 이동합니까?", "A traveler covers 1 3/4 miles in 1/2 hour. At the same speed, how many miles are covered in one hour?", "1/2小时行进1又3/4英里。按相同速度，一小时行进多少英里？"), data:{ dividend:fraction(7,4), divisor:fraction(1,2), displayDividend:"1 3/4" }, unit:tr("마일/시간","miles per hour","英里/小时"), errorCode:"unit-interpretation" }),
    authored({ id:"nsa-w35", section:"applications", strand:"fraction-rate", standardIds:["6.NS.A.1"], level:"advanced", kind:"rate-from-fractions", responseFormat:"simplest-fraction", prompt:tr("3/4시간 동안 2와 2/5 km를 걸었습니다. 같은 속도라면 한 시간에 몇 km를 걷습니까?", "A walker covers 2 2/5 km in 3/4 hour. At the same speed, how many kilometers are covered in one hour?", "3/4小时走2又2/5千米。按相同速度，一小时走多少千米？"), data:{ dividend:fraction(12,5), divisor:fraction(3,4), displayDividend:"2 2/5" }, unit:tr("km/시간","km per hour","千米/小时"), errorCode:"unit-interpretation" }),
    authored({ id:"nsa-w36", section:"applications", strand:"area-dimension", standardIds:["6.NS.A.1"], level:"advanced", kind:"area-side", responseFormat:"simplest-fraction", prompt:tr("넓이가 5/6 m²인 직사각형의 한 변의 길이가 2/3 m입니다. 다른 한 변의 길이는 몇 m입니까?", "A rectangle has area 5/6 m² and one side is 2/3 m long. What is the length of the other side?", "一个长方形的面积是5/6平方米，一条边长2/3米。另一条边长多少米？"), data:{ dividend:fraction(5,6), divisor:fraction(2,3) }, unit:tr("m","m","米"), errorCode:"area-division-direction" })
  ]);

  const RECHECK_ITEMS = freeze([
    authored({ id:"nsa-r01", section:"recheck", strand:"unit-fraction-count", standardIds:["6.NS.A.1"], level:"core", kind:"groups-in-quantity", responseFormat:"fraction-or-whole", prompt:tr("11/12 안에는 1/6이 몇 개 들어갑니까?", "How many groups of 1/6 are in 11/12?", "11/12里面有多少个1/6？"), data:{ dividend:fraction(11,12), divisor:fraction(1,6) }, unit:tr("개","groups","个"), errorCode:"divisor-meaning-lost" }),
    authored({ id:"nsa-r02", section:"recheck", strand:"fraction-computation", standardIds:["6.NS.A.1"], level:"core", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("7/9 ÷ 14/27을 기약분수로 나타내세요.", "Write 7/9 ÷ 14/27 as a fraction in simplest form.", "把7/9 ÷ 14/27写成最简分数。"), data:{ dividend:fraction(7,9), divisor:fraction(14,27) }, unit:tr("","",""), errorCode:"multiplication-not-simplified" }),
    authored({ id:"nsa-r03", section:"recheck", strand:"mixed-number-division", standardIds:["6.NS.A.1"], level:"core", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("1과 3/4 ÷ 7/10을 기약분수로 나타내세요.", "Write 1 3/4 ÷ 7/10 as a fraction in simplest form.", "把1又3/4 ÷ 7/10写成最简分数。"), data:{ dividend:fraction(7,4), divisor:fraction(7,10), displayDividend:"1 3/4" }, unit:tr("","",""), errorCode:"mixed-number-not-converted" }),
    authored({ id:"nsa-r04", section:"recheck", strand:"measurement-division", standardIds:["6.NS.A.1"], level:"core", kind:"quantity-per-group", responseFormat:"fraction-or-whole", prompt:tr("1과 7/8m의 철사를 3/16m씩 자르면 몇 조각이 됩니까?", "A 1 7/8 m wire is cut into pieces that are each 3/16 m long. How many pieces are made?", "把1又7/8米长的铁丝每3/16米剪成一段，可以剪成多少段？"), data:{ dividend:fraction(15,8), divisor:fraction(3,16), displayDividend:"1 7/8" }, unit:tr("개","pieces","段"), errorCode:"unit-interpretation" }),
    authored({ id:"nsa-r05", section:"recheck", strand:"equal-sharing", standardIds:["6.NS.A.1"], level:"core", kind:"equal-share", responseFormat:"simplest-fraction", prompt:tr("수프 2와 1/4 L를 6그릇에 똑같이 나눕니다. 한 그릇에는 몇 L씩 담깁니까?", "Two and one-fourth liters of soup are divided equally among 6 bowls. How many liters go in each bowl?", "把2又1/4升汤平均分到6个碗里。每碗分到多少升？"), data:{ dividend:fraction(9,4), divisor:fraction(6,1), displayDividend:"2 1/4" }, unit:tr("L","liters","升"), errorCode:"share-size-confusion" }),
    authored({ id:"nsa-r06", section:"recheck", strand:"fraction-rate", standardIds:["6.NS.A.1"], level:"advanced", kind:"rate-from-fractions", responseFormat:"simplest-fraction", prompt:tr("2/3시간 동안 1과 1/2마일을 이동했습니다. 한 시간에 몇 마일을 이동한 셈입니까?", "A traveler covers 1 1/2 miles in 2/3 hour. How many miles per hour is that?", "2/3小时行进1又1/2英里。每小时行进多少英里？"), data:{ dividend:fraction(3,2), divisor:fraction(2,3), displayDividend:"1 1/2" }, unit:tr("마일/시간","miles per hour","英里/小时"), errorCode:"unit-interpretation" }),
    authored({ id:"nsa-r07", section:"recheck", strand:"area-dimension", standardIds:["6.NS.A.1"], level:"advanced", kind:"area-side", responseFormat:"simplest-fraction", prompt:tr("넓이가 3/4m²인 직사각형의 한 변의 길이가 2/5m입니다. 다른 한 변의 길이는 몇 m입니까?", "A rectangle has area 3/4 m² and one side is 2/5 m long. What is the other side length?", "一个长方形的面积是3/4平方米，一条边长2/5米。另一条边长多少米？"), data:{ dividend:fraction(3,4), divisor:fraction(2,5) }, unit:tr("m","m","米"), errorCode:"area-division-direction" }),
    authored({ id:"nsa-r08", section:"recheck", strand:"whole-by-fraction", standardIds:["6.NS.A.1"], level:"advanced", kind:"divide-fractions", responseFormat:"simplest-fraction", prompt:tr("6 ÷ 4/5를 기약분수로 나타내세요.", "Write 6 ÷ 4/5 as a fraction in simplest form.", "把6 ÷ 4/5写成最简分数。"), data:{ dividend:fraction(6,1), divisor:fraction(4,5) }, unit:tr("","",""), errorCode:"reciprocal-order" })
  ]);

  const STRANDS = freeze({
    "unit-fraction-count":tr("단위분수 묶음 세기","Count unit-fraction groups","数单位分数组"),
    "same-unit-groups":tr("같은 단위로 묶음 세기","Count groups in a common unit","统一单位后数份数"),
    "fraction-computation":tr("분수 나눗셈 계산","Fraction division","分数除法计算"),
    "whole-by-fraction":tr("자연수를 분수로 나누기","Divide a whole number by a fraction","整数除以分数"),
    "mixed-number-division":tr("대분수를 바꾸어 계산하기","Divide with mixed numbers","带分数除法"),
    "measurement-division":tr("몇 묶음인지 구하기","Find the number of groups","求份数"),
    "equal-sharing":tr("똑같이 나눈 한 몫 구하기","Find one equal share","求平均每份"),
    "fraction-rate":tr("한 단위당 양 구하기","Find a per-one rate","求单位率"),
    "area-dimension":tr("넓이에서 변의 길이 구하기","Find a side from area","由面积求边长")
  });
  const ERROR_GUIDES = freeze(Object.assign({}, base.pack.errorGuides, {
    "share-size-confusion":{ label:tr("묶음 수와 한 몫의 크기를 혼동함","Confused number of groups with share size","混淆份数与每份大小"), prompt:tr("전체 양을 사람 수나 그릇 수로 나누어 한 몫의 크기를 구하게 하세요.","Divide the total amount by the number of equal shares.","用总量除以份数，求每份的大小。") },
    "area-division-direction":{ label:tr("넓이와 변의 나눗셈 순서를 바꿈","Reversed area and side in the division","把面积与边长的除法顺序写反"), prompt:tr("직사각형 넓이 ÷ 알고 있는 변의 길이로 다른 변을 구하게 하세요.","Divide the rectangle's area by the known side length.","用长方形面积除以已知边长，求另一条边。") }
  }));

  const PACK = freeze({
    schemaVersion:1,
    id:"gfield-grade6-ns-a-unit-workbook-v1",
    clusterId:"6.NS.A",
    standardRange:"6.NS.A.1",
    learnerStage:"US Grade 6 ages 11-12",
    contentOrigin:"gfield-original-authored-public-unit-workbook",
    rights:{ publication:"public", assetRights:"original", containsThirdPartyAssets:false },
    title:tr("6.NS.A 분수 나눗셈 단원 워크북","6.NS.A Fraction Division Unit Workbook","6.NS.A 分数除法单元练习册"),
    subtitle:tr("분수로 나누는 뜻을 그림과 식으로 연결하고, 정확히 계산한 뒤 측정·나눔·속력·넓이 문제에 적용합니다.","Connect fraction division models to equations, compute exactly, then apply the quotient to measurement, sharing, rates, and area.","用图示和算式理解分数除法，准确计算，再应用于测量、平均分配、单位率和面积问题。"),
    scopeNotice:tr("이 책은 미국 6학년 6.NS.A.1의 분수 나눗셈 의미·계산·문제 해결을 연습합니다. 자동 채점은 정확한 몫만 확인합니다. 그림이나 식으로 나눗셈의 뜻을 설명하고 답의 단위를 해석하는 과정은 선생님이 따로 확인하며, 이 책만으로 전체 숙달·배치·승급을 결정하지 않습니다.","This book practices the meaning, computation, and application of fraction division in US Grade 6 6.NS.A.1. Automatic checks verify only the exact quotient. A teacher separately reviews models, equations, and unit interpretation; this book alone does not determine full mastery, placement, or promotion.","本练习册练习美国六年级6.NS.A.1中的分数除法意义、计算与应用。自动核验只检查准确的商。学生能否用图示或算式解释除法意义并说明答案单位，由教师另行查看；不能只凭本练习册判定全部掌握、分班或晋级。"),
    conceptPages:freeze([
      { title:tr("개념 1 · 몇 묶음인지와 한 몫의 크기","Concept 1 · Number of groups and size of one share","概念1 · 份数与每份大小"), body:tr("3/4 ÷ 1/8은 3/4 안에 1/8이 몇 묶음 있는지 묻습니다. 반면 3/4을 3명에게 똑같이 나누면 한 명이 받는 크기를 묻습니다. 두 상황 모두 나눗셈이지만 몫의 뜻과 단위가 다릅니다.","The expression 3/4 ÷ 1/8 asks how many 1/8-size groups fit in 3/4. Sharing 3/4 equally among three people asks for the size of one share. Both use division, but the quotient has a different meaning and unit.","3/4 ÷ 1/8表示3/4中包含多少个1/8；把3/4平均分给3个人，则求每人分到多少。两种情境都用除法，但商的含义和单位不同。"), example:tr("3/4=6/8이므로 1/8씩 6묶음입니다. 3/4÷3=3/4×1/3=1/4이므로 한 명은 1/4을 받습니다.","Since 3/4 = 6/8, there are six groups of 1/8. Also, 3/4 ÷ 3 = 3/4 × 1/3 = 1/4 per person.","因为3/4=6/8，所以有6个1/8。3/4÷3=3/4×1/3=1/4，因此每人分到1/4。") },
      { title:tr("개념 2 · 나누는 분수의 역수를 곱하기","Concept 2 · Multiply by the divisor's reciprocal","概念2 · 乘以除数的倒数"), body:tr("분수로 나눌 때는 나누어지는 수는 그대로 두고 나누는 수만 뒤집어 곱합니다. 대분수는 먼저 가분수로 바꾸고, 곱하기 전이나 곱한 뒤에 약분합니다. 마지막에는 몫×나누는 수가 처음 수와 같은지 확인합니다.","To divide by a fraction, keep the dividend and multiply by the reciprocal of the divisor. Convert mixed numbers first and simplify before or after multiplying. Finally, check that quotient × divisor equals the dividend.","分数相除时，被除数不变，只把除数取倒数后相乘。先把带分数化成假分数，再在乘法前后约分。最后检查商×除数是否等于被除数。"), example:tr("5/6÷2/3=5/6×3/2=15/12=5/4입니다. 검산하면 5/4×2/3=5/6입니다.","5/6 ÷ 2/3 = 5/6 × 3/2 = 15/12 = 5/4. Check: 5/4 × 2/3 = 5/6.","5/6÷2/3=5/6×3/2=15/12=5/4。检验：5/4×2/3=5/6。") }
    ]),
    teacherObservation:tr("학생이 문제를 읽고 ‘몇 묶음인지’와 ‘한 몫의 크기’를 구분하는지 확인하세요. 대분수를 가분수로 바꾸고 나누는 수만 뒤집는지, 몫에 상황에 맞는 단위를 붙이고 곱셈으로 되돌려 검산하는지 기록합니다.","Check whether the learner distinguishes number-of-groups problems from equal-share problems, converts mixed numbers, inverts only the divisor, interprets the quotient's unit, and verifies by multiplication.","检查学生能否区分求份数与求每份大小，能否把带分数化成假分数、只对除数取倒数、解释商的单位并用乘法检验。"),
    reflection:tr("나눗셈의 뜻과 검산 설명하기","Explain the quotient and its check","解释商的含义与检验"),
    reflectionPrompt:tr("‘몇 묶음인지’ 구하는 문제와 ‘한 몫의 크기’를 구하는 문제를 하나씩 만들고, 각 답의 단위와 곱셈 검산을 쓰세요.","Write one number-of-groups problem and one equal-share problem. State each quotient's unit and multiplication check.","各编一道求份数和求每份大小的问题，并写出商的单位与乘法检验。"),
    printPlan:freeze({ paperSizes:["A4","Letter"], itemsPerPracticePage:4, studentPages:12, teacherEdition:true, answerSheetSeparate:true }),
    ui:freeze({ sectionOrder:["models","compute","applications","recheck"], sectionLabels:{
      models:tr("1 · 나눗셈의 뜻을 그림으로 읽기","1 · Read the meaning with models","1 · 用图示理解除法意义"),
      compute:tr("2 · 역수를 이용해 정확히 계산하기","2 · Compute exactly with reciprocals","2 · 用倒数准确计算"),
      applications:tr("3 · 측정, 나눔, 단위율과 넓이에 적용","3 · Apply to measurement, sharing, rates, and area","3 · 应用于测量、平均分配、单位率与面积"),
      recheck:tr("새 문항 · 8가지 구조 재확인","New items · Eight-structure recheck","新题 · 八种结构复测")
    } }),
    workbookItems:WORKBOOK_ITEMS,
    recheckItems:RECHECK_ITEMS,
    strands:STRANDS,
    errorGuides:ERROR_GUIDES
  });

  function localized(value, locale) { return value && (value[locale] || value.en || value.ko) || ""; }
  function esc(value) { return String(value).replace(/[&<>"']/g, function (character) { return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character]; }); }
  function fractionText(value) { return value.denominator === 1 ? String(value.numerator) : value.numerator+"/"+value.denominator; }
  function shown(data, key) { return data["display"+key.charAt(0).toUpperCase()+key.slice(1)] || fractionText(data[key]); }
  function quantityBars(value, modifier) {
    const whole=Math.floor(value.numerator/value.denominator); const remainder=value.numerator%value.denominator;
    const fills=[]; for(let index=0;index<whole;index+=1)fills.push(100); if(remainder||!fills.length)fills.push(100*remainder/value.denominator);
    return '<div class="division-bars">'+fills.map(function(fill){return '<div class="division-bar '+modifier+'"><span style="--fraction-width:'+fill+'%"></span></div>';}).join("")+'</div>';
  }
  function renderVisual(candidate, locale) {
    const data=candidate.data; const dividend=esc(shown(data,"dividend")); const divisor=esc(shown(data,"divisor"));
    if(candidate.kind==="groups-in-quantity"){
      const totalLabel=locale==="ko"?"전체 양":locale==="zh-Hans"?"总量":"total"; const groupLabel=locale==="ko"?"한 묶음":locale==="zh-Hans"?"一份":"one group";
      return '<div class="division-model"><div class="division-row"><em>'+esc(totalLabel)+'</em>'+quantityBars(data.dividend, "total")+'</div><div class="division-row"><em>'+esc(groupLabel)+'</em>'+quantityBars(data.divisor, "divisor")+'</div><div class="division-labels"><strong>'+dividend+'</strong><span>÷</span><strong>'+divisor+'</strong><span>= □</span></div></div>';
    }
    if(candidate.kind==="equal-share"){
      const label=locale==="ko"?"똑같이 나누기":locale==="zh-Hans"?"平均分配":"equal shares";
      return '<div class="division-context"><strong>'+dividend+'</strong><span>÷ '+divisor+'</span><em>'+esc(label)+'</em><strong>□</strong></div>';
    }
    if(candidate.kind==="rate-from-fractions"){
      const first=locale==="ko"?"이동한 거리":locale==="zh-Hans"?"路程":"distance"; const second=locale==="ko"?"걸린 시간":locale==="zh-Hans"?"时间":"time";
      return '<div class="division-rate"><div class="division-rate-grid"><span>'+esc(first)+'</span><strong>'+dividend+'</strong><span>'+esc(second)+'</span><strong>'+divisor+'</strong></div><em>÷ □</em></div>';
    }
    if(candidate.kind==="area-side"){
      const area=locale==="ko"?"넓이":locale==="zh-Hans"?"面积":"area"; const side=locale==="ko"?"알고 있는 변":locale==="zh-Hans"?"已知边":"known side";
      return '<div class="division-area"><span>'+esc(area)+' '+dividend+'</span><strong>÷</strong><span>'+esc(side)+' '+divisor+'</span><strong>= □</strong></div>';
    }
    return '<div class="division-equation"><strong>'+dividend+'</strong><span>÷</span><strong>'+divisor+'</strong><span>=</span><strong>□</strong></div>';
  }

  function solveItem(candidate) { return base.solveItem(candidate); }
  function evaluateResponse(candidate, response) { return base.evaluateResponse(candidate, response); }
  function formatResult(candidate) { return base.formatResult(candidate); }
  function hintFor(candidate, locale) {
    const key=locale==="zh"?"zh-Hans":locale;
    if(candidate.kind==="equal-share") return tr("전체 양 ÷ 똑같이 나누는 몫의 수로 한 몫의 크기를 구하세요.","Divide the total amount by the number of equal shares.","用总量除以份数，求每份的大小。")[key];
    if(candidate.kind==="area-side") return tr("직사각형의 넓이를 알고 있는 변의 길이로 나누세요.","Divide the rectangle's area by the known side length.","用长方形面积除以已知边长。")[key];
    return base.hintFor(candidate, key);
  }
  function solutionFor(candidate, locale) {
    const key=locale==="zh"?"zh-Hans":locale; const data=candidate.data;
    const dividend=fractionText(data.dividend); const divisor=fractionText(data.divisor); const result=formatResult(candidate);
    const conversion=[];
    if(data.displayDividend) conversion.push(data.displayDividend+" = "+dividend);
    if(data.displayDivisor) conversion.push(data.displayDivisor+" = "+divisor);
    const lead=conversion.length?(key==="ko"?conversion.join(", ")+"로 바꿉니다. ":key==="zh-Hans"?"先化成 "+conversion.join("，")+"。":"Convert "+conversion.join(" and ")+". "):"";
    const expression=dividend+" ÷ "+divisor+" = "+dividend+" × "+data.divisor.denominator+"/"+data.divisor.numerator+" = "+result;
    if(key==="ko") return lead+expression+"입니다. "+result+" × "+divisor+"가 "+dividend+"인지 검산합니다.";
    if(key==="zh-Hans") return lead+expression+"。检验 "+result+" × "+divisor+" 是否等于 "+dividend+"。";
    return lead+expression+". Check that "+result+" × "+divisor+" equals "+dividend+".";
  }
  function validateItem(candidate) {
    const allowedKinds=new Set(["groups-in-quantity","divide-fractions","quantity-per-group","rate-from-fractions","equal-share","area-side"]);
    if(!candidate||!/^nsa-[wr]\d{2}$/.test(candidate.id)||!allowedKinds.has(candidate.kind)) throw new Error("NSA_UNIT_ITEM_INVALID");
    if(!STRANDS[candidate.strand]||!ERROR_GUIDES[candidate.errorCode]||candidate.standardIds.length!==1||candidate.standardIds[0]!=="6.NS.A.1") throw new Error("NSA_UNIT_ALIGNMENT_INVALID");
    ["ko","en","zh-Hans"].forEach(function(locale){if(!candidate.prompt[locale])throw new Error("NSA_UNIT_LOCALE_INVALID");});
    const result=solveItem(candidate); if(result.denominator<=0n)throw new Error("NSA_UNIT_RESULT_INVALID"); return true;
  }
  function validatePack() {
    const all=PACK.workbookItems.concat(PACK.recheckItems);
    if(PACK.workbookItems.length!==36||PACK.recheckItems.length!==8||new Set(all.map(function(candidate){return candidate.id;})).size!==44)throw new Error("NSA_UNIT_COUNT_INVALID");
    const sections={models:0,compute:0,applications:0};
    PACK.workbookItems.forEach(function(candidate){validateItem(candidate);sections[candidate.section]+=1;});PACK.recheckItems.forEach(validateItem);
    if(sections.models!==12||sections.compute!==12||sections.applications!==12)throw new Error("NSA_UNIT_SECTION_BALANCE_INVALID");
    const recheck=new Set(PACK.recheckItems.map(function(candidate){return candidate.strand;}));
    ["unit-fraction-count","fraction-computation","mixed-number-division","measurement-division","equal-sharing","fraction-rate","area-dimension","whole-by-fraction"].forEach(function(strand){if(!recheck.has(strand))throw new Error("NSA_UNIT_RECHECK_COVERAGE_INVALID");});
    return true;
  }

  validatePack();
  return freeze({ schemaVersion:1, pack:PACK, solveItem:solveItem, evaluateResponse:evaluateResponse, formatResult:formatResult, hintFor:hintFor, solutionFor:solutionFor, renderVisual:renderVisual, validateItem:validateItem, validatePack:validatePack });
});
