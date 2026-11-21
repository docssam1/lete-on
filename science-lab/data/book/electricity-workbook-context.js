export const ELECTRICITY_CONTEXT_VERSION='20261116-electricity-workbook-context';
// Guard exact current rows/pages and retain complete previous question snapshots.
const review={
 "patches": [
  {
   "previous": {
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
    "explanation": "전선 안쪽 구리에는 전기가 잘 통해요. 바깥의 절연 피복은 뜻하지 않은 접촉을 막는 데 써요. 전선의 안과 밖은 재료와 하는 일이 달라요.",
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
   "fields": {
    "prompt": "전선 안쪽 구리는 (1)가 잘 통하고, 전기가 잘 통하지 않는 겉부분인 절연 피복은 뜻하지 않은 (2)을 막아요. 보기: 전기·접촉"
   }
  },
  {
   "previous": {
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
    "explanation": "옆 금속과 바닥 금속은 따로 표시하고 유리와 구별해요. 접점 위치를 그리는 것이지 회로를 만들어 켜 본 결과를 나타내는 것은 아니에요.",
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
   "fields": {
    "criteria": "분해하지 않은 전구의 두 금속 접점 위치를 구별한다. / 옆 금속·바닥 금속·유리에 이름표를 붙인다. / 아직 연결선은 그리지 않는다.",
    "requirements": [
     "분해하지 않은 전구의 두 금속 접점 위치를 구별한다.",
     "옆 금속·바닥 금속·유리에 이름표를 붙인다.",
     "아직 연결선은 그리지 않는다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
     "required": [
      "분해하지 않은 전구의 두 금속 접점 위치를 구별한다.",
      "옆 금속·바닥 금속·유리에 이름표를 붙인다.",
      "아직 연결선은 그리지 않는다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
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
    "explanation": "중간이 빈 (1)은 ㄴ, 같은 전지 극에만 이어진 (2)는 ㄷ, 바르게 이어진 (3)은 ㄱ이에요. 꺼진 두 회로도 고칠 곳이 서로 달라요.",
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
    "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
    "given": [
     "ㄱ 정상이라면 켜질 수 있는 연결",
     "ㄴ 돌아오는 길에 빈 구간이 있음",
     "ㄷ 전지의 서로 다른 두 극을 쓰지 않음"
    ],
    "answerPerPart": true
   },
   "fields": {
    "parts": [
     "(1) 집게 한 끝이 떨어져 있음",
     "(2) 전구 양쪽이 같은 전지 단자에만 이어짐",
     "(3) 전구의 두 접점이 전지의 서로 다른 두 극에 각각 이어짐"
    ]
   }
  },
  {
   "previous": {
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
    "explanation": "전지의 +극과 −극이 전구의 서로 다른 접점에 이어지도록 그려요. 선 모양보다 실제 닿는 곳이 중요해요. 그림을 그린 것과 선생님 점검 뒤 실물로 켜 본 것은 구별해요.",
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
    "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
    "drawing": "large"
   },
   "fields": {
    "criteria": "전지의 +극·−극과 전구의 두 접점을 이름표로 구별한다. / 전구를 거쳐 돌아오는 끊기지 않는 길을 나타낸다. / 전지의 +극과 −극을 전선만으로 직접 잇지 않는다.",
    "requirements": [
     "전지의 +극·−극과 전구의 두 접점을 이름표로 구별한다.",
     "전구를 거쳐 돌아오는 끊기지 않는 길을 나타낸다.",
     "전지의 +극과 −극을 전선만으로 직접 잇지 않는다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
     "required": [
      "전지의 +극·−극과 전구의 두 접점을 이름표로 구별한다.",
      "전구를 거쳐 돌아오는 끊기지 않는 길을 나타낸다.",
      "전지의 +극과 −극을 전선만으로 직접 잇지 않는다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w034",
    "no": 34,
    "section": 3,
    "sectionTitle": "전지 한 개와 두 개를 연결해요",
    "bookResponseForm": "single",
    "form": "choice",
    "type": "T05",
    "topic": "전지 한 개와 두 개를 연결해요",
    "prompt": "전지 한 개와 두 개를 비교해요. 전지 수 외에 같게 할 조건을 고르세요.",
    "answer": "③ 전지 종류와 사용 상태",
    "explanation": "전지 수만 비교하려면 종류와 사용 상태를 같게 하는 ③이 알맞아요. 전구와 접촉 상태, 전선과 주변 밝기도 같게 하고 알맞은 규격을 써요.",
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
    "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다.",
    "formLabel": "객관식",
    "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 전지 종류와 사용 상태",
    "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
    "given": [
     "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다."
    ]
   },
   "fields": {
    "givens": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요.",
    "given": [
     "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요."
    ],
    "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다."
   }
  },
  {
   "previous": {
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
    "explanation": "전지 한 개의 두 극을 쓴 (1)은 ㄷ이에요. 두 전지의 서로 다른 극을 이은 (2)는 ㄱ, 같은 극끼리 이은 (3)은 ㄴ이에요. 두 개라는 수만 보지 말고 실제 극을 읽어요.",
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
     "(2) 같은 두 전지의 직렬연결",
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
    "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
    "given": [
     "ㄱ 가운데 서로 다른 극을 이음",
     "ㄴ 가운데 같은 극을 이음",
     "ㄷ 전지의 양극을 전구에 각각 이음"
    ],
    "answerPerPart": true
   },
   "fields": {
    "options": [
     "ㄱ 가운데 서로 다른 극을 이음",
     "ㄴ 가운데 같은 극을 이음",
     "ㄷ 전지의 +극과 −극을 전구에 각각 이음"
    ],
    "given": [
     "ㄱ 가운데 서로 다른 극을 이음",
     "ㄴ 가운데 같은 극을 이음",
     "ㄷ 전지의 +극과 −극을 전구에 각각 이음"
    ]
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w039",
    "no": 39,
    "section": 3,
    "sectionTitle": "전지 한 개와 두 개를 연결해요",
    "bookResponseForm": "sequence",
    "form": "short",
    "type": "T05",
    "topic": "전지 한 개와 두 개를 연결해요",
    "prompt": "“전지 분리 → 두 전지 연결 점검 → 잠깐 관찰” 순서로 기호를 쓰세요.",
    "answer": "ㄷ → ㄱ → ㄴ",
    "explanation": "스위치를 열고 전지를 분리한 뒤 두 전지의 연결을 점검받아요. 정한 시간만 잠깐 관찰하므로 ㄷ → ㄱ → ㄴ이에요. 전지를 계속 더하는 활동은 아니에요.",
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
    "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
    "given": [
     "ㄱ 두 전지가 돕는 연결인지 교사에게 확인받는다.",
     "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다.",
     "ㄷ 스위치를 열고 전지를 분리한다."
    ]
   },
   "fields": {
    "options": [
     "ㄱ 두 전지의 직렬연결인지 교사에게 확인받는다.",
     "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다.",
     "ㄷ 스위치를 열고 전지를 분리한다."
    ],
    "given": [
     "ㄱ 두 전지의 직렬연결인지 교사에게 확인받는다.",
     "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다.",
     "ㄷ 스위치를 열고 전지를 분리한다."
    ]
   }
  },
  {
   "previous": {
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
    "explanation": "표에서 ㄱ은 +극끼리, ㄴ은 −극과 +극, ㄷ은 −극끼리 이었어요. 그래서 ①, ④, ⑤예요. 색이나 한 줄 모양 대신 극 표시를 읽어요.",
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
    "givens": "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요.",
    "formLabel": "복수 선택",
    "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ④, ⑤. 선택한 순서는 관계없다.",
    "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
    "given": [
     "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요."
    ],
    "figure": "electricity-question-data-42"
   },
   "fields": {
    "choices": [
     "ㄴ은 서로 다른 극을 연결했다.",
     "ㄷ은 서로 다른 극을 연결했다.",
     "ㄱ은 전선 색이 같아 직렬연결이다.",
     "ㄷ은 같은 −극끼리 연결했다.",
     "ㄱ은 같은 +극끼리 연결했다."
    ]
   }
  },
  {
   "previous": {
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
    "explanation": "가운데의 −극과 +극은 서로 다른 극이에요. 전구에는 그 연결에 쓰지 않은 바깥 두 극을 이어요. 가운데 연결과 바깥 두 끝을 구별해요.",
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
    "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
    "parts": [
     "(1)",
     "(2)"
    ],
    "answerPerPart": true,
    "figure": "electricity-question-data-44"
   },
   "fields": {
    "responseContract": {
     "kind": "ordered-term-parts",
     "teacherRequired": false,
     "parts": [
      {
       "label": "(1)",
       "kind": "short-text",
       "accepted": [
        "서로 다른 극",
        "다른 극",
        "서로 다르다",
        "서로 다른 극끼리"
       ]
      },
      {
       "label": "(2)",
       "kind": "short-text",
       "accepted": [
        "바깥",
        "바깥쪽",
        "양 끝",
        "바깥 양 끝",
        "바깥의 두 극",
        "바깥 두 극",
        "남은 두 극",
        "남은 양 끝"
       ]
      }
     ]
    },
    "criteria": "(1) 가운데에서 서로 다른 극을 이었다는 뜻 / (2) 가운데에 쓰지 않고 남은 바깥 두 극의 위치를 가리키는 말. 두 부분의 대응과 순서를 유지한다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w047",
    "no": 47,
    "section": 3,
    "sectionTitle": "전지 한 개와 두 개를 연결해요",
    "bookResponseForm": "draw-design",
    "form": "draw",
    "type": "T15",
    "topic": "전지 한 개와 두 개를 연결해요",
    "prompt": "전지 한 개를 연결한 회로와 전지 두 개를 직렬연결한 회로를 나란히 그리세요. 가운데에서 이은 극과 남은 두 극을 모두 표시하세요.",
    "answer": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
    "explanation": "두 그림 모두 같은 전구 하나를 써요. 두 전지 쪽은 가운데 +극과 −극을 이은 곳, 바깥 두 극을 전구에 이은 곳을 구별해요. 전구 여러 개를 잇는 문제로 바꾸지 않아요.",
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
     "같은 전구·허용 규격을 메모한다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
     "required": [
      "한개/두개 조건을 나눈다.",
      "모든 극 표시와 가운데 접속을 구별한다.",
      "같은 전구·허용 규격을 메모한다."
     ],
     "exactStringScoring": false
    },
    "drawingSpaceMinimumMm": 120,
    "drawingExplanationLines": 3,
    "formLabel": "그림·설계",
    "criteria": "한개/두개 조건을 나눈다. / 모든 극 표시와 가운데 접속을 구별한다. / 같은 전구·허용 규격을 메모한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
    "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
    "drawing": "large"
   },
   "fields": {
    "criteria": "같은 전구 하나에 전지 한 개를 쓴 경우와 두 개를 직렬연결한 경우를 나란히 그린다. / 가운데에서 이은 서로 다른 극과 바깥에 남은 두 극을 모두 표시한다. / 바깥 두 극이 전구의 서로 다른 접점에 이어지게 나타낸다.",
    "requirements": [
     "같은 전구 하나에 전지 한 개를 쓴 경우와 두 개를 직렬연결한 경우를 나란히 그린다.",
     "가운데에서 이은 서로 다른 극과 바깥에 남은 두 극을 모두 표시한다.",
     "바깥 두 극이 전구의 서로 다른 접점에 이어지게 나타낸다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
     "required": [
      "같은 전구 하나에 전지 한 개를 쓴 경우와 두 개를 직렬연결한 경우를 나란히 그린다.",
      "가운데에서 이은 서로 다른 극과 바깥에 남은 두 극을 모두 표시한다.",
      "바깥 두 극이 전구의 서로 다른 접점에 이어지게 나타낸다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
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
    "explanation": "세 번 모두 50>31, 54>33, 52>32이므로 두 전지 쪽 표시가 높아요. 따라서 ④예요. 이 표에서 다른 전구나 세 전지의 결과까지 읽을 수는 없어요.",
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
    "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "formLabel": "객관식",
    "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ 세 번 모두 두 전지 표시가 더 높다.",
    "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
    "given": [
     "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
    ],
    "figure": "electricity-question-data-50"
   },
   "fields": {
    "givens": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "given": [
     "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요."
    ],
    "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w058",
    "no": 58,
    "section": 4,
    "sectionTitle": "같은 조건으로 밝기를 비교해요",
    "bookResponseForm": "multiple",
    "form": "choice",
    "type": "T16",
    "topic": "같은 조건으로 밝기를 비교해요",
    "prompt": "이 연습표만으로 알 수 없는 내용을 세 개 고르세요.",
    "answer": "①, ④, ⑤",
    "explanation": "표의 숫자와 두 전지 쪽이 높다는 것은 알 수 있어요. 하지만 모든 전구의 밝기, 우리 반의 실제 측정, 세 전지의 안전은 알 수 없으므로 ①, ④, ⑤예요.",
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
    "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "formLabel": "복수 선택",
    "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ④, ⑤. 선택한 순서는 관계없다.",
    "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
    "given": [
     "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
    ],
    "figure": "electricity-question-data-58"
   },
   "fields": {
    "givens": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "given": [
     "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요."
    ],
    "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   }
  },
  {
   "previous": {
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
    "explanation": "한 전지는 (31+33+32)÷3=32 lx, 두 전지는 (50+54+52)÷3=52 lx예요. 같은 위치에서 읽은 세 값의 평균이지 전구의 전력이나 모든 방향의 빛을 잰 값은 아니에요.",
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
    "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "verificationModel": {
     "kind": "brightness-means",
     "model": "brightness"
    },
    "formLabel": "자료 해석",
    "criteria": "(1) 32lx (단위 필요) / (2) 52lx (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
    "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
    "given": [
     "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
    ],
    "parts": [
     "(1) · 단위도 써요.",
     "(2) · 단위도 써요."
    ],
    "answerPerPart": true,
    "figure": "electricity-question-data-59"
   },
   "fields": {
    "givens": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "given": [
     "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요."
    ],
    "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   }
  },
  {
   "previous": {
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
    "explanation": "평균의 차는 52−32=20 lx예요. 세 번 모두 두 전지 쪽이 높으므로 3회예요. 각각의 차가 19, 21, 20 lx라고 다르게 나와도 기록을 그대로 남겨요.",
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
    "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "verificationModel": {
     "kind": "brightness-comparison",
     "model": "brightness"
    },
    "formLabel": "자료 해석",
    "criteria": "(1) 20lx (단위 필요) / (2) 3회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
    "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
    "given": [
     "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
    ],
    "parts": [
     "(1) · 단위도 써요.",
     "(2) · 단위도 써요."
    ],
    "answerPerPart": true,
    "figure": "electricity-question-data-60"
   },
   "fields": {
    "givens": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "given": [
     "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요."
    ],
    "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w062",
    "no": 62,
    "section": 4,
    "sectionTitle": "같은 조건으로 밝기를 비교해요",
    "bookResponseForm": "reason",
    "form": "written",
    "type": "T16",
    "topic": "같은 조건으로 밝기를 비교해요",
    "prompt": "전선 길이를 두 조건에서 같게 두었습니다. 이것이 “길이는 밝기에 영향을 줄 수 없다”는 증거인가요?",
    "answer": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
    "explanation": "전선 길이를 같게 둔 것은 다른 까닭이 섞이지 않게 한 것이에요. 길이를 바꾸어 시험한 적은 없으므로 길이가 밝기에 영향을 줄 수 없다고 할 수는 없어요.",
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
     "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
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
   "fields": {
    "criteria": "전선 길이를 같게 둔 비교와 길이를 바꾼 비교를 구별한다. / 이 자료에서 길이를 바꾸어 시험하지 않았으므로 길이가 영향을 주지 않는다고 정할 수 없음을 설명한다.",
    "requirements": [
     "전선 길이를 같게 둔 비교와 길이를 바꾼 비교를 구별한다.",
     "이 자료에서 길이를 바꾸어 시험하지 않았으므로 길이가 영향을 주지 않는다고 정할 수 없음을 설명한다."
    ],
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
     "required": [
      "전선 길이를 같게 둔 비교와 길이를 바꾼 비교를 구별한다.",
      "이 자료에서 길이를 바꾸어 시험하지 않았으므로 길이가 영향을 주지 않는다고 정할 수 없음을 설명한다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w063",
    "no": 63,
    "section": 4,
    "sectionTitle": "같은 조건으로 밝기를 비교해요",
    "bookResponseForm": "draw-design",
    "form": "draw",
    "type": "T16",
    "topic": "같은 조건으로 밝기를 비교해요",
    "prompt": "전지 한 개와 두 개의 밝기를 비교할 배치를 그리세요. 전구·관찰 위치와 같게 할 조건을 표시하세요.",
    "answer": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
    "explanation": "전구와 보는 위치, 주변 밝기와 접촉 상태를 같게 표시해요. 전지 종류와 사용 상태, 허용 규격도 적어요. 실제로 보기 전에 밝기 결과를 미리 그려 넣지는 않아요.",
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
     "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
     "required": [
      "전지 수 외의 조건을 맞춘다.",
      "관찰 위치와 방법을 표시한다.",
      "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
     ],
     "exactStringScoring": false
    },
    "drawingSpaceMinimumMm": 120,
    "drawingExplanationLines": 3,
    "formLabel": "그림·설계",
    "criteria": "전지 수 외의 조건을 맞춘다. / 관찰 위치와 방법을 표시한다. / 허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
    "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
    "drawing": "large"
   },
   "fields": {
    "criteria": "비교할 전지 수와 그 밖에 같게 할 조건을 표시한다. / 같은 전구·관찰 위치·주변 밝기·접촉 상태를 나타낸다. / 허용된 부품으로 비교할 수 있는 배치를 그린다.",
    "requirements": [
     "비교할 전지 수와 그 밖에 같게 할 조건을 표시한다.",
     "같은 전구·관찰 위치·주변 밝기·접촉 상태를 나타낸다.",
     "허용된 부품으로 비교할 수 있는 배치를 그린다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
     "required": [
      "비교할 전지 수와 그 밖에 같게 할 조건을 표시한다.",
      "같은 전구·관찰 위치·주변 밝기·접촉 상태를 나타낸다.",
      "허용된 부품으로 비교할 수 있는 배치를 그린다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w064",
    "no": 64,
    "section": 4,
    "sectionTitle": "같은 조건으로 밝기를 비교해요",
    "bookResponseForm": "draw-design",
    "form": "draw",
    "type": "T16",
    "topic": "같은 조건으로 밝기를 비교해요",
    "prompt": "전지 한 개와 두 개를 세 번씩 비교할 빈 표를 그리세요. 제공 자료와 직접 본 결과, 같게 한 조건과 더 확인할 점을 적을 칸을 만드세요.",
    "answer": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
    "explanation": "한 전지와 두 전지, 세 번씩의 기록 칸을 만들어요. 어떤 자료인지와 접촉·위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 관찰하지 않은 숫자는 비워 두어요.",
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
     "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
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
   "fields": {
    "criteria": "전지 한 개와 두 개를 세 번씩 비교할 빈 칸을 만든다. / 제공 자료와 직접 관찰한 결과를 구별할 칸을 둔다. / 같게 한 조건과 더 확인할 점을 적을 칸을 만든다.",
    "requirements": [
     "전지 한 개와 두 개를 세 번씩 비교할 빈 칸을 만든다.",
     "제공 자료와 직접 관찰한 결과를 구별할 칸을 둔다.",
     "같게 한 조건과 더 확인할 점을 적을 칸을 만든다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
     "required": [
      "전지 한 개와 두 개를 세 번씩 비교할 빈 칸을 만든다.",
      "제공 자료와 직접 관찰한 결과를 구별할 칸을 둔다.",
      "같게 한 조건과 더 확인할 점을 적을 칸을 만든다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
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
    "explanation": "철심에 감긴 부분은 절연을 유지하고 양 끝의 금속 접점은 선생님이 준비해요. 그래서 ②예요. 학생이 피복을 태우거나 철심을 가열하지 않고 부품 규격과 켜 두는 시간을 확인해요.",
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
    "givens": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
    "formLabel": "객관식",
    "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 감긴 부분의 절연을 유지한다.",
    "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
    "given": [
     "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
    ]
   },
   "fields": {
    "given": [
     "이 문제에서는 선생님이 규격과 정상 상태, 사용할 시간을 확인한 낮은 전압의 교육용 부품을 쓴다고 정했어요. 연결을 바꿀 때는 전원을 분리하고 점검받아요. 전지의 +극과 −극을 전선만으로 직접 잇지 않아요."
    ],
    "givens": "이 문제에서는 선생님이 규격과 정상 상태, 사용할 시간을 확인한 낮은 전압의 교육용 부품을 쓴다고 정했어요. 연결을 바꿀 때는 전원을 분리하고 점검받아요. 전지의 +극과 −극을 전선만으로 직접 잇지 않아요.",
    "sourceConditionDetails": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w066",
    "no": 66,
    "section": 5,
    "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
    "bookResponseForm": "single",
    "form": "choice",
    "type": "T09",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "prompt": "전지를 분리했는데 클립 한 개가 남았어요. 알맞은 설명을 고르세요.",
    "answer": "⑤ 철심에 약한 자성이 남을 수 있다.",
    "explanation": "전지를 분리해도 철심에 약한 자성이 남을 수 있으므로 ⑤예요. 클립 한 개가 남았다는 기록을 지우지 않아요. 이것만으로 전류가 계속 흐르거나 세기가 그대로라고 할 수는 없어요.",
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
       "전지를 연결했을 때",
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
   "fields": {
    "givens": "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요.",
    "given": [
     "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요."
    ],
    "sourceConditionDetails": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다."
   }
  },
  {
   "previous": {
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
    "explanation": "처음 0개, 전지 연결 동안 6개, 분리 뒤 1개예요. 따라서 ②, ③, ④예요. 분리 뒤의 작용이 연결 동안과 같은 것은 아니에요. 이 표는 연습용 자료예요.",
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
     "전지를 연결했을 때 가장 많이 붙었다.",
     "분리 뒤에도 한 개가 남았다.",
     "분리 뒤에도 세기는 전류가 흐르는 동안과 똑같았다."
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
       "전지를 연결했을 때",
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
   "fields": {
    "givens": "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요.",
    "given": [
     "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요."
    ],
    "sourceConditionDetails": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w075",
    "no": 75,
    "section": 5,
    "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
    "bookResponseForm": "data",
    "form": "short",
    "type": "T09",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "prompt": "표에서 (1)연결 전보다 전류가 흐르는 동안 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
    "answer": "6개 / 1개",
    "explanation": "전지 연결 동안 늘어난 수는 6−0=6개, 분리 뒤 남은 수는 1개예요. 클립 수를 센 것이지 힘을 정확한 단위로 잰 값은 아니에요.",
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
       "전지를 연결했을 때",
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
   "fields": {
    "givens": "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요.",
    "given": [
     "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요."
    ],
    "sourceConditionDetails": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w077",
    "no": 77,
    "section": 5,
    "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
    "bookResponseForm": "reason",
    "form": "written",
    "type": "T09",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "prompt": "전자석을 켠 동안만 보고 처음 철심의 상태는 보지 못했어요. 전후의 차이를 설명할 때 무엇을 알기 어려울까요?",
    "answer": "처음부터 클립이 붙었는지 몰라요. 전지 연결 전의 철심을 같은 클립과 거리에서 보고 비교해야 전후에 달라진 점을 설명할 수 있어요.",
    "explanation": "전지 연결 동안 붙었다는 기록은 남길 수 있어요. 하지만 처음 상태를 보지 않으면 처음부터 붙었는지 몰라요. 같은 클립과 거리에서 연결 전과 후를 비교해야 달라진 점을 설명할 수 있어요.",
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
     "sample": "처음부터 클립이 붙었는지 몰라요. 전지 연결 전의 철심을 같은 클립과 거리에서 보고 비교해야 전후에 달라진 점을 설명할 수 있어요.",
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
   "fields": {
    "answer": "연결 전의 기록이 없어 처음부터 클립이 붙었는지 알기 어려워요. 다음에 다시 비교할 때에는 같은 철심과 클립, 같은 거리에서 전지를 연결하기 전의 상태부터 살펴요. 전지를 분리한 뒤 본 것을 과거의 처음 상태로 바꾸어 적지는 않아요.",
    "explanation": "이번 기록만으로는 처음부터 철심에 자석의 성질이 있었는지 몰라요. 전후의 차이를 살피려면 다시 비교할 때 전지를 연결하기 전의 상태부터 기록해야 해요. 나중에 본 모습으로 없던 처음 기록을 대신하지 않아요.",
    "criteria": "연결 전 처음 상태의 기록이 없음을 밝힌다. / 처음부터 클립이 붙었는지 몰라 전후의 차이를 확정하기 어려움을 설명한다.",
    "requirements": [
     "연결 전 처음 상태의 기록이 없음을 밝힌다.",
     "처음부터 클립이 붙었는지 몰라 전후의 차이를 확정하기 어려움을 설명한다."
    ],
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "연결 전의 기록이 없어 처음부터 클립이 붙었는지 알기 어려워요. 다음에 다시 비교할 때에는 같은 철심과 클립, 같은 거리에서 전지를 연결하기 전의 상태부터 살펴요. 전지를 분리한 뒤 본 것을 과거의 처음 상태로 바꾸어 적지는 않아요.",
     "required": [
      "연결 전 처음 상태의 기록이 없음을 밝힌다.",
      "처음부터 클립이 붙었는지 몰라 전후의 차이를 확정하기 어려움을 설명한다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
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
    "explanation": "철심과 감긴 절연선, 두 끝 접점을 구별해요. 전지를 분리한 상태로 연결한 뒤 선생님께 점검받는 순서를 넣어요. 모든 장치에 같은 감는 횟수나 길이를 쓰라고 정하지 않아요.",
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
   "fields": {
    "criteria": "철심·절연된 코일·준비된 두 끝과 스위치가 있는 회로를 구별해 그린다. / 전지를 분리한 상태의 연결과 선생님 점검 순서를 표시한다. / 피복 태우기·철심 가열·허용하지 않은 전지 추가를 제안하지 않는다.",
    "requirements": [
     "철심·절연된 코일·준비된 두 끝과 스위치가 있는 회로를 구별해 그린다.",
     "전지를 분리한 상태의 연결과 선생님 점검 순서를 표시한다.",
     "피복 태우기·철심 가열·허용하지 않은 전지 추가를 제안하지 않는다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
     "required": [
      "철심·절연된 코일·준비된 두 끝과 스위치가 있는 회로를 구별해 그린다.",
      "전지를 분리한 상태의 연결과 선생님 점검 순서를 표시한다.",
      "피복 태우기·철심 가열·허용하지 않은 전지 추가를 제안하지 않는다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w081",
    "no": 81,
    "section": 6,
    "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
    "bookResponseForm": "single",
    "form": "choice",
    "type": "T10",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "prompt": "전지 수에 따른 전자석의 세기를 비교해요. 전지 수 외에 같게 할 조건을 고르세요.",
    "answer": "③ 클립의 접근 거리와 전류가 흐르는 시간",
    "explanation": "거리가 같고 전류가 흐르는 시간도 같은 ③이 알맞아요. 철심과 코일, 클립도 같게 해야 전지 수에 따른 차이를 비교할 수 있어요.",
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
     "클립의 접근 거리와 전류가 흐르는 시간",
     "한쪽만 더 가까이 대는 방법",
     "조건마다 다른 종류의 클립"
    ],
    "key": 2,
    "responseContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 2
    },
    "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다.",
    "formLabel": "객관식",
    "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 클립의 접근 거리와 전류가 흐르는 시간",
    "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
    "given": [
     "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다."
    ]
   },
   "fields": {
    "givens": "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요.",
    "given": [
     "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요."
    ],
    "sourceConditionDetails": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다."
   }
  },
  {
   "previous": {
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
    "explanation": "두 전지 쪽은 8>4, 9>5, 8>4로 매번 많이 들었어요. 하지만 둘째 9는 5의 두 배가 아니에요. 같은 철심과 코일, 거리와 시간도 확인하므로 ①, ③, ⑤예요.",
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
    "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
    "formLabel": "복수 선택",
    "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택한 순서는 관계없다.",
    "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
    "given": [
     "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
    ],
    "figure": "electricity-question-data-89"
   },
   "fields": {
    "givens": "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요. 선생님이 만든 연습 기록이며, 우리가 직접 잰 값은 아니에요.",
    "given": [
     "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요. 선생님이 만든 연습 기록이며, 우리가 직접 잰 값은 아니에요."
    ],
    "sourceConditionDetails": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   }
  },
  {
   "previous": {
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
    "explanation": "세 번 모두 두 전지 쪽이 많으므로 3회예요. 둘째의 9는 5의 두 배가 아니고 나머지 두 번은 두 배이므로 정확히 두 배가 아닌 것은 1회예요.",
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
    "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
    "verificationModel": {
     "kind": "strength-repeat-counts",
     "model": "strength"
    },
    "formLabel": "자료 해석",
    "criteria": "(1) 3회 (단위 필요) / (2) 1회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
    "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
    "given": [
     "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
    ],
    "parts": [
     "(1) · 단위도 써요.",
     "(2) · 단위도 써요."
    ],
    "answerPerPart": true,
    "figure": "electricity-question-data-91"
   },
   "fields": {
    "givens": "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요. 선생님이 만든 연습 기록이며, 우리가 직접 잰 값은 아니에요.",
    "given": [
     "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요. 선생님이 만든 연습 기록이며, 우리가 직접 잰 값은 아니에요."
    ],
    "sourceConditionDetails": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   }
  },
  {
   "previous": {
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
    "explanation": "처음에는 나침반 N극과 밀어내므로 왼쪽 끝은 N극이에요. 반대로 연결한 뒤 N극을 끌어당기므로 같은 끝은 S극이에요. 전지 수를 바꾼 것과 구별해요.",
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
    "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
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
   "fields": {
    "givens": "같은 코일에서 전원을 분리한 뒤 전지의 방향만 반대로 바꾼 연습 기록이에요. 주변 자석을 멀리 두고 같은 위치에서 반응을 비교했다고 정했어요.",
    "given": [
     "같은 코일에서 전원을 분리한 뒤 전지의 방향만 반대로 바꾼 연습 기록이에요. 주변 자석을 멀리 두고 같은 위치에서 반응을 비교했다고 정했어요."
    ],
    "sourceConditionDetails": "같은 코일에서 전원을 분리한 뒤 전지 방향만 반대로 바꾼 연습 기록이다. 주변 자석을 멀리 두고 같은 위치의 반응을 비교했다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w093",
    "no": 93,
    "section": 6,
    "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
    "bookResponseForm": "reason",
    "form": "written",
    "type": "T10",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "prompt": "클립을 더 가까이 대니 많이 붙었어요. 이것만으로 전자석 자체가 더 세졌다고 할 수 있을까요?",
    "answer": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
    "explanation": "클립이 더 많이 붙은 것은 남겨요. 하지만 가까이 댄 거리도 달라졌으므로 전자석 자체가 더 세졌다고만 할 수는 없어요. 같은 클립과 거리, 방법과 시간에서 다시 비교해요.",
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
     "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
     "required": [
      "접근 거리 차이를 근거로 든다.",
      "자석 자체 변화와 관찰 방법 효과를 구별한다.",
      "공정한 비교 조건을 제안한다."
     ],
     "exactStringScoring": false
    },
    "formLabel": "까닭 설명",
    "criteria": "접근 거리 차이를 근거로 든다. / 자석 자체 변화와 관찰 방법 효과를 구별한다. / 공정한 비교 조건을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
    "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
    "lines": 6
   },
   "fields": {
    "criteria": "클립을 대는 거리가 달라졌음을 근거로 든다. / 관찰 방법도 바뀌었으므로 전자석 자체가 더 세졌다고만 할 수 없음을 설명한다.",
    "requirements": [
     "클립을 대는 거리가 달라졌음을 근거로 든다.",
     "관찰 방법도 바뀌었으므로 전자석 자체가 더 세졌다고만 할 수 없음을 설명한다."
    ],
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
     "required": [
      "클립을 대는 거리가 달라졌음을 근거로 든다.",
      "관찰 방법도 바뀌었으므로 전자석 자체가 더 세졌다고만 할 수 없음을 설명한다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w094",
    "no": 94,
    "section": 6,
    "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
    "bookResponseForm": "reason",
    "form": "written",
    "type": "T17",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "prompt": "철 조각 운반 장치와 자석 게시판을 비교해, 전자석 제어가 필요한 까닭을 설명하세요.",
    "answer": "철 조각을 옮기는 장치는 잡았다가 놓을 수 있어야 해요. 전자석은 전원을 켜고 끄며 작용을 조절할 수 있어요. 자료의 게시판은 전지 없이도 작용하는 영구 자석을 써요.",
    "explanation": "철 조각을 옮기는 장치는 잡았다가 놓는 작용을 조절해야 해요. 전자석은 전원을 켜고 끄는 성질을 쓸 수 있어요. 자료의 게시판은 전지 없이 작용하는 영구 자석이라는 점과 비교해요.",
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
     "sample": "철 조각을 옮기는 장치는 잡았다가 놓을 수 있어야 해요. 전자석은 전원을 켜고 끄며 작용을 조절할 수 있어요. 자료의 게시판은 전지 없이도 작용하는 영구 자석을 써요.",
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
    "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
    "given": [
     "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다."
    ],
    "lines": 6
   },
   "fields": {
    "givens": "이 문제의 운반 모형은 코일에 전류가 흐르게 하거나 끊어 철 조각을 잡고 놓아요. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙여요. 여기서는 이 두 구조를 비교해요.",
    "given": [
     "이 문제의 운반 모형은 코일에 전류가 흐르게 하거나 끊어 철 조각을 잡고 놓아요. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙여요. 여기서는 이 두 구조를 비교해요."
    ],
    "sourceConditionDetails": "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다."
   }
  },
  {
   "previous": {
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
    "explanation": "손상이나 이상한 냄새가 있으면 쓰지 않고 어른에게 알려요. 그래서 ④예요. 직접 만지거나 다시 켜서 시험하지 않고, 테이프만 붙이면 모두 안전하다고 하지는 않아요.",
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
   "fields": {
    "givens": "실제 위험한 기구를 만지거나 시험하지 않고, 점검 카드의 행동 계획만 구별해요.",
    "given": [
     "실제 위험한 기구를 만지거나 시험하지 않고, 점검 카드의 행동 계획만 구별해요."
    ],
    "sourceConditionDetails": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다."
   }
  },
  {
   "previous": {
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
    "explanation": "연결을 바꾸기 전에는 전원을 분리하고 점검받는 ②가 맞아요. 전지 두 극을 전선만으로 직접 잇거나 전지를 더하고 피복을 훼손하는 것은 고치는 방법이 아니에요.",
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
     "규격을 모르니 전지를 계속 더한다.",
     "손상된 피복을 칼로 더 넓게 벗긴다."
    ],
    "key": 1,
    "responseContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 1
    },
    "givens": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
    "formLabel": "객관식",
    "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 전원을 분리한 뒤 점검받는다.",
    "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
    "given": [
     "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
    ]
   },
   "fields": {
    "choices": [
     "스위치를 켠 채 금속 집게를 옮긴다.",
     "전원을 분리한 뒤 점검받는다.",
     "전지의 +극과 −극을 전선만으로 잇는다.",
     "규격을 모르니 전지를 계속 더한다.",
     "손상된 피복을 칼로 더 넓게 벗긴다."
    ],
    "given": [
     "이 문제에서는 선생님이 규격과 정상 상태, 사용할 시간을 확인한 낮은 전압의 교육용 부품을 쓴다고 정했어요. 연결을 바꿀 때는 전원을 분리하고 점검받아요. 전지의 +극과 −극을 전선만으로 직접 잇지 않아요."
    ],
    "givens": "이 문제에서는 선생님이 규격과 정상 상태, 사용할 시간을 확인한 낮은 전압의 교육용 부품을 쓴다고 정했어요. 연결을 바꿀 때는 전원을 분리하고 점검받아요. 전지의 +극과 −극을 전선만으로 직접 잇지 않아요.",
    "sourceConditionDetails": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
   }
  },
  {
   "previous": {
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
    "explanation": "지정한 크기와 종류, +·− 방향을 확인하고 금속 물체가 전지 두 극을 직접 잇지 않게 해요. 그래서 ①, ②, ④예요. 새것과 헌것을 섞거나 불에 버리지 않아요.",
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
   "fields": {
    "choices": [
     "지정된 크기·종류의 전지를 쓴다.",
     "+·− 표시를 확인해 넣는다.",
     "새 전지와 헌 전지를 섞어 쓴다.",
     "금속 물체가 전지의 +극과 −극을 직접 잇지 않게 한다.",
     "분리한 전지를 불에 넣어 처리한다."
    ]
   }
  },
  {
   "previous": {
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
    "explanation": "손상된 ㄱ과 타는 냄새가 나는 ㄷ은 2개예요. 정상 분리와 규격 확인인 ㄴ, ㄹ도 2개예요. 카드를 분류한 것과 실제 기구를 점검한 것은 달라요.",
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
   "fields": {
    "givens": "실제 위험한 기구를 만지거나 시험하지 않고, 점검 카드의 행동 계획만 구별해요.",
    "given": [
     "실제 위험한 기구를 만지거나 시험하지 않고, 점검 카드의 행동 계획만 구별해요."
    ],
    "sourceConditionDetails": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w108",
    "no": 108,
    "section": 7,
    "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
    "bookResponseForm": "data",
    "form": "short",
    "type": "T13",
    "topic": "전기를 안전하게 사용하는 근거를 찾아요",
    "prompt": "점검표에서 (1) 확인한 항목은 몇 개인가요? (2) 아직 확인하지 않은 항목은 몇 개인가요? 단위도 써 주세요.",
    "answer": "2개 / 2개",
    "explanation": "앞의 두 항목은 확인했고 뒤의 두 항목은 아직 확인하지 않았으므로 2개, 2개예요. 모르는 항목을 문제없음이나 0초로 채우지 않아요.",
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
       "전류가 흐르는 시간",
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
   "fields": {
    "givens": "비교 방법을 익히려고 선생님이 만든 연습 기록이에요. 우리가 직접 점검한 기록은 아니에요.",
    "given": [
     "비교 방법을 익히려고 선생님이 만든 연습 기록이에요. 우리가 직접 점검한 기록은 아니에요."
    ],
    "sourceConditionDetails": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w123",
    "no": 123,
    "section": 8,
    "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "bookResponseForm": "data",
    "form": "short",
    "type": "T14",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "prompt": "표에서 필요 없는 조명을 켠 시간을 더해요. (1) 실천 전의 합 (2) 실천 후의 합을 단위와 함께 쓰세요.",
    "answer": "180분 / 90분",
    "explanation": "전은 60+60+60=180분, 후는 35+30+25=90분이에요. 필요 없는 조명을 켠 시간의 합이에요. 이 시간으로 전기 사용량이나 요금을 직접 잰 것은 아니에요.",
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
   "fields": {
    "givens": "같은 조명과 이용 일정에서 필요한 밝기를 유지하며, 필요 없이 켜 둔 시간만 줄인다고 정한 연습 자료예요. 전기 사용량·요금·배출량은 잰 값이 없어요.",
    "given": [
     "같은 조명과 이용 일정에서 필요한 밝기를 유지하며, 필요 없이 켜 둔 시간만 줄인다고 정한 연습 자료예요. 전기 사용량·요금·배출량은 잰 값이 없어요."
    ],
    "sourceConditionDetails": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w125",
    "no": 125,
    "section": 8,
    "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "bookResponseForm": "reason",
    "form": "written",
    "type": "T18",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "prompt": "“조명을 켠 시간이 절반이니 전체 전기요금도 정확히 절반 줄었어”라고 말할 수 있을까요? 표에서 알 수 있는 것과 더 필요한 자료를 쓰세요.",
    "answer": "이 표는 필요 없는 조명을 켠 시간이 달라진 기록이에요. 전기 사용량이나 요금을 직접 잰 것은 아니에요. 다른 사용과 요금 조건도 모르므로 전체 요금이 정확히 절반 줄었다고 할 수는 없어요.",
    "explanation": "필요 없는 조명을 켠 시간은 180분에서 90분으로 줄었어요. 하지만 다른 전기 사용과 요금 조건은 없어요. 전체 요금이 정확히 절반 줄었다고 정하려면 자료가 더 필요해요.",
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
     "sample": "이 표는 필요 없는 조명을 켠 시간이 달라진 기록이에요. 전기 사용량이나 요금을 직접 잰 것은 아니에요. 다른 사용과 요금 조건도 모르므로 전체 요금이 정확히 절반 줄었다고 할 수는 없어요.",
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
   "fields": {
    "givens": "같은 조명과 이용 일정에서 필요한 밝기를 유지하며, 필요 없이 켜 둔 시간만 줄인다고 정한 연습 자료예요. 전기 사용량·요금·배출량은 잰 값이 없어요.",
    "given": [
     "같은 조명과 이용 일정에서 필요한 밝기를 유지하며, 필요 없이 켜 둔 시간만 줄인다고 정한 연습 자료예요. 전기 사용량·요금·배출량은 잰 값이 없어요."
    ],
    "sourceConditionDetails": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다."
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w127",
    "no": 127,
    "section": 8,
    "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "bookResponseForm": "draw-design",
    "form": "draw",
    "type": "T18",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "prompt": "교실에서 할 안전·절약 실천 카드를 만드세요. 장소·행동·담당·기간·확인 방법과 아직 하지 않음 칸을 배치하세요.",
    "answer": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
    "explanation": "언제 어디에서 무엇을 할지와 확인 방법을 넣어요. 필요한 밝기와 환기는 유지하고, 실제 날짜와 하지 못한 까닭, 기간 뒤 돌아볼 칸도 비워 두어요.",
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
     "실제 행동·근거와 아직 하지 않음을 구별한다.",
     "필요한 기능과 안전 범위를 유지한다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
     "required": [
      "구체적 실행 조건을 담는다.",
      "실제 행동·근거와 아직 하지 않음을 구별한다.",
      "필요한 기능과 안전 범위를 유지한다."
     ],
     "exactStringScoring": false
    },
    "drawingSpaceMinimumMm": 120,
    "drawingExplanationLines": 3,
    "formLabel": "그림·설계",
    "criteria": "구체적 실행 조건을 담는다. / 실제 행동·근거와 아직 하지 않음을 구별한다. / 필요한 기능과 안전 범위를 유지한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
    "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
    "drawing": "large"
   },
   "fields": {
    "criteria": "장소·행동·담당·기간·확인 방법을 구체적으로 넣는다. / 아직 하지 않음을 표시할 칸을 만든다. / 필요한 기능과 안전을 유지할 수 있는 계획을 세운다.",
    "requirements": [
     "장소·행동·담당·기간·확인 방법을 구체적으로 넣는다.",
     "아직 하지 않음을 표시할 칸을 만든다.",
     "필요한 기능과 안전을 유지할 수 있는 계획을 세운다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
     "required": [
      "장소·행동·담당·기간·확인 방법을 구체적으로 넣는다.",
      "아직 하지 않음을 표시할 칸을 만든다.",
      "필요한 기능과 안전을 유지할 수 있는 계획을 세운다."
     ],
     "exactStringScoring": false
    }
   }
  },
  {
   "previous": {
    "id": "c22-s62-u03-w128",
    "no": 128,
    "section": 8,
    "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "bookResponseForm": "draw-design",
    "form": "draw",
    "type": "T18",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "prompt": "실천 결과를 친구에게 설명할 그림판을 그리세요. 계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요.",
    "answer": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
    "explanation": "하려던 일과 실제로 한 일을 구별할 칸을 만들어요. 확인한 변화와 아직 알 수 없는 효과도 나누어요. 그림판을 그린 것만으로 실제로 실천하거나 친구에게 설명한 것은 아니에요.",
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
     "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
     "required": [
      "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
     ],
     "exactStringScoring": false
    },
    "drawingSpaceMinimumMm": 120,
    "drawingExplanationLines": 3,
    "formLabel": "그림·설계",
    "criteria": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요.",
    "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
    "drawing": "large"
   },
   "fields": {
    "criteria": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나눈다. / 계획과 실제 수행, 확인한 변화와 알 수 없는 효과를 구별할 그림판을 그린다.",
    "requirements": [
     "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나눈다.",
     "계획과 실제 수행, 확인한 변화와 알 수 없는 효과를 구별할 그림판을 그린다."
    ],
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
     "required": [
      "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나눈다.",
      "계획과 실제 수행, 확인한 변화와 알 수 없는 효과를 구별할 그림판을 그린다."
     ],
     "exactStringScoring": false
    }
   }
  }
 ],
 "directions": [
  {
   "previous": {
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
      "title": "개념 확인",
      "hint": "전구의 옆 금속과 바닥 금속은 왜 서로 구별해야 할까요?",
      "lines": 4,
      "draw": false
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 금속의 자유 전자가 전기 전도와 관련됨을 배워요. 금속 접점이 닿아야 전하가 이동할 수 있는 길이 이어져요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "concept",
    "layout": "electricity-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "중학교에서는 금속의 자유 전자가 전기 전도와 관련됨을 배워요. 금속 접점이 닿아야 전하가 이동할 수 있는 길이 이어져요.",
     "value": "고등학교 통합과학에서는 금속의 자유 전자가 전기 전도와 관련됨을 배워요. 금속 접점이 닿아야 전하가 이동할 수 있는 길이 이어져요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 1~2",
    "title": "전구의 두 접점 · 객관식",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류를 전하의 흐름으로 설명해요. 전구에서 빛이 나더라도 전하가 전구 안에서 모두 사라지는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
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
     "prompt": "전구에서 전선을 이을 두 금속 부분을 접점이라고 해요. 두 접점을 바르게 구별한 기록을 고르세요.",
     "answer": "③ 옆 금속과 바닥 금속을 나눈다.",
     "explanation": "전구의 금속 접점은 옆과 바닥에 따로 있어요. 두 접점을 나누어 표시한 ③이 맞아요. 유리는 접점이 아니고, 위치를 보려고 전구를 뜯을 필요도 없어요.",
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
     "givens": "정상 필라멘트 전구를 뜯지 않고 겉에서 살펴요.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 옆 금속과 바닥 금속을 나눈다.",
     "misconception": "겉모양·전선 색으로 접점을 정하지 않아요. 전구의 옆과 바닥 금속 접점, 유리·절연 부분을 구별해요.",
     "given": [
      "정상 필라멘트 전구를 뜯지 않고 겉에서 살펴요."
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
     "answer": "① 전지를 고정하고 두 극을 회로에 잇기 쉽게 한다.",
     "explanation": "전지 끼우개는 전지가 움직이지 않게 잡아 주고 두 극을 회로에 잇기 쉽게 해요. 그래서 ①이에요. 전지 없이 전기를 만들거나 전구의 규격을 바꾸지는 않아요.",
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
      "전지를 고정하고 두 극을 회로에 잇기 쉽게 한다.",
      "전지 없이 필요한 전기를 계속 만든다.",
      "전구 대신 빛을 내어 방을 밝힌다.",
      "전지의 두 극을 늘 한 점으로 합친다.",
      "모든 전구의 규격을 자동으로 바꾼다."
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 객관식",
     "value": "전구 접점과 끼우개의 역할"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "전구의 옆 금속과 바닥 금속은 따로 있으며, 끼우개는 부품의 고정과 연결을 도와요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "두 접점의 위치와 끼우개가 하는 일을 나누어 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 3~5",
    "title": "전구의 두 접점 · 빈칸 넣기",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전압을 이용해 전지의 역할을 설명해요. 전지는 전하를 새로 만드는 장치라기보다 회로에서 에너지를 공급하는 역할을 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "전기가 흐르는 것은 전류, 부품을 이어 만든 길은 전기 회로예요. 흐름과 길의 이름을 구별해 순서대로 써요.",
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
     "explanation": "전선 안쪽 구리에는 전기가 잘 통해요. 바깥의 절연 피복은 뜻하지 않은 접촉을 막는 데 써요. 전선의 안과 밖은 재료와 하는 일이 달라요.",
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
     "explanation": "전지는 전기를 공급하는 ㄴ, 전구는 빛을 내는 ㄷ, 스위치는 길을 열고 닫는 ㄱ이에요. 같은 회로 안에서도 각 부품의 하는 일은 달라요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 빈칸 넣기",
     "value": "흐르는 전기와 부품의 역할"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "전류는 전기가 흐르는 것이고 전기 회로는 부품을 이어 만든 길이에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "전선의 안과 밖, 전지·전구·스위치의 역할을 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 6~8",
    "title": "전구의 두 접점 · 연결하기",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 금속의 자유 전자가 전기 전도와 관련됨을 배워요. 금속 접점이 닿아야 전하가 이동할 수 있는 길이 이어져요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w006",
     "no": 6,
     "section": 1,
     "sectionTitle": "전구의 두 접점을 찾아요",
     "bookResponseForm": "match",
     "form": "short",
     "type": "T15",
     "topic": "전구의 두 접점을 찾아요",
     "prompt": "실물을 보고 확인한 내용은 어떤 자료로 남기면 좋을까요? 서로 연결하세요.",
     "answer": "ㄷ / ㄱ / ㄴ",
     "explanation": "접점의 위치는 그림인 ㄷ, 설명서의 조건은 규격 메모인 ㄱ, 아직 확인하지 않은 것은 예상인 ㄴ에 남겨요. 예상을 직접 본 결과로 쓰지 않아요.",
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
      "ㄱ 사용할 수 있는 부품 규격의 확인 메모",
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
      "ㄱ 사용할 수 있는 부품 규격의 확인 메모",
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
     "prompt": "“전지 분리 → 두 접점 확인 → 선생님 점검” 순서로 기호를 쓰세요.",
     "answer": "ㄷ → ㄱ → ㄴ",
     "explanation": "전지를 분리한 ㄷ, 접점을 겉에서 찾는 ㄱ, 선생님께 점검받는 ㄴ의 순서예요. 연결된 상태로 접점을 바꾸는 순서가 아니에요.",
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
     "explanation": "먼저 실물을 보는 ㄴ, 접점 위치를 표시하는 ㄷ, 하는 일을 설명하는 ㄱ이에요. 직접 본 위치를 바탕으로 설명을 만들어요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 연결하기",
     "value": "실물·설명서·예상을 구별해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "직접 본 위치와 설명서로 확인한 조건, 아직 확인하지 않은 예상은 다른 자료예요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "전지를 분리하고 살핀 위치를 표시하는 순서를 적어요."
    },
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "중학교에서는 금속의 자유 전자가 전기 전도와 관련됨을 배워요. 금속 접점이 닿아야 전하가 이동할 수 있는 길이 이어져요.",
     "value": "고등학교 통합과학에서는 금속의 자유 전자가 전기 전도와 관련됨을 배워요. 금속 접점이 닿아야 전하가 이동할 수 있는 길이 이어져요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 9~10",
    "title": "전구의 두 접점 · 복수 선택",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 회로의 연결을 기호로 나타내요. 실제 부품의 생김새가 달라도 어떤 단자끼리 이어졌는지 같은 회로도로 나타낼 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "스위치는 길을 열고 닫고, 전구는 빛을 내고, 전지는 전기를 공급해요. 그래서 ①, ②, ⑤예요. 피복이 전기를 만들거나 끼우개가 두 접점을 하나로 합치지는 않아요.",
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
      "스위치는 전기가 흐를 길을 열고 닫는다.",
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
     "prompt": "전구와 전선이 닿는 곳을 살핀 메모로 알맞은 것을 세 개 고르세요.",
     "answer": "③, ④, ⑤",
     "explanation": "옆과 바닥 금속을 나누고, 집게가 실제 금속에 닿는지 보며, 유리와 금속을 구별해요. 따라서 ③, ④, ⑤예요. 전선 색만으로 극을 정하지 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 복수 선택",
     "value": "부품과 접촉한 곳을 살펴요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "전기를 공급하는 전지와 빛을 내는 전구, 길을 여닫는 스위치의 역할은 달라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "집게가 피복에 닿았는지 금속에 닿았는지 확인할 곳을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 11",
    "title": "전구의 두 접점 · 자료 해석",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 빛과 열로 전환됨을 배워요. 전구에 공급한 에너지가 모두 눈에 보이는 빛이 되는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "금속 접점은 옆과 바닥의 2개예요. 유리와 사이의 절연 부분은 접점이 아닌 2개예요. 전구의 네 부분을 하는 일에 따라 나누어 세어요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 자료 해석",
     "value": "전구의 두 접점을 세어요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "옆 금속과 바닥 금속은 접점이고, 유리와 절연 부분은 접점이 아니에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "접점인 곳과 아닌 곳을 나누어 세어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 12",
    "title": "전구의 두 접점 · 자료 해석",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 빛과 열로 전환됨을 배워요. 전구에 공급한 에너지가 모두 눈에 보이는 빛이 되는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "직접 본 금속 위치를 표시한 ㄱ은 관찰이에요. 아직 연결하지 않고 켜질 것이라고 쓴 ㄴ은 예상이에요. 설명서를 읽은 ㄷ은 전구가 켜진 것을 직접 본 기록과 달라요.",
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
        "설명서에서 전구 규격을 읽음"
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 자료 해석",
     "value": "직접 본 것과 아직 모르는 것"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "실물의 겉을 보고 표시한 위치와 연결하기 전의 예상은 구별해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "아직 확인하지 않은 예상을 어떻게 남길지 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 13",
    "title": "전구의 두 접점 · 까닭 설명",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류계로 전류를 측정해요. 전구의 밝기만으로 전류의 정확한 값을 알 수는 없어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w013",
     "no": 13,
     "section": 1,
     "sectionTitle": "전구의 두 접점을 찾아요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T01",
     "topic": "전구의 두 접점을 찾아요",
     "prompt": "“끼우개가 없으면 전구는 절대로 켜지지 않아”라는 말을 이 자료로 설명해 보세요.",
     "answer": "전구의 두 금속 접점이 전지의 서로 다른 극에 정확히 닿으면 끼우개 없이도 켜질 수 있어요. 끼우개는 고정과 연결을 돕는 것이지 불을 켜는 조건의 전부는 아니에요.",
     "explanation": "끼우개가 없어도 전구의 두 금속 접점이 전지의 서로 다른 극과 정확히 닿으면 켜질 수 있어요. 끼우개는 고정과 연결을 도와요. 실제로 만들 때는 선생님이 안정된 접촉과 규격을 확인해요.",
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
      "sample": "전구의 두 금속 접점이 전지의 서로 다른 극에 정확히 닿으면 끼우개 없이도 켜질 수 있어요. 끼우개는 고정과 연결을 돕는 것이지 불을 켜는 조건의 전부는 아니에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 까닭 설명",
     "value": "끼우개가 없으면 켜지지 않을까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "끼우개는 연결을 돕는 도구이며 불이 켜지는 데 필요한 연결 자체와는 달라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "전지의 두 극과 전구의 두 접점이 어떻게 닿아야 하는지 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 14",
    "title": "전구의 두 접점 · 까닭 설명",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류계로 전류를 측정해요. 전구의 밝기만으로 전류의 정확한 값을 알 수는 없어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "전선에는 안쪽 구리와 바깥 절연 피복처럼 다른 재료가 있어요. 금속은 전기가 흐를 길을 만들고 피복은 뜻하지 않은 접촉을 막아요. 겉 재료만 보고 안의 성질까지 정하지 않아요.",
     "explanation": "전선의 겉 피복과 안쪽 구리는 다른 재료예요. 겉이 플라스틱이라고 안쪽에도 전기가 통하지 않는 것은 아니에요. 이를 확인하려고 학생이 피복을 벗기지는 않아요.",
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
      "sample": "전선에는 안쪽 구리와 바깥 절연 피복처럼 다른 재료가 있어요. 금속은 전기가 흐를 길을 만들고 피복은 뜻하지 않은 접촉을 막아요. 겉 재료만 보고 안의 성질까지 정하지 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 까닭 설명",
     "value": "전선의 안과 밖은 다른 재료예요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "안쪽 금속은 전기가 흐를 길을 만들고 겉 피복은 뜻하지 않은 접촉을 막아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "겉모양만 보고 안쪽 성질까지 정할 수 없는 까닭을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 15",
    "title": "전구의 두 접점 · 그림·설계",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 금속 안 전자의 이동과 회로에서 에너지가 전달되는 과정을 구별해요. 스위치를 닫으면 회로 전체에서 전하가 이동해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "옆 금속과 바닥 금속은 따로 표시하고 유리와 구별해요. 접점 위치를 그리는 것이지 회로를 만들어 켜 본 결과를 나타내는 것은 아니에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 그림·설계",
     "value": "전구 겉의 접점을 그려요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "분해하지 않은 전구에서 두 금속 접점과 유리를 구별해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "연결선 없이 접점의 위치에 이름표만 붙여요."
    }
   ]
  },
  {
   "previous": {
    "section": "전구의 두 접점을 찾아요 · 16",
    "title": "전구의 두 접점 · 그림·설계",
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
      "text": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 금속 안 전자의 이동과 회로에서 에너지가 전달되는 과정을 구별해요. 스위치를 닫으면 회로 전체에서 전하가 이동해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w016",
     "no": 16,
     "section": 1,
     "sectionTitle": "전구의 두 접점을 찾아요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T15",
     "topic": "전구의 두 접점을 찾아요",
     "prompt": "전지·전구·스위치·전선의 그림이나 이름을 적어요. 각 부품이 하는 일을 옆에 짧게 써서 연결하세요.",
     "answer": "전지는 전기를 공급하고, 전구는 빛을 내요. 스위치는 길을 열고 닫고 전선은 접점을 이어요. 화살표가 각 부품의 하는 일을 설명한다고 표시해요.",
     "explanation": "각 부품이 무엇을 하는지 그림이나 이름과 연결해요. 이 화살표는 하는 일을 설명하는 것이므로 실제 전선 연결과 구별해요.",
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
      "sample": "전지는 전기를 공급하고, 전구는 빛을 내요. 스위치는 길을 열고 닫고 전선은 접점을 이어요. 화살표가 각 부품의 하는 일을 설명한다고 표시해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 두 접점 · 그림·설계",
     "value": "부품과 하는 일을 연결해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전구의 옆 금속과 바닥 금속은 서로 다른 두 접점이에요.",
     "value": "전지·전구·스위치·전선은 회로에서 서로 다른 역할을 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전구의 두 접점과 그 사이의 절연 부분을 표시해요.",
     "value": "네 부품의 역할을 그림이나 이름 옆에 짧게 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 17",
    "title": "전기 회로와 재료 · 객관식",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 도체와 부도체를 물질의 전기적 성질로 비교해요. 구리와 플라스틱은 전하가 이동하기 쉬운 정도가 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "ㄱ과 ㄹ은 전지의 +극과 −극이 전구의 서로 다른 금속 접점에 이어져요. ㄴ은 같은 극에만, ㄷ은 유리에 닿으므로 ④가 맞아요.",
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
     "givens": "옆과 바닥 금속은 서로 다른 접점이에요. 정상 전지 한 개와 필라멘트 전구를 쓰며 적힌 곳만 닿는다고 정했어요. 선생님이 비교 연습을 위해 만든 기록이고 학생이 직접 본 값은 아니에요.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ ㄱ과 ㄹ",
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "given": [
      "옆과 바닥 금속은 서로 다른 접점이에요. 정상 전지 한 개와 필라멘트 전구를 쓰며 적힌 곳만 닿는다고 정했어요. 선생님이 비교 연습을 위해 만든 기록이고 학생이 직접 본 값은 아니에요."
     ],
     "figure": "electricity-question-data-17"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 객관식",
     "value": "전구를 켤 수 있는 연결"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "전지의 +극과 −극이 전구의 서로 다른 두 접점에 이어져야 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "같은 전지 극에만 이은 경우와 유리에만 닿은 경우를 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 18~19",
    "title": "전기 회로와 재료 · 객관식",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 도체와 부도체를 물질의 전기적 성질로 비교해요. 구리와 플라스틱은 전하가 이동하기 쉬운 정도가 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "② 전류가 흐를 길이 이어졌는지 끊어졌는지",
     "explanation": "스위치를 열면 전류가 흐를 길의 한 부분이 끊어져요. 전지나 전구의 재료를 바꾼 것은 아니므로 ②예요.",
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
      "전류가 흐를 길이 이어졌는지 끊어졌는지",
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
     "givens": "전지와 전구, 전선과 접점은 그대로이고 다른 고장은 없어요.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 전류가 흐를 길의 연결 여부",
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "given": [
      "전지와 전구, 전선과 접점은 그대로이고 다른 고장은 없어요."
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
     "explanation": "전구의 두 금속 접점은 전지의 서로 다른 극에 이어져야 해요. 전구를 거쳐 돌아오는 길도 끊어지지 않아야 켜질 수 있어요. 선이 동그랗게 보이는지만 살피지 않아요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "parts": [
      "(1)",
      "(2)"
     ],
     "answerPerPart": true
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 객관식",
     "value": "끊기지 않는 전류의 길"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "스위치를 열면 전구를 거쳐 돌아오는 길이 끊어져요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "길이 이어진 곳과 끊긴 곳을 근거로 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 20~21",
    "title": "전기 회로와 재료 · 빈칸 넣기",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 저항이 전류의 흐름을 방해하는 정도임을 배워요. 같은 물질도 길이와 굵기에 따라 저항이 달라져요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "절연 피복에 집게를 대는 것과 금속 접점에 대는 것은 달라요. 전기가 흐를 연결을 만들려면 실제 금속 접점이 닿아야 해요. 그래서 절연, 금속이에요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
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
     "explanation": "중간이 빈 (1)은 ㄴ, 같은 전지 극에만 이어진 (2)는 ㄷ, 바르게 이어진 (3)은 ㄱ이에요. 꺼진 두 회로도 고칠 곳이 서로 달라요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "given": [
      "ㄱ 정상이라면 켜질 수 있는 연결",
      "ㄴ 돌아오는 길에 빈 구간이 있음",
      "ㄷ 전지의 서로 다른 두 극을 쓰지 않음"
     ],
     "answerPerPart": true
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 빈칸 넣기",
     "value": "금속 접점과 전지의 두 극"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "집게는 실제 금속에 닿아야 하며, 전구의 두 접점은 전지의 서로 다른 두 극에 이어져요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "한쪽 집게가 떨어진 경우와 같은 극에만 이은 경우를 나누어 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 22~24",
    "title": "전기 회로와 재료 · 연결하기",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 물질의 비저항을 배워요. 같은 길이와 굵기인 전선도 재료가 다르면 저항이 다를 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "전기가 잘 통하는 구리의 (1)은 ㄷ, 절연 재료인 플라스틱의 (2)는 ㄱ이에요. 아직 보지 않은 (3)은 ㄴ으로 남겨요. 예상한 결과를 직접 본 것처럼 쓰지 않아요.",
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
      "ㄴ 관찰하지 못했다고 남긴 상태",
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
     "givens": "선생님이 전구를 거치는 같은 회로를 준비하고 다른 조건을 맞췄어요. 전지 두 극에 재료만 직접 대지 않아요.",
     "formLabel": "연결하기",
     "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "given": [
      "ㄱ 절연 재료 조건의 관찰",
      "ㄴ 관찰하지 못했다고 남긴 상태",
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
     "prompt": "회로를 고치려고 해요. “전지 분리 → 금속 접점 고치기 → 선생님 점검” 순서로 쓰세요.",
     "answer": "ㄷ → ㄱ → ㄴ",
     "explanation": "먼저 스위치를 열고 전지를 분리해요. 금속 접점을 고친 뒤 선생님께 점검받으므로 ㄷ → ㄱ → ㄴ이에요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
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
     "explanation": "같은 부품과 접촉 상태를 확인한 뒤 첫 재료를 잠깐 관찰해요. 전원을 분리하고 다음 재료로 바꾸므로 ㄴ → ㄷ → ㄱ이에요. 켜 두는 시간은 선생님이 정해요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "given": [
      "ㄱ 전원을 분리하고 다음 재료로 바꾼다.",
      "ㄴ 같은 전구·접촉 위치·처음 상태를 확인한다.",
      "ㄷ 점검받은 첫 재료를 잠깐 관찰한다."
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 연결하기",
     "value": "재료 비교와 안전한 변경 순서"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "전기가 통하는 재료를 비교할 때는 전구를 거치는 같은 회로와 접촉 조건을 써요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "전원 분리와 선생님 점검이 필요한 때를 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 25",
    "title": "전기 회로와 재료 · 복수 선택",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류가 흐르는 길을 따라 전하가 보존됨을 배워요. 한 줄 회로에서 전구를 지난 뒤 전류가 모두 없어지는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "ㄱ과 ㄹ은 전구의 두 접점이 서로 다른 전지 극에 이어져요. 이 필라멘트 전구는 연결 방향이 반대여도 켜질 수 있어요. ㄴ은 같은 극에만 이어졌으므로 ①, ②, ⑤예요. ㄷ의 유리는 금속 접점이 아니에요.",
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
     "givens": "옆과 바닥 금속은 서로 다른 접점이에요. 정상 전지 한 개와 필라멘트 전구를 쓰며 적힌 곳만 닿는다고 정했어요. 선생님이 비교 연습을 위해 만든 기록이고 학생이 직접 본 값은 아니에요.",
     "formLabel": "복수 선택",
     "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ②, ⑤. 선택한 순서는 관계없다.",
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "given": [
      "옆과 바닥 금속은 서로 다른 접점이에요. 정상 전지 한 개와 필라멘트 전구를 쓰며 적힌 곳만 닿는다고 정했어요. 선생님이 비교 연습을 위해 만든 기록이고 학생이 직접 본 값은 아니에요."
     ],
     "figure": "electricity-question-data-25"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 복수 선택",
     "value": "반대 방향으로 이은 필라멘트 전구"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "정상 필라멘트 전구는 두 접점에 이은 전지 극의 방향이 반대여도 켜질 수 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "두 카드에서 서로 다른 극을 썼는지 확인해요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 26",
    "title": "전기 회로와 재료 · 복수 선택",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류가 흐르는 길을 따라 전하가 보존됨을 배워요. 한 줄 회로에서 전구를 지난 뒤 전류가 모두 없어지는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "접점과 누르는 방법, 보는 시간과 위치, 전구와 전지를 같게 해요. 그래서 ①, ③, ④예요. 재료와 전지 수를 함께 바꾸면 무엇 때문에 달라졌는지 알기 어려워요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요."
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 복수 선택",
     "value": "재료만 바꾸어 비교해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "접촉 위치·방법·관찰 시간과 같은 전구·전지를 유지해야 재료의 영향을 살피기 좋아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "한꺼번에 바꾸면 안 되는 조건을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 27",
    "title": "전기 회로와 재료 · 자료 해석",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전압이 같을 때 저항과 전류의 관계를 실험해요. 연결이 잘못된 회로와 저항이 큰 재료를 구별해야 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "켜질 수 있는 ㄱ과 ㄹ은 2개, 그렇지 않은 ㄴ과 ㄷ도 2개예요. ㄴ은 같은 전지 극에만 이어지고 ㄷ은 유리에 닿은 경우예요.",
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
     "givens": "옆과 바닥 금속은 서로 다른 접점이에요. 정상 전지 한 개와 필라멘트 전구를 쓰며 적힌 곳만 닿는다고 정했어요. 선생님이 비교 연습을 위해 만든 기록이고 학생이 직접 본 값은 아니에요.",
     "verificationModel": {
      "kind": "lamp-state-counts",
      "model": "circuits"
     },
     "formLabel": "자료 해석",
     "criteria": "(1) 2개 (단위 필요) / (2) 2개 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "given": [
      "옆과 바닥 금속은 서로 다른 접점이에요. 정상 전지 한 개와 필라멘트 전구를 쓰며 적힌 곳만 닿는다고 정했어요. 선생님이 비교 연습을 위해 만든 기록이고 학생이 직접 본 값은 아니에요."
     ],
     "parts": [
      "(1) · 단위도 써요.",
      "(2) · 단위도 써요."
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-27"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 자료 해석",
     "value": "켜질 수 있는 연결의 수"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "표의 실제 접점과 전지 극을 읽어 정상 연결과 다른 연결을 구별해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "두 종류의 카드 수를 나누어 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 28",
    "title": "전기 회로와 재료 · 자료 해석",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전압이 같을 때 저항과 전류의 관계를 실험해요. 연결이 잘못된 회로와 저항이 큰 재료를 구별해야 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "전구 바닥 금속과 전지 −극을 이으면 전구를 거쳐 돌아오는 길이 완성돼요. 전구를 건너뛰고 전지의 두 극을 전선만으로 잇지 않아요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "parts": [
      "(1)",
      "(2)"
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-28"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 자료 해석",
     "value": "떨어진 두 끝을 찾아요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "전구 바닥 접점에서 전지의 남은 극까지 이어져야 돌아오는 길이 완성돼요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "전구를 건너뛰는 전지 직접 연결과 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 29",
    "title": "전기 회로와 재료 · 까닭 설명",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 반도체가 도체·부도체와 다른 전기적 특성을 지님을 배워요. 빛이나 온도 등의 조건에 따라 성질이 달라질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w029",
     "no": 29,
     "section": 2,
     "sectionTitle": "끊기지 않는 연결과 재료를 비교해요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T02",
     "topic": "끊기지 않는 연결과 재료를 비교해요",
     "prompt": "친구가 “선이 동그라니 반드시 켜지는 회로야”라고 했어요. 무엇을 더 확인해야 할까요?",
     "answer": "선 모양만으로는 알 수 없어요. 전구의 두 금속 접점이 전지의 서로 다른 극에 이어지는지, 실제로 닿았는지와 중간에 빈 곳이 없는지 확인해야 해요.",
     "explanation": "같은 전지 극에만 이어도 선은 동그랗게 그릴 수 있어요. 실제로는 전구의 두 금속 접점이 서로 다른 극에 닿는지, 빈 곳이 없는지와 부품 상태·규격을 확인해야 해요.",
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
      "sample": "선 모양만으로는 알 수 없어요. 전구의 두 금속 접점이 전지의 서로 다른 극에 이어지는지, 실제로 닿았는지와 중간에 빈 곳이 없는지 확인해야 해요.",
      "required": [
       "겉모양과 접속 관계를 구별한다.",
       "두 접점·서로 다른 전지 극을 설명한다.",
       "접촉 상태와 빈 구간을 확인한다."
      ],
      "exactStringScoring": false
     },
     "formLabel": "까닭 설명",
     "criteria": "겉모양과 접속 관계를 구별한다. / 두 접점·서로 다른 전지 극을 설명한다. / 접촉 상태와 빈 구간을 확인한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 까닭 설명",
     "value": "동그란 모양만 보면 될까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "선이 동그랗게 보이는 모양보다 어떤 접점끼리 실제로 닿았는지가 중요해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "두 접점과 두 극, 빈 구간과 접촉 상태를 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 30",
    "title": "전기 회로와 재료 · 까닭 설명",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 반도체가 도체·부도체와 다른 전기적 특성을 지님을 배워요. 빛이나 온도 등의 조건에 따라 성질이 달라질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "재료와 집게가 닿는 상태가 함께 달라졌어요. 재료 때문이라고만 할 수는 없어요. 전원을 분리하고 접촉 위치와 누르는 방법을 같게 한 뒤 다시 비교해요.",
     "explanation": "재료뿐 아니라 집게가 닿는 상태도 달랐어요. 결과는 그대로 남기고 전원을 분리한 뒤 접촉 위치와 누르는 방법을 같게 하여 다시 비교해요.",
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
      "sample": "재료와 집게가 닿는 상태가 함께 달라졌어요. 재료 때문이라고만 할 수는 없어요. 전원을 분리하고 접촉 위치와 누르는 방법을 같게 한 뒤 다시 비교해요.",
      "required": [
       "접촉 조건 차이를 읽는다.",
       "인과 판단의 한계를 설명한다.",
       "전원을 분리하고 접촉 조건을 맞추는 수정을 제안한다."
      ],
      "exactStringScoring": false
     },
     "formLabel": "까닭 설명",
     "criteria": "접촉 조건 차이를 읽는다. / 인과 판단의 한계를 설명한다. / 전원을 분리하고 접촉 조건을 맞추는 수정을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 까닭 설명",
     "value": "느슨한 집게도 결과를 바꿔요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "재료와 집게의 접촉 상태가 함께 달라지면 재료만의 영향이라 할 수 없어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "전원을 분리한 뒤 고칠 접촉 조건을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 31",
    "title": "전기 회로와 재료 · 그림·설계",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전선의 저항 때문에 전기 에너지 일부가 열로 바뀜을 살펴요. 실제 전선은 저항이 완전히0인 선이 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "전지의 +극과 −극이 전구의 서로 다른 접점에 이어지도록 그려요. 선 모양보다 실제 닿는 곳이 중요해요. 그림을 그린 것과 선생님 점검 뒤 실물로 켜 본 것은 구별해요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 그림·설계",
     "value": "전구를 거쳐 돌아오는 길을 그려요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "전지의 서로 다른 두 극이 전구의 두 접점을 거치는 끊기지 않는 길을 만들어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "전지 극·전구 접점과 돌아오는 길을 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "끊기지 않는 연결과 재료를 비교해요 · 32",
    "title": "전기 회로와 재료 · 그림·설계",
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
      "text": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전선의 저항 때문에 전기 에너지 일부가 열로 바뀜을 살펴요. 실제 전선은 저항이 완전히0인 선이 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "같은 전지와 전구, 전선으로 만든 회로 안에 재료를 바꿔 넣을 틈을 그려요. 같은 접촉 방법을 표시하고 표에는 재료·실제 결과·접촉 상태·보지 못한 점을 적을 칸을 두어요. 결과는 비워 두어요.",
     "explanation": "재료를 넣을 틈은 전구를 거치는 회로 안에 표시해요. 전지의 두 극에 재료만 직접 대지 않아요. 같게 할 조건과 아직 보지 않은 결과를 나누어 나타내요.",
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
      "sample": "같은 전지와 전구, 전선으로 만든 회로 안에 재료를 바꿔 넣을 틈을 그려요. 같은 접촉 방법을 표시하고 표에는 재료·실제 결과·접촉 상태·보지 못한 점을 적을 칸을 두어요. 결과는 비워 두어요.",
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
     "misconception": "둥근 모양만으로 끊기지 않은 전기 회로를 판단하지 않아요. 서로 다른 전지 극·서로 다른 전구 접점과 실제 접촉 상태를 확인해요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 회로와 재료 · 그림·설계",
     "value": "재료를 바꿀 틈과 빈 표"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지의 두 극에서 전구의 두 접점을 거쳐 끊기지 않게 이어야 불이 켜져요.",
     "value": "전구를 거치는 회로 안의 틈에 재료를 바꿔 넣고 다른 조건은 같게 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어디가 이어지고 어디가 끊겼는지 근거를 들어 설명해요.",
     "value": "아직 보지 않은 결과는 채우지 않고 비교할 칸을 만들어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 33",
    "title": "전지의 직렬연결 · 객관식",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전지 두 개를 같은 방향으로 직렬연결하면 전체 전압이 커짐을 배워요. 전지 수와 전구의 밝기를 전압으로 연결해 설명해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w033",
     "no": 33,
     "section": 3,
     "sectionTitle": "전지 한 개와 두 개를 연결해요",
     "bookResponseForm": "single",
     "form": "choice",
     "type": "T05",
     "topic": "전지 한 개와 두 개를 연결해요",
     "prompt": "전지 두 개를 직렬연결할 때 가운데에서 연결하는 극으로 알맞은 것을 고르세요.",
     "answer": "⑤ ㄴ",
     "explanation": "서로 다른 극을 이은 ㄴ이 전지 두 개의 직렬연결이에요. ㄱ·ㄷ은 같은 극끼리 이었어요. 전지가 한 줄로 놓인 모양보다 +극과 −극의 실제 연결을 살펴요.",
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
     "givens": "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요.",
     "formLabel": "객관식",
     "criteria": "조건에 맞는 보기 한 개를 고른다: ⑤ ㄴ",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "given": [
      "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요."
     ],
     "figure": "electricity-question-data-33"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 객관식",
     "value": "두 전지 가운데에서 이은 극"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "전지 두 개의 직렬연결은 한 전지의 +극과 다른 전지의 −극을 이어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "한 줄로 놓인 모양 대신 가운데 극 표시를 읽어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 34~35",
    "title": "전지의 직렬연결 · 객관식",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전지 두 개를 같은 방향으로 직렬연결하면 전체 전압이 커짐을 배워요. 전지 수와 전구의 밝기를 전압으로 연결해 설명해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w034",
     "no": 34,
     "section": 3,
     "sectionTitle": "전지 한 개와 두 개를 연결해요",
     "bookResponseForm": "single",
     "form": "choice",
     "type": "T05",
     "topic": "전지 한 개와 두 개를 연결해요",
     "prompt": "전지 한 개와 두 개를 비교해요. 전지 수 외에 같게 할 조건을 고르세요.",
     "answer": "③ 전지 종류와 사용 상태",
     "explanation": "전지 수만 비교하려면 종류와 사용 상태를 같게 하는 ③이 알맞아요. 전구와 접촉 상태, 전선과 주변 밝기도 같게 하고 알맞은 규격을 써요.",
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
     "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 전지 종류와 사용 상태",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "given": [
      "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다."
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
     "prompt": "전지 두 개를 직렬연결할 때 가운데의 (1) 극끼리 잇고, 남은 (2) 두 극을 전구가 있는 회로에 연결해요. 보기: 서로 다른·바깥",
     "answer": "서로 다른 / 바깥",
     "explanation": "가운데에서는 서로 다른 극을 잇고, 남은 바깥 두 극은 전구를 거치는 회로에 이어져요. 모든 극을 한 점에 모아 잇는 것과 구별해요.",
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
     "criteria": "(1) 서로 다른 또는 다른 / (2) 바깥 또는 바깥쪽. 부분별 답의 대응을 유지한다.",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "parts": [
      "(1)",
      "(2)"
     ],
     "answerPerPart": true
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 객관식",
     "value": "같은 전지 상태와 직렬연결"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "전지 수 외의 영향을 줄이려면 같은 종류와 사용 상태의 전지, 같은 전구를 써요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "가운데 이은 극과 바깥에 남은 두 극을 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 36~37",
    "title": "전지의 직렬연결 · 빈칸 넣기",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전압계를 연결해 두 지점 사이의 전압을 측정해요. 밝기를 비교한 결과와 전압을 직접 잰 결과는 다른 자료예요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "연결을 바꾸기 전에는 전원을 분리해요. 다시 연결한 뒤에는 교사, 즉 선생님의 점검을 받아요. 전지 수를 마음대로 늘리지 않고 부품 규격을 확인해요.",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
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
     "explanation": "전지 한 개의 두 극을 쓴 (1)은 ㄷ이에요. 두 전지의 서로 다른 극을 이은 (2)는 ㄱ, 같은 극끼리 이은 (3)은 ㄴ이에요. 두 개라는 수만 보지 말고 실제 극을 읽어요.",
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
      "(2) 같은 두 전지의 직렬연결",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "given": [
      "ㄱ 가운데 서로 다른 극을 이음",
      "ㄴ 가운데 같은 극을 이음",
      "ㄷ 전지의 양극을 전구에 각각 이음"
     ],
     "answerPerPart": true
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 빈칸 넣기",
     "value": "전원 분리와 연결의 종류"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "전지 수를 바꾸기 전에는 전원을 분리하고 다시 이은 뒤 점검받아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "전지 한 개와 두 개, 가운데 같은 극끼리 이은 경우를 나누어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 38~40",
    "title": "전지의 직렬연결 · 연결하기",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류·전압·저항의 관계를 배워요. 전지 수가 늘었다고 모든 기구가 같은 비율로 밝아지는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w038",
     "no": 38,
     "section": 3,
     "sectionTitle": "전지 한 개와 두 개를 연결해요",
     "bookResponseForm": "match",
     "form": "short",
     "type": "T05",
     "topic": "전지 한 개와 두 개를 연결해요",
     "prompt": "각 내용을 무엇으로 확인할 수 있는지 연결하세요.",
     "answer": "ㄷ / ㄱ / ㄴ",
     "explanation": "전지의 극은 +·− 표시인 ㄷ, 허용 전지 수는 설명서와 선생님 점검인 ㄱ, 접촉 상태는 실제 닿은 곳인 ㄴ으로 확인해요.",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
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
     "prompt": "“전지 분리 → 두 전지 연결 점검 → 잠깐 관찰” 순서로 기호를 쓰세요.",
     "answer": "ㄷ → ㄱ → ㄴ",
     "explanation": "스위치를 열고 전지를 분리한 뒤 두 전지의 연결을 점검받아요. 정한 시간만 잠깐 관찰하므로 ㄷ → ㄱ → ㄴ이에요. 전지를 계속 더하는 활동은 아니에요.",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
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
     "prompt": "“극 표시 읽기 → 가운데 연결 확인 → 바깥 연결 확인” 순서로 기호를 쓰세요.",
     "answer": "ㄴ → ㄷ → ㄱ",
     "explanation": "먼저 각 전지의 +·− 표시를 읽어요. 가운데에서 닿은 극을 확인하고 바깥 두 극의 연결을 살피므로 ㄴ → ㄷ → ㄱ이에요.",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "given": [
      "ㄱ 남은 두 극이 전구의 다른 접점으로 가는지 본다.",
      "ㄴ 각 전지의 +·− 위치를 읽는다.",
      "ㄷ 가운데에서 어떤 극끼리 닿는지 확인한다."
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 연결하기",
     "value": "극과 접촉을 확인하는 순서"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "전지의 +·− 표시를 읽고 가운데 연결과 바깥 두 극의 연결을 차례로 확인해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "설명서와 실제 접점에서 각각 확인할 것을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 41",
    "title": "전지의 직렬연결 · 복수 선택",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 저항의 직렬연결과 병렬연결을 비교해요. 이 교재의 전지 직렬연결과 전구 여러 개의 연결은 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "전지 종류와 상태를 맞춘 ②, 알맞은 같은 전구를 쓴 ③, 선생님이 허용한 두 조건에서 비교한 ⑤가 맞아요. 더 밝아졌다고 전지를 계속 추가해도 되는 것은 아니에요.",
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
      "규격이 맞는 같은 전구 하나를 쓴다.",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요."
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 복수 선택",
     "value": "허용한 두 조건에서 비교해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "전지의 종류·상태와 전구 규격을 맞추고 허용된 한 개·두 개 조건에서 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "밝아졌다고 전지를 계속 늘려서는 안 되는 까닭을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 42",
    "title": "전지의 직렬연결 · 복수 선택",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 저항의 직렬연결과 병렬연결을 비교해요. 이 교재의 전지 직렬연결과 전구 여러 개의 연결은 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "표에서 ㄱ은 +극끼리, ㄴ은 −극과 +극, ㄷ은 −극끼리 이었어요. 그래서 ①, ④, ⑤예요. 색이나 한 줄 모양 대신 극 표시를 읽어요.",
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
     "givens": "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요.",
     "formLabel": "복수 선택",
     "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ④, ⑤. 선택한 순서는 관계없다.",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "given": [
      "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요."
     ],
     "figure": "electricity-question-data-42"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 복수 선택",
     "value": "같은 극과 서로 다른 극"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "가운데 이은 두 극을 읽어 +극끼리, −극끼리와 서로 다른 극을 구별해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "전선 색만으로 연결을 정할 수 없는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 43",
    "title": "전지의 직렬연결 · 자료 해석",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전지를 반대 방향으로 연결했을 때 전압의 합을 따져요. 전지의 놓인 모양보다 각 단자의 실제 연결이 중요해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "가운데에서 서로 다른 극을 이은 카드는 ㄴ 하나예요. 따라서 1개, ㄴ이에요. ㄱ과 ㄷ은 같은 극끼리 이었어요.",
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
     "givens": "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요.",
     "verificationModel": {
      "kind": "aiding-cell-joins",
      "model": "cellJoin"
     },
     "formLabel": "자료 해석",
     "criteria": "(1) 1개 (단위 필요) / (2) ㄴ. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "given": [
      "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요."
     ],
     "parts": [
      "(1) · 단위도 써요.",
      "(2)"
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-43"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 자료 해석",
     "value": "서로 다른 극을 이은 카드"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "세 카드 중 가운데가 서로 다른 극인 연결을 골라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "카드의 수와 그 기호를 각각 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 44",
    "title": "전지의 직렬연결 · 자료 해석",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전지를 반대 방향으로 연결했을 때 전압의 합을 따져요. 전지의 놓인 모양보다 각 단자의 실제 연결이 중요해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "가운데의 −극과 +극은 서로 다른 극이에요. 전구에는 그 연결에 쓰지 않은 바깥 두 극을 이어요. 가운데 연결과 바깥 두 끝을 구별해요.",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "parts": [
      "(1)",
      "(2)"
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-44"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 자료 해석",
     "value": "가운데 연결과 바깥 양 끝"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "가운데에서 쓰지 않고 남은 바깥 두 극을 전구가 있는 회로에 이어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "가운데의 극 관계와 전구에 이을 위치를 나누어 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 45",
    "title": "전지의 직렬연결 · 까닭 설명",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전압이 전하에 전달되는 에너지와 관련됨을 배워요. 전지의 크기만 보고 전압이 항상 크다고 정할 수는 없어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w045",
     "no": 45,
     "section": 3,
     "sectionTitle": "전지 한 개와 두 개를 연결해요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T05",
     "topic": "전지 한 개와 두 개를 연결해요",
     "prompt": "“전지 두 개를 한 줄로 놓았으니 직렬연결이야”라는 말이 맞을까요? 극과 실제 연결을 보고 설명하세요.",
     "answer": "한 줄 모양만 보지 않아요. 가운데에서 서로 다른 극끼리 이었는지, 바깥에 남은 두 극이 전구의 서로 다른 접점에 이어졌는지 확인해야 해요.",
     "explanation": "한 줄로 놓아도 같은 극끼리 마주할 수 있어요. +·− 표시를 보고 가운데는 서로 다른 극인지, 바깥 두 극은 전구의 다른 접점에 이어지는지 확인해요.",
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
      "sample": "한 줄 모양만 보지 않아요. 가운데에서 서로 다른 극끼리 이었는지, 바깥에 남은 두 극이 전구의 서로 다른 접점에 이어졌는지 확인해야 해요.",
      "required": [
       "겉모양과 극 접속을 구별한다.",
       "가운데 서로 다른 극을 설명한다.",
       "바깥 두 극과 전구의 두 접점을 연결한다."
      ],
      "exactStringScoring": false
     },
     "formLabel": "까닭 설명",
     "criteria": "겉모양과 극 접속을 구별한다. / 가운데 서로 다른 극을 설명한다. / 바깥 두 극과 전구의 두 접점을 연결한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 까닭 설명",
     "value": "한 줄 모양이면 직렬연결일까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "전지를 나란히 놓은 모양만으로는 극의 실제 연결을 알 수 없어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "가운데 연결과 바깥 두 끝을 근거로 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 46",
    "title": "전지의 직렬연결 · 까닭 설명",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전압이 전하에 전달되는 에너지와 관련됨을 배워요. 전지의 크기만 보고 전압이 항상 크다고 정할 수는 없어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "같은 종류와 상태의 새 전지를 준비하고 부품 규격을 확인해요. 지금은 전지 수와 사용 상태가 함께 달라져 밝기 차이를 전지 수 때문이라고만 할 수는 없어요.",
     "explanation": "전지 수와 새것·헌것의 상태가 함께 달라졌어요. 같은 종류와 상태의 새 전지를 준비하고 부품 규격을 확인하여 계획을 고쳐요. 새것과 헌것을 섞어 시험하지 않아요.",
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
      "규격과 교사 점검을 포함한다."
     ],
     "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "같은 종류와 상태의 새 전지를 준비하고 부품 규격을 확인해요. 지금은 전지 수와 사용 상태가 함께 달라져 밝기 차이를 전지 수 때문이라고만 할 수는 없어요.",
      "required": [
       "종류·상태의 일치를 제안한다.",
       "전지 수 외의 조건이 바뀌었음을 설명한다.",
       "규격과 교사 점검을 포함한다."
      ],
      "exactStringScoring": false
     },
     "formLabel": "까닭 설명",
     "criteria": "종류·상태의 일치를 제안한다. / 전지 수 외의 조건이 바뀌었음을 설명한다. / 규격과 교사 점검을 포함한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 까닭 설명",
     "value": "새 전지와 헌 전지를 섞었다면"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "전지 수와 사용 상태가 함께 바뀌면 밝기 차이를 전지 수 때문이라고만 할 수 없어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "전지의 종류·상태와 허용 규격을 어떻게 맞출지 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 47",
    "title": "전지의 직렬연결 · 그림·설계",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전지의 전압과 저장한 에너지의 양을 구별해요. 전압이 같아도 사용할 수 있는 시간이 같다는 뜻은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w047",
     "no": 47,
     "section": 3,
     "sectionTitle": "전지 한 개와 두 개를 연결해요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T15",
     "topic": "전지 한 개와 두 개를 연결해요",
     "prompt": "전지 한 개를 연결한 회로와 전지 두 개를 직렬연결한 회로를 나란히 그리세요. 가운데에서 이은 극과 남은 두 극을 모두 표시하세요.",
     "answer": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
     "explanation": "두 그림 모두 같은 전구 하나를 써요. 두 전지 쪽은 가운데 +극과 −극을 이은 곳, 바깥 두 극을 전구에 이은 곳을 구별해요. 전구 여러 개를 잇는 문제로 바꾸지 않아요.",
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
      "같은 전구·허용 규격을 메모한다."
     ],
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
      "required": [
       "한개/두개 조건을 나눈다.",
       "모든 극 표시와 가운데 접속을 구별한다.",
       "같은 전구·허용 규격을 메모한다."
      ],
      "exactStringScoring": false
     },
     "drawingSpaceMinimumMm": 120,
     "drawingExplanationLines": 3,
     "formLabel": "그림·설계",
     "criteria": "한개/두개 조건을 나눈다. / 모든 극 표시와 가운데 접속을 구별한다. / 같은 전구·허용 규격을 메모한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 그림·설계",
     "value": "한 개와 두 개의 연결을 그려요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "같은 전구 하나에 전지 한 개와 직렬연결한 두 개를 각각 이어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "가운데 이은 극과 바깥 두 극, 전구 접점을 모두 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전지 한 개와 두 개를 연결해요 · 48",
    "title": "전지의 직렬연결 · 그림·설계",
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
      "text": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전지의 전압과 저장한 에너지의 양을 구별해요. 전압이 같아도 사용할 수 있는 시간이 같다는 뜻은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w048",
     "no": 48,
     "section": 3,
     "sectionTitle": "전지 한 개와 두 개를 연결해요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T15",
     "topic": "전지 한 개와 두 개를 연결해요",
     "prompt": "다음 전지 카드에서 고칠 곳을 찾아, 직렬연결이 되도록 고친 모습을 그리세요. 실제로 연결하지 말고, 전지를 분리하고 확인할 순서도 쓰세요.",
     "answer": "전지를 분리한 상태라고 쓰고 +·− 표시를 읽어요. 가운데는 서로 다른 극이 닿도록 고칠 곳을 표시해요. 바깥 연결과 선생님 점검도 표시해요.",
     "explanation": "전지를 분리한 상태라고 표시하고 각 전지의 극을 읽어요. 가운데를 서로 다른 극끼리 잇도록 고치고 바깥 연결과 선생님 점검 순서를 나타내요. 실제로 전지를 추가하는 문제는 아니에요.",
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
      "sample": "전지를 분리한 상태라고 쓰고 +·− 표시를 읽어요. 가운데는 서로 다른 극이 닿도록 고칠 곳을 표시해요. 바깥 연결과 선생님 점검도 표시해요.",
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
     "misconception": "같은 전지 단자끼리 이었다고 전지 두 개의 직렬연결이 되는 것은 아니에요. 부품 규격을 넘겨 전지를 임의로 늘리지 않아요.",
     "drawing": "large",
     "figure": "electricityBatteryPolarityCard"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전지의 직렬연결 · 그림·설계",
     "value": "잘못 이은 전지 카드를 고쳐요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 두 개는 한 전지의 +극과 다른 전지의 −극을 이어 직렬연결해요.",
     "value": "같은 극끼리 이은 가운데 부분을 찾아 서로 다른 극이 되도록 그림에서 고쳐요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "서로 이어진 두 전지의 극과 회로에 연결할 남은 두 극을 표시해요.",
     "value": "실제로 연결하지 않고 전원 분리와 점검 순서를 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 49",
    "title": "전구의 밝기 비교 · 객관식",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 같은 저항에 걸린 전압을 바꾸며 전류를 비교해요. 비교할 물체를 같게 두어야 전압의 영향을 알아보기 쉬워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "① 같은 전구와 닿는 상태를 그대로 둔다.",
     "explanation": "같은 전구와 접촉 상태를 유지한 ①이 알맞아요. 전지 수 외의 조건도 바꾸면 밝기 차이의 까닭을 찾기 어려워요.",
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
      "같은 전구와 닿는 상태를 그대로 둔다.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 객관식",
     "value": "전지 수 외의 조건을 같게 해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "같은 전구와 접촉 상태를 유지해 전지 수의 영향만 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "같게 할 조건과 바꿀 조건을 각각 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 50",
    "title": "전구의 밝기 비교 · 객관식",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 같은 저항에 걸린 전압을 바꾸며 전류를 비교해요. 비교할 물체를 같게 두어야 전압의 영향을 알아보기 쉬워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "세 번 모두 50>31, 54>33, 52>32이므로 두 전지 쪽 표시가 높아요. 따라서 ④예요. 이 표에서 다른 전구나 세 전지의 결과까지 읽을 수는 없어요.",
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
     "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ④ 세 번 모두 두 전지 표시가 더 높다.",
     "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
     "given": [
      "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
     ],
     "figure": "electricity-question-data-50"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 객관식",
     "value": "센서 표에서 읽을 수 있는 결론"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "세 번의 센서 표시를 한 개·두 개 조건끼리 짝지어 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "이 표에 없는 전구나 전지 수의 결과도 알 수 있을까요?"
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 51~53",
    "title": "전구의 밝기 비교 · 빈칸 넣기",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 필라멘트의 온도가 높아지면 저항도 변함을 살펴요. 전구 밝기를 단순한 전지 수의 비례식으로 정하기 어려운 까닭이에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "알아보려는 전지 수는 바꿀 조건이에요. 다른 까닭이 섞이지 않게 같은 전구와 보는 위치는 같게 할 조건이에요. 이 조건들이 언제나 영향이 없다는 뜻은 아니에요.",
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
     "prompt": "직접 관찰하지 않은 연습표는 (1) 자료라고 밝히고, 아직 해 보지 않은 비교는 (2)으로 남겨요. 보기: 제공·아직 하지 않음",
     "answer": "제공 / 아직 하지 않음",
     "explanation": "선생님이 준 연습표는 제공 자료이고, 해 보지 않은 비교는 아직 하지 않음으로 남겨요. 표의 문제를 맞혔다고 실제 실험을 했다고 쓰지 않아요.",
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
         "아직 하지 않음",
         "관찰하지 못함"
        ]
       }
      ]
     },
     "formLabel": "빈칸 넣기",
     "criteria": "(1) 제공 또는 교사 제공 또는 연습 / (2) 아직 하지 않음 또는 관찰하지 못함. 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
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
     "explanation": "전지 수는 바꾸므로 ㄷ, 전구와 전선은 같게 두므로 ㄴ, 밝기는 살펴볼 결과이므로 ㄱ이에요. 예상과 직접 본 결과도 나누어요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 빈칸 넣기",
     "value": "바꿀 조건·같게 할 조건·관찰 결과"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "전지 수는 바꾸고 전구와 위치는 같게 하며, 밝기 차이를 살펴요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "제공된 연습표와 직접 본 기록을 어떻게 구별할지 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 54~56",
    "title": "전구의 밝기 비교 · 연결하기",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 소비 전력으로 에너지 전환의 빠르기를 비교해요. 밝기와 소비 전력은 같은 양이 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w054",
     "no": 54,
     "section": 4,
     "sectionTitle": "같은 조건으로 밝기를 비교해요",
     "bookResponseForm": "match",
     "form": "short",
     "type": "T16",
     "topic": "같은 조건으로 밝기를 비교해요",
     "prompt": "각 말이 어떤 자료를 뜻하는지 연결하세요.",
     "answer": "ㄱ / ㄷ / ㄴ",
     "explanation": "센서의 숫자는 정해진 위치의 관찰인 ㄱ, 눈으로 본 밝기 비교는 ㄷ, 세 전지를 쓰지 않은 것은 ㄴ이에요. 어떤 방법으로 얻은 자료인지 함께 밝혀요.",
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
      "ㄱ 정한 위치에서 숫자로 읽은 관찰",
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
      "ㄱ 정한 위치에서 숫자로 읽은 관찰",
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
     "prompt": "“같은 위치와 접점 확인 → 두 조건 관찰 → 반복 기록 비교” 순서로 쓰세요.",
     "answer": "ㄴ → ㄱ → ㄷ",
     "explanation": "위치와 접촉 상태를 확인하고 두 조건을 본 뒤 반복 기록을 비교하므로 ㄴ → ㄱ → ㄷ이에요. 여러 번 해도 같은 잘못된 조건이 있었는지는 따로 확인해요.",
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
     "explanation": "제공된 연습표임을 밝힌 뒤 한 전지와 두 전지의 표시를 비교해요. 그 조건에서 알 수 있는 것을 쓰므로 ㄷ → ㄱ → ㄴ이에요. 우리 반이 직접 잰 값으로 바꾸지 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 연결하기",
     "value": "자료의 종류와 반복 비교 순서"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "센서 숫자와 눈으로 본 비교, 아직 시험하지 않은 조건을 구별해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "같은 조건을 확인한 뒤 반복 기록을 읽는 순서를 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 57",
    "title": "전구의 밝기 비교 · 복수 선택",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 측정값의 평균과 퍼진 정도를 함께 살펴요. 평균이 같더라도 반복한 값의 차이는 다를 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "전지의 종류와 상태, 전구와 전선, 보는 위치와 주변 밝기를 같게 해요. 그래서 ①, ③, ④예요. 접촉 상태나 규격을 다르게 두지 않아요.",
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
      "밝아 보인 쪽의 규격 확인을 생략한다.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 복수 선택",
     "value": "공정하게 밝기를 비교하려면"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "전지 상태·전구·전선·접점과 관찰 위치·주변 밝기를 같게 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "한쪽만 바꾸면 비교하기 어려워지는 조건을 골라요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 58",
    "title": "전구의 밝기 비교 · 복수 선택",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 측정값의 평균과 퍼진 정도를 함께 살펴요. 평균이 같더라도 반복한 값의 차이는 다를 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w058",
     "no": 58,
     "section": 4,
     "sectionTitle": "같은 조건으로 밝기를 비교해요",
     "bookResponseForm": "multiple",
     "form": "choice",
     "type": "T16",
     "topic": "같은 조건으로 밝기를 비교해요",
     "prompt": "이 연습표만으로 알 수 없는 내용을 세 개 고르세요.",
     "answer": "①, ④, ⑤",
     "explanation": "표의 숫자와 두 전지 쪽이 높다는 것은 알 수 있어요. 하지만 모든 전구의 밝기, 우리 반의 실제 측정, 세 전지의 안전은 알 수 없으므로 ①, ④, ⑤예요.",
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
     "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
     "formLabel": "복수 선택",
     "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ④, ⑤. 선택한 순서는 관계없다.",
     "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
     "given": [
      "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
     ],
     "figure": "electricity-question-data-58"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 복수 선택",
     "value": "연습표만으로 알 수 없는 것"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "제공된 센서 표는 우리 반의 실측이나 세 전지의 안전을 알려 주는 자료가 아니에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "표가 알려 주는 범위와 더 확인할 것을 나누어요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 59",
    "title": "전구의 밝기 비교 · 자료 해석",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 빛을 내는 물체와 주변에서 반사된 빛의 영향을 구별해요. 밝기 측정은 주변 조명 조건도 맞추어 비교해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "한 전지는 (31+33+32)÷3=32 lx, 두 전지는 (50+54+52)÷3=52 lx예요. 같은 위치에서 읽은 세 값의 평균이지 전구의 전력이나 모든 방향의 빛을 잰 값은 아니에요.",
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
     "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
     "verificationModel": {
      "kind": "brightness-means",
      "model": "brightness"
     },
     "formLabel": "자료 해석",
     "criteria": "(1) 32lx (단위 필요) / (2) 52lx (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
     "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
     "given": [
      "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
     ],
     "parts": [
      "(1) · 단위도 써요.",
      "(2) · 단위도 써요."
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-59"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 자료 해석",
     "value": "세 번의 센서 표시 평균"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "각 조건의 세 표시를 더해 3으로 나누어 같은 위치의 평균을 구해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "평균에 표의 단위 lx를 붙여 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 60",
    "title": "전구의 밝기 비교 · 자료 해석",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 빛을 내는 물체와 주변에서 반사된 빛의 영향을 구별해요. 밝기 측정은 주변 조명 조건도 맞추어 비교해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "평균의 차는 52−32=20 lx예요. 세 번 모두 두 전지 쪽이 높으므로 3회예요. 각각의 차가 19, 21, 20 lx라고 다르게 나와도 기록을 그대로 남겨요.",
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
     "givens": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
     "verificationModel": {
      "kind": "brightness-comparison",
      "model": "brightness"
     },
     "formLabel": "자료 해석",
     "criteria": "(1) 20lx (단위 필요) / (2) 3회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
     "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
     "given": [
      "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다."
     ],
     "parts": [
      "(1) · 단위도 써요.",
      "(2) · 단위도 써요."
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-60"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 자료 해석",
     "value": "평균 차와 같은 경향의 횟수"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "두 평균의 차와 어느 조건이 더 높은지 나타난 횟수는 서로 다른 양이에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "표시 차의 단위와 반복 횟수의 단위를 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 61",
    "title": "전구의 밝기 비교 · 까닭 설명",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 열로 바뀌는 현상을 배워요. 같은 전구를 오래 켜 두면 온도 조건도 달라질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w061",
     "no": 61,
     "section": 4,
     "sectionTitle": "같은 조건으로 밝기를 비교해요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T16",
     "topic": "같은 조건으로 밝기를 비교해요",
     "prompt": "여러 번 본 값이 조금씩 달랐어요. “틀린 값이니 큰 값에 맞춰 고치자”라는 말을 어떻게 생각하나요?",
     "answer": "다른 값도 직접 본 기록이면 그대로 남겨요. 접점과 보는 위치, 전지 상태와 방법을 확인해요. 원하는 결과에 맞추어 값을 고치지는 않아요.",
     "explanation": "값이 조금씩 달라도 실제 기록은 그대로 남겨요. 접점과 보는 위치, 전지 상태와 방법을 다시 확인해요. 원하는 큰 값에 맞추면 직접 본 근거를 잃어요.",
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
      "sample": "다른 값도 직접 본 기록이면 그대로 남겨요. 접점과 보는 위치, 전지 상태와 방법을 확인해요. 원하는 결과에 맞추어 값을 고치지는 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 까닭 설명",
     "value": "다른 값을 큰 값에 맞춰도 될까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "다르게 읽은 값도 남기고 접점·위치·방법과 전지 상태를 확인해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "기록을 원하는 값으로 고치면 잃는 근거를 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 62",
    "title": "전구의 밝기 비교 · 까닭 설명",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 열로 바뀌는 현상을 배워요. 같은 전구를 오래 켜 두면 온도 조건도 달라질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
     "explanation": "전선 길이를 같게 둔 것은 다른 까닭이 섞이지 않게 한 것이에요. 길이를 바꾸어 시험한 적은 없으므로 길이가 밝기에 영향을 줄 수 없다고 할 수는 없어요.",
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
      "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 까닭 설명",
     "value": "같게 둔 길이는 영향이 없을까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "전선 길이를 같게 둔 비교는 길이를 바꾸어 시험한 것이 아니에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "이 자료만으로 길이의 영향이 없다고 할 수 없는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 63",
    "title": "전구의 밝기 비교 · 그림·설계",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 측정 기기의 분해능과 오차를 살펴요. 센서에 표시된 작은 차이가 언제나 실제 차이를 확실히 뜻하는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
     "explanation": "전구와 보는 위치, 주변 밝기와 접촉 상태를 같게 표시해요. 전지 종류와 사용 상태, 허용 규격도 적어요. 실제로 보기 전에 밝기 결과를 미리 그려 넣지는 않아요.",
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
      "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
     ],
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
      "required": [
       "전지 수 외의 조건을 맞춘다.",
       "관찰 위치와 방법을 표시한다.",
       "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
      ],
      "exactStringScoring": false
     },
     "drawingSpaceMinimumMm": 120,
     "drawingExplanationLines": 3,
     "formLabel": "그림·설계",
     "criteria": "전지 수 외의 조건을 맞춘다. / 관찰 위치와 방법을 표시한다. / 허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "전지 수 외의 조건도 확인해요. 밝기 자료를 정확한 두 배 법칙으로 일반화하거나 다른 실제 기록을 지우지 않아요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 그림·설계",
     "value": "밝기를 비교할 배치를 그려요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "전지 수 외에는 같은 전구와 위치·주변 밝기·접촉 조건을 써요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "같게 둘 조건이 두 그림에 드러나도록 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 조건으로 밝기를 비교해요 · 64",
    "title": "전구의 밝기 비교 · 그림·설계",
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
      "text": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 측정 기기의 분해능과 오차를 살펴요. 센서에 표시된 작은 차이가 언제나 실제 차이를 확실히 뜻하는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w064",
     "no": 64,
     "section": 4,
     "sectionTitle": "같은 조건으로 밝기를 비교해요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T16",
     "topic": "같은 조건으로 밝기를 비교해요",
     "prompt": "전지 한 개와 두 개를 세 번씩 비교할 빈 표를 그리세요. 제공 자료와 직접 본 결과, 같게 한 조건과 더 확인할 점을 적을 칸을 만드세요.",
     "answer": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
     "explanation": "한 전지와 두 전지, 세 번씩의 기록 칸을 만들어요. 어떤 자료인지와 접촉·위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 관찰하지 않은 숫자는 비워 두어요.",
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
      "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전구의 밝기 비교 · 그림·설계",
     "value": "한 개·두 개를 세 번씩 비교할 표"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 전구와 관찰 조건에서 전지 수에 따른 밝기를 비교해요.",
     "value": "두 조건과 세 번의 빈 칸, 자료 종류와 같은 조건을 나누어 적어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같게 둔 조건과 달리한 조건, 밝기 비교 결과를 적어요.",
     "value": "더 확인할 점을 적을 칸을 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 65",
    "title": "전자석 만들기 · 객관식",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류가 흐르는 코일 주위의 자기장을 관찰해요. 전자석의 작용은 이 자기장과 연결해 설명할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "철심에 감긴 부분은 절연을 유지하고 양 끝의 금속 접점은 선생님이 준비해요. 그래서 ②예요. 학생이 피복을 태우거나 철심을 가열하지 않고 부품 규격과 켜 두는 시간을 확인해요.",
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
     "givens": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 감긴 부분의 절연을 유지한다.",
     "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
     "given": [
      "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 객관식",
     "value": "감긴 전선의 절연을 유지해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "코일의 감긴 부분은 이웃 금속 선이 뜻하지 않게 닿지 않도록 절연을 유지해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "양 끝 접점과 감긴 전선 부분을 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 66",
    "title": "전자석 만들기 · 객관식",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류가 흐르는 코일 주위의 자기장을 관찰해요. 전자석의 작용은 이 자기장과 연결해 설명할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w066",
     "no": 66,
     "section": 5,
     "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
     "bookResponseForm": "single",
     "form": "choice",
     "type": "T09",
     "topic": "전자석을 만들어 연결 전후를 관찰해요",
     "prompt": "전지를 분리했는데 클립 한 개가 남았어요. 알맞은 설명을 고르세요.",
     "answer": "⑤ 철심에 약한 자성이 남을 수 있다.",
     "explanation": "전지를 분리해도 철심에 약한 자성이 남을 수 있으므로 ⑤예요. 클립 한 개가 남았다는 기록을 지우지 않아요. 이것만으로 전류가 계속 흐르거나 세기가 그대로라고 할 수는 없어요.",
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
        "전지를 연결했을 때",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 객관식",
     "value": "전원을 꺼도 클립이 남을까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "철심에는 전지를 분리한 뒤에도 약한 자석의 성질이 남을 수 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "클립이 남았다는 기록만으로 전류가 계속 흐른다고 할 수 있을까요?"
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 67~69",
    "title": "전자석 만들기 · 빈칸 넣기",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 나침반으로 자기장의 방향을 알아보아요. 코일 주위 여러 위치에서 나침반이 가리키는 방향을 비교해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "감긴 부분은 절연된 전선을 쓰고 두 끝은 금속 접점으로 연결해요. 그래서 절연, 끝이에요. 선 전체의 피복을 벗기는 것과 두 끝을 준비하는 것은 달라요.",
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
     "prompt": "철심은 전지 연결 (1)의 시작 상태와 전원 분리 (2)의 상태도 비교해요. 보기: 전·뒤",
     "answer": "전 / 뒤",
     "explanation": "전지 연결 전의 처음 상태와, 분리 뒤의 상태도 비교해요. 처음부터 약한 자성이 있었는지와 전류를 흘린 뒤 달라진 점을 나누어 볼 수 있어요.",
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
     "explanation": "철심의 보호용 테이프는 감을 바탕인 ㄴ, 코일의 절연은 이웃 선이 뜻하지 않게 닿지 않도록 하는 ㄷ, 양 끝 접점은 전류가 들어오고 나갈 ㄱ이에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 빈칸 넣기",
     "value": "철심·코일·두 끝을 준비해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "감긴 절연 부분과 양 끝의 금속 접점을 구별하고 연결 전후를 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "각 제작 과정이 하는 일을 짧게 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 70~72",
    "title": "전자석 만들기 · 연결하기",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 철 같은 자성체의 자화 과정을 배워요. 코일 속 철심이 있을 때와 없을 때 자기 작용이 달라질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "전지 연결 전은 처음 상태인 ㄷ, 연결한 동안은 변화인 ㄱ, 분리 뒤는 남은 작용을 보는 ㄴ이에요. 같은 방법으로 세 때를 비교하고 예상과 달라도 그대로 적어요.",
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
      "(2) 정해진 짧은 전류가 흐르는 동안",
      "(3) 전원 분리 뒤"
     ],
     "options": [
      "ㄱ 전지를 연결했을 때의 변화",
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
      "ㄱ 전지를 연결했을 때의 변화",
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
     "prompt": "문제에서 정한 “철심 보호 → 코일 감기 → 두 끝 확인 → 전지가 분리된 회로 연결” 순서로 쓰세요.",
     "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
     "explanation": "문제에서 정한 순서는 철심 보호 ㄷ → 코일 감기 ㄹ → 두 끝 확인 ㄱ → 전원이 분리된 회로 연결 ㄴ이에요. 모든 제작 방법이 꼭 이 순서 하나뿐이라는 뜻은 아니에요.",
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
     "explanation": "처음 상태를 보고, 선생님 확인 뒤 정한 시간만 켠 다음, 전지를 분리하고 비교해요. 따라서 ㄴ → ㄷ → ㄱ이에요. 같은 클립과 거리로 보아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 연결하기",
     "value": "처음·연결 중·분리 뒤의 순서"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "같은 철심과 클립을 같은 거리에서 세 시점에 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "전지를 연결하기 전 기록이 필요한 까닭을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 73",
    "title": "전자석 만들기 · 복수 선택",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 코일에 흐르는 전류의 세기와 자기장의 세기를 관련지어 살펴요. 클립 수는 힘을 직접 단위로 잰 값과는 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "감긴 부분의 절연을 유지하고 전지를 분리한 채 감으며, 준비된 양 끝을 확인해요. 그래서 ②, ④, ⑤예요. 아무 전원에나 바로 연결하지 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 복수 선택",
     "value": "전지를 분리하고 코일을 감아요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "전지를 분리한 채 코일을 감고 감긴 부분의 절연과 준비된 끝 접점을 확인해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "선생님과 확인할 부품 조건을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 74",
    "title": "전자석 만들기 · 복수 선택",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 코일에 흐르는 전류의 세기와 자기장의 세기를 관련지어 살펴요. 클립 수는 힘을 직접 단위로 잰 값과는 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "처음 0개, 전지 연결 동안 6개, 분리 뒤 1개예요. 따라서 ②, ③, ④예요. 분리 뒤의 작용이 연결 동안과 같은 것은 아니에요. 이 표는 연습용 자료예요.",
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
      "전지를 연결했을 때 가장 많이 붙었다.",
      "분리 뒤에도 한 개가 남았다.",
      "분리 뒤에도 세기는 전류가 흐르는 동안과 똑같았다."
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
        "전지를 연결했을 때",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 복수 선택",
     "value": "세 시점의 클립 수를 읽어요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "연습표의 연결 전·연결 중·분리 뒤 수는 서로 달라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "관찰 기록과 미리 예상해 쓴 결과를 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 75",
    "title": "전자석 만들기 · 자료 해석",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 코일의 감은 수와 길이도 자기장에 영향을 줌을 배워요. 감은 수만 바꾸어 보려면 다른 조건을 같게 두어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w075",
     "no": 75,
     "section": 5,
     "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
     "bookResponseForm": "data",
     "form": "short",
     "type": "T09",
     "topic": "전자석을 만들어 연결 전후를 관찰해요",
     "prompt": "표에서 (1)연결 전보다 전류가 흐르는 동안 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
     "answer": "6개 / 1개",
     "explanation": "전지 연결 동안 늘어난 수는 6−0=6개, 분리 뒤 남은 수는 1개예요. 클립 수를 센 것이지 힘을 정확한 단위로 잰 값은 아니에요.",
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
        "전지를 연결했을 때",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 자료 해석",
     "value": "늘어난 클립과 남은 클립"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "연결 전과 비교해 늘어난 수와 전원 분리 뒤 남은 수를 따로 세어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "클립 수와 힘을 정확한 단위로 잰 값이 다른 점을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 76",
    "title": "전자석 만들기 · 자료 해석",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 코일의 감은 수와 길이도 자기장에 영향을 줌을 배워요. 감은 수만 바꾸어 보려면 다른 조건을 같게 두어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w076",
     "no": 76,
     "section": 5,
     "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
     "bookResponseForm": "data",
     "form": "short",
     "type": "T09",
     "topic": "전자석을 만들어 연결 전후를 관찰해요",
     "prompt": "표에서 (1)전지 연결 전후에 붙인 클립 수가 달라진 자석 (2)전지 없이도 계속 클립을 붙인 자석을 쓰세요.",
     "answer": "전자석 / 영구 자석",
     "explanation": "전자석에 붙은 클립 수는0개에서7개로 늘고 전지를 분리한 뒤1개가 남았어요. 영구 자석은 전지 없이도 같은 시각에6개씩 붙였어요. 전자석과 영구 자석의 성질을 같은 조건에서 비교해요.",
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
         "전자석"
        ]
       },
       {
        "label": "(2)",
        "kind": "short-text",
        "accepted": [
         "영구 자석",
         "영구자석"
        ]
       }
      ]
     },
     "table": {
      "머리": [
       "자석",
       "연결 전(개)",
       "연결 중(개)",
       "분리 뒤(개)"
      ],
      "행": [
       [
        "전자석",
        0,
        7,
        1
       ],
       [
        "영구 자석",
        6,
        6,
        6
       ]
      ]
     },
     "givens": "같은 클립과 거리로 비교하는 가상 연습 자료예요. 영구 자석에는 전지를 연결하지 않고 같은 세 시각에 관찰했어요.",
     "formLabel": "자료 해석",
     "criteria": "(1) 전자석 / (2) 영구 자석 또는 영구자석. 부분별 답의 대응을 유지한다.",
     "misconception": "절연된 코일과 준비한 두 끝 접점을 구별해요. 전류를 끊어도 철심에 약한 자성이 남을 수 있어요.",
     "given": [
      "같은 클립과 거리로 비교하는 가상 연습 자료예요. 영구 자석에는 전지를 연결하지 않고 같은 세 시각에 관찰했어요."
     ],
     "parts": [
      "(1)",
      "(2)"
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-76"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 자료 해석",
     "value": "전자석과 영구 자석을 비교해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "영구 자석에는 전지를 연결하지 않고 같은 세 시각에 작용을 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "전지 연결에 따라 달라진 자석과 전지 없이도 작용한 자석을 골라요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 77",
    "title": "전자석 만들기 · 까닭 설명",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류에 의한 자기 작용과 영구 자석의 자기 작용을 비교해요. 전자석은 전원을 이용해 작용을 조절할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w077",
     "no": 77,
     "section": 5,
     "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T09",
     "topic": "전자석을 만들어 연결 전후를 관찰해요",
     "prompt": "전자석을 켠 동안만 보고 처음 철심의 상태는 보지 못했어요. 전후의 차이를 설명할 때 무엇을 알기 어려울까요?",
     "answer": "처음부터 클립이 붙었는지 몰라요. 전지 연결 전의 철심을 같은 클립과 거리에서 보고 비교해야 전후에 달라진 점을 설명할 수 있어요.",
     "explanation": "전지 연결 동안 붙었다는 기록은 남길 수 있어요. 하지만 처음 상태를 보지 않으면 처음부터 붙었는지 몰라요. 같은 클립과 거리에서 연결 전과 후를 비교해야 달라진 점을 설명할 수 있어요.",
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
      "sample": "처음부터 클립이 붙었는지 몰라요. 전지 연결 전의 철심을 같은 클립과 거리에서 보고 비교해야 전후에 달라진 점을 설명할 수 있어요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 까닭 설명",
     "value": "처음 상태를 보지 못했다면"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "연결 전 기록이 없으면 처음부터 클립이 붙었는지 알기 어려워요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "나중에 본 모습을 과거의 처음 기록으로 대신할 수 없는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 78",
    "title": "전자석 만들기 · 까닭 설명",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류에 의한 자기 작용과 영구 자석의 자기 작용을 비교해요. 전자석은 전원을 이용해 작용을 조절할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w078",
     "no": 78,
     "section": 5,
     "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T08",
     "topic": "전자석을 만들어 연결 전후를 관찰해요",
     "prompt": "“클립이 적게 붙으니 전선을 감싼 부분을 모두 벗기자”는 말이 맞을까요? 까닭을 설명하고, 선생님과 먼저 확인할 다른 조건도 쓰세요.",
     "answer": "감긴 부분의 피복을 모두 벗기면 이웃 선끼리 뜻하지 않게 닿을 수 있어요. 양 끝의 접촉과 전원, 거리와 규격을 선생님과 확인해요. 피복을 전부 벗기거나 태우지는 않아요.",
     "explanation": "클립이 적게 붙었다고 피복 전체가 문제라는 뜻은 아니에요. 끝의 접촉 상태와 전원, 거리와 규격을 선생님과 확인해요. 피복을 전부 벗기거나 태우고 전지를 마음대로 더하지 않아요.",
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
      "sample": "감긴 부분의 피복을 모두 벗기면 이웃 선끼리 뜻하지 않게 닿을 수 있어요. 양 끝의 접촉과 전원, 거리와 규격을 선생님과 확인해요. 피복을 전부 벗기거나 태우지는 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 까닭 설명",
     "value": "피복을 모두 벗기면 안 돼요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "감긴 선의 절연을 없애면 이웃 선끼리 뜻하지 않게 닿을 수 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "전원을 분리한 뒤 선생님과 확인할 다른 조건을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 79",
    "title": "전자석 만들기 · 그림·설계",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 절연이 이웃 도선 사이의 뜻하지 않은 연결을 막음을 배워요. 코일의 감긴 부분에서 전하가 옆 선으로 바로 이동하지 않게 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "철심과 감긴 절연선, 두 끝 접점을 구별해요. 전지를 분리한 상태로 연결한 뒤 선생님께 점검받는 순서를 넣어요. 모든 장치에 같은 감는 횟수나 길이를 쓰라고 정하지 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 그림·설계",
     "value": "전자석 제작 그림을 그려요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "철심·절연 코일·양 끝 접점과 스위치 회로를 구별해 그려요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "전원 분리와 점검 순서가 어디에 필요한지 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석을 만들어 연결 전후를 관찰해요 · 80",
    "title": "전자석 만들기 · 그림·설계",
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
      "text": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 절연이 이웃 도선 사이의 뜻하지 않은 연결을 막음을 배워요. 코일의 감긴 부분에서 전하가 옆 선으로 바로 이동하지 않게 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w080",
     "no": 80,
     "section": 5,
     "sectionTitle": "전자석을 만들어 연결 전후를 관찰해요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T09",
     "topic": "전자석을 만들어 연결 전후를 관찰해요",
     "prompt": "연결 전·전류가 흐르는 동안·분리 뒤 세 칸의 빈 관찰 그림판을 만드세요. 같은 클립과 거리를 표시하고 결과는 비워 두세요.",
     "answer": "세 때의 철심과 클립 위치, 같은 거리와 방법을 표시해요. 실제 결과와 보지 못한 점을 적을 칸을 두고 처음 상태와 남은 자성도 적을 곳을 만들어요.",
     "explanation": "세 칸에서 같은 철심과 클립, 거리와 방법을 표시해요. 실제 결과를 적을 칸을 비워 두고, 전지를 분리하면 반드시 모든 클립이 떨어진다고 미리 그리지는 않아요.",
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
      "sample": "세 때의 철심과 클립 위치, 같은 거리와 방법을 표시해요. 실제 결과와 보지 못한 점을 적을 칸을 두고 처음 상태와 남은 자성도 적을 곳을 만들어요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석 만들기 · 그림·설계",
     "value": "세 시점의 빈 관찰 그림판"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "철심에 절연된 전선을 감고 전지에 연결하여 전자석을 만들어요.",
     "value": "같은 클립과 거리를 쓰는 세 시점을 나누고 결과 칸은 비워 두어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전지 연결 전·연결 중·분리 뒤의 클립 모습을 비교해요.",
     "value": "예상을 실제로 본 모습처럼 미리 채우지 않아요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 81~82",
    "title": "전자석의 성질과 쓰임 · 객관식",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 코일의 전류 방향이 바뀌면 자기장 방향도 바뀜을 관찰해요. 전지 연결 방향과 전자석의 극 변화를 연결할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w081",
     "no": 81,
     "section": 6,
     "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
     "bookResponseForm": "single",
     "form": "choice",
     "type": "T10",
     "topic": "전자석의 세기·극·쓰임을 비교해요",
     "prompt": "전지 수에 따른 전자석의 세기를 비교해요. 전지 수 외에 같게 할 조건을 고르세요.",
     "answer": "③ 클립의 접근 거리와 전류가 흐르는 시간",
     "explanation": "거리가 같고 전류가 흐르는 시간도 같은 ③이 알맞아요. 철심과 코일, 클립도 같게 해야 전지 수에 따른 차이를 비교할 수 있어요.",
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
      "클립의 접근 거리와 전류가 흐르는 시간",
      "한쪽만 더 가까이 대는 방법",
      "조건마다 다른 종류의 클립"
     ],
     "key": 2,
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
     },
     "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ③ 클립의 접근 거리와 전류가 흐르는 시간",
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "given": [
      "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다."
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
     "explanation": "나침반의 N극과 밀어내므로 그 전자석 끝도 N극이에요. 같은 극끼리 밀어내는 성질로 판단해요. 전지의 +·−극과 자석의 N·S극은 구별해요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요."
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 객관식",
     "value": "전자석 세기 비교와 극의 판단"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "전지 수 외의 조건은 같게 하며, 같은 극끼리는 밀어내는 성질로 극을 판단해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "전지의 +·−극과 자석의 N·S극을 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 83~85",
    "title": "전자석의 성질과 쓰임 · 빈칸 넣기",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 자기장 안에서 전류가 흐르는 코일이 힘을 받음을 배워요. 이 작용을 전동기의 회전에 이용해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w083",
     "no": 83,
     "section": 6,
     "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
     "bookResponseForm": "blank",
     "form": "short",
     "type": "T11",
     "topic": "전자석의 세기·극·쓰임을 비교해요",
     "prompt": "같은 코일에서 전지의 연결 (1)을 반대로 바꾸면 전자석의 (2)이 바뀔 수 있어요. 보기: 방향·극",
     "answer": "방향 / 극",
     "explanation": "코일과 철심은 그대로 두고 전지의 연결 방향을 반대로 바꾸면 전자석의 극이 바뀌어요. 같은 끝에서 나침반의 반응을 비교해 확인해요.",
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
     "criteria": "(1) 방향 / (2) 극 또는 자석 극. 부분별 답의 대응을 유지한다.",
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
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
     "prompt": "철 조각을 잡고 놓는 전자석 장치는 전원을 (1) 때와 (2) 때의 작용 차이를 이용해요. 보기: 켤·끌",
     "answer": "켤 / 끌",
     "explanation": "전원을 켜고 끄면 전자석의 작용을 바꿀 수 있어요. 이 성질을 철 조각을 잡아 옮긴 뒤 놓는 장치에 이용해요.",
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
         "켤"
        ]
       },
       {
        "label": "(2)",
        "kind": "short-text",
        "accepted": [
         "끌"
        ]
       }
      ]
     },
     "formLabel": "빈칸 넣기",
     "criteria": "(1) 켤 / (2) 끌. 부분별 답의 대응을 유지한다.",
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
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
     "prompt": "나침반의 N극과 보인 반응을 보고 전자석 끝의 극을 연결하세요.",
     "answer": "ㄷ / ㄱ / ㄴ",
     "explanation": "나침반 N극을 밀어낸 (1)은 같은 N극인 ㄷ이에요. 끌어당긴 (2)는 다른 S극인 ㄱ이에요. 반응이 뚜렷하지 않은 (3)은 ㄴ처럼 더 확인해요.",
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
      "ㄴ 아직 극을 정하지 않고 조건을 다시 확인",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "given": [
      "ㄱ S극으로 판단",
      "ㄴ 아직 극을 정하지 않고 조건을 다시 확인",
      "ㄷ N극으로 판단"
     ],
     "answerPerPart": true
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 빈칸 넣기",
     "value": "연결 방향·작용·극을 연결해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "같은 전자석에서 전지 방향을 바꾸면 극이 달라질 수 있고 전원으로 작용을 조절해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "확인된 나침반 N극과 끌림·밀림을 연결해 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 86~88",
    "title": "전자석의 성질과 쓰임 · 연결하기",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 자석과 코일의 상대 운동으로 전류가 생기는 전자기 유도를 배워요. 전류로 자기 작용을 만드는 현상과 비교해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "철 조각을 옮기는 것은 ㄷ, 소리로 알리는 것은 ㄱ, 게시물을 붙이는 것은 ㄴ이에요. 겉모습만 보고 용도를 같게 묶지 말고 자료에 제시한 구조를 읽어요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
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
     "prompt": "“전지 분리 → 전지 방향 바꾸고 점검 → 같은 끝 관찰” 순서로 기호를 쓰세요.",
     "answer": "ㄴ → ㄷ → ㄱ",
     "explanation": "스위치를 열고 전지를 분리한 뒤, 같은 코일에서 전지 방향만 바꾸어 점검받아요. 같은 끝과 나침반을 비교하므로 ㄴ → ㄷ → ㄱ이에요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
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
     "prompt": "“구조를 알 수 있는 자료 찾기 → 하는 일 확인 → 쓰임 설명” 순서로 쓰세요.",
     "answer": "ㄴ → ㄷ → ㄱ",
     "explanation": "설명 자료에서 코일과 움직이는 부분을 찾아요. 어떤 작용이 생기는지 보고 용도를 설명하므로 ㄴ → ㄷ → ㄱ이에요. 겉사진만 보고 내부를 지어내지 않아요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "given": [
      "ㄱ 확인한 작용을 기기의 용도와 연결한다.",
      "ㄴ 설명 자료에서 코일과 움직이는 부분을 찾는다.",
      "ㄷ 전류 제어로 어떤 작용이 생기는지 확인한다."
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 연결하기",
     "value": "구조에서 전자석의 쓰임까지"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "설명 자료의 코일과 움직이는 부분을 찾아 어떤 작용을 조절하는지 살펴요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "전원 분리 뒤 방향을 바꾸어 점검하는 순서를 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 89",
    "title": "전자석의 성질과 쓰임 · 복수 선택",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 릴레이가 작은 전기 신호로 다른 회로의 스위치를 움직이는 원리를 배워요. 전자석이 접점을 당기는 작용을 이용해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "두 전지 쪽은 8>4, 9>5, 8>4로 매번 많이 들었어요. 하지만 둘째 9는 5의 두 배가 아니에요. 같은 철심과 코일, 거리와 시간도 확인하므로 ①, ③, ⑤예요.",
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
     "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
     "formLabel": "복수 선택",
     "criteria": "정답 3개를 빠짐·추가·중복 없이 고른다: ①, ③, ⑤. 선택한 순서는 관계없다.",
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "given": [
      "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
     ],
     "figure": "electricity-question-data-89"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 복수 선택",
     "value": "클립 수가 매번 두 배일까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "이 조건에서 두 전지 쪽은 매번 많지만 정확히 두 배가 아닌 반복도 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "같은 철심·코일·거리·시간의 조건을 함께 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 90",
    "title": "전자석의 성질과 쓰임 · 복수 선택",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 릴레이가 작은 전기 신호로 다른 회로의 스위치를 움직이는 원리를 배워요. 전자석이 접점을 당기는 작용을 이용해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "모르는 점을 표시하고, 자료 출처를 남기며, 코일과 움직이는 부분의 근거를 찾아요. 그래서 ②, ③, ⑤예요. 색만으로 극을 정하거나 기구를 분해하지 않아요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요."
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 복수 선택",
     "value": "기기 구조의 근거를 찾아요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "사진 색만으로 극이나 구조를 정하지 않고 출처가 있는 설명 자료를 읽어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "알아낸 구조와 아직 모르는 부분을 나누어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 91",
    "title": "전자석의 성질과 쓰임 · 자료 해석",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 스피커의 코일과 자석이 진동을 만드는 원리를 살펴요. 전자석을 이용한다고 모두 철 조각을 들어 올리는 장치인 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "세 번 모두 두 전지 쪽이 많으므로 3회예요. 둘째의 9는 5의 두 배가 아니고 나머지 두 번은 두 배이므로 정확히 두 배가 아닌 것은 1회예요.",
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
     "givens": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
     "verificationModel": {
      "kind": "strength-repeat-counts",
      "model": "strength"
     },
     "formLabel": "자료 해석",
     "criteria": "(1) 3회 (단위 필요) / (2) 1회 (단위 필요). 부분별 대응을 유지한다. 타당한 다른 표현은 교사가 근거로 확인한다.",
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "given": [
      "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다."
     ],
     "parts": [
      "(1) · 단위도 써요.",
      "(2) · 단위도 써요."
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-91"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 자료 해석",
     "value": "반복 횟수와 두 배의 여부"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "더 많이 붙은 횟수와 정확히 두 배가 아닌 횟수를 따로 세어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "세 번의 두 조건을 하나씩 짝지어 비교해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 92",
    "title": "전자석의 성질과 쓰임 · 자료 해석",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 스피커의 코일과 자석이 진동을 만드는 원리를 살펴요. 전자석을 이용한다고 모두 철 조각을 들어 올리는 장치인 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "처음에는 나침반 N극과 밀어내므로 왼쪽 끝은 N극이에요. 반대로 연결한 뒤 N극을 끌어당기므로 같은 끝은 S극이에요. 전지 수를 바꾼 것과 구별해요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "given": [
      "같은 코일에서 전원을 분리한 뒤 전지 방향만 반대로 바꾼 연습 기록이다. 주변 자석을 멀리 두고 같은 위치의 반응을 비교했다."
     ],
     "parts": [
      "(1)",
      "(2)"
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-92"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 자료 해석",
     "value": "전지 방향을 바꾼 뒤 같은 끝의 극"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "같은 위치의 나침반 N극과 반응이 달라지면 전자석 극의 변화를 판단할 수 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "처음과 반대 연결 뒤의 왼쪽 끝을 순서대로 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 93",
    "title": "전자석의 성질과 쓰임 · 까닭 설명",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 자기장이 위치에 따라 달라짐을 살펴요. 철심에서 떨어진 거리도 클립을 끌어당기는 힘에 영향을 줘요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w093",
     "no": 93,
     "section": 6,
     "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T10",
     "topic": "전자석의 세기·극·쓰임을 비교해요",
     "prompt": "클립을 더 가까이 대니 많이 붙었어요. 이것만으로 전자석 자체가 더 세졌다고 할 수 있을까요?",
     "answer": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
     "explanation": "클립이 더 많이 붙은 것은 남겨요. 하지만 가까이 댄 거리도 달라졌으므로 전자석 자체가 더 세졌다고만 할 수는 없어요. 같은 클립과 거리, 방법과 시간에서 다시 비교해요.",
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
      "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
      "required": [
       "접근 거리 차이를 근거로 든다.",
       "자석 자체 변화와 관찰 방법 효과를 구별한다.",
       "공정한 비교 조건을 제안한다."
      ],
      "exactStringScoring": false
     },
     "formLabel": "까닭 설명",
     "criteria": "접근 거리 차이를 근거로 든다. / 자석 자체 변화와 관찰 방법 효과를 구별한다. / 공정한 비교 조건을 제안한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 까닭 설명",
     "value": "거리를 바꿨는데 더 세졌을까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "클립을 대는 거리도 달라졌다면 전자석 자체의 변화 때문이라고만 할 수 없어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "달라진 관찰 방법을 근거로 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 94",
    "title": "전자석의 성질과 쓰임 · 까닭 설명",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 자기장이 위치에 따라 달라짐을 살펴요. 철심에서 떨어진 거리도 클립을 끌어당기는 힘에 영향을 줘요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "철 조각을 옮기는 장치는 잡았다가 놓을 수 있어야 해요. 전자석은 전원을 켜고 끄며 작용을 조절할 수 있어요. 자료의 게시판은 전지 없이도 작용하는 영구 자석을 써요.",
     "explanation": "철 조각을 옮기는 장치는 잡았다가 놓는 작용을 조절해야 해요. 전자석은 전원을 켜고 끄는 성질을 쓸 수 있어요. 자료의 게시판은 전지 없이 작용하는 영구 자석이라는 점과 비교해요.",
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
      "sample": "철 조각을 옮기는 장치는 잡았다가 놓을 수 있어야 해요. 전자석은 전원을 켜고 끄며 작용을 조절할 수 있어요. 자료의 게시판은 전지 없이도 작용하는 영구 자석을 써요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "given": [
      "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다."
     ],
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 까닭 설명",
     "value": "철을 잡고 놓는 작용의 조절"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "운반 장치는 전원을 켜고 끄며 잡고 놓는 작용이 필요하고 게시판은 영구 자석을 써요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "두 구조의 쓰임과 작용 조절의 필요를 비교해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 95",
    "title": "전자석의 성질과 쓰임 · 그림·설계",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 같은 극의 밀어내는 힘과 다른 극의 끌어당기는 힘을 자기장과 연결해요. 나침반도 작은 자석이라 주위 자기장의 영향을 받아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w095",
     "no": 95,
     "section": 6,
     "sectionTitle": "전자석의 세기·극·쓰임을 비교해요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T10",
     "topic": "전자석의 세기·극·쓰임을 비교해요",
     "prompt": "전지 수에 따라 붙는 클립 수를 비교할 그림을 그리세요. 바꿀 전지 수와 같게 할 거리·철심·코일·시간을 표시하고 결과는 비워 두세요.",
     "answer": "허용한 전지 한 개와 두 개만 바꾸어요. 같은 철심과 코일, 클립과 거리, 방법과 시간은 같게 해요. 전원 분리와 선생님 점검, 반복해서 적을 빈 표도 넣어요.",
     "explanation": "허용한 전지 한 개와 두 개만 바꾸고 철심과 코일, 클립과 거리, 방법과 시간은 같게 해요. 전원을 분리하고 점검받는 순서와 빈 기록 칸도 표시해요.",
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
      "sample": "허용한 전지 한 개와 두 개만 바꾸어요. 같은 철심과 코일, 클립과 거리, 방법과 시간은 같게 해요. 전원 분리와 선생님 점검, 반복해서 적을 빈 표도 넣어요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 그림·설계",
     "value": "전지 수와 클립을 비교할 그림"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "전지 수만 바꾸고 철심·코일·거리·시간은 같게 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "비교 결과는 비워 두고 같은 조건에 이름표를 붙여요."
    }
   ]
  },
  {
   "previous": {
    "section": "전자석의 세기·극·쓰임을 비교해요 · 96",
    "title": "전자석의 성질과 쓰임 · 그림·설계",
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
      "text": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 같은 극의 밀어내는 힘과 다른 극의 끌어당기는 힘을 자기장과 연결해요. 나침반도 작은 자석이라 주위 자기장의 영향을 받아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "같은 끝과 나침반 N극을 비교할 두 모습을 나타내요. 끌림과 밀림, 뚜렷하지 않음을 적을 칸을 나누고, 뚜렷하지 않은 반응으로 극을 억지로 정하지 않아요.",
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
     "misconception": "클립 수는 거리·철심·전류가 흐르는 시간에도 영향을 받아요. 전선 색으로 극을 정하지 않고 같은 나침반 끝의 반응을 비교해요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전자석의 성질과 쓰임 · 그림·설계",
     "value": "같은 끝과 나침반을 비교할 표"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전지 수에 따른 세기와 연결 방향에 따른 극의 변화를 비교해요.",
     "value": "같은 끝의 반응을 확인된 N극과 비교하고 전지 방향 변경 전후를 나누어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "전자석의 어떤 성질을 생활 속 장치에 이용하는지 설명해요.",
     "value": "전원 분리와 관찰 칸을 어디에 둘지 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "함께 생각하기 7",
    "title": "안전한 전기 사용 · 함께 풀기",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 저항이 작은 길로 큰 전류가 흐를 수 있음을 배워요. 전지 양극을 전선만으로 이으면 전선과 전지가 뜨거워질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "worked",
    "layout": "electricity-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "중학교에서는 저항이 작은 길로 큰 전류가 흐를 수 있음을 배워요. 전지 양극을 전선만으로 이으면 전선과 전지가 뜨거워질 수 있어요.",
     "value": "중학교에서는 저항이 작은 길로 큰 전류가 흐를 수 있음을 배워요. 전지의 +극과 −극을 전선만으로 이으면 전선과 전지가 뜨거워질 수 있어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 97",
    "title": "안전한 전기 사용 · 객관식",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류에 의한 열 발생을 에너지 전환으로 설명해요. 전선과 부품에도 에너지가 전달되어 뜨거워질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "손상이나 이상한 냄새가 있으면 쓰지 않고 어른에게 알려요. 그래서 ④예요. 직접 만지거나 다시 켜서 시험하지 않고, 테이프만 붙이면 모두 안전하다고 하지는 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 객관식",
     "value": "손상과 냄새는 어른에게 알려요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "손상된 기구를 직접 만지거나 다시 켜서 시험하지 않고 사용을 멈춰 알려요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "학생이 살펴 알릴 일과 어른이 점검할 일을 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 98~99",
    "title": "안전한 전기 사용 · 객관식",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류에 의한 열 발생을 에너지 전환으로 설명해요. 전선과 부품에도 에너지가 전달되어 뜨거워질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "연결을 바꾸기 전에는 전원을 분리하고 점검받는 ②가 맞아요. 전지 두 극을 전선만으로 직접 잇거나 전지를 더하고 피복을 훼손하는 것은 고치는 방법이 아니에요.",
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
      "규격을 모르니 전지를 계속 더한다.",
      "손상된 피복을 칼로 더 넓게 벗긴다."
     ],
     "key": 1,
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
     },
     "givens": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
     "formLabel": "객관식",
     "criteria": "제시 조건과 관찰 범위에 맞는 선택지 한 개를 고른다: ② 전원을 분리한 뒤 점검받는다.",
     "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
     "given": [
      "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
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
     "explanation": "정상 플러그는 전선을 당기지 않고 몸체를 잡아요. 손상이나 열이 보이면 직접 확인하려 하지 말고 어른에게 알려요. 콘센트 안쪽을 만지지 않아요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 객관식",
     "value": "연결 변경과 플러그 분리"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "수업 회로는 전원을 분리한 뒤 점검받고, 정상 플러그는 마른 손으로 몸체를 잡아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "손상된 기구에 직접 손대지 않는 대응과 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 100~101",
    "title": "안전한 전기 사용 · 빈칸 넣기",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 저항이 작은 길로 큰 전류가 흐를 수 있음을 배워요. 전지 양극을 전선만으로 이으면 전선과 전지가 뜨거워질 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "기구에 맞는 전지 크기와 종류, +·− 방향을 확인해요. 새것과 헌것, 서로 다른 종류를 섞지 않아요. 그래서 크기, 섞지예요.",
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
     "explanation": "정상 플러그를 빼는 (1)은 마른 손으로 몸체를 잡는 ㄷ이에요. 손상된 (2)는 쓰지 않고 알리는 ㄱ, 수업 회로를 바꾸는 (3)은 전원을 분리하고 점검받는 ㄴ이에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 빈칸 넣기",
     "value": "지정 전지와 사용 전 점검"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "지정한 전지 크기·종류를 확인하고 새것과 헌것을 섞지 않아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "상황별로 학생이 할 일과 알릴 일을 적어요."
    },
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "중학교에서는 저항이 작은 길로 큰 전류가 흐를 수 있음을 배워요. 전지 양극을 전선만으로 이으면 전선과 전지가 뜨거워질 수 있어요.",
     "value": "중학교에서는 저항이 작은 길로 큰 전류가 흐를 수 있음을 배워요. 전지의 +극과 −극을 전선만으로 이으면 전선과 전지가 뜨거워질 수 있어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 102~104",
    "title": "안전한 전기 사용 · 연결하기",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 퓨즈가 큰 전류에 의해 녹아 회로를 끊는 원리를 배워요. 퓨즈를 철사로 대신하면 보호 기능을 잃을 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w102",
     "no": 102,
     "section": 7,
     "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
     "bookResponseForm": "match",
     "form": "short",
     "type": "T13",
     "topic": "전기를 안전하게 사용하는 근거를 찾아요",
     "prompt": "각 자료에서 무엇을 확인할 수 있는지 연결하세요.",
     "answer": "ㄷ / ㄱ / ㄴ",
     "explanation": "설명서는 전지 크기와 종류인 ㄷ, 겉을 보는 점검은 이상 징후인 ㄱ, 수업 안내는 허용 부품과 연결 방법인 ㄴ을 확인해요. 내부를 분해하여 살피는 과제는 아니에요.",
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
      "ㄱ 손상되거나 이상해 보이는 점",
      "ㄴ 허용 부품과 전지를 연결하는 방법",
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
      "ㄱ 손상되거나 이상해 보이는 점",
      "ㄴ 허용 부품과 전지를 연결하는 방법",
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
     "prompt": "“사용 멈추기 → 어른에게 알리기 → 점검 전 다시 켜지 않기” 순서로 쓰세요.",
     "answer": "ㄴ → ㄱ → ㄷ",
     "explanation": "이상한 기구의 사용을 멈추고, 어른에게 알리고, 점검 전에는 다시 켜지 않으므로 ㄴ → ㄱ → ㄷ이에요. 위험한 까닭을 직접 시험하려 하지 않아요.",
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
     "explanation": "허용한 부품을 확인하고, 전원이 분리된 회로에 잇고, 선생님께 점검받으므로 ㄷ → ㄱ → ㄴ이에요. 잠깐 켜졌다고 규격 확인을 생략하지 않아요.",
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
      "ㄴ 교사에게 접속·규격을 점검받는다.",
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
      "ㄴ 교사에게 접속·규격을 점검받는다.",
      "ㄷ 설명서와 교사가 허용한 부품을 확인한다."
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 연결하기",
     "value": "설명서와 선생님 점검의 역할"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "지정 부품과 전원을 확인하고 연결을 고친 뒤 전류가 흐르기 전에 점검받아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "이상이 생기면 다시 켜서 시험하지 않는 순서를 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 105~106",
    "title": "안전한 전기 사용 · 복수 선택",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전류의 세기가 전압과 저항에 따라 달라짐을 배워요. 젖은 상태에서는 전기가 통하는 조건이 달라져 위험할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "지정한 크기와 종류, +·− 방향을 확인하고 금속 물체가 전지 두 극을 직접 잇지 않게 해요. 그래서 ①, ②, ④예요. 새것과 헌것을 섞거나 불에 버리지 않아요.",
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
     "explanation": "콘센트에 금속을 넣는 ②, 차단기를 마음대로 조작하는 ③, 기구를 분해하는 ⑤는 학생이 할 점검이 아니에요. 겉의 이상은 어른에게 알리고 사용 조건은 설명서로 확인해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 복수 선택",
     "value": "전지 관리와 점검 범위"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "+·− 방향과 지정 전지를 확인하고, 전지 두 극을 금속 물체로 직접 잇지 않게 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "콘센트·차단기·기구 내부는 학생이 시험할 곳이 아니에요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 107",
    "title": "안전한 전기 사용 · 자료 해석",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 접지가 기구의 금속 부분과 땅을 연결하는 안전 장치임을 배워요. 손상된 기구를 계속 써도 된다는 뜻은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "손상된 ㄱ과 타는 냄새가 나는 ㄷ은 2개예요. 정상 분리와 규격 확인인 ㄴ, ㄹ도 2개예요. 카드를 분류한 것과 실제 기구를 점검한 것은 달라요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 자료 해석",
     "value": "알려야 할 징후 카드를 세어요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "손상과 타는 냄새의 카드, 정상 분리와 규격 확인의 카드를 나누어 읽어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "카드 분류와 실제 기구를 점검한 기록을 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 108",
    "title": "안전한 전기 사용 · 자료 해석",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 접지가 기구의 금속 부분과 땅을 연결하는 안전 장치임을 배워요. 손상된 기구를 계속 써도 된다는 뜻은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w108",
     "no": 108,
     "section": 7,
     "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
     "bookResponseForm": "data",
     "form": "short",
     "type": "T13",
     "topic": "전기를 안전하게 사용하는 근거를 찾아요",
     "prompt": "점검표에서 (1) 확인한 항목은 몇 개인가요? (2) 아직 확인하지 않은 항목은 몇 개인가요? 단위도 써 주세요.",
     "answer": "2개 / 2개",
     "explanation": "앞의 두 항목은 확인했고 뒤의 두 항목은 아직 확인하지 않았으므로 2개, 2개예요. 모르는 항목을 문제없음이나 0초로 채우지 않아요.",
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
        "전류가 흐르는 시간",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 자료 해석",
     "value": "확인한 항목과 아직 모르는 항목"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "확인하지 않은 조건을 문제없음이나 0초로 채우지 않아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "각 상태의 항목 수를 단위와 함께 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 109",
    "title": "안전한 전기 사용 · 까닭 설명",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전지 안의 반응으로 전기 에너지를 얻는 과정을 배워요. 충전용과 일회용 전지는 사용·충전 조건이 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w109",
     "no": 109,
     "section": 7,
     "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T13",
     "topic": "전기를 안전하게 사용하는 근거를 찾아요",
     "prompt": "“한 번 불이 켜졌으니 부품의 규격은 확인하지 않아도 돼”라는 말이 맞을까요? 까닭과 안전하게 쓰기 전에 확인할 것을 쓰세요.",
     "answer": "한 번 켜졌다고 규격과 안전까지 확인된 것은 아니에요. 설명서와 선생님 점검으로 허용 전지 수와 부품, 켜 두는 시간을 확인한 뒤 써야 해요.",
     "explanation": "켜졌다고 모든 부품의 규격과 안전까지 확인된 것은 아니에요. 설명서와 선생님 점검으로 허용 전지 수와 부품, 켜 두는 시간을 확인해요. 위험한 조건을 직접 시험하지 않아요.",
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
      "규격과 전류가 흐르는 시간을 확인한다.",
      "지정 자료·교사 점검의 역할을 설명한다."
     ],
     "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "한 번 켜졌다고 규격과 안전까지 확인된 것은 아니에요. 설명서와 선생님 점검으로 허용 전지 수와 부품, 켜 두는 시간을 확인한 뒤 써야 해요.",
      "required": [
       "켜짐과 허용 조건을 구별한다.",
       "규격과 전류가 흐르는 시간을 확인한다.",
       "지정 자료·교사 점검의 역할을 설명한다."
      ],
      "exactStringScoring": false
     },
     "formLabel": "까닭 설명",
     "criteria": "켜짐과 허용 조건을 구별한다. / 규격과 전류가 흐르는 시간을 확인한다. / 지정 자료·교사 점검의 역할을 설명한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 까닭 설명",
     "value": "한 번 켜지면 규격 확인은 끝일까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "한 번 켜졌다는 것과 부품의 허용 규격·사용 시간이 확인됐다는 것은 달라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "설명서와 선생님께 더 확인할 것을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 110",
    "title": "안전한 전기 사용 · 까닭 설명",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 전지 안의 반응으로 전기 에너지를 얻는 과정을 배워요. 충전용과 일회용 전지는 사용·충전 조건이 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w110",
     "no": 110,
     "section": 7,
     "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T13",
     "topic": "전기를 안전하게 사용하는 근거를 찾아요",
     "prompt": "다음은 겉부분이 손상된 전선 사진이에요. “테이프를 붙이면 모두 해결된다”는 말에 어떤 안내를 해야 할까요?",
     "answer": "사진만으로 속까지 얼마나 손상되었는지 알 수 없어요. 학생은 쓰지 않고 어른에게 알려 점검받아요. 테이프만 붙이면 언제나 안전하다고 하지는 않아요.",
     "explanation": "테이프로 겉을 덮어도 내부 손상까지 고쳐졌는지는 몰라요. 쓰지 않고 어른에게 알려 점검받아요. 학생이 손상 기구를 만지거나 다시 켜 보지는 않아요.",
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
      "sample": "사진만으로 속까지 얼마나 손상되었는지 알 수 없어요. 학생은 쓰지 않고 어른에게 알려 점검받아요. 테이프만 붙이면 언제나 안전하다고 하지는 않아요.",
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
     "lines": 6,
     "figure": "electricityDamagedCord"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 까닭 설명",
     "value": "테이프로 덮으면 모두 고쳐질까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "겉을 덮어도 내부 손상과 안전까지 확인된 것은 아니에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "손상된 전선에 대한 사용 중단과 어른 점검 안내를 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 111",
    "title": "안전한 전기 사용 · 그림·설계",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 여러 부품에서 빛·열·운동으로 바뀜을 배워요. 부품 규격은 이런 에너지 전환을 안전하게 이용하도록 정해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w111",
     "no": 111,
     "section": 7,
     "sectionTitle": "전기를 안전하게 사용하는 근거를 찾아요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T13",
     "topic": "전기를 안전하게 사용하는 근거를 찾아요",
     "prompt": "사용 전에 살펴볼 일을 글과 그림으로 나타내세요. 학생이 보고 알릴 일과 어른이 점검할 일을 두 구역으로 나누어요.",
     "answer": "학생이 살필 겉의 손상과 사용 여부, 설명서 읽기를 한 구역에 적어요. 규격과 내부 이상, 시설 점검은 어른 구역에 두어요. 위험한 기구는 만지지 않고 알리는 길을 표시해요.",
     "explanation": "학생이 겉의 이상을 찾아 알릴 일과 어른이 점검할 일을 나누어요. 누구에게 무엇을 알려야 할지 표시하고, 아직 점검하지 못한 곳은 확인 필요로 남겨요.",
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
      "sample": "학생이 살필 겉의 손상과 사용 여부, 설명서 읽기를 한 구역에 적어요. 규격과 내부 이상, 시설 점검은 어른 구역에 두어요. 위험한 기구는 만지지 않고 알리는 길을 표시해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 그림·설계",
     "value": "학생과 어른의 점검을 나누어요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "학생은 겉의 이상을 보고 알리고 어른은 시설과 필요한 내부 점검을 맡아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "위험한 기구를 만져 시험하지 않는 알림 경로를 그려요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 안전하게 사용하는 근거를 찾아요 · 112",
    "title": "안전한 전기 사용 · 그림·설계",
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
      "text": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 여러 부품에서 빛·열·운동으로 바뀜을 배워요. 부품 규격은 이런 에너지 전환을 안전하게 이용하도록 정해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "answer": "첫 칸에 스위치를 열고 전지를 분리한 모습을 그려요. 둘째 칸에는 고친 연결과 규격을 선생님께 점검받고 정한 시간만 잠깐 관찰하는 순서를 넣어요.",
     "explanation": "스위치를 열고 전지를 분리하는 때와, 연결을 고친 뒤 점검받는 때를 나누어 그려요. 그림을 만든 것과 실제 점검을 마친 것도 구별해요.",
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
      "점검을 전류가 흐르기 전에 둔다.",
      "단락·임의 전지 증가·피복 훼손을 해결책으로 넣지 않는다."
     ],
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "첫 칸에 스위치를 열고 전지를 분리한 모습을 그려요. 둘째 칸에는 고친 연결과 규격을 선생님께 점검받고 정한 시간만 잠깐 관찰하는 순서를 넣어요.",
      "required": [
       "전원 분리를 변경 전에 둔다.",
       "점검을 전류가 흐르기 전에 둔다.",
       "단락·임의 전지 증가·피복 훼손을 해결책으로 넣지 않는다."
      ],
      "exactStringScoring": false
     },
     "drawingSpaceMinimumMm": 120,
     "drawingExplanationLines": 3,
     "formLabel": "그림·설계",
     "criteria": "전원 분리를 변경 전에 둔다. / 점검을 전류가 흐르기 전에 둔다. / 단락·임의 전지 증가·피복 훼손을 해결책으로 넣지 않는다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "마른 손이나 피복 하나가 모든 상황의 안전을 보장하지 않아요. 손상·열·냄새가 있는 기구를 학생이 시험하지 않아요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "안전한 전기 사용 · 그림·설계",
     "value": "연결 변경 전과 뒤의 안내"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "전기 기구의 알맞은 규격과 사용 방법을 지키고 손상된 기구는 쓰지 않아요.",
     "value": "전원 분리는 변경 전에, 선생님 점검은 전류가 흐르기 전에 필요해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안전하게 사용하기 위해 살필 점과 어른에게 알릴 점을 적어요.",
     "value": "두 칸에 분리와 점검 순서를 표시해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 113~114",
    "title": "전기 절약과 실천 · 객관식",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 빛·열·운동 등으로 바뀜을 배워요. 같은 기능을 얻는 데 필요한 에너지의 양을 비교할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
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
     "explanation": "빈 교실의 필요 없는 조명을 끄는 ⑤가 알맞아요. 전기를 아껴도 식품 보관과 필요한 환기, 밝기와 안전은 유지해야 해요.",
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
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "같은 밝기를 내는 두 조명의 연습 자료예요. 전기를 효율적으로 사용하는 선택을 고르세요.",
     "answer": "③ 같은 밝기와 시간에서 전기 사용량이 적은B를 고른다.",
     "explanation": "같은 밝기와 사용 시간에서B는A보다 전기 에너지를 적게 사용해요. 필요한 기능을 유지하면서 전기를 덜 쓰는 선택이에요. 필요 없는 조명은 꺼서 사용 시간을 줄일 수 있어요.",
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
      "같은 밝기여도 전기 사용량이 큰A를 고른다.",
      "사용 시간이 다르더라도 사용량만 비교한다.",
      "같은 밝기와 시간에서 전기 사용량이 적은B를 고른다.",
      "사용량이 적은 조명은 필요 없어도 계속 켜 둔다.",
      "교실에 사람이 없어도 모든 조명을 켜 둔다."
     ],
     "key": 2,
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
     },
     "formLabel": "객관식",
     "criteria": "조건에 맞는 보기 한 개를 고른다: ③ 같은 밝기와 시간에서 전기 사용량이 적은B를 고른다.",
     "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
     "table": {
      "머리": [
       "조명",
       "같은 밝기로3시간 사용한 전기 에너지(Wh)"
      ],
      "행": [
       [
        "A",
        24
       ],
       [
        "B",
        12
       ]
      ]
     },
     "givens": "비교 방법을 익히는 가상 자료예요. Wh는 사용한 전기 에너지를 나타내는 단위예요.",
     "given": [
      "비교 방법을 익히는 가상 자료예요. Wh는 사용한 전기 에너지를 나타내는 단위예요."
     ],
     "figure": "electricity-question-data-114"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 객관식",
     "value": "같은 기능을 유지하며 낭비를 줄여요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "필요 없는 조명은 끄고 같은 밝기·시간에서는 전기 사용량이 적은 제품을 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "필요한 밝기·환기·식품 보관을 유지할 조건을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 115~117",
    "title": "전기 절약과 실천 · 빈칸 넣기",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 유용하게 이용한 에너지의 비율로 효율을 나타내요. 같은 밝기를 내면서 전기를 덜 쓰는 조명이 효율적인 예예요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w115",
     "no": 115,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "blank",
     "form": "short",
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "같은 (1)를 내는 조명끼리 전기 사용량을 비교하고, 사람이 없는 교실의 불필요한 조명을 (2). 보기: 밝기·끈다",
     "answer": "밝기 / 끈다",
     "explanation": "조명의 밝기라는 기능을 같게 두고 전기 사용량을 비교해요. 사람이 없는 교실에서는 필요 없는 조명을 꺼서 낭비를 줄여요.",
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
         "밝기"
        ]
       },
       {
        "label": "(2)",
        "kind": "short-text",
        "accepted": [
         "끈다",
         "꺼요"
        ]
       }
      ]
     },
     "formLabel": "빈칸 넣기",
     "criteria": "(1) 밝기 / (2) 끈다 또는 꺼요. 부분별 답의 대응을 유지한다.",
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
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "전기를 아끼더라도 필요한 (1)과 안전을 유지해야 하며, 전기 기구의 사용 방법은 제품의 (2)를 확인해요. 보기: 기능·설명서",
     "answer": "기능 / 설명서",
     "explanation": "전기를 덜 쓰는 일과 필요한 기능을 없애는 일은 달라요. 필요한 조명·환기·식품 보관 등의 기능과 안전을 유지하고 제품 설명서에 맞게 사용해요.",
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
         "기능"
        ]
       },
       {
        "label": "(2)",
        "kind": "short-text",
        "accepted": [
         "설명서",
         "사용 설명서",
         "사용설명서"
        ]
       }
      ]
     },
     "formLabel": "빈칸 넣기",
     "criteria": "(1) 기능 / (2) 설명서 또는 사용 설명서 또는 사용설명서. 부분별 답의 대응을 유지한다.",
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
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "전기를 효율적으로 사용하는 방법을 알맞은 상황과 연결하세요.",
     "answer": "ㄷ / ㄱ / ㄴ",
     "explanation": "같은 밝기의 조명은 전기 사용량을 비교해 고르고, 냉난방은 필요한 환기를 유지하면서 낭비를 줄여요. 사람이 없는 교실에서는 필요 없는 조명을 꺼요.",
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
      "(1) 같은 밝기의 조명을 고를 때",
      "(2) 교실 냉난방을 사용할 때",
      "(3) 사람이 없는 교실을 나올 때"
     ],
     "options": [
      "ㄱ 필요한 환기를 유지하며 불필요하게 열린 창문을 살핀다.",
      "ㄴ 필요 없는 조명을 끈다.",
      "ㄷ 같은 시간에 전기를 더 적게 쓰는 제품을 고른다."
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
     "criteria": "(1) ㄷ / (2) ㄱ / (3) ㄴ. 부분별 답의 대응을 유지한다.",
     "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
     "given": [
      "ㄱ 필요한 환기를 유지하며 불필요하게 열린 창문을 살핀다.",
      "ㄴ 필요 없는 조명을 끈다.",
      "ㄷ 같은 시간에 전기를 더 적게 쓰는 제품을 고른다."
     ],
     "answerPerPart": true
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 빈칸 넣기",
     "value": "절약 방법과 필요한 기능"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "전기를 덜 써도 필요한 기능과 안전은 유지하고 사용 설명서를 따라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "상황마다 낭비를 줄일 방법을 연결해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 118~120",
    "title": "전기 절약과 실천 · 연결하기",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 사용한 전기 에너지를 소비 전력과 사용 시간으로 구해요. 와트시(Wh)는 전기 에너지의 양을 나타내는 단위예요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w118",
     "no": 118,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "match",
     "form": "short",
     "type": "T14",
     "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "prompt": "전기를 아끼는 제안에서 무엇을 함께 확인해야 할까요? 서로 연결하세요.",
     "answer": "ㄷ / ㄱ / ㄴ",
     "explanation": "조명은 사용 여부와 밝기인 ㄷ, 냉장고는 식품 보관과 문을 열 필요인 ㄱ, 냉방은 환기와 이용 조건인 ㄴ을 살펴요. 필요한 일을 없애면서 무조건 끄는 계획은 아니에요.",
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
     "prompt": "먼저 실천할 계획을 세우고, 실제로 실천한 뒤, 정한 기간이 지나면 결과를 돌아보려고 해요. 다음 활동을 순서대로 쓰세요.",
     "answer": "ㄴ → ㄷ → ㄱ",
     "explanation": "장소와 행동, 기간과 확인 방법을 정한 뒤 실제로 해요. 기간이 지나 기록을 돌아보므로 ㄴ → ㄷ → ㄱ이에요. 아직 하지 않은 일을 성공했다고 쓰지 않아요.",
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
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "조명을 효율적으로 고르는 과정을 “같은 기능 확인→전기 사용량 비교→선택 이유 설명” 순서로 배열하세요.",
     "answer": "ㄴ → ㄱ → ㄷ",
     "explanation": "먼저 필요한 밝기가 같은지 확인하고, 같은 사용 시간에서 전기 에너지를 비교해요. 그 자료로 기능을 유지하면서 전기를 덜 쓰는 선택을 설명해요.",
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
      "ㄱ 같은 시간 동안 사용한 전기 에너지를 비교한다.",
      "ㄴ 필요한 밝기를 똑같이 내는 조명인지 확인한다.",
      "ㄷ 기능을 유지하면서 전기를 덜 쓰는 선택을 설명한다."
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
      "ㄱ 같은 시간 동안 사용한 전기 에너지를 비교한다.",
      "ㄴ 필요한 밝기를 똑같이 내는 조명인지 확인한다.",
      "ㄷ 기능을 유지하면서 전기를 덜 쓰는 선택을 설명한다."
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 연결하기",
     "value": "기능·실천·비교의 순서를 살펴요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "같은 밝기와 시간으로 사용량을 비교하고, 실천은 계획한 뒤 실제로 하며 돌아보아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "아직 하지 않은 일과 실제로 한 일을 어떻게 나눌지 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 121~122",
    "title": "전기 절약과 실천 · 복수 선택",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 대기 전력이 기구가 주요 기능을 하지 않는 동안에도 쓰이는 전력임을 배워요. 기구마다 대기 상태와 사용 조건이 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w121",
     "no": 121,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "multiple",
     "form": "choice",
     "type": "T14",
     "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "prompt": "안전하게 전기를 아끼려면 계획에 무엇을 넣어야 할까요? 세 개 고르세요.",
     "answer": "②, ③, ④",
     "explanation": "장소와 행동인 ②, 기간과 확인 방법인 ③, 필요한 밝기와 환기인 ④가 있어야 실천할 수 있어요. 불편을 숨기거나 시설을 분해하는 계획은 알맞지 않아요.",
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
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "전기를 효율적이고 안전하게 사용하는 방법을 모두 고르세요. (정답 3개)",
     "answer": "②, ④, ⑤",
     "explanation": "필요한 기능과 안전을 유지하면서 불필요한 사용을 줄여요. 같은 기능·사용 시간에서 전기 사용량을 비교하는 것도 효율적인 제품 선택에 도움이 돼요.",
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
      "효율이 좋은 조명이면 필요 없어도 계속 켜 둔다.",
      "같은 밝기와 사용 시간에서 전기 사용량을 비교한다.",
      "절약을 위해 필요한 환기와 식품 보관 기능을 없앤다.",
      "사용할 필요가 없는 조명은 끈다.",
      "사용 방법과 안전 안내를 확인하고 실천한다."
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
     "criteria": "빠짐·추가·중복 없이 고른다: ②, ④, ⑤",
     "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요."
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 복수 선택",
     "value": "실천할 계획에 필요한 것"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "장소·행동·기간·확인 방법을 정하고 필요한 밝기와 환기를 유지해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "효율이 좋아도 필요 없는 조명을 꺼야 하는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 123",
    "title": "전기 절약과 실천 · 자료 해석",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 조명의 빛을 루멘으로 비교하기도 해요. 같은 소비 전력의 제품이 모두 같은 밝기를 내는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w123",
     "no": 123,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "data",
     "form": "short",
     "type": "T14",
     "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "prompt": "표에서 필요 없는 조명을 켠 시간을 더해요. (1) 실천 전의 합 (2) 실천 후의 합을 단위와 함께 쓰세요.",
     "answer": "180분 / 90분",
     "explanation": "전은 60+60+60=180분, 후는 35+30+25=90분이에요. 필요 없는 조명을 켠 시간의 합이에요. 이 시간으로 전기 사용량이나 요금을 직접 잰 것은 아니에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 자료 해석",
     "value": "필요 없이 켠 시간의 합"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "각 날짜의 불필요한 점등 시간을 더해 전과 후의 합을 따로 구해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "시간의 합을 전기 사용량이나 요금과 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 124",
    "title": "전기 절약과 실천 · 자료 해석",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 조명의 빛을 루멘으로 비교하기도 해요. 같은 소비 전력의 제품이 모두 같은 밝기를 내는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w124",
     "no": 124,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "data",
     "form": "short",
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "표에서 (1)전기 사용량이 더 적은 조명의 기호 (2)두 조명의 전기 에너지 사용량 차이를 단위와 함께 쓰세요.",
     "answer": "B / 12Wh",
     "explanation": "B는12Wh로A의24Wh보다 적어요. 두 조명의 사용량 차이는24−12=12Wh예요. 밝기와 사용 시간을 같게 두고 비교한 결과예요.",
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
         "B",
         "비",
         "B 조명"
        ]
       },
       {
        "label": "(2)",
        "kind": "number-unit",
        "value": 12,
        "units": [
         "Wh",
         "와트시"
        ],
        "unitRequired": true,
        "tolerance": 0,
        "accepted": [
         "12Wh",
         "12와트시"
        ]
       }
      ]
     },
     "table": {
      "머리": [
       "조명",
       "같은 밝기로3시간 사용한 전기 에너지(Wh)"
      ],
      "행": [
       [
        "A",
        24
       ],
       [
        "B",
        12
       ]
      ]
     },
     "givens": "같은 밝기로 같은 3시간 동안 쓴다고 정한 비교 자료예요. Wh는 사용한 전기 에너지를 나타내는 단위예요.",
     "verificationModel": null,
     "formLabel": "자료 해석",
     "criteria": "(1) B 또는 비 또는 B 조명 / (2) 12Wh 또는 12와트시 (단위 필요). 부분별 답의 대응을 유지한다.",
     "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
     "given": [
      "같은 밝기로 같은 3시간 동안 쓴다고 정한 비교 자료예요. Wh는 사용한 전기 에너지를 나타내는 단위예요."
     ],
     "parts": [
      "(1)",
      "(2) · 단위도 써요."
     ],
     "answerPerPart": true,
     "figure": "electricity-question-data-124"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 자료 해석",
     "value": "같은 밝기의 전기 에너지 비교"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "같은 밝기와 3시간의 조건에서 사용 에너지가 적은 조명을 찾아요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "두 값의 차이에 표의 단위 Wh를 붙여요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 125",
    "title": "전기 절약과 실천 · 까닭 설명",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 에너지 절약 효과를 비교할 때 기능·사용 시간·측정 기간을 함께 살펴요. 조명 시간의 감소와 건물 전체 사용량의 감소는 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w125",
     "no": 125,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T18",
     "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "prompt": "“조명을 켠 시간이 절반이니 전체 전기요금도 정확히 절반 줄었어”라고 말할 수 있을까요? 표에서 알 수 있는 것과 더 필요한 자료를 쓰세요.",
     "answer": "이 표는 필요 없는 조명을 켠 시간이 달라진 기록이에요. 전기 사용량이나 요금을 직접 잰 것은 아니에요. 다른 사용과 요금 조건도 모르므로 전체 요금이 정확히 절반 줄었다고 할 수는 없어요.",
     "explanation": "필요 없는 조명을 켠 시간은 180분에서 90분으로 줄었어요. 하지만 다른 전기 사용과 요금 조건은 없어요. 전체 요금이 정확히 절반 줄었다고 정하려면 자료가 더 필요해요.",
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
      "sample": "이 표는 필요 없는 조명을 켠 시간이 달라진 기록이에요. 전기 사용량이나 요금을 직접 잰 것은 아니에요. 다른 사용과 요금 조건도 모르므로 전체 요금이 정확히 절반 줄었다고 할 수는 없어요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 까닭 설명",
     "value": "점등 시간과 전체 요금은 달라요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "조명을 켠 시간이 절반이 되어도 다른 전기 사용과 요금 조건은 따로 알아야 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "표로 알 수 있는 것과 추가로 필요한 자료를 나누어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 126",
    "title": "전기 절약과 실천 · 까닭 설명",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 에너지 절약 효과를 비교할 때 기능·사용 시간·측정 기간을 함께 살펴요. 조명 시간의 감소와 건물 전체 사용량의 감소는 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w126",
     "no": 126,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "reason",
     "form": "written",
     "type": "T14",
     "topic": "전기를 효율적이고 안전하게 사용해요",
     "prompt": "“같은 밝기에서 전기를 적게 쓰는 조명은 빈 교실에서도 계속 켜 두어도 돼”라는 말이 맞을까요? 까닭을 설명하고, 필요한 밝기를 유지하면서 전기를 아낄 방법을 쓰세요.",
     "answer": "효율이 좋은 조명도 켜 두면 전기 에너지를 사용한다. 필요한 밝기를 유지하면서 사람이 없는 교실의 불필요한 조명을 끄고 사용 시간을 줄여야 한다.",
     "explanation": "효율이 좋은 제품을 고르는 일과 불필요한 사용 시간을 줄이는 일을 함께 실천해야 해요. 전기를 아끼더라도 필요한 밝기와 안전은 유지해요.",
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
      "효율이 좋아도 켜 두면 전기를 사용함을 설명한다.",
      "필요한 밝기를 유지한다.",
      "불필요한 사용 시간을 줄이는 방법을 제안한다."
     ],
     "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "효율이 좋은 조명도 켜 두면 전기 에너지를 사용한다. 필요한 밝기를 유지하면서 사람이 없는 교실의 불필요한 조명을 끄고 사용 시간을 줄여야 한다.",
      "required": [
       "효율이 좋아도 켜 두면 전기를 사용함을 설명한다.",
       "필요한 밝기를 유지한다.",
       "불필요한 사용 시간을 줄이는 방법을 제안한다."
      ],
      "exactStringScoring": false
     },
     "formLabel": "까닭 설명",
     "criteria": "같은 기능에서 적게 쓰는 것과 사용 시간을 줄이는 것을 함께 설명하면 인정해요.",
     "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
     "lines": 6
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 까닭 설명",
     "value": "효율이 좋으면 계속 켜 두어도 될까요?"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "전기를 적게 쓰는 조명도 켜 두면 에너지를 쓰므로 필요 없는 시간은 줄여요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "필요한 밝기를 지키며 불필요한 사용을 줄일 방법을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 127",
    "title": "전기 절약과 실천 · 그림·설계",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 발전과 송전 과정의 에너지 전환과 손실을 배워요. 전기를 효율적으로 사용하는 일은 필요한 발전 에너지를 줄이는 데에도 도움이 돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w127",
     "no": 127,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T18",
     "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "prompt": "교실에서 할 안전·절약 실천 카드를 만드세요. 장소·행동·담당·기간·확인 방법과 아직 하지 않음 칸을 배치하세요.",
     "answer": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
     "explanation": "언제 어디에서 무엇을 할지와 확인 방법을 넣어요. 필요한 밝기와 환기는 유지하고, 실제 날짜와 하지 못한 까닭, 기간 뒤 돌아볼 칸도 비워 두어요.",
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
      "실제 행동·근거와 아직 하지 않음을 구별한다.",
      "필요한 기능과 안전 범위를 유지한다."
     ],
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
      "required": [
       "구체적 실행 조건을 담는다.",
       "실제 행동·근거와 아직 하지 않음을 구별한다.",
       "필요한 기능과 안전 범위를 유지한다."
      ],
      "exactStringScoring": false
     },
     "drawingSpaceMinimumMm": 120,
     "drawingExplanationLines": 3,
     "formLabel": "그림·설계",
     "criteria": "구체적 실행 조건을 담는다. / 실제 행동·근거와 아직 하지 않음을 구별한다. / 필요한 기능과 안전 범위를 유지한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
     "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 그림·설계",
     "value": "안전·절약 실천 카드를 만들어요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "장소·행동·담당·기간·확인 방법과 아직 하지 않음 칸을 구체적으로 정해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "필요한 기능을 유지하는 조건을 카드에 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요 · 128",
    "title": "전기 절약과 실천 · 그림·설계",
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
      "text": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 발전과 송전 과정의 에너지 전환과 손실을 배워요. 전기를 효율적으로 사용하는 일은 필요한 발전 에너지를 줄이는 데에도 도움이 돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "layout": "electricity-workbook"
   },
   "questions": [
    {
     "id": "c22-s62-u03-w128",
     "no": 128,
     "section": 8,
     "sectionTitle": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "bookResponseForm": "draw-design",
     "form": "draw",
     "type": "T18",
     "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
     "prompt": "실천 결과를 친구에게 설명할 그림판을 그리세요. 계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요.",
     "answer": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
     "explanation": "하려던 일과 실제로 한 일을 구별할 칸을 만들어요. 확인한 변화와 아직 알 수 없는 효과도 나누어요. 그림판을 그린 것만으로 실제로 실천하거나 친구에게 설명한 것은 아니에요.",
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
      "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
      "required": [
       "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
      ],
      "exactStringScoring": false
     },
     "drawingSpaceMinimumMm": 120,
     "drawingExplanationLines": 3,
     "formLabel": "그림·설계",
     "criteria": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요.",
     "misconception": "계획과 실행·검토는 달라요. 불필요 점등 시간의 감소만으로 사용량·요금의 정확한 감소를 정하지 않아요.",
     "drawing": "large"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "전기 절약과 실천 · 그림·설계",
     "value": "계획과 실제 결과를 나눌 그림판"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "필요한 기능과 안전을 유지하며 전기 낭비를 줄이고 생활 속에서 실천해요.",
     "value": "계획·실제로 한 일·확인한 변화·아직 모르는 효과는 서로 달라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "네 칸에 어떤 내용을 적을지 구별하고 아직 얻지 않은 결과는 비워 두어요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 조명의 빛을 루멘으로 비교하기도 해요. 같은 소비 전력의 제품이 모두 같은 밝기를 내는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "learn",
    "layout": "electricity-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요.",
     "value": "전기 회로와 전자석의 관찰 근거를 설명하고 안전·절약 계획을 실천해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "이번 단원의 실험 근거와 생활 속 실천 근거를 각각 정리해요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 수행평가",
    "title": "한 전구 회로의 접점을 설명하기",
    "blocks": [
     {
      "type": "text",
      "text": "실제 회로를 만들고 두 접점·전지의 서로 다른 극·스위치·재료의 근거를 남겨요."
     },
     {
      "type": "field",
      "title": "알아본 내용과 설명",
      "hint": "관찰·실험·조사에서 알아낸 내용을 근거와 함께 설명해요.",
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
      "text": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 에너지 절약 효과를 비교할 때 기능·사용 시간·측정 기간을 함께 살펴요. 조명 시간의 감소와 건물 전체 사용량의 감소는 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "assessment",
    "layout": "electricity-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요.",
     "value": "실제 연결한 전지의 두 극과 전구의 두 접점, 스위치와 재료의 근거를 살펴요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "회로에서 어디가 이어지고 끊겼는지 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 수행평가",
    "title": "한 개와 두 개의 전지를 비교하기",
    "blocks": [
     {
      "type": "text",
      "text": "교사 허용 범위의 전지 수를 바꾸고 나머지 조건을 맞춰 반복 관찰한 근거로 설명해요."
     },
     {
      "type": "field",
      "title": "알아본 내용과 설명",
      "hint": "관찰·실험·조사에서 알아낸 내용을 근거와 함께 설명해요.",
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
      "text": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 발전과 송전 과정의 에너지 전환과 손실을 배워요. 전기를 효율적으로 사용하는 일은 필요한 발전 에너지를 줄이는 데에도 도움이 돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "assessment",
    "layout": "electricity-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요.",
     "value": "허용한 전지 수만 바꾸고 다른 조건은 같게 하여 반복 기록을 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "전지 종류·상태·전구·접점과 보는 위치를 함께 확인해요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 수행평가",
    "title": "전자석의 성질과 쓰임 설명하기",
    "blocks": [
     {
      "type": "text",
      "text": "직접 만든 전자석을 전지 연결 전과 연결한 동안, 분리한 뒤에 비교해요. 같은 조건에서 세기와 극을 살피고, 출처가 있는 장치 설명에서 구조와 쓰임을 찾아 연결해요."
     },
     {
      "type": "field",
      "title": "알아본 내용과 설명",
      "hint": "관찰·실험·조사에서 알아낸 내용을 근거와 함께 설명해요.",
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
      "text": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기 에너지가 빛·열·운동 등으로 바뀜을 배워요. 같은 기능을 얻는 데 필요한 에너지의 양을 비교할 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "assessment",
    "layout": "electricity-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요.",
     "value": "만든 전자석의 세기와 극을 같은 조건에서 보고 기기 구조와 쓰임에 연결해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "연결 전·연결 중·분리 뒤의 근거와 구조 자료를 나누어 정리해요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 수행평가",
    "title": "안전·절약 계획을 실제로 실천하기",
    "blocks": [
     {
      "type": "text",
      "text": "조사한 것과 계획, 실제로 한 일과 돌아본 점을 나누어요. 직접 확인한 변화와 아직 모르는 효과, 다음에 확인할 점을 설명해요."
     },
     {
      "type": "field",
      "title": "알아본 내용과 설명",
      "hint": "관찰·실험·조사에서 알아낸 내용을 근거와 함께 설명해요.",
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
      "text": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 유용하게 이용한 에너지의 비율로 효율을 나타내요. 같은 밝기를 내면서 전기를 덜 쓰는 조명이 효율적인 예예요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
      "write": 5
     }
    ],
    "kind": "assessment",
    "layout": "electricity-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "회로와 전자석의 성질을 설명하고 전기 사용 계획을 생활 속에서 실천해요.",
     "value": "조사·계획·실제로 한 일과 돌아본 점을 구별하여 전기를 효율적이고 안전하게 사용해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내가 실천할 방법과 필요한 기능을 유지하는 방법을 함께 적어요.",
     "value": "직접 확인한 변화와 아직 모르는 효과, 다음에 확인할 점을 써요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withElectricityContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s62-u03'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s62-u03-b004",
   "type": "T03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 4,
    "section": "전구의 두 접점을 찾아요",
    "originalExam": false
   },
   "bookResponseForm": "blank",
   "bookQuestionId": "c22-s62-u03-w004",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E1",
    "type": "T03",
    "format": "빈칸 넣기",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-01",
    "topic": "전구의 두 접점을 찾아요",
    "concept": "재료의 전도·절연 조건 해석",
    "inquirySkill": "재료의 전도·절연 조건 해석"
   },
   "prompt": "전선 안쪽 구리는 (1)이 잘 통하고, 바깥의 절연 피복은 뜻하지 않은 (2)을 막는 데 쓰여요. 보기: 전기·접촉",
   "givens": null,
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "전기 / 접촉",
    "accepted": [
     "전기 / 접촉"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "전선 안쪽 구리에는 전기가 잘 통해요. 바깥의 절연 피복은 뜻하지 않은 접촉을 막는 데 써요. 전선의 안과 밖은 재료와 하는 일이 달라요.",
   "standards": [
    "6과15-01"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b004",
     "type": "T03",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 4,
      "section": "전구의 두 접점을 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "blank",
     "bookQuestionId": "c22-s62-u03-w004",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "빈칸 넣기",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-01",
      "topic": "전구의 두 접점을 찾아요",
      "concept": "재료의 전도·절연 조건 해석",
      "inquirySkill": "재료의 전도·절연 조건 해석"
     },
     "prompt": "전선 안쪽 구리는 (1)이 잘 통하고, 바깥의 절연 피복은 뜻하지 않은 (2)을 막는 데 쓰여요. 보기: 전기·접촉",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "전기 / 접촉",
      "accepted": [
       "전기 / 접촉"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "안쪽 금속은 전기가 흐를 길을 만들고 절연 피복은 뜻하지 않은 접촉을 줄인다. 전선 전체가 같은 전기적 성질이라는 뜻은 아니다. 정상 피복만으로 모든 사용 환경에서 안전이 보장되는 것도 아니다.",
     "standards": [
      "6과15-01"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "전선 안쪽 구리는 (1)가 잘 통하고, 전기가 잘 통하지 않는 겉부분인 절연 피복은 뜻하지 않은 (2)을 막아요. 보기: 전기·접촉"
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b015",
   "type": "T15",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 15,
    "section": "전구의 두 접점을 찾아요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w015",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E1",
    "type": "T15",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-01",
    "topic": "전구의 두 접점을 찾아요",
    "concept": "접점·연결의 표현과 설계",
    "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
   },
   "prompt": "분해하지 않은 전구의 겉을 크게 그리고 두 접점과 유리를 표시하세요. 연결선은 아직 그리지 마세요.",
   "givens": null,
   "choices": null,
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
   "answerContract": {
    "type": "written-explanation",
    "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "두 금속 접점 위치를 구별한다.",
      "유리와 접점을 나눈다.",
      "내부를 뜯어 본 그림이나 색으로 극을 지어내지 않는다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
     "required": [
      "두 금속 접점 위치를 구별한다.",
      "유리와 접점을 나눈다.",
      "내부를 뜯어 본 그림이나 색으로 극을 지어내지 않는다."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "옆 금속과 바닥 금속은 따로 표시하고 유리와 구별해요. 접점 위치를 그리는 것이지 회로를 만들어 켜 본 결과를 나타내는 것은 아니에요.",
   "standards": [
    "6과15-01"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b015",
     "type": "T15",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 15,
      "section": "전구의 두 접점을 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w015",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-01",
      "topic": "전구의 두 접점을 찾아요",
      "concept": "접점·연결의 표현과 설계",
      "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
     },
     "prompt": "분해하지 않은 전구의 겉을 크게 그리고 두 접점과 유리를 표시하세요. 연결선은 아직 그리지 마세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "두 금속 접점 위치를 구별한다.",
        "유리와 접점을 나눈다.",
        "내부를 뜯어 본 그림이나 색으로 극을 지어내지 않는다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
       "required": [
        "두 금속 접점 위치를 구별한다.",
        "유리와 접점을 나눈다.",
        "내부를 뜯어 본 그림이나 색으로 극을 지어내지 않는다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "그림의 예쁜 정도보다 접점 두 곳과 비접점 부분의 구별을 본다. 이 위치를 알아야 이후 연결을 설명할 수 있다. 전구의 겉 접점을 그리는 것으로 실제 회로 구성까지 완료한 것은 아니다.",
     "standards": [
      "6과15-01"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
    "required": [
     "분해하지 않은 전구의 두 금속 접점 위치를 구별한다.",
     "옆 금속·바닥 금속·유리에 이름표를 붙인다.",
     "아직 연결선은 그리지 않는다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "분해하지 않은 전구의 두 금속 접점 위치를 구별한다.",
      "옆 금속·바닥 금속·유리에 이름표를 붙인다.",
      "아직 연결선은 그리지 않는다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "옆 금속·바닥 금속을 서로 떨어진 두 접점으로 표시하고 유리와 구별한다. 실물에서 직접 본 부분만 이름표를 붙인다.",
     "required": [
      "분해하지 않은 전구의 두 금속 접점 위치를 구별한다.",
      "옆 금속·바닥 금속·유리에 이름표를 붙인다.",
      "아직 연결선은 그리지 않는다."
     ],
     "exactStringScoring": false
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b021",
   "type": "T02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 21,
    "section": "끊기지 않는 연결과 재료를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "match",
   "bookQuestionId": "c22-s62-u03-w021",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E2",
    "type": "T02",
    "format": "연결하기",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-01",
    "topic": "끊기지 않는 연결과 재료를 비교해요",
    "concept": "접점과 닫힌 연결 판단",
    "inquirySkill": "접점과 닫힌 연결 판단"
   },
   "prompt": "연결 상태와 설명을 연결하세요.",
   "givens": {
    "보기": {
     "머리": [
      "보기"
     ],
     "행": [
      [
       "ㄱ 정상이라면 켜질 수 있는 연결"
      ],
      [
       "ㄴ 돌아오는 길에 빈 구간이 있음"
      ],
      [
       "ㄷ 전지의 서로 다른 두 극을 쓰지 않음"
      ]
     ]
    },
    "문항": {
     "머리": [
      "연결할 설명"
     ],
     "행": [
      [
       "(1) 집게 한 끝이 떨어져 있음"
      ],
      [
       "(2) 전구 양쪽이 같은 전지 단자에만 이어짐"
      ],
      [
       "(3) 전구 두 접점이 전지 양극에 이어짐"
      ]
     ]
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "ㄴ / ㄷ / ㄱ",
    "accepted": [
     "ㄴ / ㄷ / ㄱ"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "중간이 빈 (1)은 ㄴ, 같은 전지 극에만 이어진 (2)는 ㄷ, 바르게 이어진 (3)은 ㄱ이에요. 꺼진 두 회로도 고칠 곳이 서로 달라요.",
   "standards": [
    "6과15-01"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b021",
     "type": "T02",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 21,
      "section": "끊기지 않는 연결과 재료를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "match",
     "bookQuestionId": "c22-s62-u03-w021",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T02",
      "format": "연결하기",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-01",
      "topic": "끊기지 않는 연결과 재료를 비교해요",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단"
     },
     "prompt": "연결 상태와 설명을 연결하세요.",
     "givens": {
      "보기": {
       "머리": [
        "보기"
       ],
       "행": [
        [
         "ㄱ 정상이라면 켜질 수 있는 연결"
        ],
        [
         "ㄴ 돌아오는 길에 빈 구간이 있음"
        ],
        [
         "ㄷ 전지의 서로 다른 두 극을 쓰지 않음"
        ]
       ]
      },
      "문항": {
       "머리": [
        "연결할 설명"
       ],
       "행": [
        [
         "(1) 집게 한 끝이 떨어져 있음"
        ],
        [
         "(2) 전구 양쪽이 같은 전지 단자에만 이어짐"
        ],
        [
         "(3) 전구 두 접점이 전지 양극에 이어짐"
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "ㄴ / ㄷ / ㄱ",
      "accepted": [
       "ㄴ / ㄷ / ㄱ"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "빈 구간인 ㄴ, 같은 단자 연결인 ㄷ, 정상 접속인 ㄱ 순서이다. 꺼진 두 연결도 원인이 같지는 않다. 빈 곳을 잇는 수정과 단자를 옮기는 수정을 구별한다.",
     "standards": [
      "6과15-01"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "givens": {
    "보기": {
     "머리": [
      "보기"
     ],
     "행": [
      [
       "ㄱ 정상이라면 켜질 수 있는 연결"
      ],
      [
       "ㄴ 돌아오는 길에 빈 구간이 있음"
      ],
      [
       "ㄷ 전지의 서로 다른 두 극을 쓰지 않음"
      ]
     ]
    },
    "문항": {
     "머리": [
      "연결할 설명"
     ],
     "행": [
      [
       "(1) 집게 한 끝이 떨어져 있음"
      ],
      [
       "(2) 전구 양쪽이 같은 전지 단자에만 이어짐"
      ],
      [
       "(3) 전구의 두 접점이 전지의 서로 다른 두 극에 각각 이어짐"
      ]
     ]
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b031",
   "type": "T15",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 31,
    "section": "끊기지 않는 연결과 재료를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w031",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E2",
    "type": "T15",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-01",
    "topic": "끊기지 않는 연결과 재료를 비교해요",
    "concept": "접점·연결의 표현과 설계",
    "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
   },
   "prompt": "한 전구 회로의 연결을 크게 그리세요. 전지의 두 극과 전구 옆·바닥 접점을 표시하고, 전구를 거쳐 돌아오는 길을 구별하세요.",
   "givens": null,
   "choices": null,
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
   "answerContract": {
    "type": "written-explanation",
    "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "전지 극과 전구 접점을 이름표로 구별한다.",
      "전구를 거치는 끊기지 않는 연결을 나타낸다.",
      "전지 양극을 전선만으로 직접 잇지 않는다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
     "required": [
      "전지 극과 전구 접점을 이름표로 구별한다.",
      "전구를 거치는 끊기지 않는 연결을 나타낸다.",
      "전지 양극을 전선만으로 직접 잇지 않는다."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "전지의 +극과 −극이 전구의 서로 다른 접점에 이어지도록 그려요. 선 모양보다 실제 닿는 곳이 중요해요. 그림을 그린 것과 선생님 점검 뒤 실물로 켜 본 것은 구별해요.",
   "standards": [
    "6과15-01"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b031",
     "type": "T15",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 31,
      "section": "끊기지 않는 연결과 재료를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w031",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T15",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-01",
      "topic": "끊기지 않는 연결과 재료를 비교해요",
      "concept": "접점·연결의 표현과 설계",
      "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
     },
     "prompt": "한 전구 회로의 연결을 크게 그리세요. 전지의 두 극과 전구 옆·바닥 접점을 표시하고, 전구를 거쳐 돌아오는 길을 구별하세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "전지 극과 전구 접점을 이름표로 구별한다.",
        "전구를 거치는 끊기지 않는 연결을 나타낸다.",
        "전지 양극을 전선만으로 직접 잇지 않는다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
       "required": [
        "전지 극과 전구 접점을 이름표로 구별한다.",
        "전구를 거치는 끊기지 않는 연결을 나타낸다.",
        "전지 양극을 전선만으로 직접 잇지 않는다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "보기 좋은 선의 모양이 아니라 실제로 무엇과 무엇이 닿는지 본다. 직접 금속 접촉을 포함한 다른 타당한 연결도 인정한다. 이 그림은 교사 점검을 거친 실물 실행과는 별도이다.",
     "standards": [
      "6과15-01"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
    "required": [
     "전지의 +극·−극과 전구의 두 접점을 이름표로 구별한다.",
     "전구를 거쳐 돌아오는 끊기지 않는 길을 나타낸다.",
     "전지의 +극과 −극을 전선만으로 직접 잇지 않는다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "전지의 +극·−극과 전구의 두 접점을 이름표로 구별한다.",
      "전구를 거쳐 돌아오는 끊기지 않는 길을 나타낸다.",
      "전지의 +극과 −극을 전선만으로 직접 잇지 않는다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "전지 +극과 −극이 전구의 서로 다른 두 접점으로 이어진다. 전구를 건너뛰는 전지 직접 연결은 그리지 않는다.",
     "required": [
      "전지의 +극·−극과 전구의 두 접점을 이름표로 구별한다.",
      "전구를 거쳐 돌아오는 끊기지 않는 길을 나타낸다.",
      "전지의 +극과 −극을 전선만으로 직접 잇지 않는다."
     ],
     "exactStringScoring": false
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b034",
   "type": "T05",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 34,
    "section": "전지 한 개와 두 개를 연결해요",
    "originalExam": false
   },
   "bookResponseForm": "single",
   "bookQuestionId": "c22-s62-u03-w034",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T05",
    "format": "객관식",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "전지 한 개와 두 개를 연결해요",
    "concept": "전지 한 개와 두 개의 조건 비교",
    "inquirySkill": "전지 한 개와 두 개의 조건 비교"
   },
   "prompt": "전지 한 개와 두 개를 비교해요. 전지 수 외에 같게 할 조건을 고르세요.",
   "givens": {
    "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다."
   },
   "choices": [
    "두 전구의 서로 다른 종류",
    "한쪽만 느슨한 금속 접촉",
    "전지 종류와 사용 상태",
    "비교 때마다 다른 전선 굵기",
    "한쪽만 다른 주변 밝기"
   ],
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "answerContract": {
    "type": "single-choice",
    "answer": 2,
    "seasonContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 2
    }
   },
   "explanation": "전지 수만 비교하려면 종류와 사용 상태를 같게 하는 ③이 알맞아요. 전구와 접촉 상태, 전선과 주변 밝기도 같게 하고 알맞은 규격을 써요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w034",
    "no": 34
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "0": "M05",
     "1": "M05",
     "3": "M05",
     "4": "M05"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b034",
     "type": "T05",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 34,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w034",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교"
     },
     "prompt": "한 개와 두 개의 전지를 비교할 때 맞춰야 할 조건을 고르세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다."
     },
     "choices": [
      "두 전구의 서로 다른 종류",
      "한쪽만 느슨한 금속 접촉",
      "전지 종류와 사용 상태",
      "비교 때마다 다른 전선 굵기",
      "한쪽만 다른 주변 밝기"
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 2
      }
     },
     "explanation": "전지 수 외에 종류·사용 상태 등 중요한 조건을 맞춰야 한다. 전구·접촉·전선·주변 밝기까지 다르면 원인을 나눠 해석하기 어렵다. 정격이 맞는 부품을 쓰는 조건도 필요하다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b034",
     "type": "T05",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 34,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w034",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교"
     },
     "prompt": "한 개와 두 개의 전지를 비교할 때 맞춰야 할 조건을 고르세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다."
     },
     "choices": [
      "두 전구의 서로 다른 종류",
      "한쪽만 느슨한 금속 접촉",
      "전지 종류와 사용 상태",
      "비교 때마다 다른 전선 굵기",
      "한쪽만 다른 주변 밝기"
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 2
      }
     },
     "explanation": "전지 수 외에 종류·사용 상태 등 중요한 조건을 맞춰야 한다. 전구·접촉·전선·주변 밝기까지 다르면 원인을 나눠 해석하기 어렵다. 규격이 맞는 부품을 쓰는 조건도 필요하다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w034",
      "no": 34
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "0": "M05",
       "1": "M05",
       "3": "M05",
       "4": "M05"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b034",
       "type": "T05",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 34,
        "section": "전지 한 개와 두 개를 연결해요",
        "originalExam": false
       },
       "bookResponseForm": "single",
       "bookQuestionId": "c22-s62-u03-w034",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E3",
        "type": "T05",
        "format": "객관식",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "전지 한 개와 두 개를 연결해요",
        "concept": "전지 한 개와 두 개의 조건 비교",
        "inquirySkill": "전지 한 개와 두 개의 조건 비교"
       },
       "prompt": "한 개와 두 개의 전지를 비교할 때 맞춰야 할 조건을 고르세요.",
       "givens": {
        "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다."
       },
       "choices": [
        "두 전구의 서로 다른 종류",
        "한쪽만 느슨한 금속 접촉",
        "전지 종류와 사용 상태",
        "비교 때마다 다른 전선 굵기",
        "한쪽만 다른 주변 밝기"
       ],
       "responseContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
       },
       "answerContract": {
        "type": "single-choice",
        "answer": 2,
        "seasonContract": {
         "kind": "single-choice",
         "teacherRequired": false,
         "answer": 2
        }
       },
       "explanation": "전지 수 외에 종류·사용 상태 등 중요한 조건을 맞춰야 한다. 전구·접촉·전선·주변 밝기까지 다르면 원인을 나눠 해석하기 어렵다. 정격이 맞는 부품을 쓰는 조건도 필요하다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다.",
   "givens": {
    "조건": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요."
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "0": "M05",
     "1": "M05",
     "3": "M05",
     "4": "M05"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b037",
   "type": "T05",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 37,
    "section": "전지 한 개와 두 개를 연결해요",
    "originalExam": false
   },
   "bookResponseForm": "match",
   "bookQuestionId": "c22-s62-u03-w037",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T05",
    "format": "연결하기",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "전지 한 개와 두 개를 연결해요",
    "concept": "전지 한 개와 두 개의 조건 비교",
    "inquirySkill": "전지 한 개와 두 개의 조건 비교"
   },
   "prompt": "연결 설명과 카드를 연결하세요.",
   "givens": {
    "보기": {
     "머리": [
      "보기"
     ],
     "행": [
      [
       "ㄱ 가운데 서로 다른 극을 이음"
      ],
      [
       "ㄴ 가운데 같은 극을 이음"
      ],
      [
       "ㄷ 전지의 양극을 전구에 각각 이음"
      ]
     ]
    },
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) 전지 한 개"
      ],
      [
       "(2) 같은 두 전지의 직렬연결"
      ],
      [
       "(3) 가운데 같은 +극끼리 맞댄 연결"
      ]
     ]
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "ㄷ / ㄱ / ㄴ",
    "accepted": [
     "ㄷ / ㄱ / ㄴ"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "전지 한 개의 두 극을 쓴 (1)은 ㄷ이에요. 두 전지의 서로 다른 극을 이은 (2)는 ㄱ, 같은 극끼리 이은 (3)은 ㄴ이에요. 두 개라는 수만 보지 말고 실제 극을 읽어요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w037",
    "no": 37
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": {
     "any": "M05"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b037",
     "type": "T05",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 37,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "match",
     "bookQuestionId": "c22-s62-u03-w037",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "연결하기",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교"
     },
     "prompt": "연결 설명과 카드를 연결하세요.",
     "givens": {
      "보기": {
       "머리": [
        "보기"
       ],
       "행": [
        [
         "ㄱ 가운데 서로 다른 극을 이음"
        ],
        [
         "ㄴ 가운데 같은 극을 이음"
        ],
        [
         "ㄷ 전지의 양극을 전구에 각각 이음"
        ]
       ]
      },
      "문항": {
       "머리": [
        "연결할 설명"
       ],
       "행": [
        [
         "(1) 전지 한 개"
        ],
        [
         "(2) 같은 두 전지가 돕는 한 줄 연결"
        ],
        [
         "(3) 가운데 같은 +극끼리 맞댄 연결"
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "ㄷ / ㄱ / ㄴ",
      "accepted": [
       "ㄷ / ㄱ / ㄴ"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "한 개는 그 전지의 양극을 쓰는 ㄷ, 두 개가 돕는 연결은 ㄱ이다. 같은 +극끼리 맞댄 것은 ㄴ으로 구별한다. 전지 수가 두 개라는 사실만으로 돕는 연결이라고 정하지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b037",
     "type": "T05",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 37,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "match",
     "bookQuestionId": "c22-s62-u03-w037",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "연결하기",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교"
     },
     "prompt": "연결 설명과 카드를 연결하세요.",
     "givens": {
      "보기": {
       "머리": [
        "보기"
       ],
       "행": [
        [
         "ㄱ 가운데 서로 다른 극을 이음"
        ],
        [
         "ㄴ 가운데 같은 극을 이음"
        ],
        [
         "ㄷ 전지의 양극을 전구에 각각 이음"
        ]
       ]
      },
      "문항": {
       "머리": [
        "문항"
       ],
       "행": [
        [
         "(1) 전지 한 개"
        ],
        [
         "(2) 같은 두 전지의 직렬연결"
        ],
        [
         "(3) 가운데 같은 +극끼리 맞댄 연결"
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "ㄷ / ㄱ / ㄴ",
      "accepted": [
       "ㄷ / ㄱ / ㄴ"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "한 개는 그 전지의 양극을 쓰는 ㄷ, 두 개가 돕는 연결은 ㄱ이다. 같은 +극끼리 맞댄 것은 ㄴ으로 구별한다. 전지 수가 두 개라는 사실만으로 돕는 연결이라고 정하지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w037",
      "no": 37
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": {
       "any": "M05"
      },
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b037",
       "type": "T05",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 37,
        "section": "전지 한 개와 두 개를 연결해요",
        "originalExam": false
       },
       "bookResponseForm": "match",
       "bookQuestionId": "c22-s62-u03-w037",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E3",
        "type": "T05",
        "format": "연결하기",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "전지 한 개와 두 개를 연결해요",
        "concept": "전지 한 개와 두 개의 조건 비교",
        "inquirySkill": "전지 한 개와 두 개의 조건 비교"
       },
       "prompt": "연결 설명과 카드를 연결하세요.",
       "givens": {
        "보기": {
         "머리": [
          "보기"
         ],
         "행": [
          [
           "ㄱ 가운데 서로 다른 극을 이음"
          ],
          [
           "ㄴ 가운데 같은 극을 이음"
          ],
          [
           "ㄷ 전지의 양극을 전구에 각각 이음"
          ]
         ]
        },
        "문항": {
         "머리": [
          "연결할 설명"
         ],
         "행": [
          [
           "(1) 전지 한 개"
          ],
          [
           "(2) 같은 두 전지가 돕는 한 줄 연결"
          ],
          [
           "(3) 가운데 같은 +극끼리 맞댄 연결"
          ]
         ]
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "ㄷ / ㄱ / ㄴ",
        "accepted": [
         "ㄷ / ㄱ / ㄴ"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "한 개는 그 전지의 양극을 쓰는 ㄷ, 두 개가 돕는 연결은 ㄱ이다. 같은 +극끼리 맞댄 것은 ㄴ으로 구별한다. 전지 수가 두 개라는 사실만으로 돕는 연결이라고 정하지 않는다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "givens": {
    "보기": {
     "머리": [
      "보기"
     ],
     "행": [
      [
       "ㄱ 가운데 서로 다른 극을 이음"
      ],
      [
       "ㄴ 가운데 같은 극을 이음"
      ],
      [
       "ㄷ 전지의 +극과 −극을 전구에 각각 이음"
      ]
     ]
    },
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) 전지 한 개"
      ],
      [
       "(2) 같은 두 전지의 직렬연결"
      ],
      [
       "(3) 가운데 같은 +극끼리 맞댄 연결"
      ]
     ]
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": {
     "any": "M05"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b039",
   "type": "T05",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 39,
    "section": "전지 한 개와 두 개를 연결해요",
    "originalExam": false
   },
   "bookResponseForm": "sequence",
   "bookQuestionId": "c22-s62-u03-w039",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T05",
    "format": "순서 배열",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "전지 한 개와 두 개를 연결해요",
    "concept": "전지 한 개와 두 개의 조건 비교",
    "inquirySkill": "전지 한 개와 두 개의 조건 비교"
   },
   "prompt": "“전지 분리 → 두 전지 연결 점검 → 잠깐 관찰” 순서로 기호를 쓰세요.",
   "givens": {
    "보기": {
     "머리": [
      "보기"
     ],
     "행": [
      [
       "ㄱ 두 전지가 돕는 연결인지 교사에게 확인받는다."
      ],
      [
       "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다."
      ],
      [
       "ㄷ 스위치를 열고 전지를 분리한다."
      ]
     ]
    }
   },
   "choices": null,
   "responseContract": {
    "kind": "ordered-label-sequence",
    "teacherRequired": false,
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "answerContract": {
    "type": "short-text",
    "answer": "ㄷ → ㄱ → ㄴ",
    "accepted": [
     "ㄷ → ㄱ → ㄴ"
    ],
    "inputHint": "기호를 순서대로 써요.",
    "seasonContract": {
     "kind": "ordered-label-sequence",
     "teacherRequired": false,
     "sequence": [
      "ㄷ",
      "ㄱ",
      "ㄴ"
     ]
    }
   },
   "explanation": "스위치를 열고 전지를 분리한 뒤 두 전지의 연결을 점검받아요. 정한 시간만 잠깐 관찰하므로 ㄷ → ㄱ → ㄴ이에요. 전지를 계속 더하는 활동은 아니에요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b039",
     "type": "T05",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 39,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "sequence",
     "bookQuestionId": "c22-s62-u03-w039",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "순서 배열",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교"
     },
     "prompt": "교사의 변경 순서 “전원 분리→두 전지 연결 점검→짧게 관찰”을 배열하세요.",
     "givens": {
      "보기": {
       "머리": [
        "보기"
       ],
       "행": [
        [
         "ㄱ 두 전지가 돕는 연결인지 교사에게 확인받는다."
        ],
        [
         "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다."
        ],
        [
         "ㄷ 스위치를 열고 전지를 분리한다."
        ]
       ]
      }
     },
     "choices": null,
     "responseContract": {
      "kind": "ordered-label-sequence",
      "teacherRequired": false,
      "sequence": [
       "ㄷ",
       "ㄱ",
       "ㄴ"
      ]
     },
     "answerContract": {
      "type": "short-text",
      "answer": "ㄷ → ㄱ → ㄴ",
      "accepted": [
       "ㄷ → ㄱ → ㄴ"
      ],
      "inputHint": "기호를 순서대로 써요.",
      "seasonContract": {
       "kind": "ordered-label-sequence",
       "teacherRequired": false,
       "sequence": [
        "ㄷ",
        "ㄱ",
        "ㄴ"
       ]
      }
     },
     "explanation": "분리한 ㄷ 뒤 두 전지 연결 점검인 ㄱ, 관찰인 ㄴ이 온다. 전구와 코일 등 부품의 허용 조건을 무시해 계속 전지를 늘리는 활동으로 바꾸지 않는다. 적힌 세 단계의 선후를 지킨다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "givens": {
    "보기": {
     "머리": [
      "보기"
     ],
     "행": [
      [
       "ㄱ 두 전지의 직렬연결인지 교사에게 확인받는다."
      ],
      [
       "ㄴ 교사 안내의 짧은 시간만 켜서 관찰한다."
      ],
      [
       "ㄷ 스위치를 열고 전지를 분리한다."
      ]
     ]
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b042",
   "type": "T05",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 42,
    "section": "전지 한 개와 두 개를 연결해요",
    "originalExam": false
   },
   "bookResponseForm": "multiple",
   "bookQuestionId": "c22-s62-u03-w042",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T05",
    "format": "복수 선택",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "전지 한 개와 두 개를 연결해요",
    "concept": "전지 한 개와 두 개의 조건 비교",
    "inquirySkill": "전지 한 개와 두 개의 조건 비교"
   },
   "prompt": "카드의 극 연결을 바르게 읽은 것을 고르세요. (정답 3개)",
   "givens": {
    "조건": "같은 종류와 상태의 두 전지예요. 바깥에 남은 두 극은 같은 정상 전구 하나의 서로 다른 접점에 이어져요. 연결 카드만 읽는 문제예요.",
    "자료표": {
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
    }
   },
   "choices": [
    "ㄴ은 서로 다른 극을 연결했다.",
    "ㄷ은 서로 다른 극을 연결했다.",
    "ㄱ은 전선 색이 같아 돕는 연결이다.",
    "ㄷ은 같은 −극끼리 연결했다.",
    "ㄱ은 같은 +극끼리 연결했다."
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
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     3,
     4
    ],
    "seasonContract": {
     "kind": "multi-choice",
     "teacherRequired": false,
     "answers": [
      0,
      3,
      4
     ]
    }
   },
   "explanation": "표에서 ㄱ은 +극끼리, ㄴ은 −극과 +극, ㄷ은 −극끼리 이었어요. 그래서 ①, ④, ⑤예요. 색이나 한 줄 모양 대신 극 표시를 읽어요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b042",
     "type": "T05",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 42,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w042",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교"
     },
     "prompt": "카드의 극 연결을 바르게 읽은 것을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 종류·상태의 두 전지이다. 남은 바깥 두 극은 같은 정상 전구 하나의 서로 다른 접점으로 이어진다. 연결 카드만 읽는다.",
      "자료표": {
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
      }
     },
     "choices": [
      "ㄴ은 서로 다른 극을 연결했다.",
      "ㄷ은 서로 다른 극을 연결했다.",
      "ㄱ은 전선 색이 같아 돕는 연결이다.",
      "ㄷ은 같은 −극끼리 연결했다.",
      "ㄱ은 같은 +극끼리 연결했다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       3,
       4
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        0,
        3,
        4
       ]
      }
     },
     "explanation": "ㄱ은 +/+이고 ㄴ은 −/+이며 ㄷ은 −/−이다. 실제 표시를 읽으면 세 설명을 확인할 수 있다. 색이나 겉모양은 극 접속을 대신하는 근거가 아니다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "choices": [
    "ㄴ은 서로 다른 극을 연결했다.",
    "ㄷ은 서로 다른 극을 연결했다.",
    "ㄱ은 전선 색이 같아 직렬연결이다.",
    "ㄷ은 같은 −극끼리 연결했다.",
    "ㄱ은 같은 +극끼리 연결했다."
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b044",
   "type": "T05",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 44,
    "section": "전지 한 개와 두 개를 연결해요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w044",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T05",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "전지 한 개와 두 개를 연결해요",
    "concept": "전지 한 개와 두 개의 조건 비교",
    "inquirySkill": "전지 한 개와 두 개의 조건 비교"
   },
   "prompt": "연결 메모를 읽고 (1)가운데 이은 두 극의 관계 (2)전구에 이을 단자 위치를 쓰세요.",
   "givens": {
    "자료표": {
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
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "서로 다른 극 / 바깥",
    "accepted": [
     "서로 다른 극 / 바깥"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "가운데의 −극과 +극은 서로 다른 극이에요. 전구에는 그 연결에 쓰지 않은 바깥 두 극을 이어요. 가운데 연결과 바깥 두 끝을 구별해요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b044",
     "type": "T05",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 44,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w044",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교"
     },
     "prompt": "연결 메모를 읽고 (1)가운데 이은 두 극의 관계 (2)전구에 이을 단자 위치를 쓰세요.",
     "givens": {
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "서로 다른 극 / 바깥",
      "accepted": [
       "서로 다른 극 / 바깥"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "가운데는 −극과 +극이므로 다른 극이다. 전구로 가는 것은 가운데에 쓰지 않은 바깥 두 끝이다. 이어 붙인 내부 접속과 전구에 연결할 외부 단자를 혼동하지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
     {
      "label": "(1)",
      "kind": "short-text",
      "accepted": [
       "서로 다른 극",
       "다른 극",
       "서로 다르다",
       "서로 다른 극끼리"
      ]
     },
     {
      "label": "(2)",
      "kind": "short-text",
      "accepted": [
       "바깥",
       "바깥쪽",
       "양 끝",
       "바깥 양 끝",
       "바깥의 두 극",
       "바깥 두 극",
       "남은 두 극",
       "남은 양 끝"
      ]
     }
    ]
   },
   "answerContract": {
    "type": "short-text",
    "answer": "서로 다른 극 / 바깥",
    "accepted": [
     "서로 다른 극 / 바깥",
     "서로 다른 극 / 바깥쪽",
     "서로 다른 극 / 양 끝",
     "서로 다른 극 / 바깥 양 끝",
     "서로 다른 극 / 바깥의 두 극",
     "서로 다른 극 / 바깥 두 극",
     "서로 다른 극 / 남은 두 극",
     "서로 다른 극 / 남은 양 끝",
     "다른 극 / 바깥",
     "다른 극 / 바깥쪽",
     "다른 극 / 양 끝",
     "다른 극 / 바깥 양 끝",
     "다른 극 / 바깥의 두 극",
     "다른 극 / 바깥 두 극",
     "다른 극 / 남은 두 극",
     "다른 극 / 남은 양 끝",
     "서로 다르다 / 바깥",
     "서로 다르다 / 바깥쪽",
     "서로 다르다 / 양 끝",
     "서로 다르다 / 바깥 양 끝",
     "서로 다르다 / 바깥의 두 극",
     "서로 다르다 / 바깥 두 극",
     "서로 다르다 / 남은 두 극",
     "서로 다르다 / 남은 양 끝",
     "서로 다른 극끼리 / 바깥",
     "서로 다른 극끼리 / 바깥쪽",
     "서로 다른 극끼리 / 양 끝",
     "서로 다른 극끼리 / 바깥 양 끝",
     "서로 다른 극끼리 / 바깥의 두 극",
     "서로 다른 극끼리 / 바깥 두 극",
     "서로 다른 극끼리 / 남은 두 극",
     "서로 다른 극끼리 / 남은 양 끝"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
     "kind": "ordered-term-parts",
     "teacherRequired": false,
     "parts": [
      {
       "label": "(1)",
       "kind": "short-text",
       "accepted": [
        "서로 다른 극",
        "다른 극",
        "서로 다르다",
        "서로 다른 극끼리"
       ]
      },
      {
       "label": "(2)",
       "kind": "short-text",
       "accepted": [
        "바깥",
        "바깥쪽",
        "양 끝",
        "바깥 양 끝",
        "바깥의 두 극",
        "바깥 두 극",
        "남은 두 극",
        "남은 양 끝"
       ]
      }
     ]
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b047",
   "type": "T15",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 47,
    "section": "전지 한 개와 두 개를 연결해요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w047",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T15",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "전지 한 개와 두 개를 연결해요",
    "concept": "접점·연결의 표현과 설계",
    "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
   },
   "prompt": "전지 한 개를 연결한 회로와 전지 두 개를 직렬연결한 회로를 나란히 그리세요. 가운데에서 이은 극과 남은 두 극을 모두 표시하세요.",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
    "required": [
     "한개/두개 조건을 나눈다.",
     "모든 극 표시와 가운데 접속을 구별한다.",
     "같은 전구·허용 규격을 메모한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "한개/두개 조건을 나눈다.",
      "모든 극 표시와 가운데 접속을 구별한다.",
      "같은 전구·허용 규격을 메모한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
     "required": [
      "한개/두개 조건을 나눈다.",
      "모든 극 표시와 가운데 접속을 구별한다.",
      "같은 전구·허용 규격을 메모한다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "explanation": "두 그림 모두 같은 전구 하나를 써요. 두 전지 쪽은 가운데 +극과 −극을 이은 곳, 바깥 두 극을 전구에 이은 곳을 구별해요. 전구 여러 개를 잇는 문제로 바꾸지 않아요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w047",
    "no": 47
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b047",
     "type": "T15",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 47,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w047",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T15",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "접점·연결의 표현과 설계",
      "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
     },
     "prompt": "전지 한 개와 서로 돕는 두 개의 연결을 나란히 그리세요. 가운데와 바깥의 극을 모두 표시하세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "한개/두개 조건을 나눈다.",
        "모든 극 표시와 가운데 접속을 구별한다.",
        "같은 전구·허용 정격을 메모한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
       "required": [
        "한개/두개 조건을 나눈다.",
        "모든 극 표시와 가운데 접속을 구별한다.",
        "같은 전구·허용 정격을 메모한다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "극 표시와 실제 접속을 비교할 수 있어야 한다. 전구 여러 개의 연결로 과제를 바꾸지 않는다. 그림의 색이 아니라 이름표와 접속 관계를 교사가 확인한다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b047",
     "type": "T15",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 47,
      "section": "전지 한 개와 두 개를 연결해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w047",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T15",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "전지 한 개와 두 개를 연결해요",
      "concept": "접점·연결의 표현과 설계",
      "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
     },
     "prompt": "전지 한 개를 연결한 회로와 전지 두 개를 직렬연결한 회로를 나란히 그리세요. 가운데에서 이은 극과 남은 두 극을 모두 표시하세요.",
     "givens": null,
     "choices": null,
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
      "required": [
       "한개/두개 조건을 나눈다.",
       "모든 극 표시와 가운데 접속을 구별한다.",
       "같은 전구·허용 규격을 메모한다."
      ],
      "exactStringScoring": false
     },
     "answerContract": {
      "type": "written-explanation",
      "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "한개/두개 조건을 나눈다.",
        "모든 극 표시와 가운데 접속을 구별한다.",
        "같은 전구·허용 규격을 메모한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
       "required": [
        "한개/두개 조건을 나눈다.",
        "모든 극 표시와 가운데 접속을 구별한다.",
        "같은 전구·허용 규격을 메모한다."
       ],
       "exactStringScoring": false
      },
      "reviewRequired": true
     },
     "explanation": "극 표시와 실제 접속을 비교할 수 있어야 한다. 전구 여러 개의 연결로 과제를 바꾸지 않는다. 그림의 색이 아니라 이름표와 접속 관계를 교사가 확인한다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w047",
      "no": 47
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b047",
       "type": "T15",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 47,
        "section": "전지 한 개와 두 개를 연결해요",
        "originalExam": false
       },
       "bookResponseForm": "draw-design",
       "bookQuestionId": "c22-s62-u03-w047",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E3",
        "type": "T15",
        "format": "그림·설계",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "전지 한 개와 두 개를 연결해요",
        "concept": "접점·연결의 표현과 설계",
        "inquirySkill": "겉모양·자료·실제 접속을 구별해 표시한다."
       },
       "prompt": "전지 한 개와 서로 돕는 두 개의 연결을 나란히 그리세요. 가운데와 바깥의 극을 모두 표시하세요.",
       "givens": null,
       "choices": null,
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
       "answerContract": {
        "type": "written-explanation",
        "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
        "teacherRequired": true,
        "rubric": {
         "required": [
          "한개/두개 조건을 나눈다.",
          "모든 극 표시와 가운데 접속을 구별한다.",
          "같은 전구·허용 정격을 메모한다."
         ],
         "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
         "kind": "drawing",
         "teacherRequired": true,
         "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
         "required": [
          "한개/두개 조건을 나눈다.",
          "모든 극 표시와 가운데 접속을 구별한다.",
          "같은 전구·허용 정격을 메모한다."
         ],
         "exactStringScoring": false
        }
       },
       "explanation": "극 표시와 실제 접속을 비교할 수 있어야 한다. 전구 여러 개의 연결로 과제를 바꾸지 않는다. 그림의 색이 아니라 이름표와 접속 관계를 교사가 확인한다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
    "required": [
     "같은 전구 하나에 전지 한 개를 쓴 경우와 두 개를 직렬연결한 경우를 나란히 그린다.",
     "가운데에서 이은 서로 다른 극과 바깥에 남은 두 극을 모두 표시한다.",
     "바깥 두 극이 전구의 서로 다른 접점에 이어지게 나타낸다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "같은 전구 하나에 전지 한 개를 쓴 경우와 두 개를 직렬연결한 경우를 나란히 그린다.",
      "가운데에서 이은 서로 다른 극과 바깥에 남은 두 극을 모두 표시한다.",
      "바깥 두 극이 전구의 서로 다른 접점에 이어지게 나타낸다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "두 장치 모두 같은 전구 하나와 접점 두 곳을 쓴다. 두 전지 쪽은 가운데 +/− 접속과 바깥 두 극의 연결을 구별한다.",
     "required": [
      "같은 전구 하나에 전지 한 개를 쓴 경우와 두 개를 직렬연결한 경우를 나란히 그린다.",
      "가운데에서 이은 서로 다른 극과 바깥에 남은 두 극을 모두 표시한다.",
      "바깥 두 극이 전구의 서로 다른 접점에 이어지게 나타낸다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b050",
   "type": "T16",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 50,
    "section": "같은 조건으로 밝기를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "single",
   "bookQuestionId": "c22-s62-u03-w050",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T16",
    "format": "객관식",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "같은 조건으로 밝기를 비교해요",
    "concept": "공정한 밝기 비교와 측정 자료",
    "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
   },
   "prompt": "밝기 센서 연습표에서 직접 읽을 수 있는 결론을 고르세요.",
   "givens": {
    "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "자료표": {
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
    }
   },
   "choices": [
    "모든 전구의 밝기는 정확히 두 배다.",
    "센서 표시가 전구의 소비 전력이다.",
    "모든 방향의 빛의 양을 다 측정했다.",
    "세 번 모두 두 전지 표시가 더 높다.",
    "세 개 이상 전지를 쓰면 늘 안전하다."
   ],
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "answerContract": {
    "type": "single-choice",
    "answer": 3,
    "seasonContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 3
    }
   },
   "explanation": "세 번 모두 50>31, 54>33, 52>32이므로 두 전지 쪽 표시가 높아요. 따라서 ④예요. 이 표에서 다른 전구나 세 전지의 결과까지 읽을 수는 없어요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w050",
    "no": 50
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "0": "M16",
     "1": "M16",
     "2": "M16",
     "4": "M16"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b050",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 50,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w050",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "밝기 센서 연습표에서 직접 읽을 수 있는 결론을 고르세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": [
      "모든 전구의 밝기는 정확히 두 배다.",
      "센서 표시가 전구의 소비 전력이다.",
      "모든 방향의 빛의 양을 다 측정했다.",
      "세 번 모두 두 전지 표시가 더 높다.",
      "세 개 이상 전지를 쓰면 늘 안전하다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 3
      }
     },
     "explanation": "50>31,54>33,52>32이므로 제시한 세 번에서는 두 전지 쪽 표시가 높다. 그 밖의 전구·방향·전력·전지 수 조건은 측정하지 않았다. 결론을 표와 비교 조건의 범위 안에 둔다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b050",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 50,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w050",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "밝기 센서 연습표에서 직접 읽을 수 있는 결론을 고르세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": [
      "모든 전구의 밝기는 정확히 두 배다.",
      "센서 표시가 전구의 소비 전력이다.",
      "모든 방향의 빛의 양을 다 측정했다.",
      "세 번 모두 두 전지 표시가 더 높다.",
      "세 개 이상 전지를 쓰면 늘 안전하다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 3
      }
     },
     "explanation": "50>31,54>33,52>32이므로 제시한 세 번에서는 두 전지 쪽 표시가 높다. 그 밖의 전구·방향·전력·전지 수 조건은 측정하지 않았다. 결론을 표와 비교 조건의 범위 안에 둔다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w050",
      "no": 50
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "0": "M16",
       "1": "M16",
       "2": "M16",
       "4": "M16"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b050",
       "type": "T16",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 50,
        "section": "같은 조건으로 밝기를 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "single",
       "bookQuestionId": "c22-s62-u03-w050",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T16",
        "format": "객관식",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "같은 조건으로 밝기를 비교해요",
        "concept": "공정한 밝기 비교와 측정 자료",
        "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
       },
       "prompt": "밝기 센서 연습표에서 직접 읽을 수 있는 결론을 고르세요.",
       "givens": {
        "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
        "자료표": {
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
        }
       },
       "choices": [
        "모든 전구의 밝기는 정확히 두 배다.",
        "센서 표시가 전구의 소비 전력이다.",
        "모든 방향의 빛의 양을 다 측정했다.",
        "세 번 모두 두 전지 표시가 더 높다.",
        "세 개 이상 전지를 쓰면 늘 안전하다."
       ],
       "responseContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
       },
       "answerContract": {
        "type": "single-choice",
        "answer": 3,
        "seasonContract": {
         "kind": "single-choice",
         "teacherRequired": false,
         "answer": 3
        }
       },
       "explanation": "50>31,54>33,52>32이므로 제시한 세 번에서는 두 전지 쪽 표시가 높다. 그 밖의 전구·방향·전력·전지 수 조건은 측정하지 않았다. 결론을 표와 비교 조건의 범위 안에 둔다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "givens": {
    "조건": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "자료표": {
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
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "0": "M16",
     "1": "M16",
     "2": "M16",
     "4": "M16"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b058",
   "type": "T16",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 58,
    "section": "같은 조건으로 밝기를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "multiple",
   "bookQuestionId": "c22-s62-u03-w058",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T16",
    "format": "복수 선택",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "같은 조건으로 밝기를 비교해요",
    "concept": "공정한 밝기 비교와 측정 자료",
    "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
   },
   "prompt": "이 연습표만으로 알 수 없는 내용을 세 개 고르세요.",
   "givens": {
    "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "자료표": {
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
    }
   },
   "choices": [
    "모든 전구에서 정확히 두 배 밝다.",
    "이 표의 두 전지 표시가 더 높다.",
    "1회 한 전지 표시는31 lx이다.",
    "우리 반이 실제로 같은 값을 측정했다.",
    "세 전지를 연결해도 안전하다."
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
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     3,
     4
    ],
    "seasonContract": {
     "kind": "multi-choice",
     "teacherRequired": false,
     "answers": [
      0,
      3,
      4
     ]
    }
   },
   "explanation": "표의 숫자와 두 전지 쪽이 높다는 것은 알 수 있어요. 하지만 모든 전구의 밝기, 우리 반의 실제 측정, 세 전지의 안전은 알 수 없으므로 ①, ④, ⑤예요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w058",
    "no": 58
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "1": "M16",
     "2": "M16"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b058",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 58,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w058",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "연습표만으로는 확인했다고 말할 수 없는 내용을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": [
      "모든 전구에서 정확히 두 배 밝다.",
      "이 표의 두 전지 표시가 더 높다.",
      "1회 한 전지 표시는31 lx이다.",
      "우리 반이 실제로 같은 값을 측정했다.",
      "세 전지를 연결해도 안전하다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       3,
       4
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        0,
        3,
        4
       ]
      }
     },
     "explanation": "표 안의 수치와 대소 관계는 직접 읽을 수 있다. 모든 전구의 정확한 배수, 우리 반의 실측 여부, 세 전지의 안전성은 이 자료가 확인하지 않았다. 표가 알려 주는 정보와 과도한 일반화를 구별한다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b058",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 58,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w058",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "연습표만으로는 확인했다고 말할 수 없는 내용을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": [
      "모든 전구에서 정확히 두 배 밝다.",
      "이 표의 두 전지 표시가 더 높다.",
      "1회 한 전지 표시는31 lx이다.",
      "우리 반이 실제로 같은 값을 측정했다.",
      "세 전지를 연결해도 안전하다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       3,
       4
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        0,
        3,
        4
       ]
      }
     },
     "explanation": "표 안의 수치와 대소 관계는 직접 읽을 수 있다. 모든 전구의 정확한 배수, 우리 반의 실측 여부, 세 전지의 안전성은 이 자료가 확인하지 않았다. 표가 알려 주는 정보와 과도한 일반화를 구별한다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w058",
      "no": 58
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "1": "M16",
       "2": "M16"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b058",
       "type": "T16",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 58,
        "section": "같은 조건으로 밝기를 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "multiple",
       "bookQuestionId": "c22-s62-u03-w058",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T16",
        "format": "복수 선택",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "같은 조건으로 밝기를 비교해요",
        "concept": "공정한 밝기 비교와 측정 자료",
        "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
       },
       "prompt": "연습표만으로는 확인했다고 말할 수 없는 내용을 고르세요. (정답 3개)",
       "givens": {
        "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
        "자료표": {
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
        }
       },
       "choices": [
        "모든 전구에서 정확히 두 배 밝다.",
        "이 표의 두 전지 표시가 더 높다.",
        "1회 한 전지 표시는31 lx이다.",
        "우리 반이 실제로 같은 값을 측정했다.",
        "세 전지를 연결해도 안전하다."
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
       "answerContract": {
        "type": "multi-choice",
        "answers": [
         0,
         3,
         4
        ],
        "seasonContract": {
         "kind": "multi-choice",
         "teacherRequired": false,
         "answers": [
          0,
          3,
          4
         ]
        }
       },
       "explanation": "표 안의 수치와 대소 관계는 직접 읽을 수 있다. 모든 전구의 정확한 배수, 우리 반의 실측 여부, 세 전지의 안전성은 이 자료가 확인하지 않았다. 표가 알려 주는 정보와 과도한 일반화를 구별한다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "givens": {
    "조건": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "자료표": {
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
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "1": "M16",
     "2": "M16"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b059",
   "type": "T16",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 59,
    "section": "같은 조건으로 밝기를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w059",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T16",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "같은 조건으로 밝기를 비교해요",
    "concept": "공정한 밝기 비교와 측정 자료",
    "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
   },
   "prompt": "세 번의 평균 표시를 구해 (1)한 전지 (2)두 전지 순서로 단위와 함께 쓰세요.",
   "givens": {
    "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "자료표": {
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
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "32lx / 52lx",
    "accepted": [
     "32lx / 52lx"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "한 전지는 (31+33+32)÷3=32 lx, 두 전지는 (50+54+52)÷3=52 lx예요. 같은 위치에서 읽은 세 값의 평균이지 전구의 전력이나 모든 방향의 빛을 잰 값은 아니에요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "verificationModel": {
    "kind": "brightness-means",
    "model": "brightness"
   },
   "workbookRef": {
    "id": "c22-s62-u03-w059",
    "no": 59
   },
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": {
     "any": "M16"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b059",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 59,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w059",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "세 번의 평균 표시를 구해 (1)한 전지 (2)두 전지 순서로 단위와 함께 쓰세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "32lx / 52lx",
      "accepted": [
       "32lx / 52lx"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "한 전지는(31+33+32)÷3=32 lx, 두 전지는(50+54+52)÷3=52 lx이다. 평균은 같은 위치의 세 표시를 요약한 값이다. 전구의 소비 전력이나 모든 방향의 총 빛을 계산한 것이 아니다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "brightness-means",
      "model": "brightness"
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b059",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 59,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w059",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "세 번의 평균 표시를 구해 (1)한 전지 (2)두 전지 순서로 단위와 함께 쓰세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      "문항": {
       "머리": [
        "문항"
       ],
       "행": [
        [
         "(1) · 단위도 써요."
        ],
        [
         "(2) · 단위도 써요."
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "32lx / 52lx",
      "accepted": [
       "32lx / 52lx"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "한 전지는(31+33+32)÷3=32 lx, 두 전지는(50+54+52)÷3=52 lx이다. 평균은 같은 위치의 세 표시를 요약한 값이다. 전구의 소비 전력이나 모든 방향의 총 빛을 계산한 것이 아니다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "brightness-means",
      "model": "brightness"
     },
     "workbookRef": {
      "id": "c22-s62-u03-w059",
      "no": 59
     },
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": {
       "any": "M16"
      },
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b059",
       "type": "T16",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 59,
        "section": "같은 조건으로 밝기를 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "data",
       "bookQuestionId": "c22-s62-u03-w059",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T16",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "같은 조건으로 밝기를 비교해요",
        "concept": "공정한 밝기 비교와 측정 자료",
        "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
       },
       "prompt": "세 번의 평균 표시를 구해 (1)한 전지 (2)두 전지 순서로 단위와 함께 쓰세요.",
       "givens": {
        "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
        "자료표": {
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
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "32lx / 52lx",
        "accepted": [
         "32lx / 52lx"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "한 전지는(31+33+32)÷3=32 lx, 두 전지는(50+54+52)÷3=52 lx이다. 평균은 같은 위치의 세 표시를 요약한 값이다. 전구의 소비 전력이나 모든 방향의 총 빛을 계산한 것이 아니다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "verificationModel": {
        "kind": "brightness-means",
        "model": "brightness"
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "givens": {
    "조건": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "자료표": {
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
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": {
     "any": "M16"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b060",
   "type": "T16",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 60,
    "section": "같은 조건으로 밝기를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w060",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T16",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "같은 조건으로 밝기를 비교해요",
    "concept": "공정한 밝기 비교와 측정 자료",
    "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
   },
   "prompt": "표에서 (1)두 평균 표시의 차이 (2)두 전지 표시가 더 높은 반복 수를 단위와 함께 쓰세요.",
   "givens": {
    "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
    "자료표": {
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
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "20lx / 3회",
    "accepted": [
     "20lx / 3회"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "평균의 차는 52−32=20 lx예요. 세 번 모두 두 전지 쪽이 높으므로 3회예요. 각각의 차가 19, 21, 20 lx라고 다르게 나와도 기록을 그대로 남겨요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "verificationModel": {
    "kind": "brightness-comparison",
    "model": "brightness"
   },
   "workbookRef": {
    "id": "c22-s62-u03-w060",
    "no": 60
   },
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": {
     "any": "M16"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b060",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 60,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w060",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "표에서 (1)두 평균 표시의 차이 (2)두 전지 표시가 더 높은 반복 수를 단위와 함께 쓰세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "20lx / 3회",
      "accepted": [
       "20lx / 3회"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "평균52−32=20 lx이고 각 열에서 두 전지 값이 더 높으므로3회이다. 반복별 차이는19·21·20 lx로 모두 똑같지는 않다. 이런 차이를 지우거나 정확한 정비례로 바꾸지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "brightness-comparison",
      "model": "brightness"
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b060",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 60,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w060",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "표에서 (1)두 평균 표시의 차이 (2)두 전지 표시가 더 높은 반복 수를 단위와 함께 쓰세요.",
     "givens": {
      "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
      "자료표": {
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
      "문항": {
       "머리": [
        "문항"
       ],
       "행": [
        [
         "(1) · 단위도 써요."
        ],
        [
         "(2) · 단위도 써요."
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "20lx / 3회",
      "accepted": [
       "20lx / 3회"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "평균52−32=20 lx이고 각 열에서 두 전지 값이 더 높으므로3회이다. 반복별 차이는19·21·20 lx로 모두 똑같지는 않다. 이런 차이를 지우거나 정확한 정비례로 바꾸지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "brightness-comparison",
      "model": "brightness"
     },
     "workbookRef": {
      "id": "c22-s62-u03-w060",
      "no": 60
     },
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": {
       "any": "M16"
      },
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b060",
       "type": "T16",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 60,
        "section": "같은 조건으로 밝기를 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "data",
       "bookQuestionId": "c22-s62-u03-w060",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T16",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "같은 조건으로 밝기를 비교해요",
        "concept": "공정한 밝기 비교와 측정 자료",
        "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
       },
       "prompt": "표에서 (1)두 평균 표시의 차이 (2)두 전지 표시가 더 높은 반복 수를 단위와 함께 쓰세요.",
       "givens": {
        "조건": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 한 줄로 이어 돕게 연결한다. 두 조건에 모두 맞는 정격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
        "자료표": {
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
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "20lx / 3회",
        "accepted": [
         "20lx / 3회"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "평균52−32=20 lx이고 각 열에서 두 전지 값이 더 높으므로3회이다. 반복별 차이는19·21·20 lx로 모두 똑같지는 않다. 이런 차이를 지우거나 정확한 정비례로 바꾸지 않는다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "verificationModel": {
        "kind": "brightness-comparison",
        "model": "brightness"
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 종류·상태의 새 전지와 같은 정상 필라멘트 전구 하나를 쓴다. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결한다. 두 조건에 모두 맞는 규격이며 전구·전선·접점·관찰 위치를 유지한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다. 같은 위치의 밝기 센서 표시이며 전구의 전력·모든 방향의 빛을 측정한 값은 아니다.",
   "givens": {
    "조건": "같은 종류와 사용 상태의 새 전지, 같은 정상 필라멘트 전구 하나를 써요. 두 전지는 가운데에서 서로 다른 극끼리 이어 직렬연결해요. 두 경우 모두 함께 써도 되는 규격이며 전구·전선·접점·보는 위치는 같게 해요. 선생님이 만든 연습 기록으로, 우리가 직접 잰 값은 아니에요. 같은 위치의 밝기 센서 표시를 읽어요. lx는 이 센서 표시에 쓰인 단위예요. 전구의 전력이나 모든 방향으로 나간 빛을 잰 값은 아니에요.",
    "자료표": {
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
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": {
     "any": "M16"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b062",
   "type": "T16",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 62,
    "section": "같은 조건으로 밝기를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "reason",
   "bookQuestionId": "c22-s62-u03-w062",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T16",
    "format": "까닭 설명",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "같은 조건으로 밝기를 비교해요",
    "concept": "공정한 밝기 비교와 측정 자료",
    "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
   },
   "prompt": "전선 길이를 두 조건에서 같게 두었습니다. 이것이 “길이는 밝기에 영향을 줄 수 없다”는 증거인가요?",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
    "required": [
     "통제한 조건과 시험한 조건을 구별한다.",
     "무영향이라는 절대 결론을 거부한다.",
     "별도 공정 비교를 제안한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "통제한 조건과 시험한 조건을 구별한다.",
      "무영향이라는 절대 결론을 거부한다.",
      "별도 공정 비교를 제안한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
     "required": [
      "통제한 조건과 시험한 조건을 구별한다.",
      "무영향이라는 절대 결론을 거부한다.",
      "별도 공정 비교를 제안한다."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "전선 길이를 같게 둔 것은 다른 까닭이 섞이지 않게 한 것이에요. 길이를 바꾸어 시험한 적은 없으므로 길이가 밝기에 영향을 줄 수 없다고 할 수는 없어요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b062",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 62,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "reason",
     "bookQuestionId": "c22-s62-u03-w062",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "전선 길이를 두 조건에서 같게 두었습니다. 이것이 “길이는 밝기에 영향을 줄 수 없다”는 증거인가요?",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "아니다. 길이를 바꾸지 않고 통제했을 뿐 길이의 영향을 시험하지 않았다. 그 영향을 보려면 길이 외의 조건을 맞춘 별도 비교가 필요하다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "통제한 조건과 시험한 조건을 구별한다.",
        "무영향이라는 절대 결론을 거부한다.",
        "별도 공정 비교를 제안한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "sample": "아니다. 길이를 바꾸지 않고 통제했을 뿐 길이의 영향을 시험하지 않았다. 그 영향을 보려면 길이 외의 조건을 맞춘 별도 비교가 필요하다.",
       "required": [
        "통제한 조건과 시험한 조건을 구별한다.",
        "무영향이라는 절대 결론을 거부한다.",
        "별도 공정 비교를 제안한다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "같게 둔 조건은 결과의 다른 원인을 줄이기 위한 것이다. 길고 가는 전선처럼 다른 조건에서 영향이 생길 수도 있다. 이번 자료가 다루지 않은 조건의 결과를 단정하지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
    "required": [
     "전선 길이를 같게 둔 비교와 길이를 바꾼 비교를 구별한다.",
     "이 자료에서 길이를 바꾸어 시험하지 않았으므로 길이가 영향을 주지 않는다고 정할 수 없음을 설명한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "전선 길이를 같게 둔 비교와 길이를 바꾼 비교를 구별한다.",
      "이 자료에서 길이를 바꾸어 시험하지 않았으므로 길이가 영향을 주지 않는다고 정할 수 없음을 설명한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "길이를 같게 두었을 뿐 길이를 바꿔 비교한 것은 아니에요. 길이에 따른 차이를 알려면 다른 조건은 같게 하고 길이를 바꾼 별도의 비교가 필요해요.",
     "required": [
      "전선 길이를 같게 둔 비교와 길이를 바꾼 비교를 구별한다.",
      "이 자료에서 길이를 바꾸어 시험하지 않았으므로 길이가 영향을 주지 않는다고 정할 수 없음을 설명한다."
     ],
     "exactStringScoring": false
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b063",
   "type": "T16",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 63,
    "section": "같은 조건으로 밝기를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w063",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T16",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "같은 조건으로 밝기를 비교해요",
    "concept": "공정한 밝기 비교와 측정 자료",
    "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
   },
   "prompt": "전지 한 개와 두 개의 밝기를 비교할 배치를 그리세요. 전구·관찰 위치와 같게 할 조건을 표시하세요.",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
    "required": [
     "전지 수 외의 조건을 맞춘다.",
     "관찰 위치와 방법을 표시한다.",
     "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "전지 수 외의 조건을 맞춘다.",
      "관찰 위치와 방법을 표시한다.",
      "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
     "required": [
      "전지 수 외의 조건을 맞춘다.",
      "관찰 위치와 방법을 표시한다.",
      "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "explanation": "전구와 보는 위치, 주변 밝기와 접촉 상태를 같게 표시해요. 전지 종류와 사용 상태, 허용 규격도 적어요. 실제로 보기 전에 밝기 결과를 미리 그려 넣지는 않아요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w063",
    "no": 63
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b063",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 63,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w063",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "전지 한 개와 두 개의 밝기를 비교할 배치를 그리세요. 전구·관찰 위치와 같게 할 조건을 표시하세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 정격을 메모한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "전지 수 외의 조건을 맞춘다.",
        "관찰 위치와 방법을 표시한다.",
        "허용 정격·교사 점검과 미관찰 상태를 남긴다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 정격을 메모한다.",
       "required": [
        "전지 수 외의 조건을 맞춘다.",
        "관찰 위치와 방법을 표시한다.",
        "허용 정격·교사 점검과 미관찰 상태를 남긴다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "배치 그림은 연결 그림만 그리는 과제보다 관찰 조건의 통제가 중요하다. 전구 여러 개의 연결 비교로 확장하지 않는다. 실제 실행 전에는 결과를 미리 그려 넣지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b063",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 63,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w063",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "전지 한 개와 두 개의 밝기를 비교할 배치를 그리세요. 전구·관찰 위치와 같게 할 조건을 표시하세요.",
     "givens": null,
     "choices": null,
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
      "required": [
       "전지 수 외의 조건을 맞춘다.",
       "관찰 위치와 방법을 표시한다.",
       "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
      ],
      "exactStringScoring": false
     },
     "answerContract": {
      "type": "written-explanation",
      "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "전지 수 외의 조건을 맞춘다.",
        "관찰 위치와 방법을 표시한다.",
        "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
       "required": [
        "전지 수 외의 조건을 맞춘다.",
        "관찰 위치와 방법을 표시한다.",
        "허용 규격·교사 점검과 관찰하지 못함 상태를 남긴다."
       ],
       "exactStringScoring": false
      },
      "reviewRequired": true
     },
     "explanation": "배치 그림은 연결 그림만 그리는 과제보다 관찰 조건의 통제가 중요하다. 전구 여러 개의 연결 비교로 확장하지 않는다. 실제 실행 전에는 결과를 미리 그려 넣지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w063",
      "no": 63
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b063",
       "type": "T16",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 63,
        "section": "같은 조건으로 밝기를 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "draw-design",
       "bookQuestionId": "c22-s62-u03-w063",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T16",
        "format": "그림·설계",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "같은 조건으로 밝기를 비교해요",
        "concept": "공정한 밝기 비교와 측정 자료",
        "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
       },
       "prompt": "전지 한 개와 두 개의 밝기를 비교할 배치를 그리세요. 전구·관찰 위치와 같게 할 조건을 표시하세요.",
       "givens": null,
       "choices": null,
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
       "answerContract": {
        "type": "written-explanation",
        "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 정격을 메모한다.",
        "teacherRequired": true,
        "rubric": {
         "required": [
          "전지 수 외의 조건을 맞춘다.",
          "관찰 위치와 방법을 표시한다.",
          "허용 정격·교사 점검과 미관찰 상태를 남긴다."
         ],
         "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
         "kind": "drawing",
         "teacherRequired": true,
         "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 정격을 메모한다.",
         "required": [
          "전지 수 외의 조건을 맞춘다.",
          "관찰 위치와 방법을 표시한다.",
          "허용 정격·교사 점검과 미관찰 상태를 남긴다."
         ],
         "exactStringScoring": false
        }
       },
       "explanation": "배치 그림은 연결 그림만 그리는 과제보다 관찰 조건의 통제가 중요하다. 전구 여러 개의 연결 비교로 확장하지 않는다. 실제 실행 전에는 결과를 미리 그려 넣지 않는다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
    "required": [
     "비교할 전지 수와 그 밖에 같게 할 조건을 표시한다.",
     "같은 전구·관찰 위치·주변 밝기·접촉 상태를 나타낸다.",
     "허용된 부품으로 비교할 수 있는 배치를 그린다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "비교할 전지 수와 그 밖에 같게 할 조건을 표시한다.",
      "같은 전구·관찰 위치·주변 밝기·접촉 상태를 나타낸다.",
      "허용된 부품으로 비교할 수 있는 배치를 그린다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "같은 전구를 번갈아 쓰거나 같은 규격 장치를 점검한 비교, 고정된 관찰 위치·주변 밝기·접점 상태를 표시한다. 전지 종류·상태와 허용 규격을 메모한다.",
     "required": [
      "비교할 전지 수와 그 밖에 같게 할 조건을 표시한다.",
      "같은 전구·관찰 위치·주변 밝기·접촉 상태를 나타낸다.",
      "허용된 부품으로 비교할 수 있는 배치를 그린다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b064",
   "type": "T16",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 64,
    "section": "같은 조건으로 밝기를 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w064",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T16",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-02",
    "topic": "같은 조건으로 밝기를 비교해요",
    "concept": "공정한 밝기 비교와 측정 자료",
    "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
   },
   "prompt": "전지 한 개와 두 개를 세 번씩 비교할 빈 표를 그리세요. 제공 자료와 직접 본 결과, 같게 한 조건과 더 확인할 점을 적을 칸을 만드세요.",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
    "required": [
     "반복과 두 조건을 구별한다.",
     "자료 종류와 통제 조건 칸을 둔다.",
     "결과를 예시값으로 미리 채우지 않는다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "반복과 두 조건을 구별한다.",
      "자료 종류와 통제 조건 칸을 둔다.",
      "결과를 예시값으로 미리 채우지 않는다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
     "required": [
      "반복과 두 조건을 구별한다.",
      "자료 종류와 통제 조건 칸을 둔다.",
      "결과를 예시값으로 미리 채우지 않는다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "explanation": "한 전지와 두 전지, 세 번씩의 기록 칸을 만들어요. 어떤 자료인지와 접촉·위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 관찰하지 않은 숫자는 비워 두어요.",
   "standards": [
    "6과15-02"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w064",
    "no": 64
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b064",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 64,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w064",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "세 번씩 비교할 빈 기록표를 설계하세요. 제공 자료와 실제 관찰을 구별하고 결론의 한계를 적을 칸도 만드세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·미관찰·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "반복과 두 조건을 구별한다.",
        "자료 종류와 통제 조건 칸을 둔다.",
        "결과를 예시값으로 미리 채우지 않는다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·미관찰·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
       "required": [
        "반복과 두 조건을 구별한다.",
        "자료 종류와 통제 조건 칸을 둔다.",
        "결과를 예시값으로 미리 채우지 않는다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "빈 표의 구조가 관찰 방법을 담아야 한다. 숫자만 모은 표보다 자료 종류와 조건·한계를 남길 공간이 필요하다. 예시 표를 베껴 실측 기록으로 만드는 것은 인정하지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b064",
     "type": "T16",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 64,
      "section": "같은 조건으로 밝기를 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w064",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T16",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-02",
      "topic": "같은 조건으로 밝기를 비교해요",
      "concept": "공정한 밝기 비교와 측정 자료",
      "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
     },
     "prompt": "세 번씩 비교할 빈 기록표를 설계하세요. 제공 자료와 실제 관찰을 구별하고 결론의 한계를 적을 칸도 만드세요.",
     "givens": null,
     "choices": null,
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·관찰하지 못함·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
      "required": [
       "반복과 두 조건을 구별한다.",
       "자료 종류와 통제 조건 칸을 둔다.",
       "결과를 예시값으로 미리 채우지 않는다."
      ],
      "exactStringScoring": false
     },
     "answerContract": {
      "type": "written-explanation",
      "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·관찰하지 못함·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "반복과 두 조건을 구별한다.",
        "자료 종류와 통제 조건 칸을 둔다.",
        "결과를 예시값으로 미리 채우지 않는다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·관찰하지 못함·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
       "required": [
        "반복과 두 조건을 구별한다.",
        "자료 종류와 통제 조건 칸을 둔다.",
        "결과를 예시값으로 미리 채우지 않는다."
       ],
       "exactStringScoring": false
      },
      "reviewRequired": true
     },
     "explanation": "빈 표의 구조가 관찰 방법을 담아야 한다. 숫자만 모은 표보다 자료 종류와 조건·한계를 남길 공간이 필요하다. 예시 표를 베껴 실측 기록으로 만드는 것은 인정하지 않는다.",
     "standards": [
      "6과15-02"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w064",
      "no": 64
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b064",
       "type": "T16",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 64,
        "section": "같은 조건으로 밝기를 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "draw-design",
       "bookQuestionId": "c22-s62-u03-w064",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T16",
        "format": "그림·설계",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-02",
        "topic": "같은 조건으로 밝기를 비교해요",
        "concept": "공정한 밝기 비교와 측정 자료",
        "inquirySkill": "통제 조건·반복 수치·관찰 범위로 설명한다."
       },
       "prompt": "세 번씩 비교할 빈 기록표를 설계하세요. 제공 자료와 실제 관찰을 구별하고 결론의 한계를 적을 칸도 만드세요.",
       "givens": null,
       "choices": null,
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
       "answerContract": {
        "type": "written-explanation",
        "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·미관찰·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
        "teacherRequired": true,
        "rubric": {
         "required": [
          "반복과 두 조건을 구별한다.",
          "자료 종류와 통제 조건 칸을 둔다.",
          "결과를 예시값으로 미리 채우지 않는다."
         ],
         "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
         "kind": "drawing",
         "teacherRequired": true,
         "sample": "한개/두개 두 행과1·2·3회 열, 자료 종류·접촉/위치 조건·미관찰·결론의 범위 칸을 만든다. 실제 관찰 전 숫자는 비워 둔다.",
         "required": [
          "반복과 두 조건을 구별한다.",
          "자료 종류와 통제 조건 칸을 둔다.",
          "결과를 예시값으로 미리 채우지 않는다."
         ],
         "exactStringScoring": false
        }
       },
       "explanation": "빈 표의 구조가 관찰 방법을 담아야 한다. 숫자만 모은 표보다 자료 종류와 조건·한계를 남길 공간이 필요하다. 예시 표를 베껴 실측 기록으로 만드는 것은 인정하지 않는다.",
       "standards": [
        "6과15-02"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
    "required": [
     "전지 한 개와 두 개를 세 번씩 비교할 빈 칸을 만든다.",
     "제공 자료와 직접 관찰한 결과를 구별할 칸을 둔다.",
     "같게 한 조건과 더 확인할 점을 적을 칸을 만든다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "전지 한 개와 두 개를 세 번씩 비교할 빈 칸을 만든다.",
      "제공 자료와 직접 관찰한 결과를 구별할 칸을 둔다.",
      "같게 한 조건과 더 확인할 점을 적을 칸을 만든다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "한 전지와 두 전지를 두 줄에 놓고 1·2·3회 칸을 만들어요. 어떤 자료인지, 접촉과 위치 조건, 보지 못한 것과 알게 된 점도 적을 칸을 두어요. 아직 보지 않은 숫자는 비워 두어요.",
     "required": [
      "전지 한 개와 두 개를 세 번씩 비교할 빈 칸을 만든다.",
      "제공 자료와 직접 관찰한 결과를 구별할 칸을 둔다.",
      "같게 한 조건과 더 확인할 점을 적을 칸을 만든다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b065",
   "type": "T08",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 65,
    "section": "전자석을 만들어 연결 전후를 관찰해요",
    "originalExam": false
   },
   "bookResponseForm": "single",
   "bookQuestionId": "c22-s62-u03-w065",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T08",
    "format": "객관식",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "concept": "전자석 제작과 접점 준비",
    "inquirySkill": "전자석 제작과 접점 준비"
   },
   "prompt": "코일을 만드는 방법으로 알맞은 것을 고르세요.",
   "givens": {
    "조건": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
   },
   "choices": [
    "전선 전체 피복을 불로 태운다.",
    "감긴 부분의 절연을 유지한다.",
    "철심을 가열한 채 손으로 감는다.",
    "모든 코일선을 서로 금속 접촉시킨다.",
    "전원을 켠 상태에서 감긴 선을 바꾼다."
   ],
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "answerContract": {
    "type": "single-choice",
    "answer": 1,
    "seasonContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 1
    }
   },
   "explanation": "철심에 감긴 부분은 절연을 유지하고 양 끝의 금속 접점은 선생님이 준비해요. 그래서 ②예요. 학생이 피복을 태우거나 철심을 가열하지 않고 부품 규격과 켜 두는 시간을 확인해요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w065",
    "no": 65
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "0": "M08",
     "2": "M08",
     "3": "M08",
     "4": "M08"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b065",
     "type": "T08",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 65,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w065",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T08",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비"
     },
     "prompt": "코일을 만드는 방법으로 알맞은 것을 고르세요.",
     "givens": {
      "조건": "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
     },
     "choices": [
      "전선 전체 피복을 불로 태운다.",
      "감긴 부분의 절연을 유지한다.",
      "철심을 가열한 채 손으로 감는다.",
      "모든 코일선을 서로 금속 접촉시킨다.",
      "전원을 켠 상태에서 감긴 선을 바꾼다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 1
      }
     },
     "explanation": "코일의 감긴 부분은 절연을 유지하고 두 끝의 접점만 교사가 준비한다. 학생이 피복을 태우거나 철심을 가열하지 않는다. 지정된 교육용 부품의 정격·통전 시간 확인도 필요하다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b065",
     "type": "T08",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 65,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w065",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T08",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비"
     },
     "prompt": "코일을 만드는 방법으로 알맞은 것을 고르세요.",
     "givens": {
      "조건": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
     },
     "choices": [
      "전선 전체 피복을 불로 태운다.",
      "감긴 부분의 절연을 유지한다.",
      "철심을 가열한 채 손으로 감는다.",
      "모든 코일선을 서로 금속 접촉시킨다.",
      "전원을 켠 상태에서 감긴 선을 바꾼다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 1
      }
     },
     "explanation": "코일의 감긴 부분은 절연을 유지하고 두 끝의 접점만 교사가 준비한다. 학생이 피복을 태우거나 철심을 가열하지 않는다. 지정된 교육용 부품의 규격·전류가 흐르는 시간 확인도 필요하다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w065",
      "no": 65
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "0": "M08",
       "2": "M08",
       "3": "M08",
       "4": "M08"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b065",
       "type": "T08",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 65,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "single",
       "bookQuestionId": "c22-s62-u03-w065",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T08",
        "format": "객관식",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석 제작과 접점 준비",
        "inquirySkill": "전자석 제작과 접점 준비"
       },
       "prompt": "코일을 만드는 방법으로 알맞은 것을 고르세요.",
       "givens": {
        "조건": "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
       },
       "choices": [
        "전선 전체 피복을 불로 태운다.",
        "감긴 부분의 절연을 유지한다.",
        "철심을 가열한 채 손으로 감는다.",
        "모든 코일선을 서로 금속 접촉시킨다.",
        "전원을 켠 상태에서 감긴 선을 바꾼다."
       ],
       "responseContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
       },
       "answerContract": {
        "type": "single-choice",
        "answer": 1,
        "seasonContract": {
         "kind": "single-choice",
         "teacherRequired": false,
         "answer": 1
        }
       },
       "explanation": "코일의 감긴 부분은 절연을 유지하고 두 끝의 접점만 교사가 준비한다. 학생이 피복을 태우거나 철심을 가열하지 않는다. 지정된 교육용 부품의 정격·통전 시간 확인도 필요하다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
   "givens": {
    "조건": "이 문제에서는 선생님이 규격과 정상 상태, 사용할 시간을 확인한 낮은 전압의 교육용 부품을 쓴다고 정했어요. 연결을 바꿀 때는 전원을 분리하고 점검받아요. 전지의 +극과 −극을 전선만으로 직접 잇지 않아요."
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "0": "M08",
     "2": "M08",
     "3": "M08",
     "4": "M08"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b066",
   "type": "T09",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 66,
    "section": "전자석을 만들어 연결 전후를 관찰해요",
    "originalExam": false
   },
   "bookResponseForm": "single",
   "bookQuestionId": "c22-s62-u03-w066",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T09",
    "format": "객관식",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "concept": "전자석과 영구 자석 비교",
    "inquirySkill": "전자석과 영구 자석 비교"
   },
   "prompt": "전지를 분리했는데 클립 한 개가 남았어요. 알맞은 설명을 고르세요.",
   "givens": {
    "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
    "자료표": {
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
       "전지를 연결했을 때",
       "6개"
      ],
      [
       "전원 분리 뒤",
       "1개"
      ]
     ]
    }
   },
   "choices": [
    "전류가 반드시 계속 흐르는 증거다.",
    "철심이 항상 같은 세기인 증거다.",
    "클립이 없어야 하므로 기록을 지운다.",
    "철심을 불로 가열해 답에 맞춘다.",
    "철심에 약한 자성이 남을 수 있다."
   ],
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 4
   },
   "answerContract": {
    "type": "single-choice",
    "answer": 4,
    "seasonContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 4
    }
   },
   "explanation": "전지를 분리해도 철심에 약한 자성이 남을 수 있으므로 ⑤예요. 클립 한 개가 남았다는 기록을 지우지 않아요. 이것만으로 전류가 계속 흐르거나 세기가 그대로라고 할 수는 없어요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b066",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 66,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w066",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "전원을 분리한 뒤 클립 한 개가 남았습니다. 타당한 설명을 고르세요.",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
      }
     },
     "choices": [
      "전류가 반드시 계속 흐르는 증거다.",
      "철심이 항상 같은 세기인 증거다.",
      "클립이 없어야 하므로 기록을 지운다.",
      "철심을 불로 가열해 답에 맞춘다.",
      "철심에 약한 자성이 남을 수 있다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 4
      }
     },
     "explanation": "전원 분리 뒤에도 철심에 약한 자성이 남을 수 있다. 클립 한 개가 남았다는 관찰을 그대로 기록한다. 그 사실만으로 전류가 계속 흐르거나 항상 같은 세기라고 할 수는 없다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b066",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 66,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w066",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "전원을 분리한 뒤 클립 한 개가 남았습니다. 타당한 설명을 고르세요.",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
         "전지를 연결했을 때",
         "6개"
        ],
        [
         "전원 분리 뒤",
         "1개"
        ]
       ]
      }
     },
     "choices": [
      "전류가 반드시 계속 흐르는 증거다.",
      "철심이 항상 같은 세기인 증거다.",
      "클립이 없어야 하므로 기록을 지운다.",
      "철심을 불로 가열해 답에 맞춘다.",
      "철심에 약한 자성이 남을 수 있다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 4
      }
     },
     "explanation": "전원 분리 뒤에도 철심에 약한 자성이 남을 수 있다. 클립 한 개가 남았다는 관찰을 그대로 기록한다. 그 사실만으로 전류가 계속 흐르거나 항상 같은 세기라고 할 수는 없다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "contentVersion": "20261104-student-science-language",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b066",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 66,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "single",
       "bookQuestionId": "c22-s62-u03-w066",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "객관식",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "전원을 분리한 뒤 클립 한 개가 남았습니다. 타당한 설명을 고르세요.",
       "givens": {
        "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
        "자료표": {
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
        }
       },
       "choices": [
        "전류가 반드시 계속 흐르는 증거다.",
        "철심이 항상 같은 세기인 증거다.",
        "클립이 없어야 하므로 기록을 지운다.",
        "철심을 불로 가열해 답에 맞춘다.",
        "철심에 약한 자성이 남을 수 있다."
       ],
       "responseContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
       },
       "answerContract": {
        "type": "single-choice",
        "answer": 4,
        "seasonContract": {
         "kind": "single-choice",
         "teacherRequired": false,
         "answer": 4
        }
       },
       "explanation": "전원 분리 뒤에도 철심에 약한 자성이 남을 수 있다. 클립 한 개가 남았다는 관찰을 그대로 기록한다. 그 사실만으로 전류가 계속 흐르거나 항상 같은 세기라고 할 수는 없다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-student-science-language"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
   "givens": {
    "조건": "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요.",
    "자료표": {
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
       "전지를 연결했을 때",
       "6개"
      ],
      [
       "전원 분리 뒤",
       "1개"
      ]
     ]
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b074",
   "type": "T09",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 74,
    "section": "전자석을 만들어 연결 전후를 관찰해요",
    "originalExam": false
   },
   "bookResponseForm": "multiple",
   "bookQuestionId": "c22-s62-u03-w074",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T09",
    "format": "복수 선택",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "concept": "전자석과 영구 자석 비교",
    "inquirySkill": "전자석과 영구 자석 비교"
   },
   "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
   "givens": {
    "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
    "자료표": {
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
       "전지를 연결했을 때",
       "6개"
      ],
      [
       "전원 분리 뒤",
       "1개"
      ]
     ]
    }
   },
   "choices": [
    "아직 보지 않은 결과를 미리 실측으로 적었다.",
    "연결 전에는 붙은 클립이 없었다.",
    "전지를 연결했을 때 가장 많이 붙었다.",
    "분리 뒤에도 한 개가 남았다.",
    "분리 뒤에도 세기는 전류가 흐르는 동안과 똑같았다."
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
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     1,
     2,
     3
    ],
    "seasonContract": {
     "kind": "multi-choice",
     "teacherRequired": false,
     "answers": [
      1,
      2,
      3
     ]
    }
   },
   "explanation": "처음 0개, 전지 연결 동안 6개, 분리 뒤 1개예요. 따라서 ②, ③, ④예요. 분리 뒤의 작용이 연결 동안과 같은 것은 아니에요. 이 표는 연습용 자료예요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w074",
    "no": 74
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "0": "M09",
     "4": "M09"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b074",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 74,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w074",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
      }
     },
     "choices": [
      "아직 보지 않은 결과를 미리 실측으로 적었다.",
      "연결 전에는 붙은 클립이 없었다.",
      "전류를 켠 때 가장 많이 붙었다.",
      "분리 뒤에도 한 개가 남았다.",
      "분리 뒤에도 세기는 통전 중과 똑같았다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       1,
       2,
       3
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        1,
        2,
        3
       ]
      }
     },
     "explanation": "0·6·1개라는 기록에서 처음 없음, 통전 중 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 통전 중과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b074",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 74,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w074",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
      }
     },
     "choices": [
      "아직 보지 않은 결과를 미리 실측으로 적었다.",
      "연결 전에는 붙은 클립이 없었다.",
      "전류를 켠 때 가장 많이 붙었다.",
      "분리 뒤에도 한 개가 남았다.",
      "분리 뒤에도 세기는 전류가 흐르는 동안과 똑같았다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       1,
       2,
       3
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        1,
        2,
        3
       ]
      }
     },
     "explanation": "0·6·1개라는 기록에서 처음 없음, 전류가 흐르는 동안 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 전류가 흐르는 동안과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w074",
      "no": 74
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "0": "M09",
       "4": "M09"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b074",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 74,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "multiple",
       "bookQuestionId": "c22-s62-u03-w074",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "복수 선택",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
       "givens": {
        "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
        "자료표": {
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
        }
       },
       "choices": [
        "아직 보지 않은 결과를 미리 실측으로 적었다.",
        "연결 전에는 붙은 클립이 없었다.",
        "전류를 켠 때 가장 많이 붙었다.",
        "분리 뒤에도 한 개가 남았다.",
        "분리 뒤에도 세기는 통전 중과 똑같았다."
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
       "answerContract": {
        "type": "multi-choice",
        "answers": [
         1,
         2,
         3
        ],
        "seasonContract": {
         "kind": "multi-choice",
         "teacherRequired": false,
         "answers": [
          1,
          2,
          3
         ]
        }
       },
       "explanation": "0·6·1개라는 기록에서 처음 없음, 통전 중 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 통전 중과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    },
    {
     "id": "c22-s62-u03-b074",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 74,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w074",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
         "전지를 연결했을 때",
         "6개"
        ],
        [
         "전원 분리 뒤",
         "1개"
        ]
       ]
      }
     },
     "choices": [
      "아직 보지 않은 결과를 미리 실측으로 적었다.",
      "연결 전에는 붙은 클립이 없었다.",
      "전지를 연결했을 때 가장 많이 붙었다.",
      "분리 뒤에도 한 개가 남았다.",
      "분리 뒤에도 세기는 전류가 흐르는 동안과 똑같았다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       1,
       2,
       3
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        1,
        2,
        3
       ]
      }
     },
     "explanation": "0·6·1개라는 기록에서 처음 없음, 전류가 흐르는 동안 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 전류가 흐르는 동안과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w074",
      "no": 74
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-student-science-language",
      "typed": null,
      "distractors": {
       "0": "M09",
       "4": "M09"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-student-science-language",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b074",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 74,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "multiple",
       "bookQuestionId": "c22-s62-u03-w074",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "복수 선택",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
       "givens": {
        "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
        "자료표": {
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
        }
       },
       "choices": [
        "아직 보지 않은 결과를 미리 실측으로 적었다.",
        "연결 전에는 붙은 클립이 없었다.",
        "전류를 켠 때 가장 많이 붙었다.",
        "분리 뒤에도 한 개가 남았다.",
        "분리 뒤에도 세기는 통전 중과 똑같았다."
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
       "answerContract": {
        "type": "multi-choice",
        "answers": [
         1,
         2,
         3
        ],
        "seasonContract": {
         "kind": "multi-choice",
         "teacherRequired": false,
         "answers": [
          1,
          2,
          3
         ]
        }
       },
       "explanation": "0·6·1개라는 기록에서 처음 없음, 통전 중 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 통전 중과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      },
      {
       "id": "c22-s62-u03-b074",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 74,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "multiple",
       "bookQuestionId": "c22-s62-u03-w074",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "복수 선택",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
       "givens": {
        "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
        "자료표": {
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
        }
       },
       "choices": [
        "아직 보지 않은 결과를 미리 실측으로 적었다.",
        "연결 전에는 붙은 클립이 없었다.",
        "전류를 켠 때 가장 많이 붙었다.",
        "분리 뒤에도 한 개가 남았다.",
        "분리 뒤에도 세기는 전류가 흐르는 동안과 똑같았다."
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
       "answerContract": {
        "type": "multi-choice",
        "answers": [
         1,
         2,
         3
        ],
        "seasonContract": {
         "kind": "multi-choice",
         "teacherRequired": false,
         "answers": [
          1,
          2,
          3
         ]
        }
       },
       "explanation": "0·6·1개라는 기록에서 처음 없음, 전류가 흐르는 동안 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 전류가 흐르는 동안과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "workbookRef": {
        "id": "c22-s62-u03-w074",
        "no": 74
       },
       "verificationModel": null,
       "diagnosticOverride": {
        "version": "20261104-electricity-book",
        "typed": null,
        "distractors": {
         "0": "M09",
         "4": "M09"
        },
        "cloze": null,
        "cells": null
       },
       "contentVersion": "20261104-electricity-book",
       "previousVersions": [
        {
         "id": "c22-s62-u03-b074",
         "type": "T09",
         "status": "authored",
         "sourceRef": {
          "type": "authored-supplement",
          "label": "현행 범위 독립 창작",
          "bookNo": 74,
          "section": "전자석을 만들어 연결 전후를 관찰해요",
          "originalExam": false
         },
         "bookResponseForm": "multiple",
         "bookQuestionId": "c22-s62-u03-w074",
         "taxonomy": {
          "curriculum": "2022 개정",
          "grade": 6,
          "semester": 2,
          "unit": "u03",
          "area": "운동과 에너지",
          "element": "E5",
          "type": "T09",
          "format": "복수 선택",
          "level": "기본",
          "track": "교과",
          "standard": "6과15-03",
          "topic": "전자석을 만들어 연결 전후를 관찰해요",
          "concept": "전자석과 영구 자석 비교",
          "inquirySkill": "전자석과 영구 자석 비교"
         },
         "prompt": "세 시점 관찰을 바르게 읽은 것을 고르세요. (정답 3개)",
         "givens": {
          "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
          "자료표": {
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
          }
         },
         "choices": [
          "아직 보지 않은 결과를 미리 실측으로 적었다.",
          "연결 전에는 붙은 클립이 없었다.",
          "전류를 켠 때 가장 많이 붙었다.",
          "분리 뒤에도 한 개가 남았다.",
          "분리 뒤에도 세기는 통전 중과 똑같았다."
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
         "answerContract": {
          "type": "multi-choice",
          "answers": [
           1,
           2,
           3
          ],
          "seasonContract": {
           "kind": "multi-choice",
           "teacherRequired": false,
           "answers": [
            1,
            2,
            3
           ]
          }
         },
         "explanation": "0·6·1개라는 기록에서 처음 없음, 통전 중 최대, 분리 뒤 잔류를 읽을 수 있다. 분리 뒤가 통전 중과 같지 않다. 이 표 자체도 연습 자료이므로 실제 자기 관측이라고 바꾸지 않는다.",
         "standards": [
          "6과15-03"
         ],
         "originalPromptCopied": false,
         "originalFigureReused": false,
         "evidence": {
          "actualStudentObservation": false,
          "actualPhysicalExperiment": false,
          "dataKind": "authored-practice-or-explicit-model",
          "scienceReview": "manuscript; independent-answer-and-render-review-pending",
          "productRenderReviewed": false
         },
         "version": 1
        }
       ],
       "version": "20261104-electricity-book"
      }
     ],
     "version": "20261104-student-science-language"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
   "givens": {
    "조건": "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요.",
    "자료표": {
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
       "전지를 연결했을 때",
       "6개"
      ],
      [
       "전원 분리 뒤",
       "1개"
      ]
     ]
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "0": "M09",
     "4": "M09"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b075",
   "type": "T09",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 75,
    "section": "전자석을 만들어 연결 전후를 관찰해요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w075",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T09",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "concept": "전자석과 영구 자석 비교",
    "inquirySkill": "전자석과 영구 자석 비교"
   },
   "prompt": "표에서 (1)연결 전보다 전류가 흐르는 동안 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
   "givens": {
    "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
    "자료표": {
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
       "전지를 연결했을 때",
       "6개"
      ],
      [
       "전원 분리 뒤",
       "1개"
      ]
     ]
    },
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "6개 / 1개",
    "accepted": [
     "6개 / 1개"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "전지 연결 동안 늘어난 수는 6−0=6개, 분리 뒤 남은 수는 1개예요. 클립 수를 센 것이지 힘을 정확한 단위로 잰 값은 아니에요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "verificationModel": {
    "kind": "onoff-count-difference",
    "model": "magnetOnOff"
   },
   "workbookRef": {
    "id": "c22-s62-u03-w075",
    "no": 75
   },
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": {
     "any": "M09"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b075",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 75,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w075",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "표에서 (1)연결 전보다 통전 중 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "6개 / 1개",
      "accepted": [
       "6개 / 1개"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "onoff-count-difference",
      "model": "magnetOnOff"
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b075",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 75,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w075",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "표에서 (1)연결 전보다 전류가 흐르는 동안 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
      "문항": {
       "머리": [
        "문항"
       ],
       "행": [
        [
         "(1) · 단위도 써요."
        ],
        [
         "(2) · 단위도 써요."
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "6개 / 1개",
      "accepted": [
       "6개 / 1개"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "onoff-count-difference",
      "model": "magnetOnOff"
     },
     "workbookRef": {
      "id": "c22-s62-u03-w075",
      "no": 75
     },
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": {
       "any": "M09"
      },
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b075",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 75,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "data",
       "bookQuestionId": "c22-s62-u03-w075",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "표에서 (1)연결 전보다 통전 중 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
       "givens": {
        "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
        "자료표": {
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
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "6개 / 1개",
        "accepted": [
         "6개 / 1개"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "verificationModel": {
        "kind": "onoff-count-difference",
        "model": "magnetOnOff"
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    },
    {
     "id": "c22-s62-u03-b075",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 75,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w075",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "표에서 (1)연결 전보다 전류가 흐르는 동안 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
     "givens": {
      "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
      "자료표": {
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
         "전지를 연결했을 때",
         "6개"
        ],
        [
         "전원 분리 뒤",
         "1개"
        ]
       ]
      },
      "문항": {
       "머리": [
        "문항"
       ],
       "행": [
        [
         "(1) · 단위도 써요."
        ],
        [
         "(2) · 단위도 써요."
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "6개 / 1개",
      "accepted": [
       "6개 / 1개"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "onoff-count-difference",
      "model": "magnetOnOff"
     },
     "workbookRef": {
      "id": "c22-s62-u03-w075",
      "no": 75
     },
     "diagnosticOverride": {
      "version": "20261104-student-science-language",
      "typed": {
       "any": "M09"
      },
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-student-science-language",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b075",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 75,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "data",
       "bookQuestionId": "c22-s62-u03-w075",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "표에서 (1)연결 전보다 통전 중 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
       "givens": {
        "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
        "자료표": {
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
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "6개 / 1개",
        "accepted": [
         "6개 / 1개"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "verificationModel": {
        "kind": "onoff-count-difference",
        "model": "magnetOnOff"
       },
       "version": 1
      },
      {
       "id": "c22-s62-u03-b075",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 75,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "data",
       "bookQuestionId": "c22-s62-u03-w075",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "표에서 (1)연결 전보다 전류가 흐르는 동안 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
       "givens": {
        "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
        "자료표": {
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
        "문항": {
         "머리": [
          "문항"
         ],
         "행": [
          [
           "(1) · 단위도 써요."
          ],
          [
           "(2) · 단위도 써요."
          ]
         ]
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "6개 / 1개",
        "accepted": [
         "6개 / 1개"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "verificationModel": {
        "kind": "onoff-count-difference",
        "model": "magnetOnOff"
       },
       "workbookRef": {
        "id": "c22-s62-u03-w075",
        "no": 75
       },
       "diagnosticOverride": {
        "version": "20261104-electricity-book",
        "typed": {
         "any": "M09"
        },
        "distractors": null,
        "cloze": null,
        "cells": null
       },
       "contentVersion": "20261104-electricity-book",
       "previousVersions": [
        {
         "id": "c22-s62-u03-b075",
         "type": "T09",
         "status": "authored",
         "sourceRef": {
          "type": "authored-supplement",
          "label": "현행 범위 독립 창작",
          "bookNo": 75,
          "section": "전자석을 만들어 연결 전후를 관찰해요",
          "originalExam": false
         },
         "bookResponseForm": "data",
         "bookQuestionId": "c22-s62-u03-w075",
         "taxonomy": {
          "curriculum": "2022 개정",
          "grade": 6,
          "semester": 2,
          "unit": "u03",
          "area": "운동과 에너지",
          "element": "E5",
          "type": "T09",
          "format": "자료 해석",
          "level": "기본",
          "track": "교과",
          "standard": "6과15-03",
          "topic": "전자석을 만들어 연결 전후를 관찰해요",
          "concept": "전자석과 영구 자석 비교",
          "inquirySkill": "전자석과 영구 자석 비교"
         },
         "prompt": "표에서 (1)연결 전보다 통전 중 늘어난 클립 수 (2)분리 뒤 남은 수를 쓰세요.",
         "givens": {
          "조건": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
          "자료표": {
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
          }
         },
         "choices": null,
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
         "answerContract": {
          "type": "short-text",
          "answer": "6개 / 1개",
          "accepted": [
           "6개 / 1개"
          ],
          "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
          "seasonContract": {
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
          }
         },
         "explanation": "6−0=6개 늘었고 분리 뒤에는1개가 남았다. 늘어난 수와 분리 뒤 남은 수를 구별한다. 클립 수를 힘의 정확한 크기를 나타내는 값으로 바꾸어 말하지 않는다.",
         "standards": [
          "6과15-03"
         ],
         "originalPromptCopied": false,
         "originalFigureReused": false,
         "evidence": {
          "actualStudentObservation": false,
          "actualPhysicalExperiment": false,
          "dataKind": "authored-practice-or-explicit-model",
          "scienceReview": "manuscript; independent-answer-and-render-review-pending",
          "productRenderReviewed": false
         },
         "verificationModel": {
          "kind": "onoff-count-difference",
          "model": "magnetOnOff"
         },
         "version": 1
        }
       ],
       "version": "20261104-electricity-book"
      }
     ],
     "version": "20261104-student-science-language"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 철심·클립·접근 방법을 쓴 연습 기록이다. 분리 뒤의 철심을 가열하거나 두드리지 않는다.",
   "givens": {
    "조건": "같은 철심과 클립, 같은 대는 방법으로 비교한다고 정한 연습 기록이에요. 전지를 분리한 뒤 철심을 가열하거나 두드리지 않아요.",
    "자료표": {
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
       "전지를 연결했을 때",
       "6개"
      ],
      [
       "전원 분리 뒤",
       "1개"
      ]
     ]
    },
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": {
     "any": "M09"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b077",
   "type": "T09",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 77,
    "section": "전자석을 만들어 연결 전후를 관찰해요",
    "originalExam": false
   },
   "bookResponseForm": "reason",
   "bookQuestionId": "c22-s62-u03-w077",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T09",
    "format": "까닭 설명",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "concept": "전자석과 영구 자석 비교",
    "inquirySkill": "전자석과 영구 자석 비교"
   },
   "prompt": "전자석을 켠 동안만 보고 처음 철심의 상태는 보지 못했어요. 전후의 차이를 설명할 때 무엇을 알기 어려울까요?",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "처음부터 클립이 붙었는지 몰라요. 전지 연결 전의 철심을 같은 클립과 거리에서 보고 비교해야 전후에 달라진 점을 설명할 수 있어요.",
    "required": [
     "시작 상태가 없음을 읽는다.",
     "전후 차이 판단의 한계를 설명한다.",
     "같은 방법의 시작 비교를 제안한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "처음부터 클립이 붙었는지 몰라요. 전지 연결 전의 철심을 같은 클립과 거리에서 보고 비교해야 전후에 달라진 점을 설명할 수 있어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "시작 상태가 없음을 읽는다.",
      "전후 차이 판단의 한계를 설명한다.",
      "같은 방법의 시작 비교를 제안한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "처음부터 클립이 붙었는지 몰라요. 전지 연결 전의 철심을 같은 클립과 거리에서 보고 비교해야 전후에 달라진 점을 설명할 수 있어요.",
     "required": [
      "시작 상태가 없음을 읽는다.",
      "전후 차이 판단의 한계를 설명한다.",
      "같은 방법의 시작 비교를 제안한다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "explanation": "전지 연결 동안 붙었다는 기록은 남길 수 있어요. 하지만 처음 상태를 보지 않으면 처음부터 붙었는지 몰라요. 같은 클립과 거리에서 연결 전과 후를 비교해야 달라진 점을 설명할 수 있어요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w077",
    "no": 77
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b077",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 77,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "reason",
     "bookQuestionId": "c22-s62-u03-w077",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "철심의 시작 상태를 보지 않고 통전 중만 관찰했습니다. 어떤 설명에 한계가 생기나요?",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "처음부터 자성이 있었는지 알 수 없어 전류를 켜기 전후의 차이를 분리하기 어렵다. 전원이 분리된 시작 상태를 같은 클립·거리로 확인해 비교해야 한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "시작 상태가 없음을 읽는다.",
        "전후 차이 판단의 한계를 설명한다.",
        "같은 방법의 시작 비교를 제안한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "sample": "처음부터 자성이 있었는지 알 수 없어 전류를 켜기 전후의 차이를 분리하기 어렵다. 전원이 분리된 시작 상태를 같은 클립·거리로 확인해 비교해야 한다.",
       "required": [
        "시작 상태가 없음을 읽는다.",
        "전후 차이 판단의 한계를 설명한다.",
        "같은 방법의 시작 비교를 제안한다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "통전 중 클립이 붙었다는 관찰은 남길 수 있다. 그러나 처음에도 붙었는지 모르면 변화량이나 전류 연결 전후 차이를 정확히 설명하기 어렵다. 관찰 범위와 다음 확인을 나누어 적는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b077",
     "type": "T09",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 77,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "reason",
     "bookQuestionId": "c22-s62-u03-w077",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T09",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교"
     },
     "prompt": "철심의 시작 상태를 보지 않고 전류가 흐르는 동안만 관찰했습니다. 어떤 설명에 한계가 생기나요?",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "처음부터 자성이 있었는지 알 수 없어 전류를 켜기 전후의 차이를 분리하기 어렵다. 전원이 분리된 시작 상태를 같은 클립·거리로 확인해 비교해야 한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "시작 상태가 없음을 읽는다.",
        "전후 차이 판단의 한계를 설명한다.",
        "같은 방법의 시작 비교를 제안한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
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
      "reviewRequired": true
     },
     "explanation": "전류가 흐르는 동안 클립이 붙었다는 관찰은 남길 수 있다. 그러나 처음에도 붙었는지 모르면 변화량이나 전지 연결 전후 차이를 정확히 설명하기 어렵다. 관찰 범위와 다음 확인을 나누어 적는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w077",
      "no": 77
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b077",
       "type": "T09",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 77,
        "section": "전자석을 만들어 연결 전후를 관찰해요",
        "originalExam": false
       },
       "bookResponseForm": "reason",
       "bookQuestionId": "c22-s62-u03-w077",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T09",
        "format": "까닭 설명",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석을 만들어 연결 전후를 관찰해요",
        "concept": "전자석과 영구 자석 비교",
        "inquirySkill": "전자석과 영구 자석 비교"
       },
       "prompt": "철심의 시작 상태를 보지 않고 통전 중만 관찰했습니다. 어떤 설명에 한계가 생기나요?",
       "givens": null,
       "choices": null,
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
       "answerContract": {
        "type": "written-explanation",
        "sample": "처음부터 자성이 있었는지 알 수 없어 전류를 켜기 전후의 차이를 분리하기 어렵다. 전원이 분리된 시작 상태를 같은 클립·거리로 확인해 비교해야 한다.",
        "teacherRequired": true,
        "rubric": {
         "required": [
          "시작 상태가 없음을 읽는다.",
          "전후 차이 판단의 한계를 설명한다.",
          "같은 방법의 시작 비교를 제안한다."
         ],
         "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
         "kind": "written-explanation",
         "teacherRequired": true,
         "sample": "처음부터 자성이 있었는지 알 수 없어 전류를 켜기 전후의 차이를 분리하기 어렵다. 전원이 분리된 시작 상태를 같은 클립·거리로 확인해 비교해야 한다.",
         "required": [
          "시작 상태가 없음을 읽는다.",
          "전후 차이 판단의 한계를 설명한다.",
          "같은 방법의 시작 비교를 제안한다."
         ],
         "exactStringScoring": false
        }
       },
       "explanation": "통전 중 클립이 붙었다는 관찰은 남길 수 있다. 그러나 처음에도 붙었는지 모르면 변화량이나 전류 연결 전후 차이를 정확히 설명하기 어렵다. 관찰 범위와 다음 확인을 나누어 적는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "explanation": "이번 기록만으로는 처음부터 철심에 자석의 성질이 있었는지 몰라요. 전후의 차이를 살피려면 다시 비교할 때 전지를 연결하기 전의 상태부터 기록해야 해요. 나중에 본 모습으로 없던 처음 기록을 대신하지 않아요.",
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "연결 전의 기록이 없어 처음부터 클립이 붙었는지 알기 어려워요. 다음에 다시 비교할 때에는 같은 철심과 클립, 같은 거리에서 전지를 연결하기 전의 상태부터 살펴요. 전지를 분리한 뒤 본 것을 과거의 처음 상태로 바꾸어 적지는 않아요.",
    "required": [
     "연결 전 처음 상태의 기록이 없음을 밝힌다.",
     "처음부터 클립이 붙었는지 몰라 전후의 차이를 확정하기 어려움을 설명한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "연결 전의 기록이 없어 처음부터 클립이 붙었는지 알기 어려워요. 다음에 다시 비교할 때에는 같은 철심과 클립, 같은 거리에서 전지를 연결하기 전의 상태부터 살펴요. 전지를 분리한 뒤 본 것을 과거의 처음 상태로 바꾸어 적지는 않아요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "연결 전 처음 상태의 기록이 없음을 밝힌다.",
      "처음부터 클립이 붙었는지 몰라 전후의 차이를 확정하기 어려움을 설명한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "연결 전의 기록이 없어 처음부터 클립이 붙었는지 알기 어려워요. 다음에 다시 비교할 때에는 같은 철심과 클립, 같은 거리에서 전지를 연결하기 전의 상태부터 살펴요. 전지를 분리한 뒤 본 것을 과거의 처음 상태로 바꾸어 적지는 않아요.",
     "required": [
      "연결 전 처음 상태의 기록이 없음을 밝힌다.",
      "처음부터 클립이 붙었는지 몰라 전후의 차이를 확정하기 어려움을 설명한다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b079",
   "type": "T08",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 79,
    "section": "전자석을 만들어 연결 전후를 관찰해요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w079",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T08",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석을 만들어 연결 전후를 관찰해요",
    "concept": "전자석 제작과 접점 준비",
    "inquirySkill": "전자석 제작과 접점 준비"
   },
   "prompt": "내가 만들 전자석의 제작 그림을 그리세요. 철심·절연 코일·준비된 두 끝·스위치 회로와 점검 순서를 표시하세요.",
   "givens": null,
   "choices": null,
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
   "answerContract": {
    "type": "written-explanation",
    "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "철심·코일·두 끝 접점을 구별한다.",
      "전원을 끈 연결과 점검을 표시한다.",
      "피복 태우기·철심 가열·임의 전원 증가는 넣지 않는다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
     "required": [
      "철심·코일·두 끝 접점을 구별한다.",
      "전원을 끈 연결과 점검을 표시한다.",
      "피복 태우기·철심 가열·임의 전원 증가는 넣지 않는다."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "철심과 감긴 절연선, 두 끝 접점을 구별해요. 전지를 분리한 상태로 연결한 뒤 선생님께 점검받는 순서를 넣어요. 모든 장치에 같은 감는 횟수나 길이를 쓰라고 정하지 않아요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b079",
     "type": "T08",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 79,
      "section": "전자석을 만들어 연결 전후를 관찰해요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w079",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T08",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석을 만들어 연결 전후를 관찰해요",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비"
     },
     "prompt": "내가 만들 전자석의 제작 그림을 그리세요. 철심·절연 코일·준비된 두 끝·스위치 회로와 점검 순서를 표시하세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "철심·코일·두 끝 접점을 구별한다.",
        "전원을 끈 연결과 점검을 표시한다.",
        "피복 태우기·철심 가열·임의 전원 증가는 넣지 않는다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
       "required": [
        "철심·코일·두 끝 접점을 구별한다.",
        "전원을 끈 연결과 점검을 표시한다.",
        "피복 태우기·철심 가열·임의 전원 증가는 넣지 않는다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "그림은 실제 부품의 역할과 제작 과정을 설명해야 한다. 감은 횟수나 길이를 아무 기구에나 통하는 정답으로 강요하지 않는다. 실제 제작 전에는 완성·성공으로 표시하지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
    "required": [
     "철심·절연된 코일·준비된 두 끝과 스위치가 있는 회로를 구별해 그린다.",
     "전지를 분리한 상태의 연결과 선생님 점검 순서를 표시한다.",
     "피복 태우기·철심 가열·허용하지 않은 전지 추가를 제안하지 않는다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "철심·절연된 코일·준비된 두 끝과 스위치가 있는 회로를 구별해 그린다.",
      "전지를 분리한 상태의 연결과 선생님 점검 순서를 표시한다.",
      "피복 태우기·철심 가열·허용하지 않은 전지 추가를 제안하지 않는다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "철심 보호와 한 방향 코일을 표시하고 감긴 절연 부분과 양 끝 접점을 나눈다. 전원 분리 상태에서 연결해 교사 점검을 받는 순서를 덧붙인다.",
     "required": [
      "철심·절연된 코일·준비된 두 끝과 스위치가 있는 회로를 구별해 그린다.",
      "전지를 분리한 상태의 연결과 선생님 점검 순서를 표시한다.",
      "피복 태우기·철심 가열·허용하지 않은 전지 추가를 제안하지 않는다."
     ],
     "exactStringScoring": false
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b081",
   "type": "T10",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 81,
    "section": "전자석의 세기·극·쓰임을 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "single",
   "bookQuestionId": "c22-s62-u03-w081",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E6",
    "type": "T10",
    "format": "객관식",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "concept": "전자석 세기 비교의 근거",
    "inquirySkill": "전자석 세기 비교의 근거"
   },
   "prompt": "전지 수에 따른 전자석의 세기를 비교해요. 전지 수 외에 같게 할 조건을 고르세요.",
   "givens": {
    "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다."
   },
   "choices": [
    "한쪽만 다른 철심 재료",
    "조건마다 다른 코일 감긴 방향",
    "클립의 접근 거리와 전류가 흐르는 시간",
    "한쪽만 더 가까이 대는 방법",
    "조건마다 다른 종류의 클립"
   ],
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 2
   },
   "answerContract": {
    "type": "single-choice",
    "answer": 2,
    "seasonContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 2
    }
   },
   "explanation": "거리가 같고 전류가 흐르는 시간도 같은 ③이 알맞아요. 철심과 코일, 클립도 같게 해야 전지 수에 따른 차이를 비교할 수 있어요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w081",
    "no": 81
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "0": "M10",
     "1": "M10",
     "3": "M10",
     "4": "M10"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b081",
     "type": "T10",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 81,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w081",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T10",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거"
     },
     "prompt": "전자석 세기 비교에서 전지 수 외에 맞춰야 할 것을 고르세요.",
     "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다."
     },
     "choices": [
      "한쪽만 다른 철심 재료",
      "조건마다 다른 코일 감긴 방향",
      "클립의 접근 거리와 통전 시간",
      "한쪽만 더 가까이 대는 방법",
      "조건마다 다른 종류의 클립"
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 2
      }
     },
     "explanation": "접근 거리·통전 시간 등 다른 조건을 맞춰야 전지 수의 영향을 비교할 수 있다. 철심·코일·클립까지 바꾸면 원인을 나눠 해석하기 어렵다. 더 많이 붙었다는 결과만으로 공정성을 확인할 수는 없다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b081",
     "type": "T10",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 81,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w081",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T10",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거"
     },
     "prompt": "전자석 세기 비교에서 전지 수 외에 맞춰야 할 것을 고르세요.",
     "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다."
     },
     "choices": [
      "한쪽만 다른 철심 재료",
      "조건마다 다른 코일 감긴 방향",
      "클립의 접근 거리와 전류가 흐르는 시간",
      "한쪽만 더 가까이 대는 방법",
      "조건마다 다른 종류의 클립"
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 2
      }
     },
     "explanation": "접근 거리·전류가 흐르는 시간 등 다른 조건을 맞춰야 전지 수의 영향을 비교할 수 있다. 철심·코일·클립까지 바꾸면 원인을 나눠 해석하기 어렵다. 더 많이 붙었다는 결과만으로 공정성을 확인할 수는 없다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w081",
      "no": 81
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "0": "M10",
       "1": "M10",
       "3": "M10",
       "4": "M10"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b081",
       "type": "T10",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 81,
        "section": "전자석의 세기·극·쓰임을 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "single",
       "bookQuestionId": "c22-s62-u03-w081",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E6",
        "type": "T10",
        "format": "객관식",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석의 세기·극·쓰임을 비교해요",
        "concept": "전자석 세기 비교의 근거",
        "inquirySkill": "전자석 세기 비교의 근거"
       },
       "prompt": "전자석 세기 비교에서 전지 수 외에 맞춰야 할 것을 고르세요.",
       "givens": {
        "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다."
       },
       "choices": [
        "한쪽만 다른 철심 재료",
        "조건마다 다른 코일 감긴 방향",
        "클립의 접근 거리와 통전 시간",
        "한쪽만 더 가까이 대는 방법",
        "조건마다 다른 종류의 클립"
       ],
       "responseContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
       },
       "answerContract": {
        "type": "single-choice",
        "answer": 2,
        "seasonContract": {
         "kind": "single-choice",
         "teacherRequired": false,
         "answer": 2
        }
       },
       "explanation": "접근 거리·통전 시간 등 다른 조건을 맞춰야 전지 수의 영향을 비교할 수 있다. 철심·코일·클립까지 바꾸면 원인을 나눠 해석하기 어렵다. 더 많이 붙었다는 결과만으로 공정성을 확인할 수는 없다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다.",
   "givens": {
    "조건": "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요."
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "0": "M10",
     "1": "M10",
     "3": "M10",
     "4": "M10"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b089",
   "type": "T10",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 89,
    "section": "전자석의 세기·극·쓰임을 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "multiple",
   "bookQuestionId": "c22-s62-u03-w089",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E6",
    "type": "T10",
    "format": "복수 선택",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "concept": "전자석 세기 비교의 근거",
    "inquirySkill": "전자석 세기 비교의 근거"
   },
   "prompt": "반복 클립 기록이 뒷받침하는 말을 고르세요. (정답 3개)",
   "givens": {
    "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
    "자료표": {
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
    }
   },
   "choices": [
    "중간 반복은 클립 수가 정확히 두 배가 아니다.",
    "전지를 계속 늘리면 언제나 안전하게 더 많이 든다.",
    "철심·코일·거리·시간이 같다는 조건을 읽어야 한다.",
    "클립 수가 곧 자기력의 정확한 단위이다.",
    "이 조건에서는 두 전지 쪽이 매번 더 많이 들었다."
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
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     2,
     4
    ],
    "seasonContract": {
     "kind": "multi-choice",
     "teacherRequired": false,
     "answers": [
      0,
      2,
      4
     ]
    }
   },
   "explanation": "두 전지 쪽은 8>4, 9>5, 8>4로 매번 많이 들었어요. 하지만 둘째 9는 5의 두 배가 아니에요. 같은 철심과 코일, 거리와 시간도 확인하므로 ①, ③, ⑤예요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w089",
    "no": 89
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "1": "M10",
     "3": "M10"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b089",
     "type": "T10",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 89,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w089",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T10",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거"
     },
     "prompt": "반복 클립 기록이 뒷받침하는 말을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": [
      "중간 반복은 클립 수가 정확히 두 배가 아니다.",
      "전지를 계속 늘리면 언제나 안전하게 더 많이 든다.",
      "철심·코일·거리·시간이 같다는 조건을 읽어야 한다.",
      "클립 수가 곧 자기력의 정확한 단위이다.",
      "이 조건에서는 두 전지 쪽이 매번 더 많이 들었다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       2,
       4
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        0,
        2,
        4
       ]
      }
     },
     "explanation": "8>4,9>5,8>4라 두 전지 쪽이 모두 많고 가운데9는5의 두 배가 아니다. 같은 조건 안의 경향만 설명한다. 무제한 전지 증가·안전 보장·정확한 힘 수치로 확대하지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b089",
     "type": "T10",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 89,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w089",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T10",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거"
     },
     "prompt": "반복 클립 기록이 뒷받침하는 말을 고르세요. (정답 3개)",
     "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": [
      "중간 반복은 클립 수가 정확히 두 배가 아니다.",
      "전지를 계속 늘리면 언제나 안전하게 더 많이 든다.",
      "철심·코일·거리·시간이 같다는 조건을 읽어야 한다.",
      "클립 수가 곧 자기력의 정확한 단위이다.",
      "이 조건에서는 두 전지 쪽이 매번 더 많이 들었다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       2,
       4
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        0,
        2,
        4
       ]
      }
     },
     "explanation": "8>4,9>5,8>4라 두 전지 쪽이 모두 많고 가운데9는5의 두 배가 아니다. 같은 조건 안의 경향만 설명한다. 무제한 전지 증가·안전 보장·정확한 힘 수치로 확대하지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w089",
      "no": 89
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "1": "M10",
       "3": "M10"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b089",
       "type": "T10",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 89,
        "section": "전자석의 세기·극·쓰임을 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "multiple",
       "bookQuestionId": "c22-s62-u03-w089",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E6",
        "type": "T10",
        "format": "복수 선택",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석의 세기·극·쓰임을 비교해요",
        "concept": "전자석 세기 비교의 근거",
        "inquirySkill": "전자석 세기 비교의 근거"
       },
       "prompt": "반복 클립 기록이 뒷받침하는 말을 고르세요. (정답 3개)",
       "givens": {
        "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
        "자료표": {
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
        }
       },
       "choices": [
        "중간 반복은 클립 수가 정확히 두 배가 아니다.",
        "전지를 계속 늘리면 언제나 안전하게 더 많이 든다.",
        "철심·코일·거리·시간이 같다는 조건을 읽어야 한다.",
        "클립 수가 곧 자기력의 정확한 단위이다.",
        "이 조건에서는 두 전지 쪽이 매번 더 많이 들었다."
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
       "answerContract": {
        "type": "multi-choice",
        "answers": [
         0,
         2,
         4
        ],
        "seasonContract": {
         "kind": "multi-choice",
         "teacherRequired": false,
         "answers": [
          0,
          2,
          4
         ]
        }
       },
       "explanation": "8>4,9>5,8>4라 두 전지 쪽이 모두 많고 가운데9는5의 두 배가 아니다. 같은 조건 안의 경향만 설명한다. 무제한 전지 증가·안전 보장·정확한 힘 수치로 확대하지 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "givens": {
    "조건": "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요. 선생님이 만든 연습 기록이며, 우리가 직접 잰 값은 아니에요.",
    "자료표": {
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
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "1": "M10",
     "3": "M10"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b091",
   "type": "T10",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 91,
    "section": "전자석의 세기·극·쓰임을 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w091",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E6",
    "type": "T10",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "concept": "전자석 세기 비교의 근거",
    "inquirySkill": "전자석 세기 비교의 근거"
   },
   "prompt": "표에서 (1)두 전지 조건의 클립 수가 더 많은 반복 수 (2)정확히 두 배가 아닌 반복 수를 쓰세요.",
   "givens": {
    "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
    "자료표": {
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
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "3회 / 1회",
    "accepted": [
     "3회 / 1회"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "세 번 모두 두 전지 쪽이 많으므로 3회예요. 둘째의 9는 5의 두 배가 아니고 나머지 두 번은 두 배이므로 정확히 두 배가 아닌 것은 1회예요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "verificationModel": {
    "kind": "strength-repeat-counts",
    "model": "strength"
   },
   "workbookRef": {
    "id": "c22-s62-u03-w091",
    "no": 91
   },
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": {
     "any": "M10"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b091",
     "type": "T10",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 91,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w091",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T10",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거"
     },
     "prompt": "표에서 (1)두 전지 조건의 클립 수가 더 많은 반복 수 (2)정확히 두 배가 아닌 반복 수를 쓰세요.",
     "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "3회 / 1회",
      "accepted": [
       "3회 / 1회"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "세 번 모두 두 전지 기록이 높으므로3회이다. 첫째·셋째는 두 배지만 둘째9는5의 두 배가 아니므로1회이다. 일부 두 배 결과가 있어도 모든 조건의 정비례 법칙이 되지는 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "strength-repeat-counts",
      "model": "strength"
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b091",
     "type": "T10",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 91,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w091",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T10",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거"
     },
     "prompt": "표에서 (1)두 전지 조건의 클립 수가 더 많은 반복 수 (2)정확히 두 배가 아닌 반복 수를 쓰세요.",
     "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
      "자료표": {
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
      "문항": {
       "머리": [
        "문항"
       ],
       "행": [
        [
         "(1) · 단위도 써요."
        ],
        [
         "(2) · 단위도 써요."
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "3회 / 1회",
      "accepted": [
       "3회 / 1회"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "세 번 모두 두 전지 기록이 높으므로3회이다. 첫째·셋째는 두 배지만 둘째9는5의 두 배가 아니므로1회이다. 일부 두 배 결과가 있어도 모든 조건의 정비례 법칙이 되지는 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "strength-repeat-counts",
      "model": "strength"
     },
     "workbookRef": {
      "id": "c22-s62-u03-w091",
      "no": 91
     },
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": {
       "any": "M10"
      },
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b091",
       "type": "T10",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 91,
        "section": "전자석의 세기·극·쓰임을 비교해요",
        "originalExam": false
       },
       "bookResponseForm": "data",
       "bookQuestionId": "c22-s62-u03-w091",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E6",
        "type": "T10",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-03",
        "topic": "전자석의 세기·극·쓰임을 비교해요",
        "concept": "전자석 세기 비교의 근거",
        "inquirySkill": "전자석 세기 비교의 근거"
       },
       "prompt": "표에서 (1)두 전지 조건의 클립 수가 더 많은 반복 수 (2)정확히 두 배가 아닌 반복 수를 쓰세요.",
       "givens": {
        "조건": "같은 철심·코일·클립·접근 거리·접촉 방법·통전 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
        "자료표": {
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
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "3회 / 1회",
        "accepted": [
         "3회 / 1회"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "세 번 모두 두 전지 기록이 높으므로3회이다. 첫째·셋째는 두 배지만 둘째9는5의 두 배가 아니므로1회이다. 일부 두 배 결과가 있어도 모든 조건의 정비례 법칙이 되지는 않는다.",
       "standards": [
        "6과15-03"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "verificationModel": {
        "kind": "strength-repeat-counts",
        "model": "strength"
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 철심·코일·클립·접근 거리·접촉 방법·전류가 흐르는 시간을 맞춘다. 교사가 허용한 같은 종류·상태의 전지 한 개와 두 개만 비교한다. 두 개는 서로 다른 극끼리 이어 직렬연결한다. 교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "givens": {
    "조건": "철심·코일·클립과 클립을 대는 거리·방법, 전류가 흐르는 시간을 같게 해요. 선생님이 허용한 같은 종류와 상태의 전지 한 개와 두 개만 비교해요. 두 개는 서로 다른 극끼리 이어 직렬연결해요. 선생님이 만든 연습 기록이며, 우리가 직접 잰 값은 아니에요.",
    "자료표": {
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
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": {
     "any": "M10"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b092",
   "type": "T11",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 92,
    "section": "전자석의 세기·극·쓰임을 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w092",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E6",
    "type": "T11",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "concept": "나침반 관찰로 극 판단",
    "inquirySkill": "나침반 관찰로 극 판단"
   },
   "prompt": "나침반 표로 판단한 왼쪽 끝의 극을 (1)처음 (2)반대 연결 뒤 순서로 쓰세요.",
   "givens": {
    "조건": "같은 코일에서 전원을 분리한 뒤 전지 방향만 반대로 바꾼 연습 기록이다. 주변 자석을 멀리 두고 같은 위치의 반응을 비교했다.",
    "자료표": {
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
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "N극 / S극",
    "accepted": [
     "N극 / S극"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "처음에는 나침반 N극과 밀어내므로 왼쪽 끝은 N극이에요. 반대로 연결한 뒤 N극을 끌어당기므로 같은 끝은 S극이에요. 전지 수를 바꾼 것과 구별해요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "verificationModel": {
    "kind": "compass-pole-inference",
    "model": "poles"
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b092",
     "type": "T11",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 92,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w092",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T11",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "나침반 관찰로 극 판단",
      "inquirySkill": "나침반 관찰로 극 판단"
     },
     "prompt": "나침반 표로 판단한 왼쪽 끝의 극을 (1)처음 (2)반대 연결 뒤 순서로 쓰세요.",
     "givens": {
      "조건": "같은 코일에서 전원을 분리한 뒤 전지 방향만 반대로 바꾼 연습 기록이다. 주변 자석을 멀리 두고 같은 위치의 반응을 비교했다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "N극 / S극",
      "accepted": [
       "N극 / S극"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "처음 왼쪽은 N극과 밀어내므로 N극이다. 반대 연결 뒤에는 N극을 끌어당기므로 S극이다. 같은 끝의 전후 반응을 읽으며 전지 수 변화로 이유를 바꾸지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "compass-pole-inference",
      "model": "poles"
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 코일에서 전원을 분리한 뒤 전지 방향만 반대로 바꾼 연습 기록이다. 주변 자석을 멀리 두고 같은 위치의 반응을 비교했다.",
   "givens": {
    "조건": "같은 코일에서 전원을 분리한 뒤 전지의 방향만 반대로 바꾼 연습 기록이에요. 주변 자석을 멀리 두고 같은 위치에서 반응을 비교했다고 정했어요.",
    "자료표": {
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
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b093",
   "type": "T10",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 93,
    "section": "전자석의 세기·극·쓰임을 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "reason",
   "bookQuestionId": "c22-s62-u03-w093",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E6",
    "type": "T10",
    "format": "까닭 설명",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "concept": "전자석 세기 비교의 근거",
    "inquirySkill": "전자석 세기 비교의 근거"
   },
   "prompt": "클립을 더 가까이 대니 많이 붙었어요. 이것만으로 전자석 자체가 더 세졌다고 할 수 있을까요?",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
    "required": [
     "접근 거리 차이를 근거로 든다.",
     "자석 자체 변화와 관찰 방법 효과를 구별한다.",
     "공정한 비교 조건을 제안한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "접근 거리 차이를 근거로 든다.",
      "자석 자체 변화와 관찰 방법 효과를 구별한다.",
      "공정한 비교 조건을 제안한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
     "required": [
      "접근 거리 차이를 근거로 든다.",
      "자석 자체 변화와 관찰 방법 효과를 구별한다.",
      "공정한 비교 조건을 제안한다."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "클립이 더 많이 붙은 것은 남겨요. 하지만 가까이 댄 거리도 달라졌으므로 전자석 자체가 더 세졌다고만 할 수는 없어요. 같은 클립과 거리, 방법과 시간에서 다시 비교해요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b093",
     "type": "T10",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 93,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "reason",
     "bookQuestionId": "c22-s62-u03-w093",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T10",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거"
     },
     "prompt": "클립을 더 가까이 대자 더 많이 붙었습니다. 전자석 자체가 더 세졌다고 할 수 있나요?",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "거리 조건이 달라져 전자석 자체의 변화로 단정할 수 없다. 같은 철심·코일·클립과 같은 거리·접촉 방법·시간을 맞춘 뒤 비교해야 한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "접근 거리 차이를 근거로 든다.",
        "자석 자체 변화와 관찰 방법 효과를 구별한다.",
        "공정한 비교 조건을 제안한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "sample": "거리 조건이 달라져 전자석 자체의 변화로 단정할 수 없다. 같은 철심·코일·클립과 같은 거리·접촉 방법·시간을 맞춘 뒤 비교해야 한다.",
       "required": [
        "접근 거리 차이를 근거로 든다.",
        "자석 자체 변화와 관찰 방법 효과를 구별한다.",
        "공정한 비교 조건을 제안한다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "클립 수는 거리와 접촉 방법에도 영향을 받는다. 더 많이 붙은 관찰은 남기되 원인에 대한 결론은 제한한다. 준비한 클립 수만 늘리는 것도 전자석 자체의 세기 증가와 같은 말은 아니다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
    "required": [
     "클립을 대는 거리가 달라졌음을 근거로 든다.",
     "관찰 방법도 바뀌었으므로 전자석 자체가 더 세졌다고만 할 수 없음을 설명한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "클립을 대는 거리가 달라졌음을 근거로 든다.",
      "관찰 방법도 바뀌었으므로 전자석 자체가 더 세졌다고만 할 수 없음을 설명한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "클립을 대는 거리도 달라졌어요. 같은 철심과 코일, 클립과 거리, 닿는 방법과 시간을 맞춰 비교해야 전자석 자체가 달라졌는지 알 수 있어요.",
     "required": [
      "클립을 대는 거리가 달라졌음을 근거로 든다.",
      "관찰 방법도 바뀌었으므로 전자석 자체가 더 세졌다고만 할 수 없음을 설명한다."
     ],
     "exactStringScoring": false
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b094",
   "type": "T17",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 94,
    "section": "전자석의 세기·극·쓰임을 비교해요",
    "originalExam": false
   },
   "bookResponseForm": "reason",
   "bookQuestionId": "c22-s62-u03-w094",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E6",
    "type": "T17",
    "format": "까닭 설명",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-03",
    "topic": "전자석의 세기·극·쓰임을 비교해요",
    "concept": "자석 작용과 구조·쓰임 연결",
    "inquirySkill": "나침반 관찰과 제어 목적·기기 구조의 근거를 잇는다."
   },
   "prompt": "철 조각 운반 장치와 자석 게시판을 비교해, 전자석 제어가 필요한 까닭을 설명하세요.",
   "givens": {
    "조건": "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다."
   },
   "choices": null,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "철 조각을 옮기는 장치는 잡았다가 놓을 수 있어야 해요. 전자석은 전원을 켜고 끄며 작용을 조절할 수 있어요. 자료의 게시판은 전지 없이도 작용하는 영구 자석을 써요.",
    "required": [
     "기기의 목적과 잡기·놓기를 연결한다.",
     "전류 제어의 역할을 설명한다.",
     "제시한 영구 자석 구조와 차이를 비교한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "철 조각을 옮기는 장치는 잡았다가 놓을 수 있어야 해요. 전자석은 전원을 켜고 끄며 작용을 조절할 수 있어요. 자료의 게시판은 전지 없이도 작용하는 영구 자석을 써요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "기기의 목적과 잡기·놓기를 연결한다.",
      "전류 제어의 역할을 설명한다.",
      "제시한 영구 자석 구조와 차이를 비교한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "철 조각을 옮기는 장치는 잡았다가 놓을 수 있어야 해요. 전자석은 전원을 켜고 끄며 작용을 조절할 수 있어요. 자료의 게시판은 전지 없이도 작용하는 영구 자석을 써요.",
     "required": [
      "기기의 목적과 잡기·놓기를 연결한다.",
      "전류 제어의 역할을 설명한다.",
      "제시한 영구 자석 구조와 차이를 비교한다."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "철 조각을 옮기는 장치는 잡았다가 놓는 작용을 조절해야 해요. 전자석은 전원을 켜고 끄는 성질을 쓸 수 있어요. 자료의 게시판은 전지 없이 작용하는 영구 자석이라는 점과 비교해요.",
   "standards": [
    "6과15-03"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b094",
     "type": "T17",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 94,
      "section": "전자석의 세기·극·쓰임을 비교해요",
      "originalExam": false
     },
     "bookResponseForm": "reason",
     "bookQuestionId": "c22-s62-u03-w094",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E6",
      "type": "T17",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-03",
      "topic": "전자석의 세기·극·쓰임을 비교해요",
      "concept": "자석 작용과 구조·쓰임 연결",
      "inquirySkill": "나침반 관찰과 제어 목적·기기 구조의 근거를 잇는다."
     },
     "prompt": "철 조각 운반 장치와 자석 게시판을 비교해, 전자석 제어가 필요한 까닭을 설명하세요.",
     "givens": {
      "조건": "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다."
     },
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "운반 장치는 철 조각을 잡고 옮긴 뒤 놓는 작용을 조절해야 한다. 전자석은 전류 제어를 이용할 수 있고, 제시한 게시판의 영구 자석은 전지 없이 작용한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "기기의 목적과 잡기·놓기를 연결한다.",
        "전류 제어의 역할을 설명한다.",
        "제시한 영구 자석 구조와 차이를 비교한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "sample": "운반 장치는 철 조각을 잡고 옮긴 뒤 놓는 작용을 조절해야 한다. 전자석은 전류 제어를 이용할 수 있고, 제시한 게시판의 영구 자석은 전지 없이 작용한다.",
       "required": [
        "기기의 목적과 잡기·놓기를 연결한다.",
        "전류 제어의 역할을 설명한다.",
        "제시한 영구 자석 구조와 차이를 비교한다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "두 장치의 기능과 제어 필요가 다르다. 전자석을 쓰는 구체적 구조의 설명 자료를 근거로 판단한다. 모든 운반 장치가 반드시 같은 방식이라고 확대하지 않는다.",
     "standards": [
      "6과15-03"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "이 문제의 운반 모형은 코일의 전류로 철 조각을 잡고 놓는다. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙이는 구조다. 이 두 구조만 비교한다.",
   "givens": {
    "조건": "이 문제의 운반 모형은 코일에 전류가 흐르게 하거나 끊어 철 조각을 잡고 놓아요. 게시판은 전지 없이 막대 영구 자석으로 종이를 붙여요. 여기서는 이 두 구조를 비교해요."
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b097",
   "type": "T13",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 97,
    "section": "전기를 안전하게 사용하는 근거를 찾아요",
    "originalExam": false
   },
   "bookResponseForm": "single",
   "bookQuestionId": "c22-s62-u03-w097",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E7",
    "type": "T13",
    "format": "객관식",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 안전하게 사용하는 근거를 찾아요",
    "concept": "전기 안전 계획 판단",
    "inquirySkill": "전기 안전 계획 판단"
   },
   "prompt": "점검 카드에서 어른에게 알려야 할 대응을 고르세요.",
   "givens": {
    "조건": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
    "자료표": {
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
    }
   },
   "choices": [
    "보이는 금속을 손으로 만져 시험한다.",
    "냄새가 나도 잠깐만 계속 켠다.",
    "전선에 테이프만 붙이면 항상 안전하다.",
    "손상 기구는 쓰지 않고 알린다.",
    "차단기를 반복 조작해 원인을 찾는다."
   ],
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 3
   },
   "answerContract": {
    "type": "single-choice",
    "answer": 3,
    "seasonContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 3
    }
   },
   "explanation": "손상이나 이상한 냄새가 있으면 쓰지 않고 어른에게 알려요. 그래서 ④예요. 직접 만지거나 다시 켜서 시험하지 않고, 테이프만 붙이면 모두 안전하다고 하지는 않아요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b097",
     "type": "T13",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 97,
      "section": "전기를 안전하게 사용하는 근거를 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w097",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T13",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 안전하게 사용하는 근거를 찾아요",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단"
     },
     "prompt": "점검 카드에서 어른에게 알려야 할 대응을 고르세요.",
     "givens": {
      "조건": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
      "자료표": {
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
      }
     },
     "choices": [
      "보이는 금속을 손으로 만져 시험한다.",
      "냄새가 나도 잠깐만 계속 켠다.",
      "전선에 테이프만 붙이면 항상 안전하다.",
      "손상 기구는 쓰지 않고 알린다.",
      "차단기를 반복 조작해 원인을 찾는다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 3
      }
     },
     "explanation": "손상·이상 냄새가 있는 기구는 사용을 중단하고 어른에게 알려 점검받는다. 직접 만지거나 켜 보아 위험을 시험하지 않는다. 테이프 하나로 모든 손상 기구의 안전이 보장되는 것도 아니다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
   "givens": {
    "조건": "실제 위험한 기구를 만지거나 시험하지 않고, 점검 카드의 행동 계획만 구별해요.",
    "자료표": {
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
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b098",
   "type": "T13",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 98,
    "section": "전기를 안전하게 사용하는 근거를 찾아요",
    "originalExam": false
   },
   "bookResponseForm": "single",
   "bookQuestionId": "c22-s62-u03-w098",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E7",
    "type": "T13",
    "format": "객관식",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 안전하게 사용하는 근거를 찾아요",
    "concept": "전기 안전 계획 판단",
    "inquirySkill": "전기 안전 계획 판단"
   },
   "prompt": "실험 회로의 연결을 바꾸는 방법을 고르세요.",
   "givens": {
    "조건": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
   },
   "choices": [
    "스위치를 켠 채 금속 집게를 옮긴다.",
    "전원을 분리한 뒤 점검받는다.",
    "전지 양극을 전선만으로 잇는다.",
    "규격을 모르니 전지를 계속 더한다.",
    "손상된 피복을 칼로 더 넓게 벗긴다."
   ],
   "responseContract": {
    "kind": "single-choice",
    "teacherRequired": false,
    "answer": 1
   },
   "answerContract": {
    "type": "single-choice",
    "answer": 1,
    "seasonContract": {
     "kind": "single-choice",
     "teacherRequired": false,
     "answer": 1
    }
   },
   "explanation": "연결을 바꾸기 전에는 전원을 분리하고 점검받는 ②가 맞아요. 전지 두 극을 전선만으로 직접 잇거나 전지를 더하고 피복을 훼손하는 것은 고치는 방법이 아니에요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w098",
    "no": 98
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": {
     "0": "M13",
     "2": "M13",
     "3": "M13",
     "4": "M13"
    },
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b098",
     "type": "T13",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 98,
      "section": "전기를 안전하게 사용하는 근거를 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w098",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T13",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 안전하게 사용하는 근거를 찾아요",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단"
     },
     "prompt": "실험 회로의 연결을 바꾸는 방법을 고르세요.",
     "givens": {
      "조건": "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
     },
     "choices": [
      "스위치를 켠 채 금속 집게를 옮긴다.",
      "전원을 분리한 뒤 점검받는다.",
      "전지 양극을 전선만으로 잇는다.",
      "정격을 모르니 전지를 계속 더한다.",
      "손상된 피복을 칼로 더 넓게 벗긴다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 1
      }
     },
     "explanation": "연결 변경 전에는 전원을 분리하고 바꾼 접속을 점검받아야 한다. 단락·임의 전지 증가·피복 훼손은 해결 방법이 아니다. 저전압 교육용 부품이라도 지정한 절차와 허용 조건을 지킨다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b098",
     "type": "T13",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 98,
      "section": "전기를 안전하게 사용하는 근거를 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "single",
     "bookQuestionId": "c22-s62-u03-w098",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T13",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 안전하게 사용하는 근거를 찾아요",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단"
     },
     "prompt": "실험 회로의 연결을 바꾸는 방법을 고르세요.",
     "givens": {
      "조건": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
     },
     "choices": [
      "스위치를 켠 채 금속 집게를 옮긴다.",
      "전원을 분리한 뒤 점검받는다.",
      "전지 양극을 전선만으로 잇는다.",
      "규격을 모르니 전지를 계속 더한다.",
      "손상된 피복을 칼로 더 넓게 벗긴다."
     ],
     "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
     },
     "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "seasonContract": {
       "kind": "single-choice",
       "teacherRequired": false,
       "answer": 1
      }
     },
     "explanation": "연결 변경 전에는 전원을 분리하고 바꾼 접속을 점검받아야 한다. 단락·임의 전지 증가·피복 훼손은 해결 방법이 아니다. 저전압 교육용 부품이라도 지정한 절차와 허용 조건을 지킨다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w098",
      "no": 98
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": {
       "0": "M13",
       "2": "M13",
       "3": "M13",
       "4": "M13"
      },
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b098",
       "type": "T13",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 98,
        "section": "전기를 안전하게 사용하는 근거를 찾아요",
        "originalExam": false
       },
       "bookResponseForm": "single",
       "bookQuestionId": "c22-s62-u03-w098",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E7",
        "type": "T13",
        "format": "객관식",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-04",
        "topic": "전기를 안전하게 사용하는 근거를 찾아요",
        "concept": "전기 안전 계획 판단",
        "inquirySkill": "전기 안전 계획 판단"
       },
       "prompt": "실험 회로의 연결을 바꾸는 방법을 고르세요.",
       "givens": {
        "조건": "교사가 정격·정상 상태·통전 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다."
       },
       "choices": [
        "스위치를 켠 채 금속 집게를 옮긴다.",
        "전원을 분리한 뒤 점검받는다.",
        "전지 양극을 전선만으로 잇는다.",
        "정격을 모르니 전지를 계속 더한다.",
        "손상된 피복을 칼로 더 넓게 벗긴다."
       ],
       "responseContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
       },
       "answerContract": {
        "type": "single-choice",
        "answer": 1,
        "seasonContract": {
         "kind": "single-choice",
         "teacherRequired": false,
         "answer": 1
        }
       },
       "explanation": "연결 변경 전에는 전원을 분리하고 바꾼 접속을 점검받아야 한다. 단락·임의 전지 증가·피복 훼손은 해결 방법이 아니다. 저전압 교육용 부품이라도 지정한 절차와 허용 조건을 지킨다.",
       "standards": [
        "6과15-04"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "choices": [
    "스위치를 켠 채 금속 집게를 옮긴다.",
    "전원을 분리한 뒤 점검받는다.",
    "전지의 +극과 −극을 전선만으로 잇는다.",
    "규격을 모르니 전지를 계속 더한다.",
    "손상된 피복을 칼로 더 넓게 벗긴다."
   ],
   "sourceConditionDetails": "교사가 규격·정상 상태·전류가 흐르는 시간을 확인한 저전압 교육용 부품이다. 연결을 바꿀 때는 전원을 분리하고 점검받는다. 전지 양극을 전선만으로 직접 잇지 않는다.",
   "givens": {
    "조건": "이 문제에서는 선생님이 규격과 정상 상태, 사용할 시간을 확인한 낮은 전압의 교육용 부품을 쓴다고 정했어요. 연결을 바꿀 때는 전원을 분리하고 점검받아요. 전지의 +극과 −극을 전선만으로 직접 잇지 않아요."
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": {
     "0": "M13",
     "2": "M13",
     "3": "M13",
     "4": "M13"
    },
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b105",
   "type": "T13",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 105,
    "section": "전기를 안전하게 사용하는 근거를 찾아요",
    "originalExam": false
   },
   "bookResponseForm": "multiple",
   "bookQuestionId": "c22-s62-u03-w105",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E7",
    "type": "T13",
    "format": "복수 선택",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 안전하게 사용하는 근거를 찾아요",
    "concept": "전기 안전 계획 판단",
    "inquirySkill": "전기 안전 계획 판단"
   },
   "prompt": "전지 관리 자료와 맞는 계획을 고르세요. (정답 3개)",
   "givens": null,
   "choices": [
    "지정된 크기·종류의 전지를 쓴다.",
    "+·− 표시를 확인해 넣는다.",
    "새 전지와 헌 전지를 섞어 쓴다.",
    "금속 물체가 전지 양극을 직접 잇지 않게 한다.",
    "분리한 전지를 불에 넣어 처리한다."
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
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     1,
     3
    ],
    "seasonContract": {
     "kind": "multi-choice",
     "teacherRequired": false,
     "answers": [
      0,
      1,
      3
     ]
    }
   },
   "explanation": "지정한 크기와 종류, +·− 방향을 확인하고 금속 물체가 전지 두 극을 직접 잇지 않게 해요. 그래서 ①, ②, ④예요. 새것과 헌것을 섞거나 불에 버리지 않아요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b105",
     "type": "T13",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 105,
      "section": "전기를 안전하게 사용하는 근거를 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "multiple",
     "bookQuestionId": "c22-s62-u03-w105",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T13",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 안전하게 사용하는 근거를 찾아요",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단"
     },
     "prompt": "전지 관리 자료와 맞는 계획을 고르세요. (정답 3개)",
     "givens": null,
     "choices": [
      "지정된 크기·종류의 전지를 쓴다.",
      "+·− 표시를 확인해 넣는다.",
      "새 전지와 헌 전지를 섞어 쓴다.",
      "금속 물체가 전지 양극을 직접 잇지 않게 한다.",
      "분리한 전지를 불에 넣어 처리한다."
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
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       1,
       3
      ],
      "seasonContract": {
       "kind": "multi-choice",
       "teacherRequired": false,
       "answers": [
        0,
        1,
        3
       ]
      }
     },
     "explanation": "지정 규격·극 표시·뜻하지 않은 단락 방지가 필요하다. 새것과 헌것을 섞거나 불에 넣는 계획은 맞지 않는다. 폐기·수거는 학교와 지역의 실제 안내를 어른과 확인한다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "choices": [
    "지정된 크기·종류의 전지를 쓴다.",
    "+·− 표시를 확인해 넣는다.",
    "새 전지와 헌 전지를 섞어 쓴다.",
    "금속 물체가 전지의 +극과 −극을 직접 잇지 않게 한다.",
    "분리한 전지를 불에 넣어 처리한다."
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b107",
   "type": "T13",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 107,
    "section": "전기를 안전하게 사용하는 근거를 찾아요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w107",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E7",
    "type": "T13",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 안전하게 사용하는 근거를 찾아요",
    "concept": "전기 안전 계획 판단",
    "inquirySkill": "전기 안전 계획 판단"
   },
   "prompt": "표에서 (1)사용하지 않고 어른에게 알려야 할 징후 카드 수 (2)그렇지 않은 정상 확인 카드 수를 쓰세요.",
   "givens": {
    "조건": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
    "자료표": {
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
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "2개 / 2개",
    "accepted": [
     "2개 / 2개"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "손상된 ㄱ과 타는 냄새가 나는 ㄷ은 2개예요. 정상 분리와 규격 확인인 ㄴ, ㄹ도 2개예요. 카드를 분류한 것과 실제 기구를 점검한 것은 달라요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "verificationModel": {
    "kind": "safety-situation-counts",
    "model": "safety"
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b107",
     "type": "T13",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 107,
      "section": "전기를 안전하게 사용하는 근거를 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w107",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T13",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 안전하게 사용하는 근거를 찾아요",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단"
     },
     "prompt": "표에서 (1)사용하지 않고 어른에게 알려야 할 징후 카드 수 (2)그렇지 않은 정상 확인 카드 수를 쓰세요.",
     "givens": {
      "조건": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "2개 / 2개",
      "accepted": [
       "2개 / 2개"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "손상 ㄱ과 타는 냄새 ㄷ은2개 징후 카드이다. 정상 분리와 규격 확인인 ㄴ·ㄹ은2개다. 분류를 맞혔다고 실제 기구 점검을 수행한 것으로 세지는 않는다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "safety-situation-counts",
      "model": "safety"
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "실제 위험 기구를 만지거나 시험하지 않고 행동 계획만 분류한다.",
   "givens": {
    "조건": "실제 위험한 기구를 만지거나 시험하지 않고, 점검 카드의 행동 계획만 구별해요.",
    "자료표": {
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
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b108",
   "type": "T13",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 108,
    "section": "전기를 안전하게 사용하는 근거를 찾아요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w108",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E7",
    "type": "T13",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 안전하게 사용하는 근거를 찾아요",
    "concept": "전기 안전 계획 판단",
    "inquirySkill": "전기 안전 계획 판단"
   },
   "prompt": "점검표에서 (1) 확인한 항목은 몇 개인가요? (2) 아직 확인하지 않은 항목은 몇 개인가요? 단위도 써 주세요.",
   "givens": {
    "조건": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
    "자료표": {
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
       "전류가 흐르는 시간",
       "아직 정하지 않음"
      ]
     ]
    },
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "2개 / 2개",
    "accepted": [
     "2개 / 2개"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "앞의 두 항목은 확인했고 뒤의 두 항목은 아직 확인하지 않았으므로 2개, 2개예요. 모르는 항목을 문제없음이나 0초로 채우지 않아요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w108",
    "no": 108
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": {
     "any": "M13"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b108",
     "type": "T13",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 108,
      "section": "전기를 안전하게 사용하는 근거를 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w108",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T13",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 안전하게 사용하는 근거를 찾아요",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단"
     },
     "prompt": "점검 기록에서 (1)확인을 마친 항목 수 (2)아직 확인하지 않은 항목 수를 쓰세요.",
     "givens": {
      "조건": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "2개 / 2개",
      "accepted": [
       "2개 / 2개"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "앞의 두 항목은 확인을 마쳤고 뒤의 두 항목은 남아 있으므로2개·2개이다. 아직 정하지 않은 항목을0초나 문제 없음으로 추정하지 않는다. 남은 조건 확인 전에는 실행 준비가 모두 끝난 것이 아니다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b108",
     "type": "T13",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 108,
      "section": "전기를 안전하게 사용하는 근거를 찾아요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w108",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T13",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 안전하게 사용하는 근거를 찾아요",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단"
     },
     "prompt": "점검 기록에서 (1)확인을 마친 항목 수 (2)아직 확인하지 않은 항목 수를 쓰세요.",
     "givens": {
      "조건": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
      "자료표": {
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
         "전류가 흐르는 시간",
         "아직 정하지 않음"
        ]
       ]
      },
      "문항": {
       "머리": [
        "문항"
       ],
       "행": [
        [
         "(1) · 단위도 써요."
        ],
        [
         "(2) · 단위도 써요."
        ]
       ]
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "2개 / 2개",
      "accepted": [
       "2개 / 2개"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "앞의 두 항목은 확인을 마쳤고 뒤의 두 항목은 남아 있으므로2개·2개이다. 아직 정하지 않은 항목을0초나 문제 없음으로 추정하지 않는다. 남은 조건 확인 전에는 실행 준비가 모두 끝난 것이 아니다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w108",
      "no": 108
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": {
       "any": "M13"
      },
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b108",
       "type": "T13",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 108,
        "section": "전기를 안전하게 사용하는 근거를 찾아요",
        "originalExam": false
       },
       "bookResponseForm": "data",
       "bookQuestionId": "c22-s62-u03-w108",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E7",
        "type": "T13",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-04",
        "topic": "전기를 안전하게 사용하는 근거를 찾아요",
        "concept": "전기 안전 계획 판단",
        "inquirySkill": "전기 안전 계획 판단"
       },
       "prompt": "점검 기록에서 (1)확인을 마친 항목 수 (2)아직 확인하지 않은 항목 수를 쓰세요.",
       "givens": {
        "조건": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
        "자료표": {
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
        }
       },
       "choices": null,
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
       "answerContract": {
        "type": "short-text",
        "answer": "2개 / 2개",
        "accepted": [
         "2개 / 2개"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
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
        }
       },
       "explanation": "앞의 두 항목은 확인을 마쳤고 뒤의 두 항목은 남아 있으므로2개·2개이다. 아직 정하지 않은 항목을0초나 문제 없음으로 추정하지 않는다. 남은 조건 확인 전에는 실행 준비가 모두 끝난 것이 아니다.",
       "standards": [
        "6과15-04"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "교사가 비교 방법을 설명하려고 만든 연습 기록이다. 실제 학생 관찰값은 아니다.",
   "givens": {
    "조건": "비교 방법을 익히려고 선생님이 만든 연습 기록이에요. 우리가 직접 점검한 기록은 아니에요.",
    "자료표": {
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
       "전류가 흐르는 시간",
       "아직 정하지 않음"
      ]
     ]
    },
    "문항": {
     "머리": [
      "문항"
     ],
     "행": [
      [
       "(1) · 단위도 써요."
      ],
      [
       "(2) · 단위도 써요."
      ]
     ]
    }
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": {
     "any": "M13"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b123",
   "type": "T14",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 123,
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "originalExam": false
   },
   "bookResponseForm": "data",
   "bookQuestionId": "c22-s62-u03-w123",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E8",
    "type": "T14",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "concept": "효율적 이용과 실천 점검",
    "inquirySkill": "효율적 이용과 실천 점검"
   },
   "prompt": "표에서 필요 없는 조명을 켠 시간을 더해요. (1) 실천 전의 합 (2) 실천 후의 합을 단위와 함께 쓰세요.",
   "givens": {
    "조건": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
    "자료표": {
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
    }
   },
   "choices": null,
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
   "answerContract": {
    "type": "short-text",
    "answer": "180분 / 90분",
    "accepted": [
     "180분 / 90분"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
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
    }
   },
   "explanation": "전은 60+60+60=180분, 후는 35+30+25=90분이에요. 필요 없는 조명을 켠 시간의 합이에요. 이 시간으로 전기 사용량이나 요금을 직접 잰 것은 아니에요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "verificationModel": {
    "kind": "unnecessary-time-sums",
    "model": "time"
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b123",
     "type": "T14",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 123,
      "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "originalExam": false
     },
     "bookResponseForm": "data",
     "bookQuestionId": "c22-s62-u03-w123",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E8",
      "type": "T14",
      "format": "자료 해석",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "concept": "효율적 이용과 실천 점검",
      "inquirySkill": "효율적 이용과 실천 점검"
     },
     "prompt": "표에서 (1)전의 불필요 점등 시간 합계 (2)후의 합계를 단위와 함께 쓰세요.",
     "givens": {
      "조건": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "short-text",
      "answer": "180분 / 90분",
      "accepted": [
       "180분 / 90분"
      ],
      "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
      "seasonContract": {
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
      }
     },
     "explanation": "전은60+60+60=180분이고 후는35+30+25=90분이다. 불필요 점등 시간의 합계를 읽은 값이다. 필요한 밝기는 유지한 가정이며 이 숫자가 실제 전기 사용량이나 요금은 아니다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "verificationModel": {
      "kind": "unnecessary-time-sums",
      "model": "time"
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
   "givens": {
    "조건": "같은 조명과 이용 일정에서 필요한 밝기를 유지하며, 필요 없이 켜 둔 시간만 줄인다고 정한 연습 자료예요. 전기 사용량·요금·배출량은 잰 값이 없어요.",
    "자료표": {
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
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b125",
   "type": "T18",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 125,
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "originalExam": false
   },
   "bookResponseForm": "reason",
   "bookQuestionId": "c22-s62-u03-w125",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E8",
    "type": "T18",
    "format": "까닭 설명",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "concept": "계획·실행·검토의 증거 설계",
    "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
   },
   "prompt": "“조명을 켠 시간이 절반이니 전체 전기요금도 정확히 절반 줄었어”라고 말할 수 있을까요? 표에서 알 수 있는 것과 더 필요한 자료를 쓰세요.",
   "givens": {
    "조건": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
    "자료표": {
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
    }
   },
   "choices": null,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "sample": "이 표는 필요 없는 조명을 켠 시간이 달라진 기록이에요. 전기 사용량이나 요금을 직접 잰 것은 아니에요. 다른 사용과 요금 조건도 모르므로 전체 요금이 정확히 절반 줄었다고 할 수는 없어요.",
    "required": [
     "측정한 시간과 요금·사용량을 구별한다.",
     "정확한 효과 단정을 제한한다.",
     "추가 자료와 비교 조건을 제안한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "이 표는 필요 없는 조명을 켠 시간이 달라진 기록이에요. 전기 사용량이나 요금을 직접 잰 것은 아니에요. 다른 사용과 요금 조건도 모르므로 전체 요금이 정확히 절반 줄었다고 할 수는 없어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "측정한 시간과 요금·사용량을 구별한다.",
      "정확한 효과 단정을 제한한다.",
      "추가 자료와 비교 조건을 제안한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "sample": "이 표는 필요 없는 조명을 켠 시간이 달라진 기록이에요. 전기 사용량이나 요금을 직접 잰 것은 아니에요. 다른 사용과 요금 조건도 모르므로 전체 요금이 정확히 절반 줄었다고 할 수는 없어요.",
     "required": [
      "측정한 시간과 요금·사용량을 구별한다.",
      "정확한 효과 단정을 제한한다.",
      "추가 자료와 비교 조건을 제안한다."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "필요 없는 조명을 켠 시간은 180분에서 90분으로 줄었어요. 하지만 다른 전기 사용과 요금 조건은 없어요. 전체 요금이 정확히 절반 줄었다고 정하려면 자료가 더 필요해요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b125",
     "type": "T18",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 125,
      "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "originalExam": false
     },
     "bookResponseForm": "reason",
     "bookQuestionId": "c22-s62-u03-w125",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E8",
      "type": "T18",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "concept": "계획·실행·검토의 증거 설계",
      "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
     },
     "prompt": "“조명을 켠 시간이 절반이니 전기요금도 정확히 절반 줄었다”는 주장을 검토하세요.",
     "givens": {
      "조건": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
      "자료표": {
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
      }
     },
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "표는 불필요 점등 시간의 변화이며 전기 사용량·요금을 측정하지 않았다. 다른 사용과 요금 조건을 알 수 없으므로 정확한 요금 절감을 단정하지 않고 필요한 자료를 더 확인해야 한다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "측정한 시간과 요금·사용량을 구별한다.",
        "정확한 효과 단정을 제한한다.",
        "추가 자료와 비교 조건을 제안한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "sample": "표는 불필요 점등 시간의 변화이며 전기 사용량·요금을 측정하지 않았다. 다른 사용과 요금 조건을 알 수 없으므로 정확한 요금 절감을 단정하지 않고 필요한 자료를 더 확인해야 한다.",
       "required": [
        "측정한 시간과 요금·사용량을 구별한다.",
        "정확한 효과 단정을 제한한다.",
        "추가 자료와 비교 조건을 제안한다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "주어진 합계 시간은180분에서90분으로 줄지만 그 값만으로 전체 전기요금을 계산하지 못한다. 같은 조명이라는 조건도 전체 사용·요금 조건을 대신하지 않는다. 실제 측정과 예상을 분리한다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "sourceConditionDetails": "같은 조명·같은 이용 일정에서 필요한 밝기를 유지하며 불필요한 점등 시간만 줄인 가상 연습 자료다. 전기 사용량·요금·배출량은 측정하지 않았다.",
   "givens": {
    "조건": "같은 조명과 이용 일정에서 필요한 밝기를 유지하며, 필요 없이 켜 둔 시간만 줄인다고 정한 연습 자료예요. 전기 사용량·요금·배출량은 잰 값이 없어요.",
    "자료표": {
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
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b127",
   "type": "T18",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 127,
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w127",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E8",
    "type": "T18",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "concept": "계획·실행·검토의 증거 설계",
    "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
   },
   "prompt": "교실에서 할 안전·절약 실천 카드를 만드세요. 장소·행동·담당·기간·확인 방법과 아직 하지 않음 칸을 배치하세요.",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
    "required": [
     "구체적 실행 조건을 담는다.",
     "실제 행동·근거와 아직 하지 않음을 구별한다.",
     "필요한 기능과 안전 범위를 유지한다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "구체적 실행 조건을 담는다.",
      "실제 행동·근거와 아직 하지 않음을 구별한다.",
      "필요한 기능과 안전 범위를 유지한다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
     "required": [
      "구체적 실행 조건을 담는다.",
      "실제 행동·근거와 아직 하지 않음을 구별한다.",
      "필요한 기능과 안전 범위를 유지한다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "explanation": "언제 어디에서 무엇을 할지와 확인 방법을 넣어요. 필요한 밝기와 환기는 유지하고, 실제 날짜와 하지 못한 까닭, 기간 뒤 돌아볼 칸도 비워 두어요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "workbookRef": {
    "id": "c22-s62-u03-w127",
    "no": 127
   },
   "verificationModel": null,
   "diagnosticOverride": {
    "version": "20261106-electricity-readable-workbook",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   },
   "contentVersion": "20261106-electricity-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b127",
     "type": "T18",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 127,
      "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w127",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E8",
      "type": "T18",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "concept": "계획·실행·검토의 증거 설계",
      "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
     },
     "prompt": "교실에서 할 안전·절약 실천 카드를 만드세요. 장소·행동·담당·기간·확인 방법과 미실행 칸을 배치하세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "구체적 실행 조건을 담는다.",
        "실제 행동·근거와 미실행을 구별한다.",
        "필요한 기능과 안전 범위를 유지한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
       "required": [
        "구체적 실행 조건을 담는다.",
        "실제 행동·근거와 미실행을 구별한다.",
        "필요한 기능과 안전 범위를 유지한다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "실천 카드는 표어만 적는 것이 아니라 실제 행동을 확인할 수 있어야 한다. 아직 실행하지 않은 것을 완료 그림으로 표시하지 않는다. 정해진 기간 뒤 검토할 공간도 마련한다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b127",
     "type": "T18",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 127,
      "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w127",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E8",
      "type": "T18",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "concept": "계획·실행·검토의 증거 설계",
      "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
     },
     "prompt": "교실에서 할 안전·절약 실천 카드를 만드세요. 장소·행동·담당·기간·확인 방법과 아직 하지 않음 칸을 배치하세요.",
     "givens": null,
     "choices": null,
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
      "required": [
       "구체적 실행 조건을 담는다.",
       "실제 행동·근거와 아직 하지 않음을 구별한다.",
       "필요한 기능과 안전 범위를 유지한다."
      ],
      "exactStringScoring": false
     },
     "answerContract": {
      "type": "written-explanation",
      "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "구체적 실행 조건을 담는다.",
        "실제 행동·근거와 아직 하지 않음을 구별한다.",
        "필요한 기능과 안전 범위를 유지한다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
       "required": [
        "구체적 실행 조건을 담는다.",
        "실제 행동·근거와 아직 하지 않음을 구별한다.",
        "필요한 기능과 안전 범위를 유지한다."
       ],
       "exactStringScoring": false
      },
      "reviewRequired": true
     },
     "explanation": "실천 카드는 표어만 적는 것이 아니라 실제 행동을 확인할 수 있어야 한다. 아직 실행하지 않은 것을 완료 그림으로 표시하지 않는다. 정해진 기간 뒤 검토할 공간도 마련한다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "workbookRef": {
      "id": "c22-s62-u03-w127",
      "no": 127
     },
     "verificationModel": null,
     "diagnosticOverride": {
      "version": "20261104-electricity-book",
      "typed": null,
      "distractors": null,
      "cloze": null,
      "cells": null
     },
     "contentVersion": "20261104-electricity-book",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b127",
       "type": "T18",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 127,
        "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
        "originalExam": false
       },
       "bookResponseForm": "draw-design",
       "bookQuestionId": "c22-s62-u03-w127",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T18",
        "format": "그림·설계",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-04",
        "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
        "concept": "계획·실행·검토의 증거 설계",
        "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
       },
       "prompt": "교실에서 할 안전·절약 실천 카드를 만드세요. 장소·행동·담당·기간·확인 방법과 미실행 칸을 배치하세요.",
       "givens": null,
       "choices": null,
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
       "answerContract": {
        "type": "written-explanation",
        "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
        "teacherRequired": true,
        "rubric": {
         "required": [
          "구체적 실행 조건을 담는다.",
          "실제 행동·근거와 미실행을 구별한다.",
          "필요한 기능과 안전 범위를 유지한다."
         ],
         "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
         "kind": "drawing",
         "teacherRequired": true,
         "sample": "필요한 밝기·환기 등을 유지하는 구체적 행동을 정하고 실제 날짜·근거를 남길 빈칸, 못 했을 때 이유와 다음 기회, 검토 날짜를 둔다.",
         "required": [
          "구체적 실행 조건을 담는다.",
          "실제 행동·근거와 미실행을 구별한다.",
          "필요한 기능과 안전 범위를 유지한다."
         ],
         "exactStringScoring": false
        }
       },
       "explanation": "실천 카드는 표어만 적는 것이 아니라 실제 행동을 확인할 수 있어야 한다. 아직 실행하지 않은 것을 완료 그림으로 표시하지 않는다. 정해진 기간 뒤 검토할 공간도 마련한다.",
       "standards": [
        "6과15-04"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261104-electricity-book"
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
    "required": [
     "장소·행동·담당·기간·확인 방법을 구체적으로 넣는다.",
     "아직 하지 않음을 표시할 칸을 만든다.",
     "필요한 기능과 안전을 유지할 수 있는 계획을 세운다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "장소·행동·담당·기간·확인 방법을 구체적으로 넣는다.",
      "아직 하지 않음을 표시할 칸을 만든다.",
      "필요한 기능과 안전을 유지할 수 있는 계획을 세운다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "필요한 밝기와 환기를 유지하며 어디에서 무엇을 할지 정해요. 실제 날짜와 확인한 근거, 하지 못한 까닭과 다음 기회를 적을 빈칸을 만들어요. 기간이 지나 돌아볼 날짜도 두어요.",
     "required": [
      "장소·행동·담당·기간·확인 방법을 구체적으로 넣는다.",
      "아직 하지 않음을 표시할 칸을 만든다.",
      "필요한 기능과 안전을 유지할 수 있는 계획을 세운다."
     ],
     "exactStringScoring": false
    },
    "reviewRequired": true
   },
   "diagnosticOverride": {
    "version": "20261116-electricity-workbook-context",
    "typed": null,
    "distractors": null,
    "cloze": null,
    "cells": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s62-u03-b128",
   "type": "T18",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 128,
    "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "originalExam": false
   },
   "bookResponseForm": "draw-design",
   "bookQuestionId": "c22-s62-u03-w128",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u03",
    "area": "운동과 에너지",
    "element": "E8",
    "type": "T18",
    "format": "그림·설계",
    "level": "기본",
    "track": "교과",
    "standard": "6과15-04",
    "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
    "concept": "계획·실행·검토의 증거 설계",
    "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
   },
   "prompt": "실천 결과를 친구에게 설명할 그림판을 그리세요. 계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요.",
   "givens": null,
   "choices": null,
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
    "required": [
     "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
     "required": [
      "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
     ],
     "exactStringScoring": false
    }
   },
   "explanation": "하려던 일과 실제로 한 일을 구별할 칸을 만들어요. 확인한 변화와 아직 알 수 없는 효과도 나누어요. 그림판을 그린 것만으로 실제로 실천하거나 친구에게 설명한 것은 아니에요.",
   "standards": [
    "6과15-04"
   ],
   "originalPromptCopied": false,
   "originalFigureReused": false,
   "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
   },
   "contentVersion": "20261115-representation-response-review",
   "previousVersions": [
    {
     "id": "c22-s62-u03-b128",
     "type": "T18",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 128,
      "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w128",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E8",
      "type": "T18",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "concept": "계획·실행·검토의 증거 설계",
      "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
     },
     "prompt": "실천 결과를 나눌 설명판을 그리세요. 계획·실제 실행·확인한 변화·아직 모르는 효과를 네 구역으로 구별하세요.",
     "givens": null,
     "choices": null,
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
     "answerContract": {
      "type": "written-explanation",
      "sample": "네 구역에 자료 종류·날짜·사용 조건을 남기고 시간 변화와 전기 사용량/요금 미측정을 구별한다. 받은 질문과 다음 확인 공간을 둔다.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "계획과 실제 수행을 나눈다.",
        "확인한 변화와 효과의 한계를 구별한다.",
        "질문·추가 자료·다음 검토를 남긴다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "네 구역에 자료 종류·날짜·사용 조건을 남기고 시간 변화와 전기 사용량/요금 미측정을 구별한다. 받은 질문과 다음 확인 공간을 둔다.",
       "required": [
        "계획과 실제 수행을 나눈다.",
        "확인한 변화와 효과의 한계를 구별한다.",
        "질문·추가 자료·다음 검토를 남긴다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "좋은 결과만 크게 쓰는 대신 근거와 한계를 읽을 수 있게 편집한다. 측정하지 않은 절약량을 꾸며 채우지 않는다. 설명판 제작과 실제로 다른 사람에게 설명한 수행도 따로 확인한다.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "version": 1
    },
    {
     "id": "c22-s62-u03-b128",
     "type": "T18",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 128,
      "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "originalExam": false
     },
     "bookResponseForm": "draw-design",
     "bookQuestionId": "c22-s62-u03-w128",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E8",
      "type": "T18",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "concept": "계획·실행·검토의 증거 설계",
      "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
     },
     "prompt": "실천 결과를 친구에게 설명할 그림판을 그리세요. 계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요.",
     "givens": null,
     "choices": null,
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
      "required": [
       "계획과 실제 수행을 나눈다.",
       "확인한 변화와 효과의 한계를 구별한다.",
       "질문·추가 자료·다음 검토를 남긴다."
      ],
      "exactStringScoring": false
     },
     "answerContract": {
      "type": "written-explanation",
      "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
      "teacherRequired": true,
      "rubric": {
       "required": [
        "계획과 실제 수행을 나눈다.",
        "확인한 변화와 효과의 한계를 구별한다.",
        "질문·추가 자료·다음 검토를 남긴다."
       ],
       "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
       "kind": "drawing",
       "teacherRequired": true,
       "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
       "required": [
        "계획과 실제 수행을 나눈다.",
        "확인한 변화와 효과의 한계를 구별한다.",
        "질문·추가 자료·다음 검토를 남긴다."
       ],
       "exactStringScoring": false
      }
     },
     "explanation": "실제로 확인한 시간 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 자료와 날짜, 사용 조건을 적고 받은 질문과 다음에 확인할 점도 남겨요.",
     "standards": [
      "6과15-04"
     ],
     "originalPromptCopied": false,
     "originalFigureReused": false,
     "evidence": {
      "actualStudentObservation": false,
      "actualPhysicalExperiment": false,
      "dataKind": "authored-practice-or-explicit-model",
      "scienceReview": "manuscript; independent-answer-and-render-review-pending",
      "productRenderReviewed": false
     },
     "contentVersion": "20261106-electricity-readable-workbook",
     "previousVersions": [
      {
       "id": "c22-s62-u03-b128",
       "type": "T18",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 128,
        "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
        "originalExam": false
       },
       "bookResponseForm": "draw-design",
       "bookQuestionId": "c22-s62-u03-w128",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T18",
        "format": "그림·설계",
        "level": "기본",
        "track": "교과",
        "standard": "6과15-04",
        "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
        "concept": "계획·실행·검토의 증거 설계",
        "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
       },
       "prompt": "실천 결과를 나눌 설명판을 그리세요. 계획·실제 실행·확인한 변화·아직 모르는 효과를 네 구역으로 구별하세요.",
       "givens": null,
       "choices": null,
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
       "answerContract": {
        "type": "written-explanation",
        "sample": "네 구역에 자료 종류·날짜·사용 조건을 남기고 시간 변화와 전기 사용량/요금 미측정을 구별한다. 받은 질문과 다음 확인 공간을 둔다.",
        "teacherRequired": true,
        "rubric": {
         "required": [
          "계획과 실제 수행을 나눈다.",
          "확인한 변화와 효과의 한계를 구별한다.",
          "질문·추가 자료·다음 검토를 남긴다."
         ],
         "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
         "kind": "drawing",
         "teacherRequired": true,
         "sample": "네 구역에 자료 종류·날짜·사용 조건을 남기고 시간 변화와 전기 사용량/요금 미측정을 구별한다. 받은 질문과 다음 확인 공간을 둔다.",
         "required": [
          "계획과 실제 수행을 나눈다.",
          "확인한 변화와 효과의 한계를 구별한다.",
          "질문·추가 자료·다음 검토를 남긴다."
         ],
         "exactStringScoring": false
        }
       },
       "explanation": "좋은 결과만 크게 쓰는 대신 근거와 한계를 읽을 수 있게 편집한다. 측정하지 않은 절약량을 꾸며 채우지 않는다. 설명판 제작과 실제로 다른 사람에게 설명한 수행도 따로 확인한다.",
       "standards": [
        "6과15-04"
       ],
       "originalPromptCopied": false,
       "originalFigureReused": false,
       "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
       },
       "version": 1
      }
     ],
     "version": "20261106-electricity-readable-workbook",
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
    "required": [
     "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나눈다.",
     "계획과 실제 수행, 확인한 변화와 알 수 없는 효과를 구별할 그림판을 그린다."
    ],
    "exactStringScoring": false
   },
   "answerContract": {
    "type": "written-explanation",
    "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
    "teacherRequired": true,
    "rubric": {
     "required": [
      "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나눈다.",
      "계획과 실제 수행, 확인한 변화와 알 수 없는 효과를 구별할 그림판을 그린다."
     ],
     "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
    },
    "seasonContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
     "required": [
      "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나눈다.",
      "계획과 실제 수행, 확인한 변화와 알 수 없는 효과를 구별할 그림판을 그린다."
     ],
     "exactStringScoring": false
    }
   }
  }
 }
];
const bankCache=new WeakMap();
export function electricityContextItems(rows,unit){
 if(unit!=='c22-s62-u03'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:ELECTRICITY_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withElectricityContextClassroom(unit,book){
 const rows=electricityContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
