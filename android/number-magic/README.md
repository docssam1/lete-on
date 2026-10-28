# 수의 마법 안드로이드 앱 (APK)

사이트 `https://lete-on.gfieldacademy.net/number_magic/` 을 앱 창(WebView)으로 연다. 내용은 사이트를 고치면 바로 바뀐다 — APK 를 다시 만들 일은 앱 껍데기(알림·인쇄·아이콘)를 바꿀 때뿐.

- 빌드: `.github/workflows/build-number-magic-apk.yml` (이 폴더가 main 에 바뀌면 자동, 손으로도 실행 가능)
- 결과: `number_magic/downloads/GFIELD-Numbers-of-Magic.apk` → 설치 안내 `number_magic/install.html`(짧은 주소 `/app`)의 「APK 받기」
- 앱만 하는 일: 매일 공부 알림(`window.NMAndroid.setReminder(시, 분)` · `cancelReminder()` · `getReminder()`), 화면 꺼짐 방지, `window.print()` → 안드로이드 인쇄, 뒤로 가기, 다른 사이트 링크는 바깥 브라우저
- 인터넷 없이 열기: 사이트의 서비스 워커(`number_magic/sw.js`)가 맡는다(WebView 도 서비스 워커를 쓴다)
- 서명: GitHub 비밀값 `NM_ANDROID_KEYSTORE`(키스토어 base64) · `NM_ANDROID_KEYSTORE_PASSWORD` (선택 `NM_ANDROID_KEY_ALIAS`=numbermagic · `NM_ANDROID_KEY_PASSWORD`).
  없으면 디버그 서명 — 설치는 되지만 빌드마다 서명이 달라져, 새 APK 를 옛 APK 위에 깔 수 없다(지우고 다시 깔아야 함). **APK 를 널리 나눠 주기 전에 비밀값부터 넣을 것.** 한 번 정한 열쇠는 바꾸면 안 된다(바꾸면 모든 기기에서 지우고 다시 깔아야 한다) — 열쇠 파일은 원장이 따로 보관.
