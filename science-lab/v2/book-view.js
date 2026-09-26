// 살아 있는 교재 보기 — 책이 화면을 가득 채운다.
//  · 넓은 화면: A4 한 쪽(또는 두 쪽 펼침)을 남은 자리에 **통째로 맞춰** 보인다(스크롤 없음). 「크게 보기」는 폭에 맞춰 키우고 위아래로 읽는다.
//  · 가로 화면(≥900px): 영상·3D 장면·실험실이 있는 쪽은 **쪽 왼쪽 + 살아 있는 화면 오른쪽** — 단추를 눌러 화면을 바꾸지 않는다.
//    영상은 대기 사진을 바로 보이고 소리 없이 저절로 재생(움직임 줄이기 설정이면 멈춘 채 ▶). 실험실은 쪽을 넘겨도 그대로 이어진다.
//  · 휴대폰: 한 쪽씩 읽기(글자 크기 그대로 줄바꿈). 영상은 쪽 안에서 재생, 실험실은 누르면 전체 화면.
//  · 인쇄: 모든 쪽을 A4로 차례대로(보기 틀·오른쪽 화면은 숨김).
import { wireLive } from './live.js';
import { fitPages } from './book.js';
import { pauseLearningMedia } from './media-session.js';

const PW = 793.7, PH = 1122.5, GAP = 22;   // A4 210×297mm(96dpi)
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const safe = (s) => (/^https:\/\//.test(s || '') || /^\.\.?\//.test(s || '') ? s : '');

// 쪽마다 살아 있는 것: 영상·실험실·3D 장면
function liveOf(page) {
  const out = [], vids = [];
  const v0 = page.querySelector('.bk-video[data-src]');
  if (v0) vids.push({ k: 'video', src: v0.dataset.src, mp4: v0.dataset.mp4, full: v0.dataset.full, page: v0.dataset.page, poster: v0.querySelector('img')?.getAttribute('src') || '', credit: v0.querySelector('small')?.textContent || '', title: '실제 영상' });
  page.querySelectorAll('.bk-video-link[data-video]').forEach((b) => vids.push({ k: 'video', src: b.dataset.src, mp4: b.dataset.mp4, full: b.dataset.full, page: b.dataset.page, poster: '', credit: b.dataset.credit, title: '실제 영상', cap: b.dataset.title, prompt: b.dataset.prompt }));
  page.querySelectorAll('.sl-reading-player').forEach((p) => vids.push({ k: 'video', src: p.dataset.src, mp4: p.dataset.mp4, full: p.dataset.full, poster: p.querySelector('video')?.getAttribute('poster') || '', credit: page.querySelector('.sl-reading-video-caption span')?.textContent || '', title: '실제 영상', cap: p.querySelector('video')?.getAttribute('aria-label') || '', page: page.querySelector('[data-video-status] a')?.getAttribute('href') }));
  const lab = page.querySelector('[data-pop="lab"], .sl-reading-online'), scene = page.querySelector('[data-pop="scene"]');
  if (v0) out.push(vids.shift());
  if (lab) out.push({ k: 'lab', title: '3D 실험실' });
  out.push(...vids);
  if (scene) out.push({ k: 'scene', title: '3D 장면' });
  return out.map((x, i) => ({ ...x, id: x.k === 'video' ? `video:${x.src}` : x.k, n: i }));
}

export function mountBookView($app, { u, bookHtml, title, teacher = false, page = 1, scene, lab, misc, onAnswer, guide = null, sayFor = null, backHref }) {
  $app.innerHTML = `<div class="bv ${teacher ? 'bv-teacher' : 'bv-student'}">
    <header class="bv-top no-print">
      <a class="bv-back" href="${esc(backHref)}">‹ 처음으로</a>
      <p class="bv-title"><b>${esc(title)}</b><span class="bv-ed ${teacher ? 't' : ''}">${teacher ? '교사용' : '학생용'}</span></p>
      <nav class="bv-pager" aria-label="쪽 넘기기"><button type="button" class="bv-btn" data-bv="prev" aria-label="앞쪽">‹</button>
        <label class="bv-jump"><span class="sr">쪽</span><select data-bv="jump"></select></label>
        <button type="button" class="bv-btn" data-bv="next" aria-label="뒤쪽">›</button></nav>
      <div class="bv-tools"><button type="button" class="bv-btn" data-bv="zoom" aria-pressed="false" title="글자를 크게(폭에 맞춰 키우고 위아래로 읽기) · Z">크게 보기</button>
        <button type="button" class="bv-btn" data-bv="full" title="전체 화면 · F">전체 화면</button>
        <button type="button" class="bv-btn primary" data-bv="print">A4 인쇄</button></div>
    </header>
    <div class="bv-main">
      <div class="bv-space" tabindex="-1"><div class="bv-sizer"><div class="bv-scale">${bookHtml}</div></div></div>
      <aside class="bv-live no-print" hidden aria-label="살아 있는 화면">
        <div class="bv-tabs" role="tablist"></div>
        <div class="bv-hosts"><div class="bv-host" data-k="video"></div><div class="bv-host" data-k="lab"></div><div class="bv-host" data-k="scene"></div></div>
        <div class="bv-dockslot"></div>
      </aside>
    </div>
    <nav class="bv-bottom no-print" aria-label="쪽 넘기기"><button type="button" class="bv-btn" data-bv="prev2">‹ 앞쪽</button><span class="bv-count"></span><button type="button" class="bv-btn primary" data-bv="next2">뒤쪽 ›</button></nav>
  </div>`;
  const root = $app.querySelector('.bv'), bk = root.querySelector('.bk'), space = root.querySelector('.bv-space'), sizer = root.querySelector('.bv-sizer'), scaleEl = root.querySelector('.bv-scale');
  const liveEl = root.querySelector('.bv-live'), tabs = root.querySelector('.bv-tabs'), hosts = Object.fromEntries([...root.querySelectorAll('.bv-host')].map((h) => [h.dataset.k, h]));
  const pages = [...bk.querySelectorAll('.bk-page')], lives = pages.map(liveOf);
  bk.classList.add('viewer');
  pages.forEach((p, i) => { p.dataset.pn = i + 1; });
  const $jump = root.querySelector('[data-bv=jump]');

  let mode = '', views = [], vi = 0, zoom = false, split = false, activeKind = null, alive = true;
  const phone = () => innerWidth <= 700;
  const splitCapable = () => !phone() && innerWidth >= 900 && innerWidth / Math.max(1, innerHeight) >= 1.2;
  function buildViews() {
    const V = [], sp = splitCapable(), wide = !phone() && innerWidth / Math.max(1, innerHeight) >= 1.25;
    for (let i = 0; i < pages.length; i++) {
      if (phone() || zoom) { V.push({ pages: [i], live: sp && !phone() ? lives[i] : [] }); continue; }
      if (sp && lives[i].length) { V.push({ pages: [i], live: lives[i] }); continue; }
      if (wide && i + 1 < pages.length && !(sp && lives[i + 1].length)) { V.push({ pages: [i, i + 1], live: [] }); i++; continue; }
      V.push({ pages: [i], live: [] });
    }
    return V;
  }
  const viewOfPage = (n) => Math.max(0, views.findIndex((v) => v.pages.includes(n)));
  function relayout(keepPage = views[vi]?.pages[0] ?? page - 1) {
    const m = phone() ? 'phone' : 'fit';
    if (m !== mode) {
      mode = m; root.dataset.layout = m; bk.classList.toggle('a4', m !== 'phone');
      if (m !== 'phone') { pages.forEach((p) => p.classList.add('on')); fitPages(bk); }
    }
    views = buildViews(); vi = viewOfPage(keepPage);
    $jump.innerHTML = views.map((v, k) => `<option value="${k}">${v.pages.map((p) => p + 1).join('–')} / ${pages.length}쪽</option>`).join('');
    show(vi);
  }

  // ── 맞추기 ──────────────────────────────────────────────────────────
  function fit() {
    if (!alive || mode === 'phone') { scaleEl.style.cssText = ''; sizer.style.cssText = ''; return; }
    const v = views[vi], n = v.pages.length, main = root.querySelector('.bv-main');
    // 가로 화면에서 오른쪽 화면이 있으면: 쪽 칸은 쪽 높이에 맞춘 폭만, 나머지는 살아 있는 화면
    if (split && !zoom) space.style.flex = `0 0 ${Math.round(Math.min((main.clientHeight - 20) / PH * PW + 28, main.clientWidth - 380))}px`;
    else space.style.flex = '';
    const W = space.clientWidth, H = space.clientHeight;
    const total = n * PW + (n - 1) * GAP;
    const s = zoom ? Math.max(0.3, Math.min((W - 40) / total, 2.4)) : Math.max(0.2, Math.min((W - 28) / total, (H - 20) / PH));
    const w = total * s, h = PH * s;
    sizer.style.cssText = `width:${Math.max(W, w)}px;height:${zoom ? h + 28 : H}px`;
    scaleEl.style.cssText = `width:${total}px;height:${PH}px;transform:translate(${Math.max(0, (W - w) / 2)}px,${zoom ? 14 : Math.max(0, (H - h) / 2)}px) scale(${s})`;
    root.style.setProperty('--bv-scale', s.toFixed(3));
    guide?.arrange();
  }

  // ── 쪽 보이기 ────────────────────────────────────────────────────────
  function show(k) {
    vi = Math.max(0, Math.min(views.length - 1, k));
    const v = views[vi], on = new Set(v.pages);
    pages.forEach((p, i) => { const vis = on.has(i); p.classList.toggle('on', vis); p.inert = !vis; if (vis) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true'); });
    $jump.value = String(vi);
    root.querySelectorAll('[data-bv=prev],[data-bv=prev2]').forEach((b) => { b.disabled = vi === 0; });
    root.querySelectorAll('[data-bv=next],[data-bv=next2]').forEach((b) => { b.disabled = vi === views.length - 1; });
    root.querySelector('.bv-count').textContent = `${v.pages.map((p) => p + 1).join('–')} / ${pages.length}쪽`;
    root.dataset.spread = v.pages.length > 1 ? '1' : '';
    try { history.replaceState(history.state, '', location.hash.replace(/(#\/[^/]+\/lab-book\/[^/]+)(\/\d+)?$/, `$1/${v.pages[0] + 1}`)); } catch { /* */ }
    setLive(v.live);
    if (mode === 'phone') { scrollTo(0, 0); space.scrollTop = 0; } else { space.scrollTop = 0; fit(); }
    sayPage(v);
  }
  const go = (d) => { if (views[vi + d]) { pauseLearningMedia(); show(vi + d); } };

  // ── 오른쪽 살아 있는 화면 ────────────────────────────────────────────
  const videoEls = new Map();
  let labMounted = false, sceneMounted = false, labTipObs = null;
  const labVisible = () => alive && split && activeKind === 'lab' && !liveEl.hidden && document.visibilityState !== 'hidden';
  function setLive(items) {
    split = splitCapable() && items.length > 0 && mode !== 'phone';
    root.classList.toggle('split', split);
    liveEl.hidden = !split;
    if (!split) { videoEls.forEach((f) => f.querySelector('video')?.pause()); activeKind = null; if (guide && !teacher) guide.place(null); return; }
    const icon = (x) => (x.k === 'lab' ? '🧪 ' : x.k === 'video' ? '▶ ' : '◆ ');
    tabs.innerHTML = items.length > 1 ? items.map((x) => `<button type="button" role="tab" data-id="${esc(x.id)}" aria-selected="false">${icon(x)}${esc(x.title)}</button>`).join('') : `<p class="bv-tab1">${icon(items[0])}${esc(items[0].title)}</p>`;
    tabs.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => activate(items.find((x) => x.id === b.dataset.id))));
    const keep = items.find((x) => x.id === activeKind) || items[0];
    activeKind = null; activate(keep);
    if (guide && !teacher) guide.place(root.querySelector('.bv-dockslot'));
  }
  function activate(item, { sound = false } = {}) {
    if (!item) return;
    const kind = item.k; activeKind = item.id;
    tabs.querySelectorAll('[data-id]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === item.id)));
    const wasHidden = hosts[kind].hidden;
    Object.entries(hosts).forEach(([k, h]) => { h.hidden = k !== kind; });
    const wake = () => { if (wasHidden) requestAnimationFrame(() => dispatchEvent(new Event('resize'))); };   // 숨었다 나온 캔버스만 크기 다시
    videoEls.forEach((f, id) => { if (id !== item.id) { f.hidden = true; f.querySelector('video')?.pause(); } });
    if (kind === 'lab') {
      if (!labMounted && lab) { labMounted = true; Promise.resolve(lab(hosts.lab, { isActive: labVisible })).then(() => watchTips()).catch(() => {}); }
      wake();
    } else if (kind === 'scene') {
      if (!sceneMounted && scene) { sceneMounted = true; scene(hosts.scene); }
      wake();
    } else if (kind === 'video') {
      let f = videoEls.get(item.id);
      if (!f) { f = videoFigure(item); hosts.video.appendChild(f); videoEls.set(item.id, f); }
      f.hidden = false;
      const vid = f.querySelector('video');
      if (sound) { vid.muted = false; try { vid.currentTime = 0; } catch { /* */ } vid.play?.().catch(() => {}); }
      else if (!reduced() && vid.paused && !f.dataset.userPaused) { vid.muted = true; vid.play?.().catch(() => {}); }
    }
  }
  function videoFigure(x) {
    const f = document.createElement('figure'); f.className = 'bv-video';
    const poster = safe(x.poster);
    f.innerHTML = `<div class="bv-vbox"><video playsinline muted loop preload="${reduced() ? 'none' : 'auto'}" ${poster ? `poster="${esc(poster)}"` : ''} aria-label="${esc(x.title)}">
        ${safe(x.src) ? `<source src="${esc(x.src)}" type="video/webm">` : ''}${safe(x.mp4) ? `<source src="${esc(x.mp4)}" type="video/mp4">` : ''}${safe(x.full) ? `<source src="${esc(x.full)}" type="video/webm">` : ''}</video>
        <button type="button" class="bv-vplay" hidden>▶ 영상 보기</button>
        <button type="button" class="bv-vsound">🔊 소리 켜고 처음부터</button>
        <p class="bv-vfail" hidden>이 브라우저에서는 영상이 열리지 않아요. ${safe(x.page) ? `<a href="${esc(x.page)}" target="_blank" rel="noopener">새 창에서 보기</a>` : ''}</p></div>
      <figcaption>${x.prompt ? `<b>관찰할 점</b> ${esc(x.prompt)} · ` : ''}<span>${esc(x.cap || x.title)}${x.credit ? ` · ${esc(x.credit)}` : ''}</span></figcaption>`;
    const vid = f.querySelector('video'), play = f.querySelector('.bv-vplay'), snd = f.querySelector('.bv-vsound'), fail = f.querySelector('.bv-vfail');
    const srcs = [...vid.querySelectorAll('source')]; let bad = 0;
    srcs.forEach((s) => s.addEventListener('error', () => { if (++bad >= srcs.length) { fail.hidden = false; play.hidden = true; snd.hidden = true; } }));
    if (!srcs.length) { fail.hidden = false; snd.hidden = true; }
    const sync = () => { play.hidden = !vid.paused || !fail.hidden; snd.hidden = !fail.hidden || (!vid.muted && !vid.paused); snd.textContent = vid.muted ? '🔊 소리 켜고 처음부터' : '🔇 소리 끄기'; };
    ['play', 'pause', 'volumechange', 'playing'].forEach((t) => vid.addEventListener(t, sync));
    vid.addEventListener('pause', () => { if (vid.isConnected && !f.hidden && document.visibilityState === 'visible' && activeKind === `video:${x.src}`) f.dataset.userPaused = vid.muted ? '' : '1'; });
    play.onclick = () => { delete f.dataset.userPaused; vid.play?.().catch(() => {}); };
    snd.onclick = () => { if (vid.muted) { vid.muted = false; try { vid.currentTime = 0; } catch { /* */ } vid.play?.().catch(() => {}); } else vid.muted = true; };
    vid.addEventListener('click', () => { if (vid.paused) vid.play?.().catch(() => {}); else vid.pause(); });
    sync(); return f;
  }
  // 실험실 도움말 → 독쌤 말풍선 둘째 줄 + 표정
  const METHOD_ERR = /먼저 |뒤에 적어|더 높은 곳|비었어요/, GOOD = /^(적었어요|굳었어요|다 부었어요)|다시 떠올라요/;
  function watchTips() {
    if (!guide || teacher) return;
    let last = '';
    labTipObs = new MutationObserver(() => {
      if (!labVisible()) return;
      const tip = hosts.lab.querySelector('.lab3d-tip, .lab-tip'); const t = tip?.textContent.trim() || ''; if (t === last) return; last = t;
      guide.status(t);
      if (METHOD_ERR.test(t)) { guide.react('surprise', 1100, 'shake'); guide.mood('encourage', { calm: 5000 }); }
      else if (GOOD.test(t)) { guide.react('praise', 1500, 'hop'); guide.mood('encourage', { calm: 5000 }); }
    });
    labTipObs.observe(hosts.lab, { childList: true, subtree: true, characterData: true });
  }
  // 쪽 안의 단추(영상 보기·3D 실험실·3D 장면)는 가로 화면이면 오른쪽 화면으로 — 화면 전체를 바꾸지 않는다
  const panel = {
    open(kind, from, data) {
      if (!split) return false;
      const items = views[vi].live, it = kind === 'video' ? (items.find((x) => x.k === 'video' && (!data?.src || x.src === data.src)) || items.find((x) => x.k === 'video')) : items.find((x) => x.k === kind);
      if (!it) return false;
      activate(it, { sound: kind === 'video' });
      liveEl.classList.remove('flash'); void liveEl.offsetWidth; liveEl.classList.add('flash');
      return true;
    },
  };
  const release = wireLive(bk, { scene, lab, title, misc, onAnswer: (kind, p) => { onAnswer?.(kind, p); react(kind, p); }, panel });

  // ── 독쌤(학생용만): 쪽마다 한 가지만 말한다 ────────────────────────────
  let sayTimer = 0;
  function sayPage(v) {
    if (!guide || teacher || !sayFor) return;
    clearTimeout(sayTimer); guide.reset();
    const line = sayFor(pages[v.pages[0]]?.dataset.say || '', { split: split && v.live.length > 0, live: v.live });
    sayTimer = setTimeout(() => { if (alive && line) guide.say(line); }, 350);
  }
  function react(kind, p) {
    if (!guide || teacher) return;
    if (kind === 'item') guide.say(p.ok ? 'dk-right' : 'dk-wrong', { mood: p.ok ? 'praise' : 'encourage' });
    else if (kind === 'blank' && !p.revealed) { if (p.ok) guide.react('praise', 1300, 'hop'); else guide.react('encourage', 900, 'nod'); }
  }
  if (guide && !teacher) guide.avoid = () => {
    const rs = [...root.querySelectorAll('.bk-page.on')].map((el) => el.getBoundingClientRect());
    root.querySelectorAll('.bv-bottom button, .bv-live:not([hidden]) :is(button, table, .lab3d-read, .lab3d-tip, .cap, figcaption)').forEach((el) => { if (el.offsetParent) rs.push(el.getBoundingClientRect()); });
    return rs;
  };

  // ── 조작 ────────────────────────────────────────────────────────────
  const on = (sel, fn) => root.querySelectorAll(sel).forEach((b) => b.addEventListener('click', fn));
  on('[data-bv=prev],[data-bv=prev2]', () => go(-1));
  on('[data-bv=next],[data-bv=next2]', () => go(1));
  $jump.addEventListener('change', () => { pauseLearningMedia(); show(+$jump.value); });
  const $zoom = root.querySelector('[data-bv=zoom]');
  const setZoom = (z) => { zoom = z; $zoom.setAttribute('aria-pressed', String(z)); $zoom.textContent = z ? '전체 쪽 보기' : '크게 보기'; root.classList.toggle('zoom', z); relayout(); };
  $zoom.addEventListener('click', () => setZoom(!zoom));
  on('[data-bv=full]', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { /* 지원 안 함 */ } });
  on('[data-bv=print]', () => print());
  scaleEl.addEventListener('dblclick', (e) => { if (!e.target.closest('button, a, input, textarea, select, video, canvas, .bk-choices, .bk-blank')) setZoom(!zoom); });
  const onKey = (e) => {
    if (!alive) return;
    if (e.defaultPrevented || e.target.closest?.('input, textarea, select, [contenteditable="true"], .sl-lab-workspace, .bv-live')) return;
    if (['ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); go(1); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'z' || e.key === 'Z') setZoom(!zoom);
    else if (e.key === 'f' || e.key === 'F') root.querySelector('[data-bv=full]').click();
  };
  addEventListener('keydown', onKey);
  // 밀어서 넘기기(휴대폰)
  let sx = null;
  space.addEventListener('touchstart', (e) => { sx = e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null; }, { passive: true });
  space.addEventListener('touchend', (e) => { if (!sx || zoom) return; const t = e.changedTouches[0], dx = t.clientX - sx[0], dy = t.clientY - sx[1]; sx = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && !e.target.closest('canvas, video, .bk-choices')) go(dx < 0 ? 1 : -1); }, { passive: true });
  let rt = 0;
  // 크기가 바뀌어도 쪽 묶음이 같으면 맞추기만 한다(독쌤이 말을 처음부터 다시 하지 않게)
  const sig = (V) => V.map((v) => `${v.pages.join('+')}:${v.live.length}`).join('|');
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => {
    if (!alive) return;
    if ((phone() ? 'phone' : 'fit') === mode && sig(buildViews()) === sig(views)) { fit(); return; }
    relayout();
  }, 120); };
  addEventListener('resize', onResize);
  const ro = new ResizeObserver(() => fit()); ro.observe(space);
  document.fonts?.ready.then(() => { if (alive && mode !== 'phone') { fitPages(bk); fit(); } });
  // 인쇄: 모든 쪽을 보이게(보기 틀은 CSS가 숨김)
  const beforePrint = () => { pages.forEach((p) => { p.inert = false; p.removeAttribute('aria-hidden'); }); };
  addEventListener('beforeprint', beforePrint);

  relayout(Math.max(0, Math.min(pages.length - 1, (page || 1) - 1)));
  return () => {
    alive = false; release(); removeEventListener('keydown', onKey); removeEventListener('resize', onResize); removeEventListener('beforeprint', beforePrint);
    ro.disconnect(); labTipObs?.disconnect(); clearTimeout(sayTimer); videoEls.forEach((f) => f.querySelector('video')?.pause());
    guide?.destroy();
  };
}
