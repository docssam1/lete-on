import { DEFAULT_LAB_STATE, deriveOutcome, normalizeLabState } from './lab-model.js';
import { loadPaperTextures, foodCardOutline } from './lab-paper-assets.js';
import { createKitPouch } from './lab-pouch.js?v=20261015-pouch-1';

// Match the existing 9% step at 60Hz while preserving speed on slower devices.
const MOTION_EASING_RATE=-Math.log(.91)*60;
const MAX_MOTION_SECONDS=.25;
function motionAlpha(seconds,reducedMotion=false){
  return reducedMotion?1:1-Math.exp(-MOTION_EASING_RATE*Math.max(0,Math.min(MAX_MOTION_SECONDS,seconds)));
}

/** An actual mesh scene; photographs are shown only when WebGL is unavailable. */
export async function mountLabScene(host, { onAction = () => {} } = {}) {
  if (!host) throw new Error('3D 실험을 표시할 영역이 없어요.');
  let state = { ...DEFAULT_LAB_STATE };
  let exploded = false;
  let paused = false;
  let disposed = false;
  let THREE, OrbitControls, renderer;
  const canvas = document.createElement('canvas');
  canvas.className = 'lab-webgl-canvas';
  canvas.setAttribute('aria-label', '3D 자석 실험. 빈 곳을 끌어 회전, 두 손가락으로 확대, 먹이를 끌어 거리 변경.');
  canvas.style.cssText = 'display:block;width:100%;height:100%;min-height:1px;touch-action:none;outline:none;';
  canvas.tabIndex = 0;
  host.append(canvas);
  try {
    [THREE, { OrbitControls }] = await Promise.all([
      import('./vendor/three.module.js'), import('./vendor/OrbitControls.js'),
    ]);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (error) {
    canvas.remove();
    const fallback = document.createElement('figure');
    fallback.className = 'lab-webgl-fallback';
    fallback.style.cssText = 'margin:0;padding:24px;background:#f5f7eb;color:#314436;';
    const photo = document.createElement('img');
    photo.src = new URL('../assets/assembly-10-branded.svg', import.meta.url).href;
    photo.alt = '실물 종이 악어와 먹이 손잡이. 이 기기에서는 3D 화면을 열 수 없어요.';
    photo.style.cssText = 'display:block;width:100%;max-height:420px;object-fit:contain;';
    const message = document.createElement('figcaption');
    message.textContent = '이 기기에서 3D 화면을 열 수 없어요. 아래 거리·극 조작으로 가상 결과를 살피거나 실물 사진을 비교해요.';
    fallback.append(photo, message);
    host.append(fallback);
    return {
      setState(value) { state = normalizeLabState({ ...state, ...value }); },
      getSnapshot() { return { webgl: false, fallback: true, reason: String(error.message), state, outcome: deriveOutcome(state) }; },
      resetView() {}, setExploded(value) { exploded = Boolean(value); },
      setPaused(value) { paused = Boolean(value); }, dispose() { fallback.remove(); disposed = true; },
    };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0xe5ebe7, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe5ebe7, 30, 65);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minDistance = 5;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.minPolarAngle = 0.16;
  controls.enablePan = false;
  controls.target.set(0.25, 0.72, 0);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const materials = new Set();
  const geometries = new Set();
  const textures = new Set();
  const registerGeometry = geometry => { geometries.add(geometry); return geometry; };
  const material = options => {
    const item = new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0, ...options });
    materials.add(item); return item;
  };
  const paperEdge = material({ color: 0xe5e2d8, roughness:.95 });
  const whitePaper = material({ color: 0xfaf8f0, roughness:.94, side: THREE.DoubleSide });
  const ivory = material({ color: 0xe5dfba, roughness:.96 });
  const greenSide = material({ color: 0x589546 });
  const greenDark = material({ color: 0x266a42 });
  const steel = material({ color: 0x7e8586, metalness: 0.45, roughness: 0.45 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x466b44, transparent: true, opacity: 0.35 });
  materials.add(lineMat);
  const paperAssets=await loadPaperTextures(THREE,texture=>textures.add(texture));
  const photoMaterial=name=>material({map:paperAssets.textures[name],roughness:.92,side:THREE.DoubleSide,alphaTest:.35});
  const printedGreen=photoMaterial('bodyTop'),printedSide=photoMaterial('side');
  const headPrint=photoMaterial('headTop'),tailPrint=photoMaterial('tail');
  const bodySidePrint=photoMaterial('bodySide'),namePrint=photoMaterial('nameCard'),eyePrint=photoMaterial('eye'),headTeethPrint=photoMaterial('headTeeth');
  const lowerPrint=photoMaterial('lower'),toothPrint=photoMaterial('teeth');
  const frontFootPrint=photoMaterial('frontFoot'),backFootPrint=photoMaterial('backFoot');
  const boxMat=photoMaterial('box'),fishMat=photoMaterial('fish'),carrotMat=photoMaterial('carrot');
  const hemisphere = new THREE.HemisphereLight(0xf4f7f3, 0xc1bcb0, 1.10);
  scene.add(hemisphere);
  const sunlight = new THREE.DirectionalLight(0xfff5e6, 2.8);
  sunlight.position.set(-5, 9, 6); sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunlight.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: .1, far: 28 });
  sunlight.shadow.normalBias = .012;sunlight.shadow.bias=-.00012;sunlight.shadow.radius=4.2;
  scene.add(sunlight);
  const fill = new THREE.DirectionalLight(0xf0f5f8,.80);fill.position.set(5,4,-3);scene.add(fill);

  function mesh(geometry, mat, parent, position = [0, 0, 0]) {
    const item = new THREE.Mesh(registerGeometry(geometry), mat);
    item.position.set(...position); item.castShadow = true; item.receiveShadow = true;
    parent.add(item); return item;
  }
  function card(width, height, depth, mat, parent, position) {
    return mesh(new THREE.BoxGeometry(width, height, depth), mat, parent, position);
  }
  function shapeCard(points, mat, parent, thickness = .014) {
    const shape = new THREE.Shape(); points.forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y)); shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 6 });
    // Printed template graphics cover each card face once, independent of model units.
    geometry.computeBoundingBox();const bounds=geometry.boundingBox;const position=geometry.attributes.position;const uv=geometry.attributes.uv;
    for(let i=0;i<position.count;i++)uv.setXY(i,(position.getX(i)-bounds.min.x)/Math.max(.001,bounds.max.x-bounds.min.x),(position.getY(i)-bounds.min.y)/Math.max(.001,bounds.max.y-bounds.min.y));
    return mesh(geometry,[mat,paperEdge],parent);
  }
  const labelCache = new Map();
  function labelTexture(text, ink = '#314832', background = '#ffffef', width = 512) {
    const key = `${text}/${ink}/${background}`;
    if (labelCache.has(key)) return labelCache.get(key);
    const c = document.createElement('canvas'); c.width = width; c.height = 128;
    const cctx = c.getContext('2d');
    cctx.fillStyle = background; cctx.fillRect(0, 0, width, 128);
    cctx.fillStyle = ink; cctx.font = `700 ${text.length > 13 ? 30 : text.length > 7 ? 39 : 54}px Arial, sans-serif`;
    cctx.textAlign = 'center'; cctx.textBaseline = 'middle'; cctx.fillText(text, width / 2, 66, width - 22);
    const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture); labelCache.set(key, texture); return texture;
  }
  function label(text, parent, position, size = 1.45, options = {}) {
    const mat = new THREE.SpriteMaterial({ map: labelTexture(text, options.ink, options.background), transparent: false, depthTest: false });
    materials.add(mat);
    const sprite = new THREE.Sprite(mat); sprite.scale.set(size, size / 4, 1); sprite.position.set(...position); parent.add(sprite); return sprite;
  }
  function surfaceLabel(text,parent,position,width=.45,height=.16,rotation=[-Math.PI/2,0,0],options={}){
    const item=mesh(new THREE.PlaneGeometry(width,height),material({map:labelTexture(text,options.ink,options.background),roughness:.96,side:THREE.DoubleSide}),parent,position);
    item.rotation.set(...rotation);item.castShadow=false;return item;
  }
  function setLabel(item, text, ink, background) { item.material.map = labelTexture(text, ink, background); item.material.needsUpdate = true; }
  const table = new THREE.Group(); scene.add(table);
  const deskMaterial=material({color:0xf7f5ee,roughness:.88});
  mesh(new THREE.BoxGeometry(40,.28,22),deskMaterial,table,[1,-.14,0]);
  const wall=mesh(new THREE.PlaneGeometry(60,24),material({color:0xeef3ef,roughness:1}),table,[0,11.9,-11]);wall.castShadow=false;
  const skirting=card(60,.045,.04,material({color:0xcbd3ce,roughness:1}),table,[0,.025,-10.96]);skirting.castShadow=false;
  // A quiet empty preparation tray gives the desk scale without covering the kit.
  const tray=new THREE.Group();tray.position.set(-6.6,.035,-3.5);table.add(tray);
  card(1.75,.055,1.15,whitePaper,tray);
  for(const side of[-1,1]){card(1.75,.14,.035,whitePaper,tray,[0,.075,side*.56]);card(.035,.14,1.12,whitePaper,tray,[side*.86,.075,0]);}
  const title = label('가상 실험 · 움직임을 비교해요', scene, [0, 2.65, -1.9], 3.7);
  const status = label('먹이를 가까이 가져와요', scene, [.6, .35, 2.4], 3.4);
  // The host UI supplies titles and observation text; keep the object unobstructed.
  title.visible=false;status.visible=false;

  function createDisc(parent, position, target, name) {
    const group = new THREE.Group(); group.name = name; group.position.set(...position); parent.add(group);
    const disc = mesh(new THREE.CylinderGeometry(.27, .27, .10, 40), steel, group);
    disc.userData.flipTarget = target;
    const top = mesh(new THREE.CircleGeometry(.245, 40), material({ color: 0xb64336,roughness:.78 }), group, [0, .052, 0]); top.rotation.x = -Math.PI / 2; top.userData.flipTarget = target;
    const bottom = mesh(new THREE.CircleGeometry(.245, 40), material({ color: 0x29282b,roughness:.78 }), group, [0, -.052, 0]); bottom.rotation.x = Math.PI / 2; bottom.userData.flipTarget = target;
    const poleLabel=surfaceLabel('N',group,[0,.057,0],.26,.12,[-Math.PI/2,0,0],{ink:'#ffffff',background:'#b64336'});poleLabel.userData.flipTarget=target;
    group.userData.top = top; group.userData.bottom = bottom; group.userData.poleLabel = poleLabel;
    group.userData.setPole = value => {
      top.material.color.set(value === 'N' ? 0xb64336 : 0x29282b);
      bottom.material.color.set(value === 'N' ? 0x29282b : 0xb64336);
      setLabel(poleLabel,value,'#fff',value==='N'?'#b64336':'#29282b');
    };
    return group;
  }
  function createBar(parent, position, target = 'pole1') {
    const group = new THREE.Group(); group.position.set(...position); parent.add(group);
    const firstMat = material({ color: 0xc95854 }); const lastMat = material({ color: 0x428eae });
    const first = card(.9, .32, .42, firstMat, group, [.45, 0, 0]);
    const last = card(.9, .32, .42, lastMat, group, [-.45, 0, 0]);
    first.userData.flipTarget = last.userData.flipTarget = target;
    const nearLabel=surfaceLabel('N',group,[.62,.164,0],.42,.16,[-Math.PI/2,0,0],{ink:'#fff',background:'#a84640'});
    const farLabel=surfaceLabel('S',group,[-.62,.164,0],.42,.16,[-Math.PI/2,0,0],{ink:'#fff',background:'#2b759d'});
    nearLabel.userData.flipTarget = farLabel.userData.flipTarget = target;
    group.userData.setPole = value => {
      firstMat.color.set(value === 'N' ? 0xc95854 : 0x428eae); lastMat.color.set(value === 'N' ? 0x428eae : 0xc95854);
      setLabel(nearLabel, value, '#fff', value === 'N' ? '#a84640' : '#2b759d');
      setLabel(farLabel, value === 'N' ? 'S' : 'N', '#fff', value === 'N' ? '#2b759d' : '#a84640');
    };
    group.userData.labels = [nearLabel, farLabel];
    return group;
  }
  function paperClip(parent, position, clipMaterial = steel) {
    const points = [];
    // Bent wire in a paperclip shape, with real tube depth instead of an icon.
    for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; points.push(new THREE.Vector3(Math.cos(a) * .105, 0, .18 + Math.sin(a) * .105)); }
    points.push(new THREE.Vector3(-.105, 0, -.18));
    for (let i = 0; i <= 16; i++) { const a = Math.PI + Math.PI * i / 16; points.push(new THREE.Vector3(Math.cos(a) * .105, 0, -.18 + Math.sin(a) * .105)); }
    points.push(new THREE.Vector3(.105, 0, .13), new THREE.Vector3(.045, 0, .2), new THREE.Vector3(-.035, 0, .14), new THREE.Vector3(-.035, 0, -.13));
    const clip = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 42, .016, 6, false), clipMaterial, parent, position);
    return clip;
  }

  // The croc is folded cardboard: printed faces, white backing and paper thickness.
  const croc = new THREE.Group(); croc.name = 'paper-crocodile'; scene.add(croc);
  const parts = {};
  function part(name, parent = croc, position = [0, 0, 0]) { const group = new THREE.Group(); group.name = name; group.position.set(...position); parent.add(group); parts[name] = group; return group; }
  const lower=part('lowerJaw',croc,[-.34,1.12,0]);
  const snoutShape=[[0,-.52],[1.31,-.47],[1.44,-.33],[1.51,-.13],[1.51,.13],[1.44,.33],[1.31,.47],[0,.52]];
  const lowerBase=shapeCard(snoutShape,whitePaper,lower);lowerBase.rotation.x=-Math.PI/2;
  const lowerOutside=shapeCard(snoutShape,lowerPrint,lower,.006);lowerOutside.rotation.x=-Math.PI/2;lowerOutside.position.y=-.009;
  for(const side of[-1,1]){const wall=shapeCard([[0,0],[1.30,0],[1.45,.05],[1.51,.12],[.08,.16]],whitePaper,lower);wall.position.set(0,0,side*.49);}
  const upper=part('upperBody',croc,[-.34,1.55,0]);
  const upperSnout=shapeCard(snoutShape,headPrint,upper);upperSnout.rotation.x=-Math.PI/2;
  const innerRoof=shapeCard(snoutShape,whitePaper,upper);innerRoof.rotation.x=-Math.PI/2;innerRoof.position.y=-.20;
  card(3.00,.014,1.16,[paperEdge,paperEdge,printedGreen,whitePaper,paperEdge,paperEdge],upper,[-1.50,0,0]);
  // The side face uses only the actual side print, never the photographed top face.
  const photoScale=3/322;
  for(const side of[-1,1]){
    const sidewall=shapeCard([[-3,0],[0,0],[.08,-.13],[-.10,-.515],[-3,-.515]],bodySidePrint,upper);sidewall.position.z=side*.59;
    // The native name field is projected separately so its lettering is never mirrored.
    const nameField=mesh(new THREE.PlaneGeometry(1.66,.32),namePrint,upper,[-1.43,-.17,side>0?.608:-.594]);if(side<0)nameField.rotation.y=Math.PI;nameField.castShadow=false;
    const lip=shapeCard([[0,-.10],[1.31,-.07],[1.49,-.04],[1.51,-.14],[1.37,-.29],[0,-.30]],headTeethPrint,upper);lip.position.z=side*.53;
    const eyeOutline=[[89,67],[102,43],[127,26],[153,17],[175,17],[192,31],[199,51],[190,78],[172,102],[148,115],[125,113],[104,93]].map(([x,y])=>[(x-145)*.0044,(90-y)*.0044]);
    const tab=shapeCard(eyeOutline,eyePrint,upper,.012);tab.position.set(.03,-.05,side*.608);
  }
  card(.014,.515,1.16,greenSide,upper,[-3.00,-.2575,0]);
  const bodyBase=part('bodyBase',croc,[-1.84,1.035,0]);card(3.00,.014,1.16,greenSide,bodyBase);
  const tail=part('tail',croc,[-3.34,1.55,0]);
  const tailTop=shapeCard([[0,-.58],[-2.00,0],[0,.58]],tailPrint,tail);tailTop.rotation.x=-Math.PI/2;
  const tailVertices=tailTop.geometry.attributes.position,tailTopUV=tailTop.geometry.attributes.uv;
  const topOutline=[[0,-.58],[-2,0],[0,.58]],topPixels=[[491,78],[699,82],[491,31]];
  for(let i=0;i<tailVertices.count;i++){let closest=0,best=Infinity;topOutline.forEach(([x,y],index)=>{const delta=(x-tailVertices.getX(i))**2+(y-tailVertices.getY(i))**2;if(delta<best){closest=index;best=delta;}});const[px,py]=topPixels[closest];tailTopUV.setXY(i,1-(px-491)/209,1-(py-29)/108);tailVertices.setZ(i,tailVertices.getZ(i)+tailVertices.getX(i)*.165);}tailTop.geometry.computeVertexNormals();
  const tailOutline=[[0,0],[-2,-.33],[-1.46,-.50],[0,-.515]],tailPixels=[[491,78],[699,82],[649,116],[491,133]];
  for(const side of[-1,1]){
    const flap=shapeCard(tailOutline,tailPrint,tail);flap.position.z=side*.58;flap.rotation.y=-side*.282;
    const positions=flap.geometry.attributes.position,uv=flap.geometry.attributes.uv;
    for(let i=0;i<positions.count;i++){let closest=0,best=Infinity;tailOutline.forEach(([x,y],index)=>{const delta=(x-positions.getX(i))**2+(y-positions.getY(i))**2;if(delta<best){closest=index;best=delta;}});const[px,py]=tailPixels[closest];uv.setXY(i,1-(px-491)/209,1-(py-29)/108);}
  }
  const hinge=part('hinge',croc,[-.34,1.105,0]);card(.10,.018,1.03,whitePaper,hinge);
  const legs=part('legs');
  const footPhotos=[
    {center:208,bottom:225,material:frontFootPrint,outline:[[208,121],[242,135],[229,174],[256,184],[251,196],[225,191],[212,224],[199,219],[195,198],[171,218],[160,211],[176,189],[149,199],[145,189],[174,172],[191,169]]},
    {center:450,bottom:241,material:backFootPrint,outline:[[432,130],[484,133],[480,180],[504,193],[498,205],[480,201],[477,241],[463,239],[456,212],[440,231],[426,230],[429,207],[404,215],[398,207],[428,183]]},
  ];
  for(const definition of footPhotos)for(const side of[-1,1]){
    const outline=definition.outline.map(([x,y])=>[(definition.center-x)*photoScale,(definition.bottom-y)*photoScale]);
    const foot=shapeCard(outline,definition.material,legs,.014);
    const sourceHeight=(definition.bottom-Math.min(...definition.outline.map(point=>point[1])))*photoScale;
    foot.scale.y=1.032/sourceHeight;foot.position.set(-.34+(175-definition.center)*photoScale,.008,side*.59);
  }
  const teeth=part('teeth',lower);
  for(const side of[-1,1]){const band=shapeCard([[.02,0],[1.38,0],[1.46,.10],[.08,.17]],toothPrint,teeth,.012);band.position.set(0,.045,side*.50);}
  const upperTeeth=new THREE.Group();upper.add(upperTeeth);
  // Upper teeth, eye and nostrils are print on the original card, not extra objects.
  const upperMagnet=createDisc(upper,[1.20,-.26,0],'upperPole','upperMagnet');parts.upperMagnet=upperMagnet;
  const lowerMagnet=createDisc(lower,[1.20,.085,0],'lowerPole','lowerMagnet');parts.lowerMagnet=lowerMagnet;
  for(const group of[upperMagnet,lowerMagnet])mesh(new THREE.CylinderGeometry(.245,.245,.025,32),ivory,group,[0,-.06,0]);
  // Surface faces represent the same labelled faces as the kit instructions.
  upperMagnet.rotation.x = Math.PI;
  const crocLabel=label('종이 악어 · 샤를 1호',croc,[-1.30,1.76,-.65],2.35);
  const tape=part('tape',lower);
  for(const x of [.18,.67])card(.23,.027,.17,ivory,tape,[x,.020,0]);
  const lowerTemplate=part('lowerTemplate',scene,[-1.4,.06,0]);
  const flatLower=shapeCard(snoutShape,lowerPrint,lowerTemplate);flatLower.rotation.x=-Math.PI/2;
  for(const z of [-.64,.64]) {const flap=card(1.80,.02,.28,whitePaper,lowerTemplate,[.92,.02,z]);}
  label('E · 아래턱 도안',lowerTemplate,[.85,.24,.85],1.85);
  const contactCanvas=document.createElement('canvas');contactCanvas.width=512;contactCanvas.height=192;
  const contactContext=contactCanvas.getContext('2d');
  for(const x of[-.647,-2.902])for(const z of[-.62,.62]){
    const px=(x+6.1)/7.5*512,py=(z+1.4)/2.8*192;const gradient=contactContext.createRadialGradient(px,py,2,px,py,29);
    gradient.addColorStop(0,'rgba(61,58,48,.34)');gradient.addColorStop(1,'rgba(61,58,48,0)');contactContext.fillStyle=gradient;contactContext.fillRect(px-30,py-30,60,60);
  }
  const contactTexture=new THREE.CanvasTexture(contactCanvas);textures.add(contactTexture);
  const contactMaterial=new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false,opacity:.68});materials.add(contactMaterial);
  const contactShadow=mesh(new THREE.PlaneGeometry(7.5,2.8),contactMaterial,croc,[-2.35,.008,0]);contactShadow.rotation.x=-Math.PI/2;contactShadow.castShadow=false;

  const foodTool = new THREE.Group(); foodTool.name='food-tool';scene.add(foodTool);
  const foodBox=part('foodBox',foodTool);
  // Hollow D box: paper walls surround the bar; the end flap has a flush fold.
  card(1.86,.014,.54,boxMat,foodBox,[0,.21,0]);card(1.86,.014,.54,boxMat,foodBox,[0,-.21,0]);
  for(const side of[-1,1])card(1.86,.42,.014,boxMat,foodBox,[0,0,side*.27]);
  card(.014,.42,.54,boxMat,foodBox,[-.936,0,0]);
  const boxFlap=new THREE.Group();boxFlap.position.set(.936,0,-.27);foodBox.add(boxFlap);card(.014,.42,.54,boxMat,boxFlap,[0,0,.27]);
  const barInside=createBar(foodTool,[0,0,0],null);parts.barMagnet=barInside;
  const boxStrip=mesh(new THREE.PlaneGeometry(1.48,.24),material({map:labelTexture('팝콘실험실 · 먹이 손잡이','#435441','#ececc1'),roughness:.95}),foodBox,[0,.223,0]);boxStrip.rotation.x=-Math.PI/2;
  const fish=part('fish',foodTool,[-.72,0,0]),carrot=part('carrot',foodTool,[.72,0,0]);
  // Source step nine: separate printed cutouts on BOTH upper and lower box faces.
  for(const[kind,group,print]of[['fish',fish,fishMat],['carrot',carrot,carrotMat]]){
    const outline=foodCardOutline(kind,kind==='fish'?.97:.78);
    for(const side of[-1,1]){
      const picture=shapeCard(outline,print,group,.012);picture.rotation.x=-Math.PI/2;picture.position.y=side*.234;
      const attachment=card(.32,.012,.20,whitePaper,group,[kind==='fish'?.12:-.12,side*.224,0]);
    }
  }
  const foodLabel=surfaceLabel('물고기 쪽 S',foodTool,[0,.23,0],1.46,.24,[-Math.PI/2,0,0],{ink:'#2b759d'});
  const foodGrip=mesh(new THREE.BoxGeometry(2.65,.70,1.25),material({transparent:true,opacity:0,depthWrite:false}),foodTool,[0,.07,0]);foodGrip.userData.dragFood=true;
  foodTool.traverse(item=>{if(item.isMesh)item.userData.dragFood=true;});

  const kit=new THREE.Group();kit.name='kit-parts';scene.add(kit);
  const pouch=createKitPouch(THREE,{registerGeometry,materials,textures});kit.add(pouch.group);
  const kitContents=new THREE.Group();kitContents.name='kit-contents';kit.add(kitContents);
  // B, E and D template silhouettes show foldable tabs and source paper parts.
  const bodyNet=shapeCard([[-2.0,-.48],[.10,-.48],[.10,-.75],[.85,-.75],[.85,-.45],[2.0,-.38],[2.16,0],[2.0,.38],[.85,.45],[.85,.75],[.10,.75],[.10,.48],[-2.0,.48],[-3.18,0]],printedGreen,kitContents);
  bodyNet.rotation.x=-Math.PI/2;bodyNet.position.set(-.60,.04,-.62);
  label('B · 몸통·다리·꼬리',kitContents,[-1.1,.29,-1.25],2.1);
  const eNet=shapeCard(snoutShape,lowerPrint,kitContents);eNet.rotation.x=-Math.PI/2;eNet.position.set(-2.7,.04,1.2);
  label('E · 아래턱',kitContents,[-1.9,.30,1.86],1.4);
  const dNet=shapeCard([[-.9,-.25],[-.9,-.5],[.9,-.5],[.9,-.25],[1.1,-.25],[1.1,.25],[.9,.25],[.9,.5],[-.9,.5],[-.9,.25],[-1.1,.25],[-1.1,-.25]],boxMat,kitContents);dNet.rotation.x=-Math.PI/2;dNet.position.set(.58,.045,1.2);
  label('D · 먹이 상자',kitContents,[.70,.31,1.95],1.5);
  const kitDisc1=createDisc(kitContents,[2.95,.15,-.65],null,'kit-disc-N');const kitDisc2=createDisc(kitContents,[3.62,.15,-.65],null,'kit-disc-N2');
  const kitBar=createBar(kitContents,[3.18,.26,.58],null);
  label('동전자석 2개 · 막대자석',kitContents,[3.07,.70,1.5],2.1);
  const kitFish=fish.clone(true);kitFish.position.set(2.95,.18,-1.70);kitFish.scale.setScalar(.72);kitContents.add(kitFish);
  const kitCarrot=carrot.clone(true);kitCarrot.position.set(3.80,.18,-1.70);kitCarrot.scale.setScalar(.72);kitContents.add(kitCarrot);
  const kitParts={'paper-B':bodyNet,'paper-E':eNet,'paper-D':dNet,'disc-1':kitDisc1,'disc-2':kitDisc2,'bar-magnet':kitBar,'fish':kitFish,'carrot':kitCarrot};
  for(const [id,item]of Object.entries(kitParts))item.traverse(child=>{child.userData.partId=id;});
  for(let i=0;i<4;i++)paperClip(kitContents,[1.9+i*.28,.06,-1.5]);

  const pairs=new THREE.Group();pairs.name='magnet-pairs';scene.add(pairs);
  const pairBar=createBar(pairs,[-1.6,.67,0],'pole1');
  const pairDisc1=createDisc(pairs,[-1.6,.67,0],'pole1','pair-disc-one');pairDisc1.rotation.z=-Math.PI/2;
  const pairDisc2=createDisc(pairs,[1.6,.67,0],'pole2','pair-disc-two');pairDisc2.rotation.z=Math.PI/2;
  pairDisc1.scale.setScalar(1.6);pairDisc2.scale.setScalar(1.6);
  label('자석을 누르면 극이 바뀌어요',pairs,[0,1.6,-.65],3.1);
  const leftArrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(-.65,.72,.75),.75,0xe49646,.17,.12);
  const rightArrow=new THREE.ArrowHelper(new THREE.Vector3(-1,0,0),new THREE.Vector3(.65,.72,.75),.75,0xe49646,.17,.12);
  pairs.add(leftArrow,rightArrow);

  const clipScene=new THREE.Group();clipScene.name='clip-experiment';scene.add(clipScene);
  const clipBar=createBar(clipScene,[0,.47,0],null);clipBar.scale.set(1.65,1.35,1.35);
  const clipDisc=createDisc(clipScene,[0,.37,0],null,'clip-disc');clipDisc.scale.set(1.7,1.7,1.7);
  const poleZone1=mesh(new THREE.TorusGeometry(.50,.017,6,48),material({color:0xe6aa56,transparent:true,opacity:.75}),clipScene,[1.3,.03,0]);poleZone1.rotation.x=-Math.PI/2;
  const poleZone2=mesh(new THREE.TorusGeometry(.50,.017,6,48),material({color:0xe6aa56,transparent:true,opacity:.75}),clipScene,[-1.3,.03,0]);poleZone2.rotation.x=-Math.PI/2;
  const samples=[];
  for(let i=0;i<10;i++){
    const item=new THREE.Group();clipScene.add(item);
    const clip=paperClip(item,[0,0,0]);
    const wood=card(.12,.055,.46,material({color:0xc2a177}),item,[0,0,0]);
    const plastic=card(.17,.07,.37,material({color:0xe4935e}),item,[0,0,0]);
    samples.push({item,clip,wood,plastic,index:i});
  }
  label('움직임을 비교 · 클립은 철 시료',clipScene,[0,1.66,-.65],3.2);
  const regionLabel=label('양쪽 끝 · 극',clipScene,[0,1.09,0],2.0);

  const basePositions = new Map();
  for(const [name,item] of Object.entries(parts))basePositions.set(name,item.position.clone());
  const kitLayout = new Map(kitContents.children.map((item,index) => [item, {position:item.position.clone(),scale:item.scale.clone(),index}]));
  let pouchWasReady=true;
  const smoothKit=value=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
  function updateKitLayout(){
    const view=pouch.getSnapshot(),spread=view.contentProgress;
    kitContents.position.set(...view.offset);kitContents.rotation.set(...view.rotation);
    for(const [item,initial] of kitLayout){
      const t=smoothKit((spread-Math.min(.16,initial.index*.012))/.84);
      item.position.copy(initial.position).multiplyScalar(.57+.43*t);
      item.scale.copy(initial.scale).multiplyScalar(.66+.34*t);
      if(!item.isSprite)item.position.y+=(1-t)*.072+Math.sin(t*Math.PI)*.095;
      else item.visible=spread>.94;
    }
    if(!pouchWasReady&&view.ready&&state.mode==='kit')onAction({type:'pouchReady'});
    pouchWasReady=view.ready;
  }
  const highlightMaterials = new Map();
  scene.traverse(item=>{if(item.isMesh)item.userData.baseMaterial=item.material;});
  function highlightMaterial(original){
    if(!original.isMeshStandardMaterial)return original;
    if(!highlightMaterials.has(original)){const highlighted=original.clone();highlighted.emissive.set(0x8d6d1b);highlighted.emissiveIntensity=.24;materials.add(highlighted);highlightMaterials.set(original,highlighted);}
    return highlightMaterials.get(original);
  }
  const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();const dragPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-1.18);const intersection=new THREE.Vector3();
  let dragging=false, pointerId=null, downPoint=null, clickTarget=null, partTarget=null, frame=0, frameNumber=0,previousFrameTime=0;
  let outcome=deriveOutcome(state);
  let boxedBarPoles={leftPole:'S',rightPole:'N'};
  let targetOpening=outcome.feeding.jawOpening,currentOpening=targetOpening;
  let targetPairSeparation=2.3,currentPairSeparation=targetPairSeparation;
  let draggingOffset=0;
  function ray(event){const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);}
  function handleDown(event){
    if(disposed||event.button>0)return;
    ray(event);const hits=raycaster.intersectObjects(scene.children,true).filter(hit=>hit.object.visible && visibleAncestors(hit.object));
    const foodHit=hits.find(hit=>hit.object.userData.dragFood);
    const poleHit=hits.find(hit=>hit.object.userData.flipTarget);
    partTarget=state.mode==='kit'?hits.find(hit=>hit.object.userData.partId)?.object.userData.partId:null;
    downPoint={x:event.clientX,y:event.clientY};clickTarget=poleHit?.object.userData.flipTarget||null;
    if(foodHit && (state.mode==='feeding'||(state.mode==='assembly'&&state.assemblyStage>=9))){
      dragging=true;pointerId=event.pointerId;controls.enabled=false;canvas.setPointerCapture(event.pointerId);canvas.style.cursor='grabbing';
      raycaster.ray.intersectPlane(dragPlane,intersection);draggingOffset=foodTool.position.x-intersection.x;event.preventDefault();event.stopImmediatePropagation();
    }
  }
  function visibleAncestors(object){for(let p=object;p;p=p.parent)if(!p.visible)return false;return true;}
  function handleMove(event){
    if(!dragging||event.pointerId!==pointerId)return;
    ray(event);if(raycaster.ray.intersectPlane(dragPlane,intersection)){
      const value=Math.max(0,Math.min(1,(intersection.x+draggingOffset-2.35)/3.25));
      onAction({type:'distance',value});
      // Keep dragging responsive when a host updates state asynchronously.
      setState({distance:value});
    }event.preventDefault();
  }
  function handleUp(event){
    if(dragging){if(canvas.hasPointerCapture(pointerId))canvas.releasePointerCapture(pointerId);dragging=false;pointerId=null;controls.enabled=true;canvas.style.cursor='grab';}
    else if(clickTarget&&downPoint&&Math.hypot(event.clientX-downPoint.x,event.clientY-downPoint.y)<6)onAction({type:'flipPole',target:clickTarget});
    else if(partTarget&&downPoint&&Math.hypot(event.clientX-downPoint.x,event.clientY-downPoint.y)<6)onAction({type:'selectPart',id:partTarget});
    clickTarget=null;partTarget=null;downPoint=null;
  }
  canvas.addEventListener('pointerdown',handleDown,true);canvas.addEventListener('pointermove',handleMove);canvas.addEventListener('pointerup',handleUp);canvas.addEventListener('pointercancel',handleUp);
  canvas.style.cursor='grab';
  function key(event){if(event.key==='Home'){event.preventDefault();resetView();}}
  canvas.addEventListener('keydown',key);

  function applySceneState(immediate=false){
    outcome=deriveOutcome(state);const mode=state.mode;const assemblyMode=mode==='assembly';const full=mode==='feeding';
    kit.visible=mode==='kit';pairs.visible=mode==='pairs';clipScene.visible=mode==='clips';croc.visible=assemblyMode||full;
    pouch.setOpen(state.pouchOpen,{immediate:immediate||reduceMotion.matches||mode!=='kit'});
    updateKitLayout();
    lowerTemplate.visible=assemblyMode&&state.assemblyStage<=1;
    foodTool.visible=(assemblyMode&&state.assemblyStage>=7)||full;
    const available=new Set(outcome.assembly.parts);
    contactShadow.visible=available.has('legs');
    for(const [name,item]of Object.entries(parts)){
      if(name==='lowerTemplate')continue;
      item.visible=available.has(name);
      if(basePositions.has(name))item.position.copy(basePositions.get(name));
    }
    if(assemblyMode&&state.assemblyStage<=1)lowerTemplate.add(tape);else lower.add(tape);
    if(assemblyMode&&state.assemblyStage===2)lower.position.y=.09;
    scene.traverse(item=>{if(item.isMesh&&item.userData.baseMaterial)item.material=item.userData.baseMaterial;});
    if(assemblyMode)for(const name of outcome.assembly.currentParts){parts[name]?.traverse(item=>{if(item.isMesh&&item.userData.baseMaterial){const original=item.userData.baseMaterial;item.material=Array.isArray(original)?original.map(highlightMaterial):highlightMaterial(original);}});}
    if(mode==='kit'&&state.selectedPart&&kitParts[state.selectedPart])kitParts[state.selectedPart].traverse(item=>{if(item.isMesh&&item.userData.baseMaterial){const original=item.userData.baseMaterial;item.material=Array.isArray(original)?original.map(highlightMaterial):highlightMaterial(original);}});
    // Unfinished foodbox keeps its flap open; boxed bar remains visible in exploded view.
    const leftPole=state.food==='fish'?state.foodPole:state.foodPole==='N'?'S':'N';
    const rightPole=leftPole==='N'?'S':'N';boxedBarPoles={leftPole,rightPole};
    // createBar.setPole describes its +X/right end; pasted pictures never set poles.
    barInside.userData.setPole(rightPole);
    boxFlap.rotation.y=assemblyMode&&state.assemblyStage===7?-1.0:0;
    barInside.visible=available.has('barMagnet')&&(exploded||(assemblyMode&&state.assemblyStage===8));
    barInside.userData.labels.forEach(item=>item.visible=state.showPoles);
    upperTeeth.visible=available.has('upperBody');
    crocLabel.visible=false;
    if(exploded&&(assemblyMode||full)){
      lower.position.y-=.23;upper.position.y+=.50;tail.position.x-=.72;bodyBase.position.y-=.19;legs.position.z+=.37;
      upperMagnet.position.y-=.52;lowerMagnet.position.y+=.42;foodBox.position.z+=.30;barInside.position.z-=.37;
      fish.position.x-=.37;carrot.position.x+=.37;
    }
    upperMagnet.userData.setPole(state.upperPole);lowerMagnet.userData.setPole(state.lowerPole);
    for(const disc of [upperMagnet,lowerMagnet])disc.userData.poleLabel.visible=state.showPoles;
    pairBar.userData.setPole(state.pole1);pairDisc1.userData.setPole(state.pole1);pairDisc2.userData.setPole(state.pole2);
    pairBar.visible=state.pairKind==='bar-disc';pairDisc1.visible=state.pairKind==='disc-disc';
    pairBar.userData.labels.forEach(item=>item.visible=state.showPoles);
    pairDisc1.userData.poleLabel.visible=pairDisc2.userData.poleLabel.visible=state.showPoles;
    clipBar.visible=state.magnetType==='bar';clipDisc.visible=state.magnetType==='disc';
    clipBar.userData.labels.forEach(item=>item.visible=state.showPoles);clipDisc.userData.poleLabel.visible=state.showPoles;
    poleZone1.visible=poleZone2.visible=state.magnetType==='bar';
    setLabel(regionLabel,state.magnetType==='bar'?'양쪽 끝 · N극과 S극':'윗면·아랫면 · N극과 S극');
    targetOpening=(full?outcome.feeding.jawOpening:state.assemblyStage===10?outcome.feeding.jawOpening:state.assemblyStage>=6?outcome.feeding.baselineOpening:.30);
    if(!available.has('upperBody'))targetOpening=0;
    foodTool.position.set(2.35+state.distance*3.25,1.18,0);
    if(assemblyMode&&state.assemblyStage<10)foodTool.position.set(2.9,.235,1.15);
    foodTool.rotation.y=state.food==='carrot'?Math.PI:0;
    // Only the pasted paper pictures swap; pole and movement keep physical meaning.
    fish.position.x=(state.labelsSwapped?.72:-.72)+(exploded?(state.labelsSwapped?.37:-.37):0);
    carrot.position.x=(state.labelsSwapped?-.72:.72)+(exploded?(state.labelsSwapped?-.37:.37):0);
    foodLabel.visible=state.showPoles;
    const paperName=(state.food==='fish')!==state.labelsSwapped?'물고기':'당근';
    setLabel(foodLabel,`${paperName} 쪽 ${state.foodPole}`,state.foodPole==='S'?'#2b759d':'#a84640');
    targetPairSeparation=state.distance*1.80+outcome.pairs.separation*1.10;
    const text=mode==='pairs'?outcome.pairs.label:mode==='clips'?outcome.clips.label:mode==='kit'?'펼친 종이 도안과 자석을 둘러봐요':assemblyMode?`${state.assemblyStage} / 10 · 현재 조립 부품을 살펴요`:outcome.feeding.label;
    setLabel(status,text);setLabel(title,mode==='kit'?'키트 살펴보기':mode==='pairs'?'두 자석 · 극을 바꾸어 비교':mode==='clips'?'자석의 극 · 시료를 가까이':assemblyMode?'10단계 · 종이 악어 조립':'먹이를 먹는 자석 악어');
    leftArrow.setDirection(new THREE.Vector3(outcome.pairs.interaction==='attract'?1:-1,0,0));rightArrow.setDirection(new THREE.Vector3(outcome.pairs.interaction==='attract'?-1:1,0,0));
    for(const sample of samples){sample.clip.visible=state.material==='steel';sample.wood.visible=state.material==='wood';sample.plastic.visible=state.material==='plastic';}
    if(immediate||reduceMotion.matches){currentOpening=targetOpening;currentPairSeparation=targetPairSeparation;}
    updateGeometry(1/60);requestRender();
  }
  function updateGeometry(seconds){
    pouch.update(Math.min(MAX_MOTION_SECONDS,seconds),{active:state.mode==='kit'&&!paused&&!document.hidden,reducedMotion:reduceMotion.matches});
    updateKitLayout();
    const ease=motionAlpha(seconds,reduceMotion.matches);
    currentOpening+=(targetOpening-currentOpening)*ease;currentPairSeparation+=(targetPairSeparation-currentPairSeparation)*ease;
    // The lower E card folds around its back hinge; the body stays on its legs.
    lower.rotation.z=-currentOpening*.38;
    upper.rotation.z=0;
    const feedRetreat=state.mode==='feeding'?outcome.feeding.retreat:0;croc.position.x=-feedRetreat;
    pairBar.position.x=pairDisc1.position.x=-currentPairSeparation*.5;pairDisc2.position.x=currentPairSeparation*.5;
    for(const sample of samples){
      const i=sample.index, side=i<5?-1:1, angle=(i%5)*.7-.6;
      const scatter=new THREE.Vector3(side*(1.20+state.distance*1.20),.07,Math.sin(angle)*1.35);
      let destination;
      if(state.magnetType==='bar')destination=new THREE.Vector3(side*(1.35+(i%5)*.095),.23,((i%5)-2)*.13);
      else destination=new THREE.Vector3(Math.cos(i*.65)*.42,.45+(i%3)*.07,Math.sin(i*.65)*.42);
      const influence=outcome.clips.attracted?outcome.pairs.influence*(state.clipPosition==='middle'?.22:1):0;
      scatter.lerp(destination,influence);sample.item.position.lerp(scatter,ease);sample.item.rotation.y=(i%4)*.28;
    }
  }
  let width=0,height=0;
  function resize(){
    if(disposed)return;const rect=canvas.getBoundingClientRect();const hostRect=host.getBoundingClientRect();width=Math.max(1,rect.width||hostRect.width);height=Math.max(1,rect.height||hostRect.height||400);
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
    title.position.y=width<500?2.9:2.65;status.scale.set(width<500?3.5:3.4,(width<500?3.5:3.4)/4,1);
    if(!dragging)resetView();requestRender();
  }
  function resetView(){
    // Horizontal fit is calculated from the real canvas aspect, including tall phones.
    const experimentWidth=state.mode==='kit'?8.9:state.mode==='pairs'||state.mode==='clips'?5.1:state.mode==='assembly'&&state.assemblyStage<3?5.4:state.mode==='assembly'&&state.assemblyStage<7?8.0:11.8;
    const targetX=state.mode==='feeding'?.10:state.mode==='assembly'&&state.assemblyStage>=3&&state.assemblyStage<7?-1.25:.30;
    const isCroc=state.mode==='feeding'||(state.mode==='assembly'&&state.assemblyStage>=3);
    let fitDistance=Math.max(state.mode==='pairs'||state.mode==='clips'?8.6:isCroc?9.3:13.6,experimentWidth/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*Math.max(.18,camera.aspect))*(isCroc?1.025:1.08));
    const viewDirection=(isCroc?new THREE.Vector3(-4.0,8.2,12.0):new THREE.Vector3(5.7,7.1,10.2)).normalize();
    if(state.mode==='feeding'){
      // Fit the farthest paper end using camera-space depth, not just world width.
      const right=new THREE.Vector3(viewDirection.z,0,-viewDirection.x).normalize();const up=viewDirection.clone().cross(right);const tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
      for(const x of[-5.65,7.12])for(const y of[0,2.10])for(const z of[-.92,.92]){
        const point=new THREE.Vector3(x-targetX,y-1.02,z);const projectedExtent=Math.max(Math.abs(point.dot(right))/(tangent*camera.aspect),Math.abs(point.dot(up))/tangent);
        fitDistance=Math.max(fitDistance,point.dot(viewDirection)+projectedExtent*1.04);
      }
    }
    if(state.mode==='kit'){
      const direction=new THREE.Vector3(1.4,8.6,10).normalize(),right=new THREE.Vector3(direction.z,0,-direction.x).normalize(),up=direction.clone().cross(right),tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
      fitDistance=8.7;
      for(const x of[-4.05,4.35])for(const y of[.02,.94])for(const z of[-3.1,2.32]){
        const point=new THREE.Vector3(x-.12,y-.22,z+.08),extent=Math.max(Math.abs(point.dot(right))/(tangent*camera.aspect),Math.abs(point.dot(up))/tangent);
        fitDistance=Math.max(fitDistance,point.dot(direction)+extent*1.10);
      }
      camera.position.copy(direction.multiplyScalar(fitDistance)).add(new THREE.Vector3(.12,.22,-.08));
      controls.maxDistance=Math.max(25,fitDistance*1.7);controls.target.set(.12,.22,-.08);controls.update();requestRender();return;
    }
    const direction=viewDirection.multiplyScalar(fitDistance);
    camera.position.copy(direction);camera.position.x+=targetX;camera.position.y+=1.02;
    controls.maxDistance=Math.max(25,fitDistance*1.7);controls.target.set(targetX,1.02,0);controls.update();requestRender();
  }
  function render(){if(disposed)return;renderer.render(scene,camera);frameNumber++;}
  function tick(timestamp){
    frame=0;if(disposed)return;
    if(!paused&&!document.hidden&&!contextLost){
      const seconds=previousFrameTime?Math.max(0,(timestamp-previousFrameTime)/1000):1/60;previousFrameTime=timestamp;
      updateGeometry(seconds);controls.update();render();
      // Orbit damping can schedule the next frame through controls.change above.
      if(!reduceMotion.matches&&!frame)frame=requestAnimationFrame(tick);
    }
  }
  function requestRender(){if(disposed||contextLost)return;if(paused||document.hidden){render();return;}if(!frame)frame=requestAnimationFrame(tick);}
  controls.addEventListener('change',requestRender);
  const observer=new ResizeObserver(resize);observer.observe(host);
  function visibility(){previousFrameTime=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestRender();}
  function motionChanged(){previousFrameTime=0;applySceneState(true);}
  document.addEventListener('visibilitychange',visibility);reduceMotion.addEventListener('change',motionChanged);
  let contextLost=false;
  const contextNotice=document.createElement('p');contextNotice.style.cssText='position:absolute;inset:20px auto auto 20px;padding:12px;background:#fff;color:#634c32;z-index:3;max-width:80%;';contextNotice.hidden=true;contextNotice.setAttribute('role','status');host.append(contextNotice);
  function lost(event){event.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;previousFrameTime=0;contextNotice.textContent='3D 화면 연결이 잠시 끊겼어요. 아래 조작과 실물 사진을 이용하거나 화면을 다시 열어 주세요.';contextNotice.hidden=false;onAction({type:'contextLost'});}
  function restored(){contextLost=false;previousFrameTime=0;contextNotice.hidden=true;requestRender();}
  canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
  function setState(value){if(disposed)return;const previousMode=state.mode;const oldRange=state.assemblyStage<3?0:state.assemblyStage<7?1:2;state=normalizeLabState({...state,...value});applySceneState();const newRange=state.assemblyStage<3?0:state.assemblyStage<7?1:2;if(previousMode!==state.mode||(state.mode==='assembly'&&oldRange!==newRange))resetView();}
  function getSnapshot(){
    const projected=item=>{const world=new THREE.Vector3();item.getWorldPosition(world);const screen=world.clone().project(camera);const r=canvas.getBoundingClientRect();return{world:world.toArray(),screen:{x:r.left+(screen.x+1)*r.width/2,y:r.top+(1-screen.y)*r.height/2},visible:item.visible&&visibleAncestors(item)};};
    return {webgl:true,fallback:false,contextLost,state:{...state},outcome,boxedBarPoles:{...boxedBarPoles},paperTextureSources:[...paperAssets.sources],paperThickness:.014,exploded,paused,reducedMotion:reduceMotion.matches,
      camera:{position:camera.position.toArray(),target:controls.target.toArray(),aspect:camera.aspect},frameNumber,
      pouch:pouch.getSnapshot(),kitPartsBounds:Object.entries(kitParts).map(([id,item])=>{const box=new THREE.Box3().setFromObject(item);return{id,min:box.min.toArray(),max:box.max.toArray(),visible:item.visible&&visibleAncestors(item)};}),
      objects:{food:projected(foodTool),upperMagnet:projected(upperMagnet),lowerMagnet:projected(lowerMagnet),pairOne:projected(state.pairKind==='bar-disc'?pairBar:pairDisc1),pairTwo:projected(pairDisc2)},
      visibleParts:Object.entries(parts).filter(([,item])=>item.visible&&visibleAncestors(item)).map(([name])=>name),
      jawRotation:lower.rotation.z,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,canvas:{width:canvas.width,height:canvas.height}};
  }
  resize();applySceneState(true);render();requestRender();
  return {
    setState,getSnapshot,resetView,
    shakePouch(){if(state.mode==='kit'){pouch.shake();requestRender();}},
    replayPouch(){if(state.mode==='kit'&&state.pouchOpen){pouch.replay();pouchWasReady=false;updateKitLayout();requestRender();}},
    setExploded(value){exploded=Boolean(value);applySceneState();},
    setPaused(value){paused=Boolean(value);previousFrameTime=0;if(paused){cancelAnimationFrame(frame);frame=0;currentOpening=targetOpening;currentPairSeparation=targetPairSeparation;updateGeometry(1/60);controls.update();render();}else requestRender();},
    dispose(){
      if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();
      canvas.removeEventListener('pointerdown',handleDown,true);canvas.removeEventListener('pointermove',handleMove);canvas.removeEventListener('pointerup',handleUp);canvas.removeEventListener('pointercancel',handleUp);canvas.removeEventListener('keydown',key);
      document.removeEventListener('visibilitychange',visibility);reduceMotion.removeEventListener('change',motionChanged);
      canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);
      scene.traverse(item=>{if(item.geometry)geometries.add(item.geometry);if(item.material){for(const mat of(Array.isArray(item.material)?item.material:[item.material]))materials.add(mat);}});
      geometries.forEach(item=>item.dispose());materials.forEach(item=>item.dispose());textures.forEach(item=>item.dispose());
      renderer.dispose();renderer.forceContextLoss();canvas.remove();contextNotice.remove();
    },
  };
}
