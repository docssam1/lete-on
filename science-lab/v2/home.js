// 홈 = 로드맵 입구(매거진형). 표지(한 줄 약속 + 이어서 하기) → 지금 열린 실험 수업(3D 실험실 사진 카드)
// → 3~6학년 로드맵(학기마다 정거장 줄) → 한 교재 네 가지 수업. 정거장을 누르면 소단원 시트.
import { SEMS, READY, BOOK_UNITS, BANK } from './units-index.js';
import { SEMS_2022, contentId2022 } from './curriculum-2022.js';
import { placeOf, placeLabel, placeNow, legacyFor } from './curriculum-place.js';
import { countNeeds } from './check.js';

const ROMAN = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const A = '../assets/';

// 열린 실험 수업(실험 교재 한 장 = 수업 하나). 사진 = 그 수업의 3D 실험실(assets/thumbs, 실제 화면 캡처).
const LABS = [
  { id: 'c22-s42-u04', lab: '해안 마을 모형 · 물높이·방파제 비교', skills: ['예상', '모형과 한계', '대응 방법'], sem: '4-2', unit: 'Ⅳ. 기후변화와 우리 생활', title: '바다가 높아지면 어느 집이 먼저 젖을까요?', q: '바다 바로 옆 언덕 위 집과 안쪽 낮은 땅의 집, 어디가 먼저 물에 닿을까?', theme: '#2456c4', imageAlt: '3D 실험실 — 유리 통 속 점토 해안 마을과 집 A~E, 물높이 눈금자' },
  {id:'c22-s42-u03',lab:'공기 무게·압력/온도 부피·기체 조사·실제 제작과 재시험',skills:['비교·조건','설계·제작','시험·수정'],sem:'4-2',unit:'Ⅲ. 여러 가지 기체',title:'공기를 비교하고 내 장치로 설명해요',q:'어떤 조건과 근거로 공기의 성질을 설명할까?',theme:'#2456c4',image:'activities/c22-s42-u03/air-device-plan.svg',imageAlt:'지필드가 작성한 공기 인형 계획도 · 실제 학생 결과가 아님'},
  { id: 'c22-s42-u02', lab: '풀밭 먹이 관계 · 한 가지만 바꾸고 3년 지켜보기', skills: ['예상', '변인 통제', '원인과 결과'], sem: '4-2', unit: 'Ⅱ. 생물과 환경', title: '여우가 사라지면 풀밭은 더 좋아질까?', q: '먹이 관계로 이어진 생물은 서로 어떤 영향을 줄까?', theme: '#3d8a35', imageAlt: '3D 실험실 — 풀이 자란 풀밭에 토끼와 여우가 사는 모습' },
  { id: 'c22-s42-u01', lab: '같은 시각 달 관찰 · 음력 날짜만 바꾸기', skills: ['예상', '관찰', '규칙 찾기'], sem: '4-2', unit: 'Ⅰ. 밤하늘 관찰', title: '며칠 뒤 같은 시각, 달은 어디에 보일까?', q: '같은 시각에 본 달의 모양과 위치는 날마다 어떻게 달라질까?', theme: '#2f4fb0', imageAlt: '3D 실험실 — 해가 진 뒤 남쪽을 바라본 하늘, 서쪽에 뜬 가느다란 초승달' },
  { id: 's41-u04', lab: '부푸는 효모빵 반죽 · 물의 온도만 바꾸기', skills: ['예상', '변인 통제', '측정·결론'], sem: '4-1', unit: 'Ⅳ. 다양한 생물과 우리 생활', title: '뜨거운 물이면 빵이 더 잘 부풀까요?', q: '반죽 속 작은 생물, 효모는 어떤 온도에서 가장 부지런할까?', theme: '#3b8a4f', imageAlt: '3D 실험실 — 효모빵 반죽이 담긴 눈금 컵' },
  { id: 'c22-s32-u04', lab: '반짝이 가루 손 모형 · 손 씻기 규칙 비교·기침 예절', skills: ['예상', '모형으로 설명', '예방 실천'], sem: '3-2', unit: 'Ⅳ. 감염병과 건강한 생활', title: '반짝이 가루가 알려 준 손 씻기', q: '세 번 악수하면 반짝이는 몇 명에게 옮겨 갈까?', theme: '#2456c4', imageAlt: '3D 실험실 — 둥글게 선 여섯 친구 A~F, A의 손에만 반짝이 가루' },
  { id: 'c22-s32-u03', lab: '책상 끝 자 튕기기 · 내민 길이와 세기 바꾸기', skills: ['예상', '변인 통제', '듣고 비교하기'], sem: '3-2', unit: 'Ⅲ. 소리의 성질', title: '길게 내밀면 소리가 커질까, 낮아질까?', q: '자를 길게 내밀고 튕기면 소리는 어떻게 달라질까?', theme: '#5b4cc4', imageAlt: '3D 실험실 — 책으로 눌러 고정한 자가 책상 밖으로 나와 있는 모습' },
  { id: 'c22-s32-u02', lab: '증발 접시 두 개 · 바닷물과 수돗물 같은 양 가열', skills: ['예상', '변인 통제', '관찰·결론'], sem: '3-2', unit: 'Ⅱ. 지구와 바다', title: '투명한 두 물, 정말 같은 물일까요?', q: '바닷물과 수돗물을 증발시키면 무엇이 남을까?', theme: '#1f6fa8', imageAlt: '3D 실험실 — 전열기 위 증발 접시 두 개에 바닷물과 수돗물이 같은 양 담긴 모습' },
  { id: 'c22-s32-u01', lab: '같은 모양 막대 네 개 · 비춰 보기·눌러 보기·구부려 보기·물에 넣기', skills: ['예상', '변인 통제', '성질 비교·설계'], sem: '3-2', unit: 'Ⅰ. 물체와 물질', title: '모양이 같으면 성질도 같을까요?', q: '같은 모양 막대 네 개를 물에 넣으면 어떻게 될까?', theme: '#2456c4', imageAlt: '3D 실험실 — 줄무늬 판 앞 받침 위에 놓인 금속·플라스틱·나무·고무 막대와 물통' },
  { id: 's31-u03', lab: '내 잎 관찰·두 기준 분류·설계·의견 반영', skills: ['잎 관찰', '분류', '설계·소통'], sem: '3-1', unit: 'Ⅲ. 식물의 생활', title: '잎에서 찾는 생활의 아이디어', q: '같은 잎도 기준을 바꾸면 다르게 모일까?', theme: '#2456c4', imageAlt: '잎 사진과 실제 잎 이름표를 쓰는 관찰·분류 자료' },
  { id: 's31-u02', lab: '관찰·분류·조사·설계·의견 반영', skills: ['관찰', '분류', '설계·소통'], sem: '3-1', unit: 'Ⅱ. 동물의 생활', title: '동물에게서 찾는 생활의 아이디어', q: '같은 동물도 기준을 바꾸면 다르게 모일까?', theme: '#2456c4', imageAlt: '동물 관찰 사진과 분류 기록 화면' },
  { id: 's31-u01', lab: '위치를 바꾸어 수평 비교하기', skills: ['예상', '비교', '측정'], sem: '3-1', unit: 'Ⅰ. 힘과 우리 생활', title: '밀고 당기고, 수평으로 비교하는 힘', q: '어디에 놓으면 수평이 될까?', theme: '#2456c4' },
  { id: 's41-u01', lab: '고리 자석 방향 바꿔 탑 쌓기', skills: ['가설 설정', '변인 통제', '측정'], sem: '4-1', unit: 'Ⅰ. 자석의 이용', title: '둥실 고리 자석 탑', q: '왜 어떤 자석은 떠 있을까?', theme: '#2F5DA8' },
  { id: 's41-u02', lab: '물의 양 바꿔 얼리고 녹이기', skills: ['가설 설정', '측정', '자료 해석'], sem: '4-1', unit: 'Ⅱ. 물의 상태 변화', title: '얼었다 녹는 물기둥', q: '얼리면 높이와 무게는 어떻게 될까?', theme: '#2A6FB0' },
  { id: 's41-u03', lab: '기울기와 물의 양 바꿔 보기', skills: ['변인 통제', '관찰', '자료 해석'], sem: '4-1', unit: 'Ⅲ. 땅의 변화', title: '흙 언덕 물길', q: '흐르는 물은 흙을 어디로 옮길까?', theme: '#8A5A2B' },
  { id: 's41-u03b', lab: '불 세기와 식히는 빠르기 바꿔 보기', skills: ['모형 실험', '비교', '결론 도출'], sem: '4-1', unit: 'Ⅲ. 땅의 변화', title: '화산 실험실', q: '화산에서는 무엇이 나올까?', theme: '#B23A2E' },
  { id: 's42-u01', lab: '연못에 식물 심고 부레옥잠 눌러 보기', skills: ['관찰', '분류', '결론 도출'], sem: '4-2', unit: 'Ⅰ. 식물의 생활', title: '둥둥 부레옥잠의 비밀', q: '부레옥잠은 어떻게 물에 뜰까?', theme: '#2B7A62' },
  { id: 's42-u02', lab: '물의 온도와 판의 냉각 바꾸어 비교하기', skills: ['변인 통제', '관찰', '자료 해석'], sem: '4-2', unit: 'Ⅱ. 물의 상태 변화', title: '보이지 않는 물의 여행 · 미니 가습기', q: '차가운 판의 물방울은 어디서 왔을까?', theme: '#287B9A', image: 'photos/s42-u02-cups.webp', imageAlt: '실온 컵과 차가운 컵 비교 · AI 실사형 설명 이미지' },
  { id: 's42-u03', lab: '빛·물체·위치를 바꾸어 그림자 비교하기', skills: ['가설 설정', '변인 통제', '자료 해석'], sem: '4-2', unit: 'Ⅲ. 그림자와 거울', title: '빛이 그리는 그림 · 그림자 놀이 상자', q: '그림자는 왜 커졌다 작아졌다 할까?', theme: '#3D4FA8', image: 'photos/s42-u03-shadow.webp', imageAlt: '손전등과 인형 사이 거리에 따른 그림자 크기 비교 · AI 실사형 설명 이미지' },
  { id: 's42-u04', lab: '미는 힘을 바꾸어 지층의 변화 보기', skills: ['가설 설정', '모형 실험', '결론 도출'], sem: '4-2', unit: 'Ⅳ. 화산과 지진', title: '땅이 흔들리는 까닭 · 지층 모형 지진 실험실', q: '단단한 땅은 왜 흔들릴까?', theme: '#9A4B2E' },
  { id: 's42-u05', lab: '햇빛과 찬 공기를 바꾸어 수조 속 비 관찰하기', skills: ['가설 설정', '모형 실험', '결론 도출'], sem: '4-2', unit: 'Ⅴ. 물의 여행', title: '물 한 방울의 여행 · 수조 속 작은 지구', q: '오늘 내리는 비는 어디에서 왔을까?', theme: '#2B6F9E' },
  { id: 's51-u01', lab: '구멍과 높이를 바꾸어 튀는 방울 세기', skills: ['변인 통제', '측정', '결론 도출'], sem: '5-1', unit: 'Ⅰ. 과학자는 어떻게 탐구할까요', title: '과학자처럼 탐구하기 · 튀는 물방울 실험실', q: '무엇이 튀는 물방울의 수를 바꿀까?', theme: '#4B3FB5' },
  { id: 's51-u02', lab: '띠의 재료와 물의 온도를 바꾸어 열의 이동 보기', skills: ['가설 설정', '관찰', '결론 도출'], sem: '5-1', unit: 'Ⅱ. 온도와 열', title: '열이 지나가는 길 · 시온 스티커 실험실', q: '손난로의 열은 어디로 갔을까?', theme: '#C2581C' },
  { id: 's51-u03', lab: '넣은 물의 양을 바꾸어 식용유 「태양」 띄우기', skills: ['가설 설정', '관찰', '모형으로 설명하기'], sem: '5-1', unit: 'Ⅲ. 태양계와 별', title: '병 속에 뜬 태양 · 태양계와 별', q: '태양과 행성은 어떻게 생겨났을까?', theme: '#3346A0' },
  { id: 's52-u01', lab: '비눗물에 넣는 것을 바꾸어 비눗방울 오래 띄우기', skills: ['문제 인식', '변인 통제', '자료 변환'], sem: '5-2', unit: 'Ⅰ. 재미있는 나의 탐구', title: '비눗방울 탐구 · 나의 탐구', q: '비눗방울을 오래 띄울 수 있을까?', theme: '#6B3FA0' },
  { id: 's51-u05', lab: '물의 온도를 바꾸어 효모빵 반죽 부풀리기', skills: ['가설 설정', '변인 통제', '측정'], sem: '5-1', unit: 'Ⅴ. 다양한 생물과 우리 생활', title: '부푸는 효모빵 · 다양한 생물과 우리 생활', q: '빵은 왜 폭신폭신할까?', theme: '#2F7D4F' },
  { id: 's51-u04', lab: '식히는 온도를 바꾸어 병 속에 눈 내리게 하기', skills: ['가설 설정', '관찰', '자료 해석'], sem: '5-1', unit: 'Ⅳ. 용해와 용액', title: '병 속의 눈 · 용해와 용액', q: '녹아서 보이지 않는 물질은 어디로 갔을까?', theme: '#2B5FA8' },
];

