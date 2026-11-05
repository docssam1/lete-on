import{withLearnerExplanations}from'./learner-explanations.js';
import{withCombustionEditorial}from'./c22-s62-u02.editorial.js?v=20261104-combustion-book';
// 독립128문항 정식 교재. scripts/gen-science-workbook-c22s62u02.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s62-u02",
 "title": "물질의 연소",
 "semester": "6-2",
 "no": 2,
 "theme": "#2456c4",
 "book": "지필드 교과 연결 사고력",
 "richText": true,
 "questions": [
  {
   "id": "c22-s62-u02-w001",
   "no": 1,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "찢은 종이의 전후를 보고 가장 타당하게 말한 것을 고르세요.",
   "answer": "③ 모양 변화와 다른 물질의 생성을 구별한다.",
   "explanation": "종이를 찢으면 조각의 크기·수가 바뀌지만 그 관찰만으로 새 물질이 생겼다고 할 수 없어요. 모양 변화와 성질 변화의 근거를 나누어 판단해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "조각 수가 늘면 새로운 물질로 분류한다.",
    "색이 비슷하면 성질은 모두 같다고 정한다.",
    "모양 변화와 다른 물질의 생성을 구별한다.",
    "작아진 조각은 물질이 없어진 것으로 센다.",
    "눈에 보인 크기를 물질 이름으로 기록한다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 모양 변화와 다른 물질의 생성을 구별한다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요."
  },
  {
   "id": "c22-s62-u02-w002",
   "no": 2,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "흰 가루가 담긴 사진 한 장만 있습니다. 사진을 읽는 방법으로 알맞은 것을 고르세요.",
   "answer": "① 가루의 정체는 추가 자료로 확인한다.",
   "explanation": "흰색과 가루 모양은 볼 수 있어도 이름·조성·맛은 사진에서 확인하지 않았어요. 내용물 표시나 확인된 자료를 더 읽어야 하며 맛보기로 시험하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "가루의 정체는 추가 자료로 확인한다.",
    "모든 흰 가루를 소금이라는 이름으로 쓴다.",
    "사진의 흰색만으로 물의 포함량을 잰다.",
    "가루가 고우면 같은 물질로 분류한다.",
    "용기 모양으로 가루의 성질을 확정한다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ① 가루의 정체는 추가 자료로 확인한다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요."
  },
  {
   "id": "c22-s62-u02-w003",
   "no": 3,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "물질이 달라졌는지 살펴볼 때는 변화 (1)과 변화 (2)를 같은 관찰 항목으로 비교해요.",
   "answer": "전 / 후",
   "explanation": "전후를 다른 항목으로 보면 차이가 변화 때문인지 알기 어려워요. 두 시점의 모습과 확인한 성질을 같은 기준으로 비교해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "전",
       "전의 모습",
       "이전"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "후",
       "후의 모습",
       "이후"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 전 또는 전의 모습 또는 이전 / (2) 후 또는 후의 모습 또는 이후. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w004",
   "no": 4,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "종이가 세 조각이 되었다는 말은 (1)한 사실이에요. 그 사실에서 새 물질이 생겼다고 생각한 것은 (2)이에요. 보기: 관찰·해석",
   "answer": "관찰 / 해석",
   "explanation": "조각 수는 직접 센 관찰이에요. 물질이 달라졌다는 판단은 그 사실에서 생각한 해석이므로 별도의 성질 비교 근거가 필요해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "관찰"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "해석"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 관찰 / (2) 해석. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w005",
   "no": 5,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "변화와 실제로 달라진 항목을 한 번씩 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "찢기는 수·크기, 말기는 모양, 이동은 위치를 바꿔요. 이 항목들이 달라진 것만으로 각각 새로운 물질이 생겼다고 분류하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 종이를 세 조각으로 찢음",
    "(2) 같은 종이를 둥글게 말음",
    "(3) 같은 종이의 위치를 옮김"
   ],
   "options": [
    "ㄱ 놓인 장소",
    "ㄴ 조각의 수와 크기",
    "ㄷ 전체 모양"
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
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "given": [
    "ㄱ 놓인 장소",
    "ㄴ 조각의 수와 크기",
    "ㄷ 전체 모양"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w006",
   "no": 6,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "설명을 자료의 종류와 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "눈으로 센 수와 이름 추정은 다르며 내용물 표시는 해당 시료를 확인하는 자료예요. 다른 컵의 표시를 가져와 사진 속 이름으로 확정하면 안 돼요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 직접 센 조각 세 개",
    "(2) 사진만 보고 가루를 소금이라고 짐작",
    "(3) 해당 시료의 내용물 표시를 확인"
   ],
   "options": [
    "ㄱ 이름을 추정한 해석",
    "ㄴ 대상의 이름을 제공하는 자료",
    "ㄷ 수를 센 관찰"
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
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "given": [
    "ㄱ 이름을 추정한 해석",
    "ㄴ 대상의 이름을 제공하는 자료",
    "ㄷ 수를 센 관찰"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w007",
   "no": 7,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "물질의 변화 판단을 관찰→비교→결론 범위 순서로 정리하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "먼저 모습을 살피고 같은 항목으로 전후를 비교한 뒤 그 근거가 지지하는 범위로 결론을 제한해요. 원하는 결론에 맞춰 관찰을 고르지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 같은 항목의 전후 특징을 나란히 비교한다.",
    "ㄴ 확인한 특징만으로 어디까지 말할 수 있는지 정한다.",
    "ㄷ 변화 전후의 실제 모습을 살핀다."
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
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "given": [
    "ㄱ 같은 항목의 전후 특징을 나란히 비교한다.",
    "ㄴ 확인한 특징만으로 어디까지 말할 수 있는지 정한다.",
    "ㄷ 변화 전후의 실제 모습을 살핀다."
   ]
  },
  {
   "id": "c22-s62-u02-w008",
   "no": 8,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "가루 사진의 이름이 서로 다르게 적힌 것을 발견했습니다. 확인 순서를 이으세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "사진에서 확인할 수 있는 정보부터 점검하고 시료에 맞는 자료를 확인한 뒤 이름과 불확실성을 정리해요. 근거 없이 어느 친구의 이름을 정답으로 고르지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 해당 시료의 내용물 표시·제공 자료를 확인한다.",
    "ㄴ 사진 모양만으로 붙인 이름인지 점검한다.",
    "ㄷ 확인된 이름과 아직 모르는 점을 구별해 정정한다."
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
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "given": [
    "ㄱ 해당 시료의 내용물 표시·제공 자료를 확인한다.",
    "ㄴ 사진 모양만으로 붙인 이름인지 점검한다.",
    "ㄷ 확인된 이름과 아직 모르는 점을 구별해 정정한다."
   ]
  },
  {
   "id": "c22-s62-u02-w009",
   "no": 9,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "모양·위치 변화만으로 새 물질이 생겼다고 단정할 수 없는 관찰을 모두 고르세요. (정답 3개)",
   "answer": "①, ②, ③",
   "explanation": "조각·모양·위치 변화만으로 새 물질 생성을 확정할 수 없어요. 반면 전후 성질 차이나 대조를 갖춘 확인 반응은 물질 판단의 근거가 돼요. 실제 결과와 조건의 범위는 유지해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "종이가 작은 세 조각으로 나뉨",
    "같은 종이가 둥글게 말린 모습",
    "같은 물체가 다른 책상으로 옮겨짐",
    "전후 비교에서 서로 다른 성질의 물질을 확인함",
    "대조와 다른 확인 반응으로 물질의 성질 차이를 확인함"
   ],
   "key": [
    0,
    1,
    2
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     1,
     2
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ③. 선택한 순서는 관계없다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요."
  },
  {
   "id": "c22-s62-u02-w010",
   "no": 10,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "사진을 넘어 추가 확인이 필요한 주장을 모두 고르세요. (정답 3개)",
   "answer": "①, ②, ④",
   "explanation": "겉모습은 물질 이름이나 실제 수행 주체를 보장하지 않아요. 사진에서 보인 수와 배치 참고라는 용도는 그 범위 안에서 읽을 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "흰 가루는 모두 같은 종류다.",
    "투명한 액체는 언제나 물이다.",
    "컵은 사진에서 두 개가 보인다.",
    "이 사진을 내가 직접 실험한 증거로 쓴다.",
    "사진은 준비 배치를 보는 참고로 쓴다."
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
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요."
  },
  {
   "id": "c22-s62-u02-w011",
   "no": 11,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "같은 폭의 종이를 나눈 모형입니다. (1)처음 조각 수 (2)나눈 뒤 한 조각의 길이를 단위와 함께 쓰세요.",
   "answer": "1개 / 4cm",
   "explanation": "처음은1개이고 나눈 뒤는 한 조각4cm예요. 조각이 세 개가 된 것을 물질 세 종류가 생겼다는 말로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "kind": "number-unit",
      "value": 4,
      "units": [
       "cm",
       "센티미터"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "4cm"
      ]
     }
    ]
   },
   "modelRef": "strips",
   "verificationModel": {
    "kind": "strip-parts",
    "answers": [
     1,
     4
    ]
   },
   "table": {
    "머리": [
     "시점",
     "조각 수",
     "한 조각 길이"
    ],
    "행": [
     [
      "처음",
      1,
      "12cm"
     ],
     [
      "같은 크기 세 조각으로 나눈 뒤",
      3,
      "4cm"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 1개 (단위 필요) / (2) 4cm (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-11"
  },
  {
   "id": "c22-s62-u02-w012",
   "no": 12,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "기록을 읽고 (1)크기만 달라진 경우 (2)이 자료만으로 이름을 정할 수 없는 경우의 기호를 쓰세요.",
   "answer": "ㄱ / ㄴ",
   "explanation": "ㄱ은 같은 종이의 크기 변화이고 ㄴ은 흰색·형태만 보일 뿐 이름 근거가 없어요. ㄷ의 이름 자료도 해당 시료에 맞는지 확인해서 사용해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "같은 종이를 잘라 작은 조각으로 만듦"
     ],
     [
      "ㄴ",
      "정체 표시가 없는 흰 가루 사진"
     ],
     [
      "ㄷ",
      "교사가 시료 이름을 직접 확인한 표"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-12"
  },
  {
   "id": "c22-s62-u02-w013",
   "no": 13,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "종이를 찢었으니 처음 종이의 물질은 없어졌다는 주장을 고쳐 설명하세요.",
   "answer": "조각 수와 크기는 달라졌지만 종이를 찢은 관찰만으로 물질이 완전히 없어졌다고 할 수 없다. 전후의 성질을 비교하는 근거가 더 필요하다.",
   "explanation": "형태 변화와 물질의 소멸은 같은 말이 아니에요. 조각이 남아 있다는 관찰과 판단의 한계를 함께 설명하면 여러 표현을 인정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "변한 항목이 크기·조각 수임을 말한다.",
    "완전한 소멸로 확대하지 않는다.",
    "성질을 비교할 추가 근거를 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "조각 수와 크기는 달라졌지만 종이를 찢은 관찰만으로 물질이 완전히 없어졌다고 할 수 없다. 전후의 성질을 비교하는 근거가 더 필요하다.",
    "required": [
     "변한 항목이 크기·조각 수임을 말한다.",
     "완전한 소멸로 확대하지 않는다.",
     "성질을 비교할 추가 근거를 제안한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "변한 항목이 크기·조각 수임을 말한다. / 완전한 소멸로 확대하지 않는다. / 성질을 비교할 추가 근거를 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w014",
   "no": 14,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "같은 흰색이라는 이유로 두 가루가 같은 물질이라고 한 설명을 검토하세요.",
   "answer": "흰색은 공통으로 보이는 항목이지만 그것만으로 같은 물질인지 확정할 수 없다. 교사가 확인한 시료 이름과 비교 성질 자료를 더 확인한다.",
   "explanation": "관찰된 공통점 하나와 모든 성질의 같음을 구별해요. 학생이 모르는 가루를 맛보거나 섞는 확인 방법은 타당한 답이 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "겉색의 공통점만으로 이름을 확정하지 않는다.",
    "시료에 맞는 표시·성질 자료를 더 확인한다.",
    "맛보기·임의 혼합으로 확인하지 않는다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "흰색은 공통으로 보이는 항목이지만 그것만으로 같은 물질인지 확정할 수 없다. 교사가 확인한 시료 이름과 비교 성질 자료를 더 확인한다.",
    "required": [
     "겉색의 공통점만으로 이름을 확정하지 않는다.",
     "시료에 맞는 표시·성질 자료를 더 확인한다.",
     "맛보기·임의 혼합으로 확인하지 않는다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "겉색의 공통점만으로 이름을 확정하지 않는다. / 시료에 맞는 표시·성질 자료를 더 확인한다. / 맛보기·임의 혼합으로 확인하지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w015",
   "no": 15,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "한 장의 종이가 세 조각이 된 전후를 그리세요. 변한 항목 두 가지에 이름표를 붙이고 새 물질 생성에 대해 이 그림으로 알 수 없는 점을 쓰세요.",
   "answer": "처음 종이1장과 나눈 뒤3조각을 그리고 조각 수·크기를 표시한다. 이 그림의 모양 변화만으로 새 물질 생성을 확정할 수 없다고 쓴다.",
   "explanation": "그림의 예쁨이나 선 수를 채점하지 않아요. 대상과 변화 항목·판단 범위가 드러나는지 교사가 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "전후의 같은 종이 대상임을 나타낸다.",
    "수·크기 변화 두 항목을 표시한다.",
    "물질의 성질 전체가 확인된 것은 아님을 설명한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "처음 종이1장과 나눈 뒤3조각을 그리고 조각 수·크기를 표시한다. 이 그림의 모양 변화만으로 새 물질 생성을 확정할 수 없다고 쓴다.",
    "required": [
     "전후의 같은 종이 대상임을 나타낸다.",
     "수·크기 변화 두 항목을 표시한다.",
     "물질의 성질 전체가 확인된 것은 아님을 설명한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "전후의 같은 종이 대상임을 나타낸다. / 수·크기 변화 두 항목을 표시한다. / 물질의 성질 전체가 확인된 것은 아님을 설명한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w016",
   "no": 16,
   "section": 1,
   "sectionTitle": "모양이 달라도 같은 물질일까?",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T15",
   "topic": "모양이 달라도 같은 물질일까?",
   "prompt": "처음 사진과 나중 사진을 비교할 관찰표를 그리세요. 같은 항목과 관찰/해석 칸을 구분하고 확인하지 못한 내용도 남길 자리를 만드세요.",
   "answer": "전후를 같은 줄에 두고 색·모양·상태 등의 항목을 만든다. 본 사실과 그 사실에서 생각한 해석을 나누고 미관찰·추가 확인 칸을 둔다.",
   "explanation": "채워진 예시 결과를 요구하는 문제가 아니에요. 실제 비교가 가능한 표의 구조와 확인하지 못한 점을 남기는 방법을 살펴요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "전후에 같은 항목을 사용한다.",
    "관찰과 해석을 나눈다.",
    "미관찰을 변화 없음과 구별한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "전후를 같은 줄에 두고 색·모양·상태 등의 항목을 만든다. 본 사실과 그 사실에서 생각한 해석을 나누고 미관찰·추가 확인 칸을 둔다.",
    "required": [
     "전후에 같은 항목을 사용한다.",
     "관찰과 해석을 나눈다.",
     "미관찰을 변화 없음과 구별한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "전후에 같은 항목을 사용한다. / 관찰과 해석을 나눈다. / 미관찰을 변화 없음과 구별한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "크기·모양·위치가 달라진 사실만으로 다른 물질이 생겼다고 정하지 않아요. 겉색 하나로 물질 이름도 확정하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w017",
   "no": 17,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "혼합 자료의 ㄴ·ㄷ을 비교해 직접 읽을 수 있는 내용을 고르세요.",
   "answer": "④ 젓기가 끝난 뒤 기포가 이어진 모습은 달랐다.",
   "explanation": "ㄴ은 젓는 동안 잠깐, ㄷ은 젓기가 끝난 뒤에도 기포가 이어졌어요. 지속 모습의 차이는 읽을 수 있지만 기체 이름을 확인한 시험 결과는 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "기포가 나온 두 컵에는 같은 기체만 들어 있다.",
    "ㄷ에 새로 생긴 기체의 이름은 표에서 확인됐다.",
    "ㄴ의 가루는 보이지 않으면 완전히 없어진다.",
    "젓기가 끝난 뒤 기포가 이어진 모습은 달랐다.",
    "ㄱ의 물은 다른 물질이므로 비교에 쓸 수 없다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "table": {
    "머리": [
     "컵",
     "교사가 정한 조합",
     "같은 시간 동안 관찰한 모습"
    ],
    "행": [
     [
      "ㄱ",
      "물만",
      "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
     ],
     [
      "ㄴ",
      "물+베이킹 소다",
      "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
     ],
     [
      "ㄷ",
      "식초+베이킹 소다",
      "젓기가 멈춘 뒤에도 기포가 이어짐"
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ 젓기가 끝난 뒤 기포가 이어진 모습은 달랐다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다."
   ],
   "figure": "combustion-question-data-17"
  },
  {
   "id": "c22-s62-u02-w018",
   "no": 18,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "액체 종류의 영향을 비교하려는 계획으로 알맞은 것을 고르세요.",
   "answer": "② 가루의 양을 맞추고 액체 종류를 바꾼다.",
   "explanation": "비교하려는 것은 액체 종류예요. 가루 양·용기·젓는 방법·관찰 시점을 맞춰 다른 원인이 함께 섞이지 않도록 계획해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "가루의 종류와 양을 한꺼번에 바꾸어 넣는다.",
    "가루의 양을 맞추고 액체 종류를 바꾼다.",
    "큰 컵에는 오래 젓고 작은 컵에는 적게 젓는다.",
    "물은 넣은 직후 보고 식초는 다음 날에 본다.",
    "한 컵은 닫고 다른 컵은 가열하면서 관찰한다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "table": {
    "머리": [
     "컵",
     "교사가 정한 조합",
     "같은 시간 동안 관찰한 모습"
    ],
    "행": [
     [
      "ㄱ",
      "물만",
      "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
     ],
     [
      "ㄴ",
      "물+베이킹 소다",
      "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
     ],
     [
      "ㄷ",
      "식초+베이킹 소다",
      "젓기가 멈춘 뒤에도 기포가 이어짐"
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 가루의 양을 맞추고 액체 종류를 바꾼다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다."
   ],
   "figure": "combustion-question-data-18"
  },
  {
   "id": "c22-s62-u02-w019",
   "no": 19,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "ㄴ·ㄷ에서 다르게 한 것은 (1)의 종류이고, 비교하려고 같은 양을 넣은 가루는 (2)이에요.",
   "answer": "액체 / 베이킹 소다",
   "explanation": "ㄴ의 물과 ㄷ의 식초가 다른 액체 조건이에요. 두 컵에는 같은 양의 베이킹 소다를 넣었으므로 가루 양 차이를 액체 차이와 섞지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "액체"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "베이킹 소다",
       "베이킹소다"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "컵",
     "교사가 정한 조합",
     "같은 시간 동안 관찰한 모습"
    ],
    "행": [
     [
      "ㄱ",
      "물만",
      "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
     ],
     [
      "ㄴ",
      "물+베이킹 소다",
      "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
     ],
     [
      "ㄷ",
      "식초+베이킹 소다",
      "젓기가 멈춘 뒤에도 기포가 이어짐"
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 액체 / (2) 베이킹 소다 또는 베이킹소다. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-19"
  },
  {
   "id": "c22-s62-u02-w020",
   "no": 20,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "기포가 생긴 것은 (1)이고, 그 기포 속 물질의 이름을 정하는 것은 근거가 필요한 (2)이에요. 보기: 관찰·해석",
   "answer": "관찰 / 해석",
   "explanation": "기포는 보이는 현상이고 기체 이름은 확인 근거에서 판단해요. 표에는 확인 시험이 없으므로 기포 모습만으로 산소·이산화 탄소를 확정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "관찰"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "해석"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "컵",
     "교사가 정한 조합",
     "같은 시간 동안 관찰한 모습"
    ],
    "행": [
     [
      "ㄱ",
      "물만",
      "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
     ],
     [
      "ㄴ",
      "물+베이킹 소다",
      "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
     ],
     [
      "ㄷ",
      "식초+베이킹 소다",
      "젓기가 멈춘 뒤에도 기포가 이어짐"
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 관찰 / (2) 해석. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-20"
  },
  {
   "id": "c22-s62-u02-w021",
   "no": 21,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "실험 계획의 항목과 역할을 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "액체 종류를 달리하고 기포 모습을 비교하며 가루 양·컵은 같게 두어요. 관찰할 결과를 미리 같게 만들거나 가루 양도 바꾸면 공정 비교가 어려워요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 물 대신 식초를 사용",
    "(2) 기포의 지속 모습",
    "(3) 같은 양의 가루와 같은 컵"
   ],
   "options": [
    "ㄱ 같게 둘 조건",
    "ㄴ 달리할 조건",
    "ㄷ 비교할 관찰 결과"
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
     "컵",
     "교사가 정한 조합",
     "같은 시간 동안 관찰한 모습"
    ],
    "행": [
     [
      "ㄱ",
      "물만",
      "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
     ],
     [
      "ㄴ",
      "물+베이킹 소다",
      "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
     ],
     [
      "ㄷ",
      "식초+베이킹 소다",
      "젓기가 멈춘 뒤에도 기포가 이어짐"
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
    "ㄱ 같게 둘 조건",
    "ㄴ 달리할 조건",
    "ㄷ 비교할 관찰 결과"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-21"
  },
  {
   "id": "c22-s62-u02-w022",
   "no": 22,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "기록을 알맞은 상태와 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "봤는데 없었던 경우와 보지 못한 경우는 달라요. 기체 이름 추정도 관찰 사실과 따로 남겨야 예상대로 결과를 꾸미지 않을 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 정한 시간에 봤지만 기포가 없었음",
    "(2) 정한 시간에 보지 못했음",
    "(3) 기포를 보고 이름을 추정함"
   ],
   "options": [
    "ㄱ 미관찰",
    "ㄴ 해석",
    "ㄷ 관찰에서 변화가 보이지 않음"
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
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "ㄱ 미관찰",
    "ㄴ 해석",
    "ㄷ 관찰에서 변화가 보이지 않음"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w023",
   "no": 23,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "교사의 사전 점검이 끝난 혼합 활동 순서를 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "안전과 처음 상태를 확인한 뒤 정한 조합만 섞고 같은 기준으로 비교해요. 처음을 보지 않고 나중 모습만 기록하면 전후 차이를 설명하기 어려워요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 정한 조합만 열린 컵에서 섞는다.",
    "ㄴ 전후를 같은 시점·항목으로 비교한다.",
    "ㄷ 내용물·보안경·받침과 처음 모습을 확인한다."
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
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "ㄱ 정한 조합만 열린 컵에서 섞는다.",
    "ㄴ 전후를 같은 시점·항목으로 비교한다.",
    "ㄷ 내용물·보안경·받침과 처음 모습을 확인한다."
   ]
  },
  {
   "id": "c22-s62-u02-w024",
   "no": 24,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "두 컵에 넣은 가루 양이 달랐습니다. 액체만의 영향으로 해석하기 전에 할 일을 순서대로 쓰세요.",
   "answer": "ㄱ → ㄴ → ㄷ",
   "explanation": "먼저 원래 비교의 한계를 밝히고 조건을 맞춘 뒤 새 결과를 따로 남겨요. 앞 기록을 원하는 값으로 고치거나 한 조건의 효과로 단정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 차이가 가루 양에도 영향을 받았을 수 있음을 밝힌다.",
    "ㄴ 교사와 조건을 맞춘 재비교 방법을 정한다.",
    "ㄷ 새 비교 결과를 원래 결과와 구별해 기록한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄱ → ㄴ → ㄷ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "ㄱ 차이가 가루 양에도 영향을 받았을 수 있음을 밝힌다.",
    "ㄴ 교사와 조건을 맞춘 재비교 방법을 정한다.",
    "ㄷ 새 비교 결과를 원래 결과와 구별해 기록한다."
   ]
  },
  {
   "id": "c22-s62-u02-w025",
   "no": 25,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "표만으로 말할 수 있는 내용을 모두 고르세요. (정답 3개)",
   "answer": "①, ②, ⑤",
   "explanation": "ㄷ의 지속 모습·같은 가루 양·ㄱ과 ㄴ의 관찰 차이는 표에 있어요. 기체 확인 시험이나 눈에 안 보이는 모든 변화의 부재는 제시하지 않았어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄷ에서는 젓기가 끝난 뒤에도 기포가 이어졌다.",
    "ㄴ과 ㄷ은 같은 양의 가루를 사용했다.",
    "ㄷ의 기체는 확인 시험으로 이름을 알아냈다.",
    "ㄴ에는 어떠한 변화도 절대로 일어나지 않았다.",
    "ㄱ과 ㄴ의 기포 모습은 제시 조건에서 달랐다."
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
     "컵",
     "교사가 정한 조합",
     "같은 시간 동안 관찰한 모습"
    ],
    "행": [
     [
      "ㄱ",
      "물만",
      "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
     ],
     [
      "ㄴ",
      "물+베이킹 소다",
      "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
     ],
     [
      "ㄷ",
      "식초+베이킹 소다",
      "젓기가 멈춘 뒤에도 기포가 이어짐"
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ⑤. 선택한 순서는 관계없다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다."
   ],
   "figure": "combustion-question-data-25"
  },
  {
   "id": "c22-s62-u02-w026",
   "no": 26,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "교사가 정한 혼합 비교의 조건을 해치는 행동을 고르세요. (정답 3개)",
   "answer": "③, ④, ⑤",
   "explanation": "가루 양·열림 여부·추가 물질이 달라지면 액체 종류 이외 원인이 섞여요. 밀폐와 임의의 제품 혼합도 교사 지정 조건을 벗어나요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "같은 크기의 열린 컵을 준비한다.",
    "같은 시간 뒤 모습을 비교한다.",
    "한쪽 가루 양만 두 배로 늘린다.",
    "한쪽 컵만 마개로 닫아 둔다.",
    "다른 생활 세제를 마음대로 추가한다."
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
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요."
  },
  {
   "id": "c22-s62-u02-w027",
   "no": 27,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "가상 기록에서 (1)ㄷ과 ㄴ의 눈에 보인 기포 지속 시간 차를 쓰고 (2)더 오래 보인 컵의 기호를 쓰세요.",
   "answer": "34초 / ㄷ",
   "explanation": "38−4=34초이고 더 오래 보인 것은 ㄷ이에요. 이는 보인 시간의 차이이며 기체의 부피나 물질 이름을 측정한 수치가 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "value": 34,
      "units": [
       "초",
       "s"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "34초"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "ㄷ"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "컵",
     "기포가 보인 시간(초)"
    ],
    "행": [
     [
      "ㄱ",
      0
     ],
     [
      "ㄴ",
      4
     ],
     [
      "ㄷ",
      38
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "modelRef": "mixTime",
   "verificationModel": {
    "kind": "mix-duration-difference",
    "answers": [
     34,
     "ㄷ"
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 34초 (단위 필요) / (2) ㄷ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-27"
  },
  {
   "id": "c22-s62-u02-w028",
   "no": 28,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "ㄴ·ㄷ의 재비교 계획 중 (1)액체 종류만 달리한 계획 (2)서로 다른 두 조건이 함께 바뀐 계획을 쓰세요.",
   "answer": "ㄱ / ㄴ",
   "explanation": "ㄱ은 액체만 다르고 ㄴ은 액체와 가루 양이 모두 달라요. ㄷ은 비교하려는 액체 차이도 없으므로 이 질문의 두 답과 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
     "계획",
     "액체",
     "가루 양",
     "관찰 시점"
    ],
    "행": [
     [
      "ㄱ",
      "물 / 식초",
      "같음",
      "같음"
     ],
     [
      "ㄴ",
      "물 / 식초",
      "다름",
      "같음"
     ],
     [
      "ㄷ",
      "물 / 물",
      "같음",
      "같음"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-28"
  },
  {
   "id": "c22-s62-u02-w029",
   "no": 29,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "ㄷ에서 기포가 오래 이어졌으므로 기체는 산소라고 한 설명을 검토하세요.",
   "answer": "기포 지속은 관찰했지만 기체 확인 시험은 하지 않았다. 이름을 산소로 정할 수 없으며 확인된 자료나 별도 시험 근거가 필요하다.",
   "explanation": "같은 기포 모양이 언제나 같은 기체를 뜻하지 않아요. 이 자료의 비교 목적과 확인하지 않은 물질 이름을 나누어 설명해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "기포 지속을 관찰 사실로 구분한다.",
    "산소라는 이름 확정을 보류한다.",
    "필요한 추가 근거를 제시한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "기포 지속은 관찰했지만 기체 확인 시험은 하지 않았다. 이름을 산소로 정할 수 없으며 확인된 자료나 별도 시험 근거가 필요하다.",
    "required": [
     "기포 지속을 관찰 사실로 구분한다.",
     "산소라는 이름 확정을 보류한다.",
     "필요한 추가 근거를 제시한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "컵",
     "교사가 정한 조합",
     "같은 시간 동안 관찰한 모습"
    ],
    "행": [
     [
      "ㄱ",
      "물만",
      "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
     ],
     [
      "ㄴ",
      "물+베이킹 소다",
      "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
     ],
     [
      "ㄷ",
      "식초+베이킹 소다",
      "젓기가 멈춘 뒤에도 기포가 이어짐"
     ]
    ]
   },
   "givens": "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다.",
   "formLabel": "까닭 설명",
   "criteria": "기포 지속을 관찰 사실로 구분한다. / 산소라는 이름 확정을 보류한다. / 필요한 추가 근거를 제시한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "given": [
    "비교 방법을 연습하려고 만든 가상 관찰표다. 내용물은 교사가 알려 주었다. ㄴ·ㄷ은 같은 양의 가루·액체, 같은 열린 컵·젓는 방법·관찰 시간을 사용했다. 기체 이름을 확인하는 시험은 하지 않았다."
   ],
   "lines": 6,
   "figure": "combustion-question-data-29"
  },
  {
   "id": "c22-s62-u02-w030",
   "no": 30,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "물과 소금을 섞은 뒤 알갱이가 안 보여 소금이 완전히 사라졌다는 주장을 고치세요.",
   "answer": "알갱이가 보이지 않는 관찰만으로 소금의 완전한 소멸을 말할 수 없다. 용해와 연결해 해석하되 이름·성질을 확인한 자료와 관찰 범위를 구별한다.",
   "explanation": "눈에 보이는 알갱이와 물질의 존재는 같지 않아요. 실제로 보지 않은 확인 결과를 덧붙이지 않는 설명을 인정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "안 보임과 물질 소멸을 구별한다.",
    "용해라는 변화와 연결한다.",
    "맛보기·임의 가열을 확인 방법으로 요구하지 않는다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "알갱이가 보이지 않는 관찰만으로 소금의 완전한 소멸을 말할 수 없다. 용해와 연결해 해석하되 이름·성질을 확인한 자료와 관찰 범위를 구별한다.",
    "required": [
     "안 보임과 물질 소멸을 구별한다.",
     "용해라는 변화와 연결한다.",
     "맛보기·임의 가열을 확인 방법으로 요구하지 않는다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "안 보임과 물질 소멸을 구별한다. / 용해라는 변화와 연결한다. / 맛보기·임의 가열을 확인 방법으로 요구하지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w031",
   "no": 31,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "물+베이킹 소다와 식초+베이킹 소다의 공정 비교 계획을 그림으로 나타내세요. 바꿀 것·같게 할 것·관찰할 것을 이름표로 붙이세요.",
   "answer": "표시가 있는 같은 열린 컵에 같은 양의 가루와 액체를 준비하되 액체 종류만 달리한다. 같은 젓기·시간의 기포 모습을 비교하고 교사 사전 점검·보안경을 표시한다.",
   "explanation": "실행 완료 그림이 아니라 계획이에요. 밀폐·가열·임의 재료 추가 없이 실제로 비교 가능한 조건인지 교사가 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "액체 종류만 달리한다.",
    "가루·액체 양과 컵·시간을 맞춘다.",
    "안전 조건과 관찰 항목을 표시한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "표시가 있는 같은 열린 컵에 같은 양의 가루와 액체를 준비하되 액체 종류만 달리한다. 같은 젓기·시간의 기포 모습을 비교하고 교사 사전 점검·보안경을 표시한다.",
    "required": [
     "액체 종류만 달리한다.",
     "가루·액체 양과 컵·시간을 맞춘다.",
     "안전 조건과 관찰 항목을 표시한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "액체 종류만 달리한다. / 가루·액체 양과 컵·시간을 맞춘다. / 안전 조건과 관찰 항목을 표시한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w032",
   "no": 32,
   "section": 2,
   "sectionTitle": "서로 다른 물질을 섞어 비교하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T16",
   "topic": "서로 다른 물질을 섞어 비교하기",
   "prompt": "혼합 전후의 기록 칸을 설계하세요. ㄱ·ㄴ·ㄷ을 같은 항목으로 나란히 두고 기포 관찰과 기체 이름 해석을 구분하세요.",
   "answer": "컵별 처음·같은 시간 뒤의 모습 칸과 기포 유무/지속 칸을 만든다. 기체 이름은 확인 근거가 있을 때만 쓰도록 해석·추가 확인 칸을 둔다.",
   "explanation": "주어진 표를 예쁘게 베끼는지보다 관찰과 해석을 혼동하지 않을 구조인지 살펴요. 실제로 얻지 않은 결과를 채울 필요는 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "세 컵에 같은 시간·항목을 쓴다.",
    "기포와 이름 판단을 분리한다.",
    "미관찰·확인하지 않음을 기록할 수 있다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "컵별 처음·같은 시간 뒤의 모습 칸과 기포 유무/지속 칸을 만든다. 기체 이름은 확인 근거가 있을 때만 쓰도록 해석·추가 확인 칸을 둔다.",
    "required": [
     "세 컵에 같은 시간·항목을 쓴다.",
     "기포와 이름 판단을 분리한다.",
     "미관찰·확인하지 않음을 기록할 수 있다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "세 컵에 같은 시간·항목을 쓴다. / 기포와 이름 판단을 분리한다. / 미관찰·확인하지 않음을 기록할 수 있다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "기포의 유무·지속 모습과 기체 이름은 달라요. 같은 관찰 시간과 양·용기 조건을 맞추고 확인하지 못한 점을 남겨요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w033",
   "no": 33,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "두 연료의 공통 현상으로 자료가 뒷받침하는 것을 고르세요.",
   "answer": "⑤ 빛이 나고 주변으로 열이 전달된다.",
   "explanation": "두 경우 빛이 확인되고 바깥 온도계 표시가 높아졌어요. 불꽃 색·높이·소모량·내부 온도를 같게 확인한 자료는 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "두 불꽃의 색과 높이는 언제나 같다.",
    "연소한 두 연료의 양은 정확히 같다.",
    "두 시범의 불꽃 내부 온도는 같다.",
    "양초의 심지는 알코올에서도 녹는다.",
    "빛이 나고 주변으로 열이 전달된다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "table": {
    "머리": [
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ⑤ 빛이 나고 주변으로 열이 전달된다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다."
   ],
   "figure": "combustion-question-data-33"
  },
  {
   "id": "c22-s62-u02-w034",
   "no": 34,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T01",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "온도 기록을 읽은 설명으로 알맞은 것을 고르세요.",
   "answer": "③ 바깥 온도계의 상승 폭은 서로 달랐다.",
   "explanation": "23→32℃와23→29℃는 바깥 온도계 기록이에요. 상승 폭 차이는 읽을 수 있지만 효율·발화점·소모 질량으로 바꿔 읽을 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "양초 불꽃의 내부 온도는 정확히32℃다.",
    "알코올의 연소 효율이 반드시 더 낮다.",
    "바깥 온도계의 상승 폭은 서로 달랐다.",
    "40초 뒤의 표시가 각 연료의 발화점이다.",
    "두 연료에서 소모한 양은9g과6g이다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "table": {
    "머리": [
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 바깥 온도계의 상승 폭은 서로 달랐다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다."
   ],
   "figure": "combustion-question-data-34"
  },
  {
   "id": "c22-s62-u02-w035",
   "no": 35,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "두 시범에서 주변이 밝아진 것은 (1) 발생의 근거이고 바깥 온도계 표시가 높아진 것은 (2) 전달의 근거예요.",
   "answer": "빛 / 열",
   "explanation": "밝아짐은 빛, 주변 온도계의 상승은 열 전달과 연결해요. 온도계가 있는 위치를 밝혀 불꽃 자체 온도와 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "빛"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "열"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 빛 / (2) 열. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-35"
  },
  {
   "id": "c22-s62-u02-w036",
   "no": 36,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T09",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "물질이 산소와 빠르게 반응하며 빛과 열을 내는 현상은 (1)이에요. 이때 남은 연료가 줄어든 것이 물질 전체의 (2)을 뜻하지는 않아요. 보기: 연소·소멸",
   "answer": "연소 / 소멸",
   "explanation": "연소는 빛·열 발생을 포함한 물질의 변화예요. 열린 장치에서 남은 연료만 비교한 결과를 전체 물질 소멸의 증거로 확대하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "연소"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "소멸"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 연소 / (2) 소멸. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w037",
   "no": 37,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T01",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "관찰 항목과 이를 확인하는 기록을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "빛·열·남은 연료는 각각 다른 관찰 근거를 사용해요. 밝기만으로 연료 양을 정하거나 액면만으로 온도를 정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 빛 발생",
    "(2) 주변으로 열 전달",
    "(3) 남은 액체 연료의 변화"
   ],
   "options": [
    "ㄱ 바깥 온도계 전후 표시",
    "ㄴ 같은 방법으로 읽은 액면/부피",
    "ㄷ 주변이 밝아짐"
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
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "ㄱ 바깥 온도계 전후 표시",
    "ㄴ 같은 방법으로 읽은 액면/부피",
    "ㄷ 주변이 밝아짐"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w038",
   "no": 38,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "자료에서 알 수 있는 범위를 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "공통 빛 관찰과 바깥 온도를 구별해요. 효율은 연료 투입량과 유용하게 얻은 에너지도 필요하므로 단순 온도 기록으로 순위를 확정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 두 기록 모두 빛 확인",
    "(2) 32℃라는 나중 표시",
    "(3) 소모한 연료량 자료 없음"
   ],
   "options": [
    "ㄱ 효율 비교는 이 자료만으로 불가",
    "ㄴ 두 연료 공통 관찰",
    "ㄷ 바깥 측정 위치의 온도"
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
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
    "ㄱ 효율 비교는 이 자료만으로 불가",
    "ㄴ 두 연료 공통 관찰",
    "ㄷ 바깥 측정 위치의 온도"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-38"
  },
  {
   "id": "c22-s62-u02-w039",
   "no": 39,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T01",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "교사가 점검한 두 연료 시범을 비교할 순서를 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "안전과 기준을 정하고 관찰한 뒤 공통/차이를 나누어요. 어느 연료가 더 좋다는 결론부터 정해 관찰 항목을 고르지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 같은 항목으로 두 연료를 관찰한다.",
    "ㄴ 공통점과 차이점을 관찰 근거로 묶는다.",
    "ㄷ 안전선과 관찰 항목을 먼저 확인한다."
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
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "ㄱ 같은 항목으로 두 연료를 관찰한다.",
    "ㄴ 공통점과 차이점을 관찰 근거로 묶는다.",
    "ㄷ 안전선과 관찰 항목을 먼저 확인한다."
   ]
  },
  {
   "id": "c22-s62-u02-w040",
   "no": 40,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "공통 현상을 설명하는 흐름으로 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "같은 기준에서 얻은 관찰을 먼저 읽고 공통 현상으로 설명해요. 색이나 심지처럼 한 연료의 특징을 공통 설명에 끼워 넣지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 두 경우 주변이 밝아지고 바깥 온도가 올랐다.",
    "ㄴ 두 연료 모두 빛과 열을 내는 현상으로 연결한다.",
    "ㄷ 두 시범을 같은 항목·위치·시간 기준으로 살핀다."
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
   "table": {
    "머리": [
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
    "ㄱ 두 경우 주변이 밝아지고 바깥 온도가 올랐다.",
    "ㄴ 두 연료 모두 빛과 열을 내는 현상으로 연결한다.",
    "ㄷ 두 시범을 같은 항목·위치·시간 기준으로 살핀다."
   ],
   "figure": "combustion-question-data-40"
  },
  {
   "id": "c22-s62-u02-w041",
   "no": 41,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "두 연료 비교 자료에서 뒷받침되는 말을 고르세요. (정답 3개)",
   "answer": "①, ②, ④",
   "explanation": "빛 확인과 두 온도계의 상승은 표에서 읽어요. 산소 사용량이나 불꽃 내부 온도는 재지 않았으므로 관측값인 것처럼 추가하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "두 연료 모두 빛 발생이 확인됐다.",
    "양초의 바깥 온도계 표시는 높아졌다.",
    "두 연료가 사용한 산소량은 정확히 같다.",
    "알코올의 바깥 온도계도 높아졌다.",
    "두 불꽃의 내부 온도는 표에 있다."
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
   "table": {
    "머리": [
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ④. 선택한 순서는 관계없다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다."
   ],
   "figure": "combustion-question-data-41"
  },
  {
   "id": "c22-s62-u02-w042",
   "no": 42,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T01",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "관찰 방법을 고쳐야 하는 행동을 모두 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "시간 차이는 비교 조건을 바꾸고 손 대기는 안전하지 않아요. 알코올에는 남은 액체의 모습을 기록해야 하며 양초에만 해당하는 촛농 특징을 공통으로 강요하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "온도계를 불꽃 밖 같은 위치에 고정한다.",
    "한 연료만 긴 시간 보고 결과를 비교한다.",
    "온도 상승을 확인하려고 손을 불꽃에 댄다.",
    "빛·열·남은 연료를 나누어 기록한다.",
    "알코올에는 양초의 촛농 항목을 그대로 채운다."
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
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요."
  },
  {
   "id": "c22-s62-u02-w043",
   "no": 43,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T01",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "바깥 온도계의 상승 폭을 구하세요. (1)양초 (2)알코올. 단위를 함께 쓰세요.",
   "answer": "9℃ / 6℃",
   "explanation": "32−23=9℃,29−23=6℃의 상승이에요. 온도 변화의 크기를 구한 것이며 이 숫자가 불꽃의 내부 온도나 연료의 발화점을 나타내지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "value": 9,
      "units": [
       "℃",
       "도",
       "°C"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "9℃"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 6,
      "units": [
       "℃",
       "도",
       "°C"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "6℃"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "verificationModel": {
    "kind": "fuel-temperature-rises",
    "answers": [
     9,
     6
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 9℃ (단위 필요) / (2) 6℃ (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-43"
  },
  {
   "id": "c22-s62-u02-w044",
   "no": 44,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "(1)두 연료 공통 현상을 쓴 카드 (2)확인하지 않은 공통점을 보탠 카드의 기호를 쓰세요.",
   "answer": "ㄱ / ㄴ",
   "explanation": "ㄱ은 관찰한 공통점이고 ㄴ의 소모량·속도는 같게 재지 않았어요. ㄷ은 비교 방법이며 두 연료의 모습이 같다는 결론은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다. 참고 기록: 두 연료 모두 빛이 확인됐고 바깥 온도계는 양초23→32℃, 알코올23→29℃였다.",
   "table": {
    "머리": [
     "카드",
     "설명"
    ],
    "행": [
     [
      "ㄱ",
      "둘 다 빛과 열을 낸다."
     ],
     [
      "ㄴ",
      "둘 다 같은 시간에 같은 양만큼 줄어든다."
     ],
     [
      "ㄷ",
      "연료의 남은 모습을 따로 기록한다."
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다. 참고 기록: 두 연료 모두 빛이 확인됐고 바깥 온도계는 양초23→32℃, 알코올23→29℃였다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-44"
  },
  {
   "id": "c22-s62-u02-w045",
   "no": 45,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "불꽃의 색이 서로 다르므로 한쪽은 연소가 아니라는 주장을 검토하세요.",
   "answer": "색은 다를 수 있지만 두 연료 모두 산소와 빠르게 반응하며 빛과 열을 내는지 근거로 판단한다. 색이 같아야 연소인 것은 아니다.",
   "explanation": "차이가 있다는 사실이 공통 현상을 없애지 않아요. 연소의 성격을 색 하나로 정하지 않는 설명을 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "불꽃 색의 차이와 현상 판단을 구별한다.",
    "공통 빛·열의 근거를 사용한다.",
    "색을 같은 조건으로 강제하지 않는다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "색은 다를 수 있지만 두 연료 모두 산소와 빠르게 반응하며 빛과 열을 내는지 근거로 판단한다. 색이 같아야 연소인 것은 아니다.",
    "required": [
     "불꽃 색의 차이와 현상 판단을 구별한다.",
     "공통 빛·열의 근거를 사용한다.",
     "색을 같은 조건으로 강제하지 않는다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "불꽃 색의 차이와 현상 판단을 구별한다. / 공통 빛·열의 근거를 사용한다. / 색을 같은 조건으로 강제하지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w046",
   "no": 46,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T01",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "32℃가29℃보다 높으므로 양초가 항상 더 효율적인 연료라는 결론을 평가하세요.",
   "answer": "기록은 특정 위치 바깥 온도계의 값이다. 연료 투입량·소모량과 유용하게 얻은 에너지를 함께 비교하지 않았으므로 항상 더 효율적이라고 할 수 없다.",
   "explanation": "결론은 제시한 양과 조건에서만 정당화할 수 있어요. 높은 표시만으로 연료의 보편적인 성능 순위를 만들지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "측정한 온도의 위치·조건을 밝힌다.",
    "온도 표시와 효율을 구별한다.",
    "추가로 필요한 투입량/얻은 에너지를 말한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "기록은 특정 위치 바깥 온도계의 값이다. 연료 투입량·소모량과 유용하게 얻은 에너지를 함께 비교하지 않았으므로 항상 더 효율적이라고 할 수 없다.",
    "required": [
     "측정한 온도의 위치·조건을 밝힌다.",
     "온도 표시와 효율을 구별한다.",
     "추가로 필요한 투입량/얻은 에너지를 말한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "연료",
     "빛 발생",
     "바깥 온도계 처음/40초 뒤"
    ],
    "행": [
     [
      "양초",
      "확인",
      "23℃ / 32℃"
     ],
     [
      "알코올",
      "확인",
      "23℃ / 29℃"
     ]
    ]
   },
   "givens": "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다.",
   "modelRef": "fuel",
   "formLabel": "까닭 설명",
   "criteria": "측정한 온도의 위치·조건을 밝힌다. / 온도 표시와 효율을 구별한다. / 추가로 필요한 투입량/얻은 에너지를 말한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "given": [
    "교사가 만든 연습 기록이다. 온도계는 불꽃 밖의 같은 거리·위치에 두었다. 연료량과 연소한 양을 같게 맞춘 효율 비교가 아니며 불꽃 내부 온도도 아니다."
   ],
   "lines": 6,
   "figure": "combustion-question-data-46"
  },
  {
   "id": "c22-s62-u02-w047",
   "no": 47,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T02",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "두 연료의 공통점과 차이점을 담을 비교표를 그리세요. 빛·열·남은 연료와 미관찰 칸을 구별하세요.",
   "answer": "같은 관찰 항목을 두 연료에 나란히 두고 빛·열의 공통 근거와 고체/액체의 다른 남은 모습을 적을 자리를 만든다. 보지 못한 값은 미관찰로 둔다.",
   "explanation": "두 연료를 똑같은 모양으로 그리는 문제가 아니에요. 서로 다른 연료에서도 공통 근거를 읽을 수 있는 표인지 살펴요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "같은 항목으로 나란히 비교한다.",
    "공통 현상과 연료별 특징을 나눈다.",
    "자료 종류·미관찰을 표시한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 관찰 항목을 두 연료에 나란히 두고 빛·열의 공통 근거와 고체/액체의 다른 남은 모습을 적을 자리를 만든다. 보지 못한 값은 미관찰로 둔다.",
    "required": [
     "같은 항목으로 나란히 비교한다.",
     "공통 현상과 연료별 특징을 나눈다.",
     "자료 종류·미관찰을 표시한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "같은 항목으로 나란히 비교한다. / 공통 현상과 연료별 특징을 나눈다. / 자료 종류·미관찰을 표시한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w048",
   "no": 48,
   "section": 3,
   "sectionTitle": "양초와 알코올의 공통 현상",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T01",
   "topic": "양초와 알코올의 공통 현상",
   "prompt": "교사 시범을 안전하게 관찰하는 배치를 그리세요. 학생 안전선과 불꽃 밖 온도계 위치, 교사가 맡을 조작을 표시하세요.",
   "answer": "교사 시범대와 학생 안전선을 구분하고 두 비교의 온도계 거리·위치를 같게 나타낸다. 점화·연료·뜨거운 기구 조작은 교사 담당으로 쓴다.",
   "explanation": "실험 장치의 공학 설계를 요구하지 않아요. 안전한 관찰과 공정한 위치 비교가 동시에 가능한 설명인지 교사가 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "학생·열원 사이 안전선을 구분한다.",
    "온도계의 같은 바깥 위치를 나타낸다.",
    "교사 조작 범위를 명시한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "교사 시범대와 학생 안전선을 구분하고 두 비교의 온도계 거리·위치를 같게 나타낸다. 점화·연료·뜨거운 기구 조작은 교사 담당으로 쓴다.",
    "required": [
     "학생·열원 사이 안전선을 구분한다.",
     "온도계의 같은 바깥 위치를 나타낸다.",
     "교사 조작 범위를 명시한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "학생·열원 사이 안전선을 구분한다. / 온도계의 같은 바깥 위치를 나타낸다. / 교사 조작 범위를 명시한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "양초·알코올의 공통 현상은 빛과 열이에요. 같은 불꽃색·그을음이나 모든 물질의 같은 생성물을 필수 공통점으로 만들지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w049",
   "no": 49,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T05",
   "topic": "불이 계속 타는 조건",
   "prompt": "A·B 비교에서 자료와 맞는 설명을 고르세요.",
   "answer": "① B는 처음 공기량이 많고 더 오래 탔다.",
   "explanation": "B의 공기 부피600mL와47초가A의300mL·28초보다 커요. 같은 공기 조성이므로 산소 비율을 두 배로 바꾸거나 지속 시간의 정확한 비례를 주장할 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "B는 처음 공기량이 많고 더 오래 탔다.",
    "B의 산소 비율은A의 두 배로 높았다.",
    "B는 공기량이 두 배라 정확히 두 배 탔다.",
    "A가 꺼졌으므로 그 안의 산소는0%다.",
    "시간 차이는 두 초의 재질 차이 때문이다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "table": {
    "머리": [
     "덮개",
     "처음 공기 부피(mL)",
     "불꽃이 이어진 시간(초)"
    ],
    "행": [
     [
      "A",
      300,
      28
     ],
     [
      "B",
      600,
      47
     ]
    ]
   },
   "givens": "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
   "modelRef": "cover",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ① B는 처음 공기량이 많고 더 오래 탔다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다."
   ],
   "figure": "combustion-question-data-49"
  },
  {
   "id": "c22-s62-u02-w050",
   "no": 50,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T07",
   "topic": "불이 계속 타는 조건",
   "prompt": "책상 위 마른 나무에 산소가 닿아도 바로 타지 않습니다. 더 살펴볼 조건은 무엇인가요?",
   "answer": "④ 타기 시작할 만큼 높은 온도",
   "explanation": "연료와 산소만으로 타고 있다고 할 수 없어요. 일반적인 연소에는 발화점 이상의 온도 조건도 필요하며 빛을 비추는 것만으로 그 온도가 되었다고 보지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "산소를 모두 없앤 진공 상태",
    "나무의 이름을 적은 종이 표시",
    "불빛을 비추어 생기는 그림자",
    "타기 시작할 만큼 높은 온도",
    "책상의 위치를 적은 안내 번호"
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ 타기 시작할 만큼 높은 온도",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요."
  },
  {
   "id": "c22-s62-u02-w051",
   "no": 51,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T08",
   "topic": "불이 계속 타는 조건",
   "prompt": "연소에 필요한 조건은 탈 물질, (1), 발화점 (2)의 온도예요. 두 번째 칸은 이상·미만 중 골라요.",
   "answer": "산소 / 이상",
   "explanation": "탈 물질과 산소가 있어도 타기 시작하는 데 필요한 온도 조건을 만족해야 해요. 발화점 미만과 이상을 반대로 적지 않도록 세 조건을 함께 읽어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "산소"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "이상"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 산소 / (2) 이상. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w052",
   "no": 52,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T05",
   "topic": "불이 계속 타는 조건",
   "prompt": "같은 조성의 공기가 더 큰 부피로 들어 있으면 처음 산소의 양은 더 (1). 산소가 차지하는 비율은 두 경우에 (2).",
   "answer": "많다 / 같다",
   "explanation": "같은 비율의 공기에서 전체량이 늘면 산소량도 늘어요. 전체 공기의 부피와 그중 산소가 차지하는 비율은 다른 양이므로 서로 바꾸어 설명하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "많다",
       "많아요"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "같다",
       "같아요"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "덮개",
     "처음 공기 부피(mL)",
     "불꽃이 이어진 시간(초)"
    ],
    "행": [
     [
      "A",
      300,
      28
     ],
     [
      "B",
      600,
      47
     ]
    ]
   },
   "givens": "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
   "modelRef": "cover",
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 많다 또는 많아요 / (2) 같다 또는 같아요. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-52"
  },
  {
   "id": "c22-s62-u02-w053",
   "no": 53,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T08",
   "topic": "불이 계속 타는 조건",
   "prompt": "연소 조건을 제한한 설명 모형과 조건을 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "각 모형은 연료·산소·온도 조건 중 하나를 분리해 설명해요. 실제 바람이나 소화 과정에 여러 작용이 함께 있을 수 있다는 한계와 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 기체 연료 공급관의 흐름을 막는 모형",
    "(2) 바깥 산소 공급을 제한하는 모형",
    "(3) 온도를 발화점 아래로 낮춘 모형"
   ],
   "options": [
    "ㄱ 온도",
    "ㄴ 탈 물질 공급",
    "ㄷ 산소 공급"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "givens": "조건을 한 가지씩만 바꾸는 설명 모형이다. 학생이 불을 다루는 절차가 아니다.",
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "조건을 한 가지씩만 바꾸는 설명 모형이다. 학생이 불을 다루는 절차가 아니다.",
    "ㄱ 온도",
    "ㄴ 탈 물질 공급",
    "ㄷ 산소 공급"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w054",
   "no": 54,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T04",
   "topic": "불이 계속 타는 조건",
   "prompt": "덮개 비교의 항목과 역할을 연결하세요.",
   "answer": "ㄷ / ㄴ / ㄱ",
   "explanation": "공기 부피만 달리하고 시간을 비교하며 초와 처음 상태를 맞춰요. 연료 조건도 달라지면 지속 시간 차이를 공기량 하나의 영향으로 보기 어려워요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 덮개 안 처음 공기 부피",
    "(2) 불꽃이 이어진 시간",
    "(3) 초·초기 불꽃·공기 조성"
   ],
   "options": [
    "ㄱ 같게 둘 조건",
    "ㄴ 관찰할 결과",
    "ㄷ 달리할 조건"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "table": {
    "머리": [
     "덮개",
     "처음 공기 부피(mL)",
     "불꽃이 이어진 시간(초)"
    ],
    "행": [
     [
      "A",
      300,
      28
     ],
     [
      "B",
      600,
      47
     ]
    ]
   },
   "givens": "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
   "modelRef": "cover",
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄴ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
    "ㄱ 같게 둘 조건",
    "ㄴ 관찰할 결과",
    "ㄷ 달리할 조건"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-54"
  },
  {
   "id": "c22-s62-u02-w055",
   "no": 55,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T04",
   "topic": "불이 계속 타는 조건",
   "prompt": "덮개 비교에서 다른 굵기의 초를 쓴 것을 발견했습니다. 순서대로 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "바꾸지 말아야 할 조건이 섞였음을 먼저 인정하고 재비교를 계획해요. 원래 값을 지우거나 조건을 맞춘 것처럼 바꾸어 기록하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 교사와 같은 초·처음 상태로 재비교를 계획한다.",
    "ㄴ 초 굵기 차이도 결과에 섞일 수 있음을 밝힌다.",
    "ㄷ 조건을 맞춘 새 기록과 원래 기록을 구분한다."
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
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "ㄱ 교사와 같은 초·처음 상태로 재비교를 계획한다.",
    "ㄴ 초 굵기 차이도 결과에 섞일 수 있음을 밝힌다.",
    "ㄷ 조건을 맞춘 새 기록과 원래 기록을 구분한다."
   ]
  },
  {
   "id": "c22-s62-u02-w056",
   "no": 56,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T05",
   "topic": "불이 계속 타는 조건",
   "prompt": "공기량 비교의 추론을 조건→산소량→관찰 연결 순서로 배열하세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "같은 조성·다른 부피가 처음 산소량 차이를 만들고 지속 시간 관찰과 연결돼요. 관찰한47초를 공기 부피만으로 계산한 법칙으로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 처음 산소가 상대적으로 더 많이 들어 있다.",
    "ㄴ 같은 조성의 공기를 더 큰 부피로 담았다.",
    "ㄷ 더 오래 이어진 기록을 처음 산소량과 연결한다."
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
     "덮개",
     "처음 공기 부피(mL)",
     "불꽃이 이어진 시간(초)"
    ],
    "행": [
     [
      "A",
      300,
      28
     ],
     [
      "B",
      600,
      47
     ]
    ]
   },
   "givens": "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
   "modelRef": "cover",
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄱ → ㄷ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
    "ㄱ 처음 산소가 상대적으로 더 많이 들어 있다.",
    "ㄴ 같은 조성의 공기를 더 큰 부피로 담았다.",
    "ㄷ 더 오래 이어진 기록을 처음 산소량과 연결한다."
   ],
   "figure": "combustion-question-data-56"
  },
  {
   "id": "c22-s62-u02-w057",
   "no": 57,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T05",
   "topic": "불이 계속 타는 조건",
   "prompt": "덮개 표에서 타당한 해석을 고르세요. (정답 3개)",
   "answer": "①, ③, ⑤",
   "explanation": "같은 조성과 더 큰 부피에서 산소량이 많고B가 오래 이어졌다고 읽어요.47초는28초의 두 배가 아니며 꺼짐 자체는 산소0%의 증거가 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "A와B의 처음 산소 비율은 같은 조건이다.",
    "B의 시간은A의 정확히 두 배이다.",
    "처음 산소의 양은B가 상대적으로 많다.",
    "불이 꺼지면 산소가 완전히 없어졌다고 확정한다.",
    "주어진 기록에서B의 불꽃이 더 오래 이어졌다."
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
     "덮개",
     "처음 공기 부피(mL)",
     "불꽃이 이어진 시간(초)"
    ],
    "행": [
     [
      "A",
      300,
      28
     ],
     [
      "B",
      600,
      47
     ]
    ]
   },
   "givens": "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
   "modelRef": "cover",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다."
   ],
   "figure": "combustion-question-data-57"
  },
  {
   "id": "c22-s62-u02-w058",
   "no": 58,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T08",
   "topic": "불이 계속 타는 조건",
   "prompt": "연소 조건을 검토하는 올바른 질문을 고르세요. (정답 3개)",
   "answer": "②, ③, ④",
   "explanation": "연료·산소·온도 조건을 각각 근거로 검토해야 해요. 색이나 밝기 하나가 세 조건을 대신한다고 보지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "종이의 색만 밝으면 저절로 타는가?",
    "연료가 계속 공급되는 조건인가?",
    "산소 공급을 비교한 근거가 있는가?",
    "발화점 이상의 온도 조건을 갖췄는가?",
    "정해진 불꽃 색이면 세 조건은 필요 없는가?"
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
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요."
  },
  {
   "id": "c22-s62-u02-w059",
   "no": 59,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T05",
   "topic": "불이 계속 타는 조건",
   "prompt": "B에서A를 뺀 차를 구하세요. (1)처음 공기 부피 (2)불꽃이 이어진 시간. 단위를 써요.",
   "answer": "300mL / 19초",
   "explanation": "600−300=300mL,47−28=19초예요. 부피 차와 시간 차는 서로 다른 양이며 두 비율이 정확히 같아야 한다고 정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "value": 300,
      "units": [
       "mL",
       "ml",
       "밀리리터"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "300mL"
      ]
     },
     {
      "label": "(2)",
      "kind": "number-unit",
      "value": 19,
      "units": [
       "초",
       "s"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "19초"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "덮개",
     "처음 공기 부피(mL)",
     "불꽃이 이어진 시간(초)"
    ],
    "행": [
     [
      "A",
      300,
      28
     ],
     [
      "B",
      600,
      47
     ]
    ]
   },
   "givens": "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
   "modelRef": "cover",
   "verificationModel": {
    "kind": "cover-differences",
    "answers": [
     300,
     19
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 300mL (단위 필요) / (2) 19초 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-59"
  },
  {
   "id": "c22-s62-u02-w060",
   "no": 60,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T06",
   "topic": "불이 계속 타는 조건",
   "prompt": "산소 센서의 연습 기록에서 (1)산소 비율이 낮은 시점의 기호 (2)불이 꺼진 뒤에도 남아 있는 기체 이름을 쓰세요.",
   "answer": "ㄴ / 산소",
   "explanation": "17.4%는20.9%보다 낮지만0%는 아니에요. 불이 꺼졌다는 사실과 산소가 모두 없어졌다는 주장을 구별하면 두 답을 연결할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "ㄴ"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "산소"
      ]
     }
    ]
   },
   "givens": "센서 읽기를 연습하는 가상 표다. 특정 연료가 반드시 이 비율에서 꺼진다는 기준표는 아니다.",
   "table": {
    "머리": [
     "시점",
     "산소 비율",
     "불꽃"
    ],
    "행": [
     [
      "ㄱ",
      "20.9%",
      "켜짐"
     ],
     [
      "ㄴ",
      "17.4%",
      "꺼짐"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄴ / (2) 산소. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "센서 읽기를 연습하는 가상 표다. 특정 연료가 반드시 이 비율에서 꺼진다는 기준표는 아니다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-60"
  },
  {
   "id": "c22-s62-u02-w061",
   "no": 61,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T05",
   "topic": "불이 계속 타는 조건",
   "prompt": "공기 부피를 두 배로 했으니 연소 시간도 언제나 두 배라는 주장을 표로 검토하세요.",
   "answer": "300→600mL는 두 배지만28→47초는 두 배가 아니다. 이 조건의 시간 차이는 읽을 수 있으나 공기 부피와 시간이 언제나 정확히 비례한다고 할 수 없다.",
   "explanation": "두 값이 함께 커졌다고 비율까지 같은 것은 아니에요. 원인 비교와 수학적 비례를 구별한 설명을 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "부피와 시간의 실제 수치를 비교한다.",
    "정확한 비례와 더 오래 이어짐을 구별한다.",
    "결론을 제시 조건으로 제한한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "300→600mL는 두 배지만28→47초는 두 배가 아니다. 이 조건의 시간 차이는 읽을 수 있으나 공기 부피와 시간이 언제나 정확히 비례한다고 할 수 없다.",
    "required": [
     "부피와 시간의 실제 수치를 비교한다.",
     "정확한 비례와 더 오래 이어짐을 구별한다.",
     "결론을 제시 조건으로 제한한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "덮개",
     "처음 공기 부피(mL)",
     "불꽃이 이어진 시간(초)"
    ],
    "행": [
     [
      "A",
      300,
      28
     ],
     [
      "B",
      600,
      47
     ]
    ]
   },
   "givens": "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다.",
   "modelRef": "cover",
   "formLabel": "까닭 설명",
   "criteria": "부피와 시간의 실제 수치를 비교한다. / 정확한 비례와 더 오래 이어짐을 구별한다. / 결론을 제시 조건으로 제한한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "given": [
    "같은 초·초기 불꽃·공기 조성·온도·관찰 방법을 맞춘 교사 시범의 가상 기록이다. 적합한 내열 덮개와 받침은 교사가 다루며 학생이 점화·덮개 조작을 하지 않는다. 계속 드나드는 공기 틈은 없는 비교다."
   ],
   "lines": 6,
   "figure": "combustion-question-data-61"
  },
  {
   "id": "c22-s62-u02-w062",
   "no": 62,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T08",
   "topic": "불이 계속 타는 조건",
   "prompt": "두 시범에서 불이 꺼졌으므로 같은 조건이 바뀌었다는 설명을 평가하세요.",
   "answer": "꺼졌다는 결과만으로 같은 원인인지 알 수 없다. 연료 흐름·산소 공급·온도 가운데 실제로 바꾼 조건과 다른 영향이 있었는지 비교해야 한다.",
   "explanation": "입으로 불거나 바람을 보내는 실제 현상을 한 기작으로 고정하지 않아요. 조건이 분리된 모형과 실제 상황을 구별하면 여러 설명을 인정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "같은 결과와 같은 원인을 구별한다.",
    "바뀐 조건의 근거를 요구한다.",
    "가능한 다른 영향을 한 가지 제시한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "꺼졌다는 결과만으로 같은 원인인지 알 수 없다. 연료 흐름·산소 공급·온도 가운데 실제로 바꾼 조건과 다른 영향이 있었는지 비교해야 한다.",
    "required": [
     "같은 결과와 같은 원인을 구별한다.",
     "바뀐 조건의 근거를 요구한다.",
     "가능한 다른 영향을 한 가지 제시한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "같은 결과와 같은 원인을 구별한다. / 바뀐 조건의 근거를 요구한다. / 가능한 다른 영향을 한 가지 제시한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w063",
   "no": 63,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T04",
   "topic": "불이 계속 타는 조건",
   "prompt": "덮개 안 공기량만 비교하는 교사 시범 계획도를 그리세요. 달리할 조건·같게 둘 조건·시간 기록 위치를 표시하세요.",
   "answer": "두 내열 덮개의 부피만 다르게 나타내고 같은 초·초기 불꽃·조성·온도와 같은 시간 측정 방법을 표시한다. 교사 조작과 학생 안전선을 구분한다.",
   "explanation": "장치의 정확한 크기 설계보다 공정 비교 조건이 드러나야 해요. 학생에게 점화·뜨거운 덮개 조작을 지시하는 그림은 고쳐요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "부피 차이를 표시한다.",
    "초·처음 상태·공기 조성을 맞춘다.",
    "관찰 결과와 안전 범위를 구분한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "두 내열 덮개의 부피만 다르게 나타내고 같은 초·초기 불꽃·조성·온도와 같은 시간 측정 방법을 표시한다. 교사 조작과 학생 안전선을 구분한다.",
    "required": [
     "부피 차이를 표시한다.",
     "초·처음 상태·공기 조성을 맞춘다.",
     "관찰 결과와 안전 범위를 구분한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "부피 차이를 표시한다. / 초·처음 상태·공기 조성을 맞춘다. / 관찰 결과와 안전 범위를 구분한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w064",
   "no": 64,
   "section": 4,
   "sectionTitle": "불이 계속 타는 조건",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T08",
   "topic": "불이 계속 타는 조건",
   "prompt": "연소의 세 조건을 중심에 두고 각 조건을 비교할 때 필요한 근거를 연결한 생각 지도를 만드세요.",
   "answer": "탈 물질·산소·발화점 이상의 온도를 나누고 공급/비교 기록·센서/공기 조건·온도 조건 등 근거를 연결한다. 꺼짐만으로 원인을 확정하지 않는 메모를 단다.",
   "explanation": "불꽃 색 그림을 많이 그리는 것보다 조건과 증거의 관계를 분명히 했는지 확인해요. 모형의 한계도 타당하면 인정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "세 조건을 빠짐없이 구분한다.",
    "각 조건에 맞는 근거를 연결한다.",
    "한 결과로 원인을 단정하지 않는다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "탈 물질·산소·발화점 이상의 온도를 나누고 공급/비교 기록·센서/공기 조건·온도 조건 등 근거를 연결한다. 꺼짐만으로 원인을 확정하지 않는 메모를 단다.",
    "required": [
     "세 조건을 빠짐없이 구분한다.",
     "각 조건에 맞는 근거를 연결한다.",
     "한 결과로 원인을 단정하지 않는다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "세 조건을 빠짐없이 구분한다. / 각 조건에 맞는 근거를 연결한다. / 한 결과로 원인을 단정하지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "연료·산소·발화점 이상의 온도를 함께 살펴요. 덮개 뒤 꺼짐 하나만으로 산소의 완전 소진이나 공기의 전부 소모를 확정하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w065",
   "no": 65,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "물 확인에 맞는 시험과 관찰을 고르세요.",
   "answer": "② 푸른 염화 코발트 종이의 색 변화",
   "explanation": "푸른 염화 코발트 종이의 물 확인 반응을 이용해요. 시험지의 색 변화를 관찰하고 대조와 비교해야 하며 그 변화가 물의 질량·부피 수치를 주지는 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "석회수만으로 물의 질량을 재는 방법",
    "푸른 염화 코발트 종이의 색 변화",
    "젓개 모양만으로 기체 이름을 읽는 방법",
    "불꽃 색으로 물의 부피를 정하는 방법",
    "같은 컵의 높이만 보고 물을 구별하는 방법"
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 푸른 염화 코발트 종이의 색 변화",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요."
  },
  {
   "id": "c22-s62-u02-w066",
   "no": 66,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "빈 대조의 시험지도 붉게 변했다면 먼저 살펴볼 것은 무엇인가요?",
   "answer": "⑤ 보관 상태와 주변 습기의 영향",
   "explanation": "대조도 변했다면 처음 시험지 상태나 배경 습기 등이 영향을 주었는지 확인해야 해요. 연소 뒤 변화만 떼어 연소 때문에 생긴 물이라고 단정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "원하는 결론에 맞는 종이 색 번호",
    "불꽃 색이 교재 그림과 같은 정도",
    "관찰한 학생 이름의 가나다 순서",
    "연소 후 결과만 남기는 표의 모양",
    "보관 상태와 주변 습기의 영향"
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ⑤ 보관 상태와 주변 습기의 영향",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요."
  },
  {
   "id": "c22-s62-u02-w067",
   "no": 67,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "물을 확인하는 종이는 처음 (1)색이고 물에 닿은 뒤 (2)색 계열로 변해요.",
   "answer": "푸른 / 붉은",
   "explanation": "처음 푸른색과 물 확인 뒤 붉은색 계열의 변화를 연결해요. 종이 이름과 반응에서 판단하는 물질 이름은 서로 다른 답이에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "푸른",
       "파란",
       "청"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "붉은",
       "분홍",
       "홍"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 푸른 또는 파란 또는 청 / (2) 붉은 또는 분홍 또는 홍. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w068",
   "no": 68,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "시험지 색이 변했다는 말은 (1)이고, 대조와 시험 원리를 근거로 물이 있음을 판단한 것은 (2)이에요. 보기: 관찰·해석",
   "answer": "관찰 / 해석",
   "explanation": "눈으로 읽은 색 변화와 물질 이름의 판단을 나누어요. 해석은 관찰·대조·확인 원리를 함께 근거로 삼아야 타당해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "관찰"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "해석"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교",
     "초 연소 뒤"
    ],
    "행": [
     [
      "1",
      "푸른색",
      "붉은색"
     ],
     [
      "2",
      "푸른색",
      "붉은색"
     ],
     [
      "3",
      "푸른색",
      "붉은색"
     ]
    ]
   },
   "givens": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
   "modelRef": "paperTrials",
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 관찰 / (2) 해석. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-68"
  },
  {
   "id": "c22-s62-u02-w069",
   "no": 69,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "시험의 항목과 역할을 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "시험 도구·대조·관찰 결과는 다른 역할이에요. 종이 자체가 연소에서 생성된 물질이라는 설명과 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 푸른 염화 코발트 종이",
    "(2) 불을 켜지 않은 비교",
    "(3) 붉은색으로 달라진 기록"
   ],
   "options": [
    "ㄱ 직접 관찰한 변화",
    "ㄴ 물 확인 도구",
    "ㄷ 배경 영향을 비교하는 대조"
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
     "반복",
     "불을 켜지 않은 비교",
     "초 연소 뒤"
    ],
    "행": [
     [
      "1",
      "푸른색",
      "붉은색"
     ],
     [
      "2",
      "푸른색",
      "붉은색"
     ],
     [
      "3",
      "푸른색",
      "붉은색"
     ]
    ]
   },
   "givens": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
   "modelRef": "paperTrials",
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄷ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
    "ㄱ 직접 관찰한 변화",
    "ㄴ 물 확인 도구",
    "ㄷ 배경 영향을 비교하는 대조"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-69"
  },
  {
   "id": "c22-s62-u02-w070",
   "no": 70,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "대조 문제와 필요한 점검을 연결하세요.",
   "answer": "ㄴ / ㄱ / ㄷ",
   "explanation": "시작 상태·시간·배경 영향이 다르면 연소 때문인 차이를 분리하기 어려워요. 세 점검을 결과에 맞춰 바꾸기보다 원인에 맞게 적용해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 시험 전부터 종이가 붉음",
    "(2) 두 자료의 관찰 시간이 다름",
    "(3) 대조도 같은 색 변화를 보임"
   ],
   "options": [
    "ㄱ 같은 시간으로 비교 조건을 맞춤",
    "ㄴ 보관·처음 상태를 확인",
    "ㄷ 주변 습기 등 다른 원인을 검토"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "(1) ㄴ / (2) ㄱ / (3) ㄷ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "ㄱ 같은 시간으로 비교 조건을 맞춤",
    "ㄴ 보관·처음 상태를 확인",
    "ㄷ 주변 습기 등 다른 원인을 검토"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w071",
   "no": 71,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "교사가 하는 물 확인 자료 읽기 순서를 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "처음 상태를 확인하고 같은 기준으로 비교한 뒤 물질 판단을 해요. 붉은색이라는 결과만으로 출처나 비교 조건을 생략하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 같은 시간의 연소 전후·대조 색을 비교한다.",
    "ㄴ 대조와 달라진 반응을 물 확인 원리와 연결한다.",
    "ㄷ 시험지의 처음 색과 조건을 확인한다."
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
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "ㄱ 같은 시간의 연소 전후·대조 색을 비교한다.",
    "ㄴ 대조와 달라진 반응을 물 확인 원리와 연결한다.",
    "ㄷ 시험지의 처음 색과 조건을 확인한다."
   ]
  },
  {
   "id": "c22-s62-u02-w072",
   "no": 72,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "설명을 관찰→비교 근거→물질 판단 순서로 쓰세요.",
   "answer": "ㄱ → ㄴ → ㄷ",
   "explanation": "먼저 색 변화와 대조를 읽고 확인 원리에 따라 물이라는 해석을 이어요. 관찰과 결론의 순서를 뒤집어 원한 물질을 봤다고 하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 연소 뒤 시험지가 푸른색에서 붉은색으로 변했다.",
    "ㄴ 조건을 맞춘 대조는 푸른색을 유지했다.",
    "ㄷ 물 확인 반응을 근거로 연소 뒤 물을 판단한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ]
   },
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교",
     "초 연소 뒤"
    ],
    "행": [
     [
      "1",
      "푸른색",
      "붉은색"
     ],
     [
      "2",
      "푸른색",
      "붉은색"
     ],
     [
      "3",
      "푸른색",
      "붉은색"
     ]
    ]
   },
   "givens": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
   "modelRef": "paperTrials",
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄱ → ㄴ → ㄷ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
    "ㄱ 연소 뒤 시험지가 푸른색에서 붉은색으로 변했다.",
    "ㄴ 조건을 맞춘 대조는 푸른색을 유지했다.",
    "ㄷ 물 확인 반응을 근거로 연소 뒤 물을 판단한다."
   ],
   "figure": "combustion-question-data-72"
  },
  {
   "id": "c22-s62-u02-w073",
   "no": 73,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "물 확인 기록에서 실제 제시된 내용을 고르세요. (정답 3개)",
   "answer": "①, ③, ⑤",
   "explanation": "세 반복의 색·같은 조건·교사 관리가 제시돼 있어요. 대조는 푸른색이고 표는 물의 질량 자료가 아니므로 다른 결과를 더하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "세 번 모두 연소 뒤 종이는 붉은색이다.",
    "빈 대조도 세 번 모두 붉은색이다.",
    "같은 시작 상태와 시간을 맞췄다.",
    "물의 정확한 질량을 표에서 읽을 수 있다.",
    "시험지와 폐기는 교사가 관리한다."
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
     "반복",
     "불을 켜지 않은 비교",
     "초 연소 뒤"
    ],
    "행": [
     [
      "1",
      "푸른색",
      "붉은색"
     ],
     [
      "2",
      "푸른색",
      "붉은색"
     ],
     [
      "3",
      "푸른색",
      "붉은색"
     ]
    ]
   },
   "givens": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
   "modelRef": "paperTrials",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다."
   ],
   "figure": "combustion-question-data-73"
  },
  {
   "id": "c22-s62-u02-w074",
   "no": 74,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "색 변화의 해석을 약하게 만드는 상황을 고르세요. (정답 3개)",
   "answer": "①, ③, ⑤",
   "explanation": "시작·연소 전·보관 조건이 빠지면 색 차이에 다른 원인이 섞일 수 있어요. 시간과 종류를 맞춘 비교 자체는 해석을 약하게 하는 상황이 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "처음 시험지 상태를 기록하지 않았다.",
    "대조와 같은 시간에 색을 비교했다.",
    "연소 전 자료 없이 연소 후만 보았다.",
    "같은 종류의 종이로 반복했다.",
    "보관 습기가 다른 종이를 섞어 썼다."
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
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요."
  },
  {
   "id": "c22-s62-u02-w075",
   "no": 75,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "세 반복 중 (1)연소 뒤 붉은색인 횟수 (2)대조에서 붉은색인 횟수를 단위와 함께 쓰세요.",
   "answer": "3회 / 0회",
   "explanation": "연소 뒤 세 칸은 모두 붉은색이라3회이고 대조는 모두 푸른색이라0회예요. 횟수는 관찰된 반응의 반복이지 물이3g 생겼다는 양이 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "value": 0,
      "units": [
       "회",
       "번"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "0회"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교",
     "초 연소 뒤"
    ],
    "행": [
     [
      "1",
      "푸른색",
      "붉은색"
     ],
     [
      "2",
      "푸른색",
      "붉은색"
     ],
     [
      "3",
      "푸른색",
      "붉은색"
     ]
    ]
   },
   "givens": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
   "modelRef": "paperTrials",
   "verificationModel": {
    "kind": "water-response-counts",
    "answers": [
     3,
     0
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 3회 (단위 필요) / (2) 0회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-75"
  },
  {
   "id": "c22-s62-u02-w076",
   "no": 76,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "물 확인에 유리한 비교와 판단을 보류할 비교를 구별하세요. (1)조건과 결과가 갖춰진 것 (2)대조도 변한 것",
   "answer": "ㄱ / ㄴ",
   "explanation": "ㄱ은 같은 조건에서 대조와 다른 반응을 보였어요. ㄴ은 대조도 변해 배경 영향을 검토해야 하고 ㄷ은 대조 자체를 관찰하지 않아 별도의 한계가 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
     "대조/연소 뒤 결과",
     "조건"
    ],
    "행": [
     [
      "ㄱ",
      "푸름/붉음",
      "처음·시간 맞춤"
     ],
     [
      "ㄴ",
      "붉음/붉음",
      "배경 영향 미확인"
     ],
     [
      "ㄷ",
      "미관찰/붉음",
      "대조 기록 없음"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-76"
  },
  {
   "id": "c22-s62-u02-w077",
   "no": 77,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "시험지가 붉어졌으니 종이 자체가 초에서 새로 만들어졌다는 주장을 고치세요.",
   "answer": "시험지는 교사가 준비한 물 확인 도구다. 변한 것은 시험지의 색이며 그 반응과 대조를 근거로 물을 판단한다. 종이가 초에서 만들어진 것은 아니다.",
   "explanation": "검출 도구와 검출하는 물질을 바꾸어 쓰지 않아요. 예시 문장 그대로가 아니라 역할 구분과 추론의 연결을 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "준비한 도구와 생성물을 구별한다.",
    "관찰한 것은 색 변화임을 말한다.",
    "대조·확인 원리로 물 판단을 연결한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "시험지는 교사가 준비한 물 확인 도구다. 변한 것은 시험지의 색이며 그 반응과 대조를 근거로 물을 판단한다. 종이가 초에서 만들어진 것은 아니다.",
    "required": [
     "준비한 도구와 생성물을 구별한다.",
     "관찰한 것은 색 변화임을 말한다.",
     "대조·확인 원리로 물 판단을 연결한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "준비한 도구와 생성물을 구별한다. / 관찰한 것은 색 변화임을 말한다. / 대조·확인 원리로 물 판단을 연결한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w078",
   "no": 78,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "반복 세 번이 같으니 대조는 없어도 된다는 설명을 검토하세요.",
   "answer": "반복은 결과의 일관성을 살피지만 같은 배경 원인이 세 번 작용했을 수도 있다. 불을 켜지 않은 대조의 처음 상태·시간을 맞춰 연소와의 차이를 비교해야 한다.",
   "explanation": "횟수를 늘리는 것만으로 원인이 하나로 확정되지 않아요. 같은 조건의 대조를 통해 어떤 차이를 읽는지 설명해야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "반복과 대조의 역할을 구별한다.",
    "배경 원인이 반복될 가능성을 말한다.",
    "필요한 대조 조건을 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "반복은 결과의 일관성을 살피지만 같은 배경 원인이 세 번 작용했을 수도 있다. 불을 켜지 않은 대조의 처음 상태·시간을 맞춰 연소와의 차이를 비교해야 한다.",
    "required": [
     "반복과 대조의 역할을 구별한다.",
     "배경 원인이 반복될 가능성을 말한다.",
     "필요한 대조 조건을 제안한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교",
     "초 연소 뒤"
    ],
    "행": [
     [
      "1",
      "푸른색",
      "붉은색"
     ],
     [
      "2",
      "푸른색",
      "붉은색"
     ],
     [
      "3",
      "푸른색",
      "붉은색"
     ]
    ]
   },
   "givens": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
   "modelRef": "paperTrials",
   "formLabel": "까닭 설명",
   "criteria": "반복과 대조의 역할을 구별한다. / 배경 원인이 반복될 가능성을 말한다. / 필요한 대조 조건을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다."
   ],
   "lines": 6,
   "figure": "combustion-question-data-78"
  },
  {
   "id": "c22-s62-u02-w079",
   "no": 79,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "교사가 제공한 물 확인 기록을 정리할 표를 그리세요. 시험지 처음 색·같은 시간 뒤 색·대조·연소 뒤를 구분하세요.",
   "answer": "대조/연소 뒤 두 행과 처음/같은 시간 뒤 두 열을 두고 색을 적는 칸을 만든다. 교사 관리·자료 종류와 관찰/물 판단 칸을 따로 표시한다.",
   "explanation": "배관이나 가열 장치 제작을 요구하지 않아요. 제공된 기록을 빠뜨리지 않고 해석할 수 있는 표인지 교사가 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "대조와 연소 뒤를 나눈다.",
    "처음·같은 시간 뒤를 맞춘다.",
    "색 관찰과 물 판단을 구분한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "대조/연소 뒤 두 행과 처음/같은 시간 뒤 두 열을 두고 색을 적는 칸을 만든다. 교사 관리·자료 종류와 관찰/물 판단 칸을 따로 표시한다.",
    "required": [
     "대조와 연소 뒤를 나눈다.",
     "처음·같은 시간 뒤를 맞춘다.",
     "색 관찰과 물 판단을 구분한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "대조와 연소 뒤를 나눈다. / 처음·같은 시간 뒤를 맞춘다. / 색 관찰과 물 판단을 구분한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w080",
   "no": 80,
   "section": 5,
   "sectionTitle": "연소 뒤 물을 확인하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "연소 뒤 물을 확인하기",
   "prompt": "물 확인의 근거 사슬을 그리세요. 관찰한 색·대조와의 차이·시험 원리·결론을 이름표로 연결하고 더 확인할 조건을 하나 쓰세요.",
   "answer": "연소 뒤 색 변화와 대조 유지→물 확인 종이의 반응→제시 조건에서 물 존재 판단을 잇는다. 배경 습기나 처음 상태·시간을 추가 점검으로 표시한다.",
   "explanation": "관찰과 확인 근거를 알아보기 쉽게 그림으로 이어요. 관찰과 추론 사이의 근거가 빠지지 않았는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "색과 대조 근거를 함께 표시한다.",
    "시험 원리에서 결론으로 잇는다.",
    "확인 조건 한 가지를 밝힌다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "연소 뒤 색 변화와 대조 유지→물 확인 종이의 반응→제시 조건에서 물 존재 판단을 잇는다. 배경 습기나 처음 상태·시간을 추가 점검으로 표시한다.",
    "required": [
     "색과 대조 근거를 함께 표시한다.",
     "시험 원리에서 결론으로 잇는다.",
     "확인 조건 한 가지를 밝힌다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교",
     "초 연소 뒤"
    ],
    "행": [
     [
      "1",
      "푸른색",
      "붉은색"
     ],
     [
      "2",
      "푸른색",
      "붉은색"
     ],
     [
      "3",
      "푸른색",
      "붉은색"
     ]
    ]
   },
   "givens": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다.",
   "modelRef": "paperTrials",
   "formLabel": "그림·설계",
   "criteria": "색과 대조 근거를 함께 표시한다. / 시험 원리에서 결론으로 잇는다. / 확인 조건 한 가지를 밝힌다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "시험지의 색 변화는 관찰이고 물의 존재는 시험 원리·대조와 함께 한 해석이에요. 처음 습기와 보관 상태도 비교해요.",
   "given": [
    "바로 앞의 80번 자료면을 함께 보고 답하세요.",
    "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다."
   ],
   "drawing": "large",
   "contextFigure": "combustion-question-data-80"
  },
  {
   "id": "c22-s62-u02-w081",
   "no": 81,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "석회수 시험의 자료에 맞는 판단을 고르세요.",
   "answer": "③ 전후·대조의 차이를 기체 확인에 쓴다.",
   "explanation": "같은 방법·시간에서 대조는 맑고 초 연소 뒤 기체 쪽은 흐려졌어요. 확인 원리를 이용해 이산화 탄소를 판단하되 산소량이나 물의 무게로 바꿔 읽지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "석회수가 흐리면 산소량이0%라고 쓴다.",
    "맑던 석회수의 변화로 물의 무게를 잰다.",
    "전후·대조의 차이를 기체 확인에 쓴다.",
    "시험 시간과 관계없이 흐림을 비교한다.",
    "대조가 맑으면 초의 재질은 상관없다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교 기체",
     "초 연소 뒤 기체"
    ],
    "행": [
     [
      "1",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "2",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "3",
      "맑음",
      "뿌옇게 변함"
     ]
    ]
   },
   "givens": "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다.",
   "modelRef": "limeTrials",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 전후·대조의 차이를 기체 확인에 쓴다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다."
   ],
   "figure": "combustion-question-data-81"
  },
  {
   "id": "c22-s62-u02-w082",
   "no": 82,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "초와 알코올에서 물·이산화 탄소를 확인한 자료의 결론으로 알맞은 것을 고르세요.",
   "answer": "① 확인한 두 연료의 생성물을 설명한다.",
   "explanation": "확인한 것은 초와 알코올의 제시 조건이에요. 두 연료에서 같은 종류를 확인한 결과를 모든 연료·속도·불꽃 색의 같음으로 확대하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "확인한 두 연료의 생성물을 설명한다.",
    "모든 물질의 연소 결과를 같다고 정한다.",
    "두 연료의 타는 속도까지 같다고 정한다.",
    "불꽃 색이 같아야 생성물도 같다고 본다.",
    "녹은 촛농을 두 연료 공통 생성물로 쓴다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ① 확인한 두 연료의 생성물을 설명한다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요."
  },
  {
   "id": "c22-s62-u02-w083",
   "no": 83,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "이산화 탄소 확인에는 (1)를 이용하며, 적절한 조건에서 맑던 것이 (2)게 변해요.",
   "answer": "석회수 / 뿌옇",
   "explanation": "석회수의 흐림 변화를 이산화 탄소 확인과 연결해요. 처음 상태·접촉 시간·대조가 갖춰진 조건에서 읽는 반응이며 물 확인 종이와 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "석회수"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "뿌옇",
       "뿌옇게",
       "흐리",
       "흐리게"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 석회수 / (2) 뿌옇 또는 뿌옇게 또는 흐리 또는 흐리게. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w084",
   "no": 84,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "초가 녹아 액체가 되는 것은 (1) 변화예요. 초가 탈 때는 확인된 생성물의 (2)을 타기 전과 비교해요. 보기: 상태·성질",
   "answer": "상태 / 성질",
   "explanation": "녹는 모습은 고체에서 액체로 상태가 바뀐 것이에요. 연소는 물·이산화 탄소 확인 등의 성질 근거를 연결해야 하므로 녹음 자체를 연소 생성물로 보지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "상태"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "성질"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 상태 / (2) 성질. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w085",
   "no": 85,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "확인 목적과 자료를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "두 확인 시험은 목적이 다르고 대조는 원인을 비교하는 역할이에요. 한 시험 결과만으로 물과 이산화 탄소를 동시에 확인했다고 하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 물 확인",
    "(2) 이산화 탄소 확인",
    "(3) 배경 영향 점검"
   ],
   "options": [
    "ㄱ 석회수 전후의 흐림",
    "ㄴ 같은 조건의 불을 켜지 않은 대조",
    "ㄷ 푸른 염화 코발트 종이 색"
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
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "ㄱ 석회수 전후의 흐림",
    "ㄴ 같은 조건의 불을 켜지 않은 대조",
    "ㄷ 푸른 염화 코발트 종이 색"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w086",
   "no": 86,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "초의 변화와 설명을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "녹음·굳음의 상태 변화와 연소 전후의 성질 비교를 구별해요. 촛농이 액체라는 이유만으로 물이라고 이름 붙이지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 고체 초가 액체로 녹음",
    "(2) 흘러나온 촛농이 식어 굳음",
    "(3) 초 연소 뒤 다른 성질의 물질 확인"
   ],
   "options": [
    "ㄱ 액체에서 고체로 상태 변화",
    "ㄴ 타기 전후 성질 비교의 근거",
    "ㄷ 고체에서 액체로 상태 변화"
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
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "ㄱ 액체에서 고체로 상태 변화",
    "ㄴ 타기 전후 성질 비교의 근거",
    "ㄷ 고체에서 액체로 상태 변화"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w087",
   "no": 87,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "석회수 시험을 자료에서 읽는 순서를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "처음 상태와 방법을 확인한 뒤 대조·전후 차이를 읽어요. 그 차이와 확인 원리를 연결해야 기체 이름을 판단할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 같은 시간의 대조/연소 뒤 상태를 비교한다.",
    "ㄴ 처음 석회수가 맑고 방법이 같은지 확인한다.",
    "ㄷ 흐림 반응의 원리로 기체를 판단한다."
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
     "반복",
     "불을 켜지 않은 비교 기체",
     "초 연소 뒤 기체"
    ],
    "행": [
     [
      "1",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "2",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "3",
      "맑음",
      "뿌옇게 변함"
     ]
    ]
   },
   "givens": "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다.",
   "modelRef": "limeTrials",
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄴ → ㄱ → ㄷ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다.",
    "ㄱ 같은 시간의 대조/연소 뒤 상태를 비교한다.",
    "ㄴ 처음 석회수가 맑고 방법이 같은지 확인한다.",
    "ㄷ 흐림 반응의 원리로 기체를 판단한다."
   ],
   "figure": "combustion-question-data-87"
  },
  {
   "id": "c22-s62-u02-w088",
   "no": 88,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "모든 물질에서 같은 생성물이 나온다는 결론을 검토하는 순서를 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "자료 대상부터 확인하고 범위를 넓힐 근거가 있는지 검토한 뒤 결론을 고쳐요. 모든 물질이라는 말은 두 연료만의 자료가 뒷받침하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 초·알코올 외의 연료까지 조사했는지 확인한다.",
    "ㄴ 결론을 실제 확인한 연료·조건 범위로 고친다.",
    "ㄷ 자료가 실제로 다룬 두 연료를 찾아낸다."
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
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "ㄱ 초·알코올 외의 연료까지 조사했는지 확인한다.",
    "ㄴ 결론을 실제 확인한 연료·조건 범위로 고친다.",
    "ㄷ 자료가 실제로 다룬 두 연료를 찾아낸다."
   ]
  },
  {
   "id": "c22-s62-u02-w089",
   "no": 89,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "석회수 비교의 신뢰도를 살필 항목을 고르세요. (정답 3개)",
   "answer": "①, ②, ③",
   "explanation": "시작 상태·접촉 시간·대조는 흐림 해석에 영향을 주는 비교 조건이에요. 이름이나 꾸밈 색은 기체 확인의 과학적 근거가 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "새 석회수의 처음 상태",
    "기체와 접촉시킨 시간",
    "같은 조건의 비교 기체",
    "결과가 맘에 드는 관찰자의 이름",
    "표를 꾸민 색의 개수"
   ],
   "key": [
    0,
    1,
    2
   ],
   "responseContract": {
    "kind": "multi-choice",
    "teacherRequired": false,
    "answers": [
     0,
     1,
     2
    ]
   },
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교 기체",
     "초 연소 뒤 기체"
    ],
    "행": [
     [
      "1",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "2",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "3",
      "맑음",
      "뿌옇게 변함"
     ]
    ]
   },
   "givens": "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다.",
   "modelRef": "limeTrials",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ③. 선택한 순서는 관계없다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다."
   ],
   "figure": "combustion-question-data-89"
  },
  {
   "id": "c22-s62-u02-w090",
   "no": 90,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "제시한 시험 범위를 넘는 주장을 고르세요. (정답 3개)",
   "answer": "②, ③, ⑤",
   "explanation": "제시한 생성물 시험은 모든 물질·속도·전체 소멸을 확인한 것이 아니에요. 관찰한 반응과 대조 유지의 설명은 표 범위에 맞아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "초 연소 뒤 기체의 시험에서 석회수가 흐려졌다.",
    "모든 물질을 태우면 언제나 같은 생성물이 나온다.",
    "초와 알코올의 연소 속도도 같다고 확인했다.",
    "대조는 같은 시간에 맑은 상태를 유지했다.",
    "생성물을 찾았으니 남은 초 감소는 전체 소멸이다."
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
     "반복",
     "불을 켜지 않은 비교 기체",
     "초 연소 뒤 기체"
    ],
    "행": [
     [
      "1",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "2",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "3",
      "맑음",
      "뿌옇게 변함"
     ]
    ]
   },
   "givens": "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다.",
   "modelRef": "limeTrials",
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ②, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다."
   ],
   "figure": "combustion-question-data-90"
  },
  {
   "id": "c22-s62-u02-w091",
   "no": 91,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "반복 자료에서 (1)연소 뒤 기체 쪽 석회수가 흐려진 횟수 (2)대조 쪽이 흐려진 횟수를 쓰세요.",
   "answer": "3회 / 0회",
   "explanation": "연소 뒤 세 번은 모두 흐려졌고 대조 세 번은 모두 맑아요.3회와0회는 반응 횟수이며 이산화 탄소의 양3mL를 측정한 값이 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "value": 0,
      "units": [
       "회",
       "번"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "0회"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "반복",
     "불을 켜지 않은 비교 기체",
     "초 연소 뒤 기체"
    ],
    "행": [
     [
      "1",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "2",
      "맑음",
      "뿌옇게 변함"
     ],
     [
      "3",
      "맑음",
      "뿌옇게 변함"
     ]
    ]
   },
   "givens": "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다.",
   "modelRef": "limeTrials",
   "verificationModel": {
    "kind": "lime-response-counts",
    "answers": [
     3,
     0
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 3회 (단위 필요) / (2) 0회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "given": [
    "새 석회수의 처음 상태는 모두 맑다. 같은 양·접촉 시간·시험 방법으로 비교한 가상 교사 기록이다. 석회수에 입으로 불어 넣는 활동이 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-91"
  },
  {
   "id": "c22-s62-u02-w092",
   "no": 92,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "(1)물 확인 근거에 해당하는 기호 (2)이산화 탄소 확인 근거에 해당하는 기호를 쓰세요.",
   "answer": "ㄱ / ㄴ",
   "explanation": "ㄱ은 물 확인 반응, ㄴ은 이산화 탄소 확인 반응이에요. ㄷ의 액체 촛농을 물이라고 판단하거나 새 생성물로 바로 묶지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
     "초 연소 뒤의 확인 시험"
    ],
    "행": [
     [
      "ㄱ",
      "같은 조건의 대조와 달리 푸른 시험지가 붉게 변함"
     ],
     [
      "ㄴ",
      "같은 조건의 대조와 달리 새 석회수가 흐려짐"
     ],
     [
      "ㄷ",
      "초의 일부가 녹아 액체로 보임"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-92"
  },
  {
   "id": "c22-s62-u02-w093",
   "no": 93,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "흐려진 석회수의 사진만 보고 기체가 초의 연소에서 왔다고 확정할 수 있을까요?",
   "answer": "석회수 반응은 기체 판단에 쓰지만 사진만으로 기체를 어디서 모았는지 알 수 없다. 해당 장치·전후·대조·접촉 조건을 확인해 출처를 연결해야 한다.",
   "explanation": "같은 반응이 보인다는 사실과 특정 실험에서 나온 기체라는 주장은 다른 근거가 필요해요. 없는 장치 기록을 지어내지 않는 답을 인정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "확인 반응과 기체 출처를 구별한다.",
    "사진의 한계를 설명한다.",
    "출처·전후·대조 조건을 추가로 요구한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "석회수 반응은 기체 판단에 쓰지만 사진만으로 기체를 어디서 모았는지 알 수 없다. 해당 장치·전후·대조·접촉 조건을 확인해 출처를 연결해야 한다.",
    "required": [
     "확인 반응과 기체 출처를 구별한다.",
     "사진의 한계를 설명한다.",
     "출처·전후·대조 조건을 추가로 요구한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "확인 반응과 기체 출처를 구별한다. / 사진의 한계를 설명한다. / 출처·전후·대조 조건을 추가로 요구한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w094",
   "no": 94,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "초가 녹아 액체가 됐으니 그 액체가 연소 뒤 생긴 물이라는 설명을 고치세요.",
   "answer": "액체 상태라는 것만으로 물인지 알 수 없다. 녹은 촛농과 연소 생성물을 구별하고 물은 대조를 갖춘 확인 시험 근거로 판단해야 한다.",
   "explanation": "투명하거나 액체라는 겉모습은 물의 확인 시험이 아니에요. 촛농을 맛보거나 만지는 방법 없이 타당한 확인 근거를 말해야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "액체 상태와 물질 이름을 구별한다.",
    "녹음과 연소를 나눈다.",
    "물 확인 근거를 연결한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "액체 상태라는 것만으로 물인지 알 수 없다. 녹은 촛농과 연소 생성물을 구별하고 물은 대조를 갖춘 확인 시험 근거로 판단해야 한다.",
    "required": [
     "액체 상태와 물질 이름을 구별한다.",
     "녹음과 연소를 나눈다.",
     "물 확인 근거를 연결한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "액체 상태와 물질 이름을 구별한다. / 녹음과 연소를 나눈다. / 물 확인 근거를 연결한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w095",
   "no": 95,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T11",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "석회수 자료를 읽을 전후·대조 비교표를 설계하세요. 기체의 출처와 접촉 시간을 적을 칸도 만드세요.",
   "answer": "비교 기체/연소 뒤 기체 행과 처음/같은 시간 뒤 석회수 상태 열을 만든다. 기체 출처·같은 접촉 방법·미관찰 칸을 표시한다.",
   "explanation": "이 문제는 학생의 기체 포집 장치 제작이 아니에요. 자료를 읽을 때 빠지기 쉬운 조건을 기록하도록 설계했는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "전후·대조를 구분한다.",
    "기체 출처와 시간·방법 칸을 둔다.",
    "관찰과 기체 판단을 나눈다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "비교 기체/연소 뒤 기체 행과 처음/같은 시간 뒤 석회수 상태 열을 만든다. 기체 출처·같은 접촉 방법·미관찰 칸을 표시한다.",
    "required": [
     "전후·대조를 구분한다.",
     "기체 출처와 시간·방법 칸을 둔다.",
     "관찰과 기체 판단을 나눈다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "전후·대조를 구분한다. / 기체 출처와 시간·방법 칸을 둔다. / 관찰과 기체 판단을 나눈다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w096",
   "no": 96,
   "section": 6,
   "sectionTitle": "이산화 탄소와 전후의 성질",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "이산화 탄소와 전후의 성질",
   "prompt": "초의 녹음·굳음과 연소 전후 성질 확인을 구분하는 개념도를 그리세요. 각 가지의 근거를 한 가지씩 붙이세요.",
   "answer": "녹음↔굳음은 고체/액체 상태 변화로, 연소는 물·이산화 탄소 확인과 타기 전후 성질 비교로 나눈다. 그림만으로 모든 연료를 일반화하지 않는 메모를 둔다.",
   "explanation": "관찰과 확인 근거를 중심으로 그려요. 관찰과 확인 시험에 맞게 변화 종류를 자기 말로 구분했는지 교사가 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "상태 변화 가지를 구별한다.",
    "연소 가지에 두 확인 시험을 연결한다.",
    "연료·조건 범위를 표시한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "녹음↔굳음은 고체/액체 상태 변화로, 연소는 물·이산화 탄소 확인과 타기 전후 성질 비교로 나눈다. 그림만으로 모든 연료를 일반화하지 않는 메모를 둔다.",
    "required": [
     "상태 변화 가지를 구별한다.",
     "연소 가지에 두 확인 시험을 연결한다.",
     "연료·조건 범위를 표시한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "상태 변화 가지를 구별한다. / 연소 가지에 두 확인 시험을 연결한다. / 연료·조건 범위를 표시한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "석회수 변화만을 무조건 연소 때문이라고 하지 않아요. 비교 기체·시간·장치 조건을 확인하고 모든 물질로 결론을 넓히지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w097",
   "no": 97,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "생태계 자료에서 근거에 맞는 연결을 고르세요.",
   "answer": "④ 바다의 성질 변화와 생물 영향을 함께 살핀다.",
   "explanation": "자료는 바다 성질 변화와 일부 생물의 껍데기·골격 형성 어려움을 연결해요. 같은 피해 속도·모든 생물·독성·교실 실측으로 확대하는 말은 근거가 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "모든 바다 생물은 같은 속도로 줄어든다고 쓴다.",
    "조개가 줄면 이산화 탄소는 모두 사라진다고 본다.",
    "교실 촛불 하나가 바다 전체 피해를 측정했다고 쓴다.",
    "바다의 성질 변화와 생물 영향을 함께 살핀다.",
    "이산화 탄소가 있으므로 바닷물은 언제나 독이라고 본다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "givens": "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
   "sourceUrls": [
    "https://oceanservice.noaa.gov/facts/acidification.html"
   ],
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ 바다의 성질 변화와 생물 영향을 함께 살핀다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다."
   ]
  },
  {
   "id": "c22-s62-u02-w098",
   "no": 98,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "가상 껍데기 생장 모형의 해석으로 알맞은 것을 고르세요.",
   "answer": "② 이 모형에서는B의 추가 생장이 작다.",
   "explanation": "2.1mm와1.2mm는 가상 모형의 추가 생장 값이에요.B가 작다는 비교는 가능하지만 실제 피해량·모든 생물·물고기 수로 확대할 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "전 세계 모든 바다 생물이 같은 길이만큼 줄었다.",
    "이 모형에서는B의 추가 생장이 작다.",
    "B의 차이로 오늘 국내 피해량을 바로 계산한다.",
    "이 모형은 실제 학생의 사육 실험 결과이다.",
    "껍데기 길이 차이만으로 물고기 수를 확정한다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "table": {
    "머리": [
     "조건",
     "14일 동안 새로 자란 껍데기 길이(mm)"
    ],
    "행": [
     [
      "A: 처음 비교 조건",
      2.1
     ],
     [
      "B: 이산화 탄소가 더 많은 바닷물 조건",
      1.2
     ]
    ]
   },
   "givens": "자료 읽기를 위해 만든 가상 생장 모형이다. 같은 종류·시작 크기의 생물을 같은 먹이·온도·기간 조건에서 비교했다고 가정했다. 실제 사육 측정·현재 바다 피해 규모·모든 생물의 예측값이 아니다.",
   "modelRef": "shell",
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 이 모형에서는B의 추가 생장이 작다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "자료 읽기를 위해 만든 가상 생장 모형이다. 같은 종류·시작 크기의 생물을 같은 먹이·온도·기간 조건에서 비교했다고 가정했다. 실제 사육 측정·현재 바다 피해 규모·모든 생물의 예측값이 아니다."
   ],
   "figure": "combustion-question-data-98"
  },
  {
   "id": "c22-s62-u02-w099",
   "no": 99,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "자료에서 대기 중 증가와 바다의 성질 변화를 잇는 기체는 (1)예요. 이 자료는 개인 학생의 실측이 아니라 출처 있는 (2)을 정리한 것이에요. 보기: 이산화 탄소·설명",
   "answer": "이산화 탄소 / 설명",
   "explanation": "이산화 탄소와 바다 변화의 관계를 기관 설명 자료로 읽어요. 이를 학생이 직접 바다의 변화를 측정한 기록으로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "이산화 탄소",
       "이산화탄소"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "설명"
      ]
     }
    ]
   },
   "givens": "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
   "sourceUrls": [
    "https://oceanservice.noaa.gov/facts/acidification.html"
   ],
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 이산화 탄소 또는 이산화탄소 / (2) 설명. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다."
   ],
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w100",
   "no": 100,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "자료의 신뢰도를 읽을 때 발표 (1)와 자료의 대상·(2)를 확인해요. 보기: 기관·시기",
   "answer": "기관 / 시기",
   "explanation": "누가 어떤 대상의 언제 자료를 발표했는지 알아야 범위를 판단할 수 있어요. 옛 사례의 확인일이 오늘이라고 해서 오늘 측정한 피해값은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "기관"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "시기"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 기관 / (2) 시기. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w101",
   "no": 101,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "생태계 설명 사슬의 요소를 역할과 연결하세요.",
   "answer": "ㄷ / ㄴ / ㄱ",
   "explanation": "증가 요인·바다 변화·생물 영향은 서로 다른 단계예요. 중간 근거 없이 모든 생물 감소로 바로 뛰어넘지 않고 자료 범위에서 연결해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 대기 중 이산화 탄소 증가",
    "(2) 바닷물 성질의 변화",
    "(3) 일부 생물의 껍데기 형성 어려움"
   ],
   "options": [
    "ㄱ 자료가 설명한 생물 영향",
    "ㄴ 바다에서 이어지는 변화",
    "ㄷ 처음 살펴볼 증가 요인"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "givens": "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
   "sourceUrls": [
    "https://oceanservice.noaa.gov/facts/acidification.html"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄴ / (3) ㄱ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
    "ㄱ 자료가 설명한 생물 영향",
    "ㄴ 바다에서 이어지는 변화",
    "ㄷ 처음 살펴볼 증가 요인"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w102",
   "no": 102,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "자료 종류와 해석 범위를 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "설명·모형·실측은 자료 종류가 달라요. 가상 수치를 현재 지역 실측으로 옮기거나 기관 설명에 없는 숫자를 만들어 붙이지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 기관의 생태계 설명 글",
    "(2) 조건을 정한 가상 수치 모형",
    "(3) 지역의 실제 관측 기록"
   ],
   "options": [
    "ㄱ 제시한 가정 안에서 수치 비교",
    "ㄴ 관측 장소·시기의 실제 값",
    "ㄷ 출처가 설명한 원인·영향 관계"
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
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "ㄱ 제시한 가정 안에서 수치 비교",
    "ㄴ 관측 장소·시기의 실제 값",
    "ㄷ 출처가 설명한 원인·영향 관계"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w103",
   "no": 103,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "두 자료를 비교하는 조사 과정을 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "먼저 본문을 읽고 자료의 출처·범위를 확인한 뒤 공통/차이를 비교해요. 제목만 읽고 내용을 조사했다고 하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 기관·시기·대상·자료 종류를 확인한다.",
    "ㄴ 공통 근거와 서로 다른 범위를 비교한다.",
    "ㄷ 필요한 원문이나 출처 있는 본문을 찾아 읽는다."
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
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "ㄱ 기관·시기·대상·자료 종류를 확인한다.",
    "ㄴ 공통 근거와 서로 다른 범위를 비교한다.",
    "ㄷ 필요한 원문이나 출처 있는 본문을 찾아 읽는다."
   ]
  },
  {
   "id": "c22-s62-u02-w104",
   "no": 104,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "자료가 제시한 연결 순서로 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "기체 증가와 바다 흡수에서 바다 성질, 생물 영향으로 연결해요. 조건부 관계를 모든 생물이 언제나 같은 피해를 입는다는 말로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 바다의 성질이 달라질 수 있다.",
    "ㄴ 일부 생물의 껍데기·골격 형성이 어려워질 수 있다.",
    "ㄷ 대기 중 증가에 따라 바다에 흡수되는 이산화 탄소도 늘 수 있다."
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
   "givens": "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
   "sourceUrls": [
    "https://oceanservice.noaa.gov/facts/acidification.html"
   ],
   "formLabel": "순서 배열",
   "criteria": "제시한 시작점·절차 조건에서 ㄷ → ㄱ → ㄴ 순서를 유지한다. 기호 구분 방식이 달라도 대응 순서가 같아야 한다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
    "ㄱ 바다의 성질이 달라질 수 있다.",
    "ㄴ 일부 생물의 껍데기·골격 형성이 어려워질 수 있다.",
    "ㄷ 대기 중 증가에 따라 바다에 흡수되는 이산화 탄소도 늘 수 있다."
   ]
  },
  {
   "id": "c22-s62-u02-w105",
   "no": 105,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "자료를 이용할 때 범위를 넘는 해석을 고르세요. (정답 3개)",
   "answer": "②, ③, ④",
   "explanation": "모든 생물로 확대하거나 가상/실측·없는 수치를 섞으면 자료의 범위를 넘어요. 출처·대상·시기를 밝히는 것은 근거에 맞는 사용 방법이에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "출처와 설명한 생물을 함께 적는다.",
    "모든 바다 생물은 반응 정도가 같다.",
    "가상 모형을 오늘 바다의 실측으로 쓴다.",
    "자료에 없는 국내 피해 숫자를 만들어 넣는다.",
    "과거 사례와 현재 관측을 구분한다."
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
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요."
  },
  {
   "id": "c22-s62-u02-w106",
   "no": 106,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "두 글이 모두NOAA 자료일 때 타당한 판단을 고르세요. (정답 3개)",
   "answer": "①, ④, ⑤",
   "explanation": "같은 기관의 두 글도 대상과 범위가 달라 비교할 수 있어요. 글 수를 기관 수로 세거나 같은 기관이라는 이유로 본문 확인을 생략하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "두 글의 대상과 설명 범위가 다를 수 있다.",
    "두 글이므로 독립된 기관 두 곳이 검증했다.",
    "같은 기관이므로 본문을 읽을 필요가 없다.",
    "공통 근거와 각 글의 한계를 비교할 수 있다.",
    "두 글의 확인일을 각각 적을 수 있다."
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
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ④, ⑤. 선택한 순서는 관계없다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요."
  },
  {
   "id": "c22-s62-u02-w107",
   "no": 107,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "가상 모형에서 (1)A−B 추가 생장 길이 차 (2)추가 생장이 더 작은 조건의 기호를 쓰세요.",
   "answer": "0.9mm / B",
   "explanation": "2.1−1.2=0.9mm이고B의 추가 생장이 작아요. 두 값은14일 가상 모형의 추가 길이로, 이미 있던 껍데기가 그만큼 녹아 사라졌다는 뜻도 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "value": 0.9,
      "units": [
       "mm",
       "밀리미터"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "0.9mm"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "B",
       "b"
      ]
     }
    ]
   },
   "table": {
    "머리": [
     "조건",
     "14일 동안 새로 자란 껍데기 길이(mm)"
    ],
    "행": [
     [
      "A: 처음 비교 조건",
      2.1
     ],
     [
      "B: 이산화 탄소가 더 많은 바닷물 조건",
      1.2
     ]
    ]
   },
   "givens": "자료 읽기를 위해 만든 가상 생장 모형이다. 같은 종류·시작 크기의 생물을 같은 먹이·온도·기간 조건에서 비교했다고 가정했다. 실제 사육 측정·현재 바다 피해 규모·모든 생물의 예측값이 아니다.",
   "modelRef": "shell",
   "verificationModel": {
    "kind": "shell-growth-difference",
    "answers": [
     0.9,
     "B"
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 0.9mm (단위 필요) / (2) B 또는 b. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "자료 읽기를 위해 만든 가상 생장 모형이다. 같은 종류·시작 크기의 생물을 같은 먹이·온도·기간 조건에서 비교했다고 가정했다. 실제 사육 측정·현재 바다 피해 규모·모든 생물의 예측값이 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-107"
  },
  {
   "id": "c22-s62-u02-w108",
   "no": 108,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "(1)지역 실측 자료 (2)직접 실측으로 세면 안 되는 가상 자료의 기호를 쓰세요.",
   "answer": "ㄱ / ㄴ",
   "explanation": "ㄱ은 장소·시기·방법이 있는 실측이고 ㄴ은 명시한 가정의 모형이에요. ㄷ은 출처 불명으로 추가 확인이 필요하며 실측 값으로 볼 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
     "자료의 성격"
    ],
    "행": [
     [
      "ㄱ",
      "기관이 특정 연안·날짜·측정 방법과 값을 공개"
     ],
     [
      "ㄴ",
      "관계 읽기를 위해 만든 가상 생장표"
     ],
     [
      "ㄷ",
      "출처와 날짜가 없는 사진 한 장"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) ㄱ / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-108"
  },
  {
   "id": "c22-s62-u02-w109",
   "no": 109,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "한 생물의 가상 생장 차이를 모든 바다 생물의 실제 피해량이라고 쓸 수 없는 까닭을 설명하세요.",
   "answer": "자료는 특정 생물을 가정한 가상 모형이며 실제 지역·시기·종별 관측이 아니다. 모든 생물의 반응과 실제 피해량을 알려면 그에 맞는 자료를 더 수집해야 한다.",
   "explanation": "모형은 관계를 생각하는 데 도움이 되지만 실제 관측의 범위를 대신하지 않아요. 추가 자료가 원래 질문의 범위와 맞는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "가상 모형임을 밝힌다.",
    "대상·지역·시기 일반화를 제한한다.",
    "추가로 필요한 실제 자료를 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "자료는 특정 생물을 가정한 가상 모형이며 실제 지역·시기·종별 관측이 아니다. 모든 생물의 반응과 실제 피해량을 알려면 그에 맞는 자료를 더 수집해야 한다.",
    "required": [
     "가상 모형임을 밝힌다.",
     "대상·지역·시기 일반화를 제한한다.",
     "추가로 필요한 실제 자료를 제안한다."
    ],
    "exactStringScoring": false
   },
   "table": {
    "머리": [
     "조건",
     "14일 동안 새로 자란 껍데기 길이(mm)"
    ],
    "행": [
     [
      "A: 처음 비교 조건",
      2.1
     ],
     [
      "B: 이산화 탄소가 더 많은 바닷물 조건",
      1.2
     ]
    ]
   },
   "givens": "자료 읽기를 위해 만든 가상 생장 모형이다. 같은 종류·시작 크기의 생물을 같은 먹이·온도·기간 조건에서 비교했다고 가정했다. 실제 사육 측정·현재 바다 피해 규모·모든 생물의 예측값이 아니다.",
   "modelRef": "shell",
   "formLabel": "까닭 설명",
   "criteria": "가상 모형임을 밝힌다. / 대상·지역·시기 일반화를 제한한다. / 추가로 필요한 실제 자료를 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "자료 읽기를 위해 만든 가상 생장 모형이다. 같은 종류·시작 크기의 생물을 같은 먹이·온도·기간 조건에서 비교했다고 가정했다. 실제 사육 측정·현재 바다 피해 규모·모든 생물의 예측값이 아니다."
   ],
   "lines": 6,
   "figure": "combustion-question-data-109"
  },
  {
   "id": "c22-s62-u02-w110",
   "no": 110,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "과거 패류 피해 사례를 오늘 확인했으니 오늘 생긴 피해라고 적어도 되는지 설명하세요.",
   "answer": "확인일은 자료를 읽은 날이고 사례가 일어난 시기와 다르다. 원문의 사례 시기·지역을 따로 적고 현재 상황은 별도의 최신 관측으로 확인해야 한다.",
   "explanation": "오래된 자료도 관계와 대응을 살필 근거가 될 수 있어요. 자료의 시기를 바꾸어 현재 사실인 것처럼 표시하지 않는 설명을 인정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "확인일과 사건/관측 시기를 구별한다.",
    "사례의 지역·시기를 보존한다.",
    "현재 판단에는 새 근거가 필요함을 말한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "확인일은 자료를 읽은 날이고 사례가 일어난 시기와 다르다. 원문의 사례 시기·지역을 따로 적고 현재 상황은 별도의 최신 관측으로 확인해야 한다.",
    "required": [
     "확인일과 사건/관측 시기를 구별한다.",
     "사례의 지역·시기를 보존한다.",
     "현재 판단에는 새 근거가 필요함을 말한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "확인일과 사건/관측 시기를 구별한다. / 사례의 지역·시기를 보존한다. / 현재 판단에는 새 근거가 필요함을 말한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w111",
   "no": 111,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "이산화 탄소 증가에서 생물 영향까지 세 단계를 잇는 설명 그림을 만드세요. 각 연결 옆에 출처와 그 출처가 말하는 범위를 적으세요.",
   "answer": "기체 증가/바다 흡수→바닷물 성질 변화→일부 껍데기·골격 형성 어려움을 연결한다. 기관·자료 대상·모든 생물로 일반화하지 않음을 표시한다.",
   "explanation": "생태계 자료에서 읽은 연결을 그림으로 설명해요. 자료가 설명한 수준에서 빠진 연결이나 과도한 일반화가 없는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "중간 바다 변화 단계를 포함한다.",
    "생물 영향을 조건부로 표시한다.",
    "출처와 범위를 붙인다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "기체 증가/바다 흡수→바닷물 성질 변화→일부 껍데기·골격 형성 어려움을 연결한다. 기관·자료 대상·모든 생물로 일반화하지 않음을 표시한다.",
    "required": [
     "중간 바다 변화 단계를 포함한다.",
     "생물 영향을 조건부로 표시한다.",
     "출처와 범위를 붙인다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "givens": "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
   "sourceUrls": [
    "https://oceanservice.noaa.gov/facts/acidification.html"
   ],
   "formLabel": "그림·설계",
   "criteria": "중간 바다 변화 단계를 포함한다. / 생물 영향을 조건부로 표시한다. / 출처와 범위를 붙인다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "given": [
    "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다."
   ],
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w112",
   "no": 112,
   "section": 7,
   "sectionTitle": "생태계의 변화를 자료로 읽기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T17",
   "topic": "생태계의 변화를 자료로 읽기",
   "prompt": "두 생태계 자료를 조사할 비교표를 설계하세요. 출처·대상·시기·자료 종류·공통 근거·한계를 놓을 자리를 만드세요.",
   "answer": "자료 가·나 행에 기관/원문·대상·사례 시기/확인일·실측/설명/모형을 나누고 근거·공통점·범위 차이 칸을 둔다.",
   "explanation": "제목 두 개를 적은 것만으로 조사 완료가 아니에요. 실제로 읽은 본문에서 근거와 한계를 찾을 수 있는 구조인지 교사가 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "출처와 대상·시기를 기록한다.",
    "자료 종류와 확인일을 구분한다.",
    "근거 비교·한계 칸을 둔다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "자료 가·나 행에 기관/원문·대상·사례 시기/확인일·실측/설명/모형을 나누고 근거·공통점·범위 차이 칸을 둔다.",
    "required": [
     "출처와 대상·시기를 기록한다.",
     "자료 종류와 확인일을 구분한다.",
     "근거 비교·한계 칸을 둔다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "출처와 대상·시기를 기록한다. / 자료 종류와 확인일을 구분한다. / 근거 비교·한계 칸을 둔다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "이산화 탄소 증가와 바다 성질 변화·일부 생물의 어려움을 연결해요. 가상 자료를 오늘 국내 바다의 실측으로 쓰지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w113",
   "no": 113,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "자료에서 피해 대비의 역할로 연결되는 제안을 고르세요.",
   "answer": "⑤ 바닷물 관측·경보로 취수 조건을 살핀다.",
   "explanation": "관측·경보는 현장의 물 상태를 알아 피해에 대비하는 데 쓰여요. 배출 원인을 끝낸 조치나 현재 국내 실측이라고 바꾸어 설명하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "경보가 울리면 배출량도 저절로 줄었다고 본다.",
    "과거의 경보 사례를 오늘 국내 실측으로 쓴다.",
    "모든 이산화 탄소를 없애는 것을 목표로 정한다.",
    "근거 없이 바다에 약품을 붓는 방법을 선택한다.",
    "바닷물 관측·경보로 취수 조건을 살핀다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "givens": "NOAA Fisheries가 소개한 미국 서해안 패류 양식의 과거 사례에서 바닷물 관측과 경보는 물 상태를 살펴 생산 시기·취수 관리를 돕는 대응이었다. 이것이 대기 중 이산화 탄소 증가 자체를 끝내는 조치는 아니다. 필요한 에너지의 낭비를 줄이거나 공동체의 에너지 사용 방식을 검토하는 제안은 배출 증가의 원인을 줄이려는 역할과 연결할 수 있다. 실제 효과는 조건을 따로 확인해야 한다.",
   "sourceUrls": [
    "https://www.fisheries.noaa.gov/insight/understanding-ocean-acidification"
   ],
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ⑤ 바닷물 관측·경보로 취수 조건을 살핀다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "NOAA Fisheries가 소개한 미국 서해안 패류 양식의 과거 사례에서 바닷물 관측과 경보는 물 상태를 살펴 생산 시기·취수 관리를 돕는 대응이었다. 이것이 대기 중 이산화 탄소 증가 자체를 끝내는 조치는 아니다. 필요한 에너지의 낭비를 줄이거나 공동체의 에너지 사용 방식을 검토하는 제안은 배출 증가의 원인을 줄이려는 역할과 연결할 수 있다. 실제 효과는 조건을 따로 확인해야 한다."
   ]
  },
  {
   "id": "c22-s62-u02-w114",
   "no": 114,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "설명 카드를 실제로 공유한 상태를 바르게 나타낸 것은 무엇인가요?",
   "answer": "③ 짝에게 설명하고 받은 질문에 답했다.",
   "explanation": "실제 상대에게 설명하고 질문에 답한 것은 공유 수행의 근거예요. 파일 이름·계획·화면 이동·정답 수만으로 전달이 이루어졌다고 보지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "파일 이름만 발표완료로 바꾸어 두었다.",
    "카드에 공유예정이라는 날짜만 적어 두었다.",
    "짝에게 설명하고 받은 질문에 답했다.",
    "기기 화면에서 다음 쪽으로 이동하였다.",
    "정답표를 읽고 확인 문제를 모두 맞혔다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "formLabel": "객관식",
   "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 짝에게 설명하고 받은 질문에 답했다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요."
  },
  {
   "id": "c22-s62-u02-w115",
   "no": 115,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "좋은 제안은 문제의 (1)를 자료에서 찾고, 실행할 때의 여건과 (2)도 밝혀요. 보기: 근거·한계",
   "answer": "근거 / 한계",
   "explanation": "자료의 근거와 제안이 바꾸는 과정을 연결해야 해요. 한계와 여건을 쓰면 무엇을 해결하고 무엇이 남는지 구체적으로 설명할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "근거"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "한계"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 근거 / (2) 한계. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w116",
   "no": 116,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "blank",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "카드를 만들었지만 상대에게 설명하지 않았다면 상태는 (1)로 남겨요. 실제 설명 후 받은 (2)을 자료로 확인해 답할 수 있어요. 보기: 미공유·질문",
   "answer": "미공유 / 질문",
   "explanation": "제작과 전달은 서로 다른 수행이에요. 실제로 받지 않은 질문을 받은 것처럼 꾸미지 않고 준비한 예상 질문과 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "accepted": [
       "미공유",
       "아직 미공유"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "질문"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "(1) 미공유 또는 아직 미공유 / (2) 질문. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "parts": [
    "(1)",
    "(2)"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w117",
   "no": 117,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "제안의 역할과 설명을 연결하세요.",
   "answer": "ㄷ / ㄱ / ㄴ",
   "explanation": "원인 저감·지역 대응·공동체 여건 검토의 역할은 달라요. 하나의 제안이 모든 원인과 피해를 동시에 없앤다고 쓰지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 불필요한 연료 사용 줄이기",
    "(2) 바닷물 관측·경보 활용",
    "(3) 학교 구성원이 설비·이용 조건 검토"
   ],
   "options": [
    "ㄱ 지역의 피해 대비",
    "ㄴ 공동체 여건을 검토하는 선택",
    "ㄷ 배출 증가 원인 줄이기와 연결"
   ],
   "matching": {
    "oneToOne": true,
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "givens": "NOAA Fisheries가 소개한 미국 서해안 패류 양식의 과거 사례에서 바닷물 관측과 경보는 물 상태를 살펴 생산 시기·취수 관리를 돕는 대응이었다. 이것이 대기 중 이산화 탄소 증가 자체를 끝내는 조치는 아니다. 필요한 에너지의 낭비를 줄이거나 공동체의 에너지 사용 방식을 검토하는 제안은 배출 증가의 원인을 줄이려는 역할과 연결할 수 있다. 실제 효과는 조건을 따로 확인해야 한다.",
   "sourceUrls": [
    "https://www.fisheries.noaa.gov/insight/understanding-ocean-acidification"
   ],
   "formLabel": "연결하기",
   "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "NOAA Fisheries가 소개한 미국 서해안 패류 양식의 과거 사례에서 바닷물 관측과 경보는 물 상태를 살펴 생산 시기·취수 관리를 돕는 대응이었다. 이것이 대기 중 이산화 탄소 증가 자체를 끝내는 조치는 아니다. 필요한 에너지의 낭비를 줄이거나 공동체의 에너지 사용 방식을 검토하는 제안은 배출 증가의 원인을 줄이려는 역할과 연결할 수 있다. 실제 효과는 조건을 따로 확인해야 한다.",
    "ㄱ 지역의 피해 대비",
    "ㄴ 공동체 여건을 검토하는 선택",
    "ㄷ 배출 증가 원인 줄이기와 연결"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w118",
   "no": 118,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "match",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "설명 카드의 요소를 질문과 연결하세요.",
   "answer": "ㄴ / ㄷ / ㄱ",
   "explanation": "주장의 근거, 실행 가능성, 실제 전달을 따로 확인해요. 긴 날짜별 보고서 대신 한 장 카드에도 세 요소를 분명히 남길 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "(1) 자료 근거",
    "(2) 실행 여건·한계",
    "(3) 실제 공유 상태"
   ],
   "options": [
    "ㄱ 누구에게 실제로 설명했는가?",
    "ㄴ 무슨 자료가 주장을 뒷받침하는가?",
    "ㄷ 누가 어떤 조건에서 실행할 수 있는가?"
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
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "ㄱ 누구에게 실제로 설명했는가?",
    "ㄴ 무슨 자료가 주장을 뒷받침하는가?",
    "ㄷ 누가 어떤 조건에서 실행할 수 있는가?"
   ],
   "answerPerPart": true
  },
  {
   "id": "c22-s62-u02-w119",
   "no": 119,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "해결책 카드를 만드는 과정을 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "근거를 고르고 그 의미를 해석한 뒤 제안을 연결해요. 원하는 제안을 먼저 정해 자료에 없는 효과를 덧붙이지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 근거가 설명하는 원인·영향을 확인한다.",
    "ㄴ 제안이 바꾸는 과정과 한계를 적는다.",
    "ㄷ 읽은 자료에서 쓸 근거를 고른다."
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
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "ㄱ 근거가 설명하는 원인·영향을 확인한다.",
    "ㄴ 제안이 바꾸는 과정과 한계를 적는다.",
    "ㄷ 읽은 자료에서 쓸 근거를 고른다."
   ]
  },
  {
   "id": "c22-s62-u02-w120",
   "no": 120,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "sequence",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "실제 설명 나눔의 순서로 배열하세요.",
   "answer": "ㄴ → ㄱ → ㄷ",
   "explanation": "전달하고 실제 질문을 받은 뒤 근거로 답하며 설명을 고쳐요. 예상 질문을 준비하는 것과 받은 질문에 답하는 것을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "ㄱ 받은 질문에 맞춰 자료를 확인하고 답한다.",
    "ㄴ 짝에게 카드의 근거와 제안을 설명한다.",
    "ㄷ 필요한 문장을 고치고 아직 확인할 점을 남긴다."
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
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "ㄱ 받은 질문에 맞춰 자료를 확인하고 답한다.",
    "ㄴ 짝에게 카드의 근거와 제안을 설명한다.",
    "ㄷ 필요한 문장을 고치고 아직 확인할 점을 남긴다."
   ]
  },
  {
   "id": "c22-s62-u02-w121",
   "no": 121,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "제안의 타당성을 높이는 내용을 고르세요. (정답 3개)",
   "answer": "①, ③, ⑤",
   "explanation": "근거·주체·여건·한계를 밝히면 제안의 역할을 판단할 수 있어요. 성공을 꾸미거나 모든 피해를 끝낸다는 주장은 확인 범위를 넘어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "어떤 근거와 연결되는지 밝힌다.",
    "효과가 없더라도 성공했다고 적는다.",
    "실행할 주체와 필요한 여건을 적는다.",
    "한 제안으로 모든 피해가 끝난다고 쓴다.",
    "기대 효과와 아직 모르는 점을 나눈다."
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
   "formLabel": "복수 선택",
   "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택한 순서는 관계없다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요."
  },
  {
   "id": "c22-s62-u02-w122",
   "no": 122,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "multiple",
   "form": "choice",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "실제 수행과 기록이 맞지 않는 경우를 고르세요. (정답 3개)",
   "answer": "②, ④, ⑤",
   "explanation": "미전달·추정·제공 자료를 실제 공유·측정·직접 관측으로 바꾸면 수행을 꾸미게 돼요. 확인 전이나 실제 받은 질문을 그대로 남기는 것은 타당해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "자료를 못 열어 출처 확인 전으로 남겼다.",
    "전달하지 않은 카드를 공유 완료로 표시했다.",
    "실제 받은 질문을 짧게 남기고 답했다.",
    "추정한 절감량을 측정값이라고 표시했다.",
    "친구의 제공 자료를 내 실제 관측으로 옮겼다."
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
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요."
  },
  {
   "id": "c22-s62-u02-w123",
   "no": 123,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "정한 가정의 모형에서 (1)줄어든 배출 지표 (2)처음보다 지표가 낮은 계획의 기호를 쓰세요.",
   "answer": "30단위 / B",
   "explanation": "120−90=30단위이고B의 지표가 낮아요. 정한 가정의 연습 지표 차이로 실제 배출30kg을 측정했다거나 필요한 냉난방을 무조건 줄이라는 뜻은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
      "value": 30,
      "units": [
       "단위",
       "연습 단위",
       "연습단위"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "30단위"
      ]
     },
     {
      "label": "(2)",
      "accepted": [
       "B",
       "b"
      ]
     }
    ]
   },
   "givens": "같은 기간·같은 계산 조건에서 만든 가상 지표다. 건강·필요한 이용을 유지하면서 불필요한 사용을 줄인다고 가정했다. 실제 학교 측정·kg 단위 배출량·일반 보장 효과가 아니다.",
   "modelRef": "energy",
   "verificationModel": {
    "kind": "energy-index-difference",
    "answers": [
     30,
     "B"
    ]
   },
   "table": {
    "머리": [
     "계획",
     "배출 지표(연습 단위)"
    ],
    "행": [
     [
      "A: 처음 사용",
      120
     ],
     [
      "B: 불필요한 사용을 줄인 뒤",
      90
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 30단위 (단위 필요) / (2) B 또는 b. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "같은 기간·같은 계산 조건에서 만든 가상 지표다. 건강·필요한 이용을 유지하면서 불필요한 사용을 줄인다고 가정했다. 실제 학교 측정·kg 단위 배출량·일반 보장 효과가 아니다."
   ],
   "parts": [
    "(1) · 단위도 써요.",
    "(2)"
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-123"
  },
  {
   "id": "c22-s62-u02-w124",
   "no": 124,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "data",
   "form": "short",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "네 카드 중 (1)원문 본문을 확인한 카드 수 (2)확인하지 못한 카드 수를 쓰세요.",
   "answer": "2개 / 2개",
   "explanation": "본문을 읽은 가·다2개와 읽지 못한 나·라2개를 구분해요. 제목이나 링크가 있다는 사실만으로 본문 조사 완료로 세지 않으며 카드 수를 기관 수로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
       "장"
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
       "개",
       "장"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "accepted": [
       "2개"
      ]
     }
    ]
   },
   "modelRef": "sourceCheck",
   "verificationModel": {
    "kind": "source-reading-counts",
    "answers": [
     2,
     2
    ]
   },
   "table": {
    "머리": [
     "카드",
     "상태"
    ],
    "행": [
     [
      "가",
      "원문 본문 확인"
     ],
     [
      "나",
      "제목만 확인"
     ],
     [
      "다",
      "원문 본문 확인"
     ],
     [
      "라",
      "링크 접속 못 함"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "(1) 2개 (단위 필요) / (2) 2개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
   ],
   "answerPerPart": true,
   "figure": "combustion-question-data-124"
  },
  {
   "id": "c22-s62-u02-w125",
   "no": 125,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "바닷물 경보가 있으니 이산화 탄소 증가 문제도 이미 해결됐다는 주장을 검토하세요.",
   "answer": "경보는 물 상태를 관측해 양식장의 피해 대응을 돕는다. 대기 중 증가의 원인을 줄이는 조치는 별도로 검토해야 하며 경보 설치가 모든 원인·피해의 해결은 아니다.",
   "explanation": "효과가 전혀 없다는 반대 단정도 하지 않아요. 어떤 과정을 돕고 무엇이 남는지 근거에 맞게 나눈 설명을 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "경보의 피해 대응 역할을 말한다.",
    "원인 저감과 역할을 구별한다.",
    "남는 문제·한계를 밝힌다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "경보는 물 상태를 관측해 양식장의 피해 대응을 돕는다. 대기 중 증가의 원인을 줄이는 조치는 별도로 검토해야 하며 경보 설치가 모든 원인·피해의 해결은 아니다.",
    "required": [
     "경보의 피해 대응 역할을 말한다.",
     "원인 저감과 역할을 구별한다.",
     "남는 문제·한계를 밝힌다."
    ],
    "exactStringScoring": false
   },
   "givens": "NOAA Fisheries가 소개한 미국 서해안 패류 양식의 과거 사례에서 바닷물 관측과 경보는 물 상태를 살펴 생산 시기·취수 관리를 돕는 대응이었다. 이것이 대기 중 이산화 탄소 증가 자체를 끝내는 조치는 아니다. 필요한 에너지의 낭비를 줄이거나 공동체의 에너지 사용 방식을 검토하는 제안은 배출 증가의 원인을 줄이려는 역할과 연결할 수 있다. 실제 효과는 조건을 따로 확인해야 한다.",
   "sourceUrls": [
    "https://www.fisheries.noaa.gov/insight/understanding-ocean-acidification"
   ],
   "formLabel": "까닭 설명",
   "criteria": "경보의 피해 대응 역할을 말한다. / 원인 저감과 역할을 구별한다. / 남는 문제·한계를 밝힌다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "NOAA Fisheries가 소개한 미국 서해안 패류 양식의 과거 사례에서 바닷물 관측과 경보는 물 상태를 살펴 생산 시기·취수 관리를 돕는 대응이었다. 이것이 대기 중 이산화 탄소 증가 자체를 끝내는 조치는 아니다. 필요한 에너지의 낭비를 줄이거나 공동체의 에너지 사용 방식을 검토하는 제안은 배출 증가의 원인을 줄이려는 역할과 연결할 수 있다. 실제 효과는 조건을 따로 확인해야 한다."
   ],
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w126",
   "no": 126,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "친구가 “우리 제안은 실제로 얼마나 줄여?”라고 물었습니다. 아직 실측이 없을 때 어떻게 답할지 쓰세요.",
   "answer": "현재 수치는 가정한 연습 모형이며 실제 효과는 아직 측정하지 않았다고 밝힌다. 같은 기간·이용 조건의 전후 자료와 계산 근거를 모아 검토하겠다고 답한다.",
   "explanation": "정확한 숫자를 모르면 지어내지 않아요. 모형으로 예상한 효과와 실제 관측으로 확인할 효과를 구분하면 여러 표현을 인정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "모형·기대와 실측을 구별한다.",
    "효과를 확인 전이라고 밝힌다.",
    "조건을 맞춘 추가 자료를 제안한다."
   ],
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "현재 수치는 가정한 연습 모형이며 실제 효과는 아직 측정하지 않았다고 밝힌다. 같은 기간·이용 조건의 전후 자료와 계산 근거를 모아 검토하겠다고 답한다.",
    "required": [
     "모형·기대와 실측을 구별한다.",
     "효과를 확인 전이라고 밝힌다.",
     "조건을 맞춘 추가 자료를 제안한다."
    ],
    "exactStringScoring": false
   },
   "formLabel": "까닭 설명",
   "criteria": "모형·기대와 실측을 구별한다. / 효과를 확인 전이라고 밝힌다. / 조건을 맞춘 추가 자료를 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "lines": 6
  },
  {
   "id": "c22-s62-u02-w127",
   "no": 127,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "두 자료의 근거·생물 영향·개인/공동체 제안·한계를 담은 설명 카드 초안을 만드세요. 실제로 설명하지 않았다면 미공유로 표시하세요.",
   "answer": "두 출처에서 읽은 근거를 각각 제시하고 바다 성질과 생물 영향을 잇는다. 개인의 낭비 줄이기와 공동체 여건 검토 등 제안의 역할·한계를 적고 전달 상태를 표시한다.",
   "explanation": "카드 제작만으로 공유까지 완료 처리하지 않아요. 아직 자료를 읽지 못했다면 확인 전 칸을 남기고 교사와 이어갈 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "두 자료의 실제 근거와 출처를 쓴다.",
    "원인·영향·제안을 연결한다.",
    "여건·한계와 실제 전달 상태를 구분한다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "두 출처에서 읽은 근거를 각각 제시하고 바다 성질과 생물 영향을 잇는다. 개인의 낭비 줄이기와 공동체 여건 검토 등 제안의 역할·한계를 적고 전달 상태를 표시한다.",
    "required": [
     "두 자료의 실제 근거와 출처를 쓴다.",
     "원인·영향·제안을 연결한다.",
     "여건·한계와 실제 전달 상태를 구분한다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "formLabel": "그림·설계",
   "criteria": "두 자료의 실제 근거와 출처를 쓴다. / 원인·영향·제안을 연결한다. / 여건·한계와 실제 전달 상태를 구분한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "drawing": "large"
  },
  {
   "id": "c22-s62-u02-w128",
   "no": 128,
   "section": 8,
   "sectionTitle": "해결책을 만들고 설명하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T18",
   "topic": "해결책을 만들고 설명하기",
   "prompt": "같은 근거를 저학년에게도 설명할 수 있도록 그림과 짧은 문장으로 바꾸세요. 바다 변화의 중간 과정과 과장하지 않는 문장을 포함하세요.",
   "answer": "이산화 탄소 증가→바다 성질 변화→일부 생물의 껍데기/골격 형성 어려움을 쉽게 그린다. 원인 저감과 피해 대응을 나누고 모든 생물에 똑같다는 말은 쓰지 않는다.",
   "explanation": "쉬운 설명은 원인을 없애거나 과장하는 말로 바꾸는 것이 아니에요. 그림의 예쁨보다 듣는 사람이 근거 연결을 읽을 수 있는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과14-04",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅱ. 물질의 연소",
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
    "중간 과정을 생략하지 않는다.",
    "쉬운 말에도 조건·범위를 유지한다.",
    "자료 출처와 제안의 역할을 남긴다."
   ],
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "이산화 탄소 증가→바다 성질 변화→일부 생물의 껍데기/골격 형성 어려움을 쉽게 그린다. 원인 저감과 피해 대응을 나누고 모든 생물에 똑같다는 말은 쓰지 않는다.",
    "required": [
     "중간 과정을 생략하지 않는다.",
     "쉬운 말에도 조건·범위를 유지한다.",
     "자료 출처와 제안의 역할을 남긴다."
    ],
    "exactStringScoring": false
   },
   "drawingSpaceMinimumMm": 120,
   "drawingExplanationLines": 3,
   "givens": "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다.",
   "sourceUrls": [
    "https://oceanservice.noaa.gov/facts/acidification.html"
   ],
   "formLabel": "그림·설계",
   "criteria": "중간 과정을 생략하지 않는다. / 쉬운 말에도 조건·범위를 유지한다. / 자료 출처와 제안의 역할을 남긴다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
   "misconception": "원인 저감과 피해 대응은 역할이 달라요. 출처가 있는 사례와 내 제안·실제 실천을 구별하며 한 해결책이 전부 해결한다고 하지 않아요.",
   "given": [
    "이산화 탄소 증가로 바다에 흡수되는 양이 늘면 바닷물의 성질이 달라질 수 있다. 조개껍데기·산호 골격을 만들고 유지하는 데 어려움이 생길 수 있고 연결된 먹이 관계도 영향을 받을 수 있다. NOAA National Ocean Service의 설명을 바탕으로 정리한 자료다. 모든 생물의 반응이 같다는 뜻은 아니다."
   ],
   "drawing": "large"
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "물질의 연소",
   "blocks": [
    {
     "type": "diagram",
     "key": "book-preparation"
    },
    {
     "type": "text",
     "text": "섞기 전후의 성질, 서로 다른 연료의 연소, 보이지 않는 생성물과 바다 생태계를 이어 배워요. **본 사실·근거로 해석한 것·아직 모르는 것**을 구별해요."
    },
    {
     "type": "field",
     "title": "이름·학습 날짜와 궁금한 것",
     "hint": "이번 단원에서 무엇을 관찰하고 설명하고 싶은지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진·연습 자료·우리 반 실제 기록을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃·가열·시약 확인은 교사가 준비하고 시범해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "layout": "combustion-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "관찰에서 근거 있는 제안까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 모양이 달라도 같은 물질일까?",
       "1~16번"
      ],
      [
       "2. 서로 다른 물질을 섞어 비교하기",
       "17~32번"
      ],
      [
       "3. 양초와 알코올의 공통 현상",
       "33~48번"
      ],
      [
       "4. 불이 계속 타는 조건",
       "49~64번"
      ],
      [
       "5. 연소 뒤 물을 확인하기",
       "65~80번"
      ],
      [
       "6. 이산화 탄소와 전후의 성질",
       "81~96번"
      ],
      [
       "7. 생태계의 변화를 자료로 읽기",
       "97~112번"
      ],
      [
       "8. 해결책을 만들고 설명하기",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "8형식각16개, 모두128문항이에요. **핵심 정리·더 알아보기·내가 정리할 것**을 읽고 부분별 답은 바로 아래에 써요. 그림에는 이름표와 짧은 설명을 붙여요."
    },
    {
     "type": "field",
     "title": "오늘의 계획",
     "hint": "문항 연습과 실제 활동을 여러 시간에 나누어 계획해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 차시40분과 별도 확인45분은 수업 예시예요."
    },
    {
     "title": "더 알아보기",
     "text": "정답 문장을 썼다는 이유로 실제 실험·조사를 완료했다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 1",
   "title": "모양이 달라도 같은 물질일까?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "관찰",
       "눈·기구로 직접 확인한 사실"
      ],
      [
       "해석",
       "확인한 사실과 지식을 근거로 생각한 설명"
      ],
      [
       "성질 비교",
       "같은 항목으로 변화 전후를 살피는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "종이를 찢거나 말면 **크기·모양·수**가 달라져요. 그 관찰만으로 새로운 물질이 생겼다고 정하지 않아요. 무엇이 달라졌는지 같은 항목으로 전후를 비교해요."
    },
    {
     "type": "table",
     "heads": [
      "직접 확인한 사실",
      "그 사실을 넘어서 한 생각"
     ],
     "rows": [
      [
       "같은 종이가 세 조각으로 나뉘었다.",
       "다른 물질 세 종류가 생겼다."
      ],
      [
       "흰 가루가 보였다.",
       "모든 흰 가루는 소금이다."
      ]
     ]
    },
    {
     "type": "text",
     "text": "오른쪽 생각은 왼쪽 관찰만으로 확정할 수 없어요. 모르는 가루는 맛보거나 임의로 섞지 않고 교사가 확인한 표시·자료를 더 읽어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "모양이 달라도 같은 물질일까? · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "12cm 종이를 같은 길이 세 조각으로 나눴어요. 새로운 물질이 세 종류 생겼을까요?",
     "steps": [
      [
       "수치 읽기",
       "조각 수는1→3개, 한 조각 길이는12→4cm예요."
      ],
      [
       "항목 구별",
       "수와 크기의 변화이지 물질 세 종류를 확인한 시험이 아니에요."
      ],
      [
       "결론 한정",
       "그 근거로 말할 수 있는 변화만 설명해요."
      ]
     ],
     "answer": "조각 수·크기가 달라졌고, 그것만으로 새로운 물질 생성을 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w001",
      "c22-s62-u02-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 3~5",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w003",
      "c22-s62-u02-w004",
      "c22-s62-u02-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 6~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w006",
      "c22-s62-u02-w007",
      "c22-s62-u02-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w009",
      "c22-s62-u02-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 11",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 12",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 13",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 14",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 15",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 16",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ① · 전후 관찰",
   "title": "같은 종이의 변화부터 살펴요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 같은 종이의 처음 모습을 살펴요.",
      "종이를 찢거나 말고 같은 항목으로 전후를 비교해요.",
      "직접 본 사실과 그 사실에서 생각한 설명을 나누어요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "같게 비교할 항목",
      "처음",
      "나중"
     ],
     "rows": [
      [
       "크기·수",
       "",
       ""
      ],
      [
       "모양·다른 항목",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "관찰과 해석",
     "hint": "새 물질이 생겼는지 이 활동만으로 어디까지 말할 수 있을까요?",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-shape",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 2",
   "title": "서로 다른 물질을 섞어 비교하기",
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
       "차이를 살펴보려고 바꾸는 한 조건"
      ],
      [
       "같게 둘 조건",
       "비교를 위해 맞추는 양·컵·젓기·시간 등"
      ],
      [
       "기포 관찰",
       "기포가 언제 보이고 이어지는지 확인한 기록"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 확인한 재료로 혼합 전후의 **색·상태·기포 모습**을 같은 항목으로 비교해요. 젓는 동안 잠깐 보이는 기포와 젓기를 멈춘 뒤 이어지는 기포를 구별해요."
    },
    {
     "type": "table",
     "heads": [
      "비교 계획",
      "확인할 것"
     ],
     "rows": [
      [
       "달리할 조건",
       "선택한 액체의 종류"
      ],
      [
       "같게 둘 조건",
       "가루와 액체의 양·열린 컵·젓는 방법·관찰 시간"
      ],
      [
       "비교할 결과",
       "같은 시간 동안 기포가 이어지는 모습"
      ]
     ]
    },
    {
     "type": "text",
     "text": "여러 조건을 함께 바꾸면 어떤 조건의 영향인지 구별하기 어려워요. 원기록을 고치지 말고 조건을 맞춘 새 비교를 따로 남겨요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "서로 다른 물질을 섞어 비교하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "한 컵은 가루를 조금, 다른 컵은 많이 넣었어요. 기포 차이를 액체 때문이라고 해도 될까요?",
     "steps": [
      [
       "차이 찾기",
       "액체뿐 아니라 가루 양도 달라졌어요."
      ],
      [
       "비교 다시 계획",
       "가루 양·컵·시간을 맞춘 뒤 액체 조건을 비교해요."
      ],
      [
       "기록 보존",
       "앞 기록의 한계를 쓰고 새 관찰과 구별해요."
      ]
     ],
     "answer": "첫 기록만으로 액체 하나의 영향이라고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 17",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 18",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 19",
   "title": "빈칸 넣기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 20",
   "title": "빈칸 넣기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 21",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 22~24",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w022",
      "c22-s62-u02-w023",
      "c22-s62-u02-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 25",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 26",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 27",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 28",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 29",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 30",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 31",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 32",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ② · 비교 계획",
   "title": "우리 혼합 비교의 조건을 정해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "book-preparation"
    },
    {
     "type": "text",
     "text": "교사가 확인한 식초·베이킹 소다 등 승인 재료를 사용해요. 양·용기·방법·관찰 시간은 교사 계획을 확인해 적어요. 가스를 가두는 뚜껑을 닫지 않고 맛보거나 얼굴을 가까이 대지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "달리할 조건",
      "같게 둘 조건",
      "관찰할 결과"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "교사가 확인한 재료·양·관찰 시간",
     "hint": "미정인 값은 임의로 채우지 않고 확인할 계획을 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-plan",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ③ · 혼합 관찰",
   "title": "젓는 동안과 멈춘 뒤를 구별해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "실제 비교 조건",
      "젓는 동안",
      "같은 시간 뒤",
      "관찰 못한 것"
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
     "title": "우리 반의 사실·해석·한계",
     "hint": "기포 모습만으로 기체 이름을 정하지 않아요. 관찰하지 못했으면 미관찰로 남겨요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-mix",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 3",
   "title": "양초와 알코올의 공통 현상",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "연소",
       "물질이 타면서 빛과 열을 내는 현상"
      ],
      [
       "연료",
       "타는 데 쓰이는 물질"
      ],
      [
       "공통점",
       "서로 다른 연료의 관찰에서 함께 확인한 것"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "candle"
    },
    {
     "type": "text",
     "text": "교사 시범이나 출처·조건을 밝힌 자료에서 두 연료의 공통 현상을 찾아요. 빛을 본 사실과 온도계로 확인한 열의 영향을 구별해 적어요. 불꽃에 손을 가까이 대어 시험하지 않아요."
    },
    {
     "type": "text",
     "text": "불꽃 밖 온도계의 온도가 올라갔다는 자료는 열의 영향을 보여요. 그 수치를 **불꽃 내부 온도**나 두 연료의 전체 에너지로 바꾸어 읽지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "양초와 알코올의 공통 현상 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 온도계가23℃에서 각각32℃·29℃가 되었어요. 상승 폭과 공통점을 말해 볼까요?",
     "steps": [
      [
       "각각 빼기",
       "32−23=9℃,29−23=6℃예요."
      ],
      [
       "관찰 범위",
       "두 장치의 온도 상승이 확인돼요."
      ],
      [
       "확대 금지",
       "불꽃 내부 온도나 연료의 모든 성능을 비교한 것은 아니에요."
      ]
     ],
     "answer": "상승 폭은9℃와6℃이며 이 장치에서 열의 영향을 확인했어요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 33",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 34",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 35~36",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w035",
      "c22-s62-u02-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 37",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 38~39",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w038",
      "c22-s62-u02-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 40",
   "title": "순서 배열 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 41",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 42~43",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w042",
      "c22-s62-u02-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 44",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 45",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 46",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 47",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 48",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ④ · 교사 연소 시범",
   "title": "두 연료에서 같은 현상을 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "교사는 학교 안전 절차·불연성 받침·소화 준비·관찰 거리를 확인하고 시범해요. 학생은 불꽃·연료·뜨거운 기구를 조작하거나 손으로 열을 시험하지 않아요. 대체 자료를 봤다면 출처와 조건을 적어요."
    },
    {
     "type": "table",
     "heads": [
      "실제 연료·자료",
      "빛의 관찰",
      "열의 관찰·측정 근거",
      "재지 않은 것"
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
     "title": "공통점과 다른 점",
     "hint": "관찰의 근거와 장치 조건을 함께 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-fuels",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 4",
   "title": "불이 계속 타는 조건",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "탈 물질",
       "연소에 쓰이는 연료"
      ],
      [
       "산소",
       "연소가 이어지는 데 필요한 공기 성분"
      ],
      [
       "발화점",
       "물질이 타기 시작하는 데 필요한 온도 기준"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 연소 조건을 비교할 때에는 **어떤 조건을 바꾸고 무엇을 같게 했는지** 확인해요. 꺼진 결과만 외우지 말고 연료의 공급·공기 조건·온도와 근거를 연결해요."
    },
    {
     "type": "table",
     "heads": [
      "근거의 종류",
      "설명할 때 주의할 것"
     ],
     "rows": [
      [
       "같은 조성 공기의 처음 부피가 다름",
       "산소의 처음 양과 공기 전체를 구별"
      ],
      [
       "장치에서 불꽃이 꺼짐",
       "산소량0을 직접 측정한 것으로 바꾸지 않기"
      ],
      [
       "같은 물질의 온도 조건 비교",
       "타기 시작하는 온도 기준과 연결"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "불이 계속 타는 조건 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "공기 부피300mL·600mL에서28초·47초 동안 탔어요. 언제나 정확히 두 배일까요?",
     "steps": [
      [
       "두 양 비교",
       "부피는 두 배지만 시간은56초가 아니라47초예요."
      ],
      [
       "차 구하기",
       "시간 차이는19초예요."
      ],
      [
       "결론 한정",
       "이 조건에서 더 오래 이어졌다고 설명해요."
      ]
     ],
     "answer": "정확한 비례 법칙으로 일반화하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 49",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 50~51",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w050",
      "c22-s62-u02-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 52",
   "title": "빈칸 넣기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 53",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 54",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 55~56",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w055",
      "c22-s62-u02-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 57",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 58~59",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w058",
      "c22-s62-u02-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 60",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 61",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 62",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 63",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 64",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 연소 조건",
   "title": "한 결과에서 원인을 서두르지 않아요",
   "blocks": [
    {
     "type": "text",
     "text": "교사의 승인된 시범 또는 제공 자료로 세 조건의 근거를 연결해요. 밀폐 용기·압력 장치·임의 가열을 학생 활동으로 추가하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "살펴볼 조건",
      "실제 바꾼 것·맞춘 것",
      "관찰·측정 근거"
     ],
     "rows": [
      [
       "탈 물질",
       "",
       ""
      ],
      [
       "산소",
       "",
       ""
      ],
      [
       "온도",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "타당한 설명과 더 확인할 것",
     "hint": "꺼짐을 산소량0이나 모든 공기 소진으로 읽지 않아요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-conditions",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 5",
   "title": "연소 뒤 물을 확인하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "확인 시험",
       "물질의 성질을 이용해 존재를 판단하는 방법"
      ],
      [
       "염화 코발트 종이",
       "물 확인에 이용하는 시험지"
      ],
      [
       "대조 자료",
       "배경 습기·시험지 상태 등을 비교할 자료"
      ]
     ]
    },
    {
     "type": "text",
     "text": "푸른 염화 코발트 종이는 물을 만나면 붉은색 계열로 변해요. **색이 바뀌었다**는 관찰과 **물이 있음을 판단했다**는 해석을 구별해요. 같은 초기 상태의 비교 시험지를 함께 읽어요."
    },
    {
     "type": "text",
     "text": "학생은 시험지를 만지거나 가열하지 않아요. 교사가 시약·보호구·폐기 기준을 확인해 시범하고, 시범이 어렵다면 조건을 밝힌 제공 자료를 사용해요. 물 확인 결과는 물의 질량·부피를 잰 수치가 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "연소 뒤 물을 확인하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 시험지가 처음부터 붉은색이었어요. 초를 태운 뒤에도 붉은색이면 새로 생긴 물을 확인했을까요?",
     "steps": [
      [
       "처음 상태",
       "전부터 물기가 있었을 가능성을 구별해야 해요."
      ],
      [
       "대조 계획",
       "초기 상태·보관 조건을 확인한 시험지를 비교해요."
      ],
      [
       "기록 정리",
       "판단하기 어려운 결과를 그대로 남겨요."
      ]
     ],
     "answer": "색 이름만 보고 생성물 확인을 완료했다고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 65~66",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w065",
      "c22-s62-u02-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 67~68",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w067",
      "c22-s62-u02-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 69",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 70~71",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w070",
      "c22-s62-u02-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 72",
   "title": "순서 배열 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 73",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 74",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 75",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 76",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 77",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 78",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 79",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "80번 자료면",
   "title": "연소 뒤 물을 확인하기 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-question-data-80"
    },
    {
     "type": "text",
     "text": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 80번 질문에서 필요한 조건·시점·단위를 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 80",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 교사 물 확인",
   "title": "시험지의 전후와 대조를 읽어요",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 적절한 시약·보호구·보관·폐기를 확인하고 취급해요. 학생이 시험지를 만지거나 가열하지 않아요. 자료로 대신했다면 그 상태를 밝혀요."
    },
    {
     "type": "table",
     "heads": [
      "시험·비교 조건",
      "처음 상태",
      "나중 상태",
      "함께 확인한 조건"
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
     "title": "관찰과 해석",
     "hint": "시험지 색의 기록과 물의 존재에 관한 판단을 나누어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-water",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 6",
   "title": "이산화 탄소와 전후의 성질",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "석회수",
       "이산화 탄소 확인에 이용하는 맑은 용액"
      ],
      [
       "비교 기체",
       "같은 방법으로 반응을 비교할 기체 자료"
      ],
      [
       "성질 변화 근거",
       "전후의 같은 확인 시험에서 읽은 차이"
      ]
     ]
    },
    {
     "type": "text",
     "text": "이산화 탄소와 접촉하면 석회수가 뿌옇게 변하는 성질을 이용해요. **처음 맑음·나중의 변화·비교 장치**를 함께 살펴야 어떤 기체의 영향인지 설명할 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "확인하려는 것",
      "자료와 해석"
     ],
     "rows": [
      [
       "물의 존재",
       "시험지의 색 변화·초기 상태·대조"
      ],
      [
       "이산화 탄소의 존재",
       "석회수의 변화·비교 기체·같은 접촉 방법"
      ],
      [
       "연소 전후의 성질",
       "같은 시험 기준으로 전후를 비교한 근거"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 준비·취급·폐기를 맡아요. 학생이 입으로 관에 불거나 밀폐 용기를 가열하는 활동으로 바꾸지 않아요. 그을음을 반드시 생기는 공통 생성물로 쓰지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "이산화 탄소와 전후의 성질 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "초를 태운 쪽과 비교 쪽의 석회수가 모두 처음부터 뿌옇습니다. 결과를 어떻게 읽을까요?",
     "steps": [
      [
       "처음 확인",
       "전후의 차이를 읽을 맑은 초기 상태가 아니에요."
      ],
      [
       "조건 확인",
       "시약·기체·용기·접촉 방법을 점검해요."
      ],
      [
       "결론 보류",
       "새 조건에서 다시 확인하기 전에는 특정 원인으로 확정하지 않아요."
      ]
     ],
     "answer": "관찰과 판단의 한계를 남기고 교사와 다음 확인을 계획해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 81",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w081"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 82~84",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w082",
      "c22-s62-u02-w083",
      "c22-s62-u02-w084"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 85~86",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w085",
      "c22-s62-u02-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 87~88",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w087",
      "c22-s62-u02-w088"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 89",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 90",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 91",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 92",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 93",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 94",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 95",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 96",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 교사 기체 확인",
   "title": "맑은 석회수의 변화와 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 시약·용기·기체 접촉 방법·폐기 절차를 확인해요. 학생이 입으로 관에 불거나 용기를 밀폐·가열하지 않아요. 조건이 불명확하면 판단을 보류해요."
    },
    {
     "type": "table",
     "heads": [
      "연소 기체·비교 자료",
      "처음",
      "같은 방법·시간 뒤",
      "다른 원인 가능성"
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
     "title": "무엇을 근거로 판단했나요?",
     "hint": "이산화 탄소 확인과 두 물질의 같은 성질/다른 성질을 근거로 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-carbon",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 7",
   "title": "생태계의 변화를 자료로 읽기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "이산화 탄소 증가",
       "대기 중 이산화 탄소가 늘어나는 변화"
      ],
      [
       "바다 성질 변화",
       "이산화 탄소 흡수 증가와 연결된 바닷물의 변화"
      ],
      [
       "생태계 연결",
       "생물과 먹이·서식 환경의 관계"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "shells"
    },
    {
     "type": "text",
     "text": "바다가 이산화 탄소를 더 흡수하면 바닷물의 성질이 달라질 수 있어요. 일부 생물은 껍데기·골격을 만들고 유지하기 어려워질 수 있고 먹이 관계에도 영향이 이어질 수 있어요."
    },
    {
     "type": "text",
     "text": "사진 한 장의 생김새는 변화 전후 측정이 아니에요. **대상·조건·기간·측정한 양**이 있는 자료로 설명해요. 가상 연습값은 현재 국내 피해 실측이나 모든 생물의 반응이 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "생태계의 변화를 자료로 읽기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "14일 가상 모형의 추가 생장이A2.1mm·B1.2mm입니다. B껍데기가0.9mm 녹았다는 뜻일까요?",
     "steps": [
      [
       "측정한 양",
       "기록은 이미 있던 껍데기 길이가 아니라 추가 생장 길이예요."
      ],
      [
       "차 계산",
       "2.1−1.2=0.9mm예요."
      ],
      [
       "결론 범위",
       "B의 추가 생장이 더 작다는 모형 관계를 읽어요."
      ]
     ],
     "answer": "더 적게 자람을 그만큼 녹아 사라짐으로 바꾸지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 97",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w097"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 98",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w098"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 99~100",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w099",
      "c22-s62-u02-w100"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 101~102",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w101",
      "c22-s62-u02-w102"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 103~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w103",
      "c22-s62-u02-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w105",
      "c22-s62-u02-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 107",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 108",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 109",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 110",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 111",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 112",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 사례 조사",
   "title": "사진보다 조건 있는 자료를 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "table",
     "heads": [
      "자료·기관·시기",
      "대상·장소",
      "실제로 확인한 내용",
      "없는 정보"
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
     "title": "자료의 종류와 남은 질문",
     "hint": "설명 글·역사적 사례·가상 모형·현재 실측을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-source",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 생태계 연결",
   "title": "중간 과정을 빠뜨리지 않아요",
   "blocks": [
    {
     "type": "text",
     "text": "읽은 사례에서 이산화 탄소·바다의 성질·생물의 변화가 어떻게 연결되는지 표시해요. 자료에 없는 피해 수치를 만들어 넣지 않아요."
    },
    {
     "type": "field",
     "title": "조건과 근거를 붙인 연결 그림",
     "hint": "대상·기간과 중간 과정을 쓰고 모든 생물이 같다는 과장을 피하세요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-ecosystem",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 8",
   "title": "해결책을 만들고 설명하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "원인 저감",
       "증가 원인을 줄이려는 방법"
      ],
      [
       "피해 대응",
       "변화를 관측·알려 피해에 대비하는 방법"
      ],
      [
       "근거 있는 제안",
       "사례의 역할·한계를 읽고 조건에 맞게 만든 생각"
      ]
     ]
    },
    {
     "type": "text",
     "text": "과거 미국 서해안 패류 양식장의 사례를 읽을 때 **장소·대상·시기**를 밝혀요. 물 상태 관측과 경보는 피해에 대응하도록 돕는 방법이에요. 오늘 국내 전체 바다의 측정 결과로 옮겨 쓰지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "제안의 역할",
      "확인할 근거"
     ],
     "rows": [
      [
       "원인 저감",
       "어떤 증가 원인을 어떻게 줄이는가?"
      ],
      [
       "피해 대응",
       "무엇을 관측·알리고 누구의 대응을 돕는가?"
      ],
      [
       "설명 나눔",
       "상대의 질문과 어떤 근거로 설명을 보완했는가?"
      ]
     ]
    },
    {
     "type": "text",
     "text": "자료에서 확인한 내용과 내 제안을 구별해요. 실제로 조사·제작·설명하지 않았다면 계획 단계라고 남겨요. 긴 탐구보고서 대신 한 장 설명 자료를 만들고 서로 질문해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "해결책을 만들고 설명하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "친구가 “경보가 있으니 이산화 탄소 문제는 끝났어”라고 했어요. 어떻게 고칠까요?",
     "steps": [
      [
       "역할 찾기",
       "경보는 상태 변화를 알려 대응을 돕는 방법이에요."
      ],
      [
       "남는 원인",
       "증가 원인을 줄이는 조치는 별도로 필요해요."
      ],
      [
       "설명 보완",
       "도움이 되는 점과 해결하지 못한 점을 함께 써요."
      ]
     ],
     "answer": "원인 저감과 피해 대응의 역할을 나누어 근거에 맞게 제안해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 113",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w113"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 114~115",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w114",
      "c22-s62-u02-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 116~117",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w116",
      "c22-s62-u02-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 118~120",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w118",
      "c22-s62-u02-w119",
      "c22-s62-u02-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 121~122",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w121",
      "c22-s62-u02-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 123",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 124",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 125",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 126",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 127",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 128",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑩ · 설명 카드",
   "title": "우리 제안의 역할과 한계를 담아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "조사 자료의 출처·대상·시기를 적어요.",
      "원인 저감·피해 대응 중 제안의 역할과 근거를 표시해요.",
      "도움이 되는 점·아직 해결하지 못한 점·상대에게 묻고 싶은 것을 담아요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "한 장 설명 카드의 배치",
     "hint": "실제로 만든 카드와 계획한 배치를 구별하고 이름표·짧은 문장으로 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-card",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑪ · 나눔과 보완",
   "title": "받은 질문으로 근거를 다시 확인해요",
   "blocks": [
    {
     "type": "field",
     "title": "실제로 설명한 내용과 받은 질문",
     "hint": "아직 설명하지 않았다면 미실시·예상 질문을 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "원래 생각·확인한 근거·고친 부분",
     "hint": "전후를 남겨 무엇을 왜 고쳤는지 설명해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 정리",
   "title": "겉모습에서 생태계까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "생각을 잇는 근거",
      "확인할 관계"
     ],
     "rows": [
      [
       "혼합 전후의 같은 관찰 항목",
       "모양·성질, 관찰·해석"
      ],
      [
       "두 연료·세 연소 조건",
       "빛·열과 연료·산소·온도"
      ],
      [
       "시험지·석회수·대조",
       "생성물의 확인과 결론 범위"
      ],
      [
       "사례·자료·설명 카드",
       "생태계 영향과 해결책의 역할·한계"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 것",
     "hint": "관찰·자료·해석·남은 질문을 이어 정리해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 성취기준6과14-01~04를 실제 근거와 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "한 문장 정답과 실제 수행의 확인은 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-01",
   "title": "혼합 전후의 근거로 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 승인한 혼합 비교에서 달리한 조건·맞춘 조건과 같은 항목의 전후 기록을 남겨요. 관찰·해석을 구별해 성질 변화의 근거와 한계를 설명해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-02",
   "title": "공통 현상과 연소 조건 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "서로 다른 연료의 실제 시범 또는 조건을 밝힌 자료를 읽어요. 빛·열의 공통 근거와 연료·산소·온도의 역할을 연결하고 재지 않은 양을 구별해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-03",
   "title": "생성물을 확인하는 근거 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "교사의 시험지·석회수 시범 또는 제공 자료에서 초기 상태·대조·전후 변화를 비교해요. 관찰과 물·이산화 탄소에 관한 해석을 연결해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-04",
   "title": "사례를 조사하고 해결책 나누기",
   "blocks": [
    {
     "type": "text",
     "text": "출처·대상·시기가 있는 사례를 실제로 조사해요. 생태계 영향과 해결책의 역할·한계를 담은 자료를 만들어 설명하고 받은 질문으로 보완해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  }
 ],
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "물질의 연소",
   "blocks": [
    {
     "type": "diagram",
     "key": "book-preparation"
    },
    {
     "type": "text",
     "text": "섞기 전후의 성질, 서로 다른 연료의 연소, 보이지 않는 생성물과 바다 생태계를 이어 배워요. **본 사실·근거로 해석한 것·아직 모르는 것**을 구별해요."
    },
    {
     "type": "field",
     "title": "이름·학습 날짜와 궁금한 것",
     "hint": "이번 단원에서 무엇을 관찰하고 설명하고 싶은지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진·연습 자료·우리 반 실제 기록을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃·가열·시약 확인은 교사가 준비하고 시범해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "layout": "combustion-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "관찰에서 근거 있는 제안까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 모양이 달라도 같은 물질일까?",
       "1~16번"
      ],
      [
       "2. 서로 다른 물질을 섞어 비교하기",
       "17~32번"
      ],
      [
       "3. 양초와 알코올의 공통 현상",
       "33~48번"
      ],
      [
       "4. 불이 계속 타는 조건",
       "49~64번"
      ],
      [
       "5. 연소 뒤 물을 확인하기",
       "65~80번"
      ],
      [
       "6. 이산화 탄소와 전후의 성질",
       "81~96번"
      ],
      [
       "7. 생태계의 변화를 자료로 읽기",
       "97~112번"
      ],
      [
       "8. 해결책을 만들고 설명하기",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "8형식각16개, 모두128문항이에요. **핵심 정리·더 알아보기·내가 정리할 것**을 읽고 부분별 답은 바로 아래에 써요. 그림에는 이름표와 짧은 설명을 붙여요."
    },
    {
     "type": "field",
     "title": "오늘의 계획",
     "hint": "문항 연습과 실제 활동을 여러 시간에 나누어 계획해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 차시40분과 별도 확인45분은 수업 예시예요."
    },
    {
     "title": "더 알아보기",
     "text": "정답 문장을 썼다는 이유로 실제 실험·조사를 완료했다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 1",
   "title": "모양이 달라도 같은 물질일까?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "관찰",
       "눈·기구로 직접 확인한 사실"
      ],
      [
       "해석",
       "확인한 사실과 지식을 근거로 생각한 설명"
      ],
      [
       "성질 비교",
       "같은 항목으로 변화 전후를 살피는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "종이를 찢거나 말면 **크기·모양·수**가 달라져요. 그 관찰만으로 새로운 물질이 생겼다고 정하지 않아요. 무엇이 달라졌는지 같은 항목으로 전후를 비교해요."
    },
    {
     "type": "table",
     "heads": [
      "직접 확인한 사실",
      "그 사실을 넘어서 한 생각"
     ],
     "rows": [
      [
       "같은 종이가 세 조각으로 나뉘었다.",
       "다른 물질 세 종류가 생겼다."
      ],
      [
       "흰 가루가 보였다.",
       "모든 흰 가루는 소금이다."
      ]
     ]
    },
    {
     "type": "text",
     "text": "오른쪽 생각은 왼쪽 관찰만으로 확정할 수 없어요. 모르는 가루는 맛보거나 임의로 섞지 않고 교사가 확인한 표시·자료를 더 읽어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "모양이 달라도 같은 물질일까? · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "12cm 종이를 같은 길이 세 조각으로 나눴어요. 새로운 물질이 세 종류 생겼을까요?",
     "steps": [
      [
       "수치 읽기",
       "조각 수는1→3개, 한 조각 길이는12→4cm예요."
      ],
      [
       "항목 구별",
       "수와 크기의 변화이지 물질 세 종류를 확인한 시험이 아니에요."
      ],
      [
       "결론 한정",
       "그 근거로 말할 수 있는 변화만 설명해요."
      ]
     ],
     "answer": "조각 수·크기가 달라졌고, 그것만으로 새로운 물질 생성을 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w001",
      "c22-s62-u02-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 3~5",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w003",
      "c22-s62-u02-w004",
      "c22-s62-u02-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 6~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w006",
      "c22-s62-u02-w007",
      "c22-s62-u02-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w009",
      "c22-s62-u02-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 11",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 12",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 13",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 14",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 15",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "모양이 달라도 같은 물질일까? · 16",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 본 사실과 그 사실에서 생각한 설명을 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ① · 전후 관찰",
   "title": "같은 종이의 변화부터 살펴요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 같은 종이의 처음 모습을 살펴요.",
      "종이를 찢거나 말고 같은 항목으로 전후를 비교해요.",
      "직접 본 사실과 그 사실에서 생각한 설명을 나누어요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "같게 비교할 항목",
      "처음",
      "나중"
     ],
     "rows": [
      [
       "크기·수",
       "",
       ""
      ],
      [
       "모양·다른 항목",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "관찰과 해석",
     "hint": "새 물질이 생겼는지 이 활동만으로 어디까지 말할 수 있을까요?",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "겉모습의 변화와 다른 물질의 생성을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "물질의 이름은 모양이나 색 하나만으로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-shape",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 2",
   "title": "서로 다른 물질을 섞어 비교하기",
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
       "차이를 살펴보려고 바꾸는 한 조건"
      ],
      [
       "같게 둘 조건",
       "비교를 위해 맞추는 양·컵·젓기·시간 등"
      ],
      [
       "기포 관찰",
       "기포가 언제 보이고 이어지는지 확인한 기록"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 확인한 재료로 혼합 전후의 **색·상태·기포 모습**을 같은 항목으로 비교해요. 젓는 동안 잠깐 보이는 기포와 젓기를 멈춘 뒤 이어지는 기포를 구별해요."
    },
    {
     "type": "table",
     "heads": [
      "비교 계획",
      "확인할 것"
     ],
     "rows": [
      [
       "달리할 조건",
       "선택한 액체의 종류"
      ],
      [
       "같게 둘 조건",
       "가루와 액체의 양·열린 컵·젓는 방법·관찰 시간"
      ],
      [
       "비교할 결과",
       "같은 시간 동안 기포가 이어지는 모습"
      ]
     ]
    },
    {
     "type": "text",
     "text": "여러 조건을 함께 바꾸면 어떤 조건의 영향인지 구별하기 어려워요. 원기록을 고치지 말고 조건을 맞춘 새 비교를 따로 남겨요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "서로 다른 물질을 섞어 비교하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "한 컵은 가루를 조금, 다른 컵은 많이 넣었어요. 기포 차이를 액체 때문이라고 해도 될까요?",
     "steps": [
      [
       "차이 찾기",
       "액체뿐 아니라 가루 양도 달라졌어요."
      ],
      [
       "비교 다시 계획",
       "가루 양·컵·시간을 맞춘 뒤 액체 조건을 비교해요."
      ],
      [
       "기록 보존",
       "앞 기록의 한계를 쓰고 새 관찰과 구별해요."
      ]
     ],
     "answer": "첫 기록만으로 액체 하나의 영향이라고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 17",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 18",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 19",
   "title": "빈칸 넣기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 20",
   "title": "빈칸 넣기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 21",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 22~24",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w022",
      "c22-s62-u02-w023",
      "c22-s62-u02-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 25",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 26",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 27",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 28",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 29",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 30",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 31",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "서로 다른 물질을 섞어 비교하기 · 32",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 비교에서 바꾼 것·맞춘 것·관찰할 것을 정해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ② · 비교 계획",
   "title": "우리 혼합 비교의 조건을 정해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "book-preparation"
    },
    {
     "type": "text",
     "text": "교사가 확인한 식초·베이킹 소다 등 승인 재료를 사용해요. 양·용기·방법·관찰 시간은 교사 계획을 확인해 적어요. 가스를 가두는 뚜껑을 닫지 않고 맛보거나 얼굴을 가까이 대지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "달리할 조건",
      "같게 둘 조건",
      "관찰할 결과"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "교사가 확인한 재료·양·관찰 시간",
     "hint": "미정인 값은 임의로 채우지 않고 확인할 계획을 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-plan",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ③ · 혼합 관찰",
   "title": "젓는 동안과 멈춘 뒤를 구별해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "실제 비교 조건",
      "젓는 동안",
      "같은 시간 뒤",
      "관찰 못한 것"
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
     "title": "우리 반의 사실·해석·한계",
     "hint": "기포 모습만으로 기체 이름을 정하지 않아요. 관찰하지 못했으면 미관찰로 남겨요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 섞기 전후를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "기포가 보였다고 기체 이름을 바로 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-mix",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 3",
   "title": "양초와 알코올의 공통 현상",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "연소",
       "물질이 타면서 빛과 열을 내는 현상"
      ],
      [
       "연료",
       "타는 데 쓰이는 물질"
      ],
      [
       "공통점",
       "서로 다른 연료의 관찰에서 함께 확인한 것"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "candle"
    },
    {
     "type": "text",
     "text": "교사 시범이나 출처·조건을 밝힌 자료에서 두 연료의 공통 현상을 찾아요. 빛을 본 사실과 온도계로 확인한 열의 영향을 구별해 적어요. 불꽃에 손을 가까이 대어 시험하지 않아요."
    },
    {
     "type": "text",
     "text": "불꽃 밖 온도계의 온도가 올라갔다는 자료는 열의 영향을 보여요. 그 수치를 **불꽃 내부 온도**나 두 연료의 전체 에너지로 바꾸어 읽지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "양초와 알코올의 공통 현상 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 온도계가23℃에서 각각32℃·29℃가 되었어요. 상승 폭과 공통점을 말해 볼까요?",
     "steps": [
      [
       "각각 빼기",
       "32−23=9℃,29−23=6℃예요."
      ],
      [
       "관찰 범위",
       "두 장치의 온도 상승이 확인돼요."
      ],
      [
       "확대 금지",
       "불꽃 내부 온도나 연료의 모든 성능을 비교한 것은 아니에요."
      ]
     ],
     "answer": "상승 폭은9℃와6℃이며 이 장치에서 열의 영향을 확인했어요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 33",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 34",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 35~36",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w035",
      "c22-s62-u02-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 37",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 38~39",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w038",
      "c22-s62-u02-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 40",
   "title": "순서 배열 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 41",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 42~43",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w042",
      "c22-s62-u02-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 44",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 45",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 46",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 47",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "양초와 알코올의 공통 현상 · 48",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 연료에서 공통으로 확인한 근거와 재지 않은 것을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ④ · 교사 연소 시범",
   "title": "두 연료에서 같은 현상을 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "교사는 학교 안전 절차·불연성 받침·소화 준비·관찰 거리를 확인하고 시범해요. 학생은 불꽃·연료·뜨거운 기구를 조작하거나 손으로 열을 시험하지 않아요. 대체 자료를 봤다면 출처와 조건을 적어요."
    },
    {
     "type": "table",
     "heads": [
      "실제 연료·자료",
      "빛의 관찰",
      "열의 관찰·측정 근거",
      "재지 않은 것"
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
     "title": "공통점과 다른 점",
     "hint": "관찰의 근거와 장치 조건을 함께 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양초·알코올이 탈 때 빛과 열이 나요."
    },
    {
     "title": "더 알아보기",
     "text": "불꽃색·그을음은 연료와 조건에 따라 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-fuels",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 4",
   "title": "불이 계속 타는 조건",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "탈 물질",
       "연소에 쓰이는 연료"
      ],
      [
       "산소",
       "연소가 이어지는 데 필요한 공기 성분"
      ],
      [
       "발화점",
       "물질이 타기 시작하는 데 필요한 온도 기준"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 연소 조건을 비교할 때에는 **어떤 조건을 바꾸고 무엇을 같게 했는지** 확인해요. 꺼진 결과만 외우지 말고 연료의 공급·공기 조건·온도와 근거를 연결해요."
    },
    {
     "type": "table",
     "heads": [
      "근거의 종류",
      "설명할 때 주의할 것"
     ],
     "rows": [
      [
       "같은 조성 공기의 처음 부피가 다름",
       "산소의 처음 양과 공기 전체를 구별"
      ],
      [
       "장치에서 불꽃이 꺼짐",
       "산소량0을 직접 측정한 것으로 바꾸지 않기"
      ],
      [
       "같은 물질의 온도 조건 비교",
       "타기 시작하는 온도 기준과 연결"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "불이 계속 타는 조건 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "공기 부피300mL·600mL에서28초·47초 동안 탔어요. 언제나 정확히 두 배일까요?",
     "steps": [
      [
       "두 양 비교",
       "부피는 두 배지만 시간은56초가 아니라47초예요."
      ],
      [
       "차 구하기",
       "시간 차이는19초예요."
      ],
      [
       "결론 한정",
       "이 조건에서 더 오래 이어졌다고 설명해요."
      ]
     ],
     "answer": "정확한 비례 법칙으로 일반화하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 49",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 50~51",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w050",
      "c22-s62-u02-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 52",
   "title": "빈칸 넣기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 53",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 54",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 55~56",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w055",
      "c22-s62-u02-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 57",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 58~59",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w058",
      "c22-s62-u02-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 60",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 61",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 62",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 63",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "불이 계속 타는 조건 · 64",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "연소의 세 조건마다 어떤 비교 근거가 필요한지 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 연소 조건",
   "title": "한 결과에서 원인을 서두르지 않아요",
   "blocks": [
    {
     "type": "text",
     "text": "교사의 승인된 시범 또는 제공 자료로 세 조건의 근거를 연결해요. 밀폐 용기·압력 장치·임의 가열을 학생 활동으로 추가하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "살펴볼 조건",
      "실제 바꾼 것·맞춘 것",
      "관찰·측정 근거"
     ],
     "rows": [
      [
       "탈 물질",
       "",
       ""
      ],
      [
       "산소",
       "",
       ""
      ],
      [
       "온도",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "타당한 설명과 더 확인할 것",
     "hint": "꺼짐을 산소량0이나 모든 공기 소진으로 읽지 않아요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "탈 물질·산소·발화점 이상의 온도를 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "공기 전체가 산소는 아니며 꺼졌다고 산소가 완전히 없어졌다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-conditions",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 5",
   "title": "연소 뒤 물을 확인하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "확인 시험",
       "물질의 성질을 이용해 존재를 판단하는 방법"
      ],
      [
       "염화 코발트 종이",
       "물 확인에 이용하는 시험지"
      ],
      [
       "대조 자료",
       "배경 습기·시험지 상태 등을 비교할 자료"
      ]
     ]
    },
    {
     "type": "text",
     "text": "푸른 염화 코발트 종이는 물을 만나면 붉은색 계열로 변해요. **색이 바뀌었다**는 관찰과 **물이 있음을 판단했다**는 해석을 구별해요. 같은 초기 상태의 비교 시험지를 함께 읽어요."
    },
    {
     "type": "text",
     "text": "학생은 시험지를 만지거나 가열하지 않아요. 교사가 시약·보호구·폐기 기준을 확인해 시범하고, 시범이 어렵다면 조건을 밝힌 제공 자료를 사용해요. 물 확인 결과는 물의 질량·부피를 잰 수치가 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "연소 뒤 물을 확인하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 시험지가 처음부터 붉은색이었어요. 초를 태운 뒤에도 붉은색이면 새로 생긴 물을 확인했을까요?",
     "steps": [
      [
       "처음 상태",
       "전부터 물기가 있었을 가능성을 구별해야 해요."
      ],
      [
       "대조 계획",
       "초기 상태·보관 조건을 확인한 시험지를 비교해요."
      ],
      [
       "기록 정리",
       "판단하기 어려운 결과를 그대로 남겨요."
      ]
     ],
     "answer": "색 이름만 보고 생성물 확인을 완료했다고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 65~66",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w065",
      "c22-s62-u02-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 67~68",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w067",
      "c22-s62-u02-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 69",
   "title": "연결하기 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 70~71",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w070",
      "c22-s62-u02-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 72",
   "title": "순서 배열 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 73",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 74",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 75",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 76",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 77",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 78",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 79",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "80번 자료면",
   "title": "연소 뒤 물을 확인하기 · 자료 먼저 읽기",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-question-data-80"
    },
    {
     "type": "text",
     "text": "푸른 염화 코발트 종이의 색을 기록한 가상 자료다. 같은 시작 상태·공기·관찰 시간과 시험 방법을 맞췄다. 시험지·연소·시약 폐기는 교사가 관리한다."
    },
    {
     "type": "field",
     "title": "자료에서 표시할 것",
     "hint": "다음 면의 80번 질문에서 필요한 조건·시점·단위를 표시해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "question-context",
   "layout": "combustion-workbook"
  },
  {
   "section": "연소 뒤 물을 확인하기 · 80",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "색 변화의 관찰과 물에 관한 해석을 연결할 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 교사 물 확인",
   "title": "시험지의 전후와 대조를 읽어요",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 적절한 시약·보호구·보관·폐기를 확인하고 취급해요. 학생이 시험지를 만지거나 가열하지 않아요. 자료로 대신했다면 그 상태를 밝혀요."
    },
    {
     "type": "table",
     "heads": [
      "시험·비교 조건",
      "처음 상태",
      "나중 상태",
      "함께 확인한 조건"
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
     "title": "관찰과 해석",
     "hint": "시험지 색의 기록과 물의 존재에 관한 판단을 나누어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험지 색 변화·시험 원리·대조를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "연소 전부터 있던 습기와 시험지의 보관 상태도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-water",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 6",
   "title": "이산화 탄소와 전후의 성질",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "석회수",
       "이산화 탄소 확인에 이용하는 맑은 용액"
      ],
      [
       "비교 기체",
       "같은 방법으로 반응을 비교할 기체 자료"
      ],
      [
       "성질 변화 근거",
       "전후의 같은 확인 시험에서 읽은 차이"
      ]
     ]
    },
    {
     "type": "text",
     "text": "이산화 탄소와 접촉하면 석회수가 뿌옇게 변하는 성질을 이용해요. **처음 맑음·나중의 변화·비교 장치**를 함께 살펴야 어떤 기체의 영향인지 설명할 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "확인하려는 것",
      "자료와 해석"
     ],
     "rows": [
      [
       "물의 존재",
       "시험지의 색 변화·초기 상태·대조"
      ],
      [
       "이산화 탄소의 존재",
       "석회수의 변화·비교 기체·같은 접촉 방법"
      ],
      [
       "연소 전후의 성질",
       "같은 시험 기준으로 전후를 비교한 근거"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 준비·취급·폐기를 맡아요. 학생이 입으로 관에 불거나 밀폐 용기를 가열하는 활동으로 바꾸지 않아요. 그을음을 반드시 생기는 공통 생성물로 쓰지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "이산화 탄소와 전후의 성질 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "초를 태운 쪽과 비교 쪽의 석회수가 모두 처음부터 뿌옇습니다. 결과를 어떻게 읽을까요?",
     "steps": [
      [
       "처음 확인",
       "전후의 차이를 읽을 맑은 초기 상태가 아니에요."
      ],
      [
       "조건 확인",
       "시약·기체·용기·접촉 방법을 점검해요."
      ],
      [
       "결론 보류",
       "새 조건에서 다시 확인하기 전에는 특정 원인으로 확정하지 않아요."
      ]
     ],
     "answer": "관찰과 판단의 한계를 남기고 교사와 다음 확인을 계획해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 81",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w081"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 82~84",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w082",
      "c22-s62-u02-w083",
      "c22-s62-u02-w084"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 85~86",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w085",
      "c22-s62-u02-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 87~88",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w087",
      "c22-s62-u02-w088"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 89",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 90",
   "title": "복수 선택 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 91",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 92",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 93",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 94",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 95",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "이산화 탄소와 전후의 성질 · 96",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "무슨 관찰로 어떤 물질을 판단했는지 한 줄씩 연결해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 교사 기체 확인",
   "title": "맑은 석회수의 변화와 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 시약·용기·기체 접촉 방법·폐기 절차를 확인해요. 학생이 입으로 관에 불거나 용기를 밀폐·가열하지 않아요. 조건이 불명확하면 판단을 보류해요."
    },
    {
     "type": "table",
     "heads": [
      "연소 기체·비교 자료",
      "처음",
      "같은 방법·시간 뒤",
      "다른 원인 가능성"
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
     "title": "무엇을 근거로 판단했나요?",
     "hint": "이산화 탄소 확인과 두 물질의 같은 성질/다른 성질을 근거로 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "석회수의 전후 변화와 비교 조건을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 연료의 자료를 모든 물질의 연소 결과로 넓히지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-carbon",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 7",
   "title": "생태계의 변화를 자료로 읽기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "이산화 탄소 증가",
       "대기 중 이산화 탄소가 늘어나는 변화"
      ],
      [
       "바다 성질 변화",
       "이산화 탄소 흡수 증가와 연결된 바닷물의 변화"
      ],
      [
       "생태계 연결",
       "생물과 먹이·서식 환경의 관계"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "shells"
    },
    {
     "type": "text",
     "text": "바다가 이산화 탄소를 더 흡수하면 바닷물의 성질이 달라질 수 있어요. 일부 생물은 껍데기·골격을 만들고 유지하기 어려워질 수 있고 먹이 관계에도 영향이 이어질 수 있어요."
    },
    {
     "type": "text",
     "text": "사진 한 장의 생김새는 변화 전후 측정이 아니에요. **대상·조건·기간·측정한 양**이 있는 자료로 설명해요. 가상 연습값은 현재 국내 피해 실측이나 모든 생물의 반응이 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "생태계의 변화를 자료로 읽기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "14일 가상 모형의 추가 생장이A2.1mm·B1.2mm입니다. B껍데기가0.9mm 녹았다는 뜻일까요?",
     "steps": [
      [
       "측정한 양",
       "기록은 이미 있던 껍데기 길이가 아니라 추가 생장 길이예요."
      ],
      [
       "차 계산",
       "2.1−1.2=0.9mm예요."
      ],
      [
       "결론 범위",
       "B의 추가 생장이 더 작다는 모형 관계를 읽어요."
      ]
     ],
     "answer": "더 적게 자람을 그만큼 녹아 사라짐으로 바꾸지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 97",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w097"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 98",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w098"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 99~100",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w099",
      "c22-s62-u02-w100"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 101~102",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w101",
      "c22-s62-u02-w102"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 103~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w103",
      "c22-s62-u02-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w105",
      "c22-s62-u02-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 107",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 108",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 109",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 110",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 111",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "생태계의 변화를 자료로 읽기 · 112",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료가 실제로 잰 양과 이 자료로 정할 수 없는 것을 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 사례 조사",
   "title": "사진보다 조건 있는 자료를 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "table",
     "heads": [
      "자료·기관·시기",
      "대상·장소",
      "실제로 확인한 내용",
      "없는 정보"
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
     "title": "자료의 종류와 남은 질문",
     "hint": "설명 글·역사적 사례·가상 모형·현재 실측을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-source",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 생태계 연결",
   "title": "중간 과정을 빠뜨리지 않아요",
   "blocks": [
    {
     "type": "text",
     "text": "읽은 사례에서 이산화 탄소·바다의 성질·생물의 변화가 어떻게 연결되는지 표시해요. 자료에 없는 피해 수치를 만들어 넣지 않아요."
    },
    {
     "type": "field",
     "title": "조건과 근거를 붙인 연결 그림",
     "hint": "대상·기간과 중간 과정을 쓰고 모든 생물이 같다는 과장을 피하세요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이산화 탄소→바다 성질→일부 생물의 어려움을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 종·지역·시기의 반응이 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-ecosystem",
   "layout": "combustion-workbook"
  },
  {
   "section": "개념 8",
   "title": "해결책을 만들고 설명하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "원인 저감",
       "증가 원인을 줄이려는 방법"
      ],
      [
       "피해 대응",
       "변화를 관측·알려 피해에 대비하는 방법"
      ],
      [
       "근거 있는 제안",
       "사례의 역할·한계를 읽고 조건에 맞게 만든 생각"
      ]
     ]
    },
    {
     "type": "text",
     "text": "과거 미국 서해안 패류 양식장의 사례를 읽을 때 **장소·대상·시기**를 밝혀요. 물 상태 관측과 경보는 피해에 대응하도록 돕는 방법이에요. 오늘 국내 전체 바다의 측정 결과로 옮겨 쓰지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "제안의 역할",
      "확인할 근거"
     ],
     "rows": [
      [
       "원인 저감",
       "어떤 증가 원인을 어떻게 줄이는가?"
      ],
      [
       "피해 대응",
       "무엇을 관측·알리고 누구의 대응을 돕는가?"
      ],
      [
       "설명 나눔",
       "상대의 질문과 어떤 근거로 설명을 보완했는가?"
      ]
     ]
    },
    {
     "type": "text",
     "text": "자료에서 확인한 내용과 내 제안을 구별해요. 실제로 조사·제작·설명하지 않았다면 계획 단계라고 남겨요. 긴 탐구보고서 대신 한 장 설명 자료를 만들고 서로 질문해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "layout": "combustion-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "해결책을 만들고 설명하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "친구가 “경보가 있으니 이산화 탄소 문제는 끝났어”라고 했어요. 어떻게 고칠까요?",
     "steps": [
      [
       "역할 찾기",
       "경보는 상태 변화를 알려 대응을 돕는 방법이에요."
      ],
      [
       "남는 원인",
       "증가 원인을 줄이는 조치는 별도로 필요해요."
      ],
      [
       "설명 보완",
       "도움이 되는 점과 해결하지 못한 점을 함께 써요."
      ]
     ],
     "answer": "원인 저감과 피해 대응의 역할을 나누어 근거에 맞게 제안해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 113",
   "title": "객관식 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w113"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 114~115",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w114",
      "c22-s62-u02-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 116~117",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w116",
      "c22-s62-u02-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 118~120",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w118",
      "c22-s62-u02-w119",
      "c22-s62-u02-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 121~122",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w121",
      "c22-s62-u02-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 123",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 124",
   "title": "자료 해석 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 125",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 126",
   "title": "까닭 설명 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 127",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "해결책을 만들고 설명하기 · 128",
   "title": "그림·설계 · 근거로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s62-u02-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 제안이 맡는 역할·남는 한계와 친구 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑩ · 설명 카드",
   "title": "우리 제안의 역할과 한계를 담아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "조사 자료의 출처·대상·시기를 적어요.",
      "원인 저감·피해 대응 중 제안의 역할과 근거를 표시해요.",
      "도움이 되는 점·아직 해결하지 못한 점·상대에게 묻고 싶은 것을 담아요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "한 장 설명 카드의 배치",
     "hint": "실제로 만든 카드와 계획한 배치를 구별하고 이름표·짧은 문장으로 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-card",
   "layout": "combustion-workbook"
  },
  {
   "section": "실제 활동 ⑪ · 나눔과 보완",
   "title": "받은 질문으로 근거를 다시 확인해요",
   "blocks": [
    {
     "type": "field",
     "title": "실제로 설명한 내용과 받은 질문",
     "hint": "아직 설명하지 않았다면 미실시·예상 질문을 구별해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "원래 생각·확인한 근거·고친 부분",
     "hint": "전후를 남겨 무엇을 왜 고쳤는지 설명해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·근거·역할·한계를 갖춘 해결책을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "경보 하나가 증가 원인과 모든 피해를 해결하는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 정리",
   "title": "겉모습에서 생태계까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "생각을 잇는 근거",
      "확인할 관계"
     ],
     "rows": [
      [
       "혼합 전후의 같은 관찰 항목",
       "모양·성질, 관찰·해석"
      ],
      [
       "두 연료·세 연소 조건",
       "빛·열과 연료·산소·온도"
      ],
      [
       "시험지·석회수·대조",
       "생성물의 확인과 결론 범위"
      ],
      [
       "사례·자료·설명 카드",
       "생태계 영향과 해결책의 역할·한계"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 것",
     "hint": "관찰·자료·해석·남은 질문을 이어 정리해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "네 성취기준6과14-01~04를 실제 근거와 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "한 문장 정답과 실제 수행의 확인은 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-01",
   "title": "혼합 전후의 근거로 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 승인한 혼합 비교에서 달리한 조건·맞춘 조건과 같은 항목의 전후 기록을 남겨요. 관찰·해석을 구별해 성질 변화의 근거와 한계를 설명해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-02",
   "title": "공통 현상과 연소 조건 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "서로 다른 연료의 실제 시범 또는 조건을 밝힌 자료를 읽어요. 빛·열의 공통 근거와 연료·산소·온도의 역할을 연결하고 재지 않은 양을 구별해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-03",
   "title": "생성물을 확인하는 근거 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "교사의 시험지·석회수 시범 또는 제공 자료에서 초기 상태·대조·전후 변화를 비교해요. 관찰과 물·이산화 탄소에 관한 해석을 연결해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  },
  {
   "section": "단원 수행평가 · 6과14-04",
   "title": "사례를 조사하고 해결책 나누기",
   "blocks": [
    {
     "type": "text",
     "text": "출처·대상·시기가 있는 사례를 실제로 조사해요. 생태계 영향과 해결책의 역할·한계를 담은 자료를 만들어 설명하고 받은 질문으로 보완해요."
    },
    {
     "type": "field",
     "title": "실제 수행·자료·조건과 미확인 상태",
     "hint": "대체 자료·미실시·다시 확인할 내용을 사실대로 남겨요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "내 근거와 설명",
     "hint": "표·그림·짧은 문장에 근거의 연결과 한계를 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사가 실제 자료·시범 관찰·조사·설명 과정을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항 점수만으로 모든 수행을 확정하는 자동 학교 성적표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "layout": "combustion-workbook"
  },
  {
   "kind": "duplex-blank",
   "layout": "combustion-workbook"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w001",
      "c22-s62-u02-w002",
      "c22-s62-u02-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w004",
      "c22-s62-u02-w005",
      "c22-s62-u02-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w007",
      "c22-s62-u02-w008",
      "c22-s62-u02-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w010",
      "c22-s62-u02-w011",
      "c22-s62-u02-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w013",
      "c22-s62-u02-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w015",
      "c22-s62-u02-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w017",
      "c22-s62-u02-w018",
      "c22-s62-u02-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w020",
      "c22-s62-u02-w021",
      "c22-s62-u02-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w023",
      "c22-s62-u02-w024",
      "c22-s62-u02-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w026",
      "c22-s62-u02-w027",
      "c22-s62-u02-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w029",
      "c22-s62-u02-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w031",
      "c22-s62-u02-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w033",
      "c22-s62-u02-w034",
      "c22-s62-u02-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w036",
      "c22-s62-u02-w037",
      "c22-s62-u02-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w039",
      "c22-s62-u02-w040",
      "c22-s62-u02-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w042",
      "c22-s62-u02-w043",
      "c22-s62-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w045",
      "c22-s62-u02-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w047",
      "c22-s62-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w049",
      "c22-s62-u02-w050",
      "c22-s62-u02-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w052",
      "c22-s62-u02-w053",
      "c22-s62-u02-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w055",
      "c22-s62-u02-w056",
      "c22-s62-u02-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w058",
      "c22-s62-u02-w059",
      "c22-s62-u02-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w061",
      "c22-s62-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w063",
      "c22-s62-u02-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w065",
      "c22-s62-u02-w066",
      "c22-s62-u02-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w068",
      "c22-s62-u02-w069",
      "c22-s62-u02-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w071",
      "c22-s62-u02-w072",
      "c22-s62-u02-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w074",
      "c22-s62-u02-w075",
      "c22-s62-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w077",
      "c22-s62-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w079",
      "c22-s62-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w081",
      "c22-s62-u02-w082",
      "c22-s62-u02-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w084",
      "c22-s62-u02-w085",
      "c22-s62-u02-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w087",
      "c22-s62-u02-w088",
      "c22-s62-u02-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w090",
      "c22-s62-u02-w091",
      "c22-s62-u02-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w093",
      "c22-s62-u02-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 95~96",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w095",
      "c22-s62-u02-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 97~99",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w097",
      "c22-s62-u02-w098",
      "c22-s62-u02-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 100~102",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w100",
      "c22-s62-u02-w101",
      "c22-s62-u02-w102"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 103~105",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w103",
      "c22-s62-u02-w104",
      "c22-s62-u02-w105"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 106~108",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w106",
      "c22-s62-u02-w107",
      "c22-s62-u02-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 109~110",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w109",
      "c22-s62-u02-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 111~112",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w111",
      "c22-s62-u02-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 113~115",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w113",
      "c22-s62-u02-w114",
      "c22-s62-u02-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 116~118",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w116",
      "c22-s62-u02-w117",
      "c22-s62-u02-w118"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 119~121",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w119",
      "c22-s62-u02-w120",
      "c22-s62-u02-w121"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 122~124",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w122",
      "c22-s62-u02-w123",
      "c22-s62-u02-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 125~126",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w125",
      "c22-s62-u02-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "정답·해설 127~128",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s62-u02-w127",
      "c22-s62-u02-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부분별 대응·단위·해석의 범위를 확인해요."
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
   "section": "수행평가 지도 · 6과14-01",
   "title": "혼합 전후의 근거로 설명하기",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 승인한 혼합 비교에서 달리한 조건·맞춘 조건과 같은 항목의 전후 기록을 남겨요. 관찰·해석을 구별해 성질 변화의 근거와 한계를 설명해요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 승인된 준비·시범·시약 절차를 확인하고 학생의 임의 조작을 요구하지 않는다. 관찰하지 못한 상태를 변화 없음이나 오답으로 단정하지 않는다."
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
     "text": "계획·예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정하고 미확인을 보완해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과14-02",
   "title": "공통 현상과 연소 조건 설명하기",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "서로 다른 연료의 실제 시범 또는 조건을 밝힌 자료를 읽어요. 빛·열의 공통 근거와 연료·산소·온도의 역할을 연결하고 재지 않은 양을 구별해요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 승인된 준비·시범·시약 절차를 확인하고 학생의 임의 조작을 요구하지 않는다. 관찰하지 못한 상태를 변화 없음이나 오답으로 단정하지 않는다."
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
     "text": "계획·예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정하고 미확인을 보완해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과14-03",
   "title": "생성물을 확인하는 근거 설명하기",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "교사의 시험지·석회수 시범 또는 제공 자료에서 초기 상태·대조·전후 변화를 비교해요. 관찰과 물·이산화 탄소에 관한 해석을 연결해요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 승인된 준비·시범·시약 절차를 확인하고 학생의 임의 조작을 요구하지 않는다. 관찰하지 못한 상태를 변화 없음이나 오답으로 단정하지 않는다."
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
     "text": "계획·예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정하고 미확인을 보완해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 조건·관찰 사실과 해석을 나누어 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과14-04",
   "title": "사례를 조사하고 해결책 나누기",
   "kind": "answers",
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "출처·대상·시기가 있는 사례를 실제로 조사해요. 생태계 영향과 해결책의 역할·한계를 담은 자료를 만들어 설명하고 받은 질문으로 보완해요."
    },
    {
     "type": "text",
     "text": "실제로 한 일과 제공 자료로 읽은 내용을 구별한다. 승인된 준비·시범·시약 절차를 확인하고 학생의 임의 조작을 요구하지 않는다. 관찰하지 못한 상태를 변화 없음이나 오답으로 단정하지 않는다."
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
     "text": "계획·예상·예시 답과 실제 수행을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건·근거가 타당한 다른 설명도 인정하고 미확인을 보완해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-quick-0"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 번호와 응답 형식을 함께 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-quick-24"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 번호와 응답 형식을 함께 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-quick-48"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 번호와 응답 형식을 함께 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-quick-72"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 번호와 응답 형식을 함께 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-quick-96"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 번호와 응답 형식을 함께 확인해요."
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
   "layout": "combustion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "combustion-quick-120"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 번호와 응답 형식을 함께 확인해요."
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
  "book-preparation": "<div class=\"combustion-book-photo\"><img src=\"../assets/activities/c22-s51-u03/mixing-photo-v1.webp\" alt=\"투명한 용기 두 개와 흰 가루가 놓인 준비 배치\" loading=\"eager\"><p class=\"combustion-book-photo-caption\">준비 배치를 살펴봐요. 사진만으로 흰 가루·액체의 이름이나 양을 정하지 않아요. 실제 재료 표시는 교사가 확인해요.<small>모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요.</small></p></div>",
  "candle": "<div class=\"combustion-book-photo\"><img src=\"../assets/activities/c22-s62-u02/candle-reference.webp\" alt=\"넓은 도자기 받침에 놓인 흰 양초와 심지의 불꽃\" loading=\"eager\"><p class=\"combustion-book-photo-caption\">양초와 심지·불꽃의 보이는 모습을 살펴봐요. 사진은 온도·산소량이나 연소 전후 변화를 측정한 자료가 아니에요. 불꽃 관찰은 교사 시범으로 해요.<small>모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요.</small></p></div>",
  "shells": "<div class=\"combustion-book-photo\"><img src=\"../assets/activities/c22-s62-u02/shells-reference.webp\" alt=\"밝은 받침에 놓인 조개껍데기 세 개의 모양\" loading=\"eager\"><p class=\"combustion-book-photo-caption\">껍데기의 모양을 살펴보는 참고 사진이에요. 서로 다른 껍데기를 산성화 전후나 생장량 비교로 읽지 않아요. 변화의 근거는 조건을 밝힌 자료에서 찾아요.<small>모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요.</small></p></div>",
  "sources": "<div class=\"combustion-book-sources\"><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://www.acs.org/content/dam/acsorg/education/resources/k-8/science-activities/chemicalphysicalchange/chemicalreactions/a-gas-sudstation.pdf\">ACS · 혼합 전후 비교 ↗</a><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://oceanservice.noaa.gov/facts/acidification.html\">NOAA · 바다의 성질과 생물 ↗</a><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://www.fisheries.noaa.gov/insight/understanding-ocean-acidification\">NOAA Fisheries · 패류와 관측 대응 ↗</a><p>자료 내용 확인:2026-10-22. 기관·대상·시기를 함께 읽어요. NOAA 두 자료는 같은 기관 계열이며 서로 독립된 관측 두 건이 아니에요.</p></div>",
  "combustion-question-data-11": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">시점</th><th scope=\"col\">조각 수</th><th scope=\"col\">한 조각 길이</th></tr></thead><tbody><tr><th scope=\"row\">처음</th><td>1</td><td>12cm</td></tr><tr><th scope=\"row\">같은 크기 세 조각으로 나눈 뒤</th><td>3</td><td>4cm</td></tr></tbody></table>",
  "combustion-question-data-12": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">자료</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>같은 종이를 잘라 작은 조각으로 만듦</td></tr><tr><th scope=\"row\">ㄴ</th><td>정체 표시가 없는 흰 가루 사진</td></tr><tr><th scope=\"row\">ㄷ</th><td>교사가 시료 이름을 직접 확인한 표</td></tr></tbody></table>",
  "combustion-question-data-17": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">교사가 정한 조합</th><th scope=\"col\">같은 시간 동안 관찰한 모습</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물만</td><td>젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물+베이킹 소다</td><td>젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임</td></tr><tr><th scope=\"row\">ㄷ</th><td>식초+베이킹 소다</td><td>젓기가 멈춘 뒤에도 기포가 이어짐</td></tr></tbody></table>",
  "combustion-question-data-18": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">교사가 정한 조합</th><th scope=\"col\">같은 시간 동안 관찰한 모습</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물만</td><td>젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물+베이킹 소다</td><td>젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임</td></tr><tr><th scope=\"row\">ㄷ</th><td>식초+베이킹 소다</td><td>젓기가 멈춘 뒤에도 기포가 이어짐</td></tr></tbody></table>",
  "combustion-question-data-19": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">교사가 정한 조합</th><th scope=\"col\">같은 시간 동안 관찰한 모습</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물만</td><td>젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물+베이킹 소다</td><td>젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임</td></tr><tr><th scope=\"row\">ㄷ</th><td>식초+베이킹 소다</td><td>젓기가 멈춘 뒤에도 기포가 이어짐</td></tr></tbody></table>",
  "combustion-question-data-20": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">교사가 정한 조합</th><th scope=\"col\">같은 시간 동안 관찰한 모습</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물만</td><td>젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물+베이킹 소다</td><td>젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임</td></tr><tr><th scope=\"row\">ㄷ</th><td>식초+베이킹 소다</td><td>젓기가 멈춘 뒤에도 기포가 이어짐</td></tr></tbody></table>",
  "combustion-question-data-21": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">교사가 정한 조합</th><th scope=\"col\">같은 시간 동안 관찰한 모습</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물만</td><td>젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물+베이킹 소다</td><td>젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임</td></tr><tr><th scope=\"row\">ㄷ</th><td>식초+베이킹 소다</td><td>젓기가 멈춘 뒤에도 기포가 이어짐</td></tr></tbody></table>",
  "combustion-question-data-25": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">교사가 정한 조합</th><th scope=\"col\">같은 시간 동안 관찰한 모습</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물만</td><td>젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물+베이킹 소다</td><td>젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임</td></tr><tr><th scope=\"row\">ㄷ</th><td>식초+베이킹 소다</td><td>젓기가 멈춘 뒤에도 기포가 이어짐</td></tr></tbody></table>",
  "combustion-question-data-27": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">기포가 보인 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>0</td></tr><tr><th scope=\"row\">ㄴ</th><td>4</td></tr><tr><th scope=\"row\">ㄷ</th><td>38</td></tr></tbody></table>",
  "combustion-question-data-28": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">계획</th><th scope=\"col\">액체</th><th scope=\"col\">가루 양</th><th scope=\"col\">관찰 시점</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물 / 식초</td><td>같음</td><td>같음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물 / 식초</td><td>다름</td><td>같음</td></tr><tr><th scope=\"row\">ㄷ</th><td>물 / 물</td><td>같음</td><td>같음</td></tr></tbody></table>",
  "combustion-question-data-29": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">컵</th><th scope=\"col\">교사가 정한 조합</th><th scope=\"col\">같은 시간 동안 관찰한 모습</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>물만</td><td>젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음</td></tr><tr><th scope=\"row\">ㄴ</th><td>물+베이킹 소다</td><td>젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임</td></tr><tr><th scope=\"row\">ㄷ</th><td>식초+베이킹 소다</td><td>젓기가 멈춘 뒤에도 기포가 이어짐</td></tr></tbody></table>",
  "combustion-question-data-33": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-34": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-35": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-38": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-40": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-41": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-43": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-44": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">카드</th><th scope=\"col\">설명</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>둘 다 빛과 열을 낸다.</td></tr><tr><th scope=\"row\">ㄴ</th><td>둘 다 같은 시간에 같은 양만큼 줄어든다.</td></tr><tr><th scope=\"row\">ㄷ</th><td>연료의 남은 모습을 따로 기록한다.</td></tr></tbody></table>",
  "combustion-question-data-46": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">연료</th><th scope=\"col\">빛 발생</th><th scope=\"col\">바깥 온도계 처음/40초 뒤</th></tr></thead><tbody><tr><th scope=\"row\">양초</th><td>확인</td><td>23℃ / 32℃</td></tr><tr><th scope=\"row\">알코올</th><td>확인</td><td>23℃ / 29℃</td></tr></tbody></table>",
  "combustion-question-data-49": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">덮개</th><th scope=\"col\">처음 공기 부피(mL)</th><th scope=\"col\">불꽃이 이어진 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>300</td><td>28</td></tr><tr><th scope=\"row\">B</th><td>600</td><td>47</td></tr></tbody></table>",
  "combustion-question-data-52": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">덮개</th><th scope=\"col\">처음 공기 부피(mL)</th><th scope=\"col\">불꽃이 이어진 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>300</td><td>28</td></tr><tr><th scope=\"row\">B</th><td>600</td><td>47</td></tr></tbody></table>",
  "combustion-question-data-54": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">덮개</th><th scope=\"col\">처음 공기 부피(mL)</th><th scope=\"col\">불꽃이 이어진 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>300</td><td>28</td></tr><tr><th scope=\"row\">B</th><td>600</td><td>47</td></tr></tbody></table>",
  "combustion-question-data-56": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">덮개</th><th scope=\"col\">처음 공기 부피(mL)</th><th scope=\"col\">불꽃이 이어진 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>300</td><td>28</td></tr><tr><th scope=\"row\">B</th><td>600</td><td>47</td></tr></tbody></table>",
  "combustion-question-data-57": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">덮개</th><th scope=\"col\">처음 공기 부피(mL)</th><th scope=\"col\">불꽃이 이어진 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>300</td><td>28</td></tr><tr><th scope=\"row\">B</th><td>600</td><td>47</td></tr></tbody></table>",
  "combustion-question-data-59": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">덮개</th><th scope=\"col\">처음 공기 부피(mL)</th><th scope=\"col\">불꽃이 이어진 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>300</td><td>28</td></tr><tr><th scope=\"row\">B</th><td>600</td><td>47</td></tr></tbody></table>",
  "combustion-question-data-60": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">시점</th><th scope=\"col\">산소 비율</th><th scope=\"col\">불꽃</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>20.9%</td><td>켜짐</td></tr><tr><th scope=\"row\">ㄴ</th><td>17.4%</td><td>꺼짐</td></tr></tbody></table>",
  "combustion-question-data-61": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">덮개</th><th scope=\"col\">처음 공기 부피(mL)</th><th scope=\"col\">불꽃이 이어진 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>300</td><td>28</td></tr><tr><th scope=\"row\">B</th><td>600</td><td>47</td></tr></tbody></table>",
  "combustion-question-data-68": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교</th><th scope=\"col\">초 연소 뒤</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">2</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">3</th><td>푸른색</td><td>붉은색</td></tr></tbody></table>",
  "combustion-question-data-69": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교</th><th scope=\"col\">초 연소 뒤</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">2</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">3</th><td>푸른색</td><td>붉은색</td></tr></tbody></table>",
  "combustion-question-data-72": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교</th><th scope=\"col\">초 연소 뒤</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">2</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">3</th><td>푸른색</td><td>붉은색</td></tr></tbody></table>",
  "combustion-question-data-73": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교</th><th scope=\"col\">초 연소 뒤</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">2</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">3</th><td>푸른색</td><td>붉은색</td></tr></tbody></table>",
  "combustion-question-data-75": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교</th><th scope=\"col\">초 연소 뒤</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">2</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">3</th><td>푸른색</td><td>붉은색</td></tr></tbody></table>",
  "combustion-question-data-76": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">대조/연소 뒤 결과</th><th scope=\"col\">조건</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>푸름/붉음</td><td>처음·시간 맞춤</td></tr><tr><th scope=\"row\">ㄴ</th><td>붉음/붉음</td><td>배경 영향 미확인</td></tr><tr><th scope=\"row\">ㄷ</th><td>미관찰/붉음</td><td>대조 기록 없음</td></tr></tbody></table>",
  "combustion-question-data-78": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교</th><th scope=\"col\">초 연소 뒤</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">2</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">3</th><td>푸른색</td><td>붉은색</td></tr></tbody></table>",
  "combustion-question-data-80": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교</th><th scope=\"col\">초 연소 뒤</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">2</th><td>푸른색</td><td>붉은색</td></tr><tr><th scope=\"row\">3</th><td>푸른색</td><td>붉은색</td></tr></tbody></table>",
  "combustion-question-data-81": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교 기체</th><th scope=\"col\">초 연소 뒤 기체</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">2</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">3</th><td>맑음</td><td>뿌옇게 변함</td></tr></tbody></table>",
  "combustion-question-data-87": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교 기체</th><th scope=\"col\">초 연소 뒤 기체</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">2</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">3</th><td>맑음</td><td>뿌옇게 변함</td></tr></tbody></table>",
  "combustion-question-data-89": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교 기체</th><th scope=\"col\">초 연소 뒤 기체</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">2</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">3</th><td>맑음</td><td>뿌옇게 변함</td></tr></tbody></table>",
  "combustion-question-data-90": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교 기체</th><th scope=\"col\">초 연소 뒤 기체</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">2</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">3</th><td>맑음</td><td>뿌옇게 변함</td></tr></tbody></table>",
  "combustion-question-data-91": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">반복</th><th scope=\"col\">불을 켜지 않은 비교 기체</th><th scope=\"col\">초 연소 뒤 기체</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">2</th><td>맑음</td><td>뿌옇게 변함</td></tr><tr><th scope=\"row\">3</th><td>맑음</td><td>뿌옇게 변함</td></tr></tbody></table>",
  "combustion-question-data-92": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">초 연소 뒤의 확인 시험</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>같은 조건의 대조와 달리 푸른 시험지가 붉게 변함</td></tr><tr><th scope=\"row\">ㄴ</th><td>같은 조건의 대조와 달리 새 석회수가 흐려짐</td></tr><tr><th scope=\"row\">ㄷ</th><td>초의 일부가 녹아 액체로 보임</td></tr></tbody></table>",
  "combustion-question-data-98": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">14일 동안 새로 자란 껍데기 길이(mm)</th></tr></thead><tbody><tr><th scope=\"row\">A: 처음 비교 조건</th><td>2.1</td></tr><tr><th scope=\"row\">B: 이산화 탄소가 더 많은 바닷물 조건</th><td>1.2</td></tr></tbody></table>",
  "combustion-question-data-107": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">14일 동안 새로 자란 껍데기 길이(mm)</th></tr></thead><tbody><tr><th scope=\"row\">A: 처음 비교 조건</th><td>2.1</td></tr><tr><th scope=\"row\">B: 이산화 탄소가 더 많은 바닷물 조건</th><td>1.2</td></tr></tbody></table>",
  "combustion-question-data-108": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">자료의 성격</th></tr></thead><tbody><tr><th scope=\"row\">ㄱ</th><td>기관이 특정 연안·날짜·측정 방법과 값을 공개</td></tr><tr><th scope=\"row\">ㄴ</th><td>관계 읽기를 위해 만든 가상 생장표</td></tr><tr><th scope=\"row\">ㄷ</th><td>출처와 날짜가 없는 사진 한 장</td></tr></tbody></table>",
  "combustion-question-data-109": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">14일 동안 새로 자란 껍데기 길이(mm)</th></tr></thead><tbody><tr><th scope=\"row\">A: 처음 비교 조건</th><td>2.1</td></tr><tr><th scope=\"row\">B: 이산화 탄소가 더 많은 바닷물 조건</th><td>1.2</td></tr></tbody></table>",
  "combustion-question-data-123": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">계획</th><th scope=\"col\">배출 지표(연습 단위)</th></tr></thead><tbody><tr><th scope=\"row\">A: 처음 사용</th><td>120</td></tr><tr><th scope=\"row\">B: 불필요한 사용을 줄인 뒤</th><td>90</td></tr></tbody></table>",
  "combustion-question-data-124": "<table class=\"ed-table combustion-book-table\"><caption>제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요.</caption><thead><tr><th scope=\"col\">카드</th><th scope=\"col\">상태</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>원문 본문 확인</td></tr><tr><th scope=\"row\">나</th><td>제목만 확인</td></tr><tr><th scope=\"row\">다</th><td>원문 본문 확인</td></tr><tr><th scope=\"row\">라</th><td>링크 접속 못 함</td></tr></tbody></table>",
  "combustion-quick-0": "<div class=\"combustion-quick-grid\"><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">2</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">3</th><td>빈칸 넣기</td><td>전 / 후</td></tr><tr><th scope=\"row\">4</th><td>빈칸 넣기</td><td>관찰 / 해석</td></tr><tr><th scope=\"row\">5</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">6</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">7</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">8</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">9</th><td>복수 선택</td><td>①, ②, ③</td></tr><tr><th scope=\"row\">10</th><td>복수 선택</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">11</th><td>자료 해석</td><td>1개 / 4cm</td></tr><tr><th scope=\"row\">12</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr></tbody></table><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">13</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">14</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">15</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">16</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">18</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">19</th><td>빈칸 넣기</td><td>액체 / 베이킹 소다</td></tr><tr><th scope=\"row\">20</th><td>빈칸 넣기</td><td>관찰 / 해석</td></tr><tr><th scope=\"row\">21</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">22</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">23</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">24</th><td>순서 배열</td><td>ㄱ → ㄴ → ㄷ</td></tr></tbody></table></div>",
  "combustion-quick-24": "<div class=\"combustion-quick-grid\"><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">25</th><td>복수 선택</td><td>①, ②, ⑤</td></tr><tr><th scope=\"row\">26</th><td>복수 선택</td><td>③, ④, ⑤</td></tr><tr><th scope=\"row\">27</th><td>자료 해석</td><td>34초 / ㄷ</td></tr><tr><th scope=\"row\">28</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr><tr><th scope=\"row\">29</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">30</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">31</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">32</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">33</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">34</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">35</th><td>빈칸 넣기</td><td>빛 / 열</td></tr><tr><th scope=\"row\">36</th><td>빈칸 넣기</td><td>연소 / 소멸</td></tr></tbody></table><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">37</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">38</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">39</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">40</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">41</th><td>복수 선택</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">42</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">43</th><td>자료 해석</td><td>9℃ / 6℃</td></tr><tr><th scope=\"row\">44</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr><tr><th scope=\"row\">45</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">46</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">47</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">48</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "combustion-quick-48": "<div class=\"combustion-quick-grid\"><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">49</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">50</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">51</th><td>빈칸 넣기</td><td>산소 / 이상</td></tr><tr><th scope=\"row\">52</th><td>빈칸 넣기</td><td>많다 / 같다</td></tr><tr><th scope=\"row\">53</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">54</th><td>연결하기</td><td>ㄷ / ㄴ / ㄱ</td></tr><tr><th scope=\"row\">55</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">56</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">57</th><td>복수 선택</td><td>①, ③, ⑤</td></tr><tr><th scope=\"row\">58</th><td>복수 선택</td><td>②, ③, ④</td></tr><tr><th scope=\"row\">59</th><td>자료 해석</td><td>300mL / 19초</td></tr><tr><th scope=\"row\">60</th><td>자료 해석</td><td>ㄴ / 산소</td></tr></tbody></table><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">61</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">62</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">63</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">66</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">67</th><td>빈칸 넣기</td><td>푸른 / 붉은</td></tr><tr><th scope=\"row\">68</th><td>빈칸 넣기</td><td>관찰 / 해석</td></tr><tr><th scope=\"row\">69</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">70</th><td>연결하기</td><td>ㄴ / ㄱ / ㄷ</td></tr><tr><th scope=\"row\">71</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">72</th><td>순서 배열</td><td>ㄱ → ㄴ → ㄷ</td></tr></tbody></table></div>",
  "combustion-quick-72": "<div class=\"combustion-quick-grid\"><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">73</th><td>복수 선택</td><td>①, ③, ⑤</td></tr><tr><th scope=\"row\">74</th><td>복수 선택</td><td>①, ③, ⑤</td></tr><tr><th scope=\"row\">75</th><td>자료 해석</td><td>3회 / 0회</td></tr><tr><th scope=\"row\">76</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr><tr><th scope=\"row\">77</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">78</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">79</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">82</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">83</th><td>빈칸 넣기</td><td>석회수 / 뿌옇</td></tr><tr><th scope=\"row\">84</th><td>빈칸 넣기</td><td>상태 / 성질</td></tr></tbody></table><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">86</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">87</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">88</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">89</th><td>복수 선택</td><td>①, ②, ③</td></tr><tr><th scope=\"row\">90</th><td>복수 선택</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">91</th><td>자료 해석</td><td>3회 / 0회</td></tr><tr><th scope=\"row\">92</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr><tr><th scope=\"row\">93</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">94</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">95</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "combustion-quick-96": "<div class=\"combustion-quick-grid\"><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">97</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">98</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">99</th><td>빈칸 넣기</td><td>이산화 탄소 / 설명</td></tr><tr><th scope=\"row\">100</th><td>빈칸 넣기</td><td>기관 / 시기</td></tr><tr><th scope=\"row\">101</th><td>연결하기</td><td>ㄷ / ㄴ / ㄱ</td></tr><tr><th scope=\"row\">102</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">103</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">104</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">105</th><td>복수 선택</td><td>②, ③, ④</td></tr><tr><th scope=\"row\">106</th><td>복수 선택</td><td>①, ④, ⑤</td></tr><tr><th scope=\"row\">107</th><td>자료 해석</td><td>0.9mm / B</td></tr><tr><th scope=\"row\">108</th><td>자료 해석</td><td>ㄱ / ㄴ</td></tr></tbody></table><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">109</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">110</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">111</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">112</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">113</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">114</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">115</th><td>빈칸 넣기</td><td>근거 / 한계</td></tr><tr><th scope=\"row\">116</th><td>빈칸 넣기</td><td>미공유 / 질문</td></tr><tr><th scope=\"row\">117</th><td>연결하기</td><td>ㄷ / ㄱ / ㄴ</td></tr><tr><th scope=\"row\">118</th><td>연결하기</td><td>ㄴ / ㄷ / ㄱ</td></tr><tr><th scope=\"row\">119</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">120</th><td>순서 배열</td><td>ㄴ → ㄱ → ㄷ</td></tr></tbody></table></div>",
  "combustion-quick-120": "<div class=\"combustion-quick-grid\"><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">121</th><td>복수 선택</td><td>①, ③, ⑤</td></tr><tr><th scope=\"row\">122</th><td>복수 선택</td><td>②, ④, ⑤</td></tr><tr><th scope=\"row\">123</th><td>자료 해석</td><td>30단위 / B</td></tr><tr><th scope=\"row\">124</th><td>자료 해석</td><td>2개 / 2개</td></tr></tbody></table><table class=\"ed-table combustion-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">125</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">126</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">127</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">128</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>"
 },
 "figureModels": {
  "book-preparation": {
   "kind": "photo",
   "src": "../assets/activities/c22-s51-u03/mixing-photo-v1.webp",
   "alt": "투명한 용기 두 개와 흰 가루가 놓인 준비 배치",
   "caption": "준비 배치를 살펴봐요. 사진만으로 흰 가루·액체의 이름이나 양을 정하지 않아요. 실제 재료 표시는 교사가 확인해요.",
   "credit": "모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요."
  },
  "candle": {
   "kind": "photo",
   "src": "../assets/activities/c22-s62-u02/candle-reference.webp",
   "alt": "넓은 도자기 받침에 놓인 흰 양초와 심지의 불꽃",
   "caption": "양초와 심지·불꽃의 보이는 모습을 살펴봐요. 사진은 온도·산소량이나 연소 전후 변화를 측정한 자료가 아니에요. 불꽃 관찰은 교사 시범으로 해요.",
   "credit": "모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요."
  },
  "shells": {
   "kind": "photo",
   "src": "../assets/activities/c22-s62-u02/shells-reference.webp",
   "alt": "밝은 받침에 놓인 조개껍데기 세 개의 모양",
   "caption": "껍데기의 모양을 살펴보는 참고 사진이에요. 서로 다른 껍데기를 산성화 전후나 생장량 비교로 읽지 않아요. 변화의 근거는 조건을 밝힌 자료에서 찾아요.",
   "credit": "모습을 살펴보는 참고 사진 · 실제 우리 반의 관찰·측정 결과는 따로 남겨요."
  },
  "sources": {
   "kind": "source-links",
   "links": [
    {
     "label": "ACS · 혼합 전후 비교",
     "url": "https://www.acs.org/content/dam/acsorg/education/resources/k-8/science-activities/chemicalphysicalchange/chemicalreactions/a-gas-sudstation.pdf"
    },
    {
     "label": "NOAA · 바다의 성질과 생물",
     "url": "https://oceanservice.noaa.gov/facts/acidification.html"
    },
    {
     "label": "NOAA Fisheries · 패류와 관측 대응",
     "url": "https://www.fisheries.noaa.gov/insight/understanding-ocean-acidification"
    }
   ],
   "caption": "자료 내용 확인:2026-10-22. 기관·대상·시기를 함께 읽어요. NOAA 두 자료는 같은 기관 계열이며 서로 독립된 관측 두 건이 아니에요."
  },
  "combustion-question-data-11": {
   "kind": "table",
   "heads": [
    "시점",
    "조각 수",
    "한 조각 길이"
   ],
   "rows": [
    [
     "처음",
     1,
     "12cm"
    ],
    [
     "같은 크기 세 조각으로 나눈 뒤",
     3,
     "4cm"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-12": {
   "kind": "table",
   "heads": [
    "기호",
    "자료"
   ],
   "rows": [
    [
     "ㄱ",
     "같은 종이를 잘라 작은 조각으로 만듦"
    ],
    [
     "ㄴ",
     "정체 표시가 없는 흰 가루 사진"
    ],
    [
     "ㄷ",
     "교사가 시료 이름을 직접 확인한 표"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-17": {
   "kind": "table",
   "heads": [
    "컵",
    "교사가 정한 조합",
    "같은 시간 동안 관찰한 모습"
   ],
   "rows": [
    [
     "ㄱ",
     "물만",
     "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
    ],
    [
     "ㄴ",
     "물+베이킹 소다",
     "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
    ],
    [
     "ㄷ",
     "식초+베이킹 소다",
     "젓기가 멈춘 뒤에도 기포가 이어짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-18": {
   "kind": "table",
   "heads": [
    "컵",
    "교사가 정한 조합",
    "같은 시간 동안 관찰한 모습"
   ],
   "rows": [
    [
     "ㄱ",
     "물만",
     "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
    ],
    [
     "ㄴ",
     "물+베이킹 소다",
     "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
    ],
    [
     "ㄷ",
     "식초+베이킹 소다",
     "젓기가 멈춘 뒤에도 기포가 이어짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-19": {
   "kind": "table",
   "heads": [
    "컵",
    "교사가 정한 조합",
    "같은 시간 동안 관찰한 모습"
   ],
   "rows": [
    [
     "ㄱ",
     "물만",
     "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
    ],
    [
     "ㄴ",
     "물+베이킹 소다",
     "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
    ],
    [
     "ㄷ",
     "식초+베이킹 소다",
     "젓기가 멈춘 뒤에도 기포가 이어짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-20": {
   "kind": "table",
   "heads": [
    "컵",
    "교사가 정한 조합",
    "같은 시간 동안 관찰한 모습"
   ],
   "rows": [
    [
     "ㄱ",
     "물만",
     "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
    ],
    [
     "ㄴ",
     "물+베이킹 소다",
     "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
    ],
    [
     "ㄷ",
     "식초+베이킹 소다",
     "젓기가 멈춘 뒤에도 기포가 이어짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-21": {
   "kind": "table",
   "heads": [
    "컵",
    "교사가 정한 조합",
    "같은 시간 동안 관찰한 모습"
   ],
   "rows": [
    [
     "ㄱ",
     "물만",
     "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
    ],
    [
     "ㄴ",
     "물+베이킹 소다",
     "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
    ],
    [
     "ㄷ",
     "식초+베이킹 소다",
     "젓기가 멈춘 뒤에도 기포가 이어짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-25": {
   "kind": "table",
   "heads": [
    "컵",
    "교사가 정한 조합",
    "같은 시간 동안 관찰한 모습"
   ],
   "rows": [
    [
     "ㄱ",
     "물만",
     "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
    ],
    [
     "ㄴ",
     "물+베이킹 소다",
     "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
    ],
    [
     "ㄷ",
     "식초+베이킹 소다",
     "젓기가 멈춘 뒤에도 기포가 이어짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-27": {
   "kind": "table",
   "heads": [
    "컵",
    "기포가 보인 시간(초)"
   ],
   "rows": [
    [
     "ㄱ",
     0
    ],
    [
     "ㄴ",
     4
    ],
    [
     "ㄷ",
     38
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-28": {
   "kind": "table",
   "heads": [
    "계획",
    "액체",
    "가루 양",
    "관찰 시점"
   ],
   "rows": [
    [
     "ㄱ",
     "물 / 식초",
     "같음",
     "같음"
    ],
    [
     "ㄴ",
     "물 / 식초",
     "다름",
     "같음"
    ],
    [
     "ㄷ",
     "물 / 물",
     "같음",
     "같음"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-29": {
   "kind": "table",
   "heads": [
    "컵",
    "교사가 정한 조합",
    "같은 시간 동안 관찰한 모습"
   ],
   "rows": [
    [
     "ㄱ",
     "물만",
     "젓는 동안과 멈춘 뒤 모두 기포가 보이지 않음"
    ],
    [
     "ㄴ",
     "물+베이킹 소다",
     "젓는 동안 잠깐 기포가 보이고 멈춘 뒤에는 안 보임"
    ],
    [
     "ㄷ",
     "식초+베이킹 소다",
     "젓기가 멈춘 뒤에도 기포가 이어짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-33": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-34": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-35": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-38": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-40": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-41": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-43": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-44": {
   "kind": "table",
   "heads": [
    "카드",
    "설명"
   ],
   "rows": [
    [
     "ㄱ",
     "둘 다 빛과 열을 낸다."
    ],
    [
     "ㄴ",
     "둘 다 같은 시간에 같은 양만큼 줄어든다."
    ],
    [
     "ㄷ",
     "연료의 남은 모습을 따로 기록한다."
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-46": {
   "kind": "table",
   "heads": [
    "연료",
    "빛 발생",
    "바깥 온도계 처음/40초 뒤"
   ],
   "rows": [
    [
     "양초",
     "확인",
     "23℃ / 32℃"
    ],
    [
     "알코올",
     "확인",
     "23℃ / 29℃"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-49": {
   "kind": "table",
   "heads": [
    "덮개",
    "처음 공기 부피(mL)",
    "불꽃이 이어진 시간(초)"
   ],
   "rows": [
    [
     "A",
     300,
     28
    ],
    [
     "B",
     600,
     47
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-52": {
   "kind": "table",
   "heads": [
    "덮개",
    "처음 공기 부피(mL)",
    "불꽃이 이어진 시간(초)"
   ],
   "rows": [
    [
     "A",
     300,
     28
    ],
    [
     "B",
     600,
     47
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-54": {
   "kind": "table",
   "heads": [
    "덮개",
    "처음 공기 부피(mL)",
    "불꽃이 이어진 시간(초)"
   ],
   "rows": [
    [
     "A",
     300,
     28
    ],
    [
     "B",
     600,
     47
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-56": {
   "kind": "table",
   "heads": [
    "덮개",
    "처음 공기 부피(mL)",
    "불꽃이 이어진 시간(초)"
   ],
   "rows": [
    [
     "A",
     300,
     28
    ],
    [
     "B",
     600,
     47
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-57": {
   "kind": "table",
   "heads": [
    "덮개",
    "처음 공기 부피(mL)",
    "불꽃이 이어진 시간(초)"
   ],
   "rows": [
    [
     "A",
     300,
     28
    ],
    [
     "B",
     600,
     47
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-59": {
   "kind": "table",
   "heads": [
    "덮개",
    "처음 공기 부피(mL)",
    "불꽃이 이어진 시간(초)"
   ],
   "rows": [
    [
     "A",
     300,
     28
    ],
    [
     "B",
     600,
     47
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-60": {
   "kind": "table",
   "heads": [
    "시점",
    "산소 비율",
    "불꽃"
   ],
   "rows": [
    [
     "ㄱ",
     "20.9%",
     "켜짐"
    ],
    [
     "ㄴ",
     "17.4%",
     "꺼짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-61": {
   "kind": "table",
   "heads": [
    "덮개",
    "처음 공기 부피(mL)",
    "불꽃이 이어진 시간(초)"
   ],
   "rows": [
    [
     "A",
     300,
     28
    ],
    [
     "B",
     600,
     47
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-68": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교",
    "초 연소 뒤"
   ],
   "rows": [
    [
     "1",
     "푸른색",
     "붉은색"
    ],
    [
     "2",
     "푸른색",
     "붉은색"
    ],
    [
     "3",
     "푸른색",
     "붉은색"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-69": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교",
    "초 연소 뒤"
   ],
   "rows": [
    [
     "1",
     "푸른색",
     "붉은색"
    ],
    [
     "2",
     "푸른색",
     "붉은색"
    ],
    [
     "3",
     "푸른색",
     "붉은색"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-72": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교",
    "초 연소 뒤"
   ],
   "rows": [
    [
     "1",
     "푸른색",
     "붉은색"
    ],
    [
     "2",
     "푸른색",
     "붉은색"
    ],
    [
     "3",
     "푸른색",
     "붉은색"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-73": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교",
    "초 연소 뒤"
   ],
   "rows": [
    [
     "1",
     "푸른색",
     "붉은색"
    ],
    [
     "2",
     "푸른색",
     "붉은색"
    ],
    [
     "3",
     "푸른색",
     "붉은색"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-75": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교",
    "초 연소 뒤"
   ],
   "rows": [
    [
     "1",
     "푸른색",
     "붉은색"
    ],
    [
     "2",
     "푸른색",
     "붉은색"
    ],
    [
     "3",
     "푸른색",
     "붉은색"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-76": {
   "kind": "table",
   "heads": [
    "기호",
    "대조/연소 뒤 결과",
    "조건"
   ],
   "rows": [
    [
     "ㄱ",
     "푸름/붉음",
     "처음·시간 맞춤"
    ],
    [
     "ㄴ",
     "붉음/붉음",
     "배경 영향 미확인"
    ],
    [
     "ㄷ",
     "미관찰/붉음",
     "대조 기록 없음"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-78": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교",
    "초 연소 뒤"
   ],
   "rows": [
    [
     "1",
     "푸른색",
     "붉은색"
    ],
    [
     "2",
     "푸른색",
     "붉은색"
    ],
    [
     "3",
     "푸른색",
     "붉은색"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-80": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교",
    "초 연소 뒤"
   ],
   "rows": [
    [
     "1",
     "푸른색",
     "붉은색"
    ],
    [
     "2",
     "푸른색",
     "붉은색"
    ],
    [
     "3",
     "푸른색",
     "붉은색"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-81": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교 기체",
    "초 연소 뒤 기체"
   ],
   "rows": [
    [
     "1",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "2",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "3",
     "맑음",
     "뿌옇게 변함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-87": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교 기체",
    "초 연소 뒤 기체"
   ],
   "rows": [
    [
     "1",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "2",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "3",
     "맑음",
     "뿌옇게 변함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-89": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교 기체",
    "초 연소 뒤 기체"
   ],
   "rows": [
    [
     "1",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "2",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "3",
     "맑음",
     "뿌옇게 변함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-90": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교 기체",
    "초 연소 뒤 기체"
   ],
   "rows": [
    [
     "1",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "2",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "3",
     "맑음",
     "뿌옇게 변함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-91": {
   "kind": "table",
   "heads": [
    "반복",
    "불을 켜지 않은 비교 기체",
    "초 연소 뒤 기체"
   ],
   "rows": [
    [
     "1",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "2",
     "맑음",
     "뿌옇게 변함"
    ],
    [
     "3",
     "맑음",
     "뿌옇게 변함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-92": {
   "kind": "table",
   "heads": [
    "기호",
    "초 연소 뒤의 확인 시험"
   ],
   "rows": [
    [
     "ㄱ",
     "같은 조건의 대조와 달리 푸른 시험지가 붉게 변함"
    ],
    [
     "ㄴ",
     "같은 조건의 대조와 달리 새 석회수가 흐려짐"
    ],
    [
     "ㄷ",
     "초의 일부가 녹아 액체로 보임"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-98": {
   "kind": "table",
   "heads": [
    "조건",
    "14일 동안 새로 자란 껍데기 길이(mm)"
   ],
   "rows": [
    [
     "A: 처음 비교 조건",
     2.1
    ],
    [
     "B: 이산화 탄소가 더 많은 바닷물 조건",
     1.2
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-107": {
   "kind": "table",
   "heads": [
    "조건",
    "14일 동안 새로 자란 껍데기 길이(mm)"
   ],
   "rows": [
    [
     "A: 처음 비교 조건",
     2.1
    ],
    [
     "B: 이산화 탄소가 더 많은 바닷물 조건",
     1.2
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-108": {
   "kind": "table",
   "heads": [
    "기호",
    "자료의 성격"
   ],
   "rows": [
    [
     "ㄱ",
     "기관이 특정 연안·날짜·측정 방법과 값을 공개"
    ],
    [
     "ㄴ",
     "관계 읽기를 위해 만든 가상 생장표"
    ],
    [
     "ㄷ",
     "출처와 날짜가 없는 사진 한 장"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-109": {
   "kind": "table",
   "heads": [
    "조건",
    "14일 동안 새로 자란 껍데기 길이(mm)"
   ],
   "rows": [
    [
     "A: 처음 비교 조건",
     2.1
    ],
    [
     "B: 이산화 탄소가 더 많은 바닷물 조건",
     1.2
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-123": {
   "kind": "table",
   "heads": [
    "계획",
    "배출 지표(연습 단위)"
   ],
   "rows": [
    [
     "A: 처음 사용",
     120
    ],
    [
     "B: 불필요한 사용을 줄인 뒤",
     90
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-question-data-124": {
   "kind": "table",
   "heads": [
    "카드",
    "상태"
   ],
   "rows": [
    [
     "가",
     "원문 본문 확인"
    ],
    [
     "나",
     "제목만 확인"
    ],
    [
     "다",
     "원문 본문 확인"
    ],
    [
     "라",
     "링크 접속 못 함"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 실험이나 오늘 바다의 실측값이 아니에요."
  },
  "combustion-quick-0": {
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
      "전 / 후"
     ],
     [
      4,
      "빈칸 넣기",
      "관찰 / 해석"
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
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      9,
      "복수 선택",
      "①, ②, ③"
     ],
     [
      10,
      "복수 선택",
      "①, ②, ④"
     ],
     [
      11,
      "자료 해석",
      "1개 / 4cm"
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
      "액체 / 베이킹 소다"
     ],
     [
      20,
      "빈칸 넣기",
      "관찰 / 해석"
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
      "ㄱ → ㄴ → ㄷ"
     ]
    ]
   ]
  },
  "combustion-quick-24": {
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
      "③, ④, ⑤"
     ],
     [
      27,
      "자료 해석",
      "34초 / ㄷ"
     ],
     [
      28,
      "자료 해석",
      "ㄱ / ㄴ"
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
      "빛 / 열"
     ],
     [
      36,
      "빈칸 넣기",
      "연소 / 소멸"
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
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      40,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      41,
      "복수 선택",
      "①, ②, ④"
     ],
     [
      42,
      "복수 선택",
      "②, ③, ⑤"
     ],
     [
      43,
      "자료 해석",
      "9℃ / 6℃"
     ],
     [
      44,
      "자료 해석",
      "ㄱ / ㄴ"
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
  "combustion-quick-48": {
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
      "산소 / 이상"
     ],
     [
      52,
      "빈칸 넣기",
      "많다 / 같다"
     ],
     [
      53,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      54,
      "연결하기",
      "ㄷ / ㄴ / ㄱ"
     ],
     [
      55,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      56,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      57,
      "복수 선택",
      "①, ③, ⑤"
     ],
     [
      58,
      "복수 선택",
      "②, ③, ④"
     ],
     [
      59,
      "자료 해석",
      "300mL / 19초"
     ],
     [
      60,
      "자료 해석",
      "ㄴ / 산소"
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
      "푸른 / 붉은"
     ],
     [
      68,
      "빈칸 넣기",
      "관찰 / 해석"
     ],
     [
      69,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      70,
      "연결하기",
      "ㄴ / ㄱ / ㄷ"
     ],
     [
      71,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      72,
      "순서 배열",
      "ㄱ → ㄴ → ㄷ"
     ]
    ]
   ]
  },
  "combustion-quick-72": {
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
      "①, ③, ⑤"
     ],
     [
      74,
      "복수 선택",
      "①, ③, ⑤"
     ],
     [
      75,
      "자료 해석",
      "3회 / 0회"
     ],
     [
      76,
      "자료 해석",
      "ㄱ / ㄴ"
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
      "석회수 / 뿌옇"
     ],
     [
      84,
      "빈칸 넣기",
      "상태 / 성질"
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
      "ㄴ → ㄱ → ㄷ"
     ],
     [
      88,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      89,
      "복수 선택",
      "①, ②, ③"
     ],
     [
      90,
      "복수 선택",
      "②, ③, ⑤"
     ],
     [
      91,
      "자료 해석",
      "3회 / 0회"
     ],
     [
      92,
      "자료 해석",
      "ㄱ / ㄴ"
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
  "combustion-quick-96": {
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
      "이산화 탄소 / 설명"
     ],
     [
      100,
      "빈칸 넣기",
      "기관 / 시기"
     ],
     [
      101,
      "연결하기",
      "ㄷ / ㄴ / ㄱ"
     ],
     [
      102,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      103,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      104,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      105,
      "복수 선택",
      "②, ③, ④"
     ],
     [
      106,
      "복수 선택",
      "①, ④, ⑤"
     ],
     [
      107,
      "자료 해석",
      "0.9mm / B"
     ],
     [
      108,
      "자료 해석",
      "ㄱ / ㄴ"
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
      "근거 / 한계"
     ],
     [
      116,
      "빈칸 넣기",
      "미공유 / 질문"
     ],
     [
      117,
      "연결하기",
      "ㄷ / ㄱ / ㄴ"
     ],
     [
      118,
      "연결하기",
      "ㄴ / ㄷ / ㄱ"
     ],
     [
      119,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      120,
      "순서 배열",
      "ㄴ → ㄱ → ㄷ"
     ]
    ]
   ]
  },
  "combustion-quick-120": {
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
      "①, ③, ⑤"
     ],
     [
      122,
      "복수 선택",
      "②, ④, ⑤"
     ],
     [
      123,
      "자료 해석",
      "30단위 / B"
     ],
     [
      124,
      "자료 해석",
      "2개 / 2개"
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
 "questionSource": "c22-s62-u02.questions.js",
 "visualBindings": [
  {
   "no": 11,
   "figure": "combustion-question-data-11",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 12,
   "figure": "combustion-question-data-12",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 17,
   "figure": "combustion-question-data-17",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 18,
   "figure": "combustion-question-data-18",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 19,
   "figure": "combustion-question-data-19",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 20,
   "figure": "combustion-question-data-20",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 21,
   "figure": "combustion-question-data-21",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 25,
   "figure": "combustion-question-data-25",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 27,
   "figure": "combustion-question-data-27",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 28,
   "figure": "combustion-question-data-28",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 29,
   "figure": "combustion-question-data-29",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 33,
   "figure": "combustion-question-data-33",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 34,
   "figure": "combustion-question-data-34",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 35,
   "figure": "combustion-question-data-35",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 38,
   "figure": "combustion-question-data-38",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 40,
   "figure": "combustion-question-data-40",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 41,
   "figure": "combustion-question-data-41",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 43,
   "figure": "combustion-question-data-43",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 44,
   "figure": "combustion-question-data-44",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 46,
   "figure": "combustion-question-data-46",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 49,
   "figure": "combustion-question-data-49",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 52,
   "figure": "combustion-question-data-52",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 54,
   "figure": "combustion-question-data-54",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 56,
   "figure": "combustion-question-data-56",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 57,
   "figure": "combustion-question-data-57",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 59,
   "figure": "combustion-question-data-59",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 60,
   "figure": "combustion-question-data-60",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 61,
   "figure": "combustion-question-data-61",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 68,
   "figure": "combustion-question-data-68",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 69,
   "figure": "combustion-question-data-69",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 72,
   "figure": "combustion-question-data-72",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 73,
   "figure": "combustion-question-data-73",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 75,
   "figure": "combustion-question-data-75",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 76,
   "figure": "combustion-question-data-76",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 78,
   "figure": "combustion-question-data-78",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 80,
   "figure": "combustion-question-data-80",
   "kind": "provided-practice-table",
   "precedingDataPage": true,
   "sameModelAsQuestion": true
  },
  {
   "no": 81,
   "figure": "combustion-question-data-81",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 87,
   "figure": "combustion-question-data-87",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 89,
   "figure": "combustion-question-data-89",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 90,
   "figure": "combustion-question-data-90",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 91,
   "figure": "combustion-question-data-91",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 92,
   "figure": "combustion-question-data-92",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 98,
   "figure": "combustion-question-data-98",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 107,
   "figure": "combustion-question-data-107",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 108,
   "figure": "combustion-question-data-108",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 109,
   "figure": "combustion-question-data-109",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 123,
   "figure": "combustion-question-data-123",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  },
  {
   "no": 124,
   "figure": "combustion-question-data-124",
   "kind": "provided-practice-table",
   "precedingDataPage": false,
   "sameModelAsQuestion": true
  }
 ],
 "actualStudentPerformanceConfirmed": false
};

export const learnerPriorWorkbook=withCombustionEditorial(baseWorkbook);
export const workbook=withLearnerExplanations(learnerPriorWorkbook);
