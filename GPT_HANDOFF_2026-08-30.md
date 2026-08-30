# GFIELD Geometry 작업 인수인계서

작성일: 2026-08-30
목적: 토큰 부족, 모델 전환, 채팅 재개 실패가 있어도 다음 작업자가 저장소와 이 문서만으로 현재 상태와 다음 작업을 정확히 복원할 수 있도록 한다.

## 0. 가장 먼저 읽을 파일

1. `E:\Codex\CODEX_STORAGE_NOTICE.md`
2. `E:\Codex\CODEX_STORAGE_STATUS.md`
3. `E:\Codex\AGENTS.md`
4. 이 문서: `GPT_HANDOFF_2026-08-30.md`
5. Geometry 설계 기준: `geometry\README.md`, `geometry\docs\00_MASTER_PLAN.md`, `geometry\docs\12_SOURCE_BACKED_FUTURE_GAMES.md`, `geometry\docs\14_STAGE_DIFFICULTY_PROFILE.md`
6. SVG 제너레이터 필수 관문: `geometry\docs\15_EVIDENCE_GATED_SVG_WORKFLOW.md`

저장소 운영 문서의 보호 규칙이 이 문서보다 우선한다. C:의 원본 자료와 기존 프로젝트는 확인 없이 이동·삭제하지 않는다. 필즈 더 클래식 원본은 읽기 전용 증거로 취급한다.

## 1. 확정 기준 경로

### 작업 저장소

- 로컬 Git 저장소: `C:\Users\user\Documents\Codex\2026-07-14\sks\.publish-lete-on`
- 원격 저장소: `https://github.com/docssam1/lete-on`
- 원격 기준 브랜치: `main`
- Geometry 기능 기준 병합 커밋: `83c5eb41c91c4f49caf620eb7202e9fde6b4d3d1`
- 현재 HEAD는 병행 작업으로 계속 바뀔 수 있으므로 아래 `git rev-parse` 명령으로 다시 확인한다.
- 이 문서의 원격 읽기 경로: `https://github.com/docssam1/lete-on/blob/main/GPT_HANDOFF_2026-08-30.md`

다음 작업자는 Git 작업 전에 반드시 저장소 위치를 다시 확인한다.

```powershell
Set-Location 'C:\Users\user\Documents\Codex\2026-07-14\sks\.publish-lete-on'
git fetch origin
git status --short
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
```

원격 `main`이 앞서 있으면 강제 푸시하지 말고 `fetch` 후 병합, 충돌 확인, 검증, 푸시 순서로 처리한다.

### 채팅 세션 기록

- Codex 세션 저장 기준: `E:\Codex\sessions`
- 이 작업과 연결되어 확인된 세션 로그: `E:\Codex\sessions\2026\08\30\rollout-2026-08-30T00-35-52-01a04e29-b8a3-77a0-a0e4-9d83581f13a9.jsonl`
- 세션 로그는 보조 기록이다. 모델이 원문 세션을 읽지 못해도 이 문서와 GitHub 저장소를 기준으로 작업을 이어간다.
- C:의 `C:\Users\user\.codex\sessions`는 E:의 `E:\Codex\sessions`를 가리키는 정션이다. 정션 대상에 재귀 삭제를 실행하지 않는다.

## 2. 현재 완료 상태

### Geometry World 전체 방향

어린이를 위한 공간·도형 사고력 플랫폼이다. 시작 흐름은 다음과 같다.

`geometry/world-map/` 인트로·리빙맵 → `geometry/solid-vista/` 게임 선택 → `geometry/games/` 독립 게임 → `geometry/worksheet/` 인쇄 학습지

설계 원칙:

- 초등팩토 1, 킨더, 키즈팩토 및 확인된 RAY·프리즘 활동의 사고 구조를 참고한다.
- 첨부 이미지는 사용자 요청이 아니라 원문 활동을 확인하기 위한 증거로 취급한다.
- 원문 그림을 임의로 복제하거나 답을 OCR 추측으로 확정하지 않는다.
- 같은 학습 목표를 내부 문제로 변형할 때는 원문 배치와 숫자를 그대로 공개하지 않고, 문제 구조와 검증 규칙을 보존한다.
- 게임과 학습지는 문제 데이터를 공유하되, 종이에서는 조작을 그리기·고르기·기록하기 활동으로 바꾼다.
- 쌓기나무는 기본 구성이다. 등각 그림의 시선과 보이는 면을 문제 조건으로 함께 관리한다.
- 새 문항·SVG·학습지·절차형 개념 설명은 `geometry/docs/15_EVIDENCE_GATED_SVG_WORKFLOW.md`의
  작업 계약과 관문을 따른다.
