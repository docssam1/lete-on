import { CURRICULUM } from "./source-data.js";

// Legacy Golden Bell IDs differ from the textbook bank's IDs. Keep this
// print-only crosswalk separate from source questions and their answers.
const legacyUnits = {
  "book-04": { "fold-hole-count": 2, "cube-box-fill": 2, "table-logic-source": 4, "circle-logic-source": 4, "row-logic-source": 4 },
  "book-07": {
    "shared-polygon-matchsticks": 2, "closed-loop-planting": 3, "venn-overlap-all": 4,
    "calendar-weekday": 1, "clock-reading": 1, "multiplication-equation": 2,
    "arithmetic-sequence": 2, "assumption-score": 2, "reverse-growth": 3, "reverse-digits": 4
  },
  "book-08": { "shape-equation-targets": 1, "pyramid-cryptarithm": 2 },
  "book-10": { "napier-multiplication": 1, "number-digit-range-count": 4 }
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
