import {createStackRenderer,FACE_COLORS,MARKED_FACE_COLORS} from "./source-6-2-stack-renderer.mjs";

const transform=(m,v)=>[0,1,2,3].map(r=>m[r]*v[0]+m[r+4]*v[1]+m[r+8]*v[2]+m[r+12]*v[3]);
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export function segmentMeetsBox(segment,box,clearance=4){
 const [x,y]=segment.start,dx=segment.end[0]-x,dy=segment.end[1]-y;let low=0,high=1;
 for(const[p,q]of [[-dx,x-box.left+clearance],[dx,box.right+clearance-x],[-dy,y-box.top+clearance],[dy,box.bottom+clearance-y]]){
  if(p===0){if(q<0)return false;continue;}const t=q/p;if(p<0)low=Math.max(low,t);else high=Math.min(high,t);if(low>high)return false;
 }
 return true;
}
export function renderCutFigure(host,model,{phase="given",requestedLayers=[],answerLineHalo=true,cropPadding=110,labelRadii=[76,100,124],labelAngles=[0,-Math.PI/6,Math.PI/6,-Math.PI/3,Math.PI/3],gridVertexOwnership=false,allowPointLeaders=false,replaceCoincidentGridEdges=false,markedCells,projection={kind:"cabinet",depthX:.5,depthY:.5}}={}){
 if(!["given","answer"].includes(phase)||!Array.isArray(model.dimensions)||model.dimensions.length!==3)throw new RangeError("Unsupported cut figure");
 if(!Number.isFinite(cropPadding)||cropPadding<110||cropPadding>250||!Array.isArray(labelRadii)||!labelRadii.length||!labelRadii.every(r=>Number.isFinite(r)&&r>=56&&r<=240)||!Array.isArray(labelAngles)||!labelAngles.length||!labelAngles.every(a=>Number.isFinite(a)&&Math.abs(a)<=Math.PI)||typeof gridVertexOwnership!=="boolean"||typeof allowPointLeaders!=="boolean"||typeof replaceCoincidentGridEdges!=="boolean")throw new RangeError("Unsupported cut-label profile");
 const[w,h,d]=model.dimensions,heights=Array.from({length:d},()=>Array(w).fill(h)),worldCell=c=>[c[0],c[1],d-1-c[2]],worldPoint=p=>[p[0]-.5,p[1]-.5,d-.5-p[2]];
 if(markedCells!==undefined&&(!Array.isArray(markedCells)||new Set(markedCells.map(c=>Array.isArray(c)?c.join(","):"invalid")).size!==markedCells.length||markedCells.some(c=>!Array.isArray(c)||c.length!==3||!c.every(Number.isSafeInteger)||!model.cubes.some(cell=>cell.every((v,i)=>v===c[i])))))throw new RangeError("Marked cells must be distinct cubes of this solid");
 const selected=markedCells===undefined?(phase==="answer"?model.cutCells.filter(c=>requestedLayers.includes(c[1]+1)):[]):markedCells;
 const cubeModel={cubes(input){if(JSON.stringify(input)!==JSON.stringify(heights))throw new Error("Altered cut-solid heights");return model.cubes.map(worldCell);}};
 const stack=createStackRenderer(host,{heights,cubeModel,interactive:false,directionLabels:false,pixelRatio:2,exteriorFacesOnly:true,
  markedCells:selected.map(worldCell),projection});
 try{
  const data=stack.inspect(),project=p=>{const v=transform(data.projection,transform(data.view,[...worldPoint(p),1]));return[(v[0]/v[3]+1)*data.width/2,(1-v[1]/v[3])*data.height/2];};
  const corners=[];for(const x of[0,w])for(const y of[0,h])for(const z of[0,d])corners.push(project([x,y,z]));
  const left=Math.min(...corners.map(p=>p[0]))-cropPadding,top=Math.min(...corners.map(p=>p[1]))-cropPadding,right=Math.max(...corners.map(p=>p[0]))+cropPadding,bottom=Math.max(...corners.map(p=>p[1]))+cropPadding;
  const canvas=document.createElement("canvas"),raw=document.createElement("canvas");canvas.width=1600;canvas.height=Math.ceil((bottom-top)*1600/(right-left));raw.width=data.width;raw.height=data.height;
  raw.getContext("2d").putImageData(new ImageData(data.pixels,data.width,data.height),0,0);
  const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(raw,left,top,right-left,bottom-top,0,0,canvas.width,canvas.height);
  const output=p=>{const a=project(p);return[(a[0]-left)*canvas.width/(right-left),(a[1]-top)*canvas.height/(bottom-top)];};
  const gridEdges=[];for(let i=0;i<=w;i++)gridEdges.push([[i,0,0],[i,h,0]],[[i,h,0],[i,h,d]]);
  for(let i=0;i<=h;i++)gridEdges.push([[0,i,0],[w,i,0]],[[w,i,0],[w,i,d]]);
  for(let i=0;i<=d;i++)gridEdges.push([[w,0,i],[w,h,i]],[[0,h,i],[w,h,i]]);
  const gridSegments=gridEdges.map(([a,b])=>({a,b,start:output(a),end:output(b)}));
  const sourceEdges=model.sectionEdges||model.planeSection.map((a,i)=>({a,b:model.planeSection[(i+1)%model.planeSection.length],style:"solid"}));
  const segments=sourceEdges.map(edge=>{
   if(!["solid","dashed"].includes(edge.style)||!edge.a||!edge.b)throw new Error("Missing source cut-edge semantics");
   return{...edge,start:output(edge.a),end:output(edge.b)};
  });
  const samePoint=(a,b)=>a.every((v,i)=>v===b[i]),sameEdge=(a,b)=>samePoint(a.a,b.a)&&samePoint(a.b,b.b)||samePoint(a.a,b.b)&&samePoint(a.b,b.a);
  const overridden=replaceCoincidentGridEdges?gridSegments.filter(grid=>segments.some(edge=>edge.style==="dashed"&&sameEdge(edge,grid))):[];
  if(replaceCoincidentGridEdges&&overridden.length!==2)throw new Error("Four-vertex source must own exactly two coincident grid edges");
  // Replace a declared grid stroke from exact face polygons, retaining crossing grid strokes.
  for(const edge of overridden){
   const dx=edge.end[0]-edge.start[0],dy=edge.end[1]-edge.start[1],length=Math.hypot(dx,dy),normal=[-dy/length*4,dx/length*4];
   ctx.save();ctx.beginPath();[[edge.start,1],[edge.end,1],[edge.end,-1],[edge.start,-1]].forEach(([p,s],i)=>ctx[i?"lineTo":"moveTo"](p[0]+normal[0]*s,p[1]+normal[1]*s));ctx.closePath();ctx.clip();ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
   const marked=new Set(selected.map(c=>c.join(",")));
   for(const [x,y,z]of model.cubes){
    const palette=marked.has([x,y,z].join(","))?MARKED_FACE_COLORS:FACE_COLORS,faces=[];
    if(x===w-1)faces.push({color:palette[0],points:[[w,y,z],[w,y+1,z],[w,y+1,z+1],[w,y,z+1]]});
    if(z===0)faces.push({color:palette[4],points:[[x,y,0],[x+1,y,0],[x+1,y+1,0],[x,y+1,0]]});
    if(y===h-1)faces.push({color:palette[2],points:[[x,h,z],[x+1,h,z],[x+1,h,z+1],[x,h,z+1]]});
    for(const face of faces){ctx.fillStyle=`#${face.color.toString(16).padStart(6,"0")}`;ctx.beginPath();face.points.map(output).forEach((p,i)=>ctx[i?"lineTo":"moveTo"](...p));ctx.closePath();ctx.fill();}
   }
   ctx.strokeStyle="#111";ctx.lineWidth=1;ctx.setLineDash([]);
   for(const grid of gridSegments.filter(g=>!overridden.some(other=>sameEdge(g,other)))){ctx.beginPath();ctx.moveTo(...grid.start);ctx.lineTo(...grid.end);ctx.stroke();}ctx.restore();
  }
  function drawSegment(segment,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(segment.style==="dashed"?[18,12]:[]);ctx.beginPath();ctx.moveTo(...segment.start);ctx.lineTo(...segment.end);ctx.stroke();}
  for(const segment of segments){if(phase==="answer"&&answerLineHalo)drawSegment(segment,"#fff",7);drawSegment(segment,"#000",3);}ctx.setLineDash([]);
  const center=output([w/2,h/2,d/2]),anchors=Object.entries(model.points).map(([name,point])=>({name,point,anchor:output(point)})),labels=[],leaders=[];
  const vertexAnchors=[];if(gridVertexOwnership)for(let x=0;x<=w;x++)for(let y=0;y<=h;y++)for(let z=0;z<=d;z++)if(x===w||y===h||z===0)vertexAnchors.push({point:[x,y,z],anchor:output([x,y,z])});
  ctx.font="400 72px 'Malgun Gothic',Arial,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#000";
  for(const owned of anchors){
   const base=Math.atan2(owned.anchor[1]-center[1],owned.anchor[0]-center[0]);let chosen,fallback;
   candidates:for(const radius of labelRadii)for(const angle of labelAngles){
    const x=owned.anchor[0]+Math.cos(base+angle)*radius,y=owned.anchor[1]+Math.sin(base+angle)*radius,m=ctx.measureText(owned.name),box={...owned,x,y,left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
    if(box.left<4||box.right>canvas.width-4||box.top<4||box.bottom>canvas.height-4)continue;
    if(labels.some(b=>box.left<b.right+6&&box.right>b.left-6&&box.top<b.bottom+6&&box.bottom>b.top-6))continue;
    if([...segments,...gridSegments,...leaders].some(s=>segmentMeetsBox(s,box,6)))continue;
    if(anchors.some(a=>a.name!==owned.name&&distance([x,y],a.anchor)<=distance([x,y],owned.anchor)+10))continue;
    if(vertexAnchors.some(a=>!samePoint(a.point,owned.point)&&distance([x,y],a.anchor)<=distance([x,y],owned.anchor)+10)){
     if(allowPointLeaders&&!fallback){
      const dx=owned.anchor[0]-x,dy=owned.anchor[1]-y,t=Math.min((Math.max(x-box.left,box.right-x)+8)/Math.abs(dx),(Math.max(y-box.top,box.bottom-y)+8)/Math.abs(dy)),leader={role:"point-label-leader",owner:owned.name,start:owned.anchor,end:[x+dx*t,y+dy*t]};
      const clearVertices=vertexAnchors.filter(a=>!samePoint(a.point,owned.point)).every(a=>!segmentMeetsBox(leader,{left:a.anchor[0]-4,right:a.anchor[0]+4,top:a.anchor[1]-4,bottom:a.anchor[1]+4},4));
      if(t<1&&distance(leader.start,leader.end)>=48&&clearVertices&&!labels.some(other=>segmentMeetsBox(leader,other,6)))fallback={...box,leader};
     }continue;
    }
    chosen=box;break candidates;
   }
   if(!chosen)chosen=fallback;
   if(!chosen)throw new Error(`No unambiguous point label: ${owned.name}`);
   if(chosen.leader){ctx.strokeStyle="#444";ctx.lineWidth=2;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(...chosen.leader.start);ctx.lineTo(...chosen.leader.end);ctx.stroke();leaders.push(chosen.leader);}
   labels.push(chosen);if(phase==="answer"){ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(...owned.anchor,7,0,Math.PI*2);ctx.fill();}
   ctx.fillStyle="#000";ctx.beginPath();ctx.arc(...owned.anchor,4,0,Math.PI*2);ctx.fill();ctx.fillText(owned.name,chosen.x,chosen.y);
  }
  let nonwhite=0;for(let i=0;i<data.pixels.length;i+=4)if(data.pixels[i]<253||data.pixels[i+1]<253||data.pixels[i+2]<253)nonwhite++;
  if(nonwhite<data.width*data.height*.1)throw new Error("Blank WebGL cut solid");
  return{url:canvas.toDataURL("image/png"),width:canvas.width,height:canvas.height,glyphSize:72,dimensions:model.dimensions,
   phase,cubeCount:data.cubeCount,markedCellCount:selected.length,markedCells:selected,labels,segments,gridSegments,
   gpuNonwhitePixels:nonwhite,rendererRevision:data.revision,answerLineHalo:phase==="answer"&&answerLineHalo,sourceCoordinateMap:"[x-.5,y-.5,depth-.5-z]",
   ...(replaceCoincidentGridEdges?{sourceOwnedGridEdges:overridden.map(edge=>({a:edge.a,b:edge.b,start:edge.start,end:edge.end,style:"dashed"})),cropPadding,labelRadii,labelAngles,vertexAnchors,leaders}: {})};
 }finally{stack.dispose();}
}
