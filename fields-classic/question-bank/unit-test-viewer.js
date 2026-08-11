import { CURRICULUM } from "./source-data.js?v=20260812h";

const params = new URLSearchParams(location.search);
const folder = params.get("book") || "book01";
const student = params.get("student") || "DEMO";
const book = CURRICULUM.find((item) => item.id.replace("-", "") === folder) || CURRICULUM[0];
const $ = (id) => document.getElementById(id);

$("title").textContent = `${book.label} 단원 테스트`;
$("subtitle").textContent = `${book.title} · 원문 ${book.source.unitTestQuestionCount}문항`;
$("pages").innerHTML = Array.from({ length: book.source.unitTestPageCount }, (_, index) => {
  const page = String(index + 3).padStart(2, "0");
  return `<figure><img src="./assets/unit-tests/${folder}/page-${page}.png" alt="${book.label} 단원 테스트 ${index + 1}페이지" loading="${index > 1 ? "lazy" : "eager"}" /></figure>`;
}).join("");
$("watermark").innerHTML = Array.from({ length: 3 }, () => `<span>${student} · GFIELD · ${student} · GFIELD · ${student}</span>`).join("");
$("printButton").addEventListener("click", () => window.print());
