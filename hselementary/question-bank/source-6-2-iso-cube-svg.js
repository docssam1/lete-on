(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.HSE_SOURCE_GRADE6_ISO_CUBE_SVG=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 // 6-2 3단원 개념탐구 4 Mission 4·5 변형(pool 1·2)의 입체 그림.
 // 원문 PNG와 같은 방향(위·오른쪽(+x)·앞(-z) 면이 보임)과 같은 면 색(source-6-2-stack-renderer.mjs의 FACE_COLORS·MARKED_FACE_COLORS)으로 그린다.
 // 좌표: x는 오른쪽 앞, y는 위, z는 오른쪽 뒤. 바라보는 쪽은 (1,1,-1).
 const VIEW=[1,1,-1],FACES=["x","y","z"],key=c=>c.join(",");
 const FILL={plain:{x:"#c5d9dc",y:"#fafcf8",z:"#e2eee8"},marked:{x:"#333333",y:"#555555",z:"#3d3d3d"}};
 const STROKE="#667272",UNIT=100,STROKE_WIDTH=1.5;
 const freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 const validCells=cells=>Array.isArray(cells)&&cells.length>0&&cells.length<=400&&cells.every(c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger))&&new Set(cells.map(key)).size===cells.length;
 const depth=c=>c[0]+c[1]-c[2];
 const project=(x,y,z)=>[(x+z)*Math.sqrt(3)/2*UNIT,((x-z)/2-y)*UNIT];
 // 면마다 꼭짓점(셀 [x,x+1]×[y,y+1]×[z,z+1]).
 function corners(c,face){
  const[x,y,z]=c;
  if(face==="y")return[[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]];
  if(face==="x")return[[x+1,y,z],[x+1,y,z+1],[x+1,y+1,z+1],[x+1,y+1,z]];
  return[[x,y,z],[x+1,y,z],[x+1,y+1,z],[x,y+1,z]];
 }
 const neighbour=(c,face)=>face==="x"?[c[0]+1,c[1],c[2]]:face==="y"?[c[0],c[1]+1,c[2]]:[c[0],c[1],c[2]-1];
 function rayHitsBox(origin,box){
  let near=-Infinity,far=Infinity;
  for(let i=0;i<3;i++){
   const lo=box[i],hi=box[i]+1;
   if(VIEW[i]===0){if(origin[i]<lo||origin[i]>hi)return false;continue;}
   let a=(lo-origin[i])/VIEW[i],b=(hi-origin[i])/VIEW[i];if(a>b)[a,b]=[b,a];
   near=Math.max(near,a);far=Math.min(far,b);
  }
  return far>=Math.max(near,1e-9);
 }
 // 각 쌓기나무의 보이는 세 면마다 3×3 점에서 보는 쪽으로 빛을 쏘아 가려지지 않은 점을 센다(원문 PNG 렌더러의 visibleSamples와 같은 기준).
 function visibility(cells){
  if(!validCells(cells))throw RangeError("Invalid cube cells");
  const faces=cells.map((c,i)=>FACES.map(face=>{
   let count=0;const axis=face==="x"?0:face==="y"?1:2,others=[0,1,2].filter(a=>a!==axis);
   for(const a of[-.3,0,.3])for(const b of[-.3,0,.3]){
    const p=c.map(n=>n+.5);p[axis]+=face==="z"?-.5:.5;p[others[0]]+=a;p[others[1]]+=b;
    const origin=p.map((n,k)=>n+1e-6*VIEW[k]);
    if(!cells.some((o,j)=>j!==i&&rayHitsBox(origin,o)))count++;
   }
   return count;
  }));
  const counts=faces.map(f=>f[0]+f[1]+f[2]);
  return freeze({faces,counts,readable:faces.map(f=>f.some(n=>n===9)),readableCubeCount:faces.filter(f=>f.some(n=>n===9)).length,visibleCubeCount:counts.filter(n=>n>0).length});
 }
 const fmt=n=>{const r=Math.round(n*10)/10;return Object.is(r,-0)?"0":String(r);};
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 // cells: 쌓기나무 칸, marked(cellIndex,face): 검게 칠할 면인지.
 function svg(cells,{marked=()=>false,label="쌓기나무 입체 그림",figureKey="",role="figure"}={}){
  if(!validCells(cells)||typeof marked!=="function")throw RangeError("Invalid cube drawing");
  const occupied=new Set(cells.map(key)),order=cells.map((c,i)=>i).sort((a,b)=>depth(cells[a])-depth(cells[b])||a-b);
  const points=[];for(const c of cells)for(const dx of[0,1])for(const dy of[0,1])for(const dz of[0,1])points.push(project(c[0]+dx,c[1]+dy,c[2]+dz));
  const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));
  const side=Math.max(maxX-minX,maxY-minY)+UNIT*.7,left=(minX+maxX)/2-side/2,top=(minY+maxY)/2-side/2;
  let markedFaces=0;const body=[];
  for(const i of order){
   const c=cells[i],parts=[];
   for(const face of["z","x","y"]){
    if(occupied.has(key(neighbour(c,face))))continue;
    const dark=marked(i,face)===true;if(dark)markedFaces++;
    parts.push(`<polygon points="${corners(c,face).map(p=>project(...p).map(fmt).join(",")).join(" ")}" fill="${FILL[dark?"marked":"plain"][face]}" data-face="${face}"${dark?' data-marked="true"':""}/>`);
   }
   // 가려진 쌓기나무도 빈 묶음으로 남겨 그림에 들어 있는 쌓기나무 전체를 읽을 수 있게 한다.
   body.push(`<g data-cell="${key(c)}">${parts.join("")}</g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="source62-iso-cubes" viewBox="${fmt(left)} ${fmt(top)} ${fmt(side)} ${fmt(side)}" width="1600" height="1600" role="img" aria-label="${escape(label)}" data-figure-role="${escape(role)}" data-figure-key="${escape(figureKey)}" data-cube-count="${cells.length}" data-marked-face-count="${markedFaces}"><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linejoin="round">${body.join("")}</g></svg>`;
 }
 const dataUrl=markup=>`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
 return freeze({visibility,svg,dataUrl,view:VIEW,fill:FILL,stroke:STROKE});
});
