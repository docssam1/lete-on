// A reusable film pouch. The owning scene supplies its clock and disposal registry.
export function createKitPouch(THREE, {registerGeometry, materials, textures}) {
  const clamp = v => Math.max(0, Math.min(1, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const width = 6.1, depth = 3.9, centerX = .12, duration = 1.45;
  const half = width / 2, rearZ = -depth / 2, frontZ = depth / 2;
  const group = new THREE.Group(); group.name = 'kit-film-pouch';
  group.position.x = centerX;
  const body = new THREE.Group(); body.name = 'pouch-film-body'; group.add(body);
  const stripGroup = new THREE.Group(); stripGroup.name = 'pouch-tear-strip'; group.add(stripGroup);
  const meshes = [], creases = [];
  function material(options) {
    const m = new THREE.MeshPhysicalMaterial({color:0xf0f3f2, roughness:.29,clearcoat:.85,clearcoatRoughness:.10,
      metalness:0, transparent:true, opacity:.22, depthWrite:false,
      side:THREE.DoubleSide, ...options});
    materials.add(m); return m;
  }
  const film = material({color:0xffffff,opacity:.72,roughness:.2});
  const rearFilm = material({opacity:.13, roughness:.37});
  const edgeFilm = material({opacity:.29, roughness:.43});
  const sealFilm = material({opacity:.57, roughness:.49, color:0xcbd4d2});
  const stripFilm = material({opacity:.42, roughness:.24});
  function grid(columns, rows, positionAt, mat, parent, name) {
    const vertices = new Float32Array((columns + 1) * (rows + 1) * 3);
    const uv = new Float32Array((columns + 1) * (rows + 1) * 2);
    const indices = [];
    for(let j=0;j<=rows;j++) for(let i=0;i<=columns;i++) {
      const index=j*(columns+1)+i, p=positionAt(i/columns,j/rows);
      vertices.set(p,index*3); uv.set([i/columns,j/rows],index*2);
      if(i<columns&&j<rows) {const a=index,b=a+1,c=a+columns+1,d=c+1;indices.push(a,c,b,b,c,d);}
    }
    const geometry=registerGeometry(new THREE.BufferGeometry());
    geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    geometry.setIndex(indices);geometry.computeVertexNormals();
    const mesh=new THREE.Mesh(geometry,mat);mesh.name=name;
    mesh.castShadow=false;mesh.receiveShadow=false;mesh.renderOrder=2;
    parent.add(mesh);meshes.push(mesh);return mesh;
  }
  // Both pieces use precisely the same cut edge; no independent random teeth.
  function tearEdge(x) {
    const n=(x+half)/width*37, f=n-Math.floor(n);
    return -1.64 + (1-Math.abs(f*2-1))*.047 + Math.sin(x*11.7)*.012;
  }
  const wrinklePaths = [
    [-2.66,-1.43,-1.61,-.78],[-2.72,1.62,-1.72,.71],
    [2.68,-1.39,1.75,-.69],[2.72,1.65,1.68,.74],
    [-.98,-1.46,-.35,-.91],[.69,1.68,.22,.91],[-2.81,.22,-2.22,.12],
    [-2.64,1.54,-.62,.16],[2.62,-1.28,.58,-.17],[-1.91,-1.42,.18,.58],
    [2.63,1.62,1.11,.08],[-.72,1.71,.16,.49]
  ];
  // These small procedural maps describe clear crumpled film, not a photograph.
  // Strong local highlights coexist with a nearly clear central sheet.
  function filmMaps(){
    if(typeof document==='undefined')return null;
    const make=()=>{const c=document.createElement('canvas');c.width=c.height=512;return c;};
    const color=make(),bump=make(),roughness=make();
    const c=color.getContext('2d'),b=bump.getContext('2d'),r=roughness.getContext('2d');
    if(!c||!b||!r)return null;
    c.fillStyle='rgba(224,230,229,.14)';c.fillRect(0,0,512,512);
    b.fillStyle='#808080';b.fillRect(0,0,512,512);
    r.fillStyle='#777777';r.fillRect(0,0,512,512);
    const p=(x,z)=>[(x+half)/width*512,(z-rearZ)/depth*512];
    for(const [i,path] of wrinklePaths.entries()){
      const a=p(path[0],path[1]),d=p(path[2],path[3]);
      const dx=d[0]-a[0],dy=d[1]-a[1],length=Math.hypot(dx,dy),nx=-dy/length,ny=dx/length;
      const band=i<7?13:22,mx=(a[0]+d[0])/2,my=(a[1]+d[1])/2;
      const grad=c.createLinearGradient(mx-nx*band,my-ny*band,mx+nx*band,my+ny*band);
      grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.27,'rgba(105,119,116,.12)');
      grad.addColorStop(.43,'rgba(109,121,118,.40)');grad.addColorStop(.52,'rgba(250,253,252,.74)');
      grad.addColorStop(.66,'rgba(255,255,255,.40)');grad.addColorStop(1,'rgba(255,255,255,0)');
      const ridge=b.createLinearGradient(mx-nx*band,my-ny*band,mx+nx*band,my+ny*band);
      ridge.addColorStop(0,'#808080');ridge.addColorStop(.36,'#676767');ridge.addColorStop(.52,'#bebebe');ridge.addColorStop(1,'#808080');
      for(const [ctx,paint,lineWidth] of [[c,grad,band*2],[b,ridge,band*2],[r,'#b9b9b9',band*.7]]){
        ctx.beginPath();ctx.moveTo(...a);ctx.quadraticCurveTo(mx+nx*band*.36,my+ny*band*.36,...d);
        ctx.strokeStyle=paint;ctx.lineWidth=lineWidth;ctx.lineCap='round';ctx.stroke();
      }
    }
    // Fine, fixed wrinkles remain subordinate to the broad reflected folds.
    for(let i=0;i<34;i++){
      const x=13+(i*137%487),y=9+(i*79%491);
      b.beginPath();b.moveTo(x,y);b.lineTo(x+7+Math.sin(i)*11,y+12);b.strokeStyle=i%2?'#898989':'#777777';b.lineWidth=.8;b.stroke();
    }
    const texture=canvas=>{const t=new THREE.CanvasTexture(canvas);t.flipY=false;textures.add(t);return t;};
    const map=texture(color);map.colorSpace=THREE.SRGBColorSpace;
    return {map,bumpMap:texture(bump),roughnessMap:texture(roughness)};
  }
  const maps=filmMaps();
  if(maps){Object.assign(film,maps,{bumpScale:.052});film.needsUpdate=true;}
  else film.opacity=.24;
  function heightAt(x,z) {
    const u=clamp((x+half)/width),v=clamp((z-rearZ)/depth);
    const swell=Math.pow(Math.max(0,Math.sin(Math.PI*u)*Math.sin(Math.PI*v)),.22);
    let wrinkle=0;
    for(const [ax,az,bx,bz] of wrinklePaths) {
      const dx=bx-ax,dz=bz-az,t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz));
      const distance=Math.hypot(x-ax-dx*t,z-az-dz*t);
      wrinkle+=.043*Math.exp(-distance*distance/.006)*Math.sin(Math.PI*t);
    }
    const corner=.025*Math.sin(x*5.6+z*3.8)*(1-swell);
    return .065 + .54*swell + wrinkle + corner + .012*Math.sin(x*5+z*3)*swell;
  }
  const front = grid(56,30,(u,v)=>{
    const x=-half+u*width,z=tearEdge(x)+(frontZ-tearEdge(x))*v;
    return [x,heightAt(x,z),z];
  },film,body,'pouch-front-film');
  front.renderOrder=4;
  const frontBase=front.geometry.attributes.position.array.slice();
  // A small printed kit sticker makes the clear film legible as a pouch.
  if(typeof document!=='undefined'){
    const c=document.createElement('canvas');c.width=512;c.height=192;const ctx=c.getContext('2d');
    if(ctx){
      ctx.fillStyle='#fafcfc';ctx.fillRect(0,0,512,192);ctx.fillStyle='#e56d59';ctx.fillRect(0,0,14,192);
      ctx.fillStyle='#22333d';ctx.font='700 46px Arial, sans-serif';ctx.fillText('팝콘실험실',38,76);
      ctx.fillStyle='#556a72';ctx.font='600 32px Arial, sans-serif';ctx.fillText('샤를 1호 · 준비물',38,132);
      const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.flipY=false;textures.add(t);
      const labelMaterial=new THREE.MeshStandardMaterial({map:t,roughness:.82,side:THREE.DoubleSide});materials.add(labelMaterial);
      const sticker=grid(18,8,(u,v)=>{const x=-.35+(u-.5)*1.72,z=.88+(v-.5)*.65;return [x,heightAt(x,z)+.016,z];},labelMaterial,body,'pouch-kit-sticker');
      sticker.renderOrder=7;
    }
  }

  const back = grid(36,22,(u,v)=>{
    const x=-half+u*width,z=rearZ+v*depth;
    return [x,.055+.004*Math.sin(x*7+z*6),z];
  },rearFilm,body,'pouch-back-film'); back.renderOrder=1;
  for(const sign of [-1,1]) grid(32,2,(u,v)=>{
    const x=sign*half,z=rearZ+u*depth;
    return [x,.055+(heightAt(x,z)-.055)*v,z];
  },edgeFilm,body,`pouch-side-${sign}`);
  // Heat seals are thin translucent ribbons with two inset pressed ridges.
  for(const sign of [-1,1]) for(const inset of [.025,.075]) grid(1,30,(u,v)=>{
    const x=sign*(half-inset-u*.018),z=rearZ+v*depth;
    return [x,heightAt(x,z)+.004,z];
  },sealFilm,body,`pouch-side-seal-${sign}-${inset}`);
  for(const inset of [.03,.085]) grid(48,1,(u,v)=>{
    const x=-half+u*width,z=frontZ-inset-v*.022;
    return [x,heightAt(x,z)+.005,z];
  },sealFilm,body,`pouch-bottom-seal-${inset}`);
  const strip = grid(74,5,(u,v)=>{
    const x=-half+u*width,z=rearZ+(tearEdge(x)-rearZ)*v;
    return [x,heightAt(x,z)+.006,z];
  },stripFilm,stripGroup,'pouch-detachable-strip');strip.renderOrder=5;
  const stripBase=strip.geometry.attributes.position.array.slice();
  const topSeal=grid(74,1,(u,v)=>{
    const x=-half+u*width,z=rearZ+.025+v*.028;
    return [x,heightAt(x,z)+.012,z];
  },sealFilm,stripGroup,'pouch-top-seal');topSeal.renderOrder=6;
  const topSealBase=topSeal.geometry.attributes.position.array.slice();
  const pressedMaterial=material({color:0xfdfefd,opacity:.72,roughness:.56});
  function pressedRidges(parent,segments,name){
    const vertices=[];
    for(const [x1,z1,x2,z2] of segments){
      const y1=heightAt(x1,z1)+.009,y2=heightAt(x2,z2)+.009;
      const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),nx=-dz/len*.004, nz=dx/len*.004;
      vertices.push(x1-nx,y1,z1-nz,x2-nx,y2,z2-nz,x1+nx,y1,z1+nz,
        x2-nx,y2,z2-nz,x2+nx,y2,z2+nz,x1+nx,y1,z1+nz);
    }
    const g=registerGeometry(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();
    const m=new THREE.Mesh(g,pressedMaterial);m.name=name;m.renderOrder=6;
    parent.add(m);meshes.push(m);return m;
  }
  const bodyPress=[];
  for(let z=rearZ+.11;z<frontZ-.08;z+=.065)for(const sign of [-1,1])bodyPress.push([sign*(half-.02),z,sign*(half-.12),z+.016]);
  for(let x=-half+.11;x<half-.08;x+=.07)bodyPress.push([x,frontZ-.022,x+.015,frontZ-.13]);
  pressedRidges(body,bodyPress,'pouch-pressed-edge-ridges');
  const topPress=[];for(let x=-half+.08;x<half-.08;x+=.065)topPress.push([x,rearZ+.015,x+.012,rearZ+.09]);
  const stripPress=pressedRidges(stripGroup,topPress,'pouch-pressed-top-ridges');
  const stripPressBase=stripPress.geometry.attributes.position.array.slice();
  // Fine physical ridge edges complement the broad reflected folds in the map.
  const creaseMaterial=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,
    opacity:.23,depthWrite:false});materials.add(creaseMaterial);
  for(const [index,path] of wrinklePaths.entries()) {
    const [ax,az,bx,bz]=path,points=[];
    for(let i=0;i<=18;i++) {const t=i/18,x=ax+(bx-ax)*t,z=az+(bz-az)*t;
      points.push(new THREE.Vector3(x,heightAt(x,z)+.007,z));}
    const geometry=registerGeometry(new THREE.BufferGeometry().setFromPoints(points));
    const line=new THREE.Line(geometry,creaseMaterial);line.name=`pouch-crease-${index}`;
    line.renderOrder=5;body.add(line);creases.push(line);
  }
  let targetOpen=false,progress=0,shakeTime=Infinity,lastVisual=-1,lastFlutter=0,flutter=0;
  let offset=[0,0,0],rotation=[0,0,0];
  function bendStrip(mesh,base,tear,detach) {
    const a=mesh.geometry.attributes.position.array;
    for(let i=0;i<a.length;i+=3) {
      const x=base[i],z=base[i+2],u=(x+half)/width;
      const lifted=smooth((tear*1.16-u)*7);
      const edge=tearEdge(x),distance=edge-z;
      const curl=lifted*(.9+detach*.75);
      a[i]=x;
      a[i+1]=base[i+1]+lifted*.075+Math.sin(curl)*distance+flutter*.038*Math.sin(x*3.6+distance*8);
      a[i+2]=edge-Math.cos(curl)*distance-lifted*.045;
    }
    mesh.geometry.attributes.position.needsUpdate=true;mesh.geometry.computeVertexNormals();
    mesh.geometry.computeBoundingSphere();
  }
  function draw() {
    group.position.set(centerX+offset[0],offset[1],offset[2]);
    group.rotation.set(...rotation);
    if(progress===lastVisual&&flutter===lastFlutter)return;lastVisual=progress;lastFlutter=flutter;
    const tear=smooth(progress/.38),detach=smooth((progress-.32)/.38);
    const fold=smooth((progress-.43)/.53);
    body.position.set(0,.01*fold,-2.15*fold);
    body.scale.set(1-.045*fold,1-.7*fold,1-.81*fold);
    body.rotation.x=.04*fold;
    stripGroup.position.set(.32*detach,.16*Math.sin(detach*Math.PI),-.95*detach);
    stripGroup.rotation.set(-.21*detach,.08*detach,-.055*detach);
    stripFilm.opacity=.42-.14*detach;
    const a=front.geometry.attributes.position.array;
    for(let i=0;i<a.length;i+=3) {
      const x=frontBase[i],z=frontBase[i+2],u=(x+half)/width;
      const mouth=Math.exp(-Math.max(0,z-tearEdge(x))*7);
      const released=smooth((tear*1.16-u)*7);
      a[i]=x;a[i+1]=frontBase[i+1]+mouth*released*.14*(1-fold)+flutter*.022*Math.sin(x*4.2+z*5.8)*(1-fold);
      a[i+2]=z+mouth*released*.045*(1-fold);
    }
    front.geometry.attributes.position.needsUpdate=true;front.geometry.computeVertexNormals();
    front.geometry.computeBoundingSphere();
    bendStrip(strip,stripBase,tear,detach);bendStrip(topSeal,topSealBase,tear,detach);bendStrip(stripPress,stripPressBase,tear,detach);
  }
  function setOpen(open,{immediate=false}={}) {
    const next=Boolean(open);
    if(next!==targetOpen) {targetOpen=next;if(!next)progress=0;}
    if(immediate){progress=next?1:0;shakeTime=Infinity;flutter=0;offset=[0,0,0];rotation=[0,0,0];}
    draw();
  }
  function shake(){shakeTime=0;}
  function replay(){targetOpen=true;progress=0;shakeTime=Infinity;flutter=0;offset=[0,0,0];rotation=[0,0,0];draw();}
  function update(seconds,{active=true,reducedMotion=false}={}) {
    if(!active)return;
    const dt=Number.isFinite(seconds)?Math.max(0,seconds):0;
    if(reducedMotion){progress=targetOpen?1:0;shakeTime=Infinity;}
    else {if(targetOpen)progress=clamp(progress+dt/duration);if(Number.isFinite(shakeTime))shakeTime+=dt;}
    const t=shakeTime/.62,envelope=t<1?Math.pow(1-t,2):0;
    const wave=t<1?envelope*Math.sin(t*Math.PI*6):0;
    flutter=t<1?envelope*Math.sin(t*Math.PI*8):0;
    offset=[wave*.065,Math.abs(wave)*.018,wave*.018];
    rotation=[wave*.012,wave*.018,wave*.05];
    draw();
  }
  function getSnapshot(){
    const tearProgress=smooth(progress/.38),contentProgress=smooth((progress-.40)/.60);
    return {progress,tearProgress,contentProgress,phase:progress===0?'sealed':progress<.38?'tearing':progress<1?'unpacking':'open',
      targetOpen,opened:targetOpen&&progress===1,ready:targetOpen&&progress===1,
      sealedBounds:{min:[centerX-half,.05,rearZ],max:[centerX+half,.68,frontZ]},
      rotation:[...rotation],offset:[...offset],flutter,meshCount:meshes.length,creaseCount:creases.length,
      center:[centerX,0,0],duration};
  }
  draw();
  return {group,setOpen,shake,replay,update,getSnapshot};
}
