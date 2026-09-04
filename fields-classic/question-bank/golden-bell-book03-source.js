const numericPart = (id, label, answer, unit = "") => ({ id, label, answer: String(answer), ...(unit ? { unit } : {}) });
const textPart = (id, label, answer) => ({ id, label, answer, inputMode: "text" });
const aliases = (...values) => values;
const sourceAt = (slide, detail = "") => `교사용 슬라이드 ${slide}${detail ? ` ${detail}` : ""}`;
const printGroup = (index, perSheet = 2) => Math.floor(index / perSheet) + 1;
const visual = (subtype, data = {}) => ({ kind: "book3", subtype, ...data });

function inputItem({ id, sourceNo, typeLabel, prompt, answer, solution, visual: itemVisual, parts, options, inputMode = "numeric", sourceLocator, sourceDiscrepancy, group }) {
  return {
    id,
    sourceNo,
    typeLabel,
    sourceLocator,
    printGroup: group,
    prompt,
    ...(itemVisual ? { visual: itemVisual } : {}),
    ...(parts ? { parts } : options ? { options, answer } : { answerMode: "input", inputMode, answer }),
    ...(sourceDiscrepancy ? { sourceDiscrepancy } : {}),
    solution
  };
}

function similarPractice({ id, prompt, answer, explanation, visual: itemVisual, inputMode = "numeric" }) {
  return [{
    id: `${id}:extension:2`,
    title: "유사문제",
    story: "같은 생각 방법을 새 수와 모양에 적용해 봅니다.",
    prompt,
    visual: itemVisual,
    answerMode: "input",
    inputMode,
    answer,
    explanation,
    structureKey: `${id}-source-structure`,
    practiceKind: "source-structured-authored",
    estimatedMinutes: 4
  }];
}

function genericExperience({ family, title, hint, beats, check }) {
  return {
    kind: "guided-concept",
    family,
    title,
    hint,
    learnerStage: "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정 3권",
    beats: beats.map((beat, index) => ({
      id: `${family}-${index + 1}`,
      action: index === beats.length - 1 ? "verify" : index === 0 ? "draw" : "transform",
      ...beat
    })),
    check,
    finalStill: { standsAlone: true }
  };
}

function sourceLesson({ base, id, unit, title, pages, sourceTypeIds, representativeConcept, experience, story, explanation, prompt, items, extension, practice, sourceHold }) {
  return {
    ...(base || {}),
    id,
    unit,
    title,
    sourceLocator: `교사용 슬라이드 ${pages}`,
    sourceTypeIds,
    representativeConcept,
    experience: experience || base?.experience,
    story: story || base?.story,
    explanation: explanation || base?.explanation,
    original: {
      title: "골든벨과 기초 연산",
      mode: "paged",
      sourceQuestionCount: items.length,
      structureKey: `${id}-source-structure`,
      prompt,
      items
    },
    extension: { ...extension, title: "추가 학습", structureKey: `${id}-source-structure` },
    similarPractice: similarPractice({ id, ...practice }),
    ...(sourceHold ? { sourceHold } : {})
  };
}

const areaShapes = [
  { answer: 3, points: [[0,1],[1,0],[2,0],[3,1],[2,1],[2,2],[1,2],[1,1]] },
  { answer: 6, points: [[0,2],[1,0],[4,0],[3,2]] },
  { answer: 4, points: [[1,0],[2,1],[2,2],[1,3],[0,2],[0,1]] },
  { answer: 8, points: [[2,0],[3,1],[3,2],[4,3],[3,3],[3,4],[1,4],[1,3],[0,3],[1,2],[1,1]] },
  { answer: 7, polygons: [[[2,0],[3,1],[2,2],[1,1]], [[2,2],[4,4],[5,2],[5,4],[0,4]]] },
  { answer: 6, points: [[0,2],[1,1],[2,2],[4,2],[5,1],[4,3],[2,3],[2,4],[1,3],[0,3]] },
  { answer: 6, points: [[5,2],[4,1],[3,2],[1,2],[0,1],[1,3],[3,3],[3,4],[4,3],[5,3]] },
  { answer: 7, points: [[1,0],[3,0],[2,1],[2,2],[3,2],[3,3],[2,4],[1,4],[2,3],[1,3],[1,2],[0,2],[0,1]] },
  { answer: 7, points: [[1,0],[2,0],[3,1],[2,1],[3,2],[2,2],[3,3],[2,3],[2,4],[1,4],[1,3],[0,3],[1,2],[0,2],[1,1],[0,1]] },
  { answer: 15, polygons: [
    [[1,1],[4,1],[4,5],[1,5]], [[1,2],[1,3],[0,3]], [[4,2],[5,3],[4,3]],
    [[1,1],[2,0],[2,1]], [[2,1],[3,0],[3,1]], [[3,1],[4,0],[4,1]], [[4,4],[5,4],[4,5]]
  ] }
];

const areaItems = areaShapes.map((shape, index) => inputItem({
  id: `unit-area-${index + 1}`,
  sourceNo: `4-(${index + 1})`,
  typeLabel: "모눈 한 칸으로 도형 넓이 세기",
  sourceLocator: sourceAt(4, `활동 01 (${index + 1})`),
  group: printGroup(index),
  prompt: "작은 정사각형 한 칸의 넓이가 1일 때 색칠한 도형의 넓이를 구하세요.",
  visual: visual("area-grid-composite", { polygons: shape.polygons || [shape.points] }),
  answer: String(shape.answer),
  solution: `온칸을 세고 대각선으로 나뉜 반칸은 두 개씩 묶습니다. 모두 합한 넓이는 ${shape.answer}입니다.`
}));

areaItems.push(
  inputItem({
    id: "alternating-area-seventh", sourceNo: "5-(1)", typeLabel: "번갈아 커지는 도형 넓이", sourceLocator: sourceAt(5, "활동 02"), group: 6,
    prompt: "정사각형과 마름모의 넓이가 1, 2, 4, 8, …로 커집니다. 일곱 번째 도형의 넓이를 구하세요.",
    visual: visual("alternating-area", { stages: [1,2,4,8,16], target: 7 }), answer: "64",
    solution: "앞 넓이에 2를 곱하면 다음 넓이가 됩니다. 1, 2, 4, 8, 16, 32, 64이므로 일곱 번째는 64입니다."
  }),
  inputItem({
    id: "nested-diamond-area", sourceNo: "5-(2)", typeLabel: "겹친 정사각형과 마름모 넓이", sourceLocator: sourceAt(5, "활동 03"), group: 6,
    prompt: "안쪽 파란 마름모의 넓이가 2일 때, 바깥 주황 마름모의 넓이를 구하세요.",
    visual: visual("nested-square-area", { sourceVariant: "diamond-outer", givenArea: 2, targetArea: 8 }), answer: "8",
    solution: "파란 마름모를 둘러싼 같은 넓이의 삼각형 네 부분을 합치면 주황 마름모가 됩니다. 파란 부분의 넓이 2를 4배 하여 8입니다."
  }),
  inputItem({
    id: "nested-square-area", sourceNo: "5-(3)", typeLabel: "겹친 정사각형과 마름모 넓이", sourceLocator: sourceAt(5, "활동 04"), group: 7,
    prompt: "바깥 파란 정사각형의 넓이가 32일 때, 가장 안쪽 주황 마름모의 넓이를 구하세요.",
    visual: visual("nested-square-area", { sourceVariant: "square-diamond", givenArea: 32, targetArea: 4 }), answer: "4",
    solution: "꼭짓점을 이은 안쪽 도형은 바로 바깥 도형 넓이의 절반입니다. 32를 두 번 반으로 나누면 16, 8이고, 다시 표시된 절반을 구하면 4입니다."
  })
);

const areaLesson = sourceLesson({
  id: "unit-area-shapes", unit: "단위넓이와 분수", title: "모눈 한 칸으로 넓이를 재어요", pages: "2~5, 활동 01~04",
  sourceTypeIds: ["unit-grid-area", "nested-square-outer-area"], representativeConcept: "한 칸의 넓이를 1로 정하고 온칸과 반칸을 묶어 복합 도형의 넓이를 구함",
  experience: genericExperience({ family: "book3-unit-area", title: "온칸과 반칸을 묶어 넓이를 세어요", hint: "비스듬한 변 옆의 반칸 두 개를 온칸 하나로 바꾸어 보세요.", beats: [
    { phase: "grid", caption: "모눈 한 칸의 넓이를 1로 정합니다.", visual: visual("area-grid-composite", { polygons: [[[0,0],[3,0],[3,2],[0,2]]] }) },
    { phase: "whole", caption: "먼저 도형 안의 온칸을 셉니다.", visual: visual("area-grid-composite", { polygons: [areaShapes[0].points] }) },
    { phase: "half", caption: "반칸 두 개를 모아 온칸 하나로 바꿉니다.", visual: visual("area-grid-composite", { polygons: [areaShapes[2].points] }) },
    { phase: "verify", caption: "온칸과 묶은 반칸을 모두 더해 넓이를 확인합니다.", visual: visual("math-expression", { expression: "2 + 1/2 + 1/2 = 3" }) }
  ], check: { prompt: "온칸 4개와 반칸 4개인 도형의 넓이는 얼마인가요?", options: ["6","8","12"], answer: "6", explanation: "반칸 4개는 온칸 2개이므로 4+2=6입니다." } }),
  story: { title: "모눈 도시의 넓이 조사", text: "모양이 달라도 같은 한 칸을 기준으로 재면 넓이를 비교할 수 있습니다.", mission: "온칸과 반칸을 따로 표시한 뒤 합하세요." },
  explanation: { headline: "기준 한 칸과 반칸 짝을 차례로 셉니다.", steps: ["한 칸의 넓이를 1로 봅니다.", "온칸을 먼저 셉니다.", "반칸 두 개를 1로 묶어 모두 더합니다."] },
  prompt: "교사용 활동의 모눈 도형을 보고 문제마다 바로 아래 답칸에 넓이를 쓰세요.", items: areaItems,
  extension: { story: "온칸 7개와 반칸 6개로 만든 새 도형입니다.", prompt: "도형의 넓이를 구하세요.", visual: visual("math-expression", { expression: "7 + 반칸 6개" }), answerMode: "input", inputMode: "numeric", answer: "10", explanation: "반칸 6개는 온칸 3개이므로 7+3=10입니다." },
  practice: { prompt: "온칸 5개와 반칸 8개인 도형의 넓이는 얼마입니까?", visual: visual("math-expression", { expression: "5 + 반칸 8개" }), answer: "9", explanation: "반칸 8개는 온칸 4개이므로 5+4=9입니다." }
});

