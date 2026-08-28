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
      label: "교사용 · 설계와 수업 연결",
      title: "교사는 영역별 근거를 수업 계획으로 연결합니다.",
      copy: "42개 문항 자리가 Grade 6의 다섯 영역과 열 개 클러스터를 고르게 다루는지 확인합니다. 검수된 문항은 진단, 보충 연습, 다음 단원 계획의 근거로 사용합니다.",
      steps: ["배치 목적 확인", "문항·권리 검수", "인증된 평가 배정", "영역별 근거 검토", "수업·유지 확인 계획"]
    },
    student: {
      label: "학생용 · 진단과 다음 학습",
      title: "학생은 평가 뒤에 무엇을 연습할지 확인합니다.",
      copy: "교사가 배정한 진단을 마치면 영역별 피드백과 다음 수업·연습 순서를 확인합니다. 학생 화면은 자신의 학습 흐름에 필요한 정보만 보여 줍니다.",
      steps: ["교사 배정 확인", "인증된 평가 응시", "나의 영역별 피드백", "다음 수업·연습", "7일 뒤 유지 확인"]
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
