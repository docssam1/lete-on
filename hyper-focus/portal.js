(function () {
  "use strict";

  const catalog = window.GFIELD_HF_PORTAL;
  const auth = window.GFieldHFPortalAuth;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  let session = null;
  let mfaMode = false;

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
    modal.hidden = false;
    document.body.classList.add("modal-open");
    setTimeout(() => modal.classList.add("visible"), 10);
  }

  function closeModal(modal) {
    modal.classList.remove("visible");
    setTimeout(() => { modal.hidden = true; document.body.classList.remove("modal-open"); }, 180);
  }

  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function openCollection(product) {
    $("#collectionTitle").textContent = product.shortTitle;
    $("#collectionGroups").innerHTML = product.groups.map(group => {
      const items = Array.from({ length: group.count }, (_, index) => group.items[index] || null);
      return `<section class="exam-group"><header><div><small>${esc(group.note)}</small><h3>${esc(group.label)}</h3></div><span>${group.count}회</span></header><div class="exam-list">${items.map((item, index) => item?.href
        ? `<a href="${esc(item.href)}"><b>${index + 1}</b><span>${esc(item.label || `${index + 1}회`)}</span><i>응시하기</i></a>`
        : `<button type="button" disabled><b>${index + 1}</b><span>${index + 1}회</span><i>검수 중</i></button>`).join("")}</div></section>`;
    }).join("");
    showModal($("#collectionModal"));
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
    session = result;
    closeModal($("#loginModal"));
    setMode();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindEvents() {
    $("#loginForm").addEventListener("submit", login);
    $$('[data-login-open]').forEach(button => button.addEventListener("click", () => showModal($("#loginModal"))));
    $$('[data-modal-close]').forEach(button => button.addEventListener("click", () => closeModal($("#loginModal"))));
    $$('[data-collection-close]').forEach(button => button.addEventListener("click", () => closeModal($("#collectionModal"))));
    $("[data-logout]").addEventListener("click", async () => {
      await auth.signOut();
      session = null;
      setMode();
    });
    document.addEventListener("click", event => {
      const trigger = event.target.closest("[data-product]");
      if (trigger) openProduct(trigger.dataset.product);
    });
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      $$(".modal.visible").forEach(closeModal);
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
