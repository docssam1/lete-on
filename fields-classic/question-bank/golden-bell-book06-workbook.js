const PHASES = Object.freeze(["given", "organize", "calculate", "verify"]);

const LESSON_SPECS = Object.freeze({
  "number-line-unit-distance": {
    family: "book06-number-line",
    title: "끝 수와 칸 수로 한 칸을 구해요",
    concept: "두 끝 수의 차를 구하고, 눈금 사이의 칸 수로 나누어 한 칸의 거리를 구합니다.",
    story: {
      title: "18에서 30까지 네 칸",
      text: "18과 30 사이를 같은 크기의 네 칸으로 나누었습니다.",
      mission: "전체 거리를 구한 뒤 눈금 수가 아니라 칸 수로 나누세요."
    },
    model: { start: 18, end: 30, intervals: 4 },
    captions: [
      "두 끝 수 18과 30, 같은 칸 4개를 확인합니다.",
      "30-18로 전체 거리 12를 구하고 네 칸을 표시합니다.",
      "전체 거리 12를 같은 칸 4개로 나눕니다.",
      "한 칸씩 3만큼 네 번 가면 30이 되는지 확인합니다."
    ],
    practice: {
      prompt: "1에서 22까지를 같은 크기의 7칸으로 나누었습니다. 한 칸의 거리를 구하세요.",
      visual: { kind: "book6", subtype: "number-line", intervals: 7, labels: [1, "", "", "", "", "", "", 22] }
    }
  },
  "rectangle-missing-side": {
    family: "book06-missing-side",
    title: "둘레의 절반에서 빠진 변을 찾아요",
    concept: "직사각형 둘레를 2로 나누어 가로와 세로의 합을 구한 뒤, 아는 변을 뺍니다.",
    story: {
      title: "둘레 52cm인 직사각형",
      text: "직사각형의 둘레는 52cm이고 가로는 6cm입니다.",
      mission: "가로와 세로의 합에서 가로를 빼 세로를 찾으세요."
    },
    model: { perimeter: 52, knownSide: 6 },
    captions: [
      "둘레 52cm와 가로 6cm를 그림에 표시합니다.",
      "마주 보는 변끼리 묶어 둘레의 절반을 생각합니다.",
      "52÷2에서 가로 6을 빼 빠진 세로를 구합니다.",
      "가로와 세로를 더해 2배 했을 때 52가 되는지 확인합니다."
    ],
    practice: {
      prompt: "둘레가 96cm이고 한 변이 18cm인 직사각형의 다른 한 변을 구하세요.",
      visual: { kind: "book6", subtype: "rectangle", widthLabel: "18cm", heightLabel: "?", perimeterLabel: "96cm" }
    }
  },
  "inclusive-range-count": {
    family: "book06-range-count",
    title: "처음 수와 끝 수를 모두 세어요",
    concept: "처음 수와 끝 수를 모두 포함하므로 끝 수에서 처음 수를 뺀 뒤 1을 더합니다.",
    story: {
      title: "4부터 8까지",
      text: "4와 8도 빠뜨리지 않고 연속된 수를 셉니다.",
      mission: "두 끝의 차에 처음 수 한 개를 더하세요."
    },
    model: { start: 4, end: 8 },
    captions: [
      "처음 수 4와 끝 수 8을 확인합니다.",
      "4, 5, 6, 7, 8을 놓아 두 끝도 포함됨을 봅니다.",
      "8-4로 사이의 간격을 구하고 1을 더합니다.",
      "수 카드를 직접 세어 식의 결과와 같은지 확인합니다."
    ],
    practice: {
      prompt: "10부터 43까지 처음 수와 끝 수를 모두 포함하면 수는 몇 개인가요?",
      visual: { kind: "book6", subtype: "range-count", start: 10, end: 43, mode: "numbers" }
    }
  },
  "number-and-digit-count": {
    family: "book06-number-digit-count",
    title: "수의 개수와 쓴 숫자의 개수를 나누어 봐요",
    concept: "수의 개수는 수 카드를 세고, 쓴 숫자의 개수는 각 수의 자리 수를 모두 더합니다.",
    story: {
      title: "10, 11, 12를 적은 번호표",
      text: "번호표는 세 장이지만, 번호를 적는 데에는 숫자 여섯 개가 필요합니다.",
      mission: "무엇의 개수를 묻는지 먼저 표시하세요."
    },
    model: { values: [10, 11, 12], ask: "numbers" },
    captions: [
      "10, 11, 12를 각각 하나의 수 카드로 봅니다.",
      "수 카드와 카드 안에 쓴 숫자를 따로 펼칩니다.",
      "수 카드는 한 장씩 세고, 쓴 숫자는 각 자리 수를 더합니다.",
      "물음이 수의 개수이므로 수 카드 3장을 답으로 확인합니다."
    ],
    practice: {
      prompt: "1부터 42까지의 수를 차례로 쓸 때 숫자는 모두 몇 개 필요한가요?",
      visual: { kind: "book6", subtype: "range-count", start: 1, end: 42, mode: "digits" }
    }
  },
  "equal-share-source": {
    family: "book06-equal-share",
    title: "전체를 같은 묶음으로 나누어요",
    concept: "전체 수를 묶음 수로 나누면 한 묶음에 들어가는 수를 구할 수 있습니다.",
    story: {
      title: "28개를 네 묶음으로",
      text: "28개를 남김없이 같은 수로 네 묶음에 나눕니다.",
      mission: "한 묶음씩 번갈아 놓고 각 묶음의 수를 확인하세요."
    },
    model: { total: 28, groups: 4 },
    captions: [
      "전체 28개와 만들 묶음 4개를 확인합니다.",
      "28개를 네 묶음에 같은 수만큼 나누어 놓습니다.",
      "전체 28을 묶음 수 4로 나눕니다.",
      "각 묶음의 수를 네 번 더해 28이 되는지 확인합니다."
    ],
    practice: {
      prompt: "36개를 4묶음으로 똑같이 나누면 한 묶음은 몇 개인가요?",
      visual: { kind: "book6", subtype: "segmented-bars", bars: [{ label: "전체", segments: 4 }, { label: "한 묶음", segments: 1 }], totalLabel: "4묶음은 모두 36개" }
    }
  },
  "number-line-ratio-source": {
    family: "book06-distance-ratio",
    title: "전체 거리를 같은 칸으로 나누어요",
    concept: "전체 거리를 같은 칸 수로 나누어 한 칸의 거리를 구합니다.",
    story: {
      title: "48을 여섯 칸으로",
      text: "길이 48인 구간을 같은 크기의 여섯 칸으로 나눕니다.",
      mission: "칸의 개수를 세고 전체 거리를 같은 수로 나누세요."
    },
    model: { distance: 48, intervals: 6 },
    captions: [
      "전체 거리 48과 같은 칸 6개를 확인합니다.",
      "수직선을 여섯 칸으로 나누고 각 칸을 같은 색으로 묶습니다.",
      "48을 같은 칸 수 6으로 나눕니다.",
      "한 칸의 거리를 여섯 번 더해 48이 되는지 확인합니다."
    ],
    practice: {
      prompt: "0에서 63까지를 같은 크기의 7칸으로 나누었습니다. 한 칸의 거리를 구하세요.",
      visual: { kind: "book6", subtype: "number-line", intervals: 7, labels: [0, "", "", "", "", "", "", 63] }
    }
  },
  "fraction-balance-source": {
    family: "book06-equivalent-ratio",
    title: "같은 비는 두 수를 함께 늘려요",
    concept: "비의 앞항과 뒷항에 같은 수를 곱하거나 나누면 같은 비가 됩니다.",
    story: {
      title: "2:3과 같은 비",
      text: "앞항 2가 8이 되도록 네 배 하면 뒷항 3도 네 배 해야 합니다.",
      mission: "앞항이 몇 배 되었는지 찾아 뒷항에도 똑같이 적용하세요."
    },
    model: { left: [2, 3], known: 8 },
    captions: [
      "기준 비 2:3과 새 비 8:?를 나란히 봅니다.",
      "앞항 2가 8이 되려면 네 배 해야 함을 표시합니다.",
      "뒷항 3에도 같은 수 4를 곱합니다.",
      "두 비를 같은 수로 줄여 모두 2:3이 되는지 확인합니다."
    ],
    practice: {
      prompt: "3:5와 같은 비에서 앞항이 6이면 뒷항은 얼마인가요?",
      visual: { kind: "book6", subtype: "ratio-chain", left: [3, 5], symbol: "=", right: [6, "?"] }
    }
  },
  "perimeter-source": {
    family: "book06-perimeter-half",
    title: "둘레를 반으로 나누어 다른 변을 찾아요",
    concept: "직사각형 둘레의 절반은 가로와 세로를 한 번씩 더한 값입니다.",
    story: {
      title: "둘레 34cm, 한 변 7cm",
      text: "둘레의 절반에서 알고 있는 한 변을 빼 다른 한 변을 찾습니다.",
      mission: "둘레를 바로 빼지 말고 먼저 2로 나누세요."
    },
    model: { perimeter: 34, knownSide: 7 },
    captions: [
      "둘레 34cm와 한 변 7cm를 표시합니다.",
      "마주 보는 변을 묶어 가로+세로가 둘레의 절반임을 봅니다.",
      "34÷2에서 알고 있는 변 7을 뺍니다.",
      "두 변을 더해 2배 한 값이 34인지 확인합니다."
    ],
    practice: {
      prompt: "둘레가 70cm이고 한 변이 14cm인 직사각형의 다른 한 변을 구하세요.",
      visual: { kind: "book6", subtype: "rectangle", widthLabel: "14cm", heightLabel: "?", perimeterLabel: "70cm" }
    }
  },
  "multiplication-source": {
    family: "book06-partial-product",
    title: "십과 일을 나누어 곱해요",
    concept: "두 자리 수를 십과 일로 나누어 각각 곱한 뒤 부분곱을 더합니다.",
    story: {
      title: "24를 세 번",
      text: "24를 20과 4로 나누면 큰 곱과 작은 곱을 따로 계산할 수 있습니다.",
      mission: "20×3과 4×3을 구해 마지막에 더하세요."
    },
    model: { multiplicand: 24, multiplier: 3 },
    captions: [
      "24×3에서 24를 20과 4로 나눕니다.",
      "20×3과 4×3의 두 부분으로 곱셈판을 나눕니다.",
      "두 부분곱 60과 12를 더합니다.",
      "구한 값을 24+24+24와 비교해 확인합니다."
    ],
    practice: {
      prompt: "17×4를 십과 일로 나누어 계산하세요.",
      visual: { kind: "book6", subtype: "multiplication-grid", mode: "area", first: 17, second: 4, secondParts: [10, 7], partials: ["10×4", "7×4"] }
    }
  },
  "consecutive-source": {
    family: "book06-inclusive-sequence",
    title: "연속수의 양끝을 빠뜨리지 않아요",
    concept: "연속수의 개수는 끝 수-처음 수+1로 구합니다.",
    story: {
      title: "13부터 18까지",
      text: "13과 18도 포함하여 연속된 수가 몇 개인지 셉니다.",
      mission: "간격 수와 수의 개수가 1만큼 다름을 확인하세요."
    },
    model: { start: 13, end: 18 },
    captions: [
      "처음 수 13과 끝 수 18을 표시합니다.",
      "양끝을 포함한 수 카드를 순서대로 놓습니다.",
      "18-13으로 간격을 구하고 1을 더합니다.",
      "13부터 18까지 직접 세어 식의 결과와 비교합니다."
    ],
    practice: {
      prompt: "24부터 30까지 처음과 끝을 모두 포함하면 수는 몇 개인가요?",
      visual: { kind: "book6", subtype: "range-count", start: 24, end: 30, mode: "numbers" }
    }
  },
  "digit-sign-source": {
    family: "book06-digit-occurrence",
    title: "십의 자리와 일의 자리에서 따로 세어요",
    concept: "특정 숫자가 나타난 횟수는 십의 자리와 일의 자리에서 각각 센 뒤 더합니다.",
    story: {
      title: "1부터 50까지의 숫자 2",
      text: "숫자 2가 십의 자리에 나온 경우와 일의 자리에 나온 경우를 따로 찾습니다.",
      mission: "22처럼 같은 숫자가 두 번 들어간 수는 두 번 세세요."
    },
    model: { start: 1, end: 50, digit: 2 },
    captions: [
      "1부터 50까지에서 찾을 숫자 2를 확인합니다.",
      "십의 자리의 2와 일의 자리의 2를 다른 색으로 표시합니다.",
      "십의 자리 10번과 일의 자리 5번을 더합니다.",
      "22에서는 2가 두 번 세어졌는지 확인합니다."
    ],
    practice: {
      prompt: "1부터 50까지 쓸 때 숫자 5는 모두 몇 번 나타나나요?",
      visual: { kind: "book6", subtype: "digit-focus", start: 1, end: 50, digit: 5 }
    }
  }
});

