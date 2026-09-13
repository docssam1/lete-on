const KIND = "course02-g4";
const LEARNER_STAGE = "필즈 더 클래식 2과정 G4; 연령 미확정";
const PHASES = ["problem", "organize", "calculate", "verify"];

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

function finite(name, value) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
}

function positive(name, value) {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
  return value;
}

function positiveInteger(name, value) {
  positive(name, value);
  if (!Number.isInteger(value)) throw new RangeError(`${name} must be an integer`);
  return value;
}

function angle(name, value) {
  positive(name, value);
  if (value >= 180) throw new RangeError(`${name} must be less than 180 degrees`);
  return value;
}

function cleanNumber(name, value) {
  finite(name, value);
  return Math.abs(value - Math.round(value)) < 1e-9 ? Math.round(value) : Number(value.toFixed(6));
}

function requireFlag(name, value) {
  if (value !== true) throw new RangeError(`${name} must be explicitly true`);
}

export function course02G4Model(data) {
  if (!data || data.kind !== KIND) throw new TypeError("A course02 G4 visual is required");
  switch (data.task) {
    case "folded-corner": {
      if (![90, 180].includes(data.fullAngle)) throw new RangeError("fullAngle must be a verified special angle");
      angle("fixedAngle", data.fixedAngle);
      if (data.fixedAngle >= data.fullAngle) throw new RangeError("fixedAngle must be inside fullAngle");
      return { answer: data.fullAngle - data.fixedAngle };
    }
    case "fold-bisector": {
      angle("halfAngle", data.halfAngle);
      requireFlag("equalFold", data.equalFold);
      const answer = data.halfAngle * 2;
      if (answer >= 180) throw new RangeError("unfolded angle must be less than 180 degrees");
      return { answer };
    }
    case "isosceles-apex": {
      angle("baseAngle", data.baseAngle);
      requireFlag("equalSides", data.equalSides);
      const answer = 180 - data.baseAngle * 2;
      if (answer <= 0) throw new RangeError("base angles do not form a triangle");
      return { answer };
    }
    case "around-point": {
      requireFlag("completeTurn", data.completeTurn);
      if (!Array.isArray(data.knownAngles) || data.knownAngles.length < 3) throw new RangeError("at least three known angles are required");
      data.knownAngles.forEach((value, index) => angle(`knownAngles[${index}]`, value));
      const answer = 360 - data.knownAngles.reduce((sum, value) => sum + value, 0);
      if (answer <= 0 || answer >= 180) throw new RangeError("known angles do not leave one unambiguous angle");
      return { answer };
    }
    case "parallel-pair": {
      requireFlag("parallel", data.parallel);
      angle("knownAngle", data.knownAngle);
      if (!["alternate", "corresponding", "same-side"].includes(data.relation)) throw new RangeError("parallel angle relation is ambiguous");
      return { answer: data.relation === "same-side" ? 180 - data.knownAngle : data.knownAngle };
    }
    case "zigzag-parallel": {
      requireFlag("parallel", data.parallel);
      angle("topAngle", data.topAngle);
      angle("bottomAngle", data.bottomAngle);
      const answer = data.topAngle + data.bottomAngle;
      if (answer >= 180) throw new RangeError("zigzag interior angle must be less than 180 degrees");
      return { answer };
    }
    case "fold-parallel": {
      requireFlag("parallel", data.parallel);
      requireFlag("equalFold", data.equalFold);
      angle("openedAngle", data.openedAngle);
      return { answer: cleanNumber("folded angle", data.openedAngle / 2) };
    }
    case "exterior-missing": {
      positiveInteger("sides", data.sides);
      if (data.sides < 3 || !Array.isArray(data.knownAngles) || data.knownAngles.length !== data.sides - 1) {
        throw new RangeError("exterior angles must identify exactly one missing angle");
      }
      data.knownAngles.forEach((value, index) => angle(`knownAngles[${index}]`, value));
      const answer = 360 - data.knownAngles.reduce((sum, value) => sum + value, 0);
      if (answer <= 0 || answer >= 180) throw new RangeError("exterior angles do not form a valid convex polygon");
      return { answer };
    }
    case "rectangle-cutout-area": {
      ["width", "height", "cutWidth", "cutHeight"].forEach((name) => positive(name, data[name]));
      if (data.cutWidth >= data.width || data.cutHeight >= data.height) throw new RangeError("cutout must fit strictly inside the corner");
      return { outerArea: data.width * data.height, cutArea: data.cutWidth * data.cutHeight, answer: data.width * data.height - data.cutWidth * data.cutHeight };
    }
    case "parallelogram-area":
    case "rearranged-area": {
      positive("base", data.base);
      positive("height", data.height);
      if (data.task === "rearranged-area") requireFlag("areaPreserved", data.areaPreserved);
      return { answer: data.base * data.height };
    }
    case "triangle-area": {
      positive("base", data.base);
      positive("height", data.height);
      return { answer: cleanNumber("triangle area", data.base * data.height / 2) };
    }
    case "trapezoid-area": {
      positive("top", data.top);
      positive("bottom", data.bottom);
      positive("height", data.height);
      if (data.top === data.bottom) throw new RangeError("trapezoid must have unequal parallel sides");
      return { answer: cleanNumber("trapezoid area", (data.top + data.bottom) * data.height / 2) };
    }
    case "notched-perimeter": {
      ["width", "height", "notchWidth", "notchDepth"].forEach((name) => positive(name, data[name]));
      if (data.notchWidth >= data.width || data.notchDepth >= data.height) throw new RangeError("notch must fit strictly inside the rectangle");
      if (data.notchSide !== "top") throw new RangeError("notch position must be explicit");
      return { answer: 2 * (data.width + data.height) + 2 * data.notchDepth };
    }
    case "staircase-perimeter": {
      positive("width", data.width);
      positive("height", data.height);
      if (!Array.isArray(data.steps) || data.steps.length < 2) throw new RangeError("at least two staircase steps are required");
      let right = 0;
      let down = 0;
      data.steps.forEach((step, index) => {
        if (!Array.isArray(step) || step.length !== 2) throw new RangeError(`steps[${index}] is invalid`);
        right += positive(`steps[${index}][0]`, step[0]);
        down += positive(`steps[${index}][1]`, step[1]);
      });
      if (right !== data.width || down !== data.height) throw new RangeError("staircase steps must span the stated width and height");
      return { answer: 2 * (data.width + data.height) };
    }
    case "rectangle-ratio-side": {
      positiveInteger("ratioWidth", data.ratioWidth);
      positiveInteger("ratioHeight", data.ratioHeight);
      positive("perimeter", data.perimeter);
      if (!["width", "height"].includes(data.target)) throw new RangeError("rectangle target side is ambiguous");
      const scale = cleanNumber("ratio scale", data.perimeter / (2 * (data.ratioWidth + data.ratioHeight)));
      if (!Number.isInteger(scale)) throw new RangeError("ratio sides must be whole centimeters");
      return { scale, answer: scale * (data.target === "width" ? data.ratioWidth : data.ratioHeight) };
    }
    case "tile-ratio-perimeter": {
      positiveInteger("ratioWidth", data.ratioWidth);
      positiveInteger("ratioHeight", data.ratioHeight);
      positive("smallPerimeter", data.smallPerimeter);
      positiveInteger("columns", data.columns);
      positiveInteger("rows", data.rows);
      const scale = cleanNumber("tile ratio scale", data.smallPerimeter / (2 * (data.ratioWidth + data.ratioHeight)));
      const tileWidth = scale * data.ratioWidth;
      const tileHeight = scale * data.ratioHeight;
      return { tileWidth, tileHeight, answer: cleanNumber("tiled perimeter", 2 * (tileWidth * data.columns + tileHeight * data.rows)) };
    }
    default: throw new RangeError(`Unknown course02 G4 task: ${data.task}`);
  }
}

