// 씨앗은 몇 도에서 잘 싹틀까?(초등) — 담근 물의 온도 4·22·40·60℃, 그 뒤 같은 곳에서 기르기. 2026-10-23 초등 수준으로 고침(버너·95℃ 없음).
import { PALETTE as P, box, cylinder, sphere, vessel, liquid, label, heatColor, THREE, mat } from './_kit.js';

const TEMPS = [4, 22, 40, 60];
// 발아 정도(정성): 찬물은 견디고, 실온~따뜻한 물이 가장 좋고, 60℃부터 크게 준다
const GERM = { 4: 0.8, 22: 0.9, 40: 0.75, 60: 0.2 };

export default {
  view: { theta: 0.3, phi: 1.15, dist: 10, target: [0, 1.2, 0] },
  build(kit, world) {
    const rack = box(6.4, 0.12, 1.4, P.wood); rack.position.y = 0.06; world.add('rack', rack);
    TEMPS.forEach((T, i) => {
      const x = -2.1 + i * 1.4; const g = new THREE.Group();
      const bath = vessel(0.5, 1.2, { opacity: 0.25 }); bath.position.y = 0.7; const water = liquid(0.48, 1.0, heatColor((T - 4) / 56).getHex(), 0.6); water.position.y = 0.12; water.setFill(1);
      const tube = vessel(0.16, 1.4, { opacity: 0.4 }); tube.position.y = 1.0; g.add(bath, water, tube);
      const seeds = new THREE.Group(); for (let k = 0; k < 6; k++) { const s = sphere(0.07, P.seed); s.scale.set(1, 0.7, 0.8); s.position.set((k % 2) * 0.1 - 0.05, 0.4 + Math.floor(k / 2) * 0.13, 0); seeds.add(s); } seeds.position.y = 2.6; g.add(seeds);
      const tag = label(`${T}℃`, { size: 0.28 }); tag.position.set(0, 1.75, 0.6); g.add(tag);
      g.position.x = x; g.userData = { seeds, water, T }; world.add('bath' + T, g);
    });
    const lbHeat = label('같은 씨앗 10개씩을 4·22·40·60℃ 물에 30분 담근다 (온도만 다르게)', { size: 0.28 }); lbHeat.position.set(0, 3.4, 0); world.add('lbHeat', lbHeat);
    // 페트리 접시와 싹
    TEMPS.forEach((T, i) => {
      const x = -2.1 + i * 1.4; const g = new THREE.Group();
      const dish = cylinder(0.5, 0.5, 0.12, 0xe8eef2, { opacity: 0.7 }); dish.position.y = 0.06; const cotton = cylinder(0.45, 0.45, 0.08, 0xffffff); cotton.position.y = 0.14; g.add(dish, cotton);
      const sprouts = new THREE.Group(); for (let k = 0; k < 5; k++) { const st = cylinder(0.025, 0.03, 1, P.leaf); st.geometry.translate(0, 0.5, 0); const lf = sphere(0.08, P.leaf); lf.scale.set(1.6, 0.6, 1); lf.position.y = 1; st.add(lf); st.position.set((k - 2) * 0.16, 0.18, (k % 2) * 0.2 - 0.1); st.scale.setScalar(0.001); sprouts.add(st); } g.add(sprouts);
      const tag = label(`${T}℃`, { size: 0.26 }); tag.position.set(0, 0.0, 0.8); g.add(tag);
      g.position.set(x, 0.12, 2.2); g.userData = { sprouts, T }; world.add('dish' + T, g);
    });
    const lbGrow = label('같은 곳에서 7일 기르면… 4·22·40℃를 거친 씨앗은 잘 튼다', { size: 0.28 }); lbGrow.position.set(0, 3.4, 0); world.add('lbGrow', lbGrow);
    const lbWhy = label('60℃: 씨앗 속 싹을 틔우는 재료가 열에 상해 거의 안 튼다', { size: 0.3 }); lbWhy.position.set(0, 3.9, 0); world.add('lbWhy', lbWhy);
    const lbCold = label('찬물(4℃)은 견딘다 — 겨울을 땅속에서 난 씨앗이 봄에 트는 것처럼', { size: 0.28 }); lbCold.position.set(0, 3.4, 0); world.add('lbCold', lbCold);
    const lbFire = label('날마다 같은 시각에 싹튼 개수를 세고 사진을 찍는다', { size: 0.26 }); lbFire.position.set(0, 3.9, 0); world.add('lbFire', lbFire);
    const lb3 = label('발아 3조건: 물 · 공기 · 알맞은 온도', { size: 0.32 }); lb3.position.set(0, 3.4, 0); world.add('lb3', lb3);
    return {};
  },
  revealAt: 3,
  beats: [
    { text: '씨앗이 싹트려면 물, 공기, 알맞은 온도가 필요해요. 그런데 「알맞은」 온도는 몇 도일까요? 씨앗을 서로 다른 온도의 물에 담갔다가 길러 봐요.', show: ['rack', 'lb3', ...TEMPS.map((T) => 'bath' + T)], dur: 6 },
    { text: '공정한 실험. 같은 강낭콩 10개씩을 같은 시간(30분) 담가요. 다르게 하는 것은 물의 온도뿐이에요. 4도(냉장고 물), 22도(실온), 40도(따뜻한 물), 60도(뜨거운 물, 보호자와 함께).', show: ['lbHeat'], hide: ['lb3'], dur: 6, anim(p, o) { TEMPS.forEach((T) => { o['bath' + T].userData.seeds.position.y = 2.6 - 2.2 * p; }); } },
    { text: '꺼낸 씨앗을 물 적신 솜 위 접시에 옮기고, 접시 4개를 모두 같은 곳에 두어요. 어느 접시에서 싹이 가장 많이 틀지 먼저 예상해 봐요.', show: TEMPS.map((T) => 'dish' + T), hide: ['lbHeat'], dur: 6 },
    { text: '7일 뒤. 22도와 40도를 거친 씨앗은 대부분 싹텄고, 4도 찬물에 담갔던 씨앗도 잘 텄어요.', show: ['lbGrow'], dur: 6, anim(p, o) { TEMPS.forEach((T) => { o['dish' + T].userData.sprouts.children.forEach((s, k) => { const g = GERM[T]; s.scale.setScalar(k < Math.round(5 * g) ? Math.max(0.001, p * (0.6 + 0.4 * g)) : 0.001); }); }); } },
    { text: '60도 뜨거운 물에 담갔던 씨앗은 거의 싹트지 않았어요. 씨앗 속에서 싹을 틔우는 재료가 열에 상했기 때문이에요. 삶은 콩이 싹을 못 틔우는 것과 같아요.', show: ['lbWhy'], dur: 6 },
    { text: '찬물은 왜 괜찮을까요? 가을에 떨어진 씨앗은 땅속에서 추운 겨울을 지나고 봄에 싹터요. 추위는 씨앗을 죽이지 않고, 오히려 깨우는 신호가 되기도 해요.', show: ['lbCold'], hide: ['lbGrow', 'lbWhy'], dur: 6 },
    { text: '기록이 중요해요. 날마다 같은 시각에 접시마다 싹튼 개수를 세어 표에 적고 사진을 찍어요. 숫자가 있어야 「어느 온도가 가장 좋았다」고 말할 수 있어요.', show: ['lbFire'], dur: 6 },
    { text: '알게 된 점. 싹트기에 알맞은 온도 범위가 있고, 뜨거운 물은 씨앗을 상하게 하지만 찬물은 견뎌요. 탐구보고서에 예상·결과·알게 된 것을 정리해 봐요.', show: ['lb3'], hide: ['lbCold', 'lbFire'], dur: 5 },
  ],
};
