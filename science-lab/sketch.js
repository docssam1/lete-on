// 그리기판 — 탐구보고서의 관찰그림·설계 그림을 화면에 직접 그린다(손가락·펜·마우스).
// 자연관찰대회 그림의 꼴: 전체 모습 + 부분 이름(지시선) + 확대 원 + 수면·지면 기준선. 도구도 그 순서로 둔다.
// 참고 그림(3D 표본 화면)은 옆에 나란히 보여 줄 뿐 밑에 깔지 않는다 — 본뜨기가 아니라 보고 그리기라야 관찰이 된다.
// 연필 그림(원장 2026-10-25 「관찰 그림은 연필 그림 스킬도 좋아」): 참고 화면을 연필 스케치로 바꿔 볼 수 있다(선·명암만 남긴 것 — 베끼기용이 아니라
// 「그림으로는 어디를 선으로 잡아야 하나」를 보여 주는 것). 연필 도구는 흑연처럼 눌림에 따라 진해지고 결이 살짝 거칠다. 밑그림용 연한 연필도 둔다.
// openSketch({ title, src?, reference?: () => dataURL|null, guideLine? }) → Promise<JPEG dataURL | null(취소)>
const W = 1000, H = 750;
const COLORS = [['#2b2b2b', '연필 검정'], ['#3b7d3a', '초록'], ['#8a5a2b', '갈색'], ['#2f62b0', '파랑'], ['#c0392b', '빨강']];
// 사진·3D 화면 → 연필 스케치: 회색 → 반전·흐림을 색상 닷지로 합치면 가장자리만 남는다 + 소벨 윤곽선 + 종이색
export function pencilize(img, maxW = 900) {
  const k = Math.min(1, maxW / img.width), w = Math.max(2, Math.round(img.width * k)), h = Math.max(2, Math.round(img.height * k));
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d'); c.drawImage(img, 0, 0, w, h);
  const d = c.getImageData(0, 0, w, h), px = d.data, n = w * h, g = new Float32Array(n), inv = new Float32Array(n), tmp = new Float32Array(n);
  for (let i = 0; i < n; i++) { g[i] = px[i * 4] * 0.3 + px[i * 4 + 1] * 0.59 + px[i * 4 + 2] * 0.11; inv[i] = 255 - g[i]; }
  const R = Math.max(2, Math.round(w / 180));   // 흐림 반지름(크기에 비례)
  for (let y = 0; y < h; y++) { let acc = 0; for (let x = -R; x <= R; x++) acc += inv[y * w + Math.min(w - 1, Math.max(0, x))]; for (let x = 0; x < w; x++) { tmp[y * w + x] = acc / (2 * R + 1); acc += inv[y * w + Math.min(w - 1, x + R + 1)] - inv[y * w + Math.max(0, x - R)]; } }
  for (let x = 0; x < w; x++) { let acc = 0; for (let y = -R; y <= R; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x]; for (let y = 0; y < h; y++) { inv[y * w + x] = acc / (2 * R + 1); acc += tmp[Math.min(h - 1, y + R + 1) * w + x] - tmp[Math.max(0, y - R) * w + x]; } }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, dodge = Math.min(255, g[i] * 255 / Math.max(1, 255 - inv[i]));
    const X = (x > 0 && x < w - 1 && y > 0 && y < h - 1) ? (g[i - w + 1] + 2 * g[i + 1] + g[i + w + 1]) - (g[i - w - 1] + 2 * g[i - 1] + g[i + w - 1]) : 0;
    const Y = (x > 0 && x < w - 1 && y > 0 && y < h - 1) ? (g[i + w - 1] + 2 * g[i + w] + g[i + w + 1]) - (g[i - w - 1] + 2 * g[i - w] + g[i - w + 1]) : 0;
    const edge = Math.min(255, Math.hypot(X, Y) * 0.9), v = Math.min(dodge, 255 - edge), tone = 255 - (255 - v) * 0.85;   // 흑연은 완전 검정이 아니다
    px[i * 4] = tone * 0.99; px[i * 4 + 1] = tone * 0.985; px[i * 4 + 2] = tone * 0.96; px[i * 4 + 3] = 255;   // 살짝 따뜻한 종이색
  }
  c.putImageData(d, 0, 0);
  c.globalAlpha = 0.06; c.fillStyle = '#000'; for (let i = 0; i < w * h / 180; i++) c.fillRect(Math.random() * w, Math.random() * h, 1, 1); c.globalAlpha = 1;   // 종이 결
  return cv.toDataURL('image/jpeg', 0.85);
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function openSketch({ title = '그림', src = null, reference = null, guideLine = false } = {}) {
  return new Promise((resolve) => {
    let ref = null; try { ref = typeof reference === 'function' ? reference() : reference; } catch { ref = null; }
    const $m = document.createElement('div');
    $m.className = 'sk-modal'; $m.setAttribute('role', 'dialog'); $m.setAttribute('aria-label', `${title} 그리기`);
    $m.innerHTML = `<div class="sk-box">
      <header class="sk-head"><b>✎ ${esc(title)}</b><span class="sk-sp"></span><button type="button" class="sk-btn" data-act="cancel">취소</button><button type="button" class="sk-btn primary" data-act="save">그림 넣기</button></header>
      <div class="sk-tools" role="toolbar" aria-label="그리기 도구">
        <span class="sk-grp">${[['pen', '✏️ 연필'], ['light', '✎ 연한 연필(밑그림)'], ['line', '╱ 지시선'], ['circle', '◯ 확대 원'], ['text', '가 글자'], ...(guideLine ? [['base', '┄ 수면·지면']] : []), ['eraser', '⌫ 지우개']].map(([k, t]) => `<button type="button" class="sk-tool" data-tool="${k}" aria-pressed="${k === 'pen'}">${t}</button>`).join('')}</span>
        <span class="sk-grp">${COLORS.map(([c, n], i) => `<button type="button" class="sk-color" data-color="${c}" style="--c:${c}" aria-label="${n}" aria-pressed="${i === 0}"></button>`).join('')}</span>
        <span class="sk-grp"><button type="button" class="sk-size" data-size="2" aria-pressed="true">가늘게</button><button type="button" class="sk-size" data-size="5" aria-pressed="false">굵게</button></span>
        <span class="sk-grp"><button type="button" class="sk-btn" data-act="undo">↶ 되돌리기</button><button type="button" class="sk-btn" data-act="clear">모두 지우기</button></span>
      </div>
      <div class="sk-main ${ref ? 'has-ref' : ''}">
        ${ref ? `<figure class="sk-ref"><img src="${ref}" alt="참고 화면"><figcaption><span>보고 그리기 — 본뜨지 말고, 옆에 두고 보면서 그려요.</span><button type="button" class="sk-btn sk-pencil" data-act="pencil">✏ 연필 그림으로 보기</button></figcaption></figure>` : ''}
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
    // 참고 화면 ↔ 연필 스케치
    const $pb = $m.querySelector('[data-act="pencil"]'); let pencilSrc = null, pencilOn = false;
    if ($pb) $pb.onclick = () => { const img = $m.querySelector('.sk-ref img'); pencilOn = !pencilOn; if (pencilOn && !pencilSrc) { const src = new Image(); src.onload = () => { pencilSrc = pencilize(src); if (pencilOn) img.src = pencilSrc; }; src.src = ref; } else img.src = pencilOn ? pencilSrc : ref; $pb.textContent = pencilOn ? '🖼 실물로 보기' : '✏ 연필 그림으로 보기'; $pb.setAttribute('aria-pressed', String(pencilOn)); };
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
      if (tool === 'pen' || tool === 'light' || tool === 'eraser') { style(tool === 'eraser' ? 26 : size * (0.6 + p.p)); if (tool === 'eraser') g.strokeStyle = '#fff'; g.globalAlpha = tool === 'light' ? 0.28 : tool === 'pen' ? 0.82 : 1; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + 0.01, p.y); g.stroke(); g.globalAlpha = 1; }
      else if (tool === 'base') shape(p, p);
    });
    cv.addEventListener('pointermove', (e) => {
      if (!drawing) return; e.preventDefault(); const p = pos(e);
      if (tool === 'pen' || tool === 'light' || tool === 'eraser') {
        const l = drawing.last, mx = (l.x + p.x) / 2, my = (l.y + p.y) / 2, graphite = tool !== 'eraser';
        g.lineWidth = tool === 'eraser' ? 26 : size * (0.6 + p.p) * (graphite ? 0.9 + Math.random() * 0.25 : 1);   // 흑연 결: 굵기가 조금씩 흔들린다
        g.globalAlpha = tool === 'light' ? 0.28 : graphite ? 0.82 : 1;
        g.beginPath(); g.moveTo(drawing.mid?.x ?? l.x, drawing.mid?.y ?? l.y); g.quadraticCurveTo(l.x, l.y, mx, my); g.stroke();
        if (graphite && size > 3) { g.globalAlpha = 0.25; g.lineWidth = size * 0.5; g.beginPath(); g.moveTo((drawing.mid?.x ?? l.x) + 1.2, (drawing.mid?.y ?? l.y) - 0.8); g.quadraticCurveTo(l.x + 1.2, l.y - 0.8, mx + 1.2, my - 0.8); g.stroke(); }   // 굵은 연필은 옆선이 한 줄 더
        g.globalAlpha = 1; drawing.mid = { x: mx, y: my }; drawing.last = p;
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