const visual = (task, values, phase = "problem") => ({ kind: KIND, task, ...values, phase });
const withPhase = (base, phase) => ({ ...base, phase });

const unitFor = (task) => {
  if (["folded-corner", "fold-bisector", "isosceles-apex", "around-point", "parallel-pair", "zigzag-parallel", "fold-parallel", "exterior-missing"].includes(task)) return "°";
  if (["rectangle-cutout-area", "parallelogram-area", "triangle-area", "trapezoid-area", "rearranged-area"].includes(task)) return "cm²";
  return "cm";
};

function promptFor(data) {
  const relation = { alternate: "엇각", corresponding: "동위각", "same-side": "같은 쪽 안각" }[data.relation];
  switch (data.task) {
    case "folded-corner": return `${data.fullAngle}°인 각을 접은 선이 두 각으로 나누었습니다. 한 각이 ${data.fixedAngle}°일 때 나머지 각은 몇 도인가요?`;
    case "fold-bisector": return `종이를 접었다 펼치니 접힌 각과 같은 각이 반대편에 생겼습니다. 한쪽 각이 ${data.halfAngle}°일 때 펼친 전체 각은 몇 도인가요?`;
    case "isosceles-apex": return `두 변의 길이가 같은 삼각형에서 한 밑각이 ${data.baseAngle}°입니다. 꼭지각은 몇 도인가요?`;
    case "around-point": return `한 점 둘레의 각 중 ${data.knownAngles.join("°, ")}°를 뺀 나머지 각은 몇 도인가요?`;
    case "parallel-pair": return `평행선과 한 직선이 만났습니다. ${relation} 관계인 각 하나가 ${data.knownAngle}°일 때 물음표 각은 몇 도인가요?`;
    case "zigzag-parallel": return `두 평행선 사이의 번개 모양 선이 위쪽에서 ${data.topAngle}°, 아래쪽에서 ${data.bottomAngle}°를 이룹니다. 가운데 안쪽 각은 몇 도인가요?`;
    case "fold-parallel": return `평행한 두 변 사이에서 종이를 접어 ${data.openedAngle}°인 각을 정확히 반으로 포갰습니다. 접힌 한쪽 각은 몇 도인가요?`;
    case "exterior-missing": return `${data.sides}각형의 외각 중 ${data.knownAngles.join("°, ")}°를 알고 있습니다. 남은 한 외각은 몇 도인가요?`;
    case "rectangle-cutout-area": return `가로 ${data.width}cm, 세로 ${data.height}cm인 직사각형의 한 모서리에서 가로 ${data.cutWidth}cm, 세로 ${data.cutHeight}cm인 직사각형을 잘라 냈습니다. 남은 넓이는 몇 cm²인가요?`;
    case "parallelogram-area": return `밑변이 ${data.base}cm이고 높이가 ${data.height}cm인 평행사변형의 넓이는 몇 cm²인가요?`;
    case "triangle-area": return `밑변이 ${data.base}cm이고 높이가 ${data.height}cm인 삼각형의 넓이는 몇 cm²인가요?`;
    case "trapezoid-area": return `윗변 ${data.top}cm, 아랫변 ${data.bottom}cm, 높이 ${data.height}cm인 사다리꼴의 넓이는 몇 cm²인가요?`;
    case "rearranged-area": return `직사각형의 한쪽 삼각형을 옮겨 밑변 ${data.base}cm, 높이 ${data.height}cm인 평행사변형을 만들었습니다. 넓이는 몇 cm²인가요?`;
    case "notched-perimeter": return `가로 ${data.width}cm, 세로 ${data.height}cm인 직사각형의 윗변에서 너비 ${data.notchWidth}cm, 깊이 ${data.notchDepth}cm만큼 직사각형 모양으로 들어갔습니다. 둘레는 몇 cm인가요?`;
    case "staircase-perimeter": return `전체 가로가 ${data.width}cm, 전체 세로가 ${data.height}cm인 계단 모양의 둘레는 몇 cm인가요?`;
    case "rectangle-ratio-side": return `직사각형의 가로와 세로의 비는 ${data.ratioWidth}:${data.ratioHeight}이고 둘레는 ${data.perimeter}cm입니다. ${data.target === "width" ? "가로" : "세로"}는 몇 cm인가요?`;
    case "tile-ratio-perimeter": return `가로와 세로의 비가 ${data.ratioWidth}:${data.ratioHeight}이고 둘레가 ${data.smallPerimeter}cm인 직사각형을 가로 ${data.columns}개, 세로 ${data.rows}개 붙였습니다. 큰 직사각형의 둘레는 몇 cm인가요?`;
    default: throw new RangeError(`Missing prompt for ${data.task}`);
  }
}

