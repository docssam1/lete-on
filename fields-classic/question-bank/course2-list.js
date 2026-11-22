// 2과정 권 목록(기하 G1~G5 · 대수 A) — 권마다 그림으로 따져 보기·직접 해 보기·권별 테스트를 모은 카드 HTML.
// 2과정 첫 화면(course2.html)과 사고력 문제은행의 「2과정」 탭(similar.html?course=2, 원장 2026-11-15 「문제은행 안에 들어가면 1과정 2과정 3과정」)이 같이 쓴다.
import { COURSE2_TESTS } from "./course2-test-originals/index.js?v=20261115f";
import { COURSE3_TESTS } from "./course3-test-originals/index.js?v=20261115d";
export const COURSE2_BOOKS = [
  { id: "g1", name: "G1", title: "돌리기와 뒤집기" },
  { id: "g2", name: "G2", title: "도형분할과 넓이" },
  { id: "g3", name: "G3", title: "정육면체와 각·넓이" },
  { id: "g4", name: "G4", title: "도형의 복원과 측정" },
  { id: "g5", name: "G5", title: "도형의 넓이와 비" },
];
// 대수: 지금은 권별 테스트만 있다(그림 논증은 기하부터). 제목은 시험지 파일(meta.title)이 있으면 그것을 쓴다.
const ALGEBRA = [{ id: "a1", name: "A1", title: "양팔저울과 규칙찾기" }, { id: "a2", name: "A2", title: "복제수와 님게임" }, { id: "a3", name: "A3", title: "규칙성과 수열" }, { id: "a4", name: "A4", title: "마방진, 복면산과 비" }, { id: "a5", name: "A5", title: "소인수분해와 비" }];
// 3과정(원장 2026-11-15 「다른 과정 권별은 폴더에 있잖아」): 지금은 권별 테스트만
const COURSE3 = [["a1", "A1", "나머지정리와 지렛대의 원리"], ["a2", "A2", "순환소수와 수직선좌표"], ["a3", "A3", "농도와 속력"], ["a4", "A4", "하노이탑과 직선의 방정식"],
  ["g1", "G1", "합동과 닮음"], ["g2", "G2", "원과 사이클로이드"], ["g3", "G3", "정다면체와 피타고라스의 정리"], ["g4", "G4", "넓이분할과 도형의 변환"]].map(([id, name, title]) => ({ id, name, title }));
// 체험(점수 없이 직접 해 보기): 권 → [단원 이름(논증의 unit과 같게), 도구, 이름]
const LABS = {
  g1: [["3단원 · 360도와 정다각형", "angles", "각 떼어 모으기"], ["3단원 · 360도와 정다각형", "clock", "시계 바늘 각"], ["4단원 · 삼각형과 사각형", "dots", "점판 위 정사각형"]],
  g4: [["1단원 · 특수각과 도형의 복원", "compass", "컴퍼스로 작도"]],
};
const PROOF_TAG = "20261115g";
const STUDY_BOOKS = new Set(["g1", "g2", "g3", "g4"]);   // source-data.js COURSE2_CURRICULUM에 본책이 있는 권
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const testLink = (id, course = 2) => ((course === 3 ? COURSE3_TESTS : COURSE2_TESTS)[id] ? `<a class="c2-test" href="./course2-test-paper.html?${course === 3 ? "course=3&" : ""}book=${id}">권별 테스트 풀기</a>` : `<span class="c2-test is-off">권별 테스트 준비 중</span>`);
// 시험지 파일의 meta.title(본책 제목) — 등록된 권만 읽는다
async function testTitle(id, course = 2) {
  const tag = (course === 3 ? COURSE3_TESTS : COURSE2_TESTS)[id];
  if (!tag) return "";
  try { return (await import(`./course${course}-test-originals/${id}.js?v=${tag}`)).meta?.title || ""; } catch { return ""; }
}
const testCard = async (b, course, alg) => {
  const title = (await testTitle(b.id, course)) || b.title;
  return `<section class="c2-book"><header><span class="c2-name${alg ? " is-alg" : ""}">${b.name}</span><h2>${esc(title)}</h2>${testLink(b.id, course)}</header><p class="c2-empty">${course === 3 ? "3과정은" : "대수 권은"} 권별 테스트부터 열었어요.</p></section>`;
};
export async function course3Html() {
  const cards = await Promise.all(COURSE3.map((b) => testCard(b, 3, b.id[0] === "a")));
  return `<h3 class="c2-group">대수 · A</h3>${cards.slice(0, 4).join("")}<h3 class="c2-group">기하 · G</h3>${cards.slice(4).join("")}`;
}

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
    // 본책을 1과정처럼 옮긴 권(원장 2026-11-16, G1 시범): 차시 공부(시작 화면 → 차시 덱 · 차시 교재 인쇄)로 가는 길
    const study = STUDY_BOOKS.has(b.id) ? `<a class="c2-test is-study" href="./start.html?course=2&book=course-02-${b.id}">차시 공부</a>` : "";
    return `<section class="c2-book"><header><span class="c2-name">${b.name}</span><h2>${esc(b.title)}</h2>${study}${testLink(b.id)}</header>${rows ? `<ol class="c2-units">${rows}</ol>` : `<p class="c2-empty">그림으로 따져 보기를 준비하고 있어요.</p>`}</section>`;
  }));
  const alg = algebra ? (await Promise.all(ALGEBRA.map((b) => testCard(b, 2, true)))).join("") : "";
  return `<h3 class="c2-group">기하 · G</h3>${cards.join("")}${alg ? `<h3 class="c2-group">대수 · A</h3>${alg}` : ""}`;
}
