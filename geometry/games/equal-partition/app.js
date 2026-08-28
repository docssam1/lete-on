import { levels, validateLevels, internalEdges, regionsFromCuts, validateCuts, cutsForRegions, findSolutions } from "./levels.js?v=equal-1";
import { messages, text } from "./i18n.js?v=equal-1";
import { sessionProblems } from "../../shared/problem-pool.js";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();
const $=(selector)=>document.querySelector(selector);
const params=new URLSearchParams(location.search);
const saved=readGameProgress("equalPartition");
const stored=localStorage.getItem("gfield-language")||"ko";
const lang=Object.hasOwn(messages,stored)?stored:"ko";
const requested=Number(params.get("level"))||Number(saved.level)||1;
const SESSION_SIZE=5;
const state={lang,level:levels.some(l=>l.id===requested)?requested:1,queue:[],index:0,cuts:new Set(),history:[],solved:false,wrong:0,hints:0,audio:localStorage.getItem("gfield-audio-muted")!=="true"};
let completedCount=Number(saved.completed)||0;
const t=(key,vars)=>text(state.lang,key,vars);
const currentLevel=()=>levels.find(l=>l.id===state.level);
const problem=()=>state.queue[state.index];
const tutorialKey="gfield-equal-partition-tutorial-v1";
let tutorialStep=0;

function loadSession(){state.queue=sessionProblems("equal-partition",state.level,currentLevel().problems,SESSION_SIZE);state.index=0;}
function tone(kind){if(!state.audio||!window.AudioContext)return;try{const c=tone.context||=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.type=kind==="success"?"triangle":"sine";o.frequency.value=kind==="success"?880:kind==="wrong"?180:520;g.gain.value=.045;o.connect(g).connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+(kind==="success"?.45:.13));o.stop(c.currentTime+(kind==="success"?.46:.14));}catch{}}
function speak(line){if(!state.audio||!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(line);u.lang={ko:"ko-KR",zh:"zh-CN",ja:"ja-JP",en:"en-US"}[state.lang];u.rate=.94;u.pitch=1.12;speechSynthesis.speak(u);}
function toast(line){const node=$("#toast");node.textContent=line;node.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove("show"),2200);}
function cubi(line,voice=false){$("#guideBubble").textContent=line;$("#cubiGuide").classList.add("show");if(voice)speak(line);clearTimeout(cubi.timer);cubi.timer=setTimeout(()=>$("#cubiGuide").classList.remove("show"),4200);}

