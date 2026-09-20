// 3D 장면·체험 실험실을 어느 화면에서나(5단계 화면·수업 화면·교재·광고 페이지) 같은 방식으로 띄운다.
import { mountRingTower } from './lab-ring-tower.js';
import { mountFreeze } from './lab-freeze.js';
import { mountHill3D } from './lab-hill3d.js';
import { mountPond3D } from './lab-pond3d.js';
import { mountVolcano3D } from './lab-volcano3d.js';
export const LABS = { 'ring-tower': mountRingTower, freeze: mountFreeze, hill: mountHill3D, pond: mountPond3D, volcano: mountVolcano3D };
export const mountLabOf = (kind) => LABS[kind] || mountRingTower;
const REDUCED = matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// 3D (기존 engine.js 재사용)
export async function mount3D(el, sceneName, { autoplay }) {
  el.innerHTML = `<div class="stage3d"><canvas aria-label="3D 실험 장면. 끌어서 돌려 볼 수 있어요."></canvas><p class="cap">장면을 준비하고 있어요…</p>
    <div class="ctl"><button class="btn primary" data-a="play">재생</button><button class="btn" data-a="prev">이전</button><button class="btn" data-a="next">다음</button></div></div>`;
  try {
    const [{ Stage, Player }, mod] = await Promise.all([import('../engine.js'), import(`../scenes/${sceneName}.js`)]);
    if (!el.isConnected) return;
    const stage = new Stage(el.querySelector('canvas')), player = new Player(stage);
    const $cap = el.querySelector('.cap'), $play = el.querySelector('[data-a=play]');
    player.onChange = () => { $cap.textContent = player.beats[player.index]?.text || ''; $play.textContent = player.playing ? '멈춤' : '재생'; };
    await player.load(mod.default); player.onChange();
    el.querySelector('[data-a=play]').onclick = () => player.toggle();
    el.querySelector('[data-a=prev]').onclick = () => player.prev();
    el.querySelector('[data-a=next]').onclick = () => player.next();
    if (autoplay && !REDUCED) player.play();
    const off = () => { if (!el.isConnected) { player.stop(); stage.dispose(); removeEventListener('hashchange', off); } };
    addEventListener('hashchange', () => setTimeout(off));
  } catch (e) {
    el.querySelector('.cap').textContent = '이 기기에서는 3D를 보여 줄 수 없어요. 가상 실험실로 해 봐요.';
  }
}

