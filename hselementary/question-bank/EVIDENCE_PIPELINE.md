# 황소 초등 문제은행 증거 검수 절차

이 문서는 `evidence-gated-learning-pipeline`, `source-to-memory`, `gfield-single-answer-visibility`, `iterate-until-verified`와 `concept-whiteboard-lesson`에서 이 문제은행에 필요한 규칙만 묶은 실행 계약입니다. 스킬 자체를 복제하거나 모든 문제에 애니메이션을 붙이지 않습니다.

공통 Geometry 모델·SVG·화이트보드 관문은 [`geometry/docs/15_EVIDENCE_GATED_SVG_WORKFLOW.md`](../../geometry/docs/15_EVIDENCE_GATED_SVG_WORKFLOW.md)를 재사용합니다. 이 문서는 황소 초등의 학년·학기, 개념탐구·예제·Mission 한 문항별 유형, 직접 입력·O/X·여러 답 형식과 비공개 교재 근거 연결만 더합니다.

## 작업 계약

- 목표: 원문 문제 한 문항을 하나의 세부 유형으로 구분하고, 같은 수학 행동을 유지한 심화 유사문항만 공개합니다.
- 학습자 단계: 장부마다 학년과 학기를 정확히 적습니다. `초등 4~6학년`처럼 여러 단계를 한 장부에 섞지 않습니다.
- 근거: 원문과 답안은 `source-to-memory`의 검증된 기록과 정확한 위치로 찾습니다. 파일명, OCR, 손글씨, 예전 인수인계는 찾기 단서일 뿐 정답 근거가 아닙니다.
- 제외: 원본 페이지, 답안 내용, 비공개 절대 경로를 공개 저장소나 장부에 넣지 않습니다.
- 승인 경계: 검수 통과는 `eligible`입니다. 사용자가 공개 또는 main 반영을 승인해야 `approved`, 실제 배포를 다시 읽어 확인해야 `published`입니다.
- 완료: 원본 구조, 유형 구분, 정답 유일성, 학년 적합성, 표기, 도형 가시성, PC·모바일·A4와 회귀 검사가 모두 통과해야 합니다.

## 문항 결과 형식

생성기를 만들기 전에 답의 형식을 먼저 고정합니다.

- `single-value`: 수 하나, 각도 하나, O/X 하나처럼 답이 하나인 문항
- `ordered`: 순서까지 답인 문항
- `set`: 순서와 관계없는 여러 답을 모두 쓰는 문항
- `range`: 조건을 만족하는 범위
- `rubric`: 풀이 설명처럼 표현은 달라도 채점 기준이 있는 문항
- `provisional`: 원문 또는 답안이 부족해 아직 확정할 수 없는 문항. 공개하지 않습니다.

그림 문항에 O/X 버튼을 쓰더라도 그림에서 정답이 하나로 결정되어야 합니다. 여러 값을 쓰는 문항은 입력 칸 모양만 보고 답의 개수를 미리 알 수 없게 하며, 장부에는 `ordered` 또는 `set`을 정확히 기록합니다.

## 필수 검수표

| 게이트 ID | 확인 방법 | 통과 조건 |
| --- | --- | --- |
| `source-shape` | 원문과 답안의 검증된 위치를 직접 대조 | 조건, 그림 관계, 질문, 답의 형식이 일치 |
| `type-identity` | 개념탐구·예제·Mission 문항 ID와 생성기 연결 감사 | 원문 한 문항이 고유 유형 하나이며 겹치는 복제 유형이 없음 |
| `answer-determinacy` | 생성기와 다른 계산 또는 가능한 답 전수 열거 | 계약한 답 후보가 정확히 하나이거나 계약한 집합과 정확히 일치 |
| `learner-fit` | 해당 학년·학기 기준의 별도 감사 | 언어, 표현, 선수 개념, 생각 단계, 답하는 방법이 모두 맞음 |
| `geometry-visibility` | 점·선분 자료 역산과 실제 화면 확인 | 각호, 길이, 눈금, 방향, 가려진 부분을 학생이 하나로 읽을 수 있음 |
| `notation` | 공통 수식·단위 감사 | 분수·대분수·넓이·부피·치수 표기가 같은 규칙으로 읽힘 |
| `desktop-mobile-a4` | PC, 375px 모바일, 실제 A4 PDF 확인 | 잘림·겹침이 없고 인쇄된 마지막 화면만으로도 문제와 풀이가 성립 |
| `rights` | 공개 파일과 장부 내용 감사 | 원본 이미지·답안·비공개 경로를 공개하지 않음 |
| `regression` | 관련 단원 감사와 전체 생성 가능성 감사 | 바뀐 유형과 기존 공개 유형이 모두 다시 통과 |

