// Optional reading. Lesson progress, circuit state and narration stay with the caller.
let activeCleanup = null;

const external = (url, label, className = '') =>
  `<a class="${className}" href="${url}" target="_blank" rel="noopener noreferrer">${label}<span class="magazine-new-tab">새 창</span></a>`;

const batteryFigure = `<div class="magazine-circuit-pair"><div><img src="./assets/experiment-photos/series-cells.jpg" alt="실제 전지 두 개의 직렬 연결"><h4>전지의 직렬연결</h4><p>서로 다른 극을 이어요.</p></div><div><img src="./assets/experiment-photos/parallel-cells.jpg" alt="실제 전지 두 개의 병렬 연결"><h4>전지의 병렬연결</h4><p>같은 극끼리 이어요.</p></div></div>`;

const cityFigure = `<a class="parallel-photo-link" href="./assets/learning-visuals/parallel-lamps-photo.png" target="_blank" rel="noopener noreferrer" aria-label="전등 병렬연결 이미지 크게 보기 · 새 창"><img class="parallel-lamps-photo" src="./assets/learning-visuals/parallel-lamps-photo.png" width="2172" height="724" alt="전지함에서 나온 빨간 선과 검은 선에 전구 세 개가 각각 연결되어 있어요. 전구마다 왼쪽 소켓 접점에는 빨간 선, 오른쪽 접점에는 검은 선이 이어져요."><span class="parallel-photo-zoom">접점과 전선 크게 보기 ↗</span></a>`;

const palaceFigure = `<img class="magazine-palace-photo" src="./assets/history/geoncheonggung.jpg" alt="오늘의 경복궁 건청궁 곤녕합 전경 · 국가유산청 궁능유적본부 사진">`;

const articles = [
  {
    id: 'battery', category: '실험과 생활', title: '전지 두 개의 다른 쓰임',
    subtitle: '더 밝게, 또는 더 오래',
    paragraphs: [
      '손전등 속 전지는 왜 줄지어 있을까요? 같은 전지의 서로 다른 극을 잇는 직렬연결에서는 전압이 더해져요. 사용 전압이 맞는 전구라면 전지 한 개일 때보다 밝아질 수 있지요.',
      '같은 극끼리 잇는 병렬연결은 달라요. 같은 종류와 상태의 전지를 쓰면 전압은 한 개일 때와 비슷하고, 전구를 더 오래 켜는 데 도움이 돼요. 전지 수만 세지 말고 연결 방법을 살펴봐야 해요.',
      '오늘의 2단 스탠드는 직렬로 이은 전지의 연결점을 이용해 전지 한 개를 쓰는 길과 두 개를 쓰는 길을 골라요. 전지끼우개가 나란히 놓여 있다고 병렬연결인 것은 아니에요. 제품마다 연결은 다르니 전지함의 극 표시와 연결선을 함께 살펴봐요.'
    ],
    figure: batteryFigure,
    caption: '원본 교재 46쪽의 실제 연결 사진. 노란 빛은 원본 시각 효과이며 밝기 측정값이 아니에요.',
    question: '전지의 개수는 같은데 밝기가 달라진다면, 무엇을 먼저 살펴볼까요?',
    hint: '전지의 +극과 −극에서 출발해 전선을 따라가 보세요. 서로 어떤 극이 이어져 있나요?',
    teacher: '전지끼우개의 겉모양과 실제 연결을 구별하도록 선을 따라 짚게 합니다. 병렬에서는 밝기가 두 배가 된다고 일반화하지 않도록 비교 조건을 확인합니다.',
    sources: '교재 연결 · 전지의 연결 방법 / 2단 밝기 스탠드'
  },
  {
    id: 'city', category: '발명과 사람', title: '전구 하나에서 도시의 불빛으로',
    subtitle: '에디슨과 테슬라가 고민한 전기',
    paragraphs: [
      '방 하나의 불을 꺼도 옆방은 밝게 남아 있지요. 에디슨은 오래 쓸 수 있는 전구와 함께, 여러 전등을 각각 켜고 끌 수 있는 병렬회로를 연구했어요. 여기서 병렬로 잇는 것은 전등이에요. 앞에서 살펴본 전지의 병렬연결과 구별해요.',
      '도시에는 전기를 만드는 곳과 멀리 보내는 방법도 필요했어요. 에디슨은 직류 전력 공급을 발전시켰고, 테슬라는 교류 전동기와 교류 전력 기술을 발전시키는 데 기여했어요. 직류는 한 방향으로, 교류는 방향이 주기적으로 바뀌며 흘러요.',
      '직렬·병렬은 부품을 연결하는 방법, 직류·교류는 전류의 방향에 관한 말이에요. 서로 다른 두 가지 기준이지요.'
    ],
    figure: cityFigure,
    caption: '전등의 병렬연결 · 전구마다 두 전선 사이에 각각의 갈래가 있어요. 저전압 교구를 나타낸 AI 제작 설명 이미지예요.',
    question: '도시의 모든 전등이 한 줄로 이어져 있다면 어떤 불편이 생길까요?',
    hint: '한 전등을 빼서 길이 끊겼을 때, 나머지 전등까지 이어지는 길이 남아 있는지 생각해 보세요.',
    teacher: '전지 병렬과 전등 병렬을 칠판에 따로 그려 비교합니다. 직렬=직류, 병렬=교류로 연결하지 않도록 각각 “연결 방법”과 “전류 방향”으로 정리합니다.',
    sources: external('https://edison.rutgers.edu/component/content/article/electric-lamp?Itemid=101&amp;catid=91', '럿거스대학교 에디슨 기록: 전구') + external('https://www.energy.gov/articles/war-currents-ac-vs-dc-power', '미국 에너지부: 직류와 교류')
  },
  {
    id: 'palace', category: '우리 역사 속 과학', title: '1887년, 궁궐에 켜진 전등',
    subtitle: '우리나라 최초의 전등이 켜지던 날',
    paragraphs: [
      '1887년, 경복궁 건청궁에 전등이 켜졌어요. 조선 정부는 에디슨전등회사의 설비를 들여와 전깃불을 밝혔지요. 불꽃을 붙이는 등잔과 달리, 전선을 통해 공급받는 전기로 빛을 내는 등이었어요.',
      '전등만 가져오면 되었을까요? 전기를 만드는 발전기와 전기를 전할 전선, 설비를 다룰 사람도 필요했어요. 작은 전구가 생활을 바꾸려면 여러 기술과 사람의 일이 함께 이어져야 했던 거예요.',
      '우리가 만든 스탠드에서도 전지, 전선, 스위치, 전구가 제 역할을 해요. 전기를 공급하는 장치는 달라도, 전기가 흐를 길을 완성해야 불이 켜진다는 점을 떠올려 보세요.'
    ],
    figure: palaceFigure,
    caption: '오늘의 건청궁 곤녕합 · 1887년 당시 사진은 아니에요. 사진: 국가유산청 궁능유적본부 · 공공누리 제1유형',
    question: '전등이 처음 들어온 날, 사람들은 무엇을 가장 신기해했을까요?',
    hint: '전등이 생긴 뒤 저녁의 생활이 어떻게 달라졌을지 한 가지 장면을 상상해 보세요.',
    teacher: '1887년 건청궁 전등 도입과 이후 도시 전력 보급을 구별합니다. 발전기와 전지를 모두 전기 공급 장치로 비교하되, 같은 작동 원리라고 설명하지 않습니다.',
    sources: external('https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_40&amp;levelId=kc_o403950', '국사편찬위원회 우리역사넷: 건청궁의 전등')
  }
];

