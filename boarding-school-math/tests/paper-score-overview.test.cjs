"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
let browser, server, base;

test.before(async function () {
  const root = path.resolve(__dirname, "..");
  server = http.createServer(function (req, res) {
    const file = path.resolve(root, "." + new URL(req.url, "http://localhost").pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    const ext = path.extname(file);
    res.setHeader("Content-Type", ({ ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp" })[ext] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  base = "http://127.0.0.1:" + server.address().port;
  browser = await chromium.launch({ headless: true, executablePath: process.env.GFIELD_CHROME_EXECUTABLE });
});
test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});


test("published performance bands handle ties, sparse references and scores at both limits", function () {
  const overview = require("../shared/paper-score-overview.js");
  const bands = [{ id: "top1", label: "1%" }, { id: "top5", label: "5%" }, { id: "top50", label: "50%" }];
  const reference = { top1: 120, top5: 100, top50: 50 };
  assert.equal(overview.positionFor(100, 150, reference, bands).reached.id, "top5");
  assert.equal(overview.positionFor(100, 150, reference, bands).next.id, "top1");
  assert.equal(overview.positionFor(0, 150, reference, bands).reached, null);
  assert.equal(overview.positionFor(0, 150, reference, bands).next.id, "top50");
  assert.equal(overview.positionFor(150, 150, reference, bands).next, null);
  assert.equal(overview.positionFor(120, 150, { top1: 100, top5: 100 }, bands).reached.id, "top1");
  assert.equal(overview.positionFor(100, 150, null, bands), null);
  assert.equal(overview.positionFor(100, 150, { top1: NaN, top5: 151 }, bands), null);
  assert.equal(overview.positionFor(-1, 150, reference, bands), null);
  assert.equal(overview.positionFor(151, 150, reference, bands), null);
});

async function mark(page, correct, count) {
  for (let index = 1; index <= count; index += 1) {
    await page.locator('[data-question="' + index + '"][data-field="status"]').selectOption(index <= correct ? "correct" : "wrong");
  }
  await page.locator(".review-form-actions button[type=submit]").click();
}

test("same-paper score, distribution band and AIME cutoff appear together above detailed results", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(base + "/competition-paper-review.html?grade=9&program=amc10&year=2025&form=A");
  await mark(page, 20, 25);
  assert.equal(await page.locator("#paper-score-current").textContent(), "120 / 150");
  assert.match(await page.locator("#paper-score-band").textContent(), /상위 5% 기준점 이상/);
  assert.equal(await page.locator(".paper-score-row.is-current").getAttribute("data-band"), "top5");
  assert.equal(await page.locator(".paper-score-row.is-current").getAttribute("data-threshold"), "112.5");
  assert.equal(await page.locator(".paper-score-row").count(), 7);
  assert.equal(await page.locator("#paper-score-cutoff").textContent(), await page.locator("#amc-aime-cutoff-bands span").textContent());
  assert.equal(await page.locator(".paper-score-fact a").first().getAttribute("href"), await page.locator("#amc-cohort-source").getAttribute("href"));
  assert.ok(await page.locator("#paper-score-overview").evaluate(function (node) {
    return node.compareDocumentPosition(document.getElementById("report-metrics")) & Node.DOCUMENT_POSITION_FOLLOWING;
  }));
  const next = await page.locator(".paper-score-actions a").last().getAttribute("href");
  assert.equal(next, await page.locator("#report-follow-up-link").getAttribute("href"));
  await page.close();
});

test("partial answers and an unsupported year never inherit a previous distribution", async function () {
  const page = await browser.newPage();
  await page.goto(base + "/competition-paper-review.html?grade=7&program=amc10&year=2025&form=A");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.locator(".review-form-actions button[type=submit]").click();
  assert.equal(await page.locator(".paper-score-row").count(), 0);
  assert.match(await page.locator("#paper-score-band").textContent(), /답안 입력 후 비교/);
  await page.locator("#archive-year").selectOption("2000", { force: true });
  assert.equal(await page.locator(".review-report").isVisible(), false);
  await mark(page, 25, 25);
  assert.equal(await page.locator(".paper-score-row").count(), 0);
  assert.match(await page.locator("#paper-score-band").textContent(), /이 회차의 전체 응시자 기준점 자료가 아직 없어요/);
  assert.equal(await page.locator(".paper-score-fact a").count(), 0);
  await page.close();
});

test("AIME uses its own original-paper score scale and published cohort", async function () {
  const page = await browser.newPage();
  await page.goto(base + "/competition-paper-review.html?grade=8&program=aime&year=2025&form=I");
  await mark(page, 10, 15);
  assert.equal(await page.locator("#paper-score-current").textContent(), "10 / 15");
  assert.equal(await page.locator(".paper-score-row.is-current").getAttribute("data-band"), "top10");
  assert.equal(await page.locator(".paper-score-row.is-current").getAttribute("data-threshold"), "10");
  assert.equal(await page.locator("#paper-score-cutoff").count(), 0);
  assert.match(await page.locator(".paper-score-paper").textContent(), /2025 AIME I/);
  await page.close();
});

test("the diagnostic overview switches language and fits phone, tablet and desktop widths", async function () {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(base + "/competition-paper-review.html?grade=9&program=amc10&year=2025&form=A");
  await mark(page, 20, 25);
  for (const locale of ["en", "zh-Hans", "ko"]) {
    await page.locator("[data-boarding-content-locale]").selectOption(locale);
    await page.evaluate(function () { GFIELDContentI18n.refresh(); });
    assert.equal(await page.locator("#paper-score-current").textContent(), "120 / 150");
    assert.equal(await page.locator(".paper-score-row.is-current").getAttribute("data-band"), "top5");
    if (locale !== "ko") assert.doesNotMatch(await page.locator("#paper-score-overview").textContent(), /[가-힣]/);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width: width, height: 900 });
      assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= innerWidth; }), true, locale + " at " + width);
    }
  }
  assert.deepEqual(errors, []);
  await page.close();
});

