import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { levels, PIECE_BY_ID, normalize, orientations, canonical, canonicalArrangement, solveExactCover, viewsOf, validateLevels, PROGRESS_KEY } from "./levels.js?v=soma-2";
import { getLanguage, t } from "./i18n.js?v=soma-3";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

const validation = validateLevels();
console.info("Soma Cube verified", validation);

const $ = (selector) => document.querySelector(selector);
const ui = {
  brandName:$("#brandName"), stageLabel:$("#stageLabel"), problemLabel:$("#problemLabel"), stageDots:$("#stageDots"), missionTitle:$("#missionTitle"), prompt:$("#prompt"),
  targetTitle:$("#targetTitle"), buildTitle:$("#buildTitle"), pieceStatus:$("#pieceStatus"), viewClues:$("#viewClues"), targetViewer:$("#targetViewer"), buildViewer:$("#buildViewer"), choiceGrid:$("#choiceGrid"),
  trayTitle:$("#trayTitle"), pieceTray:$("#pieceTray"), hintButton:$("#hintButton"), clearButton:$("#clearButton"), skipButton:$("#skipButton"), soundButton:$("#soundButton"), levelButton:$("#levelButton"),
  cubiGuide:$("#cubiGuide"), guideBubble:$("#guideBubble"), tutorial:$("#tutorial"), tutorialText:$("#tutorialText"), tutorialDots:$("#tutorialDots"), tutorialSkip:$("#tutorialSkip"), tutorialNext:$("#tutorialNext"),
  levelDialog:$("#levelDialog"), dialogTitle:$("#dialogTitle"), levelList:$("#levelList"), closeLevels:$("#closeLevels"), completeDialog:$("#completeDialog"), completeTitle:$("#completeTitle"), completeText:$("#completeText"), nextLevelButton:$("#nextLevelButton"), practiceButton:$("#practiceButton"), districtLink:$("#districtLink"),
  success:$("#success"), toast:$("#toast"), rotateMessage:$("#rotateMessage"), rotateExit:$("#rotateExit")
};

const saved = readGameProgress("somaCube") || {};
const requested = Number(new URLSearchParams(location.search).get("level"));
const state = {
  lang:getLanguage(),
  levelIndex:Number.isInteger(requested) && requested >= 1 && requested <= 5 ? requested - 1 : Math.max(0, Math.min(4, Number(saved.levelIndex) || 0)),
  queue:[], problemIndex:0, placements:[], selectedId:null, selectedShape:null, solved:false, sound:localStorage.getItem("gfield-sound-muted") !== "1", tutorialStep:-1, hintPlacement:null,
  firstAssemblySignature:null, secondAssemblyGuide:null, transitioning:false, firstAssemblyTimer:0
};

const key = ([x,y,z]) => `${x},${y},${z}`;
const sameCells = (a,b) => a.length === b.length && [...a].map(key).sort().join("|") === [...b].map(key).sort().join("|");
const currentLevel = () => levels[state.levelIndex];
const currentProblem = () => state.queue[state.problemIndex];
const fixedCount = () => currentProblem()?.fixed?.length || 0;
const placedIds = () => new Set(state.placements.map((placement) => placement.pieceId));
const allPieceIds = () => [...(currentProblem().pieceIds || []), ...(currentProblem().fixed || []).map((placement) => placement.pieceId)];

function applyCopy() {
  document.documentElement.lang = state.lang;
  ui.brandName.textContent = t(state.lang,"brand");
  ui.targetTitle.textContent = t(state.lang,"target"); ui.buildTitle.textContent = t(state.lang,"build"); ui.trayTitle.textContent = t(state.lang,"tray");
  ui.hintButton.textContent = t(state.lang,"hint"); ui.clearButton.textContent = t(state.lang,"clear"); ui.skipButton.textContent = t(state.lang,"skip"); ui.levelButton.textContent = t(state.lang,"level");
  ui.dialogTitle.textContent = t(state.lang,"levelPick"); ui.completeTitle.textContent = t(state.lang,"completeTitle"); ui.completeText.textContent = t(state.lang,"completeText");
  ui.nextLevelButton.textContent = t(state.lang,"nextLevel"); ui.practiceButton.textContent = t(state.lang,"practice"); ui.districtLink.textContent = t(state.lang,"district");
  ui.tutorialSkip.textContent = t(state.lang,"tutorialSkip"); ui.rotateMessage.textContent = t(state.lang,"rotate"); ui.rotateExit.textContent = t(state.lang,"exit");
  const rotateActions = t(state.lang,"rotateActions");
  document.querySelectorAll("[data-rotate]").forEach((button,index)=>{const label=rotateActions[index];button.title=label;button.setAttribute("aria-label",label);button.querySelector("span").textContent=label});
  ui.soundButton.classList.toggle("muted",!state.sound); ui.soundButton.textContent = state.sound ? "♪" : "×";
}

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.remove("show"); void ui.toast.offsetWidth; ui.toast.classList.add("show");
}

