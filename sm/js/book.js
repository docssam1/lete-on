// 레이키즈 책들. A1-2는 3·4단원만(원장 2026-11-13 「ray 1-2의 3,4단원만 하자」), A1-3은 4단원 전부.
//  차시 id는 책 사이에서 겹치지 않게 한다(A1-2는 a12-로 시작). lessons/<id>.js 가 화면을 만든다.
export const BOOK_A12 = {
  id: "a1-2",
  short: "A1-2",
  title: "레이키즈 A1-2",
  units: [
    { n: 3, title: "수와 숫자의 탄생", emoji: "🔢", color: "#2fb67c", sessions: [
      { id: "a12-u3-s1", label: "1차시", pages: "54~57쪽", ready: true },
      { id: "a12-u3-s2", label: "2차시", pages: "58~63쪽", ready: true },
      { id: "a12-u3-s3", label: "3차시", pages: "64~74쪽", ready: true }
    ] },
    { n: 4, title: "큰 수, 작은 수", emoji: "🍭", color: "#f0663e", sessions: [
      { id: "a12-u4-s1", label: "1차시", pages: "78~84쪽", ready: true },
      { id: "a12-u4-s2", label: "2차시", pages: "85~88쪽", ready: true },
      { id: "a12-u4-s3", label: "3차시", pages: "89~96쪽", ready: true }
    ] }
  ]
};

// 레이키즈 A1-3 구성 — 원본 차례(4쪽)와 같은 순서. 단원마다 2차시(설계서 2절).
//  1단원은 분량이 많아 3차시(8~13 · 14~18 · 19~26)로, 2단원도 3차시(30~37 · 38~43 · 44~48)로 나눴다.
//  ready: 화면이 만들어진 차시. 나머지는 「곧 열려요」.
//  steps: 차시 안의 순서. 실제 화면은 lessons/<id>.js 가 만든다.
export const BOOK = {
  id: "a1-3",
  short: "A1-3",
  title: "레이키즈 A1-3",
  units: [
    { n: 1, title: "길이 재기", emoji: "📏", color: "#ffb020", sessions: [
      { id: "u1-s1", label: "1차시", pages: "8~13쪽", ready: true },
      { id: "u1-s2", label: "2차시", pages: "14~18쪽", ready: true },
      { id: "u1-s3", label: "3차시", pages: "19~26쪽", ready: true }
    ] },
    { n: 2, title: "무게 재기", emoji: "⚖️", color: "#ff5d8f", sessions: [
      { id: "u2-s1", label: "1차시", pages: "30~37쪽", ready: true },
      { id: "u2-s2", label: "2차시", pages: "38~43쪽", ready: true },
      { id: "u2-s3", label: "3차시", pages: "44~48쪽", ready: true }
    ] },
    { n: 3, title: "미로 찾기", emoji: "🏰", color: "#2f7de1", sessions: [
      { id: "u3-s1", label: "1차시", pages: "52~60쪽", ready: true },
      { id: "u3-s2", label: "2차시", pages: "61~74쪽", ready: true }
    ] },
    { n: 4, title: "스도쿠와 매트릭스", emoji: "🍬", color: "#8f63e6", sessions: [
      { id: "u4-s1", label: "1차시", pages: "78~85쪽", ready: true },
      { id: "u4-s2", label: "2차시", pages: "86~98쪽", ready: true }
    ] }
  ]
};
export const BOOKS = [BOOK_A12, BOOK];
export const findBook = (id) => BOOKS.find((b) => b.id === id) || null;
export const findSession = (id) => {
  for (const book of BOOKS) for (const unit of book.units) { const s = unit.sessions.find((x) => x.id === id); if (s) return { book, unit, session: s }; }
  return null;
};
