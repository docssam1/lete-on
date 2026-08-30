import { levels, validateLevels, directionInfo, roll, rollMany, visibleFaces, PROGRESS_KEY } from "./levels.js?v=dice-roll-2";
import { sessionProblems } from "../../shared/problem-pool.js";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";
import { DiceRouteScene } from "./route-scene.js?v=dice-roll-1";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const saved = readGameProgress(PROGRESS_KEY);
const SESSION_SIZE = 5;
const requestedLevel = Number(params.get("level")) || Number(saved.level) || 1;
const state = {
  level: Math.min(levels.length, Math.max(1, requestedLevel)), problemIndex: 0, queue: [],
  orientation: null, step: 0, solved: false, method: localStorage.getItem("gfield-dice-roll-method-v2") || "solid",
  flatRevealed: new Set(["top"]), animating: false,
  audio: localStorage.getItem("gfield-audio-muted") !== "true"
};

const ui = {
  board: $("#routeBoard"), die: $("#dieView"), choices: $("#choiceTray"), target: $("#targetDie"),
  directionButtons: [...document.querySelectorAll("#directionPad button")], next: $("#nextButton"), solution: $("#solution"), solutionText: $("#solutionText"),
  toast: $("#toast"), success: $("#success"), levels: $("#levelDialog"), levelList: $("#levelList"), complete: $("#completeDialog")
};
let routeScene = null;

const copy = {
  face: { top: "윗면", front: "앞면", right: "오른쪽 면" },
  promptFace: (face) => `화살표를 따라 굴린 뒤 ${face}의 눈은 몇 개인가요?`,
  promptOrientation: "시계·반시계 방향으로 굴린 뒤 주사위의 눈이 바르게 놓인 것을 골라요.",
  promptRoute: "출발 주사위를 목표 주사위로 만드는 이동 경로를 골라요."
};

function level() { return levels[state.level - 1]; }
function problem() { return state.queue[state.problemIndex]; }

function playTone(kind) {
  if (!state.audio || !window.AudioContext) return;
  try {
    const context = playTone.context ||= new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "wrong" ? "triangle" : "sine";
    oscillator.frequency.value = kind === "wrong" ? 180 : kind === "roll" ? 390 : 760;
    gain.gain.setValueAtTime(.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .18);
    oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .19);
  } catch { /* Sound is optional. */ }
}

function showToast(text) {
  ui.toast.textContent = text; ui.toast.classList.add("show"); clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove("show"), 2200);
}

const faceQuads = {
  top: [[45,50],[100,18],[148,46],[92,78]],
  front: [[45,50],[92,78],[92,142],[45,112]],
  right: [[92,78],[148,46],[148,110],[92,142]]
};
const pipPositions = {
  1:[[.5,.5]], 2:[[.25,.25],[.75,.75]], 3:[[.24,.24],[.5,.5],[.76,.76]],
  4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]], 5:[[.23,.23],[.77,.23],[.5,.5],[.23,.77],[.77,.77]],
  6:[[.25,.2],[.75,.2],[.25,.5],[.75,.5],[.25,.8],[.75,.8]]
};
const flatFaceQuads = {
  top:[[35,35],[65,35],[65,65],[35,65]],
  north:[[0,0],[100,0],[65,35],[35,35]],
  east:[[100,0],[100,100],[65,65],[65,35]],
  south:[[35,65],[65,65],[100,100],[0,100]],
  west:[[0,0],[35,35],[35,65],[0,100]]
};

function pointOnQuad(quad, u, v) {
  const [a,b,c,d] = quad;
  return [
    (1-u)*(1-v)*a[0] + u*(1-v)*b[0] + u*v*c[0] + (1-u)*v*d[0],
    (1-u)*(1-v)*a[1] + u*(1-v)*b[1] + u*v*c[1] + (1-u)*v*d[1]
  ];
}

let dieMaterialSequence = 0;

