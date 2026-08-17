# Hyper Focus 문제은행 구조개편 인수인계서

작성 목적: 현재 Hyper Focus를 **음성/채팅형 AI 튜터**에서 **오답 약점 기반 실시간 유사문제 생성기 + 시험지 출력** 구조로 전환하기 위한 인수인계 문서.

## 0. 작업 기준

- 저장소: `docssam1/lete-on`
- 작업 브랜치: `codex/hf-data-replacement`
- 이 문서 작성 직전 확인 HEAD: `c678ad84da33e42f36f41f87e8c0b5afcbae38f9`
- `main`은 건드리지 않는다. 명시적 지시 없이는 merge/push-to-main 금지.
- 현재 브랜치의 q01/q02/q03/q05 정적 variation SVG들은 **최종 아키텍처가 아니라 중간 산출물**로 본다.

---

## 1. 제품 목표를 다시 정의한다

Hyper Focus의 기본 서비스는 아래만 제공한다.

1. 진단 결과에서 틀린 문항/약점 유형 확인
2. 약점 유형별 난이도 선택
   - 쉽게
   - 같게
   - 어렵게
3. 선택한 난이도에서 **유사문제 2문제 생성**
4. 여러 약점 유형을 선택하면 유형당 2문제씩 묶어서 **깔끔한 A4 시험지 형태**로 출력
5. 정답 및 간단 풀이 제공

### 기본 서비스에 넣지 않을 것

- 음성 설명
- 음성 채팅
- 실시간 손글씨 설명
- AI 튜터 대화형 UI
- 복잡한 카드형 학습 흐름
- 학생별 장기 성장 분석
- 무제한 문제 생성
- 고급 리포트/반 관리/숙제 배정 등 유료 영역

기본 서비스의 정체성은 **“진단 → 약점 유형 → 난이도 선택 → 2문제 → 시험지”**다.

---

## 2. 가장 중요한 구조 수정

### 잘못된 방향

아래처럼 문제마다 정적 파일을 만들어 두는 방식은 제너레이터가 아니다.

```text
q01_var01.svg
q01_var02.svg
q01_var01_solution.svg
q01_var02_solution.svg
...
```

SVG든 PNG든 **미리 만들어 둔 그림 파일을 불러오는 구조는 정적 문제은행**일 뿐이다.

### 목표 구조

```text
틀린 문항 q01
    ↓
[쉽게] [같게] [어렵게]
    ↓
q01 generator(difficulty, seed)
    ↓
문제 데이터 2세트 생성
    ↓
validator로 성립 여부 검증
    ↓
renderer가 문제 그림 생성
    ↓
같은 데이터에서 정답/풀이 자동 계산
    ↓
worksheet renderer가 시험지에 배치
```

핵심 레이어는 5개만 유지한다.

1. **Canonical** — 유형의 교육적 규칙/불변 조건
2. **Generator** — 난이도와 seed를 받아 문제 데이터를 생성
3. **Validator** — 문제 성립, 유일성, 난이도 범위, 정답 일치 검증
4. **Renderer** — 생성된 데이터를 SVG/Canvas/HTML로 시각화
5. **Worksheet** — 약점 유형별 2문제를 A4 시험지로 배치

원본 PNG는 **유형을 이해하고 시각 기준을 확인하는 참고 자료**로만 남긴다. 실제 유사문제 출력 소스로 사용하지 않는다.

---

## 3. 음성/채팅 구조 정리

현재 코드에 `audioScript`, 음성 재생, AI tutor용 문장, 음성/채팅 UI가 있더라도 새 문제은행 흐름에서는 사용하지 않는다.

### 원칙

- 새 generator contract에는 음성 필드를 넣지 않는다.
- worksheet 화면에는 음성 버튼을 넣지 않는다.
- 유사문제 생성 흐름에서 AI 채팅을 호출하지 않는다.
- 기존 콘텐츠 보존이 필요하면 원본 데이터는 남겨도 되지만, 새 런타임 경로에서는 참조하지 않는다.
- 구조 정리 시 먼저 **UI/실행 경로에서 비활성화/분리**하고, 데이터 필드 대량 삭제는 이후에 한다.

---

## 4. 현재 브랜치에서 정리 대상

다음은 최근 작업에서 추가되었지만 최종 구조에서는 재검토해야 한다.

### `hyper-focus/assets/hf_solution_visuals.js`

- q01 전용 답안 SVG 삽입
- MutationObserver 기반 동적 삽입
- 유사문제 카드 정렬 보정
- 캐시 버전 우회

