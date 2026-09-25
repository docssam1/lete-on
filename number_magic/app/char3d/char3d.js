/* ============================================================
   Numbers of Magic — 3D 캐릭터 키트 (char3d)
   마을(town3d)·타이틀(title3d)에서 평면 PNG 빌보드 대신 쓰는 "진짜 3D" 캐릭터.

   사용법
     import * as THREE from '../../../world-explorer/vendor/three.module.js';
     import { makeCharacter, NUMBER_COLORS } from './char3d/char3d.js';
     const c = makeCharacter(THREE, {
       kind  : 'boy' | 'girl' | 'elder' | 'doc' | 'buddy',
       buddy : { number: 0..10 | 'plus'|'minus'|'times'|'divide'|'equal'|'percent'|'pi'|'sigma'|'infinity'|'sqrt',
                 color: NM_AVATAR 색 id ('blue','gold','pink',…; 없으면 숫자별 기본색),
                 hat:   'none'|'party'|'ribbon'|'wizard'|'crown'|'laurel',
                 cape:  'none'|'red'|'blue'|'green'|'gold'|'purple'|'rainbow'|'starcape'|'galaxy' },
       height: 1.9,          // 월드 단위 키(발바닥 y=0 ~ 머리끝). 기본: 사람 1.6~1.8, 버디 1.1
       palette: {...},       // (선택) 사람 색 덮어쓰기 — 아래 PALETTES 의 키 (outfit, trim, hair …)
       props: true,          // (선택) 소품(지팡이·별봉)  기본 true
       blob: true,           // (선택) 발밑 부드러운 접지 그림자 원판. 장면에 그림자가 따로 있으면 false
       shadows: true,        // (선택) mesh.castShadow
     });
     scene.add(c.object);      // THREE.Group — 발바닥 y=0, +z 를 바라봄, 키 ≈ height
     c.update(dt, t);          // 매 프레임(초 단위). 숨쉬기·깜빡임, setWalking(true) 면 걷기
     c.setWalking(true, 1);    // 두 번째 인자 = 걸음 속도 배수(이동 속도에 맞출 때)
     c.face(angleRad);         // 몸 방향(y축 회전) — 부드럽게 돈다. 0 = +z
     c.wave();                 // 짧게 손 흔들기(약 1.6초)
     c.dispose();              // 장면에서 떼기. 지오메트리·재질은 인스턴스끼리 공유하므로
                               // 전부 비우려면 disposeCharacterCache(THREE)
     c.meshes                  // 레이캐스트(클릭)용 Mesh 배열. mesh.userData.char3d === c

   설계
   - THREE 는 인자로 받는다(앱 전체에서 THREE 인스턴스가 하나이도록).
   - 재질은 흰 바탕 + vertexColors 6종(skin·matte·satin·gloss·metal·glow + 망토용 cloth)
     을 THREE 인스턴스마다 한 벌만 만들어 모든 캐릭터가 공유한다. 색은 정점색에 굽는다.
     → 캐릭터 1명당 재질 ≤ 6, 볼터치·아래쪽 음영(AO 느낌) 그라데이션도 재질 추가 없이.
   - 부위(관절)마다 같은 재질끼리 지오메트리를 하나로 합친다(드로콜 절약).
     합친 지오메트리는 "레시피 키"(kind+옵션)로 캐시해 같은 캐릭터끼리 공유한다.
   - 숫자 친구는 TextGeometry 없이 획(centerline)을 둥근 튜브로 빚는다 — 말랑한 비닐
     장난감처럼. 얼굴은 레이캐스트로 몸 표면에 붙인다(숫자마다 표면 모양이 달라서).
   ============================================================ */

/* ── 공개 색표: data/numi-avatar.js 의 NM_AVATAR.colors fg 와 같은 id ── */
export const NUMBER_COLORS = {
  blue:'#2f86c8', green:'#2fae63', red:'#e2493c', gold:'#f0b21a', purple:'#8b4fc0',
  pink:'#ee5a9e', teal:'#1fb59a', navy:'#34466b', lime:'#8cc34d', orange:'#ff8a1f',
  silver:'#a9b4bb', aurora:'#a15fd6'
};
/* 원본 PNG 아트의 숫자별 색(color 를 안 줬을 때) */
const DIGIT_DEFAULT_COLOR = { 0:'orange', 1:'blue', 2:'green', 3:'gold', 4:'red', 5:'purple',
  6:'lime', 7:'blue', 8:'pink', 9:'purple', 10:'green' };
const CAPE_COLORS = { red:'#d8413a', blue:'#2c73c0', green:'#2a9a5a', gold:'#e3a51c', purple:'#7c45b4',
  starcape:'#1f2d52', rainbow:null, galaxy:null };

/* 사람 팔레트 — 원본 일러스트(kid-boy/kid-girl/elder/docssam.png) 톤을 한 단계 차분하게 */
export const PALETTES = {
  boy:  { skin:'#f6c7a0', hair:'#6a4128', outfit:'#2d63c4', outfit2:'#234f9e', trim:'#e7b64c',
          shirt:'#f3efe6', leg:'#f6c7a0', sock:'#f3efe6', shoe:'#2d63c4', sole:'#f3efe6',
          leather:'#8a5a36', iris:'#3f7fd1', mouth:'#7a2d34' },
  girl: { skin:'#f7caa6', hair:'#7b4a2c', outfit:'#7443c6', outfit2:'#5b30a3', trim:'#e7b64c',
          shirt:'#bba3ea', leg:'#f2edf6', sock:'#f2edf6', shoe:'#6c3cbd', sole:'#4c2a8a',
          leather:'#8a5a36', iris:'#3f7fd1', mouth:'#7a2d34', bow:'#8f5ce0' },
  elder:{ skin:'#efc5a2', hair:'#f1efea', outfit:'#23469f', outfit2:'#1a3577', trim:'#e2af4a',
          shirt:'#efe6cf', leg:'#23469f', sock:'#23469f', shoe:'#5b3b23', sole:'#3a2414',
          leather:'#6b4428', iris:'#5b3d27', mouth:'#7a2d34', gem:'#5cc0ff', wood:'#7a4e2a' },
  doc:  { skin:'#f0c4a0', hair:'#3a2921', outfit:'#27744a', outfit2:'#1d5c3a', trim:'#e2af4a',
          shirt:'#f3efe6', leg:'#4a3326', sock:'#4a3326', shoe:'#3a2515', sole:'#24160c',
          leather:'#6d4a30', iris:'#5b3d27', mouth:'#7a2d34', tie:'#1f6a40', frame:'#262626' }
};
const DEFAULT_HEIGHT = { boy:1.6, girl:1.58, elder:1.78, doc:1.82, buddy:1.1 };

/* ============================================================
   공유 자원(THREE 인스턴스마다 한 벌)
   ============================================================ */
const KITS = new WeakMap();
function kitFor(THREE){
  let k = KITS.get(THREE);
  if(k) return k;
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ color:0xffffff, vertexColors:true }, o));
  const phys = (o) => new THREE.MeshPhysicalMaterial(Object.assign({ color:0xffffff, vertexColors:true }, o));
  const mats = {
    skin : phys({ roughness:0.56, sheen:0.35, sheenRoughness:0.6, sheenColor:new THREE.Color(0xffd6c8) }),
    matte: std({ roughness:0.82 }),
    satin: phys({ roughness:0.42, clearcoat:0.25, clearcoatRoughness:0.45 }),
    gloss: phys({ roughness:0.28, clearcoat:1, clearcoatRoughness:0.06 }),
    metal: std({ roughness:0.3, metalness:0.45 }),
    glow : new THREE.MeshBasicMaterial({ color:0xffffff, vertexColors:true }),
    cloth: std({ roughness:0.75, side:THREE.DoubleSide }),
  };
  for(const [n, m] of Object.entries(mats)) m.name = 'char3d-' + n;
  k = { mats, recipes:new Map(), blobTex:null, blobGeo:null, blobMat:null };
  KITS.set(THREE, k);
  return k;
}
export function disposeCharacterCache(THREE){
  const k = KITS.get(THREE); if(!k) return;
  for(const m of Object.values(k.mats)) m.dispose();
  for(const r of k.recipes.values()) for(const b of r.bins) b.geo.dispose();
  if(k.blobTex){ k.blobTex.dispose(); k.blobGeo.dispose(); k.blobMat.dispose(); }
  KITS.delete(THREE);
}

/* ============================================================
   지오메트리 도우미
   ============================================================ */
