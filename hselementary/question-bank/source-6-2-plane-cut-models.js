(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_PLANE_CUT_MODELS=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const ids=["6-2-u3-e4-exploration","6-2-u3-e4-mission-3"];
  const pools={"6-2-u3-e4-exploration":[[3,2,2],[4,3,3],[5,4,4]],"6-2-u3-e4-mission-3":[[4,4,4],[3,3,3],[2,2,2]]};
  const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
  const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  function planeFromPoints(points){
    if(!Array.isArray(points)||points.length!==3||!points.every(p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger)))throw new RangeError("Three exact doubled-coordinate points required");
    let normal=cross(sub(points[1],points[0]),sub(points[2],points[0]));
    const divisor=normal.reduce((g,v)=>gcd(g,v),0);
    if(!divisor)throw new RangeError("Collinear plane points");
    normal=normal.map(v=>v/divisor);
    if(normal.find(v=>v!==0)<0)normal=normal.map(v=>-v);
    return freeze({normal,constant:dot(normal,points[0]),coordinateScale:2});
  }
  function cubeClass(cell,plane){
    const values=[];
    for(const x of [cell[0]*2,cell[0]*2+2])for(const y of [cell[1]*2,cell[1]*2+2])for(const z of [cell[2]*2,cell[2]*2+2])values.push(dot(plane.normal,[x,y,z])-plane.constant);
    const min=Math.min(...values),max=Math.max(...values);
    return {cut:min<0&&max>0,touch:!(min<0&&max>0)&&min<=0&&max>=0,min,max};
  }
  function sectionPolygon(min,max,plane){
    const corners=[];
    for(const x of [min[0],max[0]])for(const y of [min[1],max[1]])for(const z of [min[2],max[2]])corners.push([x,y,z]);
    const points=new Map(),value=p=>dot(plane.normal,p)*2-plane.constant;
    function add(p){points.set(p.map(v=>v.toFixed(10)).join(","),p);}
    for(let i=0;i<corners.length;i++)for(let j=i+1;j<corners.length;j++){
      if(corners[i].filter((v,k)=>v!==corners[j][k]).length!==1)continue;
      const a=corners[i],b=corners[j],fa=value(a),fb=value(b);
      if(fa===0)add(a);if(fb===0)add(b);
      if(fa*fb<0){const t=fa/(fa-fb);add(a.map((v,k)=>v+t*(b[k]-v)));}
    }
    const list=[...points.values()];if(list.length<3)return list;
    const center=[0,1,2].map(k=>list.reduce((s,p)=>s+p[k],0)/list.length);
    const u=sub(list[0],center),v=cross(plane.normal,u);
    return list.sort((a,b)=>Math.atan2(dot(sub(a,center),v),dot(sub(a,center),u))-Math.atan2(dot(sub(b,center),v),dot(sub(b,center),u)));
  }
  function topTrace(width,depth,height,plane){
    const [a,b,c]=plane.normal,bound=plane.constant/2-b*height,points=[];
    for(const x of [0,width]){const z=(bound-a*x)/c;if(z>=0&&z<=depth)points.push([x,z]);}
    for(const z of [0,depth]){const x=(bound-c*z)/a;if(x>=0&&x<=width)points.push([x,z]);}
    return [...new Map(points.map(p=>[p.join(","),p])).values()];
  }
  function build(dimensions){
    if(Number.isSafeInteger(dimensions))dimensions=[dimensions,dimensions,dimensions];
    const allowed=[...pools[ids[0]],...pools[ids[1]]];
    if(!Array.isArray(dimensions)||dimensions.length!==3||!allowed.some(d=>d.every((n,i)=>n===dimensions[i])))throw new RangeError("Unverified solid dimensions");
    const [width,height,depth]=dimensions,n=height;
    const points={A:[width,height,depth],B:[0,height,0],C:[width,0,0]},plane=planeFromPoints(Object.values(points).map(p=>p.map(v=>v*2)));
    const cubes=[],cutCells=[],touchCells=[],layers=[];
    for(let y=0;y<height;y++){
      const cells=[],cuts=[],touches=[];
      for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
        const cell=[x,y,z],kind=cubeClass(cell,plane);cubes.push(cell);cells.push([x,z]);
        if(kind.cut){cutCells.push(cell);cuts.push([x,z]);}
        if(kind.touch){touchCells.push(cell);touches.push([x,z]);}
      }
      layers.push({layer:y+1,cells,cutCells:cuts,touchCells:touches,cutCount:cuts.length,touchCount:touches.length,
        slabTraces:[topTrace(width,depth,y,plane),topTrace(width,depth,y+1,plane)]});
    }
    return freeze({n,width,height,depth,dimensions:dimensions.slice(),points,plane,cubes,layers,cutCells,touchCells,cutCount:cutCells.length,touchCount:touchCells.length,
      planeSection:sectionPolygon([0,0,0],dimensions,plane),
      directions:{x:"right",y:"up",z:"back"},boundaryContactIsCut:false,
      answerUniqueScope:"specified-plane-and-interior-cut-definition",originalSourceReleaseStatus:"locked",
      sourceExact:false,publisherAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false});
  }
  function solve(id,variant){
    if(!ids.includes(id)||!Number.isSafeInteger(variant)||variant<0||variant>2)throw new RangeError("Unsupported cut source or variant");
    return freeze({...build(pools[id][variant]),sourceItemId:id,variant,sourceRef:{pdfPage:id===ids[0]?36:37,printedPage:id===ids[0]?38:39}});
  }
  return freeze({build,solve,planeFromPoints,cubeClass,sectionPolygon,sourceItemIds:ids,pools});
});
