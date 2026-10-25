// 자연관찰 공원 지도 화면 — 자연관찰대회 폴더(#/contest/nature) 맨 위.
// 두 아이가 입구에서 광장까지 걸어 들어오면, 지점마다 점 + 말꼬리 표가 떠오른다. 표를 누르면 그 자리에서 할 관찰(연습 세트)이 열린다.
// 3D는 scenes/park-map.js. 지도를 못 그리는 기기(WebGL 없음)에서는 같은 지점들을 목록으로 보여 준다.
import { Stage } from './engine.js';
import { buildPark, SPOTS, SCALE } from './scenes/park-map.js';
import { OBSERVE_SETS } from './data/observe-sets.js';
import { THREE } from './scenes/_kit.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 두 아이가 그 자리에서 떠올린 물음(관찰의 출발점). 답은 연습 세트에서 직접 확인한다.
const ASK = {
  gate: ['나래', '오늘 과제는 어디서 받아?', '도윤', '안내판부터 읽자. 시간·내는 것·심사 기준!'],
  pond: ['나래', '연잎은 왜 물에 안 가라앉지?', '도윤', '잎자루를 잘라 보면 알 수 있을까?'],
  meadow: ['도윤', '그늘엔 갈색 곤충, 햇빛엔 연두색 곤충?', '나래', '두 곳을 같은 방법으로 재 보자.'],
  flowers: ['나래', '잎이 줄기에 붙는 차례가 다 달라!', '도윤', '마디마다 몇 장인지 세어 보자.'],
  leaves: ['도윤', '이 두 잎, 눈으론 구분이 안 돼.', '나래', '길이랑 폭을 재서 비율로 바꿔 보자.'],
  garden: ['나래', '그늘에 둔 콩이 제일 키가 커!', '도윤', '그럼 제일 튼튼한 걸까? 날마다 재 보자.'],
  picnic: ['도윤', '어제 남긴 빵에 하얀 게 생겼어.', '나래', '만지지 말고 날마다 넓이를 기록하자.'],
};

export function mountPark($host) {
  const sets = Object.fromEntries(OBSERVE_SETS.map((s) => [s.id, s]));
  $host.innerHTML = `<div class="pk-stage"><canvas aria-label="자연관찰 공원 3D 지도 — 끌어서 돌리기, 말꼬리 표를 누르면 그 자리의 관찰이 열려요"></canvas>
      <div class="pk-pins">${SPOTS.map((p) => `<button type="button" class="pk-pin ${p.id}" data-spot="${p.id}" aria-label="${esc(p.name)}"><span class="pk-tag"><i>${p.icon}</i><b class="full">${esc(p.name)}</b><b class="short">${esc(p.short)}</b></span><span class="pk-dot"></span></button>`).join('')}</div>
      <p class="pk-intro" aria-live="polite">두 친구가 자연관찰 공원에 들어가요…</p>
      <button type="button" class="pk-replay" hidden>↺ 다시 걸어 들어가기</button>
    </div>
    <div class="pk-panel" hidden aria-live="polite"></div>
    <noscript></noscript>`;
  const $c = $host.querySelector('canvas'), $pins = [...$host.querySelectorAll('.pk-pin')], $panel = $host.querySelector('.pk-panel'), $intro = $host.querySelector('.pk-intro'), $replay = $host.querySelector('.pk-replay');
  const open = (id) => {
    const p = SPOTS.find((x) => x.id === id), S = p.set ? sets[p.set] : null, q = ASK[id] || [];
    $pins.forEach((b) => b.classList.toggle('on', b.dataset.spot === id));
    $panel.hidden = false;
    $panel.innerHTML = `<div class="pk-talk"><p><b>${esc(q[0])}</b>${esc(q[1])}</p><p><b>${esc(q[2])}</b>${esc(q[3])}</p></div>
      <h3><i>${p.icon}</i>${esc(p.name)}${S ? `<small>${S.level === 'mid' ? '중등' : '초등'} · ${esc(S.title)}</small>` : '<small>대회 안내</small>'}</h3>
      ${S ? `<p class="pk-lead">${esc(S.lead)}</p><ol class="pk-steps">${S.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <div class="pk-go"><a class="pk-btn" href="#/observe/${S.id}">이 자리에서 관찰하기 →</a><span>표본 ${S.mod.SPECIMENS.length}종 · 3D 모형 · 실사 사진 · 예시 보고서</span></div>`
        : `<p class="pk-lead">대회 날은 주제와 장소를 그 자리에서 받아요. 아래 안내에서 누가 나가는지, 얼마나 걸리는지, 무엇을 내는지, 심사에서 무엇을 보는지 먼저 읽어요.</p>
        <div class="pk-go"><a class="pk-btn" href="#/contest/nature">대회 안내 읽기 ↓</a></div>`}`;
    if (!S) $panel.querySelector('.pk-btn').onclick = (e) => { e.preventDefault(); document.getElementById('ct-guide')?.scrollIntoView({ behavior: 'smooth' }); };
  };
  $pins.forEach((b) => b.addEventListener('click', () => open(b.dataset.spot)));

  if (!Stage.canWebGL()) { $host.classList.add('pk-flat'); $intro.textContent = '지점을 골라 그 자리의 관찰을 열어요.'; $pins.forEach((b) => b.classList.add('show')); return { destroy() {} }; }
  const stage = new Stage($c), park = buildPark(stage.root);
  // 세로 화면(폰)은 더 위에서 내려다본다 — 지도가 가로로 넓어서
  stage.setView({ theta: 0.12, phi: $c.clientWidth / Math.max(1, $c.clientHeight) < 0.8 ? 0.62 : 0.92, dist: 12, target: [0, 0, 0], frame: [[-11 * SCALE, 0, -9.5 * SCALE], [11 * SCALE, 2.5 * SCALE, 10.5 * SCALE]] });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = null, shown = false;
  const v = new THREE.Vector3(), at = Object.fromEntries(SPOTS.map((p) => [p.id, new THREE.Vector3(...p.at).multiplyScalar(SCALE)]));
  const showPins = () => { shown = true; $intro.textContent = '말꼬리 표를 눌러 보세요 — 그 자리에서 할 관찰이 열려요.'; $replay.hidden = false; $pins.forEach((b, i) => setTimeout(() => b.classList.add('show'), reduced ? 0 : i * 140)); };
  const walk = () => { t0 = null; shown = false; $replay.hidden = true; $pins.forEach((b) => b.classList.remove('show')); $intro.textContent = '두 친구가 자연관찰 공원에 들어가요…'; };
  stage.update = (dt, t) => {
    if (t0 === null) { const r = $c.getBoundingClientRect(); if (r.top > innerHeight * 0.7) return; t0 = t; }   // 지도가 화면에 들어오면 걷기 시작
    const w = reduced ? 1 : Math.min(1, (t - t0) / 6);
    park.walk(w); park.update(dt, t);
    if (w >= 1 && !shown) showPins();
    const W = $c.clientWidth, H = $c.clientHeight;
    for (const b of $pins) {
      v.copy(at[b.dataset.spot]).project(stage.camera);
      const off = v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05;
      b.style.transform = `translate(${((v.x + 1) / 2) * W}px, ${((1 - v.y) / 2) * H}px)`; b.style.visibility = off ? 'hidden' : '';
    }
  };
  $replay.onclick = walk;
  return { destroy() { stage.dispose(); } };
}
