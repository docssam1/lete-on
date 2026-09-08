import { icon } from "../../games/shape-transform/ui-icons.js?v=shape-transform-5";
import { COPY } from "./i18n.js?v=circle-sheet-1";
import { normalizeCount, normalizeLanguage, initialSelection, orderedDomains, validateBank, chooseEntries, groupPages, staticRenderOptions, COVER_ID, SVG_WIDTH_MM } from "./workbook-core.js?v=circle-sheet-1";

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const select = $("#domainSelect"), countInput = $("#countInput"), coverToggle = $("#coverToggle"), answerToggle = $("#answerToggle"), languageSelect = $("#languageSelect"), worksheet = $("#worksheet");
const params = new URLSearchParams(location.search);
let lang = normalizeLanguage(params.get("lang")), api, renderer, entries = [];
// 56 SVG units equal 10 mm on A4, independent of screen viewport.
const diagramScale = SVG_WIDTH_MM / 400;
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
function diagram(p, reveal = false) {
  const source = renderer.renderProblem(p, staticRenderOptions(lang, reveal));
  const parsed = new DOMParser().parseFromString(source, "image/svg+xml"), root = parsed.documentElement;
  if (root.localName !== "svg" || parsed.querySelector("parsererror")) throw new Error(`Invalid SVG: ${p.id}`);
  const values = root.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
  if (values?.join(",") !== "0,0,400,400") throw new Error(`Unexpected renderer viewBox: ${p.id}`);
  root.setAttribute("preserveAspectRatio", "xMidYMid meet");
  root.style.width = `${values[2] * diagramScale}mm`;
  root.style.height = `${values[3] * diagramScale}mm`;
  return new XMLSerializer().serializeToString(root);
}
const working = () => `<div class="working-lines" aria-label="${escape(t().working)}"><span></span><span></span></div>`;
function responseMarkup(p, reveal) {
  const copy = t(), solution = reveal ? '<p class="solution">' + escape(api.solutionFor(p, lang)) + '</p>' : '';
  if (p.domain === "parts") {
    const answer = reveal ? api.answerFor(p) : [];
    return '<div class="response"><p>' + escape(copy.select) + '</p><div class="selection-options">' +
      api.optionLabels("parts", lang).map((o) => '<label class="selection-option" data-option-id="' + escape(o.id) + '"><input type="checkbox" aria-label="' + escape(o.label) + '"' + (answer.includes(o.id) ? ' checked' : '') + (reveal ? ' disabled' : '') + ' /><span>' + escape(o.label) + '</span></label>').join("") +
      '</div>' + solution + (reveal ? '' : '<p class="reason-label">' + escape(copy.reason) + '</p>' + working()) + '</div>';
  }
  if (p.domain === "measure") {
    return '<div class="response"><p>' + escape(copy.measure) + ': <span class="numeric-line' + (reveal ? ' answer-value' : '') + '">' + (reveal ? escape(api.answerFor(p)) : '') + '</span> cm</p>' + solution + (reveal ? '' : '<p class="reason-label">' + escape(copy.reason) + '</p>' + working()) + '</div>';
  }
  return '<div class="response">' + (reveal ? solution : '<p>' + escape(p.domain === "draw" ? copy.draw : copy.mark) + '</p>') +
    '<p>' + escape(copy.grid) + '</p>' + (reveal ? '' : '<p class="reason-label">' + escape(copy.reason) + '</p>' + working()) + '</div>';
}
function coverDiagram() {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + escape(t().sample) + '"><circle cx="185" cy="210" r="134" fill="none" stroke="#262b29" stroke-width="3"/><line x1="185" y1="210" x2="319" y2="210" stroke="#3157b2" stroke-width="3"/><circle cx="185" cy="210" r="4" fill="#262b29"/><text x="174" y="240" text-anchor="end" font-size="19" fill="#262b29">O</text><text x="250" y="191" text-anchor="middle" font-size="19" fill="#3157b2">' + escape(t().radius) + '</text><text x="145" y="275" text-anchor="middle" font-size="19" fill="#262b29">' + escape(t().center) + '</text></svg>';
}
function problemMarkup(entry, number, reveal) {
  const p = entry.problem;
  return `<article class="problem ${escape(p.domain)}-problem" id="question-${escape(p.id)}" data-problem-id="${escape(p.id)}" data-domain="${escape(p.domain)}"><header class="problem-heading"><b class="problem-number">${number}.</b><p class="problem-prompt">${escape(api.promptPartsFor(p, lang).question)}</p></header><div class="problem-body"><div class="diagram">${diagram(p, reveal)}</div>${responseMarkup(p, reveal)}</div></article>`;
}
function coverMarkup(pages, reveal) {
  const copy = t(), included = orderedDomains(api.domains).filter((d) => entries.some((e) => e.domain.id === d.id));
  const rows = included.map((d) => `<div class="cover-activity"><small>${String(d.level).padStart(2, "0")}</small><div><strong>${escape(d.names[lang])}</strong><p>${escape(copy.descriptions[d.id])}</p></div><b>${escape(copy.questions(entries.filter((e) => e.domain.id === d.id).length))}</b></div>`).join("");
  return `<section id="coverSheet" class="book-cover"${coverToggle.checked ? "" : " hidden"}><div class="cover-brand"><strong>GFIELD</strong><span>${escape(copy.worksheet)}</span></div><div class="cover-copy"><h1>${escape(copy.title)}</h1><h2>${escape(select.value === "all" ? copy.all : included[0].names[lang])}</h2><p>${escape(reveal ? copy.answers : copy.worksheet)} · ${escape(copy.total(entries.length, pages.length + 1))}</p></div><div class="cover-concept"><div class="cover-diagram" data-cover-sample="${COVER_ID}">${coverDiagram()}</div><div><h3>${escape(copy.sample)}</h3><p>${escape(copy.convention)}</p></div></div><div class="cover-contents"><h3>${escape(copy.contents)}</h3>${rows}</div><div class="learner-fit"><strong>${escape(copy.learnerFit)}</strong><p>${escape(copy.criteria)}</p><p>${escape(copy.enrichment)}</p></div><div class="cover-meta"><label>${escape(copy.name)} <span></span></label><label>${escape(copy.date)} <span></span></label></div><footer class="cover-footer"><span>CIRCLE STUDIO</span><b>1 / ${pages.length + 1}</b></footer></section>`;
}
function syncUrl() {
  const url = new URL(location.href);
  url.searchParams.delete("level");
  for (const [key, value] of Object.entries({ domain: select.value, count: entries.length, lang, cover: +coverToggle.checked, answers: +answerToggle.checked, seed, round })) url.searchParams.set(key, String(value));
  history.replaceState(null, "", url);
  $("#backLink").href = `../../games/circle-studio/?domain=${encodeURIComponent(select.value)}&lang=${lang}`;
}
function render() {
  const pages = groupPages(entries), reveal = answerToggle.checked, copy = t(), offset = +coverToggle.checked;
  let number = 1;
  worksheet.innerHTML = coverMarkup(pages, reveal) + pages.map((page, index) => {
    const domain = page[0].domain;
    const conditions = [...new Set(page.flatMap((e) => api.promptPartsFor(e.problem, lang).conditions))];
    return `<section class="sheet" data-domain="${domain.id}" data-page="${index + 1 + offset}"><header class="sheet-head"><div class="sheet-heading"><small>GFIELD · ${escape(copy.title)} · ${escape(reveal ? copy.answers : copy.worksheet)}</small><h2><span>${String(domain.level).padStart(2, "0")}</span> ${escape(domain.names[lang])}</h2>${conditions.map((s) => `<p class="convention">${escape(s)}</p>`).join("")}</div><div class="name-line">${escape(copy.name)} <span></span></div></header><div class="problem-grid">${page.map((entry) => problemMarkup(entry, number++, reveal)).join("")}</div><footer><span>${escape(domain.id === "center" || domain.id === "draw" ? copy.printScale : copy.descriptions[domain.id])}</span><b>${index + 1 + offset} / ${pages.length + offset}</b></footer></section>`;
  }).join("");
  worksheet.dataset.answerMode = String(reveal);
  worksheet.hidden = false;
  $("#loadState").hidden = true;
  $("#countNotice").textContent = copy.total(entries.length, pages.length + offset);
  syncUrl();
}
function fail(error, message = t().error) {
  worksheet.hidden = true;
  worksheet.replaceChildren();
  $("#loadState").hidden = false;
  $("#loadState").setAttribute("role", "alert");
  $("#loadMessage").textContent = message;
  $("#retryButton").hidden = false;
  document.querySelectorAll(".maker-settings input, .maker-settings select, .maker-settings button").forEach((c) => { c.disabled = true; });
  document.body.dataset.ready = "error";
  console.warn("Circle worksheet unavailable:", error);
}
function safely(action) { try { action(); } catch (error) { fail(error); } }
function newSelection() {
  countInput.value = String(normalizeCount(countInput.value));
  entries = chooseEntries(api, select.value, countInput.value, { seed, round });
  render();
}
async function start() {
  localize();
  try {
    api = await import("../../games/circle-studio/core.js?v=circle-1");
    renderer = await import("../../games/circle-studio/render.js?v=circle-1");
    validateBank(api);
    if (typeof renderer.renderProblem !== "function") throw new Error("Missing renderer");
    localize();
    const initial = initialSelection(params, api.domains);
    if (initial === null) return fail(new Error("Unknown activity"), t().unavailable);
    select.value = initial;
    countInput.value = String(params.get("count") ?? 20);
    coverToggle.checked = params.get("cover") !== "0";
    answerToggle.checked = params.get("answers") === "1";
    newSelection();
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
    document.querySelectorAll(".maker-settings input, .maker-settings select, .maker-settings button").forEach((c) => { c.disabled = false; });
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
