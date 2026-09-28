/* 수학 이야기 3D — 앱에서 직접 띄워 움직이기(2026-09-26, 원장 "동작도 하는거야?" → "1").
   app/main.js stepDiscover 가 .nm-mzu-hero(정지 그림 img 가 들어 있는 figure)를 넘기면
   같은 장면(scenes.js)을 캔버스에 만들어 onFrame 움직임을 돌리고, 끌어서 돌려 볼 수 있게 한다.
   - 3D 를 못 쓰면(WebGL 없음·만들다 오류) 아무것도 안 한다 — 정지 그림이 그대로 남는다.
   - 동작 줄이기(prefers-reduced-motion)면 장면은 띄우되 저절로 움직이지 않는다(끌어서 돌리기만).
   - 화면 밖·다른 탭이면 멈추고, figure 가 문서에서 빠지면(다음 단계로) 자원을 모두 푼다. */
import { makeKit, fontsReady } from './kit.js';
import { SCENES } from './scenes.js';

/* 자막 한 줄 → HTML. $…$ 안은 수식 — 앱이 이미 싣는 KaTeX 로(분수는 세로 분수, 문자는 수학 이탤릭).
   KaTeX 가 아직 없으면 읽을 수 있는 글자로(\dfrac{a}{b} → a/b) — 이때만 빗금이 보인다. */
const escH = t => String(t).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c]);
const plainTex = t => t.replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\cdots/g, '…')
  .replace(/\\dot\{(\w)\}/g, '$1\u0307').replace(/\\ /g, ' ').replace(/[{}\\]/g, '');
export function capHtml(txt){
  return String(txt).split('$').map((part, i) => {
    if(!(i % 2)) return escH(part);
    try { if(window.katex) return window.katex.renderToString(part, { throwOnError:false }); } catch(e){}
    return escH(plainTex(part));
  }).join('');
}

const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };

