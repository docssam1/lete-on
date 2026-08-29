#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const lessonValidator = require("./validate-private-sasmo-english-lessons.cjs");
const mediaValidator = require("./validate-private-sasmo-question-media.cjs");
const intakeValidator = require("./validate-private-sasmo-diagnostic.cjs");

const SAMPLE_QUESTIONS = Object.freeze([6, 16, 7, 20]);
const CONCEPT_SCHEMA = "gfield-private-english-concept-lesson-v1";

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function esc(value) { return String(value).replace(/&/gu,"&amp;").replace(/</gu,"&lt;").replace(/>/gu,"&gt;").replace(/"/gu,"&quot;").replace(/'/gu,"&#39;"); }
function inside(parent, child) { const relative = path.relative(parent, child); return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative)); }
function arg(args, name) { const index = args.indexOf(name); if (index < 0 || !args[index + 1]) fail("WHITEBOARD_COMMAND_INVALID"); return args[index + 1]; }
function jsonScript(value) { return JSON.stringify(value).replace(/</gu,"\\u003c"); }

function loadConcept(rootValue, fileName) {
  const root = intakeValidator.assertExternalPrivateRoot(rootValue);
  if (!/^sasmo-g6-concept-[a-z0-9-]+\.json$/u.test(fileName)) fail("WHITEBOARD_CONCEPT_FILE_INVALID");
  const filePath = path.resolve(root, fileName);
  if (!inside(root, filePath)) fail("WHITEBOARD_CONCEPT_FILE_INVALID");
  let concept;
  try { concept = JSON.parse(fs.readFileSync(filePath,"utf8")); } catch (_error) { fail("WHITEBOARD_CONCEPT_JSON_INVALID"); }
  const keys = ["schemaVersion","conceptId","language","title","subtitle","learningGoal","estimatedMinutes","linkedSkills","segments","reflectionPrompt"];
  if (!concept || typeof concept !== "object" || Array.isArray(concept) || Object.keys(concept).some(function(key){return !keys.includes(key);})) fail("WHITEBOARD_CONCEPT_INVALID");
  if (concept.schemaVersion !== CONCEPT_SCHEMA || concept.language !== "en-US" || concept.conceptId !== "ratio-common-totals" || !Number.isInteger(concept.estimatedMinutes) || concept.estimatedMinutes < 2 || concept.estimatedMinutes > 4) fail("WHITEBOARD_CONCEPT_INVALID");
  if (!Array.isArray(concept.segments) || concept.segments.length < 5 || concept.segments.length > 9) fail("WHITEBOARD_CONCEPT_SEGMENTS_INVALID");
  concept.segments.forEach(function(segment,index){
    if (!segment || typeof segment !== "object" || !/^[a-z][a-z0-9-]+$/u.test(segment.segmentId) || typeof segment.narration !== "string" || segment.narration.length < 30 || typeof segment.math !== "string" || !segment.math || typeof segment.visualTarget !== "string") fail(`WHITEBOARD_CONCEPT_SEGMENT_${index}_INVALID`);
  });
  return concept;
}

function outputPath(value) {
  const output = path.resolve(value);
  const project = fs.realpathSync(path.resolve(__dirname,".."));
  if (inside(project,output) || path.extname(output).toLowerCase() !== ".html") fail("WHITEBOARD_OUTPUT_INVALID");
  fs.mkdirSync(path.dirname(output),{recursive:true});
  intakeValidator.assertExternalPrivateRoot(path.dirname(output));
  return output;
}

function conceptBoard() {
  const cells = Array.from({length:20},function(_v,index){return `<span class="ratio-cell${index < 5 ? " part-a" : ""}${index >= 5 && index < 9 ? " part-b" : ""}"></span>`;}).join("");
  return `<div class="concept-board teaching-board" aria-label="Animated ratio bar model">
    <div class="board-beat" data-beat-id="notice-the-language"><span class="beat-label">Part and rest</span><div class="bar four"><i></i><i></i><i></i><i></i></div><p>part : rest = 1 : 3</p></div>
    <div class="board-beat" data-beat-id="build-the-whole"><span class="beat-label">Build the whole</span><p class="large-math">1 + 3 = 4 equal parts</p></div>
    <div class="board-beat" data-beat-id="write-the-fraction"><span class="beat-label">Share of the whole</span><p class="large-math">part / whole = 1 / 4</p></div>
    <div class="board-beat" data-beat-id="compare-another-share"><span class="beat-label">A second relationship</span><div class="bar five"><i></i><i></i><i></i><i></i><i></i></div><p>1 : 4 becomes 1 / 5</p></div>
    <div class="board-beat wide" data-beat-id="choose-a-common-total"><span class="beat-label">One common total</span><div class="twenty-grid">${cells}</div><p>1/4 = 5/20 · 1/5 = 4/20</p></div>
    <div class="board-beat" data-beat-id="thinking-pause"><span class="beat-label">Thinking pause</span><p>Why must every bar represent the same whole?</p></div>
    <div class="board-beat" data-beat-id="recap"><span class="beat-label">Rule</span><p>part : rest → part / whole → common total</p></div>
  </div>`;
}

