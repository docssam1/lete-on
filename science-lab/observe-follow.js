// 예시 보고서 따라 하기 — 자연관찰 연습(#/observe/<세트>)에서 내 보고서를 칸 하나씩, 예시를 보며 채운다.
// 원장 2026-10-27: 「우리 스케치 그림 예시 그림도 보여 주고 예시 탐구보고서 따라 하기도 해야지」 · 「우선 따라 하기」.
// 화면 아래에 뜨는 안내 카드: 이번 칸의 예시(관찰그림은 연필이 다시 그려 감) → 「내 차례」 — 내 보고서의 같은 칸을 밝히고 그리로 스크롤.
// 관찰그림 칸은 대상마다 한 걸음: 왼쪽 표본 보기도 같은 대상으로 바꾸고, 「✎ 내 그림 그리기」가 그 줄의 그리기판을 연다(옆에 지금 3D 화면이 참고로 뜸).
// 베끼게 하지 않는다 — 예시는 「무엇을 표시했고 어떤 순서로 썼는지」를 보는 것, 글은 내가 본 것으로.
import { sampleFor } from './data/observe-samples.js';
import { reportCfg } from './data/reports.js';
import { withMean } from './report-model.js';
import { esc, para, treeHtml } from './observe-sample.js';

const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';
const view = (t) => `<div class="rp-view sv">${para(t)}</div>`;

// 칸마다 「이렇게 해요」 한 줄(예시를 볼 때 눈여겨볼 곳)
const TIP = {
  target: '장소의 특징(햇빛·물기·바닥)과 고른 대상·수를 먼저 적었어요.',
  result: '이름을 몰라도 번호로, 장소마다 같은 방법으로 센 값을 표에 적었어요.',
  sheet: '전체 모습 → 확대, 부분 이름은 선으로 이어 적기. 설명은 본 것 → 확인한 것 → 추정 순서.',
  env: '어떻게 확인했는지(방법) → 결과 → 「아마 ~때문」으로 나눠 썼어요.',
  classify: '「그렇다 / 그렇지 않다」로 답할 수 있는 기준으로 끝까지 둘씩 나눴어요.',
  venn: '가운데는 둘 다 그런 점, 양쪽은 그것만의 점 — 관찰한 사실로만.',
  adapt: '한 부분을 골라 생김새 → 하는 일 → 그곳에서 살아가는 데 좋은 점.',
  next: '관찰하다 생긴 「왜?」와, 무엇을 바꾸고 무엇을 같게 해서 알아볼지.',
};