const sixSource = [
  ["6+6+6+6+60=6×□",14], ["6×20+6=6×□",21], ["6×28+6+6=6×□",30],
  ["6+6+6+6=6×□",4], ["6+6+6+6=12×□",2], ["6+6+6+6=24×□",1],
  ["12×7=6×□",14], ["12×7=3×□",28], ["12×7=2×□",42],
  ["6×124-6=6×□",123], ["6×79-12=6×□",77], ["275×6-18=6×□",272]
];

const sixItems = sixSource.map(([expression, answer], index) => inputItem({
  id: `six-${index + 1}`, sourceNo: `6-(${index + 1})`, typeLabel: "6의 배수 등가식", sourceLocator: sourceAt(6, `(${index + 1})`), group: printGroup(index),
  prompt: `${expression}가 성립하도록 빈칸에 알맞은 수를 쓰세요.`, visual: visual("math-expression", { expression }), answer: String(answer),
  solution: `모든 항을 6개짜리 묶음 수로 바꾸어 더하거나 뺍니다. 계산하면 빈칸은 ${answer}이고 양쪽 값이 같습니다.`
}));

function completeSixLesson(base) {
  return sourceLesson({
    base, id: "six-multiple-equations", unit: "단위넓이와 분수", title: "6의 배수로 식을 바꿔요", pages: "6, 6의 배수 연산",
    sourceTypeIds: ["constant-step-number-sequence"], representativeConcept: "수를 6개짜리 묶음 수로 바꾸어 같은 값을 나타내는 곱셈식으로 정리함",
    prompt: "각 식이 성립하도록 빈칸에 알맞은 수를 쓰세요.", items: sixItems,
    extension: { story: "8개짜리 묶음으로 식을 바꿉니다.", prompt: "8×25+16=8×□일 때 빈칸을 쓰세요.", visual: visual("math-expression", { expression: "8×25+16=8×□" }), answerMode: "input", inputMode: "numeric", answer: "27", explanation: "16은 8이 두 묶음이므로 25+2=27입니다." },
    practice: { prompt: "7×18-14=7×□입니다. 빈칸을 쓰세요.", visual: visual("math-expression", { expression: "7×18-14=7×□" }), answer: "16", explanation: "14는 7이 두 묶음이므로 18-2=16입니다." }
  });
}

const fractionSource = [
  { slide:7, shape:"circle", parts:3, shaded:2, answer:"2/3" }, { slide:7, shape:"circle", parts:6, shaded:4, answer:"4/6" },
  { slide:7, shape:"circle", parts:9, shaded:6, answer:"6/9" }, { slide:7, shape:"circle", parts:4, shaded:3, answer:"3/4" },
  { slide:7, shape:"circle", parts:8, shaded:6, answer:"6/8" }, { slide:7, shape:"circle", parts:12, shaded:9, answer:"9/12" },
  { slide:8, shape:"rectangle", held:true },
  { slide:8, shape:"rectangle", rows:3, columns:3, shaded:3, shadedIndices:[0,4,8], answer:"3/9" },
  { slide:8, shape:"rectangle", rows:4, columns:4, shaded:6, shadedIndices:[0,3,5,10,12,15], answer:"6/16" },
  { slide:8, shape:"rectangle", rows:5, columns:5, shaded:10, shadedIndices:[0,2,4,7,11,13,17,20,22,24], answer:"10/25" },
  { slide:8, shape:"triangle", parts:3, shaded:1, shadedIndices:[1], answer:"1/3" },
  { slide:8, shape:"triangle", parts:4, shaded:3, shadedIndices:[0,1,2], answer:"3/4" },
  { slide:8, shape:"triangle", parts:6, shaded:2, shadedIndices:[1,4], answer:"2/6" },
  { slide:8, shape:"triangle", held:true },
  { slide:8, shape:"square", held:true },
  { slide:8, shape:"square", rows:2, columns:2, shaded:1, shadedIndices:[0], answer:"1/4" },
  { slide:8, shape:"square", parts:8, shaded:3, sourceTemplate:"square-eight", answer:"3/8" },
  { slide:8, shape:"square", parts:16, shaded:6, sourceTemplate:"square-sixteen", answer:"6/16" }
];

const fractionItems = fractionSource.flatMap((entry, index) => {
  const sourceIndex = entry.slide === 7 ? index + 1 : index - 5;
  if (entry.held) return [];
  const itemVisual = entry.shape === "circle"
    ? visual("equal-fraction-source", { template: "circle-radial", parts: entry.parts, shaded: entry.shaded, shadedIndices:Array.from({ length:entry.shaded }, (_, offset) => entry.parts - entry.shaded + offset), rotation: 0 })
    : entry.sourceTemplate
      ? visual("slide8-fraction-source", { template: entry.sourceTemplate, parts: entry.parts, shaded: entry.shaded })
    : entry.shape === "triangle"
      ? visual("equal-partition-source", { template: `triangle-${entry.parts}`, shape: "triangle", parts: entry.parts, shaded: entry.shaded, shadedIndices:entry.shadedIndices, rotation: 0, complete: true })
      : visual("fraction-grid", { rows: entry.rows, columns: entry.columns, shaded: entry.shaded, shadedIndices:entry.shadedIndices });
  return [inputItem({
    id: `fraction-${index + 1}`, sourceNo: `${entry.slide}-(${sourceIndex})`, typeLabel: "같은 크기로 나눈 도형의 분수", sourceLocator: sourceAt(entry.slide, `(${sourceIndex})`), group: printGroup(index),
    prompt: "색칠한 부분은 전체의 얼마인지 분수로 쓰세요.", visual: itemVisual,
    answer: aliases(entry.answer, `${entry.answer.split("/")[1]}분의${entry.answer.split("/")[0]}`), inputMode: "text",
    solution: `전체를 같은 크기로 나눈 조각 수가 분모이고 색칠한 조각 수가 분자입니다. 따라서 ${entry.answer}입니다.`
  })];
});

const fractionLesson = sourceLesson({
  id: "fraction-shading", unit: "단위넓이와 분수", title: "색칠한 부분을 분수로 나타내요", pages: "7~8, 분수 활동",
  sourceTypeIds: ["equal-part-shaded-fraction"], representativeConcept: "전체를 같은 크기로 나눈 수를 분모, 색칠한 조각 수를 분자로 나타냄",
  experience: genericExperience({ family: "book3-fraction-shading", title: "전체 조각과 색칠한 조각을 따로 세어요", hint: "먼저 모든 조각의 크기가 같은지 확인하고 분모부터 정하세요.", beats: [
    { phase: "whole", caption: "도형 전체를 하나로 봅니다.", visual: visual("equal-fraction-source", { template:"circle-radial", parts:3, shaded:0, rotation:0 }) },
    { phase: "parts", caption: "같은 크기 3조각이므로 분모는 3입니다.", visual: visual("equal-fraction-source", { template:"circle-radial", parts:3, shaded:0, rotation:0 }) },
    { phase: "shade", caption: "그중 2조각이 색칠되어 분자는 2입니다.", visual: visual("equal-fraction-source", { template:"circle-radial", parts:3, shaded:2, rotation:0 }) },
    { phase: "verify", caption: "색칠한 부분은 전체의 2/3인지 그림으로 확인합니다.", visual: visual("math-expression", { expression:"색칠 2조각 / 전체 3조각 = 2/3" }) }
  ], check: { prompt: "같은 크기 8조각 중 3조각을 색칠하면 얼마인가요?", options:["3/8","5/8","8/3"], answer:"3/8", explanation:"전체 8이 분모, 색칠한 3이 분자입니다." } }),
  story: { title:"같은 크기 조각의 약속", text:"모양이 달라도 조각의 크기가 같으면 색칠한 양을 분수로 나타낼 수 있습니다.", mission:"전체 조각과 색칠한 조각을 차례로 세세요." },
  explanation: { headline:"분모와 분자를 그림에서 직접 찾습니다.", steps:["같은 크기 전체 조각 수를 셉니다.", "색칠한 조각 수를 셉니다.", "전체 수를 아래에, 색칠한 수를 위에 씁니다."] },
  prompt:"각 원·삼각형·사각형의 색칠한 부분을 분수로 나타내세요.", items:fractionItems,
  extension:{ story:"정사각형을 같은 크기 20칸으로 나누고 7칸을 색칠했습니다.", prompt:"색칠한 부분을 분수로 쓰세요.", visual:visual("fraction-grid", { rows:4,columns:5,shaded:7 }), answerMode:"input", inputMode:"text", answer:aliases("7/20","20분의7"), explanation:"전체 20칸 중 7칸이므로 7/20입니다." },
  practice:{ prompt:"같은 크기 15칸 중 6칸을 색칠했습니다. 분수로 쓰세요.", visual:visual("fraction-grid", { rows:3,columns:5,shaded:6 }), answer:aliases("6/15","15분의6"), inputMode:"text", explanation:"전체 15칸 중 6칸이므로 6/15입니다." },
  sourceHold:{ sourceLocator:"교사용 슬라이드 8, 활동 02 (1), (8), (9)", itemCount:3, reason:"색칠된 같은 크기 조각 수와 교사용 표시 답이 서로 충돌하여 단일 정답을 입증할 수 없음" }
});

const partitionSource = [
  [9,"source-triangle-quarter",4,1,"1/4"], [9,"source-triangle-eighth",8,1,"1/8"],
  [9,"source-triangle-twelfth",12,1,"1/12"], [9,"source-triangle-sixteenth",16,1,"1/16"],
  [10,"source-solid-third",3,1,"1/3"], [10,"source-solid-sixth",6,1,"1/6"],
  [10,"source-solid-twelfth",12,1,"1/12"], [10,"source-solid-five-twelfths",12,5,"5/12"],
  [10,"source-solid-eighteenth",18,1,"1/18"], [10,"source-solid-twenty-fourth",24,1,"1/24"]
];

const partitionItems = partitionSource.map(([slide, template, parts, shaded, answer], index) => {
  const sourceIndex = slide === 9 ? index + 1 : index - 3;
  return inputItem({
    id:`partition-${index + 1}`, sourceNo:`${slide}-(${sourceIndex})`, typeLabel:"도형을 같은 크기로 나눈 분수", sourceLocator:sourceAt(slide, `(${sourceIndex})`), group:printGroup(index),
    prompt:"색칠한 부분은 전체 도형의 얼마인지 분수로 쓰세요.",
    visual:visual("source-fraction-stage", { template, parts, shaded }),
    answer:aliases(answer, `${answer.split("/")[1]}분의${answer.split("/")[0]}`), inputMode:"text",
    solution:`도형 전체를 같은 크기 ${parts}조각으로 나누고 ${shaded}조각을 골랐으므로 ${answer}입니다.`
  });
});

