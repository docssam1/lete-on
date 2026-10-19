(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-notched-mission5-contracts.js"));
  else root.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_CONTRACTS);
})(typeof window!=="undefined"?window:globalThis,function(contracts){
  "use strict";
  const id="6-2-u3-e2-mission-5",escape=text=>String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  function layerSvg(q,layer,phase="original"){
    if(q?.sourceItemId!==id||!Number.isSafeInteger(layer)||layer<1||layer>q.model.n||!["original","filled"].includes(phase)||phase==="filled"&&q.level!==2)throw new RangeError("Unsupported notched answer layer");
    const row=(phase==="filled"?q.filledModel:q.model).layers[layer-1],size=20,pad=6,width=row.side*size+pad*2,hidden=new Set(row.hiddenCells.map(c=>c.join(",")));
    return `<svg xmlns="http://www.w3.org/2000/svg" class="source62-notched-grid" data-layer="${layer}" data-phase="${phase}" role="img" aria-label="${layer}층에서 보이지 않는 쌓기나무 위치" viewBox="0 0 ${width} ${width}" width="${width}" height="${width}">${row.cells.map(([x,z])=>`<rect data-x="${x}" data-z="${z}" data-hidden="${hidden.has([x,z].join(","))}" x="${pad+x*size}" y="${pad+z*size}" width="${size}" height="${size}" fill="${hidden.has([x,z].join(","))?"#555":"#fff"}" stroke="#000" stroke-width="1"/>`).join("")}</svg>`;
  }
  function image(variant,phase,level){
    return `<button type="button" class="source62-m3-image-button source62-notched-image" data-m3-figure="${variant}" data-source-figure-family="notched-mission5" data-source-figure-phase="${phase}" data-source-difficulty-level="${level}" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-notched-mission5/v${variant}-${phase}.png" width="1600" height="${phase==="given"?1575:1445}" alt="앞쪽 모서리가 ${phase==="filled"?"채워진":"빈"} ${[6,5,7][variant]}층 쌓기나무${phase==="given"?", 아래 두 층 생략":""}"></button>`;
  }
  function layers(q,phase){
    const rows=(phase==="filled"?q.filledModel:q.model).layers;
    return `<section class="source62-notched-phase" data-phase="${phase}"><h4>${phase==="filled"?"빈 모서리를 채운 도형":"처음 도형"}</h4>${image(q.variant,phase==="filled"?"filled":"full",q.level)}<div class="source62-notched-layers">${rows.map(row=>`<figure data-hidden-count="${row.hiddenCells.length}"><figcaption>${row.layer}층 · ${row.cells.length}개</figcaption><button type="button" class="source62-m3-image-button source62-notched-grid-button" data-m3-figure="${q.variant}" data-source-figure-family="notched-mission5-layer" data-source-answer-layer="${row.layer}" data-source-figure-phase="${phase}" data-source-difficulty-level="${q.level}" title="${row.layer}층 그림 확대" aria-label="${row.layer}층 그림 확대" style="--source62-notched-grid-width:${row.side*20+12}px;--source62-notched-grid-mm:${(row.side*20+12)*.14}mm">${layerSvg(q,row.layer,phase)}</button><figcaption>안 보임 ${row.hiddenCells.length}개</figcaption></figure>`).join("")}</div></section>`;
  }
  function worked(q,phase){
    const rows=phase==="filled"?q.filledRows:q.rows,whole=rows.reduce((sum,r)=>sum+r.total,0),hidden=rows.reduce((sum,r)=>sum+r.hidden,0),visible=whole-hidden;
    const math=s=>`<span class="math-inline-expression" style="white-space:nowrap;color:#000">${s}</span>`;
    const totals=[`${rows.map(r=>r.total).join("+")}=${whole}`,`${rows.filter(r=>r.hidden).map(r=>r.hidden).join("+")||"0"}=${hidden}`,`${whole}-${hidden}=${visible}`,`${visible}-${hidden}=${visible-hidden}`];
    if(q.level===0)return {equations:[...rows.filter(r=>r.hidden).map(r=>r.hiddenEquation),totals[1]].map(math),
      html:`<section class="source62-notched-worked"><table><thead><tr><th scope="col">층</th><th scope="col">보이지 않는 개수</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.layer}층</td><td>${r.hidden?math(r.hiddenEquation):"0"}</td></tr>`).join("")}</tbody></table><p>보이지 않음: ${math(totals[1])}</p></section>`};
    return {equations:[...rows.flatMap(r=>[r.cubeEquation,...(r.hidden?[r.hiddenEquation]:[])]),...totals].map(math),
      html:`<section class="source62-notched-worked"><h4>${phase==="filled"?"빈 모서리를 채운 도형":"처음 도형"}</h4><table><thead><tr><th scope="col">층</th><th scope="col">전체 개수</th><th scope="col">보이지 않는 개수</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.layer}층</td><td>${math(r.cubeEquation)}</td><td>${r.hidden?math(r.hiddenEquation):"0"}</td></tr>`).join("")}</tbody></table><p>전체: ${math(totals[0])}<br>보이지 않음: ${math(totals[1])}<br>보임: ${math(totals[2])}<br>개수의 차: ${math(totals[3])}</p></section>`};
  }
  function render(sourceId,variant,level){
    const q=contracts.generate(sourceId,variant,level),text=q.promptText.split(/(?=\([12]\))/g).map(escape).join("<br>");
    const original=worked(q,"original"),filled=level===2?worked(q,"filled"):null;
    return Object.freeze({...q,prompt:`<div class="source62-notched-given" data-source="${id}">${text}${image(variant,"given",level)}</div>`,
      answer:Array.isArray(q.answer)?q.answer.map((n,index)=>`(${index+1}) ${n}개`).join("; "):`${q.answer}개`,solution:`<div class="source62-notched-calculation" data-level="${level}"><p>바닥에 닿은 면이 보이므로 1층은 모두 보입니다. 여섯 면이 모두 다른 쌓기나무와 맞닿은 것만 보이지 않는 쌓기나무로 셉니다.</p>${original.html}${filled?.html||""}</div>`,
      sourceSolutionEquations:q.solutionEquations,solutionEquations:Object.freeze([...original.equations,...(filled?.equations||[])]),
      answerVisual:`<div class="source62-notched-answer" data-source="${id}" data-level="${level}"><p class="source62-notched-legend">어두운 칸은 여섯 면이 모두 다른 쌓기나무와 맞닿은 쌓기나무입니다.</p>${layers(q,"original")}${level===2?layers(q,"filled"):""}</div>`,answerKeyVisual:true});
  }
  return Object.freeze({render,layerSvg,sourceItemIds:contracts.sourceItemIds,learnerReleaseVerified:false});
});
