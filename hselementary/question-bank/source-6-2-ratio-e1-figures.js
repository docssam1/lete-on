(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-ratio-e1-models.js"));else root.HSE_SOURCE_GRADE6_RATIO_E1_FIGURES=factory(root.HSE_SOURCE_GRADE6_RATIO_E1_MODELS);})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const num=n=>Number(n.toFixed(6)),escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 const line=(a,b,owner,extra="")=>`<line x1="${num(a[0])}" y1="${num(a[1])}" x2="${num(b[0])}" y2="${num(b[1])}" data-owner-id="${owner}" ${extra}/>`;
 const polygon=(points,owner,fill)=>`<polygon points="${points.map(p=>p.map(num).join(",")).join(" ")}" fill="${fill}" data-owner-id="${owner}"/>`;
 function measure(x,y,pair,unit,owner){
  const[n,d]=models.rat(...pair),whole=Math.trunc(n/d),rem=n%d,full=d===1?String(n):whole?String(whole):"",fw=d===1?0:Math.max(String(Math.abs(rem)).length,String(d).length)*14+12,ww=full.length*14,uw=unit.length*14,total=ww+fw+uw+(full&&fw?5:0)+(unit?5:0),start=x-total/2,cx=start+ww+(full&&fw?5:0)+fw/2;
  const text=(a,b,s,cls="")=>`<text class="${cls}" x="${num(a)}" y="${num(b)}" text-anchor="${cls==="ratio-e1-fraction"?"middle":"start"}">${escape(s)}</text>`;
  return `<g data-layout-role="measurement" data-label-for="${owner}" data-measurement="${models.fmt(pair)}" aria-label="${escape(models.fmt(pair)+unit)}">${full?text(start,y+9,full):""}${fw?text(cx,y-8,Math.abs(rem),"ratio-e1-fraction")+line([cx-fw/2+2,y],[cx+fw/2-2,y],owner,'class="ratio-e1-fraction-bar"')+text(cx,y+24,d,"ratio-e1-fraction"):""}${unit?text(start+ww+fw+(full&&fw?5:0)+5,y+9,unit):""}</g>`;
 }
 const dimension=(a,b,owner)=>line(a,b,owner)+line([a[0],a[1]-5],[a[0],a[1]+5],owner)+line([b[0],b[1]-5],[b[0],b[1]+5],owner);
 function tapes(q,role){const m=q.model.figures[0],x=p=>40+520*p/models.value(m.total),y=110,height=32,first=m.segments[0],second=m.segments[1],a=x(first.from[0]),join=x(first.to[0]),end=x(second.to[0]),parts=[polygon([[a,y],[join,y],[join,y+height],[a,y+height]],"first","#ddd"),polygon([[join,y],[end,y],[end,y+height],[join,y+height]],"second","#999")];
  const labels=role==="teacher"||q.level===0?[first,second]:q.level===1?[first]:[];
  for(const segment of labels){const left=x(segment.from[0]),right=x(segment.to[0]);parts.push(dimension([left,85],[right,85],segment.id),line([left,90],[left,y-4],segment.id,'stroke-dasharray="3 3"'),line([right,90],[right,y-4],segment.id,'stroke-dasharray="3 3"'),measure((left+right)/2,40,segment.length,"m",segment.id));}
  if(role==="teacher"||q.level!==0)parts.push(dimension([a,165],[end,165],"total"),line([a,y+height+4],[a,160],"total",'stroke-dasharray="3 3"'),line([end,y+height+4],[end,160],"total",'stroke-dasharray="3 3"'),measure((a+end)/2,205,m.total,"m","total"));
  return svg(q,role,270,parts.join(""),"tapes");
 }
 function pinwheel(q,role){const m=q.model.figures[0],s=m.outer[2],scale=300/s,point=([x,y])=>[150+x*scale,40+y*scale],box=b=>[point([b[0],b[1]]),point([b[2],b[1]]),point([b[2],b[3]]),point([b[0],b[3]])],parts=m.rectangles.map(r=>polygon(box(r.box),r.id,"#ddd"));parts.push(polygon(box(m.inner),"central-square","#fff"));
  if(role==="teacher"){
   const right=point([m.short,0])[0];parts.push(dimension([150,365],[right,365],"rectangle-horizontal"),measure((150+right)/2,402,[m.short,1],"cm","rectangle-horizontal"));
   const end=point([0,m.long])[1];parts.push(line([480,40],[480,end],"rectangle-vertical"),line([475,40],[485,40],"rectangle-vertical"),line([475,end],[485,end],"rectangle-vertical"),measure(535,(40+end)/2,[m.long,1],"cm","rectangle-vertical"));
  }
  return svg(q,role,450,parts.join(""),"pinwheel");
 }
 function centroid(ps){let twice=0,x=0,y=0;for(let i=0;i<ps.length;i++){const a=ps[i],b=ps[(i+1)%ps.length],cross=a[0]*b[1]-b[0]*a[1];twice+=cross;x+=(a[0]+b[0])*cross;y+=(a[1]+b[1])*cross;}if(!twice)throw Error("Degenerate source polygon");return[x/(3*twice),y/(3*twice)];}
 function edgeDistance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);}
 function strip(q,role){const m=q.model.figures[0],unit=520/m.squares,point=([x,y])=>[40+x*unit,125-y*unit],parts=m.regions.map(r=>polygon(r.polygon.map(point),r.id,"#aaa"));parts.push(polygon(m.outline.map(point),"strip-outline","none"));for(let i=1;i<m.squares;i++)parts.push(line(point([i,0]),point([i,1]),`unit-${i}`));parts.push(line(...m.diagonal.map(point),"diagonal"));
  for(const region of m.regions){const polygonPoints=region.polygon.map(point),c=point(centroid(region.polygon)),outside=region.id==="B"||Math.min(...polygonPoints.map((a,i)=>edgeDistance(c,a,polygonPoints[(i+1)%polygonPoints.length])))<20,label=outside?[c[0],170]:c;if(outside)parts.push(line([c[0],c[1]],[label[0],label[1]-18],region.id,'class="ratio-e1-leader"'));parts.push(`<g data-layout-role="region-label" data-label-for="${region.id}" data-outside-label="${outside}"><circle cx="${num(label[0])}" cy="${num(label[1])}" r="15" fill="none"/><text x="${num(label[0])}" y="${num(label[1]+8)}" text-anchor="middle">${region.id==="A"?"가":"나"}</text></g>`);}
  return svg(q,role,210,parts.join(""),"diagonal-strip");
 }
 function svg(q,role,height,body,kind){return `<svg class="ratio-e1-figure" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${height}" data-ratio-figure="${kind}" data-figure-owner="${role}" data-source-item-id="${q.sourceItemId}" data-variant="${q.variant}" data-level="${q.level}" role="img" aria-label="${kind==="tapes"?"서로 겹치지 않게 이은 두 테이프와 길이 표시":kind==="pinwheel"?"네 직사각형이 둘러싼 정사각형":"같은 정사각형 띠와 대각선 아래 두 색칠 부분"}">${body}</svg>`;}
 function render(q,role){if(!["problem","teacher"].includes(role))throw RangeError("Invalid ratio figure role");if(!q.model.figures.length)return "";return({tapes,pinwheel,"diagonal-strip":strip})[q.model.figures[0].kind](q,role);}
 return Object.freeze({render,measure,centroid,registrationOnly:true,learnerReleaseVerified:false});
});