function makeGeo(THREE){
  const V3 = THREE.Vector3;

  /* 굵기가 변하는 튜브(획·머리카락·팔다리). 끝은 둥근 캡.
     pts: [[x,y,z],…]  o: {r:number|fn(t), zs(단면 z 납작), radial, density, seg, closed, caps, up} */
  function tube(pts, o = {}){
    const P = pts.map(p => new V3(p[0], p[1], p[2] || 0));
    const closed = !!o.closed;
    const straight = P.length === 2 && !closed;
    const curve = straight ? new THREE.LineCurve3(P[0], P[1]) : new THREE.CatmullRomCurve3(P, closed, 'centripetal');
    const L = curve.getLength();
    const n = o.seg || (straight ? 1 : Math.max(3, Math.ceil(L * (o.density || 16))));
    const rad = o.radial || 12, zs = o.zs || 1;
    const rf = typeof o.r === 'function' ? o.r : () => o.r;
    const capN = closed || o.caps === false ? 0 : (o.capRings || (rad <= 8 ? 2 : 3));
    const cnt = closed ? n : n + 1;
    const C = [], T = [];
    for(let i = 0; i < cnt; i++){ const t = i / n; C.push(curve.getPointAt(t)); T.push(curve.getTangentAt(t).normalize()); }
    /* 평행 이동 프레임 — 평면 곡선이면 B 가 up(기본 +z)에 고정된다 */
    const up = o.up ? new V3(...o.up) : new V3(0, 0, 1);
    const N = [], B = [];
    let b0 = up.clone().sub(T[0].clone().multiplyScalar(up.dot(T[0])));
    if(b0.lengthSq() < 1e-6) b0 = new V3(1, 0, 0).sub(T[0].clone().multiplyScalar(T[0].x));
    b0.normalize();
    B.push(b0); N.push(new V3().crossVectors(b0, T[0]).normalize());
    const q = new THREE.Quaternion();
    for(let i = 1; i < cnt; i++){
      q.setFromUnitVectors(T[i - 1], T[i]);
      N.push(N[i - 1].clone().applyQuaternion(q).normalize());
      B.push(B[i - 1].clone().applyQuaternion(q).normalize());
    }
    const pos = [], nor = [], idx = [];
    const rows = [];                // 각 행: {c, T, N, B, r, capA(0=옆면), dir}
    const r0 = rf(0), r1 = rf(1);
    for(let k = capN - 1; k >= 1; k--){ const a = k / capN * Math.PI / 2; rows.push({ c:C[0].clone().addScaledVector(T[0], -r0 * Math.sin(a)), i:0, r:r0 * Math.cos(a), a, dir:-1 }); }
    for(let i = 0; i < cnt; i++) rows.push({ c:C[i], i, r:rf(closed ? i / n : i / n), a:0, dir:0 });
    for(let k = 1; k < capN; k++){ const a = k / capN * Math.PI / 2; rows.push({ c:C[cnt - 1].clone().addScaledVector(T[cnt - 1], r1 * Math.sin(a)), i:cnt - 1, r:r1 * Math.cos(a), a, dir:1 }); }
    const tmp = new V3(), nn = new V3();
    for(const row of rows){
      const Ni = N[row.i], Bi = B[row.i], Ti = T[row.i];
      for(let j = 0; j < rad; j++){
        const th = j / rad * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th);
        tmp.copy(row.c).addScaledVector(Ni, cs * row.r).addScaledVector(Bi, sn * row.r * zs);
        pos.push(tmp.x, tmp.y, tmp.z);
        nn.set(0, 0, 0).addScaledVector(Ni, cs).addScaledVector(Bi, sn / zs).normalize();
        if(row.dir) nn.multiplyScalar(Math.cos(row.a)).addScaledVector(Ti, row.dir * Math.sin(row.a)).normalize();
        nor.push(nn.x, nn.y, nn.z);
      }
    }
    const R = rows.length;
    const lastRow = closed ? R : R - 1;
    for(let i = 0; i < lastRow; i++){
      const i2 = (i + 1) % R;
      for(let j = 0; j < rad; j++){
        const j2 = (j + 1) % rad;
        const a = i * rad + j, b = i * rad + j2, c = i2 * rad + j, d = i2 * rad + j2;
        idx.push(a, b, c, b, d, c);
      }
    }
    if(capN){
      const ps = pos.length / 3; tmp.copy(C[0]).addScaledVector(T[0], -r0);
      pos.push(tmp.x, tmp.y, tmp.z); nor.push(-T[0].x, -T[0].y, -T[0].z);
      for(let j = 0; j < rad; j++) idx.push(ps, (j + 1) % rad, j);
      const pe = pos.length / 3; tmp.copy(C[cnt - 1]).addScaledVector(T[cnt - 1], r1);
      pos.push(tmp.x, tmp.y, tmp.z); nor.push(T[cnt - 1].x, T[cnt - 1].y, T[cnt - 1].z);
      const base = (R - 1) * rad;
      for(let j = 0; j < rad; j++) idx.push(base + j, base + (j + 1) % rad, pe);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setIndex(idx);
    return g;
  }

  const sphere = (ws = 16, hs = 10) => new THREE.SphereGeometry(1, ws, hs);
  /* 볼록한 원판(눈·볼터치·배지) — 극이 +z 를 향하는 구면 조각 */
  const dome = (ws = 16, hs = 4, th = 0.75) => new THREE.SphereGeometry(1, ws, hs, 0, Math.PI * 2, 0, th).rotateX(Math.PI / 2);
  const lathe = (prof, segs = 24) => new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), segs);
  const torus = (R, r, rs = 8, ts = 28, arc = Math.PI * 2) => new THREE.TorusGeometry(R, r, rs, ts, arc);
  const cyl = (rt, rb, h, s = 16) => new THREE.CylinderGeometry(rt, rb, h, s);
  const cone = (r, h, s = 20) => new THREE.ConeGeometry(r, h, s);
  function star(ro = 1, ri = 0.46, depth = 0.3, bevel = 0.14){
    const s = new THREE.Shape();
    for(let i = 0; i < 10; i++){
      const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? ri : ro;
      i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled:true, bevelThickness:bevel, bevelSize:bevel * 0.8, bevelSegments:2, curveSegments:1 });
    g.translate(0, 0, -depth / 2);
    return g;
  }
  /* 웃는 입: 윗변이 살짝 휜 D 모양 */
  function mouthD(w = 1, h = 0.8, depth = 0.12){
    const s = new THREE.Shape();
    s.moveTo(-w, 0);
    s.quadraticCurveTo(0, -0.18 * h, w, 0);
    s.bezierCurveTo(w * 0.9, -h * 1.1, -w * 0.9, -h * 1.1, -w, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled:true, bevelThickness:0.08, bevelSize:0.08, bevelSegments:2, curveSegments:8 });
    g.translate(0, 0, -depth / 2);
    return g;
  }
  function roundBox(w, h, d, r = 0.2){
    const s = new THREE.Shape(), x = w / 2 - r, y = h / 2 - r;
    s.moveTo(-x, -h / 2); s.lineTo(x, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -y);
    s.lineTo(w / 2, y); s.quadraticCurveTo(w / 2, h / 2, x, h / 2); s.lineTo(-x, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, y); s.lineTo(-w / 2, -y); s.quadraticCurveTo(-w / 2, -h / 2, -x, -h / 2);
    const bv = Math.min(r, d / 2) * 0.8;
    const g = new THREE.ExtrudeGeometry(s, { depth:Math.max(0.001, d - 2 * bv), bevelEnabled:true, bevelThickness:bv, bevelSize:bv * 0.9, bevelSegments:2, curveSegments:3 });
    g.translate(0, 0, -(d - 2 * bv) / 2);
    return g;
  }
  return { tube, sphere, dome, lathe, torus, cyl, cone, star, mouthD, roundBox };
}

/* ============================================================
   레시피 빌더: 관절(bone) 트리 + (관절, 재질)별로 합친 지오메트리
   ============================================================ */
function makeBuilder(THREE){
  const bones = new Map();   // name → {name, parent, pos:Vector3, quat, world:Matrix4, inv:Matrix4}
  const items = new Map();   // `${bone}|${mat}` → [{geo, m, col, fn}]
  const extra = {};          // 애니메이션용 메타(관절 기본 자세 등)
  const parts = [];          // 진단용: 부품별 삼각형 수
  function bone(name, parent, pos, rot){
    const b = { name, parent, pos:new THREE.Vector3(...pos), quat:new THREE.Quaternion() };
    if(rot) b.quat.setFromEuler(new THREE.Euler(...rot));
    const local = new THREE.Matrix4().compose(b.pos, b.quat, new THREE.Vector3(1, 1, 1));
    b.world = parent ? bones.get(parent).world.clone().multiply(local) : local;
    b.inv = b.world.clone().invert();
    bones.set(name, b);
    return b;
  }
  /* 트랜스폼 행렬 만들기: t={p:[x,y,z], r:[x,y,z], s:[x,y,z]|number, q:Quaternion} */
  function M(t){
    t = t || {};
    const s = t.s === undefined ? [1, 1, 1] : (typeof t.s === 'number' ? [t.s, t.s, t.s] : t.s);
    const q = t.q ? t.q.clone() : new THREE.Quaternion().setFromEuler(new THREE.Euler(...(t.r || [0, 0, 0]), t.order || 'XYZ'));
    return new THREE.Matrix4().compose(new THREE.Vector3(...(t.p || [0, 0, 0])), q, new THREE.Vector3(...s));
  }
  /* 디자인 좌표(발바닥 y=0)의 부품을 해당 관절에 붙인다 */
  function add(boneName, mat, geo, t, col, fn){
    const m = t && t.isMatrix4 ? t : M(t);
    const key = boneName + '|' + mat;
    if(!items.has(key)) items.set(key, []);
    items.get(key).push({ geo, m:bones.get(boneName).inv.clone().multiply(m), world:m, col:new THREE.Color(col), fn });
    const tri = (geo.index ? geo.index.count : geo.attributes.position.count) / 3;
    parts.push({ bone:boneName, mat, type:geo.type, tris:tri, line:(new Error().stack.split('\n')[2] || '').replace(/.*char3d\.js:/, '').replace(/\)$/, '') });
  }
  function build(){
    const bins = [];
    const v = new THREE.Vector3(), w = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Color();
    const nm = new THREE.Matrix3(), nmw = new THREE.Matrix3();
    let tris = 0;
    for(const [key, list] of items){
      const [boneName, mat] = key.split('|');
      let nv = 0, ni = 0;
      for(const it of list){ nv += it.geo.attributes.position.count; ni += it.geo.index ? it.geo.index.count : it.geo.attributes.position.count; }
      const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
      const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
      let vo = 0, io = 0;
      for(const it of list){
        const g = it.geo, P = g.attributes.position, Nn = g.attributes.normal;
        nm.getNormalMatrix(it.m); nmw.getNormalMatrix(it.world);
        for(let i = 0; i < P.count; i++){
          v.fromBufferAttribute(P, i); w.copy(v).applyMatrix4(it.world); v.applyMatrix4(it.m);
          n.fromBufferAttribute(Nn, i);
          c.copy(it.col);
          if(it.fn){ const nw = n.clone().applyMatrix3(nmw).normalize(); it.fn(c, w, nw); }
          n.applyMatrix3(nm).normalize();
          const o = (vo + i) * 3;
          pos[o] = v.x; pos[o + 1] = v.y; pos[o + 2] = v.z;
          nor[o] = n.x; nor[o + 1] = n.y; nor[o + 2] = n.z;
          col[o] = c.r; col[o + 1] = c.g; col[o + 2] = c.b;
        }
        const flip = it.m.determinant() < 0;
        if(g.index){
          const I = g.index.array;
          for(let i = 0; i < I.length; i += 3){
            idx[io++] = I[i] + vo;
            idx[io++] = (flip ? I[i + 2] : I[i + 1]) + vo;
            idx[io++] = (flip ? I[i + 1] : I[i + 2]) + vo;
          }
        } else {
          for(let i = 0; i < P.count; i += 3){
            idx[io++] = vo + i; idx[io++] = vo + (flip ? i + 2 : i + 1); idx[io++] = vo + (flip ? i + 1 : i + 2);
          }
        }
        vo += P.count;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.setIndex(new THREE.BufferAttribute(idx, 1));
      geo.computeBoundingSphere();
      tris += ni / 3;
      bins.push({ bone:boneName, mat, geo });
    }
    /* 원재료 지오메트리 정리(합친 뒤엔 필요 없다) */
    const seen = new Set();
    for(const list of items.values()) for(const it of list) if(!seen.has(it.geo)){ seen.add(it.geo); it.geo.dispose(); }
    const boneSpec = [...bones.values()].map(b => ({ name:b.name, parent:b.parent, pos:b.pos.toArray(), quat:b.quat.toArray() }));
    return { bones:boneSpec, bins, tris, extra, parts };
  }
  return { bone, add, M, build, extra, bones };
}

/* ── 색 도우미 ── */
function shadeFn(THREE, y0, y1, k = 0.2){
  /* 아래로 갈수록 살짝 어둡게(가짜 AO) */
  return (c, p) => { const t = Math.min(1, Math.max(0, (p.y - y0) / (y1 - y0))); c.multiplyScalar(1 - k * (1 - t) * (1 - t)); };
}

/* ============================================================
   얼굴 부품(사람·버디 공통)
   eye(B, bone, center(Vector3), quat, w, h, opt)
   ============================================================ */