test("same-grade comparison keeps the matched chart population and source detail route", async function () {
  const page = await browser.newPage();
  await page.goto(base + "/competition-paper-review.html?grade=7&program=amc10&year=2020&form=A");
  await mark(page, 20, 25);
  const row = page.locator('.paper-score-grade-row:has(a[href="#amc-grade-percentile-reference"])');
  assert.equal(await row.count(), 1);
  assert.equal(await row.locator("p").textContent(), await page.locator("#amc-grade-percentile-position").textContent());
  assert.equal(await row.locator("small").textContent(), await page.locator("#amc-grade-percentile-summary").textContent());
  assert.match(await row.textContent(), /Grade 7 · 2020 AMC 10 A · 차트 학년 표본 n=2,070/);
  for (const locale of ["en", "zh-Hans"]) {
    await page.locator("[data-boarding-content-locale]").selectOption(locale);
    await page.evaluate(function () { GFIELDContentI18n.refresh(); });
    assert.doesNotMatch(await page.locator("#paper-score-overview").textContent(), /[가-힣]/);
  }
  await page.close();
});

test("historical AMC8 keeps its complete score-frequency reference when percentile cutoffs are absent", async function () {
  const page = await browser.newPage();
  await page.goto(base + "/competition-paper-review.html?grade=7&program=amc8&year=2005");
  await mark(page, 20, 25);
  assert.equal(await page.locator("#amc8-overall-cohort-reference").isVisible(), true);
  assert.equal(await page.locator("#paper-score-band").textContent(), await page.locator("#amc8-overall-cohort-result").textContent());
  assert.equal(await page.locator('.paper-score-fact a[href="#amc8-overall-cohort-reference"]').count(), 1);
  assert.equal(await page.locator(".paper-score-row").count(), 0);
  assert.doesNotMatch(await page.locator("#paper-score-band").textContent(), /아직 없어요/);
  await page.close();
});


test("grading in English keeps copied comparison headings translatable back into Korean", async function () {
  const page = await browser.newPage();
  await page.goto(base + "/competition-paper-review.html?grade=7&program=amc8&year=2022&locale=en");
  await mark(page, 20, 25);
  await page.locator("[data-boarding-content-locale]").selectOption("ko");
  await page.evaluate(function () { GFIELDContentI18n.refresh(); });
  const row = page.locator('.paper-score-grade-row:has(a[href="#amc-grade-reference"])');
  assert.equal(await row.locator("a").textContent(), await page.locator("#amc-grade-reference-title").textContent());
  assert.match(await row.locator("a").textContent(), /학년별 평균/);
  assert.match(await page.locator("#paper-score-overview").textContent(), /점수 분포와 등급 구간/);
  await page.close();
});

