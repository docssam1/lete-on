// 홈 = 로드맵 입구(매거진형). 표지(한 줄 약속 + 이어서 하기) → 지금 열린 실험 수업(3D 실험실 사진 카드)
// → 3~6학년 로드맵(학기마다 정거장 줄) → 한 교재 네 가지 수업. 정거장을 누르면 소단원 시트.
import { SEMS, READY, BOOK_UNITS } from './units-index.js';
import { countNeeds } from './check.js';

const ROMAN = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const A = '../assets/';

// 열린 실험 수업(실험 교재 한 장 = 수업 하나). 사진 = 그 수업의 3D 실험실(assets/thumbs, 실제 화면 캡처).
const LABS = [
  { id: 's41-u01', lab: '고리 자석 방향 바꿔 탑 쌓기', skills: ['가설 설정', '변인 통제', '측정'], sem: '4-1', unit: 'Ⅰ. 자석의 이용', title: '둥실 고리 자석 탑', q: '왜 어떤 자석은 떠 있을까?', theme: '#2F5DA8' },
  { id: 's41-u02', lab: '물의 양 바꿔 얼리고 녹이기', skills: ['가설 설정', '측정', '자료 해석'], sem: '4-1', unit: 'Ⅱ. 물의 상태 변화', title: '얼었다 녹는 물기둥', q: '얼리면 높이와 무게는 어떻게 될까?', theme: '#2A6FB0' },
  { id: 's41-u03', lab: '기울기와 물의 양 바꿔 보기', skills: ['변인 통제', '관찰', '자료 해석'], sem: '4-1', unit: 'Ⅲ. 땅의 변화', title: '흙 언덕 물길', q: '흐르는 물은 흙을 어디로 옮길까?', theme: '#8A5A2B' },
  { id: 's41-u03b', lab: '불 세기와 식히는 빠르기 바꿔 보기', skills: ['모형 실험', '비교', '결론 도출'], sem: '4-1', unit: 'Ⅲ. 땅의 변화', title: '화산 실험실', q: '화산에서는 무엇이 나올까?', theme: '#B23A2E' },
  { id: 's42-u01', lab: '연못에 식물 심고 부레옥잠 눌러 보기', skills: ['관찰', '분류', '결론 도출'], sem: '4-2', unit: 'Ⅰ. 식물의 생활', title: '둥둥 부레옥잠의 비밀', q: '부레옥잠은 어떻게 물에 뜰까?', theme: '#2B7A62' },
  { id: 's42-u02', lab: '물의 온도와 판의 냉각 바꾸어 비교하기', skills: ['변인 통제', '관찰', '자료 해석'], sem: '4-2', unit: 'Ⅱ. 물의 상태 변화', title: '보이지 않는 물의 여행 · 미니 가습기', q: '차가운 판의 물방울은 어디서 왔을까?', theme: '#287B9A', image: 'photos/s42-u02-cups.webp', imageAlt: '실온 컵과 차가운 컵 비교 · AI 실사형 설명 이미지' },
  { id: 's42-u03', lab: '빛·물체·위치를 바꾸어 그림자 비교하기', skills: ['가설 설정', '변인 통제', '자료 해석'], sem: '4-2', unit: 'Ⅲ. 그림자와 거울', title: '빛이 그리는 그림 · 그림자 놀이 상자', q: '그림자는 왜 커졌다 작아졌다 할까?', theme: '#3D4FA8', image: 'photos/s42-u03-shadow.webp', imageAlt: '손전등과 인형 사이 거리에 따른 그림자 크기 비교 · AI 실사형 설명 이미지' },
];

function stateOf(store, id) {
  if (!READY[id]) return { kind: 'locked' };
  const st = store.get(id);
  if (st.passed) return { kind: 'passed', st };
  if ((st.done || []).length || st.step != null) return { kind: 'doing', st };
  return { kind: 'open', st };
}
const ALL = SEMS.flatMap((s) => s.units);
// 이어서 할 곳: 진행 중인 수업 → 아직 안 끝낸 수업 → 없음
function nextLab(store) {
  return LABS.find((l) => stateOf(store, l.id).kind === 'doing') || LABS.find((l) => stateOf(store, l.id).kind === 'open') || null;
}
const startOf = (id) => (BOOK_UNITS.has(id) ? `#/${id}/start` : `#/${id}/1`);
const pct = (store, id) => { const k = stateOf(store, id); return k.kind === 'passed' ? 100 : Math.round(((k.st?.done || []).length / 5) * 100); };

