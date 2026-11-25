const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
let server;
let browser;
let url;

test.before(async function () {
  server = http.createServer(function (request, response) {
    const requestPath = new URL(request.url, "http://127.0.0.1").pathname;
    const relative = requestPath === "/boarding-school-math/" ? "/boarding-school-math/index.html" : requestPath;
    const target = path.resolve(repoRoot, `.${relative}`);
    if (!target.startsWith(repoRoot) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    const extension = path.extname(target);
    const type = extension === ".html" ? "text/html" : extension === ".css" ? "text/css" : "text/javascript";
    response.writeHead(200, { "content-type": `${type}; charset=utf-8` });
    fs.createReadStream(target).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  await browser.close();
  await new Promise(function (resolve) { server.close(resolve); });
});

test("learning directory has connected landmarks, headings, and tab panels", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });

  const audit = await page.evaluate(function () {
    const ids = Array.from(document.querySelectorAll("[id]")).map(function (node) { return node.id; });
    const duplicates = ids.filter(function (id, index) { return ids.indexOf(id) !== index; });
    const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map(function (heading) {
      return { level: Number(heading.tagName.slice(1)), text: heading.textContent.trim() };
    });
    const jumps = headings.filter(function (heading, index) {
      return index > 0 && heading.level > headings[index - 1].level + 1;
    });
    const disconnectedTabs = Array.from(document.querySelectorAll('[role="tab"]')).filter(function (tab) {
      const controls = tab.getAttribute("aria-controls");
      return !tab.id || !controls || !document.getElementById(controls);
    }).map(function (tab) { return tab.id || tab.textContent.trim(); });
    return { duplicates, headings, jumps, disconnectedTabs };
  });

  assert.deepEqual(audit.duplicates, []);
  assert.ok(audit.headings.length > 8);
  assert.equal(audit.headings.filter(function (heading) { return heading.level === 1; }).length, 1);
  assert.equal(audit.headings.some(function (heading) { return !heading.text; }), false);
  assert.deepEqual(audit.jumps, []);
  assert.deepEqual(audit.disconnectedTabs, []);
  await page.close();
});

test("skip link and every tab set work from the keyboard", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });

  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").getAttribute("href"), "#main");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(function () { return location.hash; }), "#main");
  assert.equal(await page.locator(":focus").getAttribute("id"), "main");

  await page.locator(".advanced-home-tools summary").click();
  await page.locator('[data-role-preview="student"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-role-preview="teacher"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator(":focus").getAttribute("data-role-preview"), "teacher");

  await page.locator('[data-grade-tab="6"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-grade-tab="7"]').getAttribute("aria-selected"), "true");
  await page.keyboard.press("End");
  assert.equal(await page.locator('[data-grade-tab="8"]').getAttribute("aria-selected"), "true");

  await page.locator('[data-map-view="grade"]').focus();
  await page.keyboard.press("Home");
  assert.equal(await page.locator('[data-map-view="grade"]').getAttribute("aria-selected"), "true");
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-map-view="domain"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("#domain-directory").isVisible(), true);
  await page.close();
});

test("official source links are external, isolated, and never embedded", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator('[data-goal="sasmo"]').click();
  assert.match(await page.locator("#goal-primary").getAttribute("href"), /^\.\/sasmo-real-paper\.html\?audience=(student|teacher)$/);
  assert.match(await page.locator("#goal-status-note").innerText(), /2019 Grade 6 원본 25문항/);
  const original = page.locator("#goal-original");
  assert.equal(await original.getAttribute("target"), "_blank");
  const rel = await original.getAttribute("rel");
  assert.match(rel, /noopener/);
  assert.match(rel, /noreferrer/);
  assert.equal(await page.locator("iframe, embed, object").count(), 0);
  assert.equal(await page.locator('a[href$=".pdf"]').count(), 0);
  await page.locator('[data-goal="kangaroo"]').click();
  assert.match(await page.locator("#goal-primary").getAttribute("href"), /program=kangaroo/);
  await page.locator('[data-goal="amc"]').click();
  assert.match(await page.locator("#goal-primary").getAttribute("href"), /program=amc8/);
  assert.match(await page.locator("#goal-eligibility").innerText(), /공식 G8 이하.*연령 기준은 현재 MAA 안내 확인/);
  await page.close();
});

test("first-screen programmes are six distinct, directly connected study routes", async function () {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(url,{waitUntil:"networkidle"});
 const entries=page.locator('[data-program-entry]');assert.equal(await entries.count(),6);
 assert.deepEqual(await entries.locator('h2').allTextContents(),['U.S. Math Curriculum','AMC','AIME','SASMO','Math Kangaroo','보딩 로드맵']);
 assert.ok(await page.locator('.program-entry').evaluate(el=>el.compareDocumentPosition(document.querySelector('.directory-intro'))&Node.DOCUMENT_POSITION_FOLLOWING));
 const expected=[['curriculum','us-math.html',null],['amc','competition-paper-review.html','amc8'],['aime','competition-paper-review.html','aime'],['sasmo','sasmo.html',null],['kangaroo','competition-practice.html','kangaroo'],['boarding','boarding-roadmap.html',null]];
 for(const [id,file,program] of expected){const href=await page.locator('[data-program-entry="'+id+'"]').getAttribute('href'),target=new URL(href,url);assert.ok(target.pathname.endsWith(file));assert.equal(target.searchParams.get('locale'),'ko');if(program)assert.equal(target.searchParams.get('program'),program);if(id==='boarding')assert.equal(target.hash,'#grade-map');const response=await page.request.get(target.href);assert.equal(response.status(),200,id);}
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'width '+width);for(const entry of await entries.all()){const rect=await entry.boundingBox();assert.ok(rect.height>=44);}}
 await page.locator('[data-program-entry="aime"]').click();await page.waitForFunction(()=>document.querySelector('#review-program')?.value==='aime');assert.equal(await page.locator('#review-program').inputValue(),'aime');await page.goBack();await page.locator('[data-program-entry="boarding"]').click();assert.equal(new URL(page.url()).hash,'#grade-map');
 await page.close();
});