시각 자료가 없는 문항은 `geometry-visibility`를 선택 게이트로 둘 수 있지만 `learner-fit`은 모든 학생용 문항에 반드시 둡니다. `learner-fit` 증거에는 장부의 학습자 단계와 아래 다섯 기준을 그대로 적습니다.

- `language`
- `representations`
- `prerequisites`
- `reasoning-load`
- `response-mode`

## 상태 규칙

세 상태를 섞지 않습니다.

- 작업: `pending`, `in-progress`, `complete`, `blocked`
- 근거: `draft`, `verified`, `conflict`, `stale`, `superseded`, `excluded`
- 공개: `locked`, `eligible`, `approved`, `published`, `revoked`

원문 지문, 답안, 위치, 생성기, 검수 기준 중 하나가 바뀌면 관련 근거를 `stale`, 공개 상태를 `locked`로 되돌리고 영향받는 검사를 다시 합니다. 답이 여러 개이거나 그림을 여러 방식으로 읽을 수 있으면 설명으로 덮지 않고 `검수 대기`로 잠급니다.

## 도형과 수식

- 저장소의 기존 Geometry 자료와 SVG 렌더러를 먼저 찾고 재사용합니다.
- 중요한 좌표는 눈대중으로 적지 않습니다. 점, 선분, 각, 면, 칸, 접은 선, 시선 방향을 자료로 두고 SVG를 계산합니다.
- 생성된 SVG에서 각도, 평행, 수직, 길이, 눈금 위치를 역산해 생성 자료와 비교합니다.
- 답을 결정하는 각에는 꼭짓점과 두 변 사이를 잇는 각호 또는 각 영역을 표시합니다.
- 분수·대분수·넓이·부피·치수는 `math-notation.js`의 공통 표기를 사용합니다.

## 풀이 보기 장면

`concept-whiteboard-lesson`은 풀이 순서 자체가 배울 내용일 때만 사용합니다. 완성된 정적 그림을 반짝이게 하는 용도로 쓰지 않습니다.

1. 생성기가 계산한 의미 자료를 `scene`으로 다시 내보냅니다. 지문이나 TeX 문자열을 되읽어 숫자를 뽑지 않습니다.
2. 한 단계에는 새 대상 하나만 그립니다. 다음 단계가 시작되면 이전 강조를 지웁니다.
3. 좌표는 기존 Geometry 점·선분 모델에서 계산합니다.
4. 마지막 정지 화면만 인쇄해도 풀이 순서가 이해되어야 합니다.
5. 음성은 선택 기능이며 자막과 그림만으로도 이해되어야 합니다.
6. PC·모바일·A4, 원문 구조, 한 곳에 모이는 시선, 단일 정답을 확인하고 검사가 실제 오류를 잡는지 대조값 하나를 일부러 깨뜨려 확인합니다.

정적 사실이나 한 번의 계산만 묻는 유형은 현재 문제·풀이 화면을 유지합니다. 풀이 장면을 추가하는 일은 별도 작업이며, 장면이 없다는 이유로 검증된 정적 문항을 잠그지 않습니다.

## 장부 사용

공개 저장소의 `.evidence-pipeline/pipeline.json`에는 근거 ID와 검수 파일 위치만 기록합니다. 비공개 원문은 가장 가까운 source-memory 카탈로그에서 따로 확인합니다.

```powershell
python "$env:USERPROFILE\.agents\skills\evidence-gated-learning-pipeline\scripts\pipeline_gate.py" check hselementary/question-bank/.evidence-pipeline/pipeline.json --public
python "$env:USERPROFILE\.agents\skills\evidence-gated-learning-pipeline\scripts\pipeline_gate.py" summary hselementary/question-bank/.evidence-pipeline/pipeline.json
```

장부에 적힌 검수 파일도 실제로 실행해야 합니다. 장부 검사가 통과했다는 사실만으로 문항 검수가 끝난 것은 아닙니다.
