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
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXY23456789";
  const legacy = root.GFIELD_HF_DATA || { students: [], studentCode: {}, studentType: {}, access: {} };
  let remoteStudents = [];
  let remoteMode = false;

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

  function applyMixedBundleStates() {
    document.querySelectorAll('[data-bundle-state="partial"]').forEach(input => {
      input.indeterminate = true;
      input.setAttribute("aria-checked", "mixed");
    });
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
        <td><button class="danger" type="button" data-action="remove">삭제</button></td>
      </tr>`;
    }).join("");
  }

  function renderRemote() {
    $("#rows").innerHTML = remoteStudents.map((student, index) => {
      const permissions = Array.isArray(student.permissions) ? student.permissions : [];
      const online = student.type === "online";
      return `<tr data-index="${index}">
        <td><button class="ghost" type="button" data-action="rotate">새 번호 발급</button></td>
        <td>${esc(student.name)}</td>
        <td><span class="tag${online ? " online" : ""}">${online ? "온라인" : "재원"}</span> <span class="tag ${esc(student.status)}">${esc(student.status)}</span></td>
        ${permissionCell(permissions, "hyperfocus", student.status === "archived")}
        ${permissionCell(permissions, "hyperfocus-extra", student.status === "archived")}
        ${remoteMockCell(student)}
        ${permissionCell(permissions, "vip", student.status === "archived")}
        ${permissionCell(permissions, "problem-bank", student.status === "archived")}
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
    window.prompt(`${name} 학생의 새 승인번호입니다.\n이 창을 닫으면 다시 볼 수 없으며, 필요하면 재발급해야 합니다.`, code);
  }

  async function addStudent() {
    const input = $("#newName");
    const name = input.value.trim();
    const studentType = $("#newType").value;
    if (!name) return;
    if (remoteMode) {
      setStatus("학생 계정을 안전하게 만드는 중…");
      try {
        const result = await invokeAdmin({ action: "create", name, studentType });
        input.value = "";
        showOneTimeCode(name, result.oneTimeApprovalCode);
        await loadRemote();
      } catch (error) {
        setStatus("❌ 학생 등록 실패");
        alert(error.message);
      }
      return;
    }
    if (legacy.students.includes(name)) return alert("이미 등록된 학생입니다.");
    legacy.students.push(name);
    legacy.studentType[name] = studentType;
    legacy.studentCode[name] = legacyCode();
    legacy.access[name] = ["hyperfocus"];
    input.value = "";
    renderLegacy();
    dirty();
    showOneTimeCode(name, legacy.studentCode[name]);
  }

  async function handleRemoteAction(row, action, value) {
    const student = remoteStudents[Number(row.dataset.index)];
    if (!student) return;
    setStatus("중앙 권한을 변경하는 중…");
    try {
      if (action === "rotate") {
        if (!confirm(`${student.name} 학생의 기존 승인번호를 폐기하고 새 번호를 발급할까요?`)) return;
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

  async function init() {
    const session = await auth.ready();
    if (!session || session.role !== "admin") {
      location.replace("./?login=1");
      return;
    }
    remoteMode = auth.isSupabaseEnabled();
    $("[data-add-student]").addEventListener("click", addStudent);
    $("#rows").addEventListener("click", async event => {
      const row = event.target.closest("tr[data-index]");
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (!row || !action || action === "status") return;
      const index = Number(row.dataset.index);
      if (remoteMode) await handleRemoteAction(row, action);
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
      $("#adminNote").textContent = "승인번호 원문은 데이터베이스에도 저장하지 않습니다. 모의고사는 활용 8회·파이널 3회·최종 4회 상품 단위로 승인하며, 일부 회차만 연결된 상태는 노란색 개수로 표시됩니다. 학생 삭제 대신 정지·보관 상태를 사용합니다.";
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
