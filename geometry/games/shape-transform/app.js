import { levels, expectedFor, transformPoints, validateLevels } from "./levels.js?v=shape-transform-3";
import { sessionProblems } from "../../shared/problem-pool.js";
import { curriculumBandLabel } from "../../shared/curriculum-bands.js?v=curriculum-2";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";
import { translation, operationLabel } from "./i18n.js?v=shape-transform-4";
import { boardSvg, shapeMarkup, referenceMarkup } from "./render.js?v=shape-transform-5";
import { icon } from "./ui-icons.js?v=shape-transform-5";
import { rotationCue } from "./rotation-cue.js?v=rotation-cue-1";
import { usesManipulation } from "./manipulation.js?v=shape-transform-5";
import { manipulationController } from "./manipulation-ui.js?v=shape-transform-5";
import { activityCopy } from "./activity-copy.js?v=shape-transform-5";
import { choiceFeedback } from "./choice-feedback.js?v=shape-transform-5";

validateLevels();
const $ = (selector) => document.querySelector(selector);
const storedLanguage = localStorage.getItem("gfield-language");
const lang = ["ko","en","zh","ja"].includes(storedLanguage) ? storedLanguage : "ko";
const { t, domains } = translation(lang);
const saved = readGameProgress("shapeTransform");
const initial = Math.max(1, Math.min(5, Math.trunc(Number(new URLSearchParams(location.search).get("level")) || Number(saved.level) || 1)));
const state = { level:initial - 1, index:0, queue:[], solved:false, helped:new Set(), completed:new Set(), wrongChoice:null, animation:0, audio:localStorage.getItem("gfield-audio-muted") !== "true" };
const sessions = new Map();
const current = () => state.queue[state.index];
const domain = () => domains[state.level];
const handsOn = () => usesManipulation(current(),state.index);
const activity = activityCopy(lang);
const manipulation = manipulationController({
  board:$("#manipulationBoard"), controls:$("#manipulationControls"), readout:$("#manipulationReadout"),
  check:$("#checkShape"), language:lang,
  onEdit:() => { $("#statusLabel").textContent = activity.ready; $("#statusLabel").className = ""; },
  onCheck:diagnosis => {
    if (state.solved || !handsOn() || $("#completeDialog").open) return;
    if (diagnosis === "correct") { manipulation.lock(); completeProblem(); }
    else {
      state.helped.add(state.index);
      $("#statusLabel").textContent = activity[diagnosis]; $("#statusLabel").className = "needs-thought";
      sound(false);
    }
  }
});
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const action = (selector, name, label) => { $(selector).innerHTML = icon(name) + `<span>${label}</span>`; };
const operationMarkup = problem => `<span>${operationLabel(problem,t)}</span>${problem.operation.kind === "rotate" ? rotationCue(problem.operation.angle, operationLabel(problem,t)) : ""}`;
const labelIcon = (selector, name, label) => { $(selector).innerHTML = icon(name); $(selector).title = label; $(selector).setAttribute("aria-label",label); };

function sound(correct) {
  if (!state.audio) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  const context = new Audio();
  const oscillator = context.createOscillator(), gain = context.createGain();
  oscillator.frequency.setValueAtTime(correct ? 660 : 240, context.currentTime);
  gain.gain.setValueAtTime(.05, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .22);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(); oscillator.stop(context.currentTime + .23);
  oscillator.onended = () => context.close();
}

