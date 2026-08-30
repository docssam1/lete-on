#!/usr/bin/env node
"use strict";

/*
 * Renders a verified, private English lesson pack to a local post-attempt
 * review experience. Generated HTML must remain outside every Git worktree.
 */

const fs = require("node:fs");
const path = require("node:path");
const lessons = require("./validate-private-sasmo-english-lessons.cjs");
const intake = require("./validate-private-sasmo-diagnostic.cjs");

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function esc(value) {
  return String(value).replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;").replace(/'/gu, "&#39;");
}
function arg(args, name) {
  const index = args.indexOf(name);
  if (index < 0 || !args[index + 1]) fail("LESSON_RENDER_COMMAND_INVALID");
  return args[index + 1];
}
function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
function assertOutput(outputFile) {
  const projectRoot = fs.realpathSync(path.resolve(__dirname, ".."));
  const output = path.resolve(outputFile);
  if (isInside(projectRoot, output)) fail("LESSON_RENDER_OUTPUT_INSIDE_GIT");
  const parent = path.dirname(output);
  fs.mkdirSync(parent, { recursive: true });
  intake.assertExternalPrivateRoot(parent);
  if (path.extname(output).toLowerCase() !== ".html") fail("LESSON_RENDER_OUTPUT_INVALID");
  return output;
}

const AXIS_LABELS = Object.freeze({
  "number-operations":"Number & Operations", "patterns-algebra":"Patterns & Algebra",
  "geometry-spatial":"Geometry & Spatial", "combinatorics-logic":"Combinatorics & Logic",
  "data-probability":"Data & Probability", "problem-solving-strategies":"Problem-Solving Strategies"
});

function visualHtml(model) {
  const tokens = model.tokens.map(function (token, index) {
    return `<li><span class="visual-index">${String(index + 1).padStart(2, "0")}</span><span>${esc(token)}</span></li>`;
  }).join("");
  return `<figure class="visual visual-${esc(model.kind)}" aria-label="${esc(model.caption)}">
    <figcaption>${esc(model.caption)}</figcaption>
    <ol>${tokens}</ol>
  </figure>`;
}

function stepHtml(step, index) {
  return `<li class="solve-step">
    <button class="step-trigger" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
      <span class="step-number">${index + 1}</span><span>${esc(step.label)}</span><span class="step-action">${index === 0 ? "Hide" : "Show"}</span>
    </button>
    <div class="step-body"${index === 0 ? "" : " hidden"}>
      <p>${esc(step.explanation)}</p><div class="math-line">${esc(step.math)}</div>
    </div>
  </li>`;
}

function lessonHtml(lesson, intakeItem, audience, index) {
  const teacher = audience === "teacher" ? `<aside class="teacher-note"><span>Teacher note</span><p>${esc(lesson.teacherNote)}</p><dl><div><dt>Primary skill</dt><dd>${esc(intakeItem.skillId)}</dd></div><div><dt>Likely error family</dt><dd>${esc(intakeItem.primaryErrorType)}</dd></div><div><dt>Evidence</dt><dd>Published solution + independent method</dd></div></dl></aside>` : "";
  const diagramNotice = lesson.verification.sourceDiagramRequired ? `<p class="diagram-notice">Keep the verified source diagram beside this explanation. This review does not replace the contest figure.</p>` : "";
  return `<article class="lesson${index === 0 ? " is-active" : ""}" data-item="${lesson.questionNumber}" data-axis="${esc(intakeItem.axisId)}"${index === 0 ? "" : " hidden"}>
    <header class="lesson-head">
      <div><p class="eyebrow">Question ${lesson.questionNumber} / 25 · ${esc(AXIS_LABELS[intakeItem.axisId])}</p><h2>${esc(lesson.title)}</h2></div>
      <span class="review-state">Post-attempt review</span>
    </header>
    <section class="opening-grid">
      <div><h3>Concept</h3><p class="lead">${esc(lesson.conceptGoal)}</p></div>
      <div><h3>Before you begin</h3><p>${esc(lesson.priorKnowledge)}</p></div>
    </section>
    ${diagramNotice}
    <section aria-labelledby="visual-${lesson.questionNumber}"><h3 id="visual-${lesson.questionNumber}">See it</h3>${visualHtml(lesson.visualModel)}</section>
    <section aria-labelledby="solve-${lesson.questionNumber}"><h3 id="solve-${lesson.questionNumber}">Solve it, one move at a time</h3><ol class="steps">${lesson.steps.map(stepHtml).join("")}</ol></section>
    <section class="reasoning-band"><div><h3>Why it works</h3><p>${esc(lesson.whyItWorks)}</p></div><div><h3>Common mistake</h3><p>${esc(lesson.commonMistake)}</p></div></section>
    <section class="try-again"><div><p class="eyebrow">Try again</p><h3>Do the thinking, not just the copying.</h3><p>${esc(lesson.tryAgain)}</p></div><button class="answer-trigger" type="button" aria-expanded="false">Reveal verified answer</button><div class="answer-panel" hidden><span>Verified answer</span><strong>${esc(lesson.finalAnswer.display)}</strong></div></section>
    ${teacher}
  </article>`;
}