function q6Board(lesson) {
  return `<div class="geometry-board teaching-board q6-board" aria-label="Angle-chase teaching diagram">
    <svg viewBox="0 0 560 330" role="img" aria-label="Two squares and equilateral triangle CED">
      <g class="base-geometry"><path d="M62 140 L200 60 L280 198 L142 278 Z"/><path d="M280 198 L360 60 L498 140 L418 278 Z"/><path d="M200 60 L360 60 L280 198 Z"/></g>
      <g class="labels"><text x="45" y="143">A</text><text x="190" y="45">D</text><text x="272" y="218">C</text><text x="130" y="300">B</text><text x="354" y="45">E</text><text x="505" y="143">F</text><text x="420" y="300">G</text></g>
      <g class="angle-mark board-beat" data-beat-id="q06-step-1"><path d="M200 78 L218 88 L208 106"/><text x="220" y="85">90° + 60° = 150°</text></g>
      <g class="angle-mark board-beat" data-beat-id="q06-step-2"><path d="M79 142 A26 26 0 0 1 84 166"/><text x="84" y="185">15°</text><path d="M349 65 l-8 14 M334 73 l8 14"/></g>
      <g class="answer-mark board-beat" data-beat-id="q06-step-3"><path d="M76 147 A44 44 0 0 1 100 177"/><text x="103" y="165">30°</text></g>
    </svg><p class="board-beat board-intro" data-beat-id="q06-intro">${esc(lesson.conceptGoal)}</p>
  </div>`;
}

function genericBoard(lesson, number) {
  return `<div class="teaching-board generic-board" aria-label="Step-by-step visual model">
    <div class="board-beat board-intro" data-beat-id="q${String(number).padStart(2,"0")}-intro"><span class="beat-label">Goal</span><p>${esc(lesson.conceptGoal)}</p></div>
    ${lesson.steps.map(function(step,index){return `<div class="board-beat" data-beat-id="q${String(number).padStart(2,"0")}-step-${index+1}"><span class="beat-label">${index+1}. ${esc(step.label)}</span><p>${esc(step.explanation)}</p><strong>${esc(step.math)}</strong></div>`;}).join("")}
  </div>`;
}

function playerControls(id) {
  return `<div class="player-controls" data-controls="${esc(id)}">
    <button type="button" data-action="play">▶ Play lesson</button><button type="button" data-action="pause">Pause</button><button type="button" data-action="restart">Restart</button><button type="button" data-action="stop">Stop</button>
    <label>Speed <select data-action="speed"><option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option></select></label>
  </div><div class="caption" aria-live="polite" data-caption="${esc(id)}">Press Play lesson to hear the English explanation.</div>`;
}

function conceptPanel(concept) {
  return `<article class="sample-panel is-active" data-panel="concept">
    <header class="panel-head"><p class="eyebrow">Concept lesson · ${concept.estimatedMinutes} minutes</p><h2>${esc(concept.title)}</h2><p>${esc(concept.subtitle)}</p></header>
    <section class="goal"><strong>Learning goal</strong><p>${esc(concept.learningGoal)}</p></section>
    <section class="watch"><div class="section-title"><span>01</span><div><p>Watch the idea</p><h3>Listen and watch one relationship appear at a time.</h3></div></div>${playerControls("concept")}${conceptBoard()}</section>
    <section class="step-study"><div class="section-title"><span>02</span><div><p>Study step by step</p><h3>Open each step at your own pace.</h3></div></div><div class="details-list">${concept.segments.map(function(segment,index){return `<details${index===0?" open":""}><summary><b>${String(index+1).padStart(2,"0")}</b>${esc(segment.title)}</summary><div><p>${esc(segment.narration)}</p><strong>${esc(segment.math)}</strong></div></details>`;}).join("")}</div></section>
    <section class="reflection"><p class="eyebrow">Try it</p><h3>${esc(concept.reflectionPrompt)}</h3></section>
  </article>`;
}

