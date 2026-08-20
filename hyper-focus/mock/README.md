# Hyper Focus 프리미어 모의고사

Hyper Focus의 검증된 실시간 생성기를 시험지 뷰어, O/X 채점, 약점 진단, 보완 문제지로 연결하는 런타임입니다.

## 현재 범위

- q01~q05 쌓기나무 5유형
- 유형별 `same` 1문항 + `hard` 1문항, 총 10문항
- 같은 seed는 같은 문제지 재현
- 문제와 정답은 같은 payload에서 파생
- 틀린 유형마다 혼합 난이도 4문항 문제지 생성
- A4 문제지·정답·진단지 인쇄

현재 화면에는 **공간지각 진단 모의고사 Beta**라고 표시한다. q06 이후 생성기와 전체 출제 설계가 검수되기 전에는 전체 프리미어 모의고사로 표시하지 않는다.

## 파일

- `index.html`: 학생 입장, O/X 채점, 유형별 진단, 약점 문제지 연결
- `viewer.html`: 모의고사·약점 문제지 뷰어와 A4 인쇄
- `mock-core.js`: 생성기 registry, seed, 모의고사·연습지·채점 계약
- `../qa/validate_mock.js`: 재현성·성립·정답 다양성·채점 회귀검증

## 생성기 추가

1. `mock-core.js`의 `TYPE_META`에 generator 모듈과 계약을 등록한다.
2. generator는 `generate`, `validate`, `renderProblem`, `deriveAnswer`, `renderAnswer`를 제공한다.
3. 문제 그림과 정답은 반드시 같은 payload에서 만든다.
4. 모의고사 출제 순서·난이도는 `createExam`에서 명시적으로 편성한다.
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