const partitionLesson = sourceLesson({
  id:"equal-partition-fractions", unit:"단위넓이와 분수", title:"도형을 똑같은 조각으로 나누어요", pages:"9~10, 같은 크기 분할",
  sourceTypeIds:["equal-partition-drawing"], representativeConcept:"전체 도형을 같은 모양과 크기의 조각으로 나눈 뒤 한 조각 또는 여러 조각을 분수로 나타냄",
  experience:genericExperience({ family:"book3-equal-partition", title:"점과 선을 이어 같은 조각으로 나누어요", hint:"조각 수만 맞추지 말고 모양과 크기가 서로 포개지는지도 확인하세요.", beats:[
    { phase:"outline", caption:"먼저 전체 도형의 대칭과 가운데 점을 찾습니다.", visual:visual("incomplete-partition-source", { template:"triangle-4",shape:"triangle",parts:4,shaded:0,rotation:0,complete:false,visibleLines:0,targetParts:4 }) },
    { phase:"first", caption:"가운데 점과 변의 가운데를 연결합니다.", visual:visual("incomplete-partition-source", { template:"triangle-4",shape:"triangle",parts:4,shaded:0,rotation:0,complete:false,visibleLines:2,targetParts:4 }) },
    { phase:"complete", caption:"선을 끝까지 이어 같은 크기 4조각을 만듭니다.", visual:visual("equal-partition-source", { template:"triangle-4",shape:"triangle",parts:4,shaded:1,rotation:0,complete:true,targetParts:4 }) },
    { phase:"verify", caption:"네 조각이 돌리거나 뒤집으면 서로 포개지는지 확인합니다.", visual:visual("math-expression", { expression:"한 조각 / 전체 4조각 = 1/4" }) }
  ], check:{ prompt:"전체를 같은 크기 6조각으로 나눈 한 조각은 얼마인가요?", options:["1/3","1/6","6/1"], answer:"1/6", explanation:"전체 6조각 가운데 한 조각이므로 1/6입니다." } }),
  story:{ title:"같은 조각을 만드는 설계실", text:"선의 수가 아니라 완성된 조각의 모양과 크기가 모두 같은지가 중요합니다.", mission:"대칭과 가운데를 이용해 조각을 나누고 분수로 나타내세요." },
  explanation:{ headline:"분할선과 완성 조각을 함께 확인합니다.", steps:["전체 도형의 대칭점을 찾습니다.", "꼭짓점과 가운데 점을 규칙 있게 연결합니다.", "완성된 모든 조각의 모양과 크기가 같은지 확인합니다."] },
  prompt:"원본 도형의 분할선을 보고 색칠한 부분을 분수로 나타내세요.", items:partitionItems,
  extension:{ story:"정육각형을 같은 크기 18조각으로 나누었습니다.", prompt:"그중 5조각을 색칠하면 얼마입니까?", visual:visual("equal-partition-source", { template:"hexagon-18",shape:"hexagon",parts:18,shaded:5,rotation:0,complete:true,targetParts:18 }), answerMode:"input", inputMode:"text", answer:aliases("5/18","18분의5"), explanation:"전체 18조각 중 5조각이므로 5/18입니다." },
  practice:{ prompt:"삼각형을 같은 크기 12조각으로 나누고 7조각을 색칠했습니다. 분수로 쓰세요.", visual:visual("equal-partition-source", { template:"triangle-12",shape:"triangle",parts:12,shaded:7,rotation:0,complete:true,targetParts:12 }), answer:aliases("7/12","12분의7"), inputMode:"text", explanation:"전체 12조각 중 7조각이므로 7/12입니다." }
});

const tapeSources = [
  { answer:4, points:[[0,0],[2,0],[2,2]] },
  { answer:6, points:[[0,0],[0,3],[3,3]] },
  { answer:6, points:[[0,1],[0,0],[4,0],[4,1]] },
  { answer:8, points:[[0,2],[0,0],[4,0],[4,2]] }
];
const tapeItems = tapeSources.map(({ answer,points }, index) => inputItem({
  id:`tape-length-${index + 1}`, sourceNo:`13-1-(${index + 1})`, typeLabel:"접힌 색테이프의 전체 길이", sourceLocator:sourceAt(13, `활동 01 (${index + 1})`), group:printGroup(index),
  prompt:"모눈 한 칸이 1cm일 때 접혀 있는 색테이프를 곧게 펴면 몇 cm인지 구하세요.",
  visual:visual("folded-tape-source", { points,unitLabel:"1cm" }), answer:String(answer),
  solution:`접힌 방향과 관계없이 지나간 모눈 한 칸을 1cm로 세면 모두 ${answer}칸입니다. 따라서 전체 길이는 ${answer}cm입니다.`
}));

const midpointSource = [[0,18,9],[0,26,13],[0,30,15],[2,10,6],[5,19,12],[9,25,17],[16,38,27],[29,47,38],[36,62,49]];
midpointSource.forEach(([left, right, answer], index) => tapeItems.push(inputItem({
  id:`midpoint-${index + 1}`, sourceNo:`13-2-(${index + 1})`, typeLabel:"두 수의 한가운데 수", sourceLocator:sourceAt(13, `활동 02 (${index + 1})`), group:printGroup(index + 4),
  prompt:`${left}과 ${right}의 한가운데에 있는 수를 구하세요.`, visual:visual("number-line", { left, right, divisions:2, target:"middle" }), answer:String(answer),
  solution:`두 수의 합 ${left + right}을 2로 똑같이 나누면 ${answer}입니다. 양끝에서 ${Math.abs(answer - left)}만큼 떨어져 있어 한가운데가 맞습니다.`
})));

const tapeLesson = sourceLesson({
  id:"tape-length-midpoints", unit:"단위길이와 배수", title:"테이프 길이와 한가운데 수를 찾아요", pages:"12~13, 단위길이 활동 01~02",
  sourceTypeIds:["folded-strip-length","midpoint-number-line"], representativeConcept:"꺾인 테이프의 모눈 길이를 더하고 두 수의 합을 반으로 나누어 한가운데 수를 구함",
  experience:genericExperience({ family:"book3-tape-midpoint", title:"꺾인 길이를 펴고 한가운데를 찾아요", hint:"모양이 꺾여도 지나간 한 칸의 수는 변하지 않습니다.", beats:[
    { phase:"folded", caption:"접힌 테이프가 지나간 모눈 칸을 차례로 셉니다.", visual:visual("folded-tape-source", { points:tapeSources[3].points,unitLabel:"1cm" }) },
    { phase:"straight", caption:"곧게 펴도 전체 8칸, 8cm입니다.", visual:visual("math-expression", { expression:"1cm × 8칸 = 8cm" }) },
    { phase:"middle", caption:"양끝 5와 19의 합을 2로 나눕니다.", visual:visual("number-line", { left:5,right:19,divisions:2,target:"middle" }) },
    { phase:"verify", caption:"12는 5와 19에서 각각 7만큼 떨어져 있습니다.", visual:visual("math-expression", { expression:"12-5 = 19-12 = 7" }) }
  ], check:{ prompt:"8과 20의 한가운데 수는 얼마인가요?", options:["12","14","16"], answer:"14", explanation:"(8+20)÷2=14입니다." } }),
  story:{ title:"색테이프 길이 연구소", text:"접혀 보이는 길이는 방향이 달라도 같은 단위칸으로 잴 수 있습니다.", mission:"한 칸씩 세고 양끝에서 같은 거리인지 확인하세요." },
  explanation:{ headline:"단위칸과 양끝의 거리를 이용합니다.", steps:["접힌 테이프가 지나간 칸을 빠짐없이 셉니다.", "한 칸의 길이를 곱해 전체 길이를 구합니다.", "한가운데 수는 두 끝 수의 합을 2로 나눕니다."] },
  prompt:"테이프를 곧게 편 길이와 수직선의 한가운데 수를 문제마다 구하세요.", items:tapeItems,
  extension:{ story:"접힌 테이프가 11칸을 지나고 한 칸은 2cm입니다.", prompt:"전체 길이는 몇 cm입니까?", visual:visual("math-expression", { expression:"2cm × 11칸" }), answerMode:"input", inputMode:"numeric", answer:"22", explanation:"2cm인 칸이 11개이므로 2×11=22cm입니다." },
  practice:{ prompt:"17과 43의 한가운데 수를 구하세요.", visual:visual("number-line", { left:17,right:43,divisions:2,target:"middle" }), answer:"30", explanation:"(17+43)÷2=30이고 양끝에서 각각 13만큼 떨어져 있습니다." }
});

const routeSource = [
  { id:"route-fields-station", prompt:"필즈에서 기차역까지의 거리를 구하세요.", labels:["집","필즈","역"], positions:[0,36,50], spans:[{from:0,to:2,label:"50cm"},{from:0,to:1,label:"36cm"}], answer:14 },
  { id:"route-home-super", prompt:"집에서 슈퍼마켓까지의 거리를 구하세요.", labels:["집","슈퍼","역"], positions:[0,8,50], spans:[{from:0,to:2,label:"50cm"},{from:1,to:2,label:"42cm"}], answer:8 },
  { id:"route-super-fields", prompt:"슈퍼마켓에서 필즈까지의 거리를 구하세요.", labels:["집","슈퍼","필즈","역"], positions:[0,8,36,50], spans:[{from:0,to:2,label:"36cm"},{from:1,to:3,label:"42cm"},{from:0,to:3,label:"50cm"}], answer:28 }
];

const routeItems = routeSource.map((entry, index) => inputItem({
  id:entry.id, sourceNo:`14-(1-${index + 1})`, typeLabel:"겹친 전체 거리에서 부분 거리 찾기", sourceLocator:sourceAt(14, "활동 03"), group:printGroup(index),
  prompt:entry.prompt, visual:visual("distance-chain-source", { labels:entry.labels,positions:entry.positions,spans:entry.spans }), answer:String(entry.answer),
  solution:`같은 길 위의 전체 거리에서 이미 아는 부분 거리를 빼면 ${entry.answer}cm입니다. 이어 붙였을 때 전체 거리와 같아지는지 확인합니다.`
}));

