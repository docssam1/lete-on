(function () {
  "use strict";

  const catalog = window.GFIELDMathProgramCatalog;
  const spine = window.GFIELDUSK8DomainSpine;
  const registry = window.GFIELDUSK8ContentRegistry;
  const resourcePlan = window.GFIELDK8ResourcePlan;
  if (!catalog || !spine || !registry || !resourcePlan) throw new Error("GFIELD math foundation data failed to load");

  const copy = {
    ko: {
      eyebrow: "CURRICULUM & PROBLEM BANK · K–12 PATHWAY",
      heroTitle: "학년별 교과와 문제은행을 한곳에서",
      heroCopy: "학년과 영역을 고르면 공개된 교과 자료를 볼 수 있습니다. 시험지를 만들려면 교사용 편집 화면을 여세요.",
      teacherBuilder: "교사용 문제 선택·시험지 편집 →", viewAs: "자료 보기", student: "학생용", teacher: "교사용", chooseGrade: "미국 학년",
      pathwayEyebrow: "LEARNING PATHWAYS", pathwaysTitle: "선택 학년의 교과·경시 경로", programCount: "개 경로",
      domainsTitle: "이 학년에서 다루는 영역", unitsTitle: "단원과 기준", unitLocked: "앵커 스킬 · 문항 준비 중", source: "기준:", audienceEyebrow: "STUDENT & TEACHER MATERIALS", resourcesTitle: "선택한 역할의 자료",
      promotionEyebrow: "DIAGNOSE → RECHECK", promotionTitle: "진단에서 클리닉·개념·워크북·재확인까지",
      promotionCopy: "영역·문항별 근거를 분석해 약점 클리닉과 개념 학습 순서를 정하고, 검수된 맞춤 워크북으로 연습한 뒤 다시 확인합니다. 승급과 반 배정은 이 근거와 교사 판단을 함께 사용합니다.",
      resourceLocked: "문항과 다운로드 자료는 검수 완료 후 학생 또는 교사 화면에 열립니다.", teacherMetadataOnly: "교사용 화면은 현재 자료 구성과 수업 흐름을 보여 줍니다.", cadenceTitle: "수업 구성", selectedUnit: "선택 단원", grade6Cadence: "단원당 3주 · 주 2회 · 회당 75분 · 가정학습 주 2회 30분", grade6Retention: "유지 확인은 단원 학습 뒤 최소 7일 후 진행합니다.", templateCadence: "수업 시간과 회차는 학교 일정에 맞춰 정합니다.", plannedComponents: "구성 항목",
      previewTitle: "문제은행 준비 현황", previewCopy: "현재는 학년별 교과 구조와 자료 구성을 확인하는 화면입니다. 검수된 문항부터 학생·교사 계정에 순차적으로 연결합니다.",
      active: "운영", planned: "예정", locked: "잠금", core: "핵심", accelerated: "심화", competition: "경시", bridge: "연결",
      evidence: ["진단", "영역·문항 분석", "약점 클리닉", "개념 학습", "맞춤 워크북", "재확인"]
    },
    en: {
      eyebrow: "BOARDING SCHOOL MATHEMATICS · K–12 TARGET", heroTitle: "A K–12 pathway with a verified K–8 foundation",
      heroCopy: "The full target connects US K–12 school math, Singapore mastery, Math Kangaroo, SASMO, and AMC 8/10/12. Choose a grade and domain to see the support sequence from diagnosis and analysis through clinic, concept learning, a custom workbook, and recheck.",
      teacherBuilder: "Select questions and edit a paper →", viewAs: "View as", student: "Student", teacher: "Teacher", chooseGrade: "US grade",
      pathwayEyebrow: "PROGRAM PATHWAYS", pathwaysTitle: "Pathways for this grade", programCount: "pathways",
      domainsTitle: "Core domains for this grade", unitsTitle: "Grade learning units", unitLocked: "Anchor skill · review pending", source: "Source:", audienceEyebrow: "ROLE-BASED RESOURCES", resourcesTitle: "Resources for this role",
      promotionEyebrow: "DIAGNOSE → RECHECK", promotionTitle: "From diagnosis to clinic, concepts, workbook, and recheck",
      promotionCopy: "Domain and item evidence sets the order of weakness clinics and concept learning. Students then use independently reviewed custom workbooks and recheck their learning. Promotion still combines this evidence with teacher review and school policy.",
      resourceLocked: "Content and downloads remain locked until independent review and authenticated signing.", teacherMetadataOnly: "Teacher display is a metadata preview, not a login or permission grant.", cadenceTitle: "Default lesson cadence", selectedUnit: "Selected unit", grade6Cadence: "3 weeks per unit · 2 meetings weekly · 75 minutes each · two 30-minute home blocks weekly · school configurable", grade6Retention: "Retention is scheduled as a separate attempt at least 7 days later.", templateCadence: "Lesson time and session count require school configuration.", plannedComponents: "planned components",
      previewTitle: "Foundation preview", previewCopy: "Student login and real records are not connected yet. They activate only after migration to the new private authenticated store.",
      active: "Active", planned: "Planned", locked: "Locked", core: "Core", accelerated: "Accelerated", competition: "Competition", bridge: "Bridge",
      evidence: ["Diagnosis", "Domain and item analysis", "Weakness clinic", "Concept learning", "Custom workbook", "Recheck"]
    },
    "zh-Hans": {
      eyebrow: "寄宿学校数学 · K–12 目标", heroTitle: "K–12 全路径与已验证的 K–8 基础",
      heroCopy: "整体目标衔接美国 K–12 校内数学、新加坡精熟学习、袋鼠数学、SASMO 与 AMC 8/10/12。选择年级和领域后，可查看从诊断、分析、弱项辅导、概念学习、个性化练习册到再次确认的支持流程。",
      teacherBuilder: "教师选题与试卷编辑 →", viewAs: "选择视图", student: "学生版", teacher: "教师版", chooseGrade: "美国年级",
      pathwayEyebrow: "课程路径", pathwaysTitle: "本年级学习路径", programCount: "条路径",
      domainsTitle: "本年级核心领域", unitsTitle: "年级学习单元", unitLocked: "锚点技能 · 等待审核", source: "依据：", audienceEyebrow: "分角色学习资源", resourcesTitle: "本角色的学习资源",
      promotionEyebrow: "学习诊断 → 学情分析 → 个性化学习方案 → 成效检验", promotionTitle: "从诊断到专项补强、概念学习、练习册与成效检验",
      promotionCopy: "按领域和题目证据安排弱项辅导与概念学习，使用通过独立审核的个性化练习册练习后再次确认。晋级仍需结合教师评估与学校政策。",
      resourceLocked: "内容和下载在独立审核及认证签署完成前保持锁定。", teacherMetadataOnly: "教师显示仅为元数据预览，不构成登录或权限授予。", cadenceTitle: "默认课次安排", selectedUnit: "已选单元", grade6Cadence: "每单元 3 周 · 每周 2 次 · 每次 75 分钟 · 每周两次 30 分钟家庭学习 · 可由学校调整", grade6Retention: "保持性检查将在至少 7 天后作为独立尝试安排。", templateCadence: "课时与课次数量需由学校配置后确定。", plannedComponents: "计划组件",
      previewTitle: "基础预览", previewCopy: "学生登录与真实记录尚未连接。迁移到新的私有认证存储后才会启用。",
      active: "运行", planned: "计划", locked: "锁定", core: "核心", accelerated: "进阶", competition: "竞赛", bridge: "衔接",
      evidence: ["诊断", "领域与题目分析", "弱项辅导", "概念学习", "个性化练习册", "再次确认"]
    }
  };

  const resourceLabels = {
    "concept-workbook": { ko: "개념 워크북", en: "Concept workbook", "zh-Hans": "概念练习册" },
    "guided-practice": { ko: "단계별 연습", en: "Guided practice", "zh-Hans": "分步练习" },
    homework: { ko: "가정 과제", en: "Homework", "zh-Hans": "家庭作业" }, quiz: { ko: "퀴즈", en: "Quiz", "zh-Hans": "小测" },
    test: { ko: "시험지", en: "Test", "zh-Hans": "测试卷" }, "student-report": { ko: "학생 리포트", en: "Student report", "zh-Hans": "学生报告" },
    "lesson-plan": { ko: "수업 교안", en: "Lesson plan", "zh-Hans": "教案" }, "answer-key": { ko: "정답지", en: "Answer key", "zh-Hans": "答案" },
    "solution-guide": { ko: "해설지", en: "Solution guide", "zh-Hans": "解析" }, rubric: { ko: "평가 루브릭", en: "Assessment rubric", "zh-Hans": "评价量规" },
    "assignment-builder": { ko: "과제 생성기", en: "Assignment builder", "zh-Hans": "作业生成器" }, "teacher-report": { ko: "교사용 분석", en: "Teacher report", "zh-Hans": "教师分析" }
  };

  const defaultUnitByGrade = Object.freeze({
    K: "ccss-k-cc-a", 1: "ccss-1-oa-a", 2: "ccss-2-oa-a", 3: "ccss-3-oa-a", 4: "ccss-4-oa-a",
    5: "ccss-5-oa-a", 6: "ccss-6-rp-a", 7: "ccss-7-rp-a", 8: "ccss-8-ns-a"
  });
  const releasedUnitWorkbooks = Object.freeze({
    "7.RP.A": Object.freeze({ itemCount: 36, recheckCount: 8 }),
    "7.NS.A": Object.freeze({ itemCount: 36, recheckCount: 8 })
  });
  function releasedLearningFlow(unit, release) {
    const diagnosticDetail = unit.clusterId === "7.NS.A"
      ? { ko: "18문항 제작·독립 검수 대기", en: "18 items awaiting authoring and independent review", "zh-Hans": "18题等待编写并接受独立审核" }
      : { ko: "진단 문항 별도 검수 중", en: "Diagnostic items under separate review", "zh-Hans": "诊断题目正在单独审核" };
    const labels = {
      ko: {
        title: "이 단원의 학습 순서",
        available: "지금 가능", locked: "준비 중", conditional: "완료 후",
        stages: [
          ["진단", diagnosticDetail.ko, "locked"],
          ["교사 분석", "진단 검토가 끝난 뒤 열림", "locked"],
          ["처방·로드맵", "약점·기간·일일 학습량은 교사 확정 뒤 배정", "locked"],
          ["개념 학습", "워크북 안의 단원 개념 페이지", "available"],
          ["단원 워크북", `${release.itemCount}문항 학습`, "available"],
          ["재확인", `워크북 완료 뒤 ${release.recheckCount}문항`, "conditional"]
        ]
      },
      en: {
        title: "Learning sequence for this unit",
        available: "Available", locked: "Planned", conditional: "After completion",
        stages: [
          ["Diagnostic", diagnosticDetail.en, "locked"],
          ["Teacher analysis", "Opens after reviewed diagnostic evidence", "locked"],
          ["Prescription & roadmap", "Weakness targets, schedule, and daily load after teacher approval", "locked"],
          ["Concept learning", "Unit concept pages inside the workbook", "available"],
          ["Unit workbook", `${release.itemCount} reviewed practice items`, "available"],
          ["Recheck", `${release.recheckCount} items after workbook completion`, "conditional"]
        ]
      },
      "zh-Hans": {
        title: "本单元学习顺序",
        available: "现可使用", locked: "准备中", conditional: "完成后开放",
        stages: [
          ["诊断", diagnosticDetail["zh-Hans"], "locked"],
          ["教师分析", "诊断证据审核完成后开放", "locked"],
          ["处方与学习路线", "教师确认后安排薄弱点、学习周期与每日学习量", "locked"],
          ["概念学习", "练习册内的单元概念页面", "available"],
          ["单元练习册", `${release.itemCount}道已审核练习题`, "available"],
          ["再次检测", `完成练习册后开放${release.recheckCount}题`, "conditional"]
        ]
      }
    };
    return labels[state.locale];
  }
  const gradeValues = ["K", 1, 2, 3, 4, 5, 6, 7, 8];
  const search = new URLSearchParams(window.location.search);
  const requestedRole = search.get("role");
  const requestedGrade = search.get("grade");
  const requestedCluster = search.get("cluster");
  const requestedLocale = search.get("locale");
  const requestedUnit = registry.units.find(function (unit) { return unit.clusterId === requestedCluster; });
  const initialRole = ["student", "teacher"].includes(requestedRole) ? requestedRole : "student";
  const initialGrade = requestedUnit ? requestedUnit.grade : gradeValues.some(function (grade) { return String(grade) === String(requestedGrade); }) ? requestedGrade : "K";
  const initialLocale = ["ko", "en", "zh-Hans"].includes(requestedLocale) ? requestedLocale : "ko";
  const state = { locale: initialLocale, role: initialRole, grade: initialGrade, unitId: requestedUnit ? requestedUnit.unitId : defaultUnitByGrade[initialGrade] };
  const local = function (value) { return value[state.locale] || value.en || value.ko; };
  const sameGrade = function (value) { return String(value) === String(state.grade); };
  function selectedUnit() {
    const unit = registry.units.find(function (candidate) { return candidate.unitId === state.unitId && sameGrade(candidate.grade); });
    if (unit) return unit;
    const fallbackId = defaultUnitByGrade[state.grade];
    const fallback = registry.units.find(function (candidate) { return candidate.unitId === fallbackId && sameGrade(candidate.grade); });
    if (!fallback) throw new Error("Selected unit is not registered for the selected grade");
    state.unitId = fallback.unitId;
    return fallback;
  }

  function renderCopy() {
    document.documentElement.lang = state.locale;
    document.querySelectorAll("[data-copy]").forEach(function (node) {
      const value = copy[state.locale][node.dataset.copy];
      if (typeof value === "string") node.textContent = value;
    });
  }

  function renderGrades() {
    const host = document.getElementById("grade-switch");
    host.innerHTML = gradeValues.map(function (grade) {
      return `<button type="button" data-grade="${grade}" aria-pressed="${sameGrade(grade)}">${grade}</button>`;
    }).join("");
  }

  function renderPrograms() {
    const programs = catalog.programs.filter(function (program) {
      return program.status.state !== "locked" && program.grades.some(sameGrade);
    });
    document.getElementById("program-count").textContent = `${programs.length} ${copy[state.locale].programCount}`;
    document.getElementById("program-grid").innerHTML = programs.map(function (program) {
      const gradeText = program.grades.map(String).join(" · ");
      return `<article class="program-card" data-pathway="${program.pathway}">
        <div class="card-meta"><span>${copy[state.locale][program.pathway]}</span><span>${copy[state.locale][program.status.state]}</span></div>
        <div><h3>${local(program.title)}</h3><p>${gradeText}</p></div>
      </article>`;
    }).join("");
  }

  function renderDomains() {
    const row = spine.grades.find(function (item) { return sameGrade(item.grade); });
    document.getElementById("domain-list").innerHTML = row.domains.map(function (domain) {
      return `<div class="domain-item"><b>${local(domain.title)}</b><span>${domain.standardPrefix}</span></div>`;
    }).join("");
  }

  function renderUnits() {
    const units = registry.units.filter(function (unit) { return sameGrade(unit.grade); });
    document.getElementById("unit-list").innerHTML = units.map(function (unit) {
      const released = Boolean(releasedUnitWorkbooks[unit.clusterId]);
      return `<button type="button" class="unit-item" data-unit-id="${unit.unitId}" aria-pressed="${unit.unitId === state.unitId}">
        <div><b>${local(unit.title)}</b><span>${unit.standardRange}</span></div>
        <small>${released ? (state.locale === "ko" ? "공개 워크북" : state.locale === "zh-Hans" ? "已发布练习册" : "Published workbook") : copy[state.locale].unitLocked}</small>
      </button>`;
    }).join("");
  }

  function renderResources() {
    const unit = selectedUnit();
    const plan = resourcePlan.buildUnitPlan(unit.unitId);
    const resources = resourcePlan.projectAudience(plan, state.role).resources;
    const release = releasedUnitWorkbooks[unit.clusterId];
    const grouped = new Map();
    resources.forEach(function (resource) {
      const existing = grouped.get(resource.resourceType) || { resourceType: resource.resourceType, levels: new Set(), components: 0, sessions: new Set() };
      existing.levels.add(resource.levelId);
      existing.sessions.add(resource.sessionId);
      resource.plannedComponents.forEach(function (component) { existing.components += component.plannedCount; });
      grouped.set(resource.resourceType, existing);
    });
    const stateNode = document.getElementById("resource-state");
    if (release) {
      const href = `./unit-workbook.html?cluster=${encodeURIComponent(unit.clusterId)}&mode=workbook&audience=${state.role}&locale=${encodeURIComponent(state.locale)}&paper=A4`;
      const label = state.locale === "ko" ? (state.role === "teacher" ? `${unit.clusterId} 교사용 지도서 열기` : `${unit.clusterId} 학생용 단원 워크북 열기`) : state.locale === "zh-Hans" ? (state.role === "teacher" ? `打开 ${unit.clusterId} 教师教学指南` : `打开 ${unit.clusterId} 学生单元练习册`) : (state.role === "teacher" ? `Open ${unit.clusterId} teacher guide` : `Open ${unit.clusterId} student unit workbook`);
      const note = state.locale === "ko" ? `${release.itemCount}문항 단원 워크북과 ${release.recheckCount}문항 재확인이 공개되어 있습니다. 진단·자동 배정은 별도 검수 상태입니다.` : state.locale === "zh-Hans" ? `${release.itemCount}题单元练习册和${release.recheckCount}题复测已发布；诊断与自动分配仍处于单独审核状态。` : `The ${release.itemCount}-item unit workbook and ${release.recheckCount}-item recheck are published; diagnosis and automatic assignment remain separately reviewed.`;
      const flowData = releasedLearningFlow(unit, release);
      const noteNode = document.createElement("p");
      noteNode.className = "resource-note";
      noteNode.textContent = note;
      const flow = document.createElement("section");
      flow.className = "resource-flow";
      flow.setAttribute("aria-labelledby", "resource-flow-title");
      const flowTitle = document.createElement("h3");
      flowTitle.id = "resource-flow-title";
      flowTitle.textContent = flowData.title;
      const flowList = document.createElement("ol");
      flowList.className = "resource-flow-list";
      flowData.stages.forEach(function (stage, index) {
        const item = document.createElement("li");
        item.dataset.flowStage = String(index + 1);
        item.dataset.state = stage[2];
        const number = document.createElement("span");
        number.className = "flow-step-number";
        number.textContent = String(index + 1).padStart(2, "0");
        const body = document.createElement("span");
        body.className = "flow-step-body";
        const name = document.createElement("b"); name.textContent = stage[0];
        const detail = document.createElement("span"); detail.textContent = stage[1];
        body.append(name, detail);
        const status = document.createElement("span");
        status.className = "flow-step-status";
        status.textContent = flowData[stage[2]];
        item.append(number, body, status);
        flowList.append(item);
      });
      flow.append(flowTitle, flowList);
      stateNode.replaceChildren(noteNode, flow);
      const link = document.createElement("a"); link.href = href; link.textContent = label; stateNode.append(link);
    } else stateNode.textContent = state.role === "teacher" ? `${copy[state.locale].resourceLocked} ${copy[state.locale].teacherMetadataOnly}` : copy[state.locale].resourceLocked;
    const cadence = document.getElementById("cadence-summary");
    cadence.innerHTML = `<strong>${copy[state.locale].cadenceTitle}</strong><span>${copy[state.locale].selectedUnit}: ${local(unit.title)} · ${unit.clusterId}</span><span>${plan.cadence ? copy[state.locale].grade6Cadence : copy[state.locale].templateCadence}</span>${plan.retentionSchedule ? `<span>${copy[state.locale].grade6Retention}</span>` : ""}`;
    document.getElementById("resource-list").innerHTML = [...grouped.values()].map(function (resource) {
      const levels = [...resource.levels].map(function (level) { return copy[state.locale][level]; }).join(" · ");
      return `<li><div><b>${local(resourceLabels[resource.resourceType])}</b><span>${levels} · ${resource.components} ${copy[state.locale].plannedComponents}</span></div></li>`;
    }).join("");
  }

  function renderEvidence() {
    document.getElementById("evidence-flow").innerHTML = copy[state.locale].evidence.map(function (label) {
      return `<span>${label}</span>`;
    }).join("");
  }

  function render() {
    renderCopy(); renderGrades(); renderPrograms(); renderDomains(); renderUnits(); renderResources(); renderEvidence();
    document.querySelectorAll("[data-locale]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.locale === state.locale)); });
    document.querySelectorAll("[data-role]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.role === state.role)); });
  }

  function syncUrl() {
    const params = new URLSearchParams(window.location.search);
    params.set("role", state.role);
    params.set("grade", String(state.grade));
    params.set("cluster", selectedUnit().clusterId);
    params.set("locale", state.locale);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }

  document.addEventListener("click", function (event) {
    const localeButton = event.target.closest("[data-locale]");
    const roleButton = event.target.closest("[data-role]");
    const gradeButton = event.target.closest("[data-grade]");
    const unitButton = event.target.closest("[data-unit-id]");
    if (localeButton) state.locale = localeButton.dataset.locale;
    if (roleButton) state.role = roleButton.dataset.role;
    if (gradeButton) {
      state.grade = gradeButton.dataset.grade;
      state.unitId = defaultUnitByGrade[state.grade];
    }
    if (unitButton) {
      const unit = registry.units.find(function (candidate) { return candidate.unitId === unitButton.dataset.unitId && sameGrade(candidate.grade); });
      if (unit) state.unitId = unit.unitId;
    }
    if (localeButton || roleButton || gradeButton || unitButton) { render(); syncUrl(); }
  });

  render();
})();
