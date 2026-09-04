const inputItem = ({ id, sourceNo, printGroup, typeLabel, prompt, answer, solution, visual, parts, options, inputMode = "numeric", sourceLocator, sourceDiscrepancy }) => ({
  id,
  sourceNo,
  printGroup,
  typeLabel,
  sourceLocator,
  prompt,
  ...(visual ? { visual } : {}),
  ...(parts ? { parts } : options ? { options, answer } : { answerMode: "input", inputMode, answer }),
  ...(sourceDiscrepancy ? { sourceDiscrepancy } : {}),
  solution
});

const numericPart = (id, label, answer, unit = "") => ({ id, label, answer: String(answer), ...(unit ? { unit } : {}) });
const textPart = (id, label, answer) => ({ id, label, answer, inputMode: "text" });
const aliases = (...values) => values;
const sourceAt = (slide, detail = "") => `교사용 슬라이드 ${slide}${detail ? ` ${detail}` : ""}`;
const printGroup = (index, perSheet = 2) => Math.floor(index / perSheet) + 1;

const visual = (subtype, data = {}) => ({ kind: "book2", subtype, ...data });

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
    estimatedMinutes: 4
  }];
}

function genericExperience({ family, title, hint, beats, check }) {
  return {
    kind: "guided-concept",
    family,
    title,
    hint,
    learnerStage: "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정 2권",
    beats: beats.map((beat, index) => ({ id: `${family}-${index + 1}`, action: index === beats.length - 1 ? "verify" : index === 0 ? "draw" : "transform", ...beat })),
    check,
    finalStill: { standsAlone: true }
  };
}