let guideTimer = 0;
function showGuide(message, duration=1900) {
  clearTimeout(guideTimer); ui.guideBubble.textContent = message; ui.cubiGuide.classList.add("show");
  guideTimer = setTimeout(() => ui.cubiGuide.classList.remove("show"),duration);
}

function placementSound() {
  if (!state.sound) return;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const now = context.currentTime; const oscillator = context.createOscillator(); const gain = context.createGain();
  oscillator.type="triangle"; oscillator.frequency.setValueAtTime(260,now); oscillator.frequency.exponentialRampToValueAtTime(390,now+.12);
  gain.gain.setValueAtTime(.09,now); gain.gain.exponentialRampToValueAtTime(.0001,now+.18); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(now+.2); setTimeout(()=>context.close(),300);
}

function successSound() {
  if (!state.sound) return;
  const audio = new Audio(`../../assets/audio/cubi/success/${state.lang}/success.mp3`);
  audio.volume=.85; audio.play().catch(()=>placementSound());
}

function awardPoints(problemId) {
  const rewardId = `soma-cube:${problemId}`;
  const rewarded = new Set(JSON.parse(localStorage.getItem("gfield-rewarded-games") || "[]"));
  if (rewarded.has(rewardId)) return;
  rewarded.add(rewardId); localStorage.setItem("gfield-rewarded-games",JSON.stringify([...rewarded]));
  localStorage.setItem("gfield-points",String((Number(localStorage.getItem("gfield-points")) || 120) + 20));
}

const cubeGeometry = new RoundedBoxGeometry(.92,.92,.92,4,.07);
const markerGeometry = new THREE.SphereGeometry(.2,18,12);

function woodTexture() {
  const canvas=document.createElement("canvas"); canvas.width=256; canvas.height=256; const context=canvas.getContext("2d");
  const gradient=context.createLinearGradient(0,0,256,256); gradient.addColorStop(0,"#f4d7a2"); gradient.addColorStop(.5,"#d39a5c"); gradient.addColorStop(1,"#b8733e"); context.fillStyle=gradient; context.fillRect(0,0,256,256);
  context.globalAlpha=.16; context.strokeStyle="#704421"; for(let y=12;y<256;y+=18){context.beginPath();for(let x=0;x<=256;x+=8)context.lineTo(x,y+Math.sin(x*.045+y)*3);context.stroke()} context.globalAlpha=1;
  const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; texture.wrapS=texture.wrapT=THREE.RepeatWrapping; return texture;
}
const woodMap=woodTexture();

function makeViewer(host, interactive=false) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0xf7f1e4);
  const camera=new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(5.2,4.8,6.4);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; host.append(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.enablePan=false; controls.minDistance=4; controls.maxDistance=11; controls.target.set(0,1,0); controls.enabled=true;
  scene.add(new THREE.HemisphereLight(0xfff5dc,0x6f776f,1.8)); const sun=new THREE.DirectionalLight(0xffffff,2.1); sun.position.set(5,8,5); sun.castShadow=true; scene.add(sun);
  const floor=new THREE.Mesh(new THREE.BoxGeometry(4.2,.18,4.2),new THREE.MeshStandardMaterial({map:woodMap,color:0xdab174,roughness:.72})); floor.position.y=-.14; floor.receiveShadow=true; scene.add(floor);
  const grid=new THREE.GridHelper(3,3,0x80613d,0xb39368); grid.position.y=-.04; scene.add(grid);
  const content=new THREE.Group(); const markers=new THREE.Group(); scene.add(content,markers);
  const viewer={host,scene,camera,renderer,controls,content,markers,interactive,raycaster:new THREE.Raycaster(),pointer:new THREE.Vector2(),down:null};
  const resize=()=>{const rect=host.getBoundingClientRect(); if(!rect.width||!rect.height)return; renderer.setSize(rect.width,rect.height,false); camera.aspect=rect.width/rect.height; camera.updateProjectionMatrix()};
  new ResizeObserver(resize).observe(host); resize(); return viewer;
}