function hintFor(data) {
  return ({
    "folded-corner": "전체 각에서 보이는 각을 빼세요.",
    "fold-bisector": "접은 선의 양쪽 각은 서로 같습니다.",
    "isosceles-apex": "두 밑각은 같고 삼각형의 세 각의 합은 180°입니다.",
    "around-point": "한 점 둘레의 각의 합은 360°입니다.",
    "parallel-pair": data.relation === "same-side" ? "같은 쪽 안각의 합은 180°입니다." : `${data.relation === "alternate" ? "엇각" : "동위각"}의 크기는 같습니다.`,
    "zigzag-parallel": "꺾인 점을 지나는 평행한 보조선을 생각하세요.",
    "fold-parallel": "포개지는 두 각은 크기가 같습니다.",
    "exterior-missing": "다각형의 외각의 합은 언제나 360°입니다.",
    "rectangle-cutout-area": "큰 직사각형 넓이에서 잘라 낸 넓이를 빼세요.",
    "parallelogram-area": "한쪽 삼각형을 옮기면 같은 밑변과 높이의 직사각형이 됩니다.",
    "triangle-area": "같은 삼각형 두 개를 붙여 평행사변형을 만드세요.",
    "trapezoid-area": "같은 사다리꼴을 뒤집어 붙이면 큰 평행사변형이 됩니다.",
    "rearranged-area": "조각을 옮겨도 넓이는 변하지 않습니다.",
    "notched-perimeter": "들어간 가로 길이는 사라진 윗변과 같고, 세로 두 줄만 더 생깁니다.",
    "staircase-perimeter": "계단의 가로 조각 합과 세로 조각 합을 각각 모으세요.",
    "rectangle-ratio-side": "둘레의 절반을 가로비와 세로비의 합으로 나누세요.",
    "tile-ratio-perimeter": "작은 직사각형의 실제 가로와 세로를 먼저 구하세요."
  })[data.task];
}

function typeFor(task) {
  return ({
    "folded-corner": "특수각에서 접힌 한 각을 빼 나머지 각 구하기",
    "fold-bisector": "접었다 펼친 도형에서 같은 각을 복원하기",
    "isosceles-apex": "이등변삼각형의 같은 밑각으로 꼭지각 구하기",
    "around-point": "한 점 둘레의 각의 합으로 빠진 각 구하기",
    "parallel-pair": "평행선의 엇각·동위각·같은 쪽 안각 구분하기",
    "zigzag-parallel": "보조 평행선을 그어 번개각 구하기",
    "fold-parallel": "평행선 사이의 접힌 각을 같은 두 각으로 나누기",
    "exterior-missing": "다각형의 외각의 합으로 빠진 외각 구하기",
    "rectangle-cutout-area": "큰 넓이에서 잘라 낸 직사각형 넓이 빼기",
    "parallelogram-area": "평행사변형을 직사각형으로 옮겨 넓이 구하기",
    "triangle-area": "삼각형 두 개를 붙여 넓이 구하기",
    "trapezoid-area": "사다리꼴 두 개를 붙여 넓이 구하기",
    "rearranged-area": "도형을 잘라 옮겨도 보존되는 넓이 구하기",
    "notched-perimeter": "들어간 직각 부분을 반영해 둘레 구하기",
    "staircase-perimeter": "계단 모양의 가로·세로 길이를 모아 둘레 구하기",
    "rectangle-ratio-side": "둘레와 가로세로의 비로 한 변의 길이 구하기",
    "tile-ratio-perimeter": "비로 작은 직사각형을 복원해 붙인 도형의 둘레 구하기"
  })[task];
}

function makeItems(bookId, lessonId, visuals) {
  return visuals.map((itemVisual, index) => {
    const slot = index < 4 ? `practice-${index + 1}` : index === 4 ? "extension" : `similar-${index - 4}`;
    return {
      id: `${lessonId}:${slot}`,
      prompt: promptFor(itemVisual),
      hint: hintFor(itemVisual),
      visual: itemVisual,
      answerMode: "input",
      inputMode: "numeric",
      responseMode: "numeric",
      unit: unitFor(itemVisual.task),
      typeLabel: typeFor(itemVisual.task),
      sourceNo: "",
      printGroup: index % 2 + 1,
      answerRef: `/course23/${bookId}/${lessonId}/${slot}`
    };
  });
}

function makeTrack(id, title, openingPrompt, hint, baseVisual, captions) {
  return {
    id, title, openingPrompt, hint,
    beats: PHASES.map((phase, index) => ({ caption: captions[index], visual: withPhase(baseVisual, phase) }))
  };
}

function makeLesson({ lessonId, title, unit, concept, tracks, visuals, sourceNote }) {
  const bookId = "course-02-g4";
  const items = makeItems(bookId, lessonId, visuals);
  return Object.freeze({
    id: lessonId,
    bookId,
    courseId: "course-02",
    label: "G4",
    title,
    unit,
    status: "pilot",
    learnerStage: LEARNER_STAGE,
    representativeConcept: concept,
    story: {
      title: "도형 개념 실험실",
      text: "교사용 지도서에서 확인한 활동의 사고 구조를 새 수와 새 도형으로 연습합니다.",
      mission: "주어진 조건을 그림에 표시하고, 계산한 값을 원래 조건으로 확인하세요."
    },
    explanation: { headline: title, steps: tracks.map((track) => track.title) },
    experience: { kind: "course-concept", tracks, openingPrompt: tracks[0].openingPrompt, hint: tracks[0].hint, beats: tracks[0].beats },
    original: { title: "연습", prompt: "개념을 적용해 문제를 풀고 문제마다 바로 확인하세요.", mode: "paged", separateConceptPrint: true, items: items.slice(0, 4) },
    extension: items[4],
    similarPractice: items.slice(5),
    dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: 30 },
    sourceTypeIds: [],
    source: { origin: "textbook-derived", note: sourceNote }
  });
}

