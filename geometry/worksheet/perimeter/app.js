import { icon } from "../../games/shape-transform/ui-icons.js?v=shape-transform-5";
import { COPY } from "./i18n.js?v=perimeter-sheet-1";
import { normalizeCount, normalizeLanguage, initialSelection, orderedDomains, validateBank, chooseEntries, groupPages, comparisonSymbol, staticRenderOptions, COVER_SAMPLE } from "./workbook-core.js?v=perimeter-sheet-1";

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const select = $("#domainSelect"), countInput = $("#countInput"), coverToggle = $("#coverToggle"), answerToggle = $("#answerToggle"), languageSelect = $("#languageSelect"), worksheet = $("#worksheet");
const params = new URLSearchParams(location.search);
let lang = normalizeLanguage(params.get("lang"));
let api, renderer, entries = [];
const diagramScale = 65 / 324;
const readInteger = (name, fallback) => /^\d{1,10}$/.test(params.get(name) || "") ? Number(params.get(name)) >>> 0 : fallback;
const seed = readInteger("seed", crypto.getRandomValues(new Uint32Array(1))[0]);
let round = readInteger("round", 0);
const t = () => COPY[lang];
$("#backLink").innerHTML = icon("back");
$("#refreshButton").innerHTML = icon("retry");
$("#retryButton").addEventListener("click", () => location.reload());

function localize() {
  const copy = t(), current = select.value;
  document.documentElement.lang = lang;
  document.title = `${copy.title} | ${copy.brand}`;
  document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy[node.dataset.copy]; });
  for (const [id, key] of [["backLink", "back"], ["refreshButton", "refresh"], ["printButton", "print"]]) {
    $(`#${id}`).title = copy[key];
    $(`#${id}`).setAttribute("aria-label", copy[key]);
  }
  worksheet.setAttribute("aria-label", `${copy.title} ${copy.worksheet}`);
  $("#retryButton").textContent = copy.retry;
  $("#loadMessage").textContent = copy.loading;
  languageSelect.value = lang;
  if (api) {
    select.innerHTML = `<option value="all">${escape(copy.all)}</option>` + orderedDomains(api.domains).map((d) => `<option value="${escape(d.id)}">${d.level}. ${escape(d.names[lang])}</option>`).join("");
    select.value = current || "all";
  }
}

function svgRoot(problem, language, reveal, layout = "horizontal") {
  const source = renderer.renderProblem(problem, staticRenderOptions(language, reveal, layout));
  const parsed = new DOMParser().parseFromString(source, "image/svg+xml"), root = parsed.documentElement;
  if (root.localName !== "svg" || parsed.querySelector("parsererror")) throw new Error(`Invalid diagram: ${problem.id}`);
  const values = root.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
  if (values?.length !== 4 || !values.every(Number.isFinite) || values[2] <= 0 || values[3] <= 0) throw new Error(`Invalid diagram dimensions: ${problem.id}`);
  return { root, width: values[2], height: values[3] };
}

function diagram(problem, reveal = false, layout = "horizontal") {
  const { root, width, height } = svgRoot(problem, lang, reveal, layout);
  root.setAttribute("preserveAspectRatio", "xMidYMid meet");
  root.style.width = `${width * diagramScale}mm`;
  root.style.height = `${height * diagramScale}mm`;
  root.style.maxWidth = "100%";
  return new XMLSerializer().serializeToString(root);
}

const line = (value = "", extra = "") => `<span class="write-line ${extra}">${escape(value)}</span>`;
const working = () => `<div class="working-lines" aria-label="${escape(t().working)}"><span></span><span></span><span></span></div>`;

