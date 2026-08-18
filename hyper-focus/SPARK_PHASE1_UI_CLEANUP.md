# Spark Phase 1 — Hyper Focus UI/음성 구조 정리

목적: q01 generator 구현 전에 현재 `hyper-focus/index.html`의 음성/채팅형 유사문제 흐름을 걷어내고, **진단 → 약점 유형 → 난이도 선택 → 유형당 2문제 → 시험지** 구조로 단순화한다.

## 작업 기준

- 저장소: `docssam1/lete-on`
- 브랜치: `codex/hf-data-replacement`
- `main` 수정/merge 금지
- 상위 인수인계: `hyper-focus/HANDOFF_GENERATOR_REFACTOR.md`
- 이 단계에서는 q02~q54 generator 구현 금지. 화면/런타임 정리와 q01 진입점 준비까지만 한다.

---

## 1. 현재 index.html에서 확인된 제거 대상

### A. 브라우저 음성 합성 제거

현재 코드에 아래 함수가 있다.

```js
function speakSim(btn,text){
  if(!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const utt=new SpeechSynthesisUtterance(text);
  utt.lang='ko-KR';utt.rate=0.9;
  window.speechSynthesis.speak(utt);
}
```

이 함수와 호출 경로를 제거한다.

### B. 유사문제 카드의 `🔊 음성 듣기` 버튼 제거

현재 유사문제 카드 생성부에 아래 구조가 있다.

```js
${audioScript?`<button class="sim-audio-btn" onclick="speakSim(this,...)">🔊 음성 듣기</button>`:''}
```

완전히 제거한다.

### C. `audioScript`를 유사문제 런타임 계약에서 제거

현재 `variationToSimilar()`은 아래처럼 음성 필드를 만든다.

```js
answerStory: variation.solutionHint || item.aiTutorPack?.audioScript || '',
audioScript: variation.solutionHint || item.aiTutorPack?.audioScript || ''
```

새 흐름에서는:

```js
answerStory: variation.solutionHint || ''
```

만 사용한다. `aiTutorPack.audioScript` fallback을 새 유사문제/시험지 런타임에서 참조하지 않는다.

기존 원본 데이터의 `aiTutorPack` 자체는 이번 단계에서 대량 삭제하지 않는다. **실행 경로에서 끊는 것이 먼저다.**

---

## 2. 현재 유사문제 구조에서 유지할 것

현재 `selectedSet`/`wrongIds`를 이용해 학생이 틀린 번호를 저장하고 불러오는 흐름은 유지한다.

유지 대상:

- 로그인/승인번호 흐름
- 틀린 번호 체크 및 `selectedSet`
- `studentHistory[].wrongIds`
- 약점 유형 목록
- 기존 결과 화면의 진단 정보
- 인쇄 기반 기능 자체

즉 **진단 결과를 버리는 리팩터링이 아니다.** 진단 이후의 유사문제 소비 방식을 바꾸는 작업이다.

---

## 3. 현재 난이도 UI의 문제

현재 코드에는:

```js
let currentSimilarDiff='easy';
function setSimilarDiff(diff){
  currentSimilarDiff=diff;
  ...
  renderSimilarList();
}
```

가 있지만, variation을 불러오는 `loadVariationPair(id)`는 사실상 `qNN_var01`, `qNN_var02`를 난이도와 무관하게 로드한다.

따라서 현재 `[쉽게] [같게] [어렵게]`는 **난이도 generator가 아니다.**

Phase 1에서는 난이도 버튼 UI는 남겨도 되지만, 아래 원칙으로 바꾼다.

- 난이도는 각 약점 유형별 선택값으로 저장
- 전역 `currentSimilarDiff` 하나로 전체 유형을 동시에 바꾸는 구조는 폐기 방향
- 최종적으로 `difficultyByQuestion[qid] = 'easy'|'same'|'hard'`
- q01 generator가 준비되기 전에는 “생성” 버튼을 눌러도 정적 PNG/SVG를 새 문제인 것처럼 표시하지 않는다.

---

## 4. 카드형 유사문제 화면을 시험지 생성 준비 화면으로 변경

현재 유사문제 카드에는 다음 요소가 있다.

