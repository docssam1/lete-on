// 4-1 Ⅲ 땅의 변화 — 흙 언덕 물길: 위쪽은 깎이고(침식) 흙이 옮겨져(운반) 아래쪽에 쌓인다(퇴적)
import { PALETTE as P, cylinder, box, label, relabel, arrow, THREE, mat, lerp } from './_kit.js';

const BASE = 0.2, HR = 1.8, HH = 1.6;                      // 쟁반 위 높이, 언덕 반지름·높이
const SAND = 0x2ec4b6, HILL = 0xd9b886;
const RT = 0.25;                                          // 언덕 꼭대기 반지름(잘린 원뿔)
const SLOPE = Math.atan2(HH, HR - RT), LEN = Math.hypot(HR - RT, HH);
const NX = Math.sin(SLOPE) * 0.04, NY = Math.cos(SLOPE) * 0.04;   // 겉면 바깥으로 살짝 띄움

export default {
  view: { theta: 1.05, phi: 1.12, dist: 7.0, target: [1.1, 0.9, 0] },
  build(kit, world) {
    const tray = box(5.2, 0.2, 3.2, P.gray); tray.position.set(0.6, 0.1, 0); world.add('tray', tray);
    const hill = cylinder(RT, HR, HH, HILL); hill.position.set(0, BASE + HH / 2, 0); world.add('hill', hill);
    const cap = cylinder(0.12, 0.5, 0.35, SAND); cap.position.set(0, BASE + HH - 0.1, 0); world.add('cap', cap);
    const stream = box(LEN, 0.03, 0.16, 0x6fb7e8, { opacity: 0.7 });
    stream.rotation.z = -SLOPE; stream.position.set((RT + HR) / 2 + NX, BASE + HH / 2 + NY, 0); world.add('stream', stream);
    const fan = cylinder(0.9, 1.0, 0.12, 0xc39a5f); fan.position.set(HR + 0.5, BASE + 0.06, 0); fan.scale.set(0.01, 1, 0.01); world.add('fan', fan);
    const dot = cylinder(0.35, 0.4, 0.08, SAND); dot.position.set(HR + 0.6, BASE + 0.14, 0); dot.scale.set(0.01, 1, 0.01); world.add('dot', dot);
    const cup = cylinder(0.32, 0.24, 0.5, P.glass, { opacity: 0.5 }); cup.position.set(0.1, BASE + HH + 0.6, 0); cup.rotation.z = -0.6; world.add('cup', cup);
    const lbQ = label('색 모래는 어디로 갈까?', { size: 0.32 }); lbQ.position.set(0.6, 2.9, 0); world.add('lbQ', lbQ);
    const lbCut = label('위쪽은 깎여요 — 침식', { size: 0.3 }); lbCut.position.set(-0.4, 2.7, 0); world.add('lbCut', lbCut);
    const lbMove = label('흙이 물을 따라 옮겨져요 — 운반', { size: 0.28 }); lbMove.position.set(1.2, 2.2, 0); world.add('lbMove', lbMove);
    const lbPile = label('아래쪽에 쌓여요 — 퇴적', { size: 0.3 }); lbPile.position.set(2.4, 1.0, 0); world.add('lbPile', lbPile);
    const down = arrow([RT + 0.35, BASE + HH + 0.05, 0.45], [HR + 0.45, BASE + 0.35, 0.45], P.red, 0.04); world.add('down', down);
    return {};
  },
  beats: [
    { text: '쟁반에 흙 언덕을 만들고, 꼭대기에 색 모래를 뿌려요.', show: ['tray', 'hill', 'cap', 'lbQ'], dur: 4,
      reset(o) { o.cap.scale.set(1, 1, 1); o.hill.scale.set(1, 1, 1); o.hill.position.y = BASE + HH / 2; o.cap.position.y = BASE + HH - 0.1; o.fan.scale.set(0.01, 1, 0.01); o.dot.scale.set(0.01, 1, 0.01); } },
    { text: '컵으로 언덕 위쪽에서 물을 천천히 흘려보내요.', show: ['cup', 'stream'], dur: 4 },
    { text: '물이 흐르면서 위쪽의 흙과 색 모래를 깎아 내요.', show: ['lbCut'], hide: ['lbQ'], dur: 5,
      anim(p, o) { const s = lerp(1, 0.25, p); o.cap.scale.set(s, s, s); const sy = lerp(1, 0.9, p); o.hill.scale.set(1, sy, 1); o.hill.position.y = BASE + HH * sy / 2; o.cap.position.y = BASE + HH * sy - 0.1; } },
    { text: '깎인 흙은 흐르는 물을 따라 아래로 옮겨져요.', show: ['down', 'lbMove'], hide: ['lbCut'], dur: 5 },
    { text: '물이 느려지는 아래쪽에 흙과 색 모래가 쌓여요.', show: ['fan', 'dot', 'lbPile'], hide: ['lbMove', 'cup', 'stream'], dur: 6,
      anim(p, o) { const s = Math.max(0.01, p); o.fan.scale.set(s, 1, s); o.dot.scale.set(s, 1, s); } },
  ],
};
