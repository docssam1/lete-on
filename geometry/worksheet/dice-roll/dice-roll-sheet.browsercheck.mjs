import { strict as assert } from "node:assert";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl=(process.env.GFIELD_BASE_URL||"http://127.0.0.1:8765").replace(/\/$/,"");
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];
page.on("console",(message)=>{if(message.type()==="error")errors.push(message.text());});page.on("pageerror",(error)=>errors.push(error.message));
await page.goto(`${baseUrl}/geometry/worksheet/dice-roll/`,{waitUntil:"networkidle"});
assert.equal(await page.locator(".problem").count(),2);
assert.equal(await page.locator(".route-board .board-die").count(),2);
assert.equal(await page.locator(".route-board .board-die").first().locator("polygon").count(),3);
for(const level of [1,2,3,4,5]){await page.locator("#levelSelect").selectOption(String(level));assert.equal(await page.locator(".problem").count(),2);assert.ok(await page.locator(".route-board").count()>=2);}
await page.locator("#levelSelect").selectOption("3");
assert.match(await page.locator(".problem").first().locator("header span").textContent(),/4번 위치에서 시계 반대 방향으로 3번/);
assert.equal(await page.locator(".problem").first().locator(".flat-five-svg.blank").count(),3);
assert.equal(await page.locator(".problem").first().locator(".flat-five-svg.blank").first().locator("polygon").count(),5);
await page.locator("#answerToggle").check();
assert.equal(await page.locator(".problem").first().locator(".flat-five-svg.blank").count(),0);
await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-dice-roll-worksheet.png",fullPage:true});
await page.emulateMedia({media:"print"});
const sheet=await page.locator(".sheet").evaluate((node)=>{const box=node.getBoundingClientRect();return{width:box.width,height:box.height,scrollHeight:node.scrollHeight};});
assert.ok(sheet.height<=1124,JSON.stringify(sheet));
await page.pdf({path:"C:/Users/user/AppData/Local/Temp/gfield-dice-roll-worksheet.pdf",format:"A4",printBackground:true,preferCSSPageSize:true});
await page.emulateMedia({media:"screen"});await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:"networkidle"});
const mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));assert.ok(mobile.scrollWidth<=mobile.width+1,JSON.stringify(mobile));
await page.goto(`${baseUrl}/geometry/games/dice-roll/`,{waitUntil:"networkidle"});assert.equal(await page.locator('a[href="../../worksheet/dice-roll/"]').count(),1);
assert.equal(errors.length,0,errors.join("\n"));console.log(JSON.stringify({baseUrl,problems:2,sourceRoute:"4-7-8-5",sheet,mobile},null,2));await browser.close();