function sourceLesson({ id, unit, title, pages, sourceTypeIds, representativeConcept, experience, story, explanation, prompt, items, extension, practice, sourceHold }) {
  return {
    id,
    unit,
    title,
    sourceLocator: `교사용 슬라이드 ${pages}`,
    sourceTypeIds,
    representativeConcept,
    experience,
    story,
    explanation,
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

const splitSource = [
  [2, [1, 1]], [20, [10, 10]], [200, [100, 100]], [4, [2, 2]], [80, [40, 40]], [84, [42, 42]],
  [6, [3, 3]], [10, [5, 5]], [16, [8, 8]], [18, [9, 9]], [60, [30, 30]], [78, [39, 39]]
];

const splitItems = splitSource.map(([value, parts], index) => inputItem({
  id: `split-half-${value}`,
  sourceNo: `2-(${index + 1})`,
  printGroup: printGroup(index),
  typeLabel: "두 수로 똑같이 가르기",
  sourceLocator: sourceAt(2, `(${index + 1})`),
  prompt: `${value}을 두 수로 똑같이 가르면 한 수는 얼마입니까?`,
  visual: visual("split-tree", { value, levels: [[value], [null, null]] }),
  answer: String(parts[0]),
  solution: `${value}을 2로 똑같이 나누면 ${value}÷2=${parts[0]}입니다. 두 수는 ${parts[0]}과 ${parts[1]}입니다.`
}));

splitItems.push(
  inputItem({ id: "split-24-four", sourceNo: "3-(1)", printGroup: 7, typeLabel: "두 번 가르기", sourceLocator: sourceAt(3, "(1)"), prompt: "24를 먼저 두 수로, 다시 네 수로 똑같이 가를 때 마지막 한 수는 얼마입니까?", visual: visual("split-tree", { value: 24, levels: [[24], [12,12], [6,6,6,6]] }), answer: "6", solution: "24÷2=12이고 12÷2=6입니다. 따라서 24는 6+6+6+6으로 갈라집니다." }),
  inputItem({ id: "split-36-four", sourceNo: "3-(2)", printGroup: 7, typeLabel: "두 번 가르기", sourceLocator: sourceAt(3, "(2)"), prompt: "36을 먼저 두 수로, 다시 네 수로 똑같이 가를 때 마지막 한 수는 얼마입니까?", visual: visual("split-tree", { value: 36, levels: [[36], [18,18], [9,9,9,9]] }), answer: "9", solution: "36÷2=18이고 18÷2=9입니다. 따라서 36은 9+9+9+9로 갈라집니다." })
);

for (const [index, [value, answer]] of [[6,2],[9,3],[15,5],[12,4],[21,7],[27,9]].entries()) {
  splitItems.push(inputItem({
    id: `split-third-${value}`, sourceNo: `3-(3-${index + 1})`, printGroup: printGroup(index + 14), typeLabel: "세 수로 똑같이 가르기", sourceLocator: sourceAt(3, `(3-${index + 1})`),
    prompt: `${value}을 세 수로 똑같이 가르면 한 수는 얼마입니까?`, visual: visual("split-tree", { value, levels: [[value], [null,null,null]], caption: "세 수로 똑같이" }), answer: String(answer),
    solution: `${value}÷3=${answer}이므로 ${answer}+${answer}+${answer}=${value}입니다.`
  }));
}

const numberSplittingLesson = sourceLesson({
  id: "number-splitting", unit: "매트릭스와 주고받기", title: "수를 똑같이 가르며 관계를 찾아요", pages: "2~3, 활동 01~02",
  sourceTypeIds: ["equal-number-partition"], representativeConcept: "전체를 같은 수의 묶음으로 나누고, 다시 합해 원래 수가 되는지 확인함",
  experience: genericExperience({ family: "book2-number-splitting", title: "24를 단계마다 똑같이 갈라요", hint: "한 번에 네 조각을 짐작하지 말고, 먼저 반으로 가른 뒤 각각을 다시 반으로 가르세요.", beats: [
    { phase: "whole", caption: "전체 24를 한 덩어리로 봅니다.", visual: visual("split-tree", { value: 24, levels: [[24]] }) },
    { phase: "half", caption: "24를 반으로 가르면 12와 12입니다.", visual: visual("split-tree", { value: 24, levels: [[24],[12,12]] }) },
    { phase: "quarter", caption: "12를 다시 반으로 가르면 6이 네 개가 됩니다.", visual: visual("split-tree", { value: 24, levels: [[24],[12,12],[6,6,6,6]] }) },
    { phase: "verify", caption: "6+6+6+6=24로 원래 수를 확인합니다.", visual: visual("equation", { lines: ["6+6+6+6=24"] }) }
  ], check: { prompt: "36을 네 수로 똑같이 가르면 한 수는 얼마인가요?", options: ["6","9","12"], answer: "9", explanation: "36÷2=18, 18÷2=9이므로 9가 네 개입니다." } }),
  story: { title: "같은 몫을 나누는 준비", text: "수를 두 몫이나 세 몫으로 공평하게 가르면 복잡한 식도 작은 묶음으로 보입니다.", mission: "가른 수를 다시 더해 전체와 같은지 확인하세요." },
  explanation: { headline: "전체, 가른 수, 다시 합한 수를 차례로 봅니다.", steps: ["몇 묶음으로 똑같이 나눌지 정합니다.", "전체를 묶음 수로 나누어 한 묶음을 구합니다.", "한 묶음을 묶음 수만큼 더해 전체가 되는지 확인합니다."] },
  prompt: "교사용 활동의 수 가르기 그림을 보고, 한 칸에 들어갈 수를 쓰세요.", items: splitItems,
  extension: { story: "48을 네 수로 똑같이 가릅니다.", prompt: "한 수는 얼마입니까?", visual: visual("split-tree", { value: 48, levels: [[48],[24,24],[null,null,null,null]] }), answerMode: "input", inputMode: "numeric", answer: "12", explanation: "48÷4=12이므로 12가 네 개입니다." },
  practice: { prompt: "45를 세 수로 똑같이 가르면 한 수는 얼마입니까?", visual: visual("split-tree", { value: 45, levels: [[45],[null,null,null]] }), answer: "15", explanation: "45÷3=15이고 15+15+15=45입니다." }
});

const matrixItem = (id, sourceNo, prompt, itemVisual, answer, solution, extra = {}) => inputItem({
  id, sourceNo, printGroup: printGroup(Number.parseInt(sourceNo, 10) * 2 + Number(id.replace(/\D/gu, "") || 0)), typeLabel: "가로와 세로의 합으로 도형값 찾기", sourceLocator: sourceAt(sourceNo.split("-")[0], sourceNo.includes("-") ? sourceNo.slice(sourceNo.indexOf("-")) : ""), prompt, visual: itemVisual, answer, solution, ...extra
});

const matrixItems = [
  matrixItem("matrix-1", "4-(1)", "동그라미 두 개의 합이 4이고 동그라미와 세모의 합이 5입니다. 세모의 수를 쓰세요.", visual("matrix", { equations: ["○+○=4","○+△=5","△=?"] }), "3", "○+○=4이므로 ○=2입니다. 2+△=5이므로 △=3입니다."),
  matrixItem("matrix-2", "4-(2)", "동그라미와 네모의 합이 12이고 네모 두 개의 합이 16입니다. 동그라미의 수를 쓰세요.", visual("matrix", { equations: ["○+□=12","□+□=16","○=?"] }), "4", "□+□=16이므로 □=8입니다. ○+8=12이므로 ○=4입니다."),
  matrixItem("matrix-3", "4-(3-1)", "윗줄의 합은 18, 왼쪽 세로줄의 합은 15입니다. 동그라미의 수를 쓰세요.", visual("matrix", { cells: [["triangle","triangle"],["circle",null]], rowSums: [18,null], columnSums: [15,null] }), "6", "△+△=18이므로 △=9입니다. 9+○=15이므로 ○=6입니다."),
  matrixItem("matrix-4", "4-(3-2)", "표의 아랫줄 합을 구하세요.", visual("matrix", { cells: [["triangle","triangle"],["circle","square"]], rowSums: [18,null], columnSums: [15,13] }), "10", "△=9, ○=6이고 오른쪽 세로줄에서 □=13-9=4입니다. 아랫줄은 6+4=10입니다."),
  matrixItem("matrix-5", "4-(4)", "표의 아랫줄 합을 구하세요.", visual("matrix", { cells: [["diamond","diamond"],["square","circle"]], rowSums: [12,null], columnSums: [15,13] }), "16", "◇=6, □=9, ○=7이므로 아랫줄은 9+7=16입니다."),
  matrixItem("matrix-6", "4-(5)", "표의 오른쪽 세로줄 합을 구하세요.", visual("matrix", { cells: [["square","diamond"],["square","circle"]], rowSums: [11,13], columnSums: [16,null] }), "8", "□=8, ◇=3, ○=5이므로 오른쪽 세로줄은 3+5=8입니다."),
  matrixItem("matrix-7", "5-(1)", "동그라미 세 개의 합이 9이고 네모+동그라미+네모가 13입니다. 네모의 수를 쓰세요.", visual("matrix", { equations: ["○+○+○=9","□+○+□=13","□=?"] }), "5", "○=3입니다. □+3+□=13이므로 □ 두 개는 10, □=5입니다."),
  matrixItem("matrix-8", "5-(2)", "세모 세 개의 합이 12이고 네모+세모+세모가 11입니다. 동그라미의 수를 쓰세요.", visual("matrix", { equations: ["□+△+○=14","△+△+△=12","□+△+△=11","○=?"] }), "7", "△=4, □=3이므로 3+4+○=14입니다. ○=7입니다."),
  matrixItem("matrix-9", "5-(3-1)", "윗줄의 합이 15, 왼쪽 세로줄의 합이 17입니다. 네모의 수를 쓰세요.", visual("matrix", { cells: [["triangle","triangle","triangle"],["square",null,null],["square",null,null]], rowSums: [15,null,null], columnSums: [17,null,null] }), "6", "△=5입니다. 왼쪽 세로줄에서 5+□+□=17이므로 □=6입니다."),
  matrixItem("matrix-10", "5-(3-2)", "가운데 가로줄의 합이 15이고 아래 가로줄의 합이 15입니다. 하트의 수를 쓰세요.", visual("matrix", { cells: [["triangle","triangle","triangle"],["square","circle","circle"],["square","triangle","heart"]], rowSums: [15,15,15], columnSums: [17,12,10] }), "4", "△=5, □=6, ○=7입니다. 아래 가로줄에서 6+5+♡=15이므로 ♡=4입니다."),
  matrixItem("matrix-11", "5-(3-3)", "가운데 가로줄의 합을 구하세요.", visual("matrix", { cells: [["triangle","triangle","triangle"],["square","heart","circle"],["square","triangle","heart"]], rowSums: [15,null,15], columnSums: [17,14,18] }), "19", "□=6, ♡=4, ○=9이므로 가운데 가로줄은 6+4+9=19입니다."),
  matrixItem("matrix-12", "5-(4)", "오른쪽 세로줄의 합을 구하세요.", visual("matrix", { cells: [["triangle","square","triangle"],["triangle","triangle","diamond"],["triangle","square","circle"]], rowSums: [8,10,10], columnSums: [9,7,null] }), "12", "오른쪽 세로줄은 △3+◇4+○5=12입니다.", { sourceDiscrepancy: "교사용 빨간 답은 7로 놓였지만 7은 가운데 세로줄의 이미 표시된 합입니다. 문제의 물음표가 있는 오른쪽 세로줄은 3+4+5=12로 독립 검산됨." }),
  matrixItem("matrix-13", "6-(1-1)", "윗줄의 합 12와 오른쪽 세로줄의 합 10을 보고 네모의 수를 쓰세요.", visual("matrix", { cells: [["circle","circle","circle","circle"],[null,null,null,"square"],[null,null,null,"circle"],[null,null,null,"square"]], rowSums: [12,null,null,null], columnSums: [null,null,null,10] }), "2", "○ 네 개가 12이므로 ○=3입니다. 오른쪽 줄에서 □+3+□=10이므로 □=2입니다."),
  matrixItem("matrix-14", "6-(1-2)", "아랫줄의 합 22를 이용해 세모의 수를 쓰세요.", visual("matrix", { cells: [["circle","circle","circle","circle"],[null,null,null,"square"],[null,null,null,"circle"],["triangle","triangle","square","square"]], rowSums: [12,null,null,22], columnSums: [null,null,null,10] }), "9", "□=2이므로 아랫줄에서 △+△+2+2=22입니다. △ 두 개는 18이므로 △=9입니다."),
  matrixItem("matrix-15", "6-(1-3)", "왼쪽 세로줄의 합 26을 이용해 하트의 수를 쓰세요.", visual("matrix", { cells: [["circle","circle","circle","circle"],["heart",null,null,"square"],["heart",null,null,"circle"],["triangle","triangle","square","square"]], rowSums: [12,null,null,22], columnSums: [26,null,null,10] }), "7", "○=3, △=9입니다. 왼쪽 줄에서 3+♡+♡+9=26이므로 ♡ 두 개는 14, ♡=7입니다."),
  matrixItem("matrix-16", "6-(1-4)", "완성된 4×4 표에서 마름모의 수를 쓰세요.", visual("matrix", { cells: [["circle","circle","circle","circle"],["heart","square","diamond","square"],["heart","circle","diamond","circle"],["triangle","triangle","square","square"]], rowSums: [12,17,19,22], columnSums: [26,17,17,10] }), "6", "둘째 줄에서 7+2+◇+2=17이므로 ◇=6입니다. 셋째 줄 7+3+6+3=19로 확인됩니다."),
  matrixItem("matrix-17", "7-(1)", "○+△=7, ○+△+△=9입니다. 세모와 동그라미의 수를 각각 쓰세요.", visual("matrix", { equations: ["○+△=7","○+△+△=9"] }), undefined, "둘째 식에서 첫째 식을 빼면 △=2입니다. ○=7-2=5입니다.", { parts: [numericPart("triangle","세모",2), numericPart("circle","동그라미",5)] }),
  matrixItem("matrix-18", "7-(2)", "○+△+○+△=10, ○+△+△+△=11입니다. 세모와 동그라미의 수를 각각 쓰세요.", visual("matrix", { equations: ["○+△+○+△=10","○+△+△+△=11"] }), undefined, "두 식을 비교하면 △가 ○보다 1 큽니다. ○+△=5이므로 ○=2, △=3입니다.", { parts: [numericPart("triangle","세모",3), numericPart("circle","동그라미",2)] }),
  matrixItem("matrix-19", "7-(3-1)", "ㄱ자 표에서 동그라미의 수를 쓰세요.", visual("matrix", { cells: [["circle",null,null],["triangle","circle","circle"]], rowSums: [null,17], columnSums: [10,null,null] }), "7", "왼쪽 줄에서 ○+△=10이고 아랫줄에서 △+○+○=17입니다. 두 식의 차로 ○=7입니다."),
  matrixItem("matrix-20", "7-(3-2)", "2×3 표의 윗줄 합을 구하세요.", visual("matrix", { cells: [["circle","square","triangle"],["triangle","circle","circle"]], rowSums: [null,17], columnSums: [10,12,10] }), "15", "○=7, △=3, □=5이므로 윗줄은 7+5+3=15입니다."),
  matrixItem("matrix-21", "7-(4)", "3×3 표의 오른쪽 세로줄 합을 구하세요.", visual("matrix", { cells: [["circle","square","circle"],["square","circle","triangle"]], rowSums: [8,11], columnSums: [6,6,null] }), "7", "○=2, □=4, △=5이므로 오른쪽 줄은 2+5=7입니다."),
  matrixItem("matrix-22", "7-(5)", "2×3 표의 윗줄 합을 구하세요.", visual("matrix", { cells: [["square","diamond","triangle"],["circle","circle","diamond"]], rowSums: [null,10], columnSums: [9,6,5] }), "10", "○=4, ◇=2, □=5, △=3이므로 윗줄은 5+2+3=10입니다.")
];

function completeMatrixLesson(base) {
  const lesson = { ...base, original: { ...base.original }, extension: { ...base.extension } };
  lesson.sourceLocator = "교사용 슬라이드 4~7, 활동 01~04";
  lesson.original = { ...lesson.original, mode: "paged", sourceQuestionCount: matrixItems.length, visual: undefined, prompt: "가로줄과 세로줄의 합을 이용해 각 도형의 수 또는 한 줄의 합을 구하세요.", items: matrixItems };
  lesson.extension = { ...lesson.extension, title: "추가 학습" };
  return lesson;
}

const transferPairs = [[10,4,3],[15,7,4],[25,11,7],[22,6,8],[51,11,20],[41,15,13]];
const transferItems = transferPairs.map(([left, right, answer], index) => inputItem({
  id: `transfer-${index + 1}`, sourceNo: `8-(${index + 1})`, printGroup: printGroup(index), typeLabel: "주고받아 같게 만들기", sourceLocator: sourceAt(8, `(${index + 1})`),
  prompt: `${left}개와 ${right}개를 같게 하려면 많은 쪽에서 몇 개를 주어야 합니까?`, visual: visual("transfer", { left, right }), answer: String(answer),
  solution: `차이는 ${left}-${right}=${left - right}개입니다. 한쪽에서 다른 쪽으로 옮기면 차이가 2개씩 줄므로 ${(left - right)}÷2=${answer}개를 옮깁니다.`
}));

const sumDifferenceItems = [
  ["candy-a", "9-(1)", "사탕이 모두 10개이고 A가 B보다 2개 더 많습니다. A의 사탕은 몇 개입니까?", 10, 2, "큰 수", 6],
  ["candy-b", "9-(2)", "사탕이 모두 13개이고 A가 B보다 3개 더 많습니다. B의 사탕은 몇 개입니까?", 13, 3, "작은 수", 5],
  ["cow", "9-(3)", "소와 양이 모두 15마리이고 소가 양보다 3마리 더 많습니다. 소는 몇 마리입니까?", 15, 3, "큰 수", 9],
  ["cube-b", "9-(4)", "A와 B의 큐브가 모두 24개이고 B가 A보다 10개 더 많습니다. B의 큐브는 몇 개입니까?", 24, 10, "큰 수", 17],
  ["brother-age", "10-(1)", "형제의 나이 합이 17살이고 형이 동생보다 3살 더 많습니다. 형은 몇 살입니까?", 17, 3, "큰 수", 10],
  ["short-stick", "10-(2)", "두 막대의 길이 합이 22cm이고 긴 막대와 짧은 막대의 차가 6cm입니다. 짧은 막대는 몇 cm입니까?", 22, 6, "작은 수", 8],
  ["age-gap", "10-(3)", "형은 9살, 동생은 6살입니다. 17년 후 형은 동생보다 몇 살 더 많습니까?", 15, 3, "차", 3],
  ["future-age", "10-(4)", "현재 형은 10살, 동생은 8살입니다. 몇 년 뒤 두 사람 나이의 합이 24살일 때 형은 몇 살입니까?", 24, 2, "큰 수", 13]
].map(([id, sourceNo, prompt, total, difference, target, answer], index) => inputItem({
  id, sourceNo, printGroup: printGroup(index + 6), typeLabel: target === "차" ? "시간이 지나도 같은 나이 차" : "합과 차로 두 수 찾기", sourceLocator: sourceAt(sourceNo.split("-")[0], sourceNo.slice(sourceNo.indexOf("-"))), prompt,
  visual: target === "차" ? visual("equation", { lines: ["9-6=3", "26-23=?"] }) : visual("transfer", { left: Math.ceil((total + difference) / 2), right: Math.floor((total - difference) / 2), leftLabel: "큰 수", rightLabel: "작은 수" }),
  answer: String(answer), solution: target === "작은 수" ? `합에서 차를 빼고 반으로 나누면 (${total}-${difference})÷2=${answer}입니다.` : target === "큰 수" ? `합에 차를 더하고 반으로 나누면 (${total}+${difference})÷2=${answer}입니다.` : "두 사람에게 같은 수의 해가 지나므로 나이 차는 변하지 않습니다. 9-6=3살입니다."
}));

const giveTakeLesson = sourceLesson({
  id: "give-take-sum-difference", unit: "매트릭스와 주고받기", title: "주고받기와 합·차 문제를 풀어요", pages: "8~10, 활동 01~04",
  sourceTypeIds: ["equalize-transfer", "sum-difference-pair"], representativeConcept: "두 양을 같게 만들 때는 차의 절반을 옮기고, 합과 차가 주어지면 큰 수와 작은 수를 반으로 나누어 찾음",
  experience: genericExperience({ family: "book2-give-take", title: "차이의 절반만 옮겨요", hint: "한쪽에서 1개를 옮기면 많은 쪽은 1개 줄고 적은 쪽은 1개 늘어 차이는 2개 줄어듭니다.", beats: [
    { phase: "start", caption: "10개와 4개를 나란히 놓고 차이 6개를 봅니다.", visual: visual("transfer", { left: 10, right: 4 }) },
    { phase: "difference", caption: "차이 6을 두 쪽에 똑같이 나누면 3입니다.", visual: visual("equation", { lines: ["10-4=6", "6÷2=3"] }) },
    { phase: "move", caption: "많은 쪽에서 적은 쪽으로 3개를 옮깁니다.", visual: visual("transfer", { left: 10, right: 4, moved: 3 }) },
    { phase: "verify", caption: "7개와 7개가 되어 같은지 확인합니다.", visual: visual("equation", { lines: ["10-3=7", "4+3=7"] }) }
  ], check: { prompt: "18개와 8개를 같게 하려면 몇 개를 옮길까요?", options: ["4개","5개","10개"], answer: "5개", explanation: "차이 10의 절반인 5개를 옮깁니다." } }),
  story: { title: "두 바구니를 공평하게", text: "많은 바구니에서 적은 바구니로 옮기면 두 바구니의 수가 동시에 바뀝니다.", mission: "전체 합이 그대로인지, 마지막 두 수가 같은지 확인하세요." },
  explanation: { headline: "차이를 구하고 그 절반을 옮깁니다.", steps: ["많은 수에서 적은 수를 빼 차이를 구합니다.", "차이를 2로 나누어 옮길 수를 찾습니다.", "한쪽에서 빼고 다른 쪽에 더해 같은 수인지 확인합니다."] },
  prompt: "교사용 활동의 주고받기 그림과 합·차 조건을 보고 물음에 답하세요.", items: [...transferItems, ...sumDifferenceItems],
  extension: { story: "구슬이 28개와 12개 있습니다.", prompt: "두 사람이 같아지려면 많은 쪽에서 몇 개를 주어야 합니까?", visual: visual("transfer", { left: 28, right: 12 }), answerMode: "input", inputMode: "numeric", answer: "8", explanation: "차이는 16개이고 16÷2=8이므로 8개를 옮깁니다." },
  practice: { prompt: "두 수의 합이 31이고 큰 수가 작은 수보다 7 큽니다. 큰 수를 구하세요.", visual: visual("transfer", { left: 19, right: 12, leftLabel: "큰 수", rightLabel: "작은 수" }), answer: "19", explanation: "(31+7)÷2=19입니다." }
});

const twoTermData = [
  ["2+2+2=?", "6", "2를 세 번 더하면 6입니다."],
  ["2+2+2=?+?", "3", "왼쪽 합은 6이고 같은 수 두 개의 합이 6이므로 6÷2=3입니다."],
  ["○+○+○=6+6", "4", "오른쪽은 12이고 같은 수 세 개의 합이 12이므로 ○=4입니다."],
  ["○+○+○=□", aliases("○=1,□=3", "1,3", "1 3"), "카드 1,2,3,4에서 같은 수 세 개가 다른 한 카드가 되려면 1+1+1=3입니다."],
  ["○+○+○=□+□", aliases("○=2,□=3", "2,3", "2 3"), "2+2+2=6이고 3+3=6이므로 ○=2, □=3입니다."],
  ["○+○+○=□+□+□+□", aliases("○=4,□=3", "4,3", "4 3"), "4+4+4=12이고 3+3+3+3=12이므로 ○=4, □=3입니다."]
];
const twoTermItems = twoTermData.map(([equation, answer, solution], index) => inputItem({
  id: `two-term-${index + 1}`, sourceNo: `11-(${index + 1})`, printGroup: printGroup(index), typeLabel: index < 3 ? "같은 수의 반복 덧셈" : "숫자 카드로 같은 식 만들기", sourceLocator: sourceAt(11, `(${index + 1})`), prompt: `${equation}에서 물음표 또는 도형의 수를 쓰세요.`, visual: visual("equation", { lines: [equation], ...(index >= 3 ? { cards: [1,2,3,4] } : {}) }), answer, inputMode: "text", solution
}));

const twoTermLesson = sourceLesson({
  id: "two-term-arithmetic", unit: "매트릭스와 주고받기", title: "같은 수의 묶음을 식으로 바꿔요", pages: "11, 두 단원 연산",
  sourceTypeIds: ["equal-group-equation"], representativeConcept: "같은 수가 몇 번 더해졌는지 묶음 수를 세고 양쪽의 전체 합이 같도록 도형값을 정함",
  experience: genericExperience({ family: "book2-two-term", title: "반복 덧셈을 같은 묶음으로 바꿔요", hint: "먼저 양쪽 전체 합을 구하고, 같은 도형의 개수로 나누세요.", beats: [
    { phase: "sum", caption: "2+2+2의 전체 합은 6입니다.", visual: visual("equation", { lines: ["2+2+2=6"] }) },
    { phase: "groups", caption: "같은 네모 두 개로 6을 만들려면 한 칸은 3입니다.", visual: visual("equation", { lines: ["6=□+□"] }) },
    { phase: "cards", caption: "숫자 카드 1, 2, 3, 4를 한 번씩 비교합니다.", visual: visual("equation", { lines: ["○+○+○=□+□"], cards: [1,2,3,4] }) },
    { phase: "verify", caption: "2+2+2=3+3=6으로 확인합니다.", visual: visual("equation", { lines: ["2+2+2=3+3=6"] }) }
  ], check: { prompt: "같은 별 4개의 합이 20이면 별 하나는 얼마인가요?", options: ["4","5","16"], answer: "5", explanation: "20÷4=5입니다." } }),
  story: { title: "같은 수 카드의 저울", text: "같은 도형은 언제나 같은 숫자 카드입니다. 양쪽 합이 같도록 한 장의 값을 찾습니다.", mission: "전체 합과 도형 카드의 장수를 각각 세세요." },
  explanation: { headline: "양쪽의 전체 합을 먼저 같게 둡니다.", steps: ["숫자로 된 쪽의 전체 합을 계산합니다.", "같은 도형이 몇 개인지 셉니다.", "전체를 도형 수로 나눈 뒤 원래 식에 넣어 확인합니다."] },
  prompt: "같은 도형은 같은 수입니다. 양쪽의 합이 같도록 수를 정하세요.", items: twoTermItems,
  extension: { story: "별 네 개의 합이 28입니다.", prompt: "별 하나의 수를 쓰세요.", visual: visual("equation", { lines: ["☆+☆+☆+☆=28"] }), answerMode: "input", inputMode: "numeric", answer: "7", explanation: "28÷4=7입니다." },
  practice: { prompt: "△+△+△=□+□이고 숫자 카드 2, 3, 4, 6을 사용합니다. 세모와 네모의 수를 차례로 쓰세요.", visual: visual("equation", { lines: ["△+△+△=□+□"], cards: [2,3,4,6] }), answer: aliases("△=4,□=6", "4,6", "4 6"), inputMode: "text", explanation: "4+4+4=12이고 6+6=12이므로 △=4, □=6입니다." }
});

const balanceItems = [];
const orderScales = visual("balance", { scales: [
  { left: ["A"], right: ["B"], heavier: "left" },
  { left: ["C"], right: ["A"], heavier: "right" },
  { left: ["C"], right: ["B"], heavier: "left" }
] });
for (const [slide, prefix] of [[14,"b14"],[15,"b15"]]) {
  balanceItems.push(
    inputItem({ id: `${prefix}-lighter`, sourceNo: `${slide}-(1)`, printGroup: balanceItems.length + 1, typeLabel: "세 저울 관계로 가벼운 것 찾기", sourceLocator: sourceAt(slide, "활동 무게비교"), prompt: "A보다 가벼운 것을 모두 쓰세요.", visual: orderScales, answer: aliases("B,C","C,B","B C","C B"), inputMode: "text", solution: "첫째 저울에서 A>B, 둘째에서 A>C, 셋째에서 C>B입니다. 따라서 A보다 가벼운 것은 B와 C입니다." }),
    inputItem({ id: `${prefix}-lightest`, sourceNo: `${slide}-(2)`, printGroup: balanceItems.length + 1, typeLabel: "세 저울 관계로 가장 가벼운 것 찾기", sourceLocator: sourceAt(slide, "활동 무게비교"), prompt: "가장 가벼운 것을 쓰세요.", visual: orderScales, answer: "B", inputMode: "text", solution: "A>C>B이므로 가장 가벼운 것은 B입니다." }),
    inputItem({ id: `${prefix}-order`, sourceNo: `${slide}-(3)`, printGroup: balanceItems.length + 1, typeLabel: "세 저울 관계를 무게순으로 잇기", sourceLocator: sourceAt(slide, "활동 무게비교"), prompt: "무거운 것부터 차례로 쓰세요.", visual: orderScales, answer: aliases("A>C>B","A, C, B","A C B"), inputMode: "text", solution: "아래로 내려간 쪽을 이어 쓰면 A>C>B입니다." })
  );
  const circleHeavier = slide === 15;
  balanceItems.push(
    inputItem({ id: `${prefix}-square-triangle`, sourceNo: `${slide}-(4)`, printGroup: balanceItems.length + 1, typeLabel: "여러 개 도형의 무게 비교", sourceLocator: sourceAt(slide, "활동 도형 저울"), prompt: "네모와 세모 중 더 무거운 도형을 쓰세요.", visual: visual("balance", { scales: [{ left: ["square","square"], right: ["triangle"], heavier: "right" }] }), answer: aliases("세모","△"), inputMode: "text", solution: "네모 두 개를 올린 쪽보다 세모 한 개 쪽이 내려갔으므로 세모가 더 무겁습니다." }),
    inputItem({ id: `${prefix}-circle-square`, sourceNo: `${slide}-(5)`, printGroup: balanceItems.length + 1, typeLabel: "여러 개 도형의 무게 비교", sourceLocator: sourceAt(slide, "활동 도형 저울"), prompt: "동그라미와 네모 중 더 무거운 도형을 쓰세요.", visual: visual("balance", { scales: [{ left: ["circle","circle","circle"], right: ["square","square","square","square"], heavier: circleHeavier ? "left" : "right" }] }), answer: circleHeavier ? aliases("동그라미","○") : aliases("네모","□"), inputMode: "text", solution: circleHeavier ? "동그라미 세 개 쪽이 내려갔으므로 동그라미가 더 무겁습니다." : "네모 네 개 쪽이 내려갔으므로 네모가 더 무겁습니다." })
  );
  if (slide === 15) {
    const shapeOrder = visual("balance", { scales: [{ left: ["circle"], right: ["square","square"], heavier: "left" }, { left: ["circle","square"], right: ["triangle"], heavier: "right" }] });
    balanceItems.push(
      inputItem({ id: "b15-over-square", sourceNo: "15-(6)", printGroup: balanceItems.length + 1, typeLabel: "두 저울 관계로 더 무거운 것 모두 찾기", sourceLocator: sourceAt(15, "활동 05"), prompt: "네모보다 무거운 도형을 모두 쓰세요.", visual: shapeOrder, answer: aliases("동그라미,세모","세모,동그라미","○,△","△,○"), inputMode: "text", solution: "○>□이고 △>○+□이므로 네모보다 무거운 것은 동그라미와 세모입니다." }),
      inputItem({ id: "b15-heaviest", sourceNo: "15-(7)", printGroup: balanceItems.length + 1, typeLabel: "두 저울 관계로 가장 무거운 것 찾기", sourceLocator: sourceAt(15, "활동 05"), prompt: "가장 무거운 도형을 쓰세요.", visual: shapeOrder, answer: aliases("세모","△"), inputMode: "text", solution: "△>○>□이므로 세모가 가장 무겁습니다." }),
      inputItem({ id: "b15-shape-order", sourceNo: "15-(8)", printGroup: balanceItems.length + 1, typeLabel: "두 저울 관계를 무게순으로 잇기", sourceLocator: sourceAt(15, "활동 05"), prompt: "무거운 도형부터 차례로 쓰세요.", visual: shapeOrder, answer: aliases("△>○>□","세모>동그라미>네모"), inputMode: "text", solution: "두 관계를 이어 쓰면 △>○>□입니다." })
    );
  }
}

const substitutionBalance = [
  ["b16-square", "16-(1)", "세모가 6g일 때 네모 한 개는 몇 g입니까?", [{ left:["square","square"], right:["triangle"], heavier:"equal" }], 3, "네모 두 개가 6g이므로 6÷2=3g입니다."],
  ["b16-triangle", "16-(2)", "네모가 3g이고 네모 두 개와 세모 세 개가 같을 때 세모 한 개는 몇 g입니까?", [{ left:["square","square"], right:["triangle","triangle","triangle"], heavier:"equal" }], 2, "네모 두 개는 6g이고 세모 세 개가 6g이므로 세모는 2g입니다."],
  ["b16-circle", "16-(3)", "세모가 8g, 네모가 2g일 때 동그라미 한 개는 몇 g입니까?", [{ left:["triangle","square","square"], right:["circle","circle","circle","circle"], heavier:"equal" }], 3, "왼쪽은 8+2+2=12g이고 동그라미 네 개와 같으므로 동그라미는 3g입니다."],
  ["b16-circle-3", "16-(4)", "네모가 1g일 때 동그라미 한 개는 몇 g입니까?", [{ left:["square","square"], right:["triangle"], heavier:"equal" },{ left:["circle"], right:["triangle","square"], heavier:"equal" }], 3, "세모는 2g이고 동그라미는 세모+네모=2+1=3g입니다."],
  ["b16-circle-5", "16-(5)", "네모가 1g일 때 동그라미 한 개는 몇 g입니까?", [{ left:["square","square","square"], right:["triangle"], heavier:"equal" },{ left:["circle"], right:["triangle","square","square"], heavier:"equal" }], 5, "세모는 3g이고 동그라미는 3+1+1=5g입니다."],
  ["b16-square-circles", "16-(6)", "네모 한 개는 동그라미 몇 개와 같습니까?", [{ left:["circle","circle","circle","circle"], right:["triangle"], heavier:"equal" },{ left:["triangle","triangle","triangle"], right:["square","square"], heavier:"equal" }], 6, "세모 세 개는 동그라미 12개와 같고 이것이 네모 두 개이므로 네모 한 개는 동그라미 6개와 같습니다."],
  ["b17-star-4", "17-(1)", "세모가 1g일 때 별은 몇 g입니까?", [{ left:["circle"], right:["triangle","triangle"], heavier:"equal" },{ left:["square"], right:["triangle","circle"], heavier:"equal" },{ left:["triangle","square"], right:["star"], heavier:"equal" }], 4, "동그라미=2g, 네모=3g이고 별=세모+네모=1+3=4g입니다."],
  ["b17-star-7", "17-(2)", "세모가 2g일 때 별은 몇 g입니까?", [{ left:["circle"], right:["triangle","triangle"], heavier:"equal" },{ left:["square","square"], right:["triangle","circle","circle"], heavier:"equal" },{ left:["triangle","square"], right:["star"], heavier:"equal" }], 7, "동그라미=4g, 네모=5g이고 별=2+5=7g입니다."],
  ["b17-circle-5", "17-(3)", "네모가 4g일 때 동그라미는 몇 g입니까?", [{ left:["circle","circle","circle"], right:["square","square","square"], heavier:"equal" },{ left:["square","circle"], right:["diamond","diamond","diamond","diamond"], heavier:"equal" },{ left:["diamond","square"], right:["circle"], heavier:"equal" }], 5, "교사용 저울의 바꾸어 넣기 관계를 차례로 적용하면 동그라미는 5g입니다."],
  ["b17-circle-8", "17-(4)", "네모가 5g일 때 동그라미는 몇 g입니까?", [{ left:["circle","circle"], right:["triangle","triangle","triangle"], heavier:"equal" },{ left:["square","square"], right:["triangle","triangle","triangle","triangle","triangle"], heavier:"equal" },{ left:["triangle","square"], right:["diamond"], heavier:"equal" }], 8, "교사용 저울의 같은 무게 묶음을 바꾸어 넣으면 동그라미는 8g입니다."],
  ["b17-circle-triangles", "17-(5)", "동그라미 한 개는 세모 몇 개와 같습니까?", [{ left:["circle","circle"], right:["triangle","triangle","triangle","triangle","triangle","triangle","triangle","triangle"], heavier:"equal" }], 4, "동그라미 두 개가 세모 여덟 개와 같으므로 동그라미 한 개는 세모 네 개와 같습니다."]
];
for (const [id, sourceNo, prompt, scales, answer, solution] of substitutionBalance) {
  balanceItems.push(inputItem({ id, sourceNo, printGroup: printGroup(balanceItems.length), typeLabel: "저울의 같은 무게를 바꾸어 넣기", sourceLocator: sourceAt(sourceNo.split("-")[0], sourceNo.slice(sourceNo.indexOf("-"))), prompt, visual: visual("balance", { scales }), answer: String(answer), solution }));
}

function completeBalanceLesson(base) {
  const lesson = { ...base, original: { ...base.original }, extension: { ...base.extension } };
  lesson.sourceLocator = "교사용 슬라이드 13~17, 저울 개념·활동 02~08";
  lesson.sourceTypeIds = ["balance-order-chain", "balance-unit-substitution"];
  lesson.representativeConcept = "내려간 쪽이 더 무겁고, 수평 저울의 같은 무게 묶음은 다른 저울에 그대로 바꾸어 넣을 수 있음";
  lesson.original = { ...lesson.original, mode: "paged", sourceQuestionCount: balanceItems.length, visual: undefined, prompt: "저울의 기울기와 같은 무게 관계를 보고 각 물음에 답하세요.", items: balanceItems };
  lesson.extension = { ...lesson.extension, title: "추가 학습" };
  return lesson;
}

const repeatingItems = [
  [[3,6,9,3,6,9,3,6,9], 10, "3"],
  [[3,6,9,3,6,9,3,6,9], 15, "9"],
  [[3,6,9,3,6,9,3,6,9], 20, "6"],
  [[2,4,6,8,2,4,6,8], 10, "4"],
  [[2,4,6,8,2,4,6,8], 15, "6"],
  [[2,4,6,8,2,4,6,8], 20, "2"],
  [["filled-circle","filled-square","filled-triangle","filled-star","filled-diamond"], 10, aliases("◆","마름모")],
  [["filled-circle","filled-square","filled-triangle","filled-star","filled-diamond"], 16, aliases("●","동그라미")],
  [["filled-circle","filled-square","filled-triangle","filled-star","filled-diamond"], 22, aliases("■","네모")]
].map(([values, target, answer], index) => inputItem({
  id: `repeat-${index + 1}`,
  sourceNo: `18-(${Math.floor(index / 3) + 1}-${index % 3 + 1})`,
  printGroup: printGroup(index, 3),
  typeLabel: typeof values[0] === "number" ? "마디수열의 특정 번째 수" : "마디수열의 특정 번째 모양",
  sourceLocator: sourceAt(18, `활동 ${Math.floor(index / 3) + 1}`),
  prompt: `${target}번째 ${typeof values[0] === "number" ? "수" : "모양"}을 쓰세요.`,
  visual: visual("sequence", { values, target: `${target}번째 = ?` }),
  answer,
  inputMode: "text",
  solution: `반복되는 한 마디는 ${values.map((value) => ({ "filled-circle":"●", "filled-square":"■", "filled-triangle":"▲", "filled-star":"★", "filled-diamond":"◆" }[value] || value)).join("-")}입니다. ${target}을 한 마디 길이 ${values.length > 8 ? (index < 3 ? 3 : 4) : 5}로 나눈 나머지 자리에서 답을 찾습니다.`
}));

const repeatingLesson = sourceLesson({
  id: "repeating-sequence", unit: "규칙찾기와 수열", title: "반복되는 한 마디로 먼 자리를 찾아요", pages: "18, 마디수열",
  sourceTypeIds: ["repeating-cycle-position"], representativeConcept: "되풀이되는 가장 짧은 한 마디를 찾고, 물은 번째 수를 마디 길이로 나눈 나머지 자리로 결정함",
  experience: genericExperience({ family: "book2-repeating-sequence", title: "되풀이되는 한 마디에 테두리를 둘러요", hint: "처음부터 끝까지 세지 말고, 반복되는 가장 짧은 묶음이 몇 칸인지 먼저 찾으세요.", beats: [
    { phase: "observe", caption: "3, 6, 9가 다시 처음부터 나타나는지 봅니다.", visual: visual("sequence", { values:[3,6,9,3,6,9,3,6,9] }) },
    { phase: "cycle", caption: "3-6-9 세 칸이 한 마디입니다.", visual: visual("sequence", { values:[3,6,9], target:"한 마디 3칸" }) },
    { phase: "position", caption: "20을 3으로 나누면 2가 남으므로 한 마디의 둘째 자리입니다.", visual: visual("equation", { lines:["20÷3=6…2"] }) },
    { phase: "verify", caption: "한 마디의 둘째 수 6이 20번째 수입니다.", visual: visual("sequence", { values:[3,6,9], target:"둘째 자리 = 6" }) }
  ], check: { prompt: "2, 5, 8이 반복될 때 14번째 수는 얼마인가요?", options:["2","5","8"], answer:"5", explanation:"14÷3은 나머지가 2이므로 한 마디의 둘째 수 5입니다." } }),
  story: { title:"기차 칸의 반복 신호", text:"같은 색과 숫자가 일정한 묶음으로 계속 되풀이됩니다.", mission:"반복되는 가장 짧은 한 마디와 물은 자리의 나머지를 연결하세요." },
  explanation: { headline:"한 마디를 찾으면 멀리 있는 자리도 바로 구할 수 있습니다.", steps:["처음부터 같은 순서로 되풀이되는 가장 짧은 묶음을 찾습니다.", "물은 번째 수를 한 마디의 칸 수로 나눕니다.", "나머지가 0이면 마지막 칸, 나머지가 있으면 그 번째 칸을 고릅니다."] },
  prompt:"반복되는 수와 모양의 한 마디를 찾아 물은 번째 항을 쓰세요.", items:repeatingItems,
  extension:{ story:"빨강, 노랑, 초록, 파랑 깃발이 반복됩니다.", prompt:"18번째 깃발의 색은 무엇입니까?", visual:visual("sequence", { values:["빨강","노랑","초록","파랑"], target:"18번째" }), answerMode:"input", inputMode:"text", answer:"노랑", explanation:"18÷4는 나머지가 2이므로 한 마디의 둘째 색 노랑입니다." },
  practice:{ prompt:"4, 7, 9, 2가 반복될 때 31번째 수는 얼마입니까?", visual:visual("sequence", { values:[4,7,9,2], target:"31번째" }), answer:"9", explanation:"31÷4는 나머지가 3이므로 셋째 수 9입니다." }
});

const shapeEquationSource = [
  ["shape-01", "19-(1-1)", ["4+4+4=□"], "12", "4를 세 번 더하면 12입니다."],
  ["shape-02", "19-(1-2)", ["4+4+4=□+□"], "6", "전체 12를 같은 네모 두 개로 나누면 네모는 6입니다."],
  ["shape-03", "19-(1-3)", ["4+4+4=□+□+□+□"], "3", "전체 12를 같은 네모 네 개로 나누면 네모는 3입니다."],
  ["shape-04", "19-(2-1)", ["3+3=○+○+○"], "2", "6을 동그라미 세 개로 나누면 동그라미는 2입니다."],
  ["shape-05", "19-(2-2)", ["2+2+2+2+2=○+○"], "5", "왼쪽 합은 10이고 동그라미 두 개가 10이므로 동그라미는 5입니다."],
  ["shape-06", "19-(2-3)", ["3+3+3+3=○+○+○"], "4", "왼쪽 합은 12이고 동그라미 세 개가 12이므로 동그라미는 4입니다."],
  ["shape-07", "19-(3-1)", ["1+1=2","2+2=4","○=?"], "4", "그림의 바꾸어 넣기 식에서 동그라미는 카드 4가 됩니다."],
  ["shape-08", "19-(3-2)", ["1+1=2","2+2=4","4+1=☆"], "5", "4+1=5이므로 별은 5입니다."],
  ["shape-09", "19-(3-3)", ["1+1+1=3","△+△=2+2","○=?"], "2", "그림의 같은 합 관계를 바꾸어 넣으면 동그라미는 2입니다."],
  ["shape-10", "19-(3-4)", ["1+1+1=3","2+2=4","4+1=☆","◇=?"], "5", "교사용 활동의 관계를 차례로 바꾸어 넣으면 마름모는 5입니다."],
  ["shape-11", "20-(1)", ["2+2+2=△+△","2+2=△+□","□=?"], "1", "첫 식에서 세모는 3이고 둘째 식은 4=3+네모이므로 네모는 1입니다."],
  ["shape-12", "20-(2)", ["3+3=△+△+△","3+3+△=8","8=☆+☆"], "4", "8을 같은 별 두 개로 나누면 별은 4입니다."],
  ["shape-13", "20-(3)", ["5+5+5=3+3+3+3+3","3+3+3+△=7+7","7+△=6+♡"], "6", "둘째 식에서 9+△=14이므로 △=5입니다. 마지막 식은 7+5=6+♡이므로 ♡=6입니다."],
  ["shape-14", "20-(4)", ["4+4+4+4+4=5+5+5+5","4+4+4=6+6","4+△=6+☆"], "3", "첫 식에서 △=5이고 둘째 식은 12=12입니다. 마지막 식은 4+5=6+별이므로 별은 3입니다."]
];

const shapeEquationItems = shapeEquationSource.map(([id, sourceNo, lines, answer, solution], index) => inputItem({
  id, sourceNo, printGroup: printGroup(index), typeLabel:"도형식의 같은 합을 바꾸어 넣기", sourceLocator:sourceAt(sourceNo.split("-")[0], sourceNo.slice(sourceNo.indexOf("-"))), prompt:"도형이 나타내는 수를 쓰세요.", visual:visual("equation", { lines, cards: Number(sourceNo.split("-")[0]) >= 19 && index >= 6 ? [1,2,3,4,5,6,7,8] : undefined }), answer, solution
}));

const shapeEquationLesson = sourceLesson({
  id:"shape-number-equations", unit:"양팔저울", title:"도형이 나타내는 수를 식으로 찾아요", pages:"19~20, 활동 01~04",
  sourceTypeIds:["shape-equation-substitution"], representativeConcept:"같은 도형은 같은 수이므로 완성된 식에서 값을 찾고 다음 식에 바꾸어 넣음",
  experience:genericExperience({ family:"book2-shape-equations", title:"알게 된 도형값을 다음 식에 넣어요", hint:"모든 식을 한꺼번에 보지 말고 같은 도형만 있는 식부터 시작하세요.", beats:[
    { phase:"first", caption:"4+4+4를 계산해 전체 12를 구합니다.", visual:visual("equation", { lines:["4+4+4=12"] }) },
    { phase:"divide", caption:"네모 두 개가 12이면 네모 하나는 6입니다.", visual:visual("equation", { lines:["□+□=12","□=6"] }) },
    { phase:"substitute", caption:"찾은 6을 다음 도형식에 바꾸어 넣습니다.", visual:visual("equation", { lines:["6+△=10"] }) },
    { phase:"verify", caption:"세모 4를 넣어 6+4=10인지 확인합니다.", visual:visual("equation", { lines:["6+4=10"] }) }
  ], check:{ prompt:"별 세 개의 합이 21이면 별 하나는 얼마인가요?", options:["6","7","18"], answer:"7", explanation:"21÷3=7입니다." } }),
  story:{ title:"도형식 암호판", text:"도형마다 같은 숫자가 숨어 있습니다. 먼저 쉬운 식을 풀면 다음 식의 도형을 숫자로 바꿀 수 있습니다.", mission:"찾은 값 옆에 작은 숫자를 적고 다음 식에 넣으세요." },
  explanation:{ headline:"같은 도형만 있는 식부터 차례로 풉니다.", steps:["숫자만 있거나 같은 도형만 있는 식을 먼저 계산합니다.", "도형 하나의 값을 찾으면 다음 식의 같은 도형을 숫자로 바꿉니다.", "마지막 식에 모든 값을 넣어 양쪽 합이 같은지 확인합니다."] },
  prompt:"각 식의 관계를 차례로 따라 도형이 나타내는 수를 쓰세요.", items:shapeEquationItems,
  extension:{ story:"세모 세 개가 18이고 세모와 별의 합이 11입니다.", prompt:"별이 나타내는 수를 쓰세요.", visual:visual("equation", { lines:["△+△+△=18","△+☆=11"] }), answerMode:"input", inputMode:"numeric", answer:"5", explanation:"세모는 18÷3=6이고 별은 11-6=5입니다." },
  practice:{ prompt:"네모 네 개의 합이 32이고 네모+하트=14입니다. 하트의 수를 쓰세요.", visual:visual("equation", { lines:["□+□+□+□=32","□+♡=14"] }), answer:"6", explanation:"네모는 8이고 8+하트=14이므로 하트는 6입니다." }
});

const arithmeticSequenceItems = [
  [[4,7,10,13],5,"19","6번째 수"], [[4,7,10,13],9,"31","10번째 수"],
  [[5,9,13,17],6,"29","7번째 수"], [[5,9,13,17],11,"49","12번째 수"],
  [[4,7,10,13],4,"16","5번째 성냥개비 수"], [[4,7,10,13],7,"25","8번째 성냥개비 수"],
  [[5,9,13,17],4,"21","5번째 성냥개비 수"], [[5,9,13,17],8,"37","9번째 성냥개비 수"]
].map(([values, zeroBasedTarget, answer, label], index) => inputItem({
  id:`arith-seq-${index + 1}`, sourceNo:`21-(${Math.floor(index / 2) + 1}-${index % 2 + 1})`, printGroup:printGroup(index), typeLabel:"등차수열의 특정 번째 수", sourceLocator:sourceAt(21, `활동 ${Math.floor(index / 2) + 1}`), prompt:`${values.join(", ")}, … 규칙에서 ${label}를 구하세요.`, visual:visual("sequence", { values, target:`${label} = ?` }), answer, solution:`앞 수에 ${values[1]-values[0]}씩 더하는 규칙입니다. 같은 차이를 ${zeroBasedTarget}번 적용하면 ${answer}입니다.`
}));

const arithmeticSequenceLesson = sourceLesson({
  id:"arithmetic-sequences", unit:"양팔저울", title:"일정하게 커지는 수열을 찾아요", pages:"21, 등차수열",
  sourceTypeIds:["arithmetic-sequence-position"], representativeConcept:"이웃한 두 수의 차가 일정하면 첫 수에서 같은 수를 차례로 더해 원하는 번째 수를 구함",
  experience:genericExperience({ family:"book2-arithmetic-sequences", title:"이웃한 수의 차를 표시해요", hint:"수 자체보다 앞 수에서 몇이 늘었는지를 봅니다.", beats:[
    { phase:"observe", caption:"4, 7, 10, 13을 차례로 읽습니다.", visual:visual("sequence", { values:[4,7,10,13] }) },
    { phase:"difference", caption:"매번 3씩 커진다는 공통 차이를 찾습니다.", visual:visual("equation", { lines:["7-4=3","10-7=3","13-10=3"] }) },
    { phase:"extend", caption:"13 다음에도 3을 더해 16, 19로 잇습니다.", visual:visual("sequence", { values:[4,7,10,13,16,19] }) },
    { phase:"verify", caption:"여섯 번째 수 19까지 모든 차이가 3인지 확인합니다.", visual:visual("equation", { lines:["4→7→10→13→16→19","모두 +3"] }) }
  ], check:{ prompt:"6, 10, 14, 18, …의 7번째 수는 얼마인가요?", options:["26","30","34"], answer:"30", explanation:"4씩 커지므로 5번째22, 6번째26, 7번째30입니다." } }),
  story:{ title:"계속 자라는 성냥개비 길", text:"모양 하나를 붙일 때마다 같은 수의 성냥개비가 늘어납니다.", mission:"그림의 개수와 늘어나는 수를 함께 표로 적으세요." },
  explanation:{ headline:"같은 차이가 반복되는지 먼저 확인합니다.", steps:["둘째 수에서 첫째 수를 빼 차이를 구합니다.", "다음 두 수의 차이도 같은지 확인합니다.", "같은 차이를 반복해 원하는 번째까지 이어 씁니다."] },
  prompt:"일정하게 커지는 수와 성냥개비 개수에서 물은 번째 수를 구하세요.", items:arithmeticSequenceItems,
  extension:{ story:"정사각형을 한 줄로 이어 붙일 때 성냥개비 수가 4, 7, 10, 13으로 늘어납니다.", prompt:"10번째에는 성냥개비가 몇 개 필요합니까?", visual:visual("sequence", { values:[4,7,10,13], target:"10번째" }), answerMode:"input", inputMode:"numeric", answer:"31", explanation:"첫째 4에서 3씩 9번 늘어나므로 4+3×9=31입니다." },
  practice:{ prompt:"5, 11, 17, 23, …의 8번째 수를 구하세요.", visual:visual("sequence", { values:[5,11,17,23], target:"8번째" }), answer:"47", explanation:"6씩 커지므로 5+6×7=47입니다." }
});

const sequenceRuleData = [
  [[1,3,5,7,1,3,5,7,1,3,5,7,1],"3","마디수열"],
  [[2,5,8,11,14,17,20,23],"26","등차수열"],
  [[1,2,4,8,16,32,64],"128","등비수열"],
  [[2,3,5,8,12,17,23],"30","계차수열"],
  [[1,1,2,3,5,8,13,21,34],"55","피보나치 수열"],
  [[1,2,3,5,5,8,7,11,9],"14","징검다리 수열"],
  [[1,2,3,2,3,4,3,4,5,4,5,6],"5","묶음수열"],
  [[2,3,4,6,6,9,8,12,10,15],"12","징검다리 수열"],
  [[1,1,2,1,2,3,1,2,3,4,1],"2","묶음수열"],
  [[3,2,1,8,7,6,13,12,11,18,17],"16","묶음수열"],
  [[1,2,3,5,8,13,21,34,55],"89","피보나치 수열"],
  [[1,3,4,7,11,18,29],"47","피보나치 수열"]
];
const sequenceRuleItems = sequenceRuleData.map(([values, answer, name], index) => inputItem({
  id:`sequence-rule-${index + 1}`, sourceNo:`23-(${index < 7 ? `1-${index + 1}` : `2-${index - 6}`})`, printGroup:printGroup(index, 3), typeLabel:name, sourceLocator:sourceAt(23, index < 7 ? "활동 01" : "활동 02"), prompt:"규칙에 따라 바로 다음 수를 쓰세요.", visual:visual("sequence", { values:[...values,null], target:`${name}의 다음 수` }), answer, solution:`이 수열은 ${name}입니다. 앞의 변화나 반복 묶음을 같은 방식으로 이어 쓰면 다음 수는 ${answer}입니다.`
}));
sequenceRuleItems.push(inputItem({
  id:"sequence-rule-table", sourceNo:"23-(2-6)", printGroup:5, typeLabel:"단계별 수 표의 변화", sourceLocator:sourceAt(23, "활동 02 (6)"), prompt:"1~3단계 표의 변화 규칙으로 4단계의 여섯 칸을 위에서 왼쪽부터 차례로 쓰세요.", visual:visual("sequence", { values:["0 2 1 / 1 1 0","1 3 2 / 2 2 1","2 4 3 / 3 3 2",null], target:"4단계" }), answer:aliases("3,5,4,4,4,3","3 5 4 4 4 3"), inputMode:"text", solution:"각 칸이 단계마다 1씩 커집니다. 4단계는 윗줄 3,5,4, 아랫줄 4,4,3입니다."
}));

const sequenceRulesLesson = sourceLesson({
  id:"sequence-rules", unit:"규칙찾기와 수열", title:"여러 수열의 규칙을 구별해요", pages:"23, 활동 01~02",
  sourceTypeIds:["mixed-sequence-rule"], representativeConcept:"반복, 일정한 차, 일정한 배, 앞 두 수의 합, 두 줄 건너뛰기 등 가능한 규칙을 구별해 다음 항을 정함",
  experience:genericExperience({ family:"book2-sequence-rules", title:"무엇이 바뀌는지 한 가지씩 검사해요", hint:"반복되는지, 같은 수를 더하는지, 앞 두 수를 더하는지 순서대로 확인하세요.", beats:[
    { phase:"repeat", caption:"1,3,5,7이 다시 반복되면 마디수열입니다.", visual:visual("sequence", { values:[1,3,5,7,1,3,5,7] }) },
    { phase:"difference", caption:"2,5,8,11은 매번 3씩 커지는 등차수열입니다.", visual:visual("sequence", { values:[2,5,8,11] }) },
    { phase:"previous", caption:"1,1,2,3,5는 앞 두 수를 더하는 피보나치 수열입니다.", visual:visual("sequence", { values:[1,1,2,3,5] }) },
    { phase:"verify", caption:"찾은 규칙을 앞의 모든 항에 다시 적용해 확인합니다.", visual:visual("equation", { lines:["반복 / 같은 차 / 앞 두 수의 합"] }) }
  ], check:{ prompt:"2, 3, 5, 8, 13 다음 수는 무엇인가요?", options:["18","20","21"], answer:"21", explanation:"앞 두 수 8과 13을 더하면 21입니다." } }),
  story:{ title:"수열 탐정의 세 가지 렌즈", text:"한 줄의 수에는 반복, 일정한 변화, 앞 수들의 관계가 숨어 있습니다.", mission:"한 규칙을 정하면 앞의 모든 수에 맞는지 확인하세요." },
  explanation:{ headline:"가장 단순한 규칙부터 차례로 검사합니다.", steps:["같은 묶음이 반복되는지 봅니다.", "이웃한 수의 차나 배가 일정한지 봅니다.", "앞 두 수의 합이나 건너뛴 두 줄의 변화인지 확인합니다."] },
  prompt:"수열의 종류와 변화 규칙을 찾아 다음 수 또는 다음 단계를 완성하세요.", items:sequenceRuleItems,
  extension:{ story:"2, 4, 6 / 3, 5, 7 / 4, 6, 8처럼 세 수 묶음이 이어집니다.", prompt:"다음 묶음의 세 수를 쉼표로 나누어 쓰세요.", visual:visual("sequence", { values:["2,4,6","3,5,7","4,6,8",null] }), answerMode:"input", inputMode:"text", answer:aliases("5,7,9","5 7 9"), explanation:"묶음의 각 자리 수가 1씩 커지므로 5,7,9입니다." },
  practice:{ prompt:"3, 4, 7, 11, 18, 29 다음 수를 쓰세요.", visual:visual("sequence", { values:[3,4,7,11,18,29,null] }), answer:"47", explanation:"앞의 두 수를 더하므로 18+29=47입니다." }
});

const singlePatternSource = [
  [["circle","filled-circle","filled-circle","circle","filled-circle","filled-circle","circle","filled-circle","filled-circle","circle"], aliases("●","검은 동그라미","색칠한 동그라미")],
  [["circle","filled-circle","filled-circle","circle","circle","filled-circle","filled-circle","circle","circle","filled-circle","filled-circle","circle"], aliases("○","빈 동그라미","동그라미")],
  [["filled-circle","circle","circle","filled-circle","filled-circle","filled-circle","circle","filled-circle","circle","circle","filled-circle","filled-circle","filled-circle","circle"], aliases("○","빈 동그라미","동그라미")],
  [["circle","square","star","circle","square","star","circle","square","star","circle"], aliases("□","네모")],
  [["circle","square","square","star","circle","square","square","star","circle","square","square"], aliases("☆","별")],
  [["circle","square","square","square","star","circle","square","square","square","star"], aliases("○","동그라미")],
  [["square","circle","circle","star","square","square","circle","circle","star","square","square","circle","circle","star","square","square","circle","circle"], aliases("□","네모")]
];
const dualPatternSource = [
  [["circle","filled-diamond","star","heart","filled-circle","diamond","star","filled-heart","circle","diamond","filled-star","heart","circle"], aliases("◆","색칠한 마름모","검은 마름모")],
  [["circle","square","triangle","circle","square","filled-triangle","circle","filled-square","triangle","circle","square","triangle"], aliases("○","동그라미")],
  [["circle","square","circle","circle","square","square","circle","circle","circle","square","circle","circle","circle","square"], aliases("□","네모")]
];

const patternItems = [...singlePatternSource, ...dualPatternSource].map(([values, answer], index) => inputItem({
  id:`pattern-${index + 1}`,
  sourceNo:`24-(${index < 7 ? `3-${index + 1}` : `4-${index - 6}`})`,
  printGroup:printGroup(index, 2),
  typeLabel:index < 7 ? "한 가지 반복 규칙" : "모양과 색·개수의 이중 규칙",
  sourceLocator:sourceAt(24, index < 7 ? "활동 03" : "활동 04"),
  prompt:index === 6 ? "같은 규칙으로 이어질 때 30번째 모양을 쓰세요." : "규칙에 따라 바로 다음 빈칸에 들어갈 모양을 쓰세요.",
  visual:visual("sequence", { values:[...values,null], target:index === 6 ? "30번째" : "다음 모양" }),
  answer,
  inputMode:"text",
  solution:index < 7 ? `가장 짧게 반복되는 모양 묶음을 찾고 같은 순서로 이어 쓰면 ${Array.isArray(answer) ? answer[0] : answer}입니다.` : `모양의 반복과 색 또는 개수의 반복을 따로 찾은 뒤 같은 자리에서 합치면 ${Array.isArray(answer) ? answer[0] : answer}입니다.`
}));

function completePatternLesson(base) {
  const lesson = { ...base, original:{ ...base.original }, extension:{ ...base.extension } };
  lesson.sourceLocator = "교사용 슬라이드 24, 활동 03~04";
  lesson.sourceTypeIds = ["single-symbol-pattern", "dual-shape-color-pattern"];
  lesson.original = { ...lesson.original, mode:"paged", sourceQuestionCount:patternItems.length, visual:undefined, prompt:"한 가지 또는 두 가지 규칙을 찾아 빈칸이나 물은 번째의 모양을 쓰세요.", items:patternItems };
  lesson.extension = { ...lesson.extension, title:"추가 학습" };
  return lesson;
}

const multipleDefinitions = Object.freeze({
  2: {
    page:25,
    equations:[
      ["2+2+2+2=?", "8"], ["20+20+20+20=?", "80"], ["200×4=?", "800"],
      ["2+2+2+2+2+2+2=2×?", "7"], ["20=2×?", "10"], ["200=2×?", "100"],
      ["2+20=2×?", "11"], ["2+4+4=2×?", "5"], ["8+6+4+2=2×?", "10"], ["20+20+20=2×?", "30"]
    ]
  },
  3: {
    page:30,
    equations:[
      ["3+3+3+3+3+3+3+3+3+3=?=3×?", ["30","10"]], ["3+6+3=3×?", "4"], ["30+30=3×?", "20"],
      ["3+3+30=3×?", "12"], ["3+6+9+12=3×?", "10"], ["3×7=3+3+3+3+3+?", "9"],
      ["3×10=6+3+6+3+?", "12"], ["3+3+3+3+3-3=3×?", "4"], ["6+9+9-3=3×?", "7"]
    ]
  },
  4: {
    page:35,
    equations:[
      ["4+4+4+4+4+4+4+4+4+4=?=4×?", ["40","10"]], ["44=4×?", "11"], ["40-4=4×?", "9"],
      ["40+40+40=4×?", "30"], ["44+4+4+4=4×?", "14"], ["40-4+40=4×?", "19"],
      ["2+2+2+2+2+2=4×?", "3"], ["20+4+20=4×?", "11"]
    ]
  },
  5: {
    page:41,
    equations:[
      ["5+5+5+5+5+5=5×?=?", ["6","30"]], ["30+5+5=5×?", "8"], ["50+50-5=5×?", "19"],
      ["5×4+5+5=5×?", "6"], ["5×39+5=5×?", "40"], ["5×128-5=5×?", "127"],
      ["5×4=10×?", "2"], ["5×28=10×?", "14"], ["5×36=10×?=20×?", ["18","9"]]
    ]
  }
});

function buildMultipleLesson(base) {
  const definition = multipleDefinitions[base];
  const items = definition.equations.map(([equation, answer], index) => inputItem({
    id:`multiple-${base}-${index + 1}`,
    sourceNo:`${definition.page}-(${index + 1})`,
    printGroup:printGroup(index, 3),
    typeLabel:`${base}의 배수로 식 바꾸기`,
    sourceLocator:sourceAt(definition.page, `(${index + 1})`),
    prompt:`${equation}의 빈칸에 알맞은 수를 쓰세요.`,
    visual:visual("multiple", { base, groups:Array.isArray(answer) ? Number(answer.at(-1)) : Math.max(1, Math.min(Number(answer) || 1, 20)), expression:equation }),
    ...(Array.isArray(answer) ? { parts:answer.map((value, partIndex) => numericPart(`blank-${partIndex + 1}`, `${partIndex + 1}번째 빈칸`, value)) } : { answer:String(answer), answerMode:"input", inputMode:"numeric" }),
    solution:`식의 모든 수를 ${base}개짜리 묶음으로 바꾸어 세면 빈칸은 ${Array.isArray(answer) ? answer.join(", ") : answer}입니다.`
  }));
  const unit = base === 2 ? "규칙찾기와 수열" : "약속과 스도쿠";
  return sourceLesson({
    id:`multiples-${base}`, unit, title:`${base}의 배수로 식을 바꿔요`, pages:`${definition.page}, ${base}의 배수 연산`,
    sourceTypeIds:[`multiple-of-${base}-equation`], representativeConcept:`덧셈·뺄셈·곱셈에 있는 수를 ${base}개짜리 묶음으로 바꾸어 묶음 수를 계산함`,
    experience:genericExperience({ family:`book2-multiples-${base}`, title:`${base}개씩 묶어 같은 식으로 바꿔요`, hint:`큰 수를 바로 계산하기 전에 모든 항이 ${base} 묶음 몇 개인지 표시하세요.`, beats:[
      { phase:"groups", caption:`${base}가 반복된 덧셈에서 ${base}개짜리 묶음을 셉니다.`, visual:visual("multiple", { base, groups:4, expression:`${base}+${base}+${base}+${base}=${base}×4` }) },
      { phase:"large", caption:`${base * 10}도 ${base}가 10묶음인 수로 바꿉니다.`, visual:visual("multiple", { base, groups:10, expression:`${base * 10}=${base}×10` }) },
      { phase:"combine", caption:"묶음 수끼리 더하거나 빼서 하나의 곱셈으로 만듭니다.", visual:visual("equation", { lines:[`${base}×6+${base}×2=${base}×8`] }) },
      { phase:"verify", caption:`마지막 곱셈값이 처음 식의 합과 같은지 확인합니다.`, visual:visual("equation", { lines:[`${base * 6}+${base * 2}=${base * 8}`] }) }
    ], check:{ prompt:`${base * 7}+${base * 3}=${base}×□에서 빈칸은 얼마인가요?`, options:["7","10","21"], answer:"10", explanation:`${base}가 7묶음과 3묶음이므로 모두 10묶음입니다.` } }),
    story:{ title:`${base}개씩 담는 상자`, text:`낱개로 길게 더한 수를 ${base}개짜리 상자 수로 바꾸면 식이 짧아집니다.`, mission:"각 항이 몇 상자인지 바꾼 뒤 상자 수만 계산하세요." },
    explanation:{ headline:`모든 수를 ${base}의 묶음 수로 바꾸어 봅니다.`, steps:[`${base}를 여러 번 더한 식은 ${base}×묶음 수로 바꿉니다.`, `${base * 10}, ${base * 100}처럼 큰 수가 ${base} 몇 묶음인지 봅니다.`, "더한 묶음과 뺀 묶음을 계산하고 원래 식으로 검산합니다."] },
    prompt:`각 식을 ${base}의 배수로 바꾸어 빈칸에 알맞은 수를 쓰세요.`, items,
    extension:{ story:`${base}개씩 든 봉지가 12봉지이고 ${base}개씩 든 봉지 3개를 더 받았습니다.`, prompt:`모두 ${base}가 몇 묶음입니까?`, visual:visual("multiple", { base, groups:15, expression:`${base}×12+${base}×3=${base}×?` }), answerMode:"input", inputMode:"numeric", answer:"15", explanation:"12묶음과 3묶음을 더하면 15묶음입니다." },
    practice:{ prompt:`${base}×18-${base}×5=${base}×□입니다. 빈칸을 쓰세요.`, visual:visual("multiple", { base, groups:13, expression:`${base}×18-${base}×5=${base}×?` }), answer:"13", explanation:"18묶음에서 5묶음을 빼면 13묶음입니다." }
  });
}

const growthItems = [
  ["triangle-match", 27, "성냥개비 삼각형을 한 개씩 이어 붙일 때 12번째 모양의 성냥개비 수를 구하세요.", [3,5,7,9], "25", "첫째 3에서 2씩 11번 늘어나므로 3+2×11=25입니다."],
  ["house-match", 27, "성냥개비 집을 한 개씩 이어 붙일 때 12번째 모양의 성냥개비 수를 구하세요.", [5,9,13,17], "49", "첫째 5에서 4씩 11번 늘어나므로 5+4×11=49입니다."],
  ["square-dots", 27, "정사각형 점 배열의 10번째 모양에 점은 몇 개입니까?", [1,4,9,16], "100", "n번째 정사각형 배열은 n×n개이므로 10×10=100개입니다."],
  ["paper-fold", 28, "색종이를 7번 접으면 겹친 조각은 몇 장입니까?", [2,4,8,16,32,64,128], "128", "한 번 접을 때마다 2배가 되어 7번 접으면 128조각입니다."],
  ["triangle-dots", 28, "삼각수 점 배열의 12번째 모양에 점은 몇 개입니까?", [1,3,6,10,15,21,28,36,45,55,66,78], "78", "1부터 12까지 더한 삼각수이므로 78개입니다."],
  ["triangle-border", 29, "삼각형 바깥둘레 점 배열의 12번째 모양에서 검은 점은 몇 개입니까?", [3,6,9,12,15,18,21,24,27,30,33,36], "36", "검은 점은 단계마다 3개씩 늘어 12번째는 3×12=36개입니다."],
  ["triangle-color-difference", 29, "11번째 삼각 배열에서 검은 점과 흰 점 중 어느 색이 몇 개 더 많습니까?", ["검3 흰0","검6 흰0","검9 흰1","검12 흰3","검15 흰6","검18 흰10","검21 흰15","검24 흰21","검27 흰28","검30 흰36","검33 흰45"], aliases("흰색 12개","흰 점 12개","흰12"), "11번째는 검은 점 33개, 흰 점 45개이므로 흰 점이 12개 더 많습니다."]
].map(([id, page, prompt, stages, answer, solution], index) => inputItem({
  id, sourceNo:`${page}-(표)`, printGroup:printGroup(index), typeLabel:"단계별 개수 변화", sourceLocator:sourceAt(page, "활동 표"), prompt, visual:visual("growth", { stages, form:id, rule:"표의 변화 규칙을 이어 보세요" }), answer, inputMode:"text", solution, sourceDiscrepancy:"교사용 자료의 □번째 일반 활동을, 같은 표 안에 제시된 마지막 단계로 고정해 온라인 답 입력이 가능하도록 구성함"
}));

const growthLesson = sourceLesson({
  id:"growth-patterns", unit:"규칙찾기와 수열", title:"도형이 자라는 개수 규칙을 찾아요", pages:"26~29, 수열 설명·활동 02~07",
  sourceTypeIds:["visual-growth-sequence"], representativeConcept:"단계가 하나 늘 때 더해지는 수, 곱해지는 수, 바깥과 안쪽의 색 수가 어떻게 변하는지 표와 그림을 함께 봄",
  experience:genericExperience({ family:"book2-growth-patterns", title:"그림이 한 단계씩 자라는 모습을 봐요", hint:"전체 개수만 보지 말고 이전 단계에서 새로 생긴 부분을 다른 색으로 표시하세요.", beats:[
    { phase:"one", caption:"첫째 삼각형은 성냥개비 3개입니다.", visual:visual("growth", { stages:[3], form:"match", rule:"1단계" }) },
    { phase:"two", caption:"삼각형을 이어 붙이면 공유한 변 때문에 2개만 늘어 5개입니다.", visual:visual("growth", { stages:[3,5], form:"match", rule:"+2" }) },
    { phase:"three", caption:"다음 단계도 2개가 늘어 7, 9로 이어집니다.", visual:visual("growth", { stages:[3,5,7,9], form:"match", rule:"매 단계 +2" }) },
    { phase:"compare", caption:"점 정사각형은 1,4,9,16처럼 늘어나는 수가 달라짐을 비교합니다.", visual:visual("growth", { stages:[1,4,9,16], form:"square", rule:"1², 2², 3², 4²" }) }
  ], check:{ prompt:"성냥개비 수가 3,5,7,9로 늘면 6번째 수는 얼마인가요?", options:["11","13","15"], answer:"13", explanation:"2씩 늘어 5번째11, 6번째13입니다." } }),
  story:{ title:"한 칸씩 자라는 모양 공장", text:"도형이 하나 붙거나 종이를 한 번 더 접을 때 개수 변화가 서로 다릅니다.", mission:"새로 생긴 부분과 전체 개수를 단계표에 함께 적으세요." },
  explanation:{ headline:"그림과 수의 변화를 같은 단계끼리 맞춥니다.", steps:["각 단계의 전체 개수를 정확히 셉니다.", "이전 단계보다 몇 개 늘거나 몇 배가 되었는지 적습니다.", "같은 변화가 이어지는지 다음 두 단계로 검산합니다."] },
  prompt:"교사용 활동 표의 개수 규칙을 이어 정해진 단계의 값을 구하세요.", items:growthItems,
  extension:{ story:"성냥개비로 정사각형을 한 줄로 잇습니다.", prompt:"개수가 4,7,10,13으로 늘 때 9번째에는 몇 개가 필요합니까?", visual:visual("growth", { stages:[4,7,10,13], form:"match", rule:"매 단계 +3" }), answerMode:"input", inputMode:"numeric", answer:"28", explanation:"첫째 4에서 3씩 8번 늘어나므로 4+24=28입니다." },
  practice:{ prompt:"점이 1,4,9,16으로 늘어나는 정사각형 배열의 7번째 점 수를 구하세요.", visual:visual("growth", { stages:[1,4,9,16], form:"square", rule:"n×n" }), answer:"49", explanation:"7번째는 7×7=49개입니다." }
});

const promiseItems = [
  inputItem({ id:"promise-1", sourceNo:"32-(1-1)", printGroup:1, typeLabel:"위 수는 나머지 세 수의 합", sourceLocator:sourceAt(32,"활동 01 (1)"), prompt:"왼쪽 1, 아래 9, 오른쪽 8일 때 위쪽 수를 쓰세요.", visual:visual("promise", { layout:"diamond", values:{ top:null,left:1,bottom:9,right:8 } }), answer:"18", solution:"위 수=왼쪽+아래+오른쪽이므로 1+9+8=18입니다." }),
  inputItem({ id:"promise-2", sourceNo:"32-(1-2)", printGroup:1, typeLabel:"위 수는 나머지 세 수의 합", sourceLocator:sourceAt(32,"활동 01 (1)"), prompt:"위 21, 왼쪽 10, 아래 2일 때 오른쪽 수를 쓰세요.", visual:visual("promise", { layout:"diamond", values:{ top:21,left:10,bottom:2,right:null } }), answer:"9", solution:"10+2+오른쪽=21이므로 오른쪽은 21-10-2=9입니다." }),
  inputItem({ id:"promise-3", sourceNo:"32-(2-1)", printGroup:2, typeLabel:"마주 보는 두 수의 합이 같은 약속", sourceLocator:sourceAt(32,"활동 01 (2)"), prompt:"왼쪽 4, 오른쪽 9, 아래 10일 때 위쪽 수를 쓰세요.", visual:visual("promise", { layout:"diamond", values:{ top:null,left:4,bottom:10,right:9 } }), answer:"3", solution:"위+아래=왼쪽+오른쪽입니다. 위+10=4+9=13이므로 위=3입니다." }),
  inputItem({ id:"promise-4", sourceNo:"32-(2-2)", printGroup:2, typeLabel:"마주 보는 두 수의 합이 같은 약속", sourceLocator:sourceAt(32,"활동 01 (2)"), prompt:"위 17, 왼쪽 19, 아래 8일 때 오른쪽 수를 쓰세요.", visual:visual("promise", { layout:"diamond", values:{ top:17,left:19,bottom:8,right:null } }), answer:"6", solution:"위+아래=17+8=25입니다. 19+오른쪽=25이므로 오른쪽=6입니다." }),
  inputItem({ id:"promise-square-1", sourceNo:"33-(2-1)", printGroup:3, typeLabel:"두 자리 수 두 개의 합 약속", sourceLocator:sourceAt(33,"활동 02"), prompt:"윗줄 3,5와 아랫줄 4,3으로 만든 두 자리 수의 합을 가운데에 쓰세요.", visual:visual("promise", { layout:"square", values:{ topLeft:3,topRight:5,bottomLeft:4,bottomRight:3,center:null } }), answer:"78", solution:"윗줄은 35, 아랫줄은 43입니다. 35+43=78입니다." }),
  inputItem({ id:"promise-square-2", sourceNo:"33-(2-2)", printGroup:3, typeLabel:"두 자리 수 두 개의 합 약속", sourceLocator:sourceAt(33,"활동 02"), prompt:"윗줄 5,6과 아랫줄 1,□의 합이 73입니다. 아랫줄 오른쪽 수를 쓰세요.", visual:visual("promise", { layout:"square", values:{ topLeft:5,topRight:6,bottomLeft:1,bottomRight:null,center:73 } }), answer:"7", solution:"윗줄은 56이므로 아랫줄 두 자리 수는 73-56=17입니다. 오른쪽 수는 7입니다." }),
  inputItem({ id:"promise-triangle-1", sourceNo:"33-(3-1)", printGroup:4, typeLabel:"왼쪽 아래 수를 십의 자리로 만든 합", sourceLocator:sourceAt(33,"활동 03"), prompt:"왼쪽 아래 4를 십의 자리로 하고 위 5와 오른쪽 4를 더한 가운데 수를 쓰세요.", visual:visual("promise", { layout:"triangle", values:{ top:5,left:4,right:4,center:null } }), answer:"49", solution:"왼쪽 아래 4는 40을 뜻합니다. 40+5+4=49입니다." }),
  inputItem({ id:"promise-triangle-2", sourceNo:"33-(3-2)", printGroup:4, typeLabel:"왼쪽 아래 수를 십의 자리로 만든 합", sourceLocator:sourceAt(33,"활동 03"), prompt:"가운데 수가 31이고 위 3, 왼쪽 아래 2일 때 오른쪽 수를 쓰세요.", visual:visual("promise", { layout:"triangle", values:{ top:3,left:2,right:null,center:31 } }), answer:"8", solution:"왼쪽 아래 2는 20입니다. 20+3+오른쪽=31이므로 오른쪽은 8입니다." }),
  inputItem({ id:"promise-row-sum", sourceNo:"34-(5-1)", printGroup:5, typeLabel:"세 수를 더하는 가로 약속", sourceLocator:sourceAt(34,"활동 05 (1)"), prompt:"7, 1, 6 뒤에 들어갈 결과 수를 쓰세요.", visual:visual("promise", { layout:"row", rows:[[1,2,3,6],[2,9,4,15],[3,5,8,16],[7,1,6,null]] }), answer:"14", solution:"앞의 세 수를 모두 더하는 약속입니다. 7+1+6=14입니다." }),
  inputItem({ id:"promise-row-minus", sourceNo:"34-(5-2)", printGroup:5, typeLabel:"첫 수에서 둘째 수를 빼고 셋째 수를 더하는 약속", sourceLocator:sourceAt(34,"활동 05 (2)"), prompt:"6, 9, 8 뒤에 들어갈 결과 수를 쓰세요.", visual:visual("promise", { layout:"row", rows:[[4,1,3,6],[2,6,8,4],[13,5,0,8],[6,9,8,null]] }), answer:"5", solution:"첫 수-둘째 수+셋째 수의 약속입니다. 6-9+8=5입니다." }),
  inputItem({ id:"promise-row-concat", sourceNo:"34-(5-3)", printGroup:6, typeLabel:"앞 두 수로 두 자리 수를 만든 뒤 더하기", sourceLocator:sourceAt(34,"활동 05 (3)"), prompt:"3, 7, 5 뒤에 들어갈 결과 수를 쓰세요.", visual:visual("promise", { layout:"row", rows:[[1,2,3,15],[1,3,5,18],[2,5,4,29],[3,7,5,null]] }), answer:"42", solution:"앞의 두 수 3과 7로 37을 만들고 셋째 수 5를 더합니다. 37+5=42입니다." }),
  inputItem({ id:"promise-row-concat-large", sourceNo:"34-(5-4)", printGroup:6, typeLabel:"앞 두 수로 두 자리 수를 만든 뒤 더하기", sourceLocator:sourceAt(34,"활동 05 (4)"), prompt:"3, 9, 12 뒤에 들어갈 결과 수를 쓰세요.", visual:visual("promise", { layout:"row", rows:[[1,9,10,29],[2,3,5,28],[3,6,9,45],[3,9,12,null]] }), answer:"51", solution:"앞의 두 수로 39를 만들고 셋째 수 12를 더합니다. 39+12=51입니다." })
];

function completePromiseLesson(base) {
  const lesson = { ...base, original:{ ...base.original }, extension:{ ...base.extension } };
  lesson.sourceLocator = "교사용 슬라이드 32~34, 활동 01~05";
  lesson.sourceTypeIds = ["four-number-center-rule", "concatenation-number-rule"];
  lesson.original = { ...lesson.original, mode:"paged", sourceQuestionCount:promiseItems.length, visual:undefined, prompt:"완성된 앞 그림에서 숫자 약속을 찾고 같은 약속으로 빈칸을 채우세요.", items:promiseItems };
  lesson.extension = { ...lesson.extension, title:"추가 학습" };
  lesson.sourceHold = {
    sourceLocator:"교사용 슬라이드 34, 활동 04",
    itemCount:2,
    reason:"세 예시와 교사용 빨간 풀이가 하나의 규칙으로 일치하지 않고, 빨간 풀이 두 줄은 앞 활동 03의 수를 그대로 복사한 것으로 보여 단일 정답을 입증할 수 없음"
  };
  return lesson;
}

const sudokuGrids = [
  { id:"sudoku-3-a", page:36, sourceItem:1, size:3, cells:[3,2,null,null,null,2,null,null,null], letters:{2:"A",3:"B",4:"C",6:"D",7:"E",8:"F"}, answers:{ A:1,B:1,C:3,D:2,E:1,F:3 }, regionMap:[0,0,0,1,1,1,2,2,2] },
  { id:"sudoku-3-b", page:36, sourceItem:2, size:3, cells:[1,2,null,null,null,null,null,3,null], letters:{2:"A",3:"B",4:"C",5:"D",6:"E",8:"F"}, answers:{ A:3,B:3,C:1,D:2,E:2,F:1 }, regionMap:[0,0,0,1,1,1,2,2,2] },
  { id:"sudoku-3-c", page:36, sourceItem:3, size:3, cells:[null,3,1,null,null,null,1,null,null], letters:{0:"A",3:"B",4:"C",5:"D",7:"E",8:"F"}, answers:{ A:2,B:3,C:1,D:2,E:2,F:3 }, regionMap:[0,0,0,1,1,1,2,2,2] },
  { id:"sudoku-4-a", page:37, sourceItem:1, size:4, cells:[2,null,null,3,null,1,4,null,null,3,2,null,4,null,null,null], letters:{1:"A",2:"B",4:"C",7:"D",8:"E",11:"F",13:"G",14:"H",15:"I"}, answers:{ A:4,B:1,C:3,D:2,E:1,F:4,G:2,H:3,I:1 }, regionMap:[0,0,1,1,0,0,1,1,2,2,3,3,2,2,3,3] },
  { id:"sudoku-4-b", page:37, sourceItem:2, size:4, cells:[1,null,null,3,null,2,null,null,null,null,3,null,2,null,null,4], letters:{1:"A",2:"B",4:"C",6:"D",7:"E",8:"F",9:"G",11:"H",13:"I",14:"J"}, answers:{ A:4,B:2,C:3,D:4,E:1,F:4,G:1,H:2,I:3,J:1 }, regionMap:[0,0,1,1,0,0,1,1,2,2,3,3,2,2,3,3] },
  { id:"sudoku-4-c", page:37, sourceItem:3, size:4, cells:[null,1,null,null,2,null,null,1,null,null,3,null,3,null,null,4], letters:{0:"A",2:"B",3:"C",5:"D",6:"E",8:"F",9:"G",11:"H",13:"I",14:"J"}, answers:{ A:4,B:2,C:3,D:3,E:4,F:1,G:4,H:2,I:2,J:1 }, regionMap:[0,0,0,1,2,0,1,1,2,2,3,1,2,3,3,3] },
  { id:"sudoku-4-d", page:37, sourceItem:4, size:4, cells:[null,3,null,1,4,null,null,2,null,4,null,null,null,null,1,null], letters:{0:"A",2:"B",5:"C",6:"D",8:"E",10:"F",11:"G",12:"H",13:"I",15:"J"}, answers:{ A:2,B:4,C:1,D:3,E:1,F:2,G:3,H:3,I:2,J:4 }, regionMap:[0,0,1,1,0,2,2,1,0,2,2,1,3,3,3,3] },
  { id:"sudoku-4-e", page:37, sourceItem:5, size:4, cells:[null,3,1,null,1,4,null,3,3,null,null,1,null,null,null,null], letters:{0:"A",3:"B",6:"C",9:"D",10:"E",12:"F",13:"G",14:"H",15:"I"}, answers:{ A:4,B:2,C:2,D:2,E:4,F:2,G:1,H:3,I:4 }, regionMap:[0,0,0,1,2,2,0,1,2,3,1,1,2,3,3,3] }
];

const sudokuItems = sudokuGrids.map((grid, index) => inputItem({
  id:grid.id,
  sourceNo:`${grid.page}-(${grid.sourceItem})`,
  printGroup:index + 1,
  typeLabel:`${grid.size}×${grid.size} 스도쿠 빈칸 채우기`,
  sourceLocator:sourceAt(grid.page, grid.size === 3 ? "활동 01" : "활동 02"),
  prompt:`가로줄과 세로줄에 1부터 ${grid.size}까지 한 번씩 들어가도록 알파벳 칸을 채우세요.`,
  visual:visual("sudoku", { size:grid.size, cells:grid.cells, letters:grid.letters, regionMap:grid.regionMap }),
  parts:Object.entries(grid.answers).map(([letter, answer]) => numericPart(letter, letter, answer)),
  solution:`한 칸만 비어 있는 가로줄이나 세로줄부터 채웁니다. ${Object.entries(grid.answers).map(([letter, answer]) => `${letter}=${answer}`).join(", ")}입니다.`
}));

const sudokuLesson = sourceLesson({
  id:"sudoku", unit:"약속과 스도쿠", title:"가로와 세로에서 빠진 수를 찾아요", pages:"36~37, 스도쿠 활동 01~02",
  sourceTypeIds:["latin-sudoku-elimination"], representativeConcept:"각 가로줄·세로줄·굵은 구역에 정해진 수가 한 번씩 들어가므로 가장 먼저 알 수 있는 한 칸부터 연쇄적으로 채움",
  experience:genericExperience({ family:"book2-sudoku", title:"한 칸만 비어 있는 줄부터 채워요", hint:"처음부터 모든 빈칸을 보지 말고, 이미 있는 수가 가장 많은 가로줄이나 세로줄을 찾으세요.", beats:[
    { phase:"given", caption:"첫째 가로줄 3,2,□를 봅니다.", visual:visual("sudoku", { size:3, cells:[3,2,null,null,null,2,2,null,null], letters:{2:"A"} }) },
    { phase:"row", caption:"1,2,3 중 빠진 수 1을 A에 넣습니다.", visual:visual("sudoku", { size:3, cells:[3,2,1,null,null,2,2,null,null] }) },
    { phase:"column", caption:"첫째 세로줄에서 빠진 수를 찾아 다음 칸을 채웁니다.", visual:visual("sudoku", { size:3, cells:[3,2,1,1,null,2,2,null,null] }) },
    { phase:"verify", caption:"모든 가로와 세로에 1,2,3이 한 번씩 있는지 확인합니다.", visual:visual("sudoku", { size:3, cells:[3,2,1,1,3,2,2,1,3] }) }
  ], check:{ prompt:"가로줄이 2, 3, □일 때 1부터 3까지 한 번씩 넣으려면 빈칸은 얼마인가요?", options:["1","2","3"], answer:"1", explanation:"1,2,3 중 2와3이 있으므로 빠진 수는1입니다." } }),
  story:{ title:"숫자 방의 빈자리", text:"각 줄과 구역에는 같은 수가 두 번 들어갈 수 없습니다.", mission:"가장 먼저 답이 하나로 정해지는 칸부터 차례로 채우세요." },
  explanation:{ headline:"가장 먼저 알 수 있는 칸을 찾으면 다음 칸도 열립니다.", steps:["각 가로줄에서 빠진 수를 찾습니다.", "같은 칸의 세로줄과 굵은 구역에서도 가능한지 확인합니다.", "한 칸을 채운 뒤 달라진 줄을 다시 검사합니다."] },
  prompt:"각 스도쿠 표의 알파벳 빈칸을 문제 바로 아래 답칸에 차례로 쓰세요.", items:sudokuItems,
  extension:{ story:"3×3 숫자 방에서 첫 줄은 1,3,□입니다.", prompt:"첫 줄의 빈칸에 들어갈 수를 쓰세요.", visual:visual("sudoku", { size:3, cells:[1,3,null,3,2,1,2,1,3], letters:{2:"A"} }), answerMode:"input", inputMode:"numeric", answer:"2", explanation:"1부터3 중 첫 줄에 없는 수는2입니다." },
  practice:{ prompt:"3×3 표의 빈칸 A, B를 차례로 쓰세요.", visual:visual("sudoku", { size:3, cells:[2,null,1,1,3,2,3,2,null], letters:{1:"A",8:"B"} }), answer:aliases("3,1","3 1"), inputMode:"text", explanation:"첫 줄에서 A=3이고 마지막 줄에서 B=1입니다." }
});

const fractionItems = [
  ["fraction-circle", "38-(1)", "circle", 4, 1, "1/4"],
  ["fraction-rectangle", "38-(2)", "rectangle", 8, 3, "3/8"],
  ["fraction-triangle", "38-(3)", "triangle", 6, 5, "5/6"],
  ["fraction-star", "38-(4)", "star", 12, 1, "1/12"],
  ["fraction-triangle-quarter", "39-(1)", "triangle", 4, 1, "1/4"],
  ["fraction-triangle-eighth", "39-(2)", "triangle", 8, 1, "1/8"],
  ["fraction-triangle-twelfth", "39-(3)", "triangle", 12, 1, "1/12"],
  ["fraction-triangle-sixteenth", "39-(4)", "triangle", 16, 1, "1/16"]
].map(([id, sourceNo, shape, total, shaded, answer], index) => inputItem({
  id, sourceNo, printGroup:printGroup(index), typeLabel:"같은 크기로 나눈 도형의 분수", sourceLocator:sourceAt(sourceNo.split("-")[0], sourceNo.slice(sourceNo.indexOf("-"))), prompt:"색칠한 부분은 전체의 얼마인지 분수로 쓰세요.", visual:visual("fraction", { shape,total,shaded }), answer:aliases(answer, answer.replace("/","분의").split("분의").reverse().join("분의")), inputMode:"text", solution:`전체를 같은 크기 ${total}조각으로 나누었고 그중 ${shaded}조각이 색칠되어 ${answer}입니다.`
}));

const foldFractions = [[1,"1/2"],[2,"1/4"],[3,"1/8"]];
for (const [index, [folds, answer]] of foldFractions.entries()) {
  fractionItems.push(inputItem({ id:`fold-fraction-${folds}`, sourceNo:`40-(${index + 3})`, printGroup:5 + index, typeLabel:"접은 횟수와 전체의 분수", sourceLocator:sourceAt(40, `활동 0${index + 3}`), prompt:`색종이를 ${folds}번 접으면 접힌 한 조각은 원래 색종이의 얼마입니까?`, visual:visual("fold-fraction", { folds }), answer:aliases(answer, `${2 ** folds}분의1`), inputMode:"text", solution:`한 번 접을 때마다 조각 수가 2배가 됩니다. ${folds}번이면 ${2 ** folds}조각이므로 한 조각은 ${answer}입니다.` }));
}
fractionItems.push(inputItem({ id:"fold-count-32", sourceNo:"40-(6)", printGroup:8, typeLabel:"분수로 접은 횟수 역산", sourceLocator:sourceAt(40,"마지막 활동"), prompt:"접힌 한 조각이 원래 색종이의 1/32일 때 몇 번 접었습니까?", visual:visual("fold-fraction", { folds:5 }), answer:"5", solution:"1/2, 1/4, 1/8, 1/16, 1/32로 한 번 접을 때마다 분모가 2배가 되므로 5번입니다." }));

const fractionsLesson = sourceLesson({
  id:"fractions-and-folds", unit:"약속과 스도쿠", title:"같은 조각의 분수와 접은 횟수를 알아요", pages:"38~40, 분수 활동 01~06",
  sourceTypeIds:["fraction-equal-parts", "paper-fold-power-of-two"], representativeConcept:"전체를 같은 크기로 나눈 조각 수가 분모, 색칠하거나 고른 조각 수가 분자이며 한 번 접을 때마다 조각 수가 두 배가 됨",
  experience:genericExperience({ family:"book2-fractions", title:"전체를 같은 크기 조각으로 나눠요", hint:"조각 수만 세기 전에 모든 조각의 크기가 같은지 먼저 확인하세요.", beats:[
    { phase:"whole", caption:"온전한 색종이 한 장을 전체 1로 봅니다.", visual:visual("fraction", { shape:"rectangle", total:1, shaded:1 }) },
    { phase:"half", caption:"한 번 접어 같은 크기 두 조각이면 한 조각은 1/2입니다.", visual:visual("fold-fraction", { folds:1 }) },
    { phase:"quarter", caption:"두 번 접으면 네 조각이 되어 한 조각은 1/4입니다.", visual:visual("fold-fraction", { folds:2 }) },
    { phase:"verify", caption:"분모는 전체 조각 수, 분자는 고른 조각 수인지 확인합니다.", visual:visual("fraction", { shape:"rectangle", total:8, shaded:3 }) }
  ], check:{ prompt:"전체를 같은 크기 8조각으로 나누고 3조각을 색칠하면 얼마인가요?", options:["3/8","5/8","8/3"], answer:"3/8", explanation:"전체 조각 수 8이 분모, 색칠한 수 3이 분자입니다." } }),
  story:{ title:"빵을 똑같이 나누는 식탁", text:"나누어 먹으려면 모든 조각의 크기가 같아야 합니다.", mission:"전체 조각 수와 색칠한 조각 수를 따로 세어 분수로 나타내세요." },
  explanation:{ headline:"분모와 분자를 전체 그림에서 직접 셉니다.", steps:["도형이 같은 크기의 몇 조각으로 나뉘었는지 세어 분모를 정합니다.", "색칠하거나 고른 조각 수를 세어 분자를 정합니다.", "접기 문제는 접을 때마다 전체 조각 수가 2배인지 확인합니다."] },
  prompt:"같은 크기로 나눈 도형의 색칠한 부분과 색종이 접기의 분수를 구하세요.", items:fractionItems,
  extension:{ story:"피자를 같은 크기 10조각으로 나누고 4조각을 먹었습니다.", prompt:"먹은 부분은 전체의 얼마입니까?", visual:visual("fraction", { shape:"circle", total:10, shaded:4 }), answerMode:"input", inputMode:"text", answer:aliases("4/10","10분의4"), explanation:"전체 10조각 중 4조각이므로 4/10입니다." },
  practice:{ prompt:"색종이를 4번 접으면 한 조각은 원래 색종이의 얼마입니까?", visual:visual("fold-fraction", { folds:4 }), answer:aliases("1/16","16분의1"), inputMode:"text", explanation:"2×2×2×2=16조각이므로 한 조각은 1/16입니다." }
});

export const BOOK02_GOLDEN_BELL_SOURCE_PAGES = Object.freeze([
  { pages:[2,3], lessonId:"number-splitting", status:"implemented" },
  { pages:[4,5,6,7], lessonId:"addition-matrix", status:"implemented", discrepancyCount:1 },
  { pages:[8,9,10], lessonId:"give-take-sum-difference", status:"implemented" },
  { pages:[11], lessonId:"two-term-arithmetic", status:"implemented" },
  { pages:[13,14,15,16,17], lessonId:"balance-order", status:"implemented" },
  { pages:[18], lessonId:"repeating-sequence", status:"implemented" },
  { pages:[19,20], lessonId:"shape-number-equations", status:"implemented" },
  { pages:[21], lessonId:"arithmetic-sequences", status:"implemented" },
  { pages:[23], lessonId:"sequence-rules", status:"implemented" },
  { pages:[24], lessonId:"dual-shape-color-pattern", status:"implemented" },
  { pages:[25], lessonId:"multiples-2", status:"implemented" },
  { pages:[26,27,28,29], lessonId:"growth-patterns", status:"implemented", adaptation:"일반 □번째 활동을 교사용 표의 제시 단계로 고정" },
  { pages:[30], lessonId:"multiples-3", status:"implemented" },
  { pages:[32,33,34], lessonId:"diamond-number-promise", status:"implemented-with-hold", holdCount:2 },
  { pages:[35], lessonId:"multiples-4", status:"implemented" },
  { pages:[36,37], lessonId:"sudoku", status:"implemented" },
  { pages:[38,39,40], lessonId:"fractions-and-folds", status:"implemented" },
  { pages:[41], lessonId:"multiples-5", status:"implemented" }
]);

export function expandBookTwoGoldenBell(book) {
  if (!book || book.id !== "book-02") return book;
  const current = new Map(book.lessons.map((lesson) => [lesson.id, lesson]));
  book.lessons = [
    numberSplittingLesson,
    completeMatrixLesson(current.get("addition-matrix")),
    giveTakeLesson,
    twoTermLesson,
    completeBalanceLesson(current.get("balance-order")),
    repeatingLesson,
    shapeEquationLesson,
    arithmeticSequenceLesson,
    sequenceRulesLesson,
    completePatternLesson(current.get("dual-shape-color-pattern")),
    buildMultipleLesson(2),
    growthLesson,
    buildMultipleLesson(3),
    completePromiseLesson(current.get("diamond-number-promise")),
    buildMultipleLesson(4),
    sudokuLesson,
    fractionsLesson,
    buildMultipleLesson(5)
  ];
  for (const lesson of book.lessons) {
    if (lesson.similarPractice?.[0] && lesson.extension?.structureKey) {
      lesson.similarPractice[0].structureKey = lesson.extension.structureKey;
    }
    const itemsPerPrintPage = lesson.id === "sudoku" ? 1 : 2;
    for (const [index, item] of lesson.original.items.entries()) {
      item.printGroup = Math.floor(index / itemsPerPrintPage) + 1;
      if (item.solution.trim().length < 24) item.solution += " 이 값을 원래 조건에 넣어 모든 관계가 맞는지 확인합니다.";
    }
  }
  book.sourceCoverage = BOOK02_GOLDEN_BELL_SOURCE_PAGES;
  const releasedItems = book.lessons.reduce((sum, lesson) => sum + lesson.original.items.length, 0);
  book.source.note = `교사용 41슬라이드 중 표지 4쪽을 제외한 학습·연산 37쪽을 대조. ${releasedItems}개 문제 묶음은 출처·풀이와 함께 구성하고, 단일 정답이 입증되지 않은 활동 04 두 문항은 잠금 유지`;
  return book;
}