const targetView=makeViewer(ui.targetViewer,false);
const buildView=makeViewer(ui.buildViewer,true);

function materialFor(id, transparent=false) {
  return new THREE.MeshStandardMaterial({color:PIECE_BY_ID[id]?.color || 0xd8a467,map:woodMap,roughness:.56,metalness:.02,transparent,opacity:transparent?.28:1,depthWrite:!transparent});
}

function boundsOf(cells) {
  const max=[0,1,2].map((axis)=>Math.max(...cells.map((cell)=>cell[axis]))); const min=[0,1,2].map((axis)=>Math.min(...cells.map((cell)=>cell[axis]))); return {min,max,center:max.map((value,axis)=>(value+min[axis])/2)};
}

function worldCell(cell,bounds) { return new THREE.Vector3(cell[0]-bounds.center[0],cell[1]+.48,cell[2]-bounds.center[2]); }

function addPiece(group,placement,bounds,{ghost=false,fixed=false,index=-1}={}) {
  const holder=new THREE.Group(); holder.userData={placementIndex:index,fixed};
  const material=materialFor(placement.pieceId,ghost);
  placement.cells.forEach((cell)=>{const mesh=new THREE.Mesh(cubeGeometry,material);mesh.position.copy(worldCell(cell,bounds));mesh.castShadow=!ghost;mesh.receiveShadow=true;mesh.userData={placementIndex:index,fixed};holder.add(mesh)});
  group.add(holder); return holder;
}

function addOutlineCells(group,cells,bounds) {
  const edgeGeometry=new THREE.EdgesGeometry(cubeGeometry); const edgeMaterial=new THREE.LineBasicMaterial({color:0x287d86,transparent:true,opacity:.3});
  cells.forEach((cell)=>{const lines=new THREE.LineSegments(edgeGeometry,edgeMaterial);lines.position.copy(worldCell(cell,bounds));group.add(lines)});
}

function addTargetEnvelope(group,bounds) {
  const size=[0,1,2].map((axis)=>bounds.max[axis]-bounds.min[axis]+1+.08);
  const geometry=new THREE.BoxGeometry(...size);
  const shell=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x9dd7d4,transparent:true,opacity:.055,side:THREE.BackSide,depthWrite:false}));
  shell.position.set(0,(bounds.min[1]+bounds.max[1])/2+.48,0);
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:0x338f98,transparent:true,opacity:.72}));
  edge.position.copy(shell.position); group.add(shell,edge);
}

function clearGroup(group) { while(group.children.length){const child=group.children.pop();child.traverse?.((node)=>{if(node.material && !Array.isArray(node.material))node.material.dispose?.();if(node.geometry&&node.geometry!==cubeGeometry&&node.geometry!==markerGeometry)node.geometry.dispose?.()})} }

function frameViewer(viewer,cells) {
  const bounds=boundsOf(cells); const span=Math.max(...bounds.max.map((value,axis)=>value-bounds.min[axis]+1)); const distance=span*2.1+2.3;
  viewer.camera.position.set(distance*.72,distance*.64,distance*.86); viewer.controls.target.set(0,Math.max(.7,(bounds.max[1]+1)*.42),0); viewer.controls.update();
}

function renderTarget() {
  const problem=currentProblem(); clearGroup(targetView.content); clearGroup(targetView.markers);
  const cells=problem.target || []; if(!cells.length)return; const bounds=boundsOf(cells);
  if(problem.mode==="recognize") addPiece(targetView.content,{pieceId:problem.targetPieceId,cells:problem.target},bounds,{ghost:false});
  else if(problem.mode==="assemble"&&problem.reference?.length) {
    problem.reference.forEach((placement)=>addPiece(targetView.content,placement,bounds));
  } else {
    cells.forEach((cell)=>{const mesh=new THREE.Mesh(cubeGeometry,new THREE.MeshStandardMaterial({color:0xd6b378,map:woodMap,roughness:.62}));mesh.position.copy(worldCell(cell,bounds));mesh.castShadow=true;mesh.receiveShadow=true;targetView.content.add(mesh)});
    addOutlineCells(targetView.content,cells,bounds);
  }
  frameViewer(targetView,cells);
}

