// 2과정 권 목록(기하 G1~G5 · 대수 A) — 권마다 그림으로 따져 보기·직접 해 보기·권별 테스트를 모은 카드 HTML.
// 2과정 첫 화면(course2.html)과 사고력 문제은행의 「2과정」 탭(similar.html?course=2, 원장 2026-11-15 「문제은행 안에 들어가면 1과정 2과정 3과정」)이 같이 쓴다.
import { COURSE2_TESTS } from "./course2-test-originals/index.js?v=20261115c";
export const COURSE2_BOOKS = [
  { id: "g1", name: "G1", title: "돌리기와 뒤집기" },
  { id: "g2", name: "G2", title: "도형분할과 넓이" },
  { id: "g3", name: "G3", title: "정육면체와 각·넓이" },
  { id: "g4", name: "G4", title: "도형의 복원과 측정" },
  { id: "g5", name: "G5", title: "도형의 넓이와 비" },
];
// 대수: 지금은 권별 테스트만 있다(그림 논증은 기하부터)
const ALGEBRA = [{ id: "a5", name: "A5", title: "소인수분해와 비" }];
// 체험(점수 없이 직접 해 보기): 권 → [단원 이름(논증의 unit과 같게), 도구, 이름]
const LABS = {
  g1: [["3단원 · 360도와 정다각형", "angles", "각 떼어 모으기"], ["3단원 · 360도와 정다각형", "clock", "시계 바늘 각"], ["4단원 · 삼각형과 사각형", "dots", "점판 위 정사각형"]],
};
const PROOF_TAG = "20261115c";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const testLink = (id) => (COURSE2_TESTS[id] ? `<a class="c2-test" href="./course2-test-paper.html?book=${id}">권별 테스트 풀기</a>` : `<span class="c2-test is-off">권별 테스트 준비 중</span>`);

export async function course2Html({ algebra = true } = {}) {
  const cards = await Promise.all(COURSE2_BOOKS.map(async (b) => {
    let proofs = [];
    try { proofs = (await import(`./course2-proofs/${b.id}.js?v=${PROOF_TAG}`)).PROOFS || []; } catch { proofs = []; }
    const units = [...new Set(proofs.map((p) => p.unit))];
    const labs = LABS[b.id] || [];
    const rows = units.map((u) => {
      const ps = proofs.filter((p) => p.unit === u);
      const lab = labs.filter((l) => l[0] === u);
      return `<li><span class="c2-unit">${esc(u)}</span><div class="c2-chips">${ps.map((p) => `<a class="c2-chip is-proof" href="./proof.html?book=${b.id}&id=${p.id}">${esc(p.title)}</a>`).join("")}${lab.map((l) => `<a class="c2-chip is-lab" href="./c2-lab.html?tool=${l[1]}">직접 해 보기 · ${esc(l[2])}</a>`).join("")}</div></li>`;
    }).join("");
    return `<section class="c2-book"><header><span class="c2-name">${b.name}</span><h2>${esc(b.title)}</h2>${testLink(b.id)}</header>${rows ? `<ol class="c2-units">${rows}</ol>` : `<p class="c2-empty">그림으로 따져 보기를 준비하고 있어요.</p>`}</section>`;
  }));
  const alg = algebra ? ALGEBRA.map((b) => `<section class="c2-book"><header><span class="c2-name is-alg">${b.name}</span><h2>${esc(b.title)}</h2>${testLink(b.id)}</header><p class="c2-empty">대수 권은 권별 테스트부터 열었어요.</p></section>`).join("") : "";
  return `<h3 class="c2-group">기하 · G</h3>${cards.join("")}${alg ? `<h3 class="c2-group">대수 · A</h3>${alg}` : ""}`;
}