function addEye(THREE, G, B, boneName, center, quat, w, h, o = {}){
  /* 눈마다 깜빡임용 관절 */
  const bname = o.name;
  const e = new THREE.Euler().setFromQuaternion(quat);
  B.bone(bname, o.parent, o.parentLocal ? o.parentLocal : center.toArray(), [e.x, e.y, e.z]);
  const Q = quat;
  const at = (x, y, z, sx, sy, sz, rz = 0) => {
    const off = new THREE.Vector3(x, y, z).applyQuaternion(Q).add(center);
    const q = Q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, rz)));
    return B.M({ p:off.toArray(), q, s:[sx, sy, sz] });
  };
  const d = h * 0.34;
  if(o.sclera !== false) B.add(bname, 'matte', G.dome(14, 4, 0.9), at(0, 0, 0, w, h, d * 0.9), o.white || '#fbfaf7');
  const iw = w * (o.irisScale || 0.78), ih = h * (o.irisScale || 0.78);
  const irisY = o.irisY === undefined ? -0.06 * h : o.irisY;
  B.add(bname, 'gloss', G.dome(12, 4, 0.9), at(0, irisY, d * 0.08, iw, ih, d * 0.95), o.iris || '#2c2a36');
  if(o.pupil !== false) B.add(bname, 'gloss', G.dome(10, 3, 0.9), at(0, irisY - ih * 0.04, d * 0.36, iw * 0.6, ih * 0.62, d * 0.9), o.pupil || '#15131c');
  /* 반짝이 두 점 */
  B.add(bname, 'glow', G.dome(8, 2, 1.1), at(iw * 0.3 * (o.hiSide || 1), irisY + ih * 0.3, d * 0.64, iw * 0.32, ih * 0.3, d * 0.6), '#ffffff');
  B.add(bname, 'glow', G.dome(6, 2, 1.1), at(-iw * 0.28 * (o.hiSide || 1), irisY - ih * 0.3, d * 0.5, iw * 0.13, ih * 0.12, d * 0.5), '#ffffff');
  if(o.lash){
    const s = o.lash; // 바깥쪽(+1 오른쪽 / -1 왼쪽) 속눈썹
    B.add(bname, 'gloss', G.tube([[0, h * 0.95, 0], [s * w * 0.6, h * 0.85, 0], [s * w * 1.12, h * 0.98, 0]], { r:(t) => w * 0.13 * (1 - 0.7 * t), radial:5, density:24, capRings:2 }),
      B.M({ p:center.toArray(), q:Q }), '#1d1720');
  }
}

/* 표면 위의 점 → 위치+방향 */
function surfQuat(THREE, nrm, towardZ = 0){
  const n = nrm.clone(); if(towardZ) n.lerp(new THREE.Vector3(0, 0, 1), towardZ).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
}

/* ============================================================
   사람 캐릭터
   디자인 좌표: 발바닥 y=0, 머리 반지름 R=0.46, 키 ≈ 2.45 (≈2.7등신)
   ============================================================ */
