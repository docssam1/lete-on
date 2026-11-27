// 2과정 차시 덱의 「그림으로 따져 보기」와 「직접 해 보기」 — study.js의 덱 안 장(native)으로 붙인다(원장 2026-11-16 「1과정에 비해 너무 조잡스러워 … 흐름도 달라」).
// 1과정 차시 = 개념 판서 → 게임 → 워밍업 → 본책. 2과정은 워밍업 자료(골든벨 원본)가 없으므로 개념 판서 자리에 그림 논증, 게임 자리에 체험을 둔다.
// 차시마다 무엇을 보여 줄지는 아래 SESSION_CONCEPTS(본책 활동 묶음과 같은 내용으로 골랐다). 논증 그림은 course2-proofs/<권>.js, 체험은 c2-lab.html.
import { mountProof } from "./proof-board.js?v=20261115c";
import { STUDY_BOARDS, STUDY_GAMES } from "./study-map.js?v=20261127b";
import { BOARDS } from "./concept-boards.js?v=20261125k";
import { packsFor } from "./course2-concepts/packs.js?v=20261125k";

const PROOF_TAGS = { g1: "20261124a", g2: "20261124a", g3: "20261124a", g4: "20261124j", g5: "20261124a" };   // proof.js의 BOOKS 꼬리표와 같게
const DECK = { module: "./course2-deck.js?v=20261127b" };

// 권/단원 → 차시마다 [["board", 1과정 판서 열쇠] | ["drill", 열쇠, 이름] | ["proof", 논증 id, 제목] | ["lab", 도구, 이름] | ["geo", 지오메트리 게임 주소, 이름]]
// board: 1과정에서 같은 내용을 가르치는 손글씨 판서와 그 판서의 게임을 그대로 쓴다(원장 2026-11-16 「설명도 없어」) — 2과정 본책 문제가 그 위에 쌓인다.
// geo: 지오메트리 게임(원장 2026-11-16 「지오메트리의 색종이 게임 이상의 질이 나와야 돼」)
export const SESSION_CONCEPTS = Object.freeze({
  "course-02-g1/0": [
    // 1차시 = 거꾸로 해결하기(원장 2026-11-16 「색종이 접기는 거꾸로 해결하기인 거 알지?」): 접어 자르기 → 종이가 모인 칸 찾기 → 접는 방법 거꾸로 찾기 게임 → 왜 대칭인지 → 구멍 세기
    [["board", "book-04/fold-cut-source"], ["board", "book-04/fold-position-source"], ["drill", "fold-region", "접힌 부분 위치 찾기"], ["geo", "../../geometry/games/paper-fold/index.html?level=3", "접는 방법 거꾸로 찾기 게임"],
      ["proof", "fold-cut-symmetry", "접어서 자르면 펼친 모양이 왜 대칭일까"], ["board", "book-04/fold-hole-count"]],
    [["board", "book-01/mirror-reflection"], ["board", "book-04/digital-flip-source"]],
    [["board", "book-07/elapsed-time"], ["proof", "mirror-clock", "거울에 비친 시계로 진짜 시각을 왜 알 수 있을까"], ["lab", "clock", "시계 바늘 각"]]
  ],
  "course-02-g1/1": [
    [["board", "book-04/flip-rotate-source"], ["proof", "two-flips-half-turn", "두 번 뒤집으면 왜 반 바퀴 돌린 것과 같을까"]],
    [["board", "book-01/digital-turn-flip"]]
  ],
  "course-02-g1/2": [
    [["proof", "triangle-sum", "삼각형의 세 각을 모으면 왜 180°일까"], ["lab", "angles", "각 떼어 모으기"], ["proof", "isosceles-base", "이등변삼각형의 두 밑각은 왜 같을까"],
      ["proof", "regular-interior", "정다각형의 한 내각은 어떻게 구할까"], ["proof", "exterior-sum", "다각형의 외각을 모두 더하면 왜 360°일까"], ["proof", "clock-angle", "시계 두 바늘 사이의 각 따지기"]],
    [["proof", "circle-midpoints", "가운데 점을 이은 도형의 한 변은 왜 반지름과 같을까"], ["proof", "two-circles-triangle", "두 원으로 만든 삼각형은 왜 정삼각형일까"]]
  ],
  "course-02-g1/3": [
    [],
    [["proof", "tilted-square", "점판 위 기울어진 사각형은 왜 정사각형일까"], ["lab", "dots", "점판 위 정사각형"]]
  ]
});