function renderTabs() {
  $("#domainTabs").replaceChildren();
  domains.forEach((item,index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span class="domain-number">0${index+1}</span><span>${item.title}</span>`;
    button.setAttribute("aria-current", index === state.level ? "page" : "false");
    button.addEventListener("click", () => startLevel(index));
    $("#domainTabs").append(button);
  });
}

function startLevel(index) {
  state.level = index; state.index = 0; state.solved = false; state.helped.clear(); state.completed.clear();
  if (!sessions.has(index)) sessions.set(index, sessionProblems("shape-transform",index+1,levels[index].problems,5));
  state.queue = sessions.get(index);
  const url = new URL(location.href); url.searchParams.set("level",String(index+1)); url.searchParams.delete("practice"); history.replaceState(null,"",url);
  $("#completeDialog").close();
  renderTabs(); render();
}

function renderLesson() {
  const example = { closed:true, target:[[40,30],[60,30],[60,40],[50,40],[50,60],[40,60]], operation:{...current().operation} };
  const result = expectedFor(example);
  $("#lessonContent").innerHTML = `<figure><figcaption>${t("before")}</figcaption>${boardSvg(example,example.target,{label:t("before")})}</figure><div class="lesson-operation">${operationMarkup(example)}</div><figure><figcaption>${t("after")}</figcaption>${boardSvg(example,result,{label:t("after")})}</figure>`;
}

function render() {
  cancelAnimationFrame(state.animation);
  state.solved = false; state.wrongChoice = null;
  const problem = current();
  const direct = handsOn();
  manipulation.reset();
  document.documentElement.lang = lang;
  document.body.dataset.domain = String(state.level+1);
  $("#bandLabel").textContent = curriculumBandLabel("shape-transform",state.level+1,lang);
  $("#missionTitle").textContent = domain().title;
  $("#guideText").textContent = domain().goal;
  $("#principleText").textContent = domain().rule;
  $("#prompt").textContent = direct ? activity[problem.operation.kind === "rotate" ? "turnPrompt" : "movePrompt"] : domain().prompt;
  $("#operationLabel").innerHTML = operationMarkup(problem);
  $("#operationLabel").classList.toggle("with-turn",problem.operation.kind === "rotate");
  $("#targetBoard").innerHTML = boardSvg(problem,problem.target,{label:t("target")});
  $("#choiceGrid").replaceChildren();
  $(".workbench").classList.toggle("is-manipulation",direct);
  $("#manipulationPanel").hidden = !direct; $("#manipulationActions").hidden = !direct;
  if (direct) {
    $("#manipulationTag").textContent = activity.myShape;
    manipulation.mount(problem);
  }
  if (!direct) problem.choices.forEach((points,index) => {
    const button = document.createElement("button");
    button.type = "button"; button.className = "choice";
    button.setAttribute("aria-label",`${t("choice")} ${index+1}`);
    button.innerHTML = `<span class="choice-caption"><b>${index+1}</b><span>${t("choice")}</span></span><div class="shape-board">${boardSvg(problem,points,{label:`${t("choice")} ${index+1}`})}</div>`;
    button.addEventListener("click", () => choose(index));
    $("#choiceGrid").append(button);
  });
  $("#statusLabel").textContent = direct ? activity.start : t("observe"); $("#statusLabel").className = "";
  $("#hintText").hidden = true; $("#reviewPanel").hidden = true; $("#nextButton").hidden = true;
  $("#reviewBoard").replaceChildren();
  $("#hintButton").disabled = false; $("#lesson").open = false;
  $("#problemLabel").textContent = `${state.index+1} / ${state.queue.length}`;
  $("#progressDots").innerHTML = state.queue.map((_,i) => `<i class="${state.completed.has(i) ? "done" : i===state.index ? "current" : ""}"></i>`).join("");
  $("#worksheetLink").href = `../../worksheet/shape-transform/?level=${state.level+1}`;
  $("#areaFooter").textContent = domain().title;
  action("#nextButton","next",t(state.index===state.queue.length-1 ? "finish" : "next"));
  renderLesson();
  saveGameProgress("shapeTransform",{level:state.level+1,problemIndex:state.index,currentProblem:problem.id});
}

function choose(index) {
  if (state.solved || handsOn() || $("#completeDialog").open) return;
  const problem = current(), button = $("#choiceGrid").children[index];
  if (index !== problem.answerIndex) {
    state.wrongChoice = index; state.helped.add(state.index);
    button.classList.add("wrong"); button.setAttribute("aria-pressed","false");
    $("#statusLabel").textContent = choiceFeedback(problem,index,lang); $("#statusLabel").className = "needs-thought";
    sound(false); return;
  }
  button.classList.add("correct"); button.setAttribute("aria-pressed","true");
  $("#choiceGrid").querySelectorAll("button").forEach((choice) => { choice.disabled = true; });
  completeProblem();
}

function completeProblem() {
  const problem = current();
  state.solved = true; state.completed.add(state.index);
  $("#statusLabel").textContent = t("correct"); $("#statusLabel").className = "correct";
  $("#nextButton").hidden = false; $("#hintButton").disabled = true;
  $("#progressDots").children[state.index].className = "done";
  $("#reviewPanel").hidden = false; $("#reviewText").textContent = domain().proof;
  $("#reviewTitle").innerHTML = operationMarkup(problem);
  $("#compareButton").hidden = problem.operation.kind !== "same-bends";
  animateReview(); sound(true);
  saveGameProgress("shapeTransform",{completedProblem:problem.id});
}

function animateReview() {
  cancelAnimationFrame(state.animation);
  const problem = current(), correct = expectedFor(problem);
  $("#reviewBoard").innerHTML = boardSvg(problem,problem.target,{label:t("review"),ghost:problem.target,review:true});
  $("#reviewTitle").innerHTML = operationMarkup(problem);
  $("#reviewText").textContent = domain().proof;
  const start = performance.now(), duration = reducedMotion.matches ? 0 : 1100;
  function tick(now) {
    const progress = duration ? Math.min(1,(now-start)/duration) : 1;
    const ease = progress*progress*(3-2*progress), op = problem.operation;
    const points = progress === 1 ? correct : transformPoints(problem.target,{
      ...op, scale:1+((op.scale || 1)-1)*ease, angle:(op.angle || 0)*ease, dx:(op.dx || 0)*ease, dy:(op.dy || 0)*ease
    });
    const group = $("#movingShape");
    if (!group) return;
    group.innerHTML = shapeMarkup(points,problem.closed) + referenceMarkup(problem,points);
    if (progress < 1) state.animation = requestAnimationFrame(tick);
  }
  state.animation = requestAnimationFrame(tick);
}

function compareWrong() {
  cancelAnimationFrame(state.animation);
  const problem=current(), expected=expectedFor(problem);
  const selected = state.wrongChoice ?? problem.choices.findIndex((_,i)=>i!==problem.answerIndex);
  const choice=problem.choices[selected];
  const differences=choice.filter(([x,y],i)=>Math.abs(x-expected[i][0])>.01 || Math.abs(y-expected[i][1])>.01);
  $("#reviewBoard").innerHTML=boardSvg(problem,choice,{label:t("difference"),ghost:expected,differences});
  $("#reviewTitle").textContent=`${t("choice")} ${selected+1} · ${t("difference")}`;
  $("#reviewText").textContent=choiceFeedback(problem,selected,lang);
}

function hint() {
  if (state.solved) return;
  state.helped.add(state.index);
  $("#hintText").textContent=domain().hint; $("#hintText").hidden=false;
  $("#targetBoard").innerHTML=boardSvg(current(),current().target,{label:t("target"),guide:true});
}

function next() {
  if (!state.solved || $("#completeDialog").open) return;
  if (state.index < state.queue.length-1) { state.index++; render(); return; }
  $("#completeTitle").textContent=t("complete");
  $("#completeText").textContent=`${domain().title} · ${t("solved",{n:state.queue.length})}`;
  $("#supportText").textContent=t("helped",{n:state.helped.size});
  $("#practiceButton").href=`?level=${state.level+1}&practice=1`;
  $("#nextLevelButton").hidden=state.level===4;
  $("#completeDialog").showModal();
}

$("#workshopName").textContent=t("workshop");
$("#domainTabs").setAttribute("aria-label",t("domains"));
$("#principleLabel").textContent=t("principle");
$("#lessonSummary").textContent=t("example");
$("#targetTag").textContent=t("target");
$("#reviewEyebrow").textContent=t("review");
$("#beforeLegend").textContent=t("before"); $("#afterLegend").textContent=t("after");
labelIcon("#backLink","back",t("garden")); action("#worksheetLink","book",t("worksheet"));
labelIcon("#retryButton","retry",t("retry")); action("#hintButton","hint",t("hint"));
action("#replayButton","play",t("replay")); action("#compareButton","hint",t("difference"));
action("#practiceButton","retry",t("practice")); action("#nextLevelButton","next",t("nextDomain"));
$("#gardenButton").textContent=t("garden"); $("#completionIcon").innerHTML=icon("check");
labelIcon("#closeComplete","close",t("close"));
const soundLabel=()=>labelIcon("#soundButton",state.audio?"sound":"muted",t(state.audio?"soundOff":"soundOn"));
soundLabel();
$("#soundButton").addEventListener("click",()=>{state.audio=!state.audio;localStorage.setItem("gfield-audio-muted",String(!state.audio));soundLabel();});
$("#hintButton").addEventListener("click",hint);
$("#retryButton").addEventListener("click",()=>{ state.completed.delete(state.index); render(); });
$("#nextButton").addEventListener("click",next);
$("#replayButton").addEventListener("click",animateReview);
$("#compareButton").addEventListener("click",compareWrong);
$("#nextLevelButton").addEventListener("click",()=>startLevel(state.level+1));
$("#closeComplete").addEventListener("click",()=>$("#completeDialog").close());
document.addEventListener("keydown",(event)=>{
  if ($("#completeDialog").open || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
  if (/^[1-3]$/.test(event.key)) choose(Number(event.key)-1);
  else if (event.key==="Enter" && event.target===document.body) next();
});
startLevel(initial-1);
