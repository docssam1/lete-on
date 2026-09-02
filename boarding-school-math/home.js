(function () {
  "use strict";

  const catalog = window.GFIELDMathProgramCatalog;
  const profiles = window.GFIELDK12CompetitionProfiles || window.GFIELDK8CompetitionProfiles;
  const originalLinks = window.GFIELDCompetitionOriginalLinks;
  const spine = window.GFIELDUSK8DomainSpine;
  const registry = window.GFIELDUSK8ContentRegistry;
  const coursePathways = window.GFIELDMathCoursePathways;
  const reasoningProgression = window.GFIELDGrade58ReasoningProgression;

  if (!catalog || !profiles || !originalLinks || !spine || !registry || !coursePathways || !reasoningProgression) {
    throw new Error("GFIELD home dependencies did not load");
  }

  const state = {
    goalId: "school",
    officialGradeKey: "6",
    mapGrade: "6",
    mapView: "grade",
    courseId: "pre-algebra",
    roleId: "student"
  };

  const goalDefinitions = {
    school: {
      programId: "us-core-k8",
      type: "학교 수학",
      label: "미국 학교 수학",
      title: function (grade) { return `${gradeName(grade)} 학교 수학`; },
      summary: "학년만 고르는 것이 아니라 영역과 단원까지 내려가 현재 위치를 확인합니다. 진단 근거가 생기면 보완 개념, 학년 핵심, 다음 도전 순서로 수업을 연결합니다.",
      grades: ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      eligibility: "미국 K–12 · 과정 순서와 승급 정책은 학교별 설정",
      route: "학년·영역 선택 → 진단 → 분석 → 개념·연습 처방 → 유지 확인",
      tone: "#102a3f"
    },
    singapore: {
      programId: "singapore-mastery",
      type: "숙달 학습법",
      label: "싱가포르 숙달",
      title: function (grade) { return `싱가포르식 숙달 · ${gradeName(grade)}`; },
      summary: "개념과 모델로 이해한 뒤 연습, 오류 성찰, 비정형 전이, 유지 확인으로 이어지는 학습 방식입니다. 별도 교육과정인 것처럼 임의의 단원은 만들지 않습니다.",
      grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      eligibility: "G1–8 구현 경계 확인 · G9–12 교차표와 학교 설정은 검수 대기",
      route: "개념·모델 → 동기화 연습 → 오류 성찰 → 새로운 문제 전이 → 유지 확인",
      tone: "#285345"
    },
    kangaroo: {
      programId: "math-kangaroo-1-8",
      type: "경시 준비",
      label: "Math Kangaroo",
      title: function (grade) { return `Math Kangaroo · ${gradeName(grade)} 준비`; },
      summary: "공식 두 학년 밴드와 3·4·5점 구간을 확인하고, 학교 수학 위에 시각·논리·비정형 문제와 시간 전략을 더합니다.",
      grades: ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      route: "공식 밴드 확인 → 현재 영역 확인 → 점수 구간별 훈련 → 공식 형식 모의",
      tone: "#6c413b"
    },
    sasmo: {
      programId: "sasmo-k2-8",
      type: "경시 준비",
      label: "SASMO",
      title: function (grade) { return `SASMO · ${gradeName(grade)} 준비`; },
      summary: "학년별 공식 형식과 원문 접근 경로를 확인하고, 학교 수학의 선수개념·비정형 추론·감점·시간 전략을 하나의 준비 순서로 연결합니다.",
      grades: ["K2", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      route: "학년 확인 → 공식 원문 → 결과 기록 → 영역·감점·시간 분석 → 맞춤 수업",
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
      type: "경시 준비",
      label: "AMC 8·10·12",
      title: function (grade) {
        const numericGrade = Number(grade);
        const stage = numericGrade <= 8 ? 8 : numericGrade <= 10 ? 10 : 12;
        return `AMC ${stage} · ${gradeName(grade)} 권장 경로`;
      },
      summary: "학년에 맞는 AMC 8·10·12 권장 단계를 보여주되, 공식 참가 자격과 GFIELD 권장 준비 학년을 분리해서 안내합니다.",
      grades: [6, 7, 8, 9, 10, 11, 12],
      defaultGrade: 6,
      route: "공식 자격 확인 → 학교 과정 진단 → AMC 영역 훈련 → 공식 시간 모의 → 전략 복기",
      tone: "#643948"
    }
  };

  const rolePreviews = {
    student: {
      eyebrow: "STUDENT · LEARN",
      title: "학생은 오늘 가능한 학습부터 시작합니다.",
      description: "Grade 6에서는 공개 개념 10개를 바로 학습할 수 있습니다. 검수를 끝내지 않은 진단·문제·워크북은 잠금 상태로 구분합니다.",
      nav: ["개념 배우기", "영역 확인", "진단 상태", "경시 경로"],
      panel: [
        '<div class="mini-product-top"><span>현재 학생 공개 범위</span><b>Grade 6</b></div>',
        '<a class="mini-task primary-task" href="./concept-learning.html"><small>지금 가능</small><strong>10개 핵심 개념 학습</strong><span>설명 · 시각 모델 · 완전 풀이 예제 →</span></a>',
        '<div class="mini-task"><small>검수 대기</small><strong>42문항 진단·분석</strong><span>학생 운영 잠금</span></div>',
        '<a class="mini-task" href="./sasmo.html"><small>준비 경로</small><strong>SASMO K2–G12</strong><span>공식 형식과 원문 접근 확인 →</span></a>'
      ].join("")
    },
    teacher: {
      eyebrow: "TEACHER · PLAN",
      title: "교사는 범위, 근거, 검수 상태를 함께 봅니다.",
      description: "학년·영역·단원을 고르고 수업 자료 상태를 확인합니다. 검수 전 문제·정답·해설은 배정할 수 없습니다.",
      nav: ["교육과정", "진단 근거", "수업 구성", "검수 상태", "배정 가능 여부"],
      panel: [
        '<div class="mini-product-top"><span>현재 교사 공개 범위</span><b>K–8</b></div>',
        '<a class="mini-task primary-task" href="./catalog.html?role=teacher"><small>구조 공개</small><strong>94개 클러스터·자료 계획</strong><span>학년 → 영역 → 단원 → 자료 →</span></a>',
        '<a class="mini-task" href="./diagnostic.html"><small>비공개 QA</small><strong>Grade 6 진단·분석 흐름</strong><span>42문항 독립 검수 대기 →</span></a>',
        '<div class="mini-task"><small>배정 잠금</small><strong>문제·워크북·정답·해설</strong><span>독립 검수와 승인 필요</span></div>'
      ].join("")
    }
  };

  function gradeName(grade) {
    if (String(grade) === "K2") return "K2";
    if (String(grade) === "K") return "Kindergarten";
    return `Grade ${grade}`;
  }

  function gradeShort(grade) {
    if (["K", "K2"].includes(String(grade))) return String(grade);
    return `G${grade}`;
  }

  function sameGrade(left, right) {
    return String(left) === String(right);
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

  function profileFacts(goalId, grade) {
    const definition = goalDefinitions[goalId];
    const programId = resolveProgramId(definition, grade);
    const profile = findProfile(programId);
    if (goalId === "school") {
      return Number(grade) >= 9
        ? { eligibility: definition.eligibility, format: "G9–12 공식 개념 범주 · 학교 course sequence 설정 후 과정 확정" }
        : { eligibility: definition.eligibility, format: "K–8 · 학년별 영역과 94개 클러스터 앵커" };
    }
    if (goalId === "singapore") {
      return {
        eligibility: definition.eligibility,
        format: Number(grade) >= 9 ? "G9–12 교차표·수업 자료 검수 대기" : "개념·기능·과정·메타인지·태도 · 재확인 포함"
      };
    }
    if (goalId === "kangaroo" && profile) {
      const paperGrade = String(grade) === "K" ? 1 : Number(grade);
      const band = profile.paperBands.find(function (entry) { return entry.grades.includes(paperGrade); });
      return {
        eligibility: String(grade) === "K" ? "K는 독립적으로 읽고 풀 수 있을 때 Grade 1 시험지" : "공식 G1–12 · 두 학년 밴드별 시험지",
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

  function localStatus(goalId, grade) {
    if (goalId === "school" && String(grade) === "6") return "Grade 6 공개 개념 10개 이용 가능 · 42문항 진단은 독립 검수 대기이며 학생 운영은 잠금입니다.";
    if (goalId === "school" && (String(grade) === "K" || Number(grade) <= 8)) return "영역·클러스터 구조만 공개되었습니다. 학습 문항과 워크북은 검수 전까지 잠금입니다.";
    if (goalId === "school") return "고등 과정은 학교별 실제 과목 순서가 설정될 때까지 공식 개념 범주만 표시합니다.";
    if (goalId === "singapore" && String(grade) === "6") return "Grade 6 자체 제작 개념 10개를 숙달 순서로 학습할 수 있습니다. 별도 문제·평가는 검수 대기입니다.";
    if (goalId === "singapore" && Number(grade) <= 8) return "숙달 학습의 구현 경계만 확인되었습니다. 이 학년의 공개 단원·문항은 아직 없습니다.";
    if (goalId === "singapore") return "G9–12 교차표와 학교 과정 설정은 검수 대기입니다.";
    return "";
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
      anchor.removeAttribute("href");
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
      anchor.removeAttribute("data-original-record-id");
      if (program.pathway !== "competition") {
        status.textContent = localStatus(state.goalId, grade);
        rights.innerHTML = '<span aria-hidden="true">ⓘ</span> 교육과정 기준은 공식 출처로 연결하고, 학습 자료는 공개 상태와 검수 상태를 분리합니다.';
        return;
      }
      status.textContent = programId === "sasmo-k2-8"
        ? `${gradeName(grade)}의 검증된 공개 원문 진입은 아직 잠금입니다. 주최기관에서 제공 여부를 먼저 확인합니다.`
        : "공식 참가·범위는 확인했지만, 원문 문제 제공 경로와 GFIELD 연습 콘텐츠는 아직 검수 대기입니다.";
      rights.innerHTML = '<span aria-hidden="true">ⓘ</span> 공식 원문 링크가 검증되기 전에는 GFIELD가 문항을 복제하거나 공개하지 않습니다.';
      return;
    }

    const yearLabel = record.competitionYears.join("–");
    anchor.hidden = false;
    anchor.href = record.organizerHostedUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.dataset.originalRecordId = record.id;
    anchor.textContent = `${yearLabel} ${gradeName(grade)} 공식 원본 접근 ↗`;
    const coverageLabel = record.coverageLabelKo || record.coverageLabel;
    status.textContent = record.sourceKind === "organizer-lms"
      ? `${coverageLabel}. 주최기관 로그인 또는 무료 등록 뒤 접근합니다. GFIELD 분석·문항 배정은 아직 잠금입니다.`
      : `${coverageLabel}. 주최기관의 학년별 원본 진입 페이지입니다. GFIELD 분석·문항 배정은 아직 잠금입니다.`;
    rights.innerHTML = '<span aria-hidden="true">ⓘ</span> 공식 원문·도형·해설은 주최기관에서 확인합니다. GFIELD 공개 화면에는 검수된 자체 콘텐츠만 제공합니다.';
  }

  function renderGoalFlow(goalId, hasOriginal) {
    const competition = ["kangaroo", "sasmo", "amc"].includes(goalId);
    const steps = competition
      ? [["01", "학년·공식 자격 확인"], ["02", hasOriginal ? "주최기관 원문 확인" : "원문 제공 여부 확인"], ["03", "검수 후 분석·학습 연결"]]
      : [["01", "학년·영역 선택"], ["02", "진단 또는 개념 학습"], ["03", "교사 확인·재학습"]];
    document.getElementById("goal-start-flow").innerHTML = steps.map(function (step) {
      return `<li><b>${step[0]}</b><small>${step[1]}</small></li>`;
    }).join("");
  }

  function renderCapabilities(goalId, grade) {
    const target = document.getElementById("goal-capabilities");
    if (!target) return;
    const gradeSixLearning = String(grade) === "6" && ["school", "singapore"].includes(goalId);
    const competition = ["kangaroo", "sasmo", "amc"].includes(goalId);
    const stages = [
      ["01", "진단", competition ? "공식 결과·준비 진단" : "학년·영역별 근거", "planned"],
      ["02", "분석", "문항·영역·오류 유형", "planned"],
      ["03", "클리닉", "약점별 보완 수업", "planned"],
      ["04", "개념 학습", "설명·모델·완전 풀이", gradeSixLearning ? "public" : "planned"],
      ["05", "워크북", "수업·가정·퀴즈 구성", "locked"],
      ["06", "재확인", "유지·전이·교사 확인", "planned"]
    ];
    target.innerHTML = stages.map(function (stage) {
      const status = stage[3] === "public" ? "현재 공개" : stage[3] === "locked" ? "검수 잠금" : "연결 설계";
      return `<li><span>${stage[0]}</span><strong>${stage[1]}</strong><small>${stage[2]}</small><em class="${stage[3]}">${status}</em></li>`;
    }).join("");
  }

  function updateGoal(goalId, requestedGrade, focusDetail) {
    const definition = goalDefinitions[goalId];
    if (!definition) return;
    const desired = requestedGrade == null ? state.officialGradeKey : requestedGrade;
    const grade = definition.grades.some(function (entry) { return sameGrade(entry, desired); }) ? desired : definition.defaultGrade;

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
    detail.style.setProperty("--goal-tone", definition.tone);
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
      ? `${gradeName(grade)}의 권장 단계 · 실제 참가 자격은 별도 확인`
      : `${gradeName(grade)} 기준`;
    document.getElementById("goal-verified").textContent = `출처 확인 · ${(profile && profile.lastVerified) || program.sources[0].lastVerified}`;

    const source = document.getElementById("goal-source");
    source.href = program.sources[0].url;
    source.textContent = `${program.title.ko} 공식 정보 ↗`;

    const primary = document.getElementById("goal-primary");
    if (goalId === "sasmo") {
      primary.textContent = "SASMO 학년별 준비 경로 열기";
      primary.href = "./sasmo.html";
    } else if (goalId === "school" && String(grade) === "6") {
      primary.textContent = "Grade 6 진단·분석 QA 보기";
      primary.href = "./diagnostic.html";
    } else if (goalId === "singapore" && String(grade) === "6") {
      primary.textContent = "Grade 6 공개 개념 10개 학습";
      primary.href = "./concept-learning.html";
    } else if (String(grade) === "K" || (Number.isInteger(Number(grade)) && Number(grade) <= 8)) {
      primary.textContent = `${gradeName(grade)} 영역·단원 보기`;
      primary.href = `./catalog.html?role=${state.roleId}&grade=${encodeURIComponent(grade)}`;
    } else {
      primary.textContent = "고등 과정 설계 상태 보기";
      primary.href = "#high-school-bridge";
    }

    setOriginalLink(definition, grade);
    renderGoalFlow(goalId, !document.getElementById("goal-original").hidden);
    renderCapabilities(goalId, grade);

    if (goalId === "school" && spine.gradeOrder.some(function (entry) { return sameGrade(entry, grade); })) renderGradeMap(grade);
    if (focusDetail && window.matchMedia("(max-width: 720px)").matches) {
      detail.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  function unitAction(unit) {
    if (String(unit.grade) === "6") {
      return {
        label: state.roleId === "teacher" ? "학생 화면 보기" : "개념 배우기",
        href: `./concept-learning.html?cluster=${encodeURIComponent(unit.clusterId)}`,
        state: "공개"
      };
    }
    return {
      label: state.roleId === "teacher" ? "자료 상태 보기" : "범위 보기",
      href: `./catalog.html?role=${state.roleId}&grade=${encodeURIComponent(unit.grade)}`,
      state: "메타데이터"
    };
  }

  function reasoningLabel(dimensionId) {
    const dimension = reasoningProgression.dimensions[dimensionId];
    return dimension ? dimension.title.ko : dimensionId;
  }

  function renderReasoningLanes(grade) {
    const target = document.getElementById("grade-reasoning-lanes");
    const profile = reasoningProgression.forGrade(grade);
    if (!target) return;
    target.hidden = !profile;
    if (!profile) {
      target.innerHTML = "";
      return;
    }
    const clinicSummary = profile.publicClinicCount
      ? `${profile.publicClinicCount}개 클리닉 공개`
      : "영역별 설계 공개";
    const prioritySummary = profile.reasoningPriorities.slice(0, 3).map(reasoningLabel).join(" · ");
    target.innerHTML = `<article><span>01 · SCHOOL CORE</span><strong>학교 핵심</strong><small>${profile.schoolClusterCount}개 공식 클러스터 구조</small></article>
      <article><span>02 · THINKING CLINIC</span><strong>사고력 클리닉</strong><small>${prioritySummary} · ${clinicSummary}</small></article>
      <article><span>03 · CONTEST BRIDGE</span><strong>경시 가교</strong><small>${profile.competitionBridge.join(" · ")}</small></article>
      <p>원문 문항을 합친 것이 아니라 검증된 유형·학습 순서·출고 게이트를 연결한 지도입니다.</p>`;
  }

  function renderGradeMap(grade) {
    state.mapGrade = String(grade);
    document.querySelectorAll("[data-grade-tab]").forEach(function (button) {
      const selected = sameGrade(button.dataset.gradeTab, grade);
      button.setAttribute("aria-selected", String(selected));
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });
    const activeTab = document.querySelector(`[data-grade-tab="${grade}"]`);
    if (!activeTab) return;
    document.getElementById("skill-map-panel").setAttribute("aria-labelledby", activeTab.id);

    const domains = spine.gradeDomains[grade] || [];
    const units = registry.units.filter(function (unit) { return sameGrade(unit.grade, grade); });
    const publicGrade = String(grade) === "6";
    renderReasoningLanes(grade);
    document.getElementById("selected-grade").textContent = gradeShort(grade);
    document.getElementById("grade-title").textContent = publicGrade ? `${gradeName(grade)} · 공개 개념 10개` : `${gradeName(grade)} · 영역과 단원 범위`;
    document.getElementById("skill-rows").innerHTML = domains.map(function (domain, index) {
      const localized = spine.domainTitles[domain];
      const domainUnits = units.filter(function (unit) {
        return unit.domainCode === domain || String(unit.standardRange || "").includes(`.${domain}.`);
      });
      const rows = domainUnits.map(function (unit) {
        const action = unitAction(unit);
        const reasoningProfile = reasoningProgression.forCluster(unit.clusterId);
        const reasoningText = reasoningProfile
          ? reasoningProfile.reasoningTags.slice(0, 3).map(reasoningLabel).join(" · ")
          : "";
        return `<li class="unit-row">
          <div><strong>${unit.title.ko}</strong><small>${unit.clusterId} · ${unit.standardRange}</small>${reasoningText ? `<em class="unit-reasoning">사고력 · ${reasoningText}</em>` : ""}</div>
          <span class="search-result-status ${publicGrade ? "public" : "metadata"}">${action.state}</span>
          <a class="unit-action" href="${action.href}">${action.label}<span aria-hidden="true">→</span></a>
        </li>`;
      }).join("");
      return `<details class="domain-directory-row" data-domain-code="${domain}"${index === 0 ? " open" : ""}>
        <summary class="domain-summary">
          <span class="domain-code">${domain}</span>
          <span><strong>${localized.ko}</strong><small>${localized.en}</small></span>
          <span class="domain-count">${domainUnits.length}개 단원</span>
          <span class="status-chip ${publicGrade ? "public" : "metadata"}">${publicGrade ? "개념 공개" : "구조 공개"}</span>
          <i aria-hidden="true">＋</i>
        </summary>
        <ul class="domain-units">${rows}</ul>
      </details>`;
    }).join("");
    document.getElementById("map-footnote").textContent = publicGrade
      ? `${gradeName(grade)} · ${domains.length}개 영역 · ${units.length}개 자체 제작 개념 공개 · 문제·워크북·진단은 별도 검수`
      : `${gradeName(grade)} · ${domains.length}개 영역 · ${units.length}개 클러스터 구조 공개 · 학습 자료는 검수 대기`;
  }

  function buildGradeTabs() {
    const target = document.getElementById("grade-tabs");
    target.innerHTML = spine.gradeOrder.map(function (grade) {
      const selected = String(grade) === state.mapGrade;
      return `<button id="grade-tab-${grade}" type="button" role="tab" aria-controls="skill-map-panel" data-grade-tab="${grade}" aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}">${gradeShort(grade)}</button>`;
    }).join("");
  }

  function renderDomainOverview() {
    const target = document.getElementById("domain-overview");
    if (!target) return;
    const domainOrder = [];
    spine.gradeOrder.forEach(function (grade) {
      (spine.gradeDomains[grade] || []).forEach(function (domain) {
        if (!domainOrder.includes(domain)) domainOrder.push(domain);
      });
    });
    target.innerHTML = domainOrder.map(function (domain) {
      const localized = spine.domainTitles[domain];
      const grades = spine.gradeOrder.filter(function (grade) {
        return (spine.gradeDomains[grade] || []).includes(domain);
      });
      const gradeLinks = grades.map(function (grade) {
        const count = registry.units.filter(function (unit) {
          return sameGrade(unit.grade, grade) && unit.domainCode === domain;
        }).length;
        const isPublic = String(grade) === "6";
        return `<button class="domain-grade-link${isPublic ? " is-public" : ""}" type="button" data-domain-grade="${grade}" data-domain-code="${domain}" aria-label="${localized.ko} ${gradeName(grade)} ${count}개 단원 보기">
          <strong>${gradeShort(grade)}</strong><small>${count}개</small><span>${isPublic ? "개념 공개" : "구조"}</span>
        </button>`;
      }).join("");
      return `<article class="domain-overview-row">
        <div class="domain-overview-title"><span class="domain-code">${domain}</span><div><h3>${localized.ko}</h3><p>${localized.en}</p></div></div>
        <div class="domain-grade-links" aria-label="${localized.ko} 해당 학년">${gradeLinks}</div>
      </article>`;
    }).join("");
  }

  function setMapView(view) {
    if (!["grade", "domain", "course"].includes(view)) return;
    state.mapView = view;
    document.querySelectorAll("[data-map-view]").forEach(function (button) {
      const selected = button.dataset.mapView === view;
      button.setAttribute("aria-selected", String(selected));
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });
    const gradeDirectory = document.getElementById("grade-directory");
    const domainDirectory = document.getElementById("domain-directory");
    const courseDirectory = document.getElementById("course-directory");
    if (gradeDirectory) gradeDirectory.hidden = view !== "grade";
    if (domainDirectory) domainDirectory.hidden = view !== "domain";
    if (courseDirectory) courseDirectory.hidden = view !== "course";
  }

  function renderCourseDirectory(courseId) {
    const course = coursePathways.courses.find(function (entry) { return entry.id === courseId; }) || coursePathways.courses[0];
    state.courseId = course.id;
    const tabs = document.getElementById("course-tabs");
    const panel = document.getElementById("course-map-panel");
    if (!tabs || !panel) return;
    tabs.innerHTML = coursePathways.courses.map(function (entry) {
      const selected = entry.id === course.id;
      return `<button id="course-tab-${entry.id}" type="button" role="tab" data-course-id="${entry.id}" aria-controls="course-map-panel" aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}"><strong>${entry.title}</strong><small>${entry.grades}</small></button>`;
    }).join("");
    panel.setAttribute("aria-labelledby", `course-tab-${course.id}`);
    panel.innerHTML = `<div class="course-map-top"><div><p class="micro-label">${course.grades} · SCHOOL-CONFIGURED</p><h3>${course.title}</h3><p>${course.summary}</p></div><span class="status-chip ${course.id === "pre-algebra" ? "public" : "metadata"}">${course.id === "pre-algebra" ? "일부 공개" : "과정 지도"}</span></div>
      <dl class="course-facts"><div><dt>선수개념</dt><dd>${course.prerequisites}</dd></div><div><dt>핵심 영역</dt><dd>${course.focus.join(" · ")}</dd></div><div><dt>다음 과정</dt><dd>${course.next}</dd></div><div><dt>자료 상태</dt><dd>${course.availability}</dd></div></dl>
      <section class="course-unit-map" aria-label="${course.title} 과정 지도 항목"><p class="micro-label">COURSE MAP · 4 CONNECTED AREAS</p><div>${course.units.map(function (unit, index) { return `<article><span>${String(index + 1).padStart(2, "0")}</span><strong>${unit}</strong><small>진단·클리닉·학습 자료 연결 대기</small></article>`; }).join("")}</div></section>
      <div class="course-actions"><a class="unit-action" href="${course.studentHref}">학생: ${course.id === "pre-algebra" ? "개념 학습" : course.id === "elementary-foundations" ? "학년·영역 보기" : "공개 학습 상태"}<span aria-hidden="true">→</span></a><a class="unit-action course-teacher-action" href="${course.teacherHref}">교사: ${course.id === "pre-algebra" || course.id === "elementary-foundations" ? "범위·자료 상태" : "배치 원칙 확인"}<span aria-hidden="true">→</span></a></div>`;
    const note = document.getElementById("course-sequence-note");
    if (note) note.textContent = coursePathways.sequenceNotice;
  }

  function courseIdForGrade(grade) {
    const numeric = Number(grade);
    if (!Number.isFinite(numeric) || numeric <= 5) return "elementary-foundations";
    if (numeric <= 8) return "pre-algebra";
    if (numeric === 9) return "algebra-1";
    if (numeric === 10) return "geometry";
    if (numeric === 11) return "algebra-2";
    return "precalculus";
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
    document.querySelectorAll("[data-role-target]").forEach(function (control) {
      control.classList.toggle("is-active", control.dataset.roleTarget === roleId);
      if (control.dataset.roleTarget === roleId) control.setAttribute("aria-current", "true");
      else control.removeAttribute("aria-current");
    });
    const activeTab = document.querySelector(`[data-role-preview="${roleId}"]`);
    document.getElementById("role-preview").setAttribute("aria-labelledby", activeTab.id);
    document.getElementById("role-eyebrow").textContent = role.eyebrow;
    document.getElementById("role-title").textContent = role.title;
    document.getElementById("role-description").textContent = role.description;
    document.getElementById("role-nav").innerHTML = role.nav.map(function (item) { return `<li>${item}</li>`; }).join("");
    document.getElementById("mini-product").innerHTML = role.panel;
    renderGradeMap(state.mapGrade);
    updatePrimaryRoleRoute();
  }

  function updatePrimaryRoleRoute() {
    const primary = document.getElementById("goal-primary");
    if (!primary || !primary.href.includes("catalog.html")) return;
    const definition = goalDefinitions[state.goalId];
    const grade = state.officialGradeKey;
    if (!definition || !definition.grades.some(function (entry) { return sameGrade(entry, grade); })) return;
    primary.href = `./catalog.html?role=${state.roleId}&grade=${encodeURIComponent(grade)}`;
  }

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("ko").replace(/[\s·–—_-]+/g, " ").trim();
  }

  function searchEntries() {
    const aliases = {
      school: "학교 미국 교육과정 core curriculum 학년 영역 단원",
      singapore: "싱가포르 singapore mastery 숙달 모델 method",
      kangaroo: "매스캥거루 math kangaroo 경시",
      sasmo: "sasmo 싱가포르 아시아 수학 올림피아드 경시 k2",
      amc: "amc 8 10 12 미국 수학 경시"
    };
    const pathways = Object.keys(goalDefinitions).map(function (goalId) {
      const definition = goalDefinitions[goalId];
      return {
        kind: "경로",
        title: definition.label,
        description: definition.summary,
        terms: `${definition.label} ${aliases[goalId]}`,
        href: "#goals",
        goalId,
        grade: definition.defaultGrade,
        state: "경로 보기",
        stateClass: "metadata"
      };
    });
    const units = registry.units.map(function (unit) {
      const publicGrade = String(unit.grade) === "6";
      const action = unitAction(unit);
      const domain = spine.domainTitles[unit.domainCode];
      return {
        kind: gradeShort(unit.grade),
        title: unit.title.ko,
        description: `${domain.ko} · ${unit.clusterId} · ${unit.standardRange}`,
        terms: `${gradeName(unit.grade)} ${gradeShort(unit.grade)} ${unit.title.ko} ${unit.title.en} ${domain.ko} ${domain.en} ${unit.clusterId} ${unit.standardRange}`,
        href: action.href,
        mapGrade: unit.grade,
        state: publicGrade ? "개념 공개" : "구조 공개",
        stateClass: publicGrade ? "public" : "metadata"
      };
    });
    return pathways.concat(units);
  }

  function renderSearch(query) {
    const results = document.getElementById("search-results");
    const summary = document.getElementById("search-summary");
    const clear = document.getElementById("search-clear");
    if (!results || !summary || !clear) return;
    const needle = normalize(query);
    clear.hidden = !needle;
    if (!needle) {
      results.hidden = true;
      results.innerHTML = "";
      summary.textContent = "예: Grade 6, 비와 비례, SASMO, AMC 10";
      return;
    }
    const tokens = needle.split(" ").filter(Boolean);
    const matches = searchEntries().filter(function (entry) {
      const haystack = normalize(`${entry.title} ${entry.description} ${entry.terms}`);
      return tokens.every(function (token) { return haystack.includes(token); });
    }).slice(0, 8);
    summary.textContent = matches.length ? `${matches.length}개 결과 · 공개 상태를 함께 표시합니다.` : "일치하는 경로 또는 단원이 없습니다.";
    results.hidden = false;
    results.innerHTML = matches.length ? matches.map(function (entry) {
      const goalData = entry.goalId ? ` data-search-goal="${entry.goalId}" data-search-grade="${entry.grade}"` : "";
      const mapData = entry.mapGrade != null ? ` data-search-map-grade="${entry.mapGrade}"` : "";
      return `<a class="search-result" href="${entry.href}"${goalData}${mapData}>
        <span class="search-result-kind">${entry.kind}</span>
        <span><strong>${entry.title}</strong><small>${entry.description}</small></span>
        <span class="search-result-status ${entry.stateClass}">${entry.state}</span>
      </a>`;
    }).join("") : '<p class="search-empty">다른 학년·영역 이름이나 SASMO·AMC처럼 목표 이름으로 검색해 보세요.</p>';
  }

  function moveTabFocus(event, selector) {
    const allowed = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (!allowed.includes(event.key)) return;
    const buttons = Array.from(document.querySelectorAll(selector));
    const current = buttons.indexOf(event.target);
    if (current < 0) return;
    event.preventDefault();
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = buttons.length - 1;
    else if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (current - 1 + buttons.length) % buttons.length;
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
    const searchResult = event.target.closest("[data-search-goal], [data-search-map-grade]");
    const mapViewButton = event.target.closest("[data-map-view]");
    const courseButton = event.target.closest("[data-course-id]");
    const domainGradeButton = event.target.closest("[data-domain-grade]");
    if (pathButton) {
      const pathGoal = pathButton.dataset.pathGoal;
      updateGoal(pathGoal, goalDefinitions[pathGoal].defaultGrade);
    }
    if (goalButton) updateGoal(goalButton.dataset.goal, null, true);
    if (gradeButton) renderGradeMap(gradeButton.dataset.gradeTab);
    if (roleButton) updateRole(roleButton.dataset.rolePreview);
    if (roleTarget) updateRole(roleTarget.dataset.roleTarget);
    if (mapViewButton) setMapView(mapViewButton.dataset.mapView);
    if (courseButton) renderCourseDirectory(courseButton.dataset.courseId);
    if (domainGradeButton) {
      setMapView("grade");
      renderGradeMap(domainGradeButton.dataset.domainGrade);
      const domainRow = document.querySelector(`.domain-directory-row[data-domain-code="${domainGradeButton.dataset.domainCode}"]`);
      if (domainRow) {
        document.querySelectorAll(".domain-directory-row[open]").forEach(function (details) { details.open = details === domainRow; });
        domainRow.open = true;
        const summary = domainRow.querySelector("summary");
        if (summary) summary.focus({ preventScroll: true });
        domainRow.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      }
    }
    if (searchResult) {
      if (searchResult.dataset.searchGoal) updateGoal(searchResult.dataset.searchGoal, searchResult.dataset.searchGrade);
      if (searchResult.dataset.searchMapGrade) renderGradeMap(searchResult.dataset.searchMapGrade);
      renderSearch("");
      const input = document.getElementById("learning-search");
      if (input) input.value = "";
    }
  });

  document.addEventListener("toggle", function (event) {
    if (!event.target.matches(".domain-directory-row") || !event.target.open) return;
    document.querySelectorAll(".domain-directory-row[open]").forEach(function (details) {
      if (details !== event.target) details.open = false;
    });
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.target.matches("[data-goal]")) moveTabFocus(event, "[data-goal]");
    if (event.target.matches("[data-grade-tab]")) moveTabFocus(event, "[data-grade-tab]");
    if (event.target.matches("[data-role-preview]")) moveTabFocus(event, "[data-role-preview]");
    if (event.target.matches("[data-map-view]")) moveTabFocus(event, "[data-map-view]");
    if (event.target.matches("[data-course-id]")) moveTabFocus(event, "[data-course-id]");
    if (event.key === "Escape" && event.target.id === "learning-search") {
      event.target.value = "";
      renderSearch("");
    }
  });

  document.getElementById("goal-grade-select").addEventListener("change", function (event) {
    updateGoal(state.goalId, event.target.value);
  });

  const searchInput = document.getElementById("learning-search");
  const searchClear = document.getElementById("search-clear");
  const searchForm = searchInput && searchInput.closest("form");
  const searchSubmit = document.querySelector(".learning-search .button");
  if (searchInput) searchInput.addEventListener("input", function (event) { renderSearch(event.target.value); });
  if (searchForm) searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    renderSearch(searchInput.value);
  });
  if (searchSubmit) searchSubmit.addEventListener("click", function () {
    renderSearch(searchInput.value);
    if (document.getElementById("search-results").hidden) searchInput.focus();
  });
  if (searchClear) searchClear.addEventListener("click", function () {
    searchInput.value = "";
    renderSearch("");
    searchInput.focus();
  });

  function updateQuickStart(grade) {
    const normalized = String(grade);
    const numericGrade = Number(normalized);
    const sasmo = document.getElementById("quick-sasmo");
    const concept = document.getElementById("quick-concept");
    const map = document.getElementById("quick-map");
    const sasmoTitle = sasmo && sasmo.querySelector("strong");
    const sasmoNote = sasmo && sasmo.querySelector("small");
    const conceptNote = concept && concept.querySelector("small");
    const mapTitle = map && map.querySelector("strong");
    const mapNote = map && map.querySelector("small");
    if (numericGrade >= 1 && numericGrade <= 11) {
      sasmo.href = `./sasmo.html?grade=${numericGrade}#past-papers`;
      sasmoTitle.textContent = numericGrade === 11 ? "SASMO 공식 자료 보기" : "SASMO 기출 풀기";
      sasmoNote.textContent = numericGrade === 11 ? "Grade 11 연도별 공식 LMS" : `Grade ${numericGrade} 연도별 문제·정답·해설`;
    } else if (numericGrade === 0) {
      sasmo.href = "./sasmo.html?grade=K2#past-papers";
      sasmoTitle.textContent = "SASMO K2 자료 보기";
      sasmoNote.textContent = "확인된 과거 원문과 공식 안내";
    } else {
      sasmo.href = `./sasmo.html?grade=${numericGrade}#past-papers`;
      sasmoTitle.textContent = "SASMO 준비 보기";
      sasmoNote.textContent = "확인된 과거 원문과 공식 안내";
    }
    if (numericGrade === 6) {
      concept.href = "./concept-learning.html";
      conceptNote.textContent = "Grade 6 공개 설명·예제·확인 학습";
    } else if (numericGrade <= 8) {
      concept.href = `./catalog.html?role=student&grade=${encodeURIComponent(normalized)}`;
      conceptNote.textContent = `${gradeName(normalized)} 영역·단원 구조 보기`;
    } else {
      concept.href = "#goals";
      conceptNote.textContent = `${gradeName(normalized)} 과정 경로 보기`;
    }
    if (numericGrade >= 9) {
      mapTitle.textContent = "나의 과정 지도 보기";
      mapNote.textContent = `${coursePathways.courses.find(function (course) { return course.id === courseIdForGrade(numericGrade); }).title} · 선수개념 · 다음 과정`;
    } else {
      mapTitle.textContent = "학년·영역·과정 지도";
      mapNote.textContent = numericGrade >= 6 ? "영역 · Pre-Algebra 가교 · 다음 과정" : "학년 영역 · 기초 과정 · 다음 과정";
    }
    map.dataset.quickGrade = normalized;
  }

  const quickStartGrade = document.getElementById("quick-start-grade");
  if (quickStartGrade) {
    quickStartGrade.addEventListener("change", function (event) { updateQuickStart(event.target.value); });
  }
  const quickMap = document.getElementById("quick-map");
  if (quickMap) quickMap.addEventListener("click", function () {
    const grade = quickMap.dataset.quickGrade || "6";
    const numericGrade = Number(grade);
    if (numericGrade >= 9) {
      setMapView("course");
      renderCourseDirectory(courseIdForGrade(numericGrade));
      return;
    }
    setMapView("grade");
    renderGradeMap(numericGrade === 0 ? "K" : grade);
  });

  buildGradeTabs();
  renderDomainOverview();
  renderGradeMap(state.mapGrade);
  renderCourseDirectory(state.courseId);
  setMapView(state.mapView);
  updateGoal(state.goalId, state.officialGradeKey);
  updateRole(state.roleId);
  renderSearch("");
  updateQuickStart(quickStartGrade ? quickStartGrade.value : "6");
})();
