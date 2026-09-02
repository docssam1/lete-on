(function () {
  "use strict";

  const fallbackDomains = Object.freeze([
    Object.freeze({ id: "numbers", title: "수와 연산", description: "수 감각, 계산 구조, 분수·비와 단위의 관계를 확인합니다." }),
    Object.freeze({ id: "algebra", title: "규칙과 대수적 사고", description: "패턴을 찾고 관계를 식·표·말로 바꾸는 힘을 기릅니다." }),
    Object.freeze({ id: "geometry", title: "도형과 공간", description: "그림을 읽고 길이·각·넓이·공간 관계를 추론합니다." }),
    Object.freeze({ id: "logic", title: "경우의 수와 논리", description: "조건을 정리하고 빠짐없이 세며 반례를 점검합니다." }),
    Object.freeze({ id: "data", title: "자료와 불확실성", description: "표·그래프·확률 상황에서 필요한 정보를 골라 판단합니다." }),
    Object.freeze({ id: "strategy", title: "문제해결 전략", description: "표현 바꾸기, 그림 그리기, 거꾸로 풀기와 시간 배분을 연습합니다." })
  ]);

  const goals = Object.freeze({
    "first-attempt": Object.freeze({
      title: "첫 도전 · 형식과 기초를 먼저 확인",
      description: "영역별 시작점을 확인하고, 읽기·계산·표현의 기본 루틴을 만듭니다.",
      diagnostic: "학년별 기초·표현·추론 준비 진단",
      diagnosticDescription: "6개 영역에서 시작점을 확인한 뒤, 분석·클리닉·개념 학습·맞춤 워크북·재확인 순서를 설계하는 구조입니다. 실제 진단 문항과 워크북은 검수 잠금 상태입니다.",
      journeyDetails: [
        "학년·목표에 맞는 시작 근거를 확인합니다.",
        "영역과 문항 반응을 나누어 읽습니다.",
        "읽기·계산·표현에서 먼저 고칠 지점을 정합니다.",
        "필요한 기초 표현과 개념을 다시 연결합니다.",
        "짧은 분량의 개인별 적용 계획을 설계합니다.",
        "다음 학습 전 준비 상태를 다시 확인합니다."
      ]
    }),
    "skill-growth": Object.freeze({
      title: "실력 성장 · 약점을 수업으로 바꾸기",
      description: "선수개념·계산·표현·전략을 나누어 살피고, 먼저 보정할 순서를 정합니다.",
      diagnostic: "영역·오류 유형 준비 진단",
      diagnosticDescription: "약점 영역과 오류 유형을 분리해, 클리닉·개념 학습·맞춤 워크북·재확인 순서를 설계하는 구조입니다. 실제 진단 문항과 워크북은 검수 잠금 상태입니다.",
      journeyDetails: [
        "현재 영역별 준비 상태를 진단합니다.",
        "영역별 반응과 문항별 오류 유형을 분리합니다.",
        "선수개념·계산·표현·전략의 약점을 처방합니다.",
        "약점과 연결된 개념을 학습 순서로 제시합니다.",
        "학습 분량과 난이도를 개인별로 조정합니다.",
        "보정 뒤 변화와 다음 우선순위를 확인합니다."
      ]
    }),
    "award-target": Object.freeze({
      title: "수상 목표 · 시간과 전이까지 훈련",
      description: "공식 수상 기준을 GFIELD가 보장하지 않습니다. 다만 정확도·시간·낯선 문제 전이를 분리해 훈련합니다.",
      diagnostic: "정확도·시간·전이 준비 진단",
      diagnosticDescription: "정답률 하나가 아닌 풀이 시간, 전략 선택, 낯선 상황 전이를 함께 확인해 클리닉·개념 학습·맞춤 워크북·재확인 순서를 설계하는 구조입니다. 실제 진단 문항과 워크북은 검수 잠금 상태입니다.",
      journeyDetails: [
        "정확도·시간·전이의 현재 근거를 확인합니다.",
        "영역과 문항별로 시간·전략·오류를 분석합니다.",
        "시간 압박과 전략 선택의 병목을 보정합니다.",
        "낯선 문제에 적용할 핵심 개념을 다룹니다.",
        "목표 난이도와 시간 조건에 맞춰 계획합니다.",
        "변화 근거를 확인해 다음 훈련을 조정합니다."
      ]
    }),
    "amc-bridge": Object.freeze({
      title: "AMC 연결 · 더 긴 문제해결 가교",
      description: "SASMO 준비를 학교 수학과 AMC로 자연스럽게 잇습니다. 대회 자격과 GFIELD의 준비 권장은 별도입니다.",
      diagnostic: "전이·심화 가교 진단",
      diagnosticDescription: "SASMO 준비에서 확인한 논리·대수·기하 전략을 분석해 클리닉·개념 학습·맞춤 워크북·재확인 순서로 상위 문제해결 학습을 설계하는 구조입니다. 실제 진단 문항과 워크북은 검수 잠금 상태입니다.",
      journeyDetails: [
        "상위 문제해결로의 전이 준비 상태를 확인합니다.",
        "영역과 문항별로 논리·대수·기하 전략을 분석합니다.",
        "가교에 필요한 선수개념과 전략 약점을 보정합니다.",
        "학교 수학과 심화 문제를 잇는 개념을 학습합니다.",
        "전이 난이도에 맞춘 개인별 적용 계획을 설계합니다.",
        "가교 준비와 다음 학습 경로를 다시 확인합니다."
      ]
    })
  });

  const journeySteps = Object.freeze([
    "진단",
    "영역·문항 분석",
    "약점 클리닉",
    "개념 학습",
    "맞춤 워크북",
    "재확인"
  ]);

  const roles = Object.freeze({
    student: Object.freeze({
      kicker: "학생용 · 오늘의 학습",
      title: "오늘의 다음 학습을 한눈에",
      description: "학년·목표·진단 근거를 바탕으로 개념 확인, 짧은 연습, 오류 복습을 순서대로 봅니다.",
      features: ["오늘의 20~35분 학습 흐름", "영역별 준비 지도", "틀린 이유를 고르는 복습", "교사 확인 전의 다음 행동"]
    }),
    teacher: Object.freeze({
      kicker: "교사용 · 근거와 배정",
      title: "진단 근거를 수업 그룹과 배정으로 연결합니다.",
      description: "교사는 영역·오류 유형·시간 근거를 보고 보정, 핵심, 심화 그룹을 구성하고 과제를 검토합니다.",
      features: ["학년·목표별 진단 설계", "오류 유형과 선수개념 근거", "수업 그룹·과제 배정 검토", "유지 확인 후 다음 단계 승인"]
    })
  });

  const query = new URLSearchParams(window.location.search);
  const requestedArchiveGrade = String(query.get("grade") || "").toLowerCase();
  const requestedGrade = Number(requestedArchiveGrade);
  const requestedK2 = requestedArchiveGrade === "k2" || requestedArchiveGrade === "0";
  const state = {
    level: Number.isInteger(requestedGrade) && requestedGrade >= 1 && requestedGrade <= 12 ? `G${requestedGrade}` : "K2",
    archiveGrade: requestedArchiveGrade === "all" ? "all" : requestedK2 ? "K2" : Number.isInteger(requestedGrade) && requestedGrade >= 1 && requestedGrade <= 12 ? String(requestedGrade) : "6",
    goal: "first-attempt",
    diagnosticYear: 2020,
    role: "student"
  };
  const levels = Object.freeze(["K2", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"]);
  const archiveAssetLabels = Object.freeze({
    p: "문제",
    s: "해설",
    ps: "문제+해설",
    a: "정답",
    pa: "문제+정답",
    "official-lms": "공식 LMS"
  });
  let publicArchive = null;

  function text(value) { return String(value || ""); }
  function levelLabel(level) {
    const value = String(level);
    return value === "K2" ? "K2" : value.replace(/^G?/, "G");
  }
  function getArchitecture() {
    return window.GFIELDSASMOProgramArchitecture || window.GFIELDSasmoProgramArchitecture || window.GFIELDSASMOArchitecture || null;
  }
  function officialLinkForLevel(level) {
    const links = window.GFIELDCompetitionOriginalLinks;
    if (!links || typeof links.findForGrade !== "function") return null;
    const gradeKey = /^G(\d+)$/.test(String(level)) ? Number(String(level).slice(1)) : level;
    const matches = links.findForGrade("sasmo-k2-8", gradeKey);
    return matches && matches[0] ? matches[0] : null;
  }
  function domainsForArchitecture() {
    const architecture = getArchitecture();
    const candidates = architecture && architecture.architecture && architecture.architecture.axes;
    if (!Array.isArray(candidates) || candidates.length !== 6) return fallbackDomains;
    const usable = candidates.map(function (entry, index) {
      const fallback = fallbackDomains[index];
      return {
        id: text(entry.id || fallback.id).replace(/[^a-z0-9-]/gi, "") || fallback.id,
        title: fallback.title,
        description: fallback.description
      };
    });
    return usable.every(function (entry) { return entry.id; }) ? usable : fallbackDomains;
  }
  function renderDomains() {
    const container = document.getElementById("domain-grid");
    container.replaceChildren();
    domainsForArchitecture().forEach(function (domain, index) {
      const article = document.createElement("article");
      article.className = "domain-card";
      article.dataset.domain = domain.id;
      const number = document.createElement("span");
      number.className = "domain-number";
      number.textContent = `DOMAIN 0${index + 1}`;
      const title = document.createElement("h3");
      title.textContent = domain.title;
      const description = document.createElement("p");
      description.textContent = domain.description;
      article.append(number, title, description);
      container.append(article);
    });
  }
  function renderLevels() {
    const container = document.getElementById("level-selector");
    container.replaceChildren();
    levels.forEach(function (level) {
      const button = document.createElement("button");
      button.type = "button";
      button.id = `level-${level}`;
      button.dataset.level = String(level);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "level-help");
      button.setAttribute("aria-selected", String(String(level) === state.level));
      button.tabIndex = String(level) === state.level ? 0 : -1;
      button.textContent = levelLabel(level);
      container.append(button);
    });
  }
  function updateOfficialLink() {
    const link = officialLinkForLevel(state.level);
    const anchor = document.getElementById("official-sasmo-link");
    const help = document.getElementById("level-help");
    const architecture = getArchitecture();
    const format = architecture && typeof architecture.getOfficialFormat === "function"
      ? architecture.getOfficialFormat(state.level)
      : null;
    const heroFormat = document.getElementById("hero-format");
    if (heroFormat) {
      heroFormat.textContent = format
        ? `공식 형식 · ${format.questionCount}문항 · ${format.durationMinutes}분`
        : "공식 형식 · 주최기관 확인 필요";
    }
    if (link && link.organizerHostedUrl) {
      anchor.href = link.organizerHostedUrl;
      const coverage = text(link.coverageLabelKo || link.coverageLabel);
      help.textContent = `${levelLabel(state.level)} · ${coverage}. 공식 사이트에서 접근 조건을 직접 확인합니다.`;
    } else {
      anchor.href = "https://sasmo.simcc.org/";
      help.textContent = `${levelLabel(state.level)} · 공식 SASMO 사이트에서 해당 학년의 참가·자료 제공 여부를 직접 확인합니다.`;
    }
  }
  function renderJourney() {
    const goal = goals[state.goal];
    const container = document.getElementById("journey-list");
    container.replaceChildren();
    journeySteps.forEach(function (title, index) {
      const item = document.createElement("li");
      const heading = document.createElement("h3");
      const detail = document.createElement("p");
      heading.textContent = title;
      detail.textContent = goal.journeyDetails[index];
      item.append(heading, detail);
      container.append(item);
    });
    document.getElementById("diagnostic-title").textContent = `${levelLabel(state.level)} · ${goal.diagnostic}`;
    document.getElementById("diagnostic-description").textContent = goal.diagnosticDescription;
    const heroLevel = document.getElementById("hero-level-label");
    const heroAction = document.getElementById("hero-action-text");
    if (heroLevel) heroLevel.textContent = levelLabel(state.level);
    if (heroAction) heroAction.textContent = `${levelLabel(state.level)} ${goal.title.split(" · ")[0]} 목표에 맞춰 준비 진단의 첫 단계를 정리합니다.`;
  }
  function renderSourceInventory() {
    const api = window.GFIELDSASMOSourceInventory;
    const recordCount = document.getElementById("k12-record-count");
    const assetCount = document.getElementById("k12-asset-count");
    const topicCount = document.getElementById("edugain-topic-count");
    if (!api || !api.inventory || !api.validatePublicInventory(api.inventory).valid) {
      recordCount.textContent = "잠금";
      assetCount.textContent = "잠금";
      topicCount.textContent = "잠금";
      return;
    }
    const aggregate = api.inventory.k12HistoricalAggregate;
    recordCount.textContent = String(aggregate.indexRecordCount);
    assetCount.textContent = String(aggregate.physicalPdfCount);
    topicCount.textContent = String(api.inventory.edugainComparativeAggregate.selectableDomTopicNodeCount);
  }

  function getDiagnosticFoundation() {
    return window.GFIELDSASMODiagnosticFoundation || null;
  }

  function renderDiagnosticEvidence() {
    const api = getDiagnosticFoundation();
    const select = document.getElementById("diagnostic-year");
    const title = document.getElementById("diagnostic-readiness-title");
    const detail = document.getElementById("diagnostic-readiness");
    const sourceLink = document.getElementById("diagnostic-source-link");
    const workflow = document.getElementById("diagnostic-workflow");
    if (!api || !api.validateFoundation || !api.validateFoundation().valid) {
      title.textContent = "기출 진단 기준을 불러오지 못했습니다.";
      detail.textContent = "원문과 답안 근거가 확인될 때까지 해당 진단은 잠금 상태입니다.";
      return;
    }
    select.replaceChildren();
    api.YEAR_IDS.forEach(function (year) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = `${year} SASMO`;
      select.append(option);
    });
    select.value = String(state.diagnosticYear);
    const readiness = api.getDiagnosticReadiness(state.diagnosticYear, state.level);
    const source = api.getYearSource(state.diagnosticYear);
    sourceLink.href = source.sourcePageUrl;
    if (readiness.available) {
      title.textContent = `${state.diagnosticYear} · ${levelLabel(state.level)} 기출 진단 준비 가능`;
      detail.textContent = "공식 원문·답·해설 접근 경로가 확인되었습니다. 교사용 검수에서 문항별 페이지·답안 근거·영역 태그를 기록한 뒤에만 실제 분석 결과를 생성합니다.";
    } else {
      title.textContent = `${state.diagnosticYear} · ${levelLabel(state.level)} 원문 기반 진단은 잠금`;
      detail.textContent = "이 연도·학년에는 공식 답·해설 접근 근거를 아직 선언하지 않았습니다. 다른 학년 기출로 대체하지 않으며, 필요 시 GFIELD 자체 제작 진단을 별도 구성합니다.";
    }
    workflow.replaceChildren();
    api.foundation.workflow.forEach(function (step, index) {
      const item = document.createElement("li");
      const number = document.createElement("span");
      const label = document.createElement("strong");
      const output = document.createElement("p");
      number.textContent = `0${index + 1}`;
      label.textContent = step.id.replace(/-/g, " ");
      output.textContent = step.output;
      item.append(number, label, output);
      workflow.append(item);
    });
  }

  function validPublicArchive(data) {
    if (!data || !data.coverage || !Array.isArray(data.records) || !Array.isArray(data.officialLmsRecords)) return false;
    if (data.coverage.recordCount !== data.records.length || data.coverage.assetCount !== 144 || data.coverage.officialLmsRecordCount !== data.officialLmsRecords.length) return false;
    const sourceHostedRecordsAreValid = data.records.every(function (record) {
      if (!Number.isInteger(record.year) || !Number.isInteger(record.grade) || !Array.isArray(record.assets)) return false;
      try {
        const sourcePage = new URL(record.sourcePageUrl);
        if (sourcePage.protocol !== "https:" || sourcePage.hostname !== "www.k12mathcontests.com") return false;
        return record.assets.every(function (asset) {
          const file = new URL(asset.url);
          return Object.prototype.hasOwnProperty.call(archiveAssetLabels, asset.type)
            && file.protocol === "https:"
            && file.hostname === "files.k12mathcontests.com";
        });
      } catch (error) {
        return false;
      }
    });
    const officialLmsRecordsAreValid = data.officialLmsRecords.every(function (record) {
      try {
        const source = new URL(record.url);
        return record.grade === 11
          && Number.isInteger(record.year)
          && source.protocol === "https:"
          && source.hostname === "sasmo.simcc.org"
          && typeof record.access === "string";
      } catch (error) {
        return false;
      }
    });
    return sourceHostedRecordsAreValid && officialLmsRecordsAreValid;
  }

  function renderArchiveFilter() {
    const filter = document.getElementById("archive-grade-filter");
    filter.replaceChildren();
    const all = document.createElement("option");
    all.value = "all";
    all.textContent = "전체 학년";
    filter.append(all);
    const kindergarten = document.createElement("option");
    kindergarten.value = "K2";
    kindergarten.textContent = "K2";
    filter.append(kindergarten);
    for (let grade = 1; grade <= 12; grade += 1) {
      const option = document.createElement("option");
      option.value = String(grade);
      option.textContent = `Grade ${grade}`;
      filter.append(option);
    }
    filter.value = state.archiveGrade;
  }

  function archiveLink(asset, record) {
    const anchor = document.createElement("a");
    anchor.className = `archive-file-link archive-file-${asset.type}`;
    anchor.href = asset.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.dataset.fileType = asset.type;
    anchor.textContent = archiveAssetLabels[asset.type];
    const pageLabel = Number.isInteger(asset.pages) ? `, ${asset.pages}쪽` : "";
    const accessLabel = asset.access ? `, ${asset.access}` : "";
    anchor.setAttribute("aria-label", `${record.year} Grade ${record.grade} ${archiveAssetLabels[asset.type]}${pageLabel}${accessLabel}`);
    return anchor;
  }

  function visibleArchiveRecords() {
    if (!publicArchive) return [];
    const sourceHosted = publicArchive.records.map(function (record) {
      return { ...record, sourceKind: "source-hosted-pdf", sourceLabel: "자료 페이지 ↗" };
    });
    const officialLms = publicArchive.officialLmsRecords.map(function (record) {
      return {
        id: record.id,
        year: record.year,
        grade: record.grade,
        division: "Official LMS",
        sourcePageUrl: record.url,
        sourceKind: "official-lms",
        sourceLabel: "공식 LMS ↗",
        assets: [{ type: "official-lms", url: record.url, access: record.access }]
      };
    });
    return sourceHosted.concat(officialLms).filter(function (record) {
      return state.archiveGrade === "all" || String(record.grade) === state.archiveGrade;
    });
  }

  function renderPublicArchive() {
    if (!publicArchive) return;
    const list = document.getElementById("archive-year-list");
    const summary = document.getElementById("archive-summary");
    const status = document.getElementById("archive-status");
    const records = visibleArchiveRecords();
    const yearGroups = records.reduce(function (groups, record) {
      const key = String(record.year);
      if (!groups[key]) groups[key] = [];
      groups[key].push(record);
      return groups;
    }, {});
    const assetCount = records.reduce(function (total, record) { return total + record.assets.length; }, 0);
    const gradeLabel = state.archiveGrade === "all" ? "전체 학년" : state.archiveGrade === "K2" ? "K2" : `Grade ${state.archiveGrade}`;
    summary.textContent = `${gradeLabel} · ${records.length}개 연도·학년 묶음 · 연결 자료 ${assetCount}개`;
    status.textContent = records.length ? "아래에서 연도와 자료 종류를 고르세요." : `${gradeLabel}의 확인된 과거 원문 링크는 현재 자료실에 없습니다. 공식 SASMO 안내에서 제공 여부를 확인해 주세요.`;
    list.replaceChildren();
    if (!records.length) {
      const unavailable = document.createElement("article");
      unavailable.className = "archive-unavailable";
      const title = document.createElement("strong");
      const detail = document.createElement("p");
      const official = document.createElement("a");
      title.textContent = `${gradeLabel} 과거 원문 미확보`;
      detail.textContent = "확인하지 못한 기출을 다른 학년 자료로 대체하거나 임의로 만들어 넣지 않습니다.";
      official.href = "https://sasmo.simcc.org/";
      official.target = "_blank";
      official.rel = "noopener noreferrer";
      official.textContent = "SIMCC SASMO 공식 안내 ↗";
      unavailable.append(title, detail, official);
      list.append(unavailable);
    }
    Object.keys(yearGroups).sort(function (left, right) { return Number(right) - Number(left); }).forEach(function (year) {
      const section = document.createElement("section");
      section.className = "archive-year-card";
      section.dataset.archiveYear = year;
      const header = document.createElement("header");
      const title = document.createElement("h3");
      const count = document.createElement("span");
      title.textContent = year;
      count.textContent = `${yearGroups[year].length}개 학년`;
      header.append(title, count);
      const rows = document.createElement("div");
      rows.className = "archive-records";
      yearGroups[year].forEach(function (record) {
        const row = document.createElement("div");
        row.className = "archive-record-row";
        row.dataset.archiveRecord = record.id;
        const label = document.createElement("div");
        label.className = "archive-record-label";
        const grade = document.createElement("strong");
        const division = document.createElement("small");
        grade.textContent = `Grade ${record.grade}`;
        division.textContent = record.sourceKind === "official-lms"
          ? "Official LMS · 로그인 또는 등록이 필요할 수 있음"
          : record.division.startsWith("primary") ? `Primary ${record.division.replace("primary", "")}` : `Secondary ${record.division.replace("secondary", "")}`;
        label.append(grade, division);
        const links = document.createElement("div");
        links.className = "archive-file-links";
        record.assets.forEach(function (asset) { links.append(archiveLink(asset, record)); });
        const source = document.createElement("a");
        source.className = "archive-record-source";
        source.href = record.sourcePageUrl;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.textContent = record.sourceLabel;
        row.append(label, links, source);
        rows.append(row);
      });
      section.append(header, rows);
      list.append(section);
    });
    list.dataset.ready = "true";
  }

  async function loadPublicArchive() {
    const status = document.getElementById("archive-status");
    try {
      const response = await fetch("./competition/sasmo-k12-public-archive.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!validPublicArchive(data)) throw new Error("invalid archive metadata");
      publicArchive = data;
      renderArchiveFilter();
      renderPublicArchive();
    } catch (error) {
      status.textContent = "연도별 자료 목록을 불러오지 못했습니다. 아래 원본 색인에서 확인해 주세요.";
      document.getElementById("archive-year-list").dataset.ready = "error";
    }
  }
  function updateGoal(goalId) {
    if (!goals[goalId]) return;
    state.goal = goalId;
    document.querySelectorAll("[data-goal]").forEach(function (button) {
      const selected = button.dataset.goal === goalId;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const active = document.getElementById(`goal-${goalId}`);
    document.getElementById("goal-detail").setAttribute("aria-labelledby", active.id);
    document.getElementById("goal-title").textContent = goals[goalId].title;
    document.getElementById("goal-description").textContent = goals[goalId].description;
    renderJourney();
  }
  function updateLevel(level) {
    if (!levels.some(function (candidate) { return String(candidate) === String(level); })) return;
    state.level = String(level);
    renderLevels();
    updateOfficialLink();
    renderJourney();
    renderDiagnosticEvidence();
  }
  function updateRole(roleId) {
    if (!roles[roleId]) return;
    state.role = roleId;
    document.querySelectorAll("[data-role]").forEach(function (button) {
      const selected = button.dataset.role === roleId;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const role = roles[roleId];
    const active = document.getElementById(`role-${roleId}`);
    document.getElementById("role-panel").setAttribute("aria-labelledby", active.id);
    document.getElementById("role-kicker").textContent = role.kicker;
    document.getElementById("role-title").textContent = role.title;
    document.getElementById("role-description").textContent = role.description;
    const features = document.getElementById("role-features");
    features.replaceChildren();
    role.features.forEach(function (feature) {
      const item = document.createElement("li");
      item.textContent = feature;
      features.append(item);
    });
  }
  function moveTab(event, selector, updater, dataName) {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const buttons = Array.from(document.querySelectorAll(selector));
    const current = buttons.indexOf(event.target);
    if (current < 0) return;
    event.preventDefault();
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = buttons.length - 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + buttons.length) % buttons.length;
    else next = (current + 1) % buttons.length;
    buttons[next].focus();
    updater(buttons[next].dataset[dataName]);
  }
  function bindEvents() {
    document.addEventListener("click", function (event) {
      const level = event.target.closest("[data-level]");
      const goal = event.target.closest("[data-goal]");
      const role = event.target.closest("[data-role]");
      if (level) updateLevel(level.dataset.level);
      if (goal) updateGoal(goal.dataset.goal);
      if (role) updateRole(role.dataset.role);
    });
    document.getElementById("archive-grade-filter").addEventListener("change", function (event) {
      state.archiveGrade = event.target.value;
      const url = new URL(window.location.href);
      if (state.archiveGrade === "all") url.searchParams.set("grade", "all");
      else url.searchParams.set("grade", state.archiveGrade);
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      renderPublicArchive();
    });
    document.getElementById("diagnostic-year").addEventListener("change", function (event) {
      state.diagnosticYear = Number(event.target.value);
      renderDiagnosticEvidence();
    });
    document.addEventListener("keydown", function (event) {
      if (event.target.matches("[data-level]")) moveTab(event, "[data-level]", updateLevel, "level");
      if (event.target.matches("[data-goal]")) moveTab(event, "[data-goal]", updateGoal, "goal");
      if (event.target.matches("[data-role]")) moveTab(event, "[data-role]", updateRole, "role");
    });
  }
  function initialize() {
    renderDomains();
    renderSourceInventory();
    renderDiagnosticEvidence();
    loadPublicArchive();
    renderLevels();
    updateOfficialLink();
    updateGoal(state.goal);
    updateRole(state.role);
    bindEvents();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