function buildHuman(THREE, kind, opts){
  const G = makeGeo(THREE), B = makeBuilder(THREE);
  const pal = Object.assign({}, PALETTES[kind], opts.palette || {});
  const adult = kind === 'elder' || kind === 'doc';
  const legLen = adult ? 0.66 : 0.52;       // 엉덩이 관절 높이 - 발목
  const hipY = legLen + 0.12;
  const torsoH = adult ? 0.78 : 0.66;
  const shoulderY = hipY + torsoH - 0.06;
  const neckY = hipY + torsoH;
  const R = adult ? 0.43 : 0.46;
  const headY = neckY + R * 0.86;           // 머리 중심
  const headC = new THREE.Vector3(0, headY, 0.02);
  const hipX = 0.12, shX = adult ? 0.3 : 0.27;
  const armR = 0.07, upperL = adult ? 0.3 : 0.26, foreL = adult ? 0.27 : 0.23;
  const zf = 0.8;                            // 몸통 앞뒤 납작함

  const propSide = (kind === 'girl' || kind === 'elder') && opts.props !== false ? 'R' : null;
  B.bone('hips', null, [0, hipY, 0]);
  B.bone('torso', 'hips', [0, 0.06, 0]);
  B.bone('head', 'torso', [0, neckY - hipY - 0.06, 0]);
  for(const s of [1, -1]){
    const L = s > 0 ? 'L' : 'R';
    B.bone('leg' + L, 'hips', [s * hipX, 0, 0]);
    const hold = propSide === L;   // 소품 든 팔은 "들고 있는 자세"가 기본(쉬는) 자세
    B.bone('arm' + L, 'torso', [s * shX, shoulderY - hipY - 0.06, 0], [hold ? -0.22 : 0, 0, s * (hold ? 0.1 : 0.16)]);
    B.bone('fore' + L, 'arm' + L, [0, -upperL, 0], [hold ? -0.75 : 0, 0, 0]);
  }
  const shade = shadeFn(THREE, 0, hipY + torsoH, 0.28);

  /* ── 다리·신발 ── */
  const robeLen = { boy:0, girl:0.4, elder:0.92, doc:0.62 }[kind];
  for(const s of [1, -1]){
    const L = 'leg' + (s > 0 ? 'L' : 'R'), x = s * hipX;
    const legCol = kind === 'boy' ? pal.skin : pal.leg;
    const legMat = kind === 'boy' ? 'skin' : 'matte';
    B.add(L, legMat, G.tube([[x, hipY - 0.02, 0], [x, 0.16, 0.0]], { r:(t) => 0.072 - 0.014 * t, radial:10 }), null, legCol, shade);
    if(kind === 'boy'){
      /* 반바지 + 흰 양말 */
      B.add(L, 'matte', G.tube([[x, hipY + 0.04, 0], [x * 1.1, hipY - 0.2, 0]], { r:(t) => 0.102 + 0.01 * t, radial:12 }), null, pal.outfit2, shade);
      B.add(L, 'metal', G.torus(0.108, 0.018, 4, 17), { p:[x * 1.1, hipY - 0.22, 0], r:[Math.PI / 2, 0, 0] }, pal.trim);
      B.add(L, 'matte', G.tube([[x, 0.3, 0], [x, 0.15, 0.0]], { r:0.074, radial:10, capRings:2 }), null, pal.sock);
      B.add(L, 'matte', G.torus(0.074, 0.024, 4, 14), { p:[x, 0.3, 0], r:[Math.PI / 2, 0, 0] }, pal.sock);
    }
    if(kind === 'girl'){
      B.add(L, 'metal', G.torus(0.094, 0.02, 4, 15), { p:[x, 0.3, 0.0], r:[Math.PI / 2, 0, 0] }, pal.trim);
      B.add(L, 'gloss', G.tube([[x, 0.3, 0], [x, 0.14, 0]], { r:0.094, radial:12, capRings:2 }), null, pal.shoe);
    }
    /* 신발: 둥근 앞코 + 밑창 */
    B.add(L, 'gloss', G.sphere(12, 8), { p:[x * 1.05, 0.1, 0.06], s:[0.12, 0.1, 0.19] }, pal.shoe, shadeFn(THREE, 0, 0.2, 0.3));
    B.add(L, 'matte', G.cyl(1, 1, 1, 20), { p:[x * 1.05, 0.02, 0.06], s:[0.118, 0.035, 0.186] }, pal.sole);
    if(kind === 'boy') B.add(L, 'metal', G.sphere(6, 4), { p:[x * 1.05 + s * 0.06, 0.13, 0.13], s:0.028 }, pal.trim);
    if(kind === 'girl') B.add(L, 'metal', G.star(1, 0.45, 0.3, 0.12), { p:[x * 1.05, 0.22, 0.1], s:0.04 }, pal.trim);
  }

  /* ── 몸통(선반 회전체) ── */
  let prof;
  if(kind === 'boy') prof = [[0, hipY - 0.12], [0.2, hipY - 0.12], [0.255, hipY - 0.08], [0.262, hipY + 0.1], [0.24, hipY + 0.3], [0.262, hipY + 0.48], [0.25, neckY - 0.1], [0.19, neckY - 0.02], [0.08, neckY + 0.02], [0, neckY + 0.02]];
  if(kind === 'girl') prof = [[0, 0.46], [0.3, 0.4], [0.34, 0.42], [0.31, 0.58], [0.25, hipY + 0.16], [0.225, hipY + 0.3], [0.245, hipY + 0.46], [0.235, neckY - 0.1], [0.18, neckY - 0.02], [0.08, neckY + 0.02], [0, neckY + 0.02]];
  if(kind === 'elder') prof = [[0, 0.12], [0.38, 0.1], [0.42, 0.13], [0.39, 0.3], [0.33, 0.6], [0.3, hipY + 0.2], [0.3, hipY + 0.45], [0.31, neckY - 0.14], [0.26, neckY - 0.04], [0.1, neckY + 0.02], [0, neckY + 0.02]];
  if(kind === 'doc') prof = [[0, 0.46], [0.255, 0.42], [0.285, 0.45], [0.275, 0.62], [0.262, hipY + 0.1], [0.25, hipY + 0.3], [0.27, hipY + 0.52], [0.262, neckY - 0.12], [0.2, neckY - 0.03], [0.08, neckY + 0.02], [0, neckY + 0.02]];
  const robeBone = kind === 'boy' ? 'torso' : 'hips';
  if(kind === 'boy'){
    B.add('torso', 'matte', G.lathe(prof, 20), { s:[1, 1, zf] }, pal.outfit, shade);
  } else {
    /* 긴 옷: 허리 아래(치마·로브)는 hips 에, 위는 torso 에 — 걸을 때 따로 흔들린다 */
    const cut = hipY + 0.2;
    const lower = prof.filter(p => p[1] <= cut + 0.01); lower.push([prof.find(p => p[1] > cut)[0], cut + 0.02], [0, cut + 0.02]);
    const upper = [[0, cut - 0.02], [lower[lower.length - 2][0] * 0.99, cut - 0.02], ...prof.filter(p => p[1] > cut)];
    B.add('hips', 'matte', G.lathe(lower, 22), { s:[1, 1, zf] }, pal.outfit, shade);
    B.add('torso', 'matte', G.lathe(upper, 20), { s:[1, 1, zf] }, pal.outfit, shade);
    /* 밑단 금색 테 */
    const hem = prof[2];
    B.add('hips', 'metal', G.torus(hem[0] * 0.985, 0.022, 4, 28), { p:[0, hem[1] - 0.005, 0], r:[Math.PI / 2, 0, 0], s:[1, zf, 1] }, pal.trim);
  }
  if(kind === 'boy'){
    B.add('torso', 'metal', G.torus(0.258, 0.02, 4, 25), { p:[0, hipY - 0.1, 0], r:[Math.PI / 2, 0, 0], s:[1, zf, 1] }, pal.trim);
  }
  /* 앞자락: 여밈선(금색) 과 안쪽 셔츠 V */
  const chestZ = (r) => r * zf;
  if(kind === 'boy' || kind === 'girl'){
    /* V 넥 셔츠 + 세운 후드 */
    B.add('torso', 'matte', G.sphere(10, 6), { p:[0, neckY - 0.1, chestZ(0.2)], s:[0.1, 0.1, 0.05] }, pal.shirt);
    B.add('torso', 'matte', G.torus(0.2, 0.07, 8, 18), { p:[0, neckY - 0.02, -0.04], r:[Math.PI / 2 + 0.45, 0, 0], s:[1, 0.85, 1] }, pal.outfit2, null);
    B.add('torso', 'metal', G.tube([[-0.16, neckY - 0.04, 0.13], [-0.03, neckY - 0.17, 0.215], [0, neckY - 0.2, 0.21]], { r:0.017, radial:6, density:8 }), null, pal.trim);
    B.add('torso', 'metal', G.tube([[0.16, neckY - 0.04, 0.13], [0.03, neckY - 0.17, 0.215], [0, neckY - 0.2, 0.21]], { r:0.017, radial:6, density:8 }), null, pal.trim);
    /* 가슴 별 배지 */
    B.add('torso', 'metal', G.star(1, 0.46, 0.35, 0.16), { p:[kind === 'boy' ? 0 : 0, neckY - 0.25, chestZ(0.255)], s:0.062, r:[-0.1, 0, 0] }, pal.trim);
    /* 벨트 + 버클 */
    const by = kind === 'boy' ? hipY + 0.1 : hipY + 0.28;
    const br = kind === 'boy' ? 0.255 : 0.232;
    B.add('torso', 'matte', G.torus(br, 0.03, 4, 25), { p:[0, by, 0], r:[Math.PI / 2, 0, 0], s:[1, zf, 1.1] }, pal.leather);
    B.add('torso', 'metal', G.roundBox(1, 0.8, 0.3, 0.25), { p:[0, by, chestZ(br) + 0.02], s:0.085 }, pal.trim);
  }
  if(kind === 'girl'){
    /* 코트 안쪽 라벤더 원피스 앞판 */
    B.add('hips', 'matte', G.tube([[0, 0.45, 0.285], [0, 0.6, 0.258], [0, hipY + 0.16, 0.21]], { r:(t) => 0.085 - 0.03 * t, zs:0.35, radial:8, capRings:2 }), null, pal.shirt, shade);
    for(const s of [1, -1]) B.add('hips', 'metal', G.tube([[s * 0.085, 0.43, 0.29], [s * 0.07, 0.6, 0.262], [s * 0.055, hipY + 0.18, 0.21]], { r:0.016, radial:6, density:8 }), null, pal.trim);
  }
  if(kind === 'boy'){
    /* 가방끈(오른어깨→왼허리) + 가방 */
    B.add('torso', 'matte', G.tube([[-0.2, neckY - 0.04, 0.12], [-0.05, neckY - 0.25, chestZ(0.265)], [0.14, hipY + 0.25, chestZ(0.25)], [0.27, hipY + 0.08, 0.08]], { r:0.022, zs:0.45, radial:8 }), null, pal.leather);
    B.add('torso', 'matte', G.roundBox(1, 0.8, 0.5, 0.2), { p:[0.3, hipY - 0.02, 0.05], r:[0, 0.9, 0], s:0.16 }, pal.leather, shadeFn(THREE, hipY - 0.1, hipY + 0.06, 0.25));
    B.add('torso', 'metal', G.sphere(8, 6), { p:[0.37, hipY + 0.02, 0.11], s:0.022 }, pal.trim);
  }
  if(kind === 'elder'){
    /* 가운데 크림색 앞판 + 금색 여밈 두 줄 + 벨트·보석 */
    B.add('hips', 'matte', G.tube([[0, 0.14, 0.34], [0, 0.5, 0.265], [0, hipY + 0.18, 0.24]], { r:(t) => 0.1 - 0.03 * t, zs:0.35, radial:8, capRings:2 }), null, pal.shirt, shade);
    B.add('torso', 'matte', G.tube([[0, hipY + 0.12, 0.243], [0, neckY - 0.18, 0.245]], { r:0.075, zs:0.35, radial:8, capRings:2 }), null, pal.shirt);
    for(const s of [1, -1]){
      B.add('hips', 'metal', G.tube([[s * 0.1, 0.14, 0.33], [s * 0.085, 0.5, 0.262], [s * 0.075, hipY + 0.2, 0.24]], { r:0.018, radial:6, density:8 }), null, pal.trim);
      B.add('torso', 'metal', G.tube([[s * 0.075, hipY + 0.18, 0.24], [s * 0.16, neckY - 0.04, 0.16]], { r:0.018, radial:6, density:8 }), null, pal.trim);
    }
    B.add('torso', 'matte', G.torus(0.3, 0.035, 4, 25), { p:[0, hipY + 0.2, 0], r:[Math.PI / 2, 0, 0], s:[1, zf, 1.2] }, pal.leather);
    B.add('torso', 'metal', G.torus(0.05, 0.016, 4, 14), { p:[0, hipY + 0.2, chestZ(0.3) + 0.01] }, pal.trim);
    B.add('torso', 'glow', G.sphere(12, 10), { p:[0, hipY + 0.2, chestZ(0.3) + 0.015], s:[0.04, 0.04, 0.025] }, pal.gem);
    /* 허리 두루마리 주머니 */
    B.add('torso', 'matte', G.roundBox(1, 0.9, 0.5, 0.22), { p:[-0.28, hipY + 0.06, 0.1], r:[0, -0.8, 0], s:0.14 }, pal.leather);
  }
  if(kind === 'doc'){
    /* 조끼 앞판 + 셔츠 칼라 + 넥타이 + π 메달 */
    B.add('torso', 'matte', G.tube([[0, hipY + 0.06, 0.2], [0, hipY + 0.3, 0.205], [0, neckY - 0.14, 0.2]], { r:(t) => 0.155 - 0.085 * t, zs:0.4, radial:10, capRings:2 }), null, pal.leather, shade);
    for(const s of [1, -1]){
      B.add('torso', 'matte', G.tube([[s * 0.02, neckY - 0.02, 0.17], [s * 0.1, neckY - 0.1, 0.19]], { r:0.03, zs:0.4, radial:8 }), null, pal.shirt);
      B.add('torso', 'metal', G.tube([[s * 0.17, neckY - 0.03, 0.13], [s * 0.125, hipY + 0.3, 0.215], [s * 0.15, hipY - 0.1, 0.235]], { r:0.017, radial:6, density:8 }), null, pal.trim);
    }
    B.add('torso', 'gloss', G.tube([[0, neckY - 0.08, 0.2], [0, neckY - 0.3, 0.228]], { r:(t) => 0.022 + 0.02 * t, zs:0.4, radial:10 }), null, pal.tie);
    B.add('torso', 'metal', G.tube([[-0.1, neckY - 0.05, 0.18], [0, neckY - 0.24, 0.235], [0.1, neckY - 0.05, 0.18]], { r:0.007, radial:6, density:8 }), null, pal.trim);
    B.add('torso', 'metal', G.cyl(1, 1, 1, 22), { p:[0.0, neckY - 0.29, 0.25], r:[Math.PI / 2 - 0.1, 0, 0], s:[0.055, 0.015, 0.055] }, pal.trim);
    /* 단추 */
    for(let i = 0; i < 3; i++) B.add('torso', 'metal', G.sphere(8, 6), { p:[0.05, hipY + 0.1 + i * 0.11, 0.225], s:0.014 }, pal.trim);
  }
  /* 목 */
  B.add('torso', 'skin', G.cyl(0.085, 0.095, 0.16, 14), { p:[0, neckY + 0.02, 0] }, pal.skin);

  /* ── 팔 ── (소매 + 금색 소맷단 + 손) */
  const wide = kind === 'elder' || kind === 'doc' || kind === 'girl';
  for(const s of [1, -1]){
    const A = 'arm' + (s > 0 ? 'L' : 'R'), F = 'fore' + (s > 0 ? 'L' : 'R');
    const aw = B.bones.get(A).world, fw = B.bones.get(F).world;
    const P = (bw, x, y, z) => new THREE.Vector3(x, y, z).applyMatrix4(bw).toArray();
    B.add(A, 'matte', G.sphere(10, 7), { p:P(aw, 0, -0.03, 0), s:[0.092, 0.092, 0.09] }, pal.outfit);
    B.add(A, 'matte', G.tube([P(aw, 0, 0, 0), P(aw, 0, -upperL, 0)], { r:(t) => 0.088 - 0.006 * t, radial:10, capRings:3 }), null, pal.outfit);
    if(wide){
      /* 넓은 소매: 아래로 퍼지는 종 모양 */
      const bell = G.lathe([[0.001, 0.0], [0.075, 0.0], [0.09, -0.12], [0.13, -foreL + 0.02], [0.125, -foreL - 0.02], [0.09, -foreL + 0.04], [0.001, -foreL + 0.06]], 14);
      B.add(F, 'matte', bell, B.M({}).premultiply(fw), pal.outfit);
      B.add(F, 'metal', G.torus(0.128, 0.02, 4, 17), new THREE.Matrix4().compose(new THREE.Vector3(0, -foreL, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), new THREE.Vector3(1, 1, 1)).premultiply(fw), pal.trim);
    } else {
      B.add(F, 'matte', G.tube([P(fw, 0, 0.02, 0), P(fw, 0, -foreL + 0.02, 0)], { r:(t) => 0.082 + 0.006 * t, radial:10, capRings:3 }), null, pal.outfit);
      B.add(F, 'metal', G.torus(0.086, 0.02, 4, 15), new THREE.Matrix4().compose(new THREE.Vector3(0, -foreL + 0.02, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), new THREE.Vector3(1, 1, 1)).premultiply(fw), pal.trim);
    }
    /* 손: 둥근 주먹 + 엄지 */
    const hand = new THREE.Matrix4().compose(new THREE.Vector3(0, -foreL - 0.06, 0.005), new THREE.Quaternion(), new THREE.Vector3(0.068, 0.078, 0.062)).premultiply(fw);
    B.add(F, 'skin', G.sphere(10, 7), hand, pal.skin);
    B.add(F, 'skin', G.sphere(6, 5), new THREE.Matrix4().compose(new THREE.Vector3(-s * 0.02, -foreL - 0.035, 0.05), new THREE.Quaternion(), new THREE.Vector3(0.026, 0.034, 0.026)).premultiply(fw), pal.skin);
  }
  B.extra.handLocal = [0, -foreL - 0.07, 0.01];

  /* ── 소품 ── (쥔 손의 월드 위치에 똑바로 세운다) */
  if(propSide){
    const fw = B.bones.get('foreR').world;
    const hand = new THREE.Vector3(0, -foreL - 0.06, 0.005).applyMatrix4(fw);
    const hx = hand.x, hy = hand.y, hz = hand.z;
    if(kind === 'girl'){
      /* 별 지팡이 */
      B.add('foreR', 'gloss', G.tube([[hx, hy - 0.1, hz], [hx - 0.02, hy + 0.3, hz + 0.03]], { r:0.017, radial:6, density:8 }), null, pal.outfit);
      B.add('foreR', 'metal', G.sphere(10, 8), { p:[hx, hy - 0.11, hz], s:0.027 }, pal.trim);
      B.add('foreR', 'metal', G.star(1, 0.48, 0.42, 0.2), { p:[hx - 0.02, hy + 0.37, hz + 0.03], s:0.09 }, pal.trim);
      B.add('foreR', 'glow', G.star(1, 0.48, 0.2, 0.1), { p:[hx - 0.02, hy + 0.37, hz + 0.075], s:0.045 }, '#f7dcff');
    } else {
      /* 나무 지팡이 + 빛나는 0 */
      const top = neckY + 0.5, bot = 0.02;
      const pts = []; for(let i = 0; i <= 8; i++){ const t = i / 8; pts.push([hx + 0.012 * Math.sin(t * 9), bot + (top - bot) * t, hz + 0.012 * Math.cos(t * 7)]); }
      B.add('foreR', 'satin', G.tube(pts, { r:(t) => 0.032 - 0.008 * t, radial:7, density:5 }), null, pal.wood);
      B.add('foreR', 'metal', G.torus(0.04, 0.014, 4, 12), { p:[hx, top - 0.02, hz], r:[Math.PI / 2, 0, 0] }, pal.trim);
      B.add('foreR', 'metal', G.tube([[hx - 0.08, top + 0.05, hz], [hx, top - 0.02, hz], [hx + 0.08, top + 0.05, hz]], { r:0.015, radial:6, density:8 }), null, pal.trim);
      B.add('foreR', 'glow', G.torus(0.095, 0.035, 8, 20), { p:[hx, top + 0.17, hz], s:[0.8, 1.15, 1] }, pal.gem);
    }
  }
  /* ── 머리 ── */
  const skinBlush = new THREE.Color('#f39a93');
  const blushFn = (c, p) => {
    const lx = p.x, ly = p.y - (headY - 0.1), lz = p.z;
    for(const s of [1, -1]){
      const d2 = ((lx - s * 0.25) ** 2) / 0.012 + (ly ** 2) / 0.006;
      if(lz > 0.2) c.lerp(skinBlush, 0.55 * Math.exp(-d2));
    }
  };
  B.add('head', 'skin', G.sphere(22, 16), { p:headC.toArray(), s:[R * 1.03, R * 0.97, R * 0.96] }, pal.skin, blushFn);
  if(kind !== 'girl') for(const s of [1, -1]){
    B.add('head', 'skin', G.sphere(10, 6), { p:[s * R * 1.0, headY - 0.03, 0.0], s:[0.07, 0.1, 0.06] }, pal.skin);
  }
  /* 얼굴 표면 좌표: (x,y) 오프셋 → 머리 타원체 위의 점·법선 */
  const onHead = (x, y, lift = 0) => {
    const ax = R * 1.03, ay = R * 0.97, az = R * 0.96;
    const u = x / ax, v = y / ay;
    const w = Math.sqrt(Math.max(0.02, 1 - u * u - v * v));
    const p = new THREE.Vector3(x, headY + y, headC.z + w * az);
    const n = new THREE.Vector3(u / ax, v / ay, w / az).normalize();
    p.addScaledVector(n, lift);
    return { p, n };
  };
  /* 눈 */
  const eyeX = adult ? 0.16 : 0.17, eyeY = adult ? -0.03 : -0.04;
  const eyeW = adult ? 0.08 : 0.1, eyeH = adult ? 0.092 : 0.128;
  for(const s of [1, -1]){
    const { p, n } = onHead(s * eyeX, eyeY, -0.012);
    const q = surfQuat(THREE, n, 0.35);
    const local = p.clone().applyMatrix4(B.bones.get('head').inv).toArray();
    addEye(THREE, G, B, 'head', p, q, eyeW, eyeH, { name:'eye' + (s > 0 ? 'L' : 'R'), parent:'head', parentLocal:local,
      iris:pal.iris, pupil:'#171320', lash:kind === 'girl' ? s : 0, hiSide:1, irisScale:adult ? 0.86 : 0.86 });
    /* 눈썹 */
    const bY = eyeY + eyeH + (kind === 'elder' ? 0.06 : 0.05);
    const b0 = onHead(s * (eyeX - 0.07), bY - 0.005, 0.004), b1 = onHead(s * (eyeX + 0.02), bY + 0.018, 0.004), b2 = onHead(s * (eyeX + 0.08), bY - 0.002, 0.004);
    const browCol = kind === 'elder' ? '#e9e6df' : new THREE.Color(pal.hair).multiplyScalar(0.8).getStyle();
    const bw = kind === 'elder' ? 0.03 : 0.017;
    B.add('head', kind === 'elder' ? 'satin' : 'satin', G.tube([b0.p.toArray(), b1.p.toArray(), b2.p.toArray()], { r:(t) => bw * (1 - 0.45 * t), radial:6, density:30, capRings:2 }), null, browCol);
  }
  /* 코 */
  { const { p } = onHead(0, -0.1, -0.01); B.add('head', 'skin', G.sphere(12, 8), { p:p.toArray(), s:[0.034, 0.028, 0.03] }, pal.skin); }
  /* 입 */
  if(kind !== 'elder'){
    const { p, n } = onHead(0, -0.2, -0.006);
    const q = surfQuat(THREE, n, 0.4);
    const mw = kind === 'doc' ? 0.05 : 0.058;
    B.add('head', 'gloss', G.mouthD(1, 0.85, 0.2), B.M({ p:p.toArray(), q, s:[mw, mw, 0.05] }), pal.mouth);
    const tq = p.clone().add(new THREE.Vector3(0, -0.03, 0.006).applyQuaternion(q));
    B.add('head', 'matte', G.sphere(10, 6), B.M({ p:tq.toArray(), q, s:[0.03, 0.014, 0.01] }), '#ef7d86');
  }

  /* ── 머리카락 ──
     hairShell: 머리 타원체를 덮는 조각 껍질. 격자의 첫 줄이 곧 헤어라인이라 앞머리 끝(톱니·가르마·물결)이
     깔끔하게 떨어진다. line(a) = 방위각 a°(0=정면, +=캐릭터 왼쪽)에서 헤어라인 고도°(0=눈높이),
     thick(a, e, v) = 두께(월드 단위, v = 헤어라인 0 → 정수리 1). slock = 표면을 따라 눕는 납작한 뭉치. */
  const H = pal.hair, hairMat = 'satin';
  const hairShade = (c, p) => { const t = Math.min(1, Math.max(0, (p.y - (headY - R)) / (2 * R))); c.multiplyScalar(0.68 + 0.38 * t); };
  const EX = R * 1.03, EY = R * 0.97, EZ = R * 0.96;
  const surf = (azD, elD, off = 0) => {
    const a = azD * D2R, e = elD * D2R, k = 1.05 + off;
    return [headC.x + Math.sin(a) * Math.cos(e) * EX * k, headY + Math.sin(e) * EY * k, headC.z + Math.cos(a) * Math.cos(e) * EZ * k];
  };
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function hairShell(line, thick, nA = 52, nV = 10){
    const pos = [], idx = [];
    const P = (aD, eD, k) => { const a = aD * D2R, e = eD * D2R; return [Math.sin(a) * Math.cos(e) * EX * k, Math.sin(e) * EY * k, Math.cos(a) * Math.cos(e) * EZ * k]; };
    for(let i = 0; i <= nV + 1; i++){
      for(let j = 0; j < nA; j++){
        const a = j / nA * 360 - 180, L = line(a);
        let e, k;
        if(i === 0){ e = L - 1.5; k = 0.975; }
        else { const v = (i - 1) / nV; e = L + (90 - L) * (1 - (1 - v) * (1 - v)); const lip = 0.45 + 0.55 * smooth(0, 0.3, v); k = 1 + thick(a, e, v) * lip / R; if(i === 1) e = L; }
        pos.push(...P(a, e, k));
      }
    }
    const rows = nV + 2;
    for(let i = 0; i < rows - 1; i++) for(let j = 0; j < nA; j++){
      const j2 = (j + 1) % nA, a = i * nA + j, b = i * nA + j2, c = (i + 1) * nA + j, d = (i + 1) * nA + j2;
      idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx); g.computeVertexNormals();
    /* 정수리 극점: 법선을 위로 */
    const Nn = g.attributes.normal; for(let j = 0; j < nA; j++) Nn.setXYZ((rows - 1) * nA + j, 0, 1, 0);
    B.add('head', hairMat, g, { p:headC.toArray() }, H, hairShade);
  }
  const slock = (path, r0, o = {}) => {
    const pts = path.map(q => surf(q[0], q[1], q[2] || 0));
    const m = pts[Math.floor((pts.length - 1) / 2)];
    const up = o.up || [m[0] - headC.x, m[1] - headY, m[2] - headC.z];
    const taper = o.taper === undefined ? 0.8 : o.taper, pw = o.pow || 1.5;
    B.add('head', hairMat, G.tube(pts, { r:(t) => r0 * (1 - taper * Math.pow(t, pw)), zs:o.zs || 0.55, up, radial:8, density:11, capRings:2 }), null, o.col || H, hairShade);
  };
  const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t));
  /* 옆·뒤 헤어라인 공통: 정면 f → 귀 위 s → 목덜미 b */
  const sideBack = (fa, f, s, b, f0 = 55, s0 = 105) => fa <= f0 ? f : fa <= s0 ? lerp(f, s, (fa - f0) / (s0 - f0)) : lerp(s, b, (fa - s0) / (180 - s0));
  const ridges = (a, n, amt) => 1 + amt * Math.cos(a * D2R * n);

  if(kind === 'boy'){
    hairShell(
      (a) => { const fa = Math.abs(a); let L = sideBack(fa, 22, -12, -40);
        const f = ((a + 200) / 24) % 1, w = 1 - smooth(45, 72, fa);
        return L + w * (16 - 17 * Math.pow(f, 1.8)); },
      (a, e, v) => (0.08 + 0.1 * Math.sin(Math.PI * Math.min(1, v * 1.4)) + 0.03 * smooth(60, 85, e) * Math.max(0, Math.cos((a - 150) * D2R))) * ridges(a + e * 0.6, 17, 0.12));
    /* 정수리 삐침 두 가닥 */
    slock([[160, 76, 0.1], [180, 88, 0.2], [20, 74, 0.34]], 0.07, { taper:0.9, zs:0.7 });
    slock([[-150, 72, 0.08], [-170, 82, 0.18], [-110, 80, 0.3]], 0.06, { taper:0.9, zs:0.7 });
  }
  if(kind === 'girl'){
    hairShell(
      (a) => { const fa = Math.abs(a); let L = sideBack(fa, 27, -14, -32, 50, 100);
        const w = 1 - smooth(40, 62, fa);
        return L + w * (26 * Math.exp(-((a / 9) ** 2)) + 6 * Math.abs(Math.sin(fa * D2R * 8))); },
      (a, e, v) => (0.055 + 0.06 * Math.sin(Math.PI * Math.min(1, v * 1.3))) * ridges(Math.abs(a) - e * 0.4, 15, 0.1));
    for(const s of [1, -1]){
      /* 얼굴 옆으로 내려오는 머리 */
      slock([[s * 64, 30, 0.04], [s * 76, 0, 0.1], [s * 78, -30, 0.12]], 0.1, { taper:0.6 });
      /* 양갈래: 높은 옆머리에서 늘어져 끝이 안쪽으로 말린다 */
      const tw = [[s * 0.34, 0.32, -0.16], [s * 0.5, 0.28, -0.22], [s * 0.6, 0.08, -0.22], [s * 0.6, -0.2, -0.18], [s * 0.53, -0.42, -0.1], [s * 0.44, -0.44, -0.04]];
      B.add('head', hairMat, G.tube(tw.map(p => [p[0], p[1] + headY, p[2]]), { r:(t) => 0.03 + 0.13 * Math.sin(Math.PI * Math.min(1, 0.1 + t)), radial:10, density:10, zs:0.8, capRings:3 }), null, H, hairShade);
      const bx = s * 0.36, by = headY + 0.33, bz = -0.14;
      for(const k of [1, -1]) B.add('head', 'satin', G.sphere(10, 6), { p:[bx + k * 0.075, by + 0.03, bz], r:[0, 0, k * 0.55], s:[0.08, 0.05, 0.045] }, pal.bow);
      B.add('head', 'satin', G.sphere(10, 6), { p:[bx, by + 0.01, bz + 0.01], s:0.034 }, new THREE.Color(pal.bow).multiplyScalar(0.8));
    }
  }
  if(kind === 'elder'){
    hairShell(
      (a) => sideBack(Math.abs(a), 46, -8, -30, 40, 100),
      (a, e, v) => (0.045 + 0.05 * Math.sin(Math.PI * Math.min(1, v * 1.2))) * ridges(a, 18, 0.16), 54, 9);
    for(const s of [1, -1]){
      B.add('head', hairMat, G.sphere(12, 8), { p:[s * 0.43, headY + 0.02, -0.06], s:[0.14, 0.17, 0.2] }, H, hairShade);
      B.add('head', hairMat, G.sphere(10, 6), { p:[s * 0.41, headY - 0.14, -0.1], s:[0.12, 0.12, 0.14] }, H, hairShade);
    }
    const bshade = (c, p) => { c.multiplyScalar(0.8 + 0.2 * Math.min(1, Math.max(0, (p.y - headY + 0.8) / 0.8))); };
    const bd = (x, y, z, sx, sy, sz) => B.add('head', hairMat, G.sphere(10, 7), { p:[x, headY + y, z], s:[sx, sy, sz] }, H, bshade);
    bd(0, -0.33, 0.24, 0.3, 0.25, 0.22);
    bd(0, -0.55, 0.2, 0.21, 0.2, 0.17);
    bd(0, -0.72, 0.17, 0.1, 0.1, 0.1);
    for(const s of [1, -1]){ bd(s * 0.29, -0.2, 0.15, 0.14, 0.19, 0.16); bd(s * 0.15, -0.47, 0.21, 0.15, 0.17, 0.14); }
    for(const s of [1, -1]) B.add('head', hairMat, G.tube([[s * 0.01, headY - 0.13, 0.45], [s * 0.1, headY - 0.165, 0.44], [s * 0.19, headY - 0.13, 0.38]], { r:(t) => 0.05 * (1 - 0.7 * t), radial:8, density:20, capRings:2 }), null, '#ffffff');
    { const { p, n } = onHead(0, -0.23, 0.012); B.add('head', 'gloss', G.mouthD(1, 0.7, 0.2), B.M({ p:p.toArray(), q:surfQuat(THREE, n, 0.5), s:[0.05, 0.045, 0.05] }), pal.mouth); }
  }
  if(kind === 'doc'){
    hairShell(
      (a) => { const fa = Math.abs(a); const L = sideBack(fa, 27, -10, -36);
        const w = 1 - smooth(50, 80, fa);
        return L + w * 7 * Math.abs(Math.sin((a + 8) * D2R * 6)); },
      (a, e, v) => 0.07 + 0.1 * Math.sin(Math.PI * Math.min(1, v * 1.25)) + 0.03 * Math.sin(a * D2R * 7 + e * D2R * 5) * Math.sin(Math.PI * v), 56, 11);
  }
  /* 안경 */
  if(kind === 'elder' || kind === 'doc'){
    const fc = kind === 'elder' ? pal.trim : pal.frame;
    const rr = kind === 'elder' ? 0.085 : 0.108;
    const mat = kind === 'elder' ? 'metal' : 'gloss';
    const lz = kind === 'elder' ? 0.03 : 0.04;
    for(const s of [1, -1]){
      const { p, n } = onHead(s * eyeX, eyeY + 0.005, lz);
      const q = surfQuat(THREE, n, 0.6);
      B.add('head', mat, G.torus(rr, 0.013, 4, 20), B.M({ p:p.toArray(), q }), fc);
      /* 다리(귀로) */
      B.add('head', mat, G.tube([p.clone().add(new THREE.Vector3(s * rr, 0, 0).applyQuaternion(q)).toArray(), [s * R * 1.02, headY + eyeY + 0.02, 0.1], [s * R * 1.0, headY + eyeY - 0.02, -0.08]], { r:0.011, radial:6, density:8 }), null, fc);
    }
    const a = onHead(-eyeX + rr, eyeY + 0.02, lz), b = onHead(eyeX - rr, eyeY + 0.02, lz);
    B.add('head', mat, G.tube([a.p.toArray(), [0, headY + eyeY + 0.045, a.p.z + 0.012], b.p.toArray()], { r:0.011, radial:6, density:8 }), null, fc);
  }

  const topY = { boy:headY + R * 0.97 * 1.06 + 0.1, girl:headY + R * 1.04, elder:headY + R * 1.02, doc:headY + R * 1.07 + 0.06 }[kind];
  const recipe = B.build();
  recipe.designHeight = topY;
  recipe.human = true;
  recipe.waveSide = (kind === 'girl' || kind === 'elder') ? 'L' : 'R';
  recipe.propSide = propSide;
  recipe.robe = kind !== 'boy';
  recipe.blobR = kind === 'elder' ? 0.55 : 0.42;
  return recipe;
}

