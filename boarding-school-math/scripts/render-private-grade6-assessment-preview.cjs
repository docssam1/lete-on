#!/usr/bin/env node
"use strict";

/*
 * Local-only student-view renderer for reviewed authoring QA.
 * It consumes only the validated student-safe projection and never renders
 * answers, solutions, rubrics, error mappings, or review evidence.
 */

const fs = require("fs");
const path = require("path");
const authoring = require("./validate-private-grade6-authoring.cjs");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

function localized(valueByLocale, className) {
  const cssClass = className ? ` class="${escapeHtml(className)}"` : "";
  return `<span${cssClass} data-locale="ko">${escapeHtml(valueByLocale.ko)}</span>` +
    `<span${cssClass} data-locale="en" hidden>${escapeHtml(valueByLocale.en)}</span>`;
}

function renderPromptBlock(block, item) {
  if (block.type === "text") return `<p class="prompt-copy">${localized(block.valueByLocale)}</p>`;
  if (block.type === "math") return `<div class="math-block" aria-label="mathematical expression">${escapeHtml(block.latex)}</div>`;
  const asset = item.assets.find(function (candidate) { return candidate.assetId === block.assetId; });
  if (!asset || !asset.previewHref) throw new Error(`Preview asset missing for ${item.slotId}`);
  return `<figure class="diagram"><img src="${escapeHtml(asset.previewHref)}" alt="${escapeHtml(asset.altByLocale.ko)}" data-alt-ko="${escapeHtml(asset.altByLocale.ko)}" data-alt-en="${escapeHtml(asset.altByLocale.en)}"></figure>`;
}

function renderResponse(item, itemNumber) {
  if (item.responseType === "multiple-choice") {
    return `<fieldset class="choices"><legend class="sr-only">${itemNumber}번 선택지</legend>${item.options.map(function (option) {
      return `<label class="choice"><input type="radio" name="item-${itemNumber}" value="${escapeHtml(option.optionId)}"><span class="choice-id">${escapeHtml(option.optionId)}</span><span class="choice-copy">${localized(option.labelByLocale)}</span></label>`;
    }).join("")}</fieldset>`;
  }
  const hints = item.responseUi.inputHintByLocale || {
    ko: item.responseType === "numeric" ? "숫자를 입력하세요" : "풀이와 설명을 입력하세요",
    en: item.responseType === "numeric" ? "Enter a number" : "Enter your work and explanation"
  };
  if (item.responseType === "numeric") {
    return `<label class="written"><span>${localized(hints)}</span><input type="text" inputmode="decimal" autocomplete="off" aria-label="${escapeHtml(hints.ko)}"></label>`;
  }
  const rows = item.responseType === "constructed-response" ? 7 : 4;
  return `<label class="written"><span>${localized(hints)}</span><textarea rows="${rows}" aria-label="${escapeHtml(hints.ko)}"></textarea></label>`;
}

function renderItem(item, index) {
  const number = index + 1;
  return `<article class="item-card" data-item="${number}">
    <header class="item-head">
      <span class="item-number">${String(number).padStart(2, "0")}</span>
      <div><strong>${escapeHtml(item.domainId)}</strong><small>${escapeHtml(item.standardIds.join(" · "))}</small></div>
      <span class="difficulty">${escapeHtml(item.difficulty)}</span>
    </header>
    <div class="prompt">${item.promptBlocks.map(function (block) { return renderPromptBlock(block, item); }).join("")}</div>
    ${renderResponse(item, number)}
  </article>`;
}

