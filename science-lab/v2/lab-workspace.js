// 책의 위치와 실험 DOM을 보존하는 전체 화면 작업 공간. 네이티브 전체 화면은 버튼으로만 요청한다.
const activeByDocument = new WeakMap();
let nextId = 0;
const FOCUSABLE = 'a[href],button,input,select,textarea,[tabindex],summary,[contenteditable="true"]';

export function createLabWorkspace(root, { title = '3D 체험 실험실', mount } = {}) {
  if (!root?.ownerDocument || typeof mount !== 'function') throw new TypeError('실험실 root와 mount가 필요합니다.');
  const doc = root.ownerDocument, win = doc.defaultView;
  const id = `sl-lab-workspace-${++nextId}`;
  const workspace = doc.createElement('div');
  workspace.className = 'sl-lab-workspace sl-lab-workspace-hidden';
  workspace.hidden = true; workspace.inert = true;
  workspace.setAttribute('role', 'dialog'); workspace.setAttribute('aria-modal', 'true');
  workspace.setAttribute('aria-labelledby', `${id}-title`); workspace.setAttribute('aria-hidden', 'true');
  workspace.innerHTML = `<div class="sl-lab-workspace-panel">
    <header class="sl-lab-workspace-header"><div><p>독쌤의 과학 실험실</p><h2 id="${id}-title"></h2></div>
      <div class="sl-lab-workspace-actions"><button type="button" data-lab-fullscreen aria-pressed="false">전체 화면</button><button type="button" data-lab-close>책으로 돌아가기</button></div></header>
    <p class="sl-lab-workspace-status" role="status" aria-live="polite"></p>
    <div class="sl-lab-workspace-body" tabindex="-1"></div></div>`;
  workspace.querySelector('h2').textContent = title;
  const body = workspace.querySelector('.sl-lab-workspace-body');
  const status = workspace.querySelector('.sl-lab-workspace-status');
  const closeButton = workspace.querySelector('[data-lab-close]');
  const fullscreenButton = workspace.querySelector('[data-lab-fullscreen]');
  doc.body.appendChild(workspace);

  let opened = false, disposed = false, mounted = false, mountResult = null, mountSettled = false;
  let returnTo = null, scrollState = null, overflowState = null;
  let animationFrame = 0, closeTimer = 0, removalTimer = 0, epoch = 0;
  let fullscreenPending = false, fullscreenOwned = false, fullscreenExiting = false;
  let wasConnected = root.isConnected;
  const inertState = new Map();
  const reduced = () => win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const isActive = () => opened && !disposed && root.isConnected && root.ownerDocument === doc && workspace.isConnected && doc.visibilityState !== 'hidden';
  const pauseMount = () => { try { mountResult?.pause?.(); } catch { /* 닫기/복귀를 막지 않는다. */ } };
  const disposeMount = (value) => { try { if (typeof value === 'function') value(); else value?.dispose?.(); } catch { /* DOM과 접근 상태 복구는 계속한다. */ } };

  function rememberInert(element) {
    if (!inertState.has(element)) inertState.set(element, element.getAttribute('inert'));
    element.inert = true;
  }
  function lockBackground() {
    // 이미 전체 화면인 책 안에 놓인 경우에도 작업 공간의 조상은 inert로 만들지 않는다.
    let branch = workspace;
    while (branch.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of parent.children) if (sibling !== branch) rememberInert(sibling);
      if (parent === doc.body) break;
      branch = parent;
    }
  }
  function unlockBackground() {
    for (const [element, previous] of inertState) {
      if (previous === null) element.removeAttribute('inert'); else element.setAttribute('inert', previous);
    }
    inertState.clear();
  }
  function lockScroll() {
    const nodes = new Set();
    for (let element = root; element; element = element.parentElement) nodes.add(element);
    scrollState = { x: win.scrollX, y: win.scrollY, nodes: [...nodes].map((element) => ({ element, x: element.scrollLeft, y: element.scrollTop })) };
    const names = ['overflow', 'overflow-x', 'overflow-y'];
    overflowState = [doc.documentElement, doc.body].map((element) => ({ element, values: names.map((name) => [name, element.style.getPropertyValue(name), element.style.getPropertyPriority(name)]) }));
    for (const { element } of overflowState) element.style.setProperty('overflow', 'hidden', 'important');
  }
  function restoreScroll() {
    if (overflowState) for (const { element, values } of overflowState) {
      for (const [name] of values) element.style.removeProperty(name);
      for (const [name, value, priority] of values) if (value) element.style.setProperty(name, value, priority);
    }
    overflowState = null;
    if (scrollState) {
      for (const { element, x, y } of scrollState.nodes) if (element.isConnected) {
        try { element.scrollTo({ left: x, top: y, behavior: 'instant' }); } catch { element.scrollLeft = x; element.scrollTop = y; }
      }
      try { win.scrollTo({ left: scrollState.x, top: scrollState.y, behavior: 'instant' }); } catch { /* 문서가 종료 중이면 복귀 생략 */ }
    }
    scrollState = null;
  }
  function restoreFocus() {
    if (returnTo?.isConnected && !returnTo.closest?.('[inert]')) {
      try { returnTo.focus({ preventScroll: true }); } catch { /* 원래 버튼이 사라졌으면 이동하지 않는다. */ }
    }
  }
  function placeWorkspace() {
    const fullscreen = doc.fullscreenElement;
    // 타 작업의 전체 화면은 종료하지 않는다. 그 안에 잠시 올려야 top-layer 뒤에 가려지지 않는다.
    const parent = fullscreen && fullscreen !== workspace && !workspace.contains(fullscreen) ? fullscreen : doc.body;
    if (workspace.parentElement !== parent) parent.appendChild(workspace);
  }
  function updateFullscreenLabel() {
    const own = doc.fullscreenElement === workspace;
    fullscreenButton.textContent = own ? '전체 화면 끝내기' : '전체 화면';
    fullscreenButton.setAttribute('aria-pressed', String(own));
  }
  async function exitOwnedFullscreen() {
    if (!fullscreenOwned || fullscreenExiting || doc.fullscreenElement !== workspace) return;
    fullscreenExiting = true;
    try { await doc.exitFullscreen(); } catch { /* 실패해도 숨김과 책 복귀는 유지한다. */ }
    finally { fullscreenExiting = false; if (doc.fullscreenElement !== workspace) fullscreenOwned = false; updateFullscreenLabel(); }
  }
  async function requestFullscreen() {
    if (!opened || disposed || fullscreenPending) return;
    if (doc.fullscreenElement === workspace && fullscreenOwned) { await exitOwnedFullscreen(); return; }
    if (doc.fullscreenElement) { status.textContent = '이미 전체 화면 안에서 실험하고 있어요.'; return; }
    if (!workspace.requestFullscreen) { status.textContent = '이 기기에서는 현재의 큰 실험 화면을 이용해 주세요.'; return; }
    const requestedEpoch = epoch;
    fullscreenPending = true;
    try {
      await workspace.requestFullscreen();
      if (doc.fullscreenElement === workspace) fullscreenOwned = true;
      if (!opened || disposed || epoch !== requestedEpoch) await exitOwnedFullscreen();
      else status.textContent = '';
    } catch {
      if (opened && !disposed) status.textContent = '전체 화면을 열지 못했어요. 현재의 큰 실험 화면은 그대로 이용할 수 있어요.';
    } finally { fullscreenPending = false; updateFullscreenLabel(); }
  }
  function onFullscreenChange() {
    if (doc.fullscreenElement === workspace && fullscreenPending) fullscreenOwned = true;
    if (doc.fullscreenElement !== workspace) fullscreenOwned = false;
    if (!opened || disposed) { void exitOwnedFullscreen(); return; }
    if (doc.fullscreenElement !== workspace) { unlockBackground(); placeWorkspace(); lockBackground(); }
    updateFullscreenLabel();
  }

  function startMount() {
    if (mounted || !opened || disposed) return;
    mounted = true; body.setAttribute('aria-busy', 'true'); status.textContent = '실험실을 준비하고 있어요.';
    let result;
    try { result = mount(body, { isActive }); } catch (error) { result = Promise.reject(error); }
    Promise.resolve(result).then((value) => {
      mountSettled = true;
      if (disposed) { disposeMount(value); return; }
      mountResult = value; body.removeAttribute('aria-busy'); status.textContent = '';
      if (!isActive()) pauseMount();
    }, () => {
      mountSettled = true;
      if (disposed) return;
      // 성공한 실험 DOM은 보존하되, 실패한 준비는 다음 진입에서 다시 시도한다.
      mounted = false;
      body.removeAttribute('aria-busy');
      status.textContent = '실험실을 불러오지 못했어요. 책으로 돌아가 다시 확인해 주세요.';
    });
  }
  function finishClose() {
    if (opened) return;
    workspace.hidden = true; workspace.classList.add('sl-lab-workspace-hidden');
    workspace.classList.remove('sl-lab-workspace-closing');
    if (!disposed && workspace.parentElement !== doc.body && doc.fullscreenElement !== workspace) doc.body.appendChild(workspace);
  }
  function endOpen({ immediate = false, focus = true } = {}) {
    if (!opened) { if (immediate) { win.clearTimeout(closeTimer); finishClose(); } return; }
    opened = false; epoch++; pauseMount();
    if (activeByDocument.get(doc) === api) activeByDocument.delete(doc);
    win.cancelAnimationFrame(animationFrame); win.clearTimeout(closeTimer);
    workspace.inert = true; workspace.setAttribute('aria-hidden', 'true');
    workspace.classList.remove('sl-lab-workspace-open'); workspace.classList.add('sl-lab-workspace-closing');
    void exitOwnedFullscreen();
    unlockBackground(); restoreScroll();
    if (focus) restoreFocus();
    if (immediate || reduced()) finishClose(); else closeTimer = win.setTimeout(finishClose, 280);
  }
  function open(from) {
    if (disposed || !root.isConnected || root.ownerDocument !== doc) return false;
    if (opened) { closeButton.focus({ preventScroll: true }); return true; }
    activeByDocument.get(doc)?.close();
    returnTo = from?.focus ? from : doc.activeElement;
    wasConnected = true; opened = true; epoch++;
    activeByDocument.set(doc, api);
    win.clearTimeout(closeTimer); win.cancelAnimationFrame(animationFrame);
    placeWorkspace(); lockScroll(); lockBackground();
    workspace.hidden = false; workspace.inert = false; workspace.removeAttribute('aria-hidden');
    workspace.classList.remove('sl-lab-workspace-hidden', 'sl-lab-workspace-closing');
    updateFullscreenLabel();
    doc.dispatchEvent(new win.CustomEvent('science:lab-open', { detail: { root, workspace } }));
    closeButton.focus({ preventScroll: true });
    // 처음 한 번만 위치를 확정하고, 이후 전환은 transform만 움직인다.
    if (!reduced()) workspace.getBoundingClientRect();
    animationFrame = win.requestAnimationFrame(() => {
      animationFrame = 0;
      if (!opened || disposed) return;
      workspace.classList.add('sl-lab-workspace-open'); startMount();
    });
    return true;
  }
  const close = () => endOpen();
  function focusable() {
    return [...workspace.querySelectorAll(FOCUSABLE)].filter((element) => !element.disabled && element.tabIndex >= 0 && !element.closest('[inert],[hidden]') && element.getClientRects().length > 0);
  }
  function onKeyDown(event) {
    if (!opened || disposed) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(), first = items[0] || closeButton, last = items.at(-1) || closeButton;
    if (!workspace.contains(doc.activeElement) || (event.shiftKey && doc.activeElement === first) || (!event.shiftKey && doc.activeElement === last)) {
      event.preventDefault(); event.stopPropagation(); (event.shiftKey ? last : first).focus({ preventScroll: true });
    }
  }
  function onFocusIn(event) { if (opened && !disposed && !workspace.contains(event.target)) closeButton.focus({ preventScroll: true }); }
  function containKeys(event) { event.stopPropagation(); } // 책의 방향키 넘기기로 새지 않게 한다.
  function onVisibility() { if (doc.visibilityState === 'hidden') pauseMount(); }
  function onBeforePrint() { endOpen({ immediate: true }); }
  function dispose() {
    if (disposed) return;
    endOpen({ immediate: true, focus: root.isConnected });
    disposed = true; epoch++; pauseMount();
    win.clearTimeout(closeTimer); win.clearTimeout(removalTimer); win.cancelAnimationFrame(animationFrame);
    observer.disconnect();
    doc.removeEventListener('keydown', onKeyDown, true); doc.removeEventListener('focusin', onFocusIn, true);
    doc.removeEventListener('fullscreenchange', onFullscreenChange); doc.removeEventListener('visibilitychange', onVisibility);
    win.removeEventListener('beforeprint', onBeforePrint);
    closeButton.removeEventListener('click', close); fullscreenButton.removeEventListener('click', requestFullscreen);
    workspace.removeEventListener('keydown', containKeys);
    if (mountSettled) disposeMount(mountResult);
    mountResult = null; workspace.remove();
  }
  const observer = new win.MutationObserver((records) => {
    if (disposed) return;
    if (root.isConnected && root.ownerDocument === doc) { wasConnected = true; win.clearTimeout(removalTimer); removalTimer = 0; }
    else if (wasConnected && !removalTimer) removalTimer = win.setTimeout(() => {
      removalTimer = 0;
      if (!root.isConnected || root.ownerDocument !== doc) dispose();
    }, 0);
    if (opened && records.some((record) => !workspace.contains(record.target))) lockBackground();
  });
  observer.observe(doc.documentElement, { childList: true, subtree: true });
  doc.addEventListener('keydown', onKeyDown, true); doc.addEventListener('focusin', onFocusIn, true);
  doc.addEventListener('fullscreenchange', onFullscreenChange); doc.addEventListener('visibilitychange', onVisibility);
  win.addEventListener('beforeprint', onBeforePrint);
  closeButton.addEventListener('click', close); fullscreenButton.addEventListener('click', requestFullscreen);
  workspace.addEventListener('keydown', containKeys);
  const api = { open, close, dispose };
  return api;
}