const l1Tracks = [
  makeTrack("c2g4-special-corner", "특수각에서 보이는 각을 빼요", "직각의 일부만 보일 때 나머지 각은 어떻게 찾을까요?", "전체 각 90°에서 보이는 각을 빼세요.", visual("folded-corner", { fullAngle: 90, fixedAngle: 32 }), ["직각 표시와 보이는 각을 확인합니다.", "접힌 선이 직각을 두 부분으로 나눈 것을 표시합니다.", "90°에서 주어진 각을 뺍니다.", "두 각을 다시 더해 90°인지 확인합니다."]),
  makeTrack("c2g4-unfold-angle", "접힌 각을 펼쳐 복원해요", "한쪽 각만 보일 때 펼친 전체 각은 어떻게 될까요?", "접은 선 양쪽에 같은 각이 생깁니다.", visual("fold-bisector", { halfAngle: 36, equalFold: true }), ["한쪽에 보이는 각을 읽습니다.", "접은 선을 기준으로 같은 각을 반대편에 생각합니다.", "같은 각 두 개를 더합니다.", "펼친 선을 그려 두 각이 같은지 확인합니다."]),
  makeTrack("c2g4-isosceles", "같은 변에서 같은 각을 찾아요", "두 변이 같은 삼각형의 꼭지각은 어떻게 구할까요?", "두 밑각을 먼저 같은 크기로 표시하세요.", visual("isosceles-apex", { baseAngle: 48, equalSides: true }), ["같은 길이 표시가 있는 두 변을 찾습니다.", "마주 보는 두 밑각을 같은 크기로 놓습니다.", "180°에서 두 밑각을 뺍니다.", "보조 높이로 삼각형을 둘로 나누어 확인합니다."])
];

const l1Visuals = [
  visual("folded-corner", { fullAngle: 90, fixedAngle: 27 }),
  visual("fold-bisector", { halfAngle: 41, equalFold: true }),
  visual("isosceles-apex", { baseAngle: 55, equalSides: true }),
  visual("around-point", { knownAngles: [70, 85, 110], completeTurn: true }),
  visual("folded-corner", { fullAngle: 180, fixedAngle: 73 }),
  visual("fold-bisector", { halfAngle: 29, equalFold: true }),
  visual("isosceles-apex", { baseAngle: 37, equalSides: true }),
  visual("around-point", { knownAngles: [45, 90, 135], completeTurn: true }),
  visual("folded-corner", { fullAngle: 90, fixedAngle: 38 }),
  visual("fold-bisector", { halfAngle: 52, equalFold: true })
];

const l2Tracks = [
  makeTrack("c2g4-parallel", "평행선의 각 관계를 골라요", "엇각과 동위각은 왜 같은 크기일까요?", "화살표가 같은 두 직선부터 찾으세요.", visual("parallel-pair", { knownAngle: 64, relation: "alternate", parallel: true }), ["평행 표시와 가로지르는 직선을 찾습니다.", "주어진 각과 물음표 각의 위치 관계를 정합니다.", "엇각은 같은 크기임을 적용합니다.", "보조 표시로 두 각의 위치를 다시 확인합니다."]),
  makeTrack("c2g4-zigzag", "번개각에 보조 평행선을 그어요", "꺾인 점의 각을 두 평행선의 각으로 나눌 수 있을까요?", "꺾인 점을 지나며 두 직선과 평행한 선을 생각하세요.", visual("zigzag-parallel", { topAngle: 34, bottomAngle: 47, parallel: true }), ["위와 아래의 평행선을 확인합니다.", "꺾인 점을 지나는 보조 평행선을 생각합니다.", "엇각 두 개를 가운데에서 더합니다.", "보조선을 표시해 두 부분의 합인지 확인합니다."]),
  makeTrack("c2g4-parallel-fold", "포개진 각을 반으로 나눠요", "접힌 두 각이 포개지면 각각의 크기는 어떻게 될까요?", "펼친 각을 같은 두 부분으로 나누세요.", visual("fold-parallel", { openedAngle: 116, parallel: true, equalFold: true }), ["평행한 두 변과 접은 선을 찾습니다.", "포개진 두 각에 같은 표시를 합니다.", "펼친 각을 2로 나눕니다.", "반사된 선을 복원해 두 각을 확인합니다."]),
  makeTrack("c2g4-exterior", "외각을 한 바퀴로 모아요", "다각형의 외각을 차례로 돌면 몇 도일까요?", "바깥쪽으로 돈 각의 합은 360°입니다.", visual("exterior-missing", { sides: 5, knownAngles: [62, 74, 81, 69] }), ["각 꼭짓점의 외각을 찾습니다.", "외각을 한 점에 차례로 모아 한 바퀴로 봅니다.", "360°에서 알려진 외각의 합을 뺍니다.", "모든 외각의 합이 360°인지 확인합니다."])
];

const l2Visuals = [
  visual("parallel-pair", { knownAngle: 58, relation: "corresponding", parallel: true }),
  visual("parallel-pair", { knownAngle: 71, relation: "same-side", parallel: true }),
  visual("zigzag-parallel", { topAngle: 28, bottomAngle: 53, parallel: true }),
  visual("fold-parallel", { openedAngle: 124, parallel: true, equalFold: true }),
  visual("exterior-missing", { sides: 6, knownAngles: [48, 62, 55, 71, 66] }),
  visual("parallel-pair", { knownAngle: 43, relation: "alternate", parallel: true }),
  visual("zigzag-parallel", { topAngle: 39, bottomAngle: 44, parallel: true }),
  visual("fold-parallel", { openedAngle: 138, parallel: true, equalFold: true }),
  visual("exterior-missing", { sides: 5, knownAngles: [65, 72, 84, 61] }),
  visual("parallel-pair", { knownAngle: 112, relation: "same-side", parallel: true })
];

const l3Tracks = [
  makeTrack("c2g4-area-decompose", "큰 넓이에서 잘라 낸 넓이를 빼요", "ㄱ자 도형을 두 직사각형으로 나누면 넓이를 구할 수 있을까요?", "큰 직사각형에서 빈 직사각형을 빼세요.", visual("rectangle-cutout-area", { width: 12, height: 9, cutWidth: 4, cutHeight: 3 }), ["전체를 감싸는 직사각형을 봅니다.", "잘라 낸 직사각형의 가로와 세로를 표시합니다.", "전체 넓이에서 빈 넓이를 뺍니다.", "두 직사각형으로 나누어 더한 값과 같은지 확인합니다."]),
  makeTrack("c2g4-area-rearrange", "삼각형 조각을 옮겨 직사각형으로 만들어요", "평행사변형의 기울어진 부분을 옮기면 무엇이 될까요?", "밑변과 높이는 옮긴 뒤에도 그대로입니다.", visual("rearranged-area", { base: 13, height: 6, areaPreserved: true }), ["평행사변형의 밑변과 수직 높이를 찾습니다.", "한쪽 삼각형을 잘라 반대편 빈 곳으로 옮깁니다.", "같은 밑변과 높이의 직사각형 넓이를 계산합니다.", "절단선과 이동을 표시해 넓이가 보존되는지 확인합니다."]),
  makeTrack("c2g4-area-double", "두 개를 붙인 뒤 반으로 나눠요", "삼각형과 사다리꼴은 같은 모양 두 개를 붙이면 어떻게 될까요?", "붙인 도형의 넓이를 구한 뒤 2로 나누세요.", visual("trapezoid-area", { top: 7, bottom: 13, height: 8 }), ["서로 평행한 윗변과 아랫변, 높이를 찾습니다.", "같은 사다리꼴을 뒤집어 붙입니다.", "평행사변형 넓이를 구해 2로 나눕니다.", "원래 두 사다리꼴이 정확히 같은지 확인합니다."])
];