// 내 보고서의 칸(data-key) 순서대로 걸음을 만든다. 관찰그림 칸은 대상 수만큼 쪼갠다.
function buildSteps(set, X, $rep) {
  const mid = set.level === 'mid', cfg = reportCfg(set.id, set.level, 'nature');
  let table = { columns: cfg.table.columns.slice(), rows: X.table.map((r) => r.slice()) }; if (mid) table = withMean(table);
  const tableHtml = () => `<div class="rp-table-wrap"><table class="rp-table"><thead><tr>${table.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${table.rows.map((r) => `<tr>${r.map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const extraFor = (title) => (X.extra || []).find((e) => title && (e.title.includes(title) || title.includes(e.title)));
  const steps = [];
  for (const $c of $rep.querySelectorAll('.rp-cell[data-key]')) {
    const key = $c.dataset.key, title = $c.querySelector('h3')?.firstChild?.textContent?.replace(/^\d+\.\s*/, '') || key;
    if (key === 'sheet') {
      const rows = [...$c.querySelectorAll('.rp-obs-row[data-obs]')];
      rows.forEach((_, i) => {
        const o = X.obs[i];
        steps.push({ key, title: `${title} — ${CIRCLED[i]}`, spec: i, sel: `.rp-cell[data-key="${key}"] .rp-obs-row[data-obs="${i}"]`, draw: true,
          ex: o ? `<div class="fw-obs"><div class="pz-wrap">${o.draw()}</div><div><b class="rp-obs-label">${esc(o.label)}</b>${view(o.text)}</div></div>` : '<p class="fw-none">이 대상은 예시가 없어요. 앞 대상의 예시처럼 그려요.</p>' });
      });
      continue;
    }
    let ex = '';
    if (key === 'target') ex = view(X.target);
    else if (key === 'result') ex = tableHtml();
    else if (key === 'env' && X.env) ex = view(X.env);
    else if (key === 'classify' && X.tree) ex = `<ul class="rp-tree">${treeHtml(X.tree)}</ul>${view(X.classify)}`;
    else if (key === 'venn' && X.venn) ex = `<div class="fw-venn"><p><b>${esc(X.venn.la)}만</b>${para(X.venn.a)}</p><p><b>같은 점</b>${para(X.venn.both)}</p><p><b>${esc(X.venn.lb)}만</b>${para(X.venn.b)}</p></div>`;
    else if (key === 'adapt' && X.adapt) ex = `${X.adaptDraw ? `<div class="pz-wrap wide">${X.adaptDraw()}</div>` : ''}${view(X.adapt)}`;
    else if (key === 'next') ex = view(X.next);
    else { const e = extraFor(title); if (e) ex = `${e.draw ? `<div class="pz-wrap wide">${e.draw()}</div>` : ''}${view(e.text)}`; }
    steps.push({ key, title, sel: `.rp-cell[data-key="${key}"]`, ex: ex || '<p class="fw-none">이 칸은 예시가 없어요. 칸 위의 안내 문장대로 써요.</p>' });
  }
  return steps;
}

// 연필처럼 선을 차례로 그려 보인다(예시 보고서 창과 같은 표시: .dz 선 · .dz-f 명암 · .dz-t 글씨). 손·소리는 생략.
function drawIn(svg, reduced) {
  const ops = [];
  const walk = (el) => { for (const c of el.children) { if (c.classList?.contains('dz')) { const shapes = [...c.querySelectorAll('path, circle, line, polyline')].filter((s) => typeof s.getTotalLength === 'function'); ops.push({ draw: true, shapes, len: Math.max(1, ...shapes.map((s) => { try { return s.getTotalLength(); } catch { return 0; } })) }); } else if (c.classList?.contains('dz-f') || c.classList?.contains('dz-t')) ops.push({ el: c }); else if (c.children?.length) walk(c); } };
  walk(svg);
  if (reduced) return () => {};
  for (const o of ops) { if (o.draw) o.shapes.forEach((s) => { s.style.strokeDasharray = `${o.len}`; s.style.strokeDashoffset = `${o.len}`; }); else o.el.style.opacity = '0'; }
  let stop = false, raf = 0;
  (async () => {
    for (const o of ops) {
      if (stop) return;
      if (!o.draw) { o.el.style.transition = 'opacity .3s'; o.el.style.opacity = ''; await new Promise((r) => setTimeout(r, 90)); continue; }
      const dur = Math.max(90, Math.min(1100, (o.len / 600) * 1000));
      await new Promise((res) => { const t0 = performance.now(); const step = (now) => { if (stop) return res(); const t = Math.min(1, (now - t0) / dur); o.shapes.forEach((s) => { s.style.strokeDashoffset = `${o.len * (1 - t)}`; }); if (t < 1) raf = requestAnimationFrame(step); else res(); }; raf = requestAnimationFrame(step); });
    }
  })();
  return () => { stop = true; cancelAnimationFrame(raf); for (const o of ops) { if (o.draw) o.shapes.forEach((s) => { s.style.strokeDasharray = ''; s.style.strokeDashoffset = ''; }); else o.el.style.opacity = ''; } };
}

export function openFollow(set, { $app, showSpecimen }) {
  const X = sampleFor(set.id); const $rep = $app.querySelector('#ob-report');
  if (!X || !$rep) return null;
  const steps = buildSteps(set, X, $rep); if (!steps.length) return null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $f = document.createElement('aside'); $f.className = 'fw-card'; $f.setAttribute('aria-label', '예시 보고서 따라 하기'); $f.setAttribute('aria-live', 'polite');
  document.body.appendChild($f); document.body.classList.add('fw-on');
  let k = 0, stopDraw = () => {}, min = false;
  // 보고서는 그림을 붙이거나 칸을 더하면 다시 그려진다 → 칸은 매번 새로 찾고, 다시 그려지면 밝힘도 다시
  const $now = () => $rep.querySelector(steps[k].sel) || $rep;
  const mark = () => { const $e = $now(); if ($e.classList.contains('fw-now')) return; $rep.querySelectorAll('.fw-now').forEach((e) => e.classList.remove('fw-now')); if ($e !== $rep) $e.classList.add('fw-now'); };
  const mo = new MutationObserver(mark); mo.observe($rep, { childList: true, subtree: true });
  const show = () => {
    stopDraw(); const st = steps[k]; mark();
    if (st.spec != null) showSpecimen?.(st.spec);
    $f.classList.toggle('min', min);
    $f.innerHTML = `<header><b>📝 예시 따라 하기</b><span class="fw-step">${k + 1} / ${steps.length}</span><span class="fw-sp"></span>
        <button type="button" data-fw="min" aria-expanded="${!min}">${min ? '펴기 ▴' : '접기 ▾'}</button><button type="button" data-fw="end">✕ 끝내기</button></header>
      <h3>${esc(st.title)}</h3>
      <div class="fw-body"><div class="fw-ex"><span class="fw-tag">예시</span>${st.ex}<p class="fw-tip">💡 ${esc(TIP[st.key] || '예시가 무엇을 어떤 순서로 썼는지 보고, 내가 본 것으로 써요.')}</p></div>
        <div class="fw-me"><span class="fw-tag me">내 차례</span><p>${st.draw ? `왼쪽 표본 보기가 <b>${esc(CIRCLED[st.spec])}</b>으로 바뀌었어요. 돌려 보고, 확대해 보고, 내 보고서 <b>관찰그림 ${esc(CIRCLED[st.spec])}</b> 줄에 그려요. 예시를 <b>베끼지 말고</b> 내가 본 대로.` : `아래 내 보고서의 <b>「${esc(st.title)}」</b> 칸(밝게 표시)을 채워요. 예시 문장을 옮겨 쓰지 말고 내가 본 것으로.`}</p>
          <div class="fw-acts">${st.draw ? '<button type="button" class="fw-main" data-fw="draw">✎ 내 그림 그리기</button>' : ''}<button type="button" data-fw="go">내 칸으로 ↓</button></div></div></div>
      <footer><button type="button" data-fw="prev" ${k ? '' : 'disabled'}>◀ 이전</button><span class="fw-dots">${steps.map((_, i) => `<i class="${i === k ? 'on' : i < k ? 'done' : ''}"></i>`).join('')}</span><button type="button" class="fw-main" data-fw="next">${k < steps.length - 1 ? '다음 ▶' : '다 했어요 ✓'}</button></footer>`;
    const svg = $f.querySelector('.fw-ex svg'); if (svg && !min) stopDraw = drawIn(svg, reduced);
    // 아래쪽은 안내 카드가 가리므로 칸을 화면 위로
    $now().scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  const end = () => { stopDraw(); mo.disconnect(); $rep.querySelectorAll('.fw-now').forEach((e) => e.classList.remove('fw-now')); $f.remove(); document.body.classList.remove('fw-on'); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape' && !document.body.classList.contains('sk-open')) end(); };
  document.addEventListener('keydown', onKey);
  $f.addEventListener('click', (e) => {
    const a = e.target.closest('[data-fw]')?.dataset.fw; if (!a) return;
    const st = steps[k];
    if (a === 'end') return end();
    if (a === 'min') { min = !min; return show(); }
    if (a === 'prev' && k > 0) { k--; return show(); }
    if (a === 'next') { if (k < steps.length - 1) { k++; return show(); } return end(); }
    if (a === 'go') return $now().scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (a === 'draw') $now().querySelector('[data-draw-obs]')?.click();
  });
  show();
  return { close: end };
}
