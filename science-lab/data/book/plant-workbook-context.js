export const PLANT_CONTEXT_VERSION='20261116-plant-workbook-context';
// 전체 이전 문항과 자료가 같은 때만 검토한 질문·기준·자료를 적용한다.
const review={
 "patches": [
  {
   "previous": {
    "id": "c22-s61-u03-w043",
    "no": 43,
    "section": 3,
    "form": "written",
    "type": "T06",
    "topic": "색소가 없을 때",
    "prompt": "예상과 달리 줄기 안의 붉은 부분을 찾지 못했어요. 관찰한 결과를 어떻게 적고, 무엇을 더 확인할지 두 가지를 쓰세요.",
    "answer": "붉은 부분을 찾지 못했다고 적어요. 색소 물에 둔 시간과 줄기의 상태, 자른 위치와 조명을 확인해요. 예상한 그림을 결과처럼 그려 넣지 않아요.",
    "explanation": "붉은 부분을 찾지 못했다는 결과를 그대로 적어요. 색소 물에 둔 시간과 줄기의 상태, 자른 위치와 조명을 더 확인해요. 이 결과만으로 물이 전혀 이동하지 않았다고 할 수는 없어요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "requirements": [
     "색 자취 미확인 상태 보존",
     "시간/표본 상태 확인",
     "관찰 위치/조명 확인 또는 값 꾸미기 배제"
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "색 자취 미확인 상태 보존",
      "시간/표본 상태 확인",
      "관찰 위치/조명 확인 또는 값 꾸미기 배제"
     ]
    },
    "lines": 8,
    "criteria": "색 자취 미확인 상태 보존 / 시간/표본 상태 확인 / 관찰 위치/조명 확인 또는 값 꾸미기 배제"
   },
   "fields": {
    "criteria": "붉은 자취를 찾지 못했다는 실제 관찰 결과를 그대로 적는다. / 시간·줄기 상태·자른 위치·조명 등 다시 확인할 타당한 조건 두 가지를 제시한다.",
    "requirements": [
     "붉은 자취를 찾지 못했다는 실제 관찰 결과를 그대로 적는다.",
     "시간·줄기 상태·자른 위치·조명 등 다시 확인할 타당한 조건 두 가지를 제시한다."
    ],
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "붉은 자취를 찾지 못했다는 실제 관찰 결과를 그대로 적는다.",
      "시간·줄기 상태·자른 위치·조명 등 다시 확인할 타당한 조건 두 가지를 제시한다."
     ]
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u03-w058",
    "no": 58,
    "section": 4,
    "form": "multi",
    "type": "T08",
    "topic": "아직 말할 수 없는 것",
    "prompt": "실험 전에 녹말이 있었는지 확인하지 않았고, 실험 뒤 잎의 반응도 아직 보지 못했어요. 필요한 행동을 모두 고르세요.",
    "answer": "②, ⑤",
    "explanation": "예상한 색을 실제 결과처럼 쓰면 안 돼요. 실험 전 비교용 잎의 반응과 실험 뒤 두 잎의 반응을 직접 확인한 다음에 결론을 정해요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "choices": [
     "두 잎 모두 반응이 없었다고 꾸민다.",
     "실험 뒤 반응을 직접 확인하고 그전에는 결론을 정하지 않는다.",
     "원하는 결론과 다른 반응은 지운다.",
     "빛을 받은 잎은 무조건 청람색이라고 결과 칸에 쓴다.",
     "실험 전에 녹말이 있었는지 확인할 비교용 잎을 준비한다."
    ],
    "key": [
     1,
     4
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "multi-choice",
     "answers": [
      1,
      4
     ]
    },
    "criteria": "처리 뒤 반응을 실제로 확인하고 아직은 결론을 보류한다. / 처리 전 상태를 확인할 비교 시료를 준비한다.를 모두 고르고 다른 보기를 넣지 않는다."
   },
   "fields": {
    "choices": [
     "두 잎 모두 반응이 없었다고 꾸민다.",
     "실험 뒤 반응을 직접 확인하고 그전에는 결론을 정하지 않는다.",
     "원하는 결론과 다른 반응은 지운다.",
     "빛을 받은 잎은 무조건 청람색이라고 결과 칸에 쓴다.",
     "다시 실험할 때에는 실험 전 비교용 잎의 녹말 반응부터 확인한다."
    ],
    "explanation": "이번에는 실험 뒤의 반응을 확인하되, 실험 전 상태를 몰라 새로 생긴 녹말이라고 단정할 수 없어요. 다시 실험할 때에는 실험 전 비교용 잎의 녹말 반응부터 확인해요.",
    "criteria": "실험 뒤의 반응을 실제로 확인하고 아직은 결론을 정하지 않는 보기와, 다시 실험할 때 실험 전 비교용 잎의 녹말 반응부터 확인하는 보기를 모두 고른다."
   }
  },
  {
   "previous": {
    "id": "c22-s61-u03-w059",
    "no": 59,
    "section": 4,
    "form": "written",
    "type": "T08",
    "topic": "두 잎 모두 반응",
    "prompt": "빛을 준 잎과 가린 잎이 모두 청람색이었습니다. 이 결과를 보존하며 다시 확인할 점을 쓰세요.",
    "answer": "두 잎 모두 녹말 반응이 있었다고 적어요. 실험 전에 녹말이 있었는지, 빛을 제대로 가렸는지와 잎의 이름표를 다시 확인해요. 바로 빛과 관계없이 녹말이 만들어졌다고 하지 않아요.",
    "explanation": "두 잎 모두 녹말 반응이 있었다는 기록을 남겨요. 처음부터 녹말이 있었는지, 빛을 가린 방법이 맞았는지와 잎의 이름표를 다시 확인해요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "requirements": [
     "두 반응 그대로 기록",
     "처리 전 상태/차단/시료 확인",
     "빛과 무관하다는 성급한 일반화 배제"
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "두 반응 그대로 기록",
      "처리 전 상태/차단/시료 확인",
      "빛과 무관하다는 성급한 일반화 배제"
     ]
    },
    "lines": 8,
    "criteria": "두 반응 그대로 기록 / 처리 전 상태/차단/시료 확인 / 빛과 무관하다는 성급한 일반화 배제"
   },
   "fields": {
    "explanation": "두 잎 모두 녹말 반응이 있었다는 기록을 남겨요. 실험 전 비교 기록, 빛을 가린 방법과 잎의 이름표를 확인해요. 실험 전 기록이 없다면 그때의 상태를 나중에 새 잎으로 확인할 수는 없으므로, 다시 실험할 때 실험 전 비교용 잎의 반응부터 살펴요."
   }
  },
  {
   "previous": {
    "id": "c22-s61-u03-w062",
    "no": 62,
    "section": 4,
    "form": "order",
    "type": "T08",
    "topic": "근거를 읽는 순서",
    "prompt": "선생님이 준비한 자료로 잎의 녹말 반응을 비교하려고 해요. 순서대로 기호를 쓰세요.",
    "answer": "ㄴ → ㄱ → ㄹ → ㄷ",
    "explanation": "먼저 실험 전 비교용 잎에 녹말이 있었는지와 같게 한 조건을 확인해요. 그다음 빛을 받은 잎과 가린 잎의 반응을 비교하고 이번 결과로 알게 된 점을 써요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "given": [
     "ㄱ 같게 한 조건과 빛을 다르게 한 점을 확인한다.",
     "ㄴ 실험 전 비교용 잎에 녹말 반응이 있었는지 읽는다.",
     "ㄷ 이번 결과로 알게 된 점을 쓴다.",
     "ㄹ 실험 뒤 빛을 받은 잎과 가린 잎의 반응을 비교한다."
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "ordered-label-sequence",
     "sequence": [
      "ㄴ",
      "ㄱ",
      "ㄹ",
      "ㄷ"
     ]
    },
    "criteria": "「ㄴ → ㄱ → ㄹ → ㄷ」 또는 명시한 동등 표현. 처리 전 상태와 같게 한 조건을 먼저 확인하고 뒤의 실제 검출 결과를 비교하여 결론 범위를 정해요."
   },
   "fields": {
    "answer": "ㄴ → ㄱ → ㄹ → ㄷ 또는 ㄱ → ㄴ → ㄹ → ㄷ",
    "accepted": [
     "ㄴ → ㄱ → ㄹ → ㄷ",
     "ㄱ → ㄴ → ㄹ → ㄷ"
    ],
    "explanation": "실험 전 비교용 잎의 녹말 반응과 같게 한 조건을 먼저 확인해요. 이 두 자료를 읽는 순서는 바뀌어도 괜찮아요. 그다음 실험 뒤 두 잎의 반응을 비교하고 알게 된 점을 써요.",
    "criteria": "ㄴ → ㄱ → ㄹ → ㄷ 또는 ㄱ → ㄴ → ㄹ → ㄷ를 인정한다. 실험 전 상태와 비교 조건을 모두 확인한 뒤 실험 뒤 반응을 비교하고 알게 된 점을 쓴다.",
    "responseContract": {
     "kind": "ordered-label-sequence",
     "sequence": [
      "ㄴ",
      "ㄱ",
      "ㄹ",
      "ㄷ"
     ],
     "sequences": [
      [
       "ㄴ",
       "ㄱ",
       "ㄹ",
       "ㄷ"
      ],
      [
       "ㄱ",
       "ㄴ",
       "ㄹ",
       "ㄷ"
      ]
     ]
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u03-w112",
    "no": 112,
    "section": 7,
    "form": "draw",
    "type": "T12",
    "topic": "열매와 씨의 구조 그리기",
    "prompt": "직접 관찰했거나 자료에서 확인한 열매나 씨 한 가지를 그리세요. 부분의 이름을 붙이고, 씨를 보호하거나 퍼지는 데 도움이 되는 특징을 설명하세요.",
    "answer": "확인한 열매나 씨를 크게 그리고, 씨를 둘러싼 부분이나 날개와 갈고리 등에 이름을 붙여요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고, 직접 보았는지 어떤 자료에서 찾았는지도 적어요.",
    "explanation": "실제로 확인한 열매나 씨를 크게 그리고, 씨를 보호하는 부분이나 날개와 갈고리 등을 표시해요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고 어디서 알아보았는지도 적어요.",
    "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
    "requirements": [
     "대상과 관찰/조사 출처",
     "확인한 구조의 그림과 이름표",
     "보호/퍼짐 역할을 구조 근거로 설명"
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "drawing",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
     ]
    },
    "lines": 0,
    "drawing": "large",
    "criteria": "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
   },
   "fields": {
    "requirements": [
     "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
    ]
   }
  },
  {
   "previous": {
    "id": "c22-s61-u03-w123",
    "no": 123,
    "section": 8,
    "form": "written",
    "type": "T14",
    "topic": "받은 질문으로 고치기",
    "prompt": "친구가 “줄기가 잎을 받친다는 근거가 그림 어디에 있니?”라고 물었습니다. 자료를 어떻게 보완하고 설명할지 쓰세요.",
    "answer": "잎이 줄기와 연결된 부분을 크게 표시하고 이름표를 붙여요. 그 부분을 보고 줄기가 잎을 받쳐 준다고 설명하는 문장을 덧붙여요.",
    "explanation": "잎이 줄기와 연결된 부분을 크게 표시하고 이름표를 붙여요. 그 부분을 보고 줄기가 잎을 받친다고 설명할 수 있게 문장을 덧붙여요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "requirements": [
     "연결 부분 확대/표시",
     "관찰과 지지 역할 연결",
     "보완 내용을 실제 다시 설명할 계획/행동"
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-03",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "연결 부분 확대/표시",
      "관찰과 지지 역할 연결",
      "보완 내용을 실제 다시 설명할 계획/행동"
     ]
    },
    "lines": 8,
    "criteria": "연결 부분 확대/표시 / 관찰과 지지 역할 연결 / 보완 내용을 실제 다시 설명할 계획/행동"
   },
   "fields": {
    "criteria": "줄기와 잎의 연결 부분을 확대하거나 표시하는 방법을 쓴다. / 그 모습을 근거로 줄기가 잎을 받치는 역할을 설명한다.",
    "requirements": [
     "줄기와 잎의 연결 부분을 확대하거나 표시하는 방법을 쓴다.",
     "그 모습을 근거로 줄기가 잎을 받치는 역할을 설명한다."
    ],
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "줄기와 잎의 연결 부분을 확대하거나 표시하는 방법을 쓴다.",
      "그 모습을 근거로 줄기가 잎을 받치는 역할을 설명한다."
     ]
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u03-w124",
    "no": 124,
    "section": 8,
    "form": "written",
    "type": "T14",
    "topic": "전체 사진과 부분 확대",
    "prompt": "전체 식물 사진과 확대 그림이 따로 있어 친구가 어느 부분인지 헷갈려 해요. 두 그림과 그 부분이 하는 일의 설명을 어떻게 연결하면 좋을까요?",
    "answer": "전체 사진에서 확대한 부분을 테두리나 이름표로 표시하고 확대 그림과 이어요. 확대 그림에 부분의 이름과 하는 일을 적고 어디서 관찰하거나 알아보았는지도 밝혀요.",
    "explanation": "전체 사진에서 어느 부분을 확대한 것인지 먼저 표시해요. 확대 그림에 구조 이름과 하는 일을 적고 두 그림을 연결하면 친구가 같은 부분임을 알 수 있어요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "requirements": [
     "전체와 확대한 부분의 위치 연결",
     "구조 이름과 기능 문장 연결",
     "관찰/자료 근거와 출처 표시"
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-03",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "전체 사진에서 확대한 부분의 위치를 표시하고 두 그림을 연결해요. 확대 그림에 그 부분의 이름과 하는 일을 나타내는 방법을 설명해요."
     ]
    },
    "lines": 8,
    "criteria": "전체 사진에서 확대한 부분의 위치를 표시하고 두 그림을 연결해요. 확대 그림에 그 부분의 이름과 하는 일을 나타내는 방법을 설명해요."
   },
   "fields": {
    "requirements": [
     "전체 사진에서 확대한 부분의 위치를 표시하고 두 그림을 연결해요. 확대 그림에 그 부분의 이름과 하는 일을 나타내는 방법을 설명해요."
    ]
   }
  }
 ],
 "directions": [
  {
   "previous": {
    "section": "현미경으로 만나는 세포 · 4~5",
    "title": "세포 구조의 이름을 알아보아요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w004",
       "c22-s61-u03-w005"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "핵·세포막·세포벽은 식물 세포의 구조 이름이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 세포막이 물질의 출입과 관련되고 세포벽이 세포를 지지함을 배워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "그림에서 이름을 배운 구조와 실제 표본에서 내가 구별해 본 구조를 나누어 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w004",
     "no": 4,
     "section": 1,
     "form": "multi",
     "type": "T02",
     "topic": "실제 관찰 준비",
     "prompt": "식물 세포를 실제로 관찰하는 준비로 알맞은 것을 모두 고르세요.",
     "answer": "②, ⑤",
     "explanation": "현미경에 표본을 놓고 낮은 배율부터 관찰해요. 사진만 본 것과 현미경으로 직접 본 것은 구별해요. 보이지 않은 구조를 보았다고 그려 넣지 않아요.",
     "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
     "choices": [
      "세포 사진만 본 뒤 현미경 관찰 완료라고 적는다.",
      "교사 안내에 따라 낮은 배율에서 먼저 표본을 찾는다.",
      "초점을 맞추려고 렌즈를 표본에 세게 누른다.",
      "안 보인 핵을 교재 그림대로 관찰 칸에 채운다.",
      "교사가 준비한 양파 표피 표본을 현미경에 놓는다."
     ],
     "key": [
      1,
      4
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       1,
       4
      ]
     },
     "criteria": "교사 안내에 따라 낮은 배율에서 먼저 표본을 찾는다. / 교사가 준비한 양파 표피 표본을 현미경에 놓는다.를 모두 고르고 다른 보기를 넣지 않는다."
    },
    {
     "id": "c22-s61-u03-w005",
     "no": 5,
     "section": 1,
     "form": "match",
     "type": "T01",
     "topic": "관찰 구조 이름",
     "prompt": "보기: ㄱ 핵 / ㄴ 세포막 / ㄷ 세포벽. 제시한 이름표의 설명과 연결하세요.",
     "answer": "(1) ㄷ (2) ㄴ (3) ㄱ",
     "explanation": "바깥쪽의 벽 구조는 세포벽이므로 (1)은 ㄷ이에요. 그 안쪽의 얇은 막은 세포막이므로 (2)는 ㄴ, 염색한 표본에서 이름을 붙인 작은 구조인 핵은 (3)의 ㄱ이에요.",
     "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
     "parts": [
      "(1) 식물 세포의 바깥쪽에 있는 벽 구조 [ ]",
      "(2) 세포벽 안쪽의 얇은 막 구조 [ ]",
      "(3) 염색한 표본에서 확인해 이름을 붙인 작은 구조 [ ]"
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "answerPerPart": true,
     "responseContract": {
      "kind": "ordered-label-parts",
      "answers": [
       "ㄷ",
       "ㄴ",
       "ㄱ"
      ]
     },
     "criteria": "「(1) ㄷ (2) ㄴ (3) ㄱ」 또는 명시한 동등 표현. 이 활동에서는 구조의 이름을 구별해요. 자세한 기능을 암기하거나 관찰하지 못한 구조까지 보았다고 하지 않아요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "그림에서 이름을 배운 구조와 실제 표본에서 내가 구별해 본 구조를 나누어 써요.",
     "value": "핵·세포막·세포벽의 이름을 설명과 연결하고, 실제 표본에서는 모두 뚜렷하게 보이지 않을 수 있는 까닭을 생각해요."
    }
   ]
  },
  {
   "previous": {
    "section": "현미경으로 만나는 세포 · 9~10",
    "title": "보인 것과 추측한 것을 구별해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w009",
       "c22-s61-u03-w010"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "관찰한 모양과 위치를 보고 구조를 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "일반적인 광학 현미경에서는 세포막이 세포벽에 붙어 있어 둘을 따로 구별하기 어려울 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "그림에 붙일 이름표를 어떤 관찰로 정했는지 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w009",
     "no": 9,
     "section": 1,
     "form": "short",
     "type": "T02",
     "topic": "관찰 기록 고르기",
     "prompt": "기록 가: 교재에서 베낀 그림. 기록 나: 내가 현미경에서 본 모양과 관찰 배율. 직접 관찰의 근거가 담긴 기록의 기호를 쓰세요.",
     "answer": "나",
     "explanation": "나에는 실제로 본 모양과 배율이 있어요. 교재 그림은 비교 자료로 쓸 수 있지만 나의 직접 관찰 결과가 되지는 않아요.",
     "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "나"
      ]
     },
     "criteria": "「나」 또는 명시한 동등 표현. 나에는 실제로 본 모양과 배율이 있어요. 교재 그림은 비교 자료로 쓸 수 있지만 나의 직접 관찰 결과가 되지는 않아요."
    },
    {
     "id": "c22-s61-u03-w010",
     "no": 10,
     "section": 1,
     "form": "multi",
     "type": "T02",
     "topic": "관찰과 추측",
     "prompt": "직접 관찰한 내용으로 남길 수 있는 것을 모두 고르세요.",
     "answer": "②, ④",
     "explanation": "현미경에서 보인 모양과 잘 구별되지 않은 점을 그대로 적어요. 교재에서 본 색이나 위치를 직접 관찰한 것처럼 쓰지 않아요.",
     "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
     "choices": [
      "핵이 안 보여도 그림에서 외운 위치를 관찰로 적는다.",
      "여러 칸 모양의 경계가 이어져 보였다고 적는다.",
      "양파 표피 한 곳을 보고 모든 식물 세포의 모양이 같다고 쓴다.",
      "핵은 뚜렷하게 구별하지 못했다고 적는다.",
      "사진을 확대했으니 직접 현미경을 썼다고 적는다."
     ],
     "key": [
      1,
      3
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       1,
       3
      ]
     },
     "criteria": "여러 칸 모양의 경계가 이어져 보였다고 적는다. / 핵은 뚜렷하게 구별하지 못했다고 적는다.를 모두 고르고 다른 보기를 넣지 않는다."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "그림에 붙일 이름표를 어떤 관찰로 정했는지 써요.",
     "value": "9번의 두 기록 중 직접 관찰의 근거가 담긴 기록을 고르고, 실제로 보이지 않은 구조를 그려 넣으면 안 되는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "현미경으로 만나는 세포 · 13~14",
    "title": "모식도와 관찰 모습을 비교해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w013",
       "c22-s61-u03-w014"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "모식도는 구조를 알아보기 쉽게 나타낸 그림이에요."
     },
     {
      "title": "더 알아보기",
      "text": "세포 그림의 색과 크기는 구조를 구별하려고 실제와 다르게 표현하기도 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "설명 그림인 모식도에서는 잘 보이지만 실제 표본에서는 흐려서 구별하기 어려운 부분을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w013",
     "no": 13,
     "section": 1,
     "form": "choice",
     "type": "T01",
     "topic": "모식도와 실제 관찰",
     "prompt": "식물 세포의 설명 그림을 보고 실제 표본을 관찰했어요. 알맞은 설명을 고르세요.",
     "answer": "⑤ 실제 표본에서 보인 구조와 불분명한 부분을 구별한다.",
     "explanation": "설명 그림과 실제 표본의 모습이 꼭 같지는 않아요. 핵이나 경계가 흐리게 보였다고 그 구조가 없다고 정하지 말고, 실제로 보인 점과 잘 구별되지 않은 점을 나누어요.",
     "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
     "choices": [
      "설명 그림에서 본 핵의 색과 위치를 실제로 보이지 않은 곳에도 똑같이 채운다.",
      "설명 그림에 칠한 색이 모든 실제 세포의 색과 같다.",
      "핵이 불분명하면 그 세포에는 핵이 없다고 정한다.",
      "세포벽 한 칸이 잎 한 장 전체라고 정한다.",
      "실제 표본에서 보인 구조와 불분명한 부분을 구별한다."
     ],
     "key": 4,
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "single-choice",
      "answer": 4
     },
     "criteria": "「실제 표본에서 보인 구조와 불분명한 부분을 구별한다.」을 고른다. 모식도는 구조를 이해하기 쉽게 나타낸 자료이고 실제 관찰은 표본에서 보인 범위를 담아요. 경계나 핵이 불분명하다고 구조가 없다고 단정하지 않아요."
    },
    {
     "id": "c22-s61-u03-w014",
     "no": 14,
     "section": 1,
     "form": "order",
     "type": "T02",
     "topic": "관찰 순서",
     "prompt": "표본은 교사가 안전하게 준비했습니다. 관찰 흐름을 순서대로 쓰세요.",
     "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
     "explanation": "먼저 표본을 놓고 낮은 배율인지 확인해요. 조명과 초점을 맞추어 보인 모양을 그린 뒤, 확인한 구조에 이름을 붙여요.",
     "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
     "given": [
      "ㄱ 보인 모양과 불분명한 부분을 그린다.",
      "ㄴ 표본을 놓고 낮은 배율을 확인한다.",
      "ㄷ 교사 안내로 조명과 초점을 맞춘다.",
      "ㄹ 관찰 그림에 확인한 이름을 붙인다."
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "ordered-label-sequence",
      "sequence": [
       "ㄴ",
       "ㄷ",
       "ㄱ",
       "ㄹ"
      ]
     },
     "criteria": "「ㄴ → ㄷ → ㄱ → ㄹ」 또는 명시한 동등 표현. 표본과 낮은 배율을 먼저 확인하고 초점을 맞춰요. 보인 것을 그린 뒤 구조 이름과 대조해요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "설명 그림인 모식도에서는 잘 보이지만 실제 표본에서는 흐려서 구별하기 어려운 부분을 적어요.",
     "value": "핵이나 경계가 흐리게 보였다고 그 구조가 없다고 말할 수 있을까요? 설명 그림과 실제 표본의 차이를 생각해요."
    }
   ]
  },
  {
   "previous": {
    "section": "뿌리의 구조와 물 흡수 · 20~21",
    "title": "비교할 조건을 같게 맞추어요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w020",
       "c22-s61-u03-w021"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "뿌리의 유무 외에 용기와 물의 양, 관찰 시간을 같게 해요."
     },
     {
      "title": "더 알아보기",
      "text": "식물의 물 흡수에는 뿌리와 주변 용액 사이의 물 이동도 관련돼요. 중학교에서는 이를 삼투와 연결해 배워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "실험에서 달리할 조건과 같게 할 조건을 나누어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w020",
     "no": 20,
     "section": 2,
     "form": "multi",
     "type": "T04",
     "topic": "맞출 조건",
     "prompt": "뿌리 유무를 달리하여 물의 감소를 비교할 때 같게 맞출 조건을 모두 고르세요.",
     "answer": "①, ③, ⑤",
     "explanation": "뿌리가 있는지 없는지만 다르게 해야 해요. 물의 양과 용기, 잎의 상태, 관찰 시간과 주변 환경이 다르면 뿌리 때문에 생긴 차이를 알기 어려워요.",
     "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
     "choices": [
      "처음 물의 양과 용기",
      "한쪽만 비교 시간을 두 배로 하기",
      "빛과 온도 등 주변 환경",
      "뿌리가 없는 쪽에만 잎을 더 많이 남기기",
      "비교 시간과 잎의 상태"
     ],
     "key": [
      0,
      2,
      4
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       2,
       4
      ]
     },
     "criteria": "처음 물의 양과 용기 / 빛과 온도 등 주변 환경 / 비교 시간과 잎의 상태를 모두 고르고 다른 보기를 넣지 않는다."
    },
    {
     "id": "c22-s61-u03-w021",
     "no": 21,
     "section": 2,
     "form": "match",
     "type": "T03",
     "topic": "기관과 물",
     "prompt": "보기: ㄱ 뿌리 / ㄴ 줄기 / ㄷ 잎. 물과 관련된 역할을 연결하세요.",
     "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
     "explanation": "물은 뿌리에서 흡수되어 줄기를 지나 잎으로 이동하고 잎에서 수증기로 나갈 수 있어요. 역할은 연결되어 있어요.",
     "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
     "parts": [
      "(1) 흡수된 물이 다른 기관으로 가는 통로 [ ]",
      "(2) 물의 일부가 수증기로 나가는 주요 기관 [ ]",
      "(3) 흙 속의 물을 흡수하는 기관 [ ]"
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "answerPerPart": true,
     "responseContract": {
      "kind": "ordered-label-parts",
      "answers": [
       "ㄴ",
       "ㄷ",
       "ㄱ"
      ]
     },
     "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현. 물은 뿌리에서 흡수되어 줄기를 지나 잎으로 이동하고 잎에서 수증기로 나갈 수 있어요. 역할은 연결되어 있어요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "식물의 물 흡수에는 뿌리와 주변 용액 사이의 물 이동도 관련돼요. 중학교에서는 이를 삼투와 연결해 배워요.",
     "value": "뿌리와 주변 용액 사이에서도 물이 이동해요. 고등학교에서는 세포막을 사이에 둔 물의 이동을 삼투와 연결해 배워요."
    }
   ]
  },
  {
   "previous": {
    "section": "줄기를 따라 움직이는 물 · 36~37",
    "title": "줄기를 자른 방향을 확인해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w036",
       "c22-s61-u03-w037"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "색이 보인 위치와 줄기를 자른 방향을 함께 읽어요."
     },
     {
      "title": "더 알아보기",
      "text": "외떡잎식물과 쌍떡잎식물은 줄기 관다발의 배열에서 차이가 나타나요."
     },
     {
      "title": "내가 정리할 것",
      "text": "가로 단면과 세로 단면의 이름을 붙여요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w036",
     "no": 36,
     "section": 3,
     "form": "multi",
     "type": "T06",
     "topic": "단면 관찰의 근거",
     "prompt": "색소 물이 줄기의 어느 부분으로 이동했는지 알아보려고 해요. 확인할 자료를 모두 고르세요.",
     "answer": "①, ②, ④",
     "explanation": "색소 물에 넣기 전 색과 넣어 둔 시간, 잘라 본 방향을 확인해요. 선생님이 준비한 가로와 세로의 자른 면에서 붉은 부분이 어디에 보이는지 비교해요.",
     "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
     "choices": [
      "색소 물에 둔 시간과 비교할 줄기",
      "넣기 전 줄기의 색",
      "그 식물의 꽃잎과 꽃받침의 개수",
      "선생님이 준비한 가로와 세로로 자른 면의 색 위치",
      "그 식물의 잎 가장자리에 난 톱니 모양"
     ],
     "key": [
      0,
      1,
      3
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       1,
       3
      ]
     },
     "criteria": "색소 물에 둔 시간과 비교 표본 / 넣기 전 줄기의 색 / 교사가 준비한 가로/세로 단면의 색 위치를 모두 고르고 다른 보기를 넣지 않는다."
    },
    {
     "id": "c22-s61-u03-w037",
     "no": 37,
     "section": 3,
     "form": "match",
     "type": "T06",
     "topic": "자른 방향과 단서",
     "prompt": "보기: ㄱ 가로로 자른 면 / ㄴ 길게 자른 면 / ㄷ 자르기 전 비교할 줄기. 설명과 연결하세요.",
     "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
     "explanation": "세로로 자른 면에서는 길게 이어진 붉은 부분을 보므로 (1)은 ㄴ이에요. 자르기 전 줄기는 원래 색을 비교하므로 (2)는 ㄷ, 가로로 자른 면의 색 위치를 보는 (3)은 ㄱ이에요.",
     "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
     "parts": [
      "(1) 길게 이어진 붉은 부분을 관찰 [ ]",
      "(2) 색소 물에 넣기 전에도 붉었는지 확인 [ ]",
      "(3) 가로로 자른 면에서 붉은색이 보이는 위치를 비교 [ ]"
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "answerPerPart": true,
     "responseContract": {
      "kind": "ordered-label-parts",
      "answers": [
       "ㄴ",
       "ㄷ",
       "ㄱ"
      ]
     },
     "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현. 가로로 자르면 통로 위치가 점처럼, 길게 자르면 길 방향으로 이어진 모습을 볼 수 있어요. 실제 관찰과 비교한 범위에서 설명해요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "가로 단면과 세로 단면의 이름을 붙여요.",
     "value": "줄기를 가로로 자른 면과 길게 자른 면에서 붉은 자취가 어떻게 다르게 보이는지 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "잎이 만드는 양분의 근거 · 61~62",
    "title": "실험 준비와 결과 해석",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w061",
       "c22-s61-u03-w062"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "잎의 녹말 검출은 준비된 시료의 반응을 관찰해 해석해요."
     },
     {
      "title": "더 알아보기",
      "text": "잎의 초록색을 제거하면 아이오딘 용액에 의한 색 변화를 구별하기 쉬워져요."
     },
     {
      "title": "내가 정리할 것",
      "text": "약품을 처리한 잎에서 무엇을 관찰할지 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w061",
     "no": 61,
     "section": 4,
     "form": "choice",
     "type": "T08",
     "topic": "실험 조작의 담당",
     "prompt": "잎에 녹말이 있는지 확인하려면 약품과 뜨거운 기구가 필요해요. 알맞은 관찰 방법은?",
     "answer": "③ 선생님이 안전하게 준비한 잎을 안내에 따라 관찰한다.",
     "explanation": "약품을 사용하거나 가열하는 준비는 선생님이 맡아요. 학생은 준비된 잎을 안내에 따라 관찰하며, 약품을 마음대로 섞거나 뜨거운 용기를 맨손으로 옮기지 않아요.",
     "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
     "choices": [
      "뜨거운 용기를 맨손으로 옮긴다.",
      "도구 이름을 몰라도 먼저 임의로 약품을 섞는다.",
      "선생님이 안전하게 준비한 잎을 안내에 따라 관찰한다.",
      "교사의 시범을 보았으므로 약품 취급 안내 없이 같은 과정을 혼자 반복한다.",
      "약품을 맛보아 녹말 유무를 확인한다."
     ],
     "key": 2,
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "single-choice",
      "answer": 2
     },
     "criteria": "「교사가 안전하게 처리한 시료를 안내에 따라 관찰한다.」을 고른다. 약품과 가열·뜨거운 시료는 교사가 준비·취급하고 학생은 안내에 따라 관찰해요. 학생에게 직접 알코올 가열을 기본 과제로 요구하지 않아요."
    },
    {
     "id": "c22-s61-u03-w062",
     "no": 62,
     "section": 4,
     "form": "order",
     "type": "T08",
     "topic": "근거를 읽는 순서",
     "prompt": "선생님이 준비한 자료로 잎의 녹말 반응을 비교하려고 해요. 순서대로 기호를 쓰세요.",
     "answer": "ㄴ → ㄱ → ㄹ → ㄷ",
     "explanation": "먼저 실험 전 비교용 잎에 녹말이 있었는지와 같게 한 조건을 확인해요. 그다음 빛을 받은 잎과 가린 잎의 반응을 비교하고 이번 결과로 알게 된 점을 써요.",
     "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
     "given": [
      "ㄱ 같게 한 조건과 빛을 다르게 한 점을 확인한다.",
      "ㄴ 실험 전 비교용 잎에 녹말 반응이 있었는지 읽는다.",
      "ㄷ 이번 결과로 알게 된 점을 쓴다.",
      "ㄹ 실험 뒤 빛을 받은 잎과 가린 잎의 반응을 비교한다."
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "ordered-label-sequence",
      "sequence": [
       "ㄴ",
       "ㄱ",
       "ㄹ",
       "ㄷ"
      ]
     },
     "criteria": "「ㄴ → ㄱ → ㄹ → ㄷ」 또는 명시한 동등 표현. 처리 전 상태와 같게 한 조건을 먼저 확인하고 뒤의 실제 검출 결과를 비교하여 결론 범위를 정해요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "잎의 녹말 검출은 준비된 시료의 반응을 관찰해 해석해요.",
     "value": "선생님이 준비한 잎의 녹말 반응을 관찰하고, 실험 전 상태와 빛 조건을 함께 비교해요."
    }
   ]
  },
  {
   "previous": {
    "section": "함께 일하는 식물의 기관 · 81~83",
    "title": "물은 어떤 기관을 지날까요?",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w081",
       "c22-s61-u03-w082",
       "c22-s61-u03-w083"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "흙의 물이 뿌리로 들어와 줄기를 지나 잎으로 이동해요."
     },
     {
      "title": "더 알아보기",
      "text": "뿌리와 잎은 줄기의 관다발로 이어져 있어 한 기관의 상태가 다른 기관에도 영향을 줄 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "물의 이동을 나타내는 화살표에 기관 이름을 붙여요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w081",
     "no": 81,
     "section": 6,
     "form": "choice",
     "type": "T13",
     "topic": "물의 이동 길",
     "prompt": "흙에서 자라는 식물에서 흡수한 물이 잎으로 이동하는 연결을 고르세요.",
     "answer": "④ 뿌리 → 줄기 → 잎",
     "explanation": "흙 속 물을 뿌리가 흡수하고 줄기를 지나 잎으로 보내요. 기관은 물의 이동으로 연결돼요.",
     "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
     "choices": [
      "열매 → 꽃 → 흙",
      "잎 → 흙 → 꽃가루",
      "씨 → 꽃가루 → 잎",
      "뿌리 → 줄기 → 잎",
      "꽃가루 → 꽃잎 → 뿌리"
     ],
     "key": 3,
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "single-choice",
      "answer": 3
     },
     "criteria": "「뿌리 → 줄기 → 잎」을 고른다. 흙 속 물을 뿌리가 흡수하고 줄기를 지나 잎으로 보내요. 기관은 물의 이동으로 연결돼요."
    },
    {
     "id": "c22-s61-u03-w082",
     "no": 82,
     "section": 6,
     "form": "blank",
     "type": "T13",
     "topic": "기관의 관계",
     "prompt": "식물 기관은 각자 하는 일이 있지만 물과 양분의 [ ]으로 서로 연결돼요.",
     "answer": "이동",
     "explanation": "뿌리가 흡수한 물은 줄기를 지나 잎으로 가요. 잎에서 만든 양분은 다른 기관이 자라거나 저장하는 데 쓰여요. 물과 양분의 이동으로 기관들이 연결되어 있어요.",
     "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "이동"
      ]
     },
     "criteria": "「이동」 또는 명시한 동등 표현. 뿌리의 흡수·줄기의 통로·잎의 양분 생성은 독립된 목록이 아니라 식물 몸 안에서 이어져요."
    },
    {
     "id": "c22-s61-u03-w083",
     "no": 83,
     "section": 6,
     "form": "short",
     "type": "T13",
     "topic": "통로를 묻는 단답",
     "prompt": "뿌리에서 잎으로 가는 물이 지나가는 식물 기관을 쓰세요.",
     "answer": "줄기",
     "explanation": "뿌리에서 들어온 물이 다른 기관으로 가는 통로와 지지 역할을 줄기가 해요. 흡수 기관과 이동 통로를 구별해요.",
     "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "줄기"
      ]
     },
     "criteria": "「줄기」 또는 명시한 동등 표현. 뿌리에서 들어온 물이 다른 기관으로 가는 통로와 지지 역할을 줄기가 해요. 흡수 기관과 이동 통로를 구별해요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "물의 이동을 나타내는 화살표에 기관 이름을 붙여요.",
     "value": "흙의 물이 잎까지 가는 길을 화살표로 나타내고, 거치는 기관의 이름을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "함께 일하는 식물의 기관 · 96",
    "title": "물과 양분의 관계 그림을 그려요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w096"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "물의 이동과 양분의 이동에 이름을 붙여 구별해 나타내요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 세포의 물 이동과 식물 전체의 물질 이동을 서로 연결해 배워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "뿌리·줄기·잎 사이의 화살표가 무엇을 뜻하는지 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w096",
     "no": 96,
     "section": 6,
     "form": "draw",
     "type": "T13",
     "topic": "기관 연결 지도",
     "prompt": "뿌리·줄기·잎이 있는 식물을 그리고 물과 양분의 연결을 서로 다른 이름표로 표시하세요. 색만으로 두 물질을 구별하지 마세요.",
     "answer": "물은 뿌리에서 줄기를 지나 잎으로 가는 화살표로 나타내요. 양분은 잎에서 만들어져 다른 기관에 쓰이거나 저장되는 것으로 나타내요. 화살표에 각각 물과 양분이라고 써요.",
     "explanation": "물은 뿌리에서 줄기를 지나 잎으로 가는 화살표로 나타내요. 잎에서 만든 양분은 다른 기관에 쓰이거나 저장되는 것으로 나타내고, 각 화살표에 물과 양분의 이름을 써요.",
     "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
     "requirements": [
      "세 기관 이름",
      "물 흡수/이동 경로",
      "잎 양분 생성과 다른 기관 쓰임 이름표"
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "required": [
       "세 기관 이름",
       "물 흡수/이동 경로",
       "잎 양분 생성과 다른 기관 쓰임 이름표"
      ]
     },
     "lines": 0,
     "drawing": "large",
     "criteria": "세 기관 이름 / 물 흡수/이동 경로 / 잎 양분 생성과 다른 기관 쓰임 이름표"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "중학교에서는 세포의 물 이동과 식물 전체의 물질 이동을 서로 연결해 배워요.",
     "value": "고등학교에서는 세포막을 통한 물질의 출입을 배워요. 세포에서 물이 이동하는 현상을 식물 전체의 물 이동과 연결해 생각할 수 있어요."
    }
   ]
  },
  {
   "previous": {
    "section": "꽃·열매·씨의 역할 · 100~101",
    "title": "꽃과 뿌리의 역할을 비교해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w100",
       "c22-s61-u03-w101"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "꽃의 생식 관련 역할과 뿌리의 물 흡수는 서로 다른 기능이에요."
     },
     {
      "title": "더 알아보기",
      "text": "바람에 의해 꽃가루받이하는 꽃은 꽃가루가 바람에 옮겨지기 쉬운 특징을 갖기도 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "수술·암술머리·뿌리의 역할을 연결해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w100",
     "no": 100,
     "section": 7,
     "form": "multi",
     "type": "T11",
     "topic": "꽃 구조와 역할",
     "prompt": "꽃의 구조와 역할을 바르게 연결한 것을 모두 고르세요.",
     "answer": "①, ③",
     "explanation": "수술에서는 꽃가루가 만들어지고 암술머리에는 꽃가루가 닿아요. 뿌리의 물 흡수나 씨가 퍼지는 과정과 구별해요.",
     "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
     "choices": [
      "수술: 꽃가루가 만들어짐",
      "꽃잎: 흙 속 물을 주로 흡수함",
      "암술머리: 꽃가루가 닿음",
      "뿌리: 꽃가루가 만들어짐",
      "기공: 씨를 보호하는 열매 구조"
     ],
     "key": [
      0,
      2
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       2
      ]
     },
     "criteria": "수술: 꽃가루가 만들어짐 / 암술머리: 꽃가루가 닿음을 모두 고르고 다른 보기를 넣지 않는다."
    },
    {
     "id": "c22-s61-u03-w101",
     "no": 101,
     "section": 7,
     "form": "match",
     "type": "T11",
     "topic": "꽃가루와 씨 구별",
     "prompt": "보기: ㄱ 꽃가루받이 / ㄴ 씨 퍼짐 / ㄷ 뿌리 흡수. 연결하세요.",
     "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
     "explanation": "날개 달린 씨가 이동하는 (1)은 씨 퍼짐인 ㄴ, 꽃가루가 암술머리에 닿는 (2)는 ㄱ이에요. 흙의 물이 식물로 들어가는 (3)은 뿌리 흡수인 ㄷ이에요.",
     "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
     "parts": [
      "(1) 날개 달린 씨가 떨어져 이동한다. [ ]",
      "(2) 꽃가루가 암술머리에 닿는다. [ ]",
      "(3) 흙의 물이 식물로 들어간다. [ ]"
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "answerPerPart": true,
     "responseContract": {
      "kind": "ordered-label-parts",
      "answers": [
       "ㄴ",
       "ㄱ",
       "ㄷ"
      ]
     },
     "criteria": "「(1) ㄴ (2) ㄱ (3) ㄷ」 또는 명시한 동등 표현. 꽃가루 이동과 씨 이동은 다른 대상과 단계예요. 기관 기능을 설명할 때 어떤 것이 이동하는지 밝히세요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "꽃의 생식 관련 역할과 뿌리의 물 흡수는 서로 다른 기능이에요.",
     "value": "수술에서 꽃가루가 만들어지고 암술머리에 꽃가루가 닿아요. 뿌리는 물을 흡수해요."
    }
   ]
  },
  {
   "previous": {
    "section": "꽃·열매·씨의 역할 · 112",
    "title": "열매나 씨의 구조를 그려요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w112"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "대상을 크게 그리고 보호나 퍼짐과 관련된 구조에 이름을 붙여요."
     },
     {
      "title": "더 알아보기",
      "text": "겉씨식물은 속씨식물과 달리 씨가 열매 안에 싸여 있지 않아요. 중학교에서 두 무리를 비교해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "관찰한 열매나 씨에서 역할과 관련된 부분을 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w112",
     "no": 112,
     "section": 7,
     "form": "draw",
     "type": "T12",
     "topic": "열매와 씨의 구조 그리기",
     "prompt": "직접 관찰했거나 자료에서 확인한 열매나 씨 한 가지를 그리세요. 부분의 이름을 붙이고, 씨를 보호하거나 퍼지는 데 도움이 되는 특징을 설명하세요.",
     "answer": "확인한 열매나 씨를 크게 그리고, 씨를 둘러싼 부분이나 날개와 갈고리 등에 이름을 붙여요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고, 직접 보았는지 어떤 자료에서 찾았는지도 적어요.",
     "explanation": "실제로 확인한 열매나 씨를 크게 그리고, 씨를 보호하는 부분이나 날개와 갈고리 등을 표시해요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고 어디서 알아보았는지도 적어요.",
     "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
     "requirements": [
      "대상과 관찰/조사 출처",
      "확인한 구조의 그림과 이름표",
      "보호/퍼짐 역할을 구조 근거로 설명"
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "required": [
       "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
      ]
     },
     "lines": 0,
     "drawing": "large",
     "criteria": "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "관찰한 열매나 씨에서 역할과 관련된 부분을 설명해요.",
     "value": "직접 관찰했거나 자료에서 확인한 열매나 씨에서 보호나 퍼짐에 도움이 되는 부분을 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "식물 특징을 설명하고 나누기 · 121~122",
    "title": "기능을 정확한 말로 설명해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u03-w121",
       "c22-s61-u03-w122"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "구조 이름을 나열하는 데서 나아가 어떤 일을 하는지 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "식충식물의 변형된 잎은 작은 동물을 붙잡지만 이 식물도 광합성을 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "당근과 선인장에서 역할이 달라진 기관을 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "plant-structure-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u03-w121",
     "no": 121,
     "section": 8,
     "form": "short",
     "type": "T03",
     "topic": "뿌리의 양분 저장",
     "prompt": "당근을 소개하는 자료에 “잎에서 만든 양분을 저장하여 굵어지는 부분”을 표시하려고 합니다. 이 부분은 식물의 어떤 기관인가요?",
     "answer": "뿌리",
     "explanation": "당근의 굵은 부분은 양분을 저장한 뿌리예요. 감자의 먹는 부분인 줄기와 구별해요.",
     "misconception": "땅속에서 자라는 부분이 모두 뿌리인 것은 아니에요.",
     "accepted": [
      "저장뿌리",
      "저장 뿌리"
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "뿌리",
       "저장뿌리",
       "저장 뿌리"
      ]
     },
     "criteria": "당근의 굵은 부분을 뿌리라고 쓴다."
    },
    {
     "id": "c22-s61-u03-w122",
     "no": 122,
     "section": 8,
     "form": "multi",
     "type": "T14",
     "topic": "특징과 기능 연결",
     "prompt": "식물의 구조와 기능을 설명하는 자료에 넣을 문장으로 알맞은 것을 모두 고르세요.",
     "answer": "①, ④",
     "explanation": "잎은 빛을 받는 구조와, 당근의 뿌리는 양분을 저장하는 기능과 연결해 설명해요. 줄기는 지지와 이동을 함께 할 수 있어요.",
     "misconception": "하나의 기능만으로 식물 기관의 역할을 제한하지 않아요.",
     "choices": [
      "넓게 펼쳐진 잎은 빛을 받는 데 도움이 된다.",
      "줄기는 물을 이동시키므로 잎을 지지하지 않는다.",
      "식물의 양분은 모두 흙에서 만들어져 뿌리로 들어온다.",
      "당근의 굵은 뿌리는 양분을 저장한다.",
      "모든 씨에는 날개가 있어 바람으로만 퍼진다."
     ],
     "key": [
      0,
      3
     ],
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과11-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       3
      ]
     },
     "criteria": "①과 ④를 모두 고른다."
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "당근과 선인장에서 역할이 달라진 기관을 설명해요.",
     "value": "당근의 뿌리가 하는 일과 앞쪽 119번에 나온 선인장의 잎·줄기가 하는 일을 비교해요."
    }
   ]
  }
 ],
 "figures": [
  {
   "key": "plant-question-data-55",
   "previous": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">시료</th><th scope=\"col\">녹말 검출</th></tr></thead><tbody><tr><th scope=\"row\">처리 전 비교</th><td>미검출</td></tr><tr><th scope=\"row\">빛 처리 뒤</th><td>청람색</td></tr><tr><th scope=\"row\">어둠 처리 뒤</th><td>미검출</td></tr></tbody></table>",
   "value": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">비교한 잎</th><th scope=\"col\">녹말 반응</th></tr></thead><tbody><tr><th scope=\"row\">실험 전 비교</th><td>청람색으로 변하지 않음</td></tr><tr><th scope=\"row\">빛을 받은 뒤</th><td>청람색</td></tr><tr><th scope=\"row\">어둡게 둔 뒤</th><td>청람색으로 변하지 않음</td></tr></tbody></table>",
   "question": {
    "id": "c22-s61-u03-w055",
    "no": 55,
    "section": 4,
    "form": "choice",
    "type": "T08",
    "topic": "연습 결과 해석",
    "prompt": "실험 전 비교용 잎에서는 녹말 반응이 나타나지 않았어요. 같은 시간이 지난 뒤 빛을 준 잎만 청람색이 되었어요. 알맞은 설명을 고르세요.",
    "answer": "① 이번 조건에서 빛을 받은 잎에 녹말이 만들어졌음을 보여 준다.",
    "explanation": "실험 전 비교용 잎에는 녹말 반응이 없었고, 빛을 받은 뒤 청람색이 나타났어요. 이 조건에서 빛을 받은 잎에 녹말이 생겼다는 설명과 연결할 수 있어요. 모든 양분의 종류를 알아낸 것은 아니에요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "table": {
     "heads": [
      "비교한 잎",
      "녹말 반응"
     ],
     "rows": [
      [
       "실험 전 비교",
       "청람색으로 변하지 않음"
      ],
      [
       "빛을 받은 뒤",
       "청람색"
      ],
      [
       "어둡게 둔 뒤",
       "청람색으로 변하지 않음"
      ]
     ]
    },
    "choices": [
     "이번 조건에서 빛을 받은 잎에 녹말이 만들어졌음을 보여 준다.",
     "처리 전 상태가 달랐더라도 뒤에 청람색이 보이면 항상 같은 결론을 낼 수 있다.",
     "어두운 잎에는 어떤 물질도 없음을 증명한다.",
     "빛을 가린 잎의 반응만으로 뿌리가 물을 흡수하지 않았음을 확인했다.",
     "물과 이산화 탄소는 필요 없다는 증거다."
    ],
    "key": 0,
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "single-choice",
     "answer": 0
    },
    "criteria": "「이 조건에서 빛을 받은 잎의 녹말 생성을 뒷받침한다.」을 고른다. 시작 상태와 처리 뒤 반응이 있어 이번 조건에서 빛을 받은 잎의 녹말 생성과 연결할 수 있어요. 모든 양분이나 모든 기관의 작용을 한 번에 증명한 것은 아니에요.",
    "dataNature": "provided-practice-data-not-student-measurement",
    "figure": "plant-question-data-55"
   }
  },
  {
   "key": "plant-quick-56",
   "previous": "<div class=\"ps-quick-grid\"><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">57</th><td>단답</td><td>빛의 유무</td></tr><tr><th scope=\"row\">58</th><td>복수</td><td>②, ⑤</td></tr><tr><th scope=\"row\">59</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">60</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">61</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">62</th><td>순서</td><td>ㄴ → ㄱ → ㄹ → ㄷ</td></tr><tr><th scope=\"row\">63</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">66</th><td>빈칸</td><td>기공</td></tr><tr><th scope=\"row\">67</th><td>단답</td><td>나</td></tr><tr><th scope=\"row\">68</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">69</th><td>연결</td><td>(1) ㄷ (2) ㄱ (3) ㄴ</td></tr><tr><th scope=\"row\">70</th><td>서술</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">71</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">72</th><td>빈칸</td><td>수증기</td></tr><tr><th scope=\"row\">73</th><td>단답</td><td>6mL</td></tr><tr><th scope=\"row\">74</th><td>복수</td><td>①, ③</td></tr><tr><th scope=\"row\">75</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">76</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">78</th><td>순서</td><td>ㄹ → ㄱ → ㄷ → ㄴ</td></tr><tr><th scope=\"row\">79</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">82</th><td>빈칸</td><td>이동</td></tr><tr><th scope=\"row\">83</th><td>단답</td><td>줄기</td></tr><tr><th scope=\"row\">84</th><td>복수</td><td>②, ④, ⑤</td></tr></tbody></table></div>",
   "value": "<div class=\"ps-quick-grid\"><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">57</th><td>단답</td><td>빛의 유무</td></tr><tr><th scope=\"row\">58</th><td>복수</td><td>②, ⑤</td></tr><tr><th scope=\"row\">59</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">60</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">61</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">62</th><td>순서</td><td>ㄴ → ㄱ → ㄹ → ㄷ 또는 ㄱ → ㄴ → ㄹ → ㄷ</td></tr><tr><th scope=\"row\">63</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">66</th><td>빈칸</td><td>기공</td></tr><tr><th scope=\"row\">67</th><td>단답</td><td>나</td></tr><tr><th scope=\"row\">68</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">69</th><td>연결</td><td>(1) ㄷ (2) ㄱ (3) ㄴ</td></tr><tr><th scope=\"row\">70</th><td>서술</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">71</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">72</th><td>빈칸</td><td>수증기</td></tr><tr><th scope=\"row\">73</th><td>단답</td><td>6mL</td></tr><tr><th scope=\"row\">74</th><td>복수</td><td>①, ③</td></tr><tr><th scope=\"row\">75</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">76</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">78</th><td>순서</td><td>ㄹ → ㄱ → ㄷ → ㄴ</td></tr><tr><th scope=\"row\">79</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">82</th><td>빈칸</td><td>이동</td></tr><tr><th scope=\"row\">83</th><td>단답</td><td>줄기</td></tr><tr><th scope=\"row\">84</th><td>복수</td><td>②, ④, ⑤</td></tr></tbody></table></div>",
   "question": {
    "id": "c22-s61-u03-w062",
    "no": 62,
    "section": 4,
    "form": "order",
    "type": "T08",
    "topic": "근거를 읽는 순서",
    "prompt": "선생님이 준비한 자료로 잎의 녹말 반응을 비교하려고 해요. 순서대로 기호를 쓰세요.",
    "answer": "ㄴ → ㄱ → ㄹ → ㄷ",
    "explanation": "먼저 실험 전 비교용 잎에 녹말이 있었는지와 같게 한 조건을 확인해요. 그다음 빛을 받은 잎과 가린 잎의 반응을 비교하고 이번 결과로 알게 된 점을 써요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "given": [
     "ㄱ 같게 한 조건과 빛을 다르게 한 점을 확인한다.",
     "ㄴ 실험 전 비교용 잎에 녹말 반응이 있었는지 읽는다.",
     "ㄷ 이번 결과로 알게 된 점을 쓴다.",
     "ㄹ 실험 뒤 빛을 받은 잎과 가린 잎의 반응을 비교한다."
    ],
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과11-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅲ. 식물의 구조와 기능",
     "originalExam": false
    },
    "responseContract": {
     "kind": "ordered-label-sequence",
     "sequence": [
      "ㄴ",
      "ㄱ",
      "ㄹ",
      "ㄷ"
     ]
    },
    "criteria": "「ㄴ → ㄱ → ㄹ → ㄷ」 또는 명시한 동등 표현. 처리 전 상태와 같게 한 조건을 먼저 확인하고 뒤의 실제 검출 결과를 비교하여 결론 범위를 정해요."
   }
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withPlantContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s61-u03'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);let figures=workbook.figures;for(const patch of review.figures){if(!same(source.get(patch.question.id),patch.question)||figures?.[patch.key]!==patch.previous)continue;changed=true;figures={...figures,[patch.key]:patch.value};}return changed?{...workbook,questions,pages,figures,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s61-u03-b043",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 43,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u03-w043",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u03",
    "area": "생명",
    "element": "E2",
    "type": "T06",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과11-02",
    "topic": "색소가 없을 때",
    "concept": "줄기 색소 물 이동",
    "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
   },
   "prompt": "예상과 달리 줄기 안의 붉은 부분을 찾지 못했어요. 관찰한 결과를 어떻게 적고, 무엇을 더 확인할지 두 가지를 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "붉은 부분을 찾지 못했다고 적어요. 색소 물에 둔 시간과 줄기의 상태, 자른 위치와 조명을 확인해요. 예상한 그림을 결과처럼 그려 넣지 않아요.",
    "rubric": {
     "required": [
      "색 자취 미확인 상태 보존",
      "시간/표본 상태 확인",
      "관찰 위치/조명 확인 또는 값 꾸미기 배제"
     ],
     "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
    },
    "plantAuthoredContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "색 자취 미확인 상태 보존",
      "시간/표본 상태 확인",
      "관찰 위치/조명 확인 또는 값 꾸미기 배제"
     ]
    }
   },
   "explanation": "붉은 부분을 찾지 못했다는 결과를 그대로 적어요. 색소 물에 둔 시간과 줄기의 상태, 자른 위치와 조명을 더 확인해요. 이 결과만으로 물이 전혀 이동하지 않았다고 할 수는 없어요.",
   "evidence": {
    "date": "2026-10-21",
    "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
   },
   "contentVersion": "20261106-plant-structure-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u03-b043",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 43,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u03-w043",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "색소가 없을 때",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
     },
     "prompt": "예상과 달리 붉은 자취를 찾지 못했습니다. 결과를 남기고 다시 확인할 점 두 가지를 제안하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "붉은 자취를 확인하지 못했다고 남겨요. 충분한 시간·표본 상태와 관찰할 단면 위치/조명을 교사와 확인해요. 예상 그림으로 결과를 채우지 않아요.",
      "rubric": {
       "required": [
        "색 자취 미확인 상태 보존",
        "시간/표본 상태 확인",
        "관찰 위치/조명 확인 또는 값 꾸미기 배제"
       ],
       "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
      },
      "plantAuthoredContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "actualPerformanceMustNotBeInferred": true,
       "required": [
        "색 자취 미확인 상태 보존",
        "시간/표본 상태 확인",
        "관찰 위치/조명 확인 또는 값 꾸미기 배제"
       ]
      }
     },
     "explanation": "색의 검출 실패는 물 이동 전체의 부재를 바로 증명하지 않아요. 실제 보인 상태와 재확인 계획을 구별해요.",
     "evidence": {
      "date": "2026-10-21",
      "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "붉은 부분을 찾지 못했다고 적어요. 색소 물에 둔 시간과 줄기의 상태, 자른 위치와 조명을 확인해요. 예상한 그림을 결과처럼 그려 넣지 않아요.",
    "rubric": {
     "required": [
      "붉은 자취를 찾지 못했다는 실제 관찰 결과를 그대로 적는다.",
      "시간·줄기 상태·자른 위치·조명 등 다시 확인할 타당한 조건 두 가지를 제시한다."
     ],
     "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
    },
    "plantAuthoredContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "붉은 자취를 찾지 못했다는 실제 관찰 결과를 그대로 적는다.",
      "시간·줄기 상태·자른 위치·조명 등 다시 확인할 타당한 조건 두 가지를 제시한다."
     ]
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u03-b058",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 58,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "multi",
   "bookQuestionId": "c22-s61-u03-w058",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u03",
    "area": "생명",
    "element": "E3",
    "type": "T08",
    "format": "복수 선택",
    "level": "기본",
    "track": "교과",
    "standard": "6과11-02",
    "topic": "아직 말할 수 없는 것",
    "concept": "광합성 산물 확인 실험",
    "inquirySkill": "변인·아이오딘 반응·근거 해석"
   },
   "prompt": "실험 전에 녹말이 있었는지 확인하지 않았고, 실험 뒤 잎의 반응도 아직 보지 못했어요. 필요한 행동을 모두 고르세요.",
   "givens": null,
   "choices": [
    "두 잎 모두 반응이 없었다고 꾸민다.",
    "실험 뒤 반응을 직접 확인하고 그전에는 결론을 정하지 않는다.",
    "원하는 결론과 다른 반응은 지운다.",
    "빛을 받은 잎은 무조건 청람색이라고 결과 칸에 쓴다.",
    "실험 전에 녹말이 있었는지 확인할 비교용 잎을 준비한다."
   ],
   "responseContract": "multi-choice",
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     1,
     4
    ],
    "plantAuthoredContract": {
     "kind": "multi-choice",
     "answers": [
      1,
      4
     ]
    }
   },
   "explanation": "예상한 색을 실제 결과처럼 쓰면 안 돼요. 실험 전 비교용 잎의 반응과 실험 뒤 두 잎의 반응을 직접 확인한 다음에 결론을 정해요.",
   "evidence": {
    "date": "2026-10-21",
    "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
   },
   "contentVersion": "20261106-plant-structure-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u03-b058",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 58,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "multi",
     "bookQuestionId": "c22-s61-u03-w058",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "아직 말할 수 없는 것",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
     },
     "prompt": "처리 전 녹말 상태를 확인하지 않았고 처리 뒤 실제 반응도 아직 못 봤습니다. 필요한 행동을 모두 고르세요.",
     "givens": null,
     "choices": [
      "두 잎 모두 반응이 없었다고 꾸민다.",
      "처리 뒤 반응을 실제로 확인하고 아직은 결론을 보류한다.",
      "원하는 결론과 다른 반응은 지운다.",
      "빛을 받은 잎은 무조건 청람색이라고 결과 칸에 쓴다.",
      "처리 전 상태를 확인할 비교 시료를 준비한다."
     ],
     "responseContract": "multi-choice",
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       1,
       4
      ],
      "plantAuthoredContract": {
       "kind": "multi-choice",
       "answers": [
        1,
        4
       ]
      }
     },
     "explanation": "절차나 예상만으로 실제 검출 결과를 채울 수 없어요. 시작 전과 뒤의 관찰 자료를 확보하고 확인 전에는 결론을 보류해요.",
     "evidence": {
      "date": "2026-10-21",
      "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "choices": [
    "두 잎 모두 반응이 없었다고 꾸민다.",
    "실험 뒤 반응을 직접 확인하고 그전에는 결론을 정하지 않는다.",
    "원하는 결론과 다른 반응은 지운다.",
    "빛을 받은 잎은 무조건 청람색이라고 결과 칸에 쓴다.",
    "다시 실험할 때에는 실험 전 비교용 잎의 녹말 반응부터 확인한다."
   ],
   "explanation": "이번에는 실험 뒤의 반응을 확인하되, 실험 전 상태를 몰라 새로 생긴 녹말이라고 단정할 수 없어요. 다시 실험할 때에는 실험 전 비교용 잎의 녹말 반응부터 확인해요."
  }
 },
 {
  "previous": {
   "id": "c22-s61-u03-b059",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 59,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u03-w059",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u03",
    "area": "생명",
    "element": "E3",
    "type": "T08",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과11-02",
    "topic": "두 잎 모두 반응",
    "concept": "광합성 산물 확인 실험",
    "inquirySkill": "변인·아이오딘 반응·근거 해석"
   },
   "prompt": "빛을 준 잎과 가린 잎이 모두 청람색이었습니다. 이 결과를 보존하며 다시 확인할 점을 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "두 잎 모두 녹말 반응이 있었다고 적어요. 실험 전에 녹말이 있었는지, 빛을 제대로 가렸는지와 잎의 이름표를 다시 확인해요. 바로 빛과 관계없이 녹말이 만들어졌다고 하지 않아요.",
    "rubric": {
     "required": [
      "두 반응 그대로 기록",
      "처리 전 상태/차단/시료 확인",
      "빛과 무관하다는 성급한 일반화 배제"
     ],
     "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
    },
    "plantAuthoredContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "두 반응 그대로 기록",
      "처리 전 상태/차단/시료 확인",
      "빛과 무관하다는 성급한 일반화 배제"
     ]
    }
   },
   "explanation": "두 잎 모두 녹말 반응이 있었다는 기록을 남겨요. 처음부터 녹말이 있었는지, 빛을 가린 방법이 맞았는지와 잎의 이름표를 다시 확인해요.",
   "evidence": {
    "date": "2026-10-21",
    "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
   },
   "contentVersion": "20261106-plant-structure-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u03-b059",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 59,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u03-w059",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "두 잎 모두 반응",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
     },
     "prompt": "빛을 준 잎과 가린 잎이 모두 청람색이었습니다. 이 결과를 보존하며 다시 확인할 점을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "두 잎 모두 녹말 반응이 있었다고 남겨요. 처리 전 녹말 상태와 빛 차단 여부·시료 표기를 확인해요. 바로 빛과 무관하게 녹말이 만들어졌다고 결론 내리지 않아요.",
      "rubric": {
       "required": [
        "두 반응 그대로 기록",
        "처리 전 상태/차단/시료 확인",
        "빛과 무관하다는 성급한 일반화 배제"
       ],
       "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
      },
      "plantAuthoredContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "actualPerformanceMustNotBeInferred": true,
       "required": [
        "두 반응 그대로 기록",
        "처리 전 상태/차단/시료 확인",
        "빛과 무관하다는 성급한 일반화 배제"
       ]
      }
     },
     "explanation": "기존 녹말이나 준비 조건의 차이 등 다른 설명을 확인해야 해요. 실제 반응을 모범 결과로 바꾸지 않아요.",
     "evidence": {
      "date": "2026-10-21",
      "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "explanation": "두 잎 모두 녹말 반응이 있었다는 기록을 남겨요. 실험 전 비교 기록, 빛을 가린 방법과 잎의 이름표를 확인해요. 실험 전 기록이 없다면 그때의 상태를 나중에 새 잎으로 확인할 수는 없으므로, 다시 실험할 때 실험 전 비교용 잎의 반응부터 살펴요."
  }
 },
 {
  "previous": {
   "id": "c22-s61-u03-b062",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 62,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "order",
   "bookQuestionId": "c22-s61-u03-w062",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u03",
    "area": "생명",
    "element": "E3",
    "type": "T08",
    "format": "순서 배열",
    "level": "기본",
    "track": "교과",
    "standard": "6과11-02",
    "topic": "근거를 읽는 순서",
    "concept": "광합성 산물 확인 실험",
    "inquirySkill": "변인·아이오딘 반응·근거 해석"
   },
   "prompt": "선생님이 준비한 자료로 잎의 녹말 반응을 비교하려고 해요. 순서대로 기호를 쓰세요.",
   "givens": {
    "보기": {
     "머리": [
      "보기"
     ],
     "행": [
      [
       "ㄱ 같게 한 조건과 빛을 다르게 한 점을 확인한다."
      ],
      [
       "ㄴ 실험 전 비교용 잎에 녹말 반응이 있었는지 읽는다."
      ],
      [
       "ㄷ 이번 결과로 알게 된 점을 쓴다."
      ],
      [
       "ㄹ 실험 뒤 빛을 받은 잎과 가린 잎의 반응을 비교한다."
      ]
     ]
    }
   },
   "choices": null,
   "responseContract": "short-text",
   "answerContract": {
    "type": "short-text",
    "answer": "ㄴ → ㄱ → ㄹ → ㄷ",
    "accepted": [
     "ㄴ → ㄱ → ㄹ → ㄷ"
    ],
    "inputHint": "보기의 기호를 순서대로 써요.",
    "plantAuthoredContract": {
     "kind": "ordered-label-sequence",
     "sequence": [
      "ㄴ",
      "ㄱ",
      "ㄹ",
      "ㄷ"
     ]
    }
   },
   "explanation": "먼저 실험 전 비교용 잎에 녹말이 있었는지와 같게 한 조건을 확인해요. 그다음 빛을 받은 잎과 가린 잎의 반응을 비교하고 이번 결과로 알게 된 점을 써요.",
   "evidence": {
    "date": "2026-10-21",
    "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
   },
   "contentVersion": "20261106-plant-structure-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u03-b062",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 62,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "order",
     "bookQuestionId": "c22-s61-u03-w062",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "순서 배열",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "근거를 읽는 순서",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
     },
     "prompt": "교사가 준비한 검출 자료를 해석하는 순서를 쓰세요.",
     "givens": {
      "보기": {
       "머리": [
        "보기"
       ],
       "행": [
        [
         "ㄱ 같게 한 조건과 빛 처리 차이를 확인한다."
        ],
        [
         "ㄴ 처리 전 비교 시료의 녹말 검출 상태를 읽는다."
        ],
        [
         "ㄷ 이번 조건에서 말할 수 있는 결론을 쓴다."
        ],
        [
         "ㄹ 처리 뒤 두 시료의 실제 반응을 비교한다."
        ]
       ]
      }
     },
     "choices": null,
     "responseContract": "short-text",
     "answerContract": {
      "type": "short-text",
      "answer": "ㄴ → ㄱ → ㄹ → ㄷ",
      "accepted": [
       "ㄴ → ㄱ → ㄹ → ㄷ"
      ],
      "inputHint": "보기의 기호를 순서대로 써요.",
      "plantAuthoredContract": {
       "kind": "ordered-label-sequence",
       "sequence": [
        "ㄴ",
        "ㄱ",
        "ㄹ",
        "ㄷ"
       ]
      }
     },
     "explanation": "처리 전 상태와 같게 한 조건을 먼저 확인하고 뒤의 실제 검출 결과를 비교하여 결론 범위를 정해요.",
     "evidence": {
      "date": "2026-10-21",
      "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "explanation": "실험 전 비교용 잎의 녹말 반응과 같게 한 조건을 먼저 확인해요. 이 두 자료를 읽는 순서는 바뀌어도 괜찮아요. 그다음 실험 뒤 두 잎의 반응을 비교하고 알게 된 점을 써요.",
   "answerContract": {
    "type": "short-text",
    "answer": "ㄴ → ㄱ → ㄹ → ㄷ 또는 ㄱ → ㄴ → ㄹ → ㄷ",
    "accepted": [
     "ㄴ → ㄱ → ㄹ → ㄷ",
     "ㄱ → ㄴ → ㄹ → ㄷ"
    ],
    "inputHint": "보기의 기호를 순서대로 써요.",
    "plantAuthoredContract": {
     "kind": "ordered-label-sequence",
     "sequence": [
      "ㄴ",
      "ㄱ",
      "ㄹ",
      "ㄷ"
     ],
     "sequences": [
      [
       "ㄴ",
       "ㄱ",
       "ㄹ",
       "ㄷ"
      ],
      [
       "ㄱ",
       "ㄴ",
       "ㄹ",
       "ㄷ"
      ]
     ]
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u03-b123",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 123,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u03-w123",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u03",
    "area": "생명",
    "element": "E6",
    "type": "T14",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과11-03",
    "topic": "받은 질문으로 고치기",
    "concept": "식물 특징 설명 자료와 나눔",
    "inquirySkill": "관찰/조사 근거 선택·구조와 기능 설명·자료 제작/공유"
   },
   "prompt": "친구가 “줄기가 잎을 받친다는 근거가 그림 어디에 있니?”라고 물었습니다. 자료를 어떻게 보완하고 설명할지 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "잎이 줄기와 연결된 부분을 크게 표시하고 이름표를 붙여요. 그 부분을 보고 줄기가 잎을 받쳐 준다고 설명하는 문장을 덧붙여요.",
    "rubric": {
     "required": [
      "연결 부분 확대/표시",
      "관찰과 지지 역할 연결",
      "보완 내용을 실제 다시 설명할 계획/행동"
     ],
     "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
    },
    "plantAuthoredContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "연결 부분 확대/표시",
      "관찰과 지지 역할 연결",
      "보완 내용을 실제 다시 설명할 계획/행동"
     ]
    }
   },
   "explanation": "잎이 줄기와 연결된 부분을 크게 표시하고 이름표를 붙여요. 그 부분을 보고 줄기가 잎을 받친다고 설명할 수 있게 문장을 덧붙여요.",
   "evidence": {
    "date": "2026-10-21",
    "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
   },
   "contentVersion": "20261106-plant-structure-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u03-b123",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 123,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u03-w123",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-03",
      "topic": "받은 질문으로 고치기",
      "concept": "식물 특징 설명 자료와 나눔",
      "inquirySkill": "관찰/조사 근거 선택·구조와 기능 설명·자료 제작/공유"
     },
     "prompt": "친구가 “줄기가 잎을 받친다는 근거가 그림 어디에 있니?”라고 물었습니다. 자료를 어떻게 보완하고 설명할지 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "잎이 줄기와 연결된 부분을 크게 보여 주고 이름표를 붙여요. 관찰한 부분과 지지 기능을 연결한 문장을 덧붙여 다시 설명해요.",
      "rubric": {
       "required": [
        "연결 부분 확대/표시",
        "관찰과 지지 역할 연결",
        "보완 내용을 실제 다시 설명할 계획/행동"
       ],
       "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
      },
      "plantAuthoredContract": {
       "kind": "written-explanation",
       "teacherRequired": true,
       "actualPerformanceMustNotBeInferred": true,
       "required": [
        "연결 부분 확대/표시",
        "관찰과 지지 역할 연결",
        "보완 내용을 실제 다시 설명할 계획/행동"
       ]
      }
     },
     "explanation": "실제 질문이 지적한 빠진 근거를 보완해야 해요. 그림을 더 화려하게만 꾸미는 것으로 대신하지 않아요.",
     "evidence": {
      "date": "2026-10-21",
      "checkedBy": "창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "잎이 줄기와 연결된 부분을 크게 표시하고 이름표를 붙여요. 그 부분을 보고 줄기가 잎을 받쳐 준다고 설명하는 문장을 덧붙여요.",
    "rubric": {
     "required": [
      "줄기와 잎의 연결 부분을 확대하거나 표시하는 방법을 쓴다.",
      "그 모습을 근거로 줄기가 잎을 받치는 역할을 설명한다."
     ],
     "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
    },
    "plantAuthoredContract": {
     "kind": "written-explanation",
     "teacherRequired": true,
     "actualPerformanceMustNotBeInferred": true,
     "required": [
      "줄기와 잎의 연결 부분을 확대하거나 표시하는 방법을 쓴다.",
      "그 모습을 근거로 줄기가 잎을 받치는 역할을 설명한다."
     ]
    }
   }
  }
 }
];
const bankCache=new WeakMap();
export function plantContextItems(rows,unit){
 if(unit!=='c22-s61-u03'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:PLANT_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withPlantContextClassroom(unit,book){
 const rows=plantContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