function rotateShape(shape,axis) {
  const rotate={x:([x,y,z])=>[x,-z,y],y:([x,y,z])=>[z,y,-x],z:([x,y,z])=>[-y,x,z]}[axis]; return normalize(shape.map(rotate));
}

function candidatesFor(pieceId,shape) {
  const problem=currentProblem(); if(!pieceId||!shape)return [];
  const target=new Set(problem.target.map(key)); const occupied=new Set(state.placements.flatMap((placement)=>placement.cells.map(key))); const max=[0,1,2].map((axis)=>Math.max(...problem.target.map((cell)=>cell[axis]))); const size=[0,1,2].map((axis)=>Math.max(...shape.map((cell)=>cell[axis]))+1); const candidates=[];
  for(let x=0;x<=max[0]-size[0]+1;x+=1)for(let y=0;y<=max[1]-size[1]+1;y+=1)for(let z=0;z<=max[2]-size[2]+1;z+=1){
    const cells=shape.map(([cx,cy,cz])=>[cx+x,cy+y,cz+z]); if(!cells.every((cell)=>target.has(key(cell))&&!occupied.has(key(cell))))continue;
    const supported=cells.some(([cx,cy,cz])=>cy===0||occupied.has(key([cx,cy-1,cz]))); if(!supported)continue;
    candidates.push({pieceId,cells});
  }
  return candidates;
}

function candidatePlacements() { return candidatesFor(state.selectedId,state.selectedShape); }

function renderBuild() {
  const problem=currentProblem(); clearGroup(buildView.content); clearGroup(buildView.markers); if(problem.mode==="recognize")return;
  const bounds=boundsOf(problem.target);
  if(problem.mode==="complete-cube"||problem.mode==="all-seven")addTargetEnvelope(buildView.content,bounds);
  state.placements.forEach((placement,index)=>addPiece(buildView.content,placement,bounds,{fixed:index<fixedCount(),index}));
  candidatePlacements().forEach((placement,index)=>{
    const center=placement.cells.reduce((sum,cell)=>sum.add(worldCell(cell,bounds)),new THREE.Vector3()).multiplyScalar(1/placement.cells.length);
    const marker=new THREE.Mesh(markerGeometry,new THREE.MeshStandardMaterial({color:index===0?0xffd94a:0x54c7c4,emissive:0x2b7778,emissiveIntensity:.45,transparent:true,opacity:.72})); marker.position.copy(center); marker.userData={candidate:placement}; buildView.markers.add(marker);
  });
  if(state.hintPlacement){const hint=addPiece(buildView.markers,state.hintPlacement,bounds,{ghost:true});hint.traverse((node)=>{if(node.material){node.material.color.set(0xffdf51);node.material.opacity=.38}})}
  frameViewer(buildView,problem.target);
}

const thumbnailCache = new Map();
const thumbnailCanvas = document.createElement("canvas");
const thumbnailRenderer = new THREE.WebGLRenderer({canvas:thumbnailCanvas,antialias:true,alpha:true});
const thumbnailScene = new THREE.Scene();
const thumbnailCamera = new THREE.PerspectiveCamera(32,4/3,.1,20);
const thumbnailContent = new THREE.Group();
let thumbnailMaterial = null;
thumbnailRenderer.setSize(240,180,false);
thumbnailRenderer.setPixelRatio(1);
thumbnailScene.add(new THREE.HemisphereLight(0xffffff,0x7d746b,2),thumbnailContent);
const thumbnailLight = new THREE.DirectionalLight(0xffffff,2);
thumbnailLight.position.set(4,6,5);
thumbnailScene.add(thumbnailLight);

function makeThumbnail(cells,color="#d9a365") {
  const cacheKey = `${color}:${normalize(cells).map(key).join(";")}`;
  if (thumbnailCache.has(cacheKey)) return thumbnailCache.get(cacheKey);
  thumbnailContent.clear();
  thumbnailMaterial?.dispose();
  thumbnailMaterial=new THREE.MeshStandardMaterial({color,map:woodMap,roughness:.58});
  const bounds=boundsOf(cells);
  cells.forEach((cell)=>{const mesh=new THREE.Mesh(cubeGeometry,thumbnailMaterial);mesh.position.copy(worldCell(cell,bounds));thumbnailContent.add(mesh)});
  const span=Math.max(...bounds.max.map((value,axis)=>value-bounds.min[axis]+1));
  thumbnailCamera.position.set(span*1.72,span*1.48,span*1.98);thumbnailCamera.lookAt(0,.62,0);
  thumbnailRenderer.render(thumbnailScene,thumbnailCamera);
  const url=thumbnailCanvas.toDataURL("image/webp",.86);thumbnailCache.set(cacheKey,url);return url;
}