const chainSource = [
  { givens:{AD:17,AC:8,BD:12}, parts:[5,3,9], labels:["AB","BC","CD"] },
  { givens:{AD:40,AC:19,BD:27}, parts:[13,6,21], labels:["AB","BC","CD"] },
  { givens:{AC:21,BD:29,BC:7}, parts:[14,22,43], labels:["AB","CD","AD"] },
  { givens:{AC:31,BD:45,BC:11}, parts:[20,34,65], labels:["AB","CD","AD"] },
  { givens:{AD:47,AC:23,BD:36}, parts:[12], labels:["BC"] },
  { givens:{AC:18,BD:28,BC:6}, parts:[40], labels:["AD"] }
];

chainSource.forEach((entry, index) => routeItems.push(inputItem({
  id:`distance-chain-${index + 1}`, sourceNo:`14-(2-${index + 1})`, typeLabel:"겹친 선분의 합과 차", sourceLocator:sourceAt(14, `활동 04 (${index + 1})`), group:printGroup(index + 3, 1),
  prompt:`A-B-C-D가 한 줄에 있을 때 주어진 길이로 ${entry.labels.join(", ")}의 길이를 구하세요.`,
  visual:visual("segment-chain", { labels:["A","B","C","D"], givens:{ ...entry.givens }, target:entry.labels.join(", ") }),
  parts:entry.parts.map((answer, partIndex) => numericPart(entry.labels[partIndex].toLowerCase(), entry.labels[partIndex], answer, "cm")),
  solution:`겹치는 BC를 기준으로 전체와 부분의 합·차를 차례로 계산합니다. ${entry.labels.map((label, i) => `${label}=${entry.parts[i]}cm`).join(", ")}이고 모두 이어 더하면 주어진 길이와 같습니다.`
})));

const distanceLesson = sourceLesson({
  id:"overlapping-distance", unit:"단위길이와 배수", title:"겹친 거리의 합과 차를 찾아요", pages:"14~15, 거리 활동 03~04",
  sourceTypeIds:["overlapping-segment-distance"], representativeConcept:"한 줄 위에서 겹치는 구간을 표시하고 전체 거리와 부분 거리의 합·차로 모르는 구간을 구함",
  experience:genericExperience({ family:"book3-overlap-distance", title:"겹친 구간을 먼저 찾아요", hint:"두 긴 거리에 함께 들어 있는 가운데 구간 BC를 표시하세요.", beats:[
    { phase:"line", caption:"A-B-C-D의 순서와 구간을 한 줄에 놓습니다.", visual:visual("distance-chain-source", { labels:["A","B","C","D"],positions:[0,1,2,3],spans:[] }) },
    { phase:"known", caption:"AC와 BD가 겹치는 곳은 BC입니다.", visual:visual("distance-chain-source", { labels:["A","B","C","D"],positions:[0,1,2,3],spans:[{from:0,to:2,label:"AC"},{from:1,to:3,label:"BD"}] }) },
    { phase:"solve", caption:"전체 AD와 두 긴 거리의 관계로 BC를 구합니다.", visual:visual("math-expression", { expression:"BC = AC + BD - AD" }) },
    { phase:"verify", caption:"구한 AB, BC, CD를 더해 AD가 되는지 확인합니다.", visual:visual("math-expression", { expression:"AB + BC + CD = AD" }) }
  ], check:{ prompt:"AC=12, BD=15, AD=22cm이면 겹친 BC는 몇 cm인가요?", options:["5","7","10"], answer:"5", explanation:"BC=12+15-22=5cm입니다." } }),
  story:{ title:"한 길 위의 네 장소", text:"두 이동 경로가 겹치면 같은 구간을 두 번 센 부분을 찾아야 합니다.", mission:"장소 순서와 겹친 구간을 선 위에 먼저 표시하세요." },
  explanation:{ headline:"겹친 구간을 한 번만 세도록 합과 차를 정리합니다.", steps:["A-B-C-D 순서를 표시합니다.", "두 긴 구간이 공통으로 가진 BC를 찾습니다.", "부분을 더하거나 전체를 빼고 원래 거리로 검산합니다."] },
  prompt:"원본 거리 그림의 주어진 길이를 이용해 물음표 구간을 구하세요.", items:routeItems,
  extension:{ story:"AC는 24cm, BD는 31cm, AD는 47cm입니다.", prompt:"겹친 BC는 몇 cm입니까?", visual:visual("distance-chain-source", { labels:["A","B","C","D"],positions:[0,1,2,3],spans:[{from:0,to:2,label:"24cm"},{from:1,to:3,label:"31cm"},{from:0,to:3,label:"47cm"}] }), answerMode:"input", inputMode:"numeric", answer:"8", explanation:"24+31-47=8cm입니다." },
  practice:{ prompt:"AC=28cm, BD=35cm, BC=9cm일 때 AD는 몇 cm입니까?", visual:visual("math-expression", { expression:"AD = AC + BD - BC" }), answer:"54", explanation:"28+35-9=54cm입니다." }
});

const multipleSource = [
  { slide:16, prompt:"B는 A의 몇 배입니까?", compareUnits:4, answer:4 },
  { slide:16, prompt:"A는 B의 몇 배입니까?", compareUnits:6, answer:6 },
  { slide:16, prompt:"42는 6의 몇 배입니까?", compareUnits:7, answer:7 },
  { slide:16, prompt:"16은 8의 몇 배입니까?", compareUnits:2, answer:2 },
  { slide:16, prompt:"16은 2의 몇 배입니까?", compareUnits:8, answer:8 },
  { slide:16, prompt:"35는 7의 몇 배입니까?", compareUnits:5, answer:5 },
  { slide:16, prompt:"35는 5의 몇 배입니까?", compareUnits:7, answer:7 },
  { slide:17, prompt:"1부터 9까지를 두 개의 같은 간격으로 나눈 한 칸의 크기를 구하세요.", left:1, right:9, divisions:2, answer:4 },
  { slide:17, prompt:"5부터 27까지를 두 개의 같은 간격으로 나눈 한 칸의 크기를 구하세요.", left:5, right:27, divisions:2, answer:11 },
  { slide:17, prompt:"17부터 49까지를 네 개의 같은 간격으로 나눈 한 칸의 크기를 구하세요.", left:17, right:49, divisions:4, answer:8 },
  { slide:17, prompt:"7부터 42까지를 다섯 개의 같은 간격으로 나눈 한 칸의 크기를 구하세요.", left:7, right:42, divisions:5, answer:7 },
  { slide:17, prompt:"28부터 70까지를 일곱 개의 같은 간격으로 나눈 한 칸의 크기를 구하세요.", left:28, right:70, divisions:7, answer:6 },
  { slide:17, prompt:"19부터 83까지를 여덟 개의 같은 간격으로 나눈 한 칸의 크기를 구하세요.", left:19, right:83, divisions:8, answer:8 }
];

const multipleItems = multipleSource.map((entry, index) => inputItem({
  id:`multiple-${index + 1}`, sourceNo:`${entry.slide}-(${entry.slide === 16 ? index + 1 : index - 6})`, typeLabel:entry.slide === 16 ? "기준량의 몇 배" : "똑같은 간격의 한 칸", sourceLocator:sourceAt(entry.slide, `(${entry.slide === 16 ? index + 1 : index - 6})`), group:printGroup(index), prompt:entry.prompt,
  visual:entry.slide === 16
    ? visual("multiple-model", { baseUnits:1,compareUnits:entry.compareUnits,baseLabel:"기준",compareLabel:"비교" })
    : visual("number-line", { left:entry.left,right:entry.right,divisions:entry.divisions,target:"interval" }),
  answer:String(entry.answer),
  solution:entry.slide === 16
    ? `비교하는 양 안에 기준량이 ${entry.answer}번 들어가므로 ${entry.answer}배입니다. 곱셈으로 다시 확인합니다.`
    : `양끝의 차 ${entry.right - entry.left}을 같은 간격 ${entry.divisions}개로 나누면 한 칸은 ${entry.answer}입니다.`
}));

const ratioSource = [
  { prompt:"ㄱ은 ㄴ의 몇 배입니까?", top:2,bottom:1,parts:[2,1] }, { prompt:"ㄱ은 ㄴ의 몇 배입니까?", top:3,bottom:1,parts:[3,1] },
  { prompt:"ㄱ은 ㄴ의 몇 배입니까?", top:4,bottom:1,answer:4 }, { prompt:"ㄱ이 3cm일 때 ㄴ의 길이를 구하세요.", top:3,bottom:2,answer:2,given:"ㄱ=3cm" },
  { prompt:"ㄱ이 4cm일 때 ㄴ의 길이를 구하세요.", top:4,bottom:3,answer:3,given:"ㄱ=4cm" }
];
ratioSource.forEach((entry,index) => multipleItems.push(inputItem({
  id:`ratio-${index + 1}`, sourceNo:`18-(${index + 1})`, typeLabel:index < 3 ? "두 막대의 배수 비교" : "한 막대의 길이로 다른 막대 찾기", sourceLocator:sourceAt(18, `(${index + 1})`), group:printGroup(index + 13), prompt:entry.prompt,
  visual:visual("ratio-bars", { topUnits:entry.top,bottomUnits:entry.bottom,given:entry.given || "ㄱ은 ㄴ의 몇 배?" }),
  answer:String(entry.answer ?? entry.top),
  solution:index < 3 ? `ㄴ 한 칸과 같은 길이가 ㄱ에 ${entry.top}개 있으므로 ${entry.top}배입니다.` : `ㄱ의 ${entry.top}칸이 ${entry.top}cm이므로 한 칸은 1cm입니다. ㄴ은 같은 한 칸 ${entry.bottom}개이므로 ${entry.answer}cm입니다.`
})));

function completeMultipleLesson(base) {
  return sourceLesson({
    base, id:"multiple-comparison", unit:"단위길이와 배수", title:"몇 배와 같은 간격을 찾아요", pages:"16~18, 배수 활동 01~03",
    sourceTypeIds:["unit-length-multiple","equal-interval-length","rod-ratio-total-book3"], representativeConcept:"기준량이 비교량 안에 몇 번 들어가는지 세고 전체를 같은 수의 간격으로 나눔",
    prompt:"기준량의 몇 배인지 또는 한 칸과 두 막대의 길이를 구하세요.", items:multipleItems,
    extension:{ story:"전체 24cm를 5:3으로 나눈 두 막대입니다.", prompt:"긴 막대의 길이는 몇 cm입니까?", visual:visual("ratio-bars", { topUnits:5,bottomUnits:3,given:"전체 24cm" }), answerMode:"input", inputMode:"numeric", answer:"15", explanation:"전체 8칸이 24cm이므로 한 칸은 3cm, 긴 막대는 5×3=15cm입니다." },
    practice:{ prompt:"54는 6의 몇 배입니까?", visual:visual("multiple-model", { baseUnits:1,compareUnits:9,baseLabel:"6",compareLabel:"54" }), answer:"9", explanation:"54÷6=9이므로 9배입니다." }
  });
}

