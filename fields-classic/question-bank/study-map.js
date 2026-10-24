// 학생용 단원 학습의 지도 — 본책 단원을 차시로 나누고, 차시마다 골든벨 학습·게임·본책 문항을 짝짓는다.
// 원장 지시(2026-10-24): 「1단원을 2번 정도로 나누어 공부하는 거야. 개념을 절반으로 나누어서.」
//  · 나누는 기준은 본책 자체에 있다 — 활동·확인 문항이 「개념 1 · 개념 2」(group 1·2) 묶음으로 나뉘어 있다(7권 2단원·10권 1단원은 3묶음).
//  · 유형은 그 유형의 활동·확인 문항이 처음 나오는 묶음의 차시에 속한다. 활동·확인이 없는 유형(연습·도전에만 나옴)은 마지막 차시.
//  · 연습·도전 문항은 본책에서 단원 하나로 묶여 있으므로, 문항의 유형이 속한 차시로 보낸다.
//  · 본책 문항 1,613개는 모두 유형 하나에 연결돼 있다(source-data.js typeStudyRefs) — 번호판의 번호마다 유사문제를 만들 수 있다.
// 이 파일은 데이터만 다룬다. 화면은 study.js(학생 차시) · start.js(시작 화면).

export const SECTION_LABELS = Object.freeze({ activity: "활동", check: "확인", practice: "연습", advanced: "도전" });
const SECTION_STAGE = Object.freeze({ activity: "concept", check: "type", practice: "practice", advanced: "advanced" });

// ── 골든벨 학습을 본책 단원에 나눠 담는다 ──
// 1순위: 학습이 다루는 세부 유형(sourceTypeIds)이 단원 유형과 겹치는 수. 2순위: 단원 이름이 같거나 한쪽에 들어 있음.
// 어느 단원에도 안 붙는 학습(골든벨 자료에만 있는 주제)은 rest 로 따로 돌려준다.
const squash = (text) => String(text || "").replace(/\s+/g, "");
const words = (text) => String(text || "").split(/[\s·,]+|와|과|및/).map(squash).filter((word) => word.length >= 2);
export function lessonsByUnit(book, bellBook) {
  const units = book.units.map(() => []);
  const rest = [];
  for (const lesson of bellBook?.lessons || []) {
    let best = -1;
    let bestScore = 0;
    book.units.forEach((unit, index) => {
      const shared = (lesson.sourceTypeIds || []).filter((id) => unit.typeIds.includes(id)).length;
      const a = squash(lesson.unit);
      const b = squash(unit.label);
      const nameScore = a === b ? 8 : a && (b.includes(a) || a.includes(b)) ? 5 : words(lesson.unit).filter((word) => b.includes(word)).length * 2;
      const score = shared * 10 + nameScore;
      if (score > bestScore) { bestScore = score; best = index; }
    });
    (best < 0 ? rest : units[best]).push(lesson);
  }
  return { units, rest };
}

// 단원의 차시 수(활동·확인 묶음 수)와 유형마다의 차시(1부터).
export function unitParts(unit) {
  const groups = new Set();
  for (const stage of ["concept", "type"]) for (const ref of unit.studyRefs?.[stage] || []) groups.add(ref.group);
  const count = Math.max(1, groups.size);
  const typePart = {};
  for (const typeId of unit.typeIds) {
    const refs = unit.typeStudyRefs?.[typeId] || {};
    const own = [...(refs.concept || []), ...(refs.type || [])].map((ref) => ref.group);
    typePart[typeId] = own.length ? Math.min(...own) : count;
  }
  return { count, typePart };
}

// 차시 하나의 본책 문항(번호판). [{ section, group, label, numbers: [{ n, typeId, stage }] }]
export function partProblems(unit, part) {
  const { count, typePart } = unitParts(unit);
  const blocks = [];
  for (const stage of ["concept", "type", "practice", "advanced"]) {
    for (const ref of unit.studyRefs?.[stage] || []) {
      const shared = stage === "practice" || stage === "advanced";
      if (!shared && ref.group !== part) continue;
      const numbers = [];
      for (let n = ref.from; n <= ref.to; n += 1) {
        const typeId = Object.keys(unit.typeStudyRefs || {}).find((id) => (unit.typeStudyRefs[id][stage] || [])
          .some((own) => own.section === ref.section && own.group === ref.group && own.numbers.includes(n)));
        if (!typeId) continue;
        if (shared && (typePart[typeId] || count) !== part) continue;
        numbers.push({ n, typeId, stage: SECTION_STAGE[ref.section] || stage });
      }
      if (!numbers.length) continue;
      const name = SECTION_LABELS[ref.section] || ref.section;
      blocks.push({ section: ref.section, group: ref.group, label: shared ? name : `${name} ${ref.group}`, numbers });
    }
  }
  return blocks;
}

// 단원의 골든벨 학습을 차시로 나눈다. 유형이 겹치면 그 유형의 차시, 안 겹치면 뒤쪽에서 처음 만나는 짝 있는 학습의 차시를 따른다.
export function lessonsByPart(unit, lessons) {
  const { count, typePart } = unitParts(unit);
  const own = lessons.map((lesson) => {
    const parts = (lesson.sourceTypeIds || []).map((id) => typePart[id]).filter(Boolean);
    return parts.length ? Math.min(...parts) : null;
  });
  const parts = Array.from({ length: count }, () => []);
  lessons.forEach((lesson, index) => {
    let part = own[index];
    for (let k = index + 1; part == null && k < lessons.length; k += 1) part = own[k];
    for (let k = index - 1; part == null && k >= 0; k -= 1) part = own[k];
    parts[(part || 1) - 1].push(lesson);
  });
  return parts;
}

// 학습에 붙은 게임 이름들. games = { flows, flowTitles, activities, handsOnBooks }
export function gameTitles(bookId, lesson, games) {
  const titles = new Map();
  const flow = games.flows[`${bookId}/${lesson.id}`];
  if (flow?.game) titles.set(flow.game, games.flowTitles[flow.game] || "게임");
  for (const [id, activity] of Object.entries(games.activities)) {
    if (activity.lesson === lesson.id && games.handsOnBooks.get(id) === bookId) titles.set(id, activity.title);
  }
  return [...titles.values()];
}

// 골든벨·게임 데이터는 크다(1.8MB) — 첫 화면을 그린 뒤 불러온다. 골든벨 화면과 같은 꼬리표로 불러 캐시를 같이 쓴다.
export async function loadGoldenBell() {
  const [library, flow, handsOn] = await Promise.all([
    import("./golden-bell-library.js?v=20261023h"),
    import("./golden-bell-lesson-flow.js?v=20261023x"),
    import("./golden-bell-hands-on-models.js?v=20261023t")
  ]);
  const handsOnBooks = new Map();
  for (const unit of handsOn.HANDS_ON_UNITS) for (const id of unit.activities) if (!handsOnBooks.has(id)) handsOnBooks.set(id, unit.bookId);
  return {
    books: library.GOLDEN_BELL_BOOKS,
    games: { flows: flow.LESSON_FLOWS, flowTitles: flow.FLOW_GAME_TITLES, activities: handsOn.HANDS_ON_ACTIVITIES, handsOnBooks }
  };
}
