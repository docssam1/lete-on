export const ENERGY_CONTEXT_VERSION='20261116-energy-workbook-context';
// Match elementary questions, planning criteria and page summaries to the supplied material.
const review={
 "patches": [
  {
   "previous": {
    "id": "c22-s52-u04-w009",
    "no": 9,
    "form": "short",
    "topic": "표본의 한계",
    "prompt": "암석의 겉모습만 보고 그 안에 들어 있는 금속의 양을 정확히 알 수 있을까요? 알 수 있는지 없는지 쓰세요.",
    "answer": "알 수 없다",
    "explanation": "암석의 겉모습만으로 안에 들어 있는 금속의 양을 정확히 알 수는 없어요. 실제 암석을 검사한 자료가 더 필요해요.",
    "misconception": "겉모양만으로 광물 종류와 함량을 확정하지 않아요.",
    "criteria": "사진만으로 정확한 금속 함량을 알 수 없다고 쓴다. 겉모습과 성분 분석을 구별한다.",
    "accepted": [
     "알 수 없어요",
     "알 수 없음"
    ],
    "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
    "standard": "6과08-01",
    "origin": "previous112"
   },
   "fields": {
    "topic": "겉모습과 금속의 양",
    "criteria": "암석의 겉모습만으로 그 안에 들어 있는 금속의 양을 정확히 알 수 없다는 뜻으로 쓴다."
   }
  },
  {
   "previous": {
    "id": "c22-s52-u04-w010",
    "no": 10,
    "form": "written",
    "topic": "생활 물건 조사",
    "prompt": "공책 한 권에 어떤 자원이 쓰이는지 조사할 계획을 쓰세요.",
    "answer": "종이의 원료와 표지/철심 재료를 구별하고 제조사/공식 자료에서 출처를 확인해요.",
    "explanation": "종이와 표지, 철심처럼 공책의 부분마다 어떤 재료가 쓰이는지 살펴요. 만드는 데에는 물과 에너지도 필요할 수 있어요. 자료에서 확인한 내용과 아직 조사하지 않은 점을 나누어 적어요.",
    "misconception": "추정한 재료와 본문에서 확인한 재료를 나눠요.",
    "criteria": "공책의 종이/표지/철심 등 부분별 재료와 조사할 본문 출처를 정하고 확인한 내용/미확인을 나눈 계획을 쓴다.",
    "lines": 8,
    "previousCriteria": "물건/재료·조사할 본문 출처·확인/미확인 구별 포함. 타당한 다른 생활 물건 인정.",
    "standard": "6과08-01",
    "origin": "previous112"
   },
   "fields": {
    "criteria": "공책의 종이·표지·철심 등 부분별 재료와 관련 자원을 알아볼 내용, 찾아볼 자료나 조사 방법을 담은 계획을 쓴다."
   }
  },
  {
   "previous": {
    "id": "c22-s52-u04-w020",
    "no": 20,
    "form": "multi",
    "topic": "재활용의 조건",
    "prompt": "분리배출을 결정할 때 확인할 것을 모두 고르세요.",
    "answer": "①, ②, ④",
    "explanation": "같은 재질도 지역/시설의 수거 조건과 오염 상태에 따라 처리 방법이 다를 수 있어요. 위험한 물건은 교사/보호자에게 알리고 직접 다루지 않아요.",
    "misconception": "같은 표시가 모든 지역의 수거를 보장하지 않아요.",
    "criteria": "현재 수거 안내·재질/오염·안전하게 비우고 분리할 수 있는지의 세 보기를 모두 고른다.",
    "choices": [
     "지역/학교의 수거 안내",
     "물건의 재질과 오염 상태",
     "재활용 표시가 있으면 모든 곳에서 수거된다고 믿기",
     "안전하게 비우고 분리할 수 있는지",
     "깨진 날카로운 금속을 맨손으로 집기"
    ],
    "key": [
     0,
     1,
     3
    ],
    "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
    "standard": "6과08-01",
    "origin": "previous112"
   },
   "fields": {
    "prompt": "분리배출을 준비하는 알맞은 방법을 모두 고르세요.",
    "choices": [
     "학교나 지역의 수거 안내를 확인한다.",
     "물건의 재질과 오염 상태를 살핀다.",
     "재활용 표시가 있으면 어느 곳에서나 같은 통에 넣는다.",
     "안전하게 비우고 분리할 수 있는지 확인한다.",
     "깨진 날카로운 금속을 맨손으로 집는다."
    ]
   }
  },
  {
   "previous": {
    "id": "c22-s52-u04-w032",
    "no": 32,
    "form": "multi",
    "topic": "입지와 영향",
    "prompt": "재생에너지 이용 방법을 조사할 때 확인할 것을 모두 고르세요.",
    "answer": "①, ②, ③, ⑤",
    "explanation": "이용 가능성과 설비·주변 영향·출처의 지역/시점을 함께 봐요. 재생 가능은 모든 영향이0이라는 뜻이 아니에요.",
    "misconception": "자연 조건만 보고 설비와 주변 영향을 생략하지 않아요.",
    "criteria": "장소의 자연 조건·설비/재료·주변 생물/사람 영향·출처 시점/지역의 네 보기를 모두 고른다.",
    "choices": [
     "장소에서 이용할 수 있는 자연 조건",
     "필요한 설비와 재료",
     "주변 생물과 사람에게 미치는 영향",
     "재생이라는 말만 있으면 무조건 영향0으로 결론",
     "자료의 작성 시점과 지역"
    ],
    "key": [
     0,
     1,
     2,
     4
    ],
    "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
    "standard": "6과08-02",
    "origin": "previous112"
   },
   "fields": {
    "topic": "이용할 장소와 주변 영향",
    "prompt": "재생에너지 이용 방법을 조사하는 알맞은 방법을 모두 고르세요.",
    "choices": [
     "그 장소에서 이용할 수 있는 자연 조건을 알아본다.",
     "필요한 설비와 재료를 조사한다.",
     "주변 생물과 사람에게 미치는 영향을 살핀다.",
     "재생에너지라는 이름만 보고 환경 영향이 없다고 정한다.",
     "자료가 작성된 시점과 지역을 확인한다."
    ]
   }
  },
  {
   "previous": {
    "id": "c22-s52-u04-w067",
    "no": 67,
    "form": "multi",
    "topic": "실천 자료 비교",
    "prompt": "두 반의 종이 사용량을 비교하기 위해 확인할 것을 모두 고르세요.",
    "answer": "①, ②, ③, ⑤",
    "explanation": "두 반의 사람 수와 활동의 양, 종이 크기와 기록 기간을 맞춰요. 서로 다른 조건에서 쓴 장수만으로 방법의 효과를 정하지 않아요. 기록하지 못한 양을 0으로 채우지도 않아요.",
    "misconception": "인원/활동·기간/종이 크기가 다르면 양만 비교하지 않아요.",
    "criteria": "인원/활동량·종이 크기/세는 방법·날짜/기간·실제 사용/미기록 구별의 네 보기를 모두 고른다.",
    "choices": [
     "인원과 활동의 양",
     "종이의 크기와 세는 방법",
     "기록한 날짜/기간",
     "활동과 사람 수가 달라도 사용량만으로 방법의 효과를 정함",
     "실제 사용량과 미기록의 구별"
    ],
    "key": [
     0,
     1,
     2,
     4
    ],
    "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
    "standard": "6과08-01",
    "origin": "previous112"
   },
   "fields": {
    "prompt": "두 반의 종이 사용량을 비교하려고 해요. 알맞은 방법을 모두 고르세요.",
    "choices": [
     "인원과 활동의 양을 확인한다.",
     "종이의 크기와 장수를 세는 방법을 확인한다.",
     "기록한 날짜와 기간을 확인한다.",
     "활동과 인원이 달라도 사용량만으로 절약 방법의 효과를 정한다.",
     "실제로 쓴 양과 기록하지 못한 양을 구별한다."
    ]
   }
  },
  {
   "previous": {
    "id": "c22-s52-u04-w069",
    "no": 69,
    "form": "written",
    "topic": "자원 조사 계획",
    "prompt": "생활 물건 하나를 정해 자원의 출처와 사용 후 처리 방법을 조사할 계획을 쓰세요.",
    "answer": "물건의 각 부분이 어떤 재료인지 알아보고, 실제로 읽은 자료의 제목과 만든 곳, 날짜와 지역을 적는다. 재사용 방법과 수거 안내를 확인하고 아직 모르는 점을 나누어 쓴다.",
    "explanation": "물건의 각 부분이 어떤 재료인지 알아보아요. 실제로 읽은 자료의 제목과 만든 곳, 날짜와 지역을 적고 그곳의 수거 안내를 살펴요. 아직 모르는 점은 조사할 내용으로 남겨요.",
    "misconception": "본문 조사와 검색 목록만 본 상태를 나눠요.",
    "criteria": "물건/재료·출처/작성 시점·지역 처리 안내를 조사할 질문과 연결하고 재사용/수거의 확인/미확인을 나눈 계획을 쓴다.",
    "lines": 8,
    "previousCriteria": "대상/질문·본문 출처·재료/처리 기준·확인/미확인 포함.",
    "standard": "6과08-01",
    "origin": "previous112"
   },
   "fields": {
    "criteria": "물건 하나를 정하고 부분별 재료와 자원의 출처, 사용 후 처리 방법을 어떤 자료나 방법으로 조사할지 계획한다. 재사용이나 분리배출에 관한 타당한 조사 질문도 인정한다."
   }
  },
  {
   "previous": {
    "id": "c22-s52-u04-w078",
    "no": 78,
    "form": "draw",
    "topic": "실천 안내 카드",
    "prompt": "실천 행동·이유·확인 방법을 담은 안내 카드 초안을 그리세요. 미측정 값은 넣지 마세요.",
    "answer": "필요한 만큼 종이 쓰기/물건 다시 쓰기 등 구체 행동, 자원 이용의 한계, 날짜/기록 항목과 필요한 안전/지역 조건 표시.",
    "explanation": "안내 자료의 설계와 실제 전달은 달라요. 근거 없는 절감률이나 아직 받지 않은 의견을 넣지 않아요.",
    "misconception": "초안/제작과 실제 전달은 달라요.",
    "criteria": "구체적인 실천 행동과 타당한 이유·확인 방법이 카드에 드러나게 그린다. 초안임을 표시하고 직접 재지 않은 수치를 관찰값으로 넣지 않는다.",
    "drawing": "large",
    "previousCriteria": "구체 행동·과학적 이유·확인/미확인·읽을 사람 고려. 초안/실제 제작 구별.",
    "standard": "6과08-03",
    "origin": "previous112"
   },
   "fields": {
    "criteria": "구체적인 실천 행동과 타당한 이유·확인 방법이 카드에 드러나게 그린다. 직접 재지 않은 수치를 관찰값으로 넣지 않는다."
   }
  },
  {
   "previous": {
    "id": "c22-s52-u04-w079",
    "no": 79,
    "form": "written",
    "topic": "실제 실천 기록",
    "prompt": "실제로 한 실천 한 가지의 날짜·행동·자료와 아직 못 한 점을 쓰세요. 아직 전이면 계획으로 쓰세요.",
    "answer": "실행했다면 날짜와 행동/실제 확인 자료를 적고 효과 미측정은 미측정으로 남겨요. 아직 전이면 계획과 확인 방법을 적어요.",
    "explanation": "계획한 일과 실제로 한 일, 효과를 직접 잰 것은 서로 달라요. 제공된 사진이나 연습용 숫자를 내 실천 결과로 적지 않아요.",
    "misconception": "실제 행동을 했다고 효과까지 측정한 것은 아니에요.",
    "criteria": "실행했다면 실제 날짜/행동/자료·효과 미측정과 다음 점검을 쓰고 미실행이면 계획/확인 방법으로 남긴다.",
    "lines": 8,
    "previousCriteria": "실제/계획 구별·날짜/행동·근거/미측정·다음 점검.",
    "standard": "6과08-03",
    "origin": "previous112"
   },
   "fields": {
    "criteria": "실천했다면 날짜·행동·실제로 확인한 자료와 아직 못 한 점을 쓰고, 실천 전이면 계획으로 쓴다. 효과를 재지 못했다면 실제 값으로 꾸며 넣지 않는다."
   }
  }
 ],
 "directions": [
  {
   "previous": {
    "section": "줄이기·재사용·재활용 21~22",
    "title": "회수량과 재활용 과정 살펴보기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w021",
       "c22-s52-u04-w022"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "회수한 수와 새 제품으로 만들어진 수는 같은 자료가 아니에요."
     },
     {
      "title": "더 알아보기",
      "text": "재활용 과정에서는 재질을 나누고 오염 물질을 제거해요. 회수한 재료가 모두 같은 품질의 새 제품이 되는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "물건을 모은 것과 실제로 재활용한 것은 어떻게 다른가요? 자료에서 각각 무엇을 확인했는지 쓰세요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w021",
     "no": 21,
     "form": "short",
     "topic": "회수의 한계",
     "prompt": "가상 자료: 용기50개 중42개를 회수했어요. 회수하지 못한 것은 몇 개인가요?",
     "answer": "8개",
     "explanation": "전체 50개에서 모은 42개를 빼면 50−42=8(개)이에요. 모은 용기를 모두 같은 품질의 새 용기로 만들었다는 결과까지 알 수는 없어요.",
     "misconception": "회수42개가 새 제품42개라는 뜻은 아니에요.",
     "criteria": "전체50−회수42=8개를 단위와 함께 쓴다. 회수를 실제 새 제품 생산과 같게 보지 않는다.",
     "given": [
      "학습용 가상 수거 기록. 전체50개 / 회수42개."
     ],
     "accepted": [
      "8 개"
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-01",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w022",
     "no": 22,
     "form": "written",
     "topic": "순환의 조건",
     "prompt": "재활용 표시만 있으면 모든 물건을 같은 통에 넣어도 될까요? 근거와 확인할 것을 쓰세요.",
     "answer": "아니요. 재질·오염·지역 수거 기준을 확인하고 안내에 맞게 분리해야 해요.",
     "explanation": "분리 수거와 실제 재활용은 같지 않아요. 수거/분류·처리 조건이 맞아야 자원으로 다시 이용할 수 있어요.",
     "misconception": "재활용 표시와 실제 수거/처리 가능은 구별해요.",
     "criteria": "재활용 표시만으로 같은 통에 넣지 않고 재질/오염·현재 지역 수거 기준을 확인하며 회수와 처리 결과를 구별한다.",
     "lines": 8,
     "previousCriteria": "재질/오염·지역 기준 확인, 수거와 실제 처리 구별 포함.",
     "standard": "6과08-01",
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
     "previous": "물건을 모은 것과 실제로 재활용한 것은 어떻게 다른가요? 자료에서 각각 무엇을 확인했는지 쓰세요.",
     "value": "회수한 용기 42개가 모두 재활용되었다고 할 수 없는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "다양한 재생에너지 33~34",
    "title": "해양 에너지의 이용 조건",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w033",
       "c22-s52-u04-w034"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "해양 에너지는 파도나 밀물·썰물 등 여러 방식을 이용해요."
     },
     {
      "title": "더 알아보기",
      "text": "바다에는 파도뿐 아니라 조류와 수온 차 등 이용할 수 있는 차이가 있어요. 방식마다 필요한 설비와 해안 조건, 생물에 미치는 영향이 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "바다 풍경과 발전 설비가 알려 주는 정보의 차이를 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w033",
     "no": 33,
     "form": "short",
     "topic": "해양 에너지",
     "prompt": "바다에서 이용할 수 있는 에너지의 예를 한 가지 쓰세요.",
     "answer": "파도의 에너지",
     "explanation": "파도의 움직임이나 밀물·썰물 등을 이용할 수 있어요. 바다의 모든 장면이 같은 방식의 발전소를 뜻하는 것은 아니에요.",
     "misconception": "바다 장면이 모두 같은 방식의 발전소는 아니에요.",
     "criteria": "파도의 에너지 또는 밀물/썰물 등 타당한 해양 에너지의 예 한 가지를 쓴다.",
     "accepted": [
      "파도",
      "밀물과 썰물",
      "조수의 에너지",
      "조력",
      "파력"
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-02",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w034",
     "no": 34,
     "form": "written",
     "topic": "한 가지가 만능일까",
     "prompt": "모든 지역에서 한 가지 재생에너지만 쓰면 된다는 제안의 확인할 점을 쓰세요.",
     "answer": "지역의 햇빛·바람·물/바다·지열 등의 조건과 설비/환경 영향을 비교해야 해요.",
     "explanation": "장소와 시간에 따라 이용 가능한 자연 조건과 설비가 달라요. 한 곳의 사례를 모든 곳의 같은 결과로 확대하지 않아요.",
     "misconception": "한 지역의 사례를 모든 장소의 같은 결과로 확대하지 않아요.",
     "criteria": "지역/시간에 따른 자연 조건 차이와 설비·환경 또는 목적을 비교해 한 종류를 모든 곳에 쓰는 제안의 한계를 설명한다.",
     "lines": 8,
     "previousCriteria": "지역/시간의 조건 차이·설비/환경 또는 이용 목적 포함.",
     "standard": "6과08-02",
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
     "previous": "바다 풍경과 발전 설비가 알려 주는 정보의 차이를 써요.",
     "value": "파도와 밀물·썰물 중 하나를 골라, 그 에너지를 이용할 때 확인할 자연 조건을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "생활 실천과 소통 47~48",
    "title": "자원 절약의 방법 연결하기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w047",
       "c22-s52-u04-w048"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "줄이기·재사용·재활용을 생활 장면으로 구별해요."
     },
     {
      "title": "더 알아보기",
      "text": "제품의 수명을 늘리면 교체를 위해 새 제품을 생산하는 횟수를 줄일 수 있어요. 오래 쓸 수 있는 재료와 수리 가능한 구조도 자원 이용에 관련돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "세 절약 방법에 알맞은 장면을 하나씩 찾아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w047",
     "no": 47,
     "form": "choice",
     "topic": "실천할 방법",
     "prompt": "수업에 필요한 밝기를 유지하면서 조명 낭비를 줄일 방법은?",
     "answer": "④ 빈 구역은 끄고 사용 구역만 필요한 밝기로 켠다.",
     "explanation": "필요한 기능을 유지하면서 불필요한 사용을 줄여요. 실제 설비 공사는 학생 실천과 구별하고 교사 안내를 따라요.",
     "misconception": "필요한 밝기를 없애는 것을 낭비 줄이기와 같게 보지 않아요.",
     "criteria": "빈 구역의 불필요한 조명은 끄고 사용 구역의 필요한 밝기를 유지하는 방법을 고른다.",
     "choices": [
      "빈 구역까지 모든 조명을 수업 내내 함께 켠다.",
      "글을 읽기 어려워도 사용 구역의 불을 모두 끈다.",
      "스위치를 바꾸려고 학생이 전선 배선을 고친다.",
      "빈 구역은 끄고 사용 구역만 필요한 밝기로 켠다.",
      "조명 종류만 바꾸고 필요 없는 불은 계속 켠다."
     ],
     "key": 3,
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w048",
     "no": 48,
     "form": "blank",
     "topic": "실제 실천 기록",
     "prompt": "자원을 절약할 방법과 효과를 확인할 방법을 미리 정하여 실천 [ ]을 세워요.",
     "answer": "계획",
     "explanation": "무엇을 줄이거나 다시 쓸지, 언제 어떤 자료로 효과를 확인할지 미리 정해요.",
     "misconception": "계획을 실행으로 쓰거나 AI 사진을 실천 근거로 쓰지 않아요.",
     "criteria": "실천할 방법과 확인할 방법을 미리 정하는 계획을 쓴다.",
     "accepted": [
      "아직 계획",
      "실천 계획"
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "자원 절약의 방법 연결하기",
     "value": "조명 절약과 실천 계획"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "줄이기·재사용·재활용을 생활 장면으로 구별해요.",
     "value": "필요한 밝기를 유지하며 조명 낭비를 줄이고 실천할 계획을 세워요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "세 절약 방법에 알맞은 장면을 하나씩 찾아요.",
     "value": "47번에서 고른 조명 사용 방법과 48번의 계획에 넣을 내용을 정리해요."
    }
   ]
  },
  {
   "previous": {
    "section": "자료 깊이 읽기 57~58",
    "title": "태양광 발전량과 사용량 비교",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w057",
       "c22-s52-u04-w058"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "태양 전지판은 태양에서 오는 빛을 이용해요."
     },
     {
      "title": "더 알아보기",
      "text": "전기는 필요할 때와 생산할 수 있는 때가 다를 수 있어요. 더 깊이 공부하면 축전지 등 저장 장치와 다른 공급 방법을 함께 알아보아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "밤낮의 차이가 태양광 이용에 어떤 영향을 주는지 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w057",
     "no": 57,
     "form": "choice",
     "topic": "태양광 시간 자료",
     "prompt": "가상 기록: 같은 설비의 A날 발전량12kWh, B날8kWh. 이 자료에서 알 수 있는 것은?",
     "answer": "⑤ 제시한 두 날의 양은 A가4kWh 더 많다.",
     "explanation": "12−8=4kWh예요. 날짜별 양의 차이는 있지만 빛/가려짐·사용 조건 등 원인 자료가 없어 특정 원인을 증명하지 않아요.",
     "misconception": "두 날의 양 차이만으로 특정 원인을 증명하지 않아요.",
     "criteria": "제시된 두 날12−8=4kWh만 비교한 보기를 고르고 기상/고장 원인을 확정하지 않는다.",
     "given": [
      "학습용 가상 값. 같은 설비 A날12kWh / B날8kWh. 기상/가려짐·운전 상태의 자세한 기록 없음."
     ],
     "choices": [
      "B가8kWh이므로 모든 날의 양이 똑같다.",
      "사진만 보아도 모든 날 발전량을 알 수 있다.",
      "A가 더 많으므로 환경 영향은 완전히0이다.",
      "두 값만으로 차이의 원인이 바람임을 증명한다.",
      "제시한 두 날의 양은 A가4kWh 더 많다."
     ],
     "key": 4,
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-02",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w058",
     "no": 58,
     "form": "short",
     "topic": "전기 사용 차이",
     "prompt": "가상 비교: 같은 기능/시간에 기존 기구45Wh, 새 기구29Wh. 줄어든 양은?",
     "answer": "16Wh",
     "explanation": "45−29=16Wh예요. 같은 기능·시간을 유지한 조건의 전기 에너지 차이예요.16W나16원과 구별해요.",
     "misconception": "16Wh를16W/16원으로 바꾸지 않아요.",
     "criteria": "같은 기능/시간45−29=16Wh를 단위와 함께 쓴다.",
     "accepted": [
      "16 Wh"
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
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
     "previous": "태양 전지판은 태양에서 오는 빛을 이용해요.",
     "value": "발전량은 생산한 전기의 양이고, 사용량은 기구에 쓴 전기의 양이에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "밤낮의 차이가 태양광 이용에 어떤 영향을 주는지 써요.",
     "value": "57번의 두 날 발전량 차이와 58번의 전기 사용량 차이를 각각 단위와 함께 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "탐구 설계와 실행 79~80",
    "title": "실천 사례와 태양광의 조건",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w079",
       "c22-s52-u04-w080"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "실천한 행동과 같은 기준으로 비교한 자료로 효과를 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "한 변화를 설명할 때 다른 원인이 함께 달라졌는지도 살펴요. 절약 방법을 바꾼 날 활동 인원까지 줄었다면 두 변화의 영향을 구별해야 해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내 실천에서 같게 할 조건과 비교할 사용량을 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w079",
     "no": 79,
     "form": "written",
     "topic": "실제 실천 기록",
     "prompt": "실제로 한 실천 한 가지의 날짜·행동·자료와 아직 못 한 점을 쓰세요. 아직 전이면 계획으로 쓰세요.",
     "answer": "실행했다면 날짜와 행동/실제 확인 자료를 적고 효과 미측정은 미측정으로 남겨요. 아직 전이면 계획과 확인 방법을 적어요.",
     "explanation": "계획한 일과 실제로 한 일, 효과를 직접 잰 것은 서로 달라요. 제공된 사진이나 연습용 숫자를 내 실천 결과로 적지 않아요.",
     "misconception": "실제 행동을 했다고 효과까지 측정한 것은 아니에요.",
     "criteria": "실행했다면 실제 날짜/행동/자료·효과 미측정과 다음 점검을 쓰고 미실행이면 계획/확인 방법으로 남긴다.",
     "lines": 8,
     "previousCriteria": "실제/계획 구별·날짜/행동·근거/미측정·다음 점검.",
     "standard": "6과08-03",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w080",
     "no": 80,
     "form": "written",
     "topic": "재생에너지 이용 조건 설명",
     "prompt": "친구가 “태양 에너지는 재생에너지니까 밤에도 태양 전지판으로 낮과 같은 양의 전기를 얻을 수 있어”라고 말했어요. 어떻게 설명해 줄까요?",
     "answer": "태양 에너지는 자연에서 보충되지만 태양 전지판은 받는 빛에 따라 전기를 얻는다. 밤에는 햇빛이 없으므로 낮과 같은 양을 계속 얻는다고 할 수 없다. 필요할 때 전기를 쓰려면 저장이나 다른 공급 방법도 살펴야 한다.",
     "explanation": "재생에너지라는 분류와 어느 시간에 얼마나 이용할 수 있는지는 구별해요.",
     "misconception": "재생된다는 말을 모든 장소와 시간에서 같은 양을 얻는다는 뜻으로 읽지 않아요.",
     "criteria": "태양 전지판이 빛을 이용한다는 점과 밤낮의 이용 조건 차이를 설명한다.",
     "lines": 8,
     "previousCriteria": "전달/수신·수정/버전·재전달/계획·미수신 구별.",
     "standard": "6과08-03",
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
     "previous": "내 실천에서 같게 할 조건과 비교할 사용량을 써요.",
     "value": "실천할 때 같게 할 조건과 비교할 사용량을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 확인 91~92",
    "title": "풍력과 여러 재생에너지",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w091",
       "c22-s52-u04-w092"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "풍력은 바람의 에너지를 이용하여 전기를 얻어요."
     },
     {
      "title": "더 알아보기",
      "text": "바람은 위치와 높이, 시간에 따라 빠르기가 달라져요. 풍력 설비는 날개의 모습뿐 아니라 장기간의 바람 자료와 설치 장소를 함께 고려해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "바람개비 사진 외에 풍력 이용을 조사할 자료를 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w091",
     "no": 91,
     "form": "blank",
     "topic": "풍력 평가",
     "prompt": "풍력 발전은 [ ]의 에너지를 이용해요.",
     "answer": "바람",
     "explanation": "풍력은 바람이 가진 에너지를 이용해요. 이용량은 바람과 장소/설비 조건에 따라 달라질 수 있어요.",
     "misconception": "바람 조건과 시간/설비가 항상 같지는 않아요.",
     "criteria": "풍력에서 이용하는 자연의 흐름인 바람을 넣는다.",
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-02",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w092",
     "no": 92,
     "form": "match",
     "topic": "재생에너지 평가",
     "prompt": "보기: ㄱ 수력 / ㄴ 지열 / ㄷ 바이오",
     "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
     "explanation": "물의 흐름이나 높이 차는 수력(ㄱ), 땅속의 열은 지열(ㄴ), 생물에서 얻은 물질은 바이오 에너지예요(ㄷ). 각각 어떤 설비와 조건이 필요한지도 알아보아요.",
     "misconception": "수력/지열/바이오를 이용하는 흐름으로 구별해요.",
     "criteria": "물의 흐름/높이 차=수력, 땅속 열=지열, 생물 유래 물질=바이오를 각 기호에 연결한다.",
     "parts": [
      "(1) 물의 흐름이나 높이 차 [ ]",
      "(2) 땅속의 열 [ ]",
      "(3) 생물에서 얻은 물질 등 [ ]"
     ],
     "answerPerPart": true,
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-02",
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
     "previous": "바람개비 사진 외에 풍력 이용을 조사할 자료를 써요.",
     "value": "풍력에서 이용하는 바람과 수력에서 이용하는 물의 흐름을 비교해 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 확인 94",
    "title": "재생에너지의 이용 그림",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w094"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "재생에너지원·설비·이용 조건을 그림과 이름표로 나타내요."
     },
     {
      "title": "더 알아보기",
      "text": "발전 장치는 에너지를 새로 만들어 내기보다 다른 형태의 에너지를 전기 에너지로 전환해요. 태양광·풍력·수력에서 처음 이용하는 에너지를 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "그림 화살표가 나타내는 에너지의 변화를 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w094",
     "no": 94,
     "form": "draw",
     "topic": "재생에너지 설명",
     "prompt": "재생에너지 한 종류를 골라 이용하는 흐름/자원과 설비, 확인할 조건을 이름표와 함께 그리세요.",
     "answer": "예: 태양광의 빛→태양 전지판, 가려짐/시간·설치 장소와 실제 측정 필요를 표시. 다른 종류도 타당하면 인정.",
     "explanation": "예를 들어 빛이 태양 전지판으로 전달되는 화살표와 이름표를 그려요. 빛이 가려지는지, 언제 어디에서 쓸지 살필 조건도 적어요. 실제 얻는 전기나 주변 영향은 자료를 확인한 뒤 설명해요.",
     "misconception": "그림은 실제 발전량/환경 영향의 측정 증거가 아니에요.",
     "criteria": "선택한 재생에너지의 흐름/자원→설비를 이름표로 그리고 장소/시간 등 이용 조건과 실제 확인 범위를 붙인다.",
     "drawing": "large",
     "previousCriteria": "자원/흐름·설비·이용 조건·확인 범위. 원리 세부 계산은 요구하지 않음.",
     "standard": "6과08-02",
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
     "previous": "그림 화살표가 나타내는 에너지의 변화를 써요.",
     "value": "내가 그린 설비가 어떤 자연의 에너지를 이용하며, 어떤 조건에서 이용할 수 있는지 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 확인 99~100",
    "title": "집 모형의 준비와 측정 시각",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w099",
       "c22-s52-u04-w100"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "안전하게 준비한 두 모형에서 같은 시각의 온도를 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "모형을 이용하면 실제 건물에서 따로 바꾸기 어려운 조건을 비교할 수 있어요. 다만 실제 건물의 크기·햇빛·환기·사용 습관을 모두 똑같이 재현하는 것은 아니에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "모형에서 확인한 것과 실제 건물에서 더 확인할 것을 나누어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w099",
     "no": 99,
     "form": "choice",
     "topic": "안전 평가",
     "prompt": "집 모형 탐구를 준비하는 방법으로 알맞은 것은?",
     "answer": "② 교사가 안전을 확인한 재료와 준비 조건을 쓴다.",
     "explanation": "교사 준비 재료와 안전한 조건으로 모형을 비교해요. 학생 가열/뜨거운 물·불꽃/절단·실제 설비 변경은 활동에 포함하지 않아요.",
     "misconception": "교사 준비 조건과 학생 가열/절단·설비 변경을 구별해요.",
     "criteria": "교사가 안전을 확인한 재료와 준비 조건을 사용하는 방법을 고른다.",
     "choices": [
      "학생이 직접 불꽃으로 두 모형을 계속 가열한다.",
      "교사가 안전을 확인한 재료와 준비 조건을 쓴다.",
      "학생이 뜨거운 물을 만들어 모형 안에 붓는다.",
      "실제 환기구를 막고 전기 배선을 직접 바꾼다.",
      "교사 없이 날카로운 칼로 벽을 새로 잘라 낸다."
     ],
     "key": 1,
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w100",
     "no": 100,
     "form": "blank",
     "topic": "반복 평가",
     "prompt": "같은 시험을 되풀이할 때 처음 값·주변 조건·감지 위치와 측정 [ ]을 매번 확인해요.",
     "answer": "시점",
     "explanation": "같은 시험을 해도 도구가 움직이거나 문이 열렸다면 조건이 달라져요. 처음 값과 같은 시각의 실제 온도를 적고, 잘못 읽었거나 못 잰 점도 따로 남겨요.",
     "misconception": "반복만으로 조건 차이/도구 오류가 해결되지는 않아요.",
     "criteria": "반복할 때 처음/주위·감지 위치와 함께 확인할 측정 시점을 넣는다.",
     "accepted": [
      "시간",
      "시각"
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
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
     "previous": "모형에서 확인한 것과 실제 건물에서 더 확인할 것을 나누어요.",
     "value": "안전한 준비 방법과 같은 시각에 온도를 재어야 하는 까닭을 정리해요."
    }
   ]
  },
  {
   "previous": {
    "section": "집 모형과 비교 43~44",
    "title": "집 모형의 비교 조건",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w043",
       "c22-s52-u04-w044"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "달리할 창 구조와 같게 할 조건, 측정할 값을 정해요."
     },
     {
      "title": "더 알아보기",
      "text": "공정한 비교에서는 알아보려는 원인 외의 조건이 결과에 미치는 영향을 줄여요. 비교 조건을 맞춘 모형실험은 실제 건물을 이해하는 데 도움이 돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "바꿀 조건·같게 할 조건·잴 값을 한 가지씩 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w043",
     "no": 43,
     "form": "match",
     "topic": "비교의 역할",
     "prompt": "보기: ㄱ 달리할 조건 / ㄴ 같게 할 조건 / ㄷ 측정할 자료",
     "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
     "explanation": "바꿀 것은 창 구조예요(ㄱ). 모형 크기와 처음 온도, 주위 조건은 같게 해요(ㄴ). 같은 시각의 내부 온도를 실제로 재어 비교해요(ㄷ).",
     "misconception": "달리할 조건·통제할 조건·측정할 값을 나눠요.",
     "criteria": "한 겹/두 겹 창=달리할 조건, 크기/처음/주위=통제, 같은 시점 내부 온도=측정 자료를 연결한다.",
     "parts": [
      "(1) 한 겹 창과 두 겹 창 [ ]",
      "(2) 모형 크기·처음 온도·주변 조건 [ ]",
      "(3) 같은 시점의 내부 온도 [ ]"
     ],
     "answerPerPart": true,
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w044",
     "no": 44,
     "form": "multi",
     "topic": "안전한 준비",
     "prompt": "집 모형 활동의 준비로 알맞은 것을 모두 고르세요.",
     "answer": "①, ②, ④",
     "explanation": "교사가 준비한 모형/안전 조건과 측정 도구로 비교해요. 학생 가열·불꽃/뜨거운 물·날카로운 절단·실제 설비 변경은 하지 않아요.",
     "misconception": "모형 준비와 실제 건물/전기 설비 변경은 달라요.",
     "criteria": "교사 준비 재료·안전한 조건·감지 위치/도구 고정과 사용 방법의 세 보기를 모두 고른다.",
     "choices": [
      "교사가 미리 자른 안전한 재료를 제공한다.",
      "교사가 안전을 확인한 준비 조건을 사용한다.",
      "학생이 불꽃과 뜨거운 물로 집을 직접 데운다.",
      "감지 위치와 도구를 고정하고 사용법을 확인한다.",
      "실제 교실의 환기구와 전기 배선을 바꾼다."
     ],
     "key": [
      0,
      1,
      3
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "공정한 비교에서는 알아보려는 원인 외의 조건이 결과에 미치는 영향을 줄여요. 비교 조건을 맞춘 모형실험은 실제 건물을 이해하는 데 도움이 돼요.",
     "value": "단열 성능을 더 자세히 비교할 때에는 열이 통과하기 어려운 정도를 수로 나타내요. 이를 열저항이라고 하며, 같은 조건에서 이 값이 클수록 열이 덜 전달돼요."
    }
   ]
  },
  {
   "previous": {
    "section": "처음 값·반복·미측정",
    "title": "다르게 나온 값도 함께 살펴 다시 비교해요",
    "blocks": [
     {
      "type": "example",
      "question": "처음 온도가 A 16℃, B 17℃였고 나중에는 모두 20℃였어요. 바로 구조의 효과라고 할까요?",
      "steps": [
       [
        "처음 조건 읽기",
        "A와 B의 처음 온도가 달랐어요."
       ],
       [
        "다시 비교하기",
        "처음 온도와 주위 온도, 감지 위치와 시각을 맞추어 다시 살펴요."
       ]
      ],
      "answer": "변화량을 계산하는 일만으로 다른 조건이 같아지지는 않아요. 달랐던 조건을 함께 설명해요."
     },
     {
      "type": "text",
      "text": "정한 시각에 재지 못했다면 그 까닭을 적어요. 0℃나 예상한 값으로 채우지 않아요. 여러 번의 결과가 다르거나 차이가 작으면 조건을 다시 살펴요."
     },
     {
      "type": "table",
      "heads": [
       "확인할 내용",
       "살펴볼 것"
      ],
      "rows": [
       [
        "감지 부분·문·틈·놓인 자리",
        "처음 기록과 달라진 조건이 있나요?"
       ],
       [
        "같은 조건으로 반복",
        "각 실험의 처음 온도와 주위 온도, 측정 시각이 같나요?"
       ],
       [
        "결과가 분명하지 않을 때",
        "다시 알아볼 조건과 측정 방법은 무엇인가요?"
       ]
      ]
     },
     {
      "type": "field",
      "title": "다시 비교할 조건",
      "hint": "결과가 다르게 나왔을 때 다시 살펴볼 조건을 적어요.",
      "lines": 8,
      "draw": false
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "처음 값이나 측정 조건이 다르면 그 차이도 함께 살펴요."
     },
     {
      "title": "더 알아보기",
      "text": "반복 측정에서 값이 달라지는 정도를 살피면 결과의 일정함을 판단하는 데 도움이 돼요. 한 번의 값만 고르기보다 전체 기록의 차이를 함께 설명해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "두 모형의 처음 온도가 다를 때 다시 맞출 조건을 써요.",
      "write": 5
     }
    ],
    "kind": "learn",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "반복 측정에서 값이 달라지는 정도를 살피면 결과의 일정함을 판단하는 데 도움이 돼요. 한 번의 값만 고르기보다 전체 기록의 차이를 함께 설명해요.",
     "value": "여러 번 잰 값이 서로 비슷한 것과 실제 온도에 가까운 것은 달라요. 눈금이 어긋난 온도계는 여러 번 재어도 비슷하게 틀린 값을 나타낼 수 있어요."
    }
   ]
  },
  {
   "previous": {
    "section": "탐구 설계와 실행 73~74",
    "title": "집 모형 비교의 순서와 기록",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w073",
       "c22-s52-u04-w074"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "계획하고 제작한 뒤 조건을 맞추어 측정하고 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "실험을 시작하기 전에는 온도계가 같은 대상과 범위를 재는지 확인해요. 기구의 차이가 재료나 구조의 차이처럼 보이지 않도록 하는 과정이에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "순서의 각 단계가 필요한 까닭을 설명해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w073",
     "no": 73,
     "form": "order",
     "topic": "실험의 흐름",
     "prompt": "집 모형 비교를 실행할 순서로 기호를 쓰세요.",
     "answer": "ㄴ, ㄹ, ㄷ, ㄱ",
     "explanation": "무엇을 비교할지 정하고(ㄴ), 선생님이 준비한 안전한 재료로 모형을 만들어요(ㄹ). 처음 온도와 감지 위치를 맞춘 뒤(ㄷ), 같은 시각의 온도를 반복해 적어요(ㄱ).",
     "misconception": "제작 전에 질문/조건을 정하고 측정 전 처음 조건을 확인해요.",
     "criteria": "질문/창 구조 정하기→안전한 제작→처음/주위/감지 확인→같은 시점 반복 기록의ㄴ→ㄹ→ㄷ→ㄱ 순서를 쓴다.",
     "given": [
      "ㄱ 같은 시점의 온도를 실제로 재어 반복 기록하기",
      "ㄴ 비교 질문과 달리할 창 구조 정하기",
      "ㄷ 처음/주변 조건과 감지 위치를 맞춰 확인하기",
      "ㄹ 교사와 안전을 확인하며 두 모형 제작하기"
     ],
     "accepted": [
      "ㄴ→ㄹ→ㄷ→ㄱ",
      "ㄴㄹㄷㄱ"
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w074",
     "no": 74,
     "form": "written",
     "topic": "반복 계획",
     "prompt": "같은 창 비교를 반복할 때 매번 기록할 조건과 값, 이상이 생겼을 때의 처리 방법을 쓰세요.",
     "answer": "시험할 때마다 처음 온도와 주위 온도, 감지 부분의 위치와 같은 시각의 내부 온도를 적는다. 문이 열렸거나 도구가 움직였다면 그 사실도 따로 남긴다.",
     "explanation": "다시 시험할 때에도 처음 온도와 주위 상태, 감지 위치와 시각을 확인해요. 조건이나 도구 위치가 달라졌다면 그 사실을 적어요. 반복했다는 이유만으로 조건 차이가 없어지는 것은 아니에요.",
     "misconception": "반복만으로 도구 오류와 조건 차이가 사라지지 않아요.",
     "criteria": "회차별 처음/주위·감지 위치·같은 시점의 실제 온도/단위를 남기고 문 열림/도구 이탈·미측정도 보존하는 방법을 쓴다.",
     "lines": 8,
     "previousCriteria": "회차/조건/시점·실제 값/단위·이상/미측정 보존 포함.",
     "standard": "6과08-03",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "실험을 시작하기 전에는 온도계가 같은 대상과 범위를 재는지 확인해요. 기구의 차이가 재료나 구조의 차이처럼 보이지 않도록 하는 과정이에요.",
     "value": "온도계를 더 정확하게 쓰려면 눈금이 잘 맞는 기준 온도계와 같은 대상의 온도를 재어 차이를 확인해요. 이런 비교로 기구의 눈금을 점검하는 것을 교정이라고 해요."
    }
   ]
  },
  {
   "previous": {
    "section": "탐구 설계와 실행 76~77",
    "title": "반복 결과와 실천 사례 나누기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u04-w076",
       "c22-s52-u04-w077"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "결과가 일정하지 않으면 비교 조건과 측정 방법을 다시 살펴요."
     },
     {
      "title": "더 알아보기",
      "text": "여러 번의 결과가 가까이 모이는지 넓게 퍼지는지 살피면 측정의 일정함을 볼 수 있어요. 값이 퍼진 이유를 찾는 일도 중요한 탐구예요."
     },
     {
      "title": "내가 정리할 것",
      "text": "추가로 확인할 감지 위치와 주변 조건을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "energy-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u04-w076",
     "no": 76,
     "form": "written",
     "topic": "탐구 결론",
     "prompt": "집 모형의 실제 온도 기록이 불분명하거나 반복마다 달랐어요. 결론을 어떻게 쓰고 무엇을 확인할까요?",
     "answer": "반복한 값이 다르거나 판단하기 어렵다고 적는다. 처음 온도와 감지 위치, 문과 틈, 재는 시각과 주위 상태를 다시 살펴볼 계획을 쓴다.",
     "explanation": "반복한 값이 달랐거나 직접 재지 못한 점을 그대로 남겨요. 원하는 값만 고르지 말고 감지 위치와 문이 열린 때 등 가능한 원인을 살펴요. 다음 시험에서 확인할 방법도 적어요.",
     "misconception": "원하는 결론에 맞게 값을 고르거나 처음 기록을 지우지 않아요.",
     "criteria": "불분명/반복 변동을 인정해 원자료를 보존하고 처음값·감지/문/틈·시점/주위를 점검할 다음 계획을 쓴다.",
     "lines": 8,
     "previousCriteria": "불분명/변동 인정·처음 기록 보존·조건 점검·다음 계획 포함.",
     "standard": "6과08-03",
     "origin": "previous112"
    },
    {
     "id": "c22-s52-u04-w077",
     "no": 77,
     "form": "order",
     "topic": "공유와 개선",
     "prompt": "생활 속 절약 방법을 실천하고 사례를 나눌 순서로 기호를 쓰세요.",
     "answer": "ㄴ, ㄱ, ㄷ, ㄹ",
     "explanation": "방법과 조건을 정하고 실천한 뒤 자료를 비교해요. 어떤 방법이 도움이 되었는지 다른 사람과 나누어요.",
     "misconception": "비교할 조건을 정하기 전에 효과를 단정하지 않아요.",
     "criteria": "계획 ㄴ→실천 ㄱ→비교 ㄷ→사례 공유 ㄹ의 순서를 쓴다.",
     "given": [
      "ㄱ 정한 기간 동안 실천하며 사용량을 기록하기",
      "ㄴ 절약할 방법과 비교할 조건을 정하기",
      "ㄷ 실천 전후 자료를 같은 기준으로 비교하기",
      "ㄹ 알아낸 점을 다른 사람과 공유하기"
     ],
     "accepted": [
      "ㄴ→ㄱ→ㄷ→ㄹ",
      "ㄴㄱㄷㄹ"
     ],
     "previousCriteria": "조건과 단위를 지키는 같은 뜻의 표현을 인정해요.",
     "standard": "6과08-03",
     "origin": "previous112"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      1,
      "text"
     ],
     "previous": "여러 번의 결과가 가까이 모이는지 넓게 퍼지는지 살피면 측정의 일정함을 볼 수 있어요. 값이 퍼진 이유를 찾는 일도 중요한 탐구예요.",
     "value": "자료를 더 깊이 살펴볼 때에는 평균뿐 아니라 값의 퍼진 정도도 비교해요. 평균이 같아도 값들이 가까이 모인 자료와 넓게 퍼진 자료는 서로 달라요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withEnergyContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s52-u04'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s52-u04-b009",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E1",
    "type": "T01",
    "format": "단답형",
    "level": "기본",
    "track": "교과",
    "standard": "6과08-01",
    "topic": "표본의 한계",
    "concept": "생활 물건·자원과 출처 조사",
    "inquirySkill": "단위/조건·자료 해석"
   },
   "prompt": "암석의 겉모습만 보고 그 안에 들어 있는 금속의 양을 정확히 알 수 있을까요? 알 수 있는지 없는지 쓰세요.",
   "givens": null,
   "choices": null,
   "figure": "assets/activities/c22-s52-u04/resources.webp",
   "figureNote": "물 용기·나무 조각·암석 표본과 금속 숟가락을 분리해 놓은 설명 장면.",
   "photoLabels": [
    "용기와 나무 조각",
    "아래쪽 암석 표본"
   ],
   "photoCredit": "AI 실사형 설명 이미지 · 실제 실험/측정/실천 사진 아님",
   "responseContract": "short-text",
   "answerContract": {
    "type": "short-text",
    "answer": "알 수 없다",
    "accepted": [
     "알 수 없다",
     "알 수 없어요",
     "알 수 없음"
    ]
   },
   "bookResponseForm": "short",
   "workbookRef": {
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w009",
    "no": 9
   },
   "explanation": "암석의 겉모습만으로 안에 들어 있는 금속의 양을 정확히 알 수는 없어요. 실제 암석을 검사한 자료가 더 필요해요.",
   "misconception": "겉모양만으로 광물 종류와 함량을 확정하지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   },
   "contentVersion": "20261106-energy-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s52-u04-b009",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과08-01",
      "topic": "표본의 한계",
      "concept": "생활 물건·자원과 출처 조사",
      "inquirySkill": "단위/조건·자료 해석"
     },
     "prompt": "사진 속 암석만 보고 금속 함량을 정확히 알 수 있을까요? 알 수 있는지 없는지 쓰세요.",
     "givens": null,
     "choices": null,
     "figure": "assets/activities/c22-s52-u04/resources.webp",
     "figureNote": "물 용기·나무 조각·암석 표본과 금속 숟가락을 분리해 놓은 설명 장면.",
     "photoLabels": [
      "용기와 나무 조각",
      "아래쪽 암석 표본"
     ],
     "photoCredit": "AI 실사형 설명 이미지 · 실제 실험/측정/실천 사진 아님",
     "responseContract": "short-text",
     "answerContract": {
      "type": "short-text",
      "answer": "알 수 없다",
      "accepted": [
       "알 수 없다",
       "알 수 없어요",
       "알 수 없음"
      ]
     },
     "bookResponseForm": "short",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w009",
      "no": 9
     },
     "explanation": "설명 사진의 겉모양만으로 광물 종류/금속 함량이 검증되지 않아요. 실제 시료의 출처와 검사 자료가 필요해요.",
     "misconception": "겉모양만으로 광물 종류와 함량을 확정하지 않아요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E1",
    "type": "T01",
    "format": "단답형",
    "level": "기본",
    "track": "교과",
    "standard": "6과08-01",
    "topic": "겉모습과 금속의 양",
    "concept": "생활 물건·자원과 출처 조사",
    "inquirySkill": "단위/조건·자료 해석"
   }
  }
 },
 {
  "previous": {
   "id": "c22-s52-u04-b010",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E1",
    "type": "T01",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과08-01",
    "topic": "생활 물건 조사",
    "concept": "생활 물건·자원과 출처 조사",
    "inquirySkill": "근거·한계 설명/실제 소통"
   },
   "prompt": "공책 한 권에 어떤 자원이 쓰이는지 조사할 계획을 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "종이의 원료와 표지/철심 재료를 구별하고 제조사/공식 자료에서 출처를 확인해요.",
    "rubric": {
     "required": [
      "공책의 종이/표지/철심 등 부분별 재료와 조사할 본문 출처를 정하고 확인한 내용/미확인을 나눈 계획을 쓴다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w010",
    "no": 10
   },
   "explanation": "종이와 표지, 철심처럼 공책의 부분마다 어떤 재료가 쓰이는지 살펴요. 만드는 데에는 물과 에너지도 필요할 수 있어요. 자료에서 확인한 내용과 아직 조사하지 않은 점을 나누어 적어요.",
   "misconception": "추정한 재료와 본문에서 확인한 재료를 나눠요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   },
   "contentVersion": "20261115-reviewed-answer-criteria",
   "previousVersions": [
    {
     "id": "c22-s52-u04-b010",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과08-01",
      "topic": "생활 물건 조사",
      "concept": "생활 물건·자원과 출처 조사",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "공책 한 권에 어떤 자원이 쓰이는지 조사할 계획을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "종이의 원료와 표지/철심 재료를 구별하고 제조사/공식 자료에서 출처를 확인해요.",
      "rubric": {
       "required": [
        "물건/재료·조사할 본문 출처·확인/미확인 구별 포함. 타당한 다른 생활 물건 인정."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w010",
      "no": 10
     },
     "explanation": "주재료를 찾아도 물·에너지·다른 재료까지 사용될 수 있어요. 자료 출처와 확인/미확인을 남기며 조사 전 추정을 사실로 쓰지 않아요.",
     "misconception": "추정한 재료와 본문에서 확인한 재료를 나눠요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "version": 1
    },
    {
     "id": "c22-s52-u04-b010",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과08-01",
      "topic": "생활 물건 조사",
      "concept": "생활 물건·자원과 출처 조사",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "공책 한 권에 어떤 자원이 쓰이는지 조사할 계획을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "종이의 원료와 표지/철심 재료를 구별하고 제조사/공식 자료에서 출처를 확인해요.",
      "rubric": {
       "required": [
        "물건/재료·조사할 본문 출처·확인/미확인 구별 포함. 타당한 다른 생활 물건 인정."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w010",
      "no": 10
     },
     "explanation": "종이와 표지, 철심처럼 공책의 부분마다 어떤 재료가 쓰이는지 살펴요. 만드는 데에는 물과 에너지도 필요할 수 있어요. 자료에서 확인한 내용과 아직 조사하지 않은 점을 나누어 적어요.",
     "misconception": "추정한 재료와 본문에서 확인한 재료를 나눠요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "contentVersion": "20261106-energy-readable-workbook",
     "previousVersions": [
      {
       "id": "c22-s52-u04-b010",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 자원과 에너지 독립 창작 교재",
        "course": "초등5-2"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 2,
        "unit": "u04",
        "area": "과학과 사회",
        "element": "E1",
        "type": "T01",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "6과08-01",
        "topic": "생활 물건 조사",
        "concept": "생활 물건·자원과 출처 조사",
        "inquirySkill": "근거·한계 설명/실제 소통"
       },
       "prompt": "공책 한 권에 어떤 자원이 쓰이는지 조사할 계획을 쓰세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "종이의 원료와 표지/철심 재료를 구별하고 제조사/공식 자료에서 출처를 확인해요.",
        "rubric": {
         "required": [
          "물건/재료·조사할 본문 출처·확인/미확인 구별 포함. 타당한 다른 생활 물건 인정."
         ],
         "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
         "note": "실제 수행/공식 성적은 별도 확인"
        }
       },
       "bookResponseForm": "written",
       "workbookRef": {
        "unit": "c22-s52-u04",
        "id": "c22-s52-u04-w010",
        "no": 10
       },
       "explanation": "주재료를 찾아도 물·에너지·다른 재료까지 사용될 수 있어요. 자료 출처와 확인/미확인을 남기며 조사 전 추정을 사실로 쓰지 않아요.",
       "misconception": "추정한 재료와 본문에서 확인한 재료를 나눠요.",
       "evidence": {
        "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
        "date": "2026-10-19",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
        "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
       },
       "version": 1
      }
     ],
     "version": "20261106-energy-readable-workbook",
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "종이의 원료와 표지/철심 재료를 구별하고 제조사/공식 자료에서 출처를 확인해요.",
    "rubric": {
     "required": [
      "공책의 종이·표지·철심 등 부분별 재료와 관련 자원을 알아볼 내용, 찾아볼 자료나 조사 방법을 담은 계획을 쓴다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s52-u04-b020",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E3",
    "type": "T07",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과08-01",
    "topic": "재활용의 조건",
    "concept": "줄이기·재사용·재활용과 처리 조건",
    "inquirySkill": "주장과 근거 비교"
   },
   "prompt": "분리배출을 결정할 때 확인할 것을 모두 고르세요.",
   "givens": null,
   "choices": [
    "지역/학교의 수거 안내",
    "물건의 재질과 오염 상태",
    "재활용 표시가 있으면 모든 곳에서 수거된다고 믿기",
    "안전하게 비우고 분리할 수 있는지",
    "깨진 날카로운 금속을 맨손으로 집기"
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
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w020",
    "no": 20
   },
   "explanation": "같은 재질도 지역/시설의 수거 조건과 오염 상태에 따라 처리 방법이 다를 수 있어요. 위험한 물건은 교사/보호자에게 알리고 직접 다루지 않아요.",
   "misconception": "같은 표시가 모든 지역의 수거를 보장하지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   }
  },
  "fields": {
   "prompt": "분리배출을 준비하는 알맞은 방법을 모두 고르세요.",
   "choices": [
    "학교나 지역의 수거 안내를 확인한다.",
    "물건의 재질과 오염 상태를 살핀다.",
    "재활용 표시가 있으면 어느 곳에서나 같은 통에 넣는다.",
    "안전하게 비우고 분리할 수 있는지 확인한다.",
    "깨진 날카로운 금속을 맨손으로 집는다."
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s52-u04-b032",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E5",
    "type": "T04",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과08-02",
    "topic": "입지와 영향",
    "concept": "수력·해양·지열·바이오와 지속가능성",
    "inquirySkill": "주장과 근거 비교"
   },
   "prompt": "재생에너지 이용 방법을 조사할 때 확인할 것을 모두 고르세요.",
   "givens": null,
   "choices": [
    "장소에서 이용할 수 있는 자연 조건",
    "필요한 설비와 재료",
    "주변 생물과 사람에게 미치는 영향",
    "재생이라는 말만 있으면 무조건 영향0으로 결론",
    "자료의 작성 시점과 지역"
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
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w032",
    "no": 32
   },
   "explanation": "이용 가능성과 설비·주변 영향·출처의 지역/시점을 함께 봐요. 재생 가능은 모든 영향이0이라는 뜻이 아니에요.",
   "misconception": "자연 조건만 보고 설비와 주변 영향을 생략하지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   }
  },
  "fields": {
   "prompt": "재생에너지 이용 방법을 조사하는 알맞은 방법을 모두 고르세요.",
   "choices": [
    "그 장소에서 이용할 수 있는 자연 조건을 알아본다.",
    "필요한 설비와 재료를 조사한다.",
    "주변 생물과 사람에게 미치는 영향을 살핀다.",
    "재생에너지라는 이름만 보고 환경 영향이 없다고 정한다.",
    "자료가 작성된 시점과 지역을 확인한다."
   ],
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E5",
    "type": "T04",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과08-02",
    "topic": "이용할 장소와 주변 영향",
    "concept": "수력·해양·지열·바이오와 지속가능성",
    "inquirySkill": "주장과 근거 비교"
   }
  }
 },
 {
  "previous": {
   "id": "c22-s52-u04-b067",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E8",
    "type": "T08",
    "format": "선택형",
    "level": "심화",
    "track": "교과",
    "standard": "6과08-03",
    "topic": "실천 자료 비교",
    "concept": "실제 실천·자료 제작/전달·의견 반영",
    "inquirySkill": "주장과 근거 비교"
   },
   "prompt": "두 반의 종이 사용량을 비교하기 위해 확인할 것을 모두 고르세요.",
   "givens": null,
   "choices": [
    "인원과 활동의 양",
    "종이의 크기와 세는 방법",
    "기록한 날짜/기간",
    "활동과 사람 수가 달라도 사용량만으로 방법의 효과를 정함",
    "실제 사용량과 미기록의 구별"
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
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w067",
    "no": 67
   },
   "explanation": "두 반의 사람 수와 활동의 양, 종이 크기와 기록 기간을 맞춰요. 서로 다른 조건에서 쓴 장수만으로 방법의 효과를 정하지 않아요. 기록하지 못한 양을 0으로 채우지도 않아요.",
   "misconception": "인원/활동·기간/종이 크기가 다르면 양만 비교하지 않아요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   },
   "contentVersion": "20261106-energy-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s52-u04-b067",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E8",
      "type": "T08",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과08-03",
      "topic": "실천 자료 비교",
      "concept": "실제 실천·자료 제작/전달·의견 반영",
      "inquirySkill": "주장과 근거 비교"
     },
     "prompt": "두 반의 종이 사용량을 비교하기 위해 확인할 것을 모두 고르세요.",
     "givens": null,
     "choices": [
      "인원과 활동의 양",
      "종이의 크기와 세는 방법",
      "기록한 날짜/기간",
      "많이 쓴 반은 언제나 나쁘다고 미리 단정",
      "실제 사용량과 미기록의 구별"
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
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w067",
      "no": 67
     },
     "explanation": "기능/활동과 인원·단위/기간을 맞춰야 공정하게 비교할 수 있어요. 맥락 없이 양만으로 사람을 평가하거나 결측을0으로 쓰지 않아요.",
     "misconception": "인원/활동·기간/종이 크기가 다르면 양만 비교하지 않아요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "두 반의 종이 사용량을 비교하려고 해요. 알맞은 방법을 모두 고르세요.",
   "choices": [
    "인원과 활동의 양을 확인한다.",
    "종이의 크기와 장수를 세는 방법을 확인한다.",
    "기록한 날짜와 기간을 확인한다.",
    "활동과 인원이 달라도 사용량만으로 절약 방법의 효과를 정한다.",
    "실제로 쓴 양과 기록하지 못한 양을 구별한다."
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s52-u04-b069",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E1",
    "type": "T01",
    "format": "서술형",
    "level": "심화",
    "track": "교과",
    "standard": "6과08-01",
    "topic": "자원 조사 계획",
    "concept": "생활 물건·자원과 출처 조사",
    "inquirySkill": "근거·한계 설명/실제 소통"
   },
   "prompt": "생활 물건 하나를 정해 자원의 출처와 사용 후 처리 방법을 조사할 계획을 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "물건의 각 부분이 어떤 재료인지 알아보고, 실제로 읽은 자료의 제목과 만든 곳, 날짜와 지역을 적는다. 재사용 방법과 수거 안내를 확인하고 아직 모르는 점을 나누어 쓴다.",
    "rubric": {
     "required": [
      "물건/재료·출처/작성 시점·지역 처리 안내를 조사할 질문과 연결하고 재사용/수거의 확인/미확인을 나눈 계획을 쓴다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w069",
    "no": 69
   },
   "explanation": "물건의 각 부분이 어떤 재료인지 알아보아요. 실제로 읽은 자료의 제목과 만든 곳, 날짜와 지역을 적고 그곳의 수거 안내를 살펴요. 아직 모르는 점은 조사할 내용으로 남겨요.",
   "misconception": "본문 조사와 검색 목록만 본 상태를 나눠요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   },
   "contentVersion": "20261115-reviewed-answer-criteria",
   "previousVersions": [
    {
     "id": "c22-s52-u04-b069",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과08-01",
      "topic": "자원 조사 계획",
      "concept": "생활 물건·자원과 출처 조사",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "생활 물건 하나를 정해 자원의 출처와 사용 후 처리 방법을 조사할 계획을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "물건·재료를 나누고 본문 출처/작성 시점·지역을 적어 재사용/수거 기준과 미확인을 남겨요.",
      "rubric": {
       "required": [
        "대상/질문·본문 출처·재료/처리 기준·확인/미확인 포함."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w069",
      "no": 69
     },
     "explanation": "검색 제목만으로 본문을 읽었다고 하지 않아요. 물건의 재료와 처리 조건을 근거에서 확인해야 해요.",
     "misconception": "본문 조사와 검색 목록만 본 상태를 나눠요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "version": 1
    },
    {
     "id": "c22-s52-u04-b069",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과08-01",
      "topic": "자원 조사 계획",
      "concept": "생활 물건·자원과 출처 조사",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "생활 물건 하나를 정해 자원의 출처와 사용 후 처리 방법을 조사할 계획을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "물건의 각 부분이 어떤 재료인지 알아보고, 실제로 읽은 자료의 제목과 만든 곳, 날짜와 지역을 적는다. 재사용 방법과 수거 안내를 확인하고 아직 모르는 점을 나누어 쓴다.",
      "rubric": {
       "required": [
        "대상/질문·본문 출처·재료/처리 기준·확인/미확인 포함."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w069",
      "no": 69
     },
     "explanation": "물건의 각 부분이 어떤 재료인지 알아보아요. 실제로 읽은 자료의 제목과 만든 곳, 날짜와 지역을 적고 그곳의 수거 안내를 살펴요. 아직 모르는 점은 조사할 내용으로 남겨요.",
     "misconception": "본문 조사와 검색 목록만 본 상태를 나눠요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "contentVersion": "20261106-energy-readable-workbook",
     "previousVersions": [
      {
       "id": "c22-s52-u04-b069",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 자원과 에너지 독립 창작 교재",
        "course": "초등5-2"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 2,
        "unit": "u04",
        "area": "과학과 사회",
        "element": "E1",
        "type": "T01",
        "format": "서술형",
        "level": "심화",
        "track": "교과",
        "standard": "6과08-01",
        "topic": "자원 조사 계획",
        "concept": "생활 물건·자원과 출처 조사",
        "inquirySkill": "근거·한계 설명/실제 소통"
       },
       "prompt": "생활 물건 하나를 정해 자원의 출처와 사용 후 처리 방법을 조사할 계획을 쓰세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "물건·재료를 나누고 본문 출처/작성 시점·지역을 적어 재사용/수거 기준과 미확인을 남겨요.",
        "rubric": {
         "required": [
          "대상/질문·본문 출처·재료/처리 기준·확인/미확인 포함."
         ],
         "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
         "note": "실제 수행/공식 성적은 별도 확인"
        }
       },
       "bookResponseForm": "written",
       "workbookRef": {
        "unit": "c22-s52-u04",
        "id": "c22-s52-u04-w069",
        "no": 69
       },
       "explanation": "검색 제목만으로 본문을 읽었다고 하지 않아요. 물건의 재료와 처리 조건을 근거에서 확인해야 해요.",
       "misconception": "본문 조사와 검색 목록만 본 상태를 나눠요.",
       "evidence": {
        "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
        "date": "2026-10-19",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
        "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
       },
       "version": 1
      }
     ],
     "version": "20261106-energy-readable-workbook",
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "물건의 각 부분이 어떤 재료인지 알아보고, 실제로 읽은 자료의 제목과 만든 곳, 날짜와 지역을 적는다. 재사용 방법과 수거 안내를 확인하고 아직 모르는 점을 나누어 쓴다.",
    "rubric": {
     "required": [
      "물건 하나를 정하고 부분별 재료와 자원의 출처, 사용 후 처리 방법을 어떤 자료나 방법으로 조사할지 계획한다. 재사용이나 분리배출에 관한 타당한 조사 질문도 인정한다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s52-u04-b078",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E8",
    "type": "T08",
    "format": "서술형",
    "level": "심화",
    "track": "영재성",
    "standard": "6과08-03",
    "topic": "실천 안내 카드",
    "concept": "실제 실천·자료 제작/전달·의견 반영",
    "inquirySkill": "자원 관계/자료/장치 설계"
   },
   "prompt": "실천 행동·이유·확인 방법을 담은 안내 카드 초안을 그리세요. 미측정 값은 넣지 마세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "필요한 만큼 종이 쓰기/물건 다시 쓰기 등 구체 행동, 자원 이용의 한계, 날짜/기록 항목과 필요한 안전/지역 조건 표시.",
    "rubric": {
     "required": [
      "구체적인 실천 행동과 타당한 이유·확인 방법이 카드에 드러나게 그린다. 초안임을 표시하고 직접 재지 않은 수치를 관찰값으로 넣지 않는다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   },
   "bookResponseForm": "draw",
   "workbookRef": {
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w078",
    "no": 78
   },
   "explanation": "안내 자료의 설계와 실제 전달은 달라요. 근거 없는 절감률이나 아직 받지 않은 의견을 넣지 않아요.",
   "misconception": "초안/제작과 실제 전달은 달라요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   },
   "contentVersion": "20261115-reviewed-answer-criteria",
   "previousVersions": [
    {
     "id": "c22-s52-u04-b078",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E8",
      "type": "T08",
      "format": "서술형",
      "level": "심화",
      "track": "영재성",
      "standard": "6과08-03",
      "topic": "실천 안내 카드",
      "concept": "실제 실천·자료 제작/전달·의견 반영",
      "inquirySkill": "자원 관계/자료/장치 설계"
     },
     "prompt": "실천 행동·이유·확인 방법을 담은 안내 카드 초안을 그리세요. 미측정 값은 넣지 마세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "필요한 만큼 종이 쓰기/물건 다시 쓰기 등 구체 행동, 자원 이용의 한계, 날짜/기록 항목과 필요한 안전/지역 조건 표시.",
      "rubric": {
       "required": [
        "구체 행동·과학적 이유·확인/미확인·읽을 사람 고려. 초안/실제 제작 구별."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "draw",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w078",
      "no": 78
     },
     "explanation": "안내 자료의 설계와 실제 전달은 달라요. 근거 없는 절감률이나 아직 받지 않은 의견을 넣지 않아요.",
     "misconception": "초안/제작과 실제 전달은 달라요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "version": 1,
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "필요한 만큼 종이 쓰기/물건 다시 쓰기 등 구체 행동, 자원 이용의 한계, 날짜/기록 항목과 필요한 안전/지역 조건 표시.",
    "rubric": {
     "required": [
      "구체적인 실천 행동과 타당한 이유·확인 방법이 카드에 드러나게 그린다. 직접 재지 않은 수치를 관찰값으로 넣지 않는다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s52-u04-b079",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 자원과 에너지 독립 창작 교재",
    "course": "초등5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E8",
    "type": "T08",
    "format": "서술형",
    "level": "심화",
    "track": "교과",
    "standard": "6과08-03",
    "topic": "실제 실천 기록",
    "concept": "실제 실천·자료 제작/전달·의견 반영",
    "inquirySkill": "근거·한계 설명/실제 소통"
   },
   "prompt": "실제로 한 실천 한 가지의 날짜·행동·자료와 아직 못 한 점을 쓰세요. 아직 전이면 계획으로 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "실행했다면 날짜와 행동/실제 확인 자료를 적고 효과 미측정은 미측정으로 남겨요. 아직 전이면 계획과 확인 방법을 적어요.",
    "rubric": {
     "required": [
      "실행했다면 실제 날짜/행동/자료·효과 미측정과 다음 점검을 쓰고 미실행이면 계획/확인 방법으로 남긴다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s52-u04",
    "id": "c22-s52-u04-w079",
    "no": 79
   },
   "explanation": "계획한 일과 실제로 한 일, 효과를 직접 잰 것은 서로 달라요. 제공된 사진이나 연습용 숫자를 내 실천 결과로 적지 않아요.",
   "misconception": "실제 행동을 했다고 효과까지 측정한 것은 아니에요.",
   "evidence": {
    "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
    "date": "2026-10-19",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
    "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
   },
   "contentVersion": "20261115-reviewed-answer-criteria",
   "previousVersions": [
    {
     "id": "c22-s52-u04-b079",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E8",
      "type": "T08",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과08-03",
      "topic": "실제 실천 기록",
      "concept": "실제 실천·자료 제작/전달·의견 반영",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "실제로 한 실천 한 가지의 날짜·행동·자료와 아직 못 한 점을 쓰세요. 아직 전이면 계획으로 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "실행했다면 날짜와 행동/실제 확인 자료를 적고 효과 미측정은 미측정으로 남겨요. 아직 전이면 계획과 확인 방법을 적어요.",
      "rubric": {
       "required": [
        "실제/계획 구별·날짜/행동·근거/미측정·다음 점검."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w079",
      "no": 79
     },
     "explanation": "계획과 실제 행동, 효과의 실제 측정은 서로 달라요. AI 사진/가상 값을 수행 근거로 채우지 않아요.",
     "misconception": "실제 행동을 했다고 효과까지 측정한 것은 아니에요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "version": 1
    },
    {
     "id": "c22-s52-u04-b079",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E8",
      "type": "T08",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과08-03",
      "topic": "실제 실천 기록",
      "concept": "실제 실천·자료 제작/전달·의견 반영",
      "inquirySkill": "근거·한계 설명/실제 소통"
     },
     "prompt": "실제로 한 실천 한 가지의 날짜·행동·자료와 아직 못 한 점을 쓰세요. 아직 전이면 계획으로 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "실행했다면 날짜와 행동/실제 확인 자료를 적고 효과 미측정은 미측정으로 남겨요. 아직 전이면 계획과 확인 방법을 적어요.",
      "rubric": {
       "required": [
        "실제/계획 구별·날짜/행동·근거/미측정·다음 점검."
       ],
       "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
       "note": "실제 수행/공식 성적은 별도 확인"
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w079",
      "no": 79
     },
     "explanation": "계획한 일과 실제로 한 일, 효과를 직접 잰 것은 서로 달라요. 제공된 사진이나 연습용 숫자를 내 실천 결과로 적지 않아요.",
     "misconception": "실제 행동을 했다고 효과까지 측정한 것은 아니에요.",
     "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-19",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
     },
     "contentVersion": "20261106-energy-readable-workbook",
     "previousVersions": [
      {
       "id": "c22-s52-u04-b079",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 자원과 에너지 독립 창작 교재",
        "course": "초등5-2"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 2,
        "unit": "u04",
        "area": "과학과 사회",
        "element": "E8",
        "type": "T08",
        "format": "서술형",
        "level": "심화",
        "track": "교과",
        "standard": "6과08-03",
        "topic": "실제 실천 기록",
        "concept": "실제 실천·자료 제작/전달·의견 반영",
        "inquirySkill": "근거·한계 설명/실제 소통"
       },
       "prompt": "실제로 한 실천 한 가지의 날짜·행동·자료와 아직 못 한 점을 쓰세요. 아직 전이면 계획으로 쓰세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "실행했다면 날짜와 행동/실제 확인 자료를 적고 효과 미측정은 미측정으로 남겨요. 아직 전이면 계획과 확인 방법을 적어요.",
        "rubric": {
         "required": [
          "실제/계획 구별·날짜/행동·근거/미측정·다음 점검."
         ],
         "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
         "note": "실제 수행/공식 성적은 별도 확인"
        }
       },
       "bookResponseForm": "written",
       "workbookRef": {
        "unit": "c22-s52-u04",
        "id": "c22-s52-u04-w079",
        "no": 79
       },
       "explanation": "계획과 실제 행동, 효과의 실제 측정은 서로 달라요. AI 사진/가상 값을 수행 근거로 채우지 않아요.",
       "misconception": "실제 행동을 했다고 효과까지 측정한 것은 아니에요.",
       "evidence": {
        "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
        "date": "2026-10-19",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교육부6과08·이론622 PDF8·2009지도 조사/비교/기록 원칙·EIA/EPA/DOE/한국에너지공단 본문",
        "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 측정/학생 수행 아님."
       },
       "version": 1
      }
     ],
     "version": "20261106-energy-readable-workbook",
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "실행했다면 날짜와 행동/실제 확인 자료를 적고 효과 미측정은 미측정으로 남겨요. 아직 전이면 계획과 확인 방법을 적어요.",
    "rubric": {
     "required": [
      "실천했다면 날짜·행동·실제로 확인한 자료와 아직 못 한 점을 쓰고, 실천 전이면 계획으로 쓴다. 효과를 재지 못했다면 실제 값으로 꾸며 넣지 않는다."
     ],
     "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
     "note": "실제 수행/공식 성적은 별도 확인"
    }
   }
  }
 }
];
const bankCache=new WeakMap();
export function energyContextItems(rows,unit){
 if(unit!=='c22-s52-u04'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:ENERGY_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withEnergyContextClassroom(unit,book){
 const rows=energyContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
