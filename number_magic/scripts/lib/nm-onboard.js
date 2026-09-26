/* 스모크 공용 — 새 프로필 온보딩을 실제 클릭으로 통과한다 (2026-09-26)
   온보딩은 이제 3단계다(app/main.js screenWelcome):
     ① 나 고르기(.nm-av-card → #obAvNext)  ② 학년(.nm-ob-grade[data-g] → #obGrNext, 또는 #obGrSkip)
     ③ 숫자 친구 + 이름(#obName → #obGo) → "짠!" 연출(약 1.9초) → S.onboarded=true 로 저장
   예전 스모크는 ③만 있던 시절 것이라 #obName 을 바로 기다리다 시간 초과로 죽었다.

   이름 확인은 실제 Supabase(nm_profiles)에 GET/POST 한다. 검사가 운영 DB 에 가짜 프로필을
   "클레임"하거나, 같은 이름이 이미 있어 "이어하기" 화면으로 빠지면 안 되므로 그 요청만
   끊는다 — 앱은 오프라인 분기(로컬 전용 진행)로 똑같이 온보딩을 마친다.

   onboard(page, { name, grade }) — grade 를 주면 그 학년 버튼을, 안 주면 "나중에 할래요".
   반환: { name, avatar, view } (저장된 프로필에서 읽은 값). 못 마치면 throw. */
'use strict';

async function blockProfileCloud(ctxOrPage){
  await ctxOrPage.route(/\/rest\/v1\/nm_profiles/, r => r.abort());
}

async function onboard(page, opts){
  const o = Object.assign({ name: '검사', grade: null, avatar: 0, timeout: 20000 }, opts || {});
  await blockProfileCloud(page);
  /* ① 나 고르기 */
  await page.waitForSelector('.nm-av-card', { timeout: o.timeout });
  await page.locator('.nm-av-card').nth(o.avatar).click();
  await page.locator('#obAvNext:not([disabled])').click();
  /* ② 학년 */
  await page.waitForSelector('#obGrSkip', { timeout: o.timeout });
  if (o.grade != null){
    await page.locator(`.nm-ob-grade[data-g="${o.grade}"]`).click();
    await page.locator('#obGrNext:not([disabled])').click();
  } else {
    await page.click('#obGrSkip');
  }
  /* ③ 이름 */
  await page.waitForSelector('#obName', { timeout: o.timeout });
  await page.fill('#obName', o.name);
  await page.click('#obGo');
  /* 연출이 끝나고 onboarded 가 저장될 때까지 */
  await page.waitForFunction(() => {
    for (let i = 0; i < localStorage.length; i++){
      try { const v = JSON.parse(localStorage.getItem(localStorage.key(i))); if (v && v.onboarded === true) return true; } catch(e){}
    }
    return false;
  }, null, { timeout: o.timeout });
  await page.waitForSelector('#obName', { state: 'detached', timeout: o.timeout });
  return page.evaluate(() => {
    for (let i = 0; i < localStorage.length; i++){
      try { const v = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (v && v.onboarded === true) return { name: v.name, avatar: v.avatar && v.avatar.kind, view: v.view }; } catch(e){}
    }
    return null;
  });
}

const SWIFTSHADER_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

module.exports = { onboard, blockProfileCloud, SWIFTSHADER_ARGS };
