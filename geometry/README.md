# GFIELD Geometry World

어린이를 위한 공간·도형 사고력 학습 플랫폼입니다.

## 흐름

1. world-map/index.html - 인트로 영상과 리빙맵
2. 쌓기나무 성 클릭 - cube-town/index.html
3. 레벨별 게임 선택 - 각 게임은 games/ 아래 독립 실행
4. cube-town/print.html - 문제은행 기반 인쇄 학습지와 정답지

## 현재 게임

- games/copy-build/ - 똑같이 쌓기
- games/count-heights/ - 쌓기나무 개수 세기
- games/hidden-count/ - 숨은 쌓기나무 찾기
- games/fill-box/ - 큐브 박스 채우기
- games/cube-tunnel/ - 큐브 터널
- games/cube-piece-lab/ - 큐브 조각 연구소
- games/cube-memory/ - 큐브 메모리
- games/three-views/ - 세 방향 관찰소
- games/crystal-cubes/ - 크리스털 큐브
- games/cube-blueprint/ - 큐브 설계도
- games/find-shape/ - 단서로 모양 찾기
- games/minmax/ - 최대·최소 큐브 챌린지
- games/paper-fold/ - 한 번·두 번 접어 자르기, 구멍, 숫자 색종이, 맨 위 수
- games/paper-turn/ - 색종이 접고 돌리고 뒤집기
- games/mirror-manor/ - 거울 저택
- games/geoboard/ - 점판 공작소
- games/polyomino/ - 도형 조각 정원: 회전·반사 찾기와 정확 덮기 5레벨, 50문제
- games/net-observatory/ - 전개도 전망대: 전개도 접기·면 관계·방향·정다면체 5단계, 50문제
- games/dice-roll/ - 주사위 굴리기: 격자 경로를 따라 윗면·앞면·오른쪽 면 변화를 추적하는 5단계, 50문제
- games/path-walk/ - 길 잇기 산책로: 타일 회전·갈림길·최단 경로·숨은 타일 5단계, 50문제
- games/hidden-shape/ - 숨은 도형 탐정: 삼각형·정사각형·직사각형 세기 5단계, 50문제
- games/equal-partition/ - 똑같이 나누기: 같은 넓이·합동·수 조건 분할 5단계, 50문제
- games/soma-cube/ - 소마큐브 공방: 7조각 회전·2~3조각 합성·3×3×3 완성 5단계, 50문제

## 색종이 생각 놀이터

`origami-studio/`에서 두 개의 독립 과정을 선택합니다.

1. 접고 펼치기: 한 번 접기, 작업 위치, 대칭 도형, 잘린 수의 합
2. 접고 돌리고 뒤집기: 뒤집기, 자른 선 되짚기, 회전, 반사, 연속 동작 추적

두 과정은 각각 5레벨, 레벨마다 10문제이며 한 회차에 5문제를 풉니다. 첫 과정은 접기 횟수와 작업을 섞지 않고 `한 번 접어 자르기`, `두 번 접어 자르기`, `구멍 뚫기`, `숫자 색종이`, `맨 위 수`로 구분합니다. `worksheet/paper-fold/`에서는 같은 분류로 유형을 골라 학습지와 풀이가 포함된 정답지를 만들 수 있습니다.

## 후속 게임 설계

RAY와 프리즘 자료를 시각적으로 확인해 기존 게임과 겹치지 않는 후속 영역을 정리했습니다.

- 거울 저택
- 점판 공작소
- 폴리오미노 퍼즐
- 똑같이 나누기
- 소마큐브 공방
- 길 잇기 산책로: 한 길 잇기, 막힌 길 피하기, 두 곳에 닿기, 가장 가까운 길, 숨은 타일 추론의 5단계와 인쇄 학습지
- 숨은 도형 탐정: 부채꼴·겹친 삼각형, 정사각형 모눈, 붙인 사각형, 정삼각형 모눈의 5단계와 인쇄 학습지

레벨 구성, 문제 검증, 학습지 연결과 개발 순서는 `docs/12_SOURCE_BACKED_FUTURE_GAMES.md`를 따릅니다.
새 SVG 제너레이터와 절차형 개념 설명은 `docs/15_EVIDENCE_GATED_SVG_WORKFLOW.md`의
원본·수학 모델·단일정답·가시성·학습자 적합성·PC/모바일/A4·negative control 관문을 통과해야 합니다.

인쇄 학습지는 `worksheet/paper-fold/`, `worksheet/path-walk/`, `worksheet/hidden-shape/`,
`worksheet/net-observatory/`, `worksheet/dice-roll/`에서 각 게임의 검증 데이터를 그대로 사용해 만듭니다.

## 공통 성장 요소

- 9명의 도형 캐릭터 중 대표 캐릭터 선택
- 지도에 대표 캐릭터를 포함한 3명이 무작위로 산책
- 5가지 캐릭터 색상
- 게임 완료 포인트와 장착 아이템
- 한국어·중국어·일본어·영어

## 로컬 실행

정적 파일 서버의 루트를 이 폴더로 설정하고 /world-map/에서 시작합니다.

## 공간·입체 배포 회귀 검사

전개도 전망대, 주사위 굴리기, 소마큐브 공방과 두 인쇄 학습지의 데이터·브라우저 검사를 한 번에 순차 실행합니다. 전개도와 주사위 검사는 각각 별도 3차원 계산으로 5단계 50문제의 정답도 독립 검산합니다.

```powershell
node geometry/geometry-release.browsercheck.mjs
```

같은 검사를 실제 공개 사이트에 실행할 때는 기준 주소를 지정합니다.

```powershell
$env:GFIELD_BASE_URL='https://lete-on.gfieldacademy.net'
node geometry/geometry-release.browsercheck.mjs
```
