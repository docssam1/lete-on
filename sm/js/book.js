// 레이키즈 A1-3 구성 — 원본 차례(4쪽)와 같은 순서. 단원마다 2차시(설계서 2절).
//  1단원은 분량이 많아 3차시(8~13 · 14~18 · 19~26)로, 2단원도 3차시(30~37 · 38~43 · 44~48)로 나눴다.
//  ready: 화면이 만들어진 차시. 나머지는 「곧 열려요」.
//  steps: 차시 안의 순서. 실제 화면은 lessons/<id>.js 가 만든다.
export const BOOK = {
  id: "a1-3",
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
      { id: "u4-s1", label: "1차시", pages: "78~85쪽", ready: false },
      { id: "u4-s2", label: "2차시", pages: "86~98쪽", ready: false }
    ] }
  ]
};
export const findSession = (id) => {
  for (const unit of BOOK.units) { const s = unit.sessions.find((x) => x.id === id); if (s) return { unit, session: s }; }
  return null;
};
