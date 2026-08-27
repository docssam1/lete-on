(function () {
  "use strict";

  const goals = {
    school: {
      type: "학교 준비 경로",
      title: "미국 K–8 학교 수학",
      summary: "재학 학년과 실제 실력은 다를 수 있습니다. 학년별 영역을 진단하고 선수개념, 현재 핵심, 다음 과정의 연결을 교사 검토용 근거로 남깁니다.",
      eligibility: "K–8 · 학교/주 기준은 별도 설정",
      format: "전체 배치 36–60문항 · 4개 이상 영역",
      route: "전체 진단 → 영역 지도 → 보정 수업 → 단원 숙달 → 유지 확인",
      primary: "학교 수학 진단 설계",
      sourceLabel: "Common Core 기준 확인 ↗",
      source: "https://corestandards.org/mathematics-standards/",
      tone: "#102b42"
    },
    singapore: {
      type: "학습법·숙달 경로",
      title: "싱가포르식 깊은 숙달",
      summary: "대회명이 아닙니다. 개념과 모델로 이해하고, 충분히 연습하고, 오류를 성찰하고, 새로운 비정형 상황으로 확장한 뒤 오래 남았는지 다시 확인합니다.",
      eligibility: "MOE Primary 1–6 기반 · G7–8 교차표 검수 대기",
      format: "개념·기능·과정·메타인지·태도",
      route: "개념/모델 → 동기화 연습 → 성찰 복습 → 확장 학습 → 유지 확인",
      primary: "내 숙달 경로 보기",
      sourceLabel: "Singapore MOE 기준 확인 ↗",
      source: "https://www.moe.gov.sg/-/media/files/primary/2021-primary-mathematics-syllabus-p1-to-p6-updated-october-2025.pdf",
      tone: "#17604d"
    },
    kangaroo: {
      type: "대회 목표",
      title: "Math Kangaroo 준비",
      summary: "공식 두 학년 밴드의 범위와 3·4·5점 구간을 확인하고, 현재 학년의 수학 기초 위에 시각·논리·비정형 문제와 시간 전략을 더합니다.",
      eligibility: "G1–12 · K는 조건 충족 시 G1 시험지",
      format: "75분 · G1–4 24문항 / G5+ 30문항 · 오답 감점 없음",
      route: "학년 밴드 확인 → 준비 진단 → 점수 구간별 훈련 → 공식 형식 모의",
      primary: "내 학년 준비 진단 설계",
      sourceLabel: "Math Kangaroo 공식 정보 ↗",
      source: "https://mathkangaroo.org/mks/faqs/about-the-test/",
      tone: "#9c4b30"
    },
    sasmo: {
      type: "대회 목표",
      title: "SASMO Grade 6 준비",
      summary: "싱가포르식 숙달과 SASMO는 같지 않습니다. 학년별 공식 형식을 확인한 뒤 학교 수학의 선수개념과 비정형 추론을 함께 준비합니다.",
      eligibility: "K2, G1–12 · 학년별 다른 시험지",
      format: "K2: 60분·15문항 / G1–12: 90분·25문항",
      route: "학년 확인 → 준비 진단 → 유형 훈련 → 시간제한 모의 → 오답 복기",
      primary: "Grade 6 준비 진단 설계",
      sourceLabel: "SASMO 공식 정보 확인 ↗",
      source: "https://sasmo.simcc.org/",
      tone: "#4975ef"
    },
    amc: {
      type: "대회 목표",
      title: "AMC 8 준비",
      summary: "공식 참가 자격과 GFIELD 준비 권장 학년을 분리합니다. 25문항을 40분 안에 해결하는 중등 수학, 비정형 추론, 페이싱을 함께 훈련합니다.",
      eligibility: "공식 G8 이하·15.5세 미만 · GFIELD 권장 G6–8",
      format: "40분 · 25문항 · 5지선다 · 계산기 금지",
      route: "자격 확인 → 학교 스킬 진단 → AMC 영역 훈련 → 40분 모의 → 전략 복기",
      primary: "AMC 8 준비 진단 설계",
      sourceLabel: "MAA AMC 공식 정보 ↗",
      source: "https://maa.org/student-programs/amc/",
      tone: "#402b70"
    }
  };

  const rolePreviews = {
    student: {
      eyebrow: "STUDENT · TODAY",
      title: "오늘 해야 할 한 가지가 먼저 보입니다.",
      description: "현재 위치와 목표를 연결해 다음 수업, 연습, 유지 확인을 한 화면에 보여줍니다.",
      nav: ["오늘", "내 스킬 지도", "학습·재확인", "경시 도전", "성장 기록"],
      panel: `
        <div class="mini-product-top"><span>오늘의 경로</span><b>32분</b></div>
        <div class="mini-task primary-task"><small>01 · 개념</small><strong>비를 bar model로 표현하기</strong><span>12분 · Guided</span></div>
        <div class="mini-task"><small>02 · 적용</small><strong>같은 비, 다른 표현 6문제</strong><span>10분 · Practice</span></div>
        <div class="mini-task"><small>03 · 도전</small><strong>SASMO transfer set</strong><span>10분 · Challenge</span></div>`
    },
    teacher: {
      eyebrow: "TEACHER · CLASS EVIDENCE",
      title: "점수표를 수업 그룹으로 바꿉니다.",
      description: "문항·스킬·오류 근거를 보고 학생을 보정, 핵심, 심화 그룹으로 묶고 다음 과제와 유지 확인을 승인합니다.",
      nav: ["학급", "진단", "스킬 히트맵", "배정·개입", "유지 확인", "리포트"],
      panel: `
        <div class="mini-product-top"><span>Grade 6 · 18명</span><b>검토 4건</b></div>
        <div class="mini-task primary-task"><small>보정 그룹 · 5명</small><strong>비와 비례 선수개념</strong><span>배정 검토 →</span></div>
        <div class="mini-task"><small>핵심 그룹 · 9명</small><strong>식과 방정식 다중 표현</strong><span>유지 확인 D+7</span></div>
        <div class="mini-task"><small>심화 그룹 · 4명</small><strong>SASMO 비정형 전이</strong><span>교사용 해설 열기</span></div>`
    },
    parent: {
      eyebrow: "PARENT · GROWTH REPORT",
      title: "현재 위치와 다음 계획을 쉬운 말로 봅니다.",
      description: "시작점, 실제 성장, 남은 빈틈, 학교·경시 목표를 답이나 내부 데이터 없이 공유 가능한 리포트로 정리합니다.",
      nav: ["현재 위치", "이번 주 계획", "학교 준비도", "경시 준비도", "공유 리포트"],
      panel: `
        <div class="mini-product-top"><span>8월 성장 요약</span><b>KO · EN · 中文</b></div>
        <div class="mini-task primary-task"><small>강점</small><strong>기하 전이 문제에서 설명력이 좋아졌습니다.</strong><span>+14 · 7월 대비</span></div>
        <div class="mini-task"><small>보완</small><strong>비례식 전에 비의 의미를 다시 확인합니다.</strong><span>3주 계획</span></div>
        <div class="mini-task"><small>교사 코멘트</small><strong>다음 유지 확인 후 심화 배정을 검토합니다.</strong><span>PDF 공유</span></div>`
    }
  };

  function updateGoal(goalId) {
    const goal = goals[goalId];
    if (!goal) return;
    document.querySelectorAll("[data-goal]").forEach(function (button) {
      button.setAttribute("aria-selected", String(button.dataset.goal === goalId));
    });
    const detail = document.getElementById("goal-detail");
    detail.style.background = goal.tone;
    detail.style.boxShadow = "0 28px 70px rgba(11,29,46,.18)";
    document.getElementById("goal-type").textContent = goal.type;
    document.getElementById("goal-title").textContent = goal.title;
    document.getElementById("goal-summary").textContent = goal.summary;
    document.getElementById("goal-eligibility").textContent = goal.eligibility;
    document.getElementById("goal-format").textContent = goal.format;
    document.getElementById("goal-route").textContent = goal.route;
    document.getElementById("goal-primary").textContent = goal.primary;
    const source = document.getElementById("goal-source");
    source.textContent = goal.sourceLabel;
    source.href = goal.source;
  }

  function gradeLabel(grade) {
    return String(grade) === "K" ? "K" : `G${grade}`;
  }

  function statusFor(grade, domain, index) {
    if (String(grade) !== "6") return { label: "미진단", className: "not-assessed", fill: "empty-fill", value: 0, evidence: "평가 근거 없음" };
    const sample = {
      RP: { label: "보완 필요", className: "needs", fill: "needs-fill", value: 58, evidence: "8문항 · 선수개념 확인" },
      NS: { label: "학교 핵심", className: "ready", fill: "", value: 72, evidence: "9문항 · 유지 확인 예정" },
      EE: { label: "근거 부족", className: "not-assessed", fill: "", value: 64, evidence: "7문항 · 추가 근거 필요" },
      G: { label: "경시 전이", className: "needs", fill: "needs-fill", value: 86, evidence: "10문항 · 시간 전략 확인" },
      SP: { label: "깊은 숙달", className: "deep", fill: "deep-fill", value: 77, evidence: "8문항 · D+7 통과" }
    };
    return sample[domain] || { label: "근거 부족", className: "not-assessed", fill: "", value: 50 + index * 3, evidence: "추가 근거 필요" };
  }

  function renderGradeMap(grade) {
    const spine = window.GFIELDUSK8DomainSpine;
    const registry = window.GFIELDUSK8ContentRegistry;
    if (!spine || !registry) return;
    document.querySelectorAll("[data-grade-tab]").forEach(function (button) {
      button.setAttribute("aria-selected", String(button.dataset.gradeTab === String(grade)));
    });
    const domains = spine.gradeDomains[grade] || [];
    const units = registry.units.filter(function (unit) { return String(unit.grade) === String(grade); });
    document.getElementById("selected-grade").textContent = gradeLabel(grade);
    document.getElementById("grade-title").textContent = `${grade === "K" ? "Kindergarten" : `Grade ${grade}`} 영역별 근거`;
    document.getElementById("skill-rows").innerHTML = domains.map(function (domain, index) {
      const localized = spine.domainTitles[domain];
      const domainUnitCount = units.filter(function (unit) { return unit.domainCode === domain || String(unit.standardRange || "").includes(`.${domain}.`); }).length;
      const status = statusFor(grade, domain, index);
      return `<div class="skill-row">
        <div class="skill-name"><strong>${localized.ko}</strong><small>${domain} · ${domainUnitCount || "—"}개 클러스터 앵커 · ${status.evidence}</small></div>
        <div class="skill-meter" aria-label="${localized.ko} 샘플 지표 ${status.value}"><span class="${status.fill}" style="width:${status.value}%"></span></div>
        <div class="skill-state"><i class="${status.className}"></i>${status.label}</div>
      </div>`;
    }).join("");
    document.getElementById("map-footnote").textContent = `${grade === "K" ? "Kindergarten" : `Grade ${grade}`} · ${domains.length}개 영역 · ${units.length}개 클러스터 앵커`;
  }

  function buildGradeTabs() {
    const spine = window.GFIELDUSK8DomainSpine;
    if (!spine) return;
    const target = document.getElementById("grade-tabs");
    target.innerHTML = spine.gradeOrder.map(function (grade) {
      return `<button type="button" role="tab" data-grade-tab="${grade}" aria-selected="${String(grade) === "6"}">${gradeLabel(grade)}</button>`;
    }).join("");
  }

  function updateRole(roleId) {
    const role = rolePreviews[roleId];
    if (!role) return;
    document.querySelectorAll("[data-role-preview]").forEach(function (button) {
      button.setAttribute("aria-selected", String(button.dataset.rolePreview === roleId));
    });
    document.getElementById("role-eyebrow").textContent = role.eyebrow;
    document.getElementById("role-title").textContent = role.title;
    document.getElementById("role-description").textContent = role.description;
    document.getElementById("role-nav").innerHTML = role.nav.map(function (item) { return `<li>${item}</li>`; }).join("");
    document.getElementById("mini-product").innerHTML = role.panel;
  }

  document.addEventListener("click", function (event) {
    const goalButton = event.target.closest("[data-goal]");
    const gradeButton = event.target.closest("[data-grade-tab]");
    const roleButton = event.target.closest("[data-role-preview]");
    if (goalButton) updateGoal(goalButton.dataset.goal);
    if (gradeButton) renderGradeMap(gradeButton.dataset.gradeTab);
    if (roleButton) updateRole(roleButton.dataset.rolePreview);
  });

  buildGradeTabs();
  renderGradeMap("6");
  updateGoal("sasmo");
  updateRole("student");
})();
