(function () {
  "use strict";

  const catalog = window.GFIELDMathProgramCatalog;
  const spine = window.GFIELDUSK8DomainSpine;
  const registry = window.GFIELDUSK8ContentRegistry;
  const resourcePlan = window.GFIELDK8ResourcePlan;
  if (!catalog || !spine || !registry || !resourcePlan) throw new Error("GFIELD math foundation data failed to load");

  const copy = {
    ko: {
      eyebrow: "BOARDING SCHOOL MATHEMATICS · K–12 TARGET",
      heroTitle: "K–12 전체 경로, K–8 구현 상세",
      heroCopy: "전체 목표는 미국 K–12 학교 수학, 싱가포르식 숙달, Math Kangaroo, SASMO, AMC 8·10·12입니다. 이 상세 화면은 현재 검증된 K–8 영역·단원·자료 계획만 보여주며 G9–12 과정 지도와 실제 배정은 아직 잠금입니다.",
      viewAs: "화면 구분", student: "학생용", teacher: "교사용", chooseGrade: "미국 학년",
      pathwayEyebrow: "PROGRAM PATHWAYS", pathwaysTitle: "선택 학년의 학습 경로", programCount: "개 경로",
      domainsTitle: "이 학년의 핵심 영역", unitsTitle: "학년별 학습 단위", unitLocked: "앵커 스킬 · 검수 대기", source: "기준:", audienceEyebrow: "ROLE-BASED RESOURCES", resourcesTitle: "이 역할의 자료",
      promotionEyebrow: "PROMOTION & PLACEMENT", promotionTitle: "승급은 근거를 모아 결정합니다",
      promotionCopy: "공통기준이나 대회 참가조건을 임의의 ‘미국 공식 컷’으로 바꾸지 않습니다. 진단·단원 숙달·유지 확인·교사 검토를 모으고, 실제 컷은 학교가 버전별로 설정합니다.",
      resourceLocked: "콘텐츠·다운로드는 독립 검수와 인증 서명 전까지 잠금 상태입니다.", teacherMetadataOnly: "교사용 표시는 메타데이터 미리보기이며 로그인 권한이 아닙니다.", cadenceTitle: "수업 기본안", selectedUnit: "선택 단원", grade6Cadence: "단원당 3주 · 주 2회 · 회당 75분 · 가정학습 주 2회 30분 · 학교 조정 가능", grade6Retention: "유지 확인은 최소 7일 뒤 별도 시도로 예약됩니다.", templateCadence: "수업 시간과 회차는 학교별 설정 후 확정됩니다.", plannedComponents: "계획 구성",
      previewTitle: "기반 미리보기", previewCopy: "학생 로그인과 실제 기록은 아직 연결하지 않았습니다. 공개 데이터 노출을 막는 새 인증 저장소 전환 후 활성화합니다.",
      active: "운영", planned: "예정", locked: "잠금", core: "핵심", accelerated: "심화", competition: "경시", bridge: "연결",
      evidence: ["진단", "단원 숙달", "유지 확인", "교사 검토"]
    },
    en: {
      eyebrow: "BOARDING SCHOOL MATHEMATICS · K–12 TARGET", heroTitle: "A K–12 pathway with a verified K–8 foundation",
      heroCopy: "The full target connects US K–12 school math, Singapore mastery, Math Kangaroo, SASMO, and AMC 8/10/12. This detail view shows only the verified K–8 domain, unit, and resource-plan foundation; high-school course maps and assignments remain locked.",
      viewAs: "View as", student: "Student", teacher: "Teacher", chooseGrade: "US grade",
      pathwayEyebrow: "PROGRAM PATHWAYS", pathwaysTitle: "Pathways for this grade", programCount: "pathways",
      domainsTitle: "Core domains for this grade", unitsTitle: "Grade learning units", unitLocked: "Anchor skill · review pending", source: "Source:", audienceEyebrow: "ROLE-BASED RESOURCES", resourcesTitle: "Resources for this role",
      promotionEyebrow: "PROMOTION & PLACEMENT", promotionTitle: "Promotion requires multiple forms of evidence",
      promotionCopy: "Standards and contest eligibility are not presented as a national US cut score. Diagnosis, unit mastery, retention checks, and teacher review are combined; each school owns and versions its thresholds.",
      resourceLocked: "Content and downloads remain locked until independent review and authenticated signing.", teacherMetadataOnly: "Teacher display is a metadata preview, not a login or permission grant.", cadenceTitle: "Default lesson cadence", selectedUnit: "Selected unit", grade6Cadence: "3 weeks per unit · 2 meetings weekly · 75 minutes each · two 30-minute home blocks weekly · school configurable", grade6Retention: "Retention is scheduled as a separate attempt at least 7 days later.", templateCadence: "Lesson time and session count require school configuration.", plannedComponents: "planned components",
      previewTitle: "Foundation preview", previewCopy: "Student login and real records are not connected yet. They activate only after migration to the new private authenticated store.",
      active: "Active", planned: "Planned", locked: "Locked", core: "Core", accelerated: "Accelerated", competition: "Competition", bridge: "Bridge",
      evidence: ["Diagnostic", "Unit mastery", "Retention check", "Teacher review"]
    },
    "zh-Hans": {
      eyebrow: "寄宿学校数学 · K–12 目标", heroTitle: "K–12 全路径与已验证的 K–8 基础",
      heroCopy: "整体目标衔接美国 K–12 校内数学、新加坡精熟学习、袋鼠数学、SASMO 与 AMC 8/10/12。本页仅展示已验证的 K–8 领域、单元和资源规划；高中课程地图与实际分配仍保持锁定。",
      viewAs: "查看身份", student: "学生", teacher: "教师", chooseGrade: "美国年级",
      pathwayEyebrow: "课程路径", pathwaysTitle: "本年级学习路径", programCount: "条路径",
      domainsTitle: "本年级核心领域", unitsTitle: "年级学习单元", unitLocked: "锚点技能 · 等待审核", source: "依据：", audienceEyebrow: "分角色资源", resourcesTitle: "本角色资料",
      promotionEyebrow: "晋级与分班", promotionTitle: "依据多项证据决定晋级",
      promotionCopy: "不把课程标准或竞赛资格误称为美国全国统一分数线。综合诊断、单元掌握、保持性检查和教师评估，由学校自行设定并版本化门槛。",
      resourceLocked: "内容和下载在独立审核及认证签署完成前保持锁定。", teacherMetadataOnly: "教师显示仅为元数据预览，不构成登录或权限授予。", cadenceTitle: "默认课次安排", selectedUnit: "已选单元", grade6Cadence: "每单元 3 周 · 每周 2 次 · 每次 75 分钟 · 每周两次 30 分钟家庭学习 · 可由学校调整", grade6Retention: "保持性检查将在至少 7 天后作为独立尝试安排。", templateCadence: "课时与课次数量需由学校配置后确定。", plannedComponents: "计划组件",
      previewTitle: "基础预览", previewCopy: "学生登录与真实记录尚未连接。迁移到新的私有认证存储后才会启用。",
      active: "运行", planned: "计划", locked: "锁定", core: "核心", accelerated: "进阶", competition: "竞赛", bridge: "衔接",
      evidence: ["诊断", "单元掌握", "保持检查", "教师评估"]
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
  const state = { locale: "ko", role: "student", grade: "K", unitId: defaultUnitByGrade.K };
  const gradeValues = ["K", 1, 2, 3, 4, 5, 6, 7, 8];
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
      return `<button type="button" class="unit-item" data-unit-id="${unit.unitId}" aria-pressed="${unit.unitId === state.unitId}">
        <div><b>${local(unit.title)}</b><span>${unit.standardRange}</span></div>
        <small>${copy[state.locale].unitLocked}</small>
      </button>`;
    }).join("");
  }

  function renderResources() {
    const unit = selectedUnit();
    const plan = resourcePlan.buildUnitPlan(unit.unitId);
    const resources = resourcePlan.projectAudience(plan, state.role).resources;
    const grouped = new Map();
    resources.forEach(function (resource) {
      const existing = grouped.get(resource.resourceType) || { resourceType: resource.resourceType, levels: new Set(), components: 0, sessions: new Set() };
      existing.levels.add(resource.levelId);
      existing.sessions.add(resource.sessionId);
      resource.plannedComponents.forEach(function (component) { existing.components += component.plannedCount; });
      grouped.set(resource.resourceType, existing);
    });
    document.getElementById("resource-state").textContent = state.role === "teacher"
      ? `${copy[state.locale].resourceLocked} ${copy[state.locale].teacherMetadataOnly}`
      : copy[state.locale].resourceLocked;
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
    if (localeButton || roleButton || gradeButton || unitButton) render();
  });

  render();
})();