const cryptVisual = (addends, sum) => visual("cryptarithm-board", { addends: addends.map((value) => [...value]), sum:[...sum] });

const basicCryptItems = [
  inputItem({ id:"basic-crypt-largest-two", sourceNo:"20-(1-1)", typeLabel:"반복 덧셈 복면산의 가장 큰 앞자리", sourceLocator:sourceAt(20,"활동 01 (1)"), group:1,
    prompt:"같은 네모 두 개를 더한 두 자리 수가 세모마름모일 때 세모가 될 수 있는 가장 큰 수를 쓰세요.", visual:cryptVisual(["□","□"],"△◇"), answer:"1",
    solution:"한 자리 수 두 개의 합은 가장 커도 9+9=18입니다. 따라서 십의 자리 세모가 될 수 있는 가장 큰 수는 1입니다." }),
  inputItem({ id:"basic-crypt-largest-three", sourceNo:"20-(1-2)", typeLabel:"반복 덧셈 복면산의 가장 큰 앞자리", sourceLocator:sourceAt(20,"활동 01 (2)"), group:1,
    prompt:"같은 네모 세 개를 더한 두 자리 수가 세모마름모일 때 세모가 될 수 있는 가장 큰 수를 쓰세요.", visual:cryptVisual(["□","□","□"],"△◇"), answer:"2",
    solution:"한 자리 수 세 개의 합은 가장 커도 9+9+9=27입니다. 따라서 십의 자리 세모의 가장 큰 수는 2입니다." }),
  inputItem({ id:"basic-crypt-double-six", sourceNo:"20-(2-1)", typeLabel:"같은 도형 두 번 더하기", sourceLocator:sourceAt(20,"활동 02 (1)"), group:2,
    prompt:"네모+네모=6일 때 네모가 나타내는 수를 쓰세요.", visual:cryptVisual(["□","□"],"6"), answer:"3",
    solution:"같은 수 두 개의 합이 6이므로 6을 2로 똑같이 나눕니다. 네모는 3이고 3+3=6입니다." }),
  inputItem({ id:"basic-crypt-triple-21", sourceNo:"20-(2-4)", typeLabel:"같은 도형 세 번 더하기와 받아올림", sourceLocator:sourceAt(20,"활동 02 (4)"), group:2,
    prompt:"네모+네모+네모=세모1일 때 네모와 세모가 나타내는 수를 차례로 쓰세요.", visual:cryptVisual(["□","□","□"],"△1"),
    parts:[numericPart("square","네모",7),numericPart("triangle","세모",2)], solution:"끝자리가 1인 세 배 수를 찾으면 7+7+7=21입니다. 따라서 네모=7, 세모=2이고 받아올림도 맞습니다." })
];

function completeBasicCryptLesson(base) {
  return sourceLesson({
    base, id:"basic-vertical-cryptarithm", unit:"복면산", title:"같은 도형을 세로로 더해요", pages:"20, 복면산 활동 01~02",
    sourceTypeIds:["cryptarithm-single-double"], representativeConcept:"같은 도형은 같은 숫자이고 서로 다른 도형은 다른 숫자라는 약속으로 일의 자리와 받아올림을 확인함",
    prompt:"도형을 같은 숫자로 바꾸어 세로셈이 맞도록 값을 구하세요.", items:basicCryptItems,
    extension:{ story:"같은 동그라미를 세 번 더했더니 네모5가 되었습니다.", prompt:"동그라미와 네모를 차례로 쉼표로 구분해 쓰세요.", visual:cryptVisual(["○","○","○"],"□5"), answerMode:"input", inputMode:"text", answer:aliases("5,1","5 1"), explanation:"5+5+5=15이므로 동그라미=5, 네모=1입니다." },
    practice:{ prompt:"같은 별 두 개를 더했더니 세모4가 되었습니다. 별이 될 수 있는 가장 큰 수를 쓰세요.", visual:cryptVisual(["☆","☆"],"△4"), answer:"7", explanation:"7+7=14이므로 별은 7이고 세모는 1입니다." },
    sourceHold:{ sourceLocator:"교사용 슬라이드 20, 활동 02 (2)~(3)", itemCount:2, reason:"교사용 표시가 실제 덧셈 결과 또는 맨 앞자리는 0이 될 수 없다는 원본 규칙과 충돌하여 단일 정답을 입증할 수 없음" }
  });
}

const repeatedCryptSource = [
  { equation:"□□+□□=88", addends:["□□","□□"], sum:"88", values:{ square:4 } },
  { equation:"□□+□□=198", addends:["□□","□□"], sum:"198", values:{ square:9 } },
  { equation:"□□□+□□□=1776", addends:["□□□","□□□"], sum:"1776", values:{ square:8 } },
  { equation:"□□+□□+□□=231", addends:["□□","□□","□□"], sum:"231", values:{ square:7 } },
  { equation:"□+1=△0", addends:["□","1"], sum:"△0", values:{ square:9,triangle:1 } },
  { equation:"□□+1=△◇◇", addends:["□□","1"], sum:"△◇◇", values:{ square:9,triangle:1,diamond:0 } },
  { equation:"□□+9□=□△◇", addends:["□□","9□"], sum:"□△◇", values:{ square:1,triangle:0,diamond:2 } },
  { equation:"□3+2□=△7", addends:["□3","2□"], sum:"△7", values:{ square:4,triangle:6 } },
  { equation:"□8+1□=△5", addends:["□8","1□"], sum:"△5", values:{ square:7,triangle:9 } },
  { equation:"3□+□5=△△2", addends:["3□","□5"], sum:"△△2", values:{ square:7,triangle:1 } },
  { equation:"3□+□△=△4", addends:["3□","□△"], sum:"△4", values:{ square:5,triangle:9 } }
];

const symbolLabels = { square:"네모", triangle:"세모", diamond:"마름모", star:"별" };
const symbolChars = { square:"□",triangle:"△",diamond:"◇",star:"☆" };

function cryptParts(values) {
  return Object.entries(values).map(([id,answer]) => numericPart(id,symbolLabels[id],answer));
}

function substitutionText(equation, values) {
  return Object.entries(values).reduce((text,[id,value]) => text.replaceAll(symbolChars[id], String(value)), equation);
}

const repeatedCryptItems = repeatedCryptSource.map((entry,index) => inputItem({
  id:`repeated-crypt-${index + 1}`, sourceNo:`21-(${index + 1})`, typeLabel:"반복 숫자 복면산", sourceLocator:sourceAt(21, `(${index + 1})`), group:printGroup(index,1),
  prompt:`${entry.equation}이 성립할 때 각 도형의 수를 쓰세요.`, visual:cryptVisual(entry.addends,entry.sum), parts:cryptParts(entry.values),
  solution:`일의 자리부터 계산하고 받아올림을 다음 자리로 옮깁니다. ${Object.entries(entry.values).map(([id,value]) => `${symbolLabels[id]}=${value}`).join(", ")}를 넣으면 ${substitutionText(entry.equation,entry.values)}가 되어 식이 맞습니다.`
}));

const repeatedCryptLesson = sourceLesson({
  id:"cryptarithm-repeated", unit:"복면산", title:"반복되는 숫자 복면산을 풀어요", pages:"21, 복면산 연습 01",
  sourceTypeIds:["cryptarithm-repeated-number-double"], representativeConcept:"여러 자리 수에서 같은 도형이 반복되면 같은 숫자를 넣고 일의 자리부터 받아올림을 추적함",
  experience:genericExperience({ family:"book3-crypt-repeated", title:"같은 도형을 같은 숫자로 바꾸어요", hint:"맨 오른쪽 일의 자리부터 가능한 수를 좁히세요.", beats:[
    { phase:"symbol", caption:"모든 네모가 같은 숫자라는 약속을 확인합니다.", visual:cryptVisual(["□□","□□"],"88") },
    { phase:"ones", caption:"일의 자리 네모+네모의 끝자리가 8이 되는 수를 찾습니다.", visual:cryptVisual(["□","□"],"8") },
    { phase:"carry", caption:"4+4=8이라 받아올림 없이 십의 자리도 같습니다.", visual:cryptVisual(["44","44"],"88") },
    { phase:"verify", caption:"44+44=88로 모든 자리를 확인합니다.", visual:visual("math-expression", { expression:"44 + 44 = 88" }) }
  ], check:{ prompt:"같은 두 자리 수를 두 번 더해 66이 되면 한 자리의 숫자는 무엇인가요?", options:["3","6","8"], answer:"3", explanation:"33+33=66이므로 3입니다." } }),
  story:{ title:"같은 가면을 쓴 숫자", text:"같은 모양은 어느 자리에 있어도 같은 숫자를 나타냅니다.", mission:"일의 자리부터 계산해 각 모양의 값을 찾으세요." },
  explanation:{ headline:"일의 자리, 받아올림, 앞자리 순서로 풉니다.", steps:["같은 도형에 같은 숫자를 놓습니다.", "일의 자리 합의 끝 숫자를 맞춥니다.", "받아올림을 포함해 왼쪽 자리와 전체 식을 확인합니다."] },
  prompt:"각 세로셈에서 같은 도형의 수를 찾아 문제 바로 아래에 쓰세요.", items:repeatedCryptItems,
  extension:{ story:"같은 세 자리 수를 두 번 더해 1554가 되었습니다.", prompt:"각 자리를 같은 네모로 나타냈을 때 네모의 수를 쓰세요.", visual:cryptVisual(["□□□","□□□"],"1554"), answerMode:"input", inputMode:"numeric", answer:"7", explanation:"777+777=1554이므로 네모는 7입니다." },
  practice:{ prompt:"네모네모+네모네모=132일 때 네모의 수를 쓰세요.", visual:cryptVisual(["□□","□□"],"132"), answer:"6", explanation:"66+66=132이므로 네모는 6입니다." }
});