const PRACTICE_VISUAL_UPGRADES = Object.freeze({
  "inclusive-range-count": [
    null,
    { kind: "book6", subtype: "range-count", start: 10, end: 43, mode: "numbers" }
  ],
  "equal-share-source": [
    { kind: "book6", subtype: "segmented-bars", bars: [{ label: "전체 28개", segments: 4 }, { label: "한 묶음", segments: 1 }], totalLabel: "4묶음으로 똑같이" },
    { kind: "book6", subtype: "segmented-bars", bars: [{ label: "전체 36개", segments: 4 }, { label: "한 묶음", segments: 1 }], totalLabel: "4묶음으로 똑같이" }
  ],
  "number-line-ratio-source": [
    { kind: "book6", subtype: "number-line", intervals: 6, labels: [0, "", "", "", "", "", 48] },
    { kind: "book6", subtype: "number-line", intervals: 7, labels: [0, "", "", "", "", "", "", 63] }
  ],
  "fraction-balance-source": [
    { kind: "book6", subtype: "ratio-chain", left: [2, 3], symbol: "=", right: [8, "?"] },
    { kind: "book6", subtype: "ratio-chain", left: [3, 5], symbol: "=", right: [6, "?"] }
  ],
  "perimeter-source": [
    { kind: "book6", subtype: "rectangle", widthLabel: "7cm", heightLabel: "?", perimeterLabel: "34cm" },
    { kind: "book6", subtype: "rectangle", widthLabel: "14cm", heightLabel: "?", perimeterLabel: "70cm" }
  ],
  "multiplication-source": [
    { kind: "book6", subtype: "multiplication-grid", mode: "area", first: 24, second: 3, secondParts: [20, 4], partials: ["20×3", "4×3"] },
    { kind: "book6", subtype: "multiplication-grid", mode: "area", first: 17, second: 4, secondParts: [10, 7], partials: ["10×4", "7×4"] }
  ],
  "consecutive-source": [
    { kind: "book6", subtype: "range-count", start: 13, end: 18, mode: "numbers" },
    { kind: "book6", subtype: "range-count", start: 24, end: 30, mode: "numbers" }
  ],
  "digit-sign-source": [
    { kind: "book6", subtype: "digit-focus", start: 1, end: 50, digit: 2 },
    { kind: "book6", subtype: "digit-focus", start: 1, end: 50, digit: 5 }
  ]
});

