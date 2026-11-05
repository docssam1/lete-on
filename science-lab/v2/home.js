import { currentCourses } from './home-courses.js?v=20261104-home-courses';
import { CLASSROOM_VISIT_KEY, classroomVisitSummary } from './classroom-visit.js?v=20261104-classroom-visit';
// 홈 = 교과 연결 사고력 수업·교재와 2022 개정32단원의 차례.
// 기존 2015 실험 자료와 그 학습 기록은 아래 별도 목록에 보존한다.
import { SEMS, READY, BOOK_UNITS, BANK } from './units-index.js?v=20261104-career-labels';
import { SEMS_2022, contentId2022 } from './curriculum-2022.js?v=20261104-career-class';
import { placeOf, placeLabel, placeNow, legacyFor } from './curriculum-place.js?v=20261104-career-labels';
import { countNeeds } from './check.js';

const ROMAN = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const A = '../assets/';

// 예전 교과서의 실험 수업 카드. 원래 수업과 기록을 유지한다.
const LEGACY_LABS = [
  {"id":"s42-u01","lab":"연못에 식물 심고 부레옥잠 눌러 보기","skills":["관찰","분류","결론 도출"],"sem":"4-2","unit":"Ⅰ. 식물의 생활","title":"둥둥 부레옥잠의 비밀","q":"부레옥잠은 어떻게 물에 뜰까?","theme":"#2B7A62"},
  {"id":"s42-u02","lab":"물의 온도와 판의 냉각 바꾸어 비교하기","skills":["변인 통제","관찰","자료 해석"],"sem":"4-2","unit":"Ⅱ. 물의 상태 변화","title":"보이지 않는 물의 여행 · 미니 가습기","q":"차가운 판의 물방울은 어디서 왔을까?","theme":"#287B9A","image":"photos/s42-u02-cups.webp","imageAlt":"실온 컵과 차가운 컵 비교"},
  {"id":"s42-u03","lab":"빛·물체·위치를 바꾸어 그림자 비교하기","skills":["가설 설정","변인 통제","자료 해석"],"sem":"4-2","unit":"Ⅲ. 그림자와 거울","title":"빛이 그리는 그림 · 그림자 놀이 상자","q":"그림자는 왜 커졌다 작아졌다 할까?","theme":"#3D4FA8","image":"photos/s42-u03-shadow.webp","imageAlt":"손전등과 인형 사이 거리에 따른 그림자 크기 비교"},
  {"id":"s42-u04","lab":"미는 힘을 바꾸어 지층의 변화 보기","skills":["가설 설정","모형 실험","결론 도출"],"sem":"4-2","unit":"Ⅳ. 화산과 지진","title":"땅이 흔들리는 까닭 · 지층 모형 지진 실험실","q":"단단한 땅은 왜 흔들릴까?","theme":"#9A4B2E"},
  {"id":"s42-u05","lab":"햇빛과 찬 공기를 바꾸어 수조 속 비 관찰하기","skills":["가설 설정","모형 실험","결론 도출"],"sem":"4-2","unit":"Ⅴ. 물의 여행","title":"물 한 방울의 여행 · 수조 속 작은 지구","q":"오늘 내리는 비는 어디에서 왔을까?","theme":"#2B6F9E"},
  {"id":"s51-u01","lab":"구멍과 높이를 바꾸어 튀는 방울 세기","skills":["변인 통제","측정","결론 도출"],"sem":"5-1","unit":"Ⅰ. 과학자는 어떻게 탐구할까요","title":"과학자처럼 탐구하기 · 튀는 물방울 실험실","q":"무엇이 튀는 물방울의 수를 바꿀까?","theme":"#4B3FB5"},
  {"id":"s51-u02","lab":"띠의 재료와 물의 온도를 바꾸어 열의 이동 보기","skills":["가설 설정","관찰","결론 도출"],"sem":"5-1","unit":"Ⅱ. 온도와 열","title":"열이 지나가는 길 · 시온 스티커 실험실","q":"손난로의 열은 어디로 갔을까?","theme":"#C2581C"},
  {"id":"s51-u03","lab":"넣은 물의 양을 바꾸어 식용유 「태양」 띄우기","skills":["가설 설정","관찰","모형으로 설명하기"],"sem":"5-1","unit":"Ⅲ. 태양계와 별","title":"병 속에 뜬 태양 · 태양계와 별","q":"태양과 행성은 어떻게 생겨났을까?","theme":"#3346A0"},
  {"id":"s52-u01","lab":"비눗물에 넣는 것을 바꾸어 비눗방울 오래 띄우기","skills":["문제 인식","변인 통제","자료 변환"],"sem":"5-2","unit":"Ⅰ. 재미있는 나의 탐구","title":"비눗방울 탐구 · 나의 탐구","q":"비눗방울을 오래 띄울 수 있을까?","theme":"#6B3FA0"},
  {"id":"s51-u05","lab":"물의 온도를 바꾸어 효모빵 반죽 부풀리기","skills":["가설 설정","변인 통제","측정"],"sem":"5-1","unit":"Ⅴ. 다양한 생물과 우리 생활","title":"부푸는 효모빵 · 다양한 생물과 우리 생활","q":"빵은 왜 폭신폭신할까?","theme":"#2F7D4F"},
  {"id":"s51-u04","lab":"식히는 온도를 바꾸어 병 속에 눈 내리게 하기","skills":["가설 설정","관찰","자료 해석"],"sem":"5-1","unit":"Ⅳ. 용해와 용액","title":"병 속의 눈 · 용해와 용액","q":"녹아서 보이지 않는 물질은 어디로 갔을까?","theme":"#2B5FA8"},
];
const LABS = [...currentCourses, ...LEGACY_LABS];
const currentIds = new Set(currentCourses.map(course => course.id));