test("all score intervals expose exact lower/upper boundaries including ties and the maximum", async function () {
  const page = await browser.newPage();
  await page.goto(base + "/competition-paper-review.html?grade=9&program=amc10&year=2025&form=A");
  await mark(page,20,25);
  assert.equal(await page.locator("#paper-score-bounds").textContent(),"112.5점 이상 · 124.5점 미만");
  await page.locator(".paper-score-intervals summary").click();
  assert.equal(await page.locator(".paper-score-intervals tbody tr").count(),8);
  assert.deepEqual(await page.locator('.paper-score-intervals tr.is-current td').allTextContents(),["112.5점","124.5점 미만"]);
  await page.goto(base + "/competition-paper-review.html?grade=8&program=aime&year=2025&form=II");
  await mark(page,12,15);
  await page.locator(".paper-score-intervals summary").click();
  assert.equal(await page.locator("#paper-score-bounds").textContent(),"12점 이상 · 13점 미만");
  assert.equal(await page.locator('.paper-score-intervals tr[data-range="top5"]').count(),0,"equal-score cutoffs share one nonempty interval");
  await page.close();
});

test("three actual saved original-paper results produce a range and persist without individual answers", async function () {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const page = await context.newPage();
  await page.clock.install({time:new Date("2026-11-15T03:00:00Z")});
  const errors=[];page.on("pageerror", error=>errors.push(error.message));
  for (const [year,correct,date] of [[2023,15,"2026-11-01"],[2024,20,"2026-11-02"],[2025,18,"2026-11-03"]]) {
    await page.goto(base + `/competition-paper-review.html?grade=9&program=amc10&year=${year}&form=A`);
    await openReviewOptions(page);await page.locator("#review-exam-date").fill(date);
    await mark(page,correct,25);
    await page.locator("#save-diagnostic").click();
    assert.equal(await page.locator("#save-diagnostic").isDisabled(),true);
  }
  assert.equal(await page.locator("#paper-score-forecast-value").textContent(),"90–120 / 150점");
  const saved = await page.evaluate(()=>GFIELDLocalLearningRecord.storage.loadCompetitionDiagnosticHistory(9,"amc10"));
  assert.equal(saved.length,3);
  assert.deepEqual(saved.map(x=>x.paper.points).sort((a,b)=>a-b),[90,108,120]);
  assert.equal(saved.every(x=>!("responses" in x) && !("answers" in x)),true);
  // Earlier saved summaries have no structured paper metadata; exact original labels remain usable.
  await page.evaluate(()=>{
    const key="gmap-local-learning-record-v1:competition-diagnostic-history-v1";
    const archive=JSON.parse(localStorage.getItem(key));
    archive.records.forEach(record=>delete record.paper);
    localStorage.setItem(key,JSON.stringify(archive));
  });
  await page.reload();
  await mark(page,18,25);
  assert.equal(await page.locator("#paper-score-forecast-value").textContent(),"90–120 / 150점");
  // A later perfect repeat of the same paper cannot become a fourth paper or inflate the range.
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-11-10");
  await mark(page,25,25);
  await page.locator("#save-diagnostic").click();
  assert.equal(await page.locator("#paper-score-forecast-value").textContent(),"90–120 / 150점");
  await page.locator("#paper-score-forecast details summary").click();
  assert.equal(await page.locator("#paper-score-forecast li").count(),3);
  await page.locator(".paper-score-intervals summary").click();
  for(const locale of ["en","zh-Hans","ko"]){
    await page.locator("[data-boarding-content-locale]").selectOption(locale);
    await page.evaluate(()=>GFIELDContentI18n.refresh());
    assert.match(await page.locator("#paper-score-forecast-value").textContent(),/90–120/);
    if(locale!=="ko")assert.doesNotMatch(await page.locator("#paper-score-overview").textContent(),/[가-힣]/);
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,locale+" "+width);
    }
  }
  // Deleting a contributing result updates the range immediately.
  await page.locator('[data-remove-diagnostic="'+saved.find(x=>x.paper.year===2023).id+'"]').click();
  assert.match(await page.locator("#paper-score-forecast-value").textContent(),/3회가 필요/);
  await openReviewOptions(page);await page.locator("#review-grade").selectOption("8");
  await mark(page,25,25);
  assert.match(await page.locator("#paper-score-forecast-value").textContent(),/3회가 필요/);
  assert.deepEqual(errors,[]);
  await context.close();
});