const mixedCryptSource = [
  { equation:"□□+△=100", addends:["□□","△"], sum:"100", values:{ square:9,triangle:1 } },
  { equation:"□□+◇=1△3", addends:["□□","◇"], sum:"1△3", values:{ square:9,diamond:4,triangle:0 } },
  { equation:"□□+1◇=△△△", addends:["□□","1◇"], sum:"△△△", values:{ square:9,diamond:2,triangle:1 } },
  { equation:"□□□+◇◇=△0◇△", addends:["□□□","◇◇"], sum:"△0◇△", values:{ square:9,diamond:2,triangle:1 } },
  { equation:"□△+□△=◇04", addends:["□△","□△"], sum:"◇04", values:{ diamond:1,triangle:2,square:5 } },
  { equation:"□△+□△=◇14", addends:["□△","□△"], sum:"◇14", values:{ diamond:1,triangle:7,square:5 } },
  { equation:"3□1+□□=49△", addends:["3□1","□□"], sum:"49△", values:{ square:9,triangle:0 } },
  { equation:"2□5+5◇=△△△", addends:["2□5","5◇"], sum:"△△△", values:{ triangle:3,diamond:8,square:7 } }
];

const mixedCryptItems = mixedCryptSource.map((entry,index) => inputItem({
  id:`mixed-crypt-${index + 1}`, sourceNo:`22-(${index + 1})`, typeLabel:"여러 도형과 고정 숫자 복면산", sourceLocator:sourceAt(22, `(${index + 1})`), group:printGroup(index,1),
  prompt:`${entry.equation}이 성립할 때 서로 다른 도형의 수를 구하세요.`, visual:cryptVisual(entry.addends,entry.sum), parts:cryptParts(entry.values),
  solution:`고정된 숫자를 먼저 이용해 일의 자리부터 풉니다. ${Object.entries(entry.values).map(([id,value]) => `${symbolLabels[id]}=${value}`).join(", ")}를 대입하면 ${substitutionText(entry.equation,entry.values)}로 정확히 성립합니다.`
}));

const mixedCryptLesson = sourceLesson({
  id:"cryptarithm-mixed", unit:"복면산", title:"여러 도형과 고정 숫자를 함께 풀어요", pages:"22, 복면산 연습 02",
  sourceTypeIds:["cryptarithm-fixed-digit-addition","cryptarithm-multi-symbol-carry"], representativeConcept:"보이는 숫자와 자리별 받아올림을 먼저 사용해 서로 다른 도형의 값을 하나씩 확정함",
  experience:genericExperience({ family:"book3-crypt-mixed", title:"보이는 숫자부터 단서로 써요", hint:"고정 숫자는 바뀌지 않으므로 일의 자리 조건을 가장 먼저 만듭니다.", beats:[
    { phase:"given", caption:"보이는 숫자와 가려진 도형을 구분합니다.", visual:cryptVisual(["□□","◇"],"1△3") },
    { phase:"ones", caption:"일의 자리에서 네모+마름모의 끝자리가 3입니다.", visual:visual("math-expression", { expression:"□ + ◇ = …3" }) },
    { phase:"carry", caption:"십의 자리와 백의 자리 1까지 이어 값을 정합니다.", visual:cryptVisual(["99","4"],"103") },
    { phase:"verify", caption:"99+4=103을 계산해 네모9, 마름모4, 세모0을 확인합니다.", visual:visual("math-expression", { expression:"99 + 4 = 103" }) }
  ], check:{ prompt:"같은 두 자리 수에 2를 더해 90이 되면 반복 숫자는 무엇인가요?", options:["4","8","9"], answer:"8", explanation:"88+2=90이므로 8입니다." } }),
  story:{ title:"숫자 단서가 보이는 계산판", text:"가려지지 않은 숫자가 도형값을 찾는 시작점입니다.", mission:"자리마다 가능한 수와 받아올림을 함께 기록하세요." },
  explanation:{ headline:"고정 숫자와 받아올림을 연쇄적으로 사용합니다.", steps:["일의 자리의 끝 숫자를 맞춥니다.", "받아올림을 십의 자리에 더합니다.", "서로 다른 도형이 다른 숫자인지 전체 식으로 확인합니다."] },
  prompt:"보이는 숫자를 단서로 각 도형값을 구하고 전체 덧셈을 검산하세요.", items:mixedCryptItems,
  extension:{ story:"보이는 숫자가 있는 한 자리 도형 덧셈입니다.", prompt:"88+△=96일 때 세모가 나타내는 수를 쓰세요.", visual:cryptVisual(["88","△"],"96"), answerMode:"input", inputMode:"numeric", answer:"8", explanation:"96-88=8이고 88+8=96으로 검산됩니다." },
  practice:{ prompt:"66+◇=75일 때 마름모가 나타내는 수를 쓰세요.", visual:cryptVisual(["66","◇"],"75"), answer:"9", explanation:"75-66=9이고 66+9=75입니다." }
});

const linkedCryptSource = [
  { equation:"□△+△=△6", addends:["□△","△"], sum:"△6", values:{ triangle:8,square:7 } },
  { equation:"□△△+△△=△◇2", addends:["□△△","△△"], sum:"△◇2", values:{ triangle:6,diamond:3,square:5 } },
  { equation:"□△+□=◇☆◇", addends:["□△","□"], sum:"◇☆◇", values:{ diamond:1,square:9,star:0,triangle:2 } },
  { equation:"□△+□=△◇◇", addends:["□△","□"], sum:"△◇◇", values:{ triangle:1,square:9,diamond:0 } },
  { equation:"□△+△◇=△◇△", addends:["□△","△◇"], sum:"△◇△", values:{ triangle:1,diamond:0,square:9 } },
  { equation:"□□+□◇=△△△", addends:["□□","□◇"], sum:"△△△", values:{ triangle:1,square:5,diamond:6 } },
  { equation:"□□△+☆◇=△◇△△", addends:["□□△","☆◇"], sum:"△◇△△", values:{ triangle:1,square:9,diamond:0,star:2 } }
];

const linkedCryptItems = linkedCryptSource.map((entry,index) => inputItem({
  id:`linked-crypt-${index + 1}`, sourceNo:`23-(${index + 1})`, typeLabel:"자리 사이가 연결된 복면산", sourceLocator:sourceAt(23, `(${index + 1})`), group:index + 1,
  prompt:`${entry.equation}이 성립할 때 각 도형의 수를 구하세요.`, visual:cryptVisual(entry.addends,entry.sum), parts:cryptParts(entry.values),
  solution:`같은 도형이 여러 자리에 나타나는 조건을 함께 사용합니다. ${Object.entries(entry.values).map(([id,value]) => `${symbolLabels[id]}=${value}`).join(", ")}를 넣으면 ${substitutionText(entry.equation,entry.values)}로 모든 자리가 맞습니다.`
}));

const linkedCryptLesson = sourceLesson({
  id:"cryptarithm-linked", unit:"복면산", title:"여러 자리의 연결 조건으로 풀어요", pages:"23, 복면산 연습 03",
  sourceTypeIds:["cryptarithm-multi-symbol-carry"], representativeConcept:"같은 도형이 피연산수와 결과의 여러 자리에 반복되는 제약을 동시에 만족시키며 값을 확정함",
  experience:genericExperience({ family:"book3-crypt-linked", title:"한 도형의 값을 모든 자리에 함께 넣어요", hint:"한 자리에서 정한 값은 같은 도형이 있는 다른 자리에도 즉시 표시하세요.", beats:[
    { phase:"links", caption:"같은 세모가 있는 모든 자리를 선으로 연결해 봅니다.", visual:cryptVisual(["□△","△"],"△6") },
    { phase:"ones", caption:"일의 자리 세모+세모의 끝자리가 6인 값을 찾습니다.", visual:visual("math-expression", { expression:"△ + △ = …6" }) },
    { phase:"tens", caption:"세모8과 받아올림1을 십의 자리에 함께 사용합니다.", visual:cryptVisual(["78","8"],"86") },
    { phase:"verify", caption:"78+8=86으로 네모7, 세모8을 확인합니다.", visual:visual("math-expression", { expression:"78 + 8 = 86" }) }
  ], check:{ prompt:"□△+△=△4이고 △=7일 때 네모는 무엇인가요?", options:["4","6","8"], answer:"6", explanation:"67+7=74이므로 네모는 6입니다." } }),
  story:{ title:"여러 자리에 이어진 같은 가면", text:"도형 하나의 값을 정하면 같은 도형이 있는 모든 자리가 함께 정해집니다.", mission:"일의 자리에서 얻은 값을 앞자리까지 이어 사용하세요." },
  explanation:{ headline:"자리 하나의 결정이 전체 식을 좁힙니다.", steps:["반복되는 도형 자리를 모두 표시합니다.", "일의 자리와 받아올림으로 후보를 좁힙니다.", "후보를 전체 식에 넣고 서로 다른 도형 조건까지 확인합니다."] },
  prompt:"같은 도형의 연결 조건을 사용해 각 세로셈의 도형값을 구하세요.", items:linkedCryptItems,
  extension:{ story:"같은 모양이 결과에도 다시 나타나는 계산입니다.", prompt:"네모세모+세모=세모8이고 세모=9일 때 네모를 쓰세요.", visual:cryptVisual(["□△","△"],"△8"), answerMode:"input", inputMode:"numeric", answer:"8", explanation:"89+9=98이므로 네모는 8입니다." },
  practice:{ prompt:"네모세모+세모=마름모0이고 네모=6일 때 세모와 마름모를 차례로 쓰세요.", visual:cryptVisual(["□△","△"],"◇0"), answer:aliases("5,7","5 7"), inputMode:"text", explanation:"65+5=70이므로 세모=5, 마름모=7입니다. 세 도형은 서로 다른 수도 만족합니다." }
});

const magicCardItems = [
  inputItem({ id:"binary-two-slots", sourceNo:"25-(1)", typeLabel:"0부터 빠짐없이 나타내는 두 칸 마법카드", sourceLocator:sourceAt(25,"활동 01 (1)"), group:1,
    prompt:"[2, □] 두 칸으로 0부터 하나씩 커지는 수를 빠짐없이 나타냅니다. 빈칸과 나타낼 수 있는 가장 큰 수를 쓰세요.", visual:visual("binary-strip", { weights:[2,"?"],selected:[] }),
    parts:[numericPart("blank","빈칸",1),numericPart("maximum","가장 큰 수",3)], solution:"2만 있으면 0과 2만 만들 수 있으므로 빈칸은 1입니다. 2와 1을 모두 고르면 가장 큰 수는 3입니다." }),
  inputItem({ id:"binary-three-slots", sourceNo:"25-(2)", typeLabel:"0부터 빠짐없이 나타내는 세 칸 마법카드", sourceLocator:sourceAt(25,"활동 01 (2)"), group:1,
    prompt:"[□, 2, 1] 세 칸으로 수를 빠짐없이 나타냅니다. 빈칸과 가장 큰 수를 쓰세요.", visual:visual("binary-strip", { weights:["?",2,1],selected:[] }),
    parts:[numericPart("blank","빈칸",4),numericPart("maximum","가장 큰 수",7)], solution:"1과 2로 0부터 3까지 만들 수 있으므로 다음 칸은 4입니다. 4+2+1=7까지 빠짐없이 나타냅니다." }),
  inputItem({ id:"binary-five-max", sourceNo:"26-(1)", typeLabel:"다섯 칸 마법카드의 가장 큰 수", sourceLocator:sourceAt(26,"활동 02"), group:2,
    prompt:"16, 8, 4, 2, 1을 모두 사용해 나타낼 수 있는 가장 큰 수를 구하세요.", visual:visual("binary-strip", { weights:[16,8,4,2,1],selected:[0,1,2,3,4] }), answer:"31", solution:"가장 큰 수는 모든 칸을 고를 때입니다. 16+8+4+2+1=31입니다." })
];

