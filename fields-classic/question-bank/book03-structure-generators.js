// 1과정 3권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK03_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK03_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK03_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK03_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)

export const BOOK03_STRUCTURE_GENERATORS = {};
export const BOOK03_STRUCTURE_TYPE_ROWS = [];
export const BOOK03_STRUCTURE_GUIDES = {};
export const BOOK03_STRUCTURE_REMAPS = [];
