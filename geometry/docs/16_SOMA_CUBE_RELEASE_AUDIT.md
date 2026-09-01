# 소마큐브 공방 공개 검증

작성일: 2026-08-30  
작업 ID: `geometry-soma-cube-release-audit-20260830`

## 1. 작업 계약

- 결과물: 기존 소마큐브 공방의 수학 모델을 유지하고 실제 화면 조작, 3D 렌더, 접근성,
  모바일 가로 화면, 공개 목록과 배포 상태를 검증한다.
- 학습자 단계: `키즈`, `Pre`, `입문`, `초급`, `중급`
- 같은 단계 안의 난이도: `하`, `하`, `중`, `중`, `상`
- 학습 행동: 회전해 같은 조각 고르기, 두 조각 합성, 세 조각 합성, 일부가 채워진 큐브 완성,
  서로 다른 두 조립법 만들기
- 선수 지식: 단위정육면체, 회전해도 같은 모양, 빈틈과 겹침 없는 합성
- 정답 계약: 1단계는 단일 선택, 2~4단계는 조건을 만족하는 모든 정확 덮기,
  5단계는 회전만 다른 답을 제외한 서로 다른 조립법 두 가지
- 근거 record ID: `geometry.soma-cube-workshop` (`verified`, `private`)
- 직접 근거 범위: 1~3단계의 회전 동치와 2~3조각 합성
- 내부 확장: 4~5단계의 `3x3x3` 완성과 일곱 조각 두 조립법
- 보호 범위: 비공개 원본 파일, 원문 페이지 이미지, 답안 전문과 개인 경로는 공개하지 않는다.
- 수정 범위: `geometry/games/soma-cube/`, Geometry 공개 목록, PWA 캐시와 인수인계 문서
- 완료 조건: 수학 self-test, 브라우저 조작, 캔버스 픽셀, 네 언어 가로 화면, 세로 안내,
  negative control, 관련 회귀, 원격 SHA와 실제 공개 화면 확인

`concept-whiteboard-lesson`은 이 작업에 적용하지 않는다. 소마큐브는 정해진 한 순서대로만
조립하는 절차 학습이 아니며, 가능한 여러 조립 순서를 인정하는 직접 조작 활동이기 때문이다.

## 2. 학습자 적합성

`learner-fit` 관문의 정확한 `learner_stage`는 각 단계 데이터의
`키즈`, `Pre`, `입문`, `초급`, `중급`이다.

| 기준 | 근거 |
|---|---|
| `language` | 한 화면의 지시는 한 행동만 요구하고 네 언어에서 같은 의미를 사용한다. |
| `representations` | 키즈는 회전 보기, Pre는 두 조각, 입문은 세 조각, 초급 이상은 `3x3x3` 공간으로 확장한다. |
| `prerequisites` | 단위정육면체와 회전 동치를 먼저 다룬 뒤 여러 조각 합성과 전체 큐브로 진행한다. |
| `reasoning-load` | 조각 수, 고정 조각, 목표 공간, 서로 다른 해 요구를 단계별로 하나씩 늘린다. 그림 크기만으로 단계를 올리지 않는다. |
| `response-mode` | 단일 선택과 실제 조립을 분리하고, 여러 정확 덮기가 가능한 단계는 모범 배치 하나만 강요하지 않는다. |

## 3. 관문 기록

| 관문 | 상태 | 증거 |
|---|---|---|
| `source-scope` | pass | `geometry.soma-cube-workshop`, `geometry/docs/12_SOURCE_BACKED_FUTURE_GAMES.md` |
| `math-model` | pass | 7조각의 부피 27, 서로 다른 7형, 정육면체 회전 24개, 검증된 큐브 해 40개 |
| `answer-contract` | pass | 1단계 회전 정답 1개, 2~4단계 정확 덮기 존재, 5단계 서로 다른 조립법 2개 이상 |
| `observability` | pass | 목표와 조립판을 독립된 3D 판에 표시하며 양쪽 카메라를 돌려 볼 수 있음 |
| `learner-fit` | pass | 위 다섯 기준과 단계별 추론 증가 기록 |
| `svg-geometry` | excluded | 핵심 화면은 SVG가 아니라 Three.js 단위정육면체 모델을 직접 렌더함 |
| `gaze` | excluded | 고정 순서의 화이트보드 설명이 아닌 다중해 직접 조립 활동 |
| `render-pc` | pass | 1280x900에서 목표·조립 캔버스와 조작 완료 확인 |
| `render-mobile` | pass | 844x390 가로 화면 네 언어, 가로 넘침 없음; 390x844 세로 회전 안내 확인 |
| `render-a4` | excluded | 이번 범위는 게임 공개 검증이며 소마큐브 학습지는 별도 작업 계약 필요 |
| `accessibility` | pass | 목표·조립판 설명, 선택지·조각·소리 버튼 이름, 키보드 힌트 조립, 초점 표시 확인 |
| `negative-control` | pass | 2단계 `Pre`를 임시로 `입문`으로 바꾸자 단계 배열 검사가 실패했고 즉시 원복 |
| `regression` | pass | 소마 self-test 및 Geometry 문제은행 회귀 검사 |
| `release-readback` | pass | 게임 반영 SHA `20a6f2acc39c434ff14e7ad75dc6194e470600e9`, Pages 실행 `33295860383`, 공개 브라우저 검사 통과 |

## 4. 실행 명령

```text
node geometry/games/soma-cube/soma-cube.selftest.mjs
node geometry/games/soma-cube/soma-cube-content-audit.mjs
node geometry/games/soma-cube/soma-cube.browsercheck.mjs
node geometry/worksheet/question-bank.selftest.cjs
```

공개 화면을 다시 검사할 때:

```powershell
$env:GFIELD_BASE_URL='https://lete-on.gfieldacademy.net'
node geometry/games/soma-cube/soma-cube.browsercheck.mjs
```

## 5. 상태

- 작업: `complete`
- 근거: `verified`
- 공개: `published`

공개 주소: `https://lete-on.gfieldacademy.net/geometry/games/soma-cube/?level=1`
