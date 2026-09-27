// 같은 읽을거리 데이터를 웹·살아 있는 교재·A4에서 사용한다. 원문 문제/정답은 건드리지 않는다.
const esc = (s) => String(s ?? '').replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));
const prose = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const link = (s) => /^https:\/\//.test(s || '') || /^\.\.\/v2\/#\/s\d{2}-u\d{2}[a-z]?\//.test(s || '') ? esc(s) : '#';

export function readingHtml(a, { teacher = false } = {}) {
  const split = Math.ceil(a.sections.length / 2);
  return `<article class="sl-reading" aria-label="${esc(a.title)}" data-reading-id="${esc(a.id)}">
    <header class="sl-reading-head">
      <div class="sl-reading-kicker"><span>${esc(a.kicker)}</span><span>FIELD NOTES / ${esc(a.issue)}</span></div>
      <p class="sl-reading-topic">${esc(a.topic)}</p>
      <h2>${esc(a.title)}</h2><p class="sl-reading-lead">${esc(a.lead)}</p>
    </header>
    <figure class="sl-reading-hero">
      <img src="${link(a.hero.src)}" alt="${esc(a.hero.cap)}" width="800" height="500" loading="eager" decoding="async">
      <div class="sl-reading-player" data-src="${link(a.video.src)}" data-mp4="${link(a.video.mp4)}" data-full="${link(a.video.full)}">
        <video controls playsinline preload="none" poster="${link(a.hero.src)}" aria-label="${esc(a.video.title)}"></video>
        <button type="button" data-reading-play>책 안에서 영상 보기</button>
        <p data-video-status hidden role="status">영상을 불러오지 못했어요. 다시 누르거나 <a href="${link(a.video.page)}" target="_blank" rel="noopener">원본 영상</a>을 열어 보세요.</p>
      </div>
      <figcaption class="sl-reading-photo-caption"><span>${esc(a.hero.cap)}</span><a href="${link(a.hero.page)}" target="_blank" rel="noopener">사진: ${esc(a.hero.credit)}</a></figcaption>
      <figcaption class="sl-reading-video-caption"><span>${esc(a.video.title)} · ${esc(a.video.credit)}</span><a href="${link(a.hero.page)}" target="_blank" rel="noopener">대기 사진: ${esc(a.hero.credit)} · 2003</a></figcaption>
    </figure>
    <p class="sl-reading-look"><b>관찰해 봐요</b> ${esc(a.hero.look)}</p>
    <div class="sl-reading-columns">${[a.sections.slice(0, split), a.sections.slice(split)].map((col, i) => `<div>${col.map((s, j) => `<section class="sl-reading-section"><h3><span>${String(i * split + j + 1).padStart(2, '0')}</span>${esc(s.title)}</h3><p>${prose(s.text)}</p></section>`).join('')}</div>`).join('')}</div>
    <aside class="sl-reading-think"><h3>독쌤과 생각 이어 가기</h3><p>${esc(a.question)}</p>${teacher ? `<p class="sl-reading-teacher"><b>교사용</b> ${esc(a.teacherTip)}</p>` : ''}</aside>
    <div class="sl-reading-connect">
      <div><b>읽은 것을 직접 살펴봐요</b><div class="sl-reading-actions"><a data-reading-watch href="${link(a.video.page)}" target="_blank" rel="noopener">실제 용암 영상 <span aria-hidden="true">▶</span></a><a class="sl-reading-online" href="${link(a.labHref)}">실험실로 이동 <span aria-hidden="true">→</span></a><a class="sl-reading-printlink" href="${link(a.publicLabHref)}">3D 실험실 <span aria-hidden="true">→</span></a></div></div>
      <a class="sl-reading-qr" href="${link(a.publicLabHref)}" aria-label="화산 3D 실험실 열기"><img src="${esc(a.qr)}" width="80" height="80" alt="화산 3D 실험실로 연결되는 QR"><span>화산 3D 실험실</span></a>
    </div>
    <footer class="sl-reading-sources"><span>읽을거리 근거</span> ${a.sources.map((s) => `<a href="${link(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(' · ')}</footer>
  </article>`;
}
