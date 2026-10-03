import { THREE, mat, label } from './_kit.js';
// 투명 비커와 뚜껑을 덮지 않은 냉각판. 화살표는 보이지 않는 수증기의 이동을 나타내는 모형 기호다.
export function buildHumidifier() {
  const g = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({color:0xdff4ff,transparent:true,opacity:.22,roughness:.08,side:THREE.DoubleSide,depthWrite:false});
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,1.65,48,1,true),glass);wall.position.y=.85;g.add(wall);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,.04,48),glass);base.position.y=.025;g.add(base);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.72,.025,8,48),mat(0x94bccb));rim.rotation.x=Math.PI/2;rim.position.y=1.68;g.add(rim);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(.69,.69,.75,48),new THREE.MeshPhysicalMaterial({color:0x6dbbdb,transparent:true,opacity:.72,roughness:.08,clearcoat:1}));water.position.y=.42;g.add(water);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.085,48),mat(0xc4d2db,{metalness:.65,roughness:.25}));plate.position.y=2.05;g.add(plate);
  const support = new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,2.1,16),mat(0x596b78));support.position.set(1.12,1.05,0);g.add(support);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.15,.07,.07),mat(0x596b78));arm.position.set(.57,2.1,0);g.add(arm);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(.34,.4,.08,24),mat(0x596b78));foot.position.set(1.12,.04,0);g.add(foot);
  const drops = new THREE.Group();
  for(let i=0;i<12;i++){const a=i*2.399,r=.18+Math.sqrt(i/12)*.5;const d=new THREE.Mesh(new THREE.SphereGeometry(.052,12,8),new THREE.MeshPhysicalMaterial({color:0x4fa7d2,roughness:.08,clearcoat:1}));d.scale.y=1.45;d.position.set(Math.cos(a)*r,1.95,Math.sin(a)*r);drops.add(d);}
  drops.visible=false;g.add(drops);
  const arrows=new THREE.Group();
  for(const x of [-.35,.35]){const ar=new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(x,.94,.15),.65,0xe69953,.13,.07);arrows.add(ar);}arrows.visible=false;g.add(arrows);
  const name=label('냉각판 아래를 관찰해요',{size:.27});name.position.set(0,2.65,0);g.add(name);
  g.userData={water,plate,drops,arrows,name};return g;
}
export default {
  view:{theta:.45,phi:1.25}, revealAt:2,
  build(kit,world){const rig=buildHumidifier();world.add('rig',rig);return {};},
  beats:[
    {text:'같은 양의 물 위에 판을 놓아요. 판은 물과 닿지 않아요.',show:['rig'],dur:4,reset(o){o.rig.userData.drops.visible=false;o.rig.userData.arrows.visible=false;}},
    {text:'판을 차갑게 하면 판 아래는 어떻게 될까요? 먼저 예상해요.',show:['rig'],dur:4},
    {text:'물은 기화해 보이지 않는 수증기가 돼요. 화살표는 이동을 설명하는 기호예요.',show:['rig'],dur:5,reset(o){o.rig.userData.arrows.visible=true;}},
    {text:'차가운 판에서 수증기가 식어 물방울로 응결해요.',show:['rig'],dur:5,reset(o){o.rig.userData.drops.visible=true;}},
    {text:'기체 수증기는 보이지 않아요. 하얀 김은 작은 액체 물방울이에요.',show:['rig'],dur:5},
  ]
};
