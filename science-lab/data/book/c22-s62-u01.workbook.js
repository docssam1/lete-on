import{withStudentGuideLanguage}from'./student-opening-language.js?v=20261105-student-guide';
import{withGuidanceParticles}from'./term-particle-language.js?v=20261105-guidance-particles';
import{withLearnerExplanations}from'./learner-explanations.js';
import{withSeasonEditorial,withSeasonConceptLanguage}from'./c22-s62-u01.editorial.js?v=20261105-season-concept-language';
// 계절의 변화 독립128문항. scripts/gen-science-workbook-c22s62u01.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s62-u01",
 "title": "계절의 변화",
 "semester": "6-2",
 "no": 1,
 "theme": "#2456c4",
 "book": "지필드 교과 연결 사고력",
 "richText": true,
 "questions": [
  {
   "id": "c22-s62-u01-w001",
   "no": 1,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T01",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "받침판이 수평이고 막대가 수직입니다. 태양 고도를 나타낼 두 방향을 고르세요.",
   "answer": "③ 받침판의 수평 방향과 햇빛 방향",
   "explanation": "태양 고도는 수평면에서 태양 쪽 방향까지의 각이에요. 그림자 끝과 막대 끝을 잇는 실은 빛 방향을 간접적으로 나타내므로 수평 받침과 실 사이의 각을 읽어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "막대의 수직 방향과 받침판 방향",
    "막대 그림자의 끝과 시계 바늘 방향",
    "받침판의 수평 방향과 햇빛 방향",
    "막대의 수직 방향과 북쪽 방향",
    "온도계의 눈금과 그림자 길이"
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ③ 받침판의 수평 방향과 햇빛 방향를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요."
  },
  {
   "id": "c22-s62-u01-w002",
   "no": 2,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "두 측정기가 같은 순간 같은 햇빛을 받았습니다. 막대 높이만 다를 때 맞는 비교를 고르세요.",
   "answer": "① 각은 같고 높은 막대의 그림자가 더 길다.",
   "explanation": "같은 장소·같은 순간의 빛 방향은 막대의 높이로 변하지 않아요. 높은 막대는 더 긴 그림자를 만들지만 수평면과 실 사이의 각은 같아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "각은 같고 높은 막대의 그림자가 더 길다.",
    "각은 같고 높은 막대의 그림자가 더 짧다.",
    "막대 높이가 두 배면 각도도 두 배다.",
    "낮은 막대에서는 태양이 지평선 아래다.",
    "그림자가 길수록 태양 고도도 반드시 크다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "givens": "두 받침은 같은 수평면이며 두 막대는 모두 수직이다.",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ① 각은 같고 높은 막대의 그림자가 더 길다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "given": [
    "두 받침은 같은 수평면이며 두 막대는 모두 수직이다."
   ]
  },
  {
   "id": "c22-s62-u01-w003",
   "no": 3,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T01",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "실과 (1) 사이의 각이 태양 고도예요. 막대가 받침판에 바르게 섰다면 막대와 받침은 (2)을 이루어요.",
   "answer": "수평면 / 직각",
   "explanation": "고도의 기준은 수직 막대가 아니라 수평면이에요. 수직 막대와 수평 받침 사이의 직각은 측정 장치의 조건이며 태양 고도 그 자체가 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "수평면",
       "수평 받침면",
       "수평인 지표면"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "직각",
       "90°",
       "90도"
      ]
     }
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 수평면 또는 수평 받침면 또는 수평인 지표면 / (2) 직각 또는 90° 또는 90도. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w004",
   "no": 4,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "그림자 끝이 흔들릴 때는 막대와 실을 먼저 (1)해요. 같은 시각 두 번 읽은 값이 다르면 두 값을 (2)하여 눈금·실 위치를 다시 확인해요.",
   "answer": "고정 / 비교",
   "explanation": "막대와 실을 고정하면 기준이 흔들리는 원인을 줄여요. 두 번 읽은 값은 하나를 지우거나 평균만 남기기 전에 서로 비교하여 읽는 위치와 도구를 확인해야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "고정",
       "안정되게 고정"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "비교"
      ]
     }
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 고정 또는 안정되게 고정 / (2) 비교. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w005",
   "no": 5,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "각 부분에 해당하는 점검을 한 번씩 연결하세요.",
   "answer": "ㄱ / ㄷ / ㄴ",
   "explanation": "받침은 수평, 막대는 수직, 각도기는 수평 기준과 눈금 방향을 확인해요. 세 점검을 서로 바꾸면 다른 기준의 각을 재거나 바닥 기울기가 섞일 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 받침판",
    "(2) 막대",
    "(3) 각도기"
   ],
   "options": [
    "ㄱ 수평인지 확인한다.",
    "ㄴ 0° 기준과 눈금 방향을 확인한다.",
    "ㄷ 받침과 수직인지 확인한다."
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄱ",
     "ㄷ",
     "ㄴ"
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄱ / (2) ㄷ / (3) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "given": [
    "ㄱ 수평인지 확인한다.",
    "ㄴ 0° 기준과 눈금 방향을 확인한다.",
    "ㄷ 받침과 수직인지 확인한다."
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w006",
   "no": 6,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T01",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "기록한 양과 단위를 한 번씩 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "태양 고도는 각이라서 °, 그림자는 길이라서 cm, 기온은 공기 온도이므로 ℃를 사용해요. 숫자가 같더라도 서로 다른 양을 같은 값이라고 할 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 태양 고도",
    "(2) 그림자 길이",
    "(3) 그늘의 공기 온도"
   ],
   "options": [
    "ㄱ cm",
    "ㄴ ℃",
    "ㄷ °"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "given": [
    "ㄱ cm",
    "ㄴ ℃",
    "ㄷ °"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w007",
   "no": 7,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "수평·수직 점검을 마쳤습니다. 그림자와 실로 각을 읽는 세 단계를 필요한 순서로 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "실을 이을 그림자 끝을 먼저 표시해야 해요. 그다음 두 끝을 연결하고 그 실을 기준으로 각을 읽으므로 ㄴ→ㄱ→ㄷ예요. 태양을 눈으로 겨냥할 필요는 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 막대 끝과 표시한 그림자 끝을 실로 잇는다.",
    "ㄴ 그림자 끝을 같은 순간에 표시한다.",
    "ㄷ 수평면과 연결한 실 사이의 각을 읽는다."
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
   "standards": [
    "6과13-01"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "given": [
    "ㄱ 막대 끝과 표시한 그림자 끝을 실로 잇는다.",
    "ㄴ 그림자 끝을 같은 순간에 표시한다.",
    "ㄷ 수평면과 연결한 실 사이의 각을 읽는다."
   ]
  },
  {
   "id": "c22-s62-u01-w008",
   "no": 8,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "첫 읽기에서 실이 느슨한 것을 발견했습니다. 아래 수정 과정을 인과에 맞게 이으세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "발견한 오차 원인을 바로잡은 뒤 다시 읽어야 수정의 영향을 비교할 수 있어요. ㄴ→ㄷ→ㄱ이며 새 값이 마음에 든다는 이유로 앞 기록을 없애지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 같은 설정에서 각을 다시 읽어 두 읽기를 비교한다.",
    "ㄴ 느슨한 실 때문에 빛 방향이 제대로 나타나지 않았음을 확인한다.",
    "ㄷ 실을 팽팽하게 잇고 장치를 안정되게 고정한다."
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
   "standards": [
    "6과13-01"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "given": [
    "ㄱ 같은 설정에서 각을 다시 읽어 두 읽기를 비교한다.",
    "ㄴ 느슨한 실 때문에 빛 방향이 제대로 나타나지 않았음을 확인한다.",
    "ㄷ 실을 팽팽하게 잇고 장치를 안정되게 고정한다."
   ]
  },
  {
   "id": "c22-s62-u01-w009",
   "no": 9,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "태양 고도를 안전하고 타당하게 측정하는 행동을 모두 고르세요. (정답 3개)",
   "answer": "①, ③, ④",
   "explanation": "그림자를 이용한 간접 측정·장치 고정·시각과 단위 기록은 안전과 비교 조건에 필요해요. 태양을 직접 보거나 받침 기울기를 무시하면 안 돼요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "막대가 흔들리지 않도록 안정적으로 고정한다.",
    "받침이 기울어져도 실의 각만 읽는다.",
    "측정 시각과 각도 단위를 함께 적는다.",
    "그림자 끝을 이용해 태양 방향을 간접적으로 정한다.",
    "태양을 렌즈로 들여다보며 실을 맞춘다."
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
   "standards": [
    "6과13-01"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ④. 선택 순서는 관계없다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요."
  },
  {
   "id": "c22-s62-u01-w010",
   "no": 10,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "막대만 길게 바꾸어 정확도를 높였다고 단정할 수 없는 까닭으로 타당한 것을 고르세요. (정답 2개)",
   "answer": "①, ③",
   "explanation": "측정 장치의 길이만 바꾸었다고 다른 오차가 모두 줄어들지는 않아요. 흔들림·수평·수직·눈금 확인이 필요하며 실제 태양 고도나 단위가 막대 때문에 달라지지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "긴 막대는 흔들려 그림자 끝 표시가 불안정할 수 있다.",
    "막대 높이가 커지면 태양 고도가 실제로 낮아진다.",
    "받침의 수평·막대의 수직도 함께 확인해야 한다.",
    "긴 막대에서는 각도 단위가 cm로 바뀐다.",
    "막대가 길어지면 어떤 구름 아래서도 그림자가 생긴다."
   ],
   "key": [
    0,
    2
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     2
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐·추가·중복 없이 고른다: ①, ③. 선택 순서는 관계없다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요."
  },
  {
   "id": "c22-s62-u01-w011",
   "no": 11,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T01",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "수평·수직 장치에서 실과 수직 막대 사이 각을 읽었습니다. 태양 고도를 각각 단위와 함께 구하세요. (1) 장치 P (2) 장치 Q",
   "answer": "58° / 36°",
   "explanation": "수평과 수직 사이가90°이므로 고도는90°에서 표의 각을 뺀 값이에요. P는90−32=58°, Q는90−54=36°예요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 58,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "58°"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 36,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "36°"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "장치",
     "실과 수직 막대 사이의 안쪽 각"
    ],
    "행": [
     [
      "P",
      "32°"
     ],
     [
      "Q",
      "54°"
     ]
    ]
   },
   "verificationModel": {
    "kind": "complements",
    "verticalAngles": [
     32,
     54
    ],
    "answers": [
     58,
     36
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 58° (단위 필요) / (2) 36° (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-11"
  },
  {
   "id": "c22-s62-u01-w012",
   "no": 12,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "두 사람이 같은 시각 각도기를 반복해서 읽었습니다. (1) P 두 값의 차 (2) Q 두 값의 차를 단위와 함께 쓰세요.",
   "answer": "2° / 0°",
   "explanation": "P는45−43=2°, Q는44−44=0°예요. Q의 반복값이 같아도 실제 정답이44°라고 확정한 것은 아니며 둘 다 같은 눈금을 잘못 읽었을 가능성을 따로 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
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
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2°"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 0,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "0°"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "읽은 사람",
     "첫 읽기",
     "둘째 읽기"
    ],
    "행": [
     [
      "P",
      "43°",
      "45°"
     ],
     [
      "Q",
      "44°",
      "44°"
     ]
    ]
   },
   "verificationModel": {
    "kind": "differences",
    "pairs": [
     [
      43,
      45
     ],
     [
      44,
      44
     ]
    ],
    "answers": [
     2,
     0
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 2° (단위 필요) / (2) 0° (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-12"
  },
  {
   "id": "c22-s62-u01-w013",
   "no": 13,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T01",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "수직 막대와 실 사이의 각을 그대로 태양 고도라고 쓴 친구의 설명을 고쳐 주세요.",
   "answer": "태양 고도는 수평면과 빛 방향 사이의 각이다. 막대와 실 사이의 각을 읽었다면 막대·받침이 직각인지 확인하고90°에서 그 각을 빼야 한다.",
   "explanation": "태양 고도의 두 방향을 먼저 정해야 해요. 수직 막대 기준 각은 고도와 더해90°가 되는 각이므로 기준면을 바꾸거나 직각에서 빼서 고쳐요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "수평면을 고도의 기준으로 밝힌다.",
    "실이 나타내는 빛 방향을 설명한다.",
    "수직 기준의 각을 그대로 쓰면 다른 각이라는 점과 고치는 방법을 말한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "태양 고도는 수평면과 빛 방향 사이의 각이다. 막대와 실 사이의 각을 읽었다면 막대·받침이 직각인지 확인하고90°에서 그 각을 빼야 한다.",
    "required": [
     "수평면을 고도의 기준으로 밝힌다.",
     "실이 나타내는 빛 방향을 설명한다.",
     "수직 기준의 각을 그대로 쓰면 다른 각이라는 점과 고치는 방법을 말한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "까닭 설명",
   "criteria": "수평면을 고도의 기준으로 밝힌다. / 실이 나타내는 빛 방향을 설명한다. / 수직 기준의 각을 그대로 쓰면 다른 각이라는 점과 고치는 방법을 말한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w014",
   "no": 14,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "두 반복값이 같으니 더 확인할 필요가 없다는 주장에 답하세요.",
   "answer": "같은 값이 두 번 나와도 받침이 기울거나 같은 눈금을 잘못 읽었을 수 있다. 수평·수직·각도기 기준과 실 위치를 확인하고 다른 사람이 같은 시각에 읽어 비교한다.",
   "explanation": "반복은 값이 얼마나 흔들리는지 살피는 데 유용하지만 같은 체계적 오차를 없애 주지는 않아요. 장치 기준과 읽기 방법을 확인해야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "반복값 일치와 정확함을 구별한다.",
    "두 번 모두에 작용할 수 있는 구체적 오차 하나를 든다.",
    "그 오차를 확인하거나 줄일 행동을 제시한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "같은 값이 두 번 나와도 받침이 기울거나 같은 눈금을 잘못 읽었을 수 있다. 수평·수직·각도기 기준과 실 위치를 확인하고 다른 사람이 같은 시각에 읽어 비교한다.",
    "required": [
     "반복값 일치와 정확함을 구별한다.",
     "두 번 모두에 작용할 수 있는 구체적 오차 하나를 든다.",
     "그 오차를 확인하거나 줄일 행동을 제시한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "까닭 설명",
   "criteria": "반복값 일치와 정확함을 구별한다. / 두 번 모두에 작용할 수 있는 구체적 오차 하나를 든다. / 그 오차를 확인하거나 줄일 행동을 제시한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w015",
   "no": 15,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "그림자와 실로 고도를 재는 장치를 설계해 그리세요. 수평면·수직 막대·그림자 끝·실·읽을 각에 이름표를 붙이세요.",
   "answer": "수평 받침 위 수직 막대를 그리고 막대 끝과 그림자 끝을 실로 잇는다. 그림자 끝에서 수평면과 실이 이루는 각에 고도라고 표시하고 태양을 직접 보지 않는다고 쓴다.",
   "explanation": "선의 모양보다 기준·두 끝의 연결·각 위치가 중요해요. 수직 막대와 실 사이에 고도 표시를 하면 기준이 바뀌므로 수정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "받침과 막대의 수평·수직을 그림으로 구별한다.",
    "실이 막대 끝과 그림자 끝을 정확히 잇는다.",
    "고도 표시가 수평면과 빛 방향 사이에 있다.",
    "간접 측정과 안정된 고정을 설명한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "수평 받침 위 수직 막대를 그리고 막대 끝과 그림자 끝을 실로 잇는다. 그림자 끝에서 수평면과 실이 이루는 각에 고도라고 표시하고 태양을 직접 보지 않는다고 쓴다.",
    "required": [
     "받침과 막대의 수평·수직을 그림으로 구별한다.",
     "실이 막대 끝과 그림자 끝을 정확히 잇는다.",
     "고도 표시가 수평면과 빛 방향 사이에 있다.",
     "간접 측정과 안정된 고정을 설명한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "받침과 막대의 수평·수직을 그림으로 구별한다. / 실이 막대 끝과 그림자 끝을 정확히 잇는다. / 고도 표시가 수평면과 빛 방향 사이에 있다. / 간접 측정과 안정된 고정을 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w016",
   "no": 16,
   "section": 1,
   "sectionTitle": "태양 고도 측정기를 만들어요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T02",
   "topic": "태양 고도 측정기를 만들어요",
   "prompt": "내 측정기의 흔들림을 줄이는 수정 전·후 설계를 그리고, 바꾼 부분과 기대하는 효과를 설명하세요.",
   "answer": "수정 전 느슨한 실 또는 흔들리는 받침을 표시하고 수정 후 고정 방법을 그린다. 실이 빛 방향을 더 안정적으로 나타내거나 같은 수평 기준을 유지한다고 설명한다.",
   "explanation": "여러 타당한 설계가 가능해요. 막대를 무조건 길게 하는 것보다 발견한 오차와 수정 방법이 연결되는지 선생님과 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "구체적인 수정 전 문제를 표시한다.",
    "수정한 구조·방법을 그림과 이름표로 나타낸다.",
    "그 수정이 어떤 측정 오차를 줄이는지 연결한다.",
    "아직 만들거나 확인하지 않았다면 설계/예상임을 밝힌다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "수정 전 느슨한 실 또는 흔들리는 받침을 표시하고 수정 후 고정 방법을 그린다. 실이 빛 방향을 더 안정적으로 나타내거나 같은 수평 기준을 유지한다고 설명한다.",
    "required": [
     "구체적인 수정 전 문제를 표시한다.",
     "수정한 구조·방법을 그림과 이름표로 나타낸다.",
     "그 수정이 어떤 측정 오차를 줄이는지 연결한다.",
     "아직 만들거나 확인하지 않았다면 설계/예상임을 밝힌다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "구체적인 수정 전 문제를 표시한다. / 수정한 구조·방법을 그림과 이름표로 나타낸다. / 그 수정이 어떤 측정 오차를 줄이는지 연결한다. / 아직 만들거나 확인하지 않았다면 설계/예상임을 밝힌다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w017",
   "no": 17,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "같은20cm 막대의 연습 기록에서 10:50과12:50을 비교한 설명을 고르세요.",
   "answer": "⑤ 고도는 높아지고 그림자는 짧아졌다.",
   "explanation": "10:50의40°·23.8cm와12:50의60°·11.5cm를 비교해요. 같은 수직 막대에서 고도가 높아질수록 그림자는 짧아지는 관계를 이 두 기록이 보여 줘요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "고도와 그림자가 모두 커졌다.",
    "고도는 낮아지고 그림자는 길어졌다.",
    "고도는 같고 그림자만 짧아졌다.",
    "고도와 그림자가 모두 줄었다.",
    "고도는 높아지고 그림자는 짧아졌다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ⑤ 고도는 높아지고 그림자는 짧아졌다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "figure": "season-question-data-17"
  },
  {
   "id": "c22-s62-u01-w018",
   "no": 18,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "시각별 기록 네 개에서 가장 큰 고도를 찾았습니다. 확실히 말할 수 있는 것을 고르세요.",
   "answer": "② 관측한 네 값 가운데 그 값이 가장 크다.",
   "explanation": "성긴 관측표는 실제로 읽은 값끼리의 크기를 알려 줘요. 사이 시각의 값이나 정확한 남중, 다른 날·한 해의 최댓값까지 알려 주지는 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "그 시각이 실제 남중의 정확한 순간이다.",
    "관측한 네 값 가운데 그 값이 가장 크다.",
    "관측 사이의 모든 순간에도 고도를 쟀다.",
    "그 값이 그해 가장 큰 남중 고도이다.",
    "다음 날에도 같은 시각에 최대가 된다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "givens": "남중 시각을 별도로 제시하지 않은 실제 측정표라고 가정한다.",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ② 관측한 네 값 가운데 그 값이 가장 크다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "남중 시각을 별도로 제시하지 않은 실제 측정표라고 가정한다."
   ]
  },
  {
   "id": "c22-s62-u01-w019",
   "no": 19,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "같은 수직 막대에서 고도가 높아지면 그림자 길이는 (1). 같은 날 고도가 가장 높은 때를 우리나라에서는 태양이 (2)하는 때라고 해요.",
   "answer": "짧아진다 / 남중",
   "explanation": "수평면의 같은 수직 막대를 기준으로 고도와 그림자 길이는 반대로 변해요. 우리나라에서 태양은 남쪽 하늘의 자오선을 지날 때 가장 높으며 이를 남중이라고 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "짧아진다",
       "짧아짐",
       "짧아져요"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "남중"
      ]
     }
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 짧아진다 또는 짧아짐 또는 짧아져요 / (2) 남중. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w020",
   "no": 20,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "하루의 변화를 나타낼 그래프의 공통 가로축은 (1)이에요. 고도 그래프의 세로축 단위는 (2)로 적어요.",
   "answer": "시각 / °",
   "explanation": "하루 변화는 측정한 시각을 가로축으로 맞추어 비교해요. 고도는 각이므로 세로축에는°를 쓰며 그림자cm·기온℃와 다른 눈금을 사용해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "시각",
       "측정 시각",
       "시간"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "°",
       "도"
      ]
     }
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 시각 또는 측정 시각 또는 시간 / (2) ° 또는 도. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w021",
   "no": 21,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "연습 자료에서 시각과 그림자 길이를 한 번씩 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "표에서09:50은42.9cm, 11:50은14.0cm, 12:50은11.5cm예요. 고도25°→55°→60°와 함께 읽으면 그림자가 짧아지는 관계도 확인할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 09:50",
    "(2) 11:50",
    "(3) 12:50"
   ],
   "options": [
    "ㄱ 11.5cm",
    "ㄴ 42.9cm",
    "ㄷ 14.0cm"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
    "ㄱ 11.5cm",
    "ㄴ 42.9cm",
    "ㄷ 14.0cm"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-21"
  },
  {
   "id": "c22-s62-u01-w022",
   "no": 22,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "각 기록의 뜻을 맞게 한 번씩 연결하세요.",
   "answer": "ㄷ / ㄴ / ㄱ",
   "explanation": "기록 중 최대는 표에서 찾지만 실제 하루의 최대 시각은 별도 근거가 필요해요. 미측정 시각은 추측값을 실측 칸에 넣지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 측정한 값 중 최대",
    "(2) 하루의 정확한 남중",
    "(3) 측정하지 못한 시각"
   ],
   "options": [
    "ㄱ 실제로 읽지 않은 값으로 남겨야 한다.",
    "ㄴ 성긴 표의 최대 시각만으로 확정할 수 없다.",
    "ㄷ 표에 실제로 기록된 값끼리 비교해 찾는다."
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄴ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "ㄱ 실제로 읽지 않은 값으로 남겨야 한다.",
    "ㄴ 성긴 표의 최대 시각만으로 확정할 수 없다.",
    "ㄷ 표에 실제로 기록된 값끼리 비교해 찾는다."
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w023",
   "no": 23,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "측정표를 그래프로 옮겨 그 그래프에서 관계를 설명하는 작업의 순서를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "무엇을 나타내는 축인지 정해야 그 위치에 점을 찍을 수 있어요. 그린 그래프의 두 점을 근거로 설명하는 활동이므로 ㄴ→ㄱ→ㄷ예요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 정한 축과 눈금에 실제 기록의 점을 표시한다.",
    "ㄴ 시각·고도 이름과 단위를 확인하고 축·눈금을 정한다.",
    "ㄷ 완성한 점들의 두 시각을 골라 값의 관계를 설명한다."
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
   "standards": [
    "6과13-01"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "ㄱ 정한 축과 눈금에 실제 기록의 점을 표시한다.",
    "ㄴ 시각·고도 이름과 단위를 확인하고 축·눈금을 정한다.",
    "ㄷ 완성한 점들의 두 시각을 골라 값의 관계를 설명한다."
   ]
  },
  {
   "id": "c22-s62-u01-w024",
   "no": 24,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "하루 연습 자료에서 그림자가 짧은 순서대로 세 시각의 기호를 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "그림자는12:50에11.5cm, 10:50에23.8cm, 09:50에42.9cm예요. 가장 짧은 것부터ㄴ→ㄷ→ㄱ이에요. 고도는 이 순서에서 높은 값부터 낮은 값으로 바뀌어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 09:50",
    "ㄴ 12:50",
    "ㄷ 10:50"
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
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
    "ㄱ 09:50",
    "ㄴ 12:50",
    "ㄷ 10:50"
   ],
   "figure": "season-question-data-24"
  },
  {
   "id": "c22-s62-u01-w025",
   "no": 25,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "하루 연습 기록과 같은 막대 조건에서 맞는 설명을 모두 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "12:50은60°로 표의 최대예요.09:50·15:50은 모두42.9cm이고13:50의14.0cm에서15:50의42.9cm로 길어져요. 같은 막대에서 고도와 그림자 길이는 반대로 변해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "막대가 같아도 고도가 높으면 그림자는 늘 길다.",
    "12:50은 표에서 고도가 가장 높다.",
    "09:50과15:50의 그림자 길이는 같다.",
    "그림자가 가장 짧은 때 고도는 반드시0°이다.",
    "13:50에서15:50으로 갈 때 그림자가 길어진다."
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
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ⑤. 선택 순서는 관계없다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "figure": "season-question-data-25"
  },
  {
   "id": "c22-s62-u01-w026",
   "no": 26,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "하루 그래프를 읽을 때 지켜야 할 것을 고르세요. (정답 2개)",
   "answer": "②, ⑤",
   "explanation": "단위가 다른 그래프는 세로축의 뜻이 달라 교차점만으로 양이 같다고 하지 않아요. 실제로 측정하지 않은 구간과 측정한 점도 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "그래프 선의 교차점이면 서로 다른 두 양의 값이 같다.",
    "측정하지 않은 구간을 직접 측정한 것으로 바꾸지 않는다.",
    "모든 그래프의 최대 시각을 무조건12:00으로 고친다.",
    "점이 적으면 그 사이 값도 실제로 잰 것으로 표시한다.",
    "고도와 기온의 세로축 단위를 구별한다."
   ],
   "key": [
    1,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     4
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐·추가·중복 없이 고른다: ②, ⑤. 선택 순서는 관계없다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요."
  },
  {
   "id": "c22-s62-u01-w027",
   "no": 27,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "연습 자료를 이용해 두 시각 사이 변화량을 단위와 함께 구하세요. (1)10:50→12:50 고도 증가량 (2)같은 구간의 그림자 감소량",
   "answer": "20° / 12.3cm",
   "explanation": "고도는60−40=20° 증가했어요. 그림자는23.8−11.5=12.3cm 감소했어요. 서로 다른 단위의 두 변화량을 같은 양처럼 더하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
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
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "20°"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 12.3,
      "units": [
       "cm",
       "센티미터"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "12.3cm"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "verificationModel": {
    "kind": "daily-differences",
    "from": 1,
    "to": 3,
    "altitudeIncrease": 20,
    "shadowDecrease": 12.3
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 20° (단위 필요) / (2) 12.3cm (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-27"
  },
  {
   "id": "c22-s62-u01-w028",
   "no": 28,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "제시된 다섯 기록에서 (1)가장 큰 고도 (2)그 고도가 기록된 시각을 쓰세요.",
   "answer": "62° / 12:15",
   "explanation": "다섯 값41·53·62·60·49° 중62°가 가장 크며12:15의 기록이에요. 정확한 남중 시각을 별도로 제시하지 않았으므로12:15가 실제 남중이라고 확정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 62,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "62°"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "12:15",
       "12시15분"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "시각(KST)",
     "고도"
    ],
    "행": [
     [
      "10:15",
      "41°"
     ],
     [
      "11:15",
      "53°"
     ],
     [
      "12:15",
      "62°"
     ],
     [
      "13:15",
      "60°"
     ],
     [
      "14:15",
      "49°"
     ]
    ]
   },
   "givens": "비교용 고도 연습 기록이며 실제 관측·정밀 역서가 아니다. 정확한 남중 시각은 주어지지 않았다.",
   "verificationModel": {
    "kind": "sample-maximum",
    "values": [
     41,
     53,
     62,
     60,
     49
    ],
    "times": [
     "10:15",
     "11:15",
     "12:15",
     "13:15",
     "14:15"
    ],
    "index": 2
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 62° (단위 필요) / (2) 12:15 또는 12시15분. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "비교용 고도 연습 기록이며 실제 관측·정밀 역서가 아니다. 정확한 남중 시각은 주어지지 않았다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-28"
  },
  {
   "id": "c22-s62-u01-w029",
   "no": 29,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "같은 막대의10:50과12:50을 근거로 고도·그림자의 관계를 설명하세요.",
   "answer": "10:50에는40°·23.8cm였고12:50에는60°·11.5cm였다. 같은 막대에서 태양 고도가 높아졌을 때 그림자는 짧아졌다.",
   "explanation": "두 시각의 고도 증가와 그림자 감소를 각각 확인해 관계를 설명해요. 막대 높이가 다른 두 기록을 섞으면 같은 관계의 근거가 되지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "두 시각을 특정한다.",
    "각 시각의 고도와 그림자 값을 단위와 함께 연결한다.",
    "같은 막대 조건에서 고도와 길이의 반대 변화를 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "10:50에는40°·23.8cm였고12:50에는60°·11.5cm였다. 같은 막대에서 태양 고도가 높아졌을 때 그림자는 짧아졌다.",
    "required": [
     "두 시각을 특정한다.",
     "각 시각의 고도와 그림자 값을 단위와 함께 연결한다.",
     "같은 막대 조건에서 고도와 길이의 반대 변화를 설명한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "까닭 설명",
   "criteria": "두 시각을 특정한다. / 각 시각의 고도와 그림자 값을 단위와 함께 연결한다. / 같은 막대 조건에서 고도와 길이의 반대 변화를 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "lines": 6,
   "figure": "season-question-data-29"
  },
  {
   "id": "c22-s62-u01-w030",
   "no": 30,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "하루 최고 고도가12:15에 기록됐으니 정확한 남중은12:15라는 주장을 검토하세요.",
   "answer": "측정표에서 가장 큰 값이12:15에 있었던 것과 그 사이 모든 순간의 최댓값 시각은 다르다. 남중을 확정하려면 전후 더 촘촘한 관측이나 같은 날짜·장소의 출처 있는 남중 자료가 필요하다.",
   "explanation": "일부 시각을 비교한 결과를 정확한 남중 순간으로 확대할 수 없어요. 실제 관측 간격과 별도 출처를 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "표의 최대와 연속적인 하루 최대를 구별한다.",
    "측정 간격 사이의 자료가 없다는 한계를 밝힌다.",
    "같은 장소·날짜에서 추가 확인할 구체적 자료나 관측을 제시한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "측정표에서 가장 큰 값이12:15에 있었던 것과 그 사이 모든 순간의 최댓값 시각은 다르다. 남중을 확정하려면 전후 더 촘촘한 관측이나 같은 날짜·장소의 출처 있는 남중 자료가 필요하다.",
    "required": [
     "표의 최대와 연속적인 하루 최대를 구별한다.",
     "측정 간격 사이의 자료가 없다는 한계를 밝힌다.",
     "같은 장소·날짜에서 추가 확인할 구체적 자료나 관측을 제시한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "까닭 설명",
   "criteria": "표의 최대와 연속적인 하루 최대를 구별한다. / 측정 간격 사이의 자료가 없다는 한계를 밝힌다. / 같은 장소·날짜에서 추가 확인할 구체적 자료나 관측을 제시한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w031",
   "no": 31,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T04",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "하루 연습 기록 중09:50·12:50·15:50의 고도 그래프와 그림자 그래프를 따로 그리세요. 시각축·세로축·단위를 쓰세요.",
   "answer": "같은 시각축의 두 그래프에 고도25·60·25°와 그림자42.9·11.5·42.9cm를 각각 표시한다. 세로축의 단위를 다르게 적고 가운데 기록에서 고도는 높고 그림자는 짧음을 설명한다.",
   "explanation": "단위와 눈금을 먼저 정해요. 두 그래프의 높이를 같은 양처럼 비교하거나 고도의 높낮이만으로 그림자 그래프를 복사하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "같은 세 시각을 두 가로축에 맞춘다.",
    "고도와 그림자 세로축·단위를 구별한다.",
    "각 자료의 세 점을 해당 눈금에 바르게 표시한다.",
    "미측정 구간을 직접 잰 값이라고 주장하지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 시각축의 두 그래프에 고도25·60·25°와 그림자42.9·11.5·42.9cm를 각각 표시한다. 세로축의 단위를 다르게 적고 가운데 기록에서 고도는 높고 그림자는 짧음을 설명한다.",
    "required": [
     "같은 세 시각을 두 가로축에 맞춘다.",
     "고도와 그림자 세로축·단위를 구별한다.",
     "각 자료의 세 점을 해당 눈금에 바르게 표시한다.",
     "미측정 구간을 직접 잰 값이라고 주장하지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "같은 세 시각을 두 가로축에 맞춘다. / 고도와 그림자 세로축·단위를 구별한다. / 각 자료의 세 점을 해당 눈금에 바르게 표시한다. / 미측정 구간을 직접 잰 값이라고 주장하지 않는다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "given": [
    "바로 앞의 31번 자료면을 함께 보고 답하세요.",
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "drawing": "large",
   "contextFigure": "season-question-data-31"
  },
  {
   "id": "c22-s62-u01-w032",
   "no": 32,
   "section": 2,
   "sectionTitle": "같은 막대의 그림자가 달라져요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T03",
   "topic": "같은 막대의 그림자가 달라져요",
   "prompt": "낮은 고도와 높은 고도에서 같은 막대의 그림자를 비교하는 설명 그림을 그리세요. 수평면·같은 높이·빛 방향·그림자 끝을 표시하세요.",
   "answer": "같은 높이 수직 막대를 각각 수평면에 그리고 낮은 고도에서는 긴 그림자, 높은 고도에서는 짧은 그림자를 그린다. 두 경우의 각 기준을 수평면에 표시한다.",
   "explanation": "두 경우에 막대 높이나 바닥 기울기까지 바꾸면 고도만의 차이를 나타낼 수 없어요. 그림에 같은 조건을 명확히 표시해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "막대의 높이와 수평 받침 조건을 같게 그린다.",
    "빛 방향과 막대 끝·그림자 끝의 관계를 나타낸다.",
    "고도가 높은 경우 더 짧은 그림자를 표시한다.",
    "각의 기준과 길이의 기준을 구별해 설명한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 높이 수직 막대를 각각 수평면에 그리고 낮은 고도에서는 긴 그림자, 높은 고도에서는 짧은 그림자를 그린다. 두 경우의 각 기준을 수평면에 표시한다.",
    "required": [
     "막대의 높이와 수평 받침 조건을 같게 그린다.",
     "빛 방향과 막대 끝·그림자 끝의 관계를 나타낸다.",
     "고도가 높은 경우 더 짧은 그림자를 표시한다.",
     "각의 기준과 길이의 기준을 구별해 설명한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "막대의 높이와 수평 받침 조건을 같게 그린다. / 빛 방향과 막대 끝·그림자 끝의 관계를 나타낸다. / 고도가 높은 경우 더 짧은 그림자를 표시한다. / 각의 기준과 길이의 기준을 구별해 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 수평면·수직 막대의 높이를 맞춰야 고도와 그림자를 비교해요. 다른 높이의 막대를 그대로 비교하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w033",
   "no": 33,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "같은 날 공기 온도를 비교하기에 가장 알맞은 측정 방법은 무엇인가요?",
   "answer": "④ 통풍 그늘의 같은 위치에서 안정된 표시를 읽는다.",
   "explanation": "기온은 공기 온도예요. 직사광·바닥의 열·손의 열 영향을 줄이는 교사 지정 통풍 그늘에서 같은 도구와 위치를 유지해 안정된 값을 읽어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "햇볕에 달군 검은 바닥의 표면 온도를 읽는다.",
    "손으로 느낀 따뜻함을 온도 수치로 바꿔 쓴다.",
    "온도계를 손으로 감싼 채 최고 표시를 기다린다.",
    "통풍 그늘의 같은 위치에서 안정된 표시를 읽는다.",
    "따뜻한 곳을 매 시각 새로 찾아 온도계를 옮긴다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ④ 통풍 그늘의 같은 위치에서 안정된 표시를 읽는다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요."
  },
  {
   "id": "c22-s62-u01-w034",
   "no": 34,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "하루 연습 자료에서 고도 최고 기록 뒤에도 기온이 오르는 것을 가장 타당하게 설명한 것은 무엇인가요?",
   "answer": "② 지표와 공기가 데워지는 과정에 시간이 걸릴 수 있다.",
   "explanation": "지표가 받은 에너지와 잃은 에너지의 관계, 지표에서 공기로 열이 전달되는 과정 때문에 기온 최고가 늦을 수 있어요. 이 표에서는12:50고도 최고 뒤14:50에 기온 최고가 나타나며 모든 날의 고정 규칙은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "태양이 낮아지면 태양 자체의 온도가 반드시 오른다.",
    "지표와 공기가 데워지는 과정에 시간이 걸릴 수 있다.",
    "고도와 기온은 같은 양이어서 최고 시각도 같다.",
    "태양이 남중한 때부터 새로운 하루가 시작된다.",
    "기온과 햇빛은 어떤 조건에서도 관련이 없다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ② 지표와 공기가 데워지는 과정에 시간이 걸릴 수 있다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "figure": "season-question-data-34"
  },
  {
   "id": "c22-s62-u01-w035",
   "no": 35,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "태양이 직접 비치는 뜨거운 물체의 (1)와 통풍 그늘의 공기 온도인 (2)를 구별해요.",
   "answer": "표면 온도 / 기온",
   "explanation": "물체 표면은 햇빛과 재료의 영향을 받아 공기와 다른 온도를 보일 수 있어요. 기온을 비교할 때는 표면 온도를 대신 적지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "표면 온도",
       "물체 표면 온도"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "기온"
      ]
     }
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 표면 온도 또는 물체 표면 온도 / (2) 기온. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w036",
   "no": 36,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "이 연습표에서 최고 고도 기록은 (1), 최고 기온 기록은 (2)에 있어요.",
   "answer": "12:50 / 14:50",
   "explanation": "고도 열의 최대60°는12:50, 기온 열의 최대27℃는14:50이에요. 서로 다른 두 양의 최대를 따로 읽어야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "12:50",
       "12시50분"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "14:50",
       "14시50분"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 12:50 또는 12시50분 / (2) 14:50 또는 14시50분. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-36"
  },
  {
   "id": "c22-s62-u01-w037",
   "no": 37,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "온도 측정 상황과 확인할 문제를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "직사광·손의 열·표시 안정 전 읽기는 서로 다른 측정 조건이에요. 단순히 온도계가 있다는 사실만으로 같은 공기 온도 측정이라고 하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 직사광 아래 온도계",
    "(2) 손으로 감싼 온도계",
    "(3) 안정되기 전 급히 읽은 온도계"
   ],
   "options": [
    "ㄱ 손의 열 영향을 받을 수 있다.",
    "ㄴ 표시가 아직 변하는 중일 수 있다.",
    "ㄷ 공기 외에 햇빛 가열 영향을 받을 수 있다."
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "ㄱ 손의 열 영향을 받을 수 있다.",
    "ㄴ 표시가 아직 변하는 중일 수 있다.",
    "ㄷ 공기 외에 햇빛 가열 영향을 받을 수 있다."
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w038",
   "no": 38,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T04",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "하루 기록에 대한 말과 자료 종류를 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "읽은 온도는 직접 측정, 찬 공기 원인은 추가 근거가 필요한 추론, 비 때문에 못 읽은 때는 미측정이에요. 추론이나 빈칸을 실제 측정값으로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 온도계가25℃로 안정되어 읽었다.",
    "(2) 찬 공기 이동 때문일 수 있다고 생각했다.",
    "(3) 비 때문에14:00에는 읽지 못했다."
   ],
   "options": [
    "ㄱ 미측정",
    "ㄴ 직접 측정",
    "ㄷ 원인에 대한 추론"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "ㄱ 미측정",
    "ㄴ 직접 측정",
    "ㄷ 원인에 대한 추론"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w039",
   "no": 39,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "기온계 표시가 안정되기 전에는 수치를 기록하지 않기로 했습니다. 올바른 읽기 과정을 이으세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "같은 적절한 위치에 둔 다음 안정 여부를 확인하고 그때의 값을 기록해요. 위치를 옮기자마자 읽거나 안정 전 최고값만 고르지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 표시가 더 이상 크게 변하지 않는지 확인한다.",
    "ㄴ 교사가 정한 통풍 그늘에 기온계를 둔다.",
    "ㄷ 안정된 값과 측정 시각·℃를 기록한다."
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
   "standards": [
    "6과13-01"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "ㄱ 표시가 더 이상 크게 변하지 않는지 확인한다.",
    "ㄴ 교사가 정한 통풍 그늘에 기온계를 둔다.",
    "ㄷ 안정된 값과 측정 시각·℃를 기록한다."
   ]
  },
  {
   "id": "c22-s62-u01-w040",
   "no": 40,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "하루 연습 기록에서 기온이 낮은 시각부터 높은 시각 순으로 기호를 쓰세요.",
   "answer": "ㄱ → ㄷ → ㄴ",
   "explanation": "세 시각의 기온은17℃·27℃·24℃이므로17<24<27의 순서인ㄱ→ㄷ→ㄴ이에요. 고도의 크기 순서와 기온 순서를 혼동하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 09:50",
    "ㄴ 14:50",
    "ㄷ 12:50"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄱ",
     "ㄷ",
     "ㄴ"
    ]
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄱ → ㄷ → ㄴ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
    "ㄱ 09:50",
    "ㄴ 14:50",
    "ㄷ 12:50"
   ],
   "figure": "season-question-data-40"
  },
  {
   "id": "c22-s62-u01-w041",
   "no": 41,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "하루 연습 자료를 근거로 말할 수 있는 것을 모두 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "최고 기록은고도12:50·기온14:50이고13:50의26℃보다14:50의27℃가 높아요. 이 날의 연습 경향을 다른 날의 고정 시각으로 확대하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "고도가 같으면 표의 기온도 언제나 같다.",
    "12:50뒤 고도가 낮아져도 한동안 기온은 오른다.",
    "기온 최고 기록은 고도 최고 기록보다 늦다.",
    "다른 날에도 최고 기온은 반드시14:50이다.",
    "표에서13:50보다14:50의 기온이 높다."
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
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ⑤. 선택 순서는 관계없다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "figure": "season-question-data-41"
  },
  {
   "id": "c22-s62-u01-w042",
   "no": 42,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "예상과 달리 오후에 기온이 내려간 실제 측정을 받았습니다. 타당한 대응을 고르세요. (정답 2개)",
   "answer": "②, ④",
   "explanation": "실제 날씨는 다양한 요인의 영향을 받아요. 기록을 임의로 고치는 대신 도구·위치·날씨 조건을 확인하고 관측과 해석을 나누어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "관측하지 않은 다음 시각 값도 실제값으로 채운다.",
    "기록 시각과 온도계 위치가 같은지 확인한다.",
    "자료가 전형적이지 않으므로 원하는 값으로 고친다.",
    "구름·바람 등 그때 조건을 함께 확인한다.",
    "남중 뒤에는 온도가 반드시 올라야 한다고 단정한다."
   ],
   "key": [
    1,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     3
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐·추가·중복 없이 고른다: ②, ④. 선택 순서는 관계없다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요."
  },
  {
   "id": "c22-s62-u01-w043",
   "no": 43,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "하루 연습표에서 (1)09:50→12:50 기온 증가량 (2)12:50→14:50 기온 증가량을 쓰세요.",
   "answer": "7℃ / 3℃",
   "explanation": "처음 구간은24−17=7℃, 다음은27−24=3℃ 증가예요. 두 번째 구간에서 고도는 낮아져도 기온이3℃ 올랐다는 점을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 7,
      "units": [
       "℃",
       "°C",
       "도씨"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "7℃"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 3,
      "units": [
       "℃",
       "°C",
       "도씨"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "3℃"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "verificationModel": {
    "kind": "temperature-differences",
    "indices": [
     [
      0,
      3
     ],
     [
      3,
      5
     ]
    ],
    "answers": [
     7,
     3
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 7℃ (단위 필요) / (2) 3℃ (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-43"
  },
  {
   "id": "c22-s62-u01-w044",
   "no": 44,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "시각을 단위와 함께 바꾸어 생각해 보세요. (1)고도 최고 기록에서 기온 최고 기록까지 경과한 분 수 (2)그 사이 기온 변화량",
   "answer": "120분 / 3℃",
   "explanation": "12:50에서14:50까지는2시간=120분이고 기온은24℃에서27℃로3℃ 증가했어요. 이120분은 이 연습표의 시간차이며 모든 날의 법칙은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 120,
      "units": [
       "분"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "120분"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 3,
      "units": [
       "℃",
       "°C",
       "도씨"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "3℃"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "verificationModel": {
    "kind": "temperature-lag",
    "altitudeMaxIndex": 3,
    "temperatureMaxIndex": 5,
    "minutes": 120,
    "increase": 3
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 120분 (단위 필요) / (2) 3℃ (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-44"
  },
  {
   "id": "c22-s62-u01-w045",
   "no": 45,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "최고 기온은 언제나 남중보다 정확히 두 시간 뒤라는 말이 이 자료로 증명되나요?",
   "answer": "이 연습표에서는12:50고도 최고에서14:50기온 최고까지 두 시간이지만 다른 날의 기온은 구름·바람·지표 조건 등에 따라 다를 수 있다. 한 표의 경향을 언제나라는 법칙으로 바꿀 수 없다.",
   "explanation": "자료의 시간차120분은 계산할 수 있지만 모든 날에 같은 시차가 있다고 추론할 근거는 없어요. 측정한 범위 안에서 설명해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "이 자료의 두 최고 시각을 확인한다.",
    "한 날의 연습 기록과 일반 법칙을 구별한다.",
    "다른 시차를 만들 수 있는 구체적인 조건을 하나 든다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "이 연습표에서는12:50고도 최고에서14:50기온 최고까지 두 시간이지만 다른 날의 기온은 구름·바람·지표 조건 등에 따라 다를 수 있다. 한 표의 경향을 언제나라는 법칙으로 바꿀 수 없다.",
    "required": [
     "이 자료의 두 최고 시각을 확인한다.",
     "한 날의 연습 기록과 일반 법칙을 구별한다.",
     "다른 시차를 만들 수 있는 구체적인 조건을 하나 든다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "까닭 설명",
   "criteria": "이 자료의 두 최고 시각을 확인한다. / 한 날의 연습 기록과 일반 법칙을 구별한다. / 다른 시차를 만들 수 있는 구체적인 조건을 하나 든다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "lines": 6,
   "figure": "season-question-data-45"
  },
  {
   "id": "c22-s62-u01-w046",
   "no": 46,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "한 모둠은 통풍 그늘에서, 다른 모둠은 햇볕에 달군 금속판 위에서 온도를 재었습니다. 두 값만으로 어느 곳의 공기가 더 뜨겁다고 할 수 있을까요?",
   "answer": "같은 공기 온도를 비교한 조건이 아니다. 금속판 위 도구는 표면과 햇빛 가열 영향을 받을 수 있으므로 두 온도계의 같은 통풍 그늘·안정 시간·단위를 확인해 다시 비교해야 한다.",
   "explanation": "온도계 숫자 차이는 비교 대상과 측정 조건이 같을 때 해석할 수 있어요. 금속판·직사광의 영향을 그대로 공기 온도 차이라고 할 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "공기와 물체 표면의 온도를 구별한다.",
    "다르게 된 측정 조건과 영향을 구체적으로 밝힌다.",
    "기온 비교를 위한 같은 위치/도구 조건을 제시한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "같은 공기 온도를 비교한 조건이 아니다. 금속판 위 도구는 표면과 햇빛 가열 영향을 받을 수 있으므로 두 온도계의 같은 통풍 그늘·안정 시간·단위를 확인해 다시 비교해야 한다.",
    "required": [
     "공기와 물체 표면의 온도를 구별한다.",
     "다르게 된 측정 조건과 영향을 구체적으로 밝힌다.",
     "기온 비교를 위한 같은 위치/도구 조건을 제시한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "까닭 설명",
   "criteria": "공기와 물체 표면의 온도를 구별한다. / 다르게 된 측정 조건과 영향을 구체적으로 밝힌다. / 기온 비교를 위한 같은 위치/도구 조건을 제시한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w047",
   "no": 47,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T04",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "하루 연습 자료의 고도와 기온을 같은 시각축의 두 그래프로 그리세요. 각 최대 기록의 시각을 동그라미로 표시하고 차이를 설명하세요.",
   "answer": "고도25·40·55·60·55·40·25°와 기온17·19·22·24·26·27·25℃를 각기 다른 세로축으로 표시한다.12:50고도 최대와14:50기온 최대를 표시하고 시간차를 설명한다.",
   "explanation": "서로 다른 단위의 선을 한 눈금으로 합치거나 교차점의 값을 같은 양이라고 읽지 않아요. 실제 측정이 아닌 연습 그래프임도 밝혀요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "시각축을 두 그래프에 일치시킨다.",
    "고도°와 기온℃ 세로축과 눈금을 나눈다.",
    "최대 기록을 각기 올바른 시각에 표시한다.",
    "기온 최고가 늦다는 자료 안의 경향을 설명한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "고도25·40·55·60·55·40·25°와 기온17·19·22·24·26·27·25℃를 각기 다른 세로축으로 표시한다.12:50고도 최대와14:50기온 최대를 표시하고 시간차를 설명한다.",
    "required": [
     "시각축을 두 그래프에 일치시킨다.",
     "고도°와 기온℃ 세로축과 눈금을 나눈다.",
     "최대 기록을 각기 올바른 시각에 표시한다.",
     "기온 최고가 늦다는 자료 안의 경향을 설명한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "table": {
    "머리": [
     "시각",
     "태양 고도(°)",
     "그림자(cm)",
     "기온(℃)"
    ],
    "행": [
     [
      "09:50",
      25,
      42.9,
      17
     ],
     [
      "10:50",
      40,
      23.8,
      19
     ],
     [
      "11:50",
      55,
      14,
      22
     ],
     [
      "12:50",
      60,
      11.5,
      24
     ],
     [
      "13:50",
      55,
      14,
      26
     ],
     [
      "14:50",
      40,
      23.8,
      27
     ],
     [
      "15:50",
      25,
      42.9,
      25
     ]
    ]
   },
   "givens": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다.",
   "modelRef": "daily",
   "standards": [
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "시각축을 두 그래프에 일치시킨다. / 고도°와 기온℃ 세로축과 눈금을 나눈다. / 최대 기록을 각기 올바른 시각에 표시한다. / 기온 최고가 늦다는 자료 안의 경향을 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "given": [
    "바로 앞의 47번 자료면을 함께 보고 답하세요.",
    "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
   ],
   "drawing": "large",
   "contextFigure": "season-question-data-47"
  },
  {
   "id": "c22-s62-u01-w048",
   "no": 48,
   "section": 3,
   "sectionTitle": "태양이 높을 때 가장 더울까요?",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T05",
   "topic": "태양이 높을 때 가장 더울까요?",
   "prompt": "햇빛·바닥·손의 열 영향을 줄이며 기온을 재는 자리를 설계해 그리세요. 통풍과 측정 위치에 이름표를 붙이세요.",
   "answer": "교사가 정한 통풍 그늘에 기온계를 고정하고 직접 햇빛·뜨거운 바닥·손의 접촉을 피하는 배치를 나타낸다. 표시 안정 뒤 시각·℃를 기록한다고 적는다.",
   "explanation": "여러 배치가 가능하지만 교사와 실제 장소의 안전·통풍을 확인해야 해요. 기온계 자체를 덮어 바람을 완전히 막는 그림은 고쳐요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "통풍 그늘과 직접 햇빛을 구별한다.",
    "물체 표면·손의 열 영향을 줄이는 위치를 표시한다.",
    "같은 위치와 표시 안정 확인을 설명한다.",
    "설계만 했다면 실제 측정 완료라고 표시하지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "교사가 정한 통풍 그늘에 기온계를 고정하고 직접 햇빛·뜨거운 바닥·손의 접촉을 피하는 배치를 나타낸다. 표시 안정 뒤 시각·℃를 기록한다고 적는다.",
    "required": [
     "통풍 그늘과 직접 햇빛을 구별한다.",
     "물체 표면·손의 열 영향을 줄이는 위치를 표시한다.",
     "같은 위치와 표시 안정 확인을 설명한다.",
     "설계만 했다면 실제 측정 완료라고 표시하지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "통풍 그늘과 직접 햇빛을 구별한다. / 물체 표면·손의 열 영향을 줄이는 위치를 표시한다. / 같은 위치와 표시 안정 확인을 설명한다. / 설계만 했다면 실제 측정 완료라고 표시하지 않는다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "고도 최고와 기온 최고가 같은 시각이라는 법칙은 없어요. 기온은 별도 공기 온도 자료로 읽어요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w049",
   "no": 49,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "네 날짜의 낮길이를 비교할 때 먼저 맞추어야 할 자료 조건을 고르세요.",
   "answer": "⑤ 같은 위치·시간대의 일출과 일몰을 쓴다.",
   "explanation": "일출과 일몰은 같은 날짜·위치·시간대의 짝이어야 시간 차이가 그 장소의 낮길이를 나타내요. 다른 도시나 시간대를 섞으면 비교 조건이 달라져요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "모든 날짜를12:00남중으로 바꾸어 쓴다.",
    "일출은 서울·일몰은 다른 도시에서 골라 쓴다.",
    "낮길이의 분을 버리고 시간 숫자만 읽는다.",
    "학생이 재지 않아도 실제 관측으로 표시한다.",
    "같은 위치·시간대의 일출과 일몰을 쓴다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ⑤ 같은 위치·시간대의 일출과 일몰을 쓴다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "figure": "season-question-data-49"
  },
  {
   "id": "c22-s62-u01-w050",
   "no": 50,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "서울의2026-06-21 일몰19:56에서 일출05:11을 빼면 얼마인가요?",
   "answer": "① 14시간45분",
   "explanation": "같은 날19시56분−5시11분=14시간45분이에요. 시끼리·분끼리 차를 구하고 같은 날짜의 자료인지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "14시간45분",
    "14시간11분",
    "15시간45분",
    "24시간45분",
    "5시간11분"
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "verificationModel": {
    "kind": "clock-difference",
    "row": 1,
    "answerMinutes": 885
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ① 14시간45분를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "figure": "season-question-data-50"
  },
  {
   "id": "c22-s62-u01-w051",
   "no": 51,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "2026-09-23의 표시 시각18:28−06:20으로 구한 근삿낮길이는 (1)시간 (2)분이에요.",
   "answer": "12 / 8",
   "explanation": "18시28분−6시20분=12시간8분이에요. 이 계산은 표시된 분 단위 시각의 차이며 KASI별도 낮길이 표시도12시간8분이에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "12",
       "열두"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "8",
       "08",
       "여덟"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "verificationModel": {
    "kind": "clock-parts",
    "row": 2,
    "hours": 12,
    "minutes": 8
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 12 또는 열두 / (2) 8 또는 08 또는 여덟. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-51"
  },
  {
   "id": "c22-s62-u01-w052",
   "no": 52,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "낮의 길이는 같은 날 (1)에서 (2)을 뺀 시간으로 구해요. 두 칸에는 일출 시각·일몰 시각을 한 번씩 써요.",
   "answer": "일몰 시각 / 일출 시각",
   "explanation": "낮의 길이는 일출에서 일몰까지의 경과 시간이에요. 늦은 시각인 일몰에서 이른 시각인 일출을 빼고 시분을 계산해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "일몰 시각",
       "일몰시각"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "일출 시각",
       "일출시각"
      ]
     }
    ]
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 일몰 시각 또는 일몰시각 / (2) 일출 시각 또는 일출시각. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w053",
   "no": 53,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "각 날짜를 표시된 일몰−일출로 구한 근삿낮길이와 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "봄은18:43−06:36=12:07, 여름은19:56−05:11=14:45, 겨울은17:17−07:43=9:34예요. 봄·겨울의 사이트 별도 낮길이와1분 차이가 있어 여기서는 표시 시각의 차를 답해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 2026-03-20",
    "(2) 2026-06-21",
    "(3) 2026-12-22"
   ],
   "options": [
    "ㄱ 14시간45분",
    "ㄴ 9시간34분",
    "ㄷ 12시간7분"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
    "ㄱ 14시간45분",
    "ㄴ 9시간34분",
    "ㄷ 12시간7분"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-53"
  },
  {
   "id": "c22-s62-u01-w054",
   "no": 54,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T12",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "다음 기록의 출처·성격을 맞게 연결하세요.",
   "answer": "ㄴ / ㄱ / ㄷ",
   "explanation": "공식 출처가 있어도 계산 자료는 학생 실측이 아니에요. 직접 측정·공식 계산·창작 연습의 성격을 각기 밝혀야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄷ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 직접 만든 측정기로 운동장에서 읽은 고도",
    "(2) 한국천문연구원에 날짜·좌표를 넣어 얻은 시각",
    "(3) 시분 뺄셈을 연습하려고 만든 시간표"
   ],
   "options": [
    "ㄱ 공식 계산 자료",
    "ㄴ 학생 직접 측정",
    "ㄷ 독립 연습 자료"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄱ / (3) ㄷ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "ㄱ 공식 계산 자료",
    "ㄴ 학생 직접 측정",
    "ㄷ 독립 연습 자료"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w055",
   "no": 55,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "주어진 일출06:48·일몰18:23의 시분 뺄셈을 완성하는 순서로 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "분23에서48을 바로 뺄 수 없으므로1시간을60분으로 바꾸어17시간83분을 만들어요. 그다음11시간35분을 구하고 두 시각의 간격과 맞는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 17시간83분에서6시간48분을 뺀다.",
    "ㄴ 18시간23분의1시간을분으로 빌려17시간83분으로 바꾼다.",
    "ㄷ 구한 차11시간35분을 원래 두시각과 대조한다."
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
   "givens": "같은 날짜·장소·시간대의 가상 시각 연습 자료이다.",
   "verificationModel": {
    "kind": "clock-difference-practice",
    "sunrise": "06:48",
    "sunset": "18:23",
    "answerMinutes": 695
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "같은 날짜·장소·시간대의 가상 시각 연습 자료이다.",
    "ㄱ 17시간83분에서6시간48분을 뺀다.",
    "ㄴ 18시간23분의1시간을분으로 빌려17시간83분으로 바꾼다.",
    "ㄷ 구한 차11시간35분을 원래 두시각과 대조한다."
   ]
  },
  {
   "id": "c22-s62-u01-w056",
   "no": 56,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "서울의 표시 시각 차로 구한 근삿낮길이가 짧은 날짜부터 기호를 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "겨울9시간34분<가을12시간8분<여름14시간45분이므로ㄴ→ㄷ→ㄱ이에요. 시각 한쪽만 보는 대신 일출과 일몰의 차를 비교해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 2026-06-21",
    "ㄴ 2026-12-22",
    "ㄷ 2026-09-23"
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
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
    "ㄱ 2026-06-21",
    "ㄴ 2026-12-22",
    "ㄷ 2026-09-23"
   ],
   "figure": "season-question-data-56"
  },
  {
   "id": "c22-s62-u01-w057",
   "no": 57,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T12",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "계산 자료를 수업에서 사용할 때 타당한 행동을 고르세요. (정답 2개)",
   "answer": "②, ⑤",
   "explanation": "계산 자료는 입력 조건과 출처가 있어야 비교할 수 있어요. 접속 불가 시 같은 조건의 사전 자료를 쓰되 실제 관측과 기온을 대신한 것으로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "계산값이므로 학생이 관측했다고 적는다.",
    "접속이 안 되면 설정을 밝힌 사전 자료로 비교한다.",
    "일출 시각이 이르면 기온이 반드시 높다고 한다.",
    "표의 남중 시각을 모두 같은 시각으로 고친다.",
    "날짜·좌표·시간대·출처를 함께 적는다."
   ],
   "key": [
    1,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     4
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐·추가·중복 없이 고른다: ②, ⑤. 선택 순서는 관계없다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "figure": "season-question-data-57"
  },
  {
   "id": "c22-s62-u01-w058",
   "no": 58,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "봄·겨울 자료의 표시 시각 차와 사이트 낮길이가1분 다를 때 올바른 처리를 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "출처의 별도 낮길이와 분 단위 끝점의 뺄셈은 구별해 보존해요. 어느 쪽도 학생 실측이 아니며 구체적 계산 기준을 남기는 것이 자료의 한계를 설명하는 방법이에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "두 값 중 큰 값만 실제 측정이라고 적는다.",
    "어떤 값을 계산했는지 기준을 함께 남긴다.",
    "사이트 표시값과 내 뺄셈 값을 나누어 적는다.",
    "내 값과 다르므로 출처의 값을 임의로 고친다.",
    "분 단위 표시의 근삿계산임을 밝힌다."
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
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ⑤. 선택 순서는 관계없다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "figure": "season-question-data-58"
  },
  {
   "id": "c22-s62-u01-w059",
   "no": 59,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "표시 시각으로 구한 근삿낮길이를 분 단위로 쓰세요. (1)2026-03-20 (2)2026-12-22",
   "answer": "727분 / 574분",
   "explanation": "봄의12시간7분은12×60+7=727분, 겨울의9시간34분은9×60+34=574분이에요. 사이트가 별도로 표시한726·573분과 섞지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 727,
      "units": [
       "분"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "727분"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 574,
      "units": [
       "분"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "574분"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "verificationModel": {
    "kind": "shown-day-minutes",
    "rows": [
     0,
     3
    ],
    "answers": [
     727,
     574
    ]
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 727분 (단위 필요) / (2) 574분 (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-59"
  },
  {
   "id": "c22-s62-u01-w060",
   "no": 60,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "표시 시각으로 구한 낮길이를 비교하세요. (1)여름−겨울 차이를 분으로 (2)가을−봄 차이를 분으로 쓰세요.",
   "answer": "311분 / 1분",
   "explanation": "여름885분−겨울574분=311분, 가을728분−봄727분=1분이에요. 같은 표시 시각 차 기준의 값끼리 빼야 하고 계절 이름만 보고 봄·가을을 정확히 같게 만들지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 311,
      "units": [
       "분"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "311분"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 1,
      "units": [
       "분"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "1분"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "verificationModel": {
    "kind": "shown-day-differences",
    "pairs": [
     [
      1,
      3
     ],
     [
      2,
      0
     ]
    ],
    "answers": [
     311,
     1
    ]
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 311분 (단위 필요) / (2) 1분 (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-60"
  },
  {
   "id": "c22-s62-u01-w061",
   "no": 61,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T12",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "춘분과 추분의 낮은 정확히12시간이어야 하므로 계산표를 고치자는 말에 답하세요.",
   "answer": "대략12시간이라는 계절 설명과 실제 일출·일몰의 계산 기준은 다르다. 이 자료의 봄·가을 표시 시각 차는12시간7분·12시간8분이므로 원자료를12시간으로 강제하지 않고 기준과 출처를 밝혀 비교한다.",
   "explanation": "실제 일출·일몰 기준에는 태양 원반과 대기 영향 등이 관련되어 단순 기하 모형과 다를 수 있어요. 이 자료를 이상화한12시간 답으로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "대략적인 계절 설명과 실제 계산 기준을 구별한다.",
    "제시된 봄·가을 값 중 구체적인 근거를 든다.",
    "원자료를 고치지 않고 출처·정밀도를 보존한다고 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "대략12시간이라는 계절 설명과 실제 일출·일몰의 계산 기준은 다르다. 이 자료의 봄·가을 표시 시각 차는12시간7분·12시간8분이므로 원자료를12시간으로 강제하지 않고 기준과 출처를 밝혀 비교한다.",
    "required": [
     "대략적인 계절 설명과 실제 계산 기준을 구별한다.",
     "제시된 봄·가을 값 중 구체적인 근거를 든다.",
     "원자료를 고치지 않고 출처·정밀도를 보존한다고 설명한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "까닭 설명",
   "criteria": "대략적인 계절 설명과 실제 계산 기준을 구별한다. / 제시된 봄·가을 값 중 구체적인 근거를 든다. / 원자료를 고치지 않고 출처·정밀도를 보존한다고 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "lines": 6,
   "figure": "season-question-data-61"
  },
  {
   "id": "c22-s62-u01-w062",
   "no": 62,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "여름에는 해가 일찍 뜨므로 일몰은 확인하지 않아도 낮길이를 알 수 있다는 말을 검토하세요.",
   "answer": "일찍 뜬다는 한 시각만으로 일출부터 일몰까지의 길이는 구할 수 없다. 같은 날짜·장소의 일몰도 알아야 두 시각의 차를 구해 비교할 수 있다.",
   "explanation": "시작 시각이 이르다는 말은 끝 시각을 알려 주지 않아요. 낮길이는 두 시각의 짝으로 구해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "일출 시각 하나와 경과 시간을 구별한다.",
    "같은 조건의 일몰 시각이 필요하다고 밝힌다.",
    "두 끝점의 차를 구해야 한다는 과정을 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "일찍 뜬다는 한 시각만으로 일출부터 일몰까지의 길이는 구할 수 없다. 같은 날짜·장소의 일몰도 알아야 두 시각의 차를 구해 비교할 수 있다.",
    "required": [
     "일출 시각 하나와 경과 시간을 구별한다.",
     "같은 조건의 일몰 시각이 필요하다고 밝힌다.",
     "두 끝점의 차를 구해야 한다는 과정을 설명한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "까닭 설명",
   "criteria": "일출 시각 하나와 경과 시간을 구별한다. / 같은 조건의 일몰 시각이 필요하다고 밝힌다. / 두 끝점의 차를 구해야 한다는 과정을 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w063",
   "no": 63,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T07",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "서울 여름·겨울의 일출부터 일몰까지를 같은 시간 눈금의 두 띠로 나타내세요. 양 끝 시각과 근삿낮길이를 적으세요.",
   "answer": "같은00~24시 눈금에서 여름05:11~19:56·14시간45분, 겨울07:43~17:17·9시간34분을 표시한다. 길이가 다른 것을 같은 눈금으로 비교한다.",
   "explanation": "폭이 다른 눈금을 쓰면 낮길이의 시각적 비교가 왜곡돼요. 같은 눈금에서 시작·끝과 시간 차를 모두 나타내요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "두 띠의 시각축과 눈금을 같게 한다.",
    "각 날짜의 일출·일몰 끝점을 구별한다.",
    "표시 시각 차 기준의 낮길이를 바르게 쓴다.",
    "실제 학생 관측이 아닌 계산 자료임을 밝힌다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은00~24시 눈금에서 여름05:11~19:56·14시간45분, 겨울07:43~17:17·9시간34분을 표시한다. 길이가 다른 것을 같은 눈금으로 비교한다.",
    "required": [
     "두 띠의 시각축과 눈금을 같게 한다.",
     "각 날짜의 일출·일몰 끝점을 구별한다.",
     "표시 시각 차 기준의 낮길이를 바르게 쓴다.",
     "실제 학생 관측이 아닌 계산 자료임을 밝힌다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "그림·설계",
   "criteria": "두 띠의 시각축과 눈금을 같게 한다. / 각 날짜의 일출·일몰 끝점을 구별한다. / 표시 시각 차 기준의 낮길이를 바르게 쓴다. / 실제 학생 관측이 아닌 계산 자료임을 밝힌다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "given": [
    "바로 앞의 63번 자료면을 함께 보고 답하세요.",
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "drawing": "large",
   "contextFigure": "season-question-data-63"
  },
  {
   "id": "c22-s62-u01-w064",
   "no": 64,
   "section": 4,
   "sectionTitle": "일출과 일몰 사이 시간을 구해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "일출과 일몰 사이 시간을 구해요",
   "prompt": "네 날짜 디지털 자료를 수집할 빈 기록표를 설계하세요. 다음 사람이 같은 설정으로 확인할 수 있게 열 이름과 기록할 예를 붙이세요.",
   "answer": "장소·좌표·시간대·날짜·일출·일몰·남중 표시·고도·출처·확인일·계산값/실측 여부를 기록할 칸을 만들고 한 행에 입력 조건의 예를 쓴다.",
   "explanation": "다른 사람이 같은 계산을 확인하려면 숫자만 적은 표로는 부족해요. 비교 조건과 출처를 함께 재현할 수 있는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "장소·날짜·시간대의 비교 조건을 담는다.",
    "시각·고도·낮길이의 양과 단위를 구별한다.",
    "출처와 확인일·자료 종류를 확인할 수 있게 한다.",
    "관측하지 않은 자료를 내 실측으로 표시하지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "장소·좌표·시간대·날짜·일출·일몰·남중 표시·고도·출처·확인일·계산값/실측 여부를 기록할 칸을 만들고 한 행에 입력 조건의 예를 쓴다.",
    "required": [
     "장소·날짜·시간대의 비교 조건을 담는다.",
     "시각·고도·낮길이의 양과 단위를 구별한다.",
     "출처와 확인일·자료 종류를 확인할 수 있게 한다.",
     "관측하지 않은 자료를 내 실측으로 표시하지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-02"
   ],
   "formLabel": "그림·설계",
   "criteria": "장소·날짜·시간대의 비교 조건을 담는다. / 시각·고도·낮길이의 양과 단위를 구별한다. / 출처와 확인일·자료 종류를 확인할 수 있게 한다. / 관측하지 않은 자료를 내 실측으로 표시하지 않는다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "시각은 60분 단위로 계산해요. 사이트 낮길이와 분 단위 일출·일몰의 뺄셈을 같은 값으로 고치지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w065",
   "no": 65,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T06",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "서울 네 날짜에서 남중 무렵 고도가 높은 순서로 바르게 나열한 것은 무엇인가요?",
   "answer": "③ 여름→가을→봄→겨울",
   "explanation": "고도75.9°>52.4°>52.3°>29.0°를 크기순으로 읽으면 여름→가을→봄→겨울이에요. 봄·가을이 비슷하다는 설명과 표의 실제 표시값이 정확히 같다는 말은 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "여름→봄→가을→겨울",
    "겨울→봄→가을→여름",
    "여름→가을→봄→겨울",
    "봄→가을→여름→겨울",
    "가을→여름→겨울→봄"
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ③ 여름→가을→봄→겨울를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "figure": "season-question-data-65"
  },
  {
   "id": "c22-s62-u01-w066",
   "no": 66,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T12",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "봄52.3°와 가을52.4°를 읽고 추가 자료 없이 결론낼 수 없는 것은 무엇인가요?",
   "answer": "④ 두 날짜의 실제 기온이 서로 같았다.",
   "explanation": "고도 표에는 그날 실제 기온이 없어요. 비슷한 고도만으로 바다·땅의 열 저장·날씨 등의 영향을 받는 기온까지 같다고 할 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "이 표에서 두 고도는 비슷하게 표시됐다.",
    "표시된 가을 고도가 봄보다0.1°높다.",
    "두 값은 같은 서울 지점의 계산 자료다.",
    "두 날짜의 실제 기온이 서로 같았다.",
    "두 값의 차는1°보다 작은 각도 차이다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ④ 두 날짜의 실제 기온이 서로 같았다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "figure": "season-question-data-66"
  },
  {
   "id": "c22-s62-u01-w067",
   "no": 67,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T07",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "서울 비교 자료에서 여름은 겨울보다 남중 무렵 고도가 (1), 표시 시각으로 계산한 낮의 길이는 더 (2).",
   "answer": "높다 / 길다",
   "explanation": "여름75.9°는 겨울29.0°보다 높고 여름14시간45분은 겨울9시간34분보다 길어요. 같은 장소의 두 자료를 함께 연결해 설명해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "높다",
       "높아요",
       "높음"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "길다",
       "길어요",
       "김"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 높다 또는 높아요 또는 높음 / (2) 길다 또는 길어요 또는 김. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-67"
  },
  {
   "id": "c22-s62-u01-w068",
   "no": 68,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T06",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "같은 도시의 계절별 고도를 비교할 때는 지역을 (1) 두고 (2)를 달리한 자료를 모아요. 두 칸은 같게/날짜 중 알맞게 쓰세요.",
   "answer": "같게 / 날짜",
   "explanation": "지역은 같게 두고 날짜를 달리해야 계절에 따른 차이를 살필 수 있어요. 서로 다른 도시의 수치를 계절 차이만으로 설명하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "같게"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "날짜"
      ]
     }
    ]
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 같게 / (2) 날짜. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w069",
   "no": 69,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T06",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "같은 우리나라 지점의 정성 비교 모형에서 위치를 계절과 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "우리나라 같은 지점에서 높은 남중 고도·긴 낮은 여름, 낮은 고도·짧은 낮은 겨울 비교에 해당해요. 중간값만으로 봄과 가을 중 하나를 특정할 수 없어 함께 연결해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 위치P:가장 높은 고도·가장 긴 낮",
    "(2) 위치Q:가장 낮은 고도·가장 짧은 낮",
    "(3) 위치R:두 경우 사이의 고도·낮길이"
   ],
   "options": [
    "ㄱ 겨울 비교",
    "ㄴ 봄·가을 비교",
    "ㄷ 여름 비교"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "table": {
    "머리": [
     "위치",
     "남중 고도",
     "낮길이의 비교"
    ],
    "행": [
     [
      "P",
      "높음",
      "김"
     ],
     [
      "Q",
      "낮음",
      "짧음"
     ],
     [
      "R",
      "중간",
      "중간"
     ]
    ]
   },
   "givens": "계절 관계만 단순화한 정성 모형이며 실제 기온 관측은 아니다.",
   "standards": [
    "6과13-02"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "계절 관계만 단순화한 정성 모형이며 실제 기온 관측은 아니다.",
    "ㄱ 겨울 비교",
    "ㄴ 봄·가을 비교",
    "ㄷ 여름 비교"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-69"
  },
  {
   "id": "c22-s62-u01-w070",
   "no": 70,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T12",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "계절 비교의 조건과 목적을 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "위치를 맞추면 지역 차이를 줄이고 날짜별 남중 조건을 맞추면 하루 시각 차이를 줄여요. 기온을 읽지 않은 표에서는 그날 기온을 확정할 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 같은 위치의 자료 모으기",
    "(2) 각 날짜의 남중 무렵 고도 사용",
    "(3) 기온 자료가 없는 표의 한계 밝히기"
   ],
   "options": [
    "ㄱ 날씨·기온에 관한 근거 없는 확정을 막는다.",
    "ㄴ 지역 차이가 섞이지 않게 한다.",
    "ㄷ 서로 다른 자전 시각의 고도를 계절 차이로 오해하지 않게 한다."
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "ㄱ 날씨·기온에 관한 근거 없는 확정을 막는다.",
    "ㄴ 지역 차이가 섞이지 않게 한다.",
    "ㄷ 서로 다른 자전 시각의 고도를 계절 차이로 오해하지 않게 한다."
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w071",
   "no": 71,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T06",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "고도가 낮은 것부터 높은 것까지 서울의 세 날짜 기호를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "겨울29.0°<가을52.4°<여름75.9°이므로ㄴ→ㄱ→ㄷ이에요. 낮은 고도부터라는 지시와 날짜순 정렬을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 2026-09-23",
    "ㄴ 2026-12-22",
    "ㄷ 2026-06-21"
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
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
    "ㄱ 2026-09-23",
    "ㄴ 2026-12-22",
    "ㄷ 2026-06-21"
   ],
   "figure": "season-question-data-71"
  },
  {
   "id": "c22-s62-u01-w072",
   "no": 72,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T07",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "겨울과 여름의 비교 설명을 자료에서 읽은 관계→빛의 각·시간에 대한 풀이→에너지에 대한 결론 순서로 정리하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "고도·낮길이 자료의 변화가 먼저 있고, 그것이 입사각과 받는 시간의 차이로 이어져 하루의 에너지 차이를 설명해요. 실제 어느 날의 기온을 확정한 것은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 지표가 하루 동안 받는 태양 에너지가 많아지는 경향이 생긴다.",
    "ㄴ 남중 고도가 높아지고 낮이 길어진다.",
    "ㄷ 빛이 더 높은 각으로 들어오고 햇빛을 받는 시간이 길어진다."
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
   "standards": [
    "6과13-02"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "ㄱ 지표가 하루 동안 받는 태양 에너지가 많아지는 경향이 생긴다.",
    "ㄴ 남중 고도가 높아지고 낮이 길어진다.",
    "ㄷ 빛이 더 높은 각으로 들어오고 햇빛을 받는 시간이 길어진다."
   ]
  },
  {
   "id": "c22-s62-u01-w073",
   "no": 73,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T07",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "서울 네 날짜 자료로 뒷받침할 수 있는 말을 모두 고르세요. (정답 2개)",
   "answer": "①, ④",
   "explanation": "여름·겨울은 고도와 낮길이에서 함께 차이가 나고 봄52.3°·가을52.4°는 서로 가까워요. 고도°를 기온℃로 바꾸거나 남중 시각·낮길이를 고정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "여름은 겨울보다 고도가 높고 낮도 길다.",
    "춘추분 실제 낮길이는 표와 관계없이 정확히12시간이다.",
    "네 날짜의 남중 표시는 모두12:00이다.",
    "봄과 가을의 고도는 여름·겨울 차이보다 서로 가깝다.",
    "겨울 날짜의 실제 기온은 표에서29.0℃로 읽힌다."
   ],
   "key": [
    0,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     3
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐·추가·중복 없이 고른다: ①, ④. 선택 순서는 관계없다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "figure": "season-question-data-73"
  },
  {
   "id": "c22-s62-u01-w074",
   "no": 74,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T12",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "정확한 계절 비교를 위해 더 확인해야 하는 경우를 고르세요. (정답 3개)",
   "answer": "①, ③, ④",
   "explanation": "다른 장소, 다른 하루 시각, 기온 근거 없는 확정은 각각 확인이 필요해요. 같은 위치·시간대·출처를 갖춘 기록 자체가 오류인 것은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "고도 자료를 오전9시와 남중 시각에서 각각 골랐다.",
    "출처와 좌표·날짜를 모두 기록했다.",
    "고도가 비슷하므로 기온도 같다고 결론냈다.",
    "여름은 서울·겨울은 제주의 고도를 섞었다.",
    "같은 지점의 네 날짜를 KST로 정리했다."
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
   "standards": [
    "6과13-02"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ④. 선택 순서는 관계없다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요."
  },
  {
   "id": "c22-s62-u01-w075",
   "no": 75,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T06",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "같은 서울 자료의 남중 무렵 고도 차를 단위와 함께 구하세요. (1)여름−겨울 (2)가을−봄",
   "answer": "46.9° / 0.1°",
   "explanation": "75.9−29.0=46.9°, 52.4−52.3=0.1°예요. 표시값 소수 첫째 자리끼리의 차이며 그보다 더 정밀한 실제 남중 차이를 측정한 것은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 46.9,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "46.9°"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 0.1,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "0.1°"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "verificationModel": {
    "kind": "altitude-differences",
    "pairs": [
     [
      1,
      3
     ],
     [
      2,
      0
     ]
    ],
    "answers": [
     46.9,
     0.1
    ]
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 46.9° (단위 필요) / (2) 0.1° (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-75"
  },
  {
   "id": "c22-s62-u01-w076",
   "no": 76,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T07",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "우리나라 한 지역의 정성 모형입니다. (1)겨울에 해당하는 위치 기호 (2)여름에 해당하는 위치 기호를 쓰세요.",
   "answer": "Q / P",
   "explanation": "고도와 낮길이가 모두 가장 작은Q가 겨울, 모두 가장 큰P가 여름이에요. 중간인R은 봄·가을을 함께 나타낼 수 있으므로 한 계절로 강제하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "Q",
       "q"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "P",
       "p"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "위치",
     "남중 고도",
     "낮길이의 비교"
    ],
    "행": [
     [
      "P",
      "높음",
      "김"
     ],
     [
      "Q",
      "낮음",
      "짧음"
     ],
     [
      "R",
      "중간",
      "중간"
     ]
    ]
   },
   "givens": "같은 북반구 중위도 한 지역을 비교한 계절 관계 모형이다. 실제 계절 날짜와 기온은 제시하지 않았다.",
   "standards": [
    "6과13-02"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) Q 또는 q / (2) P 또는 p. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "같은 북반구 중위도 한 지역을 비교한 계절 관계 모형이다. 실제 계절 날짜와 기온은 제시하지 않았다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-76"
  },
  {
   "id": "c22-s62-u01-w077",
   "no": 77,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T07",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "여름과 겨울의 고도·낮길이 두 자료를 모두 들어 관계를 설명하세요.",
   "answer": "서울 여름은75.9°·14시간45분이고 겨울은29.0°·9시간34분이다. 같은 장소에서 남중 무렵 고도가 높은 여름 비교일에 낮도 더 길게 나타났다.",
   "explanation": "한쪽 고도만 제시하면 낮길이와의 관계를 설명한 것이 아니에요. 같은 기준의 두 양과 두 날짜를 함께 인용해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "같은 서울 지점이라는 비교 조건을 밝힌다.",
    "여름·겨울의 고도와 표시 시각 차 낮길이를 모두 인용한다.",
    "두 양의 계절별 관계를 자료 안에서 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "서울 여름은75.9°·14시간45분이고 겨울은29.0°·9시간34분이다. 같은 장소에서 남중 무렵 고도가 높은 여름 비교일에 낮도 더 길게 나타났다.",
    "required": [
     "같은 서울 지점이라는 비교 조건을 밝힌다.",
     "여름·겨울의 고도와 표시 시각 차 낮길이를 모두 인용한다.",
     "두 양의 계절별 관계를 자료 안에서 설명한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "까닭 설명",
   "criteria": "같은 서울 지점이라는 비교 조건을 밝힌다. / 여름·겨울의 고도와 표시 시각 차 낮길이를 모두 인용한다. / 두 양의 계절별 관계를 자료 안에서 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "lines": 6,
   "figure": "season-question-data-77"
  },
  {
   "id": "c22-s62-u01-w078",
   "no": 78,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T12",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "봄과 가을의 고도가 비슷하니 두 계절의 실제 평균 기온도 같다는 설명을 검토하세요.",
   "answer": "고도와 낮길이가 비슷한 것만으로 실제 평균 기온까지 정해지지 않는다. 땅·바다에 저장된 열과 날씨 등의 영향을 받을 수 있으므로 같은 장소의 기간별 실제 기온 자료를 더 확인해야 한다.",
   "explanation": "이 표는 네 날짜의 천문 계산 자료이고 계절 평균 기온 자료가 아니에요. 필요 자료를 추가해야 평균 기온 비교를 할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "태양 고도와 실제 기온을 다른 양으로 구별한다.",
    "고도 외에 기온에 영향을 주는 조건을 구체적으로 든다.",
    "평균 기온을 비교할 추가 자료의 장소·기간을 명시한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "고도와 낮길이가 비슷한 것만으로 실제 평균 기온까지 정해지지 않는다. 땅·바다에 저장된 열과 날씨 등의 영향을 받을 수 있으므로 같은 장소의 기간별 실제 기온 자료를 더 확인해야 한다.",
    "required": [
     "태양 고도와 실제 기온을 다른 양으로 구별한다.",
     "고도 외에 기온에 영향을 주는 조건을 구체적으로 든다.",
     "평균 기온을 비교할 추가 자료의 장소·기간을 명시한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "까닭 설명",
   "criteria": "태양 고도와 실제 기온을 다른 양으로 구별한다. / 고도 외에 기온에 영향을 주는 조건을 구체적으로 든다. / 평균 기온을 비교할 추가 자료의 장소·기간을 명시한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "lines": 6,
   "figure": "season-question-data-78"
  },
  {
   "id": "c22-s62-u01-w079",
   "no": 79,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T07",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "서울 네 날짜의 고도와 근삿낮길이를 각각 별도의 막대그래프로 나타내세요. 두 양의 단위와 같은 날짜 순서를 적고 여름·겨울을 비교하세요.",
   "answer": "날짜순으로 고도52.3·75.9·52.4·29.0°와 낮길이727·885·728·574분을 따로 나타낸다. 각 세로축에°·분을 쓰고 여름과 겨울의 두 양 차이를 설명한다.",
   "explanation": "낮길이는 표시 시각 차 기준의 분 수예요. 서로 다른 두 세로축을 합쳐 한 막대 높이로 표현하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "두 그래프의 날짜 순서와 대상 지점을 같게 한다.",
    "서로 다른 양·단위의 세로축을 구별한다.",
    "네 기록을 각 눈금에 맞게 표시한다.",
    "고도와 낮길이의 여름·겨울 관계를 두 근거로 설명한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "날짜순으로 고도52.3·75.9·52.4·29.0°와 낮길이727·885·728·574분을 따로 나타낸다. 각 세로축에°·분을 쓰고 여름과 겨울의 두 양 차이를 설명한다.",
    "required": [
     "두 그래프의 날짜 순서와 대상 지점을 같게 한다.",
     "서로 다른 양·단위의 세로축을 구별한다.",
     "네 기록을 각 눈금에 맞게 표시한다.",
     "고도와 낮길이의 여름·겨울 관계를 두 근거로 설명한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-02"
   ],
   "formLabel": "그림·설계",
   "criteria": "두 그래프의 날짜 순서와 대상 지점을 같게 한다. / 서로 다른 양·단위의 세로축을 구별한다. / 네 기록을 각 눈금에 맞게 표시한다. / 고도와 낮길이의 여름·겨울 관계를 두 근거로 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "given": [
    "바로 앞의 79번 자료면을 함께 보고 답하세요.",
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "drawing": "large",
   "contextFigure": "season-question-data-79"
  },
  {
   "id": "c22-s62-u01-w080",
   "no": 80,
   "section": 5,
   "sectionTitle": "네 계절의 고도와 낮길이",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "네 계절의 고도와 낮길이",
   "prompt": "친구가 섞어 놓은 계절 자료를 점검할 비교표를 설계하세요. 장소·날짜·시각·출처·자료 종류에서 어떤 항목을 확인할지 표시하세요.",
   "answer": "자료별로 장소/좌표·날짜·시간대·고도 요청시각·출처·계산/실측을 기록하는 표를 그린다. 같은 조건의 행끼리 연결하고 다른 도시나 오전/남중 차이는 따로 표시한다.",
   "explanation": "이름표와 연결 방법은 여러 가지여도 좋아요. 같은 계절이라는 제목만 보고 조건이 다른 값을 합치지 않도록 설계해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "지역·날짜·시간대의 점검 칸을 만든다.",
    "하루 시각과 남중 조건을 구별한다.",
    "자료 출처와 계산/실측 성격을 나눈다.",
    "조건이 다른 자료를 무조건 같은 계절 근거로 합치지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "자료별로 장소/좌표·날짜·시간대·고도 요청시각·출처·계산/실측을 기록하는 표를 그린다. 같은 조건의 행끼리 연결하고 다른 도시나 오전/남중 차이는 따로 표시한다.",
    "required": [
     "지역·날짜·시간대의 점검 칸을 만든다.",
     "하루 시각과 남중 조건을 구별한다.",
     "자료 출처와 계산/실측 성격을 나눈다.",
     "조건이 다른 자료를 무조건 같은 계절 근거로 합치지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-02"
   ],
   "formLabel": "그림·설계",
   "criteria": "지역·날짜·시간대의 점검 칸을 만든다. / 하루 시각과 남중 조건을 구별한다. / 자료 출처와 계산/실측 성격을 나눈다. / 조건이 다른 자료를 무조건 같은 계절 근거로 합치지 않는다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w081",
   "no": 81,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "P와Q의 같은 크기 한 칸이 받는 모형 에너지를 바르게 비교한 것은 무엇인가요?",
   "answer": "① P는6단위·Q는3단위이다.",
   "explanation": "총36단위를P는6칸, Q는12칸에 고르게 나누어요. P의 한 칸은36÷6=6단위, Q는36÷12=3단위로P가 많아요. 총에너지와 한 칸당 에너지를 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "P는6단위·Q는3단위이다.",
    "P는3단위·Q는6단위이다.",
    "P와 Q는 모두36단위이다.",
    "P는36단위·Q는12단위이다.",
    "칸 수가 많은 Q의 한 칸이 항상 더 많다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "table": {
    "머리": [
     "경우",
     "1분 동안 받은 총에너지(모형 단위)",
     "빛이 퍼진 칸 수"
    ],
    "행": [
     [
      "P",
      36,
      6
     ],
     [
      "Q",
      36,
      12
     ]
    ]
   },
   "givens": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
   "modelRef": "light",
   "standards": [
    "6과13-03"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ① P는6단위·Q는3단위이다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
   ],
   "figure": "season-question-data-81"
  },
  {
   "id": "c22-s62-u01-w082",
   "no": 82,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T09",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "입사각만 바꾸어 빛 넓이를 비교하려고 합니다. 같은 조건으로 유지할 것을 고르세요.",
   "answer": "④ 광원 밝기와 중심 거리",
   "explanation": "입사각을 바꾸려면 빛의 양·시간·종이 재질·광원에서 종이 중심까지 거리를 맞춰야 해요. 다른 원인까지 함께 바꾸면 넓이 차이를 각도 때문이라고 설명하기 어려워요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "종이와 빛이 이루는 입사각",
    "매번 다른 종류의 손전등과 건전지",
    "광원을 켜 두는 시간과 밝기의 임의 변화",
    "광원 밝기와 중심 거리",
    "한 번은 거울·한 번은 검은 종이를 쓰는 조건"
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "givens": "중심 거리는 광원에서 종이 중심까지의 거리이다.",
   "standards": [
    "6과13-03"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ④ 광원 밝기와 중심 거리를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "중심 거리는 광원에서 종이 중심까지의 거리이다."
   ]
  },
  {
   "id": "c22-s62-u01-w083",
   "no": 83,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "총에너지가 같을 때 더 넓게 퍼진Q의 한 칸이 받는 에너지는P보다 (1). 이때 두 경우의 총에너지 양은 (2).",
   "answer": "적다 / 같다",
   "explanation": "P와Q모두 총36단위지만Q는두 배 넓은12칸에 퍼져 한 칸당3단위로 적어요. 총량이 줄어든 것과 넓게 나뉜 것을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "적다",
       "적어요",
       "작다"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "같다",
       "같아요",
       "같음"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "경우",
     "1분 동안 받은 총에너지(모형 단위)",
     "빛이 퍼진 칸 수"
    ],
    "행": [
     [
      "P",
      36,
      6
     ],
     [
      "Q",
      36,
      12
     ]
    ]
   },
   "givens": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
   "modelRef": "light",
   "standards": [
    "6과13-03"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 적다 또는 적어요 또는 작다 / (2) 같다 또는 같아요 또는 같음. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-83"
  },
  {
   "id": "c22-s62-u01-w084",
   "no": 84,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "이 빛 넓이 모형에서 광원은 실제 (1), 모눈종이는 실제 (2)에 대응해요.",
   "answer": "태양 / 지표면",
   "explanation": "광원은 빛을 보내는 태양, 종이는 빛을 받는 지표면에 대응해요. 광원 크기·거리·빛의 평행성은 실제와 다르므로 모형 한계를 함께 말해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "태양"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "지표면",
       "지표"
      ]
     }
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 태양 / (2) 지표면 또는 지표. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w085",
   "no": 85,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T09",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "조건을 실험 설계의 역할과 한 번씩 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "입사각은 달리하고 빛 넓이를 비교해요. 밝기·중심 거리 같은 조건은 유지해야 넓이 차이의 원인을 각도 변화와 연결할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 빛과 종이 사이의 각",
    "(2) 빛이 퍼진 넓이",
    "(3) 광원 밝기·중심 거리"
   ],
   "options": [
    "ㄱ 관찰/비교할 결과",
    "ㄴ 같게 유지할 조건",
    "ㄷ 달리할 조건"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "ㄱ 관찰/비교할 결과",
    "ㄴ 같게 유지할 조건",
    "ㄷ 달리할 조건"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w086",
   "no": 86,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "빛 넓이 모형의 수치를 알맞은 뜻과 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "36단위는두 경우 총량, 6칸은P의넓이, 3단위/칸은Q의단위면적 에너지예요. 단위와 분모를 읽어 다른 양을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 36단위",
    "(2) P의6칸",
    "(3) Q의3단위/칸"
   ],
   "options": [
    "ㄱ Q의 같은 넓이 한 칸이 받는 양",
    "ㄴ 각 경우가 같은 시간 받은 총에너지",
    "ㄷ P에서 빛이 퍼진 넓이"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "table": {
    "머리": [
     "경우",
     "1분 동안 받은 총에너지(모형 단위)",
     "빛이 퍼진 칸 수"
    ],
    "행": [
     [
      "P",
      36,
      6
     ],
     [
      "Q",
      36,
      12
     ]
    ]
   },
   "givens": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
   "modelRef": "light",
   "standards": [
    "6과13-03"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
    "ㄱ Q의 같은 넓이 한 칸이 받는 양",
    "ㄴ 각 경우가 같은 시간 받은 총에너지",
    "ㄷ P에서 빛이 퍼진 넓이"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-86"
  },
  {
   "id": "c22-s62-u01-w087",
   "no": 87,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "같은 총빛이 더 넓게 퍼졌을 때의 인과를 이으세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "입사각을 바꾸어 더 넓게 퍼지게 하면 같은 총량이 더 많은 같은 칸에 나뉘므로 한 칸당 양이 줄어요. 실제 기온은 이 모형에서 측정하지 않았어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 같은 크기 한 칸이 받는 에너지가 줄어든다.",
    "ㄴ 같은 시간·같은 총빛을 더 비스듬한 종이에 비춘다.",
    "ㄷ 종이에서 빛이 퍼진 넓이가 커진다."
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
   "standards": [
    "6과13-03"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "ㄱ 같은 크기 한 칸이 받는 에너지가 줄어든다.",
    "ㄴ 같은 시간·같은 총빛을 더 비스듬한 종이에 비춘다.",
    "ㄷ 종이에서 빛이 퍼진 넓이가 커진다."
   ]
  },
  {
   "id": "c22-s62-u01-w088",
   "no": 88,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T09",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "종이 중심까지 거리가 바뀐 것을 발견했습니다. 각도만의 영향을 다시 비교할 때 순서로 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "조건이 섞인 원인을 확인하고 고정한 뒤 다시 비교해야 해요. 섞인 옛 결과에 각도 원인만 붙이거나 그 결과를 지우고 수행을 꾸미지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 같은 중심 거리·밝기에서 각도만 바꾼 두 경우를 다시 비교한다.",
    "ㄴ 넓이 차이에 거리 변화가 함께 섞였음을 확인한다.",
    "ㄷ 중심 거리 표시와 광원 고정을 바로잡는다."
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
   "standards": [
    "6과13-03"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "ㄱ 같은 중심 거리·밝기에서 각도만 바꾼 두 경우를 다시 비교한다.",
    "ㄴ 넓이 차이에 거리 변화가 함께 섞였음을 확인한다.",
    "ㄷ 중심 거리 표시와 광원 고정을 바로잡는다."
   ]
  },
  {
   "id": "c22-s62-u01-w089",
   "no": 89,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "P·Q모형을 바르게 읽은 것을 모두 고르세요. (정답 3개)",
   "answer": "①, ③, ⑤",
   "explanation": "총량 36은 같고 한 칸당 P6/Q3으로 두 배 차이가 나요. 더 넓은 Q는 한 칸당 적지만 전체가 더 많아지거나 칸 수가 기온이 되는 것은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "P의 한 칸은 Q의 한 칸보다 두 배 많다.",
    "Q의 전체 에너지는 P보다 두 배 많다.",
    "Q는 더 넓게 퍼져 한 칸당 양이 적다.",
    "Q는12칸이므로 실제 기온이12℃이다.",
    "두 경우의 총에너지는 같다."
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
     "경우",
     "1분 동안 받은 총에너지(모형 단위)",
     "빛이 퍼진 칸 수"
    ],
    "행": [
     [
      "P",
      36,
      6
     ],
     [
      "Q",
      36,
      12
     ]
    ]
   },
   "givens": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
   "modelRef": "light",
   "standards": [
    "6과13-03"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택 순서는 관계없다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
   ],
   "figure": "season-question-data-89"
  },
  {
   "id": "c22-s62-u01-w090",
   "no": 90,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T09",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "이 실험의 비교 조건이나 한계를 바르게 설명한 것을 고르세요. (정답 2개)",
   "answer": "②, ④",
   "explanation": "밝기·시간·중심 거리를 통제하며 입사각만 달리해요. 빛은 눈에 비추지 않고 관찰한 넓이를 실제 공기 온도로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "입사각과 광원 종류를 동시에 바꾼다.",
    "같은 광원의 밝기와 비추는 시간을 맞춘다.",
    "눈에 빛을 직접 비춰 밝기를 비교한다.",
    "광원에서 종이 중심까지의 거리를 확인한다.",
    "모형의 빛 넓이만으로 오늘 공기 온도를 측정했다고 한다."
   ],
   "key": [
    1,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     1,
     3
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐·추가·중복 없이 고른다: ②, ④. 선택 순서는 관계없다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요."
  },
  {
   "id": "c22-s62-u01-w091",
   "no": 91,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "각 경우의 한 칸당 모형 에너지를 구하세요. (1)P (2)Q. 단위는 단위/칸으로 쓰세요.",
   "answer": "6단위/칸 / 3단위/칸",
   "explanation": "P는36÷6=6단위/칸, Q는36÷12=3단위/칸이에요. 두 수는 같은 크기 한 칸의 양을 나타내므로 총36단위와 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
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
       "단위/칸"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "6단위/칸"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 3,
      "units": [
       "단위/칸"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "3단위/칸"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "경우",
     "1분 동안 받은 총에너지(모형 단위)",
     "빛이 퍼진 칸 수"
    ],
    "행": [
     [
      "P",
      36,
      6
     ],
     [
      "Q",
      36,
      12
     ]
    ]
   },
   "givens": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
   "modelRef": "light",
   "verificationModel": {
    "kind": "energy-per-cell",
    "cases": [
     "P",
     "Q"
    ],
    "answers": [
     6,
     3
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 6단위/칸 (단위 필요) / (2) 3단위/칸 (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-91"
  },
  {
   "id": "c22-s62-u01-w092",
   "no": 92,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "같은 총빛36단위가 고르게 퍼지는 비교입니다. (1)9칸일 때 한 칸당 양 (2)18칸일 때 한 칸당 양을 단위/칸으로 쓰세요.",
   "answer": "4단위/칸 / 2단위/칸",
   "explanation": "R은36÷9=4단위/칸, S는36÷18=2단위/칸이에요. 같은 총량이 두 배 넓이에 나뉘면 한 칸당 양은 절반이 되는 모형 관계예요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 4,
      "units": [
       "단위/칸"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "4단위/칸"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 2,
      "units": [
       "단위/칸"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2단위/칸"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "경우",
     "총에너지",
     "같은 크기 칸 수"
    ],
    "행": [
     [
      "R",
      "36단위",
      9
     ],
     [
      "S",
      "36단위",
      18
     ]
    ]
   },
   "givens": "균일 분포를 가정한 가상 에너지 모형이다. 실제 온도값이 아니다.",
   "verificationModel": {
    "kind": "energy-arithmetic",
    "total": 36,
    "areas": [
     9,
     18
    ],
    "answers": [
     4,
     2
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 4단위/칸 (단위 필요) / (2) 2단위/칸 (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "균일 분포를 가정한 가상 에너지 모형이다. 실제 온도값이 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-92"
  },
  {
   "id": "c22-s62-u01-w093",
   "no": 93,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "P와 Q의 총량은 같은데 P의 한 칸이 더 많이 받는 까닭을 자료로 설명하세요.",
   "answer": "두 경우 총36단위가 P는6칸, Q는12칸에 퍼진다. 같은 총량을 더 적은 칸에 나누는 P는 한 칸당6단위로 Q의3단위보다 많다.",
   "explanation": "총량·넓이·한 칸당 양을 각각 읽어야 해요. P가 더 많이 받는다는 말만 쓰면 전체 총량이 더 크다는 오해가 생길 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "총량36이 같다는 조건을 밝힌다.",
    "넓이6칸/12칸과 한 칸당 양6/3을 연결한다.",
    "총량 차이가 아니라 같은 넓이가 받는 양의 차이임을 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "두 경우 총36단위가 P는6칸, Q는12칸에 퍼진다. 같은 총량을 더 적은 칸에 나누는 P는 한 칸당6단위로 Q의3단위보다 많다.",
    "required": [
     "총량36이 같다는 조건을 밝힌다.",
     "넓이6칸/12칸과 한 칸당 양6/3을 연결한다.",
     "총량 차이가 아니라 같은 넓이가 받는 양의 차이임을 설명한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "경우",
     "1분 동안 받은 총에너지(모형 단위)",
     "빛이 퍼진 칸 수"
    ],
    "행": [
     [
      "P",
      36,
      6
     ],
     [
      "Q",
      36,
      12
     ]
    ]
   },
   "givens": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
   "modelRef": "light",
   "standards": [
    "6과13-03"
   ],
   "formLabel": "까닭 설명",
   "criteria": "총량36이 같다는 조건을 밝힌다. / 넓이6칸/12칸과 한 칸당 양6/3을 연결한다. / 총량 차이가 아니라 같은 넓이가 받는 양의 차이임을 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
   ],
   "lines": 6,
   "figure": "season-question-data-93"
  },
  {
   "id": "c22-s62-u01-w094",
   "no": 94,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T09",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "두 종이를 비출 때 한쪽의 손전등은 더 가까이 두고 더 밝게 했습니다. 넓이가 다르니 입사각 때문이라고 결론내려도 될까요?",
   "answer": "각도 외에 중심 거리와 밝기도 달라 원인이 섞였다. 같은 광원·시간·재질·중심 거리를 유지하고 입사각만 달리해 다시 비교해야 한다.",
   "explanation": "동시에 바꾼 조건이 여러 개면 각도 하나가 원인임을 가릴 수 없어요. 실제로 바꾼 조건을 밝혀 해석 범위를 줄이고 다시 비교해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "각도 외에 섞인 두 조건을 특정한다.",
    "원인을 하나로 확정하기 어려운 까닭을 말한다.",
    "조건 통제를 바로잡은 다음 비교 방법을 제시한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "각도 외에 중심 거리와 밝기도 달라 원인이 섞였다. 같은 광원·시간·재질·중심 거리를 유지하고 입사각만 달리해 다시 비교해야 한다.",
    "required": [
     "각도 외에 섞인 두 조건을 특정한다.",
     "원인을 하나로 확정하기 어려운 까닭을 말한다.",
     "조건 통제를 바로잡은 다음 비교 방법을 제시한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "까닭 설명",
   "criteria": "각도 외에 섞인 두 조건을 특정한다. / 원인을 하나로 확정하기 어려운 까닭을 말한다. / 조건 통제를 바로잡은 다음 비교 방법을 제시한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w095",
   "no": 95,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T08",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "P와Q의빛자국을 같은 크기 모눈칸으로 그리세요. 총량·칸 수·한 칸당 양을 이름표로 붙이고 차이를 설명하세요.",
   "answer": "P는6칸·총36단위·한 칸6단위, Q는12칸·총36단위·한 칸3단위로 표현한다. 같은 크기 칸과 균일 분포 가정, 실제 기온이 아님을 쓴다.",
   "explanation": "같은 크기 한 칸을 기준으로 나누어야 비교할 수 있어요. 더 진한 색만으로 답을 대신하기보다 수치와 조건을 함께 적어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "두 경우의 모눈 한 칸 크기를 같게 그린다.",
    "총36단위와 넓이6/12칸을 구별해 표시한다.",
    "한 칸당6/3단위를 관계에 맞게 설명한다.",
    "실제 빛이 완전 균일하지 않을 수 있는 모형 한계를 밝힌다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "P는6칸·총36단위·한 칸6단위, Q는12칸·총36단위·한 칸3단위로 표현한다. 같은 크기 칸과 균일 분포 가정, 실제 기온이 아님을 쓴다.",
    "required": [
     "두 경우의 모눈 한 칸 크기를 같게 그린다.",
     "총36단위와 넓이6/12칸을 구별해 표시한다.",
     "한 칸당6/3단위를 관계에 맞게 설명한다.",
     "실제 빛이 완전 균일하지 않을 수 있는 모형 한계를 밝힌다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "table": {
    "머리": [
     "경우",
     "1분 동안 받은 총에너지(모형 단위)",
     "빛이 퍼진 칸 수"
    ],
    "행": [
     [
      "P",
      36,
      6
     ],
     [
      "Q",
      36,
      12
     ]
    ]
   },
   "givens": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다.",
   "modelRef": "light",
   "standards": [
    "6과13-03"
   ],
   "formLabel": "그림·설계",
   "criteria": "두 경우의 모눈 한 칸 크기를 같게 그린다. / 총36단위와 넓이6/12칸을 구별해 표시한다. / 한 칸당6/3단위를 관계에 맞게 설명한다. / 실제 빛이 완전 균일하지 않을 수 있는 모형 한계를 밝힌다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "given": [
    "바로 앞의 95번 자료면을 함께 보고 답하세요.",
    "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
   ],
   "drawing": "large",
   "contextFigure": "season-question-data-95"
  },
  {
   "id": "c22-s62-u01-w096",
   "no": 96,
   "section": 6,
   "sectionTitle": "같은 빛이 퍼진 넓이를 비교해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T09",
   "topic": "같은 빛이 퍼진 넓이를 비교해요",
   "prompt": "종이 중심까지의 거리를 같게 유지하면서 입사각만 바꾸는 실험 배치를 두 그림으로 설계하세요.",
   "answer": "고정 광원과 중심 거리 표시를 두고 같은 종이를 중심에서 기울이는 두 경우를 그린다. 밝기·시간·재질은 같게 두고 빛이 퍼진 넓이를 비교한다고 설명한다.",
   "explanation": "광원과 종이의 중심 관계를 그림에서 확인할 수 있어야 해요. 종이를 기울이며 중심을 함께 옮겨 거리를 바꾸지 않도록 설계해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "두 경우의 같은 광원·밝기·시간을 표시한다.",
    "광원부터 종이 중심까지 같은 거리를 표시한다.",
    "종이의 기울기만 바꾼 모습을 나타낸다.",
    "빛 넓이와 실제 기온 측정을 구별하고 눈을 직접 비추지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "고정 광원과 중심 거리 표시를 두고 같은 종이를 중심에서 기울이는 두 경우를 그린다. 밝기·시간·재질은 같게 두고 빛이 퍼진 넓이를 비교한다고 설명한다.",
    "required": [
     "두 경우의 같은 광원·밝기·시간을 표시한다.",
     "광원부터 종이 중심까지 같은 거리를 표시한다.",
     "종이의 기울기만 바꾼 모습을 나타낸다.",
     "빛 넓이와 실제 기온 측정을 구별하고 눈을 직접 비추지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-03"
   ],
   "formLabel": "그림·설계",
   "criteria": "두 경우의 같은 광원·밝기·시간을 표시한다. / 광원부터 종이 중심까지 같은 거리를 표시한다. / 종이의 기울기만 바꾼 모습을 나타낸다. / 빛 넓이와 실제 기온 측정을 구별하고 눈을 직접 비추지 않는다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "빛의 총량·거리·시간을 맞추고 퍼진 넓이를 비교해요. 실내 깊이 모형을 실제 집 온도 결과로 바꾸지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w097",
   "no": 97,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "계절 원인 모형에서 공전 위치를 바꿀 때 지킬 축 조건을 고르세요.",
   "answer": "② 기울기와 공간에서 향하는 방향을 유지한다.",
   "explanation": "기울어진 축은 한 해 동안 거의 같은 방향을 향해요. 그 상태로 태양 둘레 위치가 바뀌어 같은 지역의 빛 관계가 달라지므로 축을 매번 광원 쪽으로 돌리면 비교 원인이 바뀌어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "각 위치마다 북극을 광원 쪽으로 새로 돌린다.",
    "기울기와 공간에서 향하는 방향을 유지한다.",
    "여름 위치에서만 축을 수직으로 바꾸어 세운다.",
    "고도가 큰 값을 얻을 때까지 지구의 크기를 바꾼다.",
    "같은 위치 표시를 남반구의 다른 점으로 바꾼다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ② 기울기와 공간에서 향하는 방향을 유지한다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요."
  },
  {
   "id": "c22-s62-u01-w098",
   "no": 98,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "같은 북반구 지역의 계절별 남중 고도를 모형에서 비교하려면 각 위치에서 무엇을 해야 하나요?",
   "answer": "⑤ 같은 지역이 남중하도록 지구의를 자전시켜 맞춘다.",
   "explanation": "같은 지역의 남중 고도를 비교하려면 위치마다 그 지역의 남중 상태를 맞춰야 해요. 자전 시각 차이를 계절별 고도 차이로 섞지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "공전 위치만 옮기고 새벽·한낮 상태를 섞어 읽는다.",
    "각도기를 어디에나 놓고 가장 큰 값만 골라 쓴다.",
    "매번 북극을 광원 쪽으로 돌려 높이를 맞춘다.",
    "광원 밝기를 바꾸어 온도가 같아질 때까지 기다린다.",
    "같은 지역이 남중하도록 지구의를 자전시켜 맞춘다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ⑤ 같은 지역이 남중하도록 지구의를 자전시켜 맞춘다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요."
  },
  {
   "id": "c22-s62-u01-w099",
   "no": 99,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T10",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "지구의 (1)이 기울어진 채 방향을 거의 유지하며 태양 둘레를 (2)하기 때문에 같은 지역의 계절별 빛 조건이 달라져요.",
   "answer": "자전축 / 공전",
   "explanation": "기울어진 것은 자전축, 태양 둘레의 위치가 바뀌는 운동은 공전이에요. 축 방향 유지와 함께 설명해야 같은 지역의 계절 차이를 말할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "자전축"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "공전"
      ]
     }
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 자전축 / (2) 공전. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w100",
   "no": 100,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "모형의 축이 수직이라는 말은 공전 (1)에 수직이라는 뜻이에요. 두 축 모형을 비교할 때 광원까지의 거리는 (2) 두어요.",
   "answer": "궤도면 / 같게",
   "explanation": "수직의 기준면을 공전 궤도면으로 정해요. 축 조건의 영향을 보려면 같은 반지름·광원·지역·남중 맞춤을 유지해야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "궤도면"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "같게",
       "일정하게"
      ]
     }
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 궤도면 / (2) 같게 또는 일정하게. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w101",
   "no": 101,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "모형 행동과 설명을 한 번씩 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "자전은 같은 지역의 하루 시각을, 공전은 태양 둘레 위치를 바꾸어요. 축이 공간의 같은 쪽을 향하는 조건을 별도로 유지해야 계절 비교가 돼요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 지구의를 축 중심으로 돌린다.",
    "(2) 지구의를 고정 광원 둘레로 옮긴다.",
    "(3) 기울어진 축이 같은 표지를 향하게 유지한다."
   ],
   "options": [
    "ㄱ 공전 위치가 달라지는 상태",
    "ㄴ 일 년 동안의 축 방향 조건",
    "ㄷ 같은 지역의 하루 시각이 바뀌는 상태"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "given": [
    "ㄱ 공전 위치가 달라지는 상태",
    "ㄴ 일 년 동안의 축 방향 조건",
    "ㄷ 같은 지역의 하루 시각이 바뀌는 상태"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w102",
   "no": 102,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "잘못한 모형 조작과 섞인 조건을 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "거리·자전 시각·축 방향은 서로 다른 조건이에요. 각각 무엇이 달라졌는지 찾아야 기울기와 공전의 영향만 비교하도록 고칠 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 겨울 위치에서 광원을 더 멀리 옮긴다.",
    "(2) 새 위치에서 우리나라 표시를 등진 채 고도를 읽는다.",
    "(3) 북극이 매번 광원을 향하도록 축을 돌린다."
   ],
   "options": [
    "ㄱ 축의 공간 방향을 바꾸었다.",
    "ㄴ 광원까지의 거리를 바꾸었다.",
    "ㄷ 지역의 남중 상태를 맞추지 않았다."
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "given": [
    "ㄱ 축의 공간 방향을 바꾸었다.",
    "ㄴ 광원까지의 거리를 바꾸었다.",
    "ㄷ 지역의 남중 상태를 맞추지 않았다."
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w103",
   "no": 103,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "다음 모형 절차의 필요한 순서를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "같은 조건을 준비한 뒤 첫 위치를 측정하고 같은 방법을 나머지 위치에 반복해요. 공전 위치만 옮겨 자전 시각이 다른 채 읽지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 준비한 첫 위치에서 우리나라 표시의 남중을 맞춰 읽는다.",
    "ㄴ 같은 광원·반지름·지역 표시와 두 축 조건을 준비한다.",
    "ㄷ 나머지 위치에서도 축 방향을 유지하고 같은 지역 남중을 맞춰 비교한다."
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
   "standards": [
    "6과13-03"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "given": [
    "ㄱ 준비한 첫 위치에서 우리나라 표시의 남중을 맞춰 읽는다.",
    "ㄴ 같은 광원·반지름·지역 표시와 두 축 조건을 준비한다.",
    "ㄷ 나머지 위치에서도 축 방향을 유지하고 같은 지역 남중을 맞춰 비교한다."
   ]
  },
  {
   "id": "c22-s62-u01-w104",
   "no": 104,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T10",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "축과 공전에서 계절 변화까지 인과에 맞게 이으세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "축 기울기·방향 유지와 공전이 같은 지역의 빛 조건을 달라지게 하고 에너지 차이로 이어져요. 공전한다는 말만으로 중간 과정을 생략하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 같은 지역의 남중 고도와 낮길이가 달라진다.",
    "ㄴ 기울어진 축의 방향을 유지하며 공전한다.",
    "ㄷ 지표가 받는 에너지에 차이가 생겨 계절 변화와 연결된다."
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
   "standards": [
    "6과13-03"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "given": [
    "ㄱ 같은 지역의 남중 고도와 낮길이가 달라진다.",
    "ㄴ 기울어진 축의 방향을 유지하며 공전한다.",
    "ㄷ 지표가 받는 에너지에 차이가 생겨 계절 변화와 연결된다."
   ]
  },
  {
   "id": "c22-s62-u01-w105",
   "no": 105,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "두 축 조건의 영향을 비교하는 설계로 타당한 것을 고르세요. (정답 3개)",
   "answer": "②, ④, ⑤",
   "explanation": "반지름·지역·남중 맞춤·광원을 같게 하고 축 기울기 조건을 달리해야 해요. 기울어진 축의 공간 방향도 유지해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "기울어진 축을 각 위치마다 광원 쪽으로 다시 돌린다.",
    "각 위치에서 같은 지역의 남중을 맞춘다.",
    "수직 축에서는 밝은 광원·기울어진 축에서는 다른 광원을 쓴다.",
    "같은 반지름의 네 위치에서 비교한다.",
    "같은 우리나라 표시를 모든 위치에서 사용한다."
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
   "standards": [
    "6과13-03"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ②, ④, ⑤. 선택 순서는 관계없다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요."
  },
  {
   "id": "c22-s62-u01-w106",
   "no": 106,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T10",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "같은 거리의 실물 모형과 계절 자료로 설명할 수 있는 것을 고르세요. (정답 2개)",
   "answer": "①, ④",
   "explanation": "같은 거리에서도 기울어진 축·방향 유지·공전으로 고도 차이가 날 수 있어요. 실제 날씨·기온 전체를 공 가열이나 거리 하나로 대신 설명하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "계절 차이를 설명하려면 축 조건과 공전이 함께 필요하다.",
    "태양에 가까워지는 것만이 우리나라 여름의 유일한 원인이다.",
    "광원으로 공을 가열하면 오늘 기온을 정확히 알 수 있다.",
    "같은 지역의 고도 차이를 빛 에너지 차이와 연결할 수 있다.",
    "축이 수직이어도 언제나 같은 크기의 계절별 고도 차이가 난다."
   ],
   "key": [
    0,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     3
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐·추가·중복 없이 고른다: ①, ④. 선택 순서는 관계없다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요."
  },
  {
   "id": "c22-s62-u01-w107",
   "no": 107,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "축이 수직인 원궤도 이상화 모형에서 같은 지점의 남중 고도는 위치마다 같습니다. (1)Q (2)S를 단위와 함께 채우세요.",
   "answer": "56° / 56°",
   "explanation": "수직 축·같은 지역·같은 광원 조건과 남중을 맞춘 모형이므로 모든 위치에서 같은56°예요. Q와 S를 비워 두지 않고 각기 단위를 함께 써요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 56,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "56°"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 56,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "56°"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "위치",
     "남중고도"
    ],
    "행": [
     [
      "P",
      "56°"
     ],
     [
      "Q",
      "(1)"
     ],
     [
      "R",
      "56°"
     ],
     [
      "S",
      "(2)"
     ]
    ]
   },
   "givens": "같은 반지름 네 위치·축이 궤도면에 수직·북위34°에 대응하는 같은 지점. 태양 중심과 평행광의 기하 모형이며 위도 공식 암기는 요구하지 않는다.",
   "verificationModel": {
    "kind": "vertical-axis",
    "latitude": 34,
    "expectedAltitude": 56
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 56° (단위 필요) / (2) 56° (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "given": [
    "같은 반지름 네 위치·축이 궤도면에 수직·북위34°에 대응하는 같은 지점. 태양 중심과 평행광의 기하 모형이며 위도 공식 암기는 요구하지 않는다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-107"
  },
  {
   "id": "c22-s62-u01-w108",
   "no": 108,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "기울어진 축의 방향을 유지한 비교 모형의 표입니다. (1)가장 높은 위치 기호 (2)최고−최저 고도 차를 쓰세요.",
   "answer": "Q / 44°",
   "explanation": "가장 큰78°는 Q, 가장 작은34°는 S예요. 차이는78−34=44°이며 두 축 조건이나 실제 서울 계산값과 섞지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "Q",
       "q"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 44,
      "units": [
       "°",
       "도"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "44°"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "위치",
     "남중고도"
    ],
    "행": [
     [
      "P",
      "56°"
     ],
     [
      "Q",
      "78°"
     ],
     [
      "R",
      "56°"
     ],
     [
      "S",
      "34°"
     ]
    ]
   },
   "givens": "같은 지역에 평행광을 가정한 원궤도 기하 모형. 위도34°·축 기울기22°를 설정했으며 실제 지구의 축 각·서울 계산값을 제시한 것은 아니다.",
   "verificationModel": {
    "kind": "tilted-axis",
    "latitude": 34,
    "tilt": 22,
    "altitudes": [
     56,
     78,
     56,
     34
    ],
    "maxIndex": 1,
    "difference": 44
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) Q 또는 q / (2) 44° (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "given": [
    "같은 지역에 평행광을 가정한 원궤도 기하 모형. 위도34°·축 기울기22°를 설정했으며 실제 지구의 축 각·서울 계산값을 제시한 것은 아니다."
   ],
   "parts": [
    "(1)",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-108"
  },
  {
   "id": "c22-s62-u01-w109",
   "no": 109,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "모둠이 공전 위치를 옮길 때마다 북극이 광원을 향하게 돌렸습니다. 계절 원인을 비교하려면 어떻게 고쳐야 할까요?",
   "answer": "축의 공간 방향까지 바뀌어 원래 조건과 다르다. 공간의 한 방향 표시를 정하고 기울기와 그 방향을 유지해 공전시킨다. 각 위치에서 같은 지역 남중을 맞춰 비교한다.",
   "explanation": "축을 매번 광원 쪽으로 향하게 하면 한 해 같은 방향 유지 조건이 사라져요. 공전 위치가 달라져 생기는 관계를 살필 수 있게 축 조건부터 고쳐요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "바뀐 축 방향 조건을 특정한다.",
    "공간의 고정 표시 등 방향 유지 방법을 제시한다.",
    "각 위치의 같은 지역 남중 맞춤을 함께 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "축의 공간 방향까지 바뀌어 원래 조건과 다르다. 공간의 한 방향 표시를 정하고 기울기와 그 방향을 유지해 공전시킨다. 각 위치에서 같은 지역 남중을 맞춰 비교한다.",
    "required": [
     "바뀐 축 방향 조건을 특정한다.",
     "공간의 고정 표시 등 방향 유지 방법을 제시한다.",
     "각 위치의 같은 지역 남중 맞춤을 함께 설명한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "까닭 설명",
   "criteria": "바뀐 축 방향 조건을 특정한다. / 공간의 고정 표시 등 방향 유지 방법을 제시한다. / 각 위치의 같은 지역 남중 맞춤을 함께 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w110",
   "no": 110,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T10",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "지구가 공전하기 때문에 계절이 변한다는 설명에 빠진 조건과 두 단계 이상의 과정을 보완하세요.",
   "answer": "자전축이 기울어진 채 방향을 거의 유지하며 공전한다. 그래서 같은 지역의 남중 고도와 낮길이가 달라져 받는 태양 에너지에 차이가 생기고 계절 변화가 나타난다.",
   "explanation": "축이 수직인 원궤도 모형도 공전할 수 있어요. 공전만의 설명으로는 두 축 모형의 차이를 설명할 수 없으므로 축 조건과 받는 빛을 함께 이어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "기울어진 축과 방향 유지를 밝힌다.",
    "공전 위치와 같은 지역 빛 조건 차이를 연결한다.",
    "고도/낮길이에서 에너지 차이로 가는 중간 과정을 설명한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "자전축이 기울어진 채 방향을 거의 유지하며 공전한다. 그래서 같은 지역의 남중 고도와 낮길이가 달라져 받는 태양 에너지에 차이가 생기고 계절 변화가 나타난다.",
    "required": [
     "기울어진 축과 방향 유지를 밝힌다.",
     "공전 위치와 같은 지역 빛 조건 차이를 연결한다.",
     "고도/낮길이에서 에너지 차이로 가는 중간 과정을 설명한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "까닭 설명",
   "criteria": "기울어진 축과 방향 유지를 밝힌다. / 공전 위치와 같은 지역 빛 조건 차이를 연결한다. / 고도/낮길이에서 에너지 차이로 가는 중간 과정을 설명한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w111",
   "no": 111,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "광원을 중심으로 같은 반지름 네 위치에 지구의를 그리고 기울어진 축이 같은 방향을 향하게 표시하세요. 같은 지역 표시도 붙이세요.",
   "answer": "네 지구 위치의 축을 서로 평행한 같은 방향으로 그리고 같은 우리나라 표시를 붙인다. 한 축을 광원 쪽으로 새로 돌리지 않으며 각 위치의 측정 전 남중 맞춤을 설명한다.",
   "explanation": "위에서 본 공전 배치에서 축을 광원 둘레로 방사형으로 그리면 방향 유지가 아니에요. 모형의 같은 방향 표시를 그림에서도 이어 나타내요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "광원 중심과 같은 반지름의 네 위치를 나타낸다.",
    "네 축의 기울기·공간 방향을 유지한다.",
    "같은 지역 표시와 고도 비교 조건을 담는다.",
    "그림의 시점과 축 유지 설명을 구별한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "네 지구 위치의 축을 서로 평행한 같은 방향으로 그리고 같은 우리나라 표시를 붙인다. 한 축을 광원 쪽으로 새로 돌리지 않으며 각 위치의 측정 전 남중 맞춤을 설명한다.",
    "required": [
     "광원 중심과 같은 반지름의 네 위치를 나타낸다.",
     "네 축의 기울기·공간 방향을 유지한다.",
     "같은 지역 표시와 고도 비교 조건을 담는다.",
     "그림의 시점과 축 유지 설명을 구별한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-03"
   ],
   "formLabel": "그림·설계",
   "criteria": "광원 중심과 같은 반지름의 네 위치를 나타낸다. / 네 축의 기울기·공간 방향을 유지한다. / 같은 지역 표시와 고도 비교 조건을 담는다. / 그림의 시점과 축 유지 설명을 구별한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w112",
   "no": 112,
   "section": 7,
   "sectionTitle": "같은 방향의 자전축으로 공전해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T11",
   "topic": "같은 방향의 자전축으로 공전해요",
   "prompt": "수직 축 모형과 기울어진 축 모형을 비교하는 빈 기록표를 그리세요. 각 위치의 지역·남중·축 방향을 확인할 칸도 설계하세요.",
   "answer": "두 축 조건별P/Q/R/S고도 칸과 같은 지역 표시·남중 맞춤·거리·축 방향 확인란을 만든다. 실제로 읽지 못한 칸은 미측정으로 남기고 예상과 측정을 나눈다.",
   "explanation": "수치 칸만 만들면 잘못 바뀐 조건을 놓칠 수 있어요. 무엇을 같게 했는지도 기록할 수 있게 설계해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "두 축 조건과 네 공전 위치가 구분된다.",
    "고도 단위와 같은 지역 남중 확인란이 있다.",
    "거리·광원·축 방향 조건을 확인할 수 있다.",
    "예상/실측·미측정을 구별한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "두 축 조건별P/Q/R/S고도 칸과 같은 지역 표시·남중 맞춤·거리·축 방향 확인란을 만든다. 실제로 읽지 못한 칸은 미측정으로 남기고 예상과 측정을 나눈다.",
    "required": [
     "두 축 조건과 네 공전 위치가 구분된다.",
     "고도 단위와 같은 지역 남중 확인란이 있다.",
     "거리·광원·축 방향 조건을 확인할 수 있다.",
     "예상/실측·미측정을 구별한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-03"
   ],
   "formLabel": "그림·설계",
   "criteria": "두 축 조건과 네 공전 위치가 구분된다. / 고도 단위와 같은 지역 남중 확인란이 있다. / 거리·광원·축 방향 조건을 확인할 수 있다. / 예상/실측·미측정을 구별한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w113",
   "no": 113,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "세 자료를 구분한 설명 중 타당한 것을 고르세요.",
   "answer": "③ 계산 자료와 실물 모형을 학생 실측과 나누어 기록한다.",
   "explanation": "직접 측정·공식 계산·이상화 모형은 서로 다른 근거예요. 문제를 맞히거나 예상을 쓰는 것만으로 실제 제작·관측 수행을 확정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "천문 계산값은 정확하므로 학생이 잰 값으로 적는다.",
    "예상 그래프를 실제 온도계 기록으로 바꾸어 낸다.",
    "계산 자료와 실물 모형을 학생 실측과 나누어 기록한다.",
    "문항 정답이면 측정기 제작도 완료한 것으로 본다.",
    "직접 측정하지 않은 칸은 원하는 경향으로 채운다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "standards": [
    "6과13-01",
    "6과13-02",
    "6과13-03"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ③ 계산 자료와 실물 모형을 학생 실측과 나누어 기록한다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요."
  },
  {
   "id": "c22-s62-u01-w114",
   "no": 114,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "남향 벽에 직각으로 들어오는 남중 햇빛을 비교합니다. 같은 창하단·수평 바닥·가림 없음 조건에서 맞는 것을 고르세요.",
   "answer": "③ 고도가 낮은 경우 창하단 광선은 더 먼 바닥에 도달한다.",
   "explanation": "같은 높이 창하단에서 더 낮은 각으로 들어온 직선 광선은 수평으로 더 멀리 가서 바닥에 닿아요. 이 조건의 기하 관계를 실내 기온이나 모든 창 조건으로 확대하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "고도가 높은 경우 창하단 광선은 늘 더 먼 곳에 도달한다.",
    "광선 깊이는 창 높이와 관계없이 모든 집에서 같다.",
    "고도가 낮은 경우 창하단 광선은 더 먼 바닥에 도달한다.",
    "방위와 시각이 다르더라도 깊이는 항상 계절로만 정해진다.",
    "햇빛 깊이 표만으로 오늘 실내 기온을 확정할 수 있다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "givens": "이상화 광선 모형. 창하단 높이120cm·같은 남향 수직 벽·광선 방위가 벽에 직각·수평 바닥·처마/가림 없음. 낮은 고도35°와 높은 고도65°를 비교하며 날씨/실내 온도 자료는 없다.",
   "modelRef": "window",
   "standards": [
    "6과13-02"
   ],
   "formLabel": "객관식",
   "criteria": "발문 조건에 맞는 문장 ③ 고도가 낮은 경우 창하단 광선은 더 먼 바닥에 도달한다.를 고른다. 다른 조건의 관계로 바꾸지 않는다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "given": [
    "이상화 광선 모형. 창하단 높이120cm·같은 남향 수직 벽·광선 방위가 벽에 직각·수평 바닥·처마/가림 없음. 낮은 고도35°와 높은 고도65°를 비교하며 날씨/실내 온도 자료는 없다."
   ]
  },
  {
   "id": "c22-s62-u01-w115",
   "no": 115,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T10",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "계절 설명에 쓸 두 근거를 채우세요. 여름에는 남중 고도가 높아 같은 면적이 받는 빛의 양이 많고, 낮도 (1) 햇빛 받는 시간이 길어요. 이 두 조건을 지표가 받는 (2)의 차이와 연결해요.",
   "answer": "길어 / 에너지",
   "explanation": "같은 면적의 에너지와 받는 시간의 차이가 모여 하루 총에너지 차이를 설명해요. 여름이 언제나 모든 겨울날보다 덥다는 개별 날씨 확정과는 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "길어",
       "길어서"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "에너지",
       "태양 에너지",
       "태양에너지"
      ]
     }
    ]
   },
   "standards": [
    "6과13-03"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 길어 또는 길어서 / (2) 에너지 또는 태양 에너지 또는 태양에너지. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w116",
   "no": 116,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "내가 잰 고도와 친구의 계산표를 합칠 때 자료의 (1)를 나누어 표시해요. 못 잰 시각의 칸은 (2)으로 남겨요. 두 칸은 종류/미측정 중 알맞게 쓰세요.",
   "answer": "종류 / 미측정",
   "explanation": "측정·계산·모형의 자료 종류를 나누면 각 근거가 말해 주는 범위를 구별할 수 있어요. 미측정 칸을 계산값이나 예상값으로 몰래 대체하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "종류"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "미측정"
      ]
     }
    ]
   },
   "standards": [
    "6과13-01"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 종류 / (2) 미측정. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w117",
   "no": 117,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "확인하려는 것과 필요한 자료를 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "도구 제작은 실제 도구와 과정, 계절 낮길이는 같은 조건 천문 자료, 축 공전 관계는 조건을 통제한 모형 근거가 필요해요. 한 종류의 정답 자료가 모든 수행을 증명하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 우리 반이 측정기를 만들었는가",
    "(2) 같은 서울의 네 날짜 낮길이는 어떤가",
    "(3) 축 방향을 유지하며 공전하면 빛 조건이 어떻게 달라지는가"
   ],
   "options": [
    "ㄱ 조건을 갖춘 실물 모형 비교 기록",
    "ㄴ 만든 도구와 실제 측정 과정의 근거",
    "ㄷ 같은 좌표·날짜·시간대의 천문 자료"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "standards": [
    "6과13-01",
    "6과13-02",
    "6과13-03"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "given": [
    "ㄱ 조건을 갖춘 실물 모형 비교 기록",
    "ㄴ 만든 도구와 실제 측정 과정의 근거",
    "ㄷ 같은 좌표·날짜·시간대의 천문 자료"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w118",
   "no": 118,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T10",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "자연 현상과 먼저 연결할 설명을 한 번씩 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "하루 변화의 시간 범위는 자전, 계절 빛 조건은 축과 공전, 단위면적의 차이는 빛의 입사각과 연결해요. 서로 다른 원인과 결과를 한 낱말로 뭉치지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     },
     {
      "label": "(3)",
      "accepted": [
       "ㄱ"
      ]
     }
    ]
   },
   "parts": [
    "(1) 같은 날 그림자의 방향·길이가 변한다.",
    "(2) 일 년 동안 같은 지역의 남중 고도·낮길이가 달라진다.",
    "(3) 빛이 낮은 각으로 같은 지표에 들어온다."
   ],
   "options": [
    "ㄱ 같은 총빛이 더 넓게 퍼져 단위면적 양이 줄어든다.",
    "ㄴ 지구 자전으로 같은 지역의 하루 시각이 달라진다.",
    "ㄷ 기울어진 축의 방향을 유지한 공전과 연결한다."
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "standards": [
    "6과13-01",
    "6과13-03"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "given": [
    "ㄱ 같은 총빛이 더 넓게 퍼져 단위면적 양이 줄어든다.",
    "ㄴ 지구 자전으로 같은 지역의 하루 시각이 달라진다.",
    "ㄷ 기울어진 축의 방향을 유지한 공전과 연결한다."
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u01-w119",
   "no": 119,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "자료를 확인한 뒤 설명 카드를 고치는 작업입니다. 실제 받은 질문을 반영하는 순서로 이으세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "먼저 근거 있는 첫 카드가 있어야 그 카드에 질문을 받고 반영할 수 있어요. 실제 받지 않은 의견을 지어 쓰는 것과 예상 질문을 미리 준비하는 것은 나누어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 실제 받은 질문과 자료를 대조해 설명을 수정한다.",
    "ㄴ 출처·조건·두 자료 근거를 담아 첫 설명 카드를 만든다.",
    "ㄷ 짝에게 첫 카드를 보여 주고 실제 질문을 받는다."
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
   "standards": [
    "6과13-03"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "given": [
    "ㄱ 실제 받은 질문과 자료를 대조해 설명을 수정한다.",
    "ㄴ 출처·조건·두 자료 근거를 담아 첫 설명 카드를 만든다.",
    "ㄷ 짝에게 첫 카드를 보여 주고 실제 질문을 받는다."
   ]
  },
  {
   "id": "c22-s62-u01-w120",
   "no": 120,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T10",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "우리나라의 여름 경향을 설명하는 인과 순서로 기호를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "축·공전은 빛 조건 차이를, 빛 조건은 에너지 차이를, 에너지 차이는 계절 기온의 경향을 설명해요. 이 연결로 개별 날씨의 모든 요인을 없앨 수는 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "options": [
    "ㄱ 빛의 입사각·받는 시간 차이로 하루에 받는 에너지가 달라진다.",
    "ㄴ 기울어진 축 방향을 유지한 공전으로 같은 지역 빛 조건이 달라진다.",
    "ㄷ 에너지 차이를 계절별 따뜻함의 경향과 연결한다."
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
   "standards": [
    "6과13-03"
   ],
   "formLabel": "순서 배열",
   "criteria": "지정한 시작점·과정 조건에서 ㄴ → ㄱ → ㄷ 순서로 쓴다. 기호 구분 방식은 달라도 대응 순서는 같아야 한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "given": [
    "ㄱ 빛의 입사각·받는 시간 차이로 하루에 받는 에너지가 달라진다.",
    "ㄴ 기울어진 축 방향을 유지한 공전으로 같은 지역 빛 조건이 달라진다.",
    "ㄷ 에너지 차이를 계절별 따뜻함의 경향과 연결한다."
   ]
  },
  {
   "id": "c22-s62-u01-w121",
   "no": 121,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T10",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "계절을 근거로 설명한 문장 중 타당한 것을 고르세요. (정답 3개)",
   "answer": "①, ③, ④",
   "explanation": "같은 장소의 자료·축과 공전 조건·에너지 중간 과정을 연결해야 해요. 지구 크기를 계절마다 바꾸거나 없는 실측 기온을 만들지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "받는 에너지 차이와 실제 날씨 요인을 구별한다.",
    "기온값이 없으면 계절 자료 대신 기온을 지어 쓴다.",
    "같은 장소의 고도·낮길이 두 자료를 함께 쓴다.",
    "축 기울기와 공전 중 방향 유지를 설명한다.",
    "여름에는 지구의 크기가 커져 빛을 더 받는다고 한다."
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
   "standards": [
    "6과13-03",
    "6과13-02",
    "6과13-01"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ④. 선택 순서는 관계없다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요."
  },
  {
   "id": "c22-s62-u01-w122",
   "no": 122,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "창문 햇빛 비교의 결론을 쓸 때 함께 유지하거나 밝힐 조건을 고르세요. (정답 3개)",
   "answer": "②, ④, ⑤",
   "explanation": "광선 깊이는 창 높이·방위·시각·가림에 영향을 받아요. 조건을 지정한 기하 비교를 모든 집이나 실내 기온으로 일반화하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "choices": [
    "빛이 비쳤으니 실내 기온도 이미 측정했다는 표시",
    "처마·가림 물체가 없는지 여부",
    "표의 깊이를 모든 집의 동일값으로 쓰는 규칙",
    "같은 창하단 높이와 같은 수평 바닥",
    "창 방위·비교 시각·광선 방향"
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
   "standards": [
    "6과13-02"
   ],
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐·추가·중복 없이 고른다: ②, ④, ⑤. 선택 순서는 관계없다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요."
  },
  {
   "id": "c22-s62-u01-w123",
   "no": 123,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "조건을 맞춘 창하단 광선 모형입니다. (1)35°일 때 깊이 (2)두 깊이의 차를cm로 쓰세요.",
   "answer": "171.4cm / 115.4cm",
   "explanation": "표에서35°는171.4cm이고 차이는171.4−56.0=115.4cm예요. 소수 첫째 자리 모형값끼리의 차이며 실내 기온 차를 뜻하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "number-unit",
      "value": 171.4,
      "units": [
       "cm",
       "센티미터"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "171.4cm"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 115.4,
      "units": [
       "cm",
       "센티미터"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "115.4cm"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "빛고도",
     "창하단에서 온 광선이 바닥에 닿는 수평 깊이"
    ],
    "행": [
     [
      "35°",
      "171.4cm"
     ],
     [
      "65°",
      "56.0cm"
     ]
    ]
   },
   "givens": "같은 남향 수직 벽·벽에 직각인 광선 방위·창하단120cm·수평 바닥·처마/가림 없음·직선 광선 가정의 기하 모형. 실제 집 실측이 아니다.",
   "modelRef": "window",
   "verificationModel": {
    "kind": "window-depth-difference",
    "depths": [
     171.4,
     56
    ],
    "difference": 115.4
   },
   "standards": [
    "6과13-02"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) 171.4cm (단위 필요) / (2) 115.4cm (단위 필요). 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "given": [
    "같은 남향 수직 벽·벽에 직각인 광선 방위·창하단120cm·수평 바닥·처마/가림 없음·직선 광선 가정의 기하 모형. 실제 집 실측이 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "season-question-data-123"
  },
  {
   "id": "c22-s62-u01-w124",
   "no": 124,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "세 자료 중 해당 질문에 직접 쓸 수 있는 기호를 각각 쓰세요. (1)서울 네 날짜의 낮길이 비교 (2)우리 반이 하루 여러 시각을 직접 쟀는지 확인",
   "answer": "ㄱ / ㄴ",
   "explanation": "서울 계절 낮길이는 조건을 갖춘ㄱ을 읽고 우리 반 직접 측정 수행은ㄴ의 과정과 기록을 확인해요. 임의 연습표ㄷ은 계산 연습에는 쓸 수 있지만 둘을 대신 증명하지 못해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "accepted": [
       "ㄱ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄴ"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "기호",
     "자료"
    ],
    "행": [
     [
      "ㄱ",
      "같은 서울 좌표·네 날짜·KST의 공식 일출/일몰 계산표"
     ],
     [
      "ㄴ",
      "날짜·시각·도구·관측 과정을 갖춘 우리 반 실측표"
     ],
     [
      "ㄷ",
      "임의의 시분 뺄셈 연습표"
     ]
    ]
   },
   "standards": [
    "6과13-02",
    "6과13-01"
   ],
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 순서를 바꾼 답은 인정하지 않으며 타당한 다른 표현은 교사가 확인한다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "season-question-data-124"
  },
  {
   "id": "c22-s62-u01-w125",
   "no": 125,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T10",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "겨울보다 여름에 따뜻한 경향을 설명할 때, 같은 장소 자료·빛 모형·축 공전을 모두 연결해 보세요.",
   "answer": "축이 기울어진 채 방향을 유지하며 공전해 같은 지역의 남중 고도와 낮길이가 달라진다. 서울의 여름75.9°·14시간45분은 겨울29.0°·9시간34분보다 높고 길다. 높은 고도는 단위면적에 들어오는 양을 늘리고 긴 낮은 받는 시간을 늘려 에너지 차이를 설명한다.",
   "explanation": "서로 다른 자료는 연결할 수 있지만 자료 성격까지 같아지는 것은 아니에요. 공식 계산·이상화 빛 모형·실물 축 비교를 각각 어떤 중간 과정의 근거로 썼는지 밝혀요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": true,
    "dataKind": "official-KASI-calculation-read-20261021",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "축 기울기·방향 유지·공전을 원인 조건으로 밝힌다.",
    "같은 서울의 여름·겨울 고도와 낮길이를 근거로 든다.",
    "빛의 단위면적 양과 받는 시간을 에너지 차이에 연결한다.",
    "개별 날씨의 기온을 항상 확정하는 주장은 하지 않는다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "축이 기울어진 채 방향을 유지하며 공전해 같은 지역의 남중 고도와 낮길이가 달라진다. 서울의 여름75.9°·14시간45분은 겨울29.0°·9시간34분보다 높고 길다. 높은 고도는 단위면적에 들어오는 양을 늘리고 긴 낮은 받는 시간을 늘려 에너지 차이를 설명한다.",
    "required": [
     "축 기울기·방향 유지·공전을 원인 조건으로 밝힌다.",
     "같은 서울의 여름·겨울 고도와 낮길이를 근거로 든다.",
     "빛의 단위면적 양과 받는 시간을 에너지 차이에 연결한다.",
     "개별 날씨의 기온을 항상 확정하는 주장은 하지 않는다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "날짜",
     "일출(KST)",
     "남중 표시(KST)",
     "일몰(KST)",
     "남중 무렵 고도(°)"
    ],
    "행": [
     [
      "2026-03-20",
      "06:36",
      "12:39",
      "18:43",
      "52.3"
     ],
     [
      "2026-06-21",
      "05:11",
      "12:33",
      "19:56",
      "75.9"
     ],
     [
      "2026-09-23",
      "06:20",
      "12:24",
      "18:28",
      "52.4"
     ],
     [
      "2026-12-22",
      "07:43",
      "12:30",
      "17:17",
      "29.0"
     ]
    ]
   },
   "givens": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다.",
   "modelRef": "seasonFacts",
   "sourceUrls": [
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-03-20&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-03-20&hour=12&minute=39&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-06-21&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-06-21&hour=12&minute=33&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-09-23&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-09-23&hour=12&minute=24&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=2026-12-22&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C",
    "https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=2026-12-22&hour=12&minute=30&second=0&address=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"
   ],
   "standards": [
    "6과13-03",
    "6과13-02",
    "6과13-01"
   ],
   "formLabel": "까닭 설명",
   "criteria": "축 기울기·방향 유지·공전을 원인 조건으로 밝힌다. / 같은 서울의 여름·겨울 고도와 낮길이를 근거로 든다. / 빛의 단위면적 양과 받는 시간을 에너지 차이에 연결한다. / 개별 날씨의 기온을 항상 확정하는 주장은 하지 않는다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "given": [
    "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
   ],
   "lines": 6,
   "figure": "season-question-data-125"
  },
  {
   "id": "c22-s62-u01-w126",
   "no": 126,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "문제를 모두 맞혔으니 측정기 제작·하루 관측·설명 나눔도 완료로 기록하자는 제안을 검토하세요.",
   "answer": "문항 응답은 개념 이해 근거이고 실제 수행과 다르다. 만든 도구·여러 시각의 실측표·실제 설명과 받은 질문 같은 활동 근거를 따로 확인하고 못 한 활동은 남겨 이어가야 한다.",
   "explanation": "지식 응답이 실제 경과 시간·도구 조작·타인과의 소통을 대신하지 않아요. 짧은 확인 기록을 남기되 긴 탐구보고서를 기본 완료 조건으로 만들지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "문항 정답과 실제 수행을 구별한다.",
    "제작·관측·나눔 중 구체적 수행 근거를 두 개 이상 제시한다.",
    "미실행 활동을 꾸미지 않고 이어갈 계획을 말한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "문항 응답은 개념 이해 근거이고 실제 수행과 다르다. 만든 도구·여러 시각의 실측표·실제 설명과 받은 질문 같은 활동 근거를 따로 확인하고 못 한 활동은 남겨 이어가야 한다.",
    "required": [
     "문항 정답과 실제 수행을 구별한다.",
     "제작·관측·나눔 중 구체적 수행 근거를 두 개 이상 제시한다.",
     "미실행 활동을 꾸미지 않고 이어갈 계획을 말한다."
    ],
    "exactStringScoring": false
   },
   "standards": [
    "6과13-01",
    "6과13-03"
   ],
   "formLabel": "까닭 설명",
   "criteria": "문항 정답과 실제 수행을 구별한다. / 제작·관측·나눔 중 구체적 수행 근거를 두 개 이상 제시한다. / 미실행 활동을 꾸미지 않고 이어갈 계획을 말한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u01-w127",
   "no": 127,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "계절 원인 설명 지도를 그리세요. 축 조건·공전·고도·낮길이·받는 에너지·계절의 경향을 화살표로 잇고, 자료 종류 이름표를 붙이세요.",
   "answer": "축 기울기/방향 유지+공전→같은 지역 고도/낮길이→단위면적 빛/받는 시간→에너지 차이→계절 경향으로 연결한다. 서울 계산표·빛 넓이 모형·실물 축 비교 근거를 해당 연결에 붙인다.",
   "explanation": "그림의 예쁨보다 빠진 조건과 중간 과정이 없는지 확인해요. 그림 속 실측표를 실제 하지 않았다면 실측으로 표시하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "원인과 결과의 방향을 바르게 연결한다.",
    "같은 지역의 고도와 낮길이 두 경로를 모두 포함한다.",
    "에너지 중간 과정과 계절 경향을 연결한다.",
    "각 근거의 계산/모형/실측 종류와 한계를 밝힌다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "축 기울기/방향 유지+공전→같은 지역 고도/낮길이→단위면적 빛/받는 시간→에너지 차이→계절 경향으로 연결한다. 서울 계산표·빛 넓이 모형·실물 축 비교 근거를 해당 연결에 붙인다.",
    "required": [
     "원인과 결과의 방향을 바르게 연결한다.",
     "같은 지역의 고도와 낮길이 두 경로를 모두 포함한다.",
     "에너지 중간 과정과 계절 경향을 연결한다.",
     "각 근거의 계산/모형/실측 종류와 한계를 밝힌다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-03",
    "6과13-02",
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "원인과 결과의 방향을 바르게 연결한다. / 같은 지역의 고도와 낮길이 두 경로를 모두 포함한다. / 에너지 중간 과정과 계절 경향을 연결한다. / 각 근거의 계산/모형/실측 종류와 한계를 밝힌다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u01-w128",
   "no": 128,
   "section": 8,
   "sectionTitle": "근거를 이어 계절을 설명해요",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "근거를 이어 계절을 설명해요",
   "prompt": "배운 내용을 친구에게 설명할 한 장 카드를 설계하세요. 내 주장·같은 장소의 두 근거·조건·남은 질문·수정할 공간을 넣으세요.",
   "answer": "고도와 낮길이의 관계 주장을 제시하고 출처 있는 여름·겨울 자료를 담는다. 축과 빛의 원인 설명, 계산/실측 구별, 실제 받은 질문 또는 예상 질문의 구별과 수정란을 넣는다.",
   "explanation": "지면 구성은 여러 가지가 가능해요. 장식보다 자료의 출처·조건·근거와 설명이 잘 연결되는지 확인하고 수정할 공간을 충분히 두어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과13-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅰ. 계절의 변화",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "actualEphemerisData": false,
    "dataKind": "authored-practice-or-specified-model",
    "scienceReview": "local-content-and-model-review; runtime-and-print-pending",
    "productRenderReviewed": false
   },
   "requirements": [
    "설명할 과학 주장과 같은 조건을 명확히 쓴다.",
    "주장을 뒷받침할 서로 다른 두 값 또는 두 날짜 근거를 담는다.",
    "그 근거와 계절 원인의 중간 과정을 연결한다.",
    "미확인 질문/실제 받은 질문을 나누고 수정 가능하게 한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "고도와 낮길이의 관계 주장을 제시하고 출처 있는 여름·겨울 자료를 담는다. 축과 빛의 원인 설명, 계산/실측 구별, 실제 받은 질문 또는 예상 질문의 구별과 수정란을 넣는다.",
    "required": [
     "설명할 과학 주장과 같은 조건을 명확히 쓴다.",
     "주장을 뒷받침할 서로 다른 두 값 또는 두 날짜 근거를 담는다.",
     "그 근거와 계절 원인의 중간 과정을 연결한다.",
     "미확인 질문/실제 받은 질문을 나누고 수정 가능하게 한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "standards": [
    "6과13-03",
    "6과13-02",
    "6과13-01"
   ],
   "formLabel": "그림·설계",
   "criteria": "설명할 과학 주장과 같은 조건을 명확히 쓴다. / 주장을 뒷받침할 서로 다른 두 값 또는 두 날짜 근거를 담는다. / 그 근거와 계절 원인의 중간 과정을 연결한다. / 미확인 질문/실제 받은 질문을 나누고 수정 가능하게 한다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
   "misconception": "계산·제공 연습표·실물 모형·실측 기록을 구별해요. 기대한 결과로 원기록을 덮어쓰지 않아요.",
   "drawing": "large"
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "계절의 변화",
   "blocks": [
    {
     "type": "diagram",
     "key": "materials"
    },
    {
     "type": "text",
     "text": "그림자로 태양 고도를 재고 같은 하루의 **고도·그림자·기온**을 비교해요. 같은 장소의 계절 자료와 자전축 모형으로 계절의 원인을 연결해요."
    },
    {
     "type": "field",
     "title": "이름·학습 날짜와 궁금한 것",
     "hint": "측정·자료·모형에서 무엇을 확인하고 싶은지 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제로 확인한 근거와 제공된 연습 자료를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "태양을 맨눈이나 망원경·쌍안경으로 직접 보지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "layout": "season-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "측정에서 계절의 까닭까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 태양 고도 측정기를 만들어요",
       "1~16번"
      ],
      [
       "2. 같은 막대의 그림자가 달라져요",
       "17~32번"
      ],
      [
       "3. 태양이 높을 때 가장 더울까요?",
       "33~48번"
      ],
      [
       "4. 일출과 일몰 사이 시간을 구해요",
       "49~64번"
      ],
      [
       "5. 네 계절의 고도와 낮길이",
       "65~80번"
      ],
      [
       "6. 같은 빛이 퍼진 넓이를 비교해요",
       "81~96번"
      ],
      [
       "7. 같은 방향의 자전축으로 공전해요",
       "97~112번"
      ],
      [
       "8. 근거를 이어 계절을 설명해요",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "8형식각16개, 모두128문항을 연습해요. 오른쪽에는 **핵심 정리·더 알아보기·내가 정리할 것**을 두었어요. 부분별 답은 바로 아래에 쓰고 그림에는 이름표와 설명을 붙여요."
    },
    {
     "type": "field",
     "title": "오늘의 계획",
     "hint": "먼저 풀 단원과 실제로 이어 할 활동을 정해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 차시40분과 별도확인45분은 수업 예시예요."
    },
    {
     "title": "더 알아보기",
     "text": "하루 관측에는 실제 경과 시간이 필요해요.128문항은 여러 시간에 나누어 학습해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "season-workbook"
  },
  {
   "section": "개념 1 · 태양 고도 측정기를 만들어요",
   "title": "태양 고도 측정기를 만들어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "태양 고도",
       "수평면과 태양 쪽 방향이 이루는 각"
      ],
      [
       "간접 측정",
       "태양을 직접 보지 않고 막대의 그림자와 실을 이용하는 방법"
      ],
      [
       "장치 기준",
       "수평 받침·수직 막대·수평에 맞춘 각도기"
      ]
     ]
    },
    {
     "type": "text",
     "text": "태양을 향해 눈으로 겨냥하지 않아요. 수평 받침 위에 막대를 수직으로 고정하고 같은 순간의 **그림자 끝**을 표시해요. 막대 끝과 그림자 끝을 실로 이으면 빛 방향을 간접적으로 나타낼 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "점검할 것",
      "확인할 기준"
     ],
     "rows": [
      [
       "받침판",
       "수평을 유지하는가?"
      ],
      [
       "막대",
       "받침과 수직인가?"
      ],
      [
       "실·각도기",
       "두 끝이 팽팽하게 연결되고 0° 기준이 수평인가?"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "태양 고도 측정기를 만들어요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "실과 수직 막대 사이 각이28°라면 태양 고도도28°일까요?",
     "steps": [
      [
       "기준 찾기",
       "태양 고도의 기준은 수평면이에요."
      ],
      [
       "직각 확인",
       "수평과 수직 사이가90°인지 확인해요."
      ],
      [
       "각 구하기",
       "90−28=62°예요."
      ]
     ],
     "answer": "장치가 수평·수직이라는 조건에서 고도는62°예요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w001",
      "c22-s62-u01-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 3~5",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w003",
      "c22-s62-u01-w004",
      "c22-s62-u01-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 6~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w006",
      "c22-s62-u01-w007",
      "c22-s62-u01-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w009",
      "c22-s62-u01-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 11~12",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w011",
      "c22-s62-u01-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 13",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 14",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 15",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 16",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ① · 제작",
   "title": "우리 측정기를 만들어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "materials"
    },
    {
     "type": "list",
     "items": [
      "교사가 준비한 끝이 둥근 막대·안정된 받침·실·각도기를 사용해요.",
      "받침을 수평으로 놓고 막대를 수직으로 고정해요.",
      "그림자 끝과 막대 끝을 잇는 실과 수평 기준을 맞춰요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "우리 장치의 실제 조건",
     "hint": "막대 높이·고정 방법·수평/수직 확인·각도기 기준을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험한 절단·날카로운 막대 끝을 피하고 교사와 고정해요."
    },
    {
     "title": "더 알아보기",
     "text": "준비 사진에 없는 측정 도구는 별도로 준비해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-device",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ② · 첫 읽기와 수정",
   "title": "같은 시각에 두 번 읽어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "실제 시각",
      "첫 고도(°)",
      "둘째 고도(°)",
      "그림자(cm)"
     ],
     "rows": [
      [
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "읽은 값과 수정한 조건",
     "hint": "처음 값을 보존하고 차이가 생긴 조건·고친 부분·다시 읽은 값을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "안전한 관측 계획",
     "hint": "장소·날짜·같은 막대·여러 시각과 교사 확인 방법을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "반복값 일치가 정확함을 보장하지는 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "태양 직접 겨냥 없이 그림자를 이용해요. 흐림·가림은 미측정으로 남겨요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-repeat",
   "layout": "season-workbook"
  },
  {
   "section": "개념 2 · 같은 막대의 그림자가 달라져요",
   "title": "같은 막대의 그림자가 달라져요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "같은 막대",
       "높이·방향을 바꾸지 않는 비교 대상"
      ],
      [
       "고도와 그림자",
       "같은 수평면의 수직 막대에서 고도가 높을수록 그림자가 짧아지는 관계"
      ],
      [
       "반복 읽기",
       "같은 설정에서 다시 읽어 차이와 기준을 확인하는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "한 장소에서 같은 날 여러 시각에 **같은 수직 막대**의 그림자와 고도를 함께 기록해요. 막대가 높아졌거나 받침이 기울었다면 그림자 차이의 원인이 섞여요."
    },
    {
     "type": "table",
     "heads": [
      "연습 시각",
      "고도",
      "같은 막대의 그림자"
     ],
     "rows": [
      [
       "오전 A",
       "낮음",
       "김"
      ],
      [
       "남중 무렵 B",
       "높음",
       "짧음"
      ],
      [
       "오후 C",
       "다시 낮아짐",
       "다시 길어짐"
      ]
     ]
    },
    {
     "type": "text",
     "text": "남중은 태양이 남쪽 하늘에 오는 때예요. 우리나라에서 시계12시와 늘 같거나 태양이 머리 위에 온다는 뜻은 아니에요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "같은 막대의 그림자가 달라져요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "같은 순간에10cm 막대와20cm 막대의 그림자 길이가 달랐어요. 태양이 두 높이에 있을까요?",
     "steps": [
      [
       "조건 구별",
       "막대 높이만 다르고 장소와 시각은 같아요."
      ],
      [
       "각과 길이 나누기",
       "빛의 방향은 같아도 막대가 높으면 그림자가 길어요."
      ],
      [
       "결론 한정",
       "같은 높이로 맞춘 뒤 그림자 관계를 비교해요."
      ]
     ],
     "answer": "그림자 길이 차이를 곧바로 고도 차이로 해석하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 17",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 18~19",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w018",
      "c22-s62-u01-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 20",
   "title": "빈칸 넣기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 21",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 22~23",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w022",
      "c22-s62-u01-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 24",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 25",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 26",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 27",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 28",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 29",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 30",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "31번 자료면",
   "title": "같은 막대의 그림자가 달라져요 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-31"
    },
    {
     "type": "text",
     "text": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 31번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 31",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 32",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ③ · 하루 관측",
   "title": "고도·그림자·기온을 함께 남겨요",
   "blocks": [
    {
     "type": "text",
     "text": "교사와 정한 같은 날 여러 시각에 실제로 이어 측정해요. 그늘의 통풍되는 같은 장소에서 공기 온도를 읽고 막대 높이·받침·시각 기준을 유지해요."
    },
    {
     "type": "table",
     "heads": [
      "실제 시각",
      "고도(°)",
      "그림자(cm)",
      "기온(℃)",
      "상태"
     ],
     "rows": [
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "측정하지 못한 상태와 다음 계획",
     "hint": "흐림·가림·이동 등 관측 조건을 적고 값을 예상으로 채우지 않아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기온계가 직사광선이나 뜨거운 바닥의 영향을 받지 않는지 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "하루 관측을40분 안에 모두 했다고 간주하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-daily",
   "layout": "season-workbook"
  },
  {
   "section": "개념 3 · 태양이 높을 때 가장 더울까요?",
   "title": "태양이 높을 때 가장 더울까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "기온",
       "통풍되는 그늘에서 읽는 공기의 온도"
      ],
      [
       "최고 시각",
       "각 자료에서 가장 큰 기록이 나온 시각"
      ],
      [
       "시간차",
       "시계 시각을 분 단위로 바꾸어 비교한 차이"
      ]
     ]
    },
    {
     "type": "text",
     "text": "고도는 각(°), 그림자는 길이(cm), 기온은 공기 온도(℃)예요. 서로 다른 양의 숫자를 직접 크기 비교하지 않아요. **각 자료의 최고·최저 시각**을 먼저 찾고 관계를 설명해요."
    },
    {
     "type": "text",
     "text": "햇빛을 더 받고 덜 받는 변화가 기온에 곧바로 같은 모양으로 나타나는 것은 아니에요. 바람·구름·주변 환경도 함께 작용해요. 제공 연습값은 실제 오늘 기온이 아니에요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "태양이 높을 때 가장 더울까요? · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "연습표에서 고도 최고가12:40, 기온 최고가14:10입니다. 시각이 같다고 말해도 될까요?",
     "steps": [
      [
       "기록 찾기",
       "서로 다른 두 자료의 최고 시각을 읽어요."
      ],
      [
       "시간차 구하기",
       "12:40→13:40은60분, →14:10은30분이에요."
      ],
      [
       "범위 밝히기",
       "차이는90분이며 이 표의 관계로 설명해요."
      ]
     ],
     "answer": "두 최고 시각은90분 차이예요. 모든 날이90분 차이라고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 33",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 34",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 35",
   "title": "빈칸 넣기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 36",
   "title": "빈칸 넣기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 37~39",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w037",
      "c22-s62-u01-w038",
      "c22-s62-u01-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 40",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 41",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 42",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 43",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 44",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 45",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 46",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "47번 자료면",
   "title": "태양이 높을 때 가장 더울까요? · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-47"
    },
    {
     "type": "text",
     "text": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 47번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 47",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 48",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ④ · 그래프",
   "title": "같은 시각 축에 세 관계를 나타내요",
   "blocks": [
    {
     "type": "text",
     "text": "실제로 남긴 하루 기록을 사용해 고도·그림자·기온 그래프를 각각 그려요. 가로축은 같은 시각, 세로축은 각 양과 단위로 정해요. 미측정 구간을 임의의 점으로 채우지 않아요."
    },
    {
     "type": "field",
     "title": "내 세 그래프와 범례",
     "hint": "각 그래프에 시각·양·단위를 쓰고 최고/최저 기록과 미측정 구간을 구별해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "읽은 사실과 까닭",
     "hint": "고도 최고와 기온 최고가 같은지 실제 기록 범위에서 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "°·cm·℃의 숫자를 하나의 같은 양처럼 비교하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "내 실제 기록과 연습표에서 나온 시간차를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-graph",
   "layout": "season-workbook"
  },
  {
   "section": "개념 4 · 일출과 일몰 사이 시간을 구해요",
   "title": "일출과 일몰 사이 시간을 구해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "일출·일몰",
       "해가 뜨고 지는 시각"
      ],
      [
       "낮길이",
       "일출부터 일몰까지의 시간"
      ],
      [
       "표시 정밀도",
       "분 단위 시각과 따로 계산한 낮길이가 조금 다를 수 있는 특성"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 장소의 날짜별 **일몰−일출**을 비교해요. 18:15−06:40에서15분만으로 뺄 수 없으면 한 시간을60분으로 바꾸어17시75분−6시40분으로 계산할 수 있어요."
    },
    {
     "type": "diagram",
     "key": "kasi-times"
    },
    {
     "type": "text",
     "text": "표시된 일몰−일출은 근삿낮길이예요. 사이트가 따로 표시한 낮길이와 봄·겨울에는 1분 차이가 있어요. 두 값을 고치거나 합치지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "일출과 일몰 사이 시간을 구해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "연습용 시각06:40부터18:15까지는 얼마인가요?",
     "steps": [
      [
       "기준 정하기",
       "같은 날의 일출과 일몰로 정해요."
      ],
      [
       "60분으로 바꾸기",
       "17시75분−6시40분=11시간35분이에요."
      ],
      [
       "검산하기",
       "06:40에11시간35분을 더하면18:15예요."
      ]
     ],
     "answer": "낮길이의 근삿값은11시간35분이에요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 49",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 50",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 51~52",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w051",
      "c22-s62-u01-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 53",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 54~55",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w054",
      "c22-s62-u01-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 56",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 57",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 58",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 59",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 60",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 61",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 62",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "63번 자료면",
   "title": "일출과 일몰 사이 시간을 구해요 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-63"
    },
    {
     "type": "text",
     "text": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 63번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 63",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 64",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 천문 계산 읽기",
   "title": "같은 장소에서 날짜를 바꿔요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "text",
     "text": "표의 서울 좌표와 한국 시각을 확인해요. 두 날짜를 골라 표시된 일출·일몰의 차를 직접 구해요. 아래에는 사이트 낮길이와 내가 구한 차를 각각 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "선택 날짜",
      "일출·일몰",
      "표시 시각의 차",
      "사이트 낮길이"
     ],
     "rows": [
      [
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "차이와 자료 종류 설명",
     "hint": "분 단위 표시의 한계와 실제 관측이 아니라 계산 자료라는 점을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계산 자료의 같은 지점·날짜·시간대를 먼저 맞춰요."
    },
    {
     "title": "더 알아보기",
     "text": "기온·구름·실제 학생 관측은 이 천문 계산표에 없어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-kasi",
   "layout": "season-workbook"
  },
  {
   "section": "개념 5 · 네 계절의 고도와 낮길이",
   "title": "네 계절의 고도와 낮길이",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "남중 고도",
       "태양이 남쪽에 왔을 때의 고도"
      ],
      [
       "같은 장소 비교",
       "위도·경도 기준을 맞추고 날짜를 바꾼 비교"
      ],
      [
       "계절 경향",
       "여러 조건 속에서 계절별로 나타나는 일반적 관계"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "kasi-altitude"
    },
    {
     "type": "text",
     "text": "일출·일몰·남중 시각은 분 단위 표시예요. 그 남중 시각의 초를 0으로 둔 고도를 소수 첫째 자리로 나타냈어요. 정확한 남중 순간의 최댓값을 측정한 것은 아니에요."
    },
    {
     "type": "text",
     "text": "고도가 높으면 같은 빛이 좁은 면적에 퍼지고 낮이 길면 빛을 받는 시간도 길어져요. 이 관계로 계절별 받는 에너지를 설명해요. 특정한 날의 실제 기온까지 표에서 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "네 계절의 고도와 낮길이 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "다른 두 도시의 여름·겨울 고도만 비교하면 날짜 효과만 알 수 있을까요?",
     "steps": [
      [
       "함께 바뀐 조건",
       "장소와 위도가 함께 달라졌어요."
      ],
      [
       "비교 다시 정하기",
       "같은 지점의 여름·겨울 날짜로 맞춰요."
      ],
      [
       "설명 연결",
       "고도와 낮길이를 각각 읽고 에너지와 연결해요."
      ]
     ],
     "answer": "날짜 외의 위치 기준을 맞춘 뒤 계절 관계를 설명해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 65",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 66",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 67~68",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w067",
      "c22-s62-u01-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 69",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 70~71",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w070",
      "c22-s62-u01-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 72",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 73",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 74",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 75",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 76",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 77",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 78",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "79번 자료면",
   "title": "네 계절의 고도와 낮길이 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-79"
    },
    {
     "type": "text",
     "text": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 79번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 79",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 80",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 계절 관계",
   "title": "두 날짜의 근거를 연결해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "kasi-altitude"
    },
    {
     "type": "field",
     "title": "나의 두 근거",
     "hint": "같은 서울 지점에서 선택한 두 날짜의 고도와 낮길이를 써요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "빛의 각과 시간으로 설명",
     "hint": "고도·낮길이→받는 빛의 각·시간→에너지 관계를 연결해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "남중 무렵 고도를 정확한 남중 순간의 최댓값으로 부르지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "계절 경향으로 특정한 날 기온을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-season",
   "layout": "season-workbook"
  },
  {
   "section": "개념 6 · 같은 빛이 퍼진 넓이를 비교해요",
   "title": "같은 빛이 퍼진 넓이를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "빛의 총량",
       "비교에서 같게 맞춘 전체 빛"
      ],
      [
       "단위 넓이",
       "한 칸처럼 같은 크기로 나눈 면적"
      ],
      [
       "빛 받는 각",
       "같은 양의 빛이 퍼지는 면적을 바꾸는 조건"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 준비한 안전한 LED와 같은 종이를 사용해요. 같은 빛 묶음·거리·시간에서 종이 면이 빛을 받는 각만 달리해 **퍼진 넓이**를 비교해요. 눈을 비추거나 고온 램프를 사용하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "연습 빛의 총량",
      "퍼진 칸 수",
      "한 칸의 양"
     ],
     "rows": [
      [
       "24단위",
       "6칸",
       "4단위"
      ],
      [
       "24단위",
       "12칸",
       "2단위"
      ]
     ]
    },
    {
     "type": "text",
     "text": "이 표는 나눔의 관계를 배우는 연습값이에요. 실제 빛의 세기·온도 측정치로 바꾸지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "같은 빛이 퍼진 넓이를 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "같은30단위 빛이5칸과10칸에 퍼졌습니다. 한 칸의 양은 어떻게 달라질까요?",
     "steps": [
      [
       "같은 양 확인",
       "전체 빛은30단위로 같아요."
      ],
      [
       "나누기",
       "30÷5=6,30÷10=3이에요."
      ],
      [
       "관계 설명",
       "좁은5칸 쪽의 한 칸이 더 많은 빛을 받아요."
      ]
     ],
     "answer": "5칸에서는6단위,10칸에서는3단위예요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 81",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w081"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 82~83",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w082",
      "c22-s62-u01-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 84~85",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w084",
      "c22-s62-u01-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 86~87",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w086",
      "c22-s62-u01-w087"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 88~89",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w088",
      "c22-s62-u01-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 90~91",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w090",
      "c22-s62-u01-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 92",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 93",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 94",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "95번 자료면",
   "title": "같은 빛이 퍼진 넓이를 비교해요 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-95"
    },
    {
     "type": "text",
     "text": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 95번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 95",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 96",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 빛 넓이",
   "title": "같은 빛을 다른 각으로 비춰요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사의 안전한 LED를 종이에 비추고 눈에 비추지 않아요.",
      "빛 묶음·거리·종이·시간은 맞추고 받는 각을 달리해요.",
      "빛이 퍼진 자국의 넓이를 격자나 테두리로 비교해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "실제 설정",
      "퍼진 넓이·비교 근거",
      "다른 영향"
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
     "title": "그림과 설명으로 정리",
     "hint": "두 자국·같게 한 조건·한 칸의 빛 관계를 표시해요. 온도를 재지 않았다면 온도 상승을 결과로 쓰지 않아요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "더 밝아 보인다는 말과 온도계로 잰 결과를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "고온 램프·불꽃·가열은 이 활동의 준비물이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-light",
   "layout": "season-workbook"
  },
  {
   "section": "개념 7 · 같은 방향의 자전축으로 공전해요",
   "title": "같은 방향의 자전축으로 공전해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "자전축 기울기",
       "지구의 자전축이 공전 궤도면의 수직 방향에서 기울어진 상태"
      ],
      [
       "방향 유지",
       "공전 중 축이 우주에서 거의 같은 방향을 향하는 조건"
      ],
      [
       "모형 비교",
       "수직 축과 기울어진 축에서 같은 지역의 남중을 맞춰 살피는 방법"
      ]
     ]
    },
    {
     "type": "text",
     "text": "태양 모형은 중앙에 고정하고 지구의 위치를 옮겨요. **같은 지역·같은 남중 조건**을 맞추되 축을 매번 태양 쪽으로 돌리지 않아요. 수직 축일 때와 기울어진 축일 때의 고도·낮길이 관계를 비교해요."
    },
    {
     "type": "text",
     "text": "축이 기울어진 채 공전하면 우리나라가 있는 북반구가 빛을 받는 각과 시간에 계절 차이가 생겨요. 여름이 단순히 태양에 더 가까워져 생긴다고 설명하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "조작",
      "유지할 조건"
     ],
     "rows": [
      [
       "공통",
       "고정 광원·같은 지역·거리·남중 기준"
      ],
      [
       "첫 모형",
       "궤도면에 수직인 축"
      ],
      [
       "둘째 모형",
       "기울기와 우주에서의 축 방향 유지"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "같은 방향의 자전축으로 공전해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "지구의를 옮길 때마다 축을 광원 쪽으로 기울이면 올바른 계절 비교일까요?",
     "steps": [
      [
       "변한 조건 찾기",
       "축이 우주에서 향하는 방향이 계속 바뀌었어요."
      ],
      [
       "조건 고치기",
       "먼 벽의 같은 방향 표지를 이용해 축 방향을 유지해요."
      ],
      [
       "남중 다시 맞추기",
       "축 방향은 유지하고 같은 지역을 자전시켜 남중을 맞춰요."
      ]
     ],
     "answer": "축 방향 유지와 같은 지역 남중 맞추기를 서로 다른 조작으로 구별해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 97~98",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w097",
      "c22-s62-u01-w098"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 99~101",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w099",
      "c22-s62-u01-w100",
      "c22-s62-u01-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 102~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w102",
      "c22-s62-u01-w103",
      "c22-s62-u01-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w105",
      "c22-s62-u01-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 107",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 108",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 109",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 110",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 111",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 112",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 수직 축",
   "title": "같은 지역의 남중을 맞춰요",
   "blocks": [
    {
     "type": "text",
     "text": "고정 광원·같은 반지름 네 위치·궤도면에 수직인 축을 준비해요. 같은 지역 표시를 매번 광원 쪽으로 자전시켜 남중 조건을 맞추고 빛 받는 각을 비교해요."
    },
    {
     "type": "table",
     "heads": [
      "공전 위치",
      "같은 지역의 남중 확인",
      "실제로 본 빛의 각"
     ],
     "rows": [
      [
       "P",
       "",
       ""
      ],
      [
       "Q",
       "",
       ""
      ],
      [
       "R",
       "",
       ""
      ],
      [
       "S",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "같은 관계와 모형의 한계",
     "hint": "유지한 조건과 관찰한 근거를 적어요. 유한 거리의 교실 광원은 완전한 평행광과 달라요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공전 위치를 옮기는 것과 남중을 맞추는 자전을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "축 수직 모형과 실제 지구를 같은 조건이라고 하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-vertical",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 기울어진 축",
   "title": "축 방향은 유지하며 옮겨요",
   "blocks": [
    {
     "type": "text",
     "text": "같은 장치에서 축을 기울이고 먼 벽의 방향 표지를 기준으로 축 방향을 유지해요. 매번 같은 지역의 남중을 맞추되 축을 광원 쪽으로 다시 돌리지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "공전 위치",
      "축 방향 유지",
      "남중 기준·빛의 각"
     ],
     "rows": [
      [
       "P",
       "",
       ""
      ],
      [
       "Q",
       "",
       ""
      ],
      [
       "R",
       "",
       ""
      ],
      [
       "S",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "두 축 조건 비교",
     "hint": "같은 위치·지역의 수직 축 기록과 나란히 비교해요. 예상과 달랐던 결과도 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울기·방향 유지·공전이 함께 작용해요."
    },
    {
     "title": "더 알아보기",
     "text": "단순화한 빛 경계와 실제 하루 낮길이가 완전히 같지는 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-tilted",
   "layout": "season-workbook"
  },
  {
   "section": "개념 8 · 근거를 이어 계절을 설명해요",
   "title": "근거를 이어 계절을 설명해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "주장",
       "자료로 설명하려는 계절 관계"
      ],
      [
       "근거",
       "같은 장소·조건이 드러난 고도와 낮길이의 값"
      ],
      [
       "설명 보완",
       "원기록을 보존하고 질문에 맞춰 근거와 설명을 다시 확인하는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "짧은 한 장에도 **주장·조건·두 근거·원인**이 이어지게 설명해요. 직접 측정한 기록, 천문 계산, 제공 연습표와 교실 모형을 구별하고 출처를 적어요."
    },
    {
     "type": "text",
     "text": "불분명하거나 기대와 다른 관찰은 그대로 남겨요. 친구 질문을 받으면 처음 자료와 수정한 부분을 나란히 확인해요. 긴 탐구보고서가 기본 과제는 아니에요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "근거를 이어 계절을 설명해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "겨울의 어느 날이 여름의 어느 날보다 따뜻했습니다. 계절 원인이 틀렸다는 뜻일까요?",
     "steps": [
      [
       "설명 범위",
       "계절의 일반 경향과 특정한 날의 날씨는 달라요."
      ],
      [
       "근거 나누기",
       "고도·낮길이와 그날의 구름·바람·기온을 구별해요."
      ],
      [
       "주장 보완",
       "계절별 에너지 경향을 말하되 모든 날 기온을 확정하지 않아요."
      ]
     ],
     "answer": "단일한 기온 예외로 고도·낮길이와 자전축의 관계를 없애지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 113",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w113"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 114~115",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w114",
      "c22-s62-u01-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 116~117",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w116",
      "c22-s62-u01-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 118~119",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w118",
      "c22-s62-u01-w119"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 120~121",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w120",
      "c22-s62-u01-w121"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 122~123",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w122",
      "c22-s62-u01-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 124",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 125",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 126",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 127",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 128",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑩ · 설명 카드",
   "title": "주장과 두 근거를 한 장에 담아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 장소 두 날짜의 자료나 실제 측정 근거를 골라요.",
      "계산/실측/연습/모형을 구별하고 조건과 출처를 써요.",
      "축과 공전·고도와 낮길이·받는 에너지를 연결해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "내 한 장 설명의 배치",
     "hint": "주장·두 근거·원인·남은 질문·수정할 공간을 크게 배치하고 실제로 만들어요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "장식보다 조건과 근거가 읽히는지 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "긴 탐구보고서 대신 교실에서 설명할 한 장 자료를 만들어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-card",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑪ · 나눔과 보완",
   "title": "받은 질문으로 설명을 고쳐요",
   "blocks": [
    {
     "type": "field",
     "title": "실제로 설명한 내용과 받은 질문",
     "hint": "아직 설명하지 않았다면 미실시 상태와 예상 질문을 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "원래 근거·다시 확인한 것·수정",
     "hint": "처음 기록을 남기고 고친 부분·이유와 다시 설명한 내용을 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예시 답안을 쓴 것과 실제 제작·설명을 마친 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "외부 게시나 메시지는 기본 과제로 요구하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "layout": "season-workbook"
  },
  {
   "section": "단원 정리",
   "title": "조건에서 계절의 원인까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "근거",
      "함께 설명할 관계"
     ],
     "rows": [
      [
       "같은 하루의 고도·그림자·기온",
       "고도와 그림자, 고도 최고와 기온 최고 시각"
      ],
      [
       "같은 지점의 두 날짜 자료",
       "남중 고도·낮길이와 계절 경향"
      ],
      [
       "수직 축·기울어진 축 모형",
       "축 방향 유지와 공전, 빛의 각과 시간"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 것",
     "hint": "확인한 근거·설명·남은 질문을 연결해 적어요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세 성취기준6과13-01~03을 자료와 활동으로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "모형 조건의 결론을 실제 모든 장소·날씨로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "season-workbook"
  },
  {
   "section": "단원 수행평가 · 6과13-01",
   "title": "측정기와 하루의 관계",
   "blocks": [
    {
     "type": "text",
     "text": "수평·수직 기준의 측정기를 실제로 만들고 안전한 간접 방법으로 두 시각 이상 관측해요. 고도·그림자·기온을 시각과 단위로 남기고 실제 관계를 설명해요."
    },
    {
     "type": "field",
     "title": "장치 조건·실제 기록·미측정 상태",
     "hint": "실제로 한 일·자료 종류·조건과 불분명한 부분을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 측정기 그림과 실제로 확인한 관계",
     "hint": "말·표·그림의 연결이 보이게 설명하고 남은 질문을 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 과정을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 실제 자료·조작·설명을 보고 피드백해요. 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "season-workbook"
  },
  {
   "section": "단원 수행평가 · 6과13-02",
   "title": "같은 장소 두 날짜의 근거",
   "blocks": [
    {
     "type": "text",
     "text": "같은 서울 지점의 계산 자료에서 두 날짜를 골라 고도와 낮길이를 비교해요. 표시 시각의 뺄셈과 사이트 낮길이를 각각 적고 계절별 관계를 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "날짜·좌표·시간대와 두 근거",
     "hint": "실제로 한 일·자료 종류·조건과 불분명한 부분을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "고도·낮길이→받는 각·시간→계절 경향",
     "hint": "말·표·그림의 연결이 보이게 설명하고 남은 질문을 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 과정을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 실제 자료·조작·설명을 보고 피드백해요. 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "season-workbook"
  },
  {
   "section": "단원 수행평가 · 6과13-03",
   "title": "축과 공전 모형의 설명",
   "blocks": [
    {
     "type": "text",
     "text": "교사와 실제 장치에서 수직 축과 기울어진 축을 비교해요. 같은 지역·남중·광원 조건과 축 방향을 유지한 실제 관찰 근거로 계절 원인을 설명해요."
    },
    {
     "type": "field",
     "title": "수직/기울어진 축 조작과 실제 관찰",
     "hint": "실제로 한 일·자료 종류·조건과 불분명한 부분을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "축·공전에서 빛의 각·시간까지 이어 설명",
     "hint": "말·표·그림의 연결이 보이게 설명하고 남은 질문을 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 과정을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 실제 자료·조작·설명을 보고 피드백해요. 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "season-workbook"
  }
 ],
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "계절의 변화",
   "blocks": [
    {
     "type": "diagram",
     "key": "materials"
    },
    {
     "type": "text",
     "text": "그림자로 태양 고도를 재고 같은 하루의 **고도·그림자·기온**을 비교해요. 같은 장소의 계절 자료와 자전축 모형으로 계절의 원인을 연결해요."
    },
    {
     "type": "field",
     "title": "이름·학습 날짜와 궁금한 것",
     "hint": "측정·자료·모형에서 무엇을 확인하고 싶은지 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제로 확인한 근거와 제공된 연습 자료를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "태양을 맨눈이나 망원경·쌍안경으로 직접 보지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "layout": "season-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "측정에서 계절의 까닭까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 태양 고도 측정기를 만들어요",
       "1~16번"
      ],
      [
       "2. 같은 막대의 그림자가 달라져요",
       "17~32번"
      ],
      [
       "3. 태양이 높을 때 가장 더울까요?",
       "33~48번"
      ],
      [
       "4. 일출과 일몰 사이 시간을 구해요",
       "49~64번"
      ],
      [
       "5. 네 계절의 고도와 낮길이",
       "65~80번"
      ],
      [
       "6. 같은 빛이 퍼진 넓이를 비교해요",
       "81~96번"
      ],
      [
       "7. 같은 방향의 자전축으로 공전해요",
       "97~112번"
      ],
      [
       "8. 근거를 이어 계절을 설명해요",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "8형식각16개, 모두128문항을 연습해요. 오른쪽에는 **핵심 정리·더 알아보기·내가 정리할 것**을 두었어요. 부분별 답은 바로 아래에 쓰고 그림에는 이름표와 설명을 붙여요."
    },
    {
     "type": "field",
     "title": "오늘의 계획",
     "hint": "먼저 풀 단원과 실제로 이어 할 활동을 정해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 차시40분과 별도확인45분은 수업 예시예요."
    },
    {
     "title": "더 알아보기",
     "text": "하루 관측에는 실제 경과 시간이 필요해요.128문항은 여러 시간에 나누어 학습해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "season-workbook"
  },
  {
   "section": "개념 1 · 태양 고도 측정기를 만들어요",
   "title": "태양 고도 측정기를 만들어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "태양 고도",
       "수평면과 태양 쪽 방향이 이루는 각"
      ],
      [
       "간접 측정",
       "태양을 직접 보지 않고 막대의 그림자와 실을 이용하는 방법"
      ],
      [
       "장치 기준",
       "수평 받침·수직 막대·수평에 맞춘 각도기"
      ]
     ]
    },
    {
     "type": "text",
     "text": "태양을 향해 눈으로 겨냥하지 않아요. 수평 받침 위에 막대를 수직으로 고정하고 같은 순간의 **그림자 끝**을 표시해요. 막대 끝과 그림자 끝을 실로 이으면 빛 방향을 간접적으로 나타낼 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "점검할 것",
      "확인할 기준"
     ],
     "rows": [
      [
       "받침판",
       "수평을 유지하는가?"
      ],
      [
       "막대",
       "받침과 수직인가?"
      ],
      [
       "실·각도기",
       "두 끝이 팽팽하게 연결되고 0° 기준이 수평인가?"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "태양 고도 측정기를 만들어요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "실과 수직 막대 사이 각이28°라면 태양 고도도28°일까요?",
     "steps": [
      [
       "기준 찾기",
       "태양 고도의 기준은 수평면이에요."
      ],
      [
       "직각 확인",
       "수평과 수직 사이가90°인지 확인해요."
      ],
      [
       "각 구하기",
       "90−28=62°예요."
      ]
     ],
     "answer": "장치가 수평·수직이라는 조건에서 고도는62°예요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w001",
      "c22-s62-u01-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 3~5",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w003",
      "c22-s62-u01-w004",
      "c22-s62-u01-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 6~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w006",
      "c22-s62-u01-w007",
      "c22-s62-u01-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w009",
      "c22-s62-u01-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 11~12",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w011",
      "c22-s62-u01-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 13",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 14",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 15",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양 고도 측정기를 만들어요 · 16",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평면과 빛 방향 사이의 각을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "수직 막대와 실 사이 각을 읽었다면 두 각의 합이90°인지 장치 조건과 함께 살펴요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 장치에서 고도를 읽을 각과 고정할 곳을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ① · 제작",
   "title": "우리 측정기를 만들어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "materials"
    },
    {
     "type": "list",
     "items": [
      "교사가 준비한 끝이 둥근 막대·안정된 받침·실·각도기를 사용해요.",
      "받침을 수평으로 놓고 막대를 수직으로 고정해요.",
      "그림자 끝과 막대 끝을 잇는 실과 수평 기준을 맞춰요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "우리 장치의 실제 조건",
     "hint": "막대 높이·고정 방법·수평/수직 확인·각도기 기준을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위험한 절단·날카로운 막대 끝을 피하고 교사와 고정해요."
    },
    {
     "title": "더 알아보기",
     "text": "준비 사진에 없는 측정 도구는 별도로 준비해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-device",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ② · 첫 읽기와 수정",
   "title": "같은 시각에 두 번 읽어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "실제 시각",
      "첫 고도(°)",
      "둘째 고도(°)",
      "그림자(cm)"
     ],
     "rows": [
      [
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "읽은 값과 수정한 조건",
     "hint": "처음 값을 보존하고 차이가 생긴 조건·고친 부분·다시 읽은 값을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "안전한 관측 계획",
     "hint": "장소·날짜·같은 막대·여러 시각과 교사 확인 방법을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "반복값 일치가 정확함을 보장하지는 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "태양 직접 겨냥 없이 그림자를 이용해요. 흐림·가림은 미측정으로 남겨요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-repeat",
   "layout": "season-workbook"
  },
  {
   "section": "개념 2 · 같은 막대의 그림자가 달라져요",
   "title": "같은 막대의 그림자가 달라져요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "같은 막대",
       "높이·방향을 바꾸지 않는 비교 대상"
      ],
      [
       "고도와 그림자",
       "같은 수평면의 수직 막대에서 고도가 높을수록 그림자가 짧아지는 관계"
      ],
      [
       "반복 읽기",
       "같은 설정에서 다시 읽어 차이와 기준을 확인하는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "한 장소에서 같은 날 여러 시각에 **같은 수직 막대**의 그림자와 고도를 함께 기록해요. 막대가 높아졌거나 받침이 기울었다면 그림자 차이의 원인이 섞여요."
    },
    {
     "type": "table",
     "heads": [
      "연습 시각",
      "고도",
      "같은 막대의 그림자"
     ],
     "rows": [
      [
       "오전 A",
       "낮음",
       "김"
      ],
      [
       "남중 무렵 B",
       "높음",
       "짧음"
      ],
      [
       "오후 C",
       "다시 낮아짐",
       "다시 길어짐"
      ]
     ]
    },
    {
     "type": "text",
     "text": "남중은 태양이 남쪽 하늘에 오는 때예요. 우리나라에서 시계12시와 늘 같거나 태양이 머리 위에 온다는 뜻은 아니에요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "같은 막대의 그림자가 달라져요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "같은 순간에10cm 막대와20cm 막대의 그림자 길이가 달랐어요. 태양이 두 높이에 있을까요?",
     "steps": [
      [
       "조건 구별",
       "막대 높이만 다르고 장소와 시각은 같아요."
      ],
      [
       "각과 길이 나누기",
       "빛의 방향은 같아도 막대가 높으면 그림자가 길어요."
      ],
      [
       "결론 한정",
       "같은 높이로 맞춘 뒤 그림자 관계를 비교해요."
      ]
     ],
     "answer": "그림자 길이 차이를 곧바로 고도 차이로 해석하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 17",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 18~19",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w018",
      "c22-s62-u01-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 20",
   "title": "빈칸 넣기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 21",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 22~23",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w022",
      "c22-s62-u01-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 24",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 25",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 26",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 27",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 28",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 29",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 30",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "31번 자료면",
   "title": "같은 막대의 그림자가 달라져요 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-31"
    },
    {
     "type": "text",
     "text": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 31번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 31",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 막대의 그림자가 달라져요 · 32",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 높이 막대에서는 고도가 높을수록 그림자가 짧아져요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 높이 막대의 그림자 길이만으로 태양 고도를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "고도와 그림자 길이를 공정하게 비교할 조건을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ③ · 하루 관측",
   "title": "고도·그림자·기온을 함께 남겨요",
   "blocks": [
    {
     "type": "text",
     "text": "교사와 정한 같은 날 여러 시각에 실제로 이어 측정해요. 그늘의 통풍되는 같은 장소에서 공기 온도를 읽고 막대 높이·받침·시각 기준을 유지해요."
    },
    {
     "type": "table",
     "heads": [
      "실제 시각",
      "고도(°)",
      "그림자(cm)",
      "기온(℃)",
      "상태"
     ],
     "rows": [
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "측정하지 못한 상태와 다음 계획",
     "hint": "흐림·가림·이동 등 관측 조건을 적고 값을 예상으로 채우지 않아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기온계가 직사광선이나 뜨거운 바닥의 영향을 받지 않는지 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "하루 관측을40분 안에 모두 했다고 간주하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-daily",
   "layout": "season-workbook"
  },
  {
   "section": "개념 3 · 태양이 높을 때 가장 더울까요?",
   "title": "태양이 높을 때 가장 더울까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "기온",
       "통풍되는 그늘에서 읽는 공기의 온도"
      ],
      [
       "최고 시각",
       "각 자료에서 가장 큰 기록이 나온 시각"
      ],
      [
       "시간차",
       "시계 시각을 분 단위로 바꾸어 비교한 차이"
      ]
     ]
    },
    {
     "type": "text",
     "text": "고도는 각(°), 그림자는 길이(cm), 기온은 공기 온도(℃)예요. 서로 다른 양의 숫자를 직접 크기 비교하지 않아요. **각 자료의 최고·최저 시각**을 먼저 찾고 관계를 설명해요."
    },
    {
     "type": "text",
     "text": "햇빛을 더 받고 덜 받는 변화가 기온에 곧바로 같은 모양으로 나타나는 것은 아니에요. 바람·구름·주변 환경도 함께 작용해요. 제공 연습값은 실제 오늘 기온이 아니에요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "태양이 높을 때 가장 더울까요? · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "연습표에서 고도 최고가12:40, 기온 최고가14:10입니다. 시각이 같다고 말해도 될까요?",
     "steps": [
      [
       "기록 찾기",
       "서로 다른 두 자료의 최고 시각을 읽어요."
      ],
      [
       "시간차 구하기",
       "12:40→13:40은60분, →14:10은30분이에요."
      ],
      [
       "범위 밝히기",
       "차이는90분이며 이 표의 관계로 설명해요."
      ]
     ],
     "answer": "두 최고 시각은90분 차이예요. 모든 날이90분 차이라고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 33",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 34",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 35",
   "title": "빈칸 넣기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 36",
   "title": "빈칸 넣기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 37~39",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w037",
      "c22-s62-u01-w038",
      "c22-s62-u01-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 40",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 41",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 42",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 43",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 44",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 45",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 46",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "47번 자료면",
   "title": "태양이 높을 때 가장 더울까요? · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-47"
    },
    {
     "type": "text",
     "text": "학생 실측이나 정밀 역서가 아닌 연습 자료. 같은 수평면의 수직 막대20cm. 고도는 단순화 모형이며 남중은12:50으로 설정했다. 기온은 별도로 만든 통풍 그늘의 공기 온도 연습값이다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 47번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 47",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "태양이 높을 때 가장 더울까요? · 48",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고도·그림자·기온을 같은 시각 축으로 읽되 값과 단위는 따로 써요."
    },
    {
     "title": "더 알아보기",
     "text": "지표와 공기가 데워지고 식는 과정 때문에 기온 최고가 늦을 수 있어요. 날마다 일정한 시간차는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "세 그래프에서 읽은 사실과 그 까닭을 구별해 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ④ · 그래프",
   "title": "같은 시각 축에 세 관계를 나타내요",
   "blocks": [
    {
     "type": "text",
     "text": "실제로 남긴 하루 기록을 사용해 고도·그림자·기온 그래프를 각각 그려요. 가로축은 같은 시각, 세로축은 각 양과 단위로 정해요. 미측정 구간을 임의의 점으로 채우지 않아요."
    },
    {
     "type": "field",
     "title": "내 세 그래프와 범례",
     "hint": "각 그래프에 시각·양·단위를 쓰고 최고/최저 기록과 미측정 구간을 구별해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "읽은 사실과 까닭",
     "hint": "고도 최고와 기온 최고가 같은지 실제 기록 범위에서 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "°·cm·℃의 숫자를 하나의 같은 양처럼 비교하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "내 실제 기록과 연습표에서 나온 시간차를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-graph",
   "layout": "season-workbook"
  },
  {
   "section": "개념 4 · 일출과 일몰 사이 시간을 구해요",
   "title": "일출과 일몰 사이 시간을 구해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "일출·일몰",
       "해가 뜨고 지는 시각"
      ],
      [
       "낮길이",
       "일출부터 일몰까지의 시간"
      ],
      [
       "표시 정밀도",
       "분 단위 시각과 따로 계산한 낮길이가 조금 다를 수 있는 특성"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 장소의 날짜별 **일몰−일출**을 비교해요. 18:15−06:40에서15분만으로 뺄 수 없으면 한 시간을60분으로 바꾸어17시75분−6시40분으로 계산할 수 있어요."
    },
    {
     "type": "diagram",
     "key": "kasi-times"
    },
    {
     "type": "text",
     "text": "표시된 일몰−일출은 근삿낮길이예요. 사이트가 따로 표시한 낮길이와 봄·겨울에는 1분 차이가 있어요. 두 값을 고치거나 합치지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "일출과 일몰 사이 시간을 구해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "연습용 시각06:40부터18:15까지는 얼마인가요?",
     "steps": [
      [
       "기준 정하기",
       "같은 날의 일출과 일몰로 정해요."
      ],
      [
       "60분으로 바꾸기",
       "17시75분−6시40분=11시간35분이에요."
      ],
      [
       "검산하기",
       "06:40에11시간35분을 더하면18:15예요."
      ]
     ],
     "answer": "낮길이의 근삿값은11시간35분이에요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 49",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 50",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 51~52",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w051",
      "c22-s62-u01-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 53",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 54~55",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w054",
      "c22-s62-u01-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 56",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 57",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 58",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 59",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 60",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 61",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 62",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "63번 자료면",
   "title": "일출과 일몰 사이 시간을 구해요 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-63"
    },
    {
     "type": "text",
     "text": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 63번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 63",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "일출과 일몰 사이 시간을 구해요 · 64",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각의 차는 한 시간을60분으로 바꾸어 구해요."
    },
    {
     "title": "더 알아보기",
     "text": "춘분·추분의 실제 낮길이를 정확히12시간으로 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "사이트 낮길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 천문 계산 읽기",
   "title": "같은 장소에서 날짜를 바꿔요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "text",
     "text": "표의 서울 좌표와 한국 시각을 확인해요. 두 날짜를 골라 표시된 일출·일몰의 차를 직접 구해요. 아래에는 사이트 낮길이와 내가 구한 차를 각각 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "선택 날짜",
      "일출·일몰",
      "표시 시각의 차",
      "사이트 낮길이"
     ],
     "rows": [
      [
       "",
       "",
       "",
       ""
      ],
      [
       "",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "차이와 자료 종류 설명",
     "hint": "분 단위 표시의 한계와 실제 관측이 아니라 계산 자료라는 점을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계산 자료의 같은 지점·날짜·시간대를 먼저 맞춰요."
    },
    {
     "title": "더 알아보기",
     "text": "기온·구름·실제 학생 관측은 이 천문 계산표에 없어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-kasi",
   "layout": "season-workbook"
  },
  {
   "section": "개념 5 · 네 계절의 고도와 낮길이",
   "title": "네 계절의 고도와 낮길이",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "남중 고도",
       "태양이 남쪽에 왔을 때의 고도"
      ],
      [
       "같은 장소 비교",
       "위도·경도 기준을 맞추고 날짜를 바꾼 비교"
      ],
      [
       "계절 경향",
       "여러 조건 속에서 계절별로 나타나는 일반적 관계"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "kasi-altitude"
    },
    {
     "type": "text",
     "text": "일출·일몰·남중 시각은 분 단위 표시예요. 그 남중 시각의 초를 0으로 둔 고도를 소수 첫째 자리로 나타냈어요. 정확한 남중 순간의 최댓값을 측정한 것은 아니에요."
    },
    {
     "type": "text",
     "text": "고도가 높으면 같은 빛이 좁은 면적에 퍼지고 낮이 길면 빛을 받는 시간도 길어져요. 이 관계로 계절별 받는 에너지를 설명해요. 특정한 날의 실제 기온까지 표에서 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "네 계절의 고도와 낮길이 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "다른 두 도시의 여름·겨울 고도만 비교하면 날짜 효과만 알 수 있을까요?",
     "steps": [
      [
       "함께 바뀐 조건",
       "장소와 위도가 함께 달라졌어요."
      ],
      [
       "비교 다시 정하기",
       "같은 지점의 여름·겨울 날짜로 맞춰요."
      ],
      [
       "설명 연결",
       "고도와 낮길이를 각각 읽고 에너지와 연결해요."
      ]
     ],
     "answer": "날짜 외의 위치 기준을 맞춘 뒤 계절 관계를 설명해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 65",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 66",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 67~68",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w067",
      "c22-s62-u01-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 69",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 70~71",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w070",
      "c22-s62-u01-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 72",
   "title": "순서 배열으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 73",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 74",
   "title": "복수 선택로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 75",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 76",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 77",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 78",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "79번 자료면",
   "title": "네 계절의 고도와 낮길이 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-79"
    },
    {
     "type": "text",
     "text": "한국천문연구원 계산 자료(2026-10-21 확인). 서울 같은 지점 북위37.54980°·동경126.9671°, KST+9. 고도는 남중 표시의 분 시각·초0에서 요청한 값의 소수 첫째 자리 근삿값. 학생 관측·기온 자료가 아니다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 79번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 79",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "네 계절의 고도와 낮길이 · 80",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "우리나라 같은 장소에서는 여름의 남중 고도가 높고 낮이 긴 경향이 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "표의 남중 무렵 고도는 표시 시각의 초를0으로 계산했어요. 정확한 최댓값의 실측이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 서울 지점의 두 날짜를 골라 고도·낮길이 근거를 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 계절 관계",
   "title": "두 날짜의 근거를 연결해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "kasi-altitude"
    },
    {
     "type": "field",
     "title": "나의 두 근거",
     "hint": "같은 서울 지점에서 선택한 두 날짜의 고도와 낮길이를 써요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "빛의 각과 시간으로 설명",
     "hint": "고도·낮길이→받는 빛의 각·시간→에너지 관계를 연결해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "남중 무렵 고도를 정확한 남중 순간의 최댓값으로 부르지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "계절 경향으로 특정한 날 기온을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-season",
   "layout": "season-workbook"
  },
  {
   "section": "개념 6 · 같은 빛이 퍼진 넓이를 비교해요",
   "title": "같은 빛이 퍼진 넓이를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "빛의 총량",
       "비교에서 같게 맞춘 전체 빛"
      ],
      [
       "단위 넓이",
       "한 칸처럼 같은 크기로 나눈 면적"
      ],
      [
       "빛 받는 각",
       "같은 양의 빛이 퍼지는 면적을 바꾸는 조건"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 준비한 안전한 LED와 같은 종이를 사용해요. 같은 빛 묶음·거리·시간에서 종이 면이 빛을 받는 각만 달리해 **퍼진 넓이**를 비교해요. 눈을 비추거나 고온 램프를 사용하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "연습 빛의 총량",
      "퍼진 칸 수",
      "한 칸의 양"
     ],
     "rows": [
      [
       "24단위",
       "6칸",
       "4단위"
      ],
      [
       "24단위",
       "12칸",
       "2단위"
      ]
     ]
    },
    {
     "type": "text",
     "text": "이 표는 나눔의 관계를 배우는 연습값이에요. 실제 빛의 세기·온도 측정치로 바꾸지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "같은 빛이 퍼진 넓이를 비교해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "같은30단위 빛이5칸과10칸에 퍼졌습니다. 한 칸의 양은 어떻게 달라질까요?",
     "steps": [
      [
       "같은 양 확인",
       "전체 빛은30단위로 같아요."
      ],
      [
       "나누기",
       "30÷5=6,30÷10=3이에요."
      ],
      [
       "관계 설명",
       "좁은5칸 쪽의 한 칸이 더 많은 빛을 받아요."
      ]
     ],
     "answer": "5칸에서는6단위,10칸에서는3단위예요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 81",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w081"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 82~83",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w082",
      "c22-s62-u01-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 84~85",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w084",
      "c22-s62-u01-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 86~87",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w086",
      "c22-s62-u01-w087"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 88~89",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w088",
      "c22-s62-u01-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 90~91",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w090",
      "c22-s62-u01-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 92",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 93",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 94",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "95번 자료면",
   "title": "같은 빛이 퍼진 넓이를 비교해요 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-question-data-95"
    },
    {
     "type": "text",
     "text": "같은 크기 칸에 빛이 각 경우 안에서 고르게 퍼지는 이상화 모형이다. 총36단위는 두 경우에 같고 실제 온도를 측정한 값이 아니다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 95번 질문을 읽고 필요한 시각·단위·조건을 먼저 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 95",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 빛이 퍼진 넓이를 비교해요 · 96",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 양과 시간을 맞추면 좁은 면적에 퍼질수록 한 칸이 받는 양이 많아요."
    },
    {
     "title": "더 알아보기",
     "text": "종이의 밝기만으로 실제 온도를 측정했다고 하지 않아요. LED로 기온 상승을 반드시 관찰할 수 있다는 뜻도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "빛 넓이 비교에서 바꾼 조건과 같게 한 조건을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 빛 넓이",
   "title": "같은 빛을 다른 각으로 비춰요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사의 안전한 LED를 종이에 비추고 눈에 비추지 않아요.",
      "빛 묶음·거리·종이·시간은 맞추고 받는 각을 달리해요.",
      "빛이 퍼진 자국의 넓이를 격자나 테두리로 비교해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "실제 설정",
      "퍼진 넓이·비교 근거",
      "다른 영향"
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
     "title": "그림과 설명으로 정리",
     "hint": "두 자국·같게 한 조건·한 칸의 빛 관계를 표시해요. 온도를 재지 않았다면 온도 상승을 결과로 쓰지 않아요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "더 밝아 보인다는 말과 온도계로 잰 결과를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "고온 램프·불꽃·가열은 이 활동의 준비물이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-light",
   "layout": "season-workbook"
  },
  {
   "section": "개념 7 · 같은 방향의 자전축으로 공전해요",
   "title": "같은 방향의 자전축으로 공전해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "자전축 기울기",
       "지구의 자전축이 공전 궤도면의 수직 방향에서 기울어진 상태"
      ],
      [
       "방향 유지",
       "공전 중 축이 우주에서 거의 같은 방향을 향하는 조건"
      ],
      [
       "모형 비교",
       "수직 축과 기울어진 축에서 같은 지역의 남중을 맞춰 살피는 방법"
      ]
     ]
    },
    {
     "type": "text",
     "text": "태양 모형은 중앙에 고정하고 지구의 위치를 옮겨요. **같은 지역·같은 남중 조건**을 맞추되 축을 매번 태양 쪽으로 돌리지 않아요. 수직 축일 때와 기울어진 축일 때의 고도·낮길이 관계를 비교해요."
    },
    {
     "type": "text",
     "text": "축이 기울어진 채 공전하면 우리나라가 있는 북반구가 빛을 받는 각과 시간에 계절 차이가 생겨요. 여름이 단순히 태양에 더 가까워져 생긴다고 설명하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "조작",
      "유지할 조건"
     ],
     "rows": [
      [
       "공통",
       "고정 광원·같은 지역·거리·남중 기준"
      ],
      [
       "첫 모형",
       "궤도면에 수직인 축"
      ],
      [
       "둘째 모형",
       "기울기와 우주에서의 축 방향 유지"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "같은 방향의 자전축으로 공전해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "지구의를 옮길 때마다 축을 광원 쪽으로 기울이면 올바른 계절 비교일까요?",
     "steps": [
      [
       "변한 조건 찾기",
       "축이 우주에서 향하는 방향이 계속 바뀌었어요."
      ],
      [
       "조건 고치기",
       "먼 벽의 같은 방향 표지를 이용해 축 방향을 유지해요."
      ],
      [
       "남중 다시 맞추기",
       "축 방향은 유지하고 같은 지역을 자전시켜 남중을 맞춰요."
      ]
     ],
     "answer": "축 방향 유지와 같은 지역 남중 맞추기를 서로 다른 조작으로 구별해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 97~98",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w097",
      "c22-s62-u01-w098"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 99~101",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w099",
      "c22-s62-u01-w100",
      "c22-s62-u01-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 102~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w102",
      "c22-s62-u01-w103",
      "c22-s62-u01-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w105",
      "c22-s62-u01-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 107",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 108",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 109",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 110",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 111",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "같은 방향의 자전축으로 공전해요 · 112",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울어진 자전축이 거의 같은 방향을 유지하며 공전하는 조건을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "단원 연습의 북위34°·기울기22°는 계산을 위한 임의 모형이에요. 실제 지구의 기울기나 서울 천문 계산과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "공전 위치를 옮겨도 바꾸지 않아야 할 축 조건을 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 수직 축",
   "title": "같은 지역의 남중을 맞춰요",
   "blocks": [
    {
     "type": "text",
     "text": "고정 광원·같은 반지름 네 위치·궤도면에 수직인 축을 준비해요. 같은 지역 표시를 매번 광원 쪽으로 자전시켜 남중 조건을 맞추고 빛 받는 각을 비교해요."
    },
    {
     "type": "table",
     "heads": [
      "공전 위치",
      "같은 지역의 남중 확인",
      "실제로 본 빛의 각"
     ],
     "rows": [
      [
       "P",
       "",
       ""
      ],
      [
       "Q",
       "",
       ""
      ],
      [
       "R",
       "",
       ""
      ],
      [
       "S",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "같은 관계와 모형의 한계",
     "hint": "유지한 조건과 관찰한 근거를 적어요. 유한 거리의 교실 광원은 완전한 평행광과 달라요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공전 위치를 옮기는 것과 남중을 맞추는 자전을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "축 수직 모형과 실제 지구를 같은 조건이라고 하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-vertical",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 기울어진 축",
   "title": "축 방향은 유지하며 옮겨요",
   "blocks": [
    {
     "type": "text",
     "text": "같은 장치에서 축을 기울이고 먼 벽의 방향 표지를 기준으로 축 방향을 유지해요. 매번 같은 지역의 남중을 맞추되 축을 광원 쪽으로 다시 돌리지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "공전 위치",
      "축 방향 유지",
      "남중 기준·빛의 각"
     ],
     "rows": [
      [
       "P",
       "",
       ""
      ],
      [
       "Q",
       "",
       ""
      ],
      [
       "R",
       "",
       ""
      ],
      [
       "S",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "두 축 조건 비교",
     "hint": "같은 위치·지역의 수직 축 기록과 나란히 비교해요. 예상과 달랐던 결과도 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기울기·방향 유지·공전이 함께 작용해요."
    },
    {
     "title": "더 알아보기",
     "text": "단순화한 빛 경계와 실제 하루 낮길이가 완전히 같지는 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-tilted",
   "layout": "season-workbook"
  },
  {
   "section": "개념 8 · 근거를 이어 계절을 설명해요",
   "title": "근거를 이어 계절을 설명해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "주장",
       "자료로 설명하려는 계절 관계"
      ],
      [
       "근거",
       "같은 장소·조건이 드러난 고도와 낮길이의 값"
      ],
      [
       "설명 보완",
       "원기록을 보존하고 질문에 맞춰 근거와 설명을 다시 확인하는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "짧은 한 장에도 **주장·조건·두 근거·원인**이 이어지게 설명해요. 직접 측정한 기록, 천문 계산, 제공 연습표와 교실 모형을 구별하고 출처를 적어요."
    },
    {
     "type": "text",
     "text": "불분명하거나 기대와 다른 관찰은 그대로 남겨요. 친구 질문을 받으면 처음 자료와 수정한 부분을 나란히 확인해요. 긴 탐구보고서가 기본 과제는 아니에요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "season-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "근거를 이어 계절을 설명해요 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "겨울의 어느 날이 여름의 어느 날보다 따뜻했습니다. 계절 원인이 틀렸다는 뜻일까요?",
     "steps": [
      [
       "설명 범위",
       "계절의 일반 경향과 특정한 날의 날씨는 달라요."
      ],
      [
       "근거 나누기",
       "고도·낮길이와 그날의 구름·바람·기온을 구별해요."
      ],
      [
       "주장 보완",
       "계절별 에너지 경향을 말하되 모든 날 기온을 확정하지 않아요."
      ]
     ],
     "answer": "단일한 기온 예외로 고도·낮길이와 자전축의 관계를 없애지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 113",
   "title": "객관식로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w113"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 114~115",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w114",
      "c22-s62-u01-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 116~117",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w116",
      "c22-s62-u01-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 118~119",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w118",
      "c22-s62-u01-w119"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 120~121",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w120",
      "c22-s62-u01-w121"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 122~123",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w122",
      "c22-s62-u01-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 124",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 125",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 126",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 127",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "근거를 이어 계절을 설명해요 · 128",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u01-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "축·공전 → 고도와 낮길이 → 받는 에너지를 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 날짜라도 반구·장소에 따라 계절 관계가 달라요. 북반구 여름을 전 지구의 여름으로 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 한 장 설명에서 근거가 부족한 곳과 다음 확인 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑩ · 설명 카드",
   "title": "주장과 두 근거를 한 장에 담아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 장소 두 날짜의 자료나 실제 측정 근거를 골라요.",
      "계산/실측/연습/모형을 구별하고 조건과 출처를 써요.",
      "축과 공전·고도와 낮길이·받는 에너지를 연결해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "내 한 장 설명의 배치",
     "hint": "주장·두 근거·원인·남은 질문·수정할 공간을 크게 배치하고 실제로 만들어요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "장식보다 조건과 근거가 읽히는지 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "긴 탐구보고서 대신 교실에서 설명할 한 장 자료를 만들어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-card",
   "layout": "season-workbook"
  },
  {
   "section": "실제 활동 ⑪ · 나눔과 보완",
   "title": "받은 질문으로 설명을 고쳐요",
   "blocks": [
    {
     "type": "field",
     "title": "실제로 설명한 내용과 받은 질문",
     "hint": "아직 설명하지 않았다면 미실시 상태와 예상 질문을 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "원래 근거·다시 확인한 것·수정",
     "hint": "처음 기록을 남기고 고친 부분·이유와 다시 설명한 내용을 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예시 답안을 쓴 것과 실제 제작·설명을 마친 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "외부 게시나 메시지는 기본 과제로 요구하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "layout": "season-workbook"
  },
  {
   "section": "단원 정리",
   "title": "조건에서 계절의 원인까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "근거",
      "함께 설명할 관계"
     ],
     "rows": [
      [
       "같은 하루의 고도·그림자·기온",
       "고도와 그림자, 고도 최고와 기온 최고 시각"
      ],
      [
       "같은 지점의 두 날짜 자료",
       "남중 고도·낮길이와 계절 경향"
      ],
      [
       "수직 축·기울어진 축 모형",
       "축 방향 유지와 공전, 빛의 각과 시간"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 것",
     "hint": "확인한 근거·설명·남은 질문을 연결해 적어요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세 성취기준6과13-01~03을 자료와 활동으로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "모형 조건의 결론을 실제 모든 장소·날씨로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "season-workbook"
  },
  {
   "section": "단원 수행평가 · 6과13-01",
   "title": "측정기와 하루의 관계",
   "blocks": [
    {
     "type": "text",
     "text": "수평·수직 기준의 측정기를 실제로 만들고 안전한 간접 방법으로 두 시각 이상 관측해요. 고도·그림자·기온을 시각과 단위로 남기고 실제 관계를 설명해요."
    },
    {
     "type": "field",
     "title": "장치 조건·실제 기록·미측정 상태",
     "hint": "실제로 한 일·자료 종류·조건과 불분명한 부분을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 측정기 그림과 실제로 확인한 관계",
     "hint": "말·표·그림의 연결이 보이게 설명하고 남은 질문을 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 과정을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 실제 자료·조작·설명을 보고 피드백해요. 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "season-workbook"
  },
  {
   "section": "단원 수행평가 · 6과13-02",
   "title": "같은 장소 두 날짜의 근거",
   "blocks": [
    {
     "type": "text",
     "text": "같은 서울 지점의 계산 자료에서 두 날짜를 골라 고도와 낮길이를 비교해요. 표시 시각의 뺄셈과 사이트 낮길이를 각각 적고 계절별 관계를 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "날짜·좌표·시간대와 두 근거",
     "hint": "실제로 한 일·자료 종류·조건과 불분명한 부분을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "고도·낮길이→받는 각·시간→계절 경향",
     "hint": "말·표·그림의 연결이 보이게 설명하고 남은 질문을 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 과정을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 실제 자료·조작·설명을 보고 피드백해요. 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "season-workbook"
  },
  {
   "section": "단원 수행평가 · 6과13-03",
   "title": "축과 공전 모형의 설명",
   "blocks": [
    {
     "type": "text",
     "text": "교사와 실제 장치에서 수직 축과 기울어진 축을 비교해요. 같은 지역·남중·광원 조건과 축 방향을 유지한 실제 관찰 근거로 계절 원인을 설명해요."
    },
    {
     "type": "field",
     "title": "수직/기울어진 축 조작과 실제 관찰",
     "hint": "실제로 한 일·자료 종류·조건과 불분명한 부분을 적어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "축·공전에서 빛의 각·시간까지 이어 설명",
     "hint": "말·표·그림의 연결이 보이게 설명하고 남은 질문을 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 과정을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "교사가 실제 자료·조작·설명을 보고 피드백해요. 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "season-workbook"
  },
  {
   "kind": "duplex-blank",
   "layout": "season-workbook"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w001",
      "c22-s62-u01-w002",
      "c22-s62-u01-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 4~6",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w004",
      "c22-s62-u01-w005",
      "c22-s62-u01-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 7~9",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w007",
      "c22-s62-u01-w008",
      "c22-s62-u01-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 10~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w010",
      "c22-s62-u01-w011",
      "c22-s62-u01-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 13~14",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w013",
      "c22-s62-u01-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 15~16",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w015",
      "c22-s62-u01-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 17~19",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w017",
      "c22-s62-u01-w018",
      "c22-s62-u01-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 20~22",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w020",
      "c22-s62-u01-w021",
      "c22-s62-u01-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 23~25",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w023",
      "c22-s62-u01-w024",
      "c22-s62-u01-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 26~28",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w026",
      "c22-s62-u01-w027",
      "c22-s62-u01-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 29~30",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w029",
      "c22-s62-u01-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 31~31",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 32~33",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w032",
      "c22-s62-u01-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 34~36",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w034",
      "c22-s62-u01-w035",
      "c22-s62-u01-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 37~39",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w037",
      "c22-s62-u01-w038",
      "c22-s62-u01-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 40~42",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w040",
      "c22-s62-u01-w041",
      "c22-s62-u01-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 43~44",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w043",
      "c22-s62-u01-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 45~46",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w045",
      "c22-s62-u01-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 47~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w047",
      "c22-s62-u01-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 49~51",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w049",
      "c22-s62-u01-w050",
      "c22-s62-u01-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 52~54",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w052",
      "c22-s62-u01-w053",
      "c22-s62-u01-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 55~57",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w055",
      "c22-s62-u01-w056",
      "c22-s62-u01-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 58~60",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w058",
      "c22-s62-u01-w059",
      "c22-s62-u01-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 61~62",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w061",
      "c22-s62-u01-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 63~64",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w063",
      "c22-s62-u01-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 65~67",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w065",
      "c22-s62-u01-w066",
      "c22-s62-u01-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 68~70",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w068",
      "c22-s62-u01-w069",
      "c22-s62-u01-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 71~73",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w071",
      "c22-s62-u01-w072",
      "c22-s62-u01-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 74~76",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w074",
      "c22-s62-u01-w075",
      "c22-s62-u01-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 77~78",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w077",
      "c22-s62-u01-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 79~80",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w079",
      "c22-s62-u01-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 81~83",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w081",
      "c22-s62-u01-w082",
      "c22-s62-u01-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 84~86",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w084",
      "c22-s62-u01-w085",
      "c22-s62-u01-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 87~89",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w087",
      "c22-s62-u01-w088",
      "c22-s62-u01-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 90~92",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w090",
      "c22-s62-u01-w091",
      "c22-s62-u01-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 93~94",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w093",
      "c22-s62-u01-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 95~96",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w095",
      "c22-s62-u01-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 97~99",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w097",
      "c22-s62-u01-w098",
      "c22-s62-u01-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 100~102",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w100",
      "c22-s62-u01-w101",
      "c22-s62-u01-w102"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 103~105",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w103",
      "c22-s62-u01-w104",
      "c22-s62-u01-w105"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 106~108",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w106",
      "c22-s62-u01-w107",
      "c22-s62-u01-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 109~110",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w109",
      "c22-s62-u01-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 111~112",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w111",
      "c22-s62-u01-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 113~115",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w113",
      "c22-s62-u01-w114",
      "c22-s62-u01-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 116~118",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w116",
      "c22-s62-u01-w117",
      "c22-s62-u01-w118"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 119~121",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w119",
      "c22-s62-u01-w120",
      "c22-s62-u01-w121"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 122~124",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w122",
      "c22-s62-u01-w123",
      "c22-s62-u01-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 125~125",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 126~127",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w126",
      "c22-s62-u01-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 128~128",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u01-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건·부분 대응·단위를 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 타당한 설명·설계는 교사가 근거로 확인해요. 문장만으로 실측·제작 수행을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과13-01",
   "title": "측정기와 하루의 관계",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "수평·수직 기준의 측정기를 실제로 만들고 안전한 간접 방법으로 두 시각 이상 관측해요. 고도·그림자·기온을 시각과 단위로 남기고 실제 관계를 설명해요."
    },
    {
     "type": "text",
     "text": "수평면 기준 고도와 수직 막대 기준 각을 구별해요. 반복값이 같아도 장치 오차는 남을 수 있어요."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "실제 수행 근거·아직 못 확인한 부분과 다음 피드백을 나누어 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "미실시·불분명·예상과 다른 결과를 자동 오답이나 수행 완료로 바꾸지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과13-02",
   "title": "같은 장소 두 날짜의 근거",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "같은 서울 지점의 계산 자료에서 두 날짜를 골라 고도와 낮길이를 비교해요. 표시 시각의 뺄셈과 사이트 낮길이를 각각 적고 계절별 관계를 근거로 설명해요."
    },
    {
     "type": "text",
     "text": "같은 장소의 계절 경향과 어느 하루의 실제 기온은 다르게 설명해요. 다른 위도의 값을 섞지 않아요."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "실제 수행 근거·아직 못 확인한 부분과 다음 피드백을 나누어 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "미실시·불분명·예상과 다른 결과를 자동 오답이나 수행 완료로 바꾸지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과13-03",
   "title": "축과 공전 모형의 설명",
   "kind": "answers",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "교사와 실제 장치에서 수직 축과 기울어진 축을 비교해요. 같은 지역·남중·광원 조건과 축 방향을 유지한 실제 관찰 근거로 계절 원인을 설명해요."
    },
    {
     "type": "text",
     "text": "축이 기울어진 채 우주에서 거의 같은 방향을 유지하는 조건과 공전을 함께 설명해요. 매번 축을 태양 쪽으로 돌리지 않아요."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "실제 수행 근거·아직 못 확인한 부분과 다음 피드백을 나누어 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "미실시·불분명·예상과 다른 결과를 자동 오답이나 수행 완료로 바꾸지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
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
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-quick-0"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "25~48번",
   "kind": "quick",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-quick-24"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "49~72번",
   "kind": "quick",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-quick-48"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "73~96번",
   "kind": "quick",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-quick-72"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "97~120번",
   "kind": "quick",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-quick-96"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "121~128번",
   "kind": "quick",
   "layout": "season-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "season-quick-120"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부분답·단위와 열린 답의 인정 기준은 정답·해설에서 읽어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같게 한 조건·달리한 조건과 내 설명의 근거를 적어요.",
     "write": 5
    }
   ]
  }
 ],
 "figures": {
  "materials": "<div class=\"season-book-photo\"><img src=\"../assets/activities/c22-s62-u01/measurement-materials.webp\" alt=\"흰 받침판·나무 막대·실·테이프·연필의 준비 재료 예\" loading=\"eager\"><p class=\"season-book-photo-caption\">일부 준비물의 배치를 살펴봐요. 각도기·길이 측정 도구·기온계는 따로 준비해요. 사진에서 각도나 길이를 읽지 않아요.<small>준비 참고 자료 · 실제 우리 반의 제작·관측 결과는 따로 확인해요.</small></p></div>",
  "kasi-times": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 한국 시각 · 일몰−일출은 표시 시각으로 구한 근삿값</caption><thead><tr><th scope=\"col\">날짜(2026년)</th><th scope=\"col\">일출</th><th scope=\"col\">남중 시각</th><th scope=\"col\">일몰</th><th scope=\"col\">표시 시각의 차</th></tr></thead><tbody><tr><th scope=\"row\">03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>12시간 7분</td></tr><tr><th scope=\"row\">06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>14시간 45분</td></tr><tr><th scope=\"row\">09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>12시간 8분</td></tr><tr><th scope=\"row\">12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>9시간 34분</td></tr></tbody></table>",
  "kasi-altitude": "<table class=\"ed-table season-book-table\"><caption>사이트가 따로 표시한 낮길이와 시각 뺄셈 값을 구별해요. 봄·겨울의 1분 차이를 고치거나 합치지 않아요.</caption><thead><tr><th scope=\"col\">날짜(2026년)</th><th scope=\"col\">남중 무렵 고도</th><th scope=\"col\">사이트 낮길이</th><th scope=\"col\">표시 시각의 차</th></tr></thead><tbody><tr><th scope=\"row\">03-20</th><td>52.3°</td><td>12시간 6분</td><td>12시간 7분</td></tr><tr><th scope=\"row\">06-21</th><td>75.9°</td><td>14시간 45분</td><td>14시간 45분</td></tr><tr><th scope=\"row\">09-23</th><td>52.4°</td><td>12시간 8분</td><td>12시간 8분</td></tr><tr><th scope=\"row\">12-22</th><td>29.0°</td><td>9시간 33분</td><td>9시간 34분</td></tr></tbody></table>",
  "sources": "<div class=\"season-book-sources\"><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://astro.kasi.re.kr/kor/life/pageView/9\">한국천문연구원 · 일출·일몰 계산 자료 ↗</a><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://astro.kasi.re.kr/kor/life/pageView/10\">한국천문연구원 · 태양 고도·방위각 계산 자료 ↗</a><p>서울특별시 · 동경 126도 58분 1초 / 북위 37도 32분 59초 · KST (UTC+9) · 자료 확인일 2026-10-21</p></div>",
  "season-question-data-11": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">장치</th><th scope=\"col\">실과 수직 막대 사이의 안쪽 각</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>32°</td></tr><tr><th scope=\"row\">Q</th><td>54°</td></tr></tbody></table>",
  "season-question-data-12": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">읽은 사람</th><th scope=\"col\">첫 읽기</th><th scope=\"col\">둘째 읽기</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>43°</td><td>45°</td></tr><tr><th scope=\"row\">Q</th><td>44°</td><td>44°</td></tr></tbody></table>",
  "season-question-data-17": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-21": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-24": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-25": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-27": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-28": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각(KST)</th><th scope=\"col\">고도</th></tr></thead><tbody><tr><th scope=\"row\">10:15</th><td>41°</td></tr><tr><th scope=\"row\">11:15</th><td>53°</td></tr><tr><th scope=\"row\">12:15</th><td>62°</td></tr><tr><th scope=\"row\">13:15</th><td>60°</td></tr><tr><th scope=\"row\">14:15</th><td>49°</td></tr></tbody></table>",
  "season-question-data-29": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-31": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-34": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-36": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-40": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-41": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-43": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-44": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-45": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-47": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">태양 고도(°)</th><th scope=\"col\">그림자(cm)</th><th scope=\"col\">기온(℃)</th></tr></thead><tbody><tr><th scope=\"row\">09:50</th><td>25</td><td>42.9</td><td>17</td></tr><tr><th scope=\"row\">10:50</th><td>40</td><td>23.8</td><td>19</td></tr><tr><th scope=\"row\">11:50</th><td>55</td><td>14</td><td>22</td></tr><tr><th scope=\"row\">12:50</th><td>60</td><td>11.5</td><td>24</td></tr><tr><th scope=\"row\">13:50</th><td>55</td><td>14</td><td>26</td></tr><tr><th scope=\"row\">14:50</th><td>40</td><td>23.8</td><td>27</td></tr><tr><th scope=\"row\">15:50</th><td>25</td><td>42.9</td><td>25</td></tr></tbody></table>",
  "season-question-data-49": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-50": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-51": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-53": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-56": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-57": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-58": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-59": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-60": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-61": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-63": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-65": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-66": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-67": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-69": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">위치</th><th scope=\"col\">남중 고도</th><th scope=\"col\">낮길이의 비교</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>높음</td><td>김</td></tr><tr><th scope=\"row\">Q</th><td>낮음</td><td>짧음</td></tr><tr><th scope=\"row\">R</th><td>중간</td><td>중간</td></tr></tbody></table>",
  "season-question-data-71": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-73": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-75": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-76": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">위치</th><th scope=\"col\">남중 고도</th><th scope=\"col\">낮길이의 비교</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>높음</td><td>김</td></tr><tr><th scope=\"row\">Q</th><td>낮음</td><td>짧음</td></tr><tr><th scope=\"row\">R</th><td>중간</td><td>중간</td></tr></tbody></table>",
  "season-question-data-77": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-78": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-79": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-question-data-81": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">1분 동안 받은 총에너지(모형 단위)</th><th scope=\"col\">빛이 퍼진 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>36</td><td>6</td></tr><tr><th scope=\"row\">Q</th><td>36</td><td>12</td></tr></tbody></table>",
  "season-question-data-83": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">1분 동안 받은 총에너지(모형 단위)</th><th scope=\"col\">빛이 퍼진 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>36</td><td>6</td></tr><tr><th scope=\"row\">Q</th><td>36</td><td>12</td></tr></tbody></table>",
  "season-question-data-86": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">1분 동안 받은 총에너지(모형 단위)</th><th scope=\"col\">빛이 퍼진 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>36</td><td>6</td></tr><tr><th scope=\"row\">Q</th><td>36</td><td>12</td></tr></tbody></table>",
  "season-question-data-89": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">1분 동안 받은 총에너지(모형 단위)</th><th scope=\"col\">빛이 퍼진 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>36</td><td>6</td></tr><tr><th scope=\"row\">Q</th><td>36</td><td>12</td></tr></tbody></table>",
  "season-question-data-91": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">1분 동안 받은 총에너지(모형 단위)</th><th scope=\"col\">빛이 퍼진 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>36</td><td>6</td></tr><tr><th scope=\"row\">Q</th><td>36</td><td>12</td></tr></tbody></table>",
  "season-question-data-92": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">총에너지</th><th scope=\"col\">같은 크기 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">R</th><td>36단위</td><td>9</td></tr><tr><th scope=\"row\">S</th><td>36단위</td><td>18</td></tr></tbody></table>",
  "season-question-data-93": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">1분 동안 받은 총에너지(모형 단위)</th><th scope=\"col\">빛이 퍼진 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>36</td><td>6</td></tr><tr><th scope=\"row\">Q</th><td>36</td><td>12</td></tr></tbody></table>",
  "season-question-data-95": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">경우</th><th scope=\"col\">1분 동안 받은 총에너지(모형 단위)</th><th scope=\"col\">빛이 퍼진 칸 수</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>36</td><td>6</td></tr><tr><th scope=\"row\">Q</th><td>36</td><td>12</td></tr></tbody></table>",
  "season-question-data-107": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">위치</th><th scope=\"col\">남중고도</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>56°</td></tr><tr><th scope=\"row\">Q</th><td>(1)</td></tr><tr><th scope=\"row\">R</th><td>56°</td></tr><tr><th scope=\"row\">S</th><td>(2)</td></tr></tbody></table>",
  "season-question-data-108": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">위치</th><th scope=\"col\">남중고도</th></tr></thead><tbody><tr><th scope=\"row\">P</th><td>56°</td></tr><tr><th scope=\"row\">Q</th><td>78°</td></tr><tr><th scope=\"row\">R</th><td>56°</td></tr><tr><th scope=\"row\">S</th><td>34°</td></tr></tbody></table>",
  "season-question-data-123": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">빛고도</th><th scope=\"col\">창하단에서 온 광선이 바닥에 닿는 수평 깊이</th></tr></thead><tbody><tr><th scope=\"row\">35°</th><td>171.4cm</td></tr><tr><th scope=\"row\">65°</th><td>56.0cm</td></tr></tbody></table>",
  "season-question-data-124": "<table class=\"ed-table season-book-table\"><caption>제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">자료</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>같은 서울 좌표·네 날짜·KST의 공식 일출/일몰 계산표</td></tr><tr><th scope=\"row\">ㄴ</th><td>날짜·시각·도구·관측 과정을 갖춘 우리 반 실측표</td></tr><tr><th scope=\"row\">ㄷ</th><td>임의의 시분 뺄셈 연습표</td></tr></tbody></table>",
  "season-question-data-125": "<table class=\"ed-table season-book-table\"><caption>한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요.</caption><thead><tr><th scope=\"col\">날짜</th><th scope=\"col\">일출(KST)</th><th scope=\"col\">남중 표시(KST)</th><th scope=\"col\">일몰(KST)</th><th scope=\"col\">남중 무렵 고도(°)</th></tr></thead><tbody><tr><th scope=\"row\">2026-03-20</th><td>06:36</td><td>12:39</td><td>18:43</td><td>52.3</td></tr><tr><th scope=\"row\">2026-06-21</th><td>05:11</td><td>12:33</td><td>19:56</td><td>75.9</td></tr><tr><th scope=\"row\">2026-09-23</th><td>06:20</td><td>12:24</td><td>18:28</td><td>52.4</td></tr><tr><th scope=\"row\">2026-12-22</th><td>07:43</td><td>12:30</td><td>17:17</td><td>29.0</td></tr></tbody></table>",
  "season-quick-0": "<div class=\"season-quick-grid\"><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">2</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">3</th><td>빈칸 넣기</td><td>수평면 / 직각</td></tr><tr><th scope=\"row\">4</th><td>빈칸 넣기</td><td>고정 / 비교</td></tr><tr><th scope=\"row\">5</th><td>연결하기</td><td>ㄱ / ㄷ / ㄴ</td></tr><tr><th scope=\"row\">6</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">7</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">8</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">9</th><td>복수 선택</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">10</th><td>복수 선택</td><td>①, ③</td></tr><tr><th scope=\"row\">11</th><td>자료 해석</td><td>58° / 36°</td></tr><tr><th scope=\"row\">12</th><td>자료 해석</td><td>2° / 0°</td></tr></tbody></table><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">13</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">14</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">15</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">16</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">18</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">19</th><td>빈칸 넣기</td><td>짧아진다 / 남중</td></tr><tr><th scope=\"row\">20</th><td>빈칸 넣기</td><td>시각 / °</td></tr><tr><th scope=\"row\">21</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">22</th><td>연결하기</td><td>ㄷ / ㄴ / ㄱ</td></tr><tr><th scope=\"row\">23</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">24</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr></tbody></table></div>",
  "season-quick-24": "<div class=\"season-quick-grid\"><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">25</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">26</th><td>복수 선택</td><td>②, ⑤</td></tr><tr><th scope=\"row\">27</th><td>자료 해석</td><td>20° / 12.3cm</td></tr><tr><th scope=\"row\">28</th><td>자료 해석</td><td>62° / 12:15</td></tr><tr><th scope=\"row\">29</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">30</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">31</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">32</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">33</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">34</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">35</th><td>빈칸 넣기</td><td>표면 온도 / 기온</td></tr><tr><th scope=\"row\">36</th><td>빈칸 넣기</td><td>12:50 / 14:50</td></tr></tbody></table><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">37</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">38</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">39</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">40</th><td>순서 배열</td><td>ㄱ → ㄷ → ㄴ</td></tr><tr><th scope=\"row\">41</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">42</th><td>복수 선택</td><td>②, ④</td></tr><tr><th scope=\"row\">43</th><td>자료 해석</td><td>7℃ / 3℃</td></tr><tr><th scope=\"row\">44</th><td>자료 해석</td><td>120분 / 3℃</td></tr><tr><th scope=\"row\">45</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">46</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">47</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">48</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "season-quick-48": "<div class=\"season-quick-grid\"><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">49</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">50</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">51</th><td>빈칸 넣기</td><td>12 / 8</td></tr><tr><th scope=\"row\">52</th><td>빈칸 넣기</td><td>일몰 시각 / 일출 시각</td></tr><tr><th scope=\"row\">53</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">54</th><td>연결하기</td><td>ㄴ / ㄱ / ㄷ</td></tr><tr><th scope=\"row\">55</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">56</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">57</th><td>복수 선택</td><td>②, ⑤</td></tr><tr><th scope=\"row\">58</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">59</th><td>자료 해석</td><td>727분 / 574분</td></tr><tr><th scope=\"row\">60</th><td>자료 해석</td><td>311분 / 1분</td></tr></tbody></table><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">61</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">62</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">63</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">66</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">67</th><td>빈칸 넣기</td><td>높다 / 길다</td></tr><tr><th scope=\"row\">68</th><td>빈칸 넣기</td><td>같게 / 날짜</td></tr><tr><th scope=\"row\">69</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">70</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">71</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">72</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr></tbody></table></div>",
  "season-quick-72": "<div class=\"season-quick-grid\"><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">73</th><td>복수 선택</td><td>①, ④</td></tr><tr><th scope=\"row\">74</th><td>복수 선택</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">75</th><td>자료 해석</td><td>46.9° / 0.1°</td></tr><tr><th scope=\"row\">76</th><td>자료 해석</td><td>Q / P</td></tr><tr><th scope=\"row\">77</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">78</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">79</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">82</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">83</th><td>빈칸 넣기</td><td>적다 / 같다</td></tr><tr><th scope=\"row\">84</th><td>빈칸 넣기</td><td>태양 / 지표면</td></tr></tbody></table><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">86</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">87</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">88</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">89</th><td>복수 선택</td><td>①, ③, ⑤</td></tr><tr><th scope=\"row\">90</th><td>복수 선택</td><td>②, ④</td></tr><tr><th scope=\"row\">91</th><td>자료 해석</td><td>6단위/칸 / 3단위/칸</td></tr><tr><th scope=\"row\">92</th><td>자료 해석</td><td>4단위/칸 / 2단위/칸</td></tr><tr><th scope=\"row\">93</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">94</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">95</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "season-quick-96": "<div class=\"season-quick-grid\"><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">97</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">98</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">99</th><td>빈칸 넣기</td><td>자전축 / 공전</td></tr><tr><th scope=\"row\">100</th><td>빈칸 넣기</td><td>궤도면 / 같게</td></tr><tr><th scope=\"row\">101</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">102</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">103</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">104</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">105</th><td>복수 선택</td><td>②, ④, ⑤</td></tr><tr><th scope=\"row\">106</th><td>복수 선택</td><td>①, ④</td></tr><tr><th scope=\"row\">107</th><td>자료 해석</td><td>56° / 56°</td></tr><tr><th scope=\"row\">108</th><td>자료 해석</td><td>Q / 44°</td></tr></tbody></table><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">109</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">110</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">111</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">112</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">113</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">114</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">115</th><td>빈칸 넣기</td><td>길어 / 에너지</td></tr><tr><th scope=\"row\">116</th><td>빈칸 넣기</td><td>종류 / 미측정</td></tr><tr><th scope=\"row\">117</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">118</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">119</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">120</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr></tbody></table></div>",
  "season-quick-120": "<div class=\"season-quick-grid\"><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">121</th><td>복수 선택</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">122</th><td>복수 선택</td><td>②, ④, ⑤</td></tr><tr><th scope=\"row\">123</th><td>자료 해석</td><td>171.4cm / 115.4cm</td></tr><tr><th scope=\"row\">124</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr></tbody></table><table class=\"ed-table season-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">125</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">126</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">127</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">128</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>"
 },
 "figureModels": {
  "materials": {
   "kind": "photo",
   "src": "../assets/activities/c22-s62-u01/measurement-materials.webp",
   "alt": "흰 받침판·나무 막대·실·테이프·연필의 준비 재료 예",
   "caption": "일부 준비물의 배치를 살펴봐요. 각도기·길이 측정 도구·기온계는 따로 준비해요. 사진에서 각도나 길이를 읽지 않아요.",
   "credit": "준비 참고 자료 · 실제 우리 반의 제작·관측 결과는 따로 확인해요."
  },
  "kasi-times": {
   "kind": "table",
   "heads": [
    "날짜(2026년)",
    "일출",
    "남중 시각",
    "일몰",
    "표시 시각의 차"
   ],
   "rows": [
    [
     "03-20",
     "06:36",
     "12:39",
     "18:43",
     "12시간 7분"
    ],
    [
     "06-21",
     "05:11",
     "12:33",
     "19:56",
     "14시간 45분"
    ],
    [
     "09-23",
     "06:20",
     "12:24",
     "18:28",
     "12시간 8분"
    ],
    [
     "12-22",
     "07:43",
     "12:30",
     "17:17",
     "9시간 34분"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 한국 시각 · 일몰−일출은 표시 시각으로 구한 근삿값"
  },
  "kasi-altitude": {
   "kind": "table",
   "heads": [
    "날짜(2026년)",
    "남중 무렵 고도",
    "사이트 낮길이",
    "표시 시각의 차"
   ],
   "rows": [
    [
     "03-20",
     "52.3°",
     "12시간 6분",
     "12시간 7분"
    ],
    [
     "06-21",
     "75.9°",
     "14시간 45분",
     "14시간 45분"
    ],
    [
     "09-23",
     "52.4°",
     "12시간 8분",
     "12시간 8분"
    ],
    [
     "12-22",
     "29.0°",
     "9시간 33분",
     "9시간 34분"
    ]
   ],
   "caption": "사이트가 따로 표시한 낮길이와 시각 뺄셈 값을 구별해요. 봄·겨울의 1분 차이를 고치거나 합치지 않아요."
  },
  "sources": {
   "kind": "source-links",
   "links": [
    {
     "label": "일출·일몰 계산 자료",
     "url": "https://astro.kasi.re.kr/kor/life/pageView/9"
    },
    {
     "label": "태양 고도·방위각 계산 자료",
     "url": "https://astro.kasi.re.kr/kor/life/pageView/10"
    }
   ],
   "caption": "서울특별시 · 동경 126도 58분 1초 / 북위 37도 32분 59초 · KST (UTC+9) · 자료 확인일 2026-10-21"
  },
  "season-question-data-11": {
   "kind": "table",
   "heads": [
    "장치",
    "실과 수직 막대 사이의 안쪽 각"
   ],
   "rows": [
    [
     "P",
     "32°"
    ],
    [
     "Q",
     "54°"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-12": {
   "kind": "table",
   "heads": [
    "읽은 사람",
    "첫 읽기",
    "둘째 읽기"
   ],
   "rows": [
    [
     "P",
     "43°",
     "45°"
    ],
    [
     "Q",
     "44°",
     "44°"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-17": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-21": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-24": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-25": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-27": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-28": {
   "kind": "table",
   "heads": [
    "시각(KST)",
    "고도"
   ],
   "rows": [
    [
     "10:15",
     "41°"
    ],
    [
     "11:15",
     "53°"
    ],
    [
     "12:15",
     "62°"
    ],
    [
     "13:15",
     "60°"
    ],
    [
     "14:15",
     "49°"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-29": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-31": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-34": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-36": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-40": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-41": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-43": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-44": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-45": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-47": {
   "kind": "table",
   "heads": [
    "시각",
    "태양 고도(°)",
    "그림자(cm)",
    "기온(℃)"
   ],
   "rows": [
    [
     "09:50",
     25,
     42.9,
     17
    ],
    [
     "10:50",
     40,
     23.8,
     19
    ],
    [
     "11:50",
     55,
     14,
     22
    ],
    [
     "12:50",
     60,
     11.5,
     24
    ],
    [
     "13:50",
     55,
     14,
     26
    ],
    [
     "14:50",
     40,
     23.8,
     27
    ],
    [
     "15:50",
     25,
     42.9,
     25
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-49": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-50": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-51": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-53": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-56": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-57": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-58": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-59": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-60": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-61": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-63": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-65": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-66": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-67": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-69": {
   "kind": "table",
   "heads": [
    "위치",
    "남중 고도",
    "낮길이의 비교"
   ],
   "rows": [
    [
     "P",
     "높음",
     "김"
    ],
    [
     "Q",
     "낮음",
     "짧음"
    ],
    [
     "R",
     "중간",
     "중간"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-71": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-73": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-75": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-76": {
   "kind": "table",
   "heads": [
    "위치",
    "남중 고도",
    "낮길이의 비교"
   ],
   "rows": [
    [
     "P",
     "높음",
     "김"
    ],
    [
     "Q",
     "낮음",
     "짧음"
    ],
    [
     "R",
     "중간",
     "중간"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-77": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-78": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-79": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-question-data-81": {
   "kind": "table",
   "heads": [
    "경우",
    "1분 동안 받은 총에너지(모형 단위)",
    "빛이 퍼진 칸 수"
   ],
   "rows": [
    [
     "P",
     36,
     6
    ],
    [
     "Q",
     36,
     12
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-83": {
   "kind": "table",
   "heads": [
    "경우",
    "1분 동안 받은 총에너지(모형 단위)",
    "빛이 퍼진 칸 수"
   ],
   "rows": [
    [
     "P",
     36,
     6
    ],
    [
     "Q",
     36,
     12
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-86": {
   "kind": "table",
   "heads": [
    "경우",
    "1분 동안 받은 총에너지(모형 단위)",
    "빛이 퍼진 칸 수"
   ],
   "rows": [
    [
     "P",
     36,
     6
    ],
    [
     "Q",
     36,
     12
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-89": {
   "kind": "table",
   "heads": [
    "경우",
    "1분 동안 받은 총에너지(모형 단위)",
    "빛이 퍼진 칸 수"
   ],
   "rows": [
    [
     "P",
     36,
     6
    ],
    [
     "Q",
     36,
     12
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-91": {
   "kind": "table",
   "heads": [
    "경우",
    "1분 동안 받은 총에너지(모형 단위)",
    "빛이 퍼진 칸 수"
   ],
   "rows": [
    [
     "P",
     36,
     6
    ],
    [
     "Q",
     36,
     12
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-92": {
   "kind": "table",
   "heads": [
    "경우",
    "총에너지",
    "같은 크기 칸 수"
   ],
   "rows": [
    [
     "R",
     "36단위",
     9
    ],
    [
     "S",
     "36단위",
     18
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-93": {
   "kind": "table",
   "heads": [
    "경우",
    "1분 동안 받은 총에너지(모형 단위)",
    "빛이 퍼진 칸 수"
   ],
   "rows": [
    [
     "P",
     36,
     6
    ],
    [
     "Q",
     36,
     12
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-95": {
   "kind": "table",
   "heads": [
    "경우",
    "1분 동안 받은 총에너지(모형 단위)",
    "빛이 퍼진 칸 수"
   ],
   "rows": [
    [
     "P",
     36,
     6
    ],
    [
     "Q",
     36,
     12
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-107": {
   "kind": "table",
   "heads": [
    "위치",
    "남중고도"
   ],
   "rows": [
    [
     "P",
     "56°"
    ],
    [
     "Q",
     "(1)"
    ],
    [
     "R",
     "56°"
    ],
    [
     "S",
     "(2)"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-108": {
   "kind": "table",
   "heads": [
    "위치",
    "남중고도"
   ],
   "rows": [
    [
     "P",
     "56°"
    ],
    [
     "Q",
     "78°"
    ],
    [
     "R",
     "56°"
    ],
    [
     "S",
     "34°"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-123": {
   "kind": "table",
   "heads": [
    "빛고도",
    "창하단에서 온 광선이 바닥에 닿는 수평 깊이"
   ],
   "rows": [
    [
     "35°",
     "171.4cm"
    ],
    [
     "65°",
     "56.0cm"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-124": {
   "kind": "table",
   "heads": [
    "기호",
    "자료"
   ],
   "rows": [
    [
     "ㄱ",
     "같은 서울 좌표·네 날짜·KST의 공식 일출/일몰 계산표"
    ],
    [
     "ㄴ",
     "날짜·시각·도구·관측 과정을 갖춘 우리 반 실측표"
    ],
    [
     "ㄷ",
     "임의의 시분 뺄셈 연습표"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관측값이나 정밀 역서가 아니에요."
  },
  "season-question-data-125": {
   "kind": "table",
   "heads": [
    "날짜",
    "일출(KST)",
    "남중 표시(KST)",
    "일몰(KST)",
    "남중 무렵 고도(°)"
   ],
   "rows": [
    [
     "2026-03-20",
     "06:36",
     "12:39",
     "18:43",
     "52.3"
    ],
    [
     "2026-06-21",
     "05:11",
     "12:33",
     "19:56",
     "75.9"
    ],
    [
     "2026-09-23",
     "06:20",
     "12:24",
     "18:28",
     "52.4"
    ],
    [
     "2026-12-22",
     "07:43",
     "12:30",
     "17:17",
     "29.0"
    ]
   ],
   "caption": "한국천문연구원 계산 자료 · 같은 서울 지점 · 학생 실측이나 실제 기온 자료가 아니에요."
  },
  "season-quick-0": {
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
      "수평면 / 직각"
     ],
     [
      4,
      "빈칸 넣기",
      "고정 / 비교"
     ],
     [
      5,
      "연결하기",
      "ㄱ / ㄷ / ㄴ"
     ],
     [
      6,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      7,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      8,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      9,
      "복수 선택",
      "①, ③, ④"
     ],
     [
      10,
      "복수 선택",
      "①, ③"
     ],
     [
      11,
      "자료 해석",
      "58° / 36°"
     ],
     [
      12,
      "자료 해석",
      "2° / 0°"
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
      "⑤"
     ],
     [
      18,
      "객관식",
      "②"
     ],
     [
      19,
      "빈칸 넣기",
      "짧아진다 / 남중"
     ],
     [
      20,
      "빈칸 넣기",
      "시각 / °"
     ],
     [
      21,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      22,
      "연결하기",
      "ㄷ / ㄴ / ㄱ"
     ],
     [
      23,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      24,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ]
    ]
   ]
  },
  "season-quick-24": {
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
      "②, ③, ⑤"
     ],
     [
      26,
      "복수 선택",
      "②, ⑤"
     ],
     [
      27,
      "자료 해석",
      "20° / 12.3cm"
     ],
     [
      28,
      "자료 해석",
      "62° / 12:15"
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
      "④"
     ],
     [
      34,
      "객관식",
      "②"
     ],
     [
      35,
      "빈칸 넣기",
      "표면 온도 / 기온"
     ],
     [
      36,
      "빈칸 넣기",
      "12:50 / 14:50"
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
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      39,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      40,
      "순서 배열",
      "ㄱ → ㄷ → ㄴ"
     ],
     [
      41,
      "복수 선택",
      "②, ③, ⑤"
     ],
     [
      42,
      "복수 선택",
      "②, ④"
     ],
     [
      43,
      "자료 해석",
      "7℃ / 3℃"
     ],
     [
      44,
      "자료 해석",
      "120분 / 3℃"
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
  "season-quick-48": {
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
      "⑤"
     ],
     [
      50,
      "객관식",
      "①"
     ],
     [
      51,
      "빈칸 넣기",
      "12 / 8"
     ],
     [
      52,
      "빈칸 넣기",
      "일몰 시각 / 일출 시각"
     ],
     [
      53,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      54,
      "연결하기",
      "ㄴ / ㄱ / ㄷ"
     ],
     [
      55,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      56,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      57,
      "복수 선택",
      "②, ⑤"
     ],
     [
      58,
      "복수 선택",
      "②, ③, ⑤"
     ],
     [
      59,
      "자료 해석",
      "727분 / 574분"
     ],
     [
      60,
      "자료 해석",
      "311분 / 1분"
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
      "③"
     ],
     [
      66,
      "객관식",
      "④"
     ],
     [
      67,
      "빈칸 넣기",
      "높다 / 길다"
     ],
     [
      68,
      "빈칸 넣기",
      "같게 / 날짜"
     ],
     [
      69,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      70,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      71,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      72,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ]
    ]
   ]
  },
  "season-quick-72": {
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
      "①, ④"
     ],
     [
      74,
      "복수 선택",
      "①, ③, ④"
     ],
     [
      75,
      "자료 해석",
      "46.9° / 0.1°"
     ],
     [
      76,
      "자료 해석",
      "Q / P"
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
      "①"
     ],
     [
      82,
      "객관식",
      "④"
     ],
     [
      83,
      "빈칸 넣기",
      "적다 / 같다"
     ],
     [
      84,
      "빈칸 넣기",
      "태양 / 지표면"
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
      "ㄴ / ㄷ / ㄱ"
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
      "②, ④"
     ],
     [
      91,
      "자료 해석",
      "6단위/칸 / 3단위/칸"
     ],
     [
      92,
      "자료 해석",
      "4단위/칸 / 2단위/칸"
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
  "season-quick-96": {
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
      "②"
     ],
     [
      98,
      "객관식",
      "⑤"
     ],
     [
      99,
      "빈칸 넣기",
      "자전축 / 공전"
     ],
     [
      100,
      "빈칸 넣기",
      "궤도면 / 같게"
     ],
     [
      101,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      102,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      103,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      104,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      105,
      "복수 선택",
      "②, ④, ⑤"
     ],
     [
      106,
      "복수 선택",
      "①, ④"
     ],
     [
      107,
      "자료 해석",
      "56° / 56°"
     ],
     [
      108,
      "자료 해석",
      "Q / 44°"
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
      "③"
     ],
     [
      114,
      "객관식",
      "③"
     ],
     [
      115,
      "빈칸 넣기",
      "길어 / 에너지"
     ],
     [
      116,
      "빈칸 넣기",
      "종류 / 미측정"
     ],
     [
      117,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      118,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
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
  "season-quick-120": {
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
      "①, ③, ④"
     ],
     [
      122,
      "복수 선택",
      "②, ④, ⑤"
     ],
     [
      123,
      "자료 해석",
      "171.4cm / 115.4cm"
     ],
     [
      124,
      "자료 해석",
      "ㄱ / ㄴ"
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
 "questionSource": "c22-s62-u01.questions.js",
 "visualBindings": [
  {
   "no": 11,
   "figure": "season-question-data-11",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 12,
   "figure": "season-question-data-12",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 17,
   "figure": "season-question-data-17",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 21,
   "figure": "season-question-data-21",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 24,
   "figure": "season-question-data-24",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 25,
   "figure": "season-question-data-25",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 27,
   "figure": "season-question-data-27",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 28,
   "figure": "season-question-data-28",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 29,
   "figure": "season-question-data-29",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 31,
   "figure": "season-question-data-31",
   "kind": "provided-practice-table",
   "precedingDataPage": true,
   "sameModelAsQuestion": true
  },
  {
   "no": 34,
   "figure": "season-question-data-34",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 36,
   "figure": "season-question-data-36",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 40,
   "figure": "season-question-data-40",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 41,
   "figure": "season-question-data-41",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 43,
   "figure": "season-question-data-43",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 44,
   "figure": "season-question-data-44",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 45,
   "figure": "season-question-data-45",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 47,
   "figure": "season-question-data-47",
   "kind": "provided-practice-table",
   "precedingDataPage": true,
   "sameModelAsQuestion": true
  },
  {
   "no": 49,
   "figure": "season-question-data-49",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 50,
   "figure": "season-question-data-50",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 51,
   "figure": "season-question-data-51",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 53,
   "figure": "season-question-data-53",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 56,
   "figure": "season-question-data-56",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 57,
   "figure": "season-question-data-57",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 58,
   "figure": "season-question-data-58",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 59,
   "figure": "season-question-data-59",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 60,
   "figure": "season-question-data-60",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 61,
   "figure": "season-question-data-61",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 63,
   "figure": "season-question-data-63",
   "kind": "official-calculated-data",
   "precedingDataPage": true,
   "sameModelAsQuestion": true
  },
  {
   "no": 65,
   "figure": "season-question-data-65",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 66,
   "figure": "season-question-data-66",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 67,
   "figure": "season-question-data-67",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 69,
   "figure": "season-question-data-69",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 71,
   "figure": "season-question-data-71",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 73,
   "figure": "season-question-data-73",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 75,
   "figure": "season-question-data-75",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 76,
   "figure": "season-question-data-76",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 77,
   "figure": "season-question-data-77",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 78,
   "figure": "season-question-data-78",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 79,
   "figure": "season-question-data-79",
   "kind": "official-calculated-data",
   "precedingDataPage": true,
   "sameModelAsQuestion": true
  },
  {
   "no": 81,
   "figure": "season-question-data-81",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 83,
   "figure": "season-question-data-83",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 86,
   "figure": "season-question-data-86",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 89,
   "figure": "season-question-data-89",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 91,
   "figure": "season-question-data-91",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 92,
   "figure": "season-question-data-92",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 93,
   "figure": "season-question-data-93",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 95,
   "figure": "season-question-data-95",
   "kind": "provided-practice-table",
   "precedingDataPage": true,
   "sameModelAsQuestion": true
  },
  {
   "no": 107,
   "figure": "season-question-data-107",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 108,
   "figure": "season-question-data-108",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 123,
   "figure": "season-question-data-123",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 124,
   "figure": "season-question-data-124",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 125,
   "figure": "season-question-data-125",
   "kind": "official-calculated-data",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  }
 ],
 "actualStudentPerformanceConfirmed": false
};

export const learnerPriorWorkbook=withSeasonEditorial(baseWorkbook);
export const guidanceParticlePriorWorkbook=withLearnerExplanations(learnerPriorWorkbook);
export const studentGuidePriorWorkbook=withGuidanceParticles(guidanceParticlePriorWorkbook);
export const seasonConceptPriorWorkbook=withStudentGuideLanguage(studentGuidePriorWorkbook);
export const workbook=withSeasonConceptLanguage(seasonConceptPriorWorkbook);