function documentHtml(pack, intakePack, audience) {
  const items = new Map(intakePack.items.map(function (item) { return [item.itemId, item]; }));
  const nav = pack.lessons.map(function (lesson, index) {
    const item = items.get(lesson.itemId);
    return `<button type="button" class="question-link${index === 0 ? " is-current" : ""}" data-go="${lesson.questionNumber}" aria-current="${index === 0 ? "page" : "false"}"><span>${String(lesson.questionNumber).padStart(2, "0")}</span><small>${esc(AXIS_LABELS[item.axisId])}</small></button>`;
  }).join("");
  const content = pack.lessons.map(function (lesson, index) { return lessonHtml(lesson, items.get(lesson.itemId), audience, index); }).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>SASMO 2019 Grade 6 · English Review Studio</title>
<style>
:root{color-scheme:light;--ink:#17231d;--muted:#66736c;--line:#d9ddd7;--paper:#fffef9;--wash:#f1f0e8;--green:#174d35;--mint:#dfece3;--gold:#b9893f;--red:#8d3f34;font-family:"Aptos","Segoe UI",Arial,sans-serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--wash)}button{font:inherit}.shell{display:grid;grid-template-columns:292px minmax(0,1fr);min-height:100vh}.rail{position:sticky;top:0;height:100vh;overflow:auto;padding:24px 18px;background:#17231d;color:#f7f4e8}.brand{padding:4px 8px 21px;border-bottom:1px solid #ffffff26}.brand p{margin:0 0 8px;color:#b9c8be;font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}.brand h1{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:23px;line-height:1.2;font-weight:500}.brand .mode{display:inline-block;margin-top:12px;padding:6px 9px;border:1px solid #ffffff2b;border-radius:999px;color:#dfe9e1;font-size:11px}.progress{padding:18px 8px 10px}.progress-row{display:flex;justify-content:space-between;gap:12px;color:#dfe9e1;font-size:12px}.progress-track{height:3px;margin-top:10px;background:#ffffff21}.progress-bar{display:block;width:4%;height:100%;background:#e5bb70;transition:width .22s ease}.question-nav{display:grid;gap:3px;padding:8px 0 32px}.question-link{display:grid;grid-template-columns:34px 1fr;align-items:center;gap:8px;width:100%;padding:9px 8px;border:0;border-left:2px solid transparent;color:#ccd8d0;background:transparent;text-align:left;cursor:pointer}.question-link span{font-family:Georgia,serif;font-size:17px}.question-link small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}.question-link:hover,.question-link:focus-visible{outline:none;background:#ffffff0d;color:#fff}.question-link.is-current{border-left-color:#e5bb70;background:#ffffff12;color:#fff}.stage{min-width:0;padding:34px}.paper{max-width:980px;margin:0 auto;padding:48px 58px 62px;border:1px solid #deddd5;background:var(--paper);box-shadow:0 22px 60px #2c3b3115}.paper-top{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:40px;padding-bottom:16px;border-bottom:1px solid var(--ink)}.paper-top p{margin:0;color:var(--muted);font-size:12px}.paper-top strong{font-family:Georgia,serif;font-size:18px;font-weight:500}.lesson[hidden]{display:none}.lesson-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start}.eyebrow{margin:0 0 8px;color:var(--green);font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.lesson h2{max-width:710px;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(30px,4vw,50px);line-height:1.02;font-weight:500;letter-spacing:-.035em}.review-state{flex:none;padding:7px 10px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:11px}.opening-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:34px;margin:38px 0 32px;padding:24px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}h3{margin:0 0 8px;font-size:13px;letter-spacing:.03em}.opening-grid p,.reasoning-band p,.teacher-note p{margin:0;color:#435148;line-height:1.65}.lead{font-family:Georgia,serif;font-size:20px!important;line-height:1.5!important}.diagram-notice{padding:10px 13px;border-left:3px solid var(--gold);background:#f8f1e4;color:#6b512c;font-size:12px;line-height:1.55}.visual{margin:14px 0 34px;padding:22px;border:1px solid #cdd8cf;background:#f4f8f3}.visual figcaption{max-width:720px;margin-bottom:20px;color:#3d5548;font-family:Georgia,serif;font-size:16px;line-height:1.45}.visual ol{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px;margin:0;padding:0;list-style:none}.visual li{position:relative;display:flex;align-items:center;gap:8px;min-height:52px;padding:10px 13px;border:1px solid #cbd8ce;background:#fff;font-size:13px;line-height:1.3}.visual li:not(:last-child)::after{content:"→";position:absolute;right:-10px;z-index:2;color:var(--gold);font-weight:800}.visual-index{color:#75907f;font-family:Georgia,serif;font-size:11px}.visual-set-diagram ol{position:relative;justify-content:center;min-height:130px}.visual-set-diagram li{width:150px;height:110px;justify-content:center;border-radius:55%;text-align:center}.visual-set-diagram li:nth-child(2){margin-left:-42px}.visual-set-diagram li:nth-child(n+3){width:auto;height:auto;border-radius:0;align-self:flex-end}.visual-percent-bar ol,.visual-rate-bar ol,.visual-unit-bar ol,.visual-ratio-bars ol,.visual-fraction-strip ol,.visual-percent-chain ol,.visual-cycle-timeline ol{flex-direction:column}.visual-percent-bar li,.visual-rate-bar li,.visual-unit-bar li,.visual-ratio-bars li,.visual-fraction-strip li,.visual-percent-chain li,.visual-cycle-timeline li{width:min(100%,calc(220px + var(--n,0)*50px))}.visual-column-addition ol{max-width:280px;margin:auto;flex-direction:column;align-items:flex-end;font-family:"Cascadia Mono",monospace;font-size:18px}.visual-column-addition li{min-width:190px;justify-content:flex-end}.steps{display:grid;gap:1px;margin:14px 0 34px;padding:0;border-top:1px solid var(--line);list-style:none}.solve-step{border-bottom:1px solid var(--line)}.step-trigger{display:grid;grid-template-columns:38px 1fr auto;align-items:center;width:100%;padding:14px 0;border:0;background:transparent;color:var(--ink);text-align:left;cursor:pointer}.step-trigger:focus-visible{outline:2px solid var(--gold);outline-offset:3px}.step-number{font-family:Georgia,serif;color:var(--gold);font-size:18px}.step-action{color:var(--muted);font-size:11px}.step-body{padding:0 0 18px 38px}.step-body p{margin:0 0 10px;color:#435148;line-height:1.65}.math-line{padding:12px 14px;border-left:3px solid var(--green);background:#eef3ee;font-family:"Cascadia Mono","Courier New",monospace;font-size:14px;line-height:1.5}.reasoning-band{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin:34px 0;background:var(--line);border:1px solid var(--line)}.reasoning-band>div{padding:20px;background:#fff}.reasoning-band>div:last-child{border-top:3px solid var(--red)}.try-again{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;padding:25px;border:1px solid #b9cbbd;background:var(--mint)}.try-again h3{font-family:Georgia,serif;font-size:21px;font-weight:500}.try-again p{margin:6px 0 0;line-height:1.6}.answer-trigger{padding:11px 15px;border:1px solid var(--green);background:var(--green);color:#fff;cursor:pointer}.answer-trigger:hover,.answer-trigger:focus-visible{outline:3px solid #b7cdbf;outline-offset:2px}.answer-panel{grid-column:1/-1;padding-top:18px;border-top:1px solid #adc0b1}.answer-panel span{display:block;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.1em}.answer-panel strong{display:block;margin-top:5px;font-family:Georgia,serif;font-size:26px}.teacher-note{margin-top:28px;padding:20px 22px;border:1px solid #d8cfb9;background:#fbf7ee}.teacher-note>span{display:block;margin-bottom:8px;color:#805d25;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.teacher-note dl{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0 0}.teacher-note dl div{padding-top:10px;border-top:1px solid #ded5c1}.teacher-note dt{color:#7b7568;font-size:10px;text-transform:uppercase}.teacher-note dd{margin:5px 0 0;font-size:12px}.lesson-controls{display:flex;justify-content:space-between;gap:12px;margin-top:34px}.lesson-controls button{padding:10px 14px;border:1px solid var(--line);background:#fff;color:var(--ink);cursor:pointer}.lesson-controls button:disabled{opacity:.35;cursor:not-allowed}
@media(max-width:820px){.shell{display:block}.rail{position:relative;height:auto;padding:17px 14px}.brand{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-bottom:14px}.brand p,.brand .mode{display:none}.brand h1{font-size:19px}.progress{padding:12px 4px 5px}.question-nav{display:flex;overflow-x:auto;gap:5px;padding:8px 2px 12px;scrollbar-width:thin}.question-link{flex:0 0 47px;display:block;padding:9px 4px;border:1px solid #ffffff21;border-left-width:1px;text-align:center}.question-link small{display:none}.question-link.is-current{border-color:#e5bb70}.stage{padding:0}.paper{width:100%;padding:28px 18px 38px;border:0;box-shadow:none}.paper-top{margin-bottom:30px}.paper-top p{display:none}.lesson-head{display:block}.review-state{display:inline-block;margin-top:14px}.opening-grid,.reasoning-band{grid-template-columns:1fr;gap:0}.opening-grid>div{padding:12px 0}.opening-grid>div+div{border-top:1px solid var(--line)}.visual{margin-left:-18px;margin-right:-18px;padding:18px}.visual ol{flex-direction:column}.visual li{width:100%!important;height:auto!important;margin:0!important;border-radius:0!important;justify-content:flex-start!important}.visual li:not(:last-child)::after{content:"↓";right:12px;bottom:-12px;top:auto}.step-body{padding-left:0}.reasoning-band>div+div{border-top:1px solid var(--line)}.try-again{grid-template-columns:1fr}.answer-trigger{width:100%}.teacher-note dl{grid-template-columns:1fr}.lesson h2{font-size:34px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.progress-bar{transition:none}}
@media print{body{background:#fff}.shell{display:block}.rail,.paper-top,.lesson-controls,.answer-trigger{display:none}.stage{padding:0}.paper{max-width:none;padding:0;border:0;box-shadow:none}.lesson[hidden]{display:none}.step-body[hidden],.answer-panel[hidden]{display:block}.lesson{break-inside:auto}.visual,.solve-step,.reasoning-band,.try-again,.teacher-note{break-inside:avoid}}
</style>
</head>
<body>
<div class="shell">
  <aside class="rail"><div class="brand"><div><p>GFIELD Boarding Mathematics</p><h1>SASMO English Review Studio</h1></div><span class="mode">${audience === "teacher" ? "Teacher edition" : "Student edition"}</span></div><div class="progress"><div class="progress-row"><span>Lesson progress</span><span id="progress-label">1 / 25</span></div><div class="progress-track"><span class="progress-bar" id="progress-bar"></span></div></div><nav class="question-nav" aria-label="Question lessons">${nav}</nav></aside>
  <main class="stage"><div class="paper"><div class="paper-top"><strong>2019 · Grade 6</strong><p>Private verified review · Use only after the assigned attempt</p></div>${content}<div class="lesson-controls"><button type="button" id="previous">Previous lesson</button><button type="button" id="next">Next lesson</button></div></div></main>
</div>
<script>
(() => {
  const lessonNodes = [...document.querySelectorAll('.lesson')];
  const links = [...document.querySelectorAll('.question-link')];
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const label = document.querySelector('#progress-label');
  const bar = document.querySelector('#progress-bar');
  let current = 0;
  function show(index, focusHeading = false) {
    current = Math.max(0, Math.min(lessonNodes.length - 1, index));
    lessonNodes.forEach((node, i) => { node.hidden = i !== current; node.classList.toggle('is-active', i === current); });
    links.forEach((link, i) => { link.classList.toggle('is-current', i === current); link.setAttribute('aria-current', i === current ? 'page' : 'false'); });
    links[current].scrollIntoView({block:'nearest', inline:'nearest'});
    label.textContent = (current + 1) + ' / ' + lessonNodes.length;
    bar.style.width = ((current + 1) / lessonNodes.length * 100) + '%';
    previous.disabled = current === 0; next.disabled = current === lessonNodes.length - 1;
    if (focusHeading) { window.scrollTo({top:0, behavior:'smooth'}); lessonNodes[current].querySelector('h2').setAttribute('tabindex','-1'); lessonNodes[current].querySelector('h2').focus({preventScroll:true}); }
  }
  links.forEach((link, index) => link.addEventListener('click', () => show(index, true)));
  previous.addEventListener('click', () => show(current - 1, true));
  next.addEventListener('click', () => show(current + 1, true));
  document.addEventListener('click', (event) => {
    const step = event.target.closest('.step-trigger');
    if (step) { const body = step.nextElementSibling; const open = step.getAttribute('aria-expanded') === 'true'; step.setAttribute('aria-expanded', String(!open)); step.querySelector('.step-action').textContent = open ? 'Show' : 'Hide'; body.hidden = open; }
    const answer = event.target.closest('.answer-trigger');
    if (answer) { const panel = answer.nextElementSibling; const open = answer.getAttribute('aria-expanded') === 'true'; answer.setAttribute('aria-expanded', String(!open)); answer.textContent = open ? 'Reveal verified answer' : 'Hide verified answer'; panel.hidden = open; }
  });
  show(0);
})();
</script>
</body></html>`;
}

function render(options) {
  const audience = options.audience;
  if (!new Set(["student", "teacher"]).has(audience)) fail("LESSON_RENDER_AUDIENCE_INVALID");
  const loaded = lessons.loadAndValidate(options);
  const output = assertOutput(options.output);
  fs.writeFileSync(output, documentHtml(loaded.pack, loaded.intakePack, audience), { encoding: "utf8", flag: "w" });
  return Object.freeze({ output, audience, lessonCount: loaded.validation.lessonCount });
}

if (require.main === module) {
  try {
    const result = render({
      lessonRoot: arg(process.argv, "--lesson-root"), lessonFile: arg(process.argv, "--lesson-file"),
      intakeRoot: arg(process.argv, "--intake-root"), intakeFile: arg(process.argv, "--intake-file"),
      audience: arg(process.argv, "--audience"), output: arg(process.argv, "--output")
    });
    console.log(`PASS private SASMO English lesson render: ${result.audience}, ${result.lessonCount} lessons -> ${result.output}`);
  } catch (error) {
    console.error(`BLOCKED private SASMO English lesson render: ${error.code || "INVALID"}`);
    process.exitCode = 2;
  }
}

module.exports = Object.freeze({ render, documentHtml });
