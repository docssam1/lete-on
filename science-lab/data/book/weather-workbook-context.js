export const WEATHER_CONTEXT_VERSION='20261116-weather-workbook-context';
// Keep the observed absence of rain separate from a clear-sky claim.
const review={
 "patches": [
  {
   "previous": {
    "id": "c22-s52-u03-w045",
    "no": 45,
    "form": "multi",
    "topic": "모형과 실제 해륙풍",
    "prompt": "바닷가 바람을 설명하는 방법을 모두 고르세요.",
    "answer": "①, ②, ③",
    "explanation": "모래와 물의 온도, 지표 부근 기압과 공기 흐름을 함께 살펴요. 실제 바닷가의 바람은 주변의 큰 기압 분포나 지형에도 영향을 받으므로 매일 같은 시각에 바뀐다고 정하지 않아요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "criteria": "온도/기압/실제 바람·모형/현장·다른 조건을 나누어 설명하는 보기만 모두 고른다.",
    "choices": [
     "모래/물의 온도 변화와 관측 조건을 본다.",
     "지표 부근 기압과 흐름 자료를 연결한다.",
     "실제 바람에는 다른 기압 분포도 본다.",
     "모래가 따뜻하면 풍향 측정은 생략한다.",
     "매일 같은 시각에 반드시 바람이 바뀐다."
    ],
    "key": [
     0,
     1,
     2
    ],
    "previousCriteria": "조건과 단위를 지키고 같은 뜻의 표현을 인정해요.",
    "standard": "6과06-03",
    "origin": "previous112"
   },
   "fields": {
    "prompt": "바닷가 바람을 설명하는 알맞은 방법을 모두 고르세요."
   }
  },
  {
   "previous": {
    "id": "c22-s52-u03-w076",
    "no": 76,
    "form": "multi",
    "topic": "공정한 가열/냉각 비교",
    "prompt": "모래/물 비교의 조건으로 확인할 것을 모두 고르세요.",
    "answer": "①, ②, ③, ⑤",
    "explanation": "용기와 재료의 양, 감지 부분의 위치, 빛과 주위 조건, 처음 온도와 관찰 시각을 살펴요. 한쪽만 드라이기로 데우면 재료뿐 아니라 데우는 방법도 달라져 비교하기 어렵고 위험할 수 있어요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "criteria": "처음 값·같은 빛/시각·용기/양·감지 조건을 확인하는 보기만 모두 고른다.",
    "choices": [
     "용기 크기·재료 양과 두께",
     "온도 감지 부분의 깊이/위치",
     "빛·받침·주위와 같은 시점",
     "한쪽만 드라이기로 직접 가열",
     "처음 온도와 반복/미측정"
    ],
    "key": [
     0,
     1,
     2,
     4
    ],
    "previousCriteria": "조건과 단위를 지키고 같은 뜻의 표현을 인정해요.",
    "standard": "6과06-03",
    "origin": "previous112"
   },
   "fields": {
    "prompt": "모래와 물의 온도 변화를 비교하려고 해요. 알맞은 방법을 모두 고르세요.",
    "choices": [
     "같은 크기의 용기에 모래와 물의 양·두께를 맞춘다.",
     "온도 감지 부분의 깊이와 위치를 맞춘다.",
     "받는 빛·받침·주위 조건과 관찰 시점을 맞춘다.",
     "한쪽 재료만 드라이기로 직접 가열한다.",
     "처음 온도를 맞추고, 실제로 관찰한 값과 재지 못한 경우를 구별해 적는다."
    ]
   }
  },
  {
   "previous": {
    "id": "c22-s52-u03-w084",
    "no": 84,
    "form": "written",
    "topic": "같은 기온과 다른 생활 영향",
    "prompt": "기온이 같은 두 날에도 젖은 운동장이 마르는 빠르기가 달랐어요. 어떤 기상 요소와 주변 조건을 더 살펴보면 좋을까요?",
    "answer": "바람의 방향과 빠르기, 습도, 구름의 양과 햇빛, 그동안 내린 비를 살핀다. 운동장의 재료와 처음 젖은 정도도 비교하여 기온 이외의 영향이 있었는지 알아본다.",
    "explanation": "물의 증발과 운동장이 마르는 모습은 기온만 아니라 바람·습도·햇빛과 처음 조건에도 관련돼요.",
    "misconception": "기온이 같으면 생활에 주는 영향도 언제나 같다고 정하지 않아요.",
    "criteria": "바람·습도·구름/햇빛·강수 중 두 가지 이상의 기상 요소와 처음 젖은 정도 등 조건을 제시한다.",
    "lines": 8,
    "previousCriteria": "문항/실제 수행 구별·아직 필요한 근거·성적/효과 자동 확정 금지.",
    "standard": "6과06-01",
    "origin": "previous112"
   },
   "fields": {
    "criteria": "습도·바람·구름과 햇빛·강수 등 타당한 기상 요소와, 처음 젖은 정도나 운동장 재료 같은 주변 조건을 더 살펴보자고 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "c22-s52-u03-w102",
    "no": 102,
    "form": "match",
    "topic": "평가·낮 밤 모형",
    "prompt": "보기: ㄱ 바다→육지 / ㄴ 육지→바다. 다른 큰 바람은 단순화해요.",
    "answer": "(1) ㄱ (2) ㄴ",
    "explanation": "낮 모형에서는 육지 쪽 기압이 낮으므로 바다→육지예요(ㄱ). 밤 모형에서는 육지 쪽 기압이 높으므로 육지→바다예요(ㄴ). 실제 모든 날의 바람이 같은 시각에 바뀐다는 뜻은 아니에요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "criteria": "낮 육지 상대 저기압=바다→육지, 밤 육지 상대 고기압=육지→바다를 각 기호에 연결한다.",
    "parts": [
     "(1) 낮, 지표 부근 육지가 상대 저기압 [ ]",
     "(2) 밤, 지표 부근 육지가 상대 고기압 [ ]"
    ],
    "answerPerPart": true,
    "previousCriteria": "조건과 단위를 지키고 같은 뜻의 표현을 인정해요.",
    "standard": "6과06-03",
    "origin": "previous112"
   },
   "fields": {
    "prompt": "다른 곳에서 불어오는 바람의 영향은 제외한 해륙풍 모형이에요. 알맞게 연결하세요. 보기: ㄱ 바다→육지 / ㄴ 육지→바다"
   }
  },
  {
   "previous": {
    "id": "c22-s52-u03-w110",
    "no": 110,
    "form": "written",
    "topic": "보완·기압 절대화",
    "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 두 곳1004/1010hPa를 이용해 고쳐 설명하세요.",
    "answer": "두 값 중1010hPa가1004hPa보다 높다. 고/저는 주어진 주변과 비교하며1013hPa를 모든 상황의 고정 경계로 쓰지 않는다.",
    "explanation": "1010 hPa는 1004 hPa보다 높아요. 둘 다 1013 hPa보다 작아도 서로 높고 낮음을 비교할 수 있어요. 고기압과 저기압은 주변 기압과 비교해 정해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "criteria": "1010>1004hPa의 상대 비교를 쓰고1013hPa가 모든 경우의 고정 경계가 아님을 설명한다.",
    "lines": 8,
    "previousCriteria": "1010>1004·주변과 비교·고정 경계 오개념 수정.",
    "standard": "6과06-03",
    "origin": "previous112"
   },
   "fields": {
    "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 같은 높이에서 측정한 두 곳의 기압 1004hPa와 1010hPa를 이용해 고쳐 설명하세요."
   }
  }
 ],
 "directions": [
  {
   "previous": {
    "section": "날씨와 생활·소통 47~48",
    "title": "관측과 예보의 시각 구별하기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u03-w047",
       "c22-s52-u03-w048"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "오늘의 관측값과 내일의 예보값을 같은 사실로 읽지 않아요."
     },
     {
      "title": "더 알아보기",
      "text": "기상청은 가까운 시간부터 긴 기간까지 여러 종류의 예보를 제공해요. 예보가 다루는 시간 범위에 따라 자료의 상세함도 달라져요."
     },
     {
      "title": "내가 정리할 것",
      "text": "자료가 발표된 시각과 자료에서 알려 주려는 날씨의 시각을 따로 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "weather-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u03-w047",
     "no": 47,
     "form": "choice",
     "topic": "관측과 예보",
     "prompt": "오늘14시 관측과 내일14시 예보를 비교하는 방법은?",
     "answer": "④ 대상 시각과 자료 종류를 나눠 읽는다.",
     "explanation": "오늘 14시 관측은 그때 확인한 날씨이고, 내일 14시 예보는 앞으로의 날씨를 예상한 자료예요. 예보를 발표한 때와 예보가 가리키는 때, 지역을 나누어 확인해요.",
     "misconception": "미래 예보를 이미 관측한 사실로 바꾸지 않아요.",
     "criteria": "오늘 관측과 내일 예보의 대상 시각 및 자료 종류를 나누어 읽는 보기를 고른다.",
     "choices": [
      "두 값 모두 이미 관측한 결과로 읽는다.",
      "두 값 모두 실제 학생의 수행으로 읽는다.",
      "날짜를 빼고 높은 숫자만 골라 읽는다.",
      "대상 시각과 자료 종류를 나눠 읽는다.",
      "기온 값만 보고 다른 요소를 지워 읽는다."
     ],
     "key": 3,
     "previousCriteria": "조건과 단위를 지키고 같은 뜻의 표현을 인정해요.",
     "standard": "6과06-01",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u03-w048",
     "no": 48,
     "form": "blank",
     "topic": "자료의 시각",
     "prompt": "예보를 읽을 때는 발표한 시각과 예보가 가리키는 [ ] 시각을 구별해요.",
     "answer": "대상",
     "explanation": "자료를 발표한 때와 예보의 대상이 되는 때는 다를 수 있어요. 날짜와 지역도 함께 확인해요.",
     "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
     "criteria": "예보 발표 시각과 구별할 미래 날씨의 대상 시각이라는 문맥에 대상 을 넣는다.",
     "accepted": [
      "유효",
      "예보 대상"
     ],
     "previousCriteria": "조건과 단위를 지키고 같은 뜻의 표현을 인정해요.",
     "standard": "6과06-01",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "자료가 발표된 시각과 자료에서 알려 주려는 날씨의 시각을 따로 표시해요.",
     "value": "오늘 14시 관측과 내일 14시 예보가 각각 어느 날의 날씨를 가리키는지 나누어 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "탐구를 설계하고 실행하기 72~73",
    "title": "안개 시범의 관찰 방법",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u03-w072",
       "c22-s52-u03-w073"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "안개 모형은 선생님의 시범에서 표면과 공기 중 공간을 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "공기 중 응결에는 작은 입자가 물방울 형성의 중심이 될 수 있어요. 이러한 응결핵의 역할은 구름의 생성 과정을 더 배울 때 연결돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "시범에서 보인 위치와 잘 보이지 않은 위치를 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "weather-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u03-w072",
     "no": 72,
     "form": "written",
     "topic": "안개 시범 안전",
     "prompt": "안개 모형을 보기 위해 향을 피우거나 뜨거운 물을 학생이 직접 붓자는 제안 대신 어떻게 관찰을 준비할까요?",
     "answer": "향이나 불을 쓰거나 학생이 직접 가열하지 않는다. 선생님이 안전하게 준비한 시범이나 자료를 보고, 벽면 물방울과 공기 중 흐림을 나누어 살핀다. 분명히 보이지 않으면 그 사실을 적는다.",
     "explanation": "위험한 절차를 따라 결과를 만들 필요가 없어요. 교사 준비/시범이나 제공 자료 해석으로 바꾸고 참여 방법을 밝힐 수 있어요.",
     "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
     "criteria": "학생 향/불꽃/가열·뜨거운 물 붓기를 배제하고 교사 준비와 표면/공중 관찰 위치·불분명 보존을 제안한다.",
     "lines": 8,
     "previousCriteria": "향/가열 배제·교사 준비·관찰 위치와 불분명 보존.",
     "standard": "6과06-02",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u03-w073",
     "no": 73,
     "form": "order",
     "topic": "기상 관측 계획",
     "prompt": "같은 장소에서 기상 요소의 변화를 비교하는 순서를 배열하세요.",
     "answer": "ㄴ→ㄱ→ㄷ",
     "explanation": "장소와 도구, 관측 시각과 안전을 정해요(ㄴ). 정한 때마다 실제 값과 단위를 적은 뒤(ㄱ), 어떤 변화가 있었는지 설명해요(ㄷ). 못 잰 때는 직접 재지 못했다고 남겨요.",
     "misconception": "계획과 실제 관측·자료 해석의 순서를 구별해요.",
     "criteria": "위치/도구/간격/안전 정하기→값/단위/조건 기록→원자료 보존/변화 해석의ㄴ→ㄱ→ㄷ을 쓴다.",
     "given": [
      "ㄱ 정한 시각마다 값·단위·주변 조건을 남긴다.",
      "ㄴ 지역/위치·도구·시각 간격·안전을 정한다.",
      "ㄷ 처음 기록을 보존하고 변화/한계를 설명한다."
     ],
     "previousCriteria": "조건과 단위를 지키고 같은 뜻의 표현을 인정해요.",
     "standard": "6과06-01",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "시범에서 보인 위치와 잘 보이지 않은 위치를 적어요.",
     "value": "72번 시범을 안전하게 준비할 방법과, 73번 관측 전에 정할 조건을 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "탐구를 설계하고 실행하기 77~78",
    "title": "자료의 출처와 대상 시각 읽기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u03-w077",
       "c22-s52-u03-w078"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "기상 자료의 출처와 그 자료가 가리키는 지역·시각을 확인해요."
     },
     {
      "title": "더 알아보기",
      "text": "관측 자료와 예측 모형의 결과는 만드는 방법이 달라요. 같은 기관의 자료라도 관측인지 예보인지 확인하면 서로 다른 값의 뜻을 이해하기 쉬워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "관측한 날씨는 언제의 모습인가요? 예보에서 알려 주는 날씨는 언제의 모습인지도 따로 쓰세요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "weather-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u03-w077",
     "no": 77,
     "form": "written",
     "topic": "자료 조사 출처",
     "prompt": "날씨가 학교 활동에 주는 영향을 조사했어요. 자료의 제목뿐 아니라 어디를 읽었고 무엇을 알게 되었는지 친구가 다시 찾아볼 수 있도록 적으려면 어떤 내용이 필요할까요?",
     "answer": "자료의 제목과 만든 기관, 읽은 쪽이나 주소와 확인 날짜를 적는다. 자료가 가리키는 지역과 시각, 날씨가 활동에 준 영향도 쓴다. 자료에서 확인한 내용과 내 제안, 아직 모르는 점을 나누어 적는다.",
     "explanation": "자료의 제목과 만든 곳, 실제로 읽은 쪽이나 주소, 확인한 날짜를 적어요. 어느 지역과 시각의 날씨인지도 쓰고, 자료에서 알게 된 내용과 내 제안을 나누어요.",
     "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
     "criteria": "자료의 제목과 만든 곳, 쪽수나 주소 등 다시 찾을 정보와 실제 읽은 내용·알게 된 점을 연결한다. 자료에서 확인한 사실과 자신의 제안은 구별한다.",
     "lines": 8,
     "previousCriteria": "출처 식별·본문 확인 내용/조건·확인 범위·제안과 사실 구별.",
     "standard": "6과06-01",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u03-w078",
     "no": 78,
     "form": "written",
     "topic": "생활에 필요한 기상 요소",
     "prompt": "오전 09시 기온만 보고 오후 운동장 활동을 정하려고 해요. 어떤 날씨 자료를 더 확인하고 그 까닭을 설명해야 할까요?",
     "answer": "그 지역 오후 활동 시각의 기온·바람·강수 등 예보와 최신 관측을 확인한다. 날씨는 시간에 따라 변하며 기온뿐 아니라 바람과 비 등도 야외 활동에 영향을 주기 때문이다.",
     "explanation": "한 시각의 기온 하나로 다른 시각의 날씨와 활동 조건을 모두 알 수는 없어요.",
     "misconception": "오전의 한 관측값을 오후의 모든 기상 요소로 넓혀 설명하지 않아요.",
     "criteria": "활동할 지역과 오후 시각에 맞는 날씨 자료를 더 확인하고, 그 자료가 활동을 정하는 데 필요한 까닭을 설명하면 돼요.",
     "lines": 8,
     "previousCriteria": "제작 근거·미전달/미수신·다음 계획을 구별.",
     "standard": "6과06-01",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "관측한 날씨는 언제의 모습인가요? 예보에서 알려 주는 날씨는 언제의 모습인지도 따로 쓰세요.",
     "value": "조사한 자료를 다시 찾아볼 수 있게 남길 내용과, 오후 활동 전에 더 확인할 날씨 자료를 각각 정리해요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 확인 107~108",
    "title": "관측과 예보를 함께 설명하기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u03-w107",
       "c22-s52-u03-w108"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "같은 지역·같은 시각의 관측과 예보를 비교해 차이를 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "예보와 관측의 차이는 기온·바람·강수처럼 요소별로 살펴볼 수 있어요. 한 요소가 달랐다고 다른 요소까지 모두 같거나 다르다고 정하지 않아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "현재 맑음과 내일 비 예보는 서로 모순인가요?",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "weather-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u03-w107",
     "no": 107,
     "form": "written",
     "topic": "평가·관측과 예보 비교",
     "prompt": "가상 예보에는15시 비, 실제15시 관측에는 강수 없음이 기록됐어요. 두 자료를 어떻게 보존하고 설명하나요?",
     "answer": "예보와 실제 관측을 각각 날짜/지역/발표·대상/관측 시각과 함께 보존한다. 차이가 있음을 설명하고 예보를 실제값에 맞춰 몰래 고치거나 관측을 지우지 않는다.",
     "explanation": "예보와 관측은 각각 그대로 남겨요. 예보를 낸 때와 예보가 가리키는 때, 실제로 관측한 때와 지역이 맞는지 확인하고, 예상과 실제 결과가 달랐다고 설명해요.",
     "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
     "criteria": "예보와 실제15시 강수 관측을 각각 지역/날짜/발표·대상/관측 시각과 보존하고 차이를 설명하며 몰래 자료를 바꾸지 않는다.",
     "lines": 8,
     "previousCriteria": "두 자료 보존·시각/지역·예상/관측 차이·수정 이력/미확인.",
     "standard": "6과06-01",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u03-w108",
     "no": 108,
     "form": "written",
     "topic": "현재 관측과 이후 예보",
     "prompt": "지금 학교에서는 비가 오지 않는데 내일 비 예보가 있어요. 두 자료 중 하나가 틀렸다고 바로 말할 수 없는 까닭과 활동 안내에 쓸 자료를 설명하세요.",
     "answer": "지금의 실제 관측과 내일의 예보는 가리키는 시각과 자료의 종류가 다르다. 같은 지역의 활동 날짜·시각에 맞는 최신 예보와 관측을 확인하여 날씨에 따른 활동 제안을 쓴다.",
     "explanation": "현재 비가 없다는 사실과 내일 비가 올 것이라는 예상은 서로 다른 때의 날씨를 설명해요.",
     "misconception": "서로 다른 대상 시각의 관측과 예보를 같은 시각의 값처럼 비교하지 않아요.",
     "criteria": "현재 관측/내일 예보의 시간과 자료 종류 차이를 설명하고 활동할 시각의 지역 예보를 활용한다.",
     "lines": 8,
     "previousCriteria": "관측/예보·계획·실행 구별·필요한 실제 근거·효과 자동 확정 금지.",
     "standard": "6과06-01",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "같은 지역·같은 시각의 관측과 예보를 비교해 차이를 설명해요.",
     "value": "관측과 예보를 비교할 때는 가리키는 지역·시각과 자료의 종류를 먼저 확인해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "현재 맑음과 내일 비 예보는 서로 모순인가요?",
     "value": "지금 비가 오지 않는다는 관측과 내일 비 예보는 서로 모순인가요? 까닭을 써요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withWeatherContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s52-u03'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s52-u03-b045",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 날씨 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u03",
    "area": "지구와 우주",
    "element": "E4",
    "type": "T18",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과06-03",
    "topic": "모형과 실제 해륙풍",
    "concept": "해륙풍 모형과 실제 흐름",
    "inquirySkill": "주장과 근거 비교"
   },
   "prompt": "바닷가 바람을 설명하는 방법을 모두 고르세요.",
   "givens": null,
   "choices": [
    "모래/물의 온도 변화와 관측 조건을 본다.",
    "지표 부근 기압과 흐름 자료를 연결한다.",
    "실제 바람에는 다른 기압 분포도 본다.",
    "모래가 따뜻하면 풍향 측정은 생략한다.",
    "매일 같은 시각에 반드시 바람이 바뀐다."
   ],
   "responseContract": "multi-choice",
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     1,
     2
    ]
   },
   "bookResponseForm": "multi",
   "workbookRef": {
    "unit": "c22-s52-u03",
    "id": "c22-s52-u03-w045",
    "no": 45
   },
   "explanation": "모래와 물의 온도, 지표 부근 기압과 공기 흐름을 함께 살펴요. 실제 바닷가의 바람은 주변의 큰 기압 분포나 지형에도 영향을 받으므로 매일 같은 시각에 바뀐다고 정하지 않아요.",
   "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
   },
   "contentVersion": "20261106-weather-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s52-u03-b045",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "모형과 실제 해륙풍",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "주장과 근거 비교"
     },
     "prompt": "바닷가 바람을 설명하는 방법을 모두 고르세요.",
     "givens": null,
     "choices": [
      "모래/물의 온도 변화와 관측 조건을 본다.",
      "지표 부근 기압과 흐름 자료를 연결한다.",
      "실제 바람에는 다른 기압 분포도 본다.",
      "모래가 따뜻하면 풍향 측정은 생략한다.",
      "매일 같은 시각에 반드시 바람이 바뀐다."
     ],
     "responseContract": "multi-choice",
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       1,
       2
      ]
     },
     "bookResponseForm": "multi",
     "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w045",
      "no": 45
     },
     "explanation": "모형의 온도 차와 실제 기압/흐름을 연결해요. 실제 바람에는 큰 규모의 기압 분포·지형 등도 작용하므로 단정하지 않아요.",
     "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "바닷가 바람을 설명하는 알맞은 방법을 모두 고르세요."
  }
 },
 {
  "previous": {
   "id": "c22-s52-u03-b076",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 날씨 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u03",
    "area": "지구와 우주",
    "element": "E4",
    "type": "T18",
    "format": "선택형",
    "level": "심화",
    "track": "교과",
    "standard": "6과06-03",
    "topic": "공정한 가열/냉각 비교",
    "concept": "해륙풍 모형과 실제 흐름",
    "inquirySkill": "주장과 근거 비교"
   },
   "prompt": "모래/물 비교의 조건으로 확인할 것을 모두 고르세요.",
   "givens": null,
   "choices": [
    "용기 크기·재료 양과 두께",
    "온도 감지 부분의 깊이/위치",
    "빛·받침·주위와 같은 시점",
    "한쪽만 드라이기로 직접 가열",
    "처음 온도와 반복/미측정"
   ],
   "responseContract": "multi-choice",
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     1,
     2,
     4
    ]
   },
   "bookResponseForm": "multi",
   "workbookRef": {
    "unit": "c22-s52-u03",
    "id": "c22-s52-u03-w076",
    "no": 76
   },
   "explanation": "용기와 재료의 양, 감지 부분의 위치, 빛과 주위 조건, 처음 온도와 관찰 시각을 살펴요. 한쪽만 드라이기로 데우면 재료뿐 아니라 데우는 방법도 달라져 비교하기 어렵고 위험할 수 있어요.",
   "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
   },
   "contentVersion": "20261106-weather-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s52-u03-b076",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "공정한 가열/냉각 비교",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "주장과 근거 비교"
     },
     "prompt": "모래/물 비교의 조건으로 확인할 것을 모두 고르세요.",
     "givens": null,
     "choices": [
      "용기 크기·재료 양과 두께",
      "온도 감지 부분의 깊이/위치",
      "빛·받침·주위와 같은 시점",
      "한쪽만 드라이기로 직접 가열",
      "처음 온도와 반복/미측정"
     ],
     "responseContract": "multi-choice",
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       1,
       2,
       4
      ]
     },
     "bookResponseForm": "multi",
     "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w076",
      "no": 76
     },
     "explanation": "비교 조건을 정하고 실제 다른 조건은 함께 기록해요. 학생이 한쪽에만 드라이기를 쓰면 위험과 혼입 조건이 생겨요.",
     "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "모래와 물의 온도 변화를 비교하려고 해요. 알맞은 방법을 모두 고르세요.",
   "choices": [
    "같은 크기의 용기에 모래와 물의 양·두께를 맞춘다.",
    "온도 감지 부분의 깊이와 위치를 맞춘다.",
    "받는 빛·받침·주위 조건과 관찰 시점을 맞춘다.",
    "한쪽 재료만 드라이기로 직접 가열한다.",
    "처음 온도를 맞추고, 실제로 관찰한 값과 재지 못한 경우를 구별해 적는다."
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s52-u03-b084",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 날씨 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u03",
    "area": "지구와 우주",
    "element": "E5",
    "type": "T19",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과06-01",
    "topic": "같은 기온과 다른 생활 영향",
    "concept": "기상 자료 해석과 생활 적용",
    "inquirySkill": "기상 요소와 생활의 관계"
   },
   "prompt": "기온이 같은 두 날에도 젖은 운동장이 마르는 빠르기가 달랐어요. 어떤 기상 요소와 주변 조건을 더 살펴보면 좋을까요?",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "바람의 방향과 빠르기, 습도, 구름의 양과 햇빛, 그동안 내린 비를 살핀다. 운동장의 재료와 처음 젖은 정도도 비교하여 기온 이외의 영향이 있었는지 알아본다.",
    "rubric": {
     "required": [
      "바람·습도·구름/햇빛·강수 중 두 가지 이상의 기상 요소와 처음 젖은 정도 등 조건을 제시한다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    },
    "reviewRequired": true
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s52-u03",
    "id": "c22-s52-u03-w084",
    "no": 84
   },
   "explanation": "물의 증발과 운동장이 마르는 모습은 기온만 아니라 바람·습도·햇빛과 처음 조건에도 관련돼요.",
   "misconception": "기온이 같으면 생활에 주는 영향도 언제나 같다고 정하지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
   },
   "diagnosticOverride": {
    "version": "20261106-weather-readable-workbook",
    "typed": null
   },
   "contentVersion": "20261106-weather-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s52-u03-b084",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "자료와 실제 수행 정리",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "날씨 문제를 모두 맞혔지만 직접 관측/설명을 하지 않았어요. 무엇을 확인했고 무엇이 아직 필요한지 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "학습 문항의 개념/자료 해석을 확인했다. 실제 관측·기록·자료 제작/전달·받은 의견과 실제 활동 결과는 아직 확인하지 않았다.",
      "rubric": {
       "required": [
        "문항/실제 수행 구별·아직 필요한 근거·성적/효과 자동 확정 금지."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w084",
      "no": 84
     },
     "explanation": "문제 풀이와 실제 수행은 필요한 근거가 달라요. 정답 개수로 하지 않은 활동을 완료했다고 쓰지 않아요.",
     "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "바람의 방향과 빠르기, 습도, 구름의 양과 햇빛, 그동안 내린 비를 살핀다. 운동장의 재료와 처음 젖은 정도도 비교하여 기온 이외의 영향이 있었는지 알아본다.",
    "rubric": {
     "required": [
      "습도·바람·구름과 햇빛·강수 등 타당한 기상 요소와, 처음 젖은 정도나 운동장 재료 같은 주변 조건을 더 살펴보자고 설명하면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    },
    "reviewRequired": true
   },
   "diagnosticOverride": {
    "version": "20261116-weather-workbook-context",
    "typed": null
   }
  }
 },
 {
  "previous": {
   "id": "c22-s52-u03-b102",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 날씨 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u03",
    "area": "지구와 우주",
    "element": "E4",
    "type": "T18",
    "format": "단답형",
    "level": "기본",
    "track": "교과",
    "standard": "6과06-03",
    "topic": "평가·낮 밤 모형",
    "concept": "해륙풍 모형과 실제 흐름",
    "inquirySkill": "특성/관계 연결"
   },
   "prompt": "보기: ㄱ 바다→육지 / ㄴ 육지→바다. 다른 큰 바람은 단순화해요.",
   "givens": {
    "문항": [
     "(1) 낮, 지표 부근 육지가 상대 저기압 [ ]",
     "(2) 밤, 지표 부근 육지가 상대 고기압 [ ]"
    ]
   },
   "choices": null,
   "responseContract": "short-text",
   "answerContract": {
    "type": "short-text",
    "answer": "(1) ㄱ (2) ㄴ",
    "accepted": [
     "(1) ㄱ (2) ㄴ",
     "ㄱ ㄴ"
    ]
   },
   "bookResponseForm": "match",
   "workbookRef": {
    "unit": "c22-s52-u03",
    "id": "c22-s52-u03-w102",
    "no": 102
   },
   "explanation": "낮 모형에서는 육지 쪽 기압이 낮으므로 바다→육지예요(ㄱ). 밤 모형에서는 육지 쪽 기압이 높으므로 육지→바다예요(ㄴ). 실제 모든 날의 바람이 같은 시각에 바뀐다는 뜻은 아니에요.",
   "misconception": "각 설명의 순서와 기호를 함께 적어요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
   },
   "contentVersion": "20261106-weather-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s52-u03-b102",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·낮 밤 모형",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "특성/관계 연결"
     },
     "prompt": "보기: ㄱ 바다→육지 / ㄴ 육지→바다. 다른 큰 바람은 단순화해요.",
     "givens": {
      "문항": [
       "(1) 낮, 지표 부근 육지가 상대 저기압 [ ]",
       "(2) 밤, 지표 부근 육지가 상대 고기압 [ ]"
      ]
     },
     "choices": null,
     "responseContract": "short-text",
     "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ",
      "accepted": [
       "(1) ㄱ (2) ㄴ",
       "ㄱ ㄴ"
      ]
     },
     "bookResponseForm": "match",
     "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w102",
      "no": 102
     },
     "explanation": "지표 부근 높은 쪽에서 낮은 쪽으로의 방향을 적용해요. 실제 모든 날의 풍향 전환 시간표는 아니에요.",
     "misconception": "각 설명의 순서와 기호를 함께 적어요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "다른 곳에서 불어오는 바람의 영향은 제외한 해륙풍 모형이에요. 알맞게 연결하세요. 보기: ㄱ 바다→육지 / ㄴ 육지→바다"
  }
 },
 {
  "previous": {
   "id": "c22-s52-u03-b110",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 날씨 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u03",
    "area": "지구와 우주",
    "element": "E4",
    "type": "T17",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과06-03",
    "topic": "보완·기압 절대화",
    "concept": "상대 기압 분포와 날씨",
    "inquirySkill": "근거·한계 설명/실제 소통"
   },
   "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 두 곳1004/1010hPa를 이용해 고쳐 설명하세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "두 값 중1010hPa가1004hPa보다 높다. 고/저는 주어진 주변과 비교하며1013hPa를 모든 상황의 고정 경계로 쓰지 않는다.",
    "rubric": {
     "required": [
      "1010>1004hPa의 상대 비교를 쓰고1013hPa가 모든 경우의 고정 경계가 아님을 설명한다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s52-u03",
    "id": "c22-s52-u03-w110",
    "no": 110
   },
   "explanation": "1010 hPa는 1004 hPa보다 높아요. 둘 다 1013 hPa보다 작아도 서로 높고 낮음을 비교할 수 있어요. 고기압과 저기압은 주변 기압과 비교해 정해요.",
   "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
   },
   "contentVersion": "20261115-reviewed-answer-criteria",
   "previousVersions": [
    {
     "id": "c22-s52-u03-b110",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "보완·기압 절대화",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 두 곳1004/1010hPa를 이용해 고쳐 설명하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "두 값 중1010hPa가1004hPa보다 높다. 고/저는 주어진 주변과 비교하며1013hPa를 모든 상황의 고정 경계로 쓰지 않는다.",
      "rubric": {
       "required": [
        "1010>1004·주변과 비교·고정 경계 오개념 수정."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w110",
      "no": 110
     },
     "explanation": "기준 숫자를 외워 분포를 지우지 않고 실제 주변 값과 비교해요.",
     "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
     },
     "version": 1
    },
    {
     "id": "c22-s52-u03-b110",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "보완·기압 절대화",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 두 곳1004/1010hPa를 이용해 고쳐 설명하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "두 값 중1010hPa가1004hPa보다 높다. 고/저는 주어진 주변과 비교하며1013hPa를 모든 상황의 고정 경계로 쓰지 않는다.",
      "rubric": {
       "required": [
        "1010>1004·주변과 비교·고정 경계 오개념 수정."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w110",
      "no": 110
     },
     "explanation": "1010 hPa는 1004 hPa보다 높아요. 둘 다 1013 hPa보다 작아도 서로 높고 낮음을 비교할 수 있어요. 고기압과 저기압은 주변 기압과 비교해 정해요.",
     "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
     },
     "contentVersion": "20261106-weather-readable-workbook",
     "previousVersions": [
      {
       "id": "c22-s52-u03-b110",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 날씨 독립 창작 교재",
        "course": "초등5-2"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 2,
        "unit": "u03",
        "area": "지구와 우주",
        "element": "E4",
        "type": "T17",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "6과06-03",
        "topic": "보완·기압 절대화",
        "concept": "상대 기압 분포와 날씨",
        "inquirySkill": "근거·한계 설명/실제 소통"
       },
       "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 두 곳1004/1010hPa를 이용해 고쳐 설명하세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "두 값 중1010hPa가1004hPa보다 높다. 고/저는 주어진 주변과 비교하며1013hPa를 모든 상황의 고정 경계로 쓰지 않는다.",
        "rubric": {
         "required": [
          "1010>1004·주변과 비교·고정 경계 오개념 수정."
         ],
         "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
         "note": "실제 수행/공식 성적은 별도 확인"
        }
       },
       "bookResponseForm": "written",
       "workbookRef": {
        "unit": "c22-s52-u03",
        "id": "c22-s52-u03-w110",
        "no": 110
       },
       "explanation": "기준 숫자를 외워 분포를 지우지 않고 실제 주변 값과 비교해요.",
       "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
       "evidence": {
        "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
        "date": "2026-10-18",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
        "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
       },
       "version": 1
      }
     ],
     "version": "20261106-weather-readable-workbook",
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 같은 높이에서 측정한 두 곳의 기압 1004hPa와 1010hPa를 이용해 고쳐 설명하세요."
  }
 }
];
const bankCache=new WeakMap();
export function weatherContextItems(rows,unit){
 if(unit!=='c22-s52-u03'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:WEATHER_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withWeatherContextClassroom(unit,book){
 const rows=weatherContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