function svgNode(name,attrs={}){const n=document.createElementNS("http://www.w3.org/2000/svg",name);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n;}
function lineCoords(a,b,size,pad){const [ax,ay]=a,[bx,by]=b;if(ax!==bx){const x=Math.max(ax,bx)*size+pad,y=ay*size+pad;return{x1:x,y1:y,x2:x,y2:y+size};}const x=ax*size+pad,y=Math.max(ay,by)*size+pad;return{x1:x,y1:y,x2:x+size,y2:y};}
function outerSegments(board,size,pad){const set=new Set(board.map(([x,y])=>`${x},${y}`)),segments=[];board.forEach(([x,y])=>{[[[x,y],[x+1,y],[0,-1]],[[x+1,y],[x+1,y+1],[1,0]],[[x,y+1],[x+1,y+1],[0,1]],[[x,y],[x,y+1],[-1,0]]].forEach(([a,b,[dx,dy]])=>{if(!set.has(`${x+dx},${y+dy}`))segments.push({a,b});});});return segments.map(({a,b})=>({x1:a[0]*size+pad,y1:a[1]*size+pad,x2:b[0]*size+pad,y2:b[1]*size+pad}));}
function renderBoard(hintKey=""){
  const p=problem(),size=80,pad=14,maxX=Math.max(...p.board.map(([x])=>x))+1,maxY=Math.max(...p.board.map(([,y])=>y))+1;
  const svg=svgNode("svg",{class:"partition-svg",viewBox:`0 0 ${maxX*size+pad*2} ${maxY*size+pad*2}`,role:"group","aria-label":t("board")});
  const regions=regionsFromCuts(p.board,state.cuts),owner=new Map();regions.forEach((region,i)=>region.forEach(([x,y])=>owner.set(`${x},${y}`,i)));
  p.board.forEach(([x,y])=>{const rect=svgNode("rect",{x:x*size+pad,y:y*size+pad,width:size,height:size,rx:3,class:`cell region-${owner.get(`${x},${y}`)%5}`});svg.append(rect);});
  internalEdges(p.board).forEach((edge)=>{const coords=lineCoords(edge.a,edge.b,size,pad),vertical=edge.a[0]!==edge.b[0],row=Math.min(edge.a[1],edge.b[1])+1,col=Math.max(edge.a[0],edge.b[0]);const hit=svgNode("line",{...coords,class:`edge-hit${edge.key===hintKey?" hinted":""}`,tabindex:"0",role:"button","aria-pressed":String(state.cuts.has(edge.key)),"aria-label":t(vertical?"verticalEdge":"horizontalEdge",{row,col:vertical?col:edge.a[0]+1})});hit.dataset.edge=edge.key;const visible=svgNode("line",{...coords,class:state.cuts.has(edge.key)?"cut-edge":"inner-edge"});svg.append(hit,visible);});
  outerSegments(p.board,size,pad).forEach(coords=>svg.append(svgNode("line",{...coords,class:"outer-edge"})));
  Object.entries(p.markers||{}).forEach(([id,value])=>{const [x,y]=id.split(",").map(Number),cx=x*size+size/2+pad,cy=y*size+size/2+pad;if(value==="marker")svg.append(svgNode("circle",{cx,cy,r:13,class:"marker-dot"}));else{const label=svgNode("text",{x:cx,y:cy,class:"marker-text"});label.textContent=value;svg.append(label);}});
  $("#boardStage").replaceChildren(svg);updateStatus(regions.length);
}

function rules(){const p=problem(),items=[t("ruleArea")];if(p.congruent)items.push(t("ruleCongruent"));if(p.markerRule==="oneEach")items.push(t("ruleMarker"));if(p.markerRule==="equalSum")items.push(t("ruleSum"));return items;}
function updateStatus(regionCount=regionsFromCuts(problem().board,state.cuts).length){$("#regionStatus").textContent=t("regions",{now:regionCount,target:problem().parts});$("#feedback").textContent=state.solved?t("correct"):t("chooseEdge");$("#nextButton").hidden=!state.solved;}
function applyLanguage(){document.documentElement.lang=state.lang;$("#gameName").textContent=t("gameName");$("#rotateMessage").textContent=t("rotate");$("#levelLabel").textContent=t("level",{n:state.level});$("#problemLabel").textContent=t("problem",{now:state.index+1,total:state.queue.length});$("#levelButton").textContent=t("levels");$("#missionTitle").textContent=t(currentLevel().titleKey);$("#prompt").textContent=t(currentLevel().descriptionKey);$("#stars").textContent="*".repeat(state.level)+"-".repeat(5-state.level);$("#boardTitle").textContent=t("board");$("#ruleBadge").textContent=[t("ruleParts",{n:problem().parts}),...rules()].join(" · ");$("#ruleList").replaceChildren(...rules().map(line=>{const li=document.createElement("li");li.textContent=line;return li;}));$("#checkButton").textContent=t("check");$("#undoButton").textContent=t("undo");$("#hintButton").textContent=t("hint");$("#clearButton").textContent=t("clear");$("#nextButton").textContent=t("next");renderLevelList();updateStatus();}
function renderProblem(){state.cuts=new Set();state.history=[];state.solved=false;state.wrong=0;state.hints=0;$("#boardStage").dataset.problemId=problem().id;renderBoard();applyLanguage();}
function toggleEdge(key){if(state.solved)return;state.history.push(new Set(state.cuts));state.cuts.has(key)?state.cuts.delete(key):state.cuts.add(key);tone("tap");renderBoard();requestAnimationFrame(()=>document.querySelector(`.edge-hit[data-edge="${key}"]`)?.focus({preventScroll:true}));}
function check(){if(state.solved)return;const result=validateCuts(problem(),state.cuts);if(result.valid){state.solved=true;completedCount+=1;tone("success");$("#success strong").textContent=["GOOD JOB!","GREAT JOB!","SUCCESS!"][Math.floor(Math.random()*3)];$("#success").classList.add("show");setTimeout(()=>$("#success").classList.remove("show"),1000);cubi(t("correct"),false);saveGameProgress("equalPartition",{level:state.level,problemIndex:state.index,completed:completedCount});updateStatus();return;}state.wrong+=1;tone("wrong");const reason=result.reasons[0]||"notYet";toast(t(reason));$("#feedback").textContent=t(reason);}
function hint(){if(state.solved)return;state.hints+=1;const solution=findSolutions(problem(),1)[0]||problem().sampleRegions;const target=cutsForRegions(solution);const missing=[...target].find(key=>!state.cuts.has(key));const extra=[...state.cuts].find(key=>!target.has(key));const key=missing||extra;if(key){renderBoard(key);toast(t("hintDone"));setTimeout(()=>renderBoard(),1800);}}
function nextProblem(){if(state.index<state.queue.length-1){state.index+=1;renderProblem();return;}openComplete();}