test("recovered fall reports show score intervals and retain their source notes in all languages", async function () {
  const page=await browser.newPage();
  for(const [program,form,grade,lower,upper] of [["amc10","C",9,75,100.5],["amc12","D",10,69,103.5]]){
    await page.goto(base+`/competition-paper-review.html?grade=${grade}&program=${program}&year=2021&form=${form}&locale=ko`);
    await mark(page,15,25);
    assert.equal(await page.locator("#paper-score-bounds").textContent(),`${lower}점 이상 · ${upper}점 미만`);
    assert.match(await page.locator("#amc-cohort-stats").textContent(),/표준편차/);
    for(const locale of ["en","zh-Hans"]){
      await page.locator("[data-boarding-content-locale]").selectOption(locale);
      await page.evaluate(()=>GFIELDContentI18n.refresh());
      assert.doesNotMatch(await page.locator("#amc-cohort-source-note").textContent(),/[가-힣]/);
      assert.doesNotMatch(await page.locator("#paper-score-overview").textContent(),/[가-힣]/);
    }
  }
  await page.close();
});

test("an early paper without verified scoring does not ask for records to create an impossible forecast",async function(){
 const page=await browser.newPage();
 await page.goto(base+"/competition-paper-review.html?grade=10&program=amc12&year=1950");
 await mark(page,30,50);
 assert.match(await page.locator("#paper-score-current").textContent(),/정답 30 \/ 50/);
 assert.equal(await page.locator("#paper-score-forecast").count(),0);
 assert.equal(await page.locator("#paper-score-bounds").count(),0);
 await page.close();
});

