(function () {
  "use strict";
  const $ = id => document.getElementById(id), panel = $("original-exam-panel"), library = window.GFIELDAMCOriginalPaperLibrary;
  const prefix = "gfield-original-exam-clock-v1:"; let interval, active = null, currentKey = "", automatic = false;
  function identity() {
    const program = $("review-program").value, year = Number($("archive-year").value), form = $("archive-form").value || "";
    const format = library.formatFor(program, year, form), key = window.GFIELDAMCOriginalAnswerKeyReference.formFor(program, year, form);
    return format && key && key.itemCount === format.itemCount && format.durationMinutes ? { program, year, form, format, key: prefix + [program, year, form].join(":") } : null;
  }
  function copy() { const lang = document.documentElement.lang || "ko"; return lang.startsWith("en") ? { reset:" Starting a new test clears the answers entered here.", language:"Paper language", ko:"Korean paper · Coming soon", zh:"Singapore Chinese paper · Coming soon", title:"Past-paper test", start:"Start test", again:"Retake test", ready:"Open the paper before starting the test.", available:"Ready. Submit your answers to receive your analysis.", running:"Test in progress. Submit when you finish.", done:"Test submitted. Review your diagnosis and original solutions.", submit:"Submit test", result:"View results", items:"questions", minutes:"minutes", elapsed:"Time used", time:"Time remaining" } : lang.startsWith("zh") ? { reset:"开始新考试时，这里的已填答案将被清除。", language:"试卷语言",ko:"韩文试卷 · 准备中",zh:"新加坡简体中文试卷 · 准备中",title:"历年原卷测试",start:"开始考试",again:"重新考试",ready:"请先打开试卷，再开始考试。",available:"试卷已就绪。提交答案后查看诊断。",running:"正在考试。完成后请提交答案。",done:"考试已提交。请查看诊断与原题解析。",submit:"提交试卷",result:"查看结果",items:"题", minutes:"分钟", elapsed:"用时", time:"剩余时间" } : { reset:" 시험을 시작하면 입력한 답이 지워집니다.", language:"시험지 언어",ko:"한국어 시험지 · 준비 중",zh:"싱가포르 중국어 시험지 · 준비 중",title:"기출시험",start:"시험 시작",again:"다시 응시",ready:"시험지를 펼친 뒤 시험을 시작하세요.",available:"시험지가 준비됐어요. 제출하면 채점과 진단을 확인할 수 있어요.",running:"시험 중입니다. 풀이를 마치면 제출하세요.",done:"응시를 마쳤어요. 진단과 원본 풀이를 확인하세요.",submit:"시험 제출",result:"결과 보기",items:"문항", minutes:"분", elapsed:"응시 시간", time:"남은 시간" }; }
  function read(paper) { try { const row = JSON.parse(sessionStorage.getItem(paper.key) || "null"); return row && ["running","submitted"].includes(row.status) && Number.isFinite(row.startedAt) && Number.isFinite(row.deadline) && row.deadline - row.startedAt === paper.format.durationMinutes * 60000 ? row : null; } catch (_) { return null; } }
  function write() { try { const keys = Object.keys(sessionStorage).filter(k => k.startsWith(prefix)); if (keys.length >= 20 && !keys.includes(currentKey)) sessionStorage.removeItem(keys[0]); sessionStorage.setItem(currentKey, JSON.stringify(active)); } catch (_) {} }
  function isRunning() { return Boolean(active && active.status === "running"); }
  function isSubmitted() { return Boolean(active && active.status === "submitted"); }
  function clock(milliseconds) { const seconds = Math.max(0, Math.ceil(milliseconds / 1000)); return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2,"0"); }
  function tick() {
    const paper = identity(); if (!paper) return;
    $("original-exam-clock").textContent = clock(isRunning() ? active.deadline - Date.now() : active ? Math.max(0, (active.submittedAt || Date.now()) - active.startedAt) : paper.format.durationMinutes * 60000);
    if (isRunning() && active.deadline <= Date.now() && !automatic) { automatic = true; $("paper-review-form").requestSubmit(); }
  }
  function apply() {
    const paper = identity(), c = copy(), running = isRunning();
    panel.hidden = !paper; if (!paper) return;
    panel.querySelectorAll('[data-paper-language]').forEach(function(button){const version=window.GFIELDPaperLanguages.versionFor(paper.program,paper.year,paper.form,button.dataset.paperLanguage,library);button.disabled=running||!version||version.status!=="available";button.setAttribute("aria-pressed",String(button.dataset.paperLanguage===window.GFIELDPaperBookReader.currentLanguage()));});
    $("paper-language-label").textContent = c.language; panel.querySelector('[data-paper-language="ko"]').textContent = c.ko; panel.querySelector('[data-paper-language="zh-Hans"]').textContent = c.zh;
    $("original-exam-heading").textContent = c.title; $("original-exam-format").textContent = paper.format.itemCount + " " + c.items + " · " + paper.format.durationMinutes + " " + c.minutes;
    $("original-exam-start").textContent = isSubmitted() ? c.again : c.start;
    $("original-exam-start").disabled = running || $("paper-book").dataset.renderState !== "ready";
    const hasResponses = Array.from(document.querySelectorAll('#paper-mark-list [data-field="answer"]')).some(el => el.value);
    $("original-exam-status").textContent = running ? c.running : isSubmitted() ? c.done : $("paper-book").dataset.renderState === "ready" ? c.available + (hasResponses ? c.reset : "") : c.ready;
    $("original-exam-clock").setAttribute("aria-label", isSubmitted() ? c.elapsed : c.time);
    document.body.classList.toggle("is-original-exam-running", running);
    document.querySelectorAll('#review-program-buttons button,.paper-choice,#review-program,#archive-year,#archive-form,#review-grade,#clear-marks,#book-detail-marks').forEach(el => { el.disabled = running; });
    $("apply-answer-key").disabled = running || !window.GFIELDAMCOriginalAnswerKeyReference.formFor(paper.program,paper.year,paper.form);
    $("paper-review-form").querySelector('.review-form-actions button[type="submit"]').textContent = running ? c.submit : c.result;
    tick();
  }
  function sync() { const paper = identity(), key = paper && paper.key; if (key !== currentKey) { clearInterval(interval); currentKey = key; active = paper ? read(paper) : null; automatic = false; if (isRunning()) interval = setInterval(tick,1000); } apply(); }
  function start() {
    const paper = identity(); if (!paper || $("paper-book").dataset.renderState !== "ready" || isRunning()) return;
    $("clear-marks").click();
    currentKey = paper.key; const now = Date.now(); active = { status:"running", startedAt:now, deadline:now+paper.format.durationMinutes*60000 }; automatic = false; write(); clearInterval(interval); interval=setInterval(tick,1000); apply();
  }
  function finish() { if (!isRunning()) return; active = Object.assign({},active,{status:"submitted",submittedAt:Math.min(Date.now(),active.deadline)}); write(); clearInterval(interval); apply(); }
  $("original-exam-start").addEventListener("click",start);
  panel.querySelectorAll('[data-paper-language]').forEach(function(button){button.addEventListener("click",function(){if(!isRunning()&&window.GFIELDPaperBookReader.selectLanguage(button.dataset.paperLanguage)){const url=new URL(location.href);url.searchParams.set("paperLanguage",button.dataset.paperLanguage);history.replaceState(null,"",url);apply();}});});
  document.addEventListener("gfield:paper-marks-ready",sync);
  new MutationObserver(apply).observe($("paper-book"),{attributes:true,attributeFilter:["data-render-state"]});
  let language=document.documentElement.lang;new MutationObserver(function(){if(language!==document.documentElement.lang){language=document.documentElement.lang;apply();}}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  window.GFIELDOriginalPaperExam=Object.freeze({isRunning, isSubmitted, start, finish});sync();
})();
