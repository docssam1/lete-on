import { domains, problemsFor, promptFor, hintFor, solutionFor, grade, perimeterOf } from "./core.js?v=perimeter-1";
import { renderProblem } from "./render.js?v=perimeter-1";
import { translation } from "./i18n.js?v=perimeter-1";
import { icon } from "../shape-transform/ui-icons.js?v=shape-transform-5";
import { sessionProblems } from "../../shared/problem-pool.js";
import { saveGameProgress } from "../../shared/profile-storage.js";

const $ = selector => document.querySelector(selector);
const url = new URL(location.href);
const domain = domains.find(d => d.id === url.searchParams.get("domain")) || domains.find(d => d.level === Number(url.searchParams.get("level"))) || domains[0];
let savedLanguage;
try { savedLanguage = localStorage.getItem("gfield-language"); } catch { /* Storage is optional. */ }
let lang = url.searchParams.get("lang") || savedLanguage || "ko";
if (!["ko","en","zh","ja"].includes(lang)) lang = "ko";
url.searchParams.set("domain", domain.id);
url.searchParams.set("level", domain.level);
history.replaceState(null,"",url);
const queue = sessionProblems("perimeter", domain.level, problemsFor(domain.id), 5);
url.searchParams.delete("practice");
history.replaceState(null,"",url);
const state = { index:0, cells:[], marks:[], history:[], aligned:false, finished:false, response:null, feedback:"" };
const p = () => queue[state.index];
const t = key => translation(lang)[key];
const same = (a,b) => a[0]===b[0] && a[1]===b[1];
function action(selector,glyph,key) { $(selector).innerHTML=icon(glyph)+(key?`<span>${t(key)}</span>`:""); }
function named(selector,key) { $(selector).title=t(key); $(selector).setAttribute("aria-label",t(key)); }
function response() {
  if(p().domain==="build") return state.cells;
  if(p().domain==="compare") return $("input[name=comparison]:checked")?.value || "";
  return $("#answer").value;
}
function renderBoard(focus) {
  const paired=["compare","build"].includes(p().domain)&&matchMedia("(min-width:390px)").matches;
  document.querySelector(".studio").dataset.paired=String(paired);
  $("#board").dataset.problemId=p().id;
  $("#board").innerHTML=renderProblem(p(),{lang,interactive:!state.finished,reveal:state.finished,selectedCells:state.cells,markedEdges:state.marks,aligned:state.aligned,layout:paired?"horizontal":"vertical",compact:paired&&matchMedia("(max-width:700px)").matches});
  if(focus){
    const node=$("#board").querySelector(focus);
    if(node){$("#board").querySelectorAll("[tabindex]").forEach(el=>{el.tabIndex=-1;});node.tabIndex=0;node.focus({preventScroll:true});}
  }
}
function updateResponse() {
  $("#check").disabled=state.finished || !grade(p(),response()).valid;
  $("#undo").disabled=state.finished || !state.history.length;
  $("#answer").disabled=state.finished;
  document.querySelectorAll("input[name=comparison]").forEach(el=>{el.disabled=state.finished;});
  $("#buildReadout").textContent=t("built")(perimeterOf(state.cells.map(([x,y])=>({x,y}))));
  $("#manipulationStatus").textContent=["boundary","joined"].includes(p().domain)?t("marked")(state.marks.length):"";
  $("#feedback").textContent=state.feedback?t(state.feedback):"";
  $("#feedback").dataset.kind=state.finished?"correct":"";
  $("#review").hidden=!state.finished;
  $("#solution").textContent=state.finished?solutionFor(p(),lang,state.response):"";
  $("#next").hidden=!state.finished;
  $("#progressBar").value=state.index+(state.finished?1:0);
}
function renderCopy() {
  document.documentElement.lang=lang;
  document.title=`GFIELD ${t("title")}`;
  $("#language").value=lang;
  $("#language").setAttribute("aria-label",t("language"));
  $("#studioTitle").textContent=t("title");
  $("#title").textContent=domain.names[lang];
  $("#domainTabs").setAttribute("aria-label",t("area"));
  $("#domainTabs").innerHTML=domains.map(d=>`<a href="?domain=${d.id}&level=${d.level}&lang=${lang}" ${d.id===domain.id?'aria-current="page"':""}>${d.names[lang]}</a>`).join("");
  action("#back","back"); named("#back","back");
  action("#worksheet","book","worksheet");
  $("#worksheet").href=`../../worksheet/perimeter/?domain=${domain.id}&lang=${lang}`;
  action("#retry","retry"); named("#retry","retry");
  action("#undo","back"); named("#undo","undo");
  action("#check","check","check");
  action("#next","next",state.index===queue.length-1?"done":"next");
  $("#prompt").textContent=promptFor(p(),lang);
  $("#progress").textContent=`${state.index+1} / ${queue.length}`;
  $("#progressBar").setAttribute("aria-label",t("progress"));
  $("#numberResponse").hidden=!["boundary","joined"].includes(p().domain);
  $("#compareResponse").hidden=p().domain!=="compare";
  $("#buildReadout").hidden=p().domain!=="build";
  $("#undo").hidden=p().domain==="compare";
  $("#alignLabel").hidden=p().domain!=="compare";
  $("#alignText").textContent=t("align");
  $("#aligned").checked=state.aligned;
  $("#answerLabel").textContent=t("answer");
  $("#compareLabel").textContent=t("compare");
  for(const value of ["less","equal","greater"]) $(`input[value=${value}]`).setAttribute("aria-label",t(value));
  $("#hintTitle").textContent=t("hint");
  $("#hintText").textContent=hintFor(p(),lang);
  $("#reviewTitle").textContent=t("review");
  $("#principle").textContent=t("rules")[domain.id];
  $("#completeTitle").textContent=t("complete");
  $("#completeText").textContent=t("completeText");
  $("#practice").href=`?domain=${domain.id}&level=${domain.level}&practice=1&lang=${lang}`;
  $("#practice").textContent=t("practice");
  $("#garden").textContent=t("area");
  action("#close","close"); named("#close","done");
  renderBoard(); updateResponse();
}
function remember() { state.history.push({cells:state.cells.map(c=>[...c]),marks:[...state.marks]}); }
function resetProblem() {
  Object.assign(state,{cells:[],marks:[],history:[],aligned:false,finished:false,response:null,feedback:""});
  $("#answerForm").reset(); $("#hint").open=false;
  renderCopy();
}
function choose(node) {
  if(!node || state.finished) return;
  if(node.hasAttribute("data-edge")) {
    if(node.dataset.edgeKind==="shared") {state.feedback="shared";updateResponse();return;}
    remember();
    const id=node.dataset.edge;
    state.marks=state.marks.includes(id)?state.marks.filter(edge=>edge!==id):[...state.marks,id];
  } else if(node.hasAttribute("data-cell") && p().domain==="build") {
    remember();
    const cell=node.dataset.cell.split(",").map(Number);
    state.cells=state.cells.some(c=>same(c,cell))?state.cells.filter(c=>!same(c,cell)):[...state.cells,cell];
  } else return;
  state.feedback="";
  const attr=node.hasAttribute("data-edge")?"data-edge":"data-cell";
  renderBoard(`[${attr}="${node.getAttribute(attr)}"]`);updateResponse();
}
$("#board").addEventListener("click",event=>choose(event.target.closest("[data-cell],[data-edge]")));
$("#board").addEventListener("keydown",event=>{
  const node=event.target.closest("[data-cell],[data-edge]");
  if(!node || state.finished)return;
  if(["Enter"," "].includes(event.key)){event.preventDefault();choose(node);return;}
  const vector={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(!vector)return;
  event.preventDefault();let next;
  if(node.hasAttribute("data-cell")){
    const [x,y]=node.dataset.cell.split(",").map(Number);
    next=$("#board").querySelector(`[data-cell="${(x+vector[0]+p().size)%p().size},${(y+vector[1]+p().size)%p().size}"]`);
  }else{
    const nodes=[...$("#board").querySelectorAll("[data-edge]")],index=nodes.indexOf(node),step=vector[0]+vector[1];
    next=nodes[(index+step+nodes.length)%nodes.length];
  }
  if(next){node.tabIndex=-1;next.tabIndex=0;next.focus({preventScroll:true});}
});
$("#undo").addEventListener("click",()=>{
  if(state.finished || !state.history.length)return;
  Object.assign(state,state.history.pop(),{feedback:""});renderBoard();updateResponse();
});
$("#aligned").addEventListener("change",()=>{state.aligned=$("#aligned").checked;renderBoard();});
$("#answerForm").addEventListener("input",()=>{state.feedback="";updateResponse();});
$("#answerForm").addEventListener("submit",event=>{
  event.preventDefault();if(state.finished)return;
  const result=grade(p(),response());
  if(!result.valid){state.feedback="invalid";updateResponse();return;}
  state.finished=result.correct;
  state.feedback=result.correct?"correct":["disconnected","hole","same-shape"].includes(result.kind)?result.kind:"retryAnswer";
  if(state.finished){
    state.response=p().domain==="build"?state.cells.map(c=>[...c]):response();
    try{saveGameProgress("perimeter",{domain:domain.id,problemIndex:state.index,completedProblem:p().id});}
    catch{$("#storageWarning").textContent=t("storage");}
    renderBoard();
  }
  updateResponse();
});
$("#retry").addEventListener("click",()=>{resetProblem();$("#prompt").focus();});
$("#next").addEventListener("click",()=>{
  if(!state.finished)return;
  if(state.index===queue.length-1){$("#completion").showModal();return;}
  state.index++;resetProblem();$("#prompt").focus();
});
$("#close").addEventListener("click",()=>$("#completion").close());
$("#language").addEventListener("change",()=>{
  lang=$("#language").value;
  try{localStorage.setItem("gfield-language",lang);}catch{/* Keep the language for this visit. */}
  url.searchParams.set("lang",lang);history.replaceState(null,"",url);renderCopy();
});
for(const query of ["(min-width:390px)","(max-width:700px)"])matchMedia(query).addEventListener("change",()=>renderBoard());
renderCopy();