test("each saved paper retains its profile and as-of forecast while cumulative weak concepts link to practice",async function(){
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 await page.clock.install({time:new Date("2026-11-16T03:00:00Z")});const errors=[];page.on("pageerror",error=>errors.push(error.message));
 for(const [year,date] of [[2023,"2026-11-01"],[2024,"2026-11-02"],[2025,"2026-11-03"]]){
  await page.goto(base+`/competition-paper-review.html?grade=9&program=amc10&year=${year}&form=A&locale=ko`);
  await openReviewOptions(page);await page.locator("#review-exam-date").fill(date);
  for(let q=1;q<=25;q++){
   await page.locator(`[data-question="${q}"][data-field="status"]`).selectOption("wrong");
   await page.locator(`[data-question="${q}"][data-field="domain"]`).selectOption(q<=5?"algebra":q<=10?"geometry":"unclassified");
   if(q<=5)await page.locator(`[data-question="${q}"][data-field="status"]`).selectOption("correct");
  }
  await page.locator('[data-question="6"][data-field="reason"]').selectOption("reading");
  await page.locator('.review-form-actions button[type=submit]').click();
  assert.match(await page.locator('#current-paper-learning-profile .paper-strengths').textContent(),/식과 대수 관계/);
  assert.match(await page.locator('#current-paper-learning-profile .paper-review-areas').textContent(),/기하 도형과 측정/);
  await page.locator('#save-diagnostic').click();
 }
 const group=page.locator('.paper-cumulative-group[data-grade="9"][data-program="amc10"]');
 assert.match(await group.locator(':scope > summary').textContent(),/누적 3회/);
 assert.equal(await page.locator('.saved-paper-learning-profile').count(),3);
 assert.equal(await page.locator('.saved-paper-learning-profile .paper-strengths [data-domain="algebra"]').count(),3);
 assert.equal(await page.locator('.saved-paper-learning-profile .paper-review-areas [data-domain="geometry"]').count(),3);
 const recurring=group.locator('.paper-recurring-concepts [data-concept="modular-arithmetic"]');
 assert.equal(await recurring.count(),1,JSON.stringify(await page.evaluate(()=>GFIELDLocalLearningRecord.storage.loadCompetitionDiagnosticHistory(9,"amc10").map(r=>({paper:r.paper,concepts:r.concepts})))));assert.match(await recurring.textContent(),/2회/);
 const href=await recurring.locator('a').getAttribute('href');assert.match(href,/amc10-practice.html/);assert.match(href,/sourceConcepts=modular-arithmetic/);
 await group.locator('.paper-profile-timeline summary').click();
 const timeline=group.locator('.paper-profile-timeline li');assert.equal(await timeline.count(),3);
 assert.match(await timeline.nth(0).textContent(),/3회가 필요/);assert.match(await timeline.nth(2).textContent(),/30–30/);
 // Add a later result: earlier expected ranges must not change with later knowledge.
 await page.goto(base+'/competition-paper-review.html?grade=9&program=amc10&year=2026&form=A&locale=ko');
 await openReviewOptions(page);await page.locator('#review-exam-date').fill('2026-11-13');await mark(page,25,25);await page.locator('#save-diagnostic').click();
 await group.locator('.paper-profile-timeline summary').click();
 assert.match(await group.locator('.paper-profile-timeline li').nth(2).textContent(),/30–30/);
 assert.match(await group.locator('.paper-profile-timeline li').nth(3).textContent(),/30–150/);
 if(!await recurring.locator('a').first().isVisible())await group.locator('.paper-recurring-concepts > details > summary').click();
 await recurring.locator('a').first().click();assert.match(page.url(),/amc10-practice.html/);assert.ok(await page.locator('.problem-card').count()>0);
 await page.goBack();
 for(const locale of ['en','zh-Hans','ko']){
  await page.locator('[data-boarding-content-locale]').selectOption(locale);await page.evaluate(()=>GFIELDContentI18n.refresh());
  if(locale!=='ko'){
   assert.doesNotMatch(await page.locator('#paper-learning-accumulated').textContent(),/[가-힣]/);
   assert.doesNotMatch(await page.locator('.saved-paper-learning-profile').first().textContent(),/[가-힣]/);
  }
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,locale+' '+width);}
 }
 const data=await page.evaluate(()=>GFIELDLocalLearningRecord.storage.loadCompetitionDiagnosticHistory(9,'amc10'));
 assert.ok(data.every(x=>Array.isArray(x.concepts)&&x.concepts.length>0));
 assert.doesNotMatch(JSON.stringify(data),/"answer"|"responses"|"questionNumber"/);
 const contributing=data.find(x=>x.paper.year===2024);await page.locator(`[data-remove-diagnostic="${contributing.id}"]`).click();
 assert.equal(await recurring.count(),0);assert.match(await group.locator(':scope > summary').textContent(),/누적 3회/);
 assert.deepEqual(errors,[]);await context.close();
});

test("blanks count in per-paper and saved strength profiles rather than turning three correct answers into a false strength",async function(){
 const page=await browser.newPage();
 await page.goto(base+'/competition-paper-review.html?grade=9&program=amc10&year=2025&form=A&locale=ko');
 await openReviewOptions(page);await page.locator('#review-exam-date').fill('2026-11-15');
 for(let q=1;q<=10;q++){
  await page.locator(`[data-question="${q}"][data-field="status"]`).selectOption(q<=3?'wrong':'blank');
  await page.locator(`[data-question="${q}"][data-field="domain"]`).selectOption('algebra');
  if(q<=3)await page.locator(`[data-question="${q}"][data-field="status"]`).selectOption('correct');
 }
 await page.locator('.review-form-actions button[type=submit]').click();
 assert.equal(await page.locator('#current-paper-learning-profile .paper-strengths [data-domain="algebra"]').count(),0);
 assert.match(await page.locator('#current-paper-learning-profile .paper-review-areas').textContent(),/3\/10 · 30%/);
 await page.locator('#save-diagnostic').click();
 assert.match(await page.locator('.saved-diagnostic-entry-domains > div').first().textContent(),/3\/10 · 30%/);
 assert.equal(await page.locator('.paper-cumulative-group').count(),0,'partial papers remain per-paper evidence rather than entering completed-paper totals');
 await page.close();
});

