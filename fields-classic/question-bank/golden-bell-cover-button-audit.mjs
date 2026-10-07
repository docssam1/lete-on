// 표지 선택 버튼 회귀 검사 (PR #281 지적 · 2026-10-04 수정)
//
// 버그: renderSummary가 updateCoverButton()을 먼저 부르고 printBookButton의 disabled를 열네 줄
// 뒤에 갱신하는데, updateCoverButton이 그 버튼의 값을 DOM에서 읽었다. 그래서 준비 중인 교재에서
// 내용 있는 교재로 탭을 옮기면 이전 교재의 꺼진 값이 읽혀 표지 버튼만 꺼진 채 남았다.
// 바로잡히는 시점이 ensureProtectedBook의 응답에 달려 있어, 답안 서비스가 늦으면 계속 꺼져 있었다.
//
// 이 검사를 처음 썼을 때는 버그를 못 잡았다. 세션 토큰이 없으면 ensureFieldsSession이 네트워크도
// 타지 않고 즉시 실패해서 두 번째 render가 곧바로 돌아 버튼이 저절로 고쳐지기 때문이다.
// 그래서 토큰을 심어 답안 요청까지 가게 한 뒤 그 응답을 늦춘다. 수정 전 코드에서 4건 실패를
// 확인하고 수정 후 통과를 확인했다.
//
// 실행: 저장소 루트에서 정적 서버를 띄운 뒤
//   python3 -m http.server 8797
//   node fields-classic/question-bank/golden-bell-cover-button-audit.mjs
// 브라우저 경로는 FIELDS_CHROMIUM 으로 바꿀 수 있다.

import { chromium } from 'playwright-core';

const BASE = process.env.FIELDS_BASE_URL || 'http://127.0.0.1:8797';
const browser = await chromium.launch({ executablePath: process.env.FIELDS_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let fail = 0;
const check = (ok, msg, extra) => { if (!ok) { fail++; console.log('FAIL', msg, extra ?? ''); } };

for (const [course, pending, populated] of [
  ['course-02', 'course-02-a5', 'course-02-a1'],
  ['course-03', 'course-03-a4', 'course-03-a1'],
]) {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    // 답안 서비스는 이 검사의 대상이 아니다. 느린 응답을 흉내 내려고 일부러 늦게 돌려준다 —
    // 표지 버튼이 그 응답을 기다리지 않아야 한다는 것이 이번 수정의 핵심이다.
    await page.route('**/functions/v1/fields-auth', (r) => r.fulfill({ contentType: 'application/json', body: '{}' }));
    await page.route('**/functions/v1/golden-bell-answers', async (r) => {
      await new Promise((res) => setTimeout(res, 4000));
      await r.fulfill({ contentType: 'application/json', body: JSON.stringify({ answers: {} }) });
    });
    // 세션 토큰이 없으면 ensureFieldsSession이 네트워크도 타지 않고 즉시 실패해, 두 번째 render가
    // 곧바로 돌면서 버튼이 저절로 고쳐진다 — 그러면 버그가 재현되지 않는다. 실제 학생은 로그인한
    // 상태이므로 토큰을 심어 답안 요청까지 가게 한 뒤, 그 응답을 늦춘다.
    await page.addInitScript(() => {
      sessionStorage.setItem('gfield_fields_session', 'cover-btn-test');
      window.print = () => {};
    });

    // 준비 중인 교재로 먼저 들어간다(여기서 표지 버튼은 꺼져 있는 게 맞다).
    await page.goto(`${BASE}/fields-classic/question-bank/golden-bell.html?student=QA&book=${pending}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#printCoverButton');
    await page.waitForTimeout(400);
    const atPending = await page.evaluate(() => ({
      cover: document.getElementById('printCoverButton').disabled,
      book: document.getElementById('printBookButton').disabled,
    }));
    check(atPending.cover === true, `${course}/${width} 준비 중 교재에서는 표지 버튼이 꺼져 있어야 한다`, atPending);

    // 같은 코스의 내용 있는 교재로 탭 이동.
    const tab = page.locator(`#bookTabs button[data-book="${populated}"]`);
    check(await tab.count() > 0, `${course}/${width} 탭을 찾지 못함: ${populated}`);
    if (await tab.count() > 0) {
      await tab.click();
      await page.waitForTimeout(500);   // 답안 응답(4초)보다 한참 전이다 — 두 번째 render는 아직 안 돈다
      const after = await page.evaluate(() => ({
        cover: document.getElementById('printCoverButton').disabled,
        book: document.getElementById('printBookButton').disabled,
        mode: document.getElementById('coursePrintMode').value,
      }));
      check(after.book === false, `${course}/${width} 책 전체 인쇄 버튼이 켜져야 한다`, after);
      check(after.cover === false, `${course}/${width} 표지 버튼이 켜져야 한다 (답안 응답을 기다리지 않고)`, after);
    }
    check(errors.length === 0, `${course}/${width} 페이지 에러`, errors.join(' | '));
    await page.close();
  }
}

// 답안만 인쇄 모드에서는 표지가 없어야 한다 — 이번 수정이 이 규칙을 깨지 않았는지.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.route('**/functions/v1/**', (r) => r.fulfill({ contentType: 'application/json', body: '{}' }));
  await page.goto(`${BASE}/fields-classic/question-bank/golden-bell.html?student=QA&book=course-02-a1`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#printCoverButton');
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => document.getElementById('printCoverButton').disabled);
  check(before === false, '내용 있는 교재 · 학습지 모드에서 표지 버튼이 켜져야 한다', before);
  await page.selectOption('#coursePrintMode', 'answers');
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => ({
    disabled: document.getElementById('printCoverButton').disabled,
    text: document.getElementById('printCoverButton').textContent,
  }));
  check(r.disabled === true, '답안만 인쇄에서는 표지 버튼이 꺼져야 한다', r);
  check(/없음/.test(r.text), '답안만 인쇄에서는 표지 라벨이 "없음"이어야 한다', r);
  await page.close();
}

await browser.close();
console.log(fail === 0 ? 'OK — 표지 버튼 검사 전부 통과' : `실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
