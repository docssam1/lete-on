(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-painted-mission3-contracts.js"),require("./source-6-2-painted-stacks-presentation.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION3_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PAINTED_MISSION3_CONTRACTS,root.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION);
})(typeof window!=="undefined" ? window : globalThis,function(contracts,shared){
  "use strict";
  function render(variant,level){
    const q=contracts.generate(variant,level),m=q.model,src=`./assets/source-6-2-painted-mission3/v${variant}-given.png`;
    const layers=m.layerGrids.map((matrix,y)=>`<figure><figcaption>${y+1}층</figcaption>${shared.grid(matrix,"painted-faces",y+1)}</figure>`).join("");
    return Object.freeze({prompt:q.prompt+`<div class="source62-painted-given source62-m3-given" data-source="${q.sourceItemId}"><button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="${src}" width="1280" height="860" alt="층별 쌓기나무 개수에 맞춘 입체 그림" data-variant="${variant}" data-glyphless="true"></button></div>`,
      answer:q.secondary ? `(1) ${q.answer}; (2) ${q.secondary.answer}개` : q.answer,
      answerVisual:`<div class="source62-painted-answer" data-source="${q.sourceItemId}"><div class="source62-painted-layers">${layers}</div></div>`,answerKeyVisual:true,solution:q.solution,
      sourceItemId:q.sourceItemId,variant,level,clue:q.clue,secondary:q.secondary,difficultyDesign:q.difficultyDesign,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  if(typeof document!=="undefined"){
    let dialog,returnFocus,request=0;
    document.addEventListener("click",async event=>{
      const button=event.target.closest?.("[data-m3-figure]");if(!button)return;
      const variant=Number(button.dataset.m3Figure);if(!Number.isSafeInteger(variant)||variant<0||variant>2)return;
      const family=button.dataset.sourceFigureFamily||"mission3";
      const finalHost=button.closest(".source62-final-problem,.source62-final-teacher"),finalContext=button.closest("[data-final-mission-owner]");
      if((finalHost||finalContext)&&family!=="e4-final-missions"||family==="e4-final-missions"&&(!finalHost||!finalContext))return;
      const removalHost=button.closest(".source62-opposite-removal-given,.source62-opposite-removal-answer"),removalContext=button.closest("[data-opposite-removal-context]");
      if((removalHost||removalContext)&&family!=="opposite-removal"||family==="opposite-removal"&&(!removalHost||!removalContext))return;
      const additionHost=button.closest(".source62-cube-addition-given,.source62-cube-addition-answer"),additionContext=button.closest("[data-cube-addition-context]");
      if((additionHost||additionContext)&&family!=="cube-addition"||family==="cube-addition"&&(!additionHost||!additionContext))return;
      const coloredHost=button.closest(".source62-colored-cut-given,.source62-colored-cut-answer"),coloredContext=button.closest("[data-colored-cut-context]");
      if((coloredHost||coloredContext)&&family!=="colored-cut-mission1"||family==="colored-cut-mission1"&&(!coloredHost||!coloredContext))return;
      const threePointHost=button.closest(".source62-three-point-given,.source62-three-point-answer"),threePointContext=button.closest("[data-three-point-context]");
      if((threePointHost||threePointContext)&&family!=="three-point-cut-mission2"||family==="three-point-cut-mission2"&&(!threePointHost||!threePointContext))return;
      const layerCutHost=button.closest(".source62-layer-cut-problem,.source62-layer-cut-answer"),layerCutContext=button.closest("[data-layer-cut-owner]");
      if((layerCutHost||layerCutContext)&&family!=="layer-cut-mission3"||family==="layer-cut-mission3"&&(!layerCutHost||!layerCutContext))return;
      if(!["mission3","mission5","mission6","example2","example3","exploration","t-pattern-example2","t-pattern-layer","stair-mission1","stair-mission1-layer","border-mission3-prefix","border-mission3-answer","notched-mission5","notched-mission5-layer","opposite-removal","cube-addition","colored-cut-mission1","three-point-cut-mission2","layer-cut-mission3","e4-final-missions"].includes(family))return;
      const phase=button.dataset.sourceFigurePhase;
      if(family==="example2"&&!["before","after"].includes(phase))return;
      let layerFigure;
      if(family==="e4-final-missions"){
        const presentation=window.HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_PRESENTATION;
        const requestFigure=()=>{
          const owner=button.closest("[data-final-mission-owner]"),data=owner?.dataset,host=button.closest(".source62-final-problem,.source62-final-teacher"),role=host?.matches(".source62-final-problem")?"problem":"teacher";
          if(!button.isConnected||!presentation||!owner||!host||host.closest("[data-final-mission-owner]")!==owner||!Object.hasOwn(presentation.profiles,data.sourceItemId)||!/^[0-2]$/.test(data.variant||"")||!/^[0-2]$/.test(data.level||"")||button.dataset.m3Figure!==data.variant||button.dataset.sourceDifficultyLevel!==data.level||data.finalMissionOwner!==role||button.dataset.sourceFigureFamily!=="e4-final-missions")throw RangeError("Invalid final-mission zoom owner");
          const figure=presentation.zoomFigure(data.sourceItemId,Number(data.variant),Number(data.level),button.dataset.sourceFigurePhase,role);
          if(button.querySelector("img")?.getAttribute("src")!==figure.source)throw RangeError("Mismatched final-mission image");return figure;
        };
        try{layerFigure=requestFigure();const key=layerFigure.revisionKey;layerFigure={...layerFigure,isCurrent:()=>{try{return requestFigure().revisionKey===key;}catch{return false;}}};}catch{return;}
      }
      if(family==="layer-cut-mission3"){
        const presentation=window.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_BANK_PRESENTATION;
        const requestFigure=()=>{
          const owner=button.closest("[data-layer-cut-owner]"),data=owner?.dataset,host=button.closest(".source62-layer-cut-problem,.source62-layer-cut-answer"),role=host?.matches(".source62-layer-cut-problem")?"problem":"teacher",phase=button.dataset.sourceFigurePhase,rawLayer=button.dataset.sourceAnswerLayer;
          if(!button.isConnected||!presentation||!host||!owner||host.closest("[data-layer-cut-owner]")!==owner||data.sourceItemId!=="6-2-u3-e4-mission-3"||!/^[0-2]$/.test(data.variant||"")||!/^[0-2]$/.test(data.level||"")||button.dataset.m3Figure!==data.variant||button.dataset.sourceDifficultyLevel!==data.level||data.layerCutOwner!==role||button.dataset.sourceFigureFamily!=="layer-cut-mission3"||rawLayer!==undefined&&!/^[1-4]$/.test(rawLayer))throw RangeError("Invalid layer-cut zoom owner");
          const figure=presentation.zoomFigure(Number(data.variant),Number(data.level),phase,role,rawLayer===undefined?undefined:Number(rawLayer));
          if(phase==="given"?button.querySelector("img")?.getAttribute("src")!==figure.source:!button.querySelector('svg[data-response-role="teacher"]')||button.querySelector("img"))throw RangeError("Mismatched layer-cut image");return figure;
        };
        try{layerFigure=requestFigure();const key=layerFigure.revisionKey;layerFigure={...layerFigure,isCurrent:()=>{try{return requestFigure().revisionKey===key;}catch{return false;}}};}catch{return;}
      }
      if(family==="three-point-cut-mission2"){
        const presentation=window.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_BANK_PRESENTATION;
        const requestFigure=()=>{
          const owner=button.closest("[data-three-point-context]"),data=owner?.dataset,host=button.closest(".source62-three-point-given,.source62-three-point-answer"),role=host?.matches(".source62-three-point-given")?"problem":"teacher",phase=button.dataset.sourceFigurePhase;
          if(!button.isConnected||!presentation||!host||!owner||host.closest("[data-three-point-context]")!==owner||data.sourceItemId!=="6-2-u3-e4-mission-2"||
            !/^[0-2]$/.test(data.variant||"")||!/^[0-2]$/.test(data.level||"")||button.dataset.m3Figure!==data.variant||button.dataset.sourceDifficultyLevel!==data.level||data.threePointContext!==role||button.dataset.sourceFigureFamily!=="three-point-cut-mission2")throw new RangeError("Invalid three-point cut zoom context");
          const figure=presentation.zoomFigure(Number(data.variant),Number(data.level),phase,role);
          if(phase==="section"?!button.querySelector(".source62-three-point-section")||!!button.querySelector("img"):button.querySelector("img")?.getAttribute("src")!==figure.source)throw new RangeError("Mismatched three-point cut image");return figure;
        };
        try{layerFigure=requestFigure();const key=layerFigure.revisionKey;layerFigure={...layerFigure,isCurrent:()=>{try{return requestFigure().revisionKey===key;}catch{return false;}}};}catch{return;}
      }
      if(family==="colored-cut-mission1"){
        const presentation=window.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_PRESENTATION;
        const requestFigure=()=>{
          const owner=button.closest("[data-colored-cut-context]"),data=owner?.dataset,host=button.closest(".source62-colored-cut-given,.source62-colored-cut-answer"),role=host?.matches(".source62-colored-cut-given")?"problem":"teacher",phase=button.dataset.sourceFigurePhase;
          if(!button.isConnected||!presentation||!host||!owner||host.closest("[data-colored-cut-context]")!==owner||data.sourceItemId!=="6-2-u3-e4-mission-1"||
            !/^[0-2]$/.test(data.variant||"")||!/^[0-2]$/.test(data.level||"")||button.dataset.m3Figure!==data.variant||button.dataset.sourceDifficultyLevel!==data.level||data.coloredCutContext!==role||button.dataset.sourceFigureFamily!=="colored-cut-mission1")throw new RangeError("Invalid colored-cut zoom context");
          const figure=presentation.zoomFigure(Number(data.variant),Number(data.level),phase,role);
          if(phase==="front"?!button.querySelector(".source62-colored-cut-front")||!!button.querySelector("img"):button.querySelector("img")?.getAttribute("src")!==figure.source)throw new RangeError("Mismatched colored-cut image");return figure;
        };
        try{layerFigure=requestFigure();const key=layerFigure.revisionKey;layerFigure={...layerFigure,isCurrent:()=>{try{return requestFigure().revisionKey===key;}catch{return false;}}};}catch{return;}
      }
      if(family==="cube-addition"){
        const sourceId=additionContext?.dataset.sourceItemId;
        const presentation=sourceId==="6-2-u3-e4-example-4"?window.HSE_SOURCE_GRADE6_CUBE_ADDITION_PRESENTATION:sourceId==="6-2-u3-e4-mission-4"?window.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_PRESENTATION:null;
        const requestFigure=()=>{
          const owner=button.closest("[data-cube-addition-context]"),data=owner?.dataset,host=button.closest(".source62-cube-addition-given,.source62-cube-addition-answer"),role=host?.matches(".source62-cube-addition-given")?"problem":"teacher",rawIndex=button.dataset.sourceClassIndex;
          if(!button.isConnected||!presentation||!host||!owner||host.closest("[data-cube-addition-context]")!==owner||data.sourceItemId!==sourceId||
            !/^[0-2]$/.test(data.variant||"")||!/^[0-2]$/.test(data.level||"")||button.dataset.m3Figure!==data.variant||button.dataset.sourceDifficultyLevel!==data.level||
            data.cubeAdditionContext!==role||button.dataset.sourceFigureFamily!=="cube-addition"||
            (role==="problem"?rawIndex!=="given":!/^\d+$/.test(rawIndex||"")||button.closest("figure[data-cube-class]")?.dataset.cubeClass!==rawIndex))throw new RangeError("Invalid cube-addition zoom context");
          const figure=presentation.zoomFigure(Number(data.variant),Number(data.level),role==="problem"?"given":Number(rawIndex),role);
          if(button.querySelector("img")?.getAttribute("src")!==figure.source)throw new RangeError("Mismatched cube-addition image");return figure;
        };
        try{layerFigure=requestFigure();const key=layerFigure.revisionKey;layerFigure={...layerFigure,isCurrent:()=>{try{return requestFigure().revisionKey===key;}catch{return false;}}};}catch{return;}
      }
      if(family==="opposite-removal"){
        const presentation=window.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_PRESENTATION;
        const requestFigure=()=>{
          const owner=button.closest("[data-opposite-removal-context]"),data=owner?.dataset,host=button.closest(".source62-opposite-removal-given,.source62-opposite-removal-answer");
          if(!button.isConnected||!presentation||!host||!owner||host.closest("[data-opposite-removal-context]")!==owner||data.sourceItemId!=="6-2-u3-e4-example-3"||
            !/^[0-2]$/.test(data.variant||"")||!/^[0-2]$/.test(data.level||"")||button.dataset.m3Figure!==data.variant||button.dataset.sourceDifficultyLevel!==data.level||
            data.oppositeRemovalContext!==(host.matches(".source62-opposite-removal-given")?"problem":"teacher")||button.dataset.sourceFigureFamily!=="opposite-removal")throw new RangeError("Invalid removal zoom context");
          return presentation.zoomFigure(Number(data.variant),Number(data.level),button.dataset.sourceFigurePhase,data.oppositeRemovalContext);
        };
        try{layerFigure=requestFigure();const key=layerFigure.revisionKey;layerFigure={...layerFigure,isCurrent:()=>{try{return requestFigure().revisionKey===key;}catch{return false;}}};}catch{return;}
      }
      if(family==="notched-mission5"||family==="notched-mission5-layer"){
        const level=Number(button.dataset.sourceDifficultyLevel),contracts=window.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_CONTRACTS,presentation=window.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_PRESENTATION;
        if(!contracts||!presentation||!Number.isSafeInteger(level)||level<0||level>2)return;
        const q=contracts.generate("6-2-u3-e2-mission-5",variant,level);
        if(family==="notched-mission5"){
          if(!["given","full","filled"].includes(phase)||phase==="filled"&&level!==2)return;
          layerFigure={source:`./assets/source-6-2-notched-mission5/v${variant}-${phase}.png`,width:1600,height:phase==="given"?1575:1445,label:"확대한 쌓기나무 입체 그림"};
        }else{
          const layer=Number(button.dataset.sourceAnswerLayer);
          if(!Number.isSafeInteger(layer)||layer<1||layer>q.model.n||!["original","filled"].includes(phase)||phase==="filled"&&level!==2)return;
          const svg=new DOMParser().parseFromString(presentation.layerSvg(q,layer,phase),"image/svg+xml").documentElement;
          if(svg.localName!=="svg"||svg.querySelector("parsererror"))return;
          layerFigure={source:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.outerHTML)}`,width:Number(svg.getAttribute("width")),height:Number(svg.getAttribute("height")),label:`${layer}층 그림 확대`};
        }
      }
      if(family==="border-mission3-prefix"||family==="border-mission3-answer"){
        const level=Number(button.dataset.sourceDifficultyLevel),role=button.dataset.sourceGridRole;
        const presentation=window.HSE_SOURCE_GRADE6_BORDER_MISSION3_PRESENTATION,figures=window.HSE_SOURCE_GRADE6_BORDER_MISSION3_FIGURES;
        if(!presentation||!figures||!Number.isSafeInteger(level)||level<0||level>2||
          (family==="border-mission3-prefix"?role!=="prefix":!["answer-original","answer-filled"].includes(role))||role==="answer-filled"&&level!==2)return;
        const built=presentation.figureSvg(variant,level,role),svg=new DOMParser().parseFromString(built.svg,"image/svg+xml").documentElement;
        if(svg.localName!=="svg"||svg.querySelector("parsererror"))return;
        const host=document.createElement("div");host.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden";host.append(document.importNode(svg,true));document.body.append(host);
        try{figures.align(host);layerFigure={source:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(host.firstElementChild.outerHTML)}`,width:built.width,height:built.height,label:"높이표 그림 확대"};}finally{host.remove();}
      }
      if(family==="stair-mission1-layer"){
        const layer=Number(button.dataset.sourceAnswerLayer),level=Number(button.dataset.sourceDifficultyLevel);
        const contracts=window.HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS,presentation=window.HSE_SOURCE_GRADE6_STAIR_MISSION1_PRESENTATION;
        if(!contracts||!presentation||!Number.isSafeInteger(level)||level<0||level>2)return;
        const q=contracts.generate("6-2-u3-e2-mission-1",variant,level);
        if(!Number.isSafeInteger(layer)||layer<1||layer>q.model.n)return;
        const svg=new DOMParser().parseFromString(presentation.layerSvg(q,layer),"image/svg+xml").documentElement;
        if(svg.localName!=="svg"||svg.querySelector("parsererror"))return;
        layerFigure={source:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.outerHTML)}`,width:Number(svg.getAttribute("width")),height:Number(svg.getAttribute("height")),label:`${layer}층 그림 확대`};
      }
      if(family==="t-pattern-layer"){
        const layer=Number(button.dataset.sourceAnswerLayer),level=Number(button.dataset.sourceDifficultyLevel);
        const contracts=window.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS,presentation=window.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION;
        if(!contracts||!presentation||!Number.isSafeInteger(level)||level<0||level>2)return;
        const q=contracts.generate("6-2-u3-e2-example-2",variant,level),allowed=level===2?[1,q.model.n-2,q.model.n-1,q.model.n]:[1,q.model.n];
        if(!Number.isSafeInteger(layer)||!allowed.includes(layer))return;
        const svg=new DOMParser().parseFromString(presentation.layerSvg(q,layer),"image/svg+xml").documentElement;
        if(svg.localName!=="svg"||svg.querySelector("parsererror"))return;
        layerFigure={source:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.outerHTML)}`,width:Number(svg.getAttribute("width")),height:Number(svg.getAttribute("height")),label:`${layer}층 그림 확대`};
      }
      const src=layerFigure?layerFigure.source:family==="stair-mission1"?"./assets/source-6-2-stair-mission1/prefix-given.png":family==="t-pattern-example2"?"./assets/source-6-2-t-pattern-example2/prefix-given.png":family==="exploration"?`./assets/source-6-2-painted-exploration/v${variant}-given.png`:family==="example3"?`./assets/source-6-2-painted-example3/v${variant}-given.png`:family==="example2"?`./assets/source-6-2-painted-example2/v${variant}-${phase}.png`:family==="mission5"?"./assets/source-6-2-painted-mission5/source-given.png":family==="mission6"?`./assets/source-6-2-painted-mission6/v${variant}-given.png`:`./assets/source-6-2-painted-mission3/v${variant}-given.png`;
      if(!dialog){
        dialog=document.createElement("dialog");dialog.className="source62-m3-figure-dialog";dialog.setAttribute("aria-label","입체 그림 확대");
        const close=document.createElement("button");close.type="button";close.className="source62-m3-figure-close";close.textContent="×";close.title="닫기";close.setAttribute("aria-label","닫기");close.addEventListener("click",()=>dialog.close());
        const viewport=document.createElement("div");viewport.className="source62-m3-figure-viewport";viewport.tabIndex=0;
        const image=document.createElement("img");image.alt="확대한 쌓기나무 입체 그림";image.width=1280;image.height=860;viewport.append(image);dialog.append(close,viewport);document.body.append(dialog);
        dialog.addEventListener("close",()=>{if(dialog.open)return;request++;dialog.setAttribute("aria-busy","false");if(returnFocus?.isConnected)returnFocus.focus();});
        dialog.addEventListener("keydown",e=>e.stopPropagation());
        dialog.addEventListener("click",e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
      }
      const current=++request;returnFocus=button;const image=dialog.querySelector("img");image.width=layerFigure?layerFigure.width:["t-pattern-example2","stair-mission1"].includes(family)?1600:1280;image.height=layerFigure?layerFigure.height:family==="stair-mission1"?852:family==="t-pattern-example2"?523:family==="example2"?1040:["mission6","example3","exploration"].includes(family)?1120:860;image.alt=layerFigure?layerFigure.label:"확대한 쌓기나무 입체 그림";dialog.setAttribute("aria-busy","true");image.src=src;
      if(!dialog.open)dialog.showModal();dialog.querySelector("button").focus();
      try{await image.decode();if(current!==request || !dialog.open)return;if(layerFigure?.isCurrent&&!layerFigure.isCurrent()){dialog.setAttribute("aria-busy","false");dialog.close();return;}dialog.setAttribute("aria-busy","false");const viewport=dialog.querySelector(".source62-m3-figure-viewport");viewport.scrollLeft=Math.max(0,(image.clientWidth-viewport.clientWidth)/2);}catch{if(current===request && dialog.open){dialog.setAttribute("aria-busy","false");dialog.close();}}
    });
  }
  return Object.freeze({render,registrationOnly:true,learnerReleaseVerified:false});
});
