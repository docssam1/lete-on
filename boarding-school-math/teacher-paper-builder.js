(function () {
  "use strict";
  const api = window.GFIELDGrade7RPAUnitWorkbook;
  if (!api || !api.pack || api.pack.rights.publication !== "public") return;
  const items = api.pack.workbookItems;
  const byId = new Map(items.map(function (item) { return [item.id, item]; }));
  const $ = function (id) { return document.getElementById(id); };
  const levelName = { foundation: "기초", core: "기본", advanced: "심화" };
  const selected = [];
  const maxItems = 2;
  let strand = "all";
  let previewId = items[0].id;

  function itemNumber(item) { return items.indexOf(item) + 1; }
  function strandName(item) { return api.pack.strands[item.strand].ko.replace(/^\d+ · /, ""); }
  function message(value) { $("builder-message").textContent = value; }
  function visibleItems() {
    const query = $("item-search").value.trim().toLocaleLowerCase("ko");
    const level = $("level-filter").value;
    return items.filter(function (item) {
      return (strand === "all" || item.strand === strand) && (level === "all" || item.level === level) &&
        (!query || `${item.prompt.ko} ${strandName(item)} ${item.standardIds.join(" ")}`.toLocaleLowerCase("ko").includes(query));
    });
  }
  function renderStrands() {
    const host = $("strand-filters"); host.replaceChildren();
    const options = [["all", "전체", items.length]].concat(Object.entries(api.pack.strands).map(function ([id, title]) {
      return [id, title.ko.replace(/^\d+ · /, ""), items.filter(function (item) { return item.strand === id; }).length];
    }));
    options.forEach(function ([id, name, count]) {
      const button = document.createElement("button"); button.type = "button";
      button.textContent = `${name}  ${count}`;
      button.setAttribute("aria-pressed", String(strand === id));
      button.addEventListener("click", function () {
        strand = id; renderStrands(); renderList();
        [...host.querySelectorAll("button")].find(function (entry) { return entry.getAttribute("aria-pressed") === "true"; }).focus();
      });
      host.append(button);
    });
  }
  function renderList(focus) {
    const results = visibleItems(), host = $("item-list"); host.replaceChildren();
    $("result-count").textContent = `${results.length}문항`;
    const outside = selected.filter(function (entry) { return !results.some(function (item) { return item.id === entry.id; }); }).length;
    $("selection-status").textContent = `시험지에 담은 문제 ${selected.length}개${outside ? ` · 현재 결과 밖 ${outside}개` : ""}`;
    $("selected-count").textContent = `${selected.length} / ${maxItems}문항`;
    if (!results.length) { const empty = document.createElement("p"); empty.className = "list-empty"; empty.textContent = "찾는 문항이 없습니다. 검색어나 필터를 바꿔 보세요."; host.append(empty); return; }
    results.forEach(function (item) {
      const row = document.createElement("div"); row.className = "item-row"; row.dataset.itemId = item.id;
      if (item.id === previewId) row.classList.add("is-previewed");
      const label = document.createElement("label"); label.className = "item-check";
      const check = document.createElement("input"); check.type = "checkbox";
      check.checked = selected.some(function (entry) { return entry.id === item.id; });
      check.setAttribute("aria-label", `${itemNumber(item)}번 시험지에 추가`);
      check.addEventListener("change", function () { if (check.checked) addItem(item.id); else removeItem(item.id); });
      label.append(check);
      const button = document.createElement("button"); button.type = "button"; button.className = "item-open";
      button.setAttribute("aria-label", `${itemNumber(item)}번 미리보기`);
      const title = document.createElement("strong"); title.textContent = `${String(itemNumber(item)).padStart(2, "0")} · ${item.prompt.ko}`;
      const trail = document.createElement("small"); trail.textContent = `${item.standardIds.join(", ")} · ${strandName(item)}`;
      button.append(title, trail);
      button.addEventListener("click", function () { previewId = item.id; renderPreview(); renderList({ id: item.id, kind: "preview" }); });
      const level = document.createElement("span"); level.className = "item-level"; level.textContent = levelName[item.level];
      row.append(label, button, level); host.append(row);
    });
    if (focus) {
      const row = [...host.querySelectorAll(".item-row")].find(function (entry) { return entry.dataset.itemId === focus.id; });
      if (row) row.querySelector(focus.kind === "preview" ? ".item-open" : "input").focus();
    }
  }
  function content(item, questionNumber) {
    const wrapper = document.createElement("div"); wrapper.className = "question-content";
    const prompt = document.createElement("p"); prompt.className = "question-prompt";
    prompt.textContent = `${questionNumber ? `${questionNumber}. ` : ""}${item.prompt.ko}`;
    wrapper.append(prompt);
    const visual = document.createElement("div"); visual.className = "question-visual";
    visual.innerHTML = api.renderVisual(item, "ko");
    wrapper.append(visual);
    const choices = document.createElement("ol"); choices.className = "question-choices";
    item.choices.forEach(function (entry) { const li = document.createElement("li"); li.textContent = `${entry.id}. ${entry.label.ko}`; choices.append(li); });
    wrapper.append(choices); return wrapper;
  }
  function renderPreview() {
    const item = byId.get(previewId), host = $("item-preview"); host.replaceChildren();
    $("preview-index").textContent = `원본 ${itemNumber(item)}번 · ${levelName[item.level]}`;
    host.append(content(item, null));
    const note = document.createElement("p"); note.className = "preview-note";
    note.textContent = "정답·해설은 시험지에 포함하지 않습니다."; host.append(note);
  }
  function addItem(id) {
    if (selected.some(function (entry) { return entry.id === id; })) return;
    if (selected.length >= maxItems) { message("A4 1장에는 2문항까지 담을 수 있습니다."); renderList({ id: id, kind: "check" }); return; }
    selected.push({ id: id, points: 5, lines: 3 }); message(""); renderAll({ id: id, kind: "check" });
  }
  function removeItem(id) {
    const index = selected.findIndex(function (entry) { return entry.id === id; });
    if (index >= 0) selected.splice(index, 1);
    message(""); renderAll({ id: id, kind: "check" });
  }
  function moveItem(id, offset) {
    const index = selected.findIndex(function (entry) { return entry.id === id; });
    const next = index + offset; if (index < 0 || next < 0 || next >= selected.length) return;
    [selected[index], selected[next]] = [selected[next], selected[index]];
    renderSelected(); renderSheet();
  }
  function numberInput(entry, field, min, max, label) {
    const wrapper = document.createElement("label"); wrapper.textContent = label;
    const input = document.createElement("input"); input.type = "number";
    input.min = String(min); input.max = String(max); input.value = String(entry[field]);
    input.setAttribute("aria-label", `${itemNumber(byId.get(entry.id))}번 ${label}`);
    input.addEventListener("change", function () {
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < min || value > max) { input.value = String(entry[field]); return; }
      entry[field] = value; renderSheet();
    });
    wrapper.append(input); return wrapper;
  }
  function renderSelected() {
    const host = $("selected-items"); host.replaceChildren();
    if (!selected.length) { const empty = document.createElement("p"); empty.textContent = "목록에서 최대 2문항을 선택하세요."; host.append(empty); }
    selected.forEach(function (entry, index) {
      const item = byId.get(entry.id), row = document.createElement("div"); row.className = "selected-row";
      const heading = document.createElement("div"), title = document.createElement("strong");
      title.textContent = `${index + 1}. 원본 ${itemNumber(item)}번 · ${strandName(item)}`;
      const controls = document.createElement("div"); controls.className = "order-controls";
      [["↑", -1, "위로"], ["↓", 1, "아래로"], ["×", 0, "제거"]].forEach(function ([symbol, direction, name]) {
        const button = document.createElement("button"); button.type = "button"; button.textContent = symbol;
        button.setAttribute("aria-label", `${itemNumber(item)}번 ${name}`);
        if (direction && (index + direction < 0 || index + direction >= selected.length)) button.disabled = true;
        button.addEventListener("click", function () { if (direction) moveItem(entry.id, direction); else removeItem(entry.id); }); controls.append(button);
      });
      heading.append(title, controls);
      const settings = document.createElement("div"); settings.className = "item-settings";
      settings.append(numberInput(entry, "points", 1, 20, "배점"), numberInput(entry, "lines", 1, 5, "풀이 줄"));
      row.append(heading, settings); host.append(row);
    });
  }
  function validateSheet() {
    const questions = $("sheet-questions"), footer = $("print-sheet").querySelector(".sheet-footer");
    const contentBottom = questions.getBoundingClientRect().bottom;
    const footerTop = footer.getBoundingClientRect().top;
    const overflow = selected.length > 0 && contentBottom > footerTop - 12;
    $("print-paper").disabled = selected.length === 0 || overflow;
    $("print-status").textContent = overflow ? "한 장에 들어가지 않습니다. 풀이 줄을 줄이거나 문항을 빼세요." : "";
    $("print-sheet").classList.toggle("is-overflow", overflow);
  }
  function renderSheet() {
    $("sheet-title").textContent = $("paper-title").value.trim() || "제목 없는 시험지";
    $("sheet-date").textContent = $("paper-date").value.trim() || "____________";
    $("sheet-time").textContent = `${$("paper-time").value || "—"}분`;
    $("sheet-points").textContent = `${selected.reduce(function (sum, entry) { return sum + entry.points; }, 0)}점`;
    const host = $("sheet-questions"); host.replaceChildren();
    if (!selected.length) { const empty = document.createElement("p"); empty.className = "sheet-empty"; empty.textContent = "문제를 선택하면 인쇄할 시험지가 여기 나타납니다."; host.append(empty); validateSheet(); return; }
    selected.forEach(function (entry, index) {
      const item = byId.get(entry.id), article = document.createElement("article");
      article.className = "sheet-question"; article.dataset.itemId = item.id;
      const meta = document.createElement("div"); meta.className = "sheet-question-meta";
      const source = document.createElement("span"); source.textContent = `원본 ${itemNumber(item)}번 · ${item.standardIds.join(", ")}`;
      const points = document.createElement("strong"); points.textContent = `${entry.points}점`;
      meta.append(source, points); article.append(meta, content(item, index + 1));
      const answerSpace = document.createElement("div"); answerSpace.className = "answer-space";
      for (let i = 0; i < entry.lines; i += 1) answerSpace.append(document.createElement("span"));
      article.append(answerSpace); host.append(article);
    });
    validateSheet();
  }
  function renderAll(focus) { renderList(focus); renderSelected(); renderSheet(); }
  function fitSheet() {
    const sheet = $("print-sheet");
    const available = $("sheet-section").clientWidth;
    sheet.style.zoom = String(Math.min(1, available / 794));
    validateSheet();
  }
  $("item-search").addEventListener("input", renderList);
  $("level-filter").addEventListener("change", renderList);
  $("select-visible").addEventListener("click", function () {
    const available = visibleItems().filter(function (item) { return !selected.some(function (entry) { return entry.id === item.id; }); });
    available.slice(0, maxItems - selected.length).forEach(function (item) { selected.push({ id: item.id, points: 5, lines: 3 }); });
    message(available.length && selected.length >= maxItems ? "A4 1장에는 2문항까지 담습니다." : ""); renderAll();
  });
  ["paper-title", "paper-date", "paper-time"].forEach(function (id) { $(id).addEventListener("input", renderSheet); });
  $("jump-to-sheet").addEventListener("click", function () { $("sheet-section").scrollIntoView({ behavior: "smooth" }); });
  $("print-paper").addEventListener("click", function () { validateSheet(); if (selected.length && !$("print-paper").disabled) window.print(); });
  window.addEventListener("resize", fitSheet);
  renderStrands(); renderAll(); renderPreview(); fitSheet();
})();
