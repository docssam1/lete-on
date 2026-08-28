(function () {
  "use strict";

  const catalog = window.GFIELDMathProgramCatalog;
  const profiles = window.GFIELDK12CompetitionProfiles || window.GFIELDK8CompetitionProfiles;
  const originalLinks = window.GFIELDCompetitionOriginalLinks;
  const spine = window.GFIELDUSK8DomainSpine;
  const registry = window.GFIELDUSK8ContentRegistry;

  if (!catalog || !profiles || !originalLinks || !spine || !registry) {
    throw new Error("GFIELD home dependencies did not load");
  }

  const state = {
    goalId: "sasmo",
    officialGradeKey: "6",
    mapGrade: "6",
    roleId: "student"
  };

  const goalDefinitions = {
    school: {
      programId: "us-core-k8",
      type: "학교 준비 경로",
      title: function (grade) { return `${gradeName(grade)} 학교 수학`; },
      summary: "재학 학년과 실제 실력은 다를 수 있습니다. K–8은 영역별 앵커로, G9–12는 학교가 설정한 과정 순서로 선수개념·현재 핵심·다음 과정을 연결합니다.",
      grades: ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      eligibility: "미국 K–12 · 과정 순서와 승급 정책은 학교별 설정",
      route: "전체 진단 → 영역 지도 → 보정 수업 → 단원 숙달 → 유지 확인",
      tone: "#183246"
    },
    singapore: {
      programId: "singapore-mastery",
      type: "학습법·숙달 경로",
      title: function (grade) { return `싱가포르식 숙달 · ${gradeName(grade)}`; },
      summary: "개념과 모델로 이해한 뒤 충분히 연습하고, 오류를 성찰하고, 새로운 비정형 상황으로 확장한 다음 오래 남았는지 다시 확인합니다.",
      grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      eligibility: "G1–8 구현 기반 · G9–12 교차표와 학교 설정은 검수 대기",
      route: "개념/모델 → 동기화 연습 → 성찰 복습 → 확장 학습 → 유지 확인",
      tone: "#245847"
    },
    kangaroo: {
      programId: "math-kangaroo-1-8",
      type: "대회 목표",
      title: function (grade) { return `Math Kangaroo · ${gradeName(grade)} 준비`; },
      summary: "공식 두 학년 밴드의 범위와 3·4·5점 구간을 확인하고, 현재 학년의 수학 기초 위에 시각·논리·비정형 문제와 시간 전략을 더합니다.",
      grades: ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      route: "학년 밴드 확인 → 준비 진단 → 점수 구간별 훈련 → 공식 형식 모의",
      tone: "#773f37"
    },
    sasmo: {
      programId: "sasmo-k2-8",
      type: "대회 목표",
      title: function (grade) { return `SASMO · ${gradeName(grade)} 준비`; },
      summary: "학년별 공식 형식을 확인한 뒤 주최기관의 영어 원문, 학교 수학의 선수개념, 비정형 추론과 시간 전략을 함께 연결합니다.",
      grades: ["K2", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      route: "학년 확인 → 공식 영어 원문 → 결과 기록 → 영역·감점·시간 분석 → 맞춤 수업",
      tone: "#304b72"
    },
    amc: {
      programId: "amc-8",
      programIdForGrade: function (grade) {
        const numericGrade = Number(grade);
        if (numericGrade <= 8) return "amc-8";
        if (numericGrade <= 10) return "amc-10";
        return "amc-12";
      },
      type: "대회 목표",
      title: function (grade) {
        const numericGrade = Number(grade);
        const stage = numericGrade <= 8 ? 8 : numericGrade <= 10 ? 10 : 12;
        return `AMC ${stage} · ${gradeName(grade)} 권장 경로`;
      },
      summary: "선택 학년에 맞춰 AMC 8·10·12 권장 단계를 보여주고, 공식 참가 자격과 GFIELD의 권장 준비 학년을 분리해 안내합니다.",
      grades: [6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      route: "공식 자격 확인 → 학교 과정 진단 → AMC 영역 훈련 → 공식 시간 모의 → 전략 복기",
      tone: "#633a48"
    }
  };

  const rolePreviews = {
    student: {
      eyebrow: "STUDENT · TODAY · SAMPLE",
      title: "오늘 해야 할 한 가지가 먼저 보입니다.",
      description: "현재 위치와 목표를 연결해 다음 수업, 연습, 유지 확인을 한 화면에 보여줍니다.",
      nav: ["오늘", "내 스킬 지도", "학습·재확인", "경시 도전", "성장 기록"],
      panel: [
        '<div class="mini-product-top"><span>샘플 오늘의 경로</span><b>32분</b></div>',
        '<div class="mini-task primary-task"><small>01 · 개념</small><strong>비를 bar model로 표현하기</strong><span>12분 · Guided</span></div>',
        '<div class="mini-task"><small>02 · 적용</small><strong>같은 비, 다른 표현 6문제</strong><span>10분 · Practice</span></div>',
        '<div class="mini-task"><small>03 · 도전</small><strong>SASMO 형식 자체 문항</strong><span>10분 · Challenge</span></div>'
      ].join("")
    },
    teacher: {
      eyebrow: "TEACHER · CLASS EVIDENCE · SAMPLE",
      title: "점수표를 수업 그룹으로 바꿉니다.",
      description: "문항·스킬·오류 근거를 보고 학생을 보정, 핵심, 심화 그룹으로 묶고 다음 과제와 유지 확인을 승인합니다.",
      nav: ["학급", "진단", "스킬 히트맵", "배정·개입", "유지 확인", "리포트"],
      panel: [
        '<div class="mini-product-top"><span>샘플 Grade 6 · 18명</span><b>검토 4건</b></div>',
        '<div class="mini-task primary-task"><small>보정 그룹 · 5명</small><strong>비와 비례 선수개념</strong><span>배정 검토</span></div>',
        '<div class="mini-task"><small>핵심 그룹 · 9명</small><strong>식과 방정식 다중 표현</strong><span>유지 확인 D+7</span></div>',
        '<div class="mini-task"><small>심화 그룹 · 4명</small><strong>SASMO 비정형 전이</strong><span>해설 검수 대기</span></div>'
      ].join("")
    }
  };

  function gradeName(grade) {
    if (String(grade) === "K2") return "K2";
    if (String(grade) === "K") return "Kindergarten";
    return `Grade ${grade}`;
  }

  function gradeShort(grade) {
    if (String(grade) === "K" || String(grade) === "K2") return String(grade);
    return `G${grade}`;
  }

  function findProgram(programId) {
    return catalog.programs.find(function (program) { return program.id === programId; });
  }

  function findProfile(programId) {
    return profiles.profiles.find(function (profile) { return profile.programId === programId; });
  }

  function resolveProgramId(definition, grade) {
    return typeof definition.programIdForGrade === "function"
      ? definition.programIdForGrade(grade)
      : definition.programId;
  }

  function sameGrade(left, right) {
    return String(left) === String(right);
  }

  function profileFacts(goalId, grade) {
    const definition = goalDefinitions[goalId];
    const programId = resolveProgramId(definition, grade);
    const profile = findProfile(programId);
    if (goalId === "school") {
      return Number(grade) >= 9
        ? { eligibility: definition.eligibility, format: "G9–12 과정별 진단 청사진 · 학교 course sequence 설정 후 확정" }
        : { eligibility: definition.eligibility, format: "전체 배치 36–60문항 · 4개 이상 영역 · 교사 검토" };
    }
    if (goalId === "singapore") {
      return {
        eligibility: definition.eligibility,
        format: Number(grade) >= 9 ? "G9–12 교차표·수업 자료 검수 대기" : "개념·기능·과정·메타인지·태도 · 재검증 포함"
      };
    }
    if (goalId === "kangaroo" && profile) {
      const paperGrade = String(grade) === "K" ? 1 : Number(grade);
      const band = profile.paperBands.find(function (entry) { return entry.grades.includes(paperGrade); });
      return {
        eligibility: String(grade) === "K" ? "K는 독립적으로 읽고 풀 수 있을 때 Grade 1 시험지" : "공식 G1–12 · 학년별 순위는 분리",
        format: `${profile.durationMinutes}분 · ${band.questionCount}문항 · ${band.maxScore}점 · 3/4/5점 구간 · 오답 감점 없음`
      };
    }
    if (goalId === "sasmo" && profile) {
      const format = profile.formats.find(function (entry) {
        return entry.gradeKeys.some(function (key) { return sameGrade(key, grade); });
      });
      const penalty = format.sections[0].wrongPoints < 0 ? `Section A 오답 ${format.sections[0].wrongPoints}점` : "오답 감점 없음";
      return {
        eligibility: "공식 K2·G1–12 · 학년별 다른 시험지",
        format: `${format.durationMinutes}분 · ${format.questionCount}문항 · 시작 ${format.startingPoints}점 · 최대 ${format.maxScore}점 · ${penalty}`
      };
    }
    if (goalId === "amc" && profile) {
      const recommended = profile.gfieldPreparationGrades.map(function (value) { return `G${value}`; }).join("–");
      return {
        eligibility: `공식 G${profile.officialEligibility.gradeMaximum} 이하·${profile.officialEligibility.ageExclusiveMaximum}세 미만 · GFIELD 권장 ${recommended}`,
        format: `${profile.durationMinutes}분 · ${profile.questionCount}문항 · 5지선다 · 계산기 금지`
      };
    }
    return { eligibility: "공식 정보 확인 필요", format: "형식 정보 확인 필요" };
  }

  function populateGoalGrades(definition, selectedGrade) {
    const select = document.getElementById("goal-grade-select");
    select.innerHTML = definition.grades.map(function (grade) {
      return `<option value="${grade}"${sameGrade(grade, selectedGrade) ? " selected" : ""}>${gradeName(grade)}</option>`;
    }).join("");
  }

  function setOriginalLink(definition, grade) {
    const anchor = document.getElementById("goal-original");
    const status = document.getElementById("goal-status-note");
    const rights = document.getElementById("goal-rights-note");
    const programId = resolveProgramId(definition, grade);
    const matches = originalLinks.findForGrade(programId, grade);
    const record = matches[0];
    const program = findProgram(programId);

    if (!record) {
      anchor.hidden = true;
      anchor.removeAttribute("data-original-record-id");
      if (program.pathway !== "competition") {
        status.textContent = "";
        rights.innerHTML = '<span aria-hidden="true">ⓘ</span> 교육과정 기준은 공식 출처로 연결하고, 진단·수업 자료는 GFIELD 자체 제작·검수 자료로 구성합니다.';
        return;
      }
      status.textContent = programId === "sasmo-k2-8"
        ? `${gradeName(grade)}의 검증된 공개 영어 원문 진입은 아직 잠금 상태입니다. 공식 정보에서 제공 여부를 먼저 확인합니다.`
        : "공식 참가·범위는 확인했지만, 이 목표의 원문 문제 제공 경로와 GFIELD 콘텐츠는 아직 검증 대기입니다.";
      rights.innerHTML = '<span aria-hidden="true">ⓘ</span> 공식 원문 링크가 검증되기 전에는 GFIELD가 문항을 대신 복제하거나 공개하지 않습니다.';
      return;
    }

    const yearLabel = record.competitionYears.join("–");
    anchor.hidden = false;
    anchor.href = record.organizerHostedUrl;
    anchor.dataset.originalRecordId = record.id;
    anchor.textContent = `${yearLabel} ${gradeName(grade)} 공식 원본 접근 ↗`;
    const coverageLabel = record.coverageLabelKo || record.coverageLabel;
    status.textContent = record.sourceKind === "organizer-lms"
      ? `${coverageLabel}. 주최기관 로그인 또는 무료 등록 뒤 공식 자료에 접근합니다. GFIELD 분석·문항 배정은 아직 잠금입니다.`
      : `${coverageLabel}. 이 버튼은 주최기관의 학년별 원본 진입 페이지를 엽니다. GFIELD 분석·문항 배정은 아직 잠금입니다.`;
    rights.innerHTML = '<span aria-hidden="true">ⓘ</span> 공개 화면·GitHub에는 공식 원문·도형·해설을 복제하지 않습니다. 비공개 원본 보관은 출처·해시 검수용이며 학생 배포가 아닙니다.';
  }

  function renderGoalFlow(goalId, hasOriginal) {
    const competition = ["kangaroo", "sasmo", "amc"].includes(goalId);
    const steps = competition
      ? [
        ["STEP 1", "주최기관에서 참가 자격·학년 확인"],
        ["STEP 2", hasOriginal ? "공식 원본 접근 경로 열기" : "공식 원본 제공 여부 확인"],
        ["STEP 3", "GFIELD 결과 기록·분석은 검수 후 공개"]
      ]
      : [
        ["STEP 1", "학년·목표 범위 확인"],
        ["STEP 2", "영역별 진단 근거 수집"],
        ["STEP 3", "맞춤 수업 후 유지 재검증"]
      ];
    document.getElementById("goal-start-flow").innerHTML = steps.map(function (step) {
      return `<li><b>${step[0]}</b><small>${step[1]}</small></li>`;
    }).join("");
  }

  function updateGoal(goalId, requestedGrade, focusDetail) {
    const definition = goalDefinitions[goalId];
    if (!definition) return;
    const desired = requestedGrade == null ? state.officialGradeKey : requestedGrade;
    const grade = definition.grades.some(function (entry) { return sameGrade(entry, desired); })
      ? desired
      : definition.defaultGrade;

    state.goalId = goalId;
    state.officialGradeKey = String(grade);
    document.querySelectorAll("[data-goal]").forEach(function (button) {
      const selected = button.dataset.goal === goalId;
      button.setAttribute("aria-selected", String(selected));
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });

    const activeTab = document.querySelector(`[data-goal="${goalId}"]`);
    const detail = document.getElementById("goal-detail");
    detail.setAttribute("aria-labelledby", activeTab.id);
    detail.style.background = definition.tone;
    if (window.matchMedia("(max-width: 720px)").matches) {
      activeTab.parentElement.scrollLeft = Math.max(0, activeTab.offsetLeft - (activeTab.parentElement.clientWidth - activeTab.offsetWidth) / 2);
    }
    populateGoalGrades(definition, grade);

    const programId = resolveProgramId(definition, grade);
    const program = findProgram(programId);
    const profile = findProfile(programId);
    const facts = profileFacts(goalId, grade);
    document.getElementById("goal-type").textContent = definition.type;
    document.getElementById("goal-title").textContent = definition.title(grade);
    document.getElementById("goal-summary").textContent = definition.summary;
    document.getElementById("goal-eligibility").textContent = facts.eligibility;
    document.getElementById("goal-format").textContent = facts.format;
    document.getElementById("goal-route").textContent = definition.route;
    document.getElementById("goal-grade-note").textContent = goalId === "amc"
      ? `${gradeName(grade)}의 권장 단계를 표시합니다 · 실제 참가 자격은 별도 확인`
      : `${gradeName(grade)} 기준 · 대회와 학교 학년은 별도 확인`;
    document.getElementById("goal-verified").textContent = `공식 정보 · ${(profile && profile.lastVerified) || program.sources[0].lastVerified} 확인`;

    const source = document.getElementById("goal-source");
    source.href = program.sources[0].url;
    source.textContent = `${program.title.ko} 공식 정보 ↗`;

    const primary = document.getElementById("goal-primary");
    if (goalId === "sasmo") {
      primary.textContent = "SASMO 전용 프로그램 시작";
      primary.href = "./sasmo.html";
    } else {
      primary.textContent = ["school", "singapore"].includes(goalId) ? "진단·숙달 구조 보기" : "GFIELD 준비 진단 구조 보기";
      primary.href = "./diagnostic.html";
    }

    setOriginalLink(definition, grade);
    renderGoalFlow(goalId, !document.getElementById("goal-original").hidden);
    if (focusDetail && window.matchMedia("(max-width: 720px)").matches) {
      detail.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  function statusFor(grade, domain, index) {
    if (String(grade) !== "6") return { label: "미진단", className: "not-assessed", fill: "empty-fill", value: 0, evidence: "평가 근거 없음" };
    const sample = {
      RP: { label: "보완 필요", className: "needs", fill: "needs-fill", value: 58, evidence: "샘플 8문항 · 선수개념 확인" },
      NS: { label: "학교 핵심", className: "ready", fill: "", value: 72, evidence: "샘플 9문항 · 유지 확인 예정" },
      EE: { label: "근거 부족", className: "not-assessed", fill: "", value: 64, evidence: "샘플 7문항 · 추가 근거 필요" },
      G: { label: "경시 전이", className: "needs", fill: "needs-fill", value: 86, evidence: "샘플 10문항 · 시간 전략 확인" },
      SP: { label: "깊은 숙달", className: "deep", fill: "deep-fill", value: 77, evidence: "샘플 8문항 · D+7 통과" }
    };
    return sample[domain] || { label: "근거 부족", className: "not-assessed", fill: "", value: 50 + index * 3, evidence: "샘플 · 추가 근거 필요" };
  }

  function renderGradeMap(grade) {
    state.mapGrade = String(grade);
    document.querySelectorAll("[data-grade-tab]").forEach(function (button) {
      const selected = sameGrade(button.dataset.gradeTab, grade);
      button.setAttribute("aria-selected", String(selected));
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });
    const activeTab = document.querySelector(`[data-grade-tab="${grade}"]`);
    document.getElementById("skill-map-panel").setAttribute("aria-labelledby", activeTab.id);

    const domains = spine.gradeDomains[grade] || [];
    const units = registry.units.filter(function (unit) { return sameGrade(unit.grade, grade); });
    document.getElementById("selected-grade").textContent = gradeShort(grade);
    document.getElementById("grade-title").textContent = `${gradeName(grade)} 영역별 근거`;
    document.getElementById("skill-rows").innerHTML = domains.map(function (domain, index) {
      const localized = spine.domainTitles[domain];
      const domainUnitCount = units.filter(function (unit) {
        return unit.domainCode === domain || String(unit.standardRange || "").includes(`.${domain}.`);
      }).length;
      const status = statusFor(grade, domain, index);
      return `<div class="skill-row">
        <div class="skill-name"><strong>${localized.ko}</strong><small>${domain} · ${domainUnitCount || "—"}개 클러스터 앵커 · ${status.evidence}</small></div>
        <div class="skill-meter" role="progressbar" aria-label="${localized.ko} 샘플 지표" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${status.value}"><span class="${status.fill}" style="width:${status.value}%"></span></div>
        <div class="skill-state"><i class="${status.className}"></i>${status.label}</div>
      </div>`;
    }).join("");
    document.getElementById("map-footnote").textContent = `${gradeName(grade)} · ${domains.length}개 영역 · ${units.length}개 클러스터 앵커 · 상태/점수는 샘플`;
  }

  function buildGradeTabs() {
    const target = document.getElementById("grade-tabs");
    target.innerHTML = spine.gradeOrder.map(function (grade) {
      const selected = String(grade) === "6";
      return `<button id="grade-tab-${grade}" type="button" role="tab" aria-controls="skill-map-panel" data-grade-tab="${grade}" aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}">${gradeShort(grade)}</button>`;
    }).join("");
  }

  function updateRole(roleId) {
    const role = rolePreviews[roleId];
    if (!role) return;
    state.roleId = roleId;
    document.querySelectorAll("[data-role-preview]").forEach(function (button) {
      const selected = button.dataset.rolePreview === roleId;
      button.setAttribute("aria-selected", String(selected));
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });
    const activeTab = document.querySelector(`[data-role-preview="${roleId}"]`);
    document.getElementById("role-preview").setAttribute("aria-labelledby", activeTab.id);
    document.getElementById("role-eyebrow").textContent = role.eyebrow;
    document.getElementById("role-title").textContent = role.title;
    document.getElementById("role-description").textContent = role.description;
    document.getElementById("role-nav").innerHTML = role.nav.map(function (item) { return `<li>${item}</li>`; }).join("");
    document.getElementById("mini-product").innerHTML = role.panel;
  }

  function moveTabFocus(event, selector, vertical) {
    const allowed = vertical ? ["ArrowUp", "ArrowDown", "Home", "End"] : ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!allowed.includes(event.key)) return;
    const buttons = Array.from(document.querySelectorAll(selector));
    const current = buttons.indexOf(event.target);
    if (current < 0) return;
    event.preventDefault();
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = buttons.length - 1;
    else if (event.key === (vertical ? "ArrowUp" : "ArrowLeft")) next = (current - 1 + buttons.length) % buttons.length;
    else next = (current + 1) % buttons.length;
    buttons[next].focus();
    buttons[next].click();
  }

  document.addEventListener("click", function (event) {
    const goalButton = event.target.closest("[data-goal]");
    const pathButton = event.target.closest("[data-path-goal]");
    const gradeButton = event.target.closest("[data-grade-tab]");
    const roleButton = event.target.closest("[data-role-preview]");
    const roleTarget = event.target.closest("[data-role-target]");
    if (pathButton) {
      const pathGoal = pathButton.dataset.pathGoal;
      updateGoal(pathGoal, goalDefinitions[pathGoal].defaultGrade);
    }
    if (goalButton) updateGoal(goalButton.dataset.goal, null, true);
    if (gradeButton) renderGradeMap(gradeButton.dataset.gradeTab);
    if (roleButton) updateRole(roleButton.dataset.rolePreview);
    if (roleTarget) updateRole(roleTarget.dataset.roleTarget);
  });

  document.addEventListener("keydown", function (event) {
    if (event.target.matches("[data-goal]")) moveTabFocus(event, "[data-goal]", true);
    if (event.target.matches("[data-grade-tab]")) moveTabFocus(event, "[data-grade-tab]", false);
    if (event.target.matches("[data-role-preview]")) moveTabFocus(event, "[data-role-preview]", false);
  });

  document.getElementById("goal-grade-select").addEventListener("change", function (event) {
    updateGoal(state.goalId, event.target.value);
  });

  buildGradeTabs();
  renderGradeMap(state.mapGrade);
  updateGoal(state.goalId, state.officialGradeKey);
  updateRole(state.roleId);
})();
