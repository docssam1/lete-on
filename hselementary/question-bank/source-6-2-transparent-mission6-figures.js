(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory();else root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_FIGURES=factory();})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function grid(rows,role,corners){
  if(!["given","response","answer"].includes(role)||!Array.isArray(rows)||!rows.length||!rows.every(r=>Array.isArray(r)&&r.length===rows[0].length&&r.every(n=>n===0||n===1)))throw RangeError("Invalid transparent projection grid");
  const width=rows[0].length,height=rows.length,unit=30,pad=22,w=width*unit+2*pad,h=height*unit+2*pad;
  const cells=rows.flatMap((r,y)=>r.map((v,x)=>`<rect data-row="${y}" data-column="${x}"${role==="response"?"":` data-cell-value="${v}"`} x="${pad+x*unit}" y="${pad+y*unit}" width="${unit}" height="${unit}" fill="${role!=="response"&&v?"#333":"#fff"}"/>`)).join("");
  const lines=[];for(let x=0;x<=width;x++)lines.push(`M ${pad+x*unit} ${pad} V ${pad+height*unit}`);for(let y=0;y<=height;y++)lines.push(`M ${pad} ${pad+y*unit} H ${pad+width*unit}`);
  const positions={topLeft:[pad-8,pad-8,"end"],topRight:[pad+width*unit+8,pad-8,"start"],bottomLeft:[pad-8,pad+height*unit+18,"end"],bottomRight:[pad+width*unit+8,pad+height*unit+18,"start"]};
  const labels=Object.entries(corners).map(([name,label])=>{if(!positions[name]||!/^[A-G]$/.test(label))throw RangeError("Invalid original view corner");const[x,y,anchor]=positions[name];return`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#000" font-size="16" font-weight="400" font-family="Malgun Gothic,Arial,sans-serif">${escape(label)}</text>`;}).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" data-projection-role="${role}" data-columns="${width}" data-rows="${height}" role="img" aria-label="${role==="response"?"오른쪽 모습 빈 답칸":role==="given"?"주어진 모양":"오른쪽 모습 정답"}">${cells}<path d="${lines.join(" ")}" stroke="#000" stroke-width="0.7" fill="none"/><rect x="${pad}" y="${pad}" width="${width*unit}" height="${height*unit}" stroke="#000" stroke-width="1.1" fill="none"/>${labels}</svg>`;
 }
 function givenViews(q){return `<div class="source62-transparent-given-views"><figure>${grid(q.model.topRowsBackToFront,"given",{topLeft:"A",topRight:"D",bottomLeft:"B",bottomRight:"C"})}<figcaption>(가)</figcaption></figure><figure>${grid(q.model.frontRowsTopToBottom,"given",{topLeft:"B",topRight:"C",bottomLeft:"E",bottomRight:"F"})}<figcaption>(나)</figcaption></figure></div>`;}
 function response(q,role){if(!["problem","teacher"].includes(role))throw RangeError("Invalid transparent response owner");const rows=role==="problem"?Array.from({length:q.level===0?1:3},()=>[0,0]):q.model.requestedRows,corners={topLeft:"C",topRight:"D",...(q.level===0?{}:{bottomLeft:"F",bottomRight:"G"})};return `<div class="source62-transparent-response" data-response-owner="${role}">${grid(rows,role==="problem"?"response":"answer",corners)}</div>`;}
 return Object.freeze({grid,givenViews,response,registrationOnly:true,learnerReleaseVerified:false});
});
