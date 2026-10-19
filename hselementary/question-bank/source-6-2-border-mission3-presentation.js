(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-border-mission3-contracts.js"),require("./source-6-2-border-mission3-figures.js"));
  else root.HSE_SOURCE_GRADE6_BORDER_MISSION3_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS,root.HSE_SOURCE_GRADE6_BORDER_MISSION3_FIGURES);
})(typeof window!=="undefined"?window:globalThis,function(contracts,figures){
  "use strict";
  const id="6-2-u3-e2-mission-3",escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  function figureSvg(variant,level,role){
    const q=contracts.generate(id,variant,level);
    if(role==="prefix")return figures.build("prefix",24);
    if(role==="answer-original")return figures.grid(q.model.H,role);
    if(role==="answer-filled"&&level===2)return figures.grid(q.filledModel.H,role);
    throw new RangeError("Unsupported border answer phase");
  }
  function figureButton(q,role,caption){
    const f=figureSvg(q.variant,q.level,role),family=role==="prefix"?"border-mission3-prefix":"border-mission3-answer";
    return `<figure class="source62-border-figure" data-figure-role="${role}"><figcaption>${escape(caption)}</figcaption><button type="button" class="source62-m3-image-button source62-border-figure-button" data-m3-figure="${q.variant}" data-source-figure-family="${family}" data-source-difficulty-level="${q.level}" data-source-grid-role="${role}" aria-label="높이표 그림 확대" title="높이표 그림 확대" style="--source62-border-grid-width:${f.width}px">${f.svg}</button></figure>`;
  }
  function render(sourceId,variant,level){
    const q=contracts.generate(sourceId,variant,level),text=q.promptText.split(/\n/).filter(Boolean).map(escape).join("<br>"),roles=level===2?["answer-original","answer-filled"]:["answer-original"],answers=Array.isArray(q.answer)?q.answer:[q.answer];
    return Object.freeze({...q,prompt:`<div class="source62-border-given" data-source="${id}">${text}${figureButton(q,"prefix","")}</div>`,
      answer:answers.map((value,index)=>`${answers.length>1?`(${index+1}) `:""}${value}`).join("; "),
      answerVisual:`<div class="source62-border-answer" data-source="${id}" data-level="${level}">${roles.map(role=>figureButton(q,role,role==="answer-filled"?"빈칸을 모두 채운 도형":"도형의 높이표")).join("")}</div>`,answerKeyVisual:true});
  }
  if(typeof document!=="undefined"){
    let pending=false;
    const align=()=>{if(pending)return;pending=true;document.fonts.ready.then(()=>{pending=false;figures.align(document);});};
    const start=()=>{new MutationObserver(align).observe(document.body,{childList:true,subtree:true});align();};
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
  }
  return Object.freeze({render,figureSvg,sourceItemIds:[id],registrationOnly:true,learnerReleaseVerified:false});
});
