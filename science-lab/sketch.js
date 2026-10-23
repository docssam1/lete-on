// 그리기판 — 탐구보고서의 관찰그림·설계 그림을 화면에 직접 그린다(손가락·펜·마우스).
// 자연관찰대회 그림의 꼴: 전체 모습 + 부분 이름(지시선) + 확대 원 + 수면·지면 기준선. 도구도 그 순서로 둔다.
// 참고 그림(3D 표본 화면)은 옆에 나란히 보여 줄 뿐 밑에 깔지 않는다 — 본뜨기가 아니라 보고 그리기라야 관찰이 된다.
// openSketch({ title, src?, reference?: () => dataURL|null, guideLine? }) → Promise<JPEG dataURL | null(취소)>
const W = 1000, H = 750;
const COLORS = [['#1f2a37', '검정'], ['#3b7d3a', '초록'], ['#8a5a2b', '갈색'], ['#2f62b0', '파랑'], ['#c0392b', '빨강']];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function openSketch({ title = '그림', src = null, reference = null, guideLine = false } = {}) {
  return new Promise((resolve) => {
    let ref = null; try { ref = typeof reference === 'function' ? reference() : reference; } catch { ref = null; }
    const $m = document.createElement('div');
    $m.className = 'sk-modal'; $m.setAttribute('role', 'dialog'); $m.setAttribute('aria-label', `${title} 그리기`);
    $m.innerHTML = `<div class="sk-box">
      <header class="sk-head"><b>✎ ${esc(title)}</b><span class="sk-sp"></span><button type="button" class="sk-btn" data-act="cancel">취소</button><button type="button" class="sk-btn primary" data-act="save">그림 넣기</button></header>
      <div class="sk-tools" role="toolbar" aria-label="그리기 도구">
        <span class="sk-grp">${[['pen', '✏️ 연필'], ['line', '╱ 지시선'], ['circle', '◯ 확대 원'], ['text', '가 글자'], ...(guideLine ? [['base', '┄ 수면·지면']] : []), ['eraser', '⌫ 지우개']].map(([k, t]) => `<button type="button" class="sk-tool" data-tool="${k}" aria-pressed="${k === 'pen'}">${t}</button>`).join('')}</span>
        <span class="sk-grp">${COLORS.map(([c, n], i) => `<button type="button" class="sk-color" data-color="${c}" style="--c:${c}" aria-label="${n}" aria-pressed="${i === 0}"></button>`).join('')}</span>
        <span class="sk-grp"><button type="button" class="sk-size" data-size="2" aria-pressed="true">가늘게</button><button type="button" class="sk-size" data-size="5" aria-pressed="false">굵게</button></span>
        <span class="sk-grp"><button type="button" class="sk-btn" data-act="undo">↶ 되돌리기</button><button type="button" class="sk-btn" data-act="clear">모두 지우기</button></span>
      </div>
      <div class="sk-main ${ref ? 'has-ref' : ''}">
        ${ref ? `<figure class="sk-ref"><img src="${ref}" alt="참고 화면"><figcaption>보고 그리기 — 본뜨지 말고, 옆에 두고 보면서 그려요.</figcaption></figure>` : ''}
        <div class="sk-stage"><canvas width="${W}" height="${H}" aria-label="그리는 곳"></canvas></div>
      </div>
      <p class="sk-hint">부분 이름은 <b>지시선</b>을 긋고 <b>글자</b>로 적어요. 자세히 본 곳은 <b>확대 원</b>을 그리고 그 안에 크게 한 번 더.${guideLine ? ' 물에 사는 것은 <b>수면·지면</b> 선부터.' : ''}</p>
    </div>`;
    document.body.appendChild($m); document.body.classList.add('sk-open');
    const cv = $m.querySelector('canvas'), g = cv.getContext('2d');
    const white = () => { g.save(); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.restore(); };
    white();
    const hist = []; const push = () => { hist.push(g.getImageData(0, 0, W, H)); if (hist.length > 30) hist.shift(); };
    if (src) { const img = new Image(); img.onload = () => { const k = Math.min(W / img.width, H / img.height); g.drawImage(img, (W - img.width * k) / 2, (H - img.height * k) / 2, img.width * k, img.height * k); }; img.src = src; }
    let tool = 'pen', color = COLORS[0][0], size = 2, drawing = null;
    const pick = (sel, el) => $m.querySelectorAll(sel).forEach((b) => b.setAttribute('aria-pressed', String(b === el)));
    $m.querySelectorAll('[data-tool]').forEach((b) => { b.onclick = () => { tool = b.dataset.tool; pick('[data-tool]', b); }; });
    $m.querySelectorAll('[data-color]').forEach((b) => { b.onclick = () => { color = b.dataset.color; pick('[data-color]', b); if (tool === 'eraser') { tool = 'pen'; pick('[data-tool]', $m.querySelector('[data-tool="pen"]')); } }; });
    $m.querySelectorAll('[data-size]').forEach((b) => { b.onclick = () => { size = +b.dataset.size; pick('[data-size]', b); }; });
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H, p: e.pressure > 0 && e.pointerType === 'pen' ? e.pressure : 0.5 }; };
    const style = (w) => { g.strokeStyle = color; g.fillStyle = color; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.setLineDash([]); };
    const text = (at) => {
      const t = prompt('적을 말(부분 이름 등)'); if (!t) return;
      push(); style(1); g.font = `700 ${size > 3 ? 40 : 30}px Gaegu, Pretendard, sans-serif`; g.textBaseline = 'middle'; g.fillText(t, at.x, at.y);
    };
    const shape = (a, b) => {
      g.putImageData(drawing.base, 0, 0); style(size + (tool === 'base' ? 0 : 0.5));
      if (tool === 'line') { g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); g.beginPath(); g.arc(a.x, a.y, size + 1.5, 0, Math.PI * 2); g.fill(); }
      else if (tool === 'circle') { g.beginPath(); g.arc(a.x, a.y, Math.hypot(b.x - a.x, b.y - a.y), 0, Math.PI * 2); g.stroke(); }
      else if (tool === 'base') { g.setLineDash([16, 10]); g.beginPath(); g.moveTo(0, b.y); g.lineTo(W, b.y); g.stroke(); g.setLineDash([]); g.font = '700 26px Gaegu, Pretendard, sans-serif'; g.textBaseline = 'bottom'; g.fillText(b.y < H * 0.6 ? '[수면]' : '[지면]', 12, b.y - 4); }
    };
    cv.addEventListener('pointerdown', (e) => {
      e.preventDefault(); cv.setPointerCapture(e.pointerId); const p = pos(e);
      if (tool === 'text') { text(p); return; }
      push(); drawing = { last: p, start: p, base: g.getImageData(0, 0, W, H) };
      if (tool === 'pen' || tool === 'eraser') { style(tool === 'eraser' ? 26 : size * (0.6 + p.p)); if (tool === 'eraser') g.strokeStyle = '#fff'; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + 0.01, p.y); g.stroke(); }
      else if (tool === 'base') shape(p, p);
    });
    cv.addEventListener('pointermove', (e) => {
      if (!drawing) return; e.preventDefault(); const p = pos(e);
      if (tool === 'pen' || tool === 'eraser') {
        const l = drawing.last, mx = (l.x + p.x) / 2, my = (l.y + p.y) / 2;
        g.lineWidth = tool === 'eraser' ? 26 : size * (0.6 + p.p); g.beginPath(); g.moveTo(drawing.mid?.x ?? l.x, drawing.mid?.y ?? l.y); g.quadraticCurveTo(l.x, l.y, mx, my); g.stroke();
        drawing.mid = { x: mx, y: my }; drawing.last = p;
      } else shape(drawing.start, p);
    });
    const end = () => { drawing = null; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); cv.addEventListener('lostpointercapture', end);
    const close = (val) => { document.removeEventListener('keydown', onKey); $m.remove(); document.body.classList.remove('sk-open'); resolve(val); };
    const onKey = (e) => {
      if (e.key === 'Escape' && !drawing) { if (!hist.length || confirm('그린 것을 버리고 닫을까요?')) close(null); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
    };
    const undo = () => { const s = hist.pop(); if (s) g.putImageData(s, 0, 0); };
    document.addEventListener('keydown', onKey);
    $m.querySelector('[data-act="undo"]').onclick = undo;
    $m.querySelector('[data-act="clear"]').onclick = () => { push(); white(); };
    $m.querySelector('[data-act="cancel"]').onclick = () => { if (!hist.length || confirm('그린 것을 버리고 닫을까요?')) close(null); };
    $m.querySelector('[data-act="save"]').onclick = () => close(cv.toDataURL('image/jpeg', 0.85));
  });
}