function responseMarkup(p, reveal) {
  const copy = t(), solution = reveal ? `<p class="solution">${escape(api.solutionFor(p, lang))}</p>` : "";
  if (p.domain === "build") return `<div class="response drawing-response">${reveal ? `<p class="solution"><strong class="answer-value example-label">${escape(copy.example)}. </strong>${escape(api.solutionFor(p, lang))}</p>` : `<div class="pair-answer-row"><span>B ${escape(copy.perimeter)} ${line()} ${escape(copy.units)}</span><span class="pair-working" aria-label="${escape(copy.working)}"></span></div>`}</div>`;
  if (p.domain === "compare") return `<div class="response compare-response">${reveal ? `<div class="pair-answer-row"><span class="compare-answer"><b>A</b>${line(comparisonSymbol(api.answerFor(p)), "answer-value")}<b>B</b></span>${solution}</div>` : `<div class="pair-answer-row"><span>A ${escape(copy.perimeter)} ${line()} ${escape(copy.units)}</span><span>B ${escape(copy.perimeter)} ${line()} ${escape(copy.units)}</span><span class="compare-answer"><b>A</b>${line("", "answer-value")}<b>B</b></span></div><p class="comparison-instruction">${escape(copy.compareGuide)}</p>`}</div>`;
  return `<div class="response"><p class="learning-note">${escape(p.domain === "joined" ? copy.joinedGuide : copy.boundaryGuide)}</p><p class="answer-row">${escape(copy.perimeter)} ${line(reveal ? api.answerFor(p) : "", "answer-value")} ${escape(copy.units)}</p>${solution}${reveal ? "" : `<p class="reason-label">${escape(copy.reason)}</p>${working()}`}</div>`;
}

function problemMarkup(entry, number, reveal) {
  const p = entry.problem;
  const paired = ["compare", "build"].includes(p.domain);
  const visual = paired ? `<div class="diagram diagram-pair"><div class="diagram-wide">${diagram(p, reveal)}</div><div class="diagram-narrow">${diagram(p, reveal, "vertical")}</div></div>` : `<div class="diagram">${diagram(p, reveal)}</div>`;
  return `<article class="problem ${escape(p.domain)}-problem" id="question-${escape(p.id)}" data-problem-id="${escape(p.id)}" data-domain="${escape(p.domain)}"><header class="problem-heading"><b class="problem-number">${number}.</b><p class="problem-prompt">${escape(api.promptFor(p, lang))}</p></header><div class="problem-body">${visual}${responseMarkup(p, reveal)}</div></article>`;
}

function coverMarkup(pages, reveal) {
  const copy = t(), included = orderedDomains(api.domains).filter((d) => entries.some((e) => e.domain.id === d.id));
  let start = 1;
  const rows = included.map((domain) => {
    const subset = entries.filter((e) => e.domain.id === domain.id), end = start + subset.length - 1;
    const row = `<div class="cover-activity"><small>${String(domain.level).padStart(2, "0")}</small><div class="activity-label"><strong>${escape(domain.names[lang])}</strong><p>${escape(copy.descriptions[domain.id])}</p></div><div class="activity-count"><b>${escape(copy.questions(subset.length))}</b><span>${escape(copy.ranges(start, end))}</span></div></div>`;
    start = end + 1;
    return row;
  }).join("");
  return `<section id="coverSheet" class="book-cover"${coverToggle.checked ? "" : " hidden"}><div class="cover-brand"><strong>GFIELD</strong><span>${escape(copy.subject)}</span></div><div class="cover-copy"><h1>${escape(copy.title)}</h1><h2>${escape(select.value === "all" ? copy.all : included[0].names[lang])}</h2><p>${escape(reveal ? copy.answers : copy.worksheet)} · ${escape(copy.questions(entries.length))} · ${escape(copy.bodyPages(pages.length))}</p></div><div class="cover-concept"><div class="cover-diagram" data-cover-sample="${COVER_SAMPLE.id}">${diagram(COVER_SAMPLE)}</div><div><h3>${escape(copy.sample)}</h3><p class="unit-cue">${escape(copy.unit)}</p><p>${escape(copy.coverUnit)}</p></div></div><div class="cover-contents"><h3>${escape(copy.contents)}</h3>${rows}</div><div class="learner-fit"><strong>${escape(copy.learnerFit)}</strong><p>${escape(copy.criteria)}</p></div><div class="cover-meta"><label>${escape(copy.name)} <span></span></label><label>${escape(copy.date)} <span></span></label></div><footer class="cover-footer"><span>PERIMETER STUDIO</span><b>1 / ${pages.length + 1}</b></footer></section>`;
}

function syncUrl() {
  const url = new URL(location.href);
  url.searchParams.delete("level");
  for (const [key, value] of Object.entries({ domain: select.value, count: entries.length, lang, cover: coverToggle.checked ? 1 : 0, answers: answerToggle.checked ? 1 : 0, seed, round })) url.searchParams.set(key, String(value));
  history.replaceState(null, "", url);
  $("#backLink").href = `../../games/perimeter/?domain=${encodeURIComponent(select.value)}&lang=${lang}`;
}