이 파일은 **정적 variation SVG를 화면에 끼워 넣기 위한 임시 보조 구조**다. 새 generator/worksheet 구조에서는 q01 전용 동적 삽입이 필요 없어야 한다.

### `hyper-focus/assets/kr_font.js` / `kr_font_data.js`

최근 `kr_font.js`를 bootstrap wrapper로 바꾸고 원래 폰트 payload를 `kr_font_data.js`로 분리했다. 이 변경은 generator 핵심과 무관하다.

- PDF/인쇄 폰트가 정상 동작하는지 먼저 확인
- 문제가 없더라도 generator 전환과 결합하지 말 것
- 문제 발생 시 원래 단일 폰트 로딩 구조로 되돌리는 것을 우선 검토

### q01/q02/q03/q05 variation SVG

현재 정적 SVG는 **시각 스타일 참고용 샘플**로는 쓸 수 있지만 최종 문제 출력 파일로 의존하지 않는다.

- `q01_var*.svg`
- `q01_var*_solution.svg`
- `q02_var*.svg`
- `q03_var*.svg`
- `q05_var*.svg`

새 구조에서는 generator가 만든 payload를 공통 renderer가 그려야 한다.

---

## 5. q01을 표준 구현으로 먼저 완성한다

54개 유형 전체를 동시에 고치지 않는다. **q01 하나를 end-to-end로 완성한 뒤 표준으로 삼는다.**

### q01 입력

```js
generateQ01({ difficulty: 'same', seed })
```

### q01 출력 예시

```js
{
  questionId: 'q01',
  difficulty: 'same',
  seed: 12345,
  heightMap: [
    [1, 2, 0],
    [2, 1, 1],
    [1, 1, 0]
  ],
  frontView: {...},
  rearView: {...},
  answer: {
    totalBlockCount: 9,
    topViewHeights: [
      [1, 1],
      [2, 1, 1],
      [1, 2]
    ]
  }
}
```

실제 필드명은 기존 canonical과 맞춰도 되지만 원칙은 다음과 같다.

- 문제 그림과 정답은 **같은 payload에서 파생**
- answer를 사람이 별도로 입력하지 않음
- static `problemImage` 경로가 문제의 본체가 되면 안 됨
- 동일 seed는 동일 문제를 재현해야 함
- 다른 seed는 다른 문제를 생성해야 함

### q01 답안 시각 규칙

q01 답안은 층별 분해가 아니라:

- 위에서 본 평면 모양 하나
- 점유한 각 칸에 그 자리에 쌓인 블록 수 숫자 표시
- 불필요한 설명/식은 그림 안에 넣지 않음

---

## 6. 난이도는 파일명이 아니라 생성 규칙으로 만든다

기존처럼 easy/same/hard 탭이 같은 variation 파일을 보여주는 구조를 사용하지 않는다.

난이도는 generator의 constraint preset이다.

예시:

```js
const DIFFICULTY = {
  easy: {
    maxHeight: 2,
    hiddenCountRange: [1, 2],
    occupiedCellRange: [4, 6]
  },
  same: {
    maxHeight: 3,
    hiddenCountRange: [2, 4],
    occupiedCellRange: [5, 8]
  },
  hard: {
    maxHeight: 4,
    hiddenCountRange: [3, 6],
    occupiedCellRange: [6, 10]
  }
};
```

실제 난이도 조건은 각 canonical 유형에 맞춰 별도 정의한다. 단순 숫자만 키우는 방식은 금지한다.

---

## 7. 유사문제 UI는 시험지 중심으로 단순화한다

현재 카드형 UI를 계속 확장하지 않는다.

### 사용자 흐름

```text
[진단 결과]
1번 틀림
5번 틀림
17번 틀림

      ↓

약점 유형
1번 쌓기나무 앞/뒤        [쉽게] [같게] [어렵게]
5번 보이지 않는 쌓기나무 [쉽게] [같게] [어렵게]
17번 도형 세기           [쉽게] [같게] [어렵게]

      ↓

[맞춤 문제지 만들기]

      ↓

A4 문제지
각 유형당 2문제
```

### 시험지 화면

- A4 세로 기본
- 약점 유형별 2문제
- 문제 번호는 전체 시험지 기준 순번
- 문제 그림/문제문/답칸 중심
- 화면에서도 종이 시험지처럼 보이게
- 인쇄 버튼
- 정답/풀이 보기 버튼
- 음성 버튼 없음
- 채팅창 없음

학생이 약점 유형 3개를 선택하면 총 6문제 시험지가 생성된다.

