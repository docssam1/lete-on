# Hyper Focus 시험 구성·문제은행 연결

Hyper Focus의 검증된 실시간 생성기를 시험지 뷰어, O/X 채점, 약점 진단, 보완 문제지로 연결하는 런타임입니다.

## 현재 범위

- q01~q09 동적 공간지각 생성기 9유형은 검증 완료 상태로 동결
- q10~q47은 기존 `같게` variation을 보존하면서 실제 `쉽게·같게·어렵게` 동적 생성기를 추가
- q48~q54는 기존 canonical·variation을 보존하고 검수된 `같게` 2문항을 사용
- q10~q54 전체 45유형 90문제의 문장·그림 또는 text-only 표현·정답·풀이를 자동 시험지 출제원에 연결
- 유형에서 벗어났던 q22·q23·q24·q26은 기존 오류 내용을 폐기하고 canonical 원본 구조로 다시 제작·전수검증
- `exam-blueprints.js`의 시험 구성표가 문항 순서·난이도·문항 수를 결정
- `spatial-generator-review`는 q01~q09 생성기 연결 확인용이며 정식 모의고사가 아님
- `variation-bank-review`는 준비된 기존 유사문제 90개 연결 확인용이며 정식 모의고사가 아님
- 같은 seed는 같은 문제지 재현
- 문제와 정답은 같은 payload에서 파생
- 학생에게 문제은행 목록은 노출하지 않고, 선택한 약점 유형과 난이도로 시험지를 자동 생성
- 한 번에 최대 20유형, 유형마다 `쉽게·같게·어렵게` 중 하나를 선택
- 난이도별 유형당 2문항까지 포함하고 3번째 문제부터 `soma:premier:hyperfocus-extra` 유료 권한 필요
- q01~q47은 세 난이도 생성 지원, q48~q54 정적 variation 유형은 현재 검수된 `같게` 2문항만 노출
- A4 문제지·정답·진단지 인쇄

정식 프리미어 모의고사는 승인된 시험 구성표를 별도 id로 등록한 뒤 공개한다. 생성기 검수 세트를 정식 모의고사라고 표시하지 않는다.

## 파일

- `index.html`: 학생 입장, O/X 채점, 유형별 진단, 약점 문제지 연결
- `viewer.html`: 모의고사·약점 문제지 뷰어와 A4 인쇄
- `../review.html?mode=variation`: 원본·유사문제·정답·풀이·노출 상태를 나란히 보는 눈 검수표
- `exam-blueprints.js`: 시험별 문항 순서·유형·난이도·시간 구성
- `variation-bank.js`: 기존 variation JSON 로딩·노출 가능성 검사·난이도별 문제 객체 변환
- `access-policy.js`: 최대 20유형, 난이도별 무료 2문항, 유료 추가 문제 권한 계약
- `mock-core.js`: 생성기 registry, seed, 모의고사·연습지·채점 계약
- `../generator/stacking.js`: q02~q05 쌓기나무 생성기
- `../generator/spatial.js`: q06~q09 회전·전개도·주사위·세 방향 생성기
- `../generator/reasoning.js`: q10~q27 겹침·접기·도형 분할·경우의 수·수 규칙 생성기
- `../generator/advanced.js`: q28~q34 원 겹침·수 배열·과녁·문자식·거울수·계단·카드 생성기
- `../generator/logic.js`: q35~q40 줄 순서·원탁·논리표·수 규칙 생성기
- `../generator/combinatorics.js`: q41~q47 도형 변환·경우의 수·역추적 생성기
- `../qa/validate_mock.js`: 재현성·성립·정답 다양성·채점 회귀검증
- `../qa/generator-status.json`: 완료 유형 동결과 기존 문제은행의 뷰어 준비 상태 원장

## 생성기 추가

1. `mock-core.js`의 `TYPE_META`에 generator 모듈과 계약을 등록한다.
2. generator는 `generate`, `validate`, `enumerateAnswerCandidates`, `renderProblem`, `deriveAnswer`, `renderAnswer`를 제공한다. 후보 열거가 가능한 유형은 후보가 정확히 1개일 때만 통과한다.
3. 문제 그림과 정답은 반드시 같은 payload에서 만든다.
4. 모의고사 출제 순서·난이도·문항 수는 `exam-blueprints.js`에 명시적으로 편성한다.
5. 아래 검증을 통과시킨다.

```bash
node hyper-focus/qa/validate_mock.js
node hyper-focus/qa/validate_variations.js
```

## 접근 경계

- 이름만 입력하면 시험지·진단과 난이도별 2문항 맞춤 시험지를 이용할 수 있다.
- 3번째 이후 문제는 통합 권한 `soma:premier:hyperfocus-extra`가 있는 승인번호로만 연다.
- 승인번호는 URL에 넣지 않는다.
- 브라우저 저장소에는 현재 기기의 O/X 표시와 최근 진단 요약만 저장한다.
