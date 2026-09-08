import { icon } from "../../games/shape-transform/ui-icons.js?v=shape-transform-5";
import { normalizeCount, initialSelection, validateBank, chooseEntries, groupPages, entryHeight, answerText, answerUnit } from "./workbook-core.js?v=angle-sheet-1";

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const select = $("#domainSelect"), countInput = $("#countInput"), coverToggle = $("#coverToggle"), answerToggle = $("#answerToggle");
const worksheet = $("#worksheet");
const seed = crypto.getRandomValues(new Uint32Array(1))[0];
let api, renderer, entries = [], round = 0;
const descriptions = {
  estimate: "각의 벌어진 정도를 어림하고 실제 각도와 비교해 봅시다.",
  "right-angle": "주어진 OA를 한 변으로 하여 점 O에서 직각을 만들어 봅시다.",
  polygon: "다각형의 꼭짓점과 각을 살펴보고 물음에 답해 봅시다.",
  parallel: "평행 조건을 확인하고 각 사이의 관계를 알아봅시다."
};

$("#backLink").innerHTML = icon("back");
$("#refreshButton").innerHTML = icon("retry");
$("#retryButton").addEventListener("click", () => location.reload());

function diagram(problem, reveal = false) {
  const point = reveal && problem.unit === "point" ? api.answerFor(problem)[0] : null;
  const svg = renderer.renderProblem(problem, { reveal, lang: "ko", point, interactive: false });
  const document = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = document.documentElement;
  if (root.localName !== "svg" || document.querySelector("parsererror")) throw new Error(`Invalid diagram: ${problem.id}`);
  // Preserve one coordinate scale on both axes, including when printed.
  root.setAttribute("preserveAspectRatio", "xMidYMid meet");
  root.style.width = "100%";
  root.style.height = "100%";
  root.style.maxWidth = "none";
  return new XMLSerializer().serializeToString(root);
}

function responseMarkup(p, reveal) {
  if (p.domain === "estimate") {
    return `<div class="response estimate-response"><p>어림한 각도 <span class="write-line"></span>°</p><p>실제 각도 <span class="write-line">${reveal ? escape(api.answerFor(p)) : ""}</span>°</p><p class="compare-note">두 각도의 차이 <span class="write-line"></span>°</p>${reveal ? `<p class="solution">${escape(api.solutionFor(p, "ko"))}</p><p class="learning-note">어림한 값과 실제 각도를 비교해 보세요.</p>` : `<p class="learning-note">직각은 90°입니다.</p>`}</div>`;
  }
  if (p.unit === "point") {
    return `<div class="response drawing-response">${reveal ? `<strong class="answer-value">예시 답안</strong><p class="solution">${escape(api.solutionFor(p, "ko"))}</p><p class="learning-note">OA와 직각을 이루는 다른 OB도 답이 됩니다.</p>` : `<p class="drawing-task">점 B를 정하고 OB를 그리세요.</p><p class="learning-note">OA와 OB가 점 O에서 직각으로 만나게 하세요.</p>`}</div>`;
  }
  return `<div class="response"><p class="answer-row">답 <span class="write-line answer-value">${reveal ? escape(answerText(p, api.answerFor(p))) : ""}</span>${reveal ? "" : escape(answerUnit(p))}</p>${reveal ? `<p class="solution">${escape(api.solutionFor(p, "ko"))}</p>` : `<div class="working-lines" aria-label="풀이를 쓰는 공간"><span></span><span></span><span></span></div>`}</div>`;
}

function problemMarkup(entry, number, reveal) {
  const p = entry.problem;
  return `<article class="problem ${p.unit === "point" ? "drawing-problem" : ""}" data-problem-id="${escape(p.id)}" data-domain="${escape(p.domain)}" data-unit="${escape(p.unit)}"><header class="problem-heading"><b class="problem-number">${number}.</b><p class="problem-prompt">${escape(api.promptFor(p, "ko"))}</p></header><div class="problem-body"><div class="diagram">${diagram(p, reveal)}</div>${responseMarkup(p, reveal)}</div></article>`;
}

function coverMarkup(pages, reveal) {
  const included = api.domains.filter((d) => entries.some((e) => e.domain.id === d.id));
  const title = select.value === "all" ? "활동별 모음" : included[0].names.ko;
  const rows = included.map((domain) => {
    const subset = entries.filter((e) => e.domain.id === domain.id);
    return `<div class="cover-activity"><div class="activity-label"><small>${String(domain.level).padStart(2, "0")}</small><strong>${escape(domain.names.ko)}</strong><p>${escape(descriptions[domain.id] || "")}</p></div><span class="activity-count">${subset.length}문항</span><div class="cover-diagram">${diagram(subset[0].problem)}</div></div>`;
  }).join("");
  return `<section id="coverSheet" class="book-cover"${coverToggle.checked ? "" : " hidden"}><span class="page-watermark" aria-hidden="true">GFIELD</span><div class="cover-brand"><strong>GFIELD</strong><span>수학 · 도형 탐구</span></div><div class="cover-copy"><h1>각도 탐구</h1><h2>${escape(title)}</h2><p>${reveal ? "정답·풀이" : "학습지"} · ${entries.length}문항 · 본문 ${pages.length}쪽</p></div><div class="cover-contents"><div class="contents-heading"><span>학습 활동</span><span>문항 수</span><span>살펴보기</span></div>${rows}</div><div class="cover-meta"><label>이름 <span></span></label><label>날짜 <span></span></label></div><footer class="cover-footer"><span>각도 스튜디오</span><span>${included.length}개 활동 · ${reveal ? "정답·풀이" : "문제"}</span></footer></section>`;
}

