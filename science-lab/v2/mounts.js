import {watchDetached} from '../engine.js';
// 3D 장면·체험 실험실을 어느 화면에서나(5단계 화면·수업 화면·교재·광고 페이지) 같은 방식으로 띄운다.
import { mountRingTower } from './lab-ring-tower.js';
import { mountHumidifier } from './lab-humidifier.js';
import { mountShadow } from './lab-shadow.js';
import { mountQuake } from './lab-quake.js';
import { mountCycle } from './lab-cycle.js';
import { mountSplash } from './lab-splash.js';
import { mountHeat } from './lab-heat.js';
import { mountSun } from './lab-sun.js';
import { mountSnow } from './lab-snow.js';
import { mountBread } from './lab-bread.js?v=20261104-biology-class';
import { mountSeaLevel } from './lab-sealevel.js';
import { mountGlitter } from './lab-glitter.js';
import { mountMaterial } from './lab-material.js';
import { mountSeawater } from './lab-seawater.js';
import { mountRuler } from './lab-ruler.js';
import { mountMoon } from './lab-moon.js';
import { mountMeadow } from './lab-meadow.js';
import { mountBubble } from './lab-bubble.js';
import { mountFreeze } from './lab-freeze.js';
import { mountHill3D } from './lab-hill3d.js';
import { mountPond3D } from './lab-pond3d.js';
import { mountVolcano3D } from './lab-volcano3d.js';
import { mountLife } from './lab-life.js';
import { mountForce } from './lab-force.js';
import { mountAnimal } from './lab-animal.js';
import {mountInquiry} from './lab-inquiry.js';
import { mountPlant } from './lab-plant.js';
export const LABS = { sealevel: mountSeaLevel, glitter: mountGlitter, material: mountMaterial, seawater: mountSeawater, ruler: mountRuler, moon: mountMoon, meadow: mountMeadow, inquiry: mountInquiry, plant: mountPlant, animal: mountAnimal, force: mountForce, life: mountLife, 'ring-tower': mountRingTower, freeze: mountFreeze, hill: mountHill3D, pond: mountPond3D, volcano: mountVolcano3D, humidifier: mountHumidifier, shadow: mountShadow, quake: mountQuake, cycle: mountCycle, splash: mountSplash, heat: mountHeat, sun: mountSun, snow: mountSnow, bread: mountBread, bubble: mountBubble };
// 3D 실험실(캔버스가 있는 것)에는 「전체 화면」 단추를 붙인다. 실험실 파일은 건드리지 않고 마운트 뒤에 끼운다.
export const mountLabOf = (kind) => {
  const f = LABS[kind] || mountRingTower;
  return (el, opts) => { const r = f(el, opts); Promise.resolve(r).then(() => { if (el.isConnected && el.querySelector('.lab3d canvas')) addLandscape(el, el.querySelector('.lab3d-btns')); }, () => {}); return r; };
};