function dieMaterials(svg) {
  const id = `dieMaterial${dieMaterialSequence += 1}`;
  const defs = document.createElementNS(svg.namespaceURI,"defs");
  const colors = {
    top:[["0%","#fff3c8"],["48%","#efcf83"],["100%","#d9a650"]],
    front:[["0%","#f0c979"],["58%","#d99d49"],["100%","#b97531"]],
    right:[["0%","#dda552"],["55%","#bd772f"],["100%","#8f4e24"]]
  };
  Object.entries(colors).forEach(([face,stops])=>{
    const gradient=document.createElementNS(svg.namespaceURI,"linearGradient");gradient.id=`${id}-${face}`;
    gradient.setAttribute("x1",face==="right"?"0":"0");gradient.setAttribute("y1","0");gradient.setAttribute("x2",face==="top"?"1":"0.8");gradient.setAttribute("y2","1");
    stops.forEach(([offset,color])=>{const stop=document.createElementNS(svg.namespaceURI,"stop");stop.setAttribute("offset",offset);stop.setAttribute("stop-color",color);gradient.append(stop);});defs.append(gradient);
  });
  const sheen=document.createElementNS(svg.namespaceURI,"linearGradient");sheen.id=`${id}-sheen`;sheen.setAttribute("x1","0");sheen.setAttribute("y1","0");sheen.setAttribute("x2","1");sheen.setAttribute("y2","1");
  [["0%","#fff",.7],["25%","#fff",.18],["48%","#fff",0],["82%","#fff",.16],["100%","#fff",0]].forEach(([offset,color,opacity])=>{const stop=document.createElementNS(svg.namespaceURI,"stop");stop.setAttribute("offset",offset);stop.setAttribute("stop-color",color);stop.setAttribute("stop-opacity",opacity);sheen.append(stop);});defs.append(sheen);
  const grain=document.createElementNS(svg.namespaceURI,"pattern");grain.id=`${id}-grain`;grain.setAttribute("width","72");grain.setAttribute("height","18");grain.setAttribute("patternUnits","userSpaceOnUse");
  grain.innerHTML='<path d="M-8 5 C12 1 29 8 50 4 S78 2 88 6" fill="none" stroke="#7b4a25" stroke-width="1" stroke-opacity=".16"/><path d="M-5 13 C18 8 38 16 77 11" fill="none" stroke="#fff6d4" stroke-width="1.2" stroke-opacity=".18"/>';
  defs.append(grain);svg.append(defs);return {id};
}

function dieSvg(orientation, { compact = false, blank = false } = {}) {
  const visible = visibleFaces(orientation);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "20 5 150 150"); svg.classList.add("die-svg"); if (compact) svg.classList.add("compact");
  const material=dieMaterials(svg);
  Object.entries(faceQuads).forEach(([face, quad]) => {
    const polygon = document.createElementNS(svg.namespaceURI, "polygon");
    polygon.setAttribute("points", quad.map((point) => point.join(",")).join(" ")); polygon.classList.add("die-face", face);polygon.style.fill=`url(#${material.id}-${face})`;svg.append(polygon);
    const grain=document.createElementNS(svg.namespaceURI,"polygon");grain.setAttribute("points",quad.map((point)=>point.join(",")).join(" "));grain.classList.add("die-grain",face);grain.style.fill=`url(#${material.id}-grain)`;svg.append(grain);
    const gloss=document.createElementNS(svg.namespaceURI,"polygon");gloss.setAttribute("points",quad.map((point)=>point.join(",")).join(" "));gloss.classList.add("die-gloss",face);gloss.style.fill=`url(#${material.id}-sheen)`;svg.append(gloss);
    if (blank) return;
    pipPositions[visible[face]].forEach(([u,v]) => {
      const [cx,cy] = pointOnQuad(quad,u,v); const pip = document.createElementNS(svg.namespaceURI,"circle");
      pip.setAttribute("cx",cx); pip.setAttribute("cy",cy); pip.setAttribute("r",compact ? 4.2 : 5.2); pip.classList.add("pip"); svg.append(pip);
    });
  });
  return svg;
}

