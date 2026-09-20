// 살아 있는 교재: renderChapter(..., { live:true }) 로 그린 쪽들에 생명을 넣는다.
//  · 첫 쪽 그림 자리의 실제 영상이 쪽 안에서 재생
//  · [data-pop] 버튼 → 3D 장면·체험 실험실이 누른 자리에서 책 밖으로 튀어나옴(닫으면 3D 정리)
//  · 사진 누르면 크게 · 빈칸 누르면 답 · 확인 문제 누르면 바로 채점
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function wireLive(root, { scene, lab, title = '' } = {}) {
  root.querySelectorAll('.bk-video').forEach((v) => v.querySelector('.bk-play')?.addEventListener('click', (e) => {
    e.stopPropagation();
    v.innerHTML = `<video controls autoplay playsinline><source src="${v.dataset.src}" type="video/webm">${v.dataset.mp4 ? `<source src="${v.dataset.mp4}" type="video/mp4">` : ''}<source src="${v.dataset.full}" type="video/webm"></video>`;
    const vid = v.querySelector('video');
    vid.addEventListener('error', () => { v.innerHTML = `<div class="bk-video-fail"><p>이 브라우저에서는 영상이 열리지 않아요.</p><a href="${v.dataset.page}" target="_blank" rel="noopener">새 창에서 영상 보기</a></div>`; }, true);
    vid.play?.().catch(() => { /* 자동 재생이 막히면 재생 버튼으로 */ });
  }));
  root.querySelectorAll('[data-pop]').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const k = b.dataset.pop;
    openPop(b, k === 'scene' ? '3D로 보기' : '3D 체험 실험실', (el) => (k === 'scene' ? scene?.(el) : lab?.(el)), { wide: k === 'lab' });
  }));
  root.querySelectorAll('.bk-photo img, .bk-art img').forEach((img) => { img.style.cursor = 'zoom-in'; img.addEventListener('click', (e) => {
    e.stopPropagation(); const cap = img.closest('figure')?.querySelector('figcaption')?.innerHTML || '';
    openPop(img, '실제 사진', (el) => { el.innerHTML = `<figure class="pop-photo"><img src="${img.src}" alt=""><figcaption>${cap}</figcaption></figure>`; });
  }); });
  root.querySelectorAll('.bk-blank[data-a]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); b.classList.toggle('open'); b.querySelector('i').textContent = b.classList.contains('open') ? b.dataset.a : b.dataset.m || (b.dataset.m = b.querySelector('i').textContent, b.dataset.m); }));
  root.querySelectorAll('.bk-blank[data-a] i').forEach((i) => { i.parentElement.dataset.m = i.textContent; });
  root.querySelectorAll('.bk-choices[data-key]').forEach((ol) => {
    const key = ol.dataset.key.split(',').filter(Boolean).map(Number); if (!key.length) return;
    ol.querySelectorAll('li').forEach((li) => li.addEventListener('click', (e) => {
      e.stopPropagation(); if (ol.dataset.done) return; ol.dataset.done = '1';
      const j = +li.dataset.j; ol.querySelectorAll('li').forEach((x) => { if (key.includes(+x.dataset.j)) x.classList.add('ok'); });
      if (!key.includes(j)) li.classList.add('no');
    }));
  });
}

// 누른 자리(from)에서 커지며 나타나는 창. mount(el)가 3D를 띄우면 닫을 때 그 무대를 정리한다.
export async function openPop(from, title, mount, { wide = false } = {}) {
  const { Stage } = await import('../engine.js');
  document.querySelector('.bk-pop-wrap')?.__close?.();
  const before = new Set(Stage.live);
  const wrap = document.createElement('div'); wrap.className = 'bk-pop-wrap';
  wrap.innerHTML = `<div class="bk-pop ${wide ? 'wide' : ''}" role="dialog" aria-label="${esc(title)}"><div class="bk-pop-bar"><b>${esc(title)}</b><button type="button" class="bk-pop-x" aria-label="닫기">✕</button></div><div class="bk-pop-body"></div></div>`;
  document.body.appendChild(wrap);
  const box = wrap.querySelector('.bk-pop'), r0 = from.getBoundingClientRect();
  const r1 = box.getBoundingClientRect();
  const sx = Math.max(0.05, r0.width / r1.width), sy = Math.max(0.05, r0.height / r1.height);
  box.style.transformOrigin = '0 0';
  box.style.transform = `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px) scale(${sx}, ${sy})`; box.style.opacity = '0.2';
  requestAnimationFrame(() => requestAnimationFrame(() => { box.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1), opacity .3s'; box.style.transform = 'none'; box.style.opacity = '1'; }));
  const close = () => { for (const s of [...Stage.live]) if (!before.has(s)) s.dispose(); wrap.remove(); removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  wrap.__close = close; addEventListener('keydown', onKey);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  wrap.querySelector('.bk-pop-x').addEventListener('click', close);
  setTimeout(() => mount(wrap.querySelector('.bk-pop-body')), 180);
  return close;
}
