import { domains, problemsFor, promptFor, hintFor, solutionFor, grade } from "./core.js?v=area-1";
import { renderProblem } from "./render.js?v=area-1";
import { translation } from "./i18n.js?v=area-1";
import { icon } from "../shape-transform/ui-icons.js?v=shape-transform-5";
import { sessionProblems } from "../../shared/problem-pool.js";
import { saveGameProgress } from "../../shared/profile-storage.js";

const $ = selector => document.querySelector(selector);
const url = new URL(location.href);
const domain = domains.find(d => d.id === url.searchParams.get("domain")) || domains.find(d => d.level === Number(url.searchParams.get("level"))) || domains[0];
url.searchParams.set("domain", domain.id);
url.searchParams.set("level", domain.level);
history.replaceState(null, "", url);
let savedLanguage;
try { savedLanguage = localStorage.getItem("gfield-language"); } catch { /* Storage is optional. */ }
let lang = url.searchParams.get("lang") || savedLanguage || "ko";
if (!["ko", "en", "zh", "ja"].includes(lang)) lang = "ko";
const queue = sessionProblems("unit-area", domain.level, problemsFor(domain.id), 5);
url.searchParams.delete("practice");
history.replaceState(null, "", url);
const state = { index: 0, cells: [], marks: [], pairs: [], half: null, aligned: false, finished: false, response: null, feedback: "", history: [] };
const p = () => queue[state.index];
const t = key => translation(lang)[key];
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
function action(selector, glyph, key) {
  $(selector).innerHTML = icon(glyph) + (key ? `<span>${t(key)}</span>` : "");
}
function named(selector, key) { $(selector).title = t(key); $(selector).setAttribute("aria-label", t(key)); }
function response() {
  if (p().domain === "build") return state.cells;
  if (p().domain === "compare") return $("input[name=comparison]:checked")?.value || "";
  return $("#answer").value;
}
function renderBoard(focus) {
  $("#board").dataset.problemId = p().id;
  $("#board").innerHTML = renderProblem(p(), { lang, interactive: !state.finished, reveal: state.finished, selectedCells: state.cells, markedCells: state.marks, pairs: state.pairs, activeHalf: state.half, aligned: state.aligned });
  if (focus) $("#board").querySelector(focus)?.focus();
}
function updateResponse() {
  $("#check").disabled = state.finished || !grade(p(), response()).valid;
  $("#undo").disabled = state.finished || !state.history.length;
  $("#answer").disabled = state.finished;
  document.querySelectorAll("input[name=comparison]").forEach(el => { el.disabled = state.finished; });
  $("#buildReadout").textContent = t("built")(state.cells.length);
  $("#manipulationStatus").textContent = p().domain === "halves" ? state.half !== null ? t("chooseHalf") : t("paired")(state.pairs.length) : p().domain === "whole" ? t("marked")(state.marks.length) : "";
  $("#feedback").textContent = state.feedback ? t(state.feedback) : "";
  $("#feedback").dataset.kind = state.finished ? "correct" : "";
  $("#review").hidden = !state.finished;
  $("#solution").textContent = state.finished ? solutionFor(p(), lang, state.response) : "";
  $("#next").hidden = !state.finished;
}
function renderCopy() {
  document.documentElement.lang = lang;
  document.title = `GFIELD ${t("title")}`;
  $("#language").value = lang;
  $("#language").setAttribute("aria-label", t("language"));
  $("#studioTitle").textContent = t("title");
  $("#title").textContent = domain.names[lang];
  $("#domainTabs").setAttribute("aria-label", t("area"));
  $("#domainTabs").innerHTML = domains.map(d => `<a href="?domain=${d.id}&level=${d.level}&lang=${lang}" ${d.id === domain.id ? 'aria-current="page"' : ""}>${d.names[lang]}</a>`).join("");
  action("#back", "back"); named("#back", "back");
  action("#worksheet", "book", "worksheet");
  $("#worksheet").href = `../../worksheet/unit-area/?domain=${domain.id}`;
  action("#retry", "retry"); named("#retry", "retry");
  action("#undo", "back"); named("#undo", "undo");
  action("#check", "check", "check");
  action("#next", "next", state.index === queue.length - 1 ? "done" : "next");
  $("#prompt").textContent = promptFor(p(), lang);
  $("#progress").textContent = `${state.index + 1} / ${queue.length}`;
  $("#progressBar").value = state.index + (state.finished ? 1 : 0);
  $("#progressBar").setAttribute("aria-label", t("progress"));
  $("#numberResponse").hidden = !["whole", "halves"].includes(p().domain);
  $("#compareResponse").hidden = p().domain !== "compare";
  $("#buildReadout").hidden = p().domain !== "build";
  $("#undo").hidden = p().domain === "compare";
  $("#alignLabel").hidden = p().domain !== "compare";
  $("#alignText").textContent = t("align");
  $("#aligned").checked = state.aligned;
  $("#answerLabel").textContent = t("answer");
  $("#compareLabel").textContent = t("compare");
  for (const value of ["less", "equal", "greater"]) $(`input[value=${value}]`).setAttribute("aria-label", t(value));
  $("#hintTitle").textContent = t("hint");
  $("#hintText").textContent = hintFor(p(), lang);
  $("#reviewTitle").textContent = t("review");
  $("#principle").textContent = t("rules")[domain.id];
  $("#completeTitle").textContent = t("complete");
  $("#completeText").textContent = t("completeText");
  $("#practice").href = `?domain=${domain.id}&level=${domain.level}&practice=1&lang=${lang}`;
  $("#practice").textContent = t("practice");
  $("#garden").textContent = t("area");
  action("#close", "close"); named("#close", "done");
  renderBoard(); updateResponse();
}
function remember() {
  state.history.push({ cells: state.cells.map(c => [...c]), marks: state.marks.map(c => [...c]), pairs: state.pairs.map(pair => [...pair]), half: state.half });
}
function resetProblem() {
  Object.assign(state, { cells: [], marks: [], pairs: [], half: null, aligned: false, finished: false, response: null, feedback: "", history: [] });
  $("#answerForm").reset();
  $("#hint").open = false;
  renderCopy();
}
function choose(node) {
  if (!node || state.finished) return;
  if (node.hasAttribute("data-half") && p().domain === "halves") {
    const half = Number(node.dataset.half);
    if (!Number.isInteger(half) || p().cells[half]?.part === "full") return;
    remember();
    const pairIndex = state.pairs.findIndex(pair => pair.includes(half));
    if (pairIndex !== -1) { state.pairs.splice(pairIndex, 1); state.half = null; }
    else if (state.half === half) state.half = null;
    else if (state.half === null) state.half = half;
    else { state.pairs.push([state.half, half]); state.half = null; }
  } else if (node.hasAttribute("data-cell") && ["whole", "build"].includes(p().domain)) {
    const cell = node.dataset.cell.split(",").map(Number);
    remember();
    const key = p().domain === "build" ? "cells" : "marks";
    state[key] = state[key].some(c => same(c, cell)) ? state[key].filter(c => !same(c, cell)) : [...state[key], cell];
  } else return;
  state.feedback = "";
  const attribute = node.hasAttribute("data-half") ? "data-half" : "data-cell";
  renderBoard(`[${attribute}="${node.getAttribute(attribute)}"]`); updateResponse();
}
$("#board").addEventListener("click", event => choose(event.target.closest("[data-half],[data-cell]")));
$("#board").addEventListener("keydown", event => {
  const node = event.target.closest("[data-half],[data-cell]");
  if (!node || state.finished) return;
  if (["Enter", " "].includes(event.key)) { event.preventDefault(); choose(node); return; }
  const vector = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
  if (!vector) return;
  event.preventDefault();
  const choices = [...$("#board").querySelectorAll("[data-cell],[data-half]")];
  const coords = element => element.hasAttribute("data-half") ? [p().cells[Number(element.dataset.half)].x, p().cells[Number(element.dataset.half)].y] : element.dataset.cell.split(",").map(Number);
  const current = coords(node);
  const candidates = choices.filter(el => el !== node).map(el => ({ el, at: coords(el) })).filter(({ at }) => vector[0] ? at[1] === current[1] : at[0] === current[0]);
  candidates.sort((a, b) => {
    const distance = at => ((at[0] - current[0]) * vector[0] + (at[1] - current[1]) * vector[1] + p().size) % p().size;
    return distance(a.at) - distance(b.at);
  });
  const next = candidates[0]?.el;
  if (next) { node.tabIndex = -1; next.tabIndex = 0; next.focus(); }
});
$("#undo").addEventListener("click", () => {
  if (state.finished || !state.history.length) return;
  Object.assign(state, state.history.pop(), { feedback: "" });
  renderBoard(); updateResponse();
});
$("#aligned").addEventListener("change", () => {
  const previous = new Map([...$("#board").querySelectorAll("[data-piece]")].map(node => [node.dataset.piece, node.getBoundingClientRect()]));
  state.aligned = $("#aligned").checked;
  renderBoard();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Keep each unit visibly continuous as its position changes, without resizing it.
  $("#board").querySelectorAll("[data-piece]").forEach(node => {
    const from = previous.get(node.dataset.piece), to = node.getBoundingClientRect(), matrix = node.getScreenCTM();
    if (!from || !matrix?.a || !matrix?.d) return;
    const transform = getComputedStyle(node).transform;
    const offset = `translate(${(from.x - to.x) / matrix.a}px, ${(from.y - to.y) / matrix.d}px)`;
    node.animate([{ transform: `${offset} ${transform}` }, { transform }], { duration: 420, easing: "ease-in-out" });
  });
});
$("#answerForm").addEventListener("input", () => { state.feedback = ""; updateResponse(); });
$("#answerForm").addEventListener("submit", event => {
  event.preventDefault();
  if (state.finished) return;
  state.response = response();
  const result = grade(p(), state.response);
  if (!result.valid) { state.feedback = "invalid"; updateResponse(); return; }
  if (p().domain === "halves" && state.pairs.length * 2 !== p().cells.filter(c => c.part !== "full").length) { state.feedback = "pairFirst"; updateResponse(); return; }
  state.finished = result.correct;
  state.feedback = result.correct ? "correct" : result.kind === "disconnected" ? "disconnected" : "retryAnswer";
  if (state.finished) {
    try { saveGameProgress("unitArea", { domain: domain.id, problemIndex: state.index, completedProblem: p().id }); }
    catch { $("#storageWarning").textContent = t("storage"); }
    $("#progressBar").value = state.index + 1;
    renderBoard();
  }
  updateResponse();
});
$("#retry").addEventListener("click", () => { resetProblem(); $("#prompt").focus(); });
$("#next").addEventListener("click", () => {
  if (!state.finished) return;
  if (state.index === queue.length - 1) { $("#completion").showModal(); return; }
  state.index++; resetProblem(); $("#prompt").focus();
});
$("#close").addEventListener("click", () => $("#completion").close());
$("#language").addEventListener("change", () => {
  lang = $("#language").value;
  try { localStorage.setItem("gfield-language", lang); } catch { /* Keep the selected language in this visit. */ }
  url.searchParams.set("lang", lang); history.replaceState(null, "", url);
  renderCopy();
});
renderCopy();