const ICO = {
  self: '<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6.5L4.8 18.2A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.8L14 9.5V3"/><path d="M7.5 15h9"/></svg>',
  teach: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/></svg>',
  print: '<svg viewBox="0 0 24 24"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
  flag: '<svg viewBox="0 0 24 24"><path d="M6 21V4h10l-2 3.5L16 11H8v10z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

function labCard(store, l, feature) {
  const k = stateOf(store, l.id), p = pct(store, l.id);
  const badge = k.kind === 'passed' ? '<span class="h-badge done">끝냄</span>' : k.kind === 'doing' ? `<span class="h-badge doing">${p}% 진행</span>` : '<span class="h-badge">새 수업</span>';
  return `<article class="h-lab${feature ? ' feature' : ''}" style="--t:${l.theme}">
    <a class="h-lab-img" href="${startOf(l.id)}" aria-label="${esc(l.title)} 시작 화면">
      <img src="${A}${l.image || `thumbs/${l.id}.webp`}" alt="${esc(l.imageAlt || `${l.title} 3D 실험실 화면`)}" loading="${feature ? 'eager' : 'lazy'}" width="1200" height="675">
      ${badge}
    </a>
    <div class="h-lab-body">
      <p class="h-kicker">${esc(l.sem.replace('-', '학년 '))}학기 · ${esc(l.unit)}</p>
      <h3><a href="${startOf(l.id)}">${esc(l.title)}</a></h3>
      <p class="h-q">“${esc(l.q)}”</p>
      ${feature ? `<p class="h-exp"><span>오늘의 실험</span>${esc(l.lab)}</p><ul class="h-skills">${l.skills.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      <div class="h-prog" role="progressbar" aria-label="진행" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"><i style="width:${p}%"></i></div>
      <div class="h-lab-go">
        <a class="h-btn solid" href="#/${l.id}/lab-class/self/1">${ICO.self}${k.kind === 'doing' ? '이어서 공부' : '스스로 공부'}</a>
        <a class="h-btn" href="#/${l.id}/lab-class/teach/1">${ICO.teach}가르치기</a>
        <a class="h-btn" href="#/${l.id}/lab-book/student">${ICO.book}교재</a>
      </div>
    </div>
  </article>`;
}

function roadmap(store, nx) {
  const grades = [3, 4, 5, 6];
  return grades.map((g) => `<div class="h-grade">
    <div class="h-grade-no"><b>${g}</b><span>학년</span></div>
    <div class="h-sems">${SEMS.filter((s) => s.sem.startsWith(`${g}-`)).map((s) => {
      const open = s.units.filter((u) => READY[u.id]).length;
      return `<div class="h-sem">
        <p class="h-sem-t">${s.sem.split('-')[1]}학기 <small>${open ? `${open}개 열림` : '준비 중'}</small></p>
        <ol class="h-track" style="--n:${s.units.length}">${s.units.map((u) => {
          const k = stateOf(store, u.id), isNext = nx && (u.id === nx.id || (READY[nx.id]?.hidden && u.id === 's41-u03' && nx.id === 's41-u03b'));
          const label = `${s.sem.replace('-', '학년 ')}학기 ${ROMAN[u.no - 1]}. ${u.title}${k.kind === 'passed' ? ', 끝냄' : k.kind === 'locked' ? ', 준비 중' : ''}`;
          const inner = `<span class="h-dot">${k.kind === 'passed' ? ICO.flag : ROMAN[u.no - 1]}</span><span class="h-name">${esc(u.title)}</span>`;
          return `<li class="h-stop ${k.kind}${isNext ? ' next' : ''}">${READY[u.id]
            ? `<a href="${startOf(u.id)}" data-unit="${u.id}" aria-label="${esc(label)}">${inner}</a>`
            : `<button type="button" aria-label="${esc(label)}">${inner}</button>`}${isNext ? '<span class="h-here">지금 여기</span>' : ''}</li>`;
        }).join('')}</ol></div>`;
    }).join('')}</div></div>`).join('');
}

export function pageHome($app, store, teacher) {
  const nx = nextLab(store), go = nx || LABS[0], gok = stateOf(store, go.id);
  const need = countNeeds();
  const passedN = ALL.filter((u) => stateOf(store, u.id).kind === 'passed').length;
  const openN = ALL.filter((u) => READY[u.id]).length;
  const cta = !nx ? '다시 보기' : gok.kind === 'doing' ? '이어서 하기' : '첫 수업 시작하기';
  const feature = go, rest = LABS.filter((l) => l !== feature);
  $app.innerHTML = `<div class="h">
    <header class="h-top"><div class="h-wrap">
      <a class="h-brand" href="#/"><img src="${A}docssam-A1-mouth-closed.webp" alt="" width="28" height="42"><span>docssam <b>과학 탐구 랩</b></span></a>
      <nav class="h-nav" aria-label="바로 가기"><a href="#h-labs">실험 수업</a><a href="#h-map">로드맵</a><a href="#h-modes">수업 방식</a><a class="h-intro" href="../intro/">교재 소개</a></nav>
    </div></header>

    <section class="h-hero"><div class="h-wrap h-hero-in">
      <div class="h-hero-copy">
        <p class="h-eyebrow">초등 과학 3~6학년 · 교과서 ${ALL.length}개 단원</p>
        <h1>교과서 단원마다,<br><em>실험 한 장씩.</em></h1>
        <p class="h-lede">예상하고, 3D 실험실에서 직접 해 보고, 내 말로 정리해요. 이 길을 따라가면 초등 과학이 하나로 이어져요.</p>
        <div class="h-cta">
          <a class="h-btn solid big" href="${startOf(go.id)}">${cta} · ${esc(go.title)}${ICO.arrow}</a>
          <a class="h-btn big ghost" href="#h-map">로드맵 보기</a>
        </div>
        <dl class="h-stats">
          <div><dt>열린 실험 수업</dt><dd>${LABS.length}<small>개</small></dd></div>
          <div><dt>열린 단원</dt><dd>${openN}<small>/${ALL.length}</small></dd></div>
          <div><dt>모은 깃발</dt><dd>${passedN}<small>개</small></dd></div>
        </dl>
      </div>
      <div class="h-hero-art" aria-hidden="true">
        <div class="h-orbit"></div>
        <figure class="h-shot" style="--t:${feature.theme}"><img src="${A}${feature.image || `thumbs/${feature.id}.webp`}" alt="" width="1200" height="675"><figcaption><small>다음 수업</small>${esc(feature.title)}</figcaption></figure>
        <img class="h-doc" src="${A}docssam-B4-encourage.webp" alt="" width="360" height="540">
      </div>
    </div></section>

    <main>
      <section class="h-sec" id="h-labs"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">01</p><div><h2>지금 열린 실험 수업</h2><p>실험 교재 한 장이 수업 하나예요. 3D 실험실에서 직접 바꿔 보고, 기록하고, 결론을 써요.</p></div></header>
        <div class="h-labs">${labCard(store, feature, true)}${rest.map((l) => labCard(store, l, false)).join('')}</div>
      </div></section>

      <section class="h-sec alt" id="h-map"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">02</p><div><h2>3학년부터 6학년까지, 한 길로</h2><p>정거장 하나가 교과서 단원 하나예요. 파란 정거장은 지금 열려 있고, 끝내면 깃발이 꽂혀요.</p></div></header>
        <div class="h-check"><div><b>선생님 확인</b><p>이 기기에서 스스로 공부한 쓰기 답을 확인해요. 기록은 다른 기기로 전송되지 않아요.</p></div><a class="h-btn" href="#/check">확인할 답 보기${need ? ` <span class="h-check-count">${need}</span>` : ''}${ICO.arrow}</a></div>
        <div class="h-legend" aria-hidden="true"><span><i class="open"></i>열림</span><span><i class="passed"></i>끝냄</span><span><i class="locked"></i>준비 중</span></div>
        <div class="h-map">${roadmap(store, nx)}</div>
      </div></section>

      <section class="h-sec" id="h-modes"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">03</p><div><h2>한 교재, 네 가지 수업</h2><p>같은 실험 한 장을 집에서도, 교실에서도, 종이로도 써요.</p></div></header>
        <div class="h-modes">
          <a class="h-mode" href="#/${go.id}/lab-class/self/1"><span class="h-mode-ico">${ICO.self}</span><b>스스로 공부하기</b><p>독쌤이 한 단계씩 안내해요. 하나를 마치면 다음으로 저절로 넘어가요.</p><span class="h-more">해 보기${ICO.arrow}</span></a>
          <a class="h-mode" href="#/${go.id}/lab-class/teach/1"><span class="h-mode-ico">${ICO.teach}</span><b>가르치기</b><p>전자칠판 수업 화면. 영상·3D 실험·문제, 답은 선생님이 차례로 열어요. 두 팀 배틀까지.</p><span class="h-more">수업 화면${ICO.arrow}</span></a>
          <a class="h-mode" href="#/${go.id}/lab-book/student"><span class="h-mode-ico">${ICO.book}</span><b>살아 있는 교재</b><p>종이 교재를 펼치듯 넘기다가, 실험 그림에서 3D 실험실과 영상이 바로 열려요.</p><span class="h-more">교재 펼치기${ICO.arrow}</span></a>
          <a class="h-mode" href="#/${go.id}/lab-book/teacher"><span class="h-mode-ico">${ICO.print}</span><b>A4로 인쇄하기</b><p>학생용 교재와 정답·지도 팁이 든 교사용 교재를 A4로 뽑아요.</p><span class="h-more">교사용 교재${ICO.arrow}</span></a>
        </div>
      </div></section>
    </main>
    <footer class="h-foot"><div class="h-wrap"><p><b>docssam 과학 탐구 랩</b> · 지필드 실험 과학 영재</p><p>정거장을 끝내면 깃발이 꽂혀요. 준비 중인 정거장은 차례로 열려요.</p></div></footer>
  </div>
  <div class="toast" role="status" aria-live="polite" hidden></div>
  <div class="sheet-bg" hidden></div><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t" hidden></section>`;

  teacher(null, [passedN
    ? { mood: 'praise', text: `깃발을 ${passedN}개 모았어요! 다음 수업으로 가 볼까요?` }
    : { mood: 'talk', text: `안녕하세요! 오늘은 ${go.title}부터 탐구해요.` }]);

  const $toast = $app.querySelector('.toast'); let tm;
  $app.querySelectorAll('.h-stop button').forEach((b) => b.addEventListener('click', () => {
    $toast.textContent = '이 정거장은 준비 중이에요. 열리면 알려 줄게요.'; $toast.hidden = false;
    clearTimeout(tm); tm = setTimeout(() => { $toast.hidden = true; }, 2200);
  }));
  // 정거장 → 소단원 시트
  const $sheet = $app.querySelector('.sheet'), $bg = $app.querySelector('.sheet-bg');
  const close = () => { $sheet.hidden = $bg.hidden = true; };
  $bg.addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  $app.querySelectorAll('.h-stop a[data-unit]').forEach((a) => a.addEventListener('click', (e) => {
    const u = ALL.find((x) => x.id === a.dataset.unit), r = READY[u.id];
    if (!r?.subs) return; e.preventDefault();
    const [g, h] = u.id.slice(1, 3).split('');
    const labs = r.labs || [{ id: u.id, hero: r.hero }];
    $sheet.innerHTML = `<div class="grab" aria-hidden="true"></div><p class="step-label">${g}학년 ${h}학기 ${ROMAN[u.no - 1]}</p><h2 id="sheet-t">${esc(u.title)}</h2>
      <div class="labs">${labs.map((l) => { const ks = stateOf(store, l.id).kind, meta = LABS.find((x) => x.id === l.id); return `<a class="btn primary" href="${startOf(l.id)}"><b>${esc(meta?.title || l.hero)}</b><small>${l.covers ? `소단원 ${l.covers.map((c) => r.subs.findIndex((x) => x.id === c) + 1).join('·')} · ` : ''}${ks === 'doing' ? '이어서 하기' : ks === 'passed' ? '다시 보기' : '실험 수업 시작'}</small></a>`; }).join('')}</div>
      <h3>소단원</h3><ol class="subs">${r.subs.map((s, i) => `<li><a href="#/${u.id}/sub/${s.id}"><span class="sn">${i + 1}</span><span class="st">${esc(s.name)}</span><span class="sc">유형 ${s.types}</span></a></li>`).join('')}</ol>
      <button type="button" class="btn" data-close>닫기</button>`;
    $sheet.querySelector('[data-close]').addEventListener('click', close);
    $sheet.hidden = $bg.hidden = false; $sheet.querySelector('a').focus();
  }));
  // 부드러운 이동(메뉴)
  $app.querySelectorAll('a[href^="#h-"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  scrollTo(0, 0);
}