- 절차의 순서가 학습 내용인 경우에만 `skills/concept-whiteboard-lesson/SKILL.md`를 사용하고,
  일반 정적 문항을 불필요하게 애니메이션으로 바꾸지 않는다.

### 이번 커밋에 반영된 주요 작업

기능 커밋: `c8ee95fe`  
원격 선행 변경과 병합한 최종 커밋: `83c5eb41`

이번 반영에는 다음이 포함되어 있다.

- 주사위 굴리기 게임과 학습지
- 길 잇기 산책로 게임과 학습지
- 숨은 도형 탐정 게임과 학습지
- 전개도 전망대·색종이 공방·거울·점판 등 geometry 관련 연결과 보강
- 관련 README·설계 문서 갱신

현재 `geometry/README.md`의 게임 목록을 실제 공개 목록의 기준으로 사용한다.

## 3. 주사위 굴리기 확정 사양

### 게임 경로

- 로컬: `http://127.0.0.1:8765/geometry/games/dice-roll/?level=3`
- 원격 파일: `https://github.com/docssam1/lete-on/tree/main/geometry/games/dice-roll`
- 주요 파일:
  - `geometry/games/dice-roll/index.html`
  - `geometry/games/dice-roll/app.js`
  - `geometry/games/dice-roll/levels.js`
  - `geometry/games/dice-roll/styles.css`
  - `geometry/games/dice-roll/dice-roll.selftest.mjs`
  - `geometry/games/dice-roll/dice-roll.browsercheck.mjs`

### 문제 구성

- 5단계, 전체 50문제, 한 회차 5문제
- 방향은 위·오른쪽·아래·왼쪽 `N/E/S/W`로 처리한다.
- 주사위 방향 변화는 `levels.js`의 `roll`, `rollMany`, `visibleFaces`를 기준으로 한다.
- 가능한 정육면체 방향 24가지를 검증한다.
- 레벨 3에는 출처에서 확인한 형태와 같은 `4 → 7 → 8 → 5` 반시계 방향 경로가 포함되어 있다.
- 난이도는 그림의 크기만으로 정하지 않고, 회전 수·추론 단계·보이는 면·역추론 여부를 기준으로 입문·초급·중급을 정한다.

### 두 가지 표시 방법

1. `입체 주사위`
   - 게임판 위에 윗면·앞면·오른쪽 면이 보이는 나무 질감의 입체 주사위를 표시한다.
   - 현재 관찰 영역에도 같은 주사위를 크게 표시한다.
   - 나뭇결, 명암, 광택, 그림자를 사용하되 눈금 판독을 방해하지 않게 유지한다.

2. `납작 주사위`
   - 납작한 직사각형이나 단순한 윗면 그림이 아니다.
   - 큰 정사각형 안에 작은 정사각형을 두고, 대응하는 꼭짓점을 연결하여 5개 영역을 만든다.
   - 영역은 `top`, `north`, `east`, `south`, `west`이며, 보이지 않는 밑면은 표시하지 않는다.
   - 중심 영역은 윗면, 바깥 네 영역은 네 옆면의 기록 공간이다.
   - 첫 상태에는 `top`만 눈을 표시하고 네 옆면은 `?`로 둔다.
   - 숨은 영역을 누르면 그 영역 하나만 공개한다.
   - `힌트`는 현재 다음 이동에 필요한 면을 공개한다. 방향과 면의 대응은 `N→south`, `S→north`, `E→west`, `W→east`이다.
   - 굴리면 다시 `top`만 표시한다.
   - 정답을 맞히면 다섯 영역을 모두 공개한다.
   - 물음표가 영역 클릭을 가리지 않도록 `.flat-question`은 포인터 이벤트를 받지 않는다.

이 부분은 사용자의 최종 결정인 “게임에도 표시 일부 하면서 힌트를 얻을 수 있게”를 구현한 것이다. 다음 작업자가 단순히 다섯 면을 처음부터 모두 보여 주는 방식으로 되돌리지 않는다.

### 게임과 학습지 관계

- 학습지 경로: `http://127.0.0.1:8765/geometry/worksheet/dice-roll/`
- 원격 파일: `https://github.com/docssam1/lete-on/tree/main/geometry/worksheet/dice-roll`
- 학습지의 시작 칸에는 3면이 보이는 입체 주사위를 둔다.
- 답 기록 영역은 5영역 납작 주사위 모양으로 만든다.
- 정답을 끈 상태에서는 기록 영역이 비어 있고, 정답 표시를 켜면 각 단계의 5면 눈이 표시된다.
- 학습지는 A4 1페이지, 2문제 구성으로 확인되었다.

