// 그림으로 따져 보기 화면: proof.html?book=g1&id=triangle-sum (덱 안 &embed=1)
// 권마다 논증은 course2-proofs/<권>.js 의 PROOFS(배열). 권을 더하면 아래 BOOKS에 한 줄.
import { mountProof } from "./proof-board.js?v=20261115c";
const BOOKS = {
  g1: { name: "G1", title: "돌리기와 뒤집기", v: "20261124a" },
  g2: { name: "G2", title: "도형분할과 넓이", v: "20261124a" },
  g3: { name: "G3", title: "정육면체와 각·넓이", v: "20261124a" },
  g4: { name: "G4", title: "도형의 복원과 측정", v: "20261124a" },
  g5: { name: "G5", title: "도형의 넓이와 비", v: "20261124a" },
};
const q = new URLSearchParams(location.search);
const book = BOOKS[q.get("book")] ? q.get("book") : "g1";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
if (q.get("embed") === "1") document.body.classList.add("is-embed");
const { name, title, v } = BOOKS[book];
let proofs = [];
try { proofs = (await import(`./course2-proofs/${book}.js?v=${v}`)).PROOFS || []; } catch { proofs = []; }
const tabs = Object.entries(BOOKS).map(([id, b]) => `<a href="?book=${id}"${id === book ? ' aria-current="page"' : ""}>${b.name}</a>`).join("");
if (!proofs.length) {
  document.getElementById("list").innerHTML = `<div class="pr-books">${tabs}</div>`;
  document.getElementById("board").innerHTML = `<p class="pf-say">${esc(name)} 논증은 아직 준비 중이에요.</p>`;
} else {
  const id = proofs.some((p) => p.id === q.get("id")) ? q.get("id") : proofs[0].id;
  const proof = proofs.find((p) => p.id === id);
  document.title = `${proof.title} · 그림으로 따져 보기`;
  document.getElementById("eyebrow").textContent = `2과정 ${name} · ${title}`;
  document.getElementById("title").textContent = proof.title;
  const units = [...new Set(proofs.map((p) => p.unit))];
  document.getElementById("list").innerHTML = `<div class="pr-books">${tabs}</div>` + units.map((u) => `<div class="pr-group"><span>${esc(u)}</span>${proofs.filter((p) => p.unit === u).map((p) => `<a href="?book=${book}&id=${p.id}"${p.id === id ? ' aria-current="page"' : ""}>${esc(p.title)}</a>`).join("")}</div>`).join("");
  mountProof(document.getElementById("board"), proof);
}