- 유형 번호/제목
- variation badge
- prompt
- 정적 image
- handwriting SVG
- 음성 버튼
- 정답/풀이 토글

최종 기본 서비스에서는 이 카드 묶음을 메인 결과물로 쓰지 않는다.

대신 진단 결과 아래에 다음의 **약점 유형 선택 패널**만 둔다.

```text
약점 유형

01 쌓기나무 앞·뒤          [쉽게] [같게] [어렵게]
05 보이지 않는 쌓기나무    [쉽게] [같게] [어렵게]
17 도형 세기               [쉽게] [같게] [어렵게]

[맞춤 문제지 만들기]
```

사용자가 버튼을 누르면 별도의 worksheet 영역으로 이동한다.

---

## 5. 새 최소 상태 구조

index.html 또는 분리 JS에서 최소한 아래 상태만 필요하다.

```js
const weaknessIds = [...wrongIds];
const difficultyByQuestion = {};

weaknessIds.forEach(id => {
  difficultyByQuestion[id] = 'same';
});
```

난이도 버튼 클릭 시 해당 qid만 변경한다.

```js
setQuestionDifficulty(qid, difficulty)
```

문제지 생성 버튼은 향후 아래 계약을 호출한다.

```js
buildWorksheet({
  weaknessIds,
  difficultyByQuestion,
  countPerType: 2
})
```

Phase 1에서는 함수 껍데기/진입점까지 만들어도 되지만, q02~q54 정적 파일을 억지로 묶어 완성처럼 보이게 하지 않는다.

---

## 6. 제거/비활성화 우선순위

1. `speakSim()` 제거
2. `sim-audio-btn` 렌더 제거
3. 유사문제 런타임의 `audioScript` 의존 제거
4. `handwritingData`를 새 시험지 런타임에서 사용하지 않도록 분리
5. 정적 `fixedSimilars` / `qNN_var01.svg` / `qNN_var02.svg`를 새 worksheet의 기본 소스로 쓰지 않도록 차단
6. q01 전용 `hf_solution_visuals.js` 삽입을 최종 worksheet 경로에서 제거
7. 기존 진단/틀린 번호 저장은 보존

---

## 7. 인쇄 화면의 목표

기존 전체 해설 인쇄/PDF 기능은 별도 기능으로 두고, 새 맞춤 문제지는 훨씬 단순하게 만든다.

```text
G-FIELD 약점 보완 문제지
학생명 / 날짜

1. [문제]
   [필요한 도형/그림]
   답: __________

2. [문제]
   [필요한 도형/그림]
   답: __________

...

[인쇄]
[정답 및 풀이]
```

- A4 세로
- 약점 유형당 2문제
- 음성 없음
- 채팅 없음
- 실시간 손글씨 없음
- 문제 카드 UI 느낌 최소화

---

## 8. Phase 1 완료 판정

아래를 모두 만족해야 완료다.

- [ ] 유사문제 화면에 `🔊 음성 듣기`가 없다.
- [ ] `speechSynthesis` 실행 코드가 새 런타임에 없다.
- [ ] 유사문제/시험지 생성에서 `aiTutorPack.audioScript`를 사용하지 않는다.
- [ ] 틀린 번호/약점 유형 데이터는 정상 유지된다.
- [ ] 각 약점 유형별로 쉽게/같게/어렵게를 따로 선택할 수 있는 상태 구조가 있다.
- [ ] `맞춤 문제지 만들기` 진입점이 있다.
- [ ] worksheet는 A4 시험지 형태를 목표로 하는 독립 영역이다.
- [ ] 정적 PNG/SVG 2장을 “generator 결과”라고 가장하지 않는다.
- [ ] q01 generator를 연결할 명확한 함수 계약이 준비되어 있다.

---

## 9. 다음 단계 (Phase 2)

Phase 1이 끝난 뒤에만 q01을 실제 generator로 만든다.

```text
generateQ01(difficulty, seed)
  → validateQ01(payload)
  → renderQ01Problem(payload)
  → deriveQ01Answer(payload)
  → renderQ01Answer(payload)
```

한 번의 worksheet 요청에서 서로 다른 seed 2개를 생성하고, 둘 다 validator를 통과해야 한다.

q01이 실제 화면/인쇄까지 검수되기 전에는 q02 이상으로 확장하지 않는다.