function renderPreview(items) {
  if (!Array.isArray(items) || items.length !== 42) throw new Error("Student preview requires exactly 42 validated items");
  const cards = items.map(renderItem).join("\n");
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' file:; img-src 'self' file: data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'">
  <title>GFIELD Grade 6 · Private Student QA</title>
  <style>
    :root{color-scheme:light;--ink:#152238;--muted:#607089;--line:#d8e0ea;--paper:#fff;--wash:#f3f6f9;--navy:#15365f;--blue:#1f6fbb;--gold:#b78020;--radius:18px;font-family:Inter,"Noto Sans KR",Arial,sans-serif}
    *{box-sizing:border-box}body{margin:0;background:var(--wash);color:var(--ink);font-size:16px;line-height:1.55}button,input,textarea{font:inherit}.shell{width:min(920px,calc(100% - 32px));margin:0 auto;padding:28px 0 80px}.topbar{position:sticky;top:0;z-index:10;margin:0 -1px 22px;padding:14px 16px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.96);box-shadow:0 10px 30px rgba(21,54,95,.08);display:flex;align-items:center;gap:14px;justify-content:space-between}.brand strong{display:block;letter-spacing:.03em}.brand small{display:block;color:var(--muted)}.controls{display:flex;gap:8px;align-items:center}.lang-button{min-height:44px;min-width:52px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--navy);font-weight:700}.lang-button[aria-pressed="true"]{background:var(--navy);color:#fff;border-color:var(--navy)}.intro{padding:30px 4px 18px}.eyebrow{margin:0 0 8px;color:var(--blue);font-size:.78rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.intro h1{margin:0;font-family:Georgia,"Noto Serif KR",serif;font-size:clamp(2rem,7vw,4rem);line-height:1.02;letter-spacing:-.045em}.intro p{max-width:680px;color:var(--muted)}.notice{display:inline-flex;align-items:center;min-height:36px;padding:6px 12px;border:1px solid #ead7ac;border-radius:999px;background:#fff9e9;color:#705019;font-size:.84rem;font-weight:700}.item-list{display:grid;gap:18px}.item-card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:clamp(18px,4vw,30px);box-shadow:0 8px 24px rgba(21,34,56,.05)}.item-head{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding-bottom:18px;border-bottom:1px solid var(--line)}.item-number{display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:var(--navy);color:#fff;font-weight:800}.item-head strong,.item-head small{display:block}.item-head small{color:var(--muted);font-size:.78rem}.difficulty{padding:5px 9px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:.72rem;text-transform:uppercase}.prompt{padding:22px 0 8px}.prompt-copy{margin:0 0 14px;font-size:clamp(1.05rem,2.4vw,1.24rem);font-weight:650;white-space:pre-line}.math-block{overflow-x:auto;padding:12px 14px;border-radius:10px;background:#f7f9fb;font-family:"Cambria Math",serif}.diagram{margin:18px auto;max-width:680px}.diagram img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:12px;background:#fff}.choices{display:grid;gap:10px;margin:8px 0 0;padding:0;border:0}.choice{display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:11px;min-height:52px;padding:10px 13px;border:1px solid var(--line);border-radius:12px;background:#fff;cursor:pointer}.choice:has(input:checked){border-color:var(--blue);box-shadow:0 0 0 2px rgba(31,111,187,.14)}.choice input{width:20px;height:20px;margin:0;accent-color:var(--blue)}.choice-id{display:grid;place-items:center;min-width:28px;height:28px;border-radius:8px;background:#edf3f9;color:var(--navy);font-weight:800}.written{display:grid;gap:9px;color:var(--muted);font-size:.86rem}.written input,.written textarea{width:100%;min-height:48px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);resize:vertical}.written textarea{min-height:116px}.written input:focus,.written textarea:focus,.choice:focus-within,.lang-button:focus-visible{outline:3px solid rgba(31,111,187,.3);outline-offset:2px}.footer{margin-top:28px;padding:22px;text-align:center;color:var(--muted);font-size:.84rem}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    @media(max-width:600px){.shell{width:min(100% - 20px,920px);padding-top:10px}.topbar{position:static;top:auto;align-items:flex-start;flex-direction:column}.controls{width:100%}.lang-button{flex:1}.intro{padding-top:18px}.item-card{border-radius:15px}.item-head{grid-template-columns:auto 1fr}.difficulty{grid-column:2;justify-self:start}.choice{grid-template-columns:auto auto minmax(0,1fr)}.choice-copy{min-width:0;overflow-wrap:anywhere}}
    @media print{body{background:#fff}.shell{width:100%;padding:0}.topbar,.notice{display:none}.item-card{break-inside:avoid;box-shadow:none;margin-bottom:14px}.item-list{display:block}}
  </style>
</head>
<body>
  <main class="shell">
    <div class="topbar">
      <div class="brand"><strong>GFIELD · Grade 6 Placement</strong><small>Local student-view quality check</small></div>
      <div class="controls" role="group" aria-label="Language"><button class="lang-button" type="button" data-set-locale="ko" aria-pressed="true">한국어</button><button class="lang-button" type="button" data-set-locale="en" aria-pressed="false">English</button></div>
    </div>
    <section class="intro">
      <p class="eyebrow">Private review · 42 items</p>
      <h1>${localized({ ko: "수학을 어디서부터\n어떻게 높일지 찾습니다.", en: "Find where to begin\nand how to grow." })}</h1>
      <p>${localized({ ko: "이 화면은 실제 학생 보기의 모바일·문구·도형 검수용입니다. 채점과 저장은 꺼져 있습니다.", en: "This local screen checks the mobile layout, wording, and diagrams. Scoring and storage are disabled." })}</p>
      <span class="notice">${localized({ ko: "비공개 검수 화면 · 배포 전", en: "Private QA · Before release" })}</span>
    </section>
    <section class="item-list" aria-label="Grade 6 assessment items">${cards}</section>
    <footer class="footer">GFIELD Boarding School Math · 42 / 42 · local only</footer>
  </main>
  <script>
    (function(){
      const buttons=Array.from(document.querySelectorAll('[data-set-locale]'));
      function setLocale(locale){
        document.documentElement.lang=locale;
        document.querySelectorAll('[data-locale]').forEach(function(node){node.hidden=node.dataset.locale!==locale;});
        document.querySelectorAll('img[data-alt-ko]').forEach(function(node){node.alt=locale==='ko'?node.dataset.altKo:node.dataset.altEn;});
        buttons.forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.setLocale===locale));});
      }
      buttons.forEach(function(button){button.addEventListener('click',function(){setLocale(button.dataset.setLocale);});});
      setLocale('ko');
    })();
  </script>
</body>
</html>`;
}

function main() {
  const sourceDirectory = path.resolve(process.argv[2] || path.join(__dirname, "..", "private-authoring"));
  const outputPath = path.resolve(process.argv[3] || path.join(sourceDirectory, "preview", "student.html"));
  const expectedOutputDirectory = path.join(sourceDirectory, "preview");
  if (path.dirname(outputPath) !== expectedOutputDirectory || path.basename(outputPath) !== "student.html") {
    throw new Error("Private assessment preview output must be private-authoring/preview/student.html");
  }
  const items = authoring.loadStudentPreviewItems(sourceDirectory);
  const outputDirectory = path.dirname(outputPath);
  items.forEach(function (item) {
    item.assets.forEach(function (asset) {
      const fullAssetPath = path.resolve(sourceDirectory, ...asset.previewSourcePath.split("/"));
      asset.previewHref = path.relative(outputDirectory, fullAssetPath).split(path.sep).join("/");
    });
  });
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(outputPath, renderPreview(items), "utf8");
  process.stdout.write(`PRIVATE_GRADE6_STUDENT_PREVIEW_OK items=${items.length} output=${outputPath}\n`);
}

if (require.main === module) main();

module.exports = Object.freeze({ escapeHtml, renderPreview });
