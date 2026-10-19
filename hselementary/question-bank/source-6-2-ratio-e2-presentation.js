(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-ratio-e2-contracts.js"),require("./source-6-2-ratio-e1-models.js"));else root.HSE_SOURCE_GRADE6_RATIO_E2_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_RATIO_E2_CONTRACTS,root.HSE_SOURCE_GRADE6_RATIO_E1_MODELS);})(typeof window!=="undefined"?window:globalThis,function(contracts,math){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]),num=n=>Number(n.toFixed(8));
 function centroid(poly){let area=0,x=0,y=0;poly.forEach(([a,b],i)=>{const[c,d]=poly[(i+1)%poly.length],cross=a*d-c*b;area+=cross;x+=(a+c)*cross;y+=(b+d)*cross;});return[x/(3*area),y/(3*area)];}
 function figure(q,role){
  if(!q.model.figures.length)return "";const g=q.model.figures[0],scale=Math.min(360/g.height,420/g.base),left=(600-scale*g.base)/2,bottom=390,point=p=>[num(left+p[0]*scale),num(bottom-p[1]*scale)],points=poly=>poly.map(p=>point(p).join(",")).join(" "),a=point([(g.base-1)*.4,g.height*.32]),b=point([g.base-.15,.82]),label=(p,text,owner)=>`<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="central" data-label-for="${owner}">${text}</text>`;
  let body=`<polygon data-layout-role="source-triangle" data-model-points="${points(g.triangle)}" points="${points(g.triangle)}" fill="#f1f1f1"/><polygon data-layout-role="source-square" data-model-points="${points(g.square)}" points="${points(g.square)}" fill="#fff"/><polygon data-layout-role="source-overlap" data-model-points="${points(g.overlap)}" points="${points(g.overlap)}" fill="#c8c8c8"/>${label(a,"㉮","source-triangle")}${label(b,"㉯","source-square")}`;
  if(role==="teacher")body+=label(point(centroid(g.overlap)),escape(`${math.fmt(q.facts.percent)}%`),"source-overlap");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" class="ratio-e2-figure" role="img" aria-label="${role==="teacher"?"겹친 넓이의 정답 그림":"직각삼각형과 정사각형이 겹친 그림"}" data-ratio-e2-figure="overlap" data-role="${role}">${body}</svg>`;
 }
 const context=(q,role,body)=>`<div class="ratio-e2-${role}" data-ratio-e2-owner="${role}" data-source-item-id="${q.sourceItemId}" data-variant="${q.variant}" data-level="${q.level}">${body}</div>`;
 function problemHtml(q){return context(q,"problem",q.promptParts.map(p=>`<p${/^[①②③④] /.test(p)?' class="ratio-e2-equation"':""}>${escape(p)}</p>`).join("")+figure(q,"problem"));}
 function answerHtml(q){return context(q,"teacher",q.figures.length?figure(q,"teacher"):q.solutionSteps.map(p=>`<p>${escape(p)}</p>`).join(""));}
 function render(id,variant,level){const q=contracts.generate(id,variant,level);return Object.freeze({...q,prompt:problemHtml(q),answerVisual:answerHtml(q),answer:q.answerText,solution:q.figures.length?q.solutionSteps.join(" "):q.solutionSummary,answerKeyVisual:q.figures.length>0});}
 return Object.freeze({render,problemHtml,answerHtml,figure,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
