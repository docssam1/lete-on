(function () {
  "use strict";
  const engine = window.GFIELDPaperLearningProfile;
  const range = window.GFIELDPaperScoreRange;
  const library = window.GFIELDAMCOriginalPaperLibrary;
  const titles = { amc8: "AMC 8", amc10: "AMC 10", amc12: "AMC 12", aime: "AIME", kangaroo: "Math Kangaroo", sasmo: "SASMO" };
  function node(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function conceptLabel(id) { return (window.GFIELDPaperConceptLabels || {})[id] || id.replace(/-/g, " "); }
  function paperTitle(record, attempt) {
    if (!attempt) return record.paperLabel || record.programTitle;
    const seasonal = attempt.year === 2021 && ["amc10", "amc12"].includes(record.programId);
    const form = seasonal ? attempt.form === "C" ? "A" : attempt.form === "D" ? "B" : attempt.form : attempt.form;
    return [attempt.year, titles[record.programId], form].filter(Boolean).join(" ") + (seasonal ? ["C", "D"].includes(attempt.form) ? " · 가을" : " · 봄" : "");
  }
  function identityLabel(record) {
    const identity = range.identityFromDiagnostic(record, library);
    return identity ? paperTitle(record, identity) : null;
  }
  function bandText(attempt) {
    if (!attempt) return "점수 비교는 원본 회차 확인 후 표시해요.";
    const data = attempt.programId === "aime" ? window.GFIELDAimeScoreDistributionReference : window.GFIELDAMCScoreDistributionReference;
    const ref = attempt.programId === "aime" ? data.referenceFor(attempt.year, attempt.form) : data.referenceFor(attempt.programId, attempt.year, attempt.form);
    const interval = range.intervalFor(attempt.points, attempt.max, ref, data.bands);
    return interval ? interval.lower + "점 이상 · " + interval.upper + (interval.upperInclusive ? "점 이하" : "점 미만") : "이 회차의 분포 기준점 자료가 아직 없어요.";
  }
  function forecastAt(record, records) {
    const attempt = range.attemptFromDiagnostic(record, library);
    if (!attempt) return null;
    const attempts = records.filter(function (row) { return row.examDate < record.examDate || row.examDate === record.examDate && String(row.savedAt || "") <= String(record.savedAt || ""); })
      .map(function (row) { return range.attemptFromDiagnostic(row, library); }).filter(Boolean);
    return range.forecast(attempts, { programId: record.programId, grade: record.grade, max: attempt.max, scoringKey: attempt.scoringKey, asOf: record.examDate });
  }
  function forecastText(forecast) { return forecast && forecast.ready ? forecast.lower + "–" + forecast.upper + " / " + forecast.max + "점" : "서로 다른 시험지 3회가 필요해요."; }
  function practiceLink(record, domainIds, conceptIds) {
    const routes = { amc8: "amc8-topic-practice.html", amc10: "amc10-practice.html", amc12: "amc12-practice.html", aime: "aime-practice.html" };
    if (!routes[record.programId]) return null;
    const params = new URLSearchParams({ grade: String(record.grade) });
    if (domainIds.length) params.set("domains", domainIds.join(","));
    if (conceptIds.length) params.set("sourceConcepts", conceptIds.join(","));
    const attempt = range.identityFromDiagnostic(record, library);
    if (attempt) { params.set("sourceYear", String(attempt.year)); params.set("sourceForm", attempt.form); }
    const link = node("a", "복습 문제 풀기", "paper-profile-practice");
    link.href = "./" + routes[record.programId] + "?" + params.toString();
    return link;
  }
  function strengths(domains) {
    const host = node("div", "", "paper-profile-strengths");
    [["strength", "강점으로 나타난 영역", "paper-strengths"], ["review", "복습할 영역", "paper-review-areas"]].forEach(function (entry) {
      const box = node("section", "", entry[2]); box.append(node("h4", entry[1]));
      const matches = domains.filter(function (row) { return row.state === entry[0]; });
      if (!matches.length) box.append(node("p", domains.every(function (row) { return row.total < 3; }) ? "판단할 문항이 부족해요." : "해당 기준에 해당하는 영역이 없어요."));
      const list = node("ul");
      matches.forEach(function (row) { const item = node("li"); item.dataset.domain = row.id; item.append(node("strong", row.name), node("span", row.correct + "/" + row.total + " · " + row.rate + "%")); list.append(item); });
      box.append(list); host.append(box);
    });
    return host;
  }
  function conceptReview(record) {
    const host = node("div", "", "paper-profile-concepts");
    const weak = (record.concepts || []).filter(function (row) { return row.wrong + row.blank > 0; }).sort(function (a, b) { return b.wrong + b.blank - a.wrong - a.blank || a.id.localeCompare(b.id); });
    if (!weak.length) return host;
    host.append(node("h4", "다시 볼 개념"));
    const list = node("ul");
    const extraList = node("ul");
    weak.forEach(function (row, index) {
      const item = node("li"); item.dataset.concept = row.id;
      item.append(node("span", conceptLabel(row.id)), node("small", "오답 " + row.wrong + " · 미응답 " + row.blank));
      const link = practiceLink(record, [], [row.id]); if (link) item.append(link);
      (index < 5 ? list : extraList).append(item);
    });
    host.append(list);
    if (weak.length > 5) { const more = node("details"); more.append(node("summary", "다른 복습 개념 보기"), extraList); host.append(more); }
    return host;
  }
  function criteria() { return node("p", "영역별 표시 문항 3개 이상에서 정답률 80% 이상은 강점, 60% 이하는 복습 대상으로 표시해요. 미응답도 포함하며, 학년 수준을 판정하는 기준은 아니에요.", "paper-profile-note"); }
  function card(record, records) {
    const host = node("section", "", "saved-paper-learning-profile");
    const attempt = range.attemptFromDiagnostic(record, library);
    const identity = range.identityFromDiagnostic(record, library);
    const score = node("p", attempt ? "이번 점수 " + attempt.points + " / " + attempt.max : identity ? record.summary.unmarked ? "답안 입력을 마쳐 주세요" : "이 회차는 정답 수로 확인해요." : "점수 비교는 원본 회차 확인 후 표시해요.", "paper-profile-score");
    const band = node("p", identity && !attempt ? "" : bandText(attempt), "paper-profile-band");
    if (!identity) host.append(node("p", "원본 회차 미확인", "paper-profile-note"));
    host.append(score, band);
    if (attempt) {
      const forecast = node("p", "이 회차까지의 예상 범위", "paper-profile-forecast-label");
      forecast.append(node("strong", forecastText(forecastAt(record, records)))); host.append(forecast);
    }
    host.append(strengths(engine.domainsFor(record.domains)));
    const details = node("details"); details.append(node("summary", "개념·판단 기준 보기"), conceptReview(record), criteria()); host.append(details);
    return host;
  }
  function current(record) {
    const host = document.getElementById("current-paper-learning-profile"); if (!host) return;
    host.replaceChildren(); host.append(node("h3", "이번 회차 강점·약점"), strengths(engine.domainsFor(record.domains)));
    const concepts = conceptReview(record);
    if (concepts.childElementCount) { const conceptDetails = node("details"); conceptDetails.append(node("summary", "개념별 복습 보기"), concepts); host.append(conceptDetails); }
    const details = node("details"); details.append(node("summary", "판단 기준 보기"), criteria(), node("p", "한 문항에 여러 개념 태그가 붙을 수 있어요. 개념별 오답 수를 합쳐 전체 오답 수로 읽지는 않아요.", "paper-profile-note")); host.append(details);
    const link = node("a", "회차별 기록과 누적 진단 보기", "paper-profile-practice"); link.href = "#saved-diagnostic-history"; if (!document.getElementById("saved-diagnostic-history").hidden) host.append(link);
    else host.append(node("p", "결과를 저장하면 회차별 기록과 누적 진단에 반영해요.", "paper-profile-note"));
  }
  function accumulated(records, context) {
    const host = document.getElementById("paper-learning-accumulated"); if (!host) return;
    host.replaceChildren();
    const groups = engine.groups(records, { range: range, library: library, asOf: context.asOf });
    if (!groups.length) { host.append(node("p", "원본 회차가 확인되는 기출의 전체 채점 결과를 저장하면 누적 진단을 보여 드려요.")); return; }
    host.append(node("h3", "누적 강점·약점"), node("p", "대회와 학년별로 모았어요. 같은 시험지는 첫 완료 기록 1회만 반영하고, 일부 입력·미확인 회차·미래 날짜 기록은 제외해요.", "paper-profile-note"));
    groups.forEach(function (group) {
      const section = node("details", "", "paper-cumulative-group"); section.dataset.program = group.programId; section.dataset.grade = String(group.grade);
      section.open = group.grade === context.grade && group.programId === context.programId;
      section.append(node("summary", titles[group.programId] + " · Grade " + group.grade + " · 누적 " + group.count + "회"));
      section.append(strengths(group.domains));
      const domainList = node("ul", "", "paper-profile-domain-list");
      group.domains.forEach(function (row) {
        const item = node("li"); item.dataset.domain = row.id; item.dataset.state = row.state;
        item.append(node("strong", row.name), node("span", row.correct + "/" + row.total + (row.rate == null ? "" : " · " + row.rate + "%")), node("span", { strength: "강점", review: "복습", developing: "학습 중", insufficient: "문항 부족" }[row.state]));
        if (row.trend) item.append(node("p", "처음 " + row.trend.count + "회 " + row.trend.earlier.correct + "/" + row.trend.earlier.total + " → 최근 " + row.trend.count + "회 " + row.trend.recent.correct + "/" + row.trend.recent.total, "paper-profile-note"));
        domainList.append(item);
      });
      section.append(domainList, criteria(), node("p", "회차마다 문항 구성이 달라 정답률 변화는 학습 기록으로 비교해요.", "paper-profile-note"));
      const recurring = node("section", "", "paper-recurring-concepts"); recurring.append(node("h4", "여러 회차에서 다시 볼 개념"));
      const list = node("ul");
      const extraList = node("ul");
      group.recurring.forEach(function (row, index) {
        const item = node("li"); item.dataset.concept = row.id;
        item.append(node("strong", conceptLabel(row.id)), node("span", "오답·미응답이 나온 회차 " + row.reviewPapers + "회"));
        const link = practiceLink(row.latestRecord, [], [row.id]); if (link) item.append(link); (index < 8 ? list : extraList).append(item);
      });
      recurring.append(list);
      if (group.recurring.length > 8) { const more = node("details"); more.append(node("summary", "다른 복습 개념 보기"), extraList); recurring.append(more); }
      if (!group.recurring.length) recurring.append(node("p", group.conceptPaperCount ? "여러 회차에서 반복된 복습 개념이 아직 없어요." : "이전 기록에는 개념별 집계가 없어요. 다음 채점부터 함께 저장해요."));
      if (group.recovered.length) recurring.append(node("p", "최근 맞힌 복습 개념", "paper-profile-note"), node("p", group.recovered.slice(0, 5).map(function (row) { return conceptLabel(row.id); }).join(" · "), "paper-profile-recovered"));
      section.append(recurring);
      const reasonNames = { concept: "개념", approach: "접근 아이디어", calculation: "계산", reading: "조건 읽기", time: "시간", "blank:time": "시간 부족", "blank:skipped": "건너뜀", "blank:could-not-start": "시작 못 함" };
      const reasons = Object.keys(group.reasons).sort(function (a, b) { return group.reasons[b] - group.reasons[a]; });
      if (reasons.length) { const box = node("details"); box.append(node("summary", "직접 선택한 오답·미응답 이유")); reasons.forEach(function (id) { box.append(node("p", (reasonNames[id] || id) + " · " + group.reasons[id] + "문항")); }); section.append(box); }
      const timeline = node("details", "", "paper-profile-timeline"); timeline.append(node("summary", "회차별 점수·구간·예상 범위"));
      const entries = node("ol");
      group.records.forEach(function (record, index) {
        const row = node("li"); row.dataset.recordId = record.id;
        const date = node("time", "응시 날짜 · " + record.examDate, "paper-profile-attempt-date"); date.dateTime = record.examDate;
        row.append(node("strong", paperTitle(record, group.attempts[index])), date, node("p", group.attempts[index].points + " / " + group.attempts[index].max + " · " + bandText(group.attempts[index])), node("p", forecastText(forecastAt(record, records)), "paper-profile-history-forecast"));
        entries.append(row);
      });
      timeline.append(entries, node("p", "예상 범위는 각 회차까지의 최근 성적에서 계산해요. 이후 회차 점수는 앞선 기록에 섞지 않아요.", "paper-profile-note")); section.append(timeline); host.append(section);
    });
  }
  window.GFIELDPaperLearningProfileUI = Object.freeze({ card: card, current: current, accumulated: accumulated, identityLabel: identityLabel });
})();
