(function () {
  "use strict";
  const $ = function (id) { return document.getElementById(id); };
  const host = $("paper-book");
  if (!host) return;
  const vendor = new URL("../vendor/pdfjs/", document.currentScript.src);
  const workspace = $("paper-reading-workspace");
  const draftPrefix = "gfield-paper-book-tab:v1:";
  let selected = null, pdf = null, loadingTask = null, libraryPromise = null;
  let generation = 0, renderVersion = 0, renderTask = null, pageNumber = 1, opened = false, printing = false, printFrame = null;
  let resizeTimer, printVersion = 0;
  function say(id, text) { $(id).textContent = text; }
  function translated(text) { return window.GFIELDContentI18n ? window.GFIELDContentI18n.text(text) : text; }
  function draftKey() { return selected ? draftPrefix + [selected.grade, selected.programId, selected.year, selected.form].join(":") : ""; }
  function readDraft() {
    try {
      const draft = JSON.parse(sessionStorage.getItem(draftKey()) || "null");
      return draft && draft.version === 1 && draft.answers && typeof draft.answers === "object" ? draft : null;
    } catch (_) { return null; }
  }
  function saveDraft() {
    if (!selected) return;
    const answers = {};
    document.querySelectorAll('#paper-mark-list [data-field="answer"]').forEach(function (input) {
      if (/^(?:[A-E]|[0-9]{1,3})$/.test(input.value)) answers[input.dataset.question] = input.value;
    });
    try {
      const keys = Object.keys(sessionStorage).filter(function (key) { return key.startsWith(draftPrefix); });
      if (keys.length >= 20 && !keys.includes(draftKey())) sessionStorage.removeItem(keys[0]);
      sessionStorage.setItem(draftKey(), JSON.stringify({ version: 1, page: pageNumber, opened: opened, answers: answers }));
      say("book-draft-status", "이 탭에 답안을 임시 저장했어요.");
    } catch (_) { say("book-draft-status", "임시 저장을 사용할 수 없어요. 이 화면을 닫기 전에 채점해 주세요."); }
  }
  function restoreAnswers() {
    const draft = readDraft();
    if (!draft || !selected) return;
    let count = 0;
    document.querySelectorAll('#paper-mark-list [data-field="answer"]').forEach(function (input) {
      const value = draft.answers[input.dataset.question];
      const valid = selected.programId === "aime" ? typeof value === "string" && /^[0-9]{1,3}$/.test(value) : /^[A-E]$/.test(value || "");
      if (valid && !input.value) { input.value = value; count += 1; }
    });
    if (count) {
      say("book-draft-status", "이 탭에 임시 저장한 답안을 불러왔어요. 채점하려면 정답표를 대조해 주세요.");
      document.dispatchEvent(new Event("gfield:paper-answers-restored"));
    }
  }
  function parsePages(value, count) {
    if (!Number.isInteger(count) || count < 1 || typeof value !== "string" || !value.trim() || value.length > 300) return null;
    const pages = new Set();
    for (const token of value.split(",")) {
      const match = /^\s*(\d+)\s*(?:-\s*(\d+)\s*)?$/.exec(token);
      if (!match) return null;
      const first = Number(match[1]), last = match[2] ? Number(match[2]) : first;
      if (first < 1 || first > last || last > count) return null;
      for (let n = first; n <= last; n += 1) pages.add(n);
    }
    return Array.from(pages).sort(function (a, b) { return a - b; });
  }
  function resetFrame() { if (printFrame) { printFrame.remove(); printFrame = null; } }
  function mobilePane(pane, focus) {
    workspace.dataset.mobilePane = pane;
    $("book-tab-paper").setAttribute("aria-pressed", String(pane === "paper"));
    $("book-tab-answers").setAttribute("aria-pressed", String(pane === "answers"));
    if (focus) {
      const target = pane === "answers" ? document.querySelector('#paper-mark-list .omr-answer-buttons button, #paper-mark-list input[data-field="answer"]') : $("book-viewport");
      if (target) { target.focus(); target.scrollIntoView({ block: "nearest" }); }
    }
    if (pane === "paper" && pdf) queueMicrotask(renderPage);
  }
  function enterReading() {
    opened = true;
    workspace.classList.add("is-book-open");
    workspace.dataset.markDetail = "false";
    $("book-detail-marks").setAttribute("aria-pressed", "false");
    $("book-answer-heading").hidden = false;
    document.querySelector(".book-mobile-tabs").hidden = false;
  }
  function setControls(ready) {
    $("book-tools").hidden = !ready;
    $("book-viewport").hidden = !ready;
    $("book-open").hidden = ready;
    if (ready) {
      $("book-page").max = String(pdf.numPages);
      $("book-page").value = String(pageNumber);
      say("book-page-count", "/ " + pdf.numPages);
      $("book-prev").disabled = pageNumber <= 1;
      $("book-next").disabled = pageNumber >= pdf.numPages;
    }
  }
  function pdfLibrary() {
    if (!libraryPromise) libraryPromise = import(new URL("pdf.min.mjs", vendor).href).then(function (lib) {
      lib.GlobalWorkerOptions.workerSrc = new URL("pdf.worker.min.mjs", vendor).href;
      lib.GlobalWorkerOptions.rendererSrc = new URL("pdf.renderer.min.mjs", vendor).href;
      return lib;
    }).catch(function (error) { libraryPromise = null; throw error; });
    return libraryPromise;
  }
  async function renderPage() {
    if (!pdf || !opened || $("book-viewport").clientWidth < 1) return;
    const version = ++renderVersion, sourceGeneration = generation, documentPdf = pdf;
    host.dataset.renderState = "loading";
    $("book-sheet").replaceChildren();
    if (renderTask) renderTask.cancel();
    try {
      const page = await documentPdf.getPage(pageNumber);
      if (version !== renderVersion || sourceGeneration !== generation) return;
      const natural = page.getViewport({ scale: 1 });
      const available = Math.max(180, $("book-viewport").clientWidth - 32);
      const zoom = $("book-zoom").value;
      const scale = zoom === "fit" ? available / natural.width : Number(zoom) * 96 / 72;
      const viewport = page.getViewport({ scale: scale });
      const outputScale = Math.min(window.devicePixelRatio || 1, 2, 3600 / viewport.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width * outputScale); canvas.height = Math.ceil(viewport.height * outputScale);
      canvas.style.width = viewport.width + "px"; canvas.style.height = viewport.height + "px";
      canvas.setAttribute("aria-hidden", "true");
      const task = page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport, transform: [outputScale, 0, 0, outputScale, 0, 0] });
      renderTask = task;
      await task.promise;
      const content = await page.getTextContent();
      if (version !== renderVersion || sourceGeneration !== generation) return;
      const text = document.createElement("p"); text.className = "visually-hidden"; text.dataset.contentOriginal = "";
      text.textContent = content.items.map(function (item) { return item.str || ""; }).join(" ");
      $("book-sheet").replaceChildren(canvas, text);
      $("book-sheet").style.width = viewport.width + "px";
      $("book-sheet").dataset.page = String(pageNumber);
      $("book-viewport").scrollTop = 0;
      host.dataset.renderState = "ready";
      say("book-status", "원본 언어와 쪽 구성 그대로 보여 줍니다.");
      $("book-render-error").hidden = true;
      setControls(true);
    } catch (error) {
      if (version !== renderVersion || sourceGeneration !== generation || error.name === "RenderingCancelledException") return;
      say("book-render-error", "이 쪽을 표시하지 못했어요. 다시 불러오거나 원본 제공처에서 열어 주세요.");
      $("book-render-error").hidden = false; $("book-retry").hidden = false;
    }
  }
  async function openBook() {
    if (!selected || loadingTask || pdf) return;
    enterReading(); restoreAnswers();
    const currentGeneration = generation;
    host.dataset.renderState = "loading";
    $("book-open").disabled = true; $("book-retry").hidden = true;
    $("book-render-error").hidden = true;
    say("book-status", "시험지를 불러오는 중이에요.");
    let timeout;
    try {
      const lib = await pdfLibrary();
      if (currentGeneration !== generation) return;
      const task = lib.getDocument({ url: selected.url, standardFontDataUrl: new URL("standard_fonts/", vendor).href,
        wasmUrl: new URL("wasm/", vendor).href, isEvalSupported: false, enableXfa: false, verbosity: 0 });
      loadingTask = task;
      timeout = setTimeout(function () { task.destroy().catch(function () {}); }, 25000);
      const documentPdf = await task.promise;
      if (currentGeneration !== generation) { documentPdf.loadingTask.destroy().catch(function () {}); return; }
      pdf = documentPdf;
      const draft = readDraft();
      pageNumber = draft && Number.isInteger(draft.page) ? Math.max(1, Math.min(pdf.numPages, draft.page)) : 1;
      setControls(true);
      await renderPage(); saveDraft();
    } catch (_) {
      if (currentGeneration !== generation) return;
      host.dataset.renderState = "error";
      say("book-status", "시험지를 불러오지 못했어요. 다시 시도하거나 원본 제공처에서 열어 주세요.");
      $("book-retry").hidden = false;
    } finally {
      clearTimeout(timeout);
      if (currentGeneration === generation) { loadingTask = null; $("book-open").disabled = false; }
    }
  }
  function selectPaper(config) {
    const library = window.GFIELDAMCOriginalPaperLibrary;
    const valid = config && library && library.formsFor(config.programId, config.year).includes(config.form);
    const requestedLanguage = config && config.language || "en";
    const requestedVersion = valid && window.GFIELDPaperLanguages && window.GFIELDPaperLanguages.versionFor(config.programId, config.year, config.form, requestedLanguage, library);
    const language = requestedVersion && requestedVersion.status === "available" ? requestedLanguage : "en";
    const version = valid && window.GFIELDPaperLanguages && window.GFIELDPaperLanguages.versionFor(config.programId, config.year, config.form, language, library);
    const key = valid ? [config.grade, config.programId, config.year, config.form, language].join(":") : "";
    if (selected && selected.key === key) return;
    generation += 1; renderVersion += 1;
    if (renderTask) renderTask.cancel(); renderTask = null;
    if (loadingTask) loadingTask.destroy().catch(function () {}); loadingTask = null;
    if (pdf) pdf.loadingTask.destroy().catch(function () {}); pdf = null;
    resetFrame(); if ($("book-print-dialog").open) $("book-print-dialog").close();
    printing = false; $("book-print-confirm").disabled = false;
    opened = false; pageNumber = 1;
    workspace.classList.remove("is-book-open"); workspace.dataset.markDetail = "false";
    $("book-answer-heading").hidden = true; document.querySelector(".book-mobile-tabs").hidden = true;
    $("book-sheet").replaceChildren(); $("book-zoom").value = "fit";
    $("book-open").disabled = false; $("book-retry").hidden = true; $("book-render-error").hidden = true;
    say("book-draft-status", ""); say("book-print-error", ""); say("book-print-status", "");
    host.hidden = !valid; workspace.classList.toggle("has-paper-book", Boolean(valid));
    selected = valid ? Object.assign({}, config, { key: key, language: language, url: version && version.url || library.printRoute(config.programId, config.year, config.form) }) : null;
    setControls(false); mobilePane("paper");
    if (!selected) return;
    say("book-identity", config.title); say("book-print-identity", config.title);
    $("book-source").href = selected.url;
    host.dataset.renderState = "closed";
    say("book-status", "시험지를 펼치면 이곳에서 읽을 수 있어요.");
  }
  function setGradeContext(grade) {
    if (!selected || !Number.isInteger(grade) || grade < 3 || grade > 12) return;
    selected = Object.assign({}, selected, { grade: grade, key: [grade, selected.programId, selected.year, selected.form, selected.language || "en"].join(":") });
    saveDraft();
  }
  function selectLanguage(language) {
    if (!selected) return false;
    const version = window.GFIELDPaperLanguages && window.GFIELDPaperLanguages.versionFor(selected.programId, selected.year, selected.form, language, window.GFIELDAMCOriginalPaperLibrary);
    if (!version || version.status !== "available") return false;
    if (selected.language === language) return true;
    saveDraft(); selectPaper(Object.assign({}, selected, { language: language })); marksReady(); if (!opened) openBook();
    return true;
  }
  function marksReady() {
    if (!selected) return;
    const draft = readDraft();
    if (draft) { restoreAnswers(); if (!opened && draft.opened !== false) openBook(); }
  }
  function goTo(number) {
    if (!pdf || !Number.isInteger(number) || number < 1 || number > pdf.numPages) { $("book-page").value = String(pageNumber); return; }
    pageNumber = number; setControls(true); renderPage(); saveDraft();
  }
  async function reviewPages(documentPdf, sourceGeneration) {
    const numbers = Array.from(document.querySelectorAll('.paper-mark-row[data-state="wrong"], .paper-mark-row[data-state="blank"]'))
      .map(function (row) { return Number(row.querySelector('[data-field="status"]').dataset.question); });
    if (!numbers.length) throw new Error("no-review-marks");
    const format = window.GFIELDAMCOriginalPaperLibrary.formatFor(selected.programId, selected.year, selected.form);
    const headings = [];
    for (let n = 1; n <= documentPdf.numPages; n += 1) {
      if (sourceGeneration !== generation) throw new Error("changed-paper");
      const page = await documentPdf.getPage(n), content = await page.getTextContent();
      const width = page.getViewport({scale: 1}).width;
      content.items.forEach(function (item) {
        const match = /^(\d{1,2})\.$/.exec((item.str || "").trim());
        if (match && item.transform[4] <= width * .13) headings.push({ number: Number(match[1]), page: n });
      });
    }
    // Use only a complete, sequential original-paper heading map. Scans and
    // ambiguous text layouts must use explicit page selection instead.
    if (headings.length !== format.itemCount || headings.some(function (heading, i) { return heading.number !== i + 1; })) throw new Error("unmapped-review-pages");
    const pages = new Set();
    numbers.forEach(function (number) {
      const from = headings[number - 1].page, to = headings[number] ? headings[number].page : documentPdf.numPages;
      for (let n = from; n <= to; n += 1) pages.add(n);
    });
    return Array.from(pages).sort(function (a,b) { return a-b; });
  }
  async function printPages(event) {
    event.preventDefault(); if (!pdf || printing) return;
    const scope = $("book-print-scope").value;
    let pages = scope === "review" ? [] : scope === "all" ? Array.from({ length: pdf.numPages }, function (_, n) { return n + 1; }) : scope === "current" ? [pageNumber] : parsePages($("book-print-pages").value, pdf.numPages);
    say("book-print-error", "");
    if (!pages) { say("book-print-error", "쪽 번호를 확인해 주세요. 시험지 범위 안에서 입력하세요."); $("book-print-pages").focus(); return; }
    const currentGeneration = generation, printDocument = pdf, currentPrint = ++printVersion;
    printing = true; $("book-print-confirm").disabled = true;
    say("book-print-status", "인쇄할 쪽을 준비하고 있어요.");
    resetFrame();
    try {
      if (scope === "review") pages = await reviewPages(printDocument, currentGeneration);
      if (currentPrint !== printVersion || currentGeneration !== generation) return;
      const permissions = await printDocument.getPermissions();
      if (permissions && !permissions.includes(4) && !permissions.includes(2048)) throw new Error("print-not-allowed");
      const frame = document.createElement("iframe");
      frame.className = "paper-book-print-frame"; frame.title = translated("시험지 인쇄");
      frame.setAttribute("aria-hidden", "true"); document.body.append(frame); printFrame = frame;
      const doc = frame.contentDocument;
      doc.open(); doc.write('<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:8mm}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff}.sheet{width:194mm;height:280mm;display:flex;align-items:center;justify-content:center;break-after:page;page-break-after:always}.sheet:last-child{break-after:auto;page-break-after:auto}.sheet img{display:block;max-width:100%;max-height:100%;object-fit:contain}</style></head><body></body></html>'); doc.close();
      doc.title = selected.title;
      for (const number of pages) {
        if (currentGeneration !== generation || currentPrint !== printVersion || !frame.isConnected) return;
        const page = await printDocument.getPage(number);
        const viewport = page.getViewport({ scale: 2.5 });
        const canvas = document.createElement("canvas"); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
        if (currentGeneration !== generation || currentPrint !== printVersion || !frame.isConnected) return;
        const sheet = doc.createElement("section"); sheet.className = "sheet"; sheet.dataset.page = String(number);
        const img = doc.createElement("img"); img.alt = selected.title + " " + number; img.src = canvas.toDataURL("image/png");
        sheet.append(img); doc.body.append(sheet); await img.decode(); canvas.width = 0; canvas.height = 0;
      }
      if (currentGeneration !== generation || currentPrint !== printVersion || !frame.isConnected) return;
      frame.dataset.pages = pages.join(","); frame.dataset.paper = selected.key;
      document.dispatchEvent(new CustomEvent("gfield:paper-print-ready", { detail: { pages: pages.slice(), source: selected.key } }));
      say("book-print-status", "인쇄 창에서 프린터와 쪽 구성을 확인하세요.");
      frame.contentWindow.focus(); frame.contentWindow.print();
    } catch (error) {
      if (currentGeneration === generation && currentPrint === printVersion) say("book-print-error", error.message === "no-review-marks" ? "먼저 채점하거나 오답·미응답 문항을 표시해 주세요." : error.message === "unmapped-review-pages" ? "이 시험지는 문항별 쪽을 자동으로 구분할 수 없어요. 쪽 선택으로 인쇄해 주세요." : "인쇄를 준비하지 못했어요. 다시 시도하거나 원본 제공처에서 인쇄해 주세요.");
    } finally {
      if (currentGeneration === generation && currentPrint === printVersion) { printing = false; $("book-print-confirm").disabled = false; }
    }
  }
  $("book-open").addEventListener("click", openBook);
  $("book-retry").addEventListener("click", function () { if (pdf) renderPage(); else openBook(); });
  $("book-prev").addEventListener("click", function () { goTo(pageNumber - 1); });
  $("book-next").addEventListener("click", function () { goTo(pageNumber + 1); });
  $("book-page").addEventListener("change", function (event) { goTo(Number(event.target.value)); });
  $("book-page").addEventListener("keydown", function (event) { if (event.key === "Enter") { event.preventDefault(); goTo(Number(event.target.value)); } });
  $("book-zoom").addEventListener("change", renderPage);
  $("book-viewport").addEventListener("keydown", function (event) { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); goTo(pageNumber + (event.key === "ArrowRight" ? 1 : -1)); } });
  $("book-answer-jump").addEventListener("click", function () { mobilePane("answers", true); });
  $("book-tab-paper").addEventListener("click", function () { mobilePane("paper", true); });
  $("book-tab-answers").addEventListener("click", function () { mobilePane("answers", true); });
  $("book-detail-marks").addEventListener("click", function () {
    const show = workspace.dataset.markDetail !== "true"; workspace.dataset.markDetail = String(show);
    $("book-detail-marks").setAttribute("aria-pressed", String(show));
  });
  $("paper-mark-list").addEventListener("change", saveDraft);
  $("paper-mark-list").addEventListener("input", saveDraft);
  $("clear-marks").addEventListener("click", function () { try { sessionStorage.removeItem(draftKey()); } catch (_) {} say("book-draft-status", "임시 답안을 지웠어요."); });
  $("book-print").addEventListener("click", function () { say("book-print-error", ""); say("book-print-status", ""); $("book-print-dialog").showModal(); });
  $("book-print-scope").addEventListener("change", function () { $("book-print-pages-field").hidden = $("book-print-scope").value !== "range"; });
  function cancelPrint() { if (printing) { printVersion += 1; printing = false; $("book-print-confirm").disabled = false; resetFrame(); say("book-print-status", ""); } }
  $("book-print-dialog").addEventListener("cancel", cancelPrint);
  $("book-print-cancel").addEventListener("click", function () { cancelPrint(); $("book-print-dialog").close(); });
  $("book-print-form").addEventListener("submit", printPages);
  document.addEventListener("gfield:paper-marks-ready", marksReady);
  window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { if (pdf && $("book-zoom").value === "fit") renderPage(); }, 150); });
  window.GFIELDPaperBookReader = Object.freeze({ selectPaper: selectPaper, selectLanguage: selectLanguage, currentLanguage: function () { return selected && selected.language || "en"; }, setGradeContext: setGradeContext, parsePages: parsePages });
})();
