(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-ratio-e1-contracts.js"),require("./source-6-2-ratio-e1-figures.js"));else root.HSE_SOURCE_GRADE6_RATIO_E1_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_RATIO_E1_CONTRACTS,root.HSE_SOURCE_GRADE6_RATIO_E1_FIGURES);})(typeof window!=="undefined"?window:globalThis,function(contracts,figures){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 const context=(q,role,body)=>`<div class="ratio-e1-${role}" data-ratio-e1-owner="${role}" data-source-item-id="${q.sourceItemId}" data-variant="${q.variant}" data-level="${q.level}">${body}</div>`;
 function problemHtml(q){return context(q,"problem",q.promptParts.map((p,i)=>`<p${q.kind==="exploration"&&i>=2&&i<2+q.model.givens.ratios.length?' class="ratio-e1-expression"':""}>${escape(p)}</p>`).join("")+figures.render(q,"problem"));}
 function answerHtml(q){return context(q,"teacher",q.model.figures.length?figures.render(q,"teacher"):q.solutionSteps.map(s=>`<p>${escape(s)}</p>`).join(""));}
 function render(id,variant,level){const q=contracts.generate(id,variant,level);return Object.freeze({...q,prompt:problemHtml(q),answerVisual:answerHtml(q),answer:q.answerText,solution:q.model.figures.length?q.solutionSteps.join(" "):q.solutionSummary,answerKeyVisual:q.model.figures.length>0});}
 return Object.freeze({render,problemHtml,answerHtml,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
