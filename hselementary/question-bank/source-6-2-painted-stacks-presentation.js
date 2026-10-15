(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-painted-stacks-contracts.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PAINTED_STACKS_CONTRACTS);
})(typeof window!=="undefined" ? window : globalThis,function(contracts){
  "use strict";
  function grid(matrix,role,layer=0,showDirections=false){
    const size=28,pad=8,plotWidth=matrix[0].length*size+2*pad,plotHeight=matrix.length*size+2*pad,width=plotWidth+(showDirections?56:0),height=plotHeight+(showDirections?56:0),children=[];
    matrix.forEach((row,z)=>row.forEach((value,x)=>{
      if(value===null)return;
      const left=pad+x*size,top=pad+z*size;
      children.push(`<g data-x="${x}" data-z="${z}" data-value="${value}"><rect x="${left}" y="${top}" width="${size}" height="${size}"/><text x="${left+size/2}" y="${top+size/2}" text-anchor="middle" dominant-baseline="central">${value}</text></g>`);
    }));
    if(showDirections){
      const cx=pad+size*1.5,cy=pad+size*1.5,right=plotWidth-pad,bottom=plotHeight-pad;
      children.push(`<g data-direction="front"><line x1="${cx}" y1="${bottom+28}" x2="${cx}" y2="${bottom+7}"/><polygon points="${cx},${bottom+7} ${cx-4},${bottom+13} ${cx+4},${bottom+13}"/><text x="${cx}" y="${bottom+42}" text-anchor="middle" dominant-baseline="central">앞</text></g>`);
      children.push(`<g data-direction="right"><line x1="${right+28}" y1="${cy}" x2="${right+7}" y2="${cy}"/><polygon points="${right+7},${cy} ${right+13},${cy-4} ${right+13},${cy+4}"/><text x="${right+42}" y="${cy}" text-anchor="middle" dominant-baseline="central">옆</text></g>`);
    }
    const label=role==="height"?'위에서 본 기둥의 높이':role==="red-painted-faces"?`${layer}층 쌓기나무의 빨간색 면 수`:role==="mixed-colors"?`${layer}층에서 빨간색과 파란색이 모두 있는 칸은 1, 나머지는 0`:`${layer}층 쌓기나무의 색칠한 면 수`;
    return `<svg class="source62-painted-grid" data-role="${role}" data-layer="${layer}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}">${children.join("")}</svg>`;
  }
  function histogram(q,blank){return `<table class="source62-painted-histogram"><thead><tr>${q.histogram.map((_,i)=>`<th scope="col">${i}면</th>`).join("")}</tr></thead><tbody><tr>${q.histogram.map((value,i)=>`<td data-face-count="${i}">${blank ? "" : `${value}개`}</td>`).join("")}</tr></tbody></table>`;}
  function render(id,variant,level){
    const q=contracts.generate(id,variant,level),m=q.model,counts=m.kind==="painted-face-counts",inner=m.kind==="unpainted-inner-cubes",height=m.heights.map(row=>row.map(h=>h || null));
    const result=inner ? `${q.answer}개` : counts ? level===0 ? `3면 ${q.answer[0]}개, 4면 ${q.answer[1]}개` : q.histogram.map((n,i)=>`${i}면 ${n}개`).join(", ") : `${q.answer} cm²`;
    const answer=q.secondary ? `(1) ${result}; (2) ${q.secondary.answer}${inner ? '개' : ' cm²'}` : result;
    const directions=id.endsWith("mission-4");
    const problemTable=counts && level!==0 ? histogram(q,true) : "";
    const pictures=m.layerGrids.map((matrix,index)=>`<figure><figcaption>${index+1}층</figcaption>${grid(matrix,"painted-faces",index+1)}</figure>`).join("");
    const faceTable=`<table class="source62-painted-directions"><thead><tr><th scope="col">면의 방향</th><th scope="col">작은 면 수</th></tr></thead><tbody>${q.faceRows.map(row=>`<tr><th scope="row">${row.name}</th><td>${row.count}개</td></tr>`).join("")}</tbody><tfoot><tr><th scope="row">모두</th><td>${m.paintedFaces}개</td></tr></tfoot></table>`;
    return Object.freeze({prompt:inner ? `<div class="source62-painted-given" data-source="${id}" data-text-only="true">${q.promptText}</div>` : q.promptText+`<div class="source62-painted-given" data-source="${id}"><figure>${directions ? '<figcaption>위</figcaption>' : ''}${grid(height,"height",0,directions)}</figure>${problemTable}</div>`,answer,
      answerVisual:`<div class="source62-painted-answer" data-source="${id}">${counts ? histogram(q,false) : ""}<div class="source62-painted-layers">${pictures}</div>${counts || inner ? "" : faceTable}</div>`,answerKeyVisual:true,solution:q.solution,
      sourceItemId:id,variant,level,difficultyDesign:q.difficultyDesign,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  function align(root){
    for(const page of root.querySelectorAll(".answer-key-page")){
      const owned=new Set([...page.querySelectorAll(".answer-key-visuals>figure")].filter(figure=>figure.querySelector(".source62-painted-answer")).map(figure=>figure.querySelector("figcaption").textContent.trim()));
      for(const entry of page.querySelectorAll(".answer-key-grid>div"))if(owned.has(entry.querySelector("b")?.textContent.trim()))entry.querySelector("span").classList.add("source62-painted-key-answer");
    }
    // Keep the existing math-unit component attached to its numeric value.
    for(const unit of root.querySelectorAll('.solution-item:has(.source62-painted-answer) .math-unit,.solution-viewer-content:has(.source62-painted-answer) .math-unit,.source62-painted-key-answer .math-unit')){
      if(unit.closest(".source62-painted-measure"))continue;
      const previous=unit.previousSibling;if(previous?.nodeType!==3)continue;
      const match=/(\(\d+\)\s*)?(\d+)\s*$/.exec(previous.nodeValue);if(!match)continue;
      previous.nodeValue=previous.nodeValue.slice(0,match.index);const group=document.createElement("span");group.className="source62-painted-measure";
      group.append((match[1]||"")+match[2]," ");unit.before(group);group.append(unit);
    }
    const ctx=document.createElement("canvas").getContext("2d"),cache=new Map();
    for(const text of root.querySelectorAll(".source62-painted-grid g[data-x] text")){
      const style=getComputedStyle(text),rect=text.previousElementSibling,key=`${style.font}|${text.textContent}`;
      if(!cache.has(key)){const precision=64;ctx.font=`${style.fontStyle} ${style.fontWeight} ${parseFloat(style.fontSize)*precision}px ${style.fontFamily}`;
        const metrics=ctx.measureText(text.textContent);cache.set(key,Object.fromEntries(["width","actualBoundingBoxLeft","actualBoundingBoxRight","actualBoundingBoxAscent","actualBoundingBoxDescent"].map(k=>[k,metrics[k]/precision])));}
      const m=cache.get(key),cx=rect.x.baseVal.value+rect.width.baseVal.value/2,cy=rect.y.baseVal.value+rect.height.baseVal.value/2;
      text.setAttribute("dominant-baseline","alphabetic");text.setAttribute("x",cx+m.width/2+(m.actualBoundingBoxLeft-m.actualBoundingBoxRight)/2);text.setAttribute("y",cy+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2);
    }
  }
  if(typeof document!=="undefined")document.fonts.ready.then(()=>{
    const observer=new MutationObserver(()=>align(document));observer.observe(document.body,{childList:true,subtree:true});align(document);
    window.addEventListener("beforeprint",()=>align(document));window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
  });
  return Object.freeze({render,grid,align,definitions:contracts.definitions,registrationOnly:true,learnerReleaseVerified:false});
});
