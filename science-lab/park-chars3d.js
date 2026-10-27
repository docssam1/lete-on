// 공원 지도 위의 3D 사람들 — 두 아이(나래·도윤)와 공원 안의 다른 사람들.
// 원장 2026-10-26 「예전에 쓰던 3D 캐릭터 가져와」(월드 익스플로러 탐험가) · 2026-10-27 「캐릭터 더 작아야지 · NPC 같은 친구들 … 수의 나라나 지도에 있는 캐릭터 더 가지고 와」.
// 모양은 두 곳에서 가져온다: world-explorer/character.js(탐험가: 아리·미나·루카·유준·유빈·소라·로빈), number_magic/app/char3d/char3d.js(수의 나라: 독쌤·할아버지·숫자 친구).
// 무리(actor)마다 작은 2D 캔버스 하나에 그리는데, WebGL 렌더러는 하나만 두고 무리마다 돌려 가며 그린 뒤 옮겨 붙인다(WebGL 문맥을 여러 개 만들면 브라우저가 옛것을 끊는다).
// 캔버스 원점(발 사이) = 아래에서 11.25% 높이 — report.css의 .pk-kid3d·.pk-npc canvas(bottom −13.5px)와 짝.
import * as THREE from '../world-explorer/vendor/three.module.js';
import { createExplorerCharacter, animateExplorer } from '../world-explorer/character.js';
import { makeCharacter } from '../number_magic/app/char3d/char3d.js';

// ex = 월드 익스플로러 탐험가(키 약 2.6), nm = 수의 나라(키를 맞춰 준다)
export const CAST = {
  narae: { ex: { profileId: 'mina', skin: 0xf5d0b4, hair: 0x3b2a20, jacket: 0xd77fa0, scarf: 0xe1b84b, hat: 'round' } },
  doyun: { ex: { profileId: 'ari', skin: 0xf2c8a5, hair: 0x2a1f18, jacket: 0x376f9f, scarf: 0xe06855, hat: 'cap' } },
  luca: { ex: { profileId: 'luca', skin: 0x8f5d3f, hair: 0x1f1b19, jacket: 0x376f9f, scarf: 0xe1b84b, hat: 'wide' } },
  yujun: { ex: { profileId: 'yujun', skin: 0xe0a97e, hair: 0x2b211d, jacket: 0xc0524a, scarf: 0xf0c457, hat: 'cap' } },
  yubin: { ex: { profileId: 'yubin', skin: 0xf0d0a8, hair: 0x4a3728, jacket: 0x9a6bb0, scarf: 0x5cb26f, hat: 'round' } },
  sora: { ex: { profileId: 'sora', skin: 0xeec19a, hair: 0x4a3626, jacket: 0x4a83a6, scarf: 0xf0c457, hat: 'round' } },
  robin: { ex: { profileId: 'robin', skin: 0xc98760, hair: 0x2c2938, jacket: 0x5b8d69, scarf: 0x9a5e91, hat: 'wide' } },
  doc: { nm: { kind: 'doc', height: 2.75 } },
  elder: { nm: { kind: 'elder', height: 2.7 } },
  numi: { nm: { kind: 'buddy', buddy: { number: 0 }, height: 1.6 } },
  poco: { nm: { kind: 'buddy', buddy: { number: 3 }, height: 1.6 } },
  momo: { nm: { kind: 'buddy', buddy: { number: 8 }, height: 1.6 } },
};
// 지도 data/park-map.js의 npcs 자리마다 누가 있는지
export const NPC_CAST = { doc: ['doc'], elder: ['elder'], luca: ['luca'], robin: ['robin'], walkers: ['yubin', 'yujun'], sora: ['sora'], buddies: ['numi', 'poco'], momo: ['momo'] };

const W = 132, H = 120;

