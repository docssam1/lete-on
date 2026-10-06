// Optional reading. Lesson progress, circuit state and narration stay with the caller.
let activeCleanup = null;

const external = (url, label, className = '') =>
  `<a class="${className}" href="${url}" target="_blank" rel="noopener noreferrer">${label}<span class="magazine-new-tab">새 창</span></a>`;

const batteryFigure = `
  <div class="magazine-circuit-pair"><svg viewBox="0 0 330 250" role="img" aria-label="전지 두 개를 직렬로 연결한 회로: 전지의 서로 다른 극을 이어 전압이 더해져요">
    <g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">
      <path d="M38 83H88 M150 83H181 M243 83H287V189H186 M142 189H38V83"/>
      <rect x="88" y="66" width="62" height="34" rx="5" fill="#f6dfab"/>
      <rect x="181" y="66" width="62" height="34" rx="5" fill="#f6dfab"/>
      <circle cx="164" cy="189" r="22" fill="#ffe6a7"/>
      <path d="m149 174 30 30m0-30-30 30"/>
    </g>
    <g fill="currentColor" font-size="16" font-weight="700" text-anchor="middle">
      <text x="164" y="28">전지의 직렬연결</text>
      <text x="101" y="89">+</text><text x="138" y="89">−</text>
      <text x="194" y="89">+</text><text x="231" y="89">−</text>
      <text x="164" y="240">전압이 더해져요</text>
    </g>
  </svg><svg viewBox="350 0 330 250" role="img" aria-label="전지 두 개를 병렬로 연결한 회로: 같은 극끼리 이어 전압은 전지 한 개일 때와 비슷해요">
    <g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">
      <path d="M389 73H478 M540 73H642V189H540 M496 189H389V73 M389 128H478 M540 128H642"/>
      <rect x="478" y="56" width="62" height="34" rx="5" fill="#f6dfab"/>
      <rect x="478" y="111" width="62" height="34" rx="5" fill="#f6dfab"/>
      <circle cx="518" cy="189" r="22" fill="#f4efd8"/>
      <path d="m503 174 30 30m0-30-30 30"/>
    </g>
    <g fill="currentColor" font-size="16" font-weight="700" text-anchor="middle">
      <text x="518" y="28">전지의 병렬연결</text>
      <text x="491" y="79">+</text><text x="528" y="79">−</text>
      <text x="491" y="134">+</text><text x="528" y="134">−</text>
      <text x="518" y="240">전압은 한 개일 때와 비슷해요</text>
    </g>
  </svg></div>`;

const cityFigure = `
  <svg viewBox="0 0 680 230" role="img" aria-label="전등 세 개가 각각 다른 갈래에 있는 전등의 병렬연결 개념도">
    <g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">
      <path d="M80 75V40H619 M80 150V190H619 M260 40V92 M260 138V190 M440 40V92 M440 138V190 M619 40V92 M619 138V190"/>
      <rect x="38" y="75" width="84" height="75" rx="8" fill="#e2eddf"/>
      <circle cx="260" cy="115" r="23" fill="#ffe6a7"/><circle cx="440" cy="115" r="23" fill="#ffe6a7"/><circle cx="619" cy="115" r="23" fill="#ffe6a7"/>
      <path d="M244 99l32 32m0-32-32 32 M424 99l32 32m0-32-32 32 M603 99l32 32m0-32-32 32"/>
    </g>
    <g fill="currentColor" font-size="24" font-weight="700" text-anchor="middle">
      <text x="80" y="118">전원</text><text x="260" y="222">전등 1</text><text x="440" y="222">전등 2</text><text x="619" y="222">전등 3</text>
    </g>
  </svg>`;

