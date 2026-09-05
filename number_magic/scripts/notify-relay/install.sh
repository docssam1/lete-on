#!/usr/bin/env bash
# Numbers of Magic — 알리고 릴레이 원클릭 설치 (Ubuntu/Debian, root 또는 sudo)
#   curl -fsSL https://raw.githubusercontent.com/docssam1/lete-on/main/number_magic/scripts/notify-relay/install.sh | sudo bash
# 묻는 값 4개: 릴레이 암호(RELAY_KEY) · 알리고 API 키 · 알리고 아이디 · 발신번호.
# 값을 미리 환경변수로 주면 묻지 않는다:  RELAY_KEY=… ALIGO_API_KEY=… ALIGO_USER_ID=… ALIGO_SENDER=… sudo -E bash install.sh
set -euo pipefail
DIR=/opt/nm-notify-relay
BASE=${BASE:-https://raw.githubusercontent.com/docssam1/lete-on/main/number_magic/scripts/notify-relay}
PORT=${PORT:-8090}

if [ "$(id -u)" -ne 0 ]; then echo "sudo 로 실행하세요:  curl -fsSL $BASE/install.sh | sudo bash"; exit 1; fi

ask() { # ask VAR "질문" [secret]
  local var=$1 q=$2 secret=${3:-}
  if [ -n "${!var:-}" ]; then return; fi
  if [ "$secret" = "secret" ]; then read -r -s -p "$q: " val </dev/tty; echo; else read -r -p "$q: " val </dev/tty; fi
  [ -n "$val" ] || { echo "값이 비었습니다: $var"; exit 1; }
  printf -v "$var" '%s' "$val"
}

echo "== 1/5 Node 확인"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v\([0-9]*\).*/\1/')" -lt 18 ]; then
  echo "Node 20 설치 중…"; curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null; apt-get install -y nodejs >/dev/null
fi
node -v

echo "== 2/5 파일 내려받기 → $DIR"
mkdir -p "$DIR"
if [ -n "${SRC_DIR:-}" ]; then cp "$SRC_DIR"/relay.js "$SRC_DIR"/relay.service "$DIR"/;
else curl -fsSL -o "$DIR/relay.js" "$BASE/relay.js"; curl -fsSL -o "$DIR/relay.service" "$BASE/relay.service"; fi

echo "== 3/5 설정값"
ask RELAY_KEY "릴레이 암호 (Supabase Vault의 NOTIFY_RELAY_KEY 와 같은 값)" secret
ask ALIGO_API_KEY "알리고 API 키" secret
ask ALIGO_USER_ID "알리고 아이디"
ask ALIGO_SENDER "발신번호 (알리고에 등록된 번호, 숫자만)"
ALIGO_SENDER=$(echo "$ALIGO_SENDER" | tr -cd '0-9')
umask 077
cat > "$DIR/relay.env" <<ENV
RELAY_KEY=$RELAY_KEY
ALIGO_API_KEY=$ALIGO_API_KEY
ALIGO_USER_ID=$ALIGO_USER_ID
ALIGO_SENDER=$ALIGO_SENDER
PORT=$PORT
ALIGO_TESTMODE=${ALIGO_TESTMODE:-Y}
MAX_PER_HOUR=200
ENV
chmod 600 "$DIR/relay.env"; chown nobody "$DIR/relay.env" 2>/dev/null || true

echo "== 4/5 서비스 켜기"
if [ -z "${NO_SERVICE:-}" ] && command -v systemctl >/dev/null 2>&1; then
  sed "s#/usr/bin/node#$(command -v node)#" "$DIR/relay.service" > /etc/systemd/system/nm-notify-relay.service
  systemctl daemon-reload; systemctl enable --now nm-notify-relay; sleep 1
  systemctl is-active nm-notify-relay || { journalctl -u nm-notify-relay -n 20 --no-pager; exit 1; }
else
  (set -a; . "$DIR/relay.env"; set +a; nohup node "$DIR/relay.js" >"$DIR/relay.log" 2>&1 &); sleep 1
fi

echo "== 5/5 방화벽·확인"
if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q "Status: active"; then ufw allow "$PORT"/tcp >/dev/null && echo "ufw: $PORT/tcp 열림"; fi
curl -fsS "http://127.0.0.1:$PORT/notify/health" && echo && echo "완료. 클라우드 방화벽(보안그룹)이 따로 있으면 $PORT 인바운드도 열어 주세요. 그다음 채팅에 '서버 올렸어'."