// 전체 화면 — 3D 캔버스가 화면 전체를 채우고, 설명·단추·표는 그 위에 뜬 작은 조작판(접을 수 있음)에 모인다.
// (원장 2026-09-28: "가로로 넓게가 아니라 전체 화면으로") 가로 고정은 하지 않는다 — 들고 있는 방향 그대로 꽉 찬다.
// 전체 화면 API 가 없는 기기(iPhone Safari 등)는 화면을 덮는 겹침 화면으로 대신한다.
// 캔버스는 조작판 밖(호스트 바로 아래)으로 잠깐 옮긴다 — 조작판 안에 있으면 조작판 배경 위에 그려져 가려진다.
// 닫으면 모든 요소를 원래 자리로 되돌린다(요소를 옮길 뿐이라 실험실 코드의 참조·이벤트는 그대로 산다).
const landscapeOwners = new WeakMap();
export function addLandscape(host, into) {
  if (!host || !into || into.querySelector('.fl-open')) return;
  landscapeOwners.get(host)?.dispose();
  const b = document.createElement('button'); b.type = 'button'; b.className = 'btn fl-open'; b.innerHTML = '<span class="fl-ico" aria-hidden="true">⛶</span>전체 화면';
  const x = document.createElement('button'); x.type = 'button'; x.className = 'btn fl-close'; x.textContent = '✕ 닫기';
  const fold = document.createElement('button'); fold.type = 'button'; fold.className = 'fl-fold'; fold.setAttribute('aria-expanded', 'true');
  into.appendChild(b); host.append(x);
  let active = true, on = false, nativeOwned = false, panel = null, canvasMark = null, canvas = null, releaseDetach = () => {};
  const setFold = (open) => { panel?.classList.toggle('min', !open); fold.setAttribute('aria-expanded', String(open)); fold.textContent = open ? '조작판 접기 ▾' : '조작판 펴기 ▴'; };
  fold.onclick = () => { if (active && on) setFold(panel?.classList.contains('min')); };
  const exitOwnFullscreen = () => {
    if (document.fullscreenElement !== host) return;
    const owner = landscapeOwners.get(host);
    if (owner && owner.dispose !== dispose && owner.opened()) return;
    try { Promise.resolve(document.exitFullscreen?.()).catch(() => {}); } catch (_) {}
  };
  const exit = ({ restoreFocus = true, nativeExit = true } = {}) => {
    if (!on) { if (nativeExit) exitOwnFullscreen(); return; }
    on = false; nativeOwned = false;
    if (panel) { if (panel.parentNode === host && x.parentNode === host) for (const n of [...panel.childNodes]) if (n !== fold) host.insertBefore(n, x); panel.remove(); panel = null; }
    if (canvas && canvasMark?.parentNode) { canvasMark.parentNode.insertBefore(canvas, canvasMark); canvasMark.remove(); canvas.dispatchEvent(new Event('stage:moved')); }
    canvas = canvasMark = null;
    host.classList.remove('full-land');
    const another = document.querySelector('.full-land');
    if (!another) document.documentElement.classList.remove('fl-lock');
    if (nativeExit) exitOwnFullscreen();
    if (restoreFocus && active && b.isConnected && !another) b.focus({ preventScroll: true });
  };
  const enter = async () => {
    if (!active || on || !b.isConnected) return; on = true;
    canvas = host.querySelector('canvas');
    if (canvas) { canvasMark = document.createComment('fl-canvas'); canvas.parentNode.insertBefore(canvasMark, canvas); host.prepend(canvas); canvas.dispatchEvent(new Event('stage:moved')); }   // 엔진이 보임 여부·화면 맞춤을 새로 잡게
    panel = document.createElement('div'); panel.className = 'fl-panel'; panel.append(fold);
    for (const n of [...host.childNodes]) if (n !== canvas && n !== x && n !== panel) panel.appendChild(n);
    host.append(panel); setFold(true);
    host.classList.add('full-land'); document.documentElement.classList.add('fl-lock'); x.focus({ preventScroll: true });
    try { if (host.requestFullscreen) await host.requestFullscreen({ navigationUI: 'hide' }); } catch (_) {}
    if (!active || !on || !b.isConnected) exitOwnFullscreen();
  };
  const onFullscreen = () => {
    if (!active || !on) return;
    const owner = document.fullscreenElement;
    if (owner === host) nativeOwned = true;
    else if (owner) nativeOwned = false;
    else if (nativeOwned) exit({ nativeExit: false });
  };
  const onKey = (e) => { if (active && e.key === 'Escape') exit(); };
  const dispose = () => {
    if (!active) return;
    active = false; exit({ restoreFocus: false });
    document.removeEventListener('fullscreenchange', onFullscreen); host.removeEventListener('keydown', onKey);
    releaseDetach();
    if (landscapeOwners.get(host)?.dispose === dispose) landscapeOwners.delete(host);
    b.onclick = x.onclick = fold.onclick = null;
    b.remove(); x.remove(); fold.remove();
  };
  b.onclick = enter; x.onclick = () => { if (active) exit(); };
  document.addEventListener('fullscreenchange', onFullscreen); host.addEventListener('keydown', onKey);
  landscapeOwners.set(host, { dispose, opened: () => active && on });
  releaseDetach = watchDetached(b, dispose);
  return dispose;
}
const REDUCED = matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// 조작 안내는 기기에 맞게: 마우스면 Ctrl+휠, 손가락이면 두 손가락
const HINT3D = matchMedia?.('(pointer: fine)').matches ? '끌어서 돌리기 · Ctrl+휠 확대 · 두 번 클릭하면 처음 시점' : '옆으로 끌어 돌리기 · 두 손가락으로 확대';