const l3Visuals = [
  visual("rectangle-cutout-area", { width: 14, height: 10, cutWidth: 5, cutHeight: 4 }),
  visual("parallelogram-area", { base: 11, height: 7 }),
  visual("triangle-area", { base: 15, height: 8 }),
  visual("trapezoid-area", { top: 6, bottom: 14, height: 5 }),
  visual("rearranged-area", { base: 17, height: 9, areaPreserved: true }),
  visual("rectangle-cutout-area", { width: 16, height: 11, cutWidth: 6, cutHeight: 3 }),
  visual("parallelogram-area", { base: 18, height: 5 }),
  visual("triangle-area", { base: 13, height: 10 }),
  visual("trapezoid-area", { top: 9, bottom: 15, height: 7 }),
  visual("rearranged-area", { base: 12, height: 11, areaPreserved: true })
];

const l4Tracks = [
  makeTrack("c2g4-notch", "들어간 부분의 둘레를 펼쳐요", "직사각형에서 안쪽으로 들어가면 둘레는 얼마나 늘어날까요?", "사라진 가로와 새 가로는 같고, 깊이 두 줄이 더 생깁니다.", visual("notched-perimeter", { width: 15, height: 10, notchWidth: 5, notchDepth: 3, notchSide: "top" }), ["전체 가로와 세로, 들어간 깊이를 확인합니다.", "들어간 가로를 원래 윗변으로 옮겨 봅니다.", "바깥 직사각형 둘레에 깊이 두 번을 더합니다.", "같은 방향의 길이를 모아 다시 확인합니다."]),
  makeTrack("c2g4-stairs", "계단의 가로와 세로를 모아요", "여러 번 꺾인 계단도 큰 가로와 세로만으로 셀 수 있을까요?", "오른쪽 길이끼리, 아래쪽 길이끼리 모으세요.", visual("staircase-perimeter", { width: 12, height: 9, steps: [[3, 2], [4, 3], [5, 4]] }), ["계단의 모든 가로 조각과 세로 조각을 찾습니다.", "가로 조각의 합과 세로 조각의 합을 각각 모읍니다.", "전체 가로와 세로를 두 번씩 더합니다.", "각 조각을 실제로 더한 값과 비교합니다."]),
  makeTrack("c2g4-perimeter-ratio", "둘레를 비의 한 묶음으로 나눠요", "가로와 세로의 비만 알 때 실제 길이는 어떻게 찾을까요?", "둘레의 절반은 가로와 세로의 합입니다.", visual("rectangle-ratio-side", { ratioWidth: 5, ratioHeight: 3, perimeter: 96, target: "height" }), ["가로와 세로의 비, 전체 둘레를 확인합니다.", "둘레를 2로 나누어 가로와 세로의 합을 구합니다.", "비의 합으로 나누어 한 묶음의 길이를 찾습니다.", "구한 두 변으로 둘레를 다시 계산합니다."])
];

const l4Visuals = [
  visual("notched-perimeter", { width: 18, height: 12, notchWidth: 6, notchDepth: 4, notchSide: "top" }),
  visual("staircase-perimeter", { width: 14, height: 10, steps: [[4, 3], [5, 2], [5, 5]] }),
  visual("rectangle-ratio-side", { ratioWidth: 4, ratioHeight: 3, perimeter: 84, target: "width" }),
  visual("rectangle-ratio-side", { ratioWidth: 7, ratioHeight: 4, perimeter: 132, target: "height" }),
  visual("tile-ratio-perimeter", { ratioWidth: 3, ratioHeight: 2, smallPerimeter: 50, columns: 4, rows: 3 }),
  visual("notched-perimeter", { width: 20, height: 13, notchWidth: 7, notchDepth: 5, notchSide: "top" }),
  visual("staircase-perimeter", { width: 16, height: 12, steps: [[3, 4], [6, 3], [7, 5]] }),
  visual("rectangle-ratio-side", { ratioWidth: 5, ratioHeight: 2, perimeter: 98, target: "height" }),
  visual("tile-ratio-perimeter", { ratioWidth: 4, ratioHeight: 3, smallPerimeter: 42, columns: 3, rows: 2 }),
  visual("notched-perimeter", { width: 17, height: 11, notchWidth: 4, notchDepth: 2, notchSide: "top" })
];