const videos = [
  ['https://m.site.naver.com/1e5DZ', '전지 연결 실험', '한 개·직렬·병렬을 비교해요.'],
  ['https://m.site.naver.com/1e5E0', '2단 밝기 스탠드 실험', '조립과 연결을 다시 살펴봐요.'],
  ['https://m.site.naver.com/1e5E2', '전지 연결 방법', '극과 전선의 연결을 따라가요.'],
  ['https://m.site.naver.com/1e5E3', '전지 연결 예', '전지의 생활 속 예를 보고, 추가 자료의 전구 연결과 구별해요.']
];

function articleMarkup(article, teacher) {
  return `<article class="magazine-article" id="magazine-${article.id}" aria-labelledby="magazine-${article.id}-title">
    <header class="magazine-article-head"><p class="magazine-category">${article.category}</p><h3 id="magazine-${article.id}-title" tabindex="-1">${article.title}</h3><p class="magazine-subtitle">${article.subtitle}</p></header>
    <figure class="magazine-figure">${article.figure}<figcaption>${article.caption}</figcaption></figure>
    <div class="magazine-prose">${article.paragraphs.map(p => `<p>${p}</p>`).join('')}</div>
    <div class="magazine-question"><p><span>생각해 볼 질문</span>${article.question}</p><details><summary>생각 펼치기</summary><p>${article.hint}</p></details></div>
    ${teacher ? `<aside class="magazine-teacher-note"><strong>함께 이야기하기</strong><p>${article.teacher}</p></aside>` : ''}
    <footer class="magazine-sources"><span>읽은 내용의 출처</span><div>${article.sources}</div></footer>
  </article>`;
}

