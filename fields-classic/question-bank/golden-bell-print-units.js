import { CURRICULUM } from "./source-data.js";

// Legacy Golden Bell IDs differ from the textbook bank's IDs. Keep this
// print-only crosswalk separate from source questions and their answers.
// 2026-10-23: 골든벨 학습 순서를 더클 교재 순서로 맞추면서(원장 「골든벨은 더클 교재 배우기 전날 예습용」) 원본 대조 때
// 새로 생긴 단원도 모두 교재 단원에 이었다. 교재 단원 주제와 같으면 그 단원, 교재에 없는 연산 골든벨 주제는
// 골든벨 원본에서 그 주에 함께 배우는 단원에 둔다(예: 5권 선분 나누기·분수 → 3, 둘레·가르기 → 4).
const legacyUnits = {
  "book-04": {
    "fold-hole-count": 2, "cube-box-fill": 2, "table-logic-source": 4, "circle-logic-source": 4, "row-logic-source": 4,
    "fold-position-source": 2, "fold-cut-source": 2, "multiplication-matrix": 2,
    "compare-order-source": 3, "compare-difference-source": 3, "balance-equality-source": 3, "order-logic-source": 4
  },
  "book-05": {
    "number-sequence-source": 1, "radial-rows-source": 1, "multiplication-table-source": 3, "segment-division-source": 3,
    "shape-value-source": 3, "equivalent-fraction-source": 3, "triangle-number-source": 4, "perimeter-source": 4,
    "square-number-source": 4, "halving-tree-source": 4
  },
  "book-07": {
    "shared-polygon-matchsticks": 2, "closed-loop-planting": 3, "venn-overlap-all": 4,
    "calendar-weekday": 1, "clock-reading": 1, "multiplication-equation": 2,
    "arithmetic-sequence": 2, "assumption-score": 2, "reverse-growth": 3, "reverse-digits": 4,
    "reverse-sequence-source": 2, "palindrome-source": 4, "distance-line-source": 4
  },
  "book-08": { "shape-equation-targets": 1, "pyramid-cryptarithm": 2, "picture-division": 3 },
  "book-09": { "cube-paint-source": 2, "cube-views-source": 2, "cube-min-max-source": 2 }
};

const normalize = (value) => value.replace(/\s/gu, "");

export function goldenBellPrintUnits(book) {
  const metadata = CURRICULUM.find((item) => item.id === book.id);
  const groups = new Map();
  for (const lesson of book.lessons) {
    const explicit = legacyUnits[book.id]?.[lesson.id];
    const byName = metadata?.units.findIndex((unit) => normalize(unit.label) === normalize(lesson.unit));
    const byType = metadata?.units.map((unit, index) => ({ unit, index }))
      .filter(({ unit }) => lesson.sourceTypeIds?.some((id) => unit.typeIds.includes(id))) || [];
    const index = explicit ? explicit - 1 : byName >= 0 ? byName : byType.length === 1 ? byType[0].index : -1;
    const number = index >= 0 ? index + 1 : null;
    const title = number ? metadata.units[index].label : lesson.unit;
    const key = number || !metadata ? normalize(title) : `extra:${normalize(title)}`;
    const label = number ? `${number}단원 · ${title}` : `${metadata ? "추가 유형" : "유형"} · ${title}`;
    if (!groups.has(key)) groups.set(key, { key, title, number, label, lessons: [] });
    groups.get(key).lessons.push(lesson);
  }
  return [...groups.values()].sort((a, b) => (a.number ?? Infinity) - (b.number ?? Infinity));
}