/* 글꼴(KaTeX)을 다 불러온 뒤에 장면을 만든다 — 먼저 그리면 수식 글자가 다른 글꼴로 캔버스에 박힌다 */
export async function mount(fig, uid, lang){
  const def = SCENES[uid];
  if(!def || !fig || fig.__hero3d || !glOK()) return false;
  fig.__hero3d = true;
  await fontsReady();
  if(!fig.isConnected){ fig.__hero3d = false; return false; }
  const img = fig.querySelector('img');
  const canvas = document.createElement('canvas');
  canvas.className = 'nm-mzu-hero-live';
  canvas.setAttribute('role', 'img');
  if(img) canvas.setAttribute('aria-label', img.alt || '');
  const size = () => { const w = Math.max(200, fig.clientWidth || 640); return [w, Math.round(w / 1.6)]; };
  let [cw, ch] = size();
  let k;
  try {
    k = makeKit(def.seed || 7, { live:true, canvas, width:cw, height:ch });
    def.build(k);
  } catch(e){ fig.__hero3d = false; return false; }
  const { r, scene, cam, frames } = k;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 끌어서 돌리기 — 처음 구도에서 좌우 ±26°(더 돌리면 책상 가장자리 너머 빈 배경이 보인다), 위아래 12°~75° 사이 */
  const target = k.orbitTarget();
  const off = cam.position.clone().sub(target);
  const r0 = off.length(), yaw0 = Math.atan2(off.x, off.z), pitch0 = Math.asin(Math.min(1, Math.max(-1, off.y / r0)));
  let yaw = yaw0, pitch = pitch0, drag = null, lastUser = -1e9;
  const place = () => {
    cam.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * r0, target.y + Math.sin(pitch) * r0, target.z + Math.cos(yaw) * Math.cos(pitch) * r0);
    cam.lookAt(target);
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  canvas.addEventListener('pointerdown', e => { drag = { x:e.clientX, y:e.clientY, yaw, pitch }; canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); lastUser = performance.now(); });
  canvas.addEventListener('pointermove', e => {
    if(!drag) return;
    const dx = (e.clientX - drag.x) / canvas.clientWidth, dy = (e.clientY - drag.y) / canvas.clientHeight;
    yaw = clamp(drag.yaw - dx * 1.6, yaw0 - 0.45, yaw0 + 0.45);
    pitch = clamp(drag.pitch + dy * 1.6, 0.21, 1.3);
    place(); lastUser = performance.now(); wake();
  });
  const end = () => { drag = null; lastUser = performance.now(); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  /* 두 번 누르면 처음 구도로 */
  canvas.addEventListener('dblclick', () => { yaw = yaw0; pitch = pitch0; place(); wake(); });

  fig.classList.add('is-live');
  fig.appendChild(canvas);

  /* 자막 안내(원장 "자동으로 재생 또는 안내도" → "1") — 장면의 caps.list = [[한 바퀴 안 위치 0~1, ko, en, zh], …].
     움직임과 같은 한 바퀴(caps.P 초)를 따라 한 줄씩 바뀐다. 동작 줄이기면 단계를 모두 한 번에 보여 준다. */
  const caps = def.caps && def.caps.list && def.caps.list.length ? def.caps : null;
  const li = { ko:1, en:2, zh:3 }[lang] || 1;
  let capEl = null, capSpan = null, capNo = null, capIdx = -1;
  if(caps){
    capEl = document.createElement('div'); capEl.className = 'nm-mzu-hero-cap';
    capNo = document.createElement('i'); capSpan = document.createElement('span');
    capEl.append(capNo, capSpan); fig.appendChild(capEl);
    if(reduce){ capNo.textContent = caps.list.length + ''; capSpan.innerHTML = caps.list.map(c => capHtml(c[li])).join('  →  '); }
  }
  const showCap = t => {
    if(!caps || reduce) return;
    const p = (t % caps.P) / caps.P; let i = 0;
    caps.list.forEach((c, j) => { if(c[0] <= p) i = j; });
    if(i === capIdx) return;
    const first = capIdx < 0; capIdx = i;
    const put = () => { capNo.textContent = (i + 1) + '/' + caps.list.length; capSpan.innerHTML = capHtml(caps.list[i][li]); capSpan.classList.remove('fade'); };
    if(first) put(); else { capSpan.classList.add('fade'); setTimeout(put, 250); }
  };

  let running = true, visible = true, raf = 0, t0 = performance.now(), last = t0, shown = false;
  const frame = now => {
    raf = 0;
    if(!fig.isConnected){ dispose(); return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    /* 손을 뗀 뒤 4초가 지나면 천천히 처음 구도로 돌아간다 */
    if(!drag && now - lastUser > 4000 && (Math.abs(yaw - yaw0) > 1e-3 || Math.abs(pitch - pitch0) > 1e-3)){
      yaw += (yaw0 - yaw) * Math.min(1, dt * 1.5); pitch += (pitch0 - pitch) * Math.min(1, dt * 1.5); place();
    }
    if(!reduce){ const t = (now - t0) / 1000; for(const f of frames) f(t, dt); showCap(t); }
    r.render(scene, cam);
    if(!shown){ shown = true; canvas.classList.add('on'); }
    if(running && visible && (!reduce || drag || now - lastUser < 4600)) raf = requestAnimationFrame(frame);
  };
  const wake = () => { if(!raf && running && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { visible = es.some(x => x.isIntersecting); if(visible) wake(); }) : null;
  if(io) io.observe(fig);
  const onVis = () => { running = !document.hidden; if(running) wake(); };
  document.addEventListener('visibilitychange', onVis);
  const onResize = () => { const [w, h] = size(); if(w !== cw){ cw = w; ch = h; r.setSize(cw, ch, false); wake(); } };
  window.addEventListener('resize', onResize);

  function dispose(){
    if(raf) cancelAnimationFrame(raf); raf = 0; running = false;
    if(io) io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('resize', onResize);
    scene.traverse(o => { if(o.geometry) o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(mm => { for(const key in mm){ const v = mm[key]; if(v && v.isTexture) v.dispose(); } mm.dispose(); }); });
    if(scene.environment) scene.environment.dispose();
    r.dispose(); r.forceContextLoss && r.forceContextLoss();
  }
  wake();
  return true;
}
