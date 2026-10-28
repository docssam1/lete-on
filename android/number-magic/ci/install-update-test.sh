#!/usr/bin/env bash
# 수의 마법 APK 설치→업데이트 시험(2026-10-28, 「학부모 배포 전 고정 서명과 실제 설치→업데이트 확인」).
# 에뮬레이터에서: ① 옛 버전을 새로 깔고 열어 본다 ② 지우지 않고 새 버전을 덮어 깐다 — 성공해야 하고, 처음 설치 시각이 그대로(= 다시 깐 게 아니라 업데이트,
# 앱 안 기록·로그인 유지)이고 버전 번호가 올라가야 한다 ③ 새 버전을 열어 본다 ④ 다른 열쇠로 서명한 APK 는 거절돼야 한다(시험이 진짜로 서명을 보는지)
# ⑤ 사이트에 이미 올라가 있는 APK(같은 열쇠)가 있으면 그것 → 새 버전도 같은 방식으로.
# usage: install-update-test.sh OLD.apk NEW.apk OTHER_KEY.apk [PUBLISHED.apk]
set -euo pipefail
OLD=$1 NEW=$2 OTHER=$3 PUB=${4:-}
PKG=kr.co.gfield.numbermagic
fail(){ echo "::error::$*"; exit 1; }
info(){ adb shell dumpsys package "$PKG"; }
vcode(){ info | grep -m1 -o 'versionCode=[0-9]*' | cut -d= -f2; }
first(){ info | grep -m1 'firstInstallTime=' | sed 's/.*firstInstallTime=//' | tr -d '\r'; }
launch(){
  adb logcat -c || true
  adb shell am start -W -n "$PKG/.MainActivity" | tr -d '\r'
  sleep 12
  adb shell pidof "$PKG" >/dev/null || fail "앱이 열린 뒤 꺼졌다"
  if adb logcat -d -b crash | grep -q "$PKG"; then adb logcat -d -b crash; fail "앱이 죽었다(crash 기록)"; fi
  adb shell am force-stop "$PKG"
}
update_from(){   # $1 = 먼저 깔 APK, $2 = 덮어 깔 APK
  adb uninstall "$PKG" >/dev/null 2>&1 || true
  adb install "$1" | tr -d '\r' | tee /tmp/i1; grep -q '^Success' /tmp/i1 || fail "처음 설치 실패: $1"
  local v1 f1; v1=$(vcode); f1=$(first); echo "설치됨 versionCode=$v1 firstInstallTime=$f1"
  launch
  sleep 2
  adb install -r "$2" | tr -d '\r' | tee /tmp/i2; grep -q '^Success' /tmp/i2 || fail "업데이트 실패(지우고 다시 깔아야 하는 상태): $1 → $2"
  local v2 f2; v2=$(vcode); f2=$(first); echo "업데이트됨 versionCode=$v2 firstInstallTime=$f2"
  [ "$f1" = "$f2" ] || fail "처음 설치 시각이 바뀌었다 — 업데이트가 아니라 새로 깔렸다"
  [ "$v2" -gt "$v1" ] || fail "버전 번호가 오르지 않았다($v1 → $v2)"
  launch
}
adb wait-for-device
echo "== ① ② ③ 옛 버전 → 새 버전"
update_from "$OLD" "$NEW"
echo "== ④ 다른 열쇠로 서명한 APK 는 거절돼야 한다"
adb install -r "$OTHER" 2>&1 | tr -d '\r' | tee /tmp/i3 || true
grep -q 'INSTALL_FAILED_UPDATE_INCOMPATIBLE' /tmp/i3 || fail "다른 열쇠 APK 가 거절되지 않았다 — 시험이 서명을 보지 못한다"
if [ -n "$PUB" ] && [ -f "$PUB" ]; then
  echo "== ⑤ 사이트에 올라가 있는 APK → 새 버전"
  update_from "$PUB" "$NEW"
fi
echo "INSTALL_UPDATE_OK"
