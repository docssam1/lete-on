# 수의 마법 안드로이드 앱 (APK)

사이트 `https://lete-on.gfieldacademy.net/number_magic/` 을 앱 창(WebView)으로 연다. 내용은 사이트를 고치면 바로 바뀐다 — APK 를 다시 만들 일은 앱 껍데기(알림·인쇄·아이콘)를 바꿀 때뿐.

- 빌드: `.github/workflows/build-number-magic-apk.yml` (이 폴더가 main 에 바뀌면 자동, 손으로도 실행 가능)
- 결과: `number_magic/downloads/GFIELD-Numbers-of-Magic.apk` → 설치 안내 `number_magic/install.html`(짧은 주소 `/app`)의 「APK 받기」
- 앱만 하는 일: 매일 공부 알림(`window.NMAndroid.setReminder(시, 분)` · `cancelReminder()` · `getReminder()`), 화면 꺼짐 방지, `window.print()` → 안드로이드 인쇄, 뒤로 가기, 다른 사이트 링크는 바깥 브라우저
- 인터넷 없이 열기: 사이트의 서비스 워커(`number_magic/sw.js`)가 맡는다(WebView 도 서비스 워커를 쓴다)
- **서명(고정 열쇠, 2026-10-28)**: 열쇠는 PKCS12 `numbermagic`(RSA 4096, 2056년까지). 인증서 SHA-256 지문은 `signing-cert.sha256`(공개해도 되는 값).
  열쇠 파일·비밀번호는 저장소에 없다 — **Supabase Vault**(`nm_android_keystore` · `nm_android_keystore_password`, 2026-10-29 원장 「네가 해」)에 두고, 워크플로가 이미 있는 비밀값 `SUBBASE`로 꺼낸다.
  GitHub 비밀값 `NM_ANDROID_KEYSTORE`·`NM_ANDROID_KEYSTORE_PASSWORD`를 넣으면 그쪽이 먼저다. 원장 보관본(파일)도 있다. Supabase 무료 요금제는 자동 백업이 없으니 원장 보관본이 진짜 예비다.
  **열쇠를 잃거나 바꾸면 모든 기기에서 지우고 다시 깔아야 한다.** 바꿔야 한다면 `signing-cert.sha256`도 같이 바꾸고 학부모에게 재설치를 안내할 것.
- **사이트에 올라가는 조건**(워크플로가 다 확인): 정식 서명 · 지문 일치 · 사이트의 APK 보다 큰 버전 번호 ·
  에뮬레이터 설치→업데이트 시험(`ci/install-update-test.sh`: 옛 버전 설치·열기 → 지우지 않고 새 버전 덮어 설치 → 처음 설치 시각 그대로·버전 상승·열기,
  다른 열쇠 APK 거절, 사이트의 APK → 새 버전). 비밀값이 없으면 디버그 서명으로 시험만 하고 사이트에는 올리지 않는다.
- 버전 번호 = 워크플로 실행 번호 + 100.