export const COURSE02_G4_LESSONS = Object.freeze([
  makeLesson({
    lessonId: "course-02-g4-special-angle-restoration",
    title: "접힌 선을 펼쳐 특수각과 도형을 복원해요",
    unit: "특수각과 도형의 복원",
    concept: "직각·평각과 접어서 포개진 같은 각, 이등변삼각형의 각을 이용해 보이지 않는 각과 선을 복원하기",
    tracks: l1Tracks,
    visuals: l1Visuals,
    sourceNote: "교사용 지도서 「특수각과 도형의 복원」 활동 p.6-8, p.11-15, p.18-21; 개념 확인 p.9-10, p.16-17, p.22-23; 도전 p.24-26; 연습 p.27-33의 접기·작도·특수각·직각삼각형 사고 구조를 바탕으로 새 수와 도형을 구성했습니다."
  }),
  makeLesson({
    lessonId: "course-02-g4-parallel-fold-zigzag",
    title: "평행선과 접기에서 번개각을 찾아요",
    unit: "평행선과 색종이 접기",
    concept: "평행선의 각 관계, 접어서 포개지는 각, 꺾인 점을 지나는 보조 평행선과 외각의 합으로 각을 구하기",
    tracks: l2Tracks,
    visuals: l2Visuals,
    sourceNote: "교사용 지도서 「평행선과 색종이 접기」 활동 p.36-41, p.45-48, p.52-54; 개념 확인 p.42-44, p.49-51, p.55-57; 도전 p.58-60; 연습 p.61-71의 평행선·색종이 접기·번개각·외각 이동 구조를 바탕으로 새 수와 도형을 구성했습니다."
  }),
  makeLesson({
    lessonId: "course-02-g4-area-rearrangement",
    title: "도형을 나누고 옮겨 넓이를 구해요",
    unit: "평면도형의 넓이",
    concept: "직사각형으로 분해하거나 같은 조각을 재배열해 평행사변형·삼각형·사다리꼴의 넓이를 구하기",
    tracks: l3Tracks,
    visuals: l3Visuals,
    sourceNote: "교사용 지도서 「평면도형의 넓이」 활동 p.74-76, p.79-81, p.84-87, p.90-91; 개념 확인 p.77-78, p.82-83, p.88-89, p.92-93; 도전 p.94-96; 연습 p.97-107의 직사각형·마름모·평행사변형·삼각형·사다리꼴 분해와 재배열 구조를 바탕으로 새 수와 도형을 구성했습니다."
  }),
  makeLesson({
    lessonId: "course-02-g4-perimeter-ratio",
    title: "직각으로 꺾인 도형의 둘레와 비를 연결해요",
    unit: "평면도형의 둘레",
    concept: "직각으로 꺾인 변을 같은 방향끼리 모으고, 직사각형의 둘레와 가로세로의 비로 실제 길이를 구하기",
    tracks: l4Tracks,
    visuals: l4Visuals,
    sourceNote: "교사용 지도서 「평면도형의 둘레」 활동 p.110-112, p.116-119, p.122-127; 개념 확인 p.113-115, p.120-121, p.128-129; 도전 p.130-133; 연습 p.134-144의 둘레·직각 꺾임·직사각형의 둘레와 비 구조를 바탕으로 새 수와 도형을 구성했습니다."
  })
]);