function renderChoices() {
  const problem=currentProblem(); const recognize=problem.mode==="recognize"; ui.choiceGrid.replaceChildren(); ui.choiceGrid.hidden=!recognize; ui.buildViewer.closest(".viewer-panel").classList.toggle("choice-mode",recognize);
  if(!recognize)return;
  ui.choiceGrid.style.gridTemplateColumns=`repeat(${problem.options.length},minmax(0,1fr))`;
  problem.options.forEach((cells,index)=>{const button=document.createElement("button");button.type="button";button.className="choice-card";button.innerHTML=`<img alt="" src="${makeThumbnail(cells)}"><span>${index+1}</span>`;button.addEventListener("click",()=>chooseOption(index,button));ui.choiceGrid.append(button)});
}

function renderTray() {
  const problem=currentProblem(); ui.pieceTray.replaceChildren(); const ids=problem.mode==="recognize"?[]:problem.pieceIds;
  ids.forEach((id)=>{const piece=PIECE_BY_ID[id];const shownCells=state.selectedId===id&&state.selectedShape?state.selectedShape:piece.cells;const button=document.createElement("button");button.type="button";button.className="piece-card";button.dataset.piece=id;button.innerHTML=`<img alt="" src="${makeThumbnail(shownCells,piece.color)}"><span>${id}</span>`;const isPlaced=placedIds().has(id);button.classList.toggle("placed",isPlaced);button.classList.toggle("selected",state.selectedId===id);button.addEventListener("click",()=>selectPiece(id));ui.pieceTray.append(button)});
  ui.pieceStatus.textContent=problem.mode==="recognize"?"":t(state.lang,"pieces",{done:state.placements.length-fixedCount(),total:problem.pieceIds.length});
}

function renderViewClues() {
  ui.viewClues.replaceChildren(); const problem=currentProblem(); ui.viewClues.hidden=problem.mode!=="views"; if(problem.mode!=="views")return;
  const views=viewsOf(problem.target); ["top","front","right"].forEach((name)=>{const cells=views[name].split(";").filter(Boolean).map((entry)=>entry.split(",").map(Number));const width=Math.max(...cells.map((cell)=>cell[0]))+1;const height=Math.max(...cells.map((cell)=>cell[1]))+1;const chip=document.createElement("span");chip.className="view-chip";chip.style.setProperty("--w",width);const set=new Set(cells.map(key));for(let row=height-1;row>=0;row-=1)for(let col=0;col<width;col+=1){const dot=document.createElement("i");dot.style.opacity=set.has(`${col},${row}`)?1:0;chip.append(dot)}ui.viewClues.append(chip)});
}

function renderStatus() {
  const level=currentLevel(); ui.stageLabel.textContent=`${t(state.lang,"stageNames")[state.levelIndex]} · ${t(state.lang,"difficultyLabels")[level.difficulty]}`; ui.problemLabel.textContent=`${state.problemIndex+1} / ${state.queue.length}`; ui.stageDots.textContent="●".repeat(state.levelIndex+1)+"○".repeat(4-state.levelIndex); ui.missionTitle.textContent=t(state.lang,"levelTitles")[state.levelIndex]; ui.prompt.textContent=state.levelIndex===4&&state.firstAssemblySignature?t(state.lang,"secondWayPrompt"):t(state.lang,"prompts")[state.levelIndex];
  const recognize=currentProblem().mode==="recognize";ui.pieceTray.closest(".piece-tray").hidden=recognize;document.querySelector(".rotate-tools").hidden=recognize;ui.clearButton.hidden=recognize;ui.clearButton.disabled=recognize||state.placements.length===fixedCount(); document.querySelectorAll("[data-rotate]").forEach((button)=>button.disabled=!state.selectedId||state.solved); ui.hintButton.disabled=state.solved; ui.skipButton.textContent=t(state.lang,"skip");
  ui.clearButton.disabled ||= state.transitioning; ui.hintButton.disabled ||= state.transitioning; ui.skipButton.disabled=state.transitioning;
}