## 4. 사용자 결정 사항

다음 모델은 아래 결정을 다시 논쟁하거나 원래 구조와 다른 방향으로 바꾸지 않는다.

- 초등팩토 1의 문제 그림은 난이도 판단과 사고 구조 확인의 기준이다.
- 입문·초급·중급 구분은 작업자가 문제의 추론 단계에 따라 정한다.
- 쌓기나무 문제에서는 시선을 확인한다. 등각 시선 코드는 기본적으로 `iso-plus-x-plus-z-v1`을 사용한다.
- 직접 세기 문제에서 그림으로 확정되지 않는 숨은 블록을 임의로 가정하지 않는다.
- `목표 입체를 만드는 두 조각 찾기`는 정통 소마큐브 문제와 구분한다. 두 조각 합성 문제로 분류하고, 소마큐브는 여러 조각을 실제로 결합하는 별도 상위 영역으로 둔다.
- 색종이 유형은 한 번 접기, 두 번 접기, 자르기, 여러 번 접어 구멍 뚫기, 윗면의 숫자 찾기, 대각선 접기 등을 섞지 않고 구분한다.
- 색종이 활동은 원문의 문제 구조와 같은 형태를 우선하며, 단순히 그림 크기를 바꾸는 식으로 난이도를 만들지 않는다.
- 선분 활동은 꼭짓점에서 뻗은 선을 단순히 두 개씩 고르는 문장이 아니라, 밑변에서 생기는 길이 1개짜리부터 6개짜리 선분을 모두 세고 더하는 구조를 확인한다. 크고 작은 선분을 구분하되 그림 크기 자체를 난이도 단서로 쓰지 않는다.
- 주사위 굴리기는 한 방향만이 아니라 여러 방향으로 이동할 수 있어야 한다.
- 게임판 위에도 진행 중인 주사위를 표시한다.
- 사용자가 직접 보거나 누를 수 있는 부분과 힌트로 공개되는 부분을 분리한다.

## 5. 검증 결과

2026-08-30 현재 다음 검사를 실제 실행했다.

### 주사위 게임

```text
node --check geometry\games\dice-roll\app.js
node geometry\games\dice-roll\dice-roll.selftest.mjs
```

결과: `5 levels, 50 problems, 24 orientations validated`

```text
node geometry\games\dice-roll\dice-roll.browsercheck.mjs
```

결과:

- 레벨 3 경로 3개 확인
- 레벨 5 선택지 3개 확인
- 납작 주사위 영역 5개 확인
- 처음 숨은 옆면 4개 확인
- 직접 한 면 공개 후 3개 숨김 확인
- 힌트 후 2개 숨김 확인
- 첫 이동 `S`, 힌트 대상 `north`인 실제 문제에서 확인
- 모바일 가로 넘침 없음: `scrollWidth 390`, `width 390`
- 통합 화면의 주사위 카드 5개 확인
- 콘솔 오류와 페이지 오류 없음

### 주사위 학습지

```text
node --check geometry\worksheet\dice-roll\app.js
node geometry\worksheet\dice-roll\dice-roll-sheet.browsercheck.mjs
```

결과:

- 문제 2개
- 원문 구조를 반영한 경로 `4-7-8-5`
- A4 비율 확인
- 모바일 가로 넘침 없음: `scrollWidth 390`

검증용 이미지는 재생성 가능하며 저장 위치는 다음과 같다.

- 게임 입체 보기: `C:\Users\user\AppData\Local\Temp\gfield-dice-roll-level3.png`
- 게임 납작 보기: `C:\Users\user\AppData\Local\Temp\gfield-dice-roll-flat.png`
- 게임 모바일 보기: `C:\Users\user\AppData\Local\Temp\gfield-dice-roll-mobile.png`
- 학습지 보기: `C:\Users\user\AppData\Local\Temp\gfield-dice-roll-worksheet.png`
- 학습지 PDF: `C:\Users\user\AppData\Local\Temp\gfield-dice-roll-worksheet.pdf`

임시 검증 이미지는 공개 소스의 기준 자료가 아니다. 새 화면을 확인할 때 다시 생성한다.

## 6. 아직 하지 않은 일

아래 항목은 완료했다고 말하지 않는다.

- GitHub Pages 실제 배포 URL에서 최신 geometry 파일을 다시 여는 라이브 검증
- Geometry 전체 게임과 전체 학습지를 한 번에 실행하는 종합 브라우저 회귀 검사
- 주사위 게임의 한국어 외 중국어·일본어·영어 문장 완비 여부 점검
- 모든 게임의 난이도와 문제 수가 `geometry/README.md`, `docs/12_SOURCE_BACKED_FUTURE_GAMES.md`, 실제 `levels.js`에서 일치하는지 전수 대조
- 주사위 게임의 정답 보기·방향 안내·힌트 문구에 대한 교육자 검토
- Android APK 빌드 결과와 웹 버전의 기능 동등성 확인

