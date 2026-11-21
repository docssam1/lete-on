export const SOLUTION_CONTEXT_VERSION='20261115-solution-workbook-context';
// Clarify comparison methods and elementary language without changing answer positions.
const review={
 "patches": [
  {
   "previous": {
    "id": "solution-book-04",
    "no": 4,
    "status": "authored",
    "form": "written",
    "topic": "관찰과 자료",
    "prompt": "“문제의 표에서 따뜻한 물에 더 많이 녹았다.” 이 문장만으로 내가 실험했다고 할 수 있나요? 까닭을 쓰세요.",
    "answer": "아니에요. 문제에 나온 표를 읽은 것만으로는 내가 직접 실험했다고 할 수 없어요.",
    "explanation": "문제의 표를 읽은 것과 내가 직접 실험한 것은 달라요. 직접 실험했다면 언제 어떤 조건에서 무엇을 관찰했는지 따로 적어요.",
    "misconception": "정답을 맞힌 것을 실제 탐구 수행의 증거로 바꾸지 않는다.",
    "criteria": "문제의 표를 읽는 것과 직접 실험하는 것은 다르다는 까닭을 설명하면 돼요.",
    "lines": 8,
    "previousCriteria": "제공 자료임을 구분 1, 직접 수행의 추가 근거 1.",
    "standard": "6과03-01",
    "origin": "previous96"
   },
   "fields": {
    "prompt": "자료에서 “따뜻한 물에 더 많이 녹았다”는 설명을 읽었어요. 이 글을 읽은 것만으로 내가 직접 실험했다고 할 수 있을까요? 까닭을 쓰세요.",
    "answer": "아니에요. 자료의 설명을 읽은 것만으로는 내가 직접 실험했다고 할 수 없어요.",
    "explanation": "자료에서 설명을 읽는 것과 내가 직접 실험하는 것은 달라요. 직접 실험했다면 어떤 조건에서 무엇을 관찰했는지 따로 남겨요.",
    "criteria": "자료를 읽는 것과 직접 실험하는 것은 다르다는 까닭을 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "solution-book-12",
    "no": 12,
    "status": "authored",
    "form": "choice",
    "topic": "같은 계 측정",
    "prompt": "용해 전에 물·컵·설탕·약포지를 함께 쟀어요. 용해 후에도 같은 물건 전체를 비교하려면 무엇을 함께 재야 하나요?",
    "answer": "①",
    "explanation": "처음에 컵과 약포지도 함께 쟀으므로 나중에도 같은 컵과 빈 약포지를 올려요. 설탕을 물로 옮겼어도 저울에 올리는 물건 전체는 같아야 해요.",
    "misconception": "용해 후 빈 약포지는 무게가 없다고 생각하지 않는다.",
    "criteria": "같은 컵·설탕물·처음 사용한 빈 약포지를 모두 포함한 보기를 고른다.",
    "choices": [
     "설탕물·같은 컵·빈 약포지",
     "설탕물만",
     "설탕물·새 컵",
     "설탕물·같은 컵·새 설탕"
    ],
    "key": 0,
    "previousCriteria": "선택과 근거를 함께 확인한다.",
    "standard": "6과03-01",
    "origin": "previous96"
   },
   "fields": {
    "topic": "같은 물건 전체의 무게"
   }
  },
  {
   "previous": {
    "id": "solution-book-27",
    "no": 27,
    "status": "authored",
    "form": "multi",
    "topic": "결론의 조건",
    "prompt": "온도 비교를 다시 확인할 때 살필 것을 모두 고르세요.",
    "answer": "①, ②, ④",
    "explanation": "두 물의 양이 같은지, 비교할 때 실제 온도는 얼마인지 확인해요. 젓고 남은 고체를 관찰하는 방법도 같게 해요. 두 조건의 결과를 모두 남겨 비교해요.",
    "misconception": "예상과 다른 조건의 기록을 지우지 않는다.",
    "criteria": "물 양·실제 온도·충분히 젓고 잔류를 보는 방법을 확인한다. 한쪽 결과만 남기는 선택은 제외한다.",
    "choices": [
     "두 물의 양이 같은가?",
     "실제로 비교할 때 물 온도는 얼마인가?",
     "따뜻한 쪽 결과만 남겼는가?",
     "충분히 젓고 남은 고체를 같은 방법으로 보았는가?"
    ],
    "key": [
     0,
     1,
     3
    ],
    "previousCriteria": "필요한 보기를 모두 골랐는지, 틀린 보기를 더 고르지 않았는지 확인한다.",
    "standard": "6과03-01",
    "origin": "previous96"
   },
   "fields": {
    "prompt": "물의 온도에 따라 녹는 양을 비교한 결론을 다시 살펴보려고 해요. 알맞은 방법을 모두 고르세요.",
    "choices": [
     "두 물의 양이 같은지 확인한다.",
     "실제로 비교할 때 물의 온도를 확인한다.",
     "따뜻한 쪽의 결과만 골라 기록한다.",
     "충분히 젓고 남은 고체를 같은 방법으로 확인한다."
    ]
   }
  },
  {
   "previous": {
    "id": "solution-book-47",
    "no": 47,
    "status": "authored",
    "form": "choice",
    "topic": "자료로 알 수 있는 녹는 양",
    "prompt": "연습 자료: 물 각 50 mL, 20 ℃. A는 4 g/8 g 모두 녹음, B는 4 g 모두/8 g 일부 남음. 옳은 것은?",
    "answer": "③",
    "explanation": "A는 넣은 8 g이 모두 녹아 적어도 8 g은 녹을 수 있어요. B는 8 g 중 일부가 남아 이 조건에서 8 g을 전부 녹이지 못했어요.",
    "misconception": "모두 녹은 마지막 투입량을 바로 정확한 최대량으로 쓰지 않는다.",
    "criteria": "A의 하한8g과B는8g 전부 녹이지 못함을 고른다. 정확한 최대값 계산으로 확대하지 않는다.",
    "choices": [
     "A의 최대량은 정확히 8 g이다.",
     "B는 4 g도 녹이지 못한다.",
     "A는 적어도 8 g 녹고 B의 최대량은 8 g보다 작다.",
     "A와 B의 최대량은 같다."
    ],
    "key": 2,
    "previousCriteria": "선택과 근거를 함께 확인한다.",
    "standard": "6과03-01",
    "origin": "previous96"
   },
   "fields": {
    "prompt": "연습 자료: 물 각 50 mL, 20 ℃. 같은 방법으로 충분히 저은 뒤, A는 4 g과 8 g이 모두 녹았고 B는 4 g은 모두 녹았지만 8 g은 일부 남았어요. 옳은 설명을 고르세요."
   }
  },
  {
   "previous": {
    "id": "solution-book-56",
    "no": 56,
    "status": "authored",
    "form": "written",
    "topic": "의견 반영",
    "prompt": "카드를 보여 주니 친구가 “어느 부분이 용액인지 모르겠어.”라고 했습니다. 무엇을 고치고 어떻게 기록할까요?",
    "answer": "사례 그림에 물에 녹은 성분과 용액 부분의 이름표를 넣고, 받은 질문·바꾼 설명·다시 전달했는지 기록한다.",
    "explanation": "그림에 어떤 성분이 물에 녹았고 어느 부분이 용액인지 이름표를 넣어요. 친구의 질문과 고친 내용을 적고, 다시 보여 주었다면 그때 들은 의견도 남겨요.",
    "misconception": "막연히 “더 예쁘게 꾸밈”만으로 질문이 해결됐다고 하지 않는다.",
    "criteria": "질문에 맞는 수정 1, 의견/수정/재전달 구분 1. 다른 타당한 수정 인정.",
    "previousCriteria": "질문에 맞는 수정 1, 의견/수정/재전달 구분 1. 다른 타당한 수정 인정.",
    "lines": 8,
    "standard": "6과03-03",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "친구가 용액인 부분을 알아볼 수 있게 고칠 내용을 제안하고, 받은 질문과 고친 내용을 기록하는 방법을 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "solution-book-58",
    "no": 58,
    "status": "authored",
    "form": "draw",
    "topic": "조사와 설명",
    "prompt": "“용액이 우리 생활에 필요한 까닭”을 한 사례로 설명하는 자료의 초안을 그리세요. 조사한 사실과 내 제안을 구분하세요.",
    "answer": "확인한 생활 사례·필요한 까닭·용해/진하기의 관련 성질·출처를 넣고 새 제안은 예상으로 따로 표시한다.",
    "explanation": "직접 조사한 생활 사례와 용액이 필요한 까닭을 그림과 글로 나타내요. 아직 해 보지 않은 새 제안은 알아낸 사실과 나누어 표시해요.",
    "misconception": "제품의 효과를 출처 없이 보장하는 문장을 쓰지 않는다.",
    "criteria": "실제 조사 사례 1, 관련 성질 1, 출처와 예상 구분 1. 실제 전달 완료는 별도 확인.",
    "drawing": "large",
    "previousCriteria": "실제 조사 사례 1, 관련 성질 1, 출처와 예상 구분 1. 실제 전달 완료는 별도 확인.",
    "standard": "6과03-03",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "용액이 쓰이는 사례와 필요한 까닭을 관련 성질로 설명하고, 자료에서 확인한 내용과 새 제안을 구별해 나타내면 인정해요."
   }
  },
  {
   "previous": {
    "id": "solution-book-65",
    "no": 65,
    "status": "authored",
    "form": "choice",
    "topic": "용해 분류",
    "prompt": "설탕이 물에 골고루 녹는 현상의 이름은?",
    "answer": "②",
    "explanation": "설탕이 물에 녹아 골고루 섞이는 현상은 용해예요. 얼음 자체가 물로 바뀌는 녹기와는 구별해요.",
    "misconception": "물질 자체의 상태 변화와 물에 녹는 현상을 구별한다.",
    "criteria": "설탕이 물에 골고루 녹는 용해를 고른다. 융해·응결·증발과 구별한다.",
    "choices": [
     "증발",
     "용해",
     "응결",
     "녹기"
    ],
    "key": 1,
    "previousCriteria": "선택과 근거를 함께 확인한다.",
    "standard": "6과03-01",
    "origin": "previous96"
   },
   "fields": {
    "choices": [
     "증발",
     "용해",
     "응결",
     "끓음"
    ],
    "criteria": "설탕이 물에 골고루 녹는 현상을 용해라고 한 보기를 골라요.",
    "explanation": "설탕이 물에 녹아 골고루 섞이는 현상은 용해예요. 증발·응결·끓음과는 다른 현상이에요."
   }
  },
  {
   "previous": {
    "id": "solution-book-82",
    "no": 82,
    "status": "authored",
    "form": "short",
    "topic": "더 알아볼 방법",
    "prompt": "같은 물체를 두 용액에 각각 넣었더니 모두 바닥에 닿았습니다. 진하기를 비교하려면 무엇을 더 알아보면 좋을지 한 가지 쓰세요.",
    "answer": "교사와 두 용액에서 자유롭게 뜨며 차이를 보일 수 있는 같은 물체로 다시 비교한다.",
    "explanation": "두 용액에서 모두 바닥에 닿으면 자유롭게 뜨는 높이를 비교할 수 없어요. 선생님과 두 용액에서 차이를 살필 수 있는 같은 물체나 다른 방법을 찾아봐요.",
    "misconception": "두 번 가라앉음만으로 같은 진하기라고 확정하지 않는다.",
    "criteria": "같은 물체·온도·벽/바닥 접촉을 확인하고 자유 부유 비교가 가능하도록 교사와 재준비하는 타당한 방법을 인정한다.",
    "previousCriteria": "문항의 조건을 충족하는 동등한 답을 인정한다.",
    "standard": "6과03-02",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "두 용액을 더 비교할 수 있는 타당한 방법 한 가지를 쓰면 인정해요. 예를 들어 두 용액에서 자유롭게 뜰 수 있는 다른 같은 물체로, 온도와 관찰 조건을 맞추어 다시 비교할 수 있어요."
   }
  },
  {
   "previous": {
    "id": "solution-book-84",
    "no": 84,
    "status": "authored",
    "form": "written",
    "topic": "색의 한계",
    "prompt": "같은 진하기의 갈색 설탕물을 깊이가 다른 컵에서 보니 색이 달라 보였습니다. 무엇을 알 수 있나요?",
    "answer": "색은 관찰 깊이의 영향도 받으므로 깊이 등 관찰 조건을 맞추지 않은 색 차이만으로 진하기가 다르다고 할 수 없다.",
    "explanation": "자료에서 두 설탕물의 진하기는 같다고 했어요. 액체를 들여다보는 깊이가 달라 색이 다르게 보일 수 있으므로 같은 깊이와 조명에서 다시 살펴봐요.",
    "misconception": "색과 진하기의 관계를 조건 없는 규칙으로 쓰지 않는다.",
    "criteria": "관찰 깊이 차이 1, 조건 맞추기 1.",
    "lines": 8,
    "previousCriteria": "관찰 깊이 차이 1, 조건 맞추기 1.",
    "standard": "6과03-02",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "같은 진하기여도 관찰하는 깊이가 다르면 색이 다르게 보일 수 있어, 그 색 차이만으로 진하기가 다르다고 할 수 없음을 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "solution-book-89",
    "no": 89,
    "status": "authored",
    "form": "blank",
    "topic": "용해와 융해",
    "prompt": "친구가 “설탕이 물에 녹는 것은 얼음이 녹는 것과 같은 변화야”라고 했어요. 설탕이 물에 녹는 현상의 이름은 [ ]예요.",
    "answer": "용해",
    "explanation": "설탕은 다른 물질인 물에 녹아 골고루 섞이므로 용해라고 해요. 얼음 자체가 물로 바뀌는 녹기와는 다른 현상이에요.",
    "misconception": "일상 낱말 “녹다”에 두 뜻이 있음을 확인한다.",
    "criteria": "물에 녹아 섞이는 현상인 용해를 넣는다. 가열해 액체가 되는 융해와 구별한다.",
    "previousCriteria": "빈칸별 뜻을 확인하며 같은 과학적 뜻의 표현을 인정한다.",
    "standard": "6과03-01",
    "origin": "previous96"
   },
   "fields": {
    "topic": "물에 녹는 것과 상태 변화",
    "criteria": "물에 녹아 골고루 섞이는 현상인 용해를 쓰면 인정해요."
   }
  }
 ],
 "directions": [
  {
   "previous": {
    "section": "온도와 녹는 양 25~26",
    "title": "자료 해석",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-25",
       "solution-book-26"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "따뜻하게 한 뒤 더 녹은 결과와 처음부터 계속 녹을 수 있다는 주장을 구별해요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 포화 상태가 온도에 따라 달라질 수 있음을 살펴요. 어떤 온도에서 고체가 남던 용액도 온도가 바뀌면 녹을 수 있는 양이 달라질 수 있어요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "가열 전후에 바뀐 조건과 남은 고체의 모습을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-25",
     "no": 25,
     "status": "authored",
     "form": "choice",
     "topic": "자료 해석",
     "prompt": "물 50 mL에 충분히 저어도 남아 있던 백반이, 물을 더 넣지 않고 따뜻하게 하자 모두 녹았어요. 이 결과로 알 수 있는 것은?",
     "answer": "①",
     "explanation": "물을 더 넣지 않고 따뜻하게 했더니 남아 있던 백반도 녹았어요. 이 비교에서는 물이 따뜻해지자 더 많은 백반이 녹을 수 있게 되었다고 설명해요.",
     "misconception": "완전히 녹음과 끝없이 녹을 수 있음은 다르다.",
     "criteria": "물을 추가하지 않고 온도를 높인 뒤 더 녹을 수 있었다는 보기를 고른다. 모든 물질로 확대하지 않는다.",
     "choices": [
      "따뜻하게 하니 더 녹을 수 있게 되었다.",
      "차가운 물에는 백반이 전혀 녹지 않는다.",
      "백반 무게가 저절로 0이 되었다.",
      "온도가 높으면 고체는 무엇이나 끝없이 녹는다."
     ],
     "key": 0,
     "previousCriteria": "선택과 근거를 함께 확인한다.",
     "standard": "6과03-01",
     "origin": "previous96"
    },
    {
     "id": "solution-book-26",
     "no": 26,
     "status": "authored",
     "form": "order",
     "topic": "온도 비교",
     "prompt": "물의 온도에 따라 용질이 녹을 수 있는 양을 비교하려고 합니다. 실험 순서를 배열하세요.",
     "answer": "ㄹ → ㄴ → ㄱ → ㄷ",
     "explanation": "같은 용질과 도구를 준비하고(ㄹ), 같은 양의 물을 다른 온도로 마련해요(ㄴ). 같은 양씩 넣어 저으며 남은 고체를 살핀 뒤(ㄱ), 실제 온도와 결과를 적어요(ㄷ).",
     "misconception": "시작 온도만 적고 실제 비교할 때 온도 변화를 무시하지 않는다.",
     "criteria": "같은 용질/도구→같은 물 양·다른 온도→같은 투입/관찰→온도와 결과 기록의 순서를 확인한다.",
     "given": [
      "ㄱ 같은 양씩 용질을 넣고 저은 뒤 남은 고체가 있는지 확인   ㄴ 같은 양의 물을 서로 다른 온도로 준비   ㄷ 실제 물 온도와 결과를 표에 기록   ㄹ 같은 용질과 도구 준비"
     ],
     "previousCriteria": "모든 단계의 선후 관계를 확인한다.",
     "standard": "6과03-01",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "가열 전후에 바뀐 조건과 남은 고체의 모습을 적어요.",
     "value": "25번에서 물을 더 넣었는지, 물의 온도와 남은 고체의 모습이 어떻게 달라졌는지 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "양과 진하기 29~30",
    "title": "진하기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-29",
       "solution-book-30"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "같은 물 양에서는 모두 녹은 용질 양을 비교해 진하기를 판단해요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 용액을 혼합물로 살펴요. 같은 종류의 물질로 만든 용액이라도 용질과 용매의 비가 다르면 밀도와 같은 성질이 달라질 수 있어요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "고체로 남은 양과 실제로 녹은 양을 나누어 읽어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-29",
     "no": 29,
     "status": "authored",
     "form": "blank",
     "topic": "진하기",
     "prompt": "같은 양의 물에 모두 녹은 설탕의 양이 많을수록 설탕물은 더 [ ].",
     "answer": "진하다",
     "explanation": "같은 양의 물에 설탕을 더 많이 넣어 모두 녹이면 설탕물이 더 진해져요.",
     "misconception": "고체로 남은 양까지 전부 녹은 용질 양에 넣지 않는다.",
     "criteria": "같은 물 양에서 모두 녹은 설탕이 많을 때 진하다는 뜻으로 문장을 완성한다.",
     "previousCriteria": "빈칸별 뜻을 확인하며 같은 과학적 뜻의 표현을 인정한다.",
     "standard": "6과03-02",
     "origin": "previous96"
    },
    {
     "id": "solution-book-30",
     "no": 30,
     "status": "authored",
     "form": "choice",
     "topic": "용질 양 비교",
     "prompt": "20 ℃ 물 80 g에 A는 설탕 4 g, B는 12 g을 모두 녹였습니다. 더 진한 것은?",
     "answer": "④",
     "explanation": "A와 B의 물은 모두 80 g이에요. B에는 설탕 12 g이 녹아 A의 4 g보다 많으므로 B가 더 진해요.",
     "misconception": "용액 전체 무게가 다르다는 사실을 비교 불가의 이유로 삼지 않는다.",
     "criteria": "같은 물80g에 설탕12g을 모두 녹인B가4g의A보다 진함을 고른다.",
     "choices": [
      "A",
      "둘은 같다.",
      "자료로 비교할 수 없다.",
      "B"
     ],
     "key": 3,
     "previousCriteria": "선택과 근거를 함께 확인한다.",
     "standard": "6과03-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "고체로 남은 양과 실제로 녹은 양을 나누어 읽어요.",
     "value": "29·30번의 설탕은 모두 녹았나요? 이 조건을 확인하고 두 설탕물의 진하기를 비교하세요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 물체로 비교 39~40",
    "title": "비교의 근거",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-39",
       "solution-book-40"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "색이나 투명함만으로 진하기를 정하지 않고 물질과 관찰 조건을 함께 보아요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 전기를 띤 입자인 이온을 배워요. 소금물과 설탕물은 모두 맑아도 전류가 흐르는 성질이 다를 수 있어, 겉모습이 같은 것과 성질이 같은 것은 달라요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "관찰한 색과 진하기를 뒷받침하는 다른 근거를 나누어 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-39",
     "no": 39,
     "status": "authored",
     "form": "multi",
     "topic": "비교의 근거",
     "prompt": "흰 설탕을 녹인 두 설탕물의 진하기를 비교하려고 합니다. 그것만으로는 진하기를 알기 어려운 근거를 모두 고르세요.",
     "answer": "①, ②",
     "explanation": "컵이 크다는 것과 색 없이 맑다는 것만으로는 진하기를 몰라요. 같은 물 양에 녹은 설탕의 무게나, 같은 물체가 같은 조건에서 뜨는 정도를 비교해요.",
     "misconception": "이 문항은 충분한 근거가 아닌 것을 묻는다.",
     "criteria": "컵 크기와 무색·맑음 자체를 불충분한 근거로 고른다. 양·자유 부유 근거와 구별한다.",
     "choices": [
      "컵이 더 크다는 것",
      "색이 없이 맑다는 것",
      "같은 물 양에 모두 녹인 설탕 무게의 차이",
      "같은 물체가 같은 조건에서 자유롭게 뜨는 높이의 차이"
     ],
     "key": [
      0,
      1
     ],
     "previousCriteria": "필요한 보기를 모두 골랐는지, 틀린 보기를 더 고르지 않았는지 확인한다.",
     "standard": "6과03-02",
     "origin": "previous96"
    },
    {
     "id": "solution-book-40",
     "no": 40,
     "status": "authored",
     "form": "written",
     "topic": "색 비교의 조건",
     "prompt": "갈색 설탕물의 색으로 진하기를 비교하려 합니다. 물질과 관찰 조건을 어떻게 맞춰야 하나요?",
     "answer": "같은 종류의 갈색 설탕을 쓰고 같은 모양의 투명 용기, 같은 관찰 깊이·조명에서 색을 비교한다.",
     "explanation": "같은 종류의 갈색 설탕과 같은 모양의 컵을 써요. 액체를 들여다보는 깊이와 조명도 맞추어요. 이런 조건이 다르면 진하기 외의 까닭으로도 색이 달라 보일 수 있어요.",
     "misconception": "종류나 깊이가 다른 두 색만으로 진하기를 단정하지 않는다.",
     "criteria": "같은 색을 내는 용질 1, 용기/깊이/조명 조건 중 두 가지 1. 맛보기는 요구하지 않는다.",
     "previousCriteria": "같은 색을 내는 용질 1, 용기/깊이/조명 조건 중 두 가지 1. 맛보기는 요구하지 않는다.",
     "lines": 8,
     "standard": "6과03-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "관찰한 색과 진하기를 뒷받침하는 다른 근거를 나누어 적어요.",
     "value": "같은 종류의 갈색 설탕물을 비교할 때, 컵의 깊이와 비추는 빛을 어떻게 맞출지 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "생활 사례와 자료 제작 41~42",
    "title": "조사 기록",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-41",
       "solution-book-42"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "조사한 내용은 다시 찾을 수 있게 출처와 확인 날짜를 남겨요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 용해도를 비교할 때 온도와 용매의 기준 양을 함께 읽어요. 어떤 물질이 잘 녹는다는 자료에도 그때의 조건이 있어야 다른 자료와 비교하기 쉬워요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "성질을 설명하는 자료에서 물질 이름과 비교 조건을 찾아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-41",
     "no": 41,
     "status": "authored",
     "form": "blank",
     "topic": "조사 기록",
     "prompt": "생활 속 용액의 쓰임을 소개할 때 정보의 출처와 [ ]한 날짜를 남기면 다시 찾아 확인하기 쉽다.",
     "answer": "확인/조사",
     "explanation": "자료의 이름과 조사한 날짜를 적으면 같은 자료를 다시 찾아 읽기 쉬워요.",
     "misconception": "책 제목만 적고 실제 해당 내용을 읽었다고 추정하지 않는다.",
     "criteria": "출처와 다시 확인할 수 있는 확인/조사 날짜를 넣는다.",
     "previousCriteria": "빈칸별 뜻을 확인하며 같은 과학적 뜻의 표현을 인정한다.",
     "standard": "6과03-03",
     "origin": "previous96"
    },
    {
     "id": "solution-book-42",
     "no": 42,
     "status": "authored",
     "form": "choice",
     "topic": "용액의 쓰임",
     "prompt": "물에 잘 녹는 색소를 물에 녹여 그림을 그렸어요. 이 사례와 연결할 설명을 고르세요.",
     "answer": "②",
     "explanation": "물에 녹는 색소를 이용하면 색을 고르게 펼쳐 그림을 그릴 수 있어요. 녹은 색소가 없어지거나 다른 물질로 바뀐 것은 아니에요. 모든 물감의 성분이 물에 녹는 것은 아니에요.",
     "misconception": "생활 제품 전체를 단순한 한 용액으로 일반화하지 않는다.",
     "criteria": "물에 녹는 색 성분을 고르게 펼치는 쓰임을 고른다. 제품 전체가 언제나 녹는다고 하지 않는다.",
     "choices": [
      "물감이 없어져 무게가 0이 된다.",
      "물에 녹는 성분을 이용해 색을 고르게 펼칠 수 있다.",
      "모든 물감은 어떤 액체에나 똑같이 녹는다.",
      "색소는 물에 녹으면 다른 물질로 바뀐다."
     ],
     "key": 1,
     "previousCriteria": "선택과 근거를 함께 확인한다.",
     "standard": "6과03-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "성질을 설명하는 자료에서 물질 이름과 비교 조건을 찾아요.",
     "value": "42번에서 무엇이 물에 녹았는지 찾아 쓰고, 그 성질이 그림을 그리는 데 어떤 도움을 주는지 설명하세요."
    }
   ]
  },
  {
   "previous": {
    "section": "생활 사례와 자료 제작 43~44",
    "title": "정보의 종류",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-43",
       "solution-book-44"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "사실·내 제안·자료를 나눈 일을 각각 구별해 설명해요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 순물질과 혼합물을 구별해요. 맑고 균일하게 보이는 소금물도 한 가지 물질만 있는 순물질이 아니라 여러 물질이 섞인 혼합물이에요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "사례에서 용질과 용매에 해당하는 부분을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-43",
     "no": 43,
     "status": "authored",
     "form": "match",
     "topic": "알아본 방법 구별하기",
     "prompt": "각 내용을 어떤 방법으로 알아보았는지 연결하세요.",
     "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
     "explanation": "제품 설명서에서 읽은 것은 자료에서 확인함(ㄱ), 직접 써 보며 본 것은 직접 관찰함(ㄴ)이에요. 아직 해 보지 않은 새 방법은 예상(ㄷ)으로 표시해요.",
     "misconception": "예상한 효과를 제품의 검증된 효과로 쓰지 않는다.",
     "criteria": "설명서=자료에서 확인, 직접 본 모습=관찰, 아직 하지 않은 사용법=예상으로 각각 연결한다.",
     "given": [
      "ㄱ 자료에서 확인함   ㄴ 직접 관찰함   ㄷ 아직 예상임"
     ],
     "parts": [
      "(1) 제품 설명서에서 용도를 읽음 [ ]",
      "(2) 교사와 사용하며 퍼지는 모습을 봄 [ ]",
      "(3) 아직 만들지 않은 새 사용법 [ ]"
     ],
     "previousCriteria": "각 소문항의 연결을 따로 확인한다.",
     "answerPerPart": true,
     "standard": "6과03-03",
     "origin": "previous96"
    },
    {
     "id": "solution-book-44",
     "no": 44,
     "status": "authored",
     "form": "order",
     "topic": "소개 자료 만들기",
     "prompt": "용액의 필요성을 알리는 자료를 만들고 나누는 순서는?",
     "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
     "explanation": "누구에게 무엇을 알릴지 정하고(ㄷ), 자료를 찾아 사례를 조사해요(ㄱ). 설명 자료를 만든 뒤(ㄹ), 친구에게 보여 주고 들은 질문을 적어요(ㄴ).",
     "misconception": "파일을 만들거나 저장한 일을 실제 전달한 일과 혼동하지 않는다.",
     "criteria": "대상과 주제→출처 확인 조사→자료 제작·점검→실제 전달·질문의 순서를 확인한다.",
     "given": [
      "ㄱ 출처를 확인해 사례 조사   ㄴ 실제로 전달하고 질문 기록   ㄷ 전할 대상과 주제 정하기   ㄹ 설명 자료 만들고 내용 점검"
     ],
     "previousCriteria": "모든 단계의 선후 관계를 확인한다.",
     "standard": "6과03-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "사례에서 용질과 용매에 해당하는 부분을 표시해요.",
     "value": "43번에서 자료를 읽어 알게 된 일과 직접 관찰하여 알게 된 일을 하나씩 찾아 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "생활 사례와 자료 제작 46",
    "title": "실제 소통",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-46"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "자료를 보여 준 뒤 받은 질문을 바탕으로 설명을 보완해요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 물질의 특성을 이용해 분리 방법을 설계해요. 왜 그 방법을 골랐는지 용해도나 끓는점 같은 성질과 연결하여 다른 사람에게 설명하게 돼요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "친구가 이해하기 어려워한 부분과 고친 설명을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-46",
     "no": 46,
     "status": "authored",
     "form": "written",
     "topic": "자료를 만들고 공유하기",
     "prompt": "자료를 만들었지만 아직 친구에게 보여 주지 못했습니다. 지금까지 한 일과 앞으로 할 일을 어떻게 적으면 좋을까요?",
     "answer": "자료 제작 완료, 실제 전달 미실행으로 쓰고 누구에게 언제 어떤 방법으로 보여 줄지 계획을 따로 적는다.",
     "explanation": "지금까지 한 일은 자료를 만든 것이에요. 친구에게 보여 주는 일은 앞으로의 계획으로 적어요. 아직 듣지 않은 의견을 들었다고 쓰지는 않아요.",
     "misconception": "계획한 발표 날짜를 이미 발표한 날짜로 쓰지 않는다.",
     "criteria": "제작/전달 상태 구분 1, 실행할 다음 계획 1. 미실행을 정직하게 남기면 인정한다.",
     "previousCriteria": "제작/전달 상태 구분 1, 실행할 다음 계획 1. 미실행을 정직하게 남기면 인정한다.",
     "lines": 8,
     "standard": "6과03-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "실제 소통",
     "value": "공유하기 전과 후"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "자료를 보여 준 뒤 받은 질문을 바탕으로 설명을 보완해요.",
     "value": "자료를 만든 것과 친구에게 보여 준 것을 구별해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "친구가 이해하기 어려워한 부분과 고친 설명을 적어요.",
     "value": "46번에서 아직 하지 않은 일은 무엇인가요? 친구에게 보여 준 뒤 알아보고 싶은 점도 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "자료·그림·근거로 깊이 풀기 55~56",
    "title": "주장과 근거",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-55",
       "solution-book-56"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "주장에 맞는 비교 자료를 찾고 질문에 답하도록 설명을 고쳐요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 혼합물이 고르게 섞였는지도 비교해요. 소금물처럼 성질이 고른 혼합물과 모래가 남은 물처럼 위치에 따라 모습이 다른 혼합물은 구별해 살펴요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "그림이나 문장에서 용액인 부분을 정확히 가리켜요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-55",
     "no": 55,
     "status": "authored",
     "form": "choice",
     "topic": "주장과 근거",
     "prompt": "“같은 물 양에서 녹은 설탕을 더 넣으면 진해진다.”를 직접 뒷받침하는 비교는?",
     "answer": "①",
     "explanation": "물 60 g은 같게 두고 설탕만 3 g과 9 g으로 달리해 모두 녹여요. 같은 물에 녹은 설탕이 많으면 더 진해진다는 설명과 맞는 비교예요.",
     "misconception": "다른 물질의 색 차이를 같은 용액의 진하기 차이로 읽지 않는다.",
     "criteria": "같은 물60g에 설탕3g/9g을 모두 녹인 비교를 고른다. 종류나 관찰 조건이 다른 비교와 구별한다.",
     "choices": [
      "같은 물 60 g에 설탕 3 g/9 g을 모두 녹임",
      "서로 다른 컵에 물만 다르게 담음",
      "흰 설탕물과 빨간 물감 색을 비교",
      "A는 설탕, B는 소금을 같은 양 넣음"
     ],
     "key": 0,
     "previousCriteria": "선택과 근거를 함께 확인한다.",
     "standard": "6과03-02",
     "origin": "previous96"
    },
    {
     "id": "solution-book-56",
     "no": 56,
     "status": "authored",
     "form": "written",
     "topic": "의견 반영",
     "prompt": "카드를 보여 주니 친구가 “어느 부분이 용액인지 모르겠어.”라고 했습니다. 무엇을 고치고 어떻게 기록할까요?",
     "answer": "사례 그림에 물에 녹은 성분과 용액 부분의 이름표를 넣고, 받은 질문·바꾼 설명·다시 전달했는지 기록한다.",
     "explanation": "그림에 어떤 성분이 물에 녹았고 어느 부분이 용액인지 이름표를 넣어요. 친구의 질문과 고친 내용을 적고, 다시 보여 주었다면 그때 들은 의견도 남겨요.",
     "misconception": "막연히 “더 예쁘게 꾸밈”만으로 질문이 해결됐다고 하지 않는다.",
     "criteria": "질문에 맞는 수정 1, 의견/수정/재전달 구분 1. 다른 타당한 수정 인정.",
     "previousCriteria": "질문에 맞는 수정 1, 의견/수정/재전달 구분 1. 다른 타당한 수정 인정.",
     "lines": 8,
     "standard": "6과03-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "그림이나 문장에서 용액인 부분을 정확히 가리켜요.",
     "value": "56번의 친구가 용액인 부분을 알아볼 수 있도록, 그림이나 설명을 어떻게 고칠지 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "빈칸 핵심 정리 63~64",
    "title": "비교 기준",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-63",
       "solution-book-64"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "뜨는 정도는 같은 물체로 비교하고 자료를 나눈 일은 실제 행동으로 확인해요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 액체 속 물체의 잠긴 부피와 부력을 연결해요. 같은 물체가 다른 밀도의 액체에서 정지해 떠 있으려면 잠기는 정도가 달라질 수 있어요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "같은 물체와 수면의 관계를 비교 그림에 나타내요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-63",
     "no": 63,
     "status": "authored",
     "form": "blank",
     "topic": "비교 기준",
     "prompt": "뜨는 정도로 진하기를 비교할 때 서로 다른 토마토 대신 [ ] 물체를 사용한다.",
     "answer": "같은",
     "explanation": "같은 물체를 써야 물체 자체의 차이를 줄이고 두 용액에서 뜨는 정도를 비교할 수 있어요.",
     "misconception": "크기만 비슷하면 언제나 완전히 같은 물체라고 가정하지 않는다.",
     "criteria": "뜨는 정도의 기준이 될 같은 물체를 넣는다. 같은 종류라도 서로 다른 크기는 구별한다.",
     "previousCriteria": "빈칸별 뜻을 확인하며 같은 과학적 뜻의 표현을 인정한다.",
     "standard": "6과03-02",
     "origin": "previous96"
    },
    {
     "id": "solution-book-64",
     "no": 64,
     "status": "authored",
     "form": "blank",
     "topic": "공유하고 의견 나누기",
     "prompt": "소개 자료를 만드는 일과 실제로 [ ]하는 일을 구분하고, 친구에게 받은 [ ]을 바탕으로 설명을 고친다.",
     "answer": "전달/공유, 의견/질문",
     "explanation": "자료를 만든 것, 친구에게 보여 준 것, 친구의 의견을 듣고 고친 것은 서로 다른 일이에요. 실제로 어디까지 했는지 나누어 적어요.",
     "misconception": "저장 버튼을 누른 것을 친구가 읽은 증거로 삼지 않는다.",
     "criteria": "실제 전달/공유와 받은 의견/질문을 각각 넣는다. 제작만으로 전달을 완료했다고 하지 않는다.",
     "previousCriteria": "빈칸별 뜻을 확인하며 같은 과학적 뜻의 표현을 인정한다.",
     "standard": "6과03-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "같은 물체와 수면의 관계를 비교 그림에 나타내요.",
     "value": "뜨는 정도를 비교할 때 같은 물체를 써야 하는 까닭을 설명하세요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 확인 67~68",
    "title": "관찰과 설명",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-67",
       "solution-book-68"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "관찰한 사실과 그 사실을 설명하는 개념을 나누어 적어요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 포화 용액에 녹지 않은 고체가 함께 있을 수 있음을 배워요. 바닥의 고체가 보인다는 사실만으로 위 액체에 같은 물질이 전혀 녹지 않았다고 볼 수는 없어요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "바닥과 위 액체에서 각각 확인한 것을 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-67",
     "no": 67,
     "status": "authored",
     "form": "match",
     "topic": "관찰과 설명",
     "prompt": "직접 본 사실과 그 까닭을 생각한 설명을 연결하세요.",
     "answer": "(1) ㄱ (2) ㄴ",
     "explanation": "설탕 알갱이가 안 보였다는 것은 직접 관찰한 사실(ㄱ)이에요. 설탕이 녹아 골고루 섞였다는 생각은 그 관찰을 바탕으로 한 설명(ㄴ)이에요.",
     "misconception": "설명에 나온 개념을 눈으로 직접 본 물체로 취급하지 않는다.",
     "criteria": "알갱이가 안 보인 사실=직접 관찰, 고르게 녹았다는 해석=설명으로 각각 연결한다.",
     "given": [
      "ㄱ 직접 관찰한 사실   ㄴ 관찰을 바탕으로 한 설명"
     ],
     "parts": [
      "(1) 젓기 전 있던 설탕 알갱이가 보이지 않았다. [ ]",
      "(2) 설탕이 물에 녹아 고르게 섞였다고 생각했다. [ ]"
     ],
     "previousCriteria": "각 소문항의 연결을 따로 확인한다.",
     "answerPerPart": true,
     "standard": "6과03-01",
     "origin": "previous96"
    },
    {
     "id": "solution-book-68",
     "no": 68,
     "status": "authored",
     "form": "written",
     "topic": "부분 용해",
     "prompt": "가루 일부가 바닥에 남은 액체를 보고 “이 가루는 한 알도 녹지 않았다.”고 합니다. 이 결론의 문제를 쓰세요.",
     "answer": "일부가 남은 것만으로 전혀 녹지 않았다고 할 수 없다. 일부는 녹고 나머지가 남았을 수 있다.",
     "explanation": "일부가 바닥에 남았어도 다른 일부는 물에 녹아 있을 수 있어요. 남은 고체를 보았다는 것만으로 한 알도 녹지 않았다고 정할 수는 없어요.",
     "misconception": "남아 있음과 전혀 안 녹음을 구별한다.",
     "criteria": "확인한 것과 확인 못한 양을 구분 1, 일부 용해 가능성 1.",
     "lines": 8,
     "previousCriteria": "확인한 것과 확인 못한 양을 구분 1, 일부 용해 가능성 1.",
     "standard": "6과03-01",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "바닥과 위 액체에서 각각 확인한 것을 써요.",
     "value": "바닥에 남은 가루를 본 것만으로 아직 알 수 없는 내용 한 가지를 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 확인 86~87",
    "title": "소통과 보완",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-86",
       "solution-book-87"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "소개한 뒤 실제로 받은 질문을 듣고 성질 설명을 더 분명하게 고쳐요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 혼합물을 이루는 물질들의 성질 차이를 이용해 분리해요. 여러 색소가 섞인 잉크를 나누어 보는 일은 겉으로 보이는 한 색과 구성 물질이 다를 수 있음을 알려 줘요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "친구의 질문에 답하도록 용액의 어느 부분을 더 설명할지 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-86",
     "no": 86,
     "status": "authored",
     "form": "order",
     "topic": "소개하고 설명 고치기",
     "prompt": "완성한 소개 자료를 친구에게 보여 주고 설명을 고치려고 합니다. 순서를 배열하세요.",
     "answer": "ㄷ → ㄱ → ㄴ → ㄹ",
     "explanation": "친구에게 보여 주고 설명한 뒤(ㄷ), 질문과 의견을 적어요(ㄱ). 설명을 고친 다음(ㄴ), 다시 보여 주었는지와 그 결과를 남겨요(ㄹ).",
     "misconception": "받지 않은 의견을 미리 작성하지 않는다.",
     "criteria": "실제로 보여 줌→받은 질문/의견→설명 수정→재전달 여부/결과의 순서를 확인한다.",
     "given": [
      "ㄱ 받은 질문과 의견 기록   ㄴ 설명 수정   ㄷ 친구에게 보여 주고 설명   ㄹ 다시 소개했는지와 그 결과 기록"
     ],
     "previousCriteria": "모든 단계의 선후 관계를 확인한다.",
     "standard": "6과03-03",
     "origin": "previous96"
    },
    {
     "id": "solution-book-87",
     "no": 87,
     "status": "authored",
     "form": "multi",
     "topic": "한 일과 앞으로 할 일",
     "prompt": "지금까지 한 일을 바르게 적은 기록을 모두 고르세요.",
     "answer": "①, ③",
     "explanation": "실제로 설명한 것과 의견을 들은 것, 자료를 만든 것을 나누어 적어요. 자료가 완성돼도 아직 친구에게 보여 주지 않았을 수 있어요.",
     "misconception": "미실행과 미수신은 지워야 할 오류가 아니라 현재 상태다.",
     "criteria": "실제로 한 설명의 의견 미수신과 제작 완료·전달 미실행을 고른다. 계획을 완료로 바꾼 기록은 제외한다.",
     "choices": [
      "실제 설명했으나 의견은 아직 받지 못함",
      "만들 계획만 세웠지만 제작 완료로 표시함",
      "자료를 완성했으나 전달은 아직 안 함",
      "발표 예정일을 실제 발표일로 적음"
     ],
     "key": [
      0,
      2
     ],
     "previousCriteria": "필요한 보기를 모두 골랐는지, 틀린 보기를 더 고르지 않았는지 확인한다.",
     "standard": "6과03-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "친구의 질문에 답하도록 용액의 어느 부분을 더 설명할지 써요.",
     "value": "86번에서 질문과 의견을 기록한 뒤 설명을 고치는 까닭을 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "오개념 다시 보기 89~90",
    "title": "용해와 융해",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "solution-book-89",
       "solution-book-90"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "용해와 융해를 구별하고 처음과 나중에 잰 물건을 확인해요.",
      "write": 0
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 상태 변화에서 물질을 이루는 입자 자체가 사라지지 않음을 배워요. 고체가 액체로 바뀌는 설명과 용질 입자가 용매 속으로 퍼지는 설명을 구별해 살펴요.",
      "write": 0
     },
     {
      "title": "내가 정리할 것",
      "text": "녹았다는 말이 상태 변화인지 용해인지 문장으로 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "solution-book-89",
     "no": 89,
     "status": "authored",
     "form": "blank",
     "topic": "용해와 융해",
     "prompt": "친구가 “설탕이 물에 녹는 것은 얼음이 녹는 것과 같은 변화야”라고 했어요. 설탕이 물에 녹는 현상의 이름은 [ ]예요.",
     "answer": "용해",
     "explanation": "설탕은 다른 물질인 물에 녹아 골고루 섞이므로 용해라고 해요. 얼음 자체가 물로 바뀌는 녹기와는 다른 현상이에요.",
     "misconception": "일상 낱말 “녹다”에 두 뜻이 있음을 확인한다.",
     "criteria": "물에 녹아 섞이는 현상인 용해를 넣는다. 가열해 액체가 되는 융해와 구별한다.",
     "previousCriteria": "빈칸별 뜻을 확인하며 같은 과학적 뜻의 표현을 인정한다.",
     "standard": "6과03-01",
     "origin": "previous96"
    },
    {
     "id": "solution-book-90",
     "no": 90,
     "status": "authored",
     "form": "choice",
     "topic": "측정 다시 보기",
     "prompt": "처음에 함께 잰 약포지를 끝에 빼고 쟀습니다. 다음 행동으로 알맞은 것은?",
     "answer": "④",
     "explanation": "빈 약포지를 빼고 쟀으므로 같은 물건 전체를 올려 다시 재어요. 처음 값도 지우지 않고 무엇을 고쳐 다시 쟀는지 함께 적어요.",
     "misconception": "재측정과 원래 결과 조작을 구별한다.",
     "criteria": "같은 물건 전체를 다시 올려 비교하고 두 실제 기록을 남기는 보기를 고른다.",
     "choices": [
      "작게 나온 값을 지운다.",
      "설탕이 없어진 증거로 확정한다.",
      "설탕을 더 넣어 처음값에 맞춘다.",
      "같은 물건 전체를 올려 다시 재고 두 기록을 남긴다."
     ],
     "key": 3,
     "previousCriteria": "선택과 근거를 함께 확인한다.",
     "standard": "6과03-01",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "용해와 융해",
     "value": "용해와 무게 비교 다시 보기"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "용해와 융해를 구별하고 처음과 나중에 잰 물건을 확인해요.",
     "value": "설탕이 물에 녹는 현상과 얼음이 물로 바뀌는 변화를 구별해요. 무게를 비교할 때에는 같은 물건 전체를 재요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "녹았다는 말이 상태 변화인지 용해인지 문장으로 설명해요.",
     "value": "설탕이 물에 녹는 것과 얼음이 물이 되는 것은 무엇이 다른지 설명하세요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withSolutionContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s51-u03'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s51-u03-b004",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E7",
    "type": "T13",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-03",
    "topic": "관찰과 자료",
    "concept": "생활 쓰임 조사·자료 제작·실제 공유",
    "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
   },
   "prompt": "“문제의 표에서 따뜻한 물에 더 많이 녹았다.” 이 문장만으로 내가 실험했다고 할 수 있나요? 까닭을 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "아니에요. 문제에 나온 표를 읽은 것만으로는 내가 직접 실험했다고 할 수 없어요.",
    "rubric": {
     "required": [
      "문제의 표를 읽는 것과 직접 실험하는 것은 다르다는 까닭을 설명하면 돼요."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-04",
    "no": 4
   },
   "explanation": "문제의 표를 읽은 것과 내가 직접 실험한 것은 달라요. 직접 실험했다면 언제 어떤 조건에서 무엇을 관찰했는지 따로 적어요.",
   "misconception": "정답을 맞힌 것을 실제 탐구 수행의 증거로 바꾸지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261115-grade5-question-review",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b004",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E7",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-03",
      "topic": "관찰과 자료",
      "concept": "생활 쓰임 조사·자료 제작·실제 공유",
      "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
     },
     "prompt": "“문제의 표에서 따뜻한 물에 더 많이 녹았다.” 이 문장만으로 내가 실험했다고 할 수 있나요? 까닭을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "아니다. 표는 제공된 자료이고 내가 직접 한 관찰인지는 별도로 밝혀야 한다.",
      "rubric": {
       "required": [
        "제공 자료임을 구분 1, 직접 수행의 추가 근거 1."
       ],
       "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
       "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-04",
      "no": 4
     },
     "explanation": "자료를 읽어 얻은 결론과 직접 수행한 사실은 다른 근거이다. 직접 실험했다면 날짜·조건·결과를 남겨야 한다.",
     "misconception": "정답을 맞힌 것을 실제 탐구 수행의 증거로 바꾸지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    },
    {
     "id": "c22-s51-u03-b004",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E7",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-03",
      "topic": "관찰과 자료",
      "concept": "생활 쓰임 조사·자료 제작·실제 공유",
      "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
     },
     "prompt": "“문제의 표에서 따뜻한 물에 더 많이 녹았다.” 이 문장만으로 내가 실험했다고 할 수 있나요? 까닭을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "아니다. 표는 제공된 자료이고 내가 직접 한 관찰인지는 별도로 밝혀야 한다.",
      "rubric": {
       "required": [
        "제공 자료임을 구분 1, 직접 수행의 추가 근거 1."
       ],
       "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
       "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-04",
      "no": 4
     },
     "explanation": "문제의 표를 읽은 것과 내가 직접 실험한 것은 달라요. 직접 실험했다면 언제 어떤 조건에서 무엇을 관찰했는지 따로 적어요.",
     "misconception": "정답을 맞힌 것을 실제 탐구 수행의 증거로 바꾸지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "contentVersion": "20261106-solution-readable-workbook",
     "previousVersions": [
      {
       "id": "c22-s51-u03-b004",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 용해와 용액 창작 학습",
        "course": "초등 5-1"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 1,
        "unit": "u03",
        "area": "물질",
        "element": "E7",
        "type": "T13",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "6과03-03",
        "topic": "관찰과 자료",
        "concept": "생활 쓰임 조사·자료 제작·실제 공유",
        "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
       },
       "prompt": "“문제의 표에서 따뜻한 물에 더 많이 녹았다.” 이 문장만으로 내가 실험했다고 할 수 있나요? 까닭을 쓰세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "아니다. 표는 제공된 자료이고 내가 직접 한 관찰인지는 별도로 밝혀야 한다.",
        "rubric": {
         "required": [
          "제공 자료임을 구분 1, 직접 수행의 추가 근거 1."
         ],
         "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
         "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
        }
       },
       "bookResponseForm": "written",
       "workbookRef": {
        "unit": "c22-s51-u03",
        "id": "solution-book-04",
        "no": 4
       },
       "explanation": "자료를 읽어 얻은 결론과 직접 수행한 사실은 다른 근거이다. 직접 실험했다면 날짜·조건·결과를 남겨야 한다.",
       "misconception": "정답을 맞힌 것을 실제 탐구 수행의 증거로 바꾸지 않는다.",
       "evidence": {
        "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
        "date": "2026-10-18",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
        "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
       },
       "version": 1
      }
     ],
     "version": "20261106-solution-readable-workbook",
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "prompt": "자료에서 “따뜻한 물에 더 많이 녹았다”는 설명을 읽었어요. 이 글을 읽은 것만으로 내가 직접 실험했다고 할 수 있을까요? 까닭을 쓰세요.",
   "explanation": "자료에서 설명을 읽는 것과 내가 직접 실험하는 것은 달라요. 직접 실험했다면 어떤 조건에서 무엇을 관찰했는지 따로 남겨요.",
   "answerContract": {
    "type": "written-explanation",
    "sample": "아니에요. 자료의 설명을 읽은 것만으로는 내가 직접 실험했다고 할 수 없어요.",
    "rubric": {
     "required": [
      "자료를 읽는 것과 직접 실험하는 것은 다르다는 까닭을 설명하면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b012",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E2",
    "type": "T04",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-01",
    "topic": "같은 계 측정",
    "concept": "같은 물건 전체의 용해 전후 질량",
    "inquirySkill": "같은 물건 전체의 용해 전후 질량"
   },
   "prompt": "용해 전에 물·컵·설탕·약포지를 함께 쟀어요. 용해 후에도 같은 물건 전체를 비교하려면 무엇을 함께 재야 하나요?",
   "givens": null,
   "choices": [
    "설탕물만",
    "설탕물·새 컵",
    "설탕물·같은 컵·새 설탕",
    "설탕물·같은 컵·빈 약포지",
    "설탕물·같은 컵·빈 약포지·처음에는 재지 않은 젓는 막대"
   ],
   "responseContract": "single-choice",
   "answerContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "bookResponseForm": "choice",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-12",
    "no": 12
   },
   "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
   "explanation": "처음에 컵과 약포지도 함께 쟀으므로 나중에도 같은 컵과 빈 약포지를 올려요. 설탕을 물로 옮겼어도 저울에 올리는 물건 전체는 같아야 해요.",
   "misconception": "용해 후 빈 약포지는 질량이 없다고 생각하지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b012",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 계 측정",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
     },
     "prompt": "용해 전 물·컵·설탕·약포지를 함께 쟀습니다. 용해 후 무엇을 함께 재야 공정한가요?",
     "givens": null,
     "choices": [
      "설탕물만",
      "설탕물·새 컵",
      "설탕물·같은 컵·새 설탕",
      "설탕물·같은 컵·빈 약포지",
      "설탕물·같은 컵·빈 약포지·처음에는 재지 않은 젓는 막대"
     ],
     "responseContract": "single-choice",
     "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
       3
      ]
     },
     "bookResponseForm": "choice",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-12",
      "no": 12
     },
     "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
     "explanation": "설탕만 약포지에서 물로 옮겨야 하며 재는 물건 전체는 같아야 한다. 빈 약포지를 빼면 비교 대상이 달라진다.",
     "misconception": "용해 후 빈 약포지는 질량이 없다고 생각하지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E2",
    "type": "T04",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-01",
    "topic": "같은 물건 전체의 무게",
    "concept": "같은 물건 전체의 용해 전후 질량",
    "inquirySkill": "같은 물건 전체의 용해 전후 질량"
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b027",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E4",
    "type": "T07",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-01",
    "topic": "결론의 조건",
    "concept": "물 온도에 따른 녹을 수 있는 양",
    "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
   },
   "prompt": "온도 비교를 다시 확인할 때 살필 것을 모두 고르세요.",
   "givens": null,
   "choices": [
    "두 물의 양이 같은가?",
    "실제로 비교할 때 물 온도는 얼마인가?",
    "따뜻한 쪽 결과만 남겼는가?",
    "충분히 젓고 남은 고체를 같은 방법으로 보았는가?"
   ],
   "responseContract": "multi-choice",
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     1,
     3
    ]
   },
   "bookResponseForm": "multi",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-27",
    "no": 27
   },
   "explanation": "두 물의 양이 같은지, 비교할 때 실제 온도는 얼마인지 확인해요. 젓고 남은 고체를 관찰하는 방법도 같게 해요. 두 조건의 결과를 모두 남겨 비교해요.",
   "misconception": "예상과 다른 조건의 기록을 지우지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b027",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "결론의 조건",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
     },
     "prompt": "온도 비교를 다시 확인할 때 살필 것을 모두 고르세요.",
     "givens": null,
     "choices": [
      "두 물의 양이 같은가?",
      "실제로 비교할 때 물 온도는 얼마인가?",
      "따뜻한 쪽 결과만 남겼는가?",
      "충분히 젓고 남은 고체를 같은 방법으로 보았는가?"
     ],
     "responseContract": "multi-choice",
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       1,
       3
      ]
     },
     "bookResponseForm": "multi",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-27",
      "no": 27
     },
     "explanation": "물 양, 실제 온도, 관찰 방법을 확인해야 한다. 한 조건만 남기면 비교 근거가 사라진다.",
     "misconception": "예상과 다른 조건의 기록을 지우지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "물의 온도에 따라 녹는 양을 비교한 결론을 다시 살펴보려고 해요. 알맞은 방법을 모두 고르세요.",
   "choices": [
    "두 물의 양이 같은지 확인한다.",
    "실제로 비교할 때 물의 온도를 확인한다.",
    "따뜻한 쪽의 결과만 골라 기록한다.",
    "충분히 젓고 남은 고체를 같은 방법으로 확인한다."
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b047",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E3",
    "type": "T05",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-01",
    "topic": "자료로 알 수 있는 녹는 양",
    "concept": "용질 종류에 따른 녹을 수 있는 양",
    "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
   },
   "prompt": "연습 자료: 물 각 50 mL, 20 ℃. A는 4 g/8 g 모두 녹음, B는 4 g 모두/8 g 일부 남음. 옳은 것은?",
   "givens": null,
   "choices": [
    "A의 최대량은 정확히 8 g이다.",
    "B는 4 g도 녹이지 못한다.",
    "A는 적어도 8 g 녹고 B의 최대량은 8 g보다 작다.",
    "A와 B의 최대량은 같다.",
    "A 8 g이 모두 녹았으므로 온도나 물 양을 바꾸어도 최대량은 늘지 않는다."
   ],
   "responseContract": "single-choice",
   "answerContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "bookResponseForm": "choice",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-47",
    "no": 47
   },
   "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
   "explanation": "A는 넣은 8 g이 모두 녹아 적어도 8 g은 녹을 수 있어요. B는 8 g 중 일부가 남아 이 조건에서 8 g을 전부 녹이지 못했어요.",
   "misconception": "모두 녹은 마지막 투입량을 바로 정확한 최대량으로 쓰지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b047",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "표의 상한과 하한",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
     },
     "prompt": "연습 자료: 물 각 50 mL, 20 ℃. A는 4 g/8 g 모두 녹음, B는 4 g 모두/8 g 일부 남음. 옳은 것은?",
     "givens": null,
     "choices": [
      "A의 최대량은 정확히 8 g이다.",
      "B는 4 g도 녹이지 못한다.",
      "A는 적어도 8 g 녹고 B의 최대량은 8 g보다 작다.",
      "A와 B의 최대량은 같다.",
      "A 8 g이 모두 녹았으므로 온도나 물 양을 바꾸어도 최대량은 늘지 않는다."
     ],
     "responseContract": "single-choice",
     "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
       2
      ]
     },
     "bookResponseForm": "choice",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-47",
      "no": 47
     },
     "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
     "explanation": "A는 8 g을 모두 녹였으므로 적어도 8 g, B는 8 g 중 일부가 남았으므로 8 g 전부를 녹이지 못한다. 최대량의 정확한 수치는 알 수 없다.",
     "misconception": "모두 녹은 마지막 투입량을 바로 정확한 최대량으로 쓰지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    },
    {
     "id": "c22-s51-u03-b047",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "자료로 알 수 있는 녹는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
     },
     "prompt": "연습 자료: 물 각 50 mL, 20 ℃. A는 4 g/8 g 모두 녹음, B는 4 g 모두/8 g 일부 남음. 옳은 것은?",
     "givens": null,
     "choices": [
      "A의 최대량은 정확히 8 g이다.",
      "B는 4 g도 녹이지 못한다.",
      "A는 적어도 8 g 녹고 B의 최대량은 8 g보다 작다.",
      "A와 B의 최대량은 같다.",
      "A 8 g이 모두 녹았으므로 온도나 물 양을 바꾸어도 최대량은 늘지 않는다."
     ],
     "responseContract": "single-choice",
     "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
       2
      ]
     },
     "bookResponseForm": "choice",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-47",
      "no": 47
     },
     "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
     "explanation": "A는 8 g을 모두 녹였으므로 적어도 8 g, B는 8 g 중 일부가 남았으므로 8 g 전부를 녹이지 못한다. 최대량의 정확한 수치는 알 수 없다.",
     "misconception": "모두 녹은 마지막 투입량을 바로 정확한 최대량으로 쓰지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "contentVersion": "20261105-solution-student-language",
     "previousVersions": [
      {
       "id": "c22-s51-u03-b047",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 용해와 용액 창작 학습",
        "course": "초등 5-1"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 1,
        "unit": "u03",
        "area": "물질",
        "element": "E3",
        "type": "T05",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "6과03-01",
        "topic": "표의 상한과 하한",
        "concept": "용질 종류에 따른 녹을 수 있는 양",
        "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
       },
       "prompt": "연습 자료: 물 각 50 mL, 20 ℃. A는 4 g/8 g 모두 녹음, B는 4 g 모두/8 g 일부 남음. 옳은 것은?",
       "givens": null,
       "choices": [
        "A의 최대량은 정확히 8 g이다.",
        "B는 4 g도 녹이지 못한다.",
        "A는 적어도 8 g 녹고 B의 최대량은 8 g보다 작다.",
        "A와 B의 최대량은 같다.",
        "A 8 g이 모두 녹았으므로 온도나 물 양을 바꾸어도 최대량은 늘지 않는다."
       ],
       "responseContract": "single-choice",
       "answerContract": {
        "type": "single-choice",
        "answer": 2,
        "accepted": [
         2
        ]
       },
       "bookResponseForm": "choice",
       "workbookRef": {
        "unit": "c22-s51-u03",
        "id": "solution-book-47",
        "no": 47
       },
       "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
       "explanation": "A는 8 g을 모두 녹였으므로 적어도 8 g, B는 8 g 중 일부가 남았으므로 8 g 전부를 녹이지 못한다. 최대량의 정확한 수치는 알 수 없다.",
       "misconception": "모두 녹은 마지막 투입량을 바로 정확한 최대량으로 쓰지 않는다.",
       "evidence": {
        "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
        "date": "2026-10-18",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
        "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
       },
       "version": 1
      }
     ],
     "version": "20261105-solution-student-language"
    }
   ]
  },
  "fields": {
   "prompt": "연습 자료: 물 각 50 mL, 20 ℃. 같은 방법으로 충분히 저은 뒤, A는 4 g과 8 g이 모두 녹았고 B는 4 g은 모두 녹았지만 8 g은 일부 남았어요. 옳은 설명을 고르세요."
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b056",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E7",
    "type": "T13",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-03",
    "topic": "의견 반영",
    "concept": "생활 쓰임 조사·자료 제작·실제 공유",
    "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
   },
   "prompt": "카드를 보여 주니 친구가 “어느 부분이 용액인지 모르겠어.”라고 했습니다. 무엇을 고치고 어떻게 기록할까요?",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "사례 그림에 물에 녹은 성분과 용액 부분의 이름표를 넣고, 받은 질문·바꾼 설명·다시 전달했는지 기록한다.",
    "rubric": {
     "required": [
      "질문에 맞는 수정 1, 의견/수정/재전달 구분 1. 다른 타당한 수정 인정."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-56",
    "no": 56
   },
   "explanation": "그림에 어떤 성분이 물에 녹았고 어느 부분이 용액인지 이름표를 넣어요. 친구의 질문과 고친 내용을 적고, 다시 보여 주었다면 그때 들은 의견도 남겨요.",
   "misconception": "막연히 “더 예쁘게 꾸밈”만으로 질문이 해결됐다고 하지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b056",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E7",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-03",
      "topic": "의견 반영",
      "concept": "생활 쓰임 조사·자료 제작·실제 공유",
      "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
     },
     "prompt": "카드를 보여 주니 친구가 “어느 부분이 용액인지 모르겠어.”라고 했습니다. 무엇을 고치고 어떻게 기록할까요?",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "사례 그림에 물에 녹은 성분과 용액 부분의 이름표를 넣고, 받은 질문·바꾼 설명·다시 전달했는지 기록한다.",
      "rubric": {
       "required": [
        "질문에 맞는 수정 1, 의견/수정/재전달 구분 1. 다른 타당한 수정 인정."
       ],
       "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
       "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-56",
      "no": 56
     },
     "explanation": "구체적인 질문에 맞춰 설명을 고치면 전달력이 좋아진다. 수정과 재전달의 실제 상태를 구분해야 한다.",
     "misconception": "막연히 “더 예쁘게 꾸밈”만으로 질문이 해결됐다고 하지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "사례 그림에 물에 녹은 성분과 용액 부분의 이름표를 넣고, 받은 질문·바꾼 설명·다시 전달했는지 기록한다.",
    "rubric": {
     "required": [
      "친구가 용액인 부분을 알아볼 수 있게 고칠 내용을 제안하고, 받은 질문과 고친 내용을 기록하는 방법을 설명하면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b058",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E7",
    "type": "T13",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-03",
    "topic": "조사와 설명",
    "concept": "생활 쓰임 조사·자료 제작·실제 공유",
    "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
   },
   "prompt": "“용액이 우리 생활에 필요한 까닭”을 한 사례로 설명하는 자료의 초안을 그리세요. 조사한 사실과 내 제안을 구분하세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "확인한 생활 사례·필요한 까닭·용해/진하기의 관련 성질·출처를 넣고 새 제안은 예상으로 따로 표시한다.",
    "rubric": {
     "required": [
      "실제 조사 사례 1, 관련 성질 1, 출처와 예상 구분 1. 실제 전달 완료는 별도 확인."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   },
   "bookResponseForm": "draw",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-58",
    "no": 58
   },
   "explanation": "직접 조사한 생활 사례와 용액이 필요한 까닭을 그림과 글로 나타내요. 아직 해 보지 않은 새 제안은 알아낸 사실과 나누어 표시해요.",
   "misconception": "제품의 효과를 출처 없이 보장하는 문장을 쓰지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b058",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E7",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-03",
      "topic": "조사와 설명",
      "concept": "생활 쓰임 조사·자료 제작·실제 공유",
      "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
     },
     "prompt": "“용액이 우리 생활에 필요한 까닭”을 한 사례로 설명하는 자료의 초안을 그리세요. 조사한 사실과 내 제안을 구분하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "확인한 생활 사례·필요한 까닭·용해/진하기의 관련 성질·출처를 넣고 새 제안은 예상으로 따로 표시한다.",
      "rubric": {
       "required": [
        "실제 조사 사례 1, 관련 성질 1, 출처와 예상 구분 1. 실제 전달 완료는 별도 확인."
       ],
       "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
       "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
     },
     "bookResponseForm": "draw",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-58",
      "no": 58
     },
     "explanation": "소개 자료는 필요한 까닭과 과학적 연결을 근거로 전해야 한다. 아직 검증하지 않은 제안은 사실로 제시하지 않는다.",
     "misconception": "제품의 효과를 출처 없이 보장하는 문장을 쓰지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "확인한 생활 사례·필요한 까닭·용해/진하기의 관련 성질·출처를 넣고 새 제안은 예상으로 따로 표시한다.",
    "rubric": {
     "required": [
      "용액이 쓰이는 사례와 필요한 까닭을 관련 성질로 설명하고, 자료에서 확인한 내용과 새 제안을 구별해 나타내면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b065",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E1",
    "type": "T01",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-01",
    "topic": "용해 분류",
    "concept": "용해·용질·용매·용액의 구별",
    "inquirySkill": "용해·용질·용매·용액의 구별"
   },
   "prompt": "설탕이 물에 골고루 녹는 현상의 이름은?",
   "givens": null,
   "choices": [
    "용해",
    "증발",
    "응결",
    "녹기",
    "용질"
   ],
   "responseContract": "single-choice",
   "answerContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "bookResponseForm": "choice",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-65",
    "no": 65
   },
   "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
   "explanation": "설탕이 물에 녹아 골고루 섞이는 현상은 용해예요. 얼음 자체가 물로 바뀌는 녹기와는 구별해요.",
   "misconception": "물질 자체의 상태 변화와 물에 녹는 현상을 구별한다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b065",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해 분류",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
     },
     "prompt": "설탕이 물에 골고루 녹는 현상의 이름은?",
     "givens": null,
     "choices": [
      "용해",
      "증발",
      "응결",
      "융해",
      "용질"
     ],
     "responseContract": "single-choice",
     "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
       0
      ]
     },
     "bookResponseForm": "choice",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-65",
      "no": 65
     },
     "adaptationNote": "교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.",
     "explanation": "설탕이 물이라는 다른 물질에 녹아 고르게 섞이므로 용해이다. 설탕 자체를 가열해 액체로 만드는 융해와 다르다.",
     "misconception": "물질 자체의 상태 변화와 물에 녹는 현상을 구별한다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "explanation": "설탕이 물에 녹아 골고루 섞이는 현상은 용해예요. 증발·응결·끓음과는 다른 현상이에요.",
   "choices": [
    "용해",
    "증발",
    "응결",
    "끓음",
    "용질"
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b082",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E6",
    "type": "T12",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-02",
    "topic": "더 알아볼 방법",
    "concept": "진하기 비교 도구·조건·구별의 한계",
    "inquirySkill": "진하기 비교 도구·조건·구별의 한계"
   },
   "prompt": "같은 물체를 두 용액에 각각 넣었더니 모두 바닥에 닿았습니다. 진하기를 비교하려면 무엇을 더 알아보면 좋을지 한 가지 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "교사와 두 용액에서 자유롭게 뜨며 차이를 보일 수 있는 같은 물체로 다시 비교한다.",
    "rubric": {
     "required": [
      "문항의 조건을 충족하는 동등한 답을 인정한다."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   },
   "bookResponseForm": "short",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-82",
    "no": 82
   },
   "explanation": "두 용액에서 모두 바닥에 닿으면 자유롭게 뜨는 높이를 비교할 수 없어요. 선생님과 두 용액에서 차이를 살필 수 있는 같은 물체나 다른 방법을 찾아봐요.",
   "misconception": "두 번 가라앉음만으로 같은 진하기라고 확정하지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b082",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "관찰의 한계",
      "concept": "진하기 비교 도구·조건·구별의 한계",
      "inquirySkill": "진하기 비교 도구·조건·구별의 한계"
     },
     "prompt": "같은 물체가 두 용액에서 모두 바닥에 붙어 있습니다. 더 필요한 확인을 하나 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "교사와 두 용액에서 자유롭게 뜨며 차이를 보일 수 있는 같은 물체로 다시 비교한다.",
      "rubric": {
       "required": [
        "문항의 조건을 충족하는 동등한 답을 인정한다."
       ],
       "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
       "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
     },
     "bookResponseForm": "short",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-82",
      "no": 82
     },
     "explanation": "바닥이 물체를 받치면 자유롭게 뜨는 정도를 비교하지 못한다. 비교가 안 됐다는 결과를 남기고 방법을 개선한다.",
     "misconception": "두 번 가라앉음만으로 같은 진하기라고 확정하지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    },
    {
     "id": "c22-s51-u03-b082",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "더 알아볼 방법",
      "concept": "진하기 비교 도구·조건·구별의 한계",
      "inquirySkill": "진하기 비교 도구·조건·구별의 한계"
     },
     "prompt": "같은 물체를 두 용액에 각각 넣었더니 모두 바닥에 닿았습니다. 진하기를 비교하려면 무엇을 더 알아보면 좋을지 한 가지 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "교사와 두 용액에서 자유롭게 뜨며 차이를 보일 수 있는 같은 물체로 다시 비교한다.",
      "rubric": {
       "required": [
        "문항의 조건을 충족하는 동등한 답을 인정한다."
       ],
       "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
       "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
     },
     "bookResponseForm": "short",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-82",
      "no": 82
     },
     "explanation": "바닥이 물체를 받치면 자유롭게 뜨는 정도를 비교하지 못한다. 비교가 안 됐다는 결과를 남기고 방법을 개선한다.",
     "misconception": "두 번 가라앉음만으로 같은 진하기라고 확정하지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "contentVersion": "20261105-solution-student-language",
     "previousVersions": [
      {
       "id": "c22-s51-u03-b082",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 용해와 용액 창작 학습",
        "course": "초등 5-1"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 1,
        "unit": "u03",
        "area": "물질",
        "element": "E6",
        "type": "T12",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "6과03-02",
        "topic": "관찰의 한계",
        "concept": "진하기 비교 도구·조건·구별의 한계",
        "inquirySkill": "진하기 비교 도구·조건·구별의 한계"
       },
       "prompt": "같은 물체가 두 용액에서 모두 바닥에 붙어 있습니다. 더 필요한 확인을 하나 쓰세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "교사와 두 용액에서 자유롭게 뜨며 차이를 보일 수 있는 같은 물체로 다시 비교한다.",
        "rubric": {
         "required": [
          "문항의 조건을 충족하는 동등한 답을 인정한다."
         ],
         "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
         "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
        }
       },
       "bookResponseForm": "short",
       "workbookRef": {
        "unit": "c22-s51-u03",
        "id": "solution-book-82",
        "no": 82
       },
       "explanation": "바닥이 물체를 받치면 자유롭게 뜨는 정도를 비교하지 못한다. 비교가 안 됐다는 결과를 남기고 방법을 개선한다.",
       "misconception": "두 번 가라앉음만으로 같은 진하기라고 확정하지 않는다.",
       "evidence": {
        "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
        "date": "2026-10-18",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
        "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
       },
       "version": 1
      }
     ],
     "version": "20261105-solution-student-language"
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "교사와 두 용액에서 자유롭게 뜨며 차이를 보일 수 있는 같은 물체로 다시 비교한다.",
    "rubric": {
     "required": [
      "두 용액을 더 비교할 수 있는 타당한 방법 한 가지를 쓰면 인정해요. 예를 들어 두 용액에서 자유롭게 뜰 수 있는 다른 같은 물체로, 온도와 관찰 조건을 맞추어 다시 비교할 수 있어요."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b084",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E5",
    "type": "T10",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-02",
    "topic": "색의 한계",
    "concept": "색으로 비교하는 조건과 한계",
    "inquirySkill": "색으로 비교하는 조건과 한계"
   },
   "prompt": "같은 진하기의 갈색 설탕물을 깊이가 다른 컵에서 보니 색이 달라 보였습니다. 무엇을 알 수 있나요?",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "색은 관찰 깊이의 영향도 받으므로 깊이 등 관찰 조건을 맞추지 않은 색 차이만으로 진하기가 다르다고 할 수 없다.",
    "rubric": {
     "required": [
      "관찰 깊이 차이 1, 조건 맞추기 1."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-84",
    "no": 84
   },
   "explanation": "자료에서 두 설탕물의 진하기는 같다고 했어요. 액체를 들여다보는 깊이가 달라 색이 다르게 보일 수 있으므로 같은 깊이와 조명에서 다시 살펴봐요.",
   "misconception": "색과 진하기의 관계를 조건 없는 규칙으로 쓰지 않는다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b084",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E5",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "색의 한계",
      "concept": "색으로 비교하는 조건과 한계",
      "inquirySkill": "색으로 비교하는 조건과 한계"
     },
     "prompt": "같은 진하기의 갈색 설탕물을 깊이가 다른 컵에서 보니 색이 달라 보였습니다. 무엇을 알 수 있나요?",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "색은 관찰 깊이의 영향도 받으므로 깊이 등 관찰 조건을 맞추지 않은 색 차이만으로 진하기가 다르다고 할 수 없다.",
      "rubric": {
       "required": [
        "관찰 깊이 차이 1, 조건 맞추기 1."
       ],
       "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
       "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-84",
      "no": 84
     },
     "explanation": "주어진 두 용액은 같은 진하기다. 색 차이가 보였다면 용액 조건 외에 빛이 통과하는 깊이 등 관찰 조건을 검토해야 한다.",
     "misconception": "색과 진하기의 관계를 조건 없는 규칙으로 쓰지 않는다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "색은 관찰 깊이의 영향도 받으므로 깊이 등 관찰 조건을 맞추지 않은 색 차이만으로 진하기가 다르다고 할 수 없다.",
    "rubric": {
     "required": [
      "같은 진하기여도 관찰하는 깊이가 다르면 색이 다르게 보일 수 있어, 그 색 차이만으로 진하기가 다르다고 할 수 없음을 설명하면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
     "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u03-b089",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 용해와 용액 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E1",
    "type": "T01",
    "format": "단답형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-01",
    "topic": "용해와 융해",
    "concept": "용해·용질·용매·용액의 구별",
    "inquirySkill": "용해·용질·용매·용액의 구별"
   },
   "prompt": "친구가 “설탕이 물에 녹는 것은 얼음이 녹는 것과 같은 변화야”라고 했어요. 설탕이 물에 녹는 현상의 이름은 [ ]예요.",
   "givens": null,
   "choices": null,
   "responseContract": "short-text",
   "answerContract": {
    "type": "short-text",
    "answer": "용해",
    "accepted": [
     "용해"
    ]
   },
   "bookResponseForm": "blank",
   "workbookRef": {
    "unit": "c22-s51-u03",
    "id": "solution-book-89",
    "no": 89
   },
   "explanation": "설탕은 다른 물질인 물에 녹아 골고루 섞이므로 용해라고 해요. 얼음 자체가 물로 바뀌는 녹기와는 다른 현상이에요.",
   "misconception": "일상 낱말 “녹다”에 두 뜻이 있음을 확인한다.",
   "evidence": {
    "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
    "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
   },
   "contentVersion": "20261106-solution-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u03-b089",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해와 융해",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
     },
     "prompt": "“설탕이 물에 녹는 것은 융해다.”를 고치면, 이 현상은 [ ]이다.",
     "givens": null,
     "choices": null,
     "responseContract": "short-text",
     "answerContract": {
      "type": "short-text",
      "answer": "용해",
      "accepted": [
       "용해"
      ]
     },
     "bookResponseForm": "blank",
     "workbookRef": {
      "unit": "c22-s51-u03",
      "id": "solution-book-89",
      "no": 89
     },
     "explanation": "다른 물질인 물에 녹아 섞이는 것은 용해이며 설탕 자체가 열을 받아 액체로 변하는 융해와 구별한다.",
     "misconception": "일상 낱말 “녹다”에 두 뜻이 있음을 확인한다.",
     "evidence": {
      "checkedBy": "교재 연계 목표·독립 은행 응답 계약 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과03·자가교재 본문",
      "note": "열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u03",
    "area": "물질",
    "element": "E1",
    "type": "T01",
    "format": "단답형",
    "level": "기본",
    "track": "교과",
    "standard": "6과03-01",
    "topic": "물에 녹는 것과 상태 변화",
    "concept": "용해·용질·용매·용액의 구별",
    "inquirySkill": "용해·용질·용매·용액의 구별"
   }
  }
 }
];
const bankCache=new WeakMap();
export function solutionContextItems(rows,unit){
 if(unit!=='c22-s51-u03'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:SOLUTION_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withSolutionContextClassroom(unit,book){
 const rows=solutionContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
