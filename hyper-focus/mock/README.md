# Hyper Focus 시험 구성·문제은행 연결

Hyper Focus의 검증된 실시간 생성기를 시험지 뷰어, O/X 채점, 약점 진단, 보완 문제지로 연결하는 런타임입니다.

## 현재 범위

- q01~q09 동적 공간지각 생성기 9유형은 검증 완료 상태로 동결
- q10~q54는 기존 canonical 45개·variation 90개를 보존하고 새 생성기로 다시 만들지 않음
- 기존 variation 중 문장·그림·정답·풀이가 모두 준비된 28유형 56문제를 뷰어 문제은행에 연결
- 원본 유형에서 벗어난 q22·q23·q24·q26의 기존 variation 8개는 `rejected`로 고정해 모든 문제은행에서 제외
- `exam-blueprints.js`의 시험 구성표가 문항 순서·난이도·문항 수를 결정
- `spatial-generator-review`는 q01~q09 생성기 연결 확인용이며 정식 모의고사가 아님
- `variation-bank-review`는 준비된 기존 유사문제 56개 연결 확인용이며 정식 모의고사가 아님
- 같은 seed는 같은 문제지 재현
- 문제와 정답은 같은 payload에서 파생
- 틀린 유형의 문제은행 문항 수는 사용자가 유형별로 직접 입력
- A4 문제지·정답·진단지 인쇄

정식 프리미어 모의고사는 승인된 시험 구성표를 별도 id로 등록한 뒤 공개한다. 생성기 검수 세트를 정식 모의고사라고 표시하지 않는다.

## 파일

- `index.html`: 학생 입장, O/X 채점, 유형별 진단, 약점 문제지 연결
- `viewer.html`: 모의고사·약점 문제지 뷰어와 A4 인쇄
- `../review.html?mode=variation`: 원본·유사문제·정답·풀이·노출 상태를 나란히 보는 눈 검수표
- `exam-blueprints.js`: 시험별 문항 순서·유형·난이도·시간 구성
- `variation-bank.js`: 기존 variation JSON 로딩·노출 가능성 검사·문제 객체 변환
- `mock-core.js`: 생성기 registry, seed, 모의고사·연습지·채점 계약
- `../generator/stacking.js`: q02~q05 쌓기나무 생성기
- `../generator/spatial.js`: q06~q09 회전·전개도·주사위·세 방향 생성기
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

- 이름만 입력하면 시험지와 진단을 이용할 수 있다.
- 승인번호를 확인한 학생에게만 약점 문제은행 링크를 연다.
- 승인번호는 URL에 넣지 않는다.
- 브라우저 저장소에는 현재 기기의 O/X 표시와 최근 진단 요약만 저장한다.
