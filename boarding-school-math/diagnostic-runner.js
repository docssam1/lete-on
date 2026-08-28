(function () {
  "use strict";

  const API_PATH = "/api/grade6-local";
  const SESSION_KEY = "gfield.grade6.local-diagnostic.v1";
  const MAX_RESPONSE_BYTES = 10 * 1024;
  const MAX_WORKPAD_CHARS = 1500;
  const MAX_TEXT_CHARS = 200;
  const MAX_SAVE_BATCH_BYTES = 8 * 1024;
  const ERROR_LABELS = Object.freeze({
    "prerequisite-gap": "선수개념 결손",
    "concept-gap": "개념 연결 오류",
    "representation-error": "표현 변환 오류",
    "calculation-error": "계산 오류",
    "condition-missed": "조건 누락",
    "strategy-gap": "전략 선택 오류",
    "explanation-incomplete": "설명 근거 부족"
  });
  const DOMAIN_LABELS = Object.freeze({
    "G6-RP": "비와 비례",
    "G6-NS": "수 체계",
    "G6-EE": "식과 방정식",
    "G6-G": "기하",
    "G6-SP": "통계와 확률"
  });
  const MODE_LABELS = Object.freeze({
    repair: "선수개념 보완",
    "guided-practice": "핵심 적용 연습",
    consolidate: "유지·심화 전이"
  });
  const DIFFICULTY_LABELS = Object.freeze({ foundation: "기초", core: "핵심", advanced: "심화" });
  const BAND_LABELS = Object.freeze({
    developing: "보완 우선",
    approaching: "핵심 접근",
    ready: "준비 근거 확보"
  });
  const RESOURCE_LABELS = Object.freeze({
    "concept-workbook": "개념 워크북",
    "guided-practice": "수업 연습",
    homework: "가정 연습",
    quiz: "확인 퀴즈",
    test: "단원 평가",
    "student-report": "성장 요약",
    "lesson-plan": "수업안",
    "answer-key": "정답지",
    "solution-guide": "해설지",
    rubric: "채점 루브릭",
    "assignment-builder": "과제 구성",
    "teacher-report": "교사 리포트"
  });

  const state = {
    role: "student",
    runtimeAvailable: false,
    items: [],
    responses: {},
    currentIndex: 0,
    attemptId: "",
    studentToken: "",
    attemptState: "idle",
    teacherQueue: [],
    teacherReviews: {},
    teacherPin: ""
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function localized(value, fallback) {
    if (value == null) return fallback || "";
    if (typeof value === "string") return value;
    return value.ko || value.en || value["zh-Hans"] || fallback || "";
  }

  function unpack(payload) {
    return payload && payload.data && typeof payload.data === "object" ? payload.data : payload;
  }

  function utf8ByteLength(value) {
    return new TextEncoder().encode(String(value)).byteLength;
  }

  function validateResponseValue(value) {
    if (utf8ByteLength(value) > MAX_RESPONSE_BYTES) {
      throw new Error("답변이 저장 한도를 넘었습니다. 풀이를 조금 줄여 주세요.");
    }
  }

  async function apiRequest(action, options) {
    const settings = options || {};
    const method = settings.method || "POST";
    const url = method === "GET"
      ? `${API_PATH}?action=${encodeURIComponent(action)}${settings.query || ""}`
      : API_PATH;
    const headers = { Accept: "application/json" };
    if (method !== "GET") headers["Content-Type"] = "application/json";
    if (settings.studentToken) headers["x-gfield-student-token"] = settings.studentToken;
    const response = await fetch(url, {
      method,
      headers,
      cache: "no-store",
      body: method === "GET" ? undefined : JSON.stringify(Object.assign({ action }, settings.body || {}))
    });
    let payload = null;
    try { payload = await response.json(); } catch (_) { payload = null; }
    if (!response.ok) {
      const detail = payload && (payload.message || payload.error);
      const message = typeof detail === "string" ? detail : `요청 실패 (${response.status})`;
      throw new Error(message);
    }
    return unpack(payload || {});
  }

  function publicItem(source, index) {
    const payload = source.publicPayload || source.publicDraft || source.payload || source;
    return {
      slotNumber: Number(source.slotNumber || payload.slotNumber || index + 1),
      itemId: source.itemId || payload.itemId,
      clusterId: source.clusterId || payload.clusterId || "",
      domainId: source.domainId || payload.domainId || "",
      difficulty: source.difficulty || payload.difficulty || "core",
      responseType: source.responseType || payload.responseType || "short-answer",
      promptBlocks: Array.isArray(payload.promptBlocks) ? payload.promptBlocks : [],
      options: Array.isArray(payload.options) ? payload.options : [],
      assets: Array.isArray(payload.assets) ? payload.assets : [],
      responseUi: payload.responseUi || {}
    };
  }

  function persistStudentState() {
    const safe = {
      items: state.items,
      responses: state.responses,
      currentIndex: state.currentIndex,
      attemptId: state.attemptId,
      studentToken: state.studentToken,
      attemptState: state.attemptState
    };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(safe)); } catch (_) { /* session persistence is optional */ }
  }

  function restoreStudentState() {
    try {
      const restored = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      if (!restored || !Array.isArray(restored.items) || restored.items.length !== 42 || !restored.attemptId || !restored.studentToken) return;
      state.items = restored.items.map(publicItem);
      state.responses = restored.responses && typeof restored.responses === "object" ? restored.responses : {};
      state.currentIndex = Number.isInteger(restored.currentIndex) ? Math.max(0, Math.min(41, restored.currentIndex)) : 0;
      state.attemptId = restored.attemptId;
      state.studentToken = restored.studentToken;
      state.attemptState = restored.attemptState || "in-progress";
    } catch (_) { /* ignore corrupt browser-only resume data */ }
  }

  function setRuntimeStatus(kind, title, copy) {
    const host = document.getElementById("runtime-connection");
    host.dataset.state = kind;
    document.getElementById("runtime-status-title").textContent = title;
    document.getElementById("runtime-status-copy").textContent = copy;
  }

  function setWorkspaceRole(role, focusPanel) {
    state.role = role === "teacher" ? "teacher" : "student";
    document.querySelectorAll("[data-workspace-role]").forEach(function (control) {
      if (control.getAttribute("role") !== "tab") return;
      const selected = control.dataset.workspaceRole === state.role;
      control.setAttribute("aria-selected", String(selected));
      control.setAttribute("tabindex", selected ? "0" : "-1");
    });
    const student = document.getElementById("student-workspace");
    const teacher = document.getElementById("teacher-workspace");
    student.hidden = state.role !== "student";
    teacher.hidden = state.role !== "teacher";
    if (focusPanel) (state.role === "student" ? student : teacher).focus({ preventScroll: true });
  }

  function moveWorkspaceFocus(event) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const tabs = Array.from(document.querySelectorAll('.workspace-tabs [role="tab"]'));
    const current = tabs.indexOf(event.target);
    if (current < 0) return;
    event.preventDefault();
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else next = (current + 1) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  }

  function answerValue(item) {
    const value = state.responses[item.itemId];
    return value == null ? "" : String(value);
  }

  function hasAnswer(item) {
    return answerValue(item).trim().length > 0;
  }

  function renderOverview() {
    const host = document.getElementById("question-overview");
    host.replaceChildren();
    state.items.forEach(function (item, index) {
      const button = element("button", hasAnswer(item) ? "answered" : "", item.slotNumber);
      button.type = "button";
      button.setAttribute("aria-label", `${item.slotNumber}번${hasAnswer(item) ? ", 답변함" : ", 미답"}`);
      if (index === state.currentIndex) button.setAttribute("aria-current", "step");
      button.addEventListener("click", async function () {
        await saveCurrent(false);
        state.currentIndex = index;
        persistStudentState();
        renderQuestion(true);
      });
      host.append(button);
    });
  }

  function assetFor(item, assetId) {
    return item.assets.find(function (asset) { return asset.assetId === assetId; });
  }

  function renderPromptBlock(item, block) {
    if (block.type === "diagram") {
      const asset = assetFor(item, block.assetId);
      const figure = element("figure", "question-diagram");
      if (!asset) {
        figure.append(element("p", "asset-error", "그림 자료를 불러올 수 없습니다. 교사에게 알려 주세요."));
        return figure;
      }
      const image = document.createElement("img");
      image.src = asset.runtimeUrl || asset.url || `${API_PATH}/assets/${encodeURIComponent(asset.assetId)}`;
      image.alt = localized(asset.altByLocale, "문제 그림");
      image.loading = "eager";
      figure.append(image);
      return figure;
    }
    return element("p", "prompt-text", localized(block.valueByLocale || block.value, ""));
  }

  function setResponse(item, value) {
    const nextValue = String(value);
    try {
      validateResponseValue(nextValue);
    } catch (error) {
      document.getElementById("answer-save-status").textContent = error.message;
      return false;
    }
    state.responses[item.itemId] = nextValue;
    document.getElementById("answer-save-status").textContent = "이 브라우저에 답을 보관했습니다. 다음 이동 때 서버에 저장합니다.";
    persistStudentState();
    renderOverview();
    return true;
  }

  function renderResponseControl(item, host) {
    const current = answerValue(item);
    const controlId = `response-${item.itemId}`;
    const label = element(item.options.length ? "span" : "label", "response-label", item.responseType === "constructed-response" ? "풀이와 근거" : "답");
    if (!item.options.length) label.htmlFor = controlId;
    host.append(label);
    if (item.options.length) {
      const choices = element("fieldset", "choice-list");
      const legend = element("legend", "visually-hidden", "답 선택");
      choices.append(legend);
      item.options.forEach(function (option, index) {
        const row = element("label", "choice-option");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `answer-${item.itemId}`;
        input.value = option.optionId;
        input.checked = current === option.optionId;
        input.addEventListener("change", function () { setResponse(item, input.value); });
        row.append(input, element("span", "choice-index", String.fromCharCode(65 + index)), element("span", "choice-label", localized(option.labelByLocale, option.optionId)));
        choices.append(row);
      });
      host.append(choices);
      return;
    }
    const inputKind = item.responseUi.inputKind;
    if (inputKind === "workpad" || item.responseType === "constructed-response") {
      const textarea = document.createElement("textarea");
      textarea.id = controlId;
      textarea.rows = 7;
      textarea.value = current;
      textarea.maxLength = MAX_WORKPAD_CHARS;
      textarea.placeholder = "계산 과정과 이유를 함께 쓰세요.";
      const limit = element("p", "response-limit", `${utf8ByteLength(current).toLocaleString()} / ${MAX_RESPONSE_BYTES.toLocaleString()} bytes · 최대 ${MAX_WORKPAD_CHARS.toLocaleString()}자`);
      limit.setAttribute("aria-live", "polite");
      textarea.addEventListener("input", function () {
        if (!setResponse(item, textarea.value)) textarea.value = answerValue(item);
        limit.textContent = `${utf8ByteLength(textarea.value).toLocaleString()} / ${MAX_RESPONSE_BYTES.toLocaleString()} bytes · 최대 ${MAX_WORKPAD_CHARS.toLocaleString()}자`;
      });
      host.append(textarea, limit);
      return;
    }
    const input = document.createElement("input");
    input.id = controlId;
    input.type = "text";
    input.value = current;
    input.maxLength = MAX_TEXT_CHARS;
    input.autocomplete = "off";
    if (inputKind === "number" || item.responseType === "numeric") {
      input.inputMode = "decimal";
      input.placeholder = "정수, 소수 또는 분수로 입력";
    } else {
      input.placeholder = "답과 필요한 단위를 입력";
    }
    const limit = element("p", "response-limit", `${utf8ByteLength(current).toLocaleString()} / ${MAX_RESPONSE_BYTES.toLocaleString()} bytes · 최대 ${MAX_TEXT_CHARS}자`);
    limit.setAttribute("aria-live", "polite");
    input.addEventListener("input", function () {
      if (!setResponse(item, input.value)) input.value = answerValue(item);
      limit.textContent = `${utf8ByteLength(input.value).toLocaleString()} / ${MAX_RESPONSE_BYTES.toLocaleString()} bytes · 최대 ${MAX_TEXT_CHARS}자`;
    });
    host.append(input, limit);
  }

  function renderQuestion(moveFocus) {
    const item = state.items[state.currentIndex];
    if (!item) return;
    document.getElementById("question-domain").textContent = `${DOMAIN_LABELS[item.domainId] || item.domainId} · ${item.clusterId} · ${DIFFICULTY_LABELS[item.difficulty] || item.difficulty}`;
    document.getElementById("question-progress").textContent = `${state.currentIndex + 1} / ${state.items.length}`;
    const progress = document.getElementById("question-progress-bar");
    progress.max = state.items.length;
    progress.value = state.currentIndex + 1;
    progress.textContent = `${state.currentIndex + 1} / ${state.items.length}`;
    const host = document.getElementById("student-question");
    host.replaceChildren();
    const heading = element("h3", "question-number", `${item.slotNumber}.`);
    heading.tabIndex = -1;
    host.append(heading);
    item.promptBlocks.forEach(function (block) { host.append(renderPromptBlock(item, block)); });
    const response = element("div", "response-area");
    renderResponseControl(item, response);
    host.append(response);
    const previous = document.getElementById("question-prev");
    const next = document.getElementById("question-next");
    const submit = document.getElementById("assessment-submit");
    previous.disabled = state.currentIndex === 0;
    next.hidden = state.currentIndex === state.items.length - 1;
    submit.hidden = state.currentIndex !== state.items.length - 1;
    document.getElementById("answer-save-status").textContent = hasAnswer(item) ? "답변함 · 이동하면 서버에 저장됩니다." : "답을 선택하거나 입력하세요.";
    renderOverview();
    if (moveFocus) heading.focus({ preventScroll: true });
  }

  async function saveCurrent(announce) {
    const item = state.items[state.currentIndex];
    if (!item || !hasAnswer(item) || state.attemptState !== "in-progress") return true;
    try {
      await apiRequest("save", {
        studentToken: state.studentToken,
        body: { attemptId: state.attemptId, responses: [{ itemId: item.itemId, value: answerValue(item).trim() }] }
      });
      if (announce) document.getElementById("answer-save-status").textContent = "저장했습니다.";
      return true;
    } catch (error) {
      document.getElementById("answer-save-status").textContent = `저장하지 못했습니다: ${error.message}`;
      return false;
    }
  }

  async function startStudentAttempt() {
    const button = document.getElementById("student-start");
    button.disabled = true;
    button.textContent = "진단 준비 중…";
    try {
      const result = await apiRequest("start", { body: {} });
      const items = result.items || result.questions || [];
      if (!Array.isArray(items) || items.length !== 42) throw new Error("42문항 전달 계약이 맞지 않습니다.");
      state.items = items.map(publicItem).sort(function (left, right) { return left.slotNumber - right.slotNumber; });
      state.responses = {};
      state.currentIndex = 0;
      state.attemptId = result.attemptId;
      state.studentToken = result.studentToken;
      state.attemptState = "in-progress";
      if (!state.attemptId || !state.studentToken) throw new Error("진단 세션이 안전하게 발급되지 않았습니다.");
      persistStudentState();
      document.getElementById("student-intro").hidden = true;
      document.getElementById("assessment-runner").hidden = false;
      renderQuestion(true);
    } catch (error) {
      button.disabled = !state.runtimeAvailable;
      button.textContent = "비공개 QA 진단 시작";
      setRuntimeStatus("error", "진단을 시작하지 못했습니다", error.message);
    }
  }

  async function submitAssessment() {
    const missing = state.items.filter(function (item) { return !hasAnswer(item); });
    if (missing.length) {
      state.currentIndex = state.items.indexOf(missing[0]);
      renderQuestion(true);
      document.getElementById("answer-save-status").textContent = `미답 ${missing.length}문항이 남았습니다. 먼저 이 문항에 답하세요.`;
      return;
    }
    const button = document.getElementById("assessment-submit");
    button.disabled = true;
    button.textContent = "42문항 제출 중…";
    try {
      const responseBatches = [];
      let batch = [];
      state.items.forEach(function (item) {
        const response = { itemId: item.itemId, value: answerValue(item).trim() };
        validateResponseValue(response.value);
        const candidate = batch.concat(response);
        const candidateBody = { action: "save", attemptId: state.attemptId, responses: candidate };
        if (batch.length && utf8ByteLength(JSON.stringify(candidateBody)) > MAX_SAVE_BATCH_BYTES) {
          responseBatches.push(batch);
          batch = [response];
        } else {
          batch = candidate;
        }
      });
      if (batch.length) responseBatches.push(batch);
      for (const responses of responseBatches) {
        await apiRequest("save", {
          studentToken: state.studentToken,
          body: { attemptId: state.attemptId, responses }
        });
      }
      const result = await apiRequest("submit", { studentToken: state.studentToken, body: { attemptId: state.attemptId } });
      state.attemptState = result.status || result.attemptState || "teacher-review-pending";
      persistStudentState();
      document.getElementById("assessment-runner").hidden = true;
      document.getElementById("student-pending").hidden = false;
      document.getElementById("student-attempt-id").textContent = state.attemptId;
      document.getElementById("teacher-attempt-id").value = state.attemptId;
      document.getElementById("student-result-refresh").focus();
    } catch (error) {
      button.disabled = false;
      button.textContent = "42문항 제출";
      document.getElementById("answer-save-status").textContent = `제출하지 못했습니다: ${error.message}`;
    }
  }

  function scorePercent(score) {
    if (!score) return 0;
    if (typeof score.percentage === "number") return score.percentage;
    return score.maxPoints ? Math.round(1000 * score.earnedPoints / score.maxPoints) / 10 : 0;
  }

  function renderErrorBreakdown(value) {
    const list = element("ul", "error-tags");
    const entries = Array.isArray(value)
      ? value.map(function (row) { return [row.errorType, row.count]; })
      : Object.entries(value || {});
    if (!entries.length) list.append(element("li", "secure", "확인된 오류 없음"));
    entries.filter(function (entry) { return Number(entry[1]) > 0; }).forEach(function (entry) {
      list.append(element("li", "", `${ERROR_LABELS[entry[0]] || entry[0]} ${entry[1]}`));
    });
    return list;
  }

  function renderResourceSummary(resources, label) {
    const host = element("div", "route-resources");
    host.append(element("span", "route-resource-label", label));
    const counts = {};
    (resources || []).forEach(function (resource) {
      counts[resource.resourceType] = (counts[resource.resourceType] || 0) + 1;
    });
    const list = element("ul", "route-resource-list");
    Object.keys(counts).sort().forEach(function (resourceType) {
      list.append(element("li", "", `${RESOURCE_LABELS[resourceType] || resourceType} ${counts[resourceType]}`));
    });
    if (!list.children.length) list.append(element("li", "", "연결 자료 검수 대기"));
    host.append(list);
    return host;
  }

  function renderDifficultyEvidence(evidence) {
    const list = element("ul", "route-difficulty-list");
    ["foundation", "core", "advanced"].forEach(function (level) {
      const score = evidence && evidence[level];
      if (!score) return;
      const hasEvidence = Number(score.maxPoints) > 0 && Number.isFinite(Number(score.percentage));
      list.append(element("li", hasEvidence ? "" : "no-evidence", hasEvidence
        ? `${DIFFICULTY_LABELS[level]} ${score.earnedPoints}/${score.maxPoints} · ${score.percentage}%`
        : `${DIFFICULTY_LABELS[level]} · 근거 없음`));
    });
    return list;
  }

  function renderCadence(roadmap) {
    const cadence = roadmap && roadmap.defaultCadence;
    if (!cadence) return null;
    const section = element("section", "report-section cadence-section");
    section.append(element("h4", "", "기본 수업 처방"));
    const grid = element("dl", "cadence-grid");
    [
      ["단원 기간", `${cadence.weeksPerUnit}주`],
      ["수업", `주 ${cadence.sessionsPerWeek}회 × ${cadence.minutesPerSession}분`],
      ["가정학습", `주 ${cadence.homeBlocksPerWeek}회 × ${cadence.minutesPerHomeBlock}분`],
      ["유지 확인", `최소 D+${cadence.retentionMinimumDelayDays}`]
    ].forEach(function (entry) {
      const wrapper = element("div");
      wrapper.append(element("dt", "", entry[0]), element("dd", "", entry[1]));
      grid.append(wrapper);
    });
    section.append(grid, element("p", "cadence-note", "GFIELD 기본안이며 학교 시간표와 교사 판단으로 조정합니다. 자료 배정은 아직 승인 전입니다."));
    return section;
  }

  function renderReport(host, report, roadmap, audience) {
    if (!report || !report.score) throw new Error("분석 리포트 형식이 올바르지 않습니다.");
    host.replaceChildren();
    const header = element("header", "report-header");
    const headerCopy = element("div");
    headerCopy.append(element("span", "folio", audience === "teacher" ? "TEACHER ANALYSIS / SCHOOL REVIEW PENDING" : "STUDENT RESULT / REVIEWED EVIDENCE"));
    headerCopy.append(element("h3", "", audience === "teacher" ? "영역 근거와 수업 처방 후보" : "나의 수학 근거와 다음 학습 제안"));
    const score = element("div", "report-score");
    score.append(element("strong", "", `${scorePercent(report.score)}%`));
    score.append(element("span", "", `${report.score.earnedPoints} / ${report.score.maxPoints}점`));
    score.append(element("span", "report-band", `진단 등급 · ${BAND_LABELS[report.score.performanceBand] || report.score.performanceBand}`));
    header.append(headerCopy, score);
    host.append(header);

    const caution = element("p", "report-caution", "이 결과는 한 번의 진단 근거입니다. 미국 공통 공식 승급 컷이 아니며, 단원 숙달·유지 확인·교사 판단과 함께 사용합니다.");
    host.append(caution);

    const domainSection = element("section", "report-section");
    domainSection.append(element("h4", "", "5개 영역 분석"));
    const domainGrid = element("div", "domain-result-grid");
    (report.domains || []).forEach(function (domain) {
      const card = element("article", "domain-result");
      card.dataset.domainId = domain.domainId;
      const top = element("div");
      top.append(element("strong", "", DOMAIN_LABELS[domain.domainId] || domain.domainId), element("span", "", `${scorePercent(domain)}%`));
      const track = element("progress", "domain-track", `${scorePercent(domain)}%`);
      track.max = 100;
      track.value = Math.max(0, Math.min(100, scorePercent(domain)));
      track.setAttribute("aria-label", `${DOMAIN_LABELS[domain.domainId] || domain.domainId} ${scorePercent(domain)}%`);
      card.append(top, track, renderErrorBreakdown(domain.errorBreakdown || domain.errorCounts));
      domainGrid.append(card);
    });
    domainSection.append(domainGrid);
    host.append(domainSection);

    const cadence = renderCadence(roadmap);
    if (cadence) host.append(cadence);

    if (roadmap && Array.isArray(roadmap.routes)) {
      const routeSection = element("section", "report-section");
      routeSection.append(element("h4", "", "우선 학습 처방"));
      const routes = element("ol", "prescription-list");
      roadmap.routes.slice(0, 10).forEach(function (route, index) {
        const entry = element("li", "prescription-entry");
        const marker = element("span", "prescription-index", String(index + 1).padStart(2, "0"));
        const body = element("div");
        body.append(element("strong", "", `${MODE_LABELS[route.mode] || route.mode} · ${DOMAIN_LABELS[route.domainId] || route.domainId}`));
        body.append(element("p", "", `${route.clusterId} · ${route.standardRange} · 진단 근거 ${scorePercent(route)}%`));
        body.append(renderDifficultyEvidence(route.difficultyEvidence));
        body.append(renderErrorBreakdown(route.errorBreakdown || route.errorCounts));
        const action = audience === "teacher" ? route.teacherAction : route.studentAction;
        if (action) body.append(element("p", "route-action", localized(action, "")));
        const conceptLink = element("a", "route-concept-link", audience === "teacher" ? "연결 개념 레슨 미리보기 →" : "이 개념 학습 시작 →");
        conceptLink.href = `./concept-learning.html?cluster=${encodeURIComponent(route.clusterId)}`;
        body.append(conceptLink);
        body.append(renderResourceSummary(route.studentResources, "학생 계획 자료"));
        if (audience === "teacher") body.append(renderResourceSummary(route.teacherResources, "교사 계획 자료"));
        body.append(element("p", "assignment-lock", route.assignmentState === "locked-awaiting-reviewed-signed-content-and-teacher-confirmation"
          ? "배정 상태 · 검수 자료 연결과 교사 승인 전"
          : `배정 상태 · ${route.assignmentState || "학교 검토 대기"}`));
        entry.append(marker, body);
        routes.append(entry);
      });
      routeSection.append(routes);
      host.append(routeSection);
    }

    if (Array.isArray(report.itemFeedback)) {
      const itemSection = element("section", "report-section item-feedback-section");
      itemSection.append(element("h4", "", "문항별 채점 유형 코멘트"));
      const list = element("ol", "item-feedback-list");
      report.itemFeedback.forEach(function (item, index) {
        const row = element("li", item.outcomeCode === "full-credit" ? "secure" : "needs-work");
        const comment = localized(item.comment, "근거를 다시 확인합니다.");
        const scoreLabel = item.outcomeCode === "full-credit" ? "1/1점" : item.outcomeCode === "no-credit" ? "0/1점" : "부분점수";
        row.append(element("strong", "", `${item.questionNumber || index + 1}번 · ${scoreLabel} · ${DIFFICULTY_LABELS[item.difficulty] || item.difficulty}`));
        row.append(element("span", "", item.errorType ? ERROR_LABELS[item.errorType] || item.errorType : "정확"));
        row.append(element("p", "", comment));
        list.append(row);
      });
      itemSection.append(list);
      host.append(itemSection);
    }

    const print = element("button", "quiet-button report-print", "리포트 인쇄");
    print.type = "button";
    print.addEventListener("click", function () {
      document.body.classList.add("printing-report");
      host.dataset.printTarget = "true";
      window.print();
    });
    host.append(print);
    host.hidden = false;
    if (!host.hasAttribute("tabindex")) host.tabIndex = -1;
    host.focus({ preventScroll: true });
  }

  async function refreshStudentResult() {
    const button = document.getElementById("student-result-refresh");
    button.disabled = true;
    button.textContent = "결과 확인 중…";
    try {
      const result = await apiRequest("student-result", {
        method: "GET",
        studentToken: state.studentToken,
        query: `&attemptId=${encodeURIComponent(state.attemptId)}`
      });
      const report = result.studentReport || result.report;
      const roadmap = result.studentRoadmap || result.roadmap;
      if (!report) {
        button.textContent = "아직 교사 검토 중 · 다시 확인";
        button.disabled = false;
        return;
      }
      state.attemptState = "finalized";
      persistStudentState();
      document.getElementById("student-pending").hidden = true;
      renderReport(document.getElementById("student-report"), report, roadmap, "student");
    } catch (error) {
      button.disabled = false;
      button.textContent = "검토 결과 다시 확인";
      const pending = document.getElementById("student-pending");
      pending.querySelector("p:last-of-type").textContent = `아직 결과를 열 수 없습니다: ${error.message}`;
    }
  }

  function teacherQuestionSource(row, index) {
    const fromSession = state.items.find(function (item) { return item.itemId === row.itemId; });
    return publicItem(row.item || row.publicItem || fromSession || row, index);
  }

  function renderTeacherQueue(queue) {
    const host = document.getElementById("teacher-review-list");
    host.replaceChildren();
    state.teacherReviews = {};
    queue.forEach(function (row, index) {
      const item = teacherQuestionSource(row, index);
      const article = element("article", "review-item");
      article.dataset.itemId = item.itemId;
      const header = element("header");
      header.append(element("span", "review-number", `${row.slotNumber || item.slotNumber}번`));
      header.append(element("strong", "", `${DOMAIN_LABELS[item.domainId] || item.domainId} · ${item.clusterId}`));
      article.append(header);
      item.promptBlocks.forEach(function (block) { article.append(renderPromptBlock(item, block)); });
      const comparison = element("div", "response-comparison");
      const student = element("section");
      const studentResponse = row.response != null
        ? row.response
        : (row.rawResponse && row.rawResponse.value != null ? row.rawResponse.value : row.rawResponse);
      student.append(element("span", "comparison-label", "학생 응답"), element("p", "student-raw-response", String(studentResponse || "(응답 없음)")));
      const expected = element("section");
      expected.append(element("span", "comparison-label", "기대 근거"), element("p", "", localized(row.expectedResponseByLocale || row.expectedResponse, "루브릭의 관찰 근거를 확인하세요.")));
      comparison.append(student, expected);
      article.append(comparison);
      const rubric = row.rubricDraft || row.rubric;
      if (rubric && Array.isArray(rubric.criteria)) {
        const rubricList = element("ul", "rubric-list");
        rubric.criteria.forEach(function (criterion) {
          const full = Array.isArray(criterion.levels) ? criterion.levels.slice().sort(function (a, b) { return b.points - a.points; })[0] : null;
          rubricList.append(element("li", "", full ? localized(full.observableEvidenceByLocale, criterion.criterionId) : criterion.criterionId));
        });
        article.append(rubricList);
      }
      const controls = element("fieldset", "review-controls");
      controls.append(element("legend", "", "채점과 오류 유형"));
      const scoreSelect = document.createElement("select");
      scoreSelect.setAttribute("aria-label", `${row.slotNumber || item.slotNumber}번 점수`);
      [["", "점수 선택"], ["1", "1점 · 근거 충족"], ["0", "0점 · 보완 필요"]].forEach(function (pair) {
        const option = element("option", "", pair[1]);
        option.value = pair[0];
        scoreSelect.append(option);
      });
      const errorSelect = document.createElement("select");
      errorSelect.disabled = true;
      errorSelect.setAttribute("aria-label", `${row.slotNumber || item.slotNumber}번 오류 유형`);
      const empty = element("option", "", "오류 유형 선택");
      empty.value = "";
      errorSelect.append(empty);
      const allowedErrorTypes = Array.from(new Set((row.errorSignals || []).map(function (signal) { return signal.errorType; }).concat(row.defaultErrorType || [])));
      allowedErrorTypes.forEach(function (errorType) {
        const option = element("option", "", ERROR_LABELS[errorType] || errorType);
        option.value = errorType;
        errorSelect.append(option);
      });
      function updateReview() {
        const awardedPoints = scoreSelect.value === "" ? null : Number(scoreSelect.value);
        errorSelect.disabled = awardedPoints !== 0;
        if (awardedPoints === 1) errorSelect.value = "";
        state.teacherReviews[item.itemId] = { itemId: item.itemId, awardedPoints, errorType: awardedPoints === 0 ? errorSelect.value || null : null };
        updateTeacherReviewStatus();
      }
      scoreSelect.addEventListener("change", updateReview);
      errorSelect.addEventListener("change", updateReview);
      controls.append(scoreSelect, errorSelect);
      article.append(controls);
      if (row.solutionByLocale || row.solution) {
        const details = document.createElement("details");
        details.append(element("summary", "", "교사용 검산 풀이"), element("p", "", localized(row.solutionByLocale || row.solution, "")));
        article.append(details);
      }
      host.append(article);
      state.teacherReviews[item.itemId] = { itemId: item.itemId, awardedPoints: null, errorType: null };
    });
    updateTeacherReviewStatus();
  }

  function completeTeacherReviews() {
    return state.teacherQueue.length === 10 && state.teacherQueue.every(function (row, index) {
      const item = teacherQuestionSource(row, index);
      const review = state.teacherReviews[item.itemId];
      return review && (review.awardedPoints === 1 || (review.awardedPoints === 0 && !!review.errorType));
    });
  }

  function updateTeacherReviewStatus() {
    const completed = Object.values(state.teacherReviews).filter(function (review) {
      return review.awardedPoints === 1 || (review.awardedPoints === 0 && !!review.errorType);
    }).length;
    document.getElementById("teacher-review-status").textContent = `${completed} / 10 검토 완료`;
    document.getElementById("teacher-finalize").disabled = !completeTeacherReviews();
  }

  async function openTeacherReview(event) {
    event.preventDefault();
    const attemptId = document.getElementById("teacher-attempt-id").value.trim();
    const pin = document.getElementById("teacher-pin").value.trim();
    const button = document.getElementById("teacher-open");
    button.disabled = true;
    button.textContent = "응답 확인 중…";
    try {
      const result = await apiRequest("teacher-open", { body: { attemptId, pin } });
      const queue = result.queue || result.teacherReviewQueue || [];
      if (!Array.isArray(queue) || queue.length !== 10) throw new Error("교사 검토 10문항 계약이 맞지 않습니다.");
      state.attemptId = attemptId;
      state.teacherPin = pin;
      state.teacherQueue = queue;
      renderTeacherQueue(queue);
      document.getElementById("teacher-review").hidden = false;
      document.getElementById("teacher-review").scrollIntoView({ behavior: "smooth", block: "start" });
      button.textContent = "응답 다시 불러오기";
      button.disabled = false;
    } catch (error) {
      button.textContent = "검토할 응답 열기";
      button.disabled = !state.runtimeAvailable;
      setRuntimeStatus("error", "교사 검토를 열지 못했습니다", error.message);
    }
  }

  async function finalizeTeacherReview() {
    if (!completeTeacherReviews()) return;
    const button = document.getElementById("teacher-finalize");
    button.disabled = true;
    button.textContent = "분석·처방 후보 계산 중…";
    try {
      const reviews = state.teacherQueue.map(function (row, index) {
        return state.teacherReviews[teacherQuestionSource(row, index).itemId];
      });
      const result = await apiRequest("teacher-finalize", { body: { attemptId: state.attemptId, pin: state.teacherPin, reviews } });
      const report = result.teacherReport || result.report;
      const roadmap = result.teacherRoadmap || result.roadmap;
      renderReport(document.getElementById("teacher-report"), report, roadmap, "teacher");
      document.getElementById("teacher-review").hidden = true;
      if (state.studentToken) {
        state.attemptState = "finalized";
        persistStudentState();
      }
    } catch (error) {
      button.disabled = false;
      button.textContent = "분석·처방 후보 생성";
      document.getElementById("teacher-review-status").textContent = `생성하지 못했습니다: ${error.message}`;
    }
  }

  function resumeStudentUi() {
    if (!state.attemptId || !state.studentToken) return;
    document.getElementById("student-intro").hidden = true;
    if (state.attemptState === "in-progress") {
      document.getElementById("assessment-runner").hidden = false;
      renderQuestion(false);
    } else {
      document.getElementById("student-pending").hidden = false;
      document.getElementById("student-attempt-id").textContent = state.attemptId;
      document.getElementById("teacher-attempt-id").value = state.attemptId;
    }
  }

  async function checkRuntime() {
    const loopbackHosts = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
    const localQaOptIn = new URLSearchParams(window.location.search).get("runtime") === "local-qa";
    if (!loopbackHosts.has(window.location.hostname) || !localQaOptIn) {
      state.runtimeAvailable = false;
      setRuntimeStatus("offline", "공개 안내 모드", "공개 주소에는 문항과 정답이 없습니다. 운영 계정 서버가 연결되기 전에는 실제 응시가 열리지 않습니다.");
      return;
    }
    try {
      const result = await apiRequest("health", { method: "GET" });
      if (result.ok === false) throw new Error(result.message || "진단 서버 준비가 끝나지 않았습니다.");
      if (!result.releaseGate || result.releaseGate.qaOnly !== true || result.releaseGate.studentOperationAuthorized !== false) {
        throw new Error("검수 잠금 상태를 확인할 수 없습니다.");
      }
      state.runtimeAvailable = true;
      setRuntimeStatus("ready", "비공개 QA 흐름 준비됨", "42문항 전달, 자동채점, 교사 검토, 분석·처방을 이 컴퓨터에서 검수할 수 있습니다. 42문항은 독립 승인 전이므로 실제 학생 운영은 잠겨 있습니다.");
      document.getElementById("student-start").disabled = false;
      document.getElementById("teacher-open").disabled = false;
      resumeStudentUi();
    } catch (_) {
      state.runtimeAvailable = false;
      setRuntimeStatus("offline", "공개 안내 모드", "이 주소에는 문항과 정답이 없습니다. 로컬 진단 서버 또는 운영 계정 서버를 연결하면 실제 응시가 열립니다.");
    }
  }

  document.addEventListener("click", function (event) {
    const target = event.target.closest("[data-workspace-role]");
    if (!target) return;
    if (target.tagName === "A") event.preventDefault();
    setWorkspaceRole(target.dataset.workspaceRole, target.getAttribute("role") === "tab");
    document.getElementById("run").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.addEventListener("keydown", function (event) {
    if (event.target.matches('.workspace-tabs [role="tab"]')) moveWorkspaceFocus(event);
  });
  document.getElementById("student-start").addEventListener("click", startStudentAttempt);
  document.getElementById("question-prev").addEventListener("click", async function () {
    await saveCurrent(true);
    state.currentIndex = Math.max(0, state.currentIndex - 1);
    persistStudentState();
    renderQuestion(true);
  });
  document.getElementById("question-next").addEventListener("click", async function () {
    await saveCurrent(true);
    state.currentIndex = Math.min(state.items.length - 1, state.currentIndex + 1);
    persistStudentState();
    renderQuestion(true);
  });
  document.getElementById("question-overview-toggle").addEventListener("click", function () {
    const overview = document.getElementById("question-overview");
    overview.hidden = !overview.hidden;
    this.setAttribute("aria-expanded", String(!overview.hidden));
  });
  document.getElementById("assessment-submit").addEventListener("click", submitAssessment);
  document.getElementById("student-result-refresh").addEventListener("click", refreshStudentResult);
  document.getElementById("teacher-entry-form").addEventListener("submit", openTeacherReview);
  document.getElementById("teacher-finalize").addEventListener("click", finalizeTeacherReview);
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("printing-report");
    document.querySelectorAll('[data-print-target="true"]').forEach(function (node) { delete node.dataset.printTarget; });
  });

  restoreStudentState();
  setWorkspaceRole("student", false);
  checkRuntime();
})();