function stateOf(store, id) {
  if (!READY[id]) return { kind: 'locked' };
  // 옛 5단계의 passed/done을 새 사고력 수업의 완료로 해석하지 않는다.
  if (currentIds.has(id)) {
    const visit = classroomVisitSummary(id, store.get(id)[CLASSROOM_VISIT_KEY]);
    return visit ? { kind: 'doing', visit } : { kind: 'open' };
  }
  const st = store.get(id);
  if (st.passed) return { kind: 'passed', st };
  if ((st.done || []).length || st.step != null) return { kind: 'doing', st };
  return { kind: 'open', st };
}
// 홈 로드맵 = 2022 개정 32단원. 정거장 id = 그 자리를 채우는 내용 id(없으면 준비 중).
const ALL = SEMS_2022.flatMap((s) => s.units.map((u) => ({ ...u, sem: s.sem, id: contentId2022(u.position) })));
const is2022 = (id) => placeOf(id)?.era === '2022';
// 2015 교재 단원 중 홈 아래 「예전 교과서 자료」에 보일 것(같은 단원이 2022 내용으로 쓰이는 3-1·4-1은 뺀다)
const LEGACY = SEMS.filter((s) => ['3-2', '4-2', '5-1', '5-2'].includes(s.sem)).flatMap((s) => s.units.map((u) => ({ ...u, sem: s.sem })))
  .filter((u) => !is2022(u.id) && (READY[u.id] || BANK[u.id]));