[
  { target:14,selected:[1,2,3] }, { target:25,selected:[0,1,4] }, { target:18,selected:[0,3] }, { target:30,selected:[0,1,2,3] }
].forEach((entry,index) => magicCardItems.push(inputItem({
  id:`binary-target-${entry.target}`, sourceNo:`26-(2-${index + 1})`, typeLabel:"마법카드로 목표 수 나타내기", sourceLocator:sourceAt(26, `활동 03 (${index + 1})`), group:printGroup(index + 3),
  prompt:`16, 8, 4, 2, 1 가운데 필요한 칸을 골라 ${entry.target}을 나타내세요.`, visual:visual("binary-strip", { weights:[16,8,4,2,1],selected:entry.selected,target:entry.target }), answer:String(entry.target),
  solution:`큰 수부터 넘지 않는 값을 고릅니다. ${entry.selected.map((i) => [16,8,4,2,1][i]).join("+")}=${entry.target}이므로 선택이 맞습니다.`
})));

magicCardItems.push(
  inputItem({ id:"binary-six-max", sourceNo:"26-(3)", typeLabel:"여섯 칸 마법카드의 가장 큰 수", sourceLocator:sourceAt(26,"활동 04"), group:4,
    prompt:"32, 16, 8, 4, 2, 1로 나타낼 수 있는 가장 큰 수를 구하세요.", visual:visual("binary-strip", { weights:[32,16,8,4,2,1],selected:[0,1,2,3,4,5] }), answer:"63", solution:"모든 값을 한 번씩 더하면 32+16+8+4+2+1=63입니다." }),
  inputItem({ id:"star-code-21", sourceNo:"27-(1)", typeLabel:"별 조각의 값을 더해 목표 수 만들기", sourceLocator:sourceAt(27,"활동 05 (1)"), group:5,
    prompt:"별의 다섯 조각 값 1, 2, 4, 8, 16 가운데 필요한 조각을 골라 21을 나타내세요.", visual:visual("star-code", { selected:[0,2,4],center:21 }), answer:aliases("16+4+1","1+4+16"), inputMode:"text", solution:"21을 넘지 않는 가장 큰 16을 고르고 남은 5는 4와 1로 만듭니다. 16+4+1=21입니다." }),
  inputItem({ id:"star-code-26", sourceNo:"27-(2)", typeLabel:"별 조각의 값을 더해 목표 수 만들기", sourceLocator:sourceAt(27,"활동 05 (2)"), group:5,
    prompt:"별의 조각을 골라 26을 나타내는 덧셈식을 쓰세요.", visual:visual("star-code", { selected:[1,3,4],center:26 }), answer:aliases("16+8+2","2+8+16"), inputMode:"text", solution:"26을 넘지 않는 16을 고르고 남은 10은 8과 2로 만듭니다. 16+8+2=26입니다." })
);

const cellWeights = [27,9,3,1,27,9,3,1];
const cellExamples = [{ colored:[7],value:1 },{ colored:[6,7],value:4 },{ colored:[2,6],value:6 },{ colored:[2,5,6],value:15 },{ colored:[1,5],value:18 }];
[
  { target:16,colored:[2,5,6,7] }, { target:40,colored:[4,5,6,7] }, { target:50,colored:[1,3,4,5,6,7] }, { target:80,colored:[0,1,2,3,4,5,6,7],maximum:true }
].forEach((entry,index) => magicCardItems.push(inputItem({
  id:`cell-code-${entry.target}`, sourceNo:`27-(3-${index + 1})`, typeLabel:entry.maximum ? "두 줄 칸 카드의 가장 큰 수" : "두 줄 칸 카드로 목표 수 나타내기", sourceLocator:sourceAt(27, `활동 06 (${index + 1})`), group:6 + index,
  prompt:entry.maximum ? "2×4의 모든 칸을 색칠해 나타낼 수 있는 가장 큰 수를 구하세요." : `${entry.target}이 되도록 2×4 칸을 색칠하세요.`,
  visual:visual("cell-code", { rows:2,columns:4,weights:cellWeights,columnWeights:[27,9,3,1],examples:cellExamples,mode:entry.maximum ? "value" : "color",target:entry.target,colored:entry.colored,showWeights:true }),
  answer:String(entry.target), solution:`색칠한 칸의 값은 ${entry.colored.map((i) => cellWeights[i]).join("+")}=${entry.target}입니다. 같은 열의 위아래 칸도 각각 한 번씩 셉니다.`
})));

const magicCardLesson = sourceLesson({
  id:"magic-card-binary", unit:"마법카드와 마방진", title:"마법카드로 모든 수를 나타내요", pages:"25~27, 마법카드 활동 01~06",
  sourceTypeIds:["binary-weight-selection","colored-cell-number-code"], representativeConcept:"앞의 모든 값을 더한 수보다 1 큰 값을 다음 칸에 두어 0부터 가장 큰 수까지 빠짐없이 나타냄",
  experience:genericExperience({ family:"book3-magic-card", title:"큰 값부터 골라 목표 수를 만들어요", hint:"목표를 넘지 않는 가장 큰 값을 고르고 남은 수로 같은 일을 반복하세요.", beats:[
    { phase:"values", caption:"1, 2, 4, 8, 16은 앞의 값을 모두 더한 수보다 1씩 큽니다.", visual:visual("binary-strip", { weights:[16,8,4,2,1],selected:[] }) },
    { phase:"largest", caption:"목표 21을 넘지 않는 가장 큰 값 16을 고릅니다.", visual:visual("binary-strip", { weights:[16,8,4,2,1],selected:[0],target:21 }) },
    { phase:"remainder", caption:"남은 5를 4와 1로 만듭니다.", visual:visual("binary-strip", { weights:[16,8,4,2,1],selected:[0,2,4],target:21 }) },
    { phase:"verify", caption:"16+4+1=21인지 다시 더합니다.", visual:visual("math-expression", { expression:"16 + 4 + 1 = 21" }) }
  ], check:{ prompt:"16,8,4,2,1로 19를 만들 때 고를 수는 무엇인가요?", options:["16,2,1","16,4,1","8,4,2,1"], answer:"16,2,1", explanation:"16+2+1=19입니다." } }),
  story:{ title:"색칠한 칸이 수가 되는 카드", text:"각 칸의 값을 한 번씩 고르면 여러 수를 빠짐없이 나타낼 수 있습니다.", mission:"큰 값부터 고른 뒤 남은 수를 다시 만드세요." },
  explanation:{ headline:"값의 규칙과 선택한 칸의 합을 확인합니다.", steps:["칸의 값을 큰 수부터 읽습니다.", "목표를 넘지 않는 값을 고르고 남은 수를 구합니다.", "선택한 모든 값을 더해 목표와 같은지 확인합니다."] },
  prompt:"마법카드와 별·칸 그림에서 빈 값, 가장 큰 수, 목표 수를 나타내는 선택을 구하세요.", items:magicCardItems,
  extension:{ story:"64,32,16,8,4,2,1 카드로 93을 만듭니다.", prompt:"고를 수를 큰 수부터 쉼표로 써 주세요.", visual:visual("binary-strip", { weights:[64,32,16,8,4,2,1],selected:[0,2,3,4,6],target:93 }), answerMode:"input", inputMode:"text", answer:aliases("64,16,8,4,1","64 16 8 4 1"), explanation:"93-64=29, 29-16=13, 13-8=5, 5-4=1이므로 64+16+8+4+1=93입니다." },
  practice:{ prompt:"32,16,8,4,2,1로 45를 만들 때 고를 수를 쓰세요.", visual:visual("binary-strip", { weights:[32,16,8,4,2,1],selected:[0,2,3,5],target:45 }), answer:aliases("32,8,4,1","32 8 4 1"), inputMode:"text", explanation:"32+8+4+1=45입니다." }
});