function renderAll() { renderStatus(); renderTarget(); renderBuild(); renderChoices(); renderTray(); renderViewClues(); }

function selectPiece(id) {
  if(state.solved||state.transitioning)return; state.selectedId=id; state.selectedShape=normalize(PIECE_BY_ID[id].cells); state.hintPlacement=null; renderTray(); renderBuild(); renderStatus(); showGuide(t(state.lang,"selectPlace"));
}

function rotateSelected(axis) {
  if(!state.selectedShape||state.solved||state.transitioning)return; state.selectedShape=rotateShape(state.selectedShape,axis); state.hintPlacement=null; renderBuild(); placementSound();
}

function placeFirstCandidate() {
  const candidate = state.hintPlacement || candidatePlacements()[0];
  if (candidate) tryPlace(candidate);
  else if (state.selectedId) showToast(t(state.lang,"invalid"));
}

function tryPlace(candidate) {
  if(state.solved||state.transitioning)return; const problem=currentProblem(); const proposed=[...state.placements,{pieceId:candidate.pieceId,cells:candidate.cells.map((cell)=>[...cell])}];
  const completions=solveExactCover(problem.target,allPieceIds(),proposed,state.firstAssemblySignature?16:1);
  const hasCompletion=state.firstAssemblySignature
    ? completions.some((assembly)=>canonicalArrangement(assembly)!==state.firstAssemblySignature)
    : completions.length>0;
  if(!hasCompletion){showToast(t(state.lang,"invalid"));return}
  if(state.levelIndex===4&&state.firstAssemblySignature&&proposed.flatMap((placement)=>placement.cells).length===problem.target.length&&canonicalArrangement(proposed)===state.firstAssemblySignature){showGuide(t(state.lang,"anotherWay"),2600);return}
  state.placements=proposed; state.selectedId=null; state.selectedShape=null; state.hintPlacement=null; placementSound(); renderAll(); checkComplete();
}

function removePlacement(index) {
  if(index<fixedCount()||state.solved||state.transitioning)return; const [removed]=state.placements.splice(index,1);state.selectedId=removed.pieceId;state.selectedShape=normalize(PIECE_BY_ID[removed.pieceId].cells);state.hintPlacement=null;showToast(t(state.lang,"removed"));renderAll();
}

function checkComplete() {
  const problem=currentProblem();const occupied=state.placements.flatMap((placement)=>placement.cells);if(occupied.length!==problem.target.length||new Set(occupied.map(key)).size!==problem.target.length||!problem.target.every((cell)=>occupied.some((other)=>key(other)===key(cell))))return;
  if(state.levelIndex===4&&!state.firstAssemblySignature){
    state.firstAssemblySignature=canonicalArrangement(state.placements);state.secondAssemblyGuide=problem.verifiedAssemblies?.find((assembly)=>canonicalArrangement(assembly)!==state.firstAssemblySignature)||null;state.transitioning=true;successSound();ui.success.classList.remove("burst");void ui.success.offsetWidth;ui.success.classList.add("burst");showGuide(t(state.lang,"firstWaySolved"),2600);renderStatus();
    const problemId=problem.id;state.firstAssemblyTimer=setTimeout(()=>{if(currentProblem().id!==problemId||state.solved)return;state.placements=(problem.fixed||[]).map((placement)=>({pieceId:placement.pieceId,cells:placement.cells.map((cell)=>[...cell])}));state.selectedId=null;state.selectedShape=null;state.hintPlacement=null;state.transitioning=false;renderAll();showGuide(t(state.lang,"secondWayPrompt"),2800)},1350);return;
  }
  state.solved=true;awardPoints(problem.id);saveGameProgress(PROGRESS_KEY,{levelIndex:state.levelIndex,problemIndex:state.problemIndex,completedProblem:problem.id});successSound();ui.success.classList.remove("burst");void ui.success.offsetWidth;ui.success.classList.add("burst");showGuide(t(state.lang,state.levelIndex===4?"twoWaysSolved":"solved"),2600);renderStatus();
}

function chooseOption(index,button) {
  if(state.solved)return; const problem=currentProblem();if(index!==problem.answer){button.classList.add("wrong");setTimeout(()=>button.classList.remove("wrong"),500);showToast(t(state.lang,"wrongChoice"));return}
  state.solved=true;button.classList.add("correct");awardPoints(problem.id);successSound();ui.success.classList.remove("burst");void ui.success.offsetWidth;ui.success.classList.add("burst");showGuide(t(state.lang,"correctChoice"),2400);renderStatus();
}

