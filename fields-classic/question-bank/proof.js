// 그림으로 따져 보기 화면: proof.html?book=g1&id=triangle-sum (덱 안 &embed=1)
import { mountProof } from "./proof-board.js?v=20261115a";
import { G1_PROOFS } from "./course2-proofs/g1.js?v=20261115a";
const BOOKS = { g1: { name: "G1", title: "돌리기와 뒤집기", proofs: G1_PROOFS } };
const q = new URLSearchParams(location.search);
const book = BOOKS[q.get("book")] ? q.get("book") : "g1";
const { proofs, name, title } = BOOKS[book];
const id = proofs.some((p) => p.id === q.get("id")) ? q.get("id") : proofs[0].id;
if (q.get("embed") === "1") document.body.classList.add("is-embed");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const proof = proofs.find((p) => p.id === id);
document.title = `${proof.title} · 그림으로 따져 보기`;
document.getElementById("eyebrow").textContent = `2과정 ${name} · ${title}`;
document.getElementById("title").textContent = proof.title;
const units = [...new Set(proofs.map((p) => p.unit))];
document.getElementById("list").innerHTML = units.map((u) => `<div class="pr-group"><span>${esc(u)}</span>${proofs.filter((p) => p.unit === u).map((p) => `<a href="?book=${book}&id=${p.id}"${p.id === id ? ' aria-current="page"' : ""}>${esc(p.title)}</a>`).join("")}</div>`).join("");
mountProof(document.getElementById("board"), proof);
