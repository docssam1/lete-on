(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-three-point-cut-mission2-contracts.js"));
 else root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_CONTRACTS);
})(typeof window!=="undefined"?window:globalThis,function(contracts){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function sectionSvg(q){
  const m=q.model,pad=42,w=420,xs=m.flatSection.map(p=>p[0]),ys=m.flatSection.map(p=>p[1]),left=Math.min(...xs),top=Math.min(...ys),scale=(w-2*pad)/(Math.max(...xs)-left),h=(Math.max(...ys)-top)*scale+2*pad;
  const xy=p=>[(p[0]-left)*scale+pad,(p[1]-top)*scale+pad],center=[xs.reduce((a,b)=>a+b,0)/xs.length,ys.reduce((a,b)=>a+b,0)/ys.length];
  const pieces=m.sections.map(s=>`<polygon data-cell="${s.cell.join(",")}" data-cut="true" data-requested="${q.requestedLayers.includes(s.cell[1]+1)}" points="${s.flatPolygon.map(p=>xy(p).map(n=>n.toFixed(5)).join(",")).join(" ")}" fill="${q.requestedLayers.includes(s.cell[1]+1)?"#cedfcf":"#fff"}" stroke="#000" stroke-width="1"/>`).join("");
  const labels=Object.entries(m.flatPoints).map(([name,p])=>{const [x,y]=xy(p),normal=[p[0]-center[0],p[1]-center[1]],length=Math.hypot(...normal);return`<text data-owner-id="${escape(name)}" x="${x+normal[0]/length*25}" y="${y+normal[1]/length*25}" text-anchor="middle" dominant-baseline="central">${escape(name)}</text>`;}).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="source62-three-point-section" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="평면으로 잘린 쌓기나무의 절단면"><g data-role="section-pieces">${pieces}</g><g fill="#000" font-family="Malgun Gothic,Arial,sans-serif" font-size="18" font-weight="400">${labels}</g></svg>`;
 }
 function render(id,variant,level){
  const q=contracts.generate(id,variant,level),answer=Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${q.answer}개`;
  return Object.freeze({...q,answer,prompt:`<div class="source62-three-point-given"><p>${escape(q.promptText)}</p><div class="source62-three-point-solid" data-three-point-solid="given"></div></div>`,
   answerVisual:`<div class="source62-three-point-answer"><div class="source62-three-point-solid" data-three-point-solid="answer"></div><figure>${sectionSvg(q)}<figcaption>평면으로 자른 면</figcaption></figure><p>${level===0?"초록색 부분은 맨 위층에서 내부가 잘린 쌓기나무입니다.":"초록색 부분 하나가 내부가 잘린 쌓기나무 한 개에 해당합니다."}</p></div>`,solution:q.solutionText,answerKeyVisual:true});
 }
 return Object.freeze({render,sectionSvg,sourceItemId:contracts.sourceItemId,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