const magicGridItems = [
  inputItem({ id:"magic-28-1", sourceNo:"28-(1)", typeLabel:"3×3 마방진의 한 줄 합과 빈칸", sourceLocator:sourceAt(28,"활동 01 (1)"), group:1,
    prompt:"첫째 3×3 마방진의 한 줄 합, 가장 먼저 구할 수 있는 칸 하나, 세모의 수를 구하세요.", visual:visual("magic-grid", { size:3,shown:[null,2,null,6,10,14,8,"△",null] }),
    parts:[numericPart("sum","한 줄의 합",30),textPart("first","먼저 구할 수 있는 수",aliases("12","16")),numericPart("triangle","세모",18)], solution:"가운데 가로줄 6+10+14=30입니다. 완성된 줄에서 12 또는 16을 먼저 구할 수 있고, 아래줄에서 8+세모+4=30이므로 세모=18입니다." }),
  inputItem({ id:"magic-28-2", sourceNo:"28-(2)", typeLabel:"3×3 마방진의 한 줄 합과 빈칸", sourceLocator:sourceAt(28,"활동 01 (2)"), group:2,
    prompt:"둘째 마방진의 한 줄 합과 세모의 수를 구하세요.", visual:visual("magic-grid", { size:3,shown:[12,9,null,"△",15,null,null,null,18] }), parts:[numericPart("sum","한 줄의 합",45),numericPart("triangle","세모",27)], solution:"완성된 대각선 12+15+18=45이므로 한 줄의 합은 45입니다. 가운데 가로줄에서 세모+15+3=45가 되어 세모는 27입니다." }),
  inputItem({ id:"magic-28-3", sourceNo:"28-(3)", typeLabel:"3×3 마방진의 한 줄 합과 빈칸", sourceLocator:sourceAt(28,"활동 01 (3)"), group:3,
    prompt:"셋째 마방진의 한 줄 합과 세모의 수를 구하세요.", visual:visual("magic-grid", { size:3,shown:[null,null,11,"△",9,null,7,null,3] }), parts:[numericPart("sum","한 줄의 합",27),numericPart("triangle","세모",5)], solution:"오른쪽 위에서 왼쪽 아래로 11+9+7=27입니다. 세모가 있는 줄의 나머지 수를 빼면 세모=5입니다." }),
  inputItem({ id:"magic-28-4", sourceNo:"28-(4)", typeLabel:"3×3 마방진의 한 줄 합과 빈칸", sourceLocator:sourceAt(28,"활동 01 (4)"), group:4,
    prompt:"넷째 마방진의 한 줄 합과 세모의 수를 구하세요.", visual:visual("magic-grid", { size:3,shown:[null,3,8,null,7,"△",6,null,null] }), parts:[numericPart("sum","한 줄의 합",21),numericPart("triangle","세모",9)], solution:"오른쪽 위 8, 가운데 7, 왼쪽 아래 6의 합은 21입니다. 세모가 있는 가운데 줄의 나머지 수를 차례로 구하면 세모=9입니다." }),
  inputItem({ id:"magic-29-2", sourceNo:"29-(2)", typeLabel:"겹치는 세 줄로 두 도형의 합 찾기", sourceLocator:sourceAt(29,"활동 02 (2)"), group:6,
    prompt:"표시된 세 줄의 합이 같을 때 세모와 네모+마름모를 구하세요.", visual:visual("magic-grid", { size:3,shown:[null,"□","◇","△",10,null,8,null,4] }), parts:[numericPart("triangle","세모",6),numericPart("pair","네모+마름모",14)], solution:"완전히 보이는 표시 줄의 합을 먼저 정합니다. 그 합에서 10과 8, 4를 이용해 세모=6, 네모+마름모=14를 얻고 세 줄에 다시 대입합니다." }),
  inputItem({ id:"magic-29-3", sourceNo:"29-(3)", typeLabel:"겹치는 세 줄로 두 도형의 합 찾기", sourceLocator:sourceAt(29,"활동 02 (3)"), group:7,
    prompt:"표시된 세 줄의 합이 같을 때 세모와 네모+마름모를 구하세요.", visual:visual("magic-grid", { size:3,shown:["□","◇",null,null,"△",13,7,null,3] }), parts:[numericPart("triangle","세모",9),numericPart("pair","네모+마름모",16)], solution:"오른쪽 표시 줄과 대각선의 같은 합을 이용하면 세모=9입니다. 윗줄의 남은 두 도형의 합은 16이고 표시 줄에 다시 넣어 확인합니다." }),
  inputItem({ id:"magic-29-4", sourceNo:"29-(4)", typeLabel:"겹치는 세 줄로 두 도형의 합 찾기", sourceLocator:sourceAt(29,"활동 02 (4)"), group:8,
    prompt:"표시된 세 줄의 합이 같을 때 세모와 네모+마름모를 구하세요.", visual:visual("magic-grid", { size:3,shown:[5,null,9,10,"△",null,null,"□","◇"] }), parts:[numericPart("triangle","세모",6),numericPart("pair","네모+마름모",15)], solution:"5와 10이 있는 표시 줄과 9가 있는 대각선의 합을 비교해 세모=6을 구합니다. 아래 표시 줄의 네모+마름모는 15입니다." }),
  inputItem({ id:"magic-30-1", sourceNo:"30-(1)", typeLabel:"4×4 표시 줄의 도형값 찾기", sourceLocator:sourceAt(30,"활동 03 (1)"), group:9,
    prompt:"표시된 네 줄의 합이 같을 때 세모와 네모+마름모를 구하세요.", visual:visual("magic-grid", { size:4,shown:[null,"□","◇",13,5,11,null,null,9,null,6,null,4,null,null,"△"] }), parts:[numericPart("triangle","세모",1),numericPart("pair","네모+마름모",5)], solution:"첫째 세로줄 13+5+9+4=31이 기준 합입니다. 같은 합이 되도록 계산하면 세모=1이고 네모+마름모=5입니다." }),
  inputItem({ id:"magic-30-2", sourceNo:"30-(2)", typeLabel:"여러 줄의 공통 합으로 가운데 수 찾기", sourceLocator:sourceAt(30,"활동 03 (2)"), group:10,
    prompt:"표시된 가로줄과 세로줄의 합이 같을 때 세모를 구하세요.", visual:visual("magic-grid", { size:4,shown:[null,14,null,null,8,null,"△",5,null,7,null,null,null,2,null,null] }), answer:"10", solution:"둘째 세로줄과 둘째 가로줄의 공통 빈칸을 양쪽에서 함께 빼면 14+7+2=8+세모+5입니다. 23=13+세모이므로 세모=10입니다." }),
  inputItem({ id:"magic-30-3", sourceNo:"30-(3)", typeLabel:"4×4 표시 줄의 여러 도형값 찾기", sourceLocator:sourceAt(30,"활동 03 (3)"), group:11,
    prompt:"표시된 줄의 합이 같을 때 세모와 네모+마름모+별을 구하세요.", visual:visual("magic-grid", { size:4,shown:[13,2,null,null,"□",null,"◇","☆",null,"△",10,null,null,14,null,4] }), parts:[numericPart("triangle","세모",11),numericPart("symbols","네모+마름모+별",27)], solution:"둘째 세로줄 2+세모+14와 표시된 가로·대각선의 합을 비교하면 세모=11입니다. 같은 줄의 목표 합에서 알려진 수를 빼면 세 도형의 합은 27입니다." })
];

function completeMagicLesson(base) {
  return sourceLesson({
    base, id:"magic-square-targets", unit:"마법카드와 마방진", title:"같은 줄의 합으로 빈칸을 찾아요", pages:"28~30, 마방진 활동 01~03",
    sourceTypeIds:["magic-square-three-target"], representativeConcept:"표시된 가로·세로·대각선 줄의 합이 같다는 조건에서 완성된 줄을 기준으로 도형값을 역산함",
    prompt:"초록색으로 표시된 줄의 합이 같도록 각 물음의 값을 구하세요.", items:magicGridItems,
    extension:{ story:"3×3 표의 모든 줄 합이 24입니다.", prompt:"한 줄에 7, 9, 세모가 있을 때 세모를 구하세요.", visual:visual("magic-grid", { size:3,shown:[7,9,"△",null,null,null,null,null,null],lineSum:24 }), answerMode:"input", inputMode:"numeric", answer:"8", explanation:"24-7-9=8입니다." },
    practice:{ prompt:"한 줄의 합이 36이고 그 줄의 두 수가 11과 14일 때 빈칸을 구하세요.", visual:visual("magic-grid", { size:3,shown:[11,14,"?",null,null,null,null,null,null],lineSum:36 }), answer:"11", explanation:"36-11-14=11입니다." },
    sourceHold:{ sourceLocator:"교사용 슬라이드 29, 활동 02 첫째 표", itemCount:1, reason:"학생에게 보이는 세 줄의 조건만으로는 공통 합이 하나로 정해지지 않아 교사용 표시 답의 단일 정답을 입증할 수 없음" }
  });
}

export const BOOK03_GOLDEN_BELL_SOURCE_PAGES = Object.freeze([
  { pages:[2,3,4,5], lessonId:"unit-area-shapes", status:"implemented" },
  { pages:[6], lessonId:"six-multiple-equations", status:"implemented" },
  { pages:[7,8], lessonId:"fraction-shading", status:"implemented-with-hold", holdCount:3 },
  { pages:[9,10], lessonId:"equal-partition-fractions", status:"implemented" },
  { pages:[12,13], lessonId:"tape-length-midpoints", status:"implemented" },
  { pages:[14,15], lessonId:"overlapping-distance", status:"implemented" },
  { pages:[16,17,18], lessonId:"multiple-comparison", status:"implemented" },
  { pages:[20], lessonId:"basic-vertical-cryptarithm", status:"implemented-with-hold", holdCount:2 },
  { pages:[21], lessonId:"cryptarithm-repeated", status:"implemented" },
  { pages:[22], lessonId:"cryptarithm-mixed", status:"implemented" },
  { pages:[23], lessonId:"cryptarithm-linked", status:"implemented" },
  { pages:[25,26,27], lessonId:"magic-card-binary", status:"implemented" },
  { pages:[28,29,30], lessonId:"magic-square-targets", status:"implemented-with-hold", holdCount:1 }
]);

export function expandBookThreeGoldenBell(book) {
  if (!book || book.id !== "book-03") return book;
  const current = new Map(book.lessons.map((lesson) => [lesson.id,lesson]));
  book.lessons = [
    areaLesson,
    completeSixLesson(current.get("six-multiple-equations")),
    fractionLesson,
    partitionLesson,
    tapeLesson,
    distanceLesson,
    completeMultipleLesson(current.get("multiple-comparison")),
    completeBasicCryptLesson(current.get("basic-vertical-cryptarithm")),
    repeatedCryptLesson,
    mixedCryptLesson,
    linkedCryptLesson,
    magicCardLesson,
    completeMagicLesson(current.get("magic-square-targets"))
  ];
  for (const lesson of book.lessons) {
    if (lesson.similarPractice?.[0] && lesson.extension?.structureKey) lesson.similarPractice[0].structureKey = lesson.extension.structureKey;
    const itemsPerPrintPage = lesson.unit === "복면산" || lesson.id === "magic-square-targets" ? 1 : 2;
    for (const [index,item] of lesson.original.items.entries()) {
      item.printGroup = Math.floor(index / itemsPerPrintPage) + 1;
      if (item.solution.trim().length < 24) item.solution += " 구한 값을 원래 조건에 다시 넣어 모든 관계가 맞는지 확인합니다.";
    }
  }
  book.sourceCoverage = BOOK03_GOLDEN_BELL_SOURCE_PAGES;
  const releasedItems = book.lessons.reduce((sum,lesson) => sum + lesson.original.items.length,0);
  const heldItems = book.lessons.reduce((sum,lesson) => sum + Number(lesson.sourceHold?.itemCount || 0),0);
  book.source.note = `교사용 30슬라이드 중 표지 4쪽을 제외한 학습 26쪽을 대조. ${releasedItems}개 문제 묶음은 출처·풀이와 함께 구성하고, 원본 조건만으로 단일 정답을 입증할 수 없는 ${heldItems}개 문항은 잠금 유지`;
  return book;
}
