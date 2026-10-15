import * as THREE from "../../geometry/vendor/three/three.module.js";
import {createStackRenderer,FACE_COLORS,MARKED_FACE_COLORS} from "./source-6-2-stack-renderer.mjs";

const key=cell=>cell.join(","),neighbors=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const transform=(m,v)=>[0,1,2,3].map(r=>m[r]*v[0]+m[r+4]*v[1]+m[r+8]*v[2]+m[r+12]*v[3]);
export function renderRemovalFigure(host,model,{phase="given"}={}){
 const sourceDimensions={"6-2-u3-e4-example-3":[5,5,5],"6-2-u3-e4-mission-5":[5,4,6]}[model?.sourceItemId];
 if(!sourceDimensions||JSON.stringify(model.dimensions)!==JSON.stringify(sourceDimensions)||model.sourceItemId==="6-2-u3-e4-example-3"&&model.n!==5||!["given","remaining"].includes(phase))throw new RangeError("Unsupported removal-figure model");
 const[w,h,d]=model.dimensions,worldCell=([x,y,z])=>[x,y,d-1-z],worldPoint=([x,y,z])=>[x-.5,y-.5,d-.5-z];
 const heights=Array.from({length:d},()=>Array(w).fill(h)),cubeModel={cubes:()=>model.cells.map(worldCell)};
 const projection=model.sourceItemId==="6-2-u3-e4-mission-5"?{kind:"source-affine",horizontal:[Math.sqrt(3)/2,0,-Math.sqrt(3)/2],vertical:[-.5,1,-.5]}:{kind:"cabinet",depthX:.5,depthY:.5};
 const reference=createStackRenderer(host,{heights,cubeModel,markedCells:model.paintCells.map(worldCell),interactive:false,directionLabels:false,pixelRatio:2,exteriorFacesOnly:true,projection});
 let calibration;
 try{calibration=reference.inspect();}finally{reference.dispose();}
 const project=point=>{const v=transform(calibration.projection,transform(calibration.view,[...worldPoint(point),1]));return[(v[0]/v[3]+1)*calibration.width/2,(1-v[1]/v[3])*calibration.height/2];};
 const corners=[];for(const x of[0,w])for(const y of[0,h])for(const z of[0,d])corners.push(project([x,y,z]));
 const left=Math.min(...corners.map(p=>p[0]))-60,top=Math.min(...corners.map(p=>p[1]))-60,right=Math.max(...corners.map(p=>p[0]))+60,bottom=Math.max(...corners.map(p=>p[1]))+60;
 const canvas=document.createElement("canvas"),raw=document.createElement("canvas");canvas.width=1600;canvas.height=Math.ceil((bottom-top)*1600/(right-left));raw.width=calibration.width;raw.height=calibration.height;
 const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
 const output=point=>{const p=project(point);return[(p[0]-left)*canvas.width/(right-left),(p[1]-top)*canvas.height/(bottom-top)];};
 let pixels=calibration.pixels,meshes=[],exposedFaceCount=0;
 if(phase==="remaining"){
  const sourceCells=model.remaining,occupied=new Set(sourceCells.map(worldCell).map(key)),sourceKeys=new Set(sourceCells.map(key));
  if(occupied.size!==sourceCells.length||sourceCells.length!==model.remainingCount||sourceCells.some(c=>!model.cells.some(original=>key(original)===key(c))))throw new Error("Invalid remaining-cell addresses");
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setClearColor(0xffffff,1);renderer.setPixelRatio(1);renderer.setSize(calibration.width,calibration.height,false);renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.Camera();camera.matrixAutoUpdate=false;camera.matrixWorldAutoUpdate=false;camera.projectionMatrix.fromArray(calibration.projection);camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();camera.matrixWorld.fromArray(calibration.world);camera.matrixWorldInverse.fromArray(calibration.view);
  const cube=new THREE.BoxGeometry(1,1,1),edges=new THREE.EdgesGeometry(cube),geometries=new Map(),materials=[...FACE_COLORS,...MARKED_FACE_COLORS].map(color=>new THREE.MeshBasicMaterial({color,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1})),lineMaterial=new THREE.LineBasicMaterial({color:0x111111});
  const masks={top:new Set(model.faces.top.map(key)),front:new Set(model.faces.front.map(key)),right:new Set(model.faces.right.map(key))};
  try{
   for(const source of sourceCells){
    const [x,y,z]=source,cell=worldCell(source),exposed=neighbors.reduce((mask,delta,face)=>occupied.has(key(cell.map((value,axis)=>value+delta[axis])))?mask:mask|(1<<face),0);
    const painted=(x===w-1&&masks.right.has(key([z,y]))?1:0)|(y===h-1&&masks.top.has(key([x,z]))?4:0)|(z===0&&masks.front.has(key([x,y]))?16:0),geometryKey=`${exposed}:${painted}`;
    if(!geometries.has(geometryKey)){
     const geometry=cube.clone();geometry.clearGroups();for(const group of cube.groups)if(exposed&(1<<group.materialIndex))geometry.addGroup(group.start,group.count,group.materialIndex+(painted&(1<<group.materialIndex)?6:0));geometries.set(geometryKey,geometry);
    }
    const mesh=new THREE.Mesh(geometries.get(geometryKey),materials);mesh.position.set(...cell);mesh.userData.sourceCell=[...source];scene.add(mesh);const line=new THREE.LineSegments(edges,lineMaterial);line.position.copy(mesh.position);scene.add(line);
    const faceCount=neighbors.filter((_,face)=>exposed&(1<<face)).length;exposedFaceCount+=faceCount;meshes.push({cell:[...mesh.userData.sourceCell],world:mesh.position.toArray(),exposed,painted,materialGroups:mesh.geometry.groups.map(g=>({...g}))});
   }
   if(meshes.length!==model.remainingCount||new Set(meshes.map(m=>key(m.cell))).size!==sourceKeys.size)throw new Error("Rendered cells differ from the actual remaining cubes");
   renderer.render(scene,camera);const copy=document.createElement("canvas");copy.width=calibration.width;copy.height=calibration.height;const context=copy.getContext("2d",{willReadFrequently:true});context.drawImage(renderer.domElement,0,0);pixels=context.getImageData(0,0,copy.width,copy.height).data;
  }finally{cube.dispose();edges.dispose();for(const geometry of geometries.values())geometry.dispose();materials.forEach(m=>m.dispose());lineMaterial.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
 }else{
  meshes=calibration.cells.map(world=>({cell:[world[0],world[1],d-1-world[2]],world}));
 }
 raw.getContext("2d").putImageData(new ImageData(pixels,calibration.width,calibration.height),0,0);ctx.drawImage(raw,left,top,right-left,bottom-top,0,0,canvas.width,canvas.height);
 const faceCenters=[],remainingKeys=new Set(model.remaining.map(key));for(const face of["top","front","right"])for(let a=0;a<(face==="right"?d:w);a++)for(let b=0;b<(face==="top"?d:h);b++){
  const point=face==="top"?[a+.5,h,b+.5]:face==="front"?[a+.5,b+.5,0]:[w,b+.5,a+.5],cell=face==="top"?[a,h-1,b]:face==="front"?[a,b,0]:[w-1,b,a],sourcePainted=model.faces[face].some(c=>c[0]===a&&c[1]===b),present=phase==="given"||remainingKeys.has(key(cell));
  faceCenters.push({face,a,b,cell,point,pixel:output(point),sourcePainted,present,painted:present&&sourcePainted});
 }
 let ink=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]<240||pixels[i+1]<240||pixels[i+2]<240)ink++;if(ink<calibration.width*calibration.height*.05)throw new Error("Blank removal figure");
 return{url:canvas.toDataURL("image/png"),width:canvas.width,height:canvas.height,phase,meshes,exposedFaceCount,faceCenters,gpuNonwhitePixels:ink,rendererRevision:THREE.REVISION,view:calibration.view,projection:calibration.projection,sourceCoordinateMap:"[x,y,depth-1-z]",positionsPreserved:true,heightColumnCompressionUsed:false};
}
