(function () {
  "use strict";

  const requested = new URLSearchParams(window.location.search).get("locale");
  const locale = requested === "zh-Hans" ? "zh-Hans" : "en";
  const copy = {
    en: {
      skip: "Skip to main content",
      curriculumNav: "US Curriculum",
      title: "From Foundations to Competition.",
      lede: "Diagnose. Learn. Advance. G·MAP connects evidence from diagnosis and analysis to concept learning, targeted practice, mock assessment, and a next-step learning prescription. Use the student or teacher view to begin.",
      noteLabel: "TWO ROLES · ONE EVIDENCE PATH",
      noteTitle: "Students learn the next step. Teachers decide the next lesson.",
      noteCopy: "The same evidence is presented differently for students and teachers. This page does not create accounts or publish private records.",
      startTitle: "Choose one clear starting point.",
      startCopy: "The curriculum directory is available in English and Simplified Chinese for Singapore. It separates student and teacher workflows before any private assessment or record is opened.",
      studentTitle: "Student view",
      studentCopy: "Choose a US grade and mathematical domain. Follow a clear sequence from concept learning to focused practice and recheck.",
      studentAction: "Open the student learning map",
      teacherTitle: "Teacher view",
      teacherCopy: "Review grade, domain, course pathway, planned resources, and the evidence-to-instruction sequence before assigning materials.",
      teacherAction: "Open the teacher planning map",
      sasmoTitle: "SASMO past papers",
      sasmoCopy: "Start with the year and level. Original English papers remain on the source site; GFIELD does not reproduce or translate the papers here.",
      sasmoAction: "Open the SASMO source index",
      methodTitle: "Diagnosis is the beginning of instruction.",
      methodCopy: "A score alone is not a learning plan. The program keeps the six steps visible so that students and teachers can see what happens next.",
      method: [
        ["Diagnostic", "Collect evidence by grade, domain, skill, response type, and error pattern."],
        ["Analysis", "Read strengths, gaps, and likely error patterns rather than relying on one total score."],
        ["Learning prescription", "Set the next learning priority: prerequisite repair, core practice, or extension."],
        ["Concept learning", "Build meaning through clear explanations, visual models, and worked examples."],
        ["Targeted practice", "Use focused sets or a custom workbook only after content review is complete."],
        ["Mock assessment and recheck", "Check retention and transfer, then let the teacher review the next placement decision."]
      ],
      usTitle: "US Curriculum — see both the course route and the mathematical domain.",
      usCopy: "The public map lets students and teachers browse K to Grade 8 by grade and domain, then view high-school mathematics as a course pathway. A course name alone does not make a placement decision.",
      courses: ["K", "G1–G8", "Pre-Algebra", "Algebra 1", "Geometry", "Algebra 2", "Precalculus"],
      cycleTitle: "Each domain follows one visible learning cycle",
      cycleCopy: "Concept → Diagnostic → Clinic → Workbook → Check",
      domains: [
        ["Number & Operations", "Quantity, computation, and number sense"],
        ["Ratios", "Rates, proportional relationships, and scale"],
        ["Algebraic Thinking", "Patterns, expressions, equations, and functions"],
        ["Geometry", "Shape, space, measurement relationships, and proof habits"],
        ["Measurement", "Units, quantities, area, volume, and conversion"],
        ["Data & Probability", "Data displays, variability, chance, and inference"]
      ],
      availability: "Availability note: the public map and reviewed concept lessons are open. Private diagnostics, clinic assignments, and custom workbooks remain review-gated and are not presented as live student services.",
      curriculumAction: "Browse the US Curriculum map",
      scopeTitle: "One map for Singapore-style mastery and competition readiness.",
      scope: [
        ["US school mathematics", "K–8 by grade and domain; high-school paths by course, from Pre-Algebra through Precalculus."],
        ["Singapore mathematics", "Model-based understanding, mastery, error reflection, and non-routine transfer — not a claim to be an official curriculum."],
        ["Competition pathways", "Math Kangaroo, SASMO, and AMC 8 → 10 → 12 stay separate from school placement."],
        ["SASMO levels", "Current eligibility is K2 and Grades 1–12; year-by-year historical access is shown only where a source link is verified."]
      ],
      sourceTitle: "About SASMO sources",
      sourceCopy: "The interface and GFIELD-authored learning design can be localized. Official or third-party original contest papers remain on their source site in English.",
      sourceAction: "Open the external SASMO index",
      koreanHome: "Korean home"
    },
    "zh-Hans": {
      skip: "跳到主要内容",
      curriculumNav: "美国课程",
      title: "从基础概念到数学竞赛",
      lede: "诊断 · 学习 · 进阶。G·MAP 将学习诊断与学情分析所得的证据，衔接到概念学习、专项补强、模拟测验和下一步个性化学习方案。请选择学生版或教师版开始。",
      noteLabel: "学生版与教师版 · 同一条证据路径",
      noteTitle: "学生看下一步学什么，教师看下一节怎么教。",
      noteCopy: "同一份学习证据会以不同方式呈现给学生和教师。本页不创建账号，也不公开任何个人学习记录。",
      startTitle: "先选一个清楚的入口。",
      startCopy: "课程与题库导航现已提供英文和面向新加坡学习者的简体中文。进入私密诊断或学生记录之前，先分开学生版与教师版的学习流程。",
      studentTitle: "学生版",
      studentCopy: "选择美国年级与数学领域，按“概念学习 → 专项补强 → 成效检验”的清楚顺序学习。",
      studentAction: "打开学生学习地图",
      teacherTitle: "教师版",
      teacherCopy: "先查看年级、领域、课程路径、计划中的教学资源，以及“证据如何转化为教学”的过程，再安排学习材料。",
      teacherAction: "打开教师教学规划地图",
      sasmoTitle: "SASMO 历届试题",
      sasmoCopy: "从年份与参赛年级开始。英文原题保留在原始网站；GFIELD 不在这里复制或翻译竞赛试题。",
      sasmoAction: "打开 SASMO 试题来源目录",
      methodTitle: "诊断不是终点，而是教学的起点。",
      methodCopy: "一个总分不能代替学习计划。六个步骤会一直清楚呈现，让学生和教师都知道下一步是什么。",
      method: [
        ["学习诊断", "按年级、领域、技能、作答方式与错因收集学习证据。"],
        ["学情分析", "不只看总分，同时了解强项、缺口与可能的错因。"],
        ["个性化学习方案", "确定下一项重点：补足先备知识、巩固核心技能，或进行进阶拓展。"],
        ["概念学习", "通过清楚讲解、可视化模型与完整例题建立理解。"],
        ["专项补强", "通过内容审核后，才使用针对性练习或个性化练习册。"],
        ["模拟测验与成效检验", "检查保持与迁移，再由教师结合证据评估下一步学习安排。"]
      ],
      usTitle: "美国课程：同时查看课程路径与数学领域。",
      usCopy: "公开地图让学生与教师按年级与领域浏览 K 至 Grade 8；高中数学则按课程路径查看。不能只凭课程名称决定分班或升读。",
      courses: ["K", "G1–G8", "Pre-Algebra", "Algebra 1", "Geometry", "Algebra 2", "Precalculus"],
      cycleTitle: "每个领域都遵循同一条清楚的学习循环",
      cycleCopy: "概念学习 → 学习诊断 → 专项补强 → 个性化练习册 → 成效检验",
      domains: [
        ["数与运算", "数量、计算与数感"],
        ["比与比例", "比率、比例关系与比例尺"],
        ["代数思维", "规律、式、方程与函数"],
        ["几何", "图形、空间、测量关系与证明习惯"],
        ["测量", "单位、量、面积、体积与换算"],
        ["数据与概率", "数据表示、变异、随机与推断"]
      ],
      availability: "开放范围说明：公开地图与已审核的概念学习可查看。私密诊断、弱项辅导安排和个性化练习册仍需完成审核，不会被表述成已经开放的学生服务。",
      curriculumAction: "浏览美国课程地图",
      scopeTitle: "一张学习地图，连接新加坡式精熟学习与竞赛准备。",
      scope: [
        ["美国校内数学", "K–8 按年级与领域查看；高中按课程查看，从 Pre-Algebra 到 Precalculus。"],
        ["新加坡式数学学习", "以模型理解、精熟、错因反思与非套路迁移为重点；不宣称是官方课程。"],
        ["竞赛准备路径", "Math Kangaroo、SASMO 与 AMC 8 → 10 → 12 和校内分班保持分开。"],
        ["SASMO 参赛年级", "当前参赛范围为 K2 至 Grade 12；历届资料只在已核实来源链接的年份与年级显示。"]
      ],
      sourceTitle: "关于 SASMO 资料来源",
      sourceCopy: "界面说明与 GFIELD 自编学习设计可以本地化。官方或第三方的竞赛英文原题仍由原始网站提供。",
      sourceAction: "打开外部 SASMO 资料目录",
      koreanHome: "返回韩文首页"
    }
  };
  const current = copy[locale];
  document.documentElement.lang = locale;
  document.title = locale === "zh-Hans" ? "G·MAP · GFIELD 数学评估与学习路径" : "G·MAP · GFIELD Math Assessment & Pathway";
  document.querySelectorAll("[data-copy]").forEach(function (node) {
    const value = current[node.dataset.copy];
    if (typeof value === "string") node.textContent = value;
  });
  document.querySelectorAll("[data-locale-link]").forEach(function (link) {
    if (link.dataset.localeLink === locale) link.setAttribute("aria-current", "page");
  });
  const localeParam = encodeURIComponent(locale);
  document.querySelectorAll("[data-route]").forEach(function (link) {
    link.href = `./catalog.html?locale=${localeParam}&role=${link.dataset.route}`;
  });
  const methodHost = document.getElementById("method-grid");
  methodHost.replaceChildren(...current.method.map(function (row) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const detail = document.createElement("span");
    title.textContent = row[0]; detail.textContent = row[1]; item.append(title, detail); return item;
  }));
  const scopeHost = document.getElementById("scope-list");
  scopeHost.replaceChildren(...current.scope.map(function (row) {
    const item = document.createElement("article");
    const title = document.createElement("b");
    const detail = document.createElement("span");
    title.textContent = row[0]; detail.textContent = row[1]; item.append(title, detail); return item;
  }));
  const courseHost = document.getElementById("course-rail");
  courseHost.replaceChildren(...current.courses.map(function (course) {
    const item = document.createElement("span"); item.textContent = course; return item;
  }));
  const domainHost = document.getElementById("domain-grid");
  domainHost.replaceChildren(...current.domains.map(function (row) {
    const item = document.createElement("article");
    const title = document.createElement("b");
    const detail = document.createElement("span");
    title.textContent = row[0]; detail.textContent = row[1]; item.append(title, detail); return item;
  }));
})();
