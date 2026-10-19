import * as THREE from "../../geometry/vendor/three/three.module.js";
import { OrbitControls } from "../../geometry/vendor/three/addons/controls/OrbitControls.js";

export const FACE_COLORS = Object.freeze([0xc5d9dc, 0xdbe5e3, 0xfafcf8, 0xd2d6d5, 0xe2eee8, 0xe7ece8]);
export const MARKED_FACE_COLORS = Object.freeze([0x333333, 0x444444, 0x555555, 0x444444, 0x3d3d3d, 0x4d4d4d]);

export function validateSourceCubeGeometry(heights, cells) {
  if (!Array.isArray(heights) || !heights.length || heights.length>64 || !Array.isArray(heights[0]) || !heights[0].length || heights[0].length>64
    || !Array.from({length:heights.length},(_,z)=>Object.hasOwn(heights,z) && Array.isArray(heights[z]) && heights[z].length===heights[0].length
      && Array.from({length:heights[z].length},(_,x)=>Object.hasOwn(heights[z],x) && Number.isSafeInteger(heights[z][x]) && heights[z][x]>=0 && heights[z][x]<=64).every(Boolean)).every(Boolean)) throw new Error("Invalid source cube geometry");
  const total=heights.flat().reduce((sum,n)=>sum+n,0);
  if(!total || total>10000 || !Array.isArray(cells) || cells.length!==total || !Array.from({length:cells.length},(_,i)=>Object.hasOwn(cells,i) && Array.isArray(cells[i]) && cells[i].length===3
    && [0,1,2].every(axis=>Object.hasOwn(cells[i],axis) && Number.isSafeInteger(cells[i][axis]))
    && cells[i][2]>=0 && cells[i][2]<heights.length && cells[i][0]>=0 && cells[i][0]<heights[0].length && cells[i][1]>=0 && cells[i][1]<heights[cells[i][2]][cells[i][0]]).every(Boolean)
    || new Set(cells.map(cell=>cell.join(","))).size!==total) throw new Error("Invalid source cube geometry");
}

