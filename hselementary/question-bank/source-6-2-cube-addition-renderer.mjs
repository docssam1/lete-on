import * as THREE from "../../geometry/vendor/three/three.module.js";
import {createStackRenderer,FACE_COLORS,MARKED_FACE_COLORS} from "./source-6-2-stack-renderer.mjs";

const projection={kind:"source-affine",horizontal:[Math.sqrt(3)/2,0,-Math.sqrt(3)/2],vertical:[-.5,1,-.5]};
const directions=[[1,0,0],[0,1,0],[0,0,1]],viewDirection=new THREE.Vector3(1,1,1).normalize();
const key=c=>c.join(","),clone=cells=>cells.map(c=>[...c]);
function frame(cells,added){
 const min=[0,1,2].map(i=>Math.min(...cells.map(c=>c[i]))),max=[0,1,2].map(i=>Math.max(...cells.map(c=>c[i]))),dimensions=max.map((n,i)=>n-min[i]+1);
 const world=cells.map(c=>[c[0]-min[0],c[1]-min[1],max[2]-c[2]]),addedWorld=added?[added[0]-min[0],added[1]-min[1],max[2]-added[2]]:null;
 return{sourceCells:clone(cells),world,added:added?[...added]:null,addedWorld,min,max,dimensions};
}
function visibleSamples(framed){
 const boxes=framed.world.map(c=>new THREE.Box3(new THREE.Vector3(...c).addScalar(-.5),new THREE.Vector3(...c).addScalar(.5))),ray=new THREE.Ray(),hit=new THREE.Vector3(),counts=[],completeFaces=[],probes=[];
 for(let i=0;i<framed.world.length;i++){
  const c=framed.world[i],faceCounts=[0,0,0];let count=0;
  for(let face=0;face<3;face++)for(const a of[-.3,0,.3])for(const b of[-.3,0,.3]){
   const axes=[0,1,2].filter(axis=>axis!==face),point=[...c];point[face]+=.5;point[axes[0]]+=a;point[axes[1]]+=b;
   ray.origin.set(...point).addScaledVector(viewDirection,.00001);ray.direction.copy(viewDirection);
   if(boxes.some((box,j)=>j!==i&&ray.intersectBox(box,hit)!==null))continue;
   count++;faceCounts[face]++;probes.push({cellIndex:i,faceIndex:face*2,point,marked:framed.addedWorld!==null&&key(c)===key(framed.addedWorld)});
  }
  counts.push(count);completeFaces.push(faceCounts.filter(n=>n===9).length);
 }
 const addedIndex=framed.addedWorld?framed.world.findIndex(c=>key(c)===key(framed.addedWorld)):-1;
 return{counts,completeFaces,probes,visibleCubeCount:counts.filter(n=>n>0).length,readableCubeCount:completeFaces.filter(n=>n>0).length,addedSamples:addedIndex<0?0:counts[addedIndex]};
}
export function selectAdditionView(model,models,{kind="given",classIndex,witnessIndex}={}){
 const baseCount={"6-2-u3-e4-example-4":6,"6-2-u3-e4-mission-4":4}[model?.sourceItemId];
 if(!baseCount||model.baseCubeCount!==baseCount||model.cells?.length!==baseCount||!models?.rotations||!["given","class"].includes(kind))throw new RangeError("Unsupported addition figure");
 if(kind==="given"){
  const framed=frame(model.cells,null),visibility=visibleSamples(framed);
  const partial=model.cells.filter((cell,index)=>visibility.completeFaces[index]===0);
  // Mission 4 supplies four cubes; its rear connector has a visible top wedge.
  const sourceWedge=model.sourceItemId==="6-2-u3-e4-mission-4"&&partial.length===1&&key(partial[0])==="0,0,1"&&visibility.readableCubeCount===3;
  if(visibility.visibleCubeCount!==baseCount||visibility.readableCubeCount!==baseCount&&!sourceWedge)throw new Error("Source cube visibility does not match its declared source profile");
  return{...framed,visibility,kind,rotationIndex:null,rotationDeterminant:1,classIndex:null,witnessIndex:null};
 }
 const group=model.classes[classIndex];if(!Number.isSafeInteger(classIndex)||!group||witnessIndex!==undefined&&(!Number.isSafeInteger(witnessIndex)||!group.witnesses[witnessIndex]))throw new RangeError("Invalid addition class or witness");
 let best;
 const members=witnessIndex===undefined?group.witnesses.map((_,i)=>i):[witnessIndex];
 for(const member of members)for(const rotation of models.rotations){
  if(rotation.determinant!==1)throw new Error("A reflection cannot be a camera pose");
  const witness=group.witnesses[member],cells=models.orient(witness.cells,rotation.index),added=models.orient([...model.cells,witness.added],rotation.index).at(-1),framed=frame(cells,added),visibility=visibleSamples(framed);
  const score=visibility.visibleCubeCount*10000000+visibility.readableCubeCount*1000000+Number(visibility.addedSamples>=9)*100000+Math.min(...visibility.counts)*1000+visibility.addedSamples*10+visibility.counts.reduce((s,n)=>s+n,0);
  if(!best||score>best.score)best={...framed,visibility,score,kind,classIndex,witnessIndex:member,rotationIndex:rotation.index,rotationMatrix:rotation.matrix,rotationDeterminant:rotation.determinant};
 }
 if(best.visibility.visibleCubeCount!==baseCount+1||best.visibility.readableCubeCount!==baseCount+1||best.visibility.addedSamples<9)throw new Error("A second view is required to show every cube and the added position");
 return best;
}
export function renderCubeAdditionFigure(host,model,models,options={}){
 const pose=selectAdditionView(model,models,options),[width,height,depth]=pose.dimensions,heights=Array.from({length:depth},()=>Array(width).fill(height));
 const fullCells=[];for(let x=0;x<width;x++)for(let y=0;y<height;y++)for(let z=0;z<depth;z++)fullCells.push([x,y,z]);
 const reference=createStackRenderer(host,{heights,cubeModel:{cubes:()=>fullCells},interactive:false,directionLabels:false,pixelRatio:2,projection,exteriorFacesOnly:true});
 let calibration;try{calibration=reference.inspect();}finally{reference.dispose();}
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setClearColor(0xffffff,1);renderer.setPixelRatio(1);renderer.setSize(calibration.width,calibration.height,false);renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);
 const camera=new THREE.Camera();camera.matrixAutoUpdate=false;camera.matrixWorldAutoUpdate=false;camera.projectionMatrix.fromArray(calibration.projection);camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();camera.matrixWorld.fromArray(calibration.world);camera.matrixWorldInverse.fromArray(calibration.view);
 const scene=new THREE.Scene(),cube=new THREE.BoxGeometry(1,1,1),edges=new THREE.EdgesGeometry(cube),materials=FACE_COLORS.map(color=>new THREE.MeshBasicMaterial({color,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1})),marked=MARKED_FACE_COLORS.map(color=>new THREE.MeshBasicMaterial({color,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1})),lineMaterial=new THREE.LineBasicMaterial({color:0x111111}),matrix=new THREE.Matrix4(),records=[];
 const ordinary=pose.world.filter(c=>!pose.addedWorld||key(c)!==key(pose.addedWorld)),instances=new THREE.InstancedMesh(cube,materials,ordinary.length);scene.add(instances);
 for(let i=0;i<ordinary.length;i++){matrix.makeTranslation(...ordinary[i]);instances.setMatrixAt(i,matrix);instances.getMatrixAt(i,matrix);records.push({world:new THREE.Vector3().setFromMatrixPosition(matrix).toArray(),marked:false});}
 instances.instanceMatrix.needsUpdate=true;
 if(pose.addedWorld){const mesh=new THREE.Mesh(cube,marked);mesh.position.set(...pose.addedWorld);scene.add(mesh);records.push({world:mesh.position.toArray(),marked:true});}
 for(const c of pose.world){const line=new THREE.LineSegments(edges,lineMaterial);line.position.set(...c);scene.add(line);}
 const project=p=>{const v=new THREE.Vector3(...p).project(camera);return[(v.x+1)*calibration.width/2,(1-v.y)*calibration.height/2];};
 try{
  if(records.length!==pose.world.length||new Set(records.map(r=>key(r.world))).size!==pose.world.length)throw new Error("The rendered cube set is incomplete");
  renderer.render(scene,camera);const corners=[];for(const x of[-.5,width-.5])for(const y of[-.5,height-.5])for(const z of[-.5,depth-.5])corners.push(project([x,y,z]));
  const left=Math.min(...corners.map(p=>p[0])),right=Math.max(...corners.map(p=>p[0])),top=Math.min(...corners.map(p=>p[1])),bottom=Math.max(...corners.map(p=>p[1])),side=Math.max(right-left,bottom-top)+100,cx=(left+right)/2,cy=(top+bottom)/2;
  const output=document.createElement("canvas");output.width=1600;output.height=1600;const ctx=output.getContext("2d",{willReadFrequently:true});ctx.fillStyle="#fff";ctx.fillRect(0,0,1600,1600);ctx.drawImage(renderer.domElement,cx-side/2,cy-side/2,side,side,0,0,1600,1600);
  const probes=pose.visibility.probes.map(p=>{const q=project(p.point);return{...p,pixel:[(q[0]-cx+side/2)*1600/side,(q[1]-cy+side/2)*1600/side],expectedColor:p.marked?MARKED_FACE_COLORS[p.faceIndex]:FACE_COLORS[p.faceIndex]};});
  const data=ctx.getImageData(0,0,1600,1600).data;let ink=0;for(let i=0;i<data.length;i+=4)if(data[i]<240||data[i+1]<240||data[i+2]<240)ink++;if(ink<1600*1600*.05)throw new Error("Blank addition diagram");
  return{url:output.toDataURL("image/png"),width:1600,height:1600,pose,meshes:records,probes,ink,rendererRevision:THREE.REVISION,view:calibration.view,projection:calibration.projection,heightColumnCompressionUsed:false};
 }finally{instances.dispose();cube.dispose();edges.dispose();materials.forEach(m=>m.dispose());marked.forEach(m=>m.dispose());lineMaterial.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
}
