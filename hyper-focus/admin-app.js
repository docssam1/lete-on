(function (root) {
  "use strict";

  const auth = root.GFieldHFPortalAuth;
  const REPO = "docssam1/lete-on";
  const BRANCH = "main";
  const FILE_PATH = "hyper-focus/data.js";
  const MOCK_BUNDLES = Object.freeze([
    Object.freeze({ series: "utilization", key: "premier-utilization", label: "활용 8회", expectedCount: 8 }),
    Object.freeze({ series: "final", key: "premier-final", label: "파이널 3회", expectedCount: 3 }),
    Object.freeze({ series: "last", key: "premier-last", label: "최종 4회", expectedCount: 4 })
  ]);
  const challengeCatalog = root.HFChallengeAccessCatalog?.list?.() || [];
  const challengeProducts = challengeCatalog.filter(entry => entry.kind === "concept" || entry.kind === "mock");
  const challengeBanks = challengeCatalog.filter(entry => entry.kind === "bank");
  const hfCatalog = root.HFTypeAccessCatalog;
  const hfRows = hfCatalog?.list?.().sort((left, right) => left.id - right.id) || [];
  const hfModeKey = hfCatalog?.modeKey || "";
  const detailKeys = new Set([
    ...challengeCatalog.map(entry => entry.key),
    ...hfRows.map(entry => entry.key),
    hfModeKey
  ].filter(Boolean));
  const detailCatalogReady = challengeCatalog.length === 110 && challengeBanks.length === 104 && hfRows.length === 54 && Boolean(hfModeKey);
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXY23456789";
  const legacy = root.GFIELD_HF_DATA || { students: [], studentCode: {}, studentType: {}, access: {} };
  let remoteStudents = [];
  let remoteMode = false;
  const approval = {
    student: null,
    original: new Set(),
    desired: new Set(),
    busy: false,
    epoch: 0,
    tab: "challenge",
    opener: null,
    notice: "",
    tone: ""
  };

  legacy.students = Array.isArray(legacy.students) ? legacy.students : [];
  legacy.studentCode = legacy.studentCode || {};
  legacy.studentType = legacy.studentType || {};
  legacy.access = legacy.access || {};

  const $ = selector => document.querySelector(selector);

  function esc(value) {
    return String(value || "").replace(/[&<>"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    })[character]);
  }

  function setStatus(message) {
    $("#saveStatus").textContent = message;
  }

  function randomIndex(max) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }

  function legacyCode() {
    let code;
    do {
      code = "GF";
      while (code.length < 8) code += CHARS[randomIndex(CHARS.length)];
    } while (Object.values(legacy.studentCode).includes(code));
    return code;
  }

  function ensureLegacy(name) {
    if (!legacy.studentCode[name]) legacy.studentCode[name] = legacyCode();
    if (!legacy.studentType[name]) legacy.studentType[name] = "internal";
    if (!Array.isArray(legacy.access[name])) legacy.access[name] = ["hyperfocus"];
  }

  function checked(permissions, key) {
    return permissions.includes(key) ? "checked" : "";
  }

  function permissionCell(permissions, key, disabled) {
    return `<td><input type="checkbox" data-permission="${key}" ${checked(permissions, key)} ${disabled ? "disabled" : ""} aria-label="${key}"></td>`;
  }

  function legacyMockCell(permissions) {
    return `<td><label class="legacy-mock"><input type="checkbox" data-permission="mock" ${checked(permissions, "mock")}>레거시 전체</label></td>`;
  }

  function remoteMockCell(student) {
    const states = student.mockBundles && typeof student.mockBundles === "object" ? student.mockBundles : {};
    const archived = student.status === "archived";
    return `<td><div class="bundle-list">${MOCK_BUNDLES.map(bundle => {
      const state = states[bundle.series] && typeof states[bundle.series] === "object" ? states[bundle.series] : {};
      const stateName = ["full", "partial", "none", "catalog_error"].includes(state.state) ? state.state : "catalog_error";
      const activeCount = Number.isInteger(state.activeCount) ? state.activeCount : 0;
      const expectedCount = Number.isInteger(state.expectedCount) ? state.expectedCount : bundle.expectedCount;
      const detail = stateName === "partial" ? `${activeCount}/${expectedCount}` : stateName === "catalog_error" ? "목록 오류" : "";
      const disabled = archived || stateName === "catalog_error";
      return `<label class="bundle-toggle ${stateName}"><input type="checkbox" data-mock-bundle="${bundle.key}" data-bundle-state="${stateName}" ${stateName === "full" ? "checked" : ""} ${disabled ? "disabled" : ""} aria-label="${bundle.label}"><span>${bundle.label}</span><small>${detail}</small></label>`;
    }).join("")}</div></td>`;
  }

  function remoteApprovalCodeCell(student) {
    const approvalCode = /^GF-\d{4}$/.test(String(student.approvalCode || "")) ? student.approvalCode : "";
    const codeControl = approvalCode
      ? `<button class="ghost code" type="button" data-action="copy-code" aria-label="${esc(student.name)} 학생 승인번호 ${esc(approvalCode)} 복사">${esc(approvalCode)}</button>`
      : '<span class="code-unavailable">기존 번호 확인 불가</span>';
    const resetLabel = approvalCode ? "로그인 재설정" : "새 번호 발급";
    return `<td><div class="approval-code-actions">${codeControl}<button class="ghost code-reset" type="button" data-action="rotate">${resetLabel}</button></div></td>`;
  }

  function applyMixedBundleStates() {
    document.querySelectorAll('[data-bundle-state="partial"]').forEach(input => {
      input.indeterminate = true;
      input.setAttribute("aria-checked", "mixed");
    });
  }

  function permissionCount(permissions, entries) {
    const granted = new Set(Array.isArray(permissions) ? permissions : []);
    return entries.reduce((total, entry) => total + (granted.has(entry.key) ? 1 : 0), 0);
  }

  function detailSummary(student) {
    const permissions = Array.isArray(student.permissions) ? student.permissions : [];
    const concepts = permissionCount(permissions, challengeProducts.filter(entry => entry.kind === "concept"));
    const mocks = permissionCount(permissions, challengeProducts.filter(entry => entry.kind === "mock"));
    const challenge = permissionCount(permissions, challengeBanks);
    const hf = permissionCount(permissions, hfRows);
    const mode = permissions.includes(hfModeKey) ? " · 개별" : "";
    return `<button class="ghost detail-summary" type="button" data-action="details" data-student-id="${esc(student.id)}" ${detailCatalogReady ? "" : "disabled"} aria-label="${esc(student.name)} 학생 세부 승인 설정"><b>승인 설정</b><small>교재 ${concepts}/2 · 모의 ${mocks}/4<br>챌린지 ${challenge}/104 · HF ${hf}/54${mode}</small></button>`;
  }

  function renderLegacy() {
    $("#rows").innerHTML = legacy.students.map((name, index) => {
      ensureLegacy(name);
      const permissions = legacy.access[name];
      const online = legacy.studentType[name] === "online";
      return `<tr data-index="${index}">
        <td><button class="ghost code" type="button" data-action="copy">${esc(legacy.studentCode[name])}</button></td>
        <td>${esc(name)}</td>
        <td><span class="tag${online ? " online" : ""}">${online ? "온라인" : "재원"}</span></td>
        ${permissionCell(permissions, "hyperfocus", false)}
        ${permissionCell(permissions, "hyperfocus-extra", false)}
        ${legacyMockCell(permissions)}
        ${permissionCell(permissions, "vip", false)}
        ${permissionCell(permissions, "problem-bank", false)}
        <td class="muted-cell">중앙 권한 전용</td>
        <td><button class="danger" type="button" data-action="remove">삭제</button></td>
      </tr>`;
    }).join("");
  }

  function renderRemote() {
    $("#rows").innerHTML = remoteStudents.map((student, index) => {
      const permissions = Array.isArray(student.permissions) ? student.permissions : [];
      const online = student.type === "online";
      return `<tr data-index="${index}">
        ${remoteApprovalCodeCell(student)}
        <td>${esc(student.name)}</td>
        <td><span class="tag${online ? " online" : ""}">${online ? "온라인" : "재원"}</span> <span class="tag ${esc(student.status)}">${esc(student.status)}</span></td>
        ${permissionCell(permissions, "hyperfocus", student.status === "archived")}
        ${permissionCell(permissions, "hyperfocus-extra", student.status === "archived")}
        ${remoteMockCell(student)}
        ${permissionCell(permissions, "vip", student.status === "archived")}
        ${permissionCell(permissions, "problem-bank", student.status === "archived")}
        <td>${detailSummary(student)}</td>
        <td><div class="row-actions"><select data-action="status"><option value="active" ${student.status === "active" ? "selected" : ""}>활성</option><option value="suspended" ${student.status === "suspended" ? "selected" : ""}>정지</option><option value="archived" ${student.status === "archived" ? "selected" : ""}>보관</option></select></div></td>
      </tr>`;
    }).join("");
    applyMixedBundleStates();
  }

  function dirty() {
    setStatus("● 저장되지 않은 변경 있음");
  }

  function toggleLegacy(index, key, enabled) {
    const name = legacy.students[index];
    if (!name) return;
    ensureLegacy(name);
    const permissions = legacy.access[name];
    const position = permissions.indexOf(key);
    if (enabled && position < 0) permissions.push(key);
    if (!enabled && position >= 0) permissions.splice(position, 1);
    if (enabled && ["hyperfocus-extra", "problem-bank"].includes(key) && !permissions.includes("hyperfocus")) permissions.push("hyperfocus");
    renderLegacy();
    dirty();
  }

  async function invokeAdmin(body) {
    const client = await auth.client();
    const { data, error } = await client.functions.invoke("admin-students", { body });
    if (error || data?.error) throw new Error("관리자 작업을 처리하지 못했습니다.");
    return data || {};
  }

  function challengeOrderedKeys() {
    return challengeCatalog.map(entry => entry.key);
  }

  function hfOrderedKeys() {
    return [...hfRows.map(row => row.key), hfCatalog.modeKey];
  }

  function approvalScopeKeys(scope) {
    return scope === "challenge" ? challengeOrderedKeys() : hfOrderedKeys();
  }

  function approvalChanges(scope) {
    return approvalScopeKeys(scope)
      .filter(key => approval.original.has(key) !== approval.desired.has(key))
      .map(key => ({ key, enabled: approval.desired.has(key) }));
  }

  function allApprovalChanges() {
    return [...approvalChanges("challenge"), ...approvalChanges("hf")];
  }

  function setDesired(key, enabled) {
    if (enabled) approval.desired.add(key);
    else approval.desired.delete(key);
  }

  function isApprovalActive() {
    if (!approval.student || approval.student.status !== "active") return false;
    return true;
  }

  function setApprovalNotice(message, tone = "") {
    approval.notice = message;
    approval.tone = tone;
  }

  function approvalChoice(entry, source) {
    const meta = source === "challenge-bank"
      ? `${entry.round}회 · ${entry.area} · ${entry.section === "main" ? `본시험 ${entry.number}번` : `추가 ${entry.number}번`}`
      : source === "hf" ? `유형 ${String(entry.id).padStart(2, "0")}` : "";
    return `<label class="approval-choice"><input type="checkbox" data-approval-key="${esc(entry.key)}" ${approval.desired.has(entry.key) ? "checked" : ""}><span><b>${esc(entry.label)}</b>${meta ? `<small>${esc(meta)}</small>` : ""}</span></label>`;
  }

  function renderChallengeProducts() {
    const groups = [
      { kind: "concept", title: "개념 교재" },
      { kind: "mock", title: "모의고사" }
    ];
    $("#approvalChallengeProducts").innerHTML = groups.map(group => {
      const items = challengeProducts.filter(entry => entry.kind === group.kind);
      return `<section class="approval-product-group"><h4>${group.title}</h4>${items.map(entry => approvalChoice(entry, "challenge-product")).join("")}</section>`;
    }).join("");
  }

  function filteredChallengeBanks() {
    const round = $("#approvalRoundFilter").value;
    const area = $("#approvalAreaFilter").value;
    const term = $("#approvalChallengeSearch").value.trim().toLocaleLowerCase("ko-KR");
    return challengeBanks.filter(entry => {
      if (round !== "all" && String(entry.round) !== round) return false;
      if (area !== "all" && entry.area !== area) return false;
      if (!term) return true;
      return `${entry.label} ${entry.area} ${entry.typeId}`.toLocaleLowerCase("ko-KR").includes(term);
    });
  }

  function renderChallengeBanks() {
    const items = filteredChallengeBanks();
    $("#approvalChallengeTypes").innerHTML = items.length
      ? items.map(entry => approvalChoice(entry, "challenge-bank")).join("")
      : '<p class="approval-empty">조건에 맞는 유형이 없습니다.</p>';
  }

  function filteredHfRows() {
    const term = $("#approvalHfSearch").value.trim().toLocaleLowerCase("ko-KR");
    if (!term) return hfRows;
    return hfRows.filter(entry => `${entry.id} ${entry.label}`.toLocaleLowerCase("ko-KR").includes(term));
  }

  function renderHfRows() {
    const items = filteredHfRows();
    $("#approvalHfTypes").innerHTML = items.length
      ? items.map(entry => approvalChoice(entry, "hf")).join("")
      : '<p class="approval-empty">조건에 맞는 유형이 없습니다.</p>';
  }

  function selectedCount(entries) {
    return entries.reduce((total, entry) => total + (approval.desired.has(entry.key) ? 1 : 0), 0);
  }

  function defaultApprovalNotice(tab = approval.tab) {
    if (!approval.student) return "";
    if (!isApprovalActive()) return "정지·보관 학생은 현재 승인 상태만 확인할 수 있습니다.";
    const permissions = new Set(approval.student.permissions || []);
    if (tab === "challenge" && !permissions.has("hyperfocus")) {
      return "문항 진단 상품 승인이 꺼져 있습니다. 세부 권한은 저장되지만 학생에게는 열리지 않습니다.";
    }
    if (tab === "hf" && !permissions.has("problem-bank")) {
      return "문제 은행 상품 승인이 꺼져 있습니다. 유형 권한은 저장되지만 학생에게는 열리지 않습니다.";
    }
    return "체크한 뒤 아래 저장 버튼을 눌러야 이 학생에게 반영됩니다.";
  }

  function syncApproval() {
    if (!approval.student) return;
    const challengeEdits = approvalChanges("challenge").length;
    const hfEdits = approvalChanges("hf").length;
    const currentEdits = approval.tab === "challenge" ? challengeEdits : hfEdits;
    const otherEdits = approval.tab === "challenge" ? hfEdits : challengeEdits;
    const studentActive = isApprovalActive();
    const locked = approval.busy || !studentActive;
    const conceptEntries = challengeProducts.filter(entry => entry.kind === "concept");
    const mockEntries = challengeProducts.filter(entry => entry.kind === "mock");
    const challengeSelected = selectedCount(challengeBanks);
    const hfSelected = selectedCount(hfRows);

    $("#approvalTitle").textContent = `${approval.student.name} 학생 승인 설정`;
    $("#approvalSummary").textContent = `${approval.student.type === "online" ? "온라인" : "재원"} · ${approval.student.status} · 교재 ${selectedCount(conceptEntries)}/2 · 모의 ${selectedCount(mockEntries)}/4`;
    $("#approvalChallengeCount").textContent = `${challengeSelected}/104유형 선택 · 현재 ${filteredChallengeBanks().length}유형 표시`;
    $("#approvalHfCount").textContent = `${hfSelected}/54유형 선택 · 현재 ${filteredHfRows().length}유형 표시`;
    $("#approvalChallengeTabCount").textContent = challengeEdits ? `(${challengeEdits})` : "";
    $("#approvalHfTabCount").textContent = hfEdits ? `(${hfEdits})` : "";
    $("#approvalIndividualMode").checked = approval.desired.has(hfModeKey);
    $("#approvalModeImpact").textContent = approval.desired.has(hfModeKey)
      ? `저장 후 선택한 ${hfSelected}유형만 적용됩니다.`
      : "기존 문제 은행 상품 승인 방식을 유지합니다.";
    $("#approvalChangeCount").textContent = currentEdits
      ? `현재 탭 ${currentEdits}개 변경${otherEdits ? ` · 다른 탭 ${otherEdits}개 변경` : ""}`
      : otherEdits ? `현재 탭 변경 없음 · 다른 탭 ${otherEdits}개 변경` : "변경 없음";
    $("#approvalSave").textContent = approval.busy
      ? "저장 중…"
      : approval.tab === "challenge" ? "챌린지 승인 저장" : "HF 문제은행 승인 저장";

    const status = $("#approvalStatus");
    status.textContent = approval.notice || defaultApprovalNotice();
    status.className = `approval-status${approval.tone ? ` ${approval.tone}` : ""}`;

    $("#approvalCenter").querySelectorAll("[data-approval-key]").forEach(input => {
      input.disabled = approval.busy || !studentActive;
    });
    $("#approvalIndividualMode").disabled = locked;
    $("#approvalChallengeSelectAll").disabled = locked || challengeSelected === challengeBanks.length;
    $("#approvalHfSelectAll").disabled = locked || hfSelected === hfRows.length;
    $("#approvalSave").disabled = locked || currentEdits === 0;
    $("#approvalCenter").querySelectorAll("[data-approval-close],[data-approval-tab]").forEach(control => {
      control.disabled = approval.busy;
    });
    ["#approvalRoundFilter", "#approvalAreaFilter", "#approvalChallengeSearch", "#approvalHfSearch"].forEach(selector => {
      $(selector).disabled = approval.busy;
    });
  }

  function setApprovalTab(tab, focus = true) {
    if (!approval.student || approval.busy || !["challenge", "hf"].includes(tab)) return;
    approval.tab = tab;
    document.querySelectorAll("[data-approval-tab]").forEach(button => {
      const selected = button.dataset.approvalTab === tab;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.tabIndex = selected ? 0 : -1;
    });
    $("#approvalChallengePanel").hidden = tab !== "challenge";
    $("#approvalHfPanel").hidden = tab !== "hf";
    setApprovalNotice(defaultApprovalNotice(tab), !isApprovalActive() ? "warning" : "");
    syncApproval();
    if (focus) document.querySelector(`[data-approval-tab="${tab}"]`)?.focus();
  }

  function openApproval(student, opener) {
    if (approval.busy) return;
    if (!detailCatalogReady) {
      alert("세부 승인 유형 목록을 불러오지 못했습니다. 새로고침 후 다시 확인해 주세요.");
      return;
    }
    approval.epoch += 1;
    approval.student = {
      id: student.id,
      name: student.name,
      type: student.type,
      status: student.status,
      permissions: Array.isArray(student.permissions) ? [...student.permissions] : []
    };
    approval.original = new Set(approval.student.permissions.filter(key => detailKeys.has(key)));
    approval.desired = new Set(approval.original);
    approval.busy = false;
    approval.tab = "challenge";
    approval.opener = opener || null;
    $("#approvalRoundFilter").value = "all";
    $("#approvalAreaFilter").value = "all";
    $("#approvalChallengeSearch").value = "";
    $("#approvalHfSearch").value = "";
    renderChallengeProducts();
    renderChallengeBanks();
    renderHfRows();
    setApprovalNotice(defaultApprovalNotice("challenge"), !isApprovalActive() ? "warning" : "");
    setApprovalTab("challenge", false);
    $("#approvalCenter").showModal();
    $("#approvalChallengeTab").focus();
  }

  function closeApproval(force = false) {
    if (!approval.student || approval.busy) return false;
    if (!force && allApprovalChanges().length && !confirm("저장되지 않은 변경한 승인이 있습니다. 변경을 버리고 닫을까요?")) return false;
    const studentId = approval.student.id;
    approval.epoch += 1;
    $("#approvalCenter").close();
    approval.student = null;
    approval.original = new Set();
    approval.desired = new Set();
    approval.notice = "";
    approval.tone = "";
    renderRemote();
    requestAnimationFrame(() => {
      [...document.querySelectorAll("[data-action=details]")]
        .find(button => button.dataset.studentId === String(studentId))?.focus();
    });
    return true;
  }

  function assertExactSetResponse(data, target, edit) {
    if (data?.ok !== true || data.studentId !== target.id || data.permissionKey !== edit.key || data.enabled !== edit.enabled) {
      throw new Error("저장 결과의 학생·권한 상태를 확인할 수 없습니다.");
    }
  }

  async function invokeApproval(name, body, requestEpoch) {
    const client = await auth.client();
    const { data, error } = await client.functions.invoke(name, { body });
    if (requestEpoch !== approval.epoch) throw new Error("로그인 상태가 변경되어 이전 응답을 반영하지 않습니다.");
    if (error || data?.error) throw new Error(data?.error || "세부 승인 저장에 실패했습니다.");
    return data || {};
  }

  async function setChallengeApproval(target, edit, requestEpoch) {
    const data = await invokeApproval("challenge-access", {
      action: "set",
      studentId: target.id,
      permissionKey: edit.key,
      enabled: edit.enabled
    }, requestEpoch);
    assertExactSetResponse(data, target, edit);
  }

  async function setHfApproval(target, edit, requestEpoch) {
    const data = await invokeApproval("hyperfocus-type-access", {
      action: "set",
      studentId: target.id,
      permissionKey: edit.key,
      enabled: edit.enabled
    }, requestEpoch);
    assertExactSetResponse(data, target, edit);
  }

  function commitApprovalScope(scope) {
    if (!approval.student) return;
    const keys = new Set(approvalScopeKeys(scope));
    const granted = approvalScopeKeys(scope).filter(key => approval.original.has(key));
    const merge = permissions => [...new Set([
      ...(Array.isArray(permissions) ? permissions : []).filter(key => !keys.has(key)),
      ...granted
    ])];
    approval.student.permissions = merge(approval.student.permissions);
    const remote = remoteStudents.find(student => student.id === approval.student.id);
    if (remote) remote.permissions = merge(remote.permissions);
  }

  async function saveApproval() {
    if (!approval.student || approval.busy || !isApprovalActive()) return;
    const scope = approval.tab;
    const edits = approvalChanges(scope);
    if (!edits.length) return;
    const target = approval.student;
    const requestEpoch = approval.epoch;
    approval.busy = true;
    setApprovalNotice(`${edits.length}개 승인 항목을 저장하고 있습니다.`);
    syncApproval();
    let done = 0;
    try {
      for (const edit of edits) {
        if (scope === "challenge") await setChallengeApproval(target, edit, requestEpoch);
        else await setHfApproval(target, edit, requestEpoch);
        setDesired(edit.key, edit.enabled);
        if (edit.enabled) approval.original.add(edit.key);
        else approval.original.delete(edit.key);
        done += 1;
      }
      setApprovalNotice(`${done}개 승인 항목을 저장했습니다.`);
    } catch (error) {
      if (requestEpoch !== approval.epoch || approval.student !== target) return;
      const remaining = approvalChanges(scope).length;
      setApprovalNotice(`${done}개 저장 · ${remaining}개 남음. ${error.message}`, "error");
    } finally {
      if (requestEpoch === approval.epoch && approval.student === target) {
        commitApprovalScope(scope);
        approval.busy = false;
        syncApproval();
      }
    }
  }

  function setRowBusy(row, busy) {
    row.querySelectorAll("input,select,button").forEach(control => { control.disabled = busy; });
    row.setAttribute("aria-busy", busy ? "true" : "false");
  }

  async function changeMockBundle(row, input) {
    const student = remoteStudents[Number(row.dataset.index)];
    const bundle = MOCK_BUNDLES.find(item => item.key === input.dataset.mockBundle);
    if (!student || !bundle) return;
    setStatus(`${bundle.label} 권한을 변경하는 중…`);
    setRowBusy(row, true);
    try {
      await invokeAdmin({
        action: "set_mock_bundle",
        studentId: student.id,
        bundleKey: bundle.key,
        enabled: input.checked
      });
      await loadRemote();
    } catch (error) {
      setStatus("❌ 모의고사 상품 권한 변경 실패");
      alert(error.message);
      await loadRemote().catch(() => {});
    }
  }

  async function loadRemote() {
    setStatus("학생 권한을 불러오는 중…");
    const result = await invokeAdmin({ action: "list" });
    remoteStudents = Array.isArray(result.students) ? result.students : [];
    renderRemote();
    setStatus(`✅ ${remoteStudents.length}명 · 중앙 권한 연결`);
  }

  function showOneTimeCode(name, code) {
    navigator.clipboard?.writeText(code).catch(() => {});
    window.prompt(`${name} 학생의 승인번호입니다.\n4자리 승인번호는 관리자 목록에서 다시 확인하고 복사할 수 있습니다.`, code);
  }

  function copyRemoteCode(student) {
    const code = /^GF-\d{4}$/.test(String(student.approvalCode || "")) ? student.approvalCode : "";
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => {
      setStatus("📋 승인번호 복사됨");
    }).catch(() => {
      window.prompt(`${student.name} 학생의 현재 승인번호입니다.`, code);
    });
  }

  async function addStudent() {
    const input = $("#newName");
    const name = input.value.trim();
    const requestedCode = $("#newCode").value.trim();
    const studentType = $("#newType").value;
    if (!name) return;
    if (remoteMode) {
      setStatus("학생 계정을 안전하게 만드는 중…");
      try {
        const payload = { action: "create", name, studentType };
        if (requestedCode) payload.approvalCode = requestedCode;
        const result = await invokeAdmin(payload);
        input.value = "";
        $("#newCode").value = "";
        showOneTimeCode(name, result.oneTimeApprovalCode);
        await loadRemote();
      } catch (error) {
        setStatus("❌ 학생 등록 실패");
        alert(error.message);
      }
      return;
    }
    if (legacy.students.includes(name)) return alert("이미 등록된 학생입니다.");
    let normalizedCode = "";
    if (requestedCode) {
      normalizedCode = requestedCode.toUpperCase().replace(/[\s-]+/gu, "");
      if (!/^GF\d{4}$/.test(normalizedCode)) return alert("승인번호는 GF- 뒤에 숫자 4자리만 입력하세요.");
      if (Object.values(legacy.studentCode).some(value => String(value).toUpperCase() === normalizedCode)) {
        return alert("이미 사용 중인 승인번호입니다.");
      }
    }
    legacy.students.push(name);
    legacy.studentType[name] = studentType;
    legacy.studentCode[name] = normalizedCode || legacyCode();
    legacy.access[name] = ["hyperfocus"];
    input.value = "";
    $("#newCode").value = "";
    renderLegacy();
    dirty();
    showOneTimeCode(name, legacy.studentCode[name]);
  }

  async function handleRemoteAction(row, action, value) {
    const student = remoteStudents[Number(row.dataset.index)];
    if (!student) return;
    if (action === "copy-code") {
      copyRemoteCode(student);
      return;
    }
    setStatus("중앙 권한을 변경하는 중…");
    try {
      if (action === "rotate") {
        const hasCurrentCode = /^GF-\d{4}$/.test(String(student.approvalCode || ""));
        const message = hasCurrentCode
          ? `${student.name} 학생이 현재 승인번호로 다시 로그인할 수 있도록 로그인 정보를 재설정할까요?`
          : `${student.name} 학생의 기존 승인번호를 폐기하고 새 번호를 발급할까요?`;
        if (!confirm(message)) return;
        const result = await invokeAdmin({ action: "rotate_code", studentId: student.id });
        showOneTimeCode(student.name, result.oneTimeApprovalCode);
      } else if (action === "status") {
        await invokeAdmin({ action: "set_status", studentId: student.id, status: value });
      }
      await loadRemote();
    } catch (error) {
      setStatus("❌ 변경 실패");
      alert(error.message);
      await loadRemote().catch(() => {});
    }
  }

  function copyLegacy(index) {
    const name = legacy.students[index];
    if (!name) return;
    navigator.clipboard?.writeText(legacy.studentCode[name]).catch(() => {});
    setStatus("📋 승인번호 복사됨");
  }

  function removeLegacy(index) {
    const name = legacy.students[index];
    if (!name || !confirm(`${name} 학생의 하이퍼포커스 권한을 삭제할까요?`)) return;
    legacy.students = legacy.students.filter(value => value !== name);
    delete legacy.studentCode[name];
    delete legacy.studentType[name];
    delete legacy.access[name];
    renderLegacy();
    dirty();
  }

  function buildLegacyFile() {
    return `/* =========================================================\n * 지필드 영재교육 · 프리미어 하이퍼포커스\n * 학생별 승인번호 및 이용 권한 — 관리자 콘솔 자동 생성\n * 기존 전화번호 기반 기록은 레거시 키에 그대로 보존됩니다.\n * 생성: ${new Date().toLocaleString("ko-KR")}\n * ========================================================= */\nwindow.GFIELD_HF_DATA = ${JSON.stringify(legacy, null, 2)};\n`;
  }

  function githubKey() {
    try { return sessionStorage.getItem("gfield_hf_gh_token") || ""; } catch (_) { return ""; }
  }

  function saveGithubKey() {
    const value = $("#ghKey").value.trim();
    if (!value) return alert("토큰을 입력하세요.");
    try { sessionStorage.setItem("gfield_hf_gh_token", value); } catch (_) {}
    alert("이 브라우저 탭을 닫기 전까지만 토큰을 보관합니다. ✅");
  }

  async function saveToGithub() {
    const token = githubKey();
    if (!token) return alert("먼저 GitHub 토큰을 저장하세요.");
    setStatus("GitHub에 저장 중…");
    try {
      let sha = null;
      const get = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" }
      });
      if (get.ok) sha = (await get.json()).sha;
      else if (get.status !== 404) throw new Error(`파일 확인 오류 ${get.status}`);
      const body = {
        message: "admin: 하이퍼포커스 승인번호 갱신",
        content: btoa(unescape(encodeURIComponent(buildLegacyFile()))),
        branch: BRANCH
      };
      if (sha) body.sha = sha;
      const put = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
        body: JSON.stringify(body)
      });
      if (!put.ok) throw new Error((await put.json().catch(() => ({}))).message || `저장 오류 ${put.status}`);
      setStatus(`✅ 저장 완료 · ${new Date().toLocaleTimeString("ko-KR")}`);
    } catch (error) {
      setStatus(`❌ ${error.message}`);
      alert(`저장 실패\n\n${error.message}`);
    }
  }

  function setupApprovalCenter() {
    const areaSelect = $("#approvalAreaFilter");
    [...new Set(challengeBanks.map(entry => entry.area))].sort((left, right) => left.localeCompare(right, "ko"))
      .forEach(area => areaSelect.append(new Option(area, area)));

    $("#approvalCenter").addEventListener("click", event => {
      const close = event.target.closest("[data-approval-close]");
      if (close) {
        closeApproval();
        return;
      }
      const tab = event.target.closest("[data-approval-tab]")?.dataset.approvalTab;
      if (tab) {
        setApprovalTab(tab);
        return;
      }
      if (event.target.closest("#approvalChallengeSelectAll") && isApprovalActive() && !approval.busy) {
        challengeBanks.forEach(entry => approval.desired.add(entry.key));
        renderChallengeBanks();
        setApprovalNotice(defaultApprovalNotice("challenge"));
        syncApproval();
        return;
      }
      if (event.target.closest("#approvalHfSelectAll") && isApprovalActive() && !approval.busy) {
        hfRows.forEach(entry => approval.desired.add(entry.key));
        renderHfRows();
        setApprovalNotice(defaultApprovalNotice("hf"));
        syncApproval();
        return;
      }
      if (event.target.closest("#approvalSave")) saveApproval();
    });

    $("#approvalCenter").addEventListener("change", event => {
      if (!approval.student || approval.busy || !isApprovalActive()) return;
      const key = event.target.dataset.approvalKey || (event.target.matches("[data-approval-hf-mode]") ? hfModeKey : "");
      if (!key || !detailKeys.has(key)) return;
      setDesired(key, event.target.checked);
      setApprovalNotice(defaultApprovalNotice());
      syncApproval();
    });

    $("#approvalRoundFilter").addEventListener("change", () => { renderChallengeBanks(); syncApproval(); });
    $("#approvalAreaFilter").addEventListener("change", () => { renderChallengeBanks(); syncApproval(); });
    $("#approvalChallengeSearch").addEventListener("input", () => { renderChallengeBanks(); syncApproval(); });
    $("#approvalHfSearch").addEventListener("input", () => { renderHfRows(); syncApproval(); });

    $(".approval-tabs").addEventListener("keydown", event => {
      if (!approval.student || approval.busy || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      setApprovalTab(approval.tab === "challenge" ? "hf" : "challenge");
    });
    $("#approvalCenter").addEventListener("cancel", event => {
      event.preventDefault();
      closeApproval();
    });
    $("#approvalCenter").addEventListener("click", event => {
      if (event.target === $("#approvalCenter")) closeApproval();
    });
    root.addEventListener("beforeunload", event => {
      if (!approval.student || !allApprovalChanges().length) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  async function init() {
    const session = await auth.ready();
    if (!session || session.role !== "admin") {
      location.replace("./?login=1");
      return;
    }
    remoteMode = auth.isSupabaseEnabled();
    setupApprovalCenter();
    $("[data-add-student]").addEventListener("click", addStudent);
    $("#rows").addEventListener("click", async event => {
      const row = event.target.closest("tr[data-index]");
      const actionControl = event.target.closest("[data-action]");
      const action = actionControl?.dataset.action;
      if (!row || !action || action === "status") return;
      const index = Number(row.dataset.index);
      if (remoteMode && action === "details") {
        const student = remoteStudents[index];
        if (student) openApproval(student, actionControl);
      } else if (remoteMode) await handleRemoteAction(row, action);
      else if (action === "copy") copyLegacy(index);
      else if (action === "remove") removeLegacy(index);
    });
    $("#rows").addEventListener("change", async event => {
      const row = event.target.closest("tr[data-index]");
      if (!row) return;
      if (event.target.dataset.mockBundle && remoteMode) {
        await changeMockBundle(row, event.target);
      } else if (event.target.dataset.permission) {
        const key = event.target.dataset.permission;
        if (remoteMode) {
          const student = remoteStudents[Number(row.dataset.index)];
          try {
            await invokeAdmin({ action: "set_entitlement", studentId: student.id, permissionKey: key, enabled: event.target.checked });
            await loadRemote();
          } catch (error) {
            alert(error.message);
            await loadRemote().catch(() => {});
          }
        } else toggleLegacy(Number(row.dataset.index), key, event.target.checked);
      } else if (event.target.dataset.action === "status" && remoteMode) {
        await handleRemoteAction(row, "status", event.target.value);
      }
    });

    if (remoteMode) {
      $("#legacySyncCard").hidden = true;
      $("#adminNote").textContent = "현재 사용하는 4자리 승인번호는 관리자 목록에서 확인하고 복사할 수 있습니다. 이전 장문 승인번호는 원문을 저장하지 않아 확인할 수 없으며 새 번호 발급이 필요합니다. 모의고사는 활용 8회·파이널 3회·최종 4회 상품 단위로 승인하며, 일부 회차만 연결된 상태는 노란색 개수로 표시됩니다. 학생 삭제 대신 정지·보관 상태를 사용합니다.";
      await loadRemote();
    } else {
      $("[data-save-key]").addEventListener("click", saveGithubKey);
      $("[data-save-github]").addEventListener("click", saveToGithub);
      $("#ghKey").value = githubKey();
      renderLegacy();
    }
  }

  init().catch(error => {
    console.error("Hyper Focus admin initialization failed", error);
    setStatus("❌ 관리자 화면을 불러오지 못했습니다.");
  });
})(window);