function renderLevelList(){const box=$("#levelList");box.replaceChildren();levels.forEach(level=>{const b=document.createElement("button");b.type="button";b.className="level-choice";b.innerHTML=`<b>${level.id}</b><strong>${t(level.titleKey)}</strong><small>${t(level.descriptionKey)}</small>`;b.addEventListener("click",()=>startLevel(level.id));box.append(b);});$("#levelDialogTitle").textContent=t("dialogTitle");}
function startLevel(id){state.level=id;loadSession();$("#levelDialog").hidden=true;renderProblem();}
function openComplete(){const next=levels.find(l=>l.id===state.level+1);$("#completeTitle").textContent=t("completeTitle");$("#completeText").textContent=t("completeText");$("#nextLevelButton").textContent=t("nextLevel");$("#nextLevelButton").hidden=!next;$("#practiceButton").textContent=t("practice");$("#gardenLink").textContent=t("garden");$("#completeDialog").hidden=false;}
function renderTutorial(){const lines=t("tutorial");$("#tutorialTitle").textContent=t("tutorialTitle");$("#tutorialText").textContent=lines[tutorialStep];$("#tutorialDots").replaceChildren(...lines.map((_,i)=>{const dot=document.createElement("i");dot.classList.toggle("on",i===tutorialStep);return dot;}));$("#tutorialNext").textContent=t(tutorialStep===lines.length-1?"tutorialStart":"tutorialNext");}
function advanceTutorial(){const lines=t("tutorial");if(tutorialStep<lines.length-1){tutorialStep+=1;renderTutorial();return;}localStorage.setItem(tutorialKey,"1");$("#tutorial").hidden=true;}

$("#boardStage").addEventListener("click",e=>{const edge=e.target.closest(".edge-hit");if(edge)toggleEdge(edge.dataset.edge);});
$("#boardStage").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".edge-hit")){e.preventDefault();toggleEdge(e.target.dataset.edge);}});
$("#checkButton").addEventListener("click",check);$("#hintButton").addEventListener("click",hint);$("#clearButton").addEventListener("click",()=>{if(state.solved)return;state.history.push(new Set(state.cuts));state.cuts.clear();renderBoard();});$("#undoButton").addEventListener("click",()=>{if(!state.history.length||state.solved)return;state.cuts=state.history.pop();renderBoard();});$("#nextButton").addEventListener("click",nextProblem);$("#levelButton").addEventListener("click",()=>$("#levelDialog").hidden=false);$("#closeLevels").addEventListener("click",()=>$("#levelDialog").hidden=true);$("#soundButton").addEventListener("click",()=>{state.audio=!state.audio;localStorage.setItem("gfield-audio-muted",String(!state.audio));$("#soundButton").textContent=state.audio?"♪":"×";});$("#tutorialNext").addEventListener("click",advanceTutorial);$("#practiceButton").addEventListener("click",()=>{location.href=`?level=${state.level}&practice=1`;});$("#nextLevelButton").addEventListener("click",()=>{startLevel(state.level+1);$("#completeDialog").hidden=true;});

loadSession();renderProblem();if(!localStorage.getItem(tutorialKey)||params.get("tutorial")==="1"){$("#tutorial").hidden=false;renderTutorial();}