function stateOf(store, id) {
  if (!READY[id]) return { kind: 'locked' };
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
// 이어서 할 곳: 진행 중인 수업 → 아직 안 끝낸 수업 → 없음
function nextLab(store) {
  const now = LABS.filter((l) => is2022(l.id));
  return LABS.find((l) => stateOf(store, l.id).kind === 'doing') || now.find((l) => stateOf(store, l.id).kind === 'open') || null;
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
  const badge = k.kind === 'passed' ? '<span class="h-badge done">끝냄</span>' : k.kind === 'doing' ? `<span class="h-badge doing">${p}% 진행</span>` : '<span class="h-badge">새 수업</span>';
  return `<article class="h-lab${feature ? ' feature' : ''}" style="--t:${l.theme}">
    <a class="h-lab-img" href="${startOf(l.id)}" aria-label="${esc(l.title)} 시작 화면">
      <img src="${A}${l.image || `thumbs/${l.id}.webp`}" alt="${esc(l.imageAlt || `${l.title} 3D 실험실 화면`)}" loading="${feature ? 'eager' : 'lazy'}" width="1200" height="675">
      ${badge}
    </a>
    <div class="h-lab-body">
      <p class="h-kicker"><span class="h-era${is2022(l.id) ? '' : ' old'}">${is2022(l.id) ? '2022 개정' : '2015 교재'}</span>${esc(placeLabel(l.id).replace(/^[^·]+· /, ''))}</p>
      ${is2022(l.id) ? '' : `<p class="h-now">${esc(placeNow(l.id))}</p>`}
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
            : `<button type="button" aria-label="${esc(label)}">${inner}</button>`}${isNext ? '<span class="h-here">지금 여기</span>' : ''}</li>`;
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
  const nx = nextLab(store), go = nx || LABS[0], gok = stateOf(store, go.id);
  const need = countNeeds();
  const passedN = LABS.filter((l) => stateOf(store, l.id).kind === 'passed').length;
  const openN = ALL.filter((u) => READY[u.id]).length;
  const cta = !nx ? '다시 보기' : gok.kind === 'doing' ? '이어서 하기' : '첫 수업 시작하기';
  const feature = go, rest = LABS.filter((l) => l !== feature && is2022(l.id)), old = LABS.filter((l) => l !== feature && !is2022(l.id));
  $app.innerHTML = `<div class="h">
    <header class="h-top"><div class="h-wrap">
      <a class="h-brand" href="#/"><img src="${A}docssam-A1-mouth-closed.webp" alt="" width="28" height="42"><span>docssam <b>과학 탐구 랩</b></span></a>
      <nav class="h-nav" aria-label="바로 가기"><a href="#h-labs">실험 수업</a><a href="#h-map">로드맵</a><a href="#h-old">예전 교과서</a><a href="#h-modes">수업 방식</a><a href="#/bank">문제은행</a><a class="h-intro" href="../intro/">교재 소개</a></nav>
    </div></header>

    <section class="h-hero"><div class="h-wrap h-hero-in">
      <div class="h-hero-copy">
        <p class="h-eyebrow">초등 과학 3~6학년 · 실험과 문제은행</p>
        <h1>교과서 단원마다,<br><em>실험 한 장씩.</em></h1>
        <p class="h-lede">예상하고, 3D 실험실에서 직접 해 보고, 내 말로 정리해요. 이 길을 따라가면 초등 과학이 하나로 이어져요.</p>
        <div class="h-cta">
          <a class="h-btn solid big" href="${startOf(go.id)}">${cta} · ${esc(go.title)}${ICO.arrow}</a>
          <a class="h-btn big ghost" href="#h-map">로드맵 보기</a>
        </div>
        <dl class="h-stats">
          <div><dt>2022 수업</dt><dd>${LABS.filter((l) => is2022(l.id)).length}<small>개</small></dd></div>
          <div><dt>열린 2022 단원</dt><dd>${openN}<small>/${ALL.length}</small></dd></div>
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
        <header class="h-sec-head"><p class="h-num">01</p><div><h2>지금 교과서(2022 개정) 수업</h2><p>지금 학교에서 배우는 단원이에요. 자료와 실험을 보고 예상하고, 교과 개념으로 설명해요.</p></div></header>
        <div class="h-labs">${labCard(store, feature, true)}${rest.map((l) => labCard(store, l, false)).join('')}</div>
      </div></section>

      <section class="h-sec" id="h-popcorn"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">🍿</p><div><h2>팝콘실험실</h2><p>실제 키트 사진을 읽고, 조립하고, 내 생각으로 이어 가는 과학 잡지.</p></div></header>
        <div class="h-labs"><article class="h-lab feature" style="--t:#237e7a">
          <a class="h-lab-img" href="../popcorn/charles-01/current/companion/#home" aria-label="팝콘실험실 샤를 1호 시작하기"><img src="../popcorn/charles-01/current/assets/cover-kit-branded.svg" alt="실제 종이 자석 악어와 물고기·당근 키트" loading="lazy" width="1200" height="675"><span class="h-badge">샤를 1호</span></a>
          <div class="h-lab-body"><p class="h-kicker">자석 악어와 보내는 일주일</p><h3><a href="../popcorn/charles-01/current/companion/#home">먹이를 먹는 자석 악어</a></h3><p class="h-q">악어는 먹이의 그림을 알아볼까요?</p><p>랩코니와 봉투 열기부터 3D 조립까지. 한·영 읽기, 영상, 관찰 기록과 학생 교재를 함께 펼쳐요.</p>
            <div class="h-lab-go"><a class="h-btn solid" href="../popcorn/charles-01/current/companion/#home">${ICO.self}팝콘실험실 시작하기</a></div>
          </div>
        </article></div>
      </div></section>

      <section class="h-sec alt" id="h-map"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">02</p><div><h2>3~6학년 로드맵 · 2022 개정 32단원</h2><p>지금 교과서 차례예요. 파란 정거장은 열려 있고, 끝내면 깃발이 꽂혀요. 단원평가는 <a href="#/bank">문제은행</a>에서 골라요.</p></div></header>
        <div class="h-check"><div><b>선생님 확인</b><p>이 기기에서 스스로 공부한 쓰기 답을 확인해요. 기록은 다른 기기로 전송되지 않아요.</p></div><a class="h-btn" href="#/check">확인할 답 보기${need ? ` <span class="h-check-count">${need}</span>` : ''}${ICO.arrow}</a></div>
        <div class="h-legend" aria-hidden="true"><span><i class="open"></i>열림</span><span><i class="passed"></i>끝냄</span><span><i class="locked"></i>준비 중</span></div>
        <div class="h-map">${roadmap(store, nx)}</div>
      </div></section>

      <section class="h-sec" id="h-old"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">03</p><div><h2>예전 교과서(2015) 자료</h2><p>예전 교과서 단원의 실험 수업과 단원평가예요. 학년·단원 번호가 지금 교과서와 달라요. 단원마다 지금 교과서의 어느 단원과 이어지는지 적어 두었어요.</p></div></header>
        ${old.length ? `<div class="h-labs">${old.map((l) => labCard(store, l, false)).join('')}</div>` : ''}
        <h3 class="h-old-t">2015 교재 단원 차례</h3>${legacyList(store)}
      </div></section>

      <section class="h-sec" id="h-modes"><div class="h-wrap">
        <header class="h-sec-head"><p class="h-num">04</p><div><h2>한 교재, 네 가지 수업</h2><p>같은 실험 한 장을 집에서도, 교실에서도, 종이로도 써요.</p></div></header>
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
  $app.querySelectorAll('.h-stop a[data-pos]').forEach((a) => a.addEventListener('click', (e) => {
    const u = ALL.find((x) => x.position === a.dataset.pos), r = READY[u.id];
    if (!r?.subs) return; e.preventDefault();
    const [g, h] = u.sem.split('-');
    const labs = r.bankOnly ? [] : r.labs || [{ id: u.id, hero: r.hero }], bk = BANK[u.id];
    const extra = Object.keys(READY).filter((id) => READY[id].hidden && placeOf(id)?.position === u.position && !labs.some((l) => l.id === id)).map((id) => ({ id, hero: READY[id].hero }));
    const olds = legacyFor(u.position).filter((id) => READY[id] || BANK[id]);
    $sheet.innerHTML = `<div class="grab" aria-hidden="true"></div><p class="step-label">2022 개정 · ${g}학년 ${h}학기 ${ROMAN[u.no - 1]}</p><h2 id="sheet-t">${esc(u.title)}</h2>
      ${labs.length ? '' : '<p class="lead">이 단원은 아직 실험 수업이 없어요. 소단원 문제와 단원평가로 공부해요.</p>'}<div class="labs">${[...labs, ...extra].map((l) => { const ks = stateOf(store, l.id).kind, meta = LABS.find((x) => x.id === l.id); return `<a class="btn primary" href="${startOf(l.id)}"><b>${esc(meta?.title || l.hero)}</b><small>${l.covers ? `소단원 ${l.covers.map((c) => r.subs.findIndex((x) => x.id === c) + 1).join('·')} · ` : ''}${ks === 'doing' ? '이어서 하기' : ks === 'passed' ? '다시 보기' : '수업 시작'}</small></a>`; }).join('')}</div>
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
