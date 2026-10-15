(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-plane-cut-models.js"));
 else root.HSE_SOURCE_GRADE6_PLANE_CUT_REFERENCE=factory(root.HSE_SOURCE_GRADE6_PLANE_CUT_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const numberedCells=[[1,[0,1,0]],[2,[1,1,0]],[3,[1,1,1]],[4,[1,0,0]]];
 function build(){
  const model=models.build(2);
  const layers=[2,1].map(layer=>{
   const y=layer-1,facets=numberedCells.filter(([,c])=>c[1]===y).map(([number,cell])=>({number,cell,
    polygon:models.sectionPolygon(cell,cell.map(n=>n+1),model.plane)}));
   return {layer,polygon:models.sectionPolygon([0,y,0],[2,y+1,2],model.plane),facets,
    topTraces:model.layers[y].slabTraces,circledCells:facets.map(({number,cell,polygon})=>({number,cell,
     positionXZ:[0,2].map(k=>polygon.reduce((s,p)=>s+p[k],0)/polygon.length)}))};
  });
  return freeze({role:"source-given-worked-example",dimensions:[2,2,2],model,layers,
   sourceRef:{pdfPage:36,printedPage:38,component:"printed-example-panel"},
   printedCount:4,actualQuestionAnswerIncluded:false,handwritingIncluded:false});
 }
 function grid(row){
  const unit=72,pad=10,side=2*unit+2*pad;
  const rects=[];for(let x=0;x<2;x++)for(let z=0;z<2;z++)rects.push(`<rect data-x="${x}" data-z="${z}" x="${pad+x*unit}" y="${pad+(1-z)*unit}" width="${unit}" height="${unit}" fill="#fff" stroke="#000" stroke-width="1.2"/>`);
  const lines=row.topTraces.filter(t=>t.length===2).map(([a,b])=>`<line data-role="reference-trace" x1="${pad+a[0]*unit}" y1="${pad+(2-a[1])*unit}" x2="${pad+b[0]*unit}" y2="${pad+(2-b[1])*unit}" stroke="#000" stroke-width="1.5"/>`).join("");
  const circled=row.circledCells.map(({number,cell,positionXZ:[x,z]})=>`<g data-reference-number="${number}" data-cell="${cell.join(",")}" transform="translate(${pad+x*unit},${pad+(2-z)*unit})"><circle r="12" fill="#fff" stroke="#000" stroke-width="1.1"/><text x="0" y="0" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-size="21" font-weight="400" fill="#000">${number}</text></g>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" data-reference-layer="${row.layer}" role="img" aria-label="${row.layer}층 위에서 본 원문 예시" viewBox="0 0 ${side} ${side}" width="${side}" height="${side}">${rects.join("")}${lines}${circled}</svg>`;
 }
 function render(images){
  const reference=build();
  return `<section class="source62-cut-reference" data-reference-role="${reference.role}"><div class="source62-cut-reference-solid" data-cut-reference="solid">${images?.solid||""}</div>${reference.layers.map(row=>`<figure class="source62-cut-reference-layer" data-reference-layer="${row.layer}"><figcaption>${row.layer}층 단면 → 위에서 본 모습</figcaption><div class="source62-cut-reference-pair"><div data-cut-reference="section" data-layer="${row.layer}">${images?.sections?.[row.layer]||""}</div><span class="source62-cut-reference-arrow" aria-hidden="true">→</span>${grid(row)}</div></figure>`).join("")}</section>`;
 }
 function slab(row){
  if(![1,2].includes(row?.layer))throw new RangeError("Unsupported printed reference layer");
  const model=build().model,y=row.layer-1;
  return freeze({n:1,dimensions:[2,1,2],points:{},cubes:model.cubes.filter(c=>c[1]===y).map(([x,,z])=>[x,0,z]),cutCells:[],
   planeSection:row.polygon.map(([x,h,z])=>[x,h-y,z]),
   sectionFacets:row.facets.map(f=>f.polygon.map(([x,h,z])=>[x,h-y,z]))});
 }
 return freeze({build,render,grid,slab});
});
