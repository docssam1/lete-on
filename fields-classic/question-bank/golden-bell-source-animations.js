import { cubeSourceAnimation, renderCubeSourceFrame } from "./golden-bell-cube-animation.js?v=20260918a";
import { book10SourceAnimation, renderBook10SourceFrame } from "./golden-bell-book10-animation.js?v=20260918a";
import { book01FoldAnimations, renderBook01FoldFrame } from "./golden-bell-book01-folding.js?v=20260922d";

const CONCEPT_EXAMPLES = {
  "hidden-cube-count": [
    {
      id: "concept-example-hidden-cube-count-01",
      conceptExample: true,
      typeLabel: "기둥 높이로 숨은 수 찾기",
      prompt: "윗면의 수를 이용해 보이지 않는 쌓기나무의 수를 구하세요.",
      visual: { kind: "book4", subtype: "source-hidden-cube", map: [[2, 1], [2, 1]] }
    },
    {
      id: "concept-example-hidden-cube-count-02",
      conceptExample: true,
      typeLabel: "기둥 높이로 숨은 수 찾기",
      prompt: "기둥의 높이를 나타낸 뒤 보이지 않는 쌓기나무의 수를 구하세요.",
      visual: { kind: "book4", subtype: "source-hidden-cube", map: [[3, 2], [2, 0]] }
    },
    {
      id: "concept-example-hidden-cube-count-03",
      conceptExample: true,
      typeLabel: "기둥 높이로 숨은 수 찾기",
      prompt: "위에서 본 자리와 기둥 높이를 이용해 숨은 쌓기나무의 수를 구하세요.",
      visual: { kind: "book4", subtype: "source-hidden-cube", map: [[3, 1, 2], [2, 2, 0], [1, 0, 0]] }
    }
  ],
  "catch-up-acorns": [
    {
      id: "concept-example-catch-up-acorns-01",
      conceptExample: true,
      structureKey: "sum-difference-combine-divide",
      typeLabel: "두 식을 합쳐 등분하기",
      prompt: "두 식을 합쳐 별과 마름모의 값을 각각 구하세요.",
      visual: {
        kind: "book10",
        subtype: "quantity-equations",
        unit: "점",
        symbols: [{ label: "별", token: "★" }, { label: "마름모", token: "◆" }],
        equations: [{ terms: [1, 2], total: 24 }, { terms: [2, 1], total: 21 }]
      }
    },
    {
      id: "concept-example-catch-up-acorns-02",
      conceptExample: true,
      structureKey: "sum-difference-combine-divide",
      typeLabel: "두 식을 합쳐 등분하기",
      prompt: "두 식을 합쳐 세모와 동그라미의 값을 각각 구하세요.",
      visual: {
        kind: "book10",
        subtype: "quantity-equations",
        unit: "점",
        symbols: [{ label: "세모", token: "▲" }, { label: "동그라미", token: "●" }],
        equations: [{ terms: [1, 3], total: 17 }, { terms: [3, 1], total: 19 }]
      }
    },
    {
      id: "concept-example-catch-up-acorns-03",
      conceptExample: true,
      structureKey: "common-term-elimination",
      typeLabel: "같은 모양을 빼고 등분하기",
      prompt: "두 식에서 같은 모양을 빼고 네모와 동그라미의 값을 각각 구하세요.",
      visual: {
        kind: "book10",
        subtype: "quantity-equations",
        unit: "점",
        symbols: [{ label: "네모", token: "■" }, { label: "동그라미", token: "●" }],
        equations: [{ terms: [3, 2], total: 26 }, { terms: [1, 2], total: 14 }]
      }
    },
    {
      id: "concept-example-catch-up-acorns-04",
      conceptExample: true,
      structureKey: "common-term-elimination",
      typeLabel: "같은 구슬을 빼고 등분하기",
      prompt: "두 식에서 같은 구슬을 빼고 주황 구슬과 파란 구슬의 값을 각각 구하세요.",
      visual: {
        kind: "book10",
        subtype: "quantity-equations",
        unit: "점",
        symbols: [{ label: "주황 구슬", token: "●", className: "orange" }, { label: "파란 구슬", token: "●", className: "blue" }],
        equations: [{ terms: [3, 1], total: 29 }, { terms: [1, 1], total: 13 }]
      }
    },
    {
      id: "concept-example-catch-up-acorns-05",
      conceptExample: true,
      structureKey: "target-score-difference",
      typeLabel: "과녁 점수의 합과 차",
      prompt: "두 기록을 비교해 바깥쪽에 한 번 맞혔을 때의 점수를 구하세요.",
      parts: [{ label: "바깥쪽 점수" }],
      visual: {
        kind: "book10",
        subtype: "target-score",
        zones: [{ label: "안쪽" }, { label: "바깥쪽" }],
        attempts: [{ label: "첫째 기록", hits: [3, 2], total: 29 }, { label: "둘째 기록", hits: [1, 2], total: 15 }]
      }
    }
  ]
};

function cloneExample(example) {
  const visual = example.visual;
  return {
    ...example,
    parts: example.parts?.map((part) => ({ ...part })),
    visual: {
      ...visual,
      map: visual.map?.map((row) => [...row]),
      symbols: visual.symbols?.map((symbol) => ({ ...symbol })),
      equations: visual.equations?.map((row) => ({ ...row, terms: [...row.terms] })),
      zones: visual.zones?.map((zone) => ({ ...zone })),
      attempts: visual.attempts?.map((attempt) => ({ ...attempt, hits: [...attempt.hits] }))
    }
  };
}

export function conceptAnimationExamplesForLesson(lessonId) {
  return (CONCEPT_EXAMPLES[lessonId] || []).map(cloneExample);
}

export function sourceAnimationsForLesson(lesson) {
  const folds = book01FoldAnimations(lesson.id);
  if (folds.length) return folds;
  const builder = lesson.id === "hidden-cube-count" ? cubeSourceAnimation : lesson.id === "catch-up-acorns" ? book10SourceAnimation : null;
  if (!builder) return [];
  return conceptAnimationExamplesForLesson(lesson.id).map((item) => {
    const animation = builder(item);
    return animation && { ...animation, label: item.typeLabel };
  }).filter(Boolean);
}

export function sourceAnimationFrame(animation, step, options = {}) {
  if (animation.family === "book01-fold") return renderBook01FoldFrame(animation, step, options);
  return animation.family === "cube-hidden-count"
    ? renderCubeSourceFrame(animation, step, options)
    : renderBook10SourceFrame(animation, step, options);
}

export function sourceAnimationDelay(animation, step, speed = 1) {
  const requested = Number(animation.beats[step]?.durationMs);
  const duration = Number.isFinite(requested) && requested >= 1000 ? requested : 4500;
  return Math.max(1800, duration / Math.max(0.5, Math.min(2, speed)));
}