/** Open optional reading without changing lesson state; returned cleanup is idempotent. */
export function openMagazine({ teacher = false, articleId, onClose = () => {} } = {}) {
  activeCleanup?.();
  const previousFocus = document.activeElement;
  const bodyOverflow = document.body.style.overflow;
  const rootOverflow = document.documentElement.style.overflow;
  const dialog = document.createElement('dialog');
  dialog.className = `science-magazine${teacher ? ' science-magazine-teacher' : ''}`;
  dialog.setAttribute('aria-labelledby', 'magazine-title');
  dialog.innerHTML = `<header class="magazine-toolbar"><span>팝콘 실험실 <span class="magazine-toolbar-detail">전류 탐험 읽을거리</span></span><button type="button" class="magazine-close" data-magazine-close autofocus>실험으로 돌아가기 <span aria-hidden="true">×</span></button></header>
    <div class="magazine-scroll">
      <header class="magazine-cover"><div><p class="magazine-category">파브르 9호 · 선택해서 읽어요</p><h2 id="magazine-title">작은 전구에서,<br>도시의 불빛까지.</h2><p class="magazine-intro">손으로 만든 회로를 생활과 역사 속에서 다시 만나 보세요.<br class="magazine-wide-break"> 궁금한 이야기부터 읽어도 좋아요.</p></div><div class="magazine-cover-mark"><img src="./assets/experiment-photos/stand-off.jpg" alt="내 손으로 만드는 실제 2단 밝기 스탠드"></div></header>
      <div class="magazine-layout"><nav class="magazine-index" aria-label="읽을거리 목차"><p>이번 읽을거리</p>${articles.map(a => `<button type="button" data-magazine-go="${a.id}"><span>${a.category}</span><strong>${a.title}</strong></button>`).join('')}<button type="button" data-magazine-go="videos"><span>교재와 함께</span><strong>실험 영상 보기</strong></button><div class="magazine-index-note">읽고 나면 돌아가서<br>내 회로를 다시 살펴봐요.</div></nav>
      <main class="magazine-content">${articles.map(a => articleMarkup(a, teacher)).join('')}
        <section class="magazine-videos" id="magazine-videos" aria-labelledby="magazine-videos-title"><p class="magazine-category">교재와 함께</p><h3 id="magazine-videos-title" tabindex="-1">실험 영상 보기</h3><p class="magazine-video-intro">교재 QR에 연결된 영상을 새 창에서 열어요.</p><ul>${videos.map(([url, title, description]) => `<li>${external(url, `<span class="magazine-play" aria-hidden="true">▶</span><span><strong>${title}</strong><small>${description}</small></span>`, 'magazine-video-link')}</li>`).join('')}</ul>
        <aside class="magazine-history-video"><h4>${teacher?'교사용 역사 영상':'어른과 함께 보는 역사 영상'}</h4><p>${teacher?'수업 전 내용을 살펴보고 필요한 부분을 골라 주세요.':'위의 한국어 이야기를 읽고, 궁금한 장면을 어른과 함께 찾아봐요.'}</p>${external('https://www.energy.gov/articles/video-who-was-better-inventor-tesla-or-edison', '에디슨과 테슬라 · 미국 에너지부')}<small>영어 영상 · 한국어 자막 제공 여부는 확인되지 않았어요.</small>${external('https://www.youtube.com/watch?v=mmD34B3cr1I', '건청궁 점등 · YTN 한국어 보도')}<small>한국어 보도 · 2022년 재현 점등 행사예요. 1887년 당시 영상은 아니에요.</small></aside>
        </section><footer class="magazine-ending"><p>이제 내 스탠드에서<br><strong>전기가 흐르는 길을 찾아볼까요?</strong></p><button type="button" data-magazine-close>실험으로 돌아가기</button></footer>
      </main></div>
    </div>`;

  let closed = false;
  const cleanup = () => {
    if (closed) return;
    closed = true;
    dialog.removeEventListener('cancel', handleCancel);
    dialog.removeEventListener('close', cleanup);
    dialog.removeEventListener('click', handleClick);
    dialog.removeEventListener('keydown', handleKey);
    if (dialog.open) dialog.close();
    dialog.remove();
    document.body.style.overflow = bodyOverflow;
    document.documentElement.style.overflow = rootOverflow;
    if (activeCleanup === cleanup) activeCleanup = null;
    if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
    onClose();
  };
  const handleCancel = event => {
    event.preventDefault();
    cleanup();
  };
  const handleClick = event => {
    if (event.target.closest('[data-magazine-close]')) {
      cleanup();
      return;
    }
    const target = event.target.closest('[data-magazine-go]');
    if (!target) return;
    const section = dialog.querySelector(`#magazine-${target.dataset.magazineGo}`);
    section?.scrollIntoView({ block: 'start', behavior: 'instant' });
    section?.querySelector('h3')?.focus({ preventScroll: true });
  };
  // Keep keyboard reading within the open issue, including browsers that move
  // focus to their chrome at the native dialog's first/last tab stop.
  const handleKey = event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button:not(:disabled),a[href],summary')]
      .filter(item => item.getClientRects().length);
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  };
  dialog.addEventListener('cancel', handleCancel);
  dialog.addEventListener('close', cleanup);
  dialog.addEventListener('click', handleClick);
  dialog.addEventListener('keydown', handleKey);
  document.documentElement.append(dialog);
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  activeCleanup = cleanup;
  try {
    dialog.showModal();
    if (articles.some(article => article.id === articleId)) {
      const section = dialog.querySelector(`#magazine-${articleId}`);
      section?.scrollIntoView({ block: 'start', behavior: 'instant' });
      section?.querySelector('h3')?.focus({ preventScroll: true });
    }
  } catch (error) {
    cleanup();
    throw error;
  }
  return cleanup;
}
