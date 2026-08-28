(function () {
  "use strict";

  const catalog = window.GFIELD_HF_PORTAL;
  const auth = window.GFieldHFPortalAuth;
  const collectionUi = window.GFieldHFPortalCollection;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  let session = null;
  let mfaMode = false;
  let currentCollection = null;
  let collectionViewToken = 0;
  let modalReturnFocus = null;
  const secureExamLoader = collectionUi?.createExamLoader?.() || Object.freeze({
    load: () => Promise.reject(new Error("회차 목록 모듈을 준비하지 못했습니다.")),
    reset: () => {}
  });

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function hrefs() {
    $$('[data-apply]').forEach(el => { el.href = catalog.applicationUrl; el.target = "_blank"; el.rel = "noopener"; });
    $$('[data-consult]').forEach(el => { el.href = catalog.consultationUrl; el.target = "_blank"; el.rel = "noopener"; });
  }

  function previewCard(product) {
    return `<article class="preview-card accent-${esc(product.accent)}">
      <span>${esc(product.order)}</span><small>${esc(product.eyebrow)}</small>
      <h3>${esc(product.shortTitle)}</h3><p>${esc(product.description)}</p>
      <b>${esc(product.status)}</b>
    </article>`;
  }

  function bookCard(product) {
    const allowed = auth.canAccess(session, product.permission);
    const title = esc(product.title).replace(/\n/g, "<br>");
    return `<button class="library-book accent-${esc(product.accent)}${allowed ? " unlocked" : " locked"}" type="button" data-product="${esc(product.key)}" aria-label="${esc(product.shortTitle)} ${allowed ? "열기" : "잠김"}">
      <span class="book-spine"><i>${esc(product.order)}</i><b>G-FIELD</b></span>
      <span class="book-face">
        <small>${esc(product.eyebrow)}</small><strong>${title}</strong>
        <em>${esc(product.description)}</em><i class="book-status">${allowed ? "OPEN · " + esc(product.status) : "LOCKED · 승인 필요"}</i>
        <span class="lock-seal" aria-hidden="true">${allowed ? "↗" : "🔒"}</span>
      </span>
      <span class="book-pages"></span>
    </button>`;
  }

  function renderPublic() {
    $("#previewGrid").innerHTML = catalog.products.map(previewCard).join("");
  }

  function renderLibrary() {
    if (!session) return;
    const displayName = session.name || "학생";
    $("#memberName").textContent = displayName;
    $("#welcomeName").textContent = displayName;
    $("#memberType").textContent = session.role === "admin" ? "관리자" : session.type === "online" ? "온라인 회원" : "재원 회원";
    $("#dateStamp").textContent = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    $("#productShelf").innerHTML = catalog.products.map(bookCard).join("");
    $("#libraryNav").innerHTML = catalog.products.map(product => {
      const open = auth.canAccess(session, product.permission);
      return `<button type="button" data-product="${esc(product.key)}"><span>${esc(product.order)}</span>${esc(product.shortTitle)}<i>${open ? "OPEN" : "LOCK"}</i></button>`;
    }).join("");
  }

  function setMode() {
    const loggedIn = !!session;
    $("#publicHome").hidden = loggedIn;
    $("#libraryHome").hidden = !loggedIn;
    $("[data-login-open]").hidden = loggedIn;
    $("[data-logout]").hidden = !loggedIn;
    document.body.classList.toggle("is-library", loggedIn);
    if (loggedIn) renderLibrary();
  }

  function showModal(modal) {
    modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    setTimeout(() => {
      modal.classList.add("visible");
      const focusTarget = modal.querySelector('input:not([disabled])')
        || modal.querySelector('button:not([disabled]), a[href]');
      focusTarget?.focus();
    }, 10);
  }

  function closeModal(modal) {
    modal.classList.remove("visible");
    const returnTarget = modalReturnFocus;
    modalReturnFocus = null;
    setTimeout(() => {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (returnTarget?.isConnected && !returnTarget.hidden) returnTarget.focus();
    }, 180);
  }

  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function collectionGroups(product, exams, remoteLoaded) {
    if (collectionUi?.buildGroups) {
      return collectionUi.buildGroups(
        window.GFIELD_HF_PREMIER_RELEASE_CATALOG,
        exams,
        { remoteLoaded }
      );
    }
    return product.groups.map(group => ({
      key: group.key,
      label: group.label,
      note: group.note,
      count: group.count,
      rounds: Array.from({ length: group.count }, (_, index) => ({
        number: index + 1,
        label: `${group.label} ${index + 1}회`,
        state: "review_pending",
        action: "검수 중",
        href: null
      }))
    }));
  }

  function renderCollectionGroups(product, exams, remoteLoaded) {
    const groups = collectionGroups(product, exams, remoteLoaded);
    $("#collectionGroups").innerHTML = groups.map(group => `<section class="exam-group"><header><div><small>${esc(group.note)}</small><h3>${esc(group.label)}</h3></div><span>${esc(group.count)}회</span></header><div class="exam-list">${group.rounds.map(round => round.href
      ? `<a href="${esc(round.href)}" aria-label="${esc(round.label)} 응시하기"><b>${esc(round.number)}</b><span>${esc(round.label)}</span><i>${esc(round.action)}</i></a>`
      : `<button type="button" disabled aria-label="${esc(round.label)} ${esc(round.action)}"><b>${esc(round.number)}</b><span>${esc(round.label)}</span><i>${esc(round.action)}</i></button>`).join("")}</div></section>`).join("");
    return groups;
  }

  function setCollectionStatus(message, retry) {
    const status = $("#collectionStatus");
    const button = $("#collectionRetry");
    status.textContent = String(message || "");
    status.hidden = !message;
    button.hidden = retry !== true;
  }

  function secureCollectionAvailable() {
    return collectionUi?.canLoadRemote?.(
      window.GFIELD_HF_SUPABASE_CONFIG,
      session,
      window.GFieldHFSecureMock
    ) === true;
  }

  function secureCollectionConfigured() {
    const config = window.GFIELD_HF_SUPABASE_CONFIG;
    return config?.enabled === true && config?.features?.secureMockDelivery === true;
  }

  async function openCollection(product, options = {}) {
    currentCollection = product;
    const currentSession = session;
    const viewToken = ++collectionViewToken;
    $("#collectionTitle").textContent = product.shortTitle;
    renderCollectionGroups(product, [], false);
    setCollectionStatus("", false);
    if (options.keepOpen !== true || $("#collectionModal").hidden) showModal($("#collectionModal"));

    // 현재 기능 플래그가 꺼져 있으면 기존 검수 대기 화면만 보여 주고 요청하지 않습니다.
    if (!secureCollectionConfigured()) return;
    if (!secureCollectionAvailable()) {
      setCollectionStatus("로그인 정보를 확인하지 못해 모든 회차를 잠금 상태로 표시합니다.", false);
      return;
    }

    setCollectionStatus("학생별 이용 가능 회차를 확인하고 있습니다.", false);
    try {
      const exams = await secureExamLoader.load(
        currentSession,
        () => window.GFieldHFSecureMock.listExams(),
        { force: options.force === true }
      );
      if (viewToken !== collectionViewToken || session !== currentSession || currentCollection !== product) return;
      const groups = renderCollectionGroups(product, exams, true);
      const openCount = groups.flatMap(group => group.rounds).filter(round => round.state === "open").length;
      setCollectionStatus(
        openCount ? `승인된 공개 회차 ${openCount}개를 확인했습니다.` : "현재 승인된 공개 회차가 없습니다.",
        false
      );
    } catch (_) {
      if (viewToken !== collectionViewToken || session !== currentSession || currentCollection !== product) return;
      renderCollectionGroups(product, [], false);
      setCollectionStatus("회차 권한을 확인하지 못했습니다. 모든 회차를 잠금 상태로 표시합니다.", true);
    }
  }

  function closeCollection() {
    collectionViewToken += 1;
    currentCollection = null;
    setCollectionStatus("", false);
    closeModal($("#collectionModal"));
  }

  function retryCollection() {
    if (currentCollection) openCollection(currentCollection, { force: true, keepOpen: true });
  }

  function openProduct(key) {
    const product = catalog.products.find(item => item.key === key);
    if (!product || !session) return;
    if (!auth.canAccess(session, product.permission)) {
      toast(`${product.shortTitle} 이용 권한이 없습니다. 상담을 통해 승인받아 주세요.`);
      return;
    }
    if (product.kind === "collection") {
      openCollection(product);
      return;
    }
    if (product.href) location.href = product.href;
  }

  async function login(event) {
    event.preventDefault();
    const error = $("#loginError");
    error.textContent = "";
    if (mfaMode) {
      const result = await auth.verifyMfa($("#loginMfa").value);
      if (!result) {
        error.textContent = "인증 앱의 최신 6자리 번호를 다시 확인해 주세요.";
        return;
      }
      location.href = result.role === "admin" ? "./admin.html" : "./";
      return;
    }
    const name = $("#loginName").value.trim();
    const code = $("#loginCode").value.trim();
    if (!name || !code) {
      error.textContent = "학생 이름과 승인번호를 모두 입력해 주세요.";
      return;
    }
    const result = await auth.signIn(name, code);
    if (!result) {
      error.textContent = "이름과 승인번호가 일치하지 않습니다.";
      return;
    }
    if (result.role === "mfa_enrollment_required") {
      location.href = "./admin-mfa.html";
      return;
    }
    if (result.role === "mfa_required") {
      mfaMode = true;
      $("#loginMfaRow").hidden = false;
      $("#loginName").disabled = true;
      $("#loginCode").disabled = true;
      $("#loginSubmit").textContent = "관리자 2단계 인증";
      $("#loginMfa").focus();
      return;
    }
    if (result.role === "admin") {
      location.href = "./admin.html";
      return;
    }
    secureExamLoader.reset();
    session = result;
    closeModal($("#loginModal"));
    setMode();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindEvents() {
    $("#loginForm").addEventListener("submit", login);
    $$('[data-login-open]').forEach(button => button.addEventListener("click", () => showModal($("#loginModal"))));
    $$('[data-modal-close]').forEach(button => button.addEventListener("click", () => closeModal($("#loginModal"))));
    $$('[data-collection-close]').forEach(button => button.addEventListener("click", closeCollection));
    $("#collectionRetry").addEventListener("click", retryCollection);
    $("[data-logout]").addEventListener("click", async () => {
      await auth.signOut();
      secureExamLoader.reset();
      if (!$("#collectionModal").hidden) closeCollection();
      session = null;
      setMode();
    });
    document.addEventListener("click", event => {
      const trigger = event.target.closest("[data-product]");
      if (trigger) openProduct(trigger.dataset.product);
    });
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      $$(".modal.visible").forEach(modal => {
        if (modal.id === "collectionModal") closeCollection();
        else closeModal(modal);
      });
    });
  }

  async function init() {
    renderPublic();
    hrefs();
    bindEvents();
    session = await auth.ready();
    setMode();
    if (new URLSearchParams(location.search).get("login") === "1" && !session) showModal($("#loginModal"));
  }

  init().catch(error => {
    console.error("Hyper Focus portal initialization failed", error);
    renderPublic();
    hrefs();
    setMode();
    if (new URLSearchParams(location.search).get("login") === "1") showModal($("#loginModal"));
  });
})();