// 3D (기존 engine.js 재사용)
// preview: true → 답이 나오기 전(장면의 revealAt)까지만, 숫자 → 그 단계 수만큼(광고 페이지). 끝나면 질문으로 멈춘다.
// from: 'reveal' → 답이 나오는 단계부터(가설·실험 뒤 「3D로 확인하기」).
export async function mount3D(el, sceneName, { autoplay, preview = false, from = null, onDone } = {}) {
  el.innerHTML = `<div class="stage3d"><div class="stage3d-view"><canvas aria-label="3D 실험 장면. 끌어서 돌려 볼 수 있어요."></canvas><span class="stage3d-hint">${HINT3D}</span></div><p class="cap"><b class="stage3d-step">1/1</b><span>장면을 준비하고 있어요…</span></p>
    <div class="ctl"><button class="btn primary" data-a="play">재생</button><button class="btn" data-a="prev">이전</button><button class="btn" data-a="next">다음</button></div></div>`;
  const view = el.querySelector('.stage3d'), canvas = view.querySelector('canvas');
  const current = () => el.isConnected && el.querySelector('.stage3d') === view;
  let stage, player, release, landscapeOff, active = true;
  const dispose = () => {
    if (!active) return;
    active = false; landscapeOff?.(); player?.stop(); stage?.dispose();
    const fullscreen = document.querySelector('.full-land');
    if (stage && (!fullscreen || fullscreen === view)) document.documentElement.classList.remove('fl-lock');
  };
  try {
    const [{ Stage, Player, watchDetached }, mod] = await Promise.all([import('../engine.js'), import(`../scenes/${sceneName}.js`)]);
    if (!current()) return;
    stage = new Stage(canvas); player = new Player(stage);
    release = watchDetached(canvas, dispose);
    if (!active || !current()) { release(); return; }
    landscapeOff = addLandscape(view, view.querySelector('.ctl'));
    const $cap = view.querySelector('.cap span'), $step = view.querySelector('.stage3d-step'), $play = view.querySelector('[data-a=play]');
    let fired = false;
    player.onChange = () => {
      if (!active || !current()) return;
      $cap.textContent = player.beats[player.index]?.text || ''; $step.textContent = `${player.index + 1}/${player.beats.length}`; $play.textContent = player.playing ? '멈춤' : '재생';
      if (player.done && !fired && onDone) { fired = true; onDone(); }
    };
    const loaded = await player.load(mod.default);
    if (loaded === false || !active || !current()) { release(); return; }
    const reveal = mod.default.revealAt ?? 3;
    if (preview) { player.beats = player.beats.slice(0, typeof preview === 'number' ? preview : reveal); player.speed = 1.15; }
    if (preview === true) {
      const base = player.onChange;
      player.onChange = () => { if (!active || !current()) return; base(); if (player.done) $cap.textContent = '여기까지! 어떻게 될지는 먼저 예상하고, 실험한 뒤에 확인해요.'; };
    }
    if (from === 'reveal' && reveal < player.beats.length) player.goto(reveal, false);
    player.onChange();
    $play.onclick = () => { if (active && current()) player.toggle(); };
    view.querySelector('[data-a=prev]').onclick = () => { if (active && current()) player.prev(); };
    view.querySelector('[data-a=next]').onclick = () => { if (active && current()) player.next(); };
    if (autoplay && !REDUCED) player.play();
  } catch (e) {
    if (release) release(); else dispose();
    if (current()) view.querySelector('.cap').textContent = '이 기기에서는 3D를 보여 줄 수 없어요. 가상 실험실로 해 봐요.';
  }
}
