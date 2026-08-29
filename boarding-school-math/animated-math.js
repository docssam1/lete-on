(function () {
  "use strict";

  const source = window.GMAPAnimatedMathLessons;
  if (!source || !Array.isArray(source.lessons) || !source.lessons.length) return;

  const elements = {
    tabs: document.getElementById("lesson-tabs"),
    eyebrow: document.getElementById("lesson-eyebrow"),
    title: document.getElementById("lesson-title"),
    concept: document.getElementById("lesson-concept"),
    problem: document.getElementById("problem-copy"),
    scene: document.getElementById("scene-root"),
    mode: document.getElementById("mode-name"),
    audio: document.getElementById("audio-toggle"),
    count: document.getElementById("step-count"),
    narration: document.getElementById("narration-text"),
    progress: document.getElementById("lesson-progress"),
    progressFill: document.getElementById("progress-fill"),
    previous: document.getElementById("previous-step"),
    play: document.getElementById("play-lesson"),
    next: document.getElementById("next-step"),
    overview: document.getElementById("show-overview"),
    steps: document.getElementById("step-list"),
    misconception: document.getElementById("teacher-misconception"),
    teacherPrompt: document.getElementById("teacher-prompt"),
    teacherSuccess: document.getElementById("teacher-success"),
    mathChecks: document.getElementById("math-checks")
  };

  let lessonIndex = 0;
  let stepIndex = 0;
  let audioOn = true;
  let playing = false;
  let timer = null;
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ratioScene() {
    return `
      <div class="ratio-scene" role="img" aria-label="Two bar models compare equal totals with ratios one to three and one to four">
        <div class="ratio-row">
          <div class="ratio-row-label">Team A <span>1 : 3 · total 20</span></div>
          <div class="ratio-bar four">
            <div class="ratio-cell first scene-object" data-object="ratio-a-1" style="--order:0">5 red</div>
            <div class="ratio-cell scene-object" data-object="ratio-a-2" style="--order:1">5</div>
            <div class="ratio-cell scene-object" data-object="ratio-a-3" style="--order:2">5</div>
            <div class="ratio-cell scene-object" data-object="ratio-a-4" style="--order:3">5</div>
          </div>
        </div>
        <div class="ratio-row">
          <div class="ratio-row-label">Team B <span>1 : 4 · total 20</span></div>
          <div class="ratio-bar five">
            <div class="ratio-cell first scene-object" data-object="ratio-b-1" style="--order:0">4 green</div>
            <div class="ratio-cell scene-object" data-object="ratio-b-2" style="--order:1">4</div>
            <div class="ratio-cell scene-object" data-object="ratio-b-3" style="--order:2">4</div>
            <div class="ratio-cell scene-object" data-object="ratio-b-4" style="--order:3">4</div>
            <div class="ratio-cell scene-object" data-object="ratio-b-5" style="--order:4">4</div>
          </div>
        </div>
        <div class="ratio-equations">
          <div class="ratio-equation scene-object" data-object="ratio-equation-a">20 ÷ 4 = 5</div>
          <div class="ratio-equation scene-object" data-object="ratio-equation-b">20 ÷ 5 = 4</div>
          <div class="ratio-answer scene-object" data-object="ratio-answer">5 + 4 = 9</div>
        </div>
      </div>`;
  }

  function geometryScene() {
    return `
      <div class="geometry-scene" role="img" aria-label="Isosceles triangle ABC with vertex angle forty degrees and equal base angles">
        <svg viewBox="0 0 760 390" aria-hidden="true">
          <line class="geo-line scene-object" data-object="geo-side-ab" x1="380" y1="42" x2="125" y2="324"></line>
          <line class="geo-line scene-object" data-object="geo-side-ac" x1="380" y1="42" x2="635" y2="324"></line>
          <line class="geo-line scene-object" data-object="geo-base" x1="125" y1="324" x2="635" y2="324"></line>
          <g class="scene-object" data-object="geo-equal-ab"><line class="geo-mark" x1="246" y1="172" x2="267" y2="191"></line></g>
          <g class="scene-object" data-object="geo-equal-ac"><line class="geo-mark" x1="493" y1="191" x2="514" y2="172"></line></g>
          <g class="scene-object" data-object="geo-angle-a">
            <path class="geo-arc" d="M347 80 Q380 111 413 80"></path>
            <text class="geo-angle-label" x="365" y="101">40°</text>
          </g>
          <g class="scene-object" data-object="geo-angle-b">
            <path class="geo-arc" d="M165 324 Q157 290 185 260"></path>
            <text class="geo-angle-label" x="173" y="302">x</text>
          </g>
          <g class="scene-object" data-object="geo-angle-c">
            <path class="geo-arc" d="M595 324 Q603 290 575 260"></path>
            <text class="geo-angle-label" x="568" y="302">x</text>
          </g>
          <text class="geo-label" x="370" y="29">A</text>
          <text class="geo-label" x="94" y="350">B</text>
          <text class="geo-label" x="648" y="350">C</text>
        </svg>
        <div class="geo-equations">
          <div class="geo-equation scene-object" data-object="geo-equation-sum">180° − 40° = 140°</div>
          <div class="geo-equation scene-object" data-object="geo-equation-divide">140° ÷ 2 = 70°</div>
          <div class="geo-answer scene-object" data-object="geo-answer">∠B = 70°</div>
        </div>
      </div>`;
  }

  function currentLesson() {
    return source.lessons[lessonIndex];
  }

  function cancelPlayback() {
    playing = false;
    if (timer) window.clearTimeout(timer);
    timer = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    elements.play.textContent = "Play full lesson";
  }

  function speak(text) {
    if (!audioOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-SG";
    utterance.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(function (candidate) { return candidate.lang === "en-SG"; })
      || voices.find(function (candidate) { return candidate.lang === "en-GB"; })
      || voices.find(function (candidate) { return candidate.lang.startsWith("en"); });
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
    });
  }

  function updateStepList() {
    elements.steps.querySelectorAll(".step-button").forEach(function (button, index) {
      if (index === stepIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function applyStep(index, options) {
    const settings = options || {};
    const lesson = currentLesson();
    stepIndex = Math.max(0, Math.min(index, lesson.beats.length - 1));
    const beat = lesson.beats[stepIndex];
    updateScene(beat);
    updateStepList();
    elements.mode.textContent = playing ? "Full lesson" : "Step-by-step";
    elements.count.textContent = `Step ${stepIndex + 1} of ${lesson.beats.length}`;
    elements.narration.textContent = beat.narration;
    elements.progress.setAttribute("aria-valuemax", String(lesson.beats.length));
    elements.progress.setAttribute("aria-valuenow", String(stepIndex + 1));
    elements.progressFill.style.width = `${((stepIndex + 1) / lesson.beats.length) * 100}%`;
    elements.previous.disabled = stepIndex === 0;
    elements.next.disabled = stepIndex === lesson.beats.length - 1;
    if (settings.speak !== false) speak(beat.narration);
  }

  function buildTabs() {
    elements.tabs.innerHTML = source.lessons.map(function (lesson, index) {
      const label = lesson.type === "bar-model" ? "Ratio · Bar model" : "Geometry · Angles";
      return `<button class="lesson-tab" type="button" role="tab" data-lesson-index="${index}" aria-selected="${index === lessonIndex}">${label}</button>`;
    }).join("");
    elements.tabs.querySelectorAll(".lesson-tab").forEach(function (button) {
      button.addEventListener("click", function () {
        renderLesson(Number(button.getAttribute("data-lesson-index")));
      });
    });
  }

  function buildStepList(lesson) {
    elements.steps.innerHTML = lesson.beats.map(function (beat, index) {
      return `<li><button class="step-button" type="button" data-step-index="${index}"><span class="step-number">${String(index + 1).padStart(2, "0")}</span><span class="step-copy"><strong>${beat.label}</strong><small>${beat.phase}</small></span></button></li>`;
    }).join("");
    elements.steps.querySelectorAll(".step-button").forEach(function (button) {
      button.addEventListener("click", function () {
        cancelPlayback();
        applyStep(Number(button.getAttribute("data-step-index")));
      });
    });
  }

  function renderLesson(index) {
    cancelPlayback();
    lessonIndex = Math.max(0, Math.min(index, source.lessons.length - 1));
    const lesson = currentLesson();
    elements.eyebrow.textContent = lesson.eyebrow;
    elements.title.textContent = lesson.title;
    elements.concept.textContent = lesson.concept;
    elements.problem.textContent = lesson.problem;
    elements.scene.innerHTML = lesson.type === "bar-model" ? ratioScene() : geometryScene();
    elements.misconception.textContent = lesson.teacherEvidence.likelyMisconception;
    elements.teacherPrompt.textContent = lesson.teacherEvidence.teachingPrompt;
    elements.teacherSuccess.textContent = lesson.teacherEvidence.successCheck;
    elements.mathChecks.innerHTML = lesson.mathChecks.map(function (check) {
      return `<li>${check.method}: ${check.expression} → ${check.result}</li>`;
    }).join("");
    buildTabs();
    buildStepList(lesson);
    applyStep(0, { speak: false });
  }

  function continuePlayback() {
    const lesson = currentLesson();
    if (!playing) return;
    applyStep(stepIndex, { speak: true });
    elements.play.textContent = "Pause lesson";
    timer = window.setTimeout(function () {
      if (stepIndex >= lesson.beats.length - 1) {
        cancelPlayback();
        elements.mode.textContent = "Complete";
        return;
      }
      stepIndex += 1;
      continuePlayback();
    }, reducedMotion ? Math.min(lesson.beats[stepIndex].durationMs, 1800) : lesson.beats[stepIndex].durationMs);
  }

  elements.play.addEventListener("click", function () {
    if (playing) {
      cancelPlayback();
      elements.mode.textContent = "Paused";
      return;
    }
    playing = true;
    stepIndex = 0;
    continuePlayback();
  });

  elements.previous.addEventListener("click", function () {
    cancelPlayback();
    applyStep(stepIndex - 1);
  });

  elements.next.addEventListener("click", function () {
    cancelPlayback();
    applyStep(stepIndex + 1);
  });

  elements.overview.addEventListener("click", function () {
    cancelPlayback();
    const lesson = currentLesson();
    elements.scene.querySelectorAll("[data-object]").forEach(function (node) {
      node.classList.add("is-visible");
      node.classList.remove("is-active");
    });
    stepIndex = lesson.beats.length - 1;
    updateStepList();
    elements.mode.textContent = "Final overview";
    elements.count.textContent = "Complete reasoning";
    elements.narration.textContent = `Review the complete chain. The verified answer is ${lesson.verifiedAnswer}.`;
    elements.progress.setAttribute("aria-valuenow", String(lesson.beats.length));
    elements.progressFill.style.width = "100%";
    elements.previous.disabled = false;
    elements.next.disabled = true;
  });

  elements.audio.addEventListener("click", function () {
    audioOn = !audioOn;
    elements.audio.setAttribute("aria-pressed", String(audioOn));
    elements.audio.textContent = audioOn ? "Voice on" : "Voice off";
    if (!audioOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) cancelPlayback();
  });
  window.addEventListener("pagehide", cancelPlayback);

  renderLesson(0);
})();
