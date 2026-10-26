// 공원 지도의 두 아이(나래·도윤) — 월드 익스플로러(world-explorer)의 3D 탐험가 캐릭터를 그대로 쓴다(원장 2026-10-26: 「예전에 쓰던 3D 캐릭터 가져와」).
// 작은 투명 캔버스 하나에 둘을 나란히 세워 그리고, 캔버스는 지도 위 아이들 자리(발 사이)에 붙는다(report.css .pk-kid3d). 지도는 위에서 비스듬히 내려다본 그림이라 카메라도 그 각도로 둔다.
import * as THREE from '../world-explorer/vendor/three.module.js';
import { createExplorerCharacter, animateExplorer } from '../world-explorer/character.js';

// 나래 = 기록가 모자(관찰 기록), 도윤 = 탐험 캡. 색은 옛 그림(분홍·파랑)과 같은 계열.
const LOOK = {
  narae: { profileId: 'mina', skin: 0xf5d0b4, hair: 0x3b2a20, jacket: 0xd77fa0, scarf: 0xe1b84b, hat: 'round' },
  doyun: { profileId: 'ari', skin: 0xf2c8a5, hair: 0x2a1f18, jacket: 0x376f9f, scarf: 0xe06855, hat: 'cap' },
};
const W = 132, H = 120;

export function mountKids3d(canvas, { reduced = false } = {}) {
  const dpr = Math.min(2.5, devicePixelRatio || 1);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(dpr); renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfffbef, 0x6d7f55, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-3, 8, 5); scene.add(sun);
  // 발 사이(원점)가 캔버스 아래 가운데 근처에 오도록. 지도 카메라처럼 약 40° 내려다본다.
  // 가로 ±2.2, 세로 4.4×H/W = 4.0(아래 0.45 · 위 3.55) → 원점은 캔버스 아래에서 0.45/4.0 = 11.25% 높이(CSS의 bottom 값과 맞춘다)
  const cam = new THREE.OrthographicCamera(-2.2, 2.2, 3.55, -0.45, 0.1, 50);
  const el = THREE.MathUtils.degToRad(38);
  cam.position.set(0, Math.sin(el) * 20, Math.cos(el) * 20); cam.lookAt(0, 0, 0);
  const make = (id, x) => {
    const c = createExplorerCharacter(THREE, LOOK[id]); c.scale.setScalar(0.92); c.position.x = x;
    const blob = new THREE.Mesh(new THREE.CircleGeometry(0.62, 24), new THREE.MeshBasicMaterial({ color: 0x14200f, transparent: true, opacity: 0.28, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; blob.position.set(x, 0.01, 0); scene.add(blob, c); return c;
  };
  const kids = [make('narae', -0.95), make('doyun', 0.95)];
  // 서 있으면 서로 살짝 마주 보며 앞을 보고, 걸으면 둘 다 가는 쪽을 본다(dx·dy = 그림 위 이동 방향)
  const REST = [0.45, -0.45];
  let walking = false, want = REST.slice(), raf = 0, last = performance.now(), alive = true;
  const turn = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const frame = (now) => {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    kids.forEach((c, i) => { c.rotation.y += turn(c.rotation.y, want[i]) * Math.min(1, dt * 9); animateExplorer(c, reduced ? 0 : dt * (i ? 1.04 : 1), walking ? 2.4 : 0); });
    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return {
    setWalking(on) { walking = !!on; },
    face(dx, dy) { if (!dx && !dy) { want = REST.slice(); return; } const a = Math.atan2(dx, dy); want = [a, a]; },
    dispose() { alive = false; cancelAnimationFrame(raf); renderer.dispose(); scene.traverse((o) => { o.geometry?.dispose?.(); }); },
  };
}
