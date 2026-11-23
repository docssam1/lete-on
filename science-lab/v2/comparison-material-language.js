export const COMPARISON_MATERIAL_LANGUAGE_VERSION='20261108-comparison-material-language';
const wording={
"career-compare:current": {
  "prior": {
   "label": "현재 문제를 알아볼 자료",
   "heads": [
    "자료",
    "작성 주체와 날짜",
    "대상·방법"
   ],
   "rows": [
    [
     "ㄱ",
     "가상 시 자료팀·2025년",
     "같은 관측소·같은 기준으로 센 여름 일수"
    ],
    [
     "ㄴ",
     "작성자·날짜 미상",
     "지역과 방법 없음"
    ],
    [
     "ㄷ",
     "가상 학교 조사팀·2026년",
     "교내 세 장소·같은 시각에 같은 온도계로 비교"
    ],
    [
     "ㄹ",
     "가상 기기 회사·2026년",
     "광고 문구만 있고 측정 방법 없음"
    ]
   ],
   "conditions": "교재의 가상 자료 카드예요. 같은 관측소의 지난여름 변화를 알아볼 자료를 찾는 상황이에요.",
   "question": "질문에 가장 알맞은 자료는 무엇일까요?",
   "options": {
    "station": "ㄱ은 같은 관측소에서 같은 기준으로 센 기록이다",
    "newest": "방법이 없어도 가장 최근 광고를 고른다",
    "anywhere": "다른 장소의 조사라면 무엇이든 그대로 비교한다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "ㄱ은 묻는 관측소와 조사 방법에 맞는 기록이에요. ㄷ은 교내 장소 비교로 조사 대상이 달라요. 자료를 만든 시기뿐 아니라 조사한 장소와 기간, 방법을 함께 살펴요."
  },
  "display": {
   "conditions": "같은 관측소의 지난여름 변화를 알아보는 예시예요. 자료를 만든 사람과 조사 방법을 살펴보아요.",
   "rows": [
    [
     "ㄱ",
     "시청의 자료(예시, 2025년)",
     "같은 관측소·같은 기준으로 센 여름 일수"
    ],
    [
     "ㄴ",
     "작성자·날짜 미상",
     "지역과 방법 없음"
    ],
    [
     "ㄷ",
     "학교 조사 자료(예시, 2026년)",
     "교내 세 장소·같은 시각에 같은 온도계로 비교"
    ],
    [
     "ㄹ",
     "기기 회사의 홍보 자료(예시, 2026년)",
     "광고 문구만 있고 측정 방법 없음"
    ]
   ]
  }
 },
 "career-compare:forecast": {
  "prior": {
   "label": "가정에 따른 미래 예상",
   "heads": [
    "경로",
    "가정",
    "미래 기간의 모형값"
   ],
   "rows": [
    [
     "ㄱ",
     "배출이 줄어드는 가정",
     "18일"
    ],
    [
     "ㄴ",
     "배출이 계속 많은 가정",
     "26일"
    ]
   ],
   "conditions": "미래 기간을 예상한 가상 연습 자료예요. 실제 기후 전망값이 아니에요.",
   "question": "두 수치를 어떻게 읽을까요?",
   "options": {
    "condition": "가정이 다른 두 예상이며 차이는 8일이다",
    "observed": "미래에 이미 센 실제 관측 일수이다",
    "sum": "두 값을 더한 44일이 반드시 일어날 미래이다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "26일과 18일의 차이는 8일이에요. 배출에 관한 가정이 달라 예상도 달라졌어요. 미래를 이미 관측한 값이나 하나로 확정된 결과로 읽지 않아요."
  },
  "display": {
   "conditions": "가정에 따라 미래를 예상한 예시예요. 실제 기후 전망값은 아니에요."
  }
 },
 "career-compare:sensor": {
  "prior": {
   "label": "측정과 작동의 역할",
   "heads": [
    "기호",
    "장치가 한 일"
   ],
   "rows": [
    [
     "ㄱ",
     "흙의 수분 상태를 수치로 읽음"
    ],
    [
     "ㄴ",
     "설정 신호를 받아 물 밸브를 엶"
    ],
    [
     "ㄷ",
     "빛의 밝기를 표시값으로 읽음"
    ],
    [
     "ㄹ",
     "설정 신호를 받아 차양을 펼침"
    ]
   ],
   "conditions": "가상 장치가 하는 일을 적은 교재 연습 카드예요.",
   "question": "상태를 알아보는 것과 바꾸는 것을 어떻게 구별할까요?",
   "options": {
    "roles": "ㄱ·ㄷ은 측정하고, ㄴ·ㄹ은 신호에 따라 작동한다",
    "water": "수분 센서는 필요한 물을 직접 만든다",
    "same": "모든 식물에 같은 물을 주면 언제나 알맞다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "ㄱ은 흙의 수분, ㄷ은 빛의 밝기를 알아보아요. ㄴ은 물 밸브를 열고 ㄹ은 차양을 펼쳐요. 측정은 판단을 돕지만 식물과 환경을 살피고 장치를 관리하는 일도 필요해요."
  },
  "display": {
   "conditions": "측정 장치와 작동 장치가 하는 일을 정리한 예시예요."
  }
 },
 "career-compare:methods": {
  "prior": {
   "label": "해결 방법의 기능과 조건",
   "heads": [
    "방안",
    "설치 비용",
    "목표 기능 확인"
   ],
   "rows": [
    [
     "ㄱ",
     "8점",
     "있음"
    ],
    [
     "ㄴ",
     "11점",
     "있음"
    ],
    [
     "ㄷ",
     "6점",
     "없음"
    ]
   ],
   "conditions": "설치 비용을 점수로 나타낸 가상 연습 자료예요. 예산은 9점이며 실제 제품 가격이 아니에요.",
   "question": "예산 안에서 목표 기능을 확인한 방법은 무엇일까요?",
   "options": {
    "fit": "ㄱ은 8점이고 목표 기능도 확인했다",
    "cheapest": "ㄷ은 가장 싸므로 기능을 확인하지 않아도 된다",
    "expensive": "ㄴ은 11점이지만 예산 조건은 무시한다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "ㄱ은 9점 안에 들고 목표 기능도 확인했어요. ㄴ은 예산을 넘고 ㄷ은 기능을 확인하지 않았어요. 이 표로 고른 뒤에도 실제 이용할 전원과 설치 장소, 관리 방법 등을 살펴야 해요."
  },
  "display": {
   "conditions": "설치 비용을 점수로 나타낸 예시예요. 쓸 수 있는 비용은 9점이에요. 실제 제품 가격은 아니에요."
  }
 },
 "career-compare:photo": {
  "prior": {
   "label": "사진가의 촬영 조건",
   "figureKey": "camera",
   "heads": [
    "살펴볼 것",
    "관련된 과학"
   ],
   "rows": [
    [
     "밝기와 선명하게 보이는 부분",
     "빛을 받아들이는 조건과 초점"
    ],
    [
     "움직이는 모습이 흐릿하게 찍힘",
     "빛을 받아들이는 시간과 대상·카메라의 움직임"
    ]
   ],
   "conditions": "교재의 사진가 사례와 촬영 원리를 정리한 설명 카드예요. 실제 촬영 결과를 측정한 표는 아니에요.",
   "question": "움직임이 흐릿하게 찍힌 까닭을 알아볼 때 무엇을 살필까요?",
   "options": {
    "exposure": "빛을 받아들이는 시간과 대상·카메라의 움직임을 함께 살핀다",
    "brand": "카메라의 색이나 상표만 확인하면 충분하다",
    "always": "촬영 시간만 바꾸면 어떤 조건에서도 같은 사진이 나온다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "촬영하는 동안 대상이나 카메라가 움직이면 흐릿하게 나타날 수 있어요. 사진가는 빛을 받아들이는 시간뿐 아니라 빛의 양과 초점 등도 함께 살펴요. 자동 기능이 조건을 바꿀 수 있으므로 실제 사진에 사용한 조건을 확인해요."
  },
  "display": {
   "conditions": "사진가의 촬영 원리를 정리한 자료예요."
  }
 },
 "career-compare:sound": {
  "prior": {
   "label": "조율과 진동수 비교",
   "heads": [
    "시점",
    "첫 기록",
    "둘째 기록",
    "셋째 기록"
   ],
   "rows": [
    [
     "조정 전",
     "438 Hz",
     "442 Hz",
     "440 Hz"
    ],
    [
     "조정 뒤",
     "440 Hz",
     "440 Hz",
     "440 Hz"
    ]
   ],
   "conditions": "목표를 440Hz로 정한 교재의 가상 연습 자료예요. 실제로 악기를 조율한 결과는 아니에요.",
   "question": "목표와 같은 기록은 조정 전과 뒤에 몇 개일까요?",
   "options": {
    "count": "조정 전 1개, 뒤 3개이다",
    "loud": "더 큰 소리이면 음높이도 반드시 더 높다",
    "all": "같은 목표이면 모든 악기가 같은 구조이다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "조정 전에는 440Hz인 기록이 1개, 뒤에는 3개예요. Hz는 1초 동안의 진동 횟수예요. 소리의 크기와 높낮이를 구별하고, 어쿠스틱 피아노의 현 구조를 모든 전자 악기에 그대로 적용하지 않아요."
  },
  "display": {
   "conditions": "목표 진동수를 440 Hz로 정한 예시예요. 실제로 악기를 조율한 결과는 아니에요."
  }
 },
 "career-compare:shade": {
  "prior": {
   "label": "건축과 그늘의 효과",
   "heads": [
    "장소",
    "같은 시각에 잰 온도"
   ],
   "rows": [
    [
     "볕이 드는 곳",
     "35℃"
    ],
    [
     "그늘진 곳",
     "28℃"
    ]
   ],
   "conditions": "같은 시각에 같은 종류의 온도계로 비교했다고 가정한 교재 연습 자료예요. 실제 장소의 관측값은 아니에요.",
   "question": "이 표에서 알 수 있는 것은 무엇일까요?",
   "options": {
    "difference": "볕이 드는 곳은 35℃이고 두 곳의 차이는 7℃이다",
    "bill": "건물 전체의 냉방비도 반드시 7만큼 줄었다",
    "all": "어떤 날 어떤 건물이든 차이는 항상 7℃이다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "35℃와 28℃의 차이는 7℃예요. 제시한 두 장소와 시각의 비교이며 건물 전체의 냉방비나 모든 날의 효과를 측정한 것은 아니에요. 건축가는 빛과 열, 재료와 이용 조건을 함께 살펴볼 수 있어요."
  },
  "display": {
   "conditions": "같은 시각에 같은 종류의 온도계로 비교했다고 가정한 예시예요. 실제 장소에서 잰 값은 아니에요."
  }
 },
 "career-compare:jobs": {
  "prior": {
   "label": "다양한 직업에서 이용하는 과학",
   "heads": [
    "직업에서 하는 일",
    "관련된 과학"
   ],
   "rows": [
    [
     "사진가가 사진을 촬영함",
     "빛"
    ],
    [
     "조명 디자이너가 무대 밝기를 조절함",
     "빛"
    ],
    [
     "조율사가 악기의 음높이를 맞춤",
     "소리의 진동"
    ],
    [
     "음향 기사가 소리를 조절함",
     "소리의 진동"
    ],
    [
     "농부가 흙 수분을 관리함",
     "식물의 물 흡수"
    ]
   ],
   "conditions": "직업에서 하는 일과 관련된 과학을 연결한 교재 카드예요. 진로의 인기 순위나 직업 적성을 검사하는 자료는 아니에요.",
   "question": "빛과 소리를 이용하는 일은 각각 몇 가지일까요?",
   "options": {
    "variety": "빛 2가지, 소리의 진동 2가지이며 다른 직업에서도 과학을 찾을 수 있다",
    "only": "과학자 외의 직업에서는 과학을 이용하지 않는다",
    "decide": "지금 직업을 하나로 정해야만 관련된 과학을 배울 수 있다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "사진 촬영과 조명 조절은 빛, 조율과 음향 조절은 소리의 진동과 관련돼요. 농부의 물 관리도 식물과 환경에 관한 과학을 이용해요. 내가 관심 있는 다른 직업에서도 하는 일을 살펴 과학을 찾을 수 있어요."
  },
  "display": {
   "conditions": "직업에서 하는 일과 관련된 과학을 연결한 자료예요."
  }
 },
 "water-compare:tube": {
  "prior": {
   "label": "세 단계 높이·전체 무게",
   "question": "이 연습 자료에서 달라진 양은?",
   "heads": [
    "단계",
    "높이(cm)",
    "전체 무게(g)"
   ],
   "rows": [
    [
     "처음 물",
     "4.0",
     "32.5"
    ],
    [
     "다 언 얼음",
     "4.4",
     "32.5"
    ],
    [
     "다 녹은 물",
     "4.0",
     "32.5"
    ]
   ],
   "conditions": "같은 곧은 용기·마개·물,물의 출입 없음,겉 물기 제거를 전제한 교재 모형 값이에요. 높이 비율을 모든 실제 용기의 측정값으로 쓰지 않아요.",
   "options": {
    "height": "얼 때 높이는 늘고 녹은 뒤 처음으로 돌아오며 전체 무게는 같다",
    "both": "얼 때 높이와 전체 무게가 모두 늘었다",
    "mass": "높이는 같고 전체 무게만 달라졌다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "높이는4.0→4.4→4.0cm,같은 전체 무게는 모두32.5g이에요. 물기둥 높이로 부피의 변화를 비교하며 높이와 무게는 따로 읽어요."
  },
  "display": {
   "conditions": "같은 곧은 용기와 마개, 같은 물로 비교한 모형 값이에요. 물이 드나들지 않고 겉에 묻은 물기는 닦았다고 정했어요. 이 모형의 높이 비율을 다른 용기의 실제 값으로 그대로 쓰지는 않아요."
  }
 },
 "magnet-compare:design": {
  "prior": {
   "label": "종이를 잡는 장치 설계",
   "question": "장치의 설계를 설명할 때 무엇이 필요할까요?",
   "heads": [
    "생각할 것",
    "설계의 예"
   ],
   "rows": [
    [
     "목적",
     "종이를 쉽게 붙이고 꺼내기"
    ],
    [
     "힘이 작용하는 두 부분",
     "고정한 자석과 철 부분"
    ],
    [
     "사용 방법",
     "종이가 사이에 들어가도록 배치"
    ]
   ],
   "conditions": "가능한 설계 중 하나예요. 두 자석의 다른 극을 마주 놓는 등 다른 타당한 설계도 있어요.",
   "options": {
    "parts": "두 부분의 재료·배치·이용하는 자석의 성질과 고정 방법을 표시한다",
    "name": "상자에 자석이 있다는 문장만 쓴다",
    "must": "설계를 배우려면 반드시 실제 제작과 성공 시험까지 끝내야 한다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "자석의 어떤 성질을 이용하는지 그림에 나타내요. 설계한 것이 반드시 만들기로 이어져야 하는 것은 아니에요. 만들거나 시험하지 않았다면 확인할 방법을 제안해요."
  },
  "display": {
   "conditions": "장치를 만들기 전에 생각한 방법 중 하나예요. 두 자석의 서로 다른 극을 마주 놓는 등 같은 목적에 맞는 다른 방법도 있어요.",
   "reason": "자석의 어떤 성질을 이용하는지 그림에 나타내요. 그림으로 나타낸 생각과 직접 만들고 시험한 결과는 나누어 설명해요. 아직 만들거나 시험해 보지 않았다면 어떻게 확인할지 생각해 보아요."
  }
 },
 "ground-compare:practice": {
  "prior": {
   "label": "의견·수정 계획과 재연습",
   "question": "계단 입구가 붐볐다는 의견 뒤 아직 확인하지 못한 것은?",
   "heads": [
    "단계",
    "교재의 가상 상황"
   ],
   "rows": [
    [
     "첫 연습 뒤 의견",
     "계단 입구에서 친구가 몰렸다는 의견"
    ],
    [
     "수정 계획",
     "교사와 순서·도움 배치를 보완"
    ],
    [
     "다음에 할 일",
     "안전한 재연습 뒤 실제 효과 확인"
    ]
   ],
   "conditions": "교재 예제의 가상 의견이에요. 내가 실제로 받은 의견·고친 점·재연습 결과와 구별해요.",
   "options": {
    "next": "계획은 보완했지만 재연습 전에는 개선 효과를 확인했다고 하지 않는다",
    "done": "계획 그림을 고쳤으므로 실제 대처가 완벽해졌다고 한다",
    "invent": "재연습하지 않고 성공한 수치와 결과를 채운다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "첫 연습의 근거·받은 의견·수정 계획·실제 재연습을 나누어요. 실제로 다시 살핀 뒤 어려움과 효과를 확인하고 아직 못 한 일은 다음 계획으로 남겨요."
  },
  "display": {
   "label": "받은 의견과 고친 계획, 다시 연습하기",
   "rows": [
    [
     "첫 연습 뒤 의견",
     "계단 입구에서 친구가 몰렸다는 의견"
    ],
    [
     "고칠 계획",
     "선생님과 이동 순서와 도움받을 방법을 고칠 계획"
    ],
    [
     "다음에 할 일",
     "선생님과 안전하게 다시 연습한 뒤 무엇이 나아졌는지 살피기"
    ]
   ],
   "conditions": "교재의 예시로 만든 이야기예요. 직접 받은 의견과 고친 계획, 다시 연습해 본 결과는 따로 적어요.",
   "options": {
    "next": "계획은 고쳤지만 다시 연습하기 전에는 무엇이 나아졌는지 아직 모른다",
    "done": "계획 그림을 고쳤으니 실제 대처도 완벽해졌다고 한다",
    "invent": "다시 연습하지 않고 성공한 숫자와 결과를 채운다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "처음 연습에서 한 일, 받은 의견, 고친 계획, 다시 연습해 본 결과를 나누어 살펴요. 다시 해 본 뒤 나아진 점과 아직 어려운 점을 찾아요. 아직 해 보지 못한 일은 다음에 언제 할지 정해요."
  }
 },
 "combustion-compare:ecosystem": {
  "prior": {
   "label": "껍데기 생장의 가상 자료",
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
   "figureKey": "shells",
   "conditions": "14일 동안의 껍데기 생장을 비교하는 가상 모형 값이에요. NOAA의 실측값이나 우리 반 실험값이 아니며 사진도 피해 비교 사진이 아니에요.",
   "question": "이 자료로 어디까지 설명할 수 있을까요?",
   "options": {
    "scope": "이 가상 자료에서 B의 생장 길이가 A보다 0.9mm 작다",
    "real": "이 수치는 국내 모든 조개의 현재 피해 실측값이다",
    "all": "모든 바다 생물은 언제나 같은 크기의 피해를 받는다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "2.1−1.2=0.9mm로 이 가상 자료의 B에서 새로 자란 길이가 작아요. 실제 사례는 장소·시기·생물과 자료의 출처를 조사해 설명해요. 가상 값을 현실의 피해 수치로 바꾸지 않아요."
  },
  "display": {
   "label": "껍데기가 자란 길이의 예시 자료",
   "conditions": "14일 동안 껍데기가 얼마나 자랐는지 비교하도록 만든 모형 값이에요. NOAA의 실제 관측값이나 우리 반 실험값은 아니에요. 사진도 피해를 비교한 사진은 아니에요.",
   "options": {
    "scope": "이 예시 자료에서 B의 새로 자란 길이가 A보다 0.9mm 짧다",
    "real": "이 숫자는 우리나라 모든 조개의 지금 피해를 직접 잰 값이다",
    "all": "모든 바다 생물은 언제나 같은 크기의 피해를 받는다",
    "unknown": "아직 잘 모르겠다"
   }
  }
 }
};
const matches=(material,prior)=>!!material&&Object.keys(material).length===Object.keys(prior).length&&Object.entries(prior).every(([key,value])=>Object.hasOwn(material,key)&&JSON.stringify(material[key])===JSON.stringify(value));
export function learnerComparisonMaterial(kind,id,material){
 const key=kind+':'+id,entry=Object.hasOwn(wording,key)?wording[key]:undefined;
 return entry&&matches(material,entry.prior)?{...structuredClone(material),...structuredClone(entry.display)}:material;
}
export function learnerComparisonValues(kind,row,validate){
 if(row?.kind!==kind||typeof validate!=='function'||!validate(row))throw RangeError('확인이 필요한 비교 자료예요.');
 const material=learnerComparisonMaterial(kind,row.case,row.material);
 return [material.label,material.options[row.prediction],material.reason];
}
const priorPage={"id":"seacase","phase":"ecosystem","title":"연습 자료와 실제 피해 사례를 구별해요","text":["아래 수치는 껍데기 생장 비교를 연습하도록 만든 가상 자료예요. NOAA 글에 나온 실측값이 아니에요."],"kind":"think","standards":["6과14-04"],"caseId":"ecosystem"},priorCue="연습 자료와 실제 피해 사례를 구별해요. 아래 수치는 껍데기 생장 비교를 연습하도록 만든 가상 자료예요. NOAA 글에 나온 실측값이 아니에요.",newText="아래 숫자는 껍데기가 새로 자란 길이를 비교하도록 만든 예시 자료예요. NOAA 글에 나온 실제 관측값은 아니에요.";
export function withComparisonLearnerCues(mod){
 const chapter=mod?.chapter;
 if(chapter?.unit==='s41-u03'&&chapter.slideCues?.feedback==='받은 의견·수정 계획·실제 재연습 효과를 나누어요.')return {...mod,chapter:{...chapter,slideCues:{...chapter.slideCues,feedback:'받은 의견과 고친 계획, 다시 연습해 본 결과를 나누어 설명해요.'}}};
 if(chapter?.unit!=='c22-s62-u02'||!Array.isArray(chapter.combustionFlow))return mod;
 let changed=false;
 const flow=chapter.combustionFlow.map(page=>{if(page.id!=='seacase'||!matches(page,priorPage))return page;changed=true;return {...page,text:[newText,...page.text.slice(1)]};});
 if(!changed)return mod;
 const cues=chapter.slideCues?.seacase===priorCue?{...chapter.slideCues,seacase:priorPage.title+'. '+newText}:chapter.slideCues;
 return {...mod,chapter:{...chapter,combustionFlow:flow,slideCues:cues}};
}
