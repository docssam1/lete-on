// 예시 보고서 창 — 자연관찰 연습 세트의 「잘 쓴 보고서」를 보여 준다. 관찰그림은 손에 든 연필이 선을 하나씩 그려 간다(영어 스토리 화이트보드 영상과 같은 방식, 영상 없이 SVG로).
// 원장 2026-10-25: 「보고서 예시에 말하는 거야. 그려 봐야 할 거 아냐. 원래 3D는 두고.」
// 그리는 순서 = 그림 조각의 문서 순서(윤곽 → 빗금 → 이름표). .dz = 선(그린다) · .dz-f = 명암(스르륵) · .dz-t = 글씨(나타남). 연필 소리는 Web Audio 잡음(끌 수 있음).
import { sampleFor } from './data/observe-samples.js';
import { reportCfg } from './data/reports.js';
import { withMean, chartData } from './report-model.js';
import { chartSvg } from './report.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const para = (t) => esc(t).replace(/\[([^\]]+)\]/g, '<b>[$1]</b>').replace(/\n/g, '<br>');
const HAND = `<g class="pz-hand" opacity="0"><g transform="rotate(32) scale(1.15)">
  <ellipse cx="14" cy="56" rx="26" ry="34" fill="#f3d6bb" stroke="#9a7a5a" stroke-width="1.2"/>
  <path d="M0 0 L-5 15 L5 15 Z" fill="#e2c39a" stroke="#9a7a5a" stroke-width="0.8"/><path d="M0 0 L-1.8 5.5 L1.8 5.5 Z" fill="#333"/>
  <rect x="-5" y="15" width="10" height="72" fill="#f2c94c" stroke="#8a6d1f" stroke-width="0.8"/><path d="M-1.6 15 L-1.6 87" stroke="#d9ac2a" stroke-width="1"/><rect x="-5" y="87" width="10" height="7" fill="#c9c0b4" stroke="#8a8078" stroke-width="0.6"/><rect x="-5" y="94" width="10" height="9" rx="2" fill="#e88a8a" stroke="#b05a5a" stroke-width="0.6"/>
  <rect x="-12" y="18" width="24" height="12" rx="6" fill="#f3d6bb" stroke="#9a7a5a" stroke-width="1"/><rect x="-10" y="31" width="24" height="12" rx="6" fill="#f3d6bb" stroke="#9a7a5a" stroke-width="1"/><rect x="-8" y="44" width="24" height="12" rx="6" fill="#f3d6bb" stroke="#9a7a5a" stroke-width="1"/>
  <path d="M-6 20 C-16 10, -16 -2, -4 2 C2 4, 4 12, 2 18" fill="#f3d6bb" stroke="#9a7a5a" stroke-width="1"/>
</g></g>`;