test("canonical original years remain visible after memo edits, partial saves and same-day attempts",async function(){
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 await page.clock.install({time:new Date('2026-11-17T03:00:00Z')});
 for(const year of [2025,2024]){
  await page.goto(base+`/competition-paper-review.html?grade=9&program=amc10&year=${year}&form=A&locale=ko`);
  await openReviewOptions(page);await page.locator('#review-paper-label').fill('가을 복습');await openReviewOptions(page);await page.locator('#review-exam-date').fill('2026-11-16');
  await page.locator('[data-question="1"][data-field="status"]').selectOption('correct');await page.locator('.review-form-actions button[type=submit]').click();
  assert.match(await page.locator('.paper-score-paper').textContent(),new RegExp(`${year} AMC 10 A`));
  assert.equal(await page.locator('.paper-score-attempt-date').textContent(),'응시 날짜 · 2026-11-16');
  await page.locator('#save-diagnostic').click();
 }
 assert.equal(await page.locator('.saved-diagnostic-entry').count(),2);
 assert.deepEqual((await page.locator('.saved-diagnostic-entry-heading h3').allTextContents()).sort(),['2024 AMC 10 A · Grade 9','2025 AMC 10 A · Grade 9']);
 await openReviewOptions(page);await page.locator('#review-paper-label').fill('다른 메모');await page.locator('.review-form-actions button[type=submit]').click();await page.locator('#save-diagnostic').click();
 assert.equal(await page.locator('.saved-diagnostic-entry').count(),2);
 await page.reload();
 assert.deepEqual((await page.locator('.saved-diagnostic-entry-heading h3').allTextContents()).sort(),['2024 AMC 10 A · Grade 9','2025 AMC 10 A · Grade 9']);
 assert.equal(await page.locator('.saved-diagnostic-entry-heading time').first().getAttribute('datetime'),'2026-11-16');
 // The actual 2021 fall form is independent of a misleading note and a 2026 practice date.
 await page.goto(base+'/competition-paper-review.html?grade=9&program=amc10&year=2021&form=C&locale=ko');
 await openReviewOptions(page);await page.locator('#review-paper-label').fill('2025 AMC 10 B');await openReviewOptions(page);await page.locator('#review-exam-date').fill('2026-11-16');
 await mark(page,25,25);await page.locator('#save-diagnostic').click();
 const card=page.locator('.saved-diagnostic-entry').filter({has:page.locator('.saved-diagnostic-entry-heading h3', {hasText:'2021 AMC 10 A'})});
 assert.equal(await card.count(),1);assert.match(await card.locator('h3').textContent(),/2021 AMC 10 A · 가을/);
 assert.match(await card.locator('h3').textContent(),/Grade 9/);assert.match(await card.textContent(),/메모 · 2025 AMC 10 B/);
 assert.match(await card.locator('time').textContent(),/응시 날짜 · 2026-11-16/);
 for(const locale of ['en','zh-Hans','ko']){
  await page.locator('[data-boarding-content-locale]').selectOption(locale);await page.evaluate(()=>GFIELDContentI18n.refresh());
  assert.match(await card.locator('h3').textContent(),/2021 AMC 10 A/);
  assert.deepEqual((await page.locator('[data-paper-memo]').allTextContents()).sort(), ['2025 AMC 10 B','가을 복습','다른 메모'].sort());
  if(locale!=='ko')assert.doesNotMatch(await card.locator('.saved-diagnostic-entry-heading').textContent(),/[가-힣]/);
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,locale+' '+width);}
 }
 const records=await page.evaluate(()=>GFIELDLocalLearningRecord.storage.loadCompetitionDiagnosticHistory(9,'amc10'));
 assert.equal(records.length,3);assert.deepEqual(records.find(r=>r.paper.year===2024).paper,{year:2024,form:'A'});
 assert.equal(records.find(r=>r.paper.year===2021).paper.form,'C');
 await context.close();
});

async function openReviewOptions(page) {
 if (await page.locator("#review-extra-options").getAttribute("open") === null) await page.locator("#review-extra-options > summary").click();
}