function draftPracticeItem(lesson, spec) {
  return {
    id: `${lesson.id}:extension:3`,
    title: "표현을 바꾸어 연습",
    story: "같은 원리를 다른 그림으로 확인해요",
    prompt: spec.practice.prompt,
    visual: spec.practice.visual,
    answerMode: "input",
    status: "awaiting-independent-answer"
  };
}

export const BOOK06_WORKBOOK_FAMILIES = Object.freeze(new Set(Object.values(LESSON_SPECS).map((spec) => spec.family)));

export function enhanceBook06Workbook(books) {
  const book = books.find((candidate) => candidate.id === "book-06");
  if (!book || book.book06WorkbookVersion === 2) return book;
  if (book.lessons?.length !== Object.keys(LESSON_SPECS).length) {
    throw new Error("Book 6 workbook enhancement requires all 11 verified lessons.");
  }

  for (const lesson of book.lessons) {
    const spec = LESSON_SPECS[lesson.id];
    if (!spec) throw new Error(`Book 6 workbook specification is missing for ${lesson.id}.`);
    lesson.representativeConcept = spec.concept;
    lesson.story = spec.story;
    lesson.experience = {
      ...lesson.experience,
      kind: "guided-concept",
      family: spec.family,
      title: spec.title,
      hint: spec.concept,
      model: spec.model,
      beats: PHASES.map((phase, index) => ({
        id: `${spec.family}-${phase}`,
        phase,
        action: phase === "given" ? "draw" : phase === "organize" ? "transform" : phase,
        caption: spec.captions[index]
      })),
      finalStill: { standsAlone: true, visualSource: "semantic-model" }
    };
    const currentPractice = (lesson.similarPractice || []).filter((item) => item.id !== `${lesson.id}:extension:3`);
    const upgradedVisuals = PRACTICE_VISUAL_UPGRADES[lesson.id] || [];
    [lesson.extension, ...currentPractice].forEach((item, index) => {
      if (item && upgradedVisuals[index]) item.visual = upgradedVisuals[index];
    });
    lesson.similarPractice = currentPractice;
    lesson.pendingPractice = [draftPracticeItem(lesson, spec)];
    if (["rectangle-missing-side", "inclusive-range-count", "number-and-digit-count"].includes(lesson.id)) {
      lesson.original.printMode = "paged";
      lesson.original.separateConceptPrint = true;
      const sourcePanels = lesson.original.visual?.kind === "book6-set"
        ? lesson.original.visual.panels || []
        : [];
      lesson.original.items.forEach((item, index) => {
        item.printGroup = `${lesson.id}-core`;
        const sourceVisual = sourcePanels[index]?.visual;
        if (sourceVisual) item.visual = { kind: "book6", ...sourceVisual };
      });
    }
    lesson.dailyPractice = { problemCount: 1 + currentPractice.length, estimatedMinutes: 3 };
  }

  book.dailyPractice = { problemCount: book.lessons.reduce((sum, lesson) => sum + lesson.dailyPractice.problemCount, 0), estimatedMinutes: 30 };
  book.book06WorkbookVersion = 2;
  return book;
}
