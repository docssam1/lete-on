(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDPaperScoreOverview = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  function positionFor(score, maximum, reference, bands) {
    if (!Number.isFinite(score) || !Number.isFinite(maximum) || maximum <= 0 || score < 0 || score > maximum || !reference || !Array.isArray(bands)) return null;
    const available = bands.filter(function (band) {
      return Number.isFinite(reference[band.id]) && reference[band.id] >= 0 && reference[band.id] <= maximum;
    }).map(function (band) { return { id: band.id, label: band.label, threshold: reference[band.id] }; });
    if (!available.length) return null;
    const reached = available.find(function (band) { return score >= band.threshold; }) || null;
    const next = reached ? available[available.indexOf(reached) - 1] || null : available[available.length - 1];
    return { bands: available, reached: reached, next: next, minimum: available[available.length - 1] };
  }

  function render(context) {
    const host = document.getElementById("paper-score-overview");
    if (!host) return;
    host.replaceChildren();
    const result = context.result;
    const complete = result.complete && result.scoreEstimate;
    const score = complete ? result.scoreEstimate.points : null;
    const maximum = complete ? result.scoreEstimate.max : null;
    const position = complete ? positionFor(score, maximum, context.reference, context.bands || []) : null;
    const ranges = window.GFIELDPaperScoreRange;
    const interval = complete && ranges ? ranges.intervalFor(score, maximum, context.reference, context.bands || []) : null;

    function sourceText(item) {
      return window.GFIELDContentI18n && window.GFIELDContentI18n.sourceText
        ? window.GFIELDContentI18n.sourceText(item) : item.textContent;
    }
    function node(tag, text, className) {
      const item = document.createElement(tag);
      if (text) item.textContent = text;
      if (className) item.className = className;
      return item;
    }
    function link(text, href) {
      const item = node("a", text);
      item.href = href;
      return item;
    }
    function card(label, value, note, id) {
      const item = node("div", "", "paper-score-fact");
      item.append(node("dt", label));
      const number = node("dd", value);
      if (id) number.id = id;
      item.append(number);
      if (note) item.append(node("p", note));
      return item;
    }
    function intervalText(range) {
      if (range.lower === range.upper && range.upperInclusive) return range.lower + "점";
      return range.lower + "점 이상 · " + range.upper + (range.upperInclusive ? "점 이하" : "점 미만");
    }
    function paperIdentity(year, form) {
      const seasonal = year === 2021 && ["amc10", "amc12"].includes(context.programId);
      const originalForm = seasonal ? form === "C" ? "A" : form === "D" ? "B" : form : form;
      return [year, context.title, originalForm].filter(Boolean).join(" ") + (seasonal ? ["C", "D"].includes(form) ? " · 가을" : " · 봄" : "");
    }
    const title = node("h3", "점수 분포와 등급 구간");
    title.id = "paper-score-overview-title";
    const identity = paperIdentity(context.year, context.form);
    host.append(title, node("p", "원본 시험지 · " + identity, "paper-score-paper"), node("p", "응시 날짜 · " + (context.examDate || "날짜 미입력"), "paper-score-attempt-date"));

    const facts = node("dl", "", "paper-score-facts");
    facts.append(card(
      "이번 시험 점수",
      complete ? score + " / " + maximum : result.complete ? "정답 " + result.counts.correct + " / " + result.itemCount : "답안 입력을 마쳐 주세요",
      complete ? "선택한 원본 시험지의 채점 결과" : result.complete ? "확인된 정답 수를 보여 드려요. 이 시험지의 배점은 원본 안내를 확인해 주세요." : "모든 문항의 정답·오답·미응답을 표시하면 점수를 확인할 수 있어요.",
      "paper-score-current"
    ));

    const overall = document.getElementById("amc8-overall-cohort-reference");
    const hasOverall = overall && !overall.hidden;
    let bandText = hasOverall ? sourceText(document.getElementById("amc8-overall-cohort-result")) : "이 회차의 전체 응시자 기준점 자료가 아직 없어요.";
    if (!result.complete) bandText = "답안 입력 후 비교";
    if (position) bandText = position.reached ? position.reached.label + "점 이상" : position.minimum.label + "점 미만";
    const bandCard = card(hasOverall && !position ? "전체 응시자 비교" : "분포 기준 구간", bandText, position ? "같은 연도·시험형의 전체 응시자 기준점" : "", "paper-score-band");
    if (interval) {
      const bounds = node("p", intervalText(interval), "paper-score-bounds");
      bounds.id = "paper-score-bounds";
      bandCard.append(bounds);
    }
    if (context.reference && context.sourceUrl) {
      const source = link("분포 자료 출처", context.sourceUrl);
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      bandCard.append(source);
    }
    if (hasOverall && !position) bandCard.append(link("전체 응시자 자료 자세히 보기", "#amc8-overall-cohort-reference"));
    facts.append(bandCard);

    const cutoffSection = document.getElementById("amc-aime-cutoff-reference");
    if (cutoffSection && !cutoffSection.hidden) {
      const row = cutoffSection.querySelector(".aime-cohort-band");
      if (row) {
        const cutoffCard = card(sourceText(row.querySelector("strong")), sourceText(row.querySelector("span")), sourceText(row.querySelector("small")), "paper-score-cutoff");
        cutoffCard.append(link("AIME 기준 자세히 보기", "#amc-aime-cutoff-reference"));
        facts.append(cutoffCard);
      }
    }
    host.append(facts);
    const learningProfile = node("section", "", "paper-learning-profile");
    learningProfile.id = "current-paper-learning-profile";
    learningProfile.setAttribute("aria-label", "이번 회차 강점·약점");
    host.append(learningProfile);

    if (position) {
      const chart = node("section", "", "paper-score-chart");
      const chartTitle = node("h4", "점수 분포 기준과 내 점수");
      chartTitle.id = "paper-score-chart-title";
      chart.setAttribute("aria-labelledby", chartTitle.id);
      chart.append(chartTitle, node("p", "보라색 막대는 공개 기준점, 세로선은 내 점수예요.", "paper-score-legend"));
      const rows = node("ol", "", "paper-score-rows");
      position.bands.forEach(function (band) {
        const reached = score >= band.threshold;
        const row = node("li", "", "paper-score-row");
        row.dataset.band = band.id;
        row.dataset.threshold = String(band.threshold);
        if (position.reached && band.id === position.reached.id) row.classList.add("is-current");
        const name = node("span", band.label);
        const bar = node("span", "", "paper-score-rail");
        bar.setAttribute("aria-hidden", "true");
        const fill = node("span", "", "paper-score-threshold");
        fill.style.width = (band.threshold / maximum * 100) + "%";
        const marker = node("span", "", "paper-score-marker");
        marker.style.left = (score / maximum * 100) + "%";
        bar.append(fill, marker);
        row.append(name, bar, node("span", band.threshold + " / " + maximum, "paper-score-threshold-value"), node("span", reached ? "기준점 이상" : "기준점 미만", "paper-score-reached"));
        rows.append(row);
      });
      chart.append(rows);
      host.append(chart);
      host.append(node("p", "동점자가 있을 수 있어 기준점 도달 여부와 정확한 개인 백분위는 다를 수 있어요.", "paper-score-note"));
      if (interval) {
        const details = node("details", "", "paper-score-intervals");
        details.append(node("summary", "모든 점수 구간 보기"));
        const table = node("table");
        const caption = node("caption", "공개 기준점 사이의 점수 범위");
        const head = node("thead");
        const headRow = node("tr");
        ["비교 기준", "하한 · 포함", "상한"].forEach(function (label) { const cell = node("th", label); cell.scope = "col"; headRow.append(cell); });
        head.append(headRow);
        const body = node("tbody");
        ranges.intervalsFor(maximum, context.reference, context.bands || []).forEach(function (range) {
          const row = node("tr");
          row.dataset.range = range.id;
          if (range.id === interval.id) row.className = "is-current";
          const heading = node("th", range.labels.length ? range.labels.join(" · ") : "가장 낮은 공개 기준점 미만");
          heading.scope = "row";
          row.append(heading, node("td", range.lower + "점"), node("td", range.upper + (range.upperInclusive ? "점 이하" : "점 미만")));
          body.append(row);
        });
        table.append(caption, head, body); details.append(table);
        details.append(node("p", "공개되지 않은 중간 기준점은 나누지 않아요. 같은 점수에 겹치는 기준은 한 구간으로 보여 드려요.", "paper-score-note"));
        host.append(details);
      }
    }

    const comparison = node("div", "", "paper-score-grade");
    comparison.append(node("h4", "동학년 비교"));
    const gradeSections = [
      ["amc8-global-grade-score-reference", "amc8-global-grade-score-title", "amc8-global-grade-score-value", "amc8-global-grade-score-summary"],
      ["amc-grade-percentile-reference", "amc-grade-percentile-title", "amc-grade-percentile-position", "amc-grade-percentile-summary"],
      ["amc-grade-reference", null, "amc-grade-reference-delta", "amc-grade-reference-summary"],
      ["amc8-korea-percentile-reference", null, "amc8-korea-percentile-value", "amc8-korea-percentile-summary"],
      ["amc8-korea-grade-mean-reference", null, "amc8-korea-grade-mean-result", "amc8-korea-grade-mean-summary"],
      ["aime-historical-grade-reference", null, "aime-historical-grade-result", "aime-historical-grade-summary"]
    ];
    let count = 0;
    gradeSections.forEach(function (entry) {
      const section = document.getElementById(entry[0]);
      if (!section || section.hidden) return;
      const heading = entry[1] ? document.getElementById(entry[1]) : section.querySelector("h3");
      const value = document.getElementById(entry[2]);
      if (!heading || !value || !value.textContent.trim()) return;
      const row = node("div", "", "paper-score-grade-row");
      row.append(link(sourceText(heading), "#" + entry[0]), node("p", sourceText(value)));
      const population = document.getElementById(entry[3]);
      if (population) row.append(node("small", sourceText(population), "paper-score-grade-context"));
      comparison.append(row);
      count += 1;
    });
    if (!count) comparison.append(node("p", result.complete ? "이 회차·학년의 비교 자료가 아직 없어요." : "답안 입력을 마치면 확인된 학년별 자료를 함께 보여 드려요."));
    host.append(comparison);

    if (["amc8", "amc10", "amc12", "aime"].includes(context.programId) && (context.result.scoreEstimate || context.forecast && context.forecast.max)) {
      const forecast = context.forecast || { ready: false, count: 0, entries: [] };
      const section = node("section", "", "paper-score-forecast");
      section.id = "paper-score-forecast";
      const heading = node("h4", "여러 회차 기반 예상점수");
      heading.id = "paper-score-forecast-title";
      section.setAttribute("aria-labelledby", heading.id);
      section.append(heading);
      const value = node("p", forecast.ready ? forecast.lower + "–" + forecast.upper + " / " + forecast.max + "점" : "서로 다른 시험지 3회가 필요해요.", "paper-score-forecast-value");
      value.id = "paper-score-forecast-value";
      section.append(value, node("p", "최근 180일 · 같은 대회·학년·배점 · 서로 다른 시험지 최대 8회", "paper-score-note"));
      if (forecast.ready) {
        section.append(node("p", "최근 점수의 최저–최고 범위예요. 시험지 난도는 보정하지 않아 다음 점수는 이 범위를 벗어날 수 있어요.", "paper-score-note"));
      } else {
        section.append(node("p", "응시 날짜를 입력하고 기출 채점 결과를 저장해 주세요. 미완성 답안과 시험지를 확인할 수 없는 기록은 제외해요.", "paper-score-note"));
      }
      section.append(node("p", "같은 시험지를 다시 풀면 가장 이른 응시 날짜의 기록 1회만 사용해요.", "paper-score-note"));
      const details = node("details");
      details.append(node("summary", "계산에 사용한 기록 " + forecast.count + "회"));
      const list = node("ol");
      forecast.entries.forEach(function (entry) {
        list.append(node("li", [entry.examDate, paperIdentity(entry.year, entry.form), entry.points + " / " + entry.max].join(" · ")));
      });
      details.append(list); section.append(details); host.append(section);
    }

    const actions = node("nav", "", "paper-score-actions");
    actions.setAttribute("aria-label", "진단 결과에서 이어가기");
    actions.append(link("오답과 해설 보기", "#report-review-items"));
    const followUp = document.getElementById("report-follow-up");
    const followUpLink = document.getElementById("report-follow-up-link");
    if (followUp && !followUp.hidden && followUpLink.getAttribute("href")) actions.append(link("다음 연습 시작", followUpLink.getAttribute("href")));
    host.append(actions);
  }
  return Object.freeze({ positionFor: positionFor, render: render });
});
