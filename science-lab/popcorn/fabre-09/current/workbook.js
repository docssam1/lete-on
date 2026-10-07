import { renderStudentPages, pageNames } from './workbook-pages.js?v=6';

import { experimentPhotos } from './workbook-photos.js?v=2';

let activeCleanup = null;
let activePrintCleanup = null;
let teacherModule;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const snapshot = record => {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return {};
  try { return structuredClone(record); } catch { return {}; }
};

function preparePrint(markup, kind) {
  activePrintCleanup?.();
  const printRoot = document.createElement('div');
  printRoot.className = 'workbook-print-root';
  printRoot.dataset.workbookPrintKind = kind;
  printRoot.innerHTML = markup;
  const hadClass = document.body.classList.contains('workbook-printing');
  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    printRoot.remove();
    if (!hadClass) document.body.classList.remove('workbook-printing');
    if (activePrintCleanup === restore) activePrintCleanup = null;
  };
  document.body.append(printRoot);
  document.body.classList.add('workbook-printing');
  activePrintCleanup = restore;
  return restore;
}

function attachViewer(host, {
  teacher = false, record = {}, initialPage = 1, standalone = false,
  close = () => {}, onNavigate = () => {}, onRead = () => {}
} = {}) {
  // The teacher route discards the supplied object before a renderer can read it.
  const learner = teacher ? {} : snapshot(record);
  let mode = teacher ? 'teacher' : standalone ? 'blank' : 'record';
  let currentPage = String(teacher ? 'T1' : Math.max(1, Number(initialPage) || 1));
  let markup = '', renderVersion = 0, disposed = false, restorePrint, scrollFrame, closePhoto;
  let bookView = 'page';
  let bookAudio, audioCoach, audioButton, audioFrame, mediaVersion = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function stopMedia() {
    mediaVersion++;
    bookAudio?.pause();
    cancelAnimationFrame(audioFrame);
    audioCoach?.classList.remove('wb-speaking');
    audioCoach?.removeAttribute('data-audio-pose');
    if (audioButton) audioButton.textContent = '실험 안내 듣기';
    host.querySelectorAll('.wb-video-player iframe').forEach(frame => frame.remove());
    host.querySelectorAll('[data-book-video]').forEach(button => { button.textContent = '책 안에서 영상 보기'; button.setAttribute('aria-expanded','false'); });
  }
  const pauseHidden = () => { if (document.hidden) stopMedia(); };
  host.dataset.bookView = bookView;
  const furthest = Math.max(0, Math.min(19, Number(learner.furthest) || 0));
  host.innerHTML = `<header class="wb-toolbar"><div class="wb-toolbar-title"><strong id="workbook-title">전류 탐험 교재</strong><small>생각하고, 만들고, 읽고, 설명해요</small>${standalone ? '<a href="./index.html">실험 화면으로</a>' : '<button type="button" data-workbook-close autofocus>실험으로 돌아가기 ×</button>'}</div><div class="wb-toolbar-actions"><div class="wb-mode-controls" aria-label="교재 종류">${teacher ? '<button type="button" data-workbook-mode="blank">학생용 빈 교재</button><button type="button" data-workbook-mode="teacher">교사용 지도자료</button>' : `<button type="button" data-workbook-mode="blank">빈 교재</button>${standalone ? '' : '<button type="button" data-workbook-mode="record">내 기록</button>'}`}</div><button type="button" data-workbook-print>교재 인쇄</button><a href="docs/student-workbook.pdf" download>학생용 PDF</a>${teacher ? '<a href="docs/teacher-guide.pdf" download>교사용 PDF</a>' : ''}</div></header><div class="wb-subtoolbar"><nav class="wb-page-tabs" aria-label="교재 쪽 선택"></nav><div class="wb-view-controls"><button type="button" data-workbook-prev aria-label="앞 쪽">← 앞 쪽</button><button type="button" data-workbook-next aria-label="다음 쪽">다음 쪽 →</button><button type="button" data-workbook-view aria-pressed="false">모아 보기</button></div><span class="wb-view-note" aria-live="polite"></span><p class="wb-locked-note" hidden>아직 배우지 않은 화면은 순서대로 공부하면 열려요.</p></div><div class="workbook-scroll"><div class="workbook-view-pages"><p class="wb-loading" role="status">교재를 펼치는 중이에요.</p></div></div>`;
  const pagesHost = host.querySelector('.workbook-view-pages');
  const scrollHost = host.querySelector('.workbook-scroll');
  const tabs = host.querySelector('.wb-page-tabs');
  const printButton = host.querySelector('[data-workbook-print]');
  const printMedia = matchMedia('print');

  function setCurrent(id) {
    if (String(id) !== currentPage) stopMedia();
    currentPage = String(id);
    const allPages = [...pagesHost.querySelectorAll('.workbook-page')];
    allPages.forEach(page => page.toggleAttribute('data-current', page.dataset.page === currentPage));
    const index = allPages.findIndex(page => page.dataset.page === currentPage);
    host.querySelector('[data-workbook-prev]').disabled = index <= 0;
    host.querySelector('[data-workbook-next]').disabled = index < 0 || index >= allPages.length - 1;
    tabs.querySelectorAll('[data-workbook-page]').forEach(button => {
      if (button.dataset.workbookPage === currentPage) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const selected = tabs.querySelector('[aria-current="page"]');
    if (selected) {
      const rail = tabs.getBoundingClientRect();
      const item = selected.getBoundingClientRect();
      if (item.left < rail.left) tabs.scrollLeft -= rail.left - item.left;
      else if (item.right > rail.right) tabs.scrollLeft += item.right - rail.right;
    }
  }
  function goToPage(id, focus = false) {
    const pages = [...pagesHost.querySelectorAll('.workbook-page')];
    const page = pages.find(item => item.dataset.page === String(id)) || pages[0];
    if (!page) return;
    setCurrent(page.dataset.page);
    page.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (focus) { const heading = page.querySelector('h2'); heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }
  async function render() {
    stopMedia();
    const version = ++renderVersion;
    printButton.disabled = true;
    host.dataset.workbookReady = 'false';
    markup = '';
    pagesHost.innerHTML = '<p class="wb-loading" role="status">교재를 펼치는 중이에요.</p>';
    host.querySelectorAll('[data-workbook-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.workbookMode === mode)));
    try {
      if (mode === 'teacher') {
        teacherModule ||= import('./workbook-teacher.js?v=6');
        const module = await teacherModule;
        if (disposed || version !== renderVersion) return;
        markup = module.renderTeacherPages();
      } else markup = renderStudentPages(teacher ? {} : learner, { blank: mode === 'blank' });
      if (disposed || version !== renderVersion) return;
      pagesHost.innerHTML = markup;
      const voices = {1:'welcome',2:'predict',3:'compare',5:'paper',6:'wire1',7:'test',8:'concept',9:'quiz',12:'report',13:'finish'};
      pagesHost.querySelectorAll('.wb-coach').forEach(coach => {
        const voice = voices[coach.closest('[data-page]').dataset.page];
        if (!voice) return;
        const controls = document.createElement('div');
        controls.className = 'wb-coach-audio';
        controls.innerHTML = `<button type="button" data-book-voice="fabre09-${voice}">실험 안내 듣기</button><p class="wb-voice-caption" aria-live="polite"></p>`;
        coach.querySelector('.wb-coach-bubble').append(controls);
      });
      let hasLocked = false;
      pagesHost.querySelectorAll('[data-workbook-step]').forEach(button => {
        const locked = standalone || !teacher && Number(button.dataset.workbookStep) > furthest;
        button.disabled = locked;
        if (locked) { button.title = standalone ? '실험 화면에서 이용해요.' : '순서대로 공부하면 열려요.'; hasLocked = !standalone; }
      });
      const reference = pagesHost.querySelector('[data-workbook-reference]');
      if (reference && !teacher && !['one','series','parallel','series-remove','parallel-remove'].every(id => learner.observations?.includes(id))) {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-reference-locked', '');
        reference.replaceWith(wrapper);
        wrapper.innerHTML = '<div class="wb-reference-lock"><strong>먼저 내 눈으로 관찰해요.</strong><p>다섯 비교 관찰을 마치면 원본 실사 사진을 펼칠 수 있어요. 종이 교재는 3–4쪽 관찰을 마친 뒤 8쪽을 살펴요.</p></div>';
        wrapper.append(reference);
      }
      host.querySelector('.wb-locked-note').hidden = !hasLocked;
      const pages = [...pagesHost.querySelectorAll('.workbook-page')];
      tabs.innerHTML = pages.map(page => { const id = page.dataset.page, title = Number(id) <= pageNames.length ? pageNames[Number(id) - 1] : id.startsWith('T') ? '교사용 지도자료' : '내 기록 이어쓰기'; return `<button type="button" data-workbook-page="${escape(id)}" aria-label="${escape(id)}쪽 · ${escape(title)}">${escape(id)}</button>`; }).join('');
      host.querySelector('.wb-view-note').textContent = mode === 'teacher' ? `교사용 별도 ${pages.length}쪽` : mode === 'blank' ? `학생용 빈 교재 ${pages.length}쪽` : `직접 남긴 기록 · ${pages.length}쪽`;
      if (!pages.some(page => page.dataset.page === currentPage)) currentPage = pages[0]?.dataset.page || '1';
      goToPage(currentPage);
      requestAnimationFrame(() => { if (!disposed && version === renderVersion) goToPage(currentPage); });
      await Promise.all([...pagesHost.querySelectorAll('img')].map(image => image.decode()));
      const sprite = new Image(); sprite.src = './assets/popcorn-poses.webp'; await sprite.decode();
      await document.fonts.ready;
      if (disposed || version !== renderVersion) return;
      printButton.disabled = false;
      host.dataset.workbookReady = 'true';
    } catch (error) {
      if (disposed || version !== renderVersion) return;
      pagesHost.innerHTML = '<p class="wb-error" role="alert">교재 또는 사진을 불러오지 못했어요. 다시 불러와 주세요.</p><button type="button" data-workbook-retry>다시 불러오기</button>';
      console.error('Workbook rendering failed', error);
    }
  }
  function beforePrint() {
    if (disposed) return;
    stopMedia();
    restorePrint?.();
    if (host.dataset.workbookReady !== 'true' || !markup) {
      restorePrint = preparePrint('<section class="workbook-page"><h2>교재가 준비된 뒤 인쇄해 주세요</h2><p>인쇄를 취소하고, 선택한 교재가 화면에 나타난 뒤 다시 눌러 주세요.</p></section>', 'loading');
      return;
    }
    restorePrint = preparePrint(markup, mode);
    // Blank handouts stay blank; own-record printing may include only this reading's choices.
    if (mode === 'record') {
      const root = document.querySelector('.workbook-print-root');
      pagesHost.querySelectorAll('[data-book-evaluation]').forEach(select => {
        const target = root.querySelector(`[data-book-evaluation="${select.dataset.bookEvaluation}"]`);
        if (target && select.value) target.replaceWith(Object.assign(document.createElement('span'), {textContent:select.options[select.selectedIndex].text}));
      });
      const checked = pagesHost.querySelector('input[name="wb-source-choice"]:checked');
      if (checked) root.querySelector(`input[name="wb-source-choice"][value="${checked.value}"]`)?.setAttribute('checked','');
    }
  }
  function afterPrint() { restorePrint?.(); restorePrint = null; }
  function onPrintMedia(event) { if (!event.matches) afterPrint(); }
  async function handleClick(event) {
    const button = event.target.closest('button');
    if (!button || button.disabled || !host.contains(button)) return;
    if (button.dataset.bookCheck === 'source') {
      const question = button.closest('.wb-source-question');
      const choice = question.querySelector('input[name="wb-source-choice"]:checked');
      const feedback = question.querySelector('[data-book-feedback]');
      feedback.hidden = false;
      if (!choice) { feedback.textContent = '먼저 내 생각으로 하나를 골라 보세요.'; return; }
      button.disabled = true;
      try { const {sourceFeedback} = await import('./workbook-feedback.js?v=1'); if (!disposed && question.isConnected) feedback.textContent = sourceFeedback(choice.value); }
      catch { if (!disposed) feedback.textContent = '해설을 불러오지 못했어요. 다시 눌러 주세요.'; }
      finally { if (button.isConnected) button.disabled = false; }
      return;
    }
    if (button.dataset.bookVideo) {
      const container = button.closest('.wb-inline-video');
      const player = container.querySelector('.wb-video-player');
      const wasOpen = !!player.querySelector('iframe');
      stopMedia();
      if (wasOpen || !['Js6CZPD5XfE','mmD34B3cr1I'].includes(button.dataset.bookVideo)) return;
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.bookVideo}?rel=0`;
      frame.title = container.querySelector('h3,strong')?.textContent || '과학 읽기 영상';
      frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      player.append(frame);
      button.textContent = '영상 닫기'; button.setAttribute('aria-expanded','true');
      return;
    }
    if (button.dataset.bookVoice) {
      const coach = button.closest('.wb-coach');
      const caption = coach.querySelector('.wb-voice-caption');
      const wasPlaying = audioButton === button && bookAudio && !bookAudio.paused;
      stopMedia();
      if (wasPlaying) return;
      const version = mediaVersion;
      try {
        const response = await fetch('./assets/audio/voices.json');
        if (!response.ok) throw Error('voice');
        const manifest = await response.json(), line = manifest.lines[button.dataset.bookVoice];
        if (disposed || version !== mediaVersion || !line) return;
        caption.textContent = line.text;
        const audio = new Audio(`./assets/audio/${line.file}`);
        bookAudio = audio;
        audioCoach = coach; audioButton = button;
        const animate = () => {
          if (disposed || version !== mediaVersion || audio.paused || audio.ended) return;
          coach.dataset.audioPose = reducedMotion.matches || Math.floor(audio.currentTime * 8) % 4 ? 'talk' : 'idle';
          audioFrame = requestAnimationFrame(animate);
        };
        audio.addEventListener('ended',() => { if (version === mediaVersion) stopMedia(); },{once:true});
        audio.addEventListener('error',() => { if (version !== mediaVersion) return; stopMedia(); caption.textContent = '소리를 불러오지 못했어요. 글로 안내를 읽어 주세요.'; },{once:true});
        await audio.play();
        if (disposed || version !== mediaVersion) { audio.pause(); return; }
        coach.classList.add('wb-speaking'); button.textContent = '듣기 멈추기'; animate();
      } catch { if (!disposed && version === mediaVersion) caption.textContent = '소리를 재생하지 못했어요. 글로 안내를 읽어 주세요.'; }
      return;
    }
    if (button.hasAttribute('data-workbook-close')) { close(); return; }
    if (button.hasAttribute('data-workbook-retry')) { await render(); return; }
    if (button.hasAttribute('data-workbook-view')) {
      bookView = bookView === 'page' ? 'all' : 'page';
      host.dataset.bookView = bookView;
      button.textContent = bookView === 'page' ? '모아 보기' : '한 쪽씩 보기';
      button.setAttribute('aria-pressed', String(bookView === 'all'));
      goToPage(currentPage);
      return;
    }
    if (button.hasAttribute('data-workbook-prev') || button.hasAttribute('data-workbook-next')) {
      const pages = [...pagesHost.querySelectorAll('.workbook-page')];
      const index = pages.findIndex(page => page.dataset.page === currentPage);
      const target = pages[index + (button.hasAttribute('data-workbook-next') ? 1 : -1)];
      if (target) goToPage(target.dataset.page, true);
      return;
    }
    if (button.dataset.workbookPhoto) {
      closePhoto?.();
      const item = experimentPhotos[button.dataset.workbookPhoto];
      if (!item) return;
      const zoom = document.createElement('dialog');
      zoom.className = 'wb-photo-dialog';
      zoom.setAttribute('aria-label', item.alt + ' 확대 사진');
      zoom.innerHTML = `<header><span>${item.alt}</span><button type="button" autofocus>사진 닫기 ×</button></header><img src="${item.src}" alt="${item.alt}">`;
      let closed = false;
      closePhoto = () => { if (closed) return; closed = true; zoom.close(); zoom.remove(); if (button.isConnected) button.focus({preventScroll:true}); closePhoto = null; };
      zoom.querySelector('button').addEventListener('click', () => closePhoto?.());
      zoom.addEventListener('cancel', event => { event.preventDefault(); closePhoto?.(); });
      zoom.addEventListener('keydown', event => { if (event.key === 'Tab') { event.preventDefault(); zoom.querySelector('button').focus(); } });
      document.documentElement.append(zoom);
      zoom.showModal();
      return;
    }
    if (button.dataset.workbookMode) {
      const requested = button.dataset.workbookMode;
      if (!['blank', teacher ? 'teacher' : 'record'].includes(requested)) return;
      mode = requested;
      await render();
      return;
    }
    if (button.dataset.workbookPage) { goToPage(button.dataset.workbookPage, true); return; }
    if (button.hasAttribute('data-workbook-print')) {
      await document.fonts.ready;
      if (disposed || !markup) return;
      beforePrint();
      try { window.print(); } finally { afterPrint(); }
      return;
    }
    if (button.hasAttribute('data-workbook-step')) {
      const index = Number(button.dataset.workbookStep);
      if (standalone || !Number.isInteger(index) || index < 0 || index > 19 || !teacher && index > furthest) return;
      close();
      onNavigate(index);
      return;
    }
    const article = button.dataset.workbookRead;
    if (['battery', 'city', 'palace'].includes(article)) {
      if (standalone) { const { openMagazine } = await import('./magazine.js?v=4'); if (!disposed) openMagazine({teacher, articleId:article}); }
      else { close(); onRead(article); }
    }
  }
  function handleScroll() {
    if (bookView === 'page' || scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      const top = standalone ? 120 : scrollHost.getBoundingClientRect().top;
      const pages = [...pagesHost.querySelectorAll('.workbook-page')];
      const nearest = pages.find(page => page.getBoundingClientRect().bottom > top + 100);
      if (nearest) setCurrent(nearest.dataset.page);
    });
  }
  host.addEventListener('click', handleClick);
  document.addEventListener('visibilitychange', pauseHidden);
  scrollHost.addEventListener('scroll', handleScroll, { passive: true });
  if (standalone) window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);
  printMedia.addEventListener('change', onPrintMedia);
  void render();
  return () => {
    disposed = true;
    stopMedia();
    document.removeEventListener('visibilitychange', pauseHidden);
    closePhoto?.();
    renderVersion++;
    cancelAnimationFrame(scrollFrame);
    afterPrint();
    host.removeEventListener('click', handleClick);
    scrollHost.removeEventListener('scroll', handleScroll);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('beforeprint', beforePrint);
    window.removeEventListener('afterprint', afterPrint);
    printMedia.removeEventListener('change', onPrintMedia);
  };
}

/** Read-only viewer. The caller owns narration, microphone and lesson navigation. */
export function openWorkbook({ teacher = false, record = {}, initialPage = 1, onClose = () => {}, onNavigate = () => {}, onRead = () => {} } = {}) {
  activeCleanup?.();
  const previousFocus = document.activeElement;
  const overflow = { body: document.body.style.overflow, root: document.documentElement.style.overflow };
  const dialog = document.createElement('dialog');
  dialog.className = 'science-workbook';
  dialog.setAttribute('aria-labelledby', 'workbook-title');
  let closed = false, disposeViewer;
  const cleanup = () => {
    if (closed) return;
    closed = true;
    disposeViewer?.();
    dialog.removeEventListener('cancel', cancel);
    dialog.removeEventListener('close', cleanup);
    dialog.removeEventListener('keydown', keyboard);
    if (dialog.open) dialog.close();
    dialog.remove();
    document.body.style.overflow = overflow.body;
    document.documentElement.style.overflow = overflow.root;
    if (activeCleanup === cleanup) activeCleanup = null;
    if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
    onClose();
  };
  const cancel = event => { event.preventDefault(); cleanup(); };
  const keyboard = event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cleanup(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select,summary,[tabindex="0"]')].filter(element => element.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  dialog.addEventListener('cancel', cancel);
  dialog.addEventListener('close', cleanup);
  dialog.addEventListener('keydown', keyboard);
  document.documentElement.append(dialog);
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  activeCleanup = cleanup;
  disposeViewer = attachViewer(dialog, { teacher, record, initialPage, close: cleanup, onNavigate, onRead });
  try { dialog.showModal(); } catch (error) { cleanup(); throw error; }
  return cleanup;
}

/** Standalone preview deliberately has no storage access or learner-data loading. */
export function mountWorkbookPreview(host, { teacher = false } = {}) {
  return attachViewer(host, { teacher, record: {}, standalone: true });
}