const shortBook = (bookId) => bookId.replace(/^course-0\d-/u, "");
// 덱 장 목록(study-deck.js buildSessionSlides가 부른다): 논증 = 개념 장(판서처럼 덱 아래 단추로 장면을 넘긴다), 체험 = 게임 장
// 개념 꾸러미(DESIGN-COURSE2.md 4절)가 있는 차시는 꾸러미마다 여섯 장: 되짚기 → 해 보기 → 따져 보기 → 정리 → 예제 따라 풀기 → 개념 확인
const PACK = { module: "./course2-pack.js?v=20261124c", css: "./course2-pack.css?v=20261123a", mount: "mountPackCard", presenter: false, doneSay: null };
const packCard = (book, pack, card, label) => ({ kind: "concept", pack: card, lesson: { id: `${pack.id}-${card}`, title: `${label} · ${pack.title}` }, native: { ...PACK, board: `${book}/${pack.id}/${card}` } });
export function course2ConceptSlides(bookId, unitIndex, part) {
  const packs = packsFor(bookId, unitIndex, part);
  const book = shortBook(bookId);
  if (packs.length) return packs.flatMap((pack) => [
    packCard(book, pack, "recall", "되짚기"),
    ...itemSlides(bookId, book, pack.explore || []),
    ...itemSlides(bookId, book, (pack.proofs || []).map(([id, title]) => ["proof", id, title])),
    packCard(book, pack, "summary", "정리"),
    packCard(book, pack, "example", "예제 따라 풀기"),
    { kind: "check", pack: "check", title: `개념 확인 · ${pack.title}`, lesson: { id: `${pack.id}-check`, title: pack.title }, check: pack.check }
  ]);
  return itemSlides(bookId, book, SESSION_CONCEPTS[`${bookId}/${unitIndex}`]?.[part - 1] || []);
}
function itemSlides(bookId, book, items) {
  return items.flatMap(([kind, id, title]) => {
    if (kind === "board") {
      const [fromBook, lessonId] = id.split("/");
      const lesson = { id: lessonId, title: BOARDS[id]?.title || "개념", bookId: fromBook };
      const games = (STUDY_GAMES[id] || []).map((game) => ({ kind: "game", lesson, native: game, title: game.title }));
      return [{ kind: "concept", lesson, native: { ...STUDY_BOARDS[id], board: id } }, ...games];
    }
    // drill: 이 권의 연습 게임(drill-recipes.js의 「권/열쇠」) — 2과정 유형으로 연습·실전·도전
    if (kind === "drill") {
      const lesson = { id, title, bookId };
      return (STUDY_GAMES[`${bookId}/${id}`] || []).map((game) => ({ kind: "game", lesson, native: game, title: `${title} 게임` }));
    }
    if (kind === "proof") return [{ kind: "concept", lesson: { id, title }, native: { ...DECK, css: "./proof.css?v=20261115c", mount: "mountDeckProof", board: `${book}/${id}`, presenter: false, doneSay: null } }];
    if (kind === "geo") return [{ kind: "game", lesson: { id: `geo-${title}`, title }, title, native: { ...DECK, css: "./course2-deck.css?v=20261116a", mount: "mountDeckLab", tool: "geo", src: id, doneSay: null } }];
    return [{ kind: "game", lesson: { id: `lab-${id}`, title }, title: `${title} 체험`, native: { ...DECK, css: "./course2-deck.css?v=20261116a", mount: "mountDeckLab", tool: id, doneSay: null } }];
  });
}

// 덱 안 그림 논증: proof-board의 mountProof를 그대로 쓴다(덱 아래 「다음 장면 →」이 step을 부른다)
export function mountDeckProof(host, { board, deckNav = true, atEnd = false, onStep = () => {}, onDone = () => {} } = {}) {
  const [book, id] = String(board || "").split("/");
  let inner = null, gone = false;
  host.innerHTML = '<p class="sd-wait">그림을 준비하고 있어요…</p>';
  import(`./course2-proofs/${book}.js?v=${PROOF_TAGS[book] || "20261115a"}`).then((mod) => {
    if (gone) return;
    const proof = (mod.PROOFS || []).find((entry) => entry.id === id);
    if (!proof) { host.innerHTML = '<p class="sd-wait">그림을 찾지 못했어요.</p>'; return; }
    inner = mountProof(host, proof, { deckNav, atEnd, onStep, onDone });
    onStep();
  }).catch(() => { if (!gone) host.innerHTML = '<p class="sd-wait">불러오지 못했어요. 새로고침해 주세요.</p>'; });
  return {
    step: (dir) => inner ? inner.step(dir) : false,
    hasNext: () => inner ? inner.hasNext() : false,
    hasPrev: () => inner ? inner.hasPrev() : false,
    dispose() { gone = true; inner?.dispose(); }
  };
}

// 덱 안 체험: c2-lab.html을 머리줄 없이(&embed=1) 창으로 연다. 점수가 없으니 다 하면 「다음」으로 넘어간다.
export function mountDeckLab(host, { tool = "angles", src = "" } = {}) {
  const url = src ? `${src}${src.includes("?") ? "&" : "?"}embed=1` : `./c2-lab.html?tool=${encodeURIComponent(tool)}&embed=1`;
  host.innerHTML = `<iframe class="c2-deck-lab" title="체험" src="${url}"></iframe>`;
  return { dispose() {} };
}