function flatDieSvg(orientation,{blank=false,revealed=new Set(Object.keys(flatFaceQuads))}={}) {
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","-4 -4 108 108");svg.classList.add("flat-die-map");
  Object.entries(flatFaceQuads).forEach(([face,quad])=>{
    const isShown=!blank&&revealed.has(face);const polygon=document.createElementNS(svg.namespaceURI,"polygon");polygon.setAttribute("points",quad.map((item)=>item.join(",")).join(" "));polygon.classList.add("flat-face",face,isShown?"is-shown":"is-hidden");polygon.dataset.face=face;svg.append(polygon);
    if(!isShown){const center=quad.reduce((sum,item)=>[sum[0]+item[0]/4,sum[1]+item[1]/4],[0,0]);const mark=document.createElementNS(svg.namespaceURI,"text");mark.setAttribute("x",center[0]);mark.setAttribute("y",center[1]+3);mark.classList.add("flat-question");mark.textContent="?";mark.dataset.face=face;svg.append(mark);return;}
    pipPositions[orientation[face]].forEach(([u,v])=>{const[cx,cy]=pointOnQuad(quad,u,v);const pip=document.createElementNS(svg.namespaceURI,"circle");pip.setAttribute("cx",cx);pip.setAttribute("cy",cy);pip.setAttribute("r","3");pip.classList.add("flat-pip");svg.append(pip);});
  });
  svg.querySelectorAll("[data-face]").forEach((node)=>node.addEventListener("click",()=>revealFlatFace(node.dataset.face)));
  return svg;
}

