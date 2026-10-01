---
name: science-lab-3d
description: 독쌤 사이언스 랩(science-lab)의 3D 장면·3D 실험실을 새로 만들거나 고칠 때 반드시 먼저 읽는다. 카메라 자동 맞춤, frame/noFrame, revealAt, 라벨, 조작, 전체 화면, 실험 상태 버그, 검사기 실행까지의 규칙과 실제로 겪은 실수.
---

# 사이언스 랩 3D 만들기 — 주의할 점

전문은 `science-lab/3D-RULES.md`. 이 스킬은 실수했던 것 위주의 점검표다. **끝나면 `node scripts/check-science-3d.mjs` 실패 0 확인 후 main.**

## 1. 카메라 — 거리는 쓰지 말고 각도만
- `stage.setView({ theta, phi, dist, target })`의 dist·target은 첫 프레임용일 뿐, 엔진(`science-lab/engine.js` `_fit`)이 보이는 물체 꼭짓점으로 **거리와 가운데를 다시 계산**한다(여백 fitMargin 0.88). 화면 비율이 바뀌면(덱·폰·전체 화면) 다시 잡는다.
- **각도를 신중히**: 실험의 핵심(뜬 틈, 물 높이, 쌓인 흙)이 가려지지 않는 각도.
- 손으로 dist 맞추기 금지 — 2026-09-29 전엔 5실험 전부 덱(653×458)·폰에서 잘렸다. `fitWidth`는 옛 방식(자동 맞춤에선 무시).
- 실험 중 물체가 자리 잡으면 0.6초마다 재어 부드럽게 다시 맞춘다(사용자가 돌리거나 확대하면 손대지 않음).

## 2. frame / noFrame — 실제로 틀렸던 곳
- **움직이는 물체(떨어지는 포일·비커·고리)가 있으면** `setView({ ..., frame: [[x0,y0,z0],[x1,y1,z1]] })`로 "다 놓인 뒤" 작업 공간을 준다. 안 주면 공중의 물체에 맞춰 멀리 잡혔다가 몇 초 뒤 다가온다(자석 탑·화산에서 겪음). 값은 정착 뒤 `_framePoints()` 상자를 재서 정한다.
- **바닥 역할 큰 물체(책상·받침판)는 `obj.userData.noFrame = true`** — 넣으면 주인공이 작아진다(화산 책상).
- 자동으로 빠지는 것: Points·Line·noFrame·크기 40 넘는 판·아직 숨은 라벨. InstancedMesh는 인스턴스 상자로 포함.
- 장면(Player)은 기본 `frameHidden: true`(나중에 나타날 물체까지 포함). 너무 작게 잡히면 모듈에 `frameHidden: false`.

## 3. 장면(scenes/*.js) — 답을 먼저 보여 주지 않기
- 모듈에 **`revealAt`**(답이 드러나는 비트 번호) 필수. 1차시 미리 보기는 그 앞에서 멈추고(`preview`), 결과 뒤 「3D로 확인하기」는 거기서부터(`from:'reveal'`).
- 비트는 벽시계(raw dt)로 진행. `prefers-reduced-motion`이면 즉시 최종 상태.

## 4. 라벨
- `kit.label(...)`만 사용(`userData.isLabel`). 엔진 `fitLabels`가 크기·좌우 밀어 넣기·**겹치면 아래로**·위아래 가장자리 보정.
- 두 라벨을 같은 높이·가까이 두지 말 것(폰에서 연못 「땅」·「물가」가 겹쳤다). `center`를 직접 바꾸지 말 것.

## 5. 조작
- 끌기 = 돌리기(일반 화면 폰은 옆으로만, 위아래는 페이지 스크롤 / 전체 화면은 위아래도). Ctrl+휠·두 손가락 = 확대(맞춘 거리의 0.35~1.8배). 돌리면 「↺ 처음 시점」, 두 번 클릭도 복귀.
- 물체 누르기는 pointerdown~up이 **8px·약 0.4초 이내**일 때만(끌기와 구분).
- 「누르고 있기」 단추: pointerdown/up/leave/cancel + Space·Enter keydown/keyup + contextmenu 막기 + CSS `touch-action:none; user-select:none`(lab-hill3d.js 참고).

## 6. 실험 상태 — 버튼 전엔 아무것도 저절로 안 움직이게
- "아직 안 함"을 초기값으로 나타내면(예 `foilY: 4`) **진행 조건에도 범위를 넣는다**: `if (S.foilY > 0 && S.foilY < 3.9)`. `> 0`만 쓰면 로드되자마자 떨어지고, 느린 기기에선 공중에 멈춰 보인다(화산 포일·비커 버그).
- `stage.update`는 `opts.isActive()`로 멈출 수 있다 — 중간 상태가 화면에 남지 않게.

## 7. 전체 화면
- `v2/mounts.js addLandscape`가 캔버스를 옮긴다 → 옮길 때 `canvas.dispatchEvent(new Event('stage:moved'))`(이미 있음). 엔진 보임 감시는 IntersectionObserver의 **마지막 항목**을 쓴다(첫 항목을 쓰면 전체 화면에서 3D가 멈췄다).

## 8. 새 실험 추가 점검표
1. `v2/units-index.js` READY와 `scripts/check-science-3d.mjs`의 `ALL`에 id 추가.
2. 각도 위주 setView, 움직이는 물체면 frame, 바닥은 noFrame, 장면은 revealAt.
3. 덱에 「3D 실험실 · …」 슬라이드(검사기가 제목으로 찾음).
4. `node scripts/check-science-3d.mjs <id>` 실패 0 → `SHOTS=/tmp/3d`로 캡처해 눈으로도(주인공이 크게·안 잘리게·라벨 안 겹치게).
5. `node --test science-lab/bank/*.test.mjs science-lab/v2/*.test.mjs` 실패 0. CSS 바꿨으면 `v2/index.html`·`intro/index.html`의 `?v=` 올리기.
6. Three.js는 새로 넣지 말고 `world-explorer/vendor/three.module.js`(r184) 상대 경로 import.