function giveHint() {
  if(state.solved||state.transitioning)return;const problem=currentProblem();if(problem.mode==="recognize"){const answer=ui.choiceGrid.children[problem.answer];answer?.classList.add("correct");setTimeout(()=>answer?.classList.remove("correct"),1200);showGuide(t(state.lang,"hintText"));return}
  if(state.levelIndex===4&&state.firstAssemblySignature&&state.secondAssemblyGuide){const used=placedIds();const occupied=new Set(state.placements.flatMap((placement)=>placement.cells.map(key)));const guided=state.secondAssemblyGuide.find((placement)=>!used.has(placement.pieceId)&&placement.cells.every((cell)=>!occupied.has(key(cell)))&&placement.cells.some(([x,y,z])=>y===0||occupied.has(key([x,y-1,z]))));if(guided){state.selectedId=guided.pieceId;state.selectedShape=normalize(guided.cells);state.hintPlacement={pieceId:guided.pieceId,cells:guided.cells.map((cell)=>[...cell])};renderTray();ui.pieceTray.querySelector(`[data-piece="${guided.pieceId}"]`)?.classList.add("hint");renderBuild();renderStatus();showGuide(t(state.lang,"hintText"));return}}
  let next=null;let nextShape=null;const used=placedIds();for(const id of problem.pieceIds){if(used.has(id))continue;for(const shape of orientations(PIECE_BY_ID[id].cells)){const candidate=candidatesFor(id,shape).find((placement)=>{const proposed=[...state.placements,placement];if(!solveExactCover(problem.target,allPieceIds(),proposed,1).length)return false;if(state.levelIndex===4&&state.firstAssemblySignature&&proposed.flatMap((item)=>item.cells).length===problem.target.length&&canonicalArrangement(proposed)===state.firstAssemblySignature)return false;return true});if(candidate){next=candidate;nextShape=shape;break}}if(next)break}if(!next){showToast(t(state.lang,"invalid"));return}state.selectedId=next.pieceId;state.selectedShape=nextShape;state.hintPlacement={pieceId:next.pieceId,cells:next.cells.map((cell)=>[...cell])};renderTray();ui.pieceTray.querySelector(`[data-piece="${next.pieceId}"]`)?.classList.add("hint");renderBuild();renderStatus();showGuide(t(state.lang,"hintText"));
}

function clearMovable() {if(currentProblem().mode==="recognize")return;if(!confirm(t(state.lang,"clearConfirm")))return;state.placements=state.placements.slice(0,fixedCount());state.selectedId=null;state.selectedShape=null;state.hintPlacement=null;renderAll()}

function advanceProblem() {
  if(!state.solved&&!confirm(t(state.lang,"skipConfirm")))return;
  if(state.problemIndex>=state.queue.length-1){ui.completeDialog.hidden=false;return}
  state.problemIndex+=1;loadProblem();
}

function loadProblem() {
  clearTimeout(state.firstAssemblyTimer);const problem=currentProblem();state.placements=(problem.fixed||[]).map((placement)=>({pieceId:placement.pieceId,cells:placement.cells.map((cell)=>[...cell])}));state.selectedId=null;state.selectedShape=null;state.hintPlacement=null;state.solved=false;state.firstAssemblySignature=null;state.secondAssemblyGuide=null;state.transitioning=false;saveGameProgress(PROGRESS_KEY,{levelIndex:state.levelIndex,problemIndex:state.problemIndex});renderAll();
  if(shouldTutorial())openTutorial();
}

function selectLevel(index) {
  state.levelIndex=index;state.queue=currentLevel().session();state.problemIndex=0;ui.levelDialog.hidden=true;localStorage.setItem("soma-cube-level",String(index));loadProblem();renderLevels();
}

function renderLevels() {
  ui.levelList.replaceChildren();levels.forEach((level,index)=>{const button=document.createElement("button");button.type="button";button.className="level-card";button.classList.toggle("active",index===state.levelIndex);button.innerHTML=`<span>${t(state.lang,"stageNames")[index]} · ${t(state.lang,"difficultyLabels")[level.difficulty]}</span><b>${t(state.lang,"levelTitles")[index]}</b><small>${t(state.lang,"levelDescriptions")[index]}</small>`;button.addEventListener("click",()=>selectLevel(index));ui.levelList.append(button)});
}