## 7. 다음 작업 순서

### 우선순위 1: 배포와 보존 확인

1. 저장소 운영 문서 3개와 이 문서를 읽는다.
2. `git fetch origin` 후 `HEAD`와 `origin/main`을 비교한다.
3. `geometry/games/dice-roll/` 및 `geometry/worksheet/dice-roll/`가 원격 main에 존재하는지 확인한다.
4. `.github/workflows/deploy-pages.yml`을 확인하고, Actions 성공 여부와 실제 Pages 화면을 검증한다.
5. 라이브 화면에서 입체 보기, 납작 보기, 직접 공개, 힌트 공개, 정답 공개를 각각 확인한다.

### 우선순위 2: 교육 내용과 문제은행 검수

1. 5단계의 실제 문제를 `levels.js`별로 펼쳐 방향·답·화면 표시를 독립 계산한다.
2. 같은 이동 결과가 중복되거나 정답 보기가 둘 이상인 문제가 없는지 검사한다.
3. 모든 문제에서 현재 시선과 표시되는 면이 문제 조건과 일치하는지 확인한다.
4. 원문과 다른 내부 확장 문제는 원문 복제라고 표현하지 않고 내부 확장으로 표시한다.
5. 첨부 원본을 다시 확인할 때는 페이지 이미지와 공식 답안을 직접 대조하고, OCR은 검색 보조로만 사용한다.

### 우선순위 3: 접근성·다국어·화면 품질

1. 주사위의 5개 영역을 키보드와 스크린 리더에서도 구분할 수 있는지 점검한다.
2. 납작 보기의 `?` 영역에 면 이름과 공개 동작을 적절한 접근성 이름으로 연결한다.
3. 한국어·중국어·일본어·영어에서 버튼이 잘리지 않는지 확인한다.
4. 390px 모바일, 태블릿, 데스크톱, 인쇄 A4를 다시 캡처한다.
5. 광택과 나뭇결이 눈의 개수와 경계를 가리지 않는지 확인한다.

## 8. 안전 규칙

- 원본 교재·PDF·PNG는 읽기 전용이다.
- 공개 저장소에는 개인 드라이브의 원문, 답안 전문, 개인 경로를 넣지 않는다.
- C: 원본과 기존 `.codex` 프로젝트를 정리하지 않는다.
- Git 작업 트리가 깨끗하지 않으면 변경 내용을 먼저 분류한다.
- `git reset --hard`, `git checkout --`, 강제 푸시는 사용하지 않는다.
- 원격 main이 앞서 있으면 fetch → 병합 → 검사 → push 순서를 지킨다.
- 실제 배포, 라이브 URL, 원격 SHA를 확인하지 않았다면 배포 완료라고 보고하지 않는다.
- 채팅 기록이 보이지 않아도 임의로 내용을 보충하지 말고 이 문서의 확정 결정과 저장소 파일을 기준으로 한다.

## 9. 재개용 짧은 명령 모음

```powershell
Set-Location 'C:\Users\user\Documents\Codex\2026-07-14\sks\.publish-lete-on'
git fetch origin
git status --short
git rev-parse HEAD
git rev-parse origin/main
node geometry\games\dice-roll\dice-roll.selftest.mjs
node geometry\games\dice-roll\dice-roll.browsercheck.mjs
node geometry\worksheet\dice-roll\dice-roll-sheet.browsercheck.mjs
```

로컬 서버가 없을 때:

```powershell
Set-Location 'C:\Users\user\Documents\Codex\2026-07-14\sks\.publish-lete-on'
py -m http.server 8765
```

시작 화면: `http://127.0.0.1:8765/geometry/world-map/`

## 10. 인수인계 결론

Geometry 기능 기준 커밋은 `83c5eb41c91c4f49caf620eb7202e9fde6b4d3d1`이다. 그 뒤에도 병행 작업과 문서 갱신이 이어지므로 재개할 때 현재 원격 SHA를 다시 확인한다. 주사위 게임은 5단계·50문제와 24방향 검증을 통과했고, 납작 주사위는 큰 정사각형·작은 정사각형·연결선으로 만든 5영역 구조와 부분 공개 힌트를 사용한다. 다음 작업자는 이 구조와 `15_EVIDENCE_GATED_SVG_WORKFLOW.md`의 관문을 유지하면서 먼저 실제 Pages 배포와 전체 문제·다국어 검수를 이어간다.