function routeSvg(p) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${p.cols * 100} ${p.rows * 100}`); svg.classList.add("route-lines");
  const defs = document.createElementNS(svg.namespaceURI,"defs");
  const marker = document.createElementNS(svg.namespaceURI,"marker"); marker.id = "routeArrow"; marker.setAttribute("viewBox","0 0 10 10"); marker.setAttribute("refX","8"); marker.setAttribute("refY","5"); marker.setAttribute("markerWidth","7"); marker.setAttribute("markerHeight","7"); marker.setAttribute("orient","auto-start-reverse");
  const tip = document.createElementNS(svg.namespaceURI,"path"); tip.setAttribute("d","M 0 0 L 10 5 L 0 10 z"); marker.append(tip); defs.append(marker); svg.append(defs);
  p.path.slice(1).forEach((cell,index) => {
    const previous = p.path[index]; const line = document.createElementNS(svg.namespaceURI,"line");
    line.setAttribute("x1",previous[1]*100+50); line.setAttribute("y1",previous[0]*100+50);
    line.setAttribute("x2",cell[1]*100+50); line.setAttribute("y2",cell[0]*100+50);
    line.setAttribute("marker-end","url(#routeArrow)"); line.dataset.step = index + 1; line.dataset.direction = p.directions[index]; svg.append(line);
  });
  return svg;
}

function renderBoard(p) {
  routeScene?.dispose(); routeScene = null;
  ui.board.replaceChildren(); ui.board.style.setProperty("--rows",p.rows); ui.board.style.setProperty("--cols",p.cols);
  const sceneHost = document.createElement("div"); sceneHost.className = "route-3d-host";
  const legacy = document.createElement("div"); legacy.className = "legacy-board";
  const grid = document.createElement("div"); grid.className = "number-grid";
  for (let index=0; index<p.rows*p.cols; index+=1) {
    const cell = document.createElement("span"); cell.textContent = index+1; cell.dataset.index = index; grid.append(cell);
  }
  legacy.append(grid,routeSvg(p));
  const marker = document.createElement("span"); marker.className = "position-marker"; marker.setAttribute("aria-label","격자 위의 주사위"); ui.board.append(marker);
  legacy.append(marker); ui.board.append(sceneHost,legacy);
  routeScene = new DiceRouteScene(sceneHost); routeScene.setProblem(p,state.orientation ?? p.startOrientation,state.step);
  updateMarker();
}

function updateMarker() {
  const p = problem(); const cell = p.path[Math.min(state.step,p.path.length-1)];
  const marker = ui.board.querySelector(".position-marker"); if (!marker || !cell) return;
  ui.board.classList.toggle("is-flat",state.method==="flat");
  marker.style.setProperty("--row",cell[0]); marker.style.setProperty("--col",cell[1]);
  marker.replaceChildren();
  const topFace = state.orientation?.top ?? problem().startOrientation.top;
  marker.setAttribute("aria-label",`윗면이 ${topFace}인 주사위`);
  marker.classList.toggle("flat",state.method==="flat");
  if(state.method==="flat") marker.append(flatDieSvg(state.orientation ?? problem().startOrientation,{revealed:state.flatRevealed}));
  ui.board.querySelectorAll(".route-lines line").forEach((line) => line.classList.toggle("passed",Number(line.dataset.step)<=state.step));
}

function updateDie() {
  ui.die.replaceChildren(dieSvg(state.orientation));
  const visible = visibleFaces(state.orientation);
  $("#topValue").textContent = visible.top; $("#frontValue").textContent = visible.front; $("#rightValue").textContent = visible.right;
  const total = problem().directions.length;
  $("#viewLabel").textContent = state.step ? `${state.step}번 굴린 주사위` : "출발 주사위";
  $("#stepLabel").textContent = state.step ? `${state.step} / ${total}칸` : "출발";
  ui.directionButtons.forEach((button) => {
    button.disabled = state.animating || state.solved || problem().interaction === "route-answer" || !total || state.step >= total;
    button.classList.toggle("just-used",state.step>0 && button.dataset.direction===problem().directions[state.step-1]);
  });
  document.querySelectorAll("#methodSwitch button").forEach((button)=>{button.disabled=state.animating;});
}

function makeChoice(label, value, visual) {
  const button = document.createElement("button"); button.type="button"; button.dataset.value=String(value); button.setAttribute("aria-label",label); button.append(visual);
  button.addEventListener("click",()=>answer(value,button)); return button;
}

function renderChoices(p) {
  ui.choices.replaceChildren(); ui.target.hidden = true; ui.target.replaceChildren();
  if (p.interaction === "face-answer") {
    p.choices.forEach((value,index) => { const strong=document.createElement("strong"); strong.className="number-answer"; strong.textContent=value; ui.choices.append(makeChoice(`보기 ${index+1}: ${value}`,value,strong)); });
    $("#answerTitle").textContent = `도착한 ${copy.face[p.faceKey]}은?`;
  } else if (p.interaction === "orientation-answer") {
    p.choices.forEach((orientation,index) => ui.choices.append(makeChoice(`주사위 보기 ${index+1}`,index,dieSvg(orientation,{compact:true}))));
    $("#answerTitle").textContent = "도착한 주사위는?";
  } else {
    ui.target.hidden=false; ui.target.append(dieSvg(p.finalOrientation,{compact:true}));
    p.routeChoices.forEach((route,index)=>{ const span=document.createElement("span"); span.className="route-choice"; span.textContent=route.map((direction)=>directionInfo[direction].arrow).join(" "); ui.choices.append(makeChoice(`이동 경로 ${index+1}`,index,span)); });
    $("#answerTitle").textContent = "목표 주사위가 되는 경로는?";
  }
}

function renderProblem() {
  const p=problem(); state.orientation=p.startOrientation; state.step=0; state.solved=false;state.flatRevealed=new Set(["top"]);
  ui.next.hidden=true; ui.solution.hidden=true; $("#difficultyLabel").textContent=level().band; $("#missionTitle").textContent=level().title;
  $("#levelLabel").textContent=`${level().band} · ${state.level}단계`; $("#problemLabel").textContent=`${state.problemIndex+1} / ${state.queue.length}`;
  $("#prompt").textContent=p.interaction==="route-answer"?copy.promptRoute:p.interaction==="orientation-answer"?copy.promptOrientation:copy.promptFace(copy.face[p.faceKey]);
  $("#boardTitle").textContent=p.turn ? `${p.turn==="clockwise"?"시계":"시계 반대"} 방향으로 ${p.directions.length}번 굴려요` : p.interaction==="route-answer" ? "출발 자세와 목표 자세를 비교해요" : `화살표 ${p.directions.length}개를 차례로 따라가요`;
  renderBoard(p); updateDie(); renderChoices(p); saveGameProgress(PROGRESS_KEY,{level:state.level,problemIndex:state.problemIndex});
}

function selectMethod(method) {
  if(state.animating)return;
  state.method=method==="flat"?"flat":"solid"; localStorage.setItem("gfield-dice-roll-method-v2",state.method);
  document.querySelectorAll("#methodSwitch button").forEach((button)=>{const active=button.dataset.method===state.method;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});
  if(state.method==="solid")routeScene?.setState(state.orientation,state.step);
  updateMarker();
}

const flatFaceNames={top:"윗면",north:"위쪽 옆면",east:"오른쪽 옆면",south:"앞쪽 옆면",west:"왼쪽 옆면"};
function revealFlatFace(face,announce=true){if(state.method!=="flat"||state.flatRevealed.has(face))return false;state.flatRevealed.add(face);updateMarker();if(announce)showToast(`${flatFaceNames[face]}의 눈을 표시했어요.`);return true;}
function revealUsefulFlatFace(){if(state.method!=="flat"){showToast("납작 주사위를 선택하면 면을 하나씩 표시할 수 있어요.");return;}const direction=problem().directions[state.step];const useful={N:"south",S:"north",E:"west",W:"east"}[direction];if(useful&&revealFlatFace(useful))return;const next=["south","east","north","west"].find((face)=>!state.flatRevealed.has(face));if(next)revealFlatFace(next);else showToast("다섯 면의 눈을 모두 표시했어요.");}

function isCorrect(value) {
  const p=problem(); return p.interaction==="face-answer" ? Number(value)===p.answer : Number(value)===p.answer;
}

function answer(value,button) {
  if(state.solved||state.animating)return;
  if(!isCorrect(value)){button.classList.remove("wrong");void button.offsetWidth;button.classList.add("wrong");playTone("wrong");showToast("굴린 방향과 바뀐 면을 다시 살펴봐요.");return;}
  state.solved=true; button.classList.add("correct"); ui.choices.querySelectorAll("button").forEach((node)=>{node.disabled=true;});
  const p=problem(); state.orientation=p.finalOrientation; state.step=p.directions.length;state.flatRevealed=new Set(Object.keys(flatFaceQuads));routeScene?.setState(state.orientation,state.step);updateMarker(); updateDie();
  ui.solution.hidden=false; const visible=visibleFaces(p.finalOrientation);
  ui.solutionText.textContent=`도착하면 윗면 ${visible.top}, 앞면 ${visible.front}, 오른쪽 면 ${visible.right}이 보여요.`;
  ui.next.hidden=false; ui.success.classList.remove("show");void ui.success.offsetWidth;ui.success.classList.add("show");playTone("correct");
}

async function rollOne(selectedDirection) {
  const p=problem(); if(state.animating||state.solved||state.step>=p.directions.length)return;
  const direction=p.directions[state.step];
  if(selectedDirection!==direction){playTone("wrong");showToast(`이번 화살표는 ${directionInfo[direction].ko}을 가리켜요.`);return;}
  const nextOrientation=roll(state.orientation,direction); const nextStep=state.step+1;
  state.animating=true;updateDie();playTone("roll");
  if(state.method==="solid")await routeScene?.rollTo(direction,nextOrientation,nextStep);
  state.orientation=nextOrientation; state.step=nextStep;state.flatRevealed=new Set(["top"]);state.animating=false;
  if(state.method==="flat")routeScene?.setState(state.orientation,state.step);
  ui.die.classList.remove("rolling");void ui.die.offsetWidth;ui.die.classList.add("rolling"); updateMarker(); updateDie();
}

function resetRoll() { if(state.animating)return;state.orientation=problem().startOrientation; state.step=0;state.flatRevealed=new Set(["top"]);routeScene?.setState(state.orientation,0); updateMarker(); updateDie(); }

function loadSession() {
  state.queue=sessionProblems("dice-roll",state.level,level().problems,SESSION_SIZE);
  state.problemIndex=!params.has("level")&&Number(saved.level)===state.level?Math.min(SESSION_SIZE-1,Math.max(0,Number(saved.problemIndex)||0)):0;
}

function showComplete(){ $("#nextLevelButton").hidden=state.level>=levels.length; ui.complete.hidden=false; saveGameProgress(PROGRESS_KEY,{level:state.level,problemIndex:0,completed:true}); }
function nextProblem(){if(!state.solved)return;if(state.problemIndex>=state.queue.length-1){showComplete();return;}state.problemIndex+=1;renderProblem();}
function selectLevel(id){if(state.animating)return;state.level=id;state.problemIndex=0;ui.levels.hidden=true;state.queue=sessionProblems("dice-roll",id,level().problems,SESSION_SIZE);history.replaceState({},"",`?level=${id}`);renderProblem();}

function renderLevels(){ui.levelList.replaceChildren();levels.forEach((item)=>{const button=document.createElement("button");button.type="button";button.innerHTML=`<span>${item.id}</span><strong>${item.band} · ${item.title}</strong><small>${item.subtitle}</small>`;button.addEventListener("click",()=>selectLevel(item.id));ui.levelList.append(button);});}

ui.directionButtons.forEach((button)=>button.addEventListener("click",()=>rollOne(button.dataset.direction))); $("#resetButton").addEventListener("click",resetRoll); ui.next.addEventListener("click",nextProblem);
$("#hintButton").addEventListener("click",()=>{const p=problem();if(state.method==="flat"){revealUsefulFlatFace();return;}if(p.interaction==="route-answer")showToast("같은 방향 두 번과 서로 다른 방향 두 번의 면 변화를 비교해요.");else if(state.step<p.directions.length)showToast(`다음에는 ${directionInfo[p.directions[state.step]].ko}으로 굴려요. 굴러가는 쪽의 반대 면이 위로 올라옵니다.`);else showToast("윗면뿐 아니라 앞면과 오른쪽 면도 함께 확인해요.");});
$("#levelButton").addEventListener("click",()=>{ui.levels.hidden=false;}); $("#closeLevels").addEventListener("click",()=>{ui.levels.hidden=true;});
$("#practiceButton").addEventListener("click",()=>{ui.complete.hidden=true;state.queue=sessionProblems("dice-roll",state.level,level().problems,SESSION_SIZE);state.problemIndex=0;renderProblem();});
$("#nextLevelButton").addEventListener("click",()=>{if(state.level<levels.length){ui.complete.hidden=true;selectLevel(state.level+1);}});
$("#soundButton").addEventListener("click",()=>{state.audio=!state.audio;localStorage.setItem("gfield-audio-muted",String(!state.audio));$("#soundButton").classList.toggle("muted",!state.audio);});
document.querySelectorAll("#methodSwitch button").forEach((button)=>button.addEventListener("click",()=>selectMethod(button.dataset.method)));

loadSession();renderLevels();renderProblem();selectMethod(state.method);