function problemPanel(lesson, item, asset, order) {
  const id=`q${String(lesson.questionNumber).padStart(2,"0")}`;
  const board=lesson.questionNumber===6?q6Board(lesson):genericBoard(lesson,lesson.questionNumber);
  return `<article class="sample-panel" data-panel="${id}" hidden>
    <header class="panel-head"><p class="eyebrow">${order<3?"Geometry":"Algebraic reasoning"} · Actual SASMO 2019 question</p><h2>Question ${lesson.questionNumber}: ${esc(lesson.title)}</h2></header>
    <section class="actual-problem"><div class="section-title"><span>01</span><div><p>Read the actual problem</p><h3>The original prompt, choices, labels, and diagram are preserved.</h3></div></div><div class="question-image-frame" data-beat-id="${id}-problem"><img src="${asset.dataUri}" alt="${esc(asset.altText)}" width="${asset.width}" height="${asset.height}"></div><button type="button" class="zoom-control" aria-expanded="false">Open full-size question</button></section>
    <section class="watch"><div class="section-title"><span>02</span><div><p>Watch the solution</p><h3>English narration and the matching math step move together.</h3></div></div>${playerControls(id)}${board}</section>
    <section class="step-study"><div class="section-title"><span>03</span><div><p>Study step by step</p><h3>Pause, open a step, and check the equation.</h3></div></div><div class="details-list">${lesson.steps.map(function(step,index){return `<details${index===0?" open":""}><summary><b>${String(index+1).padStart(2,"0")}</b>${esc(step.label)}</summary><div><p>${esc(step.explanation)}</p><strong>${esc(step.math)}</strong></div></details>`;}).join("")}</div></section>
    <section class="reason"><div><p class="eyebrow">Why it works</p><p>${esc(lesson.whyItWorks)}</p></div><div><p class="eyebrow">Common mistake</p><p>${esc(lesson.commonMistake)}</p></div></section>
    <section class="answer"><button type="button" class="answer-button" aria-expanded="false">Reveal verified answer</button><strong hidden>${esc(lesson.finalAnswer.display)}</strong></section>
  </article>`;
}

function narrationData(concept, lessons, mediaAssets) {
  const result={concept:concept.segments.map(function(segment){return {id:segment.segmentId,text:segment.narration};})};
  lessons.forEach(function(lesson){
    const id=`q${String(lesson.questionNumber).padStart(2,"0")}`;
    const asset=mediaAssets.get(lesson.itemId);
    result[id]=[{id:`${id}-problem`,text:asset.spokenPrompt},{id:`${id}-intro`,text:lesson.conceptGoal}].concat(lesson.steps.map(function(step,index){return {id:`${id}-step-${index+1}`,text:`${step.label}. ${step.explanation}. ${step.math}`};}));
  });
  return result;
}

