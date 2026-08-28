(function () {
  "use strict";

  const planData = window.GFIELDGrade6PlacementPlan;
  const registry = window.GFIELDUSK8ContentRegistry;
  if (!planData || !registry) throw new Error("Grade 6 diagnostic blueprint data failed to load");

  const plan = planData.plan;
  const state = { role: "student" };
  const labels = {
    difficulty: { foundation: "기초 근거", core: "핵심 근거", advanced: "심화 전이" },
    response: { "multiple-choice": "선택형", numeric: "수치 응답", "short-answer": "단답형", "constructed-response": "서술형" },
    scoring: { automatic: "자동 채점 후보", teacher: "교사 검토 필요" },
    domains: { "G6-RP": "비와 비례", "G6-NS": "수 체계", "G6-EE": "식과 방정식", "G6-G": "기하", "G6-SP": "통계와 확률" }
  };
  const roleCopy = {
    teacher: {
      label: "교사용 · 채점 근거와 수업 처방",
      title: "교사는 10개 서술 응답을 확인하고 처방 후보를 학교 검토로 넘깁니다.",
      copy: "32개 자동채점 결과와 10개 교사 검토를 결합해 다섯 영역, 열 개 클러스터, 난이도와 오류 유형을 분석합니다. 낮은 총점만 보는 대신 어떤 선수개념과 풀이 단계에서 막혔는지 확인합니다.",
      status: "로컬 실행에서는 서버가 표시한 교사 PIN과 학생 진단 번호가 필요합니다. 운영에서는 인증된 담당 교사 범위로 대체됩니다.",
      steps: ["학생 응답 불러오기", "서술 10문항 검토", "오류 유형 확인", "영역·클러스터 분석", "수업·유지 처방"],
      linkLabel: "Grade 6 교사용 커리큘럼 보기",
      linkHref: "./catalog.html?role=teacher&grade=6"
    },
    student: {
      label: "학생용 · 응시와 다음 학습",
      title: "학생은 42문항을 풀고 자신의 강점과 다음 연습을 확인합니다.",
      copy: "문항을 한 개씩 풀고 제출하면 객관 응답 32개가 먼저 채점됩니다. 교사가 설명 응답 10개를 확인한 뒤 영역별 결과, 문항별 코멘트와 다음 수업 순서가 열립니다.",
      status: "정답·루브릭·교사 자료는 학생 화면에 전달하지 않습니다. 공개 사이트에서는 안내만 보이며, 로컬 또는 운영 진단 서버가 연결된 경우에만 응시할 수 있습니다.",
      steps: ["42문항 응시", "자동채점 32문항", "교사 검토 10문항", "영역·오류 분석", "다음 학습·유지 확인"],
      linkLabel: "Grade 6 학생용 커리큘럼 보기",
      linkHref: "./catalog.html?role=student&grade=6"
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
      return `<div class="balance-line"><b>${labelMap[key] || key}</b><progress class="bar-track" max="${maximum}" value="${value}" aria-label="${labelMap[key] || key} ${value}">${value} / ${maximum}</progress><small>${value}</small></div>`;
    }).join("");
  }
  function renderRole() {
    const copy = roleCopy[state.role];
    const panel = document.getElementById("role-panel");
    panel.setAttribute("aria-labelledby", `role-${state.role}`);
    panel.innerHTML = `<span class="role-label">${copy.label}</span><h3>${copy.title}</h3><p>${copy.copy}</p><p class="role-status">${copy.status}</p><ol class="role-steps">${copy.steps.map(function (step, index) { return `<li>${index + 1}. ${step}</li>`; }).join("")}</ol><a class="role-link" href="${copy.linkHref}">${copy.linkLabel}</a>`;
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
