// 학습 기록 — 우선 이 기기(localStorage)에만. 필즈 서버 기록(fields-progress)은 받는 종류·열쇠 형식을 확인한 뒤 잇는다.
//  열쇠: sm-rec:<아이 이름>:<책>:<단원>-<차시>  →  { done, stars, at }
const key = (student, book, lesson) => `sm-rec:${student}:${book}:${lesson}`;
export function readLesson(student, book, lesson) {
  try { return JSON.parse(localStorage.getItem(key(student, book, lesson)) || "null"); } catch { return null; }
}
export function saveLesson(student, book, lesson, record) {
  const prev = readLesson(student, book, lesson) || {};
  const next = { ...prev, ...record, stars: Math.max(prev.stars || 0, record.stars || 0), at: new Date().toISOString() };
  try { localStorage.setItem(key(student, book, lesson), JSON.stringify(next)); } catch { /* 저장 못 해도 계속 */ }
  return next;
}
