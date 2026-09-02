(function () {
  "use strict";

  const source = window.GMAPAnimatedMathLessons;
  const scenes = window.GMAPAnimatedMathScenes;
  const clinicPaths = window.GFIELDClinicPaths;
  if (!source || !source.lessons || !source.lessons.length || !scenes) return;

  if (clinicPaths) clinicPaths.validateAnimatedMapping(source.lessons);

  const UI = {
    en: { mode: "Step-by-step", full: "Full lesson", paused: "Paused", complete: "Complete", overview: "Final overview", step: "Step", of: "of", play: "Play full lesson", pause: "Pause lesson", voiceOn: "Voice on", voiceOff: "Voice off", captionsOn: "Captions on", captionsOff: "Captions off", review: "Review the complete chain. The verified answer is " },
    ko: { mode: "단계별 보기", full: "전체 강의", paused: "일시 정지", complete: "완료", overview: "최종 한 장", step: "단계", of: "/", play: "전체 재생", pause: "일시 정지", voiceOn: "음성 켜짐", voiceOff: "음성 꺼짐", captionsOn: "자막 켜짐", captionsOff: "자막 꺼짐", review: "전체 풀이 흐름을 확인하세요. 검산된 답은 " },
    zh: { mode: "分步学习", full: "完整讲解", paused: "已暂停", complete: "完成", overview: "最终总览", step: "步骤", of: "/", play: "完整播放", pause: "暂停", voiceOn: "语音开启", voiceOff: "语音关闭", captionsOn: "字幕开启", captionsOff: "字幕关闭", review: "请回顾完整推理过程。核验答案是" }
  };
  const query = new URLSearchParams(window.location.search);
  const localeParam = query.get("locale") || "en";
  const requestedLessonId = query.get("lesson") || "";
  const requestedClusterId = query.get("cluster") || "";
  let locale = localeParam.indexOf("zh") === 0 ? "zh" : (localeParam.indexOf("ko") === 0 ? "ko" : "en");

  const elements = {
    tabs: document.getElementById("lesson-tabs"), clinic: document.getElementById("clinic-context"), eyebrow: document.getElementById("lesson-eyebrow"), title: document.getElementById("lesson-title"), concept: document.getElementById("lesson-concept"), problem: document.getElementById("problem-copy"), scene: document.getElementById("scene-root"), mode: document.getElementById("mode-name"), audio: document.getElementById("audio-toggle"), captions: document.getElementById("captions-toggle"), language: document.getElementById("lesson-language"), speed: document.getElementById("lesson-speed"), count: document.getElementById("step-count"), narration: document.getElementById("narration-text"), progress: document.getElementById("lesson-progress"), progressFill: document.getElementById("progress-fill"), previous: document.getElementById("previous-step"), play: document.getElementById("play-lesson"), next: document.getElementById("next-step"), restart: document.getElementById("restart-lesson"), overview: document.getElementById("show-overview"), steps: document.getElementById("step-list"), transcript: document.getElementById("lesson-transcript"), misconception: document.getElementById("teacher-misconception"), teacherPrompt: document.getElementById("teacher-prompt"), teacherSuccess: document.getElementById("teacher-success"), mathChecks: document.getElementById("math-checks")
  };

  const requestedLessonIndex = source.lessons.findIndex(function (lesson) { return lesson.id === requestedLessonId; });
  let lessonIndex = requestedLessonIndex >= 0 ? requestedLessonIndex : 0;
  let stepIndex = 0;
  let audioOn = true;
  let captionsOn = true;
  let playbackSpeed = 1;
  let playing = false;
  let timer = null;
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function textOf(value) { return value && (value[locale] || value.en) || ""; }
  function currentLesson() { return source.lessons[lessonIndex]; }
  function currentUI() { return UI[locale]; }
  function narrationOf(beat) { return textOf(beat.narrationI18n) || beat.narration; }
  function labelOf(beat) { return textOf(beat.labelI18n) || beat.label; }

  function cancelPlayback() {
    playing = false;
    if (timer) window.clearTimeout(timer);
    timer = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    elements.play.textContent = currentUI().play;
  }

  function speak(text) {
    if (!audioOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = locale === "zh" ? "zh-CN" : (locale === "ko" ? "ko-KR" : "en-SG");
    utterance.lang = lang;
    utterance.rate = Math.max(0.75, Math.min(1.2, 0.92 * playbackSpeed));
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(function (candidate) { return candidate.lang === lang; })
      || voices.find(function (candidate) { return candidate.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()); });
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  function updateScene(beat) {
    const visible = new Set(beat.visibleIds);
    const active = new Set(beat.targetIds);
    elements.scene.querySelectorAll("[data-object]").forEach(function (node) {
      const id = node.getAttribute("data-object");
      node.classList.toggle("is-visible", visible.has(id));
      node.classList.toggle("is-active", active.has(id));
      node.setAttribute("aria-hidden", String(!visible.has(id)));
    });
  }

  function updateStepList() {
    elements.steps.querySelectorAll(".step-button").forEach(function (button, index) {
      if (index === stepIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    elements.transcript.querySelectorAll("li").forEach(function (item, index) { item.classList.toggle("is-current", index === stepIndex); });
  }

  function applyStep(index, options) {
    const settings = options || {};
    const lesson = currentLesson();
    const T = currentUI();
    stepIndex = Math.max(0, Math.min(index, lesson.beats.length - 1));
    const beat = lesson.beats[stepIndex];
    updateScene(beat);
    updateStepList();
    elements.mode.textContent = playing ? T.full : T.mode;
    elements.count.textContent = T.step + " " + (stepIndex + 1) + " " + T.of + " " + lesson.beats.length;
    elements.narration.textContent = narrationOf(beat);
    elements.progress.setAttribute("aria-valuemax", String(lesson.beats.length));
    elements.progress.setAttribute("aria-valuenow", String(stepIndex + 1));
    elements.progressFill.style.width = ((stepIndex + 1) / lesson.beats.length * 100) + "%";
    elements.previous.disabled = stepIndex === 0;
    elements.next.disabled = stepIndex === lesson.beats.length - 1;
    if (settings.speak !== false) speak(narrationOf(beat));
  }

  function buildTabs() {
    elements.tabs.innerHTML = source.lessons.map(function (lesson, index) {
      return '<button class="lesson-tab" type="button" role="tab" data-lesson-index="' + index + '" aria-selected="' + (index === lessonIndex) + '">' + textOf(lesson.conceptI18n) + '</button>';
    }).join("");
    elements.tabs.querySelectorAll(".lesson-tab").forEach(function (button) { button.addEventListener("click", function () { renderLesson(Number(button.getAttribute("data-lesson-index"))); }); });
  }

  function buildStepList(lesson) {
    elements.steps.innerHTML = lesson.beats.map(function (beat, index) {
      return '<li><button class="step-button" type="button" data-step-index="' + index + '"><span class="step-number">' + String(index + 1).padStart(2, "0") + '</span><span class="step-copy"><strong>' + labelOf(beat) + '</strong><small>' + beat.phase + '</small></span></button></li>';
    }).join("");
    elements.transcript.innerHTML = lesson.beats.map(function (beat) { return "<li>" + narrationOf(beat) + "</li>"; }).join("");
    elements.steps.querySelectorAll(".step-button").forEach(function (button) { button.addEventListener("click", function () { cancelPlayback(); applyStep(Number(button.getAttribute("data-step-index"))); }); });
  }

  function renderClinicContext(lesson) {
    if (!elements.clinic || !clinicPaths || !requestedClusterId) return;
    let route;
    let workbookCompleted = false;
    try { workbookCompleted = window.localStorage.getItem(clinicPaths.completionKey(requestedClusterId)) === "complete-v1"; }
    catch (error) { workbookCompleted = false; }
    try { route = clinicPaths.routeFor(requestedClusterId, { fromDiagnostic: true, workbookCompleted: workbookCompleted }); }
    catch (error) { elements.clinic.hidden = true; elements.clinic.replaceChildren(); return; }
    if (route.animated.state !== "available" || route.animated.lessonId !== lesson.id || lesson.conceptClusterId !== requestedClusterId) {
      elements.clinic.hidden = true;
      elements.clinic.replaceChildren();
      return;
    }
    const copy = {
      en: { eyebrow: "DIAGNOSTIC CLINIC", title: "Visual lesson for " + requestedClusterId, body: "Continue with the reviewed 12-item workbook. The four-item recheck opens after accurate completion.", back: "Back to concept", workbook: "Open workbook" },
      ko: { eyebrow: "진단 클리닉", title: requestedClusterId + " 시각 강의", body: "검수된 12문항 워크북으로 이어서 연습하세요. 4문항 재확인은 정확히 완료한 뒤 열립니다.", back: "개념으로 돌아가기", workbook: "워크북 시작" },
      zh: { eyebrow: "诊断学习路径", title: requestedClusterId + " 可视化课程", body: "继续完成已审核的12题练习册。全部答对后开放4题复测。", back: "返回概念", workbook: "开始练习册" }
    }[locale];
    const textWrap = document.createElement("div");
    const eyebrow = document.createElement("span");
    eyebrow.className = "clinic-context-eyebrow";
    eyebrow.textContent = copy.eyebrow;
    const title = document.createElement("strong");
    title.textContent = copy.title;
    const body = document.createElement("p");
    body.textContent = copy.body;
    textWrap.append(eyebrow, title, body);
    const actions = document.createElement("div");
    actions.className = "clinic-context-actions";
    const back = document.createElement("a");
    back.href = clinicPaths.conceptUrl(requestedClusterId, true);
    back.textContent = copy.back + " →";
    actions.append(back);
    if (route.workbook.state === "available") {
      const workbook = document.createElement("a");
      workbook.href = route.workbook.url.replace("locale=ko", "locale=" + (locale === "zh" ? "zh-Hans" : locale));
      workbook.textContent = copy.workbook + " →";
      workbook.dataset.clinicAction = "workbook";
      actions.append(workbook);
    }
    elements.clinic.replaceChildren(textWrap, actions);
    elements.clinic.hidden = false;
  }

  function renderLesson(index) {
    cancelPlayback();
    lessonIndex = Math.max(0, Math.min(index, source.lessons.length - 1));
    const lesson = currentLesson();
    renderClinicContext(lesson);
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale;
    elements.eyebrow.textContent = textOf(lesson.eyebrowI18n);
    elements.title.textContent = textOf(lesson.titleI18n);
    elements.concept.textContent = textOf(lesson.conceptI18n);
    elements.problem.textContent = textOf(lesson.problemI18n);
    elements.scene.innerHTML = scenes.sceneFor(lesson, locale);
    elements.misconception.textContent = lesson.teacherEvidence.likelyMisconception;
    elements.teacherPrompt.textContent = lesson.teacherEvidence.teachingPrompt;
    elements.teacherSuccess.textContent = lesson.teacherEvidence.successCheck;
    elements.mathChecks.innerHTML = lesson.mathChecks.map(function (check) { return "<li>" + check.method + ": " + check.expression + " → " + check.result + "</li>"; }).join("");
    buildTabs();
    buildStepList(lesson);
    applyStep(0, { speak: false });
  }

  function continuePlayback() {
    const lesson = currentLesson();
    if (!playing) return;
    applyStep(stepIndex, { speak: true });
    elements.play.textContent = currentUI().pause;
    const duration = reducedMotion ? Math.min(lesson.beats[stepIndex].durationMs, 1800) : lesson.beats[stepIndex].durationMs;
    timer = window.setTimeout(function () {
      if (stepIndex >= lesson.beats.length - 1) { cancelPlayback(); elements.mode.textContent = currentUI().complete; return; }
      stepIndex += 1;
      continuePlayback();
    }, duration / playbackSpeed);
  }

  elements.play.addEventListener("click", function () { if (playing) { cancelPlayback(); elements.mode.textContent = currentUI().paused; return; } playing = true; stepIndex = 0; continuePlayback(); });
  elements.previous.addEventListener("click", function () { cancelPlayback(); applyStep(stepIndex - 1); });
  elements.next.addEventListener("click", function () { cancelPlayback(); applyStep(stepIndex + 1); });
  elements.restart.addEventListener("click", function () { cancelPlayback(); applyStep(0, { speak: false }); });
  elements.overview.addEventListener("click", function () {
    cancelPlayback();
    const lesson = currentLesson();
    elements.scene.querySelectorAll("[data-object]").forEach(function (node) { node.classList.add("is-visible"); node.classList.remove("is-active"); });
    elements.scene.querySelectorAll("[data-object]").forEach(function (node) { node.setAttribute("aria-hidden", "false"); });
    stepIndex = lesson.beats.length - 1;
    updateStepList();
    elements.mode.textContent = currentUI().overview;
    elements.count.textContent = currentUI().complete;
    elements.narration.textContent = currentUI().review + (textOf(lesson.verifiedAnswerI18n) || lesson.verifiedAnswer) + ".";
    elements.progress.setAttribute("aria-valuenow", String(lesson.beats.length));
    elements.progressFill.style.width = "100%";
    elements.previous.disabled = false;
    elements.next.disabled = true;
  });
  elements.audio.addEventListener("click", function () { audioOn = !audioOn; elements.audio.setAttribute("aria-pressed", String(audioOn)); elements.audio.textContent = audioOn ? currentUI().voiceOn : currentUI().voiceOff; if (!audioOn && "speechSynthesis" in window) window.speechSynthesis.cancel(); });
  elements.captions.addEventListener("click", function () { captionsOn = !captionsOn; document.body.classList.toggle("captions-off", !captionsOn); elements.captions.setAttribute("aria-pressed", String(captionsOn)); elements.captions.textContent = captionsOn ? currentUI().captionsOn : currentUI().captionsOff; });
  elements.speed.addEventListener("change", function () { playbackSpeed = Number(elements.speed.value) || 1; if (playing) { cancelPlayback(); playing = true; continuePlayback(); } });
  elements.language.value = locale;
  elements.language.addEventListener("change", function () { locale = elements.language.value; cancelPlayback(); elements.audio.textContent = audioOn ? currentUI().voiceOn : currentUI().voiceOff; elements.captions.textContent = captionsOn ? currentUI().captionsOn : currentUI().captionsOff; renderLesson(lessonIndex); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) cancelPlayback(); });
  window.addEventListener("pagehide", cancelPlayback);

  renderLesson(lessonIndex);
})();