---

## 8. 문제은행은 “저장된 문제”보다 “검증된 seed”를 저장한다

실시간 generator를 사용하되, 운영 안정성을 위해 아래 두 방식을 함께 쓸 수 있다.

### A. 실시간 생성

- generator가 seed로 payload 생성
- validator 통과
- renderer 출력

### B. 검증 seed pool

유형/난이도별로 검증을 통과한 seed 목록을 저장한다.

```json
{
  "q01": {
    "easy": [101, 203, 501, 882],
    "same": [1201, 1208, 1330, 1502],
    "hard": [2101, 2230, 2488]
  }
}
```

기본 서비스에서는 검증된 seed pool에서 2개를 뽑아도 된다. 그러면 품질을 보장하면서도 정적 PNG/SVG 문제은행보다 확장성이 높다.

---

## 9. 구현 순서

### Phase 1 — 구조 청소

1. 현재 음성/채팅/AI tutor 실행 경로 목록화
2. 유사문제 화면에서 음성/채팅 기능 분리 또는 비활성화
3. 기존 진단 결과/틀린 번호 데이터가 어디서 나오는지 고정
4. static variation image가 UI에 주입되는 경로 목록화
5. `hf_solution_visuals.js` 의존성 제거 계획 수립

### Phase 2 — q01 진짜 generator

1. q01 canonical을 generator input contract로 정리
2. seeded RNG 도입
3. easy/same/hard generator 작성
4. validator 작성
5. q01 공통 renderer 작성
6. q01 answer renderer 작성
7. 2문제 생성 API 작성

### Phase 3 — 시험지

1. 선택한 약점 유형 배열 입력
2. 각 유형당 난이도 입력
3. 유형당 2문제 생성
4. A4 worksheet renderer
5. 인쇄 CSS
6. 정답/간단 풀이 별도 보기

### Phase 4 — 확장

q01이 완성되고 실제 화면 검수 통과한 뒤 q02 → q03 → ... 순서로 generator를 추가한다.

---

## 10. q01 완료 판정 기준

아래가 전부 되어야 q01을 “완성”으로 본다.

- [ ] static `q01_var01.svg`, `q01_var02.svg`를 선택해서 보여주는 방식이 아님
- [ ] `generateQ01('easy'|'same'|'hard', seed)`가 실제 데이터를 생성함
- [ ] 같은 seed는 같은 문제 재현
- [ ] 다른 seed는 다른 문제 생성
- [ ] 한 번 요청하면 서로 다른 2문제 생성
- [ ] 문제 그림은 payload에서 renderer가 그림
- [ ] 정답은 payload에서 자동 계산
- [ ] 문제 그림과 정답 불일치가 validator에서 차단됨
- [ ] q01 답안은 위에서 본 모양 + 칸별 숫자로 자동 생성
- [ ] A4 시험지에 2문제가 깔끔하게 배치됨
- [ ] 인쇄 가능
- [ ] 음성/채팅 버튼 없음
- [ ] 기존 `main` 미변경

---

## 11. 하지 말아야 할 것

- 문제 1개 만들 때마다 새 SVG/PNG 파일 생성
- q01 전용 DOM hack을 다른 유형까지 복제
- MutationObserver로 문제/풀이를 계속 끼워 넣는 구조 확대
- answer를 그림과 별개로 수동 입력
- easy/same/hard가 같은 문제를 보여주고 라벨만 바꿈
- 난이도를 숫자만 크게/작게 해서 처리
- 음성/AI 채팅 기능을 새 문제은행 흐름에 다시 추가
- 54개 전체를 한 번에 리팩터링
- 사용자 확인 없이 `main` merge

---

## 12. 서비스 경계

### 기본 제공

- 진단
- 약점 유형 표시
- 쉽게/같게/어렵게 선택
- 유형당 2문제
- 맞춤 A4 시험지
- 정답/간단 풀이

### 이후 유료 영역

- 문제 수 확대
- 무제한 재생성
- 누적 오답 관리
- 개인별 자동 문제지
- 성장 분석
- 숙제 배정
- 반/학생 관리
- 상세 리포트

유료 기능은 지금 구현하지 않는다.

---

## 13. 다음 작업자에게 한 줄 지시

**기존 정적 variation SVG를 더 만들지 말고, q01 하나를 seeded generator → validator → renderer → 정답 자동계산 → 약점별 2문제 A4 시험지까지 실제로 작동하게 완성한 뒤 그 구조를 표준으로 삼아라. 음성/채팅은 새 흐름에서 제거한다.**