// 연필 소리: 좁게 거른 잡음을 선을 긋는 동안만 연다
function scratch() {
  let ctx = null, g = null, src = null;
  const on = () => { try { const C = window.AudioContext || window.webkitAudioContext; if (!C) return; if (!ctx) { ctx = new C(); src = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; src.buffer = b; src.loop = true; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = 0.7; g = ctx.createGain(); g.gain.value = 0; src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(); } if (ctx.state === 'suspended') ctx.resume().catch(() => {}); } catch { /* 소리 없이 */ } };
  return { on, set(v) { if (g && ctx) g.gain.setTargetAtTime(v, ctx.currentTime, 0.03); }, off() { try { src?.stop(); ctx?.close(); } catch { /* */ } ctx = null; } };
}
function treeHtml(n, side = '') {
  const leaf = !n.yes;
  return `<li class="tn ${leaf ? 'leaf' : ''}">${side ? `<span class="side ${side}">${side === 'y' ? '그렇다' : '그렇지 않다'}</span>` : ''}<div class="box"><div class="chips">${n.items.map((i) => `<span class="chip ${side}">${esc(i)}</span>`).join('')}</div>${leaf ? '' : `<div class="q"><span class="qtext">${esc(n.q)}</span></div>`}</div>${n.yes ? `<ul>${treeHtml(n.yes, 'y')}${treeHtml(n.no, 'n')}</ul>` : ''}</li>`;
}
export function openSample(set) {
  const X = sampleFor(set.id); if (!X) return null;
  const cfg = reportCfg(set.id, set.level, 'nature'), mid = set.level === 'mid';
  let table = { columns: cfg.table.columns.slice(), rows: X.table.map((r) => r.slice()) }; if (mid) table = withMean(table);
  const isInsect = set.id === 'observe-insects', Tt = X.titles || {}, chart = X.chart ? chartData(table) : null;
  const $m = document.createElement('div'); $m.className = 'sk-modal rp-sample'; $m.setAttribute('role', 'dialog'); $m.setAttribute('aria-label', '예시 보고서');
  let n = 0; const sec = (title, ask, body) => `<section class="rp-cell kind-text"><h3>${++n}. ${esc(title)}${ask ? `<small>${esc(ask)}</small>` : ''}</h3><div class="rp-body">${body}</div></section>`;
  const view = (t) => `<div class="rp-view sv">${para(t)}</div>`;
  const tableSec = () => sec(Tt.table || (mid ? '측정 기록' : '채집·관찰 기록표'), Tt.tableAsk || '', `<div class="rp-table-wrap"><table class="rp-table"><thead><tr>${table.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${table.rows.map((r) => `<tr>${r.map((v, j) => `<td class="${table.columns[j] === '평균' ? 'mean' : ''}">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${chart ? `<div class="rp-chart">${chartSvg(chart)}</div>` : ''}`);
  $m.innerHTML = `<div class="sk-box rp-sample-box">
    <header class="sk-head"><b>📄 예시 보고서 — ${esc(set.title)}</b><span class="sk-sp"></span>
      <button type="button" class="sk-btn" data-act="replay">▶ 처음부터 그리기</button><button type="button" class="sk-btn" data-act="skip">⏭ 바로 다 보기</button>
      <button type="button" class="sk-btn" data-act="snd" aria-pressed="true">🔈 연필 소리</button><button type="button" class="sk-btn" data-act="print">인쇄</button><button type="button" class="sk-btn primary" data-act="close">닫기</button></header>
    <p class="rp-g-lead">잘 쓴 보고서의 한 예예요. <b>베끼지 말고</b>, 그림에는 무엇을 표시했고 글에는 무엇을 썼는지 보세요. 설명은 <b>본 것 → 확인한 것 → 추정</b>으로 나눠 썼고, 이름을 몰라도 번호로 불렀어요.</p>
    <article class="rp-sheet form-nature sample" id="rp-sample-sheet">
      <header class="rp-head"><div><div class="kind">자연관찰대회 · ${mid ? '중등 자연관찰 탐구 보고서' : '초등 자연관찰 보고서'} · 예시</div><h1>${esc(set.unit.title)}</h1></div>
        <div class="rp-who"><span>이름</span><i>${esc(X.who.name)}</i><span>학년·반</span><i>${esc(X.who.grade)}</i><span>날짜</span><i>${esc(X.who.date)}</i></div></header>
      ${sec('관찰 장소와 대상', '', view(X.target))}
      ${X.tableAfter == null ? tableSec() : ''}
      ${sec('관찰그림과 설명', Tt.obsAsk || '왼쪽 그림: 전체 모습·확대·이름표·자. 오른쪽 글: 본 것 → 확인한 것 → 추정.', `<div class="rp-obs"><div class="rp-obs-head"><span>관찰그림</span><span>설명</span></div>${X.obs.map((o, i) => `<div class="rp-obs-row" data-obs="${i}"><div class="rp-obs-fig"><b class="rp-obs-label">${esc(o.label)}</b><div class="pz-wrap" data-draw="${i}">${o.draw()}</div></div><div class="rp-obs-text">${view(o.text)}</div></div>`).join('')}</div>`)}
      ${(X.extra || []).map((e, i) => sec(e.title, e.ask || '', `${e.draw ? `<div class="pz-wrap wide" data-draw="x${i}">${e.draw()}</div>` : ''}${view(e.text)}`) + (X.tableAfter === i ? tableSec() : '')).join('')}
      ${X.env ? sec(Tt.env || '두 장소 비교', Tt.envAsk || '확인한 방법 → 결과 → 아마 ~때문', view(X.env)) : ''}
      ${X.tree ? sec(Tt.classify || '분류 나무', Tt.classifyAsk || '그렇다 / 그렇지 않다로 끝까지 나누고, 기준을 고른 까닭을 썼어요.', `<ul class="rp-tree">${treeHtml(X.tree)}</ul>${view(X.classify)}`) : ''}
      ${sec(Tt.venn || '같은 점과 다른 점', '', `<div class="rp-venn static"><div class="ring a"></div><div class="ring b"></div><b class="rp-venn-name a">${esc(X.venn.la)}</b><b class="rp-venn-name b">${esc(X.venn.lb)}</b>
        <div class="rp-venn-zone a"><b>ㄱ만</b>${view(X.venn.a)}</div><div class="rp-venn-zone both"><b>같은 점</b>${view(X.venn.both)}</div><div class="rp-venn-zone b"><b>ㄴ만</b>${view(X.venn.b)}</div></div>`)}
      ${X.adapt ? sec(Tt.adapt || (isInsect ? '생김새와 하는 일' : mid ? '구조와 기능 → 유리한 점' : '잎 모양·잎차례의 유리한 점'), '', `${X.adaptDraw ? `<div class="pz-wrap wide" data-draw="fn">${X.adaptDraw()}</div>` : ''}${view(X.adapt)}`) : ''}
      ${sec('더 알아보고 싶은 것', '의문 → 바꿀 것·잴 것·같게 할 것', view(X.next))}
      <div class="rp-foot"><span>GFIELD · 자연관찰대회 연습 · 예시 보고서</span><span>그림·글 모두 지필드가 새로 쓴 예시입니다</span></div>
    </article></div>`;
  document.body.appendChild($m); document.body.classList.add('sk-open');
  const snd = scratch(); let soundOn = true;
  // ── 그리기 애니메이션 ──
  const svgs = [...$m.querySelectorAll('.pz-wrap svg')];
  const plans = svgs.map((svg) => {
    svg.insertAdjacentHTML('beforeend', HAND); const hand = svg.querySelector('.pz-hand');
    const ops = [];
    const walk = (el) => { for (const c of el.children) { if (c.classList?.contains('dz')) { const shapes = [...c.querySelectorAll('path, circle, line, polyline')].filter((s) => typeof s.getTotalLength === 'function'); ops.push({ type: 'draw', el: c, shapes, len: Math.max(...shapes.map((s) => { try { return s.getTotalLength(); } catch { return 0; } }), 1) }); } else if (c.classList?.contains('dz-f') || c.classList?.contains('dz-t')) ops.push({ type: 'fade', el: c }); else if (c.children?.length) walk(c); } };
    walk(svg); return { svg, hand, ops };
  });
  const reset = () => { for (const { ops, hand } of plans) { for (const o of ops) { if (o.type === 'draw') o.shapes.forEach((s) => { s.style.strokeDasharray = `${o.len}`; s.style.strokeDashoffset = `${o.len}`; }); else o.el.style.opacity = '0'; } hand.setAttribute('opacity', '0'); } };
  const finishAll = () => { for (const { ops, hand } of plans) { for (const o of ops) { if (o.type === 'draw') o.shapes.forEach((s) => { s.style.strokeDasharray = ''; s.style.strokeDashoffset = ''; }); else o.el.style.opacity = ''; } hand.setAttribute('opacity', '0'); } snd.set(0); };
  let raf = 0, token = 0;
  const play = async () => {
    const my = ++token; reset(); if (soundOn) snd.on();
    const SPEED = 520;   // px/s(그림 좌표)
    for (const { svg, hand, ops } of plans) {
      if (my !== token) return;
      svg.closest('.rp-obs-row, .pz-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hand.setAttribute('opacity', '1');
      for (const o of ops) {
        if (my !== token) return;
        if (o.type === 'fade') { o.el.style.transition = 'opacity .35s'; o.el.style.opacity = ''; await new Promise((r) => setTimeout(r, o.el.classList.contains('dz-t') ? 260 : 120)); continue; }
        const dur = Math.max(110, Math.min(1500, (o.len / SPEED) * 1000)), lead = o.shapes[0];
        snd.set(0.028 + Math.min(0.03, o.len / 20000));
        await new Promise((res) => { const t0 = performance.now(); const step = (now) => { if (my !== token) return res(); const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 2 * t * t : 1 - (1 - t) * (1 - t) * 2; o.shapes.forEach((s) => { s.style.strokeDashoffset = `${o.len * (1 - e)}`; }); try { const p = lead.getPointAtLength(Math.min(o.len, lead.getTotalLength()) * e); hand.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); } catch { /* 점을 못 구하면 손만 멈춤. 선 조각은 뿌리 svg 좌표 그대로(조상에 변환 없음) */ } if (t < 1) raf = requestAnimationFrame(step); else res(); }; raf = requestAnimationFrame(step); });
        snd.set(0); await new Promise((r) => setTimeout(r, 40));
      }
      hand.setAttribute('opacity', '0'); await new Promise((r) => setTimeout(r, 500));
    }
  };
  const close = () => { token++; cancelAnimationFrame(raf); snd.off(); document.removeEventListener('keydown', onKey); $m.remove(); document.body.classList.remove('sk-open', 'print-sample'); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  $m.querySelector('[data-act="close"]').onclick = close;
  $m.querySelector('[data-act="replay"]').onclick = () => { token++; play(); };
  $m.querySelector('[data-act="skip"]').onclick = () => { token++; finishAll(); };
  $m.querySelector('[data-act="snd"]').onclick = (e) => { soundOn = !soundOn; e.currentTarget.setAttribute('aria-pressed', String(soundOn)); e.currentTarget.textContent = soundOn ? '🔈 연필 소리' : '🔇 소리 끔'; if (!soundOn) snd.set(0); else snd.on(); };
  $m.querySelector('[data-act="print"]').onclick = () => { token++; finishAll(); document.body.classList.add('print-sample'); print(); setTimeout(() => document.body.classList.remove('print-sample'), 800); };
  if (typeof window !== 'undefined') window.__obSample = { plans: plans.length, ops: plans.reduce((a, p) => a + p.ops.length, 0), finishAll, play: () => play() };
  play();
  return { close };
}