function render() {
  const pages = groupPages(entries), reveal = answerToggle.checked;
  let number = 1;
  const body = pages.map((page, index) => {
    const domain = page[0].domain;
    return `<section class="sheet" data-domain="${escape(domain.id)}"><span class="page-watermark" aria-hidden="true">GFIELD</span><header class="sheet-head"><div class="sheet-heading"><small>GFIELD · 각도 탐구${reveal ? " · 정답·풀이" : ""}</small><h2>${escape(domain.names.ko)}</h2><p>${escape(descriptions[domain.id] || "")}</p></div><div class="name-line">이름 <span></span></div></header><div class="problem-grid" style="--row-template:${page.map((entry) => `${entryHeight(entry)}mm`).join(" ")}">${page.map((entry) => problemMarkup(entry, number++, reveal)).join("")}</div><footer><span>${escape(domain.names.ko)}${reveal ? " · 정답·풀이" : ""}</span><b>${index + 1} / ${pages.length}</b></footer></section>`;
  }).join("");
  worksheet.innerHTML = coverMarkup(pages, reveal) + body;
  worksheet.dataset.answerMode = String(reveal);
  worksheet.hidden = false;
  $("#loadState").hidden = true;
  const capped = Number(countInput.dataset.requested) !== entries.length && Number.isFinite(Number(countInput.dataset.requested));
  $("#countNotice").textContent = `${capped ? `${entries.length}문항으로 조정했습니다. ` : ""}${entries.length}문항 · ${pages.length + (coverToggle.checked ? 1 : 0)}쪽${coverToggle.checked ? " (표지 포함)" : ""}`;
  $("#countNotice").classList.toggle("capped", capped);
}

function fail(error, message = "학습 자료를 불러오지 못했습니다. 잠시 후 다시 불러와 주세요.") {
  worksheet.hidden = true;
  worksheet.replaceChildren();
  $("#loadState").hidden = false;
  $("#loadState").setAttribute("role", "alert");
  $("#loadMessage").textContent = message;
  $("#retryButton").hidden = false;
  document.querySelectorAll(".maker-settings input, .maker-settings select, .maker-settings button").forEach((control) => { control.disabled = true; });
  document.body.dataset.ready = "error";
  console.warn("Angle worksheet unavailable:", error);
}

function safely(action) {
  try { action(); } catch (error) { fail(error); }
}

function newSelection() {
  const fallback = select.value === "all" ? 20 : 10;
  countInput.dataset.requested = countInput.value;
  const count = normalizeCount(countInput.value, 20, fallback);
  countInput.value = String(count);
  entries = chooseEntries(api, select.value, count, { seed, round });
  const url = new URL(location.href);
  url.searchParams.delete("level");
  url.searchParams.set("domain", select.value);
  url.searchParams.set("count", String(count));
  history.replaceState(null, "", url);
  $("#backLink").href = `../../games/angle-studio/?domain=${encodeURIComponent(select.value)}`;
  render();
}

async function start() {
  try {
    api = await import("../../games/angle-studio/core.js?v=angle-1");
    renderer = await import("../../games/angle-studio/render.js?v=angle-1");
    validateBank(api);
    if (typeof renderer.renderProblem !== "function") throw new Error("Missing renderer.");
    select.innerHTML = `<option value="all">전체 활동</option>` + api.domains.map((d) => `<option value="${escape(d.id)}">${escape(d.names.ko)}</option>`).join("");
    const params = new URLSearchParams(location.search);
    const initial = initialSelection(params, api.domains);
    if (initial === null) return fail(new Error("Unknown activity"), "선택한 활동은 아직 준비되지 않았습니다.");
    select.value = initial;
    countInput.value = String(normalizeCount(params.get("count"), 20, initial === "all" ? 20 : 10));
    if (params.get("count") !== null) countInput.value = params.get("count");
    newSelection();
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
    document.querySelectorAll(".maker-settings input, .maker-settings select, .maker-settings button").forEach((control) => { control.disabled = false; });
    select.addEventListener("change", () => safely(() => { round = 0; countInput.value = select.value === "all" ? "20" : "10"; newSelection(); }));
    countInput.addEventListener("change", () => safely(newSelection));
    coverToggle.addEventListener("change", () => safely(render));
    answerToggle.addEventListener("change", () => safely(render));
    $("#refreshButton").addEventListener("click", () => safely(() => { round += 1; newSelection(); }));
    $("#printButton").addEventListener("click", () => window.print());
    document.body.dataset.ready = "true";
  } catch (error) { fail(error); }
}

start();