function svgFrame(label, body, width = 320, height = 210) {
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

const lineStyle = "stroke:#245d73;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round";
const helperStyle = "stroke:#b42332;stroke-width:2.5;stroke-dasharray:7 5;fill:none";
const textStyle = "font:600 15px sans-serif;fill:#18323d";

function angleMarkup(data, solved) {
  if (data.task === "folded-corner") {
    const radians = data.fixedAngle * Math.PI / 180;
    const x = 75 + Math.cos(radians) * 105;
    const y = 165 - Math.sin(radians) * 105;
    return svgFrame("접힌 선이 나눈 특수각", `<path d="M75 45V165H215" style="${lineStyle}"/><path d="M75 165L${x.toFixed(2)} ${y.toFixed(2)}" style="${lineStyle}"/><path d="M75 151H89V165" style="${lineStyle}"/><text x="145" y="181" style="${textStyle}">${data.fixedAngle}°</text><text x="91" y="91" style="${textStyle}">?</text>${solved ? `<path class="answer-construction" d="M103 165A28 28 0 0 0 75 137" style="${helperStyle}"/><text class="answer-construction" x="98" y="124" style="${textStyle}">${course02G4Model(data).answer}°</text>` : ""}`);
  }
  if (data.task === "fold-bisector") {
    const radians = (90 - data.halfAngle) * Math.PI / 180;
    const rightX = 160 + Math.cos(radians) * 108;
    const rightY = 165 - Math.sin(radians) * 108;
    const leftX = 320 - rightX;
    return svgFrame("접은 선을 펼쳐 복원하는 각", `<path d="M35 175H285" style="${lineStyle}"/><path d="M160 165V42M160 165L${rightX.toFixed(2)} ${rightY.toFixed(2)}" style="${lineStyle}"/><path d="M160 165L${rightX.toFixed(2)} ${rightY.toFixed(2)}L160 42Z" fill="#eaf0ff" stroke="#245d73" stroke-width="2"/><text x="174" y="112" style="${textStyle}">${data.halfAngle}°</text>${solved ? `<path class="answer-construction" d="M160 165L${leftX.toFixed(2)} ${rightY.toFixed(2)}" style="${helperStyle}"/><path class="answer-construction" d="M132 128A47 47 0 0 0 188 128" style="${helperStyle}"/>` : ""}`);
  }
  if (data.task === "isosceles-apex") {
    const baseHalf = 95;
    const apexY = 175 - Math.tan(data.baseAngle * Math.PI / 180) * baseHalf;
    return svgFrame("두 변의 길이가 같은 삼각형", `<path d="M65 175L160 ${apexY.toFixed(2)}L255 175Z" style="${lineStyle}"/><path d="M104 ${(175 + apexY) / 2}l12 9M204 ${((175 + apexY) / 2) + 9}l12-9" style="${lineStyle}"/><text x="76" y="166" style="${textStyle}">${data.baseAngle}°</text><text x="151" y="${(apexY + 28).toFixed(2)}" style="${textStyle}">?</text>${solved ? `<path class="answer-construction" d="M160 ${apexY.toFixed(2)}V175" style="${helperStyle}"/>` : ""}`);
  }
  const boundaries = [0];
  for (const value of data.knownAngles) boundaries.push(boundaries.at(-1) + value);
  const rays = boundaries.map((degree) => {
    const rad = degree * Math.PI / 180;
    return `<path d="M160 105L${(160 + Math.cos(rad) * 82).toFixed(2)} ${(105 - Math.sin(rad) * 82).toFixed(2)}" style="${lineStyle}"/>`;
  }).join("");
  const sectors = [...data.knownAngles, course02G4Model(data).answer];
  const labels = sectors.map((value, index) => {
    const start = index < boundaries.length ? boundaries[index] : boundaries.at(-1);
    const mid = (start + value / 2) * Math.PI / 180;
    const label = index === sectors.length - 1 ? "?" : `${value}°`;
    return `<text x="${(154 + Math.cos(mid) * 48).toFixed(2)}" y="${(110 - Math.sin(mid) * 48).toFixed(2)}" style="${textStyle}">${label}</text>`;
  }).join("");
  return svgFrame("한 점 둘레의 각", `${rays}<circle cx="160" cy="105" r="5" fill="#18323d"/>${labels}${solved ? `<circle class="answer-construction" cx="160" cy="105" r="45" style="${helperStyle}"/>` : ""}`);
}

function parallelMarkup(data, solved) {
  const parallels = `<path d="M35 55H285M35 165H285" style="${lineStyle}"/><path d="M65 49l10 6-10 6M65 159l10 6-10 6" style="${lineStyle}"/>`;
  if (data.task === "parallel-pair") {
    const acute = Math.min(data.knownAngle, 180 - data.knownAngle);
    const run = 110 / Math.tan(acute * Math.PI / 180);
    const lowerX = 100;
    const upperX = lowerX + run;
    return svgFrame("평행선과 가로지르는 직선의 각", `${parallels}<path d="M${(upperX + 25).toFixed(2)} 20L${(lowerX - 25).toFixed(2)} 200" style="${lineStyle}"/><text x="${(upperX + 8).toFixed(2)}" y="78" style="${textStyle}">${data.knownAngle}°</text><text x="${(lowerX + 12).toFixed(2)}" y="153" style="${textStyle}">?</text>${solved ? `<path class="answer-construction" d="M${upperX.toFixed(2)} 55A25 25 0 0 1 ${(upperX + 18).toFixed(2)} 75M${lowerX} 165A25 25 0 0 1 ${lowerX + 18} 185" style="${helperStyle}"/>` : ""}`);
  }
  if (data.task === "zigzag-parallel") {
    const kinkX = 170;
    const kinkY = 110;
    const topX = kinkX - (kinkY - 55) / Math.tan(data.topAngle * Math.PI / 180);
    const bottomX = kinkX + (165 - kinkY) / Math.tan(data.bottomAngle * Math.PI / 180);
    return svgFrame("두 평행선 사이의 번개각", `${parallels}<path d="M${topX.toFixed(2)} 55L${kinkX} ${kinkY}L${bottomX.toFixed(2)} 165" style="${lineStyle}"/><text x="${(topX + 9).toFixed(2)}" y="78" style="${textStyle}">${data.topAngle}°</text><text x="${(bottomX - 39).toFixed(2)}" y="153" style="${textStyle}">${data.bottomAngle}°</text><text x="174" y="103" style="${textStyle}">?</text>${solved ? `<path class="answer-construction" d="M35 ${kinkY}H285" style="${helperStyle}"/>` : ""}`);
  }
  if (data.task === "fold-parallel") {
    const half = data.openedAngle / 2 * Math.PI / 180;
    const offset = 80 * Math.tan(half);
    const apexX = 260;
    return svgFrame("평행선 사이의 접은 각", `<path d="M25 55H495M25 135H495" style="${lineStyle}"/><path d="M55 49l10 6-10 6M55 129l10 6-10 6" style="${lineStyle}"/><path d="M${(apexX - offset).toFixed(2)} 135L${apexX} 55L${(apexX + offset).toFixed(2)} 135" style="${lineStyle}"/><path d="M${apexX} 55V135" stroke="#8aa6b2" stroke-width="2" stroke-dasharray="5 5"/><text x="230" y="104" style="${textStyle}">${data.openedAngle}°</text>${solved ? `<path class="answer-construction" d="M${apexX} 55V135" style="${helperStyle}"/><path class="answer-construction" d="M225 91A48 48 0 0 0 295 91" style="${helperStyle}"/>` : ""}`, 520, 190);
  }
  const center = { x: 160, y: 108 };
  const radius = 76;
  const vertices = Array.from({ length: data.sides }, (_, index) => {
    const theta = -Math.PI / 2 + index * 2 * Math.PI / data.sides;
    return { x: center.x + Math.cos(theta) * radius, y: center.y + Math.sin(theta) * radius, theta };
  });
  const polygon = vertices.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const labels = [...data.knownAngles.map((value) => `${value}°`), "?"];
  const labelMarkup = labels.map((label, index) => {
    const { theta } = vertices[index];
    const x = center.x + Math.cos(theta) * (radius + 24);
    const y = center.y + Math.sin(theta) * (radius + 24) + 5;
    return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" style="${textStyle}">${esc(label)}</text>`;
  }).join("");
  return svgFrame("다각형의 외각", `<polygon points="${polygon}" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/>${labelMarkup}<text x="101" y="112" style="font:12px sans-serif;fill:#566274">그림은 크기 비교용이 아님</text>${solved ? `<circle class="answer-construction" cx="${center.x}" cy="${center.y}" r="42" style="${helperStyle}"/>` : ""}`);
}

function areaMarkup(data, solved) {
  if (data.task === "rectangle-cutout-area") {
    const cutX = 265 - data.cutWidth / data.width * 210;
    const cutY = 35 + data.cutHeight / data.height * 140;
    return svgFrame("한 모서리를 잘라 낸 직사각형", `<path d="M55 35H265V${cutY.toFixed(2)}H${cutX.toFixed(2)}V175H55Z" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/><text x="145" y="198" style="${textStyle}">${data.width}cm</text><text x="16" y="109" style="${textStyle}">${data.height}cm</text><text x="${cutX + 8}" y="${cutY - 8}" style="${textStyle}">${data.cutWidth}×${data.cutHeight}</text>${solved ? `<path class="answer-construction" d="M${cutX.toFixed(2)} 35V${cutY.toFixed(2)}H265" style="${helperStyle}"/>` : ""}`);
  }
  if (["parallelogram-area", "rearranged-area"].includes(data.task)) {
    return svgFrame("평행사변형의 밑변과 높이", `<polygon points="80,45 255,45 220,170 45,170" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/><path d="M80 45V170" stroke="#8aa6b2" stroke-width="2" stroke-dasharray="5 5"/><path d="M80 158H92V170" style="${lineStyle}"/><text x="124" y="194" style="${textStyle}">밑변 ${data.base}cm</text><text x="84" y="111" style="${textStyle}">높이 ${data.height}cm</text>${solved ? `<path class="answer-construction" d="M45 170L80 45M220 170L255 45" style="${helperStyle}"/><path class="answer-construction" d="M45 170H220" style="${helperStyle}"/>` : ""}`);
  }
  if (data.task === "triangle-area") {
    return svgFrame("삼각형의 밑변과 높이", `<path d="M45 170H275L185 35Z" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/><path d="M185 35V170" stroke="#8aa6b2" stroke-width="2" stroke-dasharray="5 5"/><path d="M185 158H197V170" style="${lineStyle}"/><text x="124" y="195" style="${textStyle}">밑변 ${data.base}cm</text><text x="190" y="104" style="${textStyle}">높이 ${data.height}cm</text>${solved ? `<path class="answer-construction" d="M45 35H275V170" style="${helperStyle}"/>` : ""}`);
  }
  return svgFrame("사다리꼴의 윗변 아랫변과 높이", `<path d="M95 45H220L275 170H45Z" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/><path d="M95 45V170" stroke="#8aa6b2" stroke-width="2" stroke-dasharray="5 5"/><text x="133" y="36" style="${textStyle}">${data.top}cm</text><text x="124" y="195" style="${textStyle}">${data.bottom}cm</text><text x="101" y="112" style="${textStyle}">${data.height}cm</text>${solved ? `<path class="answer-construction" d="M220 45L325 45L275 170" style="${helperStyle}"/>` : ""}`, 360, 210);
}

function perimeterMarkup(data, solved) {
  if (data.task === "notched-perimeter") {
    const notchPixels = data.notchWidth / data.width * 230;
    const notchLeft = 160 - notchPixels / 2;
    const notchRight = 160 + notchPixels / 2;
    const notchBottom = 35 + data.notchDepth / data.height * 130;
    return svgFrame("윗부분이 직각으로 들어간 도형", `<path d="M45 35H${notchLeft}V${notchBottom.toFixed(2)}H${notchRight}V35H275V175H45Z" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/><text x="132" y="199" style="${textStyle}">가로 ${data.width}cm</text><text x="4" y="109" style="${textStyle}">세로 ${data.height}cm</text><text x="136" y="${notchBottom + 20}" style="${textStyle}">깊이 ${data.notchDepth}cm</text>${solved ? `<path class="answer-construction" d="M${notchLeft} 35H${notchRight}" style="${helperStyle}"/>` : ""}`);
  }
  if (data.task === "staircase-perimeter") {
    const xScale = 210 / data.width;
    const yScale = 130 / data.height;
    let x = 55;
    let y = 35;
    const points = [[x, y]];
    for (const [right, down] of data.steps) {
      x += right * xScale;
      points.push([x, y]);
      y += down * yScale;
      points.push([x, y]);
    }
    points.push([55, 165]);
    return svgFrame("직각으로 꺾인 계단 모양", `<polygon points="${points.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(" ")}" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/><text x="125" y="194" style="${textStyle}">전체 가로 ${data.width}cm</text><text x="4" y="105" style="${textStyle}">전체 세로 ${data.height}cm</text>${solved ? `<path class="answer-construction" d="M55 35H265V165" style="${helperStyle}"/>` : ""}`);
  }
  const ratioWidth = data.ratioWidth;
  const ratioHeight = data.ratioHeight;
  if (data.task === "rectangle-ratio-side") {
    const w = 190;
    const h = Math.max(70, w * ratioHeight / ratioWidth);
    return svgFrame("가로와 세로의 비가 주어진 직사각형", `<rect x="65" y="${(105 - h / 2).toFixed(2)}" width="${w}" height="${h.toFixed(2)}" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/><text x="126" y="198" style="${textStyle}">가로:세로 = ${ratioWidth}:${ratioHeight}</text><text x="101" y="24" style="${textStyle}">둘레 ${data.perimeter}cm</text>${solved ? `<path class="answer-construction" d="M65 180H255M272 ${(105 - h / 2).toFixed(2)}V${(105 + h / 2).toFixed(2)}" style="${helperStyle}"/>` : ""}`);
  }
  const totalRatio = data.ratioWidth * data.columns / (data.ratioHeight * data.rows);
  const gridWidth = totalRatio >= 1 ? 200 : 200 * totalRatio;
  const gridHeight = totalRatio >= 1 ? 200 / totalRatio : 200;
  const gridX = (320 - gridWidth) / 2;
  const gridY = 105 - gridHeight / 2;
  const cellW = gridWidth / data.columns;
  const cellH = gridHeight / data.rows;
  const grid = [];
  for (let column = 1; column < data.columns; column += 1) grid.push(`<path d="M${(gridX + cellW * column).toFixed(2)} ${gridY.toFixed(2)}V${(gridY + gridHeight).toFixed(2)}" stroke="#8aa6b2" stroke-width="1.5"/>`);
  for (let row = 1; row < data.rows; row += 1) grid.push(`<path d="M${gridX.toFixed(2)} ${(gridY + cellH * row).toFixed(2)}H${(gridX + gridWidth).toFixed(2)}" stroke="#8aa6b2" stroke-width="1.5"/>`);
  return svgFrame("같은 직사각형을 붙인 큰 직사각형", `<rect x="${gridX.toFixed(2)}" y="${gridY.toFixed(2)}" width="${gridWidth.toFixed(2)}" height="${gridHeight.toFixed(2)}" fill="#eaf0ff" stroke="#245d73" stroke-width="3"/>${grid.join("")}<text x="53" y="20" style="${textStyle}">작은 것 ${ratioWidth}:${ratioHeight}, 둘레 ${data.smallPerimeter}cm</text><text x="109" y="207" style="${textStyle}">${data.columns}열 × ${data.rows}행</text>${solved ? `<path class="answer-construction" d="M${gridX.toFixed(2)} ${(gridY + gridHeight + 8).toFixed(2)}H${(gridX + gridWidth).toFixed(2)}M${(gridX + gridWidth + 8).toFixed(2)} ${gridY.toFixed(2)}V${(gridY + gridHeight).toFixed(2)}" style="${helperStyle}"/>` : ""}`);
}

export function course02G4ConceptMarkup(data) {
  if (!data || data.kind !== KIND) return "";
  const phase = data.phase || "problem";
  if (!PHASES.includes(phase)) throw new RangeError(`Unknown course02 G4 phase: ${phase}`);
  const solved = phase === "verify";
  const model = course02G4Model(data);
  let diagram;
  if (["folded-corner", "fold-bisector", "isosceles-apex", "around-point"].includes(data.task)) diagram = angleMarkup(data, solved);
  else if (["parallel-pair", "zigzag-parallel", "fold-parallel", "exterior-missing"].includes(data.task)) diagram = parallelMarkup(data, solved);
  else if (["rectangle-cutout-area", "parallelogram-area", "triangle-area", "trapezoid-area", "rearranged-area"].includes(data.task)) diagram = areaMarkup(data, solved);
  else diagram = perimeterMarkup(data, solved);
  const verification = solved ? `<figcaption class="g4-verification">계산 결과 <strong class="g4-answer">${esc(model.answer)}${esc(unitFor(data.task))}</strong></figcaption>` : "";
  return `<figure class="course02-g4-visual" data-task="${esc(data.task)}" data-phase="${esc(phase)}">${diagram}${verification}</figure>`;
}
