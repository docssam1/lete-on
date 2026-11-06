import{withElectricityReadableWorkbook}from'./c22-s62-u03.editorial.js?v=20261106-electricity-readable-workbook';
import{withGuidanceParticles}from'./term-particle-language.js?v=20261105-guidance-particles';
import{withTermParticleLanguage}from'./term-particle-language.js';
import{withLearnerExplanations}from'./learner-explanations.js';
import{withStudentScienceLanguage}from'./student-science-language.js';
import{withElectricityEditorial}from'./c22-s62-u03.editorial.js?v=20261104-electricity-book';
// 독립128문항 정식 교재. scripts/gen-science-workbook-c22s62u03.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s62-u03",
 "title": "전기의 이용",
 "semester": "6-2",
 "no": 3,
 "theme": "#2456c4",
 "book": "지필드 교과 연결 사고력",
 "richText": true,
 "questions": [
  {
   "id": "c22-s62-u03-w001",
   "no": 1,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T01",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "전구의 두 접점을 구별한 기록을 고르세요.",
   "answer": "③ 옆 금속과 바닥 금속을 나눈다.",
   "explanation": "전구의 두 금속 접점은 옆과 바닥에 따로 있다. 유리·색을 접점으로 바꾸거나 전구를 뜯을 필요가 없다. 서로 다른 접점을 각각 연결할 수 있도록 구별한 기록이 맞다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "유리와 종이 이름만 접점으로 적는다.",
    "옆 금속과 바닥 금속을 한 점으로 센다.",
    "옆 금속과 바닥 금속을 나눈다.",
    "전구 표면의 색 두 가지를 극으로 정한다.",
    "필라멘트를 꺼내 접점을 없애고 잇는다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "givens": "분해하지 않은 정상 필라멘트 전구의 겉을 살핀다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 옆 금속과 바닥 금속을 나눈다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "given": [
    "분해하지 않은 정상 필라멘트 전구의 겉을 살핀다."
   ]
  },
  {
   "id": "c22-s62-u03-w002",
   "no": 2,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T01",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "전지 끼우개를 설명한 문장으로 알맞은 것을 고르세요.",
   "answer": "① 전지를 고정하고 단자 연결을 돕는다.",
   "explanation": "전지 끼우개는 전지를 고정하고 두 극을 회로에 연결하기 쉽게 한다. 전지를 대신해 전기를 만들거나 전구 정격을 바꾸는 부품은 아니다. 고정과 접속이라는 역할을 함께 읽는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "전지를 고정하고 단자 연결을 돕는다.",
    "전지 없이 필요한 전기를 계속 만든다.",
    "전구 대신 빛을 내어 방을 밝힌다.",
    "전지의 두 극을 늘 한 점으로 합친다.",
    "모든 전구의 정격을 자동으로 바꾼다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ① 전지를 고정하고 단자 연결을 돕는다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요."
  },
  {
   "id": "c22-s62-u03-w003",
   "no": 3,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T01",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "보기 “전류·전기 회로”로 두 칸을 채우세요. (1)전기가 흐르는 것 (2)부품을 이어 만든 길",
   "answer": "전류 / 전기 회로",
   "explanation": "흐름의 이름은 전류이고 연결된 길의 이름은 전기 회로이다. 현상과 길을 서로 바꾸어 쓰면 뜻이 달라진다. 보기의 두 용어를 설명 순서에 맞게 대응한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "전류"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "전기 회로",
       "전기회로"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 전류 / (2) 전기 회로 또는 전기회로. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w004",
   "no": 4,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T03",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "전선 안쪽 구리는 (1)이 잘 통하고, 바깥의 절연 피복은 뜻하지 않은 (2)을 막는 데 쓰여요. 보기: 전기·접촉",
   "answer": "전기 / 접촉",
   "explanation": "안쪽 금속은 전기가 흐를 길을 만들고 절연 피복은 뜻하지 않은 접촉을 줄인다. 전선 전체가 같은 전기적 성질이라는 뜻은 아니다. 정상 피복만으로 모든 사용 환경에서 안전이 보장되는 것도 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "전기"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "접촉",
       "금속 접촉"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 전기 / (2) 접촉 또는 금속 접촉. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w005",
   "no": 5,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T01",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "부품과 직접 역할을 연결해 기호를 쓰세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "전지는 공급, 전구는 발광, 스위치는 연결 제어의 역할이다. 따라서 ㄴ·ㄷ·ㄱ 순서이다. 부품이 같은 회로에 있다는 사실과 각 부품의 직접 역할을 구별한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 교육용 전지",
    "(2) 필라멘트 전구",
    "(3) 스위치"
   ],
   "options": [
    "ㄱ 길을 열고 닫는다.",
    "ㄴ 전기를 공급한다.",
    "ㄷ 전기로 빛을 낸다."
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "given": [
    "ㄱ 길을 열고 닫는다.",
    "ㄴ 전기를 공급한다.",
    "ㄷ 전기로 빛을 낸다."
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w006",
   "no": 6,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T15",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "실물 확인과 남길 자료를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "두 접점은 위치 스케치, 설명서 조건은 규격 메모, 아직 확인하지 않은 결과는 예상으로 남긴다. ㄷ·ㄱ·ㄴ이 알맞다. 자료 종류를 구분해야 예상을 실제 관찰로 바꾸지 않게 된다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 겉에서 찾은 두 접점",
    "(2) 기구 설명서의 허용 조건",
    "(3) 아직 만지지 않은 회로 예상"
   ],
   "options": [
    "ㄱ 규격 확인 메모",
    "ㄴ 예상이라고 표시한 말",
    "ㄷ 접점 위치 스케치"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "given": [
    "ㄱ 규격 확인 메모",
    "ㄴ 예상이라고 표시한 말",
    "ㄷ 접점 위치 스케치"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w007",
   "no": 7,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T01",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "교사가 정한 “전원 분리→두 접점 확인→연결 점검” 기준대로 기호를 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "먼저 전원을 분리한 ㄷ, 접점을 찾는 ㄱ, 연결을 점검받는 ㄴ이다. 기구를 켠 채 접점을 만지는 절차로 바꾸지 않는다. 가능한 모든 준비 순서가 아니라 제시한 기준을 읽는 문제이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 두 금속 접점을 겉에서 찾는다.",
    "ㄴ 연결을 교사에게 점검받는다.",
    "ㄷ 전지와 분리되어 있는지 확인한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "given": [
    "ㄱ 두 금속 접점을 겉에서 찾는다.",
    "ㄴ 연결을 교사에게 점검받는다.",
    "ㄷ 전지와 분리되어 있는지 확인한다."
   ]
  },
  {
   "id": "c22-s62-u03-w008",
   "no": 8,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T15",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "설명 카드의 작업 순서 “실물 확인→위치 표시→역할 설명”에 맞게 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "실물을 살핀 ㄴ을 바탕으로 ㄷ의 위치를 표시한 뒤 ㄱ의 역할을 설명한다. 먼저 지어낸 위치를 사실처럼 표시하지 않는다. 실제 확인을 근거로 설명을 만드는 순서이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 스케치의 이름표와 역할을 연결해 쓴다.",
    "ㄴ 교사가 제공한 실물을 겉에서 살핀다.",
    "ㄷ 확인한 두 접점에 이름표를 붙인다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄷ → ㄱ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "given": [
    "ㄱ 스케치의 이름표와 역할을 연결해 쓴다.",
    "ㄴ 교사가 제공한 실물을 겉에서 살핀다.",
    "ㄷ 확인한 두 접점에 이름표를 붙인다."
   ]
  },
  {
   "id": "c22-s62-u03-w009",
   "no": 9,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T01",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "부품의 역할을 바르게 말한 것을 고르세요. (정답 3개)",
   "answer": "①, ②, ⑤",
   "explanation": "공급·연결 제어·발광을 각각 전지·스위치·전구와 연결한 세 문장이 맞다. 피복은 공급 장치가 아니며 끼우개가 서로 다른 접점을 합치게 해서는 안 된다. 각 역할을 실제 부품에 대응한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "스위치는 길의 연결을 제어한다.",
    "전구는 전기로 빛을 낼 수 있다.",
    "전선의 피복이 전기를 만들어 낸다.",
    "끼우개는 모든 접점을 하나로 합친다.",
    "전지는 회로에 전기를 공급한다."
   ],
   "key": [
    0,
    1,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     1,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ⑤. 선택한 순서는 관계없다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요."
  },
  {
   "id": "c22-s62-u03-w010",
   "no": 10,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T03",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "접점을 관찰한 메모로 타당한 것을 고르세요. (정답 3개)",
   "answer": "③, ④, ⑤",
   "explanation": "두 금속 접점, 피복과 금속, 유리와 금속의 구별은 실제 접속 판단에 필요하다. 색만으로 단자 극을 정하거나 한 부품의 모든 재료가 같다고 볼 수는 없다. 전기가 통할 접촉 부분을 기준으로 읽는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "전선의 색만 보고 전지 극을 결정한다.",
    "모든 재료는 한 부품이면 같은 성질이다.",
    "옆 금속과 바닥 금속은 따로 구별한다.",
    "집게가 피복에 닿는지 금속에 닿는지 본다.",
    "전구 유리는 금속 접점과 구별한다."
   ],
   "key": [
    2,
    3,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     2,
     3,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ③, ④, ⑤. 선택한 순서는 관계없다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요."
  },
  {
   "id": "c22-s62-u03-w011",
   "no": 11,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T15",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "표에서 (1)금속 접점 수 (2)금속 접점이 아닌 부분 수를 단위와 함께 쓰세요.",
   "answer": "2개 / 2개",
   "explanation": "금속 접점으로 분류한 것은 옆·바닥 두 곳이고 다른 두 곳은 접점이 아니다. 따라서2개·2개이다. 같은 전구에서 네 부분의 위치와 전기적 역할을 나누어 센 값이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "부분",
     "분류"
    ],
    "행": [
     [
      "옆 금속",
      "금속 접점"
     ],
     [
      "바닥 금속",
      "금속 접점"
     ],
     [
      "유리",
      "접점 아님"
     ],
     [
      "사이의 절연 부분",
      "접점 아님"
     ]
    ]
   },
   "verificationModel": {
    "kind": "contact-part-counts",
    "model": "contacts"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 2개 (단위 필요) / (2) 2개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-11"
  },
  {
   "id": "c22-s62-u03-w012",
   "no": 12,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T15",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "카드에서 (1)실제 겉모양 관찰 (2)아직 확인하지 않은 예상을 가리키는 기호를 쓰세요.",
   "answer": "ㄱ / ㄴ",
   "explanation": "실물을 보고 위치를 표시한 ㄱ은 관찰이다. 연결 전에 켜질 것이라고 쓴 ㄴ은 예상이다. ㄷ의 설명서 읽기는 참고 자료 확인으로 실제 켜짐 관찰과 구별한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "기호",
     "메모"
    ],
    "행": [
     [
      "ㄱ",
      "실물을 보고 옆·바닥 금속의 위치를 표시함"
     ],
     [
      "ㄴ",
      "아직 연결하지 않고 켜질 것이라고 적음"
     ],
     [
      "ㄷ",
      "설명서에서 전구 정격을 읽음"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-12"
  },
  {
   "id": "c22-s62-u03-w013",
   "no": 13,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T01",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "“끼우개가 없으니 어떤 연결도 켜질 수 없다”는 말을 검토하세요.",
   "answer": "정상 전구의 두 금속 접점이 전지의 서로 다른 극에 정확히 닿으면 끼우개 없이도 켜질 수 있다. 끼우개는 고정과 접속을 돕지만 켜짐의 유일한 조건은 아니다.",
   "explanation": "끼우개 유무만 세면 직접 닿는 금속 접촉을 놓친다. 조건에 맞는 접속 관계라면 켜질 수 있다. 실제 구성은 교사가 안정된 접점과 정격을 확인한 모형에서 한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "서로 다른 두 접점·전지 극을 설명한다.",
    "끼우개의 역할과 필수 접속 조건을 구별한다.",
    "직접 금속 접촉도 연결임을 인정한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "정상 전구의 두 금속 접점이 전지의 서로 다른 극에 정확히 닿으면 끼우개 없이도 켜질 수 있다. 끼우개는 고정과 접속을 돕지만 켜짐의 유일한 조건은 아니다.",
    "required": [
     "서로 다른 두 접점·전지 극을 설명한다.",
     "끼우개의 역할과 필수 접속 조건을 구별한다.",
     "직접 금속 접촉도 연결임을 인정한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "서로 다른 두 접점·전지 극을 설명한다. / 끼우개의 역할과 필수 접속 조건을 구별한다. / 직접 금속 접촉도 연결임을 인정한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w014",
   "no": 14,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T03",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "“겉이 플라스틱이니 전선 안에도 전기가 통하지 않는다”는 설명을 고쳐 쓰세요.",
   "answer": "한 전선에도 구리와 절연 피복처럼 다른 재료가 있다. 안쪽 금속은 전기가 흐를 길이고 피복은 접촉을 줄이므로 겉 재료만으로 속 성질을 정하지 않는다.",
   "explanation": "겉 피복을 본 정보는 전선 내부 금속의 성질까지 같다는 증거가 아니다. 재료와 역할을 나누어 설명해야 한다. 속을 확인하려고 학생이 실제 피복을 훼손하는 과제로 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "금속과 피복을 구별한다.",
    "전도·절연의 역할 차이를 설명한다.",
    "겉모양만으로 전체 성질을 단정하지 않는다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "한 전선에도 구리와 절연 피복처럼 다른 재료가 있다. 안쪽 금속은 전기가 흐를 길이고 피복은 접촉을 줄이므로 겉 재료만으로 속 성질을 정하지 않는다.",
    "required": [
     "금속과 피복을 구별한다.",
     "전도·절연의 역할 차이를 설명한다.",
     "겉모양만으로 전체 성질을 단정하지 않는다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "금속과 피복을 구별한다. / 전도·절연의 역할 차이를 설명한다. / 겉모양만으로 전체 성질을 단정하지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w015",
   "no": 15,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T15",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "분해하지 않은 전구의 겉을 크게 그리고 두 접점과 유리를 표시하세요. 연결선은 아직 그리지 마세요.",
   "answer": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
   "explanation": "그림의 예쁜 정도보다 접점 두 곳과 비접점 부분의 구별을 본다. 이 위치를 알아야 이후 연결을 설명할 수 있다. 전구의 겉 접점을 그리는 것으로 실제 회로 구성까지 완료한 것은 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "두 금속 접점 위치를 구별한다.",
    "유리와 접점을 나눈다.",
    "내부를 뜯어 본 그림이나 색으로 극을 지어내지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
    "required": [
     "두 금속 접점 위치를 구별한다.",
     "유리와 접점을 나눈다.",
     "내부를 뜯어 본 그림이나 색으로 극을 지어내지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "두 금속 접점 위치를 구별한다. / 유리와 접점을 나눈다. / 내부를 뜯어 본 그림이나 색으로 극을 지어내지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w016",
   "no": 16,
   "section": 1,
   "sectionTitle": "전구의 두 접점을 찾아요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T15",
   "topic": "전구의 두 접점을 찾아요",
   "prompt": "전지·전구·스위치·전선의 “역할 지도”를 그리세요. 각 부품 그림이나 이름 옆에 직접 역할을 짧게 쓰세요.",
   "answer": "공급하는 전지·빛을 내는 전구·연결을 여닫는 스위치·접점을 잇는 전선을 구별한다. 설명 화살표는 역할 연결임을 표시한다.",
   "explanation": "역할 지도는 부품의 기능을 설명하는 표현이다. 실제 전기적 결선과는 구분한다. 그림 이름만 적은 것보다 기능과 부품의 대응이 드러나는지 교사가 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "네 부품을 구별한다.",
    "각 직접 역할을 연결한다.",
    "역할 화살표를 실제 결선이나 측정 결과로 표시하지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "공급하는 전지·빛을 내는 전구·연결을 여닫는 스위치·접점을 잇는 전선을 구별한다. 설명 화살표는 역할 연결임을 표시한다.",
    "required": [
     "네 부품을 구별한다.",
     "각 직접 역할을 연결한다.",
     "역할 화살표를 실제 결선이나 측정 결과로 표시하지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "네 부품을 구별한다. / 각 직접 역할을 연결한다. / 역할 화살표를 실제 결선이나 측정 결과로 표시하지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w017",
   "no": 17,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T02",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "표의 연결에서 켜질 수 있는 기호만 바르게 묶은 것을 고르세요.",
   "answer": "④ ㄱ과 ㄹ",
   "explanation": "ㄱ과 ㄹ은 전지 양극이 전구의 두 금속 접점에 각각 이어진다. ㄴ은 같은 전지 단자에만 이어지고 ㄷ은 유리에만 닿는다. 전구를 거치는 실제 접속 관계로 두 개를 고른다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "ㄱ과 ㄴ",
    "ㄴ과 ㄷ",
    "ㄷ과 ㄹ",
    "ㄱ과 ㄹ",
    "ㄴ과 ㄹ"
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "table": {
    "머리": [
     "기호",
     "전구 옆 금속 쪽",
     "전구 바닥 금속 쪽"
    ],
    "행": [
     [
      "ㄱ",
      "전지 +극",
      "전지 −극"
     ],
     [
      "ㄴ",
      "전지 +극",
      "전지 +극"
     ],
     [
      "ㄷ",
      "전지 +극",
      "집게가 바닥 대신 유리에만 닿음"
     ],
     [
      "ㄹ",
      "전지 −극",
      "전지 +극"
     ]
    ]
   },
   "givens": "전구의 옆·바닥 금속은 서로 다른 접점이다. 정상 전지 한 개·필라멘트 전구이며 적힌 접촉만 있다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ ㄱ과 ㄹ",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "전구의 옆·바닥 금속은 서로 다른 접점이다. 정상 전지 한 개·필라멘트 전구이며 적힌 접촉만 있다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "figure": "electricity-question-data-17"
  },
  {
   "id": "c22-s62-u03-w018",
   "no": 18,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T04",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "같은 회로에서 스위치를 열자 꺼졌습니다. 직접 바뀐 조건을 고르세요.",
   "answer": "② 전류가 흐를 길의 연결 여부",
   "explanation": "스위치를 여는 조작은 길의 한 부분을 끊는다. 전지 이름이나 재료를 바꾼 것이 아니다. 다른 부품을 유지한 조건에서 연결 여부와 꺼짐을 이어 설명한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "전지 겉면에 인쇄된 이름",
    "전류가 흐를 길의 연결 여부",
    "전구 유리의 물질 종류",
    "전선 안쪽 금속의 종류",
    "전구를 비추는 방의 천장 높이"
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "givens": "전지·전구·전선과 접점은 그대로이며 다른 고장은 없다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 전류가 흐를 길의 연결 여부",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "전지·전구·전선과 접점은 그대로이며 다른 고장은 없다."
   ]
  },
  {
   "id": "c22-s62-u03-w019",
   "no": 19,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T02",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "전구 옆·바닥 금속은 전지의 (1) 극에 각각 이어져야 하고, 전구를 거쳐 돌아오는 길은 (2) 않아야 해요. 보기: 서로 다른·끊어지지",
   "answer": "서로 다른 / 끊어지지",
   "explanation": "전구 두 접점은 전지의 서로 다른 극에 연결해야 한다. 그 길이 중간에 끊기지 않아야 켜질 수 있다. 같은 단자에만 이어 놓은 겉의 닫힌 모양과 이 조건을 혼동하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "서로 다른",
       "다른"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "끊어지지"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 서로 다른 또는 다른 / (2) 끊어지지. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w020",
   "no": 20,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T03",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "전선 집게가 (1) 피복에만 닿은 경우보다 (2) 접점에 정확히 닿아야 연결을 만들 수 있어요. 보기: 절연·금속",
   "answer": "절연 / 금속",
   "explanation": "절연 피복은 접촉을 통한 전류의 길을 만들기 위한 부분이 아니다. 금속 접점끼리 닿아야 해당 연결을 만들 수 있다. 전선 이름보다 실제로 닿은 재료를 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "절연",
       "플라스틱"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "금속"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 절연 또는 플라스틱 / (2) 금속. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w021",
   "no": 21,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T02",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "연결 상태와 설명을 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "빈 구간인 ㄴ, 같은 단자 연결인 ㄷ, 정상 접속인 ㄱ 순서이다. 꺼진 두 연결도 원인이 같지는 않다. 빈 곳을 잇는 수정과 단자를 옮기는 수정을 구별한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 집게 한 끝이 떨어져 있음",
    "(2) 전구 양쪽이 같은 전지 단자에만 이어짐",
    "(3) 전구 두 접점이 전지 양극에 이어짐"
   ],
   "options": [
    "ㄱ 정상이라면 켜질 수 있는 연결",
    "ㄴ 돌아오는 길에 빈 구간이 있음",
    "ㄷ 전지의 서로 다른 두 극을 쓰지 않음"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "ㄱ 정상이라면 켜질 수 있는 연결",
    "ㄴ 돌아오는 길에 빈 구간이 있음",
    "ㄷ 전지의 서로 다른 두 극을 쓰지 않음"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w022",
   "no": 22,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T03",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "접촉 재료와 기록할 항목을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "구리는 잘 통하는 재료, 플라스틱은 제시된 절연 재료 조건으로 분류한다. 아직 접촉하지 않은 결과는 ㄴ이다. 예상한 켜짐·꺼짐을 실제 관찰란에 대신 쓰지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 깨끗한 구리 조각을 댐",
    "(2) 마른 플라스틱 조각을 댐",
    "(3) 접촉하지 않아 아직 못 봄"
   ],
   "options": [
    "ㄱ 절연 재료 조건의 관찰",
    "ㄴ 미관찰로 남긴 상태",
    "ㄷ 전기가 잘 통하는 재료 조건의 관찰"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "givens": "교사가 전구를 거치는 같은 시험 회로를 준비하고 다른 조건을 맞췄다. 전지 양극에 재료를 직접 대지 않는다.",
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "교사가 전구를 거치는 같은 시험 회로를 준비하고 다른 조건을 맞췄다. 전지 양극에 재료를 직접 대지 않는다.",
    "ㄱ 절연 재료 조건의 관찰",
    "ㄴ 미관찰로 남긴 상태",
    "ㄷ 전기가 잘 통하는 재료 조건의 관찰"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w023",
   "no": 23,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T04",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "연결 수정을 위한 기준 “전원 분리→금속 접점 수정→교사 점검” 순서로 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "먼저 전원을 분리한 ㄷ을 해야 한다. 금속 접점에 닿게 수정한 ㄱ 뒤 점검받는 ㄴ으로 이어진다. 켠 채로 접점을 바꾸어 결과를 시험하는 순서가 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 전구 바닥 금속에 집게가 닿게 고친다.",
    "ㄴ 교사에게 접속 관계를 확인받는다.",
    "ㄷ 전지와 분리하고 스위치를 연다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "ㄱ 전구 바닥 금속에 집게가 닿게 고친다.",
    "ㄴ 교사에게 접속 관계를 확인받는다.",
    "ㄷ 전지와 분리하고 스위치를 연다."
   ]
  },
  {
   "id": "c22-s62-u03-w024",
   "no": 24,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T03",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "교사가 정한 재료 비교 절차 “처음 조건 확인→한 재료 비교→전원 분리 뒤 다음 재료”에 맞게 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "처음 조건을 맞추는 ㄴ, 첫 재료를 관찰하는 ㄷ, 분리 뒤 교체하는 ㄱ 순서다. 재료 외의 조건을 같이 바꾸면 결과의 이유를 해석하기 어려워진다. 실제 통전 시간은 교사가 정한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 전원을 분리하고 다음 재료로 바꾼다.",
    "ㄴ 같은 전구·접촉 위치·처음 상태를 확인한다.",
    "ㄷ 점검받은 첫 재료를 잠깐 관찰한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄷ → ㄱ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "ㄱ 전원을 분리하고 다음 재료로 바꾼다.",
    "ㄴ 같은 전구·접촉 위치·처음 상태를 확인한다.",
    "ㄷ 점검받은 첫 재료를 잠깐 관찰한다."
   ]
  },
  {
   "id": "c22-s62-u03-w025",
   "no": 25,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T02",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "표의 연결을 바르게 해석한 문장을 고르세요. (정답 3개)",
   "answer": "①, ②, ⑤",
   "explanation": "ㄱ과 ㄹ은 정상 접점 연결이고 ㄴ은 같은 단자 연결이다. 필라멘트 전구는 이 조건에서 방향이 바뀌어도 켜질 수 있다. ㄷ의 유리는 금속 접점을 대신하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "ㄱ은 전지의 서로 다른 두 극을 쓴다.",
    "ㄴ은 전구 양쪽이 같은 단자에만 이어진다.",
    "ㄷ의 유리 접촉도 금속 접점과 같다.",
    "ㄹ은 연결 방향이 반대라 절대 켜지지 않는다.",
    "ㄹ도 정상 필라멘트 전구를 켤 수 있다."
   ],
   "key": [
    0,
    1,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     1,
     4
    ]
   },
   "table": {
    "머리": [
     "기호",
     "전구 옆 금속 쪽",
     "전구 바닥 금속 쪽"
    ],
    "행": [
     [
      "ㄱ",
      "전지 +극",
      "전지 −극"
     ],
     [
      "ㄴ",
      "전지 +극",
      "전지 +극"
     ],
     [
      "ㄷ",
      "전지 +극",
      "집게가 바닥 대신 유리에만 닿음"
     ],
     [
      "ㄹ",
      "전지 −극",
      "전지 +극"
     ]
    ]
   },
   "givens": "전구의 옆·바닥 금속은 서로 다른 접점이다. 정상 전지 한 개·필라멘트 전구이며 적힌 접촉만 있다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ⑤. 선택한 순서는 관계없다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "전구의 옆·바닥 금속은 서로 다른 접점이다. 정상 전지 한 개·필라멘트 전구이며 적힌 접촉만 있다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "figure": "electricity-question-data-25"
  },
  {
   "id": "c22-s62-u03-w026",
   "no": 26,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T03",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "재료 하나의 영향만 비교하는 계획을 고르세요. (정답 3개)",
   "answer": "①, ③, ④",
   "explanation": "전구·전지와 접촉 방법·관찰 시점을 맞춘 계획이 타당하다. 전지 수까지 바꾸면 재료의 영향만 비교할 수 없다. 아직 보지 않은 결과를 미리 채우는 것도 관찰이 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "접점 위치와 누르는 방법을 맞춘다.",
    "먼저 결과를 정하고 표를 그대로 채운다.",
    "같은 시점과 시간으로 관찰한다.",
    "전구와 전지를 같은 것으로 유지한다.",
    "재료와 전지 수를 동시에 바꾼다."
   ],
   "key": [
    0,
    2,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     2,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ④. 선택한 순서는 관계없다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요."
  },
  {
   "id": "c22-s62-u03-w027",
   "no": 27,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T02",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "연결표에서 (1)켜질 수 있는 카드 수 (2)그렇지 않은 카드 수를 쓰세요.",
   "answer": "2개 / 2개",
   "explanation": "ㄱ과 ㄹ 두 개가 조건에 맞고 ㄴ·ㄷ 두 개가 맞지 않는다. ㄴ은 같은 단자, ㄷ은 유리 접촉이라는 서로 다른 이유가 있다. 모두를 한 가지 끊어진 원인으로 묶지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "기호",
     "전구 옆 금속 쪽",
     "전구 바닥 금속 쪽"
    ],
    "행": [
     [
      "ㄱ",
      "전지 +극",
      "전지 −극"
     ],
     [
      "ㄴ",
      "전지 +극",
      "전지 +극"
     ],
     [
      "ㄷ",
      "전지 +극",
      "집게가 바닥 대신 유리에만 닿음"
     ],
     [
      "ㄹ",
      "전지 −극",
      "전지 +극"
     ]
    ]
   },
   "givens": "전구의 옆·바닥 금속은 서로 다른 접점이다. 정상 전지 한 개·필라멘트 전구이며 적힌 접촉만 있다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "verificationModel": {
    "kind": "lamp-state-counts",
    "model": "circuits"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 2개 (단위 필요) / (2) 2개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "given": [
    "전구의 옆·바닥 금속은 서로 다른 접점이다. 정상 전지 한 개·필라멘트 전구이며 적힌 접촉만 있다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-27"
  },
  {
   "id": "c22-s62-u03-w028",
   "no": 28,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T02",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "표에서 돌아오는 길을 완성하려면 (1)전구 쪽 (2)전지 쪽 중 어느 끝을 이어야 하는지 순서대로 쓰세요.",
   "answer": "전구 바닥 금속 / 전지 −극",
   "explanation": "이미 이어진 구간은 유지하고 떨어진 바닥 금속과 전지 −극을 잇는다. 이때 전구를 거쳐 돌아오는 길이 완성된다. 전구를 건너뛰어 전지 두 극을 전선만으로 직접 잇는 수정은 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "전구 바닥 금속",
       "바닥 금속",
       "전구 바닥 접점"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "전지 −극",
       "전지 -극",
       "−극",
       "-극"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "이미 이어진 곳",
     "아직 떨어진 두 끝"
    ],
    "행": [
     [
      "전지 +극→닫힌 스위치→전구 옆 금속",
      "전구 바닥 금속 / 전지 −극"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 전구 바닥 금속 또는 바닥 금속 또는 전구 바닥 접점 / (2) 전지 −극 또는 전지 -극 또는 −극 또는 -극. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-28"
  },
  {
   "id": "c22-s62-u03-w029",
   "no": 29,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T02",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "“동그란 선이니 닫힌 회로이고 반드시 켜진다”는 설명에 빠진 조건을 쓰세요.",
   "answer": "선의 모양만으로는 충분하지 않다. 전구의 두 금속 접점이 전지의 서로 다른 극으로 이어졌는지, 실제 접촉과 빈 구간을 확인해야 한다.",
   "explanation": "같은 단자에만 연결해도 겉 선을 동그랗게 그릴 수 있다. 실제 전기적 접속과 정상 부품·정격을 확인해야 한다. 그림의 모양을 조건 확인의 근거로 대신하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "겉모양과 접속 관계를 구별한다.",
    "두 접점·서로 다른 전지 극을 설명한다.",
    "접촉 상태와 빈 구간을 확인한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "선의 모양만으로는 충분하지 않다. 전구의 두 금속 접점이 전지의 서로 다른 극으로 이어졌는지, 실제 접촉과 빈 구간을 확인해야 한다.",
    "required": [
     "겉모양과 접속 관계를 구별한다.",
     "두 접점·서로 다른 전지 극을 설명한다.",
     "접촉 상태와 빈 구간을 확인한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "겉모양과 접속 관계를 구별한다. / 두 접점·서로 다른 전지 극을 설명한다. / 접촉 상태와 빈 구간을 확인한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w030",
   "no": 30,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T03",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "구리와 플라스틱 비교에서 한쪽만 집게가 느슨했습니다. 결과를 바로 재료 때문이라고 할 수 있나요?",
   "answer": "접촉 상태가 함께 달라 재료 하나의 영향이라고 단정하기 어렵다. 전원을 분리해 접촉 위치·누르는 상태를 맞춘 뒤 같은 조건으로 다시 비교한다.",
   "explanation": "재료와 접촉 상태를 함께 바꾸면 어떤 조건 때문에 달라졌는지 분리하기 어렵다. 관찰한 결과는 그대로 남기되 결론을 제한한다. 결과에 맞춰 관찰표를 고치는 대신 비교 방법을 개선한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "접촉 조건 차이를 읽는다.",
    "인과 판단의 한계를 설명한다.",
    "전원을 분리하고 접촉 조건을 맞추는 수정을 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "접촉 상태가 함께 달라 재료 하나의 영향이라고 단정하기 어렵다. 전원을 분리해 접촉 위치·누르는 상태를 맞춘 뒤 같은 조건으로 다시 비교한다.",
    "required": [
     "접촉 조건 차이를 읽는다.",
     "인과 판단의 한계를 설명한다.",
     "전원을 분리하고 접촉 조건을 맞추는 수정을 제안한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "접촉 조건 차이를 읽는다. / 인과 판단의 한계를 설명한다. / 전원을 분리하고 접촉 조건을 맞추는 수정을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w031",
   "no": 31,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T15",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "한 전구 회로의 연결을 크게 그리세요. 전지의 두 극과 전구 옆·바닥 접점을 표시하고, 전구를 거쳐 돌아오는 길을 구별하세요.",
   "answer": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
   "explanation": "보기 좋은 선의 모양이 아니라 실제로 무엇과 무엇이 닿는지 본다. 직접 금속 접촉을 포함한 다른 타당한 연결도 인정한다. 이 그림은 교사 점검을 거친 실물 실행과는 별도이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "전지 극과 전구 접점을 이름표로 구별한다.",
    "전구를 거치는 끊기지 않는 연결을 나타낸다.",
    "전지 양극을 전선만으로 직접 잇지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
    "required": [
     "전지 극과 전구 접점을 이름표로 구별한다.",
     "전구를 거치는 끊기지 않는 연결을 나타낸다.",
     "전지 양극을 전선만으로 직접 잇지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "전지 극과 전구 접점을 이름표로 구별한다. / 전구를 거치는 끊기지 않는 연결을 나타낸다. / 전지 양극을 전선만으로 직접 잇지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w032",
   "no": 32,
   "section": 2,
   "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T03",
   "topic": "끊기지 않는 연결과 재료를 비교해요",
   "prompt": "전구를 거치는 시험 회로에 재료를 끼울 작은 틈을 표시하고, 재료만 바꿔 비교할 그림과 빈 관찰표를 만드세요.",
   "answer": "같은 전지·전구·전선과 하나의 재료 비교 틈, 같은 접촉 방법을 표시한다. 표는 재료/실제 결과/접촉 조건/미관찰로 나누고 결과는 비워 둔다.",
   "explanation": "비교 틈은 전구를 거치는 회로의 일부여야 한다. 전지 양극에 재료를 직접 대는 장치를 만들지 않는다. 통제 조건과 아직 모르는 결과를 표현했는지 교사가 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "재료 외의 고정 조건을 표시한다.",
    "비교 틈이 전구를 거치는 길에 있음을 나타낸다.",
    "관찰칸에 예시 결과를 미리 채우지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 전지·전구·전선과 하나의 재료 비교 틈, 같은 접촉 방법을 표시한다. 표는 재료/실제 결과/접촉 조건/미관찰로 나누고 결과는 비워 둔다.",
    "required": [
     "재료 외의 고정 조건을 표시한다.",
     "비교 틈이 전구를 거치는 길에 있음을 나타낸다.",
     "관찰칸에 예시 결과를 미리 채우지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "재료 외의 고정 조건을 표시한다. / 비교 틈이 전구를 거치는 길에 있음을 나타낸다. / 관찰칸에 예시 결과를 미리 채우지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "둥근 모양만으로 닫힌 연결을 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w033",
   "no": 33,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "두 전지가 서로 돕는 가운데 연결을 고르세요.",
   "answer": "⑤ ㄴ",
   "explanation": "서로 다른 극을 이어 준 ㄴ이 두 전지가 돕는 한 줄 연결이다. ㄱ·ㄷ은 같은 극끼리 잇는다. 선이 한 줄로 보이는가보다 +·− 표시의 실제 접속을 읽는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "ㄱ",
    "ㄷ",
    "ㄱ과 ㄷ",
    "세 카드 모두",
    "ㄴ"
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "table": {
    "머리": [
     "기호",
     "가운데에서 이은 극"
    ],
    "행": [
     [
      "ㄱ",
      "첫 전지 +극 ↔ 둘째 전지 +극"
     ],
     [
      "ㄴ",
      "첫 전지 −극 ↔ 둘째 전지 +극"
     ],
     [
      "ㄷ",
      "첫 전지 −극 ↔ 둘째 전지 −극"
     ]
    ]
   },
   "givens": "같은 종류·상태의 두 전지이다. 남은 바깥 두 극은 같은 정상 전구 하나의 서로 다른 접점으로 이어진다. 연결 카드만 읽는다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ⑤ ㄴ",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "같은 종류·상태의 두 전지이다. 남은 바깥 두 극은 같은 정상 전구 하나의 서로 다른 접점으로 이어진다. 연결 카드만 읽는다."
   ],
   "figure": "electricity-question-data-33"
  },
  {
   "id": "c22-s62-u03-w034",
   "no": 34,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "한 개와 두 개의 전지를 비교할 때 맞춰야 할 조건을 고르세요.",
   "answer": "③ 전지 종류와 사용 상태",
   "explanation": "전지 수 외에 종류·사용 상태 등 중요한 조건을 맞춰야 한다. 전구·접촉·전선·주변 밝기까지 다르면 원인을 나눠 해석하기 어렵다. 정격이 맞는 부품을 쓰는 조건도 필요하다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "두 전구의 서로 다른 종류",
    "한쪽만 느슨한 금속 접촉",
    "전지 종류와 사용 상태",
    "비교 때마다 다른 전선 굵기",
    "한쪽만 다른 주변 밝기"
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 전지 종류와 사용 상태",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다."
   ]
  },
  {
   "id": "c22-s62-u03-w035",
   "no": 35,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "두 전지가 돕는 한 줄 연결에서는 가운데의 (1) 극끼리 잇고, 남은 (2) 두 극을 전구에 이어요. 보기: 서로 다른·바깥",
   "answer": "서로 다른 / 바깥",
   "explanation": "가운데에서 서로 다른 극을 이어야 두 전지가 돕는다. 바깥에 남은 두 극으로 전구를 거치는 회로를 만든다. 모든 극을 한꺼번에 한 점으로 묶는 방법과 구별한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "서로 다른",
       "다른"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "바깥",
       "바깥쪽"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 서로 다른 또는 다른 / (2) 바깥 또는 바깥쪽. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w036",
   "no": 36,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "전지 수를 바꾸기 전에는 (1)을 분리하고, 다시 연결한 뒤에는 (2)의 점검을 받아요. 보기: 전원·교사",
   "answer": "전원 / 교사",
   "explanation": "전원이 분리된 상태에서 연결을 바꾼 뒤 교사의 점검을 받아야 한다. 켜진 회로에 전지를 임의로 끼워 넣는 절차가 아니다. 비교하고 싶은 조건이 있어도 허용 규격을 먼저 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "전원",
       "전지"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "교사",
       "선생님"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 전원 또는 전지 / (2) 교사 또는 선생님. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w037",
   "no": 37,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "연결 설명과 카드를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "한 개는 그 전지의 양극을 쓰는 ㄷ, 두 개가 돕는 연결은 ㄱ이다. 같은 +극끼리 맞댄 것은 ㄴ으로 구별한다. 전지 수가 두 개라는 사실만으로 돕는 연결이라고 정하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 전지 한 개",
    "(2) 같은 두 전지가 돕는 한 줄 연결",
    "(3) 가운데 같은 +극끼리 맞댄 연결"
   ],
   "options": [
    "ㄱ 가운데 서로 다른 극을 이음",
    "ㄴ 가운데 같은 극을 이음",
    "ㄷ 전지의 양극을 전구에 각각 이음"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "ㄱ 가운데 서로 다른 극을 이음",
    "ㄴ 가운데 같은 극을 이음",
    "ㄷ 전지의 양극을 전구에 각각 이음"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w038",
   "no": 38,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "확인 목적과 근거를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "극은 표시, 허용 수는 설명서·점검, 접촉은 실제 닿은 위치로 확인한다. ㄷ·ㄱ·ㄴ 순서이다. 전선 색이나 밝기 인상 하나로 세 확인을 모두 대신하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 가운데 연결의 극 확인",
    "(2) 허용 전지 수 확인",
    "(3) 전구 접점의 실제 접촉 확인"
   ],
   "options": [
    "ㄱ 키트 설명서와 교사 점검",
    "ㄴ 금속 집게가 닿은 위치",
    "ㄷ 각 전지의 +·− 표시"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "ㄱ 키트 설명서와 교사 점검",
    "ㄴ 금속 집게가 닿은 위치",
    "ㄷ 각 전지의 +·− 표시"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w039",
   "no": 39,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "교사의 변경 순서 “전원 분리→두 전지 연결 점검→짧게 관찰”을 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "분리한 ㄷ 뒤 두 전지 연결 점검인 ㄱ, 관찰인 ㄴ이 온다. 전구와 코일 등 부품의 허용 조건을 무시해 계속 전지를 늘리는 활동으로 바꾸지 않는다. 적힌 세 단계의 선후를 지킨다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 두 전지가 돕는 연결인지 교사에게 확인받는다.",
    "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다.",
    "ㄷ 스위치를 열고 전지를 분리한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "ㄱ 두 전지가 돕는 연결인지 교사에게 확인받는다.",
    "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다.",
    "ㄷ 스위치를 열고 전지를 분리한다."
   ]
  },
  {
   "id": "c22-s62-u03-w040",
   "no": 40,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "설명 순서 “극 표시 읽기→가운데 접속 확인→바깥 연결 확인”대로 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "표시를 읽는 ㄴ에서 시작해 가운데 접속 ㄷ, 바깥 접속 ㄱ으로 추적한다. 색만 보고 결론을 낸 뒤 표시를 맞추는 방식이 아니다. 접속을 구간별로 확인하는 순서이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 남은 두 극이 전구의 다른 접점으로 가는지 본다.",
    "ㄴ 각 전지의 +·− 위치를 읽는다.",
    "ㄷ 가운데에서 어떤 극끼리 닿는지 확인한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄷ → ㄱ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "ㄱ 남은 두 극이 전구의 다른 접점으로 가는지 본다.",
    "ㄴ 각 전지의 +·− 위치를 읽는다.",
    "ㄷ 가운데에서 어떤 극끼리 닿는지 확인한다."
   ]
  },
  {
   "id": "c22-s62-u03-w041",
   "no": 41,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "두 전지 비교에 알맞은 설명을 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "같은 전지 상태·전구와 허용 조건을 지킨 세 문장이 맞다. 두 개라도 같은 극끼리 이으면 의도한 연결과 다르다. 밝기 증가 관찰이 임의로 전지를 계속 늘려도 된다는 허가는 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "밝으면 세 개 이상도 계속 추가한다.",
    "같은 종류·상태의 전지를 쓴다.",
    "정격이 맞는 같은 전구 하나를 쓴다.",
    "전지 두 개면 연결 극은 확인하지 않는다.",
    "교사가 허용한 두 조건 안에서 비교한다."
   ],
   "key": [
    1,
    2,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     2,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요."
  },
  {
   "id": "c22-s62-u03-w042",
   "no": 42,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "카드의 극 연결을 바르게 읽은 것을 고르세요. (정답 3개)",
   "answer": "①, ④, ⑤",
   "explanation": "ㄱ은 +/+이고 ㄴ은 −/+이며 ㄷ은 −/−이다. 실제 표시를 읽으면 세 설명을 확인할 수 있다. 색이나 겉모양은 극 접속을 대신하는 근거가 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "ㄴ은 서로 다른 극을 연결했다.",
    "ㄷ은 서로 다른 극을 연결했다.",
    "ㄱ은 전선 색이 같아 돕는 연결이다.",
    "ㄷ은 같은 −극끼리 연결했다.",
    "ㄱ은 같은 +극끼리 연결했다."
   ],
   "key": [
    0,
    3,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     3,
     4
    ]
   },
   "table": {
    "머리": [
     "기호",
     "가운데에서 이은 극"
    ],
    "행": [
     [
      "ㄱ",
      "첫 전지 +극 ↔ 둘째 전지 +극"
     ],
     [
      "ㄴ",
      "첫 전지 −극 ↔ 둘째 전지 +극"
     ],
     [
      "ㄷ",
      "첫 전지 −극 ↔ 둘째 전지 −극"
     ]
    ]
   },
   "givens": "같은 종류·상태의 두 전지이다. 남은 바깥 두 극은 같은 정상 전구 하나의 서로 다른 접점으로 이어진다. 연결 카드만 읽는다.",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ④, ⑤. 선택한 순서는 관계없다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "같은 종류·상태의 두 전지이다. 남은 바깥 두 극은 같은 정상 전구 하나의 서로 다른 접점으로 이어진다. 연결 카드만 읽는다."
   ],
   "figure": "electricity-question-data-42"
  },
  {
   "id": "c22-s62-u03-w043",
   "no": 43,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "표에서 (1)서로 다른 극을 이은 카드 수 (2)그 카드의 기호를 쓰세요.",
   "answer": "1개 / ㄴ",
   "explanation": "가운데 서로 다른 극을 이은 것은 ㄴ 하나이다. 따라서1개·ㄴ이다. ㄱ과 ㄷ은 전지 수가 같아도 같은 극끼리 연결한 다른 조건이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 1,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "1개"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "기호",
     "가운데에서 이은 극"
    ],
    "행": [
     [
      "ㄱ",
      "첫 전지 +극 ↔ 둘째 전지 +극"
     ],
     [
      "ㄴ",
      "첫 전지 −극 ↔ 둘째 전지 +극"
     ],
     [
      "ㄷ",
      "첫 전지 −극 ↔ 둘째 전지 −극"
     ]
    ]
   },
   "givens": "같은 종류·상태의 두 전지이다. 남은 바깥 두 극은 같은 정상 전구 하나의 서로 다른 접점으로 이어진다. 연결 카드만 읽는다.",
   "verificationModel": {
    "kind": "aiding-cell-joins",
    "model": "cellJoin"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 1개 (단위 필요) / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "given": [
    "같은 종류·상태의 두 전지이다. 남은 바깥 두 극은 같은 정상 전구 하나의 서로 다른 접점으로 이어진다. 연결 카드만 읽는다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-43"
  },
  {
   "id": "c22-s62-u03-w044",
   "no": 44,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "연결 메모를 읽고 (1)가운데 이은 두 극의 관계 (2)전구에 이을 단자 위치를 쓰세요.",
   "answer": "서로 다른 극 / 바깥",
   "explanation": "가운데는 −극과 +극이므로 다른 극이다. 전구로 가는 것은 가운데에 쓰지 않은 바깥 두 끝이다. 이어 붙인 내부 접속과 전구에 연결할 외부 단자를 혼동하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "서로 다른 극",
       "다른 극"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "바깥",
       "바깥쪽",
       "양 끝"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "구간",
     "메모"
    ],
    "행": [
     [
      "가운데",
      "첫 전지 −극과 둘째 전지 +극"
     ],
     [
      "전구로 가는 두 끝",
      "가운데에 쓰지 않고 남은 양 끝"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 서로 다른 극 또는 다른 극 / (2) 바깥 또는 바깥쪽 또는 양 끝. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-44"
  },
  {
   "id": "c22-s62-u03-w045",
   "no": 45,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "“두 전지를 한 줄로 그렸으니 언제나 서로 돕는 연결이다”라는 말에 답하세요.",
   "answer": "한 줄 모양만으로 판단하지 않는다. 가운데에서 서로 다른 극을 잇고 바깥 두 극을 전구의 다른 접점에 연결했는지 확인해야 한다.",
   "explanation": "전지 두 개가 같은 극끼리 마주하도록 한 줄에 놓일 수도 있다. 의도한 연결은 실제 표시와 접속을 읽어 확인한다. 같은 전지 상태와 정격 조건도 유지한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "겉모양과 극 접속을 구별한다.",
    "가운데 서로 다른 극을 설명한다.",
    "바깥 두 극과 전구의 두 접점을 연결한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "한 줄 모양만으로 판단하지 않는다. 가운데에서 서로 다른 극을 잇고 바깥 두 극을 전구의 다른 접점에 연결했는지 확인해야 한다.",
    "required": [
     "겉모양과 극 접속을 구별한다.",
     "가운데 서로 다른 극을 설명한다.",
     "바깥 두 극과 전구의 두 접점을 연결한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "겉모양과 극 접속을 구별한다. / 가운데 서로 다른 극을 설명한다. / 바깥 두 극과 전구의 두 접점을 연결한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w046",
   "no": 46,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T05",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "친구가 낡은 전지 한 개에 새 전지 한 개를 더해 비교했습니다. 무엇을 고쳐야 하나요?",
   "answer": "같은 종류·상태의 새 전지를 준비하고 부품 정격을 확인해야 한다. 지금은 전지 수와 사용 상태가 함께 달라 밝기 차이를 전지 수만의 영향이라고 정하기 어렵다.",
   "explanation": "전지 상태의 차이는 비교와 기구 사용 모두에 중요한 조건이다. 결과를 지우는 대신 조건 차이를 밝히고 적합한 부품으로 계획을 고친다. 새것과 헌것을 섞는 방법을 학생에게 시험시키지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "종류·상태의 일치를 제안한다.",
    "전지 수 외의 조건이 바뀌었음을 설명한다.",
    "정격과 교사 점검을 포함한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "같은 종류·상태의 새 전지를 준비하고 부품 정격을 확인해야 한다. 지금은 전지 수와 사용 상태가 함께 달라 밝기 차이를 전지 수만의 영향이라고 정하기 어렵다.",
    "required": [
     "종류·상태의 일치를 제안한다.",
     "전지 수 외의 조건이 바뀌었음을 설명한다.",
     "정격과 교사 점검을 포함한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "종류·상태의 일치를 제안한다. / 전지 수 외의 조건이 바뀌었음을 설명한다. / 정격과 교사 점검을 포함한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w047",
   "no": 47,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T15",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "전지 한 개와 서로 돕는 두 개의 연결을 나란히 그리세요. 가운데와 바깥의 극을 모두 표시하세요.",
   "answer": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
   "explanation": "극 표시와 실제 접속을 비교할 수 있어야 한다. 전구 여러 개의 연결로 과제를 바꾸지 않는다. 그림의 색이 아니라 이름표와 접속 관계를 교사가 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "한개/두개 조건을 나눈다.",
    "모든 극 표시와 가운데 접속을 구별한다.",
    "같은 전구·허용 정격을 메모한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
    "required": [
     "한개/두개 조건을 나눈다.",
     "모든 극 표시와 가운데 접속을 구별한다.",
     "같은 전구·허용 정격을 메모한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "한개/두개 조건을 나눈다. / 모든 극 표시와 가운데 접속을 구별한다. / 같은 전구·허용 정격을 메모한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w048",
   "no": 48,
   "section": 3,
   "sectionTitle": "전지 한 개와 두 개를 연결해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T15",
   "topic": "전지 한 개와 두 개를 연결해요",
   "prompt": "같은 극끼리 이은 두 전지 카드를 고칠 “연결 점검 지도”를 그리세요. 실제로 연결하지 말고 고칠 곳과 확인 순서를 표시하세요.",
   "answer": "전원을 분리한 상태에서 +·− 표시를 읽고 가운데를 서로 다른 극끼리 잇게 수정한 뒤 바깥 연결과 교사 점검을 표시한다.",
   "explanation": "수정 지도는 실제 기구에 전지를 추가하는 지시와 다르다. 고칠 접속과 안전한 점검 순서를 설명했는지 본다. 다른 타당한 표시 방식도 인정한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "같은 극 연결 위치를 찾는다.",
    "다른 극끼리 이을 수정안을 나타낸다.",
    "전원 분리·교사 점검을 앞뒤에 둔다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "전원을 분리한 상태에서 +·− 표시를 읽고 가운데를 서로 다른 극끼리 잇게 수정한 뒤 바깥 연결과 교사 점검을 표시한다.",
    "required": [
     "같은 극 연결 위치를 찾는다.",
     "다른 극끼리 이을 수정안을 나타낸다.",
     "전원 분리·교사 점검을 앞뒤에 둔다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "같은 극 연결 위치를 찾는다. / 다른 극끼리 이을 수정안을 나타낸다. / 전원 분리·교사 점검을 앞뒤에 둔다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "같은 전지 단자끼리 이었다고 서로 돕는 두 전지 연결이 되는 것은 아니에요. 부품 정격을 넘겨 전지를 임의로 늘리지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w049",
   "no": 49,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "전지 수의 영향만 비교하도록 고친 계획을 고르세요.",
   "answer": "① 같은 전구와 접촉 상태를 유지한다.",
   "explanation": "전지 수만 바꾸고 전구·접촉 상태 등은 유지하는 계획이 맞다. 다른 선택은 결과에 영향을 줄 조건도 함께 바꾼다. 공정한 비교는 바꿀 조건과 고정 조건을 나누는 데서 시작한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "같은 전구와 접촉 상태를 유지한다.",
    "두 전지 쪽만 다른 전구로 바꾼다.",
    "한쪽만 전선을 느슨하게 연결한다.",
    "관찰 때마다 전지를 다른 종류로 바꾼다.",
    "전지 수와 주변 밝기를 동시에 바꾼다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ① 같은 전구와 접촉 상태를 유지한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요."
  },
  {
   "id": "c22-s62-u03-w050",
   "no": 50,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "밝기 센서 연습표에서 직접 읽을 수 있는 결론을 고르세요.",
   "answer": "④ 세 번 모두 두 전지 표시가 더 높다.",
   "explanation": "50>31,54>33,52>32이므로 제시한 세 번에서는 두 전지 쪽 표시가 높다. 그 밖의 전구·방향·전력·전지 수 조건은 측정하지 않았다. 결론을 표와 비교 조건의 범위 안에 둔다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "모든 전구의 밝기는 정확히 두 배다.",
    "센서 표시가 전구의 소비 전력이다.",
    "모든 방향의 빛의 양을 다 측정했다.",
    "세 번 모두 두 전지 표시가 더 높다.",
    "세 개 이상 전지를 쓰면 늘 안전하다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "table": {
    "머리": [
     "전지 조건",
     "1회 센서 표시",
     "2회",
     "3회"
    ],
    "행": [
     [
      "1개",
      "31 lx",
      "33 lx",
      "32 lx"
     ],
     [
      "2개",
      "50 lx",
      "54 lx",
      "52 lx"
     ]
    ]
   },
   "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ 세 번 모두 두 전지 표시가 더 높다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   ],
   "figure": "electricity-question-data-50"
  },
  {
   "id": "c22-s62-u03-w051",
   "no": 51,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "전지 수의 영향을 볼 때 전지 수는 (1) 조건, 같은 전구와 관찰 위치는 (2) 조건이에요. 보기: 바꿀·같게 할",
   "answer": "바꿀 / 같게 할",
   "explanation": "무엇의 영향을 보려는지에 따라 바꿀 조건이 정해진다. 다른 중요한 조건은 맞춰 비교해야 한다. 같은 전구와 위치를 유지한 것에서 그 조건은 언제나 영향이 없다고 단정하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "바꿀",
       "다르게 할"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "같게 할",
       "유지할"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 바꿀 또는 다르게 할 / (2) 같게 할 또는 유지할. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w052",
   "no": 52,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "직접 관찰하지 않은 연습표는 (1) 자료라고 밝히고, 아직 해 보지 않은 비교는 (2)으로 남겨요. 보기: 제공·미실행",
   "answer": "제공 / 미실행",
   "explanation": "제공된 값은 실제로 내가 측정한 값과 구별한다. 실행하지 않은 상태는 미실행·미관찰로 표시한다. 표를 정확히 읽거나 문제를 맞혔다는 이유로 실험을 완료했다고 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "제공",
       "교사 제공",
       "연습"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "미실행",
       "미관찰"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 제공 또는 교사 제공 또는 연습 / (2) 미실행 또는 미관찰. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w053",
   "no": 53,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "비교 항목과 역할을 연결하세요.",
   "answer": "ㄷ / ㄴ / ㄱ",
   "explanation": "전지 수는 다르게 할 조건인 ㄷ, 전구·전선은 고정 조건 ㄴ이다. 밝기 차이는 결과 ㄱ이다. 계획 단계에서 예상하는 결과와 실제로 관찰한 결과도 구별한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 전지 한개/두개",
    "(2) 같은 전구와 전선",
    "(3) 관찰한 밝기 차이"
   ],
   "options": [
    "ㄱ 관찰하여 비교할 결과",
    "ㄴ 같게 유지할 조건",
    "ㄷ 다르게 할 조건"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄴ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "ㄱ 관찰하여 비교할 결과",
    "ㄴ 같게 유지할 조건",
    "ㄷ 다르게 할 조건"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w054",
   "no": 54,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "표현과 자료의 범위를 연결하세요.",
   "answer": "ㄱ / ㄷ / ㄴ",
   "explanation": "수치 표시는 ㄱ, 눈으로 비교한 관찰은 ㄷ, 세 전지를 시험하지 않은 상태는 ㄴ이다. 서로 다른 자료 종류를 같은 정밀도의 측정으로 취급하지 않는다. 관찰 방법도 결론의 범위를 정한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 센서가52 lx로 표시됨",
    "(2) 내 눈에는 더 밝게 보임",
    "(3) 세 전지 결과는 아직 없음"
   ],
   "options": [
    "ㄱ 정해진 위치의 수치 관찰",
    "ㄴ 시험하지 않은 조건",
    "ㄷ 조건을 밝혀 적은 비교 관찰"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄱ",
     "ㄷ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄱ / (2) ㄷ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "ㄱ 정해진 위치의 수치 관찰",
    "ㄴ 시험하지 않은 조건",
    "ㄷ 조건을 밝혀 적은 비교 관찰"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w055",
   "no": 55,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "반복 비교의 기준 “같은 위치 확인→두 조건 관찰→반복 기록 비교”로 배열하세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "위치와 접점을 맞추는 ㄴ을 먼저 한다. 두 조건 관찰 ㄱ 뒤 반복 자료를 비교하는 ㄷ이 온다. 반복 수가 많아도 같은 잘못된 조건을 반복했다면 공정성이 자동으로 보장되지는 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 두 조건의 관찰을 정해진 방법으로 한다.",
    "ㄴ 관찰 위치와 접점 조건을 확인한다.",
    "ㄷ 반복 기록에서 같은 경향인지 살핀다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄱ → ㄷ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "ㄱ 두 조건의 관찰을 정해진 방법으로 한다.",
    "ㄴ 관찰 위치와 접점 조건을 확인한다.",
    "ㄷ 반복 기록에서 같은 경향인지 살핀다."
   ]
  },
  {
   "id": "c22-s62-u03-w056",
   "no": 56,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "설명 순서 “자료 종류 밝히기→표의 차이 읽기→결론 범위 쓰기”로 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "교사 제공 자료인 ㄷ을 먼저 밝힌다. ㄱ의 차이를 근거로 ㄴ의 제한된 결론을 쓴다. 연습표를 우리 반 측정이라고 바꾸거나 세 전지 결과를 만들어 쓰지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 표 안의 한개/두개 표시를 비교한다.",
    "ㄴ 시험한 조건 안에서 결론을 쓴다.",
    "ㄷ 교사 제공 연습표임을 밝힌다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "ㄱ 표 안의 한개/두개 표시를 비교한다.",
    "ㄴ 시험한 조건 안에서 결론을 쓴다.",
    "ㄷ 교사 제공 연습표임을 밝힌다."
   ]
  },
  {
   "id": "c22-s62-u03-w057",
   "no": 57,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "공정한 밝기 비교에 필요한 점검을 고르세요. (정답 3개)",
   "answer": "①, ③, ④",
   "explanation": "전구·전선, 위치·주변 밝기, 전지 종류·상태를 맞춰야 한다. 접촉을 다르게 하거나 정격 확인을 생략하면 의도한 비교와 달라진다. 같은 조건과 안전한 허용 범위를 함께 확보한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "전지 종류·상태를 맞춘다.",
    "밝아 보인 쪽의 정격 확인을 생략한다.",
    "전구와 전선 조건을 맞춘다.",
    "관찰 위치와 주변 밝기를 맞춘다.",
    "한쪽만 접점을 느슨하게 둔다."
   ],
   "key": [
    0,
    2,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     2,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ④. 선택한 순서는 관계없다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요."
  },
  {
   "id": "c22-s62-u03-w058",
   "no": 58,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "연습표만으로는 확인했다고 말할 수 없는 내용을 고르세요. (정답 3개)",
   "answer": "①, ④, ⑤",
   "explanation": "표 안의 수치와 대소 관계는 직접 읽을 수 있다. 모든 전구의 정확한 배수, 우리 반의 실측 여부, 세 전지의 안전성은 이 자료가 확인하지 않았다. 표가 알려 주는 정보와 과도한 일반화를 구별한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "모든 전구에서 정확히 두 배 밝다.",
    "이 표의 두 전지 표시가 더 높다.",
    "1회 한 전지 표시는31 lx이다.",
    "우리 반이 실제로 같은 값을 측정했다.",
    "세 전지를 연결해도 안전하다."
   ],
   "key": [
    0,
    3,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     3,
     4
    ]
   },
   "table": {
    "머리": [
     "전지 조건",
     "1회 센서 표시",
     "2회",
     "3회"
    ],
    "행": [
     [
      "1개",
      "31 lx",
      "33 lx",
      "32 lx"
     ],
     [
      "2개",
      "50 lx",
      "54 lx",
      "52 lx"
     ]
    ]
   },
   "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ④, ⑤. 선택한 순서는 관계없다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   ],
   "figure": "electricity-question-data-58"
  },
  {
   "id": "c22-s62-u03-w059",
   "no": 59,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "세 번의 평균 표시를 구해 (1)한 전지 (2)두 전지 순서로 단위와 함께 쓰세요.",
   "answer": "32lx / 52lx",
   "explanation": "한 전지는(31+33+32)÷3=32 lx, 두 전지는(50+54+52)÷3=52 lx이다. 평균은 같은 위치의 세 표시를 요약한 값이다. 전구의 소비 전력이나 모든 방향의 총 빛을 계산한 것이 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 32,
      "units": [
       "lx",
       "럭스"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "32lx"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 52,
      "units": [
       "lx",
       "럭스"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "52lx"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "전지 조건",
     "1회 센서 표시",
     "2회",
     "3회"
    ],
    "행": [
     [
      "1개",
      "31 lx",
      "33 lx",
      "32 lx"
     ],
     [
      "2개",
      "50 lx",
      "54 lx",
      "52 lx"
     ]
    ]
   },
   "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "verificationModel": {
    "kind": "brightness-means",
    "model": "brightness"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 32lx (단위 필요) / (2) 52lx (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-59"
  },
  {
   "id": "c22-s62-u03-w060",
   "no": 60,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "표에서 (1)두 평균 표시의 차이 (2)두 전지 표시가 더 높은 반복 수를 단위와 함께 쓰세요.",
   "answer": "20lx / 3회",
   "explanation": "평균52−32=20 lx이고 각 열에서 두 전지 값이 더 높으므로3회이다. 반복별 차이는19·21·20 lx로 모두 똑같지는 않다. 이런 차이를 지우거나 정확한 정비례로 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 20,
      "units": [
       "lx",
       "럭스"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "20lx"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 3,
      "units": [
       "회",
       "번"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "3회"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "전지 조건",
     "1회 센서 표시",
     "2회",
     "3회"
    ],
    "행": [
     [
      "1개",
      "31 lx",
      "33 lx",
      "32 lx"
     ],
     [
      "2개",
      "50 lx",
      "54 lx",
      "52 lx"
     ]
    ]
   },
   "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "verificationModel": {
    "kind": "brightness-comparison",
    "model": "brightness"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 20lx (단위 필요) / (2) 3회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "given": [
    "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-60"
  },
  {
   "id": "c22-s62-u03-w061",
   "no": 61,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "반복 관찰의 차이가 조금씩 달랐습니다. “틀린 값이니 큰 값에 맞추자”는 제안을 검토하세요.",
   "answer": "다른 실제 기록도 그대로 남겨야 한다. 접점·관찰 위치·전지 상태와 반복 방법을 확인하고 차이가 생긴 조건을 설명한다. 원하는 결과에 맞춰 값을 고치지 않는다.",
   "explanation": "반복은 결과가 얼마나 일관적인지 살피는 자료이다. 모든 값이 같지 않다는 이유로 큰 값에 맞추면 관찰 근거를 잃는다. 조건과 방법을 다시 확인하는 것이 자료를 개선하는 방법이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "기록을 지우거나 맞추지 않는다.",
    "차이가 생길 수 있는 조건을 제안한다.",
    "재점검과 추가 관찰의 필요를 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "다른 실제 기록도 그대로 남겨야 한다. 접점·관찰 위치·전지 상태와 반복 방법을 확인하고 차이가 생긴 조건을 설명한다. 원하는 결과에 맞춰 값을 고치지 않는다.",
    "required": [
     "기록을 지우거나 맞추지 않는다.",
     "차이가 생길 수 있는 조건을 제안한다.",
     "재점검과 추가 관찰의 필요를 설명한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "기록을 지우거나 맞추지 않는다. / 차이가 생길 수 있는 조건을 제안한다. / 재점검과 추가 관찰의 필요를 설명한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w062",
   "no": 62,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "전선 길이를 두 조건에서 같게 두었습니다. 이것이 “길이는 밝기에 영향을 줄 수 없다”는 증거인가요?",
   "answer": "아니다. 길이를 바꾸지 않고 통제했을 뿐 길이의 영향을 시험하지 않았다. 그 영향을 보려면 길이 외의 조건을 맞춘 별도 비교가 필요하다.",
   "explanation": "같게 둔 조건은 결과의 다른 원인을 줄이기 위한 것이다. 길고 가는 전선처럼 다른 조건에서 영향이 생길 수도 있다. 이번 자료가 다루지 않은 조건의 결과를 단정하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "통제한 조건과 시험한 조건을 구별한다.",
    "무영향이라는 절대 결론을 거부한다.",
    "별도 공정 비교를 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "아니다. 길이를 바꾸지 않고 통제했을 뿐 길이의 영향을 시험하지 않았다. 그 영향을 보려면 길이 외의 조건을 맞춘 별도 비교가 필요하다.",
    "required": [
     "통제한 조건과 시험한 조건을 구별한다.",
     "무영향이라는 절대 결론을 거부한다.",
     "별도 공정 비교를 제안한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "통제한 조건과 시험한 조건을 구별한다. / 무영향이라는 절대 결론을 거부한다. / 별도 공정 비교를 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w063",
   "no": 63,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "전지 한 개와 두 개의 밝기를 비교할 배치를 그리세요. 전구·관찰 위치와 같게 할 조건을 표시하세요.",
   "answer": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 정격을 메모한다.",
   "explanation": "배치 그림은 연결 그림만 그리는 과제보다 관찰 조건의 통제가 중요하다. 전구 여러 개의 연결 비교로 확장하지 않는다. 실제 실행 전에는 결과를 미리 그려 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "전지 수 외의 조건을 맞춘다.",
    "관찰 위치와 방법을 표시한다.",
    "허용 정격·교사 점검과 미관찰 상태를 남긴다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 정격을 메모한다.",
    "required": [
     "전지 수 외의 조건을 맞춘다.",
     "관찰 위치와 방법을 표시한다.",
     "허용 정격·교사 점검과 미관찰 상태를 남긴다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "전지 수 외의 조건을 맞춘다. / 관찰 위치와 방법을 표시한다. / 허용 정격·교사 점검과 미관찰 상태를 남긴다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w064",
   "no": 64,
   "section": 4,
   "sectionTitle": "같은 조건으로 밝기를 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T16",
   "topic": "같은 조건으로 밝기를 비교해요",
   "prompt": "세 번씩 비교할 빈 기록표를 설계하세요. 제공 자료와 실제 관찰을 구별하고 결론의 한계를 적을 칸도 만드세요.",
   "answer": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·미관찰·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
   "explanation": "빈 표의 구조가 관찰 방법을 담아야 한다. 숫자만 모은 표보다 자료 종류와 조건·한계를 남길 공간이 필요하다. 예시 표를 베껴 실측 기록으로 만드는 것은 인정하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "반복과 두 조건을 구별한다.",
    "자료 종류와 통제 조건 칸을 둔다.",
    "결과를 예시값으로 미리 채우지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·미관찰·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
    "required": [
     "반복과 두 조건을 구별한다.",
     "자료 종류와 통제 조건 칸을 둔다.",
     "결과를 예시값으로 미리 채우지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "반복과 두 조건을 구별한다. / 자료 종류와 통제 조건 칸을 둔다. / 결과를 예시값으로 미리 채우지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w065",
   "no": 65,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T08",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "코일을 만드는 방법으로 알맞은 것을 고르세요.",
   "answer": "② 감긴 부분의 절연을 유지한다.",
   "explanation": "코일의 감긴 부분은 절연을 유지하고 두 끝의 접점만 교사가 준비한다. 학생이 피복을 태우거나 철심을 가열하지 않는다. 지정된 교육용 부품의 정격·통전 시간 확인도 필요하다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "전선 전체 피복을 불로 태운다.",
    "감긴 부분의 절연을 유지한다.",
    "철심을 가열한 채 손으로 감는다.",
    "모든 코일선을 서로 금속 접촉시킨다.",
    "전원을 켠 상태에서 감긴 선을 바꾼다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "givens": "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 감긴 부분의 절연을 유지한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
   ]
  },
  {
   "id": "c22-s62-u03-w066",
   "no": 66,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "전원을 분리한 뒤 클립 한 개가 남았습니다. 타당한 설명을 고르세요.",
   "answer": "⑤ 철심에 약한 자성이 남을 수 있다.",
   "explanation": "전원 분리 뒤에도 철심에 약한 자성이 남을 수 있다. 클립 한 개가 남았다는 관찰을 그대로 기록한다. 그 사실만으로 전류가 계속 흐르거나 항상 같은 세기라고 할 수는 없다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "전류가 반드시 계속 흐르는 증거다.",
    "철심이 항상 같은 세기인 증거다.",
    "클립이 없어야 하므로 기록을 지운다.",
    "철심을 불로 가열해 답에 맞춘다.",
    "철심에 약한 자성이 남을 수 있다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "table": {
    "머리": [
     "상태",
     "붙은 철 클립"
    ],
    "행": [
     [
      "연결 전",
      "0개"
     ],
     [
      "전류를 켠 때",
      "6개"
     ],
     [
      "전원 분리 뒤",
      "1개"
     ]
    ]
   },
   "givens": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ⑤ 철심에 약한 자성이 남을 수 있다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다."
   ],
   "figure": "electricity-question-data-66"
  },
  {
   "id": "c22-s62-u03-w067",
   "no": 67,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T08",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "전자석을 만들 때 철심 둘레에 (1)된 전선을 감고, 양 (2)의 금속 접점은 교사가 준비해요. 보기: 절연·끝",
   "answer": "절연 / 끝",
   "explanation": "감긴 부분의 절연을 유지하면서 양 끝에서 전기적으로 연결할 수 있어야 한다. 감긴 부분 전체의 피복 제거와 끝 접점 준비를 구별한다. 실제 사용할 선 길이·정격은 교사가 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "절연"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "끝",
       "끝부분"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 절연 / (2) 끝 또는 끝부분. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w068",
   "no": 68,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "철심은 전류 연결 (1)의 시작 상태와 전원 분리 (2)의 상태도 비교해요. 보기: 전·뒤",
   "answer": "전 / 뒤",
   "explanation": "처음부터 남아 있던 자성과 전류를 흘린 뒤의 변화를 구별하려면 시작 상태가 필요하다. 전원 분리 뒤 상태도 그대로 기록해야 한다. 켜진 한 장면만으로 모든 성질을 정하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "전",
       "이전"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "뒤",
       "후",
       "이후"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 전 또는 이전 / (2) 뒤 또는 후 또는 이후. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w069",
   "no": 69,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T08",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "제작 과정과 목적을 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "보호 바탕은 ㄴ, 코일 절연은 ㄷ, 끝 접점은 ㄱ과 연결된다. 철심과 선이 닿으면 무조건 자석이 사라진다는 설명으로 바꾸지 않는다. 접촉과 절연의 실제 역할을 구별한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 철심 보호 테이프",
    "(2) 감긴 선의 절연 유지",
    "(3) 양 끝 금속 접점 준비"
   ],
   "options": [
    "ㄱ 코일로 전류가 들어가고 나올 접촉 준비",
    "ㄴ 철심에 감을 바탕을 준비",
    "ㄷ 이웃한 금속 선끼리 뜻하지 않게 닿지 않게 함"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "ㄱ 코일로 전류가 들어가고 나올 접촉 준비",
    "ㄴ 철심에 감을 바탕을 준비",
    "ㄷ 이웃한 금속 선끼리 뜻하지 않게 닿지 않게 함"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w070",
   "no": 70,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "관찰 시점과 역할을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "시작 상태 ㄷ, 통전 중 ㄱ, 분리 뒤 ㄴ이다. 세 시점을 나누어야 연결 전후의 실제 차이를 설명할 수 있다. 분리 뒤 결과는 모두 떨어질 것이라는 예상과 다르더라도 그대로 적는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 연결 전",
    "(2) 정해진 짧은 통전 중",
    "(3) 전원 분리 뒤"
   ],
   "options": [
    "ㄱ 전류를 켠 조건의 작용",
    "ㄴ 남은 작용과 변화의 확인",
    "ㄷ 철심의 시작 상태 확인"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "ㄱ 전류를 켠 조건의 작용",
    "ㄴ 남은 작용과 변화의 확인",
    "ㄷ 철심의 시작 상태 확인"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w071",
   "no": 71,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T08",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "제시된 조립 기준 “철심 보호→코일 감기→접점 확인→꺼진 회로 연결”에 맞게 배열하세요.",
   "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
   "explanation": "제시한 기준에 따라 보호 ㄷ, 감기 ㄹ, 끝 확인 ㄱ, 꺼진 회로 연결 ㄴ이다. 교사가 끝 접점을 미리 준비하는 다른 조립법도 가능하므로 모든 제작법의 유일한 순서라고 확대하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 교사가 준비한 두 끝 접점을 확인한다.",
    "ㄴ 전원이 꺼진 지정 회로에 연결하고 점검받는다.",
    "ㄷ 철심에 보호용 테이프를 감는다.",
    "ㄹ 그 위에 절연선을 한 방향으로 감는다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄷ",
     "ㄹ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄹ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "ㄱ 교사가 준비한 두 끝 접점을 확인한다.",
    "ㄴ 전원이 꺼진 지정 회로에 연결하고 점검받는다.",
    "ㄷ 철심에 보호용 테이프를 감는다.",
    "ㄹ 그 위에 절연선을 한 방향으로 감는다."
   ]
  },
  {
   "id": "c22-s62-u03-w072",
   "no": 72,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "관찰 기준 “시작 확인→잠깐 켜기→전원 분리 뒤 비교”로 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "처음 ㄴ을 보고 통전 ㄷ, 분리 뒤 ㄱ으로 비교한다. 각 시점에서 철심·클립·거리 등 방법을 맞춰야 한다. 정해진 시간을 넘겨 계속 켜 놓는 활동이 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 전원을 분리한 뒤 같은 클립으로 다시 본다.",
    "ㄴ 철심이 처음 클립에 어떻게 작용하는지 본다.",
    "ㄷ 교사 확인 뒤 정해진 시간만 스위치를 닫는다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄷ → ㄱ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "ㄱ 전원을 분리한 뒤 같은 클립으로 다시 본다.",
    "ㄴ 철심이 처음 클립에 어떻게 작용하는지 본다.",
    "ㄷ 교사 확인 뒤 정해진 시간만 스위치를 닫는다."
   ]
  },
  {
   "id": "c22-s62-u03-w073",
   "no": 73,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T08",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "학생의 제작 계획에 알맞은 것을 고르세요. (정답 3개)",
   "answer": "②, ④, ⑤",
   "explanation": "전원 분리·끝 접점 확인·감긴 부분 절연이 필요하다. 코일 전체 피복을 제거하거나 정격 확인 없이 아무 전원에 잇는 계획은 맞지 않는다. 교육용 부품과 교사 점검의 범위를 유지한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "선 전체 피복을 없애 감긴 금속을 붙인다.",
    "감긴 부분의 절연을 유지한다.",
    "모든 전지 규격에 같은 코일을 바로 연결한다.",
    "전지를 분리한 상태에서 코일을 감는다.",
    "교사가 준비한 양 끝 접점을 확인한다."
   ],
   "key": [
    1,
    3,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     3,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ④, ⑤. 선택한 순서는 관계없다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
  },
  {
   "id": "c22-s62-u03-w074",
   "no": 74,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
   "answer": "②, ③, ④",
   "explanation": "0·6·1개라는 기록에서 처음 없음, 통전 중 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 통전 중과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "아직 보지 않은 결과를 미리 실측으로 적었다.",
    "연결 전에는 붙은 클립이 없었다.",
    "전류를 켠 때 가장 많이 붙었다.",
    "분리 뒤에도 한 개가 남았다.",
    "분리 뒤에도 세기는 통전 중과 똑같았다."
   ],
   "key": [
    1,
    2,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     2,
     3
    ]
   },
   "table": {
    "머리": [
     "상태",
     "붙은 철 클립"
    ],
    "행": [
     [
      "연결 전",
      "0개"
     ],
     [
      "전류를 켠 때",
      "6개"
     ],
     [
      "전원 분리 뒤",
      "1개"
     ]
    ]
   },
   "givens": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ④. 선택한 순서는 관계없다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다."
   ],
   "figure": "electricity-question-data-74"
  },
  {
   "id": "c22-s62-u03-w075",
   "no": 75,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "표에서 (1)연결 전보다 통전 중 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
   "answer": "6개 / 1개",
   "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 6,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "6개"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 1,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "1개"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "상태",
     "붙은 철 클립"
    ],
    "행": [
     [
      "연결 전",
      "0개"
     ],
     [
      "전류를 켠 때",
      "6개"
     ],
     [
      "전원 분리 뒤",
      "1개"
     ]
    ]
   },
   "givens": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
   "verificationModel": {
    "kind": "onoff-count-difference",
    "model": "magnetOnOff"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 6개 (단위 필요) / (2) 1개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-75"
  },
  {
   "id": "c22-s62-u03-w076",
   "no": 76,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "기록 카드에서 (1)실제로 관찰한 시점 수 (2)미관찰 시점 수를 쓰세요.",
   "answer": "2개 / 1개",
   "explanation": "직접 관찰한 연결 전·통전 중은2시점이다. 분리 뒤는1시점 미관찰이다. 보지 못한 상태를 클립0개라고 채우거나 변하지 않았다고 단정하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개",
       "시점"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 1,
      "units": [
       "개",
       "시점"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "1개"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "시점",
     "기록 상태"
    ],
    "행": [
     [
      "연결 전",
      "직접 관찰"
     ],
     [
      "통전 중",
      "직접 관찰"
     ],
     [
      "분리 뒤",
      "시간 부족으로 못 봄"
     ]
    ]
   },
   "givens": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "formLabel": "자료 해석",
   "criteria": "(1) 2개 (단위 필요) / (2) 1개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "given": [
    "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-76"
  },
  {
   "id": "c22-s62-u03-w077",
   "no": 77,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "철심의 시작 상태를 보지 않고 통전 중만 관찰했습니다. 어떤 설명에 한계가 생기나요?",
   "answer": "처음부터 자성이 있었는지 알 수 없어 전류를 켜기 전후의 차이를 분리하기 어렵다. 전원이 분리된 시작 상태를 같은 클립·거리로 확인해 비교해야 한다.",
   "explanation": "통전 중 클립이 붙었다는 관찰은 남길 수 있다. 그러나 처음에도 붙었는지 모르면 변화량이나 전류 연결 전후 차이를 정확히 설명하기 어렵다. 관찰 범위와 다음 확인을 나누어 적는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "시작 상태가 없음을 읽는다.",
    "전후 차이 판단의 한계를 설명한다.",
    "같은 방법의 시작 비교를 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "처음부터 자성이 있었는지 알 수 없어 전류를 켜기 전후의 차이를 분리하기 어렵다. 전원이 분리된 시작 상태를 같은 클립·거리로 확인해 비교해야 한다.",
    "required": [
     "시작 상태가 없음을 읽는다.",
     "전후 차이 판단의 한계를 설명한다.",
     "같은 방법의 시작 비교를 제안한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "시작 상태가 없음을 읽는다. / 전후 차이 판단의 한계를 설명한다. / 같은 방법의 시작 비교를 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w078",
   "no": 78,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T08",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "“클립이 적게 붙으니 피복을 전부 벗기자”는 제안을 검토하세요.",
   "answer": "코일의 감긴 부분 절연을 없애면 이웃 선끼리 뜻하지 않게 연결될 수 있다. 끝 접촉·전원·거리·정격을 교사와 점검하되 피복을 전부 벗기거나 태우지 않는다.",
   "explanation": "클립 수 하나로 피복 전체가 문제라고 정할 수 없다. 코일을 거칠 연결과 절연·접점을 함께 확인해야 한다. 학생이 임의로 가열·피복 제거·전지 추가를 하는 수정은 인정하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "감긴 부분 절연의 역할을 설명한다.",
    "결과만 보고 위험한 수정을 하지 않는다.",
    "교사와 점검할 다른 조건을 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "코일의 감긴 부분 절연을 없애면 이웃 선끼리 뜻하지 않게 연결될 수 있다. 끝 접촉·전원·거리·정격을 교사와 점검하되 피복을 전부 벗기거나 태우지 않는다.",
    "required": [
     "감긴 부분 절연의 역할을 설명한다.",
     "결과만 보고 위험한 수정을 하지 않는다.",
     "교사와 점검할 다른 조건을 제안한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "감긴 부분 절연의 역할을 설명한다. / 결과만 보고 위험한 수정을 하지 않는다. / 교사와 점검할 다른 조건을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w079",
   "no": 79,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T08",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "내가 만들 전자석의 제작 그림을 그리세요. 철심·절연 코일·준비된 두 끝·스위치 회로와 점검 순서를 표시하세요.",
   "answer": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
   "explanation": "그림은 실제 부품의 역할과 제작 과정을 설명해야 한다. 감은 횟수나 길이를 아무 기구에나 통하는 정답으로 강요하지 않는다. 실제 제작 전에는 완성·성공으로 표시하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "철심·코일·두 끝 접점을 구별한다.",
    "전원을 끈 연결과 점검을 표시한다.",
    "피복 태우기·철심 가열·임의 전원 증가는 넣지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
    "required": [
     "철심·코일·두 끝 접점을 구별한다.",
     "전원을 끈 연결과 점검을 표시한다.",
     "피복 태우기·철심 가열·임의 전원 증가는 넣지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "철심·코일·두 끝 접점을 구별한다. / 전원을 끈 연결과 점검을 표시한다. / 피복 태우기·철심 가열·임의 전원 증가는 넣지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w080",
   "no": 80,
   "section": 5,
   "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T09",
   "topic": "전자석을 만들어 연결 전후를 관찰해요",
   "prompt": "연결 전·통전 중·분리 뒤 세 칸의 빈 관찰 그림판을 만드세요. 같은 클립과 거리를 표시하고 결과는 비워 두세요.",
   "answer": "세 시점의 철심·클립 위치와 같은 접근 방법을 표시한다. 각각 실제 결과/미관찰을 남길 칸과 시작 상태·남은 자성 메모 공간을 둔다.",
   "explanation": "세 칸의 목적은 시간에 따른 작용을 같은 방법으로 비교하는 것이다. 꺼진 뒤 클립이 반드시 모두 떨어지는 그림을 미리 정답으로 넣지 않는다. 실제 관찰한 것만 채울 수 있게 설계한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "세 시점을 분리한다.",
    "클립·거리·방법을 일정하게 표시한다.",
    "예상한 결과를 실측 그림으로 채우지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "세 시점의 철심·클립 위치와 같은 접근 방법을 표시한다. 각각 실제 결과/미관찰을 남길 칸과 시작 상태·남은 자성 메모 공간을 둔다.",
    "required": [
     "세 시점을 분리한다.",
     "클립·거리·방법을 일정하게 표시한다.",
     "예상한 결과를 실측 그림으로 채우지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "세 시점을 분리한다. / 클립·거리·방법을 일정하게 표시한다. / 예상한 결과를 실측 그림으로 채우지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w081",
   "no": 81,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T10",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "전자석 세기 비교에서 전지 수 외에 맞춰야 할 것을 고르세요.",
   "answer": "③ 클립의 접근 거리와 통전 시간",
   "explanation": "접근 거리·통전 시간 등 다른 조건을 맞춰야 전지 수의 영향을 비교할 수 있다. 철심·코일·클립까지 바꾸면 원인을 나눠 해석하기 어렵다. 더 많이 붙었다는 결과만으로 공정성을 확인할 수는 없다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "한쪽만 다른 철심 재료",
    "조건마다 다른 코일 감긴 방향",
    "클립의 접근 거리와 통전 시간",
    "한쪽만 더 가까이 대는 방법",
    "조건마다 다른 종류의 클립"
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 클립의 접근 거리와 통전 시간",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다."
   ]
  },
  {
   "id": "c22-s62-u03-w082",
   "no": 82,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T11",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "나침반 N극과 밀어낸 전자석 끝의 극을 고르세요.",
   "answer": "① N극",
   "explanation": "같은 자석 극끼리는 밀어내므로 그 끝도 N극이다. 전지의 +·− 단자와 자석의 N·S극을 같은 이름으로 쓰지 않는다. 감긴 방향의 법칙 대신 주어진 실제 반응을 근거로 판단한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "N극",
    "S극",
    "전지 +극",
    "전지 −극",
    "극이 없다는 뜻"
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ① N극",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요."
  },
  {
   "id": "c22-s62-u03-w083",
   "no": 83,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T11",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "같은 코일에서 전지 연결 방향을 반대로 바꾸면 전류의 (1)이 바뀌어 자석의 (2)이 바뀔 수 있어요. 보기: 방향·극",
   "answer": "방향 / 극",
   "explanation": "전지 연결 방향의 반전은 같은 코일을 흐르는 전류 방향을 바꾼다. 그에 따라 전자석의 극이 바뀔 수 있다. 전지 수를 늘려 매번 극을 뒤집는다고 설명하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "방향"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "극",
       "자석 극"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 방향 / (2) 극 또는 자석 극. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w084",
   "no": 84,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T12",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "철 조각을 잡고 놓는 전자석 장치는 전류를 (1) 때와 (2) 때의 작용 차이를 제어에 이용해요. 보기: 켤·끌",
   "answer": "켤 / 끌",
   "explanation": "전자석 장치는 전류를 켜고 끄는 등으로 잡는 작용을 제어할 수 있다. 영구 자석을 전지 없이 쓰는 경우와 비교한다. 실제 장치에서 놓는 구조·잔류 자성 대책은 기기마다 다를 수 있다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "켤",
       "흘릴"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "끌",
       "끊을"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 켤 또는 흘릴 / (2) 끌 또는 끊을. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w085",
   "no": 85,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T11",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "나침반 반응과 판단을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "같은 극의 밀림은 N극, 다른 극의 끌림은 S극을 가리킨다. 반응이 불분명하면 ㄴ처럼 판단을 보류한다. 적힌 표를 완성하려고 실제로 구별하지 못한 극을 지어내지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 확인된 N극과 밀림",
    "(2) 확인된 N극과 끌림",
    "(3) 반응이 불분명함"
   ],
   "options": [
    "ㄱ S극으로 판단",
    "ㄴ 판단 보류하고 조건 재점검",
    "ㄷ N극으로 판단"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "ㄱ S극으로 판단",
    "ㄴ 판단 보류하고 조건 재점검",
    "ㄷ N극으로 판단"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w086",
   "no": 86,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T17",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "제시한 기기 구조와 직접 용도를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "구조에 따라 운반 ㄷ, 소리 알림 ㄱ, 게시물 고정 ㄴ을 연결한다. 모두 철을 끌어당긴다는 인상만으로 쓰임을 같게 묶지 않는다. 제시한 구조의 모형만 판단하며 모든 제품으로 확대하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 코일이 철 조각을 붙잡아 옮김",
    "(2) 코일이 철편을 움직여 작은 종을 두드림",
    "(3) 전지 없이 막대자석으로 종이를 붙임"
   ],
   "options": [
    "ㄱ 소리로 알림",
    "ㄴ 게시물 붙이기",
    "ㄷ 철 조각 운반"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "ㄱ 소리로 알림",
    "ㄴ 게시물 붙이기",
    "ㄷ 철 조각 운반"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w087",
   "no": 87,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T11",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "방향 반전 비교 기준 “전원 분리→방향 변경·점검→같은 끝 관찰”로 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "먼저 분리한 ㄴ 뒤 방향 변경·점검 ㄷ을 한다. 같은 끝의 관찰 ㄱ로 이어져야 방향 변화와 반응을 비교할 수 있다. 관찰 끝이나 나침반 표시를 동시에 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 같은 끝과 나침반 N극의 반응을 비교한다.",
    "ㄴ 전지를 분리하고 스위치를 연다.",
    "ㄷ 코일은 그대로 두고 전지 방향만 바꾸어 점검받는다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄷ → ㄱ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "ㄱ 같은 끝과 나침반 N극의 반응을 비교한다.",
    "ㄴ 전지를 분리하고 스위치를 연다.",
    "ㄷ 코일은 그대로 두고 전지 방향만 바꾸어 점검받는다."
   ]
  },
  {
   "id": "c22-s62-u03-w088",
   "no": 88,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T17",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "쓰임 조사 기준 “구조 근거 찾기→작용 확인→용도 설명”으로 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "설명 자료에서 구조를 찾는 ㄴ을 바탕으로 작용 ㄷ을 확인하고 용도 ㄱ을 말한다. 겉사진을 보고 먼저 내부 구조를 정하지 않는다. 자료의 기기 종류와 범위도 함께 기록한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 확인한 작용을 기기의 용도와 연결한다.",
    "ㄴ 설명 자료에서 코일과 움직이는 부분을 찾는다.",
    "ㄷ 전류 제어로 어떤 작용이 생기는지 확인한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄷ → ㄱ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "ㄱ 확인한 작용을 기기의 용도와 연결한다.",
    "ㄴ 설명 자료에서 코일과 움직이는 부분을 찾는다.",
    "ㄷ 전류 제어로 어떤 작용이 생기는지 확인한다."
   ]
  },
  {
   "id": "c22-s62-u03-w089",
   "no": 89,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T10",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "반복 클립 기록이 뒷받침하는 말을 고르세요. (정답 3개)",
   "answer": "①, ③, ⑤",
   "explanation": "8>4,9>5,8>4라 두 전지 쪽이 모두 많고 가운데9는5의 두 배가 아니다. 같은 조건 안의 경향만 설명한다. 무제한 전지 증가·안전 보장·정확한 힘 수치로 확대하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "중간 반복은 클립 수가 정확히 두 배가 아니다.",
    "전지를 계속 늘리면 언제나 안전하게 더 많이 든다.",
    "철심·코일·거리·시간이 같다는 조건을 읽어야 한다.",
    "클립 수가 곧 자기력의 정확한 단위이다.",
    "이 조건에서는 두 전지 쪽이 매번 더 많이 들었다."
   ],
   "key": [
    0,
    2,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     2,
     4
    ]
   },
   "table": {
    "머리": [
     "전지 수",
     "1회",
     "2회",
     "3회"
    ],
    "행": [
     [
      "1개",
      "4개",
      "5개",
      "4개"
     ],
     [
      "2개",
      "8개",
      "9개",
      "8개"
     ]
    ]
   },
   "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "figure": "electricity-question-data-89"
  },
  {
   "id": "c22-s62-u03-w090",
   "no": 90,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T17",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "기기 쓰임 조사에서 알맞은 행동을 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "출처와 구조의 근거, 모르는 범위를 남겨야 한다. 색만으로 극이나 내부 구조를 정할 수 없다. 학생이 기구를 분해해 확인하거나 자료에 없는 부품을 지어내는 조사로 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "기구를 열지 못했으니 구조를 임의로 채운다.",
    "모르는 부분과 자료 범위도 표시한다.",
    "기기 설명 자료의 출처를 남긴다.",
    "사진 색만으로 전자석 극을 확정한다.",
    "실제 코일·움직이는 부분의 근거를 찾는다."
   ],
   "key": [
    1,
    2,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     2,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요."
  },
  {
   "id": "c22-s62-u03-w091",
   "no": 91,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T10",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "표에서 (1)두 전지 조건의 클립 수가 더 많은 반복 수 (2)정확히 두 배가 아닌 반복 수를 쓰세요.",
   "answer": "3회 / 1회",
   "explanation": "세 번 모두 두 전지 기록이 높으므로3회이다. 첫째·셋째는 두 배지만 둘째9는5의 두 배가 아니므로1회이다. 일부 두 배 결과가 있어도 모든 조건의 정비례 법칙이 되지는 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 3,
      "units": [
       "회",
       "번"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "3회"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 1,
      "units": [
       "회",
       "번"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "1회"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "전지 수",
     "1회",
     "2회",
     "3회"
    ],
    "행": [
     [
      "1개",
      "4개",
      "5개",
      "4개"
     ],
     [
      "2개",
      "8개",
      "9개",
      "8개"
     ]
    ]
   },
   "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "verificationModel": {
    "kind": "strength-repeat-counts",
    "model": "strength"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 3회 (단위 필요) / (2) 1회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-91"
  },
  {
   "id": "c22-s62-u03-w092",
   "no": 92,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T11",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "나침반 표로 판단한 왼쪽 끝의 극을 (1)처음 (2)반대 연결 뒤 순서로 쓰세요.",
   "answer": "N극 / S극",
   "explanation": "처음 왼쪽은 N극과 밀어내므로 N극이다. 반대 연결 뒤에는 N극을 끌어당기므로 S극이다. 같은 끝의 전후 반응을 읽으며 전지 수 변화로 이유를 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "N극",
       "N 극",
       "엔극"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "S극",
       "S 극",
       "에스극"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "위치와 연결",
     "확인된 나침반 N극과 반응"
    ],
    "행": [
     [
      "처음 왼쪽",
      "밀림"
     ],
     [
      "처음 오른쪽",
      "끌림"
     ],
     [
      "반대 연결 뒤 왼쪽",
      "끌림"
     ],
     [
      "반대 연결 뒤 오른쪽",
      "밀림"
     ]
    ]
   },
   "givens": "같은 코일에서 전원을 분리한 뒤 전지 방향만 반대로 바꾼 연습 기록이다. 주변 자석을 멀리 두고 같은 위치의 반응을 비교했다.",
   "verificationModel": {
    "kind": "compass-pole-inference",
    "model": "poles"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) N극 또는 N 극 또는 엔극 / (2) S극 또는 S 극 또는 에스극. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "같은 코일에서 전원을 분리한 뒤 전지 방향만 반대로 바꾼 연습 기록이다. 주변 자석을 멀리 두고 같은 위치의 반응을 비교했다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-92"
  },
  {
   "id": "c22-s62-u03-w093",
   "no": 93,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T10",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "클립을 더 가까이 대자 더 많이 붙었습니다. 전자석 자체가 더 세졌다고 할 수 있나요?",
   "answer": "거리 조건이 달라져 전자석 자체의 변화로 단정할 수 없다. 같은 철심·코일·클립과 같은 거리·접촉 방법·시간을 맞춘 뒤 비교해야 한다.",
   "explanation": "클립 수는 거리와 접촉 방법에도 영향을 받는다. 더 많이 붙은 관찰은 남기되 원인에 대한 결론은 제한한다. 준비한 클립 수만 늘리는 것도 전자석 자체의 세기 증가와 같은 말은 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "접근 거리 차이를 근거로 든다.",
    "자석 자체 변화와 관찰 방법 효과를 구별한다.",
    "공정한 비교 조건을 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "거리 조건이 달라져 전자석 자체의 변화로 단정할 수 없다. 같은 철심·코일·클립과 같은 거리·접촉 방법·시간을 맞춘 뒤 비교해야 한다.",
    "required": [
     "접근 거리 차이를 근거로 든다.",
     "자석 자체 변화와 관찰 방법 효과를 구별한다.",
     "공정한 비교 조건을 제안한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "접근 거리 차이를 근거로 든다. / 자석 자체 변화와 관찰 방법 효과를 구별한다. / 공정한 비교 조건을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w094",
   "no": 94,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T17",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "철 조각 운반 장치와 자석 게시판을 비교해, 전자석 제어가 필요한 까닭을 설명하세요.",
   "answer": "운반 장치는 철 조각을 잡고 옮긴 뒤 놓는 작용을 조절해야 한다. 전자석은 전류 제어를 이용할 수 있고, 제시한 게시판의 영구 자석은 전지 없이 작용한다.",
   "explanation": "두 장치의 기능과 제어 필요가 다르다. 전자석을 쓰는 구체적 구조의 설명 자료를 근거로 판단한다. 모든 운반 장치가 반드시 같은 방식이라고 확대하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "기기의 목적과 잡기·놓기를 연결한다.",
    "전류 제어의 역할을 설명한다.",
    "제시한 영구 자석 구조와 차이를 비교한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "운반 장치는 철 조각을 잡고 옮긴 뒤 놓는 작용을 조절해야 한다. 전자석은 전류 제어를 이용할 수 있고, 제시한 게시판의 영구 자석은 전지 없이 작용한다.",
    "required": [
     "기기의 목적과 잡기·놓기를 연결한다.",
     "전류 제어의 역할을 설명한다.",
     "제시한 영구 자석 구조와 차이를 비교한다."
    ],
    "exactStringScoring": false
   },
   "givens": "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다.",
   "formLabel": "까닭 설명",
   "criteria": "기기의 목적과 잡기·놓기를 연결한다. / 전류 제어의 역할을 설명한다. / 제시한 영구 자석 구조와 차이를 비교한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "given": [
    "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다."
   ],
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w095",
   "no": 95,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "전지 수에 따른 클립 비교 그림을 설계하세요. 바꿀 조건과 같게 할 거리·철심·코일·시간을 표시하고 결과 칸은 비워 두세요.",
   "answer": "같은 장치에서 허용 전지 한개/두개만 바꾸고 클립·거리·방법·시간을 고정한다. 전원 분리·교사 점검과 빈 반복표를 둔다.",
   "explanation": "비교 그림의 목적은 전지 수와 다른 조건을 분리하는 것이다. 클립 수가 정확히 두 배인 정답 그림을 미리 넣지 않는다. 정격과 실제 관찰을 함께 확인할 수 있어야 한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "바꿀 조건 한 가지를 표시한다.",
    "클립 접근 방법과 중요한 고정 조건을 표시한다.",
    "임의 전지 추가와 미리 채운 결과를 넣지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 장치에서 허용 전지 한개/두개만 바꾸고 클립·거리·방법·시간을 고정한다. 전원 분리·교사 점검과 빈 반복표를 둔다.",
    "required": [
     "바꿀 조건 한 가지를 표시한다.",
     "클립 접근 방법과 중요한 고정 조건을 표시한다.",
     "임의 전지 추가와 미리 채운 결과를 넣지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "바꿀 조건 한 가지를 표시한다. / 클립 접근 방법과 중요한 고정 조건을 표시한다. / 임의 전지 추가와 미리 채운 결과를 넣지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w096",
   "no": 96,
   "section": 6,
   "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T11",
   "topic": "전자석의 세기·극·쓰임을 비교해요",
   "prompt": "같은 전자석 끝의 극을 전지 방향 변경 전후로 비교할 그림과 표를 만드세요. 나침반의 확인된 N극과 관찰 칸을 표시하세요.",
   "answer": "같은 끝·같은 나침반 위치를 두고 전원 분리 뒤 방향만 바꾸는 두 상태를 그린다. 끌림/밀림/불분명과 판단한 극을 따로 남길 빈칸을 둔다.",
   "explanation": "극을 판단할 근거가 무엇인지 그림에서 읽을 수 있어야 한다. 눈에 보이지 않는 작용의 모양을 임의로 그려 극을 정하지 않는다. 불분명한 반응은 판단 보류로 남길 수 있게 한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "동일한 끝과 N극 기준을 유지한다.",
    "전지 방향 변경과 전원 분리를 표시한다.",
    "관찰 반응과 판단을 구별하고 미리 극을 채우지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 끝·같은 나침반 위치를 두고 전원 분리 뒤 방향만 바꾸는 두 상태를 그린다. 끌림/밀림/불분명과 판단한 극을 따로 남길 빈칸을 둔다.",
    "required": [
     "동일한 끝과 N극 기준을 유지한다.",
     "전지 방향 변경과 전원 분리를 표시한다.",
     "관찰 반응과 판단을 구별하고 미리 극을 채우지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "동일한 끝과 N극 기준을 유지한다. / 전지 방향 변경과 전원 분리를 표시한다. / 관찰 반응과 판단을 구별하고 미리 극을 채우지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "클립 수는 거리·철심·통전 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w097",
   "no": 97,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "점검 카드에서 어른에게 알려야 할 대응을 고르세요.",
   "answer": "④ 손상 기구는 쓰지 않고 알린다.",
   "explanation": "손상·이상 냄새가 있는 기구는 사용을 중단하고 어른에게 알려 점검받는다. 직접 만지거나 켜 보아 위험을 시험하지 않는다. 테이프 하나로 모든 손상 기구의 안전이 보장되는 것도 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "보이는 금속을 손으로 만져 시험한다.",
    "냄새가 나도 잠깐만 계속 켠다.",
    "전선에 테이프만 붙이면 항상 안전하다.",
    "손상 기구는 쓰지 않고 알린다.",
    "차단기를 반복 조작해 원인을 찾는다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "table": {
    "머리": [
     "기호",
     "사용 전 점검 카드"
    ],
    "행": [
     [
      "ㄱ",
      "피복이 찢어져 안쪽 금속이 보임"
     ],
     [
      "ㄴ",
      "정상 플러그 몸체를 마른 손으로 잡아 분리함"
     ],
     [
      "ㄷ",
      "기구에서 타는 냄새가 나 사용을 중단함"
     ],
     [
      "ㄹ",
      "기구 설명서의 지정 전지 종류를 확인함"
     ]
    ]
   },
   "givens": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ 손상 기구는 쓰지 않고 알린다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다."
   ],
   "figure": "electricity-question-data-97"
  },
  {
   "id": "c22-s62-u03-w098",
   "no": 98,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "실험 회로의 연결을 바꾸는 방법을 고르세요.",
   "answer": "② 전원을 분리한 뒤 점검받는다.",
   "explanation": "연결 변경 전에는 전원을 분리하고 바꾼 접속을 점검받아야 한다. 단락·임의 전지 증가·피복 훼손은 해결 방법이 아니다. 저전압 교육용 부품이라도 지정한 절차와 허용 조건을 지킨다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "스위치를 켠 채 금속 집게를 옮긴다.",
    "전원을 분리한 뒤 점검받는다.",
    "전지 양극을 전선만으로 잇는다.",
    "정격을 모르니 전지를 계속 더한다.",
    "손상된 피복을 칼로 더 넓게 벗긴다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "givens": "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 전원을 분리한 뒤 점검받는다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
   ]
  },
  {
   "id": "c22-s62-u03-w099",
   "no": 99,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "정상 플러그를 분리할 때 전선 대신 (1)을 잡고, 손상이나 열이 보이면 (2)에게 알려요. 보기: 몸체·어른",
   "answer": "몸체 / 어른",
   "explanation": "정상 기구는 전선에 힘을 주어 당기지 않고 플러그 몸체를 잡는다. 손상·열이 보이는 경우는 정상 분리 조건에서 빼고 어른에게 알린다. 학생이 콘센트 안쪽을 만져 점검하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "몸체",
       "플러그 몸체",
       "플러그 머리"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "어른",
       "교사",
       "선생님"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 몸체 또는 플러그 몸체 또는 플러그 머리 / (2) 어른 또는 교사 또는 선생님. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w100",
   "no": 100,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "전지는 설명서가 지정한 (1)와 종류를 확인하고 새것·헌것을 (2) 않아요. 보기: 크기·섞지",
   "answer": "크기 / 섞지",
   "explanation": "기구에 맞는 크기·종류와 올바른 방향을 확인한다. 새것과 헌것이나 서로 다른 종류를 섞지 않는다. 한 가지 크기의 전지가 모든 기구에 맞는다고 생각하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "크기",
       "규격"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "섞지"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 크기 또는 규격 / (2) 섞지. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w101",
   "no": 101,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "상황과 대응을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "정상 분리는 ㄷ, 손상 발견은 ㄱ, 회로 변경은 ㄴ이다. 상황에 따라 해야 할 행동의 범위가 다르다. 학생에게 손상 기구를 직접 시험하는 대안을 주지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 정상 플러그를 사용 뒤 분리함",
    "(2) 피복이 찢어진 기구를 발견함",
    "(3) 수업 코일 연결을 바꾸려 함"
   ],
   "options": [
    "ㄱ 사용하지 않고 어른에게 알림",
    "ㄴ 전원을 분리하고 교사 점검",
    "ㄷ 마른 손으로 몸체를 잡음"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "ㄱ 사용하지 않고 어른에게 알림",
    "ㄴ 전원을 분리하고 교사 점검",
    "ㄷ 마른 손으로 몸체를 잡음"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w102",
   "no": 102,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "자료와 확인할 내용을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "설명서는 지정 규격 ㄷ, 겉 점검은 징후 ㄱ, 수업 절차는 허용 방법 ㄴ을 확인하는 데 쓴다. 서로 다른 자료의 역할을 나누어 읽는다. 학생이 내부를 분해하거나 위험을 만들어 확인하는 방식은 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 기구 설명서",
    "(2) 실제 사용 전 겉 점검",
    "(3) 교사가 정한 실험 절차"
   ],
   "options": [
    "ㄱ 손상·이상 징후",
    "ㄴ 허용 부품과 통전 방법",
    "ㄷ 지정 전지 크기·종류"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "ㄱ 손상·이상 징후",
    "ㄴ 허용 부품과 통전 방법",
    "ㄷ 지정 전지 크기·종류"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w103",
   "no": 103,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "이상 징후 대응 기준 “사용 중단→어른에게 알림→점검 전 재사용 금지”로 배열하세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "제시된 기준대로 ㄴ·ㄱ·ㄷ이다. 냄새·손상이 있는 기구를 다시 켜 원인을 시험하는 순서로 바꾸지 않는다. 어른의 점검과 학생의 대응 범위를 구별하는 문제이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 어른이나 교사에게 상황을 알린다.",
    "ㄴ 이상 징후가 있는 기구의 사용을 멈춘다.",
    "ㄷ 점검받기 전에는 다시 켜서 시험하지 않는다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄱ → ㄷ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "ㄱ 어른이나 교사에게 상황을 알린다.",
    "ㄴ 이상 징후가 있는 기구의 사용을 멈춘다.",
    "ㄷ 점검받기 전에는 다시 켜서 시험하지 않는다."
   ]
  },
  {
   "id": "c22-s62-u03-w104",
   "no": 104,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "수업 준비 기준 “지정 부품 확인→전원 분리 연결→교사 점검”을 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "허용 부품 확인 ㄷ, 꺼진 회로의 연결 ㄱ, 교사 점검 ㄴ 순서이다. 단순히 한 번 켜졌다는 결과로 정격 확인을 생략하지 않는다. 실제 통전 시간은 점검 이후 안내에 따른다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 전원이 분리된 지정 회로에 부품을 잇는다.",
    "ㄴ 교사에게 접속·정격을 점검받는다.",
    "ㄷ 설명서와 교사가 허용한 부품을 확인한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "ㄱ 전원이 분리된 지정 회로에 부품을 잇는다.",
    "ㄴ 교사에게 접속·정격을 점검받는다.",
    "ㄷ 설명서와 교사가 허용한 부품을 확인한다."
   ]
  },
  {
   "id": "c22-s62-u03-w105",
   "no": 105,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "전지 관리 자료와 맞는 계획을 고르세요. (정답 3개)",
   "answer": "①, ②, ④",
   "explanation": "지정 규격·극 표시·뜻하지 않은 단락 방지가 필요하다. 새것과 헌것을 섞거나 불에 넣는 계획은 맞지 않는다. 폐기·수거는 학교와 지역의 실제 안내를 어른과 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "지정된 크기·종류의 전지를 쓴다.",
    "+·− 표시를 확인해 넣는다.",
    "새 전지와 헌 전지를 섞어 쓴다.",
    "금속 물체가 전지 양극을 직접 잇지 않게 한다.",
    "분리한 전지를 불에 넣어 처리한다."
   ],
   "key": [
    0,
    1,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     1,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ④. 선택한 순서는 관계없다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요."
  },
  {
   "id": "c22-s62-u03-w106",
   "no": 106,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "학생의 안전 점검 범위를 넘는 행동을 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "내부 분해·콘센트 금속 삽입·차단기 임의 조작은 학생의 점검 과제가 아니다. 겉의 이상을 알리고 자료에서 조건을 읽는 행동과 구별한다. 실제 위험을 만들어 보는 것을 학습 확인으로 요구하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "설명서에서 지정 규격을 읽는다.",
    "콘센트 구멍에 금속을 넣어 시험한다.",
    "차단기를 임의로 조작해 위험을 재현한다.",
    "피복 손상을 어른에게 알린다.",
    "전기 기구를 분해해 내부를 만진다."
   ],
   "key": [
    1,
    2,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     2,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요."
  },
  {
   "id": "c22-s62-u03-w107",
   "no": 107,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "표에서 (1)사용하지 않고 어른에게 알려야 할 징후 카드 수 (2)그렇지 않은 정상 확인 카드 수를 쓰세요.",
   "answer": "2개 / 2개",
   "explanation": "손상 ㄱ과 타는 냄새 ㄷ은2개 징후 카드이다. 정상 분리와 규격 확인인 ㄴ·ㄹ은2개다. 분류를 맞혔다고 실제 기구 점검을 수행한 것으로 세지는 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "기호",
     "사용 전 점검 카드"
    ],
    "행": [
     [
      "ㄱ",
      "피복이 찢어져 안쪽 금속이 보임"
     ],
     [
      "ㄴ",
      "정상 플러그 몸체를 마른 손으로 잡아 분리함"
     ],
     [
      "ㄷ",
      "기구에서 타는 냄새가 나 사용을 중단함"
     ],
     [
      "ㄹ",
      "기구 설명서의 지정 전지 종류를 확인함"
     ]
    ]
   },
   "givens": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
   "verificationModel": {
    "kind": "safety-situation-counts",
    "model": "safety"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 2개 (단위 필요) / (2) 2개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-107"
  },
  {
   "id": "c22-s62-u03-w108",
   "no": 108,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "점검 기록에서 (1)확인을 마친 항목 수 (2)아직 확인하지 않은 항목 수를 쓰세요.",
   "answer": "2개 / 2개",
   "explanation": "앞의 두 항목은 확인을 마쳤고 뒤의 두 항목은 남아 있으므로2개·2개이다. 아직 정하지 않은 항목을0초나 문제 없음으로 추정하지 않는다. 남은 조건 확인 전에는 실행 준비가 모두 끝난 것이 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "항목",
     "기록"
    ],
    "행": [
     [
      "전지 규격",
      "설명서와 교사 확인 완료"
     ],
     [
      "전구 접점",
      "교사 확인 완료"
     ],
     [
      "코일 허용 조건",
      "아직 확인하지 않음"
     ],
     [
      "통전 시간",
      "아직 정하지 않음"
     ]
    ]
   },
   "givens": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "formLabel": "자료 해석",
   "criteria": "(1) 2개 (단위 필요) / (2) 2개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "given": [
    "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-108"
  },
  {
   "id": "c22-s62-u03-w109",
   "no": 109,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "“한 번 불이 켜졌으니 부품 정격은 확인하지 않아도 된다”는 말을 검토하세요.",
   "answer": "켜졌다는 관찰만으로 부품 정격과 통전 안전이 확인되지는 않는다. 설명서와 교사 점검으로 허용 전지 수·부품·시간을 확인한 뒤 사용해야 한다.",
   "explanation": "작동했다는 결과와 안전한 사용 범위는 같은 증거가 아니다. 무리한 조건에서도 잠깐 켜질 수 있으므로 결과만을 기준으로 계속 사용하지 않는다. 위험한 조건을 실제로 시험해 보라는 과제도 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "켜짐과 허용 조건을 구별한다.",
    "규격과 통전 시간을 확인한다.",
    "지정 자료·교사 점검의 역할을 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "켜졌다는 관찰만으로 부품 정격과 통전 안전이 확인되지는 않는다. 설명서와 교사 점검으로 허용 전지 수·부품·시간을 확인한 뒤 사용해야 한다.",
    "required": [
     "켜짐과 허용 조건을 구별한다.",
     "규격과 통전 시간을 확인한다.",
     "지정 자료·교사 점검의 역할을 설명한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "켜짐과 허용 조건을 구별한다. / 규격과 통전 시간을 확인한다. / 지정 자료·교사 점검의 역할을 설명한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w110",
   "no": 110,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "손상된 전선 사진을 보고 “테이프를 붙이면 모두 해결된다”고 했습니다. 어떤 안내가 필요한가요?",
   "answer": "사진만으로 손상의 범위와 내부 상태를 다 알 수 없다. 학생은 사용하지 않고 어른에게 알려 점검받아야 하며 테이프만으로 항상 안전하다고 보장하지 않는다.",
   "explanation": "겉에 덮개를 붙였다고 내부 손상·정격·접촉 문제가 모두 사라지는 것은 아니다. 점검 권한과 학생의 행동 범위를 구별한다. 실제 손상 기구를 만지거나 켜 보게 하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "사진의 판단 한계를 설명한다.",
    "사용 중단과 어른 점검을 제안한다.",
    "임의 수리만으로 안전을 보장하지 않는다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "사진만으로 손상의 범위와 내부 상태를 다 알 수 없다. 학생은 사용하지 않고 어른에게 알려 점검받아야 하며 테이프만으로 항상 안전하다고 보장하지 않는다.",
    "required": [
     "사진의 판단 한계를 설명한다.",
     "사용 중단과 어른 점검을 제안한다.",
     "임의 수리만으로 안전을 보장하지 않는다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "사진의 판단 한계를 설명한다. / 사용 중단과 어른 점검을 제안한다. / 임의 수리만으로 안전을 보장하지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w111",
   "no": 111,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "교실의 “사용 전 확인 지도”를 그리세요. 학생이 살펴 알릴 일과 어른이 점검할 일을 구역으로 나누세요.",
   "answer": "학생 구역에는 겉 손상·사용 여부·설명서 읽기, 어른 구역에는 정격·내부 이상·시설 점검을 둔다. 위험 기구는 만지지 않고 알리는 연결을 표시한다.",
   "explanation": "안전 지도는 위험을 재현하는 실험 설계가 아니다. 누구에게 무엇을 알려야 하는지 표현했는지 본다. 점검하지 못한 곳은 안전하다고 채우지 않고 확인 필요로 남긴다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "학생·어른의 역할을 나눈다.",
    "위험 징후의 알림 경로를 표시한다.",
    "콘센트·차단기·분해 시험을 학생 행동으로 넣지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "학생 구역에는 겉 손상·사용 여부·설명서 읽기, 어른 구역에는 정격·내부 이상·시설 점검을 둔다. 위험 기구는 만지지 않고 알리는 연결을 표시한다.",
    "required": [
     "학생·어른의 역할을 나눈다.",
     "위험 징후의 알림 경로를 표시한다.",
     "콘센트·차단기·분해 시험을 학생 행동으로 넣지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "학생·어른의 역할을 나눈다. / 위험 징후의 알림 경로를 표시한다. / 콘센트·차단기·분해 시험을 학생 행동으로 넣지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w112",
   "no": 112,
   "section": 7,
   "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T13",
   "topic": "전기를 안전하게 사용하는 근거를 찾아요",
   "prompt": "저전압 수업의 연결 변경 전후를 안내하는 두 칸 카드를 만드세요. 전원 분리와 교사 점검이 어디에 필요한지 표시하세요.",
   "answer": "첫 칸은 스위치를 열고 전지를 분리한 변경 준비, 둘째 칸은 수정한 접속·정격을 교사에게 점검받은 뒤 짧게 관찰하는 절차를 둔다.",
   "explanation": "안내 그림의 순서와 실제 접점이 읽혀야 한다. 단순한 금지 표어보다 어떤 때 어떤 확인을 할지 설명하도록 한다. 그림 작성과 실제 점검 완료는 따로 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "전원 분리를 변경 전에 둔다.",
    "점검을 통전 전에 둔다.",
    "단락·임의 전지 증가·피복 훼손을 해결책으로 넣지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "첫 칸은 스위치를 열고 전지를 분리한 변경 준비, 둘째 칸은 수정한 접속·정격을 교사에게 점검받은 뒤 짧게 관찰하는 절차를 둔다.",
    "required": [
     "전원 분리를 변경 전에 둔다.",
     "점검을 통전 전에 둔다.",
     "단락·임의 전지 증가·피복 훼손을 해결책으로 넣지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "전원 분리를 변경 전에 둔다. / 점검을 통전 전에 둔다. / 단락·임의 전지 증가·피복 훼손을 해결책으로 넣지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w113",
   "no": 113,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T14",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "필요한 기능을 유지하며 낭비를 줄인 계획을 고르세요.",
   "answer": "⑤ 빈 교실의 필요 없는 조명을 끈다.",
   "explanation": "사용하지 않는 조명 등 불필요한 사용을 줄이는 계획이 맞다. 필요한 보관·환기·밝기까지 무조건 없애는 것은 효율적인 이용과 다르다. 사람의 사용과 안전·건강 조건을 함께 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "식품 보관에 필요한 냉장도 오래 끈다.",
    "환기가 필요해도 문을 영원히 막는다.",
    "밝기를 보지 않고 모든 조명을 끈다.",
    "추운 교실에서 냉방과 난방을 함께 켠다.",
    "빈 교실의 필요 없는 조명을 끈다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ⑤ 빈 교실의 필요 없는 조명을 끈다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요."
  },
  {
   "id": "c22-s62-u03-w114",
   "no": 114,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "실제로 실행한 기록에 해당하는 것을 고르세요.",
   "answer": "③ 화요일 점심에 교사와 조명을 끄고 기록했다.",
   "explanation": "정한 행동을 실제로 하고 날짜와 근거를 남긴 첫 기록이 실행에 해당한다. 계획·화면 이동·제공 자료 전사는 실행의 근거가 아니다. 이 기록만으로 절약량까지 측정했다고 할 수는 없다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "실천할 날짜를 아직 정하지 않고 제목만 적었다.",
    "언젠가 끄겠다고 계획 카드에만 써 두었다.",
    "화요일 점심에 교사와 조명을 끄고 기록했다.",
    "다음 화면으로 이동해 활동 완료라고 적었다.",
    "제공된 연습표를 우리 반 측정으로 옮겨 적었다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 화요일 점심에 교사와 조명을 끄고 기록했다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요."
  },
  {
   "id": "c22-s62-u03-w115",
   "no": 115,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "어디서·언제·무엇을 할지 정한 것은 (1), 정한 행동을 실제로 한 것은 (2)이에요. 보기: 계획·실행",
   "answer": "계획 / 실행",
   "explanation": "실행할 내용을 정하는 것과 실제로 행동하는 것은 다른 단계이다. 계획이 자세해도 자동으로 실천 완료가 되지 않는다. 실행 여부는 실제 날짜·행동·근거를 따로 남겨 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "계획"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "실행",
       "실천"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 계획 / (2) 실행 또는 실천. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w116",
   "no": 116,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "아직 행동하지 않았다면 (1)으로 남기고, 실제 기간이 지난 뒤 기록을 돌아보는 것은 (2)이에요. 보기: 미실행·검토",
   "answer": "미실행 / 검토",
   "explanation": "미실행은 아직 수행하지 않은 상태를 뜻한다. 검토는 실행 기록을 돌아보고 조건과 한계를 살피는 단계이다. 예정한 기간이 오기 전에 효과를 측정한 것처럼 쓰지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "미실행",
       "미실천"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "검토",
       "되돌아보기"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 미실행 또는 미실천 / (2) 검토 또는 되돌아보기. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w117",
   "no": 117,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "기록과 단계를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "하기로 정한 것은 계획 ㄷ, 실제 행동은 실행 ㄱ, 기간 뒤 되돌아보기는 검토 ㄴ이다. 정답 수나 문서 제목을 단계의 증거로 대신하지 않는다. 각 기록이 말하는 실제 상태를 읽는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 점심에 빈 교실 조명을 끄기로 정함",
    "(2) 화요일 실제로 끄고 날짜를 남김",
    "(3) 주말에 빠뜨린 날과 불편을 살핌"
   ],
   "options": [
    "ㄱ 실행",
    "ㄴ 검토",
    "ㄷ 계획"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "given": [
    "ㄱ 실행",
    "ㄴ 검토",
    "ㄷ 계획"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w118",
   "no": 118,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T14",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "효율적 사용 제안과 확인할 조건을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "조명은 사용·밝기 ㄷ, 냉장고는 보관·개방 필요 ㄱ, 냉방은 환기·이용 ㄴ과 연결한다. 필요한 기능을 해치지 않는 조건을 구체적으로 살펴야 한다. 모든 전원을 무조건 끄는 한 가지 방법과 다르다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "kind": "short-text",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 불필요한 조명 끄기",
    "(2) 냉장고 문 여는 시간 줄이기",
    "(3) 냉방 중 불필요한 개방 줄이기"
   ],
   "options": [
    "ㄱ 식품 보관과 문을 열어 둘 필요",
    "ㄴ 필요한 환기와 실내 이용 조건",
    "ㄷ 사람 사용 여부와 필요한 밝기"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "given": [
    "ㄱ 식품 보관과 문을 열어 둘 필요",
    "ㄴ 필요한 환기와 실내 이용 조건",
    "ㄷ 사람 사용 여부와 필요한 밝기"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u03-w119",
   "no": 119,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "실천 과정 “구체적 계획→실제 행동→기간 뒤 검토”로 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "구체적 계획 ㄴ 뒤 실제 행동 ㄷ, 기록을 돌아보는 ㄱ 순서이다. 실행하기 전에 효과를 성공으로 쓰는 순서로 바꾸지 않는다. 아직 기간이 안 지났다면 검토는 미완료로 남길 수 있다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 실행한 날과 빠뜨린 날을 돌아본다.",
    "ㄴ 장소·행동·기간·확인 방법을 정한다.",
    "ㄷ 교사와 허락된 행동을 실제로 하고 기록한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄷ → ㄱ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "given": [
    "ㄱ 실행한 날과 빠뜨린 날을 돌아본다.",
    "ㄴ 장소·행동·기간·확인 방법을 정한다.",
    "ㄷ 교사와 허락된 행동을 실제로 하고 기록한다."
   ]
  },
  {
   "id": "c22-s62-u03-w120",
   "no": 120,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "효과 설명 기준 “측정 여부 확인→비교 조건 점검→알 수 있는 범위 말하기”로 배열하세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "실측 여부 ㄴ을 먼저 확인하고 비교 조건 ㄱ을 살핀다. 그 뒤 ㄷ처럼 시간의 변화와 전기 사용량의 판단을 구별한다. 기분이나 목표를 측정한 절약량으로 바꾸지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 같은 기간·사용 일정이었는지 본다.",
    "ㄴ 전기 사용량을 실제로 쟀는지 확인한다.",
    "ㄷ 확인한 시간 변화와 모르는 절약량을 나누어 말한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄱ → ㄷ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "given": [
    "ㄱ 같은 기간·사용 일정이었는지 본다.",
    "ㄴ 전기 사용량을 실제로 쟀는지 확인한다.",
    "ㄷ 확인한 시간 변화와 모르는 절약량을 나누어 말한다."
   ]
  },
  {
   "id": "c22-s62-u03-w121",
   "no": 121,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T14",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "실행 가능한 안전·절약 계획의 요소를 고르세요. (정답 3개)",
   "answer": "②, ③, ④",
   "explanation": "장소·행동, 기간·확인 방법, 필요한 이용 조건이 있어야 실제로 실행하고 돌아볼 수 있다. 불편을 숨기거나 시설을 분해하는 계획은 목적에 맞지 않는다. 타당한 대안과 미실행 상태도 남길 수 있어야 한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "모든 시설을 학생이 열어 직접 시험한다.",
    "장소와 구체적 행동을 정한다.",
    "실행할 기간과 확인 방법을 정한다.",
    "필요한 밝기·환기 조건을 확인한다.",
    "불편이 생겨도 무조건 성공이라고 적는다."
   ],
   "key": [
    1,
    2,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     2,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ④. 선택한 순서는 관계없다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요."
  },
  {
   "id": "c22-s62-u03-w122",
   "no": 122,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "실제 수행과 기록을 바르게 연결한 것을 고르세요. (정답 3개)",
   "answer": "②, ④, ⑤",
   "explanation": "미실행 이유, 실제 날짜·행동, 모르는 효과를 구별해 적은 세 설명이 맞다. 사용 시간을 줄인 기록만으로 요금·배출량을 측정한 것이 아니다. 계획과 실행도 같은 기록으로 취급하지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "시간을 줄였으니 요금도 정확히 계산했다고 쓴다.",
    "직접 확인한 날짜와 행동을 남긴다.",
    "계획만 세웠어도 실행했다고 표시한다.",
    "아직 모르는 효과는 추가 확인으로 남긴다.",
    "못 실행했으면 이유와 다음 기회를 남긴다."
   ],
   "key": [
    1,
    3,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     3,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ④, ⑤. 선택한 순서는 관계없다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요."
  },
  {
   "id": "c22-s62-u03-w123",
   "no": 123,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T14",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "표에서 (1)전의 불필요 점등 시간 합계 (2)후의 합계를 단위와 함께 쓰세요.",
   "answer": "180분 / 90분",
   "explanation": "전은60+60+60=180분이고 후는35+30+25=90분이다. 불필요 점등 시간의 합계를 읽은 값이다. 필요한 밝기는 유지한 가정이며 이 숫자가 실제 전기 사용량이나 요금은 아니다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 180,
      "units": [
       "분"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "180분"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 90,
      "units": [
       "분"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "90분"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "전: 불필요하게 켠 시간",
     "후: 불필요하게 켠 시간"
    ],
    "행": [
     [
      "1일",
      "60분",
      "35분"
     ],
     [
      "2일",
      "60분",
      "30분"
     ],
     [
      "3일",
      "60분",
      "25분"
     ]
    ]
   },
   "givens": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
   "verificationModel": {
    "kind": "unnecessary-time-sums",
    "model": "time"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 180분 (단위 필요) / (2) 90분 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "given": [
    "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-123"
  },
  {
   "id": "c22-s62-u03-w124",
   "no": 124,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "단계 카드에서 (1)계획 카드 수 (2)실행 카드 수를 쓰세요.",
   "answer": "2개 / 1개",
   "explanation": "계획은 가·라 두 개이고 실행은 나 한 개이다. 다는 검토로 구별한다. 한 사람의 수행 횟수나 절약 효과가 아니라 제시한 카드의 단계 종류를 센 값이다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 1,
      "units": [
       "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "1개"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "카드",
     "내용"
    ],
    "행": [
     [
      "가",
      "다음 주 점심에 끄기로 정한 계획"
     ],
     [
      "나",
      "실제로 끄고 날짜를 적은 실행"
     ],
     [
      "다",
      "기간 뒤 빠뜨린 날을 살핀 검토"
     ],
     [
      "라",
      "실천할 장소와 담당을 정한 계획"
     ]
    ]
   },
   "givens": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "verificationModel": {
    "kind": "action-stage-counts",
    "model": "actionStages"
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 2개 (단위 필요) / (2) 1개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "given": [
    "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "electricity-question-data-124"
  },
  {
   "id": "c22-s62-u03-w125",
   "no": 125,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "“조명을 켠 시간이 절반이니 전기요금도 정확히 절반 줄었다”는 주장을 검토하세요.",
   "answer": "표는 불필요 점등 시간의 변화이며 전기 사용량·요금을 측정하지 않았다. 다른 사용과 요금 조건을 알 수 없으므로 정확한 요금 절감을 단정하지 않고 필요한 자료를 더 확인해야 한다.",
   "explanation": "주어진 합계 시간은180분에서90분으로 줄지만 그 값만으로 전체 전기요금을 계산하지 못한다. 같은 조명이라는 조건도 전체 사용·요금 조건을 대신하지 않는다. 실제 측정과 예상을 분리한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "측정한 시간과 요금·사용량을 구별한다.",
    "정확한 효과 단정을 제한한다.",
    "추가 자료와 비교 조건을 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "표는 불필요 점등 시간의 변화이며 전기 사용량·요금을 측정하지 않았다. 다른 사용과 요금 조건을 알 수 없으므로 정확한 요금 절감을 단정하지 않고 필요한 자료를 더 확인해야 한다.",
    "required": [
     "측정한 시간과 요금·사용량을 구별한다.",
     "정확한 효과 단정을 제한한다.",
     "추가 자료와 비교 조건을 제안한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "날짜",
     "전: 불필요하게 켠 시간",
     "후: 불필요하게 켠 시간"
    ],
    "행": [
     [
      "1일",
      "60분",
      "35분"
     ],
     [
      "2일",
      "60분",
      "30분"
     ],
     [
      "3일",
      "60분",
      "25분"
     ]
    ]
   },
   "givens": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
   "formLabel": "까닭 설명",
   "criteria": "측정한 시간과 요금·사용량을 구별한다. / 정확한 효과 단정을 제한한다. / 추가 자료와 비교 조건을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "given": [
    "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다."
   ],
   "lines": 6,
   "figure": "electricity-question-data-125"
  },
  {
   "id": "c22-s62-u03-w126",
   "no": 126,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "실천 기간이 아직 끝나지 않았는데 “모두 성공”이라고 썼습니다. 어떤 기록으로 고쳐야 하나요?",
   "answer": "지금까지 실제로 한 날짜와 못 한 일을 나누고, 기간 뒤 검토는 아직 미완료로 남긴다. 성공 여부와 효과는 정한 기간·확인 자료가 갖춰진 뒤 판단한다.",
   "explanation": "시작한 것과 기간 전체를 마친 것은 다른 상태이다. 잘한 점이 있어도 남은 기간을 지우지 않는다. 실제 기록을 바탕으로 다음 기회와 확인할 점을 정하도록 지도한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "현재 실행 근거를 나눈다.",
    "아직 오지 않은 검토를 완료로 표시하지 않는다.",
    "평가할 조건과 다음 확인을 남긴다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "지금까지 실제로 한 날짜와 못 한 일을 나누고, 기간 뒤 검토는 아직 미완료로 남긴다. 성공 여부와 효과는 정한 기간·확인 자료가 갖춰진 뒤 판단한다.",
    "required": [
     "현재 실행 근거를 나눈다.",
     "아직 오지 않은 검토를 완료로 표시하지 않는다.",
     "평가할 조건과 다음 확인을 남긴다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "현재 실행 근거를 나눈다. / 아직 오지 않은 검토를 완료로 표시하지 않는다. / 평가할 조건과 다음 확인을 남긴다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u03-w127",
   "no": 127,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "교실에서 할 안전·절약 실천 카드를 만드세요. 장소·행동·담당·기간·확인 방법과 미실행 칸을 배치하세요.",
   "answer": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
   "explanation": "실천 카드는 표어만 적는 것이 아니라 실제 행동을 확인할 수 있어야 한다. 아직 실행하지 않은 것을 완료 그림으로 표시하지 않는다. 정해진 기간 뒤 검토할 공간도 마련한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "구체적 실행 조건을 담는다.",
    "실제 행동·근거와 미실행을 구별한다.",
    "필요한 기능과 안전 범위를 유지한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
    "required": [
     "구체적 실행 조건을 담는다.",
     "실제 행동·근거와 미실행을 구별한다.",
     "필요한 기능과 안전 범위를 유지한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "구체적 실행 조건을 담는다. / 실제 행동·근거와 미실행을 구별한다. / 필요한 기능과 안전 범위를 유지한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u03-w128",
   "no": 128,
   "section": 8,
   "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T18",
   "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "prompt": "실천 결과를 나눌 설명판을 그리세요. 계획·실제 실행·확인한 변화·아직 모르는 효과를 네 구역으로 구별하세요.",
   "answer": "네 구역에 자료 종류·날짜·사용 조건을 남기고 시간 변화와 전기 사용량/요금 미측정을 구별한다. 받은 질문과 다음 확인 공간을 둔다.",
   "explanation": "좋은 결과만 크게 쓰는 대신 근거와 한계를 읽을 수 있게 편집한다. 측정하지 않은 절약량을 꾸며 채우지 않는다. 설명판 제작과 실제로 다른 사람에게 설명한 수행도 따로 확인한다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과15-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅲ. 전기의 이용",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "계획과 실제 수행을 나눈다.",
    "확인한 변화와 효과의 한계를 구별한다.",
    "질문·추가 자료·다음 검토를 남긴다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "네 구역에 자료 종류·날짜·사용 조건을 남기고 시간 변화와 전기 사용량/요금 미측정을 구별한다. 받은 질문과 다음 확인 공간을 둔다.",
    "required": [
     "계획과 실제 수행을 나눈다.",
     "확인한 변화와 효과의 한계를 구별한다.",
     "질문·추가 자료·다음 검토를 남긴다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "계획과 실제 수행을 나눈다. / 확인한 변화와 효과의 한계를 구별한다. / 질문·추가 자료·다음 검토를 남긴다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
   "drawing": "large"
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "전기의 이용",
   "blocks": [
    {
     "type": "diagram",
     "key": "bulb"
    },
    {
     "type": "text",
     "text": "전구의 두 접점을 찾아 회로를 만들고, 한 개와 두 개의 전지를 비교해요. 직접 만든 전자석의 성질과 생활 속 쓰임을 근거로 잇고 안전·절약 계획을 실천해요."
    },
    {
     "type": "field",
     "title": "이름·날짜와 내가 궁금한 것",
     "hint": "연결·밝기·자석·생활에서 확인하고 싶은 질문을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진·제공 연습 자료·실제 관찰 기록을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 점검한 교육용 부품과 허용 조건으로 활동해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "layout": "electricity-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "연결에서 실제 실천까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 전구의 두 접점을 찾아요",
       "1~16번"
      ],
      [
       "2. 끊기지 않는 연결과 재료를 비교해요",
       "17~32번"
      ],
      [
       "3. 전지 한 개와 두 개를 연결해요",
       "33~48번"
      ],
      [
       "4. 같은 조건으로 밝기를 비교해요",
       "49~64번"
      ],
      [
       "5. 전자석을 만들어 연결 전후를 관찰해요",
       "65~80번"
      ],
      [
       "6. 전자석의 세기·극·쓰임을 비교해요",
       "81~96번"
      ],
      [
       "7. 전기를 안전하게 사용하는 근거를 찾아요",
       "97~112번"
      ],
      [
       "8. 전기를 아끼는 계획을 실천하고 돌아봐요",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "8형식 각16개, 모두128문항이에요. 부분별 답은 질문 바로 아래에 써요. 그림에는 이름표와 설명을 붙여요. **핵심 정리·더 알아보기·내가 정리할 것**도 함께 읽어요."
    },
    {
     "type": "field",
     "title": "공부 계획",
     "hint": "네 차시 각40분·별도 확인45분은 수업 예시예요. 교재 전체는 상황에 맞게 여러 시간에 나누어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문제 응답과 실제 제작·관찰·조사·실천은 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "못 한 활동은 미실행·미관찰로 남겨 다음 기회를 정해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 1",
   "title": "전구의 두 접점을 찾아요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "금속 접점",
       "다른 부품의 금속과 직접 닿아 이어지는 곳"
      ],
      [
       "전구의 두 접점",
       "옆 금속과 바닥 금속으로 나뉜 부분"
      ],
      [
       "절연 부분",
       "서로 다른 금속 접점이 바로 닿지 않게 나누는 부분"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "bulb"
    },
    {
     "type": "text",
     "text": "작은 전구의 겉에서 **옆 금속·바닥 금속·유리·절연 부분**을 찾아요. 유리 겉면이나 전선의 색을 금속 접점으로 쓰지 않아요. 전지와 분리한 상태에서 교사가 확인한 부품을 살펴요."
    },
    {
     "type": "table",
     "heads": [
      "부품",
      "연결에서 하는 일"
     ],
     "rows": [
      [
       "전지",
       "회로에 전기를 공급한다."
      ],
      [
       "전구",
       "연결 조건이 맞을 때 전기로 빛을 낸다."
      ],
      [
       "스위치",
       "전기가 흐르는 길을 열고 닫는다."
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "전구의 두 접점을 찾아요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "전구의 옆 금속과 바닥 금속 사이에 검은 부분이 보여요. 검은 부분도 금속 접점 하나로 세면 될까요?",
     "steps": [
      [
       "겉에서 나누기",
       "사진의 색 이름과 실물에서 확인한 재료·역할을 구별해요."
      ],
      [
       "접점 찾기",
       "서로 떨어진 두 금속 접점의 위치를 찾아요."
      ],
      [
       "확인 범위",
       "절연 부분을 제3의 금속 접점이라고 더하지 않아요."
      ]
     ],
     "answer": "옆·바닥 금속을 나누고 그 사이 절연 부분은 따로 표시해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w001",
      "c22-s62-u03-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 3~5",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w003",
      "c22-s62-u03-w004",
      "c22-s62-u03-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 6~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w006",
      "c22-s62-u03-w007",
      "c22-s62-u03-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w009",
      "c22-s62-u03-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 11",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 12",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 13",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 14",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 15",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 16",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 01",
   "title": "접점을 찾아 회로를 만들어요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "전원을 분리한 상태에서 전구의 두 접점과 전지의 극을 확인해요.",
      "교사가 확인한 교육용 부품을 연결하고 점검받아요.",
      "실제 켜짐과 접점 스케치·미확인 부분을 나누어 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "확인한 접점",
      "연결 스케치·실제 상태",
      "아직 모르는 것"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "activity-circuit-build-do01",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 2",
   "title": "끊기지 않는 연결과 재료를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "전기 회로",
       "전지·전구·전선 등을 이어 만든 길"
      ],
      [
       "닫힌 연결",
       "전지의 서로 다른 극에서 전구를 거쳐 돌아오는 끊기지 않은 길"
      ],
      [
       "전기가 통하는 재료",
       "시험 조건에서 전기를 통하게 하는 재료"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 점검한 전지·필라멘트 전구 하나로 **전지의 서로 다른 극과 전구의 서로 다른 두 접점**을 이어 돌아오는 길을 만들어요. 선 개수나 색만 세지 말고 금속끼리 실제로 닿는 곳을 확인해요."
    },
    {
     "type": "table",
     "heads": [
      "연결·재료 확인",
      "기록할 근거"
     ],
     "rows": [
      [
       "스위치를 열고 닫는다.",
       "길이 끊기는 위치와 전구의 실제 상태"
      ],
      [
       "집게를 댄 부분을 살핀다.",
       "금속인지 피복·유리인지"
      ],
      [
       "재료 하나를 바꿔 비교한다.",
       "나머지 연결과 시험 조건을 같게 한 기록"
      ]
     ]
    },
    {
     "type": "text",
     "text": "정상 부품·접촉·전지 상태를 확인해야 재료의 영향과 연결 불량을 나눌 수 있어요. 전지의 양극을 전선만으로 직접 잇는 시험은 하지 않아요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "끊기지 않는 연결과 재료를 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "모든 선이 둥글게 놓였지만 전구 양쪽이 전지의 같은 단자에만 이어졌어요. 모양만으로 켜진다고 할 수 있을까요?",
     "steps": [
      [
       "접점 따라가기",
       "전구의 각 접점이 어느 전지 단자와 이어지는지 하나씩 찾아요."
      ],
      [
       "조건 확인",
       "서로 다른 전지 극과 이어 돌아오는 길인지 확인해요."
      ],
      [
       "다음 행동",
       "전원을 분리한 뒤 교사와 연결을 점검해요."
      ]
     ],
     "answer": "둥근 겉모양만으로 판단하지 않고 실제 접점의 대응을 확인해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 17",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 18~19",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w018",
      "c22-s62-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 20~21",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w020",
      "c22-s62-u03-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 22~24",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w022",
      "c22-s62-u03-w023",
      "c22-s62-u03-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 25",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 26",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 27",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 28",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 29",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 30",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 31",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 32",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 02",
   "title": "스위치를 열고 닫아 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 부품·접촉 상태에서 스위치만 조작해요.",
      "열었을 때와 닫았을 때를 같은 항목으로 관찰해요.",
      "길이 끊기는 위치와 전구 상태를 연결해 설명해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "스위치 상태",
      "실제 전구 관찰",
      "같게 둔 조건"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "activity-switch-do01",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 03",
   "title": "재료를 바꾸어 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 안전한 재료와 시험 회로를 점검받아요.",
      "나머지 연결은 같게 두고 시험 재료 하나를 바꾸어요.",
      "접촉 상태·관찰과 결론의 범위를 적어요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "시험 재료·댄 부분",
      "관찰·접촉 확인",
      "다른 가능한 원인"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "activity-materials-do01",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 3",
   "title": "전지 한 개와 두 개를 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "전지의 극",
       "전지에 표시된 +극과 −극"
      ],
      [
       "서로 돕는 한 줄 연결",
       "한 전지의 +극을 다른 전지의 −극과 이어 남은 두 끝을 사용하는 연결"
      ],
      [
       "정격 확인",
       "부품이 허용하는 전원·사용 조건을 교사와 확인하는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "한 개와 두 개를 비교하기 전에 교사가 전구·전지 끼우개·전선의 허용 조건을 확인해요. 두 전지가 서로 돕는 한 줄 연결에서는 **서로 다른 두 전지의 +극과 −극**을 이어 남은 끝으로 회로를 만들어요."
    },
    {
     "type": "table",
     "heads": [
      "준비 확인",
      "확인할 내용"
     ],
     "rows": [
      [
       "전지",
       "같은 종류·상태이며 새것·헌것을 섞지 않기"
      ],
      [
       "연결",
       "각 전지의 실제 표시와 끼우개 단자"
      ],
      [
       "부품",
       "교사가 허용한1개/2개 조건과 통전 시간"
      ]
     ]
    },
    {
     "type": "text",
     "text": "전지를 많이 이으면 언제나 좋다고 결론 내리지 않아요. 전구를 둘 이상 직렬·병렬로 잇는 비교와 전지 수 비교는 다른 질문이에요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "전지 한 개와 두 개를 연결해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 전지가 놓인 방향이 같아 보여요. 이것만으로 서로 돕는 한 줄 연결이라고 할까요?",
     "steps": [
      [
       "표시 읽기",
       "전지마다 +·−극 표시를 확인해요."
      ],
      [
       "연결 읽기",
       "서로 닿은 두 단자가 다른 극인지 살펴요."
      ],
      [
       "한계 확인",
       "겉방향과 전선 색만으로 실제 접속을 대신하지 않아요."
      ]
     ],
     "answer": "실제 연결된 극을 근거로 설명하고 허용 부품 조건을 확인해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 33",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 34~35",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w034",
      "c22-s62-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 36~37",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w036",
      "c22-s62-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 38~40",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w038",
      "c22-s62-u03-w039",
      "c22-s62-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 41",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 42",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 43",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 44",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 45",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 46",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 47",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 48",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 4",
   "title": "같은 조건으로 밝기를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "달리할 조건",
       "이 비교에서는 허용된 전지 수"
      ],
      [
       "같게 둘 조건",
       "전구·전선·접촉·전지 종류와 상태·관찰 위치 등"
      ],
      [
       "반복 비교",
       "같은 방법을 여러 번 적용해 기록을 살피는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "정격이 맞는 같은 전구를 사용해 한 개와 서로 돕게 이은 두 개의 전지 조건을 비교해요. 관찰 위치·주변 밝기·접촉 방법과 시간을 맞추고 반복해요. **기록의 차이를 원하는 값으로 고치지 않아요.**"
    },
    {
     "type": "table",
     "heads": [
      "제공 연습 자료·실측 아님",
      "1회(lx)",
      "2회(lx)",
      "3회(lx)"
     ],
     "rows": [
      [
       "한 개",
       "27",
       "28",
       "29"
      ],
      [
       "두 개",
       "39",
       "40",
       "41"
      ]
     ]
    },
    {
     "type": "text",
     "text": "이 표의 평균은28lx와40lx예요. 같은 조건의 두 기록 사이에 차이가 있다는 근거이지, 언제나 정확히 두 배가 되거나 임의로 전지를 계속 늘려도 된다는 법칙이 아니에요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "같은 조건으로 밝기를 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "위 연습 자료에서 두 조건의 평균 차이는 얼마이며, 어떻게 한정해 말할까요?",
     "steps": [
      [
       "각 평균 구하기",
       "(27+28+29)÷3=28lx, (39+40+41)÷3=40lx예요."
      ],
      [
       "차 구하기",
       "40−28=12lx예요."
      ],
      [
       "범위 남기기",
       "이 제공 자료와 비교 조건의 차이라고 밝혀요."
      ]
     ],
     "answer": "평균 차이는12lx이며 모든 장치의 정확한 비례 법칙은 아니에요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 49",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 50",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 51~53",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w051",
      "c22-s62-u03-w052",
      "c22-s62-u03-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 54~56",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w054",
      "c22-s62-u03-w055",
      "c22-s62-u03-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 57",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 58",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 59",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 60",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 61",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 62",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 63",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 64",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 04",
   "title": "같은 조건으로 밝기를 반복 관찰해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 전구 정격과1개/2개 전원 조건을 확인해요.",
      "전지 종류·상태·전구·전선·접촉·주변 빛과 위치를 맞춰요.",
      "같은 방법으로 세 번 비교하고 원기록을 보존해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "전지 조건·통제 조건",
      "1·2·3회 실제 관찰",
      "한계·미관찰"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-brightness-do02",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 5",
   "title": "전자석을 만들어 연결 전후를 관찰해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "절연 코일",
       "절연된 선을 같은 방향으로 감은 부분"
      ],
      [
       "철심",
       "코일 속에 넣어 비교하는 철 재료"
      ],
      [
       "전자석",
       "전류가 흐를 때 자석의 작용을 이용하는 장치"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "coil"
    },
    {
     "type": "text",
     "text": "교사가 확인한 철심에 절연선을 같은 방향으로 고르게 감아요. **감긴 부분의 절연은 유지**하고 두 끝의 접점만 교사가 준비해요. 부품·전원·허용 통전 시간을 점검받은 뒤 연결해요."
    },
    {
     "type": "table",
     "heads": [
      "관찰 시점",
      "같게 둘 것·남길 사실"
     ],
     "rows": [
      [
       "연결 전",
       "철심에 처음부터 클립이 붙는지"
      ],
      [
       "연결 중",
       "같은 거리·같은 클립과 통전 시간"
      ],
      [
       "끊은 뒤",
       "붙음이 남는지·남지 않는지와 관찰 조건"
      ]
     ]
    },
    {
     "type": "text",
     "text": "철심 가열·피복 태우기·학생의 칼 사용으로 접점을 만들지 않아요. 뜨거움·냄새·손상은 시험을 계속할 대상이 아니라 바로 중단하고 어른에게 알릴 상황이에요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "전자석을 만들어 연결 전후를 관찰해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "연결 전0개·연결 중5개·끊은 뒤1개의 클립이 붙었다는 연습 기록이 있어요. 꺼지면 반드시0개여야 할까요?",
     "steps": [
      [
       "시점 나누기",
       "처음·연결 중·끊은 뒤를 구별해요."
      ],
      [
       "기록 읽기",
       "이 기록에서는 끊은 뒤1개가 남았어요."
      ],
      [
       "해석 한정",
       "남은 자성과 조건을 확인하고 기록을0으로 고치지 않아요."
      ]
     ],
     "answer": "전류 연결의 변화와 끊은 뒤 남은 작용을 함께 기록해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 65",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 66",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 67~69",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w067",
      "c22-s62-u03-w068",
      "c22-s62-u03-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 70~72",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w070",
      "c22-s62-u03-w071",
      "c22-s62-u03-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 73",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 74",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 75",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 76",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 77",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 78",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 79",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 80",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 05",
   "title": "절연 코일을 직접 감아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 확인한 철심·절연선과 준비된 끝 접점을 사용해요.",
      "감긴 부분의 절연을 유지하며 같은 방향으로 고르게 감아요.",
      "전원 연결 전 교사에게 부품·전원·통전 시간을 점검받아요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "철심·코일 실제 준비",
      "두 끝·감긴 부분 스케치",
      "점검·미완성"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-coil-build-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 06",
   "title": "연결 전·연결 중·끊은 뒤를 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 거리·같은 클립으로 처음 철심 상태를 봐요.",
      "허용된 시간만 연결해 실제 붙는 작용을 관찰해요.",
      "전원을 끊은 뒤 남은 작용도 그대로 기록해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "연결 시점",
      "실제 관찰·같은 조건",
      "관찰 못한 것"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-magnet-onoff-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 6",
   "title": "전자석의 세기·극·쓰임을 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "세기 비교",
       "같은 방법·거리·클립 등에서 작용을 비교하는 일"
      ],
      [
       "극 관찰",
       "같은 나침반 끝의 끌림·밀림을 근거로 판단하는 일"
      ],
      [
       "제어와 쓰임",
       "잡고 놓기처럼 작용을 바꾸어 목적에 쓰는 관계"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "book-preparation"
    },
    {
     "type": "text",
     "text": "같은 코일·철심·거리·클립·통전 시간을 맞추고 허용된 전지 수를 비교해요. 연결 방향에 따른 극은 **같은 위치의 나침반 N극 반응**을 관찰해요. 전선 색·오른손 법칙으로 정하는 활동으로 바꾸지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "비교·조사 질문",
      "필요한 근거"
     ],
     "rows": [
      [
       "세기가 달라졌나?",
       "거리·클립·횟수와 실제 기록"
      ],
      [
       "극이 바뀌었나?",
       "전원 분리 후 연결 방향만 바꾼 나침반 반응"
      ],
      [
       "왜 전자석을 쓸까?",
       "장치의 코일·제어 목적을 밝힌 설명 자료"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "전자석의 세기·극·쓰임을 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "전지 수를 바꾼 뒤 클립을 더 가까이 댔더니 더 많이 붙었어요. 전지 수 하나의 효과일까요?",
     "steps": [
      [
       "바뀐 것 찾기",
       "전지 수와 클립 거리 두 조건이 바뀌었어요."
      ],
      [
       "비교 다시 계획",
       "거리·철심·클립·시간을 맞춰 같은 방법으로 비교해요."
      ],
      [
       "원기록 보존",
       "첫 기록에는 조건 차이와 한계를 남겨요."
      ]
     ],
     "answer": "클립 수 증가만으로 전자석 자체의 세기 변화 원인을 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 81~82",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w081",
      "c22-s62-u03-w082"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 83~85",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w083",
      "c22-s62-u03-w084",
      "c22-s62-u03-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 86~88",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w086",
      "c22-s62-u03-w087",
      "c22-s62-u03-w088"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 89",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 90",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 91",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 92",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 93",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 94",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 95",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 96",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 07",
   "title": "전자석 세기를 공정하게 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 철심·코일·클립·거리·방법·시간을 정해요.",
      "교사 허용 범위에서 전지 수만 바꾸어 반복 관찰해요.",
      "클립 수의 차이와 조건의 한계를 함께 설명해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "전지 조건",
      "반복 기록·단위",
      "다른 영향·한계"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-strength-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 08",
   "title": "나침반으로 극의 변화를 관찰해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 위치에서 나침반의 같은 N극 끝 반응을 살펴요.",
      "전원을 분리한 뒤 전지 연결 방향만 바꾸고 점검받아요.",
      "다시 연결해 같은 끝의 끌림·밀림을 비교해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "연결 방향·관찰 위치",
      "N극 반응·판단 근거",
      "미관찰·주변 영향"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-poles-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 09",
   "title": "구조·작용·쓰임을 조사해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "list",
     "items": [
      "출처 자료와 교사가 준비한 기기 설명서를 읽어요.",
      "코일·움직이는 부분과 어떤 작용을 제어하는지 찾아요.",
      "기기 이름·출처·확인한 구조와 모르는 부분을 나눠요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "장치·출처·확인일",
      "구조·작용·쓰임 근거",
      "사진만으로 모르는 것"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-device-research-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 7",
   "title": "전기를 안전하게 사용하는 근거를 찾아요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "손상 신호",
       "벗겨진 피복·열·냄새 등 어른에게 알릴 근거"
      ],
      [
       "사용 중단",
       "위험한 기구를 직접 시험하지 않고 알리는 행동"
      ],
      [
       "안전 계획",
       "장소·상황·누가 할 행동인지 구체적으로 정한 계획"
      ]
     ]
    },
    {
     "type": "text",
     "text": "기구를 켜서 위험 여부를 시험하거나 콘센트·차단기를 학생이 조작하지 않아요. 손상·열·냄새가 보이면 **만지거나 계속 쓰지 않고 어른에게 알려요.** 정상 부품이라도 사용 목적·허용 조건을 지켜야 해요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "할 일의 범위"
     ],
     "rows": [
      [
       "찢어진 전선 피복",
       "학생이 테이프로 수리해 켜 보지 않고 알리기"
      ],
      [
       "전원을 끄거나 분리할 필요",
       "어른·교사의 절차와 허락을 따르기"
      ],
      [
       "저전압 수업 부품",
       "정격·연결·통전 시간을 교사에게 확인받기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "전기를 안전하게 사용하는 근거를 찾아요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "친구가 “손이 말랐으니 손상된 기구도 잠깐 켜 보자”라고 했어요. 어떻게 판단할까요?",
     "steps": [
      [
       "위험 근거",
       "손상이라는 신호가 이미 있어요."
      ],
      [
       "조건 구별",
       "손이 마른 사실이 기구의 손상을 없애지 않아요."
      ],
      [
       "행동 정하기",
       "직접 시험하지 않고 어른에게 알려요."
      ]
     ],
     "answer": "안전을 한 조건으로 보장하지 않고 손상 신호에 맞게 행동해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 97",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w097"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 98~99",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w098",
      "c22-s62-u03-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 100~101",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w100",
      "c22-s62-u03-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 102~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w102",
      "c22-s62-u03-w103",
      "c22-s62-u03-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w105",
      "c22-s62-u03-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 107",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 108",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 109",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 110",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 111",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 112",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 8",
   "title": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "계획",
       "언제·어디서·누가·무엇을·어떻게 확인할지 정함"
      ],
      [
       "실행",
       "실제로 한 행동·날짜·근거를 남김"
      ],
      [
       "검토",
       "계획과 실행을 비교하고 남은 한계·다음 확인을 정함"
      ]
     ]
    },
    {
     "type": "text",
     "text": "밝기·환기·식품 보관 등 필요한 기능을 해치지 않는 행동을 교사와 골라요. 계획을 쓴 것만으로 실천했다고 하지 않아요. **실제로 못 했다면 미실행**, 아직 돌아볼 날이 아니라면 미검토로 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "제공 연습 자료·실측 아님",
      "월(분)",
      "화(분)",
      "수(분)"
     ],
     "rows": [
      [
       "불필요 점등·전",
       "30",
       "30",
       "30"
      ],
      [
       "불필요 점등·후",
       "18",
       "17",
       "19"
      ]
     ]
    },
    {
     "type": "text",
     "text": "합계는90분과54분으로36분 줄었어요. 점등 시간의 변화이며 전기 사용량·요금은 이 표에서 측정하지 않았어요. 효과를 더 보려면 기간·기구·다른 사용 조건과 실제 사용량 자료가 필요해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "전기를 아끼는 계획을 실천하고 돌아봐요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "실천 계획서는 썼지만 이번 주에는 실행하지 못했어요. 전기를 얼마나 아꼈다고 적을까요?",
     "steps": [
      [
       "단계 확인",
       "지금 있는 것은 계획과 미실행 이유예요."
      ],
      [
       "근거 경계",
       "하지 않은 행동의 절약량을 만들어 적지 않아요."
      ],
      [
       "다음 기회",
       "실행할 날짜·허락·확인 방법을 다시 정해요."
      ]
     ],
     "answer": "미실행을 사실대로 남기고 다음 확인을 구체적으로 계획해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 113~114",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w113",
      "c22-s62-u03-w114"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 115~117",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w115",
      "c22-s62-u03-w116",
      "c22-s62-u03-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 118~120",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w118",
      "c22-s62-u03-w119",
      "c22-s62-u03-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 121~122",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w121",
      "c22-s62-u03-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 123",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 124",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 125",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 126",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 127",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 128",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 10",
   "title": "실천할 행동 하나를 구체적으로 정해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "밝기·환기·보관 등 필요한 기능을 해치지 않는 행동을 골라요.",
      "언제·어디서·누가·무엇을 할지 교사와 정해요.",
      "실행 확인 방법과 돌아볼 날짜를 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "장소·담당·기간",
      "행동·허락·확인 방법",
      "검토 날짜"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-practice-plan-do04",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 11",
   "title": "계획한 행동을 실제로 실행해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사와 정상 기구·장소·사용 여부를 확인해요.",
      "허락받은 행동만 하고 날짜·직접 확인한 근거를 적어요.",
      "못 했다면 미실행 이유와 다음 기회를 적어요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "실제 날짜·행동",
      "직접 확인한 근거",
      "미실행 이유"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-practice-do04",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 12",
   "title": "실행 기록을 나누고 다시 확인해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "계획과 실제 실행·미실행을 구별해 짝에게 설명해요.",
      "확인한 변화와 측정하지 않은 사용량·요금을 나누어요.",
      "받은 질문·더 필요한 자료·다음 확인 날짜를 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "내가 설명한 근거",
      "받은 질문·효과의 한계",
      "다음 확인·미검토"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-share-review-do04",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 정리",
   "title": "접점에서 생활 속 실천까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배움의 연결",
      "남길 근거"
     ],
     "rows": [
      [
       "접점·재료·전지",
       "연결 스케치와 실제 반복 비교"
      ],
      [
       "전자석의 제작·성질",
       "절연 코일·거리·시점·나침반 반응"
      ],
      [
       "장치와 쓰임",
       "출처 있는 구조·제어 목적"
      ],
      [
       "안전·효율적 이용",
       "구체적 계획·실제 실행·검토의 한계"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 것",
     "hint": "관찰·제공 자료·해석·남은 질문을 이어 정리해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 기준6과15-01~04를 실제 근거로 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "정답 수와 실제 수행의 확인은 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-01",
   "title": "한 전구 회로의 접점을 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "실제 회로를 만들고 두 접점·전지의 서로 다른 극·스위치·재료의 근거를 남겨요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-02",
   "title": "한 개와 두 개의 전지를 비교하기",
   "blocks": [
    {
     "type": "text",
     "text": "교사 허용 범위의 전지 수를 바꾸고 나머지 조건을 맞춰 반복 관찰한 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-03",
   "title": "전자석의 성질과 쓰임 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "실제 만든 코일의 전류 연결 전후·세기·극을 비교하고 출처 있는 기기 구조와 쓰임을 연결해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-04",
   "title": "안전·절약 계획을 실제로 실천하기",
   "blocks": [
    {
     "type": "text",
     "text": "조사·계획·실행·검토를 구별해 직접 확인한 근거와 효과의 한계·다음 확인을 설명해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  }
 ],
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "전기의 이용",
   "blocks": [
    {
     "type": "diagram",
     "key": "bulb"
    },
    {
     "type": "text",
     "text": "전구의 두 접점을 찾아 회로를 만들고, 한 개와 두 개의 전지를 비교해요. 직접 만든 전자석의 성질과 생활 속 쓰임을 근거로 잇고 안전·절약 계획을 실천해요."
    },
    {
     "type": "field",
     "title": "이름·날짜와 내가 궁금한 것",
     "hint": "연결·밝기·자석·생활에서 확인하고 싶은 질문을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진·제공 연습 자료·실제 관찰 기록을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 점검한 교육용 부품과 허용 조건으로 활동해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "layout": "electricity-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "연결에서 실제 실천까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 전구의 두 접점을 찾아요",
       "1~16번"
      ],
      [
       "2. 끊기지 않는 연결과 재료를 비교해요",
       "17~32번"
      ],
      [
       "3. 전지 한 개와 두 개를 연결해요",
       "33~48번"
      ],
      [
       "4. 같은 조건으로 밝기를 비교해요",
       "49~64번"
      ],
      [
       "5. 전자석을 만들어 연결 전후를 관찰해요",
       "65~80번"
      ],
      [
       "6. 전자석의 세기·극·쓰임을 비교해요",
       "81~96번"
      ],
      [
       "7. 전기를 안전하게 사용하는 근거를 찾아요",
       "97~112번"
      ],
      [
       "8. 전기를 아끼는 계획을 실천하고 돌아봐요",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "8형식 각16개, 모두128문항이에요. 부분별 답은 질문 바로 아래에 써요. 그림에는 이름표와 설명을 붙여요. **핵심 정리·더 알아보기·내가 정리할 것**도 함께 읽어요."
    },
    {
     "type": "field",
     "title": "공부 계획",
     "hint": "네 차시 각40분·별도 확인45분은 수업 예시예요. 교재 전체는 상황에 맞게 여러 시간에 나누어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문제 응답과 실제 제작·관찰·조사·실천은 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "못 한 활동은 미실행·미관찰로 남겨 다음 기회를 정해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 1",
   "title": "전구의 두 접점을 찾아요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "금속 접점",
       "다른 부품의 금속과 직접 닿아 이어지는 곳"
      ],
      [
       "전구의 두 접점",
       "옆 금속과 바닥 금속으로 나뉜 부분"
      ],
      [
       "절연 부분",
       "서로 다른 금속 접점이 바로 닿지 않게 나누는 부분"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "bulb"
    },
    {
     "type": "text",
     "text": "작은 전구의 겉에서 **옆 금속·바닥 금속·유리·절연 부분**을 찾아요. 유리 겉면이나 전선의 색을 금속 접점으로 쓰지 않아요. 전지와 분리한 상태에서 교사가 확인한 부품을 살펴요."
    },
    {
     "type": "table",
     "heads": [
      "부품",
      "연결에서 하는 일"
     ],
     "rows": [
      [
       "전지",
       "회로에 전기를 공급한다."
      ],
      [
       "전구",
       "연결 조건이 맞을 때 전기로 빛을 낸다."
      ],
      [
       "스위치",
       "전기가 흐르는 길을 열고 닫는다."
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "전구의 두 접점을 찾아요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "전구의 옆 금속과 바닥 금속 사이에 검은 부분이 보여요. 검은 부분도 금속 접점 하나로 세면 될까요?",
     "steps": [
      [
       "겉에서 나누기",
       "사진의 색 이름과 실물에서 확인한 재료·역할을 구별해요."
      ],
      [
       "접점 찾기",
       "서로 떨어진 두 금속 접점의 위치를 찾아요."
      ],
      [
       "확인 범위",
       "절연 부분을 제3의 금속 접점이라고 더하지 않아요."
      ]
     ],
     "answer": "옆·바닥 금속을 나누고 그 사이 절연 부분은 따로 표시해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w001",
      "c22-s62-u03-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 3~5",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w003",
      "c22-s62-u03-w004",
      "c22-s62-u03-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 6~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w006",
      "c22-s62-u03-w007",
      "c22-s62-u03-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w009",
      "c22-s62-u03-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 11",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 12",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 13",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 14",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 15",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전구의 두 접점을 찾아요 · 16",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 01",
   "title": "접점을 찾아 회로를 만들어요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "전원을 분리한 상태에서 전구의 두 접점과 전지의 극을 확인해요.",
      "교사가 확인한 교육용 부품을 연결하고 점검받아요.",
      "실제 켜짐과 접점 스케치·미확인 부분을 나누어 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "확인한 접점",
      "연결 스케치·실제 상태",
      "아직 모르는 것"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 접점의 위치와 부품의 역할을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "전구를 분해하지 않고 겉과 교사의 실물 자료를 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "겉에서 확인한 부분과 아직 알 수 없는 내부를 구별해 그려요.",
     "write": 5
    }
   ],
   "kind": "activity-circuit-build-do01",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 2",
   "title": "끊기지 않는 연결과 재료를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "전기 회로",
       "전지·전구·전선 등을 이어 만든 길"
      ],
      [
       "닫힌 연결",
       "전지의 서로 다른 극에서 전구를 거쳐 돌아오는 끊기지 않은 길"
      ],
      [
       "전기가 통하는 재료",
       "시험 조건에서 전기를 통하게 하는 재료"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 점검한 전지·필라멘트 전구 하나로 **전지의 서로 다른 극과 전구의 서로 다른 두 접점**을 이어 돌아오는 길을 만들어요. 선 개수나 색만 세지 말고 금속끼리 실제로 닿는 곳을 확인해요."
    },
    {
     "type": "table",
     "heads": [
      "연결·재료 확인",
      "기록할 근거"
     ],
     "rows": [
      [
       "스위치를 열고 닫는다.",
       "길이 끊기는 위치와 전구의 실제 상태"
      ],
      [
       "집게를 댄 부분을 살핀다.",
       "금속인지 피복·유리인지"
      ],
      [
       "재료 하나를 바꿔 비교한다.",
       "나머지 연결과 시험 조건을 같게 한 기록"
      ]
     ]
    },
    {
     "type": "text",
     "text": "정상 부품·접촉·전지 상태를 확인해야 재료의 영향과 연결 불량을 나눌 수 있어요. 전지의 양극을 전선만으로 직접 잇는 시험은 하지 않아요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "끊기지 않는 연결과 재료를 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "모든 선이 둥글게 놓였지만 전구 양쪽이 전지의 같은 단자에만 이어졌어요. 모양만으로 켜진다고 할 수 있을까요?",
     "steps": [
      [
       "접점 따라가기",
       "전구의 각 접점이 어느 전지 단자와 이어지는지 하나씩 찾아요."
      ],
      [
       "조건 확인",
       "서로 다른 전지 극과 이어 돌아오는 길인지 확인해요."
      ],
      [
       "다음 행동",
       "전원을 분리한 뒤 교사와 연결을 점검해요."
      ]
     ],
     "answer": "둥근 겉모양만으로 판단하지 않고 실제 접점의 대응을 확인해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 17",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 18~19",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w018",
      "c22-s62-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 20~21",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w020",
      "c22-s62-u03-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 22~24",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w022",
      "c22-s62-u03-w023",
      "c22-s62-u03-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 25",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 26",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 27",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 28",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 29",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 30",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 31",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "끊기지 않는 연결과 재료를 비교해요 · 32",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 02",
   "title": "스위치를 열고 닫아 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 부품·접촉 상태에서 스위치만 조작해요.",
      "열었을 때와 닫았을 때를 같은 항목으로 관찰해요.",
      "길이 끊기는 위치와 전구 상태를 연결해 설명해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "스위치 상태",
      "실제 전구 관찰",
      "같게 둔 조건"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "activity-switch-do01",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 03",
   "title": "재료를 바꾸어 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 안전한 재료와 시험 회로를 점검받아요.",
      "나머지 연결은 같게 두고 시험 재료 하나를 바꾸어요.",
      "접촉 상태·관찰과 결론의 범위를 적어요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "시험 재료·댄 부분",
      "관찰·접촉 확인",
      "다른 가능한 원인"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 닿은 접점과 돌아오는 연결을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "선이 원처럼 보여도 같은 전지 단자에만 이어지면 켜질 조건이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어디와 어디가 닿았는지 표시하고 실제 켜짐·미관찰을 구별해요.",
     "write": 5
    }
   ],
   "kind": "activity-materials-do01",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 3",
   "title": "전지 한 개와 두 개를 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "전지의 극",
       "전지에 표시된 +극과 −극"
      ],
      [
       "서로 돕는 한 줄 연결",
       "한 전지의 +극을 다른 전지의 −극과 이어 남은 두 끝을 사용하는 연결"
      ],
      [
       "정격 확인",
       "부품이 허용하는 전원·사용 조건을 교사와 확인하는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "한 개와 두 개를 비교하기 전에 교사가 전구·전지 끼우개·전선의 허용 조건을 확인해요. 두 전지가 서로 돕는 한 줄 연결에서는 **서로 다른 두 전지의 +극과 −극**을 이어 남은 끝으로 회로를 만들어요."
    },
    {
     "type": "table",
     "heads": [
      "준비 확인",
      "확인할 내용"
     ],
     "rows": [
      [
       "전지",
       "같은 종류·상태이며 새것·헌것을 섞지 않기"
      ],
      [
       "연결",
       "각 전지의 실제 표시와 끼우개 단자"
      ],
      [
       "부품",
       "교사가 허용한1개/2개 조건과 통전 시간"
      ]
     ]
    },
    {
     "type": "text",
     "text": "전지를 많이 이으면 언제나 좋다고 결론 내리지 않아요. 전구를 둘 이상 직렬·병렬로 잇는 비교와 전지 수 비교는 다른 질문이에요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "전지 한 개와 두 개를 연결해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 전지가 놓인 방향이 같아 보여요. 이것만으로 서로 돕는 한 줄 연결이라고 할까요?",
     "steps": [
      [
       "표시 읽기",
       "전지마다 +·−극 표시를 확인해요."
      ],
      [
       "연결 읽기",
       "서로 닿은 두 단자가 다른 극인지 살펴요."
      ],
      [
       "한계 확인",
       "겉방향과 전선 색만으로 실제 접속을 대신하지 않아요."
      ]
     ],
     "answer": "실제 연결된 극을 근거로 설명하고 허용 부품 조건을 확인해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 33",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 34~35",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w034",
      "c22-s62-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 36~37",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w036",
      "c22-s62-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 38~40",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w038",
      "c22-s62-u03-w039",
      "c22-s62-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 41",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 42",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 43",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 44",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 45",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 46",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 47",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전지 한 개와 두 개를 연결해요 · 48",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 종류·상태의 전지로 연결된 극을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "전선의 색이나 전지의 개수만으로 연결 방향을 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "각 전지의 극과 서로 이은 단자를 표시해요. 미확인 접속은 따로 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 4",
   "title": "같은 조건으로 밝기를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "달리할 조건",
       "이 비교에서는 허용된 전지 수"
      ],
      [
       "같게 둘 조건",
       "전구·전선·접촉·전지 종류와 상태·관찰 위치 등"
      ],
      [
       "반복 비교",
       "같은 방법을 여러 번 적용해 기록을 살피는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "정격이 맞는 같은 전구를 사용해 한 개와 서로 돕게 이은 두 개의 전지 조건을 비교해요. 관찰 위치·주변 밝기·접촉 방법과 시간을 맞추고 반복해요. **기록의 차이를 원하는 값으로 고치지 않아요.**"
    },
    {
     "type": "table",
     "heads": [
      "제공 연습 자료·실측 아님",
      "1회(lx)",
      "2회(lx)",
      "3회(lx)"
     ],
     "rows": [
      [
       "한 개",
       "27",
       "28",
       "29"
      ],
      [
       "두 개",
       "39",
       "40",
       "41"
      ]
     ]
    },
    {
     "type": "text",
     "text": "이 표의 평균은28lx와40lx예요. 같은 조건의 두 기록 사이에 차이가 있다는 근거이지, 언제나 정확히 두 배가 되거나 임의로 전지를 계속 늘려도 된다는 법칙이 아니에요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "같은 조건으로 밝기를 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "위 연습 자료에서 두 조건의 평균 차이는 얼마이며, 어떻게 한정해 말할까요?",
     "steps": [
      [
       "각 평균 구하기",
       "(27+28+29)÷3=28lx, (39+40+41)÷3=40lx예요."
      ],
      [
       "차 구하기",
       "40−28=12lx예요."
      ],
      [
       "범위 남기기",
       "이 제공 자료와 비교 조건의 차이라고 밝혀요."
      ]
     ],
     "answer": "평균 차이는12lx이며 모든 장치의 정확한 비례 법칙은 아니에요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 49",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 50",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 51~53",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w051",
      "c22-s62-u03-w052",
      "c22-s62-u03-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 54~56",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w054",
      "c22-s62-u03-w055",
      "c22-s62-u03-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 57",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 58",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 59",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 60",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 61",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 62",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 63",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "같은 조건으로 밝기를 비교해요 · 64",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 04",
   "title": "같은 조건으로 밝기를 반복 관찰해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 전구 정격과1개/2개 전원 조건을 확인해요.",
      "전지 종류·상태·전구·전선·접촉·주변 빛과 위치를 맞춰요.",
      "같은 방법으로 세 번 비교하고 원기록을 보존해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "전지 조건·통제 조건",
      "1·2·3회 실제 관찰",
      "한계·미관찰"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 개와 두 개의 밝기 차이를 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰 위치나 전지 상태도 결과에 영향을 줄 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 조건·같게 한 조건·반복 기록·결론의 한계를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-brightness-do02",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 5",
   "title": "전자석을 만들어 연결 전후를 관찰해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "절연 코일",
       "절연된 선을 같은 방향으로 감은 부분"
      ],
      [
       "철심",
       "코일 속에 넣어 비교하는 철 재료"
      ],
      [
       "전자석",
       "전류가 흐를 때 자석의 작용을 이용하는 장치"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "coil"
    },
    {
     "type": "text",
     "text": "교사가 확인한 철심에 절연선을 같은 방향으로 고르게 감아요. **감긴 부분의 절연은 유지**하고 두 끝의 접점만 교사가 준비해요. 부품·전원·허용 통전 시간을 점검받은 뒤 연결해요."
    },
    {
     "type": "table",
     "heads": [
      "관찰 시점",
      "같게 둘 것·남길 사실"
     ],
     "rows": [
      [
       "연결 전",
       "철심에 처음부터 클립이 붙는지"
      ],
      [
       "연결 중",
       "같은 거리·같은 클립과 통전 시간"
      ],
      [
       "끊은 뒤",
       "붙음이 남는지·남지 않는지와 관찰 조건"
      ]
     ]
    },
    {
     "type": "text",
     "text": "철심 가열·피복 태우기·학생의 칼 사용으로 접점을 만들지 않아요. 뜨거움·냄새·손상은 시험을 계속할 대상이 아니라 바로 중단하고 어른에게 알릴 상황이에요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "전자석을 만들어 연결 전후를 관찰해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "연결 전0개·연결 중5개·끊은 뒤1개의 클립이 붙었다는 연습 기록이 있어요. 꺼지면 반드시0개여야 할까요?",
     "steps": [
      [
       "시점 나누기",
       "처음·연결 중·끊은 뒤를 구별해요."
      ],
      [
       "기록 읽기",
       "이 기록에서는 끊은 뒤1개가 남았어요."
      ],
      [
       "해석 한정",
       "남은 자성과 조건을 확인하고 기록을0으로 고치지 않아요."
      ]
     ],
     "answer": "전류 연결의 변화와 끊은 뒤 남은 작용을 함께 기록해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 65",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 66",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 67~69",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w067",
      "c22-s62-u03-w068",
      "c22-s62-u03-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 70~72",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w070",
      "c22-s62-u03-w071",
      "c22-s62-u03-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 73",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 74",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 75",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 76",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 77",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 78",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 79",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석을 만들어 연결 전후를 관찰해요 · 80",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 05",
   "title": "절연 코일을 직접 감아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 확인한 철심·절연선과 준비된 끝 접점을 사용해요.",
      "감긴 부분의 절연을 유지하며 같은 방향으로 고르게 감아요.",
      "전원 연결 전 교사에게 부품·전원·통전 시간을 점검받아요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "철심·코일 실제 준비",
      "두 끝·감긴 부분 스케치",
      "점검·미완성"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-coil-build-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 06",
   "title": "연결 전·연결 중·끊은 뒤를 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 거리·같은 클립으로 처음 철심 상태를 봐요.",
      "허용된 시간만 연결해 실제 붙는 작용을 관찰해요.",
      "전원을 끊은 뒤 남은 작용도 그대로 기록해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "연결 시점",
      "실제 관찰·같은 조건",
      "관찰 못한 것"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "절연 코일을 만들고 연결 전·연결 중·끊은 뒤를 나눠요."
    },
    {
     "title": "더 알아보기",
     "text": "전류를 끊어도 철심에 약한 자성이 남을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "만든 코일의 절연·두 끝과 세 시점의 실제 관찰을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-magnet-onoff-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 6",
   "title": "전자석의 세기·극·쓰임을 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "세기 비교",
       "같은 방법·거리·클립 등에서 작용을 비교하는 일"
      ],
      [
       "극 관찰",
       "같은 나침반 끝의 끌림·밀림을 근거로 판단하는 일"
      ],
      [
       "제어와 쓰임",
       "잡고 놓기처럼 작용을 바꾸어 목적에 쓰는 관계"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "book-preparation"
    },
    {
     "type": "text",
     "text": "같은 코일·철심·거리·클립·통전 시간을 맞추고 허용된 전지 수를 비교해요. 연결 방향에 따른 극은 **같은 위치의 나침반 N극 반응**을 관찰해요. 전선 색·오른손 법칙으로 정하는 활동으로 바꾸지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "비교·조사 질문",
      "필요한 근거"
     ],
     "rows": [
      [
       "세기가 달라졌나?",
       "거리·클립·횟수와 실제 기록"
      ],
      [
       "극이 바뀌었나?",
       "전원 분리 후 연결 방향만 바꾼 나침반 반응"
      ],
      [
       "왜 전자석을 쓸까?",
       "장치의 코일·제어 목적을 밝힌 설명 자료"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "전자석의 세기·극·쓰임을 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "전지 수를 바꾼 뒤 클립을 더 가까이 댔더니 더 많이 붙었어요. 전지 수 하나의 효과일까요?",
     "steps": [
      [
       "바뀐 것 찾기",
       "전지 수와 클립 거리 두 조건이 바뀌었어요."
      ],
      [
       "비교 다시 계획",
       "거리·철심·클립·시간을 맞춰 같은 방법으로 비교해요."
      ],
      [
       "원기록 보존",
       "첫 기록에는 조건 차이와 한계를 남겨요."
      ]
     ],
     "answer": "클립 수 증가만으로 전자석 자체의 세기 변화 원인을 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 81~82",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w081",
      "c22-s62-u03-w082"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 83~85",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w083",
      "c22-s62-u03-w084",
      "c22-s62-u03-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 86~88",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w086",
      "c22-s62-u03-w087",
      "c22-s62-u03-w088"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 89",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 90",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 91",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 92",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 93",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 94",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 95",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전자석의 세기·극·쓰임을 비교해요 · 96",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 07",
   "title": "전자석 세기를 공정하게 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 철심·코일·클립·거리·방법·시간을 정해요.",
      "교사 허용 범위에서 전지 수만 바꾸어 반복 관찰해요.",
      "클립 수의 차이와 조건의 한계를 함께 설명해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "전지 조건",
      "반복 기록·단위",
      "다른 영향·한계"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-strength-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 08",
   "title": "나침반으로 극의 변화를 관찰해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 위치에서 나침반의 같은 N극 끝 반응을 살펴요.",
      "전원을 분리한 뒤 전지 연결 방향만 바꾸고 점검받아요.",
      "다시 연결해 같은 끝의 끌림·밀림을 비교해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "연결 방향·관찰 위치",
      "N극 반응·판단 근거",
      "미관찰·주변 영향"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-poles-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 09",
   "title": "구조·작용·쓰임을 조사해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "list",
     "items": [
      "출처 자료와 교사가 준비한 기기 설명서를 읽어요.",
      "코일·움직이는 부분과 어떤 작용을 제어하는지 찾아요.",
      "기기 이름·출처·확인한 구조와 모르는 부분을 나눠요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "장치·출처·확인일",
      "구조·작용·쓰임 근거",
      "사진만으로 모르는 것"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·나침반 반응·기기 구조의 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 기기 이름 하나로 내부 구조·자석 종류를 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 조건의 비교 근거와 구조·작용·쓰임을 잇는 출처를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-device-research-do03",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 7",
   "title": "전기를 안전하게 사용하는 근거를 찾아요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "손상 신호",
       "벗겨진 피복·열·냄새 등 어른에게 알릴 근거"
      ],
      [
       "사용 중단",
       "위험한 기구를 직접 시험하지 않고 알리는 행동"
      ],
      [
       "안전 계획",
       "장소·상황·누가 할 행동인지 구체적으로 정한 계획"
      ]
     ]
    },
    {
     "type": "text",
     "text": "기구를 켜서 위험 여부를 시험하거나 콘센트·차단기를 학생이 조작하지 않아요. 손상·열·냄새가 보이면 **만지거나 계속 쓰지 않고 어른에게 알려요.** 정상 부품이라도 사용 목적·허용 조건을 지켜야 해요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "할 일의 범위"
     ],
     "rows": [
      [
       "찢어진 전선 피복",
       "학생이 테이프로 수리해 켜 보지 않고 알리기"
      ],
      [
       "전원을 끄거나 분리할 필요",
       "어른·교사의 절차와 허락을 따르기"
      ],
      [
       "저전압 수업 부품",
       "정격·연결·통전 시간을 교사에게 확인받기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "전기를 안전하게 사용하는 근거를 찾아요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "친구가 “손이 말랐으니 손상된 기구도 잠깐 켜 보자”라고 했어요. 어떻게 판단할까요?",
     "steps": [
      [
       "위험 근거",
       "손상이라는 신호가 이미 있어요."
      ],
      [
       "조건 구별",
       "손이 마른 사실이 기구의 손상을 없애지 않아요."
      ],
      [
       "행동 정하기",
       "직접 시험하지 않고 어른에게 알려요."
      ]
     ],
     "answer": "안전을 한 조건으로 보장하지 않고 손상 신호에 맞게 행동해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 97",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w097"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 98~99",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w098",
      "c22-s62-u03-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 100~101",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w100",
      "c22-s62-u03-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 102~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w102",
      "c22-s62-u03-w103",
      "c22-s62-u03-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w105",
      "c22-s62-u03-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 107",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 108",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 109",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 110",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 111",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 안전하게 사용하는 근거를 찾아요 · 112",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험 신호를 근거로 사용을 멈추고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "마른 손이나 절연 피복만으로 모든 상황의 안전을 보장하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "상황·위험 근거·어른에게 알릴 내용·내가 할 수 있는 행동을 나눠요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "개념 8",
   "title": "전기를 아끼는 계획을 실천하고 돌아봐요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "계획",
       "언제·어디서·누가·무엇을·어떻게 확인할지 정함"
      ],
      [
       "실행",
       "실제로 한 행동·날짜·근거를 남김"
      ],
      [
       "검토",
       "계획과 실행을 비교하고 남은 한계·다음 확인을 정함"
      ]
     ]
    },
    {
     "type": "text",
     "text": "밝기·환기·식품 보관 등 필요한 기능을 해치지 않는 행동을 교사와 골라요. 계획을 쓴 것만으로 실천했다고 하지 않아요. **실제로 못 했다면 미실행**, 아직 돌아볼 날이 아니라면 미검토로 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "제공 연습 자료·실측 아님",
      "월(분)",
      "화(분)",
      "수(분)"
     ],
     "rows": [
      [
       "불필요 점등·전",
       "30",
       "30",
       "30"
      ],
      [
       "불필요 점등·후",
       "18",
       "17",
       "19"
      ]
     ]
    },
    {
     "type": "text",
     "text": "합계는90분과54분으로36분 줄었어요. 점등 시간의 변화이며 전기 사용량·요금은 이 표에서 측정하지 않았어요. 효과를 더 보려면 기간·기구·다른 사용 조건과 실제 사용량 자료가 필요해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로 잇기",
     "hint": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "electricity-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "전기를 아끼는 계획을 실천하고 돌아봐요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "실천 계획서는 썼지만 이번 주에는 실행하지 못했어요. 전기를 얼마나 아꼈다고 적을까요?",
     "steps": [
      [
       "단계 확인",
       "지금 있는 것은 계획과 미실행 이유예요."
      ],
      [
       "근거 경계",
       "하지 않은 행동의 절약량을 만들어 적지 않아요."
      ],
      [
       "다음 기회",
       "실행할 날짜·허락·확인 방법을 다시 정해요."
      ]
     ],
     "answer": "미실행을 사실대로 남기고 다음 확인을 구체적으로 계획해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 113~114",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w113",
      "c22-s62-u03-w114"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 115~117",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w115",
      "c22-s62-u03-w116",
      "c22-s62-u03-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 118~120",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w118",
      "c22-s62-u03-w119",
      "c22-s62-u03-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 121~122",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w121",
      "c22-s62-u03-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 123",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 124",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 125",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 126",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 127",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 128",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u03-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 10",
   "title": "실천할 행동 하나를 구체적으로 정해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "밝기·환기·보관 등 필요한 기능을 해치지 않는 행동을 골라요.",
      "언제·어디서·누가·무엇을 할지 교사와 정해요.",
      "실행 확인 방법과 돌아볼 날짜를 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "장소·담당·기간",
      "행동·허락·확인 방법",
      "검토 날짜"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-practice-plan-do04",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 11",
   "title": "계획한 행동을 실제로 실행해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사와 정상 기구·장소·사용 여부를 확인해요.",
      "허락받은 행동만 하고 날짜·직접 확인한 근거를 적어요.",
      "못 했다면 미실행 이유와 다음 기회를 적어요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "실제 날짜·행동",
      "직접 확인한 근거",
      "미실행 이유"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-practice-do04",
   "layout": "electricity-workbook"
  },
  {
   "section": "실제 활동 12",
   "title": "실행 기록을 나누고 다시 확인해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "계획과 실제 실행·미실행을 구별해 짝에게 설명해요.",
      "확인한 변화와 측정하지 않은 사용량·요금을 나누어요.",
      "받은 질문·더 필요한 자료·다음 확인 날짜를 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "내가 설명한 근거",
      "받은 질문·효과의 한계",
      "다음 확인·미검토"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 한 일·미실행·다음 확인",
     "hint": "제공된 연습값으로 실제 관찰 칸을 채우지 않아요. 직접 본 사실과 해석을 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 기능을 지키며 계획·실행·검토를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불필요 점등 시간과 전기 사용량·요금은 같은 측정값이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "계획·실제 행동·확인한 변화·모르는 효과와 다음 날짜를 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-share-review-do04",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 정리",
   "title": "접점에서 생활 속 실천까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배움의 연결",
      "남길 근거"
     ],
     "rows": [
      [
       "접점·재료·전지",
       "연결 스케치와 실제 반복 비교"
      ],
      [
       "전자석의 제작·성질",
       "절연 코일·거리·시점·나침반 반응"
      ],
      [
       "장치와 쓰임",
       "출처 있는 구조·제어 목적"
      ],
      [
       "안전·효율적 이용",
       "구체적 계획·실제 실행·검토의 한계"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 것",
     "hint": "관찰·제공 자료·해석·남은 질문을 이어 정리해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 기준6과15-01~04를 실제 근거로 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "정답 수와 실제 수행의 확인은 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-01",
   "title": "한 전구 회로의 접점을 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "실제 회로를 만들고 두 접점·전지의 서로 다른 극·스위치·재료의 근거를 남겨요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-02",
   "title": "한 개와 두 개의 전지를 비교하기",
   "blocks": [
    {
     "type": "text",
     "text": "교사 허용 범위의 전지 수를 바꾸고 나머지 조건을 맞춰 반복 관찰한 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-03",
   "title": "전자석의 성질과 쓰임 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "실제 만든 코일의 전류 연결 전후·세기·극을 비교하고 출처 있는 기기 구조와 쓰임을 연결해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  },
  {
   "section": "단원 수행평가 · 6과15-04",
   "title": "안전·절약 계획을 실제로 실천하기",
   "blocks": [
    {
     "type": "text",
     "text": "조사·계획·실행·검토를 구별해 직접 확인한 근거와 효과의 한계·다음 확인을 설명해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "미실행·미관찰·대체 자료는 사실대로 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장으로 근거를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 제작·관찰·조사·실천 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획·예시 답·연습값으로 실제 수행을 대신하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "electricity-workbook"
  },
  {
   "kind": "duplex-blank",
   "layout": "electricity-workbook"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w001",
      "c22-s62-u03-w002",
      "c22-s62-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 4~6",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w004",
      "c22-s62-u03-w005",
      "c22-s62-u03-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 7~9",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w007",
      "c22-s62-u03-w008",
      "c22-s62-u03-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 10~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w010",
      "c22-s62-u03-w011",
      "c22-s62-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 13~14",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w013",
      "c22-s62-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 15~16",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w015",
      "c22-s62-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 17~19",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w017",
      "c22-s62-u03-w018",
      "c22-s62-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 20~22",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w020",
      "c22-s62-u03-w021",
      "c22-s62-u03-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 23~25",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w023",
      "c22-s62-u03-w024",
      "c22-s62-u03-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 26~28",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w026",
      "c22-s62-u03-w027",
      "c22-s62-u03-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 29~30",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w029",
      "c22-s62-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 31~32",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w031",
      "c22-s62-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 33~35",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w033",
      "c22-s62-u03-w034",
      "c22-s62-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 36~38",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w036",
      "c22-s62-u03-w037",
      "c22-s62-u03-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 39~41",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w039",
      "c22-s62-u03-w040",
      "c22-s62-u03-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 42~44",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w042",
      "c22-s62-u03-w043",
      "c22-s62-u03-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 45~46",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w045",
      "c22-s62-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 47~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w047",
      "c22-s62-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 49~51",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w049",
      "c22-s62-u03-w050",
      "c22-s62-u03-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 52~54",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w052",
      "c22-s62-u03-w053",
      "c22-s62-u03-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 55~57",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w055",
      "c22-s62-u03-w056",
      "c22-s62-u03-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 58~60",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w058",
      "c22-s62-u03-w059",
      "c22-s62-u03-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 61~62",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w061",
      "c22-s62-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 63~64",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w063",
      "c22-s62-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 65~67",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w065",
      "c22-s62-u03-w066",
      "c22-s62-u03-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 68~70",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w068",
      "c22-s62-u03-w069",
      "c22-s62-u03-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 71~73",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w071",
      "c22-s62-u03-w072",
      "c22-s62-u03-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 74~76",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w074",
      "c22-s62-u03-w075",
      "c22-s62-u03-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 77~78",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w077",
      "c22-s62-u03-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 79~80",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w079",
      "c22-s62-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 81~83",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w081",
      "c22-s62-u03-w082",
      "c22-s62-u03-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 84~86",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w084",
      "c22-s62-u03-w085",
      "c22-s62-u03-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 87~89",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w087",
      "c22-s62-u03-w088",
      "c22-s62-u03-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 90~92",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w090",
      "c22-s62-u03-w091",
      "c22-s62-u03-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 93~94",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w093",
      "c22-s62-u03-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 95~95",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 96~97",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w096",
      "c22-s62-u03-w097"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 98~100",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w098",
      "c22-s62-u03-w099",
      "c22-s62-u03-w100"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 101~103",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w101",
      "c22-s62-u03-w102",
      "c22-s62-u03-w103"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 104~106",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w104",
      "c22-s62-u03-w105",
      "c22-s62-u03-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 107~108",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w107",
      "c22-s62-u03-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 109~109",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 110~111",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w110",
      "c22-s62-u03-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 112~113",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w112",
      "c22-s62-u03-w113"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 114~116",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w114",
      "c22-s62-u03-w115",
      "c22-s62-u03-w116"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 117~119",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w117",
      "c22-s62-u03-w118",
      "c22-s62-u03-w119"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 120~122",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w120",
      "c22-s62-u03-w121",
      "c22-s62-u03-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 123~124",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w123",
      "c22-s62-u03-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 125~125",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 126~127",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w126",
      "c22-s62-u03-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 128~128",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u03-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·필수 단위·결론의 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 근거를 갖춘 다른 표현·설계는 교사가 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과15-01",
   "title": "한 전구 회로의 접점을 설명하기",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "실제 회로를 만들고 두 접점·전지의 서로 다른 극·스위치·재료의 근거를 남겨요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 교사의 허용 부품·절연·연결 변경·통전 시간과 학생의 실제 근거를 확인한다. 미관찰을 작용 없음으로 바꾸거나 미실행에 절약 효과를 만들어 넣지 않는다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "확인한 수행 근거·남은 질문·피드백을 따로 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과15-02",
   "title": "한 개와 두 개의 전지를 비교하기",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "교사 허용 범위의 전지 수를 바꾸고 나머지 조건을 맞춰 반복 관찰한 근거로 설명해요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 교사의 허용 부품·절연·연결 변경·통전 시간과 학생의 실제 근거를 확인한다. 미관찰을 작용 없음으로 바꾸거나 미실행에 절약 효과를 만들어 넣지 않는다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "확인한 수행 근거·남은 질문·피드백을 따로 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과15-03",
   "title": "전자석의 성질과 쓰임 설명하기",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "실제 만든 코일의 전류 연결 전후·세기·극을 비교하고 출처 있는 기기 구조와 쓰임을 연결해요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 교사의 허용 부품·절연·연결 변경·통전 시간과 학생의 실제 근거를 확인한다. 미관찰을 작용 없음으로 바꾸거나 미실행에 절약 효과를 만들어 넣지 않는다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "확인한 수행 근거·남은 질문·피드백을 따로 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과15-04",
   "title": "안전·절약 계획을 실제로 실천하기",
   "kind": "answers",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "조사·계획·실행·검토를 구별해 직접 확인한 근거와 효과의 한계·다음 확인을 설명해요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 교사의 허용 부품·절연·연결 변경·통전 시간과 학생의 실제 근거를 확인한다. 미관찰을 작용 없음으로 바꾸거나 미실행에 절약 효과를 만들어 넣지 않는다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "확인한 수행 근거·남은 질문·피드백을 따로 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~24번",
   "kind": "quick",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "electricity-quick-0"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분별 답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "25~48번",
   "kind": "quick",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "electricity-quick-24"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분별 답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "49~72번",
   "kind": "quick",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "electricity-quick-48"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분별 답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "73~96번",
   "kind": "quick",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "electricity-quick-72"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분별 답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "97~120번",
   "kind": "quick",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "electricity-quick-96"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분별 답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "121~128번",
   "kind": "quick",
   "layout": "electricity-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "electricity-quick-120"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분별 답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  }
 ],
 "figures": {
  "book-preparation": "<div class=\"electricity-book-photo\"><img src=\"../assets/book/s41-u01-photo-preparation.webp\" alt=\"자석·클립·나무 조각 등이 따로 놓인 준비 배치\" loading=\"eager\"><p class=\"electricity-book-photo-caption\">전지 없이 쓰는 자석과 비교할 준비물의 참고 사진이에요. 전자석의 관찰 결과가 아니며 색으로 극을 정하지 않아요.<small>모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요.</small></p></div>",
  "bulb": "<div class=\"electricity-book-photo\"><img src=\"../assets/activities/c22-s62-u03/bulb-reference.webp\" alt=\"작은 전구 밑부분의 옆 금속·절연 부분·바닥 금속 접점\" loading=\"eager\"><p class=\"electricity-book-photo-caption\">전구 밑부분을 확대한 참고 사진이에요. 유리와 내부 전체는 이 사진으로 비교하지 않아요. 접점의 연결 상태와 전구 정격은 실물·표시를 교사와 확인해요. 사진은 켜짐을 시험한 결과가 아니에요.<small>모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요.</small></p></div>",
  "coil": "<div class=\"electricity-book-photo\"><img src=\"../assets/activities/c22-s62-u03/coil-reference.webp\" alt=\"둥글게 묶어 놓은 주황색 선과 따로 놓인 금속 막대\" loading=\"eager\"><p class=\"electricity-book-photo-caption\">선 묶음과 금속 막대를 따로 놓은 준비 모습의 참고 사진이에요. 완성된 전자석이나 연결도는 아니에요. 철심 재료·절연·허용 전원은 교사가 실물로 확인해요.<small>모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요.</small></p></div>",
  "sources": "<div class=\"electricity-book-sources\"><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://nationalmaglab.org/magnet-academy/plan-a-lesson/electromagnets/\">National MagLab · 전자석의 쓰임 ↗</a><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://energizer.com/about-batteries/battery-care/\">Energizer · 전지 관리 ↗</a><p>자료 내용 확인:2026-10-22. 조사할 장치의 종류·구조와 자료의 범위를 함께 읽어요. 실제 조사는 출처와 확인한 내용을 따로 남겨요.</p></div>",
  "electricity-question-data-11": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">부분</th><th scope=\"col\">분류</th></tr></thead><tbody><tr><th scope=\"row\">옆 금속</th><td>금속 접점</td></tr><tr><th scope=\"row\">바닥 금속</th><td>금속 접점</td></tr><tr><th scope=\"row\">유리</th><td>접점 아님</td></tr><tr><th scope=\"row\">사이의 절연 부분</th><td>접점 아님</td></tr></tbody></table>",
  "electricity-question-data-12": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">메모</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>실물을 보고 옆·바닥 금속의 위치를 표시함</td></tr><tr><th scope=\"row\">ㄴ</th><td>아직 연결하지 않고 켜질 것이라고 적음</td></tr><tr><th scope=\"row\">ㄷ</th><td>설명서에서 전구 정격을 읽음</td></tr></tbody></table>",
  "electricity-question-data-17": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">전구 옆 금속 쪽</th><th scope=\"col\">전구 바닥 금속 쪽</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>전지 +극</td><td>전지 −극</td></tr><tr><th scope=\"row\">ㄴ</th><td>전지 +극</td><td>전지 +극</td></tr><tr><th scope=\"row\">ㄷ</th><td>전지 +극</td><td>집게가 바닥 대신 유리에만 닿음</td></tr><tr><th scope=\"row\">ㄹ</th><td>전지 −극</td><td>전지 +극</td></tr></tbody></table>",
  "electricity-question-data-25": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">전구 옆 금속 쪽</th><th scope=\"col\">전구 바닥 금속 쪽</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>전지 +극</td><td>전지 −극</td></tr><tr><th scope=\"row\">ㄴ</th><td>전지 +극</td><td>전지 +극</td></tr><tr><th scope=\"row\">ㄷ</th><td>전지 +극</td><td>집게가 바닥 대신 유리에만 닿음</td></tr><tr><th scope=\"row\">ㄹ</th><td>전지 −극</td><td>전지 +극</td></tr></tbody></table>",
  "electricity-question-data-27": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">전구 옆 금속 쪽</th><th scope=\"col\">전구 바닥 금속 쪽</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>전지 +극</td><td>전지 −극</td></tr><tr><th scope=\"row\">ㄴ</th><td>전지 +극</td><td>전지 +극</td></tr><tr><th scope=\"row\">ㄷ</th><td>전지 +극</td><td>집게가 바닥 대신 유리에만 닿음</td></tr><tr><th scope=\"row\">ㄹ</th><td>전지 −극</td><td>전지 +극</td></tr></tbody></table>",
  "electricity-question-data-28": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">이미 이어진 곳</th><th scope=\"col\">아직 떨어진 두 끝</th></tr></thead><tbody><tr><th scope=\"row\">전지 +극→닫힌 스위치→전구 옆 금속</th><td>전구 바닥 금속 / 전지 −극</td></tr></tbody></table>",
  "electricity-question-data-33": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">가운데에서 이은 극</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>첫 전지 +극 ↔ 둘째 전지 +극</td></tr><tr><th scope=\"row\">ㄴ</th><td>첫 전지 −극 ↔ 둘째 전지 +극</td></tr><tr><th scope=\"row\">ㄷ</th><td>첫 전지 −극 ↔ 둘째 전지 −극</td></tr></tbody></table>",
  "electricity-question-data-42": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">가운데에서 이은 극</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>첫 전지 +극 ↔ 둘째 전지 +극</td></tr><tr><th scope=\"row\">ㄴ</th><td>첫 전지 −극 ↔ 둘째 전지 +극</td></tr><tr><th scope=\"row\">ㄷ</th><td>첫 전지 −극 ↔ 둘째 전지 −극</td></tr></tbody></table>",
  "electricity-question-data-43": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">가운데에서 이은 극</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>첫 전지 +극 ↔ 둘째 전지 +극</td></tr><tr><th scope=\"row\">ㄴ</th><td>첫 전지 −극 ↔ 둘째 전지 +극</td></tr><tr><th scope=\"row\">ㄷ</th><td>첫 전지 −극 ↔ 둘째 전지 −극</td></tr></tbody></table>",
  "electricity-question-data-44": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">구간</th><th scope=\"col\">메모</th></tr></thead><tbody><tr><th scope=\"row\">가운데</th><td>첫 전지 −극과 둘째 전지 +극</td></tr><tr><th scope=\"row\">전구로 가는 두 끝</th><td>가운데에 쓰지 않고 남은 양 끝</td></tr></tbody></table>",
  "electricity-question-data-50": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">전지 조건</th><th scope=\"col\">1회 센서 표시</th><th scope=\"col\">2회</th><th scope=\"col\">3회</th></tr></thead><tbody><tr><th scope=\"row\">1개</th><td>31 lx</td><td>33 lx</td><td>32 lx</td></tr><tr><th scope=\"row\">2개</th><td>50 lx</td><td>54 lx</td><td>52 lx</td></tr></tbody></table>",
  "electricity-question-data-58": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">전지 조건</th><th scope=\"col\">1회 센서 표시</th><th scope=\"col\">2회</th><th scope=\"col\">3회</th></tr></thead><tbody><tr><th scope=\"row\">1개</th><td>31 lx</td><td>33 lx</td><td>32 lx</td></tr><tr><th scope=\"row\">2개</th><td>50 lx</td><td>54 lx</td><td>52 lx</td></tr></tbody></table>",
  "electricity-question-data-59": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">전지 조건</th><th scope=\"col\">1회 센서 표시</th><th scope=\"col\">2회</th><th scope=\"col\">3회</th></tr></thead><tbody><tr><th scope=\"row\">1개</th><td>31 lx</td><td>33 lx</td><td>32 lx</td></tr><tr><th scope=\"row\">2개</th><td>50 lx</td><td>54 lx</td><td>52 lx</td></tr></tbody></table>",
  "electricity-question-data-60": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">전지 조건</th><th scope=\"col\">1회 센서 표시</th><th scope=\"col\">2회</th><th scope=\"col\">3회</th></tr></thead><tbody><tr><th scope=\"row\">1개</th><td>31 lx</td><td>33 lx</td><td>32 lx</td></tr><tr><th scope=\"row\">2개</th><td>50 lx</td><td>54 lx</td><td>52 lx</td></tr></tbody></table>",
  "electricity-question-data-66": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">붙은 철 클립</th></tr></thead><tbody><tr><th scope=\"row\">연결 전</th><td>0개</td></tr><tr><th scope=\"row\">전류를 켠 때</th><td>6개</td></tr><tr><th scope=\"row\">전원 분리 뒤</th><td>1개</td></tr></tbody></table>",
  "electricity-question-data-74": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">붙은 철 클립</th></tr></thead><tbody><tr><th scope=\"row\">연결 전</th><td>0개</td></tr><tr><th scope=\"row\">전류를 켠 때</th><td>6개</td></tr><tr><th scope=\"row\">전원 분리 뒤</th><td>1개</td></tr></tbody></table>",
  "electricity-question-data-75": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">붙은 철 클립</th></tr></thead><tbody><tr><th scope=\"row\">연결 전</th><td>0개</td></tr><tr><th scope=\"row\">전류를 켠 때</th><td>6개</td></tr><tr><th scope=\"row\">전원 분리 뒤</th><td>1개</td></tr></tbody></table>",
  "electricity-question-data-76": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">시점</th><th scope=\"col\">기록 상태</th></tr></thead><tbody><tr><th scope=\"row\">연결 전</th><td>직접 관찰</td></tr><tr><th scope=\"row\">통전 중</th><td>직접 관찰</td></tr><tr><th scope=\"row\">분리 뒤</th><td>시간 부족으로 못 봄</td></tr></tbody></table>",
  "electricity-question-data-89": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">전지 수</th><th scope=\"col\">1회</th><th scope=\"col\">2회</th><th scope=\"col\">3회</th></tr></thead><tbody><tr><th scope=\"row\">1개</th><td>4개</td><td>5개</td><td>4개</td></tr><tr><th scope=\"row\">2개</th><td>8개</td><td>9개</td><td>8개</td></tr></tbody></table>",
  "electricity-question-data-91": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">전지 수</th><th scope=\"col\">1회</th><th scope=\"col\">2회</th><th scope=\"col\">3회</th></tr></thead><tbody><tr><th scope=\"row\">1개</th><td>4개</td><td>5개</td><td>4개</td></tr><tr><th scope=\"row\">2개</th><td>8개</td><td>9개</td><td>8개</td></tr></tbody></table>",
  "electricity-question-data-92": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">위치와 연결</th><th scope=\"col\">확인된 나침반 N극과 반응</th></tr></thead><tbody><tr><th scope=\"row\">처음 왼쪽</th><td>밀림</td></tr><tr><th scope=\"row\">처음 오른쪽</th><td>끌림</td></tr><tr><th scope=\"row\">반대 연결 뒤 왼쪽</th><td>끌림</td></tr><tr><th scope=\"row\">반대 연결 뒤 오른쪽</th><td>밀림</td></tr></tbody></table>",
  "electricity-question-data-97": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">사용 전 점검 카드</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>피복이 찢어져 안쪽 금속이 보임</td></tr><tr><th scope=\"row\">ㄴ</th><td>정상 플러그 몸체를 마른 손으로 잡아 분리함</td></tr><tr><th scope=\"row\">ㄷ</th><td>기구에서 타는 냄새가 나 사용을 중단함</td></tr><tr><th scope=\"row\">ㄹ</th><td>기구 설명서의 지정 전지 종류를 확인함</td></tr></tbody></table>",
  "electricity-question-data-107": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">사용 전 점검 카드</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>피복이 찢어져 안쪽 금속이 보임</td></tr><tr><th scope=\"row\">ㄴ</th><td>정상 플러그 몸체를 마른 손으로 잡아 분리함</td></tr><tr><th scope=\"row\">ㄷ</th><td>기구에서 타는 냄새가 나 사용을 중단함</td></tr><tr><th scope=\"row\">ㄹ</th><td>기구 설명서의 지정 전지 종류를 확인함</td></tr></tbody></table>",
  "electricity-question-data-108": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">기록</th></tr></thead><tbody><tr><th scope=\"row\">전지 규격</th><td>설명서와 교사 확인 완료</td></tr><tr><th scope=\"row\">전구 접점</th><td>교사 확인 완료</td></tr><tr><th scope=\"row\">코일 허용 조건</th><td>아직 확인하지 않음</td></tr><tr><th scope=\"row\">통전 시간</th><td>아직 정하지 않음</td></tr></tbody></table>",
  "electricity-question-data-123": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">전: 불필요하게 켠 시간</th><th scope=\"col\">후: 불필요하게 켠 시간</th></tr></thead><tbody><tr><th scope=\"row\">1일</th><td>60분</td><td>35분</td></tr><tr><th scope=\"row\">2일</th><td>60분</td><td>30분</td></tr><tr><th scope=\"row\">3일</th><td>60분</td><td>25분</td></tr></tbody></table>",
  "electricity-question-data-124": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">카드</th><th scope=\"col\">내용</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>다음 주 점심에 끄기로 정한 계획</td></tr><tr><th scope=\"row\">나</th><td>실제로 끄고 날짜를 적은 실행</td></tr><tr><th scope=\"row\">다</th><td>기간 뒤 빠뜨린 날을 살핀 검토</td></tr><tr><th scope=\"row\">라</th><td>실천할 장소와 담당을 정한 계획</td></tr></tbody></table>",
  "electricity-question-data-125": "<table class=\"ed-table electricity-book-table\"><caption>제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">전: 불필요하게 켠 시간</th><th scope=\"col\">후: 불필요하게 켠 시간</th></tr></thead><tbody><tr><th scope=\"row\">1일</th><td>60분</td><td>35분</td></tr><tr><th scope=\"row\">2일</th><td>60분</td><td>30분</td></tr><tr><th scope=\"row\">3일</th><td>60분</td><td>25분</td></tr></tbody></table>",
  "electricity-quick-0": "<div class=\"electricity-quick-grid\"><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">2</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">3</th><td>빈칸 넣기</td><td>전류 / 전기 회로</td></tr><tr><th scope=\"row\">4</th><td>빈칸 넣기</td><td>전기 / 접촉</td></tr><tr><th scope=\"row\">5</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">6</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">7</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">8</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">9</th><td>복수 선택</td><td>①, ②, ⑤</td></tr><tr><th scope=\"row\">10</th><td>복수 선택</td><td>③, ④, ⑤</td></tr><tr><th scope=\"row\">11</th><td>자료 해석</td><td>2개 / 2개</td></tr><tr><th scope=\"row\">12</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr></tbody></table><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">13</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">14</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">15</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">16</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">18</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">19</th><td>빈칸 넣기</td><td>서로 다른 / 끊어지지</td></tr><tr><th scope=\"row\">20</th><td>빈칸 넣기</td><td>절연 / 금속</td></tr><tr><th scope=\"row\">21</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">22</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">23</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">24</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr></tbody></table></div>",
  "electricity-quick-24": "<div class=\"electricity-quick-grid\"><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">25</th><td>복수 선택</td><td>①, ②, ⑤</td></tr><tr><th scope=\"row\">26</th><td>복수 선택</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">27</th><td>자료 해석</td><td>2개 / 2개</td></tr><tr><th scope=\"row\">28</th><td>자료 해석</td><td>전구 바닥 금속 / 전지 −극</td></tr><tr><th scope=\"row\">29</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">30</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">31</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">32</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">33</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">34</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">35</th><td>빈칸 넣기</td><td>서로 다른 / 바깥</td></tr><tr><th scope=\"row\">36</th><td>빈칸 넣기</td><td>전원 / 교사</td></tr></tbody></table><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">37</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">38</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">39</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">40</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">41</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">42</th><td>복수 선택</td><td>①, ④, ⑤</td></tr><tr><th scope=\"row\">43</th><td>자료 해석</td><td>1개 / ㄴ</td></tr><tr><th scope=\"row\">44</th><td>자료 해석</td><td>서로 다른 극 / 바깥</td></tr><tr><th scope=\"row\">45</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">46</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">47</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">48</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "electricity-quick-48": "<div class=\"electricity-quick-grid\"><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">49</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">50</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">51</th><td>빈칸 넣기</td><td>바꿀 / 같게 할</td></tr><tr><th scope=\"row\">52</th><td>빈칸 넣기</td><td>제공 / 미실행</td></tr><tr><th scope=\"row\">53</th><td>연결하기</td><td>ㄷ / ㄴ / ㄱ</td></tr><tr><th scope=\"row\">54</th><td>연결하기</td><td>ㄱ / ㄷ / ㄴ</td></tr><tr><th scope=\"row\">55</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">56</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">57</th><td>복수 선택</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">58</th><td>복수 선택</td><td>①, ④, ⑤</td></tr><tr><th scope=\"row\">59</th><td>자료 해석</td><td>32lx / 52lx</td></tr><tr><th scope=\"row\">60</th><td>자료 해석</td><td>20lx / 3회</td></tr></tbody></table><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">61</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">62</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">63</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">66</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">67</th><td>빈칸 넣기</td><td>절연 / 끝</td></tr><tr><th scope=\"row\">68</th><td>빈칸 넣기</td><td>전 / 뒤</td></tr><tr><th scope=\"row\">69</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">70</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">71</th><td>순서 배열</td><td>ㄷ → ㄹ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">72</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr></tbody></table></div>",
  "electricity-quick-72": "<div class=\"electricity-quick-grid\"><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">73</th><td>복수 선택</td><td>②, ④, ⑤</td></tr><tr><th scope=\"row\">74</th><td>복수 선택</td><td>②, ③, ④</td></tr><tr><th scope=\"row\">75</th><td>자료 해석</td><td>6개 / 1개</td></tr><tr><th scope=\"row\">76</th><td>자료 해석</td><td>2개 / 1개</td></tr><tr><th scope=\"row\">77</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">78</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">79</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">82</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">83</th><td>빈칸 넣기</td><td>방향 / 극</td></tr><tr><th scope=\"row\">84</th><td>빈칸 넣기</td><td>켤 / 끌</td></tr></tbody></table><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">86</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">87</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">88</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">89</th><td>복수 선택</td><td>①, ③, ⑤</td></tr><tr><th scope=\"row\">90</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">91</th><td>자료 해석</td><td>3회 / 1회</td></tr><tr><th scope=\"row\">92</th><td>자료 해석</td><td>N극 / S극</td></tr><tr><th scope=\"row\">93</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">94</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">95</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "electricity-quick-96": "<div class=\"electricity-quick-grid\"><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">97</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">98</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">99</th><td>빈칸 넣기</td><td>몸체 / 어른</td></tr><tr><th scope=\"row\">100</th><td>빈칸 넣기</td><td>크기 / 섞지</td></tr><tr><th scope=\"row\">101</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">102</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">103</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">104</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">105</th><td>복수 선택</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">106</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">107</th><td>자료 해석</td><td>2개 / 2개</td></tr><tr><th scope=\"row\">108</th><td>자료 해석</td><td>2개 / 2개</td></tr></tbody></table><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">109</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">110</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">111</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">112</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">113</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">114</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">115</th><td>빈칸 넣기</td><td>계획 / 실행</td></tr><tr><th scope=\"row\">116</th><td>빈칸 넣기</td><td>미실행 / 검토</td></tr><tr><th scope=\"row\">117</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">118</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">119</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">120</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr></tbody></table></div>",
  "electricity-quick-120": "<div class=\"electricity-quick-grid\"><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">121</th><td>복수 선택</td><td>②, ③, ④</td></tr><tr><th scope=\"row\">122</th><td>복수 선택</td><td>②, ④, ⑤</td></tr><tr><th scope=\"row\">123</th><td>자료 해석</td><td>180분 / 90분</td></tr><tr><th scope=\"row\">124</th><td>자료 해석</td><td>2개 / 1개</td></tr></tbody></table><table class=\"ed-table electricity-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">125</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">126</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">127</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">128</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>"
 },
 "figureModels": {
  "book-preparation": {
   "kind": "photo",
   "src": "../assets/book/s41-u01-photo-preparation.webp",
   "alt": "자석·클립·나무 조각 등이 따로 놓인 준비 배치",
   "caption": "전지 없이 쓰는 자석과 비교할 준비물의 참고 사진이에요. 전자석의 관찰 결과가 아니며 색으로 극을 정하지 않아요.",
   "credit": "모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요."
  },
  "bulb": {
   "kind": "photo",
   "src": "../assets/activities/c22-s62-u03/bulb-reference.webp",
   "alt": "작은 전구 밑부분의 옆 금속·절연 부분·바닥 금속 접점",
   "caption": "전구 밑부분을 확대한 참고 사진이에요. 유리와 내부 전체는 이 사진으로 비교하지 않아요. 접점의 연결 상태와 전구 정격은 실물·표시를 교사와 확인해요. 사진은 켜짐을 시험한 결과가 아니에요.",
   "credit": "모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요."
  },
  "coil": {
   "kind": "photo",
   "src": "../assets/activities/c22-s62-u03/coil-reference.webp",
   "alt": "둥글게 묶어 놓은 주황색 선과 따로 놓인 금속 막대",
   "caption": "선 묶음과 금속 막대를 따로 놓은 준비 모습의 참고 사진이에요. 완성된 전자석이나 연결도는 아니에요. 철심 재료·절연·허용 전원은 교사가 실물로 확인해요.",
   "credit": "모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요."
  },
  "sources": {
   "kind": "source-links",
   "links": [
    {
     "label": "National MagLab · 전자석의 쓰임",
     "url": "https://nationalmaglab.org/magnet-academy/plan-a-lesson/electromagnets/"
    },
    {
     "label": "Energizer · 전지 관리",
     "url": "https://energizer.com/about-batteries/battery-care/"
    }
   ],
   "caption": "자료 내용 확인:2026-10-22. 조사할 장치의 종류·구조와 자료의 범위를 함께 읽어요. 실제 조사는 출처와 확인한 내용을 따로 남겨요."
  },
  "electricity-question-data-11": {
   "kind": "table",
   "heads": [
    "부분",
    "분류"
   ],
   "rows": [
    [
     "옆 금속",
     "금속 접점"
    ],
    [
     "바닥 금속",
     "금속 접점"
    ],
    [
     "유리",
     "접점 아님"
    ],
    [
     "사이의 절연 부분",
     "접점 아님"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-12": {
   "kind": "table",
   "heads": [
    "기호",
    "메모"
   ],
   "rows": [
    [
     "ㄱ",
     "실물을 보고 옆·바닥 금속의 위치를 표시함"
    ],
    [
     "ㄴ",
     "아직 연결하지 않고 켜질 것이라고 적음"
    ],
    [
     "ㄷ",
     "설명서에서 전구 정격을 읽음"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-17": {
   "kind": "table",
   "heads": [
    "기호",
    "전구 옆 금속 쪽",
    "전구 바닥 금속 쪽"
   ],
   "rows": [
    [
     "ㄱ",
     "전지 +극",
     "전지 −극"
    ],
    [
     "ㄴ",
     "전지 +극",
     "전지 +극"
    ],
    [
     "ㄷ",
     "전지 +극",
     "집게가 바닥 대신 유리에만 닿음"
    ],
    [
     "ㄹ",
     "전지 −극",
     "전지 +극"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-25": {
   "kind": "table",
   "heads": [
    "기호",
    "전구 옆 금속 쪽",
    "전구 바닥 금속 쪽"
   ],
   "rows": [
    [
     "ㄱ",
     "전지 +극",
     "전지 −극"
    ],
    [
     "ㄴ",
     "전지 +극",
     "전지 +극"
    ],
    [
     "ㄷ",
     "전지 +극",
     "집게가 바닥 대신 유리에만 닿음"
    ],
    [
     "ㄹ",
     "전지 −극",
     "전지 +극"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-27": {
   "kind": "table",
   "heads": [
    "기호",
    "전구 옆 금속 쪽",
    "전구 바닥 금속 쪽"
   ],
   "rows": [
    [
     "ㄱ",
     "전지 +극",
     "전지 −극"
    ],
    [
     "ㄴ",
     "전지 +극",
     "전지 +극"
    ],
    [
     "ㄷ",
     "전지 +극",
     "집게가 바닥 대신 유리에만 닿음"
    ],
    [
     "ㄹ",
     "전지 −극",
     "전지 +극"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-28": {
   "kind": "table",
   "heads": [
    "이미 이어진 곳",
    "아직 떨어진 두 끝"
   ],
   "rows": [
    [
     "전지 +극→닫힌 스위치→전구 옆 금속",
     "전구 바닥 금속 / 전지 −극"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-33": {
   "kind": "table",
   "heads": [
    "기호",
    "가운데에서 이은 극"
   ],
   "rows": [
    [
     "ㄱ",
     "첫 전지 +극 ↔ 둘째 전지 +극"
    ],
    [
     "ㄴ",
     "첫 전지 −극 ↔ 둘째 전지 +극"
    ],
    [
     "ㄷ",
     "첫 전지 −극 ↔ 둘째 전지 −극"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-42": {
   "kind": "table",
   "heads": [
    "기호",
    "가운데에서 이은 극"
   ],
   "rows": [
    [
     "ㄱ",
     "첫 전지 +극 ↔ 둘째 전지 +극"
    ],
    [
     "ㄴ",
     "첫 전지 −극 ↔ 둘째 전지 +극"
    ],
    [
     "ㄷ",
     "첫 전지 −극 ↔ 둘째 전지 −극"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-43": {
   "kind": "table",
   "heads": [
    "기호",
    "가운데에서 이은 극"
   ],
   "rows": [
    [
     "ㄱ",
     "첫 전지 +극 ↔ 둘째 전지 +극"
    ],
    [
     "ㄴ",
     "첫 전지 −극 ↔ 둘째 전지 +극"
    ],
    [
     "ㄷ",
     "첫 전지 −극 ↔ 둘째 전지 −극"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-44": {
   "kind": "table",
   "heads": [
    "구간",
    "메모"
   ],
   "rows": [
    [
     "가운데",
     "첫 전지 −극과 둘째 전지 +극"
    ],
    [
     "전구로 가는 두 끝",
     "가운데에 쓰지 않고 남은 양 끝"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-50": {
   "kind": "table",
   "heads": [
    "전지 조건",
    "1회 센서 표시",
    "2회",
    "3회"
   ],
   "rows": [
    [
     "1개",
     "31 lx",
     "33 lx",
     "32 lx"
    ],
    [
     "2개",
     "50 lx",
     "54 lx",
     "52 lx"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-58": {
   "kind": "table",
   "heads": [
    "전지 조건",
    "1회 센서 표시",
    "2회",
    "3회"
   ],
   "rows": [
    [
     "1개",
     "31 lx",
     "33 lx",
     "32 lx"
    ],
    [
     "2개",
     "50 lx",
     "54 lx",
     "52 lx"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-59": {
   "kind": "table",
   "heads": [
    "전지 조건",
    "1회 센서 표시",
    "2회",
    "3회"
   ],
   "rows": [
    [
     "1개",
     "31 lx",
     "33 lx",
     "32 lx"
    ],
    [
     "2개",
     "50 lx",
     "54 lx",
     "52 lx"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-60": {
   "kind": "table",
   "heads": [
    "전지 조건",
    "1회 센서 표시",
    "2회",
    "3회"
   ],
   "rows": [
    [
     "1개",
     "31 lx",
     "33 lx",
     "32 lx"
    ],
    [
     "2개",
     "50 lx",
     "54 lx",
     "52 lx"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-66": {
   "kind": "table",
   "heads": [
    "상태",
    "붙은 철 클립"
   ],
   "rows": [
    [
     "연결 전",
     "0개"
    ],
    [
     "전류를 켠 때",
     "6개"
    ],
    [
     "전원 분리 뒤",
     "1개"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-74": {
   "kind": "table",
   "heads": [
    "상태",
    "붙은 철 클립"
   ],
   "rows": [
    [
     "연결 전",
     "0개"
    ],
    [
     "전류를 켠 때",
     "6개"
    ],
    [
     "전원 분리 뒤",
     "1개"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-75": {
   "kind": "table",
   "heads": [
    "상태",
    "붙은 철 클립"
   ],
   "rows": [
    [
     "연결 전",
     "0개"
    ],
    [
     "전류를 켠 때",
     "6개"
    ],
    [
     "전원 분리 뒤",
     "1개"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-76": {
   "kind": "table",
   "heads": [
    "시점",
    "기록 상태"
   ],
   "rows": [
    [
     "연결 전",
     "직접 관찰"
    ],
    [
     "통전 중",
     "직접 관찰"
    ],
    [
     "분리 뒤",
     "시간 부족으로 못 봄"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-89": {
   "kind": "table",
   "heads": [
    "전지 수",
    "1회",
    "2회",
    "3회"
   ],
   "rows": [
    [
     "1개",
     "4개",
     "5개",
     "4개"
    ],
    [
     "2개",
     "8개",
     "9개",
     "8개"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-91": {
   "kind": "table",
   "heads": [
    "전지 수",
    "1회",
    "2회",
    "3회"
   ],
   "rows": [
    [
     "1개",
     "4개",
     "5개",
     "4개"
    ],
    [
     "2개",
     "8개",
     "9개",
     "8개"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-92": {
   "kind": "table",
   "heads": [
    "위치와 연결",
    "확인된 나침반 N극과 반응"
   ],
   "rows": [
    [
     "처음 왼쪽",
     "밀림"
    ],
    [
     "처음 오른쪽",
     "끌림"
    ],
    [
     "반대 연결 뒤 왼쪽",
     "끌림"
    ],
    [
     "반대 연결 뒤 오른쪽",
     "밀림"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-97": {
   "kind": "table",
   "heads": [
    "기호",
    "사용 전 점검 카드"
   ],
   "rows": [
    [
     "ㄱ",
     "피복이 찢어져 안쪽 금속이 보임"
    ],
    [
     "ㄴ",
     "정상 플러그 몸체를 마른 손으로 잡아 분리함"
    ],
    [
     "ㄷ",
     "기구에서 타는 냄새가 나 사용을 중단함"
    ],
    [
     "ㄹ",
     "기구 설명서의 지정 전지 종류를 확인함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-107": {
   "kind": "table",
   "heads": [
    "기호",
    "사용 전 점검 카드"
   ],
   "rows": [
    [
     "ㄱ",
     "피복이 찢어져 안쪽 금속이 보임"
    ],
    [
     "ㄴ",
     "정상 플러그 몸체를 마른 손으로 잡아 분리함"
    ],
    [
     "ㄷ",
     "기구에서 타는 냄새가 나 사용을 중단함"
    ],
    [
     "ㄹ",
     "기구 설명서의 지정 전지 종류를 확인함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-108": {
   "kind": "table",
   "heads": [
    "항목",
    "기록"
   ],
   "rows": [
    [
     "전지 규격",
     "설명서와 교사 확인 완료"
    ],
    [
     "전구 접점",
     "교사 확인 완료"
    ],
    [
     "코일 허용 조건",
     "아직 확인하지 않음"
    ],
    [
     "통전 시간",
     "아직 정하지 않음"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-123": {
   "kind": "table",
   "heads": [
    "날짜",
    "전: 불필요하게 켠 시간",
    "후: 불필요하게 켠 시간"
   ],
   "rows": [
    [
     "1일",
     "60분",
     "35분"
    ],
    [
     "2일",
     "60분",
     "30분"
    ],
    [
     "3일",
     "60분",
     "25분"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-124": {
   "kind": "table",
   "heads": [
    "카드",
    "내용"
   ],
   "rows": [
    [
     "가",
     "다음 주 점심에 끄기로 정한 계획"
    ],
    [
     "나",
     "실제로 끄고 날짜를 적은 실행"
    ],
    [
     "다",
     "기간 뒤 빠뜨린 날을 살핀 검토"
    ],
    [
     "라",
     "실천할 장소와 담당을 정한 계획"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-question-data-125": {
   "kind": "table",
   "heads": [
    "날짜",
    "전: 불필요하게 켠 시간",
    "후: 불필요하게 켠 시간"
   ],
   "rows": [
    [
     "1일",
     "60분",
     "35분"
    ],
    [
     "2일",
     "60분",
     "30분"
    ],
    [
     "3일",
     "60분",
     "25분"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생의 측정·제작 결과가 아니에요."
  },
  "electricity-quick-0": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      1,
      "객관식",
      "③"
     ],
     [
      2,
      "객관식",
      "①"
     ],
     [
      3,
      "빈칸 넣기",
      "전류 / 전기 회로"
     ],
     [
      4,
      "빈칸 넣기",
      "전기 / 접촉"
     ],
     [
      5,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      6,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      7,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      8,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      9,
      "복수 선택",
      "①, ②, ⑤"
     ],
     [
      10,
      "복수 선택",
      "③, ④, ⑤"
     ],
     [
      11,
      "자료 해석",
      "2개 / 2개"
     ],
     [
      12,
      "자료 해석",
      "ㄱ / ㄴ"
     ]
    ],
    [
     [
      13,
      "까닭 설명",
      "교사 확인"
     ],
     [
      14,
      "까닭 설명",
      "교사 확인"
     ],
     [
      15,
      "그림·설계",
      "교사 확인"
     ],
     [
      16,
      "그림·설계",
      "교사 확인"
     ],
     [
      17,
      "객관식",
      "④"
     ],
     [
      18,
      "객관식",
      "②"
     ],
     [
      19,
      "빈칸 넣기",
      "서로 다른 / 끊어지지"
     ],
     [
      20,
      "빈칸 넣기",
      "절연 / 금속"
     ],
     [
      21,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      22,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      23,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      24,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ]
    ]
   ]
  },
  "electricity-quick-24": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      25,
      "복수 선택",
      "①, ②, ⑤"
     ],
     [
      26,
      "복수 선택",
      "①, ③, ④"
     ],
     [
      27,
      "자료 해석",
      "2개 / 2개"
     ],
     [
      28,
      "자료 해석",
      "전구 바닥 금속 / 전지 −극"
     ],
     [
      29,
      "까닭 설명",
      "교사 확인"
     ],
     [
      30,
      "까닭 설명",
      "교사 확인"
     ],
     [
      31,
      "그림·설계",
      "교사 확인"
     ],
     [
      32,
      "그림·설계",
      "교사 확인"
     ],
     [
      33,
      "객관식",
      "⑤"
     ],
     [
      34,
      "객관식",
      "③"
     ],
     [
      35,
      "빈칸 넣기",
      "서로 다른 / 바깥"
     ],
     [
      36,
      "빈칸 넣기",
      "전원 / 교사"
     ]
    ],
    [
     [
      37,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      38,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      39,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      40,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      41,
      "복수 선택",
      "②, ③, ⑤"
     ],
     [
      42,
      "복수 선택",
      "①, ④, ⑤"
     ],
     [
      43,
      "자료 해석",
      "1개 / ㄴ"
     ],
     [
      44,
      "자료 해석",
      "서로 다른 극 / 바깥"
     ],
     [
      45,
      "까닭 설명",
      "교사 확인"
     ],
     [
      46,
      "까닭 설명",
      "교사 확인"
     ],
     [
      47,
      "그림·설계",
      "교사 확인"
     ],
     [
      48,
      "그림·설계",
      "교사 확인"
     ]
    ]
   ]
  },
  "electricity-quick-48": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      49,
      "객관식",
      "①"
     ],
     [
      50,
      "객관식",
      "④"
     ],
     [
      51,
      "빈칸 넣기",
      "바꿀 / 같게 할"
     ],
     [
      52,
      "빈칸 넣기",
      "제공 / 미실행"
     ],
     [
      53,
      "연결하기",
      "ㄷ / ㄴ / ㄱ"
     ],
     [
      54,
      "연결하기",
      "ㄱ / ㄷ / ㄴ"
     ],
     [
      55,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      56,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      57,
      "복수 선택",
      "①, ③, ④"
     ],
     [
      58,
      "복수 선택",
      "①, ④, ⑤"
     ],
     [
      59,
      "자료 해석",
      "32lx / 52lx"
     ],
     [
      60,
      "자료 해석",
      "20lx / 3회"
     ]
    ],
    [
     [
      61,
      "까닭 설명",
      "교사 확인"
     ],
     [
      62,
      "까닭 설명",
      "교사 확인"
     ],
     [
      63,
      "그림·설계",
      "교사 확인"
     ],
     [
      64,
      "그림·설계",
      "교사 확인"
     ],
     [
      65,
      "객관식",
      "②"
     ],
     [
      66,
      "객관식",
      "⑤"
     ],
     [
      67,
      "빈칸 넣기",
      "절연 / 끝"
     ],
     [
      68,
      "빈칸 넣기",
      "전 / 뒤"
     ],
     [
      69,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      70,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      71,
      "순서 배열",
      "ㄷ → ㄹ → ㄱ → ㄴ"
     ],
     [
      72,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ]
    ]
   ]
  },
  "electricity-quick-72": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      73,
      "복수 선택",
      "②, ④, ⑤"
     ],
     [
      74,
      "복수 선택",
      "②, ③, ④"
     ],
     [
      75,
      "자료 해석",
      "6개 / 1개"
     ],
     [
      76,
      "자료 해석",
      "2개 / 1개"
     ],
     [
      77,
      "까닭 설명",
      "교사 확인"
     ],
     [
      78,
      "까닭 설명",
      "교사 확인"
     ],
     [
      79,
      "그림·설계",
      "교사 확인"
     ],
     [
      80,
      "그림·설계",
      "교사 확인"
     ],
     [
      81,
      "객관식",
      "③"
     ],
     [
      82,
      "객관식",
      "①"
     ],
     [
      83,
      "빈칸 넣기",
      "방향 / 극"
     ],
     [
      84,
      "빈칸 넣기",
      "켤 / 끌"
     ]
    ],
    [
     [
      85,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      86,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      87,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      88,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      89,
      "복수 선택",
      "①, ③, ⑤"
     ],
     [
      90,
      "복수 선택",
      "②, ③, ⑤"
     ],
     [
      91,
      "자료 해석",
      "3회 / 1회"
     ],
     [
      92,
      "자료 해석",
      "N극 / S극"
     ],
     [
      93,
      "까닭 설명",
      "교사 확인"
     ],
     [
      94,
      "까닭 설명",
      "교사 확인"
     ],
     [
      95,
      "그림·설계",
      "교사 확인"
     ],
     [
      96,
      "그림·설계",
      "교사 확인"
     ]
    ]
   ]
  },
  "electricity-quick-96": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      97,
      "객관식",
      "④"
     ],
     [
      98,
      "객관식",
      "②"
     ],
     [
      99,
      "빈칸 넣기",
      "몸체 / 어른"
     ],
     [
      100,
      "빈칸 넣기",
      "크기 / 섞지"
     ],
     [
      101,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      102,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      103,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      104,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      105,
      "복수 선택",
      "①, ②, ④"
     ],
     [
      106,
      "복수 선택",
      "②, ③, ⑤"
     ],
     [
      107,
      "자료 해석",
      "2개 / 2개"
     ],
     [
      108,
      "자료 해석",
      "2개 / 2개"
     ]
    ],
    [
     [
      109,
      "까닭 설명",
      "교사 확인"
     ],
     [
      110,
      "까닭 설명",
      "교사 확인"
     ],
     [
      111,
      "그림·설계",
      "교사 확인"
     ],
     [
      112,
      "그림·설계",
      "교사 확인"
     ],
     [
      113,
      "객관식",
      "⑤"
     ],
     [
      114,
      "객관식",
      "③"
     ],
     [
      115,
      "빈칸 넣기",
      "계획 / 실행"
     ],
     [
      116,
      "빈칸 넣기",
      "미실행 / 검토"
     ],
     [
      117,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      118,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      119,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      120,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ]
    ]
   ]
  },
  "electricity-quick-120": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      121,
      "복수 선택",
      "②, ③, ④"
     ],
     [
      122,
      "복수 선택",
      "②, ④, ⑤"
     ],
     [
      123,
      "자료 해석",
      "180분 / 90분"
     ],
     [
      124,
      "자료 해석",
      "2개 / 1개"
     ]
    ],
    [
     [
      125,
      "까닭 설명",
      "교사 확인"
     ],
     [
      126,
      "까닭 설명",
      "교사 확인"
     ],
     [
      127,
      "그림·설계",
      "교사 확인"
     ],
     [
      128,
      "그림·설계",
      "교사 확인"
     ]
    ]
   ]
  }
 },
 "duplexAnswerStartsOnRecto": true,
 "questionSource": "c22-s62-u03.questions.js",
 "visualBindings": [
  {
   "no": 11,
   "figure": "electricity-question-data-11",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 12,
   "figure": "electricity-question-data-12",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 17,
   "figure": "electricity-question-data-17",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 25,
   "figure": "electricity-question-data-25",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 27,
   "figure": "electricity-question-data-27",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 28,
   "figure": "electricity-question-data-28",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 33,
   "figure": "electricity-question-data-33",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 42,
   "figure": "electricity-question-data-42",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 43,
   "figure": "electricity-question-data-43",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 44,
   "figure": "electricity-question-data-44",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 50,
   "figure": "electricity-question-data-50",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 58,
   "figure": "electricity-question-data-58",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 59,
   "figure": "electricity-question-data-59",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 60,
   "figure": "electricity-question-data-60",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 66,
   "figure": "electricity-question-data-66",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 74,
   "figure": "electricity-question-data-74",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 75,
   "figure": "electricity-question-data-75",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 76,
   "figure": "electricity-question-data-76",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 89,
   "figure": "electricity-question-data-89",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 91,
   "figure": "electricity-question-data-91",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 92,
   "figure": "electricity-question-data-92",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 97,
   "figure": "electricity-question-data-97",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 107,
   "figure": "electricity-question-data-107",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 108,
   "figure": "electricity-question-data-108",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 123,
   "figure": "electricity-question-data-123",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 124,
   "figure": "electricity-question-data-124",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 125,
   "figure": "electricity-question-data-125",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  }
 ],
 "activityIds": [
  "circuit-build-do01",
  "switch-do01",
  "materials-do01",
  "brightness-do02",
  "coil-build-do03",
  "magnet-onoff-do03",
  "strength-do03",
  "poles-do03",
  "device-research-do03",
  "practice-plan-do04",
  "practice-do04",
  "share-review-do04"
 ],
 "actualStudentPerformanceConfirmed": false
};

export const workbook20261104=withElectricityEditorial(baseWorkbook);
export const learnerPriorWorkbook=withStudentScienceLanguage(workbook20261104);
export const termParticlePriorWorkbook=withLearnerExplanations(learnerPriorWorkbook);
export const guidanceParticlePriorWorkbook=withTermParticleLanguage(termParticlePriorWorkbook);
export const electricityReadablePriorWorkbook=withGuidanceParticles(guidanceParticlePriorWorkbook);
export const workbook=withElectricityReadableWorkbook(electricityReadablePriorWorkbook);