function member(id) {
  const d = CAST[id];
  if (d.ex) {
    const c = createExplorerCharacter(THREE, d.ex); c.scale.setScalar(0.92); let want = 0;
    return { obj: c, setFace(a) { want = a; }, wave() {},
      tick(dt, walking, reduced) { let x = want - c.rotation.y; while (x > Math.PI) x -= 2 * Math.PI; while (x < -Math.PI) x += 2 * Math.PI; c.rotation.y += x * Math.min(1, dt * 9); animateExplorer(c, reduced ? 0 : dt, walking ? 2.4 : 0); } };
  }
  const c = makeCharacter(THREE, { ...d.nm, blob: false, shadows: false }); let t = Math.random() * 10, was = null;
  return { obj: c.object, setFace(a) { c.face(a); }, wave() { c.wave(); },
    tick(dt, walking, reduced) { if (was !== walking) { c.setWalking(walking, 1); was = walking; } t += dt; c.update(reduced ? 0 : dt, t); } };
}

export function createCast({ reduced = false } = {}) {
  const dpr = Math.min(2.5, devicePixelRatio || 1);
  const R = new THREE.WebGLRenderer({ canvas: document.createElement('canvas'), alpha: true, antialias: true });
  R.setPixelRatio(dpr); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace;
  // 지도 카메라처럼 약 40° 내려다본다. 가로 ±2.2, 세로 4.0(아래 0.45 · 위 3.55)
  const cam = new THREE.OrthographicCamera(-2.2, 2.2, 3.55, -0.45, 0.1, 50);
  const el = THREE.MathUtils.degToRad(38); cam.position.set(0, Math.sin(el) * 20, Math.cos(el) * 20); cam.lookAt(0, 0, 0);
  const actors = new Set(); let raf = 0, last = performance.now(), paused = false;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!paused) for (const a of actors) {
      if (a.hidden) continue;
      a.members.forEach((m) => m.tick(dt, a.walking, reduced));
      R.render(a.scene, cam); a.ctx.clearRect(0, 0, a.ctx.canvas.width, a.ctx.canvas.height); a.ctx.drawImage(R.domElement, 0, 0, a.ctx.canvas.width, a.ctx.canvas.height);
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return {
    // ids: 한 캔버스에 나란히 세울 사람들(둘이면 ±0.95). rest: 서 있을 때 몸 방향(라디안, 0 = 앞)
    add(canvas, ids, rest = ids.length > 1 ? [0.45, -0.45] : [0]) {
      canvas.width = W * dpr; canvas.height = H * dpr;
      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xfffbef, 0x6d7f55, 1.6));
      const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-3, 8, 5); scene.add(sun);
      const members = ids.map((id, i) => {
        const m = member(id), x = ids.length > 1 ? (i ? 0.95 : -0.95) : 0; m.obj.position.x = x;
        const blob = new THREE.Mesh(new THREE.CircleGeometry(CAST[id].nm?.kind === 'buddy' ? 0.42 : 0.62, 24), new THREE.MeshBasicMaterial({ color: 0x14200f, transparent: true, opacity: 0.28, depthWrite: false }));
        blob.rotation.x = -Math.PI / 2; blob.position.set(x, 0.01, 0); scene.add(blob, m.obj); m.setFace(rest[i] ?? 0); return m;
      });
      const a = { scene, members, ctx: canvas.getContext('2d'), walking: false, hidden: false };
      actors.add(a);
      return {
        setWalking(on) { a.walking = !!on; },
        // dx·dy = 그림 위 이동 방향(화면 아래 = 앞). 0, 0이면 서 있는 방향
        face(dx = 0, dy = 0) { if (!dx && !dy) members.forEach((m, i) => m.setFace(rest[i] ?? 0)); else { const ang = Math.atan2(dx, dy); members.forEach((m) => m.setFace(ang)); } },
        wave() { members.forEach((m) => m.wave()); },
        dispose() { actors.delete(a); scene.traverse((o) => o.geometry?.dispose?.()); },
      };
    },
    pause(on) { paused = !!on; },
    dispose() { cancelAnimationFrame(raf); actors.clear(); R.dispose(); },
  };
}
