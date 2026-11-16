// 입학 모의고사 회차별 승인(원장 2026-11-16 「승인도 회차별로 되어야지」).
// 회차 하나 = 선발시험 한 회. 권한 이름은 서버(fields-members·fields-approval-admin PRODUCT_IDS, _shared/fields-admin-access.js)와
// 관리자 화면(teacher-admin.js·../admin.html), 모의고사 서재(../program/index.html)에 같은 이름으로 있다 — 하나를 고치면 다 고친다.
// 차수는 원본 시험 이름을 따른다(7세는 5차가 없다).
export const ENTRANCE_PRODUCTS = Object.freeze([
  { id: "초1입학모의고사1차", name: "초1 입학 · 7세 1차", examId: "k6-2023-02", group: "k" },
  { id: "초1입학모의고사2차", name: "초1 입학 · 7세 2차", examId: "k7-2022-04", group: "k" },
  { id: "초1입학모의고사3차", name: "초1 입학 · 7세 3차", examId: "k7-2022-06", group: "k" },
  { id: "초1입학모의고사4차", name: "초1 입학 · 7세 4차", examId: "k7-2022-08", group: "k" },
  { id: "초1입학모의고사6차", name: "초1 입학 · 7세 6차", examId: "k7-2022-12", group: "k" },
  { id: "초2입학모의고사1차", name: "초2 입학 · 초1 1차", examId: "g1-2022-03", group: "g1" },
  { id: "초2입학모의고사2차", name: "초2 입학 · 초1 2차", examId: "g1-2022-05", group: "g1" },
  { id: "초2입학모의고사3차", name: "초2 입학 · 초1 3차", examId: "g1-2019-08", group: "g1" },
  { id: "초2입학모의고사4차", name: "초2 입학 · 초1 4차", examId: "g1-2022-02", group: "g1" },
]);
export const productForExam = (examId) => ENTRANCE_PRODUCTS.find((p) => p.examId === examId) || null;

// 이 탭의 로그인(같은 승인번호 세션 gfield_fields_session — 모의고사 서재·스스로 공부와 같다)으로 열린 회차.
// 관리자(DOCSSAM)는 다 열린다. 화면 쪽 잠금이다(시험지 파일 자체는 공개 정적 파일).
export function openExamIds(account) {
  if (!account) return new Set();
  if (account.type === "admin") return new Set(ENTRANCE_PRODUCTS.map((p) => p.examId));
  const perms = new Set(account.permissions || []);
  return new Set(ENTRANCE_PRODUCTS.filter((p) => perms.has(p.id)).map((p) => p.examId));
}
