(function (root, factory) {
  const value = typeof module === "object" && module.exports
    ? factory(require("./grade6-rp-clinic-pack.js"))
    : factory(root && root.GFIELDGrade6RPClinicPack);
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6RPAUnitWorkbook = value;
})(typeof window !== "undefined" ? window : globalThis, function (base) {
  "use strict";

  if (!base || typeof base.solveItem !== "function") throw new Error("RPA_UNIT_BASE_MISSING");

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function item(definition) { return freeze(definition); }
  function legacy(id) {
    return base.pack.workbookItems.concat(base.pack.recheckItems).find(function (candidate) { return candidate.id === id; });
  }
  function adapt(candidate, id, section, standardIds) {
    if (!candidate) throw new Error("RPA_UNIT_LEGACY_ITEM_MISSING");
    return item(Object.assign({}, candidate, { id: id, section: section, standardIds: freeze(standardIds.slice()) }));
  }
  function authored(definition) { return item(definition); }

  const WORKBOOK_ITEMS = freeze([
    adapt(legacy("rp-w01"), "rpa-w01", "equivalent", ["6.RP.A.3a"]),
    adapt(legacy("rp-w02"), "rpa-w02", "equivalent", ["6.RP.A.3a"]),
    adapt(legacy("rp-w03"), "rpa-w03", "equivalent", ["6.RP.A.1", "6.RP.A.3b"]),
    adapt(legacy("rp-w04"), "rpa-w04", "equivalent", ["6.RP.A.3a"]),
    authored({ id:"rpa-w05", section:"equivalent", strand:"equivalent-ratio", standardIds:["6.RP.A.3a"], level:"foundation", kind:"simplify-ratio", responseFormat:"ratio-pair", prompt:tr("42:56을 가장 간단한 자연수의 비로 나타내세요.", "Write 42:56 as a ratio in simplest whole-number form.", "把42:56化成最简整数比。"), data:{left:42,right:56}, unit:tr("비","ratio","比"), errorCode:"common-factor-missed" }),
    authored({ id:"rpa-w06", section:"equivalent", strand:"equivalent-ratio", standardIds:["6.RP.A.3a"], level:"foundation", kind:"missing-term", responseFormat:"whole-number", prompt:tr("4:7과 같은 비가 28:□입니다. □에 들어갈 수를 구하세요.", "A ratio equivalent to 4:7 is 28:□. Find the missing number.", "与4:7相等的比是28:□。求□中的数。"), data:{left:4,right:7,knownLeft:28}, unit:tr("","",""), errorCode:"unequal-scaling" }),
    authored({ id:"rpa-w07", section:"equivalent", strand:"equivalent-ratio", standardIds:["6.RP.A.3a"], level:"core", kind:"missing-term", responseFormat:"whole-number", prompt:tr("11:6과 같은 비가 □:30입니다. □에 들어갈 수를 구하세요.", "A ratio equivalent to 11:6 is □:30. Find the missing number.", "与11:6相等的比是□:30。求□中的数。"), data:{left:11,right:6,knownRight:30}, unit:tr("","",""), errorCode:"unequal-scaling" }),
    authored({ id:"rpa-w08", section:"equivalent", strand:"part-whole", standardIds:["6.RP.A.1","6.RP.A.3b"], level:"core", kind:"part-from-total", responseFormat:"whole-number", prompt:tr("빨간 타일과 파란 타일의 수의 비는 5:8이고 모두 91개입니다. 파란 타일은 몇 개입니까?", "The ratio of red tiles to blue tiles is 5:8, and there are 91 tiles altogether. How many are blue?", "红色瓷砖与蓝色瓷砖的数量比是5:8，共91块。蓝色瓷砖有多少块？"), data:{left:5,right:8,total:91,target:"right"}, unit:tr("개","blue tiles","块"), errorCode:"part-total-confusion" }),
    authored({ id:"rpa-w09", section:"equivalent", strand:"part-whole", standardIds:["6.RP.A.1","6.RP.A.3b"], level:"core", kind:"part-from-total", responseFormat:"whole-number", prompt:tr("과학책과 이야기책의 수의 비는 7:3이고 모두 80권입니다. 과학책은 몇 권입니까?", "The ratio of science books to storybooks is 7:3, and there are 80 books altogether. How many are science books?", "科学书与故事书的数量比是7:3，共80本。科学书有多少本？"), data:{left:7,right:3,total:80,target:"left"}, unit:tr("권","science books","本"), errorCode:"part-total-confusion" }),
    authored({ id:"rpa-w10", section:"equivalent", strand:"equivalent-ratio", standardIds:["6.RP.A.3a"], level:"core", kind:"simplify-ratio", responseFormat:"ratio-pair", prompt:tr("63:81을 가장 간단한 자연수의 비로 나타내세요.", "Write 63:81 as a ratio in simplest whole-number form.", "把63:81化成最简整数比。"), data:{left:63,right:81}, unit:tr("비","ratio","比"), errorCode:"common-factor-missed" }),
    authored({ id:"rpa-w11", section:"equivalent", strand:"equivalent-ratio", standardIds:["6.RP.A.3a"], level:"advanced", kind:"missing-term", responseFormat:"whole-number", prompt:tr("9:4와 같은 비가 63:□입니다. □에 들어갈 수를 구하세요.", "A ratio equivalent to 9:4 is 63:□. Find the missing number.", "与9:4相等的比是63:□。求□中的数。"), data:{left:9,right:4,knownLeft:63}, unit:tr("","",""), errorCode:"unequal-scaling" }),
    authored({ id:"rpa-w12", section:"equivalent", strand:"part-whole", standardIds:["6.RP.A.1","6.RP.A.3b"], level:"advanced", kind:"part-from-total", responseFormat:"whole-number", prompt:tr("연필과 펜의 수의 비는 3:2이고 모두 45자루입니다. 펜은 몇 자루입니까?", "The ratio of pencils to pens is 3:2, and there are 45 altogether. How many are pens?", "铅笔与签字笔的数量比是3:2，共45支。签字笔有多少支？"), data:{left:3,right:2,total:45,target:"right"}, unit:tr("자루","pens","支"), errorCode:"part-total-confusion" }),

    adapt(legacy("rp-w05"), "rpa-w13", "rates", ["6.RP.A.2", "6.RP.A.3b"]),
    adapt(legacy("rp-w06"), "rpa-w14", "rates", ["6.RP.A.2"]),
    adapt(legacy("rp-w07"), "rpa-w15", "rates", ["6.RP.A.2", "6.RP.A.3b"]),
    adapt(legacy("rp-w08"), "rpa-w16", "rates", ["6.RP.A.2", "6.RP.A.3b"]),
    authored({ id:"rpa-w17", section:"rates", strand:"unit-rate", standardIds:["6.RP.A.2"], level:"foundation", kind:"unit-rate", responseFormat:"decimal-or-fraction", prompt:tr("공책 8권의 가격이 14달러입니다. 공책 한 권의 가격은 얼마입니까?", "Eight notebooks cost $14. What is the cost of one notebook?", "8本练习本售价14美元。每本多少钱？"), data:{totalValue:14,quantity:8}, unit:tr("달러","dollars","美元"), errorCode:"unit-rate-omitted" }),
    authored({ id:"rpa-w18", section:"rates", strand:"proportional-value", standardIds:["6.RP.A.2","6.RP.A.3a","6.RP.A.3b"], level:"foundation", kind:"proportional-value", responseFormat:"whole-number", prompt:tr("수도꼭지에서 3분 동안 물 12L가 나옵니다. 같은 빠르기로 8분 동안에는 몇 L가 나옵니까?", "A tap releases 12 L of water in 3 minutes. At the same rate, how many liters are released in 8 minutes?", "水龙头3分钟流出12升水。按同样的速度，8分钟流出多少升？"), data:{sourceQuantity:3,sourceValue:12,targetQuantity:8}, unit:tr("L","L","升"), errorCode:"additive-thinking" }),
    authored({ id:"rpa-w19", section:"rates", strand:"proportional-value", standardIds:["6.RP.A.2","6.RP.A.3a","6.RP.A.3b"], level:"core", kind:"proportional-value", responseFormat:"whole-number", prompt:tr("6분 동안 9쪽을 읽는 일정한 빠르기로 20분 동안 읽으면 몇 쪽을 읽습니까?", "At a constant rate of 9 pages in 6 minutes, how many pages are read in 20 minutes?", "按6分钟读9页的固定速度，20分钟能读多少页？"), data:{sourceQuantity:6,sourceValue:9,targetQuantity:20}, unit:tr("쪽","pages","页"), errorCode:"additive-thinking" }),
    authored({ id:"rpa-w20", section:"rates", strand:"unit-rate", standardIds:["6.RP.A.2"], level:"core", kind:"unit-rate", responseFormat:"whole-number", prompt:tr("3시간 동안 15km를 일정하게 걸었습니다. 한 시간에 몇 km를 걸은 셈입니까?", "A walker travels 15 km at a constant rate in 3 hours. How many kilometers per hour is that?", "以固定速度3小时走15千米。平均每小时走多少千米？"), data:{totalValue:15,quantity:3}, unit:tr("km/시간","km per hour","千米/小时"), errorCode:"unit-rate-omitted" }),
    authored({ id:"rpa-w21", section:"rates", strand:"proportional-value", standardIds:["6.RP.A.2","6.RP.A.3b"], level:"core", kind:"proportional-value", responseFormat:"decimal-or-fraction", prompt:tr("입장권 4장의 가격이 18달러입니다. 같은 가격으로 11장을 사면 얼마입니까?", "Four tickets cost $18. At the same rate, how much do 11 tickets cost?", "4张门票售价18美元。按同样的单价，11张需要多少钱？"), data:{sourceQuantity:4,sourceValue:18,targetQuantity:11}, unit:tr("달러","dollars","美元"), errorCode:"additive-thinking" }),
    authored({ id:"rpa-w22", section:"rates", strand:"unit-rate", standardIds:["6.RP.A.2"], level:"core", kind:"unit-rate", responseFormat:"decimal-or-fraction", prompt:tr("사료 7kg의 가격이 24.50달러입니다. 1kg의 가격은 얼마입니까?", "Seven kilograms of feed cost $24.50. What is the cost per kilogram?", "7千克饲料售价24.50美元。每千克多少钱？"), data:{totalValueNumerator:2450,totalValueDenominator:100,quantity:7}, unit:tr("달러/kg","dollars per kg","美元/千克"), errorCode:"unit-rate-omitted" }),
    authored({ id:"rpa-w23", section:"rates", strand:"proportional-value", standardIds:["6.RP.A.2","6.RP.A.3b"], level:"advanced", kind:"proportional-value", responseFormat:"decimal-or-fraction", prompt:tr("머핀 12개에 밀가루 5컵이 필요합니다. 같은 비율로 30개를 만들려면 밀가루가 몇 컵 필요합니까?", "Twelve muffins need 5 cups of flour. At the same rate, how many cups are needed for 30 muffins?", "做12个松饼需要5杯面粉。按同样的比例，做30个需要多少杯？"), data:{sourceQuantity:12,sourceValue:5,targetQuantity:30}, unit:tr("컵","cups","杯"), errorCode:"unequal-scaling" }),
    authored({ id:"rpa-w24", section:"rates", strand:"unit-rate", standardIds:["6.RP.A.2"], level:"advanced", kind:"unit-rate", responseFormat:"whole-number", prompt:tr("4분 동안 240단어를 입력했습니다. 같은 속도라면 1분에 몇 단어를 입력한 셈입니까?", "A typist enters 240 words in 4 minutes. At the same rate, how many words per minute is that?", "4分钟输入240个单词。按同样的速度，每分钟输入多少个？"), data:{totalValue:240,quantity:4}, unit:tr("단어/분","words per minute","个/分钟"), errorCode:"unit-rate-omitted" }),

    adapt(legacy("rp-w09"), "rpa-w25", "applications", ["6.RP.A.3c"]),
    adapt(legacy("rp-w10"), "rpa-w26", "applications", ["6.RP.A.3c"]),
    adapt(legacy("rp-w11"), "rpa-w27", "applications", ["6.RP.A.3d"]),
    adapt(legacy("rp-w12"), "rpa-w28", "applications", ["6.RP.A.1", "6.RP.A.3b"]),
    authored({ id:"rpa-w29", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3c"], level:"foundation", kind:"percent-of", responseFormat:"whole-number", prompt:tr("240의 15%는 얼마입니까?", "What is 15% of 240?", "240的15%是多少？"), data:{whole:240,percent:15}, unit:tr("","",""), errorCode:"percent-place-value" }),
    authored({ id:"rpa-w30", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3c"], level:"foundation", kind:"percentage", responseFormat:"whole-number", prompt:tr("28명 중 21명이 과제를 제출했습니다. 제출한 학생은 전체의 몇 %입니까?", "Twenty-one out of 28 students submitted the assignment. What percent submitted it?", "28名学生中有21名提交了作业。提交者占百分之几？"), data:{part:21,whole:28}, unit:tr("%","%","%"), errorCode:"part-total-confusion" }),
    authored({ id:"rpa-w31", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3c"], level:"core", kind:"percent-of", responseFormat:"whole-number", prompt:tr("160의 35%는 얼마입니까?", "What is 35% of 160?", "160的35%是多少？"), data:{whole:160,percent:35}, unit:tr("","",""), errorCode:"percent-place-value" }),
    authored({ id:"rpa-w32", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3d"], level:"core", kind:"conversion", responseFormat:"whole-number", prompt:tr("2.25시간은 몇 분입니까?", "How many minutes are in 2.25 hours?", "2.25小时是多少分钟？"), data:{valueNumerator:9,valueDenominator:4,factor:60}, unit:tr("분","minutes","分钟"), errorCode:"conversion-direction" }),
    authored({ id:"rpa-w33", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3d"], level:"core", kind:"conversion", responseFormat:"whole-number", prompt:tr("3/4m는 몇 cm입니까?", "How many centimeters are in 3/4 m?", "3/4米是多少厘米？"), data:{valueNumerator:3,valueDenominator:4,factor:100,displayValue:"3/4"}, unit:tr("cm","cm","厘米"), errorCode:"conversion-direction" }),
    authored({ id:"rpa-w34", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3d"], level:"core", kind:"conversion", responseFormat:"whole-number", prompt:tr("2.4kg은 몇 g입니까?", "How many grams are in 2.4 kg?", "2.4千克是多少克？"), data:{valueNumerator:12,valueDenominator:5,factor:1000}, unit:tr("g","g","克"), errorCode:"conversion-direction" }),
    authored({ id:"rpa-w35", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3c"], level:"advanced", kind:"percent-of", responseFormat:"whole-number", prompt:tr("460의 5%는 얼마입니까?", "What is 5% of 460?", "460的5%是多少？"), data:{whole:460,percent:5}, unit:tr("","",""), errorCode:"percent-place-value" }),
    authored({ id:"rpa-w36", section:"applications", strand:"percent-conversion", standardIds:["6.RP.A.3c"], level:"advanced", kind:"percentage", responseFormat:"whole-number", prompt:tr("45개 중 27개가 기준을 통과했습니다. 통과한 것은 전체의 몇 %입니까?", "Twenty-seven out of 45 items met the criterion. What percent met it?", "45项中有27项达到标准。达到标准的占百分之几？"), data:{part:27,whole:45}, unit:tr("%","%","%"), errorCode:"part-total-confusion" })
  ]);

  const RECHECK_ITEMS = freeze([
    adapt(legacy("rp-r01"), "rpa-r01", "recheck", ["6.RP.A.3a"]),
    adapt(legacy("rp-r02"), "rpa-r02", "recheck", ["6.RP.A.2"]),
    adapt(legacy("rp-r03"), "rpa-r03", "recheck", ["6.RP.A.1", "6.RP.A.3b"]),
    adapt(legacy("rp-r04"), "rpa-r04", "recheck", ["6.RP.A.3c"]),
    authored({ id:"rpa-r05", section:"recheck", strand:"equivalent-ratio", standardIds:["6.RP.A.3a"], level:"core", kind:"simplify-ratio", responseFormat:"ratio-pair", prompt:tr("56:72를 가장 간단한 자연수의 비로 나타내세요.", "Write 56:72 as a ratio in simplest whole-number form.", "把56:72化成最简整数比。"), data:{left:56,right:72}, unit:tr("비","ratio","比"), errorCode:"common-factor-missed" }),
    authored({ id:"rpa-r06", section:"recheck", strand:"proportional-value", standardIds:["6.RP.A.2","6.RP.A.3b"], level:"core", kind:"proportional-value", responseFormat:"whole-number", prompt:tr("공책 7권의 가격이 21달러입니다. 같은 가격으로 13권을 사면 얼마입니까?", "Seven notebooks cost $21. At the same rate, how much do 13 notebooks cost?", "7本练习本售价21美元。按同样的单价，13本需要多少钱？"), data:{sourceQuantity:7,sourceValue:21,targetQuantity:13}, unit:tr("달러","dollars","美元"), errorCode:"additive-thinking" }),
    authored({ id:"rpa-r07", section:"recheck", strand:"percent-conversion", standardIds:["6.RP.A.3c"], level:"core", kind:"percentage", responseFormat:"whole-number", prompt:tr("56명 중 42명이 참여했습니다. 참여한 사람은 전체의 몇 %입니까?", "Forty-two out of 56 people participated. What percent participated?", "56人中有42人参加。参加者占百分之几？"), data:{part:42,whole:56}, unit:tr("%","%","%"), errorCode:"part-total-confusion" }),
    authored({ id:"rpa-r08", section:"recheck", strand:"percent-conversion", standardIds:["6.RP.A.3d"], level:"advanced", kind:"conversion", responseFormat:"whole-number", prompt:tr("1.75시간은 몇 분입니까?", "How many minutes are in 1.75 hours?", "1.75小时是多少分钟？"), data:{valueNumerator:7,valueDenominator:4,factor:60}, unit:tr("분","minutes","分钟"), errorCode:"conversion-direction" })
  ]);

  const PACK = freeze({
    schemaVersion: 1,
    id: "gfield-grade6-rp-a-unit-workbook-v1",
    clusterId: "6.RP.A",
    standardRange: "6.RP.A.1-3",
    learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-unit-workbook",
    rights: { publication:"public", assetRights:"original", containsThirdPartyAssets:false },
    title: tr("6.RP.A 비와 비율 단원 워크북", "6.RP.A Ratios and Rates Unit Workbook", "6.RP.A 比与比率单元练习册"),
    subtitle: tr("비의 뜻을 읽고, 같은 비와 단위율을 구한 뒤 퍼센트와 단위 변환에 적용합니다.", "Interpret ratios, build equivalent ratios and unit rates, then apply them to percent and unit conversions.", "理解比的含义，求相等比和单位率，再应用于百分数与单位换算。"),
    scopeNotice: tr("이 책은 미국 6학년 6.RP.A.1-3의 비의 뜻, 단위율, 같은 비, 부분과 전체, 퍼센트, 단위 변환을 연습합니다. 자동 채점은 정확한 수 또는 비를 확인하는 제한된 학습 근거입니다. 비를 말로 설명하기, 표·이중 수직선·식 만들기, 실제 상황의 단위 해석은 선생님이 따로 확인하며, 이 책만으로 전체 숙달·배치·승급을 결정하지 않습니다.", "This book practices ratio meaning, unit rates, equivalent ratios, part-whole reasoning, percent, and conversions in US Grade 6 6.RP.A.1-3. Automatic checks provide limited evidence for exact numbers or ratios. A teacher separately reviews explanations, representations, and unit interpretation; this book alone does not determine full mastery, placement, or promotion.", "本练习册练习美国六年级6.RP.A.1-3中的比的含义、单位率、相等比、部分与整体、百分数和单位换算。自动核验只提供准确数值或比的有限学习证据。用语言解释比、建立表格或双数轴及算式、解释实际单位等表现由教师另行查看；不能只凭本练习册判定全部掌握、分班或晋级。"),
    conceptPages: freeze([
      { title:tr("개념 1 · 비와 같은 비", "Concept 1 · Ratios and equivalent ratios", "概念1 · 比与相等比"), body:tr("비 3:5는 첫째 양 3만큼에 둘째 양 5만큼이 대응한다는 뜻입니다. 같은 비를 만들 때는 두 항에 반드시 같은 수를 곱하거나 나눕니다. 부분과 전체 문제에서는 비의 전체 부분 수를 먼저 구합니다.", "The ratio 3:5 means three units of the first quantity correspond to five units of the second. Equivalent ratios multiply or divide both terms by the same number. For part-whole problems, first count all ratio parts.", "比3:5表示第一个量的3份对应第二个量的5份。相等比要把两项同时乘或除以同一个数。解决部分与整体问题时，先求比的总份数。"), example:tr("빨강:파랑=3:5이고 빨강이 12개이면 3에 4를 곱했으므로 5에도 4를 곱합니다. 파랑은 20개입니다.", "If red:blue = 3:5 and red is 12, then 3 was multiplied by 4, so multiply 5 by 4. There are 20 blue objects.", "如果红:蓝=3:5，红色有12个，那么3乘了4，5也要乘4，所以蓝色有20个。") },
      { title:tr("개념 2 · 단위율, 퍼센트, 단위 변환", "Concept 2 · Unit rates, percent, and conversions", "概念2 · 单位率、百分数与单位换算"), body:tr("단위율은 ‘1개당’, ‘1시간당’처럼 한 단위에 해당하는 값을 나타냅니다. 퍼센트는 전체를 100으로 보았을 때의 비입니다. 단위를 바꿀 때는 1시간=60분처럼 두 단위의 관계를 먼저 쓰고 곱할지 나눌지 정합니다.", "A unit rate gives a value per one unit. A percent is a ratio per 100. For a conversion, first write the relationship between the units, such as 1 hour = 60 minutes, then decide whether to multiply or divide.", "单位率表示每1个单位对应的数值。百分数是以100为整体的比。换算单位时，先写出1小时=60分钟这样的单位关系，再判断应该乘还是除。"), example:tr("8권이 14달러이면 한 권은 14÷8=1.75달러입니다. 2.25시간은 2.25×60=135분입니다.", "If eight books cost $14, one book costs 14÷8 = $1.75. Also, 2.25 hours is 2.25×60 = 135 minutes.", "8本书售价14美元，则每本14÷8=1.75美元。2.25小时是2.25×60=135分钟。") }
    ]),
    teacherObservation: tr("학생이 비의 두 양과 순서를 말로 설명하고, 표·비율 막대·이중 수직선 중 하나로 같은 비를 나타내게 하세요. 단위율의 분모가 1인 단위를 정확히 말하고, 퍼센트와 단위 변환에서 계산 방향을 실제 상황으로 확인하는지 기록합니다.", "Ask the learner to explain both quantities and their order, represent an equivalent ratio with a table, tape diagram, or double number line, name the per-one unit correctly, and justify the direction of percent and unit conversions.", "请学生用语言说明比中的两个量及其顺序，并用表格、比率条或双数轴表示相等比。记录学生能否准确说出单位率中的每1单位，并结合实际情境说明百分数和单位换算的计算方向。"),
    reflection: tr("내가 설명하는 비와 단위율", "Explain a ratio and a unit rate", "我来解释比与单位率"),
    reflectionPrompt: tr("생활 속 두 양을 골라 비를 하나 만들고, 두 양의 순서와 한 단위당 값을 문장으로 설명하세요.", "Choose two quantities from daily life, write a ratio, and explain the order of the quantities and the value per one unit.", "选择生活中的两个量写出一个比，并说明两个量的顺序和每1单位对应的数值。"),
    printPlan: freeze({ paperSizes:["A4","Letter"], itemsPerPracticePage:4, studentPages:12, teacherEdition:true, answerSheetSeparate:true }),
    ui: freeze({ sectionOrder:["equivalent","rates","applications","recheck"], sectionLabels:{
      equivalent:tr("1 · 비의 뜻, 같은 비, 부분과 전체", "1 · Ratio meaning, equivalent ratios, and part-whole", "1 · 比的含义、相等比与部分整体"),
      rates:tr("2 · 단위율과 같은 비로 구하기", "2 · Unit rates and proportional reasoning", "2 · 单位率与按比例求值"),
      applications:tr("3 · 퍼센트와 단위 변환", "3 · Percent and unit conversions", "3 · 百分数与单位换算"),
      recheck:tr("새 문항 · 5가지 구조 재확인", "New items · Five-structure recheck", "新题 · 五种结构复测")
    } }),
    workbookItems: WORKBOOK_ITEMS,
    recheckItems: RECHECK_ITEMS,
    strands: freeze({
      "equivalent-ratio":tr("같은 비", "Equivalent ratios", "相等比"),
      "unit-rate":tr("단위율", "Unit rates", "单位率"),
      "proportional-value":tr("같은 비로 구하기", "Proportional reasoning", "按比例求值"),
      "part-whole":tr("부분과 전체", "Part and whole", "部分与整体"),
      "percent-conversion":tr("퍼센트와 단위 변환", "Percent and unit conversions", "百分数与单位换算")
    }),
    errorGuides: base.pack.errorGuides
  });

  function esc(value) { return String(value).replace(/[&<>"']/g, function (character) { return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character]; }); }
  function localized(value, locale) { return value && (value[locale] || value.en || value.ko) || ""; }
  function number(value) { return value == null ? "□" : String(value); }
  function renderVisual(candidate, locale) {
    const data = candidate.data;
    if (candidate.kind === "missing-term") {
      return '<div class="ratio-model"><div class="ratio-model-title">'+esc(localized(PACK.strands[candidate.strand],locale))+'</div><div class="ratio-table" aria-hidden="true"><span>'+data.left+'</span><span>'+data.right+'</span><span>'+number(data.knownLeft)+'</span><span>'+number(data.knownRight)+'</span></div></div>';
    }
    if (candidate.kind === "simplify-ratio") return '<div class="ratio-model ratio-simplify" aria-hidden="true"><strong>'+data.left+' : '+data.right+'</strong><span>÷ ?</span><strong>□ : □</strong></div>';
    if (candidate.kind === "part-from-total") {
      const totalParts=data.left+data.right; let blocks="";
      for(let index=0;index<totalParts;index+=1) blocks+='<span class="ratio-part '+(index<data.left?'is-first':'is-second')+'"></span>';
      return '<div class="ratio-model"><div class="ratio-bar" aria-hidden="true">'+blocks+'</div><div class="ratio-bar-label">'+data.left+' : '+data.right+' · '+data.total+' '+esc(localized(candidate.unit,locale))+'</div></div>';
    }
    if (candidate.kind === "unit-rate" || candidate.kind === "proportional-value") {
      const quantity=candidate.kind==="unit-rate"?data.quantity:data.sourceQuantity;
      const value=candidate.kind==="unit-rate"?(data.totalValueNumerator!=null?data.totalValueNumerator/data.totalValueDenominator:data.totalValue):data.sourceValue;
      const target=candidate.kind==="unit-rate"?1:data.targetQuantity;
      const scaleCopy=locale==="ko"?"× 같은 배수":locale==="zh-Hans"?"× 同一倍数":"× same scale";
      return '<div class="ratio-model"><div class="rate-table" aria-hidden="true"><span>'+quantity+'</span><span>'+target+'</span><span>'+value+'</span><span>□</span></div><div class="ratio-arrow">'+scaleCopy+'</div></div>';
    }
    if (candidate.kind === "percent-of") return '<div class="ratio-model percent-model" aria-hidden="true"><span class="percent-fill" style="--percent:'+data.percent+'%"></span><strong>'+data.percent+'%</strong><small>100% = '+data.whole+'</small></div>';
    if (candidate.kind === "percentage") return '<div class="ratio-model fraction-model" aria-hidden="true"><strong>'+data.part+'</strong><span></span><strong>'+data.whole+'</strong><em>× 100%</em></div>';
    if (candidate.kind === "conversion") {
      const inputValue=data.displayValue||String(Number((data.valueNumerator/data.valueDenominator).toFixed(6)));
      return '<div class="ratio-model conversion-model" aria-hidden="true"><strong>'+esc(inputValue)+'</strong><span>× '+data.factor+'</span><strong>□</strong></div>';
    }
    return "";
  }

  function validatePack() {
    const all=PACK.workbookItems.concat(PACK.recheckItems);
    if(PACK.workbookItems.length!==36||PACK.recheckItems.length!==8||new Set(all.map(function(candidate){return candidate.id;})).size!==44) throw new Error("RPA_UNIT_COUNT_INVALID");
    const sections={equivalent:0,rates:0,applications:0};
    PACK.workbookItems.forEach(function(candidate){
      validateItem(candidate);
      if(!Array.isArray(candidate.standardIds)||candidate.standardIds.length===0||candidate.standardIds.some(function(id){return !/^6\.RP\.A\.(?:1|2|3[abcd])$/.test(id);})) throw new Error("RPA_UNIT_STANDARD_INVALID");
      sections[candidate.section]=(sections[candidate.section]||0)+1;
    });
    PACK.recheckItems.forEach(function(candidate){validateItem(candidate);});
    if(sections.equivalent!==12||sections.rates!==12||sections.applications!==12) throw new Error("RPA_UNIT_SECTION_BALANCE_INVALID");
    const strands=new Set(PACK.recheckItems.map(function(candidate){return candidate.strand;}));
    ["equivalent-ratio","unit-rate","proportional-value","part-whole","percent-conversion"].forEach(function(strand){if(!strands.has(strand)) throw new Error("RPA_UNIT_RECHECK_COVERAGE_INVALID");});
    return true;
  }

  function validateItem(candidate) {
    if(!candidate||!/^rpa-[wr]\d{2}$/.test(candidate.id)) throw new Error("RPA_UNIT_ITEM_ID_INVALID");
    return base.validateItem(Object.assign({},candidate,{id:candidate.id.replace(/^rpa-/,"rp-")}));
  }

  validatePack();
  return freeze({
    schemaVersion:1,
    pack:PACK,
    solveItem:base.solveItem,
    evaluateResponse:base.evaluateResponse,
    formatResult:base.formatResult,
    hintFor:base.hintFor,
    solutionFor:base.solutionFor,
    validateItem:validateItem,
    validatePack:validatePack,
    renderVisual:renderVisual
  });
});
