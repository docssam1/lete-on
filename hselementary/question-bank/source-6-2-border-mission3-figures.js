(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-stack-pattern-models.js"));
  else root.HSE_SOURCE_GRADE6_BORDER_MISSION3_FIGURES=factory(root.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  const id="6-2-u3-e2-mission-3",cell=24,pad=8,gap=24;
  function drawGrid(model,offsetX,offsetY){
    return `<g data-stage="${model.n}">${model.H.flatMap((row,z)=>row.map((value,x)=>{
      const left=offsetX+x*cell,top=offsetY+z*cell;
      return `<g data-x="${x}" data-z="${z}" data-value="${value}"><rect x="${left}" y="${top}" width="${cell}" height="${cell}"/><text x="${left+cell/2}" y="${top+cell/2}" text-anchor="middle" dominant-baseline="central">${value}</text></g>`;
    })).join("")}</g>`;
  }
  function build(mode,fontSize=20){
    if(!["prefix","10","8","12"].includes(mode))throw new RangeError("Unreviewed border figure");
    if(![20,24].includes(fontSize))throw new RangeError("Unreviewed border glyph size");
    const list=mode==="prefix" ? models.firstStates(id) : [models.build(id,{n:Number(mode)})];
    const maxSide=Math.max(...list.map(model=>model.H.length));
    let x=pad;const groups=list.map(model=>{
      const side=model.H.length,y=pad+(maxSide-side)*cell,grid=drawGrid(model,x,y);
      const caption=mode==="prefix" ? `<text data-stage-label="${model.n}" x="${x+side*cell/2}" y="${pad+maxSide*cell+22}" text-anchor="middle">(${model.n})</text>` : "";
      x+=side*cell+gap;return grid+caption;
    }).join("");
    const width=mode==="prefix" ? x+pad : x-gap+pad,height=pad*2+maxSide*cell+(mode==="prefix" ? 30 : 0);
    const continuation=mode==="prefix" ? `<text data-continuation="true" x="${x-gap+12}" y="${pad+maxSide*cell/2}" text-anchor="middle">...</text>` : "";
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" class="source62-border-grid" data-mode="${mode}" data-glyph-size="${fontSize}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${mode==="prefix" ? "원본 첫 세 모양의 위에서 본 숫자 격자" : `${mode}번째 모양의 조건부 숫자 격자`}"><style>.source62-border-grid[data-mode] rect{fill:#fff;stroke:#000;stroke-width:1}.source62-border-grid[data-mode] text{fill:#000;font:400 ${fontSize}px 'Malgun Gothic',Arial,sans-serif;letter-spacing:0}</style>${groups}${continuation}</svg>`;
    return Object.freeze({mode,svg,width,height,models:list,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false,constructionAdoptionStatus:"pending-user-choice"});
  }
  function grid(H,role){
    if(!["answer-original","answer-filled"].includes(role)||!Array.isArray(H)||H.length<3||H.length>25||H.length%2!==1||H.some(row=>!Array.isArray(row)||row.length!==H.length||row.some(value=>value!==0&&value!==1)))throw new RangeError("Unsupported border answer grid");
    const side=H.length*cell+2*pad,stage=(H.length-1)/2,model={n:stage,H};
    return Object.freeze({width:side,height:side,svg:`<svg xmlns="http://www.w3.org/2000/svg" class="source62-border-grid" data-grid-role="${role}" data-glyph-size="25" viewBox="0 0 ${side} ${side}" width="${side}" height="${side}" role="img" aria-label="${role==="answer-filled"?"구멍을 모두 채운":"주어진 규칙으로 만든"} ${stage}번째 도형의 높이표"><style>.source62-border-grid[data-grid-role] rect{fill:#fff;stroke:#000;stroke-width:1}.source62-border-grid[data-grid-role] text{fill:#000;font:400 25px 'Malgun Gothic',Arial,sans-serif;letter-spacing:0}</style>${drawGrid(model,pad,pad)}</svg>`});
  }
  function align(host){
    const ctx=document.createElement("canvas").getContext("2d");
    const cache=new Map(),set=(el,key,value)=>{const text=String(value);if(el.getAttribute(key)!==text)el.setAttribute(key,text);};
    // All numeric cells within one grid share the declared font.
    for(const svg of host.querySelectorAll(".source62-border-grid")){
      const labels=[...svg.querySelectorAll("g[data-x] text")];if(!labels.length)continue;
      const style=getComputedStyle(labels[0]),precision=64,font=`${style.fontStyle} ${style.fontWeight} ${parseFloat(style.fontSize)*precision}px ${style.fontFamily}`;
      ctx.font=font;
      for(const text of labels){
        const key=`${font}|${text.textContent}`;let metrics=cache.get(key);
        if(!metrics){const raw=ctx.measureText(text.textContent);metrics=Object.fromEntries(["width","actualBoundingBoxLeft","actualBoundingBoxRight","actualBoundingBoxAscent","actualBoundingBoxDescent"].map(k=>[k,raw[k]/precision]));cache.set(key,metrics);}
        const rect=text.previousElementSibling,cx=rect.x.baseVal.value+cell/2,cy=rect.y.baseVal.value+cell/2;
        set(text,"dominant-baseline","alphabetic");set(text,"x",cx+metrics.width/2+(metrics.actualBoundingBoxLeft-metrics.actualBoundingBoxRight)/2);set(text,"y",cy+(metrics.actualBoundingBoxAscent-metrics.actualBoundingBoxDescent)/2);
      }
    }
  }
  async function show(){
    if(window.borderReview)window.borderReview.ready=false;
    await document.fonts.ready;
    const model=build(document.getElementById("mode").value),prefix=model.mode==="prefix",host=document.getElementById("figure"),summary=document.getElementById("summary");
    host.innerHTML=model.svg;host.classList.toggle("wide",!prefix);host.scrollLeft=0;
    // Center the actual digit ink, not the font's unused ascent/descent box.
    align(host);
    document.getElementById("heading").textContent=prefix ? "원본 숫자 격자 검수" : "교사용 숫자 격자 검수 · 규칙 확인 필요";
    summary.hidden=prefix;summary.replaceChildren();
    if(!prefix){const m=model.models[0];summary.innerHTML=`<table><caption>도형 (${m.n})</caption><tbody><tr><th scope="row">쌓기나무 수 ㄱ</th><td>${m.totalCubes}개</td></tr><tr><th scope="row">밑면을 제외한 면의 넓이 ㄴ</th><td>${m.surface.exposedFacesExcludingAllBottom} cm<sup>2</sup></td></tr><tr><th scope="row">ㄴ−ㄱ</th><td>${m.answer}</td></tr></tbody></table>`;}
    window.borderReview={model,ready:true};
  }
  if(typeof document!=="undefined"&&document.getElementById("mode")&&document.getElementById("figure")){
    const refresh=()=>show().catch(error=>window.borderReview={ready:false,error:error.message});
    document.getElementById("mode").addEventListener("change",refresh);refresh();
  }
  return Object.freeze({build,grid,align,registrationOnly:true,learnerReleaseVerified:false});
});