function shouldTutorial(){return state.levelIndex===0&&state.problemIndex===0&&(new URLSearchParams(location.search).get("tutorial")==="1"||localStorage.getItem("gfield-soma-tutorial-v1")!=="done")}
function renderTutorial(){const messages=t(state.lang,"tutorial");ui.tutorialText.textContent=messages[state.tutorialStep];ui.tutorialNext.textContent=state.tutorialStep===messages.length-1?t(state.lang,"tutorialDone"):t(state.lang,"tutorialNext");ui.tutorialDots.replaceChildren(...messages.map((_,index)=>{const dot=document.createElement("i");dot.classList.toggle("active",index===state.tutorialStep);return dot}))}
function openTutorial(){state.tutorialStep=0;ui.tutorial.hidden=false;renderTutorial()}
function closeTutorial(){state.tutorialStep=-1;ui.tutorial.hidden=true;localStorage.setItem("gfield-soma-tutorial-v1","done")}
function nextTutorial(){const messages=t(state.lang,"tutorial");if(state.tutorialStep>=messages.length-1){closeTutorial();return}state.tutorialStep+=1;renderTutorial()}

function pointerPosition(event,viewer){const rect=viewer.renderer.domElement.getBoundingClientRect();viewer.pointer.set(((event.clientX-rect.left)/rect.width)*2-1,-((event.clientY-rect.top)/rect.height)*2+1)}
buildView.renderer.domElement.addEventListener("pointerdown",(event)=>{buildView.down={x:event.clientX,y:event.clientY}});
buildView.renderer.domElement.addEventListener("pointerup",(event)=>{if(!buildView.down||Math.hypot(event.clientX-buildView.down.x,event.clientY-buildView.down.y)>7)return;pointerPosition(event,buildView);buildView.raycaster.setFromCamera(buildView.pointer,buildView.camera);const marker=buildView.raycaster.intersectObjects(buildView.markers.children,true).find((hit)=>hit.object.userData.candidate);if(marker){tryPlace(marker.object.userData.candidate);return}const placed=buildView.raycaster.intersectObjects(buildView.content.children,true).find((hit)=>Number.isInteger(hit.object.userData.placementIndex));if(placed)removePlacement(placed.object.userData.placementIndex)});

document.querySelectorAll("[data-rotate]").forEach((button)=>button.addEventListener("click",()=>rotateSelected(button.dataset.rotate)));
ui.hintButton.addEventListener("click",giveHint);ui.clearButton.addEventListener("click",clearMovable);ui.skipButton.addEventListener("click",advanceProblem);ui.levelButton.addEventListener("click",()=>ui.levelDialog.hidden=false);ui.closeLevels.addEventListener("click",()=>ui.levelDialog.hidden=true);
ui.soundButton.addEventListener("click",()=>{state.sound=!state.sound;localStorage.setItem("gfield-sound-muted",state.sound?"0":"1");applyCopy()});
ui.tutorialSkip.addEventListener("click",closeTutorial);ui.tutorialNext.addEventListener("click",nextTutorial);ui.nextLevelButton.addEventListener("click",()=>{ui.completeDialog.hidden=true;selectLevel(Math.min(4,state.levelIndex+1))});ui.practiceButton.addEventListener("click",()=>{const url=new URL(location.href);url.searchParams.set("level",String(state.levelIndex+1));url.searchParams.set("practice","1");url.searchParams.delete("tutorial");location.assign(url)});
document.addEventListener("keydown",(event)=>{if(event.key==="Escape"){if(!ui.tutorial.hidden)closeTutorial();else if(!ui.levelDialog.hidden)ui.levelDialog.hidden=true;else if(!ui.completeDialog.hidden)ui.completeDialog.hidden=true}if(event.key==="Enter"&&state.selectedId&&!state.solved)placeFirstCandidate()});

function animate(){requestAnimationFrame(animate);targetView.controls.update();buildView.controls.update();targetView.renderer.render(targetView.scene,targetView.camera);buildView.renderer.render(buildView.scene,buildView.camera)}

applyCopy();renderLevels();state.queue=currentLevel().session();if(new URLSearchParams(location.search).get("practice")==="1"){const clean=new URL(location.href);clean.searchParams.delete("practice");history.replaceState(null,"",clean)}state.problemIndex=0;loadProblem();if(!requested)ui.levelDialog.hidden=false;animate();