// 별도 열람 기록이 있는 현행 수업 중 가장 최근에 연 수업을 고른다.
function nextLab(store) {
  const now = LABS.filter((l) => is2022(l.id));
  const seen = now.map(course => ({ course, visit: stateOf(store, course.id).visit })).filter(row => row.visit);
  seen.sort((a, b) => b.visit.updatedAt - a.visit.updatedAt);
  return seen[0]?.course || now[0] || null;
}
const startOf = (id) => (BOOK_UNITS.has(id) ? `#/${id}/start` : READY[id]?.bankOnly ? `#/${id}/sub/E1` : `#/${id}/1`);
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
  const badge = l.current ? `<span class="h-badge">${k.visit ? `지난번 ${k.visit.lastNumber}/${k.visit.total}화면` : '교과 연결 수업'}</span>` : k.kind === 'passed' ? '<span class="h-badge done">끝냄</span>' : k.kind === 'doing' ? `<span class="h-badge doing">${p}% 진행</span>` : '<span class="h-badge">새 수업</span>';
  return `<article class="h-lab${feature ? ' feature' : ''}" style="--t:${l.theme}">
    <a class="h-lab-img" href="${startOf(l.id)}" aria-label="${esc(l.title)} 시작 화면">
      <img src="${A}${l.image || `thumbs/${l.id}.webp`}" alt="${esc(l.imageAlt || `${l.title} 3D 실험실 화면`)}" style="${l.imageFit === 'contain' ? 'object-fit:contain;background:#000' : ''}" loading="${feature ? 'eager' : 'lazy'}" width="1200" height="675">
      ${badge}
    </a>
    <div class="h-lab-body">
      <p class="h-kicker"><span class="h-era${is2022(l.id) ? '' : ' old'}">${is2022(l.id) ? '2022 개정' : '2015 교재'}</span>${esc(placeLabel(l.id).replace(/^[^·]+· /, ''))}</p>
      ${is2022(l.id) ? '' : `<p class="h-now">${esc(placeNow(l.id))}</p>`}
      <h3><a href="${startOf(l.id)}">${esc(l.title)}</a></h3>
      <p class="h-q">“${esc(l.q)}”</p>
      ${feature ? `<p class="h-exp"><span>${l.current ? '함께 배울 내용' : '오늘의 실험'}</span>${esc(l.lab)}</p><ul class="h-skills">${l.skills.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${l.current ? '' : `<div class="h-prog" role="progressbar" aria-label="진행" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"><i style="width:${p}%"></i></div>`}
      <div class="h-lab-go">
        <a class="h-btn solid" href="#/${l.id}/lab-class/self/${k.visit ? 'resume' : '1'}">${ICO.self}${k.visit ? '지난 화면부터' : k.kind === 'doing' ? '이어서 공부' : '스스로 공부'}</a>
        <a class="h-btn" href="#/${l.id}/lab-class/teach/1">${ICO.teach}가르치기</a>
        <a class="h-btn" href="#/${l.id}/lab-book/student">${ICO.book}교재</a>
      </div>
    </div>
  </article>`;
}

function roadmap(store, nx) {
  const grades = [3, 4, 5, 6], here = nx && placeOf(nx.id)?.position;
  return grades.map((g) => `<div class="h-grade">
    <div class="h-grade-no"><b>${g}</b><span>학년</span></div>
    <div class="h-sems">${SEMS_2022.filter((s) => s.sem.startsWith(`${g}-`)).map((s) => {
      const open = s.units.filter((u) => READY[contentId2022(u.position)]).length;
      return `<div class="h-sem">
        <p class="h-sem-t">${s.sem.split('-')[1]}학기 <small>${open ? `${open}개 열림` : '준비 중'}</small></p>
        <ol class="h-track" style="--n:${s.units.length}">${s.units.map((u) => {
          const id = contentId2022(u.position), k = id ? stateOf(store, id) : { kind: 'locked' }, isNext = here === u.position;
          const label = `2022 개정 ${s.sem.replace('-', '학년 ')}학기 ${ROMAN[u.no - 1]}. ${u.title}${k.kind === 'passed' ? ', 끝냄' : k.kind === 'locked' ? ', 준비 중' : ''}`;
          const inner = `<span class="h-dot">${k.kind === 'passed' ? ICO.flag : ROMAN[u.no - 1]}</span><span class="h-name">${esc(u.title)}</span>`;
          return `<li class="h-stop ${k.kind}${isNext ? ' next' : ''}">${k.kind !== 'locked'
            ? `<a href="${startOf(id)}" data-pos="${u.position}" aria-label="${esc(label)}">${inner}</a>`
            : `<button type="button" aria-label="${esc(label)}">${inner}</button>`}${isNext ? `<span class="h-here">${k.visit ? '지난 수업' : '여기서 시작'}</span>` : ''}</li>`;
        }).join('')}</ol></div>`;
    }).join('')}</div></div>`).join('');
}

// 2015 교재 자료: 단원평가 원문과 예전 실험 수업은 그대로 쓰되, 지금 교과서의 어느 단원과 이어지는지 함께 적는다.
function legacyList(store) {
  return `<ul class="h-old">${LEGACY.map((u) => {
    const k = READY[u.id] ? stateOf(store, u.id) : { kind: 'open' }, lab = LABS.find((l) => l.id === u.id);
    return `<li><a href="${startOf(u.id)}"><span class="h-era old">2015 교재</span><b>${esc(u.sem.replace('-', '학년 '))}학기 ${ROMAN[u.no - 1]}. ${esc(u.title)}</b>
      <small>${esc(placeNow(u.id))}</small><em>${lab ? esc(lab.title) : BANK[u.id] ? `단원평가 원문 ${BANK[u.id].n}문항` : ''}${k.kind === 'passed' ? ' · 끝냄' : ''}</em></a></li>`;
  }).join('')}</ul>`;
}

export function pageHome($app, store, teacher) {
  const sourceStore = store, cached = new Map();
  store = { get(id) { if (!cached.has(id)) cached.set(id, sourceStore.get(id)); return cached.get(id); } };
  const nx = nextLab(store), go = nx || LABS[0];
  const lastView = stateOf(store, go.id).visit;
  const need = countNeeds();
  const openN = ALL.filter((u) => READY[u.id]).length;
  const cta = lastView ? '지난 화면부터' : '수업 열기';
  const feature = go, rest = LABS.filter((l) => l !== feature && is2022(l.id)), old = LABS.filter((l) => l !== feature && !is2022(l.id));
  $app.innerHTML = `<div class="h">
    <header class="h-top"><div class="h-wrap">
      <a class="h-brand" href="#/"><img src="${A}docssam-A1-mouth-closed.webp" alt="" width="28" height="42"><span>docssam <b>과학 탐구 랩</b></span></a>
      <nav class="h-nav" aria-label="바로 가기"><a href="#h-labs">교과 연결 수업</a><a href="#h-map">로드맵</a><a href="#h-old">예전 교과서</a><a href="#h-modes">수업 방식</a><a href="#/bank">문제은행</a><a class="h-intro" href="../intro/">교재 소개</a></nav>
    </div></header>

    <section class="h-hero"><div class="h-wrap h-hero-in">
      <div class="h-hero-copy">
        <p class="h-eyebrow">초등 과학 3~6학년 · 교과 연결 사고력</p>
        <h1>관찰하고 비교하며,<br><em>과학으로 설명해요.</em></h1>
        <p class="h-lede">교과 개념을 익히고 관찰과 자료 비교로 생각을 넓혀요. 알아낸 것을 근거와 함께 내 말로 설명해요.</p>
        <div class="h-cta">
          <a class="h-btn solid big" href="${lastView ? `#/${go.id}/lab-class/self/resume` : startOf(go.id)}">${cta} · ${esc(go.title)}${ICO.arrow}</a>
          <a class="h-btn big ghost" href="#h-map">로드맵 보기</a>
        </div>
        <dl class="h-stats">
          <div><dt>교과 연결 수업</dt><dd>${currentCourses.length}<small>개</small></dd></div>
          <div><dt>열린 2022 단원</dt><dd>${openN}<small>/${ALL.length}</small></dd></div>
          <div><dt>함께 보는 교재</dt><dd>${currentCourses.filter(l => BOOK_UNITS.has(l.id)).length}<small>권</small></dd></div>
        </dl>
      </div>
      <div class="h-hero-art" aria-hidden="true">
        <div class="h-orbit"></div>
        <figure class="h-shot" style="--t:${feature.theme}"><img src="${A}${feature.image || `thumbs/${feature.id}.webp`}" alt="" style="${feature.imageFit === 'contain' ? 'object-fit:contain;background:#000' : ''}" width="1200" height="675"><figcaption><small>교과 연결 수업</small>${esc(feature.title)}</figcaption></figure>
        <img class="h-doc" src="${A}docssam-B4-encourage.webp" alt="" width="360" height="540">
      </div>
    </div></section>

    <main>
      <section class="h-sec" id="h-labs"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">01</p><div><h2>2022 개정 교과 연결 수업</h2><p>단원별 교재로 개념을 익히고 관찰·자료 비교·토의로 생각을 이어 가요.</p></div></header>
        <div class="h-labs">${labCard(store, feature, true)}${rest.map((l) => labCard(store, l, false)).join('')}</div>
      </div></section>

      <section class="h-sec alt" id="h-map"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">02</p><div><h2>3~6학년 로드맵 · 2022 개정 32단원</h2><p>학년과 학기에 맞는 단원을 골라요. 열린 단원에서 수업·교재·유형별 문제로 이어져요. 단원평가는 <a href="#/bank">문제은행</a>에서 골라요.</p></div></header>
        <div class="h-check"><div><b>선생님 확인</b><p>이 기기에서 스스로 공부한 쓰기 답을 확인해요. 기록은 다른 기기로 전송되지 않아요.</p></div><a class="h-btn" href="#/check">확인할 답 보기${need ? ` <span class="h-check-count">${need}</span>` : ''}${ICO.arrow}</a></div>
        <div class="h-legend" aria-hidden="true"><span><i class="open"></i>열림</span><span><i class="locked"></i>준비 중</span></div>
        <div class="h-map">${roadmap(store, nx)}</div>
      </div></section>

      <section class="h-sec" id="h-old"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">03</p><div><h2>예전 교과서(2015) 자료</h2><p>예전 교과서 단원의 실험 수업과 단원평가예요. 학년·단원 번호가 지금 교과서와 달라요. 단원마다 지금 교과서의 어느 단원과 이어지는지 적어 두었어요.</p></div></header>
        ${old.length ? `<div class="h-labs">${old.map((l) => labCard(store, l, false)).join('')}</div>` : ''}
        <h3 class="h-old-t">2015 교재 단원 차례</h3>${legacyList(store)}
      </div></section>

      <section class="h-sec" id="h-modes"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">04</p><div><h2>한 교재, 네 가지 수업</h2><p>같은 교재를 혼자 공부할 때도, 친구들과 수업할 때도, 종이로 풀 때도 써요.</p></div></header>
        <div class="h-modes">
          <a class="h-mode" href="#/${go.id}/lab-class/self/1"><span class="h-mode-ico">${ICO.self}</span><b>스스로 공부하기</b><p>독쌤의 안내를 듣고 문제를 풀어요. 관찰과 제작 활동은 충분히 해 보고 다음으로 넘어가요.</p><span class="h-more">해 보기${ICO.arrow}</span></a>
          <a class="h-mode" href="#/${go.id}/lab-class/teach/1"><span class="h-mode-ico">${ICO.teach}</span><b>가르치기</b><p>자료와 발문을 함께 살펴보고 서로의 생각을 이야기해요. 답과 설명은 선생님이 차례로 열어요.</p><span class="h-more">수업 화면${ICO.arrow}</span></a>
          <a class="h-mode" href="#/${go.id}/lab-book/student"><span class="h-mode-ico">${ICO.book}</span><b>살아 있는 교재</b><p>개념과 예제, 여러 유형의 문제를 차례로 살펴봐요. 오른쪽에는 더 알아볼 내용과 정리할 것이 있어요.</p><span class="h-more">교재 펼치기${ICO.arrow}</span></a>
          <a class="h-mode" href="#/${go.id}/workbook/teacher"><span class="h-mode-ico">${ICO.print}</span><b>A4로 인쇄하기</b><p>학생용 교재와 정답·지도 팁이 든 교사용 교재를 A4로 뽑아요.</p><span class="h-more">교사용 교재${ICO.arrow}</span></a>
        </div>
      </div></section>
    </main>
    <footer class="h-foot"><div class="h-wrap"><p><b>docssam 과학 탐구 랩</b> · 지필드 교과 연결 사고력</p><p>관찰한 것과 자료에서 찾은 것을 바탕으로 과학을 설명해요.</p></div></footer>
  </div>
  <div class="toast" role="status" aria-live="polite" hidden></div>
  <div class="sheet-bg" hidden></div><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t" hidden></section>`;

  teacher(null, [{ mood: 'talk', text: '안녕하세요! 배울 단원을 골라 관찰하고 비교하며 과학으로 설명해 보아요.' }]);

  const $toast = $app.querySelector('.toast'); let tm;
  $app.querySelectorAll('.h-stop button').forEach((b) => b.addEventListener('click', () => {
    $toast.textContent = '이 단원은 준비 중이에요. 다른 열린 단원을 골라요.'; $toast.hidden = false;
    clearTimeout(tm); tm = setTimeout(() => { $toast.hidden = true; }, 2200);
  }));
  // 정거장 → 소단원 시트
  const $sheet = $app.querySelector('.sheet'), $bg = $app.querySelector('.sheet-bg');
  const close = () => { $sheet.hidden = $bg.hidden = true; };
  $bg.addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  $app.querySelectorAll('.h-stop a[data-pos]').forEach((a) => a.addEventListener('click', (e) => {
    const u = ALL.find((x) => x.position === a.dataset.pos), r = READY[u.id];
    if (!r?.subs) return; e.preventDefault();
    const [g, h] = u.sem.split('-');
    const labs = r.bankOnly ? [] : r.labs || [{ id: u.id, hero: r.hero }], bk = BANK[u.id];
    const extra = Object.keys(READY).filter((id) => READY[id].hidden && placeOf(id)?.position === u.position && !labs.some((l) => l.id === id)).map((id) => ({ id, hero: READY[id].hero }));
    const olds = legacyFor(u.position).filter((id) => READY[id] || BANK[id]);
    $sheet.innerHTML = `<div class="grab" aria-hidden="true"></div><p class="step-label">2022 개정 · ${g}학년 ${h}학기 ${ROMAN[u.no - 1]}</p><h2 id="sheet-t">${esc(u.title)}</h2>
      ${labs.length ? '' : '<p class="lead">이 단원의 수업은 준비 중이에요. 소단원 문제와 단원평가로 공부해요.</p>'}<div class="labs">${[...labs, ...extra].map((l) => { const progress = stateOf(store, l.id), ks = progress.kind, meta = LABS.find((x) => x.id === l.id); return `<a class="btn primary" href="${progress.visit ? `#/${l.id}/lab-class/self/resume` : startOf(l.id)}"><b>${esc(meta?.title || l.hero)}</b><small>${l.covers ? `소단원 ${l.covers.map((c) => r.subs.findIndex((x) => x.id === c) + 1).join('·')} · ` : ''}${ks === 'doing' ? '이어서 하기' : ks === 'passed' ? '다시 보기' : '수업 시작'}</small></a>`; }).join('')}</div>
      ${bk?.sets?.length ? `<h3>단원평가 <small>${bk.n ? `원문 ${bk.n}문항` : '창작 문항'}</small></h3><div class="sheet-sets">${bk.sets.map((n) => `<a class="btn" href="#/${u.id}/exam/${n}">세트${n}</a>`).join('')}</div>` : ''}
      <h3>소단원</h3><ol class="subs">${r.subs.map((s, i) => `<li><a href="#/${u.id}/sub/${s.id}"><span class="sn">${i + 1}</span><span class="st">${esc(s.name)}</span><span class="sc">유형 ${s.types}</span></a></li>`).join('')}</ol>
      ${olds.length ? `<h3>예전 교과서(2015) 자료 <small>같은 내용을 다룬 예전 단원</small></h3><div class="labs">${olds.map((id) => { const p = placeOf(id), meta = LABS.find((x) => x.id === id); return `<a class="btn" href="${startOf(id)}"><b>2015 교재 · ${esc(p.sem.replace('-', '학년 '))}학기 ${ROMAN[p.no - 1]}. ${esc(p.title)}</b><small>${meta ? esc(meta.title) : `단원평가 원문 ${BANK[id]?.n || 0}문항`}</small></a>`; }).join('')}</div>` : ''}
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