function documentHtml(options) {
  const {concept,pack,intakePack,mediaAssets}=options;
  const lessonByNumber=new Map(pack.lessons.map(function(lesson){return [lesson.questionNumber,lesson];}));
  const intakeById=new Map(intakePack.items.map(function(item){return [item.itemId,item];}));
  const selected=SAMPLE_QUESTIONS.map(function(number){const lesson=lessonByNumber.get(number);if(!lesson)fail("WHITEBOARD_SAMPLE_LESSON_MISSING");return lesson;});
  const tabs=[`<button type="button" class="lesson-tab is-current" data-show="concept" aria-current="page"><b>Concept</b><span>Common totals</span></button>`].concat(selected.map(function(lesson,index){return `<button type="button" class="lesson-tab" data-show="q${String(lesson.questionNumber).padStart(2,"0")}" aria-current="false"><b>${index<2?"Geometry":"Algebra"} ${index%2+1}</b><span>Question ${lesson.questionNumber}</span></button>`;})).join("");
  const panels=conceptPanel(concept)+selected.map(function(lesson,index){return problemPanel(lesson,intakeById.get(lesson.itemId),mediaAssets.get(lesson.itemId),index+1);}).join("");
  const narration=narrationData(concept,selected,mediaAssets);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>G·MAP English Math Lesson Sample</title><style>
:root{--ink:#18231d;--muted:#647068;--paper:#fffefa;--wash:#efeee7;--line:#d8ddd7;--green:#174d35;--mint:#deece3;--gold:#b9893f;--red:#9b4639;font-family:"Aptos","Segoe UI",Arial,sans-serif;color:var(--ink);background:var(--wash)}*{box-sizing:border-box}body{margin:0;background:var(--wash)}button,select{font:inherit}.app{display:grid;grid-template-columns:250px minmax(0,1fr);min-height:100vh}.rail{position:sticky;top:0;height:100vh;padding:24px 16px;background:var(--ink);color:white}.brand{padding:5px 7px 22px;border-bottom:1px solid #ffffff26}.brand small{color:#b7c8bc;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.brand h1{margin:8px 0 0;font-family:Georgia,serif;font-size:23px;font-weight:500}.tabs{display:grid;gap:5px;margin-top:18px}.lesson-tab{display:grid;gap:3px;padding:12px;border:0;border-left:2px solid transparent;background:transparent;color:#d5dfd8;text-align:left;cursor:pointer}.lesson-tab span{font-size:11px;color:#aebdb3}.lesson-tab:hover,.lesson-tab:focus-visible{outline:none;background:#ffffff0c}.lesson-tab.is-current{border-color:#e4b96e;background:#ffffff12;color:white}.stage{min-width:0;padding:34px}.paper{max-width:1040px;margin:auto;padding:48px 56px 70px;border:1px solid #deddd5;background:var(--paper);box-shadow:0 24px 70px #34413812}.sample-panel[hidden]{display:none}.panel-head{padding-bottom:26px;border-bottom:1px solid var(--ink)}.eyebrow{margin:0 0 8px!important;color:var(--green);font-size:10px!important;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.panel-head h2{max-width:800px;margin:0;font-family:Georgia,serif;font-size:clamp(32px,4vw,52px);line-height:1.05;font-weight:500;letter-spacing:-.035em}.panel-head>p:last-child{max-width:720px;margin:14px 0 0;color:var(--muted);font-size:17px;line-height:1.55}.goal{margin:26px 0;padding:18px 20px;border-left:4px solid var(--gold);background:#f7f1e5}.goal p{margin:7px 0 0;line-height:1.6}.actual-problem,.watch,.step-study{margin-top:44px}.section-title{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;margin-bottom:16px}.section-title>span{font-family:Georgia,serif;color:var(--gold);font-size:23px}.section-title p{margin:0;color:var(--green);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.section-title h3{margin:5px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:500}.question-image-frame{overflow:hidden;border:1px solid #cfd5cf;background:white}.question-image-frame img{display:block;width:100%;height:auto}.question-image-frame.is-zoomed{overflow:auto}.question-image-frame.is-zoomed img{width:1300px;max-width:none}.zoom-control{margin-top:8px;padding:9px 13px;border:1px solid var(--green);background:white;color:var(--green);cursor:pointer}.player-controls{display:flex;flex-wrap:wrap;gap:7px;padding:12px;border:1px solid #cbd7ce;border-bottom:0;background:#f0f5f1}.player-controls button,.player-controls select{min-height:40px;padding:8px 12px;border:1px solid #b9c7bd;background:white;color:var(--ink);cursor:pointer}.player-controls button:first-child{background:var(--green);color:white}.player-controls label{display:flex;align-items:center;gap:6px;margin-left:auto;font-size:12px}.caption{min-height:64px;padding:13px 16px;border:1px solid #cbd7ce;background:#fff;color:#3d4b42;line-height:1.55}.teaching-board{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px;padding:18px;border:1px solid #cad8cd;background:#edf4ee}.board-beat{padding:14px;border:1px solid #ced9d0;background:#ffffff;color:#667169;opacity:.42;transition:opacity .2s ease,transform .2s ease,border-color .2s ease}.board-beat.is-current{border-color:var(--gold);color:var(--ink);opacity:1;transform:translateY(-2px);box-shadow:0 8px 18px #4d5c5020}.board-beat.is-complete{opacity:.78}.board-beat.wide{grid-column:1/-1}.beat-label{display:block;margin-bottom:8px;color:var(--green);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.board-beat p{margin:5px 0;line-height:1.5}.large-math,.generic-board strong{font-family:"Cascadia Mono",monospace}.bar{display:flex;height:38px;margin:8px 0}.bar i{flex:1;border:1px solid #547461;background:#f9fcf9}.bar i:first-child{background:#efc98a}.twenty-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:3px}.ratio-cell{height:22px;border:1px solid #81948a;background:white}.part-a{background:#efc98a}.part-b{background:#9bc4aa}.geometry-board{display:block;position:relative}.geometry-board svg{display:block;width:100%;max-height:460px}.base-geometry{fill:none;stroke:#25372d;stroke-width:4}.labels{font-family:Georgia,serif;font-size:18px;font-style:italic}.angle-mark,.answer-mark{fill:none;stroke:var(--gold);stroke-width:4}.angle-mark text,.answer-mark text{fill:var(--red);stroke:none;font:700 16px "Segoe UI",sans-serif}.q6-board .board-beat{opacity:.16}.q6-board .board-beat.is-current{opacity:1;transform:none;box-shadow:none}.q6-board .board-intro{margin-top:0}.generic-board{grid-template-columns:1fr}.generic-board strong{display:block;margin-top:9px;padding:10px;border-left:3px solid var(--green);background:#eef3ee}.details-list{border-top:1px solid var(--line)}details{border-bottom:1px solid var(--line)}summary{display:grid;grid-template-columns:42px 1fr;gap:10px;padding:15px 0;cursor:pointer;font-weight:700}summary b{color:var(--gold);font-family:Georgia,serif;font-size:18px}details>div{padding:0 0 18px 52px}details p{margin:0 0 10px;line-height:1.65;color:#46534b}details strong{display:block;padding:11px 13px;border-left:3px solid var(--green);background:#eef3ee;font-family:"Cascadia Mono",monospace}.reason{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-top:35px;border:1px solid var(--line);background:var(--line)}.reason>div{padding:19px;background:white}.reason p:last-child{margin:0;line-height:1.6}.answer{display:flex;align-items:center;gap:18px;margin-top:24px;padding:20px;background:var(--mint)}.answer-button{padding:11px 15px;border:0;background:var(--green);color:white;cursor:pointer}.answer strong{font-family:Georgia,serif;font-size:24px}.reflection{margin-top:30px;padding:22px;border:1px solid #c0d1c4;background:var(--mint)}.reflection h3{margin:0;font-family:Georgia,serif;font-size:22px;font-weight:500;line-height:1.45}.speaking-target{outline:3px solid #e3b768;outline-offset:3px}
@media(max-width:760px){.app{display:block}.rail{position:relative;height:auto;padding:14px}.brand{padding-bottom:12px}.brand h1{font-size:19px}.tabs{display:flex;overflow:auto;margin-top:10px}.lesson-tab{flex:0 0 112px;padding:9px}.stage{padding:0}.paper{padding:28px 16px 45px;border:0;box-shadow:none}.panel-head h2{font-size:34px}.player-controls label{width:100%;margin:0}.teaching-board,.reason{grid-template-columns:1fr}.board-beat.wide{grid-column:auto}.question-image-frame{margin-left:-16px;margin-right:-16px}.question-image-frame img{min-width:100%;}.section-title h3{font-size:19px}details>div{padding-left:0}.answer{align-items:flex-start;flex-direction:column}.geometry-board{margin-left:-16px;margin-right:-16px;padding:10px}.geometry-board svg{min-width:620px}.geometry-board{overflow:auto}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
.brand p{margin:6px 0 0;color:#b7c8bc;font-size:11px;line-height:1.4}.brand .brand-range{color:#e4b96e;font-weight:700}.concept-board .board-beat,.generic-board .board-beat{opacity:.68}.concept-board .board-beat.is-current,.generic-board .board-beat.is-current{opacity:1}.concept-board .board-beat.is-complete,.generic-board .board-beat.is-complete{opacity:.84}
</style></head><body><div class="app"><aside class="rail"><div class="brand"><small>GFIELD Math Assessment &amp; Pathway</small><h1>G·MAP Lessons</h1><p class="brand-range">From Foundations to Competition.</p><p>Diagnose. Learn. Advance.</p></div><nav class="tabs">${tabs}</nav></aside><main class="stage"><div class="paper">${panels}</div></main></div><script id="narration-data" type="application/json">${jsonScript(narration)}</script><script>
(()=>{const data=JSON.parse(document.querySelector('#narration-data').textContent);let run=0,paused=false,currentId=null,currentIndex=0;const synth=window.speechSynthesis;
function panel(id){return document.querySelector('[data-panel="'+id+'"]')}function clear(p){p.querySelectorAll('.board-beat,.question-image-frame').forEach(n=>n.classList.remove('is-current','is-complete','speaking-target'))}
function voice(){return synth.getVoices().find(v=>/^en(?:-|_)/i.test(v.lang))||null}function stop(){run++;synth.cancel();paused=false;document.querySelectorAll('.sample-panel').forEach(clear);document.querySelectorAll('.caption').forEach(c=>c.textContent='Lesson stopped. Press Play lesson to start again.')}
function speak(id,start=0){stop();currentId=id;currentIndex=start;const token=run;const segments=data[id];const p=panel(id);function next(){if(token!==run||currentIndex>=segments.length)return;const s=segments[currentIndex];clear(p);segments.slice(0,currentIndex).forEach(done=>{const n=p.querySelector('[data-beat-id="'+done.id+'"]');if(n)n.classList.add('is-complete')});const target=p.querySelector('[data-beat-id="'+s.id+'"]');if(target){target.classList.add('is-current','speaking-target');target.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}const caption=p.querySelector('[data-caption="'+id+'"]');caption.textContent=s.text;const u=new SpeechSynthesisUtterance(s.text);u.lang='en-US';u.rate=Number(p.querySelector('[data-action="speed"]').value);const v=voice();if(v)u.voice=v;u.onend=()=>{if(token===run){currentIndex++;next()}};u.onerror=()=>{caption.textContent='Voice playback is unavailable in this browser. The complete English caption remains visible.'};synth.speak(u)}next()}
document.addEventListener('click',e=>{const tab=e.target.closest('.lesson-tab');if(tab){stop();document.querySelectorAll('.lesson-tab').forEach(b=>{b.classList.toggle('is-current',b===tab);b.setAttribute('aria-current',b===tab?'page':'false')});document.querySelectorAll('.sample-panel').forEach(p=>p.hidden=p.dataset.panel!==tab.dataset.show);return}const controls=e.target.closest('[data-controls]');if(controls){const action=e.target.closest('[data-action]')?.dataset.action;const id=controls.dataset.controls;if(action==='play')speak(id,0);if(action==='restart')speak(id,0);if(action==='stop')stop();if(action==='pause'){if(synth.speaking&&!paused){synth.pause();paused=true;e.target.textContent='Resume'}else if(paused){synth.resume();paused=false;e.target.textContent='Pause'}}return}const zoom=e.target.closest('.zoom-control');if(zoom){const frame=zoom.previousElementSibling;const on=frame.classList.toggle('is-zoomed');zoom.setAttribute('aria-expanded',String(on));zoom.textContent=on?'Fit question to page':'Open full-size question';return}const answer=e.target.closest('.answer-button');if(answer){const value=answer.nextElementSibling;const on=answer.getAttribute('aria-expanded')==='true';answer.setAttribute('aria-expanded',String(!on));answer.textContent=on?'Reveal verified answer':'Hide verified answer';value.hidden=on}});window.addEventListener('beforeunload',()=>synth.cancel())})();
</script></body></html>`;
}

function render(options) {
  const loaded=lessonValidator.loadAndValidate(options);
  const media=mediaValidator.loadAndValidate({mediaRoot:options.mediaRoot,mediaFile:options.mediaFile,intakePack:loaded.intakePack});
  const concept=loadConcept(options.conceptRoot,options.conceptFile);
  const output=outputPath(options.output);
  fs.writeFileSync(output,documentHtml({concept,pack:loaded.pack,intakePack:loaded.intakePack,mediaAssets:media.validation.assets}),"utf8");
  return Object.freeze({output,sampleQuestions:SAMPLE_QUESTIONS,conceptId:concept.conceptId,voiceSource:"browser-speech-synthesis"});
}

if(require.main===module){try{const result=render({lessonRoot:arg(process.argv,"--lesson-root"),lessonFile:arg(process.argv,"--lesson-file"),mediaRoot:arg(process.argv,"--media-root"),mediaFile:arg(process.argv,"--media-file"),intakeRoot:arg(process.argv,"--intake-root"),intakeFile:arg(process.argv,"--intake-file"),conceptRoot:arg(process.argv,"--concept-root"),conceptFile:arg(process.argv,"--concept-file"),output:arg(process.argv,"--output")});console.log(`PASS SASMO whiteboard sample: concept + ${result.sampleQuestions.length} problem lessons -> ${result.output}`)}catch(error){console.error(`BLOCKED SASMO whiteboard sample: ${error.code||error.message||"INVALID"}`);process.exitCode=2}}

module.exports=Object.freeze({SAMPLE_QUESTIONS,loadConcept,documentHtml,render});
