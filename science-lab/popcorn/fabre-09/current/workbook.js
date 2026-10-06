import { renderStudentPages } from './workbook-pages.js?v=1';

let activeCleanup = null;
let activePrintCleanup = null;
let teacherModule;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pageNames = ['예상과 안전', '연결과 밝기', '전지 하나 빼기', '부품과 조립', '다섯 선 연결', '스위치 관찰', '나의 설명', '생활과 역사'];
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
  let markup = '', renderVersion = 0, disposed = false, restorePrint, scrollFrame;
  const furthest = Math.max(0, Math.min(19, Number(learner.furthest) || 0));
  host.innerHTML = `<header class="wb-toolbar"><div class="wb-toolbar-title"><strong id="workbook-title">전류 탐험 교재</strong><small>읽고, 그리고, 내 말로 설명해요</small>${standalone ? '<a href="./index.html">실험 화면으로</a>' : '<button type="button" data-workbook-close autofocus>실험으로 돌아가기 ×</button>'}</div><div class="wb-toolbar-actions"><div class="wb-mode-controls" aria-label="교재 종류">${teacher ? '<button type="button" data-workbook-mode="blank">학생용 빈 교재</button><button type="button" data-workbook-mode="teacher">교사용 지도자료</button>' : `<button type="button" data-workbook-mode="blank">빈 교재</button>${standalone ? '' : '<button type="button" data-workbook-mode="record">내 기록</button>'}`}</div><button type="button" data-workbook-print>교재 인쇄</button><a href="docs/student-workbook.pdf" download>학생용 PDF</a>${teacher ? '<a href="docs/teacher-guide.pdf" download>교사용 PDF</a>' : ''}</div></header><div class="wb-subtoolbar"><nav class="wb-page-tabs" aria-label="교재 쪽 선택"></nav><span class="wb-view-note" aria-live="polite"></span><p class="wb-locked-note" hidden>아직 배우지 않은 화면은 순서대로 공부하면 열려요.</p></div><div class="workbook-scroll"><div class="workbook-view-pages"><p class="wb-loading" role="status">교재를 펼치는 중이에요.</p></div></div>`;
  const pagesHost = host.querySelector('.workbook-view-pages');
  const scrollHost = host.querySelector('.workbook-scroll');
  const tabs = host.querySelector('.wb-page-tabs');
  const printButton = host.querySelector('[data-workbook-print]');
  const printMedia = matchMedia('print');

  function setCurrent(id) {
    currentPage = String(id);
    tabs.querySelectorAll('[data-workbook-page]').forEach(button => {
      if (button.dataset.workbookPage === currentPage) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
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
    const version = ++renderVersion;
    printButton.disabled = true;
    host.dataset.workbookReady = 'false';
    markup = '';
    pagesHost.innerHTML = '<p class="wb-loading" role="status">교재를 펼치는 중이에요.</p>';
    host.querySelectorAll('[data-workbook-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.workbookMode === mode)));
    try {
      if (mode === 'teacher') {
        teacherModule ||= import('./workbook-teacher.js?v=1');
        const module = await teacherModule;
        if (disposed || version !== renderVersion) return;
        markup = module.renderTeacherPages();
      } else markup = renderStudentPages(teacher ? {} : learner, { blank: mode === 'blank' });
      if (disposed || version !== renderVersion) return;
      pagesHost.innerHTML = markup;
      let hasLocked = false;
      pagesHost.querySelectorAll('[data-workbook-step]').forEach(button => {
        const locked = standalone || !teacher && Number(button.dataset.workbookStep) > furthest;
        button.disabled = locked;
        if (locked) { button.title = standalone ? '실험 화면에서 이용해요.' : '순서대로 공부하면 열려요.'; hasLocked = !standalone; }
      });
      if (standalone) pagesHost.querySelectorAll('[data-workbook-read]').forEach(button => { button.disabled = true; button.title = '실험 화면의 과학 읽을거리에서 읽어요.'; });
      host.querySelector('.wb-locked-note').hidden = !hasLocked;
      const pages = [...pagesHost.querySelectorAll('.workbook-page')];
      tabs.innerHTML = pages.map(page => { const id = page.dataset.page, title = Number(id) <= 8 ? pageNames[Number(id) - 1] : id.startsWith('T') ? '교사용 지도자료' : '내 기록 이어쓰기'; return `<button type="button" data-workbook-page="${escape(id)}" aria-label="${escape(id)}쪽 · ${escape(title)}">${escape(id)}</button>`; }).join('');
      host.querySelector('.wb-view-note').textContent = mode === 'teacher' ? '교사용 별도 3쪽' : mode === 'blank' ? '학생용 빈 교재 8쪽' : `직접 남긴 기록 · ${pages.length}쪽`;
      if (!pages.some(page => page.dataset.page === currentPage)) currentPage = pages[0]?.dataset.page || '1';
      goToPage(currentPage);
      requestAnimationFrame(() => { if (!disposed && version === renderVersion) goToPage(currentPage); });
      printButton.disabled = false;
      host.dataset.workbookReady = 'true';
    } catch (error) {
      if (disposed || version !== renderVersion) return;
      pagesHost.innerHTML = '<p class="wb-error" role="alert">교재를 불러오지 못했어요. 닫았다가 다시 열어 주세요.</p>';
      console.error('Workbook rendering failed', error);
    }
  }
  function beforePrint() {
    if (disposed) return;
    restorePrint?.();
    if (host.dataset.workbookReady !== 'true' || !markup) {
      restorePrint = preparePrint('<section class="workbook-page"><h2>교재가 준비된 뒤 인쇄해 주세요</h2><p>인쇄를 취소하고, 선택한 교재가 화면에 나타난 뒤 다시 눌러 주세요.</p></section>', 'loading');
      return;
    }
    restorePrint = preparePrint(markup, mode);
  }
  function afterPrint() { restorePrint?.(); restorePrint = null; }
  function onPrintMedia(event) { if (!event.matches) afterPrint(); }
  async function handleClick(event) {
    const button = event.target.closest('button');
    if (!button || button.disabled || !host.contains(button)) return;
    if (button.hasAttribute('data-workbook-close')) { close(); return; }
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
      try { window.print(); } catch (error) { afterPrint(); throw error; }
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
    if (!standalone && ['battery', 'city', 'palace'].includes(article)) { close(); onRead(article); }
  }
  function handleScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      const top = standalone ? 120 : scrollHost.getBoundingClientRect().top;
      const pages = [...pagesHost.querySelectorAll('.workbook-page')];
      const nearest = pages.find(page => page.getBoundingClientRect().bottom > top + 100);
      if (nearest) setCurrent(nearest.dataset.page);
    });
  }
  host.addEventListener('click', handleClick);
  scrollHost.addEventListener('scroll', handleScroll, { passive: true });
  if (standalone) window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);
  printMedia.addEventListener('change', onPrintMedia);
  void render();
  return () => {
    disposed = true;
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
    const focusable = [...dialog.querySelectorAll('button:not(:disabled),a[href],select,[tabindex="0"]')].filter(element => element.getClientRects().length);
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
