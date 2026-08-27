(function () {
  "use strict";

  const planData = window.GFIELDGrade6PlacementPlan;
  const registry = window.GFIELDUSK8ContentRegistry;
  if (!planData || !registry) throw new Error("Grade 6 diagnostic blueprint data failed to load");

  const plan = planData.plan;
  const state = { role: "teacher" };
  const labels = {
    difficulty: { foundation: "기초 근거", core: "핵심 근거", advanced: "심화 전이" },
    response: { "multiple-choice": "선택형", numeric: "수치 응답", "short-answer": "단답형", "constructed-response": "서술형" },
    scoring: { automatic: "자동 채점 후보", teacher: "교사 검토 필요" },
    domains: { "G6-RP": "비와 비례", "G6-NS": "수 체계", "G6-EE": "식과 방정식", "G6-G": "기하", "G6-SP": "통계와 확률" }
  };
  const roleCopy = {
    teacher: {
      label: "교사용 · 설계와 확인",
      title: "교사는 점수보다 근거의 빈칸을 먼저 봅니다.",
      copy: "42개의 잠긴 슬롯이 Grade 6 전 영역에 고르게 놓였는지 확인하고, 검수된 문항만 배정 후보로 올립니다. 이 화면은 수업 배정이나 승급을 실행하지 않습니다.",
      steps: ["배치 목적 확인", "문항·권리 검수", "인증된 평가 배정", "영역별 근거 검토", "수업·유지 확인 계획"]
    },
    student: {
      label: "학생용 · 평가 흐름",
      title: "학생은 배정된 평가와 다음 학습만 봅니다.",
      copy: "실제 평가는 교사가 배정한 뒤에만 열립니다. 학생 화면에는 정답, 채점 규칙, 다른 학생 기록, 학교의 내부 판단 기준이 나타나지 않습니다.",
      steps: ["교사 배정 확인", "인증된 평가 응시", "나의 영역별 피드백", "다음 수업·연습", "7일 뒤 유지 확인"]
    },
    parent: {
      label: "보호자용 · 해석 안내",
      title: "보호자는 한 줄 점수보다 학습 방향을 봅니다.",
      copy: "리포트는 영역별 근거와 다음 학습 우선순위를 설명합니다. 대회 점수나 공통 기준을 임의의 승급 확정으로 바꾸지 않으며, 최종 판단은 학교와 교사가 확인합니다.",
      steps: ["평가 목적 이해", "영역별 근거 보기", "다음 학습 계획", "유지 확인 일정", "학교·교사 상담"]
    }
  };

  function countBy(rows, key) {
    return rows.reduce(function (counts, row) {
      const value = row[key];
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
  }
  function renderBalance(id, counts, labelMap) {
    const host = document.getElementById(id);
    const maximum = Math.max.apply(null, Object.values(counts));
    host.innerHTML = Object.keys(counts).sort().map(function (key) {
      const value = counts[key];
      const percent = Math.round((value / maximum) * 100);
      return `<div class="balance-line"><b>${labelMap[key] || key}</b><div class="bar-track" aria-hidden="true"><i style="width:${percent}%"></i></div><small>${value}</small></div>`;
    }).join("");
  }
  function renderRole() {
    const copy = roleCopy[state.role];
    const panel = document.getElementById("role-panel");
    panel.setAttribute("aria-labelledby", `role-${state.role}`);
    panel.innerHTML = `<span class="role-label">${copy.label}</span><h3>${copy.title}</h3><p>${copy.copy}</p><ol class="role-steps">${copy.steps.map(function (step, index) { return `<li>${index + 1}. ${step}</li>`; }).join("")}</ol>`;
    document.querySelectorAll("[data-role]").forEach(function (button) {
      const selected = button.dataset.role === state.role;
      button.setAttribute("aria-selected", String(selected));
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });
  }
  function renderClusters() {
    const groups = Object.keys(countBy(plan.slots, "clusterId")).sort().map(function (clusterId) {
      const slots = plan.slots.filter(function (slot) { return slot.clusterId === clusterId; });
      const first = slots[0];
      const unit = registry.units.find(function (candidate) { return candidate.unitId === first.unitId; });
      return { clusterId, slots, first, unit };
    });
    document.getElementById("cluster-list").innerHTML = groups.map(function (group) {
      const types = countBy(group.slots, "responseType");
      return `<article class="cluster-card"><header><div><h3>${labels.domains[group.first.domainId]} · ${group.clusterId}</h3><span class="range">${group.first.standardRange} · ${group.unit.title.ko}</span></div><span class="slot-total">${group.slots.length} 자리</span></header><div class="cluster-meta"><span>기초 ${group.slots.filter(function (slot) { return slot.difficulty === "foundation"; }).length}</span><span>핵심 ${group.slots.filter(function (slot) { return slot.difficulty === "core"; }).length}</span><span>심화 ${group.slots.filter(function (slot) { return slot.difficulty === "advanced"; }).length}</span>${Object.keys(types).map(function (type) { return `<span>${labels.response[type]} ${types[type]}</span>`; }).join("")}</div></article>`;
    }).join("");
  }
  function moveFocus(event) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const tabs = Array.from(document.querySelectorAll("[data-role]"));
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

  document.getElementById("item-count").textContent = String(plan.plannedItemCount);
  document.getElementById("cluster-count").textContent = String(new Set(plan.slots.map(function (slot) { return slot.clusterId; })).size);
  document.getElementById("domain-count").textContent = String(new Set(plan.slots.map(function (slot) { return slot.domainId; })).size);
  renderBalance("difficulty-balance", countBy(plan.slots, "difficulty"), labels.difficulty);
  renderBalance("response-balance", countBy(plan.slots, "responseType"), labels.response);
  renderBalance("scoring-balance", countBy(plan.slots, "scoringMode"), labels.scoring);
  renderClusters();
  renderRole();

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-role]");
    if (!button) return;
    state.role = button.dataset.role;
    renderRole();
  });
  document.addEventListener("keydown", function (event) {
    if (event.target.matches("[data-role]")) moveFocus(event);
  });
})();
