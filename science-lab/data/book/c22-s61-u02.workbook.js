import{withMotionPhotoLanguage}from'./c22-s61-u02.editorial.js?v=20261105-sound-motion-photo-language';
import{withObservationLanguage}from'./observation-language.js';
// 물체의 운동128문항. scripts/gen-science-workbook-c22s61u02.mjs가 생성.
import {withMotionEditorial} from './c22-s61-u02.editorial.js';
const baseWorkbook = {
 "unit": "c22-s61-u02",
 "title": "물체의 운동",
 "semester": "6-1",
 "no": 2,
 "theme": "#2456c4",
 "book": "지필드 교과 연결 사고력",
 "richText": true,
 "questions": [
  {
   "id": "c22-s61-u02-w001",
   "no": 1,
   "form": "choice",
   "type": "T01",
   "topic": "운동의 공통점",
   "prompt": "같은 벽을 기준으로 두 시각의 물체를 보았습니다. 운동했다고 말할 근거를 고르세요.",
   "answer": "③ 위치가 달라졌다.",
   "explanation": "같은 기준에서 시간이 지날 때 위치가 달라져야 해요. 색이나 모양의 변화만으로 이동을 정하지 않아요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "choices": [
    "표면이 따뜻해졌다.",
    "색이 달라졌다.",
    "위치가 달라졌다.",
    "무게가 커졌다.",
    "크기가 줄었다."
   ],
   "key": 2,
   "criteria": "제시한 조건에서 「위치가 달라졌다.」을 고른다. 같은 기준에서 시간이 지날 때 위치가 달라져야 해요. 색이나 모양의 변화만으로 이동을 정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   }
  },
  {
   "id": "c22-s61-u02-w002",
   "no": 2,
   "form": "blank",
   "type": "T01",
   "topic": "위치 변화의 이름",
   "prompt": "시간에 따라 물체의 위치가 변하는 것을 물체의 [ ]이라고 해요.",
   "answer": "운동",
   "explanation": "운동을 말할 때에는 위치를 비교한 시각과 기준을 함께 확인해요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "criteria": "「운동」 또는 명시한 동등 표현으로 답한다. 운동을 말할 때에는 위치를 비교한 시각과 기준을 함께 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "운동"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w003",
   "no": 3,
   "form": "short",
   "type": "T01",
   "topic": "같은 기준에서 비교",
   "prompt": "0초와 2초의 눈금이 달라진 대상을 쓰세요.",
   "answer": "공",
   "explanation": "공은 1눈금에서 4눈금으로 달라졌어요. 책장은 두 시각 모두 6눈금이에요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "table": {
    "heads": [
     "대상",
     "0초 위치(눈금)",
     "2초 위치(눈금)"
    ],
    "rows": [
     [
      "공",
      1,
      4
     ],
     [
      "책장",
      6,
      6
     ]
    ]
   },
   "model": {
    "kind": "changed-name",
    "names": [
     "공",
     "책장"
    ],
    "before": [
     1,
     6
    ],
    "after": [
     4,
     6
    ]
   },
   "criteria": "「공」 또는 명시한 동등 표현으로 답한다. 공은 1눈금에서 4눈금으로 달라졌어요. 책장은 두 시각 모두 6눈금이에요.",
   "figure": "motion-question-3",
   "origin": "independently-authored-current-curriculum",
   "accepted": [
    "공이다"
   ],
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "공",
     "공이다"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w004",
   "no": 4,
   "form": "multi",
   "type": "T01",
   "topic": "관찰할 기준",
   "prompt": "운동하는지 비교할 때 필요한 방법을 모두 고르세요.",
   "answer": "②, ③, ⑤",
   "explanation": "같은 기준 장소에서 시간 순서를 정하고 위치를 비교해야 해요. 물체의 이름이나 색은 위치 변화의 근거가 아니에요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "choices": [
    "큰 물체를 무조건 움직였다고 정한다.",
    "같은 기준에서 위치를 비교한다.",
    "같은 벽의 눈금을 기준으로 삼는다.",
    "색이 진한 물체를 움직였다고 정한다.",
    "처음과 나중의 시각을 구분한다."
   ],
   "key": [
    1,
    2,
    4
   ],
   "criteria": "「같은 기준에서 위치를 비교한다. / 같은 벽의 눈금을 기준으로 삼는다. / 처음과 나중의 시각을 구분한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     2,
     4
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w005",
   "no": 5,
   "form": "match",
   "type": "T01",
   "topic": "확인한 것과 더 필요한 것",
   "prompt": "보기: ㄱ 위치 변화 확인 / ㄴ 자료가 더 필요함",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄴ",
   "explanation": "서로 다른 시각의 위치 비교가 있어야 해요. 한 사진이나 색 변화만으로 이동 여부를 확정할 수 없어요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "parts": [
    "(1) 같은 벽 기준으로 0초에는 1눈금, 2초에는 3눈금에 있었다. [ ]",
    "(2) 수레 사진 한 장만 있다. [ ]",
    "(3) 공의 색이 달라졌다는 말만 있다. [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄴ」 또는 명시한 동등 표현으로 답한다. 서로 다른 시각의 위치 비교가 있어야 해요. 한 사진이나 색 변화만으로 이동 여부를 확정할 수 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄴ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w006",
   "no": 6,
   "form": "written",
   "type": "T01",
   "topic": "기준이 달라진 사진",
   "prompt": "처음 사진은 교실 벽, 나중 사진은 움직이는 카메라를 기준으로 찍었습니다. 물체가 움직였다고 바로 판단하기 어려운 까닭과 보완 방법을 쓰세요.",
   "answer": "기준이 달라 사진 속 위치 변화가 물체의 이동 때문인지 구별하기 어려워요. 같은 벽이나 고정 눈금을 기준으로 두 시각의 위치를 다시 비교해요.",
   "explanation": "사진에서 달라 보이는 것과 같은 기준에서 물체가 이동한 것은 구별해야 해요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "requirements": [
    "두 사진의 기준이 달라졌음을 지적",
    "고정된 같은 기준 제안",
    "처음/나중 시각의 위치 재비교"
   ],
   "lines": 8,
   "criteria": "두 사진의 기준이 달라졌음을 지적 / 고정된 같은 기준 제안 / 처음/나중 시각의 위치 재비교",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "기준이 달라 사진 속 위치 변화가 물체의 이동 때문인지 구별하기 어려워요. 같은 벽이나 고정 눈금을 기준으로 두 시각의 위치를 다시 비교해요.",
    "required": [
     "두 사진의 기준이 달라졌음을 지적",
     "고정된 같은 기준 제안",
     "처음/나중 시각의 위치 재비교"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w007",
   "no": 7,
   "form": "choice",
   "type": "T01",
   "topic": "타당한 부분 표현",
   "prompt": "친구가 “수레가 문 쪽으로 움직였어”라고 말했습니다. 알맞게 받아들인 것을 고르세요.",
   "answer": "① 방향은 알지만 수치 비교 자료는 더 필요하다.",
   "explanation": "이 말은 움직인 방향에 관한 정보예요. 빠르기를 수치로 비교하려면 거리와 시간이 더 필요하지만, 운동 표현 자체가 틀린 것은 아니에요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "choices": [
    "방향은 알지만 수치 비교 자료는 더 필요하다.",
    "문까지 남은 거리만 있으면 속력이 구해진다.",
    "움직였다는 말만으로 언제나 일정한 빠르기다.",
    "숫자가 없으니 움직이지 않은 것이다.",
    "거리와 시간이 없으면 언제나 거짓이다."
   ],
   "key": 0,
   "criteria": "제시한 조건에서 「방향은 알지만 수치 비교 자료는 더 필요하다.」을 고른다. 이 말은 움직인 방향에 관한 정보예요. 빠르기를 수치로 비교하려면 거리와 시간이 더 필요하지만, 운동 표현 자체가 틀린 것은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   }
  },
  {
   "id": "c22-s61-u02-w008",
   "no": 8,
   "form": "blank",
   "type": "T01",
   "topic": "기준의 일관성",
   "prompt": "두 시각의 위치를 비교할 때에는 [ ] 기준 장소를 사용해요.",
   "answer": "같은",
   "explanation": "기준이 달라지면 사진 속 변화의 원인을 구별하기 어려워요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "accepted": [
    "동일한"
   ],
   "criteria": "「같은」 또는 명시한 동등 표현으로 답한다. 기준이 달라지면 사진 속 변화의 원인을 구별하기 어려워요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "같은",
     "동일한"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w009",
   "no": 9,
   "form": "short",
   "type": "T11",
   "topic": "한 점의 좌표",
   "prompt": "그림의 점 P를 (가로 눈금, 세로 눈금)으로 나타내세요.",
   "answer": "(3, 2)",
   "explanation": "가로 3눈금과 세로 2눈금이 만나는 곳이므로 (3, 2)예요. 두 수의 순서를 바꾸지 않아요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "plot": {
    "range": 5,
    "points": [
     {
      "label": "P",
      "x": 3,
      "y": 2,
      "shape": "circle"
     }
    ]
   },
   "model": {
    "kind": "point-coordinate",
    "label": "P",
    "x": 3,
    "y": 2
   },
   "criteria": "「(3, 2)」 또는 명시한 동등 표현으로 답한다. 가로 3눈금과 세로 2눈금이 만나는 곳이므로 (3, 2)예요. 두 수의 순서를 바꾸지 않아요.",
   "figure": "motion-question-9",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "coordinate-pair",
    "values": [
     3,
     2
    ],
    "orderSensitive": true,
    "separatorRequired": true,
    "accepted": [
     "(3, 2)",
     "3,2",
     "가로 3, 세로 2"
    ]
   }
  },
  {
   "id": "c22-s61-u02-w010",
   "no": 10,
   "form": "blank",
   "type": "T11",
   "topic": "좌표를 읽는 순서",
   "prompt": "이 교재의 (가로 눈금, 세로 눈금) 표현에서 먼저 쓰는 것은 [ ] 눈금이에요.",
   "answer": "가로",
   "explanation": "먼저 가로 위치, 다음에 세로 위치를 써서 같은 점을 일관되게 표현해요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "criteria": "「가로」 또는 명시한 동등 표현으로 답한다. 먼저 가로 위치, 다음에 세로 위치를 써서 같은 점을 일관되게 표현해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "가로"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w011",
   "no": 11,
   "form": "match",
   "type": "T11",
   "topic": "좌표와 눈금의 뜻",
   "prompt": "보기: ㄱ 가로 1·세로 4 / ㄴ 가로 4·세로 1 / ㄷ 가로 2·세로 3",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "괄호 안 첫 수는 가로, 둘째 수는 세로예요. 두 수를 같은 순서로 대응해요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "parts": [
    "(1) (4, 1) [ ]",
    "(2) (1, 4) [ ]",
    "(3) (2, 3) [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄴ (2) ㄱ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. 괄호 안 첫 수는 가로, 둘째 수는 세로예요. 두 수를 같은 순서로 대응해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w012",
   "no": 12,
   "form": "written",
   "type": "T11",
   "topic": "바뀐 좌표 순서",
   "prompt": "점 P는 가로 3눈금, 세로 1눈금에 있습니다. (1, 3)이라고 쓴 답을 근거와 함께 고쳐 보세요.",
   "answer": "첫 수가 가로, 둘째 수가 세로이므로 (3, 1)로 고쳐요. (1, 3)은 가로 1·세로 3인 다른 점이에요.",
   "explanation": "두 수를 모두 썼더라도 순서가 달라지면 다른 위치를 가리킬 수 있어요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "requirements": [
    "(3, 1)로 수정",
    "가로 먼저/세로 나중 설명",
    "(1, 3)은 다른 점임을 구별"
   ],
   "lines": 8,
   "criteria": "(3, 1)로 수정 / 가로 먼저/세로 나중 설명 / (1, 3)은 다른 점임을 구별",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "첫 수가 가로, 둘째 수가 세로이므로 (3, 1)로 고쳐요. (1, 3)은 가로 1·세로 3인 다른 점이에요.",
    "required": [
     "(3, 1)로 수정",
     "가로 먼저/세로 나중 설명",
     "(1, 3)은 다른 점임을 구별"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w013",
   "no": 13,
   "form": "choice",
   "type": "T11",
   "topic": "처음과 나중 위치",
   "prompt": "처음 A와 나중 B의 위치를 바르게 나타낸 것을 고르세요.",
   "answer": "⑤ A(1, 2), B(4, 3)",
   "explanation": "A는 가로 1·세로 2, B는 가로 4·세로 3이에요. 처음과 나중, 가로와 세로를 모두 구별해요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "plot": {
    "range": 5,
    "points": [
     {
      "label": "A 처음",
      "x": 1,
      "y": 2,
      "shape": "circle"
     },
     {
      "label": "B 나중",
      "x": 4,
      "y": 3,
      "shape": "square"
     }
    ]
   },
   "choices": [
    "A(2, 1), B(3, 4)",
    "A(4, 3), B(1, 2)",
    "A(1, 3), B(4, 2)",
    "A(2, 4), B(3, 1)",
    "A(1, 2), B(4, 3)"
   ],
   "key": 4,
   "criteria": "제시한 조건에서 「A(1, 2), B(4, 3)」을 고른다. A는 가로 1·세로 2, B는 가로 4·세로 3이에요. 처음과 나중, 가로와 세로를 모두 구별해요.",
   "figure": "motion-question-13",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   }
  },
  {
   "id": "c22-s61-u02-w014",
   "no": 14,
   "form": "order",
   "type": "T11",
   "topic": "좌표 표현 절차",
   "prompt": "점의 위치를 좌표로 나타내는 절차를 순서대로 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ → ㄹ",
   "explanation": "먼저 기준과 눈금을 확인하고 가로·세로를 정해진 순서로 읽은 뒤 원래 점과 맞춰 봐요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "given": [
    "ㄱ 가로 눈금 읽기",
    "ㄴ 기준과 눈금 확인",
    "ㄷ 세로 눈금 읽기",
    "ㄹ (가로, 세로)로 쓰고 점과 대조하기"
   ],
   "criteria": "「ㄴ → ㄱ → ㄷ → ㄹ」 또는 명시한 동등 표현으로 답한다. 먼저 기준과 눈금을 확인하고 가로·세로를 정해진 순서로 읽은 뒤 원래 점과 맞춰 봐요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-sequence",
    "sequence": [
     "ㄴ",
     "ㄱ",
     "ㄷ",
     "ㄹ"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w015",
   "no": 15,
   "form": "written",
   "type": "T11",
   "topic": "변화와 모르는 거리",
   "prompt": "한 물체가 처음 (1, 1), 나중 (4, 3)에 있었습니다. 확인할 수 있는 것과 아직 계산하지 않을 것을 구별해 쓰세요.",
   "answer": "같은 좌표 기준에서 처음과 나중 위치가 달라 운동했음을 말할 수 있어요. 이 활동에서는 두 점 사이의 거리를 구하지 않아요.",
   "explanation": "좌표는 위치 표현의 자료예요. 이 단원에서 좌표 두 점 사이 거리 계산을 요구하지 않아요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "requirements": [
    "같은 기준의 위치 변화 확인",
    "처음/나중 구분",
    "두 점 사이 거리 계산을 하지 않음"
   ],
   "lines": 8,
   "criteria": "같은 기준의 위치 변화 확인 / 처음/나중 구분 / 두 점 사이 거리 계산을 하지 않음",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "같은 좌표 기준에서 처음과 나중 위치가 달라 운동했음을 말할 수 있어요. 이 활동에서는 두 점 사이의 거리를 구하지 않아요.",
    "required": [
     "같은 기준의 위치 변화 확인",
     "처음/나중 구분",
     "두 점 사이 거리 계산을 하지 않음"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w016",
   "no": 16,
   "form": "draw",
   "type": "T11",
   "topic": "처음과 나중을 그리기",
   "prompt": "가로·세로 눈금이 0~5인 좌표 평면을 그리고 처음 A(1, 2), 나중 B(4, 3)를 표시하세요. 이름표와 좌표를 읽는 순서도 쓰세요.",
   "answer": "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
   "explanation": "좌표를 정확히 표시하고 처음과 나중을 구별해요. 두 점의 거리는 계산하지 않아요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "requirements": [
    "가로/세로와 0~5눈금",
    "A(1, 2), B(4, 3)의 위치",
    "처음/나중 및 가로 먼저라는 이름표"
   ],
   "drawing": "large",
   "criteria": "가로/세로와 0~5눈금 / A(1, 2), B(4, 3)의 위치 / 처음/나중 및 가로 먼저라는 이름표",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
    "required": [
     "가로/세로와 0~5눈금",
     "A(1, 2), B(4, 3)의 위치",
     "처음/나중 및 가로 먼저라는 이름표"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w017",
   "no": 17,
   "form": "choice",
   "type": "T11",
   "topic": "축의 역할",
   "prompt": "점 P가 (2, 4)에 있습니다. 올바르게 읽은 설명을 고르세요.",
   "answer": "② 가로 2, 세로 4",
   "explanation": "첫 수 2가 가로, 둘째 수 4가 세로예요. 축의 이름과 숫자를 함께 읽어요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "choices": [
    "가로 4, 세로 4",
    "가로 2, 세로 4",
    "가로 0, 세로 4",
    "가로 4, 세로 2",
    "가로 2, 세로 2"
   ],
   "key": 1,
   "criteria": "제시한 조건에서 「가로 2, 세로 4」을 고른다. 첫 수 2가 가로, 둘째 수 4가 세로예요. 축의 이름과 숫자를 함께 읽어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   }
  },
  {
   "id": "c22-s61-u02-w018",
   "no": 18,
   "form": "blank",
   "type": "T11",
   "topic": "시간 순서 이름표",
   "prompt": "두 위치를 비교할 때 A가 0초, B가 3초라면 B는 [ ] 위치로 표시해요.",
   "answer": "나중",
   "explanation": "0초보다 3초가 나중이므로 B에 나중 위치라는 이름표를 붙여요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "criteria": "「나중」 또는 명시한 동등 표현으로 답한다. 0초보다 3초가 나중이므로 B에 나중 위치라는 이름표를 붙여요.",
   "origin": "independently-authored-current-curriculum",
   "accepted": [
    "나중의",
    "나중에"
   ],
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "나중",
     "나중의",
     "나중에"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w019",
   "no": 19,
   "form": "short",
   "type": "T11",
   "topic": "좌표 기록의 변화",
   "prompt": "처음 A(2, 1), 나중 B(2, 4)에서 값이 달라진 것은 가로와 세로 중 어느 눈금인가요?",
   "answer": "세로",
   "explanation": "가로는 두 점 모두 2이고 세로는 1과 4로 달라요. 위치 변화의 방향 정보를 읽으며 거리는 구하지 않아요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "criteria": "「세로」 또는 명시한 동등 표현으로 답한다. 가로는 두 점 모두 2이고 세로는 1과 4로 달라요. 위치 변화의 방향 정보를 읽으며 거리는 구하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "accepted": [
    "세로 눈금"
   ],
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "세로",
     "세로 눈금"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w020",
   "no": 20,
   "form": "multi",
   "type": "T11",
   "topic": "위치 그림의 정보",
   "prompt": "처음과 나중 위치를 읽기 쉽게 표현하는 방법을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "축과 눈금·시간 이름표가 있어야 위치와 순서를 읽을 수 있어요. 색만으로 구별하거나 눈금을 바꾸면 혼동하기 쉬워요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "choices": [
    "가로·세로 축 이름을 쓴다.",
    "처음/나중과 시각을 표시한다.",
    "점 두 개를 색만 다르게 칠한다.",
    "같은 기준과 눈금을 유지한다.",
    "나중 그림의 눈금을 임의로 바꾼다."
   ],
   "key": [
    0,
    1,
    3
   ],
   "criteria": "「가로·세로 축 이름을 쓴다. / 처음/나중과 시각을 표시한다. / 같은 기준과 눈금을 유지한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     3
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w021",
   "no": 21,
   "form": "match",
   "type": "T11",
   "topic": "표현으로 알 수 있는 것",
   "prompt": "보기: ㄱ 위치 표현 / ㄴ 시간 표현 / ㄷ 속력 표현",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "좌표는 있는 곳, 초는 시각/시간, m/s는 단위 시간 동안의 이동 거리와 연결돼요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "parts": [
    "(1) 가로 2눈금·세로 3눈금 [ ]",
    "(2) 출발 후 4초 [ ]",
    "(3) 2m/s [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. 좌표는 있는 곳, 초는 시각/시간, m/s는 단위 시간 동안의 이동 거리와 연결돼요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w022",
   "no": 22,
   "form": "written",
   "type": "T11",
   "topic": "한 장의 좌표 그림",
   "prompt": "한 시각에 점 P가 (3, 2)에 있다는 그림만 있습니다. 운동했는지 알기 위해 더 필요한 자료를 쓰세요.",
   "answer": "다른 시각의 위치와 두 시각에 사용한 같은 기준이 필요해요. 한 시각의 점 하나로 위치 변화를 알 수는 없어요.",
   "explanation": "운동은 시간에 따른 변화이므로 두 시각 이상의 비교 자료를 확보해요.",
   "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
   "requirements": [
    "다른 시각의 위치 요구",
    "시각의 구분",
    "같은 좌표 기준 요구"
   ],
   "lines": 8,
   "criteria": "다른 시각의 위치 요구 / 시각의 구분 / 같은 좌표 기준 요구",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "다른 시각의 위치와 두 시각에 사용한 같은 기준이 필요해요. 한 시각의 점 하나로 위치 변화를 알 수는 없어요.",
    "required": [
     "다른 시각의 위치 요구",
     "시각의 구분",
     "같은 좌표 기준 요구"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w023",
   "no": 23,
   "form": "choice",
   "type": "T02",
   "topic": "같은 시간 간격",
   "prompt": "한 방향으로 움직인 수레의 연속한 1초 구간 이동 거리입니다. 빠르기가 일정한 기록을 고르세요.",
   "answer": "④ 2, 2, 2m",
   "explanation": "같은 1초마다 이동 거리가 같은 기록은 2, 2, 2예요. 다른 기록은 구간별 거리가 달라요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "model": {
    "kind": "constant-choice",
    "rows": [
     [
      1,
      2,
      3
     ],
     [
      2,
      2,
      2
     ],
     [
      3,
      2,
      1
     ],
     [
      1,
      1,
      2
     ],
     [
      2,
      3,
      2
     ]
    ]
   },
   "choices": [
    "1, 1, 2m",
    "2, 3, 2m",
    "1, 2, 3m",
    "2, 2, 2m",
    "3, 2, 1m"
   ],
   "key": 3,
   "criteria": "제시한 조건에서 「2, 2, 2m」을 고른다. 같은 1초마다 이동 거리가 같은 기록은 2, 2, 2예요. 다른 기록은 구간별 거리가 달라요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   }
  },
  {
   "id": "c22-s61-u02-w024",
   "no": 24,
   "form": "blank",
   "type": "T02",
   "topic": "빨라짐의 근거",
   "prompt": "같은 1초 구간의 이동 거리가 1m, 2m, 3m로 늘면 관찰 구간에서 점점 [ ]졌다고 해요.",
   "answer": "빨라",
   "explanation": "같은 시간 동안 이동한 거리가 늘어나므로 단위 시간의 거리도 커져요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "accepted": [
    "빨라졌다",
    "빨라짐"
   ],
   "criteria": "「빨라」 또는 명시한 동등 표현으로 답한다. 같은 시간 동안 이동한 거리가 늘어나므로 단위 시간의 거리도 커져요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "빨라",
     "빨라졌다",
     "빨라짐"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w025",
   "no": 25,
   "form": "short",
   "type": "T02",
   "topic": "느려짐의 근거",
   "prompt": "같은 2초마다 이동한 거리가 6m, 4m, 2m였습니다. 빠르기는 어떻게 변했나요?",
   "answer": "점점 느려졌다",
   "explanation": "시간 간격은 같고 거리는 줄었으므로 관찰한 구간에서 점점 느려졌어요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "accepted": [
    "느려졌다",
    "점점 느려짐",
    "느려짐",
    "느려진다",
    "점점 느려진다"
   ],
   "criteria": "「점점 느려졌다」 또는 명시한 동등 표현으로 답한다. 시간 간격은 같고 거리는 줄었으므로 관찰한 구간에서 점점 느려졌어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "점점 느려졌다",
     "느려졌다",
     "점점 느려짐",
     "느려짐",
     "느려진다",
     "점점 느려진다"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w026",
   "no": 26,
   "form": "short",
   "type": "T02",
   "topic": "같은 간격인지 확인",
   "prompt": "어느 물체의 구간 거리는 2m와 4m였지만 각 구간에 걸린 시간은 없습니다. 점점 빨라졌다고 확정할 수 있나요?",
   "answer": "확정할 수 없다",
   "explanation": "4m를 가는 데 더 긴 시간이 걸렸을 수도 있어요. 각 구간의 시간이 같았는지 등 시간 자료가 더 필요해요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "accepted": [
    "알 수 없다",
    "확정 불가",
    "자료가 더 필요하다",
    "확정 불가능",
    "확정할 수 없음",
    "아니요",
    "아니다"
   ],
   "criteria": "「확정할 수 없다」 또는 명시한 동등 표현으로 답한다. 4m를 가는 데 더 긴 시간이 걸렸을 수도 있어요. 각 구간의 시간이 같았는지 등 시간 자료가 더 필요해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "확정할 수 없다",
     "알 수 없다",
     "확정 불가",
     "자료가 더 필요하다",
     "확정 불가능",
     "확정할 수 없음",
     "아니요",
     "아니다"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w027",
   "no": 27,
   "form": "match",
   "type": "T02",
   "topic": "구간 기록 분류",
   "prompt": "보기: ㄱ 일정함 / ㄴ 빨라짐 / ㄷ 느려짐. 모두 연속한 1초 구간의 거리입니다.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "같은 시간의 거리가 늘면 빨라지고 줄면 느려지며 같으면 일정해요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "parts": [
    "(1) 1m, 3m, 5m [ ]",
    "(2) 5m, 3m, 1m [ ]",
    "(3) 3m, 3m, 3m [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현으로 답한다. 같은 시간의 거리가 늘면 빨라지고 줄면 느려지며 같으면 일정해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w028",
   "no": 28,
   "form": "written",
   "type": "T02",
   "topic": "물체 이름의 한계",
   "prompt": "친구가 “케이블카는 항상 같은 빠르기야”라고 말했습니다. 관찰할 구간을 포함해 타당하게 고쳐 쓰세요.",
   "answer": "정상 운행 중 한 구간에서 빠르기가 거의 일정할 수 있어요. 출발·정지 구간까지 항상 같다고 단정하지 않고 같은 시간 간격의 위치 기록으로 확인해요.",
   "explanation": "물체 이름보다 운행 구간과 시간별 이동 자료를 근거로 삼아요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "requirements": [
    "항상이라는 확대를 수정",
    "출발/정지와 운행 구간 구별",
    "같은 시간 간격의 자료로 확인"
   ],
   "lines": 8,
   "criteria": "항상이라는 확대를 수정 / 출발/정지와 운행 구간 구별 / 같은 시간 간격의 자료로 확인",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "정상 운행 중 한 구간에서 빠르기가 거의 일정할 수 있어요. 출발·정지 구간까지 항상 같다고 단정하지 않고 같은 시간 간격의 위치 기록으로 확인해요.",
    "required": [
     "항상이라는 확대를 수정",
     "출발/정지와 운행 구간 구별",
     "같은 시간 간격의 자료로 확인"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w029",
   "no": 29,
   "form": "choice",
   "type": "T02",
   "topic": "사진과 빠르기 변화",
   "prompt": "내려오는 비행기의 사진 한 장으로 알맞게 말한 것을 고르세요.",
   "answer": "② 빠르기 변화는 시간별 자료로 더 확인한다.",
   "explanation": "사진 한 장에는 시간에 따른 위치나 속력 기록이 없어요. 높이가 낮아지는 방향만으로 느려짐을 확정할 수는 없어요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "choices": [
    "하늘에 있으니 위치가 변하지 않는다.",
    "빠르기 변화는 시간별 자료로 더 확인한다.",
    "높이가 낮아지는 방향이면 반드시 느려진다.",
    "땅에 가까워지는 비행기는 반드시 빨라진다.",
    "비행기이므로 언제나 일정하다."
   ],
   "key": 1,
   "criteria": "제시한 조건에서 「빠르기 변화는 시간별 자료로 더 확인한다.」을 고른다. 사진 한 장에는 시간에 따른 위치나 속력 기록이 없어요. 높이가 낮아지는 방향만으로 느려짐을 확정할 수는 없어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   }
  },
  {
   "id": "c22-s61-u02-w030",
   "no": 30,
   "form": "order",
   "type": "T02",
   "topic": "빠르기 변화 조사",
   "prompt": "수레의 빠르기 변화를 조사할 절차를 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
   "explanation": "같은 기준과 시간 간격을 정해 기록한 뒤 구간별 이동 거리를 비교하고 근거 범위에서 설명해요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "given": [
    "ㄱ 같은 시간 간격으로 위치 남기기",
    "ㄴ 빠르기 변화와 한계 설명하기",
    "ㄷ 기준 장소와 시간 간격 정하기",
    "ㄹ 각 같은 시간 구간의 거리 비교하기"
   ],
   "criteria": "「ㄷ → ㄱ → ㄹ → ㄴ」 또는 명시한 동등 표현으로 답한다. 같은 기준과 시간 간격을 정해 기록한 뒤 구간별 이동 거리를 비교하고 근거 범위에서 설명해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-sequence",
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄹ",
     "ㄴ"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w031",
   "no": 31,
   "form": "written",
   "type": "T02",
   "topic": "일정함을 설명하기",
   "prompt": "한 방향으로 움직인 수레가 매 2초마다 4m씩 이동했습니다. 어떤 구간에서 무엇이 일정했다고 말할 수 있나요?",
   "answer": "관찰한 연속 구간에서 같은 2초마다 4m씩 이동해 빠르기가 일정했다고 말할 수 있어요. 관찰하지 않은 출발 전이나 그 이후까지 같다고 하지는 않아요.",
   "explanation": "관찰 구간·같은 시간·같은 거리를 함께 제시하면 근거가 분명해져요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "requirements": [
    "관찰한 구간 한정",
    "2초와 4m 제시",
    "같은 시간/거리와 일정한 빠르기 연결"
   ],
   "lines": 8,
   "criteria": "관찰한 구간 한정 / 2초와 4m 제시 / 같은 시간/거리와 일정한 빠르기 연결",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "관찰한 연속 구간에서 같은 2초마다 4m씩 이동해 빠르기가 일정했다고 말할 수 있어요. 관찰하지 않은 출발 전이나 그 이후까지 같다고 하지는 않아요.",
    "required": [
     "관찰한 구간 한정",
     "2초와 4m 제시",
     "같은 시간/거리와 일정한 빠르기 연결"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w032",
   "no": 32,
   "form": "draw",
   "type": "T02",
   "topic": "같은 시간의 위치 표시",
   "prompt": "한 방향으로 움직이는 수레가 같은 1초마다 이동한 거리가 점점 길어지는 모습을 점과 시각 이름표로 그리세요. 실제 측정한 기록이라고 쓰지 마세요.",
   "answer": "처음·1초·2초·3초 점을 한 방향에 놓고 점 사이 간격이 차례로 커지게 그려요. 자신이 구성한 예시 그림이라고 표시해요.",
   "explanation": "시각 간격은 같고 위치 간격이 늘어야 빨라짐을 표현해요.",
   "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
   "requirements": [
    "한 방향의 위치점",
    "동일한 1초 시각 간격 표시",
    "점 사이 간격 증가와 예시 표시"
   ],
   "drawing": "large",
   "criteria": "한 방향의 위치점 / 동일한 1초 시각 간격 표시 / 점 사이 간격 증가와 예시 표시",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "처음·1초·2초·3초 점을 한 방향에 놓고 점 사이 간격이 차례로 커지게 그려요. 자신이 구성한 예시 그림이라고 표시해요.",
    "required": [
     "한 방향의 위치점",
     "동일한 1초 시각 간격 표시",
     "점 사이 간격 증가와 예시 표시"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w033",
   "no": 33,
   "form": "choice",
   "type": "T03",
   "topic": "같은 거리의 빠르기",
   "prompt": "같은 12m를 걸은 기록입니다. 가장 빠른 사람을 고르세요.",
   "answer": "⑤ 수아",
   "explanation": "같은 거리에서는 시간이 짧을수록 빨라요. 수아의 6초가 가장 짧아요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "table": {
    "heads": [
     "이름",
     "걸린 시간(초)"
    ],
    "rows": [
     [
      "민준",
      8
     ],
     [
      "수아",
      6
     ],
     [
      "다온",
      10
     ]
    ]
   },
   "model": {
    "kind": "min-name-choice",
    "names": [
     "민준",
     "수아",
     "다온"
    ],
    "values": [
     8,
     6,
     10
    ]
   },
   "choices": [
    "다온",
    "모두 같음",
    "거리로만 비교 가능",
    "민준",
    "수아"
   ],
   "key": 4,
   "criteria": "제시한 조건에서 「수아」을 고른다. 같은 거리에서는 시간이 짧을수록 빨라요. 수아의 6초가 가장 짧아요.",
   "figure": "motion-question-33",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   }
  },
  {
   "id": "c22-s61-u02-w034",
   "no": 34,
   "form": "blank",
   "type": "T03",
   "topic": "짧은 시간",
   "prompt": "같은 거리를 이동했을 때 걸린 시간이 [ ]수록 더 빨라요.",
   "answer": "짧을",
   "explanation": "같은 거리를 더 적은 시간에 가면 단위 시간 동안 더 멀리 간 셈이에요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "accepted": [
    "짧을수록",
    "짧은",
    "짧아질"
   ],
   "criteria": "「짧을」 또는 명시한 동등 표현으로 답한다. 같은 거리를 더 적은 시간에 가면 단위 시간 동안 더 멀리 간 셈이에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "짧을",
     "짧을수록",
     "짧은",
     "짧아질"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w035",
   "no": 35,
   "form": "short",
   "type": "T03",
   "topic": "가장 느린 수레",
   "prompt": "같은 8m를 간 수레의 기록입니다. 가장 느린 수레를 쓰세요.",
   "answer": "나",
   "explanation": "같은 거리에서 가장 긴 8초가 걸린 나가 가장 느려요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "table": {
    "heads": [
     "수레",
     "걸린 시간(초)"
    ],
    "rows": [
     [
      "가",
      4
     ],
     [
      "나",
      8
     ],
     [
      "다",
      5
     ]
    ]
   },
   "model": {
    "kind": "max-name",
    "names": [
     "가",
     "나",
     "다"
    ],
    "values": [
     4,
     8,
     5
    ]
   },
   "criteria": "「나」 또는 명시한 동등 표현으로 답한다. 같은 거리에서 가장 긴 8초가 걸린 나가 가장 느려요.",
   "figure": "motion-question-35",
   "origin": "independently-authored-current-curriculum",
   "accepted": [
    "수레 나",
    "나 수레"
   ],
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "나",
     "수레 나",
     "나 수레"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w036",
   "no": 36,
   "form": "multi",
   "type": "T03",
   "topic": "같은 거리 비교 조건",
   "prompt": "같은 5m를 간 두 수레의 빠르기를 시간으로 비교하려고 합니다. 필요한 확인을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "같은 거리·같은 시작/끝 기준·같은 시간 단위가 있어야 제시 시간의 뜻이 같아요. 색이나 단정한 기록을 위해 값을 고치는 것은 근거가 아니에요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "choices": [
    "측정 시작과 끝의 기준을 확인한다.",
    "걸린 시간의 단위를 확인한다.",
    "예상과 다르면 시간을 고쳐 적는다.",
    "두 수레의 이동 거리가 5m인지 확인한다.",
    "색이 같은 수레만 정답으로 고른다."
   ],
   "key": [
    0,
    1,
    3
   ],
   "criteria": "「측정 시작과 끝의 기준을 확인한다. / 걸린 시간의 단위를 확인한다. / 두 수레의 이동 거리가 5m인지 확인한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     3
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w037",
   "no": 37,
   "form": "match",
   "type": "T03",
   "topic": "빠름과 느림 연결",
   "prompt": "모두 같은 10m를 갔습니다. 보기: ㄱ 가장 빠름 / ㄴ 중간 / ㄷ 가장 느림",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "같은 거리의 시간 5초, 8초, 10초를 짧은 순서로 비교해요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "parts": [
    "(1) 가: 10초 [ ]",
    "(2) 나: 5초 [ ]",
    "(3) 다: 8초 [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄷ (2) ㄱ (3) ㄴ」 또는 명시한 동등 표현으로 답한다. 같은 거리의 시간 5초, 8초, 10초를 짧은 순서로 비교해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w038",
   "no": 38,
   "form": "written",
   "type": "T03",
   "topic": "먼저 도착한 장면",
   "prompt": "A는 먼저 출발했고 B는 나중에 출발했습니다. A가 먼저 도착했다는 사실만으로 A가 더 빠르다고 할 수 없는 까닭을 쓰세요.",
   "answer": "출발 시각이 달라 도착 순서만으로 걸린 시간을 알 수 없어요. 같은 거리인지 확인하고 각자 출발부터 도착까지 걸린 시간을 비교해야 해요.",
   "explanation": "도착 시각과 이동에 걸린 시간을 구별해요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "requirements": [
    "출발 시각 차이 지적",
    "같은 거리 확인",
    "각자 걸린 시간 비교 제안"
   ],
   "lines": 8,
   "criteria": "출발 시각 차이 지적 / 같은 거리 확인 / 각자 걸린 시간 비교 제안",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "출발 시각이 달라 도착 순서만으로 걸린 시간을 알 수 없어요. 같은 거리인지 확인하고 각자 출발부터 도착까지 걸린 시간을 비교해야 해요.",
    "required": [
     "출발 시각 차이 지적",
     "같은 거리 확인",
     "각자 걸린 시간 비교 제안"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w039",
   "no": 39,
   "form": "choice",
   "type": "T03",
   "topic": "도착 시각과 걸린 시간",
   "prompt": "같은 길이의 코스를 움직인 두 로봇의 빠르기를 비교할 자료를 고르세요.",
   "answer": "① 출발부터 도착까지 걸린 시간",
   "explanation": "출발부터 도착까지 걸린 시간이 있어야 같은 거리의 빠르기를 비교할 수 있어요. 시각 하나나 물체 이름만으로는 부족해요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "choices": [
    "출발부터 도착까지 걸린 시간",
    "출발 시각과 무관한 도착 순서",
    "도착 시각만 서로 비교한 기록",
    "출발 시각만 서로 비교한 기록",
    "출발 직전 위치를 찍은 사진"
   ],
   "key": 0,
   "criteria": "제시한 조건에서 「출발부터 도착까지 걸린 시간」을 고른다. 출발부터 도착까지 걸린 시간이 있어야 같은 거리의 빠르기를 비교할 수 있어요. 시각 하나나 물체 이름만으로는 부족해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   }
  },
  {
   "id": "c22-s61-u02-w040",
   "no": 40,
   "form": "blank",
   "type": "T03",
   "topic": "시간의 측정 구간",
   "prompt": "걸린 시간은 도착 시각에서 [ ] 시각을 뺀 값이에요.",
   "answer": "출발",
   "explanation": "각자의 출발과 도착을 같은 시간 기준으로 읽어 차이를 구해요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "criteria": "「출발」 또는 명시한 동등 표현으로 답한다. 각자의 출발과 도착을 같은 시간 기준으로 읽어 차이를 구해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "출발"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w041",
   "no": 41,
   "form": "short",
   "type": "T03",
   "topic": "서로 같은 빠르기",
   "prompt": "가와 나는 같은 6m를 각각 3초에 갔습니다. 두 수레의 평균 빠르기는 같은가요?",
   "answer": "같다",
   "explanation": "거리와 시간이 각각 같으므로 평균 속력도 같아요. 움직이는 모든 순간의 빠르기까지 같았다는 뜻은 아니에요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "accepted": [
    "같음",
    "같습니다",
    "평균 빠르기가 같다",
    "네",
    "예",
    "같아요",
    "평균 속력이 같다"
   ],
   "criteria": "「같다」 또는 명시한 동등 표현으로 답한다. 거리와 시간이 각각 같으므로 평균 속력도 같아요. 움직이는 모든 순간의 빠르기까지 같았다는 뜻은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "같다",
     "같음",
     "같습니다",
     "평균 빠르기가 같다",
     "네",
     "예",
     "같아요",
     "평균 속력이 같다"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w042",
   "no": 42,
   "form": "multi",
   "type": "T03",
   "topic": "기록으로 타당하게 말하기",
   "prompt": "세 로봇이 같은 18m를 갔습니다. 타당한 설명을 모두 고르세요.",
   "answer": "①, ②, ③",
   "explanation": "시간이 짧은 순서는 나6초, 가9초, 다12초예요. 이는 이 조건의 평균 빠르기 비교예요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "table": {
    "heads": [
     "로봇",
     "걸린 시간(초)"
    ],
    "rows": [
     [
      "가",
      9
     ],
     [
      "나",
      6
     ],
     [
      "다",
      12
     ]
    ]
   },
   "choices": [
    "이 조건에서 나는 가보다 빠르다.",
    "나가 가장 빠르다.",
    "다가 가장 느리다.",
    "가는 나보다 빠르다.",
    "로봇 나는 어떤 상황에서도 가장 빠르다."
   ],
   "key": [
    0,
    1,
    2
   ],
   "criteria": "「이 조건에서 나는 가보다 빠르다. / 나가 가장 빠르다. / 다가 가장 느리다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "figure": "motion-question-42",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     2
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w043",
   "no": 43,
   "form": "match",
   "type": "T03",
   "topic": "비교에 쓸 수 있는 자료",
   "prompt": "보기: ㄱ 같은 거리의 시간 비교 가능 / ㄴ 더 필요한 조건이 있음",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄴ",
   "explanation": "거리가 같다는 조건과 각 시간의 시작/끝이 분명해야 시간만으로 비교할 수 있어요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "parts": [
    "(1) 같은 4m를 각자 출발부터 도착까지 2초와 3초에 갔다. [ ]",
    "(2) 각자 2초와 3초 움직였지만 거리가 없다. [ ]",
    "(3) 같은 도착선 사진에 출발 시각이 없다. [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄴ」 또는 명시한 동등 표현으로 답한다. 거리가 같다는 조건과 각 시간의 시작/끝이 분명해야 시간만으로 비교할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄴ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w044",
   "no": 44,
   "form": "written",
   "type": "T03",
   "topic": "시간 기록의 일관성",
   "prompt": "A는 앞부분이 출발선을 지날 때, B는 뒷부분이 출발선을 지날 때 시계를 시작했습니다. 끝낼 때는 둘 다 앞부분이 도착선을 지날 때 멈췄습니다. 어떻게 고쳐 비교할지 쓰세요.",
   "answer": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
   "explanation": "측정할 물체의 기준 부분과 시작/끝 규칙을 일관되게 맞춰요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "requirements": [
    "기준 부분 차이 지적",
    "같은 부분으로 시작/끝 정하기",
    "새 측정으로 비교하고 옛값 보존"
   ],
   "lines": 8,
   "criteria": "기준 부분 차이 지적 / 같은 부분으로 시작/끝 정하기 / 새 측정으로 비교하고 옛값 보존",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
    "required": [
     "기준 부분 차이 지적",
     "같은 부분으로 시작/끝 정하기",
     "새 측정으로 비교하고 옛값 보존"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w045",
   "no": 45,
   "form": "choice",
   "type": "T03",
   "topic": "학습용 같은 코스 경기",
   "prompt": "각자 다른 시각에 출발해 같은 거리를 이동한 기록 경기입니다. 더 빠른 참가자를 정하는 기준을 고르세요.",
   "answer": "③ 걸린 시간이 가장 짧은 참가자",
   "explanation": "같은 거리를 이동하는 데 걸린 시간이 짧은 참가자가 더 빨라요. 실제 교실 측정은 달리기 경쟁을 시키지 않고 안전한 평소 움직임으로 해요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "choices": [
    "출발 시각이 가장 이른 참가자",
    "도착 순서가 가장 빠른 참가자",
    "걸린 시간이 가장 짧은 참가자",
    "걸린 시간이 가장 긴 참가자",
    "출발 시각이 가장 늦은 참가자"
   ],
   "key": 2,
   "criteria": "제시한 조건에서 「걸린 시간이 가장 짧은 참가자」을 고른다. 같은 거리를 이동하는 데 걸린 시간이 짧은 참가자가 더 빨라요. 실제 교실 측정은 달리기 경쟁을 시키지 않고 안전한 평소 움직임으로 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   }
  },
  {
   "id": "c22-s61-u02-w046",
   "no": 46,
   "form": "blank",
   "type": "T03",
   "topic": "시간과 빠르기의 방향",
   "prompt": "같은 거리에서 4초 걸린 수레는 8초 걸린 수레보다 평균 빠르기가 더 [ ].",
   "answer": "빠르다",
   "explanation": "같은 거리를 더 짧은 시간에 갔으므로 4초 걸린 수레가 더 빨라요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "accepted": [
    "빠름",
    "빠릅니다"
   ],
   "criteria": "「빠르다」 또는 명시한 동등 표현으로 답한다. 같은 거리를 더 짧은 시간에 갔으므로 4초 걸린 수레가 더 빨라요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "빠르다",
     "빠름",
     "빠릅니다"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w047",
   "no": 47,
   "form": "written",
   "type": "T03",
   "topic": "다른 거리의 함정",
   "prompt": "한 길을 한 방향으로 가는 4m를 2초에, 나는 12m를 3초에 갔습니다. “2초가 짧으니 가가 빠르다”는 설명을 고쳐 보세요.",
   "answer": "이동 거리가 달라 시간만 비교하면 안 돼요. 가는 4÷2=2m/s, 나는 12÷3=4m/s라서 이 조건에서는 나가 더 빨라요.",
   "explanation": "같은 거리라는 조건이 없으면 거리와 시간을 함께 비교해요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "model": {
    "kind": "two-ratios",
    "distance": [
     4,
     12
    ],
    "time": [
     2,
     3
    ],
    "rates": [
     2,
     4
    ]
   },
   "requirements": [
    "거리 차이 지적",
    "2m/s와 4m/s 검산",
    "나가 더 빠름과 조건 한정"
   ],
   "lines": 8,
   "criteria": "거리 차이 지적 / 2m/s와 4m/s 검산 / 나가 더 빠름과 조건 한정",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "이동 거리가 달라 시간만 비교하면 안 돼요. 가는 4÷2=2m/s, 나는 12÷3=4m/s라서 이 조건에서는 나가 더 빨라요.",
    "required": [
     "거리 차이 지적",
     "2m/s와 4m/s 검산",
     "나가 더 빠름과 조건 한정"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w048",
   "no": 48,
   "form": "draw",
   "type": "T03",
   "topic": "같은 거리 측정 계획도",
   "prompt": "안전한 실내에서 수레 두 대가 같은 구간을 가는 시간을 재는 배치를 그리세요. 시작/끝선·같은 기준 부분·측정자의 위치를 표시하세요.",
   "answer": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
   "explanation": "그림은 계획이며 실제로 잰 시간은 아직 채우지 않아요.",
   "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
   "requirements": [
    "같은 출발/도착 구간",
    "같은 수레 기준 부분 표시",
    "경로를 비킨 측정자 위치와 계획 표시"
   ],
   "drawing": "large",
   "criteria": "같은 출발/도착 구간 / 같은 수레 기준 부분 표시 / 경로를 비킨 측정자 위치와 계획 표시",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
    "required": [
     "같은 출발/도착 구간",
     "같은 수레 기준 부분 표시",
     "경로를 비킨 측정자 위치와 계획 표시"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w049",
   "no": 49,
   "form": "choice",
   "type": "T04",
   "topic": "같은 시간의 거리",
   "prompt": "모두 3초 동안 이동한 로봇입니다. 가장 빠른 로봇을 고르세요.",
   "answer": "④ 나",
   "explanation": "같은 3초에 가장 먼 120cm를 간 나가 빨라요. 같은 시간이라는 조건을 함께 읽어요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "table": {
    "heads": [
     "로봇",
     "이동 거리(cm)"
    ],
    "rows": [
     [
      "가",
      60
     ],
     [
      "나",
      120
     ],
     [
      "다",
      90
     ]
    ]
   },
   "model": {
    "kind": "max-name-choice",
    "names": [
     "가",
     "나",
     "다"
    ],
    "values": [
     60,
     120,
     90
    ]
   },
   "choices": [
    "모두 같음",
    "거리로 비교 불가",
    "가",
    "나",
    "다"
   ],
   "key": 3,
   "criteria": "제시한 조건에서 「나」을 고른다. 같은 3초에 가장 먼 120cm를 간 나가 빨라요. 같은 시간이라는 조건을 함께 읽어요.",
   "figure": "motion-question-49",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   }
  },
  {
   "id": "c22-s61-u02-w050",
   "no": 50,
   "form": "blank",
   "type": "T04",
   "topic": "긴 거리",
   "prompt": "같은 시간 동안 이동한 물체는 이동 거리가 [ ]수록 더 빨라요.",
   "answer": "길",
   "explanation": "같은 단위 시간 동안 더 먼 거리를 간 물체가 더 빠르다는 뜻이에요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "accepted": [
    "길수록",
    "긴",
    "길어질"
   ],
   "criteria": "「길」 또는 명시한 동등 표현으로 답한다. 같은 단위 시간 동안 더 먼 거리를 간 물체가 더 빠르다는 뜻이에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "길",
     "길수록",
     "긴",
     "길어질"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w051",
   "no": 51,
   "form": "short",
   "type": "T04",
   "topic": "같은 시간 비교",
   "prompt": "같은 5초 동안 가는 80cm, 나는 50cm를 갔습니다. 더 빠른 수레를 쓰세요.",
   "answer": "가",
   "explanation": "5초가 같고 80cm가 50cm보다 길므로 가가 더 빨라요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "model": {
    "kind": "max-name",
    "names": [
     "가",
     "나"
    ],
    "values": [
     80,
     50
    ]
   },
   "criteria": "「가」 또는 명시한 동등 표현으로 답한다. 5초가 같고 80cm가 50cm보다 길므로 가가 더 빨라요.",
   "origin": "independently-authored-current-curriculum",
   "accepted": [
    "수레 가",
    "가 수레"
   ],
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "가",
     "수레 가",
     "가 수레"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w052",
   "no": 52,
   "form": "multi",
   "type": "T04",
   "topic": "비교할 시간의 일관성",
   "prompt": "같은 시간의 이동 거리를 비교하는 절차로 알맞은 것을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "시작 신호와 관찰 간격·거리 기준을 맞춰야 같은 시간의 자료로 비교할 수 있어요. 예측과 다른 값을 버리지 않아요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "choices": [
    "각 회차의 조건과 결과를 남긴다.",
    "시작 신호와 관찰할 시간을 정한다.",
    "두 수레의 시간을 각각 다르게 정한다.",
    "출발 위치부터 간 거리를 잰다.",
    "가장 마음에 드는 회차만 남긴다."
   ],
   "key": [
    0,
    1,
    3
   ],
   "criteria": "「각 회차의 조건과 결과를 남긴다. / 시작 신호와 관찰할 시간을 정한다. / 출발 위치부터 간 거리를 잰다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     3
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w053",
   "no": 53,
   "form": "match",
   "type": "T04",
   "topic": "거리 기록의 순서",
   "prompt": "모두 4초 동안 이동했습니다. 보기: ㄱ 가장 빠름 / ㄴ 중간 / ㄷ 가장 느림",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "같은 시간의 거리 40cm, 70cm, 100cm를 긴 순서로 비교해요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "parts": [
    "(1) 가: 70cm [ ]",
    "(2) 나: 40cm [ ]",
    "(3) 다: 100cm [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현으로 답한다. 같은 시간의 거리 40cm, 70cm, 100cm를 긴 순서로 비교해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w054",
   "no": 54,
   "form": "written",
   "type": "T04",
   "topic": "비교 시간의 차이",
   "prompt": "A는 2초 동안, B는 5초 동안 움직인 뒤의 위치 사진입니다. 더 멀리 간 B가 빠르다고 바로 말할 수 없는 까닭을 쓰세요.",
   "answer": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 평균 속력을 구해요.",
   "explanation": "긴 시간 동안 간 긴 거리가 반드시 더 빠른 움직임을 뜻하지는 않아요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "requirements": [
    "2초/5초 차이 지적",
    "거리만으로 단정 보류",
    "같은 시간 재측정 또는 속력 비교"
   ],
   "lines": 8,
   "criteria": "2초/5초 차이 지적 / 거리만으로 단정 보류 / 같은 시간 재측정 또는 속력 비교",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 평균 속력을 구해요.",
    "required": [
     "2초/5초 차이 지적",
     "거리만으로 단정 보류",
     "같은 시간 재측정 또는 속력 비교"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w055",
   "no": 55,
   "form": "choice",
   "type": "T04",
   "topic": "비교 기준 고르기",
   "prompt": "두 수레가 모두 6초 동안 움직였습니다. 빠르기를 비교할 양을 고르세요.",
   "answer": "① 6초 동안 이동한 거리",
   "explanation": "시간이 같으므로 각 수레가 그 시간에 간 거리를 비교하면 돼요. 더 긴 거리를 간 쪽이 빨라요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "choices": [
    "6초 동안 이동한 거리",
    "출발 순간의 시각만",
    "도착 순간의 위치만",
    "도착선까지 남은 거리만",
    "서로 다른 시간 동안 간 거리"
   ],
   "key": 0,
   "criteria": "제시한 조건에서 「6초 동안 이동한 거리」을 고른다. 시간이 같으므로 각 수레가 그 시간에 간 거리를 비교하면 돼요. 더 긴 거리를 간 쪽이 빨라요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   }
  },
  {
   "id": "c22-s61-u02-w056",
   "no": 56,
   "form": "blank",
   "type": "T04",
   "topic": "거리의 시작점",
   "prompt": "이동 거리는 교실 문까지 남은 거리와 구별하여 [ ] 위치부터 간 길의 길이로 재요.",
   "answer": "출발",
   "explanation": "각 수레가 어디에서 시작했는지 같은 기준으로 확인해야 실제 이동 거리를 비교할 수 있어요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "accepted": [
    "처음",
    "시작"
   ],
   "criteria": "「출발」 또는 명시한 동등 표현으로 답한다. 각 수레가 어디에서 시작했는지 같은 기준으로 확인해야 실제 이동 거리를 비교할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "출발",
     "처음",
     "시작"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w057",
   "no": 57,
   "form": "short",
   "type": "T04",
   "topic": "비교 기준과 같은 값",
   "prompt": "같은 3초에 기준 수레는 90cm를 갔습니다. 기준보다 빠른 로봇을 모두 쓰세요.",
   "answer": "나, 라",
   "explanation": "같은 3초에 90cm보다 긴 120cm와 150cm를 간 나와 라가 더 빨라요. 다는 같아요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "accepted": [
    "라, 나"
   ],
   "table": {
    "heads": [
     "로봇",
     "이동 거리(cm)"
    ],
    "rows": [
     [
      "가",
      60
     ],
     [
      "나",
      120
     ],
     [
      "다",
      90
     ],
     [
      "라",
      150
     ]
    ]
   },
   "model": {
    "kind": "above-names",
    "names": [
     "가",
     "나",
     "다",
     "라"
    ],
    "values": [
     60,
     120,
     90,
     150
    ],
    "threshold": 90
   },
   "criteria": "「나, 라」 또는 명시한 동등 표현으로 답한다. 같은 3초에 90cm보다 긴 120cm와 150cm를 간 나와 라가 더 빨라요. 다는 같아요.",
   "figure": "motion-question-57",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "unordered-label-set",
    "values": [
     "나",
     "라"
    ],
    "duplicatesAllowed": false,
    "extraLabelAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w058",
   "no": 58,
   "form": "multi",
   "type": "T04",
   "topic": "거리와 원인 구별",
   "prompt": "같은 2초 동안 빨간 수레가 100cm, 파란 수레가 80cm를 갔습니다. 타당한 설명을 모두 고르세요.",
   "answer": "③, ⑤",
   "explanation": "이 조건에서 빨간 수레가 더 빨랐다는 비교는 가능해요. 색이 원인이라거나 언제나 빠르다는 결론은 이 자료로 검증하지 않았어요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "choices": [
    "빨간색이 빠르기의 원인임을 증명했다.",
    "모든 빨간 수레는 언제나 더 빠르다.",
    "같은 시간의 이동 거리로 비교했다.",
    "파란 수레는 1초도 움직이지 않았다.",
    "이 조건에서 빨간 수레가 더 빨랐다."
   ],
   "key": [
    2,
    4
   ],
   "criteria": "「같은 시간의 이동 거리로 비교했다. / 이 조건에서 빨간 수레가 더 빨랐다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     2,
     4
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w059",
   "no": 59,
   "form": "match",
   "type": "T04",
   "topic": "관찰과 확대 해석",
   "prompt": "같은 3초 동안 가는 90cm, 나는 70cm를 갔습니다. 보기: ㄱ 제시 기록으로 확인 / ㄴ 자료가 더 필요함",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄴ",
   "explanation": "같은 시간의 이번 거리는 확인할 수 있지만 모든 운행 조건이나 색의 원인은 확인하지 않았어요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "parts": [
    "(1) 이번 3초에는 가가 나보다 더 먼 거리를 갔다. [ ]",
    "(2) 가는 어느 길에서도 항상 더 빠르다. [ ]",
    "(3) 색이 달라 빠르기가 달라졌다. [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄴ」 또는 명시한 동등 표현으로 답한다. 같은 시간의 이번 거리는 확인할 수 있지만 모든 운행 조건이나 색의 원인은 확인하지 않았어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄴ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w060",
   "no": 60,
   "form": "written",
   "type": "T04",
   "topic": "출발 위치의 차이",
   "prompt": "한 직선 길에서 A는 0m 눈금, B는 2m 눈금에서 같은 방향으로 이동했습니다. 되돌아오지 않고 3초 뒤 둘 다 5m 눈금에 있다면 이동 거리와 평균 빠르기를 비교하세요.",
   "answer": "각자 출발 위치부터 같은 한 방향으로 간 길을 재요. A는 5m, B는 3m를 갔으므로 같은 3초에는 A가 더 빨라요.",
   "explanation": "도착 위치가 같아도 출발 위치가 다르면 이동 거리가 다를 수 있어요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "model": {
    "kind": "straight-line-distances",
    "before": [
     0,
     2
    ],
    "after": [
     5,
     5
    ],
    "distance": [
     5,
     3
    ]
   },
   "requirements": [
    "각자 출발 위치 기준",
    "A5m/B3m 구별",
    "같은 3초에서 A가 빠름"
   ],
   "lines": 8,
   "criteria": "각자 출발 위치 기준 / A5m/B3m 구별 / 같은 3초에서 A가 빠름",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "각자 출발 위치부터 같은 한 방향으로 간 길을 재요. A는 5m, B는 3m를 갔으므로 같은 3초에는 A가 더 빨라요.",
    "required": [
     "각자 출발 위치 기준",
     "A5m/B3m 구별",
     "같은 3초에서 A가 빠름"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w061",
   "no": 61,
   "form": "choice",
   "type": "T04",
   "topic": "같은 시간의 빠른 순서",
   "prompt": "모두 5초 동안 이동했습니다. 빠른 것부터 나열한 것을 고르세요.",
   "answer": "③ 다, 가, 나",
   "explanation": "같은 시간의 거리 150cm, 120cm, 90cm 순서이므로 다, 가, 나예요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "table": {
    "heads": [
     "수레",
     "이동 거리(cm)"
    ],
    "rows": [
     [
      "가",
      120
     ],
     [
      "나",
      90
     ],
     [
      "다",
      150
     ]
    ]
   },
   "model": {
    "kind": "descending-choice",
    "names": [
     "가",
     "나",
     "다"
    ],
    "values": [
     120,
     90,
     150
    ]
   },
   "choices": [
    "나, 가, 다",
    "가, 다, 나",
    "다, 가, 나",
    "다, 나, 가",
    "가, 나, 다"
   ],
   "key": 2,
   "criteria": "제시한 조건에서 「다, 가, 나」을 고른다. 같은 시간의 거리 150cm, 120cm, 90cm 순서이므로 다, 가, 나예요.",
   "figure": "motion-question-61",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   }
  },
  {
   "id": "c22-s61-u02-w062",
   "no": 62,
   "form": "short",
   "type": "T04",
   "topic": "같은 빠르기 비교",
   "prompt": "같은 4초 동안 두 수레가 각각 80cm를 갔습니다. 제시 구간의 평균 빠르기는 같은가요?",
   "answer": "같다",
   "explanation": "이동 시간과 거리가 각각 같아 평균 빠르기가 같아요. 매 순간의 움직임까지 모두 같았다고 하지는 않아요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "accepted": [
    "같음",
    "평균 빠르기가 같다",
    "네",
    "예",
    "같아요",
    "평균 속력이 같다"
   ],
   "criteria": "「같다」 또는 명시한 동등 표현으로 답한다. 이동 시간과 거리가 각각 같아 평균 빠르기가 같아요. 매 순간의 움직임까지 모두 같았다고 하지는 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "같다",
     "같음",
     "평균 빠르기가 같다",
     "네",
     "예",
     "같아요",
     "평균 속력이 같다"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w063",
   "no": 63,
   "form": "written",
   "type": "T04",
   "topic": "반복 기록의 차이",
   "prompt": "같은 3초 동안 A/B가 간 거리가 1회에는 90/80cm, 2회에는 70/85cm였습니다. 한 수레가 항상 빠르다고 결론 내리기 전에 무엇을 할지 쓰세요.",
   "answer": "두 회차를 모두 남겨 결과가 달랐다고 설명해요. 시작 신호·측정 구간·수레 조작과 바닥 조건을 확인하고 같은 방법으로 더 반복해요.",
   "explanation": "원하는 한 회차만 고르지 말고 결과의 차이와 가능한 측정/조건 차이를 살펴요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "requirements": [
    "두 회차의 순위 차이 보존",
    "구체 비교 조건/측정 방법 확인",
    "같은 방법의 추가 반복과 단정 보류"
   ],
   "lines": 8,
   "criteria": "두 회차의 순위 차이 보존 / 구체 비교 조건/측정 방법 확인 / 같은 방법의 추가 반복과 단정 보류",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "두 회차를 모두 남겨 결과가 달랐다고 설명해요. 시작 신호·측정 구간·수레 조작과 바닥 조건을 확인하고 같은 방법으로 더 반복해요.",
    "required": [
     "두 회차의 순위 차이 보존",
     "구체 비교 조건/측정 방법 확인",
     "같은 방법의 추가 반복과 단정 보류"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w064",
   "no": 64,
   "form": "draw",
   "type": "T04",
   "topic": "거리 비교 기록표",
   "prompt": "두 수레가 같은 시간 동안 간 거리를 3회 재려고 합니다. 수레 이름·같은 시간·회차·거리와 단위를 남길 빈 표를 그리세요.",
   "answer": "A/B와 1~3회, 관찰 시간, 이동 거리(cm 또는 m), 조건/불분명 칸을 둬요.",
   "explanation": "관찰 전 표를 설계하는 활동이에요. 실제로 재지 않은 결과를 미리 채우지 않아요.",
   "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
   "requirements": [
    "A/B와 1~3회 구분",
    "같은 시간과 거리 단위",
    "조건/불분명과 측정 전 빈칸"
   ],
   "drawing": "large",
   "criteria": "A/B와 1~3회 구분 / 같은 시간과 거리 단위 / 조건/불분명과 측정 전 빈칸",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "A/B와 1~3회, 관찰 시간, 이동 거리(cm 또는 m), 조건/불분명 칸을 둬요.",
    "required": [
     "A/B와 1~3회 구분",
     "같은 시간과 거리 단위",
     "조건/불분명과 측정 전 빈칸"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w065",
   "no": 65,
   "form": "choice",
   "type": "T07",
   "topic": "다른 거리와 시간",
   "prompt": "한 길을 한 방향으로 움직인 두 수레입니다. 평균 속력을 바르게 비교한 것을 고르세요.",
   "answer": "④ 속력이 3m/s인 나가 빠르다.",
   "explanation": "가는 6÷3=2m/s, 나는 12÷4=3m/s예요. 거리나 시간 하나가 아니라 같은 단위 시간의 거리로 비교해요.",
   "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
   "table": {
    "heads": [
     "수레",
     "이동 거리(m)",
     "걸린 시간(s)"
    ],
    "rows": [
     [
      "가",
      6,
      3
     ],
     [
      "나",
      12,
      4
     ]
    ]
   },
   "model": {
    "kind": "speed-choice",
    "names": [
     "가",
     "나"
    ],
    "distance": [
     6,
     12
    ],
    "time": [
     3,
     4
    ]
   },
   "choices": [
    "거리가 2배이므로 속력도 2배다.",
    "거리가 짧은 가가 빠르다.",
    "시간이 짧은 가가 빠르다.",
    "속력이 3m/s인 나가 빠르다.",
    "출발 시각이 없어 비교 불가하다."
   ],
   "key": 3,
   "criteria": "제시한 조건에서 「속력이 3m/s인 나가 빠르다.」을 고른다. 가는 6÷3=2m/s, 나는 12÷4=3m/s예요. 거리나 시간 하나가 아니라 같은 단위 시간의 거리로 비교해요.",
   "figure": "motion-question-65",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   }
  },
  {
   "id": "c22-s61-u02-w066",
   "no": 66,
   "form": "blank",
   "type": "T06",
   "topic": "단위 시간의 거리",
   "prompt": "한 길을 한 방향으로 이동할 때, 이동 거리를 걸린 시간으로 나눈 양을 [ ]이라고 해요.",
   "answer": "속력",
   "explanation": "속력은 단위 시간 동안 이동한 거리를 나타내요. 같은 단위로 구하면 서로 다른 거리와 시간의 움직임도 비교할 수 있어요.",
   "misconception": "거리와 기준 시간의 단위를 함께 읽어요.",
   "criteria": "「속력」 또는 명시한 동등 표현으로 답한다. 속력은 단위 시간 동안 이동한 거리를 나타내요. 같은 단위로 구하면 서로 다른 거리와 시간의 움직임도 비교할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "속력"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w067",
   "no": 67,
   "form": "short",
   "type": "T05",
   "topic": "거리와 시간으로 구하기",
   "prompt": "한 길을 한 방향으로 12m 이동하는 데 4초가 걸렸습니다. 평균 속력을 단위와 함께 쓰세요.",
   "answer": "3m/s",
   "explanation": "12m÷4s=3m/s예요. 3만 쓰지 않고 어떤 거리와 시간의 단위인지 함께 써요.",
   "misconception": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누어요.",
   "accepted": [
    "3 m / s",
    "초속 3m",
    "1초에 3m"
   ],
   "model": {
    "kind": "speed",
    "distance": 12,
    "time": 4,
    "unit": "m/s",
    "value": 3
   },
   "criteria": "「3m/s」 또는 명시한 동등 표현으로 답한다. 12m÷4s=3m/s예요. 3만 쓰지 않고 어떤 거리와 시간의 단위인지 함께 써요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "quantity",
    "value": 3,
    "unit": "m/s",
    "unitRequired": true,
    "tolerance": 0,
    "accepted": [
     "3m/s",
     "3 m / s",
     "초속 3m",
     "1초에 3m"
    ]
   }
  },
  {
   "id": "c22-s61-u02-w068",
   "no": 68,
   "form": "multi",
   "type": "T05",
   "topic": "속력 계산의 뜻",
   "prompt": "한 길을 한 방향으로 이동한 속력에 관한 설명 중 알맞은 것을 모두 고르세요.",
   "answer": "②, ④, ⑤",
   "explanation": "이동 거리를 걸린 시간으로 나누고 거리/시간 단위를 함께 써요. 평균값으로 매 순간의 빠르기까지 같다고 확정하지는 않아요.",
   "misconception": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누어요.",
   "choices": [
    "걸린 시간을 이동 거리로 나눈다.",
    "m와 s로 계산했다면 m/s로 쓴다.",
    "평균 속력은 매 순간 반드시 같다.",
    "서로 비교할 때 단위를 확인한다.",
    "이동 거리를 걸린 시간으로 나눈다."
   ],
   "key": [
    1,
    3,
    4
   ],
   "criteria": "「m와 s로 계산했다면 m/s로 쓴다. / 서로 비교할 때 단위를 확인한다. / 이동 거리를 걸린 시간으로 나눈다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     3,
     4
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w069",
   "no": 69,
   "form": "match",
   "type": "T06",
   "topic": "속력 단위 읽기",
   "prompt": "보기: ㄱ 1초에 이동한 거리 / ㄴ 1시간에 이동한 거리 / ㄷ 거리만 나타낸 양",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "m/s와 km/h에는 거리와 기준 시간이 함께 있어요. m에는 거리 단위만 있어 속력과 구별해요.",
   "misconception": "거리와 기준 시간의 단위를 함께 읽어요.",
   "parts": [
    "(1) m/s [ ]",
    "(2) km/h [ ]",
    "(3) m [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. m/s와 km/h에는 거리와 기준 시간이 함께 있어요. m에는 거리 단위만 있어 속력과 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w070",
   "no": 70,
   "form": "written",
   "type": "T07",
   "topic": "두 자료를 같은 기준으로",
   "prompt": "한 길을 한 방향으로 가는 A는 10m를 5초에, B는 12m를 3초에 갔습니다. 더 빠른 수레와 판단 근거를 쓰세요.",
   "answer": "A는 10÷5=2m/s, B는 12÷3=4m/s이므로 B가 더 빨라요. 같은 m/s로 비교했어요.",
   "explanation": "B의 이동 거리가 더 길다는 말만으로 끝내지 말고 각 거리와 시간을 모두 사용해요.",
   "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
   "model": {
    "kind": "two-ratios",
    "distance": [
     10,
     12
    ],
    "time": [
     5,
     3
    ],
    "values": [
     2,
     4
    ]
   },
   "requirements": [
    "A2m/s와 B4m/s 계산",
    "B가 더 빠름",
    "같은 속력 단위로 비교"
   ],
   "lines": 8,
   "criteria": "A2m/s와 B4m/s 계산 / B가 더 빠름 / 같은 속력 단위로 비교",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "A는 10÷5=2m/s, B는 12÷3=4m/s이므로 B가 더 빨라요. 같은 m/s로 비교했어요.",
    "required": [
     "A2m/s와 B4m/s 계산",
     "B가 더 빠름",
     "같은 속력 단위로 비교"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w071",
   "no": 71,
   "form": "choice",
   "type": "T06",
   "topic": "속력의 의미",
   "prompt": "한 구간의 평균 속력이 2m/s였습니다. 이 값의 뜻을 가장 알맞게 설명한 것을 고르세요.",
   "answer": "⑤ 구간 평균으로 1초당 2m인 셈이다.",
   "explanation": "그 구간의 이동 거리를 걸린 시간으로 나누면 1초당 2m라는 뜻이에요. 매 순간의 빠르기나 실제 전체 이동 시간이 1초였다는 뜻은 아니에요.",
   "misconception": "거리와 기준 시간의 단위를 함께 읽어요.",
   "choices": [
    "전체 이동 시간은 반드시 1초이다.",
    "매 순간의 빠르기는 모두 일정하다.",
    "몇 초든 이동 거리는 항상 2m이다.",
    "전체 이동 거리는 반드시 2m이다.",
    "구간 평균으로 1초당 2m인 셈이다."
   ],
   "key": 4,
   "criteria": "제시한 조건에서 「구간 평균으로 1초당 2m인 셈이다.」을 고른다. 그 구간의 이동 거리를 걸린 시간으로 나누면 1초당 2m라는 뜻이에요. 매 순간의 빠르기나 실제 전체 이동 시간이 1초였다는 뜻은 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   }
  },
  {
   "id": "c22-s61-u02-w072",
   "no": 72,
   "form": "blank",
   "type": "T05",
   "topic": "계산에 쓰는 시간",
   "prompt": "평균 속력은 이동 거리를 그 구간을 이동하는 데 걸린 [ ]으로 나누어 구해요.",
   "answer": "시간",
   "explanation": "거리를 나누는 것은 관찰 시계의 시각 자체가 아니라 출발부터 도착까지 걸린 시간이에요.",
   "misconception": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누어요.",
   "criteria": "「시간」 또는 명시한 동등 표현으로 답한다. 거리를 나누는 것은 관찰 시계의 시각 자체가 아니라 출발부터 도착까지 걸린 시간이에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "시간"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w073",
   "no": 73,
   "form": "short",
   "type": "T05",
   "topic": "소수로 나타내기",
   "prompt": "한 길을 한 방향으로 1.5m를 3초에 간 수레의 평균 속력을 단위와 함께 쓰세요. 계산기를 써도 됩니다.",
   "answer": "0.5m/s",
   "explanation": "1.5÷3=0.5이므로 0.5m/s예요. 0.50m/s도 같은 값을 나타내요.",
   "misconception": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누어요.",
   "accepted": [
    "0.50m/s",
    "0.5 m / s",
    "초속 0.5m",
    "1초에 0.5m"
   ],
   "model": {
    "kind": "speed",
    "distance": 1.5,
    "time": 3,
    "unit": "m/s",
    "value": 0.5
   },
   "criteria": "「0.5m/s」 또는 명시한 동등 표현으로 답한다. 1.5÷3=0.5이므로 0.5m/s예요. 0.50m/s도 같은 값을 나타내요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "quantity",
    "value": 0.5,
    "unit": "m/s",
    "unitRequired": true,
    "tolerance": 0,
    "accepted": [
     "0.5m/s",
     "0.50m/s",
     "0.5 m / s",
     "초속 0.5m",
     "1초에 0.5m"
    ]
   }
  },
  {
   "id": "c22-s61-u02-w074",
   "no": 74,
   "form": "multi",
   "type": "T07",
   "topic": "계산 결과의 범위",
   "prompt": "A와 B가 한 길을 한 방향으로 간 구간의 평균 속력은 각각 2m/s와 3m/s입니다. 타당한 설명을 모두 고르세요.",
   "answer": "①, ③",
   "explanation": "같은 단위의 구간 평균 속력으로 B가 더 빠르다고 비교할 수 있어요. 이 값만으로 전체 거리·시간·모든 순간의 움직임을 정할 수는 없어요.",
   "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
   "choices": [
    "두 값을 같은 m/s로 비교할 수 있다.",
    "A와 B는 매 순간 일정한 속력이다.",
    "제시 구간의 평균은 B가 더 빠르다.",
    "B의 전체 이동 거리는 반드시 더 길다.",
    "B의 전체 이동 시간은 반드시 더 짧다."
   ],
   "key": [
    0,
    2
   ],
   "criteria": "「두 값을 같은 m/s로 비교할 수 있다. / 제시 구간의 평균은 B가 더 빠르다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w075",
   "no": 75,
   "form": "written",
   "type": "T06",
   "topic": "빗금이 있는 단위",
   "prompt": "40m/s를 보고 “40ms라고 써도 빗금을 뺐을 뿐이라 같다”고 했습니다. 단위를 왜 그대로 써야 하는지 설명하세요.",
   "answer": "m/s는 미터를 초로 나눈 속력 단위예요. 빗금을 빼면 거리와 시간의 나눗셈 뜻이 사라지므로 40m/s로 고쳐 써요.",
   "explanation": "숫자 40이 같아도 물리량의 단위까지 같아야 같은 속력 표현이에요.",
   "misconception": "거리와 기준 시간의 단위를 함께 읽어요.",
   "requirements": [
    "40m/s로 수정",
    "미터/초의 나눗셈 뜻",
    "40ms를 같은 속력 답으로 인정하지 않음"
   ],
   "lines": 8,
   "criteria": "40m/s로 수정 / 미터/초의 나눗셈 뜻 / 40ms를 같은 속력 답으로 인정하지 않음",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "m/s는 미터를 초로 나눈 속력 단위예요. 빗금을 빼면 거리와 시간의 나눗셈 뜻이 사라지므로 40m/s로 고쳐 써요.",
    "required": [
     "40m/s로 수정",
     "미터/초의 나눗셈 뜻",
     "40ms를 같은 속력 답으로 인정하지 않음"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w076",
   "no": 76,
   "form": "written",
   "type": "T05",
   "topic": "평균과 매 순간",
   "prompt": "수레가 한 방향으로 8m를 4초에 갔습니다. 친구는 “속력이 2m/s니까 매초 정확히 2m씩 갔다”고 말합니다. 확인한 것과 더 필요한 것을 쓰세요.",
   "answer": "8÷4=2m/s는 전체 구간의 평균이에요. 매초 같은 거리를 갔는지 알려면 각 1초 구간의 위치나 거리를 더 관찰해야 해요.",
   "explanation": "평균 속력이 같더라도 중간에 빨라지거나 느려질 수 있어요.",
   "misconception": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누어요.",
   "model": {
    "kind": "speed",
    "distance": 8,
    "time": 4,
    "unit": "m/s",
    "value": 2
   },
   "requirements": [
    "전체 평균2m/s 계산",
    "매초2m 단정 보류",
    "1초 간격의 위치/거리 자료 요구"
   ],
   "lines": 8,
   "criteria": "전체 평균2m/s 계산 / 매초2m 단정 보류 / 1초 간격의 위치/거리 자료 요구",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "8÷4=2m/s는 전체 구간의 평균이에요. 매초 같은 거리를 갔는지 알려면 각 1초 구간의 위치나 거리를 더 관찰해야 해요.",
    "required": [
     "전체 평균2m/s 계산",
     "매초2m 단정 보류",
     "1초 간격의 위치/거리 자료 요구"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w077",
   "no": 77,
   "form": "choice",
   "type": "T07",
   "topic": "같은 단위로 비교",
   "prompt": "한 길을 한 방향으로 움직인 로봇의 평균 속력입니다. 가장 빠른 로봇을 고르세요.",
   "answer": "② 다",
   "explanation": "모두 m/s로 표시되어 수가 가장 큰 1.2m/s의 다가 가장 빨라요. 0.5m/s의 라는 0.50m/s로 써도 같은 값이에요.",
   "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
   "table": {
    "heads": [
     "로봇",
     "평균 속력(m/s)"
    ],
    "rows": [
     [
      "가",
      0.8
     ],
     [
      "나",
      1
     ],
     [
      "다",
      1.2
     ],
     [
      "라",
      0.5
     ]
    ]
   },
   "model": {
    "kind": "max-name-choice",
    "names": [
     "가",
     "나",
     "다",
     "라"
    ],
    "values": [
     0.8,
     1,
     1.2,
     0.5
    ]
   },
   "choices": [
    "나",
    "다",
    "라",
    "모두 같음",
    "가"
   ],
   "key": 1,
   "criteria": "제시한 조건에서 「다」을 고른다. 모두 m/s로 표시되어 수가 가장 큰 1.2m/s의 다가 가장 빨라요. 0.5m/s의 라는 0.50m/s로 써도 같은 값이에요.",
   "figure": "motion-question-77",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   }
  },
  {
   "id": "c22-s61-u02-w078",
   "no": 78,
   "form": "order",
   "type": "T05",
   "topic": "값을 구하고 확인하기",
   "prompt": "한 길을 한 방향으로 이동하는 수레의 평균 속력을 구하는 절차를 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
   "explanation": "측정 구간을 정한 다음 거리/시간을 실제로 재고 나누어요. 마지막에는 단위와 기록·비교 조건이 맞는지 확인해요.",
   "misconception": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누어요.",
   "given": [
    "ㄱ 이동 거리와 걸린 시간을 잰다.",
    "ㄴ 단위와 측정 기록을 대조한다.",
    "ㄷ 출발/도착과 기준 부분을 정한다.",
    "ㄹ 거리를 시간으로 나누고 단위를 쓴다."
   ],
   "criteria": "「ㄷ → ㄱ → ㄹ → ㄴ」 또는 명시한 동등 표현으로 답한다. 측정 구간을 정한 다음 거리/시간을 실제로 재고 나누어요. 마지막에는 단위와 기록·비교 조건이 맞는지 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-sequence",
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄹ",
     "ㄴ"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w079",
   "no": 79,
   "form": "written",
   "type": "T07",
   "topic": "정량적으로 전달하기",
   "prompt": "A가 더 빠르다고만 적은 설명을 보완하려고 합니다. 한 방향 이동 자료가 A 9m/3초, B 8m/4초일 때 비교 문장을 쓰세요.",
   "answer": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
   "explanation": "빠른 대상·각 속력·단위·관찰 구간을 함께 전달하면 다른 사람이 근거를 확인할 수 있어요.",
   "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
   "model": {
    "kind": "two-ratios",
    "distance": [
     9,
     8
    ],
    "time": [
     3,
     4
    ],
    "values": [
     3,
     2
    ]
   },
   "requirements": [
    "A3m/s와 B2m/s",
    "A가 빠름",
    "제시 구간/한 방향과 같은 단위 명시"
   ],
   "lines": 8,
   "criteria": "A3m/s와 B2m/s / A가 빠름 / 제시 구간/한 방향과 같은 단위 명시",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
    "required": [
     "A3m/s와 B2m/s",
     "A가 빠름",
     "제시 구간/한 방향과 같은 단위 명시"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w080",
   "no": 80,
   "form": "draw",
   "type": "T07",
   "topic": "비교 자료로 표현하기",
   "prompt": "한 방향 이동 자료 A 6m/3초, B 8m/4초를 읽기 쉬운 표나 막대그래프로 표현하세요. 이름·단위·속력을 구한 근거를 포함하세요.",
   "answer": "A와 B의 평균 속력은 모두 2m/s예요. 표는 거리/시간/속력 머리와 단위를 쓰고, 그래프는 A/B 이름과 속력 축(m/s)을 표시해 같은 높이로 나타내요.",
   "explanation": "표나 그래프 중 타당한 표현을 인정해요. 두 점 좌표 사이 거리를 구하는 과제가 아니에요.",
   "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
   "model": {
    "kind": "two-ratios",
    "distance": [
     6,
     8
    ],
    "time": [
     3,
     4
    ],
    "values": [
     2,
     2
    ]
   },
   "requirements": [
    "A/B를 구별한 표 또는 막대그래프",
    "두 속력2m/s와 단위",
    "6÷3과8÷4의 근거"
   ],
   "drawing": "large",
   "criteria": "A/B를 구별한 표 또는 막대그래프 / 두 속력2m/s와 단위 / 6÷3과8÷4의 근거",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "A와 B의 평균 속력은 모두 2m/s예요. 표는 거리/시간/속력 머리와 단위를 쓰고, 그래프는 A/B 이름과 속력 축(m/s)을 표시해 같은 높이로 나타내요.",
    "required": [
     "A/B를 구별한 표 또는 막대그래프",
     "두 속력2m/s와 단위",
     "6÷3과8÷4의 근거"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w081",
   "no": 81,
   "form": "choice",
   "type": "T12",
   "topic": "측정 장소 정하기",
   "prompt": "교사가 준비한 작은 수레로 거리와 시간을 재려고 합니다. 가장 알맞은 준비를 고르세요.",
   "answer": "④ 통행을 막은 평평한 실내 길을 비운다.",
   "explanation": "사람이 지나지 않는 실내의 낮고 평평한 길을 정하고 주변을 비워요. 친구나 자동차와 경주하는 조건은 필요하지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "choices": [
    "계단 위에서 빠르게 내려보낸다.",
    "차도에서 자동차를 따라가며 잰다.",
    "사람이 많은 길에서 먼저 밀어본다.",
    "통행을 막은 평평한 실내 길을 비운다.",
    "통행하는 복도에서 친구와 빠르기를 겨룬다."
   ],
   "key": 3,
   "criteria": "제시한 조건에서 「통행을 막은 평평한 실내 길을 비운다.」을 고른다. 사람이 지나지 않는 실내의 낮고 평평한 길을 정하고 주변을 비워요. 친구나 자동차와 경주하는 조건은 필요하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   }
  },
  {
   "id": "c22-s61-u02-w082",
   "no": 82,
   "form": "blank",
   "type": "T12",
   "topic": "거리 단위의 기록",
   "prompt": "거리를 120이라고만 적으면 뜻이 불분명해요. 120cm처럼 수와 함께 [ ]를 써야 해요.",
   "answer": "단위",
   "explanation": "cm인지 m인지에 따라 나타내는 길이가 달라요. 시간도 초 등 단위를 함께 기록해요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "criteria": "「단위」 또는 명시한 동등 표현으로 답한다. cm인지 m인지에 따라 나타내는 길이가 달라요. 시간도 초 등 단위를 함께 기록해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "단위"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w083",
   "no": 83,
   "form": "short",
   "type": "T12",
   "topic": "연습 자료와 실제 측정",
   "prompt": "다음은 계산 연습용 기록입니다. 한 방향으로 2m를 4초에 갔다면 평균 속력은 얼마인가요? 단위도 쓰세요.",
   "answer": "0.5m/s",
   "explanation": "2÷4=0.5m/s예요. 이 기록은 제공된 연습값이며 내가 실제로 잰 결과로 적지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "accepted": [
    "0.50m/s",
    "초속 0.5m",
    "1초에 0.5m"
   ],
   "model": {
    "kind": "speed",
    "distance": 2,
    "time": 4,
    "unit": "m/s",
    "value": 0.5
   },
   "criteria": "「0.5m/s」 또는 명시한 동등 표현으로 답한다. 2÷4=0.5m/s예요. 이 기록은 제공된 연습값이며 내가 실제로 잰 결과로 적지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "quantity",
    "value": 0.5,
    "unit": "m/s",
    "unitRequired": true,
    "tolerance": 0,
    "accepted": [
     "0.5m/s",
     "0.50m/s",
     "초속 0.5m",
     "1초에 0.5m"
    ]
   }
  },
  {
   "id": "c22-s61-u02-w084",
   "no": 84,
   "form": "multi",
   "type": "T12",
   "topic": "공정한 측정 규칙",
   "prompt": "실제 측정에서 지킬 방법을 모두 고르세요.",
   "answer": "②, ③, ④",
   "explanation": "물체의 같은 부분과 시작/끝 규칙을 정하고 같은 방법으로 반복해요. 잘 못 본 값은 불분명하다고 남겨 재요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "choices": [
    "한 번 못 본 값은 예상 숫자로 채운다.",
    "같은 방법으로 반복하고 차이를 남긴다.",
    "수레의 같은 부분으로 선 통과를 판단한다.",
    "거리와 시간의 시작/끝 규칙을 정한다.",
    "원하는 순위가 나오게 시간을 고친다."
   ],
   "key": [
    1,
    2,
    3
   ],
   "criteria": "「같은 방법으로 반복하고 차이를 남긴다. / 수레의 같은 부분으로 선 통과를 판단한다. / 거리와 시간의 시작/끝 규칙을 정한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     2,
     3
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w085",
   "no": 85,
   "form": "match",
   "type": "T12",
   "topic": "기록의 종류",
   "prompt": "보기: ㄱ 직접 확인한 측정 / ㄴ 결과의 해석 / ㄷ 아직 측정하지 않음",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "기기로 읽은 값과 그 값에 관한 설명, 앞으로 할 일을 구별해요. 예정된 측정을 이미 끝난 기록으로 바꾸지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "parts": [
    "(1) 1회에 줄자로 읽은 거리는 1m였다. [ ]",
    "(2) 출발 신호 차이가 기록에 영향을 주었을 수 있다. [ ]",
    "(3) 다음 시간에 3회째를 재려고 한다. [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. 기기로 읽은 값과 그 값에 관한 설명, 앞으로 할 일을 구별해요. 예정된 측정을 이미 끝난 기록으로 바꾸지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w086",
   "no": 86,
   "form": "written",
   "type": "T12",
   "topic": "우리 모둠의 측정 계획",
   "prompt": "안전한 실내에서 작은 수레가 한 길을 한 방향으로 이동할 때의 평균 속력을 재는 계획을 쓰세요. 아직 재지 않은 숫자를 결과로 쓰지는 마세요.",
   "answer": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
   "explanation": "구간·도구·기준 부분·기록·반복·안전이 있어야 다른 사람이 같은 방법을 따라 할 수 있어요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "requirements": [
    "비운 평평한 실내와 길 밖 관찰",
    "출발/도착과 같은 기준 부분",
    "줄자/초시계 등 도구와 거리/시간 단위",
    "3회 반복과 불분명/미측정 보존"
   ],
   "lines": 8,
   "criteria": "비운 평평한 실내와 길 밖 관찰 / 출발/도착과 같은 기준 부분 / 줄자/초시계 등 도구와 거리/시간 단위 / 3회 반복과 불분명/미측정 보존",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
    "required": [
     "비운 평평한 실내와 길 밖 관찰",
     "출발/도착과 같은 기준 부분",
     "줄자/초시계 등 도구와 거리/시간 단위",
     "3회 반복과 불분명/미측정 보존"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w087",
   "no": 87,
   "form": "choice",
   "type": "T12",
   "topic": "시계 시작의 차이",
   "prompt": "거리 1m를 재는데 A는 수레가 출발선을 지날 때, B는 구호를 들은 뒤 한참 지나 시계를 시작했습니다. 우선 고칠 점을 고르세요.",
   "answer": "② 시작 기준을 맞추어 다시 측정한다.",
   "explanation": "시작 순간이 다르면 같은 구간의 시간을 비교하기 어려워요. 같은 부분이 출발선을 지나는 순간으로 맞추고 다시 재요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "choices": [
    "짧은 시간만 골라 최종 기록으로 쓴다.",
    "시작 기준을 맞추어 다시 측정한다.",
    "두 시간의 단위를 모두 m로 바꾼다.",
    "B의 값에 임의로 1초를 더해 고친다.",
    "수레 색이 원인이라고 결론을 쓴다."
   ],
   "key": 1,
   "criteria": "제시한 조건에서 「시작 기준을 맞추어 다시 측정한다.」을 고른다. 시작 순간이 다르면 같은 구간의 시간을 비교하기 어려워요. 같은 부분이 출발선을 지나는 순간으로 맞추고 다시 재요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   }
  },
  {
   "id": "c22-s61-u02-w088",
   "no": 88,
   "form": "blank",
   "type": "T12",
   "topic": "한 번의 값만 쓰지 않기",
   "prompt": "측정의 차이를 살피기 위해 같은 방법으로 여러 번 [ ] 측정해요.",
   "answer": "반복",
   "explanation": "반복한 값과 조건을 함께 보면 우연한 차이나 관찰의 어려움을 더 살필 수 있어요. 다른 값을 숨기는 과정이 아니에요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "accepted": [
    "반복하여",
    "되풀이하여"
   ],
   "criteria": "「반복」 또는 명시한 동등 표현으로 답한다. 반복한 값과 조건을 함께 보면 우연한 차이나 관찰의 어려움을 더 살필 수 있어요. 다른 값을 숨기는 과정이 아니에요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "반복",
     "반복하여",
     "되풀이하여"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w089",
   "no": 89,
   "form": "short",
   "type": "T12",
   "topic": "불분명한 회차 남기기",
   "prompt": "연습용 기록표에서 수치가 실제로 읽혀 적힌 회차는 몇 개인가요? “불분명”이나 “미측정”은 수치 기록 수에 넣지 마세요.",
   "answer": "2개",
   "explanation": "1회와 3회에 수치가 있고 2회는 불분명, 4회는 미측정이에요. 빈 결과를 예상 숫자로 채우지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "accepted": [
    "2",
    "두 개",
    "2회"
   ],
   "table": {
    "heads": [
     "회차",
     "1m 이동 시간"
    ],
    "rows": [
     [
      "1회",
      "2.1초"
     ],
     [
      "2회",
      "불분명"
     ],
     [
      "3회",
      "2.3초"
     ],
     [
      "4회",
      "미측정"
     ]
    ]
   },
   "model": {
    "kind": "measured-count",
    "states": [
     "measured",
     "unclear",
     "measured",
     "not-measured"
    ],
    "value": 2
   },
   "criteria": "「2개」 또는 명시한 동등 표현으로 답한다. 1회와 3회에 수치가 있고 2회는 불분명, 4회는 미측정이에요. 빈 결과를 예상 숫자로 채우지 않아요.",
   "figure": "motion-question-89",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "2개",
     "2",
     "두 개",
     "2회"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w090",
   "no": 90,
   "form": "multi",
   "type": "T12",
   "topic": "원래 기록을 보존하기",
   "prompt": "예상과 다른 값이 나왔을 때 알맞은 행동을 모두 고르세요.",
   "answer": "②, ③, ⑤",
   "explanation": "원래 값을 보존하고 측정 조건·어려움을 남겨 같은 방법으로 확인해요. 원하는 값으로 바꾸거나 다른 결과를 숨기지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "choices": [
    "예상에 가까운 값으로 조용히 바꾼다.",
    "처음 읽은 값과 단위를 그대로 남긴다.",
    "잘 못 본 순간은 불분명하다고 적는다.",
    "순위가 다른 회차를 기록에서 지운다.",
    "조건을 확인하고 다시 측정한다."
   ],
   "key": [
    1,
    2,
    4
   ],
   "criteria": "「처음 읽은 값과 단위를 그대로 남긴다. / 잘 못 본 순간은 불분명하다고 적는다. / 조건을 확인하고 다시 측정한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     2,
     4
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w091",
   "no": 91,
   "form": "written",
   "type": "T12",
   "topic": "기기 눈금과 표현",
   "prompt": "0.1초 단위로 읽는 초시계에 2.3초가 보였습니다. 친구가 2.30000초로 기록하며 더 정확하다고 했습니다. 기록과 설명을 고쳐 보세요.",
   "answer": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
   "explanation": "표시된 숫자와 측정의 정확성은 구별해요. 기기나 관찰이 확인하지 못한 정밀함을 숫자로 꾸미지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "requirements": [
    "실제 표시2.3초 보존",
    "0 추가만으로 정밀해지지 않음",
    "시작/정지의 차이와 반복 필요"
   ],
   "lines": 8,
   "criteria": "실제 표시2.3초 보존 / 0 추가만으로 정밀해지지 않음 / 시작/정지의 차이와 반복 필요",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
    "required": [
     "실제 표시2.3초 보존",
     "0 추가만으로 정밀해지지 않음",
     "시작/정지의 차이와 반복 필요"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w092",
   "no": 92,
   "form": "written",
   "type": "T12",
   "topic": "측정을 못 마친 경우",
   "prompt": "오늘은 도구 준비만 했고 수레의 거리와 시간은 아직 재지 못했습니다. 활동지의 결과 칸과 다음 행동을 어떻게 남길지 쓰세요.",
   "answer": "결과 칸은 미측정이라고 남기고 준비한 도구와 계획을 구별해 써요. 교사와 안전한 길·시작/끝 규칙을 확인한 뒤 다음 시간에 실제로 재요.",
   "explanation": "준비 완료는 측정 완료가 아니에요. 예시 값이나 예상 숫자를 실제 결과로 옮기지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "requirements": [
    "거리/시간 미측정 명시",
    "준비/계획과 결과의 구별",
    "다음 실제 측정의 구체 방법"
   ],
   "lines": 8,
   "criteria": "거리/시간 미측정 명시 / 준비/계획과 결과의 구별 / 다음 실제 측정의 구체 방법",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "결과 칸은 미측정이라고 남기고 준비한 도구와 계획을 구별해 써요. 교사와 안전한 길·시작/끝 규칙을 확인한 뒤 다음 시간에 실제로 재요.",
    "required": [
     "거리/시간 미측정 명시",
     "준비/계획과 결과의 구별",
     "다음 실제 측정의 구체 방법"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w093",
   "no": 93,
   "form": "choice",
   "type": "T12",
   "topic": "계산기와 단위 확인",
   "prompt": "한 방향 이동 1.2m와 3초를 계산기에 넣었습니다. 평균 속력 기록으로 알맞은 것을 고르세요.",
   "answer": "③ 0.4m/s",
   "explanation": "1.2÷3=0.4이며 m를 s로 나누므로 0.4m/s예요. 계산기를 써도 나누는 순서와 단위를 확인해야 해요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "model": {
    "kind": "speed-choice-value",
    "distance": 1.2,
    "time": 3,
    "value": 0.4,
    "unit": "m/s"
   },
   "choices": [
    "0.4s",
    "2.5m/s",
    "0.4m/s",
    "3.6m/s",
    "0.4m"
   ],
   "key": 2,
   "criteria": "제시한 조건에서 「0.4m/s」을 고른다. 1.2÷3=0.4이며 m를 s로 나누므로 0.4m/s예요. 계산기를 써도 나누는 순서와 단위를 확인해야 해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   }
  },
  {
   "id": "c22-s61-u02-w094",
   "no": 94,
   "form": "order",
   "type": "T12",
   "topic": "실제 측정 순서",
   "prompt": "거리와 시간의 실제 측정 활동을 순서대로 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "안전과 규칙을 먼저 확인하고 실제 값을 읽어 기록해요. 반복한 뒤 결과와 조건을 비교해요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "given": [
    "ㄱ 거리/시간을 재고 단위와 어려움을 기록한다.",
    "ㄴ 장소 안전과 출발/도착·기준 부분을 정한다.",
    "ㄷ 도구를 놓고 길 밖에 관찰 위치를 잡는다.",
    "ㄹ 같은 방법으로 반복하고 기록을 비교한다."
   ],
   "criteria": "「ㄴ → ㄷ → ㄱ → ㄹ」 또는 명시한 동등 표현으로 답한다. 안전과 규칙을 먼저 확인하고 실제 값을 읽어 기록해요. 반복한 뒤 결과와 조건을 비교해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ",
     "ㄹ"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w095",
   "no": 95,
   "form": "written",
   "type": "T12",
   "topic": "제공 자료의 사용",
   "prompt": "책의 연습표로 속력을 구한 뒤 “우리 모둠이 직접 측정한 결과”라고 적었습니다. 무엇을 고쳐야 할까요?",
   "answer": "책에서 제공한 연습 자료로 계산했다고 고쳐 써요. 우리 모둠의 실제 측정은 따로 수행하고 거리/시간·조건·회차를 기록하며 아직 하지 않았다면 미측정으로 남겨요.",
   "explanation": "계산을 직접 했다는 사실과 거리/시간을 실제로 측정했다는 사실은 달라요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "requirements": [
    "제공된 연습 자료임을 명시",
    "직접 계산과 실제 측정의 구별",
    "별도 실제 측정 또는 미측정 상태"
   ],
   "lines": 8,
   "criteria": "제공된 연습 자료임을 명시 / 직접 계산과 실제 측정의 구별 / 별도 실제 측정 또는 미측정 상태",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "책에서 제공한 연습 자료로 계산했다고 고쳐 써요. 우리 모둠의 실제 측정은 따로 수행하고 거리/시간·조건·회차를 기록하며 아직 하지 않았다면 미측정으로 남겨요.",
    "required": [
     "제공된 연습 자료임을 명시",
     "직접 계산과 실제 측정의 구별",
     "별도 실제 측정 또는 미측정 상태"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w096",
   "no": 96,
   "form": "draw",
   "type": "T12",
   "topic": "우리 측정 기록 설계",
   "prompt": "작은 수레의 평균 속력을 실제로 재기 위한 빈 기록표를 그리세요. 3회 측정과 불분명/미측정 상태, 조건을 남길 곳을 포함하세요.",
   "answer": "1~3회마다 이동 거리(m), 걸린 시간(s), 평균 속력(m/s) 칸을 두고 출발/도착·기준 부분·도구·바닥/어려움 칸을 마련해요. 재기 전 숫자는 비워 둬요.",
   "explanation": "활동 전 기록 도구를 설계하는 과제예요. 실제 측정을 하지 않은 상태에서 가상 결과를 채우지 않아요.",
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "requirements": [
    "3회와 거리/시간/속력 단위",
    "같은 기준 부분·구간·도구/조건",
    "불분명/미측정 상태와 빈 결과 칸"
   ],
   "drawing": "large",
   "criteria": "3회와 거리/시간/속력 단위 / 같은 기준 부분·구간·도구/조건 / 불분명/미측정 상태와 빈 결과 칸",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "1~3회마다 이동 거리(m), 걸린 시간(s), 평균 속력(m/s) 칸을 두고 출발/도착·기준 부분·도구·바닥/어려움 칸을 마련해요. 재기 전 숫자는 비워 둬요.",
    "required": [
     "3회와 거리/시간/속력 단위",
     "같은 기준 부분·구간·도구/조건",
     "불분명/미측정 상태와 빈 결과 칸"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w097",
   "no": 97,
   "form": "choice",
   "type": "T08",
   "topic": "안전장치의 역할",
   "prompt": "차 안에서 몸이 크게 쏠리는 것을 줄이도록 탑승자를 잡아 주는 장치를 고르세요.",
   "answer": "① 안전띠",
   "explanation": "안전띠는 탑승자를 좌석에 잡아 주는 보호 장치예요. 도로의 감속 유도 장치나 운전자에게 정보를 주는 시설과 구별해요.",
   "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
   "choices": [
    "안전띠",
    "횡단보도 신호등",
    "속도 제한 표지",
    "과속 방지 턱",
    "도로 반사경"
   ],
   "key": 0,
   "criteria": "제시한 조건에서 「안전띠」을 고른다. 안전띠는 탑승자를 좌석에 잡아 주는 보호 장치예요. 도로의 감속 유도 장치나 운전자에게 정보를 주는 시설과 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   }
  },
  {
   "id": "c22-s61-u02-w098",
   "no": 98,
   "form": "blank",
   "type": "T08",
   "topic": "탑승자 보호 장치",
   "prompt": "급정지나 충돌 때 몸이 크게 움직이는 것을 줄이기 위해 몸에 바르게 매는 장치는 [ ]예요.",
   "answer": "안전띠",
   "explanation": "안전띠는 탑승자 보호를 위한 장치예요. 에어백이 있어도 안전띠를 대신하지는 않아요.",
   "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
   "accepted": [
    "안전벨트"
   ],
   "criteria": "「안전띠」 또는 명시한 동등 표현으로 답한다. 안전띠는 탑승자 보호를 위한 장치예요. 에어백이 있어도 안전띠를 대신하지는 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "안전띠",
     "안전벨트"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w099",
   "no": 99,
   "form": "short",
   "type": "T08",
   "topic": "도로 장치의 목적",
   "prompt": "도로에 설치한 과속 방지 턱은 운전자의 어떤 행동을 유도하려는 장치인가요?",
   "answer": "속력을 줄이는 행동",
   "explanation": "운전자가 해당 구간의 속력을 낮추도록 유도하는 장치예요. 안전띠처럼 사람의 몸에 매는 장치와 구별해요.",
   "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
   "accepted": [
    "감속",
    "속력 줄이기",
    "속도를 줄인다",
    "천천히 운전하기",
    "속력을 줄인다",
    "속력을 낮춘다",
    "감속하기",
    "속도를 줄이는 행동"
   ],
   "criteria": "「속력을 줄이는 행동」 또는 명시한 동등 표현으로 답한다. 운전자가 해당 구간의 속력을 낮추도록 유도하는 장치예요. 안전띠처럼 사람의 몸에 매는 장치와 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "속력을 줄이는 행동",
     "감속",
     "속력 줄이기",
     "속도를 줄인다",
     "천천히 운전하기",
     "속력을 줄인다",
     "속력을 낮춘다",
     "감속하기",
     "속도를 줄이는 행동"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w100",
   "no": 100,
   "form": "multi",
   "type": "T08",
   "topic": "역할이 맞는 설명",
   "prompt": "안전장치와 시설의 역할을 바르게 연결한 것을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "안전띠는 몸을 잡아 주고 에어백은 충돌 시 탑승자 보호를 보조해요. 과속 방지 턱은 감속을 유도해요. 어느 하나가 다른 모든 안전 행동을 대신하지는 않아요.",
   "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
   "choices": [
    "안전띠: 몸이 크게 쏠리는 것을 줄인다.",
    "도로 반사경: 탑승자의 몸을 좌석에 잡아 준다.",
    "에어백: 안전띠와 함께 탑승자 보호를 돕는다.",
    "과속 방지 턱: 운전자의 감속을 유도한다.",
    "횡단보도 신호: 모든 차량의 정지를 보장한다."
   ],
   "key": [
    0,
    2,
    3
   ],
   "criteria": "「안전띠: 몸이 크게 쏠리는 것을 줄인다. / 에어백: 안전띠와 함께 탑승자 보호를 돕는다. / 과속 방지 턱: 운전자의 감속을 유도한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2,
     3
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w101",
   "no": 101,
   "form": "match",
   "type": "T08",
   "topic": "설치 장소와 기능",
   "prompt": "보기: ㄱ 몸을 좌석에 잡아 줌 / ㄴ 충돌 때 탑승자 보호를 보조함 / ㄷ 도로에서 감속을 유도함",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "장치 이름을 외우는 데서 끝내지 않고 누구에게 어떤 도움을 주는지 구별해요. 에어백은 안전띠를 대체하지 않아요.",
   "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
   "parts": [
    "(1) 안전띠 [ ]",
    "(2) 에어백 [ ]",
    "(3) 과속 방지 턱 [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. 장치 이름을 외우는 데서 끝내지 않고 누구에게 어떤 도움을 주는지 구별해요. 에어백은 안전띠를 대체하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w102",
   "no": 102,
   "form": "written",
   "type": "T08",
   "topic": "장치 하나로 충분할까",
   "prompt": "“에어백이 있으니 안전띠를 매지 않아도 된다”는 말을 고쳐 쓰고 두 장치의 관계를 설명하세요.",
   "answer": "에어백이 있어도 안전띠를 바르게 매야 해요. 안전띠가 몸을 잡아 주고 에어백은 함께 탑승자 보호를 도우므로 안전띠를 대신하지 않아요.",
   "explanation": "두 장치는 함께 작동하도록 마련된 보호 수단이에요. 장치가 있다는 이유로 안전 행동을 생략하지 않아요.",
   "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
   "requirements": [
    "안전띠 착용 필요",
    "몸을 잡는 안전띠의 역할",
    "에어백은 보조이며 대체가 아님"
   ],
   "lines": 8,
   "criteria": "안전띠 착용 필요 / 몸을 잡는 안전띠의 역할 / 에어백은 보조이며 대체가 아님",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "에어백이 있어도 안전띠를 바르게 매야 해요. 안전띠가 몸을 잡아 주고 에어백은 함께 탑승자 보호를 도우므로 안전띠를 대신하지 않아요.",
    "required": [
     "안전띠 착용 필요",
     "몸을 잡는 안전띠의 역할",
     "에어백은 보조이며 대체가 아님"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w103",
   "no": 103,
   "form": "choice",
   "type": "T09",
   "topic": "신호가 바뀐 순간",
   "prompt": "보행 신호가 건널 수 있는 신호로 바뀌었습니다. 가장 알맞은 행동을 고르세요.",
   "answer": "⑤ 주변과 차량 정지를 확인하고 건넌다.",
   "explanation": "신호와 함께 주변과 차량의 움직임·정지를 확인하고 안전하게 걸어서 건너요. 신호가 바뀌었다는 사실만으로 모든 차가 멈췄다고 단정하지 않아요.",
   "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
   "choices": [
    "옆 친구가 가는지만 보고 따라간다.",
    "차 소리가 없으면 살피지 않고 간다.",
    "운전자가 손짓하면 신호와 무관하게 간다.",
    "신호가 바뀌자마자 앞만 보고 뛰어간다.",
    "주변과 차량 정지를 확인하고 건넌다."
   ],
   "key": 4,
   "criteria": "제시한 조건에서 「주변과 차량 정지를 확인하고 건넌다.」을 고른다. 신호와 함께 주변과 차량의 움직임·정지를 확인하고 안전하게 걸어서 건너요. 신호가 바뀌었다는 사실만으로 모든 차가 멈췄다고 단정하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   }
  },
  {
   "id": "c22-s61-u02-w104",
   "no": 104,
   "form": "blank",
   "type": "T09",
   "topic": "길을 건너기 전",
   "prompt": "길을 건너기 전에는 먼저 [ ] 서서 좌우와 차량의 움직임을 살펴요.",
   "answer": "멈추어",
   "explanation": "잠시 멈추고 주변을 확인하는 행동을 습관으로 실천해요. 신호가 바뀌어도 차량의 움직임을 함께 확인해요.",
   "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
   "accepted": [
    "멈춰",
    "멈추고"
   ],
   "criteria": "「멈추어」 또는 명시한 동등 표현으로 답한다. 잠시 멈추고 주변을 확인하는 행동을 습관으로 실천해요. 신호가 바뀌어도 차량의 움직임을 함께 확인해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "멈추어",
     "멈춰",
     "멈추고"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w105",
   "no": 105,
   "form": "short",
   "type": "T10",
   "topic": "정지 거리의 자료 부족",
   "prompt": "실제 자동차의 속력 수치 하나만 있습니다. 정확한 정지 거리를 몇 m인지 바로 알 수 있나요? “가능/자료 부족” 중 쓰세요.",
   "answer": "자료 부족",
   "explanation": "노면·타이어·브레이크·운전자의 반응 등 조건도 영향을 줘요. 속력 하나만으로 정확한 정지 거리를 만들어 내지 않아요.",
   "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
   "accepted": [
    "불가능",
    "알 수 없다",
    "자료가 부족하다",
    "판단할 수 없다",
    "정확히 알 수 없다"
   ],
   "criteria": "「자료 부족」 또는 명시한 동등 표현으로 답한다. 노면·타이어·브레이크·운전자의 반응 등 조건도 영향을 줘요. 속력 하나만으로 정확한 정지 거리를 만들어 내지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "자료 부족",
     "불가능",
     "알 수 없다",
     "자료가 부족하다",
     "판단할 수 없다",
     "정확히 알 수 없다"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w106",
   "no": 106,
   "form": "multi",
   "type": "T09",
   "topic": "안전한 조사와 행동",
   "prompt": "초등학생이 교통안전을 배우며 실천할 방법을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "위험한 도로 실험 대신 공식 자료와 안전한 장소의 모형을 활용해요. 횡단할 때에는 신호와 주변·차량의 움직임을 확인해요.",
   "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
   "choices": [
    "횡단 전에 멈추고 주변과 차량을 살핀다.",
    "빠른 자동차 앞에서 멈추는지 시험한다.",
    "교사가 준비한 실내 모형의 한계를 말한다.",
    "공식 안전 자료에서 행동요령을 확인한다.",
    "차도에 나가 차의 정지 거리를 직접 잰다."
   ],
   "key": [
    0,
    2,
    3
   ],
   "criteria": "「횡단 전에 멈추고 주변과 차량을 살핀다. / 교사가 준비한 실내 모형의 한계를 말한다. / 공식 안전 자료에서 행동요령을 확인한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2,
     3
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w107",
   "no": 107,
   "form": "written",
   "type": "T10",
   "topic": "조건을 붙인 안전 설명",
   "prompt": "친구가 “자동차는 빠를수록 정확히 5m 더 가서 멈춘다”고 말했습니다. 근거 없는 수치와 속력의 관계를 구별하여 고쳐 쓰세요.",
   "answer": "다른 조건이 같을 때 속력이 클수록 멈추기까지 더 긴 거리가 필요할 수 있어요. 실제 자료와 조건이 없으므로 5m라는 일정한 차이는 말할 수 없어요.",
   "explanation": "속력과 안전의 관련성을 설명하되 임의의 수치를 모든 자동차에 적용하지 않아요.",
   "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
   "requirements": [
    "다른 조건이 같다는 전제",
    "빠를수록 정지까지 거리 증가 관계",
    "5m의 고정 차이 근거 없음"
   ],
   "lines": 8,
   "criteria": "다른 조건이 같다는 전제 / 빠를수록 정지까지 거리 증가 관계 / 5m의 고정 차이 근거 없음",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "다른 조건이 같을 때 속력이 클수록 멈추기까지 더 긴 거리가 필요할 수 있어요. 실제 자료와 조건이 없으므로 5m라는 일정한 차이는 말할 수 없어요.",
    "required": [
     "다른 조건이 같다는 전제",
     "빠를수록 정지까지 거리 증가 관계",
     "5m의 고정 차이 근거 없음"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w108",
   "no": 108,
   "form": "written",
   "type": "T09",
   "topic": "행동과 까닭 연결",
   "prompt": "“초록 신호일 때 건넌다”는 안내에 무엇을 보완할까요? 멈춤·주변 확인·차량 확인·걷기를 연결해 설명하세요.",
   "answer": "건너기 전에 멈춰 신호와 좌우·주변을 살피고 차량이 멈췄는지 확인한 뒤 걸어서 건너요. 신호만 보고 모든 차가 멈췄다고 단정하지 않아요.",
   "explanation": "해야 할 행동과 그 까닭을 함께 전달해요. 실제 도로에서 속력이나 제동 실험을 하라는 안내가 아니에요.",
   "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
   "requirements": [
    "멈춤과 신호/주변 확인",
    "차량 움직임/정지 확인",
    "걸어서 건넘과 신호만으로 단정하지 않는 이유"
   ],
   "lines": 8,
   "criteria": "멈춤과 신호/주변 확인 / 차량 움직임/정지 확인 / 걸어서 건넘과 신호만으로 단정하지 않는 이유",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "건너기 전에 멈춰 신호와 좌우·주변을 살피고 차량이 멈췄는지 확인한 뒤 걸어서 건너요. 신호만 보고 모든 차가 멈췄다고 단정하지 않아요.",
    "required": [
     "멈춤과 신호/주변 확인",
     "차량 움직임/정지 확인",
     "걸어서 건넘과 신호만으로 단정하지 않는 이유"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w109",
   "no": 109,
   "form": "choice",
   "type": "T10",
   "topic": "안전한 모형 탐구",
   "prompt": "속력과 멈추기까지의 움직임을 살펴볼 학습 방법을 고르세요.",
   "answer": "③ 실내 모형을 관찰하고 적용 범위를 밝힌다.",
   "explanation": "교사가 준비한 낮은 실내 모형에서 관찰하고 실제 자동차와 다른 조건을 밝혀요. 차도에서 차량 앞에 서는 실험은 하지 않아요.",
   "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
   "choices": [
    "장난감 기록을 모든 자동차에 적용한다.",
    "모형 결과에 임의로 100을 곱해 환산한다.",
    "실내 모형을 관찰하고 적용 범위를 밝힌다.",
    "차도에서 접근하는 차 앞에 표를 세운다.",
    "친구가 탄 자전거 앞으로 갑자기 나간다."
   ],
   "key": 2,
   "criteria": "제시한 조건에서 「실내 모형을 관찰하고 적용 범위를 밝힌다.」을 고른다. 교사가 준비한 낮은 실내 모형에서 관찰하고 실제 자동차와 다른 조건을 밝혀요. 차도에서 차량 앞에 서는 실험은 하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   }
  },
  {
   "id": "c22-s61-u02-w110",
   "no": 110,
   "form": "order",
   "type": "T09",
   "topic": "안내 문장 다듬기",
   "prompt": "안전 행동을 설명하는 문장을 완성하는 순서입니다. 보기의 순서대로 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "안내할 장면과 실제 행동을 정한 뒤 근거를 연결하고 위험한 실험 지시나 과도한 단정을 점검해요.",
   "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
   "given": [
    "ㄱ 왜 필요한지 공식 자료와 연결한다.",
    "ㄴ 안내할 장면을 한 가지 정한다.",
    "ㄷ 그 장면에서 할 안전 행동을 쓴다.",
    "ㄹ 친구가 읽어도 오해가 없는지 고친다."
   ],
   "criteria": "「ㄴ → ㄷ → ㄱ → ㄹ」 또는 명시한 동등 표현으로 답한다. 안내할 장면과 실제 행동을 정한 뒤 근거를 연결하고 위험한 실험 지시나 과도한 단정을 점검해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ",
     "ㄹ"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w111",
   "no": 111,
   "form": "written",
   "type": "T10",
   "topic": "모형에서 실제로 확대하기",
   "prompt": "작은 수레를 멈추게 한 거리로 실제 자동차의 정지 거리를 구할 수 있다고 했습니다. 그대로 옮기기 어려운 까닭과 모형에서 말할 수 있는 범위를 쓰세요.",
   "answer": "질량·바퀴·바닥·멈추게 하는 방법과 운전자의 반응 등이 달라 수레 거리를 자동차 거리로 그대로 옮길 수 없어요. 이 모형에서 사용한 조건과 관찰한 움직임의 관계까지 설명해요.",
   "explanation": "모형은 관계를 생각하는 데 도움을 주지만 실제 차의 정확한 수치나 안전거리를 보장하지 않아요.",
   "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
   "requirements": [
    "실제 차와 다른 두 가지 이상 조건",
    "자동차 거리로 직접 환산/보장 보류",
    "사용한 모형 조건과 관찰 범위 명시"
   ],
   "lines": 8,
   "criteria": "실제 차와 다른 두 가지 이상 조건 / 자동차 거리로 직접 환산/보장 보류 / 사용한 모형 조건과 관찰 범위 명시",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "질량·바퀴·바닥·멈추게 하는 방법과 운전자의 반응 등이 달라 수레 거리를 자동차 거리로 그대로 옮길 수 없어요. 이 모형에서 사용한 조건과 관찰한 움직임의 관계까지 설명해요.",
    "required": [
     "실제 차와 다른 두 가지 이상 조건",
     "자동차 거리로 직접 환산/보장 보류",
     "사용한 모형 조건과 관찰 범위 명시"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w112",
   "no": 112,
   "form": "draw",
   "type": "T08",
   "topic": "안전장치 안내 카드",
   "prompt": "안전띠 또는 과속 방지 턱 한 가지를 골라 이름·역할·함께 지킬 행동을 담은 안내 카드를 구성하세요. 실제 사고 장면을 그릴 필요는 없어요.",
   "answer": "안전띠는 몸을 잡아 주는 역할과 바른 착용 행동을, 과속 방지 턱은 감속 유도와 주변을 살피는 행동을 연결해요. 글과 칸 배치만으로 구성해도 돼요.",
   "explanation": "장치의 역할이 맞는지가 중심이에요. 장치만 있으면 모든 사고가 사라진다는 문구나 임의의 정지 거리는 넣지 않아요.",
   "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
   "requirements": [
    "장치 이름과 맞는 역할",
    "관련 안전 행동",
    "읽기 쉬운 구성과 과도한 보장 없음"
   ],
   "drawing": "large",
   "criteria": "장치 이름과 맞는 역할 / 관련 안전 행동 / 읽기 쉬운 구성과 과도한 보장 없음",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "안전띠는 몸을 잡아 주는 역할과 바른 착용 행동을, 과속 방지 턱은 감속 유도와 주변을 살피는 행동을 연결해요. 글과 칸 배치만으로 구성해도 돼요.",
    "required": [
     "장치 이름과 맞는 역할",
     "관련 안전 행동",
     "읽기 쉬운 구성과 과도한 보장 없음"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w113",
   "no": 113,
   "form": "choice",
   "type": "T13",
   "topic": "자료 선택",
   "prompt": "안전 행동을 설명할 자료로 우선 확인할 것을 고르세요.",
   "answer": "① 작성 기관과 본문이 확인되는 공식 안내",
   "explanation": "작성 기관·본문·대상과 맥락을 확인할 수 있는 공식 자료를 읽어요. 검색 제목이나 짧은 발췌만으로 전체 내용을 확인했다고 하지 않아요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "choices": [
    "작성 기관과 본문이 확인되는 공식 안내",
    "날짜와 대상이 잘린 화면 일부",
    "친구가 기억으로 옮긴 숫자 목록",
    "검색 결과 제목만 보이는 한 줄",
    "작성 기관 없이 전해진 대화방의 안내 글"
   ],
   "key": 0,
   "criteria": "제시한 조건에서 「작성 기관과 본문이 확인되는 공식 안내」을 고른다. 작성 기관·본문·대상과 맥락을 확인할 수 있는 공식 자료를 읽어요. 검색 제목이나 짧은 발췌만으로 전체 내용을 확인했다고 하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   }
  },
  {
   "id": "c22-s61-u02-w114",
   "no": 114,
   "form": "blank",
   "type": "T13",
   "topic": "다시 확인할 길",
   "prompt": "설명 자료에는 다른 사람이 근거를 다시 찾아볼 수 있도록 자료 제목과 기관·주소 같은 [ ] 정보를 남겨요.",
   "answer": "출처",
   "explanation": "어디서 어떤 내용을 확인했는지 기록하면 내 관찰과 자료에서 얻은 정보를 구별할 수 있어요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "criteria": "「출처」 또는 명시한 동등 표현으로 답한다. 어디서 어떤 내용을 확인했는지 기록하면 내 관찰과 자료에서 얻은 정보를 구별할 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "출처"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w115",
   "no": 115,
   "form": "short",
   "type": "T13",
   "topic": "제작과 전달 구별",
   "prompt": "제공된 연습 기록에서 실제로 친구에게 전달한 카드는 몇 장인가요?",
   "answer": "4장",
   "explanation": "6장을 만들었어도 전달 완료는 4장이에요. 남은 2장을 전달할 계획과 완료 기록을 구별해요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "accepted": [
    "4",
    "네 장",
    "4개"
   ],
   "table": {
    "heads": [
     "상태",
     "카드 수"
    ],
    "rows": [
     [
      "제작 완료",
      6
     ],
     [
      "친구에게 전달 완료",
      4
     ],
     [
      "아직 전달하지 않음",
      2
     ]
    ]
   },
   "model": {
    "kind": "actual-count",
    "states": {
     "made": 6,
     "delivered": 4,
     "pending": 2
    },
    "field": "delivered",
    "value": 4
   },
   "criteria": "「4장」 또는 명시한 동등 표현으로 답한다. 6장을 만들었어도 전달 완료는 4장이에요. 남은 2장을 전달할 계획과 완료 기록을 구별해요.",
   "figure": "motion-question-115",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "4장",
     "4",
     "네 장",
     "4개"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w116",
   "no": 116,
   "form": "multi",
   "type": "T13",
   "topic": "설명과 기록의 근거",
   "prompt": "안전 조사 결과를 공유할 때 알맞은 방법을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "자료의 출처와 확인 범위를 밝히고 실제로 전달/질문받은 일과 앞으로 할 일을 구별해요. 모형 수치나 예상 질문을 실제 사건처럼 쓰지 않아요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "choices": [
    "확인한 내용의 적용 조건을 밝힌다.",
    "모형의 수치를 실제 자동차 값으로 쓴다.",
    "아직 공유하지 않았다면 계획으로 적는다.",
    "자료 제목과 작성 기관을 남긴다.",
    "예상 질문을 실제 받은 질문으로 적는다."
   ],
   "key": [
    0,
    2,
    3
   ],
   "criteria": "「확인한 내용의 적용 조건을 밝힌다. / 아직 공유하지 않았다면 계획으로 적는다. / 자료 제목과 작성 기관을 남긴다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2,
     3
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w117",
   "no": 117,
   "form": "match",
   "type": "T13",
   "topic": "상태를 정확히 쓰기",
   "prompt": "보기: ㄱ 자료에서 확인 / ㄴ 앞으로 할 계획 / ㄷ 실제 공유 완료",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "자료 읽기·계획·실제 전달은 서로 다른 활동이에요. 예정된 일을 완료로 표시하지 않아요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "parts": [
    "(1) 공식 안내 본문에서 차량 움직임 확인을 읽었다. [ ]",
    "(2) 내일 친구에게 카드를 보여 주려고 한다. [ ]",
    "(3) 오늘 카드 내용을 친구에게 설명했다. [ ]"
   ],
   "answerPerPart": true,
   "criteria": "「(1) ㄱ (2) ㄴ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. 자료 읽기·계획·실제 전달은 서로 다른 활동이에요. 예정된 일을 완료로 표시하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ],
    "orderSensitive": true,
    "answerPerPart": true
   }
  },
  {
   "id": "c22-s61-u02-w118",
   "no": 118,
   "form": "written",
   "type": "T13",
   "topic": "출처와 내 설명 연결",
   "prompt": "국민안전24에서 횡단 전 주변과 차량 움직임을 확인하라는 안내를 읽었습니다. 속력 학습과 연결해 친구에게 전할 두세 문장을 쓰세요.",
   "answer": "국민안전24의 교통사고 행동요령을 참고했어요. 움직이는 차가 즉시 멈춘다고 단정할 수 없으므로, 건너기 전에 멈춰 신호·주변·차량의 정지를 확인하고 걸어서 건너요.",
   "explanation": "자료의 행동요령과 운동에 관한 생각을 연결해요. 실제 차의 정지 거리를 측정했다고 하거나 임의의 m 값을 덧붙이지 않아요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "requirements": [
    "국민안전24/교통사고 행동요령 출처",
    "즉시 정지 단정 보류와 차량 확인의 연결",
    "멈춤/주변 확인/걷기의 구체 행동"
   ],
   "lines": 8,
   "criteria": "국민안전24/교통사고 행동요령 출처 / 즉시 정지 단정 보류와 차량 확인의 연결 / 멈춤/주변 확인/걷기의 구체 행동",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "국민안전24의 교통사고 행동요령을 참고했어요. 움직이는 차가 즉시 멈춘다고 단정할 수 없으므로, 건너기 전에 멈춰 신호·주변·차량의 정지를 확인하고 걸어서 건너요.",
    "required": [
     "국민안전24/교통사고 행동요령 출처",
     "즉시 정지 단정 보류와 차량 확인의 연결",
     "멈춤/주변 확인/걷기의 구체 행동"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w119",
   "no": 119,
   "form": "choice",
   "type": "T13",
   "topic": "관찰과 주장 구별",
   "prompt": "실내 수레 모형에서만 측정했습니다. 조사 발표에 넣을 수 있는 주장을 고르세요.",
   "answer": "④ 사용한 실내 모형의 관찰 결과를 설명한다.",
   "explanation": "실제 수행한 모형의 조건과 관찰 결과까지 전달해요. 실제 도로나 모든 자동차를 시험한 것으로 확대하지 않아요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "choices": [
    "자료를 읽었으니 도로 실험도 완료했다.",
    "수레가 멈췄으니 사고 위험은 이제 없다.",
    "모든 자동차의 정지 거리를 알아냈다.",
    "사용한 실내 모형의 관찰 결과를 설명한다.",
    "학교 앞 자동차도 모두 같은 값으로 멈춘다."
   ],
   "key": 3,
   "criteria": "제시한 조건에서 「사용한 실내 모형의 관찰 결과를 설명한다.」을 고른다. 실제 수행한 모형의 조건과 관찰 결과까지 전달해요. 실제 도로나 모든 자동차를 시험한 것으로 확대하지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   }
  },
  {
   "id": "c22-s61-u02-w120",
   "no": 120,
   "form": "blank",
   "type": "T13",
   "topic": "아직 질문이 없을 때",
   "prompt": "카드를 보여 주었지만 아직 질문이나 의견을 받지 못했다면 “의견 [ ]”처럼 현재 상태를 사실대로 남겨요.",
   "answer": "미수신",
   "explanation": "질문이 없었다고 임의의 질문을 지어내지 않아요. 기다리는 상태와 나중에 물어볼 계획을 따로 적을 수 있어요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "accepted": [
    "아직 없음",
    "받지 못함",
    "없음"
   ],
   "criteria": "「미수신」 또는 명시한 동등 표현으로 답한다. 질문이 없었다고 임의의 질문을 지어내지 않아요. 기다리는 상태와 나중에 물어볼 계획을 따로 적을 수 있어요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "미수신",
     "아직 없음",
     "받지 못함",
     "없음"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w121",
   "no": 121,
   "form": "short",
   "type": "T13",
   "topic": "실제 수정 수",
   "prompt": "제공된 연습 기록에서 고칠 계획만 세운 것을 빼고 실제로 수정한 항목 수를 쓰세요.",
   "answer": "2개",
   "explanation": "출처 추가와 표현 수정은 완료했지만 글자 크기 변경은 계획이에요. 완료와 계획을 합쳐 세지 않아요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "accepted": [
    "2",
    "두 개",
    "2항목",
    "2가지"
   ],
   "table": {
    "heads": [
     "항목",
     "현재 상태"
    ],
    "rows": [
     [
      "출처 주소 추가",
      "수정 완료"
     ],
     [
      "모든 차라는 표현 고치기",
      "수정 완료"
     ],
     [
      "글자 크기 키우기",
      "다음 수정 계획"
     ]
    ]
   },
   "model": {
    "kind": "completed-count",
    "states": [
     "done",
     "done",
     "planned"
    ],
    "value": 2
   },
   "criteria": "「2개」 또는 명시한 동등 표현으로 답한다. 출처 추가와 표현 수정은 완료했지만 글자 크기 변경은 계획이에요. 완료와 계획을 합쳐 세지 않아요.",
   "figure": "motion-question-121",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "dataProvenance": "author-created-practice-data-not-learner-measurement",
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "2개",
     "2",
     "두 개",
     "2항목",
     "2가지"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w122",
   "no": 122,
   "form": "multi",
   "type": "T13",
   "topic": "질문을 받은 다음",
   "prompt": "친구에게 설명 자료를 보여 준 뒤 할 행동으로 알맞은 것을 모두 고르세요.",
   "answer": "①, ②, ⑤",
   "explanation": "실제 받은 질문·의견과 수정한 내용을 남겨요. 아직 질문이 없거나 수정본을 재전달하지 않았다면 그 상태도 구별해요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "choices": [
    "수정본 전달 여부를 따로 확인한다.",
    "실제 받은 질문을 가능한 그대로 남긴다.",
    "없던 칭찬을 넣어 공유 성공으로 적는다.",
    "고칠 계획을 세우면 수정 완료로 표시한다.",
    "질문이 아직 없으면 미수신이라고 쓴다."
   ],
   "key": [
    0,
    1,
    4
   ],
   "criteria": "「수정본 전달 여부를 따로 확인한다. / 실제 받은 질문을 가능한 그대로 남긴다. / 질문이 아직 없으면 미수신이라고 쓴다.」을 모두 고르고 다른 보기를 넣지 않는다.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     4
    ],
    "orderSensitive": false,
    "extraSelectionAllowed": false
   }
  },
  {
   "id": "c22-s61-u02-w123",
   "no": 123,
   "form": "written",
   "type": "T13",
   "topic": "수정과 재전달은 다름",
   "prompt": "연습 상황: 친구에게 초안을 보여 주고 “모든 차가 멈춘다는 뜻이야?”라는 질문을 받았습니다. 그 표현은 고쳤지만 수정본은 아직 보여 주지 않았습니다. 현재 상태와 다음 행동을 쓰세요.",
   "answer": "초안 공유와 질문 수신·문장 수정은 완료했지만 수정본 재전달은 아직이에요. 고친 문장을 다시 보여 주고 오해가 줄었는지 실제 의견을 확인할 계획으로 남겨요.",
   "explanation": "수정 완료를 재전달 완료로 바꾸지 않아요. 질문 수신과 다시 확인할 일을 구별해요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "requirements": [
    "초안 공유/실제 질문 구별",
    "수정 완료와 재전달 미완료 구별",
    "고친 문장 실제 재전달/확인 계획"
   ],
   "lines": 8,
   "criteria": "초안 공유/실제 질문 구별 / 수정 완료와 재전달 미완료 구별 / 고친 문장 실제 재전달/확인 계획",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "초안 공유와 질문 수신·문장 수정은 완료했지만 수정본 재전달은 아직이에요. 고친 문장을 다시 보여 주고 오해가 줄었는지 실제 의견을 확인할 계획으로 남겨요.",
    "required": [
     "초안 공유/실제 질문 구별",
     "수정 완료와 재전달 미완료 구별",
     "고친 문장 실제 재전달/확인 계획"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w124",
   "no": 124,
   "form": "written",
   "type": "T13",
   "topic": "질문에 답이 막힐 때",
   "prompt": "친구가 “네가 말한 정지 거리 숫자는 어디에서 나온 거야?”라고 물었지만 출처를 찾지 못했습니다. 어떻게 답하고 자료를 고칠지 쓰세요.",
   "answer": "지금은 그 숫자의 근거를 확인하지 못했다고 말해요. 숫자를 사실처럼 제시한 부분을 빼거나 확인 전이라고 고치고, 공식 자료의 조건과 본문을 다시 찾아본 뒤 설명해요.",
   "explanation": "모른다고 밝히고 근거를 다시 확인하는 것도 타당한 과학 의사소통이에요. 그럴듯한 출처나 경험을 만들어 내지 않아요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "requirements": [
    "숫자 출처 미확인 인정",
    "근거 없는 수치 수정/삭제",
    "본문/조건 재확인 계획"
   ],
   "lines": 8,
   "criteria": "숫자 출처 미확인 인정 / 근거 없는 수치 수정/삭제 / 본문/조건 재확인 계획",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "지금은 그 숫자의 근거를 확인하지 못했다고 말해요. 숫자를 사실처럼 제시한 부분을 빼거나 확인 전이라고 고치고, 공식 자료의 조건과 본문을 다시 찾아본 뒤 설명해요.",
    "required": [
     "숫자 출처 미확인 인정",
     "근거 없는 수치 수정/삭제",
     "본문/조건 재확인 계획"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w125",
   "no": 125,
   "form": "choice",
   "type": "T01",
   "topic": "운동 판단의 근거 점검",
   "prompt": "다음 중 시간에 따른 위치 변화를 직접 비교할 수 있는 자료를 고르세요.",
   "answer": "② 고정 눈금에서 0초와 2초 위치 기록",
   "explanation": "같은 고정 눈금에서 두 시각의 위치를 읽은 기록이면 시간에 따른 변화를 비교할 수 있어요. 물체 이름이나 사진 한 장은 그 근거가 부족해요.",
   "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
   "choices": [
    "기준이 바뀐 두 사진의 화면 속 점 위치",
    "고정 눈금에서 0초와 2초 위치 기록",
    "물체의 종류를 일정/변화로만 분류한 표",
    "빠르게 생긴 자동차의 광고 사진 한 장",
    "각자 출발 시각 없이 도착 순서만 적은 기록"
   ],
   "key": 1,
   "criteria": "제시한 조건에서 「고정 눈금에서 0초와 2초 위치 기록」을 고른다. 같은 고정 눈금에서 두 시각의 위치를 읽은 기록이면 시간에 따른 변화를 비교할 수 있어요. 물체 이름이나 사진 한 장은 그 근거가 부족해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   }
  },
  {
   "id": "c22-s61-u02-w126",
   "no": 126,
   "form": "order",
   "type": "T13",
   "topic": "실제로 나누고 고치기",
   "prompt": "안전 설명 자료를 만들고 공유하며 개선하는 흐름을 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
   "explanation": "근거를 확인해 초안을 만든 뒤 실제로 공유해요. 실제 질문/미수신 상태를 남기고 고치며 수정본 전달 여부도 구별해요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "given": [
    "ㄱ 행동·까닭·출처를 담은 초안을 만든다.",
    "ㄴ 실제 질문/미수신을 남기고 내용을 고친다.",
    "ㄷ 공식 자료의 본문과 적용 범위를 확인한다.",
    "ㄹ 친구에게 내용을 실제로 설명한다."
   ],
   "criteria": "「ㄷ → ㄱ → ㄹ → ㄴ」 또는 명시한 동등 표현으로 답한다. 근거를 확인해 초안을 만든 뒤 실제로 공유해요. 실제 질문/미수신 상태를 남기고 고치며 수정본 전달 여부도 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-sequence",
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄹ",
     "ㄴ"
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s61-u02-w127",
   "no": 127,
   "form": "written",
   "type": "T13",
   "topic": "다음 확인을 계획하기",
   "prompt": "모형의 1회 측정만으로 “빠른 수레가 언제나 더 멀리 가서 멈춘다”고 썼습니다. 다음에 안전하게 확인할 계획과 지금의 결론 범위를 쓰세요.",
   "answer": "지금은 사용한 모형의 1회 결과만 말해요. 교사와 비운 실내 길에서 같은 수레·바닥·멈추는 방법을 정하고 출발 빠르기 조건을 달리해 여러 번 관찰할 계획을 세워요. 실제 자동차의 수치로 옮기지는 않아요.",
   "explanation": "한 번의 관찰을 언제나라는 주장으로 확대하지 않아요. 다른 조건을 맞추고 실제로 확인한 범위와 앞으로 할 일을 구별해요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "requirements": [
    "현재1회/모형 범위 명시",
    "교사/비운 실내와 같게 할 조건",
    "빠르기 조건 구분과 반복 계획",
    "실제 자동차 수치로 확대하지 않음"
   ],
   "lines": 8,
   "criteria": "현재1회/모형 범위 명시 / 교사/비운 실내와 같게 할 조건 / 빠르기 조건 구분과 반복 계획 / 실제 자동차 수치로 확대하지 않음",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-explanation",
    "teacherRequired": true,
    "sample": "지금은 사용한 모형의 1회 결과만 말해요. 교사와 비운 실내 길에서 같은 수레·바닥·멈추는 방법을 정하고 출발 빠르기 조건을 달리해 여러 번 관찰할 계획을 세워요. 실제 자동차의 수치로 옮기지는 않아요.",
    "required": [
     "현재1회/모형 범위 명시",
     "교사/비운 실내와 같게 할 조건",
     "빠르기 조건 구분과 반복 계획",
     "실제 자동차 수치로 확대하지 않음"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  },
  {
   "id": "c22-s61-u02-w128",
   "no": 128,
   "form": "draw",
   "type": "T13",
   "topic": "설명하고 나눌 자료 구성",
   "prompt": "친구에게 전할 안전 설명 자료의 칸 배치를 그리세요. 행동·과학적 까닭·출처·적용 범위·실제 공유 후 남길 곳을 넣으세요.",
   "answer": "안전 행동/왜 필요한지/자료 제목·기관·주소/모형과 실제의 차이/공유한 때·받은 질문 또는 미수신/수정·재전달 여부 칸을 둬요. 아직 수행하지 않은 일은 계획으로 남겨요.",
   "explanation": "그림 솜씨보다 근거와 행동이 연결되고 실제 수행 상태를 정직하게 구별하는 구성이 중요해요. 긴 탐구보고서를 요구하는 과제가 아니에요.",
   "misconception": "실제 제작/전달·받은 질문/미수신·수정/다음 계획을 구별해요.",
   "requirements": [
    "구체 행동과 운동/속력의 까닭",
    "출처와 적용 범위",
    "실제 공유/질문·미수신/수정·재전달 칸",
    "아직 수행하지 않은 값/행동을 채우지 않음"
   ],
   "drawing": "large",
   "criteria": "구체 행동과 운동/속력의 까닭 / 출처와 적용 범위 / 실제 공유/질문·미수신/수정·재전달 칸 / 아직 수행하지 않은 값/행동을 채우지 않음",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과10-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅱ. 물체의 운동",
    "originalExam": false
   },
   "responseContract": {
    "kind": "teacher-drawing",
    "teacherRequired": true,
    "sample": "안전 행동/왜 필요한지/자료 제목·기관·주소/모형과 실제의 차이/공유한 때·받은 질문 또는 미수신/수정·재전달 여부 칸을 둬요. 아직 수행하지 않은 일은 계획으로 남겨요.",
    "required": [
     "구체 행동과 운동/속력의 까닭",
     "출처와 적용 범위",
     "실제 공유/질문·미수신/수정·재전달 칸",
     "아직 수행하지 않은 값/행동을 채우지 않음"
    ],
    "actualPerformanceMustNotBeInferred": true
   }
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "물체의 운동",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-cart",
     "caption": ""
    },
    {
     "type": "text",
     "text": "시간에 따라 달라지는 위치를 표현하고 거리와 시간을 실제로 재요. 평균 속력의 뜻을 근거로 설명하고 안전한 생활의 자료를 만들어 나누어요."
    },
    {
     "type": "field",
     "title": "나의 첫 질문",
     "hint": "이름·학습 날짜와 내가 확인해 보고 싶은 움직임을 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위치 표현 → 실제 측정 → 속력 설명 → 안전 자료 제작/공유로 이어 가요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진과 제시 수치는 설명/연습 자료예요. 실제로 수행한 근거와 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "차례와 사용법",
   "title": "조건을 읽고 근거로 설명해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "차례",
      "문항"
     ],
     "rows": [
      [
       "1. 운동과 위치 표현",
       "1~16번"
      ],
      [
       "2. 시간 간격과 빠르기 변화",
       "17~32번"
      ],
      [
       "3. 같은 거리의 시간 비교",
       "33~48번"
      ],
      [
       "4. 같은 시간의 거리 비교",
       "49~64번"
      ],
      [
       "5. 속력의 의미와 단위",
       "65~80번"
      ],
      [
       "6. 실제 측정과 반복",
       "81~96번"
      ],
      [
       "7. 속력과 안전한 생활",
       "97~112번"
      ],
      [
       "8. 근거를 담은 설명과 공유",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "객관식·빈칸·단답·모두 고르기·연결·순서·서술·그림의8형식을 연습해요. 개념/예제와 실제 활동을 먼저 확인하고 오른쪽에 핵심·더 알아볼 것·내 정리를 이어 써요."
    },
    {
     "type": "field",
     "title": "공부할 때 구별할 것",
     "hint": "실제 측정/제공 자료, 관찰/추측, 완료/계획을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항의 정답과 실제 활동 수행은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "기본 활동2차시80분과16문항 확인30분은 상황에 맞게 나누어 진행해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "운동",
       "시간에 따라 물체의 위치가 변하는 것"
      ],
      [
       "기준",
       "위치를 비교하기 위해 함께 사용하는 고정 장소나 눈금"
      ],
      [
       "좌표",
       "이 교재에서는 (가로 눈금, 세로 눈금) 순서로 나타낸 위치"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-cart",
     "caption": ""
    },
    {
     "type": "text",
     "text": "운동을 확인하려면 **같은 기준**에서 **서로 다른 시각**의 위치를 비교해요. 색이나 모양의 변화만으로 이동했다고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "한 장의 사진으로 모르는 것",
     "hint": "더 필요한 시각·위치·거리/시간 자료를 구별해 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-coordinate-example",
     "caption": ""
    },
    {
     "type": "example",
     "question": "처음 C와 나중 D를 (가로, 세로)로 읽어 보세요.",
     "steps": [
      [
       "기준 확인",
       "두 점이 같은 축과 눈금에 표시되어 있어요."
      ],
      [
       "위치 읽기",
       "C는 가로2·세로1, D는 가로4·세로4예요."
      ],
      [
       "결론 범위",
       "위치가 달라졌다고 말해요. 두 점 거리는 구하지 않아요."
      ]
     ],
     "answer": "C(2, 1), D(4, 4)"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 1~3",
   "title": "운동의 공통점",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w001",
      "c22-s61-u02-w002",
      "c22-s61-u02-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 4~5",
   "title": "관찰할 기준",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w004",
      "c22-s61-u02-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 6~7",
   "title": "기준이 달라진 사진",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w006",
      "c22-s61-u02-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 8~10",
   "title": "기준의 일관성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w008",
      "c22-s61-u02-w009",
      "c22-s61-u02-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 11~12",
   "title": "좌표와 눈금의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w011",
      "c22-s61-u02-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 13",
   "title": "처음과 나중 위치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 14~15",
   "title": "좌표 표현 절차",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w014",
      "c22-s61-u02-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 16",
   "title": "처음과 나중을 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 위치 표현",
   "title": "처음과 나중을 좌표로 나타내요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 눈금 종이에서 표시물의 처음 위치와 시각을 실제로 남겨요.",
      "표시물을 옮긴 뒤 같은 기준의 나중 위치·시각을 남겨요.",
      "아래에 간단한 좌표 평면과 두 점·처음/나중 이름표를 그려 짝과 읽어요. 두 점 거리는 구하지 않아요."
     ]
    },
    {
     "type": "field",
     "title": "우리의 두 위치",
     "hint": "축·눈금·시각과 위치 이름표를 표시해요. 아직 수행하지 않았다면 계획으로 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표의 순서를 바꾸면 다른 점을 가리킬 수 있어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-coordinate",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "같은 시간 간격",
       "예: 연속한 각2초 구간"
      ],
      [
       "빨라짐",
       "같은 시간에 간 거리가 커지는 모습"
      ],
      [
       "느려짐",
       "같은 시간에 간 거리가 작아지는 모습"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-escalator",
     "caption": ""
    },
    {
     "type": "text",
     "text": "같은 시간마다 간 거리가 같으면 관찰한 구간의 평균 빠르기가 같아요. 거리가 늘거나 줄었다면 그 시간 간격과 함께 변화의 근거를 설명해요."
    },
    {
     "type": "field",
     "title": "항상이라는 말 점검",
     "hint": "출발·멈춤과 운행 중 관찰 구간을 구별해 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "연속한2초 구간",
      "1번째",
      "2번째",
      "3번째"
     ],
     "rows": [
      [
       "한 방향 이동 거리",
       "2m",
       "4m",
       "6m"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 연습 기록의 구간 평균 빠르기는 어떻게 변했나요?",
     "steps": [
      [
       "시간 확인",
       "각 구간은 모두2초예요."
      ],
      [
       "거리 비교",
       "2m→4m→6m로 커졌어요."
      ],
      [
       "범위 한정",
       "제시한 세 구간의 평균 빠르기가 커졌다고 설명해요."
      ]
     ],
     "answer": "같은 시간의 거리가 늘어 구간 평균 빠르기가 커졌어요."
    },
    {
     "type": "field",
     "title": "시간이 다르면?",
     "hint": "거리만 늘었다는 사실로 결론을 낼 수 없는 까닭을 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 17~19",
   "title": "축의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w017",
      "c22-s61-u02-w018",
      "c22-s61-u02-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 20~21",
   "title": "위치 그림의 정보",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w020",
      "c22-s61-u02-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 22~23",
   "title": "한 장의 좌표 그림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w022",
      "c22-s61-u02-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 24~26",
   "title": "빨라짐의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w024",
      "c22-s61-u02-w025",
      "c22-s61-u02-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 27~28",
   "title": "구간 기록 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w027",
      "c22-s61-u02-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 29~30",
   "title": "사진과 빠르기 변화",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w029",
      "c22-s61-u02-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 31",
   "title": "일정함을 설명하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 32",
   "title": "같은 시간의 위치 표시",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "이동 거리",
       "각자 출발 위치부터 간 길의 길이"
      ],
      [
       "걸린 시간",
       "출발부터 도착까지의 시간"
      ],
      [
       "공정한 측정",
       "같은 기준 부분과 시작/끝 규칙을 사용하는 측정"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-skater",
     "caption": ""
    },
    {
     "type": "text",
     "text": "**같은 거리**라는 조건을 먼저 확인해요. 각자 다른 때 출발했다면 먼저 도착했다는 말만으로 빠르기를 비교할 수 없어요."
    },
    {
     "type": "field",
     "title": "측정 규칙",
     "hint": "수레의 어느 부분이 어느 선을 지날 때 시계를 시작/정지할지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "수레",
      "같은 이동 거리",
      "걸린 시간"
     ],
     "rows": [
      [
       "A",
       "8m",
       "8초"
      ],
      [
       "B",
       "8m",
       "4초"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 구간에서 평균적으로 더 빠른 수레는?",
     "steps": [
      [
       "거리 확인",
       "두 수레가 모두8m를 갔어요."
      ],
      [
       "시간 비교",
       "B의4초가 A의8초보다 짧아요."
      ],
      [
       "판단",
       "같은 거리에 시간이 짧은 B가 더 빨라요."
      ]
     ],
     "answer": "제시 구간에서는 B가 더 빨라요."
    },
    {
     "type": "field",
     "title": "자료가 더 필요한 경우",
     "hint": "이동 거리가 다르거나 출발 시각만 있을 때 무엇을 더 확인할지 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 33~35",
   "title": "같은 거리의 빠르기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w033",
      "c22-s61-u02-w034",
      "c22-s61-u02-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 36~37",
   "title": "같은 거리 비교 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w036",
      "c22-s61-u02-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 38~39",
   "title": "먼저 도착한 장면",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w038",
      "c22-s61-u02-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 40~42",
   "title": "시간의 측정 구간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w040",
      "c22-s61-u02-w041",
      "c22-s61-u02-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 43~44",
   "title": "비교에 쓸 수 있는 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w043",
      "c22-s61-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 45~46",
   "title": "학습용 같은 코스 경기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w045",
      "c22-s61-u02-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 47",
   "title": "다른 거리의 함정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 48",
   "title": "같은 거리 측정 계획도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정 준비",
   "title": "같은 부분과 같은 구간을 정해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 비운 평평한 실내 길에서 출발/도착선과 관찰자의 경로 밖 위치를 정해요.",
      "수레의 앞부분 등 같은 부분이 두 선을 지나는 순간으로 시작/끝을 맞춰요.",
      "줄자·초시계 또는 허용된 디지털 도구와 거리/시간 단위를 준비해요."
     ]
    },
    {
     "type": "field",
     "title": "측정 배치와 규칙",
     "hint": "구간·같은 기준 부분·도구·관찰자 위치를 그림과 이름표로 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "급한 발사·달리기 경쟁·계단·차도에서 측정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-setup",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "같은 시간",
       "두 움직임을 똑같이 관찰한 시간"
      ],
      [
       "거리 기준",
       "각자의 출발 위치부터 간 거리"
      ],
      [
       "관찰 범위",
       "실제로 본 조건과 회차 안에서 말할 수 있는 결론"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-plane",
     "caption": ""
    },
    {
     "type": "text",
     "text": "시간이 다르면 간 거리가 더 길다는 사실만으로 빠르다고 정하지 않아요. **같은 시간**인지, **각 출발 위치부터 잰 거리**인지 함께 읽어요."
    },
    {
     "type": "field",
     "title": "사진과 시간 자료",
     "hint": "방향·도착 위치·빠르기 변화 중 무엇을 확인했고 무엇을 더 알아야 하는지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "수레",
      "같은 관찰 시간",
      "이동 거리"
     ],
     "rows": [
      [
       "A",
       "4초",
       "80cm"
      ],
      [
       "B",
       "4초",
       "120cm"
      ]
     ]
    },
    {
     "type": "example",
     "question": "연습 자료에서 더 빠른 움직임과 그 근거를 설명하세요.",
     "steps": [
      [
       "시간 확인",
       "두 기록 모두4초 동안의 거리예요."
      ],
      [
       "거리 비교",
       "120cm가80cm보다 길어요."
      ],
      [
       "판단 범위",
       "이번 관찰 조건의 구간 평균으로 비교해요."
      ]
     ],
     "answer": "B가 같은4초에 더 먼 거리를 갔으므로 더 빨라요."
    },
    {
     "type": "field",
     "title": "결과가 달라진 회차",
     "hint": "반복한 두 회차의 순위가 다르면 무엇을 남기고 확인할지 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 49~51",
   "title": "같은 시간의 거리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w049",
      "c22-s61-u02-w050",
      "c22-s61-u02-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 52~53",
   "title": "비교할 시간의 일관성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w052",
      "c22-s61-u02-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 54~55",
   "title": "비교 시간의 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w054",
      "c22-s61-u02-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 56~58",
   "title": "거리의 시작점",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w056",
      "c22-s61-u02-w057",
      "c22-s61-u02-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 59~60",
   "title": "관찰과 확대 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w059",
      "c22-s61-u02-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 61~62",
   "title": "같은 시간의 빠른 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w061",
      "c22-s61-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 63",
   "title": "반복 기록의 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 64",
   "title": "거리 비교 기록표",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간 비교 탐구",
   "title": "같은 시간의 거리를 실제로 재요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 길의 범위에 맞게 정한 짧은 관찰 시간을 두 움직임에 똑같이 적용해요.",
      "각 출발 위치부터 같은 시간 끝의 기준 부분 위치까지 한 방향 이동 거리를 재요.",
      "같은 방법으로3회 반복해 원래 값을 보존해요. 불분명/미측정은 그대로 남겨요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "회차",
      "관찰 시간/단위",
      "A 거리/단위",
      "B 거리/단위"
     ],
     "rows": [
      [
       "1회",
       "",
       "",
       ""
      ],
      [
       "2회",
       "",
       "",
       ""
      ],
      [
       "3회",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "비교한 근거와 조건",
     "hint": "같은 시간인지 확인하고 이번 관찰 구간에서만 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착 위치가 같아도 각 출발 위치가 다르면 간 거리가 다를 수 있어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "평균 속력",
       "한 구간의 이동 거리를 걸린 시간으로 나눈 양"
      ],
      [
       "m/s",
       "미터를 초로 나눈 속력 단위"
      ],
      [
       "정량적 설명",
       "조건과 수·단위로 근거를 전달하는 설명"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "읽을 것",
      "확인할 점"
     ],
     "rows": [
      [
       "거리와 시간",
       "한 길을 한 방향으로 이동한 같은 구간"
      ],
      [
       "계산",
       "이동 거리÷걸린 시간"
      ],
      [
       "단위",
       "m와s로 계산했다면 m/s"
      ],
      [
       "해석",
       "그 구간의 평균이며 매 순간은 별도 관찰"
      ]
     ]
    },
    {
     "type": "text",
     "text": "숫자만 맞아도 단위가 다르면 다른 양이에요. m/s의 빗금을 지워 ms로 쓰지 않아요. 단위 변환 훈련보다 속력의 뜻과 근거를 이해해요."
    },
    {
     "type": "field",
     "title": "평균이라는 말",
     "hint": "평균 속력이 같아도 중간 움직임이 다를 수 있는 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "한 길을 한 방향으로9m를6초에 이동한 연습 자료의 평균 속력은?",
     "steps": [
      [
       "자료 읽기",
       "이동 거리9m와 걸린 시간6초를 확인해요."
      ],
      [
       "계산하기",
       "9÷6=1.5예요. 계산기를 써도 돼요."
      ],
      [
       "단위와 뜻",
       "1.5m/s로 쓰고 구간 평균으로1초당1.5m인 셈이라고 설명해요."
      ]
     ],
     "answer": "평균 속력은1.5m/s예요."
    },
    {
     "type": "table",
     "heads": [
      "표현",
      "같은 뜻인가요?"
     ],
     "rows": [
      [
       "1.5m/s · 1.50m/s",
       "같은 값과 같은 단위"
      ],
      [
       "1.5ms · 1.5m",
       "같은 속력 표현이 아님"
      ]
     ]
    },
    {
     "type": "field",
     "title": "비교 문장 만들기",
     "hint": "실제 값이면 실제 측정이라고, 연습값이면 제공 자료라고 밝혀 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 65~67",
   "title": "다른 거리와 시간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w065",
      "c22-s61-u02-w066",
      "c22-s61-u02-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 68~69",
   "title": "속력 계산의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w068",
      "c22-s61-u02-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 70~71",
   "title": "두 자료를 같은 기준으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w070",
      "c22-s61-u02-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 72~74",
   "title": "계산에 쓰는 시간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w072",
      "c22-s61-u02-w073",
      "c22-s61-u02-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 75",
   "title": "빗금이 있는 단위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 76",
   "title": "평균과 매 순간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 77~78",
   "title": "같은 단위로 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w077",
      "c22-s61-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 79",
   "title": "정량적으로 전달하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 80",
   "title": "비교 자료로 표현하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "반복 측정",
       "같은 방법으로 여러 회차를 실제로 재는 것"
      ],
      [
       "불분명",
       "읽은 순간이나 값을 구별하기 어려운 상태"
      ],
      [
       "미측정",
       "아직 값을 재지 않은 상태"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-cart",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "교사가 통행과 장애물이 없는 낮고 평평한 실내 길을 준비해요. 관찰자는 경로 밖에 서요.",
      "수레를 차분하게 한 길·한 방향으로 움직여요. 출발/도착선·같은 기준 부분·시계 시작/끝 규칙을 정해요.",
      "직접 읽은 값과 단위·회차를 남겨요. 달리기 경쟁·급한 발사·차도 측정은 하지 않아요."
     ]
    },
    {
     "type": "field",
     "title": "우리 측정의 기준",
     "hint": "같은 부분·구간·도구와 관찰 위치를 간단히 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상황",
      "남길 상태"
     ],
     "rows": [
      [
       "시계에2.3초가 표시됨",
       "실제 표시2.3초"
      ],
      [
       "관찰 순간을 놓침",
       "불분명과 그 까닭"
      ],
      [
       "다음 회차를 아직 안 함",
       "미측정과 다음 계획"
      ]
     ]
    },
    {
     "type": "example",
     "question": "제공 연습표로 계산했는데 직접 잰 결과라고 썼어요. 어떻게 고칠까요?",
     "steps": [
      [
       "자료의 성격",
       "책에서 제공한 연습값이었다고 밝혀요."
      ],
      [
       "활동 구별",
       "직접 계산한 것과 거리/시간을 실제로 잰 것은 달라요."
      ],
      [
       "다음 행동",
       "별도로 실제 측정하고 원기록을 남겨요."
      ]
     ],
     "answer": "연습 계산과 실제 측정을 나누어 써요."
    },
    {
     "type": "field",
     "title": "계획과 수행 구별",
     "hint": "오늘 직접 한 것과 아직 남은 일을 구별해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 81~83",
   "title": "측정 장소 정하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w081",
      "c22-s61-u02-w082",
      "c22-s61-u02-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 84~85",
   "title": "공정한 측정 규칙",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w084",
      "c22-s61-u02-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 86~87",
   "title": "우리 모둠의 측정 계획",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w086",
      "c22-s61-u02-w087"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 88~90",
   "title": "한 번의 값만 쓰지 않기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w088",
      "c22-s61-u02-w089",
      "c22-s61-u02-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 91",
   "title": "기기 눈금과 표현",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 92~93",
   "title": "측정을 못 마친 경우",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w092",
      "c22-s61-u02-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 94~95",
   "title": "실제 측정 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w094",
      "c22-s61-u02-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 96",
   "title": "우리 측정 기록 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 거리/시간 측정",
   "title": "원래 값과 회차를 남겨요",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 정한 비운 실내 길에서 차분한 한 방향 움직임을 재요. 같은 기준 부분·시작/끝·구간과 도구를 사용해요."
    },
    {
     "type": "table",
     "heads": [
      "회차",
      "거리/단위",
      "시간/단위",
      "상태·어려움"
     ],
     "rows": [
      [
       "1회",
       "",
       "",
       ""
      ],
      [
       "2회",
       "",
       "",
       ""
      ],
      [
       "3회",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "정한 기준과 비교 조건",
     "hint": "수레 부분·시작/끝·도구/바닥과 달라진 조건을 써요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "내가 확인한 것",
     "hint": "실제로 읽은 값과 불분명/미측정을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "측정값으로 설명하기",
   "title": "값·단위·범위를 함께 전달해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "실제로 읽은 거리와 시간으로 평균 속력을 구해요. 계산기를 써도 돼요.",
      "실제 측정이 아직이면 미측정으로 두고 연습 계산은 별도로 표시해요.",
      "관찰 구간과 같은 단위를 넣어 빠르기 비교를 짝에게 설명해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "사용한 자료/회차",
      "거리÷시간",
      "평균 속력/단위"
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
     "title": "나의 비교 문장",
     "hint": "조건·각 속력·단위와 결론의 범위를 넣어 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계산을 직접 한 것과 거리/시간을 직접 잰 것은 달라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "평균 속력만으로 매 순간의 움직임을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "안전띠",
       "탑승자의 몸이 크게 쏠리는 것을 줄이는 장치"
      ],
      [
       "에어백",
       "안전띠와 함께 탑승자 보호를 돕는 장치"
      ],
      [
       "과속 방지 턱",
       "도로에서 운전자의 감속을 유도하는 장치"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "장치/행동",
      "연결할 역할"
     ],
     "rows": [
      [
       "안전띠",
       "몸을 잡아 주는 탑승자 보호"
      ],
      [
       "에어백",
       "안전띠를 대체하지 않는 보조 보호"
      ],
      [
       "과속 방지 턱",
       "감속 유도"
      ],
      [
       "횡단 전 확인",
       "멈춤·주변과 차량의 움직임/정지 확인"
      ]
     ]
    },
    {
     "type": "text",
     "text": "신호가 바뀌면 모든 차량이 멈췄다고 단정하지 않아요. 건너기 전 주변과 차량을 확인하고 걸어서 건너요."
    },
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "“빠른 자동차는 정확히5m 더 가서 멈춘다”는 설명을 고쳐 보세요.",
     "steps": [
      [
       "관계 읽기",
       "다른 조건이 같을 때 빠를수록 정지까지 더 긴 거리가 필요할 수 있어요."
      ],
      [
       "조건 확인",
       "노면·차량·멈추는 방법과 반응 등 조건이 달라요."
      ],
      [
       "수치 점검",
       "그 자료가 없으므로5m라는 일정한 차이는 근거가 없어요."
      ]
     ],
     "answer": "조건 있는 관계와 정확한 수치 주장을 구별해요."
    },
    {
     "type": "field",
     "title": "실내 모형의 한계",
     "hint": "수레와 실제 자동차의 다른 조건 두 가지와 지금 말할 수 있는 범위를 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 97~99",
   "title": "안전장치의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w097",
      "c22-s61-u02-w098",
      "c22-s61-u02-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 100~101",
   "title": "역할이 맞는 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w100",
      "c22-s61-u02-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 102~103",
   "title": "장치 하나로 충분할까",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w102",
      "c22-s61-u02-w103"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 104~106",
   "title": "길을 건너기 전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w104",
      "c22-s61-u02-w105",
      "c22-s61-u02-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 107",
   "title": "조건을 붙인 안전 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 108~109",
   "title": "행동과 까닭 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w108",
      "c22-s61-u02-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 110~111",
   "title": "안내 문장 다듬기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w110",
      "c22-s61-u02-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 112",
   "title": "안전장치 안내 카드",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "안전 자료 조사",
   "title": "역할과 까닭을 본문에서 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "확인할 것",
      "내가 남길 내용"
     ],
     "rows": [
      [
       "행동/장치",
       "이름과 역할"
      ],
      [
       "과학적 까닭",
       "운동/속력과 연결한 이유"
      ],
      [
       "출처",
       "기관·제목·주소와 읽은 부분"
      ],
      [
       "적용 범위",
       "모형/실제·확인/미확인 구별"
      ]
     ]
    },
    {
     "type": "field",
     "title": "찾은 근거와 남은 질문",
     "hint": "공식 본문을 실제로 읽고 정지 거리 숫자를 꾸며 넣지 않아요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "출처",
       "다른 사람이 근거를 다시 찾아볼 수 있는 기관·제목·주소 등의 정보"
      ],
      [
       "미수신",
       "아직 질문이나 의견을 받지 못한 상태"
      ],
      [
       "적용 범위",
       "자료나 모형으로 확인할 수 있는 조건과 한계"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "자료에 담을 것",
      "확인할 내용"
     ],
     "rows": [
      [
       "행동/장치",
       "친구가 이해할 구체 행동과 역할"
      ],
      [
       "과학적 까닭",
       "운동/속력과 연결한 근거"
      ],
      [
       "출처와 범위",
       "기관·제목·주소와 확인한 부분"
      ],
      [
       "실제 수행",
       "제작·전달·질문/미수신·수정/재전달"
      ]
     ]
    },
    {
     "type": "text",
     "text": "공식 본문을 실제로 읽고 짧은 안내 카드나 한 장 자료를 만들어요. 교실 안 친구에게 설명하며 긴 보고서나 외부 게시를 기본 과제로 삼지 않아요."
    },
    {
     "type": "field",
     "title": "내가 전할 핵심",
     "hint": "실제 자료와 연결할 행동·까닭·출처를 정해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "초안을 보여 주고 질문을 받아 문장을 고쳤지만 수정본은 아직 보여 주지 않았어요. 현재 상태는?",
     "steps": [
      [
       "완료한 일",
       "초안 공유·질문 수신·문장 수정이에요."
      ],
      [
       "남은 일",
       "수정본 재전달은 아직이에요."
      ],
      [
       "다음 행동",
       "고친 문장을 실제로 보여 주고 오해가 줄었는지 확인할 계획을 세워요."
      ]
     ],
     "answer": "수정 완료와 재전달 완료는 구별해요."
    },
    {
     "type": "field",
     "title": "받지 못한 의견",
     "hint": "질문이 아직 없다면 현재 상태와 다음에 물어볼 것을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 113~115",
   "title": "자료 선택",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w113",
      "c22-s61-u02-w114",
      "c22-s61-u02-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 116~117",
   "title": "설명과 기록의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w116",
      "c22-s61-u02-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 118~119",
   "title": "출처와 내 설명 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w118",
      "c22-s61-u02-w119"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 120~122",
   "title": "아직 질문이 없을 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w120",
      "c22-s61-u02-w121",
      "c22-s61-u02-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 123",
   "title": "수정과 재전달은 다름",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 124~125",
   "title": "질문에 답이 막힐 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w124",
      "c22-s61-u02-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 126~127",
   "title": "실제로 나누고 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w126",
      "c22-s61-u02-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 128",
   "title": "설명하고 나눌 자료 구성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "자료 제작",
   "title": "친구에게 전할 설명을 구성해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "안전 행동/장치 한 가지와 필요한 까닭을 분명하게 담아요.",
      "확인한 출처·적용 범위와 실제 측정/제공 자료를 구별해요.",
      "교사가 허용한 종이/디지털 도구로 짧은 안내 자료를 실제로 만들어요."
     ]
    },
    {
     "type": "field",
     "title": "내 자료의 구성",
     "hint": "행동·까닭·출처·범위가 읽히도록 칸 배치나 문장을 구성해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림 솜씨보다 근거와 행동의 연결이 중요해요. 공개 게시나 긴 보고서가 기본 과제는 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-design",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 설명과 보완",
   "title": "받은 질문으로 설명을 고쳐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교실 안 친구에게 자료를 실제로 보여 주고 설명해요.",
      "실제 받은 질문 또는 미수신을 남겨요. 예상 질문을 실제 질문처럼 쓰지 않아요.",
      "고친 문장과 재전달 여부를 구별해요. 아직 하지 않은 일은 다음 계획으로 남겨요."
     ]
    },
    {
     "type": "field",
     "title": "전달한 때·상대·방법",
     "hint": "아직 공유하지 않았다면 계획이라고 밝혀요.",
     "lines": 3,
     "draw": false
    },
    {
     "type": "field",
     "title": "받은 질문 또는 미수신",
     "hint": "실제 상태와 다음에 물어볼 것을 구별해요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "고친 설명과 재전달",
     "hint": "이전/고친 문장·근거와 실제 재전달 여부를 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 정리",
   "title": "관찰·계산·소통의 근거",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "확인할 내용",
      "내가 읽을 근거"
     ],
     "rows": [
      [
       "운동",
       "같은 기준·두 시각의 위치"
      ],
      [
       "좌표",
       "가로/세로 순서·처음/나중 이름표"
      ],
      [
       "빠르기 비교",
       "같은 거리/시간 또는 같은 단위의 속력"
      ],
      [
       "실제 측정",
       "원래 값·단위·반복과 불분명/미측정"
      ],
      [
       "안전 설명",
       "역할·출처·적용 범위·실제 전달/보완"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 점",
     "hint": "맞힌 개수와 실제 수행을 구별하고 구체적인 근거를 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 가지 숫자나 사진만으로 모든 움직임을 설명하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표 두 점 거리 계산·단위 변환 훈련보다 의미와 정량적 의사소통을 중심으로 해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 수행평가 A",
   "title": "위치 변화와 표현",
   "blocks": [
    {
     "type": "text",
     "text": "같은 좌표 기준에서 한 표시물은0초에(1, 4),3초에(3, 4)에 있었어요. 제공된 연습 자료예요."
    },
    {
     "type": "field",
     "title": "A-1 위치를 나타내기",
     "hint": "가로/세로 축과 눈금·처음/나중 시각을 표시해 그려요. 두 점 거리는 구하지 않아요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "A-2 확인한 것과 모르는 것",
     "hint": "운동했는지의 근거와 아직 구할 수 없는 속력 정보를 구별해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준·두 시각의 위치 변화로 운동을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표를 표현하는 것과 두 점 사이 거리를 구하는 것은 다른 과제예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment-drawing",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 수행평가 B",
   "title": "빠르기를 정량적으로 설명",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "대상",
      "한 길·한 방향 이동 거리",
      "걸린 시간"
     ],
     "rows": [
      [
       "A",
       "12m",
       "6초"
      ],
      [
       "B",
       "15m",
       "5초"
      ]
     ]
    },
    {
     "type": "text",
     "text": "제공된 연습 자료예요. 이동 거리가 다른 두 움직임을 한 수치나 도착 순서만으로 비교하지 않아요."
    },
    {
     "type": "field",
     "title": "B-1 속력과 비교",
     "hint": "두 평균 속력을 단위와 함께 구하고 어떤 기준으로 비교했는지 써요. 계산기를 써도 돼요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "B-2 결론의 범위",
     "hint": "매 순간의 빠르기까지 정할 수 있는지와 더 필요한 자료를 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "거리와 시간을 모두 사용하고 같은 속력 단위로 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "평균 속력과 실제 매 순간 움직임은 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 수행평가 C",
   "title": "안전 행동을 근거로 전달",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    },
    {
     "type": "text",
     "text": "공식 본문의 안전 행동이나 장치 한 가지를 골라 설명 자료를 만들고 교실 안 친구에게 실제로 설명해요."
    },
    {
     "type": "field",
     "title": "C-1 내가 전할 설명",
     "hint": "행동/장치·운동/속력과 연결한 까닭·출처·적용 범위를 담아요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "C-2 실제 공유와 보완",
     "hint": "전달 여부·실제 받은 질문 또는 미수신·수정과 재전달을 구별해 남겨요. 아직 하지 않았다면 계획으로 표시해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설명 문장을 잘 쓴 것과 실제 자료를 제작/공유한 것은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "자료를 만들었다고 실제 전달·질문 수신·재전달이 모두 완료된 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "오답과 다음 확인",
   "title": "어떤 조건을 놓쳤나요?",
   "blocks": [
    {
     "type": "field",
     "title": "다시 볼 문항과 빠진 조건",
     "hint": "문항 번호·내 답·빠뜨린 기준/단위와 고친 까닭을 연결해요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "다음에 실제로 확인할 것",
     "hint": "아직 못 마친 측정/공유·더 필요한 자료와 안전한 다음 행동을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "틀린 답을 고치는 것과 실제 활동을 다시 수행하는 것은 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명/미측정/미수신을 지우지 않고 다음 확인의 출발점으로 사용해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "자료와 범위",
   "title": "이 교재를 읽을 때의 약속",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교육부2022개정 과학과 교육과정6과10-01~03 및 해설: 위치 표현·실제 거리/시간 측정·안전 조사/공유·생활 실천",
      "지필드 이론/실험 교사본에서 직접 검토한 운동 부분과 옛5-2 관련 평가4세트의 개념·측정 구조 참고",
      "128문항은 독립 창작이에요. 제시한 연습 수치와 그림은 실제 학생의 측정 결과가 아니에요.",
      "별도268문항집은 옛 관련 원문70·독립짝70·창작128이에요. 원문7개는 조건/공식 답을 교사와 검토해요.",
      "사진·연습표에서 읽은 정보와 직접 관찰한 정보를 구별해요. 자료에 없는 거리·시간이나 측정 결과를 만들어 넣지 않아요."
     ]
    },
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    },
    {
     "type": "field",
     "title": "생활에서 이어 갈 질문",
     "hint": "오늘부터 실천할 구체 행동과 그 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처가 설명하는 대상·조건·본문의 범위를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진/모형 결과를 실제 자동차의 정확한 수치나 내가 수행한 결과로 바꾸지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  }
 ],
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "물체의 운동",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-cart",
     "caption": ""
    },
    {
     "type": "text",
     "text": "시간에 따라 달라지는 위치를 표현하고 거리와 시간을 실제로 재요. 평균 속력의 뜻을 근거로 설명하고 안전한 생활의 자료를 만들어 나누어요."
    },
    {
     "type": "field",
     "title": "나의 첫 질문",
     "hint": "이름·학습 날짜와 내가 확인해 보고 싶은 움직임을 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "위치 표현 → 실제 측정 → 속력 설명 → 안전 자료 제작/공유로 이어 가요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진과 제시 수치는 설명/연습 자료예요. 실제로 수행한 근거와 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "차례와 사용법",
   "title": "조건을 읽고 근거로 설명해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "차례",
      "문항"
     ],
     "rows": [
      [
       "1. 운동과 위치 표현",
       "1~16번"
      ],
      [
       "2. 시간 간격과 빠르기 변화",
       "17~32번"
      ],
      [
       "3. 같은 거리의 시간 비교",
       "33~48번"
      ],
      [
       "4. 같은 시간의 거리 비교",
       "49~64번"
      ],
      [
       "5. 속력의 의미와 단위",
       "65~80번"
      ],
      [
       "6. 실제 측정과 반복",
       "81~96번"
      ],
      [
       "7. 속력과 안전한 생활",
       "97~112번"
      ],
      [
       "8. 근거를 담은 설명과 공유",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "객관식·빈칸·단답·모두 고르기·연결·순서·서술·그림의8형식을 연습해요. 개념/예제와 실제 활동을 먼저 확인하고 오른쪽에 핵심·더 알아볼 것·내 정리를 이어 써요."
    },
    {
     "type": "field",
     "title": "공부할 때 구별할 것",
     "hint": "실제 측정/제공 자료, 관찰/추측, 완료/계획을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항의 정답과 실제 활동 수행은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "기본 활동2차시80분과16문항 확인30분은 상황에 맞게 나누어 진행해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "운동",
       "시간에 따라 물체의 위치가 변하는 것"
      ],
      [
       "기준",
       "위치를 비교하기 위해 함께 사용하는 고정 장소나 눈금"
      ],
      [
       "좌표",
       "이 교재에서는 (가로 눈금, 세로 눈금) 순서로 나타낸 위치"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-cart",
     "caption": ""
    },
    {
     "type": "text",
     "text": "운동을 확인하려면 **같은 기준**에서 **서로 다른 시각**의 위치를 비교해요. 색이나 모양의 변화만으로 이동했다고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "한 장의 사진으로 모르는 것",
     "hint": "더 필요한 시각·위치·거리/시간 자료를 구별해 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-coordinate-example",
     "caption": ""
    },
    {
     "type": "example",
     "question": "처음 C와 나중 D를 (가로, 세로)로 읽어 보세요.",
     "steps": [
      [
       "기준 확인",
       "두 점이 같은 축과 눈금에 표시되어 있어요."
      ],
      [
       "위치 읽기",
       "C는 가로2·세로1, D는 가로4·세로4예요."
      ],
      [
       "결론 범위",
       "위치가 달라졌다고 말해요. 두 점 거리는 구하지 않아요."
      ]
     ],
     "answer": "C(2, 1), D(4, 4)"
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 1~3",
   "title": "운동의 공통점",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w001",
      "c22-s61-u02-w002",
      "c22-s61-u02-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 4~5",
   "title": "관찰할 기준",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w004",
      "c22-s61-u02-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 6~7",
   "title": "기준이 달라진 사진",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w006",
      "c22-s61-u02-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 8~10",
   "title": "기준의 일관성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w008",
      "c22-s61-u02-w009",
      "c22-s61-u02-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 11~12",
   "title": "좌표와 눈금의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w011",
      "c22-s61-u02-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 13",
   "title": "처음과 나중 위치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 14~15",
   "title": "좌표 표현 절차",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w014",
      "c22-s61-u02-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "운동과 위치 표현 · 16",
   "title": "처음과 나중을 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표는 가로 먼저·세로 나중이에요. 두 점 사이 거리는 계산하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 위치 표현",
   "title": "처음과 나중을 좌표로 나타내요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "같은 눈금 종이에서 표시물의 처음 위치와 시각을 실제로 남겨요.",
      "표시물을 옮긴 뒤 같은 기준의 나중 위치·시각을 남겨요.",
      "아래에 간단한 좌표 평면과 두 점·처음/나중 이름표를 그려 짝과 읽어요. 두 점 거리는 구하지 않아요."
     ]
    },
    {
     "type": "field",
     "title": "우리의 두 위치",
     "hint": "축·눈금·시각과 위치 이름표를 표시해요. 아직 수행하지 않았다면 계획으로 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준에서 처음과 나중의 위치를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표의 순서를 바꾸면 다른 점을 가리킬 수 있어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-coordinate",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "같은 시간 간격",
       "예: 연속한 각2초 구간"
      ],
      [
       "빨라짐",
       "같은 시간에 간 거리가 커지는 모습"
      ],
      [
       "느려짐",
       "같은 시간에 간 거리가 작아지는 모습"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-escalator",
     "caption": ""
    },
    {
     "type": "text",
     "text": "같은 시간마다 간 거리가 같으면 관찰한 구간의 평균 빠르기가 같아요. 거리가 늘거나 줄었다면 그 시간 간격과 함께 변화의 근거를 설명해요."
    },
    {
     "type": "field",
     "title": "항상이라는 말 점검",
     "hint": "출발·멈춤과 운행 중 관찰 구간을 구별해 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "연속한2초 구간",
      "1번째",
      "2번째",
      "3번째"
     ],
     "rows": [
      [
       "한 방향 이동 거리",
       "2m",
       "4m",
       "6m"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 연습 기록의 구간 평균 빠르기는 어떻게 변했나요?",
     "steps": [
      [
       "시간 확인",
       "각 구간은 모두2초예요."
      ],
      [
       "거리 비교",
       "2m→4m→6m로 커졌어요."
      ],
      [
       "범위 한정",
       "제시한 세 구간의 평균 빠르기가 커졌다고 설명해요."
      ]
     ],
     "answer": "같은 시간의 거리가 늘어 구간 평균 빠르기가 커졌어요."
    },
    {
     "type": "field",
     "title": "시간이 다르면?",
     "hint": "거리만 늘었다는 사실로 결론을 낼 수 없는 까닭을 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 17~19",
   "title": "축의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w017",
      "c22-s61-u02-w018",
      "c22-s61-u02-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 20~21",
   "title": "위치 그림의 정보",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w020",
      "c22-s61-u02-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 22~23",
   "title": "한 장의 좌표 그림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w022",
      "c22-s61-u02-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 24~26",
   "title": "빨라짐의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w024",
      "c22-s61-u02-w025",
      "c22-s61-u02-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 27~28",
   "title": "구간 기록 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w027",
      "c22-s61-u02-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 29~30",
   "title": "사진과 빠르기 변화",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w029",
      "c22-s61-u02-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 31",
   "title": "일정함을 설명하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "시간 간격과 빠르기 변화 · 32",
   "title": "같은 시간의 위치 표시",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간 간격의 이동 거리를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체의 이름이나 움직인 방향만으로 빠르기의 변화를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "이동 거리",
       "각자 출발 위치부터 간 길의 길이"
      ],
      [
       "걸린 시간",
       "출발부터 도착까지의 시간"
      ],
      [
       "공정한 측정",
       "같은 기준 부분과 시작/끝 규칙을 사용하는 측정"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-skater",
     "caption": ""
    },
    {
     "type": "text",
     "text": "**같은 거리**라는 조건을 먼저 확인해요. 각자 다른 때 출발했다면 먼저 도착했다는 말만으로 빠르기를 비교할 수 없어요."
    },
    {
     "type": "field",
     "title": "측정 규칙",
     "hint": "수레의 어느 부분이 어느 선을 지날 때 시계를 시작/정지할지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "수레",
      "같은 이동 거리",
      "걸린 시간"
     ],
     "rows": [
      [
       "A",
       "8m",
       "8초"
      ],
      [
       "B",
       "8m",
       "4초"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 구간에서 평균적으로 더 빠른 수레는?",
     "steps": [
      [
       "거리 확인",
       "두 수레가 모두8m를 갔어요."
      ],
      [
       "시간 비교",
       "B의4초가 A의8초보다 짧아요."
      ],
      [
       "판단",
       "같은 거리에 시간이 짧은 B가 더 빨라요."
      ]
     ],
     "answer": "제시 구간에서는 B가 더 빨라요."
    },
    {
     "type": "field",
     "title": "자료가 더 필요한 경우",
     "hint": "이동 거리가 다르거나 출발 시각만 있을 때 무엇을 더 확인할지 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 33~35",
   "title": "같은 거리의 빠르기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w033",
      "c22-s61-u02-w034",
      "c22-s61-u02-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 36~37",
   "title": "같은 거리 비교 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w036",
      "c22-s61-u02-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 38~39",
   "title": "먼저 도착한 장면",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w038",
      "c22-s61-u02-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 40~42",
   "title": "시간의 측정 구간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w040",
      "c22-s61-u02-w041",
      "c22-s61-u02-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 43~44",
   "title": "비교에 쓸 수 있는 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w043",
      "c22-s61-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 45~46",
   "title": "학습용 같은 코스 경기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w045",
      "c22-s61-u02-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 47",
   "title": "다른 거리의 함정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 거리의 시간 비교 · 48",
   "title": "같은 거리 측정 계획도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착한 순서나 시각 하나와 출발부터 도착까지 걸린 시간을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정 준비",
   "title": "같은 부분과 같은 구간을 정해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 비운 평평한 실내 길에서 출발/도착선과 관찰자의 경로 밖 위치를 정해요.",
      "수레의 앞부분 등 같은 부분이 두 선을 지나는 순간으로 시작/끝을 맞춰요.",
      "줄자·초시계 또는 허용된 디지털 도구와 거리/시간 단위를 준비해요."
     ]
    },
    {
     "type": "field",
     "title": "측정 배치와 규칙",
     "hint": "구간·같은 기준 부분·도구·관찰자 위치를 그림과 이름표로 나타내요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 거리를 더 짧은 시간에 가면 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "급한 발사·달리기 경쟁·계단·차도에서 측정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-setup",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "같은 시간",
       "두 움직임을 똑같이 관찰한 시간"
      ],
      [
       "거리 기준",
       "각자의 출발 위치부터 간 거리"
      ],
      [
       "관찰 범위",
       "실제로 본 조건과 회차 안에서 말할 수 있는 결론"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-plane",
     "caption": ""
    },
    {
     "type": "text",
     "text": "시간이 다르면 간 거리가 더 길다는 사실만으로 빠르다고 정하지 않아요. **같은 시간**인지, **각 출발 위치부터 잰 거리**인지 함께 읽어요."
    },
    {
     "type": "field",
     "title": "사진과 시간 자료",
     "hint": "방향·도착 위치·빠르기 변화 중 무엇을 확인했고 무엇을 더 알아야 하는지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "수레",
      "같은 관찰 시간",
      "이동 거리"
     ],
     "rows": [
      [
       "A",
       "4초",
       "80cm"
      ],
      [
       "B",
       "4초",
       "120cm"
      ]
     ]
    },
    {
     "type": "example",
     "question": "연습 자료에서 더 빠른 움직임과 그 근거를 설명하세요.",
     "steps": [
      [
       "시간 확인",
       "두 기록 모두4초 동안의 거리예요."
      ],
      [
       "거리 비교",
       "120cm가80cm보다 길어요."
      ],
      [
       "판단 범위",
       "이번 관찰 조건의 구간 평균으로 비교해요."
      ]
     ],
     "answer": "B가 같은4초에 더 먼 거리를 갔으므로 더 빨라요."
    },
    {
     "type": "field",
     "title": "결과가 달라진 회차",
     "hint": "반복한 두 회차의 순위가 다르면 무엇을 남기고 확인할지 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 49~51",
   "title": "같은 시간의 거리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w049",
      "c22-s61-u02-w050",
      "c22-s61-u02-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 52~53",
   "title": "비교할 시간의 일관성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w052",
      "c22-s61-u02-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 54~55",
   "title": "비교 시간의 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w054",
      "c22-s61-u02-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 56~58",
   "title": "거리의 시작점",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w056",
      "c22-s61-u02-w057",
      "c22-s61-u02-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 59~60",
   "title": "관찰과 확대 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w059",
      "c22-s61-u02-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 61~62",
   "title": "같은 시간의 빠른 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w061",
      "c22-s61-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 63",
   "title": "반복 기록의 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간의 거리 비교 · 64",
   "title": "거리 비교 기록표",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 도착 위치와 같은 이동 거리는 달라요. 각자 출발한 곳부터 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "같은 시간 비교 탐구",
   "title": "같은 시간의 거리를 실제로 재요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 길의 범위에 맞게 정한 짧은 관찰 시간을 두 움직임에 똑같이 적용해요.",
      "각 출발 위치부터 같은 시간 끝의 기준 부분 위치까지 한 방향 이동 거리를 재요.",
      "같은 방법으로3회 반복해 원래 값을 보존해요. 불분명/미측정은 그대로 남겨요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "회차",
      "관찰 시간/단위",
      "A 거리/단위",
      "B 거리/단위"
     ],
     "rows": [
      [
       "1회",
       "",
       "",
       ""
      ],
      [
       "2회",
       "",
       "",
       ""
      ],
      [
       "3회",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "비교한 근거와 조건",
     "hint": "같은 시간인지 확인하고 이번 관찰 구간에서만 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시간에 더 먼 거리를 간 움직임이 평균적으로 더 빨라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "도착 위치가 같아도 각 출발 위치가 다르면 간 거리가 다를 수 있어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "평균 속력",
       "한 구간의 이동 거리를 걸린 시간으로 나눈 양"
      ],
      [
       "m/s",
       "미터를 초로 나눈 속력 단위"
      ],
      [
       "정량적 설명",
       "조건과 수·단위로 근거를 전달하는 설명"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "읽을 것",
      "확인할 점"
     ],
     "rows": [
      [
       "거리와 시간",
       "한 길을 한 방향으로 이동한 같은 구간"
      ],
      [
       "계산",
       "이동 거리÷걸린 시간"
      ],
      [
       "단위",
       "m와s로 계산했다면 m/s"
      ],
      [
       "해석",
       "그 구간의 평균이며 매 순간은 별도 관찰"
      ]
     ]
    },
    {
     "type": "text",
     "text": "숫자만 맞아도 단위가 다르면 다른 양이에요. m/s의 빗금을 지워 ms로 쓰지 않아요. 단위 변환 훈련보다 속력의 뜻과 근거를 이해해요."
    },
    {
     "type": "field",
     "title": "평균이라는 말",
     "hint": "평균 속력이 같아도 중간 움직임이 다를 수 있는 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "한 길을 한 방향으로9m를6초에 이동한 연습 자료의 평균 속력은?",
     "steps": [
      [
       "자료 읽기",
       "이동 거리9m와 걸린 시간6초를 확인해요."
      ],
      [
       "계산하기",
       "9÷6=1.5예요. 계산기를 써도 돼요."
      ],
      [
       "단위와 뜻",
       "1.5m/s로 쓰고 구간 평균으로1초당1.5m인 셈이라고 설명해요."
      ]
     ],
     "answer": "평균 속력은1.5m/s예요."
    },
    {
     "type": "table",
     "heads": [
      "표현",
      "같은 뜻인가요?"
     ],
     "rows": [
      [
       "1.5m/s · 1.50m/s",
       "같은 값과 같은 단위"
      ],
      [
       "1.5ms · 1.5m",
       "같은 속력 표현이 아님"
      ]
     ]
    },
    {
     "type": "field",
     "title": "비교 문장 만들기",
     "hint": "실제 값이면 실제 측정이라고, 연습값이면 제공 자료라고 밝혀 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 65~67",
   "title": "다른 거리와 시간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w065",
      "c22-s61-u02-w066",
      "c22-s61-u02-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 68~69",
   "title": "속력 계산의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w068",
      "c22-s61-u02-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 70~71",
   "title": "두 자료를 같은 기준으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w070",
      "c22-s61-u02-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 72~74",
   "title": "계산에 쓰는 시간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w072",
      "c22-s61-u02-w073",
      "c22-s61-u02-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 75",
   "title": "빗금이 있는 단위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 76",
   "title": "평균과 매 순간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 77~78",
   "title": "같은 단위로 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w077",
      "c22-s61-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 79",
   "title": "정량적으로 전달하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력의 의미와 단위 · 80",
   "title": "비교 자료로 표현하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 길·한 방향의 이동 거리를 걸린 시간으로 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구간 평균 속력이 매 순간의 빠르기를 모두 알려 주지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "반복 측정",
       "같은 방법으로 여러 회차를 실제로 재는 것"
      ],
      [
       "불분명",
       "읽은 순간이나 값을 구별하기 어려운 상태"
      ],
      [
       "미측정",
       "아직 값을 재지 않은 상태"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "motion-cart",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "교사가 통행과 장애물이 없는 낮고 평평한 실내 길을 준비해요. 관찰자는 경로 밖에 서요.",
      "수레를 차분하게 한 길·한 방향으로 움직여요. 출발/도착선·같은 기준 부분·시계 시작/끝 규칙을 정해요.",
      "직접 읽은 값과 단위·회차를 남겨요. 달리기 경쟁·급한 발사·차도 측정은 하지 않아요."
     ]
    },
    {
     "type": "field",
     "title": "우리 측정의 기준",
     "hint": "같은 부분·구간·도구와 관찰 위치를 간단히 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상황",
      "남길 상태"
     ],
     "rows": [
      [
       "시계에2.3초가 표시됨",
       "실제 표시2.3초"
      ],
      [
       "관찰 순간을 놓침",
       "불분명과 그 까닭"
      ],
      [
       "다음 회차를 아직 안 함",
       "미측정과 다음 계획"
      ]
     ]
    },
    {
     "type": "example",
     "question": "제공 연습표로 계산했는데 직접 잰 결과라고 썼어요. 어떻게 고칠까요?",
     "steps": [
      [
       "자료의 성격",
       "책에서 제공한 연습값이었다고 밝혀요."
      ],
      [
       "활동 구별",
       "직접 계산한 것과 거리/시간을 실제로 잰 것은 달라요."
      ],
      [
       "다음 행동",
       "별도로 실제 측정하고 원기록을 남겨요."
      ]
     ],
     "answer": "연습 계산과 실제 측정을 나누어 써요."
    },
    {
     "type": "field",
     "title": "계획과 수행 구별",
     "hint": "오늘 직접 한 것과 아직 남은 일을 구별해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 81~83",
   "title": "측정 장소 정하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w081",
      "c22-s61-u02-w082",
      "c22-s61-u02-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 84~85",
   "title": "공정한 측정 규칙",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w084",
      "c22-s61-u02-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 86~87",
   "title": "우리 모둠의 측정 계획",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w086",
      "c22-s61-u02-w087"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 88~90",
   "title": "한 번의 값만 쓰지 않기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w088",
      "c22-s61-u02-w089",
      "c22-s61-u02-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 91",
   "title": "기기 눈금과 표현",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 92~93",
   "title": "측정을 못 마친 경우",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w092",
      "c22-s61-u02-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 94~95",
   "title": "실제 측정 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w094",
      "c22-s61-u02-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 측정과 반복 · 96",
   "title": "우리 측정 기록 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 거리/시간 측정",
   "title": "원래 값과 회차를 남겨요",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 정한 비운 실내 길에서 차분한 한 방향 움직임을 재요. 같은 기준 부분·시작/끝·구간과 도구를 사용해요."
    },
    {
     "type": "table",
     "heads": [
      "회차",
      "거리/단위",
      "시간/단위",
      "상태·어려움"
     ],
     "rows": [
      [
       "1회",
       "",
       "",
       ""
      ],
      [
       "2회",
       "",
       "",
       ""
      ],
      [
       "3회",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "정한 기준과 비교 조건",
     "hint": "수레 부분·시작/끝·도구/바닥과 달라진 조건을 써요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "내가 확인한 것",
     "hint": "실제로 읽은 값과 불분명/미측정을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준으로 실제 값을 읽고 단위·회차·조건을 보존해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명·미측정을 예상 숫자로 채우지 않아요. 뒤에0을 붙인다고 더 자세히 잰 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "측정값으로 설명하기",
   "title": "값·단위·범위를 함께 전달해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "실제로 읽은 거리와 시간으로 평균 속력을 구해요. 계산기를 써도 돼요.",
      "실제 측정이 아직이면 미측정으로 두고 연습 계산은 별도로 표시해요.",
      "관찰 구간과 같은 단위를 넣어 빠르기 비교를 짝에게 설명해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "사용한 자료/회차",
      "거리÷시간",
      "평균 속력/단위"
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
     "title": "나의 비교 문장",
     "hint": "조건·각 속력·단위와 결론의 범위를 넣어 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계산을 직접 한 것과 거리/시간을 직접 잰 것은 달라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "평균 속력만으로 매 순간의 움직임을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "안전띠",
       "탑승자의 몸이 크게 쏠리는 것을 줄이는 장치"
      ],
      [
       "에어백",
       "안전띠와 함께 탑승자 보호를 돕는 장치"
      ],
      [
       "과속 방지 턱",
       "도로에서 운전자의 감속을 유도하는 장치"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "장치/행동",
      "연결할 역할"
     ],
     "rows": [
      [
       "안전띠",
       "몸을 잡아 주는 탑승자 보호"
      ],
      [
       "에어백",
       "안전띠를 대체하지 않는 보조 보호"
      ],
      [
       "과속 방지 턱",
       "감속 유도"
      ],
      [
       "횡단 전 확인",
       "멈춤·주변과 차량의 움직임/정지 확인"
      ]
     ]
    },
    {
     "type": "text",
     "text": "신호가 바뀌면 모든 차량이 멈췄다고 단정하지 않아요. 건너기 전 주변과 차량을 확인하고 걸어서 건너요."
    },
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "“빠른 자동차는 정확히5m 더 가서 멈춘다”는 설명을 고쳐 보세요.",
     "steps": [
      [
       "관계 읽기",
       "다른 조건이 같을 때 빠를수록 정지까지 더 긴 거리가 필요할 수 있어요."
      ],
      [
       "조건 확인",
       "노면·차량·멈추는 방법과 반응 등 조건이 달라요."
      ],
      [
       "수치 점검",
       "그 자료가 없으므로5m라는 일정한 차이는 근거가 없어요."
      ]
     ],
     "answer": "조건 있는 관계와 정확한 수치 주장을 구별해요."
    },
    {
     "type": "field",
     "title": "실내 모형의 한계",
     "hint": "수레와 실제 자동차의 다른 조건 두 가지와 지금 말할 수 있는 범위를 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 97~99",
   "title": "안전장치의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w097",
      "c22-s61-u02-w098",
      "c22-s61-u02-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 100~101",
   "title": "역할이 맞는 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w100",
      "c22-s61-u02-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 102~103",
   "title": "장치 하나로 충분할까",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w102",
      "c22-s61-u02-w103"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 104~106",
   "title": "길을 건너기 전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w104",
      "c22-s61-u02-w105",
      "c22-s61-u02-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 107",
   "title": "조건을 붙인 안전 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 108~109",
   "title": "행동과 까닭 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w108",
      "c22-s61-u02-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 110~111",
   "title": "안내 문장 다듬기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w110",
      "c22-s61-u02-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "속력과 안전한 생활 · 112",
   "title": "안전장치 안내 카드",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "안전 자료 조사",
   "title": "역할과 까닭을 본문에서 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "확인할 것",
      "내가 남길 내용"
     ],
     "rows": [
      [
       "행동/장치",
       "이름과 역할"
      ],
      [
       "과학적 까닭",
       "운동/속력과 연결한 이유"
      ],
      [
       "출처",
       "기관·제목·주소와 읽은 부분"
      ],
      [
       "적용 범위",
       "모형/실제·확인/미확인 구별"
      ]
     ]
    },
    {
     "type": "field",
     "title": "찾은 근거와 남은 질문",
     "hint": "공식 본문을 실제로 읽고 정지 거리 숫자를 꾸며 넣지 않아요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안전장치의 역할·주변 확인 행동을 운동과 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 거리를 실제 자동차의 정확한 정지 거리로 옮기거나 장치 하나가 모든 사고를 막는다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻/조건"
     ],
     "rows": [
      [
       "출처",
       "다른 사람이 근거를 다시 찾아볼 수 있는 기관·제목·주소 등의 정보"
      ],
      [
       "미수신",
       "아직 질문이나 의견을 받지 못한 상태"
      ],
      [
       "적용 범위",
       "자료나 모형으로 확인할 수 있는 조건과 한계"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "자료에 담을 것",
      "확인할 내용"
     ],
     "rows": [
      [
       "행동/장치",
       "친구가 이해할 구체 행동과 역할"
      ],
      [
       "과학적 까닭",
       "운동/속력과 연결한 근거"
      ],
      [
       "출처와 범위",
       "기관·제목·주소와 확인한 부분"
      ],
      [
       "실제 수행",
       "제작·전달·질문/미수신·수정/재전달"
      ]
     ]
    },
    {
     "type": "text",
     "text": "공식 본문을 실제로 읽고 짧은 안내 카드나 한 장 자료를 만들어요. 교실 안 친구에게 설명하며 긴 보고서나 외부 게시를 기본 과제로 삼지 않아요."
    },
    {
     "type": "field",
     "title": "내가 전할 핵심",
     "hint": "실제 자료와 연결할 행동·까닭·출처를 정해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "초안을 보여 주고 질문을 받아 문장을 고쳤지만 수정본은 아직 보여 주지 않았어요. 현재 상태는?",
     "steps": [
      [
       "완료한 일",
       "초안 공유·질문 수신·문장 수정이에요."
      ],
      [
       "남은 일",
       "수정본 재전달은 아직이에요."
      ],
      [
       "다음 행동",
       "고친 문장을 실제로 보여 주고 오해가 줄었는지 확인할 계획을 세워요."
      ]
     ],
     "answer": "수정 완료와 재전달 완료는 구별해요."
    },
    {
     "type": "field",
     "title": "받지 못한 의견",
     "hint": "질문이 아직 없다면 현재 상태와 다음에 물어볼 것을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 113~115",
   "title": "자료 선택",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w113",
      "c22-s61-u02-w114",
      "c22-s61-u02-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 116~117",
   "title": "설명과 기록의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w116",
      "c22-s61-u02-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 118~119",
   "title": "출처와 내 설명 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w118",
      "c22-s61-u02-w119"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 120~122",
   "title": "아직 질문이 없을 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w120",
      "c22-s61-u02-w121",
      "c22-s61-u02-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 123",
   "title": "수정과 재전달은 다름",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 124~125",
   "title": "질문에 답이 막힐 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w124",
      "c22-s61-u02-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 126~127",
   "title": "실제로 나누고 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w126",
      "c22-s61-u02-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "근거를 담은 설명과 공유 · 128",
   "title": "설명하고 나눌 자료 구성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u02-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "자료 제작",
   "title": "친구에게 전할 설명을 구성해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "안전 행동/장치 한 가지와 필요한 까닭을 분명하게 담아요.",
      "확인한 출처·적용 범위와 실제 측정/제공 자료를 구별해요.",
      "교사가 허용한 종이/디지털 도구로 짧은 안내 자료를 실제로 만들어요."
     ]
    },
    {
     "type": "field",
     "title": "내 자료의 구성",
     "hint": "행동·까닭·출처·범위가 읽히도록 칸 배치나 문장을 구성해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림 솜씨보다 근거와 행동의 연결이 중요해요. 공개 게시나 긴 보고서가 기본 과제는 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-design",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "실제 설명과 보완",
   "title": "받은 질문으로 설명을 고쳐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교실 안 친구에게 자료를 실제로 보여 주고 설명해요.",
      "실제 받은 질문 또는 미수신을 남겨요. 예상 질문을 실제 질문처럼 쓰지 않아요.",
      "고친 문장과 재전달 여부를 구별해요. 아직 하지 않은 일은 다음 계획으로 남겨요."
     ]
    },
    {
     "type": "field",
     "title": "전달한 때·상대·방법",
     "hint": "아직 공유하지 않았다면 계획이라고 밝혀요.",
     "lines": 3,
     "draw": false
    },
    {
     "type": "field",
     "title": "받은 질문 또는 미수신",
     "hint": "실제 상태와 다음에 물어볼 것을 구별해요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "고친 설명과 재전달",
     "hint": "이전/고친 문장·근거와 실제 재전달 여부를 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 제작·전달·질문/미수신·수정/재전달을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장 입력이나 자료 제작만으로 실제 공유 완료를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 정리",
   "title": "관찰·계산·소통의 근거",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "확인할 내용",
      "내가 읽을 근거"
     ],
     "rows": [
      [
       "운동",
       "같은 기준·두 시각의 위치"
      ],
      [
       "좌표",
       "가로/세로 순서·처음/나중 이름표"
      ],
      [
       "빠르기 비교",
       "같은 거리/시간 또는 같은 단위의 속력"
      ],
      [
       "실제 측정",
       "원래 값·단위·반복과 불분명/미측정"
      ],
      [
       "안전 설명",
       "역할·출처·적용 범위·실제 전달/보완"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각에서 달라진 점",
     "hint": "맞힌 개수와 실제 수행을 구별하고 구체적인 근거를 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 가지 숫자나 사진만으로 모든 움직임을 설명하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표 두 점 거리 계산·단위 변환 훈련보다 의미와 정량적 의사소통을 중심으로 해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 수행평가 A",
   "title": "위치 변화와 표현",
   "blocks": [
    {
     "type": "text",
     "text": "같은 좌표 기준에서 한 표시물은0초에(1, 4),3초에(3, 4)에 있었어요. 제공된 연습 자료예요."
    },
    {
     "type": "field",
     "title": "A-1 위치를 나타내기",
     "hint": "가로/세로 축과 눈금·처음/나중 시각을 표시해 그려요. 두 점 거리는 구하지 않아요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "A-2 확인한 것과 모르는 것",
     "hint": "운동했는지의 근거와 아직 구할 수 없는 속력 정보를 구별해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기준·두 시각의 위치 변화로 운동을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "좌표를 표현하는 것과 두 점 사이 거리를 구하는 것은 다른 과제예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment-drawing",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 수행평가 B",
   "title": "빠르기를 정량적으로 설명",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "대상",
      "한 길·한 방향 이동 거리",
      "걸린 시간"
     ],
     "rows": [
      [
       "A",
       "12m",
       "6초"
      ],
      [
       "B",
       "15m",
       "5초"
      ]
     ]
    },
    {
     "type": "text",
     "text": "제공된 연습 자료예요. 이동 거리가 다른 두 움직임을 한 수치나 도착 순서만으로 비교하지 않아요."
    },
    {
     "type": "field",
     "title": "B-1 속력과 비교",
     "hint": "두 평균 속력을 단위와 함께 구하고 어떤 기준으로 비교했는지 써요. 계산기를 써도 돼요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "B-2 결론의 범위",
     "hint": "매 순간의 빠르기까지 정할 수 있는지와 더 필요한 자료를 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "거리와 시간을 모두 사용하고 같은 속력 단위로 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "평균 속력과 실제 매 순간 움직임은 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "단원 수행평가 C",
   "title": "안전 행동을 근거로 전달",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    },
    {
     "type": "text",
     "text": "공식 본문의 안전 행동이나 장치 한 가지를 골라 설명 자료를 만들고 교실 안 친구에게 실제로 설명해요."
    },
    {
     "type": "field",
     "title": "C-1 내가 전할 설명",
     "hint": "행동/장치·운동/속력과 연결한 까닭·출처·적용 범위를 담아요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "C-2 실제 공유와 보완",
     "hint": "전달 여부·실제 받은 질문 또는 미수신·수정과 재전달을 구별해 남겨요. 아직 하지 않았다면 계획으로 표시해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설명 문장을 잘 쓴 것과 실제 자료를 제작/공유한 것은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "자료를 만들었다고 실제 전달·질문 수신·재전달이 모두 완료된 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "오답과 다음 확인",
   "title": "어떤 조건을 놓쳤나요?",
   "blocks": [
    {
     "type": "field",
     "title": "다시 볼 문항과 빠진 조건",
     "hint": "문항 번호·내 답·빠뜨린 기준/단위와 고친 까닭을 연결해요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "다음에 실제로 확인할 것",
     "hint": "아직 못 마친 측정/공유·더 필요한 자료와 안전한 다음 행동을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "틀린 답을 고치는 것과 실제 활동을 다시 수행하는 것은 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "불분명/미측정/미수신을 지우지 않고 다음 확인의 출발점으로 사용해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "section": "자료와 범위",
   "title": "이 교재를 읽을 때의 약속",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교육부2022개정 과학과 교육과정6과10-01~03 및 해설: 위치 표현·실제 거리/시간 측정·안전 조사/공유·생활 실천",
      "지필드 이론/실험 교사본에서 직접 검토한 운동 부분과 옛5-2 관련 평가4세트의 개념·측정 구조 참고",
      "128문항은 독립 창작이에요. 제시한 연습 수치와 그림은 실제 학생의 측정 결과가 아니에요.",
      "별도268문항집은 옛 관련 원문70·독립짝70·창작128이에요. 원문7개는 조건/공식 답을 교사와 검토해요.",
      "사진·연습표에서 읽은 정보와 직접 관찰한 정보를 구별해요. 자료에 없는 거리·시간이나 측정 결과를 만들어 넣지 않아요."
     ]
    },
    {
     "type": "diagram",
     "key": "motion-source-links",
     "caption": ""
    },
    {
     "type": "field",
     "title": "생활에서 이어 갈 질문",
     "hint": "오늘부터 실천할 구체 행동과 그 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처가 설명하는 대상·조건·본문의 범위를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진/모형 결과를 실제 자동차의 정확한 수치나 내가 수행한 결과로 바꾸지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "motion-workbook"
  },
  {
   "kind": "duplex-blank",
   "layout": "motion-workbook"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w001",
      "c22-s61-u02-w002",
      "c22-s61-u02-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 4~6",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w004",
      "c22-s61-u02-w005",
      "c22-s61-u02-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 7~9",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w007",
      "c22-s61-u02-w008",
      "c22-s61-u02-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 10~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w010",
      "c22-s61-u02-w011",
      "c22-s61-u02-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 13~15",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w013",
      "c22-s61-u02-w014",
      "c22-s61-u02-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 16~18",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w016",
      "c22-s61-u02-w017",
      "c22-s61-u02-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 19~21",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w019",
      "c22-s61-u02-w020",
      "c22-s61-u02-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 22~24",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w022",
      "c22-s61-u02-w023",
      "c22-s61-u02-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 25~27",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w025",
      "c22-s61-u02-w026",
      "c22-s61-u02-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 28~30",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w028",
      "c22-s61-u02-w029",
      "c22-s61-u02-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 31~33",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w031",
      "c22-s61-u02-w032",
      "c22-s61-u02-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 34~36",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w034",
      "c22-s61-u02-w035",
      "c22-s61-u02-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 37~39",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w037",
      "c22-s61-u02-w038",
      "c22-s61-u02-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 40~42",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w040",
      "c22-s61-u02-w041",
      "c22-s61-u02-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 43~45",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w043",
      "c22-s61-u02-w044",
      "c22-s61-u02-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 46~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w046",
      "c22-s61-u02-w047",
      "c22-s61-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 49~51",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w049",
      "c22-s61-u02-w050",
      "c22-s61-u02-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 52~54",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w052",
      "c22-s61-u02-w053",
      "c22-s61-u02-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 55~57",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w055",
      "c22-s61-u02-w056",
      "c22-s61-u02-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 58~60",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w058",
      "c22-s61-u02-w059",
      "c22-s61-u02-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 61~63",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w061",
      "c22-s61-u02-w062",
      "c22-s61-u02-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 64~66",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w064",
      "c22-s61-u02-w065",
      "c22-s61-u02-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 67~69",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w067",
      "c22-s61-u02-w068",
      "c22-s61-u02-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 70~72",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w070",
      "c22-s61-u02-w071",
      "c22-s61-u02-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 73~75",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w073",
      "c22-s61-u02-w074",
      "c22-s61-u02-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 76~78",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w076",
      "c22-s61-u02-w077",
      "c22-s61-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 79~81",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w079",
      "c22-s61-u02-w080",
      "c22-s61-u02-w081"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 82~84",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w082",
      "c22-s61-u02-w083",
      "c22-s61-u02-w084"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 85~86",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w085",
      "c22-s61-u02-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 87~89",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w087",
      "c22-s61-u02-w088",
      "c22-s61-u02-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 90~92",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w090",
      "c22-s61-u02-w091",
      "c22-s61-u02-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 93~95",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w093",
      "c22-s61-u02-w094",
      "c22-s61-u02-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 96~98",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w096",
      "c22-s61-u02-w097",
      "c22-s61-u02-w098"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 99~101",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w099",
      "c22-s61-u02-w100",
      "c22-s61-u02-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 102~104",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w102",
      "c22-s61-u02-w103",
      "c22-s61-u02-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 105~107",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w105",
      "c22-s61-u02-w106",
      "c22-s61-u02-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 108~109",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w108",
      "c22-s61-u02-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 110~111",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w110",
      "c22-s61-u02-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 112~114",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w112",
      "c22-s61-u02-w113",
      "c22-s61-u02-w114"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 115~117",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w115",
      "c22-s61-u02-w116",
      "c22-s61-u02-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 118~119",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w118",
      "c22-s61-u02-w119"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 120~122",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w120",
      "c22-s61-u02-w121",
      "c22-s61-u02-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 123~124",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w123",
      "c22-s61-u02-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 125~126",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w125",
      "c22-s61-u02-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 127~128",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u02-w127",
      "c22-s61-u02-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 계획/설명은 조건과 근거로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시와 실제 측정/그림/공유 수행은 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "단원 수행평가 A · 교사용",
   "title": "수행평가 A 확인 기준",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "heading",
     "text": "예시 답과 수행 확인"
    },
    {
     "type": "text",
     "text": "처음(1, 4)과 나중(3, 4)을 같은 축에 시각과 함께 표시한다. 위치가 달라 운동했음을 설명한다. 이 좌표에서 두 점 거리를 구하거나 실제 속력을 임의로 만들지 않는다."
    },
    {
     "type": "heading",
     "text": "인정 기준"
    },
    {
     "type": "text",
     "text": "가로/세로 순서·같은 기준·시간 이름표·위치 변화 근거를 확인한다. 숫자3초만으로 이동 거리나 평균 속력을 구했다고 인정하지 않는다."
    },
    {
     "type": "field",
     "title": "지도와 피드백",
     "hint": "표현이 달라도 타당한 근거를 인정하고 다음에 실제로 확인할 일을 남겨요.",
     "lines": 9,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기본128문항의 자동 정오와 세 수행과제는 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장을 썼다는 사실만으로 실제 측정/공유 완료나 공식 성적을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "단원 수행평가 B · 교사용",
   "title": "수행평가 B 확인 기준",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "heading",
     "text": "예시 답과 수행 확인"
    },
    {
     "type": "text",
     "text": "A는12÷6=2m/s,B는15÷5=3m/s이다. 같은 단위로 나타낸 이 구간 평균은 B가 더 빠르다. 매 순간의 빠르기는 시간별 위치/거리 자료가 더 필요하다."
    },
    {
     "type": "heading",
     "text": "인정 기준"
    },
    {
     "type": "text",
     "text": "두 속력의 수/단위·비교 대상·한 길/한 방향 구간과 평균이라는 범위를 함께 확인한다. 거리나 시간 하나만 사용한 판단을 구별한다."
    },
    {
     "type": "field",
     "title": "지도와 피드백",
     "hint": "표현이 달라도 타당한 근거를 인정하고 다음에 실제로 확인할 일을 남겨요.",
     "lines": 9,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기본128문항의 자동 정오와 세 수행과제는 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장을 썼다는 사실만으로 실제 측정/공유 완료나 공식 성적을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "단원 수행평가 C · 교사용",
   "title": "수행평가 C 확인 기준",
   "kind": "answers",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "heading",
     "text": "예시 답과 수행 확인"
    },
    {
     "type": "text",
     "text": "예: 횡단 전에 멈춰 주변·차량의 정지를 확인하고 걸어서 건넌다는 행동을 공식 본문/운동과 연결한다. 출처와 범위를 밝힌 짧은 자료를 실제로 만들고 설명한 뒤 실제 질문/미수신과 수정/재전달을 구별한다."
    },
    {
     "type": "heading",
     "text": "인정 기준"
    },
    {
     "type": "text",
     "text": "역할/행동·과학적 까닭·관련 본문/출처·범위를 확인한다. 제작/공유 수행은 자료와 실제 행동으로 별도 확인한다. 못 한 일은 계획이며 임의의 정지 거리 수치나 질문/칭찬을 만들어 넣지 않는다."
    },
    {
     "type": "field",
     "title": "지도와 피드백",
     "hint": "표현이 달라도 타당한 근거를 인정하고 다음에 실제로 확인할 일을 남겨요.",
     "lines": 9,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기본128문항의 자동 정오와 세 수행과제는 별도로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모범 문장을 썼다는 사실만으로 실제 측정/공유 완료나 공식 성적을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~28번",
   "kind": "quick",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-quick-0",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술/그림은 예시가 곧 자동 정답이나 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "29~56번",
   "kind": "quick",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-quick-28",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술/그림은 예시가 곧 자동 정답이나 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "57~84번",
   "kind": "quick",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-quick-56",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술/그림은 예시가 곧 자동 정답이나 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "85~112번",
   "kind": "quick",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-quick-84",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술/그림은 예시가 곧 자동 정답이나 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "113~128번",
   "kind": "quick",
   "layout": "motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "motion-quick-112",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술/그림은 예시가 곧 자동 정답이나 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "놓친 조건·내가 확인한 근거와 다음 질문을 남겨요.",
     "write": 5
    }
   ]
  }
 ],
 "figures": {
  "motion-question-3": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">대상</th><th scope=\"col\">0초 위치(눈금)</th><th scope=\"col\">2초 위치(눈금)</th></tr></thead><tbody><tr><th scope=\"row\">공</th><td>1</td><td>4</td></tr><tr><th scope=\"row\">책장</th><td>6</td><td>6</td></tr></tbody></table>",
  "motion-question-9": "<svg class=\"motion-coordinate-plot\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 340 326\" role=\"img\" aria-label=\"가로와 세로의 0부터 5까지 같은 간격 눈금 및 P의 위치 그림\" style=\"display:block;width:100%;max-width:340px;height:auto;margin:12px auto;font-family:Pretendard,sans-serif;font-size:17px;fill:#22334b\"><path d=\"M50 40V270M50 270H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"50\" y=\"293\" text-anchor=\"middle\">0</text><path d=\"M96 40V270M50 224H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"96\" y=\"293\" text-anchor=\"middle\">1</text><text x=\"35\" y=\"230\" text-anchor=\"end\">1</text><path d=\"M142 40V270M50 178H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"142\" y=\"293\" text-anchor=\"middle\">2</text><text x=\"35\" y=\"184\" text-anchor=\"end\">2</text><path d=\"M188 40V270M50 132H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"188\" y=\"293\" text-anchor=\"middle\">3</text><text x=\"35\" y=\"138\" text-anchor=\"end\">3</text><path d=\"M234 40V270M50 86H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"234\" y=\"293\" text-anchor=\"middle\">4</text><text x=\"35\" y=\"92\" text-anchor=\"end\">4</text><path d=\"M280 40V270M50 40H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"280\" y=\"293\" text-anchor=\"middle\">5</text><text x=\"35\" y=\"46\" text-anchor=\"end\">5</text><path d=\"M50 29V270H299\" fill=\"none\" stroke=\"#33465f\" stroke-width=\"2\"/><text x=\"15\" y=\"22\">세로</text><text x=\"290\" y=\"318\" text-anchor=\"end\">가로</text><g fill=\"#173d77\" data-point=\"P\"><circle cx=\"188\" cy=\"178\" r=\"6\"/><text x=\"199\" y=\"168\" font-weight=\"700\">P</text></g></svg>",
  "motion-question-13": "<svg class=\"motion-coordinate-plot\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 340 326\" role=\"img\" aria-label=\"가로와 세로의 0부터 5까지 같은 간격 눈금 및 A 처음, B 나중의 위치 그림\" style=\"display:block;width:100%;max-width:340px;height:auto;margin:12px auto;font-family:Pretendard,sans-serif;font-size:17px;fill:#22334b\"><path d=\"M50 40V270M50 270H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"50\" y=\"293\" text-anchor=\"middle\">0</text><path d=\"M96 40V270M50 224H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"96\" y=\"293\" text-anchor=\"middle\">1</text><text x=\"35\" y=\"230\" text-anchor=\"end\">1</text><path d=\"M142 40V270M50 178H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"142\" y=\"293\" text-anchor=\"middle\">2</text><text x=\"35\" y=\"184\" text-anchor=\"end\">2</text><path d=\"M188 40V270M50 132H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"188\" y=\"293\" text-anchor=\"middle\">3</text><text x=\"35\" y=\"138\" text-anchor=\"end\">3</text><path d=\"M234 40V270M50 86H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"234\" y=\"293\" text-anchor=\"middle\">4</text><text x=\"35\" y=\"92\" text-anchor=\"end\">4</text><path d=\"M280 40V270M50 40H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"280\" y=\"293\" text-anchor=\"middle\">5</text><text x=\"35\" y=\"46\" text-anchor=\"end\">5</text><path d=\"M50 29V270H299\" fill=\"none\" stroke=\"#33465f\" stroke-width=\"2\"/><text x=\"15\" y=\"22\">세로</text><text x=\"290\" y=\"318\" text-anchor=\"end\">가로</text><g fill=\"#173d77\" data-point=\"A 처음\"><circle cx=\"96\" cy=\"178\" r=\"6\"/><text x=\"107\" y=\"168\" font-weight=\"700\">A 처음</text></g><g fill=\"#173d77\" data-point=\"B 나중\"><rect x=\"228\" y=\"126\" width=\"12\" height=\"12\"/><text x=\"245\" y=\"122\" font-weight=\"700\">B 나중</text></g></svg>",
  "motion-question-33": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">이름</th><th scope=\"col\">걸린 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">민준</th><td>8</td></tr><tr><th scope=\"row\">수아</th><td>6</td></tr><tr><th scope=\"row\">다온</th><td>10</td></tr></tbody></table>",
  "motion-question-35": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">수레</th><th scope=\"col\">걸린 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>4</td></tr><tr><th scope=\"row\">나</th><td>8</td></tr><tr><th scope=\"row\">다</th><td>5</td></tr></tbody></table>",
  "motion-question-42": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">로봇</th><th scope=\"col\">걸린 시간(초)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>9</td></tr><tr><th scope=\"row\">나</th><td>6</td></tr><tr><th scope=\"row\">다</th><td>12</td></tr></tbody></table>",
  "motion-question-49": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">로봇</th><th scope=\"col\">이동 거리(cm)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>60</td></tr><tr><th scope=\"row\">나</th><td>120</td></tr><tr><th scope=\"row\">다</th><td>90</td></tr></tbody></table>",
  "motion-question-57": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">로봇</th><th scope=\"col\">이동 거리(cm)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>60</td></tr><tr><th scope=\"row\">나</th><td>120</td></tr><tr><th scope=\"row\">다</th><td>90</td></tr><tr><th scope=\"row\">라</th><td>150</td></tr></tbody></table>",
  "motion-question-61": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">수레</th><th scope=\"col\">이동 거리(cm)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>120</td></tr><tr><th scope=\"row\">나</th><td>90</td></tr><tr><th scope=\"row\">다</th><td>150</td></tr></tbody></table>",
  "motion-question-65": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">수레</th><th scope=\"col\">이동 거리(m)</th><th scope=\"col\">걸린 시간(s)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>6</td><td>3</td></tr><tr><th scope=\"row\">나</th><td>12</td><td>4</td></tr></tbody></table>",
  "motion-question-77": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">로봇</th><th scope=\"col\">평균 속력(m/s)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>0.8</td></tr><tr><th scope=\"row\">나</th><td>1</td></tr><tr><th scope=\"row\">다</th><td>1.2</td></tr><tr><th scope=\"row\">라</th><td>0.5</td></tr></tbody></table>",
  "motion-question-89": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">회차</th><th scope=\"col\">1m 이동 시간</th></tr></thead><tbody><tr><th scope=\"row\">1회</th><td>2.1초</td></tr><tr><th scope=\"row\">2회</th><td>불분명</td></tr><tr><th scope=\"row\">3회</th><td>2.3초</td></tr><tr><th scope=\"row\">4회</th><td>미측정</td></tr></tbody></table>",
  "motion-question-115": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">카드 수</th></tr></thead><tbody><tr><th scope=\"row\">제작 완료</th><td>6</td></tr><tr><th scope=\"row\">친구에게 전달 완료</th><td>4</td></tr><tr><th scope=\"row\">아직 전달하지 않음</th><td>2</td></tr></tbody></table>",
  "motion-question-121": "<table class=\"ed-table motion-data-table\"><caption>풀이를 위한 연습 자료</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">현재 상태</th></tr></thead><tbody><tr><th scope=\"row\">출처 주소 추가</th><td>수정 완료</td></tr><tr><th scope=\"row\">모든 차라는 표현 고치기</th><td>수정 완료</td></tr><tr><th scope=\"row\">글자 크기 키우기</th><td>다음 수정 계획</td></tr></tbody></table>",
  "motion-cart": "<div class=\"ed-photo motion-book-photo\"><img src=\"../assets/book/s31-u01-photo-cart.webp\" alt=\"블록을 실은 작은 나무 수레\" decoding=\"async\"><p class=\"ed-photo-note\">수레의 모습을 떠올리는 장면이에요. 이 사진 한 장으로 운동 여부나 속력을 정하지 않아요.</p><small class=\"ed-photo-credit\">도구를 설명하는 장면 · 실제 측정은 별도로 진행해요.</small></div>",
  "motion-escalator": "<div class=\"ed-photo motion-book-photo\"><img src=\"../assets/bank/c22-s61-u02/s1-q05.webp\" alt=\"계단과 나란히 설치된 자동계단\" decoding=\"async\"><p class=\"ed-photo-note\">자동계단의 빠르기가 항상 일정하다고 할 수 있을까요? 작동 구간과 시간별 위치 자료를 더 확인해요.</p><small class=\"ed-photo-credit\">관련 평가 자료의 사진 · 사진 속 순간과 시간별 기록을 구별해요.</small></div>",
  "motion-skater": "<div class=\"ed-photo motion-book-photo\"><img src=\"../assets/bank/c22-s61-u02/s2-q05.webp\" alt=\"빙판에서 자세를 낮춘 스케이팅 선수\" decoding=\"async\"><p class=\"ed-photo-note\">같은 거리의 기록이라면 걸린 시간으로 비교해요. 이 사진에는 그 거리와 시간 기록이 없어요.</p><small class=\"ed-photo-credit\">관련 평가 자료의 사진 · 특정 경기의 결과를 정하는 자료가 아니에요.</small></div>",
  "motion-plane": "<div class=\"ed-photo motion-book-photo\"><img src=\"../assets/bank/c22-s61-u02/s4-q05.webp\" alt=\"활주로를 배경으로 촬영한 비행기\" decoding=\"async\"><p class=\"ed-photo-note\">높이가 낮아지는 방향과 빨라짐·느려짐은 다른 정보예요. 사진 한 장에서 빠르기 변화를 확정하지 않아요.</p><small class=\"ed-photo-credit\">관련 평가 자료의 사진 · 같은 시간 간격의 관찰을 더 확인해요.</small></div>",
  "motion-coordinate-example": "<svg class=\"motion-coordinate-plot\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 340 326\" role=\"img\" aria-label=\"가로와 세로의 0부터 5까지 같은 간격 눈금 및 C 처음, D 나중의 위치 그림\" style=\"display:block;width:100%;max-width:340px;height:auto;margin:12px auto;font-family:Pretendard,sans-serif;font-size:17px;fill:#22334b\"><path d=\"M50 40V270M50 270H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"50\" y=\"293\" text-anchor=\"middle\">0</text><path d=\"M96 40V270M50 224H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"96\" y=\"293\" text-anchor=\"middle\">1</text><text x=\"35\" y=\"230\" text-anchor=\"end\">1</text><path d=\"M142 40V270M50 178H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"142\" y=\"293\" text-anchor=\"middle\">2</text><text x=\"35\" y=\"184\" text-anchor=\"end\">2</text><path d=\"M188 40V270M50 132H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"188\" y=\"293\" text-anchor=\"middle\">3</text><text x=\"35\" y=\"138\" text-anchor=\"end\">3</text><path d=\"M234 40V270M50 86H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"234\" y=\"293\" text-anchor=\"middle\">4</text><text x=\"35\" y=\"92\" text-anchor=\"end\">4</text><path d=\"M280 40V270M50 40H280\" stroke=\"#ccd5e2\" stroke-width=\"1\"/><text x=\"280\" y=\"293\" text-anchor=\"middle\">5</text><text x=\"35\" y=\"46\" text-anchor=\"end\">5</text><path d=\"M50 29V270H299\" fill=\"none\" stroke=\"#33465f\" stroke-width=\"2\"/><text x=\"15\" y=\"22\">세로</text><text x=\"290\" y=\"318\" text-anchor=\"end\">가로</text><g fill=\"#173d77\" data-point=\"C 처음\"><circle cx=\"142\" cy=\"224\" r=\"6\"/><text x=\"153\" y=\"214\" font-weight=\"700\">C 처음</text></g><g fill=\"#173d77\" data-point=\"D 나중\"><rect x=\"228\" y=\"80\" width=\"12\" height=\"12\"/><text x=\"245\" y=\"76\" font-weight=\"700\">D 나중</text></g></svg>",
  "motion-source-links": "<ul class=\"motion-book-sources\"><li><a href=\"https://www.safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?actsHeaderTitle=%EA%B5%90%ED%86%B5%EC%82%AC%EA%B3%A0&amp;category=trafficAccident&amp;menuSn=4\">국민안전24 · 교통사고 행동요령</a><p>「안전한 도로횡단을 위해서는」의 멈춤·주변과 차량 확인 부분을 읽어요.</p></li><li><a href=\"https://www.nhtsa.gov/vehicle-safety/seat-belts\">NHTSA · Seat Belts</a><p>안전띠와 에어백의 관계를 확인해요. 나머지 성인 안내나 통계 수치를 이 활동에 그대로 옮기지 않아요.</p></li></ul>",
  "motion-quick-0": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">2</th><td>빈칸</td><td>운동</td></tr><tr><th scope=\"row\">3</th><td>단답</td><td>공</td></tr><tr><th scope=\"row\">4</th><td>복수</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">5</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄴ</td></tr><tr><th scope=\"row\">6</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">7</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">8</th><td>빈칸</td><td>같은</td></tr><tr><th scope=\"row\">9</th><td>단답</td><td>(3, 2)</td></tr><tr><th scope=\"row\">10</th><td>빈칸</td><td>가로</td></tr><tr><th scope=\"row\">11</th><td>연결</td><td>(1) ㄴ (2) ㄱ (3) ㄷ</td></tr><tr><th scope=\"row\">12</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">13</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">14</th><td>순서</td><td>ㄴ → ㄱ → ㄷ → ㄹ</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">15</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">16</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">18</th><td>빈칸</td><td>나중</td></tr><tr><th scope=\"row\">19</th><td>단답</td><td>세로</td></tr><tr><th scope=\"row\">20</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">21</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">22</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">23</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">24</th><td>빈칸</td><td>빨라</td></tr><tr><th scope=\"row\">25</th><td>단답</td><td>점점 느려졌다</td></tr><tr><th scope=\"row\">26</th><td>단답</td><td>확정할 수 없다</td></tr><tr><th scope=\"row\">27</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">28</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>",
  "motion-quick-28": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">29</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">30</th><td>순서</td><td>ㄷ → ㄱ → ㄹ → ㄴ</td></tr><tr><th scope=\"row\">31</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">32</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">33</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">34</th><td>빈칸</td><td>짧을</td></tr><tr><th scope=\"row\">35</th><td>단답</td><td>나</td></tr><tr><th scope=\"row\">36</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">37</th><td>연결</td><td>(1) ㄷ (2) ㄱ (3) ㄴ</td></tr><tr><th scope=\"row\">38</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">39</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">40</th><td>빈칸</td><td>출발</td></tr><tr><th scope=\"row\">41</th><td>단답</td><td>같다</td></tr><tr><th scope=\"row\">42</th><td>복수</td><td>①, ②, ③</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">43</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄴ</td></tr><tr><th scope=\"row\">44</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">45</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">46</th><td>빈칸</td><td>빠르다</td></tr><tr><th scope=\"row\">47</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">48</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">49</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">50</th><td>빈칸</td><td>길</td></tr><tr><th scope=\"row\">51</th><td>단답</td><td>가</td></tr><tr><th scope=\"row\">52</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">53</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">54</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">55</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">56</th><td>빈칸</td><td>출발</td></tr></tbody></table></div>",
  "motion-quick-56": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">57</th><td>단답</td><td>나, 라</td></tr><tr><th scope=\"row\">58</th><td>복수</td><td>③, ⑤</td></tr><tr><th scope=\"row\">59</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄴ</td></tr><tr><th scope=\"row\">60</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">61</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">62</th><td>단답</td><td>같다</td></tr><tr><th scope=\"row\">63</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">66</th><td>빈칸</td><td>속력</td></tr><tr><th scope=\"row\">67</th><td>단답</td><td>3m/s</td></tr><tr><th scope=\"row\">68</th><td>복수</td><td>②, ④, ⑤</td></tr><tr><th scope=\"row\">69</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">70</th><td>서술</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">71</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">72</th><td>빈칸</td><td>시간</td></tr><tr><th scope=\"row\">73</th><td>단답</td><td>0.5m/s</td></tr><tr><th scope=\"row\">74</th><td>복수</td><td>①, ③</td></tr><tr><th scope=\"row\">75</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">76</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">78</th><td>순서</td><td>ㄷ → ㄱ → ㄹ → ㄴ</td></tr><tr><th scope=\"row\">79</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">82</th><td>빈칸</td><td>단위</td></tr><tr><th scope=\"row\">83</th><td>단답</td><td>0.5m/s</td></tr><tr><th scope=\"row\">84</th><td>복수</td><td>②, ③, ④</td></tr></tbody></table></div>",
  "motion-quick-84": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">86</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">87</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">88</th><td>빈칸</td><td>반복</td></tr><tr><th scope=\"row\">89</th><td>단답</td><td>2개</td></tr><tr><th scope=\"row\">90</th><td>복수</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">91</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">92</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">93</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">94</th><td>순서</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">95</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">97</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">98</th><td>빈칸</td><td>안전띠</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">99</th><td>단답</td><td>속력을 줄이는 행동</td></tr><tr><th scope=\"row\">100</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">101</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">102</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">103</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">104</th><td>빈칸</td><td>멈추어</td></tr><tr><th scope=\"row\">105</th><td>단답</td><td>자료 부족</td></tr><tr><th scope=\"row\">106</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">107</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">108</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">109</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">110</th><td>순서</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">111</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">112</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>",
  "motion-quick-112": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">113</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">114</th><td>빈칸</td><td>출처</td></tr><tr><th scope=\"row\">115</th><td>단답</td><td>4장</td></tr><tr><th scope=\"row\">116</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">117</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">118</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">119</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">120</th><td>빈칸</td><td>미수신</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">121</th><td>단답</td><td>2개</td></tr><tr><th scope=\"row\">122</th><td>복수</td><td>①, ②, ⑤</td></tr><tr><th scope=\"row\">123</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">124</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">125</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">126</th><td>순서</td><td>ㄷ → ㄱ → ㄹ → ㄴ</td></tr><tr><th scope=\"row\">127</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">128</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>"
 },
 "duplexAnswerStartsOnRecto": true
};

export const observationPriorWorkbook=withMotionEditorial(baseWorkbook);
export const motionPhotoPriorWorkbook=withObservationLanguage(observationPriorWorkbook);
export const workbook=withMotionPhotoLanguage(motionPhotoPriorWorkbook);
