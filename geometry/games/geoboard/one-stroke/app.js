import {copy} from "./i18n.js?v=euler-1";
import {edgeKey,nodePoint,fresh,usedEdges,lastNode,isSolved,step,undo,isStuck,restoreProgress,validateBank,createTrace} from "./core.js?v=euler-1";
import {createMaterialAudio,bindMaterialAudioButton} from "../../../shared/material-audio.js?v=material-2";

const SAVE="gfield-geoboard-one-stroke-v1",NS="http://www.w3.org/2000/svg";
export async function mount(root){
  let bank;
  const response=await fetch(new URL("./bank.json?v=euler-1",import.meta.url));
  if(!response.ok)throw new Error("One-stroke bank unavailable");
  bank=validateBank(await response.json());
  const wood=new URL("../../../assets/ui/wood-light.webp",import.meta.url).href,frame=new URL("../../../assets/ui/wood-mid.webp",import.meta.url).href;
  await Promise.all([wood,frame].map(url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=url;})));
  let language="ko",saved=null,storageFailed=false;
  try{language=localStorage.getItem("gfield-language")||"ko";saved=JSON.parse(localStorage.getItem(SAVE)||"null");}catch{storageFailed=true;}
  if(!copy[language])language="ko";
  const progress=restoreProgress(bank,saved),params=new URLSearchParams(location.search),asked=Number(params.get("level"));
  if([1,2,3].includes(asked))progress.level=asked;
  const audio=createMaterialAudio(),abort=new AbortController(),options={signal:abort.signal};
  let problem,state=fresh(),gesture=null,feedback="chooseStart",rejected=null,rejectTimer=0,trace=null,disposed=false,layoutReady=false;
  const t=()=>copy[language],questions=()=>bank.problems.filter(p=>p.level===progress.level);
  root.className="one-stroke";root.hidden=false;
  root.innerHTML=`<header class="os-header"><a class="os-icon os-back" href="../../geoboard/" aria-label=""><span aria-hidden="true">←</span></a><div class="os-brand"><small>GFIELD · GEOBOARD</small><h1></h1></div><select class="os-language"><option value="ko">한국어</option><option value="en">English</option><option value="zh">中文</option><option value="ja">日本語</option></select><button class="os-icon os-sound" type="button"></button></header>
    <div class="os-main"><aside class="os-info"><h2 class="os-prompt"></h2><select class="os-level"></select><p class="os-progress"></p><p class="os-message" role="status" aria-live="polite"></p></aside><div class="os-stage"><div class="os-board" role="group"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><pattern id="os-wood" width="100" height="100" patternUnits="userSpaceOnUse"><image width="100" height="100" href="${wood}" preserveAspectRatio="none"/></pattern><pattern id="os-frame" width="100" height="100" patternUnits="userSpaceOnUse"><image width="100" height="100" href="${frame}" preserveAspectRatio="none"/></pattern></defs><rect x="1" y="2" width="98" height="97" rx="2" fill="#80572f"/><rect x="1" y=".5" width="98" height="97" rx="2" fill="url(#os-frame)" stroke="#bc8b4e" stroke-width=".6"/><rect x="3" y="2.5" width="94" height="93" rx=".8" fill="#ebcb91" stroke="#ffe5ae" stroke-width=".6"/><rect x="4" y="3.5" width="92" height="91" fill="url(#os-wood)" stroke="#936a37" stroke-width=".5"/><g class="os-edges"></g><line class="os-live" style="display:none"/><g class="os-shines"></g><g class="os-pegs"></g></svg><div class="os-hits"></div></div></div></div>
    <footer class="os-footer"><button class="os-icon os-undo" type="button"><span aria-hidden="true">↶</span></button><button class="os-reset" type="button"><span aria-hidden="true">↻</span><span class="os-reset-text"></span></button><p class="os-storage" role="status" hidden></p><div class="os-next-slot"><button class="os-next" type="button" hidden><span></span><b aria-hidden="true">→</b></button></div></footer>`;
  const $=s=>root.querySelector(s),board=$(".os-board"),stage=$(".os-stage"),hits=$(".os-hits");
  root.setAttribute("aria-busy","true");
  await document.fonts.load('16px "Stroke SUIT"').catch(()=>{});
  const soundButton=bindMaterialAudioButton($(".os-sound"),audio,()=>language);
  function svg(tag,attrs={}){const el=document.createElementNS(NS,tag);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));return el;}
  function save(){
    progress.paths[problem.id]=[...state.path];
    try{localStorage.setItem(SAVE,JSON.stringify(progress));}catch{storageFailed=true;}
  }
  function update(){
    const text=t(),solved=isSolved(problem,state),stuck=isStuck(problem,state),current=lastNode(state),used=new Set(usedEdges(state));
    root.lang=document.documentElement.lang=language;root.dataset.problem=problem.id;root.dataset.phase=solved?"solved":stuck?"stuck":state.path.length?"drawing":"start";
    root.dataset.feedback=feedback;root.dataset.path=state.path.join(",");
    $("h1").textContent=text.title;document.title=`GFIELD ${text.title}`;
    $(".os-prompt").textContent=text.prompt;$(".os-back").title=text.back;$(".os-back").setAttribute("aria-label",text.back);
    $(".os-language").value=language;$(".os-language").setAttribute("aria-label",text.language);
    $(".os-level").replaceChildren(...text.levels.map((label,i)=>{const option=document.createElement("option");option.value=i+1;option.textContent=`${i+1}. ${label}`;return option;}));
    $(".os-level").value=progress.level;$(".os-level").setAttribute("aria-label",text.level);
    $(".os-progress").textContent=`${progress.indices[progress.level]+1} / ${questions().length} · ${text.count(used.size,problem.edges.length)}`;
    $(".os-message").textContent=text[feedback];board.setAttribute("aria-label",text.board);
    for(const line of $(".os-edges").children)line.classList.toggle("is-used",used.has(line.dataset.edge));
    $(".os-shines").replaceChildren(...problem.edges.filter(([a,b])=>used.has(edgeKey(a,b))).map(([a,b])=>{
      const p=nodePoint(problem.nodes[a]),q=nodePoint(problem.nodes[b]);return svg("line",{class:"os-edge-shine",x1:p.x,y1:p.y-.55,x2:q.x,y2:q.y-.55});
    }));
    for(const node of $(".os-pegs").children){const id=node.dataset.node;node.classList.toggle("is-start",id===state.path[0]);node.classList.toggle("is-current",id===current);node.classList.toggle("is-rejected",id===rejected);}
    for(const [i,button]of [...hits.children].entries()){
      const currentButton=button.dataset.node===current;button.setAttribute("aria-label",text.peg(i+1,currentButton));
      if(currentButton)button.setAttribute("aria-current","step");else button.removeAttribute("aria-current");
    }
    $(".os-undo").disabled=!state.path.length;$(".os-undo").title=text.undo;$(".os-undo").setAttribute("aria-label",text.undo);
    $(".os-reset-text").textContent=text.reset;$(".os-reset").title=text.reset;
    $(".os-next").hidden=!solved;$(".os-next span").textContent=progress.indices[progress.level]===questions().length-1?text.again:text.next;
    $(".os-storage").hidden=!storageFailed;$(".os-storage").textContent=text.storage;soundButton.update();
  }
  function showFeedback(key,id=null){
    feedback=key;rejected=id;clearTimeout(rejectTimer);update();
    if(id)rejectTimer=setTimeout(()=>{rejected=null;update();},900);
  }
  function accept(id){
    const before=state,result=step(problem,state,id);
    if(result.error){showFeedback(result.error,id);return result.error;}
    if(result.state===before)return null;
    rejected=null;clearTimeout(rejectTimer);
    state=result.state;feedback=isSolved(problem,state)?(progress.indices[progress.level]===questions().length-1?"levelDone":"solved"):isStuck(problem,state)?"stuck":"drawing";
    audio.play(before.path.length?"band-stretch":"peg-touch");save();update();return null;
  }
  function pointerPoint(event){const r=board.getBoundingClientRect();return{x:(event.clientX-r.left)/r.width*100,y:(event.clientY-r.top)/r.height*100};}
  function inputTrace(){const width=board.getBoundingClientRect().width;return createTrace(problem,()=>state,accept,{radius:Math.min(11.5,Math.max(5,22/width*100)),corridor:Math.max(3.5,14/width*100)});}
  function endGesture(){
    $(".os-live").style.display="none";
    if(!gesture)return;const id=gesture.id;gesture=null;trace=null;
    if(stage.hasPointerCapture?.(id))stage.releasePointerCapture(id);
  }
  function drawProblem(){
    endGesture();audio.stop();clearTimeout(rejectTimer);rejected=null;
    problem=questions()[progress.indices[progress.level]];state={path:[...(progress.paths[problem.id]||[])]};
    feedback=isSolved(problem,state)?(progress.indices[progress.level]===3?"levelDone":"solved"):isStuck(problem,state)?"stuck":state.path.length?"resume":"chooseStart";
    $(".os-edges").replaceChildren(...problem.edges.map(([a,b])=>{
      const p=nodePoint(problem.nodes[a]),q=nodePoint(problem.nodes[b]),line=svg("line",{class:"os-edge",x1:p.x,y1:p.y,x2:q.x,y2:q.y});line.dataset.edge=edgeKey(a,b);return line;
    }));
    $(".os-pegs").replaceChildren();hits.replaceChildren();
    for(const [id,xy]of Object.entries(problem.nodes)){
      const p=nodePoint(xy),group=svg("g",{class:"os-node"});group.dataset.node=id;
      group.append(svg("circle",{class:"os-peg-shadow",cx:p.x+.4,cy:p.y+1,r:3.4}),svg("circle",{class:"os-peg",cx:p.x,cy:p.y,r:2.8}),svg("circle",{class:"os-ring",cx:p.x,cy:p.y,r:5.1}));$(".os-pegs").append(group);
      const button=document.createElement("button");button.type="button";button.className="os-peg-hit";button.dataset.node=id;button.style.left=p.x+"%";button.style.top=p.y+"%";hits.append(button);
    }
    update();
  }
  stage.addEventListener("pointerdown",event=>{
    if(!layoutReady||event.button!==0||event.isPrimary===false||gesture||isSolved(problem,state))return;
    root.classList.add("is-pointer");const p=pointerPoint(event),adapter=inputTrace(),id=adapter.nearest(p);
    if(!id){showFeedback("choosePeg");return;}
    if(!state.path.length){if(accept(id))return;}
    else if(id!==lastNode(state)){showFeedback("resume",id);return;}
    gesture={id:event.pointerId};trace=adapter;trace.begin(p);stage.setPointerCapture(event.pointerId);
    hits.querySelector(`[data-node="${id}"]`).focus({preventScroll:true});event.preventDefault();
  },options);
  stage.addEventListener("pointermove",event=>{
    if(gesture?.id!==event.pointerId)return;
    const coalesced=event.getCoalescedEvents?.(),samples=coalesced?.length?coalesced:[event];
    for(const sample of samples){const error=trace.move(pointerPoint(sample));if(error)showFeedback(error);}
    const preview=trace.preview,line=$(".os-live");line.style.display=preview?"":"none";
    if(preview)for(const [key,value]of Object.entries({x1:preview.from.x,y1:preview.from.y,x2:preview.to.x,y2:preview.to.y}))line.setAttribute(key,value);
    event.preventDefault();
  },options);
  stage.addEventListener("pointerup",event=>{
    if(gesture?.id!==event.pointerId)return;
    const error=trace.move(pointerPoint(event));if(error)showFeedback(error);endGesture();
  },options);
  for(const type of ["pointercancel","lostpointercapture"])stage.addEventListener(type,event=>{if(gesture?.id===event.pointerId){endGesture();audio.stop();if(!isSolved(problem,state)&&state.path.length)showFeedback(isStuck(problem,state)?"stuck":"resume");}},options);
  hits.addEventListener("click",event=>{if(!layoutReady||event.detail!==0)return;const button=event.target.closest(".os-peg-hit");if(button){root.classList.remove("is-pointer");accept(button.dataset.node);}},options);
  hits.addEventListener("keydown",event=>{
    root.classList.remove("is-pointer");
    if(event.key==="Escape"){endGesture();return;}
    const delta={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowDown:[0,1],ArrowUp:[0,-1]}[event.key],node=event.target.dataset.node;
    if(!delta||!node)return;event.preventDefault();
    const origin=nodePoint(problem.nodes[node]),candidates=[...hits.children].filter(b=>b!==event.target).map(button=>{
      const p=nodePoint(problem.nodes[button.dataset.node]),dx=p.x-origin.x,dy=p.y-origin.y,forward=dx*delta[0]+dy*delta[1];return{button,forward,score:forward+Math.abs(dx*delta[1]-dy*delta[0])*2};
    }).filter(p=>p.forward>.1).sort((a,b)=>a.score-b.score);candidates[0]?.button.focus();
  },options);
  $(".os-undo").addEventListener("click",()=>{endGesture();audio.stop();state=undo(state);feedback=state.path.length?"resume":"chooseStart";rejected=null;save();update();},options);
  $(".os-reset").addEventListener("click",()=>{endGesture();audio.stop();state=fresh();feedback="chooseStart";rejected=null;clearTimeout(rejectTimer);save();update();},options);
  $(".os-next").addEventListener("click",()=>{
    if(!isSolved(problem,state))return;endGesture();
    if(progress.indices[progress.level]===3){for(const p of questions())progress.paths[p.id]=[];progress.indices[progress.level]=0;}else progress.indices[progress.level]++;
    drawProblem();save();
  },options);
  $(".os-level").addEventListener("change",event=>{endGesture();progress.level=Number(event.target.value);const url=new URL(location.href);url.searchParams.set("level",progress.level);history.replaceState(null,"",url);drawProblem();save();},options);
  $(".os-language").addEventListener("change",event=>{endGesture();audio.stop();language=event.target.value;try{localStorage.setItem("gfield-language",language);}catch{storageFailed=true;}update();},options);
  const observer=new ResizeObserver(()=>{
    if(disposed)return;
    if(gesture){endGesture();if(state.path.length&&!isSolved(problem,state))showFeedback(isStuck(problem,state)?"stuck":"resume");}
    const r=stage.getBoundingClientRect(),size=Math.min(r.width,r.height,650);if(size<=0)return;board.style.width=size+"px";board.style.height=size+"px";
    layoutReady=true;root.classList.add("is-ready");root.removeAttribute("aria-busy");
  });observer.observe(stage);
  window.addEventListener("blur",()=>{endGesture();audio.stop();},options);
  document.addEventListener("visibilitychange",()=>{if(document.hidden){endGesture();audio.stop();}},options);
  window.addEventListener("pagehide",()=>{endGesture();audio.stop();},options);
  drawProblem();
  return{destroy(){disposed=true;endGesture();clearTimeout(rejectTimer);observer.disconnect();abort.abort();soundButton.destroy();audio.destroy();root.replaceChildren();}};
}