/* ============================================================
   숫자·기호 친구(buddy)
   디자인 좌표: 글자 높이 1.0 (획 반지름 ≈ 0.13), 다리 0.16
   ============================================================ */
const D2R = Math.PI / 180;
function arc(cx, cy, rx, ry, a0, a1, n = 24){
  const out = []; for(let i = 0; i <= n; i++){ const a = (a0 + (a1 - a0) * i / n) * D2R; out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return out;
}
function quad(p0, p1, p2, n = 16){
  const out = []; for(let i = 0; i <= n; i++){ const t = i / n, u = 1 - t;
    out.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]); }
  return out;
}
/* 획 정의: {s:[[x,y],…], closed?, r?}. face = 눈 중심, eyeGap = 눈 사이 반간격 */
const GLYPHS = {
  0:{ strokes:[{ s:arc(0, 0.5, 0.24, 0.37, 90, 450, 48).slice(0, -1), closed:true }], face:[0, 0.84], gap:0.095 },
  1:{ strokes:[{ s:[[0.05, 0.14], [0.05, 0.86]], r:0.16 }, { s:[[0.05, 0.86], [-0.17, 0.7]], r:0.13 }], face:[0.05, 0.62], gap:0.08, r:0.16 },
  2:{ strokes:[{ s:arc(0, 0.64, 0.22, 0.22, 165, -35, 26).concat([[-0.2, 0.14]]) }, { s:[[-0.2, 0.14], [0.24, 0.14]] }], face:[0, 0.84], gap:0.09 },
  3:{ strokes:[{ s:arc(0, 0.69, 0.2, 0.18, 155, -90, 26) }, { s:arc(0, 0.32, 0.22, 0.19, 90, -155, 26) }], face:[0, 0.84], gap:0.09 },
  4:{ strokes:[{ s:[[0.12, 0.14], [0.12, 0.86]] }, { s:[[0.12, 0.86], [-0.22, 0.36]] }, { s:[[-0.22, 0.36], [0.26, 0.36]] }], face:[0.12, 0.68], gap:0.075, faceR:0.13 },
  5:{ strokes:[{ s:[[0.22, 0.86], [-0.15, 0.86]] }, { s:[[-0.15, 0.86], [-0.17, 0.56]] }, { s:[[-0.17, 0.56]].concat(arc(0.0, 0.34, 0.22, 0.2, 128, -150, 26)) }], face:[0.03, 0.86], gap:0.09 },
  6:{ strokes:[{ s:arc(0, 0.33, 0.21, 0.2, 180, 540, 40).slice(0, -1), closed:true }, { s:quad([-0.21, 0.33], [-0.24, 0.84], [0.17, 0.86]) }], face:[0, 0.33], gap:0.085, faceOnRing:true },
  7:{ strokes:[{ s:[[-0.22, 0.86], [0.22, 0.86]] }, { s:[[0.22, 0.86], [-0.05, 0.14]] }], face:[0.0, 0.86], gap:0.1 },
  8:{ strokes:[{ s:arc(0, 0.69, 0.16, 0.16, 90, 450, 36).slice(0, -1), closed:true }, { s:arc(0, 0.31, 0.2, 0.18, 90, 450, 40).slice(0, -1), closed:true }], face:[0, 0.875], gap:0.08 },
  9:{ strokes:[{ s:arc(0, 0.67, 0.2, 0.19, 0, 360, 40).slice(0, -1), closed:true }, { s:quad([0.2, 0.67], [0.23, 0.18], [-0.16, 0.14]) }], face:[0, 0.86], gap:0.085 },
  10:{ strokes:[{ s:[[-0.28, 0.14], [-0.28, 0.86]], r:0.13 }, { s:[[-0.28, 0.86], [-0.44, 0.74]], r:0.11 }, { s:arc(0.2, 0.5, 0.2, 0.37, 90, 450, 44).slice(0, -1), closed:true }], face:[0.2, 0.84], gap:0.085 },
  plus:{ strokes:[{ s:[[-0.32, 0.5], [0.32, 0.5]], r:0.15 }, { s:[[0, 0.18], [0, 0.82]], r:0.15 }], face:[0, 0.5], gap:0.08 },
  minus:{ strokes:[{ s:[[-0.34, 0.5], [0.34, 0.5]], r:0.17 }], face:[0, 0.5], gap:0.1 },
  times:{ strokes:[{ s:[[-0.24, 0.26], [0.24, 0.74]], r:0.14 }, { s:[[-0.24, 0.74], [0.24, 0.26]], r:0.14 }], face:[0, 0.5], gap:0.075 },
  divide:{ strokes:[{ s:[[-0.32, 0.5], [0.32, 0.5]], r:0.14 }, { s:[[0, 0.84], [0, 0.841]], r:0.1 }, { s:[[0, 0.16], [0, 0.161]], r:0.1 }], face:[0, 0.5], gap:0.09 },
  equal:{ strokes:[{ s:[[-0.32, 0.64], [0.32, 0.64]], r:0.14 }, { s:[[-0.32, 0.3], [0.32, 0.3]], r:0.14 }], face:[0, 0.64], gap:0.1 },
  percent:{ strokes:[{ s:[[-0.24, 0.14], [0.24, 0.86]], r:0.1 }, { s:arc(-0.2, 0.7, 0.1, 0.12, 0, 360, 24).slice(0, -1), closed:true, r:0.07 }, { s:arc(0.2, 0.3, 0.1, 0.12, 0, 360, 24).slice(0, -1), closed:true, r:0.07 }], face:[0, 0.5], gap:0.07 },
  pi:{ strokes:[{ s:quad([-0.34, 0.74], [0, 0.86], [0.36, 0.84]), r:0.12 }, { s:quad([-0.14, 0.8], [-0.12, 0.4], [-0.2, 0.14]), r:0.11 }, { s:quad([0.15, 0.82], [0.13, 0.3], [0.26, 0.15]), r:0.11 }], face:[0.0, 0.82], gap:0.1 },
  sigma:{ strokes:[{ s:[[0.26, 0.86], [-0.24, 0.86]], r:0.12 }, { s:[[-0.24, 0.86], [0.06, 0.5]], r:0.12 }, { s:[[0.06, 0.5], [-0.24, 0.14]], r:0.12 }, { s:[[-0.24, 0.14], [0.26, 0.14]], r:0.12 }], face:[0.0, 0.86], gap:0.1 },
  infinity:{ strokes:[{ s:(() => { const o = []; for(let i = 0; i < 64; i++){ const t = i / 64 * Math.PI * 2, d = 1 + Math.sin(t) ** 2; o.push([0.46 * Math.cos(t) / d, 0.5 + 0.62 * Math.sin(t) * Math.cos(t) / d]); } return o; })(), closed:true, r:0.11 }], face:[0, 0.5], gap:0.07 },
  sqrt:{ strokes:[{ s:[[-0.36, 0.44], [-0.24, 0.5]], r:0.1 }, { s:[[-0.24, 0.5], [-0.08, 0.14]], r:0.11 }, { s:[[-0.08, 0.14], [0.1, 0.86]], r:0.11 }, { s:[[0.1, 0.86], [0.38, 0.86]], r:0.11 }], face:[0.23, 0.86], gap:0.08 },
};
const SYMBOL_IDS = ['plus', 'minus', 'times', 'divide', 'equal', 'percent', 'pi', 'sigma', 'infinity', 'sqrt'];