const palaceFigure = `
  <svg viewBox="0 0 680 175" role="img" aria-label="발전기에서 만들어진 전기가 전선을 거쳐 전등을 밝히는 흐름">
    <g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">
      <rect x="24" y="29" width="138" height="104" rx="10" fill="#e2eddf"/>
      <circle cx="93" cy="81" r="29"/><circle cx="93" cy="81" r="7"/><path d="M93 52V74 M68 95l19-10 M118 95l-19-10 M163 81H504 M491 70l13 11-13 11"/>
      <path d="M555 103c-10-8-20-18-20-33a38 38 0 0 1 76 0c0 15-10 25-20 33v16h-36z" fill="#ffe6a7"/>
      <path d="M555 119h36m-32 10h28m-24 10h20 M561 77l12 16 12-16m-12 16v25"/>
    </g>
    <g fill="currentColor" font-size="24" font-weight="700" text-anchor="middle">
      <text x="93" y="162">발전기</text><text x="332" y="64">전선</text><text x="573" y="162">전등</text>
    </g>
  </svg>`;

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
    caption: '같은 종류와 상태의 전지, 같은 전구를 비교한 개념도예요.',
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
    caption: '전등의 병렬연결 · 각 전등에 전류가 흐르는 갈래가 있어요.',
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
    caption: '발전기부터 전등까지의 역할을 나타낸 개념도예요.',
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
      <header class="magazine-cover"><div><p class="magazine-category">파브르 9호 · 선택해서 읽어요</p><h2 id="magazine-title">작은 전구에서,<br>도시의 불빛까지.</h2><p class="magazine-intro">손으로 만든 회로를 생활과 역사 속에서 다시 만나 보세요.<br class="magazine-wide-break"> 궁금한 이야기부터 읽어도 좋아요.</p></div><div class="magazine-cover-mark" aria-hidden="true"><svg viewBox="0 0 170 220"><path d="M56 133c-21-15-33-29-33-55a62 62 0 0 1 124 0c0 26-12 40-33 55v31H56z" fill="#efd89e" stroke="currentColor" stroke-width="4"/><path d="M56 165h58m-53 13h48m-43 13h38m-32 13h26 M66 89l19 26 19-26m-19 26v49" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div></header>
      <div class="magazine-layout"><nav class="magazine-index" aria-label="읽을거리 목차"><p>이번 읽을거리</p>${articles.map(a => `<button type="button" data-magazine-go="${a.id}"><span>${a.category}</span><strong>${a.title}</strong></button>`).join('')}<button type="button" data-magazine-go="videos"><span>교재와 함께</span><strong>실험 영상 보기</strong></button><div class="magazine-index-note">읽고 나면 돌아가서<br>내 회로를 다시 살펴봐요.</div></nav>
      <main class="magazine-content">${articles.map(a => articleMarkup(a, teacher)).join('')}
        <section class="magazine-videos" id="magazine-videos" aria-labelledby="magazine-videos-title"><p class="magazine-category">교재와 함께</p><h3 id="magazine-videos-title" tabindex="-1">실험 영상 보기</h3><p class="magazine-video-intro">교재 QR에 연결된 영상을 새 창에서 열어요.</p><ul>${videos.map(([url, title, description]) => `<li>${external(url, `<span class="magazine-play" aria-hidden="true">▶</span><span><strong>${title}</strong><small>${description}</small></span>`, 'magazine-video-link')}</li>`).join('')}</ul>
        <aside class="magazine-history-video"><h4>${teacher?'교사용 역사 영상':'어른과 함께 보는 역사 영상'}</h4><p>${teacher?'수업 전 내용을 살펴보고 필요한 부분을 골라 주세요.':'위의 한국어 이야기를 읽고, 궁금한 장면을 어른과 함께 찾아봐요.'}</p>${external('https://www.energy.gov/articles/video-who-was-better-inventor-tesla-or-edison', '에디슨과 테슬라 · 미국 에너지부')}<small>영어 영상 · 한국어 자막 제공 여부는 확인되지 않았어요.</small>${external('https://royal.khs.go.kr/ROYAL/contents/R303000000.do?schGroupCode=gbg&amp;schM=view&amp;id=20240108151343717711', '건청궁 전기 · 수어 해설')}<small>국가유산청 궁능유적본부 안내 · 수어 해설 영상 · 한국어 음성·자막 제공 여부는 확인되지 않았어요.</small></aside>
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
