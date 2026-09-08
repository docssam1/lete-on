import { domains, problemsFor, promptFor, hintFor, solutionFor, grade } from "./core.js?v=angle-1";
import { renderProblem } from "./render.js?v=angle-1";
import { translation } from "./i18n.js?v=angle-1";
import { icon } from "../shape-transform/ui-icons.js?v=shape-transform-5";
import { sessionProblems } from "../../shared/problem-pool.js";
import { saveGameProgress } from "../../shared/profile-storage.js";

const $ = selector => document.querySelector(selector);
const url = new URL(location.href);
const domain = domains.find(item => item.id === url.searchParams.get("domain")) || domains.find(item => item.level === Number(url.searchParams.get("level"))) || domains[0];
url.searchParams.set("level", domain.level);
url.searchParams.set("domain", domain.id);
history.replaceState(null, "", url);
let savedLanguage;
try { savedLanguage = localStorage.getItem("gfield-language"); } catch { /* The activity also works without storage. */ }
let lang = url.searchParams.get("lang") || savedLanguage || "ko";
if (!["ko", "en", "zh", "ja"].includes(lang)) lang = "ko";
const queue = sessionProblems("angle-studio", domain.level, problemsFor(domain.id), 5);
url.searchParams.delete("practice");
history.replaceState(null, "", url);
const state = { index: 0, point: null, diagonals: [], finished: false, response: "", result: null };
const p = () => queue[state.index];
const t = key => translation(lang)[key];
function action(id, glyph, key) {
  $(id).innerHTML = icon(glyph) + (key ? `<span>${t(key)}</span>` : "");
}
function name(id, key) { $(id).title = t(key); $(id).setAttribute("aria-label", t(key)); }
function persist(progress) {
  try { saveGameProgress("angleStudio", progress); }
  catch { $("#storageWarning").textContent = t("storage"); }
}
function pointReadout() {
  $("#pointReadout").textContent = state.point ? t("pointSelected") : t("choosePoint");
}
function renderBoard(focusPoint = null) {
  $("#board").innerHTML = renderProblem(p(), { reveal: state.finished, point: state.point, selectedVertices: state.diagonals, interactive: !state.finished && (p().domain === "right-angle" || p().kind === "triangles"), lang });
  if (focusPoint) $("#board").querySelector(`[data-point="${focusPoint.join(",")}"]`)?.focus();
}
function showResult() {
  const result = state.result;
  $("#feedback").textContent = !result ? "" : t(result.kind === "retry" ? "tryAgain" : result.kind);
  $("#feedback").dataset.kind = result?.kind || "";
  $("#review").hidden = !state.finished;
  $("#solution").textContent = state.finished ? solutionFor(p(), lang, state.response) : "";
  $("#next").hidden = !state.finished;
  $("#answer").disabled = state.finished;
  updateCheck();
}
function updateCheck() {
  const value = p().domain === "right-angle" ? state.point : $("#answer").value;
  $("#check").disabled = state.finished || !grade(p(), value).valid;
}
function renderCopy() {
  document.documentElement.lang = lang;
  document.title = `GFIELD ${t("title")}`;
  $("#language").value = lang;
  $("#language").setAttribute("aria-label", t("language"));
  $("#studioTitle").textContent = t("title");
  $("#title").textContent = domain.names[lang];
  $("#domainTabs").setAttribute("aria-label", t("area"));
  $("#domainTabs").innerHTML = domains.map(item => `<a href="?domain=${item.id}&level=${item.level}&lang=${lang}" ${item.id === domain.id ? 'aria-current="page"' : ""}>${item.names[lang]}</a>`).join("");
  action("#back", "back"); name("#back", "back");
  action("#worksheet", "book", "worksheet");
  $("#worksheet").href = `../../worksheet/angle-studio/?domain=${domain.id}`;
  action("#retry", "retry"); name("#retry", "retry");
  action("#check", "check", p().domain === "estimate" ? "checkEstimate" : "check");
  action("#next", "next", state.index === queue.length - 1 ? "done" : "next");
  $("#prompt").textContent = promptFor(p(), lang);
  $("#board").dataset.problemId = p().id;
  $("#progress").textContent = `${state.index + 1} / ${queue.length}`;
  $("#progressBar").value = state.index + (state.finished ? 1 : 0);
  $("#progressBar").setAttribute("aria-label", t("progress"));
  $("#numberResponse").hidden = p().domain === "right-angle";
  $("#pointReadout").hidden = p().domain !== "right-angle";
  $("#answerLabel").textContent = t(p().domain === "estimate" ? "estimate" : "answer");
  $("#unit").textContent = p().responseKind === "angle-label" ? t("angleNumberUnit") : p().unit === "degree" ? "°" : t("count");
  $("#answer").max = p().domain === "estimate" ? "180" : "9999";
  $("#answer").step = p().domain === "estimate" ? "any" : "1";
  $("#hintTitle").textContent = t("hint");
  $("#hintText").textContent = hintFor(p(), lang);
  $("#reviewTitle").textContent = t("review");
  $("#principle").textContent = t({ estimate: "estimateRule", "right-angle": "rightRule", polygon: "polygonRule", parallel: "parallelRule" }[domain.id]);
  $("#completeTitle").textContent = t("complete");
  $("#completeText").textContent = t("completeText");
  $("#practice").href = `?domain=${domain.id}&level=${domain.level}&practice=1&lang=${lang}`;
  $("#practice").textContent = t("practice");
  $("#garden").textContent = t("area");
  action("#close", "close"); name("#close", "done");
  pointReadout(); renderBoard(); showResult();
}
function resetProblem() {
  state.point = null; state.diagonals = []; state.finished = false; state.response = ""; state.result = null;
  $("#answer").value = "";
  $("#hint").open = false;
  renderCopy();
}
$("#answer").addEventListener("input", () => { state.result = null; $("#feedback").textContent = ""; updateCheck(); });
$("#answerForm").addEventListener("submit", event => {
  event.preventDefault();
  if (state.finished) return;
  state.response = p().domain === "right-angle" ? state.point : $("#answer").value;
  const result = grade(p(), state.response);
  if (!result.valid) { $("#feedback").textContent = t(p().domain === "estimate" ? "estimateInvalid" : "invalid"); return; }
  if (p().kind === "triangles" && state.diagonals.length !== p().sides - 3) { $("#feedback").textContent = t("joinAll"); return; }
  state.result = result;
  state.finished = p().domain === "estimate" || result.correct;
  if (state.finished) {
    renderBoard();
    $("#progressBar").value = state.index + 1;
    persist({ domain: domain.id, problemIndex: state.index, completedProblem: p().id });
  }
  showResult();
});
function choosePoint(node) {
  if (!node || state.finished) return;
  state.point = node.dataset.point.split(",").map(Number);
  state.result = null;
  renderBoard(state.point); pointReadout(); showResult();
}
function chooseVertex(node) {
  if (!node || state.finished || p().kind !== "triangles") return;
  const vertex = Number(node.dataset.vertex), n = p().sides, a = p().anchor;
  if (vertex === a || vertex === (a + 1) % n || vertex === (a + n - 1) % n) { $("#feedback").textContent = t("neighbor"); return; }
  state.diagonals = state.diagonals.includes(vertex) ? state.diagonals.filter(i => i !== vertex) : [...state.diagonals, vertex];
  state.result = null; renderBoard(); showResult();
  $("#board").querySelector(`[data-vertex="${vertex}"]`)?.focus();
}
$("#board").addEventListener("click", event => {
  choosePoint(event.target.closest("[data-point]"));
  chooseVertex(event.target.closest("[data-vertex]"));
});
$("#board").addEventListener("keydown", event => {
  const vertex = event.target.closest("[data-vertex]");
  if (vertex && !state.finished) {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); chooseVertex(vertex); }
    return;
  }
  const node = event.target.closest("[data-point]");
  if (!node || state.finished) return;
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choosePoint(node); return; }
  const vector = { ArrowLeft: [-1,0], ArrowRight: [1,0], ArrowUp: [0,-1], ArrowDown: [0,1] }[event.key];
  if (!vector) return;
  event.preventDefault();
  const current = node.dataset.point.split(",").map(Number);
  for (let step = 1; step < p().size; step++) {
    const next = current.map((v, i) => (v + vector[i] * step + p().size) % p().size);
    const candidate = $("#board").querySelector(`[data-point="${next.join(",")}"]`);
    if (candidate) { node.tabIndex = -1; candidate.tabIndex = 0; candidate.focus(); break; }
  }
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
  try { localStorage.setItem("gfield-language", lang); } catch { /* Language remains active for this visit. */ }
  url.searchParams.set("lang", lang); history.replaceState(null, "", url);
  renderCopy();
});
renderCopy();