function buildBuddy(THREE, bopts, opts){
  const G = makeGeo(THREE), B = makeBuilder(THREE);
  let id = bopts.number;
  if(typeof id === 'string' && /^\d+$/.test(id)) id = +id;
  if(!(id in GLYPHS)) id = typeof id === 'number' && id > 10 ? 10 : 0;
  const glyph = GLYPHS[id];
  const isSym = SYMBOL_IDS.includes(id);
  const colorId = bopts.color || (isSym ? 'blue' : DIGIT_DEFAULT_COLOR[id]);
  const base = new THREE.Color(NUMBER_COLORS[colorId] || colorId || '#2f86c8');
  const aurora = colorId === 'aurora';
  const rDef = glyph.r || 0.13, zs = 0.84;
  const legLen = 0.16;
  /* 글자 전체를 legLen 만큼 올린다 — 아래 획의 바닥이 다리 위에 오도록 */
  let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;
  for(const st of glyph.strokes){ const r = st.r || rDef; for(const [x, y] of st.s){ minY = Math.min(minY, y - r); maxY = Math.max(maxY, y + r); minX = Math.min(minX, x - r); maxX = Math.max(maxX, x + r); } }
  const lift = legLen - minY + 0.02;
  const glyphH = maxY - minY;

  B.bone('body', null, [0, legLen, 0]);
  const bodyShade = (c, p, n) => {
    const t = Math.min(1, Math.max(0, (p.y - legLen) / glyphH));
    if(aurora){ c.setHSL((0.78 - 0.62 * t + 1) % 1, 0.62, 0.6); }
    c.multiplyScalar(0.8 + 0.26 * t);                          // 아래 살짝 어둡게
    const rim = Math.max(0, n.y) * 0.08; c.r += rim; c.g += rim; c.b += rim;  // 윗면 하이라이트
  };
  const bodyGeos = [];
  for(const st of glyph.strokes){
    const r = st.r || rDef;
    const pts = st.s.map(([x, y]) => [x, y + lift, 0]);
    const g = G.tube(pts, { r, zs, closed:st.closed, radial:18, density:30, capRings:5 });
    bodyGeos.push(g);
    B.add('body', 'satin', g, null, base, bodyShade);
  }
  /* 레이캐스트로 얼굴을 표면에 붙인다 */
  const tmpMeshes = bodyGeos.map(g => new THREE.Mesh(g));
  const ray = new THREE.Raycaster();
  const hitAt = (x, y) => {
    ray.set(new THREE.Vector3(x, y, 3), new THREE.Vector3(0, 0, -1));
    const h = ray.intersectObjects(tmpMeshes, false)[0];
    if(!h) return null;
    return { p:h.point.clone(), n:h.face.normal.clone() };
  };
  const [fx, fy0] = glyph.face; const fy = fy0 + lift + 0.035;   // 눈은 획 중심보다 살짝 위, 입은 획 위에
  const eyeH = 0.12, eyeW = 0.094;
  const gap = glyph.gap;
  const faceHit = hitAt(fx, fy) || { p:new THREE.Vector3(fx, fy, rDef * zs), n:new THREE.Vector3(0, 0, 1) };
  for(const s of [1, -1]){
    const hit = hitAt(fx + s * gap, fy + 0.01) || { p:new THREE.Vector3(fx + s * gap, fy, faceHit.p.z), n:new THREE.Vector3(0, 0, 1) };
    const q = surfQuat(THREE, hit.n, 0.7);
    const p = hit.p.clone().add(new THREE.Vector3(0, 0, -0.012));
    addEye(THREE, G, B, 'body', p, q, eyeW, eyeH, { name:'eye' + (s > 0 ? 'L' : 'R'), parent:'body', parentLocal:p.clone().sub(new THREE.Vector3(0, legLen, 0)).toArray(),
      iris:'#2a2433', pupil:'#120f18', irisScale:0.74 });
    /* 눈썹: 몸색을 짙게 */
    const b0 = hitAt(fx + s * (gap - 0.04), fy + eyeH + 0.035), b1 = hitAt(fx + s * (gap + 0.04), fy + eyeH + 0.045);
    if(b0 && b1) B.add('body', 'gloss', G.tube([b0.p.toArray(), b1.p.toArray()], { r:0.011, radial:6, density:8 }), null, base.clone().multiplyScalar(0.42));
    /* 볼터치 */
    const ch = hitAt(fx + s * (gap + 0.05), fy - eyeH * 0.8) || hitAt(fx + s * (gap + 0.03), fy - eyeH * 0.6);
    if(ch) B.add('body', 'matte', G.dome(14, 3, 0.9), B.M({ p:ch.p.clone().addScaledVector(ch.n, -0.004).toArray(), q:surfQuat(THREE, ch.n, 0.3), s:[0.04, 0.026, 0.012] }), '#ff8f9c');
  }
  /* 입 */
  { const m = hitAt(fx, fy - eyeH * 0.95) || hitAt(fx, fy - eyeH * 0.75) || faceHit;
    const q = surfQuat(THREE, m.n, 0.6);
    B.add('body', 'gloss', G.mouthD(1, 0.9, 0.2), B.M({ p:m.p.clone().addScaledVector(m.n, -0.002).toArray(), q, s:[0.056, 0.052, 0.04] }), '#6a1f2a');
    const tq = m.p.clone().add(new THREE.Vector3(0, -0.026, 0.005).applyQuaternion(q));
    B.add('body', 'matte', G.sphere(10, 6), B.M({ p:tq.toArray(), q, s:[0.03, 0.014, 0.008] }), '#ff7f8a'); }

  /* 팔: 몸의 가장 바깥 옆면(가운데 높이)에서 */
  const midY = lift + (minY + maxY) / 2 - 0.02;
  let lx = Infinity, rx = -Infinity;
  for(const g of bodyGeos){ const P = g.attributes.position; for(let i = 0; i < P.count; i++){ const y = P.getY(i); if(Math.abs(y - midY) < 0.035 && Math.abs(P.getZ(i)) < 0.06){ lx = Math.min(lx, P.getX(i)); rx = Math.max(rx, P.getX(i)); } } }
  if(!isFinite(lx)){ lx = minX; rx = maxX; }
  const limb = base.clone().multiplyScalar(0.78);
  for(const s of [1, -1]){
    const L = s > 0 ? 'L' : 'R';
    const ax = s > 0 ? rx - 0.03 : lx + 0.03;
    B.bone('arm' + L, 'body', [ax, midY - legLen, 0]);
    const aw = B.bones.get('arm' + L).world;
    const P = (x, y, z) => new THREE.Vector3(x, y, z).applyMatrix4(aw).toArray();
    B.add('arm' + L, 'satin', G.tube([P(0, 0, 0), P(s * 0.08, -0.05, 0.01), P(s * 0.12, -0.15, 0.03)], { r:0.032, radial:10, capRings:2 }), null, limb);
    B.add('arm' + L, 'satin', G.sphere(14, 10), { p:P(s * 0.125, -0.18, 0.035), s:[0.05, 0.052, 0.046] }, limb);
  }
  B.extra.armBase = 0;
  /* 다리: 글자 바닥 근처 정점들의 가운데 */
  let sx = 0, cnt = 0;
  for(const g of bodyGeos){ const P = g.attributes.position; for(let i = 0; i < P.count; i++){ if(P.getY(i) < legLen + 0.07 && Math.abs(P.getZ(i)) < 0.05){ sx += P.getX(i); cnt++; } } }
  const legX = cnt ? sx / cnt : 0;
  for(const s of [1, -1]){
    const L = s > 0 ? 'L' : 'R', x = legX + s * 0.09;
    B.bone('leg' + L, null, [x, legLen + 0.04, 0]);
    B.add('leg' + L, 'satin', G.tube([[x, legLen + 0.06, 0], [x + s * 0.01, 0.07, 0.0]], { r:0.034, radial:10, capRings:2 }), null, limb);
    B.add('leg' + L, 'gloss', G.sphere(16, 10), { p:[x + s * 0.012, 0.045, 0.035], s:[0.066, 0.05, 0.088] }, base.clone().multiplyScalar(0.62), shadeFn(THREE, 0, 0.09, 0.3));
  }
  /* 모자 */
  let topX = 0, topY = -Infinity;
  for(const g of bodyGeos){ const P = g.attributes.position; for(let i = 0; i < P.count; i++) if(P.getY(i) > topY){ topY = P.getY(i); topX = P.getX(i); } }
  const hat = bopts.hat || 'none';
  const ht = [topX, topY - 0.02, 0];
  if(hat === 'party'){
    const cols = ['#ff6b8a', '#ffd34d', '#5cc3ff'];
    B.add('body', 'matte', G.cone(0.12, 0.3, 24), { p:[ht[0], ht[1] + 0.14, 0], r:[0, 0, -0.18] }, '#ffffff', (c, p) => { c.set(cols[Math.floor((p.y - ht[1]) / 0.07 + 10) % 3]); });
    B.add('body', 'matte', G.sphere(10, 8), { p:[ht[0] + 0.05, ht[1] + 0.29, 0], s:0.04 }, '#ffffff');
  } else if(hat === 'ribbon'){
    for(const k of [1, -1]) B.add('body', 'satin', G.sphere(16, 10), { p:[ht[0] + k * 0.08, ht[1] + 0.03, 0.02], r:[0, 0, k * 0.5], s:[0.085, 0.056, 0.045] }, '#ff5fa2');
    B.add('body', 'satin', G.sphere(12, 8), { p:[ht[0], ht[1] + 0.03, 0.04], s:0.035 }, '#d9447f');
  } else if(hat === 'wizard'){
    B.add('body', 'matte', G.cyl(0.19, 0.19, 0.025, 28), { p:[ht[0], ht[1] + 0.01, 0], r:[0.1, 0, 0] }, '#4b2c8e');
    B.add('body', 'matte', G.tube([[ht[0], ht[1], 0], [ht[0] + 0.02, ht[1] + 0.16, -0.01], [ht[0] - 0.1, ht[1] + 0.3, -0.04]], { r:(t) => 0.12 * (1 - 0.9 * t), radial:16, density:40 }), null, '#5b35a8');
    B.add('body', 'metal', G.star(1, 0.46, 0.4, 0.16), { p:[ht[0] + 0.01, ht[1] + 0.09, 0.1], s:0.04 }, '#f2c23a');
  } else if(hat === 'crown'){
    B.add('body', 'metal', G.cyl(0.11, 0.1, 0.07, 24), { p:[ht[0], ht[1] + 0.03, 0] }, '#f2c23a');
    for(let i = 0; i < 5; i++){ const a = i / 5 * Math.PI * 2 + Math.PI / 2; const x = ht[0] + Math.cos(a) * 0.1, z = Math.sin(a) * 0.1;
      B.add('body', 'metal', G.cone(0.03, 0.08, 10), { p:[x, ht[1] + 0.1, z] }, '#f2c23a');
      B.add('body', 'metal', G.sphere(8, 6), { p:[x, ht[1] + 0.145, z], s:0.018 }, '#f2c23a'); }
    B.add('body', 'glow', G.sphere(10, 8), { p:[ht[0], ht[1] + 0.035, 0.105], s:[0.022, 0.022, 0.012] }, '#ff4f6d');
  } else if(hat === 'laurel'){
    for(let i = 0; i < 12; i++){ const a = i / 12 * Math.PI * 2; const x = ht[0] + Math.cos(a) * 0.12, z = Math.sin(a) * 0.12;
      B.add('body', 'satin', G.sphere(8, 6), { p:[x, ht[1] + 0.02, z], r:[0, -a, 0.6], s:[0.02, 0.045, 0.012] }, '#4ea64b'); }
  }
  /* 망토 */
  const cape = bopts.cape || 'none';
  if(cape !== 'none' && cape in CAPE_COLORS){
    /* 몸 뒤로 늘어진 망토: 위는 좁게 모이고, 아래는 둥글게 퍼지며, 가운데가 뒤로 볼록 */
    const cx = (lx + rx) / 2, span = rx - lx;
    const W0 = span * 0.3 + 0.03, W1 = span * 0.46 + 0.1, y0 = Math.min(maxY + lift - 0.12, midY + 0.22), y1 = 0.1;
    const zb = -rDef * zs - 0.015;
    const cols = 12, rows = 10, pos = [], idx = [];
    for(let r = 0; r <= rows; r++){ const v = r / rows, w = W0 + (W1 - W0) * Math.sin(v * Math.PI / 2);
      for(let c = 0; c <= cols; c++){ const u = c / cols * 2 - 1;
        const hem = v === 1 ? 0.025 * (1 - u * u) - 0.01 * Math.cos(u * Math.PI * 3) : 0;   // 밑단: 가운데가 살짝 긴 둥근 곡선
        const y = y0 + (y1 - y0) * v - hem;
        pos.push(cx + u * w, y, zb - (1 - u * u) * (0.03 + 0.1 * v) - 0.015 * Math.cos(u * Math.PI * 2.5) * v); } }
    for(let r = 0; r < rows; r++) for(let c = 0; c < cols; c++){ const a = r * (cols + 1) + c, b = a + 1, d = a + cols + 1, e = d + 1; idx.push(a, d, b, b, d, e); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const cc = new THREE.Color(CAPE_COLORS[cape] || '#7c45b4');
    const capeFn = cape === 'rainbow' ? (c, p) => { c.setHSL(((p.x - cx) / (W1 * 2) + 0.5) * 0.8, 0.62, 0.56); }
      : cape === 'galaxy' ? (c, p) => c.copy(new THREE.Color('#2a1a5e').lerp(new THREE.Color('#c9528f'), Math.min(1, Math.max(0, 1 - (p.y - y1) / (y0 - y1)))))
      : (c, p) => c.multiplyScalar(0.7 + 0.3 * Math.min(1, Math.max(0, (p.y - y1) / (y0 - y1))));
    B.bone('cape', 'body', [cx, y0 - legLen, zb]);
    B.add('cape', 'cloth', g, null, cc, capeFn);
    if(cape === 'starcape') for(let i = 0; i < 5; i++){ const x = cx + (i - 2) * W1 * 0.36, y = y1 + 0.14 + (i % 2) * 0.16;
      B.add('cape', 'metal', G.star(1, 0.45, 0.3, 0.1), { p:[x, y, zb - 0.08 - (1 - ((i - 2) * 0.36) ** 2) * 0.05], r:[0, Math.PI, 0], s:0.028 }, '#f2c23a'); }
    /* 어깨 양쪽 매듭 끈 */
    for(const sd of [1, -1]) B.add('body', 'satin', G.sphere(10, 6), { p:[cx + sd * W0 * 0.95, y0 - 0.01, zb + 0.03], s:[0.035, 0.03, 0.03] }, cc.clone().multiplyScalar(0.85));
  }
  const recipe = B.build();
  recipe.designHeight = legLen + 1.02;   // 기호(− 등)도 숫자와 같은 비율 — 글자 높이 1 기준
  recipe.buddy = true;
  recipe.blobR = Math.max(0.3, (maxX - minX) * 0.6);
  recipe.waveSide = 'R';
  return recipe;
}

/* ============================================================
   인스턴스 + 애니메이션
   ============================================================ */
function recipeFor(THREE, opts){
  const k = kitFor(THREE);
  const kind = opts.kind || 'boy';
  const key = JSON.stringify([kind, kind === 'buddy' ? opts.buddy || {} : 0, opts.palette || 0, opts.props !== false]);
  let r = k.recipes.get(key);
  if(!r){
    r = kind === 'buddy' ? buildBuddy(THREE, opts.buddy || {}, opts) : buildHuman(THREE, PALETTES[kind] ? kind : 'boy', opts);
    k.recipes.set(key, r);
  }
  return r;
}

function blobShadow(THREE, k){
  if(!k.blobTex){
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const x = cv.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(20,24,40,0.42)'); gr.addColorStop(0.55, 'rgba(20,24,40,0.2)'); gr.addColorStop(1, 'rgba(20,24,40,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    k.blobTex = new THREE.CanvasTexture(cv);
    k.blobMat = new THREE.MeshBasicMaterial({ map:k.blobTex, transparent:true, depthWrite:false, name:'char3d-blob' });
    k.blobGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  }
  const m = new THREE.Mesh(k.blobGeo, k.blobMat);
  m.renderOrder = -1;
  return m;
}

export function makeCharacter(THREE, opts = {}){
  const k = kitFor(THREE);
  const kind = opts.kind || 'boy';
  const R = recipeFor(THREE, opts);
  const height = opts.height || DEFAULT_HEIGHT[kind] || 1.6;
  const scale = height / R.designHeight;

  const object = new THREE.Group(); object.name = 'char3d-' + kind;
  const rig = new THREE.Group(); rig.scale.setScalar(scale); object.add(rig);
  const bones = {};
  for(const b of R.bones){
    const g = new THREE.Group(); g.name = b.name;
    g.position.fromArray(b.pos); g.quaternion.fromArray(b.quat);
    (b.parent ? bones[b.parent] : rig).add(g);
    bones[b.name] = g;
    g.userData.rest = { p:g.position.clone(), q:g.quaternion.clone() };
  }
  const meshes = [];
  const self = {};
  for(const bin of R.bins){
    const m = new THREE.Mesh(bin.geo, k.mats[bin.mat]);
    m.castShadow = opts.shadows !== false; m.receiveShadow = false;
    m.userData.char3d = self;
    bones[bin.bone].add(m); meshes.push(m);
  }
  let blob = null;
  if(opts.blob !== false){ blob = blobShadow(THREE, k); blob.scale.setScalar(R.blobR * 2 * scale); blob.position.y = 0.003; object.add(blob); }

  /* 상태 */
  let walking = false, walkAmt = 0, walkRate = 1, phase = 0;
  let yaw = 0, yawTarget = 0;
  let waveT = -1;
  let blinkT = 1 + Math.random() * 3, blinkPh = -1;
  const seed = Math.random() * 10;
  const E = new THREE.Euler(), Q = new THREE.Quaternion();
  const pose = (name, x = 0, y = 0, z = 0, px = 0, py = 0, pz = 0) => {
    const b = bones[name]; if(!b) return;
    E.set(x, y, z); Q.setFromEuler(E);
    b.quaternion.copy(b.userData.rest.q).multiply(Q);
    b.position.copy(b.userData.rest.p); b.position.x += px; b.position.y += py; b.position.z += pz;
  };

  function update(dt = 1 / 60, t = 0){
    dt = Math.min(dt, 0.1);
    walkAmt += ((walking ? 1 : 0) - walkAmt) * Math.min(1, dt * 8);
    phase += dt * (R.human ? 6.4 : 8.5) * walkRate * (0.3 + 0.7 * walkAmt);
    const w = walkAmt, s = Math.sin(phase), c2 = Math.cos(phase * 2);
    const tt = t + seed;
    const breathe = Math.sin(tt * 2.1);
    /* 방향 */
    let d = yawTarget - yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    yaw += d * Math.min(1, dt * 9);
    object.rotation.y = yaw;
    /* 깜빡임 */
    blinkT -= dt;
    if(blinkT <= 0 && blinkPh < 0){ blinkPh = 0; blinkT = 2.2 + Math.random() * 3.2; }
    let lid = 1;
    if(blinkPh >= 0){ blinkPh += dt; lid = blinkPh < 0.07 ? 1 - blinkPh / 0.07 * 0.9 : blinkPh < 0.16 ? 0.1 + (blinkPh - 0.07) / 0.09 * 0.9 : 1; if(blinkPh >= 0.16) blinkPh = -1; }
    for(const e of ['eyeL', 'eyeR']) if(bones[e]){ bones[e].scale.set(1, Math.max(0.08, lid), 1); }
    /* 손 흔들기 */
    let wv = 0, wvOsc = 0;
    if(waveT >= 0){ waveT += dt; const T = 1.6; if(waveT > T) waveT = -1; else { wv = Math.min(1, waveT / 0.25, (T - waveT) / 0.3); wvOsc = Math.sin(waveT * 14); } }

    if(R.human){
      const bob = Math.abs(Math.cos(phase)) * 0.035 * w;
      pose('hips', 0, s * 0.08 * w, 0, 0, bob - 0.012 * w + breathe * 0.002 * (1 - w), 0);
      pose('torso', 0.04 * w + breathe * 0.012 * (1 - w), -s * 0.12 * w, 0);
      pose('head', -0.03 * w + Math.sin(tt * 0.9) * 0.03 * (1 - w), Math.sin(tt * 0.6) * 0.08 * (1 - w) + s * 0.06 * w, Math.sin(tt * 0.7) * 0.03 * (1 - w));
      pose('legL', -s * 0.55 * w, 0, 0); pose('legR', s * 0.55 * w, 0, 0);
      const armIdle = Math.sin(tt * 2.1) * 0.03;
      for(const L of ['L', 'R']){
        const sg = L === 'L' ? 1 : -1;
        let swing = (L === 'L' ? s : -s) * 0.6 * w;
        let ax = swing, az = sg * (0.04 + armIdle) * (1 - w), fx = -0.25 - Math.max(0, -swing) * 0.4 - 0.1 * w, fz = 0;
        if(R.propSide === L){ ax = swing * 0.3; fx = 0; az = 0; }
        if(R.waveSide === L && wv > 0){
          ax = ax * (1 - wv) - 0.2 * wv; az = az * (1 - wv) + sg * 2.5 * wv; fx = fx * (1 - wv); fz = sg * (0.35 + 0.35 * wvOsc) * wv;
        }
        pose('arm' + L, ax, 0, az);
        pose('fore' + L, fx, 0, fz);
      }
    } else {
      const hop = Math.abs(Math.sin(phase)) * 0.06 * w;
      const squash = 1 + breathe * 0.012 * (1 - w) - (1 - Math.abs(Math.sin(phase))) * 0.03 * w;
      pose('body', 0, Math.sin(tt * 0.7) * 0.06 * (1 - w), s * 0.1 * w + Math.sin(tt * 1.3) * 0.025 * (1 - w), 0, hop, 0);
      bones.body.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
      pose('legL', -s * 0.7 * w, 0, 0, 0, Math.max(0, s) * 0.04 * w, 0);
      pose('legR', s * 0.7 * w, 0, 0, 0, Math.max(0, -s) * 0.04 * w, 0);
      for(const L of ['L', 'R']){
        const sg = L === 'L' ? 1 : -1;
        let ax = (L === 'L' ? -s : s) * 0.7 * w, az = sg * (Math.sin(tt * 2.1 + (sg > 0 ? 0 : 1)) * 0.12) * (1 - w);
        if(R.waveSide === L && wv > 0){ ax *= 1 - wv; az = az * (1 - wv) + sg * (1.9 + 0.35 * wvOsc) * wv; }
        pose('arm' + L, ax, 0, az);
      }
      if(bones.cape) pose('cape', -0.08 - 0.25 * w - 0.04 * Math.sin(tt * 1.7), 0, 0);
    }
  }

  Object.assign(self, {
    object, meshes, bones, kind, recipe:R,
    triangles:R.tris, materials:new Set(R.bins.map(b => b.mat)).size,
    update,
    setWalking(on, rate){ walking = !!on; if(rate) walkRate = rate; },
    face(a){ yawTarget = a; },
    faceNow(a){ yawTarget = yaw = a; object.rotation.y = a; },
    wave(){ waveT = 0; },
    dispose(){ if(object.parent) object.parent.remove(object); meshes.length = 0; },
  });
  update(0, 0);
  return self;
}

/* 편의: 모든 숫자·기호 id */
export const BUDDY_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...SYMBOL_IDS];