export function createStackRenderer(host, { heights, interactive = true, pixelRatio = 2, markedCells = [], annotations = [], cameraDirection = [1,1,1], cubeModel, faceColors = FACE_COLORS, directionLabels = true, projection, exteriorFacesOnly = false } = {}) {
  const api = cubeModel ?? window.HSE_SOURCE_GRADE6_STACK_MODELS;
  if(!api || typeof api.cubes!=="function") throw new Error("Invalid source cube model");
  const cells = api.cubes(heights);
  validateSourceCubeGeometry(heights,cells);
  const key = cell => cell.join(","), occupied = new Set(cells.map(key));
  if(typeof exteriorFacesOnly!=="boolean")throw new Error("Invalid exterior face setting");
  const validCell = cell => Array.isArray(cell) && cell.length===3 && cell.every(Number.isSafeInteger) && occupied.has(key(cell));
  if (!Array.isArray(markedCells) || !markedCells.every(validCell) || new Set(markedCells.map(key)).size!==markedCells.length) throw new Error("Invalid marked cube addresses");
  if (!Array.isArray(annotations) || !annotations.every(mark=>validCell(mark.cell) && !occupied.has(key([mark.cell[0],mark.cell[1]+1,mark.cell[2]])) && typeof mark.text==="string" && [...mark.text].length===1) || new Set(annotations.map(mark=>key(mark.cell))).size!==annotations.length || new Set(annotations.map(mark=>mark.text)).size!==annotations.length) throw new Error("Invalid top-face annotations");
  if (!Array.isArray(cameraDirection) || cameraDirection.length!==3 || !cameraDirection.every(n=>Number.isFinite(n)&&n>0&&n<=10)) throw new Error("Invalid source camera direction");
  if (!Array.isArray(faceColors) || faceColors.length!==6 || !Array.from({length:6},(_,i)=>Object.hasOwn(faceColors,i)&&Number.isSafeInteger(faceColors[i])&&faceColors[i]>=0&&faceColors[i]<=0xffffff).every(Boolean) || typeof directionLabels!=="boolean") throw new Error("Invalid source face palette or direction labels");
  if (projection!==undefined) {
    const cabinet=projection&&projection.kind==="cabinet"&&Number.isFinite(projection.depthX)&&Number.isFinite(projection.depthY)&&projection.depthX>0&&projection.depthX<=1&&projection.depthY>0&&projection.depthY<=1;
    const rows=projection?.kind==="source-affine"?[projection.horizontal,projection.vertical]:[];
    const affine=rows.length===2&&rows.every(row=>Array.isArray(row)&&row.length===3&&[0,1,2].every(i=>Object.hasOwn(row,i)&&Number.isFinite(row[i])&&Math.abs(row[i])<=2))&&rows[0][0]>=.5&&rows[1][1]>=.5&&rows[0][0]*rows[1][1]-rows[0][1]*rows[1][0]>.05;
    if(interactive||(!cabinet&&!affine))throw new Error("Invalid fixed source projection");
  }
  const markedKeys = new Set(markedCells.map(key));
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setClearColor(0xffffff, 1);
  renderer.setPixelRatio(Math.min(pixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.style.removeProperty("display");
  canvas.className = "source62-stack-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "앞쪽과 오른쪽에서 바라본 쌓기나무 입체 그림");
  canvas.setAttribute("tabindex", "0");
  host.append(canvas);
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const exteriorGeometries=new Map(),faceNeighbors=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  function cubeGeometry(cell){
    if(!exteriorFacesOnly)return geometry;
    const mask=faceNeighbors.reduce((bits,delta,face)=>occupied.has(key(cell.map((n,axis)=>n+delta[axis])))?bits:bits|(1<<face),0);
    if(!exteriorGeometries.has(mask)){
      const exposed=geometry.clone();exposed.clearGroups();
      for(const group of geometry.groups)if(mask&(1<<group.materialIndex))exposed.addGroup(group.start,group.count,group.materialIndex);
      exteriorGeometries.set(mask,exposed);
    }
    return exteriorGeometries.get(mask);
  }
  const edges = new THREE.EdgesGeometry(geometry);
  const materials = faceColors.map(color => new THREE.MeshBasicMaterial({ color, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
  const markedMaterials = markedCells.length ? MARKED_FACE_COLORS.map(color => new THREE.MeshBasicMaterial({ color, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })) : [];
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x111111 });
  for (const [x,y,z] of cells) {
    const mesh = new THREE.Mesh(cubeGeometry([x,y,z]), markedKeys.has(key([x,y,z])) ? markedMaterials : materials);
    mesh.position.set(x,y,z);
    mesh.userData.cell = [x,y,z];
    group.add(mesh);
    const line = new THREE.LineSegments(edges, edgeMaterial);
    line.position.copy(mesh.position);
    group.add(line);
  }
  const bounds = new THREE.Box3().setFromObject(group), center = bounds.getCenter(new THREE.Vector3());
  const distance = bounds.getSize(new THREE.Vector3()).length() + 12;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 100);
  camera.position.copy(center).add(new THREE.Vector3(...cameraDirection).normalize().multiplyScalar(distance));
  camera.lookAt(center);
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(center);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = false;
  controls.enabled = interactive;
  controls.minPolarAngle = .2;
  controls.maxPolarAngle = Math.PI / 2 - .05;
  controls.update();
  controls.saveState();
  const labels = (directionLabels ? [
    ["앞", new THREE.Vector3(center.x, -.5, bounds.max.z + .8)],
    ["오른쪽", new THREE.Vector3(bounds.max.x + .8, -.5, center.z)]
  ] : []).map(([name,point]) => {
    const el = document.createElement("span");
    el.className = "source62-stack-direction";
    el.textContent = name;
    el.dataset.direction = name;
    host.append(el);
    return {el,point};
  });
  const marks = annotations.map(({cell,text})=>{
    const el=document.createElement("canvas");
    el.className="source62-stack-mark";el.textContent=text;el.dataset.cube=key(cell);
    el.setAttribute("role","img");el.setAttribute("aria-label",text);
    Object.assign(el.style,{position:"absolute",transform:"translate(-50%, -50%)",pointerEvents:"none",color:"#000",font:"400 18px var(--bank-font, Pretendard, 'Malgun Gothic', Arial, sans-serif)",letterSpacing:"0"});
    host.append(el);
    return {el,cell:[...cell],point:new THREE.Vector3(cell[0],cell[1]+.501,cell[2])};
  });
  const raycaster=new THREE.Raycaster();
  function setRay(point){
    if(!projection){raycaster.setFromCamera(point,camera);return;}
    const near=new THREE.Vector3(point.x,point.y,-1).unproject(camera),far=new THREE.Vector3(point.x,point.y,1).unproject(camera);
    raycaster.ray.set(near,far.sub(near).normalize());
  }
  const measureContext=document.createElement("canvas").getContext("2d");
  const meshes=group.children.filter(child=>child.isMesh);
  let width = 1, height = 1, disposed = false;
  function placeMark(mark, fontSize) {
    const style=getComputedStyle(mark.el);
    measureContext.font=`400 ${fontSize}px ${style.fontFamily}`;
    measureContext.textBaseline="middle";
    measureContext.textAlign="center";
    const metrics=measureContext.measureText(mark.el.textContent);
    const fingerprint=[width,height,fontSize,metrics.width,...camera.matrixWorld.elements].join(",");
    if(mark.placementFingerprint===fingerprint)return;
    // Search only on this cube's actual top plane, and reserve the complete glyph box.
    const offsets=[];
    for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++)offsets.push([i*.05,j*.05]);
    offsets.sort((a,b)=>a[0]*a[0]+a[1]*a[1]-b[0]*b[0]-b[1]*b[1]);
    const ownFace=(x,y)=>{
      setRay(new THREE.Vector2(x/width*2-1,1-y/height*2));
      const hit=raycaster.intersectObjects(meshes,false)[0];
      return hit && key(hit.object.userData.cell)===key(mark.cell) && hit.face.materialIndex===2;
    };
    for(const [dx,dz] of offsets){
      const point=new THREE.Vector3(mark.cell[0]+dx,mark.cell[1]+.501,mark.cell[2]+dz),p=point.clone().project(camera);
      const x=(p.x+1)*width/2,y=(1-p.y)*height/2;
      const l=x-metrics.actualBoundingBoxLeft-2,r=x+metrics.actualBoundingBoxRight+2;
      const t=y-metrics.actualBoundingBoxAscent-2,b=y+metrics.actualBoundingBoxDescent+2;
      let fits=true;
      const nx=Math.ceil((r-l)/4),ny=Math.ceil((b-t)/4);
      for(let ix=0;ix<=nx&&fits;ix++)for(let iy=0;iy<=ny&&fits;iy++)fits=!!ownFace(l+(r-l)*ix/nx,t+(b-t)*iy/ny);
      if(!fits)continue;
      mark.point.copy(point);mark.placementFingerprint=fingerprint;
      const glyphWidth=Math.ceil(Math.max(metrics.actualBoundingBoxLeft,metrics.actualBoundingBoxRight)*2+4);
      const glyphHeight=Math.ceil(Math.max(metrics.actualBoundingBoxAscent,metrics.actualBoundingBoxDescent)*2+4);
      mark.el.width=glyphWidth*2;mark.el.height=glyphHeight*2;
      mark.el.style.width=`${glyphWidth}px`;mark.el.style.height=`${glyphHeight}px`;
      const context=mark.el.getContext("2d");context.scale(2,2);
      context.font=measureContext.font;context.fillStyle="#000";context.textAlign="center";context.textBaseline="middle";
      context.fillText(mark.el.textContent,glyphWidth/2,glyphHeight/2);
      return;
    }
    throw new Error(`No readable top-face space for source glyph ${mark.el.textContent}`);
  }
  function fit() {
    const distance=projection ? bounds.getSize(new THREE.Vector3()).length()*3 : 0;
    if(projection){camera.position.set(center.x,center.y,center.z+distance);camera.lookAt(center);}
    camera.updateMatrixWorld(true);
    let extentX = 0, extentY = 0;
    // Fit all eight corners, not a hand-selected visible outline.
    for (const x of [bounds.min.x,bounds.max.x]) for (const y of [bounds.min.y,bounds.max.y]) for (const z of [bounds.min.z,bounds.max.z]) {
      const v = new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);
      if(projection?.kind==="source-affine"){const p=[v.x,v.y,v.z+distance];v.x=projection.horizontal.reduce((sum,n,i)=>sum+n*p[i],0);v.y=projection.vertical.reduce((sum,n,i)=>sum+n*p[i],0);}
      else if(projection){v.x-=projection.depthX*(v.z+distance);v.y-=projection.depthY*(v.z+distance);}
      extentX = Math.max(extentX, Math.abs(v.x));
      extentY = Math.max(extentY, Math.abs(v.y));
    }
    for (const {point} of labels) {
      const v = point.clone().applyMatrix4(camera.matrixWorldInverse);
      if(projection?.kind==="source-affine"){const p=[v.x,v.y,v.z+distance];v.x=projection.horizontal.reduce((sum,n,i)=>sum+n*p[i],0);v.y=projection.vertical.reduce((sum,n,i)=>sum+n*p[i],0);}
      else if(projection){v.x-=projection.depthX*(v.z+distance);v.y-=projection.depthY*(v.z+distance);}
      extentX = Math.max(extentX, Math.abs(v.x));
      extentY = Math.max(extentY, Math.abs(v.y));
    }
    const halfY = Math.max(extentY, extentX / (width / height)) * 1.2;
    camera.left = -halfY * width / height;
    camera.right = -camera.left;
    camera.top = halfY;
    camera.bottom = -halfY;
    camera.updateProjectionMatrix();
    if(projection){
      // Source projections change the view, never the unit-cube coordinates.
      const p=camera.projectionMatrix.elements;
      if(projection.kind==="source-affine"){
        const sx=p[0],sy=p[5],h=projection.horizontal,v=projection.vertical;
        for(let i=0;i<3;i++){p[i*4]=sx*h[i];p[i*4+1]=sy*v[i];}
        p[12]+=sx*h[2]*distance;p[13]+=sy*v[2]*distance;
      }else{p[8]=-p[0]*projection.depthX;p[9]=-p[5]*projection.depthY;p[12]-=p[0]*projection.depthX*distance;p[13]-=p[5]*projection.depthY*distance;}
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    }
  }
  function draw() {
    if (disposed) return;
    fit();
    renderer.render(scene, camera);
    for(const mark of marks){
      const fontSize=Math.max(14,28*Math.min(width/640,height/520));
      mark.el.style.fontSize=`${fontSize}px`;
      placeMark(mark,fontSize);
    }
    for (const {el,point} of [...labels,...marks]) {
      const p = point.clone().project(camera);
      el.style.left = `${(p.x + 1) * width / 2}px`;
      el.style.top = `${(1 - p.y) * height / 2}px`;
    }
  }
  function resize() {
    if (disposed) return;
    width = Math.max(1,host.clientWidth);
    height = Math.max(1,host.clientHeight);
    renderer.setSize(width, height, false);
    draw();
  }
  function reset() { controls.reset(); draw(); }
  function keyboard(event) {
    if (event.key === "Home") { event.preventDefault(); reset(); }
  }
  canvas.addEventListener("keydown", keyboard);
  controls.addEventListener("change", draw);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  return {
    reset,
    render: draw,
    snapshot({width: exportWidth = 640, height: exportHeight = 520, directionFontSize, annotationFontSize = 28} = {}) {
      if (!Number.isInteger(exportWidth) || !Number.isInteger(exportHeight) || exportWidth < 200 || exportHeight < 200 || exportWidth > 1600 || exportHeight > 1600) throw new Error("Invalid export dimensions");
      if (directionFontSize !== undefined && (!Number.isFinite(directionFontSize) || directionFontSize < 12 || directionFontSize > 32)) throw new Error("Invalid direction font size");
      if (!Number.isFinite(annotationFontSize) || annotationFontSize < 12 || annotationFontSize > 32) throw new Error("Invalid annotation font size");
      reset(); width = exportWidth; height = exportHeight;
      renderer.setSize(width,height,false);
      try {
      draw();
      const output = document.createElement("canvas");
      output.width = canvas.width; output.height = canvas.height;
      const ctx = output.getContext("2d"), ratio = output.width / width;
      ctx.drawImage(canvas,0,0);
      ctx.fillStyle = "#000"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const {el} of labels) {
        const style = getComputedStyle(el);
        ctx.font = `${style.fontWeight} ${(directionFontSize ?? parseFloat(style.fontSize))*ratio}px ${style.fontFamily}`;
        const x = parseFloat(el.style.left)*ratio, y = parseFloat(el.style.top)*ratio, metrics = ctx.measureText(el.textContent);
        if (x-metrics.actualBoundingBoxLeft < 4 || x+metrics.actualBoundingBoxRight > output.width-4 || y-metrics.actualBoundingBoxAscent < 4 || y+metrics.actualBoundingBoxDescent > output.height-4) throw new Error("Direction label outside snapshot");
        ctx.fillText(el.textContent,x,y);
      }
      const markBoxes=[];
      for(const mark of marks) {
        placeMark(mark,annotationFontSize);
        const {el,cell,point}=mark;
        const p=point.clone().project(camera);
        setRay(new THREE.Vector2(p.x,p.y));
        const hit=raycaster.intersectObjects(group.children.filter(child=>child.isMesh),false)[0];
        if (!hit || key(hit.object.userData.cell)!==key(cell) || hit.face.materialIndex!==2) throw new Error("Annotated top face is occluded");
        const style=getComputedStyle(el);
        ctx.font=`${style.fontWeight} ${annotationFontSize*ratio}px ${style.fontFamily}`;
        const x=(p.x+1)*width/2*ratio,y=(1-p.y)*height/2*ratio,metrics=ctx.measureText(el.textContent);
        const box={left:x-metrics.actualBoundingBoxLeft,right:x+metrics.actualBoundingBoxRight,top:y-metrics.actualBoundingBoxAscent,bottom:y+metrics.actualBoundingBoxDescent};
        if(box.left<4||box.right>output.width-4||box.top<4||box.bottom>output.height-4)throw new Error("Annotation label outside snapshot");
        if(markBoxes.some(other=>box.left<other.right+2&&box.right>other.left-2&&box.top<other.bottom+2&&box.bottom>other.top-2))throw new Error("Annotation labels overlap");
        markBoxes.push(box);ctx.fillText(el.textContent,x,y);
      }
      return output.toDataURL("image/png");
      } finally { resize(); }
    },
    inspect() {
      draw();
      const copy = document.createElement("canvas");
      copy.width = canvas.width; copy.height = canvas.height;
      const ctx = copy.getContext("2d", {willReadFrequently:true});
      ctx.drawImage(canvas,0,0);
      return { cells: cells.map(c=>[...c]), width: canvas.width, height: canvas.height,
        pixels: ctx.getImageData(0,0,copy.width,copy.height).data,
        projectionInverse: camera.projectionMatrixInverse.toArray(), projection: camera.projectionMatrix.toArray(),
        world: camera.matrixWorld.toArray(), view: camera.matrixWorldInverse.toArray(),
        cubeCount: cells.length, meshCount: group.children.filter(c=>c.isMesh).length, revision: THREE.REVISION,
        directions: labels.map(({el})=>({name:el.textContent,left:parseFloat(el.style.left),top:parseFloat(el.style.top)})),
        markedCells:markedCells.map(cell=>[...cell]), annotations:marks.map(({el,cell,point})=>({text:el.textContent,cell:[...cell],point:point.toArray(),left:parseFloat(el.style.left),top:parseFloat(el.style.top)})) };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect(); controls.removeEventListener("change", draw); controls.dispose();
      canvas.removeEventListener("keydown",keyboard);
      geometry.dispose();exteriorGeometries.forEach(g=>g.dispose()); edges.dispose(); [...materials,...markedMaterials].forEach(m=>m.dispose()); edgeMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss();
      canvas.remove(); [...labels,...marks].forEach(({el})=>el.remove());
    }
  };
}