function render() {
  const pages = groupPages(entries), reveal = answerToggle.checked, copy = t(), coverOffset = Number(coverToggle.checked);
  let number = 1;
  const body = pages.map((page, index) => {
    const domain = page[0].domain;
    return `<section class="sheet" data-domain="${escape(domain.id)}" data-page="${index + 1 + coverOffset}"><header class="sheet-head"><div class="sheet-heading"><small>GFIELD · ${escape(copy.title)} · ${escape(reveal ? copy.answers : copy.worksheet)}</small><h2><span>${String(domain.level).padStart(2, "0")}</span> ${escape(domain.names[lang])}</h2><p class="unit-cue">${escape(copy.unit)}</p></div><div class="name-line">${escape(copy.name)} <span></span></div></header><div class="problem-grid">${page.map((entry) => problemMarkup(entry, number++, reveal)).join("")}</div><footer><span>${escape(copy.descriptions[domain.id])}</span><b>${index + 1 + coverOffset} / ${pages.length + coverOffset}</b></footer></section>`;
  }).join("");
  worksheet.innerHTML = coverMarkup(pages, reveal) + body;
  worksheet.dataset.answerMode = String(reveal);
  worksheet.hidden = false;
  $("#loadState").hidden = true;
  const requested = countInput.dataset.requested;
  const adjusted = requested !== "" && requested !== undefined && Number.isFinite(Number(requested)) && Number(requested) !== entries.length;
  $("#countNotice").textContent = (adjusted ? copy.adjusted(entries.length) : "") + copy.total(entries.length, pages.length + coverOffset);
  $("#countNotice").classList.toggle("capped", adjusted);
  syncUrl();
}

function fail(error, message = t().error) {
  worksheet.hidden = true;
  worksheet.replaceChildren();
  $("#loadState").hidden = false;
  $("#loadState").setAttribute("role", "alert");
  $("#loadMessage").textContent = message;
  $("#retryButton").hidden = false;
  document.querySelectorAll(".maker-settings input, .maker-settings select, .maker-settings button").forEach((control) => { control.disabled = true; });
  document.body.dataset.ready = "error";
  console.warn("Perimeter worksheet unavailable:", error);
}
function safely(action) { try { action(); } catch (error) { fail(error); } }
function newSelection() {
  countInput.dataset.requested = countInput.value;
  const count = normalizeCount(countInput.value, 20, select.value === "all" ? 20 : 10);
  countInput.value = String(count);
  entries = chooseEntries(api, select.value, count, { seed, round });
  render();
}

async function start() {
  localize();
  try {
    api = await import("../../games/perimeter/core.js?v=perimeter-1");
    renderer = await import("../../games/perimeter/render.js?v=perimeter-1");
    validateBank(api);
    if (typeof renderer.renderProblem !== "function") throw new Error("Missing perimeter renderer.");
    localize();
    const initial = initialSelection(params, api.domains);
    if (initial === null) return fail(new Error("Unknown activity"), t().unavailable);
    select.value = initial;
    countInput.value = String(params.get("count") ?? (initial === "all" ? 20 : 10));
    coverToggle.checked = params.get("cover") !== "0";
    answerToggle.checked = params.get("answers") === "1";
    newSelection();
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
    document.querySelectorAll(".maker-settings input, .maker-settings select, .maker-settings button").forEach((control) => { control.disabled = false; });
    select.addEventListener("change", () => safely(() => { round = 0; newSelection(); }));
    countInput.addEventListener("change", () => safely(newSelection));
    coverToggle.addEventListener("change", () => safely(render));
    answerToggle.addEventListener("change", () => safely(render));
    languageSelect.addEventListener("change", () => safely(() => { lang = normalizeLanguage(languageSelect.value); localize(); render(); }));
    $("#refreshButton").addEventListener("click", () => safely(() => { round = (round + 1) >>> 0; newSelection(); }));
    $("#printButton").addEventListener("click", () => window.print());
    document.body.dataset.ready = "true";
  } catch (error) { fail(error); }
}
start();
