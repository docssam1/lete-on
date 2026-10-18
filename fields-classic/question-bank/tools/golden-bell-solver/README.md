# 골든벨 독립 풀이 배치

정답을 모르는 모델에게 공개 문항(물음 + 그림 데이터)만 주고 풀게 한 뒤, 비공개 답안과 맞춰 본다.
잡으려는 것: **답이 둘 이상인 문항**(6권 31쪽 같은 것) · **글과 그림만으로는 못 푸는 문항** · **답안 오타**.
운영 방식은 「에이전트는 지휘, 긴 작업은 터미널」: 모델은 도구 없는 읽기 전용 일회 호출이고, 파일은 이 스크립트만 쓴다.

## 보안
- 프롬프트는 공개 `golden-bell-data.js`에서만 만든다. 원본 PDF·슬라이드 그림은 보내지 않는다.
- **작업 폴더(`GBS`)는 저장소 밖에 둔다.** `out/`에는 모델이 쓴 답이 들어 있다. git에 넣지 않는다.
- 대조는 Claude 세션이 비공개 답안으로 한다(`compare.mjs`). 화면 출력에는 문항 번호만 나온다.

## WSL에서 돌리기
```bash
cd ~/lete-on/fields-classic/question-bank/tools/golden-bell-solver   # 저장소 위치에 맞게
export GBS=~/gb-solver
node make-prompts.mjs "$GBS" book-06 make-number-source     # 시험: 6권 수 만들기 20문항
bash batch.sh book-06__19__00 book-06__19__08               # 맨 처음엔 두 문항만 손으로 확인
cat "$GBS"/out/book-06__19__08.json                          # unique:false 가 나와야 정상

setsid -f env GBS="$GBS" ENGINE=codex JOBS=3 bash batch.sh </dev/null >"$GBS/batch.log" 2>&1
pgrep -af batch.sh ; tail -f "$GBS/batch.log"
```
- `ENGINE=codex`(기본)은 `codex exec --sandbox read-only --ephemeral`을 쓴다. `ENGINE=claude`는 `claude -p --tools ""`이다.
  처음 쓰기 전에 `claude --help`로 이 옵션이 있는지 확인한다.
  Hermes 등 다른 도구를 쓰려면 `solve-one.sh`의 `call()`에 한 줄을 더하면 된다.
- `MODEL=…`로 모델을 고른다. 비우면 그 도구의 기본 모델이다.
- 끊겼다가 다시 띄우면 이미 답한 문항은 건너뛴다. 한 문항에 3번까지 시도하고, 실패하면 `logs/<이름>.err`에 원본 응답을 남긴다.
- 전체 실행: `node make-prompts.mjs "$GBS" book-02,book-03,book-04,book-05,book-06`. 책을 빼면 10권 전부다.

## 대조 (Claude 세션)
작업 폴더의 `index.json`과 `out/`을 받아서 다음을 실행한다.
```
node compare.mjs <작업 폴더> <답안 JSON>
```
결과는 다섯 갈래다: 불일치 · 다른 답도 냄 · 답 여럿이라 함 · 못 풂(wording/picture/conflict) · 미응답.
**모델 답만 보고 고치지 않는다.** 걸린 문항은 원본 슬라이드를 다시 보고 판정한 뒤, 평소 절차(패치 → DB `sourceNote` → 검사기)로 고친다.
