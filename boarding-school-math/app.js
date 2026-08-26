(function () {
  "use strict";

  const catalog = window.GFIELDMathProgramCatalog;
  const spine = window.GFIELDUSK8DomainSpine;
  if (!catalog || !spine) throw new Error("GFIELD math foundation data failed to load");

  const copy = {
    ko: {
      eyebrow: "BOARDING SCHOOL MATHEMATICS · K–8",
      heroTitle: "학교 수학에서 경시까지, 하나의 성장 경로",
      heroCopy: "미국 K–8 핵심과정을 중심으로 싱가포르식 숙달, Math Kangaroo, SASMO, AMC 8 준비를 연결합니다. 진단 결과는 수업·과제·워크북·승급 판단의 같은 데이터로 이어집니다.",
      viewAs: "화면 구분", student: "학생용", teacher: "교사용", chooseGrade: "미국 학년",
      pathwayEyebrow: "PROGRAM PATHWAYS", pathwaysTitle: "선택 학년의 학습 경로", programCount: "개 경로",
      domainsTitle: "이 학년의 핵심 영역", source: "기준:", audienceEyebrow: "ROLE-BASED RESOURCES", resourcesTitle: "이 역할의 자료",
      promotionEyebrow: "PROMOTION & PLACEMENT", promotionTitle: "승급은 근거를 모아 결정합니다",
      promotionCopy: "공통기준이나 대회 참가조건을 임의의 ‘미국 공식 컷’으로 바꾸지 않습니다. 진단·단원 숙달·유지 확인·교사 검토를 모으고, 실제 컷은 학교가 버전별로 설정합니다.",
      previewTitle: "기반 미리보기", previewCopy: "학생 로그인과 실제 기록은 아직 연결하지 않았습니다. 공개 데이터 노출을 막는 새 인증 저장소 전환 후 활성화합니다.",
      active: "운영", planned: "예정", locked: "잠금", core: "핵심", accelerated: "심화", competition: "경시", bridge: "연결",
      evidence: ["진단", "단원 숙달", "유지 확인", "교사 검토"]
    },
    en: {
      eyebrow: "BOARDING SCHOOL MATHEMATICS · K–8", heroTitle: "One growth path from school math to competition",
      heroCopy: "US K–8 core standards connect to Singapore mastery, Math Kangaroo, SASMO, and AMC 8 preparation. Diagnosis, lessons, assignments, workbooks, and promotion decisions share one learning lineage.",
      viewAs: "View as", student: "Student", teacher: "Teacher", chooseGrade: "US grade",
      pathwayEyebrow: "PROGRAM PATHWAYS", pathwaysTitle: "Pathways for this grade", programCount: "pathways",
      domainsTitle: "Core domains for this grade", source: "Source:", audienceEyebrow: "ROLE-BASED RESOURCES", resourcesTitle: "Resources for this role",
      promotionEyebrow: "PROMOTION & PLACEMENT", promotionTitle: "Promotion requires multiple forms of evidence",
      promotionCopy: "Standards and contest eligibility are not presented as a national US cut score. Diagnosis, unit mastery, retention checks, and teacher review are combined; each school owns and versions its thresholds.",
      previewTitle: "Foundation preview", previewCopy: "Student login and real records are not connected yet. They activate only after migration to the new private authenticated store.",
      active: "Active", planned: "Planned", locked: "Locked", core: "Core", accelerated: "Accelerated", competition: "Competition", bridge: "Bridge",
      evidence: ["Diagnostic", "Unit mastery", "Retention check", "Teacher review"]
    },
    "zh-Hans": {
      eyebrow: "寄宿学校数学 · K–8", heroTitle: "从校内数学到竞赛的一体化成长路径",
      heroCopy: "以美国 K–8 核心标准为主线，衔接新加坡精熟学习、袋鼠数学、SASMO 与 AMC 8。诊断、课程、作业、练习册与晋级共用同一学习谱系。",
      viewAs: "查看身份", student: "学生", teacher: "教师", chooseGrade: "美国年级",
      pathwayEyebrow: "课程路径", pathwaysTitle: "本年级学习路径", programCount: "条路径",
      domainsTitle: "本年级核心领域", source: "依据：", audienceEyebrow: "分角色资源", resourcesTitle: "本角色资料",
      promotionEyebrow: "晋级与分班", promotionTitle: "依据多项证据决定晋级",
      promotionCopy: "不把课程标准或竞赛资格误称为美国全国统一分数线。综合诊断、单元掌握、保持性检查和教师评估，由学校自行设定并版本化门槛。",
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

  const state = { locale: "ko", role: "student", grade: "K" };
  const gradeValues = ["K", 1, 2, 3, 4, 5, 6, 7, 8];
  const local = function (value) { return value[state.locale] || value.en || value.ko; };
  const sameGrade = function (value) { return String(value) === String(state.grade); };

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

  function renderResources() {
    const resources = catalog.resourceRules[state.role];
    document.getElementById("resource-list").innerHTML = resources.map(function (resource) {
      return `<li>${local(resourceLabels[resource])}</li>`;
    }).join("");
  }

  function renderEvidence() {
    document.getElementById("evidence-flow").innerHTML = copy[state.locale].evidence.map(function (label) {
      return `<span>${label}</span>`;
    }).join("");
  }

  function render() {
    renderCopy(); renderGrades(); renderPrograms(); renderDomains(); renderResources(); renderEvidence();
    document.querySelectorAll("[data-locale]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.locale === state.locale)); });
    document.querySelectorAll("[data-role]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.role === state.role)); });
  }

  document.addEventListener("click", function (event) {
    const localeButton = event.target.closest("[data-locale]");
    const roleButton = event.target.closest("[data-role]");
    const gradeButton = event.target.closest("[data-grade]");
    if (localeButton) state.locale = localeButton.dataset.locale;
    if (roleButton) state.role = roleButton.dataset.role;
    if (gradeButton) state.grade = gradeButton.dataset.grade;
    if (localeButton || roleButton || gradeButton) render();
  });

  render();
})();
