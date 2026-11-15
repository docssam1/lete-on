// 2과정 기하 첫 화면. 권마다 course2-proofs/<권>.js(그림 논증)·체험(c2-lab)·권별 테스트(course2-test-originals/index.js)를 모아 보여 준다.
import { COURSE2_TESTS } from "./course2-test-originals/index.js?v=20261115c";
const BOOKS = [
  { id: "g1", name: "G1", title: "돌리기와 뒤집기" },
  { id: "g2", name: "G2", title: "도형분할과 넓이" },
  { id: "g3", name: "G3", title: "정육면체와 각·넓이" },
  { id: "g4", name: "G4", title: "도형의 복원과 측정" },
  { id: "g5", name: "G5", title: "도형의 넓이와 비" },
];
// 체험(점수 없이 직접 해 보기): 권 → [단원 이름(논증의 unit과 같게), 도구, 이름]
const LABS = {
  g1: [["3단원 · 360도와 정다각형", "angles", "각 떼어 모으기"], ["3단원 · 360도와 정다각형", "clock", "시계 바늘 각"], ["4단원 · 삼각형과 사각형", "dots", "점판 위 정사각형"]],
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const host = document.getElementById("books");
const cards = await Promise.all(BOOKS.map(async (b) => {
  let proofs = [];
  try { proofs = (await import(`./course2-proofs/${b.id}.js?v=20261115c`)).PROOFS || []; } catch { proofs = []; }
  const units = [...new Set(proofs.map((p) => p.unit))];
  const labs = LABS[b.id] || [];
  const rows = units.map((u) => {
    const ps = proofs.filter((p) => p.unit === u);
    const lab = labs.filter((l) => l[0] === u);
    return `<li><span class="c2-unit">${esc(u)}</span><div class="c2-chips">${ps.map((p) => `<a class="c2-chip is-proof" href="./proof.html?book=${b.id}&id=${p.id}">${esc(p.title)}</a>`).join("")}${lab.map((l) => `<a class="c2-chip is-lab" href="./c2-lab.html?tool=${l[1]}">직접 해 보기 · ${esc(l[2])}</a>`).join("")}</div></li>`;
  }).join("");
  const test = COURSE2_TESTS[b.id] ? `<a class="c2-test" href="./course2-test-paper.html?book=${b.id}">권별 테스트 풀기</a>` : `<span class="c2-test is-off">권별 테스트 준비 중</span>`;
  return `<section class="c2-book"><header><span class="c2-name">${b.name}</span><h2>${esc(b.title)}</h2>${test}</header>${rows ? `<ol class="c2-units">${rows}</ol>` : `<p class="c2-empty">그림으로 따져 보기를 준비하고 있어요.</p>`}</section>`;
}));
host.innerHTML = cards.join("");
